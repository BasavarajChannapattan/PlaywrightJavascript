exports.HomePage = class HomePage {
  constructor(page) {
    this.page = page;
    this.productList = page.locator("//*[@id='tbodyid']/div/div/div/h4/a");
    this.cartButton = page.locator("//a[normalize-space()='Add to cart']");
    this.cartLink = page.locator("#cartur");
  }

  async addProductToCart(productName) {
    const productList = await this.productList.all();

    for (const product of productList) {
      const productText = await product.textContent();
      if (productText.includes(productName)) {
        // Setup dialog handler BEFORE clicking
        this.page.once("dialog", async (dialog) => {
          if (dialog.message().includes("Product added")) {
            console.log("Product added to cart successfully");
          }
          await dialog.accept();
        });

        await product.click();
        await this.cartButton.click();
        break;
      }
    }
  }

  async goToCart() {
    await this.cartLink.click();
  }
};
