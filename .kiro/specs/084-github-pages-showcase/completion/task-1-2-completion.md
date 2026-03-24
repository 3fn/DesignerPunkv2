# Task 1.2 Completion: Set Up Token Dogfooding

**Date**: 2026-03-24
**Task**: 1.2 Set up token dogfooding
**Type**: Setup
**Status**: Complete

---

## Artifacts Created

- `docs/tokens.css` — DesignerPunk CSS custom properties (942 lines, 45,680 bytes), copied from `dist/browser/tokens.css`

## Implementation Details

### Approach

Copied the generated token CSS file from the build output (`dist/browser/tokens.css`) to `docs/tokens.css`. Verified byte-identical copy via `diff`. The layout reference (`<link rel="stylesheet" href="{{ '/tokens.css' | relative_url }}">`) was already in place from Task 1.1.

### Key Decisions

- **Copied from `dist/browser/tokens.css`**, not `demos/tokens.css` — the demos file is a symlink to `dist/browser/tokens.css`. Using the actual source avoids symlink ambiguity and establishes the correct refresh path.
- Updated spec docs (design.md, requirements.md, tasks.md) to reflect the correct source path. Feedback doc and design-outline left as historical records.

### Token Name Validation

Validated the CSS example token names from design.md against actual generated output:
- `--font-family-display` ✅
- `--space-600` ✅ (value: `48px` — units baked in, no `calc()` needed)
- `--color-surface-primary` ❌ → corrected to `--color-structure-surface-primary` in design.md

### Spec Doc Updates

- **design.md**: Fixed token name in CSS example, corrected source path references (3 locations), updated correctness property #4
- **requirements.md**: Fixed Req 8 AC 8.2 source path
- **tasks.md**: Clarified Task 1.2 copy source, fixed Token Refresh Procedure (2 locations)

## Validation

- Tier 1 (Minimal): Artifact exists, byte-identical to source, layout references it correctly

## Requirements Compliance

- **Req 8.1**: `docs/tokens.css` contains DesignerPunk CSS custom properties ✅
- **Req 8.2**: File copied from `dist/browser/tokens.css` (generation source) ✅
