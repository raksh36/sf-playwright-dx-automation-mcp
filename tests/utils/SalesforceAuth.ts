import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class SalesforceAuth {
  private orgAlias: string;
  private projectPath: string;

  constructor(orgAlias: string, projectPath: string = process.cwd()) {
    this.orgAlias = orgAlias;
    this.projectPath = projectPath;
  }

  async getOrgInfo() {
    try {
      const { stdout } = await execAsync(
        `sf org display --target-org ${this.orgAlias} --json --loglevel fatal`,
        { cwd: this.projectPath }
      );
      const trimmed = stdout.trim();
      // Some environments may prepend/append logs to stdout. Extract the JSON object safely.
      const start = trimmed.indexOf('{');
      const end = trimmed.lastIndexOf('}');
      if (start !== -1 && end !== -1 && end > start) {
        const jsonSlice = trimmed.slice(start, end + 1);
        return JSON.parse(jsonSlice);
      }
      throw new Error(`Unexpected CLI output (no JSON found): ${trimmed.substring(0, 200)}`);
    } catch (error) {
      throw new Error(`Failed to get org info: ${error}`);
    }
  }

  async getSessionUrl() {
    try {
      const { stdout } = await execAsync(
        `sf org open --target-org ${this.orgAlias} --url-only`,
        { cwd: this.projectPath }
      );
      const raw = stdout.trim();

      // If the CLI returns a full URL (expected), use it directly
      if (/^https?:\/\//i.test(raw)) {
        return raw;
      }

      // Fallback: treat stdout as a session id and compose a frontdoor URL
      // using the instance URL from org info
      const orgInfo = await this.getOrgInfo();
      const instanceUrl = orgInfo?.result?.instanceUrl || 'https://login.salesforce.com';
      const base = instanceUrl.replace(/\/$/, '');
      return `${base}/secur/frontdoor.jsp?sid=${encodeURIComponent(raw)}`;
    } catch (error) {
      throw new Error(`Failed to get session URL: ${error}`);
    }
  }

  async authenticateInBrowser(page: any) {
    // Navigate to the authenticated frontdoor URL
    const authUrl = await this.getSessionUrl();
    await page.goto(authUrl);
    await page.waitForLoadState('networkidle');

    // If we somehow land on the login page, retry once with a fresh URL
    const usernameField = page.locator('input[placeholder="Username"]');
    if (await usernameField.isVisible().catch(() => false)) {
      const retryUrl = await this.getSessionUrl();
      if (retryUrl && retryUrl !== authUrl) {
        await page.goto(retryUrl);
        await page.waitForLoadState('networkidle');
      }
    }
  }
}
