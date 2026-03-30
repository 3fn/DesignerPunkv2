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

Consumers to update: Glow semantic tokens (if they exist as composites), any direct references.

### Files Affected

- **Delete**: `src/tokens/ShadowBlurTokens.ts`, `src/tokens/GlowBlurTokens.ts`
- **Create**: `src/tokens/BlurTokens.ts` (unified family)
- **Update**: `src/tokens/index.ts` (re-export), `src/tokens/semantic/ShadowTokens.ts` (reference names), glow semantic tokens (reference names)
- **Update**: All tests referencing old token names
- **Update**: Token-Family docs (new Token-Family-Blur.md replaces blur sections in Shadow and Glow family docs)
- **Regenerate**: `dist/` platform token files
- **Update**: DTCG generator (if blur tokens are exported)

---

## Scope

### In Scope
- Unified blur primitive definitions (9 tokens in `BlurTokens.ts`)
- `TokenCategory.BLUR` (new category, replaces blur-specific handling in SHADOW and GLOW)
- Migration of shadow composite tokens to reference new blur primitives
- Migration of glow tokens to reference new blur primitives
- Removal of `ShadowBlurTokens.ts` and `GlowBlurTokens.ts`
- Platform builder updates for surface blur generation (web backdrop-filter, iOS material mapping)
- Token-Family-Blur.md steering doc
- Test updates (formula validation, mathematical relationships, cross-platform consistency)
- Generation pipeline updates
- Regenerate `dist/` platform token files
- MCP updates

### Out of Scope
- Component consumption of surface blur (Nav-Header-Base, Nav-TabBar-Base) — Lina's domain
- Semantic blur layer — not needed; composites provide the semantic meaning
- Changes to shadow or glow composite token values — only the primitive references change, not the resolved values

### Key Constraint
**Zero visual change.** Every existing shadow and glow effect resolves to the same numeric value after migration. This is a naming/architecture change, not a design change.

---

## Open Questions

1. **Token-Family doc**: Single `Token-Family-Blur.md` covering the unified primitive family, with sections noting how shadow, glow, and surface contexts consume different ranges of the scale?

2. **DTCG export**: Include all 9 blur primitives? Current shadow and glow blur tokens are included.

3. **Android surface blur generation**: Generate constants even though Android convention is solid backgrounds? Lean yes — costs nothing, keeps the door open.

4. **Spec scope**: This is larger than the original "3 surface blur tokens" proposal. It's still a single-file-family token change with mechanical migration, but the test surface is broader. Confirm this is still "just do it" territory or if it warrants requirements/design docs.

---

## Dependencies

- **Spec 088** depends on this spec (Nav-Header-Base `appearance: 'translucent'` needs surface blur tokens)
- No upstream dependencies

---

## Risk Assessment

**Low-medium risk.** The migration is mechanical (rename references, same values), but the surface area is broader than a new-family-only spec:
- Shadow composite tokens are consumed by components — reference chain must be verified
- Two existing test files for shadow blur and glow blur need migration
- Generation pipeline needs to handle the new `BLUR` category

Mitigated by: zero visual change (same values), strong existing test coverage, and clear 1:1 mapping between old and new token names.
