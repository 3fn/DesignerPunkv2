# Implementation Plan: Application MCP Consistency & Governance

**Date**: 2026-03-21
**Spec**: 082 - Application MCP Consistency & Governance
**Status**: Implementation Planning
**Dependencies**: 067 (Application MCP), 068 (Family Guidance Indexer), 070 (Agent Architecture), 075 (MCP Coverage Enforcement)

---

## Implementation Plan

Big-bang migration in four parent tasks. Task 1 establishes the registry and renames the directory (foundation). Task 2 normalizes all data files (family names). Task 3 adds governance infrastructure (enforcement + documentation). Task 4 sweeps all documentation references (consistency).

Tasks 1-2 must be sequential (registry before normalization). Tasks 3-4 can proceed after Task 2 in either order.

---

## Task List

- [x] 1. Foundation: Registry & Directory Rename

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - `family-registry.yaml` exists with all 9 families registered
  - Directory renamed from `component-mcp-server/` to `application-mcp-server/`
  - Package name updated to `@designerpunk/application-mcp-server`
  - MCP config and agent config paths updated
  - All existing tests pass after rename

  **Primary Artifacts:**
  - `family-registry.yaml`
  - `application-mcp-server/` (renamed directory)

  **Completion Documentation:**
  - Detailed: `.kiro/specs/082-application-mcp-consistency/completion/task-1-completion.md`
  - Summary: `docs/specs/082-application-mcp-consistency/task-1-summary.md`

  **Post-Completion:**
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Foundation — Registry & Directory Rename"`
  - Verify: Check GitHub for committed changes

  - [x] 1.1 Create canonical family registry
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    **Agent**: Thurgood
    - Create `family-registry.yaml` alongside `family-guidance/`
    - Populate all 9 families with canonical name, displayName, and prefix
    - Validate YAML syntax
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 1.2 Rename directory and update configs
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - `git mv component-mcp-server/ application-mcp-server/`
    - Update `application-mcp-server/package.json` (name + description)
    - Update `.kiro/settings/mcp.json` path
    - Update `.kiro/agents/lina.json` glob pattern
    - Run `npm test` to verify all tests pass after rename
    - _Requirements: 3.1, 3.2, 3.4_

- [x] 2. Family Name Normalization

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - All 30 schema.yaml files use canonical PascalCase family names
  - All 8 guidance YAMLs use canonical PascalCase family names with displayName
  - `getGuidance("Button")` resolves directly (no workaround)
  - `getGuidance("Button-CTA")` continues to resolve via component-to-family map (existing behavior preserved)
  - `FamilyGuidance` interface includes `displayName`
  - `displayName` appears in `getGuidance()` response
  - CoverageDrift test uses direct family name lookup
  - All existing tests pass

  **Primary Artifacts:**
  - 30 updated schema.yaml files
  - 8 updated guidance YAMLs
  - Updated `FamilyGuidance` interface and parser

  **Completion Documentation:**
  - Detailed: `.kiro/specs/082-application-mcp-consistency/completion/task-2-completion.md`
  - Summary: `docs/specs/082-application-mcp-consistency/task-2-summary.md`

  **Post-Completion:**
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 2 Complete: Family Name Normalization"`
  - Verify: Check GitHub for committed changes

  - [x] 2.1 Normalize schema family names
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Update `family:` field in all 30 schema.yaml files to canonical PascalCase
    - Non-trivial normalizations requiring manual verification (not simple find-and-replace):
      - `Button-CTA`: `Buttons` → `Button` (different from other Button components which already say `Button`)
      - `Container-Base`, `Container-Card-Base`: `Containers` → `Container` (plural → singular)
      - `Icon-Base`: `Icons` → `Icon` (plural → singular)
      - `Progress-*` (6 components): `Progress-Indicator` → `ProgressIndicator` (hyphenated → PascalCase)
    - Verify each schema against the canonical name table in `family-registry.yaml`
    - _Requirements: 2.1_

  - [x] 2.2 Normalize guidance YAMLs and update indexer
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Update `family:` field in all 8 guidance YAMLs to canonical PascalCase
    - Add `displayName` field to each guidance YAML
    - Add `displayName: string` to `FamilyGuidance` interface in `models/index.ts`
    - Add `displayName` to `PropGuidanceResponse` interface
    - Update `FamilyGuidanceIndexer.parseGuidanceFile()` to read `displayName` (fallback to registry)
    - Update `FamilyGuidanceIndexer.test.ts` — `getGuidance('Buttons')` → `getGuidance('Button')`
    - Update `CoverageDrift.test.ts` — replace indirect workaround with direct family name lookup
    - Run `npm test` to verify all tests pass
    - _Requirements: 2.2, 2.3, 2.4, 2.5_

