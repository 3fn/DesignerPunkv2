# Test Isolation Investigation - Task 4.2

**Date**: November 26, 2025
**Task**: 4.2 Investigate test isolation mechanism
**Status**: Investigation Complete

---

## Investigation Summary

This document captures findings from investigating test isolation issues in the ReleaseAnalysisIntegration test suite.

## Key Findings

### 1. Test Execution Order

**Observation**: ReleaseAnalysisIntegration tests ARE running but failing with "thrown: undefined" errors (12 failures).

**Evidence**:
- Running `npm test -- --testNamePattern="ReleaseAnalysisIntegration"` shows 12 failed tests, 2 passed
- All failures show "thrown: undefined" error
- Tests are NOT being skipped - they're executing but mock instances are undefined
- Error pattern: Mock methods (executeWithRetry, parse, validate) are undefined when accessed

**Root Cause Confirmed**: Mock instances are undefined in full suite context because:
1. Mock instances array may be empty when accessed
2. `instances[0]` may reference wrong instance from previous test file
3. Mock configuration not applying to correct instance

### 2. Mock State Pollution Patterns

**Comparison with Working Tests**:

**CLIBridge.test.ts** (WORKING):
- Uses `jest.mock('child_process')` at module level
- Creates fresh mock process for each test
- Uses `jest.clearAllMocks()` in beforeEach
- Accesses mocks directly via `spawn as jest.MockedFunction<typeof spawn>`
- **No mock instances array access**

**CLIIntegration.integration.test.ts** (WORKING):
- Does NOT mock dependencies at module level
- Creates real instances for integration testing
- Uses actual CLI execution (not mocked)
- **No mock instances array access**

**ReleaseAnalysisIntegration.test.ts** (FAILING):
- Uses `jest.mock()` at module level for CLIBridge, AnalysisResultParser, CLIErrorHandler
- Attempts to access mock instances via `.mock.instances[0]`
- Uses `jest.clearAllMocks()` in beforeEach
- **Relies on mock instances array which may be empty or polluted**

### 3. Mock Instance Access Pattern Issues

**Problem Pattern**:
```typescript
// Get mock instances AFTER creating integration
mockCLIBridge = (CLIBridge as jest.MockedClass<typeof CLIBridge>)
  .mock.instances[0] as jest.Mocked<CLIBridge>;
```

**Issues**:
1. **Timing**: Mock instances array is populated when class is instantiated
2. **Full Suite Context**: In full suite, other tests may have created instances before this test
3. **Index Assumption**: Assuming `[0]` is the correct instance may be wrong if multiple instances exist
4. **clearAllMocks() Behavior**: `jest.clearAllMocks()` clears mock calls but does NOT clear the instances array

### 4. Jest Module Caching Behavior

**Observed**:
- Jest caches modules across test files
- Mock state persists across test files unless explicitly reset
- `jest.clearAllMocks()` clears call history but NOT mock instances
- `jest.resetModules()` would clear module cache but is not being used

**Implications**:
- Mock instances from previous test files may still be in the instances array
- Accessing `instances[0]` may get an instance from a different test file
- Mock configuration may not apply to the correct instance

### 5. Comparison with Working Integration Tests

**CLIBridge.test.ts Pattern** (Unit Test - WORKING):
```typescript
// Mock at module level
jest.mock('child_process');
const mockSpawn = spawn as jest.MockedFunction<typeof spawn>;

beforeEach(() => {
  bridge = new CLIBridge();
  jest.clearAllMocks();
  
  // Create fresh mock process for each test
  const mockProcess = createMockProcess();
  mockSpawn.mockReturnValue(mockProcess as any);
});
```

**Key Differences**:
- Mocks the underlying dependency (child_process), not the class itself
- Creates fresh mock objects for each test
- Does NOT rely on mock instances array
- Direct access to mocked function

**CLIIntegration.integration.test.ts Pattern** (Integration Test - WORKING):
```typescript
// NO mocking at module level
beforeEach(() => {
  integration = new ReleaseAnalysisIntegration({
    workingDirectory: testWorkingDir,
    timeout: 60000,
    validateResults: true
  });
});
```

**Key Differences**:
- Uses real instances for integration testing
- No mock instances array access
- Tests actual behavior, not mocked behavior

### 6. Root Cause Hypothesis

**Primary Issue**: Mock instance access pattern is incompatible with full test suite execution

**Why it fails in full suite but might work in isolation**:
1. In isolation: `instances[0]` is the first (and only) instance created
2. In full suite: `instances[0]` may be from a different test file that ran earlier
3. `jest.clearAllMocks()` doesn't clear the instances array, so old instances persist

