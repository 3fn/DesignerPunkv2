# Requirements Document: Nav-SegmentedChoice-Base

**Date**: 2026-03-12
**Spec**: 049 - Nav-SegmentedChoice-Base
**Status**: Requirements Phase
**Dependencies**:
- Spec 076 (Primary Action Color Migration) — `color.action.navigation` token + `wcagValue` infrastructure
  - Status: Design outline created
  - Required for: Tasks involving label/icon color rendering and WCAG theme output
  - Integration point: `color.action.navigation` semantic token (cyan500 Standard / teal500 WCAG)
- Easing infrastructure extension — piecewise linear easing token type (`easingGlideDecelerate`)
  - Status: Scoped (see `findings/ada-easing-infrastructure-for-thurgood.md`)
  - Required for: Indicator glide animation
  - Integration point: `easingGlideDecelerate` primitive token consumed by all 3 platform builders

---

## Introduction

Nav-SegmentedChoice-Base is a navigation control that allows users to switch between mutually exclusive content surfaces within a single view. It presents connected segments — text or icon — with a sliding indicator that animates between selections.

This is the first component in the Navigation family and establishes the primitive base for future semantic variants (Badge, Scrollable). It follows DesignerPunk's True Native architecture: unified API, platform-native implementations (Web Component, SwiftUI View, Compose Composable).

**Key architectural constraints:**
- Text OR icon per segment (never both) — enforced via TypeScript union type
- No disabled state — unavailable options should not be rendered
- Navigation semantics (`tablist`/`tab` ARIA model), not form input
- Equal-width segments, full-width container
- Two sizes: Standard and Condensed

---

## Requirements

### Requirement 1: Segment Selection

**User Story**: As a developer, I want a segmented control that manages mutual exclusivity, so that users can switch between content surfaces with a single tap or click.

#### Acceptance Criteria

1. WHEN a user activates an unselected segment THEN the component SHALL update the selected segment and invoke the `onSelectionChange` callback with the new segment's value
2. WHEN the component renders THEN exactly one segment SHALL be visually and programmatically indicated as selected
3. WHEN a user activates the already-selected segment THEN the component SHALL NOT invoke `onSelectionChange` (no-op)
4. WHEN `selectedValue` does not match any segment value THEN the component SHALL select the first segment as fallback
5. WHEN fewer than 2 segments are provided THEN the component SHALL throw a runtime error with a descriptive message (e.g., `Nav-SegmentedChoice-Base requires at least 2 segments. Received: ${segments.length}.`) — decided during design outline review, not TBD

### Requirement 2: Segment Content Types

**User Story**: As a developer, I want to create segments with either text labels or icons, so that I can use the control for both labeled navigation and icon-based view switching.

#### Acceptance Criteria

1. WHEN a segment is defined with a `label` property THEN the component SHALL render a text label
2. WHEN a segment is defined with an `icon` property THEN the component SHALL render an icon and require an `accessibilityLabel` property
3. The component SHALL enforce text OR icon per segment via union type — a segment SHALL NOT accept both `label` and `icon`
4. WHEN an icon segment is missing `accessibilityLabel` THEN the TypeScript compiler SHALL produce a type error (compile-time enforcement)

### Requirement 3: Indicator Animation Choreography

**User Story**: As a developer, I want the selection indicator to animate with a choreographed sequence, so that the transition feels polished and communicates spatial relationships.

#### Acceptance Criteria

1. WHEN selection changes THEN the indicator SHALL animate through a four-phase sequence: shadow out → resize + glide (simultaneous) → shadow in
2. WHEN the shadow-out phase executes THEN the indicator shadow SHALL fade to 0 using `duration150` + `easingAccelerate`
3. WHEN the resize phase executes THEN the indicator width SHALL transition using `duration150` + `easingStandard`
4. WHEN the glide phase executes THEN the indicator position SHALL slide using `duration350` + `easingGlideDecelerate` (piecewise linear curve with aggressive deceleration and long settling tail)
5. WHEN the shadow-in phase executes THEN the indicator shadow SHALL fade back in using `duration150` + `easingDecelerate`
6. WHEN `prefers-reduced-motion: reduce` is active THEN the indicator SHALL move instantly without animation (all phases collapse to immediate state change)
7. WHEN the component first renders THEN the indicator SHALL appear at the selected segment's position without animation

### Requirement 4: Keyboard Navigation

**User Story**: As a keyboard user, I want to navigate between segments using arrow keys, so that I can operate the control without a mouse.

#### Acceptance Criteria

1. WHEN the control has focus AND the user presses Left/Up arrow THEN focus SHALL move to the previous segment (wrapping from first to last)
2. WHEN the control has focus AND the user presses Right/Down arrow THEN focus SHALL move to the next segment (wrapping from last to first)
3. WHEN a segment has focus AND the user presses Enter or Space THEN that segment SHALL become selected
4. WHEN the control receives focus via Tab THEN the currently selected segment SHALL receive focus
5. WHEN the user presses Tab while focused inside the control THEN focus SHALL move to the next focusable element outside the control (not the next segment)

### Requirement 5: Accessibility

**User Story**: As a screen reader user, I want the segmented control to announce its role, segment labels, and selection state, so that I can understand and operate it.

#### Acceptance Criteria

