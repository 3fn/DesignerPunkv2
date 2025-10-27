/**
 * Build System Type Definitions
 *
 * Core TypeScript interfaces and types for the Cross-Platform Build System.
 * Provides type safety and clear contracts for build orchestration,
 * configuration, and result reporting.
 */
export type { Platform, PlatformMetadata } from './Platform';
export { PLATFORM_METADATA } from './Platform';
export type { BuildMode, BuildConfig, ValidationOptions, iOSBuildOptions, AndroidBuildOptions, WebBuildOptions, } from './BuildConfig';
export { DEFAULT_BUILD_CONFIG } from './BuildConfig';
export type { BuildResult, BuildResultSummary, BuildError, BuildStatus as BuildResultStatus, ErrorCategory, ErrorSeverity, } from './BuildResult';
export type { BuildOrchestrator, BuildStatus, ValidationResult, } from './BuildOrchestrator';
//# sourceMappingURL=index.d.ts.map