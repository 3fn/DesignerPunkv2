"use strict";
/**
 * Sequential Build Executor
 *
 * Executes platform builds one at a time in sequence, providing clear
 * progress feedback and supporting both fail-fast and continue-on-error modes.
 * Aggregates results from sequential builds.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SequentialExecutor = void 0;
/**
 * Sequential build executor
 *
 * Coordinates sequential execution of platform builds one at a time,
 * providing clear progress feedback and supporting fail-fast mode.
 */
class SequentialExecutor {
    constructor(options = {}) {
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
    async execute(platforms, buildFn) {
        const startTime = Date.now();
        this.cancelled = false;
        // Validate inputs
        if (platforms.length === 0) {
            throw new Error('No platforms specified for sequential execution');
        }
        const results = [];
        const skippedPlatforms = [];
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
    cancel() {
        this.cancelled = true;
    }
    /**
     * Execute a single build with timeout support
     */
    async executeSingleBuild(platform, buildFn) {
        let timeoutId = null;
        let checkIntervalId = null;
        try {
            // Create timeout promise
            const timeoutPromise = new Promise((_, reject) => {
                timeoutId = setTimeout(() => {
                    reject(new Error(`Build timeout after ${this.options.buildTimeout}ms`));
                }, this.options.buildTimeout);
            });
            // Create cancellation check promise
            const cancellationPromise = new Promise((resolve) => {
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
        }
        catch (error) {
            // Handle timeout or other errors
            return this.createErrorResult(platform, error instanceof Error ? error.message : 'Unknown build error');
        }
        finally {
            // Clean up timers
            if (timeoutId)
                clearTimeout(timeoutId);
            if (checkIntervalId)
                clearInterval(checkIntervalId);
        }
    }
    /**
     * Report progress to callback if provided
     */
    reportProgress(progress) {
        if (this.options.onProgress) {
            this.options.onProgress(progress);
        }
    }
    /**
     * Create error result for failed build
     */
    createErrorResult(platform, errorMessage) {
        const error = {
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
    createCancelledResult(platform) {
        const error = {
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
exports.SequentialExecutor = SequentialExecutor;
//# sourceMappingURL=SequentialExecutor.js.map