# Surface Blur Token Family — Design Outline

**Date**: 2026-03-30
**Author**: Ada
**Purpose**: Define a new primitive token family for surface/backdrop blur effects
**Status**: Design Outline — Draft
**Origin**: Spec 088 (Nav-Header-Base) token dependency; existing hard-coded blur in Nav-TabBar-Base

---

## Overview

Surface blur tokens define the blur radius for translucent surface treatments — frosted glass backgrounds, translucent navigation bars, and similar depth-separation effects where content behind a surface is intentionally obscured.

This is distinct from existing blur families:
- **Shadow blur** — edge softness of drop shadows (quality-based: hard/moderate/soft)
- **Glow blur** — radial spread of glow effects (scale-based: 100–500)
- **Surface blur** — backdrop obscuring for translucent surfaces (intensity-based: subtle/standard/heavy)

**Consumers**:
- Nav-Header-Base (`appearance: 'translucent'`) — Spec 088
- Nav-TabBar-Base (floating pill treatment) — future migration from hard-coded values

---

## Mathematical Foundation

Base value: **8 units** (aligns with baseline grid and glow blur base value)

| Token | Formula | Value | Use Case |
|-------|---------|-------|----------|
| `surfaceBlurSubtle` | base × 1 | 8 | Light frosted glass, gentle depth separation |
| `surfaceBlurStandard` | base × 2 | 16 | Default translucent surface — nav bars, tab bars |
| `surfaceBlurHeavy` | base × 3 | 24 | Strong obscuring — overlays, modal backdrops |

Linear base-8 progression. Same mathematical foundation as glow blur (which also starts at 8 and increments by 8). Three tokens covers the known use cases without over-provisioning.

---

## Platform Behavior

This is the key design decision. Surface blur maps to fundamentally different platform APIs.

### Decision: Design Intent Token (Option A)

The token carries a numeric blur radius as design intent. Platform builders translate to native APIs. The token value is not a literal instruction on every platform.

| Platform | Mapping | Notes |
|----------|---------|-------|
| **Web** | `backdrop-filter: blur({value}px)` | Direct numeric mapping. Widely supported (96%+ on caniuse). |
| **iOS** | System material enum | `subtle` → `.systemUltraThinMaterial`, `standard` → `.systemThinMaterial`, `heavy` → `.systemMaterial`. iOS controls the exact blur, saturation, and tint. The token selects the intensity tier. |
| **Android** | Solid background (conventional) | Android convention is opaque surfaces, not translucent. Token is available but not consumed by default. `RenderEffect.createBlurEffect()` exists for apps that want it. |

**Precedent**: Easing tokens follow this pattern — cubic-bezier values that map to `Animation.timingCurve` on iOS and `CubicBezierEasing` on Android. The token carries design intent; the platform builder translates.

**New ground**: Easing values are mathematically equivalent across platforms. Blur values aren't — iOS `.systemThinMaterial` doesn't produce exactly 16px of Gaussian blur. The mapping is approximate, matching visual intensity rather than exact pixel values. This is an acceptable trade-off for a design intent token.

### iOS Material Mapping Rationale

| Token | iOS Material | Visual Character |
|-------|-------------|-----------------|
| `surfaceBlurSubtle` (8) | `.systemUltraThinMaterial` | Lightest system blur, content mostly visible |
| `surfaceBlurStandard` (16) | `.systemThinMaterial` | Standard translucency, content softly visible |
| `surfaceBlurHeavy` (24) | `.systemMaterial` | Heavier blur, content largely obscured |

These mappings are based on visual intensity matching, not pixel equivalence. Kenya should validate during implementation that the visual weight feels right.

---

## Token Architecture

### Primitive Tokens

```
surfaceBlurSubtle    = 8    (base × 1)
surfaceBlurStandard  = 16   (base × 2)
surfaceBlurHeavy     = 24   (base × 3)
```

Category: `SURFACE_BLUR` (new TokenCategory)

Platform values follow the standard pattern:
- Web: `{ value: N, unit: 'px' }`
- iOS: `{ value: N, unit: 'pt' }`
- Android: `{ value: N, unit: 'dp' }`

### Semantic Tokens

No semantic tokens in v1. The primitives are directly consumed by component tokens. If a pattern emerges (e.g., "navigation surface blur" vs "overlay surface blur" both mapping to `surfaceBlurStandard`), semantic tokens can be added later.

**Counter-argument**: Starting without semantics means components reference primitives directly, which is lower in the token governance hierarchy. However, with only three values and two consumers, a semantic layer would be premature abstraction — it would just be 1:1 aliases.

---

## Naming

`surfaceBlur` prefix rather than `backdropBlur` because:
- "Surface" aligns with DesignerPunk's surface/canvas vocabulary (`color.structure.canvas`, `color.structure.surface`)
- "Backdrop" is CSS-specific terminology (`backdrop-filter`)
- The token describes the surface's visual treatment, not the CSS property that implements it

Intensity suffixes (subtle/standard/heavy) rather than numeric scale (100/200/300) because:
- Matches shadow blur's quality-based naming (hard/moderate/soft)
- Three tokens don't need a numeric scale — the names communicate intent directly
- If we expand beyond three, we can add intermediates (`surfaceBlurLight`, `surfaceBlurDense`) without renumbering

---

## Scope

### In Scope
- Primitive token definitions (3 tokens)
- Token source file (`src/tokens/SurfaceBlurTokens.ts`)
- Token tests (formula validation, mathematical relationships, cross-platform consistency)
- Token registration in `src/tokens/index.ts`
- TokenCategory addition (`SURFACE_BLUR`)
- Platform builder updates (web, iOS, Android) for surface blur generation
- Generation pipeline — `TokenFileGenerator` handles new category in generated output
- Regenerate `dist/` platform token files
- Token-Family-Blur.md steering doc (or Token-Family-Surface-Blur.md)
- Application MCP indexes new tokens
- Documentation MCP serves family doc

### Out of Scope
- Component consumption (Nav-Header-Base, Nav-TabBar-Base) — that's Lina's domain in Specs 088 and future TabBar work
- Semantic tokens — deferred until a pattern emerges
- DTCG export — can be added later if needed

### Migration
- Nav-TabBar-Base's hard-coded blur values (if any exist) should migrate to `surfaceBlurStandard` — but this is component work owned by Lina, not token work

---

## Open Questions

1. **Family doc naming**: `Token-Family-Surface-Blur.md` (specific) or `Token-Family-Blur.md` (umbrella covering shadow blur, glow blur, and surface blur)? An umbrella doc would consolidate blur documentation but might be unwieldy given the three families have different mathematical foundations and naming conventions.

2. **DTCG export**: Should surface blur tokens appear in the DTCG output? Current blur tokens (shadow, glow) are included. Likely yes for consistency, but confirming.

3. **Android consumption**: Should the Android builder generate surface blur constants even though Android convention is solid backgrounds? Generating them costs nothing and keeps the option open. Omitting them is cleaner but means Android components can't reference them without builder changes later.

---

## Dependencies

- **Spec 088** depends on this spec (Nav-Header-Base `appearance: 'translucent'` needs `surfaceBlurStandard`)
- No upstream dependencies — this is a new token family with no prerequisites

---

## Risk Assessment

**Low risk**. This is a well-understood pattern:
- Token definition follows established conventions (ShadowBlurTokens, GlowBlurTokens)
- Platform builder extension is mechanical
- Three tokens, linear progression, no complex derivation
- Strong test coverage pattern to follow

The only novel aspect is the iOS material enum mapping — a design intent mapping rather than a literal value translation. This should be validated visually by Kenya during Spec 088 implementation.
