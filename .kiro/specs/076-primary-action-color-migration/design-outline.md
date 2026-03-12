# Primary Action Color Migration & Color Foundation Harmonization

**Date**: 2026-03-10
**Last Updated**: 2026-03-12
**Purpose**: Migrate primary action color from purple300 to cyan300/teal300, harmonize gray primitives with cyan brand identity, extend semantic token architecture for theme-conditional primitive references, and refactor hardcoded color values in tests
**Organization**: spec-guide
**Scope**: 076-primary-action-color-migration
**Status**: Design outline — expanded scope, pending Ada review on gray blast radius

---

## Problem Statement

The current primary action color (`color.action.primary` → `purple300`) is being replaced with cyan to align with DesignerPunk's evolving visual identity. This migration exposes several architectural growing pains:

1. **Color value change**: `color.action.primary` moves from `purple300` to `cyan300`
2. **Architecture gap**: The WCAG theme needs to resolve to `teal300` (not a darkened cyan), but the semantic token layer has no mechanism to reference different primitives per theme
3. **Gray foundation misalignment**: Current gray primitives carry a purple undertone that clashes with cyan as the brand color — needs harmonization to cool blue-gray
4. **Contrast inversion**: cyan300 (Standard) requires dark text on primary backgrounds; teal300 (WCAG) requires white text — `color.contrast.onPrimary` must become theme-conditional
5. **Test brittleness**: Component tests hardcode specific RGBA values (purple hex, gray RGBA) instead of testing token consumption — every primitive change breaks tests unnecessarily

These are not separate problems. They're interconnected consequences of evolving the color foundation, and addressing them together prevents multiple migration passes.

---

## Architecture Change: Theme-Conditional Primitive References

### Current State

Semantic color tokens reference one primitive:

```ts
'color.action.primary': {
  primitiveReferences: { value: 'purple300' }
}
```

The primitive carries both theme values:

```ts
purple300: {
  platforms: {
    web: {
      value: {
        light: { base: 'rgba(168, 85, 247, 1)', wcag: 'rgba(168, 85, 247, 1)' }
      }
    }
  }
}
```

This works when the WCAG value is a shade adjustment within the same hue. It breaks when WCAG requires a different hue family entirely (cyan → teal).

### Proposed Change (Option 4)

Extend `primitiveReferences` with an optional `wcagValue` field:

```ts
'color.action.primary': {
  primitiveReferences: { 
    value: 'cyan300',       // Standard theme
    wcagValue: 'teal300'    // WCAG theme (optional, falls back to value)
  }
}
```

When `wcagValue` is absent, behavior is unchanged — backward compatible. When present, generators resolve to the wcag primitive for WCAG theme output.

### Why This Approach

- **Primitives stay honest** — cyan500 is always cyan, teal500 is always teal. No identity confusion.
- **Backward compatible** — existing tokens without `wcagValue` work exactly as before. Zero migration cost for 60+ existing semantic color tokens.
- **Decision lives where it belongs** — the semantic layer expresses "this intent maps to different colors per theme." That's a semantic decision, not a primitive fact.
- **Scales naturally** — any semantic token needing a WCAG-specific primitive just adds `wcagValue`.
- **Generator impact is contained** — each platform generator already handles base/wcag output. One code path change per generator to resolve which primitive to read from per theme context.

### Alternatives Considered

| Option | Approach | Rejected Because |
|--------|----------|-----------------|
| 1 | Change cyan500's wcag value to teal | Primitive name becomes a lie; all cyan500 consumers get teal in WCAG |
| 2 | Full theme-aware semantic references | Same outcome as Option 4 but more complex interface |
| 3 | Alias layer between primitives and semantics | New architectural concept for the same practical outcome |

---

## Color Migration

### Affected Semantic Tokens

| Token | Current Primitive | New Standard | New WCAG |
|-------|------------------|-------------|----------|
| `color.action.primary` | `purple300` | `cyan300` | `teal300` |
| `color.background.primary.subtle` | `purple100` | `cyan100` | `teal100` |

Only one semantic token directly references `purple300`. The blast radius is contained at the semantic level.

### Component Consumption (Blast Radius)

Components consuming `--color-action-primary` via CSS custom properties:

| Component | Usage |
|-----------|-------|
| Button-CTA | Background (filled), text + border (outlined/ghost), blend calculations (hover/pressed/disabled) |
| Button-Icon | Primary color variable, blend calculations |
| Chip-Base | Selected border color |
| Input-Text-Base | Focus border, float label color |
| Input-Text-Email | Focus border, float label color |
| Input-Text-Password | Focus border, float label color |
| Input-Text-PhoneNumber | Focus border, float label color |
| Container-Base | Focus outline |

Because these components consume the semantic CSS custom property (not the primitive), the migration is transparent — change the token definition, regenerate, and all components update automatically.

