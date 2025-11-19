import { PerformanceOptimizedAnalyzer } from './PerformanceOptimizedAnalyzer';
import { GitPerformanceOptimizer } from './GitPerformanceOptimizer';
import { DocumentParsingCache } from './DocumentParsingCache';
import { ParallelProcessor } from './ParallelProcessor';
import { AnalysisConfig } from '../config/AnalysisConfig';
import { CompletionDocument } from '../types/AnalysisTypes';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Benchmark suite configuration
 */
export interface BenchmarkSuiteConfig {
  outputDir: string;
  iterations: number;
  warmupIterations: number;
  enableDetailedLogging: boolean;
  saveResults: boolean;
  compareWithBaseline: boolean;
  baselineFile?: string;
}

/**
 * Individual benchmark configuration
 */
export interface BenchmarkTestConfig {
  name: string;
  description: string;
  documentCount: number;
  documentSize: number; // bytes
  concurrency: number;
  enableOptimizations: boolean;
  timeoutMs: number;
}

/**
 * Benchmark execution result
 */
export interface BenchmarkExecutionResult {
  config: BenchmarkTestConfig;
  metrics: {
    executionTime: number;
    memoryUsage: {
      initial: number;
      peak: number;
      final: number;
    };
    throughput: {
      documentsPerSecond: number;
      bytesPerSecond: number;
    };
    cacheStats: {
      hitRate: number;
      totalRequests: number;
      cacheSize: number;
    };
    parallelStats: {
      efficiency: number;
      actualConcurrency: number;
      queueTime: number;
    };
  };
  iterations: Array<{
    executionTime: number;
    memoryPeak: number;
    success: boolean;
    error?: string;
  }>;
  statistics: {
    mean: number;
    median: number;
    standardDeviation: number;
    min: number;
    max: number;
    percentile95: number;
    percentile99: number;
  };
}

/**
 * Benchmark suite result
 */
export interface BenchmarkSuiteResult {
  timestamp: Date;
  environment: {
    nodeVersion: string;
    platform: string;
    arch: string;
    cpuCount: number;
    totalMemory: number;
  };
  config: BenchmarkSuiteConfig;
  results: BenchmarkExecutionResult[];
  summary: {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    totalExecutionTime: number;
    averagePerformance: number;
    regressions: Array<{
      testName: string;
      regressionPercent: number;
    }>;
  };
}

/**
 * Performance Benchmark Runner for release analysis system
 * 
 * Provides comprehensive performance benchmarking capabilities with detailed metrics,
 * regression detection, and scalability analysis for the release analysis system.
 * 
 * Requirements addressed:
 * - 5.1: Performance testing for large repositories
 * - 5.2: Benchmarks for extraction speed and memory usage
 * - 5.3: Scalability testing for multiple completion documents
 * - 5.4: Performance regression detection
 */
export class PerformanceBenchmarkRunner {
  private config: BenchmarkSuiteConfig;
  private workingDirectory: string;
  private analysisConfig: AnalysisConfig;
  private testDocuments: Map<string, CompletionDocument[]> = new Map();

  constructor(
    workingDirectory: string,
    analysisConfig: AnalysisConfig,
    config: Partial<BenchmarkSuiteConfig> = {}
  ) {
    this.workingDirectory = workingDirectory;
    this.analysisConfig = analysisConfig;
    this.config = {
      outputDir: join(workingDirectory, 'benchmark-results'),
      iterations: 5,
      warmupIterations: 2,
      enableDetailedLogging: true,
      saveResults: true,
      compareWithBaseline: true,
      ...config
    };

    // Ensure output directory exists
    if (!existsSync(this.config.outputDir)) {
      mkdirSync(this.config.outputDir, { recursive: true });
    }
  }

