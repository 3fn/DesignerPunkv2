/**
 * @category evergreen
 * @purpose Verify system performance meets requirements and thresholds
 */
import { PerformanceBenchmarkRunner } from '../PerformanceBenchmarkRunner';
import { AnalysisConfigManager } from '../../config/AnalysisConfigManager';
import { join } from 'path';
import { existsSync, writeFileSync, mkdirSync } from 'fs';
import { tmpdir } from 'os';

/**
 * Performance regression test configuration
 */
interface RegressionTestConfig {
  name: string;
  documentCount: number;
  documentSize: number;
  maxExecutionTimeMs: number;
  maxMemoryUsageMB: number;
  minThroughputDocsPerSec: number;
  maxRegressionPercent: number;
}

/**
 * Performance Regression Tests
 * 
 * These tests ensure that performance optimizations don't introduce regressions
 * and that the system maintains acceptable performance characteristics over time.
 * 
 * Requirements addressed:
 * - Build regression tests for performance optimization
 * - Validate performance targets are maintained
 * - Detect performance degradation in CI/CD pipeline
 * - Ensure scalability characteristics remain stable
 */
describe('Performance Regression Tests', () => {
  let testDir: string;
  let benchmarkRunner: PerformanceBenchmarkRunner;
  let analysisConfig: any;

  // Performance regression test configurations
  const REGRESSION_TESTS: RegressionTestConfig[] = [
    {
      name: 'small-repository-regression',
      documentCount: 10,
      documentSize: 1024, // 1KB
      maxExecutionTimeMs: 5000, // 5 seconds
      maxMemoryUsageMB: 100, // 100MB
      minThroughputDocsPerSec: 5, // 5 docs/sec
      maxRegressionPercent: 15 // 15% regression threshold
    },
    {
      name: 'medium-repository-regression',
      documentCount: 50,
      documentSize: 2048, // 2KB
      maxExecutionTimeMs: 15000, // 15 seconds
      maxMemoryUsageMB: 256, // 256MB
      minThroughputDocsPerSec: 4, // 4 docs/sec
      maxRegressionPercent: 10 // 10% regression threshold
    },
    {
      name: 'large-repository-regression',
      documentCount: 100,
      documentSize: 4096, // 4KB
      maxExecutionTimeMs: 30000, // 30 seconds
      maxMemoryUsageMB: 512, // 512MB
      minThroughputDocsPerSec: 3, // 3 docs/sec
      maxRegressionPercent: 10 // 10% regression threshold
    }
  ];

  // Baseline performance data (would be loaded from stored baselines in real implementation)
  const PERFORMANCE_BASELINES = new Map<string, number>([
    ['small-repository-regression', 2000], // 2 seconds baseline
    ['medium-repository-regression', 8000], // 8 seconds baseline
    ['large-repository-regression', 20000] // 20 seconds baseline
  ]);

  beforeAll(async () => {
    // Create temporary test directory
    testDir = join(tmpdir(), `perf-regression-${Date.now()}`);
    mkdirSync(testDir, { recursive: true });

    // Load analysis configuration
    const configManager = AnalysisConfigManager.getInstance();
    analysisConfig = await configManager.getConfig();

    // Initialize benchmark runner
    benchmarkRunner = new PerformanceBenchmarkRunner(
      testDir,
      analysisConfig,
      {
        iterations: 3, // Reduced for faster CI
        warmupIterations: 1,
        enableDetailedLogging: false,
        saveResults: false, // Don't save in CI
        compareWithBaseline: false // Handle manually in tests
      }
    );
  });

  afterAll(() => {
    // Cleanup test directory
    try {
      require('fs').rmSync(testDir, { recursive: true, force: true });
    } catch (error) {
      console.warn(`Failed to cleanup test directory: ${error}`);
    }
  });

  describe('Performance Target Validation', () => {
    /**
     * Test that each configuration meets performance targets
     * Requirement: Validate performance targets are maintained
     */
    test.each(REGRESSION_TESTS)(
      'should meet performance targets for $name',
      async (config) => {
        const testConfig = {
          name: config.name,
          description: `Regression test for ${config.name}`,
          documentCount: config.documentCount,
          documentSize: config.documentSize,
          concurrency: 4,
          enableOptimizations: true,
          timeoutMs: config.maxExecutionTimeMs * 2 // Allow extra time for test environment
        };

        const result = await benchmarkRunner.runBenchmarkTest(testConfig);

        // Validate execution time
        expect(result.statistics.mean).toBeLessThan(config.maxExecutionTimeMs);

        // Validate memory usage
        const peakMemoryMB = result.metrics.memoryUsage.peak / 1024 / 1024;
        expect(peakMemoryMB).toBeLessThan(config.maxMemoryUsageMB);

        // Validate throughput
        expect(result.metrics.throughput.documentsPerSecond).toBeGreaterThan(config.minThroughputDocsPerSec);

        // Log results for monitoring
        console.log(`Performance validation for ${config.name}:`, {
          executionTime: `${result.statistics.mean.toFixed(1)}ms (target: <${config.maxExecutionTimeMs}ms)`,
          memoryUsage: `${peakMemoryMB.toFixed(1)}MB (target: <${config.maxMemoryUsageMB}MB)`,
          throughput: `${result.metrics.throughput.documentsPerSecond.toFixed(1)} docs/sec (target: >${config.minThroughputDocsPerSec} docs/sec)`,
          status: '✅ PASS'
        });
      },
      60000 // 1 minute timeout per test
    );
  });

  describe('Regression Detection', () => {
    /**
     * Test for performance regressions against baseline
     * Requirement: Detect performance degradation in CI/CD pipeline
     */
    test.each(REGRESSION_TESTS)(
      'should not regress from baseline for $name',
      async (config) => {
        const testConfig = {
          name: config.name,
          description: `Regression detection for ${config.name}`,
          documentCount: config.documentCount,
          documentSize: config.documentSize,
          concurrency: 4,
          enableOptimizations: true,
          timeoutMs: config.maxExecutionTimeMs * 2
        };

        const result = await benchmarkRunner.runBenchmarkTest(testConfig);
        const baseline = PERFORMANCE_BASELINES.get(config.name);

        if (baseline) {
          const regressionPercent = ((result.statistics.mean - baseline) / baseline) * 100;

          // Should not exceed regression threshold
          expect(regressionPercent).toBeLessThan(config.maxRegressionPercent);

          console.log(`Regression check for ${config.name}:`, {
            baseline: `${baseline}ms`,
            current: `${result.statistics.mean.toFixed(1)}ms`,
            regression: `${regressionPercent.toFixed(1)}%`,
            threshold: `${config.maxRegressionPercent}%`,
            status: regressionPercent < config.maxRegressionPercent ? '✅ PASS' : '❌ FAIL'
          });
        } else {
          // Store current result as new baseline
          console.log(`No baseline found for ${config.name}, current performance: ${result.statistics.mean.toFixed(1)}ms`);
        }
      },
      60000 // 1 minute timeout per test
    );
  });

  describe('Optimization Impact Validation', () => {
    /**
     * Test that optimizations provide measurable improvement
     * Requirement: Validate performance optimizations effectiveness
     */
    it('should show significant improvement with optimizations enabled', async () => {
      const baseConfig = {
        name: 'optimization-comparison',
        description: 'Compare optimized vs unoptimized performance',
        documentCount: 30,
        documentSize: 2048,
        concurrency: 4,
        timeoutMs: 60000
      };

      // Test without optimizations
      const unoptimizedResult = await benchmarkRunner.runBenchmarkTest({
        ...baseConfig,
        enableOptimizations: false
      });

      // Test with optimizations
      const optimizedResult = await benchmarkRunner.runBenchmarkTest({
        ...baseConfig,
        enableOptimizations: true
      });

      // Calculate improvement
      const improvementPercent = ((unoptimizedResult.statistics.mean - optimizedResult.statistics.mean) / unoptimizedResult.statistics.mean) * 100;

      // Optimizations should provide at least 20% improvement
      expect(improvementPercent).toBeGreaterThan(20);

      console.log('Optimization impact validation:', {
        unoptimized: `${unoptimizedResult.statistics.mean.toFixed(1)}ms`,
        optimized: `${optimizedResult.statistics.mean.toFixed(1)}ms`,
        improvement: `${improvementPercent.toFixed(1)}%`,
        status: improvementPercent > 20 ? '✅ PASS' : '❌ FAIL'
      });
    }, 120000); // 2 minute timeout

    /**
     * Test cache effectiveness
     * Requirement: Validate caching optimizations
     */
    it('should demonstrate effective caching performance', async () => {
      const cacheConfig = {
        name: 'cache-effectiveness',
        description: 'Test cache performance impact',
        documentCount: 25,
        documentSize: 2048,
        concurrency: 2,
        enableOptimizations: true,
        timeoutMs: 60000
      };

      // Run test twice to measure cache effectiveness
      const firstRun = await benchmarkRunner.runBenchmarkTest(cacheConfig);
      const secondRun = await benchmarkRunner.runBenchmarkTest(cacheConfig);

      // Second run should be faster due to caching
      const cacheSpeedup = firstRun.statistics.mean / secondRun.statistics.mean;

      // Cache should provide at least 1.5x speedup
      expect(cacheSpeedup).toBeGreaterThan(1.5);

      // Cache hit rate should be reasonable
      expect(secondRun.metrics.cacheStats.hitRate).toBeGreaterThan(0.3); // 30% hit rate

      console.log('Cache effectiveness validation:', {
        firstRun: `${firstRun.statistics.mean.toFixed(1)}ms`,
        secondRun: `${secondRun.statistics.mean.toFixed(1)}ms`,
        speedup: `${cacheSpeedup.toFixed(1)}x`,
        hitRate: `${(secondRun.metrics.cacheStats.hitRate * 100).toFixed(1)}%`,
        status: cacheSpeedup > 1.5 ? '✅ PASS' : '❌ FAIL'
      });
    }, 120000); // 2 minute timeout

    /**
     * Test parallel processing efficiency
     * Requirement: Validate parallel processing optimizations
     */
    it('should achieve reasonable parallel processing efficiency', async () => {
      const parallelConfig = {
        name: 'parallel-efficiency',
        description: 'Test parallel processing efficiency',
        documentCount: 40,
        documentSize: 2048,
        enableOptimizations: true,
        timeoutMs: 60000
      };

      // Test with different concurrency levels
      const concurrencyLevels = [1, 2, 4];
      const results: Array<{ concurrency: number; time: number; efficiency: number }> = [];

      for (const concurrency of concurrencyLevels) {
        const result = await benchmarkRunner.runBenchmarkTest({
          ...parallelConfig,
          concurrency
        });

        const efficiency = concurrency === 1 ? 1.0 : result.metrics.parallelStats.efficiency;
        results.push({
          concurrency,
          time: result.statistics.mean,
          efficiency
        });
      }

      // Find best efficiency
      const bestEfficiency = Math.max(...results.map(r => r.efficiency));

      // Parallel efficiency should be at least 60%
      expect(bestEfficiency).toBeGreaterThan(0.6);

      // Parallel processing should be faster than sequential
      const sequentialTime = results.find(r => r.concurrency === 1)?.time || 0;
      const bestParallelTime = Math.min(...results.filter(r => r.concurrency > 1).map(r => r.time));
      const parallelSpeedup = sequentialTime / bestParallelTime;

      expect(parallelSpeedup).toBeGreaterThan(1.3); // At least 1.3x speedup

      console.log('Parallel processing validation:', {
        results: results.map(r => ({
          concurrency: r.concurrency,
          time: `${r.time.toFixed(1)}ms`,
          efficiency: `${(r.efficiency * 100).toFixed(1)}%`
        })),
        bestEfficiency: `${(bestEfficiency * 100).toFixed(1)}%`,
        parallelSpeedup: `${parallelSpeedup.toFixed(1)}x`,
        status: bestEfficiency > 0.6 && parallelSpeedup > 1.3 ? '✅ PASS' : '❌ FAIL'
      });
    }, 180000); // 3 minute timeout
  });

  describe('Scalability Validation', () => {
    /**
     * Test that performance scales reasonably with document count
     * Requirement: Ensure scalability characteristics remain stable
     */
    it('should scale reasonably with increasing document count', async () => {
      const documentCounts = [10, 25, 50];
      const scalabilityResults: Array<{ count: number; time: number; throughput: number }> = [];

      for (const count of documentCounts) {
        const result = await benchmarkRunner.runBenchmarkTest({
          name: `scalability-${count}`,
          description: `Scalability test with ${count} documents`,
          documentCount: count,
          documentSize: 2048,
          concurrency: 4,
          enableOptimizations: true,
          timeoutMs: 60000
        });

        scalabilityResults.push({
          count,
          time: result.statistics.mean,
          throughput: result.metrics.throughput.documentsPerSecond
        });
      }

      // Calculate scaling characteristics
      const firstResult = scalabilityResults[0];
      const lastResult = scalabilityResults[scalabilityResults.length - 1];

      const documentRatio = lastResult.count / firstResult.count;
      const timeRatio = lastResult.time / firstResult.time;
      const scalingFactor = Math.log(timeRatio) / Math.log(documentRatio);

      // Scaling should be better than quadratic (factor < 2.0)
      expect(scalingFactor).toBeLessThan(2.0);

      // Scaling should not be worse than linear (factor > 0.8)
      expect(scalingFactor).toBeGreaterThan(0.8);

      // Throughput should remain reasonable even with more documents
      expect(lastResult.throughput).toBeGreaterThan(2); // At least 2 docs/sec

      console.log('Scalability validation:', {
        results: scalabilityResults.map(r => ({
          documents: r.count,
          time: `${r.time.toFixed(1)}ms`,
          throughput: `${r.throughput.toFixed(1)} docs/sec`
        })),
        scalingFactor: scalingFactor.toFixed(2),
        status: scalingFactor < 2.0 && scalingFactor > 0.8 ? '✅ PASS' : '❌ FAIL'
      });
    }, 240000); // 4 minute timeout

    /**
     * Test memory usage scaling
     * Requirement: Validate memory usage remains reasonable with scale
     */
    it('should maintain reasonable memory usage at scale', async () => {
      const documentCounts = [20, 50, 100];
      const memoryResults: Array<{ count: number; peakMemoryMB: number; memoryPerDoc: number }> = [];

      for (const count of documentCounts) {
        const result = await benchmarkRunner.runBenchmarkTest({
          name: `memory-scaling-${count}`,
          description: `Memory scaling test with ${count} documents`,
          documentCount: count,
          documentSize: 4096, // 4KB per document
          concurrency: 4,
          enableOptimizations: true,
          timeoutMs: 90000
        });

        const peakMemoryMB = result.metrics.memoryUsage.peak / 1024 / 1024;
        const memoryPerDoc = peakMemoryMB / count;

        memoryResults.push({
          count,
          peakMemoryMB,
          memoryPerDoc
        });

        // Memory should not exceed 512MB even at scale
        expect(peakMemoryMB).toBeLessThan(512);
      }

      // Memory per document should remain relatively stable
      const memoryPerDocValues = memoryResults.map(r => r.memoryPerDoc);
      const minMemoryPerDoc = Math.min(...memoryPerDocValues);
      const maxMemoryPerDoc = Math.max(...memoryPerDocValues);
      const memoryVariation = (maxMemoryPerDoc - minMemoryPerDoc) / minMemoryPerDoc;

      // Memory per document variation should be less than 100%
      expect(memoryVariation).toBeLessThan(1.0);

      console.log('Memory scaling validation:', {
        results: memoryResults.map(r => ({
          documents: r.count,
          peakMemory: `${r.peakMemoryMB.toFixed(1)}MB`,
          memoryPerDoc: `${r.memoryPerDoc.toFixed(2)}MB/doc`
        })),
        memoryVariation: `${(memoryVariation * 100).toFixed(1)}%`,
        status: memoryVariation < 1.0 ? '✅ PASS' : '❌ FAIL'
      });
    }, 300000); // 5 minute timeout
  });

  describe('Stress Testing', () => {
    /**
     * Test system behavior under stress conditions
     * Requirement: Validate system stability under load
     */
    it('should handle stress conditions gracefully', async () => {
      const stressConfig = {
        name: 'stress-test',
        description: 'High-load stress test',
        documentCount: 150,
        documentSize: 8192, // 8KB per document
        concurrency: 8,
        enableOptimizations: true,
        timeoutMs: 300000 // 5 minutes
      };

      const result = await benchmarkRunner.runBenchmarkTest(stressConfig);

      // Should complete within timeout
      expect(result.statistics.mean).toBeLessThan(stressConfig.timeoutMs);

      // Memory should not exceed 1GB under stress
      const peakMemoryMB = result.metrics.memoryUsage.peak / 1024 / 1024;
      expect(peakMemoryMB).toBeLessThan(1024);

      // Should maintain reasonable throughput under stress
      expect(result.metrics.throughput.documentsPerSecond).toBeGreaterThan(1);

      // Standard deviation should not be excessive (indicating stability)
      const coefficientOfVariation = result.statistics.standardDeviation / result.statistics.mean;
      expect(coefficientOfVariation).toBeLessThan(0.5); // Less than 50% variation

      console.log('Stress test validation:', {
        executionTime: `${result.statistics.mean.toFixed(1)}ms`,
        peakMemory: `${peakMemoryMB.toFixed(1)}MB`,
        throughput: `${result.metrics.throughput.documentsPerSecond.toFixed(1)} docs/sec`,
        stability: `${(coefficientOfVariation * 100).toFixed(1)}% variation`,
        status: '✅ PASS'
      });
    }, 360000); // 6 minute timeout
  });
});