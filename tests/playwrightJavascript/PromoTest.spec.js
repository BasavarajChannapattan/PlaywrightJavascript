import { expect, test } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";
import { HomePage } from "../pages/HomePage";
import { CartPage } from "../pages/CartPage";

test("Promo Test", async ({ page }) => {
  //Login Page

  const login = new LoginPage(page);
  await login.gotoLoginPage();
  await login.login("Basava", "Abcd1234!");

  //Home Page
  const home = new HomePage(page);
  await home.addProductToCart("Samsung galaxy s6");
  await home.goToCart();

  //Cart Page
  const cartPage = new CartPage(page);
  await page.waitForTimeout(3000); // Wait for 2 seconds to ensure the cart is updated
  const status = await cartPage.checkProductsInCart("Samsung galaxy s6");
  expect(await status).toBeTruthy();
});
