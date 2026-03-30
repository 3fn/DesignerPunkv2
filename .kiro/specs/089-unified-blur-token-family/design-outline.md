# Unified Blur Token Family — Design Outline

**Date**: 2026-03-30
**Author**: Ada
**Purpose**: Unify shadow blur, glow blur, and surface blur into a single primitive token family
**Status**: Design Outline — Draft
**Origin**: Spec 088 (Nav-Header-Base) token dependency; architectural alignment opportunity

---

## Overview

DesignerPunk currently has two separate blur primitive families with different base values and naming conventions:

- **Shadow blur** (base 4): `shadowBlurNone`=0, `shadowBlurHard`=4, `shadowBlurModerate`=12, `shadowBlurSoft`=20, `shadowBlurDepth200`=16, `shadowBlurDepth300`=24
- **Glow blur** (base 8): `glowBlur100`=8, `glowBlur200`=16, `glowBlur300`=24, `glowBlur400`=32, `glowBlur500`=40

Spec 088 (Nav-Header-Base) needs a third blur context: surface/backdrop blur for translucent surfaces. Rather than adding a third disconnected family, this spec unifies all blur values into a single primitive scale — same philosophy as spacing, fontSize, and other foundational token families.

**Timing**: Before product development begins. Unifying later, after product screens reference these tokens, would be significantly harder.

---

## Mathematical Foundation

**Base value**: 16 (same philosophy as `fontSize100 = 16`)

| Token | Formula | Value | Current Consumers |
|-------|---------|-------|-------------------|
| `blur000` | 0 | 0 | `shadowBlurNone` |
| `blur025` | base × 0.25 | 4 | `shadowBlurHard` |
| `blur050` | base × 0.5 | 8 | `glowBlur100`, surface subtle |
| `blur075` | base × 0.75 | 12 | `shadowBlurModerate` |
| `blur100` | base × 1 | 16 | `shadowBlurDepth200`, `glowBlur200`, surface standard |
| `blur125` | base × 1.25 | 20 | `shadowBlurSoft` |
| `blur150` | base × 1.5 | 24 | `shadowBlurDepth300`, `glowBlur300`, surface heavy |
| `blur200` | base × 2 | 32 | `glowBlur400` |
| `blur250` | base × 2.5 | 40 | `glowBlur500` |

Every existing blur value across both families maps cleanly to this scale. All values are multiples of 4 (baseline grid aligned).

---

## Architecture

No semantic blur layer. The primitives are consumed directly by the higher-level tokens that already provide semantic meaning:

```
Primitives:    blur000  blur025  blur050  blur075  blur100  blur125  blur150  blur200  blur250
                  ↓       ↓                 ↓        ↓        ↓        ↓
Composites:   shadow.sm  shadow.md       shadow.lg  glow.*   surface consumers   component tokens
```

- **Shadow composites** (`shadow.sm`, `shadow.md`, etc.) already encode intent — they reference blur primitives as one property among several (offset, opacity, color). No intermediate `shadow.blur.X` semantic needed.
- **Glow composites** — same pattern. The glow semantic tokens compose blur with color and spread.
- **Surface blur** — consumed directly by component tokens (Nav-Header-Base, Nav-TabBar-Base). Only two consumers; a semantic layer would be premature 1:1 aliasing.

---

## Platform Behavior for Surface Blur

Shadow and glow blur map to numeric values on all platforms (px/pt/dp). Surface blur is different — it maps to fundamentally different platform APIs:

| Platform | Surface Blur Mapping | Notes |
|----------|---------------------|-------|
| **Web** | `backdrop-filter: blur({value}px)` | Direct numeric mapping |
| **iOS** | System material enum | `blur050` → `.systemUltraThinMaterial`, `blur100` → `.systemThinMaterial`, `blur150` → `.systemMaterial` |
| **Android** | Solid background (conventional) | Token available but not consumed by default |

The blur primitive carries the numeric value. The platform builder for surface blur contexts translates to native APIs. This is a builder concern, not a token definition concern — similar to how easing tokens carry cubic-bezier values that iOS maps to `Animation.timingCurve`.

**Note**: Only surface blur has this platform divergence. Shadow and glow blur use the numeric value directly on all platforms.

---

## Migration

### Shadow Blur → Unified Primitives

| Old Token | New Reference | Value |
|-----------|--------------|-------|
| `shadowBlurNone` | `blur000` | 0 |
| `shadowBlurHard` | `blur025` | 4 |
| `shadowBlurModerate` | `blur075` | 12 |
| `shadowBlurSoft` | `blur125` | 20 |
| `shadowBlurDepth200` | `blur100` | 16 |
| `shadowBlurDepth300` | `blur150` | 24 |

Consumers to update: `ShadowTokens.ts` (semantic shadow composites reference blur primitives by name).

### Glow Blur → Unified Primitives

