/**
 * GitOperations - Handles git commit, tag, and push operations
 * 
 * Handles:
 * - Creating commits with release changes
 * - Creating semantic version tags (v1.2.3 format)
 * - Pushing commits and tags to remote
 * - Rollback capabilities for git operations
 * 
 * Requirements: 5.1, 5.2, 8.4
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export interface GitCommitOptions {
  message: string;
  files?: string[];
  allowEmpty?: boolean;
}

export interface GitTagOptions {
  version: string;
  message?: string;
  annotated?: boolean;
}

export interface GitPushOptions {
  remote?: string;
  branch?: string;
  tags?: boolean;
  force?: boolean;
}

export interface GitOperationResult {
  success: boolean;
  operation: string;
  details: string;
  errors: GitError[];
}

export interface GitError {
  operation: string;
  error: string;
  code: string;
}

export interface GitRollbackState {
  commitHash?: string;
  tags: string[];
  branch: string;
}

export class GitOperations {
  private workingDirectory: string;
  private rollbackState: GitRollbackState | null = null;

  constructor(workingDirectory: string = process.cwd()) {
    this.workingDirectory = workingDirectory;
  }

  /**
   * Create a git commit with release changes
   * 
   * @param options - Commit options
   * @returns Operation result
   */
  async createCommit(options: GitCommitOptions): Promise<GitOperationResult> {
    const result: GitOperationResult = {
      success: false,
      operation: 'commit',
      details: '',
      errors: []
    };

    try {
      // Validate we're in a git repository
      if (!this.isGitRepository()) {
        result.errors.push({
          operation: 'commit',
          error: 'Not a git repository',
          code: 'NOT_GIT_REPO'
        });
        return result;
      }

      // Save current state for potential rollback
      this.saveRollbackState();

      // Stage files if specified
      if (options.files && options.files.length > 0) {
        for (const file of options.files) {
          try {
            this.executeGitCommand(`git add "${file}"`);
          } catch (error) {
            result.errors.push({
              operation: 'stage',
              error: `Failed to stage ${file}: ${error}`,
              code: 'STAGE_ERROR'
            });
            return result;
          }
        }
      }

      // Create commit
      const commitFlags = options.allowEmpty ? '--allow-empty' : '';
      const commitCommand = `git commit ${commitFlags} -m "${this.escapeCommitMessage(options.message)}"`;
      
      try {
        const output = this.executeGitCommand(commitCommand);
        result.success = true;
        result.details = output;
        console.log(`✅ Created commit: ${options.message}`);
      } catch (error) {
        result.errors.push({
          operation: 'commit',
          error: `Failed to create commit: ${error}`,
          code: 'COMMIT_ERROR'
        });
        return result;
      }

      return result;

    } catch (error) {
      result.errors.push({
        operation: 'commit',
        error: `Unexpected error: ${error}`,
        code: 'UNEXPECTED_ERROR'
      });
      return result;
    }
  }

  /**
   * Create a semantic version tag
   * 
   * @param options - Tag options
   * @returns Operation result
   */
  async createTag(options: GitTagOptions): Promise<GitOperationResult> {
    const result: GitOperationResult = {
      success: false,
      operation: 'tag',
      details: '',
      errors: []
    };

    try {
      // Validate we're in a git repository
      if (!this.isGitRepository()) {
        result.errors.push({
          operation: 'tag',
          error: 'Not a git repository',
          code: 'NOT_GIT_REPO'
        });
        return result;
      }

      // Validate semantic version format
      if (!this.isValidSemanticVersion(options.version)) {
        result.errors.push({
          operation: 'tag',
          error: `Invalid semantic version format: ${options.version}`,
          code: 'INVALID_VERSION'
        });
        return result;
      }

      // Format tag name (v1.2.3)
      const tagName = this.formatTagName(options.version);

      // Check if tag already exists
      if (this.tagExists(tagName)) {
        result.errors.push({
          operation: 'tag',
          error: `Tag ${tagName} already exists`,
          code: 'TAG_EXISTS'
        });
        return result;
      }

      // Save current state for potential rollback
      this.saveRollbackState();

      // Create tag (annotated or lightweight)
      let tagCommand: string;
      if (options.annotated !== false) {
        // Annotated tag (default)
        const message = options.message || `Release ${options.version}`;
        tagCommand = `git tag -a "${tagName}" -m "${this.escapeCommitMessage(message)}"`;
      } else {
        // Lightweight tag
        tagCommand = `git tag "${tagName}"`;
      }

      try {
        const output = this.executeGitCommand(tagCommand);
        result.success = true;
        result.details = `Created tag ${tagName}`;
        console.log(`✅ Created tag: ${tagName}`);
      } catch (error) {
        result.errors.push({
          operation: 'tag',
          error: `Failed to create tag: ${error}`,
          code: 'TAG_ERROR'
        });
        return result;
      }

      return result;

    } catch (error) {
      result.errors.push({
        operation: 'tag',
        error: `Unexpected error: ${error}`,
        code: 'UNEXPECTED_ERROR'
      });
      return result;
    }
  }

  /**
   * Push commits and/or tags to remote
   * 
   * @param options - Push options
   * @returns Operation result
   */
  async push(options: GitPushOptions = {}): Promise<GitOperationResult> {
    const result: GitOperationResult = {
      success: false,
      operation: 'push',
      details: '',
      errors: []
    };

    try {
      // Validate we're in a git repository
      if (!this.isGitRepository()) {
        result.errors.push({
          operation: 'push',
          error: 'Not a git repository',
          code: 'NOT_GIT_REPO'
        });
        return result;
      }

      const remote = options.remote || 'origin';
      const branch = options.branch || this.getCurrentBranch();
      const forceFlag = options.force ? '--force' : '';

      // Push commits
      try {
        const pushCommand = `git push ${forceFlag} ${remote} ${branch}`;
        const output = this.executeGitCommand(pushCommand);
        result.details += `Pushed commits to ${remote}/${branch}\n`;
        console.log(`✅ Pushed commits to ${remote}/${branch}`);
      } catch (error) {
        result.errors.push({
          operation: 'push',
          error: `Failed to push commits: ${error}`,
          code: 'PUSH_ERROR'
        });
        return result;
      }

      // Push tags if requested
      if (options.tags) {
        try {
          const pushTagsCommand = `git push ${forceFlag} ${remote} --tags`;
          const output = this.executeGitCommand(pushTagsCommand);
          result.details += `Pushed tags to ${remote}\n`;
          console.log(`✅ Pushed tags to ${remote}`);
        } catch (error) {
          result.errors.push({
            operation: 'push-tags',
            error: `Failed to push tags: ${error}`,
            code: 'PUSH_TAGS_ERROR'
          });
          return result;
        }
      }

      result.success = true;
      return result;

    } catch (error) {
      result.errors.push({
        operation: 'push',
        error: `Unexpected error: ${error}`,
        code: 'UNEXPECTED_ERROR'
      });
      return result;
    }
  }

  /**
   * Rollback git operations (reset to previous state)
   * 
   * @returns Operation result
   */
  async rollback(): Promise<GitOperationResult> {
    const result: GitOperationResult = {
      success: false,
      operation: 'rollback',
      details: '',
      errors: []
    };

    try {
      if (!this.rollbackState) {
        result.errors.push({
          operation: 'rollback',
          error: 'No rollback state available',
          code: 'NO_ROLLBACK_STATE'
        });
        return result;
      }

      console.log('🔄 Rolling back git operations...');

      // Reset to previous commit if we have one
      if (this.rollbackState.commitHash) {
        try {
          this.executeGitCommand(`git reset --hard ${this.rollbackState.commitHash}`);
          result.details += `Reset to commit ${this.rollbackState.commitHash}\n`;
          console.log(`✅ Reset to commit ${this.rollbackState.commitHash}`);
        } catch (error) {
          result.errors.push({
            operation: 'reset',
            error: `Failed to reset commit: ${error}`,
            code: 'RESET_ERROR'
          });
        }
      }

      // Delete any tags that were created
      for (const tag of this.rollbackState.tags) {
        try {
          this.executeGitCommand(`git tag -d "${tag}"`);
          result.details += `Deleted tag ${tag}\n`;
          console.log(`✅ Deleted tag ${tag}`);
        } catch (error) {
          result.errors.push({
            operation: 'delete-tag',
            error: `Failed to delete tag ${tag}: ${error}`,
            code: 'DELETE_TAG_ERROR'
          });
        }
      }

      result.success = result.errors.length === 0;
      this.rollbackState = null;

      return result;

    } catch (error) {
      result.errors.push({
        operation: 'rollback',
        error: `Unexpected error: ${error}`,
        code: 'UNEXPECTED_ERROR'
      });
      return result;
    }
  }

  /**
   * Save current git state for potential rollback
   */
  private saveRollbackState(): void {
    try {
      const commitHash = this.executeGitCommand('git rev-parse HEAD').trim();
      const branch = this.getCurrentBranch();
      
      this.rollbackState = {
        commitHash,
        tags: [],
        branch
      };
    } catch (error) {
      console.warn('Failed to save rollback state:', error);
    }
  }

  /**
   * Check if current directory is a git repository
   * 
   * @returns True if git repository
   */
  private isGitRepository(): boolean {
    try {
      this.executeGitCommand('git rev-parse --git-dir');
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get current git branch name
   * 
   * @returns Branch name
   */
  private getCurrentBranch(): string {
    try {
      return this.executeGitCommand('git rev-parse --abbrev-ref HEAD').trim();
    } catch {
      return 'main';
    }
  }

  /**
   * Check if a tag exists
   * 
   * @param tagName - Tag name to check
   * @returns True if tag exists
   */
  private tagExists(tagName: string): boolean {
    try {
      this.executeGitCommand(`git rev-parse "${tagName}"`);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Format version as tag name (v1.2.3)
   * 
   * @param version - Semantic version
   * @returns Formatted tag name
   */
  private formatTagName(version: string): string {
    // Add 'v' prefix if not present
    return version.startsWith('v') ? version : `v${version}`;
  }

  /**
   * Validate semantic version format
   * 
   * @param version - Version string to validate
   * @returns True if valid semantic version
   */
  private isValidSemanticVersion(version: string): boolean {
    // Remove 'v' prefix if present
    const versionWithoutPrefix = version.startsWith('v') ? version.slice(1) : version;
    
    // Semantic versioning regex
    const semverRegex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
    return semverRegex.test(versionWithoutPrefix);
  }

  /**
   * Escape commit message for shell execution
   * 
   * @param message - Commit message
   * @returns Escaped message
   */
  private escapeCommitMessage(message: string): string {
    // Escape double quotes and backslashes
    return message.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  }

  /**
   * Execute git command
   * 
   * @param command - Git command to execute
   * @returns Command output
   */
  private executeGitCommand(command: string): string {
    return execSync(command, {
      cwd: this.workingDirectory,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
  }

  /**
   * Get current working directory
   */
  getWorkingDirectory(): string {
    return this.workingDirectory;
  }

  /**
   * Set working directory
   * 
   * @param directory - New working directory
   */
  setWorkingDirectory(directory: string): void {
    this.workingDirectory = directory;
  }

  /**
   * Clear rollback state
   */
  clearRollbackState(): void {
    this.rollbackState = null;
  }

  /**
   * Get rollback state (for testing/debugging)
   */
  getRollbackState(): GitRollbackState | null {
    return this.rollbackState;
  }
}
