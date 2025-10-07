/**
 * Build System Type Definitions
 * 
 * Core TypeScript interfaces and types for the Cross-Platform Build System.
 * Provides type safety and clear contracts for build orchestration,
 * configuration, and result reporting.
 */

// Platform types
export type { Platform, PlatformMetadata } from './Platform';
export { PLATFORM_METADATA } from './Platform';

// Build configuration types
export type {
  BuildMode,
  BuildConfig,
  ValidationOptions,
  iOSBuildOptions,
  AndroidBuildOptions,
  WebBuildOptions,
} from './BuildConfig';
export { DEFAULT_BUILD_CONFIG } from './BuildConfig';

// Build result types
export type {
  BuildResult,
  BuildResultSummary,
  BuildError,
  BuildStatus as BuildResultStatus,
  ErrorCategory,
  ErrorSeverity,
} from './BuildResult';

// Build orchestrator types
export type {
  BuildOrchestrator,
  BuildStatus,
  ValidationResult,
} from './BuildOrchestrator';
