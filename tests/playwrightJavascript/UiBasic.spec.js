import { expect, test, page } from "@playwright/test";

test("Browser Context playwright title", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const userName = page.locator("#username");
  const sign = page.locator("[type='submit']");
  const cardtitle = page.locator(".card-body a");
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  await userName.type("rahulshetty");
  await page.locator("#password").fill("learning");
  await sign.click();
  console.log(await page.locator("[style*='block']").textContent());
  await expect(await page.locator("[style*='block']")).toContainText(
    "Incorrect"
  );
  await userName.fill("");
  await userName.fill("rahulshettyacademy");
  await sign.click();
  console.log(await cardtitle.first().textContent());
  console.log(await cardtitle.last().textContent());
  console.log(await cardtitle.nth(0).textContent());
  console.log(await cardtitle.nth(1).textContent());
});

test("Dropdown and check box", async ({ page }) => {
  const userName = page.locator("#username");
  const docLink = page.locator("[href*='documents']");
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");

  //dropdowns
  await userName.fill("rahulshettyacademy");
  await page.locator("#password").fill("learning");
  await page.locator("[type='submit']");
  const dropdown = await page.locator("select.form-control");
  dropdown.selectOption("Teacher");

  //Radio button
  await page.locator(".radiotextsty").last().click();
  await page.locator("#okayBtn").click();
  console.log(await page.locator(".radiotextsty").last().isChecked());
  await expect(page.locator(".radiotextsty").last()).toBeChecked();

  //CheckBox Buttons
  await page.locator("#terms").click();
  await expect(page.locator("#terms")).toBeChecked();
  await page.locator("#terms").uncheck();
  expect(await page.locator("#terms").isChecked()).toBeFalsy();

  //blinking links
  await expect(docLink).toHaveAttribute("class", "blinkingText");
});

test("@smoke Window handling", async ({ browser }) => {
  //
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  const docLink = page.locator("[href*='documents']");
  await expect(docLink).toHaveAttribute("class", "blinkingText");

  //create new page context
  const pagePromise = context.waitForEvent("page");
  docLink.click();
  const newPage = await pagePromise;
  await newPage.waitForLoadState("domcontentloaded");
  const text = await newPage.locator(".im-para.red").textContent();

  const arrayText = text.split("@");
  const domain = arrayText[1].split(" ")[0];

  //going back to main page
  await page.locator("#username").type(domain);
  console.log(await page.locator("#username").textContent());
  await expect(page).toHaveTitle(/.*Practise/);
});

test("ScreenShot", async ({ page }) => {
  const userName = page.locator("#username");
  const cardtitle = page.locator(".card-body a");
  const sign = page.locator("[type='submit']");
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  await userName.fill("rahulshettyacademy");
  await page.locator("#password").fill("learning");
  await sign.click();

  //to take fullpagescreen shot
  await page.screenshot({ path: "screenshot1.png", fullPage: true });
  // await page.locator("#password").screenshot({ path: "screenshot.png" });
  await cardtitle.first().screenshot({ path: "screenshot2.png" });
});
