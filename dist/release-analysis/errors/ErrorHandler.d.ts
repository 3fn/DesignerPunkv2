/**
 * Comprehensive Error Handling System for Release Analysis
 *
 * Provides centralized error handling with graceful recovery strategies,
 * clear error messages, and actionable guidance for users.
 *
 * Requirements addressed:
 * - 8.1: Validate completion documents are properly formatted and accessible
 * - 8.2: Provide confidence scores for extracted information
 * - 8.3: Provide clear rationale and supporting evidence
 * - 8.4: Highlight areas requiring human review
 * - 8.5: Provide clear, actionable error messages with resolution guidance
 */
export interface ErrorContext {
    operation: string;
    component: string;
    filePath?: string;
    gitCommand?: string;
    userAction?: string;
    timestamp: Date;
}
export interface RecoveryStrategy {
    type: 'fallback' | 'retry' | 'skip' | 'manual' | 'abort';
    description: string;
    action?: () => Promise<any>;
    guidance: string;
}
export interface ErrorDetails {
    code: string;
    message: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    category: 'git' | 'parsing' | 'validation' | 'configuration' | 'filesystem' | 'network';
    context: ErrorContext;
    recoveryStrategies: RecoveryStrategy[];
    userGuidance: string;
    technicalDetails?: string;
}
export interface ErrorHandlingResult<T = any> {
    success: boolean;
    data?: T;
    error?: ErrorDetails;
    warnings: string[];
    recoveryApplied?: RecoveryStrategy;
}
/**
 * Centralized error handler for release analysis operations
 */
export declare class ReleaseAnalysisErrorHandler {
    private errorHistory;
    private recoveryAttempts;
    private maxRetryAttempts;
    /**
     * Handle Git repository errors with fallback strategies
     * Requirement 8.5: Clear, actionable error messages with resolution guidance
     */
    handleGitError(error: Error, context: ErrorContext, fallbackAction?: () => Promise<any>): Promise<ErrorHandlingResult>;
    /**
     * Handle completion document parsing errors with recovery
     * Requirement 8.1: Validate completion documents are properly formatted
     */
    handleParsingError(error: Error, filePath: string, context: ErrorContext, skipOnError?: boolean): Promise<ErrorHandlingResult>;
    /**
     * Handle validation errors with confidence scoring
     * Requirement 8.2: Provide confidence scores for extracted information
     */
    handleValidationError(error: Error, context: ErrorContext, confidenceImpact?: number): Promise<ErrorHandlingResult>;
    /**
     * Handle configuration errors with clear guidance
     * Requirement 8.5: Clear, actionable error messages with resolution guidance
     */
    handleConfigurationError(error: Error, context: ErrorContext, configPath?: string): Promise<ErrorHandlingResult>;
    /**
     * Handle filesystem errors with fallback strategies
     * Requirement 8.1: Validate completion documents are accessible
     */
    handleFilesystemError(error: Error, filePath: string, context: ErrorContext, operation?: 'read' | 'write' | 'access'): Promise<ErrorHandlingResult>;
    /**
     * Create a comprehensive error summary for user review
     * Requirement 8.4: Highlight areas requiring human review
     */
    createErrorSummary(): {
        totalErrors: number;
        criticalErrors: ErrorDetails[];
        recoverableErrors: ErrorDetails[];
        warnings: string[];
        recommendations: string[];
    };
    /**
     * Clear error history (useful for new analysis runs)
     */
    clearErrorHistory(): void;
    /**
     * Get formatted error report for CLI display
     * Requirement 8.3: Provide clear rationale and supporting evidence
     */
    getFormattedErrorReport(): string;
    private attemptRecovery;
    private logError;
    private extractGitErrorMessage;
    private determineGitErrorSeverity;
    private getGitRecoveryStrategies;
    private getGitUserGuidance;
    private extractParsingErrorMessage;
    private getParsingRecoveryStrategies;
    private getParsingUserGuidance;
    private getValidationRecoveryStrategies;
    private getValidationUserGuidance;
    private getConfigurationRecoveryStrategies;
    private getConfigurationUserGuidance;
    private extractFilesystemErrorMessage;
    private getFilesystemRecoveryStrategies;
    private getFilesystemUserGuidance;
    private generateRecommendations;
    private groupErrorsByCategory;
    private getDefaultConfiguration;
}
/**
 * Global error handler instance for release analysis
 */
export declare const releaseAnalysisErrorHandler: ReleaseAnalysisErrorHandler;
/**
 * Utility function to wrap operations with error handling
 */
export declare function withErrorHandling<T>(operation: () => Promise<T>, context: ErrorContext, errorHandler?: ReleaseAnalysisErrorHandler): Promise<ErrorHandlingResult<T>>;
//# sourceMappingURL=ErrorHandler.d.ts.map