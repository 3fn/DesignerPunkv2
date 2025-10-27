import { AnalysisConfig } from '../config/AnalysisConfig';
import { GitChanges, CompletionDocument, DocumentMetadata } from '../git/GitHistoryAnalyzer';
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
export declare class CompletionDocumentCollector {
    private workingDirectory;
    private config;
    constructor(workingDirectory: string | undefined, config: AnalysisConfig);
    /**
     * Collect completion documents from Git changes
     * Requirement 5.2, 5.3: Include added/modified completion documents
     */
    collectFromGitChanges(changes: GitChanges, filter?: DocumentFilter): Promise<DocumentCollectionResult>;
    /**
     * Collect completion documents from specific paths
     * Requirement 2.1: Extract information from completion documents
     */
    collectFromPaths(paths: string[], filter?: DocumentFilter): Promise<DocumentCollectionResult>;
    /**
     * Validate a completion document
     * Requirement 2.1: Extract and validate completion document information
     */
    validateDocument(document: CompletionDocument): Promise<DocumentValidationResult>;
    /**
     * Discover completion documents from file paths
     */
    private discoverCompletionDocuments;
    /**
     * Load completion documents from file paths
     */
    private loadDocuments;
    /**
     * Filter documents based on criteria
     * Requirement 2.2: Filter documentation-only changes
     */
    private filterDocuments;
    /**
     * Check if a file path represents a completion document
     */
    protected isCompletionDocument(filePath: string): boolean;
    /**
     * Check if path matches completion document patterns
     */
    private matchesCompletionPath;
    /**
     * Load and parse a completion document
     */
    private loadCompletionDocument;
    /**
     * Extract metadata from completion document content
     */
    private extractDocumentMetadata;
    /**
     * Check if document has structured sections
     */
    private hasStructuredSections;
    /**
     * Check if document contains only documentation changes
     * Requirement 2.2: Filter documentation-only changes
     */
    private isDocumentationOnly;
    /**
     * Check if a path matches a glob-like pattern
     */
    protected matchesPattern(path: string, pattern: string): boolean;
    /**
     * Get the commit that last modified a file
     */
    private getFileLastCommit;
    /**
     * Execute a Git command and return output
     */
    private executeGitCommand;
}
//# sourceMappingURL=CompletionDocumentCollector.d.ts.map