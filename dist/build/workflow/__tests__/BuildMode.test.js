"use strict";
/**
 * Build Mode Tests
 *
 * Tests for build mode support including development and production
 * configurations, platform-specific optimizations, and validation.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const BuildMode_1 = require("../BuildMode");
describe('BuildModeManager', () => {
    let manager;
    beforeEach(() => {
        manager = new BuildMode_1.BuildModeManager();
    });
    describe('getBuildModeConfig', () => {
        it('should return development configuration for development mode', () => {
            const config = manager.getBuildModeConfig('development');
            expect(config.mode).toBe('development');
            expect(config.settings.sourceMaps).toBe(true);
            expect(config.settings.minify).toBe(false);
            expect(config.settings.incremental).toBe(true);
            expect(config.settings.verbose).toBe(true);
        });
        it('should return production configuration for production mode', () => {
            const config = manager.getBuildModeConfig('production');
            expect(config.mode).toBe('production');
            expect(config.settings.sourceMaps).toBe(false);
            expect(config.settings.minify).toBe(true);
            expect(config.settings.incremental).toBe(false);
            expect(config.settings.verbose).toBe(false);
        });
        it('should configure iOS optimizations for development mode', () => {
            const config = manager.getBuildModeConfig('development');
            expect(config.optimizations.ios.swiftOptimization).toBe('none');
            expect(config.optimizations.ios.wholeModuleOptimization).toBe(false);
            expect(config.optimizations.ios.stripDebugSymbols).toBe(false);
            expect(config.optimizations.ios.enableBitcode).toBe(false);
            expect(config.optimizations.ios.deadCodeStripping).toBe(false);
        });
        it('should configure iOS optimizations for production mode', () => {
            const config = manager.getBuildModeConfig('production');
            expect(config.optimizations.ios.swiftOptimization).toBe('speed');
            expect(config.optimizations.ios.wholeModuleOptimization).toBe(true);
            expect(config.optimizations.ios.stripDebugSymbols).toBe(true);
            expect(config.optimizations.ios.enableBitcode).toBe(true);
            expect(config.optimizations.ios.deadCodeStripping).toBe(true);
        });
        it('should configure Android optimizations for development mode', () => {
            const config = manager.getBuildModeConfig('development');
            expect(config.optimizations.android.kotlinOptimization).toBe(false);
            expect(config.optimizations.android.minifyEnabled).toBe(false);
            expect(config.optimizations.android.shrinkResources).toBe(false);
            expect(config.optimizations.android.obfuscate).toBe(false);
            expect(config.optimizations.android.debuggable).toBe(true);
        });
        it('should configure Android optimizations for production mode', () => {
            const config = manager.getBuildModeConfig('production');
            expect(config.optimizations.android.kotlinOptimization).toBe(true);
            expect(config.optimizations.android.minifyEnabled).toBe(true);
            expect(config.optimizations.android.shrinkResources).toBe(true);
            expect(config.optimizations.android.obfuscate).toBe(true);
            expect(config.optimizations.android.debuggable).toBe(false);
        });
        it('should configure Web optimizations for development mode', () => {
            const config = manager.getBuildModeConfig('development');
            expect(config.optimizations.web.minify).toBe(false);
            expect(config.optimizations.web.treeShaking).toBe(false);
            expect(config.optimizations.web.codeSplitting).toBe(false);
            expect(config.optimizations.web.compression).toBe('none');
            expect(config.optimizations.web.sourceMaps).toBe('inline');
        });
        it('should configure Web optimizations for production mode', () => {
            const config = manager.getBuildModeConfig('production');
            expect(config.optimizations.web.minify).toBe(true);
            expect(config.optimizations.web.treeShaking).toBe(true);
            expect(config.optimizations.web.codeSplitting).toBe(true);
            expect(config.optimizations.web.compression).toBe('brotli');
            expect(config.optimizations.web.sourceMaps).toBe('external');
        });
    });
    describe('applyBuildMode', () => {
        it('should apply development mode settings to build config', () => {
            const baseConfig = {
                platforms: ['web'],
                mode: 'production',
                outputDir: './dist',
                parallel: false,
                incremental: false,
                sourceMaps: false,
                minify: true,
                validation: {
                    interfaces: true,
                    tokens: true,
                    mathematical: true,
                },
            };
            const modeConfig = manager.getBuildModeConfig('development');
            const result = manager.applyBuildMode(baseConfig, modeConfig);
            expect(result.mode).toBe('development');
            expect(result.sourceMaps).toBe(true);
            expect(result.minify).toBe(false);
            expect(result.incremental).toBe(true);
        });
        it('should apply production mode settings to build config', () => {
            const baseConfig = {
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
            const modeConfig = manager.getBuildModeConfig('production');
            const result = manager.applyBuildMode(baseConfig, modeConfig);
            expect(result.mode).toBe('production');
            expect(result.sourceMaps).toBe(false);
            expect(result.minify).toBe(true);
            expect(result.incremental).toBe(false);
        });
        it('should preserve other config properties', () => {
            const baseConfig = {
                platforms: ['ios', 'android', 'web'],
                mode: 'development',
                outputDir: './custom-dist',
                parallel: true,
                incremental: true,
                sourceMaps: true,
                minify: false,
                validation: {
                    interfaces: false,
                    tokens: true,
                    mathematical: false,
                },
            };
            const modeConfig = manager.getBuildModeConfig('production');
            const result = manager.applyBuildMode(baseConfig, modeConfig);
            expect(result.platforms).toEqual(['ios', 'android', 'web']);
            expect(result.outputDir).toBe('./custom-dist');
            expect(result.parallel).toBe(true);
            expect(result.validation).toEqual({
                interfaces: false,
                tokens: true,
                mathematical: false,
            });
        });
    });
    describe('getPlatformOptimizations', () => {
        it('should return iOS optimizations for development mode', () => {
            const opts = manager.getPlatformOptimizations('development', 'ios');
            expect(opts).toEqual({
                swiftOptimization: 'none',
                wholeModuleOptimization: false,
                stripDebugSymbols: false,
                enableBitcode: false,
                deadCodeStripping: false,
            });
        });
        it('should return iOS optimizations for production mode', () => {
            const opts = manager.getPlatformOptimizations('production', 'ios');
            expect(opts).toEqual({
                swiftOptimization: 'speed',
                wholeModuleOptimization: true,
                stripDebugSymbols: true,
                enableBitcode: true,
                deadCodeStripping: true,
            });
        });
        it('should return Android optimizations for development mode', () => {
            const opts = manager.getPlatformOptimizations('development', 'android');
            expect(opts).toEqual({
                kotlinOptimization: false,
                minifyEnabled: false,
                shrinkResources: false,
                obfuscate: false,
                debuggable: true,
            });
        });
        it('should return Android optimizations for production mode', () => {
            const opts = manager.getPlatformOptimizations('production', 'android');
            expect(opts).toEqual({
                kotlinOptimization: true,
                minifyEnabled: true,
                shrinkResources: true,
                obfuscate: true,
                debuggable: false,
            });
        });
        it('should return Web optimizations for development mode', () => {
            const opts = manager.getPlatformOptimizations('development', 'web');
            expect(opts).toEqual({
                minify: false,
                treeShaking: false,
                codeSplitting: false,
                compression: 'none',
                sourceMaps: 'inline',
            });
        });
        it('should return Web optimizations for production mode', () => {
            const opts = manager.getPlatformOptimizations('production', 'web');
            expect(opts).toEqual({
                minify: true,
                treeShaking: true,
                codeSplitting: true,
                compression: 'brotli',
                sourceMaps: 'external',
            });
        });
    });
    describe('validateBuildMode', () => {
        it('should validate valid development configuration', () => {
            const config = {
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
            const result = manager.validateBuildMode(config);
            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
        it('should validate valid production configuration', () => {
            const config = {
                platforms: ['web'],
                mode: 'production',
                outputDir: './dist',
                parallel: false,
                incremental: false,
                sourceMaps: false,
                minify: true,
                validation: {
                    interfaces: true,
                    tokens: true,
                    mathematical: true,
                },
            };
            const result = manager.validateBuildMode(config);
            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
        it('should warn about source maps in production with minification', () => {
            const config = {
                platforms: ['web'],
                mode: 'production',
                outputDir: './dist',
                parallel: false,
                incremental: false,
                sourceMaps: true,
                minify: true,
                validation: {
                    interfaces: true,
                    tokens: true,
                    mathematical: true,
                },
            };
            const result = manager.validateBuildMode(config);
            expect(result.valid).toBe(true);
            expect(result.warnings).toContain('Source maps enabled in production mode may expose source code');
        });
        it('should warn about disabled minification in production', () => {
            const config = {
                platforms: ['web'],
                mode: 'production',
                outputDir: './dist',
                parallel: false,
                incremental: false,
                sourceMaps: false,
                minify: false,
                validation: {
                    interfaces: true,
                    tokens: true,
                    mathematical: true,
                },
            };
            const result = manager.validateBuildMode(config);
            expect(result.valid).toBe(true);
            expect(result.warnings).toContain('Minification disabled in production mode - bundle sizes will be larger');
        });
        it('should warn about incremental builds in production', () => {
            const config = {
                platforms: ['web'],
                mode: 'production',
                outputDir: './dist',
                parallel: false,
                incremental: true,
                sourceMaps: false,
                minify: true,
                validation: {
                    interfaces: true,
                    tokens: true,
                    mathematical: true,
                },
            };
            const result = manager.validateBuildMode(config);
            expect(result.valid).toBe(true);
            expect(result.warnings).toContain('Incremental builds in production mode may not apply all optimizations');
        });
        it('should warn about minification in development', () => {
            const config = {
                platforms: ['web'],
                mode: 'development',
                outputDir: './dist',
                parallel: false,
                incremental: true,
                sourceMaps: true,
                minify: true,
                validation: {
                    interfaces: true,
                    tokens: true,
                    mathematical: true,
                },
            };
            const result = manager.validateBuildMode(config);
            expect(result.valid).toBe(true);
            expect(result.warnings).toContain('Minification enabled in development mode - debugging will be harder');
        });
        it('should warn about disabled source maps in development', () => {
            const config = {
                platforms: ['web'],
                mode: 'development',
                outputDir: './dist',
                parallel: false,
                incremental: true,
                sourceMaps: false,
                minify: false,
                validation: {
                    interfaces: true,
                    tokens: true,
                    mathematical: true,
                },
            };
            const result = manager.validateBuildMode(config);
            expect(result.valid).toBe(true);
            expect(result.warnings).toContain('Source maps disabled in development mode - debugging will be limited');
        });
    });
    describe('getBuildModeDescription', () => {
        it('should return description for development mode', () => {
            const description = manager.getBuildModeDescription('development');
            expect(description).toBe('Development mode: Fast builds, debugging enabled, no optimizations');
        });
        it('should return description for production mode', () => {
            const description = manager.getBuildModeDescription('production');
            expect(description).toBe('Production mode: Optimized builds, minification, performance focused');
        });
    });
    describe('compareBuildModes', () => {
        it('should identify same build modes', () => {
            const result = manager.compareBuildModes('development', 'development');
            expect(result.same).toBe(true);
            expect(result.differences).toHaveLength(0);
        });
        it('should identify different build modes', () => {
            const result = manager.compareBuildModes('development', 'production');
            expect(result.same).toBe(false);
            expect(result.differences.length).toBeGreaterThan(0);
        });
        it('should list specific differences between modes', () => {
            const result = manager.compareBuildModes('development', 'production');
            expect(result.differences).toContain('Source maps: true vs false');
            expect(result.differences).toContain('Minification: false vs true');
            expect(result.differences).toContain('Incremental builds: true vs false');
        });
    });
    describe('Integration scenarios', () => {
        it('should support switching from development to production', () => {
            const devConfig = {
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
            const prodModeConfig = manager.getBuildModeConfig('production');
            const prodConfig = manager.applyBuildMode(devConfig, prodModeConfig);
            expect(prodConfig.mode).toBe('production');
            expect(prodConfig.sourceMaps).toBe(false);
            expect(prodConfig.minify).toBe(true);
            expect(prodConfig.incremental).toBe(false);
        });
        it('should provide platform-specific optimizations for all platforms', () => {
            const platforms = [
                'ios',
                'android',
                'web',
            ];
            platforms.forEach((platform) => {
                const devOpts = manager.getPlatformOptimizations('development', platform);
                const prodOpts = manager.getPlatformOptimizations('production', platform);
                expect(devOpts).toBeDefined();
                expect(prodOpts).toBeDefined();
                expect(devOpts).not.toEqual(prodOpts);
            });
        });
        it('should validate mode-specific configurations correctly', () => {
            const devConfig = {
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
            const prodConfig = {
                ...devConfig,
                mode: 'production',
                incremental: false,
                sourceMaps: false,
                minify: true,
            };
            const devResult = manager.validateBuildMode(devConfig);
            const prodResult = manager.validateBuildMode(prodConfig);
            expect(devResult.valid).toBe(true);
            expect(prodResult.valid).toBe(true);
            expect(devResult.warnings.length).toBeLessThanOrEqual(prodResult.warnings.length);
        });
    });
});
//# sourceMappingURL=BuildMode.test.js.map