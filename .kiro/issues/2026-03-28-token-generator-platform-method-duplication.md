# TokenFileGenerator Platform Method Duplication

**Date**: 2026-03-28
**Severity**: Medium
**Agent**: Ada
**Found by**: Ada (motion token type mismatch investigation, Spec 086 Task 4.3 follow-up)

## Problem

`TokenFileGenerator` has three nearly identical methods — `generateWebTokens()`, `generateiOSTokens()`, `generateAndroidTokens()` — with copy-pasted filtering logic. When the web method received a motion category filter, iOS and Android didn't get it. This caused:

1. **Non-compilable code in generated output**: Easing tokens declared as `CGFloat`/`Float` but assigned cubic-bezier strings
2. **Wrong data class usage**: Android semantic motion tokens wrapped in `Typography()` instead of a motion-appropriate structure
3. **Duplicate declarations**: Motion tokens appeared twice — broken versions in the primitive/semantic pass, correct versions in the dedicated Motion Tokens section

The immediate bug was fixed (motion category filter added to all three methods, semantic motion filter added to all three), but the underlying duplication remains. The next category-specific filter will face the same copy-paste drift risk.

## Root Cause

Shared filtering logic is duplicated across three methods instead of centralized:

- **Primitive category exclusions**: `MOTION_CATEGORIES` filter defined independently in each method
- **Semantic name-prefix exclusions**: `!s.name.startsWith('zIndex.') && !s.name.startsWith('elevation.') && !s.name.startsWith('motion.')` repeated 6 times (light + dark in each method)
- **Token count reporting**: `getAllPrimitiveTokens().length` called independently in each return

## Recommended Fix

Extract shared filtering into single-source helpers that all three platform methods call:

1. A `getFilteredPrimitives()` method that applies all category exclusions once
2. A `getFilteredSemantics()` method that applies all name-prefix exclusions once
3. Both methods become the single place to update when new dedicated sections are added

This keeps the platform-specific generation logic in each method (that's legitimately different) while centralizing the filtering logic (that must stay in sync).

## Impact

- **Current risk**: Next token category requiring dedicated handling (like motion) will need manual updates to all three methods — easy to miss one
- **Scope**: `src/generators/TokenFileGenerator.ts` only — the platform builders (`iOSBuilder.ts`, `AndroidBuilder.ts`, `WebBuilder.ts`) are correctly separated
- **Test coverage**: `src/__tests__/integration/SemanticTokenGeneration.test.ts` has parallel filter duplication that should also be centralized

## Immediate Fix Applied

The motion token bug was fixed in the same session this issue was captured:

- Added `MOTION_CATEGORIES` filter to `generateiOSTokens()` and `generateAndroidTokens()` (matching existing web filter)
- Added `!s.name.startsWith('motion.')` to semantic filters in all three methods
- Updated `SemanticTokenGeneration.test.ts` to exclude motion tokens from generic semantic checks
- All 8041 tests passing

## Resolution

**Status**: ✅ Resolved
**Date**: 2026-03-29
**Resolved by**: Ada
**Commits**: `2a9483e6` (immediate fix), `2f9e15bb` (consolidation)

### Decision: Full Consolidation Over Minimal Filter Extraction

The issue doc originally recommended extracting `getFilteredPrimitives()` and `getFilteredSemantics()` helpers — the minimum change to eliminate filter drift. During discussion, Peter and Ada evaluated three options:

1. **Filter helpers only** — centralizes the filtering, leaves three ~120-line methods with identical structure
2. **Full consolidation** — single `generatePlatformTokens()` method, three public methods become one-line wrappers
3. **Do nothing beyond the immediate fix** — filters are now correct, accept the duplication risk

We went with option 2. The reasoning:

- **The duplication wasn't limited to filtering.** The primitive loop, semantic section call, motion section call, layering section call, WCAG block, and return structure were all identical across the three methods. Centralizing only the filters would leave the larger copy-paste structure intact — the same class of drift risk for any future change to the generation flow.
- **The actual per-platform differences are small and data-shaped.** File names, section comment strings, and WCAG placement (before vs after footer) are the only real differences. These map cleanly to a config object, not code branches.
- **Bottleneck concern was evaluated and dismissed.** Peter raised whether centralization could become a bottleneck if platforms diverge. Analysis showed the generation flow has been stable since inception — the only divergence was accidental (the missing filter). Platform-specific formatting is already properly delegated to the builder classes. The orchestration flow has no reason to diverge per-platform. If it ever does, a single method with a platform parameter is still easier to extend than three copies.
- **Test coverage is strong.** 8041 tests provide a safety net for the refactor. The risk of breaking something is low; the risk of future drift from duplication is higher.

### Changes

**Commit `2a9483e6` — Immediate fix (2026-03-28):**
- Added `MOTION_CATEGORIES` filter to `generateiOSTokens()` and `generateAndroidTokens()` (matching existing web filter)
- Added `!s.name.startsWith('motion.')` to semantic filters in all three methods
- Updated `SemanticTokenGeneration.test.ts` to exclude motion tokens from generic semantic checks

**Commit `2f9e15bb` — Consolidation (2026-03-29):**

`src/generators/TokenFileGenerator.ts`:
- Added `PLATFORM_CONFIG` static config mapping platform-specific strings (file names, section comments, WCAG placement)
- Added `DEDICATED_PRIMITIVE_CATEGORIES` and `DEDICATED_SEMANTIC_PREFIXES` as single-source filter definitions
- Added `getGenerationPrimitives()` and `filterGenerationSemantics()` helper methods
- Added `getGenerator()` to resolve platform → generator instance
- Added `generatePlatformTokens()` — the consolidated generation flow
- Added `maybeGenerateWcagBlock()` — extracted WCAG override logic
- Reduced `generateWebTokens()`, `generateiOSTokens()`, `generateAndroidTokens()` to one-line wrappers
- Net: 199 additions, 323 deletions (−124 lines)

`src/__tests__/integration/SemanticTokenGeneration.test.ts`:
- Added `DEDICATED_SEMANTIC_PREFIXES`, `DEDICATED_PRIMITIVE_CATEGORIES`, `getGenericSemantics()`, `getGenericPrimitives()` helpers
- Replaced three inline filter instances with helper calls

### What This Prevents

- Adding a new dedicated section (like motion) now requires updating `DEDICATED_PRIMITIVE_CATEGORIES` and/or `DEDICATED_SEMANTIC_PREFIXES` in one place — not three methods
- Platform-specific config (file names, comment formats, WCAG placement) is declared once in `PLATFORM_CONFIG`
- The generation flow (header → primitives → semantics → motion → layering → WCAG → footer) is defined once

### Verification

- All 8041 tests passing
- Generated output identical (web valid, iOS valid, Android valid; token counts match across platforms)
- No broken easing/motion patterns in generated output
