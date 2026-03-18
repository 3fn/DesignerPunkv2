# Requirements Document: Nav-TabBar-Base

**Date**: March 18, 2026
**Spec**: 050 - Nav-TabBar-Base
**Status**: Requirements Phase
**Dependencies**:
- Spec 080 (Rosetta Mode Architecture) — Two-level mode resolution for dark theme overrides
  - Status: Complete
  - Required for: All mode-differentiated color tokens
  - Integration point: `SemanticOverrideResolver` + `SemanticValueResolver`, 5 active Level 2 overrides
- Spec 049 (Nav-SegmentedChoice-Base) — Sibling navigation component, motion token precedent
  - Status: Complete
  - Required for: Motion token reuse (`duration150`, `duration350`, `easingGlideDecelerate`), API pattern reference
  - Integration point: `types.ts` attribute-based API pattern, proven animation choreography tokens

---

## Introduction

Nav-TabBar-Base is a primary navigation component providing persistent access to top-level app destinations. It appears at the bottom of the screen and allows users to switch between major sections with a single tap.

This is the base primitive for the tab bar family within the Navigation family (family 11). It establishes the foundation for future semantic variants (Nav-TabBar-Floating, Nav-TabBar-Labeled, Nav-TabBar-Minimal).

**Key architectural constraints:**
- Icon-only for v1 — labels deferred to future variant (Nav-TabBar-Labeled)
- 3–5 tab items recommended
- No disabled state — unavailable destinations should not be rendered
- Build-time platform separation: web (floating pill) vs native (full-width anchored)
- Mode (Day/Night) resolved at theme level via Spec 080 infrastructure, not component props
- Badge composition deferred from v1 — tab item structure includes slot placeholder for future Badge family integration

---

## Requirements

### Requirement 1: Tab Selection

**User Story**: As a user, I want to tap a tab to navigate to a top-level destination, so that I can switch between major app sections with a single action.

#### Acceptance Criteria

1. WHEN a user activates an unselected tab THEN the component SHALL update the selected tab and invoke the selection change callback with the new tab's value.
2. WHEN the component renders THEN exactly one tab SHALL be visually and programmatically indicated as selected.
3. WHEN a user activates the already-selected tab THEN the component SHALL NOT invoke the selection change callback (no-op).
4. WHEN `selectedValue` does not match any tab value THEN the component SHALL select the first tab as fallback.
5. WHEN fewer than 2 tabs are provided THEN the component SHALL throw a runtime error with a descriptive message.

---

### Requirement 2: Tab Item Visual States

**User Story**: As a user, I want clear visual differentiation between active, inactive, and pressed tabs, so that I always know which section I'm viewing and get feedback on my interactions.

#### Acceptance Criteria

1. WHEN a tab is selected THEN it SHALL display a solid-fill icon using `color.action.navigation` and a `space050` × `space050` indicator dot below the icon using the same color.
2. WHEN a tab is unselected THEN it SHALL display an outline-stroke icon using `color.icon.navigation.inactive` with no indicator dot.
3. WHEN an unselected tab is pressed THEN it SHALL apply `blend.pressedLighter` to the icon as a press hint. The blend SHALL revert on drag-away (cancellation).
4. WHEN a pressed unselected tab is released (confirmed selection) THEN the full selection animation SHALL begin (Requirement 3).
5. WHEN the selected tab is pressed THEN the component SHALL NOT show a pressed visual state (active tab press is a no-op per Requirement 1 AC3).

---

### Requirement 3: Selection Animation Choreography

**User Story**: As a user, I want an animated transition between tabs, so that the spatial relationship between destinations is communicated through motion.

#### Acceptance Criteria

1. WHEN selection changes THEN the component SHALL animate through a three-phase sequence: departing tab dims → dot glides to new tab → arriving tab brightens.
2. WHEN the departing phase executes THEN the glow gradient SHALL dim on the departing tab and the departing icon SHALL begin settling to inactive position.
3. WHEN the glide phase executes THEN the indicator dot SHALL glide from the departing tab center to the arriving tab center. The icon outline↔solid swap SHALL snap (not crossfade) when the arriving glow animates in.
4. WHEN the arriving phase executes THEN the arriving icon SHALL lift to active position and the glow gradient SHALL brighten on the arriving tab. The icon lift SHALL overlap slightly with the end of the dot glide (~80% through) for a more fluid feel.
5. WHEN `prefers-reduced-motion: reduce` (web), `isReduceMotionEnabled` (iOS), or `ANIMATOR_DURATION_SCALE = 0` (Android) is active THEN all animation phases SHALL collapse to immediate state change — no animation executes.
6. WHEN the component first renders THEN the selected tab SHALL appear in its active state without animation.
7. WHEN animation phases execute THEN timing and easing SHALL use Rosetta motion tokens — hard-coded timing values are not permitted.

