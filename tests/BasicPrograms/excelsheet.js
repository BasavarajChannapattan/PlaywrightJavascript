function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Sundaragolisu")
    .addItem("Beautify List", "formatWordStyleList")
    .addSeparator()
    .addItem("Spell & Grammar Check", "checkSpellingGrammar")
    .addSeparator()
    .addSubMenu(
      SpreadsheetApp.getUi()
        .createMenu("Automation")
        .addItem("Setup Weekly Triggers", "setupAutomationTriggers")
        .addItem("Remove All Triggers", "removeAllTriggers")
        .addSeparator()
        .addItem("Show Current Triggers", "showTriggers")
    )
    .addToUi();
}

// Add these new functions
function removeAllTriggers() {
  ScriptApp.getProjectTriggers().forEach((trigger) =>
    ScriptApp.deleteTrigger(trigger)
  );
  Logger.log("All triggers removed successfully");
  SpreadsheetApp.getActive().toast("All automation triggers have been removed");
}

function showTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  const ui = SpreadsheetApp.getUi();

  if (triggers.length === 0) {
    ui.alert(
      "No Triggers",
      "No automation triggers are currently set up.",
      ui.ButtonSet.OK
    );
    return;
  }

  const triggerInfo = triggers
    .map((trigger) => {
      const functionName = trigger.getHandlerFunction();
      const eventType = trigger.getEventType();

      let triggerTime = "";
      try {
        // Get trigger timing info if available
        const eventTime = trigger.getTriggerSource();
        triggerTime = `Runs: ${eventTime}`;
      } catch (e) {
        triggerTime = "Timing: Not available";
      }

      return `Function: ${functionName}
Type: ${eventType}
${triggerTime}`;
    })
    .join("\n\n");

  ui.alert("Current Triggers", triggerInfo, ui.ButtonSet.OK);
}

function readTeamConfig() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const configSheet = ss.getSheetByName("TeamConfig");

  if (!configSheet) {
    Logger.log("TeamConfig sheet not found");
    return {};
  }

  const data = configSheet.getDataRange().getValues();
  const teamConfig = {};
  let managers = [];

  // Skip header row
  for (let i = 1; i < data.length; i++) {
    const [teamName, emails] = data[i];
    if (teamName && emails) {
      if (teamName.trim() === "Manager") {
        managers = emails.split(",").map((email) => email.trim());
      } else {
        teamConfig[teamName] = {
          members: emails.split(",").map((email) => email.trim()),
        };
      }
    }
  }

  // Add managers to all teams
  Object.keys(teamConfig).forEach((team) => {
    teamConfig[team].managers = managers;
  });

  return teamConfig;
}

function checkEmptyCellsAndNotify() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const emptyCellsInfo = checkEmptyCellsForTeams(sheet);

  Logger.log("Checking empty cells...");

  // Force notifications for testing
  for (let team in emptyCellsInfo) {
    if (emptyCellsInfo[team].length > 0) {
      // Test team notification
      sendEmailToTeam(team, emptyCellsInfo[team]);
      // Test manager notification
      sendFinalReminderToManagers(team, emptyCellsInfo[team]);
    }
  }

  Logger.log("Test notifications sent for any empty cells");
}

function checkEmptyCellsForTeams(sheet) {
  const teamConfig = readTeamConfig();
  const teams = Object.keys(teamConfig).filter((team) => team !== "Manager");
  const emptyCellsInfo = {};

  Logger.log("Checking for empty status cells...");

  teams.forEach((team, index) => {
    const row = index + 2;
    const cell = sheet.getRange(row, 2).getValue();

    if (
      !cell ||
      cell.toString().trim() === "" ||
      cell === null ||
      cell === undefined
    ) {
      if (!emptyCellsInfo[team]) emptyCellsInfo[team] = [];
      emptyCellsInfo[team].push(`Row ${row}`);
      Logger.log(`Found empty cell for ${team}`);
    }
  });

  return emptyCellsInfo;
}

