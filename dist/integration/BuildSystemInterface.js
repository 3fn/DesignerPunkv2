"use strict";
/**
 * Build System Integration Interface
 *
 * Provides standardized interface for integrating the Mathematical Token System
 * with various build systems (webpack, rollup, vite, etc.). Enables seamless
 * platform file selection and build-time optimization.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildSystemIntegration = void 0;
/**
 * Build system integration implementation
 */
class BuildSystemIntegration {
    constructor() {
        this.config = null;
        this.generatedFiles = new Map();
    }
    configure(config) {
        const validation = this.validateConfig(config);
        if (!validation.valid) {
            throw new Error(`Invalid build configuration: ${validation.errors.join(', ')}`);
        }
        this.config = config;
    }
    async generateForBuild(platforms) {
        if (!this.config) {
            return {
                success: false,
                files: [],
                entryPoints: new Map(),
                buildConfig: {},
                warnings: [],
                error: 'Build system not configured. Call configure() first.'
            };
        }
        const warnings = [];
        const files = [];
        const entryPoints = new Map();
        try {
            // Generate files for each platform
            for (const platform of platforms) {
                const file = await this.generatePlatformFile(platform);
                files.push(file);
                this.generatedFiles.set(platform, file);
                entryPoints.set(platform, file.filePath);
            }
            // Generate build system specific configuration
            const buildConfig = this.generateBuildConfig(platforms);
            return {
                success: true,
                files,
                entryPoints,
                buildConfig,
                warnings
            };
        }
        catch (error) {
            return {
                success: false,
                files,
                entryPoints,
                buildConfig: {},
                warnings,
                error: error instanceof Error ? error.message : 'Unknown error during build integration'
            };
        }
    }
    getEntryPoint(platform) {
        const file = this.generatedFiles.get(platform);
        if (!file) {
            throw new Error(`No entry point found for platform: ${platform}. Generate files first.`);
        }
        return file.filePath;
    }
    getBuildConfig() {
        if (!this.config) {
            throw new Error('Build system not configured. Call configure() first.');
        }
        return this.generateBuildConfig(this.config.targets);
    }
    validateConfig(config) {
        const errors = [];
        if (!config.system) {
            errors.push('Build system type is required');
        }
        if (!config.targets || config.targets.length === 0) {
            errors.push('At least one target platform is required');
        }
        if (config.targets) {
            const validPlatforms = ['web', 'ios', 'android'];
            for (const target of config.targets) {
                if (!validPlatforms.includes(target)) {
                    errors.push(`Invalid target platform: ${target}`);
                }
            }
        }
        if (config.outputDir && typeof config.outputDir !== 'string') {
            errors.push('Output directory must be a string');
        }
        return {
            valid: errors.length === 0,
            errors
        };
    }
    async generatePlatformFile(platform) {
        // This would integrate with TranslationCoordinator in real implementation
        // For now, return a mock structure
        const fileExtensions = {
            web: 'js',
            ios: 'swift',
            android: 'kt'
        };
        const formats = {
            web: 'javascript',
            ios: 'swift',
            android: 'kotlin'
        };
        const outputDir = this.config?.outputDir || 'dist/tokens';
        const filePattern = this.config?.filePattern || 'DesignTokens.{platform}.{ext}';
        const fileName = filePattern
            .replace('{platform}', platform)
            .replace('{ext}', fileExtensions[platform]);
        return {
            platform,
            filePath: `${outputDir}/${fileName}`,
            content: `// Generated tokens for ${platform}`,
            format: formats[platform],
            tokenCount: 0,
            validationStatus: 'valid'
        };
    }
    generateBuildConfig(platforms) {
        if (!this.config) {
            return {};
        }
        const { system, treeShaking, sourceMaps } = this.config;
        switch (system) {
            case 'webpack':
                return this.generateWebpackConfig(platforms, treeShaking, sourceMaps);
            case 'rollup':
                return this.generateRollupConfig(platforms, treeShaking, sourceMaps);
            case 'vite':
                return this.generateViteConfig(platforms, treeShaking, sourceMaps);
            case 'esbuild':
                return this.generateEsbuildConfig(platforms, treeShaking, sourceMaps);
            default:
                return {};
        }
    }
    generateWebpackConfig(platforms, treeShaking, sourceMaps) {
        return {
            resolve: {
                alias: this.generateAliases(platforms)
            },
            optimization: {
                usedExports: treeShaking !== false,
                sideEffects: false
            },
            devtool: sourceMaps ? 'source-map' : false
        };
    }
    generateRollupConfig(platforms, treeShaking, sourceMaps) {
        return {
            treeshake: treeShaking !== false,
            sourcemap: sourceMaps !== false,
            external: this.generateExternals(platforms)
        };
    }
    generateViteConfig(platforms, treeShaking, sourceMaps) {
        return {
            resolve: {
                alias: this.generateAliases(platforms)
            },
            build: {
                sourcemap: sourceMaps !== false,
                rollupOptions: {
                    treeshake: treeShaking !== false
                }
            }
        };
    }
    generateEsbuildConfig(platforms, treeShaking, sourceMaps) {
        return {
            alias: this.generateAliases(platforms),
            treeShaking: treeShaking !== false,
            sourcemap: sourceMaps !== false
        };
    }
    generateAliases(platforms) {
        const aliases = {};
        for (const platform of platforms) {
            const file = this.generatedFiles.get(platform);
            if (file) {
                aliases[`@tokens/${platform}`] = file.filePath;
            }
        }
        return aliases;
    }
    generateExternals(platforms) {
        return platforms.map(platform => `@tokens/${platform}`);
    }
}
exports.BuildSystemIntegration = BuildSystemIntegration;
//# sourceMappingURL=BuildSystemInterface.js.map