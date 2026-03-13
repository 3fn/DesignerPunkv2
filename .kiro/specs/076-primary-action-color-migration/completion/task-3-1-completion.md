# Task 3.1 Completion: Update Button-CTA Contrast Token Consumption

**Date**: 2026-03-12
**Spec**: 076 — Primary Action Color Migration
**Task**: 3.1 — Update Button-CTA contrast token consumption
**Agent**: Lina
**Type**: Implementation
**Validation Tier**: Tier 2 — Standard

---

## Summary

Switched Button-CTA filled variant from `color.contrast.onDark` to `color.contrast.onAction` in both CSS and JS.

## Changes

| File | Change |
|------|--------|
| `ButtonCTA.web.css` | `.button-cta--primary` color: `var(--color-contrast-on-dark)` → `var(--color-contrast-on-action)` |
| `ButtonCTA.web.ts` | `_calculateBlendColors()`: reads `--color-contrast-on-action` instead of `--color-contrast-on-dark`, variable renamed `onDarkColor` → `onActionColor`, error message updated, comments updated |

## Behavioral Impact

Filled button text color changes per theme:
- Standard: white (onDark/white100) → dark (onAction/black500) — correct for cyan background
- WCAG: white (onDark/white100) → white (onAction/white100) — no visible change

## Validation

- Build: clean (1.55 MB raw, 297.75 KB gzipped)
- Button-CTA tests: 4 suites, 97 tests, 0 failures
- Full suite: 293 passed, 1 pre-existing failure (mcp-component-integration — "Badges & Tags" routing table, unrelated)
- `color.contrast.onDark` NOT removed — other components still consume it
