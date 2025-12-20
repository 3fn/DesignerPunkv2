/**
 * @category evergreen
 * @purpose Verify build system generates required outputs with correct structure
 */
/**
 * Tests for Build Configuration Helpers
 */

import { ConfigHelpers, ConfigTemplate, MigrationResult } from '../ConfigHelpers';
import { BuildConfig } from '../../types/BuildConfig';

describe('ConfigHelpers', () => {
  describe('createFromTemplate', () => {
    it('should create minimal configuration', () => {
      const config = ConfigHelpers.createFromTemplate('minimal');

      expect(config.platforms).toEqual(['web']);
      expect(config.mode).toBe('development');
      expect(config.incremental).toBe(false);
      expect(config.sourceMaps).toBe(false);
      expect(config.minify).toBe(false);
      expect(config.validation.interfaces).toBe(false);
    });

    it('should create development configuration', () => {
      const config = ConfigHelpers.createFromTemplate('development');

      expect(config.mode).toBe('development');
      expect(config.incremental).toBe(true);
      expect(config.sourceMaps).toBe(true);
      expect(config.minify).toBe(false);
      expect(config.validation.interfaces).toBe(true);
    });

    it('should create production configuration', () => {
      const config = ConfigHelpers.createFromTemplate('production');

      expect(config.mode).toBe('production');
      expect(config.parallel).toBe(true);
      expect(config.incremental).toBe(false);
      expect(config.sourceMaps).toBe(false);
      expect(config.minify).toBe(true);
    });

    it('should create all-platforms configuration', () => {
      const config = ConfigHelpers.createFromTemplate('all-platforms');

      expect(config.platforms).toEqual(['ios', 'android', 'web']);
      expect(config.ios).toBeDefined();
      expect(config.android).toBeDefined();
      expect(config.web).toBeDefined();
      expect(config.ios?.swiftVersion).toBe('5.9');
      expect(config.android?.kotlinVersion).toBe('1.9.0');
      expect(config.web?.target).toBe('es2021');
    });

    it('should create iOS-only configuration', () => {
      const config = ConfigHelpers.createFromTemplate('ios-only');

      expect(config.platforms).toEqual(['ios']);
      expect(config.ios).toBeDefined();
      expect(config.android).toBeUndefined();
      expect(config.web).toBeUndefined();
    });

    it('should create Android-only configuration', () => {
      const config = ConfigHelpers.createFromTemplate('android-only');

      expect(config.platforms).toEqual(['android']);
      expect(config.ios).toBeUndefined();
      expect(config.android).toBeDefined();
      expect(config.web).toBeUndefined();
    });

    it('should create Web-only configuration', () => {
      const config = ConfigHelpers.createFromTemplate('web-only');

      expect(config.platforms).toEqual(['web']);
      expect(config.ios).toBeUndefined();
      expect(config.android).toBeUndefined();
      expect(config.web).toBeDefined();
    });

    it('should create mobile configuration', () => {
      const config = ConfigHelpers.createFromTemplate('mobile');

      expect(config.platforms).toEqual(['ios', 'android']);
      expect(config.ios).toBeDefined();
      expect(config.android).toBeDefined();
      expect(config.web).toBeUndefined();
    });

    it('should create CI/CD configuration', () => {
      const config = ConfigHelpers.createFromTemplate('ci-cd');

      expect(config.platforms).toEqual(['ios', 'android', 'web']);
      expect(config.mode).toBe('production');
      expect(config.parallel).toBe(true);
      expect(config.minify).toBe(true);
      expect(config.sourceMaps).toBe(false);
    });

    it('should apply overrides to template', () => {
      const config = ConfigHelpers.createFromTemplate('development', {
        outputDir: './custom-output',
        parallel: true,
      });

      expect(config.outputDir).toBe('./custom-output');
      expect(config.parallel).toBe(true);
      expect(config.mode).toBe('development'); // Base template value preserved
    });

    it('should merge validation options correctly', () => {
      const config = ConfigHelpers.createFromTemplate('development', {
        validation: {
          interfaces: false,
          tokens: true,
          mathematical: false,
        },
      });

      expect(config.validation.interfaces).toBe(false);
      expect(config.validation.tokens).toBe(true);
      expect(config.validation.mathematical).toBe(false);
    });

    it('should throw error for unknown template', () => {
      expect(() => {
        ConfigHelpers.createFromTemplate('unknown' as ConfigTemplate);
      }).toThrow('Unknown template: unknown');
    });
  });

  describe('validateConfiguration', () => {
    it('should validate valid configuration', () => {
      const config: BuildConfig = {
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

      const result = ConfigHelpers.validateConfiguration(config);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing platforms', () => {
      const config: Partial<BuildConfig> = {
        mode: 'development',
        outputDir: './dist',
      };

      const result = ConfigHelpers.validateConfiguration(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('platforms: At least one platform must be specified');
    });

    it('should detect missing mode', () => {
      const config: Partial<BuildConfig> = {
        platforms: ['web'],
        outputDir: './dist',
      };

      const result = ConfigHelpers.validateConfiguration(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('mode: Build mode must be specified (development or production)');
    });

    it('should detect missing output directory', () => {
      const config: Partial<BuildConfig> = {
        platforms: ['web'],
        mode: 'development',
      };

      const result = ConfigHelpers.validateConfiguration(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('outputDir: Output directory must be specified');
    });

    it('should warn about missing iOS options', () => {
      const config: Partial<BuildConfig> = {
        platforms: ['ios'],
        mode: 'development',
        outputDir: './dist',
      };

      const result = ConfigHelpers.validateConfiguration(config);

      expect(result.warnings).toContain('ios: iOS platform selected but no iOS-specific options provided');
    });

    it('should warn about missing Android options', () => {
      const config: Partial<BuildConfig> = {
        platforms: ['android'],
        mode: 'development',
        outputDir: './dist',
      };

      const result = ConfigHelpers.validateConfiguration(config);

      expect(result.warnings).toContain('android: Android platform selected but no Android-specific options provided');
    });

    it('should warn about missing Web options', () => {
      const config: Partial<BuildConfig> = {
        platforms: ['web'],
        mode: 'development',
        outputDir: './dist',
      };

      const result = ConfigHelpers.validateConfiguration(config);

      expect(result.warnings).toContain('web: Web platform selected but no Web-specific options provided');
    });

    it('should validate iOS options', () => {
      const config: Partial<BuildConfig> = {
        platforms: ['ios'],
        mode: 'development',
        outputDir: './dist',
        ios: {
          swiftVersion: '',
          minimumDeploymentTarget: '',
          dependencies: [],
        },
      };

      const result = ConfigHelpers.validateConfiguration(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('ios.swiftVersion: Swift version must be specified');
      expect(result.errors).toContain('ios.minimumDeploymentTarget: Minimum deployment target must be specified');
    });

    it('should validate Android options', () => {
      const config: Partial<BuildConfig> = {
        platforms: ['android'],
        mode: 'development',
        outputDir: './dist',
        android: {
          kotlinVersion: '',
          minSdkVersion: 20,
          targetSdkVersion: 0,
          dependencies: [],
        },
      };

      const result = ConfigHelpers.validateConfiguration(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('android.kotlinVersion: Kotlin version must be specified');
      expect(result.errors).toContain('android.minSdkVersion: Minimum SDK version must be >= 21');
    });

    it('should validate Android SDK version relationship', () => {
      const config: Partial<BuildConfig> = {
        platforms: ['android'],
        mode: 'development',
        outputDir: './dist',
        android: {
          kotlinVersion: '1.9.0',
          minSdkVersion: 30,
          targetSdkVersion: 24,
          dependencies: [],
        },
      };

      const result = ConfigHelpers.validateConfiguration(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('android.minSdkVersion: Cannot be greater than targetSdkVersion');
    });

    it('should validate Web options', () => {
      const config: Partial<BuildConfig> = {
        platforms: ['web'],
        mode: 'development',
        outputDir: './dist',
        web: {
          target: 'invalid' as any,
          formats: [],
          externals: [],
        },
      };

      const result = ConfigHelpers.validateConfiguration(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("web.target: Invalid target 'invalid'. Valid values: es2020, es2021, esnext");
      expect(result.errors).toContain('web.formats: At least one output format must be specified');
    });

    it('should provide production mode recommendations', () => {
      const config: Partial<BuildConfig> = {
        platforms: ['web'],
        mode: 'production',
        outputDir: './dist',
        sourceMaps: true,
        minify: false,
        parallel: false,
      };

      const result = ConfigHelpers.validateConfiguration(config);

      expect(result.warnings).toContain('sourceMaps: Consider disabling source maps in production for smaller bundles');
      expect(result.warnings).toContain('minify: Consider enabling minification in production for smaller bundles');
      expect(result.warnings).toContain('parallel: Consider enabling parallel builds in production for faster builds');
    });

    it('should provide development mode recommendations', () => {
      const config: Partial<BuildConfig> = {
        platforms: ['web'],
        mode: 'development',
        outputDir: './dist',
        incremental: false,
        sourceMaps: false,
      };

      const result = ConfigHelpers.validateConfiguration(config);

      expect(result.warnings).toContain('incremental: Consider enabling incremental builds in development for faster iteration');
      expect(result.warnings).toContain('sourceMaps: Consider enabling source maps in development for easier debugging');
    });
  });

  describe('migrateConfiguration', () => {
    it('should migrate platform to platforms array', () => {
      const oldConfig = {
        platform: 'web',
        mode: 'development',
        outputDir: './dist',
      };

      const result = ConfigHelpers.migrateConfiguration(oldConfig);

      expect(result.success).toBe(true);
      expect(result.config.platforms).toEqual(['web']);
      expect(result.changes).toContain("Migrated 'platform' to 'platforms' array");
    });

    it('should migrate env to mode', () => {
      const oldConfig = {
        platforms: ['web'],
        env: 'production',
        outputDir: './dist',
      };

      const result = ConfigHelpers.migrateConfiguration(oldConfig);

      expect(result.success).toBe(true);
      expect(result.config.mode).toBe('production');
      expect(result.changes).toContain("Migrated 'env: production' to 'mode: production'");
    });

    it('should migrate output to outputDir', () => {
      const oldConfig = {
        platforms: ['web'],
        mode: 'development',
        output: './build',
      };

      const result = ConfigHelpers.migrateConfiguration(oldConfig);

      expect(result.success).toBe(true);
      expect(result.config.outputDir).toBe('./build');
      expect(result.changes).toContain("Migrated 'output' to 'outputDir'");
    });

    it('should migrate dist to outputDir', () => {
      const oldConfig = {
        platforms: ['web'],
        mode: 'development',
        dist: './public',
      };

      const result = ConfigHelpers.migrateConfiguration(oldConfig);

      expect(result.success).toBe(true);
      expect(result.config.outputDir).toBe('./public');
      expect(result.changes).toContain("Migrated 'dist' to 'outputDir'");
    });

    it('should migrate sourceMap to sourceMaps', () => {
      const oldConfig = {
        platforms: ['web'],
        mode: 'development',
        outputDir: './dist',
        sourceMap: true,
      };

      const result = ConfigHelpers.migrateConfiguration(oldConfig);

      expect(result.success).toBe(true);
      expect(result.config.sourceMaps).toBe(true);
      expect(result.changes).toContain("Migrated 'sourceMap' to 'sourceMaps'");
    });

    it('should migrate minimize to minify', () => {
      const oldConfig = {
        platforms: ['web'],
        mode: 'production',
        outputDir: './dist',
        minimize: true,
      };

      const result = ConfigHelpers.migrateConfiguration(oldConfig);

      expect(result.success).toBe(true);
      expect(result.config.minify).toBe(true);
      expect(result.changes).toContain("Migrated 'minimize' to 'minify'");
    });

    it('should migrate validate boolean to validation object', () => {
      const oldConfig = {
        platforms: ['web'],
        mode: 'development',
        outputDir: './dist',
        validate: true,
      };

      const result = ConfigHelpers.migrateConfiguration(oldConfig);

      expect(result.success).toBe(true);
      expect(result.config.validation.interfaces).toBe(true);
      expect(result.config.validation.tokens).toBe(true);
      expect(result.config.validation.mathematical).toBe(true);
      expect(result.changes).toContain("Migrated 'validate' boolean to 'validation' object");
    });

    it('should preserve platform-specific options', () => {
      const oldConfig = {
        platforms: ['ios'],
        mode: 'development',
        outputDir: './dist',
        ios: {
          swiftVersion: '5.9',
          minimumDeploymentTarget: '15.0',
          dependencies: [],
        },
      };

      const result = ConfigHelpers.migrateConfiguration(oldConfig);

      expect(result.success).toBe(true);
      expect(result.config.ios).toEqual({
        swiftVersion: '5.9',
        minimumDeploymentTarget: '15.0',
        dependencies: [],
      });
    });

    it('should handle migration errors gracefully', () => {
      const oldConfig = {
        platforms: ['ios'],
        mode: 'development',
        outputDir: './dist',
        ios: {
          // Missing required iOS fields
          swiftVersion: '',
          minimumDeploymentTarget: '',
          dependencies: [],
        },
      };

      const result = ConfigHelpers.migrateConfiguration(oldConfig);

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should include validation warnings in migration result', () => {
      const oldConfig = {
        platforms: ['ios'],
        mode: 'development',
        outputDir: './dist',
        // Missing iOS options
      };

      const result = ConfigHelpers.migrateConfiguration(oldConfig);

      expect(result.warnings).toContain('ios: iOS platform selected but no iOS-specific options provided');
    });
  });

  describe('getDocumentation', () => {
    it('should return documentation for all configuration fields', () => {
      const docs = ConfigHelpers.getDocumentation();

      expect(docs.length).toBeGreaterThan(0);
      
      const platformsDoc = docs.find(d => d.field === 'platforms');
      expect(platformsDoc).toBeDefined();
      expect(platformsDoc?.description).toBeTruthy();
      expect(platformsDoc?.type).toBe('Platform[]');
      expect(platformsDoc?.required).toBe(true);
    });

    it('should include examples for each field', () => {
      const docs = ConfigHelpers.getDocumentation();

      for (const doc of docs) {
        if (doc.examples) {
          expect(doc.examples.length).toBeGreaterThan(0);
        }
      }
    });

    it('should document all required fields', () => {
      const docs = ConfigHelpers.getDocumentation();
      const requiredFields = docs.filter(d => d.required);

      expect(requiredFields.length).toBeGreaterThan(0);
      expect(requiredFields.some(d => d.field === 'platforms')).toBe(true);
      expect(requiredFields.some(d => d.field === 'mode')).toBe(true);
      expect(requiredFields.some(d => d.field === 'outputDir')).toBe(true);
    });
  });

  describe('generateMarkdownDocs', () => {
    it('should generate markdown documentation', () => {
      const markdown = ConfigHelpers.generateMarkdownDocs();

      expect(markdown).toContain('# Build Configuration Reference');
      expect(markdown).toContain('## Configuration Fields');
      expect(markdown).toContain('### `platforms`');
      expect(markdown).toContain('**Description:**');
      expect(markdown).toContain('**Type:**');
      expect(markdown).toContain('**Default:**');
      expect(markdown).toContain('**Required:**');
    });

    it('should include examples in markdown', () => {
      const markdown = ConfigHelpers.generateMarkdownDocs();

      expect(markdown).toContain('**Examples:**');
      expect(markdown).toContain('```typescript');
    });

    it('should include constraints where applicable', () => {
      const markdown = ConfigHelpers.generateMarkdownDocs();

      expect(markdown).toContain('**Constraints:**');
    });
  });
});
