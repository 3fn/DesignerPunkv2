# Implementation Plan: Nav-TabBar-Base

**Date**: March 18, 2026
**Spec**: 050 - Nav-TabBar-Base
**Status**: Implementation Planning
**Dependencies**:
- Spec 080 (Rosetta Mode Architecture) — Complete
- Spec 049 (Nav-SegmentedChoice-Base) — Complete (motion tokens, API pattern)

---

## Implementation Plan

The implementation is organized into 6 parent tasks:

1. **Token Creation & Governance** — Create `blend.pressedLighter`, `visual_gradient_glow` ballot measure
2. **Component Scaffolding** — Directory structure, schema, contracts, component-meta, props interface
3. **Web Implementation** — Web Component with Shadow DOM, chrome tracking, animation, accessibility
4. **iOS Implementation** — SwiftUI View with animation, haptics, accessibility
5. **Android Implementation** — Compose Composable with Material 3 base, animation, accessibility
6. **Documentation & Dark Mode** — README, dark mode token population, demo page

Task 1 is a prerequisite — `blend.pressedLighter` must exist before platform tasks implement pressed state. Task 2 must complete before any platform task starts (contracts gate implementation). Tasks 3–5 can proceed in parallel after Task 2. Task 6 follows platform completion.

---

## Dependency Graph

```
Task 1 (Token Creation)
    ↓
Task 2 (Scaffolding + Contracts)
    ↓
Task 3 (Web) ←→ Task 4 (iOS) ←→ Task 5 (Android)
    [parallel after Task 2]
    ↓
Task 6 (Documentation + Dark Mode)
```

---

## Task List

- [x] 1. Token Creation & Governance

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  **Agent**: Ada (token pipeline)

  **Success Criteria:**
  - `blend.pressedLighter` exists in token registry as blend300/lighter/12% ✅
  - Token passes all existing blend family tests ✅
  - `visual_gradient_glow` concept added to Concept Catalog (ballot measure approved) ✅
  - All existing tests continue passing ✅

  **Primary Artifacts:**
  - `src/tokens/BlendTokens.ts` (modified — new token)
  - Concept Catalog update (ballot measure)

  **Completion Documentation:**
  - Detailed: `.kiro/specs/050-nav-tabbar-base/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/050-nav-tabbar-base/task-1-summary.md`

  **Post-Completion:**
  - Commit: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Token Creation & Governance"`
  - Verify: `npm test` — all suites pass

  - [x] 1.1 Create `blend.pressedLighter` semantic token
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Add `blend.pressedLighter` to blend semantic tokens: blend300, lighter direction, 12%
    - Mirrors `blend.pressedDarker` exactly — same primitive, same intensity, opposite direction
    - Add test assertion for new token
    - Verify all existing blend tests pass unchanged
    - Note: `color.icon.navigation.inactive` (R11 AC1) already exists in the semantic registry with dark override in `SemanticOverrides.ts` — created during Spec 080. No task needed.
    - _Requirements: R11 AC2, AC3_

  - [x] 1.2 Ballot measure: `visual_gradient_glow` concept
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    **Agent**: Thurgood (governance)
    - Draft ballot measure to add `visual_gradient_glow` to Concept Catalog
    - Rationale: structurally distinct from `visual_state_colors` — gradient geometry, stops, independent animation
    - Present to Peter for approval
    - Apply if approved
    - _Requirements: design.md § Behavioral Contracts_

