#!/usr/bin/env node

/**
 * Parse Test Results
 * 
 * Extracts failed test names, suite names, error messages, and test counts
 * from Jest test execution output.
 */

const fs = require('fs');
const path = require('path');

// Read the test execution output
const outputPath = path.join(__dirname, 'test-execution-output.txt');
const output = fs.readFileSync(outputPath, 'utf-8');

// Parse test summary from the end of the output
const summaryMatch = output.match(/Test Suites: (\d+) failed, (\d+) passed, (\d+) total\nTests:\s+(\d+) failed, (\d+) skipped, (\d+) passed, (\d+) total/);

if (!summaryMatch) {
  console.error('Could not find test summary in output');
  process.exit(1);
}

const testCounts = {
  suites: {
    failed: parseInt(summaryMatch[1]),
    passed: parseInt(summaryMatch[2]),
    total: parseInt(summaryMatch[3])
  },
  tests: {
    failed: parseInt(summaryMatch[4]),
    skipped: parseInt(summaryMatch[5]),
    passed: parseInt(summaryMatch[6]),
    total: parseInt(summaryMatch[7])
  }
};

// Calculate pass rate
const passRate = ((testCounts.tests.passed / testCounts.tests.total) * 100).toFixed(2);

// Extract failed test suites
const failedSuites = [];
const failRegex = /^FAIL (src\/[^\n]+\.test\.ts)/gm;
let match;

while ((match = failRegex.exec(output)) !== null) {
  const suitePath = match[1];
  if (!failedSuites.includes(suitePath)) {
    failedSuites.push(suitePath);
  }
}

// Extract failed tests with error messages
const failedTests = [];
const testFailureRegex = /● (.+?) › (.+?) › (.+?)\n\n([\s\S]*?)(?=\n\n\s+at |$)/g;

while ((match = testFailureRegex.exec(output)) !== null) {
  const [, suite, describe, testName, errorSection] = match;
  
  // Extract error message and stack trace
  const errorLines = errorSection.split('\n').filter(line => line.trim());
  const errorMessage = errorLines.slice(0, 10).join('\n'); // First 10 lines of error
  
  failedTests.push({
    suite,
    describe,
    testName,
    fullName: `${suite} › ${describe} › ${testName}`,
    errorMessage: errorMessage.trim()
  });
}

// Generate parsed results
const results = {
  timestamp: new Date().toISOString(),
  summary: {
    testSuites: testCounts.suites,
    tests: testCounts.tests,
    passRate: `${passRate}%`
  },
  failedSuites: failedSuites.sort(),
  failedTests: failedTests.map(test => ({
    suite: test.suite,
    describe: test.describe,
    testName: test.testName,
    fullName: test.fullName,
    errorPreview: test.errorMessage.substring(0, 500) + (test.errorMessage.length > 500 ? '...' : '')
  }))
};

// Write results to JSON file
const resultsPath = path.join(__dirname, 'parsed-test-results.json');
fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));

console.log('✅ Test results parsed successfully');
console.log(`\nSummary:`);
console.log(`  Total Test Suites: ${testCounts.suites.total}`);
console.log(`  Failed Test Suites: ${testCounts.suites.failed}`);
console.log(`  Passed Test Suites: ${testCounts.suites.passed}`);
console.log(`  Total Tests: ${testCounts.tests.total}`);
console.log(`  Failed Tests: ${testCounts.tests.failed}`);
console.log(`  Skipped Tests: ${testCounts.tests.skipped}`);
console.log(`  Passed Tests: ${testCounts.tests.passed}`);
console.log(`  Pass Rate: ${passRate}%`);
console.log(`\nFailed Test Suites (${failedSuites.length}):`);
failedSuites.forEach(suite => console.log(`  - ${suite}`));
console.log(`\nResults written to: ${resultsPath}`);
