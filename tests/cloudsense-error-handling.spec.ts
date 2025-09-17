import { test, expect } from '@playwright/test';
import { CloudSenseAppPage } from './pages/CloudSenseAppPage';
import { ProductDefinitionsPage } from './pages/ProductDefinitionsPage';
import { SalesforceAuth } from './utils/SalesforceAuth';
import { TestHelpers } from './utils/TestHelpers';
import testConfig from '../test-config.json';

test.describe('CloudSense Error Handling and Edge Cases', () => {
  let cloudSenseApp: CloudSenseAppPage;
  let productDefinitionsPage: ProductDefinitionsPage;

  test.beforeAll(async () => {
    // Create screenshots directory
    await TestHelpers.createScreenshotDir();
  });

  test.beforeEach(async ({ page }) => {
    cloudSenseApp = new CloudSenseAppPage(page);
    productDefinitionsPage = new ProductDefinitionsPage(page);
  });

  test('AC-010: Handle Network Timeouts', async ({ page }) => {
    await page.route('**/*', route => {
      setTimeout(() => route.continue(), 2000); // Simulate slow network
    });

    const sfAuth = new SalesforceAuth(testConfig.salesforce.orgAlias);
    await sfAuth.authenticateInBrowser(page);
    
    await expect(async () => {
      await cloudSenseApp.navigateToUrl(testConfig.salesforce.instanceUrl + testConfig.salesforce.lightningUrl);
      await cloudSenseApp.verifyAppIsLoaded();
    }).toPass({ timeout: 60000 });
  });

  test('AC-011: Handle Missing Data Gracefully', async ({ page }) => {
    const sfAuth = new SalesforceAuth(testConfig.salesforce.orgAlias);
    await sfAuth.authenticateInBrowser(page);
    
    // Navigate to empty list view
    await productDefinitionsPage.navigateToUrl(
      testConfig.salesforce.instanceUrl + testConfig.salesforce.productDefinitionsUrl + '?filterName=__Recent'
    );
    
    await expect(productDefinitionsPage.pageHeading).toBeVisible();
    
    const itemCount = await productDefinitionsPage.getItemCount();
    if (itemCount === 0) {
      await expect(page.getByText('Nothing to see here')).toBeVisible();
    }
  });

  test('AC-012: Verify Page Refresh Handling', async ({ page }) => {
    const sfAuth = new SalesforceAuth(testConfig.salesforce.orgAlias);
    await sfAuth.authenticateInBrowser(page);
    
    await productDefinitionsPage.navigateToUrl(
      testConfig.salesforce.instanceUrl + 
      testConfig.salesforce.productDefinitionsUrl + 
      testConfig.salesforce.trainingProductModelsFilter
    );
    
    // Refresh page and verify state is maintained
    await page.reload();
    await TestHelpers.waitForNoSpinners(page);
    
    await expect(page).toHaveURL(new RegExp(testConfig.salesforce.trainingProductModelsFilter));
    await productDefinitionsPage.verifyPageLoaded();
  });

  test('AC-013: Handle Authentication Failures', async ({ page }) => {
    // Test with invalid session
    await page.goto(testConfig.salesforce.instanceUrl + '/secur/frontdoor.jsp?sid=invalid_session');
    
    // Should redirect to login page
    await expect(page).toHaveURL(/login\.salesforce\.com/);
    await expect(page.locator('input[placeholder="Username"]')).toBeVisible();
  });

  test('AC-014: Verify Element Interaction Retry Logic', async ({ page }) => {
    const sfAuth = new SalesforceAuth(testConfig.salesforce.orgAlias);
    await sfAuth.authenticateInBrowser(page);
    
    await productDefinitionsPage.navigateToUrl(
      testConfig.salesforce.instanceUrl + 
      testConfig.salesforce.productDefinitionsUrl + 
      testConfig.salesforce.trainingProductModelsFilter
    );
    
    // Test retry logic with flaky element interaction
    await TestHelpers.retryAction(async () => {
      await productDefinitionsPage.refreshDataIfNeeded();
      await expect(productDefinitionsPage.dataGrid).toBeVisible();
    }, 3);
  });
});
