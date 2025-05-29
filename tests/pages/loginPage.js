exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.loginButton = page.locator("#login2");
    this.userNameInput = page.locator("#loginusername");
    this.passwordInput = page.locator("#loginpassword");
    this.submitButton = page.locator("//button[normalize-space()='Log in']");
  }

  async gotoLoginPage() {
    await this.page.goto("https://www.demoblaze.com/index.html");
  }

  async login(username, password) {
    await this.loginButton.click();
    await this.userNameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
};
