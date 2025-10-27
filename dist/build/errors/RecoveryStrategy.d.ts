/**
 * Recovery Strategy Implementations
 *
 * Provides concrete implementations for error recovery strategies:
 * - Retry: Attempt operation again for transient errors
 * - Skip: Skip problematic platform and continue with others
 * - Fallback: Use cached build or default configuration
 * - Abort: Stop build and require manual intervention
 */
import { BuildError, Platform } from './BuildError';
/**
 * Recovery strategy types
 */
export type RecoveryStrategyType = 'retry' | 'skip' | 'fallback' | 'abort';
/**
 * Recovery context for strategy execution
 */
export interface RecoveryContext {
    /** The error being recovered from */
    error: BuildError;
    /** Current retry attempt (for retry strategy) */
    retryAttempt?: number;
    /** Maximum retry attempts allowed */
    maxRetries?: number;
    /** Platform being built (for skip strategy) */
    platform?: Platform;
    /** Available platforms to continue with (for skip strategy) */
    remainingPlatforms?: Platform[];
    /** Cached build artifacts (for fallback strategy) */
    cachedArtifacts?: Record<string, unknown>;
    /** Default configuration (for fallback strategy) */
    defaultConfig?: Record<string, unknown>;
    /** Additional context data */
    metadata?: Record<string, unknown>;
}
/**
 * Recovery execution result
 */
export interface RecoveryExecutionResult {
    /** Whether recovery was successful */
    success: boolean;
    /** Strategy that was executed */
    strategy: RecoveryStrategyType;
    /** Message describing the outcome */
    message: string;
    /** Whether to continue with build */
    shouldContinue: boolean;
    /** Updated context after recovery */
    updatedContext?: Partial<RecoveryContext>;
    /** Any errors that occurred during recovery */
    errors?: BuildError[];
}
/**
 * Retry strategy implementation
 *
 * Attempts the operation again for transient errors like network issues,
 * file locks, or temporary resource unavailability.
 */
export declare class RetryStrategy {
    /**
     * Execute retry strategy
     */
    execute(context: RecoveryContext): Promise<RecoveryExecutionResult>;
    /**
     * Check if error is suitable for retry
     */
    canRetry(error: BuildError): boolean;
    /**
     * Calculate exponential backoff delay
     */
    private calculateBackoff;
    /**
     * Delay helper
     */
    private delay;
}
/**
 * Skip strategy implementation
 *
 * Skips the problematic platform and continues building other platforms.
 * Useful for platform-specific failures that shouldn't block the entire build.
 */
export declare class SkipStrategy {
    /**
     * Execute skip strategy
     */
    execute(context: RecoveryContext): RecoveryExecutionResult;
    /**
     * Check if error is suitable for skip
     */
    canSkip(error: BuildError): boolean;
}
/**
 * Fallback strategy implementation
 *
 * Uses cached build artifacts or default configuration when the primary
 * build fails. Allows the build to continue with degraded functionality.
 */
export declare class FallbackStrategy {
    /**
     * Execute fallback strategy
     */
    execute(context: RecoveryContext): RecoveryExecutionResult;
    /**
     * Check if error is suitable for fallback
     */
    canFallback(error: BuildError, context: RecoveryContext): boolean;
}
/**
 * Abort strategy implementation
 *
 * Stops the build immediately and requires manual intervention.
 * Used for critical errors that cannot be recovered automatically.
 */
export declare class AbortStrategy {
    /**
     * Execute abort strategy
     */
    execute(context: RecoveryContext): RecoveryExecutionResult;
    /**
     * Check if error requires abort
     */
    shouldAbort(error: BuildError): boolean;
}
/**
 * Recovery strategy coordinator
 *
 * Coordinates the execution of different recovery strategies based on
 * error type and context.
 */
export declare class RecoveryStrategyCoordinator {
    private retryStrategy;
    private skipStrategy;
    private fallbackStrategy;
    private abortStrategy;
    /**
     * Execute appropriate recovery strategy
     */
    executeRecovery(strategyType: RecoveryStrategyType, context: RecoveryContext): Promise<RecoveryExecutionResult>;
    /**
     * Determine best recovery strategy for an error
     */
    determineStrategy(error: BuildError, context: RecoveryContext): RecoveryStrategyType;
}
//# sourceMappingURL=RecoveryStrategy.d.ts.map