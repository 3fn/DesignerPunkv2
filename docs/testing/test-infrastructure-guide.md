# Test Infrastructure Guide

**Date**: November 17, 2025
**Purpose**: Best practices for test infrastructure in DesignerPunk
**Organization**: process-standard
**Scope**: cross-project

---

## Overview

This guide documents test infrastructure best practices learned from fixing Issues #018, #023, and #024. It provides guidance on mock setup, test data quality, and common pitfalls to help developers create reliable tests.

**Key Principles**:
- Tests should validate actual production behavior
- Mock setup should follow Jest best practices
- Test data should be valid and realistic
- Tests should be maintainable and clear

---

## Mock Setup Best Practices

### Module-Level Mock Declarations

**Problem**: Mocks created in `beforeEach` hooks can lose scope when accessed in test cases, resulting in "undefined" errors.

**Solution**: Declare all mock variables at module level to ensure accessibility throughout the test file.

#### ❌ Incorrect Pattern

```typescript
describe('My Test Suite', () => {
  beforeEach(() => {
    // Mock created in beforeEach - scope may be lost
    const childProcess = require('child_process');
    const mockExecSync = childProcess.execSync as jest.Mock;
  });

  it('test case', () => {
    // mockExecSync is undefined here!
    mockExecSync.mockReturnValueOnce('');
  });
});
```

#### ✅ Correct Pattern

```typescript
// Declare mocks at module level
let mockExecSync: jest.Mock;
let mockReadFile: jest.Mock;
let mockWriteFile: jest.Mock;

describe('My Test Suite', () => {
  beforeEach(() => {
    // Initialize mocks in beforeEach
    mockExecSync = jest.fn();
    mockReadFile = jest.fn();
    mockWriteFile = jest.fn();
  });

  it('test case', () => {
    // Mocks are accessible here
    mockExecSync.mockReturnValueOnce('');
  });
});
```

**Why This Works**:
- Module-level declarations ensure mocks are accessible throughout the file
- `beforeEach` initialization ensures mocks are fresh for each test
- Clear separation between declaration and initialization

---

### Direct Mock Creation with jest.fn()

**Problem**: Casting module functions to `jest.Mock` doesn't create proper mock objects.

**Solution**: Use `jest.fn()` to create mocks directly, then attach them to modules using `jest.spyOn()`.

#### ❌ Incorrect Pattern

```typescript
beforeEach(() => {
  const childProcess = require('child_process');
  // Casting doesn't create a proper mock
  mockExecSync = childProcess.execSync as jest.Mock;
});
```

#### ✅ Correct Pattern

```typescript
beforeEach(() => {
  // Create mock directly with jest.fn()
  mockExecSync = jest.fn();
  
  // Attach mock to module with jest.spyOn()
  const childProcess = require('child_process');
  jest.spyOn(childProcess, 'execSync').mockImplementation(mockExecSync);
});
```

**Why This Works**:
- `jest.fn()` creates a proper Jest mock with all mock methods
- `jest.spyOn()` attaches the mock to the actual module
- Mock behavior can be configured using standard Jest mock methods

---

### Proper Module Spying

**Problem**: Direct module mocking can be fragile and hard to maintain.

**Solution**: Use `jest.spyOn()` to attach mocks to actual modules while maintaining control.

#### Complete Mock Setup Example

