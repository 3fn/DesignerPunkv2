/**
 * Package Coordination Module
 * 
 * Exports package coordination functionality for multi-package version management.
 */

export { PackageCoordinator } from './PackageCoordinator';
export { DependencyManager } from './DependencyManager';
export { PublishingPlanner } from './PublishingPlanner';
export type { DependencyGraph, DependencyAnalysis, ConflictResolution } from './DependencyManager';
export type {
  PublishingStage,
  PackagePublishResult,
  PublishingExecutionResult,
  RollbackResult,
  RetryConfig,
  PublishingOptions
} from './PublishingPlanner';
export * from './types';
