#!/usr/bin/env node

import { PerformanceBenchmarkRunner, BenchmarkSuiteConfig } from '../performance/PerformanceBenchmarkRunner';
import { AnalysisConfigManager } from '../config/AnalysisConfigManager';
import { join } from 'path';
import { existsSync } from 'fs';

/**
 * CLI interface for running performance benchmarks
 * 
 * Usage:
 *   npm run benchmark:performance
 *   npm run benchmark:performance -- --config custom-config.json
 *   npm run benchmark:performance -- --iterations 10 --output ./results
 * 
 * Requirements addressed:
 * - 5.1: Performance testing for large repositories
 * - 5.2: Benchmarks for extraction speed and memory usage  
 * - 5.3: Scalability testing for multiple completion documents
 * - Performance regression detection and reporting
 */

interface CLIOptions {
  config?: string;
  iterations?: number;
  warmup?: number;
  output?: string;
  baseline?: string;
  verbose?: boolean;
  help?: boolean;
  quick?: boolean;
  stress?: boolean;
  compare?: boolean;
}

/**
 * Parse command line arguments
 */
function parseArgs(): CLIOptions {
  const args = process.argv.slice(2);
  const options: CLIOptions = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case '--config':
      case '-c':
        options.config = args[++i];
        break;
      case '--iterations':
      case '-i':
        options.iterations = parseInt(args[++i], 10);
        break;
      case '--warmup':
      case '-w':
        options.warmup = parseInt(args[++i], 10);
        break;
      case '--output':
      case '-o':
        options.output = args[++i];
        break;
      case '--baseline':
      case '-b':
        options.baseline = args[++i];
        break;
      case '--verbose':
      case '-v':
        options.verbose = true;
        break;
      case '--help':
      case '-h':
        options.help = true;
        break;
      case '--quick':
      case '-q':
        options.quick = true;
        break;
      case '--stress':
      case '-s':
        options.stress = true;
        break;
      case '--compare':
        options.compare = true;
        break;
      default:
        if (arg.startsWith('-')) {
          console.warn(`Unknown option: ${arg}`);
        }
        break;
    }
  }

  return options;
}

/**
 * Display help information
 */
function showHelp(): void {
  console.log(`
🚀 Release Analysis Performance Benchmark Tool

USAGE:
  npm run benchmark:performance [OPTIONS]

OPTIONS:
  -c, --config <file>     Analysis configuration file (default: auto-detect)
  -i, --iterations <n>    Number of benchmark iterations (default: 5)
  -w, --warmup <n>        Number of warmup iterations (default: 2)
  -o, --output <dir>      Output directory for results (default: ./benchmark-results)
  -b, --baseline <file>   Baseline file for regression comparison
  -v, --verbose           Enable detailed logging
  -q, --quick             Run quick benchmark suite (fewer tests)
  -s, --stress            Run stress test suite (more intensive)
      --compare           Compare with previous baseline
  -h, --help              Show this help message

EXAMPLES:
  # Run standard benchmark suite
  npm run benchmark:performance

  # Run with custom configuration
  npm run benchmark:performance -- --config ./my-config.json --verbose

  # Run quick benchmark with 10 iterations
  npm run benchmark:performance -- --quick --iterations 10

  # Run stress test and save to custom directory
  npm run benchmark:performance -- --stress --output ./stress-results

  # Compare with baseline
  npm run benchmark:performance -- --compare --baseline ./baseline.json

BENCHMARK SUITES:
  Standard: Comprehensive performance testing across different repository sizes
  Quick:    Reduced test set for faster feedback during development
  Stress:   Intensive testing with large datasets and high concurrency

PERFORMANCE TARGETS:
  - Analysis Time: <30s for repositories with <100 documents
  - Memory Usage: <512MB peak memory consumption
  - Throughput:   >3 documents/second processing rate
  - Regression:   <10% performance degradation from baseline

OUTPUT:
  Results are saved in JSON format with detailed metrics including:
  - Execution times (mean, median, percentiles)
  - Memory usage patterns (initial, peak, final)
  - Throughput measurements (docs/sec, bytes/sec)
  - Cache efficiency statistics
  - Parallel processing efficiency
  - Regression analysis (if baseline provided)
`);
}

