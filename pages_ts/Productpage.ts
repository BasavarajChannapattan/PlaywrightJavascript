import { BasePage } from "./basePage.js";
import testData from "../data/user.json";
import { inventoryContainer, burgerMenuBtn } from "../pages/Constants.js";
import { Locator, Page } from "@playwright/test";

export class Productpage extends BasePage {
  page: Page;
  products: Locator;

  constructor(page) {
    super(page);
    this.page = page;
    this.products = page.locator(".inventory_item");
  }

  async addItemToCart(itemName: string) {
    const productsList = await this.products.all();
    for (const product of productsList) {
      const name = await product.locator(".inventory_item_name").textContent();

      if (name && name.trim() === itemName) {
        await product.locator(".btn_inventory").click();
        console.log(`${itemName} product is added to the cart`);
        return true;
      }
    }

    return false;
  }

  async inventoryContainerVisible() {
    return await this.isElementVisible(
      inventoryContainer,
      testData.notVisibleText
    );
  }

  async burgerButtonVisible() {
    return await this.isElementVisible(burgerMenuBtn, testData.notVisibleText);
  }

  async burgerButtonClick() {
    return await this.waitAndClick(burgerMenuBtn);
  }
}
