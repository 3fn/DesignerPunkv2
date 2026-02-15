# Issue: InputRadioSet Stemma Test Needs Update After Validator Fix

**Date**: February 14, 2026
**Severity**: Low
**Status**: Open
**Discovered During**: Test suite run after Lina's stemma validator pattern type fixes
**Affects**: `src/components/core/Input-Radio-Set/__tests__/InputRadioSet.stemma.test.ts`
**Recommended Owner**: Lina (component domain)

---

## Summary

Lina successfully implemented the accessibility validator fix (Option 1 from Thurgood's notes) to recognize orchestration/pattern components as `'container'` type. The validator now correctly classifies `Input-Radio-Set` as a container rather than an input.

However, the stemma test still expects the old behavior (`'input'`), causing a test failure.

---

## The Fix (Already Implemented)

**File**: `src/validators/StemmaPropertyAccessibilityValidator.ts`
**Function**: `determineComponentType()`

Lina added this check before substring matching:

```typescript
// Check for orchestration/pattern components (Set, Group) BEFORE substring matching
// These are containers that manage children, not direct inputs
if (componentName.endsWith('-Set') || componentName.endsWith('-Group')) {
  return 'container';
}
```

This is **correct** — orchestration components like `Input-Radio-Set` are containers that manage children, not direct inputs. They get their semantics from `role="radiogroup"` and their children, not from a label prop.

---

## The Test That Needs Updating

**File**: `src/components/core/Input-Radio-Set/__tests__/InputRadioSet.stemma.test.ts`
**Line**: 467-470

```typescript
it('should validate component as input type', () => {
  const componentType = determineComponentType(null, COMPONENT_NAME);
  expect(componentType).toBe('input');  // ← This is now wrong
});
```

**Current behavior**: Test expects `'input'`, validator returns `'container'`
**Expected behavior**: Test should expect `'container'` to match the validator's correct classification

---

## Recommended Fix

Update the test to reflect the correct classification:

```typescript
it('should validate component as container type', () => {
  const componentType = determineComponentType(null, COMPONENT_NAME);
  expect(componentType).toBe('container');
});
```

**Rationale**: The test name and assertion should match the architectural reality — `Input-Radio-Set` is an orchestration container, not a direct input.

---

## Impact

**Severity**: Low
**Impact**: One test failure. No runtime impact — the validator is working correctly.
**Urgency**: Low. This is a test alignment issue, not a functional bug.

---

## Validation

After updating the test, run:
```bash
npm test -- src/components/core/Input-Radio-Set/__tests__/InputRadioSet.stemma.test.ts
```

Expected result: All tests pass.

---

## Notes

This is a **good outcome** — Lina's validator fix is architecturally sound. The test just needs to catch up to the new (correct) behavior.

The validator now properly distinguishes:
- **Direct inputs** (Input-Text-Base, Input-Checkbox-Base) → `'input'` type → require `label`
- **Orchestration containers** (Input-Radio-Set, Input-Checkbox-Set) → `'container'` type → don't require `label` (they use `role` and children for semantics)

This prevents false positives on future Set/Group components.

— Thurgood
