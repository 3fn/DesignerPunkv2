# Ada Token Review: Spec 049 — Nav-SegmentedChoice-Base

**Date**: 2026-03-11 / 2026-03-12
**Spec**: 049 — Nav-SegmentedChoice-Base
**Author**: Ada
**Type**: Token governance review — all decisions finalized
**Status**: Complete

---

## Review Scope

Full token translation from Figma analysis (`analysis/analysis-segment/`, `analysis/analysis-segmented-controller/`) to semantic and primitive token references. All `[ADA]` markers in the design outline resolved.

---

## Decisions Made

### 1. Container Tokens (resolved 2026-03-10)

| Property | Token | Notes |
|----------|-------|-------|
| Background | `color.structure.surface` (→ white200) | |
| Border radius | `radius.normal` (8px) | |
| Padding | `space.inset.050` (4px all sides) | |
| Item spacing | `space.grouped.none` (0) | Segments flush |
| Border | `border.default` (1px) | |

### 2. Segment Tokens (resolved 2026-03-10)

| Property | Standard | Condensed | Token |
|----------|----------|-----------|-------|
| Padding block | 12px | 8px | `space.inset.150` / `space.inset.100` |
| Padding inline | 16px | 12px | `space.inset.200` / `space.inset.150` |
| Border radius | 4px | 4px | `radius.small` (both states, both sizes) |
| Active bg | — | — | `color.structure.canvas` (→ white100) |
| Label fontSize | 18px | 16px | `fontSize125` / `fontSize100` |
| Label fontWeight | 700 | 700 | `fontWeight700` |
| Label lineHeight | — | — | `lineHeight125` / `lineHeight100` (paired with fontSize) |
| Label color | — | — | `color.action.navigation` (depends on Spec 076) |
| Label typeface | Display | Display | Component token pending |
| Icon color | — | — | Inherits via `currentColor` (confirmed by Lina) |

**Radius correction**: Figma showed inactive=2 (radius.subtle), active=4 (radius.small). Peter corrected: both states use `radius.small`. Inactive radius.subtle was a Figma artifact.

**Line-height**: Figma values (28px, 24px) are tooling artifacts. Implementation uses lineHeight tokens paired with fontSize tokens.

### 3. Hover State (resolved 2026-03-11, Peter approved)

- **Token**: `blend.containerHoverDarker` (4% darker)
- **Scope**: Inactive segments only — active segment gets no hover feedback
- **Rationale**: Segments are large interactive surfaces (container-level blend, not button-level). Active segment hover would falsely suggest interactivity for a no-op.

### 4. Shadow Token (resolved 2026-03-11, Peter approved)

- **Token created**: `shadow.navigation.indicator`
- **Composition**: `shadowOffsetX.000` / `shadowOffsetY.000` / `shadowBlurHard` (4px) / `shadowOpacitySoft` (0.2) / `shadowBlack100`
- **Android elevation**: 2dp
- **Figma source**: Drop shadow effect style `shadow.nav.segmented` — Position X:0, Y:0, Blur:4, Spread:0, Color:#000000 at 20%
- **Naming decision**: `shadow.navigation.indicator` over `shadow.navigation.secondary` — more descriptive, avoids forcing primary/secondary hierarchy on other shadow families
- **All primitives existed** — no new primitives needed

**Android implementation**: Must use `Modifier.shadow()` (purely visual), NOT `Surface(elevation = ...)` or `mapShadowToElevation()`. Absolute elevation in Compose would cause indicator shadow to disappear inside elevated parent surfaces. Lina confirmed and added mandatory `.clip(shape)` requirement.

**Artifacts**:
- Token added to `src/tokens/semantic/ShadowTokens.ts`
- Built and tested: 30 suites, 1020 tests passing
- Generating on all 3 platforms (CSS, Swift, Kotlin)
- Steering docs updated: Token-Family-Shadow.md, Token-Family-Layering.md (Peter approved both)
- MCP index rebuilt: 74 docs, 2401 sections, healthy

### 5. Max-Width (resolved 2026-03-12, Peter approved)

- **Decision**: No max-width token or value on the component
- **Rationale**: Layout responsibility stays with consuming context. Component is full-width within its parent. Recommended: 4 grid columns at active breakpoint.
- **Reasoning**: Consistent with every other component in the system (buttons, cards don't know their max-width). Avoids a web-specific token that breaks cross-platform API symmetry.

### 6. Motion Tokens (resolved 2026-03-12, Peter approved)

**Fast phases** — primitive references at component level (no new semantic tokens):
| Phase | Duration | Easing | Primitives |
|-------|----------|--------|------------|
| Shadow out | 150ms | accelerate | `duration150` + `easingAccelerate` |
| Resize | 150ms | standard | `duration150` + `easingStandard` |
| Shadow in | 150ms | decelerate | `duration150` + `easingDecelerate` |

**Rationale for no semantic tokens**: These are choreography sub-animations within a single interaction, not reusable system-wide patterns. Reusing existing semantic tokens (e.g., `motion.buttonPress`) would create false coupling between unrelated behaviors.

**Glide phase** — new primitive required:
- Duration: `duration350` (existing)
- Easing: `easingGlideDecelerate` (NEW — piecewise linear curve)
- Character: Aggressive deceleration, long settling tail, no overshoot
- **Infrastructure task required**: Extending easing token system to support piecewise linear curves alongside cubic-bezier. Scoped in `findings/ada-easing-infrastructure-for-thurgood.md`.

---

## Dependencies

| Dependency | What it provides | Status |
|-----------|-----------------|--------|
| Spec 076 | `color.action.navigation` token + `wcagValue` infrastructure | Design outline created |
| Easing infrastructure | `easingGlideDecelerate` primitive token type | Task scoped for Thurgood |

---

## Design Outline Updates Applied

All changes applied directly to `design-outline.md`:
- All `[ADA]` markers resolved
- Header updated to ✅ TOKEN REVIEW COMPLETE
- Segment States table updated with hover definition
- Shadow indicator section updated with token name
- Motion Token Requirements table fully populated
- Layout section updated with guidance (no max-width)
- Android platform considerations expanded with `Modifier.shadow()` guidance
- Design Decisions table expanded (decisions 12–18)
- Blocked-on and Next Steps sections updated
