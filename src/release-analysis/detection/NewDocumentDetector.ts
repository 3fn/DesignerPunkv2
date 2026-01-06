import { execSync } from 'child_process';
import { glob } from 'glob';

/**
 * Detects new task summary documents using git history
 * 
 * This class provides methods to identify task summary documents that have been
 * added since a specific commit, with fallback to full document scanning when
 * git is unavailable or fails.
 * 
 * Summary documents are located in docs/specs/[spec-name]/task-*-summary.md
 * and are designed for external consumption (release notes, changelogs).
 */
export class NewDocumentDetector {
  /**
   * Detect new task summary documents since a specific commit
   * 
   * Uses git diff to find files added after the specified commit.
   * Falls back to full document scan if git fails or sinceCommit is null.
   * 
   * @param sinceCommit - Git commit hash to compare against (null triggers full scan)
   * @returns Array of file paths for new task summary documents
   */
  async detectNewDocuments(sinceCommit: string | null): Promise<string[]> {
    // If no previous commit, fall back to full scan
    if (!sinceCommit) {
      console.warn('No previous analysis found, performing full scan');
      return this.getAllSummaryDocuments();
    }

    try {
      // Use git to find added files since the specified commit
      const gitCommand = `git diff --name-only --diff-filter=A ${sinceCommit} HEAD`;
      const output = execSync(gitCommand, { encoding: 'utf-8' });

      // Filter for task summary documents in docs/specs/
      const allNewFiles = output.split('\n').filter(Boolean);
      const newSummaryDocs = allNewFiles.filter(file =>
        file.startsWith('docs/specs/') &&
        file.match(/task-\d+-summary\.md$/)
      );

      console.log(`Found ${newSummaryDocs.length} new task summary documents since ${sinceCommit}`);
      return newSummaryDocs;

    } catch (error) {
      console.error('Git command failed, falling back to full scan:', error);
      return this.getAllSummaryDocuments();
    }
  }

  /**
   * Get all task summary documents (fallback when git unavailable)
   * 
   * Uses glob to find all task summary documents in the project.
   * This is the fallback method when git is unavailable or fails.
   * 
   * @returns Array of file paths for all task summary documents
   */
  async getAllSummaryDocuments(): Promise<string[]> {
    const pattern = 'docs/specs/**/task-*-summary.md';
    
    // Wrap glob in a Promise since glob v7 uses callbacks
    const files = await new Promise<string[]>((resolve, reject) => {
      glob(pattern, (err: Error | null, matches: string[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(matches);
        }
      });
    });
    
    console.log(`Full scan found ${files.length} total task summary documents`);
    return files;
  }

  /**
   * @deprecated Use getAllSummaryDocuments instead
   * Kept for backward compatibility during transition
   */
  async getAllCompletionDocuments(): Promise<string[]> {
    return this.getAllSummaryDocuments();
  }

  /**
   * Get current git commit hash
   * 
   * Uses git rev-parse HEAD to get the current commit hash.
   * Returns 'unknown' if git fails.
   * 
   * @returns Current commit hash or 'unknown' if git fails
   */
  async getCurrentCommit(): Promise<string> {
    try {
      const output = execSync('git rev-parse HEAD', { encoding: 'utf-8' });
      return output.trim();
    } catch (error) {
      console.error('Failed to get current commit hash:', error);
      return 'unknown';
    }
  }
}
