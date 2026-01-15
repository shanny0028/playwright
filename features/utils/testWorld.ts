import { setWorldConstructor, World } from "@cucumber/cucumber";
import type { Browser, BrowserContext, Page } from "playwright";
import { PageFactory } from "./pageFactory";
import { UIActions } from "./uiActions";
import type HomePage from "../pages/homepage";
import { enableMonitoring } from '../config/monitoring'

export class TestWorld extends World {
  // Playwright handles (per scenario)
  browser!: Browser;
  browserctx!: BrowserContext;
  page!: Page;

  // The factory (created in Before)
  pages!: PageFactory;
  uiActions!: UIActions;

  // Cached instances for short getters
  private _home?: HomePage;

  
  constructor(options: any) {
    super(options);
  }

  get homePage(): HomePage {
    if (!this._home) {
      this._home = this.pages.home();
    }
    return this._home;
  }

}

setWorldConstructor(TestWorld);
