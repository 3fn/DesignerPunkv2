/**
 * Error Recovery Utilities for Release Analysis
 * 
 * Provides specific recovery strategies and fallback mechanisms
 * for different types of errors encountered during analysis.
 * 
 * Requirements addressed:
 * - 8.1: Validate completion documents are properly formatted and accessible
 * - 8.2: Provide confidence scores for extracted information
 * - 8.5: Provide clear, actionable error messages with resolution guidance
 */

import { existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { execSync } from 'child_process';
import { ErrorHandlingResult } from './ErrorHandler';
import { ErrorContext } from '../types';

export interface GitRecoveryOptions {
  fallbackToAllDocuments?: boolean;
  maxCommitHistory?: number;
  skipRemoteOperations?: boolean;
}

export interface DocumentRecoveryOptions {
  skipMalformedDocuments?: boolean;
  useBasicParsing?: boolean;
  requireMinimumContent?: number;
  fallbackToFilename?: boolean;
}

export interface ConfigRecoveryOptions {
  useDefaults?: boolean;
  createMissingConfig?: boolean;
  validateOnLoad?: boolean;
  backupOriginal?: boolean;
}

/**
 * Git-specific error recovery utilities
 */
export class GitErrorRecovery {
  private workingDirectory: string;
  private options: GitRecoveryOptions;

  constructor(workingDirectory: string, options: GitRecoveryOptions = {}) {
    this.workingDirectory = workingDirectory;
    this.options = {
      fallbackToAllDocuments: true,
      maxCommitHistory: 1000,
      skipRemoteOperations: false,
      ...options
    };
  }

  /**
   * Recover from "not a git repository" error
   */
  async recoverFromNoGitRepository(): Promise<ErrorHandlingResult> {
    try {
      // Check if we're in a subdirectory of a Git repository
      const gitRoot = await this.findGitRoot();
      if (gitRoot) {
        return {
          success: true,
          data: { gitRoot, workingDirectory: gitRoot },
          warnings: [`Found Git repository at: ${gitRoot}`]
        };
      }

      // Check if there are any .git directories in parent directories
      const parentGitRepo = await this.findParentGitRepository();
      if (parentGitRepo) {
        return {
          success: true,
          data: { gitRoot: parentGitRepo, workingDirectory: parentGitRepo },
          warnings: [`Using Git repository from parent directory: ${parentGitRepo}`]
        };
      }

      // If fallback is enabled, continue without Git
      if (this.options.fallbackToAllDocuments) {
        return {
          success: true,
          data: { useFileSystemScan: true },
          warnings: ['No Git repository found - will scan filesystem for completion documents']
        };
      }

      return {
        success: false,
        warnings: ['No Git repository found and fallback is disabled']
      };
    } catch (error) {
      return {
        success: false,
        warnings: [`Git recovery failed: ${error instanceof Error ? error.message : String(error)}`]
      };
    }
  }

  /**
   * Recover from invalid Git reference error
   */
  async recoverFromInvalidReference(reference: string): Promise<ErrorHandlingResult> {
    try {
      // Try to find the most recent valid tag
      const recentTag = await this.findMostRecentTag();
      if (recentTag) {
        return {
          success: true,
          data: { validReference: recentTag },
          warnings: [`Using most recent tag instead of ${reference}: ${recentTag}`]
        };
      }

      // Try to find the first commit
      const firstCommit = await this.findFirstCommit();
      if (firstCommit) {
        return {
          success: true,
          data: { validReference: firstCommit },
          warnings: [`Using first commit instead of ${reference}: ${firstCommit}`]
        };
      }

      // Fallback to analyzing all documents
      if (this.options.fallbackToAllDocuments) {
        return {
          success: true,
          data: { analyzeAllDocuments: true },
          warnings: [`Invalid reference ${reference} - analyzing all available documents`]
        };
      }

      return {
        success: false,
        warnings: [`Could not find valid Git reference to replace ${reference}`]
      };
    } catch (error) {
      return {
        success: false,
        warnings: [`Reference recovery failed: ${error instanceof Error ? error.message : String(error)}`]
      };
    }
  }

  /**
   * Recover from Git permission errors
   */
  async recoverFromPermissionError(): Promise<ErrorHandlingResult> {
    try {
      // Check if we can read basic Git information
      const canReadBasicInfo = await this.testBasicGitAccess();
      if (canReadBasicInfo) {
        return {
          success: true,
          data: { limitedGitAccess: true },
          warnings: ['Limited Git access - some operations may be restricted']
        };
      }

      // Try to use read-only operations
      const readOnlyAccess = await this.testReadOnlyGitAccess();
      if (readOnlyAccess) {
        return {
          success: true,
          data: { readOnlyGitAccess: true },
          warnings: ['Using read-only Git access - some features may be limited']
        };
      }

      // Fallback to filesystem scanning
      if (this.options.fallbackToAllDocuments) {
        return {
          success: true,
          data: { useFileSystemScan: true },
          warnings: ['Git access denied - falling back to filesystem scanning']
        };
      }

      return {
        success: false,
        warnings: ['Git permission denied and no fallback available']
      };
    } catch (error) {
      return {
        success: false,
        warnings: [`Permission recovery failed: ${error instanceof Error ? error.message : String(error)}`]
      };
    }
  }

  // Private helper methods

  private async findGitRoot(): Promise<string | null> {
    try {
      const gitRoot = execSync('git rev-parse --show-toplevel', {
        cwd: this.workingDirectory,
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe']
      }).trim();
      return gitRoot;
    } catch {
      return null;
    }
  }

  private async findParentGitRepository(): Promise<string | null> {
    let currentDir = this.workingDirectory;
    const maxLevels = 5; // Prevent infinite loops
    
    for (let i = 0; i < maxLevels; i++) {
      const parentDir = dirname(currentDir);
      if (parentDir === currentDir) break; // Reached root
      
      if (existsSync(join(parentDir, '.git'))) {
        return parentDir;
      }
      
      currentDir = parentDir;
    }
    
    return null;
  }

  private async findMostRecentTag(): Promise<string | null> {
    try {
      const tag = execSync('git describe --tags --abbrev=0', {
        cwd: this.workingDirectory,
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe']
      }).trim();
      return tag;
    } catch {
      return null;
    }
  }

  private async findFirstCommit(): Promise<string | null> {
    try {
      const commit = execSync('git rev-list --max-parents=0 HEAD', {
        cwd: this.workingDirectory,
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe']
      }).trim().split('\n')[0];
      return commit;
    } catch {
      return null;
    }
  }

  private async testBasicGitAccess(): Promise<boolean> {
    try {
      execSync('git status --porcelain', {
        cwd: this.workingDirectory,
        stdio: ['pipe', 'pipe', 'pipe']
      });
      return true;
    } catch {
      return false;
    }
  }

  private async testReadOnlyGitAccess(): Promise<boolean> {
    try {
      execSync('git log --oneline -1', {
        cwd: this.workingDirectory,
        stdio: ['pipe', 'pipe', 'pipe']
      });
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Document parsing error recovery utilities
 */
export class DocumentErrorRecovery {
  private options: DocumentRecoveryOptions;

  constructor(options: DocumentRecoveryOptions = {}) {
    this.options = {
      skipMalformedDocuments: true,
      useBasicParsing: true,
      requireMinimumContent: 50,
      fallbackToFilename: true,
      ...options
    };
  }

  /**
   * Recover from document parsing errors
   */
  async recoverFromParsingError(filePath: string, content: string, error: Error): Promise<ErrorHandlingResult> {
    try {
      // Try basic parsing without metadata extraction
      if (this.options.useBasicParsing) {
        const basicDocument = await this.attemptBasicParsing(filePath, content);
        if (basicDocument) {
          return {
            success: true,
            data: basicDocument,
            warnings: [`Used basic parsing for ${filePath} - some metadata may be missing`]
          };
        }
      }

      // Try to extract minimal information from filename
      if (this.options.fallbackToFilename) {
        const filenameDocument = await this.createDocumentFromFilename(filePath, content);
        if (filenameDocument) {
          return {
            success: true,
            data: filenameDocument,
            warnings: [`Created minimal document from filename: ${filePath}`]
          };
        }
      }

      // If skipping is allowed, return null to skip this document
      if (this.options.skipMalformedDocuments) {
        return {
          success: true,
          data: null,
          warnings: [`Skipped malformed document: ${filePath}`]
        };
      }

      return {
        success: false,
        warnings: [`Could not recover from parsing error in ${filePath}: ${error.message}`]
      };
    } catch (recoveryError) {
      return {
        success: false,
        warnings: [`Document recovery failed: ${recoveryError instanceof Error ? recoveryError.message : String(recoveryError)}`]
      };
    }
  }

  /**
   * Recover from empty or corrupted document content
   */
  async recoverFromEmptyDocument(filePath: string): Promise<ErrorHandlingResult> {
    try {
      // Check if file exists but is empty
      if (existsSync(filePath)) {
        const fs = await import('fs/promises');
        const stats = await fs.stat(filePath);
        
        if (stats.size === 0) {
          return {
            success: true,
            data: null,
            warnings: [`Skipped empty file: ${filePath}`]
          };
        }
      }

      // Try to read with different encodings
      const alternativeContent = await this.tryAlternativeEncodings(filePath);
      if (alternativeContent) {
        return {
          success: true,
          data: alternativeContent,
          warnings: [`Recovered content using alternative encoding for: ${filePath}`]
        };
      }

      return {
        success: true,
        data: null,
        warnings: [`Could not recover content from: ${filePath}`]
      };
    } catch (error) {
      return {
        success: false,
        warnings: [`Empty document recovery failed: ${error instanceof Error ? error.message : String(error)}`]
      };
    }
  }

  // Private helper methods

  private async attemptBasicParsing(filePath: string, content: string): Promise<any> {
    try {
      // Extract title from first heading
      const titleMatch = content.match(/^#\s+(.+)$/m);
      let title = titleMatch ? titleMatch[1].trim() : 'Untitled Document';
      
      // If no heading found, try to create title from filename
      if (title === 'Untitled Document') {
        const filename = filePath.split('/').pop() || 'unknown';
        title = filename.replace(/\.(md|txt)$/, '').replace(/[-_]/g, ' ');
        title = title.split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
      }

      // Check minimum content requirement
      if (content.trim().length < (this.options.requireMinimumContent || 50)) {
        return null;
      }

      // Create basic document structure
      return {
        path: filePath,
        content: content,
        lastModified: new Date(),
        gitCommit: '',
        metadata: {
          title,
          type: this.inferDocumentType(filePath),
          parsingMethod: 'basic'
        }
      };
    } catch {
      return null;
    }
  }

  private async createDocumentFromFilename(filePath: string, content: string): Promise<any> {
    try {
      const filename = filePath.split('/').pop() || 'unknown';
      let title = filename.replace(/\.(md|txt)$/, '').replace(/[-_]/g, ' ');
      
      // Capitalize first letter of each word
      title = title.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');

      return {
        path: filePath,
        content: content || '',
        lastModified: new Date(),
        gitCommit: '',
        metadata: {
          title,
          type: this.inferDocumentType(filePath),
          parsingMethod: 'filename'
        }
      };
    } catch {
      return null;
    }
  }

  private async tryAlternativeEncodings(filePath: string): Promise<string | null> {
    const encodings = ['utf8', 'latin1', 'ascii'];
    const fs = await import('fs/promises');

    for (const encoding of encodings) {
      try {
        const content = await fs.readFile(filePath, encoding as BufferEncoding);
        if (content && content.trim().length > 0) {
          return content;
        }
      } catch {
        continue;
      }
    }

    return null;
  }

  private inferDocumentType(filePath: string): 'task-completion' | 'spec-completion' | 'other' {
    if (filePath.includes('task-') && filePath.includes('-completion')) {
      return 'task-completion';
    } else if (filePath.includes('spec-completion')) {
      return 'spec-completion';
    } else {
      return 'other';
    }
  }
}

/**
 * Configuration error recovery utilities
 */
export class ConfigurationErrorRecovery {
  private options: ConfigRecoveryOptions;

  constructor(options: ConfigRecoveryOptions = {}) {
    this.options = {
      useDefaults: true,
      createMissingConfig: false,
      validateOnLoad: true,
      backupOriginal: true,
      ...options
    };
  }

  /**
   * Recover from missing configuration file
   */
  async recoverFromMissingConfig(configPath: string): Promise<ErrorHandlingResult> {
    try {
      if (this.options.useDefaults) {
        const defaultConfig = this.getDefaultConfiguration();
        
        if (this.options.createMissingConfig) {
          await this.createConfigurationFile(configPath, defaultConfig);
          return {
            success: true,
            data: defaultConfig,
            warnings: [`Created default configuration file: ${configPath}`]
          };
        } else {
          return {
            success: true,
            data: defaultConfig,
            warnings: ['Using default configuration (no config file created)']
          };
        }
      }

      return {
        success: false,
        warnings: [`Configuration file not found: ${configPath}`]
      };
    } catch (error) {
      return {
        success: false,
        warnings: [`Config recovery failed: ${error instanceof Error ? error.message : String(error)}`]
      };
    }
  }

  /**
   * Recover from invalid configuration format
   */
  async recoverFromInvalidConfig(configPath: string, error: Error): Promise<ErrorHandlingResult> {
    try {
      // Backup original if requested and file exists
      if (this.options.backupOriginal && existsSync(configPath)) {
        await this.backupConfigurationFile(configPath);
      }

      // Try to fix common JSON/YAML issues if file exists
      if (existsSync(configPath)) {
        const fixedConfig = await this.attemptConfigurationFix(configPath);
        if (fixedConfig) {
          return {
            success: true,
            data: fixedConfig,
            warnings: [`Fixed configuration format issues in: ${configPath}`]
          };
        }
      }

      // Fallback to defaults
      if (this.options.useDefaults) {
        const defaultConfig = this.getDefaultConfiguration();
        return {
          success: true,
          data: defaultConfig,
          warnings: [`Using default configuration due to format errors in: ${configPath}`]
        };
      }

      return {
        success: false,
        warnings: [`Could not recover from configuration errors in: ${configPath}`]
      };
    } catch (recoveryError) {
      return {
        success: false,
        warnings: [`Configuration recovery failed: ${recoveryError instanceof Error ? recoveryError.message : String(recoveryError)}`]
      };
    }
  }

  // Private helper methods

  private getDefaultConfiguration(): any {
    return {
      extraction: {
        completionPatterns: [
          '*-completion.md',
          '.kiro/specs/*/completion/*.md',
          'completion/*.md'
        ],
        breakingChangeKeywords: [
          'breaking change',
          'breaking',
          'incompatible',
          'removed',
          'deprecated'
        ],
        featureKeywords: [
          'feature',
          'new',
          'add',
          'implement',
          'introduce'
        ],
        bugFixKeywords: [
          'fix',
          'bug',
          'issue',
          'resolve',
          'correct'
        ],
        improvementKeywords: [
          'improve',
          'enhance',
          'optimize',
          'refactor',
          'update'
        ],
        documentationKeywords: [
          'documentation',
          'docs',
          'readme',
          'comment',
          'guide'
        ],
        confidenceThresholds: {
          minimumConfidence: 0.6,
          uncertaintyThreshold: 0.8,
          reviewThreshold: 0.9
        },
        sectionHeaders: {
          breakingChanges: ['Breaking Changes', 'BREAKING CHANGES', 'Breaking'],
          features: ['New Features', 'Features', 'Added'],
          bugFixes: ['Bug Fixes', 'Fixes', 'Fixed'],
          improvements: ['Improvements', 'Enhanced', 'Optimized'],
          summary: ['Summary', 'Overview', 'Completion Summary']
        }
      },
      versioning: {
        semanticVersioning: true,
        preReleaseHandling: 'increment',
        versionBumpRules: {
          majorBumpTriggers: ['breaking'],
          minorBumpTriggers: ['feature', 'new'],
          patchBumpTriggers: ['fix', 'bug'],
          defaultBumpType: 'patch'
        },
        preRelease: {
          startingNumber: 0
        }
      },
      reporting: {
        defaultFormat: 'summary',
        includeConfidence: true,
        includeMetadata: false,
        includeEvidence: true,
        templates: {
          summary: {
            format: 'markdown'
          },
          detailed: {
            format: 'markdown'
          },
          releaseNotes: {
            format: 'markdown'
          }
        },
        outputFiles: {
          saveResults: false,
          outputDirectory: './release-analysis-results'
        }
      },
      git: {
        defaultBranch: 'main',
        releaseTagPattern: '^v?\\d+\\.\\d+\\.\\d+$',
        completionPaths: [
          '.kiro/specs/*/completion/',
          'completion/',
          'docs/completion/'
        ],
        includePatterns: ['*.md'],
        excludePatterns: ['node_modules/**', '.git/**'],
        maxCommits: 1000
      }
    };
  }

  private async createConfigurationFile(configPath: string, config: any): Promise<void> {
    const fs = await import('fs/promises');
    const configDir = dirname(configPath);
    
    // Ensure directory exists
    if (!existsSync(configDir)) {
      mkdirSync(configDir, { recursive: true });
    }

    // Write configuration file
    await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8');
  }

  private async backupConfigurationFile(configPath: string): Promise<void> {
    if (existsSync(configPath)) {
      const fs = await import('fs/promises');
      const backupPath = `${configPath}.backup.${Date.now()}`;
      await fs.copyFile(configPath, backupPath);
    }
  }

  private async attemptConfigurationFix(configPath: string): Promise<any> {
    try {
      const fs = await import('fs/promises');
      let content = await fs.readFile(configPath, 'utf-8');

      // Try to fix common JSON issues
      content = content
        .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
        .replace(/'/g, '"') // Replace single quotes with double quotes
        .replace(/(\w+):/g, '"$1":') // Quote unquoted keys
        .trim();

      // Try to parse the fixed content
      const config = JSON.parse(content);
      
      // If successful, save the fixed version
      await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8');
      
      return config;
    } catch {
      return null;
    }
  }
}

/**
 * Utility function to create recovery instances with common options
 */
export function createRecoveryUtilities(workingDirectory: string) {
  return {
    git: new GitErrorRecovery(workingDirectory, {
      fallbackToAllDocuments: true,
      maxCommitHistory: 1000
    }),
    document: new DocumentErrorRecovery({
      skipMalformedDocuments: true,
      useBasicParsing: true,
      requireMinimumContent: 50
    }),
    configuration: new ConfigurationErrorRecovery({
      useDefaults: true,
      createMissingConfig: false,
      validateOnLoad: true
    })
  };
}