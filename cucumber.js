const common = [
  "--require-module ts-node/register",
  "--require tests/step-definitions/**/*.ts",
  "--require tests/support/**/*.ts",
  "--format progress",
  "--format html:tests/reports/cucumber-report.html",
  "--format json:tests/reports/cucumber-report.json",
  "tests/features/**/*.feature",
].join(" ");

module.exports = {
  default: common,
};
