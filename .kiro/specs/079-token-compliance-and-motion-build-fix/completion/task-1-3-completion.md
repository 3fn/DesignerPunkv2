# Task 1.3 Completion: Filter Motion Tokens from Primitive Pass

**Date**: 2026-03-14
**Task**: 1.3 Filter motion tokens from primitive pass
**Type**: Implementation
**Validation Tier**: Tier 2 — Standard
**Status**: Complete

---

## Artifacts Modified

- `src/generators/TokenFileGenerator.ts` — Added category filter in `generateWebTokens()` excluding `EASING`, `DURATION`, `SCALE` from primitive loop; fixed `tokenCount` to use `getAllPrimitiveTokens().length` (motion tokens are still output in the motion section)

## Implementation Notes

The primitive pass in `generateWebTokens()` iterated all primitive tokens including motion tokens, producing unitless declarations (e.g., `--duration-150: 150;`). The motion section then output the same tokens with proper units (e.g., `--duration-150: 150ms;`), creating duplicates.

Fix: filter tokens with motion categories (`EASING`, `DURATION`, `SCALE`) from the primitive loop using a `Set` for O(1) lookup. Motion tokens continue to be output exclusively by `generateMotionSection()`.

The `tokenCount` on the `GenerationResult` was updated to use `getAllPrimitiveTokens().length` (203) instead of the filtered `tokens.length` (190), since all 203 primitives are still present in the output — just in different sections.

## Verification

Browser CSS `dist/browser/tokens.css` after rebuild:
- `--duration-150` declared once (line 801, `150ms`) — previously declared twice
- `--duration-250` declared once — previously declared twice
- `--duration-350` declared once — previously declared twice
- All easing and scale tokens: single declaration each in motion section
- Zero unitless motion token declarations in primitive section

## Validation

- All generator tests pass (TokenFileGenerator, Breakpoint, GridSpacing, Accessibility)
- All integration tests pass (BuildSystemIntegration, SemanticTokenGeneration)
- All motion token tests pass
- 2 pre-existing failures remain (TokenCompliance violations, NavSegmentedChoice visual)
- Zero new failures introduced
