import { chromium, page, test, expect } from "@playwright/test";

test("Intercepting apis", async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.route("https://reqres.in/api/users/2", async (route) => {
    await route.fulfill({
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: "Janet",
        last_name: "Weaver",
      }),
    });
  });

  await page.goto("https://reqres.in/");
  await page.click("text=Request");

  //how do you run javascript in the browser console from playwright?
  await page.evaluate(() => {
    // This code will be executed in the browser context
    document.querySelector("#user_id").value = "2";
    button.click();
  });
});

test.describe.parallel("Parallel Test Suite", () => {
  test("Test 1", async ({ page }) => {
    await page.goto("https://example.com");
    await expect(page).toHaveTitle("Example Domain");
  });

  test("Test 2", async ({ page }) => {
    await page.goto("https://example.com/login");
    await expect(page.locator("h1")).toHaveText("Login");
  });
});
