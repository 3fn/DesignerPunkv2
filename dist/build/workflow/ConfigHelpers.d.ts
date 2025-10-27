/**
 * Build Configuration Helpers
 *
 * Provides utilities for creating, validating, and migrating build configurations.
 * Includes templates for common scenarios and documentation helpers.
 */
import { BuildConfig } from '../types/BuildConfig';
import { ValidationResult } from '../types/BuildOrchestrator';
/**
 * Configuration template type
 */
export type ConfigTemplate = 'minimal' | 'development' | 'production' | 'all-platforms' | 'ios-only' | 'android-only' | 'web-only' | 'mobile' | 'ci-cd';
/**
 * Configuration migration result
 */
export interface MigrationResult {
    /** Whether migration was successful */
    success: boolean;
    /** Migrated configuration */
    config: BuildConfig;
    /** Migration warnings */
    warnings: string[];
    /** Migration errors */
    errors: string[];
    /** Changes made during migration */
    changes: string[];
}
/**
 * Configuration documentation entry
 */
export interface ConfigDocEntry {
    /** Configuration field path */
    field: string;
    /** Field description */
    description: string;
    /** Field type */
    type: string;
    /** Default value */
    default: string;
    /** Whether field is required */
    required: boolean;
    /** Valid values or constraints */
    constraints?: string;
    /** Usage examples */
    examples?: string[];
}
/**
 * Build configuration helper utilities
 */
export declare class ConfigHelpers {
    /**
     * Create configuration from template
     *
     * @param template - Template name
     * @param overrides - Optional configuration overrides
     * @returns Build configuration
     */
    static createFromTemplate(template: ConfigTemplate, overrides?: Partial<BuildConfig>): BuildConfig;
    /**
     * Validate configuration with detailed feedback
     *
     * @param config - Configuration to validate
     * @returns Validation result with errors and warnings
     */
    static validateConfiguration(config: Partial<BuildConfig>): ValidationResult;
    /**
     * Migrate configuration from older version
     *
     * @param oldConfig - Old configuration object
     * @param targetVersion - Target configuration version
     * @returns Migration result
     */
    static migrateConfiguration(oldConfig: Record<string, unknown>, targetVersion?: string): MigrationResult;
    /**
     * Get configuration documentation
     *
     * @returns Array of configuration documentation entries
     */
    static getDocumentation(): ConfigDocEntry[];
    /**
     * Generate configuration documentation as markdown
     *
     * @returns Markdown documentation string
     */
    static generateMarkdownDocs(): string;
    /**
     * Create minimal configuration
     */
    private static createMinimalConfig;
    /**
     * Create development configuration
     */
    private static createDevelopmentConfig;
    /**
     * Create production configuration
     */
    private static createProductionConfig;
    /**
     * Create all-platforms configuration
     */
    private static createAllPlatformsConfig;
    /**
     * Create iOS-only configuration
     */
    private static createiOSOnlyConfig;
    /**
     * Create Android-only configuration
     */
    private static createAndroidOnlyConfig;
    /**
     * Create Web-only configuration
     */
    private static createWebOnlyConfig;
    /**
     * Create mobile (iOS + Android) configuration
     */
    private static createMobileConfig;
    /**
     * Create CI/CD configuration
     */
    private static createCICDConfig;
    /**
     * Merge configurations with overrides
     */
    private static mergeConfigs;
    /**
     * Validate iOS options
     */
    private static validateiOSOptions;
    /**
     * Validate Android options
     */
    private static validateAndroidOptions;
    /**
     * Validate Web options
     */
    private static validateWebOptions;
}
//# sourceMappingURL=ConfigHelpers.d.ts.map