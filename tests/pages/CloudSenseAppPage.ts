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
    this.appHeading = page.getByRole('heading', { name: 'CloudSense Solution Management' });
    this.navigationMenu = page.locator('navigation[aria-label="Global"]');
    this.homeLink = page.getByRole('link', { name: 'Home' });
    this.productDefinitionsLink = page.getByRole('menuitem', { name: 'Product Definitions' });
    this.moreNavigationButton = page.getByRole('button', { name: 'Show more navigation items' });
    this.moreNavigationMenu = page.locator('[role="menu"]');
  }

  async verifyAppIsLoaded() {
    await expect(this.appHeading).toBeVisible();
    await expect(this.navigationMenu).toBeVisible();
  }

  async navigateToProductDefinitions() {
    // First try direct link, then check More menu
    const directLink = this.page.getByRole('link', { name: 'Product Definitions' });
    
    if (await directLink.isVisible()) {
      await directLink.click();
    } else {
      await this.moreNavigationButton.click();
      await expect(this.moreNavigationMenu).toBeVisible();
      await this.productDefinitionsLink.click();
    }
    
    await this.waitForPageLoad();
  }
}
