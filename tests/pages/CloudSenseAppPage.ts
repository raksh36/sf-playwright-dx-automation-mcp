import { Page, Locator, expect } from '@playwright/test';
import { SalesforceBasePage } from './SalesforceBasePage';

export class CloudSenseAppPage extends SalesforceBasePage {
  readonly appHeading: Locator;
  readonly navigationMenu: Locator;
  readonly homeLink: Locator;
  readonly productDefinitionsLink: Locator;
  readonly moreNavigationButton: Locator;
  readonly moreNavigationMenu: Locator;

  constructor(page: Page) {
    super(page);
    // App name in Lightning context bar (not a semantic heading)
    this.appHeading = page.locator('.slds-context-bar__app-name, .forceHeader .slds-context-bar__app-name');
    // Lightning global navigation bar
    this.navigationMenu = page.locator('.slds-context-bar');
    this.homeLink = page.getByRole('link', { name: 'Home' });
    this.productDefinitionsLink = page.getByRole('menuitem', { name: 'Product Definitions' });
    this.moreNavigationButton = page.getByRole('button', { name: /More/ });
    this.moreNavigationMenu = page.locator('[role="menu"]');
  }

  async verifyAppIsLoaded() {
    // Presence of the app launcher and context bar indicates the app shell is ready
    await this.waitForPageLoad();
    await expect(this.navigationMenu).toBeVisible();
    await expect(this.appHeading.first()).toContainText('CloudSense');
  }

  async navigateToProductDefinitions() {
    // Navigate directly to the object list view first (most reliable)
    const directUrl = this.page.url().replace(/\/lightning\/.*/, '/lightning/o/cscfga__Product_Definition__c/list');
    await this.page.goto(directUrl, { waitUntil: 'domcontentloaded' });

    // If for some reason we are not on the correct page, fall back to UI navigation
    if (!(await this.page.url()).includes('cscfga__Product_Definition__c')) {
      const directLink = this.page.getByRole('link', { name: 'Product Definitions' });
      if (await directLink.isVisible()) {
        await directLink.click();
      } else if (await this.moreNavigationButton.isVisible()) {
        await this.moreNavigationButton.click();
        await expect(this.moreNavigationMenu).toBeVisible();
        if (await this.productDefinitionsLink.isVisible()) {
          await this.productDefinitionsLink.click();
        }
      }
    }
    
    await this.waitForPageLoad();
  }
}