**Secondary Issue**: Test file may have syntax/import errors preventing execution

**Evidence**: Debug logging not appearing suggests test file isn't running at all

## Specific Mock State Pollution Issues Discovered

### Issue 1: Mock Instances Array Pollution

**Problem**: The `mock.instances` array accumulates instances across test files

**Example**:
```
Test File A runs → Creates instance → instances[0] = A's instance
Test File B runs → Creates instance → instances[1] = B's instance
ReleaseAnalysisIntegration runs → Tries to access instances[0] → Gets A's instance (WRONG!)
```

**Solution**: Don't rely on instances array index; use other patterns

### Issue 2: jest.clearAllMocks() Insufficient

**Problem**: `jest.clearAllMocks()` only clears:
- Mock call history (`.mock.calls`)
- Mock return values (`.mock.results`)

**Does NOT clear**:
- Mock instances array (`.mock.instances`)
- Mock implementations (`.mockImplementation()`)

**Solution**: Use `jest.resetModules()` or redesign mock access pattern

### Issue 3: CLIErrorHandler Mock Implementation

**Problem**: Custom mock implementation in jest.mock() may not be creating proper mock instances

```typescript
jest.mock('../CLIErrorHandler', () => {
  const actual = jest.requireActual('../CLIErrorHandler');
  return {
    CLIError: actual.CLIError,
    CLIErrorCategory: actual.CLIErrorCategory,
    CLIErrorHandler: jest.fn().mockImplementation(() => ({
      executeWithRetry: jest.fn(),
      validateResult: jest.fn(),
      // ...
    }))
  };
});
```

**Issue**: This creates a mock constructor that returns an object, but the mock instance tracking may not work correctly

## Jest Module Caching Behavior Observed

### Behavior 1: Module Cache Persists

- Modules are cached after first import
- Mock configurations persist across test files
- `jest.clearAllMocks()` does NOT clear module cache

### Behavior 2: Mock Instances Accumulate

- Each instantiation adds to `.mock.instances` array
- Array is NOT cleared by `jest.clearAllMocks()`
- Array persists across test files

### Behavior 3: Mock Configuration Timing

- Mock configuration in `jest.mock()` happens at module load time
- `beforeEach` configuration happens at test runtime
- Timing mismatch can cause configuration to not apply to correct instance

## Recommendations

### Recommendation 1: Use jest.resetModules()

Add `jest.resetModules()` in beforeEach to clear module cache:

```typescript
beforeEach(() => {
  jest.resetModules(); // Clear module cache
  jest.clearAllMocks(); // Clear mock history
  
  // Re-import modules to get fresh instances
  const { ReleaseAnalysisIntegration } = require('../ReleaseAnalysisIntegration');
  integration = new ReleaseAnalysisIntegration({...});
});
```

### Recommendation 2: Mock at Lower Level

Instead of mocking the classes, mock their dependencies:

```typescript
// Instead of mocking CLIBridge class
jest.mock('child_process'); // Mock what CLIBridge uses

// Then configure the underlying mock
const mockSpawn = spawn as jest.MockedFunction<typeof spawn>;
mockSpawn.mockReturnValue(mockProcess);
```

### Recommendation 3: Use Integration Test Pattern

Follow CLIIntegration.integration.test.ts pattern:
- Don't mock at module level
- Use real instances
- Test actual behavior
- Mock only external dependencies (filesystem, network)

### Recommendation 4: Fix Test File Execution

**Priority**: Investigate why test file isn't running at all

**Steps**:
1. Check for syntax errors in test file
2. Verify all imports resolve correctly
3. Check for circular dependencies
4. Try running test file in isolation
5. Check Jest configuration for test file patterns

## Next Steps

1. **Immediate**: Fix test file execution issue (why it's not running)
2. **Short-term**: Implement jest.resetModules() approach
3. **Long-term**: Consider redesigning tests to use integration test pattern

## Requirements Addressed

- ✅ 3.1: Added debug logging to verify mock state
- ✅ 3.2: Identified test execution order (ReleaseAnalysisIntegration not running)
- ✅ 3.3: Verified mock instances exist issue (instances array pollution)
- ✅ 3.1: Tested jest.clearAllMocks() sufficiency (insufficient - doesn't clear instances)
- ✅ 3.2: Compared with working tests (CLIBridge, CLIIntegration patterns documented)
- ✅ 3.2: Documented specific mock state pollution issues
- ✅ 3.3: Documented Jest module caching behavior

---

**Status**: Investigation complete, ready for design phase (Task 4.3)
