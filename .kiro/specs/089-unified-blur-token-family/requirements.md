# Requirements Document: Unified Blur Token Family

**Date**: 2026-03-30
**Spec**: 089 - Unified Blur Token Family
**Status**: Requirements Phase
**Dependencies**: None (Spec 088 depends on this spec)

---

## Introduction

DesignerPunk has two separate blur primitive families (shadow blur, glow blur) with different base values and naming conventions. Spec 088 (Nav-Header-Base) needs a third blur context (surface blur). Rather than adding a third disconnected family, this spec unifies all blur values into a single primitive scale with a consistent mathematical foundation.

---

## Requirements

### Requirement 1: Unified Blur Primitive Family

**User Story**: As a token system maintainer, I want a single blur primitive family with a consistent mathematical foundation, so that all blur contexts (shadow, glow, surface) draw from one scale.

#### Acceptance Criteria

1. A `BlurTokens.ts` file SHALL define 9 blur primitives with base value 16 and the following scale:

   | Token | Formula | Value |
   |-------|---------|-------|
   | `blur000` | 0 | 0 |
   | `blur025` | base × 0.25 | 4 |
   | `blur050` | base × 0.5 | 8 |
   | `blur075` | base × 0.75 | 12 |
   | `blur100` | base × 1 | 16 |
   | `blur125` | base × 1.25 | 20 |
   | `blur150` | base × 1.5 | 24 |
   | `blur200` | base × 2 | 32 |
   | `blur250` | base × 2.5 | 40 |

2. A `TokenCategory.BLUR` SHALL be added to the token category enum
3. `ShadowBlurTokens.ts` and `GlowBlurTokens.ts` SHALL be deleted
4. `src/tokens/index.ts` SHALL re-export the unified blur family

### Requirement 2: Shadow Composite Migration

**User Story**: As a token system maintainer, I want shadow composite tokens to reference the unified blur primitives, so that the old shadow blur tokens can be removed without breaking any shadow effects.

#### Acceptance Criteria

1. `ShadowTokens.ts` composite references SHALL be updated to use unified blur primitive names:

   | Old Reference | New Reference | Value (unchanged) |
   |--------------|--------------|-------------------|
   | `shadowBlurNone` | `blur000` | 0 |
   | `shadowBlurHard` | `blur025` | 4 |
   | `shadowBlurModerate` | `blur075` | 12 |
   | `shadowBlurSoft` | `blur125` | 20 |
   | `shadowBlurDepth200` | `blur100` | 16 |
   | `shadowBlurDepth300` | `blur150` | 24 |

2. WHEN shadow composite tokens are resolved after migration THEN every composite SHALL produce the same numeric blur value as before migration
3. No component token files SHALL require changes (components reference shadow composites, not blur primitives — confirmed by Lina R1)

### Requirement 3: Glow Token Migration

**User Story**: As a token system maintainer, I want glow blur tokens replaced by unified blur primitives, so that the old glow blur tokens can be removed.

#### Acceptance Criteria

1. Glow blur token definitions SHALL be replaced by unified blur primitives:

   | Old Token | New Token | Value (unchanged) |
   |-----------|----------|-------------------|
   | `glowBlur100` | `blur050` | 8 |
   | `glowBlur200` | `blur100` | 16 |
   | `glowBlur300` | `blur150` | 24 |
   | `glowBlur400` | `blur200` | 32 |
   | `glowBlur500` | `blur250` | 40 |

2. No consumer updates SHALL be required beyond the token definitions themselves (glow blur primitives have zero semantic composite or component consumers — confirmed by Lina R1)

### Requirement 4: Generation Pipeline

**User Story**: As a token system maintainer, I want the generation pipeline to handle blur tokens as numeric primitives, so that all platform token files include the unified blur family.

#### Acceptance Criteria

1. The `TokenFileGenerator` SHALL handle `TokenCategory.BLUR` as a standard primitive category in the generic generation pass (no dedicated section, no `DEDICATED_PRIMITIVE_CATEGORIES` exclusion)
2. Generated platform token files SHALL include all 9 blur primitives as numeric values (px for web CSS, pt for iOS Swift, dp for Android Kotlin)
3. DTCG output SHALL include all 9 blur primitives
4. Figma export SHALL include all 9 blur primitives
5. WHEN platform token files are regenerated THEN all existing shadow and glow blur values SHALL be present under their new names with identical numeric values

### Requirement 5: Zero Visual Change Verification

**User Story**: As a test governance specialist, I want verifiable proof that the migration produces no visual change, so that the token unification is trustworthy.

#### Acceptance Criteria

1. Formula validation tests SHALL verify each blur primitive's value matches base × multiplier
2. Mathematical relationship tests SHALL verify the scale progression (blur000 < blur025 < blur050 < ... < blur250)
3. WHEN the full test suite runs after migration THEN all existing shadow and glow tests SHALL pass with zero failures (values unchanged)
4. All tests referencing old shadow blur or glow blur token names SHALL be migrated to reference new unified names

### Requirement 6: Documentation

**User Story**: As any agent, I want blur token documentation that reflects the unified family, so that the token system documentation is accurate and queryable.

#### Acceptance Criteria

1. A `Token-Family-Blur.md` steering doc SHALL be created covering the unified primitive family, with sections noting how shadow, glow, and surface contexts consume different ranges of the scale
2. `Token-Family-Shadow.md` SHALL be updated to replace the blur primitive section with a cross-reference to `Token-Family-Blur.md`
3. `Token-Family-Glow.md` SHALL be updated to replace the blur primitive section with a cross-reference to `Token-Family-Blur.md`
4. All three docs SHALL be queryable via Documentation MCP `get_section()`
5. The blur family doc SHALL note that iOS has two blur consumption patterns: material enums for surface blur (component-level, Spec 088) and numeric values for content blur (future)

### Documentation Requirements Waiver

This spec modifies token infrastructure and documentation. It does not introduce new consumer-facing components. Component-level documentation requirements per Process-Spec-Planning are not applicable.
