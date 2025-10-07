/**
 * Sequential Build Executor
 * 
 * Executes platform builds one at a time in sequence, providing clear
 * progress feedback and supporting both fail-fast and continue-on-error modes.
 * Aggregates results from sequential builds.
 */

import { Platform } from '../types/Platform';
import { BuildResult, BuildError } from '../types/BuildResult';

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
export class SequentialExecutor {
    private options: Required<Omit<SequentialExecutionOptions, 'onProgress'>> & {
        onProgress?: (progress: SequentialProgress) => void;
    };
    private cancelled: boolean;

    constructor(options: SequentialExecutionOptions = {}) {
        this.options = {
            stopOnFailure: options.stopOnFailure ?? false,
            buildTimeout: options.buildTimeout ?? 5 * 60 * 1000, // 5 minutes
            onProgress: options.onProgress,
        };
        this.cancelled = false;
    }

    /**
     * Execute builds for multiple platforms sequentially
     * 
     * @param platforms - Platforms to build in order
     * @param buildFn - Function to build a single platform
     * @returns Sequential execution result with all build outcomes
     */
    async execute(
        platforms: Platform[],
        buildFn: (platform: Platform) => Promise<BuildResult>
    ): Promise<SequentialExecutionResult> {
        const startTime = Date.now();
        this.cancelled = false;

        // Validate inputs
        if (platforms.length === 0) {
            throw new Error('No platforms specified for sequential execution');
        }

        const results: BuildResult[] = [];
        const skippedPlatforms: Platform[] = [];
        let stoppedOnFailure = false;

        // Execute builds one at a time
        for (let i = 0; i < platforms.length; i++) {
            const platform = platforms[i];

            // Check for cancellation
            if (this.cancelled) {
                // Mark remaining platforms as skipped
                skippedPlatforms.push(...platforms.slice(i));
                break;
            }

            // Report progress
            this.reportProgress({
                currentPlatform: platform,
                currentIndex: i,
                totalPlatforms: platforms.length,
                percentComplete: Math.round((i / platforms.length) * 100),
                successCount: results.filter(r => r.success).length,
                failureCount: results.filter(r => !r.success).length,
                elapsedTime: Date.now() - startTime,
            });

            // Execute single build
            const result = await this.executeSingleBuild(platform, buildFn);
            results.push(result);

            // Check if we should stop on failure
            if (!result.success && this.options.stopOnFailure) {
                stoppedOnFailure = true;
                // Mark remaining platforms as skipped
                skippedPlatforms.push(...platforms.slice(i + 1));
                break;
            }
        }

        // Report final progress
        this.reportProgress({
            currentPlatform: platforms[platforms.length - 1],
            currentIndex: platforms.length,
            totalPlatforms: platforms.length,
            percentComplete: 100,
            successCount: results.filter(r => r.success).length,
            failureCount: results.filter(r => !r.success).length,
            elapsedTime: Date.now() - startTime,
        });

        // Calculate metrics
        const totalDuration = Date.now() - startTime;
        const successCount = results.filter(r => r.success).length;
        const failureCount = results.filter(r => !r.success).length;

        return {
            results,
            totalDuration,
            successCount,
            failureCount,
            stoppedOnFailure,
            skippedPlatforms,
        };
    }

    /**
     * Cancel ongoing sequential execution
     */
    cancel(): void {
        this.cancelled = true;
    }

    /**
     * Execute a single build with timeout support
     */
    private async executeSingleBuild(
        platform: Platform,
        buildFn: (platform: Platform) => Promise<BuildResult>
    ): Promise<BuildResult> {
        let timeoutId: NodeJS.Timeout | null = null;
        let checkIntervalId: NodeJS.Timeout | null = null;

        try {
            // Create timeout promise
            const timeoutPromise = new Promise<BuildResult>((_, reject) => {
                timeoutId = setTimeout(() => {
                    reject(new Error(`Build timeout after ${this.options.buildTimeout}ms`));
                }, this.options.buildTimeout);
            });

            // Create cancellation check promise
            const cancellationPromise = new Promise<BuildResult>((resolve) => {
                checkIntervalId = setInterval(() => {
                    if (this.cancelled) {
                        resolve(this.createCancelledResult(platform));
                    }
                }, 100);
            });

            // Race between build, timeout, and cancellation
            const result = await Promise.race([
                buildFn(platform),
                timeoutPromise,
                cancellationPromise,
            ]);

            return result;
        } catch (error) {
            // Handle timeout or other errors
            return this.createErrorResult(
                platform,
                error instanceof Error ? error.message : 'Unknown build error'
            );
        } finally {
            // Clean up timers
            if (timeoutId) clearTimeout(timeoutId);
            if (checkIntervalId) clearInterval(checkIntervalId);
        }
    }

    /**
     * Report progress to callback if provided
     */
    private reportProgress(progress: SequentialProgress): void {
        if (this.options.onProgress) {
            this.options.onProgress(progress);
        }
    }

    /**
     * Create error result for failed build
     */
    private createErrorResult(platform: Platform, errorMessage: string): BuildResult {
        const error: BuildError = {
            code: 'BUILD_FAILED',
            message: errorMessage,
            severity: 'error',
            category: 'build',
            platform,
            context: {},
            suggestions: [
                'Check build logs for detailed error information',
                'Verify platform-specific configuration is correct',
                'Ensure all dependencies are installed',
            ],
            documentation: [],
        };

        return {
            platform,
            success: false,
            packagePath: '',
            duration: 0,
            warnings: [],
            errors: [error],
            metadata: {
                timestamp: new Date().toISOString(),
            },
        };
    }

    /**
     * Create cancelled result for cancelled build
     */
    private createCancelledResult(platform: Platform): BuildResult {
        const error: BuildError = {
            code: 'BUILD_CANCELLED',
            message: 'Build was cancelled before completion',
            severity: 'error',
            category: 'build',
            platform,
            context: {},
            suggestions: [
                'Restart the build process if cancellation was unintentional',
            ],
            documentation: [],
        };

        return {
            platform,
            success: false,
            packagePath: '',
            duration: 0,
            warnings: [],
            errors: [error],
            metadata: {
                timestamp: new Date().toISOString(),
            },
        };
    }
}
