/**
 * Release Configuration System
 * 
 * Comprehensive configuration management for release automation
 */

// Core configuration types and interfaces
export type {
  ReleaseConfig,
  DetectionConfig,
  VersioningConfig,
  CoordinationStrategy,
  SemanticVersioningRules,
  VersionBumpRules,
  VersionValidationRule,
  PublishingConfig,
  GitHubConfig,
  NpmConfig,
  NpmPackageConfig,
  ArtifactConfig,
  PublishingOrderConfig,
  RetryConfig,
  ValidationConfig,
  ValidationRulesConfig,
  BreakingChangeRule,
  SafetyChecksConfig
} from './ReleaseConfig';

// Default configuration
export { DEFAULT_RELEASE_CONFIG } from './ReleaseConfig';

// Configuration management
export type {
  ConfigLoadOptions,
  ConfigValidationResult,
  ConfigValidationError,
  ConfigValidationWarning
} from './ConfigManager';

export { 
  ConfigManager,
  createConfigManager,
  loadConfig
} from './ConfigManager';