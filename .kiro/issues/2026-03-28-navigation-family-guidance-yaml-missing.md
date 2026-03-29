# Missing family-guidance/navigation.yaml

**Date**: 2026-03-28
**Severity**: Medium
**Agent**: Lina
**Found by**: Thurgood (Spec 086 Task 2.3 review)

## Problem

The Navigation family has a `Component-Family-Navigation.md` steering doc but no corresponding `family-guidance/navigation.yaml` file. The `FamilyGuidanceIndexer` reads from `family-guidance/*.yaml` — without this file, Nav-SegmentedChoice-Base and Nav-TabBar-Base are not reachable via `getGuidance()`.

This causes 2 pre-existing test failures:
- `CoverageDrift`: "Navigation" family has no family guidance
- `GuidanceCompleteness`: Nav-SegmentedChoice-Base and Nav-TabBar-Base not reachable via `getGuidance()`

## Root Cause

The steering doc and the structured YAML are separate artifacts:
- `Component-Family-Navigation.md` — human/agent reference (exists)
- `family-guidance/navigation.yaml` — structured data the Application MCP indexer parses (missing)

All other 8 families have both. Navigation is the only gap.

## Fix

Create `family-guidance/navigation.yaml` with the required schema: `family`, `companion`, `whenToUse`, `whenNotToUse`, `selectionRules` (mapping scenarios to Nav-SegmentedChoice-Base and Nav-TabBar-Base), and `accessibilityNotes`. Content can be derived from the existing steering doc.

## Impact

- `get_prop_guidance("Nav-TabBar-Base")` returns nothing — product agents can't get selection guidance for Navigation components
- `find_components` results for Navigation components lack selection context
- 2 Application MCP compliance tests failing

## Resolution

**Status**: ✅ Resolved
**Date**: 2026-03-28
**Resolved by**: Lina
**Commit**: 9888fabc

### Changes

1. **Created** `family-guidance/navigation.yaml` — structured guidance with `whenToUse`, `whenNotToUse`, `selectionRules`, `discouragedPatterns`, `composesWithFamilies`, `accessibilityNotes`, and `patterns` for Nav-SegmentedChoice-Base and Nav-TabBar-Base
2. **Fixed** `Component-Family-Navigation.md` steering doc (discovered during investigation):
   - Nav-SegmentedChoice-Base contract count: 24 → 23 (matched contracts.yaml source)
   - Nav-TabBar-Base contract table: added 3 missing rows (`visual_pill_container`, `state_selected`, `state_mode_driven`)
   - Nav-TabBar-Base category count: 7 → 9

### Verification

- `CoverageDrift` — passing
- `GuidanceCompleteness` — passing
- Application MCP builds clean
