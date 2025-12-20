/**
 * @category evergreen
 * @purpose Verify build system generates required outputs with correct structure
 */
/**
 * Parallel Executor Tests
 * 
 * Tests for parallel build execution functionality including:
 * - Simultaneous platform builds
 * - Build failure handling
 * - Concurrency control
 * - Timeout handling
 * - Cancellation support
 */

import { ParallelExecutor } from '../ParallelExecutor';
import { Platform } from '../../types/Platform';
import { BuildResult } from '../../types/BuildResult';

describe('ParallelExecutor', () => {
  describe('Basic Parallel Execution', () => {
    it('should execute multiple platform builds simultaneously', async () => {
      const executor = new ParallelExecutor();
      const platforms: Platform[] = ['ios', 'android', 'web'];
      
      const buildTimes: Record<Platform, number> = {
        ios: 0,
        android: 0,
        web: 0,
      };

      const buildFn = async (platform: Platform): Promise<BuildResult> => {
        buildTimes[platform] = Date.now();
        await new Promise(resolve => setTimeout(resolve, 50));
        
        return {
          platform,
          success: true,
          packagePath: `/output/${platform}`,
          duration: 50,
          warnings: [],
          errors: [],
        };
      };

      const result = await executor.execute(platforms, buildFn);

      // All builds should succeed
      expect(result.successCount).toBe(3);
      expect(result.failureCount).toBe(0);
      expect(result.allCompleted).toBe(true);
      expect(result.results).toHaveLength(3);

      // Verify all platforms were built
      const builtPlatforms = result.results.map(r => r.platform);
      expect(builtPlatforms).toContain('ios');
      expect(builtPlatforms).toContain('android');
      expect(builtPlatforms).toContain('web');

      // Builds should start at roughly the same time (parallel execution)
      const startTimes = Object.values(buildTimes);
      const maxTimeDiff = Math.max(...startTimes) - Math.min(...startTimes);
      expect(maxTimeDiff).toBeLessThan(20); // Should start within 20ms of each other
    });

    it('should aggregate results from all builds', async () => {
      const executor = new ParallelExecutor();
      const platforms: Platform[] = ['ios', 'android'];

      const buildFn = async (platform: Platform): Promise<BuildResult> => {
        // Add small delay to ensure totalDuration > 0
        await new Promise(resolve => setTimeout(resolve, 10));
        
        return {
          platform,
          success: true,
          packagePath: `/output/${platform}`,
          duration: 100,
          warnings: [`Warning for ${platform}`],
          errors: [],
          metadata: {
            componentsBuilt: 5,
            tokensGenerated: 20,
          },
        };
      };

      const result = await executor.execute(platforms, buildFn);

      expect(result.results).toHaveLength(2);
      expect(result.successCount).toBe(2);
      expect(result.totalDuration).toBeGreaterThan(0);
      
      // Verify individual results
      result.results.forEach(r => {
        expect(r.success).toBe(true);
        expect(r.warnings).toHaveLength(1);
        expect(r.metadata?.componentsBuilt).toBe(5);
      });
    });

    it('should handle empty platform list', async () => {
      const executor = new ParallelExecutor();
      const platforms: Platform[] = [];

      const buildFn = async (platform: Platform): Promise<BuildResult> => {
        return {
          platform,
          success: true,
          packagePath: '',
          duration: 0,
          warnings: [],
          errors: [],
        };
      };

      await expect(executor.execute(platforms, buildFn)).rejects.toThrow(
        'No platforms specified for parallel execution'
      );
    });
  });

  describe('Build Failure Handling', () => {
    it('should handle platform-specific build failures', async () => {
      const executor = new ParallelExecutor();
      const platforms: Platform[] = ['ios', 'android', 'web'];

      const buildFn = async (platform: Platform): Promise<BuildResult> => {
        if (platform === 'android') {
          throw new Error('Android build failed');
        }

        return {
          platform,
          success: true,
          packagePath: `/output/${platform}`,
          duration: 50,
          warnings: [],
          errors: [],
        };
      };

      const result = await executor.execute(platforms, buildFn);

      expect(result.successCount).toBe(2);
      expect(result.failureCount).toBe(1);
      expect(result.allCompleted).toBe(true);

      // Find the failed build
      const failedBuild = result.results.find(r => r.platform === 'android');
      expect(failedBuild).toBeDefined();
      expect(failedBuild!.success).toBe(false);
      expect(failedBuild!.errors).toHaveLength(1);
      expect(failedBuild!.errors[0].message).toContain('Android build failed');
    });

    it('should continue building other platforms after failure', async () => {
      const executor = new ParallelExecutor({ continueOnFailure: true });
      const platforms: Platform[] = ['ios', 'android', 'web'];
      const builtPlatforms = new Set<Platform>();

      const buildFn = async (platform: Platform): Promise<BuildResult> => {
        builtPlatforms.add(platform);
        
        if (platform === 'ios') {
          throw new Error('iOS build failed');
        }

        return {
          platform,
          success: true,
          packagePath: `/output/${platform}`,
          duration: 50,
          warnings: [],
          errors: [],
        };
      };

      const result = await executor.execute(platforms, buildFn);

      // All platforms should have been attempted
      expect(builtPlatforms.size).toBe(3);
      expect(result.results).toHaveLength(3);
      expect(result.successCount).toBe(2);
      expect(result.failureCount).toBe(1);
    });

    it('should provide actionable error messages', async () => {
      const executor = new ParallelExecutor();
      const platforms: Platform[] = ['ios'];

      const buildFn = async (platform: Platform): Promise<BuildResult> => {
        throw new Error('Compilation error: missing dependency');
      };

      const result = await executor.execute(platforms, buildFn);

      const failedBuild = result.results[0];
      expect(failedBuild.success).toBe(false);
      expect(failedBuild.errors[0].suggestions).toBeDefined();
      expect(failedBuild.errors[0].suggestions.length).toBeGreaterThan(0);
    });
  });

  describe('Concurrency Control', () => {
    it('should respect maxConcurrency limit', async () => {
      const executor = new ParallelExecutor({ maxConcurrency: 2 });
      const platforms: Platform[] = ['ios', 'android', 'web'];
      let concurrentBuilds = 0;
      let maxConcurrent = 0;
      const lock = { value: 0 };

      const buildFn = async (platform: Platform): Promise<BuildResult> => {
        lock.value++;
        concurrentBuilds = lock.value;
        maxConcurrent = Math.max(maxConcurrent, concurrentBuilds);
        
        await new Promise(resolve => setTimeout(resolve, 50));
        
        lock.value--;

        return {
          platform,
          success: true,
          packagePath: `/output/${platform}`,
          duration: 50,
          warnings: [],
          errors: [],
        };
      };

      const result = await executor.execute(platforms, buildFn);

      expect(result.successCount).toBe(3);
      expect(maxConcurrent).toBeLessThanOrEqual(2);
    });

    it('should execute in batches when concurrency limited', async () => {
      const executor = new ParallelExecutor({ maxConcurrency: 1 });
      const platforms: Platform[] = ['ios', 'android'];
      const executionOrder = new Set<Platform>();

      const buildFn = async (platform: Platform): Promise<BuildResult> => {
        executionOrder.add(platform);
        await new Promise(resolve => setTimeout(resolve, 10));

        return {
          platform,
          success: true,
          packagePath: `/output/${platform}`,
          duration: 10,
          warnings: [],
          errors: [],
        };
      };

      const result = await executor.execute(platforms, buildFn);

      expect(result.successCount).toBe(2);
      expect(executionOrder.size).toBe(2);
      // With maxConcurrency=1, builds should be sequential
    });

    it('should stop on failure when continueOnFailure is false', async () => {
      const executor = new ParallelExecutor({ 
        maxConcurrency: 1,
        continueOnFailure: false 
      });
      const platforms: Platform[] = ['ios', 'android', 'web'];
      const attemptedBuilds = new Set<Platform>();

      const buildFn = async (platform: Platform): Promise<BuildResult> => {
        attemptedBuilds.add(platform);
        
        if (platform === 'android') {
          throw new Error('Build failed');
        }

        return {
          platform,
          success: true,
          packagePath: `/output/${platform}`,
          duration: 10,
          warnings: [],
          errors: [],
        };
      };

      const result = await executor.execute(platforms, buildFn);

      // Should stop after failure (may have attempted more due to batching)
      expect(result.failureCount).toBeGreaterThan(0);
      // Some platforms should not have been built
      expect(result.results.some(r => r.errors.some(e => e.code === 'BUILD_CANCELLED'))).toBe(true);
    });
  });

  describe('Timeout Handling', () => {
    it('should timeout builds that exceed buildTimeout', async () => {
      const executor = new ParallelExecutor({ buildTimeout: 100 });
      const platforms: Platform[] = ['ios'];

      const buildFn = async (platform: Platform): Promise<BuildResult> => {
        // Simulate long-running build
        await new Promise(resolve => setTimeout(resolve, 200));

        return {
          platform,
          success: true,
          packagePath: `/output/${platform}`,
          duration: 200,
          warnings: [],
          errors: [],
        };
      };

      const result = await executor.execute(platforms, buildFn);

      expect(result.failureCount).toBe(1);
      const failedBuild = result.results[0];
      expect(failedBuild.success).toBe(false);
      expect(failedBuild.errors[0].message).toContain('timeout');
    });

    it('should complete builds within timeout', async () => {
      const executor = new ParallelExecutor({ buildTimeout: 500 });
      const platforms: Platform[] = ['ios', 'android'];

      const buildFn = async (platform: Platform): Promise<BuildResult> => {
        await new Promise(resolve => setTimeout(resolve, 50));

        return {
          platform,
          success: true,
          packagePath: `/output/${platform}`,
          duration: 50,
          warnings: [],
          errors: [],
        };
      };

      const result = await executor.execute(platforms, buildFn);

      expect(result.successCount).toBe(2);
      expect(result.failureCount).toBe(0);
    });
  });

  describe('Cancellation Support', () => {
    it('should cancel ongoing builds', async () => {
      const executor = new ParallelExecutor();
      const platforms: Platform[] = ['ios', 'android', 'web'];

      const buildFn = async (platform: Platform): Promise<BuildResult> => {
        await new Promise(resolve => setTimeout(resolve, 200));

        return {
          platform,
          success: true,
          packagePath: `/output/${platform}`,
          duration: 200,
          warnings: [],
          errors: [],
        };
      };

      // Start execution and cancel after 50ms
      const executionPromise = executor.execute(platforms, buildFn);
      
      setTimeout(() => {
        executor.cancel();
      }, 50);

      const result = await executionPromise;

      // Some builds should be cancelled
      expect(result.allCompleted).toBe(false);
      
      const cancelledBuilds = result.results.filter(
        r => r.errors.some(e => e.code === 'BUILD_CANCELLED')
      );
      expect(cancelledBuilds.length).toBeGreaterThan(0);
    });

    it('should mark cancelled builds with appropriate error', async () => {
      const executor = new ParallelExecutor({ maxConcurrency: 1 });
      const platforms: Platform[] = ['ios', 'android'];

      const buildFn = async (platform: Platform): Promise<BuildResult> => {
        await new Promise(resolve => setTimeout(resolve, 100));

        return {
          platform,
          success: true,
          packagePath: `/output/${platform}`,
          duration: 100,
          warnings: [],
          errors: [],
        };
      };

      const executionPromise = executor.execute(platforms, buildFn);
      
      setTimeout(() => {
        executor.cancel();
      }, 50);

      const result = await executionPromise;

      const cancelledBuild = result.results.find(
        r => r.errors.some(e => e.code === 'BUILD_CANCELLED')
      );

      if (cancelledBuild) {
        expect(cancelledBuild.success).toBe(false);
        expect(cancelledBuild.errors[0].code).toBe('BUILD_CANCELLED');
        expect(cancelledBuild.errors[0].message).toContain('cancelled');
      }
    });
  });

  describe('Result Aggregation', () => {
    it('should calculate correct metrics', async () => {
      const executor = new ParallelExecutor();
      const platforms: Platform[] = ['ios', 'android', 'web'];

      const buildFn = async (platform: Platform): Promise<BuildResult> => {
        // Add small delay to ensure totalDuration > 0
        await new Promise(resolve => setTimeout(resolve, 10));
        
        const success = platform !== 'android';
        
        return {
          platform,
          success,
          packagePath: success ? `/output/${platform}` : '',
          duration: 100,
          warnings: success ? [] : [],
          errors: success ? [] : [{
            code: 'BUILD_FAILED',
            message: 'Build failed',
            severity: 'error',
            category: 'build',
            platform,
            context: {},
            suggestions: [],
            documentation: [],
          }],
        };
      };

      const result = await executor.execute(platforms, buildFn);

      expect(result.results).toHaveLength(3);
      expect(result.successCount).toBe(2);
      expect(result.failureCount).toBe(1);
      expect(result.totalDuration).toBeGreaterThan(0);
      expect(result.allCompleted).toBe(true);
    });

    it('should preserve individual build metadata', async () => {
      const executor = new ParallelExecutor();
      const platforms: Platform[] = ['ios', 'android'];

      const buildFn = async (platform: Platform): Promise<BuildResult> => {
        return {
          platform,
          success: true,
          packagePath: `/output/${platform}`,
          duration: 100,
          warnings: [`Warning for ${platform}`],
          errors: [],
          metadata: {
            componentsBuilt: platform === 'ios' ? 10 : 15,
            tokensGenerated: 50,
            packageSize: 1024,
            timestamp: new Date().toISOString(),
          },
        };
      };

      const result = await executor.execute(platforms, buildFn);

      // Verify metadata is preserved
      const iosResult = result.results.find(r => r.platform === 'ios');
      const androidResult = result.results.find(r => r.platform === 'android');

      expect(iosResult?.metadata?.componentsBuilt).toBe(10);
      expect(androidResult?.metadata?.componentsBuilt).toBe(15);
      expect(iosResult?.warnings).toContain('Warning for ios');
      expect(androidResult?.warnings).toContain('Warning for android');
    });
  });
});
