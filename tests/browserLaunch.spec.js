import { page, chromium, test } from "@playwright/test";

test("Browser launch", async () => {
  const browser = await chromium.launch({ headless: false });
  await page.context().storageState({ path: "auth.json" });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://example.com");
  await page.screenshot({ path: "example.png" });
  await browser.close();
});

test.use({ storageState: "auth.json" });
