# Implementation Plan: Pagination Animation

**Date**: 2026-03-07
**Spec**: 074 - Pagination Animation
**Status**: Implementation Planning
**Dependencies**: Spec 072 (Pagination Container Styling) — ✅ Complete

---

## Task List

- [x] 1. Prerequisites

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - All 5 dots render correctly in browser demo with proper state emphasis
  - `npm run build` regenerates platform tokens automatically
  - Browser demo reads tokens from `dist/` (no stale `output/` issues)
  - iOS motion token constants use proper `Motion` type wrapper
  - Existing behavioral test suite passes

  **Primary Artifacts:**
  - Node-Base web component fix (rendering)
  - `package.json` (build script update)
  - `build-browser-bundles.js` (source priority fix)
  - iOS generator fix (motion type wrapper)

  **Completion Documentation:**
  - Detailed: `.kiro/specs/074-pagination-animation/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/074-pagination-animation/task-1-summary.md`

  **Post-Completion:**
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Prerequisites"` (runs release analysis automatically)
  - Verify: Check GitHub for committed changes

  - [x] 1.1 Fix Node-Base web rendering bugs
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (component implementation)
    - Fix missing 5th dot rendering issue
    - Fix current state emphasis (size + color) not displaying
    - Fix invalid `size` attribute passed to `<icon-base>` for lg nodes (Known Issue 4)
    - Verify all 5 dots render with correct state emphasis in browser demo
    - _Requirements: 6.1, 6.2, 6.3_

  - [x] 1.2 Fix token pipeline build integration
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada (token pipeline)
    - Add `"generate:platform-tokens"` npm script
    - Wire into `prebuild` so `npm run build` regenerates platform tokens
    - Flip source priority in `build-browser-bundles.js`: `dist/` first, `output/` fallback
    - Verify browser demo picks up fresh tokens after `npm run build`
    - _Requirements: 7.1, 7.2_

  - [x] 1.3 Fix iOS motion token type
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada (token pipeline)
    - Update iOS generator: motion token shorthand constants use `Motion` type wrapper instead of `Typography`
    - Verify generated `DesignTokens.ios.swift` has correct motion types
    - _Requirements: 7.3_

- [x] 2. Pagination Animation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Node state transitions animate smoothly (size + color) on all 3 platforms
  - Window scroll animates smoothly on all 3 platforms
  - Animation uses `motion.selectionTransition` timing (250ms, easingStandard)
  - `prefers-reduced-motion` disables animation on all platforms
  - ARIA announcements not delayed by animation
  - `performance_virtualization` contract updated
  - All behavioral tests pass

  **Primary Artifacts:**
  - `src/components/core/Progress-Pagination-Base/platforms/web/ProgressPaginationBase.web.ts` (DOM refactor + animation)
  - `src/components/core/Progress-Pagination-Base/platforms/web/ProgressPaginationBase.styles.css` (transition CSS)
  - `src/components/core/Progress-Pagination-Base/platforms/ios/ProgressPaginationBase.ios.swift` (animation modifiers)
  - `src/components/core/Progress-Pagination-Base/platforms/android/ProgressPaginationBase.android.kt` (animation APIs)
  - `src/components/core/Progress-Pagination-Base/contracts.yaml` (contract update)

  **Completion Documentation:**
  - Detailed: `.kiro/specs/074-pagination-animation/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/074-pagination-animation/task-2-summary.md`

  **Post-Completion:**
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 2 Complete: Pagination Animation"` (runs release analysis automatically)
  - Verify: Check GitHub for committed changes

  - [x] 2.1 Refactor web DOM strategy
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    **Agent**: Lina (component implementation)
    - Split `render()` into one-time setup (`connectedCallback`) and incremental update (`_render()`)
    - Create `<style>`, container `<div>`, and 5 `<progress-indicator-node-base>` elements once
    - `_render()` updates container class/aria-label and node attributes only
    - Handle add/remove of node children when visible count changes
    - **⚠️ VALIDATION GATE**: Run full behavioral test suite (`npm test -- PaginationBase.test.ts`) — must pass with zero failures before proceeding to animation tasks
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [x] 2.2 Add web animation CSS and reduced motion
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (component implementation)
    - Add CSS transitions using `motion.selectionTransition` token values (250ms, easingStandard)
    - Determine correct transition target (outer custom element vs Node-Base internal styles)
    - Add `@media (prefers-reduced-motion: reduce)` rule to disable transitions
    - Verify state transitions animate on `currentItem` change
    - Verify scroll animates when visible window shifts
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 5.1, 5.5_

  - [x] 2.3 Add iOS animation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (component implementation)
    - Add `.animation()` modifier using `motion.selectionTransition` values
    - Check `UIAccessibility.isReduceMotionEnabled` and conditionally omit animation
    - Verify state and scroll animation in iOS
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 5.2_

  - [x] 2.4 Add Android animation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (component implementation)
    - Add `animateXAsState` with `tween()` spec using `motion.selectionTransition` values
    - Check `Settings.Global.ANIMATOR_DURATION_SCALE` and use `snap()` for reduced motion
    - Verify state and scroll animation in Android
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 5.3_

  - [x] 2.5 Update contract and documentation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (component documentation) → Thurgood (contract review)
    - Update `performance_virtualization` contract in `contracts.yaml`
    - Update README with animation behavior and reduced motion notes
    - _Requirements: 4.1, 4.2, 5.4_

  - [x] 2.6 Final validation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (visual verification) → Thurgood (behavioral audit)
    - Visual inspection of animation on all 3 platforms
    - Run full behavioral test suite — confirm zero regressions
    - Verify reduced motion disables animation on all platforms
    - Verify ARIA announcements are not delayed by animation
    - _Requirements: 1.1–1.4, 2.1–2.4, 5.1–5.5_

