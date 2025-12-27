# Implementation Plan: Test Failure Fixes

**Date**: December 27, 2025
**Spec**: 030 - Test Failure Fixes
**Status**: Implementation Planning
**Dependencies**: 029-test-failure-audit (complete)

---

## Overview

This implementation plan addresses 40 failing tests through a 5-phase approach, following the scientific method principle of changing one variable at a time. Each phase builds on the previous, with verification checkpoints to ensure no regressions.

---

## Task List

### Phase 1: Quick Wins - Fix Test Expectations

- [x] 1. Icon Token Test Fixes
  **Type**: Implementation
  **Validation**: Tier 2: Standard
  **Success Criteria**: 8 icon-related tests pass, no regressions
  
  - [x] 1.1 Exclude strokeWidth from size validation
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Locate icon token generation test file
    - Identify size validation logic that expects multiplier references
    - Add exclusion for `icon.strokeWidth` (fixed value, not size-based)
    - Run affected tests to verify fix
    - _Requirements: 1.1_
  
  - [x] 1.2 Update icon/token structure expectations
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Review generated token output vs test expectations
    - Update test expectations to match actual generated structure
    - Remove redundant manual definitions
    - Run affected tests to verify fix
    - _Requirements: 1.2_
  
  - [x] 1.3 Verify icon token test fixes
    **Type**: Setup
    **Validation**: Tier 1: Minimal
    - Run all icon token tests
    - Confirm 8 previously failing tests now pass
    - Document any remaining issues
    - _Requirements: 1.3_

  **Completion Documentation:**
  - Detailed: `.kiro/specs/030-test-failure-fixes/completion/task-1-completion.md`
  - Summary: `docs/specs/030-test-failure-fixes/task-1-summary.md`

---

- [x] 2. Token Structure Test Fixes
  **Type**: Implementation
  **Validation**: Tier 2: Standard
  **Success Criteria**: 5 token structure tests pass, no regressions
  
  - [x] 2.1 Update border width token expectations
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Review current SemanticBorderWidthTokens implementation
    - Update expected token names and count in test file
    - Ensure tests validate meaningful properties
    - Run affected tests to verify fix
    - _Requirements: 6.1, 6.2_
  
  - [x] 2.2 Update shadow offset token count
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Verify token system has 26 primitive tokens (not 24)
    - Update count expectation in test file from 24 to 26
    - Confirm shadow offset tokens `shadowOffsetY050` through `shadowOffsetY400` are counted
    - Run affected tests to verify fix
    - _Requirements: 7.1, 7.2_
  
  - [x] 2.3 Verify token structure test fixes
    **Type**: Setup
    **Validation**: Tier 1: Minimal
    - Run all token structure tests
    - Confirm 5 previously failing tests now pass
    - Document any remaining issues
    - _Requirements: 6.3, 7.3_

  **Completion Documentation:**
  - Detailed: `.kiro/specs/030-test-failure-fixes/completion/task-2-completion.md`
  - Summary: `docs/specs/030-test-failure-fixes/task-2-summary.md`

---

- [x] 3. Compliance Test Regex Improvements
  **Type**: Implementation
  **Validation**: Tier 2: Standard
  **Success Criteria**: 10 false positives eliminated, actual violations still detected
  
  - [x] 3.1 Improve iOS regex to exclude DesignTokens references
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Locate iOS token compliance test regex
    - Update regex to exclude lines containing `DesignTokens.`
    - Test against known valid semantic token references
    - Verify actual violations are still caught
    - Run affected tests to verify fix
    - _Requirements: 8.1, 8.2_
  
  - [x] 3.2 Add Android 0.dp exception ✅
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Locate Android token compliance test regex
    - Add explicit exception for `0.dp` literal
    - Document as valid edge case in test file
    - Run affected tests to verify fix
    - _Requirements: 9.1, 9.2_
  
  - [x] 3.3 Improve Web CSS regex to handle comments
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Locate Web CSS token compliance test regex
    - Update regex to exclude values within CSS comment blocks
    - Test against known violations outside comments
    - Verify actual violations are still caught
    - Run affected tests to verify fix
    - _Requirements: 10.1, 10.2_
  
  - [x] 3.4 Verify compliance test regex improvements
    **Type**: Setup
    **Validation**: Tier 1: Minimal
    - Run all token compliance tests
    - Confirm 10 false positive instances eliminated
    - Verify no false negatives introduced
    - _Requirements: 8.3, 9.3, 10.3_

  **Completion Documentation:**
  - Detailed: `.kiro/specs/030-test-failure-fixes/completion/task-3-completion.md`
  - Summary: `docs/specs/030-test-failure-fixes/task-3-summary.md`

---

### Phase 2: Code Fixes

