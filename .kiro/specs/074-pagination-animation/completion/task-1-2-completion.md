# Task 1.2 Completion: Fix Token Pipeline Build Integration

**Date**: 2026-03-07
**Spec**: 074 — Pagination Animation
**Task**: 1.2 — Fix token pipeline build integration
**Status**: ✅ Complete
**Agent**: Ada (token pipeline)
**Validation**: Tier 2 — Standard

---

## Problem

Two issues caused stale platform tokens during development:

1. `generate-platform-tokens.ts` was not wired into `npm run build` — platform token regeneration was entirely manual.
2. `build-browser-bundles.js` preferred `output/` (stale, legacy) over `dist/` (canonical generation target) when sourcing CSS for the browser demo.

Root cause: `output/` was the original generation target. When generation migrated to `dist/`, the build script added `dist/` as fallback (commit `3fd1ac77`) but never flipped the priority.

## Changes

### 1. `package.json`
- Added `"generate:platform-tokens": "ts-node scripts/generate-platform-tokens.ts"`
- Updated `"prebuild"` from `"npm run generate:types"` to `"npm run generate:types && npm run generate:platform-tokens"`

### 2. `scripts/build-browser-bundles.js`
- Flipped `possibleDesignTokenSources` array: `dist/` entries first, `output/` entries as legacy fallback
- Flipped `possibleComponentTokenSources` array: same reorder
- Updated comment from "output/ (primary), dist/ (fallback)" to "dist/ (canonical generation target), output/ (legacy fallback)"

## Validation

- `npm run build` completes successfully — platform tokens regenerated automatically during prebuild
- Browser demo `tokens.css` contains fresh tokens from `dist/` (verified: `var(--space-200)` references, `color.scrim.standard` present)
- Full test suite: 291 suites, 7457 tests, all passing
