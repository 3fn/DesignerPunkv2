import { execSync } from 'child_process';
import { existsSync, statSync } from 'fs';
import { join } from 'path';
import { releaseAnalysisErrorHandler, withErrorHandling } from '../errors/ErrorHandler';
import { ErrorContext } from '../types';
import { GitErrorRecovery } from '../errors/ErrorRecovery';
import { CompletionDocument, DocumentMetadata } from '../types/AnalysisTypes';

/**
 * Git tag information
 */
export interface GitTag {
  name: string;
  commit: string;
  date: Date;
  message?: string;
}

/**
 * Git commit information
 */
export interface GitCommit {
  hash: string;
  shortHash: string;
  author: string;
  date: Date;
  message: string;
  files: string[];
}

/**
 * Git changes since a specific point
 */
export interface GitChanges {
  commits: GitCommit[];
  addedFiles: string[];
  modifiedFiles: string[];
  deletedFiles: string[];
  timeRange: { from: Date; to: Date };
}

/**
 * Analysis scope definition
 */
export interface AnalysisScope {
  fromTag?: string;
  fromCommit?: string;
  toCommit: string;
  completionDocuments: CompletionDocument[];
  analysisDate: Date;
}

/**
 * Validation result for analysis scope
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Git history analyzer for determining release analysis scope
 */
export class GitHistoryAnalyzer {
  private workingDirectory: string;

  constructor(workingDirectory: string = process.cwd()) {
    this.workingDirectory = workingDirectory;
  }

  /**
   * Find the last release tag in the repository
   * Requirement 5.1: Identify the last release tag automatically
   */
  async findLastRelease(): Promise<GitTag | null> {
    const context: ErrorContext = {
      operation: 'findLastRelease',
      component: 'GitHistoryAnalyzer',
      timestamp: new Date()
    };

    const result = await withErrorHandling(async () => {
      if (!this.isGitRepository()) {
        throw new Error('Not a Git repository');
      }

      // Get all tags sorted by version (semantic versioning aware)
      const tagOutput = this.executeGitCommand('tag -l --sort=-version:refname');
      
      if (!tagOutput.trim()) {
        return null; // No tags found - this is not an error
      }

      const tags = tagOutput.trim().split('\n');
      
      // Find the first tag that looks like a release (semantic version pattern)
      for (const tagName of tags) {
        if (this.isReleaseTag(tagName)) {
          const tagInfo = await this.getTagInfo(tagName);
          if (tagInfo) {
            return tagInfo;
          }
        }
      }

      return null; // No release tags found
    }, context);

    if (result.success) {
      return result.data || null;
    } else {
      // Log error but return null to allow fallback behavior
      console.warn(`Git repository access failed: ${result.error?.message || 'Unknown error'}`);
      return null;
    }
  }

  /**
   * Get changes since a specific tag or commit
   * Requirements 5.2, 5.3: Include added/modified completion documents
   */
  async getChangesSince(reference: string): Promise<GitChanges> {
    const context: ErrorContext = {
      operation: 'getChangesSince',
      component: 'GitHistoryAnalyzer',
      userAction: `Analyzing changes since ${reference}`,
      timestamp: new Date()
    };

    const gitRecovery = new GitErrorRecovery(this.workingDirectory);

    const result = await withErrorHandling(async () => {
      const toCommit = this.executeGitCommand('rev-parse HEAD').trim();
      const fromCommit = this.executeGitCommand(`rev-parse ${reference}`).trim();
      
      // Get commit range
      const commits = await this.getCommitsSince(reference);
      
      // Get file changes
      const fileChanges = this.getFileChangesSince(reference);
      
      // Determine time range
      const fromDate = this.getCommitDate(fromCommit);
      const toDate = new Date();

      return {
        commits,
        addedFiles: fileChanges.added,
        modifiedFiles: fileChanges.modified,
        deletedFiles: fileChanges.deleted,
        timeRange: { from: fromDate, to: toDate }
      };
    }, context);

    if (result.success && result.data) {
      return result.data;
    } else {
      // Try to recover from invalid reference
      if (result.error?.message.includes('invalid') || result.error?.message.includes('unknown')) {
        const recoveryResult = await gitRecovery.recoverFromInvalidReference(reference);
        if (recoveryResult.success && recoveryResult.data?.validReference) {
          console.warn(`Using recovered reference: ${recoveryResult.data.validReference}`);
          return this.getChangesSince(recoveryResult.data.validReference);
        } else if (recoveryResult.success && recoveryResult.data?.analyzeAllDocuments) {
          // Return empty changes to trigger fallback to all documents
          return {
            commits: [],
            addedFiles: [],
            modifiedFiles: [],
            deletedFiles: [],
            timeRange: { from: new Date(0), to: new Date() }
          };
        }
      }

      throw new Error(`Failed to get changes since ${reference}: ${result.error?.message || 'Unknown error'}`);
    }
  }

