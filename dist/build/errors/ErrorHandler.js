"use strict";
/**
 * Error Handler
 *
 * Central error handling system for the Cross-Platform Build System.
 * Provides error categorization, recovery strategies, and logging.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = void 0;
const BuildError_1 = require("./BuildError");
const RecoveryStrategy_1 = require("./RecoveryStrategy");
const ErrorDocumentation_1 = require("./ErrorDocumentation");
const ErrorReporter_1 = require("./ErrorReporter");
/**
 * Error Handler class
 *
 * Provides centralized error handling with categorization,
 * recovery strategies, and logging capabilities.
 */
class ErrorHandler {
    constructor(options = {}) {
        this.errorLog = [];
        this.recoveryCoordinator = new RecoveryStrategy_1.RecoveryStrategyCoordinator();
        this.options = {
            verbose: options.verbose ?? false,
            maxRetries: options.maxRetries ?? 3,
            continueOnPlatformFailure: options.continueOnPlatformFailure ?? true,
            logger: options.logger ?? this.defaultLogger.bind(this),
        };
        // Initialize error reporter with matching options
        this.errorReporter = new ErrorReporter_1.ErrorReporter({
            includeStackTraces: this.options.verbose,
            includeContext: this.options.verbose,
            includeRecommendations: true,
            format: 'text',
        });
    }
    /**
     * Handle a build error
     */
    handleError(error) {
        // Enhance error with documentation and suggestions
        const enhancedError = (0, ErrorDocumentation_1.enhanceErrorWithDocumentation)(error);
        // Log the enhanced error
        this.logError(enhancedError);
        // Determine recovery strategy based on error category and severity
        const recovery = this.determineRecovery(enhancedError);
        if (this.options.verbose) {
            console.log(`[ErrorHandler] Recovery strategy: ${recovery.strategy}`);
            console.log(`[ErrorHandler] Recoverable: ${recovery.recoverable}`);
        }
        return recovery;
    }
    /**
     * Attempt to recover from an error
     */
    async recover(error, context) {
        const recovery = this.handleError(error);
        if (!recovery.recoverable) {
            return {
                success: false,
                strategy: recovery.strategy,
                message: `Error is not recoverable: ${error.message}`,
                errors: [error],
            };
        }
        try {
            // Build recovery context
            const recoveryContext = {
                error,
                maxRetries: this.options.maxRetries,
                ...context,
            };
            // Execute recovery strategy
            const executionResult = await this.recoveryCoordinator.executeRecovery(recovery.strategy, recoveryContext);
            return {
                success: executionResult.success,
                strategy: executionResult.strategy,
                message: executionResult.message,
                errors: executionResult.errors,
            };
        }
        catch (recoveryError) {
            const wrappedError = this.wrapError(recoveryError, error);
            return {
                success: false,
                strategy: recovery.strategy,
                message: `Recovery failed: ${wrappedError.message}`,
                errors: [error, wrappedError],
            };
        }
    }
    /**
     * Attempt to recover from an error with explicit strategy
     */
    async recoverWithStrategy(error, strategy, context) {
        try {
            // Build recovery context
            const recoveryContext = {
                error,
                maxRetries: this.options.maxRetries,
                ...context,
            };
            // Execute recovery strategy
            const executionResult = await this.recoveryCoordinator.executeRecovery(strategy, recoveryContext);
            return {
                success: executionResult.success,
                strategy: executionResult.strategy,
                message: executionResult.message,
                errors: executionResult.errors,
            };
        }
        catch (recoveryError) {
            const wrappedError = this.wrapError(recoveryError, error);
            return {
                success: false,
                strategy,
                message: `Recovery failed: ${wrappedError.message}`,
                errors: [error, wrappedError],
            };
        }
    }
    /**
     * Get all logged errors
     */
    getErrors() {
        return [...this.errorLog];
    }
    /**
     * Get errors by category
     */
    getErrorsByCategory(category) {
        return this.errorLog.filter(error => error.category === category);
    }
    /**
     * Get errors by platform
     */
    getErrorsByPlatform(platform) {
        return this.errorLog.filter(error => error.platform === platform);
    }
    /**
     * Get errors by severity
     */
    getErrorsBySeverity(severity) {
        return this.errorLog.filter(error => error.severity === severity);
    }
    /**
     * Clear error log
     */
    clearErrors() {
        this.errorLog = [];
    }
    /**
     * Check if there are any critical errors
     */
    hasCriticalErrors() {
        return this.errorLog.some(error => error.severity === 'error');
    }
    /**
     * Categorize an unknown error
     */
    categorizeError(error) {
        if ((0, BuildError_1.isBuildError)(error)) {
            return error;
        }
        // Wrap unknown errors as build errors
        return this.wrapError(error);
    }
    /**
     * Generate comprehensive error report
     */
    generateReport(buildSummary) {
        return this.errorReporter.generateReport(this.errorLog, buildSummary);
    }
    /**
     * Generate error summary for build results
     */
    generateErrorSummary() {
        return this.errorReporter.generateErrorSummary(this.errorLog);
    }
    /**
     * Set error reporter options
     */
    setReporterOptions(options) {
        this.errorReporter = new ErrorReporter_1.ErrorReporter(options);
    }
    // Private methods
    determineRecovery(error) {
        // Critical errors are not recoverable
        if (error.severity === 'error') {
            // Platform-specific errors can be skipped if configured
            if (error.platform && this.options.continueOnPlatformFailure) {
                return {
                    recoverable: true,
                    strategy: 'skip',
                    actions: [
                        `Skip ${error.platform} platform build`,
                        'Continue with remaining platforms',
                        'Review error after build completes',
                    ],
                };
            }
            // Configuration errors require manual intervention
            if (error.category === 'config') {
                return {
                    recoverable: false,
                    strategy: 'abort',
                    actions: [
                        'Fix configuration issues',
                        'Review build configuration documentation',
                        'Restart build after fixing configuration',
                    ],
                };
            }
            // Build errors might be transient
            if (error.category === 'build') {
                return {
                    recoverable: true,
                    strategy: 'retry',
                    actions: [
                        'Retry build operation',
                        'Check for transient issues (network, file locks)',
                        'Review build logs for details',
                    ],
                };
            }
            // Token and interface errors need fallback
            return {
                recoverable: true,
                strategy: 'fallback',
                actions: [
                    'Use cached build artifacts if available',
                    'Use default configuration',
                    'Review error and fix underlying issue',
                ],
            };
        }
        // Warnings are always recoverable
        return {
            recoverable: true,
            strategy: 'skip',
            actions: [
                'Continue build with warning',
                'Review warning after build completes',
                'Consider addressing warning in future builds',
            ],
        };
    }
    logError(error) {
        this.errorLog.push(error);
        this.options.logger(error);
    }
    defaultLogger(error) {
        if (this.options.verbose) {
            // Use formatted error message for verbose output
            console.error((0, ErrorDocumentation_1.formatErrorMessage)(error));
        }
        else {
            // Simple output for non-verbose mode
            const prefix = `[${error.severity.toUpperCase()}] [${error.category}]`;
            const platformInfo = error.platform ? ` [${error.platform}]` : '';
            const componentInfo = error.component ? ` [${error.component}]` : '';
            console.error(`${prefix}${platformInfo}${componentInfo} ${error.code}: ${error.message}`);
            // Show top 3 suggestions even in non-verbose mode
            if (error.suggestions.length > 0) {
                console.error('Suggestions:');
                error.suggestions.slice(0, 3).forEach(suggestion => console.error(`  • ${suggestion}`));
                if (error.suggestions.length > 3) {
                    console.error(`  ... and ${error.suggestions.length - 3} more (use --verbose for details)`);
                }
            }
        }
    }
    wrapError(error, originalBuildError) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : undefined;
        return {
            code: 'UNKNOWN_ERROR',
            message: errorMessage,
            severity: 'error',
            category: 'build',
            context: {
                originalError: error,
                stack: errorStack,
                wrappedFrom: originalBuildError?.code,
            },
            suggestions: [
                'Review error details and stack trace',
                'Check build logs for additional context',
                'Report issue if error persists',
            ],
            documentation: [],
            originalError: error instanceof Error ? error : undefined,
            timestamp: new Date(),
        };
    }
}
exports.ErrorHandler = ErrorHandler;
//# sourceMappingURL=ErrorHandler.js.map