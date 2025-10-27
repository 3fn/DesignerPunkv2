"use strict";
/**
 * Platform File Selector
 *
 * Provides intelligent platform file selection for build systems, enabling
 * seamless integration with cross-platform builds. Automatically selects
 * appropriate token files based on build target and environment.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformFileSelector = void 0;
exports.createPlatformSelector = createPlatformSelector;
/**
 * Platform file selector
 *
 * Intelligently selects appropriate platform-specific token files based on
 * build context, environment, and configuration.
 */
class PlatformFileSelector {
    constructor(options = {}) {
        this.availableFiles = new Map();
        this.options = {
            strategy: options.strategy || 'auto',
            fallback: options.fallback || 'web',
            envVar: options.envVar || 'TARGET_PLATFORM',
            strict: options.strict || false
        };
    }
    /**
     * Register available platform files
     */
    registerFiles(files) {
        for (const file of files) {
            this.availableFiles.set(file.platform, file);
        }
    }
    /**
     * Select platform based on configuration and context
     */
    selectPlatform(explicitPlatform) {
        // Strategy 1: Explicit platform specified
        if (explicitPlatform) {
            return this.selectExplicit(explicitPlatform);
        }
        // Strategy 2: Use configured strategy
        switch (this.options.strategy) {
            case 'explicit':
                return this.handleMissingExplicit();
            case 'environment':
                return this.selectFromEnvironment();
            case 'package':
                return this.selectFromPackage();
            case 'auto':
                return this.selectAuto();
            default:
                return this.selectFallback('Unknown strategy');
        }
    }
    /**
     * Get file path for selected platform
     */
    getFilePath(platform) {
        const file = this.availableFiles.get(platform);
        if (!file) {
            if (this.options.strict) {
                throw new Error(`No file available for platform: ${platform}`);
            }
            // Return fallback
            const fallbackFile = this.availableFiles.get(this.options.fallback);
            if (!fallbackFile) {
                throw new Error(`No file available for fallback platform: ${this.options.fallback}`);
            }
            return fallbackFile.filePath;
        }
        return file.filePath;
    }
    /**
     * Get all available platforms
     */
    getAvailablePlatforms() {
        return Array.from(this.availableFiles.keys());
    }
    /**
     * Check if platform is available
     */
    isPlatformAvailable(platform) {
        return this.availableFiles.has(platform);
    }
    selectExplicit(platform) {
        if (!this.isPlatformAvailable(platform)) {
            if (this.options.strict) {
                throw new Error(`Platform not available: ${platform}`);
            }
            return this.selectFallback(`Explicit platform ${platform} not available`);
        }
        return {
            platform,
            strategyUsed: 'explicit',
            usedFallback: false,
            confidence: 1.0,
            context: `Explicitly specified platform: ${platform}`
        };
    }
    handleMissingExplicit() {
        if (this.options.strict) {
            throw new Error('Explicit platform required but not provided');
        }
        return this.selectFallback('No explicit platform provided');
    }
    selectFromEnvironment() {
        const envPlatform = process.env[this.options.envVar];
        if (!envPlatform) {
            if (this.options.strict) {
                throw new Error(`Environment variable ${this.options.envVar} not set`);
            }
            return this.selectFallback(`Environment variable ${this.options.envVar} not set`);
        }
        const platform = this.normalizePlatform(envPlatform);
        if (!platform) {
            if (this.options.strict) {
                throw new Error(`Invalid platform in environment: ${envPlatform}`);
            }
            return this.selectFallback(`Invalid platform in environment: ${envPlatform}`);
        }
        if (!this.isPlatformAvailable(platform)) {
            if (this.options.strict) {
                throw new Error(`Platform from environment not available: ${platform}`);
            }
            return this.selectFallback(`Platform from environment not available: ${platform}`);
        }
        return {
            platform,
            strategyUsed: 'environment',
            usedFallback: false,
            confidence: 0.9,
            context: `Detected from environment variable ${this.options.envVar}=${envPlatform}`
        };
    }
    selectFromPackage() {
        // In a real implementation, this would read package.json
        // For now, return fallback
        if (this.options.strict) {
            throw new Error('Package.json detection not implemented');
        }
        return this.selectFallback('Package.json detection not implemented');
    }
    selectAuto() {
        // Try environment first
        const envPlatform = process.env[this.options.envVar];
        if (envPlatform) {
            const platform = this.normalizePlatform(envPlatform);
            if (platform && this.isPlatformAvailable(platform)) {
                return {
                    platform,
                    strategyUsed: 'environment',
                    usedFallback: false,
                    confidence: 0.9,
                    context: `Auto-detected from environment variable ${this.options.envVar}=${envPlatform}`
                };
            }
        }
        // Try common environment indicators
        const nodeEnv = process.env.NODE_ENV;
        if (nodeEnv === 'production' || nodeEnv === 'development') {
            // Assume web for Node.js environments
            if (this.isPlatformAvailable('web')) {
                return {
                    platform: 'web',
                    strategyUsed: 'environment',
                    usedFallback: false,
                    confidence: 0.7,
                    context: `Auto-detected web platform from NODE_ENV=${nodeEnv}`
                };
            }
        }
        // Use fallback
        return this.selectFallback('Auto-detection failed, no clear platform indicators');
    }
    selectFallback(reason) {
        const fallback = this.options.fallback;
        if (!this.isPlatformAvailable(fallback)) {
            throw new Error(`Fallback platform not available: ${fallback}`);
        }
        return {
            platform: fallback,
            strategyUsed: this.options.strategy,
            usedFallback: true,
            confidence: 0.5,
            context: `Using fallback platform (${fallback}): ${reason}`
        };
    }
    normalizePlatform(value) {
        const normalized = value.toLowerCase().trim();
        const platformMap = {
            'web': 'web',
            'browser': 'web',
            'js': 'web',
            'javascript': 'web',
            'ios': 'ios',
            'swift': 'ios',
            'apple': 'ios',
            'android': 'android',
            'kotlin': 'android',
            'java': 'android'
        };
        return platformMap[normalized] || null;
    }
}
exports.PlatformFileSelector = PlatformFileSelector;
/**
 * Create a platform file selector with default options
 */
function createPlatformSelector(options) {
    return new PlatformFileSelector(options);
}
//# sourceMappingURL=PlatformFileSelector.js.map