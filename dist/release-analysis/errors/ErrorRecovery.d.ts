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
import { ErrorHandlingResult } from './ErrorHandler';
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
export declare class GitErrorRecovery {
    private workingDirectory;
    private options;
    constructor(workingDirectory: string, options?: GitRecoveryOptions);
    /**
     * Recover from "not a git repository" error
     */
    recoverFromNoGitRepository(): Promise<ErrorHandlingResult>;
    /**
     * Recover from invalid Git reference error
     */
    recoverFromInvalidReference(reference: string): Promise<ErrorHandlingResult>;
    /**
     * Recover from Git permission errors
     */
    recoverFromPermissionError(): Promise<ErrorHandlingResult>;
    private findGitRoot;
    private findParentGitRepository;
    private findMostRecentTag;
    private findFirstCommit;
    private testBasicGitAccess;
    private testReadOnlyGitAccess;
}
/**
 * Document parsing error recovery utilities
 */
export declare class DocumentErrorRecovery {
    private options;
    constructor(options?: DocumentRecoveryOptions);
    /**
     * Recover from document parsing errors
     */
    recoverFromParsingError(filePath: string, content: string, error: Error): Promise<ErrorHandlingResult>;
    /**
     * Recover from empty or corrupted document content
     */
    recoverFromEmptyDocument(filePath: string): Promise<ErrorHandlingResult>;
    private attemptBasicParsing;
    private createDocumentFromFilename;
    private tryAlternativeEncodings;
    private inferDocumentType;
}
/**
 * Configuration error recovery utilities
 */
export declare class ConfigurationErrorRecovery {
    private options;
    constructor(options?: ConfigRecoveryOptions);
    /**
     * Recover from missing configuration file
     */
    recoverFromMissingConfig(configPath: string): Promise<ErrorHandlingResult>;
    /**
     * Recover from invalid configuration format
     */
    recoverFromInvalidConfig(configPath: string, error: Error): Promise<ErrorHandlingResult>;
    private getDefaultConfiguration;
    private createConfigurationFile;
    private backupConfigurationFile;
    private attemptConfigurationFix;
}
/**
 * Utility function to create recovery instances with common options
 */
export declare function createRecoveryUtilities(workingDirectory: string): {
    git: GitErrorRecovery;
    document: DocumentErrorRecovery;
    configuration: ConfigurationErrorRecovery;
};
//# sourceMappingURL=ErrorRecovery.d.ts.map