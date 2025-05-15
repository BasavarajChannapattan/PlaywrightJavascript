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
        // Handle manager row
        managers = emails.split(",").map((email) => email.trim());
      } else {
        // Handle regular team rows
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

function sendFinalReminderToManagers(team, emptyInfo) {
  if (!emptyInfo || emptyInfo.length === 0) {
    Logger.log(`No missing info for ${team}, skipping manager notification.`);
    return;
  }

  const teamConfig = readTeamConfig();
  const managers = teamConfig[team]?.managers || [];

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

function testTeamConfig() {
  const teamConfig = readTeamConfig();
  Logger.log("Testing team configuration...");

  Object.keys(teamConfig).forEach((team) => {
    const members = teamConfig[team].members;
    const managers = teamConfig[team].managers;

    Logger.log(`\nTeam: ${team}`);
    Logger.log(`Members (${members.length}): ${members.join(", ")}`);
    Logger.log(`Managers (${managers.length}): ${managers.join(", ")}`);

    // Verify arrays
    if (!Array.isArray(members)) {
      Logger.log(`ERROR: Members for ${team} is not an array!`);
    }
    if (!Array.isArray(managers)) {
      Logger.log(`ERROR: Managers for ${team} is not an array!`);
    }
  });
}
