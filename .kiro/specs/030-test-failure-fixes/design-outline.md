# Design Outline: Test Failure Fixes

**Date**: December 26, 2025
**Spec**: 030 - Test Failure Fixes
**Status**: Design Outline
**Dependencies**: 029-test-failure-audit (complete)

---

## Problem Statement

Spec 029 (Test Failure Audit) identified and analyzed 40 failing tests across 17 test suites. Through systematic pattern-based analysis and human confirmation, 11 distinct failure patterns were identified with confirmed actions for resolution.

### Confirmed Patterns to Fix

| Priority | Pattern | Tests | Action Category |
|----------|---------|-------|-----------------|
| P1 | Icon Undefined Multiplier | 6 | Fix Test |
| P2 | Icon Missing CSS Variable | 2 | Fix Code |
| P3 | Icon Fallback `\|\| 24` | 1 | Fix Code |
| P4 | Android `.dp` Suffix | ~14 | Fix Code |
| P5 | LineHeight Formula Mismatch | 4 | Adjust Expectations |
| P6 | Border Width Structure Mismatch | 3 | Fix Test |
| P7 | Shadow Offset Token Count | 2 | Fix Test |
| P8 | iOS Regex False Positive | 6 | Fix Test |
| P9 | Android `0.dp` Exception | 1 | Fix Test |
| P10 | Web CSS Regex | 3 | Fix Test |
| P11 | Icon/Token Structure Mismatch | 2 | Fix Test |
| P12 | Cross-Platform Consistency | 6 | Investigate + Fix |
| P13 | Performance Regression | 3 | Adjust Test Config |
| P14 | Release Analysis Timeout | 5 | Adjust Expectations |
| P15 | QuickAnalyzer Timeout | 5 | Adjust Expectations |

**Total**: 40 failing tests to resolve

---

## Goals

1. **Primary Goal**: Achieve 0 failing tests in the test suite
2. **Secondary Goal**: No regressions introduced by fixes
3. **Tertiary Goal**: Maintain test quality and coverage

---

## Scope

### In Scope (Confirmed Actions Only)

- Fix test expectations that don't match current implementation
- Fix code issues identified by tests (CSS variables, fallbacks, unit suffixes)
- Adjust performance thresholds with documented justification
- Create acknowledged differences registry for cross-platform variations
- Improve regex patterns to reduce false positives

### Out of Scope

- New feature development
- Performance optimization beyond threshold adjustments
- Test coverage expansion
- Refactoring beyond what's needed for fixes

---

## Implementation Strategy (Prioritized Fix Order)

### Phase 1: Quick Wins - Fix Test Expectations (Priority 1-4, 6-11)

**Rationale**: These are test-only changes with no code risk. They establish a baseline of passing tests quickly.

#### Task Group 1.1: Icon Token Test Fixes
- **P1**: Exclude `icon.strokeWidth` from size validation (6 tests)
- **P11**: Update icon/token structure expectations (2 tests)

#### Task Group 1.2: Token Structure Test Fixes
- **P6**: Update border width token expectations (3 tests)
- **P7**: Update shadow offset count from 24 to 26 (2 tests)

#### Task Group 1.3: Compliance Test Regex Improvements
- **P8**: Exclude `DesignTokens.` lines from iOS regex (6 instances)
- **P9**: Add exception for `0.dp` literal (1 instance)
- **P10**: Improve regex to handle CSS comments (3 instances)

### Phase 2: Code Fixes (Priority 2-4)

**Rationale**: These fix actual code issues identified by tests. Apply scientific method - one change at a time.

#### Task Group 2.1: Icon Component CSS Variable
- **P2**: Update Icon component to use `var(--icon-stroke-width)` (2 tests)

#### Task Group 2.2: Remove Problematic Patterns
- **P3**: Remove `|| 24` fallback - fail loudly philosophy (1 test)
- **P4**: Remove `.dp` suffix from Android token references (~14 instances)

