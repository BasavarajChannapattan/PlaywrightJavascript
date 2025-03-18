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
