const { test, expect } = require("@playwright/test");

test("DatePicker", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/offers");

  await page.locator(".react-date-picker__inputGroup").click();
  await page.locator(".react-calendar__navigation__label__labelText").click();
  await page.locator(".react-calendar__navigation__label__labelText").click();
  await page.getByText(year).click();
  await page.locator("");

  await page
    .locator(".react-calendar__tile")
    .nth(Number(month) - 1)
    .click();

  await page.locator("//abbr[text()='" + date + "']").click();
});

test("Calender", async ({ page }) => {
  const month = "December";
  const year = "2027";

  await page.goto("https://jqueryui.com/datepicker/");
  const frame = page.frameLocator("iframe[class='demo-frame']");
  await frame.locator("#datepicker").click();

  while (true) {
    const currentMonth = await frame
      .locator(".ui-datepicker-month")
      .textContent();
    const currentYear = await frame
      .locator(".ui-datepicker-year")
      .textContent();
    if (currentMonth == month && currentYear == year) {
      break;
    }
    await frame.locator(".ui-icon-circle-triangle-e").click();
  }
});

test("baseWeb", async ({ page }) => {
  const monthYear = "December, 2027";

  await page.goto("https://air-datepicker.com/");
  while (true) {
    const currentMonthYear = await page
      .locator(".air-datepicker-nav--title")
      .textContent();
    console.log(currentMonthYear);

    if (currentMonthYear.trim() === monthYear) {
      break;
    } else {
      await page.locator("[data-action='next']").click();
    }
  }
});