### Phase 3: Expectation Adjustments (Priority 5, 14-15)

**Rationale**: These update test expectations to match formula outputs and repository growth.

#### Task Group 3.1: Formula Expectations
- **P5**: Update lineHeight test expectations to match formula outputs (4 tests)

#### Task Group 3.2: Performance Thresholds
- **P14**: Increase release analysis thresholds 20-33% (5 tests)
- **P15**: Increase QuickAnalyzer threshold to 12000ms (5 tests)

### Phase 4: Investigation + Fix (Priority 12-13)

**Rationale**: These require investigation before fixing. P13 investigation is complete.

#### Task Group 4.1: Performance Test Configuration
- **P13**: Run PerformanceValidation.test.ts in isolation OR increase thresholds (3 tests)
- Investigation complete: Test environment interference confirmed, not code inefficiency

#### Task Group 4.2: Cross-Platform Consistency
- **P12**: Create acknowledged differences registry (6 tests)
- Review each cross-platform difference
- Document authorized platform-specific affordances
- Update tests to allow intentional differences

### Phase 5: Verification

- Run full test suite to confirm 0 failures
- Verify no regressions in previously passing tests
- Document any remaining issues for future specs

---

## Success Criteria

### Primary Criteria
- [ ] All 40 previously failing tests now pass
- [ ] No new test failures introduced
- [ ] Full test suite passes: `npm test` returns 0 exit code

### Secondary Criteria
- [ ] All fixes documented with rationale
- [ ] Cross-platform differences registry created (if applicable)
- [ ] Performance thresholds documented with justification

### Verification Commands
```bash
# Primary verification
npm test

# Performance tests (if run separately)
npm run test:performance

# Full suite including performance
npm run test:all
```

---

## Risks and Mitigations

### Risk 1: Code Fixes Introduce Regressions

**Likelihood**: Medium
**Impact**: High

**Mitigation**:
- Apply scientific method: one change at a time
- Run full test suite after each code change
- Review changes carefully before committing

### Risk 2: Performance Threshold Adjustments Mask Real Issues

**Likelihood**: Low
**Impact**: Medium

**Mitigation**:
- Document justification for each threshold change
- P13 investigation confirmed environment interference, not code degradation
- P14/P15 increases are modest (20-33%) and justified by repository growth

### Risk 3: Cross-Platform Differences Registry Becomes Stale

**Likelihood**: Medium
**Impact**: Low

**Mitigation**:
- Document each acknowledged difference with rationale
- Include review process in future cross-platform work
- Tests will fail if new unauthorized differences appear

### Risk 4: Regex Improvements Create New False Negatives

**Likelihood**: Low
**Impact**: Medium

**Mitigation**:
- Test regex changes against known violations
- Ensure actual violations are still caught
- Document regex patterns and their intent

---

## Dependencies

### Required Before Starting
- Spec 029 confirmed actions document (complete)
- P9 performance investigation (complete)

### External Dependencies
- None

### Enables
- Clean test suite for future development
- Reliable CI/CD pipeline
- Confidence in test coverage

---

## Estimated Effort

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| Phase 1: Quick Wins | 3 task groups | 2-3 hours |
| Phase 2: Code Fixes | 2 task groups | 1-2 hours |
| Phase 3: Expectations | 2 task groups | 1 hour |
| Phase 4: Investigation | 2 task groups | 2-3 hours |
| Phase 5: Verification | 1 task | 30 minutes |
| **Total** | **10 task groups** | **7-10 hours** |

---

## Reference Documents

- `findings/test-failure-audit-findings.md` - Complete failure catalog
- `findings/test-failure-confirmed-actions.md` - Human-confirmed actions
- `findings/p9-performance-investigation.md` - Performance investigation report
- `.kiro/specs/029-test-failure-audit/design.md` - Audit methodology

---

**Status**: Ready for requirements and design document development
