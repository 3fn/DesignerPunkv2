# Implementation Plan: Nav-SegmentedChoice-Base

**Date**: 2026-03-12
**Spec**: 049 - Nav-SegmentedChoice-Base
**Status**: Implementation Planning
**Dependencies**:
- Spec 076 (Primary Action Color Migration) — `color.action.navigation` token
- Easing infrastructure — piecewise linear token type

---

## Ada/Lina Review Feedback — Resolved

> Ada raised 3 items, Lina raised 6 (3 overlapping). All addressed below.

| # | Feedback | Resolution |
|---|----------|------------|
| A1/L1 | Task 1.1/1.2 sequencing — iOS research may invalidate token structure | Resequenced: iOS research spike is now 1.1, token type system is 1.2 (incorporates iOS findings) |
| A2/L5 | Figma style name divergence (`shadow.nav.segmented` vs `shadow.navigation.indicator`) | Housekeeping note added to Task 1.6 — Figma-side update, not codebase |
| A3/L6 | Design outline still references `testID`-based `aria-controls` | Design outline updated to use `id` prop pattern |
| L2 | Task 3.6 (web tests) too large | Split into 3.6 (interaction + accessibility) and 3.7 (animation + visual) |
| L3 | No README subtask | Added as Task 3.8 |
| L4 | Navigation family steering doc not tracked | Added as Task 5.5 |
| — | Req 1.5 tightened (minimum segments) | Accepted: runtime error with descriptive message, not TBD |

---

The implementation is organized into 5 parent tasks:

1. **Easing Infrastructure** — Extend token system for piecewise linear curves (prerequisite)
2. **Component Scaffolding** — Directory structure, schema, component-meta, props interface
3. **Web Implementation** — Web Component with Shadow DOM, animation, accessibility
4. **iOS Implementation** — SwiftUI View with animation, accessibility
5. **Android Implementation** — Compose Composable with animation, accessibility

Task 1 (easing) is a prerequisite — it extends the token pipeline. Tasks 3–5 can proceed in parallel after Task 2.

Documentation (README, Navigation family steering doc update) is included as subtasks within the platform tasks rather than a separate parent task.

---

## Task List

