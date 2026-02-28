# Component Metadata Schema Reference

**Date**: 2026-02-28
**Spec**: 064 — Component Metadata Schema
**Purpose**: Documents all fields in the assembled component metadata JSON

---

## Overview

The component MCP server assembles metadata from three source files per component:

| Source File | What It Provides |
|-------------|-----------------|
| `schema.yaml` | Identity, properties, tokens, platforms, composition |
| `contracts.yaml` | Behavioral contracts, inheritance, exclusions |
| `component-meta.yaml` | Purpose, usage guidance, contexts, alternatives |

The assembled JSON is served at three progressive disclosure tiers to manage token budgets.

---

## Progressive Disclosure Tiers

### Tier 1: Catalog Entry (~50 tokens per component)

Returned by `get_component_catalog`. Lightweight browsing — all components at once.

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| `name` | string | schema.yaml | Canonical component name |
| `type` | string | schema.yaml | `primitive`, `type-primitive`, `semantic`, `standalone` |
| `family` | string | schema.yaml | Component family (e.g., `Badge`, `Chip`) |
| `purpose` | string \| null | component-meta.yaml | Agent-selection-oriented description; null if no meta file |
| `readiness` | string | schema.yaml | `production-ready`, `development`, `experimental` |
| `platforms` | string[] | schema.yaml | `["web", "ios", "android"]` |
| `contractCount` | number | contracts.yaml | Total active contracts (own + inherited) |

**Example:**

```json
{
  "name": "Badge-Count-Base",
  "type": "type-primitive",
  "family": "Badge",
  "purpose": "Display a numeric count indicator, such as unread notifications or item quantities, in a compact badge.",
  "readiness": "production-ready",
  "platforms": ["web", "ios", "android"],
  "contractCount": 7
}
```

### Tier 2: Component Summary (~200 tokens)

Returned by `get_component_summary`. Enough to decide whether to drill into full detail.

Includes all Tier 1 fields plus:

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| `description` | string | schema.yaml | Full component description |
| `contractCategories` | string[] | contracts.yaml | Distinct categories across active contracts |
| `tokenCount` | number | schema.yaml | Number of tokens in the component's token list |
| `annotations` | SemanticAnnotations \| null | component-meta.yaml | Full semantic annotations (see below) |
| `composesComponents` | string[] | schema.yaml | Names of components used internally |
| `inheritsFrom` | string \| null | contracts.yaml | Parent component name, or null |

### Tier 3: Full Component Metadata

Returned by `get_component_full`. Complete assembled metadata.

---

## Full Metadata Fields

### Identity

| Field | Type | Required | Source | Description |
|-------|------|----------|--------|-------------|
| `name` | string | yes | schema.yaml | Canonical Stemma name (e.g., `Badge-Count-Base`) |
| `type` | string | yes | schema.yaml | Component type in the Stemma hierarchy |
| `family` | string | yes | schema.yaml | Component family |
| `version` | string | yes | schema.yaml | Semantic version |
| `readiness` | string | yes | schema.yaml | Production readiness level |
| `description` | string | yes | schema.yaml | Full component description |

### Structural Data

| Field | Type | Required | Source | Description |
|-------|------|----------|--------|-------------|
| `platforms` | string[] | yes | schema.yaml | Supported platforms |
| `properties` | Record<string, PropertyDefinition> | yes | schema.yaml | Component props (see below) |
| `tokens` | string[] | yes | schema.yaml | Design tokens used by this component |
| `composition` | CompositionDefinition \| null | no | schema.yaml | Composition relationships and constraints |

#### PropertyDefinition

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | yes | TypeScript-style type (e.g., `"'sm' \| 'md' \| 'lg'"`) |
| `description` | string | yes | Prop description |
| `default` | unknown | no | Default value |
| `required` | boolean | no | Whether the prop is required |

