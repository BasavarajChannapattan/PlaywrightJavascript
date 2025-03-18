// Import Playwright Test
import { expect, test, page } from "@playwright/test";

// Test Suite
test.describe("API Login and UI Test", () => {
  test("Login via API and perform UI actions", async ({ page }) => {
    // Step 1: Perform API Login
    const response = await page.request.post(
      "https://automationexercise.com/api/login",
      {
        data: {
          email: "lawaf55183@dmener.com",
          password: "Abcd1234!",
        },
      }
    );

    // Check if the login was successful
    expect(response.status()).toBe(200);
    const responseData = await response.json();
    const token = responseData.token;
    expect(token).toBeDefined();

    // Step 2: Use the token in UI
    await page.context().addCookies([
      {
        name: "auth_token",
        value: token,
        domain: "automationexercise.com",
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "Lax",
      },
    ]);

    // Step 3: Navigate to the website
    await page.goto("https://automationexercise.com");

    // Verify user is logged in
    await expect(page.locator('a[href="/logout"]')).toBeVisible();
    console.log("✅ Successfully logged in via API and verified in UI!");
  });
});
