/**
 * TagResolver for Release Tool
 *
 * Resolves release boundaries using git tags.
 * Git tags are the only persistent state in this system.
 */

import { execSync } from 'child_process';
import { TagInfo } from '../types';

export class TagResolver {
  private cwd: string;

  constructor(cwd?: string) {
    this.cwd = cwd || process.cwd();
  }

  async getLatestTag(): Promise<TagInfo | null> {
    try {
      const tag = this.exec('git describe --tags --abbrev=0').trim();
      if (!tag) return null;

      const commit = this.exec(`git rev-list -n 1 ${tag}`).trim();
      const date = this.exec(`git log -1 --format=%aI ${tag}`).trim();

      return { tag, commit, date };
    } catch {
      return null;
    }
  }

  async createTag(version: string, message: string): Promise<void> {
    const tag = version.startsWith('v') ? version : `v${version}`;
    this.exec(`git tag -a ${tag} -m "${message.replace(/"/g, '\\"')}"`);
  }

  private exec(command: string): string {
    return execSync(command, { cwd: this.cwd, encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
  }
}
