import { test, expect } from '@playwright/test';
import testConfig from '../test-config.json';
import { SalesforceAuth } from './utils/SalesforceAuth';
import { TestHelpers } from './utils/TestHelpers';

// This test automates README.md Exercise 2 (high-level flow) with resilient selectors

test.describe('Exercise 2: Create Opportunity and Configure Training Mobile Solution', () => {
	let sfAuth: SalesforceAuth;

	test.beforeAll(async () => {
		await TestHelpers.createScreenshotDir();
	});

	test.beforeEach(async ({ page }) => {
		sfAuth = new SalesforceAuth(testConfig.salesforce.orgAlias);
		await sfAuth.authenticateInBrowser(page);
		await TestHelpers.waitForNoSpinners(page);
	});

	test('Create Opportunity and Configure Solution', async ({ page }) => {
		// 1) Navigate to Opportunities app page and create a new Opportunity
		await page.goto(`${testConfig.salesforce.instanceUrl}/lightning/o/Opportunity/list`, { waitUntil: 'domcontentloaded' });
		await expect(page.getByRole('heading', { name: /Opportunities/ })).toBeVisible();

		await page.getByRole('button', { name: 'New' }).click();
		// Modal with Opportunity fields
		await expect(page.getByRole('heading', { name: /New Opportunity/ })).toBeVisible();

		await page.getByLabel('Opportunity Name').fill('My Mobile Solution Sale');
		await page.getByLabel('Account Name').fill('Acme');
		await page.getByLabel('Stage').click();
		await page.getByRole('option', { name: /Prospecting/ }).click();
		await page.getByLabel('Close Date').fill(new Date().toISOString().slice(0, 10));
		await page.getByLabel('Opportunity Currency').click({ trial: true }).catch(() => {});
		const currencyField = page.getByLabel(/Opportunity Currency|Currency/);
		if (await currencyField.isVisible().catch(() => false)) {
			await currencyField.fill('GBP');
		}
		await page.getByRole('button', { name: /^Save$/ }).click();

		// Wait for record page
		await expect(page).toHaveURL(/\/lightning\/r\/Opportunity\//);
		await TestHelpers.waitForNoSpinners(page);

		// 2) Click Create Solution (button on Opportunity)
		const createSolution = page.getByRole('button', { name: /Create Solution/ });
		if (await createSolution.isVisible().catch(() => false)) {
			await createSolution.click();
		} else {
			// Fallback: via actions menu
			await page.getByRole('button', { name: /Show more actions/ }).click();
			await page.getByRole('menuitem', { name: /Create Solution/ }).click();
		}
		await TestHelpers.waitForNoSpinners(page);

		// 3) Click Add New Solution
		const addNewSolution = page.getByRole('button', { name: /Add New Solution/ });
		await addNewSolution.click();

		// 4) Select “Training Mobile Solution” template
		await expect(page.getByRole('dialog')).toBeVisible();
		await page.getByRole('row', { name: /Training Mobile Solution/ }).getByRole('button', { name: /Select|Add/ }).click();
		await page.getByRole('button', { name: /^Add$/ }).click();
		await TestHelpers.waitForNoSpinners(page);

		// 6) Enter details
		await page.getByLabel(/Configuration Name/).fill('Training Mobile Solution');
		await page.getByLabel(/Contract Term/).fill('36');

		// 7) Click Training Mobile Plan tab
		await page.getByRole('tab', { name: /Training Mobile Plan/ }).click();

		// 8) Click [+ Mobile Plan]
		await page.getByRole('button', { name: /\+\s*Mobile Plan/ }).click();

		// 9) Fill plan details and save
		await page.getByLabel(/Plan Type/).click();
		await page.getByRole('option', { name: /Mobile Plan/ }).click();
		await page.getByLabel(/^Plan$/).fill('Lx36');
		await page.getByLabel(/Tariff/).fill('Default Rate Card');
		await page.getByRole('button', { name: /^Save$/ }).click();
		await TestHelpers.waitForNoSpinners(page);

		// 10) Click Add-Ons
		await page.getByRole('tab', { name: /Add-Ons/ }).click();

		// 11) Click [+Add new]
		await page.getByRole('button', { name: /\+\s*Add new/ }).click();

		// 12) Check a checkbox and Add to configuration
		const firstAddonRow = page.getByRole('row').filter({ has: page.getByRole('checkbox') }).nth(0);
		await firstAddonRow.getByRole('checkbox').check();
		await page.getByRole('button', { name: /Add to configuration/ }).click();
		await TestHelpers.waitForNoSpinners(page);

		// 13) Click Details tab
		await page.getByRole('tab', { name: /Details/ }).click();

		// 14) Click Calculate Totals
		await page.getByRole('button', { name: /Calculate Totals/ }).click();
		await TestHelpers.waitForNoSpinners(page);

		// 15) Open Pricing Summary
		const pricingSummaryBar = page.getByRole('button', { name: /Pricing Summary/ }).first();
		if (await pricingSummaryBar.isVisible().catch(() => false)) {
			await pricingSummaryBar.click();
		}

		// 16) Back to basket
		const backToBasket = page.getByRole('button', { name: /Back to basket/ });
		if (await backToBasket.isVisible().catch(() => false)) {
			await backToBasket.click();
		}

		// Sanity assertion: remain on Solution page
		await expect(page).toHaveURL(/Solution|lightning\/r/);
	});
});
