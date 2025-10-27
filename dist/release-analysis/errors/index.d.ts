/**
 * Release Analysis Error Handling Module
 *
 * Exports comprehensive error handling utilities for the release analysis system.
 * Provides centralized error management, recovery strategies, and user guidance.
 */
export { ReleaseAnalysisErrorHandler, releaseAnalysisErrorHandler, withErrorHandling, type ErrorContext, type ErrorDetails, type ErrorHandlingResult, type RecoveryStrategy } from './ErrorHandler';
export { GitErrorRecovery, DocumentErrorRecovery, ConfigurationErrorRecovery, createRecoveryUtilities, type GitRecoveryOptions, type DocumentRecoveryOptions, type ConfigRecoveryOptions } from './ErrorRecovery';
export declare const createErrorContext: (operation: string, component: string, additionalContext?: Partial<ErrorContext>) => ErrorContext;
export declare const formatErrorForCLI: (error: ErrorDetails) => string;
export declare const handleMultipleErrors: <T>(operations: Array<() => Promise<T>>, context: Omit<ErrorContext, "operation">, continueOnError?: boolean) => Promise<{
    results: T[];
    errors: ErrorDetails[];
    successCount: number;
}>;
//# sourceMappingURL=index.d.ts.map