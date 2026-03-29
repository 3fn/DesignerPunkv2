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
