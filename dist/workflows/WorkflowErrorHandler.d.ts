/**
 * Workflow Error Handler
 *
 * Handles errors and recovery throughout the token generation workflow.
 * Provides error classification, recovery strategies, and detailed error reporting.
 */
import { WorkflowStage } from './TokenGenerationWorkflow';
import type { ValidationResult } from '../types';
/**
 * Error severity levels
 */
export declare enum ErrorSeverity {
    CRITICAL = "critical",
    RECOVERABLE = "recoverable",
    WARNING = "warning"
}
/**
 * Error information
 */
export interface WorkflowError {
    stage: WorkflowStage;
    error: string;
    recoverable: boolean;
    severity: ErrorSeverity;
    timestamp: Date;
    stackTrace?: string;
    context?: Record<string, any>;
}
/**
 * Recovery strategy
 */
export interface RecoveryStrategy {
    canRecover: boolean;
    strategy: string;
    steps: string[];
    automaticRecovery: boolean;
}
/**
 * Workflow Error Handler class
 */
export declare class WorkflowErrorHandler {
    private errorHistory;
    private recoveryAttempts;
    private maxRecoveryAttempts;
    /**
     * Handle workflow error and determine recovery strategy
     */
    handleError(error: unknown, stage: WorkflowStage, context?: Record<string, any>): WorkflowError;
    /**
     * Classify error and determine severity
     */
    private classifyError;
    /**
     * Check if error is critical (non-recoverable)
     */
    private isCriticalError;
    /**
     * Check if error is recoverable
     */
    private isRecoverableError;
    /**
     * Get recovery strategy for an error
     */
    getRecoveryStrategy(error: WorkflowError): RecoveryStrategy;
    /**
     * Determine specific recovery strategy
     */
    private determineRecoveryStrategy;
    /**
     * Get recovery strategy for registration errors
     */
    private getRegistrationRecoveryStrategy;
    /**
     * Get recovery strategy for validation errors
     */
    private getValidationRecoveryStrategy;
    /**
     * Get recovery strategy for consistency errors
     */
    private getConsistencyRecoveryStrategy;
    /**
     * Get recovery strategy for translation errors
     */
    private getTranslationRecoveryStrategy;
    /**
     * Attempt automatic recovery
     */
    attemptRecovery(error: WorkflowError): boolean;
    /**
     * Create error validation result
     */
    createErrorResult(tokenName: string, error: unknown, message: string): ValidationResult;
    /**
     * Get error history
     */
    getErrorHistory(): WorkflowError[];
    /**
     * Get errors by stage
     */
    getErrorsByStage(stage: WorkflowStage): WorkflowError[];
    /**
     * Get errors by severity
     */
    getErrorsBySeverity(severity: ErrorSeverity): WorkflowError[];
    /**
     * Get critical errors
     */
    getCriticalErrors(): WorkflowError[];
    /**
     * Get recoverable errors
     */
    getRecoverableErrors(): WorkflowError[];
    /**
     * Generate error report
     */
    generateErrorReport(): {
        totalErrors: number;
        criticalErrors: number;
        recoverableErrors: number;
        warningErrors: number;
        errorsByStage: Record<WorkflowStage, number>;
        recentErrors: WorkflowError[];
    };
    /**
     * Clear error history
     */
    clearHistory(): void;
    /**
     * Reset error handler
     */
    reset(): void;
    /**
     * Set maximum recovery attempts
     */
    setMaxRecoveryAttempts(max: number): void;
    /**
     * Get maximum recovery attempts
     */
    getMaxRecoveryAttempts(): number;
}
//# sourceMappingURL=WorkflowErrorHandler.d.ts.map