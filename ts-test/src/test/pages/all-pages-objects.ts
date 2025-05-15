import { BrowserContext, Page } from "playwright/test";
import { BasePage } from "../pages/basePage";
export class AllPageObjects {
  basePage: BasePage;

  constructor(public page: Page, public context: BrowserContext) {
    this.basePage = new BasePage(page, context);
  }
}
