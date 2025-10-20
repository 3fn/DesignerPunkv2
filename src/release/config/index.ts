/**
 * Release Configuration System
 * 
 * Comprehensive configuration management for release automation
 */

import { ReleaseConfig, DEFAULT_RELEASE_CONFIG } from './ReleaseConfig';
import { ConfigManager } from './ConfigManager';

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

// Configuration schema and validation
export type {
  ConfigValidationResult,
  ConfigValidationError,
  ConfigValidationWarning
} from './ConfigSchema';

export {
  RELEASE_CONFIG_SCHEMA,
  validateConfig,
  validateEnvironmentVariables
} from './ConfigSchema';

// Configuration management
export type {
  ConfigLoadResult,
  ConfigSource
} from './ConfigManager';

export { ConfigManager } from './ConfigManager';

// Convenience functions for common configuration operations
export async function loadReleaseConfig(workspaceRoot?: string): Promise<ReleaseConfig> {
  const manager = ConfigManager.getInstance();
  return manager.getConfig(workspaceRoot);
}

export async function validateReleaseConfig(config: ReleaseConfig): Promise<{
  valid: boolean;
  errors: string[];
  warnings: string[];
}> {
  const manager = ConfigManager.getInstance();
  const result = manager.validateConfiguration(config);
  return {
    valid: result.valid,
    errors: result.errors,
    warnings: result.warnings
  };
}

export async function saveReleaseConfig(config: ReleaseConfig, filePath?: string): Promise<void> {
  const manager = ConfigManager.getInstance();
  return manager.saveConfig(config, filePath);
}

export function clearConfigCache(): void {
  const manager = ConfigManager.getInstance();
  manager.clearCache();
}