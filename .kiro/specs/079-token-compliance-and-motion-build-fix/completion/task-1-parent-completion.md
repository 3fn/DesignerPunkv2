# Task 1 Parent Completion: Category Migration, Duplicate Elimination & Generator Fix

**Date**: 2026-03-14
**Task**: 1 — Category Migration, Duplicate Elimination & Generator Fix
**Type**: Parent
**Validation Tier**: Tier 3 — Comprehensive
**Status**: Complete

---

## Success Criteria Verification

| Criterion | Status |
|---|---|
| `DURATION` and `SCALE` categories exist in `TokenCategory` enum | ✅ |
| All duration and scale tokens use correct categories | ✅ 3 duration + 6 scale migrated |
| Browser CSS output has zero duplicate motion token declarations | ✅ Verified in `dist/browser/tokens.css` |
| Android generator outputs `Dp` for all dimensional token families | ✅ spacing, radius, tapArea, fontSize, borderWidth |
| All existing tests pass | ✅ 300/301 suites pass (1 pre-existing TokenCompliance failure — Task 2/3 scope) |

## Subtask Summary

### 1.1 — Add DURATION and SCALE to TokenCategory enum
- Added `DURATION = 'duration'` and `SCALE = 'scale'` to `src/types/PrimitiveToken.ts`

### 1.2 — Migrate duration and scale token categories
- `DurationTokens.ts`: 3 tokens `SPACING` → `DURATION`
- `ScaleTokens.ts`: 6 tokens `SPACING` → `SCALE`
- `src/tokens/index.ts`: added `DURATION` and `SCALE` to `allTokens` map
- Updated 6 test assertions across 2 test files + 1 test fixture

### 1.3 — Filter motion tokens from primitive pass
- `TokenFileGenerator.generateWebTokens()`: filter `EASING`, `DURATION`, `SCALE` from primitive loop
- Fixed `tokenCount` to use `getAllPrimitiveTokens().length` (motion tokens still output in motion section)
- Eliminated duplicate `--duration-*` declarations in browser CSS

### 1.4 — Fix Android generator type inconsistency
- `AndroidFormatGenerator`: spacing, radius, tapArea, fontSize, borderWidth now output `val name = N.dp` (Dp type) instead of `const val name: Float = Nf`
- Updated 4 test assertions in `FormatProviders.test.ts`
- Regenerated `dist/DesignTokens.android.kt` and `dist/android/DesignTokens.android.kt`

## Artifacts Modified

- `src/types/PrimitiveToken.ts` — TokenCategory enum
- `src/tokens/DurationTokens.ts` — category migration
- `src/tokens/ScaleTokens.ts` — category migration
- `src/tokens/index.ts` — allTokens map
- `src/generators/TokenFileGenerator.ts` — motion token filter in generateWebTokens()
- `src/providers/AndroidFormatGenerator.ts` — Dp type for dimensional families
- `src/tokens/__tests__/MotionTokens.test.ts` — updated assertions
- `src/tokens/__tests__/MotionTokens.property.test.ts` — updated assertions
- `src/validators/__tests__/ThreeTierValidator.test.ts` — updated fixture
- `src/providers/__tests__/FormatProviders.test.ts` — updated assertions
- `dist/DesignTokens.android.kt` — regenerated
- `dist/android/DesignTokens.android.kt` — regenerated
- `dist/browser/tokens.css` — regenerated (via build:browser)

## Validation

- Full suite: 301 suites, 7820 tests, 1 pre-existing failure
- Pre-existing failure: `TokenCompliance.test.ts` (21 violations — Tasks 2 and 3 scope)
- Zero new failures introduced across all 4 subtasks
