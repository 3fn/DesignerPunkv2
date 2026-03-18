# Task 8.4 Completion: Update Component MCP

**Date**: 2026-03-18
**Task**: 8.4 Update component MCP
**Type**: Implementation
**Status**: Complete

---

## Summary

Added mode-awareness classification to the component MCP's `getComponent()` responses. Each color token consumed by a component is now classified as `level-1`, `level-2`, or `mode-invariant` in a new `tokenModeMap` field on `ComponentMetadata`.

This was reframed from the original task (which called for resolved rgba values) after Lina R1 F41 identified that value resolution would couple the structural catalog to the token pipeline. Ada R10 confirmed the intent was annotation, not value resolution. R10 AC4 was reworded accordingly.

## Artifacts Created/Modified

- `component-mcp-server/src/indexer/ModeClassifier.ts` (new) — Classifies color tokens by reading `SemanticOverrides.ts` as text at index time. Extracts level-2 keys via regex, checks against static mode-invariant set from audit. No pipeline coupling.
- `component-mcp-server/src/models/index.ts` (modified) — Added `tokenModeMap: Record<string, 'level-1' | 'level-2' | 'mode-invariant'>` to `ComponentMetadata`.
- `component-mcp-server/src/indexer/ComponentIndexer.ts` (modified) — Loads `ModeClassifier` during `indexComponents()`, populates `tokenModeMap` during component assembly.
- `component-mcp-server/src/indexer/__tests__/CompositionChecker.test.ts` (modified) — Added empty `tokenModeMap` to test fixture.

## Implementation Details

### Approach

The ModeClassifier determines token classification without importing the token pipeline:
1. Reads `src/tokens/themes/dark/SemanticOverrides.ts` as text
2. Extracts exported override map keys via regex → these are `level-2`
3. Checks against a static `MODE_INVARIANT_TOKENS` set (from audit) → these are `mode-invariant`
4. Remaining color tokens (identified by `color.` or `glow.` prefix) → `level-1`
5. Non-color tokens are excluded from the map entirely

### Key Decisions

- **Text parsing over TS import**: The MCP server is a standalone package (`component-mcp-server/`) with its own `tsconfig.json`. Importing from the main `src/` tree would create a compilation dependency. Reading the file as text keeps the MCP decoupled.
- **Static mode-invariant set**: Only 1 of 9 mode-invariant tokens has `modeInvariant: true` in code. The classifier uses the audit's complete list rather than relying on the flag alone.
- **Color-only scope**: Mode classification only applies to color tokens. Non-color tokens (spacing, typography, motion, etc.) don't have mode differentiation and are excluded from `tokenModeMap`.

### Integration Points

- `ModeClassifier.load()` is called once during `indexComponents()`, before the component assembly pass
- `ModeClassifier.classifyAll()` is called per component during `assembleComponent()`
- The `projectRoot` variable (already computed for pattern/guidance indexing) is reused for the classifier

## Validation (Tier 2: Standard)

### Syntax Validation
- ✅ TypeScript compilation passes (`npx tsc --noEmit`)

### Functional Validation
- ✅ 136/136 tests pass, 11/11 suites
- ✅ End-to-end verification: 29 components indexed, all three classification levels populated correctly
- ✅ Level-2 tokens match `darkSemanticOverrides` exported keys (e.g., `color.structure.canvas`, `color.action.navigation`, `color.background.primary.subtle`, `color.structure.border.subtle`, `color.icon.navigation.inactive`)
- ✅ Mode-invariant tokens match audit set (e.g., `color.contrast.onDark`, `color.print.default`, `color.scrim.standard`)
- ✅ Non-color tokens excluded from map
- ✅ Health status: healthy, zero warnings

### Requirements Trace
- R10 AC4 (reworded): Component MCP classifies each mode-aware color token as level-1, level-2, or mode-invariant in `getComponent()` responses ✅

## Spec Document Updates

Applied concurrently with implementation (per Ada R10 agreement):
- `requirements.md` R10 AC4 — reworded from "show light/dark resolved values" to "classify each mode-aware color token as level-1, level-2, or mode-invariant"
- `tasks.md` Task 8.4 — reframed to classification annotation, dependency changed from Tasks 2+5 to Task 3, traces added
- `design-outline.md` § Component MCP — aligned with reframed task

## Traces
- Lina R1 F41 (feedback.md) — identified conflation of structural metadata with value resolution
- Ada R10 (feedback.md) — confirmed annotation intent, provided classification data source
