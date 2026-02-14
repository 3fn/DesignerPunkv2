# Issue: Stemma Validator Pattern Type Gaps

**Date**: February 14, 2026
**Severity**: Low
**Status**: Open
**Discovered During**: Lina's first task — fixing InputRadioSet.stemma.test.ts componentType classification
**Affects**: StemmaComponentNamingValidator, StemmaPropertyAccessibilityValidator, InputRadioSet.stemma.test.ts
**Recommended Owner**: Lina (component domain)

---

## Summary

Lina added `'pattern'` as a fourth component type in the naming validator to correctly classify "Set" variant components (orchestration patterns). The fix resolved the original test failure but left two gaps and exposed a pre-existing issue.

---

## Gap 1: Batch Validation Doesn't Count Pattern Types

**File**: `src/validators/StemmaComponentNamingValidator.ts`
**Function**: `validateComponentNames()`

The batch summary object has counters for `primitives`, `semantics`, and `standalones` but not `patterns`. When a component is classified as `'pattern'`, it increments the `valid` counter but silently falls through the type-specific counting.

```typescript
// Current — no pattern counting
summary: {
  total: number;
  valid: number;
  invalid: number;
  primitives: number;
  semantics: number;
  standalones: number;  // ← no 'patterns' field
  warnings: number;
};
```

**Fix**: Add `patterns: number` to the summary type and increment it when `result.componentType === 'pattern'`.

**Impact**: Low. Batch validation reports would undercount valid components by type. No runtime impact.

---

## Gap 2: Accessibility Validator Doesn't Recognize Pattern/Orchestration Components

**File**: `src/validators/StemmaPropertyAccessibilityValidator.ts`
**Function**: `determineComponentType()` (different from the naming validator's function)
**Test**: `InputRadioSet.stemma.test.ts` → "should validate required accessibility properties"

The accessibility validator classifies components by name substring matching. `Input-Radio-Set` contains "input", so it's classified as `'input'` type, which requires a `label` property. But Set components are orchestration containers — they manage child components, not direct user input. They get their semantics from `role="radiogroup"` and their children, not from a label prop.

The test passes `{ selectedValue, required, error, size }` without a label, expecting no `MISSING_ACCESSIBILITY_LABEL` error. But the validator raises one because it treats the Set as a direct input.

**This was a pre-existing failure** — it was masked because the `componentType` test failed first and the suite was already reported as failed.

**Possible fixes** (in order of preference):
1. Update `determineComponentType` in the accessibility validator to recognize "Set" variants as `'container'` or `'generic'` type (orchestration containers don't need their own label)
2. Add a label to the test props (quick fix, but semantically wrong — Sets shouldn't need labels)
3. Add a `'group'` component type to the accessibility validator that has different label requirements (most thorough, but more work)

**Impact**: Medium. One test failure. The validator incorrectly requires labels on orchestration components.

---

## Context

Lina's naming validator change was clean and well-scoped — adding `'pattern'` for "Set" variants is the right call conceptually. These gaps are follow-up work, not regressions.

The accessibility issue is arguably the more important fix since it affects how the validator treats all future Set/orchestration components, not just Input-Radio-Set.
