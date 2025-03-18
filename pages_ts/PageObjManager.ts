import { LoginPage } from "./LoginPage";
import { Productpage } from "../pages/Productpage";
import { Page } from "@playwright/test";
export class PageObjManager {
  loginPage: LoginPage;
  productPage: Productpage;
  page: Page;

  constructor(page: Page) {
    this.page = page;
    this.loginPage = new LoginPage(this.page);
    this.productPage = new Productpage(this.page);
  }

  getLoginPage() {
    if (!this.loginPage) {
      this.loginPage = new LoginPage(this.page);
    }
    return this.loginPage;
  }

  getProductPage() {
    if (!this.productPage) {
      this.productPage = new Productpage(this.page);
    }
    return this.productPage;
  }
}
