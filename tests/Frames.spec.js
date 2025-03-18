import { expect, test, page } from "@playwright/test";

test("Frames validation", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
  const framePage = page.frameLocator("#courses-iframe");
  await framePage.locator("li a[href*='lifetime']:visible").click();
  const text = await framePage.locator(".text h2").textContent();
  console.log(text.split(" ")[1]);
});
