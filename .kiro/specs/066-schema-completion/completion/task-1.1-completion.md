# Task 1.1 Completion: Update Models, Parsers, and Types

**Date**: 2026-03-01
**Spec**: 066 - Schema Completion and Contract Audit Resolution
**Lead**: Lina
**Validation**: Tier 2 - Standard

---

## What Changed

### Models (`models/index.ts`)
- `CompositionDefinition.composes` → `.internal` (rename)
- Added `children.requires?: string[]` to `CompositionDefinition.children`
- Added `omits: string[]` to `ComponentMetadata`
- Added `resolvedTokens: { own: string[], composed: Record<string, string[]> }` to `ComponentMetadata`
- Replaced `ComponentSummary.composesComponents` with `.internalComponents` + `.requiredChildren`

### Parsers (`indexer/parsers.ts`)
- `ParsedSchema` gains `omits: string[]`
- `extractComposition()` reads `composition.internal` (nested) instead of top-level `composes`
- Parses `children.requires` from YAML
- `omits` parsed via `toStringArray(doc.omits)`

### Indexer (`indexer/ComponentIndexer.ts`)
- Assembly populates `omits` from parsed schema
- Assembly initializes `resolvedTokens: { own: schema.tokens, composed: {} }` (placeholder — Task 1.4 fills composed)

### QueryEngine (`query/QueryEngine.ts`)
- `getComponentSummary()` and `toSummary()` use `internal`/`requiredChildren`

### Schema Migration (4 files)
- Container-Card-Base: `composes:` → `composition.internal:`
- Progress-Pagination-Base: `composes:` → `composition.internal:`
- Progress-Stepper-Base: `composes:` → `composition.internal:`
- Progress-Stepper-Detailed: `composes:` → `composition.internal:`

### Tests (3 files)
- `parsers.test.ts`: assertion updated `composes` → `internal`
- `ComponentIndexer.test.ts`: assertion updated `composes` → `internal`
- `CompositionChecker.test.ts`: `makeMeta` helper updated with `omits`, `resolvedTokens`, `internal`; all 6 test data objects updated

## Design Decision: Clean Break

Per Peter's approval, no backward compatibility for `composes`. Parser only reads `internal`. All 4 existing schemas migrated in the same change. No dead code.

## Validation

- `npx tsc --noEmit`: clean
- Component MCP tests: 7 suites, 59 tests, 59 passed
- Main project tests: 290 suites, 7437 tests, 7437 passed

## Deferred to Later Subtasks

- `resolvedTokens.composed` populated at indexing time → Task 1.4
- `omits` applied during inheritance resolution → Task 1.2
- `children.requires` validated by CompositionChecker → Task 1.3
- `omits` added to 4 existing schemas (Chip-Input, Input-Text-*) → Task 1.5
