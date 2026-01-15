// reporter.js (or wherever you run the reporter)
const reporter = require('cucumber-html-reporter');

const options = {
  theme: "bootstrap",
  name: 'Savings Weekly Regression Test Report',
  jsonDir: "./reports/",
  output: "./reports/cucumber_report.html",
  screenshotsDirectory:"./src/reports/json",
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  launchReport: true,
  columnLayout: 2
};


reporter.generate(options);