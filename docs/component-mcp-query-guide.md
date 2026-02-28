# Component MCP Query Guide

**Date**: 2026-02-28
**Spec**: 064 — Component Metadata Schema
**Purpose**: Documents all MCP tools, parameters, and usage patterns for the component MCP server

---

## Server Info

- **Name**: `mcp-component-server`
- **Transport**: stdio
- **Start**: `node component-mcp-server/dist/index.js`
- **Components directory**: `src/components/core` (default)

---

## Tools

### get_component_catalog

Browse all indexed components. ~50 tokens per component.

**Parameters**: none

**Returns**: `QueryResult<ComponentCatalogEntry[]>`

**Example response** (truncated):
```json
{
  "data": [
    {
      "name": "Badge-Count-Base",
      "type": "type-primitive",
      "family": "Badge",
      "purpose": "Display a numeric count indicator...",
      "readiness": "production-ready",
      "platforms": ["web", "ios", "android"],
      "contractCount": 7
    }
  ],
  "error": null,
  "warnings": [],
  "metrics": { "responseTimeMs": 1 }
}
```

---

### get_component_summary

Get a component summary with contract categories, token count, and annotations. ~200 tokens.

**Parameters**:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `name` | string | yes | Component name (e.g., `"Badge-Count-Base"`) |

**Returns**: `QueryResult<ComponentSummary>`

**Example response**:
```json
{
  "data": {
    "name": "Badge-Count-Base",
    "type": "type-primitive",
    "family": "Badge",
    "readiness": "production-ready",
    "description": "Type primitive count badge component...",
    "platforms": ["web", "ios", "android"],
    "contractCategories": ["content", "visual", "accessibility"],
    "contractCount": 7,
    "tokenCount": 0,
    "annotations": {
      "purpose": "Display a numeric count indicator...",
      "usage": {
        "whenToUse": ["Showing unread message or notification counts"],
        "whenNotToUse": ["Displaying text labels — use Badge-Label-Base"]
      },
      "contexts": ["navigation-tabs", "list-items"],
      "alternatives": [
        { "component": "Badge-Label-Base", "reason": "When the indicator shows text labels instead of numbers" }
      ]
    },
    "composesComponents": [],
    "inheritsFrom": null
  },
  "error": null,
  "warnings": [],
  "metrics": { "responseTimeMs": 0 }
}
```

---

### get_component_full

Get complete assembled metadata including all contracts, properties, composition rules, and token relationships.

**Parameters**:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `name` | string | yes | Component name |

**Returns**: `QueryResult<ComponentMetadata>`

See `docs/component-metadata-schema-reference.md` for the full field reference.

---

### find_components

Find components by one or more filters. All parameters are optional and combinable — multiple filters intersect (AND logic).

**Parameters**:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `category` | string | no | Contract category (e.g., `"accessibility"`, `"interaction"`) |
| `concept` | string | no | Specific contract concept (e.g., `"keyboard_navigation"`, `"hover"`) |
| `platform` | string | no | Platform filter (e.g., `"ios"`, `"web"`) |
| `purpose` | string | no | Keyword search across purpose and description fields |

**Returns**: `QueryResult<ComponentCatalogEntry[]>`

**Behavior**:
- `category`: Returns components with any active contract in that category (including inherited)
- `concept`: Returns components with that specific contract name
- `platform`: Returns components whose schema declares that platform
- `purpose`: Searches purpose field first (higher rank), then description; alphabetical within each tier
- Multiple filters: Results must match ALL filters (intersection)

---

### check_composition

Check whether a parent component can contain a child component.

**Parameters**:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `parent` | string | yes | Parent component name |
| `child` | string | yes | Child component name |
| `parentProps` | object | no | Parent prop values for evaluating conditional rules |

**Returns**: `QueryResult<CompositionResult>`

**Example response**:
```json
{
  "data": {
    "allowed": true,
    "reason": "No composition constraints prohibit this combination",
    "rule": "static"
  },
  "error": null,
  "warnings": [],
  "metrics": { "responseTimeMs": 0 }
}
```

---

### get_component_health

Get index health status, component count, and any warnings or errors.

**Parameters**: none

**Returns**: `QueryResult<IndexHealth>`

**Example response**:
```json
{
  "data": {
    "status": "healthy",
    "componentsIndexed": 20,
    "lastIndexTime": "2026-02-28T21:37:17.628Z",
    "errors": [],
    "warnings": ["Component directory has no schema.yaml: Avatar-Base"]
  },
  "error": null,
  "warnings": [],
  "metrics": { "responseTimeMs": 0 }
}
```

---

## Usage Patterns

### "I need a component for email input"

1. Search by purpose:
   ```
   find_components({ purpose: "email" })
   ```
2. Review results — `Input-Text-Email` will rank highest (purpose match)
3. Get summary to confirm:
   ```
   get_component_summary({ name: "Input-Text-Email" })
   ```

### "What components support keyboard navigation?"

```
find_components({ concept: "focusable" })
```

### "Can Badge-Count-Base go inside Container-Card-Base?"

```
check_composition({ parent: "Container-Card-Base", child: "Badge-Count-Base" })
```

### "What components are in the Badge family?"

1. Get catalog:
   ```
   get_component_catalog()
   ```
2. Filter results client-side by `family === "Badge"`

### "Show me everything about a component before I use it"

Progressive disclosure workflow:
1. `get_component_catalog()` — browse all components (~50 tokens each)
2. `get_component_summary({ name: "..." })` — check if it fits (~200 tokens)
3. `get_component_full({ name: "..." })` — full detail for implementation

### "Which iOS components handle accessibility?"

Combine filters:
```
find_components({ platform: "ios", category: "accessibility" })
```

---

## Response Wrapper

All tools return a `QueryResult<T>`:

```json
{
  "data": "...",
  "error": "string or null",
  "warnings": ["array of warning strings"],
  "metrics": { "responseTimeMs": 0 }
}
```

- `data` is null when `error` is set
- `warnings` are non-fatal issues (e.g., missing parent contracts)
- `metrics.responseTimeMs` measures query execution time

---

## Related Documentation

- `docs/component-metadata-schema-reference.md` — Full field reference for all response types
- `docs/component-meta-authoring-guide.md` — How to write component-meta.yaml files
