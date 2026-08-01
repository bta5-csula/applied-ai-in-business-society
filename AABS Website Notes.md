# AABS Website Notes & Design Strategy

## 1. Primary Objectives & Original Checklist
* **Theme**: Change the black background to rich navy blue (`#09101d`, `#0e1728`, `#131e33`).
* **Branding & Title**:
  * Club Name: **Applied AI in Business Society** (**AABS**).
  * Primary Domain: `applied-ai-in-business-society.vercel.app`.
  * Institution Focus: **Cal State LA Student Organization** (with ELAC as an academic & community partner).
  * Removed "Where AI Meets Enterprise" and all AI-generated buzzwords/em dashes.
* **Inclusivity & Hybrid Focus**:
  * Explicitly welcome students from all academic majors (CIS, Finance, Accounting, CS, Business Administration, etc.).
* **Leadership Roster Layout (3-3-1 Layout)**:
  * Top Row (3 Leaders): Helian Parra (President), Brian Ta (Vice President), Daniel Ramirez (Vice President).
  * Middle Row (3 Officers): Ivan Herrera (Secretary), Michael Gonzalez (Treasurer), Jared Mendoza (Committee Chair).
  * Bottom Row (1 Officer): Lizzie Reyes (Marketing Director) — **Centered beneath middle row**.
  * Faculty Advisor: Dr. Ming Wang (spaced vertically below officer grid).
* **Initiatives Section**:
  * Restructured into a **2-card per row** grid.
  * Added **Local Business AI & Campus Compute Initiative**.
* **Join Flow**:
  * Dedicated `join.html` application page with full registration fields (Full Name, Email, Major, Year, Interest Area) and official LinkedIn connect panel.
  * Nav CTA, Hero CTA, and Join Section buttons point directly to `join.html`.
  * Integrated Google Apps Script autoresponder & Formspree endpoints.

---

## 2. Common AI Patterns & Tropes to Avoid in Web Development

To ensure the website remains grounded, authentic, and professional, we conducted research on common AI-generated design and copywriting tropes to eliminate from the project:

### A. Visual & Aesthetic Tropes
1. **Generic Tech-Noir Color Palettes**: Overuse of pitch-black `#000000` backgrounds combined with aggressive neon cyan (`#00ffff`) or magenta glows. *Solution*: Soft navy blue tones (`#09101d`) paired with warm gold (`#c8a96e`) accents.
2. **Pseudo-Code & Scanner Overlays**: Arbitrary text tags like `STATUS: OPERATIONAL`, `SYSTEMS ONLINE`, or `VERSION: 1.0` scattered across decorative cards. *Solution*: Clean, human-readable labels and purposeful section titles.
3. **Floating Abstract Geometry**: Unconnected 3D wireframe mesh spheres or glowing particles floating in margins without context. *Solution*: Subtle grid background overlays (`48px x 48px`) and structured card borders.

### B. Copywriting & Tone Tropes
1. **Overused AI Vocabulary**: Words like *"delve"*, *"tapestry"*, *"beacon"*, *"realm"*, *"paradigm"*, *"testament"*, *"cutting-edge"*, and *"seamlessly"*. *Solution*: Clear, direct, human language focusing on practical student projects and local business outcomes.
2. **Punctuation Overkill (Em Dashes `—`)**: Heavy reliance on em dashes in every sentence for dramatic effect. *Solution*: Standard punctuation and natural sentence flow.
3. **Synthetic Sci-Fi Declarations**: Statements like *"Shaping the hyper-future of enterprise intelligence."* *Solution*: Practical descriptions like *"Helping local businesses adopt practical AI tools to streamline work."*

---

## 3. Changelog & Rationale

