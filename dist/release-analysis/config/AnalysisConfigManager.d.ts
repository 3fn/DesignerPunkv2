/**
 * Analysis Configuration Manager
 *
 * Handles loading, merging, and validation of release analysis configuration
 * Adapted from release management system for CLI-driven workflow
 */
import { AnalysisConfig } from './AnalysisConfig';
import { AnalysisConfigValidationResult } from './AnalysisConfigSchema';
export interface AnalysisConfigLoadResult {
    config: AnalysisConfig;
    validation: AnalysisConfigValidationResult;
    sources: ConfigSource[];
}
export interface ConfigSource {
    path: string;
    type: 'default' | 'user' | 'environment';
    loaded: boolean;
    error?: string;
}
export declare class AnalysisConfigManager {
    private static instance;
    private cachedConfig;
    private configPaths;
    private constructor();
    static getInstance(): AnalysisConfigManager;
    /**
     * Load and merge configuration from all sources
     */
    loadConfig(workspaceRoot?: string): Promise<AnalysisConfigLoadResult>;
    /**
     * Get cached configuration or load if not cached
     */
    getConfig(workspaceRoot?: string): Promise<AnalysisConfig>;
    /**
     * Clear cached configuration (force reload on next access)
     */
    clearCache(): void;
    /**
     * Save configuration to file
     */
    saveConfig(config: AnalysisConfig, filePath?: string): Promise<void>;
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
    getConfigSummary(config: AnalysisConfig): string;
    /**
     * Validate configuration and return detailed report
     */
    validateConfiguration(config: AnalysisConfig): {
        valid: boolean;
        errors: string[];
        warnings: string[];
        summary: string;
    };
    /**
     * Create a minimal configuration file for first-time setup
     */
    createDefaultConfigFile(workspaceRoot?: string): Promise<string>;
}
//# sourceMappingURL=AnalysisConfigManager.d.ts.map