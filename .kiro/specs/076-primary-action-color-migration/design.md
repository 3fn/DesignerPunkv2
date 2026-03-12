# Design Document: Primary Action Color Migration & Color Foundation Harmonization

**Date**: 2026-03-12
**Spec**: 076 - Primary Action Color Migration
**Status**: Design Phase
**Dependencies**: None

---

## Ada/Lina Review Feedback — Resolved

| # | Feedback | Resolution |
|---|----------|------------|
| A1 | Cyan semantic collision | `color.data` → purple300, `color.tech` → purple400. Added to Token Migration Map |
| A2 | Teal/info WCAG overlap | Info feedback gains `wcagValue` → purple in WCAG. Added to Token Migration Map |
| A3 | `wcagValue` composite token scope | Documented: overrides `value` key only, composites unaffected |
| A4 | DTCG/Figma gap | Option A: guard rails now, full support deferred. Added to Error Handling |
| A5 | Navigation contrast overstated | Corrected to "Sub-AA" with explicit rationale |
| A6 | Remaining cyan overlaps (select, progress) | Accepted: semantically action-adjacent, shared hue reinforces relationship |

---

## Overview

This spec extends the semantic token architecture with theme-conditional primitive references (`wcagValue`), migrates the action color system from purple to cyan/teal, harmonizes gray primitives, reassigns semantic color roles to resolve hue collisions, and refactors brittle color tests. The architecture change is small (one optional field); the migration scope is broad (primitives, semantic tokens, generators, components, tests).

---

## Architecture

### `wcagValue` Extension

Current `primitiveReferences`:
```ts
primitiveReferences: { value: 'purple300' }
```

Extended:
```ts
primitiveReferences: { 
  value: 'cyan300',       // Standard theme
  wcagValue: 'teal300'    // WCAG theme (optional, falls back to value)
}
```

**Generator resolution logic** (same for all 3 platforms):
```
if (themeContext === 'wcag' && token.primitiveReferences.wcagValue) {
  resolve(token.primitiveReferences.wcagValue)
} else {
  resolve(token.primitiveReferences.value)
}
```

Backward compatible — existing tokens without `wcagValue` are unaffected.

**Scope note**: `wcagValue` provides a theme-conditional override for the `value` key specifically. Composite tokens using other key names (e.g., `{ color: 'gray100', opacity: 'opacity048' }`) are not affected. If composite tokens ever need theme-conditional behavior, that would require a different pattern — not in scope here.

### Token Migration Map

#### Semantic Tokens (Modified)

| Token | Current | New Standard | New WCAG | Uses `wcagValue` |
|-------|---------|-------------|----------|-----------------|
| `color.action.primary` | `purple300` | `cyan300` | `teal300` | Yes |
| `color.background.primary.subtle` | `purple100` | `cyan100` | `teal100` | Yes |
| `color.action.secondary` | `black400` | `gray400` | — | No |
| `color.data` | `cyan300` | `purple300` | — | No |
| `color.tech` | `cyan400` | `purple400` | — | No |
| `color.feedback.info.text` | `teal400` | `teal400` | `purple500` | Yes |
| `color.feedback.info.background` | `teal100` | `teal100` | `purple100` | Yes |
| `color.feedback.info.border` | `teal400` | `teal400` | `purple500` | Yes |

**Hue strategy rationale**: Cyan becomes the primary brand/action hue. Purple is reassigned to data, tech, and informational semantics — a coherent "informational/analytical" grouping. In WCAG mode, teal is reserved exclusively for actions, and info feedback shifts to purple to avoid hue collision. This gives each theme clean hue separation between "things you act on" and "things that inform you."

#### Semantic Tokens (New)

| Token | Standard | WCAG | Uses `wcagValue` |
|-------|----------|------|-----------------|
| `color.contrast.onAction` | `black500` | `white100` | Yes |
| `color.action.navigation` | `cyan500` | `teal500` | Yes |

#### Primitives (Modified — values only)

