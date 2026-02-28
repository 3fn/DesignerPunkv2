# Design Document: Component Metadata Schema

**Date**: 2026-02-28
**Spec**: 064 - Component Metadata Schema
**Status**: Complete
**Dependencies**: 063 (Uniform Contract System — COMPLETE)

---

## Overview

The component metadata schema is a tool-agnostic, machine-readable description layer served by a new MCP server (the "component MCP"). It assembles structural data from existing source files (schema.yaml, contracts.yaml) with human-authored semantic annotations (component-meta.yaml) into a queryable catalog. Agents query the component MCP to discover, select, and compose Stemma components without parsing raw project files.

The architecture follows the proven docs MCP pattern: resolve on read, index on startup, progressive disclosure, file watching for freshness. The component MCP is a sibling server — not an extension of the docs MCP — because it indexes a different file type (YAML component files vs. markdown steering docs) and serves a different consumer (component selection agents vs. documentation agents).

---

## Architecture

### System Context

```
Source Files (on disk)                    Component MCP (in memory)              Agent Consumers
┌─────────────────────┐                  ┌──────────────────────────┐           ┌──────────────┐
│ schema.yaml         │──┐               │  ComponentIndexer        │           │ Application  │
│ contracts.yaml      │──┼── startup ──▶ │    ├─ index (Map)        │──query──▶ │ MCP client   │
│ component-meta.yaml │──┘   + watch     │    ├─ catalog (summary)  │           │              │
└─────────────────────┘                  │    └─ inheritance graph  │           │ A2UI bridge  │
                                         │                          │           │ (downstream)  │
                                         │  QueryEngine             │           └──────────────┘
                                         │    ├─ by name            │
                                         │    ├─ by category        │
                                         │    ├─ by concept         │
                                         │    ├─ by platform        │
                                         │    ├─ by purpose keyword │
                                         │    └─ composition check  │
                                         │                          │
                                         │  FileWatcher             │
                                         │    └─ re-indexes on      │
                                         │       source file change │
                                         └──────────────────────────┘
```

### Key Architectural Decisions

1. **Sibling server, not extension.** The component MCP is a separate MCP server from the docs MCP. They share architectural patterns but not code. Rationale: different source formats (YAML vs. markdown), different indexing logic (multi-file assembly vs. single-file parse), different query interfaces. Coupling them would complicate both.

2. **Resolve on read, no generated files.** No metadata JSON files exist in the repository. The MCP reads source YAML files and assembles JSON responses at query time. This eliminates sync drift by design. (Design outline Q1)

3. **YAML source, JSON output.** Humans author YAML (component-meta.yaml). The MCP serves JSON to agents. No format translation burden on either side. (Design outline Q2)

4. **Index on startup, file watcher for freshness.** All source files loaded into memory at startup. FileWatcher detects changes and re-indexes individual components. Same pattern as docs MCP. (Design outline Q3)

---

## Components and Interfaces

### ComponentIndexer

Responsible for scanning component directories, parsing source files, assembling component metadata, and maintaining the in-memory index.

```typescript
interface ComponentIndexer {
  /** Scan component directories and build initial index */
  indexComponents(componentsDir: string): Promise<void>;

  /** Re-index a single component after file change */
  reindexComponent(componentDir: string): Promise<void>;

  /** Get assembled metadata for a single component */
  getComponent(name: string): ComponentMetadata | null;

  /** Get lightweight catalog of all components */
  getCatalog(): ComponentCatalogEntry[];

  /** Get index health status */
  getHealth(): IndexHealth;
}
```

### InheritanceResolver

Resolves `inherits:` declarations in contracts.yaml by reading parent contracts and merging with child contracts.

```typescript
interface InheritanceResolver {
  /**
   * Resolve full contract set for a component.
   * Merges parent contracts with child contracts.
   * Child extensions override parent versions of same-named contracts.
   * Excluded contracts are omitted with rationale preserved.
   */
  resolve(
    childContracts: ContractsFile,
    parentContracts: ContractsFile | null
  ): ResolvedContracts;
}
```

### ContractTokenDeriver

Derives contract-token relationships by parsing contract prose and cross-referencing with schema token lists.

