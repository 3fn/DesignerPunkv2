# Design Document: Application MCP — Agent-Facing Component Catalog

**Date**: 2026-03-01
**Spec**: 067 - Application MCP
**Status**: Design Phase
**Dependencies**: 064 (Component Metadata Schema — COMPLETE), 066 (Schema Completion — COMPLETE)

---

## Overview

This spec extends the existing component MCP server with four capabilities: (1) context-based component selection with enriched response shapes, (2) an experience pattern schema with indexer and serving tools, (3) assembly validation for complete component trees, and (4) assembly-level accessibility checks.

All work extends the existing server (D1). No new servers, no new processes. The experience pattern schema co-evolves with the first pattern interview (D8) and is reviewed before the indexer is built (execution step 4).

---

## Architecture

### Module Map

| Module | Status | Changes |
|--------|--------|---------|
| `models/index.ts` | Existing | Add `ApplicationSummary`, `AssemblyNode`, `AssemblyValidationResult`, `ExperiencePattern` interfaces |
| `query/QueryEngine.ts` | Existing | Add `context` filter to `findComponents`, new `toApplicationSummary` mapper |
| `indexer/ComponentIndexer.ts` | Existing | Integrate `PatternIndexer`, expose pattern queries |
| `indexer/PatternIndexer.ts` | **New** | Parse and index experience pattern YAML files |
| `validation/AssemblyValidator.ts` | **New** | Tree-walk composition validation |
| `validation/AccessibilityChecker.ts` | **New** | Isolated assembly-level accessibility checks |
| `index.ts` | Existing | Register 3 new tools, update `find_components` tool description |

### Data Flow

```
Agent query
  → MCP tool handler (index.ts)
    → QueryEngine (findComponents, pattern queries)
      → ComponentIndexer (component data)
      → PatternIndexer (pattern data)
    → AssemblyValidator (validate_assembly)
      → CompositionChecker (per-edge validation, existing)
      → AccessibilityChecker (assembly-level checks)
  → Response to agent
```

---

## Data Models

### ApplicationSummary

Extends `ComponentSummary` with application-facing fields from `SemanticAnnotations`.

```typescript
export interface ApplicationSummary extends ComponentSummary {
  purpose: string | null;
  whenToUse: string[];
  whenNotToUse: string[];
  alternatives: Alternative[];
  contexts: string[];
}
```

Rationale: Agents selecting components for an experience need selection guidance in the same response — not a second round-trip to `get_component_summary`. The existing `ComponentSummary` includes `annotations` as an opaque object; `ApplicationSummary` promotes the useful fields to top-level for direct consumption.

### ExperiencePattern

Represents an authored pattern file after parsing.

```typescript
export interface ExperiencePattern {
  name: string;
  source: 'system' | 'project';
  extends: string | null;
  description: string;
  category: string;
  tags: string[];
  steps: PatternStep[];
  accessibility: string[];
  alternatives: PatternAlternative[];
}

export interface PatternStep {
  name: string;
  purpose: string;
  layout: string;
  components: PatternComponent[];
}

export interface PatternComponent {
  component: string;
  role: string;
  optional?: boolean;
  hints?: Record<string, unknown>;
  children?: PatternComponent[];
}

export interface PatternAlternative {
  pattern: string;
  reason: string;
}
```

### PatternCatalogEntry

Lightweight listing for `list_experience_patterns`.

```typescript
export interface PatternCatalogEntry {
  name: string;
  description: string;
  category: string;
  tags: string[];
  source: 'system' | 'project';
  stepCount: number;
  componentCount: number;
}
```

### AssemblyNode (D10 Resolution)

The assembly input schema — how an agent represents a component tree for `validate_assembly`.

```typescript
export interface AssemblyNode {
  component: string;
  props?: Record<string, unknown>;
  children?: AssemblyNode[];
}
```

Design rationale:
- Recursive tree structure mirrors how agents think about UI composition — a parent with children.
- `component` is the DesignerPunk component name (e.g., "Input-Radio-Set").
- `props` is optional — included when conditional composition rules depend on prop values (existing `CompositionRule` mechanism).
- `children` is optional — leaf components have no children.
- No `id` field — validation is structural, not instance-specific.

Example input:
```json
{
  "component": "Input-Radio-Set",
  "props": { "orientation": "vertical" },
  "children": [
    { "component": "Input-Radio-Base" },
    { "component": "Input-Radio-Base" },
    { "component": "Input-Radio-Base" }
  ]
}
```

