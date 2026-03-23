# Design Document: Layout Templates

**Date**: 2026-03-23
**Spec**: 069 - Layout Templates
**Status**: Design Phase — R1 feedback incorporated
**Dependencies**: Spec 067 (Application MCP), Spec 070 (Agent Architecture), Spec 082 (Family Naming + Registry)

---

## Overview

This spec delivers three things: a responsive layout specification vocabulary (steering doc + MCP reference), layout template infrastructure (schema, indexer, MCP tools), and a learning foundation. The architecture mirrors the existing experience pattern system — a new YAML format, a new indexer class, and new MCP tools — while the steering doc is a new cross-agent resource.

---

## Architecture

### System Integration

```
Token-Family-Responsive.md ──┐
                              ├──> Steering Doc ──> Docs MCP (all agents)
Token-Family-Spacing.md ─────┘         │
                                       ▼
                              Layout Template YAML
                                       │
                              LayoutTemplateIndexer
                                       │
                              Application MCP Tools
                                       │
                         ┌─────────────┼─────────────┐
                    Leonardo          Lina         Platform Agents
                  (consumes)      (maintains)     (implements)
```

### Directory Structure

```
layout-templates/                          # Peer to experience-patterns/
├── centered-content-page.yaml             # Candidate template (example)
├── sidebar-page.yaml                      # Candidate template (example)
└── multi-zone-page.yaml                   # Candidate template (example)

.kiro/steering/
└── Layout-Specification-Vocabulary.md     # New steering doc (Layer 3, conditional)

application-mcp-server/src/
├── indexer/
│   └── LayoutTemplateIndexer.ts           # New indexer (mirrors PatternIndexer)
├── models/
│   └── index.ts                           # New interfaces added
└── index.ts                               # New tools registered
```

---

## Components and Interfaces

### Layout Template YAML Schema

```yaml
name: centered-content-page               # Unique identifier (kebab-case)
source: system                             # 'system' or 'project'
description: >
  Single content area centered in viewport. Common for login,
  registration, and single-purpose forms.
category: single-region                    # Categorization for browsing
tags: [centered, form, login, single-column]

regions:
  - name: content                          # Region identifier
    description: Primary content area
    grid:
      xs:
        columns: full-width               # Shorthand: spans all available columns
        margins: gridMarginXs             # Token reference (actual token name)
      sm:
        columns: 2-7                      # Column span (1-indexed, of 8 at sm)
        margins: gridMarginSm             # Note: resolves to 24px (spec calls for 28px, see Token-Family-Spacing.md)
      md:
        columns: 4-9                      # Column span (of 12 at md)
        margins: gridMarginMd
      lg:
        columns: 5-12                     # Column span (of 16 at lg)
        margins: gridMarginLg
        maxWidth: breakpointSm            # Token reference (actual camelCase name)
    stacking: null                         # No stacking (single region)

# Multi-region example (sidebar page):
# regions:
#   - name: primary
#     grid:
#       xs: { columns: full-width }
#       sm: { columns: full-width }
#       md: { columns: 1-8 }
#       lg: { columns: 1-11 }
#     stacking: { below: breakpointMd, order: 1 }
#   - name: sidebar
#     grid:
#       xs: { columns: full-width }
#       sm: { columns: full-width }
#       md: { columns: 9-12 }
#       lg: { columns: 12-16 }
#     stacking: { below: breakpointMd, order: 2 }
```

**Schema rules:**
- `name`: required, kebab-case, unique across all templates
- `source`: required, `system` or `project`
- `description`: required, non-empty
- `category`: required, non-empty
- `regions`: required, non-empty array
- Each region: `name` (required), `grid` (required, **all four breakpoints required**: `xs`, `sm`, `md`, `lg`), `stacking` (required, null for single-region)
- Grid values reference tokens by actual camelCase name — `gridMarginXs`, `breakpointSm`, etc. No dot notation.
- `columns`: either `full-width` or `N-M` range (1-indexed within breakpoint column count)
- `maxWidth`: optional, must reference a breakpoint token by actual name (`breakpointXs`, `breakpointSm`, `breakpointMd`, `breakpointLg`)
- **Stacking order**: lower `order` values appear first (higher on page) when regions stack. 1-indexed positive integers, no duplicates within a template. Regions that should be hidden at narrow viewports are not expressed in templates — that's a reactive/product decision handled in Leonardo's screen spec via reactive annotations.

**Known token gap**: `gridMarginSm` resolves to 24px. Token-Family-Spacing.md documents the design spec calls for 28px (`space350`), but that primitive token doesn't exist. Templates use current token values.