---

### Requirement 4: Glow Gradient

**User Story**: As a user, I want a radial glow effect on tab items, so that the active tab is visually prominent and inactive tabs have contrast protection against scrolling content.

#### Acceptance Criteria

1. WHEN a tab is rendered THEN it SHALL display an elliptical radial gradient background centered on the icon center, with radii of 88% of the tab item width (horizontal) and 88% of the tab item height (vertical).
2. WHEN the gradient is rendered THEN it SHALL use three stops: center accent color at 100% opacity (stop 0%), `color.structure.canvas` at `opacity024` (stop 88%), and `color.structure.canvas` at `opacity000` (stop 100%).
3. WHEN a tab is selected THEN the gradient center color SHALL be `color.background.primary.subtle`.
4. WHEN a tab is unselected THEN the gradient center color SHALL be `color.structure.canvas` (same as container background), creating a subtle same-color vignette.
5. WHEN the glow animates during selection change (Requirement 3) THEN the glow opacity SHALL be independently animatable — the gradient center color intensity dims on the departing tab and brightens on the arriving tab.
6. WHEN the glow gradient extends beyond the tab item bounds THEN it SHALL bleed into adjacent tabs — no clipping or overflow masking.

---

### Requirement 5: Container and Layout

**User Story**: As a developer, I want the tab bar to adapt its visual treatment per platform while maintaining consistent navigation behavior, so that it feels native on each platform.

#### Acceptance Criteria

1. WHEN rendered on iOS or Android THEN the container SHALL be full-width, anchored to the bottom of the screen, with safe area insets handled by the OS.
2. WHEN rendered on web (mobile) THEN the container SHALL be a floating pill shape (`radiusFull`) with backdrop blur, inline margins (`space200`), and dynamic chrome tracking via the Visual Viewport API.
3. WHEN rendered on web (desktop) THEN the container SHALL be a floating pill anchored to the bottom with no chrome tracking.
4. WHEN the web container tracks browser chrome THEN it SHALL compute the chrome offset as `window.innerHeight - visualViewport.height`, apply it via CSS custom property `--chrome-offset`, and smooth the tracking with `transition: bottom 100ms ease-out`.
5. WHEN `window.visualViewport` is unavailable THEN `--chrome-offset` SHALL default to `0px` and the bar SHALL fall back to static positioning above `env(safe-area-inset-bottom)`.
6. WHEN the container is rendered THEN it SHALL use `color.structure.canvas` as the background color and `color.structure.border.subtle` as the top stroke.
7. WHEN the web container is rendered THEN it SHALL apply padding: `space.inset.050` top, `space.inset.100` right, `space.inset.150` bottom, `space.inset.100` left. Tab items SHALL distribute evenly within the padded bounds with no inter-tab spacing.
8. WHEN a tab item is rendered THEN its structure SHALL include a composition slot for future Badge family integration. The slot SHALL be empty in v1 — no badge tokens or badge rendering required.

---

### Requirement 6: Tab Item Layout

**User Story**: As a developer, I want tab items to use token-based spacing that accommodates the indicator dot in active state, so that the layout is consistent and the icon lift animation is achievable through spacing changes.

#### Acceptance Criteria

1. WHEN a tab is selected THEN it SHALL use padding: `space.inset.150` top, `space.inset.150` inline, `space.inset.050` bottom, with `space.grouped.minimal` item spacing (between icon and dot).
2. WHEN a tab is unselected THEN it SHALL use padding: `space.inset.200` top, `space.inset.150` inline, `space.inset.100` bottom, with no item spacing.
3. WHEN the padding shifts between active and inactive states THEN the delta between top padding values (`space.inset.200` → `space.inset.150`) SHALL produce the visual icon lift. The implementation mechanism (padding, transform, flex) is unconstrained — any approach achieving the same visual result is acceptable.

---

### Requirement 7: Keyboard Navigation (Web)

**User Story**: As a keyboard user, I want to navigate between tabs using standard keyboard patterns, so that I can operate the tab bar without a pointing device.

