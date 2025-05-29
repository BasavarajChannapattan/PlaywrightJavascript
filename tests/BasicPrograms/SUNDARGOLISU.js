/* ----------  MENU ---------- */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Sundaragolisu")
    .addItem("Beautify List", "formatWordStyleList")
    .addSeparator()
    .addItem("Spell & Grammar Check", "checkSpellingGrammar")
    .addToUi();

  SpreadsheetApp.getUi()
    .createMenu("Reset Week")
    .addItem("Export & Roll Week", "exportViaTitleAndRollWeek")
    .addToUi();
}

/* ==============================================================
   WEEKLY ROLLOVER – URL method, but export happens *first*
   ============================================================= */

const HOLIDAYS = [
  "2025-01-01",
  "2025-04-18",
  "2025-07-04",
  "2025-08-15",
  "2025-08-27",
  "2025-09-01",
  "2025-10-20",
  "2025-12-25",
].map((d) => new Date(d + "T00:00:00Z"));

function exportViaTitleAndRollWeek() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  const tz = ss.getSpreadsheetTimeZone();
  const sheet = ss.getActiveSheet();
  const sheetName = sheet.getSheetName(); // e.g. 14 Apr – 17 Apr

  /* 1️⃣  Rename spreadsheet so Drive uses it as the download filename */
  const exportTitle = `Weekly Updates ${sheetName}`;
  const originalTitle = ss.getName();
  ss.rename(exportTitle);

  /* 2️⃣  Build an HTML page:
         • auto-clicks the export URL
         • THEN calls google.script.run.rollWeekAfterDownload()
  */
  const url = `https://docs.google.com/spreadsheets/d/${ss.getId()}/export?format=xlsx`;
  const html = HtmlService.createHtmlOutput(
    `<html><body style="font:13px Roboto,Arial">
<p>Downloading&hellip; If nothing happens, <a id="dl"
       href="${url}" download>click here</a>.</p>
 
     <script>
       // try automatic download in a new tab
       window.open("${url}", "_blank");
 
       // then trigger rollover
       google.script.run
         .withSuccessHandler(google.script.host.close)
         .withFailureHandler(google.script.host.close)
         .rollWeekAfterDownload(
             ${JSON.stringify(sheetName)},
             ${JSON.stringify(tz)},
             ${JSON.stringify(originalTitle)}
         );
</script>
</body></html>`
  )
    .setWidth(240)
    .setHeight(80);

  ui.showModalDialog(html, "Downloading …");
}

/* --------------------------------------------------------------
   This runs *after* the browser has started the download
   -------------------------------------------------------------- */
function rollWeekAfterDownload(oldSheetName, tz, originalTitle) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(oldSheetName); // still the current week

  // duplicate, clear Column B, rename to next week
  const next = sheet.copyTo(ss);
  next.getRange("B:B").clearContent();
  next.setName(getNextWeekName(oldSheetName, tz));

  // hide the old sheet
  sheet.hideSheet();
  ss.rename(originalTitle);
  // ping the user (toast is less intrusive than modal)
  SpreadsheetApp.getActive().toast(
    `Week rolled over. New sheet: “${next.getName()}”.`,
    "Weekly Tools"
  );
}

/* ----------  DATE HELPER ---------- */
function getNextWeekName(curr, tz) {
  const [startTxt] = curr.split(" - ");
  const year = Utilities.formatDate(new Date(), tz, "yyyy");
  let startDate = new Date(`${startTxt} ${year}`);
  const nextMon = new Date(startDate);
  nextMon.setDate(nextMon.getDate() + 7);

  const work = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(nextMon);
    d.setDate(d.getDate() + i);
    if (!HOLIDAYS.some((h) => h.getTime() === strip(d).getTime())) work.push(d);
  }
  const first = work[0],
    last = work[work.length - 1];
  return `${Utilities.formatDate(first, tz, "dd MMM")} - ${Utilities.formatDate(
    last,
    tz,
    "dd MMM"
  )}`;
}

function strip(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function formatWordStyleList() {
  const cell = SpreadsheetApp.getActiveSpreadsheet().getActiveCell();
  const raw = cell.getValue();
  if (!raw) return;

  const lines = raw
    .toString()
    .split("\n")
    .filter((l) => l.trim() !== "");
  const bullet1Indent = "      "; // 6 spaces
  const bullet2Indent = "          "; // 10 spaces
  let num = 1;
  let out = [];

  lines.forEach((line) => {
    const trimLead = line.replace(/^\s+/, ""); // keep for detection
    let txt;

    /* ---------- sub-bullet (◦) ---------- */
    if (/^(--|\u25E6)/.test(trimLead)) {
      // "--"  or "◦"
      txt = trimLead
        .replace(/^--\s*/, "") // strip "-- "
        .replace(/^\u25E6\s*/, ""); // strip "◦ "
      out.push(`${bullet2Indent}◦ ${txt}`);
      return;
    }

    /* ---------- first-level bullet (•) ---------- */
    if (/^(-|\u2022)/.test(trimLead)) {
      // "-"   or "•"
      txt = trimLead
        .replace(/^-+\s*/, "") // strip "- " / "-- "
        .replace(/^\u2022\s*/, ""); // strip "• "
      out.push(`${bullet1Indent}• ${txt}`);
      return;
    }

    /* ---------- numbered line ---------- */
    txt = trimLead.replace(/^\d+\.\s*/, ""); // strip any "1. "
    out.push(`${num}.  ${txt}`);
    num++;
  });

  cell.setValue(out.join("\n"));
  cell.setWrap(true);
}

function checkSpellingGrammar() {
  const ui = SpreadsheetApp.getUi();
  const cell = SpreadsheetApp.getActiveSpreadsheet().getActiveCell();
  const txt = cell.getValue();
  if (!txt) {
    ui.alert("Cell is empty.");
    return;
  }

  // hit LanguageTool public endpoint
  const url = "https://api.languagetoolplus.com/v2/check";
  const resp = UrlFetchApp.fetch(url, {
    method: "post",
    payload: {
      text: txt,
      language: "en-US",
    },
    muteHttpExceptions: true,
  });
  const data = JSON.parse(resp.getContentText());

  if (!data.matches || data.matches.length === 0) {
    ui.alert(
      "Sakkath chennagide maga 👌\nYenu mistake siglilla 😎\nEnglish-u nim hattira bejar aagutte kano!🫡"
    );
    return;
  }

  // build a quick report
  let report = "";
  data.matches.forEach((m) => {
    const error = txt.substr(m.offset, m.length);
    const suggest = (m.replacements[0] && m.replacements[0].value) || "‑‑";
    report += `• ${error} → ${suggest}\n   (${m.message})\n\n`;
  });

  ui.alert(`Found ${data.matches.length} issue(s):\n\n` + report);
}
