# Task 2.2 Completion: Normalize Guidance YAMLs and Update Indexer

**Date**: 2026-03-21
**Task**: 2.2 — Normalize guidance YAMLs and update indexer
**Type**: Implementation
**Status**: Complete

## Artifacts Modified

**8 guidance YAMLs** — `family:` normalized to canonical PascalCase, `displayName` added:
- `avatars.yaml`: `"Avatars"` → `Avatar`, displayName: `"Avatars"`
- `badges.yaml`: `"Badges"` → `Badge`, displayName: `"Badges"`
- `button.yaml`: `"Buttons"` → `Button`, displayName: `"Buttons"`
- `chips.yaml`: `"Chips"` → `Chip`, displayName: `"Chips"`
- `container.yaml`: `"Containers"` → `Container`, displayName: `"Containers"`
- `form-inputs.yaml`: `"Form Inputs"` → `FormInput`, displayName: `"Form Inputs"`
- `icons.yaml`: `"Icons"` → `Icon`, displayName: `"Icons"`
- `progress.yaml`: `"Progress Indicators"` → `ProgressIndicator`, displayName: `"Progress Indicators"`

**Interface changes** (3-layer: model → parser → response):
- `models/index.ts` — Added `displayName: string` to `FamilyGuidance` and `PropGuidanceResponse`
- `FamilyGuidanceIndexer.ts` — `parseGuidanceFile()` reads `displayName` with fallback to `family` value
- `QueryEngine.ts` — `getGuidance()` response includes `displayName`

**Test updates:**
- `FamilyGuidanceIndexer.test.ts` — Fixtures updated to canonical names with displayName; all assertions updated
- `CoverageDrift.test.ts` — Replaced indirect component-level workaround with direct `getGuidance(family)` lookup

## Implementation Notes

- `displayName` fallback uses the `family` value itself (not registry lookup) — sufficient since all 8 guidance YAMLs now have explicit `displayName` fields. Registry fallback can be added in Task 3 if needed for families without guidance.
- `displayName` is NOT added to the validator's required fields — it's optional in the YAML with a fallback, per design feedback.
- CoverageDrift simplification: the `productionByFamily` Map construction simplified to a Set of unique families, with direct `getGuidance(family)` calls replacing the component-level iteration.

## Validation

- ✅ All 8 guidance YAMLs use canonical PascalCase family names with displayName
- ✅ `getGuidance("Button")` resolves directly (no workaround)
- ✅ `displayName` appears in `FamilyGuidance` and `PropGuidanceResponse`
- ✅ CoverageDrift uses direct family name lookup
- ✅ Application MCP tests: 12 suites, 139 tests passing
- ✅ Full suite: 306 suites, 7,965 tests passing

### Requirements Compliance
- ✅ Req 2.2: Guidance YAML `family:` matches canonical in registry
- ✅ Req 2.3: `displayName` field exposed for human-facing contexts
- ✅ Req 2.4: `getGuidance()` with canonical family name returns directly
- ✅ Req 2.5: Response includes both `family` and `displayName`
