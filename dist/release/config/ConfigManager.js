"use strict";
/**
 * Configuration Manager
 *
 * Handles loading, merging, and validation of release configuration
 * Supports default configuration with user overrides
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigManager = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const ReleaseConfig_1 = require("./ReleaseConfig");
const ConfigSchema_1 = require("./ConfigSchema");
class ConfigManager {
    constructor() {
        this.cachedConfig = null;
        this.configPaths = [
            '.kiro/release-config.json',
            'release-config.json',
            '.release-config.json'
        ];
    }
    static getInstance() {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }
    /**
     * Load and merge configuration from all sources
     */
    async loadConfig(workspaceRoot) {
        const sources = [];
        let mergedConfig = this.deepClone(ReleaseConfig_1.DEFAULT_RELEASE_CONFIG);
        // Add default config source
        sources.push({
            path: 'built-in',
            type: 'default',
            loaded: true
        });
        // Try to load user configuration files
        const userConfig = await this.loadUserConfig(workspaceRoot);
        if (userConfig.config) {
            mergedConfig = this.mergeConfigs(mergedConfig, userConfig.config);
            sources.push({
                path: userConfig.source || 'unknown',
                type: 'user',
                loaded: true
            });
        }
        else if (userConfig.error) {
            sources.push({
                path: userConfig.source || 'unknown',
                type: 'user',
                loaded: false,
                error: userConfig.error
            });
        }
        // Apply environment variable overrides
        const envConfig = this.loadEnvironmentOverrides();
        if (envConfig) {
            mergedConfig = this.mergeConfigs(mergedConfig, envConfig);
            sources.push({
                path: 'environment variables',
                type: 'environment',
                loaded: true
            });
        }
        // Validate the merged configuration
        const validation = (0, ConfigSchema_1.validateConfig)(mergedConfig);
        // Also validate environment variables
        const envValidation = (0, ConfigSchema_1.validateEnvironmentVariables)(mergedConfig);
        validation.errors.push(...envValidation.errors);
        validation.warnings.push(...envValidation.warnings);
        validation.valid = validation.valid && envValidation.valid;
        // Cache the configuration if valid
        if (validation.valid) {
            this.cachedConfig = mergedConfig;
        }
        return {
            config: mergedConfig,
            validation,
            sources
        };
    }
    /**
     * Get cached configuration or load if not cached
     */
    async getConfig(workspaceRoot) {
        if (this.cachedConfig) {
            return this.cachedConfig;
        }
        const result = await this.loadConfig(workspaceRoot);
        if (!result.validation.valid) {
            throw new Error(`Configuration validation failed: ${result.validation.errors.map(e => e.message).join(', ')}`);
        }
        return result.config;
    }
    /**
     * Clear cached configuration (force reload on next access)
     */
    clearCache() {
        this.cachedConfig = null;
    }
    /**
     * Save configuration to file
     */
    async saveConfig(config, filePath) {
        const targetPath = filePath || path.join(process.cwd(), '.kiro/release-config.json');
        // Validate configuration before saving
        const validation = (0, ConfigSchema_1.validateConfig)(config);
        if (!validation.valid) {
            throw new Error(`Cannot save invalid configuration: ${validation.errors.map(e => e.message).join(', ')}`);
        }
        // Ensure directory exists
        const dir = path.dirname(targetPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        // Write configuration file
        const configJson = JSON.stringify(config, null, 2);
        fs.writeFileSync(targetPath, configJson, 'utf8');
        // Clear cache to force reload
        this.clearCache();
    }
    /**
     * Load user configuration from file
     */
    async loadUserConfig(workspaceRoot) {
        const root = workspaceRoot || process.cwd();
        for (const configPath of this.configPaths) {
            const fullPath = path.join(root, configPath);
            try {
                if (fs.existsSync(fullPath)) {
                    const configContent = fs.readFileSync(fullPath, 'utf8');
                    const config = JSON.parse(configContent);
                    return { config, source: fullPath };
                }
            }
            catch (error) {
                return {
                    source: fullPath,
                    error: error instanceof Error ? error.message : 'Unknown error loading configuration'
                };
            }
        }
        return {}; // No user config found
    }
    /**
     * Load configuration overrides from environment variables
     */
    loadEnvironmentOverrides() {
        const overrides = {};
        let hasOverrides = false;
        // GitHub configuration overrides
        if (process.env.RELEASE_GITHUB_OWNER) {
            this.setNestedProperty(overrides, 'publishing.github.owner', process.env.RELEASE_GITHUB_OWNER);
            hasOverrides = true;
        }
        if (process.env.RELEASE_GITHUB_REPOSITORY) {
            this.setNestedProperty(overrides, 'publishing.github.repository', process.env.RELEASE_GITHUB_REPOSITORY);
            hasOverrides = true;
        }
        if (process.env.RELEASE_GITHUB_TOKEN_VAR) {
            this.setNestedProperty(overrides, 'publishing.github.tokenEnvVar', process.env.RELEASE_GITHUB_TOKEN_VAR);
            hasOverrides = true;
        }
        // npm configuration overrides
        if (process.env.RELEASE_NPM_REGISTRY) {
            this.setNestedProperty(overrides, 'publishing.npm.registry', process.env.RELEASE_NPM_REGISTRY);
            hasOverrides = true;
        }
        if (process.env.RELEASE_NPM_TOKEN_VAR) {
            this.setNestedProperty(overrides, 'publishing.npm.tokenEnvVar', process.env.RELEASE_NPM_TOKEN_VAR);
            hasOverrides = true;
        }
        // Detection configuration overrides
        if (process.env.RELEASE_CONFIDENCE_THRESHOLD) {
            const threshold = parseFloat(process.env.RELEASE_CONFIDENCE_THRESHOLD);
            if (!isNaN(threshold)) {
                this.setNestedProperty(overrides, 'detection.confidenceThreshold', threshold);
                hasOverrides = true;
            }
        }
        // Versioning configuration overrides
        if (process.env.RELEASE_PRERELEASE_STRATEGY) {
            const strategy = process.env.RELEASE_PRERELEASE_STRATEGY;
            if (['alpha', 'beta', 'rc'].includes(strategy)) {
                this.setNestedProperty(overrides, 'versioning.preReleaseStrategy', strategy);
                hasOverrides = true;
            }
        }
        return hasOverrides ? overrides : null;
    }
    /**
     * Deep merge two configuration objects
     */
    mergeConfigs(base, override) {
        return this.deepMerge(base, override);
    }
    /**
     * Deep merge utility function
     */
    deepMerge(target, source) {
        const result = this.deepClone(target);
        for (const key in source) {
            if (source.hasOwnProperty(key)) {
                if (this.isObject(source[key]) && this.isObject(result[key])) {
                    result[key] = this.deepMerge(result[key], source[key]);
                }
                else {
                    result[key] = source[key];
                }
            }
        }
        return result;
    }
    /**
     * Deep clone utility function
     */
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        if (obj instanceof Date) {
            return new Date(obj.getTime());
        }
        if (Array.isArray(obj)) {
            return obj.map(item => this.deepClone(item));
        }
        const cloned = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = this.deepClone(obj[key]);
            }
        }
        return cloned;
    }
    /**
     * Check if value is an object
     */
    isObject(value) {
        return value !== null && typeof value === 'object' && !Array.isArray(value);
    }
    /**
     * Set nested property using dot notation
     */
    setNestedProperty(obj, path, value) {
        const keys = path.split('.');
        let current = obj;
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!(key in current) || !this.isObject(current[key])) {
                current[key] = {};
            }
            current = current[key];
        }
        current[keys[keys.length - 1]] = value;
    }
    /**
     * Get configuration summary for debugging
     */
    getConfigSummary(config) {
        const summary = {
            detection: {
                specTrigger: config.detection.specCompletionTrigger,
                taskTrigger: config.detection.taskCompletionTrigger,
                confidenceThreshold: config.detection.confidenceThreshold,
                breakingChangeKeywords: config.detection.breakingChangeKeywords.length
            },
            versioning: {
                preReleaseStrategy: config.versioning.preReleaseStrategy,
                corePackageSync: config.versioning.packageCoordination.corePackageSync,
                componentIndependence: config.versioning.packageCoordination.componentIndependence
            },
            publishing: {
                github: {
                    owner: config.publishing.github.owner,
                    repository: config.publishing.github.repository,
                    createReleases: config.publishing.github.createReleases
                },
                npm: {
                    registry: config.publishing.npm.registry,
                    packages: config.publishing.npm.packages.length
                }
            },
            validation: {
                releaseReadiness: config.validation.releaseReadiness,
                versionBumpValidation: config.validation.versionBumpValidation,
                packageCompatibility: config.validation.packageCompatibility
            }
        };
        return JSON.stringify(summary, null, 2);
    }
    /**
     * Validate configuration and return detailed report
     */
    validateConfiguration(config) {
        const validation = (0, ConfigSchema_1.validateConfig)(config);
        const envValidation = (0, ConfigSchema_1.validateEnvironmentVariables)(config);
        const allErrors = [...validation.errors, ...envValidation.errors];
        const allWarnings = [...validation.warnings, ...envValidation.warnings];
        return {
            valid: validation.valid && envValidation.valid,
            errors: allErrors.map(e => `${e.path}: ${e.message}`),
            warnings: allWarnings.map(w => `${w.path}: ${w.message}${w.suggestion ? ` (${w.suggestion})` : ''}`),
            summary: this.getConfigSummary(config)
        };
    }
}
exports.ConfigManager = ConfigManager;
//# sourceMappingURL=ConfigManager.js.map