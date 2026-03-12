# Requirements Document: Primary Action Color Migration & Color Foundation Harmonization

**Date**: 2026-03-12
**Spec**: 076 - Primary Action Color Migration
**Status**: Requirements Phase
**Dependencies**: None (this spec is a prerequisite for Spec 049)

---

## Ada/Lina Review Feedback — Resolved

| # | Feedback | Resolution |
|---|----------|------------|
| A1 | Cyan semantic collision (`color.data`/`color.tech` = cyan = action) | Req 9: reassign to purple300/purple400 |
| A2 | Teal/info WCAG overlap (info + action both teal in WCAG) | Req 10: info feedback gains `wcagValue` → purple in WCAG |
| A3 | DTCG/Figma silent data loss on `wcagValue` export | Req 11: guard rails (throw on export), full support deferred |
| A4 | Navigation contrast "bold ≥16px" overstated | Corrected in design doc to "Sub-AA" with rationale |
| A5 | `wcagValue` scope: overrides `value` key only | Documented in design doc architecture section |
| L1 | Test blast radius underscoped (3 test-utils files missed) | Req 7.3 added, Task 3.3 expanded |
| L2 | Req 2.3 overstated "no component code changes" | Scoped to exclude Req 3 changes |
| L3 | Button-CTA contrast flip is visible behavioral change | Task 3.1 updated with visual impact note |
| L4 | `color.contrast.onDark` remains unchanged | Noted in scope boundaries |
| L5 | DTCG/Figma gap needs Ada input | Resolved: Option A (guard rails now), per Ada item A3 |

---

## Introduction

Spec 076 migrates DesignerPunk's primary action color from purple to cyan/teal, harmonizes gray primitives with the new brand identity, and extends the semantic token architecture to support theme-conditional primitive references. It also addresses test brittleness exposed by the migration.

This is a foundational color system change that touches primitives, semantic tokens, platform generators, component consumption, and test infrastructure. The scope is interconnected — addressing all items together prevents multiple migration passes.

---

## Requirements

### Requirement 1: Theme-Conditional Primitive References (`wcagValue`)

**User Story**: As a token system maintainer, I want semantic tokens to reference different primitives per theme, so that hue-shifting tokens (cyan Standard / teal WCAG) can be expressed without corrupting primitive identity.

#### Acceptance Criteria

1. The `primitiveReferences` interface SHALL support an optional `wcagValue` field alongside the existing `value` field
2. WHEN `wcagValue` is absent THEN generators SHALL resolve the WCAG theme using the existing `value` primitive (backward compatible)
3. WHEN `wcagValue` is present THEN generators SHALL resolve the WCAG theme using the `wcagValue` primitive
4. The web generator SHALL output the correct primitive for each theme context (base vs WCAG)
5. The iOS generator SHALL output the correct primitive for each theme context
6. The Android generator SHALL output the correct primitive for each theme context
7. All existing semantic color tokens (60+) SHALL continue generating correctly without modification

### Requirement 2: Primary Action Color Migration

**User Story**: As a designer, I want the primary action color to be cyan (Standard) / teal (WCAG), so that the design system reflects the evolved brand identity.

#### Acceptance Criteria

1. `color.action.primary` SHALL reference `cyan300` (Standard) and `teal300` (WCAG) via `wcagValue`
2. `color.background.primary.subtle` SHALL reference `cyan100` (Standard) and `teal100` (WCAG) via `wcagValue`
3. All components consuming `color.action.primary` via CSS custom properties SHALL render with the new color without component code changes, except for contrast token consumption changes specified in Requirement 3
4. Blend calculations (hover 8% darker, pressed 12% darker, disabled 12% desaturated) SHALL produce visually acceptable results on cyan — verified via visual inspection

### Requirement 3: Contrast Token for Action Backgrounds

**User Story**: As a component developer, I want a contrast token that provides the correct text color on action-colored backgrounds per theme, so that Button-CTA and Button-Icon render readable text in both Standard and WCAG themes.

#### Acceptance Criteria

1. `color.contrast.onAction` SHALL be created with `black500` (Standard) and `white100` (WCAG) via `wcagValue`
2. Button-CTA filled variant SHALL consume `color.contrast.onAction` for its text color
3. Button-Icon primary variant SHALL consume `color.contrast.onAction` for its icon color
4. The token name SHALL NOT conflict with Spec 052's removal of `color.contrast.onPrimary`

### Requirement 4: Navigation Action Color

**User Story**: As a component developer, I want a navigation-specific action color darker than the primary, so that navigation controls (Spec 049) don't compete with page-level CTAs for visual prominence.

#### Acceptance Criteria

1. `color.action.navigation` SHALL be created with `cyan500` (Standard) and `teal500` (WCAG) via `wcagValue`
2. The token SHALL be available for consumption by Spec 049 (Nav-SegmentedChoice-Base) after this spec completes

### Requirement 5: Secondary Action Color Migration

**User Story**: As a designer, I want the secondary action color to be a neutral gray, so that it creates clear visual hierarchy without competing hues against the cyan primary.

#### Acceptance Criteria

1. `color.action.secondary` SHALL reference `gray400` instead of `black400`
2. All components consuming `color.action.secondary` SHALL render with the new color without component code changes

### Requirement 6: Gray Primitive Harmonization

**User Story**: As a designer, I want the gray primitives to shift from purple undertone to cool blue-gray, so that the neutral palette harmonizes with cyan as the brand color.

#### Acceptance Criteria

