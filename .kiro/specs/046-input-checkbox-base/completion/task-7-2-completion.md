# Task 7.2 Completion: Audit token-completeness.property.test.ts Failures

**Date**: February 6, 2026
**Task**: 7.2 Audit token-completeness.property.test.ts failures
**Status**: Complete
**Organization**: spec-completion
**Scope**: 046-input-checkbox-base

---

## Summary

Audited the token-completeness.property.test.ts failures to identify browser bundle token reference issues. Found 4 missing tokens in the ESM and UMD bundles, with 2 categories of root causes.

---

## Test Failure Analysis

### Test Results

```
FAIL src/__tests__/browser-distribution/token-completeness.property.test.ts
  Property 1: Token CSS Completeness
    Browser Bundle Token References
      ✕ all token references in ESM bundle should exist in tokens.css
      ✕ all token references in UMD bundle should exist in tokens.css

Missing tokens in ESM bundle: [
  'color-badge-notification-background',
  'color-badge-notification-text',
  'color-contrast-on-primary',
  'color-error-strong'
]
```

---

## Root Cause Analysis

### Category 1: Component Tokens Not in CSS Generation Pipeline

**Missing Tokens:**
- `--color-badge-notification-background`
- `--color-badge-notification-text`

**Root Cause:**
Badge-Count-Notification component tokens are defined in `src/components/core/Badge-Count-Notification/tokens.ts` but are NOT imported in `scripts/generate-platform-tokens.ts`. The token generation script only imports:
- Button-Icon tokens
- Button-VerticalList-Item tokens
- Avatar tokens
- Badge-Label-Base tokens

**Evidence:**
```typescript
// scripts/generate-platform-tokens.ts lines 18-22
import '../src/components/core/Button-Icon/buttonIcon.tokens';
import '../src/components/core/Button-VerticalList-Item/Button-VerticalList-Item.tokens';
import '../src/components/core/Avatar/avatar.tokens';
import '../src/components/core/Badge-Label-Base/tokens';
// Note: Badge-Count-Notification tokens NOT imported
```

**Component Usage:**
The Badge-Count-Notification component CSS (`BadgeCountNotification.styles.css`) references these tokens:
```css
background-color: var(--color-badge-notification-background);
color: var(--color-badge-notification-text);
```

**Recommended Fix:**
Add import to `scripts/generate-platform-tokens.ts`:
```typescript
import '../src/components/core/Badge-Count-Notification/tokens';
```

---

### Category 2: Incorrect Token Names in Checkbox CSS

**Missing Tokens:**
- `--color-contrast-on-primary`
- `--color-error-strong`

**Root Cause:**
Input-Checkbox-Base and Input-Checkbox-Legal CSS files reference token names that don't exist in the token system. These appear to be legacy token names that were renamed in Spec 052 (semantic token naming restructure).

**Evidence - InputCheckboxBase.web.css:**
```css
/* Line 210 - INCORRECT */
.checkbox__box icon-base {
  color: var(--color-contrast-on-primary);
}

/* Line 247 - INCORRECT */
.checkbox--error .checkbox__box {
  border-color: var(--color-error-strong);
}
```

**Evidence - InputCheckboxLegal.web.css:**
```css
/* Line 159 - INCORRECT */
.checkbox__box icon-base {
  color: var(--color-contrast-on-primary);
}

/* Line 181 - INCORRECT */
.checkbox--error .checkbox__box {
  border-color: var(--color-error-strong);
}
```

**Correct Token Names (from tokens.css):**
```css
--color-contrast-on-light: var(--black-500);
--color-contrast-on-dark: var(--white-100);
--color-feedback-error-text: var(--pink-400);
--color-feedback-error-background: var(--pink-100);
--color-feedback-error-border: var(--pink-400);
```

**Token Mapping:**
| Incorrect Token | Correct Token | Reasoning |
|-----------------|---------------|-----------|
| `--color-contrast-on-primary` | `--color-contrast-on-dark` | Icon on filled checkbox background (dark) |
| `--color-error-strong` | `--color-feedback-error-border` | Error state border color |

**Recommended Fix:**
Update CSS files to use correct token names:
1. Replace `var(--color-contrast-on-primary)` with `var(--color-contrast-on-dark)`
2. Replace `var(--color-error-strong)` with `var(--color-feedback-error-border)`

---

## Token Generation Pipeline Verification

### Current Pipeline Output

```
output/DesignTokens.web.css - Contains 554 token definitions
```

### Tokens Present in tokens.css

**Contrast tokens:**
- `--color-contrast-on-light: var(--black-500);`
- `--color-contrast-on-dark: var(--white-100);`

**Error tokens:**
- `--color-feedback-error-text: var(--pink-400);`
- `--color-feedback-error-background: var(--pink-100);`
- `--color-feedback-error-border: var(--pink-400);`

**Badge tokens:**
- NOT present (component tokens not in generation pipeline)

---

## Recommended Fix Approach

### Fix 1: Add Badge-Count-Notification to Token Generation

**File:** `scripts/generate-platform-tokens.ts`

**Change:**
```typescript
// Add import for Badge-Count-Notification tokens
import '../src/components/core/Badge-Count-Notification/tokens';
```

**Impact:** Will generate `--color-badge-notification-background` and `--color-badge-notification-text` in ComponentTokens.web.css

### Fix 2: Update Checkbox CSS Token References

**Files:**
- `src/components/core/Input-Checkbox-Base/platforms/web/InputCheckboxBase.web.css`
- `src/components/core/Input-Checkbox-Legal/platforms/web/InputCheckboxLegal.web.css`

**Changes:**
1. Replace `var(--color-contrast-on-primary)` → `var(--color-contrast-on-dark)`
2. Replace `var(--color-error-strong)` → `var(--color-feedback-error-border)`

**Impact:** Will resolve 2 of the 4 missing token errors

---

## Relationship to Task 1 (Token Foundation)

Task 1 created the `inset.075` semantic token and verified platform token generation. However, the token-completeness test failures are unrelated to Task 1 work:

1. **Badge tokens** - Pre-existing issue from Badge-Count-Notification component (Spec 044)
2. **Checkbox tokens** - Implementation error in checkbox CSS using legacy token names

The `inset.075` token created in Task 1 is correctly generated and present in tokens.css:
```css
--space-inset-075: var(--space-075);
```

---

## Summary of Findings

| Token | Status | Root Cause | Fix Location |
|-------|--------|------------|--------------|
| `color-badge-notification-background` | Missing | Not in generation pipeline | `scripts/generate-platform-tokens.ts` |
| `color-badge-notification-text` | Missing | Not in generation pipeline | `scripts/generate-platform-tokens.ts` |
| `color-contrast-on-primary` | Wrong name | Legacy token name | Checkbox CSS files |
| `color-error-strong` | Wrong name | Legacy token name | Checkbox CSS files |

---

## Decision Required

**Question for Task 7.4:** Should we:
1. **Fix implementation** - Update CSS to use correct token names and add badge tokens to generation
2. **Update design doc** - Document the actual token names being used (not recommended - tokens don't exist)

**Recommendation:** Fix implementation (Option 1) - The tokens referenced don't exist in the token system, so the CSS must be updated to use the correct token names.
