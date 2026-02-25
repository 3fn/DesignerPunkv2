# Format Divergence Summary

**Date**: February 25, 2026
**Spec**: 062 - Stemma Catalog Readiness Audit
**Phase**: 1 (Task 1.3)
**Status**: Complete

---

## Contract Documentation Formats

Four distinct formats exist, not three as initially identified. Lina's consultation correctly identified the schema-inline vs. contracts.yaml split, but the README-only format is a separate category with its own characteristics.

### Format 1: Standard Contracts Library (Governance-Level)

**Location**: `.kiro/steering/Component-Schema-Format.md`
**Components using it**: 0 (no component directly references this library)
**Structure**: name, description, platforms, required, category, verification

This is a governance artifact that defines 16 abstract contracts. No component's schema or contracts.yaml references these contracts by their library names. The library serves as a conceptual reference but is not operationally connected to the component definitions.

### Format 2: Schema-Inline (Rich)

**Location**: `[Component]/[Component].schema.yaml` under `contracts:` block
**Components using it**: 14 (Button-CTA, Input-Text-*, Chip-*, Container-*, Icon-Base)
**Structure**: name, description, behavior, wcag, platforms, validation

Contracts are defined inline within the component schema file. No `category` field — contracts are listed flat without categorization. The richest format for individual contract detail (behavior descriptions, WCAG mappings, validation criteria).

### Format 3: Dedicated contracts.yaml (Rich + Categorized)

**Location**: `[Component]/contracts.yaml`
**Components using it**: 9 (Badge-Count-Base, Badge-Count-Notification, Badge-Label-Base, Progress-Indicator-*, Progress-Pagination-Base, Progress-Stepper-*)
**Structure**: name, category, description, behavior, wcag, platforms, validation, test_approach

The most complete format. Adds `category` and `test_approach` fields not present in Format 2. Includes a `summary` block with contract counts and WCAG coverage. Used exclusively by the Badge and Progress families (the two newest families).

### Format 4: README-Only (Tabular)

**Location**: `[Component]/README.md` under "## Behavioral Contracts"
**Components using it**: 6 (Button-VerticalList-Item, Button-VerticalList-Set, Input-Checkbox-Base, Input-Checkbox-Legal, Input-Radio-Base, Input-Radio-Set)
**Structure**: Markdown table with columns: Contract, Description, (Platforms), WCAG

Least structured format. No behavior descriptions, no validation criteria, no test approach. Contract names and one-line descriptions only. These components have no schema YAML file at all.

### Format 5: Undocumented

**Components**: 2 (Avatar, Button-Icon)
**Structure**: None

No behavioral contracts documented in any format. These components have implementations and tests but no contract definitions.

---

## Format Distribution

| Format | Components | % of Catalog |
|--------|-----------|-------------|
| Schema-inline (Format 2) | 14 | 50% |
| contracts.yaml (Format 3) | 9 | 32% |
| README-only (Format 4) | 6 | 21% |
| Undocumented (Format 5) | 2 | 7% |
| Standard library (Format 1) | 0 | 0% |

**Note**: Some components appear in multiple counts because they have both a schema (Format 2) and a contracts.yaml (Format 3). The Badge and Progress families have both — the schema lists contract names in a `behavioral_contracts:` array, while the contracts.yaml provides the full definitions. This is complementary, not conflicting.

---

## Format Comparison

| Feature | Standard Library | Schema-Inline | contracts.yaml | README-Only |
|---------|-----------------|---------------|----------------|-------------|
| Contract name | ✅ | ✅ | ✅ | ✅ |
| Description | ✅ | ✅ | ✅ | ✅ (brief) |
| Category | ✅ | ❌ | ✅ | ❌ |
| Behavior detail | ❌ | ✅ | ✅ | ❌ |
| WCAG mapping | ❌ | ✅ | ✅ | ✅ |
| Platforms | ✅ | ✅ | ✅ | Partial |
| Validation criteria | ✅ (brief) | ✅ | ✅ | ❌ |
| Test approach | ❌ | ❌ | ✅ | ❌ |
| Required flag | ✅ | ❌ | ❌ | ❌ |
| Machine-parseable | ✅ | ✅ | ✅ | ❌ |

---

## Format Evolution Timeline

Based on file dates and family development order:

1. **Standard library** (Component-Schema-Format.md, reviewed 2026-01-01) — Written as governance reference
2. **Schema-inline** (Input-Text-Base ~2026-01-01, Button-CTA ~2026-01-05) — First implementation format
3. **README-only** (Checkbox ~2026-02-06, Radio ~2026-02-07) — Newer components without schemas
4. **contracts.yaml** (Badge ~2026-01-23, Progress ~2026-02-16) — Most recent, richest format

The format has gotten richer over time (contracts.yaml > schema-inline > README-only), but the README-only format appeared *after* the schema-inline format, suggesting it wasn't a deliberate regression — more likely these components were built quickly and the schema step was skipped.

---

## Key Finding: The Standard Library Is Disconnected

The standard contracts library defines 16 contracts that no component references by name. The library uses names like `clickable`, `hoverable`, `supports_disabled_state`, `announces_state_changes` — but components use `pressable`, `hover_state`, `disabled_state`, and component-specific names instead.

The library is not wrong — it's just not connected to the implementation. It represents an intended vocabulary that was never adopted. This is the core alignment gap: the governance layer and the implementation layer evolved independently.

---

## Implications for Schema Formalization

1. **The contracts.yaml format (Format 3) is the strongest candidate for a uniform format** — it has the most fields, is machine-parseable, and includes test approach guidance. However, it would need to be adopted by the 19 components that don't currently use it.

2. **The standard library needs to either be updated to match reality or deprecated** — in its current state it creates confusion about what the "official" contract vocabulary is.

3. **The 6 README-only components need structured contract definitions** before the schema can consume them — markdown tables are not machine-parseable.

4. **The 2 undocumented components (Avatar, Button-Icon) need contracts defined from scratch** — the audit can't assess what doesn't exist.
