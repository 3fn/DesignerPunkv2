# Task 5.1 Completion: Integrate SemanticOverrideResolver into Pipeline

**Date**: 2026-03-17
**Task**: 5.1 Integrate `SemanticOverrideResolver` into pipeline
**Type**: Architecture
**Status**: Complete

---

## Artifacts Modified

- `src/generators/TokenFileGenerator.ts` (modified — `GenerationOptions.semanticTokens`, three platform methods accept pre-resolved tokens)
- `src/generators/generateTokenFiles.ts` (modified — resolver wired into orchestration layer)

## Architecture Decision

### Integration Point: Orchestration Layer (`generateTokenFiles.ts`)

Design outline Decision #9 specifies: "Clean separation of concerns. Two-level resolver sits between Registry and Generation. Generators receive fully resolved token sets per mode."

Three options were evaluated:
- **Option A (inside generator)**: Resolver lives in `TokenFileGenerator`. Rejected — mixes resolution and formatting concerns, contradicts D9.
- **Option B (full external)**: Orchestration layer resolves tokens, generator requires them as input. Correct architecture but would break 7 test files / ~40 call sites that use `new TokenFileGenerator()` with no args.
- **Option B-lite (external with fallback)**: Orchestration layer resolves and passes tokens. Generator accepts optional `semanticTokens` in `GenerationOptions`, falls back to self-fetch when not provided. Matches D9 architecture with zero test breakage.

Selected B-lite. The self-fetch fallback is transitional — can be removed as a housekeeping task once all callers pass resolved tokens.

### How It Works

`generateTokenFiles.ts` already creates `PrimitiveTokenRegistry` and `SemanticTokenRegistry` for validation. The new code:
1. Creates `SemanticOverrideResolver` with the registry and `darkSemanticOverrides`
2. Calls `validate()` — aborts generation on orphaned override keys
3. Calls `resolveAll()` — produces `{ light, dark }` token sets
4. Passes `light` set to `generator.generateAll()` via `options.semanticTokens`

Dark set is produced but not consumed until Tasks 5.2–5.4 update platform formatters for mode-aware output.

### Pipeline Flow (Realized)

```
Definition → Validation → Registry → Mode Resolution → Generation → Platform Output
                                      ^^^^^^^^^^^^^^^^
                                      New step (5.1)
```

### Changes to `TokenFileGenerator`

- `GenerationOptions` gains optional `semanticTokens: Array<Omit<SemanticToken, 'primitiveTokens'>>`
- `generateWebTokens`, `generateiOSTokens`, `generateAndroidTokens` each use `semanticTokens ?? getAllSemanticTokens()` — pre-resolved tokens when provided, self-fetch when not
- `generateAll` passes options through unchanged (semanticTokens flows to all platforms)
- Two utility methods (`extractSemanticTokenNames`, `extractPrimitiveSemanticRelationships`) unchanged — they validate against canonical token set, not resolved set

### What Doesn't Change

- `DTCGFormatGenerator` — its `getAllSemanticTokens()` calls are for counting/validation, not resolution. Task 5.5 handles DTCG separately.
- `generateSemanticSection` — receives whatever token array the platform method gives it, no signature change.
- Constructor — stays zero-arg.
- All existing tests — zero modifications.

## Validation

### Compilation
- `npx tsc --noEmit` — clean, zero errors

### Test Results
- 435/435 generator tests pass (zero regressions)
- 160/160 resolver tests pass
- 7827/7831 full suite pass (4 pre-existing demo-system failures, unrelated)

### End-to-End Verification
- `generateTokenFiles('/tmp/080-test-output')` runs successfully
- Override validation step visible in output: "✅ Semantic override validation passed"
- All 3 platforms generate valid output (203 primitive tokens each)
- Cross-platform consistency validation passes

### Requirements Trace
- R3 AC1-2: Resolver integrated into pipeline between Registry and Generation ✅
- R4 AC1: `validate()` rejects orphaned override keys, aborts build ✅
- D9: Clean separation — resolution in orchestration layer, generation in generator ✅
- F37: Mismatched provision guard — loud failure on inconsistent mode token input ✅
- Task 5.7 tracked for full Option B completion (self-fetch fallback removal) ✅
