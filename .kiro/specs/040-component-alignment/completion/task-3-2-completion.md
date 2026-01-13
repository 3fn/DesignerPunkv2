# Task 3.2 Completion: Update CSS Custom Property Naming

**Date**: 2026-01-13
**Spec**: 040 - Component Alignment
**Task**: 3.2 Update CSS custom property naming
**Status**: Complete
**Organization**: spec-completion
**Scope**: 040-component-alignment

---

## Summary

Renamed all `--vlbi-*` CSS custom properties to `--_vlbi-*` in the Button-VerticalListItem component to follow the established naming convention for component-scoped properties.

## Changes Made

### CSS File Updates
**File**: `src/components/core/Button-VerticalListItem/platforms/web/ButtonVerticalListItem.styles.css`

Renamed 21 CSS custom properties from `--vlbi-*` to `--_vlbi-*`:
- Focus ring tokens: `--_vlbi-focus-offset`, `--_vlbi-focus-width`, `--_vlbi-focus-color`
- Sizing tokens: `--_vlbi-min-height`, `--_vlbi-radius`, `--_vlbi-padding-inline`, `--_vlbi-gap`
- Typography tokens: `--_vlbi-label-font-size`, `--_vlbi-label-font-weight`, `--_vlbi-label-line-height`, `--_vlbi-description-font-size`, `--_vlbi-description-font-weight`, `--_vlbi-description-line-height`, `--_vlbi-description-color`
- Transition tokens: `--_vlbi-transition-duration`, `--_vlbi-transition-easing`
- State tokens (set via inline style): `--_vlbi-background`, `--_vlbi-border-width`, `--_vlbi-border-color`, `--_vlbi-padding-block`, `--_vlbi-label-color`, `--_vlbi-icon-color`

Added documentation comment explaining the naming convention:
```css
* Naming Convention: --_[abbrev]-* pattern signals component-scoped (internal) properties
* @see Requirements: 7.2, 7.4 - CSS custom property naming convention
```

### TypeScript File Updates
**File**: `src/components/core/Button-VerticalListItem/platforms/web/ButtonVerticalListItem.web.ts`

Updated `_updateDOM()` method to use new property names:
- `--_vlbi-background`
- `--_vlbi-border-width`
- `--_vlbi-border-color`
- `--_vlbi-padding-block`
- `--_vlbi-label-color`
- `--_vlbi-icon-color`

Note: `--_vlbi-hover-bg` and `--_vlbi-pressed-bg` already used the underscore prefix (added in Task 3.1).

### Test File Updates
Updated property references in test files:
- `ButtonVerticalListItem.integration.test.ts` - Updated 12 property references
- `ButtonVerticalListItem.properties.test.ts` - Updated 2 property references
- `rtlSupport.test.ts` - Updated 8 property references in comments

## Requirements Validated

- **7.2**: Button-VerticalListItem now uses `--_vlbi-*` prefix (migrated from `--vlbi-*`)
- **7.4**: Underscore prefix signals "internal/private" semantics for component-scoped properties

## Test Results

All 146 Button-VerticalListItem tests pass:
- `visualStateMapping.test.ts` - PASS
- `rtlSupport.test.ts` - PASS
- `ButtonVerticalListItem.failLoudly.test.ts` - PASS
- `ButtonVerticalListItem.integration.test.ts` - PASS
- `ButtonVerticalListItem.unit.test.ts` - PASS
- `ButtonVerticalListItem.properties.test.ts` - PASS

## Design Pattern Alignment

The `--_[abbrev]-*` naming convention is now consistent across all components:
- Button-CTA: `--_cta-*` ✅
- Button-VerticalListItem: `--_vlbi-*` ✅ (updated in this task)
- ButtonIcon: `--_bi-*` ✅ (updated in Task 1.7)
- Input-Text-Base: `--_itb-*` ✅

This convention clearly distinguishes component-internal properties from design system tokens.
