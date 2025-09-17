import { Page, expect } from '@playwright/test';

export class TestHelpers {
  static async handleDialog(page: Page, expectedMessage?: string, accept: boolean = true) {
    return new Promise<void>((resolve) => {
      page.once('dialog', async (dialog) => {
        if (expectedMessage) {
          expect(dialog.message()).toContain(expectedMessage);
        }
        if (accept) {
          await dialog.accept();
        } else {
          await dialog.dismiss();
        }
        resolve();
      });
    });
  }

  static async waitForNoSpinners(page: Page, timeout: number = 10000) {
    await page.waitForFunction(
      () => document.querySelectorAll('.slds-spinner, lightning-spinner').length === 0,
      { timeout }
    );
  }

  static async retryAction(action: () => Promise<void>, maxRetries: number = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        await action();
        return;
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  static async createScreenshotDir() {
    const fs = require('fs');
    const path = require('path');
    const screenshotDir = path.join(process.cwd(), 'screenshots');
    
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
  }
}
