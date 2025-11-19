import { existsSync, statSync } from 'fs';
import { join, relative } from 'path';
import { execSync } from 'child_process';
import { AnalysisConfig } from '../config/AnalysisConfig';
import { GitChanges } from '../git/GitHistoryAnalyzer';
import { CompletionDocument, DocumentMetadata } from '../types/AnalysisTypes';
import { withErrorHandling } from '../errors/ErrorHandler';
import { ErrorContext } from '../types';
import { DocumentErrorRecovery } from '../errors/ErrorRecovery';

/**
 * Document collection result with metadata
 */
export interface DocumentCollectionResult {
  documents: CompletionDocument[];
  metadata: CollectionMetadata;
  errors: CollectionError[];
  warnings: string[];
}

/**
 * Collection metadata for tracking collection process
 */
export interface CollectionMetadata {
  totalFilesScanned: number;
  documentsFound: number;
  documentsLoaded: number;
  documentsFiltered: number;
  collectionDate: Date;
  processingTimeMs: number;
}

/**
 * Collection error information
 */
export interface CollectionError {
  filePath: string;
  error: string;
  type: 'access' | 'parse' | 'validation' | 'git';
  recoverable: boolean;
}

/**
 * Document filter criteria
 */
export interface DocumentFilter {
  includePatterns?: string[];
  excludePatterns?: string[];
  documentTypes?: DocumentType[];
  minConfidence?: number;
  requireMetadata?: boolean;
}

/**
 * Document type classification
 */
export type DocumentType = 'task-completion' | 'spec-completion' | 'other';

/**
 * Document validation result
 */
export interface DocumentValidationResult {
  isValid: boolean;
  confidence: number;
  issues: ValidationIssue[];
  metadata: DocumentMetadata;
}

/**
 * Validation issue information
 */
export interface ValidationIssue {
  type: 'missing-metadata' | 'invalid-format' | 'empty-content' | 'parse-error';
  severity: 'error' | 'warning' | 'info';
  message: string;
  field?: string;
}

/**
 * Completion document collector for release analysis
 * 
 * Handles discovery, loading, filtering, and validation of completion documents
 * from Git changes with comprehensive error handling and metadata extraction.
 * 
 * Requirements addressed:
 * - 2.1: Extract information from structured and unstructured completion documents
 * - 2.2: Filter documentation-only changes from release-triggering changes
 * - 5.2: Include completion documents added since last release
 * - 5.3: Analyze current versions of modified completion documents
 */
export class CompletionDocumentCollector {
  private workingDirectory: string;
  private config: AnalysisConfig;

  constructor(workingDirectory: string = process.cwd(), config: AnalysisConfig) {
    this.workingDirectory = workingDirectory;
    this.config = config;
  }

  /**
   * Collect completion documents from Git changes
   * Requirement 5.2, 5.3: Include added/modified completion documents
   */
  async collectFromGitChanges(changes: GitChanges, filter?: DocumentFilter): Promise<DocumentCollectionResult> {
    const startTime = Date.now();
    const result: DocumentCollectionResult = {
      documents: [],
      metadata: {
        totalFilesScanned: 0,
        documentsFound: 0,
        documentsLoaded: 0,
        documentsFiltered: 0,
        collectionDate: new Date(),
        processingTimeMs: 0
      },
      errors: [],
      warnings: []
    };

    const context: ErrorContext = {
      operation: 'collectFromGitChanges',
      component: 'CompletionDocumentCollector',
      timestamp: new Date()
    };

    const collectionResult = await withErrorHandling(async () => {
      // Combine added and modified files for analysis
      const relevantFiles = [...changes.addedFiles, ...changes.modifiedFiles];
      result.metadata.totalFilesScanned = relevantFiles.length;

      // Discover completion documents with error handling
      const discoveredDocuments = await this.discoverCompletionDocuments(relevantFiles, result);
      result.metadata.documentsFound = discoveredDocuments.length;

      // Load and validate documents with error recovery
      const loadedDocuments = await this.loadDocuments(discoveredDocuments, result);
      result.metadata.documentsLoaded = loadedDocuments.length;

      // Apply filters
      const filteredDocuments = this.filterDocuments(loadedDocuments, filter, result);
      result.metadata.documentsFiltered = filteredDocuments.length;

      result.documents = filteredDocuments;
      result.metadata.processingTimeMs = Date.now() - startTime;

      return result;
    }, context);

    if (collectionResult.success && collectionResult.data) {
      return collectionResult.data;
    } else {
      // Add collection error to result
      result.errors.push({
        filePath: 'collection-process',
        error: `Collection failed: ${collectionResult.error?.message || 'Unknown error'}`,
        type: 'validation',
        recoverable: false
      });
      result.metadata.processingTimeMs = Date.now() - startTime;

      // Log error details but return partial results
      console.warn(`⚠️  Document collection encountered errors: ${collectionResult.error?.message}`);
      if (collectionResult.warnings) {
        collectionResult.warnings.forEach(warning => result.warnings.push(warning));
      }

      return result;
    }
  }

