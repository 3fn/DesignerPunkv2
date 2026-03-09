# Requirements Document: Application MCP Completeness

**Date**: 2026-03-08
**Spec**: 071 - Application MCP Completeness
**Status**: Requirements Phase
**Dependencies**:
- Spec 068 (Family Guidance Indexer) - Complete. Established YAML schema, interview process, and FamilyGuidanceIndexer.
  - Status: Complete
  - Required for: All tasks (schema, indexer, D9 compliance process)
  - Integration point: FamilyGuidanceIndexer, companion YAML schema, `get_prop_guidance` MCP tool

---

## Introduction

The Application MCP serves 10 tools across component discovery, composition validation, experience patterns, and family guidance. Post-068, the system is architecturally complete — all planned knowledge layers have at least one implementation. But coverage within the family guidance layer is uneven: 3 of 8 production families have companion YAML files. The remaining 5 production families return null from `get_prop_guidance`.

This spec completes family guidance coverage for all production-ready component families, enriches guidance with discouraged patterns and platform-variant conventions, and expands the Icon-Base asset library to support WrKing Class development needs.

Placeholder families (Modal, Data-Display, Divider, Loading, Navigation) are excluded — guidance for unimplemented components has no consumer value.

---

## Requirements

### Requirement 1: Family Guidance Coverage for Production Families

**User Story**: As a product agent consuming the Application MCP, I want family guidance for every production-ready component family, so that I can make informed component selection decisions without hitting null responses.

#### Acceptance Criteria

1. WHEN a product agent queries `get_prop_guidance` for any production-ready family THEN the system SHALL return structured guidance including `whenToUse`, `whenNotToUse`, `selectionRules`, `accessibilityNotes`, and `patterns`.
2. WHEN a product agent queries `get_prop_guidance` for a placeholder family THEN the system SHALL return null (no change from current behavior).
3. The following production families SHALL have companion YAML files conforming to the established schema:
   - Chips (Chip-Base, Chip-Filter, Chip-Input)
   - Icons (Icon-Base)
   - Avatars (Avatar-Base; Avatar-Group is a planned future variant, not implemented)
   - Progress (Progress-Pagination-Base, Progress-Stepper-Base, Progress-Stepper-Detailed, Progress-Indicator-Node-Base, Progress-Indicator-Connector-Base, Progress-Indicator-Label-Base)
   - Badges (Badge-Count-Base, Badge-Count-Notification, Badge-Label-Base)
4. All companion YAML files SHALL pass D9 compliance validation.
5. All companion YAML files SHALL follow the read-both protocol (companion reference to steering doc).

---

### Requirement 2: Enriched Discouraged Patterns

**User Story**: As a product agent, I want to know not just what to use but what to avoid, so that I can prevent common mistakes without requiring human review for every decision.

#### Acceptance Criteria

1. WHEN a family has known anti-patterns or discouraged compositions THEN the companion YAML SHALL include discouraged patterns beyond the basic `whenNotToUse` list.
2. Discouraged patterns SHALL be framed as advisory, not prohibitive — overridable with human confirmation.
3. Discouraged pattern depth SHALL vary by family complexity — simple families (Avatars, Icons) may have minimal discouraged patterns while complex families (Progress, Chips) may have more.
4. WHEN a discouraged pattern is documented THEN it SHALL include a brief rationale explaining why the pattern is discouraged.

---

### Requirement 3: Platform-Variant Conventions

**User Story**: As a product agent building cross-platform experiences, I want to know when a component or icon has platform-specific conventions, so that I can produce platform-appropriate output without memorizing platform conventions.

#### Acceptance Criteria

1. WHEN a family has components or assets that differ by platform THEN the companion YAML SHALL include a `platformVariants` section documenting the divergence.
2. The Icon family guidance SHALL include platform-variant conventions for icons with known platform divergence (share, back navigation, overflow menu, and others identified during authoring).
3. Platform variants SHALL specify resolution per platform (web, ios, android) with the primitive icon name for each.
4. The `platformVariants` schema pattern SHALL be reusable across families — not Icon-specific.
5. WHEN a family has no platform divergence at the guidance level THEN the `platformVariants` section MAY be omitted.

---

### Requirement 4: Cross-Family Composition References

**User Story**: As a product agent, I want to know which families commonly compose together, so that I can discover related components without querying every family independently.

#### Acceptance Criteria

1. WHEN a family commonly composes with another family THEN the companion YAML SHALL include lightweight cross-family references indicating the relationship.
2. Cross-family references SHALL be descriptive ("Badge composes inside Button-Icon for notification counts") not prescriptive ("You must use Badge with Button-Icon").
3. Cross-family references SHALL link to the companion family's YAML or steering doc for further detail.

---

### Requirement 5: Icon Asset Expansion

**User Story**: As a product agent building WrKing Class, I want the Icon-Base component to include all icons needed for the application, so that I can reference icons by name without hitting missing asset errors.

#### Acceptance Criteria

1. Icon-Base SHALL include all Feather icons required by WrKing Class (~27 additional icons beyond the current 15).
2. Icon-Base SHALL include platform-variant icons identified during Icon family guidance authoring (share variants, back navigation variants, overflow menu variants).
3. New icons SHALL be added across all three platforms: web (SVG), iOS (asset catalog), Android (vector drawable).
4. The `IconBaseName` type in `types.ts` SHALL be updated to include all new icon names.
5. All existing tests SHALL continue to pass after icon expansion.
6. Icon-Base README SHALL be updated to reflect the expanded icon set.

---

### Requirement 6: Vertical Depth Validation (Chips Reference Family)

**User Story**: As the spec author, I want the first family (Chips) to serve as the reference implementation that validates the enriched YAML schema, so that subsequent families can replicate a proven pattern.

#### Acceptance Criteria

1. The Chips family guidance SHALL be authored first and reviewed by Peter before proceeding to subsequent families.
2. The Chips family guidance SHALL demonstrate all schema additions: discouraged patterns, cross-family composition references, and any platform-variant conventions if applicable.
3. WHEN Peter approves the Chips reference THEN the remaining families SHALL follow the same depth model, adjusted for family-specific complexity.
4. IF the Chips reference reveals that any schema addition (discouraged patterns, cross-family refs, platform variants) adds complexity without proportional value THEN that addition MAY be dropped from subsequent families with Peter's approval.

---

### Requirement 7: Documentation Cross-References

**User Story**: As a product agent with access to both the Application MCP and docs MCP, I want family guidance to cross-reference deeper documentation, so that I can drill into token details or architectural context when needed.

#### Acceptance Criteria

1. WHEN a family guidance YAML references tokens THEN it SHALL include a cross-reference to the relevant docs MCP resource (token family doc or steering doc path).
2. Cross-references SHALL use the format established in existing YAML files (companion field, inline comments referencing doc paths).
3. Cross-references SHALL not duplicate content from the docs MCP — they point to it, not reproduce it.
4. Token references SHALL use token names, not raw values: `"Uses space.grouped.tight for chip gap"` not `"Uses 4px gap"`.
5. Token family references SHALL point to docs MCP paths: `"See Token-Family-Spacing.md for stack patterns"`.
