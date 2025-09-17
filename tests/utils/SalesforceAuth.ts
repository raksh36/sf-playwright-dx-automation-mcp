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
        `sf org open --target-org ${this.orgAlias} --json --loglevel fatal`,
        { cwd: this.projectPath }
      );
      const trimmed = stdout.trim();

      // Prefer JSON parsing to extract the URL precisely
      const start = trimmed.indexOf('{');
      const end = trimmed.lastIndexOf('}');
      if (start !== -1 && end !== -1 && end > start) {
        try {
          const jsonSlice = trimmed.slice(start, end + 1);
          const parsed = JSON.parse(jsonSlice);
          const urlFromJson = parsed?.result?.url || parsed?.result?.openUrl;
          if (typeof urlFromJson === 'string' && /^https?:\/\//i.test(urlFromJson)) {
            return urlFromJson;
          }
        } catch {
          // fall through to regex based extraction
        }
      }

      // Fallback: extract first URL-like token from stdout
      const urlMatch = trimmed.match(/https?:\/\/[^\s'"<>]+/i);
      if (urlMatch && urlMatch[0]) {
        return urlMatch[0];
      }

      const raw = trimmed;

      // Fallback: treat stdout as a session id and compose a frontdoor URL
      // using the instance URL from org info
      const orgInfo = await this.getOrgInfo();
      const instanceUrl = orgInfo?.result?.instanceUrl || process.env.SF_INSTANCE_URL || 'https://login.salesforce.com';
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