| Component | Modification | Rationale |
| :--- | :--- | :--- |
| **Hero Tag & Header** | Removed "Est. 2025" and "ELAC" from top tag (`Cal State LA Student Organization`) | Clarifies that AABS is officially a Cal State LA student organization; keeps ELAC in body copy as a partner. |
| **Hero Subtitle Placement** | Reduced `margin-top` on `.hero-sub` from `28px` to `14px` | Moves the description text higher up under the main heading, creating a tighter and more visually pleasing hero composition. |
| **Leadership Grid** | Centered Lizzie Reyes' Marketing Director card under the middle row (`display: flex; justify-content: center`) | Ensures mathematical symmetry (3 top cards, 3 middle cards, 1 centered bottom card). |
| **Join Flow (`join.html`)** | Added missing CSS styles (`.join-page-container`, `.join-panel`, `.form-control`) and pointed all CTAs to `join.html` | Fixes unformatted layout on `join.html` and ensures seamless navigation from anywhere on the site. |
| **Initiative Grid** | Implemented `.projects-grid` with `grid-template-columns: repeat(2, 1fr)` | Provides visual balance and readability across desktop viewports. |
| **Color System** | Swapped flat dark grey for deep navy base (`#09101d`) with gold (`#c8a96e`) and cyan (`#4dd9c0`) accents | Delivers a premium, business-focused aesthetic while maintaining high contrast. |
| **LinkedIn Integration** | Updated all social buttons to `https://www.linkedin.com/in/aabs-csula-9b88b2424/` | Directs site visitors to the official active organization page. |

---

## 4. User Feedback Log & Analysis

* **Officer Titles**:
  * *Feedback*: Keep both Brian Ta and Daniel Ramirez titled as "Vice President" for now rather than specifying sub-titles.
  * *Implementation*: Applied to both leadership cards and metadata.
* **QR Code Usage**:
  * *Feedback*: Do not place a QR code on the website itself.
  * *Implementation*: Reserved QR code exclusively for physical tabling flyers and printed collateral.
* **Institution Affiliation**:
  * *Feedback*: Ensure the top header specifies Cal State LA as the primary student organization.
  * *Implementation*: Header tag updated; ELAC partnership highlighted in about body text and compute initiatives.
* **Visual Aesthetic Preference**:
  * *Feedback*: Retain the sleek, state-of-the-art layout structure and animations from `https://bta5-csula.github.io/society-for-ai-in-enterprise-systems/`.
  * *Implementation*: Preserved background grid texture, glowing hero orb, card hover scanner lines, ticker animation, and Cormorant Garamond typography.

---

## 5. Design Director Review & Comparative Analysis

### Analysis of the Original GitHub Site (`https://bta5-csula.github.io/society-for-ai-in-enterprise-systems/`)
* **Strengths**:
  1. **Typographic Contrast**: The combination of elegant, classic serif headings (*Cormorant Garamond*) with technical monospaced subtext (*JetBrains Mono*) creates an authoritative yet innovative feel.
  2. **Atmospheric Lighting**: Soft radial orb glows and subtle grid overlays give the interface depth without cluttering readability.
  3. **Interactive Feedback**: Card hover transitions (4px lift + glowing border + scanline animation) make the site feel responsive and active.

### Evaluation of the Current AABS Website Preview
* **Improvements Achieved**:
  1. **Elevated Color Palette**: The shift to deep navy blue (`#09101d`) grounds the business identity more effectively than standard dark grey while retaining gold highlight contrast.
  2. **Structural Clarity**: The 2-column project grid replaces full-width rows, making initiatives easier to scan and compare side-by-side.
  3. **Balanced Roster**: The 3-3-1 centered officer hierarchy creates a clean visual anchor in the leadership section.
  4. **Dedicated Conversion Funnel**: The dedicated `join.html` application page accommodates both quick leads and committed applicant submissions with immediate LinkedIn integration.

---

## 6. Recommended Next Steps & Checklist

1. **Verify Google Apps Script Endpoint**:
   * Confirm the Google Apps Script Web App URL (`https://script.google.com/macros/s/...`) is configured with permissions set to *"Anyone"* so submissions execute automatically without requiring Google sign-in.
2. **Form Automated Welcome Email**:
   * Set up the trigger in Google Apps Script to send the customized welcome email 20-30 minutes after submission.
3. **Domain & Vercel Deployment**:
   * Deploy the updated repository to Vercel under `applied-ai-in-business-society.vercel.app`.
4. **Mobile Responsiveness Audit**:
   * Perform final browser checks across mobile screen sizes (<480px) to verify hamburger menu operation and card padding.