  /**
   * Collect completion documents from specific paths
   * Requirement 2.1: Extract information from completion documents
   */
  async collectFromPaths(paths: string[], filter?: DocumentFilter): Promise<DocumentCollectionResult> {
    const startTime = Date.now();
    const result: DocumentCollectionResult = {
      documents: [],
      metadata: {
        totalFilesScanned: paths.length,
        documentsFound: 0,
        documentsLoaded: 0,
        documentsFiltered: 0,
        collectionDate: new Date(),
        processingTimeMs: 0
      },
      errors: [],
      warnings: []
    };

    try {
      // Discover completion documents from paths
      const discoveredDocuments = await this.discoverCompletionDocuments(paths, result);
      result.metadata.documentsFound = discoveredDocuments.length;

      // Load and validate documents
      const loadedDocuments = await this.loadDocuments(discoveredDocuments, result);
      result.metadata.documentsLoaded = loadedDocuments.length;

      // Apply filters
      const filteredDocuments = this.filterDocuments(loadedDocuments, filter, result);
      result.metadata.documentsFiltered = filteredDocuments.length;

      result.documents = filteredDocuments;
      result.metadata.processingTimeMs = Date.now() - startTime;

      return result;
    } catch (error) {
      result.errors.push({
        filePath: 'collection-process',
        error: `Collection failed: ${error instanceof Error ? error.message : String(error)}`,
        type: 'validation',
        recoverable: false
      });
      result.metadata.processingTimeMs = Date.now() - startTime;
      return result;
    }
  }

  /**
   * Validate a completion document
   * Requirement 2.1: Extract and validate completion document information
   */
  async validateDocument(document: CompletionDocument): Promise<DocumentValidationResult> {
    const issues: ValidationIssue[] = [];
    let confidence = 1.0;

    // Check for required metadata
    if (!document.metadata.title) {
      issues.push({
        type: 'missing-metadata',
        severity: 'warning',
        message: 'Document missing title',
        field: 'title'
      });
      confidence -= 0.2;
    }

    if (!document.metadata.date) {
      issues.push({
        type: 'missing-metadata',
        severity: 'info',
        message: 'Document missing date metadata',
        field: 'date'
      });
      confidence -= 0.1;
    }

    // Check content quality
    if (!document.content || document.content.trim().length < 50) {
      issues.push({
        type: 'empty-content',
        severity: 'error',
        message: 'Document content is empty or too short',
        field: 'content'
      });
      confidence -= 0.5;
    }

    // Check document type classification
    if (document.metadata.type === 'other') {
      issues.push({
        type: 'invalid-format',
        severity: 'warning',
        message: 'Could not determine document type from path or content',
        field: 'type'
      });
      confidence -= 0.1;
    }

    // Check for structured sections (higher confidence for structured documents)
    const hasStructuredSections = this.hasStructuredSections(document.content);
    if (hasStructuredSections) {
      confidence += 0.1;
    } else {
      issues.push({
        type: 'invalid-format',
        severity: 'info',
        message: 'Document does not appear to have structured sections',
        field: 'format'
      });
    }

    // Ensure confidence stays within bounds
    confidence = Math.max(0, Math.min(1, confidence));

    return {
      isValid: issues.filter(i => i.severity === 'error').length === 0,
      confidence,
      issues,
      metadata: document.metadata
    };
  }

  /**
   * Discover completion documents from file paths
   */
  private async discoverCompletionDocuments(
    filePaths: string[],
    result: DocumentCollectionResult
  ): Promise<string[]> {
    const discoveredPaths: string[] = [];

    for (const filePath of filePaths) {
      try {
        if (this.isCompletionDocument(filePath)) {
          // Check if file exists and is accessible
          const fullPath = join(this.workingDirectory, filePath);
          if (existsSync(fullPath)) {
            discoveredPaths.push(filePath);
          } else {
            result.errors.push({
              filePath,
              error: 'File not found or not accessible',
              type: 'access',
              recoverable: false
            });
          }
        }
      } catch (error) {
        result.errors.push({
          filePath,
          error: `Discovery failed: ${error instanceof Error ? error.message : String(error)}`,
          type: 'access',
          recoverable: true
        });
      }
    }

    return discoveredPaths;
  }

