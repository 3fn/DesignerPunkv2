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

// Types
export * from './types/ReleaseTypes';
export * from './coordination/types';
