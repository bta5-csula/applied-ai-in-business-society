# AABS membership automation

This Apps Script keeps the website's custom membership form, records each submission in Google Sheets, and sends a delayed confirmation from the club Gmail account at no additional cost.

## Sheet1 columns

The script rebuilds `Sheet1` with these columns:

1. Date
2. Full Name
3. Email
4. Major
5. Academic Year
6. Primary Interest
7. Confirmation Status
8. Confirmation Sent At

## One-time setup

1. Open the Google Sheet used for membership records.
2. Select **Extensions**, then **Apps Script**.
3. Replace the existing script with the contents of `Code.gs`.
4. Save the Apps Script project.
5. Select and run `rebuildMemberSheet`.
6. Confirm the requested Google permissions. This function clears the current contents of `Sheet1` and writes the clean headings.
7. Select and run `initialSetup`.
8. Confirm the requested permissions for Google Sheets, scheduled triggers, and outgoing email.
9. Open **Deploy**, then **Manage deployments**.
10. Edit the existing web app deployment and deploy a new version. Keep **Execute as** set to the club account and preserve the existing access setting so the public website can submit the form.

Editing the existing deployment should preserve the current Apps Script web app URL already used by `join.html`.

## Verification

1. Submit one clearly labeled test application through the website.
2. Confirm that all five student fields appear in the new Sheet1 row.
3. Confirm that `Confirmation Status` begins as `Pending`.
4. Wait approximately 20 to 25 minutes.
5. Confirm that the applicant receives the email.
6. Confirm that the row changes to `Sent` and records a value under `Confirmation Sent At`.

If a row shows an error, review the Apps Script execution history. After correcting the problem, change that row's `Confirmation Status` back to `Pending` to retry it.

## Current operating limits

The script checks the Gmail account's remaining Apps Script email quota before sending. Consumer Gmail accounts currently have an Apps Script limit of 100 email recipients per day. Google can change its quotas.

Only one recurring trigger is installed. It checks pending rows every five minutes and sends messages once they have waited at least 20 minutes. This keeps trigger use low and means the delay is approximate rather than exact.
