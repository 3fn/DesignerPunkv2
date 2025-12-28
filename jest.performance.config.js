/**
 * Jest Configuration for Isolated Performance Tests
 * 
 * This configuration is specifically designed for running PerformanceValidation.test.ts
 * in isolation to get accurate performance measurements without interference from
 * other tests running in parallel.
 * 
 * USAGE:
 *   npm run test:performance:isolated
 * 
 * WHY ISOLATED?
 * Performance tests are highly sensitive to test environment conditions:
 * - Full test suite overhead causes timing measurements to be 5-15x higher
 * - Jest's parallel test execution creates memory pressure
 * - Garbage collection from other tests affects timing accuracy
 * 
 * This config ensures:
 * - Sequential execution (runInBand)
 * - Single worker (maxWorkers: 1)
 * - Only PerformanceValidation tests run
 * - No interference from other test patterns
 * 
 * See: Spec 030 - Test Failure Fixes, Requirement 12 (Performance Test Configuration)
 */

module.exports = {
  // TypeScript preset for ts-jest
  preset: 'ts-jest',
  
  // Node environment for performance tests
  testEnvironment: 'node',
  
  // Restrict test discovery to src/ directory only
  roots: ['<rootDir>/src'],
  
  // Only match PerformanceValidation test file
  testMatch: [
    '**/integration/PerformanceValidation.test.ts'
  ],
  
  // Minimal exclusions - only exclude node_modules and dist
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/'
  ],
  
  // Prevent module resolution from dist/
  modulePathIgnorePatterns: [
    '<rootDir>/dist/'
  ],
  
  // Module name mapping for CSS imports (same as main config)
  moduleNameMapper: {
    '\\.css$': '<rootDir>/src/__tests__/__mocks__/styleMock.js'
  },
  
  // Extended timeout for performance tests
  testTimeout: 30000, // 30 seconds
  
  // Run tests sequentially for accurate timing
  maxWorkers: 1
};
