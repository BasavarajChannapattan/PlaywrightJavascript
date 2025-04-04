## 10/03/2025

- Installed and set up Playwright project.
- Learned about project structure.
- Wrote every test in an asynchronous manner.
- Explored Playwright configuration: executing in different browsers, setting global timeouts, etc.
- Learned how to run tests in headless mode.
- Studied browser context and page objects.
- Used assertions like `toHaveTitle()`, `title()`, `toContainText()`.
- Used `fill` method to insert data into fields.
- Used `expect` to add assertions.
- Extracted text from the browser and compared values using `toContainText()`.
- Worked with multiple elements using `first`, `last`, and `nth` index methods in Playwright.

## 11/03/2025

- Used `selectOption` method for dropdowns.
- Verified dropdown selection using pause and visual verification.
- Performed radio button clicks.
- Used assertions like `isChecked()` and `toBeChecked()`.
- Used `uncheck()` method to perform unchecking.
- Handled multiple windows:
  - Created a new browser context.
  - Used `context.newContext()` (without `await`).
  - Resolved promises for multiple windows:
    ```js
    const [newPage] = Promise.all([
      context.waitForEvent("page"),
      docLink.click(),
    ]);
    ```
- Explored Playwright Inspector for debugging.
- Learned about video recording using `codegen`.

## 12/03/2025

- Implemented Playwright special locators for login.
- Worked with date pickers.
- Handled iframes using `frameLocator`.

## 13/03/2025

- Handled hidden elements using assertions `toBeVisible()` and `toBeHidden()`.
- Managed dialogs using:
  ```js
  page.on("dialog", (dialog) => dialog.accept());
  ```
- Performed mouse hover actions using `hover()`.
- Worked with iframes (frames don’t have knowledge of parent page).
- Used `frameLocator()` method.
- Integrated API testing inside Playwright scripts:
  - Performed login via API.
  - Used `hooks` method with `requestContext()`.
  - Called APIs using HTTP methods with necessary fields.
  - Stored cookies in the response.
  - Passed tokens to local storage using `page.addInitScript()`.
- Implemented visual testing by comparing screenshots.

## 14/03/2025

- Implemented reusable methods.
- Used constructors, classes, and ES6 import/export.

## 17/03/2025

- Utilized Playwright Inspector’s "Copy Prompt" feature for debugging failed tests.
- Created custom test configurations using `--config` command.
- Configured viewport size, devices, and screenshots.
- Handled SSL certificate errors using `isHTTPHandle: true`.
- Ran tests in parallel by default and configured workers.
- Ran tests in serial mode using:
  ```js
  test.describe.configure({ mode: "serial" });
  ```
- Executed specific tests using tags and `--grep`.

## 18/03/2025

- Installed Jenkins locally using the `jenkins.war` file.
- Started Jenkins with:
  ```sh
  java -jar jenkins.war --httpPort=9090
  ```
- Created a new item in Jenkins, added the local project workspace path, and configured parameters.
- Chose execution command (Windows batch in this case).
- Added command for execution based on defined parameters (e.g., `npm run %script%`).
- Performed CI/CD integration using a custom workspace from Jenkins configuration.
- Learned differences between JavaScript and TypeScript.
- Converted Playwright JavaScript tests to TypeScript.

## Allure Reports

- Stored reports using:
  ```sh
  npx playwright test --reporter=line --reporter=allure-playwright
  ```
- Generated reports using:
  ```sh
  allure generate ./allure-results --clean
  ```
- Opened reports using:

  ```sh
  allure open ./allure-report
  ```

  ## Playwright devops solution using AZURE DEVOPS

  -- Inroduction about azure cloud
  -- created azure cloud free account
  -- run the tests parallel in azure cloud

install all the dependecies related to azure playwright

npm init @azure/microsoft-playwright-testing
az login
npx playwright test --config=playwright.service.config.ts --workers=20

https://playwright.microsoft.com/workspaces/westeurope_179b5264-5bce-455b-80eb-f2201b400a38

# Playwright Basics