### Blend Calculation Impact

Button-CTA and Button-Icon compute hover/pressed/disabled states by blending `color.action.primary`:
- Hover: 8% darker blend
- Pressed: 12% darker blend
- Disabled: 12% desaturated

These blends operate on the resolved color value at runtime. Changing from purple to cyan changes the blend outputs. Visual verification needed to confirm the blended cyan states look correct.

### Test Impact

- Button-CTA and Button-Icon test utilities hardcode `#A855F7` (purple) as the mock `--color-action-primary` value
- These must be updated to the new cyan value
- All blend calculation test expectations will change

---

## Contrast Analysis

### cyan300 (Standard theme) — `rgba(0, 240, 255)`

| Context | Contrast | Result |
|---------|----------|--------|
| White text on cyan300 background (filled button) | 1.41:1 | ❌ Fails — needs dark text |
| Black text on cyan300 background | 14.91:1 | ✅ AAA |

**Note**: cyan300 as a button background requires dark text (`color.contrast.onLight`), not white text. This is a behavioral change from purple300 (which used white text). Button-CTA's text color logic may need updating.

### teal300 (WCAG theme) — `rgba(26, 83, 92)`

| Context | Contrast | Result |
|---------|----------|--------|
| White text on teal300 background (filled button) | 8.62:1 | ✅ AAA |
| teal300 text on white100 | 8.62:1 | ✅ AAA |
| teal300 text on white200 | 7.93:1 | ✅ AAA |

**Note**: teal300 in WCAG mode supports white text on dark background — opposite contrast behavior from Standard theme cyan300. This is a significant UX consideration: the button's text color flips between themes.

### Navigation Color: cyan500 / teal500

For Spec 049 (Segmented Choice), navigation labels use a darker shade:

| Theme | Primitive | On white100 | On white200 |
|-------|-----------|-------------|-------------|
| Standard | `cyan500` rgba(0,136,143) | 4.27:1 | 3.93:1 |
| WCAG | `teal500` rgba(15,46,51) | 14.39:1 ✅ AAA | 13.25:1 ✅ AAA |

**Accepted trade-off (Standard theme)**: cyan500 at 3.93:1 on white200 is sub-AA for normal text (WCAG 1.4.3 requires 4.5:1) and does not qualify as "large text" under the strict WCAG definition (18px regular or 14px bold). Navigation labels use fontWeight700 at ≥16px (fontSize100 condensed), which provides acceptable readability but is not formally AA-compliant at the condensed size on white200 surfaces. This is a conscious design decision — the WCAG theme (teal500, 13.25:1+) fully resolves contrast for users who need it. Standard theme prioritizes the cyan visual identity with bold weight as mitigation.

---

## New Semantic Token: `color.action.navigation`

The segmented controller (Spec 049) uses `cyan500`/`teal500` for navigation labels — a darker shade than `color.action.primary` to avoid competing with page-level CTAs.

| Token | Standard | WCAG | Purpose |
|-------|----------|------|---------|
| `color.action.primary` | `cyan300` | `teal300` | Primary actions (CTAs, buttons, focus states) |
| `color.action.navigation` | `cyan500` | `teal500` | Navigation selection (segmented choice, potentially bottom tabs) |

The action color system becomes: same hue family per theme (cyan for Standard, teal for WCAG), with shade tiers for hierarchy (lighter = more prominent, darker = more grounded).

---

## Gray Primitive Harmonization

### Rationale

Current gray primitives carry a purple undertone (e.g., gray100: `184, 182, 200` — blue channel 18 higher than red). With cyan as the new brand color, grays need to shift to a cool blue-gray that harmonizes with the cyan/teal family.

### Proposed Values

| Token | Current | Proposed | Luminosity Δ |
|-------|---------|----------|-------------|
| `gray100` | `rgba(184, 182, 200, 1)` | `rgba(178, 188, 196, 1)` | L 73 → 74 ≈ |
| `gray200` | `rgba(104, 101, 138, 1)` | `rgba(94, 112, 124, 1)` | L 42 → 43 ≈ |
| `gray300` | `rgba(45, 43, 62, 1)` | `rgba(38, 50, 58, 1)` | L 24 → 23 ≈ |
| `gray400` | `rgba(31, 29, 46, 1)` | `rgba(24, 34, 40, 1)` | L 15 → 15 = |
| `gray500` | `rgba(21, 19, 31, 1)` | `rgba(16, 22, 26, 1)` | L 10 → 10 = |

**Key property**: Luminosity is preserved (±1) across the entire scale. This means all existing contrast ratios against gray primitives remain valid. The change is hue only — no accessibility impact.

### Blast Radius

**Ada to analyze**: Which semantic tokens consume gray primitives, and what is the downstream component impact? Gray is used for text, borders, backgrounds, disabled states — potentially the largest blast radius in this spec.

