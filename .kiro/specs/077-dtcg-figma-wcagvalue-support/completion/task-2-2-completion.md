# Task 2.2 Completion: Replace Figma Guard Rail with Mode-Conditional Resolution

**Date**: 2026-03-13
**Spec**: 077 - DTCG & Figma wcagValue Support
**Task**: 2.2 - Replace Figma guard rail with mode-conditional resolution
**Type**: Implementation
**Status**: Complete

---

## What Changed

In `src/generators/transformers/FigmaTransformer.ts`, `extractVariablesFromGroup()`:
- Removed the `throw` guard rail for wcagValue
- Reads `$extensions.designerpunk.modes.wcag` from DTCG token
- If present and semantic, resolves alias and sets `valuesByMode.wcag`
- If absent, falls back to `valuesByMode.light` (Figma constraint: all variables need values for all modes)

## Verification

- Figma transformer tests: 51 passed, 0 failed
- `color.action.primary`: wcag → `teal/300` (different from light/dark `cyan/300`) ✅
- `color.text.default`: wcag → `gray/200` (fallback = light value) ✅
- Semantics modes: `['light', 'dark', 'wcag']` ✅
- Primitives modes: `['light', 'dark']` (unchanged) ✅
