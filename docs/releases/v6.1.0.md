# Release v6.1.0

**Date**: February 4, 2026
**Type**: Minor Release

---

## Summary

This release introduces the Chip component family - a set of compact, interactive elements for filtering, selection, and input. Also includes a bug fix for radius token collision.

---

## New Features

### Chip Component Family (Spec 045)

Three new components following the Stemma System architecture:

#### Chip-Base (Primitive)
- Compact interactive element with optional leading icon
- Token-based styling with 32px visual height, 48px tap area
- Full accessibility support (keyboard, screen reader)
- Cross-platform: Web, iOS, Android

#### Chip-Filter (Semantic)
- Toggle-based filter chip extending Chip-Base
- Selected/unselected states with checkmark icon
- `aria-pressed` accessibility support

#### Chip-Input (Semantic)
- Dismissible input chip extending Chip-Base
- Trailing X icon for dismiss action
- Accessible "Remove [label]" labeling

**Test Coverage**: 19 new tests across all chip components

---

## Bug Fixes

### Radius Token Collision Fix (Spec 055)

Fixed CSS variable naming collision where primitive `radiusFull` and semantic `radiusFull` both generated `--radius-full`, causing invalid self-referencing CSS.

**Before**: `--radius-full: var(--radius-full)` (invalid)
**After**: `--radius-full: var(--radius-max)` (valid)

Badge components now render proper pill shapes.

---

## Improvements

### Icon-Base Type Alignment

Updated `IconBaseSize` TypeScript type from `18` to `20` to match actual `icon.size075` token value (14px × 1.429 = 20px). This improves developer experience by making the API accurately reflect token values.

---

## Technical Details

### New Files
- `src/components/core/Chip-Base/` - Base primitive component
- `src/components/core/Chip-Filter/` - Filter semantic variant
- `src/components/core/Chip-Input/` - Input semantic variant
- `src/tokens/components/chip.ts` - Chip component token
- `.kiro/steering/Component-Family-Chip.md` - MCP documentation

### Modified Files
- `src/tokens/RadiusTokens.ts` - Primitive token rename (radiusFull → radiusMax)
- `src/tokens/semantic/RadiusTokens.ts` - Reference update
- `src/components/core/Icon-Base/types.ts` - Size type alignment
- `scripts/generate-platform-tokens.ts` - Chip token integration

---

## Upgrade Notes

No breaking changes. All existing APIs remain compatible.

---

## Contributors

- Peter Michaels Allen
- AI Collaboration (Kiro)