/**
 * Validate CLI options
 */
function validateOptions(options: CLIOptions): string[] {
  const errors: string[] = [];

  if (options.iterations !== undefined && (options.iterations < 1 || options.iterations > 100)) {
    errors.push('Iterations must be between 1 and 100');
  }

  if (options.warmup !== undefined && (options.warmup < 0 || options.warmup > 20)) {
    errors.push('Warmup iterations must be between 0 and 20');
  }

  if (options.config && !existsSync(options.config)) {
    errors.push(`Configuration file not found: ${options.config}`);
  }

  if (options.baseline && !existsSync(options.baseline)) {
    errors.push(`Baseline file not found: ${options.baseline}`);
  }

  return errors;
}

/**
 * Load analysis configuration
 */
async function loadAnalysisConfig(configPath?: string) {
  const configManager = AnalysisConfigManager.getInstance();

  if (configPath) {
    const result = await configManager.loadConfig(configPath);
    return result.config;
  }

  // Try to auto-detect configuration
  const possiblePaths = [
    '.kiro/release-analysis-config.json',
    'release-analysis-config.json',
    '.kiro/config/analysis.json'
  ];

  for (const path of possiblePaths) {
    if (existsSync(path)) {
      console.log(`📋 Using configuration: ${path}`);
      const result = await configManager.loadConfig(path);
      return result.config;
    }
  }

  // Use default configuration
  console.log('📋 Using default configuration');
  return await configManager.getConfig();
}

/**
 * Create benchmark suite configuration based on CLI options
 */
function createBenchmarkConfig(options: CLIOptions): BenchmarkSuiteConfig {
  const workingDir = process.cwd();

  let config: BenchmarkSuiteConfig = {
    outputDir: options.output || join(workingDir, 'benchmark-results'),
    iterations: options.iterations || 5,
    warmupIterations: options.warmup || 2,
    enableDetailedLogging: options.verbose || false,
    saveResults: true,
    compareWithBaseline: options.compare || false,
    baselineFile: options.baseline
  };

  // Adjust for quick mode
  if (options.quick) {
    config.iterations = Math.min(config.iterations, 3);
    config.warmupIterations = Math.min(config.warmupIterations, 1);
  }

  // Adjust for stress mode
  if (options.stress) {
    config.iterations = Math.max(config.iterations, 10);
    config.warmupIterations = Math.max(config.warmupIterations, 3);
  }

  return config;
}

/**
 * Format benchmark results for console output
 */
