/**
 * Release Configuration System
 *
 * Comprehensive configuration management for release automation
 */
import { ReleaseConfig } from './ReleaseConfig';
export type { ReleaseConfig, DetectionConfig, VersioningConfig, CoordinationStrategy, SemanticVersioningRules, VersionBumpRules, VersionValidationRule, PublishingConfig, GitHubConfig, NpmConfig, NpmPackageConfig, ArtifactConfig, PublishingOrderConfig, RetryConfig, ValidationConfig, ValidationRulesConfig, BreakingChangeRule, SafetyChecksConfig } from './ReleaseConfig';
export { DEFAULT_RELEASE_CONFIG } from './ReleaseConfig';
export type { ConfigValidationResult, ConfigValidationError, ConfigValidationWarning } from './ConfigSchema';
export { RELEASE_CONFIG_SCHEMA, validateConfig, validateEnvironmentVariables } from './ConfigSchema';
export type { ConfigLoadResult, ConfigSource } from './ConfigManager';
export { ConfigManager } from './ConfigManager';
export declare function loadReleaseConfig(workspaceRoot?: string): Promise<ReleaseConfig>;
export declare function validateReleaseConfig(config: ReleaseConfig): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
}>;
export declare function saveReleaseConfig(config: ReleaseConfig, filePath?: string): Promise<void>;
export declare function clearConfigCache(): void;
//# sourceMappingURL=index.d.ts.map