```typescript
interface ContractTokenDeriver {
  /**
   * Derive token relationships for accessibility and animation contracts.
   * Returns matched pairs and unresolved references (gaps).
   */
  derive(
    contracts: ResolvedContracts,
    schemaTokens: string[]
  ): ContractTokenRelationships;
}
```

### CompositionChecker

Evaluates whether a component can contain another, applying static constraints and conditional rules.

```typescript
interface CompositionChecker {
  /**
   * Check if parent can contain child, given parent's current prop values.
   * Returns allowed/prohibited with the applicable rule.
   */
  check(
    parent: string,
    child: string,
    parentProps?: Record<string, unknown>
  ): CompositionResult;
}
```

### QueryEngine

Wraps the indexer with query logic, metrics, and error handling. Follows the docs MCP QueryEngine pattern.

```typescript
interface ComponentQueryEngine {
  /** Get full metadata for a component by name */
  getComponent(name: string): QueryResult<ComponentMetadata>;

  /** Get lightweight catalog */
  getCatalog(): QueryResult<ComponentCatalogEntry[]>;

  /** Find components by contract category */
  findByCategory(category: string): QueryResult<ComponentSummary[]>;

  /** Find components by specific contract concept */
  findByConcept(concept: string): QueryResult<ComponentSummary[]>;

  /** Find components by platform */
  findByPlatform(platform: string): QueryResult<ComponentSummary[]>;

  /** Search components by purpose keyword */
  searchByPurpose(keyword: string): QueryResult<ComponentSummary[]>;

  /** Check composition validity */
  checkComposition(
    parent: string,
    child: string,
    parentProps?: Record<string, unknown>
  ): QueryResult<CompositionResult>;
}
```

### MCP Tool Definitions

The component MCP exposes these tools to agent consumers:

| Tool | Parameters | Returns | Progressive Disclosure |
|------|-----------|---------|----------------------|
| `get_component_catalog` | none | All components with name + purpose | Tier 1: ~50 tokens/component |
| `get_component_summary` | `name` | Structural identity + contract categories + semantic annotations | Tier 2: ~200 tokens |
| `get_component_full` | `name` | Complete assembled metadata including all contracts, composition rules, token relationships | Tier 3: full detail |
| `find_components` | `category`, `concept`, `platform`, `purpose` (all optional, combinable) | Matching component summaries | Tier 2 per result |
| `check_composition` | `parent`, `child`, `parentProps` (optional) | Allowed/prohibited + applicable rule | Single result |
| `get_component_health` | none | Index health, warnings, gaps | Diagnostic |

---

## Data Models

### ComponentMetadata (full assembled response)

```typescript
/** Complete component metadata — assembled from 3 source files at query time */
interface ComponentMetadata {
  /** Component identity (from schema.yaml) */
  name: string;
  type: string;                    // "family-primitive" | "type-primitive" | "semantic-variant"
  family: string;
  version: string;
  readiness: string;
  description: string;

  /** Structural data (from schema.yaml) */
  platforms: string[];
  properties: Record<string, PropertyDefinition>;
  tokens: string[];
  composition: CompositionDefinition | null;

  /** Behavioral contracts (from contracts.yaml, inheritance resolved) */
  contracts: ResolvedContracts;

  /** Semantic annotations (from component-meta.yaml, nullable) */
  annotations: SemanticAnnotations | null;

  /** Derived data (computed at query time) */
  contractTokenRelationships: ContractTokenRelationships;

  /** Indexing metadata */
  indexedAt: string;               // ISO timestamp
  warnings: string[];              // Stale references, missing files, etc.
}
```

### ResolvedContracts

```typescript
interface ResolvedContracts {
  /** Parent component name, if any */
  inheritsFrom: string | null;

  /** All active contracts (own + inherited, minus excluded) */
  active: Record<string, Contract>;

  /** Contracts excluded from parent with rationale */
  excluded: Record<string, ExcludedContract>;

  /** Contracts added or extended by this component (not inherited) */
  own: string[];

  /** Contracts inherited from parent (not overridden) */
  inherited: string[];
}

interface Contract {
  category: string;
  description: string;
  behavior: string;
  wcag: string | null;
  platforms: string[];
  validation: string[];
  required: boolean;
  source: "own" | "inherited" | "extended";
}

interface ExcludedContract {
  reason: string;
  category: string;
  reference: string;
}
```

