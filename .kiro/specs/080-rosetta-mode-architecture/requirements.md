# Requirements Document: Rosetta Mode Architecture

**Date**: March 16, 2026
**Spec**: 080 - Rosetta Mode Architecture
**Status**: Requirements Phase
**Dependencies**: None (this is foundational infrastructure; Spec 050 Nav-TabBar-Base depends on this)

---

## Introduction

The Rosetta token system resolves tokens across two dimensions — platform (build time) and theme (WCAG) — but lacks a third: mode (light/dark). Primitives have `light`/`dark` slots in their data structure, but all values are identical across modes. Semantic tokens have no mechanism to reference different primitives per mode.

This spec activates mode-aware resolution at two levels: primitive values that differ per mode, and semantic overrides for tokens where the primitive name itself changes between modes. Phase 2 unifies mode and theme resolution into a single mechanism, replacing the inline `wcagValue` pattern.

---

## Requirements

### Requirement 1: Mode-Aware Primitive Resolution

**User Story**: As a token consumer, I want color primitives to carry distinct light and dark values, so that mode differentiation happens at the foundation without requiring semantic-layer changes for every token.

#### Acceptance Criteria

1. WHEN a color primitive defines distinct `light` and `dark` values THEN the resolver SHALL return the mode-appropriate value based on the current resolution context.
2. WHEN a color primitive's `dark` slot is absent or identical to its `light` slot THEN the resolver SHALL fall back to the `light` value (graceful degradation).
3. WHEN the resolver processes a semantic token that references a primitive by name THEN it SHALL resolve the primitive's value for the requested mode without requiring a semantic override.
4. WHEN a primitive's `light` and `dark` values differ THEN platform generators SHALL produce mode-aware output (CSS `light-dark()`, iOS dynamic `UIColor`, Android `lightColorScheme`/`darkColorScheme`).

---

### Requirement 2: Dark Theme File with Semantic Overrides

**User Story**: As a token author, I want a complete dark theme file listing every semantic color token, so that I can populate dark mode overrides incrementally as component designs are finalized, with unpopulated tokens falling back to base values.

#### Acceptance Criteria

1. WHEN a dark theme file defines a populated entry for a token THEN the resolver SHALL use the override's `primitiveReferences` instead of the base token's `primitiveReferences` for dark mode resolution.
2. WHEN a token is not present in the exported override map (unpopulated/commented-out in the theme file) THEN the resolver SHALL use the base token's `primitiveReferences` and resolve via Level 1 (primitive mode resolution).
3. WHEN a semantic override replaces a composite `primitiveReferences` (e.g., `{ color, opacity }`) with a simple reference (e.g., `{ value }`) THEN the resolver SHALL accept the structural change — override replaces the entire `primitiveReferences` object, not individual keys.
4. WHEN a semantic override file is processed THEN the resolver SHALL validate that every exported override key exists in the base token registry AND SHALL fail the build if any override key references a nonexistent base token.

---

### Requirement 3: Two-Level Resolver Pipeline Integration

**User Story**: As a build system maintainer, I want mode resolution to be a discrete pipeline step between Registry and Generation, so that generators receive fully resolved token sets per mode without mode-awareness logic in each generator.

#### Acceptance Criteria

1. WHEN the token pipeline executes THEN mode resolution SHALL occur after Registry and before Generation.
2. WHEN mode resolution completes THEN it SHALL produce two fully resolved token sets (light and dark) that generators consume without further mode logic.
3. WHEN the resolver processes a token THEN it SHALL follow this order: (a) check semantic override for current mode, (b) resolve primitive reference for current mode, (c) apply modifiers (opacity composition) to resolved values.
4. WHEN the resolver encounters an invalid primitive reference (nonexistent primitive) THEN it SHALL fail the build with a descriptive error identifying the token and the missing primitive.
5. WHEN the resolver processes tokens THEN it SHALL operate on semantic tokens only — component tokens SHALL resolve through their semantic/primitive references without component-level mode logic.

---

### Requirement 4: Theme Override Governance

**User Story**: As a design system governance lead, I want theme override files to be constrained to modifying existing tokens only, so that theme files cannot become shadow token systems that bypass governance.

#### Acceptance Criteria

1. WHEN a theme override file contains a token key that does not exist in the base token registry THEN the build SHALL fail with an error identifying the orphaned key.
2. WHEN a new semantic color token is added to the base registry THEN the theme file generator SHALL flag it as needing dark mode evaluation in the next CI run.
3. WHEN a base token is removed from the registry THEN the theme file generator SHALL flag any corresponding override as orphaned in the next CI run.
4. WHEN a theme override file is valid (all keys exist in base) THEN the build SHALL proceed without governance errors.

---

### Requirement 5: Fallback Behavior

**User Story**: As a token author, I want absent dark mode values to gracefully fall back to light mode values, so that new tokens work in all modes immediately without requiring explicit dark definitions before they can be used.

#### Acceptance Criteria

1. WHEN a primitive's `dark` slot is absent THEN the resolver SHALL use the `light` slot value for dark mode resolution.
2. WHEN no semantic override exists for a token in dark mode THEN the resolver SHALL use the base semantic token's primitive reference (which then resolves per the primitive's mode values).
3. WHEN fallback occurs at either level THEN the resolver SHALL NOT produce an error or warning at build time — fallback is expected behavior, not an error condition.
4. WHEN the CI pipeline runs on token file changes THEN the mode parity audit SHALL report which semantic color tokens are using fallback values (no distinct dark definition), so that designers can evaluate whether the fallback is intentional.
5. WHEN a semantic color token exists in the base registry but has no entry in a theme file (neither populated nor commented-out) THEN the build SHALL produce a warning identifying the token and the out-of-sync theme file. This is distinct from a commented-out fallback entry, which is intentional.

