import { execSync } from 'child_process';
import { glob } from 'glob';

/**
 * Detects new completion documents using git
 */
export class NewDocumentDetector {
  /**
   * Get list of new completion documents since last analysis
   * 
   * @param sinceCommit - Commit hash to compare against (last analyzed commit)
   * @returns Array of file paths for new completion documents
   */
  async detectNewDocuments(sinceCommit: string | null): Promise<string[]> {
    // If no previous commit, fall back to full scan
    if (!sinceCommit) {
      console.warn('No previous analysis found, performing full scan');
      return this.getAllCompletionDocuments();
    }
    
    try {
      // Use git to find added files
      const gitCommand = `git diff --name-only --diff-filter=A ${sinceCommit} HEAD`;
      const output = execSync(gitCommand, { encoding: 'utf-8' });
      
      // Filter for completion documents
      const allNewFiles = output.split('\n').filter(Boolean);
      const newCompletionDocs = allNewFiles.filter(file => 
        file.includes('.kiro/specs/') && 
        file.includes('/completion/') &&
        file.endsWith('.md')
      );
      
      console.log(`Found ${newCompletionDocs.length} new completion documents since ${sinceCommit}`);
      return newCompletionDocs;
      
    } catch (error) {
      console.error('Git command failed, falling back to full scan:', error);
      return this.getAllCompletionDocuments();
    }
  }
  
  /**
   * Get all completion documents (fallback when git unavailable)
   */
  private async getAllCompletionDocuments(): Promise<string[]> {
    const pattern = '.kiro/specs/**/completion/*.md';
    const files = await glob(pattern);
    console.log(`Full scan found ${files.length} total completion documents`);
    return files;
  }
  
  /**
   * Get current git commit hash
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
