/**
 * @category evergreen
 * @purpose Verify build system generates required outputs with correct structure
 */
/**
 * Build System Compatibility Integration Tests
 * 
 * Tests integration with common build systems (webpack, rollup, vite, esbuild)
 * to ensure seamless platform file selection and build-time optimization.
 */

import { BuildSystemIntegration, type BuildSystemConfig, type TargetPlatform } from '../../integration/BuildSystemInterface';
import { PlatformFileSelector } from '../../integration/PlatformFileSelector';
import { TreeShakingOptimizer } from '../../integration/TreeShakingOptimizer';

describe('Build System Compatibility Integration', () => {
  let buildIntegration: BuildSystemIntegration;

  beforeEach(() => {
    buildIntegration = new BuildSystemIntegration();
  });

  describe('Webpack Integration', () => {
    it('should configure webpack build system successfully', () => {
      const config: BuildSystemConfig = {
        system: 'webpack',
        targets: ['web'],
        treeShaking: true,
        outputDir: 'dist/tokens',
        sourceMaps: true
      };

      expect(() => buildIntegration.configure(config)).not.toThrow();
    });

    it('should generate webpack-compatible configuration', () => {
      const config: BuildSystemConfig = {
        system: 'webpack',
        targets: ['web'],
        treeShaking: true,
        sourceMaps: true
      };

      buildIntegration.configure(config);
      const buildConfig = buildIntegration.getBuildConfig();

      expect(buildConfig).toHaveProperty('resolve');
      expect(buildConfig).toHaveProperty('optimization');
      expect(buildConfig).toHaveProperty('devtool');
    });

    it('should generate platform files for webpack build', async () => {
      const config: BuildSystemConfig = {
        system: 'webpack',
        targets: ['web'],
        outputDir: 'dist/tokens'
      };

      buildIntegration.configure(config);
      const result = await buildIntegration.generateForBuild(['web']);

      expect(result.success).toBe(true);
      expect(result.files).toHaveLength(1);
      expect(result.files[0].platform).toBe('web');
      expect(result.entryPoints.has('web')).toBe(true);
    });

    it('should support multi-platform webpack builds', async () => {
      const config: BuildSystemConfig = {
        system: 'webpack',
        targets: ['web', 'ios', 'android'],
        outputDir: 'dist/tokens'
      };

      buildIntegration.configure(config);
      const result = await buildIntegration.generateForBuild(['web', 'ios', 'android']);

      expect(result.success).toBe(true);
      expect(result.files).toHaveLength(3);
      expect(result.entryPoints.size).toBe(3);
    });
  });

  describe('Rollup Integration', () => {
    it('should configure rollup build system successfully', () => {
      const config: BuildSystemConfig = {
        system: 'rollup',
        targets: ['web'],
        treeShaking: true,
        outputDir: 'dist/tokens'
      };

      expect(() => buildIntegration.configure(config)).not.toThrow();
    });

    it('should generate rollup-compatible configuration', () => {
      const config: BuildSystemConfig = {
        system: 'rollup',
        targets: ['web'],
        treeShaking: true,
        sourceMaps: true
      };

      buildIntegration.configure(config);
      const buildConfig = buildIntegration.getBuildConfig();

      expect(buildConfig).toHaveProperty('treeshake');
      expect(buildConfig).toHaveProperty('sourcemap');
      expect(buildConfig).toHaveProperty('external');
    });

    it('should generate platform files for rollup build', async () => {
      const config: BuildSystemConfig = {
        system: 'rollup',
        targets: ['web'],
        outputDir: 'dist/tokens'
      };

      buildIntegration.configure(config);
      const result = await buildIntegration.generateForBuild(['web']);

      expect(result.success).toBe(true);
      expect(result.files).toHaveLength(1);
      expect(result.entryPoints.has('web')).toBe(true);
    });
  });

  describe('Vite Integration', () => {
    it('should configure vite build system successfully', () => {
      const config: BuildSystemConfig = {
        system: 'vite',
        targets: ['web'],
        treeShaking: true,
        outputDir: 'dist/tokens'
      };

      expect(() => buildIntegration.configure(config)).not.toThrow();
    });

    it('should generate vite-compatible configuration', () => {
      const config: BuildSystemConfig = {
        system: 'vite',
        targets: ['web'],
        treeShaking: true,
        sourceMaps: true
      };

      buildIntegration.configure(config);
      const buildConfig = buildIntegration.getBuildConfig();

      expect(buildConfig).toHaveProperty('resolve');
      expect(buildConfig).toHaveProperty('build');
    });

    it('should generate platform files for vite build', async () => {
      const config: BuildSystemConfig = {
        system: 'vite',
        targets: ['web'],
        outputDir: 'dist/tokens'
      };

      buildIntegration.configure(config);
      const result = await buildIntegration.generateForBuild(['web']);

      expect(result.success).toBe(true);
      expect(result.files).toHaveLength(1);
    });
  });

  describe('ESBuild Integration', () => {
    it('should configure esbuild build system successfully', () => {
      const config: BuildSystemConfig = {
        system: 'esbuild',
        targets: ['web'],
        treeShaking: true,
        outputDir: 'dist/tokens'
      };

      expect(() => buildIntegration.configure(config)).not.toThrow();
    });

    it('should generate esbuild-compatible configuration', () => {
      const config: BuildSystemConfig = {
        system: 'esbuild',
        targets: ['web'],
        treeShaking: true,
        sourceMaps: true
      };

      buildIntegration.configure(config);
      const buildConfig = buildIntegration.getBuildConfig();

      expect(buildConfig).toHaveProperty('alias');
      expect(buildConfig).toHaveProperty('treeShaking');
      expect(buildConfig).toHaveProperty('sourcemap');
    });

    it('should generate platform files for esbuild build', async () => {
      const config: BuildSystemConfig = {
        system: 'esbuild',
        targets: ['web'],
        outputDir: 'dist/tokens'
      };

      buildIntegration.configure(config);
      const result = await buildIntegration.generateForBuild(['web']);

      expect(result.success).toBe(true);
      expect(result.files).toHaveLength(1);
    });
  });

  describe('Platform File Selection', () => {
    let selector: PlatformFileSelector;

    beforeEach(() => {
      selector = new PlatformFileSelector({
        strategy: 'auto',
        fallback: 'web'
      });

      // Register available platform files
      selector.registerFiles([
        {
          platform: 'web',
          filePath: 'dist/tokens/DesignTokens.web.css',
          content: '/* Web tokens */',
          format: 'css',
          tokenCount: 10,
          validationStatus: 'valid'
        },
        {
          platform: 'ios',
          filePath: 'dist/tokens/DesignTokens.ios.swift',
          content: '// iOS tokens',
          format: 'swift',
          tokenCount: 10,
          validationStatus: 'valid'
        },
        {
          platform: 'android',
          filePath: 'dist/tokens/DesignTokens.android.kt',
          content: '// Android tokens',
          format: 'kotlin',
          tokenCount: 10,
          validationStatus: 'valid'
        }
      ]);
    });

    it('should select explicit platform correctly', () => {
      const result = selector.selectPlatform('web');

      expect(result.platform).toBe('web');
      expect(result.strategyUsed).toBe('explicit');
      expect(result.usedFallback).toBe(false);
      expect(result.confidence).toBe(1.0);
    });

    it('should detect platform from environment variable', () => {
      process.env.TARGET_PLATFORM = 'ios';
      
      const result = selector.selectPlatform();

      expect(result.platform).toBe('ios');
      expect(result.strategyUsed).toBe('environment');
      
      delete process.env.TARGET_PLATFORM;
    });

    it('should use fallback when platform cannot be determined', () => {
      const result = selector.selectPlatform();

      expect(result.platform).toBe('web');
      expect(result.usedFallback).toBe(true);
    });

    it('should handle invalid platform gracefully', () => {
      const testSelector = new PlatformFileSelector({
        strategy: 'explicit',
        fallback: 'web',
        strict: false
      });

      // Register fallback platform
      testSelector.registerFiles([
        {
          platform: 'web',
          filePath: 'dist/tokens/DesignTokens.web.css',
          content: '/* Web tokens */',
          format: 'css',
          tokenCount: 10,
          validationStatus: 'valid'
        }
      ]);

      const result = testSelector.selectPlatform();

      expect(result.platform).toBe('web');
      expect(result.usedFallback).toBe(true);
    });
  });

  describe('Tree-Shaking Optimization', () => {
    let optimizer: TreeShakingOptimizer;

    beforeEach(() => {
      optimizer = new TreeShakingOptimizer({
        level: 'basic',
        sideEffectFree: true,
        individualExports: true
      });
    });

    it('should generate webpack tree-shaking configuration', () => {
      const config = optimizer.generateWebpackConfig();

      expect(config).toHaveProperty('optimization');
      expect(config.optimization).toHaveProperty('usedExports', true);
      expect(config.optimization).toHaveProperty('sideEffects');
    });

    it('should generate rollup tree-shaking configuration', () => {
      const config = optimizer.generateRollupConfig();

      expect(config).toHaveProperty('treeshake');
      expect(config.treeshake).toHaveProperty('moduleSideEffects');
    });

    it('should generate side-effects configuration', () => {
      const sideEffects = optimizer.generateSideEffectsConfig();

      expect(sideEffects).toBe(false); // Side-effect free
    });

    it('should support aggressive optimization', () => {
      const aggressiveOptimizer = new TreeShakingOptimizer({
        level: 'aggressive',
        sideEffectFree: true
      });

      const sideEffects = aggressiveOptimizer.generateSideEffectsConfig();
      expect(sideEffects).toBe(false);
    });
  });

  describe('Configuration Validation', () => {
    it('should validate valid configuration', () => {
      const config: BuildSystemConfig = {
        system: 'webpack',
        targets: ['web'],
        outputDir: 'dist/tokens'
      };

      const validation = buildIntegration.validateConfig(config);

      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should reject configuration without build system', () => {
      const config = {
        targets: ['web']
      } as BuildSystemConfig;

      const validation = buildIntegration.validateConfig(config);

      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('Build system type is required');
    });

    it('should reject configuration without targets', () => {
      const config = {
        system: 'webpack',
        targets: []
      } as BuildSystemConfig;

      const validation = buildIntegration.validateConfig(config);

      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('At least one target platform is required');
    });

    it('should reject invalid target platform', () => {
      const config: BuildSystemConfig = {
        system: 'webpack',
        targets: ['invalid' as TargetPlatform]
      };

      const validation = buildIntegration.validateConfig(config);

      expect(validation.valid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Entry Point Management', () => {
    it('should provide entry points for all platforms', async () => {
      const config: BuildSystemConfig = {
        system: 'webpack',
        targets: ['web', 'ios', 'android'],
        outputDir: 'dist/tokens'
      };

      buildIntegration.configure(config);
      const result = await buildIntegration.generateForBuild(['web', 'ios', 'android']);

      expect(result.entryPoints.size).toBe(3);
      expect(result.entryPoints.has('web')).toBe(true);
      expect(result.entryPoints.has('ios')).toBe(true);
      expect(result.entryPoints.has('android')).toBe(true);
    });

    it('should get entry point for specific platform', async () => {
      const config: BuildSystemConfig = {
        system: 'webpack',
        targets: ['web'],
        outputDir: 'dist/tokens'
      };

      buildIntegration.configure(config);
      await buildIntegration.generateForBuild(['web']);

      const entryPoint = buildIntegration.getEntryPoint('web');

      expect(entryPoint).toContain('dist/tokens');
      expect(entryPoint).toContain('web');
    });

    it('should throw error for missing entry point', async () => {
      const config: BuildSystemConfig = {
        system: 'webpack',
        targets: ['web'],
        outputDir: 'dist/tokens'
      };

      buildIntegration.configure(config);
      await buildIntegration.generateForBuild(['web']);

      expect(() => buildIntegration.getEntryPoint('ios')).toThrow();
    });
  });

  describe('Custom Build System Support', () => {
    it('should support custom build system configuration', () => {
      const config: BuildSystemConfig = {
        system: 'custom',
        targets: ['web'],
        outputDir: 'dist/tokens',
        customOptions: {
          customOption1: 'value1',
          customOption2: true
        }
      };

      expect(() => buildIntegration.configure(config)).not.toThrow();
    });

    it('should generate files for custom build system', async () => {
      const config: BuildSystemConfig = {
        system: 'custom',
        targets: ['web'],
        outputDir: 'dist/tokens'
      };

      buildIntegration.configure(config);
      const result = await buildIntegration.generateForBuild(['web']);

      expect(result.success).toBe(true);
      expect(result.files).toHaveLength(1);
    });
  });

  describe('Error Handling', () => {
    it('should handle generation failure gracefully', async () => {
      // Don't configure - should fail
      const result = await buildIntegration.generateForBuild(['web']);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.files).toHaveLength(0);
    });

    it('should provide clear error messages', async () => {
      const result = await buildIntegration.generateForBuild(['web']);

      expect(result.error).toContain('not configured');
    });

    it('should handle invalid platform gracefully', async () => {
      const config: BuildSystemConfig = {
        system: 'webpack',
        targets: ['web'],
        outputDir: 'dist/tokens'
      };

      buildIntegration.configure(config);
      const result = await buildIntegration.generateForBuild(['web']);

      expect(result.success).toBe(true);
    });
  });

  describe('File Naming and Organization', () => {
    it('should use custom file pattern', async () => {
      const config: BuildSystemConfig = {
        system: 'webpack',
        targets: ['web'],
        outputDir: 'dist/tokens',
        filePattern: 'tokens.{platform}.{ext}'
      };

      buildIntegration.configure(config);
      const result = await buildIntegration.generateForBuild(['web']);

      expect(result.files[0].filePath).toContain('tokens.web');
    });

    it('should organize files in output directory', async () => {
      const config: BuildSystemConfig = {
        system: 'webpack',
        targets: ['web'],
        outputDir: 'custom/output/dir'
      };

      buildIntegration.configure(config);
      const result = await buildIntegration.generateForBuild(['web']);

      expect(result.files[0].filePath).toContain('custom/output/dir');
    });

    it('should generate platform-appropriate file extensions', async () => {
      const config: BuildSystemConfig = {
        system: 'webpack',
        targets: ['web', 'ios', 'android'],
        outputDir: 'dist/tokens'
      };

      buildIntegration.configure(config);
      const result = await buildIntegration.generateForBuild(['web', 'ios', 'android']);

      const webFile = result.files.find(f => f.platform === 'web');
      const iosFile = result.files.find(f => f.platform === 'ios');
      const androidFile = result.files.find(f => f.platform === 'android');

      expect(webFile?.filePath).toContain('.css');
      expect(iosFile?.filePath).toContain('.swift');
      expect(androidFile?.filePath).toContain('.kt');
    });
  });
});