### AssemblyValidationResult

```typescript
export interface AssemblyValidationResult {
  valid: boolean;
  errors: AssemblyIssue[];
  warnings: AssemblyIssue[];
  accessibility: AccessibilityIssue[];
}

export interface AssemblyIssue {
  path: string;          // e.g., "root", "root.children[0]", "root.children[1].children[2]"
  component: string;
  message: string;
}

export interface AccessibilityIssue {
  rule: string;          // e.g., "form-fields-need-labels"
  wcag: string;          // e.g., "1.3.1"
  message: string;
  severity: 'error' | 'warning';
}
```

The `path` field uses dot-notation with array indices so agents can locate the exact node that failed validation.

---

## Components and Interfaces

### Enhanced `findComponents`

```typescript
// Updated filter interface
interface FindComponentsFilters {
  category?: string;
  concept?: string;
  platform?: string;
  purpose?: string;
  context?: string;       // NEW: exact match against contexts array
}

// Updated return type
findComponents(filters: FindComponentsFilters): QueryResult<ApplicationSummary[]>
```

The `context` filter is applied conjunctively with existing filters. Context matching is exact string match against the `contexts` array in `SemanticAnnotations` — not a text search. Components without annotations are excluded when a context filter is provided.

### PatternIndexer

```typescript
export class PatternIndexer {
  private patterns: Map<string, ExperiencePattern> = new Map();

  async indexPatterns(patternsDir: string): Promise<void>;
  getPattern(name: string): ExperiencePattern | null;
  getCatalog(): PatternCatalogEntry[];
  getHealth(): { patternsIndexed: number; errors: string[]; warnings: string[] };
}
```

The `PatternIndexer` is instantiated by `ComponentIndexer` and called during the existing `indexComponents()` startup. If the `experience-patterns/` directory doesn't exist, it indexes zero patterns with no error.

Schema validation during indexing:
- Required fields: `name`, `source`, `description`, `category`, `steps`
- Each step requires: `name`, `purpose`, `components`
- Each component requires: `component`, `role`, `required`
- `source` must be `system` or `project`
- Invalid files produce a warning and are skipped

### AssemblyValidator

```typescript
export class AssemblyValidator {
  constructor(
    private indexer: ComponentIndexer,
    private accessibilityChecker: AccessibilityChecker,
  ) {}

  validate(assembly: AssemblyNode): AssemblyValidationResult;
}
```

Validation algorithm:
1. Walk the tree depth-first
2. At each node, verify the component exists in the catalog
3. For each parent-child edge, call existing `checkComposition()` logic
4. For each parent with `children.requires`, verify all required types are present
5. For each parent with `minCount`/`maxCount`, verify child count constraints
6. After structural validation, run `AccessibilityChecker` against the full tree
7. Aggregate errors, warnings, and accessibility issues

### AccessibilityChecker

```typescript
export class AccessibilityChecker {
  check(assembly: AssemblyNode, index: Map<string, ComponentMetadata>): AccessibilityIssue[];
}
```

Checks are hardcoded in this module (D4). Specific checks emerge from pattern interviews — the module starts empty and accumulates checks as interviews surface assembly-level accessibility requirements.

Refactor trigger: when pattern count exceeds ~5 or the first project-level pattern is authored, refactor to declarative assertions in pattern files.

---

## Error Handling

| Condition | Behavior |
|-----------|----------|
| `findComponents` with context filter, no matches | Empty array, no error |
| `findComponents` with context filter, component has no annotations | Component excluded from results |
| `get_experience_pattern` with unknown name | Error: "Pattern '[name]' not found" |
| `list_experience_patterns` with no patterns indexed | Empty array, no error |
| Pattern file fails schema validation | Warning during indexing, file skipped |
| `validate_assembly` with unknown component | Error on that node: "Component '[name]' not found in catalog" |
| `validate_assembly` with empty tree | Error: "Assembly must have at least one component" |
| `experience-patterns/` directory missing | Zero patterns indexed, no error, health reports 0 patterns |

---

## Testing Strategy

### Unit Tests

