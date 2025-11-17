# Design Document: Test Infrastructure Fixes

**Date**: November 16, 2025
**Spec**: 002-test-infrastructure-fixes
**Status**: Design Phase
**Dependencies**: None
**Related Issues**: #018, #023, #024

---

## Overview

This design document outlines the technical approach for fixing three test infrastructure issues: ValidationPipeline integration tests (Issue #023), Release Analysis CLI test mocks (Issue #018), and Release Analysis test infrastructure (Issue #024).

**Design Goals**:
- Fix ValidationPipeline tests by using valid test data
- Fix Release Analysis CLI mocks by correcting mock initialization
- Fix Release Analysis infrastructure by addressing mock scope and missing files
- Improve overall test suite health
- Document test infrastructure best practices

**Approach**: Three parallel fix streams, one for each issue:
1. **ValidationPipeline Fix**: Update test data to use valid tokens that pass validation
2. **CLI Mock Fix**: Correct mock initialization and scope handling
3. **Infrastructure Fix**: Fix mock scope issues and handle missing hook files

---

## Architecture

### Issue #023: ValidationPipeline Integration Tests

**Current State (Broken)**:
```
┌─────────────────────────────────────────────────────────────┐
│           ValidationPipeline.test.ts                         │
│                                                              │
│  const token = {                                            │
│    name: 'space100',                                        │
│    mathematicalRelationship: 'base'  ← INVALID             │
│  };                                                          │
│                                                              │
│  engine.registerPrimitiveToken(token);  ← FAILS VALIDATION │
│  // Token NOT registered (validation failed)                │
│                                                              │
│  const results = await pipeline.validate();                 │
│  // Returns [] (no tokens to validate)                      │
│                                                              │
│  expect(results.length).toBeGreaterThan(0);  ❌ FAILS      │
└─────────────────────────────────────────────────────────────┘
```

**Target State (Fixed)**:
```
┌─────────────────────────────────────────────────────────────┐
│           ValidationPipeline.test.ts                         │
│                                                              │
│  const token = {                                            │
│    name: 'space100',                                        │
│    mathematicalRelationship: '1.0x base'  ← VALID          │
│    familyBaseValue: 8,                                      │
│    // ... all required fields                               │
│  };                                                          │
│                                                              │
│  engine.registerPrimitiveToken(token);  ← PASSES VALIDATION│
│  // Token registered successfully                           │
│                                                              │
│  const results = await pipeline.validate();                 │
│  // Returns validation results for registered token         │
│                                                              │
│  expect(results.length).toBeGreaterThan(0);  ✅ PASSES     │
└─────────────────────────────────────────────────────────────┘
```

**Root Cause**: Test tokens use invalid data that fails validation-before-registration checks. The validation system is working correctly - it's preventing invalid tokens from being registered. Tests need to use valid token data.

---

### Issue #018 & #024: Release Analysis Test Mocks

**Current State (Broken)**:
```
┌─────────────────────────────────────────────────────────────┐
│           CLIIntegration.test.ts                             │
│                                                              │
│  beforeEach(() => {                                         │
│    const childProcess = require('child_process');          │
│    mockExecSync = childProcess.execSync as jest.Mock;      │
│    // Mock created but scope may be lost                    │
│  });                                                         │
│                                                              │
│  it('test', () => {                                         │
│    mockExecSync  ← UNDEFINED ❌                            │
│      .mockReturnValueOnce('');                              │
│  });                                                         │
└─────────────────────────────────────────────────────────────┘
```

**Target State (Fixed)**:
```
┌─────────────────────────────────────────────────────────────┐
│           CLIIntegration.test.ts                             │
│                                                              │
│  let mockExecSync: jest.Mock;  ← Declared at module level  │
│                                                              │
│  beforeEach(() => {                                         │
│    mockExecSync = jest.fn();  ← Direct Jest mock           │
│    jest.spyOn(childProcess, 'execSync')                     │
│      .mockImplementation(mockExecSync);                     │
│  });                                                         │
│                                                              │
│  it('test', () => {                                         │
│    mockExecSync  ← DEFINED ✅                              │
│      .mockReturnValueOnce('');                              │
│  });                                                         │
└─────────────────────────────────────────────────────────────┘
```

**Root Cause**: Mock objects are created in beforeEach but scope is lost when accessed in tests. Need to declare mocks at module level and use proper Jest mocking patterns.

---

## Components and Interfaces

### ValidationPipeline Test Fix

**Current Test Token (Invalid)**:
```typescript
const token: PrimitiveToken = {
  name: 'space100',
  category: TokenCategory.SPACING,
  baseValue: 8,
  mathematicalRelationship: 'base',  // ← INVALID
  // Missing required fields
};
```

**Fixed Test Token (Valid)**:
```typescript
const token: PrimitiveToken = {
  name: 'space100',
  category: TokenCategory.SPACING,
  baseValue: 8,
  familyBaseValue: 8,  // ← ADDED
  mathematicalRelationship: '1.0x base',  // ← FIXED
  unit: 'px',
  platforms: ['web', 'ios', 'android'],
  description: 'Base spacing unit',
  // All required fields present
};
```

**Changes Required**:
- Update `mathematicalRelationship` to valid format (`'1.0x base'` instead of `'base'`)
- Add `familyBaseValue` field (required for spacing tokens)
- Add all other required fields per PrimitiveToken interface
- Verify token passes validation before using in tests

---

### Release Analysis CLI Mock Fix

**Current Mock Setup (Broken)**:
```typescript
beforeEach(async () => {
  // ... other setup ...
  
  const childProcess = require('child_process');
  mockExecSync = childProcess.execSync as jest.Mock;  // ← Scope issue
  
  // ... other mocks ...
});
```

**Fixed Mock Setup**:
```typescript
// Module-level declarations
let mockExecSync: jest.Mock;
let mockExistsSync: jest.Mock;
let mockStatSync: jest.Mock;

beforeEach(async () => {
  // ... other setup ...
  
  // Create mocks directly
  mockExecSync = jest.fn();
  mockExistsSync = jest.fn();
  mockStatSync = jest.fn();
  
  // Spy on actual modules
  jest.spyOn(require('child_process'), 'execSync')
    .mockImplementation(mockExecSync);
  jest.spyOn(require('fs'), 'existsSync')
    .mockImplementation(mockExistsSync);
  jest.spyOn(require('fs'), 'statSync')
    .mockImplementation(mockStatSync);
  
  // ... other mocks ...
});
```

**Changes Required**:
- Declare mock variables at module level (outside beforeEach)
- Create mocks using `jest.fn()` directly
- Use `jest.spyOn()` to attach mocks to actual modules
- Ensure mocks are accessible in test scope

---

### Release Analysis Hook File Handling

**Current State (Missing Files)**:
```typescript
it('should exist and be executable', () => {
  const hookPath = '.kiro/hooks/analyze-after-commit.sh';
  expect(fs.existsSync(hookPath)).toBe(true);  // ← FAILS: file doesn't exist
});
```

**Option 1: Update Tests (Recommended)**:
```typescript
it('should use manual release detection workflow', () => {
  // Test that manual workflow is documented
  const workflowDoc = fs.readFileSync('.kiro/steering/Development Workflow.md', 'utf-8');
  expect(workflowDoc).toContain('release-manager.sh auto');
});
```

**Option 2: Create Placeholder Files**:
```typescript
// Create placeholder hook files for tests
const hookContent = `#!/bin/bash
# Placeholder for analyze-after-commit hook
# Use manual workflow: ./.kiro/hooks/release-manager.sh auto
`;
```

**Decision**: Update tests to match current implementation (manual workflow) rather than creating unused hook files.

---

## Data Models

### Valid PrimitiveToken Structure (for tests)

```typescript
interface PrimitiveToken {
  name: string;                          // Required: 'space100'
  category: TokenCategory;               // Required: TokenCategory.SPACING
  baseValue: number;                     // Required: 8
  familyBaseValue: number;               // Required: 8 (for spacing)
  mathematicalRelationship: string;      // Required: '1.0x base' (valid format)
  unit: string;                          // Required: 'px'
  platforms: TargetPlatform[];           // Required: ['web', 'ios', 'android']
  description: string;                   // Required: 'Base spacing unit'
}
```

### Mock Object Declarations

```typescript
// Module-level mock declarations
let mockExecSync: jest.Mock;
let mockExistsSync: jest.Mock;
let mockStatSync: jest.Mock;
let mockReadFile: jest.Mock;
let mockWriteFile: jest.Mock;
let mockGlob: jest.Mock;
```

---

## Error Handling

### ValidationPipeline Tests

**Token Validation Failures**:
- If test token still fails validation, log validation error
- Review validation rules to understand requirements
- Update token data to match requirements
- Verify token passes validation before using in tests

### Release Analysis Tests

**Mock Initialization Failures**:
- If mocks are still undefined, check module-level declarations
- Verify jest.spyOn() is called correctly
- Check that mocks are created before tests execute
- Use console.log to debug mock state if needed

**Missing File Errors**:
- Update tests to match current implementation
- Remove expectations for files that don't exist
- Test actual workflow (manual release detection)
- Document why files don't exist (feature not implemented)

---

## Testing Strategy

### Validation Approach

**After Each Fix**:
1. Run affected test file in isolation
2. Verify tests pass
3. Run full test suite to check for regressions
4. Compare test results to baseline

**ValidationPipeline Tests**:
```bash
npm test -- src/__tests__/integration/ValidationPipeline.test.ts
```

**Release Analysis CLI Tests**:
```bash
npm test -- src/release-analysis/__tests__/CLIIntegration.test.ts
```

**Release Analysis Infrastructure Tests**:
```bash
npm test -- src/release-analysis/hooks/__tests__/HookScripts.test.ts
```

### Integration Testing

**Full Test Suite**:
```bash
npm test
```

**Metrics to Track**:
- Total test suites passing (before vs after)
- Total tests passing (before vs after)
- Specific test files fixed
- Overall test health improvement

---

## Design Decisions

### Decision 1: Fix Test Data vs Disable Validation

**Options Considered**:
1. **Fix test data**: Update tokens to use valid data that passes validation
2. **Disable validation**: Use `autoValidate: false` in test engine config
3. **Mock validation**: Mock the validation system to always return success

**Decision**: Fix test data to use valid tokens

**Rationale**:
The validation-before-registration pattern is a core architectural feature that prevents invalid tokens from entering the system. Disabling validation in tests would:
- Test unrealistic scenarios (invalid tokens being registered)
- Miss validation bugs that could affect production
- Create test behavior that doesn't match production behavior

Fixing test data ensures tests validate actual production behavior and catch real validation issues.

**Trade-offs**:
- ✅ **Gained**: Tests validate production behavior, catch real validation bugs, test realistic scenarios
- ✅ **Gained**: Understanding of token validation requirements
- ❌ **Lost**: Slightly more effort to create valid test data
- ⚠️ **Risk**: None - valid test data is the correct approach

**Counter-Arguments**:
- **Argument**: Disabling validation would be faster and easier
- **Response**: Tests should validate production behavior. Disabling validation creates unrealistic test scenarios that don't catch real bugs. The effort to create valid test data is minimal and provides better test quality.

---

### Decision 2: Fix Mock Scope vs Refactor Test Structure

**Options Considered**:
1. **Fix mock scope**: Declare mocks at module level, use proper Jest patterns
2. **Refactor tests**: Redesign test structure to avoid mock scope issues
3. **Use different mocking library**: Switch from Jest mocks to sinon or similar

**Decision**: Fix mock scope using proper Jest patterns

**Rationale**:
The mock scope issue is a simple fix - declare mocks at module level and use `jest.fn()` + `jest.spyOn()` correctly. Refactoring the entire test structure or switching mocking libraries would be overkill for a simple scope issue.

Jest is the standard testing framework for this project and provides all needed mocking capabilities. The issue is incorrect usage, not framework limitations.

**Trade-offs**:
- ✅ **Gained**: Simple fix, maintains existing test structure, uses standard Jest patterns
- ✅ **Gained**: Learning opportunity for correct Jest mock usage
- ❌ **Lost**: None - this is the straightforward solution
- ⚠️ **Risk**: None - standard Jest patterns are well-documented

**Counter-Arguments**:
- **Argument**: Refactoring tests would provide opportunity to improve test structure
- **Response**: Test structure is fine - the only issue is mock scope. Refactoring would add unnecessary complexity and risk for no benefit. Fix the actual problem (scope) rather than redesigning working tests.

---

### Decision 3: Update Tests vs Create Hook Files

**Options Considered**:
1. **Update tests**: Remove expectations for non-existent hook files, test actual workflow
2. **Create hook files**: Create placeholder hook files to make tests pass
3. **Skip tests**: Mark tests as skipped until feature is implemented

**Decision**: Update tests to match current implementation

**Rationale**:
The hook files don't exist because the automatic release analysis feature was never implemented. The current workflow uses manual release detection (`./.kiro/hooks/release-manager.sh auto`), which works correctly.

Creating placeholder files just to make tests pass would be misleading - it would suggest the feature exists when it doesn't. Updating tests to validate the actual workflow (manual detection) provides real value.

**Trade-offs**:
- ✅ **Gained**: Tests validate actual implementation, no misleading placeholder files
- ✅ **Gained**: Opportunity to document actual workflow in tests
- ❌ **Lost**: Tests no longer validate automatic hook feature (which doesn't exist)
- ⚠️ **Risk**: None - tests should match implementation

**Counter-Arguments**:
- **Argument**: Creating placeholder files would be faster than updating tests
- **Response**: Placeholder files would be misleading and provide no value. Tests should validate actual behavior, not pretend features exist. Updating tests to match implementation is the honest approach.

---

**Organization**: spec-design
**Scope**: 002-test-infrastructure-fixes
