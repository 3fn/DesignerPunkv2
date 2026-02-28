# Implementation Plan: Component Metadata Schema

**Date**: 2026-02-28
**Spec**: 064 - Component Metadata Schema
**Status**: Complete
**Dependencies**: 063 (Uniform Contract System — COMPLETE)

---

## Implementation Plan

The work is organized into 4 primary tasks, executed sequentially. Task 1 (cleanup) unblocks Tasks 2-4. Task 2 (core MCP) is the largest body of work. Task 3 (semantic annotations) can begin once the indexer from Task 2 exists. Task 4 (A2UI validation) is the final design checkpoint before the schema is considered complete.

**Agent assignments by subtask:**

| Subtask | Lead | Review | Consult |
|---------|------|--------|---------|
| 1.1 Avatar rename | Lina | — | — |
| 1.2 Motion token names | Lina | — | Ada (correct token names) |
| 1.3 Button-Icon scale | Lina | Peter (final decision) | Ada (token alignment) |
| 2.1 Project scaffolding | Lina | — | — |
| 2.2 YAML parsers | Lina | — | — |
| 2.3 InheritanceResolver | Lina | — | — |
| 2.4 ComponentIndexer | Lina | Thurgood (test coverage) | — |
| 2.5 ContractTokenDeriver | Lina | Ada (token logic accuracy) | — |
| 2.6 CompositionChecker | Lina | — | — |
| 2.7 QueryEngine + MCP tools | Lina | Thurgood (test coverage) | — |
| 2.8 FileWatcher | Lina | — | — |
| 2.9 QueryEngine refinements | Lina | Thurgood (verify fixes) | — |
| 3.1 Authoring guide | Lina | — | — |
| 3.2 28 component-meta.yaml | Lina | Ada (token-adjacent components) | — |
| 4.1 A2UI mapping exercise | Lina + Thurgood | Peter (pause point decision) | — |
| 4.2 Schema format reference | Lina | — | — |
| 4.3 MCP query docs | Lina | — | — |
| 4.4 Contract-System-Reference update | Thurgood | Peter (ballot measure) | — |

---

## Task List

- [x] 1. Pre-Schema Cleanup

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Avatar renamed to Avatar-Base across all file paths, schema references, contract references, test files, and steering docs
  - 3 stale motion contract names updated to correct semantic token names (Avatar-Base, Chip-Base, Chip-Filter)
  - Button-Icon iOS scale value decision documented (scale096 or platform exception)
  - All existing tests pass after cleanup (0 regressions)

  **Primary Artifacts:**
  - Renamed `src/components/core/Avatar-Base/` directory and all internal files
  - Updated contracts.yaml files for Avatar-Base, Chip-Base, Chip-Filter
  - Decision record for Button-Icon iOS scale value

  **Completion Documentation:**
  - Detailed: `.kiro/specs/064-component-metadata-schema/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/064-component-metadata-schema/task-1-summary.md`

  **Post-Completion:**
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Pre-Schema Cleanup"`
  - Verify: Check GitHub for committed changes

  - [x] 1.1 Rename Avatar to Avatar-Base
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    **Lead**: Lina
    - Rename directory `src/components/core/Avatar/` → `src/components/core/Avatar-Base/`
    - Rename schema file to `Avatar-Base.schema.yaml`, update `name:` field
    - Update contracts.yaml `component:` field
    - Update all test file imports and references
    - Update any steering doc references (Component-Inheritance-Structures.md, Contract-System-Reference.md)
    - Run full test suite — 0 failures
    - _Requirements: 8.1_

  - [x] 1.2 Fix stale motion contract token names
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Lead**: Lina | **Consult**: Ada
    - Identify correct semantic motion token names for `motion.duration.fast` references
    - Update Avatar-Base contracts.yaml: replace stale token name in contract `behavior:` text
    - Update Chip-Base contracts.yaml: replace stale token name in contract `behavior:` text
    - Update Chip-Filter contracts.yaml: replace stale token name in contract `behavior:` text
    - Run affected component tests — 0 failures
    - _Requirements: 8.2_

  - [x] 1.3 Resolve Button-Icon iOS scale value
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Lead**: Lina | **Consult**: Ada | **Review**: Peter
    - Review Button-Icon iOS implementation: is 0.97 intentional or a drift from token system?
    - Coordinate with Lina (component) and Ada (token alignment)
    - Document decision: adjust to `scale096` (0.96) OR document as platform-specific exception with rationale
    - If adjusting: update implementation and verify tests pass
    - _Requirements: 8.3_

