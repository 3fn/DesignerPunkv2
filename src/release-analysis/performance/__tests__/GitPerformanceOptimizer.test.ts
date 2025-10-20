import { GitPerformanceOptimizer } from '../GitPerformanceOptimizer';
import { execSync } from 'child_process';
import { existsSync } from 'fs';

// Mock child_process and fs
jest.mock('child_process');
jest.mock('fs');

const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;
const mockExistsSync = existsSync as jest.MockedFunction<typeof existsSync>;

describe('GitPerformanceOptimizer', () => {
  let optimizer: GitPerformanceOptimizer;
  const mockWorkingDir = '/test/repo';

  beforeEach(() => {
    optimizer = new GitPerformanceOptimizer(mockWorkingDir, {
      maxCommitsPerBatch: 50,
      enableShallowClone: false,
      useGitCache: true,
      parallelFileProcessing: true,
      maxConcurrentOperations: 2,
      cacheExpirationMs: 60000
    });

    // Reset mocks
    jest.clearAllMocks();
    mockExistsSync.mockReturnValue(true);
  });

  describe('findLastReleaseOptimized', () => {
    it('should find last release tag with caching', async () => {
      // Mock Git commands
      mockExecSync
        .mockReturnValueOnce('v1.2.0\nv1.1.0\nv1.0.0\n') // tag list
        .mockReturnValueOnce('abc123def456') // rev-list for tag
        .mockReturnValueOnce('2023-10-20 10:30:00 +0000') // log date
        .mockReturnValueOnce('Release version 1.2.0'); // tag message

      const result = await optimizer.findLastReleaseOptimized();

      expect(result.data).toEqual({
        name: 'v1.2.0',
        commit: 'abc123def456',
        date: new Date('2023-10-20 10:30:00 +0000'),
        message: 'Release version 1.2.0'
      });
      expect(result.performanceMetrics.cacheHit).toBe(false);
      expect(result.performanceMetrics.processedItems).toBe(3);
    });

    it('should return cached result on second call', async () => {
      // First call
      mockExecSync
        .mockReturnValueOnce('v1.2.0\n')
        .mockReturnValueOnce('abc123def456')
        .mockReturnValueOnce('2023-10-20 10:30:00 +0000')
        .mockReturnValueOnce('Release version 1.2.0');

      await optimizer.findLastReleaseOptimized();

      // Second call should use cache
      const result = await optimizer.findLastReleaseOptimized();

      expect(result.performanceMetrics.cacheHit).toBe(true);
      expect(mockExecSync).toHaveBeenCalledTimes(4); // Only from first call
    });

    it('should handle no tags found', async () => {
      mockExecSync.mockReturnValueOnce(''); // empty tag list

      const result = await optimizer.findLastReleaseOptimized();

      expect(result.data).toBeNull();
      expect(result.performanceMetrics.processedItems).toBe(0);
    });

    it('should filter non-release tags', async () => {
      mockExecSync
        .mockReturnValueOnce('feature-branch\nv1.2.0\ntest-tag\n')
        .mockReturnValueOnce('abc123def456')
        .mockReturnValueOnce('2023-10-20 10:30:00 +0000')
        .mockReturnValueOnce('');

      const result = await optimizer.findLastReleaseOptimized();

      expect(result.data?.name).toBe('v1.2.0');
    });
  });

  describe('getChangesSinceOptimized', () => {
    it('should get changes with parallel processing', async () => {
      const reference = 'v1.1.0';
      
      // Mock Git commands
      mockExecSync
        .mockReturnValueOnce('HEAD_COMMIT') // rev-parse HEAD
        .mockReturnValueOnce('OLD_COMMIT') // rev-parse reference
        .mockReturnValueOnce('5') // rev-list count
        .mockReturnValueOnce('commit1|c1|author|2023-10-20|message1\nfile1.md\nfile2.md\n\ncommit2|c2|author|2023-10-19|message2\nfile3.md') // log with files
        .mockReturnValueOnce('A\tfile1.md\nM\tfile2.md\nD\tfile3.md') // diff --name-status
        .mockReturnValueOnce('2023-10-19 10:00:00 +0000'); // commit date

      const result = await optimizer.getChangesSinceOptimized(reference);

      expect(result.data.commits).toHaveLength(2);
      expect(result.data.addedFiles).toContain('file1.md');
      expect(result.data.modifiedFiles).toContain('file2.md');
      expect(result.data.deletedFiles).toContain('file3.md');
      expect(result.performanceMetrics.cacheHit).toBe(false);
    });

    it('should use cache for repeated requests', async () => {
      const reference = 'v1.1.0';
      
      // First call setup
      mockExecSync
        .mockReturnValueOnce('HEAD_COMMIT')
        .mockReturnValueOnce('OLD_COMMIT')
        .mockReturnValueOnce('0') // no commits
        .mockReturnValueOnce('') // empty diff
        .mockReturnValueOnce('2023-10-19 10:00:00 +0000');

      await optimizer.getChangesSinceOptimized(reference);

      // Second call should use cache
      const result = await optimizer.getChangesSinceOptimized(reference);

      expect(result.performanceMetrics.cacheHit).toBe(true);
    });

    it('should handle empty changes', async () => {
      const reference = 'v1.1.0';
      
      mockExecSync
        .mockReturnValueOnce('HEAD_COMMIT')
        .mockReturnValueOnce('OLD_COMMIT')
        .mockReturnValueOnce('0') // no commits
        .mockReturnValueOnce('') // empty diff
        .mockReturnValueOnce('2023-10-19 10:00:00 +0000');

      const result = await optimizer.getChangesSinceOptimized(reference);

      expect(result.data.commits).toHaveLength(0);
      expect(result.data.addedFiles).toHaveLength(0);
      expect(result.data.modifiedFiles).toHaveLength(0);
      expect(result.data.deletedFiles).toHaveLength(0);
    });
  });

  describe('performance metrics', () => {
    it('should track performance metrics', async () => {
      mockExecSync.mockReturnValue('');

      const result = await optimizer.findLastReleaseOptimized();

      expect(result.performanceMetrics).toHaveProperty('duration');
      expect(result.performanceMetrics).toHaveProperty('cacheHit');
      expect(result.performanceMetrics).toHaveProperty('processedItems');
      expect(typeof result.performanceMetrics.duration).toBe('number');
    });

    it('should provide performance report', () => {
      const report = optimizer.getPerformanceMetrics();

      expect(report).toHaveProperty('totalDuration');
      expect(report).toHaveProperty('operationCount');
      expect(report).toHaveProperty('averageDuration');
      expect(report).toHaveProperty('metrics');
    });

    it('should provide cache statistics', () => {
      const stats = optimizer.getCacheStats();

      expect(stats).toHaveProperty('hits');
      expect(stats).toHaveProperty('misses');
      expect(stats).toHaveProperty('hitRate');
      expect(stats).toHaveProperty('size');
    });
  });

  describe('cache management', () => {
    it('should reset caches and metrics', () => {
      optimizer.reset();

      const metrics = optimizer.getPerformanceMetrics();
      const cacheStats = optimizer.getCacheStats();

      expect(metrics.operationCount).toBe(0);
      expect(cacheStats.size).toBe(0);
    });

    it('should prune old cache entries', () => {
      const pruned = optimizer.pruneCaches();

      expect(typeof pruned).toBe('number');
      expect(pruned).toBeGreaterThanOrEqual(0);
    });
  });

  describe('error handling', () => {
    it('should handle Git command failures gracefully', async () => {
      mockExecSync.mockImplementation(() => {
        throw new Error('Git command failed');
      });

      await expect(optimizer.findLastReleaseOptimized()).rejects.toThrow();
    });

    it('should handle invalid references', async () => {
      mockExecSync
        .mockReturnValueOnce('HEAD_COMMIT')
        .mockImplementationOnce(() => {
          throw new Error('invalid reference');
        });

      await expect(optimizer.getChangesSinceOptimized('invalid-ref')).rejects.toThrow();
    });
  });

  describe('batching', () => {
    it('should process large commit lists in batches', async () => {
      const reference = 'v1.0.0';
      
      // Mock large number of commits
      mockExecSync
        .mockReturnValueOnce('HEAD_COMMIT')
        .mockReturnValueOnce('OLD_COMMIT')
        .mockReturnValueOnce('150') // 150 commits (more than batch size of 50)
        .mockReturnValue(''); // Empty responses for batch processing

      const result = await optimizer.getChangesSinceOptimized(reference);

      expect(result.performanceMetrics.batchCount).toBeGreaterThan(1);
    });
  });
});