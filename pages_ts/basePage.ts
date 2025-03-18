import { expect, test, Page } from "@playwright/test";

export class BasePage {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async getTitle() {
    return await this.page.title();
  }

  async pause() {
    return await this.page.pause();
  }

  async getUrl() {
    return this.page.url();
  }

  async wait() {
    return this.page.waitForTimeout(10000);
  }

  async waitAndFill(selector, text) {
    return await this.page.fill(selector, text);
  }

  async isElementVisible(selector, errorMessage) {
    const element = this.page.locator(selector);
    const count = await element.count();

    if (count === 0) {
      throw new Error(`No elements found for selector: ${selector}`);
    }

    for (let i = 0; i < count; ++i) {
      const isVisible = await element.nth(i).isVisible();
      if (!isVisible) {
        throw new Error(errorMessage || `Element ${selector} is not visible`);
      }
    }
  }

  async isElementEnabled(selector, errorMessage) {
    const element = this.page.locator(selector);
    try {
      const isEnabled = await element.isEnabled();
      expect(isEnabled).toBeTruthy();
    } catch (error) {
      throw new Error(`${errorMessage}`);
    }
  }
}
