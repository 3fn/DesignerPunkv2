/**
 * Integration Module - Barrel Export
 * 
 * Exports all integration coordinators that orchestrate interactions between
 * registries, validators, and translation providers in the token system.
 */

export { RegistryCoordinator } from './RegistryCoordinator';
export type { RegistryCoordinationStats } from './RegistryCoordinator';

export { ValidationCoordinator, validateFamilyConformance } from './ValidationCoordinator';
export type { 
  ValidationCoordinatorConfig,
  ValidationOptions,
  ComprehensiveValidationReport,
  ComponentTokenValidationResult,
  FamilyConformanceResult
} from './ValidationCoordinator';

export { TranslationCoordinator } from './TranslationCoordinator';
export type { TranslationCoordinatorConfig } from './TranslationCoordinator';

export { BuildSystemIntegration } from './BuildSystemInterface';
export type {
  IBuildSystemIntegration,
  BuildSystem,
  TargetPlatform,
  BuildSystemConfig,
  BuildIntegrationResult
} from './BuildSystemInterface';

export { PlatformFileSelector, createPlatformSelector } from './PlatformFileSelector';
export type {
  PlatformDetectionStrategy,
  PlatformSelectionOptions,
  PlatformSelectionResult
} from './PlatformFileSelector';

export { TreeShakingOptimizer, createTreeShakingOptimizer } from './TreeShakingOptimizer';
export type {
  OptimizationLevel,
  TreeShakingConfig,
  OptimizationResult,
  TreeShakableExport
} from './TreeShakingOptimizer';

export { BuildErrorHandler, createBuildErrorHandler } from './BuildErrorHandler';
export type {
  ErrorSeverity,
  ErrorCategory,
  BuildError,
  FallbackStrategy,
  FallbackOptions,
  ErrorRecoveryResult
} from './BuildErrorHandler';