1. The container SHALL have `role="tablist"` (web) or equivalent semantic role (iOS/Android)
2. Each segment SHALL have `role="tab"` with `aria-selected` reflecting its selection state
3. WHEN selection changes THEN the screen reader SHALL announce the newly selected segment
4. Icon segments SHALL be announced by their `accessibilityLabel`
5. The component SHALL meet WCAG 2.1 AA compliance for all interaction states

### Requirement 6: Panel Association

**User Story**: As a developer, I want the component to optionally generate `aria-controls` attributes for panel wiring, so that I can easily associate segments with content panels.

#### Acceptance Criteria

1. WHEN the `id` prop is provided THEN each segment SHALL generate an `aria-controls` attribute with the pattern `[id]-panel-[value]`
2. WHEN the `id` prop is omitted THEN the component SHALL NOT render `aria-controls` attributes (developer handles panel wiring)
3. The `id` prop SHALL be optional and independent of `testID`

### Requirement 7: Size Variants

**User Story**: As a developer, I want Standard and Condensed size options, so that I can use the control in both primary and compact layouts.

#### Acceptance Criteria

1. WHEN `size` is `'standard'` (default) THEN the component SHALL use Standard sizing tokens: `space.inset.150` block / `space.inset.200` inline padding, `fontSize125`, `lineHeight125`
2. WHEN `size` is `'condensed'` THEN the component SHALL use Condensed sizing tokens: `space.inset.100` block / `space.inset.150` inline padding, `fontSize100`, `lineHeight100`
3. WHEN `size` is omitted THEN the component SHALL default to `'standard'`

### Requirement 8: Hover State

**User Story**: As a web user, I want visual feedback when hovering over segments, so that I can identify interactive elements.

#### Acceptance Criteria

1. WHEN the user hovers over an inactive segment THEN the segment SHALL display a `blend.containerHoverDarker` (4% darker) background
2. WHEN the user hovers over the active segment THEN the component SHALL NOT show hover feedback (active segment hover is a no-op)
3. Hover behavior SHALL apply to web platform only (touch platforms do not have persistent hover)

### Requirement 9: Visual Specification Compliance

**User Story**: As a designer, I want the component to match the approved visual specifications, so that the implementation is faithful to the design.

#### Acceptance Criteria

1. The container SHALL use `color.structure.surface` background, `radius.normal` border-radius, `space.inset.050` padding, `border.default` border, and `space.grouped.none` item spacing
2. The active segment SHALL use `color.structure.canvas` background with `radius.small` border-radius
3. The inactive segment SHALL have transparent background with `radius.small` border-radius
4. Text and icon color SHALL use `color.action.navigation` for both active and inactive states
5. Labels SHALL use `fontWeight700` and the Display typeface
6. The indicator shadow SHALL use `shadow.navigation.indicator` (0 offset, 4px blur, 20% black)
7. All segments SHALL be equal width, dividing the container equally regardless of content length
8. Each segment SHALL enforce `min-width: tapAreaMinimum` so touch targets never compress below accessible size — when segment count exceeds what the viewport can accommodate, the container overflows rather than violating touch target minimums
9. The component SHALL be full-width within its parent container (no component-level max-width)

### Requirement 10: Cross-Platform Implementation

**User Story**: As a developer, I want Nav-SegmentedChoice-Base to work on web, iOS, and Android with platform-appropriate implementations, so that the component follows DesignerPunk's True Native architecture.

#### Acceptance Criteria

1. The web implementation SHALL be a Web Component with Shadow DOM
2. The iOS implementation SHALL be a SwiftUI View (minimum iOS 17.0)
3. The Android implementation SHALL be a Jetpack Compose Composable
4. All three platforms SHALL expose the same public API (props interface)
5. The sliding indicator animation SHALL use platform-native animation APIs (CSS transitions/`linear()` for web, SwiftUI animation/`UnitCurve` for iOS, Compose `keyframes`/`Animatable` for Android)
6. The Android indicator shadow SHALL use `Modifier.shadow()` (not `Surface(elevation = ...)` or `mapShadowToElevation()`) with mandatory `.clip(shape)` after `.shadow()`

### Requirement 11: Documentation

**User Story**: As a developer, I want comprehensive documentation for Nav-SegmentedChoice-Base, so that I can integrate it correctly.

#### Acceptance Criteria

1. The component SHALL provide a README that includes: overview, usage examples for web/iOS/Android, API reference (props table), token dependencies, accessibility notes (WCAG 2.1 AA compliance), and platform-specific behavior notes
2. The component SHALL have a component-meta.yaml with purpose, usage guidelines, contexts, and alternatives
3. The Navigation family steering doc SHALL be updated from placeholder to reflect the implemented component

---

## Scope Boundaries

**In scope:**
- Nav-SegmentedChoice-Base primitive component (web, iOS, Android)
- Four-phase indicator animation choreography with reduced-motion support
- Keyboard navigation (arrow keys, Enter/Space, Tab)
- Screen reader accessibility (tablist/tab roles, aria-controls panel association)
- Text OR icon segment types with union type enforcement
- Standard and Condensed size variants
- Hover state (inactive segments only, web)
- Schema, behavioral contracts, tests, component-meta, README

**Out of scope:**
- Disabled state (component-level or segment-level) — design decision: don't render unavailable options
- Semantic variants (Badge, Scrollable) — future specs
- Navigation family guidance YAML — authored after component ships (per Application MCP checklist)
- Content panel management — the component controls selection, not what's displayed
- Easing infrastructure extension — separate task (may be a prerequisite spec or Task 1 of this spec)
