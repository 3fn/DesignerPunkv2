# Implementation Plan: Container-Card-Base Component

**Date**: January 20, 2026
**Spec**: 043 - Container-Card-Base
**Status**: Implementation Planning
**Dependencies**: Container-Base (existing component)

---

## Implementation Plan

This spec implements Container-Card-Base as a type primitive component, including enhancements to Container-Base (directional padding, border color) and documentation updates.

---

## Task List

- [x] 1. Container-Base Enhancements

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Container-Base supports `paddingVertical` and `paddingHorizontal` props
  - Container-Base supports `paddingBlockStart`, `paddingBlockEnd`, `paddingInlineStart`, `paddingInlineEnd` props
  - Container-Base supports `borderColor` prop
  - Web implementation uses CSS logical properties (`padding-block`, `padding-inline`, `padding-block-start`, etc.)
  - All platforms handle padding override hierarchy correctly (individual > axis > uniform)
  - Existing Container-Base functionality unchanged
  
  **Primary Artifacts:**
  - `src/components/core/Container-Base/Container-Base.web.ts` (updated)
  - `src/components/core/Container-Base/Container-Base.ios.swift` (updated)
  - `src/components/core/Container-Base/Container-Base.android.kt` (updated)
  - `src/components/core/Container-Base/Container-Base.schema.yaml` (updated)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/043-container-card-base/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/043-container-card-base/task-1-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Container-Base Enhancements"`
  - Verify: Check GitHub for committed changes

  - [x] 1.1 Update Container-Base schema with new props
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Add `paddingVertical` property to schema with same values as `padding`
    - Add `paddingHorizontal` property to schema with same values as `padding`
    - Add `paddingBlockStart` property to schema with same values as `padding`
    - Add `paddingBlockEnd` property to schema with same values as `padding`
    - Add `paddingInlineStart` property to schema with same values as `padding`
    - Add `paddingInlineEnd` property to schema with same values as `padding`
    - Add `borderColor` property to schema with `ColorTokenName` type
    - Document prop behavior (override hierarchy: individual > axis > uniform)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 1.10, 2.1, 2.2, 2.3_

  - [x] 1.2 Implement directional padding in Container-Base (Web)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add `paddingVertical` and `paddingHorizontal` attribute handling
    - Add `paddingBlockStart`, `paddingBlockEnd`, `paddingInlineStart`, `paddingInlineEnd` attribute handling
    - Implement CSS logical properties (`padding-block`, `padding-inline`, `padding-block-start`, etc.)
    - Ensure override hierarchy: individual edges > axis props > uniform padding
    - Add `borderColor` attribute handling
    - Write unit tests for new props including override behavior
    - _Requirements: 1.1-1.10, 2.1, 2.2, 2.3_

  - [x] 1.3 Implement directional padding in Container-Base (iOS)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add `paddingVertical` and `paddingHorizontal` parameters
    - Add `paddingBlockStart`, `paddingBlockEnd`, `paddingInlineStart`, `paddingInlineEnd` parameters
    - Implement EdgeInsets calculation with override hierarchy
    - Add `borderColor` parameter
    - Write unit tests for new props including override behavior
    - _Requirements: 1.1-1.10, 2.1, 2.2, 2.3_

  - [x] 1.4 Implement directional padding in Container-Base (Android)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add `paddingVertical` and `paddingHorizontal` parameters
    - Add `paddingBlockStart`, `paddingBlockEnd`, `paddingInlineStart`, `paddingInlineEnd` parameters
    - Implement Modifier.padding with override hierarchy
    - Add `borderColor` parameter
    - Write unit tests for new props including override behavior
    - _Requirements: 1.1-1.10, 2.1, 2.2, 2.3_

---

