# Task 5.2 Completion: Implement Missing Component-Family Doc Handling

**Date**: February 20, 2026
**Task**: 5.2 Implement missing Component-Family doc handling
**Type**: Implementation
**Validation**: Tier 2 - Standard
**Organization**: spec-completion
**Scope**: 054b-figma-design-extract

---

## Summary

Implemented detection and user-facing messaging when `queryFamilyPattern()` returns null (Component-Family doc doesn't exist). The extraction continues with ⚠️ confidence flags on variant recommendations and inheritance pattern sections.

## Changes Made

### `src/figma/DesignExtractor.ts`

1. **`renderVariantRecommendations()`** — Added ⚠️ Reduced Confidence banner when `mapping.familyPattern` is null. Banner includes the specific missing doc name and a template reference (`Component-Family-Template.md`).

2. **`renderInheritancePattern()`** — Updated the missing-pattern message from a generic italic note to a specific ⚠️ recommendation: "Component-Family-{name}.md not found. Recommend creating it before proceeding." with template reference. Derives family name from variantMapping when available, falls back to suffix-stripping from componentName.

3. **`calculateConfidence()`** — Updated the review item message for missing family docs to be more actionable: includes the recommendation to create the doc and references the template.

### `src/figma/__tests__/DesignExtractor.generateDesignOutlineMarkdown.test.ts`

- Updated existing "renders missing pattern recommendation" test to validate new message format and template reference
- Added test: "derives family name from variantMapping when available"
- Added test: "shows ⚠️ reduced confidence warning when familyPattern is null"
- Added test: "does not show reduced confidence warning when familyPattern exists"
- Added `FamilyPattern` import

## Test Results

- `DesignExtractor.generateDesignOutlineMarkdown.test.ts`: 46/46 passed
- `DesignExtractor.test.ts`: 23/23 passed
- `DesignExtractor.queryContext.test.ts`: 12/12 passed
- `DesignExtractor.noMatchPause.test.ts`: 10/10 passed (task 5.1 unaffected)
- `figma-extract.test.ts`: 22/22 passed (CLI unaffected)

## Requirements Coverage

- **Req 4**: Context-Aware Variant Mapping — missing doc detection, recommendation formatting, ⚠️ confidence on variant recommendations, template reference, extraction continues
