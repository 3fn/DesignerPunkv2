---
inclusion: manual
name: Token-Family-Blur
description: Unified blur token family — single primitive scale for shadow edge softness, glow radial spread, and surface/backdrop blur. Load when working with shadows, glows, translucent surfaces, or any blur effect.
---

# Blur Token Family Documentation

**Date**: 2026-03-31
**Last Reviewed**: 2026-03-31
**Purpose**: Unified blur primitive token reference and usage guide
**Organization**: token-documentation
**Scope**: shadow-glow-token-system
**Layer**: 3
**Relevant Tasks**: component-development, token-selection

---

## Overview

The Blur Token Family provides a unified primitive scale for all blur contexts in DesignerPunk: shadow edge softness, glow radial spread, and surface/backdrop blur. All blur values draw from a single mathematical foundation rather than separate per-context families.

**Base value**: 16 (consistent with `fontSize100 = 16`)

---

## Blur Primitive Tokens

| Token | Formula | Value | Platform Values |
|-------|---------|-------|-----------------|
| `blur000` | 0 | 0 | 0px / 0pt / 0dp |
| `blur025` | base × 0.25 | 4 | 4px / 4pt / 4dp |
| `blur050` | base × 0.5 | 8 | 8px / 8pt / 8dp |
| `blur075` | base × 0.75 | 12 | 12px / 12pt / 12dp |
| `blur100` | base × 1 | 16 | 16px / 16pt / 16dp |
| `blur125` | base × 1.25 | 20 | 20px / 20pt / 20dp |
| `blur150` | base × 1.5 | 24 | 24px / 24pt / 24dp |
| `blur200` | base × 2 | 32 | 32px / 32pt / 32dp |
| `blur250` | base × 2.5 | 40 | 40px / 40pt / 40dp |

All values are multiples of 4 (baseline grid aligned).

---

## Context Consumption

Different blur contexts consume different ranges of the scale. The blur primitives carry numeric values; the consuming context determines how they're applied.

### Shadow Context

Shadow composites (`shadow.sm`, `shadow.md`, etc.) reference blur primitives as one property among several (offset, opacity, color). The blur value controls edge softness.

| Shadow Use | Blur Token | Value | Effect |
|-----------|------------|-------|--------|
| No shadow | `blur000` | 0 | No blur |
| Sharp edges | `blur025` | 4 | Hard, defined edges |
| Standard UI | `blur075` | 12 | Balanced definition |
| Raised elements | `blur100` | 16 | Increased blur for depth |
| Subtle/hover | `blur125` | 20 | Diffuse, gentle edges |
| Floating elements | `blur150` | 24 | Maximum shadow blur |

See also: [Token-Family-Shadow.md](Token-Family-Shadow.md) for complete shadow composite documentation.

### Glow Context

Glow effects use the upper range of the scale for radial spread. Larger blur amounts create diffuse, radiant effects suitable for emphasis.

| Glow Use | Blur Token | Value | Effect |
|----------|------------|-------|--------|
| Subtle glow | `blur050` | 8 | Small elements, subtle emphasis |
| Standard glow | `blur100` | 16 | Medium elements, standard emphasis |
| Strong glow | `blur150` | 24 | Large elements, prominent emphasis |
| Intense glow | `blur200` | 32 | Hero elements, dramatic emphasis |
| Maximum glow | `blur250` | 40 | Focal points, maximum emphasis |

See also: [Token-Family-Glow.md](Token-Family-Glow.md) for glow color and opacity documentation.

### Surface/Backdrop Context

Surface blur is used for translucent surface treatments — frosted glass backgrounds, translucent navigation bars. This is a component-level concern; the blur primitive provides the design intent value.

| Surface Use | Blur Token | Value | Effect |
|------------|------------|-------|--------|
| Light frosted glass | `blur050` | 8 | Gentle depth separation |
| Standard translucent | `blur100` | 16 | Default translucent surface |
| Heavy obscuring | `blur150` | 24 | Strong content obscuring |

**Platform behavior for surface blur**:
- **Web**: `backdrop-filter: blur({value}px)` — direct numeric mapping
- **iOS**: Component code maps to system material enums (`.systemUltraThinMaterial`, `.systemThinMaterial`, `.systemMaterial`) — see Spec 088 for mapping details
- **Android**: Solid backgrounds conventional; numeric value available if needed

**Note**: iOS has two blur consumption patterns — material enums for surface/backdrop blur, and numeric `CGFloat` values for content blur (`.blur(radius:)` modifier). The unified primitives serve both patterns.

---

## Mathematical Foundation

- **Base value**: 16 (same philosophy as `fontSize100 = 16`)
- **Progression**: Linear multipliers (0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5)
- **Grid alignment**: All values are multiples of 4
- **Source file**: `src/tokens/BlurTokens.ts`
- **Category**: `TokenCategory.BLUR`

---

## History

This family was created in Spec 089 by unifying two previously separate families:
- **Shadow blur** (base 4, quality-based naming): `shadowBlurHard`=4, `shadowBlurModerate`=12, `shadowBlurSoft`=20, `shadowBlurDepth200`=16, `shadowBlurDepth300`=24
- **Glow blur** (base 8, numeric naming): `glowBlur100`=8, `glowBlur200`=16, `glowBlur300`=24, `glowBlur400`=32, `glowBlur500`=40

The unification was motivated by Spec 088 (Nav-Header-Base) needing a third blur context (surface blur). Rather than adding a third disconnected family, all blur values were consolidated into a single base-16 scale. Zero visual change — all existing shadow and glow effects resolve to identical numeric values.
