# Implementation Plan: Progress-Bar-Base Component

**Date**: 2026-04-03
**Spec**: 090 - Linear Progress Bar
**Status**: Implementation
**Dependencies**: Spec 092 (Sizing Token Family — complete)

---

## Task List

- [x] 1. Progress-Bar-Base Component

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive

  **Success Criteria:**
  - Determinate and indeterminate modes working on all 3 platforms
  - Three size variants rendering at correct token-driven heights
  - Smooth value transition (determinate), pulsing opacity (indeterminate)
  - Reduced motion: instant fill (determinate), static at 0.33 (indeterminate)
  - Value validation throws on out-of-range
  - ARIA progressbar pattern correct, milestone announcements working
  - All tests pass

  **Completion Documentation:**
  - Detailed: `.kiro/specs/090-linear-progress-bar/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/090-linear-progress-bar/task-1-summary.md`

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Progress-Bar-Base Component"`

  - [x] 1.1 Scaffold component structure
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    **Agent**: Lina
    - Create directory structure: `src/components/core/Progress-Bar-Base/`
    - Create `types.ts` with discriminated union props and `INDETERMINATE_STATIC_FILL = 0.33` constant (with rationale comment)
    - Create `Progress-Bar-Base.schema.yaml` with properties, accessibility section
    - Create `tokens.ts` with re-exports of consumed tokens (color, sizing, border, motion)
    - _Requirements: 1.1, 3.1, 3.2, 3.3, 3.4_

  - [x] 1.2 Author behavioral contracts
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    **Depends on**: Task 1.1
    - Create `contracts.yaml` with contracts: progressbar role, track/fill rendering, size variants, value transition, indeterminate animation, reduced motion, value range validation
    - Reference Contract System Reference for concept catalog
    - Flag any new concepts for Thurgood ballot measure
    - _Requirements: 6.1, 6.2, 6.3_

  - [x] 1.3 Web implementation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Create `platforms/web/ProgressBarBase.web.ts`
    - Implement: custom element, track + fill with CSS logical properties (RTL), `role="progressbar"` with ARIA attributes, determinate smooth transition (`duration150`, `easingStandard`), indeterminate pulsing opacity, reduced motion via `prefers-reduced-motion`, size variants via sizing tokens, value validation, milestone announcements
    - Verify: renders correctly, ARIA correct, animations work, reduced motion degrades
    - _Requirements: 1.1–1.5, 2.1–2.5, 3.1–3.5, 4.1–4.3, 4.6, 5.1–5.4_

  - [x] 1.4 iOS implementation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (Kenya reviews after completion)
    - Create `platforms/ios/ProgressBarBase.ios.swift`
    - Implement: SwiftUI View, track + fill with GeometryReader, `.accessibilityValue` with percentage, determinate animation (withAnimation), indeterminate pulsing, reduced motion via `accessibilityReduceMotion`, size variants, value validation, RTL via layout direction
    - Verify: VoiceOver announces correctly, animations work
    - _Requirements: 1.1–1.5, 2.1–2.5, 3.1–3.5, 4.4, 5.1–5.4_

  - [x] 1.5 Android implementation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (Data reviews after completion)
    - Create `platforms/android/ProgressBarBase.android.kt`
    - Implement: Compose Box with track + fill, `semantics { progressBarRangeInfo }`, determinate `animateFloatAsState`, indeterminate `infiniteTransition` for opacity pulse, reduced motion check, size variants, value validation, RTL via `LayoutDirection`
    - Verify: TalkBack announces correctly, animations work
    - _Requirements: 1.1–1.5, 2.1–2.5, 3.1–3.5, 4.5, 5.1–5.4_

  - [x] 1.6 Behavioral contract tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    **Depends on**: Tasks 1.3, 1.4, 1.5
    - Write contract tests covering: progressbar role, track/fill rendering, size variants (4/8/12px), determinate transition, indeterminate pulse, reduced motion degradation, value validation (throws on <0 and >1), milestone announcements, RTL fill direction
    - Use `cleanupDOM()` from shared web component test utils
    - _Requirements: 6.1, 6.2_

- [ ] 2. Documentation and Integration

  **Type**: Parent
  **Validation**: Tier 2 - Standard

  **Success Criteria:**
  - Progress family doc updated with Progress-Bar-Base
  - Family guidance YAML updated with bar vs stepper/pagination selection rules
  - Component queryable via Application MCP
  - Gap report #2 marked resolved

  **Completion Documentation:**
  - Detailed: `.kiro/specs/090-linear-progress-bar/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/090-linear-progress-bar/task-2-summary.md`

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 2 Complete: Documentation and Integration"`

  - [x] 2.1 Update Progress family documentation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Update `Component-Family-Progress.md` with Progress-Bar-Base section including metadata block
    - Update `family-guidance/progress.yaml` with selection rules: bar for continuous, stepper/pagination for discrete
    - Run `npm run extract:meta` to generate component-meta.yaml
    - Create README for Progress-Bar-Base
    - Create usage examples (`examples/BasicUsage.tsx`, `BasicUsage.html`)
    - _Requirements: 7.1, 7.2, 7.3_

  - [ ] 2.2 Verify MCP integration
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Thurgood
    **Depends on**: Task 2.1
    - Verify Progress-Bar-Base queryable via Application MCP
    - Verify `find_components({ purpose: "progress" })` returns Progress-Bar-Base
    - Verify Application MCP health: zero warnings
    - Update gap report resolution tracker: #2 → Complete
    - _Requirements: 7.4, 7.5_
