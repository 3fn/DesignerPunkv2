# Task 6.2 Completion: Implement Theme File Generator

**Date**: 2026-03-17
**Task**: 6.2 Implement theme file generator
**Type**: Implementation
**Status**: Complete

---

## Artifacts Created

- `src/tools/ThemeFileGenerator.ts` — generates complete dark theme file skeleton from live token registry
- `package.json` — added `generate:theme-skeleton` and `audit:theme-drift` npm scripts

## Implementation

The generator reads all semantic color tokens from the registry and produces a complete `SemanticOverrides.ts` skeleton:
- Tokens grouped by name prefix into section headings
- Each token listed as a commented-out entry with its base primitive references
- wcagValue tokens annotated with `[has wcagValue — Phase 2]`
- Populated overrides from the override map exported at the bottom

### CI Integration

- `npm run generate:theme-skeleton` — outputs generated skeleton to stdout
- `npm run audit:theme-drift` — regenerates and diffs against existing theme file
  - New tokens added to base → appear as new entries in diff
  - Tokens removed from base → appear as removed entries in diff

## Validation

- TypeScript: clean compile
- Full suite: 7840/7840 pass
- Generator produces all 61 tokens in correct groupings

### Requirements Trace
- R8 AC1: Theme file skeleton generated from base token set ✅
- R8 AC2: Populated entries exported, unpopulated commented out ✅
- R8 AC3: CI regeneration and comparison ✅
- R8 AC4: New/orphaned token detection via diff ✅
