# Release Notes — v10.0.0

**Date**: 2026-03-18
**Type**: Major Release (dark mode infrastructure, navigation component)
**Specs**: 080 (Rosetta Mode Architecture), 050 (Nav-TabBar-Base)
**Previous**: v9.4.0 (Token Compliance & Motion Build Fix)

---

## Summary

The Mode Architecture + Navigation release. Spec 080 builds the complete dark mode infrastructure — two-level mode resolution, 4-context resolution matrix, Option B generators, and governance tooling. Spec 050 delivers Nav-TabBar-Base, the first Navigation family component, across all three platforms with three-phase animation choreography, radial glow gradients, and full accessibility.

**Breaking changes**: All four generators (CSS, Swift, Kotlin, DTCG JSON) now produce mode-aware light/dark output. New `blend.pressedLighter` semantic token added. New `visual_gradient_glow` contract concept added to the Concept Catalog.

---

## Rosetta Mode Architecture (Spec 080)

Built the complete dark mode resolution infrastructure for the Rosetta token system.

### Mode Resolution
- **Two-level resolution**: Level 1 (primitive swap via `ModeThemeResolver`) + Level 2 (semantic override via `SemanticOverrideResolver`)
- **4-context resolution matrix**: light-base, light-wcag, dark-base, dark-wcag
- **Full Option B architecture**: Generators receive externally-resolved token sets with no self-fetch capability

### Semantic Override Infrastructure
- `SemanticOverride` and `SemanticOverrideMap` type definitions
- `SemanticOverrideResolver` class — sits between Registry and Generation in the token pipeline
- Swaps `primitiveReferences` for dark mode on overridden tokens, passes light mode through unchanged
- 11 unit tests covering all spec-required scenarios

### Pipeline Integration
- All four output targets (web CSS, iOS Swift, Android Kotlin, DTCG JSON) updated to produce mode-aware light/dark output
- Completed full Option B architecture across the generation pipeline

### Governance Tooling
- **Mode parity audit**: Classifies every semantic color token by resolution level (Level 1 / Level 2 / mode-invariant)
- **Theme template generator**: Produces complete dark theme skeleton from the live token registry
- All 61 semantic color tokens audited: 52 Level 1, 0 Level 2 confirmed, 9 mode-invariant

### Dark Theme File
- Complete skeleton at `src/tokens/themes/dark/SemanticOverrides.ts`
- Empty exported override map, ready for incremental population as component specs complete
- 5 Nav-TabBar-Base dark overrides active (populated during Spec 080 Task 7)

### Pre-Requisite Fixes
- `ModeThemeResolver.validate()` — fixed hex-only regex to support `rgba()` format (all 324 primitives use `rgba()`)
- `SemanticTokenRegistry.resolveColorValue()` — added explicit `.value` check in priority chain, replacing fragile object key insertion order

---

## Nav-TabBar-Base (Spec 050)

Delivered the first Navigation family component — a True Native tab bar across Web, iOS, and Android.

### Token Creation & Governance
- `blend.pressedLighter` semantic token — blend300, lighter direction, 12%. Completes the blend family's pressed-state directional symmetry (`hoverDarker`/`hoverLighter` + `pressedDarker`/`pressedLighter`)
- `visual_gradient_glow` contract template added to Concept Catalog via approved ballot measure — radial gradient background providing state-dependent visual emphasis

### Component Scaffolding
- Directory structure, `contracts.yaml` (20 contracts across 7 categories), `component-meta.yaml`, `schema.yaml`, `types.ts`
- Contracts authored before platform implementation (lesson from Spec 049)

### Web Implementation
- Web Component with Shadow DOM
- Floating pill container: `radiusFull`, backdrop blur, inline margins
- Dynamic browser chrome tracking via Visual Viewport API with `--chrome-offset` CSS custom property
- Three-phase selection animation: depart → glide → arrive (Phase 3 overlaps Phase 2 at ~80%)
- Radial glow gradients on all tabs (accent active, vignette inactive)
- `blend.pressedLighter` pressed feedback on inactive tabs
- Full keyboard navigation: roving tabindex, arrow keys with wrapping, Enter/Space selection
- ARIA: `role="tablist"`/`role="tab"`, `aria-selected`, `accessibilityLabel`
- `prefers-reduced-motion` bypass — all phases collapse to immediate state change
- 31 behavioral contract tests

### iOS Implementation
- SwiftUI View anchored to bottom with OS safe area insets
- Three-phase animation using `UnitCurve` (iOS 17+)
- Haptic feedback on selection (`UIImpactFeedbackGenerator`)
- VoiceOver accessibility with tab semantics and selected state
- External keyboard navigation

### Android Implementation
- Compose Composable with Material 3 `NavigationBar` as base, customized with DesignerPunk tokens
- Three-phase animation using `Animatable` / `animateFloatAsState`
- TalkBack accessibility with `Role.Tab` and `selected` state
- `Settings.Global.ANIMATOR_DURATION_SCALE` check for reduced motion

### Documentation & Dark Mode
- Component README with usage examples per platform, API reference, token dependencies, accessibility notes
- Dark mode token population verified (5 overrides active from Spec 080)
- Demo page: 3/4/5-tab configurations, selection animation, Day/Night toggle, chrome tracking simulation
- Navigation family steering doc updated

---

## Test Suite

| Metric | v9.4.0 | v10.0.0 |
|--------|--------|---------|
| Test suites | 301 | 306 (+5) |
| Tests | 7,820 | 7,963 (+143) |
| Components | 28 | 30 (+2) |
| Contract concepts | 190 | 210 (+20) |
| Steering docs | 54 | 54 |

---

## Breaking Changes

1. **Mode-aware generator output**: All four generators (CSS, Swift, Kotlin, DTCG JSON) now produce light/dark mode output. Consumers of generated output must handle mode-aware token sets.
2. **New semantic token**: `blend.pressedLighter` added to blend family. No existing token changed.
3. **New contract concept**: `visual_gradient_glow` added to Concept Catalog. No existing contract changed.

---

## What Changed from Previous Version

1. ✅ **Added** Two-level Rosetta mode resolution (Level 1 primitive + Level 2 semantic override) (Spec 080)
2. ✅ **Added** 4-context resolution matrix: light-base, light-wcag, dark-base, dark-wcag (Spec 080)
3. ✅ **Added** `SemanticOverrideResolver` with type definitions and 11 tests (Spec 080)
4. ✅ **Added** Mode parity audit and theme template generator governance tools (Spec 080)
5. ✅ **Added** Complete dark theme skeleton at `SemanticOverrides.ts` (Spec 080)
6. ✅ **Added** Nav-TabBar-Base — True Native tab bar across Web/iOS/Android (Spec 050)
7. ✅ **Added** `blend.pressedLighter` semantic token completing blend directional symmetry (Spec 050)
8. ✅ **Added** `visual_gradient_glow` contract template in Concept Catalog (Spec 050)
9. ✅ **Added** Browser chrome tracking via Visual Viewport API (Spec 050)
10. ✅ **Added** Three-phase selection animation choreography with radial glow gradients (Spec 050)
11. ✅ **Added** 20 behavioral contracts for Nav-TabBar-Base across 7 categories (Spec 050)
12. ✅ **Fixed** `ModeThemeResolver.validate()` hex-only regex → supports `rgba()` (Spec 080)
13. ✅ **Fixed** `SemanticTokenRegistry.resolveColorValue()` fragile priority chain (Spec 080)
14. ✅ **Breaking** All four generators produce mode-aware light/dark output (Spec 080)
