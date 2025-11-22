# Implementation Plan: Test Failure Fixes

**Date**: November 21, 2025
**Spec**: test-failure-fixes
**Status**: Implementation Planning
**Dependencies**: test-failure-analysis (complete)

---

## Implementation Plan

This plan systematically fixes all 65 test failures identified in the test-failure-analysis spec through a phased approach: quick wins → critical functionality → high priority issues → performance investigation. The approach is based on impact, effort, and dependencies, with estimated total effort of 14-25 hours.

---

## Task List

- [x] 1. Fix Task Name Extraction Regex Bug (Group 5)

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  **Estimated Effort**: 15 minutes
  **Priority**: Quick Win
  
  **Success Criteria:**
  - Regex pattern uses negative lookahead to prevent subtask matching
  - Parent task "1" matches only "1. Main Task", not "1.1 Sub Task"
  - All task name extraction tests pass
  - Commit messages reference correct tasks
  
  **Primary Artifacts:**
  - Updated regex pattern in WorkflowMonitor or task extraction code
  - Test verification
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/test-failure-fixes/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/test-failure-fixes/task-1-summary.md` (triggers release detection)

  - [x] 1.1 Update regex pattern to use negative lookahead
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Locate task name extraction code
    - Replace `(?:\\.\\d+)?` with `(?!\\.)`
    - Test with various task number formats
    - Verify parent tasks match correctly
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 1.2 Verify commit message generation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test commit message generation with updated regex
    - Verify correct task names in messages
    - Check edge cases (task 10, task 100, etc.)
    - _Requirements: 1.4_

- [x] 2. Fix Validation Preventing Registration (Group 1)

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  **Estimated Effort**: 2-4 hours
  **Priority**: Critical
  
  **Success Criteria:**
  - All 37 validation-related test failures fixed
  - Tests check validation results before token retrieval
  - Validation rules reviewed and appropriate
  - Token registration works correctly when validation passes
  
  **Primary Artifacts:**
  - Updated test files (CrossPlatformConsistency.test.ts, TokenSystemIntegration.test.ts)
  - Validation rule adjustments (if needed)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/test-failure-fixes/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/test-failure-fixes/task-2-summary.md` (triggers release detection)

  - [x] 2.1 Update CrossPlatformConsistency tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Review 19 failing tests in CrossPlatformConsistency.test.ts
    - Add validation result checks before token retrieval
    - Update assertions to handle Error level appropriately
    - Verify tokens are defined before accessing properties
    - _Requirements: 2.1, 2.2_

  - [x] 2.2 Update TokenSystemIntegration tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Review 18 failing tests in TokenSystemIntegration.test.ts
    - Add validation result checks before token retrieval
    - Update assertions to handle Error level appropriately
    - Verify tokens are defined before accessing properties
    - _Requirements: 2.1, 2.2_

  - [x] 2.3 Review validation rules
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Identify validation rules causing Error level
    - Determine if rules are appropriate or too strict
    - Adjust rules if preventing valid token registration
    - Document rationale for any rule changes
    - _Requirements: 2.3, 2.4_

- [ ] 3. Fix Async Operations Not Completing (Group 2)

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  **Estimated Effort**: 4-6 hours
  **Priority**: Critical
  
  **Success Criteria:**
  - All 14 async-related test failures fixed
  - Tests initialize monitoring with startMonitoring()
  - Fake timers coordinate properly with async operations
  - Cleanup happens correctly in teardown
  - Production code initializes monitoring correctly
  
  **Primary Artifacts:**
  - Updated test files (WorkflowMonitor.test.ts, ReleaseCLI.test.ts)
  - Production code verification (WorkflowMonitor.ts)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/test-failure-fixes/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/test-failure-fixes/task-3-summary.md` (triggers release detection)

  - [ ] 3.1 Update WorkflowMonitor test setup
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add `await monitor.startMonitoring()` in beforeEach
    - Add `await monitor.stopMonitoring()` in afterEach
    - Ensure fake timers are set up before initialization
    - Clear timers and restore real timers in cleanup
    - _Requirements: 3.1, 3.4_

  - [ ] 3.2 Improve async/timer coordination
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Review event processing timer setup
    - Ensure timer is created during startMonitoring()
    - Coordinate fake timer advancement with async operations
    - Test event processing completes correctly
    - _Requirements: 3.2_

  - [ ] 3.3 Update ReleaseCLI tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Review 3 failing tests in ReleaseCLI.test.ts
    - Apply same async/timer coordination fixes
    - Ensure proper initialization and cleanup
    - Verify tests pass with updated approach
    - _Requirements: 3.1, 3.2, 3.4_

  - [ ] 3.4 Verify production code initialization
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Review WorkflowMonitor production code
    - Verify startMonitoring() is called correctly
    - Ensure event processing initializes automatically
    - Confirm cleanup happens on shutdown
    - _Requirements: 3.5_

- [ ] 4. Update Validation Test Expectations (Group 3)

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  **Estimated Effort**: 2-3 hours
  **Priority**: High
  
  **Success Criteria:**
  - All 7 validation expectation failures fixed
  - Test expectations match current validation behavior
  - Validation changes documented with rationale
  - End-to-end workflow validation restored
  
  **Primary Artifacts:**
  - Updated test file (EndToEndWorkflow.test.ts)
  - Validation change documentation
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/test-failure-fixes/completion/task-4-parent-completion.md`
  - Summary: `docs/specs/test-failure-fixes/task-4-summary.md` (triggers release detection)

  - [ ] 4.1 Identify current validation behavior
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Review 7 failing tests in EndToEndWorkflow.test.ts
    - Identify which tokens now receive Warning/Error
    - Determine why validation behavior changed
    - Document validation rule changes
    - _Requirements: 4.1, 4.3_

  - [ ] 4.2 Update test expectations
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update assertions to expect Warning/Error where appropriate
    - Add validation message checks
    - Verify tests pass with updated expectations
    - Ensure end-to-end workflow still validates correctly
    - _Requirements: 4.2, 4.4_