- [x] 3. Governance Infrastructure

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - `FamilyNameValidation.test.ts` passes and enforces canonical names
  - Test catches unregistered family names with clear error messages
  - Component Development Guide documents naming convention, registry, and prefix mapping
  - All tests pass

  **Primary Artifacts:**
  - `application-mcp-server/src/indexer/__tests__/FamilyNameValidation.test.ts`
  - Updated Component Development Guide

  **Completion Documentation:**
  - Detailed: `.kiro/specs/082-application-mcp-consistency/completion/task-3-completion.md`
  - Summary: `docs/specs/082-application-mcp-consistency/task-3-summary.md`

  **Post-Completion:**
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 3 Complete: Governance Infrastructure"`
  - Verify: Check GitHub for committed changes

  - [x] 3.1 Create FamilyNameValidation test
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Create `FamilyNameValidation.test.ts` in `application-mcp-server/src/indexer/__tests__/`
    - Load `family-registry.yaml` and extract canonical names
    - Use `ComponentIndexer.getCatalog()` to read schema family values (DRY — reuses existing parsing)
    - Assert every schema family value exists in canonical set
    - Validate guidance YAML `displayName` matches registry when both exist
    - Distinguish "family not registered" from "format invalid" in error messages
    - Print list of valid canonical names on failure
    - Run test to verify it passes with normalized data
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 3.2 Update Component Development Guide
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    **Agent**: Thurgood (Lina reviews before commit)
    - Add "Family Naming Convention" section to Component Development Guide
    - Document canonical naming convention (singular PascalCase)
    - Point to `family-registry.yaml` as authoritative source
    - Document prefix-to-family mapping for legacy families (two-tier acknowledgment)
    - Document ProgressIndicator dual-prefix situation explicitly
    - Document forward-looking rule: new families must use canonical name as prefix
    - Note that guidance YAML filenames are independent of canonical family names
    - _Requirements: 4.5_

- [x] 4. Documentation Sweep

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - All active steering docs use "Application MCP" (not "Component MCP")
  - All steering docs with schema examples use canonical PascalCase family names
  - All agent prompt files reference "Application MCP"
  - README and docs-directory guides updated
  - No active document references `component-mcp-server/` by directory name

  **Primary Artifacts:**
  - Updated steering docs (~14 files)
  - Updated agent prompts (7 files)
  - Updated README and docs guides (~4 files)

  **Completion Documentation:**
  - Detailed: `.kiro/specs/082-application-mcp-consistency/completion/task-4-completion.md`
  - Summary: `docs/specs/082-application-mcp-consistency/task-4-summary.md`

  **Post-Completion:**
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 4 Complete: Documentation Sweep"`
  - Verify: Check GitHub for committed changes

  - [x] 4.1 Update teaching material (hard references)
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    **Agent**: Thurgood
    - Update `Component-Schema-Format.md` — schema examples to canonical PascalCase
    - Update `Component-Readiness-Status.md` — family name references
    - Update `Component-Development-Standards.md` — family labels + MCP identity
    - Update `Process-Spec-Planning.md` — family name in examples
    - _Requirements: 5.1_

  - [x] 4.2 Update steering docs and agent prompts (soft references)
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    **Agent**: Thurgood
    - Update 10 steering docs — "Component MCP" → "Application MCP"
    - Update 4 steering docs — old family name conventions in prose
    - Update 7 agent prompt files — MCP identity references
    - Update README — "Component MCP" → "Application MCP", directory references
    - Update `docs/component-mcp-query-guide.md`, `docs/component-metadata-schema-reference.md`, `docs/component-meta-authoring-guide.md`
    - _Requirements: 5.2, 5.3, 3.3_
