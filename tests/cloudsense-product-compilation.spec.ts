import { test, expect } from '@playwright/test';
import { CloudSenseAppPage } from './pages/CloudSenseAppPage';
import { ProductDefinitionsPage } from './pages/ProductDefinitionsPage';
import { SalesforceAuth } from './utils/SalesforceAuth';
import { TestHelpers } from './utils/TestHelpers';
import testConfig from '../test-config.json';

test.describe('CloudSense Product Definition Compilation', () => {
  let cloudSenseApp: CloudSenseAppPage;
  let productDefinitionsPage: ProductDefinitionsPage;
  let sfAuth: SalesforceAuth;

  test.beforeAll(async () => {
    // Create screenshots directory
    await TestHelpers.createScreenshotDir();
  });

  test.beforeEach(async ({ page }) => {
    cloudSenseApp = new CloudSenseAppPage(page);
    productDefinitionsPage = new ProductDefinitionsPage(page);
    sfAuth = new SalesforceAuth(testConfig.salesforce.orgAlias);

    // Authenticate with Salesforce
    await sfAuth.authenticateInBrowser(page);
    await TestHelpers.waitForNoSpinners(page);
  });

  test('AC-001: Verify Salesforce Org Authentication', async ({ page }) => {
    const orgInfo = await sfAuth.getOrgInfo();
    
    expect(orgInfo.result.alias).toBe(testConfig.salesforce.orgAlias);
    expect(orgInfo.result.connectedStatus).toBe('Connected');
    expect(orgInfo.result.instanceUrl).toContain('salesforce.com');
    
    // Verify browser is authenticated
    await expect(page).toHaveTitle(/Salesforce|Lightning Experience/);
    await expect(page.locator('input[placeholder="Username"]')).not.toBeVisible();
  });

  test('AC-002: Verify CloudSense App Access', async ({ page }) => {
    await cloudSenseApp.navigateToUrl(testConfig.salesforce.instanceUrl + testConfig.salesforce.lightningUrl);
    await cloudSenseApp.verifyAppIsLoaded();
    
    await expect(cloudSenseApp.appHeading).toHaveText(testConfig.cloudsense.appName);
    await expect(cloudSenseApp.navigationMenu).toBeVisible();
    
    await cloudSenseApp.takeScreenshot('cloudsense-app-loaded');
  });

  test('AC-003: Navigate to Product Definitions', async ({ page }) => {
    await cloudSenseApp.navigateToUrl(testConfig.salesforce.instanceUrl + testConfig.salesforce.lightningUrl);
    await cloudSenseApp.verifyAppIsLoaded();
    
    await cloudSenseApp.navigateToProductDefinitions();
    await productDefinitionsPage.verifyPageLoaded();
    
    await expect(page).toHaveURL(/cscfga__Product_Definition__c/);
    await expect(productDefinitionsPage.pageHeading).toBeVisible();
  });

  test('AC-004: Select Training Product Models View', async ({ page }) => {
    await productDefinitionsPage.navigateToUrl(
      testConfig.salesforce.instanceUrl + testConfig.salesforce.productDefinitionsUrl
    );
    await productDefinitionsPage.verifyPageLoaded();
    
    await productDefinitionsPage.selectTrainingProductModelsView();
    await productDefinitionsPage.refreshDataIfNeeded();
    
    await expect(page).toHaveURL(new RegExp(testConfig.salesforce.trainingProductModelsFilter));
    await expect(productDefinitionsPage.pageHeading).toContainText('Training Product Models');
    
    await productDefinitionsPage.takeScreenshot('training-product-models-view');
  });

  test('AC-005: Verify Training Product Data', async ({ page }) => {
    await productDefinitionsPage.navigateToUrl(
      testConfig.salesforce.instanceUrl + 
      testConfig.salesforce.productDefinitionsUrl + 
      testConfig.salesforce.trainingProductModelsFilter
    );
    await productDefinitionsPage.refreshDataIfNeeded();
    
    const itemCount = await productDefinitionsPage.getItemCount();
    expect(itemCount).toBe(testConfig.cloudsense.expectedTotalItems);
    
    await productDefinitionsPage.verifyRequiredProductsPresent(testConfig.cloudsense.requiredProducts);
    
    const productRows = await productDefinitionsPage.getProductRows();
    expect(await productRows.count()).toBe(testConfig.cloudsense.expectedTotalItems);
  });

  test('AC-006: Compile Product Definitions - No Selection Error', async ({ page }) => {
    await productDefinitionsPage.navigateToUrl(
      testConfig.salesforce.instanceUrl + 
      testConfig.salesforce.productDefinitionsUrl + 
      testConfig.salesforce.trainingProductModelsFilter
    );
    await productDefinitionsPage.refreshDataIfNeeded();
    
    // Set up dialog handler before clicking
    const dialogPromise = TestHelpers.handleDialog(page, 'No records selected', true);
    
    await productDefinitionsPage.clickCompileProductDefinitions();
    await dialogPromise;
    
    // Verify we're still on the same page
    await expect(page).toHaveURL(new RegExp(testConfig.salesforce.trainingProductModelsFilter));
    await productDefinitionsPage.takeScreenshot('no-records-selected-error');
  });

  test('AC-007: Compile Product Definitions - With Selection', async ({ page }) => {
    await productDefinitionsPage.navigateToUrl(
      testConfig.salesforce.instanceUrl + 
      testConfig.salesforce.productDefinitionsUrl + 
      testConfig.salesforce.trainingProductModelsFilter
    );
    await productDefinitionsPage.refreshDataIfNeeded();
    
    // Select all products
    await productDefinitionsPage.selectAllProducts();
    await expect(productDefinitionsPage.actionModeIndicator).toBeVisible();
    
    await productDefinitionsPage.clickCompileProductDefinitions();
    
    // Wait for batch job initiation
    await TestHelpers.retryAction(async () => {
      await productDefinitionsPage.waitForBatchJobInitiation();
    });
    
    await productDefinitionsPage.takeScreenshot('batch-job-initiated');
  });

  test('AC-008: Select Specific Products Only', async ({ page }) => {
    await productDefinitionsPage.navigateToUrl(
      testConfig.salesforce.instanceUrl + 
      testConfig.salesforce.productDefinitionsUrl + 
      testConfig.salesforce.trainingProductModelsFilter
    );
    await productDefinitionsPage.refreshDataIfNeeded();
    
    // Select only the required products
    await productDefinitionsPage.selectSpecificProducts(testConfig.cloudsense.requiredProducts);
    await expect(productDefinitionsPage.actionModeIndicator).toBeVisible();
    
    await productDefinitionsPage.clickCompileProductDefinitions();
    await productDefinitionsPage.waitForBatchJobInitiation();
    
    await productDefinitionsPage.takeScreenshot('specific-products-selected');
  });

  test('AC-009: End-to-End Workflow Validation', async ({ page }) => {
    // Complete workflow test
    await cloudSenseApp.navigateToUrl(testConfig.salesforce.instanceUrl + testConfig.salesforce.lightningUrl);
    await cloudSenseApp.verifyAppIsLoaded();
    
    await cloudSenseApp.navigateToProductDefinitions();
    await productDefinitionsPage.verifyPageLoaded();
    
    await productDefinitionsPage.selectTrainingProductModelsView();
    await productDefinitionsPage.refreshDataIfNeeded();
    
    await productDefinitionsPage.verifyRequiredProductsPresent(testConfig.cloudsense.requiredProducts);
    
    await productDefinitionsPage.selectSpecificProducts(testConfig.cloudsense.requiredProducts);
    await productDefinitionsPage.clickCompileProductDefinitions();
    await productDefinitionsPage.waitForBatchJobInitiation();
    
    await productDefinitionsPage.takeScreenshot('end-to-end-workflow-complete');
  });
});
