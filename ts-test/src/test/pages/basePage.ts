import { Page, Browser, BrowserContext, Locator } from "@playwright/test";
export class BasePage {
  context: BrowserContext;
  page: Page;
  header: Locator;

  constructor(page: Page, context: BrowserContext) {
    this.context = context;
    this.page = page;
    this.header = this.page.locator("h1");
  }
}
