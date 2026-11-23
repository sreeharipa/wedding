/**
 * RSVP → Google Sheet
 *
 * Setup (one time, ~2 minutes):
 *  1. Create a new Google Sheet (e.g. "Wedding RSVPs").
 *  2. In the sheet: Extensions → Apps Script. Delete what's there, paste this whole file, Save.
 *  3. Deploy → New deployment → type "Web app".
 *       Execute as: Me
 *       Who has access: Anyone
 *     Deploy, allow access when Google asks, then copy the Web app URL (ends in /exec).
 *  4. Put that URL in config.js (main site) as rsvpSheetUrl.
 *
 * Do the same again with a second sheet (e.g. "Wedding RSVPs · Akshaya") and put that
 * URL in akshaya/config.js, so each website's RSVPs land in their own sheet.
 *
 * Every RSVP is added as a new row on the "RSVPs" tab.
 */

const SHEET_NAME = "RSVPs";
const HEADERS = ["Received (IST)", "Website", "Name", "Phone", "Response", "Guests", "Celebrations", "Wishes"];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sh = ss.getSheetByName(SHEET_NAME);
    if (!sh) sh = ss.insertSheet(SHEET_NAME);
    if (sh.getLastRow() === 0) {
      sh.appendRow(HEADERS);
      sh.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
      sh.setFrozenRows(1);
    }
    const p = (e && e.parameter) || {};
    // A leading = + - @ would make Sheets treat the text as a formula; keep it as plain text.
    const clean = (v) => {
      const s = String(v == null ? "" : v).slice(0, 2000);
      return /^[=+\-@]/.test(s) ? "'" + s : s;
    };
    const when = Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyy-MM-dd HH:mm");
    sh.appendRow([
      when,
      clean(p.site),
      clean(p.name),
      clean(p.phone),
      clean(p.response),
      p.guests ? Number(p.guests) || clean(p.guests) : "",
      clean(p.events),
      clean(p.wishes)
    ]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Visiting the /exec URL in a browser shows this, which is a quick way to check the deployment.
function doGet() {
  return ContentService.createTextOutput("RSVP endpoint is live.");
}
