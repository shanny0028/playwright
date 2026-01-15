import type { TestWorld } from "../utils/testWorld";
import { Given, When } from "@cucumber/cucumber";
import { config } from '../utils/loadData';
// const data = loadEnvData();

Given("I open the Playwright site", async function (this:TestWorld) {
  await this.uiActions.navigateTo((config.url));
  await this.homePage.clickOnHomePage();
});

When("I navigate to Docs", async  function (this:TestWorld) {
  await this.homePage.validateHomePage();
});
