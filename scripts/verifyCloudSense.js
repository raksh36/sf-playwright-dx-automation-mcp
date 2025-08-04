const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  try {
    const authPath = require('path').join(__dirname, '..', '.tmp-org-auth.json');
    if (!fs.existsSync(authPath)) {
      console.error('Auth file .tmp-org-auth.json not found. Run "sf org display --json > .tmp-org-auth.json" first.');
      process.exit(1);
    }
    const { result } = JSON.parse(fs.readFileSync(authPath, 'utf-8'));
    const { instanceUrl, accessToken } = result;
    const frontdoor = `${instanceUrl}/secur/frontdoor.jsp?sid=${encodeURIComponent(accessToken)}`;

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(frontdoor, { waitUntil: 'load', timeout: 60000 });

    // Wait for Lightning shell to be ready: look for any global header element
    try {
      await page.waitForSelector('header[role="banner"], div.slds-global-header', { timeout: 15000 });
    } catch (_) {
      console.error('Timed out waiting for Salesforce Lightning shell to load');
      await browser.close();
      process.exit(1);
    }

    // Search for the app title or link
    const selectorOptions = [
      'span[title="CloudSense Solution Management"]', // App title tooltip
      'span:has-text("CloudSense Solution Management")',
      'a:has-text("CloudSense Solution Management")'
    ];
    let found = false;
    for (const sel of selectorOptions) {
      if (await page.locator(sel).first().isVisible().catch(() => false)) {
        found = true;
        break;
      }
    }

    if (found) {
      console.log('SUCCESS: CloudSense Solution Management app is visible.');
      process.exit(0);
    } else {
      console.error('FAIL: CloudSense Solution Management app NOT found.');
      process.exit(2);
    }
  } catch (err) {
    console.error('Error during verification:', err);
    process.exit(1);
  }
})(); 