- [x] 4. Icon Component CSS Variable Fix
  **Type**: Implementation
  **Validation**: Tier 2: Standard
  **Success Criteria**: Icon component uses CSS variable, 2 tests pass
  
  - [x] 4.1 Update Icon component to use CSS variable
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Locate Icon component file
    - Replace hard-coded `stroke-width="2"` with `var(--icon-stroke-width)`
    - Verify component renders correctly
    - _Requirements: 2.1_
  
  - [x] 4.2 Define CSS variable in token stylesheet
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Locate token stylesheet (IconTokens.css or equivalent)
    - Add `--icon-stroke-width: 2;` to :root
    - Verify CSS variable is accessible
    - _Requirements: 2.2_
  
  - [x] 4.3 Verify Icon component fix
    **Type**: Setup
    **Validation**: Tier 1: Minimal
    - Run Icon component tests
    - Confirm 2 previously failing tests now pass
    - Verify no visual regressions
    - _Requirements: 2.3_

  **Completion Documentation:**
  - Detailed: `.kiro/specs/030-test-failure-fixes/completion/task-4-completion.md`
  - Summary: `docs/specs/030-test-failure-fixes/task-4-summary.md`

---

- [x] 5. Remove Problematic Patterns
  **Type**: Implementation
  **Validation**: Tier 2: Standard
  **Success Criteria**: Fallbacks removed, .dp suffixes removed, ~15 tests pass
  
  - [x] 5.1 Remove || 24 fallback pattern
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Search codebase for `|| 24` fallback patterns
    - Remove fallback, allowing token resolution to fail loudly
    - Add clear error message for missing token references
    - Run affected tests to verify fix
    - _Requirements: 3.1, 3.2_
  
  - [x] 5.2 Remove .dp suffix from Android token references
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Search Android code for `.dp` suffix on token references
    - Remove `.dp` from token instances (generator handles unit conversion)
    - Affected tokens: `DesignTokens.space_200.dp`, `radius150.dp`, `iconSize100.dp`, etc.
    - Run affected tests to verify fix
    - _Requirements: 4.1, 4.2_
  
  - [x] 5.3 Verify problematic pattern removal
    **Type**: Setup
    **Validation**: Tier 1: Minimal
    - Run full test suite
    - Confirm ~15 previously failing tests now pass
    - Verify no regressions in other tests
    - _Requirements: 3.3, 4.3_

  **Completion Documentation:**
  - Detailed: `.kiro/specs/030-test-failure-fixes/completion/task-5-completion.md`
  - Summary: `docs/specs/030-test-failure-fixes/task-5-summary.md`

---

### Phase 3: Expectation Adjustments

- [x] 6. LineHeight Formula Expectation Updates
  **Type**: Implementation
  **Validation**: Tier 2: Standard
  **Success Criteria**: 4 lineHeight tests pass with formula-based expectations
  
  - [x] 6.1 Verify lineHeight formula correctness
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Review lineHeight formula implementation
    - Calculate expected outputs for each token
    - Document formula and expected values
    - _Requirements: 5.1_
  
  - [x] 6.2 Update lineHeight test expectations
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Locate lineHeight token test file
    - Replace legacy hardcoded values with formula outputs
    - Add comments explaining formula derivation
    - Run affected tests to verify fix
    - _Requirements: 5.2_
  
  - [x] 6.3 Verify lineHeight expectation updates
    **Type**: Setup
    **Validation**: Tier 1: Minimal
    - Run all lineHeight tests
    - Confirm 4 previously failing tests now pass
    - _Requirements: 5.3_

  **Completion Documentation:**
  - Detailed: `.kiro/specs/030-test-failure-fixes/completion/task-6-completion.md`
  - Summary: `docs/specs/030-test-failure-fixes/task-6-summary.md`

---

- [ ] 7. Performance Threshold Adjustments
  **Type**: Implementation
  **Validation**: Tier 2: Standard
  **Success Criteria**: 10 performance/timeout tests pass with justified thresholds
  
  - [ ] 7.1 Update release analysis timeouts
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Locate ReleaseAnalysis.test.ts
    - Update quick analysis timeout: 10000ms → 12000ms (20% increase)
    - Update skipDetailedExtraction timeout: 20000ms → 25000ms (25% increase)
    - Update pipeline persistence timeout: 15000ms → 20000ms (33% increase)
    - Add comments documenting repository growth justification
    - _Requirements: 13.1, 13.2, 13.3_
  
  - [ ] 7.2 Update QuickAnalyzer timeouts
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Locate QuickAnalyzer.test.ts
    - Update all QuickAnalyzer timeouts: 10000ms → 12000ms (20% increase)
    - Add comments documenting repository growth justification
    - _Requirements: 14.1, 14.2_
  
  - [ ] 7.3 Verify performance threshold adjustments
    **Type**: Setup
    **Validation**: Tier 1: Minimal
    - Run release analysis and QuickAnalyzer tests
    - Confirm 10 previously failing tests now pass
    - _Requirements: 13.4, 14.3_

  **Completion Documentation:**
  - Detailed: `.kiro/specs/030-test-failure-fixes/completion/task-7-completion.md`
  - Summary: `docs/specs/030-test-failure-fixes/task-7-summary.md`

