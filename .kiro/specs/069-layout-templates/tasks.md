# Tasks Document: Layout Templates

**Date**: 2026-03-23
**Spec**: 069 - Layout Templates
**Status**: Tasks Phase
**Dependencies**: Spec 067 (Application MCP), Spec 070 (Agent Architecture), Spec 082 (Family Naming + Registry)

---

## Implementation Plan

Three parent tasks corresponding to the three deliverables: learning foundation (Task 1), steering documentation (Task 2), and template infrastructure (Task 3). Learning first establishes the knowledge base, then the steering doc codifies it, then the infrastructure implements it.

---

## Task List

- [ ] 1. Responsive Layout Learning Foundation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Peter interview conducted and insights captured
  - Established design systems studied and common patterns synthesized
  - DesignerPunk responsive token documentation reviewed
  - Thin template authoring guidance produced
  - Both Leonardo and Lina have foundational layout understanding

  **Primary Artifacts:**
  - `.kiro/specs/069-layout-templates/learning-foundation.md`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/069-layout-templates/completion/task-1-completion.md`
  - Summary: `docs/specs/069-layout-templates/task-1-summary.md`

  **Post-Completion:**
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Responsive Layout Learning Foundation"`
  - Verify: Check GitHub for committed changes

  - [ ] 1.1 Interview Peter on responsive layout decision-making
    **Type**: Documentation
    **Validation**: Tier 1 - Minimal
    **Agent**: Leonardo + Lina
    - Structured conversation with Peter about how he thinks about responsive layout
    - Topics: when content stacks vs reflows, when sidebars collapse vs disappear, how columns are allocated to regions, how max-width decisions are made, responsive vs reactive distinction in practice
    - Capture insights in `learning-foundation.md` § "Peter Interview"
    - _Requirements: Req 6_

  - [ ] 1.2 Study established design systems
    **Type**: Documentation
    **Validation**: Tier 1 - Minimal
    **Agent**: Leonardo + Lina
    - Study responsive layout guidance from Material Design, Apple HIG, Carbon, Atlassian
    - Synthesize common patterns across systems — what's universal, what's system-specific
    - Capture findings in `learning-foundation.md` § "Design System Study"
    - _Requirements: Req 6_

  - [ ] 1.3 Review DesignerPunk responsive token documentation
    **Type**: Documentation
    **Validation**: Tier 1 - Minimal
    **Agent**: Leonardo + Lina
    - Read Token-Family-Responsive.md (breakpoints, density, responsive design patterns, cross-platform usage)
    - Read Token-Family-Spacing.md § "Grid Spacing Tokens" (gutters, margins, column progression, platform patterns)
    - Map DesignerPunk's grid system against patterns found in Task 1.2
    - Capture in `learning-foundation.md` § "DesignerPunk Grid System"
    - _Requirements: Req 6_

  - [ ] 1.4 Produce template authoring guidance
    **Type**: Documentation
    **Validation**: Tier 1 - Minimal
    **Agent**: Leonardo + Lina
    - Synthesize Tasks 1.1–1.3 into thin authoring guidance: what makes a good template, what layout decisions to encode vs leave to per-screen specification
    - This becomes the source material for steering doc Section 8
    - Capture in `learning-foundation.md` § "Authoring Guidance"
    - _Requirements: Req 6_

- [ ] 2. Responsive Layout Steering Documentation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Steering doc exists at `.kiro/steering/Layout-Specification-Vocabulary.md` with all 9 sections
  - Vocabulary defines canonical terms and a consistent specification format
  - Token source map accurately identifies which family provides which concept
  - MCP-queryable grid reference available via Docs MCP
  - Both Leonardo and platform agents can use the doc for specification and implementation

  **Primary Artifacts:**
  - `.kiro/steering/Layout-Specification-Vocabulary.md`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/069-layout-templates/completion/task-2-completion.md`
  - Summary: `docs/specs/069-layout-templates/task-2-summary.md`

  **Post-Completion:**
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 2 Complete: Responsive Layout Steering Documentation"`
  - Verify: Check GitHub for committed changes

  - [ ] 2.1 Create steering document
    **Type**: Documentation
    **Validation**: Tier 2 - Standard
    **Agent**: Thurgood + Leonardo
    - Create `Layout-Specification-Vocabulary.md` as Layer 3 conditional doc
    - Sections 1-7: Token source map, grid system mental model, specification vocabulary, specification format, responsive adaptation, reactive annotations, platform translation patterns
    - Draw from Task 1 learning foundation and existing token family docs
    - Co-design vocabulary terms with template schema (Req 1 AC6) — terms used in the doc must match terms used in YAML schema
    - Include CSS grid generator relationship in Section 7
    - _Requirements: Req 1, Req 2_

  - [ ] 2.2 Add template authoring guidance and common layout patterns
    **Type**: Documentation
    **Validation**: Tier 1 - Minimal
    **Agent**: Thurgood + Lina
    - Section 8: Template authoring guidance (from Task 1.4)
    - Section 9: Common layout patterns — suggestive, evolving guidelines seeded from Task 1.2 design system study. Explicitly marked as not definitive.
    - _Requirements: Req 6_

  - [ ] 2.3 Verify MCP queryability
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Thurgood
    - Verify steering doc is indexed by Docs MCP with correct metadata
    - Verify sections are queryable via `get_section` for mid-spec lookup (Req 2)
    - Verify unified grid system view is accessible without loading full doc (Req 2 AC3)
    - Run `npm test` — all suites pass
    - _Requirements: Req 2_

