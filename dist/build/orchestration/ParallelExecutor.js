"use strict";
/**
 * Parallel Build Executor
 *
 * Executes multiple platform builds simultaneously using Promise.allSettled
 * to ensure all builds complete regardless of individual failures.
 * Manages build process coordination and aggregates results.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParallelExecutor = void 0;
/**
 * Parallel build executor
 *
 * Coordinates simultaneous execution of multiple platform builds,
 * handling failures gracefully and aggregating results.
 */
class ParallelExecutor {
    constructor(options = {}) {
        this.options = {
            maxConcurrency: options.maxConcurrency ?? Infinity,
            buildTimeout: options.buildTimeout ?? 5 * 60 * 1000, // 5 minutes
            continueOnFailure: options.continueOnFailure ?? true,
        };
        this.cancelled = false;
    }
    /**
     * Execute builds for multiple platforms in parallel
     *
     * @param platforms - Platforms to build
     * @param buildFn - Function to build a single platform
     * @returns Parallel execution result with all build outcomes
     */
    async execute(platforms, buildFn) {
        const startTime = Date.now();
        this.cancelled = false;
        // Validate inputs
        if (platforms.length === 0) {
            throw new Error('No platforms specified for parallel execution');
        }
        // Execute builds with concurrency control
        const results = await this.executeWithConcurrency(platforms, buildFn);
        // Calculate metrics
        // Total duration is wall-clock time (parallel execution time)
        const totalDuration = Date.now() - startTime;
        const successCount = results.filter(r => r.success).length;
        const failureCount = results.filter(r => !r.success).length;
        const allCompleted = !this.cancelled;
        return {
            results,
            totalDuration,
            successCount,
            failureCount,
            allCompleted,
        };
    }
    /**
     * Cancel ongoing parallel execution
     */
    cancel() {
        this.cancelled = true;
    }
    /**
     * Execute builds with concurrency control
     */
    async executeWithConcurrency(platforms, buildFn) {
        // If no concurrency limit, execute all at once
        if (this.options.maxConcurrency === Infinity) {
            return this.executeAllParallel(platforms, buildFn);
        }
        // Execute with concurrency limit
        return this.executeBatched(platforms, buildFn);
    }
    /**
     * Execute all builds in parallel without concurrency limit
     */
    async executeAllParallel(platforms, buildFn) {
        // Create build promises with timeout and cancellation support
        const buildPromises = platforms.map(platform => this.executeSingleBuild(platform, buildFn));
        // Wait for all builds to complete (or fail)
        const results = await Promise.allSettled(buildPromises);
        // Convert settled results to BuildResult array
        return results.map((result, index) => {
            if (result.status === 'fulfilled') {
                return result.value;
            }
            else {
                // Handle rejected promise
                return this.createErrorResult(platforms[index], result.reason?.message || 'Unknown build error');
            }
        });
    }
    /**
     * Execute builds in batches with concurrency limit
     */
    async executeBatched(platforms, buildFn) {
        const results = [];
        const batches = this.createBatches(platforms, this.options.maxConcurrency);
        for (const batch of batches) {
            if (this.cancelled) {
                // Add cancelled results for remaining platforms
                const remainingPlatforms = platforms.slice(results.length);
                results.push(...remainingPlatforms.map(p => this.createCancelledResult(p)));
                break;
            }
            // Execute batch in parallel
            const batchPromises = batch.map(platform => this.executeSingleBuild(platform, buildFn));
            const batchResults = await Promise.allSettled(batchPromises);
            // Convert settled results to BuildResult array
            const batchBuildResults = batchResults.map((result, index) => {
                if (result.status === 'fulfilled') {
                    return result.value;
                }
                else {
                    return this.createErrorResult(batch[index], result.reason?.message || 'Unknown build error');
                }
            });
            results.push(...batchBuildResults);
            // Check if we should continue on failure
            if (!this.options.continueOnFailure) {
                const hasFailure = batchBuildResults.some(r => !r.success);
                if (hasFailure) {
                    // Add cancelled results for remaining platforms
                    const remainingPlatforms = platforms.slice(results.length);
                    results.push(...remainingPlatforms.map(p => this.createCancelledResult(p)));
                    break;
                }
            }
        }
        return results;
    }
    /**
     * Execute a single build with timeout and cancellation support
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
     * Create batches of platforms for concurrency control
     */
    createBatches(platforms, batchSize) {
        const batches = [];
        for (let i = 0; i < platforms.length; i += batchSize) {
            batches.push(platforms.slice(i, i + batchSize));
        }
        return batches;
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
exports.ParallelExecutor = ParallelExecutor;
//# sourceMappingURL=ParallelExecutor.js.map