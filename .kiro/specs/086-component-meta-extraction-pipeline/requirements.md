# Requirements Document: Component Discoverability & Metadata Infrastructure

**Date**: 2026-03-28
**Spec**: 086 - Component Discoverability & Metadata Infrastructure
**Status**: Requirements Phase
**Dependencies**: None (Spec 081 depends on this spec, not the reverse)

---

## Introduction

Research with 6 agents identified four root causes behind component discoverability gaps: a feedback loop gap between metadata authors and consumers, dual maintenance causing drift, readiness opacity, and a platform access gap. This spec addresses all four through metadata extraction, readiness infrastructure, agent configuration, and governance process extensions.

---

## Requirements

### Requirement 1: Immediate Discoverability Enrichment

**User Story**: As a product architect, I want high-impact purpose field improvements to land immediately, so that component discovery improves before the extraction pipeline ships.

#### Acceptance Criteria

1. WHEN `find_components({ purpose: "filter bar" })` is queried THEN the results SHALL include Chip-Filter
2. WHEN `find_components({ purpose: "stat card" })` or `find_components({ purpose: "dashboard" })` is queried THEN the results SHALL include Container-Card-Base
3. WHEN discoverability benchmarks are run using the gap report #16, #17, #18 queries THEN results SHALL show measurable improvement over the pre-enrichment baseline
4. The baseline benchmark SHALL be captured before any enrichment changes are made

### Requirement 2: Controlled Vocabulary for Contexts

**User Story**: As a component metadata author, I want a canonical list of context values with consumer search terms, so that I can tag components with predictable, validated values instead of guessing.

#### Acceptance Criteria

1. A controlled vocabulary of context values SHALL be defined and published in the authoring guide
2. Each context value SHALL include consumer search terms as reference (e.g., `dashboards` with reference terms: "stat cards, summary statistics, overview page, home screen metrics")
3. The vocabulary SHALL be informed by Leonardo's actual search terms from the Spec 086 research
4. WHEN the extraction script generates a meta file THEN it SHALL validate `contexts` values against the controlled vocabulary and warn on non-vocabulary values

### Requirement 3: Full Single Source Extraction

**User Story**: As a design system maintainer, I want component-meta.yaml files generated from Component-Family steering docs, so that metadata is maintained in one place and drift is eliminated.

#### Acceptance Criteria

1. Each Component-Family steering doc SHALL contain structured metadata blocks per component with `purpose` and `contexts` fields
2. The structured metadata block format SHALL be:
   ```markdown
   ### [Component-Name] — Metadata
   - **Purpose**: [agent-optimized, verb-first, ~30 words]
   - **Contexts**: [comma-separated controlled vocabulary values]
   ```
3. The extraction script SHALL derive `usage` (when_to_use / when_not_to_use) and `alternatives` from existing family doc sections (Usage Guidelines, selection tables)
4. The extraction script SHALL generate `component-meta.yaml` files that pass Application MCP health check with zero warnings
5. Generated meta files SHALL be committed to git — changes visible in diffs as ongoing validation
6. WHEN a family doc edit changes a generated meta file THEN the diff SHALL be visible at commit time
7. WHEN the extraction script encounters a component with no family doc metadata block THEN it SHALL warn, not silently skip
8. The Component-MCP-Document-Template SHALL be updated with the structured metadata block format

### Requirement 4: Per-Platform Readiness Model

**User Story**: As a product architect or governance specialist, I want per-platform readiness derived from the filesystem, so that I can assess which components are usable on which platforms without reading source code.

#### Acceptance Criteria

1. The Application MCP indexer SHALL derive per-platform readiness at index time from filesystem artifact presence
2. Component-level artifacts (schema, contracts, types, tokens) SHALL serve as a baseline gate — if missing, no platform can be `development` or higher
3. Platform-specific artifacts SHALL determine per-platform status:
   - Platform implementation file (`.web.ts`, `.ios.swift`, `.android.kt`)
   - Platform tests (`*.test.ts` for web, `*Tests.swift` for iOS, `*Test.kt` for Android)
4. The readiness scan SHALL NOT check for build artifacts: generated `component-meta.yaml` or generated token output
5. The `reviewed` flag and `not-applicable` reason SHALL be stored in `schema.yaml` per platform
6. Status derivation SHALL follow: `not-applicable` → `not-started` → `scaffold` → `development` → `production-ready`
7. WHEN a component query includes readiness data THEN it SHALL show per-platform status
8. A one-time migration SHALL update all existing schemas from the current single `readiness` field to per-platform `reviewed` flags