  /**
   * Run complete benchmark suite
   * Requirements 5.1, 5.2, 5.3: Comprehensive performance testing
   */
  async runBenchmarkSuite(): Promise<BenchmarkSuiteResult> {
    const startTime = Date.now();

    if (this.config.enableDetailedLogging) {
      console.log('🚀 Starting Performance Benchmark Suite');
      console.log(`📁 Working Directory: ${this.workingDirectory}`);
      console.log(`📊 Output Directory: ${this.config.outputDir}`);
      console.log(`🔄 Iterations: ${this.config.iterations} (+ ${this.config.warmupIterations} warmup)`);
      console.log('─'.repeat(80));
    }

    // Define benchmark test configurations
    const benchmarkTests: BenchmarkTestConfig[] = [
      {
        name: 'small-repository',
        description: 'Small repository with 10 documents',
        documentCount: 10,
        documentSize: 1024, // 1KB
        concurrency: 2,
        enableOptimizations: true,
        timeoutMs: 30000
      },
      {
        name: 'medium-repository',
        description: 'Medium repository with 50 documents',
        documentCount: 50,
        documentSize: 2048, // 2KB
        concurrency: 4,
        enableOptimizations: true,
        timeoutMs: 60000
      },
      {
        name: 'large-repository',
        description: 'Large repository with 100 documents',
        documentCount: 100,
        documentSize: 4096, // 4KB
        concurrency: 4,
        enableOptimizations: true,
        timeoutMs: 120000
      },
      {
        name: 'xlarge-repository',
        description: 'Extra large repository with 250 documents',
        documentCount: 250,
        documentSize: 4096, // 4KB
        concurrency: 6,
        enableOptimizations: true,
        timeoutMs: 300000
      },
      {
        name: 'high-concurrency',
        description: 'High concurrency test with 50 documents',
        documentCount: 50,
        documentSize: 2048,
        concurrency: 8,
        enableOptimizations: true,
        timeoutMs: 60000
      },
      {
        name: 'no-optimizations',
        description: 'Medium repository without optimizations',
        documentCount: 50,
        documentSize: 2048,
        concurrency: 4,
        enableOptimizations: false,
        timeoutMs: 120000
      },
      {
        name: 'memory-stress',
        description: 'Memory stress test with large documents',
        documentCount: 30,
        documentSize: 16384, // 16KB
        concurrency: 2,
        enableOptimizations: true,
        timeoutMs: 90000
      }
    ];

    const results: BenchmarkExecutionResult[] = [];
    let passedTests = 0;
    let failedTests = 0;

    // Run each benchmark test
    for (const testConfig of benchmarkTests) {
      if (this.config.enableDetailedLogging) {
        console.log(`\n🧪 Running: ${testConfig.name}`);
        console.log(`   ${testConfig.description}`);
      }

      try {
        const result = await this.runBenchmarkTest(testConfig);
        results.push(result);
        passedTests++;

        if (this.config.enableDetailedLogging) {
          this.logBenchmarkResult(result);
        }
      } catch (error) {
        failedTests++;
        console.error(`❌ Failed: ${testConfig.name} - ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    const totalExecutionTime = Date.now() - startTime;

    // Calculate summary statistics
    const averagePerformance = results.length > 0
      ? results.reduce((sum, r) => sum + r.statistics.mean, 0) / results.length
      : 0;

    // Detect regressions if baseline comparison is enabled
    const regressions = this.config.compareWithBaseline
      ? await this.detectRegressions(results)
      : [];

    const suiteResult: BenchmarkSuiteResult = {
      timestamp: new Date(),
      environment: this.getEnvironmentInfo(),
      config: this.config,
      results,
      summary: {
        totalTests: benchmarkTests.length,
        passedTests,
        failedTests,
        totalExecutionTime,
        averagePerformance,
        regressions
      }
    };

    // Save results if configured
    if (this.config.saveResults) {
      await this.saveResults(suiteResult);
    }

    // Log final summary
    if (this.config.enableDetailedLogging) {
      this.logSuiteSummary(suiteResult);
    }

    return suiteResult;
  }

  /**
   * Run individual benchmark test
   * Requirements 5.1, 5.2: Individual test execution with detailed metrics
   */
  async runBenchmarkTest(config: BenchmarkTestConfig): Promise<BenchmarkExecutionResult> {
    // Generate or retrieve test documents
    const documents = this.getTestDocuments(config.name, config.documentCount, config.documentSize);

    // Initialize components
    const analyzer = new PerformanceOptimizedAnalyzer(
      this.workingDirectory,
      this.analysisConfig,
      {
        enableOptimizations: config.enableOptimizations,
        enableProgressReporting: false, // Disable for benchmarks
        performanceTargets: {
          maxAnalysisTimeMs: config.timeoutMs,
          maxMemoryUsageMB: 1024,
          minCacheHitRate: 0.3
        }
      }
    );

    const documentCache = new DocumentParsingCache(this.workingDirectory, {
      enableCache: config.enableOptimizations,
      enableParallelParsing: config.enableOptimizations,
      maxConcurrentParsing: config.concurrency
    });

    const parallelProcessor = new ParallelProcessor<string, any>({
      maxConcurrency: config.concurrency,
      batchSize: Math.ceil(config.documentCount / config.concurrency),
      enableProgressReporting: false
    });

    // Warmup iterations
    for (let i = 0; i < this.config.warmupIterations; i++) {
      try {
        await this.executeBenchmarkIteration(documents, documentCache, parallelProcessor);
        documentCache.clear();
      } catch (error) {
        // Ignore warmup errors
      }
    }

    // Actual benchmark iterations
    const iterations: Array<{
      executionTime: number;
      memoryPeak: number;
      success: boolean;
      error?: string;
    }> = [];

    const executionTimes: number[] = [];
    const memoryPeaks: number[] = [];
    let totalCacheRequests = 0;
    let totalCacheHits = 0;
    let totalParallelEfficiency = 0;

    for (let i = 0; i < this.config.iterations; i++) {
      try {
        const iterationResult = await this.executeBenchmarkIteration(
          documents,
          documentCache,
          parallelProcessor
        );

        iterations.push({
          executionTime: iterationResult.executionTime,
          memoryPeak: iterationResult.memoryPeak,
          success: true
        });

        executionTimes.push(iterationResult.executionTime);
        memoryPeaks.push(iterationResult.memoryPeak);

        // Accumulate cache and parallel stats
        const cacheStats = documentCache.getCacheStats();
        totalCacheRequests += cacheStats.totalDocuments;
        totalCacheHits += cacheStats.totalDocuments * cacheStats.cacheHitRate;

        const parallelStats = parallelProcessor.getProcessingStats();
        totalParallelEfficiency += parallelStats.successRate;

        // Clear caches between iterations
        documentCache.clear();
        parallelProcessor.reset();

      } catch (error) {
        iterations.push({
          executionTime: 0,
          memoryPeak: 0,
          success: false,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    // Calculate statistics
    const validTimes = executionTimes.filter(t => t > 0);
    if (validTimes.length === 0) {
      throw new Error('All benchmark iterations failed');
    }

    const statistics = this.calculateStatistics(validTimes);
    const totalBytes = config.documentCount * config.documentSize;
    const avgExecutionTime = statistics.mean;

    const result: BenchmarkExecutionResult = {
      config,
      metrics: {
        executionTime: avgExecutionTime,
        memoryUsage: {
          initial: process.memoryUsage().heapUsed,
          peak: Math.max(...memoryPeaks),
          final: process.memoryUsage().heapUsed
        },
        throughput: {
          documentsPerSecond: config.documentCount / (avgExecutionTime / 1000),
          bytesPerSecond: totalBytes / (avgExecutionTime / 1000)
        },
        cacheStats: {
          hitRate: totalCacheRequests > 0 ? totalCacheHits / totalCacheRequests : 0,
          totalRequests: totalCacheRequests,
          cacheSize: 0 // Would be calculated from actual cache
        },
        parallelStats: {
          efficiency: totalParallelEfficiency / this.config.iterations,
          actualConcurrency: config.concurrency,
          queueTime: 0 // Would be calculated from actual parallel processor
        }
      },
      iterations,
      statistics
    };

    return result;
  }

  /**
   * Execute single benchmark iteration
   */
  private async executeBenchmarkIteration(
    documents: CompletionDocument[],
    documentCache: DocumentParsingCache,
    parallelProcessor: ParallelProcessor<string, any>
  ): Promise<{
    executionTime: number;
    memoryPeak: number;
  }> {
    const startMemory = process.memoryUsage().heapUsed;
    let peakMemory = startMemory;

    // Monitor memory usage
    const memoryMonitor = setInterval(() => {
      const current = process.memoryUsage().heapUsed;
      peakMemory = Math.max(peakMemory, current);
    }, 100);

    const startTime = Date.now();

    try {
      // Create processing tasks
      const tasks = documents.map(doc => ({
        id: doc.path,
        input: doc.path,
        processor: async (path: string) => {
          return await documentCache.parseDocumentIncremental(path);
        }
      }));

      // Execute parallel processing
      await parallelProcessor.processTasks(tasks);

      const endTime = Date.now();
      return {
        executionTime: endTime - startTime,
        memoryPeak: peakMemory
      };
    } finally {
      clearInterval(memoryMonitor);
    }
  }

  /**
   * Get or generate test documents for a benchmark
   */
  private getTestDocuments(testName: string, count: number, sizeBytes: number): CompletionDocument[] {
    const cacheKey = `${testName}-${count}-${sizeBytes}`;

    if (this.testDocuments.has(cacheKey)) {
      return this.testDocuments.get(cacheKey)!;
    }

    const documents: CompletionDocument[] = [];

    for (let i = 0; i < count; i++) {
      const content = this.generateDocumentContent(sizeBytes, i, testName);
      const document: CompletionDocument = {
        path: `.kiro/specs/${testName}-spec-${i}/completion/task-${i}-completion.md`,
        content,
        lastModified: new Date(),
        gitCommit: `commit-${i}`,
        metadata: {
          title: `${testName} Task ${i} Completion`,
          date: '2023-10-20',
          task: `${i}.1 ${testName} task ${i}`,
          spec: `${testName}-spec-${i}`,
          status: 'Complete',
          type: 'task-completion'
        }
      };
      documents.push(document);
    }

    this.testDocuments.set(cacheKey, documents);
    return documents;
  }

  /**
   * Generate document content of specified size
   */
  private generateDocumentContent(sizeBytes: number, index: number, testName: string): string {
    const baseContent = `# ${testName} Task ${index} Completion

**Date**: 2023-10-20
**Task**: ${index}.1 ${testName} task ${index}
**Spec**: ${testName}-spec-${index}
**Status**: Complete

## Summary

This task involved implementing ${testName} feature ${index} with comprehensive changes:

### Breaking Changes
- BREAKING: Updated API interface for ${testName} feature ${index}
- Modified core data structures for enhanced performance
- Changed method signatures to support new functionality

### New Features
- feat: Added ${testName} feature ${index} with advanced capabilities
- Implemented sophisticated processing pipeline for use case ${index}
- Enhanced user experience with improved interface design
- Added comprehensive validation and error handling

### Bug Fixes
- fix: Resolved critical issue with edge case handling in ${testName} ${index}
- patch: Fixed memory leak in processing pipeline
- Corrected race condition in concurrent operations
- Improved error recovery mechanisms

### Improvements
- Optimized performance for large datasets (${index}x improvement)
- Enhanced error handling and validation
- Improved documentation with comprehensive examples
- Added extensive unit and integration test coverage

## Implementation Details

The implementation follows established architectural patterns:

1. **Modular Design**: Clean separation of concerns
2. **Performance Optimization**: Efficient algorithms and data structures
3. **Error Handling**: Comprehensive error recovery
4. **Testing**: Full test coverage with edge cases
5. **Documentation**: Complete API documentation

### Technical Specifications

- **Performance Target**: Sub-100ms response time
- **Memory Usage**: Optimized for minimal footprint
- **Scalability**: Handles 10,000+ concurrent operations
- **Reliability**: 99.9% uptime with graceful degradation

## Validation Results

All acceptance criteria successfully met:

✅ Feature ${index} works as specified in requirements
✅ Performance targets achieved and validated
✅ No regressions introduced in existing functionality
✅ Comprehensive test coverage (>95%)
✅ Documentation updated and reviewed
✅ Security review completed
✅ Accessibility compliance verified

## Performance Metrics

- **Execution Time**: ${10 + index}ms average
- **Memory Usage**: ${50 + index * 2}MB peak
- **Throughput**: ${1000 + index * 100} operations/second
- **Cache Hit Rate**: ${85 + (index % 15)}%

## Future Considerations

- Potential for further optimization in version ${index + 1}
- Integration opportunities with related features
- Scalability improvements for enterprise usage
- Enhanced monitoring and observability

`;

    // Pad content to reach target size
    const currentSize = Buffer.byteLength(baseContent, 'utf8');
    if (currentSize < sizeBytes) {
      const paddingNeeded = sizeBytes - currentSize;
      const paddingChar = 'x';
      const padding = paddingChar.repeat(paddingNeeded);
      return baseContent + '\n\n<!-- Padding -->\n' + padding;
    }

    return baseContent.substring(0, sizeBytes);
  }

  /**
   * Calculate statistical metrics for execution times
   */
  private calculateStatistics(values: number[]): {
    mean: number;
    median: number;
    standardDeviation: number;
    min: number;
    max: number;
    percentile95: number;
    percentile99: number;
  } {
    const sorted = [...values].sort((a, b) => a - b);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;

    const median = sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];

    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const standardDeviation = Math.sqrt(variance);

    const percentile95 = sorted[Math.floor(sorted.length * 0.95)];
    const percentile99 = sorted[Math.floor(sorted.length * 0.99)];

    return {
      mean,
      median,
      standardDeviation,
      min: Math.min(...values),
      max: Math.max(...values),
      percentile95,
      percentile99
    };
  }

  /**
   * Detect performance regressions compared to baseline
   */
  private async detectRegressions(results: BenchmarkExecutionResult[]): Promise<Array<{
    testName: string;
    regressionPercent: number;
  }>> {
    const regressions: Array<{ testName: string; regressionPercent: number }> = [];

    if (!this.config.baselineFile || !existsSync(this.config.baselineFile)) {
      return regressions;
    }

    try {
      const baselineData = JSON.parse(require('fs').readFileSync(this.config.baselineFile, 'utf8'));

      for (const result of results) {
        const baselineResult = baselineData.results?.find((r: any) => r.config.name === result.config.name);

        if (baselineResult) {
          const baselineTime = baselineResult.statistics.mean;
          const currentTime = result.statistics.mean;
          const regressionPercent = ((currentTime - baselineTime) / baselineTime) * 100;

          if (regressionPercent > 10) { // 10% regression threshold
            regressions.push({
              testName: result.config.name,
              regressionPercent
            });
          }
        }
      }
    } catch (error) {
      console.warn(`Failed to load baseline data: ${error instanceof Error ? error.message : String(error)}`);
    }

    return regressions;
  }

  /**
   * Save benchmark results to file
   */
  private async saveResults(suiteResult: BenchmarkSuiteResult): Promise<void> {
    const timestamp = suiteResult.timestamp.toISOString().replace(/[:.]/g, '-');
    const filename = `benchmark-results-${timestamp}.json`;
    const filepath = join(this.config.outputDir, filename);

    try {
      writeFileSync(filepath, JSON.stringify(suiteResult, null, 2));

      // Also save as latest baseline
      const baselineFile = join(this.config.outputDir, 'baseline.json');
      writeFileSync(baselineFile, JSON.stringify(suiteResult, null, 2));

      if (this.config.enableDetailedLogging) {
        console.log(`💾 Results saved to: ${filepath}`);
        console.log(`📊 Baseline updated: ${baselineFile}`);
      }
    } catch (error) {
      console.error(`Failed to save results: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get system environment information
   */
  private getEnvironmentInfo(): BenchmarkSuiteResult['environment'] {
    const os = require('os');

    return {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      cpuCount: os.cpus().length,
      totalMemory: os.totalmem()
    };
  }

  /**
   * Log individual benchmark result
   */
  private logBenchmarkResult(result: BenchmarkExecutionResult): void {
    const { config, metrics, statistics } = result;

    console.log(`   ⏱️  Execution Time: ${statistics.mean.toFixed(1)}ms (±${statistics.standardDeviation.toFixed(1)}ms)`);
    console.log(`   🚀 Throughput: ${metrics.throughput.documentsPerSecond.toFixed(1)} docs/sec`);
    console.log(`   💾 Peak Memory: ${(metrics.memoryUsage.peak / 1024 / 1024).toFixed(1)}MB`);
    console.log(`   📊 Cache Hit Rate: ${(metrics.cacheStats.hitRate * 100).toFixed(1)}%`);
    console.log(`   ⚡ Parallel Efficiency: ${(metrics.parallelStats.efficiency * 100).toFixed(1)}%`);

    if (statistics.standardDeviation / statistics.mean > 0.2) {
      console.log(`   ⚠️  High variance detected (${(statistics.standardDeviation / statistics.mean * 100).toFixed(1)}%)`);
    }
  }

  /**
   * Log benchmark suite summary
   */
  private logSuiteSummary(suiteResult: BenchmarkSuiteResult): void {
    const { summary } = suiteResult;

    console.log('\n' + '='.repeat(80));
    console.log('📊 BENCHMARK SUITE SUMMARY');
    console.log('='.repeat(80));
    console.log(`✅ Passed Tests: ${summary.passedTests}/${summary.totalTests}`);
    console.log(`❌ Failed Tests: ${summary.failedTests}`);
    console.log(`⏱️  Total Time: ${(summary.totalExecutionTime / 1000).toFixed(1)}s`);
    console.log(`📈 Average Performance: ${summary.averagePerformance.toFixed(1)}ms`);

    if (summary.regressions.length > 0) {
      console.log(`\n⚠️  PERFORMANCE REGRESSIONS DETECTED:`);
      for (const regression of summary.regressions) {
        console.log(`   - ${regression.testName}: +${regression.regressionPercent.toFixed(1)}%`);
      }
    } else {
      console.log(`\n✅ No performance regressions detected`);
    }

    console.log('\n📁 Results saved to:', this.config.outputDir);
    console.log('='.repeat(80));
  }
}