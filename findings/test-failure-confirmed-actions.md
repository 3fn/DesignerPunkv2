# Test Failure Audit - Confirmed Actions

**Date**: December 26, 2025
**Spec**: 029 - Test Failure Audit
**Confirmed By**: Peter Michaels Allen

---

## Summary

| Category | Pattern Count | Test Count |
|----------|---------------|------------|
| Fix Test | 5 | 18 |
| Fix Code | 3 | 10 |
| Investigate | 1 | 6 |
| Adjust Test Configuration | 1 | 3 |
| Adjust Expectations | 3 | 13 |
| Defer | 0 | 0 |

**Total**: 11 patterns covering 40 failing tests

---

## Confirmed Actions (Priority Order)

### Priority 1: P4 - Icon Undefined Multiplier (Fix Test)

**Pattern**: Icon Token Generation - Undefined Multiplier Reference
**Tests Affected**: 6 tests
**Action**: Fix Test - Exclude `icon.strokeWidth` from size validation

**Rationale**: The `icon.strokeWidth` token doesn't have a multiplier (it's a fixed value, not a size-based token). The test should exclude this token from the size validation that expects a multiplier reference.

**Notes**: 
- Scientific method approach: Fix test first, then reevaluate if null check is needed
- If issue persists after test fix, revisit defensive null check in `parseMultiplier()`

---

### Priority 2: P5 - Icon Missing CSS Variable (Fix Code)

**Pattern**: Icon Component Missing CSS Variable for strokeWidth
**Tests Affected**: 2 tests
**Action**: Fix Code - Update Icon component to use CSS variable

**Rationale**: The component outputs hard-coded `stroke-width="2"` instead of `var(--icon-stroke-width)`. This violates the token-first design system approach.

**Notes**: 
- Update Icon component to use `var(--icon-stroke-width)` CSS variable
- Ensure CSS variable is defined in token stylesheet

---

### Priority 3: P7 - Icon Fallback `|| 24` (Fix Code)

**Pattern**: Token Compliance - Problematic Fallback Pattern
**Tests Affected**: 1 test (part of 2-test pattern)
**Action**: Fix Code - Remove fallback, fail loudly

**Rationale**: At this stage of development, fallbacks prevent diagnosing issues. The `|| 24` fallback masks potential problems. Remove it to fail loudly and surface issues early.

**Notes**:
- "Fail loudly" philosophy for current development stage
- Fallbacks can be reconsidered for production hardening later

---

### Priority 4: P7 - Android `.dp` Suffix (Fix Code)

**Pattern**: Token Compliance - Android Hard-Coded Units
**Tests Affected**: ~14 instances across multiple tests
**Action**: Fix Code - Remove `.dp` suffix from token references

**Rationale**: The generator already handles the `.Dp` type conversion. Token references in code should not include the `.dp` suffix - units are applied at build time.

**Notes**:
- Affects tokens like `DesignTokens.space_200.dp`, `radius150.dp`, `iconSize100.dp`
- Remove `.dp` from token instances; generator handles unit conversion

---

### Priority 5: P1 - LineHeight Formula Mismatch (Adjust Expectations)

**Pattern**: LineHeight Token Formula Mismatch
**Tests Affected**: 4 tests
**Action**: Adjust Expectations - Update test expectations to match formula outputs

**Rationale**: The formula-based approach is the source of truth. The hardcoded "original" values in tests are legacy artifacts. Update test expectations to match actual formula outputs.

**Notes**:
- Verify formula is mathematically correct first
- Document formula and expected values in test file

---

### Priority 6: P2 - Border Width Structure Mismatch (Fix Test)

**Pattern**: Semantic Border Width Token Structure Mismatch
**Tests Affected**: 3 tests
**Action**: Fix Test - Update test expectations to match actual token structure

**Rationale**: The implementation is the source of truth for the current design system. Tests should validate the actual token structure, not an outdated expectation.

**Notes**:
- Review current SemanticBorderWidthTokens implementation
- Update expected token names and count
- Ensure tests validate meaningful properties

---

### Priority 7: P3 - Shadow Offset Token Count (Fix Test)

**Pattern**: Shadow Offset Token Naming/Export Issues
**Tests Affected**: 2 tests
**Action**: Fix Test - Update expected count from 24 to 26

