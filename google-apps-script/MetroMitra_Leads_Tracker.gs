/**
 * MetroMitra Workforce Platform — Google Sheets Webhook Handler
 * ─────────────────────────────────────────────────────────────
 * Deploy as a Google Apps Script Web App:
 * 1. Open Google Sheets
 * 2. Extensions → Apps Script
 * 3. Paste this entire file
 * 4. Deploy → New deployment → Web App
 *    - Execute as: Me
 *    - Who has access: Anyone (anonymous)
 * 5. Copy the Web App URL → add to server/.env as GOOGLE_SHEETS_WEBHOOK_URL=<url>
 *
 * Sheet Structure:
 * - "Post_Jobs"               — every job posted by an employer
 * - "Get_Job_Applicants"      — workers who click "Get a Job Now" and complete OTP auth
 * - "Onboarding_Submissions"  — every worker onboarding form submission (free or paid)
 */

// ─── Sheet Tab Names ──────────────────────────────────────────────────────────
const SHEETS = {
  POST_JOBS: 'Post_Jobs',
  GET_JOB_APPLICANTS: 'Get_Job_Applicants',
  ONBOARDING_SUBMISSIONS: 'Onboarding_Submissions',
};

// ─── Column Headers per Sheet ─────────────────────────────────────────────────
const HEADERS = {
  [SHEETS.POST_JOBS]: [
    'Timestamp', 'Job ID', 'Job Number', 'Gig Type / Category', 
    'City / Location', 'Workers Needed', 'Duration (hrs)', 
    'Urgency', 'Total Fare (₹)', 'Platform Fee (₹)', 
    'Payment Status', 'Source (APP/WEB)', 'Posted At',
  ],
  [SHEETS.GET_JOB_APPLICANTS]: [
    'Timestamp', 'User ID', 'Name', 'Phone', 'Email',
    'Auth Intent', 'City', 'Referred From', 'Login At',
  ],
  [SHEETS.ONBOARDING_SUBMISSIONS]: [
    'Timestamp', 'Lead ID', 'Full Name', 'Phone', 'Email',
    'Job Type / Role', 'Experience', 'City', 'Area / Locality',
    'Assets', 'Documents', 'Skills / Knowledge',
    'Education', 'Gender', 'Current Salary', 'Source Platform',
    'WhatsApp Opt-In', 'Payment Status', 'Amount Paid (₹)', 'Submitted At',
  ],
};

// ─── Main Handler ─────────────────────────────────────────────────────────────
function doPost(e) {
  try {
    const raw = e.postData && e.postData.contents ? e.postData.contents : '{}';
    const payload = JSON.parse(raw);
    const sheetName = payload.sheet;

    if (!sheetName || !Object.values(SHEETS).includes(sheetName)) {
      return jsonResponse({ success: false, error: `Unknown sheet: ${sheetName}` });
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = getOrCreateSheet(ss, sheetName);

    // Ensure headers row exists
    ensureHeaders(sheet, sheetName);

    // Route to the correct row builder
    const row = buildRow(sheetName, payload);
    sheet.appendRow(row);

    return jsonResponse({ success: true, sheet: sheetName, rowsAdded: 1 });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message });
  }
}

// ─── Helper: GET handler for health check / manual test ─────────────────────
function doGet(e) {
  return jsonResponse({ status: 'MetroMitra Sheets Webhook is live ✅', timestamp: new Date().toISOString() });
}

// ─── Helper: Get or create a named sheet tab ─────────────────────────────────
function getOrCreateSheet(ss, name) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

// ─── Helper: Ensure header row is written ────────────────────────────────────
function ensureHeaders(sheet, sheetName) {
  if (sheet.getLastRow() === 0) {
    const headers = HEADERS[sheetName];
    if (headers && headers.length > 0) {
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setValues([headers]);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#1a7340');
      headerRange.setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }
  }
}

// ─── Helper: Build a row array based on sheet type ───────────────────────────
function buildRow(sheetName, p) {
  const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  if (sheetName === SHEETS.POST_JOBS) {
    return [
      now,
      p.jobId || '',
      p.jobNumber || '',
      p.gigType || p.gigCategory || '',
      p.city || p.locationAddress || '',
      p.workersNeeded || 1,
      p.durationHours || '',
      p.urgency || '',
      p.totalFare || '',
      p.platformFee || '',
      p.paymentStatus || 'PENDING',
      p.source || 'WEB',
      p.postedAt || now,
    ];
  }

  if (sheetName === SHEETS.GET_JOB_APPLICANTS) {
    return [
      now,
      p.userId || '',
      p.name || '',
      p.phone || '',
      p.email || '',
      p.authIntent || 'WORKER',
      p.city || '',
      p.referredFrom || '',
      p.loginAt || now,
    ];
  }

  if (sheetName === SHEETS.ONBOARDING_SUBMISSIONS) {
    return [
      now,
      p.id || p.leadId || '',
      p.name || `${p.firstName || ''} ${p.lastName || ''}`.trim(),
      p.phone || '',
      p.email || '',
      p.jobType || '',
      p.experience || '',
      p.city || '',
      p.area || '',
      p.assets || '',
      p.documents || '',
      p.skills || '',
      p.education || '',
      p.gender || '',
      p.currentSalary || '',
      p.sourcePlatform || 'WORKFORCE_WEB',
      p.whatsappOptIn !== undefined ? (p.whatsappOptIn ? 'Yes' : 'No') : 'Yes',
      p.paymentStatus || 'FREE',
      p.amountPaid || '0',
      p.submittedAt || now,
    ];
  }

  return [now, JSON.stringify(p)];
}

// ─── Helper: Return JSON response ─────────────────────────────────────────────
function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
