import type {Page} from "playwright";
import {expect} from "playwright/test"
import { UIActions } from "../utils/uiActions";
import { config } from '../utils/loadData';
import * as homePageElements from "../pageObjects/homePageElements.json"
// const data = loadEnvData();

export default class HomePage{

    constructor(private readonly page:Page,
        private readonly uiActions: UIActions){
    }

    async clickOnHomePage(){
        console.log('Envoirnment is --- ', config.environment);
        await this.uiActions.click(homePageElements.loginLink.locator);
    }

    async validateHomePage(){
        await this.uiActions.waitForVisible(homePageElements.homePageHeader,5000);
        const isVisible= await this.uiActions.isVisible(homePageElements.homePageHeader);
        expect(isVisible).toBe(true);
    }

}