#### CompositionDefinition

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `composes` | CompositionRelationship[] | yes | Components used internally |
| `children` | object | no | Child constraints: `allowed`, `prohibited`, `allowedCategories`, `prohibitedCategories`, `minCount`, `maxCount` |
| `nesting` | object | no | Self-nesting constraint: `{ self: boolean }` |
| `rules` | CompositionRule[] | no | Conditional rules: `when` (prop + value) → `then` (child overrides) |

### Behavioral Contracts

| Field | Type | Required | Source | Description |
|-------|------|----------|--------|-------------|
| `contracts` | ResolvedContracts | yes | contracts.yaml | Full resolved contract set |

#### ResolvedContracts

| Field | Type | Description |
|-------|------|-------------|
| `inheritsFrom` | string \| null | Parent component name |
| `active` | Record<string, Contract> | All active contracts (own + inherited) |
| `excluded` | Record<string, ExcludedContract> | Contracts explicitly excluded with rationale |
| `own` | string[] | Contract names declared by this component |
| `inherited` | string[] | Contract names inherited from parent |

#### Contract

| Field | Type | Description |
|-------|------|-------------|
| `category` | string | Contract category (e.g., `accessibility`, `interaction`, `visual`) |
| `description` | string | Short description |
| `behavior` | string | Detailed behavioral specification |
| `wcag` | string \| null | WCAG criterion reference |
| `platforms` | string[] | Platforms this contract applies to |
| `validation` | string[] | Testable validation criteria |
| `required` | boolean | Whether the contract is required |
| `source` | `"own"` \| `"inherited"` \| `"extended"` | Origin of this contract |

#### ExcludedContract

| Field | Type | Description |
|-------|------|-------------|
| `reason` | string | Why this contract is excluded |
| `category` | string | Contract category |
| `reference` | string | Reference to documentation justifying exclusion |

### Semantic Annotations

| Field | Type | Required | Source | Description |
|-------|------|----------|--------|-------------|
| `annotations` | SemanticAnnotations \| null | no | component-meta.yaml | Null if no meta file exists |

#### SemanticAnnotations

| Field | Type | Description |
|-------|------|-------------|
| `purpose` | string | Agent-selection-oriented description |
| `usage.whenToUse` | string[] | Scenarios where this component is appropriate |
| `usage.whenNotToUse` | string[] | Scenarios where an alternative is better |
| `contexts` | string[] | UI contexts where this component is typically used |
| `alternatives` | Alternative[] | Other components to consider |

#### Alternative

| Field | Type | Description |
|-------|------|-------------|
| `component` | string | Canonical Stemma component name |
| `reason` | string | When to prefer this alternative |

### Derived Data

| Field | Type | Required | Source | Description |
|-------|------|----------|--------|-------------|
| `contractTokenRelationships` | ContractTokenRelationships | yes | Computed | Token references found in contract prose |

#### ContractTokenRelationships

| Field | Type | Description |
|-------|------|-------------|
| `resolved` | ContractTokenPair[] | Tokens referenced in contracts AND present in schema tokens list |
| `gaps` | ContractTokenGap[] | Tokens referenced in contracts but NOT in schema tokens list |

### Indexing Metadata

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `indexedAt` | string | yes | ISO 8601 timestamp of last indexing |
| `warnings` | string[] | yes | Warnings generated during indexing |

---

## Graceful Degradation

| Condition | Behavior | Warning |
|-----------|----------|---------|
| `component-meta.yaml` missing | `annotations: null` | None |
| `contracts.yaml` missing | `contracts: { active: {} }` | "No contracts.yaml found" |
| `schema.yaml` missing | Component skipped entirely | "Component directory has no schema.yaml" |
| Parent contracts missing | Child contracts returned | "Parent not found" warning |

---

## Related Documentation

- `docs/component-meta-authoring-guide.md` — How to write component-meta.yaml files
- `docs/component-mcp-query-guide.md` — MCP query interface and tool documentation
- `.kiro/steering/Contract-System-Reference.md` — Contract taxonomy and naming conventions
