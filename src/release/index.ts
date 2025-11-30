/**
 * Release Management System
 * 
 * Main exports for the release management system.
 * Provides orchestration, automation, publishing, and coordination capabilities.
 */

// Main orchestrator
export { ReleaseManager, ReleaseManagerConfig } from './ReleaseManager';

// Orchestration components
export * from './orchestration';

// Integration components
export { CLIBridge, CLIExecutionOptions, CLIExecutionResult } from './integration/CLIBridge';
export { AnalysisResultParser } from './integration/AnalysisResultParser';

// Automation components
export { PackageUpdater } from './automation/PackageUpdater';
export { ChangelogManager } from './automation/ChangelogManager';
export { GitOperations } from './automation/GitOperations';

// Publishing components
export { GitHubPublisher } from './publishing/GitHubPublisher';
export { NpmPublisher } from './publishing/NpmPublisher';

// Coordination components
export { PackageCoordinator } from './coordination/PackageCoordinator';
export { DependencyManager } from './coordination/DependencyManager';
export { PublishingPlanner } from './coordination/PublishingPlanner';

// AI Collaboration
export * from './ai';

// Types - Export from ReleaseTypes (main type definitions)
export * from './types/ReleaseTypes';

// Coordination types - These are coordination-specific and don't conflict
export type {
  PackageVersion as CoordPackageVersion,
  PackageUpdate as CoordPackageUpdate,
  DependencyUpdate as CoordDependencyUpdate,
  VersionConflict,
  CoordinationStrategy,
  CoordinationPlan,
  CompatibilityReport,
  CompatibilityIssue,
  CompatibilityWarning,
  PublishingPlan as CoordPublishingPlan
} from './coordination/types';
