# Container-Card-Base Composition Refactor

**Date**: 2026-03-26
**Purpose**: Refactor Container-Card-Base to actually compose Container-Base internally, matching its schema declaration and establishing the composition pattern for future type-primitives
**Organization**: spec-guide
**Scope**: 085-container-card-base-composition
**Status**: Draft — Pending review

---

## Problem Statement

Container-Card-Base declares `Container-Base` in `composition.internal` and all platform files describe the relationship as "composes ContainerBase internally" in comments. However, no platform implementation actually calls Container-Base. The component re-implements Container-Base's layout behavior using the same tokens directly.

This was caught by the composition compliance test (`composition-compliance-validation.test.ts`) — 3 failing checks (iOS, Android, web), currently tracked as known mismatches.

The fix is not just about honesty in the schema. Container-Card-Base is the first type-primitive that composes a primitive in the Containers family. The pattern established here becomes the template for Container-Panel, Container-Hero, and future semantic variants.

---

## Goals

1. **Actual composition**: Container-Card-Base renders through Container-Base on all three platforms, delegating layout (padding, background, shadow, border, borderRadius) to the composed component
2. **Preserved external behavior**: Zero visual or behavioral changes from the consumer's perspective — the demos are the baseline
3. **Clean interaction boundary**: Card's interactive behavior (hover, press, focus, keyboard) wraps Container-Base without interfering with its rendering
4. **Precedent-setting pattern**: The composition approach established here is reusable for future type-primitives (Container-Panel, Container-Hero, etc.)
5. **Compliance test passes**: The 3 known-mismatch skips in `composition-compliance-validation.test.ts` are removed

---

## Existing Behavior (Baseline from Demos)

The container demos (`demos/container-base-demo.html`, `demos/container-card-demo.html`) document the current rendering behavior that must be preserved:

**Container-Base provides:**
- Uniform and directional padding (7 values: none, 050, 100, 150, 200, 300, 400)
- Any semantic color token as background
- 5 shadow levels (container, navigation, dropdown, modal, toast)
- 4 border widths (none, default, emphasis, heavy) with custom border color
- 4 border radii (none, tight, normal, loose)
- Semantic HTML elements (9 options)
- Hoverable state (8% darker on hover)
- Accessibility label

**Container-Card-Base curates and extends:**
- Curated padding (4 values: none, 100, 150, 200) with vertical including 050
- 3 surface backgrounds only (primary, secondary, tertiary)
- 2 shadow options (none, container)
- 2 border widths (none, default) with 2 border colors (default, subtle)
- 2 border radii (normal, loose) — no sharp corners for cards
- 3 semantic elements (div, section, article)
- Interactive behavior: hover (8% darker), press (12% darker), focus ring, keyboard activation, onPress callback, ARIA role (button/link)

---

## Platform-Specific Composition Approach

### Web: Nested Custom Element (W1)

Card's Shadow DOM contains `<container-base>` as a child element. Card forwards curated prop values (not resolved token names) as attributes. Interaction layer wraps the element on Card's root.

- CSS custom properties pierce shadow boundaries — token resolution flows naturally
- Events use `composed: true` — bubbling works across shadow boundaries
- Card renders its interaction wrapper; Base renders the semantic element
- Semantic element placement in the accessibility tree needs verification during implementation