### Requirement 5: Readiness Compliance Test

**User Story**: As a test governance specialist, I want a compliance test that validates the readiness derivation matches the actual filesystem state, so that readiness data is trustworthy.

#### Acceptance Criteria

1. A compliance test SHALL verify that the indexer's derived per-platform status matches the actual filesystem artifact presence for every component
2. The test SHALL run as part of the standard test suite (`npm test`)
3. WHEN a platform implementation file exists but the derived status is `not-started` THEN the test SHALL fail
4. WHEN a `not-applicable` marker exists but the derived status is `not-started` THEN the test SHALL fail

### Requirement 6: Platform Agent Knowledge Bases

**User Story**: As a platform engineer, I want indexed, searchable access to my platform's component source files, so that I can find implementation details without manual file navigation.

#### Acceptance Criteria

1. Each platform agent (Sparky, Kenya, Data) SHALL have a knowledge base configured with:
   - Their platform's implementation files (`platforms/{platform}/`)
   - Shared `types.ts` and `tokens.ts` per component
   - `contracts.yaml` per component
   - Platform-specific token files (`src/tokens/platforms/{platform}/`)
2. A Platform Resource Map steering doc SHALL be created mapping resource types to platform-specific paths
3. The Platform Resource Map SHALL include `src/tokens/semantic/` as the canonical reference for token names
4. Platform agents SHALL confirm the knowledge base configuration improves their workflow

### Requirement 7: Governance Process Extensions

**User Story**: As a product governance specialist, I want metadata accuracy checks, selection verification gates, and escape hatch tracking, so that component selection quality is maintained as the system grows.

#### Acceptance Criteria

1. Stacy's prompt SHALL be updated to include a metadata accuracy lens in the Lessons Synthesis Review — checking for stale `whenToUse` and/or `whenNotToUse` entries, missing alternatives, and purpose fields that don't match consumer search terms
2. Selection verification SHALL be a gate in the feedback protocol — completing before platform agents receive the spec handoff
3. Escape hatch documentation SHALL follow a structured format including: date, guidance reference, actual choice, reason, and migration trigger
4. Escape hatches SHALL be tracked during Lessons Synthesis Reviews for migration opportunities
5. WHEN selection verification identifies a deviation from selection guidance AND the spec author disagrees THEN the deviation SHALL be documented as an escape hatch with rationale

### Requirement 8: Reference Doc Migration

**User Story**: As any agent, I want the component metadata reference docs queryable via the Documentation MCP, so that authoring guides and schema references are discoverable by all agents.

#### Acceptance Criteria

1. The following docs SHALL have metadata headers added for Documentation MCP formatting and indexing:
   - `docs/component-meta-authoring-guide.md`
   - `docs/component-mcp-query-guide.md`
   - `docs/component-metadata-schema-reference.md`
2. All three docs SHALL be queryable via `get_section()` after migration
3. The authoring guide SHALL be updated to reflect the extraction workflow (authoring in family docs, not meta files)

### Requirement 9: MCP Scope Split Design Decision

**User Story**: As a design system architect, I want the Application MCP and Product MCP scope boundary defined, so that Spec 081 can implement the Product MCP on a solid foundation.

#### Acceptance Criteria

1. The scope split SHALL be documented: Application MCP owns components, component patterns, composition rules, tokens, selection guidance, readiness. Product MCP owns experience patterns, layout templates, screen-level design guidance.
2. The split SHALL be content organization, not access control — all agents retain read access to both MCPs
3. The readiness model (Requirement 4) SHALL be validated as reliable before the MCP split is implemented in Spec 081
4. The cross-MCP reference mechanism (how the Product MCP surfaces readiness from the Application MCP) SHALL be deferred to Spec 081 as a design decision

### Documentation Requirements Waiver

This spec modifies metadata infrastructure and governance processes. It does not introduce new consumer-facing components or tokens. Component-level documentation requirements per Process-Spec-Planning are not applicable. The authoring guide update (Requirement 3 AC 8) and Platform Resource Map (Requirement 6 AC 2) are the documentation deliverables.
