/**
 * Jest Configuration
 * 
 * This configuration addresses three infrastructure issues identified in Spec 025:
 * 
 * F1: Pattern 1 - Duplicate Test Execution (src + dist)
 *     - Restricts test discovery to src/ directory only
 *     - Prevents tests from running twice (once from src/, once from dist/)
 * 
 * F2: Pattern 2 - Missing Jest Configuration File
 *     - Centralizes configuration for better maintainability
 *     - Provides explicit patterns for test discovery
 * 
 * F3: Pattern 3 - No .d.ts Exclusion Pattern
 *     - Explicitly excludes .d.ts files from test discovery
 *     - Defensive programming against edge cases
 */

module.exports = {
  // TypeScript preset for ts-jest
  preset: 'ts-jest',
  
  // Node.js environment appropriate for infrastructure tests
  testEnvironment: 'node',
  
  // Restrict test discovery to src/ directory only (F1)
  // This prevents duplicate test execution from dist/ directory
  roots: ['<rootDir>/src'],
  
  // Explicit test file patterns (F1, F2)
  // Only match files in __tests__ directories with .test.ts or .test.tsx extension
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.test.tsx'
  ],
  
  // Exclude patterns (F1, F3)
  testPathIgnorePatterns: [
    '/node_modules/',           // Standard exclusion
    '/dist/',                   // Prevent duplicate execution (F1)
    '/coverage/',               // Exclude coverage reports
    '\\.d\\.ts$',               // Explicit .d.ts exclusion (F3)
    'performance/__tests__',    // Performance tests (run separately)
    '__tests__/performance'     // Alternative performance test location
  ],
  
  // Prevent module resolution from dist/ (F1)
  modulePathIgnorePatterns: [
    '<rootDir>/dist/'
  ],
  
  // Timeout for infrastructure tests (F2)
  testTimeout: 10000, // 10 seconds
  
  // Test utilities organization (documented for reference):
  // - Shared fixtures: src/__tests__/fixtures/
  // - Component-specific: src/components/*/__tests__/test-utils.ts
  // - Setup files: src/components/*/__tests__/setup.ts
};
