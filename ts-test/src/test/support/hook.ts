import { After, AfterAll, BeforeAll } from "@cucumber/cucumber";
import { Browser, chromium, Page } from "@playwright/test";
import { pageFixtures } from "./pagefixtures";

let browser: Browser;
let page: Page;

BeforeAll(async function () {
  console.log("Before all hooks");
  browser = await chromium.launch({ headless: false });
  page = await browser.newPage();
  pageFixtures.page = page;
});

AfterAll(async function () {
  console.log("After all hooks");
  await pageFixtures.page.close();
  await browser.close();
});
