# Task 1.3 Completion: Implement value-based translation (`translateByValue`)

**Date**: February 19, 2026
**Spec**: 054b - Figma Design Extraction
**Task**: 1.3 - Implement value-based translation
**Type**: Implementation
**Validation**: Tier 2 - Standard
**Organization**: spec-completion
**Scope**: 054b-figma-design-extract

---

## Summary

Replaced the `translateByValue` stub in `TokenTranslator` with a full implementation that matches raw Figma values to DesignerPunk DTCG tokens using category-specific tolerance rules.

## What Was Implemented

### Value Index (built at construction time)
- `buildValueIndex()` walks the DTCG token tree and categorises leaf tokens by family
- Maps token families to categories: spacing, color, typography (fontSize), radius
- Stores numeric values for dimension tokens and parsed RGB for color tokens
- `familyToCategory()` maps DTCG family/type metadata to `TokenCategory`

### Color Matching (CIELAB ΔE < 3)
- `parseRgba()` — parses `rgba(r, g, b, a)` strings from DTCG token values
- `parseHex()` — parses `#RGB`, `#RRGGBB`, `#RRGGBBAA` hex strings from Figma
- `rgbToLab()` — converts RGB to CIELAB via XYZ (D65 illuminant)
- `deltaE()` — CIE76 color difference calculation
- `matchColor()` — finds closest color token within ΔE < 3 tolerance

### Dimension Matching (±2px spacing, ±1px font/radius)
- `parseDimension()` — extracts numeric value from dimension strings like "24px"
- `matchDimension()` — finds closest dimension token within tolerance
- Spacing tolerance: ±2px
- Typography (fontSize) and radius tolerance: ±1px

### Result Structure
- Exact matches: `confidence: 'exact'`, no delta
- Approximate matches: `confidence: 'approximate'`, delta included (e.g., `±1px`, `ΔE 2.1`)
- No match: `confidence: 'no-match'`, suggestion of closest token with delta

### Exports
- Color utilities (`parseRgba`, `parseHex`, `rgbToLab`, `deltaE`) exported from `src/figma/index.ts` for downstream use and testing

## Artifacts Modified
- `src/figma/TokenTranslator.ts` — Full `translateByValue` implementation with supporting utilities
- `src/figma/index.ts` — Added color utility exports

## Validation
- All 284 existing figma tests pass (no regressions)
- Zero diagnostics on modified files

## Requirements Addressed
- Req 2: TokenTranslator value-based matching with tolerance rules
