import { AnalysisConfig } from '../config/AnalysisConfig';
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
    documentSize: number;
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
export declare class PerformanceBenchmarkRunner {
    private config;
    private workingDirectory;
    private analysisConfig;
    private testDocuments;
    constructor(workingDirectory: string, analysisConfig: AnalysisConfig, config?: Partial<BenchmarkSuiteConfig>);
    /**
     * Run complete benchmark suite
     * Requirements 5.1, 5.2, 5.3: Comprehensive performance testing
     */
    runBenchmarkSuite(): Promise<BenchmarkSuiteResult>;
    /**
     * Run individual benchmark test
     * Requirements 5.1, 5.2: Individual test execution with detailed metrics
     */
    runBenchmarkTest(config: BenchmarkTestConfig): Promise<BenchmarkExecutionResult>;
    /**
     * Execute single benchmark iteration
     */
    private executeBenchmarkIteration;
    /**
     * Get or generate test documents for a benchmark
     */
    private getTestDocuments;
    /**
     * Generate document content of specified size
     */
    private generateDocumentContent;
    /**
     * Calculate statistical metrics for execution times
     */
    private calculateStatistics;
    /**
     * Detect performance regressions compared to baseline
     */
    private detectRegressions;
    /**
     * Save benchmark results to file
     */
    private saveResults;
    /**
     * Get system environment information
     */
    private getEnvironmentInfo;
    /**
     * Log individual benchmark result
     */
    private logBenchmarkResult;
    /**
     * Log benchmark suite summary
     */
    private logSuiteSummary;
}
//# sourceMappingURL=PerformanceBenchmarkRunner.d.ts.map