| Old Token | New Reference | Value |
|-----------|--------------|-------|
| `glowBlur100` | `blur050` | 8 |
| `glowBlur200` | `blur100` | 16 |
| `glowBlur300` | `blur150` | 24 |
| `glowBlur400` | `blur200` | 32 |
| `glowBlur500` | `blur250` | 40 |

Consumers to update: **None.** Glow blur primitives have no semantic composite consumers and no component consumers. They are infrastructure tokens with no current references — migration is limited to the token definitions themselves.

### Files Affected

- **Delete**: `src/tokens/ShadowBlurTokens.ts`, `src/tokens/GlowBlurTokens.ts`
- **Create**: `src/tokens/BlurTokens.ts` (unified family)
- **Create**: `.kiro/steering/Token-Family-Blur.md`
- **Update**: `src/tokens/index.ts` (re-export), `src/tokens/semantic/ShadowTokens.ts` (reference names)
- **Update**: `src/types/PrimitiveToken.ts` (add `TokenCategory.BLUR`)
- **Update**: Platform builders — surface blur formatting (web: backdrop-filter, iOS: material enum, Android: numeric constant)
- **Update**: `TokenFileGenerator` — generation pipeline handling for `BLUR` category
- **Update**: `.kiro/steering/Token-Family-Shadow.md` (replace blur primitive section with cross-reference)
- **Update**: `.kiro/steering/Token-Family-Glow.md` (replace blur primitive section with cross-reference)
- **Update**: DTCG generator (blur token export)
- **Update**: All tests referencing old token names (shadow blur tests, glow blur tests, integration tests)
- **Regenerate**: `dist/` platform token files

**Note**: Glow blur migration has zero consumer updates — no semantic composites or components reference glow blur tokens. Shadow blur migration is limited to `ShadowTokens.ts` composite references.

---

## Scope

### In Scope
- Unified blur primitive definitions (9 tokens in `BlurTokens.ts`)
- `TokenCategory.BLUR` (new category, replaces blur-specific handling in SHADOW and GLOW)
- Migration of shadow composite tokens to reference new blur primitives
- Migration of glow token definitions to new blur primitives
- Removal of `ShadowBlurTokens.ts` and `GlowBlurTokens.ts`
- Platform builder updates for surface blur generation (web backdrop-filter, iOS material enum mapping, Android numeric constant)
- Generation pipeline updates (`TokenFileGenerator` BLUR category handling)
- DTCG export for blur tokens
- Token-Family-Blur.md steering doc (new)
- Token-Family-Shadow.md and Token-Family-Glow.md updates (cross-references)
- Test migration and new test coverage (formula validation, mathematical relationships, cross-platform consistency)
- Regenerate `dist/` platform token files
- MCP updates (Application MCP indexes new tokens, Documentation MCP serves family doc)

### Out of Scope
- Component consumption of surface blur (Nav-Header-Base, Nav-TabBar-Base) — Lina's domain
- Semantic blur layer — not needed; composites provide the semantic meaning
- Changes to shadow or glow composite token values — only the primitive references change, not the resolved values

### Key Constraint
**Zero visual change.** Every existing shadow and glow effect resolves to the same numeric value after migration. This is a naming/architecture change, not a design change.

---

## Confirmed Decisions (Ada + Peter, 2026-03-30)

### Q1: Token-Family Doc — Single Unified Doc
Single `Token-Family-Blur.md` covering the unified primitive family, with sections noting how shadow, glow, and surface contexts consume different ranges of the scale. Shadow and Glow family docs (`Token-Family-Shadow.md`, `Token-Family-Glow.md`) updated with cross-references to the new Blur family doc.

### Q2: Export — All Formats, All Platforms
All 9 blur primitives included in DTCG output, Figma export, and all three platform token files (web CSS, iOS Swift, Android Kotlin). Verification at completion: tokens present and correct in all generated output formats.

### Q3: Android Surface Blur — Generate Constants
Android blur constants generated even though Android convention is solid backgrounds. Keeps the door open for future consumption.

---

## Dependencies

- **Spec 088** depends on this spec (Nav-Header-Base `appearance: 'translucent'` needs surface blur tokens)
- No upstream dependencies

---

## Risk Assessment

This spec touches two established token families, their consumers, the generation pipeline, platform builders, and documentation:

- Shadow composite tokens are consumed by components — the reference chain from blur primitives through shadow composites to component tokens must be verified end-to-end
- Two existing test files for shadow blur and glow blur need full migration
- Generation pipeline needs to handle the new `BLUR` category
- Platform builders need new surface blur formatting logic — including a novel iOS material enum mapping pattern
- Three steering docs need updates (new Blur family doc, Shadow and Glow cross-references)

Mitigated by: zero visual change (same numeric values), strong existing test coverage (8041 tests), clear 1:1 mapping between old and new token names, and the glow side having zero consumers to update.
