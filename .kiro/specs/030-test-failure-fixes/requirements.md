# Requirements Document: Test Failure Fixes

**Date**: December 27, 2025
**Spec**: 030 - Test Failure Fixes
**Status**: Requirements Phase
**Dependencies**: 029-test-failure-audit (complete)

---

## Introduction

This spec addresses the 40 failing tests identified and analyzed in Spec 029 (Test Failure Audit). Through systematic pattern-based analysis and human confirmation, 15 distinct failure patterns were identified with confirmed actions for resolution. This spec implements those confirmed fixes to achieve a clean test suite.

## Glossary

- **Test_Suite**: The complete collection of automated tests run via `npm test`
- **Token_Compliance_Test**: Tests that verify code uses design tokens instead of hard-coded values
- **Icon_Token_Generator**: The system that generates icon-related design tokens
- **Cross_Platform_Consistency_Test**: Tests that verify token consistency across web, iOS, and Android platforms
- **Performance_Validation_Test**: Tests that measure and validate system performance against thresholds
- **Release_Analysis_Test**: Tests that validate the release detection and analysis system
- **EARS**: Easy Approach to Requirements Syntax - a structured format for writing requirements

---

## Requirements

### Requirement 1: Icon Token Test Corrections

**User Story**: As a developer, I want icon token tests to correctly validate size-based tokens, so that non-size tokens like strokeWidth don't cause false failures.

#### Acceptance Criteria

1. WHEN the Icon_Token_Generator validates size tokens THEN the Test_Suite SHALL exclude `icon.strokeWidth` from size validation that expects multiplier references
2. WHEN icon token structure tests run THEN the Test_Suite SHALL use expectations that match the actual generated token structure
3. WHEN all icon token test corrections are applied THEN 8 previously failing tests SHALL pass

---

### Requirement 2: Icon Component CSS Variable Fix

**User Story**: As a developer, I want the Icon component to use CSS variables for strokeWidth, so that the component follows the token-first design system approach.

#### Acceptance Criteria

1. WHEN the Icon component renders THEN the Icon_Component SHALL use `var(--icon-stroke-width)` instead of hard-coded `stroke-width="2"`
2. WHEN the CSS variable `--icon-stroke-width` is referenced THEN the Token_Stylesheet SHALL define this variable
3. WHEN the Icon component fix is applied THEN 2 previously failing tests SHALL pass

---

### Requirement 3: Problematic Fallback Removal

**User Story**: As a developer, I want fallback patterns removed from token references, so that issues surface early rather than being masked.

#### Acceptance Criteria

1. WHEN token references are evaluated THEN the Token_System SHALL NOT use `|| 24` fallback patterns
2. IF a token reference fails to resolve THEN the Token_System SHALL fail loudly with a clear error
3. WHEN the fallback removal is applied THEN 1 previously failing test SHALL pass

---

### Requirement 4: Android Unit Suffix Removal

**User Story**: As a developer, I want Android token references to not include `.dp` suffixes, so that unit conversion is handled consistently at build time.

#### Acceptance Criteria

1. WHEN Android code references design tokens THEN the Code SHALL NOT include `.dp` suffix on token references
2. WHEN tokens like `DesignTokens.space_200`, `radius150`, or `iconSize100` are used THEN the References SHALL be without `.dp` suffix
3. WHEN the Android unit suffix removal is applied THEN approximately 14 Token_Compliance_Test instances SHALL pass

---

### Requirement 5: LineHeight Formula Expectation Updates

**User Story**: As a developer, I want lineHeight test expectations to match formula outputs, so that tests validate the mathematical source of truth.

#### Acceptance Criteria

1. WHEN lineHeight tokens are tested THEN the Test_Suite SHALL use expectations matching the formula-based outputs
2. WHEN formula outputs differ from legacy hardcoded values THEN the Test_Expectations SHALL be updated to match formula outputs
3. WHEN lineHeight expectation updates are applied THEN 4 previously failing tests SHALL pass

---

### Requirement 6: Border Width Token Structure Updates

**User Story**: As a developer, I want border width token tests to match the current implementation, so that tests validate the actual token structure.

#### Acceptance Criteria

1. WHEN SemanticBorderWidthTokens are tested THEN the Test_Suite SHALL use expectations matching the current implementation
2. WHEN token names or counts have changed THEN the Test_Expectations SHALL be updated accordingly
3. WHEN border width structure updates are applied THEN 3 previously failing tests SHALL pass

---

### Requirement 7: Shadow Offset Token Count Update

**User Story**: As a developer, I want shadow offset token count expectations to be accurate, so that tests reflect the actual token system.

#### Acceptance Criteria

1. WHEN primitive token counts are validated THEN the Test_Suite SHALL expect 26 tokens (not 24)
2. WHEN shadow offset tokens `shadowOffsetY050` through `shadowOffsetY400` are counted THEN the Count SHALL include all tokens
3. WHEN shadow offset count updates are applied THEN 2 previously failing tests SHALL pass

---

### Requirement 8: iOS Token Compliance Regex Improvement

**User Story**: As a developer, I want iOS token compliance tests to not flag valid semantic token references as violations, so that false positives are eliminated.

