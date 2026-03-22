# Task 1.1 Completion: Create GuidanceCompleteness.test.ts

**Date**: 2026-03-22
**Spec**: 083 — Application MCP Guidance Completeness
**Agent**: Lina
**Validation Tier**: 2 — Standard

---

## What Was Done

Created `application-mcp-server/src/indexer/__tests__/GuidanceCompleteness.test.ts` with two tests:

1. **Component reachability**: Every production component is reachable via `getGuidance(componentName)`. Error message includes the component name and points to Component Development Guide § "Family Guidance Standards".

2. **Quality field enforcement**: Every family guidance has non-empty `whenToUse`, `whenNotToUse`, and `accessibilityNotes`. Error message says "empty or missing [field]" and points to Component Development Guide § "Family Guidance Standards".

## Design Decisions

- `accessibilityNotes` enforced unconditionally for all families (no "interactive" qualifier), consistent with Lina's recommendation across requirements, design, and tasks feedback.
- Error messages point to the Component Dev Guide resolution path rather than including diagnostic detail (e.g., sibling-resolution logic from CoverageDrift). The guide section (Task 1.3) will document how to fix failures.
- Uses `getGuidanceFamilies()` for quality field iteration — checks all families with guidance, not just production families. This catches quality gaps in guidance that exists but is incomplete.

## Artifacts

- Created: `application-mcp-server/src/indexer/__tests__/GuidanceCompleteness.test.ts`

## Validation

- `npx jest --testPathPattern GuidanceCompleteness` — 2 tests, 1 suite, all passing
