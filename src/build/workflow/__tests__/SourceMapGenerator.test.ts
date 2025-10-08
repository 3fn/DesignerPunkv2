/**
 * Tests for SourceMapGenerator
 */

import { SourceMapGenerator } from '../SourceMapGenerator';
import type { PlatformSourceMapConfig, SourceMapOptions } from '../SourceMapGenerator';

describe('SourceMapGenerator', () => {
  let generator: SourceMapGenerator;

  beforeEach(() => {
    generator = new SourceMapGenerator();
  });

  describe('iOS Source Map Generation', () => {
    it('should generate iOS source map with external format', () => {
      const config: PlatformSourceMapConfig = {
        platform: 'ios',
        options: {
          enabled: true,
          includeContent: true,
          format: 'external',
        },
        outputPath: '/output/ios',
        sourcePaths: ['src/tokens/SpacingTokens.ts', 'src/tokens/ColorTokens.ts'],
      };

      const result = generator.generateiOSSourceMap(config);

      expect(result.success).toBe(true);
      expect(result.platform).toBe('ios');
      expect(result.sourceMapPath).toBe('/output/ios/DesignTokens.dSYM');
      expect(result.sourceFiles).toEqual(config.sourcePaths);
      expect(result.error).toBeUndefined();
    });

    it('should generate iOS source map with inline format', () => {
      const config: PlatformSourceMapConfig = {
        platform: 'ios',
        options: {
          enabled: true,
          includeContent: true,
          format: 'inline',
        },
        outputPath: '/output/ios',
        sourcePaths: ['src/tokens/SpacingTokens.ts'],
      };

      const result = generator.generateiOSSourceMap(config);

      expect(result.success).toBe(true);
      expect(result.platform).toBe('ios');
      expect(result.inlineSourceMap).toBeDefined();
      expect(result.sourceMapPath).toBeUndefined();
      expect(result.sourceFiles).toEqual(config.sourcePaths);
    });

    it('should skip iOS source map generation when disabled', () => {
      const config: PlatformSourceMapConfig = {
        platform: 'ios',
        options: {
          enabled: false,
          includeContent: false,
          format: 'external',
        },
        outputPath: '/output/ios',
        sourcePaths: ['src/tokens/SpacingTokens.ts'],
      };

      const result = generator.generateiOSSourceMap(config);

      expect(result.success).toBe(true);
      expect(result.platform).toBe('ios');
      expect(result.sourceMapPath).toBeUndefined();
      expect(result.inlineSourceMap).toBeUndefined();
      expect(result.sourceFiles).toEqual([]);
    });
  });

  describe('Android Source Map Generation', () => {
    it('should generate Android source map with external format', () => {
      const config: PlatformSourceMapConfig = {
        platform: 'android',
        options: {
          enabled: true,
          includeContent: true,
          format: 'external',
        },
        outputPath: '/output/android',
        sourcePaths: ['src/tokens/SpacingTokens.ts', 'src/tokens/ColorTokens.ts'],
      };

      const result = generator.generateAndroidSourceMap(config);

      expect(result.success).toBe(true);
      expect(result.platform).toBe('android');
      expect(result.sourceMapPath).toBe('/output/android/DesignTokens.map');
      expect(result.sourceFiles).toEqual(config.sourcePaths);
      expect(result.error).toBeUndefined();
    });

    it('should generate Android source map with inline format', () => {
      const config: PlatformSourceMapConfig = {
        platform: 'android',
        options: {
          enabled: true,
          includeContent: true,
          format: 'inline',
        },
        outputPath: '/output/android',
        sourcePaths: ['src/tokens/SpacingTokens.ts'],
      };

      const result = generator.generateAndroidSourceMap(config);

      expect(result.success).toBe(true);
      expect(result.platform).toBe('android');
      expect(result.inlineSourceMap).toBeDefined();
      expect(result.sourceMapPath).toBeUndefined();
      expect(result.sourceFiles).toEqual(config.sourcePaths);
    });

    it('should skip Android source map generation when disabled', () => {
      const config: PlatformSourceMapConfig = {
        platform: 'android',
        options: {
          enabled: false,
          includeContent: false,
          format: 'external',
        },
        outputPath: '/output/android',
        sourcePaths: ['src/tokens/SpacingTokens.ts'],
      };

      const result = generator.generateAndroidSourceMap(config);

      expect(result.success).toBe(true);
      expect(result.platform).toBe('android');
      expect(result.sourceMapPath).toBeUndefined();
      expect(result.inlineSourceMap).toBeUndefined();
      expect(result.sourceFiles).toEqual([]);
    });
  });

  describe('Web Source Map Generation', () => {
    it('should generate Web source map with external format', () => {
      const config: PlatformSourceMapConfig = {
        platform: 'web',
        options: {
          enabled: true,
          includeContent: true,
          format: 'external',
        },
        outputPath: '/output/web',
        sourcePaths: ['src/tokens/SpacingTokens.ts', 'src/tokens/ColorTokens.ts'],
      };

      const result = generator.generateWebSourceMap(config);

      expect(result.success).toBe(true);
      expect(result.platform).toBe('web');
      expect(result.sourceMapPath).toBe('/output/web/tokens.js.map');
      expect(result.sourceFiles).toEqual(config.sourcePaths);
      expect(result.error).toBeUndefined();
    });

    it('should generate Web source map with inline format', () => {
      const config: PlatformSourceMapConfig = {
        platform: 'web',
        options: {
          enabled: true,
          includeContent: true,
          format: 'inline',
        },
        outputPath: '/output/web',
        sourcePaths: ['src/tokens/SpacingTokens.ts'],
      };

      const result = generator.generateWebSourceMap(config);

      expect(result.success).toBe(true);
      expect(result.platform).toBe('web');
      expect(result.inlineSourceMap).toBeDefined();
      expect(result.inlineSourceMap).toContain('//# sourceMappingURL=data:application/json');
      expect(result.sourceMapPath).toBeUndefined();
      expect(result.sourceFiles).toEqual(config.sourcePaths);
    });

    it('should skip Web source map generation when disabled', () => {
      const config: PlatformSourceMapConfig = {
        platform: 'web',
        options: {
          enabled: false,
          includeContent: false,
          format: 'external',
        },
        outputPath: '/output/web',
        sourcePaths: ['src/tokens/SpacingTokens.ts'],
      };

      const result = generator.generateWebSourceMap(config);

      expect(result.success).toBe(true);
      expect(result.platform).toBe('web');
      expect(result.sourceMapPath).toBeUndefined();
      expect(result.inlineSourceMap).toBeUndefined();
      expect(result.sourceFiles).toEqual([]);
    });

    it('should include source content when requested', () => {
      const config: PlatformSourceMapConfig = {
        platform: 'web',
        options: {
          enabled: true,
          includeContent: true,
          format: 'inline',
        },
        outputPath: '/output/web',
        sourcePaths: ['src/tokens/SpacingTokens.ts'],
      };

      const result = generator.generateWebSourceMap(config);

      expect(result.success).toBe(true);
      expect(result.inlineSourceMap).toBeDefined();
      // Inline source map should contain base64 encoded content
      expect(result.inlineSourceMap).toMatch(/base64,/);
    });
  });

  describe('Platform-Agnostic Generation', () => {
    it('should generate source map for specified platform', () => {
      const config: PlatformSourceMapConfig = {
        platform: 'ios',
        options: {
          enabled: true,
          includeContent: true,
          format: 'external',
        },
        outputPath: '/output/ios',
        sourcePaths: ['src/tokens/SpacingTokens.ts'],
      };

      const result = generator.generateSourceMap(config);

      expect(result.success).toBe(true);
      expect(result.platform).toBe('ios');
    });

    it('should generate source maps for multiple platforms', () => {
      const configs: PlatformSourceMapConfig[] = [
        {
          platform: 'ios',
          options: { enabled: true, includeContent: true, format: 'external' },
          outputPath: '/output/ios',
          sourcePaths: ['src/tokens/SpacingTokens.ts'],
        },
        {
          platform: 'android',
          options: { enabled: true, includeContent: true, format: 'external' },
          outputPath: '/output/android',
          sourcePaths: ['src/tokens/SpacingTokens.ts'],
        },
        {
          platform: 'web',
          options: { enabled: true, includeContent: true, format: 'external' },
          outputPath: '/output/web',
          sourcePaths: ['src/tokens/SpacingTokens.ts'],
        },
      ];

      const results = generator.generateSourceMaps(configs);

      expect(results).toHaveLength(3);
      expect(results[0].platform).toBe('ios');
      expect(results[1].platform).toBe('android');
      expect(results[2].platform).toBe('web');
      expect(results.every(r => r.success)).toBe(true);
    });
  });

  describe('Default Options', () => {
    it('should provide development mode defaults', () => {
      const options = generator.getDefaultOptions('web', 'development');

      expect(options.enabled).toBe(true);
      expect(options.includeContent).toBe(true);
      expect(options.format).toBe('external');
    });

    it('should provide production mode defaults', () => {
      const options = generator.getDefaultOptions('web', 'production');

      expect(options.enabled).toBe(true);
      expect(options.includeContent).toBe(false);
      expect(options.format).toBe('external');
    });

    it('should provide consistent defaults across platforms', () => {
      const iosOptions = generator.getDefaultOptions('ios', 'development');
      const androidOptions = generator.getDefaultOptions('android', 'development');
      const webOptions = generator.getDefaultOptions('web', 'development');

      expect(iosOptions).toEqual(androidOptions);
      expect(androidOptions).toEqual(webOptions);
    });
  });

  describe('Source Map Options', () => {
    it('should respect source root configuration', () => {
      const config: PlatformSourceMapConfig = {
        platform: 'web',
        options: {
          enabled: true,
          includeContent: true,
          format: 'inline',
          sourceRoot: '/custom/source/root',
        },
        outputPath: '/output/web',
        sourcePaths: ['src/tokens/SpacingTokens.ts'],
      };

      const result = generator.generateWebSourceMap(config);

      expect(result.success).toBe(true);
      // Source root should be included in generated source map
      expect(result.inlineSourceMap).toBeDefined();
    });

    it('should handle multiple source files', () => {
      const config: PlatformSourceMapConfig = {
        platform: 'web',
        options: {
          enabled: true,
          includeContent: true,
          format: 'external',
        },
        outputPath: '/output/web',
        sourcePaths: [
          'src/tokens/SpacingTokens.ts',
          'src/tokens/ColorTokens.ts',
          'src/tokens/TypographyTokens.ts',
        ],
      };

      const result = generator.generateWebSourceMap(config);

      expect(result.success).toBe(true);
      expect(result.sourceFiles).toHaveLength(3);
      expect(result.sourceFiles).toEqual(config.sourcePaths);
    });
  });

  describe('Error Handling', () => {
    it('should handle errors gracefully', () => {
      // Test with invalid configuration that might cause errors
      const config: PlatformSourceMapConfig = {
        platform: 'web',
        options: {
          enabled: true,
          includeContent: true,
          format: 'external',
        },
        outputPath: '',
        sourcePaths: [],
      };

      const result = generator.generateWebSourceMap(config);

      // Should still return a result, even if it fails
      expect(result.platform).toBe('web');
      expect(result.success).toBeDefined();
    });
  });

  describe('Cross-Platform Consistency', () => {
    it('should generate consistent source maps across platforms', () => {
      const sourcePaths = ['src/tokens/SpacingTokens.ts'];
      const outputPath = '/output';

      const iosConfig: PlatformSourceMapConfig = {
        platform: 'ios',
        options: { enabled: true, includeContent: true, format: 'external' },
        outputPath: `${outputPath}/ios`,
        sourcePaths,
      };

      const androidConfig: PlatformSourceMapConfig = {
        platform: 'android',
        options: { enabled: true, includeContent: true, format: 'external' },
        outputPath: `${outputPath}/android`,
        sourcePaths,
      };

      const webConfig: PlatformSourceMapConfig = {
        platform: 'web',
        options: { enabled: true, includeContent: true, format: 'external' },
        outputPath: `${outputPath}/web`,
        sourcePaths,
      };

      const iosResult = generator.generateiOSSourceMap(iosConfig);
      const androidResult = generator.generateAndroidSourceMap(androidConfig);
      const webResult = generator.generateWebSourceMap(webConfig);

      // All should succeed
      expect(iosResult.success).toBe(true);
      expect(androidResult.success).toBe(true);
      expect(webResult.success).toBe(true);

      // All should reference same source files
      expect(iosResult.sourceFiles).toEqual(sourcePaths);
      expect(androidResult.sourceFiles).toEqual(sourcePaths);
      expect(webResult.sourceFiles).toEqual(sourcePaths);
    });
  });
});