- [x] 2. Component MCP Server

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - MCP server starts, indexes all 28 components from source files, and responds to queries
  - Progressive disclosure works: catalog → summary → full detail with appropriate token budgets
  - Inheritance resolution correctly merges parent/child contracts for all inheriting components
  - Capability discovery returns correct results for category, concept, platform, and purpose queries
  - Composition checker handles static constraints and conditional rules (Container-Card-Base role prop)
  - Contract-token derivation produces correct relationships for accessibility and animation contracts
  - File watcher re-indexes on source file changes
  - All unit and integration tests pass

  **Primary Artifacts:**
  - `component-mcp-server/` directory (sibling to `mcp-server/`)
  - `component-mcp-server/src/indexer/ComponentIndexer.ts`
  - `component-mcp-server/src/indexer/InheritanceResolver.ts`
  - `component-mcp-server/src/indexer/ContractTokenDeriver.ts`
  - `component-mcp-server/src/indexer/CompositionChecker.ts`
  - `component-mcp-server/src/query/QueryEngine.ts`
  - `component-mcp-server/src/watcher/FileWatcher.ts`
  - `component-mcp-server/src/models/` (TypeScript interfaces from design.md)

  **Completion Documentation:**
  - Detailed: `.kiro/specs/064-component-metadata-schema/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/064-component-metadata-schema/task-2-summary.md`

  **Post-Completion:**
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 2 Complete: Component MCP Server"`
  - Verify: Check GitHub for committed changes

  - [x] 2.1 Project scaffolding
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    **Lead**: Lina
    - Create `component-mcp-server/` directory structure mirroring `mcp-server/` layout
    - Initialize package.json, tsconfig.json, jest.config.js
    - Create `src/models/` with TypeScript interfaces from design.md data models
    - Create `src/indexer/`, `src/query/`, `src/watcher/`, `src/tools/`, `src/utils/` directories
    - Verify project compiles with `tsc --noEmit`
    - _Requirements: 1.4_

  - [x] 2.2 YAML parsers
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Lead**: Lina
    - Implement schema.yaml parser: extract name, type, family, version, readiness, description, platforms, properties, tokens, composition, behaviors
    - Implement contracts.yaml parser: extract contracts, excludes, inherits, component metadata
    - Implement component-meta.yaml parser: extract purpose, usage, contexts, alternatives
    - Handle malformed YAML gracefully (return null + warning, not throw)
    - Handle missing files gracefully (return null, not throw)
    - Unit tests for each parser: valid input, malformed input, missing file
    - _Requirements: 1.1, 1.3_

  - [x] 2.3 InheritanceResolver
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Lead**: Lina
    - Implement parent contract lookup by `inherits:` declaration
    - Merge parent contracts into child's resolved set with `source: "inherited"` attribution
    - Handle child extensions (same canonical name overrides parent) with `source: "extended"`
    - Preserve `excludes:` with rationale in resolved output
    - Handle missing parent gracefully (return child contracts + warning)
    - Enforce max depth 1 — warn on grandchild detection
    - Unit tests: merge, override, exclude, missing parent, depth violation
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 2.4 ComponentIndexer
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    **Lead**: Lina | **Review**: Thurgood (test coverage)
    - Implement directory scanner: find all component directories under `src/components/core/`
    - Implement multi-file assembly: parse schema.yaml + contracts.yaml + component-meta.yaml per component
    - Integrate InheritanceResolver into assembly pipeline
    - Build in-memory index (Map<string, ComponentMetadata>)
    - Generate catalog (lightweight summary array) from index
    - Implement `reindexComponent()` for single-component refresh
    - Implement health reporting (component count, warnings, missing files)
    - Integration test: index Badge-Count-Base, verify assembled output matches source files
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 2.5 ContractTokenDeriver
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Lead**: Lina | **Review**: Ada (token logic accuracy)
    - Implement token name extraction from contract `behavior:` text (regex-based pattern matching)
    - Cross-reference extracted names against component's schema `tokens:` list
    - Scope to accessibility and animation contract categories only
    - Return resolved pairs and unresolved gaps
    - Flag stale token naming patterns as warnings
    - Unit tests: known contract prose → expected token pairs, gap detection, category scoping
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 2.6 CompositionChecker
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Lead**: Lina
    - Implement static constraint evaluation (allowed/prohibited children, self-nesting)
    - Implement conditional rule evaluation (`when/then` on prop values)
    - Return allowed/prohibited with applicable rule detail
    - Handle unknown components gracefully (allowed by default + warning)
    - Unit tests: static allow, static prohibit, conditional override, self-nesting, unknown component
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 2.7 QueryEngine and MCP tools
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Lead**: Lina | **Review**: Thurgood (test coverage)
    - Implement QueryEngine wrapping ComponentIndexer with metrics and error handling
    - Implement `findByCategory()`, `findByConcept()`, `findByPlatform()`, `searchByPurpose()`
    - Implement progressive disclosure: catalog → summary → full (3 detail levels)
    - Create MCP tool handlers: `get_component_catalog`, `get_component_summary`, `get_component_full`, `find_components`, `check_composition`, `get_component_health`
    - Create MCP server entry point with startup indexing and tool registration
    - Unit tests for query logic; integration test for MCP tool round-trip
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [x] 2.8 FileWatcher integration
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Lead**: Lina
    - Implement FileWatcher monitoring `src/components/core/` for schema.yaml, contracts.yaml, component-meta.yaml changes
    - On file change: identify affected component, call `reindexComponent()`
    - Debounce rapid changes (same pattern as docs MCP FileWatcher)
    - Integration test: modify source file, verify re-index and subsequent query reflects change
    - _Requirements: 1.2_

  - [x] 2.9 QueryEngine refinements (audit findings)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Lead**: Lina | **Review**: Thurgood (verify fixes match findings)
    - Fix `handleFind` to combine filters: when multiple parameters are passed (category + platform, concept + purpose, etc.), intersect results instead of early-returning on the first filter. _Current behavior: only first filter applied, rest ignored._
    - Add basic relevance ordering to `searchByPurpose()`: purpose match ranked above description-only match, alphabetical within each tier. _Current behavior: flat substring match in Map iteration order._
    - Update QueryEngine tests: multi-filter combination test, purpose ranking order test
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 3. Semantic Annotations

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - All 28 components have component-meta.yaml files
  - All files parse without errors and are indexed by the component MCP
  - Alternatives cross-references are valid (referenced components exist in catalog)
  - Purpose strings are agent-selection-oriented (not implementation descriptions)

  **Primary Artifacts:**
  - 28 `component-meta.yaml` files across `src/components/core/*/`
  - Component-meta.yaml authoring guide

  **Completion Documentation:**
  - Detailed: `.kiro/specs/064-component-metadata-schema/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/064-component-metadata-schema/task-3-summary.md`

  **Post-Completion:**
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 3 Complete: Semantic Annotations"`
  - Verify: Check GitHub for committed changes

  - [x] 3.1 Create authoring guide
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    **Lead**: Lina
    - Write component-meta.yaml authoring guide: field descriptions, examples, purpose string guidance, alternatives convention
    - Include a complete example (Badge-Count-Base) and a minimal example
    - Place at `docs/component-meta-authoring-guide.md`
    - _Requirements: 9.2, 9.5_

  - [x] 3.2 Author component-meta.yaml for all 28 components
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Lead**: Lina | **Review**: Ada (token-adjacent components)
    - Create component-meta.yaml for each of the 28 components following the authoring guide
    - Ensure `purpose` is agent-selection-oriented, not a copy of schema.yaml `description:`
    - Ensure `alternatives` reference valid component names
    - Ensure `contexts` reflect actual UI usage patterns
    - Verify all 28 files parse and index without errors
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 4. A2UI Mapping Exercise and Documentation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Mapping exercise completed for 3 representative components (Badge-Count-Base, Badge-Count-Notification, Container-Card-Base)
  - Translation gaps identified and classified (schema omission vs. renderer bridge concern)
  - Schema adjusted if genuine omissions found
  - Data contracts pause point evaluated — decision documented
  - Schema format reference, MCP query interface docs, and component-meta authoring guide complete
  - Contract-System-Reference.md updated if contract conventions were modified

  **Primary Artifacts:**
  - `.kiro/specs/064-component-metadata-schema/findings/a2ui-mapping-exercise.md`
  - `docs/component-metadata-schema-reference.md` (schema format reference)
  - `docs/component-mcp-query-guide.md` (MCP query interface docs)
  - Updated Contract-System-Reference.md (if needed)

  **Completion Documentation:**
  - Detailed: `.kiro/specs/064-component-metadata-schema/completion/task-4-parent-completion.md`
  - Summary: `docs/specs/064-component-metadata-schema/task-4-summary.md`

  **Post-Completion:**
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 4 Complete: A2UI Validation and Documentation"`
  - Verify: Check GitHub for committed changes

  - [x] 4.1 A2UI mapping exercise
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    **Lead**: Lina (Phase 1) → Thurgood (Phase 2) | **Review**: Peter (Phase 3 — pause point decision)

    **Phase 1 — Assembled metadata drafts (Lina):**
    - Query the component MCP for assembled JSON output for Badge-Count-Base (simple primitive), Badge-Count-Notification (inheritance), Container-Card-Base (composition + conditional rules)
    - Also capture Progress-Stepper-Detailed output for the data contracts pause point evaluation
    - Deliver 4 assembled JSON outputs for Phase 2

    **Phase 2 — Mapping exercise (Thurgood):**
    - Map each field from the 3 representative components to A2UI v0.9 component description model
    - Identify gaps: what can't translate? Classify each as schema omission or renderer bridge concern
    - **Data contracts pause point**: Using Progress-Stepper-Detailed output, evaluate whether agents can construct correct invocations for `StepDefinition[]` without formal data shapes
    - Document findings in `findings/a2ui-mapping-exercise.md`

    **Phase 3 — Decision point (Peter):**
    - Review mapping findings and gap classifications
    - Decide: defer data contracts or add `data_shapes:` to component-meta.yaml
    - If schema omissions found: Lina adjusts data models and implementation

    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [x] 4.2 Schema format reference documentation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Lead**: Lina
    - Document all fields in the assembled ComponentMetadata JSON: type, source file, required/optional, description
    - Include a complete example response for one component
    - Document progressive disclosure tiers with example responses at each level
    - Place at `docs/component-metadata-schema-reference.md`
    - _Requirements: 9.1_

  - [x] 4.3 MCP query interface documentation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Lead**: Lina
    - Document all MCP tools: name, parameters, return type, example request/response
    - Include usage patterns: "How to find a component for email input", "How to check if Badge can go inside Card"
    - Place at `docs/component-mcp-query-guide.md`
    - _Requirements: 9.3_

  - [x] 4.4 Contract-System-Reference.md update (if needed)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Lead**: Thurgood | **Review**: Peter (ballot measure)
    - Review whether any contract system conventions were extended or modified during 064 execution
    - If yes: draft update as ballot measure proposal for Peter's approval, then apply
    - If no: document "no changes needed" in completion docs
    - _Requirements: 9.4_

---
