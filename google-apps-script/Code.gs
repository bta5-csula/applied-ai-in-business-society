const CONFIG = Object.freeze({
  sheetName: 'Sheet1',
  confirmationDelayMinutes: 20,
  clubEmail: 'appliedaicsula@gmail.com',
  senderName: 'AABS Membership Team',
  emailSubject: 'Thanks for your interest in AABS',
  linkedInUrl: 'https://www.linkedin.com/in/aabs-csula-9b88b2424/'
})

const SHEET_HEADERS = Object.freeze([
  'Date',
  'Full Name',
  'Email',
  'Major',
  'Academic Year',
  'Primary Interest',
  'Confirmation Status',
  'Confirmation Sent At'
])

const REQUIRED_FORM_FIELDS = Object.freeze([
  'Full Name',
  'Email',
  'Major',
  'Academic Year',
  'Primary Interest'
])

const scriptProp = PropertiesService.getScriptProperties()

/**
 * Clears Sheet1 and replaces it with the clean membership headers.
 * Run this function manually only when the current Sheet1 data can be erased.
 */
function rebuildMemberSheet () {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  if (!spreadsheet) {
    throw new Error('Open this script from the membership spreadsheet before rebuilding Sheet1.')
  }

  const sheet = spreadsheet.getSheetByName(CONFIG.sheetName) ||
    spreadsheet.insertSheet(CONFIG.sheetName)

  sheet.clearContents()
  sheet.getRange(1, 1, 1, SHEET_HEADERS.length).setValues([SHEET_HEADERS])
  sheet.getRange(1, 1, 1, SHEET_HEADERS.length).setFontWeight('bold')
  sheet.setFrozenRows(1)
  sheet.autoResizeColumns(1, SHEET_HEADERS.length)

  scriptProp.setProperty('key', spreadsheet.getId())
}

/**
 * Saves the spreadsheet ID and installs one recurring confirmation trigger.
 * Run this function manually after rebuildMemberSheet.
 */
function initialSetup () {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  if (!spreadsheet) {
    throw new Error('Open this script from the membership spreadsheet before setup.')
  }

  const sheet = spreadsheet.getSheetByName(CONFIG.sheetName)
  assertSheetHeaders_(sheet)
  scriptProp.setProperty('key', spreadsheet.getId())
  installConfirmationTrigger_()
}

/**
 * Receives the website form, validates it, and adds one pending member row.
 */
function doPost (event) {
  const lock = LockService.getScriptLock()
  let hasLock = false

  try {
    const params = event && event.parameter ? event.parameter : {}

    if (String(params._gotcha || '').trim()) {
      return jsonResponse_({ result: 'success' })
    }

    const submission = {}
    REQUIRED_FORM_FIELDS.forEach(function (field) {
      submission[field] = String(params[field] || '').trim()
      if (!submission[field]) {
        throw new Error('Missing required field: ' + field)
      }
    })

    if (!isValidEmail_(submission.Email)) {
      throw new Error('Invalid email address')
    }

    lock.waitLock(10000)
    hasLock = true

    const spreadsheetId = scriptProp.getProperty('key')
    if (!spreadsheetId) {
      throw new Error('Spreadsheet setup is incomplete. Run initialSetup first.')
    }

    const spreadsheet = SpreadsheetApp.openById(spreadsheetId)
    const sheet = spreadsheet.getSheetByName(CONFIG.sheetName)
    assertSheetHeaders_(sheet)

    const nextRow = sheet.getLastRow() + 1
    const newRow = [
      new Date(),
      submission['Full Name'],
      submission.Email.toLowerCase(),
      submission.Major,
      submission['Academic Year'],
      submission['Primary Interest'],
      'Pending',
      ''
    ]

    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow])

    return jsonResponse_({ result: 'success', row: nextRow })
  } catch (error) {
    return jsonResponse_({
      result: 'error',
      error: error && error.message ? error.message : String(error)
    })
  } finally {
    if (hasLock && lock.hasLock()) {
      lock.releaseLock()
    }
  }
}

/**
 * Sends confirmations for pending rows that are at least 20 minutes old.
 * The installed trigger calls this function every five minutes.
 */