- [x] 2. Component Scaffolding

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  **Agent**: Lina (component architecture)

  **Success Criteria:**
  - Directory structure follows Stemma conventions
  - `contracts.yaml` authored with all 20 contracts from design.md
  - `component-meta.yaml` authored with purpose, usage, contexts
  - `schema.yaml` defines component structure
  - Props interface (`types.ts`) defined and exported
  - All platforms have placeholder files

  **Primary Artifacts:**
  - `src/components/core/Nav-TabBar-Base/`
  - `src/components/core/Nav-TabBar-Base/contracts.yaml`
  - `src/components/core/Nav-TabBar-Base/component-meta.yaml`
  - `src/components/core/Nav-TabBar-Base/Nav-TabBar-Base.schema.yaml`
  - `src/components/core/Nav-TabBar-Base/types.ts`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/050-nav-tabbar-base/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/050-nav-tabbar-base/task-2-summary.md`

  **Post-Completion:**
  - Commit: `./.kiro/hooks/commit-task.sh "Task 2 Complete: Component Scaffolding"`

  - [x] 2.1 Create directory structure
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    **Agent**: Lina
    - Create `src/components/core/Nav-TabBar-Base/`
    - Create platform directories: `platforms/web/`, `platforms/ios/`, `platforms/android/`
    - Create `__tests__/`
    - Create placeholder index files
    - _Requirements: R10_

  - [x] 2.2 Author contracts.yaml
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    **Agent**: Lina
    - Author all 20 contracts from design.md § Behavioral Contracts
    - Categories: interaction (6), animation (2), state (2), visual (4), accessibility (4), layout (1), validation (1)
    - Include exclusions: `state_disabled`, `interaction_hoverable`
    - Map each contract to requirement ACs
    - Contracts must be complete before platform implementation begins (lesson from 049 Task 3.1.CORRECTION)
    - _Requirements: all (contracts define the full behavioral specification)_

  - [x] 2.3 Author component-meta.yaml and schema.yaml
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Define purpose, usage.when_to_use, usage.when_not_to_use
    - Define contexts (primary-navigation, mobile-navigation)
    - Define alternatives (Nav-Header-Base for web-first header navigation)
    - Schema: component structure, allowed children (Icon-Base), badge slot
    - Follow existing patterns (reference Nav-SegmentedChoice-Base)
    - _Requirements: R12_

  - [x] 2.4 Define props interface (types.ts)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Create `types.ts` with `TabBarProps` and `TabOption` interfaces per design.md
    - `icon` (outline) + `activeIcon` (solid) + `accessibilityLabel` (required)
    - Export for platform implementations
    - Reference Nav-SegmentedChoice-Base's `types.ts` for pattern
    - _Requirements: R1, R2, R8 AC3_

- [x] 3. Web Implementation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  **Agent**: Lina (component implementation)

  **Success Criteria:**
  - Web Component renders with Shadow DOM
  - Floating pill container with `radiusFull`, backdrop blur, chrome tracking
  - Three-phase animation choreography using Rosetta motion tokens
  - Glow gradient on all tabs (accent active, vignette inactive)
  - Pressed state: `blend.pressedLighter` on inactive tabs, revert on drag-away
  - Keyboard navigation works (arrow keys, Enter/Space, Tab)
  - ARIA roles correct (tablist/tab, aria-selected)
  - Reduced motion disables animation
  - All behavioral contract tests pass

  **Primary Artifacts:**
  - `src/components/core/Nav-TabBar-Base/platforms/web/`
  - `src/components/core/Nav-TabBar-Base/__tests__/web/`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/050-nav-tabbar-base/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/050-nav-tabbar-base/task-3-summary.md`

  **Post-Completion:**
  - Commit: `./.kiro/hooks/commit-task.sh "Task 3 Complete: Web Implementation"`

  - [x] 3.1 Web Component structure and container
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Create Web Component class with Shadow DOM
    - Floating pill container: `radiusFull`, backdrop blur, inline margins (`space200`)
    - Container padding: `space.inset.050` / `space.inset.100` / `space.inset.150` / `space.inset.100` (T/R/B/L)
    - Container background: `color.structure.canvas`, top stroke: `color.structure.border.subtle`
    - Equal-width tab distribution, no inter-tab spacing
    - Badge composition slot (empty named slot per tab item)
    - _Requirements: R5 AC2-3, AC6-8_
    - _Contracts: visual_background, visual_pill_container, layout_flexible_length_

  - [x] 3.2 Chrome tracking
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Visual Viewport API: `window.visualViewport` resize/scroll events
    - Compute offset: `window.innerHeight - visualViewport.height`
    - Apply via `--chrome-offset` CSS custom property
    - `transition: bottom 100ms ease-out`
    - Floating gap: `space200` above chrome offset
    - Fallback: `--chrome-offset: 0px` if `visualViewport` unavailable, static above `env(safe-area-inset-bottom)`
    - _Requirements: R5 AC4-5_
    - _Contracts: visual_pill_container_

  - [x] 3.3 Tab item rendering and visual states
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Active tab: solid icon (`color.action.navigation`), indicator dot (`space050` × `space050`), active padding
    - Inactive tab: outline icon (`color.icon.navigation.inactive`), inactive padding
    - Glow gradient on all tabs: elliptical radial, 88% radii, three stops, bleeds into adjacent tabs
    - Active gradient center: `color.background.primary.subtle`. Inactive: `color.structure.canvas`
    - Pressed state: `blend.pressedLighter` on inactive icon, revert on drag-away
    - _Requirements: R2, R4, R6_
    - _Contracts: visual_state_colors, visual_gradient_glow, interaction_pressable, interaction_noop_active_

  - [x] 3.4 Selection animation choreography
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Three-phase animation: depart (glow dim + icon settle) → glide (dot slides) → arrive (icon lift + glow brighten)
    - Phase 3 overlaps Phase 2 at ~80% (animation delay or timeout)
    - Icon outline↔solid snap when arriving glow begins
    - Glow opacity independently animated (continuous dim/brighten, not binary)
    - All timing uses Rosetta motion tokens — no hard-coded values
    - `onSelectionChange` fires immediately on press release, before animation
    - Suppress animation on initial render
    - `prefers-reduced-motion` bypass — all phases collapse to immediate state change
    - _Requirements: R3_
    - _Contracts: animation_coordination, animation_initial_render, accessibility_reduced_motion_

  - [x] 3.5 Keyboard navigation and accessibility
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Roving tabindex: selected tab `tabindex="0"`, others `tabindex="-1"`
    - Left/Right arrow navigation with wrapping
    - Enter/Space selection
    - Tab entry (to selected tab) and Tab exit
    - Focus ring via `:focus-visible` with accessibility focus tokens
    - ARIA: container `role="tablist"`, items `role="tab"` + `aria-selected`
    - `accessibilityLabel` announced (not icon name)
    - _Requirements: R7, R8_
    - _Contracts: interaction_roving_tabindex, interaction_keyboard_navigation, interaction_keyboard_activation, interaction_focus_ring, accessibility_aria_roles, accessibility_aria_label_

  - [x] 3.6 Web behavioral contract tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Selection tests (tap, no-op on active, fallback, minimum tabs error)
    - Visual state tests (active/inactive icons, dot, glow gradient, pressed blend)
    - Keyboard tests (arrows, Enter/Space, Tab, wrapping, focus ring)
    - Accessibility tests (roles, aria-selected, accessibilityLabel)
    - Animation tests (three phases, reduced motion bypass, initial render no-animation, icon snap)
    - Chrome tracking tests (offset computation, fallback, transition)
    - Touch target tests (full width tappable, min-width)
    - _Requirements: R1–R9_
    - _Validates contracts: all web-applicable contracts_

