# Task 1.2 Completion: Implement binding-first translation (`translateByBinding`)

**Date**: February 19, 2026
**Task**: 1.2 Implement binding-first translation (`translateByBinding`)
**Spec**: 054b - Figma Design Extraction
**Organization**: spec-completion
**Scope**: 054b-figma-design-extract

## Summary

Implemented `translateByBinding()` with a reverse index strategy that correctly handles the non-trivial naming transforms applied during token push (054a).

## Key Discovery

The naive `figmaNameToTokenPath()` (slash → dot conversion) is insufficient for reverse lookup. During push, `FigmaTransformer.toFigmaVariableName` applies:
- Group prefix stripping: `space.space100` → Figma `space/100`
- Name/number splitting: `color.purple300` → Figma `color/purple/300`
- Semantic dot-to-slash: `color.feedback.success.text` → Figma `color/feedback/success/text`

The reverse (extraction) must undo these transforms.

## Implementation Approach

Built a `figmaToTokenIndex` (Map<string, string>) at construction time that:
1. Walks the entire DTCG token tree
2. Applies the same naming logic as `FigmaTransformer.toFigmaVariableName`
3. Maps each computed Figma variable name back to its DTCG token path

`translateByBinding()` uses this index as primary lookup, with naive slash-to-dot as fallback for manually created Figma variables.

## Private Helper Methods Added

- `buildFigmaToTokenIndex()` — Walks DTCG tree, builds reverse index
- `toFigmaVariableName()` — Mirrors FigmaTransformer naming logic
- `stripGroupPrefix()` — Removes group prefix from token keys
- `splitNameAndNumber()` — Splits alphabetic prefix from numeric suffix

## Validation

- All 329 test suites pass (8420 tests)
- Verified against real `dist/DesignTokens.dtcg.json`: 359 tokens indexed
- Confirmed correct reverse lookups: `space/100` → `space.space100`, `color/purple/300` → `color.purple300`
- No diagnostics issues

## Artifacts

- Modified: `src/figma/TokenTranslator.ts`
