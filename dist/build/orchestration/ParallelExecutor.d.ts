/**
 * Parallel Build Executor
 *
 * Executes multiple platform builds simultaneously using Promise.allSettled
 * to ensure all builds complete regardless of individual failures.
 * Manages build process coordination and aggregates results.
 */
import { Platform } from '../types/Platform';
import { BuildResult } from '../types/BuildResult';
/**
 * Parallel execution options
 */
export interface ParallelExecutionOptions {
    /** Maximum number of concurrent builds (default: unlimited) */
    maxConcurrency?: number;
    /** Timeout for individual builds in milliseconds (default: 5 minutes) */
    buildTimeout?: number;
    /** Whether to continue on failure (default: true) */
    continueOnFailure?: boolean;
}
/**
 * Parallel execution result
 */
export interface ParallelExecutionResult {
    /** All build results (successful and failed) */
    results: BuildResult[];
    /** Total execution duration in milliseconds */
    totalDuration: number;
    /** Number of successful builds */
    successCount: number;
    /** Number of failed builds */
    failureCount: number;
    /** Whether all builds completed (vs timed out) */
    allCompleted: boolean;
}
/**
 * Parallel build executor
 *
 * Coordinates simultaneous execution of multiple platform builds,
 * handling failures gracefully and aggregating results.
 */
export declare class ParallelExecutor {
    private options;
    private cancelled;
    constructor(options?: ParallelExecutionOptions);
    /**
     * Execute builds for multiple platforms in parallel
     *
     * @param platforms - Platforms to build
     * @param buildFn - Function to build a single platform
     * @returns Parallel execution result with all build outcomes
     */
    execute(platforms: Platform[], buildFn: (platform: Platform) => Promise<BuildResult>): Promise<ParallelExecutionResult>;
    /**
     * Cancel ongoing parallel execution
     */
    cancel(): void;
    /**
     * Execute builds with concurrency control
     */
    private executeWithConcurrency;
    /**
     * Execute all builds in parallel without concurrency limit
     */
    private executeAllParallel;
    /**
     * Execute builds in batches with concurrency limit
     */
    private executeBatched;
    /**
     * Execute a single build with timeout and cancellation support
     */
    private executeSingleBuild;
    /**
     * Create batches of platforms for concurrency control
     */
    private createBatches;
    /**
     * Create error result for failed build
     */
    private createErrorResult;
    /**
     * Create cancelled result for cancelled build
     */
    private createCancelledResult;
}
//# sourceMappingURL=ParallelExecutor.d.ts.map