function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Sundaragolisu")
    .addItem("Beautify List", "formatWordStyleList")
    .addSeparator()
    .addItem("Spell & Grammar Check", "checkSpellingGrammar")
    .addToUi();

  SpreadsheetApp.getUi()
    .createMenu("Reset Week")
    .addItem("Export & Roll Week", "rollSheetAndSendEmail")
    .addToUi();
}

function checkEmptyCellsAndNotify() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const emptyCellsInfo = checkEmptyCellsForTeams(sheet);

  const currentHour = new Date().getHours();
  const currentDay = new Date().getDay(); // 0 = Sunday, 1 = Monday, ..., 5 = Friday

  // Monday 10 PM: Only notify managers/leads
  if (currentDay === 1 && currentHour === 22) {
    for (let team in emptyCellsInfo) {
      if (emptyCellsInfo[team].length > 0) {
        sendFinalReminderToManagers(team, emptyCellsInfo[team]);
      }
    }
  } else {
    // Other times: notify team members
    for (let team in emptyCellsInfo) {
      if (emptyCellsInfo[team].length > 0) {
        sendEmailToTeam(team, emptyCellsInfo[team]);
      }
    }
  }

  // If all cells are filled, perform the weekly rollover and send email to Pallav
  if (Object.values(emptyCellsInfo).every((info) => info.length === 0)) {
    rollSheetAndSendEmail();
  }
}

function checkEmptyCellsForTeams(sheet) {
  const teams = [
    "Platform Services",
    "Technodrome - Datadog",
    "Telemetry",
    "Manual_SDK",
    "Cloud_Extension",
    "SDK_CPP",
    "SDK_Unreal",
    "SDK_Unity",
    "API_Gateway",
    "Portal",
  ];
  const emptyCellsInfo = {};

  teams.forEach((team, index) => {
    const row = index + 2;
    const cell = sheet.getRange(row, 2).getValue();
    if (!cell || cell.toString().trim() === "") {
      if (!emptyCellsInfo[team]) emptyCellsInfo[team] = [];
      emptyCellsInfo[team].push(`Row ${row}`);
    }
  });

  return emptyCellsInfo;
}

function sendEmailToTeam(team, emptyInfo) {
  const teamEmails = getTeamMembers(team);
  const spreadsheetUrl = SpreadsheetApp.getActiveSpreadsheet().getUrl();

  const subject = `Reminder: ${team} team has missing status updates`;
  const body =
    `Hi ${team} team,\n\n` +
    `The following status cells are empty:\n` +
    `${emptyInfo.join("\n")}\n\n` +
    `Please update them here: ${spreadsheetUrl}\n\n` +
    `Thanks.`;

  if (teamEmails.length > 0) {
    MailApp.sendEmail(teamEmails.join(","), subject, body);
    Logger.log(`Email sent to ${team}`);
  }
}

function sendFinalReminderToManagers(team, emptyInfo) {
  if (!emptyInfo || emptyInfo.length === 0) {
    Logger.log(`No missing info for ${team}, skipping manager notification.`);
    return;
  }

  const spreadsheetUrl = SpreadsheetApp.getActiveSpreadsheet().getUrl();
  const subject = `Final Reminder: ${team} status update missing`;

  const managerList = [
    { email: "basub6312@gmail.com", name: "Basu" },
    { email: "viyog32074@bocapies.com", name: "Viyo" },
  ];

  managerList.forEach((manager) => {
    const body =
      `Hi ${manager.name},\n\n` +
      `The following status updates for the ${team} team are still missing:\n\n` +
      `${emptyInfo.join("\n")}\n\n` +
      `Please ensure the status is updated here: ${spreadsheetUrl}\n\n` +
      `Regards,\nStatus Bot`;

    MailApp.sendEmail(manager.email, subject, body);
    Logger.log(
      `Final reminder sent to ${manager.name} (${manager.email}) for ${team}`
    );
  });
}

function getTeamMembers(team) {
  const teamMembers = {
    "Platform Services": [
      "amals@suntechnologies.com",
      "hrishikeshg@suntechnologies.com",
      "rankanp@suntechnologies.com",
    ],
    "Technodrome - Datadog": [
      "manojkumar@suntechnologies.com",
      "ravikumark@suntechnologies.com",
      "suprajaa@suntechnologies.com",
    ],
    Telemetry: [
      "chandrikah@suntechnologies.com",
      "bhuvaneshwarib@suntechnologies.com",
    ],
    Manual_SDK: [
      "panchaksariaha@suntechnologies.com",
      "jayanthlals@suntechnologies.com",
    ],
    Cloud_Extension: [
      "mahammedkh@suntechnologies.com",
      "vinayn@suntechnologies.com",
      "prasthuthis@suntechnologies.com",
    ],
    SDK_CPP: ["dhirajs@suntechnologies.com"],
    SDK_Unreal: [
      "mohammedta@suntechnologies.com",
      "atulkumar@suntechnologies.com",
    ],
    SDK_Unity: ["sayanc@suntechnologies.com", "mohds@suntechnologies.com"],
    API_Gateway: ["xaxog12806@benznoi.com"],
    Portal: [
      "jasaswees@suntechnologies.com",
      "manasas@suntechnologies.com",
      "sharanyap@suntechnologies.com",
    ],
  };

  return teamMembers[team] || [];
}

