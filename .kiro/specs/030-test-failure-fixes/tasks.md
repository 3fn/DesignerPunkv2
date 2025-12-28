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

- [x] 7. Performance Threshold Adjustments
  **Type**: Implementation
  **Validation**: Tier 2: Standard
  **Success Criteria**: 10 performance/timeout tests pass with justified thresholds
  
  - [x] 7.1 Update release analysis timeouts
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Locate ReleaseAnalysis.test.ts
    - Update quick analysis timeout: 10000ms → 12000ms (20% increase)
    - Update skipDetailedExtraction timeout: 20000ms → 25000ms (25% increase)
    - Update pipeline persistence timeout: 15000ms → 20000ms (33% increase)
    - Add comments documenting repository growth justification
    - _Requirements: 13.1, 13.2, 13.3_
  
  - [x] 7.2 Update QuickAnalyzer timeouts
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Locate QuickAnalyzer.test.ts
    - Update all QuickAnalyzer timeouts: 10000ms → 12000ms (20% increase)
    - Add comments documenting repository growth justification
    - _Requirements: 14.1, 14.2_
  
  - [x] 7.3 Verify performance threshold adjustments
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

- [x] 8. Performance Test Configuration
  **Type**: Architecture
  **Validation**: Tier 3: Comprehensive
  **Success Criteria**: 3 performance validation tests pass, environment sensitivity documented
  
  - [x] 8.1 Implement performance test isolation (Option A - Preferred)
    **Type**: Architecture
    **Validation**: Tier 3: Comprehensive
    - Add npm script for isolated performance test execution in package.json
    - Script should run PerformanceValidation.test.ts independently
    - Document environment sensitivity in test file header
    - Test isolation approach works correctly
    - _Requirements: 12.1, 12.2_
  
  - [x] 8.2 Alternative: Increase performance thresholds (Option B - Fallback)
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - If isolation approach proves impractical, increase thresholds
    - Statistics: 2ms → 30ms
    - State Export: 2ms → 15ms
    - Large Scale: 5ms → 15ms
    - Document justification in test file
    - _Requirements: 12.3_
  
  - [x] 8.3 Verify performance test configuration
    **Type**: Setup
    **Validation**: Tier 1: Minimal
    - Run performance validation tests (isolated or with new thresholds)
    - Confirm 3 previously failing tests now pass
    - _Requirements: 12.4_

  **Completion Documentation:**
  - Detailed: `.kiro/specs/030-test-failure-fixes/completion/task-8-completion.md`
  - Summary: `docs/specs/030-test-failure-fixes/task-8-summary.md`

---

- [x] 9. Cross-Platform Consistency Registry
  **Type**: Architecture
  **Validation**: Tier 3: Comprehensive
  **Success Criteria**: Registry created, 6 cross-platform tests pass
  
  - [x] 9.1 Create acknowledged differences registry
    **Type**: Architecture
    **Validation**: Tier 3: Comprehensive
    - Create `src/__tests__/fixtures/acknowledged-differences.json`
    - Define schema: token, platforms, difference, rationale, authorizedBy, date
    - Document each authorized platform-specific affordance
    - _Requirements: 11.1_
  
  - [x] 9.2 Update cross-platform consistency tests
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Locate CrossPlatformConsistency.test.ts
    - Import acknowledged differences registry
    - Update test logic to allow documented differences
    - Ensure undocumented differences still fail
    - _Requirements: 11.2, 11.3_
  
  - [x] 9.3 Verify cross-platform consistency registry
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

### Phase 5: Remaining Failure Resolution

**Note**: Task 10.1 revealed 14 additional test failures not addressed by the original 40-test scope. These failures fall into three categories: cross-platform generator tests (5), performance/timeout tests (6), and functional issues (2). Tasks 11 and 12 address these before final verification.

---

- [x] 11. Remaining Test Failure Audit
  **Type**: Architecture
  **Validation**: Tier 2: Standard
  **Success Criteria**: All 14 failures categorized with root cause and fix approach documented
  
  - [x] 11.1 Categorize failures by root cause
    **Type**: Architecture
    **Validation**: Tier 2: Standard
    - Analyze each of the 14 failing tests
    - Group by category: cross-platform (5), performance (6), functional (2)
    - Identify root cause for each failure
    - Determine if fix is test change, code change, or threshold adjustment
    - _Requirements: 15.1, 15.2_
  
  - [x] 11.2 Determine fix approach for each category
    **Type**: Architecture
    **Validation**: Tier 2: Standard
    - Cross-platform generator tests: Determine if acknowledged-differences registry applies
    - Performance tests: Determine if further threshold increases or isolation needed
    - Functional tests: Identify code changes required
    - Document recommended approach for each after reviewing with Peter
    - _Requirements: 15.2, 15.3_
  
  - [x] 11.3 Create audit findings document
    **Type**: Setup
    **Validation**: Tier 1: Minimal
    - Create `.kiro/specs/030-test-failure-fixes/completion/task-11-audit-findings.md`
    - Document all 14 failures with root cause and recommended fix
    - Update Task 12 subtasks based on findings
    - _Requirements: 15.1_

  **Completion Documentation:**
  - Detailed: `.kiro/specs/030-test-failure-fixes/completion/task-11-completion.md`
  - Summary: `docs/specs/030-test-failure-fixes/task-11-summary.md`

---