function processPendingConfirmations () {
  const lock = LockService.getScriptLock()
  lock.waitLock(30000)

  try {
    const spreadsheetId = scriptProp.getProperty('key')
    if (!spreadsheetId) {
      throw new Error('Spreadsheet setup is incomplete. Run initialSetup first.')
    }

    const spreadsheet = SpreadsheetApp.openById(spreadsheetId)
    const sheet = spreadsheet.getSheetByName(CONFIG.sheetName)
    assertSheetHeaders_(sheet)

    if (sheet.getLastRow() < 2) return

    const rows = sheet
      .getRange(2, 1, sheet.getLastRow() - 1, SHEET_HEADERS.length)
      .getValues()

    const submittedIndex = SHEET_HEADERS.indexOf('Date')
    const nameIndex = SHEET_HEADERS.indexOf('Full Name')
    const emailIndex = SHEET_HEADERS.indexOf('Email')
    const interestIndex = SHEET_HEADERS.indexOf('Primary Interest')
    const statusIndex = SHEET_HEADERS.indexOf('Confirmation Status')
    const sentAtIndex = SHEET_HEADERS.indexOf('Confirmation Sent At')
    const delayMilliseconds = CONFIG.confirmationDelayMinutes * 60 * 1000
    const now = new Date()
    let remainingQuota = MailApp.getRemainingDailyQuota()

    for (let index = 0; index < rows.length; index += 1) {
      const row = rows[index]
      const status = String(row[statusIndex] || '').trim()
      const submittedAt = row[submittedIndex]

      if (status !== 'Pending') continue
      if (!(submittedAt instanceof Date) || isNaN(submittedAt.getTime())) continue
      if (now.getTime() - submittedAt.getTime() < delayMilliseconds) continue
      if (remainingQuota < 1) return

      const sheetRow = index + 2
      const email = String(row[emailIndex] || '').trim().toLowerCase()

      if (!isValidEmail_(email)) {
        sheet.getRange(sheetRow, statusIndex + 1).setValue('Invalid Email')
        continue
      }

      sheet.getRange(sheetRow, statusIndex + 1).setValue('Sending')
      SpreadsheetApp.flush()

      try {
        const message = buildConfirmationMessage_(
          String(row[nameIndex] || '').trim(),
          String(row[interestIndex] || '').trim()
        )

        MailApp.sendEmail({
          to: email,
          replyTo: CONFIG.clubEmail,
          name: CONFIG.senderName,
          subject: CONFIG.emailSubject,
          body: message.text,
          htmlBody: message.html
        })

        const sentAt = new Date()
        sheet.getRange(sheetRow, statusIndex + 1).setValue('Sent')
        sheet.getRange(sheetRow, sentAtIndex + 1).setValue(sentAt)
        remainingQuota -= 1
      } catch (error) {
        const message = error && error.message ? error.message : String(error)
        sheet.getRange(sheetRow, statusIndex + 1).setValue('Error: ' + message)
      }
    }
  } finally {
    if (lock.hasLock()) {
      lock.releaseLock()
    }
  }
}

function installConfirmationTrigger_ () {
  ScriptApp.getProjectTriggers().forEach(function (trigger) {
    if (trigger.getHandlerFunction() === 'processPendingConfirmations') {
      ScriptApp.deleteTrigger(trigger)
    }
  })

  ScriptApp.newTrigger('processPendingConfirmations')
    .timeBased()
    .everyMinutes(5)
    .create()
}

function buildConfirmationMessage_ (fullName, primaryInterest) {
  const firstName = fullName ? fullName.split(/\s+/)[0] : 'there'
  const interest = describeInterest_(primaryInterest)

  const text = [
    'Hi ' + firstName + ',',
    '',
    'Thank you for your interest in the Applied AI in Business Society. We received your membership application and are excited to learn more about you.',
    '',
    'AABS brings students from every major together through hands-on AI projects, workshops, professional networking, and collaboration with local businesses.',
    interest ? 'We saw that you are especially interested in ' + interest + ', and we will keep that in mind as we connect you with upcoming opportunities.' : '',
    '',
    'A student leader will follow up with next steps. In the meantime, you can follow AABS on LinkedIn for club updates and events:',
    CONFIG.linkedInUrl,
    '',
    'If you have any questions, just reply to this email.',
    '',
    'Best,',
    'AABS Membership Team',
    'Applied AI in Business Society',
    'Cal State LA'
  ].filter(function (line, index, lines) {
    return line !== '' || lines[index - 1] !== ''
  }).join('\n')

  const escapedFirstName = escapeHtml_(firstName)
  const escapedInterest = escapeHtml_(interest)
  const interestParagraph = escapedInterest
    ? '<p>We saw that you are especially interested in ' + escapedInterest + ', and we will keep that in mind as we connect you with upcoming opportunities.</p>'
    : ''

  const html = [
    '<p>Hi ' + escapedFirstName + ',</p>',
    '<p>Thank you for your interest in the Applied AI in Business Society. We received your membership application and are excited to learn more about you.</p>',
    '<p>AABS brings students from every major together through hands-on AI projects, workshops, professional networking, and collaboration with local businesses.</p>',
    interestParagraph,
    '<p>A student leader will follow up with next steps. In the meantime, you can <a href="' + CONFIG.linkedInUrl + '">follow AABS on LinkedIn</a> for club updates and events.</p>',
    '<p>If you have any questions, just reply to this email.</p>',
    '<p>Best,<br>AABS Membership Team<br>Applied AI in Business Society<br>Cal State LA</p>'
  ].join('')

  return { text: text, html: html }
}

function describeInterest_ (primaryInterest) {
  const descriptions = {
    'Local Business Projects': 'working with local businesses',
    'Technical AI Projects': 'hands-on AI and technical projects',
    'Club Operations & Marketing': 'club operations, marketing, and events',
    'Workshops & Learning': 'workshops, networking, and learning opportunities'
  }

  return descriptions[primaryInterest] || primaryInterest
}

function assertSheetHeaders_ (sheet) {
  if (!sheet) {
    throw new Error('Sheet1 was not found. Run rebuildMemberSheet first.')
  }

  const currentHeaders = sheet
    .getRange(1, 1, 1, SHEET_HEADERS.length)
    .getValues()[0]
    .map(function (header) { return String(header).trim() })

  const headersMatch = SHEET_HEADERS.every(function (header, index) {
    return currentHeaders[index] === header
  })

  if (!headersMatch) {
    throw new Error('Sheet1 headers do not match the required membership headers.')
  }
}

function isValidEmail_ (email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim())
}

function escapeHtml_ (value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function jsonResponse_ (payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON)
}
