# Task 1.1 Completion: Update Container-Base Schema with New Props

**Date**: January 21, 2026
**Task**: 1.1 Update Container-Base schema with new props
**Type**: Setup
**Validation**: Tier 1 - Minimal
**Organization**: spec-completion
**Scope**: 043-container-card-base

---

## Summary

Updated Container-Base schema to add directional padding props (paddingVertical, paddingHorizontal, paddingBlockStart, paddingBlockEnd, paddingInlineStart, paddingInlineEnd) and borderColor prop, with documented override hierarchy.

---

## Changes Made

### File Modified
- `src/components/core/Container-Base/Container-Base.schema.yaml`

### New Properties Added

| Property | Type | Description |
|----------|------|-------------|
| `paddingVertical` | `'none' \| '050' \| '100' \| '150' \| '200' \| '300' \| '400'` | Block-axis padding (top/bottom) |
| `paddingHorizontal` | `'none' \| '050' \| '100' \| '150' \| '200' \| '300' \| '400'` | Inline-axis padding (left/right in LTR) |
| `paddingBlockStart` | `'none' \| '050' \| '100' \| '150' \| '200' \| '300' \| '400'` | Block-start edge padding |
| `paddingBlockEnd` | `'none' \| '050' \| '100' \| '150' \| '200' \| '300' \| '400'` | Block-end edge padding |
| `paddingInlineStart` | `'none' \| '050' \| '100' \| '150' \| '200' \| '300' \| '400'` | Inline-start edge padding |
| `paddingInlineEnd` | `'none' \| '050' \| '100' \| '150' \| '200' \| '300' \| '400'` | Inline-end edge padding |
| `borderColor` | `ColorTokenName` | Border color token |

### Override Hierarchy Documented

The padding override hierarchy (highest to lowest priority):
1. Individual edges (paddingBlockStart, paddingBlockEnd, paddingInlineStart, paddingInlineEnd)
2. Axis props (paddingVertical, paddingHorizontal)
3. Uniform padding (padding prop)

### Contracts Updated

- **applies_padding**: Updated to document three-level padding control with override hierarchy and CSS logical properties for web
- **applies_border**: Updated to document borderColor behavior (defaults to color.border.default when undefined)

### Tokens Updated

Added specific border color tokens to the tokens section:
- `color.border.default`
- `color.border.subtle`
- `color.border.emphasis`

---

## Requirements Addressed

| Requirement | Status |
|-------------|--------|
| 1.1 paddingVertical applies to block-start/end | ✅ Schema defined |
| 1.2 paddingHorizontal applies to inline-start/end | ✅ Schema defined |
| 1.3 paddingBlockStart applies to block-start only | ✅ Schema defined |
| 1.4 paddingBlockEnd applies to block-end only | ✅ Schema defined |
| 1.5 paddingInlineStart applies to inline-start only | ✅ Schema defined |
| 1.6 paddingInlineEnd applies to inline-end only | ✅ Schema defined |
| 1.7 Axis props override uniform padding | ✅ Documented in schema |
| 1.8 Individual edge props override axis props | ✅ Documented in schema |
| 1.9 Uniform padding applies to all sides | ✅ Documented in schema |
| 1.10 Web uses CSS logical properties | ✅ Documented in schema |
| 2.1 borderColor applies specified color token | ✅ Schema defined |
| 2.2 borderColor has no effect when border is 'none' | ✅ Documented in schema |
| 2.3 Default border color is color.border.default | ✅ Documented in schema |

---

## Next Steps

Task 1.2: Implement directional padding in Container-Base (Web) - will implement the actual TypeScript code for the web component.
