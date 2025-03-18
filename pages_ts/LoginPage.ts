import { BasePage } from "./basePage.js";
import { Page, Locator } from "@playwright/test";
export class LoginPage extends BasePage {
  page: Page;
  usernameInput: Locator;
  passwordInput: Locator;
  loginButton: Locator;
  constructor(page: Page) {
    super(page);
    this.page = page;
    this.usernameInput = page.locator("[placeholder='Username']");
    this.passwordInput = page.locator("[placeholder='Password']");
    this.loginButton = page.locator("#login-button");
  }

  async goto() {
    await this.page.goto("https://www.saucedemo.com/");
  }

  async isLoginPageVisible() {
    await this.usernameInput.isVisible();
    await this.passwordInput.isVisible();
    await this.loginButton.isEnabled();
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
