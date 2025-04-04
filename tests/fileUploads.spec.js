import { test, expect } from "@playwright/test";
import fs from "fs";
test("File Upload Test", async ({ page }) => {
  await page.goto("https://www.file.io/"); // Example file upload site

  // Locate the file input element and upload a file
  await page.setInputFiles('input[type="file"]', "tests/uploadFiles/test2.txt");

  // Verify if the file is uploaded
  const uploadedFile = await page.locator(".file-name");
  // await expect(uploadedFile).toBeVisible();
});

//how to download a file using playwright?
test("File Download Test", async ({ page }) => {
  await page.goto("https://example.com/download");
  const download = await page.waitForEvent("download", async () => {
    await page.click("a#download-link");
  });
  const filePath = "downloads/example-file.pdf";
  await download.saveAs(filePath);
  expect(fs.existsSync(filePath)).toBeTruthy();
});
