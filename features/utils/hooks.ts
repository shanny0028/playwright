import { After, AfterStep, Before, setDefaultTimeout, Status } from '@cucumber/cucumber';
import type { TestWorld } from '../utils/testWorld';
import { PageFactory } from './pageFactory';
import { UIActions } from './uiActions';
import { launchSession } from '../config/launch';

setDefaultTimeout(50000);

Before(async function (this: TestWorld) {
  // ----- Inputs from profile (worldParameters) or env -----

  const { browser, context, page } = await launchSession({
    parameters: this.parameters, // worldParameters from profile
    env: process.env, // environment variables
  });

  this.browser = browser;
  this.browserctx = context;
  this.page = page;

  // // ⭐ Add monitoring immediately after page is set
  // enableMonitoring(this.page, this.attach.bind(this));

  // If you need these factories/actions:
  this.uiActions = new UIActions(this.page);
  this.pages = new PageFactory(this);
});

/**
 * Capture a screenshot when a step fails and attach it to the Cucumber report.
 */
AfterStep(async function (this: TestWorld, { result, pickle }) {
  if (result?.status === Status.FAILED) {
    // Playwright screenshot as PNG buffer
    const pngBuffer = await this.page.screenshot({
      fullPage: false, // set true if you want the entire page
      type: 'png',
    });

    // Attach the image to the Cucumber report (HTML/JSON formatters will embed it)
    await this.attach(pngBuffer, 'image/png');

    // Optional: attach a short text note with scenario name and error (if available)
    const scenarioName = pickle?.name ?? 'Unnamed scenario';
    const reason = result?.message ?? 'Step failed';
    // await this.attach(`Screenshot for failed step in scenario: "${scenarioName}"\nReason: ${reason}`, 'text/plain');
  }
});

After(async function (this: TestWorld) {
  this.page.close();
  this.browserctx.close();
  this.browser.close();
  console.log('closed browser----');
});
