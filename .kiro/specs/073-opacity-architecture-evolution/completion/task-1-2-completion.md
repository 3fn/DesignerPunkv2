# Task 1.2 Completion: Rename Opacity Primitives

**Date**: 2026-03-06
**Task**: 1.2 Rename opacity primitives
**Type**: Implementation
**Status**: Complete

---

## Artifacts Modified

| File | Changes | Type |
|------|---------|------|
| `src/tokens/OpacityTokens.ts` | 14 token keys + names renamed | Functional |
| `src/tokens/semantic/OpacityTokens.ts` | 4 primitive references updated | Functional |
| `src/tokens/semantic/ColorTokens.ts` | 1 primitive reference + 2 comments updated | Functional + Comment |
| `src/tokens/semantic/BlendTokens.ts` | 1 JSDoc example updated | Comment |
| `src/composition/OpacityComposition.ts` | 3 JSDoc examples updated | Comment |
| `src/composition/OpacityCompositionParser.ts` | 5 JSDoc examples updated | Comment |
| `src/providers/WebFormatGenerator.ts` | 3 JSDoc examples updated | Comment |
| `src/providers/iOSFormatGenerator.ts` | 3 JSDoc examples updated | Comment |
| `src/providers/AndroidFormatGenerator.ts` | 5 JSDoc examples updated | Comment |

## Rename Mapping Applied

| Old Name | New Name | Value |
|----------|----------|-------|
| opacity000 | opacity000 | 0.00 |
| opacity100 | opacity008 | 0.08 |
| opacity200 | opacity016 | 0.16 |
| opacity300 | opacity024 | 0.24 |
| opacity400 | opacity032 | 0.32 |
| opacity500 | opacity040 | 0.40 |
| opacity600 | opacity048 | 0.48 |
| opacity700 | opacity056 | 0.56 |
| opacity800 | opacity064 | 0.64 |
| opacity900 | opacity072 | 0.72 |
| opacity1000 | opacity080 | 0.80 |
| opacity1100 | opacity088 | 0.88 |
| opacity1200 | opacity096 | 0.96 |
| opacity1300 | opacity100 | 1.00 |

## Scope Deviation from Blast Radius Audit

The blast radius audit listed 14 source files / ~132 references. Actual scope was smaller:

**Files NOT requiring changes (audit overcounted):**
- `src/tokens/ShadowOpacityTokens.ts` — Uses semantic names (`shadowOpacityHard`, etc.), not 000–1300 scheme. Flagged to Peter, confirmed skip.
- `src/tokens/GlowOpacityTokens.ts` — Uses ordinal names (`glowOpacity100`–`glowOpacity400`) with different base value (0.8). Confirmed skip.
- `src/tokens/index.ts` — Imports `opacityTokens` object, not individual token names. No changes needed.
- `src/tokens/semantic/ShadowTokens.ts` — References `shadowOpacity*` tokens, not main opacity family.
- `src/generators/DTCGFormatGenerator.ts` — Uses imported objects dynamically, no hardcoded opacity names.
- `src/composition/OpacityCompositionParser.ts` — Validates via registry lookup, no hardcoded names in functional code (JSDoc only).

**Actual functional changes: 3 files, ~19 references. Comment/JSDoc changes: 6 files, ~20 references.**

## Implementation Details

Straightforward 1:1 mechanical rename. No logic changes. All values preserved exactly.

## Validation (Tier 2: Standard)

### Syntax Validation
- ✅ TypeScript compilation passes (`tsc --noEmit` — zero errors)

### Functional Validation
- ✅ 286 of 290 test suites pass
- ✅ 4 failing suites are all test files referencing old names (Task 1.7 scope):
  - `src/tokens/__tests__/OpacityTokens.test.ts`
  - `src/tokens/semantic/__tests__/OpacityTokens.test.ts`
  - `src/tokens/semantic/__tests__/ColorTokens.test.ts`
  - `src/providers/__tests__/PlatformOutputFormat.test.ts`
- ✅ Zero old-name references remain in non-test source files (verified via grep sweep)

### Requirements Compliance
- ✅ 1.1 — Three-digit zero-padded percentage names
- ✅ 1.2 — Same 14 values, no scale changes
- ✅ 1.3 — All source code references updated
- ✅ 1.5 — Shadow/glow opacity: confirmed different naming scheme, no rename needed (deviation documented, Peter approved)
- ✅ 1.7 — Historical docs not modified