```typescript
// Module-level declarations
let mockExecSync: jest.Mock;
let mockReadFile: jest.Mock;
let mockWriteFile: jest.Mock;
let mockExistsSync: jest.Mock;
let mockStatSync: jest.Mock;

describe('CLI Integration Tests', () => {
  beforeEach(() => {
    // Create mocks using jest.fn()
    mockExecSync = jest.fn();
    mockReadFile = jest.fn();
    mockWriteFile = jest.fn();
    mockExistsSync = jest.fn();
    mockStatSync = jest.fn();

    // Spy on actual modules
    const childProcess = require('child_process');
    jest.spyOn(childProcess, 'execSync').mockImplementation(mockExecSync);

    const fsModule = require('fs');
    jest.spyOn(fsModule, 'existsSync').mockImplementation(mockExistsSync);
    jest.spyOn(fsModule, 'statSync').mockImplementation(mockStatSync);

    const fsPromises = require('fs/promises');
    jest.spyOn(fsPromises, 'readFile').mockImplementation(mockReadFile);
    jest.spyOn(fsPromises, 'writeFile').mockImplementation(mockWriteFile);

    // Reset all mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore original implementations
    jest.restoreAllMocks();
  });

  it('should handle Git operations', () => {
    // Configure mock behavior
    mockExecSync.mockReturnValueOnce('commit-hash');
    
    // Test code that uses child_process.execSync
    // ...
    
    // Verify mock was called correctly
    expect(mockExecSync).toHaveBeenCalledWith(
      expect.stringContaining('git'),
      expect.any(Object)
    );
  });
});
```

**Key Points**:
- Module-level declarations for accessibility
- `jest.fn()` for direct mock creation
- `jest.spyOn()` for module attachment
- `jest.clearAllMocks()` for test isolation
- `jest.restoreAllMocks()` for cleanup

---

## Test Data Quality Requirements

### Valid Test Data

**Problem**: Tests using invalid data can pass even when production code would fail, creating false confidence.

**Solution**: Use valid test data that matches production requirements and passes validation rules.

#### ❌ Incorrect Pattern

```typescript
// Invalid test token - missing required fields
const testToken = {
  name: 'space100',
  baseValue: 8,
  mathematicalRelationship: 'base'  // Invalid format
  // Missing: familyBaseValue, unit, platforms, description
};
```

#### ✅ Correct Pattern

```typescript
// Valid test token - all required fields present
const testToken: PrimitiveToken = {
  name: 'space100',
  category: TokenCategory.SPACING,
  baseValue: 8,
  familyBaseValue: 8,
  mathematicalRelationship: 'base × 1 = 8 × 1 = 8',  // Valid format
  unit: 'px',
  platforms: ['web', 'ios', 'android'],
  description: 'Base spacing unit'
};
```

**Why This Matters**:
- Tests validate actual production behavior
- Invalid test data can hide validation bugs
- Valid data ensures tests catch real issues
- Tests remain useful as production code evolves

---

### Realistic Test Scenarios

**Problem**: Tests that use unrealistic scenarios don't validate actual usage patterns.

**Solution**: Create test scenarios that match how the code will be used in production.

#### Example: ValidationPipeline Tests

```typescript
describe('ValidationPipeline Integration', () => {
  it('should validate tokens with mathematical relationships', async () => {
    // Create realistic tokens that match production usage
    const tokens = [
      {
        name: 'space100',
        category: TokenCategory.SPACING,
        baseValue: 8,
        familyBaseValue: 8,
        mathematicalRelationship: 'base × 1 = 8 × 1 = 8',
        unit: 'px',
        platforms: ['web', 'ios', 'android'],
        description: 'Base spacing unit'
      },
      {
        name: 'space200',
        category: TokenCategory.SPACING,
        baseValue: 16,
        familyBaseValue: 8,
        mathematicalRelationship: 'base × 2 = 8 × 2 = 16',
        unit: 'px',
        platforms: ['web', 'ios', 'android'],
        description: 'Double spacing unit'
      }
    ];

    // Register tokens (matches production workflow)
    tokens.forEach(token => engine.registerPrimitiveToken(token));

    // Validate (matches production workflow)
    const results = await pipeline.validate();

    // Verify results match production expectations
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].level).toBe('Pass');
  });
});
```

**Key Points**:
- Tokens match production structure
- Workflow matches production usage
- Expectations match production behavior
- Tests validate end-to-end scenarios

---

### Mathematical Relationship Formats