  /**
   * Find completion documents from Git changes
   * Requirements 5.2, 5.3: Analyze completion documents that were added or modified
   */
  async findCompletionDocuments(changes: GitChanges): Promise<CompletionDocument[]> {
    const completionDocuments: CompletionDocument[] = [];
    const errors: string[] = [];
    
    // Combine added and modified files
    const relevantFiles = [...changes.addedFiles, ...changes.modifiedFiles];
    
    for (const filePath of relevantFiles) {
      if (this.isCompletionDocument(filePath)) {
        const context: ErrorContext = {
          operation: 'loadCompletionDocument',
          component: 'GitHistoryAnalyzer',
          filePath,
          timestamp: new Date()
        };

        const result = await withErrorHandling(async () => {
          return await this.loadCompletionDocument(filePath);
        }, context);

        if (result.success && result.data) {
          completionDocuments.push(result.data);
        } else {
          errors.push(`Could not load ${filePath}: ${result.error?.message || 'Unknown error'}`);
          if (result.warnings) {
            result.warnings.forEach(warning => console.warn(warning));
          }
        }
      }
    }

    // Report summary of document loading
    if (errors.length > 0) {
      console.warn(`⚠️  Document loading issues (${errors.length}/${relevantFiles.length} files):`);
      errors.forEach(error => console.warn(`   ${error}`));
    }

    if (completionDocuments.length > 0) {
      console.log(`✅ Successfully loaded ${completionDocuments.length} completion documents`);
    }

    return completionDocuments;
  }

  /**
   * Validate analysis scope
   * Requirement 5.5: Provide fallback mechanisms and validation
   */
  validateAnalysisScope(scope: AnalysisScope): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate Git repository state
    if (!this.isGitRepository()) {
      errors.push('Not a Git repository or Git is not available');
    }

    // Validate commit references exist
    if (scope.fromCommit) {
      try {
        this.executeGitCommand(`rev-parse --verify ${scope.fromCommit}`);
      } catch {
        errors.push(`From commit ${scope.fromCommit} does not exist`);
      }
    }

    try {
      this.executeGitCommand(`rev-parse --verify ${scope.toCommit}`);
    } catch {
      errors.push(`To commit ${scope.toCommit} does not exist`);
    }

    // Validate completion documents exist and are accessible
    for (const doc of scope.completionDocuments) {
      const fullPath = join(this.workingDirectory, doc.path);
      if (!existsSync(fullPath)) {
        errors.push(`Completion document not found: ${doc.path}`);
      }
    }

    // Warnings for potential issues
    if (scope.completionDocuments.length === 0) {
      warnings.push('No completion documents found in analysis scope');
    }

