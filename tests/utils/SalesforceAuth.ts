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
        `sf org display --target-org ${this.orgAlias} --json`,
        { cwd: this.projectPath }
      );
      return JSON.parse(stdout);
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
      return stdout.trim();
    } catch (error) {
      throw new Error(`Failed to get session URL: ${error}`);
    }
  }

  async authenticateInBrowser(page: any) {
    const sessionUrl = await this.getSessionUrl();
    const frontdoorUrl = `https://login.salesforce.com/secur/frontdoor.jsp?sid=${sessionUrl}`;
    await page.goto(frontdoorUrl);
    await page.waitForLoadState('networkidle');
  }
}
