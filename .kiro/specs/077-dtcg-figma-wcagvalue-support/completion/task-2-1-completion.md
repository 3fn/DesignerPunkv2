# Task 2.1 Completion: Add WCAG Mode to Semantics Collection

**Date**: 2026-03-13
**Spec**: 077 - DTCG & Figma wcagValue Support
**Task**: 2.1 - Add WCAG mode to Semantics collection
**Type**: Implementation
**Status**: Complete

---

## What Changed

In `src/generators/transformers/FigmaTransformer.ts`, `generateSemanticsCollection()`:
- Semantics collection modes: `['light', 'dark']` → `['light', 'dark', 'wcag']`
- Primitives collection unchanged: `['light', 'dark']`

## Verification

- Figma transformer tests: 51 passed, 0 failed
- Zero TypeScript diagnostics