- [ ] 1. Easing Token Infrastructure Extension

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  **Agent**: Ada (token pipeline)

  **Success Criteria:**
  - Easing token system supports both `cubicBezier` and `linear` (piecewise) types
  - `easingGlideDecelerate` primitive token defined with stops array
  - All 3 platform builders generate correct output for linear easing type
  - DTCG generator handles new easing type
  - Figma transformer handles new easing type
  - All existing easing tests continue passing unchanged
  - New tests cover linear easing path in each generator

  **Primary Artifacts:**
  - `src/tokens/EasingTokens.ts` (modified — type union or new field)
  - `src/build/platforms/WebBuilder.ts` (modified — `linear()` output)
  - `src/build/platforms/iOSBuilder.ts` (modified — `UnitCurve` output)
  - `src/build/platforms/AndroidBuilder.ts` (modified — custom `Easing` or `keyframes`)
  - `src/generators/DTCGFormatGenerator.ts` (modified — new type)
  - `src/generators/transformers/FigmaTransformer.ts` (modified — new case)

  **Completion Documentation:**
  - Detailed: `.kiro/specs/049-nav-segmentedchoice-base/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/049-nav-segmentedchoice-base/task-1-summary.md`

  **Post-Completion:**
  - Commit: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Easing Token Infrastructure Extension"`
  - Verify: `npm test` — all suites pass, no regressions

  - [x] 1.1 iOS easing research spike
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    **Agent**: Ada (token pipeline) + Lina (iOS platform review)
    - Research `UnitCurve` (iOS 17+) as representation for piecewise linear curves
    - Evaluate: can `UnitCurve` be generated as a static constant like `CubicBezierEasing`?
    - If `UnitCurve` doesn't fit, evaluate `KeyframeAnimator` with `LinearKeyframe` segments
    - Document chosen approach with rationale and trade-offs
    - Document data shape requirements — does iOS need a different representation than stops array?
    - Minimum iOS target: 17.0+ (confirmed in Core Goals)
    - _Requirements: 10.5_

  - [x] 1.2 Extend easing token type system
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    **Agent**: Ada
    - Incorporate iOS findings from 1.1 into token data shape
    - Add `type` discriminator to easing token definition (`cubicBezier` | `linear`)
    - Add stops array field: `Array<[number, number]>` (progress, timePercent) — or adjusted format if iOS requires it
    - Address `PrimitiveToken.baseValue` incompatibility (type union or new field)
    - Update `generateEasingPlatformValues()` for conditional path
    - Define `easingGlideDecelerate` token with the approved piecewise linear stops
    - _Requirements: 3.4_

  - [x] 1.3 Update platform builders
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Web: `generateEasingTokens()` outputs `linear(...)` for linear type (line ~694)
    - iOS: `generateEasingTokens()` outputs chosen approach from 1.2 (line ~1324)
    - Android: `generateEasingTokens()` outputs custom `Easing` implementation or `keyframes` (line ~1083)
    - All existing cubic-bezier output unchanged
    - _Requirements: 10.5_

  - [x] 1.4 Update DTCG generator and Figma transformer
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - DTCG: Add custom `$type` for linear easing (e.g., `linearEasing`) in `DTCGTypes.ts` (line ~20) and `generateEasingTokens()` (line ~466)
    - Figma: Add linear case in transformer (line ~740) and stops serialization (line ~775)
    - _Requirements: 3.4_

  - [x] 1.5 Tests for linear easing path
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Add linear easing tests to `WebMotionTokenGeneration.test.ts`
    - Add linear easing tests to `iOSMotionTokenGeneration.test.ts`
    - Add linear easing tests to `AndroidMotionTokenGeneration.test.ts`
    - Add linear easing tests to `MotionTokenCrossPlatformIntegration.test.ts`
    - Add linear easing tests to `DTCGFormatGenerator.test.ts`
    - Add linear easing tests to `FigmaTransformer.variables.test.ts`
    - Verify all existing easing tests still pass
    - _Requirements: 3.4_

  - [x] 1.6 Steering documentation updates
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    **Agent**: Ada
    - Update Token-Family-Motion.md (or easing section) with new easing type documentation
    - Ballot measure required for steering doc changes
    - **Housekeeping note**: Figma effect style `shadow.nav.segmented` should be renamed to match token `shadow.navigation.indicator` — Figma-side update, not codebase. Flag for Ada/Peter.
    - _Requirements: 11.1_

