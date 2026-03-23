# Requirements Document: Layout Templates

**Date**: 2026-03-23
**Spec**: 069 - Layout Templates
**Status**: Requirements Phase — R1 feedback incorporated
**Dependencies**: Spec 067 (Application MCP), Spec 070 (Agent Architecture), Spec 082 (Family Naming + Registry), Spec 083 (Guidance Completeness — gap report)

---

## Introduction

This spec ensures agents understand and communicate responsive page-level layout through three deliverables: a responsive layout specification vocabulary (steering doc + MCP reference), layout template infrastructure (schema, indexer, MCP tools), and a learning foundation that validates both. The vocabulary is the critical layer — Leonardo must be able to specify layout for any page, with or without a template. The infrastructure accelerates common cases. Production templates are created when product work begins, not by this spec.

**Documentation waiver**: This spec does not introduce new tokens or components. It introduces a steering document (layout specification vocabulary), a YAML schema (layout templates), and MCP tools. Documentation requirements are embedded in the relevant requirements below rather than as a separate documentation requirement.

**Known dependency**: `gridMarginSm` currently references `space300` (24px) but the design specification calls for `space350` (28px), which doesn't exist in the primitive spacing scale. The steering doc and grid reference should use the current token value and document the gap.

---

## Requirements

### Requirement 1: Responsive Layout Specification Vocabulary

**User Story**: As Leonardo (product architect), I want a canonical vocabulary and specification format for expressing page-level responsive layout in screen specifications, so that platform agents can implement layout without clarification round-trips.

#### Acceptance Criteria

1. WHEN Leonardo writes a screen specification THEN the vocabulary SHALL provide canonical terms for: grid structure (column allocation to regions), breakpoint behavior (stacking, collapsing, reflow), and component sizing within regions (centering, max-width via breakpoint tokens, fill behavior)
2. WHEN a screen specification includes cross-platform experience differences THEN the vocabulary SHALL provide reactive annotation terms (section availability, platform-specific functionality) distinct from responsive adaptation terms
3. WHEN a platform agent reads a screen specification THEN the vocabulary SHALL be sufficient for implementation without requiring Tier 1 clarification for basic layout questions
4. The vocabulary SHALL be delivered as a steering document accessible to all agents via Docs MCP, serving both specification (Leonardo) and implementation (platform agents) directions
5. The vocabulary SHALL define a consistent specification format (not just terms) for expressing layout in screen specs, so that multiple sessions produce structurally consistent layout sections
6. The vocabulary and the layout template schema (Req 3) SHALL use the same concepts and terms — co-designed, not sequential
7. The steering doc SHALL include a token source map identifying which token family provides which layout concept (breakpoint tokens from Token-Family-Responsive.md, grid spacing tokens from Token-Family-Spacing.md)

### Requirement 2: Responsive Grid System Reference

**User Story**: As any agent working with responsive layout, I want quick-reference access to the DesignerPunk grid system (breakpoints, columns, gutters, margins), so that I can look up values mid-specification without loading a full steering document.

#### Acceptance Criteria

1. WHEN an agent queries for grid system values THEN the reference SHALL return a unified grid system view synthesizing across token families: breakpoint token values (Token-Family-Responsive.md), column counts per breakpoint (4→8→12→16), gutter tokens per breakpoint, and margin tokens per breakpoint (Token-Family-Spacing.md)
2. WHEN an agent queries for platform-specific grid patterns THEN the reference SHALL return implementation patterns for web (CSS Grid), iOS (adaptive layout), and Android (Compose adaptive), drawn from existing Token-Family-Spacing.md and Token-Family-Responsive.md platform patterns rather than creating new ones
3. The reference SHALL be queryable via MCP without requiring the full steering document to be loaded in context

### Requirement 3: Layout Template Schema

**User Story**: As Lina (component/pattern system agent), I want a validated YAML schema for layout templates, so that templates can be authored, indexed, and served consistently.

#### Acceptance Criteria

1. A layout template YAML SHALL describe: template name, description, regions with grid behavior per breakpoint, and stacking/reflow rules
2. A layout template SHALL reference responsive tokens by name (breakpoint tokens, grid gutter tokens, grid margin tokens) — not hardcoded values. Max-width constraints SHALL be expressed using breakpoint tokens (e.g., `maxWidth: "breakpoint.sm"`) or as column spans — not hardcoded pixel values
3. A layout template SHALL be component-agnostic — it describes spatial regions, not what components go in them
4. WHEN a layout template YAML is malformed THEN the indexer SHALL report a clear error identifying the issue
5. A layout template YAML SHALL include a `source` field (`system` or `project`) to distinguish universal templates from product-specific ones, consistent with experience pattern lifecycle

### Requirement 4: Layout Template MCP Tools

**User Story**: As Leonardo (product architect), I want to discover and retrieve layout templates through the Application MCP, so that I can reference common layout patterns when specifying screens.

#### Acceptance Criteria

1. WHEN an agent calls `list_layout_templates` THEN the Application MCP SHALL return all available layout templates with name, description, and region count
2. WHEN an agent calls `get_layout_template(name)` THEN the Application MCP SHALL return the full template including all regions, grid behavior per breakpoint, and stacking rules
3. WHEN an agent calls `get_layout_template` with a name that doesn't exist THEN the tool SHALL return a clear "not found" error
4. Layout template tools SHALL follow the same query patterns as existing experience pattern tools (`list_experience_patterns`, `get_experience_pattern`)

### Requirement 5: Schema Validation Through Generic Scenarios

**User Story**: As the spec team, we want the template schema validated against generic layout scenarios, so that we have confidence the infrastructure works before product work begins.

#### Acceptance Criteria

1. The schema SHALL be validated against at minimum 3 generic scenarios: a single-region centered page, a multi-region page with sidebar, and a multi-zone overview page
2. Candidate templates produced during validation SHALL be clearly marked as examples (`source: system`, tagged as candidates), not production templates
3. WHEN a candidate template is authored using the schema THEN it SHALL be indexable and queryable through the MCP tools from Requirement 4

### Requirement 6: Responsive Layout Learning Foundation

**User Story**: As Leonardo (product architect) and Lina (template author), we want a structured learning step for the responsive grid system, so that we can make informed layout decisions — not just schema-compliant ones.

#### Acceptance Criteria

1. The learning step SHALL include a structured interview with Peter about responsive layout decision-making: how he decides when content stacks vs reflows, when sidebars collapse vs disappear, how he allocates columns to regions
2. The learning step SHALL include study of established design systems (Material Design, Apple HIG, Carbon, Atlassian) for how they express responsive layout guidance
3. The learning step SHALL include review of DesignerPunk token documentation (Token-Family-Responsive.md, Token-Family-Spacing.md § "Grid Spacing Tokens") to build understanding from the mathematical foundation
4. Both Leonardo and Lina SHALL participate in the learning step — Leonardo as the specification consumer, Lina as the template author
5. The learning step SHALL produce thin template authoring guidance: what makes a good template, what layout decisions to encode vs leave to per-screen specification