---

### Requirement 6: Platform Generator Output

**User Story**: As a platform developer, I want generated token files to use platform-native mode switching mechanisms, so that mode transitions are handled by the platform without custom runtime logic.

#### Acceptance Criteria

1. WHEN the web generator produces a mode-aware color token THEN it SHALL output using CSS `light-dark()` function with `color-scheme` property support.
2. WHEN the iOS generator produces a mode-aware color token THEN it SHALL output using dynamic `UIColor` with `traitCollection` variants or Asset Catalog light/dark appearances.
3. WHEN the Android generator produces a mode-aware color token THEN it SHALL output using `lightColorScheme`/`darkColorScheme` color scheme objects.
4. WHEN a color token has identical light and dark resolved values THEN the generator MAY output a single non-mode-aware value (optimization, not required).

---

### Requirement 7: Full Semantic Color Token Audit

**User Story**: As a design system architect, I want a complete audit of all semantic color tokens classifying each as Level 1 (primitive handles mode) or Level 2 (semantic override needed), so that the override surface is known before implementation and the architecture is validated against real data.

#### Acceptance Criteria

1. WHEN the audit is complete THEN it SHALL classify every semantic color token (~56 tokens) as Level 1 (mode-aware primitive) or Level 2 (semantic override required).
2. WHEN a token is classified as Level 2 THEN the audit SHALL document the design intent: same role at a different value, or a different role entirely.
3. WHEN the audit is complete THEN it SHALL report the system-wide Level 1:Level 2 ratio as a metric.
4. WHEN the audit identifies tokens that are currently mode-invariant (same value in both modes) THEN it SHALL classify them as such — not every token needs dark differentiation.

---

### Requirement 8: Theme File Generation

**User Story**: As a token author, I want an auto-generated theme file skeleton that lists every semantic color token, so that I can populate dark mode values incrementally and CI can detect when new tokens need dark mode evaluation.

#### Acceptance Criteria

1. WHEN the theme file generator runs THEN it SHALL produce a complete theme file listing every semantic color token key, with populated entries exported and unpopulated entries commented out with their base primitive reference.
2. WHEN a new token is added to the base registry THEN the next generation SHALL include it as a commented-out entry, and CI SHALL flag it as needing evaluation.
3. WHEN a token is removed from the base registry THEN the next generation SHALL exclude it, and CI SHALL flag any corresponding populated override as orphaned.
4. WHEN the theme file generator runs THEN it SHALL be a standalone tooling step (not part of the token resolution pipeline).
5. WHEN a semantic color token is created THEN the token creation workflow SHALL include adding an entry (populated or commented-out) to all existing theme files, so that theme files stay in sync with the base registry by process rather than only by CI detection.

---

### Requirement 9: DTCG Export with Mode Contexts

**User Story**: As a design tooling integrator, I want DTCG-compliant token exports to include mode context information, so that external tools can consume DesignerPunk tokens with mode awareness.

#### Acceptance Criteria

1. WHEN DTCG export runs THEN it SHALL produce mode-contextualized output aligned with the DTCG Resolver specification's set/modifier pattern.
2. WHEN a token has distinct light and dark resolved values THEN the DTCG export SHALL represent both values with their mode context.
3. WHEN a token has identical light and dark resolved values THEN the DTCG export SHALL represent it as a single mode-invariant value.

---

### Requirement 10: Documentation Updates

**User Story**: As a developer or AI agent consuming DesignerPunk documentation, I want documentation to reflect the mode architecture, so that token usage guidance accounts for mode-aware resolution.

#### Acceptance Criteria

1. The Rosetta System Architecture documentation SHALL include an updated pipeline diagram showing the Mode Resolution step.
2. The Token Quick Reference SHALL include mode-aware lookup guidance.
3. The documentation MCP (`@designerpunk-docs`) SHALL serve mode architecture content.
4. The component MCP SHALL show light/dark resolved values for mode-aware tokens in `getComponent()` responses.

**Documentation waiver**: No component README is required (this is infrastructure, not a component). No usage examples are required (token authors interact with the system through existing token definition patterns, extended with dark values/overrides).

---

### Requirement 11: wcagValue Unification (Phase 2)

**User Story**: As a design system architect, I want the `wcagValue` inline pattern and the mode override pattern unified into a single theme file mechanism, so that there is one conditional resolution system instead of two.

#### Acceptance Criteria

1. WHEN Phase 2 is complete THEN the `SemanticToken` interface SHALL NOT contain `wcagValue` on `primitiveReferences` — all conditional resolution SHALL use theme files.
2. WHEN Phase 2 is complete THEN the full resolution matrix SHALL be expressible as four theme contexts: `light-base`, `light-wcag`, `dark-base`, `dark-wcag`.
3. WHEN Phase 2 migration is complete THEN all resolved token values across the full mode × theme matrix SHALL match pre-migration values exactly (zero behavioral regression).
4. WHEN Phase 2 regression testing runs THEN it SHALL validate resolved values at both the semantic token level AND the component token level (component tokens are the consumer-facing surface).
5. WHEN the WCAG theme's cyan→teal action color swap is migrated to theme files THEN it SHALL serve as a concrete validation case confirming the unified mechanism handles theme overrides correctly.

---

**Organization**: spec-guide
**Scope**: 080-rosetta-mode-architecture
