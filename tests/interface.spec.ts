import { test, expect } from "@playwright/test";
interface user {
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

const userData: user = {
  username: "standard_user",
  password: "secret_sauce",
  firstName: "John",
  lastName: "Doe",
};

test("Login with valid credentials", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  await page.fill("#user-name", userData.username);
  await page.fill("#password", userData.password);
  await page.click("#login-button");
});


