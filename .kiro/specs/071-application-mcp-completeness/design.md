# Design Document: Application MCP Completeness

**Date**: 2026-03-08
**Spec**: 071 - Application MCP Completeness
**Status**: Complete
**Dependencies**:
- Spec 068 (Family Guidance Indexer) - Complete

---

## Overview

This spec completes family guidance coverage for all 8 production-ready component families (from 3/8 to 8/8), enriches the YAML schema with discouraged patterns, platform-variant conventions, and cross-family composition references, and expands Icon-Base from 15 to ~50 icons.

No new MCP tools are created. No new code beyond icon asset expansion and type updates. The FamilyGuidanceIndexer already handles all structural types. This is primarily content work with a schema evolution and one component update.

---

## Architecture

### Family Guidance YAML Schema Evolution

The existing schema (proven in 068) supports: `family`, `companion`, `whenToUse`, `whenNotToUse`, `selectionRules`, `accessibilityNotes`, `patterns`.

This spec adds three optional sections:

```yaml
# New: Discouraged patterns (advisory, overridable)
discouragedPatterns:
  - pattern: "Nesting Chip-Filter inside a form as a replacement for checkboxes"
    rationale: "Chips are for filtering displayed content, not collecting form data. Use Input-Checkbox-Base for form submissions."
    override: "Human confirmation required"

# New: Platform-variant conventions
platformVariants:
  - name: share
    intent: "Share content externally"
    resolution:
      web: share
      ios: share
      android: share-2
    note: "iOS/web use box-with-arrow style; Android uses three-connected-dots style"

# New: Cross-family composition references
composesWithFamilies:
  - family: "Buttons"
    relationship: "Badge composes inside Button-Icon for notification counts"
    companion: ".kiro/steering/Component-Family-Button.md"
```

All three sections are optional. Simple families (Avatars) may omit `discouragedPatterns` and `platformVariants` entirely. The FamilyGuidanceIndexer already ignores unknown YAML keys, so these additions are backward-compatible.

**Scope note:** `platformVariants` is scoped to assets (icons) where the product agent makes a platform-specific choice. Component-level platform divergence (e.g., Progress render-all-dots on web vs native scroll on iOS/Android) is implementation detail that belongs in component READMEs and contracts, not family guidance. The agent picks the component; the platform handles the rest transparently.

### Icon Asset Expansion

Icon-Base gains ~40 new SVG assets. Final list requires Peter's approval before Task 4 begins.

**WrKing Class coverage (~27 icons):**
alert-circle, award, bell, briefcase, check-circle, chevron-left, clock, credit-card, dollar-sign, external-link, file-text, filter, globe, map-pin, phone, refresh-cw, save, search, shield, smartphone, smile, star, trending-up, user-check, user-x, users, wifi

**Pair completions (~3 icons):**
chevron-up, chevron-down (chevron-left/right already exist)
arrow-down already exists; confirming full arrow set

**Platform variants (~5 icons):**
share (iOS/web style), share-2 (Android style), more-horizontal, more-vertical

**General utility (~5 icons):**
info, eye, eye-off, log-out, edit

**Note:** Existing 15 icons should be audited for SVG format consistency (stroke-width, viewBox, fill vs stroke) before adding new icons. If inconsistencies exist, normalize during Task 4.1.

All icons sourced from Feather Icons library. Added to:
- Web: `src/components/core/Icon-Base/platforms/web/assets/` (SVG)
- iOS: `src/components/core/Icon-Base/platforms/ios/Icons.xcassets/` (asset catalog)
- Android: `src/components/core/Icon-Base/platforms/android/res/` (vector drawable)

`IconBaseName` type updated in `src/components/core/Icon-Base/types.ts`.

### Family Authoring Order

1. **Chips** (reference family) — validates enriched schema
2. **Progress** — most complex family, stress-tests schema
3. **Badges** — moderate complexity
4. **Icons** — depends on asset expansion completing first
5. **Avatars** — simplest family (Avatar-Base only; Avatar-Group is a planned future semantic variant, not implemented), benefits from proven schema

---

## Components and Interfaces

### Modified Components

