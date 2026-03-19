# Release Notes — v10.0.1

**Date**: 2026-03-19
**Type**: Patch Release (pipeline fix, token additions, visual tuning)
**Specs**: 050 (Nav-TabBar-Base post-release fixes)
**Previous**: v10.0.0 (Rosetta Mode Architecture + Nav-TabBar-Base)

---

## Summary

Patch release fixing a broken token generation pipeline, adding two spacing tokens, and tuning Nav-TabBar-Base visuals. The pipeline fix is critical — `generateTokenFiles()` failed to register semantic tokens before override validation, breaking mode-aware generation for any consumer running the pipeline post-v10.

---

## Token Pipeline Fix

- **Semantic token registration**: `generateTokenFiles()` now registers semantic tokens with the registry before running `SemanticOverrideResolver` validation. Without this, the Spec 080 mode-aware generation would fail at runtime.
- **Pipeline unification**: `generate-platform-tokens.ts` now delegates to the unified `generateTokenFiles()` orchestration instead of calling `generator.generateAll()` directly, which bypassed mode-aware resolution entirely.

## Spacing Token Changes

- **Added `space700`** (56px, 7× base) — gradient dimensions and large component sizing
- **Promoted `space800`** (64px, 8× base) — full token definition added to `SpacingTokens.ts` (was in constants only)
- **Removed `space1000`** (80px, 10× base) — removed from spacing family (Ada approved)
- **Updated `Token-Family-Spacing.md`** steering doc to reflect new family composition
- Formula validation tests added for both new tokens

## Nav-TabBar-Base Visual Tuning

- **Browser bundle registration**: Added `NavTabBarBase` to `browser-entry.ts` (import, safeDefine, export)
- **Component export**: Added web component export from component `index.ts`
- **Visual tuning**: Gradient background (4-stop translucency), active-only glow (tighter ellipse), tab min-height (`space600`), padding adjustments, dot positioning via `getBoundingClientRect`
- **Animation timing**: Dot glides immediately, depart at 16%, arrive at 50%
- **Stacking context**: Added `isolation: isolate` on tab items for glow stacking
- **Demo fixes**: `whenDefined` timing, position overrides, color-scheme, scrollable viewport
- **Filed issue**: iOS/Android visual parity tracked in `.kiro/issues/`

---

## Test Suite

| Metric | v10.0.0 | v10.0.1 |
|--------|---------|---------|
| Test suites | 306 | 306 |
| Tests | 7,963 | 7,965 (+2) |

---

## What Changed from Previous Version

1. ✅ **Fixed** Token pipeline: semantic token registration before override validation
2. ✅ **Fixed** Pipeline script: unified to use `generateTokenFiles()` orchestration
3. ✅ **Fixed** Nav-TabBar-Base browser bundle registration (missing from v10.0.0)
4. ✅ **Added** `space700` spacing token (56px, 7× base)
5. ✅ **Added** `space800` full token definition (64px, 8× base)
6. ✅ **Removed** `space1000` from spacing family
7. ✅ **Updated** Nav-TabBar-Base visual tuning (gradient, glow, animation timing)
8. ✅ **Updated** Nav-TabBar-Base demo page
9. ✅ **Updated** Token-Family-Spacing steering doc