- [x] 2. Component Scaffolding

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  **Agent**: Lina (component architecture)

  **Success Criteria:**
  - Directory structure follows Stemma conventions
  - Schema defines component structure and allowed children
  - component-meta.yaml authored with purpose, usage, contexts
  - Props interface defined and exported
  - All platforms have placeholder files

  **Primary Artifacts:**
  - `src/components/core/Nav-SegmentedChoice-Base/`
  - `src/components/core/Nav-SegmentedChoice-Base/component-meta.yaml`
  - `src/components/core/Nav-SegmentedChoice-Base/schema/`
  - `src/components/core/Nav-SegmentedChoice-Base/types.ts`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/049-nav-segmentedchoice-base/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/049-nav-segmentedchoice-base/task-2-summary.md`

  **Post-Completion:**
  - Commit: `./.kiro/hooks/commit-task.sh "Task 2 Complete: Component Scaffolding"`

  - [x] 2.1 Create directory structure
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    **Agent**: Lina
    - Create `src/components/core/Nav-SegmentedChoice-Base/`
    - Create platform directories: `platforms/web/`, `platforms/ios/`, `platforms/android/`
    - Create `schema/`, `__tests__/`
    - Create placeholder index files
    - _Requirements: 10.1, 10.2, 10.3_

  - [x] 2.2 Author component-meta.yaml
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Define purpose, usage.when_to_use, usage.when_not_to_use
    - Define contexts (navigation, view-switching)
    - Define alternatives (if any)
    - Follow existing component-meta patterns (reference Chip-Base, Progress-Pagination-Base)
    - _Requirements: 11.2_

  - [x] 2.3 Define schema and props interface
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Create `types.ts` with `SegmentedChoiceProps` and `SegmentOption` union type
    - Create schema defining component structure
    - Export props interface for platform implementations
    - **Gap identified post-completion**: `contracts.yaml` is a standard Stemma scaffolding artifact (alongside schema.yaml and component-meta.yaml) and should have been authored here. Corrected in Task 3.1.CORRECTION.
    - _Requirements: 1.1, 2.1, 2.2, 2.3, 2.4, 6.1, 6.2, 6.3, 7.1, 7.2, 7.3_

- [x] 3. Web Implementation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  **Agent**: Lina (component implementation)

  **Success Criteria:**
  - Web Component renders with Shadow DOM
  - Indicator animates with four-phase choreography using CSS transitions + `linear()`
  - Keyboard navigation works (arrow keys, Enter/Space, Tab)
  - ARIA roles correct (tablist/tab, aria-selected, aria-controls when id provided)
  - Hover on inactive segments only
  - Reduced motion disables animation
  - Standard and Condensed sizes render correctly
  - All behavioral contract tests pass

  **Primary Artifacts:**
  - `src/components/core/Nav-SegmentedChoice-Base/platforms/web/`
  - `src/components/core/Nav-SegmentedChoice-Base/__tests__/web/`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/049-nav-segmentedchoice-base/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/049-nav-segmentedchoice-base/task-3-summary.md`

  **Post-Completion:**
  - Commit: `./.kiro/hooks/commit-task.sh "Task 3 Complete: Web Implementation"`

  - [x] 3.1 Web Component structure and rendering
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Create Web Component class with Shadow DOM
    - Render container (tablist), segments (tab), and indicator element
    - Apply token-based CSS custom properties for all visual specs
    - Implement equal-width segment layout (flexbox)
    - Implement Standard and Condensed size variants
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 10.1, 7.1, 7.2, 7.3_

  - [x] 3.1.CORRECTION Author behavioral contracts (contracts.yaml)
    **Type**: Architecture
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - **Process correction**: contracts.yaml should have been authored during Task 2 (scaffolding) as a standard Stemma component artifact, before platform implementation began. Task 3.1 was implemented without pre-defined contracts — implementation preceded specification. This task corrects that by authoring contracts.yaml and verifying 3.1 satisfies the rendering/visual contracts retroactively.
    - Author `contracts.yaml` covering all behavioral contracts: rendering, selection, animation choreography, keyboard navigation, accessibility, hover state, size variants
    - Verify Task 3.1 implementation satisfies the rendering and visual contracts; fix any gaps
    - Remaining subtasks (3.2–3.5) implement against defined contracts; test subtasks (3.6–3.7) validate them
    - _Requirements: all (contracts define the full behavioral specification)_

  - [x] 3.2 Selection logic and state management
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Implement selection via `selectedValue` + `onSelectionChange`
    - Handle no-op on active segment tap
    - Handle fallback when `selectedValue` doesn't match any segment
    - Enforce minimum 2 segments
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
    - _Contracts: interaction_pressable, interaction_noop_active, validation_selection_constraints, content_displays_fallback_

  - [x] 3.3 Indicator animation choreography
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    **Agent**: Lina
    - Implement four-phase animation: shadow out → resize+glide → shadow in
    - CSS transitions for shadow phases, JS-orchestrated position/width
    - Use `linear()` CSS function for glide easing (consuming `easingGlideDecelerate` token)
    - Suppress animation on initial render
    - Implement `prefers-reduced-motion` media query bypass
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_
    - _Contracts: animation_coordination, accessibility_reduced_motion, animation_initial_render_

  - [x] 3.4 Keyboard navigation and accessibility
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Implement arrow key navigation with wrapping
    - Implement Enter/Space selection
    - Implement Tab entry (to selected segment) and Tab exit
    - Set ARIA roles: tablist, tab, aria-selected
    - Generate aria-controls from `id` prop (when provided)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3, 5.4, 5.5, 6.1, 6.2, 6.3_
    - _Contracts: interaction_keyboard_navigation, interaction_keyboard_activation, interaction_roving_tabindex, accessibility_aria_roles, accessibility_aria_controls, accessibility_alt_text, interaction_focus_ring_

  - [x] 3.5 Hover state
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Apply `blend.containerHoverDarker` on inactive segment hover
    - No hover feedback on active segment
    - _Requirements: 8.1, 8.2, 8.3_
    - _Contracts: interaction_hover_

  - [x] 3.6 Web interaction and accessibility tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Selection tests (tap, no-op, fallback, minimum segments error)
    - Keyboard tests (arrows, Enter/Space, Tab, wrapping)
    - Accessibility tests (roles, aria-selected, aria-controls with/without id)
    - Hover tests (inactive only, no hover on active)
    - _Requirements: 1, 4, 5, 6, 8_
    - _Validates contracts: interaction_pressable, interaction_noop_active, interaction_hover, interaction_focus_ring, interaction_keyboard_navigation, interaction_keyboard_activation, interaction_roving_tabindex, accessibility_aria_roles, accessibility_aria_controls, accessibility_alt_text, validation_selection_constraints, content_displays_fallback_

  - [x] 3.7 Web animation and visual tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Animation choreography tests (phases fire in order, timing)
    - Reduced motion bypass test
    - Initial render no-animation test
    - Size variant tests (standard vs condensed token application)
    - Visual spec compliance tests (container, segment, indicator tokens)
    - _Requirements: 3, 7, 9_
    - _Validates contracts: animation_coordination, accessibility_reduced_motion, animation_initial_render, visual_background, visual_border, visual_shadow, visual_state_colors, visual_size_variants, layout_flexible_length, content_displays_label, content_supports_icon_

  - [x] 3.8 Component README
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Author README with overview, usage examples (web), API reference, token dependencies, accessibility notes, platform-specific behavior
    - iOS and Android sections added as stubs, completed in Tasks 4/5
    - _Requirements: 11.1_

