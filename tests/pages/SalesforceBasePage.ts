import { Page, Locator, expect } from '@playwright/test';

export class SalesforceBasePage {
  readonly page: Page;
  readonly searchButton: Locator;
  readonly globalHeader: Locator;
  readonly appLauncher: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.globalHeader = page.locator('header, .slds-global-header');
    this.appLauncher = page.getByRole('button', { name: 'App Launcher' });
  }

  async waitForPageLoad() {
    // Lightning apps keep long-running network connections; avoid waiting for 'networkidle'
    await this.page.waitForLoadState('domcontentloaded');
    // App launcher is a reliable indicator that Lightning shell is ready
    await expect(this.appLauncher).toBeVisible();
  }

  async navigateToUrl(url: string) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    await this.waitForPageLoad();
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({ 
      path: `screenshots/${name}-${Date.now()}.png`,
      fullPage: true 
    });
  }
}