function rollSheetAndSendEmail() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  const sheetName = sheet.getSheetName();
  const fileName = `Weekly Updates ${sheetName}.xlsx`;

  // Get sheet structure before creating new sheet
  const teamConfig = readTeamConfig();
  const teams = Object.keys(teamConfig).filter((team) => team !== "Manager");

  // Export current sheet
  const tempSS = SpreadsheetApp.create("TEMP-Weekly-Export");
  const copiedSheet = sheet.copyTo(tempSS).setName(sheetName);
  tempSS.deleteSheet(tempSS.getSheets()[0]);

  // Send email with current sheet
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

  // Create new sheet with empty cells
  const newSheetName = getNextWeekSheetName();
  const newSheet = sheet.copyTo(ss);
  newSheet.setName(newSheetName);

  // Clear ALL content from column B except header
  const lastRow = newSheet.getLastRow();
  if (lastRow > 1) {
    newSheet.getRange(2, 2, lastRow - 1, 1).clearContent();
  }

  // Cleanup and activate new sheet
  DriveApp.getFileById(tempSS.getId()).setTrashed(true);
  sheet.hideSheet();
  ss.setActiveSheet(newSheet);

  Logger.log(`Sheet rolled to "${newSheetName}" with empty status cells`);
}

function sendEmailToTeam(team, emptyInfo) {
  const teamMembers = getTeamMembers(team);
  const spreadsheetUrl = SpreadsheetApp.getActiveSpreadsheet().getUrl();

  if (!teamMembers || teamMembers.length === 0) {
    Logger.log(`No team members found for ${team}`);
    return;
  }

  const subject = `Reminder: ${team} team has missing status updates`;
  const body =
    `Hi ${team} team,\n\n` +
    `The following status cells are empty:\n` +
    `${emptyInfo.join("\n")}\n\n` +
    `Please update them here: ${spreadsheetUrl}\n\n` +
    `Thanks.`;

  MailApp.sendEmail(teamMembers.join(","), subject, body);
  Logger.log(`Email sent to ${team} members: ${teamMembers.join(", ")}`);
}

function sendFinalReminderToManagers(team, emptyInfo) {
  if (!emptyInfo || emptyInfo.length === 0) return;

  const managers = getTeamManagers(team);
  if (managers.length === 0) {
    Logger.log(`No managers found for team: ${team}`);
    return;
  }

  const spreadsheetUrl = SpreadsheetApp.getActiveSpreadsheet().getUrl();
  const subject = `Final Reminder: ${team} status update missing`;

  managers.forEach((managerEmail) => {
    const body =
      `Hi Manager,\n\n` +
      `The following status updates for the ${team} team are still missing:\n\n` +
      `${emptyInfo.join("\n")}\n\n` +
      `Please ensure the status is updated here: ${spreadsheetUrl}\n\n` +
      `Regards,\nStatus Bot`;

    MailApp.sendEmail(managerEmail, subject, body);
    Logger.log(`Final reminder sent to manager (${managerEmail}) for ${team}`);
  });
}

function getTeamMembers(team) {
  const teamConfig = readTeamConfig();
  return teamConfig[team]?.members || [];
}

function getTeamManagers(team) {
  const teamConfig = readTeamConfig();
  return teamConfig[team]?.managers || [];
}

function clearDataInSheet(sheet) {
  const teamConfig = readTeamConfig();
  const numTeams = Object.keys(teamConfig).filter(
    (team) => team !== "Manager"
  ).length;

  if (numTeams > 0) {
    sheet.getRange(2, 2, numTeams, 1).clearContent();
  }

  Logger.log(`Cleared status cells for ${numTeams} teams in new sheet`);
}

function getNextWeekSheetName() {
  const today = new Date();
  const nextMonday = new Date(today);
  const day = today.getDay();
  const offset = day === 0 ? 1 : 8 - day;
  nextMonday.setDate(today.getDate() + offset);

  const nextFriday = new Date(nextMonday);
  nextFriday.setDate(nextMonday.getDate() + 4);

  const options = { month: "short", day: "numeric" };
  const monStr = nextMonday.toLocaleDateString("en-US", options);
  const friStr = nextFriday.toLocaleDateString("en-US", options);

  return `${monStr} - ${friStr}`;
}

function setupAutomationTriggers() {
  ScriptApp.getProjectTriggers().forEach((trigger) =>
    ScriptApp.deleteTrigger(trigger)
  );

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

  Logger.log("Automation triggers set up successfully");
}
