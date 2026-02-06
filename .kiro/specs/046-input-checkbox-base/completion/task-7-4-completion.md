# Task 7.4 Completion: Fix Strategy Decision

**Date**: February 6, 2026
**Task**: 7.4 Document fix strategy decision
**Status**: Complete
**Organization**: spec-completion
**Scope**: 046-input-checkbox-base

---

## Executive Summary

After auditing all test-implementation mismatches in Tasks 7.1-7.3 and discussing with Peter, the **approved fix strategy is Option A: Refactor Legal to match the design doc's wrapper pattern**.

**Key Decision**: The implementation drifted from the design doc. Rather than codifying this drift by updating tests, we will refactor Input-Checkbox-Legal to properly wrap Input-Checkbox-Base as originally specified.

---

## Consolidated Findings Summary

### Task 7.1: Stemma Test Token Naming (1 test failure)

| Issue | Root Cause | Decision |
|-------|------------|----------|
| Test expects `--color-select-selected-strong` | Token renamed in Spec 052 | **Update test** to use `--color-feedback-select-background-rest` |
| Test expects `--color-select-not-selected-strong` | Token renamed in Spec 052 | **Update test** to use `--color-feedback-select-border-default` |

**Verdict**: CSS implementation is correct. Test uses deprecated token names.

---

### Task 7.2: Token Completeness (4 missing tokens)

| Missing Token | Root Cause | Decision |
|---------------|------------|----------|
| `color-badge-notification-background` | Not in generation pipeline | **Fix**: Add Badge-Count-Notification to `generate-platform-tokens.ts` |
| `color-badge-notification-text` | Not in generation pipeline | **Fix**: Add Badge-Count-Notification to `generate-platform-tokens.ts` |
| `color-contrast-on-primary` | Wrong token name in CSS | **Fix**: Replace with `--color-contrast-on-dark` |
| `color-error-strong` | Wrong token name in CSS | **Fix**: Replace with `--color-feedback-error-border` |

**Verdict**: Mixed - 2 require adding to generation pipeline, 2 require CSS token name fixes.

---

### Task 7.3: InputCheckboxLegal Tests (23 test failures)

| Category | Count | Root Cause | Decision |
|----------|-------|------------|----------|
| Input element not found | 12 | Standalone pattern vs wrapper | **Refactor Legal to wrapper** |
| Missing .checkbox--legal class | 2 | Standalone pattern vs wrapper | **Refactor Legal to wrapper** |
| Required indicator selector | 2 | Different class naming | **Update after refactor** |
| Icon not found | 1 | Standalone pattern vs wrapper | **Refactor Legal to wrapper** |
| Form reset not working | 1 | Reset not propagated | **Fix in refactor** |
| Name attribute not found | 1 | Standalone pattern vs wrapper | **Refactor Legal to wrapper** |
| Accessibility attributes | 3 | Mixed selector issues | **Update after refactor** |

**Verdict**: Implementation drifted from design doc. Refactor to wrapper pattern.

---

## Approved Strategy: Option A (Refactor to Wrapper Pattern)

### Why This Approach

After discussion with Peter, we agreed that:

1. **The design doc is correct** — The wrapper pattern is the right architectural choice
2. **Implementation drifted** — The standalone implementation was a deviation, not an improvement
3. **Updating tests would codify debt** — Tests were written to the spec; changing them validates the wrong architecture
4. **Wrapper pattern has long-term benefits**:
   - Reduces code duplication (~80% of Legal is duplicated from Base)
   - Legal automatically benefits from Base improvements
   - Aligns with Stemma System inheritance model
   - Sets correct precedent for future checkbox variants

### What Needs to Happen

1. **Token fixes first** (isolated bugs, quick wins)
2. **Extend Base** to support `labelTypography` prop for lg+labelSm combination
3. **Refactor Legal** to wrapper pattern per design doc
4. **Update tests** for new DOM structure (minimal changes expected)

---

## Task 8 Rewritten

Task 8 has been completely rewritten to implement Option A with optimal ordering:

| Subtask | Purpose | Type |
|---------|---------|------|
| 8.1 | Fix deprecated token names in CSS | Implementation |
| 8.2 | Add Badge-Count-Notification to token generation | Implementation |
| 8.3 | Update stemma test token expectations | Implementation |
| 8.4 | Extend Base to support Legal's typography needs | Architecture |
| 8.5 | Refactor Legal to wrapper pattern | Architecture |
| 8.6 | Update Legal tests for wrapper DOM structure | Implementation |
| 8.7 | Full test suite validation | Verification |

**Order Rationale**:
- Token fixes (8.1-8.3) are orthogonal and give quick test wins
- Base extension (8.4) must happen before Legal can wrap it
- Legal refactor (8.5) is the core architectural fix
- Test updates (8.6) validate the refactored implementation
- Full validation (8.7) ensures no regressions

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Base extension breaks existing usage | Low | High | Ensure backward compatibility with default value |
| Legal refactor introduces bugs | Medium | Medium | Comprehensive testing, incremental approach |
| Test updates miss edge cases | Low | Low | Run full test suite after each change |

---

## User Approval

**Approved by Peter on February 6, 2026**

Decision: Proceed with Option A (Refactor to Wrapper Pattern)

---

## Next Steps

Proceed to Task 8.1: Fix deprecated token names in CSS

---

## Files Referenced

- `.kiro/specs/046-input-checkbox-base/completion/task-7-1-completion.md`
- `.kiro/specs/046-input-checkbox-base/completion/task-7-2-completion.md`
- `.kiro/specs/046-input-checkbox-base/completion/task-7-3-completion.md`
- `.kiro/specs/046-input-checkbox-base/design.md`
- `.kiro/specs/046-input-checkbox-base/tasks.md` (Task 8 rewritten)