- [ ] 3. Layout Template Infrastructure

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - `LayoutTemplateIndexer` parses, validates, and serves layout template YAML files
  - `list_layout_templates` and `get_layout_template` MCP tools operational
  - At least 3 candidate templates (generic scenarios) indexable and queryable
  - Full test suite passes with no regressions

  **Primary Artifacts:**
  - `application-mcp-server/src/indexer/LayoutTemplateIndexer.ts`
  - `application-mcp-server/src/indexer/__tests__/LayoutTemplateIndexer.test.ts`
  - `layout-templates/` directory with candidate templates

  **Completion Documentation:**
  - Detailed: `.kiro/specs/069-layout-templates/completion/task-3-completion.md`
  - Summary: `docs/specs/069-layout-templates/task-3-summary.md`

  **Post-Completion:**
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 3 Complete: Layout Template Infrastructure"`
  - Verify: Check GitHub for committed changes

  - [ ] 3.1 Implement LayoutTemplateIndexer
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Create `LayoutTemplateIndexer.ts` mirroring PatternIndexer architecture
    - Implement: `indexTemplates`, `getTemplate`, `getCatalog`, `getHealth`
    - Validation: required fields, source values, all four breakpoints present, column range format (N-M, 1-indexed, within breakpoint column count), maxWidth against breakpoint token allowlist, stacking order rules (positive integers, no duplicates)
    - Column counts hardcoded: `{ xs: 4, sm: 8, md: 12, lg: 16 }` with comment noting Token-Family-Spacing.md source
    - Token allowlist: `breakpointXs/Sm/Md/Lg`, `gridMarginXs/Sm/Md/Lg`
    - Add TypeScript interfaces to `models/index.ts`
    - _Requirements: Req 3_

  - [ ] 3.2 Register MCP tools
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Add `list_layout_templates` and `get_layout_template` tool definitions to `index.ts`
    - Wire tools to LayoutTemplateIndexer methods
    - Follow same patterns as `list_experience_patterns` / `get_experience_pattern`
    - Error handling: unknown template name returns `{ error: "TemplateNotFound", message: "..." }`
    - _Requirements: Req 4_

  - [ ] 3.3 Create candidate templates
    **Type**: Documentation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina + Leonardo
    - Create `layout-templates/` directory
    - Author 3 candidate templates for generic scenarios:
      - `centered-content-page.yaml` — single region, centered in grid
      - `sidebar-page.yaml` — primary + sidebar regions, sidebar stacks below at narrow viewports
      - `multi-zone-page.yaml` — 3+ regions with distinct grid behavior
    - All templates: `source: system`, all four breakpoints, token references by actual camelCase name
    - Verify all 3 are indexable and queryable through MCP tools
    - _Requirements: Req 3, Req 5_

  - [ ] 3.4 Write LayoutTemplateIndexer tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Create `LayoutTemplateIndexer.test.ts`
    - Test categories: valid template parsing (single-region, multi-region), validation errors (missing fields, invalid source, invalid column ranges, out-of-range columns, invalid maxWidth, duplicate stacking order), catalog generation, health reporting, edge cases (empty directory, non-YAML files, `columns: "1-1"`)
    - MCP tool integration: `list_layout_templates` returns entries, `get_layout_template` returns full template, unknown name returns error
    - Run `npm test` — all suites pass
    - _Requirements: Req 3, Req 4, Req 5_
