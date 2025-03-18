import { BasePage } from "./basePage.js";
export class LoginPage extends BasePage {
  constructor(page) {
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
