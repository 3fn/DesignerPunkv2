/**
 * Release Analysis Error Handling Module
 *
 * Exports comprehensive error handling utilities for the release analysis system.
 * Provides centralized error management, recovery strategies, and user guidance.
 */
import { ErrorContext, ErrorDetails } from '../types';
export { ReleaseAnalysisErrorHandler, releaseAnalysisErrorHandler, withErrorHandling, type ErrorHandlingResult, } from './ErrorHandler';
export type { ErrorContext, ErrorDetails, RecoveryStrategy } from '../types';
export { GitErrorRecovery, DocumentErrorRecovery, ConfigurationErrorRecovery, createRecoveryUtilities, type GitRecoveryOptions, type DocumentRecoveryOptions, type ConfigRecoveryOptions } from './ErrorRecovery';
export declare const createErrorContext: (operation: string, component: string, additionalContext?: Partial<ErrorContext>) => ErrorContext;
export declare const formatErrorForCLI: (error: ErrorDetails) => string;
export declare const handleMultipleErrors: <T>(operations: Array<() => Promise<T>>, context: Omit<ErrorContext, "operation">, continueOnError?: boolean) => Promise<{
    results: T[];
    errors: ErrorDetails[];
    successCount: number;
}>;
//# sourceMappingURL=index.d.ts.map