### TypeScript Interfaces

```typescript
interface LayoutTemplate {
  name: string;
  source: 'system' | 'project';
  description: string;
  category: string;
  tags: string[];
  regions: LayoutRegion[];
}

interface LayoutRegion {
  name: string;
  description?: string;
  grid: Record<'xs' | 'sm' | 'md' | 'lg', GridBehavior>;  // All four required
  stacking: StackingRule | null;
}

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg';

interface GridBehavior {
  columns: string;        // 'full-width' or 'N-M' range
  margins?: string;       // Token reference (e.g., 'gridMarginXs')
  maxWidth?: string;      // Breakpoint token reference
}

interface StackingRule {
  below: string;          // Breakpoint token reference
  order: number;          // Stacking order when collapsed
}

interface LayoutTemplateCatalogEntry {
  name: string;
  description: string;
  category: string;
  tags: string[];
  source: 'system' | 'project';
  regionCount: number;
}
```

### LayoutTemplateIndexer

Mirrors `PatternIndexer` architecture:

```typescript
class LayoutTemplateIndexer {
  private templates = new Map<string, LayoutTemplate>();
  private indexWarnings: string[] = [];

  async indexTemplates(templatesDir: string): Promise<void>;
  getTemplate(name: string): LayoutTemplate | null;
  getCatalog(): LayoutTemplateCatalogEntry[];
  getHealth(): { templatesIndexed: number; errors: string[]; warnings: string[] };

  // Private
  private parseTemplateFile(filePath: string): LayoutTemplate | null;
  private validate(doc: Record<string, unknown>, filename: string): string[];
  private validateRegion(region: Record<string, unknown>, prefix: string, errors: string[]): void;
}
```

**Validation rules:**
- Required fields: `name`, `source`, `description`, `category`, `regions`
- `source` must be `system` or `project`
- `regions` must be non-empty array
- Each region must have `name`, `grid` with all four breakpoints (`xs`, `sm`, `md`, `lg`)
- `columns` must be `full-width` or valid `N-M` range (1-indexed, N < M, both within breakpoint column count)
- Column counts per breakpoint: `{ xs: 4, sm: 8, md: 12, lg: 16 }` (source: Token-Family-Spacing.md § "Grid Spacing Tokens" — hardcoded in validator, comment noting source)
- `maxWidth` must reference a known breakpoint token name (`breakpointXs`, `breakpointSm`, `breakpointMd`, `breakpointLg`)
- `stacking` must be null or have `below` (breakpoint token reference) and `order` (positive integer, 1-indexed, no duplicates within template)
- Token references validated against a hardcoded allowlist of known token names (breakpoint tokens + grid margin tokens — small, stable set)

### MCP Tool Registration

Two new tools added to `index.ts`:

```typescript
{
  name: 'list_layout_templates',
  description: 'List all layout templates with name, description, category, tags, and region count.',
  inputSchema: { type: 'object', properties: {} },
}

{
  name: 'get_layout_template',
  description: 'Get full layout template by name: regions with grid behavior per breakpoint, stacking rules, and token references.',
  inputSchema: {
    type: 'object',
    properties: { name: { type: 'string', description: 'Template name (e.g., "centered-content-page")' } },
    required: ['name'],
  },
}
```

### Steering Document Structure

`Layout-Specification-Vocabulary.md` — Layer 3, conditional loading when doing screen specification or layout template work.

**Sections:**
1. **Token Source Map** — which token family provides what: breakpoints (Responsive), columns/gutters/margins (Spacing), native grid tokens (Spacing). All token names in actual camelCase format.
2. **Grid System Mental Model** — progressive 4→8→12→16 columns, how gutters and margins scale, the mathematical relationships. Density tokens (Responsive) acknowledged as affecting how content fills regions.
3. **Specification Vocabulary** — canonical terms with definitions (column span, region, stacking order, full-width, max-width constraint)
4. **Specification Format** — the structured format Leonardo uses in screen specs to express layout (not prose — a consistent section structure)
5. **Responsive Adaptation** — within-platform viewport changes, breakpoint-driven layout shifts
6. **Reactive Annotations** — cross-platform experience differences, platform availability markers. Region visibility (hiding at breakpoints) is a reactive decision expressed here, not in templates.
7. **Platform Translation Patterns** — how specification terms map to CSS Grid, SwiftUI adaptive layout, Compose adaptive patterns (drawn from existing token family docs, not new). Notes the CSS grid generator's existence and its relationship to layout templates.
8. **Template Authoring Guidance** — what makes a good template, what layout decisions to encode vs leave to per-screen specification. Serves both Lina (template author) and Leonardo (template consumer). Both participate in the Req 6 learning step.
9. **Common Layout Patterns** (suggestive, evolving) — prose descriptions of common layout approaches (centered content, sidebar + main, multi-zone, full-width list) with guidance on when each is appropriate. Explicitly marked as suggestive guidelines that evolve with product learnings, not definitive prescriptions. Seeded from established design system study (Req 6), grows as product work teaches what actually works.

