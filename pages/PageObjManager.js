import { LoginPage } from "./LoginPage";
import { Productpage } from "../pages/Productpage";
export class PageObjManager {
  constructor(page) {
    this.page = page;
    this.LoginPage = LoginPage;
    this.Productpage = Productpage;
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