- [ ] 4. iOS Implementation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  **Agent**: Lina (component implementation)

  **Success Criteria:**
  - SwiftUI View renders correctly
  - Full-width anchored to bottom, OS safe area
  - Three-phase animation choreography using `UnitCurve` (iOS 17+)
  - Glow gradient on all tabs
  - Haptic feedback on selection
  - VoiceOver accessibility correct
  - Reduced motion disables animation
  - All behavioral contract tests pass

  **Primary Artifacts:**
  - `src/components/core/Nav-TabBar-Base/platforms/ios/`
  - `src/components/core/Nav-TabBar-Base/__tests__/ios/`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/050-nav-tabbar-base/completion/task-4-parent-completion.md`
  - Summary: `docs/specs/050-nav-tabbar-base/task-4-summary.md`

  **Post-Completion:**
  - Commit: `./.kiro/hooks/commit-task.sh "Task 4 Complete: iOS Implementation"`

  - [ ] 4.1 SwiftUI View structure and rendering
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Full-width container anchored to bottom, OS safe area insets
    - Container background: `color.structure.canvas`, top stroke: `color.structure.border.subtle`
    - Equal-width tab distribution, no inter-tab spacing
    - Tab item rendering: active/inactive icons, dot, glow gradient, padding
    - Badge composition slot (ViewBuilder)
    - _Requirements: R5 AC1, AC6-8, R2, R4, R6_
    - _Contracts: visual_background, visual_state_colors, visual_gradient_glow, layout_flexible_length_

  - [ ] 4.2 Selection logic, animation, and haptics
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Selection via binding, no-op on active, fallback for invalid value, minimum 2 tabs
    - Three-phase animation using SwiftUI `.animation()` with `UnitCurve`
    - Phase 3 overlaps Phase 2 (chained animation with delay)
    - Icon swap as conditional view
    - Glow opacity animated continuously
    - `onSelectionChange` fires immediately before animation
    - Haptic feedback on selection (`UIImpactFeedbackGenerator`)
    - `UIAccessibility.isReduceMotionEnabled` check
    - No animation on initial render
    - _Requirements: R1, R3, R10 AC1_
    - _Contracts: interaction_pressable, interaction_noop_active, validation_selection_constraints, animation_coordination, animation_initial_render, accessibility_reduced_motion_

  - [ ] 4.3 Accessibility
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - VoiceOver: tab semantics, selected state
    - Keyboard navigation (external keyboard)
    - `accessibilityLabel` announced (not icon name)
    - Pressed state: `blend.pressedLighter` on inactive tabs
    - _Requirements: R7, R8, R2 AC3_
    - _Contracts: accessibility_aria_roles, accessibility_aria_label, interaction_keyboard_navigation, interaction_keyboard_activation, interaction_focus_ring_

  - [ ] 4.4 iOS behavioral contract tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Selection, animation, accessibility, visual state, haptic tests
    - _Requirements: R1–R10_
    - _Validates contracts: all iOS-applicable contracts_

- [ ] 5. Android Implementation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  **Agent**: Lina (component implementation)

  **Success Criteria:**
  - Compose Composable renders correctly
  - Material 3 `NavigationBar` as base, customized with DesignerPunk tokens
  - Three-phase animation choreography
  - Glow gradient on all tabs
  - TalkBack accessibility correct
  - Reduced motion disables animation
  - All behavioral contract tests pass

  **Primary Artifacts:**
  - `src/components/core/Nav-TabBar-Base/platforms/android/`
  - `src/components/core/Nav-TabBar-Base/__tests__/android/`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/050-nav-tabbar-base/completion/task-5-parent-completion.md`
  - Summary: `docs/specs/050-nav-tabbar-base/task-5-summary.md`

  **Post-Completion:**
  - Commit: `./.kiro/hooks/commit-task.sh "Task 5 Complete: Android Implementation"`

  - [ ] 5.1 Compose Composable structure and rendering
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Material 3 `NavigationBar` as base, customized with DesignerPunk tokens
    - Full-width anchored to bottom, OS safe area insets
    - Container background: `color.structure.canvas`, top stroke: `color.structure.border.subtle`
    - Equal-width tab distribution, no inter-tab spacing
    - Tab item rendering: active/inactive icons, dot, glow gradient, padding
    - Badge composition slot (content lambda)
    - _Requirements: R5 AC1, AC6-8, R2, R4, R6, R10 AC3_
    - _Contracts: visual_background, visual_state_colors, visual_gradient_glow, layout_flexible_length_

  - [ ] 5.2 Selection logic and animation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Selection via state hoisting, no-op on active, fallback for invalid value, minimum 2 tabs
    - Three-phase animation using Compose `Animatable` / `animateFloatAsState`
    - Glide: custom `Easing` consuming `easingGlideDecelerate`
    - Phase 3 overlaps Phase 2 (`Animatable` with delay)
    - Glow opacity animated continuously
    - `onSelectionChange` fires immediately before animation
    - `Settings.Global.ANIMATOR_DURATION_SCALE` check for reduced motion
    - No animation on initial render
    - _Requirements: R1, R3_
    - _Contracts: interaction_pressable, interaction_noop_active, validation_selection_constraints, animation_coordination, animation_initial_render, accessibility_reduced_motion_

  - [ ] 5.3 Accessibility
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - TalkBack: Semantics with `Role.Tab` and `selected` state
    - Keyboard navigation (hardware keyboard)
    - `accessibilityLabel` announced (not icon name)
    - Pressed state: `blend.pressedLighter` on inactive tabs
    - _Requirements: R7, R8, R2 AC3_
    - _Contracts: accessibility_aria_roles, accessibility_aria_label, interaction_keyboard_navigation, interaction_keyboard_activation, interaction_focus_ring_

  - [ ] 5.4 Android behavioral contract tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Selection, animation, accessibility, visual state tests
    - _Requirements: R1–R10_
    - _Validates contracts: all Android-applicable contracts_

