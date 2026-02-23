# Task 3 Completion: Fix Fill Opacity Extraction

**Date**: 2026-02-22
**Task**: 3. Fix fill opacity extraction in classifyNodeTokens
**Type**: Bug Fix
**Validation**: Tier 2 - Standard
**Organization**: spec-completion
**Scope**: 054d-hierarchical-design-extraction

## Summary

Fixed fill opacity extraction in two locations: `classifyNodeTokens` and `collectBoundVariableIds`. Both were reading `color.a` (the alpha channel on the color object) but ignoring `fill.opacity` (Figma's separate fill-level opacity). A fill with `#000` at 80% opacity was producing `rgba(0, 0, 0, 1)` instead of `rgba(0, 0, 0, 0.8)`.

## Fix

Changed `const a = color.a ?? 1;` to `const a = (color.a ?? 1) * ((fill.opacity as number) ?? 1);` in both locations.

## Artifacts Modified

- `src/figma/DesignExtractor.ts` — Two lines changed (lines 1234 and 1438)

## Test Results

512 tests passing across 31 figma/CLI test suites, 0 regressions.

## Discovery

Found during manual validation of Progress/Pagination extraction. A designer-applied `#000` at 80% opacity was incorrectly classified as `semanticColor.color.contrast.onLight` (exact match to `color.black500` at full opacity) instead of being flagged as Unidentified.
