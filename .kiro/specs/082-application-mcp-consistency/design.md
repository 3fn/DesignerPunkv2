# Design Document: Application MCP Consistency & Governance

**Date**: 2026-03-21
**Spec**: 082 - Application MCP Consistency & Governance
**Status**: Design Phase
**Dependencies**: 067 (Application MCP), 068 (Family Guidance Indexer), 070 (Agent Architecture), 075 (MCP Coverage Enforcement)

---

## Overview

This spec normalizes the Application MCP ecosystem across three dimensions (family names, MCP identity, governance) using a big-bang migration strategy. A canonical family registry serves as the single source of truth, consumed by validation tests, indexers, and documentation.

---

## Architecture

### Canonical Family Registry

`family-registry.yaml` is a standalone YAML file located alongside `family-guidance/`. It defines every family's identity:

```yaml
families:
  - canonical: Avatar
    displayName: "Avatars"
    prefix: "Avatar-"
  - canonical: Badge
    displayName: "Badges"
    prefix: "Badge-"
  - canonical: Button
    displayName: "Buttons"
    prefix: "Button-"
  - canonical: Chip
    displayName: "Chips"
    prefix: "Chip-"
  - canonical: Container
    displayName: "Containers"
    prefix: "Container-"
  - canonical: FormInput
    displayName: "Form Inputs"
    prefix: "Input-"
  - canonical: Icon
    displayName: "Icons"
    prefix: "Icon-"
  - canonical: Navigation
    displayName: "Navigation"
    prefix: "Nav-"
  - canonical: ProgressIndicator
    displayName: "Progress Indicators"
    prefix: "Progress-"
```

The `prefix` field captures the primary component name prefix used for matching — not exhaustive. ProgressIndicator has two prefixes in practice (`Progress-` for semantic variants, `Progress-Indicator-` for primitives). The Component Development Guide documents the full dual-prefix situation; the registry captures the common denominator.

### Data Flow

```
family-registry.yaml (source of truth)
        │
        ├──→ FamilyNameValidation.test.ts (enforcement)
        │       Reads registry, reads all schema.yaml files,
        │       asserts every schema family: matches a canonical name
        │
        ├──→ FamilyGuidanceIndexer (displayName fallback)
        │       If guidance YAML has displayName → use it
        │       If guidance YAML omits displayName → read from registry
        │       Families without guidance → registry provides displayName
        │
        ├──→ Component Development Guide (documentation)
        │       Points to registry as authoritative source
        │       Documents prefix mapping and forward-looking rule
        │
        └──→ CoverageDrift.test.ts (simplified)
                Direct family name lookup replaces indirect workaround
```

### Interface Changes

**`FamilyGuidance` interface** (`models/index.ts`):
```typescript
export interface FamilyGuidance {
  family: string;        // canonical PascalCase
  displayName: string;   // human-facing (e.g., "Form Inputs")
  companion: string;
  whenToUse: string[];
  whenNotToUse: string[];
  selectionRules: SelectionRuleGroup[];
  accessibilityNotes: string[];
  patterns: FamilyPattern[];
}
```

**`PropGuidanceResponse`** — add `displayName` field so MCP consumers receive both identifiers.

**`FamilyGuidanceIndexer.parseGuidanceFile()`** — read `displayName` from YAML. If absent, fall back to registry lookup by canonical name. `displayName` is optional in the YAML — the validator should NOT require it. The registry is loaded once at `indexGuidance()` time and used for all fallbacks.

### Directory Rename

```
component-mcp-server/  →  application-mcp-server/
```

Internal imports use relative paths — unaffected. External references:
- `.kiro/settings/mcp.json` — update path
- `.kiro/agents/lina.json` — update glob
- `package.json` name — `@designerpunk/application-mcp-server`

---

## Components and Interfaces

### FamilyNameValidation.test.ts

New test file in `application-mcp-server/src/indexer/__tests__/`.

**Behavior**:
1. Load `family-registry.yaml` and extract canonical names
2. Use `ComponentIndexer.getCatalog()` to read schema `family:` values (DRY — reuses existing parsing)
3. Assert every schema `family:` value exists in the canonical set
4. If a guidance YAML has `displayName`, assert it matches the registry's `displayName` for that family
5. On failure: report the schema file path, the invalid family name, and print the list of valid canonical names
6. Distinguish "family not registered" from "family name format invalid" (not PascalCase)

### CoverageDrift.test.ts Updates

Replace the indirect component-level reachability workaround with direct `getGuidance(canonicalFamilyName)` calls. Remove the workaround comment.

### FamilyGuidanceIndexer Updates

- Map key changes from plural display names to singular PascalCase (follows `family:` field in YAML)
- `displayName` parsed from YAML or resolved from registry
- `getGuidance()` now resolves on canonical names directly

---

## Testing Strategy

### New Test: FamilyNameValidation
- Validates all 30 schema `family:` values against registry
- Validates registry completeness (every family with production components is registered)
- Validates format (PascalCase, no spaces, no hyphens)

### Updated Test: CoverageDrift
- Simplified to use direct family name lookup
- Indirect workaround removed

### Updated Test: FamilyGuidanceIndexer
- `getGuidance('Buttons')` → `getGuidance('Button')`
- Verify `displayName` is returned in responses

### Full Suite Validation
- `npm test` after all changes — 306+ suites must pass

---

## Design Decisions

### Decision 1: Registry Location

**Options Considered**: (a) Inside `application-mcp-server/src/`, (b) Alongside `family-guidance/` at project root, (c) In `.kiro/steering/`
**Decision**: Alongside `family-guidance/` at project root
**Rationale**: The registry is a data artifact consumed by both the MCP server and the test suite. Placing it at the project root alongside `family-guidance/` makes it discoverable and co-located with the data it governs. Placing it inside the MCP server would make it less visible; placing it in steering would mix data with documentation.
**Trade-offs**: Not inside the MCP server's source tree, so the indexer needs a relative path resolution (same pattern already used for `family-guidance/`).

### Decision 2: displayName Ownership

**Options Considered**: (a) Guidance YAML only, (b) Registry only, (c) Guidance YAML with registry fallback
**Decision**: Guidance YAML with registry fallback
**Rationale**: Families with guidance already have rich metadata — `displayName` belongs there. Families without guidance (Navigation) still need a display name — the registry provides it. If both exist, guidance YAML takes precedence (but must match registry — validated by test).
**Trade-offs**: Two potential sources for `displayName` creates a consistency risk. Mitigated by validation test that checks guidance `displayName` matches registry when both exist.

### Decision 3: Separate Test File

**Options Considered**: (a) Add to CoverageDrift.test.ts, (b) New FamilyNameValidation.test.ts
**Decision**: New FamilyNameValidation.test.ts
**Rationale**: CoverageDrift validates coverage (do production families have guidance?). Family name validation checks data integrity (are schema family values canonical?). Distinct concerns with different failure semantics. Combining them dilutes CoverageDrift's purpose.
**Trade-offs**: One more test file to maintain. Acceptable given the clear separation of concerns.

---

## Error Handling

### FamilyNameValidation Failures

- **Unregistered family**: `"Schema 'NewComponent/schema.yaml' uses family 'NewFamily' which is not registered in family-registry.yaml. Register the family before adding components."`
- **Format violation**: `"Schema 'NewComponent/schema.yaml' uses family 'form-input' which does not match PascalCase convention. Expected format: 'FormInput'."`
- **Registry/guidance mismatch**: `"Guidance 'button.yaml' has displayName 'Buttons' but registry has 'Button Group'. These must match."`
