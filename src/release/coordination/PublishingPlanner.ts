/**
 * Publishing Planner
 * 
 * Manages publishing order optimization, staged publishing, and rollback capabilities
 * for multi-package releases.
 * 
 * Requirements:
 * - 4.5: Publishing order coordination to prevent dependency issues
 * - 4.5: Staged publishing with rollback capabilities
 * - 4.5: Publishing failure recovery and retry logic
 */

import { DependencyManager, DependencyAnalysis } from './DependencyManager';
import {
  PackageVersion,
  PackageUpdate,
  PublishingPlan,
  VersionConflict
} from './types';

/**
 * Publishing stage information
 */
export interface PublishingStage {
  /** Stage number (0-indexed) */
  stage: number;
  /** Packages to publish in this stage */
  packages: string[];
  /** Dependencies that must be published before this stage */
  dependencies: string[];
  /** Estimated duration in seconds */
  estimatedDuration: number;
}

/**
 * Publishing result for a single package
 */
export interface PackagePublishResult {
  package: string;
  success: boolean;
  error?: string;
  duration: number;
  timestamp: Date;
}

/**
 * Publishing execution result
 */
export interface PublishingExecutionResult {
  success: boolean;
  completedStages: number;
  totalStages: number;
  packageResults: PackagePublishResult[];
  failedPackages: string[];
  duration: number;
}

/**
 * Rollback result
 */
export interface RollbackResult {
  success: boolean;
  rolledBackPackages: string[];
  failedRollbacks: string[];
  errors: string[];
}

/**
 * Retry configuration
 */
export interface RetryConfig {
  /** Maximum number of retry attempts */
  maxAttempts: number;
  /** Initial delay in milliseconds */
  initialDelay: number;
  /** Delay multiplier for exponential backoff */
  backoffMultiplier: number;
  /** Maximum delay in milliseconds */
  maxDelay: number;
}

/**
 * Publishing options
 */
export interface PublishingOptions {
  /** Dry run mode (don't actually publish) */
  dryRun?: boolean;
  /** Retry configuration */
  retry?: RetryConfig;
  /** Timeout per package in milliseconds */
  timeout?: number;
  /** Parallel publishing within stages */
  parallel?: boolean;
}

/**
 * Default retry configuration
 */
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  initialDelay: 1000,
  backoffMultiplier: 2,
  maxDelay: 10000
};

export class PublishingPlanner {
  private dependencyManager: DependencyManager;

  constructor(dependencyManager?: DependencyManager) {
    this.dependencyManager = dependencyManager || new DependencyManager();
  }

  /**
   * Generate optimized publishing plan
   * 
   * Requirements: 4.5
   */
  generatePublishingPlan(
    packages: PackageVersion[],
    updates: PackageUpdate[]
  ): PublishingPlan {
    // Analyze dependency graph
    const analysis = this.dependencyManager.analyzeDependencyGraph(packages);

    // Filter to only packages being updated
    const updatedPackageNames = new Set(updates.map(u => u.name));
    const filteredLevels = analysis.levels.map(level =>
      level.filter(pkg => updatedPackageNames.has(pkg))
    ).filter(level => level.length > 0);

    // Calculate estimated duration
    const estimatedDuration = this.calculateEstimatedDuration(filteredLevels);

    return {
      order: filteredLevels,
      totalPackages: updates.length,
      estimatedDuration
    };
  }

  /**
   * Generate detailed publishing stages
   * 
   * Requirements: 4.5
   */
  generatePublishingStages(
    packages: PackageVersion[],
    updates: PackageUpdate[]
  ): PublishingStage[] {
    const plan = this.generatePublishingPlan(packages, updates);
    const stages: PublishingStage[] = [];

    for (let i = 0; i < plan.order.length; i++) {
      const stagePackages = plan.order[i];
      const dependencies = this.getStageDependencies(plan.order, i);

      stages.push({
        stage: i,
        packages: stagePackages,
        dependencies,
        estimatedDuration: this.estimateStagesDuration(stagePackages.length)
      });
    }

    return stages;
  }

  /**
   * Execute staged publishing with rollback capabilities
   * 
   * Requirements: 4.5
   */
  async executeStagedPublishing(
    stages: PublishingStage[],
    publishFn: (packageName: string) => Promise<void>,
    options: PublishingOptions = {}
  ): Promise<PublishingExecutionResult> {
    const startTime = Date.now();
    const packageResults: PackagePublishResult[] = [];
    const failedPackages: string[] = [];
    let completedStages = 0;

    const retryConfig = options.retry || DEFAULT_RETRY_CONFIG;

    try {
      for (const stage of stages) {
        console.log(`Publishing stage ${stage.stage + 1}/${stages.length}: ${stage.packages.join(', ')}`);

        // Publish packages in this stage
        const stageResults = await this.publishStage(
          stage,
          publishFn,
          retryConfig,
          options
        );

        packageResults.push(...stageResults);

        // Check for failures
        const stageFailed = stageResults.some(r => !r.success);
        if (stageFailed) {
          const failed = stageResults.filter(r => !r.success).map(r => r.package);
          failedPackages.push(...failed);

          console.error(`Stage ${stage.stage + 1} failed. Failed packages: ${failed.join(', ')}`);

          // Stop execution and prepare for rollback
          break;
        }

        completedStages++;
      }

      const duration = Date.now() - startTime;
      const success = completedStages === stages.length;

      return {
        success,
        completedStages,
        totalStages: stages.length,
        packageResults,
        failedPackages,
        duration
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        success: false,
        completedStages,
        totalStages: stages.length,
        packageResults,
        failedPackages,
        duration
      };
    }
  }