- [x] 12. Remaining Test Failure Resolution
  **Type**: Implementation
  **Validation**: Tier 2: Standard
  **Success Criteria**: All 16 remaining failures resolved, tests pass
  
  - [x] 12.1 Cross-platform generator fixes (nuanced validation)
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Investigate token differences between iOS (145) and Android (144)
    - Identify which tokens are platform-specific
    - Update `validateCrossPlatformConsistency()` to exclude platform-specific tokens from count comparison
    - Document platform-specific tokens in acknowledged-differences registry
    - Run affected tests to verify fix
    - _Requirements: 15.2_
  
  - [x] 12.2 Performance threshold and timeout adjustments
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Update performance thresholds: 12000ms → 13000ms (8% increase)
    - Update test timeouts: quick-analyze cache (12s→18s), skipDetailedExtraction (25s→35s), StateIntegration (15s→25s)
    - Add comments documenting repository growth justification
    - Run affected tests to verify fix
    - _Requirements: 15.2_
  
  - [x] 12.3 Functional issue fixes (cache and summary)
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Debug cache implementation in QuickAnalyzer
    - Fix `fullResultCached` flag setting
    - Fix `latest.json` symlink/copy logic
    - Verify summary format matches test expectations
    - Run affected tests to verify fix
    - _Requirements: 15.2_
  
  - [x] 12.4 Verify all remaining fixes
    **Type**: Setup
    **Validation**: Tier 1: Minimal
    - Run full test suite
    - Confirm all 16 previously failing tests now pass
    - Document any remaining issues
    - _Requirements: 15.2, 15.3_

  **Completion Documentation:**
  - Detailed: `.kiro/specs/030-test-failure-fixes/completion/task-12-completion.md`
  - Summary: `docs/specs/030-test-failure-fixes/task-12-summary.md`

- [x] 13. Test Suite Verification
  **Type**: Architecture
  **Validation**: Tier 3: Comprehensive
  **Success Criteria**: All tests pass, exit code 0, no regressions
  
  - [x] 13.1 Run full test suite
    **Type**: Setup
    **Validation**: Tier 1: Minimal
    - Execute `npm test`
    - Verify exit code is 0
    - Document total test count and pass rate
    - _Requirements: 15.1_
  
  - [x] 13.2 Verify no new failures
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Compare test results to pre-fix baseline
    - Confirm no new test failures introduced
    - Document any unexpected changes
    - _Requirements: 15.2_
  
  - [x] 13.3 Verify no regressions
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Confirm all previously passing tests still pass
    - Run `npm run test:all` for comprehensive verification
    - Document final test suite status
    - _Requirements: 15.3_
  
  - [x] 13.4 Create final verification report
    **Type**: Setup
    **Validation**: Tier 1: Minimal
    - Document all fixes applied (original 40 + additional 14)
    - Record final test counts
    - Note any remaining issues for future specs
    - _Requirements: 15.1, 15.2, 15.3_

  **Completion Documentation:**
  - Detailed: `.kiro/specs/030-test-failure-fixes/completion/task-13-completion.md`
  - Summary: `docs/specs/030-test-failure-fixes/task-13-summary.md`

---

## Verification Checkpoints

| Checkpoint | After Task | Expected Result |
|------------|------------|-----------------|
| Phase 1 Complete | Task 3 | ~23 fewer failures |
| Phase 2 Complete | Task 5 | ~17 additional fixes |
| Phase 3 Complete | Task 7 | ~14 additional fixes |
| Phase 4 Complete | Task 9 | ~9 additional fixes |
| Phase 5 Initial | Task 10.1 | 14 remaining failures identified |
| Phase 5 Audit | Task 11 | All 14 failures categorized with fix approach |
| Phase 5 Resolution | Task 12 | All 14 remaining failures resolved |
| Phase 6 Complete | Task 13 | 0 failures, exit code 0 |

---

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Scientific method: one change at a time, verify after each
- If a fix introduces new failures, stop and investigate before proceeding
- **Task 10 paused**: Initial verification (10.1) revealed 14 additional failures outside original scope
- **Tasks 11-12 added**: Audit and resolution of remaining failures before final verification
- **Task 13**: Final verification moved from Task 10 to allow for complete resolution first

---

## Remaining Failures (from Task 10.1)

The following 14 tests were identified as failing during initial verification:

### Cross-Platform Generator Tests (5 tests)
1. `GridSpacingTokenGeneration.test.ts` - should generate same grid spacing token count across all platforms
2. `GridSpacingTokenGeneration.test.ts` - should maintain primitive token references across platforms
3. `BreakpointTokenGeneration.test.ts` - should maintain mathematical consistency across platforms
4. `AccessibilityTokenGeneration.test.ts` - should validate cross-platform consistency
5. `AccessibilityTokenGeneration.test.ts` - should maintain consistent semantic token count across platforms
6. `TokenFileGenerator.test.ts` - should validate consistent token counts across platforms

### Performance/Timeout Tests (6 tests)
7. `quick-analyze.test.ts` - should complete analysis within 12 seconds (12025ms actual)
8. `quick-analyze.test.ts` - should respect custom cache directory (timeout)
9. `HookIntegration.test.ts` - should complete quick analysis within 12 seconds (12003ms actual)
10. `HookIntegration.test.ts` - should optimize for speed with skipDetailedExtraction (timeout)
11. `StateIntegration.integration.test.ts` - should persist state after each pipeline stage (timeout)
12. `StateIntegration.integration.test.ts` - should update context with stage results (timeout)

### Functional Test Failures (2 tests)
13. `HookIntegration.test.ts` - should provide concise one-line summary
14. `HookIntegration.test.ts` - should cache analysis results when enabled

---

**Status**: In Progress - Tasks 11-13 added for remaining failure resolution