  /**
   * Load completion documents from file paths
   */
  private async loadDocuments(
    filePaths: string[],
    result: DocumentCollectionResult
  ): Promise<CompletionDocument[]> {
    const documents: CompletionDocument[] = [];
    const documentRecovery = new DocumentErrorRecovery({
      skipMalformedDocuments: true,
      useBasicParsing: true,
      requireMinimumContent: 50
    });

    for (const filePath of filePaths) {
      const context: ErrorContext = {
        operation: 'loadCompletionDocument',
        component: 'CompletionDocumentCollector',
        filePath,
        timestamp: new Date()
      };

      const loadResult = await withErrorHandling(async () => {
        return await this.loadCompletionDocument(filePath);
      }, context);

      if (loadResult.success && loadResult.data) {
        documents.push(loadResult.data);
      } else if (loadResult.error) {
        // Try document recovery
        try {
          const fs = await import('fs/promises');
          const content = await fs.readFile(join(this.workingDirectory, filePath), 'utf-8');

          const recoveryResult = await documentRecovery.recoverFromParsingError(
            filePath,
            content,
            new Error(loadResult.error.message)
          );

          if (recoveryResult.success && recoveryResult.data) {
            documents.push(recoveryResult.data);
            result.warnings.push(`Recovered document using fallback parsing: ${filePath}`);
          } else {
            result.errors.push({
              filePath,
              error: `Loading failed: ${loadResult.error.message}`,
              type: 'parse',
              recoverable: false
            });
          }
        } catch (recoveryError) {
          result.errors.push({
            filePath,
            error: `Loading and recovery failed: ${loadResult.error.message}`,
            type: 'access',
            recoverable: false
          });
        }
      } else {
        result.warnings.push(`Could not load completion document: ${filePath}`);
      }
    }

    return documents;
  }

  /**
   * Filter documents based on criteria
   * Requirement 2.2: Filter documentation-only changes
   */
  private filterDocuments(
    documents: CompletionDocument[],
    filter: DocumentFilter | undefined,
    result: DocumentCollectionResult
  ): CompletionDocument[] {
    return documents.filter(document => {
      // Always check if document is documentation-only (Requirement 2.2)
      if (this.isDocumentationOnly(document)) {
        result.warnings.push(`Filtered documentation-only document: ${document.path}`);
        return false;
      }

      // Apply additional filters if provided
      if (filter) {
        // Check include patterns
        if (filter.includePatterns && filter.includePatterns.length > 0) {
          const matches = filter.includePatterns.some(pattern =>
            this.matchesPattern(document.path, pattern)
          );
          if (!matches) {
            return false;
          }
        }

        // Check exclude patterns
        if (filter.excludePatterns && filter.excludePatterns.length > 0) {
          const excluded = filter.excludePatterns.some(pattern =>
            this.matchesPattern(document.path, pattern)
          );
          if (excluded) {
            return false;
          }
        }

        // Check document types
        if (filter.documentTypes && filter.documentTypes.length > 0) {
          if (!filter.documentTypes.includes(document.metadata.type)) {
            return false;
          }
        }
      }

      return true;
    });
  }

  /**
   * Check if a file path represents a completion document
   */
  protected isCompletionDocument(filePath: string): boolean {
    // Use configuration patterns
    const patterns = this.config.extraction.completionPatterns;

    return patterns.some(pattern => this.matchesPattern(filePath, pattern)) ||
      this.matchesCompletionPath(filePath);
  }

