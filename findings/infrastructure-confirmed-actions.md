# Infrastructure Confirmed Actions

**Date**: December 19, 2025
**Spec**: 025 - Test Suite Overhaul and Standards Alignment
**Section**: Infrastructure (Section 1)
**Status**: Confirmed - Ready for Implementation

---

## Summary

| Category | Count | Notes |
|----------|-------|-------|
| Fix | 3 | All patterns require creating comprehensive jest.config.js |
| Delete | 0 | No tests to delete |
| Refine | 0 | No tests to refine |
| Convert | 0 | No tests to convert |
| Keep | 2 | Test environment setup and shared utilities working correctly |

---

## Fix (Configuration Issues)

### F1: Pattern 1 - Duplicate Test Execution (src + dist)

**Affected Tests**: All ~829 test suites (effectively doubled)
**Fix Approach**: Create jest.config.js with explicit test discovery configuration

**Implementation**:
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  
  // Restrict test discovery to src/ directory only
  roots: ['<rootDir>/src'],
  
  // Explicit test file patterns
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.test.tsx'
  ],
  
  // Exclude dist/, coverage/, and performance tests
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/coverage/',
    '\\.d\\.ts$',
    'performance/__tests__',
    '__tests__/performance'
  ],
  
  // Prevent module resolution from dist/
  modulePathIgnorePatterns: [
    '<rootDir>/dist/'
  ]
};
```

**Rationale**:
- `roots: ['<rootDir>/src']` ensures Jest only looks in src/ directory
- `testMatch` provides explicit patterns for test files
- `testPathIgnorePatterns` excludes dist/, coverage/, and performance tests
- `modulePathIgnorePatterns` prevents module resolution from dist/

**Expected Impact**:
- Reduce test suite count from ~829 to ~415 (50% reduction)
- Reduce test execution time significantly
- Eliminate duplicate test failures
- Clearer test output without duplication

**Validation**:
```bash
# Before fix
npm test -- --listTests | wc -l
# Expected: ~1658 test files (doubled)

# After fix
npm test -- --listTests | wc -l
# Expected: ~829 test files (no duplicates)
```

---

### F2: Pattern 2 - Missing Jest Configuration File

**Affected Tests**: All tests (configuration scattered across files)
**Fix Approach**: Create centralized jest.config.js file

**Implementation**: Same jest.config.js file as F1 (addresses both issues)

**Additional Configuration**:
```javascript
module.exports = {
  // ... test discovery config from F1
  
  // Explicit timeout for infrastructure tests
  testTimeout: 10000, // 10 seconds
  
  // Document utility patterns in comments
  // Test utilities are organized as:
  // - Shared fixtures: src/__tests__/fixtures/
  // - Component-specific: src/components/*/__tests__/test-utils.ts
  // - Setup files: src/components/*/__tests__/setup.ts
};
```

**Rationale**:
- Centralized configuration is easier to maintain
- Explicit patterns prevent unexpected test discovery
- Separates concerns: npm scripts for execution strategy, jest.config.js for discovery
- Enables better IDE integration

**Expected Impact**:
- Clearer test configuration
- Better maintainability
- Easier to add new test patterns or exclusions
- Improved IDE test runner integration

**Validation**:
```bash
# Verify jest.config.js is used
npm test -- --showConfig | grep "configFile"
# Expected: Shows jest.config.js path

