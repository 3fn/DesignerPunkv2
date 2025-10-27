"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAllExamples = runAllExamples;
const PerformanceBenchmarkRunner_1 = require("./PerformanceBenchmarkRunner");
const AnalysisConfigManager_1 = require("../config/AnalysisConfigManager");
/**
 * Example usage of the Performance Benchmark Runner
 *
 * This file demonstrates how to use the performance benchmarking system
 * for the release analysis system, including custom configurations and
 * result analysis.
 *
 * Requirements addressed:
 * - 5.1: Performance testing for large repositories
 * - 5.2: Benchmarks for extraction speed and memory usage
 * - 5.3: Scalability testing for multiple completion documents
 * - Performance regression detection and monitoring
 */
async function runBasicBenchmark() {
    console.log('🚀 Running Basic Performance Benchmark');
    // Load default analysis configuration
    const configManager = AnalysisConfigManager_1.AnalysisConfigManager.getInstance();
    const analysisConfig = await configManager.getConfig();
    // Create benchmark runner with default settings
    const runner = new PerformanceBenchmarkRunner_1.PerformanceBenchmarkRunner(process.cwd(), analysisConfig);
    // Run the complete benchmark suite
    const results = await runner.runBenchmarkSuite();
    console.log('📊 Benchmark Results Summary:');
    console.log(`   Total Tests: ${results.summary.totalTests}`);
    console.log(`   Passed: ${results.summary.passedTests}`);
    console.log(`   Failed: ${results.summary.failedTests}`);
    console.log(`   Average Performance: ${results.summary.averagePerformance.toFixed(1)}ms`);
    if (results.summary.regressions.length > 0) {
        console.log('⚠️  Performance Regressions Detected:');
        results.summary.regressions.forEach(r => {
            console.log(`   - ${r.testName}: +${r.regressionPercent.toFixed(1)}%`);
        });
    }
    return results;
}
async function runCustomBenchmark() {
    console.log('🔧 Running Custom Performance Benchmark');
    // Load analysis configuration
    const configManager = AnalysisConfigManager_1.AnalysisConfigManager.getInstance();
    const analysisConfig = await configManager.getConfig();
    // Create benchmark runner with custom configuration
    const runner = new PerformanceBenchmarkRunner_1.PerformanceBenchmarkRunner(process.cwd(), analysisConfig, {
        outputDir: './custom-benchmark-results',
        iterations: 10, // More iterations for better accuracy
        warmupIterations: 3, // More warmup for stable results
        enableDetailedLogging: true,
        saveResults: true,
        compareWithBaseline: true,
        baselineFile: './benchmark-baseline.json'
    });
    // Run individual benchmark test
    const testResult = await runner.runBenchmarkTest({
        name: 'custom-performance-test',
        description: 'Custom performance test with specific parameters',
        documentCount: 75,
        documentSize: 3072, // 3KB per document
        concurrency: 6,
        enableOptimizations: true,
        timeoutMs: 90000 // 90 seconds
    });
    console.log('📈 Custom Test Results:');
    console.log(`   Execution Time: ${testResult.statistics.mean.toFixed(1)}ms`);
    console.log(`   Throughput: ${testResult.metrics.throughput.documentsPerSecond.toFixed(1)} docs/sec`);
    console.log(`   Peak Memory: ${(testResult.metrics.memoryUsage.peak / 1024 / 1024).toFixed(1)}MB`);
    console.log(`   Cache Hit Rate: ${(testResult.metrics.cacheStats.hitRate * 100).toFixed(1)}%`);
    return testResult;
}
async function runScalabilityAnalysis() {
    console.log('📊 Running Scalability Analysis');
    const configManager = AnalysisConfigManager_1.AnalysisConfigManager.getInstance();
    const analysisConfig = await configManager.getConfig();
    const runner = new PerformanceBenchmarkRunner_1.PerformanceBenchmarkRunner(process.cwd(), analysisConfig, {
        iterations: 5,
        enableDetailedLogging: false,
        saveResults: false
    });
    // Test different document counts to analyze scalability
    const documentCounts = [10, 25, 50, 100, 200];
    const scalabilityResults = [];
    for (const count of documentCounts) {
        console.log(`   Testing with ${count} documents...`);
        const result = await runner.runBenchmarkTest({
            name: `scalability-${count}`,
            description: `Scalability test with ${count} documents`,
            documentCount: count,
            documentSize: 2048,
            concurrency: 4,
            enableOptimizations: true,
            timeoutMs: 120000
        });
        scalabilityResults.push({
            documentCount: count,
            executionTime: result.statistics.mean,
            throughput: result.metrics.throughput.documentsPerSecond,
            memoryUsage: result.metrics.memoryUsage.peak / 1024 / 1024
        });
    }
    // Analyze scaling characteristics
    console.log('📈 Scalability Analysis Results:');
    console.log('   Doc Count | Exec Time | Throughput | Memory');
    console.log('   ----------|-----------|------------|-------');
    scalabilityResults.forEach(result => {
        console.log(`   ${result.documentCount.toString().padStart(8)} | ${result.executionTime.toFixed(0).padStart(8)}ms | ${result.throughput.toFixed(1).padStart(9)} d/s | ${result.memoryUsage.toFixed(0).padStart(5)}MB`);
    });
    // Calculate scaling factor
    const firstResult = scalabilityResults[0];
    const lastResult = scalabilityResults[scalabilityResults.length - 1];
    const documentRatio = lastResult.documentCount / firstResult.documentCount;
    const timeRatio = lastResult.executionTime / firstResult.executionTime;
    const scalingFactor = Math.log(timeRatio) / Math.log(documentRatio);
    console.log(`\n📊 Scaling Factor: ${scalingFactor.toFixed(2)}`);
    console.log(`   (1.0 = linear, <1.0 = sub-linear, >1.0 = super-linear)`);
    if (scalingFactor < 1.2) {
        console.log('✅ Excellent scaling characteristics');
    }
    else if (scalingFactor < 1.5) {
        console.log('⚠️  Acceptable scaling characteristics');
    }
    else {
        console.log('❌ Poor scaling characteristics - optimization needed');
    }
    return scalabilityResults;
}
async function runOptimizationComparison() {
    console.log('⚡ Running Optimization Comparison');
    const configManager = AnalysisConfigManager_1.AnalysisConfigManager.getInstance();
    const analysisConfig = await configManager.getConfig();
    const runner = new PerformanceBenchmarkRunner_1.PerformanceBenchmarkRunner(process.cwd(), analysisConfig, {
        iterations: 5,
        enableDetailedLogging: false,
        saveResults: false
    });
    const testConfig = {
        name: 'optimization-comparison',
        description: 'Compare performance with and without optimizations',
        documentCount: 50,
        documentSize: 2048,
        concurrency: 4,
        timeoutMs: 60000
    };
    // Test without optimizations
    console.log('   Testing without optimizations...');
    const unoptimizedResult = await runner.runBenchmarkTest({
        ...testConfig,
        enableOptimizations: false
    });
    // Test with optimizations
    console.log('   Testing with optimizations...');
    const optimizedResult = await runner.runBenchmarkTest({
        ...testConfig,
        enableOptimizations: true
    });
    // Calculate improvements
    const timeImprovement = ((unoptimizedResult.statistics.mean - optimizedResult.statistics.mean) / unoptimizedResult.statistics.mean) * 100;
    const throughputImprovement = ((optimizedResult.metrics.throughput.documentsPerSecond - unoptimizedResult.metrics.throughput.documentsPerSecond) / unoptimizedResult.metrics.throughput.documentsPerSecond) * 100;
    const memoryImprovement = ((unoptimizedResult.metrics.memoryUsage.peak - optimizedResult.metrics.memoryUsage.peak) / unoptimizedResult.metrics.memoryUsage.peak) * 100;
    console.log('⚡ Optimization Impact Analysis:');
    console.log(`   Execution Time: ${timeImprovement.toFixed(1)}% improvement`);
    console.log(`   Throughput: ${throughputImprovement.toFixed(1)}% improvement`);
    console.log(`   Memory Usage: ${memoryImprovement.toFixed(1)}% improvement`);
    console.log('\n📊 Detailed Comparison:');
    console.log('   Metric          | Unoptimized | Optimized   | Improvement');
    console.log('   ----------------|-------------|-------------|------------');
    console.log(`   Execution Time  | ${unoptimizedResult.statistics.mean.toFixed(0).padStart(10)}ms | ${optimizedResult.statistics.mean.toFixed(0).padStart(10)}ms | ${timeImprovement.toFixed(1).padStart(10)}%`);
    console.log(`   Throughput      | ${unoptimizedResult.metrics.throughput.documentsPerSecond.toFixed(1).padStart(9)} d/s | ${optimizedResult.metrics.throughput.documentsPerSecond.toFixed(1).padStart(9)} d/s | ${throughputImprovement.toFixed(1).padStart(10)}%`);
    console.log(`   Peak Memory     | ${(unoptimizedResult.metrics.memoryUsage.peak / 1024 / 1024).toFixed(0).padStart(10)}MB | ${(optimizedResult.metrics.memoryUsage.peak / 1024 / 1024).toFixed(0).padStart(10)}MB | ${memoryImprovement.toFixed(1).padStart(10)}%`);
    return {
        unoptimized: unoptimizedResult,
        optimized: optimizedResult,
        improvements: {
            time: timeImprovement,
            throughput: throughputImprovement,
            memory: memoryImprovement
        }
    };
}
async function runMemoryProfileAnalysis() {
    console.log('💾 Running Memory Profile Analysis');
    const configManager = AnalysisConfigManager_1.AnalysisConfigManager.getInstance();
    const analysisConfig = await configManager.getConfig();
    const runner = new PerformanceBenchmarkRunner_1.PerformanceBenchmarkRunner(process.cwd(), analysisConfig, {
        iterations: 3,
        enableDetailedLogging: false,
        saveResults: false
    });
    // Test different document sizes to analyze memory usage patterns
    const documentSizes = [512, 1024, 2048, 4096, 8192]; // 0.5KB to 8KB
    const memoryResults = [];
    for (const size of documentSizes) {
        console.log(`   Testing with ${size} byte documents...`);
        const result = await runner.runBenchmarkTest({
            name: `memory-profile-${size}`,
            description: `Memory profile test with ${size} byte documents`,
            documentCount: 50,
            documentSize: size,
            concurrency: 4,
            enableOptimizations: true,
            timeoutMs: 60000
        });
        const peakMemoryMB = result.metrics.memoryUsage.peak / 1024 / 1024;
        const memoryPerDoc = peakMemoryMB / 50; // 50 documents
        const totalDocumentSizeMB = (50 * size) / 1024 / 1024;
        const memoryEfficiency = totalDocumentSizeMB / peakMemoryMB;
        memoryResults.push({
            documentSize: size,
            peakMemory: peakMemoryMB,
            memoryPerDocument: memoryPerDoc,
            memoryEfficiency
        });
    }
    console.log('💾 Memory Profile Analysis Results:');
    console.log('   Doc Size | Peak Memory | Mem/Doc | Efficiency');
    console.log('   ---------|-------------|---------|----------');
    memoryResults.forEach(result => {
        console.log(`   ${(result.documentSize / 1024).toFixed(1).padStart(7)}KB | ${result.peakMemory.toFixed(1).padStart(10)}MB | ${result.memoryPerDocument.toFixed(2).padStart(6)}MB | ${(result.memoryEfficiency * 100).toFixed(1).padStart(8)}%`);
    });
    // Analyze memory efficiency trends
    const avgEfficiency = memoryResults.reduce((sum, r) => sum + r.memoryEfficiency, 0) / memoryResults.length;
    console.log(`\n📊 Average Memory Efficiency: ${(avgEfficiency * 100).toFixed(1)}%`);
    if (avgEfficiency > 0.5) {
        console.log('✅ Good memory efficiency');
    }
    else if (avgEfficiency > 0.3) {
        console.log('⚠️  Acceptable memory efficiency');
    }
    else {
        console.log('❌ Poor memory efficiency - optimization needed');
    }
    return memoryResults;
}
// Example usage functions
async function runAllExamples() {
    console.log('🎯 Running All Performance Benchmark Examples\n');
    try {
        // Run basic benchmark
        await runBasicBenchmark();
        console.log('\n' + '='.repeat(60) + '\n');
        // Run custom benchmark
        await runCustomBenchmark();
        console.log('\n' + '='.repeat(60) + '\n');
        // Run scalability analysis
        await runScalabilityAnalysis();
        console.log('\n' + '='.repeat(60) + '\n');
        // Run optimization comparison
        await runOptimizationComparison();
        console.log('\n' + '='.repeat(60) + '\n');
        // Run memory profile analysis
        await runMemoryProfileAnalysis();
        console.log('\n✅ All performance benchmark examples completed successfully!');
    }
    catch (error) {
        console.error('❌ Performance benchmark examples failed:', error);
        throw error;
    }
}
// Run examples if this file is executed directly
if (require.main === module) {
    runAllExamples()
        .then(() => {
        console.log('\n🎉 Performance benchmark examples completed!');
        process.exit(0);
    })
        .catch((error) => {
        console.error('\n💥 Performance benchmark examples failed:', error);
        process.exit(1);
    });
}
//# sourceMappingURL=example-usage.js.map