### SemanticAnnotations

```typescript
/** Human-authored component guidance (from component-meta.yaml) */
interface SemanticAnnotations {
  purpose: string;
  usage: {
    whenToUse: string[];
    whenNotToUse: string[];
  };
  contexts: string[];
  alternatives: Alternative[];
}

interface Alternative {
  component: string;
  reason: string;
}
```

### CompositionDefinition

```typescript
interface CompositionDefinition {
  /** Components this component uses internally */
  composes: CompositionRelationship[];

  /** Child constraints */
  children?: {
    allowed?: string[];
    prohibited?: string[];
    allowedCategories?: string[];
    prohibitedCategories?: string[];
    minCount?: number;
    maxCount?: number;
  };

  /** Self-nesting constraint */
  nesting?: {
    self: boolean;
  };

  /** Conditional composition rules */
  rules?: CompositionRule[];
}

interface CompositionRelationship {
  component: string;
  relationship: string;
}

interface CompositionRule {
  when: {
    prop: string;
    equals: unknown;
  };
  then: {
    children?: Partial<CompositionDefinition["children"]>;
  };
}

interface CompositionResult {
  allowed: boolean;
  reason: string;
  rule: "static" | "conditional";
  ruleDetail?: CompositionRule;
}
```

### ContractTokenRelationships

```typescript
interface ContractTokenRelationships {
  /** Successfully resolved contract-token pairs */
  resolved: ContractTokenPair[];

  /** Contracts that reference tokens not in the schema tokens list */
  gaps: ContractTokenGap[];
}

interface ContractTokenPair {
  contract: string;          // canonical contract name
  token: string;             // token name from schema tokens list
  category: string;          // "accessibility" | "animation"
}

interface ContractTokenGap {
  contract: string;
  referencedToken: string;   // token name found in contract prose
  category: string;
}
```

### Progressive Disclosure Types

```typescript
/** Tier 1: Catalog entry (~50 tokens per component) */
interface ComponentCatalogEntry {
  name: string;
  type: string;
  family: string;
  purpose: string | null;    // null if component-meta.yaml missing
  readiness: string;
  platforms: string[];
  contractCount: number;
}

/** Tier 2: Component summary (~200 tokens) */
interface ComponentSummary {
  name: string;
  type: string;
  family: string;
  readiness: string;
  description: string;
  platforms: string[];
  contractCategories: string[];   // unique categories present
  contractCount: number;
  tokenCount: number;
  annotations: SemanticAnnotations | null;
  composesComponents: string[];   // names of composed components
  inheritsFrom: string | null;
}
```

---

## Error Handling

### Graceful Degradation

The component MCP follows a "best effort with visible warnings" strategy. Missing or malformed files degrade the response — they don't fail the query.

| Condition | Behavior | Warning |
|-----------|----------|---------|
| component-meta.yaml missing | Return structural data, `annotations: null` | None (expected for new components) |
| contracts.yaml missing | Return schema data, `contracts: { active: {} }` | "No contracts.yaml found" |
| schema.yaml missing | Skip component entirely | "Component directory has no schema.yaml" |
| Parent contracts.yaml missing (inheritance) | Return child contracts only | "Unresolved inheritance: parent [name] not found" |
| Malformed YAML | Skip file, use defaults | "YAML parse error in [file]: [detail]" |
| Stale token reference in contract | Include in `gaps` array | "Contract [name] references [token] not in schema tokens list" |
| Alternative references nonexistent component | Include as-is | "Alternative [name] not found in catalog" |

### Startup Errors

If the component directory doesn't exist or is empty, the MCP starts with an empty index and reports degraded health. It does not crash.

---

## Testing Strategy

### Unit Tests

| Component | What to Test | Tier |
|-----------|-------------|------|
| YAML parsers (schema, contracts, meta) | Parse valid files, handle malformed input, handle missing files | Tier 2 |
| InheritanceResolver | Parent merge, child override, excludes, missing parent | Tier 2 |
| ContractTokenDeriver | Token extraction from prose, cross-reference matching, gap detection | Tier 2 |
| CompositionChecker | Static constraints, conditional rules, self-nesting, unknown components | Tier 2 |
| ComponentIndexer | Full assembly from 3 files, re-index on change, catalog generation | Tier 2 |

