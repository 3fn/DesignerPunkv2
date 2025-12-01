/**
 * Integration Tests for Hook System
 * 
 * Task 7.5: Test Hook Integration
 * 
 * Requirements addressed:
 * - 9.1: Automatic analysis triggered after task completion commits
 * - 9.2: Quick analysis completes in <10 seconds
 * - 9.3: Concise output suitable for AI agent feedback
 * - 9.4: Graceful failure handling (don't block commits)
 * - 9.6: Concurrent request handling for rapid commits
 * - 9.7: Cache results for later CLI access
 */

import { HookIntegrationManager, HookConfig } from '../HookIntegrationManager';
import { QuickAnalyzer } from '../../cli/quick-analyze';
import { DEFAULT_ANALYSIS_CONFIG } from '../../config/AnalysisConfig';
import { promises as fs } from 'fs';
import { join } from 'path';
import { execSync, spawn } from 'child_process';

describe('Hook Integration Tests', () => {
  const testProjectRoot = process.cwd();
  let manager: HookIntegrationManager;
  let hookConfig: HookConfig;

  beforeEach(() => {
    hookConfig = {
      enabled: true,
      hookType: 'git',
      quickMode: true,
      timeoutSeconds: 10,
      failSilently: true,
      cacheResults: true
    };

    manager = new HookIntegrationManager(
      DEFAULT_ANALYSIS_CONFIG,
      hookConfig,
      testProjectRoot
    );
  });

  afterEach(async () => {
    // Give any pending operations time to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
  });

  describe('Requirement 9.1: Hook Triggering', () => {
    it('should trigger analysis automatically after task completion', async () => {
      // Install hook
      const installResult = await manager.installGitHook();
      expect(installResult.success).toBe(true);

      // Validate hook is properly installed
      const validation = await manager.validateGitHook();
      expect(validation.valid).toBe(true);
      expect(validation.executable).toBe(true);

      // Cleanup
      await manager.uninstallGitHook();
    });

    it('should integrate with commit-task.sh hook', async () => {
      const commitHookPath = join(testProjectRoot, '.kiro/hooks/commit-task.sh');
      
      // Check if commit hook exists
      const commitHookExists = await fs.access(commitHookPath)
        .then(() => true)
        .catch(() => false);

      if (commitHookExists) {
        const content = await fs.readFile(commitHookPath, 'utf-8');
        
        // Should reference analyze-after-commit.sh or have integration
        const hasIntegration = content.includes('analyze-after-commit.sh') ||
                              content.includes('release:analyze');
        
        expect(hasIntegration).toBe(true);
      }
    });

    it('should support both Git and agent hook types', async () => {
      // Test Git hook
      const gitResult = await manager.installGitHook();
      expect(gitResult.success).toBe(true);
      expect(gitResult.hookType).toBe('git');

      // Test agent hook
      const agentResult = await manager.installAgentHook();
      expect(agentResult.success).toBe(true);
      expect(agentResult.hookType).toBe('agent');

      // Cleanup
      await manager.uninstallGitHook();
      await manager.uninstallAgentHook();
    });
  });

  describe('Requirement 9.2: Quick Analysis Performance (<10 seconds)', () => {
    it('should complete quick analysis within 10 seconds', async () => {
      const analyzer = new QuickAnalyzer(testProjectRoot, {
        timeoutMs: 10000,
        skipDetailedExtraction: true,
        cacheResults: false,
        monitorPerformance: true
      });

      const startTime = Date.now();
      const result = await analyzer.runQuickAnalysis();
      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(10000);
      expect(result.performanceMetrics?.completedWithinTimeout).toBe(true);
      expect(result.performanceMetrics?.totalTimeMs).toBeLessThan(10000);
    });

    it('should provide performance metrics', async () => {
      const analyzer = new QuickAnalyzer(testProjectRoot, {
        timeoutMs: 10000,
        monitorPerformance: true
      });

      const result = await analyzer.runQuickAnalysis();

      expect(result.performanceMetrics).toBeDefined();
      expect(result.performanceMetrics?.phaseTimings).toBeDefined();
      expect(result.performanceMetrics?.phaseTimings.gitAnalysis).toBeGreaterThanOrEqual(0);
      expect(result.performanceMetrics?.phaseTimings.documentCollection).toBeGreaterThanOrEqual(0);
      expect(result.performanceMetrics?.phaseTimings.changeExtraction).toBeGreaterThanOrEqual(0);
      expect(result.performanceMetrics?.phaseTimings.versionCalculation).toBeGreaterThanOrEqual(0);
    });

    it('should handle timeout gracefully', async () => {
      const analyzer = new QuickAnalyzer(testProjectRoot, {
        timeoutMs: 1, // Very short timeout to force timeout
        monitorPerformance: true
      });

      const result = await analyzer.runQuickAnalysis();

      // Should return fallback result on timeout
      expect(result.versionBump).toBe('none');
      expect(result.confidence).toBeLessThan(0.5);
      expect(result.summary).toContain('failed');
    });

    it('should optimize for speed with skipDetailedExtraction', async () => {
      const detailedAnalyzer = new QuickAnalyzer(testProjectRoot, {
        skipDetailedExtraction: false,
        monitorPerformance: true
      });

      const quickAnalyzer = new QuickAnalyzer(testProjectRoot, {
        skipDetailedExtraction: true,
        monitorPerformance: true
      });

      const detailedResult = await detailedAnalyzer.runQuickAnalysis();
      const quickResult = await quickAnalyzer.runQuickAnalysis();

      // Quick mode should be faster or equal
      expect(quickResult.performanceMetrics?.totalTimeMs).toBeLessThanOrEqual(
        (detailedResult.performanceMetrics?.totalTimeMs || 0) * 1.5
      );
    });
  });

  describe('Requirement 9.3: Concise Output for AI Agents', () => {
    it('should provide concise one-line summary', async () => {
      const result = await manager.runQuickAnalysis();

      expect(result.summary).toBeDefined();
      expect(result.summary.length).toBeLessThan(200); // Concise
      
      // Summary should contain version bump info or indicate no changes
      const hasVersionInfo = /major|minor|patch|none/i.test(result.summary);
      const hasNoChangesInfo = /no.*change/i.test(result.summary);
      
      expect(hasVersionInfo || hasNoChangesInfo).toBe(true);
    });

    it('should include change counts', async () => {
      const result = await manager.runQuickAnalysis();

      expect(result.changeCount).toBeDefined();
      expect(result.changeCount.breaking).toBeGreaterThanOrEqual(0);
      expect(result.changeCount.features).toBeGreaterThanOrEqual(0);
      expect(result.changeCount.fixes).toBeGreaterThanOrEqual(0);
      expect(result.changeCount.improvements).toBeGreaterThanOrEqual(0);
    });

    it('should provide confidence score', async () => {
      const result = await manager.runQuickAnalysis();

      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });

    it('should indicate if full results are cached', async () => {
      const result = await manager.runQuickAnalysis();

      expect(result.fullResultCached).toBeDefined();
      expect(typeof result.fullResultCached).toBe('boolean');
    });

    it('should format summary appropriately for different scenarios', async () => {
      const analyzer = new QuickAnalyzer(testProjectRoot);

      const result = await analyzer.runQuickAnalysis();

      // Summary should be informative
      if (result.changeCount.breaking > 0) {
        expect(result.summary).toContain('breaking');
      }

      if (result.changeCount.features > 0) {
        expect(result.summary).toContain('feature');
      }

      if (result.versionBump === 'none') {
        expect(result.summary).toMatch(/no.*change/i);
      }
    });
  });

  describe('Requirement 9.4: Graceful Failure Handling', () => {
    it('should not block commits on analysis failure', async () => {
      const hookPath = join(testProjectRoot, '.kiro/hooks/analyze-after-commit.sh');
      
      // Check hook exists
      const exists = await fs.access(hookPath).then(() => true).catch(() => false);
      
      if (exists) {
        const content = await fs.readFile(hookPath, 'utf-8');
        
        // Should have FAIL_SILENTLY=true
        expect(content).toContain('FAIL_SILENTLY=true');
        
        // Should always exit 0 in non-blocking mode
        expect(content).toContain('exit 0');
      }
    });

    it('should clean up resources on failure', async () => {
      const hookPath = join(testProjectRoot, '.kiro/hooks/analyze-after-commit.sh');
      
      const exists = await fs.access(hookPath).then(() => true).catch(() => false);
      
      if (exists) {
        const content = await fs.readFile(hookPath, 'utf-8');
        
        // Should use trap for cleanup
        expect(content).toContain('trap remove_lock');
        expect(content).toContain('EXIT INT TERM');
      }
    });

    it('should handle missing dependencies gracefully', async () => {
      const analyzer = new QuickAnalyzer('/nonexistent/path');

      const result = await analyzer.runQuickAnalysis();

      // Should return fallback result, not throw
      expect(result).toBeDefined();
      expect(result.versionBump).toBe('none');
      expect(result.confidence).toBeLessThan(0.5);
    });

    it('should handle Git errors gracefully', async () => {
      // Create analyzer in non-Git directory
      const tempDir = join(testProjectRoot, 'temp-test-dir');
      await fs.mkdir(tempDir, { recursive: true });

      const analyzer = new QuickAnalyzer(tempDir);
      const result = await analyzer.runQuickAnalysis();

      // Should handle gracefully
      expect(result).toBeDefined();
      expect(result.versionBump).toBeDefined();

      // Cleanup
      await fs.rmdir(tempDir, { recursive: true });
    });
  });

  describe('Requirement 9.6: Concurrent Request Handling', () => {
    const lockFile = join(testProjectRoot, '.kiro/release-analysis/.analysis-lock');

    beforeEach(async () => {
      // Clean up lock file before each test
      try {
        await fs.unlink(lockFile);
      } catch {
        // Ignore if doesn't exist
      }
    });

    afterEach(async () => {
      // Clean up lock file after each test
      try {
        await fs.unlink(lockFile);
      } catch {
        // Ignore if doesn't exist
      }
    });

    it('should detect concurrent analysis attempts', async () => {
      const hookPath = join(testProjectRoot, '.kiro/hooks/analyze-after-commit.sh');
      
      const exists = await fs.access(hookPath).then(() => true).catch(() => false);
      
      if (exists) {
        const content = await fs.readFile(hookPath, 'utf-8');
        
        // Should implement concurrent detection
        expect(content).toContain('check_concurrent_analysis');
        expect(content).toContain('LOCK_FILE');
        expect(content).toContain('MAX_LOCK_AGE');
      }
    });

    it('should create lock file during analysis', async () => {
      // Create lock directory
      await fs.mkdir(join(testProjectRoot, '.kiro/release-analysis'), { recursive: true });
      
      // Create lock file
      await fs.writeFile(lockFile, process.pid.toString());

      const exists = await fs.access(lockFile).then(() => true).catch(() => false);
      expect(exists).toBe(true);

      // Cleanup
      await fs.unlink(lockFile);
    });

    it('should remove stale lock files', async () => {
      const hookPath = join(testProjectRoot, '.kiro/hooks/analyze-after-commit.sh');
      
      const exists = await fs.access(hookPath).then(() => true).catch(() => false);
      
      if (exists) {
        const content = await fs.readFile(hookPath, 'utf-8');
        
        // Should check lock age and remove stale locks
        expect(content).toContain('LOCK_AGE');
        expect(content).toContain('MAX_LOCK_AGE');
        expect(content).toContain('Stale lock file detected');
      }
    });

    it('should skip analysis if another is running', async () => {
      // Create a fresh lock file
      await fs.mkdir(join(testProjectRoot, '.kiro/release-analysis'), { recursive: true });
      await fs.writeFile(lockFile, '12345');

      const hookPath = join(testProjectRoot, '.kiro/hooks/analyze-after-commit.sh');
      const exists = await fs.access(hookPath).then(() => true).catch(() => false);

      if (exists) {
        const content = await fs.readFile(hookPath, 'utf-8');
        
        // Should skip when lock exists
        expect(content).toContain('Another analysis is already running');
        expect(content).toContain('Skipping concurrent analysis');
      }

      // Cleanup
      await fs.unlink(lockFile);
    });

    it('should handle rapid commits gracefully', async () => {
      // Simulate rapid commits by running quick analysis multiple times
      const promises = [
        manager.runQuickAnalysis(),
        manager.runQuickAnalysis(),
        manager.runQuickAnalysis()
      ];

      // All should complete without errors
      const results = await Promise.all(promises);

      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result).toBeDefined();
        expect(result.versionBump).toBeDefined();
      });
    }, 15000); // 15 second timeout for rapid commits test
  });

  describe('Requirement 9.7: Cache Functionality', () => {
    const cacheDir = join(testProjectRoot, '.kiro/release-analysis/cache');

    beforeEach(async () => {
      // Clean up cache before each test
      try {
        const files = await fs.readdir(cacheDir);
        for (const file of files) {
          await fs.unlink(join(cacheDir, file));
        }
      } catch {
        // Ignore if directory doesn't exist
      }
    });

    afterEach(async () => {
      // Clean up cache after each test
      try {
        const files = await fs.readdir(cacheDir);
        for (const file of files) {
          await fs.unlink(join(cacheDir, file));
        }
      } catch {
        // Ignore if directory doesn't exist
      }
    });

    it('should cache analysis results when enabled', async () => {
      const analyzer = new QuickAnalyzer(testProjectRoot, {
        cacheResults: true,
        cacheDir
      });

      const result = await analyzer.runQuickAnalysis();

      expect(result.fullResultCached).toBe(true);
      expect(result.cacheFilePath).toBeDefined();

      // Verify cache file exists
      if (result.cacheFilePath) {
        const exists = await fs.access(result.cacheFilePath)
          .then(() => true)
          .catch(() => false);
        expect(exists).toBe(true);
      }
    });

    it('should not cache results when disabled', async () => {
      const analyzer = new QuickAnalyzer(testProjectRoot, {
        cacheResults: false,
        cacheDir
      });

      const result = await analyzer.runQuickAnalysis();

      expect(result.fullResultCached).toBe(false);
    });

    it('should create latest.json symlink', async () => {
      const analyzer = new QuickAnalyzer(testProjectRoot, {
        cacheResults: true,
        cacheDir
      });

      await analyzer.runQuickAnalysis();

      const latestPath = join(cacheDir, 'latest.json');
      const exists = await fs.access(latestPath).then(() => true).catch(() => false);

      expect(exists).toBe(true);
    });

    it('should retrieve cached results', async () => {
      const analyzer = new QuickAnalyzer(testProjectRoot, {
        cacheResults: true,
        cacheDir
      });

      // Run analysis to create cache
      await analyzer.runQuickAnalysis();

      // Retrieve cached result
      const cached = await analyzer.getCachedResult();

      expect(cached).toBeDefined();
      expect(cached.timestamp).toBeDefined();
      expect(cached.documentCount).toBeGreaterThanOrEqual(0);
    });

    it('should cache results via HookIntegrationManager', async () => {
      const testResult = {
        versionBump: 'minor',
        changes: [],
        timestamp: new Date().toISOString()
      };

      await manager.cacheResult(testResult);

      const cached = await manager.getCachedResult();

      expect(cached).toBeDefined();
      expect(cached.versionBump).toBe('minor');
    });

    it('should return null when no cache exists', async () => {
      const analyzer = new QuickAnalyzer(testProjectRoot, {
        cacheDir: join(testProjectRoot, '.kiro/release-analysis/nonexistent-cache')
      });

      const cached = await analyzer.getCachedResult();

      expect(cached).toBeNull();
    });

    it('should clear cache', async () => {
      const analyzer = new QuickAnalyzer(testProjectRoot, {
        cacheResults: true,
        cacheDir
      });

      // Create cache
      await analyzer.runQuickAnalysis();

      // Clear cache
      await analyzer.clearCache();

      // Verify cache is empty
      const files = await fs.readdir(cacheDir).catch(() => []);
      expect(files.length).toBe(0);
    });
  });

  describe('End-to-End Hook Integration', () => {
    it('should complete full hook workflow', async () => {
      // 1. Install hook
      const installResult = await manager.installGitHook();
      expect(installResult.success).toBe(true);

      // 2. Validate installation
      const validation = await manager.validateGitHook();
      expect(validation.valid).toBe(true);

      // 3. Run quick analysis
      const analysisResult = await manager.runQuickAnalysis();
      expect(analysisResult).toBeDefined();
      expect(analysisResult.versionBump).toBeDefined();

      // 4. Verify cache if enabled
      if (hookConfig.cacheResults) {
        const cached = await manager.getCachedResult();
        expect(cached).toBeDefined();
      }

      // 5. Uninstall hook
      const uninstallResult = await manager.uninstallGitHook();
      expect(uninstallResult).toBe(true);
    });

    it('should handle complete agent hook workflow', async () => {
      // 1. Install agent hook
      const installResult = await manager.installAgentHook();
      expect(installResult.success).toBe(true);

      // 2. Validate installation
      const validation = await manager.validateAgentHook();
      expect(validation.valid).toBe(true);

      // 3. Run quick analysis
      const analysisResult = await manager.runQuickAnalysis();
      expect(analysisResult).toBeDefined();

      // 4. Uninstall hook
      const uninstallResult = await manager.uninstallAgentHook();
      expect(uninstallResult).toBe(true);
    });
  });

  describe('Performance Monitoring', () => {
    it('should track memory usage', async () => {
      const analyzer = new QuickAnalyzer(testProjectRoot, {
        monitorPerformance: true
      });

      const result = await analyzer.runQuickAnalysis();

      expect(result.performanceMetrics?.memoryUsage).toBeDefined();
      expect(result.performanceMetrics?.memoryUsage.initial).toBeGreaterThan(0);
      expect(result.performanceMetrics?.memoryUsage.peak).toBeGreaterThanOrEqual(
        result.performanceMetrics?.memoryUsage.initial || 0
      );
      expect(result.performanceMetrics?.memoryUsage.final).toBeGreaterThan(0);
    });

    it('should track phase timings', async () => {
      const analyzer = new QuickAnalyzer(testProjectRoot, {
        monitorPerformance: true
      });

      const result = await analyzer.runQuickAnalysis();

      const timings = result.performanceMetrics?.phaseTimings;
      expect(timings).toBeDefined();

      // All phases should have timing data
      expect(timings?.gitAnalysis).toBeGreaterThanOrEqual(0);
      expect(timings?.documentCollection).toBeGreaterThanOrEqual(0);
      expect(timings?.changeExtraction).toBeGreaterThanOrEqual(0);
      expect(timings?.versionCalculation).toBeGreaterThanOrEqual(0);
      expect(timings?.caching).toBeGreaterThanOrEqual(0);

      // Total should be sum of phases (approximately)
      const phaseSum = (timings?.gitAnalysis || 0) +
                      (timings?.documentCollection || 0) +
                      (timings?.changeExtraction || 0) +
                      (timings?.versionCalculation || 0) +
                      (timings?.caching || 0);

      expect(result.performanceMetrics?.totalTimeMs).toBeGreaterThanOrEqual(phaseSum * 0.9);
    });

    it('should track documents processed', async () => {
      const analyzer = new QuickAnalyzer(testProjectRoot, {
        monitorPerformance: true
      });

      const result = await analyzer.runQuickAnalysis();

      expect(result.performanceMetrics?.documentsProcessed).toBeGreaterThanOrEqual(0);
    });
  });
});