- [ ] 2. Container-Card-Base Component Implementation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Container-Card-Base renders with opinionated defaults (zero-config card)
  - Curated prop subset enforced (only card-appropriate values accepted)
  - Interactive behavior works correctly (hover, press, focus, keyboard)
  - ARIA semantics applied correctly based on `role` prop
  - Cross-platform consistency verified
  
  **Primary Artifacts:**
  - `src/components/core/Container-Card-Base/Container-Card-Base.web.ts`
  - `src/components/core/Container-Card-Base/Container-Card-Base.ios.swift`
  - `src/components/core/Container-Card-Base/Container-Card-Base.android.kt`
  - `src/components/core/Container-Card-Base/Container-Card-Base.schema.yaml`
  - `src/components/core/Container-Card-Base/README.md`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/043-container-card-base/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/043-container-card-base/task-2-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 2 Complete: Container-Card-Base Component Implementation"`
  - Verify: Check GitHub for committed changes

  - [ ] 2.1 Create Container-Card-Base directory structure and schema
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create `src/components/core/Container-Card-Base/` directory
    - Create `Container-Card-Base.schema.yaml` with curated prop definitions
    - Create `README.md` with component documentation
    - Document default semantic tokens used:
      - Padding: `space.inset.150` (default)
      - Background: `color.surface.primary` (default)
      - Shadow: `shadow.container` (default)
      - Border radius: `radius.normal` (default)
      - Border color: `color.border.default` (default)
      - Hover feedback: `blend.hoverDarker` (8%)
      - Press feedback: `blend.pressedDarker` (12%)
      - Focus transition: `motion.focusTransition` (150ms ease-out)
    - _Requirements: 3.1-3.14, 4.1-4.7_

  - [ ] 2.2 Implement Container-Card-Base (Web)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create Web Component that composes Container-Base
    - Implement curated prop subset with type constraints
    - Apply opinionated defaults using semantic tokens:
      - `space.inset.150` for default padding
      - `color.surface.primary` for default background
      - `shadow.container` for default shadow
      - `radius.normal` for default border radius
    - Implement interactive behavior using:
      - `blend.hoverDarker` (8%) for hover feedback
      - `blend.pressedDarker` (12%) for press feedback
      - `motion.focusTransition` for state transitions
    - Implement keyboard activation (Enter/Space based on role)
    - Apply ARIA role based on `interactive` and `role` props
    - Write unit tests for all behaviors
    - _Requirements: 3.1-3.14, 4.1-4.7, 5.1-5.10, 6.1-6.5, 7.1-7.6_

  - [ ] 2.3 Implement Container-Card-Base (iOS)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create SwiftUI View that composes ContainerBase
    - Implement curated prop subset with type constraints
    - Apply opinionated defaults using semantic tokens (same as web)
    - Implement interactive behavior (hover: `blend.hoverDarker`, press: `blend.pressedDarker`)
    - Apply accessibility traits based on `interactive` and `role`
    - Write unit tests for all behaviors
    - _Requirements: 3.1-3.14, 4.1-4.7, 5.1-5.10, 6.1-6.5, 7.1-7.6_

  - [ ] 2.4 Implement Container-Card-Base (Android)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create Composable that composes ContainerBase
    - Implement curated prop subset with type constraints
    - Apply opinionated defaults using semantic tokens (same as web)
    - Implement interactive behavior (hover: `blend.hoverDarker`, press: `blend.pressedDarker`)
    - Apply semantics based on `interactive` and `role`
    - Write unit tests for all behaviors
    - _Requirements: 3.1-3.14, 4.1-4.7, 5.1-5.10, 6.1-6.5, 7.1-7.6_

---

- [ ] 3. Documentation Updates

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Component-Family-Container.md includes Container-Card-Base section
  - Props mapping table documents Container-Base to Card-Base relationship
  - Component-Quick-Reference.md includes Container-Card-Base routing
  - Container-Base README documents new props
  - Documentation follows Component MCP Document Template format
  
  **Primary Artifacts:**
  - `.kiro/steering/Component-Family-Container.md` (updated)
  - `.kiro/steering/Component-Quick-Reference.md` (updated)
  - `src/components/core/Container-Base/README.md` (updated)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/043-container-card-base/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/043-container-card-base/task-3-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 3 Complete: Documentation Updates"`
  - Verify: Check GitHub for committed changes

  - [ ] 3.1 Update Component-Family-Container.md
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add Container-Card-Base section following Component MCP Document Template
    - Update component hierarchy diagram to show type primitive layer
    - Add props mapping table (Container-Base → Card-Base)
    - Document curated subset model and rationale
    - Document interactive behavior architecture
    - _Requirements: 8.1, 8.2_

  - [ ] 3.2 Update Component-Quick-Reference.md
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Add Container-Card-Base to component routing table
    - Include type primitive designation
    - Link to Component-Family-Container.md for details
    - _Requirements: 8.3_

  - [ ] 3.3 Update Container-Base README
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Document `paddingVertical` prop with usage examples
    - Document `paddingHorizontal` prop with usage examples
    - Document `paddingBlockStart`, `paddingBlockEnd`, `paddingInlineStart`, `paddingInlineEnd` props with usage examples
    - Document `borderColor` prop with usage examples
    - Add CSS logical properties note for web platform
    - Add logical properties reference table (LTR/RTL effects)
    - Document override hierarchy (individual > axis > uniform)
    - Update prop table with new props
    - _Requirements: 8.4_

---

## Requirements Traceability

| Requirement | Tasks |
|-------------|-------|
| Req 1: Container-Base Directional Padding | 1.1, 1.2, 1.3, 1.4 |
| Req 2: Container-Base Border Color | 1.1, 1.2, 1.3, 1.4 |
| Req 3: Curated Props Subset | 2.1, 2.2, 2.3, 2.4 |
| Req 4: Opinionated Defaults | 2.1, 2.2, 2.3, 2.4 |
| Req 5: Interactive Behavior | 2.2, 2.3, 2.4 |
| Req 6: ARIA Semantics | 2.2, 2.3, 2.4 |
| Req 7: Cross-Platform Consistency | 2.2, 2.3, 2.4 |
| Req 8: Documentation Updates | 3.1, 3.2, 3.3 |

---

## Execution Order

1. **Task 1** (Container-Base Enhancements) — Must complete first; Card-Base depends on new props
2. **Task 2** (Container-Card-Base Implementation) — Depends on Task 1
3. **Task 3** (Documentation Updates) — Can run in parallel with Task 2, but should complete after Task 2 for accurate documentation

---

## Related Documents

- [Requirements](./requirements.md) — Functional and non-functional requirements
- [Design](./design.md) — Architecture and design decisions
- [Design Outline](./design-outline.md) — Initial design exploration
