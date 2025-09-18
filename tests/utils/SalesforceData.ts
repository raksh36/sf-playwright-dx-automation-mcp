import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class SalesforceData {
  private orgAlias: string;
  private projectPath: string;

  constructor(orgAlias: string, projectPath: string = process.cwd()) {
    this.orgAlias = orgAlias;
    this.projectPath = projectPath;
  }

  async soql<T = any>(query: string): Promise<T[]> {
    const cmd = `sf data query --target-org ${this.orgAlias} --json --query ${JSON.stringify(query)}`;
    const { stdout } = await execAsync(cmd, { cwd: this.projectPath, env: { ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' } });
    const output = stdout.trim();
    const start = output.indexOf('{');
    const end = output.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
      const jsonSlice = output.slice(start, end + 1);
      const parsed = JSON.parse(jsonSlice);
      return parsed?.result?.records ?? [];
    }
    return [];
  }

  async apex(apexCode: string): Promise<string> {
    const cmd = `sf apex run --target-org ${this.orgAlias} --json --apex-code ${JSON.stringify(apexCode)}`;
    const { stdout } = await execAsync(cmd, { cwd: this.projectPath, env: { ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' } });
    const output = stdout.trim();
    const start = output.indexOf('{');
    const end = output.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
      const jsonSlice = output.slice(start, end + 1);
      const parsed = JSON.parse(jsonSlice);
      return parsed?.result?.logs ?? '';
    }
    return '';
  }
}


