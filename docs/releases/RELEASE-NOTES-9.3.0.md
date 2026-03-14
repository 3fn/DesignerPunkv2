# Release Notes: v9.3.0 — Nav-SegmentedChoice, Easing Tokens, WCAG Themes & Contract Governance

**Date**: 2026-03-13
**Specs**: 049 (Nav-SegmentedChoice-Base), 071 (Application MCP Completeness), 072.5 (Gray Token Migration), 075 (WCAG Theme Infrastructure), 078 (Contract Governance & Enforcement)
**Previous**: v9.2.0

---

## What's New

A new navigation component, easing token infrastructure, WCAG theme-conditional tokens, a color palette pivot from purple to cyan, Component MCP Server completion, and a contract governance system that embeds behavioral contracts into the development workflow.

### Nav-SegmentedChoice-Base (Spec 049)

New component: a navigation control for switching between mutually exclusive content surfaces. Full cross-platform implementation.

- **Web**: Web Component with Shadow DOM, four-phase indicator animation (measure → position → animate → settle), keyboard navigation (arrow keys + Home/End), ARIA tablist/tab roles
- **iOS**: SwiftUI implementation with matched geometry animation
- **Android**: Jetpack Compose implementation with animated indicator
- **Easing tokens**: New `EasingTokens.ts` with cubic bezier and piecewise linear easing definitions. `PrimitiveToken` interface extended with `easingType`, `stops`, and `easingDuration` optional fields. New `EASING` category in `TokenCategory` enum.

### WCAG Theme Infrastructure (Spec 075)

Extended the Rosetta token pipeline to support `wcagValue` — a theme-conditional primitive reference allowing semantic tokens to point to a different primitive in WCAG accessibility mode.

- **DTCG export**: Modes extension for WCAG theme output
- **Figma import**: WCAG mode support for bidirectional sync
- **Platform generation**: All 3 platforms (web, iOS, Android) generate theme-conditional output
- **Guard rails**: Prevents premature DTCG/Figma export of incomplete WCAG data

### Color Palette Migration (Spec 072.5)

Migrated the DesignerPunk color foundation from purple-centric to cyan-centric.

- 5 gray primitives updated to cool blue-gray
- 3 semantic action tokens migrated to cyan/teal
- 2 new semantic tokens: `contrast.onAction`, `action.navigation`
- Data/tech tokens reassigned to purple
- WCAG theme overrides added to info feedback tokens

### Application MCP Completeness (Spec 071)

Component MCP Server expanded to full coverage with 10 query tools. Family guidance documents created for Chips (reference family), Progress, Badges, Icons, and Avatars.

### Contract Governance & Enforcement (Spec 078)

Behavioral contracts embedded as core Stemma workflow:

- **Audit**: All 29 component `contracts.yaml` files scanned — 115 unique concepts validated, 4 non-catalog names resolved, 3 new concepts added, 1 renamed
- **Automated validation**: 3 new test files — contract existence check (29 components), catalog name validation (116 concepts), auto-discovery behavioral validation
- **Process integration**: Lina's scaffolding prompt updated with contracts step, Process-Spec-Planning updated with required artifacts and traceability, Component Development Guide updated with Behavioral Contracts Workflow section
- **Documentation**: Rosetta-Stemma-Systems-Overview, Component-Primitive-vs-Semantic-Philosophy, and Rosetta-System-Architecture updated with contract cross-references

---

## By the Numbers

| Metric | v9.2.0 | v9.3.0 |
|--------|--------|--------|
| Test suites | 291 | 301 |
| Tests | 7,448 | 7,820 |
| Missing tokens | 0 | 0 |
| Components with platforms | 28 | 29 |
| Behavioral contract concepts | 112 | 116 |
| Contract categories | 10 | 10 |
| Component MCP query tools | 6 | 10 |

---

## New Tokens

| Token | Type | Purpose |
|-------|------|---------|
| `EasingTokens.*` | Primitive (easing) | Cubic bezier and piecewise linear easing curves for animation |
| `contrast.onAction` | Semantic (color) | Content color on action backgrounds |
| `action.navigation` | Semantic (color) | Navigation action color |
| `motion.settleTransition` | Semantic (motion) | Already in 9.2.0 but contract text corrected |

---

## Not Breaking

This is a minor release. Nav-SegmentedChoice-Base is a new additive component. Easing token infrastructure extends `PrimitiveToken` with optional fields and adds a new `TokenCategory` enum value — additive in both cases. The contract governance changes are internal process and documentation. The color migration changes semantic token values (visual change) but no API changes. No existing tokens renamed or removed from the consumer perspective. The one concept rename (`rendering_and_animation` → `visual_viewport_clipping`) is internal to the contract catalog with no external consumers.
