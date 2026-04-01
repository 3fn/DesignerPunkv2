# Implementation Plan: Nav-Header-Base Component

**Date**: 2026-03-31
**Spec**: 088 - Top Bar Component
**Status**: Implementation
**Dependencies**: Spec 089 (complete)

---

## Task List

- [x] 1. Nav-Header-Base Primitive

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive

  **Success Criteria:**
  - Primitive handles safe area, background, layout, landmark semantics across all 3 platforms
  - Opaque and translucent appearance modes working
  - Bottom separator renders with correct tokens
  - Focus order enforced: leading → title → trailing
  - Direct use flagged as warning by composition rules
  - All tests pass

  **Completion Documentation:**
  - Detailed: `.kiro/specs/088-top-bar-component/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/088-top-bar-component/task-1-summary.md`

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Nav-Header-Base Primitive"`

  - [x] 1.1 Scaffold component structure
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    **Agent**: Lina
    - Create directory structure: `src/components/core/Nav-Header-Base/`
    - Create `types.ts` with `NavHeaderBaseProps`, `LeadingAction`, `TrailingAction` type definitions
    - Create `Nav-Header-Base.schema.yaml` with properties, composition, accessibility section
    - Create `tokens.ts` with component token references (color, spacing, border, blur)
    - _Requirements: 1.1, 1.2, 1.3, 1.6, 1.7_

  - [x] 1.1b Author behavioral contracts
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    **Depends on**: Task 1.1
    - Create `contracts.yaml` with landmark, focus order, appearance, separator contracts
    - Reference Contract System Reference for concept catalog and naming conventions
    - _Requirements: 6.1, 6.2_

  - [x] 1.2 Web implementation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Create `platforms/web/NavHeaderBase.web.ts`
    - Implement: `<header role="banner">`, three-region layout, safe area (viewport), opaque/translucent appearance (backdrop-filter for translucent), bottom separator, focus order
    - Verify: renders correctly in browser, landmark semantics correct
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 4.1_

  - [x] 1.3 iOS implementation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (pending Kenya review) (Kenya reviews after completion)
    - Create `platforms/ios/NavHeaderBase.ios.swift`
    - Implement: SwiftUI View, three-region HStack, safe area (status bar), opaque/translucent appearance (system materials: blur050→.systemUltraThinMaterial, blur100→.systemThinMaterial, blur150→.systemMaterial), bottom separator, focus order
    - Verify: renders correctly, safe area integration works
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 4.1, 4.8_

  - [x] 1.4 Android implementation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (pending Data review) (Data reviews after completion)
    - Create `platforms/android/NavHeaderBase.android.kt`
    - Implement: Compose Row, three-region layout, safe area (system bar), opaque appearance (solid background for translucent — blur tokens available but not consumed), bottom separator, focus order
    - Verify: renders correctly, safe area integration works
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.6, 1.7, 1.8, 4.1, 4.10_

  - [x] 1.5 Composition rules and metadata
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Add composition rule flagging direct Nav-Header-Base use as warning
    - Generate `component-meta.yaml` via extraction pipeline (`npm run extract:meta`)
    - Ensure `when_not_to_use` includes "Direct use in product screens — always use a semantic variant"
    - Verify: `validate_assembly` warns on direct use, Application MCP indexes component
    - _Requirements: 1.9, 1.10, 7.3, 7.4, 7.5_

