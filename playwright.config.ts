import { defineConfig } from "@playwright/test";

export default defineConfig({
  quiet: false,
  use: {
    baseURL: "https://dev.portal.2k.com/",
    video: process.env.PWVIDEO === "true" ? "on" : "off",
    headless: false,
  },

  expect: {
    timeout: 30 * 1000,
  },

  testDir: "./tests-generations",

  projects: [
    {
      name: "firefox",
      use: {
        browserName: "firefox",
      },
    },
    {
      name: "chromium",
      use: {
        browserName: "chromium",
      },
    },
    {
      name: "webkit",
      use: {
        browserName: "webkit",
      },
    },
  ],

  timeout: 30 * 1000,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html"], ["list"]],
});