Because components consume semantic tokens (not primitives directly), the migration should be transparent at the component level — change the primitive values, regenerate, done. But test assertions that hardcode gray RGBA values will break.

---

## Theme-Conditional Contrast: `color.contrast.onAction`

### The Problem

Components rendering text/icons on `color.action.primary` backgrounds need a contrast token that flips between themes:

- **Standard theme** (cyan300 background): Needs dark text — cyan300 on white is 1.41:1, fails. Black on cyan300 is 14.91:1.
- **WCAG theme** (teal300 background): Needs white text — white on teal300 is 8.62:1, AAA.

**Naming**: `color.contrast.onPrimary` cannot be used — it was migrated away in Spec 052 and replaced by `color.contrast.onDark`. A test at `src/tokens/semantic/__tests__/ColorTokens.test.ts` (line 1234) explicitly asserts `color.contrast.onPrimary` is `undefined`.

### Proposed Solution

Create `color.contrast.onAction` (new token, no conflict) with `wcagValue`:

```ts
'color.contrast.onAction': {
  primitiveReferences: {
    value: 'black500',      // Dark text for Standard (on light cyan300)
    wcagValue: 'white100'   // White text for WCAG (on dark teal300)
  }
}
```

Semantically accurate: "content on action-colored backgrounds." Uses the `wcagValue` infrastructure being built. Button-CTA and Button-Icon consume `color.contrast.onAction` for their text/icon color on primary backgrounds.

### Component Impact

Button-Icon's stemma test (line 311) currently references `var(--color-contrast-on-dark)` (from Spec 052 migration). This changes to `var(--color-contrast-on-action)`.

**Known affected**: Button-CTA (filled variant text color), Button-Icon (primary variant icon color).

---

## Secondary Action Color Migration

### Decision

`color.action.secondary` moves from `black400` to `gray400`.

### Rationale

With primary moving to cyan, secondary should be a neutral gray to create clear visual hierarchy without competing hues. `gray400` (proposed: `rgba(24, 34, 40, 1)`) provides sufficient contrast and reads as a subdued, grounded alternative to the vibrant cyan primary.

### Impact

Same pattern as primary migration — update the semantic token's `primitiveReferences.value`, regenerate. Components consuming `color.action.secondary` update automatically.

---

## Purple Token Disposition

`purple300` loses its primary action role. Decision: **repurposed** (not deprecated). Purple primitives remain in the system for future use (decorative, data visualization, accent). No action needed in this spec — just documenting the decision.

---

## Test Refactoring: Token Consumption over Hardcoded Values

### The Problem

Component tests (Button-CTA, Button-Icon, and likely others) hardcode specific RGBA values as mock CSS custom property values:

```ts
// Current pattern (brittle)
element.style.setProperty('--color-action-primary', '#A855F7');
expect(background).toBe('#A855F7');
```

Every primitive value change (purple→cyan, gray harmonization) breaks these tests even though component behavior is unchanged. The tests are verifying resolved color values, not the behavioral contract of "this component uses `color.action.primary`."

### Proposed Approach

Refactor tests to verify token consumption rather than resolved values:

```ts
// Preferred pattern (resilient)
// Test that the component applies the correct CSS custom property
expect(computedStyle.getPropertyValue('background-color'))
  .toBe('var(--color-action-primary)');
```

Or where resolved values must be tested (e.g., blend calculations), use a test utility that reads the current token value rather than hardcoding it:

```ts
// Acceptable pattern for blend tests
const primaryColor = getTokenValue('color.action.primary');
const expectedHover = blend(primaryColor, 0.08, 'darker');
expect(hoverBackground).toBe(expectedHover);
```

### Scope

This refactoring applies to all tests that hardcode color RGBA/hex values that come from tokens. It's not limited to `color.action.primary` — gray values in tests should also be refactored during this pass. One migration, one refactoring pass.

**Ada to identify**: Which test files hardcode gray and purple RGBA values.

---

## Open Questions

### Q1: Button-CTA Text Color Flip — RESOLVED

`color.contrast.onAction` (new token) with `wcagValue`: `black500` (Standard) / `white100` (WCAG). No conflict with Spec 052's removal of `color.contrast.onPrimary`. Button-CTA and Button-Icon consume `color.contrast.onAction` for text/icon on primary backgrounds. Button-Icon's stemma test reference to `var(--color-contrast-on-dark)` updates to `var(--color-contrast-on-action)`.

### Q2: `color.action.secondary` — RESOLVED

Transitions to `gray400`. See "Secondary Action Color Migration" section above.

### Q3: Purple Tokens — RESOLVED

Repurposed, not deprecated. No action in this spec.

### Q4: Spec 049 Dependency — RESOLVED

076 executes before 049. `color.action.navigation` is created as part of this spec.

