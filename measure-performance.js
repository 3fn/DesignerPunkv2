/**
 * Performance Measurement Script
 * 
 * Runs the performance variance test multiple times to collect
 * detailed statistics about processing times and variance.
 */

const { execSync } = require('child_process');
const fs = require('fs');

// Configuration
const TEST_RUNS = 10; // Run test 10 times for statistical significance
const TEST_PATTERN = 'AccuracyRegressionTests.*should maintain consistent performance';

console.log('='.repeat(80));
console.log('Performance Measurement Script');
console.log('='.repeat(80));
console.log(`\nConfiguration:`);
console.log(`- Test runs: ${TEST_RUNS}`);
console.log(`- Test pattern: ${TEST_PATTERN}`);
console.log(`\nStarting measurements...\n`);

const results = {
  runs: [],
  timestamp: new Date().toISOString(),
  testPattern: TEST_PATTERN,
  totalRuns: TEST_RUNS
};

// Run the test multiple times
for (let i = 1; i <= TEST_RUNS; i++) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`Run ${i}/${TEST_RUNS}`);
  console.log('='.repeat(80));
  
  const startTime = Date.now();
  
  try {
    // Run the specific test
    const output = execSync(
      `npm test -- --testNamePattern="${TEST_PATTERN}" --silent`,
      { 
        encoding: 'utf-8',
        stdio: 'pipe'
      }
    );
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Parse output for performance metrics
    const lines = output.split('\n');
    let testPassed = false;
    let variance = null;
    let avgTime = null;
    
    // Look for test results
    if (output.includes('PASS')) {
      testPassed = true;
    }
    
    // Try to extract variance from output (if test fails, it shows expected vs received)
    const varianceMatch = output.match(/variance.*?(\d+\.?\d*)/i);
    if (varianceMatch) {
      variance = parseFloat(varianceMatch[1]);
    }
    
    results.runs.push({
      runNumber: i,
      passed: testPassed,
      duration,
      variance,
      avgTime,
      timestamp: new Date().toISOString()
    });
    
    console.log(`✅ Run ${i} completed`);
    console.log(`   Duration: ${duration}ms`);
    console.log(`   Status: ${testPassed ? 'PASSED' : 'FAILED'}`);
    if (variance !== null) {
      console.log(`   Variance: ${variance}`);
    }
    
  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Test failed - try to extract variance from error output
    const errorOutput = error.stdout || error.message || '';
    let variance = null;
    
    // Look for variance in error message
    const varianceMatch = errorOutput.match(/variance.*?(\d+\.?\d*)/i) || 
                         errorOutput.match(/received.*?(\d+\.?\d*)/i);
    if (varianceMatch) {
      variance = parseFloat(varianceMatch[1]);
    }
    
    results.runs.push({
      runNumber: i,
      passed: false,
      duration,
      variance,
      error: error.message.substring(0, 200),
      timestamp: new Date().toISOString()
    });
    
    console.log(`❌ Run ${i} failed`);
    console.log(`   Duration: ${duration}ms`);
    if (variance !== null) {
      console.log(`   Variance: ${variance}`);
    }
  }
  
  // Small delay between runs to avoid interference
  if (i < TEST_RUNS) {
    const delay = 1000; // 1 second
    console.log(`\nWaiting ${delay}ms before next run...`);
    execSync(`sleep ${delay / 1000}`);
  }
}

// Calculate statistics
console.log(`\n${'='.repeat(80)}`);
console.log('Statistical Analysis');
console.log('='.repeat(80));

const durations = results.runs.map(r => r.duration);
const variances = results.runs.filter(r => r.variance !== null).map(r => r.variance);
const passedRuns = results.runs.filter(r => r.passed).length;

// Duration statistics
const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
const minDuration = Math.min(...durations);
const maxDuration = Math.max(...durations);
const durationStdDev = Math.sqrt(
  durations.reduce((sum, d) => sum + Math.pow(d - avgDuration, 2), 0) / durations.length
);
const durationVariance = (maxDuration - minDuration) / avgDuration;

// Variance statistics (from test results)
let avgVariance = null;
let minVariance = null;
let maxVariance = null;
let varianceStdDev = null;

if (variances.length > 0) {
  avgVariance = variances.reduce((sum, v) => sum + v, 0) / variances.length;
  minVariance = Math.min(...variances);
  maxVariance = Math.max(...variances);
  varianceStdDev = Math.sqrt(
    variances.reduce((sum, v) => sum + Math.pow(v - avgVariance, 2), 0) / variances.length
  );
}

results.statistics = {
  testExecution: {
    totalRuns: TEST_RUNS,
    passedRuns,
    failedRuns: TEST_RUNS - passedRuns,
    passRate: (passedRuns / TEST_RUNS * 100).toFixed(2) + '%'
  },
  duration: {
    mean: avgDuration.toFixed(2),
    min: minDuration,
    max: maxDuration,
    stdDev: durationStdDev.toFixed(2),
    variance: durationVariance.toFixed(3),
    unit: 'ms'
  },
  performanceVariance: variances.length > 0 ? {
    mean: avgVariance.toFixed(3),
    min: minVariance.toFixed(3),
    max: maxVariance.toFixed(3),
    stdDev: varianceStdDev ? varianceStdDev.toFixed(3) : null,
    threshold: 0.5,
    exceedsThreshold: avgVariance > 0.5,
    samples: variances.length
  } : null
};

// Display results
console.log(`\nTest Execution:`);
console.log(`  Total runs: ${results.statistics.testExecution.totalRuns}`);
console.log(`  Passed: ${results.statistics.testExecution.passedRuns}`);
console.log(`  Failed: ${results.statistics.testExecution.failedRuns}`);
console.log(`  Pass rate: ${results.statistics.testExecution.passRate}`);

console.log(`\nTest Duration Statistics:`);
console.log(`  Mean: ${results.statistics.duration.mean}ms`);
console.log(`  Min: ${results.statistics.duration.min}ms`);
console.log(`  Max: ${results.statistics.duration.max}ms`);
console.log(`  Std Dev: ${results.statistics.duration.stdDev}ms`);
console.log(`  Variance: ${results.statistics.duration.variance} (${(parseFloat(results.statistics.duration.variance) * 100).toFixed(1)}%)`);

if (results.statistics.performanceVariance) {
  console.log(`\nPerformance Variance (from test):`);
  console.log(`  Mean: ${results.statistics.performanceVariance.mean}`);
  console.log(`  Min: ${results.statistics.performanceVariance.min}`);
  console.log(`  Max: ${results.statistics.performanceVariance.max}`);
  console.log(`  Std Dev: ${results.statistics.performanceVariance.stdDev}`);
  console.log(`  Threshold: ${results.statistics.performanceVariance.threshold}`);
  console.log(`  Exceeds threshold: ${results.statistics.performanceVariance.exceedsThreshold ? 'YES ❌' : 'NO ✅'}`);
  console.log(`  Samples: ${results.statistics.performanceVariance.samples}`);
}

// Save results to file
const outputFile = 'performance-measurement-results.json';
fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));

console.log(`\n${'='.repeat(80)}`);
console.log(`Results saved to: ${outputFile}`);
console.log('='.repeat(80));

// Exit with appropriate code
process.exit(passedRuns === TEST_RUNS ? 0 : 1);
