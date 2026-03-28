# Implementation Plan: Component Discoverability & Metadata Infrastructure

**Date**: 2026-03-28
**Spec**: 086 - Component Discoverability & Metadata Infrastructure
**Status**: Implementation Planning
**Dependencies**: None (Spec 081 depends on this spec)

---

## Task List

- [x] 1. Immediate Enrichment & Benchmarks

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Baseline benchmark captured before any changes
  - High-impact purpose fields improved for worst-performing components
  - Post-enrichment benchmarks show measurable improvement
  - `find_components({ purpose: "filter bar" })` returns Chip-Filter

  **Primary Artifacts:**
  - Benchmark results (before/after)
  - Updated `component-meta.yaml` files (manual edits, later replaced by extraction)

  **Completion Documentation:**
  - Detailed: `.kiro/specs/086-component-meta-extraction-pipeline/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/086-component-meta-extraction-pipeline/task-1-summary.md`

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Immediate Enrichment & Benchmarks"`

  - [x] 1.1 Capture baseline benchmarks
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Thurgood
    - Run all 8 benchmark queries and document results
    - Capture as a reproducible script or documented procedure
    - _Requirements: 1.3, 1.4_

  - [x] 1.2 Enrich high-impact purpose fields
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Manually update purpose fields for components that fail benchmark queries
    - Reference specific search terms from Leonardo's research doc (`research/leonardo.md` Tasks 1-5) and benchmark query set (design.md Decision 1)
    - Prioritize: Chip-Filter, Container-Card-Base, Badge-Count-Base, Container-Base, Input-Checkbox-Base
    - _Requirements: 1.1, 1.2_

  - [x] 1.3 Capture post-enrichment benchmarks
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Thurgood
    - Re-run all 8 benchmark queries and document results
    - Compare against baseline, document improvement
    - _Requirements: 1.3_

- [x] 2. Readiness Infrastructure

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Per-platform readiness visible via Application MCP queries
  - Readiness compliance test passes for all components
  - All 28+ schemas migrated to per-platform reviewed flags
  - Baseline gate enforced (incomplete component-level artifacts cap platforms at scaffold)

  **Primary Artifacts:**
  - Application MCP indexer enhancement
  - Updated `schema.yaml` files (28+)
  - Readiness compliance test

  **Completion Documentation:**
  - Detailed: `.kiro/specs/086-component-meta-extraction-pipeline/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/086-component-meta-extraction-pipeline/task-2-summary.md`

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 2 Complete: Readiness Infrastructure"`

  - [x] 2.1 Migrate schemas to per-platform readiness
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Update all component schemas from single `readiness` field to per-platform `reviewed` flags
    - Set `reviewed: true` for components Lina has verified, `reviewed: false` for others
    - Add `not-applicable` with reason where platforms are intentionally unsupported
    - _Requirements: 4.5, 4.8_

  - [x] 2.2 Enhance Application MCP indexer
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    **Agent**: Lina (implements) + Thurgood (reviews)
    - Implement filesystem scan for platform artifact presence
    - Implement baseline gate (component-level artifacts as prerequisite)
    - Implement status derivation logic per design Decision 4
    - Exclude build artifacts from scan
    - Serve per-platform readiness in component queries
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.6, 4.7_

  - [x] 2.3 Write readiness compliance test
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Thurgood
    **Depends on**: Task 2.2 (indexer must be enhanced first)
    - Validate derived status matches filesystem state for all components × platforms
    - Run as part of `npm test`
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 3. Extraction Pipeline

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - All components have generated `component-meta.yaml` from family docs
  - Controlled vocabulary defined with consumer search terms
  - Extraction script validates contexts, warns on gaps
  - Generated files committed to git with visible diffs
  - Application MCP health check passes with zero warnings

  **Primary Artifacts:**
  - Controlled vocabulary definition
  - Updated Component-Family steering docs (structured metadata blocks)
  - Extraction script
  - Generated `component-meta.yaml` files

  **Completion Documentation:**
  - Detailed: `.kiro/specs/086-component-meta-extraction-pipeline/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/086-component-meta-extraction-pipeline/task-3-summary.md`

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 3 Complete: Extraction Pipeline"`

  - [x] 3.1 Define controlled vocabulary
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina + Leonardo (consumer terms)
    - Define 14 canonical context values with consumer search terms per value
    - Publish in authoring guide / Component-MCP-Document-Template
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 3.2 Audit family doc coverage
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Identify which of the 28+ components have family docs
    - Identify which family docs are placeholders vs. have real content
    - Identify which family docs have per-component selection tables vs. family-level guidance only
    - Document findings — informs extraction script derivation rules
    - _Requirements: 3.3_

  - [x] 3.3 Add structured metadata blocks to family docs
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    **Depends on**: Tasks 3.1 (vocabulary) and 3.2 (audit)
    - Add `### [Component] — Metadata` blocks with purpose and contexts to all family docs with real content
    - Use controlled vocabulary for contexts
    - Use Leonardo's search terms for purpose phrasing
    - Update Component-MCP-Document-Template with new format
    - _Requirements: 3.1, 3.2, 3.8_

  - [ ] 3.4 Build extraction script
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    **Agent**: Lina
    **Depends on**: Tasks 3.1, 3.2, 3.3
    - Parse structured metadata blocks (purpose, contexts)
    - Derive usage from family doc sections (two-tier: per-component preferred, family-level fallback with YAML comment marking)
    - Derive alternatives from selection tables
    - Validate contexts against controlled vocabulary (warn on non-vocabulary)
    - Warn on: missing metadata blocks, short/empty purpose, empty usage derivation, phantom alternative references
    - Generate `component-meta.yaml` per component
    - Entry point: `npm run extract:meta`
    - _Requirements: 2.4, 3.3, 3.4, 3.5, 3.6, 3.7_

  - [ ] 3.5 Run extraction and validate
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina + Thurgood (MCP verification)
    **Depends on**: Task 3.4
    - Run extraction script against all family docs
    - Compare generated meta files against existing hand-authored files — this is a quality gate: if generated output is worse (fewer when_to_use entries, lower benchmark scores, empty sections where manual had content), block replacement until fixed
    - Resolve warnings
    - Commit generated files to git
    - Verify Application MCP health check passes
    - Run post-extraction benchmarks (same 8 queries), compare against baseline and post-enrichment snapshots
    - _Requirements: 3.4, 3.5_

