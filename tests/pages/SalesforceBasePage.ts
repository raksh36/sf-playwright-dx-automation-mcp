import { Page, Locator, expect } from '@playwright/test';

export class SalesforceBasePage {
  readonly page: Page;
  readonly searchButton: Locator;
  readonly globalHeader: Locator;
  readonly appLauncher: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.globalHeader = page.locator('navigation[aria-label="Global Header"]');
    this.appLauncher = page.getByRole('button', { name: 'App Launcher' });
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await expect(this.globalHeader).toBeVisible();
  }

  async navigateToUrl(url: string) {
    await this.page.goto(url);
    await this.waitForPageLoad();
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({ 
      path: `screenshots/${name}-${Date.now()}.png`,
      fullPage: true 
    });
  }
}
