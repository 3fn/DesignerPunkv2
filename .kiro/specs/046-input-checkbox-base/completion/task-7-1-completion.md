# Task 7.1 Completion: Audit InputCheckboxBase.stemma.test.ts Failure

**Date**: February 6, 2026
**Task**: 7.1 Audit InputCheckboxBase.stemma.test.ts failure
**Status**: Complete
**Organization**: spec-completion
**Scope**: 046-input-checkbox-base

---

## Summary

Audited the token naming mismatch between the stemma test expectations and the actual CSS implementation. The test expects deprecated token names that were replaced in Spec 052 (Semantic Token Naming Implementation).

---

## Token Naming Mismatch Analysis

### Test Expectations (Outdated)

The test at line 234-237 expects these token patterns:
```typescript
const expectedTokenPatterns = [
  '--color-select-not-selected-strong',  // ❌ Deprecated
  '--color-select-selected-strong',       // ❌ Deprecated
  '--color-error-strong',                 // ❌ Deprecated
  // ... other tokens
];
```

### CSS Implementation (Correct)

The CSS uses the new Rosetta System token naming convention:
```css
/* Unchecked border */
border: var(--border-emphasis) solid var(--color-feedback-select-border-default);

/* Checked/Indeterminate background */
background-color: var(--color-feedback-select-background-rest);
border-color: var(--color-feedback-select-border-rest);

/* Error state */
border-color: var(--color-error-strong);  /* This one is correct */
```

### Token Mapping (Spec 052)

Per Spec 052 (Semantic Token Naming Implementation), the following token renames occurred:

| Old Token Name | New Token Name | Purpose |
|----------------|----------------|---------|
| `--color-select-selected-strong` | `--color-feedback-select-text-rest` | Foreground color for selected state |
| `--color-select-selected-subtle` | `--color-feedback-select-background-rest` | Background fill for selected state |
| `--color-select-not-selected-strong` | `--color-feedback-select-border-default` | Border color for unselected state |

### Verification: tokens.css

Confirmed the current tokens in `dist/browser/tokens.css`:
```css
--color-feedback-select-text-rest: var(--cyan-400);
--color-feedback-select-text-default: var(--gray-200);
--color-feedback-select-background-rest: var(--cyan-100);
--color-feedback-select-background-default: var(--gray-100);
--color-feedback-select-border-rest: var(--cyan-400);
--color-feedback-select-border-default: var(--gray-200);
```

The old token names (`--color-select-selected-strong`, `--color-select-not-selected-strong`) **do not exist** in the current token system.

---

## Root Cause

The stemma test was written before or without awareness of Spec 052's token naming changes. The test expects the old `color.select.*` naming convention, but the CSS implementation correctly uses the new `color.feedback.select.*` convention.

---

## Recommended Fix: Update Test

**Decision**: Update the test to use the correct token names.

**Rationale**:
1. The CSS implementation is correct per Rosetta System and Spec 052
2. The old token names no longer exist in `tokens.css`
3. The test should validate against the actual token system, not deprecated names

### Required Test Changes

Update `InputCheckboxBase.stemma.test.ts` line 234-237:

**Before (Incorrect)**:
```typescript
const expectedTokenPatterns = [
  '--color-select-not-selected-strong',
  '--color-select-selected-strong',
  '--color-error-strong',
  // ...
];
```

**After (Correct)**:
```typescript
const expectedTokenPatterns = [
  '--color-feedback-select-border-default',    // Unchecked border
  '--color-feedback-select-background-rest',   // Checked background
  '--color-feedback-select-border-rest',       // Checked border
  '--color-error-strong',                      // Error state (unchanged)
  // ...
];
```

---

## Related Documentation

- **Spec 052**: `.kiro/specs/052-semantic-token-naming-implementation/` - Token naming changes
- **Design Doc**: `.kiro/specs/046-input-checkbox-base/design.md` - Token Architecture section
- **CSS Implementation**: `src/components/core/Input-Checkbox-Base/platforms/web/InputCheckboxBase.web.css`

---

## Validation

- [x] Identified token naming mismatch
- [x] Verified which token names are correct per Rosetta System
- [x] Documented recommended fix (update test)
- [x] Confirmed CSS implementation uses correct tokens
