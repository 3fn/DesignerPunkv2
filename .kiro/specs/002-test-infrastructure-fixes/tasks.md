# Implementation Plan: Test Infrastructure Fixes

**Date**: November 16, 2025
**Spec**: 002-test-infrastructure-fixes
**Status**: Implementation Planning
**Dependencies**: None
**Related Issues**: #018, #023, #024

---

## Implementation Plan

This implementation plan fixes three test infrastructure issues through targeted fixes to test data, mock setup, and test expectations. The approach addresses each issue independently with clear validation criteria.

---

## Task List

- [x] 1. Fix ValidationPipeline Integration Tests (Issue #023)

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - ValidationPipeline integration tests pass without empty result errors
  - Test tokens use valid data that passes validation rules
  - Tests validate actual production behavior
  - Issue #023 resolved
  
  **Primary Artifacts:**
  - `src/__tests__/integration/ValidationPipeline.test.ts` (modified)
  - Passing test results
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/002-test-infrastructure-fixes/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/002-test-infrastructure-fixes/task-1-summary.md` (triggers release detection)

  - [x] 1.1 Identify invalid test token data
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Review test tokens in ValidationPipeline.test.ts
    - Identify fields that cause validation failures
    - Document what makes each token invalid
    - Review PrimitiveToken interface for required fields
    - _Requirements: 1.5_

  - [x] 1.2 Update test tokens to use valid data
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update `mathematicalRelationship` to valid format ('Based on 8')
    - Add `familyBaseValue` field for spacing tokens
    - Add all required fields per PrimitiveToken interface
    - Verify tokens match validation rules
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 1.3 Implement mathematical relationship parser
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    - Design parser for mathematical relationship expressions
    - Support multiple formats: 'base × 2', '8 × 2 = 16', 'base × 2 = 8 × 2 = 16'
    - Implement validation logic that verifies mathematical correctness
    - Handle operators: ×, *, x, ÷, /, +, -
    - Validate relationship matches actual baseValue and familyBaseValue
    - Create unit tests for parser with edge cases
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 1.4 Update ValidationCoordinator to use parser
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Replace string equality check with parser validation
    - Update `buildMathematicalContext` to use parser
    - Update `familyFoundation` validation in ErrorValidator
    - Ensure backward compatibility with simple formats
    - Test with both simple and complex relationship formats
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 1.5 Update test tokens to use descriptive format
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Change test tokens from 'Based on 8' to descriptive format
    - Use format: 'base × 1 = 8 × 1 = 8' for space100
    - Use format: 'base × 2 = 8 × 2 = 16' for space200
    - Verify tests still pass with new parser
    - Verify production tokens would pass validation
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 1.6 Run ValidationPipeline tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run `npm test -- src/__tests__/integration/ValidationPipeline.test.ts`
    - Verify all tests pass with new parser
    - Verify validation results are returned (not empty)
    - Test with various mathematical relationship formats
    - Document test results
    - _Requirements: 1.4, 4.1_

---

- [x] 2. Fix Release Analysis CLI Test Mocks (Issue #018)

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Release Analysis CLI tests pass without mock undefined errors
  - Mock objects properly initialized and accessible in tests
  - Tests use correct Jest mocking patterns
  - Issue #018 resolved
  
  **Primary Artifacts:**
  - `src/release-analysis/__tests__/CLIIntegration.test.ts` (modified)
  - Passing test results
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/002-test-infrastructure-fixes/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/002-test-infrastructure-fixes/task-2-summary.md` (triggers release detection)

  - [x] 2.1 Declare mocks at module level
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add module-level declarations for all mock variables
    - Declare `mockExecSync`, `mockExistsSync`, `mockStatSync`, etc.
    - Ensure mocks are accessible throughout test file
    - _Requirements: 2.1, 2.2_

  - [x] 2.2 Fix mock initialization in beforeEach
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create mocks using `jest.fn()` directly
    - Use `jest.spyOn()` to attach mocks to actual modules
    - Remove incorrect mock casting patterns
    - Verify mocks are properly initialized
    - _Requirements: 2.3, 2.4_

  - [x] 2.3 Run CLI integration tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run `npm test -- src/release-analysis/__tests__/CLIIntegration.test.ts`
    - Verify tests pass without undefined errors
    - Verify mocks are accessible in test scope
    - Document test results
    - _Requirements: 2.5, 4.2_

---

- [ ] 3. Fix Release Analysis Test Infrastructure (Issue #024)

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Release Analysis infrastructure tests pass or are updated to match implementation
  - Mock scope issues resolved
  - Tests don't expect non-existent hook files
  - Issue #024 resolved
  
  **Primary Artifacts:**
  - `src/release-analysis/__tests__/CLIIntegration.test.ts` (modified)
  - `src/release-analysis/hooks/__tests__/HookScripts.test.ts` (modified or removed)
  - Passing test results
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/002-test-infrastructure-fixes/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/002-test-infrastructure-fixes/task-3-summary.md` (triggers release detection)

  - [ ] 3.1 Fix mock scope issues in CLIIntegration tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Apply same mock fixes as Task 2 (if not already done)
    - Verify mock scope is maintained correctly
    - Test that mocks are accessible in all test cases
    - _Requirements: 3.1, 3.2_

  - [ ] 3.2 Update or remove HookScripts tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Review tests expecting hook files that don't exist
    - Decide: update tests to match current implementation or remove tests
    - If updating: test manual workflow documentation
    - If removing: document why tests were removed
    - _Requirements: 3.3, 3.4_

  - [ ] 3.3 Run infrastructure tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run `npm test -- src/release-analysis/hooks/__tests__/HookScripts.test.ts`
    - Verify tests pass or are properly skipped/removed
    - Document test results and decisions made
    - _Requirements: 3.5, 4.3_

---

- [ ] 4. Validate All Test Fixes and Update Registry

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All three test infrastructure issues resolved
  - Full test suite shows improved health
  - Test infrastructure standards documented
  - Issues #018, #023, #024 marked as resolved
  
  **Primary Artifacts:**
  - Full test suite results
  - Test infrastructure documentation
  - Updated issues registry
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/002-test-infrastructure-fixes/completion/task-4-parent-completion.md`
  - Summary: `docs/specs/002-test-infrastructure-fixes/task-4-summary.md` (triggers release detection)

  - [ ] 4.1 Run full test suite
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run `npm test` to execute full test suite
    - Compare results to baseline (from test-failures-analysis.md)
    - Document improvements in test health
    - Verify no regressions in other tests
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [ ] 4.2 Document test infrastructure best practices
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create or update test infrastructure documentation
    - Document mock setup best practices
    - Provide examples of correct mock initialization
    - Document test data quality requirements
    - Explain common pitfalls and how to avoid them
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ] 4.3 Update issues registry
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update `.kiro/audits/phase-1-issues-registry.md`
    - Mark Issue #018 as [RESOLVED]
    - Mark Issue #023 as [RESOLVED]
    - Mark Issue #024 as [RESOLVED]
    - Add resolution dates and spec references
    - Update issue counts in registry summary
    - _Requirements: All requirements_

---

## Task Summary

**Total Tasks**: 4 parent tasks, 15 subtasks

**By Issue**:
- Issue #023 (ValidationPipeline): 1 parent task, 6 subtasks
- Issue #018 (CLI Mocks): 1 parent task, 3 subtasks
- Issue #024 (Infrastructure): 1 parent task, 3 subtasks
- Validation & Documentation: 1 parent task, 3 subtasks

**By Type**:
- Setup: 0 tasks
- Implementation: 13 tasks
- Architecture: 1 task (mathematical relationship parser)
- Parent: 4 tasks (overall coordination)

**Estimated Complexity**: Medium
- ValidationPipeline fix requires architectural work (parser design)
- Mathematical relationship parser is complex but well-scoped
- Mock fixes are standard Jest patterns
- Infrastructure fixes require decisions about test expectations
- Clear validation criteria for each fix

**Estimated Time**: 4-5 hours
- ValidationPipeline fix: 2 hours (includes parser implementation)
  - Parser design and implementation: 1 hour
  - ValidationCoordinator updates: 30 minutes
  - Test updates and validation: 30 minutes
- CLI mock fix: 45 minutes
- Infrastructure fix: 45 minutes
- Validation & documentation: 1 hour

---

## Execution Notes

### Task Execution Order

Tasks can be executed in parallel or sequentially:
- **Parallel**: Tasks 1, 2, 3 are independent and can be done simultaneously
- **Sequential**: Complete Tasks 1-3 in order, then Task 4 for validation

**Recommended**: Sequential execution for easier validation and debugging

### Validation Strategy

After each parent task:
1. Run affected test file(s) in isolation
2. Verify tests pass
3. Run `getDiagnostics` on modified files
4. Commit changes before moving to next task

### Rollback Points

Commit after each parent task completes:
- After Task 1: ValidationPipeline tests fixed
- After Task 2: CLI mock tests fixed
- After Task 3: Infrastructure tests fixed
- After Task 4: All validated and documented

### Success Criteria

Spec is complete when:
- ✅ All 4 parent tasks marked complete
- ✅ ValidationPipeline tests pass (Issue #023 resolved)
- ✅ Release Analysis CLI tests pass (Issue #018 resolved)
- ✅ Release Analysis infrastructure tests pass (Issue #024 resolved)
- ✅ Test infrastructure best practices documented
- ✅ Issues #018, #023, #024 marked as resolved in registry
- ✅ Full test suite shows improved health

---

**Organization**: spec-tasks
**Scope**: 002-test-infrastructure-fixes
