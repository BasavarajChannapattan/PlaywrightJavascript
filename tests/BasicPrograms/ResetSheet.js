function onOpen() {
  const ui = SpreadsheetApp.getUi();

  // First Menu: Sundaragolisu (only beautify and spell check now)
  ui.createMenu("Sundaragolisu")
    .addItem("Beautify List", "formatWordStyleList")
    .addSeparator()
    .addItem("Spell & Grammar Check", "checkSpellingGrammar")
    .addToUi();

  // Second Menu: Download Sheet (with automation triggers)
  ui.createMenu("Download Sheet")
    .addItem("Download Current Sheet", "exportViaTitleAndRollWeek")
    .addSeparator()
    .addSubMenu(
      ui
        .createMenu("Triggers")
        .addItem("Setup Weekly Triggers", "setupAutomationTriggers")
        .addSeparator()
        .addItem("Show Current Triggers", "showTriggers")
    )
    .addToUi();
}

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
    .map((trigger, index) => {
      return `#${index + 1}
Function: ${trigger.getHandlerFunction()}
Type: ${trigger.getEventType()}
Source: ${trigger.getTriggerSource()}`;
    })
    .join("\n\n");

  ui.alert("Current Triggers", triggerInfo, ui.ButtonSet.OK);
}

function createDailyTrigger() {
  ScriptApp.newTrigger("rollSheetAndSendEmail")
    .timeBased()
    .everyDays(1) // Runs every day
    .atHour(18) // 6 PM (24-hour format)
    .create();
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
    const teamNameValue = data[i][0];
    let teamName = "";

    // Check if teamNameValue is a string before trimming
    if (typeof teamNameValue === "string") {
      teamName = teamNameValue.trim();
    } else if (teamNameValue !== null && teamNameValue !== undefined) {
      // Log a warning if a non-string value is encountered
      Logger.warn(
        `Non-string value found in TeamConfig column A at row ${
          i + 1
        }: ${teamNameValue}. Skipping row.`
      );
      continue; // Skip to the next row
    } else {
      // Skip empty or null/undefined team names
      continue;
    }

    const emails = [];

    // Iterate through columns starting from the second column to collect emails
    for (let j = 1; j < data[i].length; j++) {
      const emailValue = data[i][j];
      if (typeof emailValue === "string") {
        const email = emailValue.trim();
        if (email) {
          emails.push(email);
        }
      } else if (emailValue !== null && emailValue !== undefined) {
        Logger.log(
          `Non-string email value found in TeamConfig at row ${i + 1}, column ${
            j + 1
          }: ${emailValue}. Skipping.`
        );
      }
    }

    if (teamName && emails.length > 0) {
      if (teamName === "Managers") {
        managers = emails;
      } else {
        teamConfig[teamName] = {
          members: emails,
        };
      }
    }
  }

  Object.keys(teamConfig).forEach((team) => {
    teamConfig[team].managers = managers;
  });

  return teamConfig;
}

function checkEmptyCellsAndNotify() {
  const allowedUsers = [
    "pallavp@suntechnologies.com",
    "basavarajchannapattan@gmail.com",
  ];
  const currentUser = Session.getEffectiveUser().getEmail();

  if (!allowedUsers.includes(currentUser)) {
    Logger.log(`Unauthorized trigger by ${currentUser} - Ignored`);
    return; // Stop execution
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const emptyCellsInfo = checkEmptyCellsForTeams(sheet);

  Logger.log("Checking empty cells...");

  for (let team in emptyCellsInfo) {
    if (emptyCellsInfo[team].length > 0) {
      sendEmailToTeam(team, emptyCellsInfo[team]);
    }
  }

  if (Object.values(emptyCellsInfo).every((arr) => arr.length === 0)) {
    Logger.log("All cells are filled. No empty cells.");
  }
}

function checkEmptyCellsForTeams(sheet) {
  const teamConfig = readTeamConfig();
  const teamsToCheck = Object.keys(teamConfig).filter(
    (team) => team !== "Manager"
  );
  const emptyCellsInfo = {};

  Logger.log("Checking for empty status cells...");
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    Logger.log("Sheet is empty or only has headers.");
    return emptyCellsInfo;
  }

  const teamNamesColumn = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  const statusColumn = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
  const sheetDataMap = {};
  for (let i = 0; i < teamNamesColumn.length; i++) {
    const teamName = teamNamesColumn[i][0]?.toString().trim();
    const statusValue = statusColumn[i][0];
    const rowNumber = i + 2;

    if (teamName) {
      sheetDataMap[teamName] = {
        row: rowNumber,
        status: statusValue,
      };
    }
  }

  teamsToCheck.forEach((team) => {
    const teamData = sheetDataMap[team];

    if (!teamData) {
      Logger.log(`Team "${team}" from TeamConfig not found in the sheet.`);
      // Optionally, you could add this as a missing team issue
      return;
    }

    const statusValue = teamData.status;
    const rowNumber = teamData.row;

    if (
      !statusValue ||
      statusValue.toString().trim() === "" ||
      statusValue === null ||
      statusValue === undefined
    ) {
      if (!emptyCellsInfo[team]) emptyCellsInfo[team] = [];
      emptyCellsInfo[team].push(`Row ${rowNumber}`);
      Logger.log(`Found empty cell for ${team} at Row ${rowNumber}`);
    }
  });

  return emptyCellsInfo;
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

  const now = new Date();
  if (now.getDate() === 1 && now.getHours() === 22) {
    const managers = getTeamManagers(team);
    MailApp.sendEmail({
      to: teamMembers.join(","),
      cc: managers.join(","),
      subject: subject,
      body: body,
    });

    Logger.log(
      `Final reminder sent to team (${teamMembers.join(
        ","
      )}), CCed to managers (${managers.join(",")})`
    );
  } else {
    MailApp.sendEmail(teamMembers.join(","), subject, body);

    Logger.log(`Email sent to ${team} members: ${teamMembers.join(", ")}`);
  }
}

