import { expect, test, page } from "@playwright/test";

test("Frames validation", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
  const framePage = page.frameLocator("#courses-iframe");
  await framePage.locator("li a[href*='lifetime']:visible").click();
  const text = await framePage.locator(".text h2").textContent();
  console.log(text.split(" ")[1]);
});

test("Intercepting network requests", async ({ page }) => {
  //need to go through the nework and request, response
  page.on("request", (req) =>
    console.log(`Request: ${req.method()},${req.resourceType()}  ${req.url()}`)
  );

  // page.on("response", (res) =>
  //   console.log(`Response: ${res.status()}, ${res.url()}`)
  // );

  await page.route("**/*", (route) => {
    if (route.request().resourceType() === "bundle.js") {
      route.abort();
    }

    return route.continue();
  });
  await page.goto("https://rahulshettyacademy.com/angularpractice/");

  await page.close();
});

test("Intercepting network requests for webshop", async ({ page }) => {
  const jsonResponse = [
    {
      id: 1,
      title: "Basava",
      author: "Ant One",
      genre: "fantasy",
      price: "9.95",
      rating: "★☆☆☆☆",
      stock: "1",
    },
  ];
  await page.route(
    "https://danube-webshop.herokuapp.com/api/books",
    (route) => {
      route.fulfill({
        contentType: "application/json",
        body: JSON.stringify(jsonResponse),
      });
    }
  );

  await page.goto("https://danube-webshop.herokuapp.com/");
  await page.close();
});