# Verify configuration is correct
npm test -- --listTests | grep "dist/"
# Expected: No results (dist/ excluded)
```

---

### F3: Pattern 3 - No .d.ts Exclusion Pattern

**Affected Tests**: N/A (preventative measure)
**Fix Approach**: Add explicit .d.ts exclusion to jest.config.js

**Implementation**: Already included in F1 configuration:
```javascript
testPathIgnorePatterns: [
  // ... other patterns
  '\\.d\\.ts$',  // Explicit .d.ts exclusion
]
```

**Rationale**:
- Explicit is better than implicit - don't rely on Jest's default behavior
- Prevents potential issues if .d.ts files somehow match test patterns
- Documents intent clearly in configuration
- Defensive programming against edge cases

**Expected Impact**:
- No immediate impact (currently not an issue)
- Prevents potential future issues
- Clearer configuration intent

**Validation**:
```bash
# Verify no .d.ts files are picked up as tests
npm test -- --listTests | grep "\\.d\\.ts$"
# Expected: No results
```

---

## Keep (Already Aligned)

### K1: Test Environment Setup

**Affected Tests**: All tests
**Rationale**: Node.js environment is appropriate for infrastructure tests

**Current Configuration**:
- `testEnvironment: 'node'` in package.json
- Tests use Node.js APIs (fs, child_process, path)
- No browser-specific APIs required

**Action**: Keep current approach, document in jest.config.js:
```javascript
module.exports = {
  testEnvironment: 'node', // Appropriate for infrastructure tests
  // ... other config
};
```

**Evidence**:
- All infrastructure tests run correctly in Node environment
- No environment-related test failures
- Tests mock browser APIs appropriately when needed (document.fonts)

---

### K2: Shared Test Utilities

**Affected Tests**: Tests using TokenBuilder and component-specific utilities
**Rationale**: Minimal, well-designed utilities that provide clear value

**Current Utilities**:
- `src/__tests__/fixtures/tokenFixtures.ts` - Token test data builders
- `src/components/core/ButtonCTA/__tests__/test-utils.ts` - Component helpers
- Component-specific setup files

**Action**: Keep current utilities, no changes needed

**Evidence**:
- Token fixtures reference actual system constants (maintainable)
- Component utilities encapsulate web component complexity appropriately
- No utility-related test failures
- No over-engineering or unnecessary abstraction

**Monitoring**: Watch for test utility duplication across components. If 2+ components implement similar utilities, consider extraction to shared location.

---

## Bugs to Address

### None Identified

All issues identified are configuration-related, not code bugs. The infrastructure issues are preventing accurate assessment of actual test failures.

Once infrastructure fixes are implemented, we'll have a clearer view of actual test failures in System Implementation section.

---

## Rejected Findings

### None

All findings were approved as presented.

---

## Implementation Plan

### Task 2.1: Implement Jest Configuration Fixes

**Actions**:
1. Create `jest.config.js` in project root with configuration from F1, F2, F3
2. Remove Jest configuration from `package.json` (keep only npm scripts)
3. Verify configuration with `npm test -- --showConfig`
4. Run tests and verify ~50% reduction in test suite count

**Files to Modify**:
- Create: `jest.config.js`
- Modify: `package.json` (remove jest configuration section)

**Validation**:
```bash
# Verify test suite count reduction
npm test 2>&1 | grep "Test Suites:"
# Expected: ~415 total (down from ~829)

# Verify no dist/ tests
npm test -- --listTests | grep "dist/"
# Expected: No results

# Verify no .d.ts tests
npm test -- --listTests | grep "\\.d\\.ts$"
# Expected: No results
```

**Success Criteria**:
- jest.config.js created with all configuration from F1, F2, F3
- Test suite count reduced by ~50%
- No tests running from dist/ directory
- No .d.ts files picked up as tests
- All npm test scripts work correctly

---

## Expected Test Results After Infrastructure Fixes

### Before Fixes
```
Test Suites: 398 failed, 431 passed, 829 total
Tests:       843 failed, 26 skipped, 11015 passed, 11884 total
```

### After Fixes (Estimated)
```
Test Suites: ~199 failed, ~216 passed, ~415 total
Tests:       ~422 failed, ~13 skipped, ~5508 passed, ~5943 total
```

**Note**: These are estimates based on 50% reduction from eliminating duplicate test execution. Actual numbers may vary slightly.

---

## Verification Checklist

After implementing infrastructure fixes (Task 2.1):

- [ ] jest.config.js created in project root
- [ ] Jest configuration removed from package.json
- [ ] Test suite count reduced by ~50%
- [ ] No tests running from dist/ directory
- [ ] No .d.ts files picked up as tests
- [ ] npm test runs successfully
- [ ] npm run test:all runs successfully
- [ ] npm run test:performance runs successfully
- [ ] Test output is clearer without duplicates

---

## References

- **Findings Document**: `findings/infrastructure-audit-findings.md`
- **Requirements**: 3.1-3.7 (Nuanced recommendations), 4.1-4.6 (Confirmation process), 12.4-12.5 (Bug handling)
- **Design**: Infrastructure evaluation criteria (configuration correctness)
- **Task**: 1.5 (Human confirmation checkpoint)

---

## Approval

**Reviewed By**: Peter Michaels Allen
**Date**: December 19, 2025
**Status**: ✅ Approved - All three fixes confirmed

**Decision**: Proceed with creating comprehensive jest.config.js file to address all three patterns (F1, F2, F3).

---

*Infrastructure confirmed actions document complete. Ready for Task 2.1 (Implementation).*
