"use strict";
/**
 * Build Mode Support
 *
 * Provides development and production build mode configurations with
 * platform-specific optimizations. Development mode enables debugging
 * features while production mode optimizes for performance and size.
 *
 * Requirements: 8.6
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildModeManager = void 0;
/**
 * Build Mode Manager
 *
 * Manages build mode configurations and applies platform-specific
 * optimizations based on development or production mode.
 */
class BuildModeManager {
    /**
     * Get build mode configuration for specified mode
     */
    getBuildModeConfig(mode) {
        return mode === 'development'
            ? this.getDevelopmentConfig()
            : this.getProductionConfig();
    }
    /**
     * Get development mode configuration
     *
     * Development mode prioritizes:
     * - Fast build times
     * - Debugging capabilities
     * - Source maps
     * - Verbose error messages
     */
    getDevelopmentConfig() {
        return {
            mode: 'development',
            optimizations: {
                ios: {
                    swiftOptimization: 'none',
                    wholeModuleOptimization: false,
                    stripDebugSymbols: false,
                    enableBitcode: false,
                    deadCodeStripping: false,
                },
                android: {
                    kotlinOptimization: false,
                    minifyEnabled: false,
                    shrinkResources: false,
                    obfuscate: false,
                    debuggable: true,
                },
                web: {
                    minify: false,
                    treeShaking: false,
                    codeSplitting: false,
                    compression: 'none',
                    sourceMaps: 'inline',
                },
            },
            settings: {
                sourceMaps: true,
                minify: false,
                incremental: true,
                verbose: true,
            },
        };
    }
    /**
     * Get production mode configuration
     *
     * Production mode prioritizes:
     * - Optimized bundle sizes
     * - Performance
     * - Security (obfuscation)
     * - Minimal debug information
     */
    getProductionConfig() {
        return {
            mode: 'production',
            optimizations: {
                ios: {
                    swiftOptimization: 'speed',
                    wholeModuleOptimization: true,
                    stripDebugSymbols: true,
                    enableBitcode: true,
                    deadCodeStripping: true,
                },
                android: {
                    kotlinOptimization: true,
                    minifyEnabled: true,
                    shrinkResources: true,
                    obfuscate: true,
                    debuggable: false,
                },
                web: {
                    minify: true,
                    treeShaking: true,
                    codeSplitting: true,
                    compression: 'brotli',
                    sourceMaps: 'external',
                },
            },
            settings: {
                sourceMaps: false,
                minify: true,
                incremental: false,
                verbose: false,
            },
        };
    }
    /**
     * Apply build mode configuration to build config
     */
    applyBuildMode(config, modeConfig) {
        return {
            ...config,
            mode: modeConfig.mode,
            sourceMaps: modeConfig.settings.sourceMaps,
            minify: modeConfig.settings.minify,
            incremental: modeConfig.settings.incremental,
        };
    }
    /**
     * Get platform-specific optimizations for a platform
     */
    getPlatformOptimizations(mode, platform) {
        const config = this.getBuildModeConfig(mode);
        return config.optimizations[platform];
    }
    /**
     * Validate build mode configuration
     */
    validateBuildMode(config) {
        const errors = [];
        const warnings = [];
        // Validate mode is set
        if (!config.mode) {
            errors.push('Build mode must be specified (development or production)');
        }
        // Validate mode-specific settings
        if (config.mode === 'production') {
            if (config.sourceMaps && config.minify) {
                warnings.push('Source maps enabled in production mode may expose source code');
            }
            if (!config.minify) {
                warnings.push('Minification disabled in production mode - bundle sizes will be larger');
            }
            if (config.incremental) {
                warnings.push('Incremental builds in production mode may not apply all optimizations');
            }
        }
        if (config.mode === 'development') {
            if (config.minify) {
                warnings.push('Minification enabled in development mode - debugging will be harder');
            }
            if (!config.sourceMaps) {
                warnings.push('Source maps disabled in development mode - debugging will be limited');
            }
        }
        return {
            valid: errors.length === 0,
            errors,
            warnings,
        };
    }
    /**
     * Get build mode description
     */
    getBuildModeDescription(mode) {
        if (mode === 'development') {
            return 'Development mode: Fast builds, debugging enabled, no optimizations';
        }
        return 'Production mode: Optimized builds, minification, performance focused';
    }
    /**
     * Compare two build modes
     */
    compareBuildModes(mode1, mode2) {
        if (mode1 === mode2) {
            return { same: true, differences: [] };
        }
        const config1 = this.getBuildModeConfig(mode1);
        const config2 = this.getBuildModeConfig(mode2);
        const differences = [];
        // Compare settings
        if (config1.settings.sourceMaps !== config2.settings.sourceMaps) {
            differences.push(`Source maps: ${config1.settings.sourceMaps} vs ${config2.settings.sourceMaps}`);
        }
        if (config1.settings.minify !== config2.settings.minify) {
            differences.push(`Minification: ${config1.settings.minify} vs ${config2.settings.minify}`);
        }
        if (config1.settings.incremental !== config2.settings.incremental) {
            differences.push(`Incremental builds: ${config1.settings.incremental} vs ${config2.settings.incremental}`);
        }
        return {
            same: false,
            differences,
        };
    }
}
exports.BuildModeManager = BuildModeManager;
//# sourceMappingURL=BuildMode.js.map