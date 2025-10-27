/**
 * Build Errors Module
 *
 * Exports all error handling functionality including:
 * - Error types and interfaces
 * - Error handler with recovery strategies
 * - Error documentation and suggestions
 * - Error formatting and reporting
 */
export { BuildError, ErrorCategory, ErrorSeverity, Platform, ErrorCodes, createBuildError, isBuildError, } from './BuildError';
export { ErrorHandler, ErrorHandlerOptions, ErrorRecovery, RecoveryResult, } from './ErrorHandler';
export { RecoveryStrategyType, RecoveryContext, RecoveryExecutionResult, RecoveryStrategyCoordinator, RetryStrategy, SkipStrategy, FallbackStrategy, AbortStrategy, } from './RecoveryStrategy';
export { ErrorDocumentation, ErrorLocation, ERROR_DOCUMENTATION, getErrorDocumentation, enhanceErrorWithDocumentation, addErrorLocation, formatErrorMessage, generateErrorReport, } from './ErrorDocumentation';
export { ErrorReporter, ErrorReport, ErrorReportOptions, BuildResultSummary, } from './ErrorReporter';
//# sourceMappingURL=index.d.ts.map