**Rationale**: Investigation confirmed the token system has 26 primitive tokens (including shadow offset tokens), not 24. The test expectation is outdated.

**Notes**:
- Token names confirmed correct: `shadowOffsetY050` through `shadowOffsetY400`
- Update count expectation in test file

---

### Priority 8: P7 - iOS Regex False Positive (Fix Test)

**Pattern**: Token Compliance - iOS DesignTokens False Positive
**Tests Affected**: 6 instances
**Action**: Fix Test - Exclude `DesignTokens.` lines from regex pattern

**Rationale**: Lines like `DesignTokens.space.inset.100` are valid semantic token references, not hard-coded values. The regex pattern incorrectly flags these as violations.

**Notes**:
- These are semantic token references, not primitive values
- Improve regex to distinguish between token references and hard-coded values

---

### Priority 9: P7 - Android `0.dp` Exception (Fix Test)

**Pattern**: Token Compliance - Android Zero Value Edge Case
**Tests Affected**: 1 instance
**Action**: Fix Test - Add exception for `0.dp` literal

**Rationale**: `0.dp` is a valid edge case - zero doesn't need a token reference. This is an acceptable literal value.

**Notes**:
- Add explicit exception for `0.dp` in compliance test
- Document as valid edge case

---

### Priority 10: P7 - Web CSS Regex (Fix Test)

**Pattern**: Token Compliance - Web CSS Comment False Positives
**Tests Affected**: 3 instances
**Action**: Fix Test - Improve regex to handle CSS comments

**Rationale**: The regex pattern incorrectly flags values in CSS comments as violations. Improve pattern to exclude commented code.

**Notes**:
- Improve regex to skip CSS comment blocks
- Ensure actual violations are still caught

---

### Priority 11: P8 - Icon/Token Structure Mismatch (Fix Test)

**Pattern**: Icon/Token Structure Mismatch
**Tests Affected**: 2 tests
**Action**: Fix Test - Update test expectations to match generated tokens

**Rationale**: The generation logic is the source of truth. Manual definitions in tests should be updated to match actual generated tokens.

**Notes**:
- Review generated token output vs test expectations
- Remove redundant manual definitions

---

### Priority 12: P6 - Cross-Platform Consistency (Investigate)

**Pattern**: Cross-Platform Token Consistency Failures
**Tests Affected**: 6 tests
**Action**: Investigate → Create acknowledged differences registry + refine tests

**Rationale**: Some platform differences are intentional (platform-specific affordances). Need to document which differences are authorized and update tests to allow them.

**Notes**:
- Review each cross-platform difference
- Create registry of acknowledged/authorized differences
- Update tests to allow intentional differences
- Fix generation code for unintentional inconsistencies

---

### Priority 13: P9 - Performance Regression (Adjust Test Configuration)

**Pattern**: Performance Regression - Threshold Exceeded
**Tests Affected**: 3 tests
**Action**: Adjust Test Configuration - Run performance tests in isolation OR increase thresholds

**Investigation Findings** (Task 3.1.1 Complete):
- **Root Cause**: Test environment interference, NOT code inefficiency
- **Evidence**: Tests PASS when run in isolation (1.255s, all 32 tests pass) but FAIL in full suite
- **Isolated Performance**: Within 35% of November 2025 baseline (actually BETTER for state export)
- **Full Suite Overhead**: 5-25x higher execution times due to Jest worker overhead, concurrent tests, shared resources
- **Code Changes**: No changes to TokenEngine, registries, or validation since baseline

**Rationale**: Investigation confirmed the issue is test environment interference, not code degradation. The actual operations perform at or better than November 2025 baseline when measured in isolation.

**Recommended Fix Options**:
1. **Option A (Preferred)**: Run PerformanceValidation.test.ts in isolation via separate npm script
2. **Option B**: Increase thresholds to account for full-suite overhead (Statistics: 2ms→30ms, State Export: 2ms→15ms, Large Scale: 5ms→15ms)

**Notes**:
- See `findings/p9-performance-investigation.md` for full investigation report
- No code optimization needed - performance is within baseline
- Document environment sensitivity in test file

---

