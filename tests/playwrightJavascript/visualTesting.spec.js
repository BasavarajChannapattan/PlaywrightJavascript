import { expect, test, page } from "@playwright/test";

test("Visual Testing", async ({ page }) => {
  await page.goto("https://google.com");
  expect(await page.screenshot()).toMatchSnapshot("landed.png");
});