- [ ] 2. Nav-Header-Page Semantic Variant

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive

  **Success Criteria:**
  - Page-level header with title, back/close/trailing actions working on all 3 platforms
  - Close action always at inline-end edge with space.grouped.tight separation
  - Title alignment respects platform defaults with override
  - Collapsible scroll behavior working with safe area protection
  - Reduced motion disables collapsible
  - h1 heading rendered
  - All tests pass

  **Completion Documentation:**
  - Detailed: `.kiro/specs/088-top-bar-component/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/088-top-bar-component/task-2-summary.md`

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 2 Complete: Nav-Header-Page Semantic Variant"`

  - [x] 2.1 Scaffold component structure
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    **Agent**: Lina
    - Create directory structure: `src/components/core/Nav-Header-Page/`
    - Create `types.ts` with `NavHeaderPageProps` (including `scrollContainerRef` for web)
    - Create `Nav-Header-Page.schema.yaml` with inheritance from Nav-Header-Base, properties, composition
    - Create `contracts.yaml` inheriting from Nav-Header-Base, adding: heading semantics (h1), back navigation, close action positioning, scroll behavior, title alignment
    - Create `tokens.ts` with component token references
    - _Requirements: 2.1, 6.1, 6.2, 6.3_

  - [ ] 2.2 Web implementation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Create `platforms/web/NavHeaderPage.web.ts`
    - Implement: composes Nav-Header-Base, h1 title, leading action (back/menu/custom via Button-Icon medium tertiary), trailing actions (Button-Icon medium tertiary with optional Badge-Count-Base), close action at inline-end with space.grouped.tight gap, title alignment (center/leading), collapsible scroll (window default, scrollContainerRef for nested), reduced motion → fixed, title truncation with ellipsis
    - Verify: all interaction states, heading semantics, focus order
    - _Requirements: 2.2–2.13, 4.7, 5.1, 5.2_

  - [ ] 2.3 iOS implementation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (Kenya reviews after completion)
    - Create `platforms/ios/NavHeaderPage.ios.swift`
    - Implement: composes Nav-Header-Base, h1 heading trait, leading action, trailing actions, close action, title alignment (default center), collapsible scroll via preference keys, reduced motion → fixed, safe area protection when hidden, Android-style padding not applied
    - Verify: VoiceOver announces heading, back button, safe area correct
    - _Requirements: 2.2–2.13, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2_

  - [ ] 2.4 Android implementation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (Data reviews after completion)
    - Create `platforms/android/NavHeaderPage.android.kt`
    - Implement: composes Nav-Header-Base, heading semantics, leading action, trailing actions, close action, title alignment (default leading), collapsible scroll via NestedScrollConnection, reduced motion → fixed, safe area protection when hidden, space.inset.100 vertical padding
    - Verify: TalkBack announces heading, navigate up, safe area correct
    - _Requirements: 2.2–2.13, 4.2, 4.3, 4.4, 4.6, 5.1, 5.2_

  - [ ] 2.5 Behavioral contract tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    **Depends on**: Tasks 2.2, 2.3, 2.4
    - Write contract tests covering: h1 heading, focus order, close action positioning, back navigation, scroll hide/reveal, reduced motion degradation, title truncation, badge threshold (> 0 only), safe area protection during collapsible
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 3. Nav-Header-App Semantic Variant

  **Type**: Parent
  **Validation**: Tier 2 - Standard (scaffold component)

  **Success Criteria:**
  - App-level header scaffold with permissive slots working on all 3 platforms
  - No heading rendered
  - Inherits safe area, landmark, background from primitive
  - Readiness: scaffold

  **Completion Documentation:**
  - Detailed: `.kiro/specs/088-top-bar-component/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/088-top-bar-component/task-3-summary.md`

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 3 Complete: Nav-Header-App Semantic Variant"`

  - [ ] 3.1 Scaffold and implement all platforms
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Create directory structure: `src/components/core/Nav-Header-App/`
    - Create `types.ts`, `schema.yaml` (inherits Nav-Header-Base), `contracts.yaml` (inherits, adds no-heading contract), `tokens.ts`
    - Create web, iOS, Android implementations — thin wrappers composing Nav-Header-Base with permissive slot passthrough, showSeparator prop
    - Set readiness: `scaffold` for all platforms
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 4.1_

- [ ] 4. Documentation and Integration

  **Type**: Parent
  **Validation**: Tier 2 - Standard

  **Success Criteria:**
  - Navigation family doc updated with all three header components
  - Family guidance YAML updated with selection rules
  - All components queryable via Application MCP
  - Gap report #0 marked resolved

  **Completion Documentation:**
  - Detailed: `.kiro/specs/088-top-bar-component/completion/task-4-parent-completion.md`
  - Summary: `docs/specs/088-top-bar-component/task-4-summary.md`

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 4 Complete: Documentation and Integration"`

  - [ ] 4.1 Update Navigation family documentation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Update `Component-Family-Navigation.md` with Nav-Header-Base, Nav-Header-Page, Nav-Header-App sections including metadata blocks
    - Update `family-guidance/navigation.yaml` with header selection rules
    - Run `npm run extract:meta` to generate metadata for all three components
    - Create READMEs for Nav-Header-Base, Nav-Header-Page, Nav-Header-App
    - Create usage examples for Nav-Header-Page (`examples/BasicUsage.tsx`, `BasicUsage.html`)
    - _Requirements: 7.1, 7.2, 7.3_

  - [ ] 4.2 Verify MCP integration
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Thurgood
    **Depends on**: Task 4.1
    - Verify all three components queryable via Application MCP
    - Verify `find_components({ context: "app-bars" })` returns header components
    - Verify `get_prop_guidance("Navigation")` includes header selection rules
    - Verify Application MCP health: zero warnings
    - Update gap report resolution tracker: #0 → Complete
    - _Requirements: 7.4, 7.5_