**Problem**: Mathematical relationships must be valid and match production formats.

**Solution**: Use descriptive mathematical relationship formats that are validated by the parser.

#### Supported Formats

```typescript
// Simple format - concise
mathematicalRelationship: 'base × 2'

// Explicit format - shows calculation
mathematicalRelationship: '8 × 2 = 16'

// Descriptive format - shows full relationship (recommended)
mathematicalRelationship: 'base × 2 = 8 × 2 = 16'
```

#### Supported Operators

```typescript
// Multiplication
'base × 2'   // Unicode multiplication sign
'base * 2'   // Asterisk
'base x 2'   // Letter x

// Division
'base ÷ 2'   // Unicode division sign
'base / 2'   // Forward slash

// Addition
'base + 4'

// Subtraction
'base - 2'
```

#### Example Usage

```typescript
const spacingTokens = [
  {
    name: 'space050',
    baseValue: 4,
    familyBaseValue: 8,
    mathematicalRelationship: 'base ÷ 2 = 8 ÷ 2 = 4'
  },
  {
    name: 'space100',
    baseValue: 8,
    familyBaseValue: 8,
    mathematicalRelationship: 'base × 1 = 8 × 1 = 8'
  },
  {
    name: 'space200',
    baseValue: 16,
    familyBaseValue: 8,
    mathematicalRelationship: 'base × 2 = 8 × 2 = 16'
  }
];
```

---

## Common Pitfalls and Solutions

### Pitfall 1: Mock Scope Issues

**Symptom**: "Cannot read property 'mockReturnValueOnce' of undefined"

**Cause**: Mocks created in `beforeEach` lose scope when accessed in tests

**Solution**: Use module-level declarations

```typescript
// ✅ Correct
let mockExecSync: jest.Mock;

beforeEach(() => {
  mockExecSync = jest.fn();
});

it('test', () => {
  mockExecSync.mockReturnValueOnce('');  // Works!
});
```

---

### Pitfall 2: Invalid Test Data

**Symptom**: Tests pass but production code fails with validation errors

**Cause**: Test data doesn't match production requirements

**Solution**: Use valid test data that passes validation rules

```typescript
// ✅ Correct
const token: PrimitiveToken = {
  name: 'space100',
  category: TokenCategory.SPACING,
  baseValue: 8,
  familyBaseValue: 8,  // Required for spacing tokens
  mathematicalRelationship: 'base × 1 = 8 × 1 = 8',  // Valid format
  unit: 'px',
  platforms: ['web', 'ios', 'android'],
  description: 'Base spacing unit'
};
```

---

### Pitfall 3: Tests Expecting Non-Existent Files

**Symptom**: Tests fail with "ENOENT: no such file or directory"

**Cause**: Tests expect files that don't exist in current implementation

**Solution**: Update tests to match actual implementation

```typescript
// ❌ Incorrect - expects non-existent file
it('should have automatic hook', () => {
  expect(fs.existsSync('.kiro/hooks/analyze-after-commit.sh')).toBe(true);
});

// ✅ Correct - tests actual implementation
it('should have release manager script', () => {
  expect(fs.existsSync('.kiro/hooks/release-manager.sh')).toBe(true);
});
```

---

### Pitfall 4: Incorrect Mock Casting

**Symptom**: Mock methods not available or undefined

**Cause**: Casting module functions doesn't create proper mocks

**Solution**: Use `jest.fn()` and `jest.spyOn()`

```typescript
// ❌ Incorrect
const mockExecSync = childProcess.execSync as jest.Mock;

// ✅ Correct
mockExecSync = jest.fn();
jest.spyOn(childProcess, 'execSync').mockImplementation(mockExecSync);
```

---

### Pitfall 5: Missing Mock Cleanup

**Symptom**: Tests interfere with each other, inconsistent results

**Cause**: Mocks not reset between tests

