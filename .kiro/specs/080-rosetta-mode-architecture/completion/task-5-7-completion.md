# Task 5.7 Completion: Remove Generator Self-Fetch Fallback

**Date**: 2026-03-17
**Task**: 5.7 Remove generator self-fetch fallback (cleanup)
**Type**: Implementation
**Status**: Complete

---

## Summary

Completed full Option B per design outline D9: generators now require externally-resolved token sets. No self-fetch, no fallback, no runtime guard — TypeScript's type system enforces the contract at compile time.

## Changes

### Interface (TokenFileGenerator.ts)
- Split `GenerationOptions` into `BaseGenerationOptions` (shared fields) + `GenerationOptions extends BaseGenerationOptions` (adds required `semanticTokens` + `darkSemanticTokens`)
- `generateComponentTokens` and `generateBlendUtilities` use `BaseGenerationOptions` (don't need semantic tokens)
- `generateWebTokens`, `generateiOSTokens`, `generateAndroidTokens`, `generateAll`, `generateAllWithBlendUtilities` require `GenerationOptions`
- Removed `= {}` default parameter from all methods taking `GenerationOptions`

### Generator Methods (TokenFileGenerator.ts)
- Removed `?? getAllSemanticTokens()` fallback from 3 platform methods
- Removed F37 mismatched-provision guard from 3 platform methods (compile-time safety replaces runtime guard)
- Removed `?.` optional chaining on `darkSemanticTokens.filter()` (now always an array)
- Simplified `color-scheme: light dark` — always emitted (no conditional)

### Production Caller (BuildOrchestrator.ts)
- Added `resolveSemanticTokenValue` import
- Wired Level 1 value resolution before platform generation calls
- All 3 platform switch cases now pass `semanticTokens` + `darkSemanticTokens`

### Test Infrastructure
- Created `src/generators/__tests__/helpers/defaultSemanticOptions.ts` — shared helper providing cached resolved light/dark token arrays
- Updated 10 test files (~160 call sites) to pass resolved tokens explicitly
- Updated 7 accessibility tests: color assertions now expect resolved rgba/UIColor/Color.argb values instead of primitive references (correct behavior change from D9)
- Removed 3 F37 guard tests from ModeAwareGeneration.test.ts (no longer applicable)

## Files Modified
- `src/generators/TokenFileGenerator.ts` — interface split, fallback removal, guard removal
- `src/build/BuildOrchestrator.ts` — resolver wiring
- `src/generators/__tests__/helpers/defaultSemanticOptions.ts` — NEW
- `src/generators/__tests__/TokenFileGenerator.test.ts`
- `src/generators/__tests__/IconTokenGeneration.test.ts`
- `src/generators/__tests__/AccessibilityTokenGeneration.test.ts`
- `src/generators/__tests__/GridSpacingTokenGeneration.test.ts`
- `src/generators/__tests__/BreakpointTokenGeneration.test.ts`
- `src/generators/__tests__/WcagValueInfrastructure.test.ts`
- `src/generators/__tests__/Spec076TokenMigration.test.ts`
- `src/generators/__tests__/ModeAwareGeneration.test.ts`
- `src/__tests__/integration/SemanticTokenGeneration.test.ts`
- `src/__tests__/BuildSystemIntegration.test.ts`

## Validation
- TypeScript: clean compile
- Generator tests: 444/444 pass
- Full suite: 7836/7840 pass (4 pre-existing demo-system failures)
- End-to-end pipeline: 3/3 platforms, 203 tokens each

### Requirements Trace
- D9 Option B: Full separation of concerns — generators receive resolved tokens, no self-fetch ✅
- F37 (Thurgood R6): Runtime guard replaced by compile-time type safety ✅