---

- [ ] 3. Animation Refinement
  **Type**: Architecture
  **Validation**: Tier 3 - Comprehensive
  **Success Criteria**:
  - No layout twitch/jump during node state transitions on any size variant
  - Dots visually slide left (forward) or right (backward) when the visible window shifts
  - Slide direction matches navigation direction
  - All existing behavioral tests pass
  - Demo verified by Peter after web implementation
  _Requirements: 1.1–1.4, 2.1–2.4_

  - [x] 3.1 Web: Fix layout twitch with scale-based sizing
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Add `sizing` to Node-Base `observedAttributes` (optional, values: `"scale"` or absent)
    - Update Node-Base schema (`Progress-Indicator-Node-Base.schema.yaml`)
    - Add `:host([sizing="scale"]) .node` CSS rules: fixed layout box at current-state size, `transform: scale()` for inactive, `scale(1.0)` for current
    - Transition on `transform` and `background-color` (scoped to `sizing="scale"` only)
    - Default behavior (no `sizing` attr) unchanged — steppers unaffected
    - Pagination-Base `_render()`: add `node.setAttribute('sizing', 'scale')`
    - Evaluate visual gap spacing — may be acceptable, flag if not
    - Update `VisualStates.test.ts` transition assertion
    - _Requirements: 1.1–1.4_

  - [ ] 3.2 Web: Add scroll slide animation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    **Gate**: Peter verifies web demo after this task — must approve feel before native work
    - Track previous `window.start` in Pagination-Base `_render()`
    - On window shift, apply initial `translateX` offset to each node, then remove on next frame
    - Slide left on forward navigation, right on backward
    - Compose with scale: `transform: translateX(Xpx) scale(S)`
    - Respect reduced motion: skip translateX when `prefers-reduced-motion: reduce` is active
    - _Requirements: 2.1–2.4, 5.1–5.5_

  - [ ] 3.3 iOS: Apply scale + slide fixes
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Verify if SwiftUI already handles layout twitch (may not need fix)
    - Add positional slide animation if not present
    - _Requirements: 1.1–1.4, 2.1–2.4_

  - [ ] 3.4 Android: Apply scale + slide fixes
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Switch from `animateDpAsState` (size) to `graphicsLayer { scaleX/scaleY }` with `animateFloatAsState`
    - Add positional slide via `graphicsLayer { translationX }` or `Modifier.offset`
    - _Requirements: 1.1–1.4, 2.1–2.4_

  - [ ] 3.5 Rebuild bundle and final verification
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (rebuild) → Thurgood (behavioral audit)
    - Rebuild browser bundle
    - Run full test suite
    - Verify demo on all three platforms
    - _Requirements: 1.1–1.4, 2.1–2.4, 5.1–5.5_

---

## Domain Review Recommendations

After formalization, recommend domain review:
- **Ada**: Token pipeline fix implementation (1.2, 1.3), motion token semantic correctness, scale token question (Task 3)
- **Lina**: All animation implementation tasks, DOM refactor approach, platform-specific animation APIs
- **Thurgood**: Contract update review, test audit at validation gate (2.1), final behavioral audit (2.6, 3.5)
