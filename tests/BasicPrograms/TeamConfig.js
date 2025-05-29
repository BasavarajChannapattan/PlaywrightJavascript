function formatTeamConfig_withEmailSplittingAndWiderCols() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("TeamConfig");

  if (!sheet) {
    SpreadsheetApp.getUi().alert(
      "Error",
      "TeamConfig sheet not found!",
      SpreadsheetApp.getUi().ButtonSet.OK
    );
    return;
  }

  const dataRange = sheet.getDataRange();
  const lastRow = dataRange.getLastRow();

  if (lastRow < 2) {
    SpreadsheetApp.getActive().toast("No data rows found to process/format.");
    Logger.log("No data rows found to process/format.");
    const headerRange = sheet.getRange(
      1,
      1,
      1,
      sheet.getLastColumn() > 0 ? sheet.getLastColumn() : 1
    );
    headerRange
      .setBackground("#4285f4")
      .setFontColor("white")
      .setFontWeight("bold")
      .setHorizontalAlignment("center");
    if (sheet.getLastColumn() > 0) {
      headerRange.setBorder(
        true,
        true,
        true,
        true,
        false,
        false,
        "black",
        SpreadsheetApp.BorderStyle.SOLID
      );
    }
    return;
  }

  for (let i = 2; i <= lastRow; i++) {
    const emailCell = sheet.getRange(i, 2);
    const emailValue = emailCell.getValue();

    if (emailValue && typeof emailValue === "string") {
      const emails = emailValue
        .split(/\s*,\s*/)
        .map((email) => email.trim())
        .filter((email) => email !== "");

      if (emails.length > 1) {
        emailCell.clearContent();
        const startColForSplit = 3;
        const numEmails = emails.length;
        sheet.getRange(i, startColForSplit, 1, numEmails).setValues([emails]);
      } else if (emails.length === 1) {
        emailCell.setValue(emails[0]);
      }
    }
  }

  const finalDataRange = sheet.getDataRange();
  const finalLastRow = finalDataRange.getLastRow();
  const finalLastCol = finalDataRange.getLastColumn();

  if (finalLastRow < 1 || finalLastCol < 1) {
    SpreadsheetApp.getActive().toast("Sheet is empty after processing.");
    Logger.log("Sheet is empty after processing.");
    return;
  }

  const headerRange = sheet.getRange(1, 1, 1, finalLastCol);
  headerRange
    .setBackground("#4285f4")
    .setFontColor("white")
    .setFontWeight("bold")
    .setHorizontalAlignment("center");

  if (finalLastRow >= 2) {
    const dataRowsRange = sheet.getRange(2, 1, finalLastRow - 1, finalLastCol);
    dataRowsRange.setBackground("white").setFontFamily("Arial").setFontSize(11);

    const teamNamesRange = sheet.getRange(2, 1, finalLastRow - 1, 1);
    teamNamesRange
      .setFontWeight("bold")
      .setBackground("#e8f0fe")
      .setHorizontalAlignment("left");

    const originalEmailsColRange = sheet.getRange(2, 2, finalLastRow - 1, 1);
    originalEmailsColRange.setWrap(true).setHorizontalAlignment("left");

    for (let i = 2; i <= finalLastRow; i++) {
      if (i % 2 === 0) {
        sheet.getRange(i, 1, 1, finalLastCol).setBackground("#f8f9fa");
        sheet.getRange(i, 1).setBackground("#e8f0fe");
      } else {
        sheet.getRange(i, 1, 1, finalLastCol).setBackground("white");
        sheet.getRange(i, 1).setBackground("#e8f0fe");
      }
    }
  }

  const columnWidthPixels = 300;

  if (finalLastCol > 0) {
    for (let j = 1; j <= finalLastCol; j++) {
      sheet.setColumnWidth(j, columnWidthPixels);
    }
  }

  if (finalLastRow > 0 && finalLastCol > 0) {
    finalDataRange.setBorder(
      true,
      true,
      true,
      true,
      true,
      true,
      "black",
      SpreadsheetApp.BorderStyle.SOLID
    );
    sheet
      .getRange(1, 1, 1, finalLastCol)
      .setBorder(
        false,
        false,
        true,
        false,
        false,
        false,
        "black",
        SpreadsheetApp.BorderStyle.SOLID
      );
  }

  SpreadsheetApp.getActive().toast(
    "Team configuration sheet processed and formatted"
  );
  Logger.log("Team configuration sheet processing and formatting completed");
}