  /**
   * Rollback published packages
   * 
   * Requirements: 4.5
   */
  async rollbackPublishing(
    publishedPackages: string[],
    rollbackFn: (packageName: string) => Promise<void>
  ): Promise<RollbackResult> {
    const rolledBackPackages: string[] = [];
    const failedRollbacks: string[] = [];
    const errors: string[] = [];

    // Rollback in reverse order
    const reversedPackages = [...publishedPackages].reverse();

    for (const pkg of reversedPackages) {
      try {
        console.log(`Rolling back ${pkg}...`);
        await rollbackFn(pkg);
        rolledBackPackages.push(pkg);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`Failed to rollback ${pkg}: ${errorMessage}`);
        failedRollbacks.push(pkg);
        errors.push(`${pkg}: ${errorMessage}`);
      }
    }

    return {
      success: failedRollbacks.length === 0,
      rolledBackPackages,
      failedRollbacks,
      errors
    };
  }

  /**
   * Retry failed package publishing
   * 
   * Requirements: 4.5
   */
  async retryPackagePublishing(
    packageName: string,
    publishFn: (packageName: string) => Promise<void>,
    config: RetryConfig = DEFAULT_RETRY_CONFIG
  ): Promise<PackagePublishResult> {
    let lastError: Error | undefined;
    let delay = config.initialDelay;

    for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
      try {
        const startTime = Date.now();
        await publishFn(packageName);
        const duration = Date.now() - startTime;

        return {
          package: packageName,
          success: true,
          duration,
          timestamp: new Date()
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn(`Attempt ${attempt}/${config.maxAttempts} failed for ${packageName}: ${lastError.message}`);

        if (attempt < config.maxAttempts) {
          console.log(`Retrying in ${delay}ms...`);
          await this.sleep(delay);
          delay = Math.min(delay * config.backoffMultiplier, config.maxDelay);
        }
      }
    }

    return {
      package: packageName,
      success: false,
      error: lastError?.message || 'Unknown error',
      duration: 0,
      timestamp: new Date()
    };
  }

  /**
   * Validate publishing order
   * 
   * Requirements: 4.5
   */
  validatePublishingOrder(
    packages: PackageVersion[],
    publishingOrder: string[]
  ): VersionConflict[] {
    const conflicts: VersionConflict[] = [];
    const published = new Set<string>();

    for (const packageName of publishingOrder) {
      const pkg = packages.find(p => p.name === packageName);
      if (!pkg) {
        conflicts.push({
          package: packageName,
          conflictType: 'missing',
          description: `Package ${packageName} not found in package list`,
          affectedPackages: [packageName],
          suggestedResolution: 'Remove from publishing order or add to package list'
        });
        continue;
      }

      // Check if all dependencies have been published
      const deps = this.getPackageDependencies(pkg);
      const unpublishedDeps = deps.filter(dep => !published.has(dep));

      if (unpublishedDeps.length > 0) {
        conflicts.push({
          package: packageName,
          conflictType: 'incompatible',
          description: `${packageName} depends on unpublished packages: ${unpublishedDeps.join(', ')}`,
          affectedPackages: [packageName, ...unpublishedDeps],
          suggestedResolution: `Publish ${unpublishedDeps.join(', ')} before ${packageName}`
        });
      }

      published.add(packageName);
    }

    return conflicts;
  }

  /**
   * Publish a single stage
   */
  private async publishStage(
    stage: PublishingStage,
    publishFn: (packageName: string) => Promise<void>,
    retryConfig: RetryConfig,
    options: PublishingOptions
  ): Promise<PackagePublishResult[]> {
    if (options.parallel) {
      // Publish packages in parallel
      const promises = stage.packages.map(pkg =>
        this.retryPackagePublishing(pkg, publishFn, retryConfig)
      );
      return Promise.all(promises);
    } else {
      // Publish packages sequentially
      const results: PackagePublishResult[] = [];
      for (const pkg of stage.packages) {
        const result = await this.retryPackagePublishing(pkg, publishFn, retryConfig);
        results.push(result);

        // Stop if this package failed
        if (!result.success) {
          break;
        }
      }
      return results;
    }
  }

  /**
   * Get dependencies for a stage
   */
  private getStageDependencies(order: string[][], stageIndex: number): string[] {
    const dependencies: string[] = [];

    for (let i = 0; i < stageIndex; i++) {
      dependencies.push(...order[i]);
    }

    return dependencies;
  }

  /**
   * Get package dependencies
   */
  private getPackageDependencies(pkg: PackageVersion): string[] {
    const deps: string[] = [];

    if (pkg.dependencies) {
      deps.push(...Object.keys(pkg.dependencies));
    }
    if (pkg.peerDependencies) {
      deps.push(...Object.keys(pkg.peerDependencies));
    }

    return deps;
  }

  /**
   * Calculate estimated duration for all stages
   */
  private calculateEstimatedDuration(levels: string[][]): number {
    // Estimate 30 seconds per package, with stages running sequentially
    return levels.reduce((total, level) => total + this.estimateStagesDuration(level.length), 0);
  }

  /**
   * Estimate duration for a single stage
   */
  private estimateStagesDuration(packageCount: number): number {
    // Estimate 30 seconds per package
    return packageCount * 30;
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