- [ ] 4. Agent Configuration & Governance

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Platform agents confirm knowledge base improves workflow
  - Platform Resource Map steering doc created
  - Stacy's prompt updated with metadata accuracy lens
  - Escape hatch documentation pattern available
  - Reference docs queryable via Documentation MCP

  **Primary Artifacts:**
  - Updated agent `.json` configs (Sparky, Kenya, Data)
  - `.kiro/steering/Platform-Resource-Map.md`
  - Updated Stacy prompt
  - Updated reference docs with metadata headers

  **Completion Documentation:**
  - Detailed: `.kiro/specs/086-component-meta-extraction-pipeline/completion/task-4-parent-completion.md`
  - Summary: `docs/specs/086-component-meta-extraction-pipeline/task-4-summary.md`

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 4 Complete: Agent Configuration & Governance"`

  - [ ] 4.1 Configure platform agent knowledge bases
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    **Agent**: Peter
    - Add knowledge base entries to Sparky, Kenya, Data agent configs per design Decision 5
    - Include platform files, types, tokens, contracts, platform-specific token files
    - _Requirements: 6.1_

  - [ ] 4.2 Create Platform Resource Map
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Thurgood
    - Create `.kiro/steering/Platform-Resource-Map.md` with resource type × platform table
    - Include `src/tokens/semantic/` as canonical token name reference
    - Include "Last Updated" date and maintenance note: update when new components are added or directory structure changes
    - Keep factual and minimal
    - _Requirements: 6.2, 6.3_

  - [ ] 4.3 Platform agent workflow validation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Sparky + Kenya + Data
    - Each platform agent confirms knowledge base configuration improves their workflow
    - Document any gaps or adjustments needed
    - _Requirements: 6.4_

  - [ ] 4.4 Update Stacy's prompt
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    **Agent**: Peter
    - Add metadata accuracy lens to Lessons Synthesis Review section
    - _Requirements: 7.1_

  - [ ] 4.5 Define escape hatch documentation pattern
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Thurgood
    - Document the structured escape hatch format in Process-Spec-Planning or a dedicated governance doc
    - Include: date, guidance reference, actual choice, reason, migration trigger
    - Document resolution path: deviation + disagreement = escape hatch with rationale
    - _Requirements: 7.2, 7.3, 7.4, 7.5_

  - [ ] 4.6a Migrate reference docs to Documentation MCP
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Thurgood
    - Add metadata headers to 3 reference docs for Documentation MCP formatting and indexing
    - Verify all 3 docs queryable via `get_section()`
    - _Requirements: 8.1, 8.2_

  - [ ] 4.6b Update authoring guide content
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    **Depends on**: Task 3 (extraction workflow must exist before guide can describe it)
    - Update authoring guide content to reflect extraction workflow (authoring in family docs, not meta files)
    - _Requirements: 8.3_

- [ ] 5. MCP Scope Split Design

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Scope boundary documented and validated
  - Readiness model confirmed reliable (prerequisite for Spec 081)
  - Design decision captured for Spec 081 consumption

  **Primary Artifacts:**
  - Scope boundary documentation (in this spec's completion docs or a steering doc)

  **Completion Documentation:**
  - Detailed: `.kiro/specs/086-component-meta-extraction-pipeline/completion/task-5-parent-completion.md`
  - Summary: `docs/specs/086-component-meta-extraction-pipeline/task-5-summary.md`

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 5 Complete: MCP Scope Split Design"`

  - [ ] 5.1 Document scope boundary
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    **Agent**: Thurgood + Leonardo
    - Document Application MCP vs Product MCP content ownership
    - Document "content organization, not access control" principle
    - Document readiness dependency (readiness must be reliable before split)
    - Note inline readiness as a requirement for Spec 081
    - Note experience pattern migration concern: what happens to existing patterns in Application MCP during transition (cutover plan for Spec 081)
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [ ] 5.2 Validate readiness model reliability
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Thurgood
    **Depends on**: Task 2 (readiness infrastructure complete)
    - Run readiness compliance test
    - Verify per-platform readiness is accurate for all components
    - Confirm readiness data is trustworthy enough for Product MCP consumption
    - _Requirements: 9.3_
