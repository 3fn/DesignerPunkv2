# Implementation Plan: Application MCP Completeness

**Date**: 2026-03-08
**Spec**: 071 - Application MCP Completeness
**Status**: Implementation Planning
**Dependencies**:
- Spec 068 (Family Guidance Indexer) - Complete

---

## Implementation Plan

Family guidance YAML files are authored vertically — Chips first as the reference family, then replicated across the remaining 4 production families. Icon asset expansion runs as a prerequisite to the Icon family guidance.

### Authoring Method

**Primary method: Structured extraction.** The existing family steering docs, component contracts, and schemas contain the source material for guidance YAMLs. The authoring agent reads these documents and drafts the YAML as a structured extraction of existing knowledge, then presents it for review.

**Fallback method: Interview.** If a family's steering doc is too thin to extract meaningful guidance, or if the authoring agent (Ada, Lina, or Thurgood) determines that the drafted YAML has gaps that require more context than available documentation provides, the agent may request an interview session with Peter to surface the missing guidance. This mirrors the interview-driven process used in Spec 068 Phase 2.

**Chips exception:** Task 1 (Chips, reference family) uses a light interview approach for the new schema additions (discouraged patterns, cross-family refs, platform variants) since these fields haven't been authored before. The interview focuses on: "What are common Chips mistakes?" and "Where do Chips blur with other families?" — not the full 068 interview cycle.

**Decision authority:** The authoring agent determines whether extraction is sufficient or an interview is needed. This is a quality judgment, not a process gate — if the agent feels the YAML is thin, they escalate to interview rather than shipping shallow guidance.

---

## Task List

