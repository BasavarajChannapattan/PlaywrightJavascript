import { Given, When, Then, Before, After } from "@cucumber/cucumber";
import { Browser, chromium, expect } from "@playwright/test";
import { ICustomWorld } from "../support/custom_world";

let browser: Browser;

Before(async function (this: ICustomWorld) {
  browser = await chromium.launch({ headless: false });
  this.context = await browser.newContext();
  this.page = await this.context.newPage();
});

After(async function () {
  await browser.close();
});

Given("I am on the login page", async function (this: ICustomWorld) {
  await this.page?.goto("https://www.saucedemo.com/");
  await expect(await this.page?.title()).toBe("Swag Labs");
});

When(
  "I enter valid username and password",
  async function (this: ICustomWorld) {
    await this.page?.fill("#user-name", "standard_user");
    await this.page?.fill("#password", "secret_sauce");
  }
);

When(
  "I enter {string} as username",
  async function (this: ICustomWorld, username: string) {
    await this.page?.fill("#user-name", username);
  }
);

When(
  "I enter {string} as password",
  async function (this: ICustomWorld, password: string) {
    await this.page?.fill("#password", password);
  }
);

When("I click the login button", async function (this: ICustomWorld) {
  await this.page?.click("#login-button");
});

Then("I should be logged in successfully", async function () {
  await expect(this.page).toHaveURL("https://www.saucedemo.com/inventory.html");
  await expect(this.page.locator(".inventory_list")).toBeVisible();
});

Then("I should see {string}", async function (result: string) {
  switch (result) {
    case "successful login":
      await expect(this.page).toHaveURL(
        "https://www.saucedemo.com/inventory.html"
      );
      await expect(this.linkpage.locator(".inventory_list")).toBeVisible();
      break;

    case "user is locked out":
      const errorMessage = await this.page?.locator('[data-test="error"]');
      await expect(errorMessage).toContainText(
        "Sorry, this user has been locked out"
      );
      break;

    case "invalid credentials":
      const error = await this.page?.locator('[data-test="error"]');
      await expect(error).toContainText("Username and password do not match");
      break;

    default:
      throw new Error(`Result "${result}" is not defined`);
  }
});
