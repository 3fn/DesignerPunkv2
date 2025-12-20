/**
 * @category evergreen
 * @purpose Verify build system generates required outputs with correct structure
 */
/**
 * Parallel Executor Integration Tests
 * 
 * Integration tests verifying ParallelExecutor works correctly
 * with the build system and platform builders.
 */

import { ParallelExecutor } from '../ParallelExecutor';
import { Platform } from '../../types/Platform';
import { BuildResult } from '../../types/BuildResult';

describe('ParallelExecutor Integration', () => {
  describe('Real-World Build Scenarios', () => {
    it('should handle mixed success and failure scenarios', async () => {
      const executor = new ParallelExecutor();
      const platforms: Platform[] = ['ios', 'android', 'web'];

      // Simulate realistic build function with varying outcomes
      const buildFn = async (platform: Platform): Promise<BuildResult> => {
        // Simulate build time
        const buildTime = platform === 'ios' ? 100 : platform === 'android' ? 150 : 80;
        await new Promise(resolve => setTimeout(resolve, buildTime));

        // Simulate platform-specific outcomes
        if (platform === 'android') {
          // Android build fails
          throw new Error('Gradle build failed: dependency resolution error');
        }

        return {
          platform,
          success: true,
          packagePath: `/dist/${platform}/${platform}-package`,
          duration: buildTime,
          warnings: platform === 'web' ? ['Deprecated API usage detected'] : [],
          errors: [],
          metadata: {
            componentsBuilt: platform === 'ios' ? 12 : 15,
            tokensGenerated: 45,
            packageSize: platform === 'ios' ? 2048 : 1536,
            timestamp: new Date().toISOString(),
          },
        };
      };

      const result = await executor.execute(platforms, buildFn);

      // Verify overall results
      expect(result.results).toHaveLength(3);
      expect(result.successCount).toBe(2);
      expect(result.failureCount).toBe(1);
      expect(result.allCompleted).toBe(true);

      // Verify successful builds
      const iosResult = result.results.find(r => r.platform === 'ios');
      expect(iosResult?.success).toBe(true);
      expect(iosResult?.metadata?.componentsBuilt).toBe(12);

      const webResult = result.results.find(r => r.platform === 'web');
      expect(webResult?.success).toBe(true);
      expect(webResult?.warnings).toContain('Deprecated API usage detected');

      // Verify failed build
      const androidResult = result.results.find(r => r.platform === 'android');
      expect(androidResult?.success).toBe(false);
      expect(androidResult?.errors[0].message).toContain('Gradle build failed');
    });

    it('should handle all platforms succeeding', async () => {
      const executor = new ParallelExecutor();
      const platforms: Platform[] = ['ios', 'android', 'web'];

      const buildFn = async (platform: Platform): Promise<BuildResult> => {
        await new Promise(resolve => setTimeout(resolve, 50));

        return {
          platform,
          success: true,
          packagePath: `/dist/${platform}`,
          duration: 50,
          warnings: [],
          errors: [],
          metadata: {
            componentsBuilt: 10,
            tokensGenerated: 40,
            timestamp: new Date().toISOString(),
          },
        };
      };

      const result = await executor.execute(platforms, buildFn);

      expect(result.successCount).toBe(3);
      expect(result.failureCount).toBe(0);
      expect(result.allCompleted).toBe(true);
      
      // All platforms should have successful results
      result.results.forEach(r => {
        expect(r.success).toBe(true);
        expect(r.packagePath).toBeTruthy();
        expect(r.metadata?.componentsBuilt).toBe(10);
      });
    });

    it('should handle all platforms failing', async () => {
      const executor = new ParallelExecutor();
      const platforms: Platform[] = ['ios', 'android', 'web'];

      const buildFn = async (platform: Platform): Promise<BuildResult> => {
        await new Promise(resolve => setTimeout(resolve, 20));
        throw new Error(`${platform} build failed: configuration error`);
      };

      const result = await executor.execute(platforms, buildFn);

      expect(result.successCount).toBe(0);
      expect(result.failureCount).toBe(3);
      expect(result.allCompleted).toBe(true);

      // All platforms should have failed
      result.results.forEach(r => {
        expect(r.success).toBe(false);
        expect(r.errors).toHaveLength(1);
        expect(r.errors[0].message).toContain('build failed');
      });
    });
  });

  describe('Performance Characteristics', () => {
    it('should execute builds in parallel (faster than sequential)', async () => {
      const executor = new ParallelExecutor();
      const platforms: Platform[] = ['ios', 'android', 'web'];
      const buildDuration = 100;

      const buildFn = async (platform: Platform): Promise<BuildResult> => {
        await new Promise(resolve => setTimeout(resolve, buildDuration));

        return {
          platform,
          success: true,
          packagePath: `/dist/${platform}`,
          duration: buildDuration,
          warnings: [],
          errors: [],
        };
      };

      const startTime = Date.now();
      const result = await executor.execute(platforms, buildFn);
      const totalTime = Date.now() - startTime;

      // Parallel execution should take roughly the time of the longest build
      // (not the sum of all builds)
      expect(totalTime).toBeLessThan(buildDuration * 2);
      expect(totalTime).toBeGreaterThanOrEqual(buildDuration);
      
      expect(result.successCount).toBe(3);
    });

    it('should respect concurrency limits for resource management', async () => {
      const executor = new ParallelExecutor({ maxConcurrency: 2 });
      const platforms: Platform[] = ['ios', 'android', 'web'];
      let maxConcurrent = 0;
      let currentConcurrent = 0;

      const buildFn = async (platform: Platform): Promise<BuildResult> => {
        currentConcurrent++;
        maxConcurrent = Math.max(maxConcurrent, currentConcurrent);
        
        await new Promise(resolve => setTimeout(resolve, 50));
        
        currentConcurrent--;

        return {
          platform,
          success: true,
          packagePath: `/dist/${platform}`,
          duration: 50,
          warnings: [],
          errors: [],
        };
      };

      const result = await executor.execute(platforms, buildFn);

      expect(result.successCount).toBe(3);
      expect(maxConcurrent).toBeLessThanOrEqual(2);
    });
  });

  describe('Error Recovery', () => {
    it('should provide detailed error information for debugging', async () => {
      const executor = new ParallelExecutor();
      const platforms: Platform[] = ['ios'];

      const buildFn = async (platform: Platform): Promise<BuildResult> => {
        throw new Error('Swift compilation failed: Type mismatch in TokenConstants.swift');
      };

      const result = await executor.execute(platforms, buildFn);

      const failedBuild = result.results[0];
      expect(failedBuild.success).toBe(false);
      expect(failedBuild.errors).toHaveLength(1);
      
      const error = failedBuild.errors[0];
      expect(error.code).toBe('BUILD_FAILED');
      expect(error.message).toContain('Swift compilation failed');
      expect(error.severity).toBe('error');
      expect(error.category).toBe('build');
      expect(error.suggestions).toBeDefined();
      expect(error.suggestions.length).toBeGreaterThan(0);
    });

    it('should handle timeout scenarios gracefully', async () => {
      const executor = new ParallelExecutor({ buildTimeout: 100 });
      const platforms: Platform[] = ['ios', 'android'];

      const buildFn = async (platform: Platform): Promise<BuildResult> => {
        if (platform === 'ios') {
          // iOS build times out
          await new Promise(resolve => setTimeout(resolve, 200));
        } else {
          // Android completes successfully
          await new Promise(resolve => setTimeout(resolve, 50));
        }

        return {
          platform,
          success: true,
          packagePath: `/dist/${platform}`,
          duration: platform === 'ios' ? 200 : 50,
          warnings: [],
          errors: [],
        };
      };

      const result = await executor.execute(platforms, buildFn);

      // iOS should timeout, Android should succeed
      const iosResult = result.results.find(r => r.platform === 'ios');
      const androidResult = result.results.find(r => r.platform === 'android');

      expect(iosResult?.success).toBe(false);
      expect(iosResult?.errors[0].message).toContain('timeout');
      
      expect(androidResult?.success).toBe(true);
    });
  });

  describe('Cancellation Scenarios', () => {
    it('should handle user-initiated cancellation', async () => {
      const executor = new ParallelExecutor();
      const platforms: Platform[] = ['ios', 'android', 'web'];

      const buildFn = async (platform: Platform): Promise<BuildResult> => {
        await new Promise(resolve => setTimeout(resolve, 200));

        return {
          platform,
          success: true,
          packagePath: `/dist/${platform}`,
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
  });
});