- [ ] 4. iOS Implementation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  **Agent**: Lina (component implementation)

  **Success Criteria:**
  - SwiftUI View renders correctly
  - Indicator animates with four-phase choreography using `UnitCurve` (or chosen approach from 1.2)
  - VoiceOver accessibility correct
  - Reduced motion disables animation
  - Standard and Condensed sizes render correctly
  - All behavioral contract tests pass

  **Primary Artifacts:**
  - `src/components/core/Nav-SegmentedChoice-Base/platforms/ios/`
  - `src/components/core/Nav-SegmentedChoice-Base/__tests__/ios/`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/049-nav-segmentedchoice-base/completion/task-4-parent-completion.md`
  - Summary: `docs/specs/049-nav-segmentedchoice-base/task-4-summary.md`

  **Post-Completion:**
  - Commit: `./.kiro/hooks/commit-task.sh "Task 4 Complete: iOS Implementation"`

  - [ ] 4.1 SwiftUI View structure and rendering
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Create SwiftUI View with container, segments, indicator
    - Apply token-based styling
    - Equal-width layout, Standard and Condensed sizes
    - _Requirements: 9.1–9.8, 10.2, 7.1–7.3_

  - [ ] 4.2 Selection logic and indicator animation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Selection via binding, no-op on active, fallback for invalid value
    - Four-phase animation using SwiftUI `.animation()` with custom timing
    - `UnitCurve` for glide (or approach from 1.2)
    - `UIAccessibility.isReduceMotionEnabled` check
    - No animation on initial render
    - _Requirements: 1.1–1.5, 3.1–3.7_

  - [ ] 4.3 Accessibility
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - VoiceOver: `accessibilityElement` with tab semantics
    - Keyboard navigation (external keyboard support)
    - Icon segments announced by `accessibilityLabel`
    - _Requirements: 4.1–4.5, 5.1–5.5_

  - [ ] 4.4 iOS behavioral contract tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Selection, animation, accessibility, size variant tests
    - _Requirements: 1–9_

- [ ] 5. Android Implementation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  **Agent**: Lina (component implementation)

  **Success Criteria:**
  - Compose Composable renders correctly
  - Indicator animates with four-phase choreography
  - Indicator shadow uses `Modifier.shadow()` + `.clip(shape)` (not elevation)
  - TalkBack accessibility correct
  - Reduced motion disables animation
  - Standard and Condensed sizes render correctly
  - All behavioral contract tests pass

  **Primary Artifacts:**
  - `src/components/core/Nav-SegmentedChoice-Base/platforms/android/`
  - `src/components/core/Nav-SegmentedChoice-Base/__tests__/android/`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/049-nav-segmentedchoice-base/completion/task-5-parent-completion.md`
  - Summary: `docs/specs/049-nav-segmentedchoice-base/task-5-summary.md`

  **Post-Completion:**
  - Commit: `./.kiro/hooks/commit-task.sh "Task 5 Complete: Android Implementation"`

  - [ ] 5.1 Compose Composable structure and rendering
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Create Composable with container, segments, indicator
    - Apply token-based styling
    - Indicator shadow: `Modifier.shadow(elevation, shape)` + `.clip(shape)` — NOT `Surface(elevation)` or `mapShadowToElevation()`
    - Equal-width layout, Standard and Condensed sizes
    - _Requirements: 9.1–9.8, 10.3, 10.6, 7.1–7.3_

  - [ ] 5.2 Selection logic and indicator animation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Selection via state hoisting, no-op on active, fallback for invalid value
    - Four-phase animation using Compose `Animatable` / `animateFloatAsState`
    - Shadow choreography: `animateDpAsState` between 0.dp and 2.dp
    - Glide: custom `Easing` or `keyframes` (consuming `easingGlideDecelerate`)
    - `Settings.Global.ANIMATOR_DURATION_SCALE` check for reduced motion
    - No animation on initial render
    - _Requirements: 1.1–1.5, 3.1–3.7_

  - [ ] 5.3 Accessibility
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - TalkBack: Semantics with `Role.Tab` and `selected` state
    - Keyboard navigation (hardware keyboard)
    - Icon segments announced by `accessibilityLabel`
    - _Requirements: 4.1–4.5, 5.1–5.5_

  - [ ] 5.4 Android behavioral contract tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Selection, animation, accessibility, size variant tests
    - Shadow implementation test: verify `Modifier.shadow()` used, not elevation
    - _Requirements: 1–9, 10.6_

  - [ ] 5.5 Navigation family steering doc update
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Update Navigation family placeholder in Component-Quick-Reference.md to reflect implemented component
    - Ballot measure required for steering doc changes
    - _Requirements: 11.3_

---

## Documentation Tasks (Distributed)

Documentation is distributed across implementation tasks:

- **README**: Task 3.8 (web-first, iOS/Android stubs completed in Tasks 4–5)
- **component-meta.yaml**: Task 2.2
- **Navigation family steering doc update**: Task 5.5 (after all platforms implemented)
- **Figma style name alignment**: Housekeeping note on Task 1.6 (Figma-side, not codebase)

---

## Dependency Graph

```
Task 1 (Easing Infrastructure)
    ↓
Task 2 (Scaffolding)
    ↓
Task 3 (Web) ←→ Task 4 (iOS) ←→ Task 5 (Android)
    [parallel after Task 2]
```

Task 1 must complete before platform tasks can implement the glide animation. Task 2 must complete before any platform task starts. Tasks 3–5 are independent and can proceed in parallel.