- [ ] 5. Review Detection Logic Changes (Group 4)

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  **Estimated Effort**: 3-5 hours
  **Priority**: High
  
  **Success Criteria:**
  - All 5 detection logic failures fixed
  - Detection logic reviewed and verified correct
  - Tests updated or logic fixed as appropriate
  - Version bump calculation accurate
  - Bug fix detection working
  - Token generation complete
  
  **Primary Artifacts:**
  - Updated test files (DetectionSystemIntegration.test.ts, SemanticTokenGeneration.test.ts)
  - Detection logic fixes (if needed)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/test-failure-fixes/completion/task-5-parent-completion.md`
  - Summary: `docs/specs/test-failure-fixes/task-5-summary.md` (triggers release detection)

  - [ ] 5.1 Review version bump calculation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Review failing version bump tests
    - Examine version bump calculation logic
    - Determine if logic or tests are correct
    - Update tests or fix logic accordingly
    - Document decision rationale
    - _Requirements: 5.1_

  - [ ] 5.2 Review bug fix detection
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Review failing bug fix detection tests
    - Examine bug fix detection logic
    - Determine if logic or tests are correct
    - Update tests or fix logic accordingly
    - Document decision rationale
    - _Requirements: 5.2_

  - [ ] 5.3 Review token generation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Review failing token generation tests
    - Examine token generation logic for Android
    - Verify all expected tokens are generated
    - Update tests or fix generation accordingly
    - Document decision rationale
    - _Requirements: 5.3, 5.4_

- [ ] 6. Investigate Performance Degradation (Group 6)

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  **Estimated Effort**: 2-4 hours
  **Priority**: Medium
  
  **Success Criteria:**
  - All 2 performance failures fixed
  - Performance characteristics measured and documented
  - Threshold adjusted or performance fixed as appropriate
  - Performance monitoring restored
  
  **Primary Artifacts:**
  - Updated test files (AccuracyRegressionTests.test.ts, PerformanceValidation.test.ts)
  - Performance investigation documentation
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/test-failure-fixes/completion/task-6-parent-completion.md`
  - Summary: `docs/specs/test-failure-fixes/task-6-summary.md` (triggers release detection)

  - [ ] 6.1 Measure current performance
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run performance tests multiple times
    - Calculate mean, variance, and standard deviation
    - Compare to historical baselines
    - Document current performance characteristics
    - _Requirements: 6.1, 6.3_

  - [ ] 6.2 Determine root cause
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Analyze performance variance (0.825 vs threshold 0.5)
    - Determine if actual degradation or threshold issue
    - Investigate potential performance bottlenecks
    - Document findings
    - _Requirements: 6.1, 6.2_

  - [ ] 6.3 Apply fix
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - If threshold issue: adjust threshold to appropriate value
    - If performance issue: optimize code to reduce variance
    - Update tests with new expectations
    - Verify performance monitoring works correctly
    - Document decision and rationale
    - _Requirements: 6.2, 6.4_

---

## Fix Order Summary

| Phase | Tasks | Test Count | Estimated Effort | Priority |
|-------|-------|------------|------------------|----------|
| Phase 1 | Task 1 | 1 | 15 minutes | Quick Win |
| Phase 2 | Tasks 2-3 | 51 | 6-10 hours | Critical |
| Phase 3 | Tasks 4-5 | 12 | 5-8 hours | High |
| Phase 4 | Task 6 | 2 | 2-4 hours | Medium |
| **Total** | **6 tasks** | **65** | **14-25 hours** | - |

---

## Dependencies

**No Hard Dependencies**: All tasks can be started immediately

**Soft Dependencies** (Recommended Order):
- Task 4 benefits from Task 2 (understanding validation behavior)
- Task 5 benefits from Task 3 (release detection working)
- Task 6 should be last (performance may change after other fixes)

---

## Expected Outcomes

### After Phase 1 (15 minutes)
- ✅ 1 test fixed (2% improvement)
- ✅ Task tracking restored
- ✅ Quick win achieved

### After Phase 2 (6-10 hours)
- ✅ 51 tests fixed (78% improvement)
- ✅ Core functionality restored
- ✅ Release workflow restored
- ✅ Token system validated

### After Phase 3 (5-8 hours)
- ✅ 13 tests fixed (20% improvement)
- ✅ Workflow validation restored
- ✅ Release accuracy restored
- ✅ Detection logic verified

### After Phase 4 (2-4 hours)
- ✅ 2 tests fixed (3% improvement)
- ✅ Performance monitoring restored
- ✅ All 65 tests passing (100%)
- ✅ Test suite confidence restored

---

*This implementation plan provides a systematic approach to fixing all 65 test failures through phased implementation based on impact, effort, and dependencies, with clear tasks and estimated effort for each fix.*
