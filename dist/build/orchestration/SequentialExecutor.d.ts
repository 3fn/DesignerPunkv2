/**
 * Sequential Build Executor
 *
 * Executes platform builds one at a time in sequence, providing clear
 * progress feedback and supporting both fail-fast and continue-on-error modes.
 * Aggregates results from sequential builds.
 */
import { Platform } from '../types/Platform';
import { BuildResult } from '../types/BuildResult';
/**
 * Sequential execution options
 */
export interface SequentialExecutionOptions {
    /** Whether to stop on first failure (default: false - continue through all) */
    stopOnFailure?: boolean;
    /** Timeout for individual builds in milliseconds (default: 5 minutes) */
    buildTimeout?: number;
    /** Progress callback for real-time feedback */
    onProgress?: (progress: SequentialProgress) => void;
}
/**
 * Sequential progress information
 */
export interface SequentialProgress {
    /** Current platform being built */
    currentPlatform: Platform;
    /** Current build index (0-based) */
    currentIndex: number;
    /** Total number of platforms */
    totalPlatforms: number;
    /** Percentage complete (0-100) */
    percentComplete: number;
    /** Number of successful builds so far */
    successCount: number;
    /** Number of failed builds so far */
    failureCount: number;
    /** Elapsed time in milliseconds */
    elapsedTime: number;
}
/**
 * Sequential execution result
 */
export interface SequentialExecutionResult {
    /** All build results (successful and failed) */
    results: BuildResult[];
    /** Total execution duration in milliseconds */
    totalDuration: number;
    /** Number of successful builds */
    successCount: number;
    /** Number of failed builds */
    failureCount: number;
    /** Whether execution was stopped early due to failure */
    stoppedOnFailure: boolean;
    /** Platforms that were skipped (if stopped on failure) */
    skippedPlatforms: Platform[];
}
/**
 * Sequential build executor
 *
 * Coordinates sequential execution of platform builds one at a time,
 * providing clear progress feedback and supporting fail-fast mode.
 */
export declare class SequentialExecutor {
    private options;
    private cancelled;
    constructor(options?: SequentialExecutionOptions);
    /**
     * Execute builds for multiple platforms sequentially
     *
     * @param platforms - Platforms to build in order
     * @param buildFn - Function to build a single platform
     * @returns Sequential execution result with all build outcomes
     */
    execute(platforms: Platform[], buildFn: (platform: Platform) => Promise<BuildResult>): Promise<SequentialExecutionResult>;
    /**
     * Cancel ongoing sequential execution
     */
    cancel(): void;
    /**
     * Execute a single build with timeout support
     */
    private executeSingleBuild;
    /**
     * Report progress to callback if provided
     */
    private reportProgress;
    /**
     * Create error result for failed build
     */
    private createErrorResult;
    /**
     * Create cancelled result for cancelled build
     */
    private createCancelledResult;
}
//# sourceMappingURL=SequentialExecutor.d.ts.map