---

## Design Decisions

### Decision 1: Separate Directory for Layout Templates

**Options Considered**: (a) Layout templates in `experience-patterns/` alongside patterns, (b) New `layout-templates/` directory
**Decision**: New `layout-templates/` directory
**Rationale**: Layout templates and experience patterns are peer systems with different schemas. Mixing them in one directory would require the indexer to distinguish file types. Separate directories mirror the architectural separation (page layout vs component assembly).
**Trade-offs**: One more top-level directory. Acceptable given the clear conceptual separation.

### Decision 2: Mirror PatternIndexer Architecture

**Options Considered**: (a) Extend PatternIndexer to handle both types, (b) New LayoutTemplateIndexer class, (c) Generic indexer base class
**Decision**: New LayoutTemplateIndexer class mirroring PatternIndexer's architecture
**Rationale**: The validation rules are completely different (regions/grid/stacking vs steps/components/roles). A shared base class would add abstraction without reducing code — the parse and validate methods share no logic. Separate classes are simpler and independently testable.
**Trade-offs**: Some structural duplication (indexWarnings pattern, Map storage, getCatalog/getHealth shape). Acceptable — the duplication is in scaffolding, not logic.

### Decision 3: Column Ranges as `N-M` Strings

**Options Considered**: (a) `N-M` string ranges (e.g., `"4-9"`), (b) Object with `start`/`end` properties, (c) Column count only (e.g., `span: 6`)
**Decision**: `N-M` string ranges
**Rationale**: Expresses both position and width in one value. `"4-9"` means "start at column 4, end at column 9" — platform agents know exactly where the region sits in the grid. Column count alone (`span: 6`) doesn't express position. Object form (`{ start: 4, end: 9 }`) is more verbose for the same information.
**Trade-offs**: Requires parsing. Validation must check that N < M and both are within the breakpoint's column count. `full-width` as a special case avoids range math for the common case.

### Decision 4: Max-Width via Breakpoint Tokens

**Options Considered**: (a) Hardcoded pixel values, (b) New max-width token family, (c) Breakpoint token references
**Decision**: Breakpoint token references (e.g., `maxWidth: "breakpoint.sm"`)
**Rationale**: Max-width is a CSS property that consumes breakpoint values. The breakpoint tokens already exist. No new token governance needed. If a max-width doesn't align to a breakpoint, express it as column spans instead.
**Trade-offs**: Can't express arbitrary max-width values (e.g., 480px). Acceptable — column spans handle most cases, and arbitrary values would violate token-first principles.

---

## Testing Strategy

### LayoutTemplateIndexer Tests

New test file: `application-mcp-server/src/indexer/__tests__/LayoutTemplateIndexer.test.ts`

- **Valid template parsing**: single-region, multi-region, all breakpoints populated
- **Validation errors**: missing required fields, invalid source, empty regions, invalid column ranges, out-of-range columns, invalid maxWidth reference
- **Catalog generation**: correct entry count, region counts, sorting
- **Health reporting**: template count, warnings for malformed files
- **Edge cases**: empty directory, non-YAML files, duplicate names

### MCP Tool Integration Tests

- `list_layout_templates` returns catalog entries
- `get_layout_template` returns full template by name
- `get_layout_template` returns error for unknown name
- Tools follow same response patterns as experience pattern tools

### Governance Tests

Add to existing governance test infrastructure:
- Layout template directory existence check (if templates exist)
- Template name validation (kebab-case, consistent with pattern naming)

---

## Error Handling

- **Malformed YAML**: Warning logged, file skipped, other templates still indexed (mirrors PatternIndexer behavior)
- **Missing required fields**: Specific error message identifying the field and file
- **Invalid column range**: Error message showing the invalid range and the valid column count for that breakpoint
- **Unknown template name**: `get_layout_template` returns `{ error: "TemplateNotFound", message: "Layout template \"X\" not found" }`
- **Empty templates directory**: No error — `list_layout_templates` returns empty array, health shows 0 templates
