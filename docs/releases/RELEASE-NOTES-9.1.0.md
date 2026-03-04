# Release Notes: v9.1.0 — Family Guidance Indexer

**Date**: 2026-03-04
**Spec**: 068 - Family Guidance Indexer
**Previous**: v9.0.0

---

## What's New

The Application MCP gains its 10th tool: `get_prop_guidance`. Agents can now query family-level selection guidance — which component variant for which scenario, which family member for which use case — through structured, machine-queryable data.

### Family Guidance System

Three companion YAML files distill the guidance from Component-Family steering docs into structured data:

- **button.yaml** — 10 selection rules covering family member selection (CTA vs Icon vs VerticalList-Set) and variant selection (primary/secondary/tertiary). 2 family-scoped patterns (Form Actions, Dialog Actions).
- **form-inputs.yaml** — 3 grouped rule sets (Text Inputs, Checkboxes, Radio Buttons) plus 2 cross-group selection rules. 2 family-scoped patterns (Radio Group, Parent-Child Checkbox).
- **container.yaml** — 9 selection rules focused on semantic role selection (section, nav, main, article, fieldset).

### `get_prop_guidance` MCP Tool

Query by component name or family name. Returns `whenToUse`, `whenNotToUse`, `selectionRules`, `accessibilityNotes`, and family-scoped `patterns`.

Supports a `verbose` parameter (default: false). Non-verbose responses strip `rationale` and `description` fields for minimal token cost — product application agents get decisions without reasoning. System agents or humans pass `verbose: true` for full context.

### Infrastructure

- `FamilyGuidanceIndexer` — parses companion YAML files from `family-guidance/` directory
- Startup ordering enforced: `ComponentIndexer` → `PatternIndexer` → `FamilyGuidanceIndexer`
- Cross-reference validation: all `recommend` values verified against component catalog, all `relatedPatterns` verified against pattern index
- Health check reports `guidanceFamiliesIndexed` alongside components and patterns

---

## By the Numbers

| Metric | v9.0.0 | v9.1.0 |
|--------|--------|--------|
| MCP tools | 9 | 10 |
| MCP test suites | 10 | 11 |
| MCP tests | 113 | 136 |
| Guidance families | 0 | 3 |

---

## Process Notes

- Schema convention approved via ballot measure
- 3 families authored strictly serially (Button → Form-Inputs → Container) through interview-driven process
- Schema review gate passed all 4 checkpoints — schema stable across all 3 structural types
- D4 boundary (family-scoped vs experience patterns) tested and holding — zero patterns answered "both"
- D9 compliance verified by Ada across all companion YAML files

---

## Not Breaking

This is a minor release. All existing 9 MCP tools are unchanged. `get_prop_guidance` is a new addition. No interfaces modified, no existing behavior changed.
