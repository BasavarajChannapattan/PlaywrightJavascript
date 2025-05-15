import { Given, When, Then, setDefaultTimeout } from "@cucumber/cucumber";
import { expect, Browser, Page } from "@playwright/test";
import { pageFixtures } from "../support/pagefixtures";

setDefaultTimeout(6000);

Given("User search for a {string}", async function (book) {
  await pageFixtures.page.locator('input[type="Search"]').type(book);
  await pageFixtures.page.waitForTimeout(5000);
  await pageFixtures.page.locator("mat-option[role='option'] span");
});

When("User add the book to the cart", async function () {
  await pageFixtures.page.getByRole("button", { name: "Add to Cart" }).click();
});

Then("User should see the book in the cart", async function () {
  const cartCount = await pageFixtures.page
    .locator(".mat-badge-content")
    .textContent();
  console.log("Cart count is: ", cartCount);
  expect(cartCount).toBe("1");
});
