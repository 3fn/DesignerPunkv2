/**
 * Parallel Build Executor
 * 
 * Executes multiple platform builds simultaneously using Promise.allSettled
 * to ensure all builds complete regardless of individual failures.
 * Manages build process coordination and aggregates results.
 */

import { Platform } from '../types/Platform';
import { BuildResult, BuildError } from '../types/BuildResult';
import { PlatformBuilder } from '../platforms/PlatformBuilder';

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
export class ParallelExecutor {
  private options: Required<ParallelExecutionOptions>;
  private cancelled: boolean;

  constructor(options: ParallelExecutionOptions = {}) {
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
  async execute(
    platforms: Platform[],
    buildFn: (platform: Platform) => Promise<BuildResult>
  ): Promise<ParallelExecutionResult> {
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
  cancel(): void {
    this.cancelled = true;
  }

  /**
   * Execute builds with concurrency control
   */
  private async executeWithConcurrency(
    platforms: Platform[],
    buildFn: (platform: Platform) => Promise<BuildResult>
  ): Promise<BuildResult[]> {
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
  private async executeAllParallel(
    platforms: Platform[],
    buildFn: (platform: Platform) => Promise<BuildResult>
  ): Promise<BuildResult[]> {
    // Create build promises with timeout and cancellation support
    const buildPromises = platforms.map(platform =>
      this.executeSingleBuild(platform, buildFn)
    );

    // Wait for all builds to complete (or fail)
    const results = await Promise.allSettled(buildPromises);

    // Convert settled results to BuildResult array
    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        // Handle rejected promise
        return this.createErrorResult(
          platforms[index],
          result.reason?.message || 'Unknown build error'
        );
      }
    });
  }

  /**
   * Execute builds in batches with concurrency limit
   */
  private async executeBatched(
    platforms: Platform[],
    buildFn: (platform: Platform) => Promise<BuildResult>
  ): Promise<BuildResult[]> {
    const results: BuildResult[] = [];
    const batches = this.createBatches(platforms, this.options.maxConcurrency);

    for (const batch of batches) {
      if (this.cancelled) {
        // Add cancelled results for remaining platforms
        const remainingPlatforms = platforms.slice(results.length);
        results.push(...remainingPlatforms.map(p => 
          this.createCancelledResult(p)
        ));
        break;
      }

      // Execute batch in parallel
      const batchPromises = batch.map(platform =>
        this.executeSingleBuild(platform, buildFn)
      );

      const batchResults = await Promise.allSettled(batchPromises);

      // Convert settled results to BuildResult array
      const batchBuildResults = batchResults.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          return this.createErrorResult(
            batch[index],
            result.reason?.message || 'Unknown build error'
          );
        }
      });

      results.push(...batchBuildResults);

      // Check if we should continue on failure
      if (!this.options.continueOnFailure) {
        const hasFailure = batchBuildResults.some(r => !r.success);
        if (hasFailure) {
          // Add cancelled results for remaining platforms
          const remainingPlatforms = platforms.slice(results.length);
          results.push(...remainingPlatforms.map(p => 
            this.createCancelledResult(p)
          ));
          break;
        }
      }
    }

    return results;
  }

  /**
   * Execute a single build with timeout and cancellation support
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
   * Create batches of platforms for concurrency control
   */
  private createBatches(platforms: Platform[], batchSize: number): Platform[][] {
    const batches: Platform[][] = [];
    
    for (let i = 0; i < platforms.length; i += batchSize) {
      batches.push(platforms.slice(i, i + batchSize));
    }
    
    return batches;
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
