/**
 * Error Handler
 *
 * Central error handling system for the Cross-Platform Build System.
 * Provides error categorization, recovery strategies, and logging.
 */
import { BuildError, ErrorCategory, ErrorSeverity, Platform } from './BuildError';
import { RecoveryStrategyType as RecoveryStrategy, RecoveryContext } from './RecoveryStrategy';
import { ErrorReport, ErrorReportOptions, BuildResultSummary } from './ErrorReporter';
export type { RecoveryStrategy };
export type { ErrorReport, ErrorReportOptions, BuildResultSummary };
/**
 * Error recovery result
 */
export interface ErrorRecovery {
    /** Whether the error is recoverable */
    recoverable: boolean;
    /** Recommended recovery strategy */
    strategy: RecoveryStrategy;
    /** Actions to take for recovery */
    actions: string[];
    /** Additional context for recovery */
    context?: Record<string, unknown>;
}
/**
 * Recovery result after attempting recovery
 */
export interface RecoveryResult {
    /** Whether recovery was successful */
    success: boolean;
    /** Strategy that was used */
    strategy: RecoveryStrategy;
    /** Message describing the recovery outcome */
    message: string;
    /** Any errors that occurred during recovery */
    errors?: BuildError[];
}
/**
 * Error handler options
 */
export interface ErrorHandlerOptions {
    /** Enable verbose logging */
    verbose?: boolean;
    /** Maximum retry attempts for transient errors */
    maxRetries?: number;
    /** Whether to continue on platform-specific failures */
    continueOnPlatformFailure?: boolean;
    /** Custom error logger */
    logger?: (error: BuildError) => void;
}
/**
 * Error Handler class
 *
 * Provides centralized error handling with categorization,
 * recovery strategies, and logging capabilities.
 */
export declare class ErrorHandler {
    private options;
    private errorLog;
    private recoveryCoordinator;
    private errorReporter;
    constructor(options?: ErrorHandlerOptions);
    /**
     * Handle a build error
     */
    handleError(error: BuildError): ErrorRecovery;
    /**
     * Attempt to recover from an error
     */
    recover(error: BuildError, context?: Partial<RecoveryContext>): Promise<RecoveryResult>;
    /**
     * Attempt to recover from an error with explicit strategy
     */
    recoverWithStrategy(error: BuildError, strategy: RecoveryStrategy, context?: Partial<RecoveryContext>): Promise<RecoveryResult>;
    /**
     * Get all logged errors
     */
    getErrors(): BuildError[];
    /**
     * Get errors by category
     */
    getErrorsByCategory(category: ErrorCategory): BuildError[];
    /**
     * Get errors by platform
     */
    getErrorsByPlatform(platform: Platform): BuildError[];
    /**
     * Get errors by severity
     */
    getErrorsBySeverity(severity: ErrorSeverity): BuildError[];
    /**
     * Clear error log
     */
    clearErrors(): void;
    /**
     * Check if there are any critical errors
     */
    hasCriticalErrors(): boolean;
    /**
     * Categorize an unknown error
     */
    categorizeError(error: unknown): BuildError;
    /**
     * Generate comprehensive error report
     */
    generateReport(buildSummary?: BuildResultSummary): ErrorReport;
    /**
     * Generate error summary for build results
     */
    generateErrorSummary(): string;
    /**
     * Set error reporter options
     */
    setReporterOptions(options: ErrorReportOptions): void;
    private determineRecovery;
    private logError;
    private defaultLogger;
    private wrapError;
}
//# sourceMappingURL=ErrorHandler.d.ts.map