### Q5: Gray Primitive Blast Radius — RESOLVED (Ada, 2026-03-12)

14 semantic tokens consume gray primitives:

| Semantic Token | Gray Primitive | Usage |
|---|---|---|
| `color.feedback.select.text.default` | `gray200` | Unselected text in selection components |
| `color.feedback.select.background.default` | `gray100` | Unselected background in selection |
| `color.feedback.select.border.default` | `gray200` | Unselected border in selection |
| `color.text.default` | `gray300` | Primary body text |
| `color.text.muted` | `gray200` | Secondary text |
| `color.text.subtle` | `gray100` | Tertiary text |
| `color.structure.border` | `gray100` | Standard borders/dividers |
| `color.structure.border.subtle` | `gray100` + `opacity048` | Semi-transparent borders |
| `color.icon.default` | `gray200` | Default icon color |
| `color.progress.pending.text` | `gray300` | Pending step text in progress |

**Impact assessment**: Because luminosity is preserved (±1) across the entire gray scale, all existing contrast ratios hold. The migration is transparent at the component level — change primitive values, regenerate, done. No semantic token changes needed. Every component that renders text, borders, or icons is affected visually (hue shift from purple-gray to blue-gray), but no component code changes are needed.

**No hardcoded gray RGBA values found in component tests** — gray is consumed via CSS custom properties throughout.

### Q6: Test File Inventory — RESOLVED (Ada, 2026-03-12)

9 test files hardcode `#A855F7` (purple300 hex), totaling 68 matches:

| File | Matches | Nature |
|---|---|---|
| `src/blend/__tests__/BlendCalculator.test.ts` | 26 | Blend math tests |
| `src/blend/__tests__/ThemeAwareBlendUtilities.test.ts` | 15 | Theme blend tests |
| `src/__tests__/integration/BlendCrossPlatformConsistency.test.ts` | 12 | Cross-platform blend |
| `src/blend/__tests__/ColorSpaceUtils.test.ts` | 5 | Color space conversion |
| `src/components/core/Icon-Base/__tests__/IconBase.test.ts` | 4 | Icon color passthrough |
| `src/composition/__tests__/BlendCompositionParser.test.ts` | 3 | Blend composition parsing |
| `src/components/core/Button-CTA/__tests__/ButtonCTA.test.ts` | 1 | Mock CSS property |
| `src/components/core/Button-CTA/platforms/web/__tests__/ButtonCTA.icon-integration.test.ts` | 1 | Mock CSS property |
| `src/blend/__tests__/ThemeSwitching.test.ts` | 1 | Theme color definition |

**Ada's recommendation on scope**:
- **Component tests** (Button-CTA, Button-CTA icon-integration, Icon-Base): Refactor to test token consumption, not resolved values. These are the 2 files that mock `--color-action-primary` with a hardcoded hex — they'll break on migration.
- **Blend math tests** (BlendCalculator, ThemeAwareBlendUtilities, CrossPlatformConsistency, ColorSpaceUtils, BlendCompositionParser, ThemeSwitching): Leave as-is. These test pure math functions — the input color is arbitrary. Changing to cyan would mean recalculating 53 expected output values for no behavioral benefit. The tests are already correctly decoupled from the token system.
- **Total refactoring scope**: 6 matches across 2 component test files (not 68 across 9).

---

## Scope Summary

1. **Extend `primitiveReferences` interface** with optional `wcagValue` field
2. **Update all three generators** (web, iOS, Android) to resolve `wcagValue` for WCAG theme output
3. **Migrate `color.action.primary`** from `purple300` to `cyan300` (standard) / `teal300` (wcag)
4. **Create `color.contrast.onAction`** — theme-conditional: `black500` (standard) / `white100` (wcag) — new token for text/icons on action-colored backgrounds
5. **Migrate `color.action.secondary`** from `black400` to `gray400`
6. **Create `color.action.navigation`** — `cyan500` (standard) / `teal500` (wcag)
7. **Harmonize gray primitives** — 5 tokens, purple undertone → cool blue-gray (luminosity preserved)
8. **Refactor hardcoded color tests** — component tests only (2 files, 6 matches); blend math tests left as-is (pure math, input color is arbitrary)
9. **Update test utilities** with new color values (where resolved values are still needed)
10. **Visual verification** of blend calculations on cyan
11. **Steering doc updates** — Token-Family-Color, Token-Quick-Reference, etc.

---

## Review History

- **2026-03-12 (Ada)**: Resolved Q5 (gray blast radius: 14 semantic tokens, luminosity preserved, no code changes), Q6 (test inventory: 6 matches in 2 files, not 68), Q1 correction (`color.contrast.onPrimary` → `color.contrast.onAction` due to Spec 052 conflict), identified `color.background.primary.subtle` migration, scoped blend test exclusion.