| Module | What to Test | Tier |
|--------|-------------|------|
| QueryEngine `findComponents` | Context filter (exact match, conjunctive with other filters, no matches, no annotations) | Tier 2 |
| QueryEngine `findComponents` | ApplicationSummary response shape (all fields populated, null annotations handling) | Tier 2 |
| PatternIndexer | Parse valid YAML, reject invalid YAML, skip malformed files with warning | Tier 2 |
| PatternIndexer | Catalog listing (name, description, category, tags, counts) | Tier 2 |
| AssemblyValidator | Single node (valid component, unknown component) | Tier 2 |
| AssemblyValidator | Parent-child validation (allowed, prohibited, requires satisfied/missing) | Tier 2 |
| AssemblyValidator | Count constraints (minCount, maxCount) | Tier 2 |
| AssemblyValidator | Nested tree (multi-level, path reporting) | Tier 2 |
| AccessibilityChecker | Each hardcoded check (tests added as checks emerge from interviews) | Tier 2 |

### Integration Tests

| Scenario | What to Test | Tier |
|----------|-------------|------|
| Full pattern lifecycle | Index patterns → list → get by name → validate assembly against pattern | Tier 3 |
| Enhanced findComponents with real data | Context filter against actual component-meta.yaml contexts | Tier 3 |
| Assembly validation with real components | Validate Input-Radio-Set with Radio-Base children, verify requires/count checks | Tier 3 |
| Health endpoint | Reports both component and pattern index status | Tier 3 |

### Existing Test Impact

- `findComponents` tests need updating for new `context` filter and `ApplicationSummary` return type
- No changes to existing composition checker tests — `validate_assembly` wraps the existing logic

---

## Design Decisions

### Decision 1: ApplicationSummary as Extension of ComponentSummary

**Options**: (A) Return existing ComponentSummary with annotations object, (B) New ApplicationSummary that promotes annotation fields to top-level, (C) Separate application-specific endpoint
**Decision**: Option B
**Rationale**: Agents selecting components need `whenToUse`, `whenNotToUse`, and `alternatives` at the top level for direct consumption. The existing `annotations` object requires the agent to know the internal structure. Promoting fields reduces cognitive load on the consuming agent. Extending `ComponentSummary` maintains backward compatibility.
**Trade-off**: Slight data duplication (annotations data appears both in the `annotations` object and as top-level fields). Acceptable because the promoted fields are the ones agents actually use for selection.

### Decision 2: AssemblyNode as Recursive Tree

**Options**: (A) Flat list of components with parent references, (B) Recursive tree with children arrays, (C) Adjacency list (edges between component IDs)
**Decision**: Option B
**Rationale**: Recursive tree mirrors how agents naturally think about UI composition — "this parent contains these children." It's the most intuitive input format for an agent constructing a UI. Flat lists require the agent to manage parent-child relationships externally. Adjacency lists add unnecessary indirection.
**Trade-off**: Deep nesting could make path reporting verbose. Mitigated by the fact that DesignerPunk composition is shallow (max depth-1 in current components, depth-2 at most in future).

### Decision 3: AccessibilityChecker as Isolated Module

**Options**: (A) Inline accessibility checks in AssemblyValidator, (B) Separate AccessibilityChecker class, (C) Declarative assertions in pattern files from day one
**Decision**: Option B
**Rationale**: Isolation enables the refactor path to declarative assertions (D4) without touching the structural validator. Starting with hardcoded checks is honest — we don't know what checks we need until the interviews surface them. Declarative from day one would require designing the assertion format before we have examples.
**Trade-off**: Two modules to maintain instead of one. Acceptable because the separation is clean (structural vs accessibility) and the refactor trigger is explicit (~5 patterns or first project pattern).

### Decision 4: PatternIndexer Integrated into ComponentIndexer

**Options**: (A) Standalone PatternIndexer called separately, (B) PatternIndexer owned by ComponentIndexer, (C) Single indexer handling both
**Decision**: Option B
**Rationale**: The ComponentIndexer already manages the startup lifecycle (`indexComponents()`). Adding pattern indexing to the same lifecycle keeps the server startup simple — one call indexes everything. The PatternIndexer is a separate class for separation of concerns, but owned and called by ComponentIndexer.
**Trade-off**: ComponentIndexer grows in responsibility. Mitigated by delegation — it calls PatternIndexer, doesn't implement pattern parsing.

---

## Related Documentation

- `.kiro/specs/067-application-mcp/requirements.md` — Requirements this design implements
- `.kiro/specs/067-application-mcp/design-outline.md` — Approved design outline with 10 decisions
- `.kiro/specs/064-component-metadata-schema/design.md` — Original MCP architecture and data models
- `.kiro/specs/066-schema-completion/design.md` — Model evolution (internal/children, omits, resolvedTokens)
- `component-mcp-server/src/models/index.ts` — Current type definitions
- `component-mcp-server/src/query/QueryEngine.ts` — Current query engine