1. What is Playwright, and how does it compare to Selenium?
2. How do you install and set up Playwright in a TypeScript project?
3. What browsers does Playwright support?->chrome,webkit,firefox
4. How can you launch a browser in Playwright, and what are the different modes?

-> const browser = await chromium.launch({ headless: false }); -> open browser
const context = await browser.newContext(); -> to create the context of the browser(like, session, cookie, settings)
const page = await context.newPage();-> to launch the new page

5.  What is the difference between page.locator() and page.$()?
   -> page.locator()
       - supports to find multiple elements,it has auto wait more faster
   -> page.$()

                          - no return type, only single element, it doe not have auto wait and very slower

6.  How do you handle waiting in Playwright?
    -> waitForSelector-> it's explicit wait it will until element found
    -> waitFor-> it's implicit wait it has capable of auto-wait before click
    -> waitForLoadState-> wait for fully page to load
    -> waitForTimeout-> wait by hardcoding the time - not recomended
    -> globaltimeOut-> from the playwright config file we can setTimeout for assertion and also time of excution file

7.  How can you run Playwright tests in headless mode?

8.  How do you capture screenshots and videos in Playwright?
    -> we can capture based on the certin conditins like only on failures and on and off
    -> we can also set capture for full page and particular element as well
    -> video also similar as screenshots

# Playwright Advanced

9. How do you handle iframes in Playwright?
   -> page.frameLocator-> it will allow you to interct with element
   -> page.frame-> when we don't have locator by giving the name and url we can perform

10. How can you intercept network requests in Playwright?
    -> we can intercept the request using page.route to make request to set custom obj resposne rout.fullfill

11. What are fixtures in Playwright?
    -> Fixtures in Playwright are reusable pieces of setup and teardown logic that help in managing test dependencies like browser, context, page, API clients, databases, etc. They are commonly used to maintain clean test setups and avoid redundant code.

12. How do you execute JavaScript inside a Playwright test?
    -> page.evaluate()
13. How do you handle authentication in Playwright tests?
    -> we can perform by storing the cookie and reusable for other tests
    await page.context().storageState({ path: 'auth.json' });
    test.use({storageState: 'auth.json'})

14. How do you execute tests in parallel using Playwright?
    -> Run Tests in Parallel Using workers in Config
    -> Run Tests in Parallel Using CLI
    -> Running Tests in Parallel by Using Test Files
    -> Running tests in prallel for diff browsers
    -> Running particular test suite parallely using describe.parallel

15. How can you handle file uploads and downloads in Playwright?

-> to file upload using setInputFiles()
-> to download file using downlaod.saveAs()

# TypeScript with Playwright

How do you set up TypeScript in a Playwright project?
What are the benefits of using TypeScript with Playwright?
How do you define and use TypeScript interfaces in Playwright tests?
How can you handle async/await in Playwright with TypeScript?
How do you configure tsconfig.json for a Playwright project?

# BDD with Cucumber

What is Cucumber, and why is it used with Playwright?
How do you set up Playwright with Cucumber in a TypeScript project?
What is a feature file in Cucumber?
How do you write a scenario in a Cucumber feature file?
What are Given, When, Then steps in Cucumber?
How do you pass parameters between steps in Cucumber?
How can you share data between step definitions in Cucumber?
What is the role of world.ts in Cucumber with TypeScript?

# Playwright + Cucumber Integration

How do you integrate Playwright with Cucumber?
How do you execute a Playwright test using Cucumber?
How do you use hooks (Before, After) in Playwright with Cucumber?
How can you generate reports for Playwright and Cucumber tests?
How do you handle retries for failing Cucumber scenarios in Playwright?
How do you tag and filter test scenarios in Cucumber?

# Debugging & Best Practices

How do you debug a Playwright test?
What are the best practices for writing Playwright tests?
How do you structure a Playwright + Cucumber project?
How do you handle flaky tests in Playwright?
How do you implement Page Object Model (POM) in Playwright with Cucumber?
What are the advantages and disadvantages of using Playwright with Cucumber?
