// @ts-check
import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: 1,

  workers: process.env.CI ? 1 : undefined,

  projects: [
    {
      name: "chrome",
      use: {
        headless: false,
        trace: "retain-on-failure",
        timeout: 5000,
        browserName: "chromium",
        screenshot: "only-on-failure",
        ignoreHTTPSErrors: true,
        video: "retain-on-failure",
        //iewport: { width: 720, height: 720 },
        //...devices["iPhone 14"],
      },
    },
    {
      name: "firefox",
      use: {
        headless: true,
        trace: "retain-on-failure",
        timeout: 5000,
        browserName: "firefox",
        screenshot: "only-on-failure",
        ignoreHTTPSErrors: true,
      },
    },

    {
      name: "webkit",
      use: {
        headless: true,
        trace: "retain-on-failure",
        timeout: 5000,
        browserName: "webkit",
        screenshot: "only-on-failure",
        ignoreHTTPSErrors: true,
      },
    },
  ],
  reporter: "html",
  use: {
    headless: true,
    trace: "retain-on-failure",
    timeout: 5000,
    browserName: "firefox",
    screenshot: "only-on-failure",
    ignoreHTTPSErrors: true,
  },
  expect: {
    timeout: 5000,
  },
});