function rollSheetAndSendEmail() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  const sheetName = sheet.getSheetName();
  const fileName = `Weekly Updates ${sheetName}.xlsx`;

  const emptyCellsInfo = checkEmptyCellsForTeams(sheet);
  if (Object.values(emptyCellsInfo).some((info) => info.length > 0)) {
    Logger.log("Not all cells are filled. Skipping email and rollover.");
    return;
  }

  const tempSS = SpreadsheetApp.create("TEMP-Weekly-Export");
  const copiedSheet = sheet.copyTo(tempSS).setName(sheetName);
  tempSS.deleteSheet(tempSS.getSheets()[0]);

  const token = ScriptApp.getOAuthToken();
  const response = UrlFetchApp.fetch(
    `https://www.googleapis.com/drive/v3/files/${tempSS.getId()}/export?mimeType=application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`,
    {
      method: "get",
      headers: { Authorization: "Bearer " + token },
    }
  );
  const blob = response.getBlob().setName(fileName);

  MailApp.sendEmail({
    to: "pallav@suntechnologies.com",
    subject: `Weekly Updates: ${sheetName}`,
    body: `Hi Pallav,\n\nPlease find attached the weekly update for ${sheetName}.\n\nThanks,\nStatus Bot`,
    attachments: [blob],
  });

  DriveApp.getFileById(tempSS.getId()).setTrashed(true);
  sheet.hideSheet();

  const newSheetName = getNextWeekSheetName();
  const newSheet = sheet.copyTo(ss);
  newSheet.setName(newSheetName);
  clearDataInSheet(newSheet);
  ss.setActiveSheet(newSheet);

  Logger.log(`Sheet rolled to "${newSheetName}" and emailed to Pallav.`);
}

function getNextWeekSheetName() {
  const today = new Date();
  const nextMonday = new Date(today);
  const day = today.getDay();
  const offset = day === 0 ? 1 : 8 - day;
  nextMonday.setDate(today.getDate() + offset);

  const options = { month: "short", day: "numeric" };
  const mon = new Date(nextMonday);
  const fri = new Date(nextMonday);
  fri.setDate(mon.getDate() + 4);

  return ` ${mon.toLocaleDateString(
    "en-US",
    options
  )} - ${fri.toLocaleDateString("en-US", options)}`;
}

function clearDataInSheet(sheet) {
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  for (let row = 2; row <= lastRow; row++) {
    for (let col = 2; col <= lastCol; col++) {
      sheet.getRange(row, col).clearContent();
    }
  }
}

function setupAutomationTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach((trigger) => ScriptApp.deleteTrigger(trigger));
  Logger.log(`Deleted ${triggers.length} existing trigger(s).`);

  ScriptApp.newTrigger("checkEmptyCellsAndNotify")
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.FRIDAY)
    .atHour(21)
    .create();

  ScriptApp.newTrigger("checkEmptyCellsAndNotify")
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(16)
    .create();

  ScriptApp.newTrigger("checkEmptyCellsAndNotify")
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(22)
    .create();

  SpreadsheetApp.getActiveSpreadsheet().toast(
    "Automation Setup Complete",
    "Done",
    5
  );
}

function formatWordStyleList() {
  const cell = SpreadsheetApp.getActiveSpreadsheet().getActiveCell();
  const raw = cell.getValue();
  if (!raw) return;

  const lines = raw
    .toString()
    .split("\n")
    .filter((l) => l.trim() !== "");
  const bullet1Indent = "      ";
  const bullet2Indent = "          ";
  let num = 1;
  let out = [];

  lines.forEach((line) => {
    const trimLead = line.replace(/^\s+/, "");
    let txt;

    if (/^(--|\u25E6)/.test(trimLead)) {
      txt = trimLead.replace(/^--\s*/, "").replace(/^\u25E6\s*/, "");
      out.push(`${bullet2Indent}◦ ${txt}`);
      return;
    }

    if (/^(-|\u2022)/.test(trimLead)) {
      txt = trimLead.replace(/^-+\s*/, "").replace(/^\u2022\s*/, "");
      out.push(`${bullet1Indent}• ${txt}`);
      return;
    }

    txt = trimLead.replace(/^\d+\.\s*/, "");
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

  let report = "";
  data.matches.forEach((m) => {
    const error = txt.substr(m.offset, m.length);
    const suggest = (m.replacements[0] && m.replacements[0].value) || "‑‑";
    report += `• ${error} → ${suggest}\n   (${m.message})\n\n`;
  });

  ui.alert(`Found ${data.matches.length} issue(s):\n\n` + report);
}

function testFinalReminderNow() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const emptyCellsInfo = checkEmptyCellsForTeams(sheet);

  for (let team in emptyCellsInfo) {
    if (emptyCellsInfo[team].length > 0) {
      sendFinalReminderToManagers(team, emptyCellsInfo[team]);
    }
  }
}

function testCheckEmptyCellsAndNotify() {
  // Manually trigger the checkEmptyCellsAndNotify function
  checkEmptyCellsAndNotify();
}
