# Task 2.4 Completion: Deprecate Design-Outline Auto-Generation

**Date**: 2026-02-22
**Task**: 2.4 Deprecate design-outline auto-generation
**Type**: Implementation
**Validation**: Tier 2 - Standard
**Organization**: spec-completion
**Scope**: 054d-hierarchical-design-extraction

## Summary

Deprecated `generateDesignOutlineMarkdown()` with `@deprecated` JSDoc tag and removed auto-generated prescriptive content from three render methods: `renderBehavioralContracts` (removed auto-contract text), `renderPlatformParity` (removed recommendation text), and `renderPlatformBehaviors` (removed recommendation column from table). Updated 25 test files to reflect the deprecation and add the `getComponentImage` mock required by the interface change from task 2.3.

## Artifacts Modified

- `src/figma/DesignExtractor.ts` — Deprecated `generateDesignOutlineMarkdown()`, removed auto-contract text from `renderBehavioralContracts`, removed prescriptive recommendations from `renderPlatformParity` and `renderPlatformBehaviors`
- `src/figma/__tests__/DesignExtractor.generateDesignOutlineMarkdown.test.ts` — Updated 3 tests: behavioral contracts verifies auto-contract text absent, platform parity verifies recommendations absent, platform behaviors verifies recommendation column absent
- 22 additional test files — Added `getComponentImage` mock to `ConsoleMCPClient` mock factories (required by interface change from task 2.3)

## Implementation Details

**Deprecation approach**: Method marked `@deprecated` rather than deleted because the CLI (`src/cli/figma-extract.ts`) still calls it. Task 2.5 will update the CLI to use `ComponentAnalysis` instead, at which point the method can be fully removed.

**Content removed:**
- `renderBehavioralContracts`: Removed `autoContract` rendering (e.g., "No interaction — static display component"). Classification, detected states, and action-required warnings preserved.
- `renderPlatformParity`: Removed `recommendation` text from interaction listings. Interactions and platforms still listed descriptively.
- `renderPlatformBehaviors`: Removed `Recommendation` column from table. Interactions and platforms still listed.

**Mock factory updates**: Adding `getComponentImage()` to the `ConsoleMCPClient` interface in task 2.3 broke 22 test files that had strict-typed mock factories. All updated to include `getComponentImage: jest.fn().mockResolvedValue({ imageUrl: '' })`.

## Test Results

All 599 figma/CLI tests pass across 35 test suites:
- `DesignExtractor.generateDesignOutlineMarkdown.test.ts`: 46/46 (3 tests updated)
- `DesignExtractor.conflictingRecommendations.test.ts`: 7/7
- `DesignExtractor.noMatchPause.test.ts`: 14/14
- `figma-extract.test.ts`: 22/22
- All other DesignExtractor and TokenSyncWorkflow test files: passing

## Requirements Coverage

- **Req 9 AC 1**: Pipeline no longer auto-generates design-outline.md (method deprecated, CLI update in task 2.5) ✅
- **Req 9 AC 2**: `generateDesignOutlineMarkdown()` deprecated with `@deprecated` JSDoc ✅
- **Req 9 AC 3**: Auto-generated behavioral contract text removed ✅
- **Req 9 AC 4**: Platform parity prescriptive recommendations removed ✅
- **Req 9 AC 5**: Extraction pipeline produces ComponentAnalysis artifacts (tasks 2.1-2.3); design-outline is human-authored ✅
