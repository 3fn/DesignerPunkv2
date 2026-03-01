# Implementation Plan: Schema Completion and Contract Audit Resolution

**Date**: 2026-03-01
**Spec**: 066 - Schema Completion
**Status**: Implementation Planning
**Dependencies**: 064 (Component Metadata Schema — COMPLETE), 063 (Uniform Contract System — COMPLETE)

---

## Implementation Plan

The work is organized into 4 parent tasks. Task 1 (MCP model evolution) must complete first — it provides the `internal`, `children.requires`, `omits`, and `resolvedTokens` fields that the schemas need. Task 2 (schema creation) is the bulk of the work. Task 3 (contract audit resolution) can run in parallel with Task 2. Task 4 (verification and migration) runs last.

**Agent assignments by subtask:**

| Subtask | Lead | Review | Consult |
|---------|------|--------|---------|
| 1.1 Model + parser updates | Lina | — | — |
| 1.2 InheritanceResolver omits | Lina | Thurgood (edge cases) | — |
| 1.3 CompositionChecker update | Lina | — | — |
| 1.4 Resolved token assembly | Lina | — | — |
| 1.5 Existing schema migration | Lina | Thurgood (verify migration) | — |
| 2.1 Avatar-Base schema | Lina | — | — |
| 2.2 Button-Icon schema | Lina | — | — |
| 2.3 Button-VerticalList-Item schema | Lina | — | — |
| 2.4 Button-VerticalList-Set schema | Lina | — | — |
| 2.5 Input-Checkbox-Base schema | Lina | — | — |
| 2.6 Input-Checkbox-Legal schema | Lina | Thurgood (omits verification) | — |
| 2.7 Input-Radio-Base schema | Lina | — | — |
| 2.8 Input-Radio-Set schema | Lina | — | — |
| 2.9 Blend token audit (existing schemas) | Lina | — | Ada (blend token accuracy) |
| 3.1 Avatar-Base hover clarification | Lina | — | — |
| 3.2 Chip-Base missing interactions | Lina | Thurgood (contract audit) | — |
| 3.3 state_disabled investigation | Lina + Thurgood | Peter (classification decisions) | — |
| 4.1 Catalog integrity verification | Thurgood | — | — |
| 4.2 Documentation updates | Lina | — | — |

---

## Task List

- [x] 1. Component MCP Model Evolution

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - `CompositionDefinition` uses `internal`/`children.requires` structure
  - `omits` field parsed from schema YAML and applied during inheritance resolution
  - `resolvedTokens` assembled from composition graph at depth-1
  - All existing component MCP tests pass after model changes (updated, not deleted)
  - Existing schemas migrated from `composes` to `internal`

  **Primary Artifacts:**
  - Updated `component-mcp-server/src/models/index.ts`
  - Updated parsers, InheritanceResolver, CompositionChecker, ComponentIndexer
  - Migrated existing schema.yaml files

  **Completion Documentation:**
  - Detailed: `.kiro/specs/066-schema-completion/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/066-schema-completion/task-1-summary.md`

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Component MCP Model Evolution"`

  - [x] 1.1 Update models, parsers, and types
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Lead**: Lina
    - Update `CompositionDefinition` interface: rename `composes` → `internal`, add `children.requires`
    - Add `omits: string[]` to schema parsing output
    - Add `resolvedTokens: { own: string[], composed: Record<string, string[]> }` to `ComponentMetadata`
    - Update schema YAML parser to read `internal`, `children.requires`, `omits` — clean break, no backward compatibility for `composes` (all schemas migrated in 1.5)
    - Update existing parser tests
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 4.1_

  - [x] 1.2 Update InheritanceResolver for omits
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Lead**: Lina | **Review**: Thurgood
    - When resolving inheritance, filter properties listed in child's `omits` from the merged property set
    - Warn when `omits` references a property not found on the parent
    - Add tests: omit existing prop, omit nonexistent prop (warning), omit with no parent (no-op)
    - _Requirements: 3.2, 3.3, 3.4_

  - [x] 1.3 Update CompositionChecker
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Lead**: Lina
    - Update `check()` to validate against new composition structure
    - `requires` validation: presence check — are all required component types present in the child set? (e.g., "does this Set contain at least one Radio-Base?")
    - `allowed` validation: type filter — is this specific child type permitted? (e.g., "can a Radio-Base go inside this Set?")
    - `prohibited` validation: type exclusion — is this child type explicitly forbidden?
    - These are distinct checks: `requires` answers "is the composition complete?", `allowed`/`prohibited` answer "is this child valid?"
    - Update existing composition tests for new field names and dual validation
    - _Requirements: 2.6_

  - [x] 1.4 Add resolved token assembly to ComponentIndexer
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Lead**: Lina
    - After indexing all components, traverse `internal` and `children.requires` relationships
    - For each composed child that is indexed, collect its `tokens` list
    - Populate `resolvedTokens.own` (same as `tokens`) and `resolvedTokens.composed` (keyed by child name)
    - Depth-1 only — do not recurse into children's compositions
    - Warn if composed child is not indexed (empty array, warning surfaced)
    - Add tests: resolved tokens with indexed child, with unindexed child (warning), depth-1 limit
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 1.5 Migrate existing schemas
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Lead**: Lina | **Review**: Thurgood
    - Identify all schemas currently using `composes` field — rename to `internal`
    - Add `children.requires` where applicable (Set/pattern components)
    - Add `omits` to 4 existing schemas that use `Omit<>` in types.ts: Chip-Input (`onPress`), Input-Text-Email (`type`, `autocomplete`), Input-Text-Password (`type`, `autocomplete`), Input-Text-PhoneNumber (`type`, `autocomplete`)
    - Verify component MCP indexes all migrated components without warnings
    - _Requirements: 2.5, 3.1_

