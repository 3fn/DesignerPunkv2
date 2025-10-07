/**
 * Build Orchestrator Tests
 * 
 * Tests for the BuildOrchestrator implementation including:
 * - Configuration validation
 * - Platform selection logic
 * - Build status tracking
 * - Error handling
 */

import { BuildOrchestrator } from '../BuildOrchestrator';
import { BuildConfig, DEFAULT_BUILD_CONFIG } from '../types/BuildConfig';
import { Platform } from '../types/Platform';

describe('BuildOrchestrator', () => {
  let orchestrator: BuildOrchestrator;

  beforeEach(() => {
    orchestrator = new BuildOrchestrator();
  });

  describe('Configuration Validation', () => {
    it('should validate valid configuration', () => {
      const config: BuildConfig = {
        ...DEFAULT_BUILD_CONFIG,
        platforms: ['web'],
        outputDir: './dist',
      };

      const result = orchestrator.validateConfig(config);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject configuration with no platforms', () => {
      const config: BuildConfig = {
        ...DEFAULT_BUILD_CONFIG,
        platforms: [],
      };

      const result = orchestrator.validateConfig(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('At least one platform must be specified');
    });

    it('should reject configuration with invalid platforms', () => {
      const config: BuildConfig = {
        ...DEFAULT_BUILD_CONFIG,
        platforms: ['invalid' as Platform],
      };

      const result = orchestrator.validateConfig(config);

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Invalid platforms'))).toBe(true);
    });

    it('should reject configuration with invalid build mode', () => {
      const config: BuildConfig = {
        ...DEFAULT_BUILD_CONFIG,
        mode: 'invalid' as any,
      };

      const result = orchestrator.validateConfig(config);

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Invalid build mode'))).toBe(true);
    });

    it('should reject configuration with empty output directory', () => {
      const config: BuildConfig = {
        ...DEFAULT_BUILD_CONFIG,
        outputDir: '',
      };

      const result = orchestrator.validateConfig(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Output directory must be specified');
    });

    it('should validate iOS-specific options when iOS platform is selected', () => {
      const config: BuildConfig = {
        ...DEFAULT_BUILD_CONFIG,
        platforms: ['ios'],
        ios: {
          swiftVersion: '5.9',
          minimumDeploymentTarget: '15.0',
          dependencies: [],
        },
      };

      const result = orchestrator.validateConfig(config);

      expect(result.valid).toBe(true);
    });

    it('should reject iOS configuration without required options', () => {
      const config: BuildConfig = {
        ...DEFAULT_BUILD_CONFIG,
        platforms: ['ios'],
        ios: {} as any,
      };

      const result = orchestrator.validateConfig(config);

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('swiftVersion'))).toBe(true);
      expect(result.errors.some(e => e.includes('minimumDeploymentTarget'))).toBe(true);
    });

    it('should validate Android-specific options when Android platform is selected', () => {
      const config: BuildConfig = {
        ...DEFAULT_BUILD_CONFIG,
        platforms: ['android'],
        android: {
          kotlinVersion: '1.9.0',
          minSdkVersion: 24,
          targetSdkVersion: 34,
          dependencies: [],
        },
      };

      const result = orchestrator.validateConfig(config);

      expect(result.valid).toBe(true);
    });

    it('should reject Android configuration with invalid SDK versions', () => {
      const config: BuildConfig = {
        ...DEFAULT_BUILD_CONFIG,
        platforms: ['android'],
        android: {
          kotlinVersion: '1.9.0',
          minSdkVersion: 30,
          targetSdkVersion: 24,
          dependencies: [],
        },
      };

      const result = orchestrator.validateConfig(config);

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => 
        e.includes('minSdkVersion cannot be greater than targetSdkVersion')
      )).toBe(true);
    });

    it('should validate Web-specific options when Web platform is selected', () => {
      const config: BuildConfig = {
        ...DEFAULT_BUILD_CONFIG,
        platforms: ['web'],
        web: {
          target: 'es2020',
          formats: ['esm', 'cjs'],
          externals: [],
        },
      };

      const result = orchestrator.validateConfig(config);

      expect(result.valid).toBe(true);
    });

    it('should reject Web configuration with invalid target', () => {
      const config: BuildConfig = {
        ...DEFAULT_BUILD_CONFIG,
        platforms: ['web'],
        web: {
          target: 'invalid' as any,
          formats: ['esm'],
          externals: [],
        },
      };

      const result = orchestrator.validateConfig(config);

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Invalid web target'))).toBe(true);
    });

    it('should warn about source maps in production mode', () => {
      const config: BuildConfig = {
        ...DEFAULT_BUILD_CONFIG,
        mode: 'production',
        sourceMaps: true,
      };

      const result = orchestrator.validateConfig(config);

      expect(result.valid).toBe(true);
      expect(result.warnings.some(w => 
        w.includes('Source maps enabled in production mode')
      )).toBe(true);
    });

    it('should warn about disabled minification in production mode', () => {
      const config: BuildConfig = {
        ...DEFAULT_BUILD_CONFIG,
        mode: 'production',
        minify: false,
      };

      const result = orchestrator.validateConfig(config);

      expect(result.valid).toBe(true);
      expect(result.warnings.some(w => 
        w.includes('Minification disabled in production mode')
      )).toBe(true);
    });
  });

  describe('Configuration', () => {
    it('should accept valid configuration', () => {
      const config: BuildConfig = {
        ...DEFAULT_BUILD_CONFIG,
        platforms: ['web'],
      };

      expect(() => orchestrator.configure(config)).not.toThrow();
    });

    it('should throw error for invalid configuration', () => {
      const config: BuildConfig = {
        ...DEFAULT_BUILD_CONFIG,
        platforms: [],
      };

      expect(() => orchestrator.configure(config)).toThrow('Invalid build configuration');
    });

    it('should update status after configuration', () => {
      const config: BuildConfig = {
        ...DEFAULT_BUILD_CONFIG,
        platforms: ['web'],
      };

      orchestrator.configure(config);
      const status = orchestrator.getStatus();

      expect(status.phase).toBe('configuring');
      expect(status.currentOperation).toBe('Configuration validated');
    });
  });

  describe('Platform Selection', () => {
    it('should reject invalid platforms', async () => {
      const config: BuildConfig = {
        ...DEFAULT_BUILD_CONFIG,
        platforms: ['web'],
      };

      orchestrator.configure(config);

      await expect(
        orchestrator.build(['invalid' as Platform])
      ).rejects.toThrow('Invalid platforms specified');
    });

    it('should reject empty platform list', async () => {
      const config: BuildConfig = {
        ...DEFAULT_BUILD_CONFIG,
        platforms: ['web'],
      };

      orchestrator.configure(config);

      await expect(
        orchestrator.build([])
      ).rejects.toThrow('No platforms specified for build');
    });

    it('should accept valid platforms', async () => {
      const config: BuildConfig = {
        ...DEFAULT_BUILD_CONFIG,
        platforms: ['web', 'ios', 'android'],
      };

      orchestrator.configure(config);

      const results = await orchestrator.build(['web']);

      expect(results).toHaveLength(1);
      expect(results[0].platform).toBe('web');
    });
  });

  describe('Build Status Tracking', () => {
    it('should start with idle status', () => {
      const status = orchestrator.getStatus();

      expect(status.phase).toBe('idle');
      expect(status.activePlatforms).toHaveLength(0);
      expect(status.completedPlatforms).toHaveLength(0);
      expect(status.failedPlatforms).toHaveLength(0);
      expect(status.progress).toBe(0);
    });

    it('should update status during build', async () => {
      const config: BuildConfig = {
        ...DEFAULT_BUILD_CONFIG,
        platforms: ['web'],
      };

      orchestrator.configure(config);

      const buildPromise = orchestrator.build(['web']);
      
      // Status should be building
      const statusDuring = orchestrator.getStatus();
      expect(statusDuring.phase).toBe('building');

      await buildPromise;

      // Status should be complete
      const statusAfter = orchestrator.getStatus();
      expect(statusAfter.phase).toBe('complete');
      expect(statusAfter.progress).toBe(100);
      expect(statusAfter.completedPlatforms).toContain('web');
    });

    it('should track start and end times', async () => {
      const config: BuildConfig = {
        ...DEFAULT_BUILD_CONFIG,
        platforms: ['web'],
      };

      orchestrator.configure(config);

      await orchestrator.build(['web']);

      const status = orchestrator.getStatus();
      expect(status.startTime).toBeInstanceOf(Date);
      expect(status.endTime).toBeInstanceOf(Date);
      expect(status.endTime!.getTime()).toBeGreaterThanOrEqual(status.startTime!.getTime());
    });

    it('should reset status on new build', async () => {
      const config: BuildConfig = {
        ...DEFAULT_BUILD_CONFIG,
        platforms: ['web'],
      };

      orchestrator.configure(config);

      // First build
      await orchestrator.build(['web']);
      const firstStatus = orchestrator.getStatus();
      expect(firstStatus.phase).toBe('complete');

      // Second build should reset
      await orchestrator.build(['web']);
      const secondStatus = orchestrator.getStatus();
      expect(secondStatus.phase).toBe('complete');
    });
  });

  describe('Build Execution', () => {
    it('should build single platform', async () => {
      const config: BuildConfig = {
        ...DEFAULT_BUILD_CONFIG,
        platforms: ['web'],
      };

      orchestrator.configure(config);

      const results = await orchestrator.build(['web']);

      expect(results).toHaveLength(1);
      expect(results[0].platform).toBe('web');
      expect(results[0].success).toBe(true);
    });

    it('should build multiple platforms sequentially', async () => {
      const config: BuildConfig = {
        ...DEFAULT_BUILD_CONFIG,
        platforms: ['web', 'ios'],
        parallel: false,
      };

      orchestrator.configure(config);

      const results = await orchestrator.build(['web', 'ios']);

      expect(results).toHaveLength(2);
      expect(results[0].platform).toBe('web');
      expect(results[1].platform).toBe('ios');
    });

    it('should build multiple platforms in parallel', async () => {
      const config: BuildConfig = {
        ...DEFAULT_BUILD_CONFIG,
        platforms: ['web', 'ios', 'android'],
        parallel: true,
      };

      orchestrator.configure(config);

      const results = await orchestrator.build(['web', 'ios', 'android']);

      expect(results).toHaveLength(3);
      expect(results.map(r => r.platform)).toContain('web');
      expect(results.map(r => r.platform)).toContain('ios');
      expect(results.map(r => r.platform)).toContain('android');
    });
  });

  describe('Build Results', () => {
    it('should return build results with metadata', async () => {
      const config: BuildConfig = {
        ...DEFAULT_BUILD_CONFIG,
        platforms: ['web'],
      };

      orchestrator.configure(config);

      const results = await orchestrator.build(['web']);

      expect(results[0]).toHaveProperty('platform');
      expect(results[0]).toHaveProperty('success');
      expect(results[0]).toHaveProperty('packagePath');
      expect(results[0]).toHaveProperty('duration');
      expect(results[0]).toHaveProperty('warnings');
      expect(results[0]).toHaveProperty('errors');
      expect(results[0]).toHaveProperty('metadata');
    });

    it('should generate build summary', async () => {
      const config: BuildConfig = {
        ...DEFAULT_BUILD_CONFIG,
        platforms: ['web', 'ios'],
      };

      orchestrator.configure(config);

      await orchestrator.build(['web', 'ios']);

      const summary = orchestrator.getSummary();

      expect(summary).not.toBeNull();
      expect(summary!.status).toBe('success');
      expect(summary!.results).toHaveLength(2);
      expect(summary!.successCount).toBe(2);
      expect(summary!.failureCount).toBe(0);
      expect(summary!.totalDuration).toBeGreaterThanOrEqual(0);
    });

    it('should return null summary before any builds', () => {
      const summary = orchestrator.getSummary();
      expect(summary).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should handle cancellation', async () => {
      const config: BuildConfig = {
        ...DEFAULT_BUILD_CONFIG,
        platforms: ['web'],
      };

      orchestrator.configure(config);

      const buildPromise = orchestrator.build(['web']);
      await orchestrator.cancel();

      const status = orchestrator.getStatus();
      expect(status.phase).toBe('failed');
      expect(status.currentOperation).toBe('Build cancelled by user');
    });

    it('should reset state', () => {
      const config: BuildConfig = {
        ...DEFAULT_BUILD_CONFIG,
        platforms: ['web'],
      };

      orchestrator.configure(config);
      orchestrator.reset();

      const status = orchestrator.getStatus();
      expect(status.phase).toBe('idle');
      expect(status.activePlatforms).toHaveLength(0);
      expect(status.completedPlatforms).toHaveLength(0);
      expect(status.failedPlatforms).toHaveLength(0);
    });
  });
});
