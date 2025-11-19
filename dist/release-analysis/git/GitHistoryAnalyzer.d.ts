import { CompletionDocument } from '../types/AnalysisTypes';
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
    timeRange: {
        from: Date;
        to: Date;
    };
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
export declare class GitHistoryAnalyzer {
    private workingDirectory;
    constructor(workingDirectory?: string);
    /**
     * Find the last release tag in the repository
     * Requirement 5.1: Identify the last release tag automatically
     */
    findLastRelease(): Promise<GitTag | null>;
    /**
     * Get changes since a specific tag or commit
     * Requirements 5.2, 5.3: Include added/modified completion documents
     */
    getChangesSince(reference: string): Promise<GitChanges>;
    /**
     * Find completion documents from Git changes
     * Requirements 5.2, 5.3: Analyze completion documents that were added or modified
     */
    findCompletionDocuments(changes: GitChanges): Promise<CompletionDocument[]>;
    /**
     * Validate analysis scope
     * Requirement 5.5: Provide fallback mechanisms and validation
     */
    validateAnalysisScope(scope: AnalysisScope): ValidationResult;
    /**
     * Check if current directory is a Git repository
     */
    private isGitRepository;
    /**
     * Check if a tag name looks like a release tag (semantic versioning)
     */
    private isReleaseTag;
    /**
     * Get detailed information about a Git tag
     */
    private getTagInfo;
    /**
     * Get commits since a reference point
     */
    private getCommitsSince;
    /**
     * Get file changes since a reference point
     */
    private getFileChangesSince;
    /**
     * Get commit date for a specific commit
     */
    private getCommitDate;
    /**
     * Check if a file path represents a completion document
     */
    private isCompletionDocument;
    /**
     * Load and parse a completion document
     */
    private loadCompletionDocument;
    /**
     * Get the commit that last modified a file
     */
    private getFileLastCommit;
    /**
     * Extract metadata from completion document content
     */
    private extractDocumentMetadata;
    /**
     * Execute a Git command and return output
     */
    private executeGitCommand;
}
//# sourceMappingURL=GitHistoryAnalyzer.d.ts.map