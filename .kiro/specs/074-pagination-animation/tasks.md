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

- [ ] 3. Animation Refinement (Render-All-Dots Realignment)

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  **Pivot Context**: Web implementation pivoted from windowed 7-node buffer to render-all-dots
  with translateX centering mid-task. See `findings/architectural-pivot-render-all-dots.md`.

  **Success Criteria:**
  - Design outline and tasks.md reflect render-all-dots architecture (not buffer model)
  - Behavioral contracts reflect actual rendering behavior per platform
  - Gap token strategy decided and documented
  - Split-timing motion strategy decided (tokens created or experimental properties removed)
  - iOS and Android use native scroll centering (not windowed rendering)
  - All behavioral tests pass across all platforms
  - Token-completeness tests pass (no known suppressions remaining)
  - Demo verified by Peter on all three platforms
  - Scope expansion documented in task completion doc

  **Primary Artifacts:**
  - Updated design outline (`design-outline-task3.md`)
  - Updated `contracts.yaml`
  - iOS platform file (`ProgressPaginationBase.ios.swift`)
  - Android platform file (`ProgressPaginationBase.android.kt`)
  - Component README

  **Completion Documentation:**
  - Detailed: `.kiro/specs/074-pagination-animation/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/074-pagination-animation/task-3-summary.md`

  **Post-Completion:**
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 3 Complete: Animation Refinement (Render-All-Dots)"` (runs release analysis automatically)
  - Verify: Check GitHub for committed changes

  **Completed Subtasks (Pre-Pivot):**

  - [x] 3.1 Web: Scale-based sizing on Node-Base
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - `sizing="scale"` attribute on Node-Base — fixed layout box, transform-based scaling
    - Working across all size variants
    - _Requirements: 1.1–1.4_

  - [x] 3.2 Web: Render-all-dots slide animation (PIVOTED)
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    **Agent**: Lina
    **Note**: Originally scoped as per-node translateX with 7-node buffer. Pivoted to
    render-all-dots with track-level translateX centering. See architectural pivot finding.
    - Render all `totalItems` dots in flex track
    - Fixed-width viewport with `overflow: hidden` + `clip-path`
    - Track-level `translateX` centering, clamped at edges
    - CSS transition on track transform
    - Reduced motion: `transition: none`
    - Peter verified web demo ✅
    - _Requirements: 2.1–2.4, 5.1–5.5_

  **Gate 1 — Decisions (unblocks Gates 2–3):**

  - [x] 3.3 Decision: Gap token strategy
    **Type**: Architecture
    **Validation**: Tier 1 - Minimal
    **Agent**: Peter (decision) → Ada (documentation)
    - Decide Option A (semantic tokens as-is, document stepper-specific scope of `progress.node.gap.*`) or Option B (create `progress.pagination.gap.*` component tokens)
    - See `findings/ada-token-review-render-all-dots.md`, Finding #2
    - If Option A: Ada documents stepper-specific scope (ballot measure)
    - If Option B: Ada creates component tokens, Lina updates CSS references
    - _Requirements: Token governance compliance_

  - [x] 3.4 Decision: Split-timing motion strategy
    **Type**: Architecture
    **Validation**: Tier 1 - Minimal
    **Agent**: Peter (experimentation + decision) → Ada (token creation or property removal)
    - Peter experiments with 250ms scale / 350ms color+slide split in DevTools
    - Path A: Split timing feels right → Ada creates `motion.color.transition.*` semantic tokens
    - Path B: Unified timing is fine → Lina removes experimental `--motion-color-transition-*` properties from Node-Base CSS
    - Resolves 2 token-completeness test failures either way
    - See `findings/ada-token-review-render-all-dots.md`, Finding #4
    - _Requirements: Motion token governance_
    - **Decision**: Path A — `motion.settleTransition` created (350ms/easingDecelerate)
    - **Remaining**: Lina to replace `--motion-color-transition-*` with `--motion-settle-transition-*` in Node-Base CSS, and update track slide in PaginationBase.web.ts to use `--motion-settle-transition-*` (unblocks 3.8)

  **Gate 2 — Source of Truth (unblocks Gate 3):**

  - [x] 3.5 Update design outline for render-all-dots
    **Type**: Documentation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Replace buffer model description with render-all-dots + translateX centering ✅
    - Document centering math, DOM structure, reduced motion behavior ✅
    - Document native platform approach (ScrollViewReader for iOS, ScrollState for Android) ✅
    - This becomes the source of truth for iOS/Android implementation ✅
    - _Requirements: Documentation accuracy_
    - **Completion**: `.kiro/specs/074-pagination-animation/completion/task-3-5-completion.md`

  - [x] 3.6 Update tasks.md descriptions
    **Type**: Documentation
    **Validation**: Tier 1 - Minimal
    **Agent**: Lina
    **Note**: This is the task you're reading — it is now self-referentially accurate.
    - Rewrite completed 3.2 description to reflect what actually happened ✅ (done by Thurgood during reprioritization)
    - Ensure remaining task descriptions match render-all-dots approach ✅ (done by Thurgood during reprioritization)
    - Mark 3.5 complete, update blocker statuses ✅
    - _Requirements: Documentation accuracy_
    - **Completion**: `.kiro/specs/074-pagination-animation/completion/task-3-6-completion.md`

  **Parallel opportunity (Gate 2):** 3.5 and 3.6 are Lina's work. If Ada's
  gap token documentation (from 3.3 Option A) is ready, it can proceed in
  parallel — different files, no overlap.

  **Gate 3 — Contract and Test Alignment (unblocks Gate 4):**

  - [x] 3.7 Update `performance_virtualization` contract
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Thurgood (audit + recommendation) → Lina (contract update)
    **Status**: COMPLETE
    **Unblock Criteria**:
      - Design outline accurately describes render-all-dots for web
      - Design outline describes native scroll centering for iOS/Android
    - Audit current `performance_virtualization` contract against updated design outline
    - Determine if contract should be rewritten, split per-platform, or replaced
    - Lina implements the contract change
    - _Requirements: 4.1, 4.2_

  - [x] 3.8 Annotate or resolve token-completeness test failures
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Thurgood (governance) → Lina (implementation)
    **Status**: COMPLETE
    **Resolution**: Replaced `--motion-color-transition-*` with `--motion-settle-transition-*` in Node-Base CSS. Updated PaginationBase.web.ts track slide to use `--motion-settle-transition-*`. Rebuilt. 2 token-completeness failures resolved. Full suite: 7457 passed, 0 failed.
    - _Requirements: Test suite integrity_

  - [x] 3.9 Behavioral audit of web implementation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Thurgood
    **Status**: UNBLOCKED (3.7 complete)
    - Audit web implementation against all behavioral contracts
    - Flag any contracts needing new assertions
    - Flag any gaps for Lina
    - _Requirements: 4.1, 4.2, 5.4_

  **Parallel opportunity (Gate 3):** 3.8 is independent of 3.7 and 3.9 — it
  depends only on the split-timing decision (3.4), not on the contract update.
  If 3.4 resolves before 3.7, 3.8 can proceed immediately.

  **Gate 4 — Native Platform Implementation:**

  - [x] 3.10 iOS: Native scroll centering
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    **Status**: UNBLOCKED (3.5 complete, 3.7 in progress or pending)
    **Unblock Criteria**:
      - Design outline documents iOS approach (ScrollViewReader + scrollTo)
      - Contracts updated (3.7) or at minimum, contract update is in progress
    - Replace windowed `ForEach` with full dot rendering
    - Use `ScrollViewReader` + `scrollTo(anchor: .center)` for centering
    - Remove `calculateVisibleWindow` calls
    - Respect reduced motion via `UIAccessibility.isReduceMotionEnabled`
    - _Requirements: 1.1–1.4, 2.1–2.4_

  - [x] 3.11 Android: Native scroll centering
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    **Status**: UNBLOCKED (3.5 complete, 3.7 in progress or pending)
    **Unblock Criteria**:
      - Design outline documents Android approach (ScrollState + animateScrollTo)
      - Contracts updated (3.7) or at minimum, contract update is in progress
    - Replace windowed `Row` with full dot rendering
    - Use `ScrollState` + `animateScrollTo()` for centering
    - Remove `calculateVisibleWindow` calls
    - Respect reduced motion via `Settings.Global.ANIMATOR_DURATION_SCALE`
    - _Requirements: 1.1–1.4, 2.1–2.4_

  **Parallel opportunity (Gate 4):** 3.10 and 3.11 are independent of each
  other — different platform files, no shared state. Could be done in parallel
  if context allows.

  **Gate 5 — Cleanup:**

  - [x] 3.12 Remove `calculateVisibleWindow` from types.ts
    **Type**: Implementation
    **Validation**: Tier 1 - Minimal
    **Agent**: Lina
    **Status**: COMPLETE
    - Removed `calculateVisibleWindow` and `PAGINATION_VISIBLE_WINDOW` from types.ts, index.ts
    - Removed 9 associated unit tests from PaginationBase.test.ts
    - _Requirements: Code hygiene_

  - [x] 3.13 Update component README and demo page
    **Type**: Documentation
    **Validation**: Tier 1 - Minimal
    **Agent**: Lina
    **Status**: COMPLETE
    - README fully rewritten for render-all-dots, fixed lg tokens, added animation docs
    - Demo page updated — removed virtualization language, fixed lg token values
    - _Requirements: Documentation accuracy_

  - [x] 3.14 Evaluate `clip-path` 2px magic number
    **Type**: Implementation
    **Validation**: Tier 1 - Minimal
    **Agent**: Lina
    **Status**: COMPLETE
    - 2px is stable across sm/md/lg — fixed safety margin, not proportional
    - Not a token candidate — rendering artifact workaround
    - Added explanatory code comment
    - _Requirements: Code quality_

  **Gate 6 — Final Verification:**

  - [x] 3.15 Rebuild bundle and full verification
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (rebuild) → Thurgood (full behavioral audit) → Peter (demo verification)
    **Status**: BLOCKED
    **Blocker**: All prior gates
    **Unblock Criteria**:
      - All Gate 1–5 tasks complete
      - All decisions resolved
      - All platforms implemented
    - Rebuild browser bundle
    - Run full test suite — zero failures
    - Thurgood: full behavioral audit across all platforms
    - Peter: demo verification on web, iOS, Android
    - _Requirements: 1.1–1.4, 2.1–2.4, 5.1–5.5_

  **Tech Debt (tracked, not gated):**

  - [x] 3.TD Hardcoded JS constants → computed style reading
    **Type**: Architecture
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    **Status**: COMPLETE
    - `getComputedStyle` reads `--progress-node-size-{size}-current`, `--space-grouped-*`, `--space-inset-*`
    - No fallback values — trusts the token pipeline
    - JSDOM limitation accepted: centering math returns NaN in tests, validated in browser
    - _Requirements: Token-code sync integrity_

---

## Domain Review Recommendations

After formalization, recommend domain review:
- **Ada**: Gap token decision follow-through (3.3), split-timing token creation or removal (3.4), token mapping verification (3.TD), clip-path evaluation (3.14)
- **Lina**: Design outline update (3.5), tasks.md update (3.6), contract implementation (3.7), native platforms (3.10, 3.11), cleanup (3.12–3.14), rebuild (3.15)
- **Thurgood**: Contract audit (3.7), test failure annotation (3.8), behavioral audits (3.9, 3.15)
