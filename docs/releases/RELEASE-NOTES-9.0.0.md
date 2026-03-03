# Release Notes: v9.0.0

**Date**: March 2, 2026
**Type**: Major Release (schema completion, application MCP)
**Previous**: v8.0.0 (Contract & Metadata Infrastructure)

---

## Summary

The Application MCP release. Two specs complete the component catalog (28/28 indexed, zero warnings) and evolve the component MCP from a development tool into an application MCP — a callable catalog that agents query to select, compose, configure, and validate components for building experiences.

**Breaking changes**: `CompositionDefinition.composes` renamed to `.internal`. `children.requires` added for agent-provided children. Existing schemas migrated.

---

## Schema Completion (Spec 066)

Completed the component catalog: 8 remaining components schemaed, MCP data models evolved, 4 contract audit findings resolved.

### Schema Creation
- 8 new `schema.yaml` files: Badge-Count-Base, Badge-Count-Notification, Badge-Label-Base, Button-VerticalList-Item, Button-VerticalList-Set, Input-Checkbox-Legal, Input-Radio-Set, Progress-Stepper-Detailed
- 28/28 components indexed, zero warnings, healthy status

### Model Evolution
- `CompositionDefinition.composes` → `.internal` (components the agent doesn't instantiate) + `children.requires` (components the agent must provide)
- `ComponentMetadata.omits` — parent props unavailable on child variants (e.g., Input-Checkbox-Legal omits `size`, `indeterminate`, `labelAlign`)
- `ComponentMetadata.resolvedTokens` — own tokens + depth-1 composed children's tokens
- `ComponentSummary` updated with `internalComponents` and `requiredChildren`

### Contract Audit Resolution
- Avatar-Base `interaction_hover` clarified as pointer-only
- Chip-Base: 3 interaction contracts added (`interaction_hover`, `interaction_pressed`, `interaction_focus_ring`)
- `state_disabled` exclusion standardized across all 14 components: "DesignerPunk does not support disabled states for usability and accessibility reasons. If an action is unavailable, the component should not be rendered."
- Input-Text-Base disabled implementation removed (dead code cleanup: 16 files, -98 lines)

---

## New Feature: Application MCP (Spec 067)

Evolved the component MCP into an application MCP with 4 new capabilities: context-based selection, experience patterns, assembly validation, and accessibility checking.

### Enhanced Component Selection
- `findComponents` now supports `context` filter — exact match against the structured `contexts` array (68 unique values across 28 components)
- New `ApplicationSummary` response shape promotes `whenToUse`, `whenNotToUse`, `alternatives`, and `contexts` to top-level fields
- Context filter works conjunctively with existing filters (category, concept, platform, purpose)
- No relevance scoring — deterministic filtering, alphabetical sort

### Experience Pattern Schema and Authored Patterns
- YAML schema for multi-component assembly templates with recursive `children` nesting, `optional` field, semantic `role`, configuration `hints`, and assembly-level `accessibility` notes
- Two-layer architecture: `source` (system/project) and `extends` fields from day one. Tier 1 implements system-level only.
- 3 patterns authored through structured interviews with Peter:
  - `simple-form` — single-step email subscription form (flat composition)
  - `settings-screen` — grouped sections with navigation lists and toggles (4-level nesting)
  - `account-onboarding` — 3-step auth flow with conditional fieldsets (multi-step sequencing)
- `componentGap` hint convention for documenting catalog gaps (7 gaps identified across patterns)
- Token governance convention (D9): hints reference prop values and semantic intent only, never raw values
- `list_experience_patterns` — browse all patterns with name, description, category, tags
- `get_experience_pattern` — retrieve full pattern content by name

### Assembly Validation
- `validate_assembly` — validates complete component trees against composition constraints
  - Depth-first tree walk with path-based error reporting (`root.children[0].children[1]`)
  - Checks: component existence, parent-child composition, `children.requires`, `minCount`/`maxCount`
  - Unified response: errors, warnings, and accessibility issues
- `AccessibilityChecker` — isolated module with 3 structural checks derived from pattern interviews:
  - Form containers must have accessible name (WCAG 1.3.1)
  - Form containers should have a submit action (WCAG 1.3.1)
  - Page containers must have accessible name (WCAG 2.4.2)
- Refactor trigger documented: declarative assertions when pattern count exceeds ~5

### Pattern Indexer
- `PatternIndexer` integrated into `ComponentIndexer` startup lifecycle
- Schema validation during indexing (required fields, recursive children validation)
- Invalid files produce warnings and are skipped — don't fail the index
- Missing `experience-patterns/` directory handled gracefully (zero patterns, no error)
- Health endpoint reports both component and pattern index status

---

## Process Updates

- **Informed Placeholder** task pattern added to Process-Task-Type-Definitions — for tasks whose implementation steps depend on unknowable upstream findings (interviews, audits, investigations)
- **Product Configuration Layer** strategy drafted (pending ballot measure) — resolution order for product defaults cascading through the MCP

---

## Stats

| Metric | v8.0.0 | v9.0.0 |
|--------|--------|--------|
| Tests (main) | 7,437 | 7,435 |
| Tests (MCP) | 59 | 113 (+54) |
| Components indexed | 20 | 28 (+8) |
| Experience patterns | — | 3 |
| MCP tools | 6 | 9 (+3) |
| Accessibility checks | — | 3 (WCAG-referenced) |
| Steering docs | 53 | 54 (+1) |

---

## Breaking Changes

1. **`CompositionDefinition.composes` → `.internal`**: Renamed to clarify that these are components the agent does not instantiate. All existing schemas migrated.
2. **`children.requires` added**: New field on `CompositionDefinition.children` listing component types the agent must provide. Existing composition checks updated.
3. **`findComponents` return type changed**: Returns `ApplicationSummary[]` instead of `ComponentSummary[]`. `ApplicationSummary` extends `ComponentSummary` — existing fields unchanged, new fields added.

---

## What Changed from Previous Version

1. ✅ **Added** 8 schema.yaml files completing 28/28 component catalog (Spec 066)
2. ✅ **Added** `omits` field for property omission on inheriting components (Spec 066)
3. ✅ **Added** `resolvedTokens` for depth-1 composed token assembly (Spec 066)
4. ✅ **Added** `state_disabled` exclusion standardized across 14 components (Spec 066)
5. ✅ **Added** Experience pattern YAML schema with 3 authored patterns (Spec 067)
6. ✅ **Added** `list_experience_patterns` and `get_experience_pattern` MCP tools (Spec 067)
7. ✅ **Added** `validate_assembly` MCP tool with accessibility checking (Spec 067)
8. ✅ **Added** `context` filter on `findComponents` with `ApplicationSummary` response (Spec 067)
9. ✅ **Added** `AccessibilityChecker` module with 3 WCAG-referenced structural checks (Spec 067)
10. ✅ **Added** `PatternIndexer` integrated into server startup (Spec 067)
11. ✅ **Added** Informed Placeholder task pattern in Process-Task-Type-Definitions (Process)
12. ✅ **Breaking** `composes` → `internal` rename on CompositionDefinition (Spec 066)
13. ✅ **Breaking** `children.requires` added to CompositionDefinition (Spec 066)
14. ✅ **Breaking** `findComponents` returns `ApplicationSummary[]` instead of `ComponentSummary[]` (Spec 067)
15. ✅ **Removed** Dead disabled state implementation from Input-Text-Base family (-98 lines) (Spec 066)