    if (scope.fromTag && !scope.fromCommit) {
      warnings.push('Analysis scope uses tag reference without commit validation');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Check if current directory is a Git repository
   */
  private isGitRepository(): boolean {
    try {
      this.executeGitCommand('rev-parse --git-dir');
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if a tag name looks like a release tag (semantic versioning)
   */
  private isReleaseTag(tagName: string): boolean {
    // Match semantic versioning patterns: v1.0.0, 1.0.0, v1.0.0-beta.1, etc.
    const semverPattern = /^v?(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z0-9\-\.]+))?$/;
    return semverPattern.test(tagName);
  }

  /**
   * Get detailed information about a Git tag
   */
  private async getTagInfo(tagName: string): Promise<GitTag | null> {
    try {
      const commit = this.executeGitCommand(`rev-list -n 1 ${tagName}`).trim();
      const dateStr = this.executeGitCommand(`log -1 --format=%ci ${commit}`).trim();
      const date = new Date(dateStr);
      
      // Try to get tag message (for annotated tags)
      let message: string | undefined;
      try {
        message = this.executeGitCommand(`tag -l --format='%(contents)' ${tagName}`).trim();
        if (!message) {
          message = undefined;
        }
      } catch {
        // Not an annotated tag, no message
        message = undefined;
      }

      return {
        name: tagName,
        commit,
        date,
        message
      };
    } catch {
      return null;
    }
  }

  /**
   * Get commits since a reference point
   */
  private async getCommitsSince(reference: string): Promise<GitCommit[]> {
    const commits: GitCommit[] = [];
    
    try {
      const commitOutput = this.executeGitCommand(
        `log ${reference}..HEAD --format="%H|%h|%an|%ci|%s" --name-only`
      );
      
      if (!commitOutput.trim()) {
        return commits;
      }
      
      // Split by double newlines to separate commits
      const sections = commitOutput.split('\n\n').filter(section => section.trim());
      
      for (const section of sections) {
        const lines = section.trim().split('\n');
        if (lines.length === 0) continue;
        
        // First line contains commit info
        const commitLine = lines[0];
        if (!commitLine.includes('|')) continue;
        
        const parts = commitLine.split('|');
        if (parts.length < 5) continue;
        
        const [hash, shortHash, author, dateStr, ...messageParts] = parts;
        const message = messageParts.join('|'); // Rejoin in case message contains |
        
        // Remaining lines are file names
        const files = lines.slice(1).filter(line => line.trim() && !line.includes('|'));
        
        commits.push({
          hash: hash.trim(),
          shortHash: shortHash.trim(),
          author: author.trim(),
          date: new Date(dateStr.trim()),
          message: message.trim(),
          files
        });
      }
    } catch (error) {
      // If log fails, return empty array
      console.warn(`Warning: Could not get commits since ${reference}: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    return commits;
  }

  /**
   * Get file changes since a reference point
   */
  private getFileChangesSince(reference: string): { added: string[]; modified: string[]; deleted: string[] } {
    try {
      const diffOutput = this.executeGitCommand(`diff --name-status ${reference}..HEAD`);
      
      const added: string[] = [];
      const modified: string[] = [];
      const deleted: string[] = [];
      
      const lines = diffOutput.trim().split('\n').filter(line => line.trim());
      
      for (const line of lines) {
        const [status, ...pathParts] = line.split('\t');
        const path = pathParts.join('\t'); // Handle paths with tabs
        
        switch (status[0]) {
          case 'A':
            added.push(path);
            break;
          case 'M':
            modified.push(path);
            break;
          case 'D':
            deleted.push(path);
            break;
          case 'R':
          case 'C':
            // Renamed or copied files - treat as modified
            modified.push(path);
            break;
        }
      }
      
      return { added, modified, deleted };
    } catch {
      return { added: [], modified: [], deleted: [] };
    }
  }

  /**
   * Get commit date for a specific commit
   */
  private getCommitDate(commit: string): Date {
    try {
      const dateStr = this.executeGitCommand(`log -1 --format=%ci ${commit}`).trim();
      return new Date(dateStr);
    } catch {
      return new Date();
    }
  }

  /**
   * Check if a file path represents a completion document
   */
  private isCompletionDocument(filePath: string): boolean {
    // Look for completion documents in .kiro/specs/*/completion/ directories
    const completionPattern = /\.kiro\/specs\/[^\/]+\/completion\/.*\.md$/;
    
    // Also look for task completion documents and spec completion summaries
    const taskCompletionPattern = /task-\d+-completion\.md$/;
    const specCompletionPattern = /spec-completion-summary\.md$/;
    
    return completionPattern.test(filePath) || 
           taskCompletionPattern.test(filePath) || 
           specCompletionPattern.test(filePath);
  }

  /**
   * Load and parse a completion document
   */
  private async loadCompletionDocument(filePath: string): Promise<CompletionDocument | null> {
    try {
      const fullPath = join(this.workingDirectory, filePath);
      
      if (!existsSync(fullPath)) {
        return null;
      }

      const fs = await import('fs/promises');
      const content = await fs.readFile(fullPath, 'utf-8');
      const stats = statSync(fullPath);
      
      // Get the commit that last modified this file
      const gitCommit = this.getFileLastCommit(filePath);
      
      // Extract metadata from the document
      const metadata = this.extractDocumentMetadata(content, filePath);
      
      return {
        path: filePath,
        content,
        lastModified: stats.mtime,
        gitCommit,
        metadata
      };
    } catch {
      return null;
    }
  }

  /**
   * Get the commit that last modified a file
   */
  private getFileLastCommit(filePath: string): string {
    try {
      return this.executeGitCommand(`log -1 --format=%H -- "${filePath}"`).trim();
    } catch {
      return '';
    }
  }

  /**
   * Extract metadata from completion document content
   */
  private extractDocumentMetadata(content: string, filePath: string): DocumentMetadata {
    const metadata: DocumentMetadata = {
      title: '',
      type: 'other'
    };

    // Extract title from first heading
    const titleMatch = content.match(/^#\s+(.+)$/m);
    if (titleMatch) {
      metadata.title = titleMatch[1].trim();
    }

    // Extract metadata from document header
    const dateMatch = content.match(/\*\*Date\*\*:\s*(.+)$/m);
    if (dateMatch) {
      metadata.date = dateMatch[1].trim();
    }

    const taskMatch = content.match(/\*\*Task\*\*:\s*(.+)$/m);
    if (taskMatch) {
      metadata.task = taskMatch[1].trim();
    }

    const specMatch = content.match(/\*\*Spec\*\*:\s*(.+)$/m);
    if (specMatch) {
      metadata.spec = specMatch[1].trim();
    }

    const statusMatch = content.match(/\*\*Status\*\*:\s*(.+)$/m);
    if (statusMatch) {
      metadata.status = statusMatch[1].trim();
    }

    // Determine document type based on path and content
    if (filePath.includes('task-') && filePath.includes('-completion.md')) {
      metadata.type = 'task-completion';
    } else if (filePath.includes('spec-completion')) {
      metadata.type = 'spec-completion';
    }

    return metadata;
  }

  /**
   * Execute a Git command and return output
   */
  private executeGitCommand(command: string): string {
    try {
      return execSync(`git ${command}`, {
        cwd: this.workingDirectory,
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe']
      });
    } catch (error) {
      throw new Error(`Git command failed: git ${command}`);
    }
  }
}