#### Acceptance Criteria

1. WHEN the tab bar receives focus via Tab key THEN focus SHALL land on the currently selected tab (roving tabindex — selected tab gets `tabindex="0"`, others get `tabindex="-1"`).
2. WHEN the tab bar has focus AND the user presses Left or Right arrow THEN focus SHALL move to the adjacent tab, wrapping from last to first and first to last.
3. WHEN a tab has focus AND the user presses Enter or Space THEN that tab SHALL become selected.
4. WHEN the user presses Tab from within the tab bar THEN focus SHALL exit to the next focusable element outside the component (not cycle through tabs).
5. WHEN a tab has keyboard focus THEN it SHALL display a focus ring using `:focus-visible` with accessibility focus tokens (`accessibility.focus.width`, `accessibility.focus.offset`, `accessibility.focus.color`).

---

### Requirement 8: Screen Reader Accessibility

**User Story**: As a screen reader user, I want the tab bar to announce its structure and state, so that I can understand the navigation and know which section is selected.

#### Acceptance Criteria

1. WHEN the tab bar is rendered THEN the container SHALL be announced as a tab list (`role="tablist"` on web, equivalent semantics on iOS/Android).
2. WHEN a tab is rendered THEN it SHALL be announced with its accessible label and selected state (`role="tab"`, `aria-selected` on web, equivalent on iOS/Android).
3. WHEN a tab is icon-only (v1) THEN it SHALL require an `accessibilityLabel` property — the screen reader SHALL announce the accessibility label, not the icon name.
4. WHEN selection changes THEN the newly selected tab's state SHALL be communicated to assistive technology.

---

### Requirement 9: Touch Targets

**User Story**: As a mobile user, I want each tab to have an adequate touch target, so that I can reliably tap the intended tab.

#### Acceptance Criteria

1. WHEN a tab is rendered THEN its tappable area min-width SHALL be `tapAreaMinimum`. The full width of the tab item SHALL be tappable (not just the icon).

---

### Requirement 10: Platform-Native Behavior

**User Story**: As a developer, I want platform-specific behaviors handled natively, so that the tab bar feels appropriate on each platform without custom runtime logic.

#### Acceptance Criteria

1. WHEN rendered on iOS THEN the component SHALL provide haptic feedback on tab selection.
2. WHEN rendered on iOS or Android THEN safe area insets SHALL be handled by the OS — the component SHALL NOT manually calculate or apply safe area padding.
3. WHEN rendered on Android THEN the component SHALL use Material 3 `NavigationBar` as the base, customized with DesignerPunk tokens.
4. WHEN mode (Day/Night) changes THEN the component SHALL resolve colors through the Spec 080 mode architecture (Level 2 semantic overrides) — mode is NOT a component prop.

---

### Requirement 11: Token Creation

**User Story**: As a design system architect, I want new tokens required by this component to be created through governance, so that the token system grows intentionally.

#### Acceptance Criteria

1. WHEN the component is implemented THEN the semantic token `color.icon.navigation.inactive` SHALL exist in the token registry with Day primitive `gray300` and dark override to `gray100`.
2. WHEN the component is implemented THEN the semantic token `blend.pressedLighter` SHALL exist in the token registry as blend300 at lighter direction (12%), mirroring `blend.pressedDarker`.
3. WHEN new tokens are created THEN they SHALL follow Token Governance — semantic tokens require verification of semantic correctness, creation requires human review.

---

### Requirement 12: Component Documentation

**User Story**: As a developer consuming Nav-TabBar-Base, I want comprehensive documentation, so that I can integrate the component correctly across platforms.

#### Acceptance Criteria

1. The component SHALL provide a README at `src/components/core/Nav-TabBar-Base/README.md` that includes: overview, usage examples for web/iOS/Android, API reference (props table), token dependencies, accessibility notes (WCAG 2.1 AA compliance), and platform-specific behavior notes.
2. The README SHALL document which tokens the component consumes, organized by category (color, spacing, motion, opacity, blend).
3. The README SHALL include accessibility documentation referencing specific WCAG criteria: 2.1.1 (Keyboard), 2.4.7 (Focus Visible), 2.3.3 (Animation from Interactions), 4.1.2 (Name, Role, Value).
4. Usage examples SHALL be copy-paste ready for each applicable platform.

---

**Organization**: spec-guide
**Scope**: 050-nav-tabbar-base