| Token | Current | Proposed | Luminosity Δ |
|-------|---------|----------|-------------|
| `gray100` | `rgba(184, 182, 200, 1)` | `rgba(178, 188, 196, 1)` | 73 → 74 |
| `gray200` | `rgba(104, 101, 138, 1)` | `rgba(94, 112, 124, 1)` | 42 → 43 |
| `gray300` | `rgba(45, 43, 62, 1)` | `rgba(38, 50, 58, 1)` | 24 → 23 |
| `gray400` | `rgba(31, 29, 46, 1)` | `rgba(24, 34, 40, 1)` | 15 → 15 |
| `gray500` | `rgba(21, 19, 31, 1)` | `rgba(16, 22, 26, 1)` | 10 → 10 |

14 semantic tokens consume gray primitives. Luminosity preserved — no contrast ratio changes, no semantic token modifications needed.

---

## Components and Interfaces

### `primitiveReferences` Interface Change

```typescript
interface PrimitiveReferences {
  value: string;        // existing — primitive token name
  wcagValue?: string;   // new — optional WCAG-specific primitive
}
```

### Generator Changes

Each platform generator's semantic color resolution function gains one conditional:

- **Web** (`WebBuilder.ts`): When outputting WCAG theme CSS custom properties, check `wcagValue`
- **iOS** (`iOSBuilder.ts`): When outputting WCAG theme Swift constants, check `wcagValue`
- **Android** (`AndroidBuilder.ts`): When outputting WCAG theme Kotlin constants, check `wcagValue`

The change is identical across all three — one `if` branch in the theme resolution path.

### Component Changes

| Component | Change | Reason |
|-----------|--------|--------|
| Button-CTA | Switch from `color.contrast.onDark` to `color.contrast.onAction` for filled variant text and icon optical balance | Text color flips per theme (dark on cyan Standard, white on teal WCAG). This is a visible behavioral change — filled buttons go from white text to dark text in Standard theme. |
| Button-Icon | Add `color.contrast.onAction` consumption for primary variant icon color | Currently uses `color: inherit` on icon; needs explicit contrast token for primary variant on action background |

**Note**: `color.contrast.onDark` is NOT removed or modified. Other components (Input-Text fields, Avatar-Base) continue consuming it. Only Button-CTA and Button-Icon stop using it for their primary/filled variants.

---

## Contrast Analysis

### Primary Action Backgrounds

| Theme | Background | Text Token | Text Color | Contrast | Result |
|-------|-----------|------------|------------|----------|--------|
| Standard | cyan300 | `color.contrast.onAction` | black500 | 14.91:1 | ✅ AAA |
| WCAG | teal300 | `color.contrast.onAction` | white100 | 8.62:1 | ✅ AAA |

### Navigation Labels (Spec 049)

| Theme | Label Color | On white100 | On white200 | Result |
|-------|------------|-------------|-------------|--------|
| Standard | cyan500 | 4.27:1 | 3.93:1 | Sub-AA — accepted trade-off (see note) |
| WCAG | teal500 | 14.39:1 | 13.25:1 | ✅ AAA |

**Standard theme navigation contrast note**: Both nav label sizes in Spec 049 (fontSize125 = 18px / fontSize100 = 16px, both bold) fall below WCAG 2.1's "large text" threshold (≥18pt regular or ≥14pt bold = 18.67px). At 4.27:1 on white100 and 3.93:1 on white200, Standard theme navigation labels fail AA for normal text (4.5:1 required). This is an accepted trade-off: Standard theme prioritizes the cyan brand identity with bold weight as visual mitigation. The WCAG theme (teal500, AAA) fully resolves contrast for users who need it. See Spec 049 design outline for full analysis.

### Info Feedback (WCAG Theme — Purple Migration)

| Theme | Token | Primitive | On purple100 | On white100 | Result |
|-------|-------|-----------|-------------|-------------|--------|
| Standard | `color.feedback.info.text` | teal400 | 8.73:1 | 10.99:1 | ✅ AAA |
| WCAG | `color.feedback.info.text` | purple500 | 8.32:1 | 10.32:1 | ✅ AAA |

Purple500 maintains AAA contrast in WCAG mode — no regression from the current teal400 standard theme numbers.

---

## Error Handling

