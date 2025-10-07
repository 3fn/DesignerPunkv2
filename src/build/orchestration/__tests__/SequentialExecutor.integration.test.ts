/**
 * Integration tests for SequentialExecutor
 */

import { SequentialExecutor, SequentialProgress } from '../SequentialExecutor';
import { Platform } from '../../types/Platform';
import { BuildResult } from '../../types/BuildResult';

describe('SequentialExecutor Integration', () => {
  const createRealisticBuildFn = (failPlatforms: Platform[] = []) => {
    return async (platform: Platform): Promise<BuildResult> => {
      // Simulate realistic build time
      const buildTime = Math.random() * 100 + 50;
      await new Promise(resolve => setTimeout(resolve, buildTime));

      const success = !failPlatforms.includes(platform);

      return {
        platform,
        success,
        packagePath: success ? `/dist/${platform}/package.zip` : '',
        duration: buildTime,
        warnings: success ? [] : ['Using deprecated API'],
        errors: success ? [] : [{
          code: 'BUILD_FAILED',
          message: `${platform} build failed`,
          severity: 'error' as const,
          category: 'build' as const,
          platform,
          context: {},
          suggestions: ['Check platform configuration', 'Verify dependencies'],
          documentation: [],
        }],
        metadata: {
          timestamp: new Date().toISOString(),
        },
      };
    };
  };

  describe('real-world scenarios', () => {
    it('should handle all platforms succeeding', async () => {
      const executor = new SequentialExecutor();
      const platforms: Platform[] = ['web', 'ios', 'android'];
      const buildFn = createRealisticBuildFn();

      const result = await executor.execute(platforms, buildFn);

      expect(result.successCount).toBe(3);
      expect(result.failureCount).toBe(0);
      expect(result.stoppedOnFailure).toBe(false);
      expect(result.results.every(r => r.packagePath)).toBe(true);
    });

    it('should handle mixed success and failure', async () => {
      const executor = new SequentialExecutor();
      const platforms: Platform[] = ['web', 'ios', 'android'];
      const buildFn = createRealisticBuildFn(['ios']);

      const result = await executor.execute(platforms, buildFn);

      expect(result.successCount).toBe(2);
      expect(result.failureCount).toBe(1);
      expect(result.results.find(r => r.platform === 'ios')?.success).toBe(false);
    });


    it('should stop on first failure in fail-fast mode', async () => {
      const executor = new SequentialExecutor({ stopOnFailure: true });
      const platforms: Platform[] = ['web', 'ios', 'android'];
      const buildFn = createRealisticBuildFn(['ios']);

      const result = await executor.execute(platforms, buildFn);

      expect(result.results).toHaveLength(2);
      expect(result.stoppedOnFailure).toBe(true);
      expect(result.skippedPlatforms).toEqual(['android']);
    });
  });

  describe('progress tracking', () => {
    it('should provide detailed progress updates', async () => {
      const progressUpdates: SequentialProgress[] = [];
      const executor = new SequentialExecutor({
        onProgress: (progress) => {
          progressUpdates.push({ ...progress });
        },
      });
      const platforms: Platform[] = ['web', 'ios', 'android'];
      const buildFn = createRealisticBuildFn();

      await executor.execute(platforms, buildFn);

      // Should have progress updates for each platform
      expect(progressUpdates.length).toBeGreaterThanOrEqual(3);

      // First update should be for web
      expect(progressUpdates[0].currentPlatform).toBe('web');
      expect(progressUpdates[0].currentIndex).toBe(0);

      // Progress should increase
      const percentages = progressUpdates.map(p => p.percentComplete);
      for (let i = 1; i < percentages.length; i++) {
        expect(percentages[i]).toBeGreaterThanOrEqual(percentages[i - 1]);
      }

      // Final progress should be 100%
      expect(progressUpdates[progressUpdates.length - 1].percentComplete).toBe(100);
    });

    it('should track elapsed time accurately', async () => {
      const progressUpdates: SequentialProgress[] = [];
      const executor = new SequentialExecutor({
        onProgress: (progress) => {
          progressUpdates.push({ ...progress });
        },
      });
      const platforms: Platform[] = ['web', 'ios'];
      const buildFn = createRealisticBuildFn();

      await executor.execute(platforms, buildFn);

      // Elapsed time should increase
      const times = progressUpdates.map(p => p.elapsedTime);
      for (let i = 1; i < times.length; i++) {
        expect(times[i]).toBeGreaterThanOrEqual(times[i - 1]);
      }
    });
  });

  describe('performance characteristics', () => {
    it('should execute builds sequentially (not in parallel)', async () => {
      const executor = new SequentialExecutor();
      const platforms: Platform[] = ['web', 'ios', 'android'];
      const executionTimes: number[] = [];

      const buildFn = async (platform: Platform): Promise<BuildResult> => {
        const startTime = Date.now();
        await new Promise(resolve => setTimeout(resolve, 50));
        executionTimes.push(Date.now() - startTime);
        return createRealisticBuildFn()(platform);
      };

      const startTime = Date.now();
      await executor.execute(platforms, buildFn);
      const totalTime = Date.now() - startTime;

      // Total time should be approximately sum of individual times (sequential)
      const sumOfIndividualTimes = executionTimes.reduce((a, b) => a + b, 0);
      expect(totalTime).toBeGreaterThanOrEqual(sumOfIndividualTimes * 0.9);
    });

    it('should have predictable total duration', async () => {
      const executor = new SequentialExecutor();
      const platforms: Platform[] = ['web', 'ios'];
      const buildFn = createRealisticBuildFn();

      const result = await executor.execute(platforms, buildFn);

      // Total duration should be sum of individual build durations
      const sumOfBuildDurations = result.results.reduce((sum, r) => sum + r.duration, 0);
      expect(result.totalDuration).toBeGreaterThanOrEqual(sumOfBuildDurations * 0.8);
    });
  });

  describe('error handling', () => {
    it('should handle timeout gracefully', async () => {
      const executor = new SequentialExecutor({ buildTimeout: 100 });
      const platforms: Platform[] = ['web', 'ios'];

      const buildFn = async (platform: Platform): Promise<BuildResult> => {
        if (platform === 'ios') {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        return createRealisticBuildFn()(platform);
      };

      const result = await executor.execute(platforms, buildFn);

      expect(result.results).toHaveLength(2);
      expect(result.results[1].success).toBe(false);
      expect(result.results[1].errors[0].message).toContain('timeout');
    });

    it('should aggregate all results even with failures', async () => {
      const executor = new SequentialExecutor();
      const platforms: Platform[] = ['web', 'ios', 'android'];
      const buildFn = createRealisticBuildFn(['ios', 'android']);

      const result = await executor.execute(platforms, buildFn);

      expect(result.results).toHaveLength(3);
      expect(result.successCount).toBe(1);
      expect(result.failureCount).toBe(2);
      expect(result.results.every(r => r.platform)).toBe(true);
    });
  });
});
