# Color Token Migration: subtle → muted

**Date**: December 7, 2025
**Purpose**: Document migration from color.text.subtle to color.text.muted
**Scope**: TextInputField component
**Organization**: working-document

---

## Change Summary

Updated TextInputField component to use `color.text.muted` instead of `color.text.subtle` for secondary text elements (labels, helper text).

## Rationale

### Semantic Clarity
- **"Muted"** clearly communicates reduced emphasis/importance
- **"Subtle"** is ambiguous - could mean delicate, refined, or barely visible
- Better for AI collaboration - more unambiguous semantic meaning

### Text Hierarchy Alignment
Aligns with proposed three-level text hierarchy from Spec 015:
1. **color.text.default** (gray300) - Primary text, highest contrast
2. **color.text.muted** (gray200) - Secondary text, reduced emphasis
3. **color.text.subtle** (gray100) - Tertiary text, minimal emphasis (timestamps, metadata)

### Usage Context
TextInputField uses muted text for:
- Default label state (not focused)
- Helper text
- Info icon color

These are all **secondary emphasis** text, not tertiary/minimal.

## Files Updated

### Component Implementation
- `src/components/core/TextInputField/tokens.ts` - Token references
- `src/components/core/TextInputField/stateManagement.ts` - State logic and comments
- `src/components/core/TextInputField/platforms/web/TextInputField.web.ts` - Web CSS
- `src/components/core/TextInputField/platforms/ios/TextInputField.ios.swift` - iOS constants and usage
- `src/components/core/TextInputField/platforms/android/TextInputField.android.kt` - Android constants and usage

### Tests
- `src/components/core/TextInputField/__tests__/stateManagement.test.ts` - State management tests
- `src/components/core/TextInputField/__tests__/colorContrast.test.ts` - Color contrast tests

## Changes Made

### Token References
```typescript
// Before
labelDefault: 'color.text.subtle'
helperText: 'color.text.subtle'

// After
labelDefault: 'color.text.muted'
helperText: 'color.text.muted'
```

### Platform Constants
```typescript
// Before
colorTextSubtle

// After
colorTextMuted
```

### CSS Variables
```css
/* Before */
color: var(--color-text-subtle, #6B7280);

/* After */
color: var(--color-text-muted, #6B7280);
```

## Impact

### Breaking Changes
- None - This is a semantic token rename, not a value change
- The underlying color value (gray100 = #6B7280) remains the same
- Only the token name changes for clarity

### Future Work
When Spec 015 (Color Palette Update) is implemented:
- `color.text.muted` will map to gray200 (darker, better contrast)
- `color.text.subtle` will be reserved for gray100 (minimal emphasis)
- This migration positions TextInputField correctly for that update

## Validation

✅ All platform implementations updated consistently
✅ All tests updated to reflect new token name
✅ No syntax errors (getDiagnostics passed)
✅ Semantic meaning clearer for AI collaboration

## Next Steps

1. Monitor test results to ensure no regressions
2. When Spec 015 is implemented, verify gray200 meets 4.5:1 contrast
3. Consider migrating other components using `color.text.subtle` for secondary text

---

**Organization**: working-document
**Scope**: temporary