- [ ] 6. Documentation & Dark Mode

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  **Agent**: Lina + Ada (cross-domain)

  **Success Criteria:**
  - README complete with all required sections per R12
  - Dark mode token population verified (Spec 080 governance step)
  - Demo page created (if web implementation)
  - Navigation family steering doc updated

  **Primary Artifacts:**
  - `src/components/core/Nav-TabBar-Base/README.md`
  - `src/tokens/themes/dark/SemanticOverrides.ts` (verified — overrides already exist from 080 Task 7)
  - `demos/nav-tabbar-base-demo.html`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/050-nav-tabbar-base/completion/task-6-parent-completion.md`
  - Summary: `docs/specs/050-nav-tabbar-base/task-6-summary.md`

  **Post-Completion:**
  - Commit: `./.kiro/hooks/commit-task.sh "Task 6 Complete: Documentation & Dark Mode"`

  - [ ] 6.1 Component README
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Overview, usage examples (web/iOS/Android), API reference (props table)
    - Token dependencies organized by category (color, spacing, motion, opacity, blend)
    - Accessibility notes referencing WCAG 2.1.1, 2.4.7, 2.3.3, 4.1.2
    - Platform-specific behavior notes (floating pill vs anchored, chrome tracking, haptics)
    - Copy-paste ready usage examples per platform
    - _Requirements: R12_

  - [ ] 6.2 Dark mode token population verification
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Verify all 5 Nav-TabBar-Base dark overrides are active in `SemanticOverrides.ts` (created during 080 Task 7)
    - Verify `blend.pressedLighter` does not need a dark override (blend tokens are mode-invariant — they operate on whatever color they're applied to)
    - Confirm no additional dark mode entries needed for this component
    - Per Component-Development-Guide step 8 (Dark Mode Token Population)
    - _Requirements: R10 AC4_

  - [ ] 6.3 Demo page
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Create `demos/nav-tabbar-base-demo.html`
    - Demonstrate: 3-tab, 4-tab, 5-tab configurations
    - Demonstrate: selection change with animation
    - Demonstrate: Day/Night mode toggle
    - Demonstrate: chrome tracking (mobile viewport simulation)
    - Reference existing demo patterns
    - _Requirements: R1, R2, R3, R4_

  - [ ] 6.4 Navigation family steering doc update
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Update `Component-Family-Navigation.md` to include Nav-TabBar-Base (doc exists, created during 049)
    - Update Component-Quick-Reference.md if needed
    - Ballot measure required for steering doc changes
    - _Requirements: R12_

---

## Documentation Tasks (Distributed)

- **contracts.yaml**: Task 2.2 (before platform implementation — lesson from 049)
- **component-meta.yaml + schema.yaml**: Task 2.3
- **types.ts**: Task 2.4
- **README**: Task 6.1 (after all platforms implemented)
- **Dark mode verification**: Task 6.2
- **Demo page**: Task 6.3
- **Navigation family steering doc**: Task 6.4

---

**Organization**: spec-guide
**Scope**: 050-nav-tabbar-base
