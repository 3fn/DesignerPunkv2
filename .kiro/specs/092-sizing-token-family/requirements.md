# Requirements Document: Sizing Token Family

**Date**: 2026-04-03
**Spec**: 092 - Sizing Token Family
**Status**: Requirements Phase
**Dependencies**: None (Spec 090 benefits from this spec)

---

## Introduction

DesignerPunk uses spacing primitives for both gaps between elements and physical component dimensions. This conflation creates a semantic mismatch — spacing describes gaps, sizing describes dimensions. Six component families plus Nav-TabBar-Base use spacing tokens for dimensional values. This spec introduces a dedicated sizing primitive family and migrates all dimensional references.

---

## Requirements

### Requirement 1: Sizing Primitive Family

**User Story**: As a token system maintainer, I want a dedicated primitive family for component dimensions, so that spacing and sizing are semantically distinct and independently scalable.

#### Acceptance Criteria

1. A `SizingTokens.ts` file SHALL define 13 sizing primitives with base value 8:

   | Token | Formula | Value |
   |-------|---------|-------|
   | `size050` | base × 0.5 | 4 |
   | `size100` | base × 1 | 8 |
   | `size150` | base × 1.5 | 12 |
   | `size200` | base × 2 | 16 |
   | `size250` | base × 2.5 | 20 |
   | `size300` | base × 3 | 24 |
   | `size400` | base × 4 | 32 |
   | `size500` | base × 5 | 40 |
   | `size600` | base × 6 | 48 |
   | `size700` | base × 7 | 56 | *(preemptive — no current consumers)* |
   | `size800` | base × 8 | 64 | *(preemptive — no current consumers)* |
   | `size1000` | base × 10 | 80 |
   | `size1600` | base × 16 | 128 |

2. A `TokenCategory.SIZING` SHALL be added to the token category enum
3. `src/tokens/index.ts` SHALL re-export the sizing family
4. The sizing family SHALL flow through the generic primitive generation pass (no dedicated section, no `DEDICATED_PRIMITIVE_CATEGORIES` exclusion)

### Requirement 2: Component Token Migration

**User Story**: As a component system maintainer, I want component dimensional tokens to reference sizing primitives instead of spacing primitives or hard-coded values, so that the semantic distinction is enforced at the component level.

#### Acceptance Criteria

1. Button-Icon component tokens SHALL reference sizing primitives: `size400` (sm/32), `size500` (md/40), `size600` (lg/48)
2. Progress-Node component tokens SHALL reference sizing primitives: base sizes `size150` (sm/12), `size200` (md/16), `size250` (lg/20); current (emphasized) sizes `size200` (sm.current/16), `size250` (md.current/20), `size300` (lg.current/24). `SPACING_BASE_VALUE` SHALL be renamed to `SIZING_BASE_VALUE`. Current-size tokens SHALL reference sizing primitives directly, not compute from base × multiplier.
3. Nav-TabBar-Base dot size SHALL reference `size050` instead of `space050`
4. Avatar-Base SHALL have a `*.tokens.ts` file created with sizing primitive references for all 6 sizes: `size300` (xs/24), `size400` (sm/32), `size500` (md/40), `size600` (lg/48), `size1000` (xl/80), `size1600` (xxl/128)
5. Input-Checkbox-Base SHALL have a `*.tokens.ts` file created with sizing primitive references for box/container dimensions: `size300` (sm/24), `size400` (md/32), `size500` (lg/40). Icon sizes within the checkbox (checkmark) SHALL remain in the icon family — they are NOT sizing tokens.
6. Input-Radio-Base SHALL have a `*.tokens.ts` file created with sizing primitive references for box/container dimensions: `size300` (sm/24), `size400` (md/32), `size500` (lg/40)
7. WHEN component dimensional tokens are resolved after migration THEN every component SHALL render at the same pixel dimensions as before migration
8. No component public API SHALL change — components still expose `size: 'sm' | 'md' | 'lg'`

### Requirement 3: Generation Pipeline and Export

**User Story**: As a token system maintainer, I want sizing tokens generated across all platform outputs and export formats, so that all consumers have access to the new family.

#### Acceptance Criteria

1. Generated platform token files SHALL include all 13 sizing primitives as numeric values (px for web CSS, pt for iOS Swift, dp for Android Kotlin)
2. DTCG output SHALL include all 13 sizing primitives
3. Figma export SHALL include all 13 sizing primitives
4. WHEN platform token files are regenerated THEN all existing component dimensions SHALL resolve to the same numeric values

### Requirement 4: Zero Visual Change Verification

**User Story**: As a test governance specialist, I want verifiable proof that the migration produces no visual change, so that the token introduction is trustworthy.

#### Acceptance Criteria

1. Formula validation tests SHALL verify each sizing primitive's value matches base × multiplier
2. Mathematical relationship tests SHALL verify the scale progression
3. WHEN the full test suite runs after migration THEN all existing component tests SHALL pass with zero failures
4. All tests referencing old spacing-as-sizing token names SHALL be updated to reference sizing primitives where appropriate

### Requirement 5: Documentation

**User Story**: As any agent, I want sizing token documentation that explains the family's purpose, scale, and relationship to spacing, so that the semantic distinction is understood and maintained.

#### Acceptance Criteria

1. A `Token-Family-Sizing.md` steering doc SHALL be created covering:
   - The sizing primitive scale with formulas and values
   - The semantic distinction between spacing (gaps) and sizing (dimensions)
   - Which component families consume sizing tokens
   - The relationship to spacing (same base, same grid, different purpose)
   - Why icon sizes and tap area tokens are NOT part of this family
2. `Token-Family-Sizing.md` SHALL be queryable via Documentation MCP `get_section()`
3. `Token-Family-Spacing.md` SHALL be updated with a cross-reference noting that dimensional values should use sizing tokens, not spacing tokens
4. The Token Quick Reference (`Token-Quick-Reference.md`) SHALL be updated to include the sizing family in the token documentation map

### Documentation Requirements Waiver

This spec modifies token infrastructure and component token references. It does not introduce new consumer-facing components. Component-level documentation requirements per Process-Spec-Planning are not applicable.
