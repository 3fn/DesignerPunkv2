# Task 3.2 Completion: Update Button-Icon Contrast Token Consumption

**Date**: 2026-03-12
**Spec**: 076 — Primary Action Color Migration
**Task**: 3.2 — Update Button-Icon contrast token consumption
**Agent**: Lina
**Type**: Implementation
**Validation Tier**: Tier 2 — Standard

---

## Summary

Switched Button-Icon primary variant from `color.contrast.onDark` to `color.contrast.onAction` in CSS. Updated stemma test expectation.

## Changes

| File | Change |
|------|--------|
| `ButtonIcon.web.css` | `:host` mapping: `--_bi-color-contrast: var(--color-contrast-on-dark)` → `var(--color-contrast-on-action)`. Primary variant comment updated. |
| `ButtonIcon.stemma.test.ts` | Semantic token reference expectation: `var(--color-contrast-on-dark)` → `var(--color-contrast-on-action)` |

## Notes

- No JS changes needed — icon uses `color="inherit"` which picks up the CSS `color` property via `currentColor`
- Same behavioral change as Button-CTA: icon color flips from white to dark in Standard theme (correct for cyan background)

## Validation

- Build: clean (1.55 MB raw, 297.80 KB gzipped)
- Button-Icon tests: 5 suites, 121 tests, 0 failures
