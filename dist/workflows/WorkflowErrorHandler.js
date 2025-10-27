"use strict";
/**
 * Workflow Error Handler
 *
 * Handles errors and recovery throughout the token generation workflow.
 * Provides error classification, recovery strategies, and detailed error reporting.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowErrorHandler = exports.ErrorSeverity = void 0;
const TokenGenerationWorkflow_1 = require("./TokenGenerationWorkflow");
/**
 * Error severity levels
 */
var ErrorSeverity;
(function (ErrorSeverity) {
    ErrorSeverity["CRITICAL"] = "critical";
    ErrorSeverity["RECOVERABLE"] = "recoverable";
    ErrorSeverity["WARNING"] = "warning";
})(ErrorSeverity || (exports.ErrorSeverity = ErrorSeverity = {}));
/**
 * Workflow Error Handler class
 */
class WorkflowErrorHandler {
    constructor() {
        this.errorHistory = [];
        this.recoveryAttempts = new Map();
        this.maxRecoveryAttempts = 3;
    }
    // ============================================================================
    // Error Handling
    // ============================================================================
    /**
     * Handle workflow error and determine recovery strategy
     */
    handleError(error, stage, context) {
        const errorInfo = this.classifyError(error, stage, context);
        this.errorHistory.push(errorInfo);
        return errorInfo;
    }
    /**
     * Classify error and determine severity
     */
    classifyError(error, stage, context) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const stackTrace = error instanceof Error ? error.stack : undefined;
        // Determine severity and recoverability based on error type and stage
        let severity;
        let recoverable;
        if (this.isCriticalError(errorMessage, stage)) {
            severity = ErrorSeverity.CRITICAL;
            recoverable = false;
        }
        else if (this.isRecoverableError(errorMessage, stage)) {
            severity = ErrorSeverity.RECOVERABLE;
            recoverable = true;
        }
        else {
            severity = ErrorSeverity.WARNING;
            recoverable = true;
        }
        return {
            stage,
            error: errorMessage,
            recoverable,
            severity,
            timestamp: new Date(),
            stackTrace,
            context
        };
    }
    /**
     * Check if error is critical (non-recoverable)
     */
    isCriticalError(errorMessage, stage) {
        const criticalPatterns = [
            /engine not initialized/i,
            /registry not found/i,
            /invalid configuration/i,
            /circular dependency/i,
            /system failure/i
        ];
        return criticalPatterns.some(pattern => pattern.test(errorMessage));
    }
    /**
     * Check if error is recoverable
     */
    isRecoverableError(errorMessage, stage) {
        const recoverablePatterns = [
            /validation failed/i,
            /token already exists/i,
            /unresolved reference/i,
            /consistency check failed/i,
            /translation failed/i
        ];
        return recoverablePatterns.some(pattern => pattern.test(errorMessage));
    }
    // ============================================================================
    // Recovery Strategies
    // ============================================================================
    /**
     * Get recovery strategy for an error
     */
    getRecoveryStrategy(error) {
        if (!error.recoverable) {
            return {
                canRecover: false,
                strategy: 'Manual intervention required',
                steps: [
                    'Review error details and context',
                    'Fix underlying issue',
                    'Restart workflow from beginning'
                ],
                automaticRecovery: false
            };
        }
        // Check recovery attempt count
        const attemptKey = `${error.stage}-${error.error}`;
        const attempts = this.recoveryAttempts.get(attemptKey) || 0;
        if (attempts >= this.maxRecoveryAttempts) {
            return {
                canRecover: false,
                strategy: 'Maximum recovery attempts exceeded',
                steps: [
                    'Manual intervention required',
                    'Review repeated error pattern',
                    'Consider workflow configuration changes'
                ],
                automaticRecovery: false
            };
        }
        // Determine recovery strategy based on stage and error type
        return this.determineRecoveryStrategy(error);
    }
    /**
     * Determine specific recovery strategy
     */
    determineRecoveryStrategy(error) {
        switch (error.stage) {
            case TokenGenerationWorkflow_1.WorkflowStage.TOKEN_REGISTRATION:
                return this.getRegistrationRecoveryStrategy(error);
            case TokenGenerationWorkflow_1.WorkflowStage.VALIDATION:
                return this.getValidationRecoveryStrategy(error);
            case TokenGenerationWorkflow_1.WorkflowStage.CONSISTENCY_CHECK:
                return this.getConsistencyRecoveryStrategy(error);
            case TokenGenerationWorkflow_1.WorkflowStage.TRANSLATION:
                return this.getTranslationRecoveryStrategy(error);
            default:
                return {
                    canRecover: true,
                    strategy: 'Continue with warnings',
                    steps: [
                        'Log error for review',
                        'Continue workflow execution',
                        'Monitor for additional errors'
                    ],
                    automaticRecovery: true
                };
        }
    }
    /**
     * Get recovery strategy for registration errors
     */
    getRegistrationRecoveryStrategy(error) {
        if (error.error.includes('already exists')) {
            return {
                canRecover: true,
                strategy: 'Skip duplicate token',
                steps: [
                    'Skip registration of duplicate token',
                    'Continue with remaining tokens',
                    'Log duplicate for review'
                ],
                automaticRecovery: true
            };
        }
        if (error.error.includes('unresolved reference')) {
            return {
                canRecover: true,
                strategy: 'Defer semantic token registration',
                steps: [
                    'Register primitive tokens first',
                    'Retry semantic token registration',
                    'Validate all references resolved'
                ],
                automaticRecovery: true
            };
        }
        return {
            canRecover: true,
            strategy: 'Skip problematic token',
            steps: [
                'Log token registration failure',
                'Continue with remaining tokens',
                'Review failed token definition'
            ],
            automaticRecovery: true
        };
    }
    /**
     * Get recovery strategy for validation errors
     */
    getValidationRecoveryStrategy(error) {
        return {
            canRecover: true,
            strategy: 'Continue with validation warnings',
            steps: [
                'Log validation failures',
                'Continue workflow execution',
                'Generate validation report for review'
            ],
            automaticRecovery: true
        };
    }
    /**
     * Get recovery strategy for consistency errors
     */
    getConsistencyRecoveryStrategy(error) {
        return {
            canRecover: true,
            strategy: 'Continue with consistency warnings',
            steps: [
                'Log consistency issues',
                'Continue workflow execution',
                'Flag tokens for manual review'
            ],
            automaticRecovery: true
        };
    }
    /**
     * Get recovery strategy for translation errors
     */
    getTranslationRecoveryStrategy(error) {
        return {
            canRecover: true,
            strategy: 'Continue with remaining platforms',
            steps: [
                'Log translation failure for affected platform',
                'Continue with remaining platforms',
                'Review platform-specific configuration'
            ],
            automaticRecovery: true
        };
    }
    /**
     * Attempt automatic recovery
     */
    attemptRecovery(error) {
        const strategy = this.getRecoveryStrategy(error);
        if (!strategy.canRecover || !strategy.automaticRecovery) {
            return false;
        }
        // Increment recovery attempt counter
        const attemptKey = `${error.stage}-${error.error}`;
        const attempts = this.recoveryAttempts.get(attemptKey) || 0;
        this.recoveryAttempts.set(attemptKey, attempts + 1);
        return true;
    }
    // ============================================================================
    // Error Reporting
    // ============================================================================
    /**
     * Create error validation result
     */
    createErrorResult(tokenName, error, message) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
            level: 'Error',
            token: tokenName,
            message,
            rationale: `Error occurred: ${errorMessage}`,
            mathematicalReasoning: 'Error prevented mathematical validation',
            suggestions: [
                'Review error details',
                'Check token definition',
                'Verify system configuration'
            ]
        };
    }
    /**
     * Get error history
     */
    getErrorHistory() {
        return [...this.errorHistory];
    }
    /**
     * Get errors by stage
     */
    getErrorsByStage(stage) {
        return this.errorHistory.filter(e => e.stage === stage);
    }
    /**
     * Get errors by severity
     */
    getErrorsBySeverity(severity) {
        return this.errorHistory.filter(e => e.severity === severity);
    }
    /**
     * Get critical errors
     */
    getCriticalErrors() {
        return this.getErrorsBySeverity(ErrorSeverity.CRITICAL);
    }
    /**
     * Get recoverable errors
     */
    getRecoverableErrors() {
        return this.getErrorsBySeverity(ErrorSeverity.RECOVERABLE);
    }
    /**
     * Generate error report
     */
    generateErrorReport() {
        const errorsByStage = {};
        for (const stage of Object.values(TokenGenerationWorkflow_1.WorkflowStage)) {
            errorsByStage[stage] = this.getErrorsByStage(stage).length;
        }
        const recentErrors = this.errorHistory.slice(-10);
        return {
            totalErrors: this.errorHistory.length,
            criticalErrors: this.getCriticalErrors().length,
            recoverableErrors: this.getRecoverableErrors().length,
            warningErrors: this.getErrorsBySeverity(ErrorSeverity.WARNING).length,
            errorsByStage,
            recentErrors
        };
    }
    // ============================================================================
    // State Management
    // ============================================================================
    /**
     * Clear error history
     */
    clearHistory() {
        this.errorHistory = [];
        this.recoveryAttempts.clear();
    }
    /**
     * Reset error handler
     */
    reset() {
        this.clearHistory();
    }
    /**
     * Set maximum recovery attempts
     */
    setMaxRecoveryAttempts(max) {
        this.maxRecoveryAttempts = max;
    }
    /**
     * Get maximum recovery attempts
     */
    getMaxRecoveryAttempts() {
        return this.maxRecoveryAttempts;
    }
}
exports.WorkflowErrorHandler = WorkflowErrorHandler;
//# sourceMappingURL=WorkflowErrorHandler.js.map