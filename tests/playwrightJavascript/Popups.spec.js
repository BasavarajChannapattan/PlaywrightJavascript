import { expect, test, page } from "@playwright/test";

//test.describe.configure({ mode: "parallel" });
test("Pop-Up validation", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
  await expect(page.locator("#displayed-text")).toBeVisible();
  await page.locator("#hide-textbox").click();
  await expect(page.locator("#displayed-text")).toBeHidden();

  //handling dailogs or alert pop-ups
  page.on("dialog", (dailog) => dailog.accept());
  await page.locator("#confirmbtn").click();

  //handling mouse over in playwright
  await page.locator("#mousehover").hover();
});

test("@smoke Visual Testing", async ({ page }) => {
  await page.goto("https://google.com");
  expect(await page.screenshot()).toMatchSnapshot("landed.png");
});