**Solution**: Use `jest.clearAllMocks()` and `jest.restoreAllMocks()`

```typescript
beforeEach(() => {
  // Create mocks
  mockExecSync = jest.fn();
  
  // Clear previous mock calls
  jest.clearAllMocks();
});

afterEach(() => {
  // Restore original implementations
  jest.restoreAllMocks();
});
```

---

## Integration Test Patterns

### Pattern 1: End-to-End Workflow Testing

Test complete workflows that match production usage:

```typescript
describe('Token Validation Workflow', () => {
  it('should validate tokens end-to-end', async () => {
    // 1. Create tokens (matches production)
    const token = createValidToken();
    
    // 2. Register tokens (matches production)
    engine.registerPrimitiveToken(token);
    
    // 3. Validate tokens (matches production)
    const results = await pipeline.validate();
    
    // 4. Verify results (matches production expectations)
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].level).toBe('Pass');
  });
});
```

---

### Pattern 2: Error Scenario Testing

Test error handling with realistic error scenarios:

```typescript
describe('Error Handling', () => {
  it('should handle Git command failures', () => {
    // Configure mock to simulate error
    mockExecSync.mockImplementation(() => {
      throw new Error('fatal: not a git repository');
    });
    
    // Verify error is handled correctly
    expect(() => {
      cli.detectReleases();
    }).toThrow('Not a Git repository');
  });
});
```

---

### Pattern 3: Mock Configuration Testing

Test different mock configurations to validate behavior:

```typescript
describe('File System Operations', () => {
  it('should handle missing files', () => {
    // Configure mocks for missing file scenario
    mockExistsSync.mockReturnValue(false);
    
    // Verify behavior
    const result = loadConfig();
    expect(result).toBeNull();
  });

  it('should handle existing files', () => {
    // Configure mocks for existing file scenario
    mockExistsSync.mockReturnValue(true);
    mockReadFile.mockResolvedValue('{"key": "value"}');
    
    // Verify behavior
    const result = await loadConfig();
    expect(result).toEqual({ key: 'value' });
  });
});
```

---

## Quick Reference

### Mock Setup Checklist

- ✅ Declare mocks at module level
- ✅ Create mocks with `jest.fn()`
- ✅ Attach mocks with `jest.spyOn()`
- ✅ Clear mocks in `beforeEach` with `jest.clearAllMocks()`
- ✅ Restore mocks in `afterEach` with `jest.restoreAllMocks()`

### Test Data Checklist

- ✅ Use valid data that matches production requirements
- ✅ Include all required fields per interface
- ✅ Use valid mathematical relationship formats
- ✅ Match production token structure
- ✅ Test realistic scenarios

### Common Issues Checklist

- ✅ Check for module-level mock declarations
- ✅ Verify mocks created with `jest.fn()`
- ✅ Confirm `jest.spyOn()` usage
- ✅ Ensure test data is valid
- ✅ Verify tests match current implementation

---

## Related Documentation

- [Jest Documentation](https://jestjs.io/docs/mock-functions) - Official Jest mocking guide
- [Issue #018](.kiro/audits/phase-1-issues-registry.md) - CLI mock setup issues
- [Issue #023](.kiro/audits/phase-1-issues-registry.md) - ValidationPipeline test issues
- [Issue #024](.kiro/audits/phase-1-issues-registry.md) - Infrastructure test issues
- [Task 1 Completion](.kiro/specs/002-test-infrastructure-fixes/completion/task-1-parent-completion.md) - ValidationPipeline fix
- [Task 2 Completion](.kiro/specs/002-test-infrastructure-fixes/completion/task-2-parent-completion.md) - CLI mock fix
- [Task 3 Completion](.kiro/specs/002-test-infrastructure-fixes/completion/task-3-parent-completion.md) - Infrastructure fix

---

**This guide provides comprehensive test infrastructure best practices based on real issues encountered and resolved in the DesignerPunk project.**
