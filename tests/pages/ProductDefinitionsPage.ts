import { Page, Locator, expect } from '@playwright/test';
import { SalesforceBasePage } from './SalesforceBasePage';

export class ProductDefinitionsPage extends SalesforceBasePage {
  readonly pageHeading: Locator;
  readonly listViewSelector: Locator;
  readonly listViewDropdown: Locator;
  readonly trainingProductModelsOption: Locator;
  readonly dataGrid: Locator;
  readonly selectAllCheckbox: Locator;
  readonly compileButton: Locator;
  readonly statusIndicator: Locator;
  readonly actionModeIndicator: Locator;
  readonly refreshButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: /Product Definitions/ });
    this.listViewSelector = page.getByRole('button', { name: /Select a List View/ });
    this.listViewDropdown = page.locator('[role="listbox"]');
    this.trainingProductModelsOption = page.getByRole('option', { name: 'Training Product Models' });
    this.dataGrid = page.locator('[role="grid"]');
    this.selectAllCheckbox = page.getByRole('checkbox', { name: 'Select All' });
    this.compileButton = page.getByRole('button', { name: 'Compile Product Definitions' });
    this.statusIndicator = page.locator('[role="status"]');
    this.actionModeIndicator = page.getByText('Action Mode');
    this.refreshButton = page.getByRole('button', { name: /Refresh/ });
  }

  async verifyPageLoaded() {
    // Either the heading/list view controls or the data grid proves the page is ready
    await expect
      .poll(async () => {
        const urlOk = /cscfga__Product_Definition__c/.test(this.page.url());
        const headingVisible = await this.pageHeading.isVisible().catch(() => false);
        const listVisible = await this.listViewSelector.isVisible().catch(() => false);
        const gridVisible = await this.dataGrid.isVisible().catch(() => false);
        return urlOk && (headingVisible || listVisible || gridVisible);
      }, { timeout: 30000 })
      .toBeTruthy();
  }

  async selectTrainingProductModelsView() {
    await this.listViewSelector.click();
    await expect(this.listViewDropdown).toBeVisible();
    await this.trainingProductModelsOption.click();
    await this.waitForPageLoad();
  }

  async refreshDataIfNeeded() {
    const needsRefresh = await this.page.getByText('Refresh this list to view the latest data').isVisible();
    if (needsRefresh) {
      await this.refreshButton.click();
      await this.waitForPageLoad();
    }
  }

  async getItemCount(): Promise<number> {
    const statusText = await this.statusIndicator.textContent();
    const match = statusText?.match(/(\d+)\s+items/);
    return match ? parseInt(match[1]) : 0;
  }

  async getProductRows() {
    return this.dataGrid.locator('[role="row"]').filter({ hasNot: this.page.locator('[role="columnheader"]') });
  }

  async verifyRequiredProductsPresent(requiredProducts: string[]) {
    for (const productName of requiredProducts) {
      const productRow = this.page.getByRole('row', { name: new RegExp(productName) });
      await expect(productRow).toBeVisible();
      
      // Verify product is active
      const activeCheckbox = productRow.locator('input[type="checkbox"][aria-label*="Active"]');
      await expect(activeCheckbox).toBeChecked();
    }
  }

  async selectAllProducts() {
    await this.selectAllCheckbox.click();
    await expect(this.actionModeIndicator).toBeVisible();
  }

  async selectSpecificProducts(productNames: string[]) {
    for (const productName of productNames) {
      const productRow = this.page.getByRole('row', { name: new RegExp(productName) });
      const checkbox = productRow.locator('input[type="checkbox"]').first();
      await checkbox.click();
    }
    await expect(this.actionModeIndicator).toBeVisible();
  }

  async clickCompileProductDefinitions() {
    await this.compileButton.click();
  }

  async waitForBatchJobInitiation() {
    // Wait for loading indicator or batch job confirmation
    await this.page.waitForSelector('.slds-spinner, [data-aura-class="forceToastMessage"]', { timeout: 30000 });
  }
}
