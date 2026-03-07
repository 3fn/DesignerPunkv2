# Requirements Document: Pagination Animation

**Date**: 2026-03-07
**Spec**: 074 - Pagination Animation
**Status**: Requirements Phase
**Dependencies**: Spec 072 (Pagination Container Styling) — ✅ Complete

---

## Introduction

Progress-Pagination-Base has correct positional logic (sliding window algorithm) but no animation — the window shifts instantly via full DOM rebuild. This spec adds animated state transitions (size/color) and scroll animation (dots sliding), plus prerequisite fixes that unblock visual validation: Node-Base rendering bugs, token pipeline build integration, and an iOS motion token type fix.

---

## Requirements

### Requirement 1: Node State Animation

**User Story**: As a user navigating through paginated content, I want the current dot to smoothly animate its size and color change, so that I can visually track which page I'm on.

#### Acceptance Criteria

1. WHEN a node transitions from `incomplete` to `current` THEN the node SHALL animate its size increase and color change using `motion.selectionTransition` timing (250ms, easingStandard).
2. WHEN a node transitions from `current` to `incomplete` THEN the node SHALL animate its size decrease and color change using `motion.selectionTransition` timing.
3. The animation SHALL apply on all three platforms (web, iOS, Android).
4. WHEN `prefers-reduced-motion: reduce` is active (web) or the platform equivalent (iOS: `UIAccessibility.isReduceMotionEnabled`, Android: `Settings.Global.ANIMATOR_DURATION_SCALE == 0`) THEN state transitions SHALL be instant (no animation).

### Requirement 2: Scroll Animation

**User Story**: As a user navigating through paginated content with more than 5 items, I want the dots to smoothly slide when the visible window shifts, so that I understand the spatial relationship between pages.

#### Acceptance Criteria

1. WHEN the visible window shifts (e.g., navigating from page 5 to page 6) THEN all visible nodes SHALL animate to their new positions using `motion.selectionTransition` timing (250ms, easingStandard).
2. WHEN the visible window shifts THEN all nodes SHALL animate their new states simultaneously.
3. The animation SHALL apply on all three platforms.
4. WHEN `prefers-reduced-motion: reduce` is active THEN window shifts SHALL be instant.

### Requirement 3: Web DOM Strategy Refactor

**User Story**: As a component maintainer, I want the web implementation to use incremental DOM updates instead of full `innerHTML` replacement, so that CSS transitions can fire on persistent elements.

#### Acceptance Criteria

1. The web component SHALL create the `<style>` element and container `<div>` once in `connectedCallback`, not on every render.
2. The web component SHALL maintain a stable set of `<progress-indicator-node-base>` child elements and update their attributes on render, rather than destroying and recreating them.
3. WHEN `totalItems` changes such that the visible count changes (e.g., from 5 to 3) THEN the component SHALL add or remove child elements as needed.
4. The DOM refactor SHALL produce identical behavioral output to the current implementation — the existing behavioral test suite SHALL pass with zero failures before any animation code is added.

### Requirement 4: Contract Update

**User Story**: As a design system contributor, I want the `performance_virtualization` contract to accurately describe the animated behavior, so that the contract remains the authoritative source of truth.

#### Acceptance Criteria

1. The `performance_virtualization` contract in `contracts.yaml` SHALL be updated to state: "Window shifts with animated transition. When the visible window changes, nodes animate to their new states (size and color) using `motion.selectionTransition` timing. Animation is disabled when `prefers-reduced-motion: reduce` is active."
2. The contract SHALL remove the statement "Window shifts immediately (no animation)."

### Requirement 5: Accessibility

**User Story**: As a user with motion sensitivity, I want animations to be disabled when I've indicated a preference for reduced motion, so that the pagination doesn't cause discomfort.

#### Acceptance Criteria

1. WHEN `prefers-reduced-motion: reduce` is active on web THEN all pagination animations SHALL be disabled or reduced to instant transitions.
2. WHEN `UIAccessibility.isReduceMotionEnabled` is true on iOS THEN all pagination animations SHALL be disabled.
3. WHEN `Settings.Global.ANIMATOR_DURATION_SCALE` is 0 on Android THEN all pagination animations SHALL be disabled.
4. ARIA live region announcements SHALL NOT be delayed by animation — screen reader position updates SHALL fire immediately regardless of animation state.
5. Animation SHALL NOT cause content to flash or flicker (WCAG 2.3.1).

### Requirement 6: Node-Base Rendering Fixes (Prerequisite)

**User Story**: As a developer validating pagination animation, I need all 5 dots to render correctly with proper state emphasis, so that animation behavior can be visually verified.

#### Acceptance Criteria

1. WHEN `totalItems >= 5` THEN exactly 5 `<progress-indicator-node-base>` elements SHALL render in the browser demo.
2. The node at `currentItem` SHALL display the +4px size emphasis and distinct current-state color.
3. Node-Base SHALL NOT pass invalid `size` attribute values to `<icon-base>` (resolves Known Issue 4).

### Requirement 7: Token Pipeline Fix (Prerequisite)

**User Story**: As a developer working with the browser demo, I want generated platform tokens to be fresh after every build, so that styling changes appear without manual file copying.

#### Acceptance Criteria

1. `npm run build` SHALL regenerate platform tokens (`DesignTokens.web.css`, `DesignTokens.ios.swift`, `DesignTokens.android.kt`) automatically.
2. The browser build script SHALL read generated tokens from `dist/` as the primary source, not `output/`.
3. iOS motion token shorthand constants SHALL use a proper `Motion` type wrapper, not `Typography`.

---

## Documentation Requirements

This spec modifies behavioral contracts and the web component's internal render strategy.

**Component work documentation required**:
- Contract update in `contracts.yaml` (Requirement 4)
- README update if animation behavior warrants documentation

**Waiver**: No new component README (component exists). No API documentation changes (API unchanged). Accessibility behavior (reduced motion) should be noted in README if not already present.