### Integration Tests

| Scenario | What to Test | Tier |
|----------|-------------|------|
| End-to-end query | Query a real component (Badge-Count-Base), verify assembled response matches source files | Tier 3 |
| Inheritance chain | Query Badge-Count-Notification, verify parent contracts from Badge-Count-Base are resolved | Tier 3 |
| Composition check | Query Container-Card-Base with role=button, verify interactive children prohibited | Tier 3 |
| File watcher | Modify a source file, verify re-index occurs and subsequent query reflects change | Tier 2 |
| Progressive disclosure | Verify catalog → summary → full returns increasing detail for same component | Tier 2 |

### A2UI Mapping Exercise

Not a test suite — a manual design validation. Draft 2-3 representative components in the schema, then evaluate:
1. Can each field translate to an A2UI component description?
2. Where are gaps?
3. Are gaps schema omissions or renderer bridge concerns?

Representative components for the exercise:
- **Badge-Count-Base** — simple primitive, no composition, no inheritance
- **Badge-Count-Notification** — semantic variant with inheritance
- **Container-Card-Base** — composition with conditional rules

---

## Design Decisions

### Decision 1: Sibling Server vs. Docs MCP Extension

**Options Considered**: (A) Extend docs MCP with component tools, (B) Separate sibling MCP server
**Decision**: Option B — separate sibling server
**Rationale**: Different source formats (YAML vs. markdown), different indexing logic (multi-file assembly with inheritance resolution vs. single-file parse), different query interfaces (capability discovery vs. document navigation). Coupling them would complicate both codebases and create deployment dependencies.
**Trade-offs**: Two servers to maintain and configure. Agents need to know which server to query for what. Mitigated by clear naming (`@designerpunk-docs` vs. `@designerpunk-components`).

### Decision 2: In-Memory Index vs. Database

**Options Considered**: (A) In-memory Map, (B) SQLite for structured queries, (C) File-based JSON cache
**Decision**: Option A — in-memory Map
**Rationale**: 28 components × 3 files = ~84 files. Same order of magnitude as the docs MCP's ~40 files. In-memory indexing is proven at this scale. SQLite adds a dependency and complexity for no measurable benefit at current scale.
**Trade-offs**: If the component count grows to 500+, in-memory may need revisiting. The IndexHealth pattern will surface memory pressure before it becomes a problem.

### Decision 3: Contract-Token Derivation Scope

**Options Considered**: (A) Derive for all contract categories, (B) Derive only for accessibility + animation, (C) No derivation — manual mapping
**Decision**: Option B — scoped to accessibility and animation
**Rationale**: These categories have explicit token names in contract prose (auditable, mechanical). Visual and interaction contracts reference tokens as implementation details, not behavioral dependencies. Deriving for all categories would produce noisy, low-confidence results.
**Trade-offs**: Agents won't see token relationships for visual contracts. The schema `tokens:` list still provides the full token inventory — just without per-contract attribution for visual/interaction categories.

### Decision 4: Composition Rule Syntax Boundary

**Options Considered**: (A) Unbounded rule engine, (B) Bounded `when/then` on prop values, (C) Static constraints only
**Decision**: Option B — bounded conditional rules
**Rationale**: Container-Card-Base's `role` prop changing valid children is a real, known need. Static constraints can't express it. But a full rule engine (nested conditions, boolean combinators) is speculative complexity. The bounded syntax handles the known case.
**Trade-offs**: If future components need `when A AND B then C` logic, the syntax must be extended. The design outline identifies this as the reassessment point.

---

## Related Documentation

- `.kiro/specs/064-component-metadata-schema/requirements.md` — Requirements this design implements
- `.kiro/specs/064-component-metadata-schema/design-outline.md` — Design decisions Q1–Q9, A2UI reference URLs, scope boundaries
- `.kiro/steering/Contract-System-Reference.md` — Contract taxonomy, naming convention, canonical format
- `.kiro/specs/063-uniform-contract-system/findings/format-specification.md` — Canonical contract format with examples
- `mcp-server/` — Docs MCP server (architectural patterns: DocumentIndexer, QueryEngine, FileWatcher, progressive disclosure)

---
