import { expect, test } from "@playwright/test";
test("Assertion", async function ({ page }) {
  await page.goto("https://google.com");
  const title = await page.title();
  const searchBar = await page.locator("//textarea[@id='APjFqb']");
  expect(searchBar).toBeVisible();

  console.log(title);
  await page.waitForTimeout(3000);
  await page.close();
});
