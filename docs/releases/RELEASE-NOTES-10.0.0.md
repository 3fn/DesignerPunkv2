# Release 10.0.0

**Date**: 2026-03-18  
**Previous**: 9.4.0  
**Bump**: major

## 🔴 Breaking / Consumer-Facing

- **Web Implementation — Nav-TabBar-Base** *(Component)*
  Implemented the Nav-TabBar-Base web platform as a Web Component with Shadow DOM. Floating pill container with dynamic browser chrome tracking, three-phase selection animation choreography, radial glow gradients on all tabs, full keyboard navigation, and ARIA accessibility. 31 behavioral contract tests.
- **Component Scaffolding — Nav-TabBar-Base** *(Token)*
  Scaffolded the Nav-TabBar-Base component directory with all structural artifacts required before platform implementation begins.
- **Token Creation & Governance** *(Token)*
  Created `blend.pressedLighter` semantic token (blend300, lighter, 12%) completing the blend family's pressed-state directional symmetry. Added `visual_gradient_glow` contract template to the Concept Catalog via approved ballot measure.
- **Mode Parity Audit + Theme Template Tooling** *(Token)*
  Built two governance tools for the dark theme system: a mode parity audit that classifies every semantic color token by resolution level (Level 1 / Level 2 / mode-invariant), and a theme file generator that produces the complete dark theme skeleton from the live token registry.
- **Pipeline Integration + Generator Updates** *(Token)*
  Integrated the two-level Rosetta mode resolver into the token generation pipeline and updated all four output targets (web CSS, iOS Swift, Android Kotlin, DTCG JSON) to produce mode-aware light/dark output. Completed full Option B architecture where generators receive externally-resolved token sets with no self-fetch capability.
- **Full Semantic Color Token Audit** *(Token)*
  Audited all 61 semantic color tokens and created the complete dark theme file. Every token classified as Level 1 (52), Level 2 (0 confirmed), or mode-invariant (9). The dark theme file at `src/tokens/themes/dark/SemanticOverrides.ts` lists all tokens as a complete skeleton with an empty exported override map, ready for incremental population as component specs complete their semantic token assignments.
- **Semantic Override Infrastructure** *(Token)*
  Built the Level 2 semantic override infrastructure: type definitions (`SemanticOverride`, `SemanticOverrideMap`), the `SemanticOverrideResolver` class, and 11 unit tests covering all spec-required scenarios. The resolver sits between Registry and Generation in the token pipeline, swapping `primitiveReferences` for dark mode on overridden tokens while passing light mode through unchanged.
- **Pre-Requisite Fixes** *(Token)*
  Fixed two pre-existing bugs in the token resolution infrastructure that would have blocked mode-aware resolution. `ModeThemeResolver.validate()` used a hex-only regex but all 324 primitives use `rgba()` format. `SemanticTokenRegistry.resolveColorValue()` lacked an explicit `.value` check in its priority chain, relying on fragile object key insertion order.
