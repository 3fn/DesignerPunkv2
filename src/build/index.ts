/**
 * Build System Module Exports
 * 
 * Main entry point for the Cross-Platform Build System.
 * Exports orchestrator, types, and utilities for building
 * platform-specific packages.
 */

// Main orchestrator
export { BuildOrchestrator } from './BuildOrchestrator';

// Orchestration strategies
export {
  ParallelExecutor,
  SequentialExecutor,
  IncrementalBuilder,
} from './orchestration';

export type {
  ParallelExecutionOptions,
  ParallelExecutionResult,
  SequentialExecutionOptions,
  SequentialExecutionResult,
  SequentialProgress,
  IncrementalBuildOptions,
  IncrementalBuildResult,
  FileChange,
  BuildCacheEntry,
} from './orchestration';

// Type exports
export type {
  BuildOrchestrator as IBuildOrchestrator,
  BuildStatus,
  ValidationResult,
} from './types/BuildOrchestrator';

export type {
  BuildConfig,
  BuildMode,
  ValidationOptions,
  iOSBuildOptions,
  AndroidBuildOptions,
  WebBuildOptions,
} from './types/BuildConfig';

export { DEFAULT_BUILD_CONFIG } from './types/BuildConfig';

export type {
  BuildResult,
  BuildResultSummary,
  BuildError,
  ErrorCategory,
  ErrorSeverity,
} from './types/BuildResult';

export type {
  Platform,
  PlatformMetadata,
} from './types/Platform';

export { PLATFORM_METADATA } from './types/Platform';

// Workflow utilities
export {
  SourceMapGenerator,
} from './workflow';

export type {
  SourceMapOptions,
  PlatformSourceMapConfig,
  SourceMapResult,
} from './workflow';
