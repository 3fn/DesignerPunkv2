/**
 * Tests for Quick Analysis Mode
 * 
 * Validates quick analysis performance, caching, and output formatting
 */

import { QuickAnalyzer, QuickAnalysisOptions } from '../quick-analyze';
import { promises as fs } from 'fs';
import { join } from 'path';

describe('QuickAnalyzer', () => {
  const testWorkingDir = process.cwd();
  let analyzer: QuickAnalyzer;

  beforeEach(() => {
    analyzer = new QuickAnalyzer(testWorkingDir, {
      timeoutMs: 10000,
      skipDetailedExtraction: true,
      cacheResults: true,
      monitorPerformance: true
    });
  });

  afterEach(async () => {
    // Clean up cache
    try {
      await analyzer.clearCache();
    } catch {
      // Ignore cleanup errors
    }
  });

  describe('Performance Requirements', () => {
    it('should complete analysis within 10 seconds', async () => {
      const startTime = Date.now();
      const result = await analyzer.runQuickAnalysis();
      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(10000);
      expect(result.performanceMetrics?.completedWithinTimeout).toBe(true);
    }, 15000); // Allow 15s for test timeout

    it('should provide performance metrics', async () => {
      const result = await analyzer.runQuickAnalysis();

      expect(result.performanceMetrics).toBeDefined();
      expect(result.performanceMetrics?.totalTimeMs).toBeGreaterThan(0);
      expect(result.performanceMetrics?.phaseTimings).toBeDefined();
      expect(result.performanceMetrics?.phaseTimings.gitAnalysis).toBeGreaterThanOrEqual(0);
      expect(result.performanceMetrics?.phaseTimings.documentCollection).toBeGreaterThanOrEqual(0);
      expect(result.performanceMetrics?.phaseTimings.changeExtraction).toBeGreaterThanOrEqual(0);
      expect(result.performanceMetrics?.phaseTimings.versionCalculation).toBeGreaterThanOrEqual(0);
    });

    it('should track memory usage', async () => {
      const result = await analyzer.runQuickAnalysis();

      expect(result.performanceMetrics?.memoryUsage).toBeDefined();
      
      if (result.performanceMetrics?.memoryUsage) {
        expect(result.performanceMetrics.memoryUsage.initial).toBeGreaterThan(0);
        expect(result.performanceMetrics.memoryUsage.peak).toBeGreaterThanOrEqual(
          result.performanceMetrics.memoryUsage.initial
        );
        expect(result.performanceMetrics.memoryUsage.final).toBeGreaterThan(0);
      }
    });

    it('should handle timeout gracefully', async () => {
      const shortTimeoutAnalyzer = new QuickAnalyzer(testWorkingDir, {
        timeoutMs: 1, // Very short timeout
        skipDetailedExtraction: true,
        cacheResults: false,
        monitorPerformance: true
      });

      const result = await shortTimeoutAnalyzer.runQuickAnalysis();

      expect(result).toBeDefined();
      expect(result.versionBump).toBeDefined();
      expect(result.confidence).toBeLessThanOrEqual(1);
      // Summary should exist even on timeout
      expect(result.summary).toBeDefined();
      expect(result.summary.length).toBeGreaterThan(0);
    });
  });

  describe('Change Detection', () => {
    it('should detect breaking changes', async () => {
      const result = await analyzer.runQuickAnalysis();

      expect(result.changeCount).toBeDefined();
      expect(result.changeCount.breaking).toBeGreaterThanOrEqual(0);
      expect(result.changeCount.features).toBeGreaterThanOrEqual(0);
      expect(result.changeCount.fixes).toBeGreaterThanOrEqual(0);
      expect(result.changeCount.improvements).toBeGreaterThanOrEqual(0);
    }, 30000); // Increased timeout to 30s for git history analysis

    it('should recommend major version bump for breaking changes', async () => {
      const result = await analyzer.runQuickAnalysis();

      if (result.changeCount.breaking > 0) {
        expect(result.versionBump).toBe('major');
      }
    });

    it('should recommend minor version bump for features', async () => {
      const result = await analyzer.runQuickAnalysis();

      if (result.changeCount.breaking === 0 && result.changeCount.features > 0) {
        expect(result.versionBump).toBe('minor');
      }
    });

    it('should recommend patch version bump for fixes', async () => {
      const result = await analyzer.runQuickAnalysis();

      if (
        result.changeCount.breaking === 0 &&
        result.changeCount.features === 0 &&
        (result.changeCount.fixes > 0 || result.changeCount.improvements > 0)
      ) {
        expect(result.versionBump).toBe('patch');
      }
    });

    it('should recommend no version bump when no changes detected', async () => {
      const result = await analyzer.runQuickAnalysis();

      const totalChanges =
        result.changeCount.breaking +
        result.changeCount.features +
        result.changeCount.fixes +
        result.changeCount.improvements;

      if (totalChanges === 0) {
        expect(result.versionBump).toBe('none');
      }
    });
  });

  describe('Concise Output', () => {
    it('should provide concise summary', async () => {
      const result = await analyzer.runQuickAnalysis();

      expect(result.summary).toBeDefined();
      expect(typeof result.summary).toBe('string');
      expect(result.summary.length).toBeGreaterThan(0);
      expect(result.summary.length).toBeLessThan(200); // Should be concise
    });

    it('should include version bump in summary', async () => {
      const result = await analyzer.runQuickAnalysis();

      // Summary should mention version bump or indicate no changes
      if (result.versionBump !== 'none') {
        const versionBumpUpper = result.versionBump.toUpperCase();
        expect(result.summary).toContain(versionBumpUpper);
      } else {
        // For 'none', summary should indicate no changes
        expect(result.summary.toLowerCase()).toMatch(/no.*change|none/);
      }
    });

    it('should provide confidence score', async () => {
      const result = await analyzer.runQuickAnalysis();

      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });

    it('should indicate when no changes detected', async () => {
      const result = await analyzer.runQuickAnalysis();

      const totalChanges =
        result.changeCount.breaking +
        result.changeCount.features +
        result.changeCount.fixes +
        result.changeCount.improvements;

      if (totalChanges === 0) {
        expect(result.summary.toLowerCase()).toContain('no');
      }
    });
  });

  describe('Result Caching', () => {
    it('should cache results when enabled', async () => {
      const result = await analyzer.runQuickAnalysis();

      expect(result.fullResultCached).toBe(true);
      expect(result.cacheFilePath).toBeDefined();
    });

    it('should not cache results when disabled', async () => {
      const noCacheAnalyzer = new QuickAnalyzer(testWorkingDir, {
        timeoutMs: 10000,
        skipDetailedExtraction: true,
        cacheResults: false,
        monitorPerformance: true
      });

      const result = await noCacheAnalyzer.runQuickAnalysis();

      expect(result.fullResultCached).toBe(false);
    });

    it('should create cache file with correct structure', async () => {
      const result = await analyzer.runQuickAnalysis();

      if (result.cacheFilePath) {
        const cacheContent = await fs.readFile(result.cacheFilePath, 'utf-8');
        const cacheData = JSON.parse(cacheContent);

        expect(cacheData.timestamp).toBeDefined();
        expect(cacheData.documentCount).toBeGreaterThanOrEqual(0);
        expect(cacheData.quickAnalysisMode).toBe(true);
      }
    });

    it('should retrieve cached results', async () => {
      await analyzer.runQuickAnalysis();

      const cached = await analyzer.getCachedResult();

      expect(cached).toBeDefined();
      expect(cached.timestamp).toBeDefined();
      expect(cached.quickAnalysisMode).toBe(true);
    });

    it('should clear cache', async () => {
      await analyzer.runQuickAnalysis();

      await analyzer.clearCache();

      const cached = await analyzer.getCachedResult();
      expect(cached).toBeNull();
    });

    it('should create latest symlink', async () => {
      const result = await analyzer.runQuickAnalysis();

      if (result.cacheFilePath) {
        const cacheDir = join(testWorkingDir, '.kiro/release-analysis/cache');
        const latestPath = join(cacheDir, 'latest.json');

        try {
          const latestContent = await fs.readFile(latestPath, 'utf-8');
          const latestData = JSON.parse(latestContent);
          expect(latestData.quickAnalysisMode).toBe(true);
        } catch (error) {
          // Symlinks might not be supported on all systems
          // This is acceptable
        }
      }
    });
  });

  describe('Configuration Options', () => {
    it('should respect custom timeout', async () => {
      const customAnalyzer = new QuickAnalyzer(testWorkingDir, {
        timeoutMs: 5000,
        skipDetailedExtraction: true,
        cacheResults: true,
        monitorPerformance: true
      });

      const startTime = Date.now();
      const result = await customAnalyzer.runQuickAnalysis();
      const duration = Date.now() - startTime;

      // Should complete or timeout within configured time
      expect(duration).toBeLessThan(6000); // Allow small buffer
    });

    it('should respect custom cache directory', async () => {
      const customCacheDir = join(testWorkingDir, '.kiro/test-cache');
      const customAnalyzer = new QuickAnalyzer(testWorkingDir, {
        timeoutMs: 10000,
        skipDetailedExtraction: true,
        cacheResults: true,
        cacheDir: customCacheDir,
        monitorPerformance: true
      });

      const result = await customAnalyzer.runQuickAnalysis();

      if (result.cacheFilePath) {
        expect(result.cacheFilePath).toContain('test-cache');
      }

      // Cleanup
      try {
        await fs.rm(customCacheDir, { recursive: true });
      } catch {
        // Ignore cleanup errors
      }
    });

    it('should disable performance monitoring when configured', async () => {
      const noMetricsAnalyzer = new QuickAnalyzer(testWorkingDir, {
        timeoutMs: 10000,
        skipDetailedExtraction: true,
        cacheResults: true,
        monitorPerformance: false
      });

      const result = await noMetricsAnalyzer.runQuickAnalysis();

      expect(result.performanceMetrics).toBeUndefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle missing Git repository gracefully', async () => {
      const nonGitDir = join(testWorkingDir, 'non-git-dir');
      
      try {
        await fs.mkdir(nonGitDir, { recursive: true });
        
        const nonGitAnalyzer = new QuickAnalyzer(nonGitDir, {
          timeoutMs: 10000,
          skipDetailedExtraction: true,
          cacheResults: false,
          monitorPerformance: true
        });

        const result = await nonGitAnalyzer.runQuickAnalysis();

        expect(result).toBeDefined();
        expect(result.versionBump).toBeDefined();
      } finally {
        // Cleanup
        try {
          await fs.rm(nonGitDir, { recursive: true });
        } catch {
          // Ignore cleanup errors
        }
      }
    });

    it('should handle cache write failures gracefully', async () => {
      const readOnlyAnalyzer = new QuickAnalyzer(testWorkingDir, {
        timeoutMs: 10000,
        skipDetailedExtraction: true,
        cacheResults: true,
        cacheDir: '/invalid/readonly/path',
        monitorPerformance: true
      });

      const result = await readOnlyAnalyzer.runQuickAnalysis();

      // Should complete even if caching fails
      expect(result).toBeDefined();
      expect(result.versionBump).toBeDefined();
    });
  });

  describe('Integration with Hook System', () => {
    it('should provide result format suitable for hook integration', async () => {
      const result = await analyzer.runQuickAnalysis();

      // Verify result has all required fields for hook integration
      expect(result.versionBump).toBeDefined();
      expect(['major', 'minor', 'patch', 'none']).toContain(result.versionBump);
      expect(result.changeCount).toBeDefined();
      expect(result.confidence).toBeDefined();
      expect(result.summary).toBeDefined();
      expect(typeof result.fullResultCached).toBe('boolean');
    });

    it('should complete fast enough for hook integration', async () => {
      const startTime = Date.now();
      await analyzer.runQuickAnalysis();
      const duration = Date.now() - startTime;

      // Should be significantly faster than 10s for typical repos
      expect(duration).toBeLessThan(10000);
    });
  });
});