| Condition | Behavior |
|-----------|----------|
| `wcagValue` references nonexistent primitive | Generator throws with descriptive error (same as invalid `value`) |
| `wcagValue` absent | Falls back to `value` for WCAG theme (backward compatible) |
| Token with `wcagValue` exported via DTCG or Figma pipeline | Generator throws with descriptive error — `wcagValue` not supported in these formats yet. Prevents silent data loss. (See Decision 9, `findings/lina-dtcg-figma-wcagvalue-gap.md`) |

---

## Testing Strategy

### Infrastructure Tests
- `wcagValue` resolution: generator outputs correct primitive per theme context
- Backward compatibility: tokens without `wcagValue` generate identically to before
- Error handling: invalid `wcagValue` reference produces clear error

### Token Migration Tests
- `color.action.primary` resolves to cyan300/teal300 per theme
- `color.contrast.onAction` resolves to black500/white100 per theme
- `color.action.navigation` resolves to cyan500/teal500 per theme
- `color.action.secondary` resolves to gray400
- `color.background.primary.subtle` resolves to cyan100/teal100 per theme
- `color.data` resolves to purple300 (both themes)
- `color.tech` resolves to purple400 (both themes)
- `color.feedback.info.text` resolves to teal400/purple500 per theme
- `color.feedback.info.background` resolves to teal100/purple100 per theme
- `color.feedback.info.border` resolves to teal400/purple500 per theme
- Gray primitives output new RGBA values

### Component Test Refactoring
- Button-CTA test + icon-integration test: verify token consumption (`var(--color-contrast-on-action)`) not hardcoded hex
- Button-CTA test-utils: replace hardcoded `#A855F7` for `--color-action-primary`
- Button-Icon test-utils: replace hardcoded `#A855F7` for `--color-action-primary` and `--accessibility-focus-color`
- Input-Text-Base test-utils: replace hardcoded `#A855F7` for legacy `--color-primary` (also update prop name if still referencing pre-Spec 052 name)
- Blend math tests: unchanged (add clarifying comment only)

### Visual Verification
- Blend calculations on cyan: hover (8% darker), pressed (12% darker), disabled (12% desaturated)
- Manual inspection — automated pixel comparison not in scope

---

## Design Decisions

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | `wcagValue` on `primitiveReferences` (Option 4) | Backward compatible, primitives stay honest, decision lives at semantic layer. `wcagValue` overrides the `value` key only — composite tokens unaffected. |
| 2 | `color.contrast.onAction` (not `onPrimary`) | `onPrimary` conflicts with Spec 052 removal; `onAction` is semantically accurate |
| 3 | Gray luminosity preservation | Hue shift without contrast ratio changes — no accessibility impact |
| 4 | Blend math tests left unchanged | Pure math with arbitrary input; refactoring adds risk for no behavioral benefit |
| 5 | `color.action.secondary` → gray400 | Neutral gray creates hierarchy without competing hues |
| 6 | Purple reassigned to data/tech/info | Cyan vacating tech/data role creates collision with `color.action.primary` (both cyan300). Purple gets a coherent semantic home: "informational/analytical content." Zero component blast radius — `color.data` and `color.tech` have no current component consumers. |
| 7 | Info feedback → purple in WCAG mode | Teal reserved exclusively for actions in WCAG mode. Info shifts to purple500/purple100 to avoid hue collision. Purple500 maintains AAA contrast (8.32:1 on purple100). |
| 8 | Component test refactoring covers 3 test-utils + 2 test files | All files with hardcoded `#A855F7` that reference token CSS custom properties |
| 9 | DTCG/Figma: guard rails now, full support as follow-up | `wcagValue` is the first theme-conditional primitive reference — designing an interop format from n=5 tokens risks premature commitment. Guard rails (throw on export if `wcagValue` present and exporter doesn't support it) prevent silent data loss. Format design deferred until pattern matures. See `findings/lina-dtcg-figma-wcagvalue-gap.md`. |
| 10 | Theme exposure is a product concern | The design system provides Standard and WCAG themes as options. How products expose theme switching (or whether they do) is a product-level decision, not a design system constraint. Color assignments are internally consistent within each theme. |