#### Acceptance Criteria

1. WHEN iOS Token_Compliance_Test evaluates code THEN the Regex SHALL exclude lines containing `DesignTokens.` references
2. WHEN semantic token references like `DesignTokens.space.inset.100` are encountered THEN the Test SHALL NOT flag them as violations
3. WHEN iOS regex improvements are applied THEN 6 false positive instances SHALL be eliminated

---

### Requirement 9: Android Zero Value Exception

**User Story**: As a developer, I want `0.dp` to be an acceptable literal value in Android code, so that zero values don't require token references.

#### Acceptance Criteria

1. WHEN Android Token_Compliance_Test evaluates code THEN the Test SHALL allow `0.dp` as a valid literal
2. WHEN zero values are used THEN the Test SHALL NOT require a token reference
3. WHEN the Android zero value exception is applied THEN 1 false positive instance SHALL be eliminated

---

### Requirement 10: Web CSS Comment Regex Improvement

**User Story**: As a developer, I want web CSS token compliance tests to ignore values in comments, so that commented code doesn't trigger false positives.

#### Acceptance Criteria

1. WHEN Web Token_Compliance_Test evaluates CSS THEN the Regex SHALL exclude values within CSS comment blocks
2. WHEN actual violations exist outside comments THEN the Test SHALL still detect them
3. WHEN web CSS regex improvements are applied THEN 3 false positive instances SHALL be eliminated

---

### Requirement 11: Cross-Platform Consistency Registry

**User Story**: As a developer, I want an acknowledged differences registry for cross-platform variations, so that intentional platform-specific affordances don't cause test failures.

#### Acceptance Criteria

1. WHEN Cross_Platform_Consistency_Test runs THEN the Test SHALL reference an acknowledged differences registry
2. WHEN a platform difference is documented in the registry THEN the Test SHALL allow that specific difference
3. WHEN an undocumented platform difference is detected THEN the Test SHALL fail
4. WHEN the cross-platform consistency registry is implemented THEN 6 previously failing tests SHALL pass

---

### Requirement 12: Performance Validation Test Configuration

**User Story**: As a developer, I want performance validation tests to account for test environment overhead, so that environment interference doesn't cause false failures.

#### Acceptance Criteria

1. WHEN Performance_Validation_Test runs THEN the Test SHALL either run in isolation OR use thresholds accounting for full-suite overhead
2. IF isolation approach is used THEN a separate npm script SHALL run PerformanceValidation.test.ts independently
3. IF threshold approach is used THEN thresholds SHALL be: Statistics 30ms, State Export 15ms, Large Scale 15ms
4. WHEN performance test configuration is updated THEN 3 previously failing tests SHALL pass

---

### Requirement 13: Release Analysis Timeout Adjustments

**User Story**: As a developer, I want release analysis test timeouts to account for repository growth, so that marginal threshold misses don't cause failures.

#### Acceptance Criteria

1. WHEN Release_Analysis_Test validates quick analysis THEN the Timeout SHALL be 12000ms (20% increase from 10000ms)
2. WHEN Release_Analysis_Test validates skipDetailedExtraction THEN the Timeout SHALL be 25000ms (25% increase from 20000ms)
3. WHEN Release_Analysis_Test validates pipeline persistence THEN the Timeout SHALL be 20000ms (33% increase from 15000ms)
4. WHEN release analysis timeout adjustments are applied THEN 5 previously failing tests SHALL pass

---

### Requirement 14: QuickAnalyzer Timeout Adjustments

**User Story**: As a developer, I want QuickAnalyzer test timeouts to account for repository growth, so that measurement noise doesn't cause failures.

#### Acceptance Criteria

1. WHEN QuickAnalyzer tests run THEN the Timeout SHALL be 12000ms (20% increase from 10000ms)
2. WHEN timeout adjustments are documented THEN the Documentation SHALL reference repository growth as justification
3. WHEN QuickAnalyzer timeout adjustments are applied THEN 5 previously failing tests SHALL pass

---

### Requirement 15: Test Suite Verification

**User Story**: As a developer, I want the complete test suite to pass after all fixes, so that I have confidence in the codebase quality.

#### Acceptance Criteria

1. WHEN all fixes from Requirements 1-14 are applied THEN `npm test` SHALL return exit code 0
2. WHEN the full test suite runs THEN no new test failures SHALL be introduced
3. WHEN previously passing tests are re-run THEN they SHALL continue to pass (no regressions)

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Previously failing tests now passing | 40 |
| New test failures introduced | 0 |
| Test suite exit code | 0 |
| Regressions in previously passing tests | 0 |

---

## Reference Documents

- `findings/test-failure-audit-findings.md` - Complete failure catalog
- `findings/test-failure-confirmed-actions.md` - Human-confirmed actions
- `findings/p9-performance-investigation.md` - Performance investigation report
- `.kiro/specs/029-test-failure-audit/design.md` - Audit methodology
- `.kiro/specs/030-test-failure-fixes/design-outline.md` - Implementation strategy

---

**Status**: Requirements Complete - Ready for Design Phase