- [ ] 2. Schema Creation (8 Components)

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - 8 new schema.yaml files created, one per component
  - Each schema verified against all 3 platform implementations
  - Token lists include blend tokens where applicable
  - Blend token completeness audited across all 20 existing schemas
  - Component MCP indexes all 8 without warnings
  - Composition relationships documented for Set/pattern components
  - `omits` declared for Input-Checkbox-Legal

  **Primary Artifacts:**
  - 8 new schema.yaml files in `src/components/core/[ComponentName]/`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/066-schema-completion/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/066-schema-completion/task-2-summary.md`

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 2 Complete: Schema Creation — 8 Components"`

  - [ ] 2.1 Avatar-Base schema
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Lead**: Lina
    - Read types.ts for props, types, defaults
    - Read `.tokens.ts` for component tokens and their primitive references. Independently scan platform files (CSS/Swift/Kotlin) for all directly consumed tokens (color, spacing, motion, blend, accessibility). Token list is the union of both sources.
    - Create schema.yaml with full property definitions
    - Include blend tokens (blend.hoverDarker, etc.) in token list
    - Verify MCP indexes Avatar-Base without warnings
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [ ] 2.2 Button-Icon schema
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Lead**: Lina
    - Read types.ts for props, types, defaults
    - Read `.tokens.ts` for component tokens and their primitive references. Independently scan platform files (CSS/Swift/Kotlin) for all directly consumed tokens. Token list is the union of both sources.
    - Create schema.yaml — standalone type, no inheritance
    - Include blend tokens in token list
    - Verify MCP indexes without warnings
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [ ] 2.3 Button-VerticalList-Item schema
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Lead**: Lina
    - Read types.ts for props, types, defaults
    - Read `.tokens.ts` for component tokens and their primitive references. Independently scan platform files (CSS/Swift/Kotlin) for all directly consumed tokens. Token list is the union of both sources.
    - Create schema.yaml — item component within VerticalList pattern
    - Include blend tokens in token list
    - Verify MCP indexes without warnings
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [ ] 2.4 Button-VerticalList-Set schema
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Lead**: Lina
    - Read types.ts for props, types, defaults
    - Read `.tokens.ts` for component tokens and their primitive references. Independently scan platform files (CSS/Swift/Kotlin) for all directly consumed tokens. Token list is the union of both sources.
    - Create schema.yaml with composition: `children.requires: [Button-VerticalList-Item]`
    - Document cardinality constraints from types.ts
    - Verify MCP indexes and composition checker validates Set → Item
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3_

  - [ ] 2.5 Input-Checkbox-Base schema
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Lead**: Lina
    - Read types.ts for props, types, defaults
    - Read `.tokens.ts` for component tokens and their primitive references. Independently scan platform files (CSS/Swift/Kotlin) for all directly consumed tokens. Token list is the union of both sources.
    - Create schema.yaml — primitive type, parent for Legal
    - Include blend tokens in token list
    - Verify MCP indexes without warnings
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [ ] 2.6 Input-Checkbox-Legal schema
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Lead**: Lina | **Review**: Thurgood
    - Read types.ts — note `Omit<InputCheckboxBaseProps, 'size' | 'indeterminate' | 'labelAlign'>`
    - Create schema.yaml with `inherits: Input-Checkbox-Base` and `omits: [size, indeterminate, labelAlign]`
    - Document only Legal's own props (requiresExplicitConsent, onConsentChange, legalTextId, legalTextVersion, showRequiredIndicator)
    - Verify MCP resolves inheritance correctly — omitted props absent from assembled metadata
    - _Requirements: 1.1, 1.2, 1.3, 1.5, 3.1, 3.2_

  - [ ] 2.7 Input-Radio-Base schema
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Lead**: Lina
    - Read types.ts for props, types, defaults
    - Read `.tokens.ts` for component tokens and their primitive references. Independently scan platform files (CSS/Swift/Kotlin) for all directly consumed tokens. Token list is the union of both sources.
    - Create schema.yaml — primitive type, composed by Radio-Set
    - Include blend tokens in token list
    - Verify MCP indexes without warnings
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [ ] 2.8 Input-Radio-Set schema
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Lead**: Lina
    - Read types.ts for props, types, defaults
    - Read `.tokens.ts` for component tokens and their primitive references. Independently scan platform files (CSS/Swift/Kotlin) for all directly consumed tokens. Token list is the union of both sources.
    - Create schema.yaml with composition: `children.requires: [Input-Radio-Base]`
    - Document cardinality constraints and mode prop
    - Verify MCP indexes and composition checker validates Set → Radio-Base
    - Verify `resolvedTokens.composed` includes Radio-Base's tokens
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 4.1, 4.2_

  - [ ] 2.9 Audit blend token completeness in existing schemas
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Lead**: Lina | **Consult**: Ada (blend token accuracy)
    - For each of the 20 existing schemas, scan platform files for blend token usage (blend.hoverDarker, blend.pressedDarker, blend.focusLighter, etc.)
    - Compare against each schema's current token list
    - Add missing blend tokens to schema token lists
    - Verify MCP re-indexes updated components without warnings
    - _Requirements: 1.4, 5.5_

