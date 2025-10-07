/**
 * Build Orchestrator Interface
 * 
 * Defines the main interface for coordinating platform-specific builds.
 * Manages build configuration, execution, validation, and status tracking.
 */

import { BuildConfig } from './BuildConfig';
import { BuildResult, BuildResultSummary } from './BuildResult';
import { Platform } from './Platform';

/**
 * Validation result for build configuration
 */
export interface ValidationResult {
  /** Whether validation passed */
  valid: boolean;
  
  /** Validation errors */
  errors: string[];
  
  /** Validation warnings */
  warnings: string[];
  
  /** Additional validation context */
  context?: Record<string, unknown>;
}

/**
 * Build status tracking
 */
export interface BuildStatus {
  /** Current build phase */
  phase: 'idle' | 'configuring' | 'building' | 'validating' | 'complete' | 'failed';
  
  /** Platforms currently being built */
  activePlatforms: Platform[];
  
  /** Platforms completed */
  completedPlatforms: Platform[];
  
  /** Platforms failed */
  failedPlatforms: Platform[];
  
  /** Overall progress percentage (0-100) */
  progress: number;
  
  /** Current operation description */
  currentOperation?: string;
  
  /** Build start timestamp */
  startTime?: Date;
  
  /** Build end timestamp */
  endTime?: Date;
}

/**
 * Build orchestrator interface
 * 
 * Coordinates the entire build process across multiple platforms,
 * managing configuration, execution, and validation.
 */
export interface BuildOrchestrator {
  /**
   * Configure the build system with specified options
   * 
   * @param config - Build configuration
   * @throws Error if configuration is invalid
   */
  configure(config: BuildConfig): void;
  
  /**
   * Execute builds for specified platforms
   * 
   * @param platforms - Target platforms to build
   * @returns Promise resolving to build results for each platform
   */
  build(platforms: Platform[]): Promise<BuildResult[]>;
  
  /**
   * Validate build configuration
   * 
   * @param config - Build configuration to validate
   * @returns Validation result with errors and warnings
   */
  validateConfig(config: BuildConfig): ValidationResult;
  
  /**
   * Get current build status and progress
   * 
   * @returns Current build status
   */
  getStatus(): BuildStatus;
  
  /**
   * Get aggregated build results summary
   * 
   * @returns Summary of all build results
   */
  getSummary(): BuildResultSummary | null;
  
  /**
   * Cancel ongoing build process
   * 
   * @returns Promise resolving when cancellation is complete
   */
  cancel(): Promise<void>;
  
  /**
   * Reset orchestrator state
   */
  reset(): void;
}