- [x] 1. Chips Family Guidance (Reference Family)

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Chips companion YAML authored with full enriched schema (selection rules, discouraged patterns, cross-family refs, accessibility notes)
  - Schema additions validated — discouraged patterns, cross-family composition references, and platform variants (if applicable) are well-structured and useful
  - D9 compliance passed
  - Peter approves as reference for remaining families
  - FamilyGuidanceIndexer indexes Chips family successfully

  **Primary Artifacts:**
  - `family-guidance/chips.yaml`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/071-application-mcp-completeness/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/071-application-mcp-completeness/task-1-summary.md`

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Chips Family Guidance (Reference)"`
  - Verify: FamilyGuidanceIndexer reports 4 families indexed
  - Gate: Peter reviews and approves schema before proceeding to Task 2

  - [x] 1.1 Read Chips family steering doc and existing YAML schema
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    **Agent**: Lina (component domain knowledge)
    - Read `.kiro/steering/Component-Family-Chip.md` for family structure, components, behavioral contracts
    - Review existing YAML files (button.yaml, form-inputs.yaml, container.yaml) for schema patterns
    - Identify selection scenarios, discouraged patterns, and cross-family relationships
    - _Requirements: 1, 2, 4, 6_

  - [x] 1.2 Author chips.yaml with enriched schema
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (primary author), Ada (token reference review)
    - Light interview with Peter for new schema fields: discouraged patterns ("What are common Chips mistakes?"), cross-family boundaries ("Where do Chips blur with Form Inputs or Buttons?"), platform conventions (if any)
    - Write `family-guidance/chips.yaml` with: whenToUse, whenNotToUse, selectionRules (Base vs Filter vs Input), discouragedPatterns, composesWithFamilies, accessibilityNotes, patterns
    - Include rationale for each discouraged pattern
    - Include cross-family refs (Chips + Form Inputs boundary, Chips + Buttons boundary)
    - Follow read-both protocol (companion reference)
    - Verify component-meta.yaml files for Chip-Base, Chip-Filter, Chip-Input align with family YAML guidance (no conflicting whenToUse/whenNotToUse)
    - _Requirements: 1, 2, 4, 6, 7_

  - [x] 1.3 D9 compliance validation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Run D9 compliance check (Ada's domain — flag for Ada)
    - Verify all `recommend` values match component catalog
    - Verify all `relatedPatterns` match pattern index
    - Fix any compliance issues
    - _Requirements: 1.4_

  - [x] 1.4 Schema review gate
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    **Agent**: Thurgood (facilitates review), Peter (approves)
    - Present Chips YAML to Peter for review
    - Evaluate: Are discouraged patterns useful or over-engineered?
    - Evaluate: Are cross-family refs helpful or noise?
    - Evaluate: Is the depth model right for replication?
    - Document Peter's feedback and any schema adjustments
    - _Requirements: 6_

---

- [x] 2. Progress Family Guidance

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Progress companion YAML authored following validated schema from Task 1
  - Covers all 6 components with composition guidance (Node inside Stepper, Stepper inside Pagination)
  - Discouraged patterns address common misuse (pagination for < 5 items, stepper without labels)
  - D9 compliance passed
  - FamilyGuidanceIndexer indexes Progress family successfully

  **Primary Artifacts:**
  - `family-guidance/progress.yaml`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/071-application-mcp-completeness/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/071-application-mcp-completeness/task-2-summary.md`

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 2 Complete: Progress Family Guidance"`
  - Verify: FamilyGuidanceIndexer reports 5 families indexed

  - [x] 2.1 Read Progress family steering doc and component contracts
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    **Agent**: Lina (built the Progress components and render-all-dots architecture)
    - Read `.kiro/steering/Component-Family-Progress.md` (if exists) or component-level docs
    - Review contracts.yaml for all 6 Progress components
    - Identify composition hierarchy, selection scenarios, platform divergence
    - **Authoring method**: Structured extraction. If steering doc is insufficient for meaningful guidance, request interview with Peter.
    - _Requirements: 1, 2, 3_

  - [x] 2.2 Author progress.yaml
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (primary author), Ada (D9 compliance + token reference review)
    - Write `family-guidance/progress.yaml` following schema validated in Task 1
    - Cover Pagination vs Stepper vs Stepper-Detailed selection
    - Cover sub-component composition (when to use Node/Connector/Label directly vs through parent)
    - Include platform-variant conventions if applicable (render-all-dots web vs native scroll)
    - Include discouraged patterns and cross-family refs
    - Verify component-meta.yaml files for all 6 Progress components align with family YAML guidance
    - D9 compliance validation
    - **Fallback**: If drafted YAML has gaps the authoring agent can't resolve from documentation, escalate to interview with Peter.
    - _Requirements: 1, 2, 3, 4, 7_

---

- [x] 3. Badges Family Guidance

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Badges companion YAML authored following validated schema
  - Covers Count-Base vs Count-Notification vs Label-Base selection
  - D9 compliance passed
  - FamilyGuidanceIndexer indexes Badges family successfully

  **Primary Artifacts:**
  - `family-guidance/badges.yaml`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/071-application-mcp-completeness/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/071-application-mcp-completeness/task-3-summary.md`

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 3 Complete: Badges Family Guidance"`
  - Verify: FamilyGuidanceIndexer reports 6 families indexed

  - [x] 3.1 Read Badges family steering doc
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    **Agent**: Lina
    - Read `.kiro/steering/Component-Family-Badge.md`
    - Identify selection scenarios and composition patterns (Badge inside Button-Icon, Badge on Avatar)
    - **Authoring method**: Structured extraction. If steering doc is insufficient, request interview with Peter.
    - _Requirements: 1, 4_

  - [x] 3.2 Author badges.yaml
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (primary author), Ada (D9 compliance + token reference review)
    - Write `family-guidance/badges.yaml` following validated schema
    - Cover Count-Base vs Count-Notification vs Label-Base selection
    - Include cross-family composition refs (Badge + Button-Icon, Badge + Avatar)
    - Verify component-meta.yaml files for all 3 Badge components align with family YAML guidance
    - D9 compliance validation
    - **Fallback**: If drafted YAML has gaps, escalate to interview with Peter.
    - _Requirements: 1, 2, 4, 7_

---

- [x] 4. Icon Asset Expansion and Family Guidance

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Icon-Base expanded from 15 to ~50 icons across all three platforms
  - IconBaseName type updated with all new icon names
  - All existing tests pass
  - Icon companion YAML authored with platform-variant conventions
  - D9 compliance passed
  - FamilyGuidanceIndexer indexes Icons family successfully

  **Primary Artifacts:**
  - `src/components/core/Icon-Base/platforms/web/assets/` (new SVGs)
  - `src/components/core/Icon-Base/types.ts` (expanded IconBaseName)
  - `family-guidance/icons.yaml`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/071-application-mcp-completeness/completion/task-4-parent-completion.md`
  - Summary: `docs/specs/071-application-mcp-completeness/task-4-summary.md`

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 4 Complete: Icon Asset Expansion and Family Guidance"`
  - Verify: FamilyGuidanceIndexer reports 7 families indexed
  - Verify: All tests pass

  - [x] 4.1 Source and add Feather icon SVGs for web
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - **Prerequisite**: Peter approves final icon list before starting (no fuzzy estimates)
    - Audit existing 15 SVGs for format consistency (stroke-width, viewBox, fill vs stroke). Normalize if inconsistent.
    - Download approved Feather icon SVGs
    - Add to `src/components/core/Icon-Base/platforms/web/assets/`
    - Verify SVG format matches normalized standard
    - _Requirements: 5_

  - [x] 4.2 Add icons to iOS and Android platforms
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Add icons to iOS asset catalog (`platforms/ios/Icons.xcassets/`)
    - Add icons to Android vector drawables (`platforms/android/res/`)
    - Follow existing platform-specific format conventions
    - _Requirements: 5.3_

  - [x] 4.3 Update IconBaseName type and README
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Update `IconBaseName` union type in `types.ts` with all new icon names
    - Update Icon-Base README to reflect expanded icon set
    - Run existing tests to confirm no regressions
    - Verify every `IconBaseName` entry has a corresponding asset on all three platforms (web SVG, iOS asset catalog, Android vector drawable). If no existing test covers this, add a validation check.
    - _Requirements: 5.4, 5.5, 5.6_

  - [x] 4.4 Author icons.yaml with platform-variant conventions
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (primary author), Ada (D9 compliance + token reference review)
    - Write `family-guidance/icons.yaml` following validated schema
    - Include `platformVariants` section for share, back, overflow, and other divergent icons
    - Include selection guidance for icon usage contexts
    - Include cross-family refs (Icons + Buttons, Icons + Navigation)
    - Verify Icon-Base component-meta.yaml aligns with family YAML guidance
    - D9 compliance validation
    - **Authoring method**: Structured extraction from steering doc + platform convention research. Interview fallback if platform-variant list needs Peter's input beyond documented conventions.
    - _Requirements: 1, 3, 4, 7_

---

- [x] 5. Avatars Family Guidance

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Avatars companion YAML authored following validated schema
  - D9 compliance passed
  - FamilyGuidanceIndexer indexes all 8 production families successfully
  - `get_prop_guidance` returns non-null for all 8 production families

  **Primary Artifacts:**
  - `family-guidance/avatars.yaml`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/071-application-mcp-completeness/completion/task-5-parent-completion.md`
  - Summary: `docs/specs/071-application-mcp-completeness/task-5-summary.md`

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 5 Complete: Avatars Family Guidance"`
  - Verify: FamilyGuidanceIndexer reports 8 families indexed (full coverage)
  - Run full test suite to confirm 0 failures

  - [x] 5.1 Read Avatars family steering doc
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    **Agent**: Lina
    - Read `.kiro/steering/Component-Family-Avatar.md`
    - Identify selection scenarios (single avatar, avatar group, fallback behavior)
    - **Authoring method**: Structured extraction. Avatars is the simplest family — extraction should be sufficient. Interview fallback available if needed.
    - _Requirements: 1_

  - [x] 5.2 Author avatars.yaml
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (primary author), Ada (D9 compliance + token reference review)
    - Write `family-guidance/avatars.yaml` following validated schema
    - Include cross-family refs (Avatar + Badge for status indicators)
    - Verify Avatar-Base component-meta.yaml aligns with family YAML guidance
    - D9 compliance validation
    - **Fallback**: If drafted YAML has gaps, escalate to interview with Peter.
    - _Requirements: 1, 4, 7_

---

- [x] 6. Final Verification and Design Outline Update

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - All 8 production families return guidance from `get_prop_guidance`
  - Full test suite passes (291+ suites, 0 failures)
  - Design outline updated to reflect completed scope and deferred items
  - Component Quick Reference updated if needed

  **Primary Artifacts:**
  - Updated `.kiro/specs/071-application-mcp-completeness/design-outline.md`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/071-application-mcp-completeness/completion/task-6-parent-completion.md`
  - Summary: `docs/specs/071-application-mcp-completeness/task-6-summary.md`

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 6 Complete: Final Verification"`
  - Run full test suite
  - Verify release analysis

  - [x] 6.1 End-to-end MCP verification
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Thurgood
    - Query `get_prop_guidance` for all 8 production families
    - Verify non-null responses with expected schema fields
    - Verify FamilyGuidanceIndexer health check reports 8 families
    - Run full test suite
    - _Requirements: 1, 5.5_

  - [x] 6.2 Update design outline with completion status
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    **Agent**: Thurgood
    - Update design-outline.md: mark Gap 1 complete, note deferred items (token query, negative guidance system, cross-layer synthesis)
    - Update Component Quick Reference if family count or status changed
    - _Requirements: N/A (housekeeping)_