- [ ] 3. Contract Audit Resolution

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Avatar-Base hover contract clarified (pointer-only note)
  - Chip-Base investigated and missing interaction contracts added if behavior exists
  - state_disabled classified for all 9 affected components
  - Contracts added for gap classifications on the 8 components being schemaed
  - Findings documented for components outside the 8

  **Primary Artifacts:**
  - Updated contracts.yaml files
  - `.kiro/specs/066-schema-completion/findings/state-disabled-classification.md`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/066-schema-completion/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/066-schema-completion/task-3-summary.md`

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 3 Complete: Contract Audit Resolution"`

  - [ ] 3.1 Avatar-Base hover clarification
    **Type**: Implementation
    **Validation**: Tier 1 - Minimal
    **Lead**: Lina
    - Add clarifying note to Avatar-Base's `interaction_hover` contract behavior field: pointer-only, no keyboard equivalent
    - _Requirements: 5.1_

  - [ ] 3.2 Chip-Base missing interaction contracts
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Lead**: Lina | **Review**: Thurgood
    - Read Chip-Base web, iOS, Android platform files for hover, pressed, focus ring behavior
    - IF behavior exists: add `interaction_hover`, `interaction_pressed`, `interaction_focus_ring` contracts
    - IF behavior absent: document as implementation gap with WCAG 2.4.7 note (focus ring is required for focusable elements)
    - _Requirements: 5.2_

  - [ ] 3.3 state_disabled investigation and classification
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    **Lead**: Lina + Thurgood | **Review**: Peter
    - For each of 9 affected components: read platform implementations for disabled prop support
    - Classify each as: gap, intentional, or deferred
    - For gap classifications on the 6 components being schemaed (Button-Icon, Button-VerticalList-Item, Button-VerticalList-Set, Input-Checkbox-Base, Input-Radio-Base, Input-Radio-Set): add `state_disabled` contract
    - For the 3 Chip family components NOT being schemaed (Chip-Base, Chip-Filter, Chip-Input): document findings only
    - Write findings to `findings/state-disabled-classification.md`
    - Present classifications to Peter for review before applying contract changes
    - _Requirements: 5.3, 5.4_

- [ ] 4. Verification and Documentation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - `get_component_health` reports 28/28 indexed, zero errors
  - All component MCP tests pass (existing + new)
  - Component-Schema-Format.md updated with `internal`, `children.requires`, `omits` fields
  - Schema reference doc updated with `resolvedTokens` field

  **Primary Artifacts:**
  - Updated steering and reference docs
  - Integration test results

  **Completion Documentation:**
  - Detailed: `.kiro/specs/066-schema-completion/completion/task-4-parent-completion.md`
  - Summary: `docs/specs/066-schema-completion/task-4-summary.md`

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 4 Complete: Verification and Documentation"`

  - [ ] 4.1 Catalog integrity verification
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    **Lead**: Thurgood
    - Run component MCP and verify `get_component_health` reports 28/28 indexed
    - Verify zero "no schema.yaml" warnings
    - Run full component MCP test suite — zero failures
    - Spot-check 3 new components: verify assembled metadata matches source files
    - Spot-check Input-Checkbox-Legal: verify omitted props absent from assembled response
    - Spot-check Input-Radio-Set: verify `resolvedTokens.composed` includes Radio-Base tokens
    - _Requirements: 6.1, 6.2, 6.3_

  - [ ] 4.2 Documentation updates
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Lead**: Lina
    - Update Component-Schema-Format.md with `internal`, `children.requires`, `omits` field definitions
    - Update `docs/component-metadata-schema-reference.md` with `resolvedTokens` and `omits` fields
    - Update `docs/component-mcp-query-guide.md` if any tool responses changed shape
    - Draft ballot measure for Component-Development-Standards.md: update Phase 3 (Schema Definition) to remove `contracts:` from schema template (contracts live in contracts.yaml), add `composition` with `internal`/`children.requires`, add `omits` for inheriting components, update Quick Reference Checklist to include contracts.yaml and component-meta.yaml creation steps
    - Draft ballot measure for Component-Development-Guide.md: add `schema.yaml`, `contracts.yaml`, `component-meta.yaml`, and `.tokens.ts` to the Component Structure Pattern file organization listing
    - Present both ballot measures to Peter for approval before applying
    - _Requirements: 6.1_

---