W2 (import Base's internals) rejected — not true composition, couples to internal API.
W3 (light DOM) rejected — breaks encapsulation.

### iOS: Direct View Composition (I1)

Card's body contains `ContainerBase(...)` as a child view, passing curated prop values. Interaction modifiers (`.onTapGesture`, `.onHover`) go on the outer wrapper, not on the ContainerBase child.

### Android: Direct Composable Composition (A1)

Card's composable calls `ContainerBase(...)` internally, passing curated prop values. Interaction modifiers (`clickable`, `hoverable`) go on the outer wrapper, not on the ContainerBase child.

### Interaction Layer Boundary (All Platforms)

Card sets `hoverable: false` on Base (or omits the prop) and handles all interaction states itself:
- Hover: 8% darker (blend.hoverDarker) — applied by Card's wrapper
- Press: 12% darker (blend.pressedDarker) — applied by Card's wrapper
- Focus ring — applied by Card's wrapper
- Keyboard activation — handled by Card

Base handles layout only: padding, background, shadow, border, borderRadius, semantic element.

This prevents double-darkening on hover (Ada R1 catch) and gives Card full control over coordinated interaction states.

### Prop Pass-Through Rule

Two-track forwarding (Ada R1 correction):
- **Direct pass-through** (shared vocabulary): padding (all variants), border, borderRadius, semantic, accessibilityLabel — Card passes its prop values directly to Base
- **Resolve then pass** (shorthand → full token name): background, shadow, borderColor — Card uses its `tokens.ts` getter functions to resolve shorthand values to Base's expected format (e.g., `'surface.primary'` → `'color.surface.primary'`)

---

## Testing Strategy

**Existing tests**: Container-Card-Base has tests validating external behavior (rendering, props, interaction states, accessibility). These must continue to pass after the refactor.

**Risk**: Tests that assert on internal DOM structure (shadow DOM children, element hierarchy) may break if the rendering structure changes. These need deliberate decisions: update the test to match the new structure, or adjust the implementation to preserve the structure.

**New tests needed**: Verify that Container-Base is actually instantiated/called within Card's rendering (the composition compliance test covers this at the file level, but a runtime test confirming the composed component renders would be stronger).

**Demo validation**: Both container demos should render identically before and after the refactor. Visual comparison is the ultimate acceptance test.

---

## Scope

### In Scope
- Refactoring 3 platform implementations to compose through Container-Base
- Preserving all external behavior (props, rendering, interaction, accessibility)
- Resolving the composition compliance test known mismatches
- Establishing the reusable pattern for future type-primitives
- Correcting `Container-Card-Base.schema.yaml` interactive prop description (currently says "sets hoverable: true on Container-Base" — should say `hoverable: false`)

### Out of Scope
- Changing Container-Card-Base's external API (props, events, behavior)
- Other components' composition patterns
- Demo page updates (behavior should be identical, no demo changes needed)
- Cleanup of Card's `tokens.ts` unused getter functions — padding, border, and borderRadius getters become unused post-refactor; background, shadow, and borderColor getters remain in active use for shorthand resolution (follow-up task)

### Scope Expansion (Approved)
- **Container-Base native token mapping extension** — Base's iOS and Android `resolveColorToken()` functions don't handle the full set of token names Card needs to pass (surface variants, border.subtle, shadow variants). Extending these mappings is required for native composition to work. Approved by Peter (2026-03-26). Ada verifies resolved values.

---

## Agent Coordination

| Area | Agent | Role |
|------|-------|------|
| Platform implementations | Lina | Refactor all 3 platform files |
| Composition pattern decision | Lina + Peter | Web approach (W1/W2/W3), iOS/Android approach |
| Test impact assessment | Thurgood | Audit existing tests for structural assertions |
| Test updates | Lina | Update tests that break due to structural changes |
| Compliance test cleanup | Thurgood | Remove known-mismatch skips after refactor |
| Cross-platform consistency review | Leonardo | Review implementations for pattern consistency across platforms |
| Token compliance | Ada (if needed) | Verify token resolution through composed component |

---

## Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| Visual regression | High | Demo comparison before/after; existing tests as safety net |
| Nested shadow root complexity (web) | Medium | Evaluate W1/W2/W3 options in design phase |
| Interaction layer interference | Medium | Test hover/press/focus states explicitly |
| Test breakage from structural changes | Medium | Audit tests before refactoring; deliberate update decisions |
| Pattern doesn't generalize | Low | Keep the pattern simple; review with future type-primitives in mind |

---

## Success Criteria

1. Container-Card-Base renders through Container-Base on all 3 platforms
2. All existing Card tests pass (or are deliberately updated with documented rationale)
3. Both container demos render identically before and after
4. Composition compliance test passes with zero known-mismatch skips
5. The composition pattern is reusable for future type-primitives (pattern documentation is a follow-up task, not in scope for this spec)

---

## Next Steps

1. Ada and Lina review this design outline
2. Resolve platform composition approach (especially web W1/W2/W3)
3. Formalize into requirements, design, tasks (sequentially, per feedback protocol)
