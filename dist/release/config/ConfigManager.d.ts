/**
 * Configuration Manager
 *
 * Handles loading, merging, and validation of release configuration
 * Supports default configuration with user overrides
 */
import { ReleaseConfig } from './ReleaseConfig';
import { ConfigValidationResult } from './ConfigSchema';
export interface ConfigLoadResult {
    config: ReleaseConfig;
    validation: ConfigValidationResult;
    sources: ConfigSource[];
}
export interface ConfigSource {
    path: string;
    type: 'default' | 'user' | 'environment';
    loaded: boolean;
    error?: string;
}
export declare class ConfigManager {
    private static instance;
    private cachedConfig;
    private configPaths;
    private constructor();
    static getInstance(): ConfigManager;
    /**
     * Load and merge configuration from all sources
     */
    loadConfig(workspaceRoot?: string): Promise<ConfigLoadResult>;
    /**
     * Get cached configuration or load if not cached
     */
    getConfig(workspaceRoot?: string): Promise<ReleaseConfig>;
    /**
     * Clear cached configuration (force reload on next access)
     */
    clearCache(): void;
    /**
     * Save configuration to file
     */
    saveConfig(config: ReleaseConfig, filePath?: string): Promise<void>;
    /**
     * Load user configuration from file
     */
    private loadUserConfig;
    /**
     * Load configuration overrides from environment variables
     */
    private loadEnvironmentOverrides;
    /**
     * Deep merge two configuration objects
     */
    private mergeConfigs;
    /**
     * Deep merge utility function
     */
    private deepMerge;
    /**
     * Deep clone utility function
     */
    private deepClone;
    /**
     * Check if value is an object
     */
    private isObject;
    /**
     * Set nested property using dot notation
     */
    private setNestedProperty;
    /**
     * Get configuration summary for debugging
     */
    getConfigSummary(config: ReleaseConfig): string;
    /**
     * Validate configuration and return detailed report
     */
    validateConfiguration(config: ReleaseConfig): {
        valid: boolean;
        errors: string[];
        warnings: string[];
        summary: string;
    };
}
//# sourceMappingURL=ConfigManager.d.ts.map