---

### Phase 4: Investigation-Dependent Fixes

- [ ] 8. Performance Test Configuration
  **Type**: Architecture
  **Validation**: Tier 3: Comprehensive
  **Success Criteria**: 3 performance validation tests pass, environment sensitivity documented
  
  - [ ] 8.1 Implement performance test isolation (Option A - Preferred)
    **Type**: Architecture
    **Validation**: Tier 3: Comprehensive
    - Add npm script for isolated performance test execution in package.json
    - Script should run PerformanceValidation.test.ts independently
    - Document environment sensitivity in test file header
    - Test isolation approach works correctly
    - _Requirements: 12.1, 12.2_
  
  - [ ] 8.2 Alternative: Increase performance thresholds (Option B - Fallback)
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - If isolation approach proves impractical, increase thresholds
    - Statistics: 2ms → 30ms
    - State Export: 2ms → 15ms
    - Large Scale: 5ms → 15ms
    - Document justification in test file
    - _Requirements: 12.3_
  
  - [ ] 8.3 Verify performance test configuration
    **Type**: Setup
    **Validation**: Tier 1: Minimal
    - Run performance validation tests (isolated or with new thresholds)
    - Confirm 3 previously failing tests now pass
    - _Requirements: 12.4_

  **Completion Documentation:**
  - Detailed: `.kiro/specs/030-test-failure-fixes/completion/task-8-completion.md`
  - Summary: `docs/specs/030-test-failure-fixes/task-8-summary.md`

---

- [ ] 9. Cross-Platform Consistency Registry
  **Type**: Architecture
  **Validation**: Tier 3: Comprehensive
  **Success Criteria**: Registry created, 6 cross-platform tests pass
  
  - [ ] 9.1 Create acknowledged differences registry
    **Type**: Architecture
    **Validation**: Tier 3: Comprehensive
    - Create `src/__tests__/fixtures/acknowledged-differences.json`
    - Define schema: token, platforms, difference, rationale, authorizedBy, date
    - Document each authorized platform-specific affordance
    - _Requirements: 11.1_
  
  - [ ] 9.2 Update cross-platform consistency tests
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Locate CrossPlatformConsistency.test.ts
    - Import acknowledged differences registry
    - Update test logic to allow documented differences
    - Ensure undocumented differences still fail
    - _Requirements: 11.2, 11.3_
  
  - [ ] 9.3 Verify cross-platform consistency registry
    **Type**: Setup
    **Validation**: Tier 1: Minimal
    - Run cross-platform consistency tests
    - Confirm 6 previously failing tests now pass
    - Verify undocumented differences would still fail
    - _Requirements: 11.4_

  **Completion Documentation:**
  - Detailed: `.kiro/specs/030-test-failure-fixes/completion/task-9-completion.md`
  - Summary: `docs/specs/030-test-failure-fixes/task-9-summary.md`

---

### Phase 5: Final Verification

- [ ] 10. Test Suite Verification
  **Type**: Architecture
  **Validation**: Tier 3: Comprehensive
  **Success Criteria**: All 40 tests pass, exit code 0, no regressions
  
  - [ ] 10.1 Run full test suite
    **Type**: Setup
    **Validation**: Tier 1: Minimal
    - Execute `npm test`
    - Verify exit code is 0
    - Document total test count and pass rate
    - _Requirements: 15.1_
  
  - [ ] 10.2 Verify no new failures
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Compare test results to pre-fix baseline
    - Confirm no new test failures introduced
    - Document any unexpected changes
    - _Requirements: 15.2_
  
  - [ ] 10.3 Verify no regressions
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Confirm all previously passing tests still pass
    - Run `npm run test:all` for comprehensive verification
    - Document final test suite status
    - _Requirements: 15.3_
  
  - [ ] 10.4 Create final verification report
    **Type**: Setup
    **Validation**: Tier 1: Minimal
    - Document all fixes applied
    - Record final test counts
    - Note any remaining issues for future specs
    - _Requirements: 15.1, 15.2, 15.3_

  **Completion Documentation:**
  - Detailed: `.kiro/specs/030-test-failure-fixes/completion/task-10-completion.md`
  - Summary: `docs/specs/030-test-failure-fixes/task-10-summary.md`

---

## Verification Checkpoints

| Checkpoint | After Task | Expected Result |
|------------|------------|-----------------|
| Phase 1 Complete | Task 3 | ~23 fewer failures |
| Phase 2 Complete | Task 5 | ~17 additional fixes |
| Phase 3 Complete | Task 7 | ~14 additional fixes |
| Phase 4 Complete | Task 9 | ~9 additional fixes |
| Phase 5 Complete | Task 10 | 0 failures, exit code 0 |

---

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Scientific method: one change at a time, verify after each
- If a fix introduces new failures, stop and investigate before proceeding

---

**Status**: Tasks Complete - Ready for Implementation