function formatResults(results: any): void {
  console.log('\n📊 PERFORMANCE BENCHMARK RESULTS');
  console.log('='.repeat(60));

  console.log(`🕐 Execution Time: ${new Date(results.timestamp).toLocaleString()}`);
  console.log(`🖥️  Environment: ${results.environment.platform} ${results.environment.arch}`);
  console.log(`💻 Node.js: ${results.environment.nodeVersion}`);
  console.log(`🧠 CPU Cores: ${results.environment.cpuCount}`);
  console.log(`💾 Total Memory: ${(results.environment.totalMemory / 1024 / 1024 / 1024).toFixed(1)}GB`);

  console.log('\n📈 TEST RESULTS:');
  console.log('-'.repeat(60));

  for (const result of results.results) {
    const { config, metrics, statistics } = result;

    console.log(`\n🧪 ${config.name.toUpperCase()}`);
    console.log(`   Description: ${config.description}`);
    console.log(`   Documents: ${config.documentCount} (${(config.documentSize / 1024).toFixed(1)}KB each)`);
    console.log(`   Concurrency: ${config.concurrency}`);
    console.log(`   Optimizations: ${config.enableOptimizations ? 'Enabled' : 'Disabled'}`);

    console.log(`   Results:`);
    console.log(`     ⏱️  Mean Time: ${statistics.mean.toFixed(1)}ms`);
    console.log(`     📊 Median Time: ${statistics.median.toFixed(1)}ms`);
    console.log(`     📈 95th Percentile: ${statistics.percentile95.toFixed(1)}ms`);
    console.log(`     🎯 Std Deviation: ${statistics.standardDeviation.toFixed(1)}ms`);
    console.log(`     🚀 Throughput: ${metrics.throughput.documentsPerSecond.toFixed(1)} docs/sec`);
    console.log(`     💾 Peak Memory: ${(metrics.memoryUsage.peak / 1024 / 1024).toFixed(1)}MB`);
    console.log(`     📊 Cache Hit Rate: ${(metrics.cacheStats.hitRate * 100).toFixed(1)}%`);
    console.log(`     ⚡ Parallel Efficiency: ${(metrics.parallelStats.efficiency * 100).toFixed(1)}%`);

    // Performance assessment
    const isGood = statistics.mean < 30000 && // < 30s
      metrics.memoryUsage.peak < 512 * 1024 * 1024 && // < 512MB
      metrics.throughput.documentsPerSecond > 3; // > 3 docs/sec

    console.log(`     ${isGood ? '✅' : '⚠️'} Performance: ${isGood ? 'GOOD' : 'NEEDS ATTENTION'}`);
  }

  console.log('\n📋 SUMMARY:');
  console.log('-'.repeat(60));
  console.log(`✅ Passed Tests: ${results.summary.passedTests}/${results.summary.totalTests}`);
  console.log(`❌ Failed Tests: ${results.summary.failedTests}`);
  console.log(`⏱️  Total Execution Time: ${(results.summary.totalExecutionTime / 1000).toFixed(1)}s`);
  console.log(`📈 Average Performance: ${results.summary.averagePerformance.toFixed(1)}ms`);

  if (results.summary.regressions.length > 0) {
    console.log(`\n⚠️  PERFORMANCE REGRESSIONS:`);
    for (const regression of results.summary.regressions) {
      console.log(`   - ${regression.testName}: +${regression.regressionPercent.toFixed(1)}%`);
    }
  } else if (results.config.compareWithBaseline) {
    console.log(`\n✅ No performance regressions detected`);
  }

  console.log(`\n💾 Results saved to: ${results.config.outputDir}`);
  console.log('='.repeat(60));
}

/**
 * Main execution function
 */
async function main(): Promise<void> {
  const options = parseArgs();

  if (options.help) {
    showHelp();
    process.exit(0);
  }

  // Validate options
  const validationErrors = validateOptions(options);
  if (validationErrors.length > 0) {
    console.error('❌ Validation errors:');
    for (const error of validationErrors) {
      console.error(`   - ${error}`);
    }
    process.exit(1);
  }

  try {
    console.log('🚀 Starting Release Analysis Performance Benchmarks');
    console.log(`📁 Working Directory: ${process.cwd()}`);

    // Load configuration
    const analysisConfig = await loadAnalysisConfig(options.config);

    // Create benchmark configuration
    const benchmarkConfig = createBenchmarkConfig(options);

    if (options.verbose) {
      console.log('📋 Benchmark Configuration:');
      console.log(`   Iterations: ${benchmarkConfig.iterations}`);
      console.log(`   Warmup: ${benchmarkConfig.warmupIterations}`);
      console.log(`   Output: ${benchmarkConfig.outputDir}`);
      console.log(`   Compare with baseline: ${benchmarkConfig.compareWithBaseline}`);
      if (benchmarkConfig.baselineFile) {
        console.log(`   Baseline file: ${benchmarkConfig.baselineFile}`);
      }
    }

    // Initialize and run benchmark runner
    const runner = new PerformanceBenchmarkRunner(
      process.cwd(),
      analysisConfig,
      benchmarkConfig
    );

    const startTime = Date.now();
    const results = await runner.runBenchmarkSuite();
    const totalTime = Date.now() - startTime;

    // Display results
    formatResults(results);

    // Exit with appropriate code
    const hasFailures = results.summary.failedTests > 0;
    const hasRegressions = results.summary.regressions.length > 0;

    if (hasFailures || hasRegressions) {
      console.log(`\n❌ Benchmark completed with issues (${totalTime}ms)`);
      process.exit(1);
    } else {
      console.log(`\n✅ Benchmark completed successfully (${totalTime}ms)`);
      process.exit(0);
    }

  } catch (error) {
    console.error(`\n❌ Benchmark failed: ${error instanceof Error ? error.message : String(error)}`);

    if (options.verbose && error instanceof Error && error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }

    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Run the CLI
if (require.main === module) {
  main();
}