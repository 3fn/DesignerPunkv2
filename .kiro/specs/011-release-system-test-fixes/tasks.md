# Implementation Plan: Release System Test Fixes

**Date**: November 30, 2025  
**Spec**: 011-release-system-test-fixes  
**Status**: Implementation Planning  
**Dependencies**: None

---

## Implementation Plan

This implementation plan addresses all 5 test failures discovered in the release management system. The plan includes 3 critical fixes (required to unblock Container spec) and 2 optional fixes (improve overall test quality but don't block workflow).

The approach prioritizes quick, focused fixes to unblock the Container spec while documenting optional improvements that can be tackled when time permits.

---

## Task List

- [x] 1. Fix ReleaseCLI Error Handling

  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  
  **Objective**: Replace `process.exit()` calls with error results to prevent Jest worker crashes
  
  **Implementation Steps**:
  - Locate `process.exit(1)` call in `src/release/cli/ReleaseCLI.ts` (line 152)
  - Replace with error result return: `return { success: false, error: error.message, exitCode: 1 }`
  - Update `executeRelease()` return type to `Promise<ReleaseResult>`
  - Update error handling to return results instead of exiting
  - Verify no other `process.exit()` calls exist in ReleaseCLI class
  
  **Validation**:
  - Run `npm test -- src/release/cli/__tests__/ReleaseCLI.test.ts`
  - Verify all tests pass without Jest worker crashes
  - Verify error conditions return error results
  - Verify tests can catch and verify errors
  
  _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Fix CLI Argument Handling

  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  
  **Objective**: Update CLI argument parser to show help on unknown flags instead of failing
  
  **Implementation Steps**:
  - Locate CLI argument parsing logic (likely in ReleaseCLI or argument parser module)
  - Wrap argument parsing in try-catch to handle unknown flags
  - Return help result with exit code 0 when unknown flags encountered
  - Update help message generation to be clear and actionable
  - Update tests to expect help instead of failure for unknown flags
  
  **Validation**:
  - Run `npm test -- src/release/integration/__tests__/CLIIntegration.integration.test.ts`
  - Verify "Invalid CLI Arguments Test" passes
  - Verify unknown flags show help with exit code 0
  - Verify valid arguments still parse correctly
  - Test manual CLI invocation with unknown flags
  
  _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 3. Fix Dry-Run Async Cleanup

  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  
  **Objective**: Add explicit async cleanup to prevent dry-run execution from hanging
  
  **Implementation Steps**:
  - Locate dry-run execution logic in ReleaseCLI or related modules
  - Add timeout logging to identify where execution hangs
  - Wrap async operations in try-finally blocks for guaranteed cleanup
  - Ensure all promises are awaited or resolved
  - Add explicit resource cleanup in finally blocks
  - Verify CLI process termination logic is correct
  
  **Validation**:
  - Run `npm test -- src/release/integration/__tests__/CLIIntegration.integration.test.ts`
  - Verify "Dry-Run Execution" test completes within 5000ms timeout
  - Verify no hanging promises or unresolved operations
  - Verify resources are cleaned up properly
  - Test dry-run mode manually to confirm completion
  
  _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 4. Verify Critical Fixes

  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  
  **Objective**: Verify critical fixes restore release detection workflow for Container spec
  
  **Implementation Steps**:
  - Run full test suite: `npm test`
  - Verify ReleaseCLI tests pass without worker crashes
  - Verify CLIIntegration tests pass completely
  - Test manual release detection trigger: `./.kiro/hooks/release-manager.sh auto`
  - Verify release detection can analyze completion documents
  - Document remaining optional test failures
  
  **Validation**:
  - Run `npm test` and verify critical tests pass
  - Verify 2 critical test suites now pass (ReleaseCLI, CLIIntegration)
  - Verify 3 optional test failures remain (can be addressed later)
  - Test Container spec parent task completion workflow
  - Verify release detection triggers correctly
  
  _Requirements: 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 5.3, 5.4_

- [x] 5. Optimize Hook Performance & Fix Dry-Run Timeout

  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  
  **Objective**: Fix dry-run async cleanup timeout and optimize hook performance
  
  **Context**: Task 3 attempted to fix dry-run timeout but the issue persists. The "Dry-Run Execution" test times out at 5000ms, and hook performance tests also timeout. This task addresses both issues.
  
  **Root Cause Analysis**:
  - **Dry-run timeout**: Async operations not completing, likely in CLIBridge integration layer
  - **Hook performance**: Analysis operations exceeding 5000ms threshold
  - **Common issue**: Promises not resolving or resources not cleaning up
  
  **Key Files to Investigate**:
  - `src/release/integration/CLIBridge.ts` - Integration layer with potential hanging promises
  - `src/release/cli/ReleaseCLI.ts` - executeRelease() method in dry-run mode
  - `src/release/integration/__tests__/CLIIntegration.integration.test.ts` - Failing test (line 468)
  - `src/release-analysis/hooks/__tests__/HookIntegration.test.ts` - Performance test (line 367)
  
  **Implementation Steps**:
  1. **Debug dry-run timeout**:
     - Add detailed logging to CLIBridge to identify where execution hangs
     - Check for unresolved promises in dry-run mode
     - Verify ReleaseManager cleanup in dry-run mode
     - Ensure integration bridge closes all connections/streams
  
  2. **Optimize hook performance**:
     - Profile hook analysis to identify bottlenecks
     - Review skipDetailedExtraction implementation
     - Optimize file I/O operations (batch reads, caching)
     - Optimize parsing operations (lazy evaluation)
  
  3. **Add explicit cleanup**:
     - Wrap all async operations in try-finally blocks
     - Add explicit resource cleanup in finally blocks
     - Ensure all promises are awaited or properly handled
     - Add timeout guards for long-running operations
  
  **Validation**:
  - Run `npm test -- src/release/integration/__tests__/CLIIntegration.integration.test.ts`
  - Verify "Dry-Run Execution" test completes within 5000ms
  - Run `npm test -- src/release-analysis/hooks/__tests__/HookIntegration.test.ts`
  - Verify "should handle rapid commits gracefully" passes
  - Verify no hanging promises or unresolved operations
  - Profile before/after to measure improvement
  
  _Requirements: 3.1, 3.2, 3.3, 3.4, 6.1, 6.2, 6.3, 6.4_

- [x] 6. Fix Document Classification

  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  
  **Objective**: Align document classification logic with test expectations
  
  **Context**: Test expects "task-completion" but gets "spec-completion". This is a simple test expectation mismatch after file naming conventions changed.
  
  **Root Cause**: The classification logic or test expectations don't match current file naming conventions:
  - Current format: `task-N-parent-completion.md` for parent tasks
  - Test expectation: First doc should be "task-completion", second "spec-completion"
  - Actual behavior: Both classified as "spec-completion"
  
  **Key Files**:
  - `src/release-analysis/collection/CompletionDocumentCollector.ts` - Classification logic (lines 200-300)
  - `src/release-analysis/collection/__tests__/CompletionDocumentCollector.test.ts` - Test expectations (lines 498-502)
  
  **Implementation Steps**:
  1. **Review classification logic**:
     - Examine how CompletionDocumentCollector determines document type
     - Check if it uses file naming patterns or content analysis
     - Verify current classification rules
  
  2. **Determine correct approach**:
     - Option A: Update classification logic to distinguish task vs spec completion
     - Option B: Update test expectations to match current behavior
     - Consider: Does the system need to distinguish these types?
  
  3. **Implement fix**:
     - If Option A: Add logic to detect `task-N-parent-completion.md` pattern
     - If Option B: Update test to expect "spec-completion" for both
     - Ensure fix aligns with actual system usage
  
  4. **Verify with real data**:
     - Test with actual completion documents from Container spec
     - Verify document collection filters work correctly
     - Ensure no regression in document detection
  
  **Validation**:
  - Run `npm test -- src/release-analysis/collection/__tests__/CompletionDocumentCollector.test.ts`
  - Verify "should classify document types correctly" passes
  - Verify classification matches expected behavior
  - Test with real completion documents from `.kiro/specs/010-container-component/completion/`
  
  **Estimated Effort**: 10-15 minutes (simple test or logic update)
  
  _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 7. Update ReleaseCLI Test Expectations

  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  
  **Objective**: Update ReleaseCLI test expectations to match new error handling behavior
  
  **Context**: Task 1 changed error handling from `process.exit()` to returning error results. This is correct behavior, but 10 tests still expect the old pattern.
  
  **Affected Tests** (all in `src/release/cli/__tests__/ReleaseCLI.test.ts`):
  1. "should handle unknown command" (line 256)
  2. "should handle release failure" (line 326)
  3. "should show status when pipeline is active" (line 379)
  4. "should show message when no active pipeline" (line 389)
  5. "should display errors when present" (line 412)
  6. "should handle plan generation failure" (line 477)
  7. "should fail validation when required fields missing" (line 512)
  8. "should handle unknown config subcommand" (line 518)
  9. "should prompt for release notes override" (line 642)
  10. "should handle ReleaseManager initialization errors" (line 677)
  11. "should close readline interface on error" (line 686)
  
  **Pattern of Failures**:
  ```typescript
  // Old expectation (fails now):
  await expect(cli.execute('unknown', [])).rejects.toThrow('process.exit(1)');
  
  // New behavior (returns error result):
  { success: false, error: "Unknown command: unknown", exitCode: 1 }
  ```
  
  **Implementation Steps**:
  1. **Update error expectation tests** (tests 1, 2, 6, 7, 8, 10, 11):
     ```typescript
     // Change from:
     await expect(cli.execute('unknown', [])).rejects.toThrow('process.exit(1)');
     
     // To:
     const result = await cli.execute('unknown', []);
     expect(result.success).toBe(false);
     expect(result.exitCode).toBe(1);
     expect(result.error).toContain('Unknown command');
     ```
  
  2. **Update console output tests** (tests 3, 4, 5):
     - Review actual console output format after error handling changes
     - Update string matching expectations to match new format
     - Verify console.log/console.error calls match test expectations
  
  3. **Update mock verification test** (test 9):
     - Review what executeRelease() is called with
     - Update mock expectation to match actual call signature
  
  **Validation**:
  - Run `npm test -- src/release/cli/__tests__/ReleaseCLI.test.ts`
  - Verify all 11 failing tests now pass
  - Verify no regression in other ReleaseCLI tests
  - Verify error handling still works correctly in manual testing
  
  **Estimated Effort**: 15-20 minutes (straightforward test updates)
  
  _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 8. Address Performance Regression

  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  
  **Objective**: Restore token generation performance or adjust threshold with rationale
  
  **Context**: Performance test expects token generation within 10ms but is failing. This could be a real regression or an outdated threshold as the system has grown.
  
  **Potential Causes**:
  - **Build system changes**: Recent TypeScript compilation changes may have added overhead
  - **Token system growth**: Semantic token system has become more complex
  - **Test environment**: Test may run in slower environment than when threshold was set
  - **Threshold outdated**: 10ms may no longer be realistic for current system complexity
  
  **Key Files**:
  - `src/__tests__/integration/PerformanceValidation.test.ts` - Performance test
  - `src/tokens/semantic/` - Semantic token generation logic
  - `src/build/` - Build system that may have changed
  
  **Implementation Steps**:
  1. **Profile token generation**:
     - Add timing instrumentation to token generation
     - Identify which operations take the most time
     - Measure: file I/O, parsing, transformation, validation
     - Compare current performance to historical baseline
  
  2. **Analyze bottlenecks**:
     - Check if bottleneck is in semantic token composition
     - Review recent changes to build system (TypeScript compilation)
     - Verify if issue is consistent or environment-specific
     - Determine if this is regression or growth-related slowdown
  
  3. **Optimize or adjust**:
     - **If real regression**: Optimize the bottleneck operation
     - **If growth-related**: Document rationale and adjust threshold
     - **If environment-specific**: Add environment detection to test
  
  4. **Document decision**:
     - If optimizing: Document what was optimized and improvement
     - If adjusting threshold: Document why 10ms is no longer realistic
     - Include performance profile data to justify decision
  
  **Validation**:
  - Run `npm test -- src/__tests__/integration/PerformanceValidation.test.ts`
  - Verify "should generate single platform tokens within normal threshold" passes
  - Profile before/after to measure improvement
  - Document rationale if threshold adjusted (include data)
  
  **Estimated Effort**: 30-60 minutes (requires profiling and analysis)
  
  _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 9. Complete Test Maintenance (Consolidation of Tasks 5-7)

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All 6 remaining test failures fixed
  - 100% test pass rate achieved (4878/4878 tests passing)
  - No regression in existing functionality
  - Test maintenance complete, ready for Container spec
  
  **Primary Artifacts:**
  - Updated test expectations in `ReleaseCLI.test.ts`
  - Fixed classification logic or test in `CompletionDocumentCollector.test.ts`
  - Fixed async cleanup in `CLIBridge.ts` or `CLIIntegration.integration.test.ts`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/011-release-system-test-fixes/completion/task-9-parent-completion.md`
  - Summary: `docs/specs/011-release-system-test-fixes/task-9-summary.md` (triggers release detection)
  
  **Context**: After completing critical fixes (Tasks 1-4) and investigating performance (Task 8), 6 test failures remain. These are all test maintenance issues, not functional bugs. This task consolidates the remaining optional tasks into a single focused effort.
  
  **Current Status**: 4859/4878 tests passing (99.6%)
  **Target**: 4878/4878 tests passing (100%)

  - [x] 9.1 Update ReleaseCLI Test Expectations
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    
    **Objective**: Fix 4 ReleaseCLI test failures by updating test expectations to match new error handling behavior
    
    **Affected Tests** (all in `src/release/cli/__tests__/ReleaseCLI.test.ts`):
    1. "should show message when no active pipeline" (line 398)
    2. "should handle plan generation failure" (line 492)
    3. "should fail validation when required fields missing" (line 527)
    4. "should handle ReleaseManager initialization errors" (line 701)
    
    **Pattern to Fix**:
    ```typescript
    // OLD: Test expects specific console output format
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('No active release pipeline'));
    
    // NEW: Update to match actual console output format
    // Check actual output in test failure, update expectation to match
    ```
    
    **Implementation Steps**:
    1. Run failing tests to see actual vs expected output
    2. Update test expectations to match new error handling format
    3. For console output tests: Match actual format (may include error objects)
    4. For validation tests: Verify if logic is correct or test expectation is wrong
    5. Verify all 4 tests pass
    
    **Validation**:
    - Run `npm test -- src/release/cli/__tests__/ReleaseCLI.test.ts`
    - Verify all 4 affected tests now pass
    - Verify no regression in other ReleaseCLI tests
    - Test pass count increases from 4859 to 4863
    
    _Requirements: Consolidates Task 7 requirements_

  - [x] 9.2 Fix Document Classification
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    
    **Objective**: Fix 1 classification test failure by updating logic or test expectations
    
    **Test**: "should classify document types correctly" (line 500 in `CompletionDocumentCollector.test.ts`)
    
    **Issue**: Expects "task-completion" but gets "spec-completion"
    
    **Implementation Steps**:
    1. Review classification logic in `CompletionDocumentCollector.ts` (lines 200-300)
    2. Check if logic distinguishes `task-N-parent-completion.md` vs `spec-completion.md`
    3. **Option A**: Update classification logic to detect task completion pattern
    4. **Option B**: Update test expectations if current behavior is correct
    5. Test with real completion documents from Container spec
    6. Verify classification test passes
    
    **Validation**:
    - Run `npm test -- src/release-analysis/collection/__tests__/CompletionDocumentCollector.test.ts`
    - Verify classification test passes
    - Verify no regression in other CompletionDocumentCollector tests
    - Test pass count increases from 4863 to 4864
    
    _Requirements: Consolidates Task 6 requirements_

  - [x] 9.3 Fix Dry-Run Timeout
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    
    **Objective**: Fix 1 timeout test failure by adding proper async cleanup
    
    **Test**: "should handle dry-run execution" (line 478 in `CLIIntegration.integration.test.ts`)
    
    **Issue**: Timeout after 5000ms - async operations not completing
    
    **Implementation Steps**:
    1. Add detailed logging to `CLIBridge.ts` to identify hang point
    2. Check for unresolved promises in dry-run mode:
       - `ReleaseManager` cleanup in dry-run mode
       - `CLIBridge` integration layer connections/streams
       - Any async operations without proper await/cleanup
    3. Wrap async operations in try-finally blocks
    4. Add explicit resource cleanup in finally blocks
    5. Ensure all promises are awaited or properly handled
    6. Test dry-run execution completes within 5000ms
    
    **Validation**:
    - Run `npm test -- src/release/integration/__tests__/CLIIntegration.integration.test.ts`
    - Verify dry-run test completes without timeout
    - Verify no regression in other CLIIntegration tests
    - Test pass count increases from 4864 to 4865
    - Run full test suite: `npm test`
    - Verify 100% test pass rate (4878/4878)
    
    _Requirements: Consolidates Task 5 requirements_

---

## Implementation Summary

### Task Overview

**Total Tasks**: 9 (4 required, 5 optional)  
**Required Timeline**: 30-60 minutes  
**Optional Timeline**: 60-90 minutes additional (Task 9 consolidates Tasks 5-7)  
**Priority**: Tasks 1-4 CRITICAL - Block Container component spec

### Task Breakdown

**Required Tasks** (Block Container Spec):
- **Task 1**: Fix ReleaseCLI Error Handling (5-10 min) ✅ COMPLETE
- **Task 2**: Fix CLI Argument Handling (10-20 min) ✅ COMPLETE
- **Task 3**: Fix Dry-Run Async Cleanup (15-30 min) ✅ COMPLETE
- **Task 4**: Verify Critical Fixes (5-10 min) ✅ COMPLETE

**Optional Tasks** (Improve Test Quality):
- **Task 5**: Optimize Hook Performance & Fix Dry-Run Timeout (30-60 min) * [SUPERSEDED BY TASK 9]
- **Task 6**: Fix Document Classification (10-15 min) * [SUPERSEDED BY TASK 9]
- **Task 7**: Update ReleaseCLI Test Expectations (15-20 min) * [SUPERSEDED BY TASK 9]
- **Task 8**: Address Performance Regression (30-60 min) * ✅ COMPLETE
- **Task 9**: Complete Test Maintenance (60-90 min) * [CONSOLIDATES TASKS 5-7]

**Recommended Approach**:
- **Task 9** consolidates all remaining test maintenance into a single focused task
- Fixes all 6 remaining test failures in one go
- Achieves 100% test pass rate (4878/4878 tests passing)

### Success Criteria

**Critical Success** (Required):
- ✅ ReleaseCLI test suite runs without Jest worker crashes
- ✅ CLIIntegration "Invalid CLI Arguments Test" passes
- ✅ CLIIntegration "Dry-Run Execution" test completes without timeout
- ✅ Release detection workflow works for Container spec
- ✅ Container spec can proceed with parent task completion

**Optional Success** (Nice to Have):
- ⚠️ Dry-run timeout fixed (Task 9 Part 3)
- ⚠️ Document classification test passes (Task 9 Part 2)
- ⚠️ ReleaseCLI test expectations updated (Task 9 Part 1)
- ✅ Performance regression investigated - no issues found (Task 8)

**Integration Success**:
- ✅ Release detection automation works reliably
- ✅ Manual CLI triggers work correctly
- ✅ No regression in existing functionality
- ✅ All critical tests pass (99.6% → 99.9%+ pass rate)

### Critical Path

**Sequential Dependencies**:
1. Tasks 1-3 can run in parallel (independent fixes) ✅ COMPLETE
2. Task 4 must run after Tasks 1-3 (validates all critical fixes) ✅ COMPLETE
3. Task 8 can run anytime after Task 4 (performance investigation) ✅ COMPLETE
4. Task 9 consolidates Tasks 5-7 into single focused effort (can run anytime after Task 4)

**Task 9 Internal Sequence**:
- Part 1 (ReleaseCLI) can be done first (easiest, 15-20 min)
- Part 2 (Classification) can be done second (easy, 10-15 min)
- Part 3 (Dry-run timeout) should be done last (requires debugging, 30-60 min)

### Risk Mitigation

**Technical Risks**:
- **Unexpected process.exit() locations**: Search entire codebase for process.exit() calls
- **Complex async cleanup**: Add logging to identify exact hang points
- **Test expectation changes**: Update tests carefully to match new behavior
- **Performance optimization complexity**: Profile first, optimize based on data

**Timeline Risks**:
- **Critical fixes take longer**: Focus on Task 1 first (highest priority)
- **Optional fixes take longer**: Skip optional tasks if time-constrained
- **Additional issues discovered**: Document and defer non-critical issues

**Quality Risks**:
- **Regression in existing functionality**: Run full test suite after each fix
- **Incomplete error handling**: Verify all error paths return results
- **Performance optimization breaks functionality**: Verify correctness after optimization

---

## Next Steps

**To begin implementation**:
1. Review this tasks document
2. Confirm task breakdown and approach
3. Start with Task 1: Fix ReleaseCLI Error Handling
4. Complete Tasks 2-4 to unblock Container spec
5. Optionally tackle Tasks 5-7 when time permits

**After critical tasks (1-4) complete**:
- ✅ Container spec can proceed with Task 3 (Create Container Component Structure)
- ✅ Release detection will work automatically for parent task completions
- ✅ Optional tasks (5-8) can be addressed anytime
- ✅ Current test pass rate: 99.4% (4850/4878 tests passing)

**After optional tasks (5-8) complete**:
- ✅ All test failures resolved (15 failing tests fixed)
- ✅ 100% test pass rate achieved (4878/4878 tests passing)
- ✅ Release system fully validated
- ✅ Performance optimizations complete

**Questions or concerns?** Review the requirements.md document for additional context.

---

## Optional Tasks: Detailed Context

### Task 5: Optimize Hook Performance & Fix Dry-Run Timeout

**Why This Matters**: Task 3 attempted to fix the dry-run timeout but the issue persists. This suggests the problem is deeper in the integration layer or async cleanup logic.

**Investigation Strategy**:
1. Add detailed logging to identify exact hang point
2. Check CLIBridge for unresolved promises
3. Verify ReleaseManager cleanup in dry-run mode
4. Profile hook analysis for performance bottlenecks

**Expected Outcome**: Both dry-run and hook performance tests complete within 5000ms timeout.

---

### Task 6: Fix Document Classification

**Why This Matters**: Simple test expectation mismatch that's easy to fix. Good first optional task.

**Investigation Strategy**:
1. Check if classification logic needs updating
2. Or update test expectations to match current behavior
3. Verify with real completion documents

**Expected Outcome**: Test passes with correct classification logic or updated expectations.

---

### Task 7: Update ReleaseCLI Test Expectations [EASIEST]

**Why This Matters**: Task 1 changed error handling correctly, but tests still expect old behavior. This is pure test maintenance.

**Pattern to Fix**:
```typescript
// Old (fails):
await expect(cli.execute('unknown', [])).rejects.toThrow('process.exit(1)');

// New (correct):
const result = await cli.execute('unknown', []);
expect(result.success).toBe(false);
expect(result.exitCode).toBe(1);
expect(result.error).toContain('Unknown command');
```

**Expected Outcome**: All 11 ReleaseCLI tests pass with updated expectations.

---

### Task 8: Address Performance Regression

**Why This Matters**: Determines if there's a real performance regression or if the threshold is outdated.

**Investigation Strategy**:
1. Profile token generation to identify bottlenecks
2. Check if recent build system changes added overhead
3. Determine if 10ms threshold is still realistic
4. Optimize or adjust threshold with documented rationale

**Expected Outcome**: Either optimized performance or justified threshold adjustment.

---

**Organization**: spec-tasks  
**Scope**: 011-release-system-test-fixes
