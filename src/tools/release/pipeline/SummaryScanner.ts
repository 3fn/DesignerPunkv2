/**
 * SummaryScanner for Release Tool
 *
 * Discovers task summary documents added since the last release tag.
 * Uses git log when a tag exists, falls back to glob when no tags.
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { TagInfo, SummaryDoc } from '../types';

const SUMMARY_GLOB = 'docs/specs/*/task-*-summary.md';

export class SummaryScanner {
  private cwd: string;

  constructor(cwd?: string) {
    this.cwd = cwd || process.cwd();
  }

  async findSummariesSinceTag(tag: TagInfo | null): Promise<SummaryDoc[]> {
    const paths = tag ? this.findViaGit(tag) : this.findViaGlob();
    return paths.map((p) => this.parseSummaryDoc(p)).filter((d): d is SummaryDoc => d !== null);
  }

  private findViaGit(tag: TagInfo): string[] {
    try {
      const output = execSync(
        `git log --diff-filter=A --name-only --pretty=format: ${tag.tag}..HEAD -- "${SUMMARY_GLOB}"`,
        { cwd: this.cwd, encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] },
      );
      return output.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    } catch {
      return this.findViaGlob();
    }
  }

  private findViaGlob(): string[] {
    try {
      const output = execSync(`find docs/specs -name "task-*-summary.md" -type f 2>/dev/null | sort`,
        { cwd: this.cwd, encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] },
      );
      return output.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    } catch {
      return [];
    }
  }

  private parseSummaryDoc(filePath: string): SummaryDoc | null {
    try {
      const fullPath = path.resolve(this.cwd, filePath);
      const raw = fs.readFileSync(fullPath, 'utf-8');

      const specMatch = filePath.match(/docs\/specs\/([^/]+)\//);
      const taskMatch = filePath.match(/task-(\d+)-summary\.md$/);

      if (!specMatch || !taskMatch) return null;

      return {
        path: filePath,
        specName: specMatch[1],
        taskNumber: parseInt(taskMatch[1]),
        raw,
      };
    } catch {
      return null;
    }
  }
}
