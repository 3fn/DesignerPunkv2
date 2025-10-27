"use strict";
/**
 * Build Configuration Helpers
 *
 * Provides utilities for creating, validating, and migrating build configurations.
 * Includes templates for common scenarios and documentation helpers.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigHelpers = void 0;
const BuildConfig_1 = require("../types/BuildConfig");
/**
 * Build configuration helper utilities
 */
class ConfigHelpers {
    /**
     * Create configuration from template
     *
     * @param template - Template name
     * @param overrides - Optional configuration overrides
     * @returns Build configuration
     */
    static createFromTemplate(template, overrides) {
        let baseConfig;
        switch (template) {
            case 'minimal':
                baseConfig = this.createMinimalConfig();
                break;
            case 'development':
                baseConfig = this.createDevelopmentConfig();
                break;
            case 'production':
                baseConfig = this.createProductionConfig();
                break;
            case 'all-platforms':
                baseConfig = this.createAllPlatformsConfig();
                break;
            case 'ios-only':
                baseConfig = this.createiOSOnlyConfig();
                break;
            case 'android-only':
                baseConfig = this.createAndroidOnlyConfig();
                break;
            case 'web-only':
                baseConfig = this.createWebOnlyConfig();
                break;
            case 'mobile':
                baseConfig = this.createMobileConfig();
                break;
            case 'ci-cd':
                baseConfig = this.createCICDConfig();
                break;
            default:
                throw new Error(`Unknown template: ${template}`);
        }
        return this.mergeConfigs(baseConfig, overrides);
    }
    /**
     * Validate configuration with detailed feedback
     *
     * @param config - Configuration to validate
     * @returns Validation result with errors and warnings
     */
    static validateConfiguration(config) {
        const errors = [];
        const warnings = [];
        // Validate required fields
        if (!config.platforms || config.platforms.length === 0) {
            errors.push('platforms: At least one platform must be specified');
        }
        if (!config.mode) {
            errors.push('mode: Build mode must be specified (development or production)');
        }
        if (!config.outputDir) {
            errors.push('outputDir: Output directory must be specified');
        }
        // Validate platform-specific options
        if (config.platforms?.includes('ios') && !config.ios) {
            warnings.push('ios: iOS platform selected but no iOS-specific options provided');
        }
        if (config.platforms?.includes('android') && !config.android) {
            warnings.push('android: Android platform selected but no Android-specific options provided');
        }
        if (config.platforms?.includes('web') && !config.web) {
            warnings.push('web: Web platform selected but no Web-specific options provided');
        }
        // Validate iOS options
        if (config.ios) {
            const iosErrors = this.validateiOSOptions(config.ios);
            errors.push(...iosErrors.map(e => `ios.${e}`));
        }
        // Validate Android options
        if (config.android) {
            const androidErrors = this.validateAndroidOptions(config.android);
            errors.push(...androidErrors.map(e => `android.${e}`));
        }
        // Validate Web options
        if (config.web) {
            const webErrors = this.validateWebOptions(config.web);
            errors.push(...webErrors.map(e => `web.${e}`));
        }
        // Production mode recommendations
        if (config.mode === 'production') {
            if (config.sourceMaps !== false) {
                warnings.push('sourceMaps: Consider disabling source maps in production for smaller bundles');
            }
            if (config.minify !== true) {
                warnings.push('minify: Consider enabling minification in production for smaller bundles');
            }
            if (config.parallel !== true) {
                warnings.push('parallel: Consider enabling parallel builds in production for faster builds');
            }
        }
        // Development mode recommendations
        if (config.mode === 'development') {
            if (config.incremental !== true) {
                warnings.push('incremental: Consider enabling incremental builds in development for faster iteration');
            }
            if (config.sourceMaps !== true) {
                warnings.push('sourceMaps: Consider enabling source maps in development for easier debugging');
            }
        }
        return {
            valid: errors.length === 0,
            errors,
            warnings,
        };
    }
    /**
     * Migrate configuration from older version
     *
     * @param oldConfig - Old configuration object
     * @param targetVersion - Target configuration version
     * @returns Migration result
     */
    static migrateConfiguration(oldConfig, targetVersion = '1.0.0') {
        const warnings = [];
        const errors = [];
        const changes = [];
        try {
            // Start with default config
            let config = { ...BuildConfig_1.DEFAULT_BUILD_CONFIG };
            // Migrate platforms
            if (oldConfig.platform) {
                config.platforms = [oldConfig.platform];
                changes.push(`Migrated 'platform' to 'platforms' array`);
            }
            else if (oldConfig.platforms) {
                config.platforms = oldConfig.platforms;
            }
            // Migrate mode
            if (oldConfig.mode) {
                config.mode = oldConfig.mode;
            }
            else if (oldConfig.env === 'production') {
                config.mode = 'production';
                changes.push(`Migrated 'env: production' to 'mode: production'`);
            }
            else if (oldConfig.env === 'development') {
                config.mode = 'development';
                changes.push(`Migrated 'env: development' to 'mode: development'`);
            }
            // Migrate output directory
            if (oldConfig.outputDir) {
                config.outputDir = oldConfig.outputDir;
            }
            else if (oldConfig.output) {
                config.outputDir = oldConfig.output;
                changes.push(`Migrated 'output' to 'outputDir'`);
            }
            else if (oldConfig.dist) {
                config.outputDir = oldConfig.dist;
                changes.push(`Migrated 'dist' to 'outputDir'`);
            }
            // Migrate build options
            if (oldConfig.parallel !== undefined) {
                config.parallel = oldConfig.parallel;
            }
            if (oldConfig.incremental !== undefined) {
                config.incremental = oldConfig.incremental;
            }
            if (oldConfig.sourceMaps !== undefined) {
                config.sourceMaps = oldConfig.sourceMaps;
            }
            else if (oldConfig.sourceMap !== undefined) {
                config.sourceMaps = oldConfig.sourceMap;
                changes.push(`Migrated 'sourceMap' to 'sourceMaps'`);
            }
            if (oldConfig.minify !== undefined) {
                config.minify = oldConfig.minify;
            }
            else if (oldConfig.minimize !== undefined) {
                config.minify = oldConfig.minimize;
                changes.push(`Migrated 'minimize' to 'minify'`);
            }
            // Migrate validation options
            if (oldConfig.validation) {
                config.validation = oldConfig.validation;
            }
            else if (oldConfig.validate !== undefined) {
                const validate = oldConfig.validate;
                config.validation = {
                    interfaces: validate,
                    tokens: validate,
                    mathematical: validate,
                };
                changes.push(`Migrated 'validate' boolean to 'validation' object`);
            }
            // Migrate platform-specific options
            if (oldConfig.ios) {
                config.ios = oldConfig.ios;
            }
            if (oldConfig.android) {
                config.android = oldConfig.android;
            }
            if (oldConfig.web) {
                config.web = oldConfig.web;
            }
            // Validate migrated configuration
            const validation = this.validateConfiguration(config);
            warnings.push(...validation.warnings);
            errors.push(...validation.errors);
            return {
                success: errors.length === 0,
                config,
                warnings,
                errors,
                changes,
            };
        }
        catch (error) {
            return {
                success: false,
                config: { ...BuildConfig_1.DEFAULT_BUILD_CONFIG },
                warnings,
                errors: [
                    ...errors,
                    `Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                ],
                changes,
            };
        }
    }
    /**
     * Get configuration documentation
     *
     * @returns Array of configuration documentation entries
     */
    static getDocumentation() {
        return [
            {
                field: 'platforms',
                description: 'Target platforms for build',
                type: 'Platform[]',
                default: "['web']",
                required: true,
                constraints: "Valid values: 'ios', 'android', 'web'",
                examples: [
                    "platforms: ['web']",
                    "platforms: ['ios', 'android']",
                    "platforms: ['ios', 'android', 'web']",
                ],
            },
            {
                field: 'mode',
                description: 'Build mode (development or production)',
                type: 'BuildMode',
                default: "'development'",
                required: true,
                constraints: "Valid values: 'development', 'production'",
                examples: [
                    "mode: 'development'",
                    "mode: 'production'",
                ],
            },
            {
                field: 'outputDir',
                description: 'Output directory for build artifacts',
                type: 'string',
                default: "'./dist'",
                required: true,
                examples: [
                    "outputDir: './dist'",
                    "outputDir: './build/output'",
                    "outputDir: '/absolute/path/to/output'",
                ],
            },
            {
                field: 'parallel',
                description: 'Execute builds in parallel (true) or sequentially (false)',
                type: 'boolean',
                default: 'false',
                required: false,
                examples: [
                    'parallel: true  // Faster builds, more resource intensive',
                    'parallel: false // Slower builds, less resource intensive',
                ],
            },
            {
                field: 'incremental',
                description: 'Enable incremental builds for faster iteration',
                type: 'boolean',
                default: 'true',
                required: false,
                examples: [
                    'incremental: true  // Only rebuild changed files',
                    'incremental: false // Full rebuild every time',
                ],
            },
            {
                field: 'sourceMaps',
                description: 'Generate source maps for debugging',
                type: 'boolean',
                default: 'true',
                required: false,
                examples: [
                    'sourceMaps: true  // Enable debugging',
                    'sourceMaps: false // Smaller bundles',
                ],
            },
            {
                field: 'minify',
                description: 'Minify output for production builds',
                type: 'boolean',
                default: 'false',
                required: false,
                examples: [
                    'minify: true  // Smaller bundles',
                    'minify: false // Readable output',
                ],
            },
            {
                field: 'validation',
                description: 'Validation options for build process',
                type: 'ValidationOptions',
                default: '{ interfaces: true, tokens: true, mathematical: true }',
                required: false,
                examples: [
                    'validation: { interfaces: true, tokens: true, mathematical: true }',
                    'validation: { interfaces: false, tokens: true, mathematical: false }',
                ],
            },
            {
                field: 'ios',
                description: 'iOS-specific build options',
                type: 'iOSBuildOptions',
                default: 'undefined',
                required: false,
                examples: [
                    "ios: { swiftVersion: '5.9', minimumDeploymentTarget: '15.0', dependencies: [] }",
                ],
            },
            {
                field: 'android',
                description: 'Android-specific build options',
                type: 'AndroidBuildOptions',
                default: 'undefined',
                required: false,
                examples: [
                    "android: { kotlinVersion: '1.9.0', minSdkVersion: 24, targetSdkVersion: 34, dependencies: [] }",
                ],
            },
            {
                field: 'web',
                description: 'Web-specific build options',
                type: 'WebBuildOptions',
                default: 'undefined',
                required: false,
                examples: [
                    "web: { target: 'es2021', formats: ['esm', 'cjs'], externals: [] }",
                ],
            },
        ];
    }
    /**
     * Generate configuration documentation as markdown
     *
     * @returns Markdown documentation string
     */
    static generateMarkdownDocs() {
        const docs = this.getDocumentation();
        let markdown = '# Build Configuration Reference\n\n';
        markdown += '## Configuration Fields\n\n';
        for (const entry of docs) {
            markdown += `### \`${entry.field}\`\n\n`;
            markdown += `**Description:** ${entry.description}\n\n`;
            markdown += `**Type:** \`${entry.type}\`\n\n`;
            markdown += `**Default:** \`${entry.default}\`\n\n`;
            markdown += `**Required:** ${entry.required ? 'Yes' : 'No'}\n\n`;
            if (entry.constraints) {
                markdown += `**Constraints:** ${entry.constraints}\n\n`;
            }
            if (entry.examples && entry.examples.length > 0) {
                markdown += '**Examples:**\n\n';
                markdown += '```typescript\n';
                markdown += entry.examples.join('\n');
                markdown += '\n```\n\n';
            }
            markdown += '---\n\n';
        }
        return markdown;
    }
    // Private helper methods
    /**
     * Create minimal configuration
     */
    static createMinimalConfig() {
        return {
            platforms: ['web'],
            mode: 'development',
            outputDir: './dist',
            parallel: false,
            incremental: false,
            sourceMaps: false,
            minify: false,
            validation: {
                interfaces: false,
                tokens: false,
                mathematical: false,
            },
        };
    }
    /**
     * Create development configuration
     */
    static createDevelopmentConfig() {
        return {
            platforms: ['web'],
            mode: 'development',
            outputDir: './dist',
            parallel: false,
            incremental: true,
            sourceMaps: true,
            minify: false,
            validation: {
                interfaces: true,
                tokens: true,
                mathematical: true,
            },
        };
    }
    /**
     * Create production configuration
     */
    static createProductionConfig() {
        return {
            platforms: ['web'],
            mode: 'production',
            outputDir: './dist',
            parallel: true,
            incremental: false,
            sourceMaps: false,
            minify: true,
            validation: {
                interfaces: true,
                tokens: true,
                mathematical: true,
            },
        };
    }
    /**
     * Create all-platforms configuration
     */
    static createAllPlatformsConfig() {
        return {
            platforms: ['ios', 'android', 'web'],
            mode: 'development',
            outputDir: './dist',
            parallel: true,
            incremental: true,
            sourceMaps: true,
            minify: false,
            validation: {
                interfaces: true,
                tokens: true,
                mathematical: true,
            },
            ios: {
                swiftVersion: '5.9',
                minimumDeploymentTarget: '15.0',
                dependencies: [],
            },
            android: {
                kotlinVersion: '1.9.0',
                minSdkVersion: 24,
                targetSdkVersion: 34,
                dependencies: [],
            },
            web: {
                target: 'es2021',
                formats: ['esm', 'cjs'],
                externals: [],
            },
        };
    }
    /**
     * Create iOS-only configuration
     */
    static createiOSOnlyConfig() {
        return {
            platforms: ['ios'],
            mode: 'development',
            outputDir: './dist',
            parallel: false,
            incremental: true,
            sourceMaps: true,
            minify: false,
            validation: {
                interfaces: true,
                tokens: true,
                mathematical: true,
            },
            ios: {
                swiftVersion: '5.9',
                minimumDeploymentTarget: '15.0',
                dependencies: [],
            },
        };
    }
    /**
     * Create Android-only configuration
     */
    static createAndroidOnlyConfig() {
        return {
            platforms: ['android'],
            mode: 'development',
            outputDir: './dist',
            parallel: false,
            incremental: true,
            sourceMaps: true,
            minify: false,
            validation: {
                interfaces: true,
                tokens: true,
                mathematical: true,
            },
            android: {
                kotlinVersion: '1.9.0',
                minSdkVersion: 24,
                targetSdkVersion: 34,
                dependencies: [],
            },
        };
    }
    /**
     * Create Web-only configuration
     */
    static createWebOnlyConfig() {
        return {
            platforms: ['web'],
            mode: 'development',
            outputDir: './dist',
            parallel: false,
            incremental: true,
            sourceMaps: true,
            minify: false,
            validation: {
                interfaces: true,
                tokens: true,
                mathematical: true,
            },
            web: {
                target: 'es2021',
                formats: ['esm', 'cjs'],
                externals: [],
            },
        };
    }
    /**
     * Create mobile (iOS + Android) configuration
     */
    static createMobileConfig() {
        return {
            platforms: ['ios', 'android'],
            mode: 'development',
            outputDir: './dist',
            parallel: true,
            incremental: true,
            sourceMaps: true,
            minify: false,
            validation: {
                interfaces: true,
                tokens: true,
                mathematical: true,
            },
            ios: {
                swiftVersion: '5.9',
                minimumDeploymentTarget: '15.0',
                dependencies: [],
            },
            android: {
                kotlinVersion: '1.9.0',
                minSdkVersion: 24,
                targetSdkVersion: 34,
                dependencies: [],
            },
        };
    }
    /**
     * Create CI/CD configuration
     */
    static createCICDConfig() {
        return {
            platforms: ['ios', 'android', 'web'],
            mode: 'production',
            outputDir: './dist',
            parallel: true,
            incremental: false,
            sourceMaps: false,
            minify: true,
            validation: {
                interfaces: true,
                tokens: true,
                mathematical: true,
            },
            ios: {
                swiftVersion: '5.9',
                minimumDeploymentTarget: '15.0',
                dependencies: [],
            },
            android: {
                kotlinVersion: '1.9.0',
                minSdkVersion: 24,
                targetSdkVersion: 34,
                dependencies: [],
            },
            web: {
                target: 'es2021',
                formats: ['esm', 'cjs'],
                externals: [],
            },
        };
    }
    /**
     * Merge configurations with overrides
     */
    static mergeConfigs(base, overrides) {
        if (!overrides) {
            return base;
        }
        return {
            ...base,
            ...overrides,
            validation: {
                ...base.validation,
                ...(overrides.validation || {}),
            },
            ios: overrides.ios ? { ...base.ios, ...overrides.ios } : base.ios,
            android: overrides.android ? { ...base.android, ...overrides.android } : base.android,
            web: overrides.web ? { ...base.web, ...overrides.web } : base.web,
        };
    }
    /**
     * Validate iOS options
     */
    static validateiOSOptions(options) {
        const errors = [];
        if (!options.swiftVersion) {
            errors.push('swiftVersion: Swift version must be specified');
        }
        if (!options.minimumDeploymentTarget) {
            errors.push('minimumDeploymentTarget: Minimum deployment target must be specified');
        }
        return errors;
    }
    /**
     * Validate Android options
     */
    static validateAndroidOptions(options) {
        const errors = [];
        if (!options.kotlinVersion) {
            errors.push('kotlinVersion: Kotlin version must be specified');
        }
        if (typeof options.minSdkVersion !== 'number') {
            errors.push('minSdkVersion: Minimum SDK version must be a number');
        }
        else if (options.minSdkVersion < 21) {
            errors.push('minSdkVersion: Minimum SDK version must be >= 21');
        }
        if (typeof options.targetSdkVersion !== 'number') {
            errors.push('targetSdkVersion: Target SDK version must be a number');
        }
        if (typeof options.minSdkVersion === 'number' &&
            typeof options.targetSdkVersion === 'number' &&
            options.minSdkVersion > options.targetSdkVersion) {
            errors.push('minSdkVersion: Cannot be greater than targetSdkVersion');
        }
        return errors;
    }
    /**
     * Validate Web options
     */
    static validateWebOptions(options) {
        const errors = [];
        if (!options.target) {
            errors.push('target: ECMAScript target must be specified');
        }
        else if (!['es2020', 'es2021', 'esnext'].includes(options.target)) {
            errors.push(`target: Invalid target '${options.target}'. Valid values: es2020, es2021, esnext`);
        }
        if (!options.formats || options.formats.length === 0) {
            errors.push('formats: At least one output format must be specified');
        }
        else {
            const validFormats = ['esm', 'cjs', 'umd'];
            const invalidFormats = options.formats.filter(f => !validFormats.includes(f));
            if (invalidFormats.length > 0) {
                errors.push(`formats: Invalid formats '${invalidFormats.join(', ')}'. Valid values: esm, cjs, umd`);
            }
        }
        return errors;
    }
}
exports.ConfigHelpers = ConfigHelpers;
//# sourceMappingURL=ConfigHelpers.js.map