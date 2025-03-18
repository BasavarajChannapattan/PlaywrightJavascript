import { expect, test, page } from "@playwright/test";

test("Playwright special locators", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://rahulshettyacademy.com/angularpractice/");

  //getByLabel prefered to use checkbox and radions buttons
  await page.getByLabel("Employed").click();
  await page.getByLabel("Check me out if you Love IceCreams!").click();
  await page.getByLabel("Gender").selectOption("Male");
  //await page.getByLabel("Password").fill("ASDfasf"); // when we have text on the field it will work
  //await page.getByLabel("Name").fill("Basava"); -> fill wont support here does not have text

  //getByPlaceHolder
  await page.getByPlaceholder("Password").fill("Basava@123");
  await page.getByRole("button", { name: "Submit" }).click();
  await page
    .getByText("Success! The Form has been submitted successfully!.")
    .isVisible();
  await page.getByRole("link", { name: "Shop" }).click();
  await page
    .locator("app-card")
    .filter({ hasText: "Nokia Edge" })
    .getByRole("button")
    .click();
});
