# Implementation Plan: MCP Coverage Enforcement

**Date**: 2026-03-20
**Spec**: 075 - MCP Coverage Enforcement
**Status**: Implementation Planning
**Dependencies**: Spec 068 (Family Guidance Indexer), Spec 071 (Family Guidance YAMLs)

---

## Task List

- [x] 1. Coverage Drift Test

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Coverage drift test exists and runs as part of `npm test`
  - Test derives production families from schema readiness field
  - Test hard-fails when a production family lacks guidance
  - Test hard-fails when guidance references a non-existent component
  - Test hard-fails when a production component is unreachable via getGuidance()
  - All existing production families pass (8/8 families, 30 components)

  **Primary Artifacts:**
  - `component-mcp-server/src/indexer/__tests__/CoverageDrift.test.ts`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/075-mcp-coverage-enforcement/completion/task-1-completion.md`
  - Summary: `docs/specs/075-mcp-coverage-enforcement/task-1-summary.md`

  **Post-Completion:**
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Coverage Drift Test"`
  - Verify: Check GitHub for committed changes

  - [x] 1.1 Implement coverage drift test
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Thurgood
    - Create `CoverageDrift.test.ts` in `component-mcp-server/src/indexer/__tests__/`
    - Implement production family derivation from `getCatalog()` filtering by `readiness: production-ready`
    - Implement family coverage check: every production family has non-null `getGuidance(family)`
    - Implement component-to-guidance check: every component in guidance selectionRules exists in catalog
    - Implement reverse coverage check: every production component has non-null `getGuidance(componentName)`
    - Verify test passes against current state (8/8 families, 30 production components)
    - Note: `readiness` semantics and family classification touch component architecture. Coordinate with Lina if ambiguity arises in how the indexer resolves family names or component→family mapping.
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 3.1, 3.2, 3.3, 4.1, 4.2_

---

**Organization**: spec-completion
**Scope**: 075-mcp-coverage-enforcement