**Icon-Base** — asset expansion only. No API changes, no behavioral changes, no new props. The `name` prop accepts additional `IconBaseName` values.

### Modified Data

**family-guidance/*.yaml** — 5 new files following evolved schema. FamilyGuidanceIndexer parses them automatically at startup.

**IconBaseName type** — expanded union type with ~35 additional string literals.

---

## Error Handling

No new error paths. FamilyGuidanceIndexer already handles malformed YAML with startup validation. Icon-Base already handles unknown icon names with a fallback.

---

## Testing Strategy

### Family Guidance YAML
- D9 compliance validation for each new YAML file (Ada's domain)
- FamilyGuidanceIndexer startup test confirms all 8 families indexed
- `get_prop_guidance` returns non-null for all production families

### Icon Asset Expansion
- Existing Icon-Base tests continue passing (no behavioral changes)
- Token-completeness test confirms 0 missing tokens
- Manual verification that new SVGs render correctly

---

## Design Decisions

### Decision 1: Vertical-First Authoring (Chips as Reference)

**Options Considered**:
1. Horizontal sweep — write all 5 YAMLs at current schema depth, then enrich
2. Vertical depth — complete one family fully, validate schema, then replicate

**Decision**: Vertical depth with Chips as reference family.

**Rationale**: The schema additions (discouraged patterns, platform variants, cross-family refs) are untested. Authoring one family fully reveals whether the additions are valuable before committing to all 5. Chips has the right complexity — three components with clear semantic variants — to stress-test selection rules and discouraged patterns without the composition depth of Progress.

**Trade-offs**:
- ✅ Gained: Schema validated before replication; avoids rework
- ❌ Lost: Slower to full coverage; Chips blocks other families
- ⚠️ Risk: Chips might not surface all schema issues (Progress is more complex)

### Decision 2: Discouraged Patterns as Advisory

**Options Considered**:
1. Hard rules — agent must not use discouraged patterns
2. Advisory with override — agent flags the pattern, human confirms
3. Informational only — documented but not enforced

**Decision**: Advisory with human override.

**Rationale**: Consistent with token governance model (semantic = free, component = requires approval). Discouraged patterns are guidance, not law. A product agent should surface the concern; the human decides. This prevents the guidance from becoming a rigidity trap that blocks creative exploration.

**Trade-offs**:
- ✅ Gained: Flexibility preserved; guidance without rigidity
- ❌ Lost: Agents might ignore advisory patterns without human review
- ⚠️ Risk: "Advisory" might be too weak — agents may not surface it

### Decision 3: Platform Variants in YAML, Not Semantic Icon Components

**Options Considered**:
1. Semantic icon components (Icon-Status, Icon-Action, Icon-Navigation) with platform logic
2. Full primitive/semantic icon naming layer with cross-platform resolution
3. Platform-variant conventions in family guidance YAML

**Decision**: Platform variants in YAML.

**Rationale**: Industry consensus (Polaris, Carbon, Material, Atlassian) is one icon component with assets as data. Semantic icon components solve a problem that affects ~5% of icons (platform-divergent ones) while adding component overhead for the 95% that are identical across platforms. A small platform-variants section in the Icon family YAML gives agents the guidance they need without architectural complexity. The ~5 platform-divergent icons get explicit resolution; the rest use primitive names directly.

**Trade-offs**:
- ✅ Gained: No new components; no architectural complexity; consistent with industry
- ❌ Lost: No compile-time enforcement of platform conventions; agents must read guidance
- ⚠️ Risk: If platform divergence grows beyond ~5 icons, YAML approach may not scale

### Decision 4: Exclude Placeholder Families

**Options Considered**:
1. Write guidance YAML for all 13 families including placeholders
2. Write guidance only for production families

**Decision**: Production families only.

**Rationale**: Guidance for unimplemented components has no consumer. A product agent can't use a component that doesn't exist. Writing placeholder guidance is documenting intent, not enabling selection. When placeholder families get implemented (e.g., Navigation via Specs 049/050), their guidance YAML is authored as part of that implementation spec.

**Trade-offs**:
- ✅ Gained: Focused effort on actionable guidance; no wasted content
- ❌ Lost: No forward-looking guidance for planned components
