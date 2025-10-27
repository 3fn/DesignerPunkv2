"use strict";
/**
 * Unit tests for SequentialExecutor
 */
Object.defineProperty(exports, "__esModule", { value: true });
const SequentialExecutor_1 = require("../SequentialExecutor");
describe('SequentialExecutor', () => {
    const createMockBuildResult = (platform, success) => ({
        platform,
        success,
        packagePath: `/dist/${platform}`,
        duration: 100,
        warnings: [],
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
        metadata: {
            timestamp: new Date().toISOString(),
        },
    });
    describe('execute', () => {
        it('should execute builds sequentially', async () => {
            const executor = new SequentialExecutor_1.SequentialExecutor();
            const platforms = ['web', 'ios', 'android'];
            const executionOrder = [];
            const buildFn = async (platform) => {
                executionOrder.push(platform);
                await new Promise(resolve => setTimeout(resolve, 10));
                return createMockBuildResult(platform, true);
            };
            const result = await executor.execute(platforms, buildFn);
            expect(executionOrder).toEqual(['web', 'ios', 'android']);
            expect(result.results).toHaveLength(3);
            expect(result.successCount).toBe(3);
            expect(result.failureCount).toBe(0);
        });
        it('should continue through all platforms by default', async () => {
            const executor = new SequentialExecutor_1.SequentialExecutor();
            const platforms = ['web', 'ios', 'android'];
            const buildFn = async (platform) => {
                const success = platform !== 'ios'; // ios fails
                return createMockBuildResult(platform, success);
            };
            const result = await executor.execute(platforms, buildFn);
            expect(result.results).toHaveLength(3);
            expect(result.successCount).toBe(2);
            expect(result.failureCount).toBe(1);
            expect(result.stoppedOnFailure).toBe(false);
            expect(result.skippedPlatforms).toHaveLength(0);
        });
        it('should stop on first failure when stopOnFailure is true', async () => {
            const executor = new SequentialExecutor_1.SequentialExecutor({ stopOnFailure: true });
            const platforms = ['web', 'ios', 'android'];
            const buildFn = async (platform) => {
                const success = platform !== 'ios'; // ios fails
                return createMockBuildResult(platform, success);
            };
            const result = await executor.execute(platforms, buildFn);
            expect(result.results).toHaveLength(2); // web and ios only
            expect(result.successCount).toBe(1);
            expect(result.failureCount).toBe(1);
            expect(result.stoppedOnFailure).toBe(true);
            expect(result.skippedPlatforms).toEqual(['android']);
        });
        it('should provide progress feedback', async () => {
            const progressUpdates = [];
            const executor = new SequentialExecutor_1.SequentialExecutor({
                onProgress: (progress) => progressUpdates.push({ ...progress }),
            });
            const platforms = ['web', 'ios'];
            const buildFn = async (platform) => {
                return createMockBuildResult(platform, true);
            };
            await executor.execute(platforms, buildFn);
            expect(progressUpdates.length).toBeGreaterThan(0);
            expect(progressUpdates[0].currentPlatform).toBe('web');
            expect(progressUpdates[0].currentIndex).toBe(0);
            expect(progressUpdates[0].totalPlatforms).toBe(2);
        });
        it('should aggregate results correctly', async () => {
            const executor = new SequentialExecutor_1.SequentialExecutor();
            const platforms = ['web', 'ios', 'android'];
            const buildFn = async (platform) => {
                await new Promise(resolve => setTimeout(resolve, 1));
                const success = platform === 'web'; // only web succeeds
                return createMockBuildResult(platform, success);
            };
            const result = await executor.execute(platforms, buildFn);
            expect(result.successCount).toBe(1);
            expect(result.failureCount).toBe(2);
            expect(result.totalDuration).toBeGreaterThanOrEqual(0);
        });
        it('should throw error when no platforms specified', async () => {
            const executor = new SequentialExecutor_1.SequentialExecutor();
            const buildFn = async (platform) => {
                return createMockBuildResult(platform, true);
            };
            await expect(executor.execute([], buildFn)).rejects.toThrow('No platforms specified for sequential execution');
        });
    });
    describe('timeout handling', () => {
        it('should timeout builds that exceed buildTimeout', async () => {
            const executor = new SequentialExecutor_1.SequentialExecutor({ buildTimeout: 50 });
            const platforms = ['web'];
            const buildFn = async (platform) => {
                await new Promise(resolve => setTimeout(resolve, 200));
                return createMockBuildResult(platform, true);
            };
            const result = await executor.execute(platforms, buildFn);
            expect(result.results).toHaveLength(1);
            expect(result.results[0].success).toBe(false);
            expect(result.results[0].errors[0].message).toContain('timeout');
        });
        it('should handle build errors gracefully', async () => {
            const executor = new SequentialExecutor_1.SequentialExecutor();
            const platforms = ['web'];
            const buildFn = async () => {
                throw new Error('Build error');
            };
            const result = await executor.execute(platforms, buildFn);
            expect(result.results).toHaveLength(1);
            expect(result.results[0].success).toBe(false);
            expect(result.results[0].errors[0].message).toBe('Build error');
        });
    });
    describe('cancellation', () => {
        it('should support cancellation during execution', async () => {
            const executor = new SequentialExecutor_1.SequentialExecutor();
            const platforms = ['web', 'ios', 'android'];
            const buildFn = async (platform) => {
                if (platform === 'ios') {
                    executor.cancel();
                }
                await new Promise(resolve => setTimeout(resolve, 50));
                return createMockBuildResult(platform, true);
            };
            const result = await executor.execute(platforms, buildFn);
            expect(result.results.length).toBeLessThan(3);
            expect(result.skippedPlatforms.length).toBeGreaterThan(0);
        });
    });
    describe('progress reporting', () => {
        it('should report progress with correct percentages', async () => {
            const progressUpdates = [];
            const executor = new SequentialExecutor_1.SequentialExecutor({
                onProgress: (progress) => progressUpdates.push({ ...progress }),
            });
            const platforms = ['web', 'ios', 'android'];
            const buildFn = async (platform) => {
                return createMockBuildResult(platform, true);
            };
            await executor.execute(platforms, buildFn);
            const percentages = progressUpdates.map(p => p.percentComplete);
            expect(percentages).toContain(0);
            expect(percentages[percentages.length - 1]).toBe(100);
        });
        it('should track success and failure counts in progress', async () => {
            const progressUpdates = [];
            const executor = new SequentialExecutor_1.SequentialExecutor({
                onProgress: (progress) => progressUpdates.push({ ...progress }),
            });
            const platforms = ['web', 'ios', 'android'];
            const buildFn = async (platform) => {
                const success = platform !== 'ios';
                return createMockBuildResult(platform, success);
            };
            await executor.execute(platforms, buildFn);
            const finalProgress = progressUpdates[progressUpdates.length - 1];
            expect(finalProgress.successCount).toBe(2);
            expect(finalProgress.failureCount).toBe(1);
        });
    });
});
//# sourceMappingURL=SequentialExecutor.test.js.map