  /**
   * Check if path matches completion document patterns
   */
  private matchesCompletionPath(filePath: string): boolean {
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
    } catch (error) {
      throw new Error(`Failed to load document ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
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

    try {
      // Ensure content is a string
      const safeContent = typeof content === 'string' ? content : String(content || '');

      // Extract title from first heading
      const titleMatch = safeContent.match(/^#\s+(.+)$/m);
      if (titleMatch && titleMatch[1]) {
        metadata.title = titleMatch[1].trim();
      }

      // Extract metadata from document header
      const dateMatch = safeContent.match(/\*\*Date\*\*:\s*(.+)$/m);
      if (dateMatch && dateMatch[1]) {
        metadata.date = dateMatch[1].trim();
      }

      const taskMatch = safeContent.match(/\*\*Task\*\*:\s*(.+)$/m);
      if (taskMatch && taskMatch[1]) {
        metadata.task = taskMatch[1].trim();
      }

      const specMatch = safeContent.match(/\*\*Spec\*\*:\s*(.+)$/m);
      if (specMatch && specMatch[1]) {
        metadata.spec = specMatch[1].trim();
      }

      const statusMatch = safeContent.match(/\*\*Status\*\*:\s*(.+)$/m);
      if (statusMatch && statusMatch[1]) {
        metadata.status = statusMatch[1].trim();
      }

      // Determine document type based on path and content
      if (filePath.includes('task-') && filePath.includes('-completion.md')) {
        metadata.type = 'task-completion';
      } else if (filePath.includes('spec-completion')) {
        metadata.type = 'spec-completion';
      }

      // Fallback title from filename if no title found
      if (!metadata.title) {
        const basename = filePath.split('/').pop() || filePath;
        metadata.title = basename.replace(/\.md$/, '').replace(/-/g, ' ');
      }
    } catch (error) {
      // If metadata extraction fails, provide fallback values
      console.warn(`⚠️  Metadata extraction failed for ${filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      const basename = filePath.split('/').pop() || filePath;
      metadata.title = basename.replace(/\.md$/, '').replace(/-/g, ' ');
      metadata.type = 'task-completion'; // Safe default
    }

    return metadata;
  }

  /**
   * Check if document has structured sections
   */
  private hasStructuredSections(content: string): boolean {
    // Safely access section headers with fallbacks
    const sectionHeaders: string[] = [];
    
    if (this.config?.extraction?.sectionHeaders) {
      const headers = this.config.extraction.sectionHeaders;
      if (headers.breakingChanges) sectionHeaders.push(...headers.breakingChanges);
      if (headers.features) sectionHeaders.push(...headers.features);
      if (headers.bugFixes) sectionHeaders.push(...headers.bugFixes);
      if (headers.improvements) sectionHeaders.push(...headers.improvements);
      if (headers.summary) sectionHeaders.push(...headers.summary);
    }

    // Fallback headers if config is not available
    if (sectionHeaders.length === 0) {
      sectionHeaders.push(
        'Breaking Changes', 'New Features', 'Features', 'Bug Fixes', 'Fixes',
        'Improvements', 'Summary', 'Overview'
      );
    }

    return sectionHeaders.some(header => {
      try {
        const headerPattern = new RegExp(`^##?\\s+${header}\\s*$`, 'mi');
        return headerPattern.test(content);
      } catch (regexError) {
        // If regex fails, try simple string matching
        return content.toLowerCase().includes(header.toLowerCase());
      }
    });
  }

  /**
   * Check if document contains only documentation changes
   * Requirement 2.2: Filter documentation-only changes
   */
  private isDocumentationOnly(document: CompletionDocument): boolean {
    // Safely get documentation keywords with fallback
    const docKeywords = this.config?.extraction?.documentationKeywords || [
      'documentation', 'docs', 'readme', 'comments', 'examples', 'guide', 'tutorial'
    ];
    
    const content = document.content.toLowerCase();
    const title = document.metadata.title.toLowerCase();

    // Check if title or content heavily features documentation keywords
    const docKeywordCount = docKeywords.reduce((count, keyword) => {
      try {
        const titleMatches = (title.match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
        const contentMatches = (content.match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
        return count + titleMatches * 3 + contentMatches; // Weight title matches more heavily
      } catch (regexError) {
        // If regex fails, use simple string matching
        const titleMatches = title.split(keyword.toLowerCase()).length - 1;
        const contentMatches = content.split(keyword.toLowerCase()).length - 1;
        return count + titleMatches * 3 + contentMatches;
      }
    }, 0);

    // Check for functional change keywords
    const functionalKeywords = [
      ...this.config.extraction.breakingChangeKeywords,
      ...this.config.extraction.featureKeywords,
      ...this.config.extraction.bugFixKeywords,
      ...this.config.extraction.improvementKeywords
    ];

    const functionalKeywordCount = functionalKeywords.reduce((count, keyword) => {
      const matches = (content.match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
      return count + matches;
    }, 0);

    // Consider documentation-only if:
    // 1. Title contains "documentation" and content has multiple doc keywords
    // 2. Or if document has high ratio of documentation keywords and low functional content
    const isDocOnly = (title.includes('documentation') && docKeywordCount >= 4) ||
      (docKeywordCount >= 6 && functionalKeywordCount === 0);

    return isDocOnly;
  }

  /**
   * Check if a path matches a glob-like pattern
   */
  protected matchesPattern(path: string, pattern: string): boolean {
    // Convert glob pattern to regex
    const regexPattern = pattern
      .replace(/\./g, '\\.')
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.');

    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(path);
  }

  /**
   * Get the commit that last modified a file
   */
  private getFileLastCommit(filePath: string): string {
    try {
      return this.executeGitCommand(`log -1 --format=%H -- "${filePath}"`).trim();
    } catch {
      return ''; // Silently return empty string when Git is not available
    }
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
      // Check if this is a "not a git repository" error
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.toLowerCase().includes('not a git repository') || 
          errorMessage.toLowerCase().includes('git: command not found')) {
        // Don't throw for common Git unavailability scenarios
        return '';
      }
      throw new Error(`Git command failed: git ${command}`);
    }
  }
}