1. Gray primitives SHALL be updated to the proposed values: gray100 `rgba(178, 188, 196, 1)`, gray200 `rgba(94, 112, 124, 1)`, gray300 `rgba(38, 50, 58, 1)`, gray400 `rgba(24, 34, 40, 1)`, gray500 `rgba(16, 22, 26, 1)`
2. Luminosity SHALL be preserved within ±1 across the entire gray scale (no contrast ratio changes)
3. All 14 semantic tokens consuming gray primitives SHALL regenerate correctly without semantic token changes
4. No component code changes SHALL be required — migration is transparent at the component level

### Requirement 7: Test Refactoring

**User Story**: As a test maintainer, I want component tests to verify token consumption rather than hardcoded RGBA values, so that future primitive value changes don't break tests unnecessarily.

#### Acceptance Criteria

1. Button-CTA test (`ButtonCTA.test.ts`) SHALL be refactored to test token consumption (CSS custom property application) rather than hardcoded `#A855F7`
2. Button-CTA icon-integration test (`ButtonCTA.icon-integration.test.ts`) SHALL be refactored to test token consumption rather than hardcoded `#A855F7`
3. Button-CTA test-utils, Button-Icon test-utils, and Input-Text-Base test-utils SHALL be updated to remove hardcoded `#A855F7` references — replacing with either the new token value or a token-consumption assertion pattern
4. Blend math tests (BlendCalculator, ThemeAwareBlendUtilities, CrossPlatformConsistency, ColorSpaceUtils, BlendCompositionParser, ThemeSwitching) SHALL NOT be modified — they test pure math with arbitrary input colors
5. Blend math test files SHALL receive a clarifying comment noting that input colors are arbitrary and not token references

### Requirement 8: Documentation

**User Story**: As a token system consumer, I want updated documentation reflecting the new color foundation, so that I can reference correct token names and values.

#### Acceptance Criteria

1. Token-Family-Color steering doc SHALL be updated with the new action color hierarchy (primary, navigation, secondary) and the `wcagValue` mechanism
2. Token-Quick-Reference SHALL reflect updated primitive and semantic token values
3. Ballot measures SHALL be used for all steering doc changes

### Requirement 9: Data/Tech Semantic Color Reassignment

**User Story**: As a token system consumer, I want data and tech semantic colors to be visually distinct from the primary action color, so that informational/analytical elements are not confused with interactive action elements.

#### Acceptance Criteria

1. `color.data` SHALL reference `purple300` instead of `cyan300`
2. `color.tech` SHALL reference `purple400` instead of `cyan400`
3. No component code changes SHALL be required — neither token has current component consumers
4. Purple's semantic role SHALL be documented as "informational/analytical content" (data, tech, and info in WCAG mode)

### Requirement 10: Info Feedback WCAG Theme Migration

**User Story**: As a designer, I want info feedback colors to use purple in WCAG mode, so that teal is reserved exclusively for action semantics and there is clear hue separation between "things you act on" and "things that inform you."

#### Acceptance Criteria

1. `color.feedback.info.text` SHALL retain `teal400` (Standard) and add `wcagValue: 'purple500'` (WCAG)
2. `color.feedback.info.background` SHALL retain `teal100` (Standard) and add `wcagValue: 'purple100'` (WCAG)
3. `color.feedback.info.border` SHALL retain `teal400` (Standard) and add `wcagValue: 'purple500'` (WCAG)
4. WCAG mode info contrast SHALL meet AAA: purple500 on purple100 ≥ 7:1 (verified: 8.32:1)
5. Theme exposure (how products surface Standard vs WCAG) is a product-level concern, not a design system constraint

### Requirement 11: DTCG/Figma Export Guard Rails

**User Story**: As a token pipeline maintainer, I want export pipelines to fail loudly when encountering `wcagValue` tokens they can't represent, so that WCAG-specific primitive references are not silently lost during export.

#### Acceptance Criteria

1. The DTCG generator SHALL throw a descriptive error when exporting a token that has a `wcagValue` field
2. The Figma transformer SHALL throw a descriptive error when exporting a token that has a `wcagValue` field
3. Error messages SHALL identify the token name and recommend the follow-up spec for full `wcagValue` export support
4. Full DTCG/Figma `wcagValue` support is explicitly OUT OF SCOPE — tracked as a follow-up

---

## Scope Boundaries

**In scope:**
- `wcagValue` infrastructure on `primitiveReferences`
- Generator updates (web, iOS, Android) for theme-conditional resolution
- `color.action.primary` migration (purple300 → cyan300/teal300)
- `color.background.primary.subtle` migration (purple100 → cyan100/teal100)
- `color.contrast.onAction` creation (black500/white100)
- `color.action.navigation` creation (cyan500/teal500)
- `color.action.secondary` migration (black400 → gray400)
- `color.data` migration (cyan300 → purple300)
- `color.tech` migration (cyan400 → purple400)
- `color.feedback.info.*` WCAG migration (teal → purple via `wcagValue`)
- Gray primitive harmonization (5 tokens, hue shift, luminosity preserved)
- DTCG/Figma export guard rails (throw on `wcagValue` tokens)
- Component test refactoring (3 test-utils files + 2 test files with hardcoded hex)
- Visual verification of blend calculations on cyan
- Steering doc updates

**Out of scope:**
- Blend math test refactoring (correctly decoupled, arbitrary input colors)
- Purple primitive deprecation (purple is reassigned to data/tech/info, not deprecated)
- `color.contrast.onDark` modification — this token is NOT changed or removed; Button-CTA/Button-Icon stop consuming it for primary variant, but other components (Input-Text fields, Avatar-Base) still reference it
- New component development (Spec 049 depends on this but is separate)
- Full DTCG/Figma `wcagValue` export support (tracked follow-up — format design decisions need more pattern maturity)