### Priority 14: P10 - Release Analysis Timeout (Adjust Expectations)

**Pattern**: Release Analysis Performance/Timeout Issues
**Tests Affected**: 5 tests
**Action**: Adjust Expectations - Increase thresholds 20-33%

**Rationale**: Tests barely miss threshold (0.06% over). Repository growth is the primary cause, not code inefficiency.

**Proposed Adjustments**:
- Quick analysis: 10000ms → 12000ms (20% increase)
- skipDetailedExtraction: 20000ms → 25000ms (25% increase)
- Pipeline persistence: 15000ms → 20000ms (33% increase)

**Notes**:
- Document repository growth as justification
- Consider git operation optimization as future enhancement

---

### Priority 15: P11 - QuickAnalyzer Timeout (Adjust Expectations)

**Pattern**: QuickAnalyzer Timeout Failures
**Tests Affected**: 5 tests
**Action**: Adjust Expectations - Increase threshold to 12000ms

**Rationale**: Tests miss threshold by 19-21ms (0.19-0.21%) - within measurement noise. Repository growth explains the marginal overage.

**Proposed Adjustments**:
- All QuickAnalyzer tests: 10000ms → 12000ms (20% increase)

**Notes**:
- Document repository growth as justification
- Consider append-only log optimization as future enhancement

---

## Deferred Actions

**None** - All 11 patterns have confirmed actions for Spec 030.

---

## Decisions Made

### Decision 1: Scientific Method for P4

**Options**: 
- A) Fix both test and add null check simultaneously
- B) Fix test first, reevaluate null check if issue persists

**Decision**: B - Fix test first

**Rationale**: "If you change two variables, you can't identify what change caused the resulting behavior." Fix one thing at a time to isolate the cause.

---

### Decision 2: Fail Loudly Philosophy for Fallbacks

**Options**:
- A) Make fallbacks "acceptable" with documentation
- B) Remove fallbacks to fail loudly

**Decision**: B - Remove fallbacks

**Rationale**: At this stage of development, fallbacks prevent diagnosing issues. We want to surface problems early, not mask them.

---

### Decision 3: Android `.dp` Unit Handling

**Options**:
- A) Update generator to handle `.dp` in token references
- B) Remove `.dp` from token references (generator already handles units)

**Decision**: B - Remove `.dp` from token references

**Rationale**: The generator already handles the `.Dp` type conversion. Token references should not include units - they're applied at build time.

---

### Decision 4: P9 Investigation Task

**Options**:
- A) Immediately adjust thresholds
- B) Immediately optimize code
- C) Create investigation task first

**Decision**: C - Create investigation task (Task 3.1.1)

**Rationale**: The 15x degradation could be degradation, scale, or bug. All are hypothetical possibilities. Investigation needed before committing to a fix approach.

---

### Decision 5: Cross-Platform Differences Registry

**Options**:
- A) Make all platforms identical
- B) Create acknowledged differences registry

**Decision**: B - Create acknowledged differences registry

**Rationale**: Platform-specific affordances are expected and intentional. Document which differences are authorized and update tests to reflect this reality.

---

## Action Summary by Category

### Fix Test (5 patterns, 18 tests)
- P4: Exclude `icon.strokeWidth` from size validation
- P2: Update border width token expectations
- P3: Update shadow offset count from 24 to 26
- P7 (partial): iOS regex, Android `0.dp` exception, Web CSS regex
- P8: Update icon/token structure expectations

### Fix Code (3 patterns, 10 tests)
- P5: Icon component use CSS variable for strokeWidth
- P7 (partial): Remove `|| 24` fallback, remove `.dp` suffix from Android tokens

### Investigate (1 pattern, 6 tests)
- P6: Cross-platform consistency → acknowledged differences registry

### Adjust Test Configuration (1 pattern, 3 tests)
- P9: Performance regression → Run tests in isolation OR increase thresholds (investigation complete)

### Adjust Expectations (3 patterns, 13 tests)
- P1: LineHeight formula expectations
- P10: Release analysis timeouts (20-33% increase)
- P11: QuickAnalyzer timeouts (20% increase)

---

**Status**: Task 3.2 Complete - Confirmed actions documented and ready for Spec 030 implementation.
