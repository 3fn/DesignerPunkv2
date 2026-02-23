# Task 4 Completion: Value-Match Classification Policy

**Date**: 2026-02-22
**Task**: 4. Value-match classification should be Unidentified with suggestion
**Type**: Implementation
**Validation**: Tier 2 - Standard
**Organization**: spec-completion
**Scope**: 054d-hierarchical-design-extraction

## Summary

Changed classification policy so only binding-based matches (`matchMethod: "binding"`) earn Identified status. Value-based matches (`matchMethod: "value"`) now classify as Unidentified with a `suggestedToken` field, making the pipeline an honest discovery tool rather than a compliance checker.

## Changes

1. **`src/figma/ComponentAnalysis.ts`** — Added `'value-match'` to `UnidentifiedReason` union. Added optional `suggestedToken` field to `UnidentifiedValue` interface.

2. **`src/figma/DesignExtractor.ts`** — In `classifyNodeTokens`, value-based matches that would have been promoted to semantic/primitive are now routed to unidentified with `reason: 'value-match'` and `suggestedToken` populated from the translation result.

3. **`src/figma/ComponentAnalysisGenerator.ts`** — Markdown renderer shows `suggestedToken` in unidentified values section (e.g., `— suggested: \`color.black500\``).

## Design Decision

The `reclassifyWithResolvedBindings` path was intentionally left unchanged — those entries have `boundVariableId`, meaning they represent actual designer-bound variables that were resolved in a second pass. They should keep Identified status.

## Test Results

512 tests passing across 31 figma/CLI test suites, 0 regressions.
