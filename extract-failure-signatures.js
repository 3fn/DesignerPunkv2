#!/usr/bin/env node

/**
 * Extract unique failure signatures from test output
 * 
 * A failure signature consists of:
 * - Test file path
 * - Error type
 * - Core error message (normalized - no line numbers)
 */

const fs = require('fs');
const path = require('path');

function normalizeErrorMessage(message) {
  // Remove line numbers and file paths to create stable signature
  return message
    .replace(/:\d+:\d+/g, '') // Remove line:column numbers
    .replace(/at .+\(.+:\d+:\d+\)/g, '') // Remove stack trace lines
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

function extractFailures(testOutput) {
  const failures = [];
  const lines = testOutput.split('\n');
  
  let currentTest = null;
  let currentError = null;
  let currentMessage = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Match test file header: FAIL src/path/to/test.ts
    if (line.match(/^FAIL\s+(.+\.test\.ts)/)) {
      const match = line.match(/^FAIL\s+(.+\.test\.ts)/);
      currentTest = match[1];
      continue;
    }
    
    // Match error type and message
    if (line.match(/^\s+●/) && currentTest) {
      // Save previous failure if exists
      if (currentError && currentMessage.length > 0) {
        failures.push({
          testFile: currentTest,
          errorType: currentError,
          errorMessage: normalizeErrorMessage(currentMessage.join(' '))
        });
      }
      
      // Start new failure
      currentError = 'TestFailure';
      currentMessage = [line.replace(/^\s+●\s+/, '')];
      continue;
    }
    
    // Collect error message lines
    if (currentError && line.trim() && !line.match(/^FAIL/) && !line.match(/^Test Suites:/)) {
      // Look for specific error types
      if (line.includes('Error:') || line.includes('thrown:')) {
        const errorMatch = line.match(/([\w]+Error):/);
        if (errorMatch) {
          currentError = errorMatch[1];
        }
      }
      currentMessage.push(line.trim());
    }
    
    // End of error block
    if (line.match(/^Test Suites:/) && currentError && currentMessage.length > 0) {
      failures.push({
        testFile: currentTest,
        errorType: currentError,
        errorMessage: normalizeErrorMessage(currentMessage.join(' '))
      });
      currentError = null;
      currentMessage = [];
    }
  }
  
  return failures;
}

function generateUniqueSignatures(failures) {
  const signatures = new Map();
  
  for (const failure of failures) {
    const key = `${failure.testFile}|${failure.errorType}|${failure.errorMessage}`;
    
    if (!signatures.has(key)) {
      signatures.set(key, {
        testFile: failure.testFile,
        errorType: failure.errorType,
        errorMessage: failure.errorMessage,
        count: 1
      });
    } else {
      signatures.get(key).count++;
    }
  }
  
  return Array.from(signatures.values());
}

// Main execution
const testOutputFile = process.argv[2] || 'test-output-phase2-baseline.txt';

try {
  const testOutput = fs.readFileSync(testOutputFile, 'utf8');
  const failures = extractFailures(testOutput);
  const uniqueSignatures = generateUniqueSignatures(failures);
  
  // Output as JSON
  const baseline = {
    timestamp: new Date().toISOString(),
    phase: 'phase-2-baseline',
    totalFailures: failures.length,
    uniqueFailures: uniqueSignatures.length,
    signatures: uniqueSignatures
  };
  
  console.log(JSON.stringify(baseline, null, 2));
  
  // Also save to file
  fs.writeFileSync('phase2-baseline-failures.json', JSON.stringify(baseline, null, 2));
  
  console.error(`\n✅ Extracted ${uniqueSignatures.length} unique failure signatures from ${failures.length} total failures`);
  console.error(`📁 Saved to: phase2-baseline-failures.json`);
  
} catch (error) {
  console.error('Error processing test output:', error.message);
  process.exit(1);
}
