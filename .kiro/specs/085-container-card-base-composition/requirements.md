# Requirements Document: Container-Card-Base Composition Refactor

**Date**: 2026-03-26
**Spec**: 085 - Container-Card-Base Composition Refactor
**Status**: Requirements Phase
**Dependencies**: None

---

## Introduction

Container-Card-Base declares `Container-Base` in `composition.internal` but doesn't actually compose it. This spec refactors all three platform implementations to render through Container-Base, establishing the composition pattern for future type-primitives.

---

## Requirements

### Requirement 1: Composition on All Platforms

**User Story**: As a design system maintainer, I want Container-Card-Base to actually compose Container-Base internally, so that the implementation matches the schema declaration and changes to Base automatically propagate to Card.

#### Acceptance Criteria

1. WHEN Container-Card-Base renders on web THEN it SHALL instantiate a `<container-base>` custom element within its Shadow DOM
2. WHEN Container-Card-Base renders on iOS THEN it SHALL instantiate a `ContainerBase` view within its body
3. WHEN Container-Card-Base renders on Android THEN it SHALL call `ContainerBase()` composable within its composition
4. WHEN Container-Card-Base passes props to Container-Base THEN it SHALL pass values that Base's prop types accept. For props with shared vocabulary (padding, border, borderRadius, semantic, accessibilityLabel), Card passes its prop values directly. For props where Card uses shorthand values (background, shadow, borderColor), Card SHALL resolve to Base's expected token name format before passing.
5. The composition compliance test (`composition-compliance-validation.test.ts`) SHALL pass for Container-Card-Base on all 3 platforms with zero known-mismatch skips
6. WHEN Container-Card-Base renders on each platform THEN a runtime test SHALL verify that Container-Base is actually instantiated within Card's rendering (not just present in source code)

### Requirement 2: Preserved External Behavior

**User Story**: As a consumer of Container-Card-Base, I want the refactor to produce zero visual or behavioral changes, so that my existing usage continues to work identically.

#### Acceptance Criteria

1. WHEN Container-Card-Base is rendered with any valid prop combination THEN the visual output SHALL be identical to the pre-refactor rendering
2. WHEN Container-Card-Base is rendered with default props (zero-config) THEN it SHALL display padding 150, surface.primary background, container shadow, and normal radius
3. WHEN Container-Card-Base uses directional padding props THEN the three-level override hierarchy (uniform → axis → individual edge) SHALL produce identical results to pre-refactor
4. WHEN the container demos (`container-base-demo.html`, `container-card-demo.html`) are loaded THEN all sections SHALL render identically to pre-refactor

### Requirement 3: Interaction Layer Boundary

**User Story**: As a design system architect, I want a clean separation between Card's interaction behavior and Base's layout rendering, so that the composition boundary is maintainable and the pattern generalizes to future type-primitives.

#### Acceptance Criteria

1. Container-Card-Base SHALL set `hoverable: false` on the composed Container-Base (or omit the prop) on all platforms
2. WHEN `interactive="true"` THEN Card's wrapper layer SHALL handle hover (8% darker via blend.hoverDarker), press (12% darker via blend.pressedDarker), focus ring, and keyboard activation independently of Base
3. WHEN `interactive="false"` (default) THEN no hover, press, or focus behavior SHALL be present — Base receives no interaction props
4. Container-Base SHALL handle layout only: padding, background, shadow, border, borderRadius, semantic element rendering
5. WHEN Container-Card-Base composes Container-Base on web THEN the accessibility tree structure SHALL preserve the same semantic element nesting as pre-refactor — interactive cards must not introduce invalid ARIA nesting (e.g., `role="button"` wrapping `<section>`)

### Requirement 4: Prop Curation Preserved

**User Story**: As a consumer, I want Container-Card-Base to continue enforcing its curated prop constraints, so that I get card-appropriate defaults and guardrails.

#### Acceptance Criteria

1. Container-Card-Base SHALL continue to accept only its curated prop types (CardPaddingValue, CardBackgroundValue, CardShadowValue, CardBorderValue, CardBorderRadiusValue, CardSemanticElement)
2. Container-Card-Base SHALL NOT expose Container-Base's full prop set to consumers
3. WHEN a consumer passes a Card prop value THEN Card SHALL map it to the corresponding Base prop value and forward it

### Requirement 5: Test Continuity

**User Story**: As a test governance specialist, I want existing Card tests to continue passing or be deliberately updated with documented rationale, so that the refactor doesn't silently break test coverage.

#### Acceptance Criteria

1. All existing Container-Card-Base tests SHALL pass after the refactor, OR failing tests SHALL be updated with documented rationale for the change
2. WHEN a test fails due to internal structural changes (e.g., shadow DOM hierarchy assertions) THEN the test update rationale SHALL be documented in the completion doc
3. The full test suite (`npm test`) SHALL pass with zero failures after the refactor
4. WHEN the refactor is complete THEN a post-refactor sanity check via Application MCP `getComponent("Container-Card-Base")` SHALL verify `resolvedTokens.composed` is unchanged

### Documentation Requirements Waiver

This spec does not introduce new tokens or components. It refactors internal architecture without changing external behavior. Documentation requirements per Process-Spec-Planning are not applicable — the component's README, schema, and contracts remain unchanged.