function rollSheetAndSendEmail() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const currentSheet = spreadsheet.getActiveSheet();
  const sheetName = currentSheet.getName();

  const lastRow = currentSheet.getLastRow();
  if (lastRow < 2) {
    Logger.log("No data to check.");
    return;
  }

  // Get all values from column B (status column) starting from row 2
  const statusRange = currentSheet.getRange(`B2:B${lastRow}`);
  const statuses = statusRange.getValues();

  // Check if all statuses are filled (not empty)
  const allFilled = statuses.every((row) => row[0] !== "" && row[0] !== null);

  if (!allFilled) {
    Logger.log("Not all cells are filled. Rollover skipped.");
    return; // Exit early if incomplete
  }

  // Export and email XLSX
  const url = `https://docs.google.com/feeds/download/spreadsheets/Export?key=${spreadsheet.getId()}&exportFormat=xlsx`;
  const token = ScriptApp.getOAuthToken();
  const response = UrlFetchApp.fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const blob = response.getBlob().setName(`${sheetName}.xlsx`);

  MailApp.sendEmail({
    to: "pallavp@suntechnologies.com",
    subject: `Weekly Sheet: ${sheetName}`,
    body: `Attached is the completed sheet for ${sheetName}.`,
    attachments: [blob],
  });

  const today = new Date();
  const { monday, friday } = getWeekMondayFriday(today);

  let newMonday, newFriday;
  if (today > friday) {
    newMonday = new Date(
      monday.getFullYear(),
      monday.getMonth(),
      monday.getDate() + 7
    );
    newFriday = new Date(
      friday.getFullYear(),
      friday.getMonth(),
      friday.getDate() + 7
    );
  } else {
    newMonday = monday;
    newFriday = friday;
  }

  const formatDate = (d) => d.getDate().toString().padStart(2, "0");
  const newSheetName = `Week ${formatDate(newMonday)} - ${formatDate(
    newFriday
  )}`;

  // Delete existing sheet with same name if exists
  const existingSheet = spreadsheet.getSheetByName(newSheetName);
  if (existingSheet) {
    spreadsheet.deleteSheet(existingSheet);
  }

  // Copy current sheet and rename
  const newSheet = currentSheet.copyTo(spreadsheet).setName(newSheetName);

  // Clear statuses in column B on new sheet
  const newLastRow = newSheet.getLastRow();
  if (newLastRow >= 2) {
    newSheet.getRange(`B2:B${newLastRow}`).clearContent();
  }

  // Hide old sheet
  currentSheet.hideSheet();

  Logger.log(`Rolled over to new sheet: ${newSheetName} and hid ${sheetName}`);
}

function getWeekMondayFriday(date) {
  const day = date.getDay(); // Sunday=0
  const diffToMonday = day === 0 ? 1 : day - 1;
  const monday = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - diffToMonday
  );
  const friday = new Date(
    monday.getFullYear(),
    monday.getMonth(),
    monday.getDate() + 4
  );
  return { monday, friday };
}

function sendFinalReminderToManagers(team, emptyInfo) {
  if (!emptyInfo || emptyInfo.length === 0) return;

  const managers = getTeamManagers(team);
  const teamMembers = getTeamMembers(team); //.

  if (managers.length === 0) {
    Logger.log(`No managers found for team: ${team}`);
    return;
  }
  //.
  if (teamMembers.length === 0) {
    Logger.log(`No team members found for team: ${team}`);
    return;
  } //.

  const spreadsheetUrl = SpreadsheetApp.getActiveSpreadsheet().getUrl();
  const subject = `Final Reminder: ${team} status update missing`;

  const body =
    `Hi ${team} Team,\n\n` +
    `This is your final reminder. The following status updates for the ${team} team are still missing:\n\n` +
    `${emptyInfo.join("\n")}\n\n` +
    `Please ensure the status is updated here: ${spreadsheetUrl}\n\n` +
    `Regards,\nStatus Bot`;

  MailApp.sendEmail({
    to: teamMembers.join(","),
    cc: managers.join(","),
    subject: subject,
    body: body,
  });
  Logger.log(
    `Final reminder sent to team (${teamMembers.join(
      ","
    )}), CCed to managers (${managers.join(",")})`
  );
}

function getTeamMembers(team) {
  const teamConfig = readTeamConfig();
  return teamConfig[team]?.members || [];
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

function deleteAllTriggers() {
  const allTriggers = ScriptApp.getProjectTriggers();
  allTriggers.forEach((trigger) => ScriptApp.deleteTrigger(trigger));
  Logger.log("Deleted all triggers.");
}

function setupAutomationTriggers() {
  deleteAllTriggers();

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
    .atHour(21)
    .create();

  Logger.log("Automation triggers set up successfully");
}
