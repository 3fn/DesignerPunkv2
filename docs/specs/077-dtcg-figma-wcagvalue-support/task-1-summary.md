# Task 1 Summary: DTCG Export — Modes Extension

**Spec**: 077 — DTCG & Figma wcagValue Support
**Date**: 2026-03-13

## Changes

- Replaced DTCG wcagValue guard rail (throw + try/catch skip) with `$extensions.designerpunk.modes` generation
- Tokens with `wcagValue` emit `modes.wcag` with alias syntax (or resolved RGBA when `resolveAliases` is true)
- Tokens without `wcagValue` have no `modes` key
- `DesignerPunkExtensions` interface extended with `modes?: Record<string, string>`
- `dist/DesignTokens.dtcg.json` regenerated: 61 semantic color tokens present, 7 with modes.wcag

## Impact

- DTCG file is no longer stale — semantic color tokens fully represented
- Schema is extensible to future modes (high-contrast, reduced-motion) without structural changes
- Migration-compatible with DTCG native `$modes` proposal (#210)
