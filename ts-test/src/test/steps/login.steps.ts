import { Given, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { pageFixtures } from "../support/pagefixtures";

Given("User navigates to the application", async function () {
  await pageFixtures.page.goto("https://bookcart.azurewebsites.net/");
});

Given("User click on the login link", async function () {
  await pageFixtures.page.getByRole("button", { name: "Login" }).click();
});

Given("User enter the username as {string}", async function (username) {
  await pageFixtures.page
    .locator('[formcontrolname="username"]')
    .fill(username);
});

Given("User enter the password as {string}", async function (Password) {
  await pageFixtures.page
    .locator("[formcontrolname='password']")
    .fill(Password);
});

Given("User click on the login button", async function () {
  await pageFixtures.page.getByRole("button", { name: "Login" }).nth(1).click();
});

Then("User should be redirected to the home page", async function () {
  const title = await pageFixtures.page.title();
  console.log("Page title is: ", title);
  await expect(title).toBe("Login");
});
