# Task 5.3 Completion: Implement Conflicting Recommendations Handling

**Date**: February 20, 2026
**Task**: 5.3 Implement conflicting recommendations handling
**Type**: Implementation
**Validation**: Tier 2 - Standard
**Organization**: spec-completion
**Scope**: 054b-figma-design-extract

---

## Summary

Integrated variant mapping conflict detection into the extraction confidence pipeline so that conflicting recommendations between family pattern and behavioral analysis properly flag `requiresHumanInput = true` and appear as review items.

## What Changed

### `src/figma/DesignExtractor.ts`

- `calculateConfidence()` now accepts an optional `variantMapping` parameter
- When `variantMapping.conflicts` is non-empty, adds a review item describing the conflict count and sets `requiresHumanInput = true`
- `extractDesign()` passes `variantMapping` to `calculateConfidence()`

### `src/figma/__tests__/DesignExtractor.conflictingRecommendations.test.ts` (new)

11 tests covering:
- Markdown rendering: ⚠️ Mapping Conflicts section, Human Decision Required label, both recommendations, explanation, multiple conflicts
- Confidence integration: requiresHumanInput set when conflicts exist, not set when no conflicts
- Human deferral: no auto-resolve language, neutral presentation of both options

## Pre-Existing Context

The `renderVariantRecommendations()` method already rendered conflicts with ⚠️ and "Human Decision Required" labels (implemented in Task 3.12). The gap was that conflicts did not affect `calculateConfidence()`, meaning the extraction could report `requiresHumanInput: false` even when conflicts existed. This task closes that gap.

## Test Results

- 11/11 new tests pass
- 46/46 existing markdown generation tests pass
- 355/356 total suites pass (1 pre-existing performance timeout unrelated to changes)

## Requirements Coverage

- Req 4: Context-Aware Variant Mapping — conflicts detected, formatted, flagged, deferred to human
