# Implementation Plan: Native Implementation Modernization

**Date**: 2026-04-03
**Spec**: 093 - Native Implementation Modernization
**Status**: Implementation
**Agents**: Ada (size900 token), Lina (all fixes), Kenya (iOS review), Data (Android review)

---

## Task List

- [x] 1. Token Creation

  **Type**: Parent
  **Validation**: Tier 1 - Minimal

  **Completion Documentation:**
  - Detailed: `.kiro/specs/093-native-implementation-modernization/completion/task-1-completion.md`

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: size900 Token"`

  - [x] 1.1 Add size900 to SizingTokens.ts
    **Type**: Implementation
    **Validation**: Tier 1 - Minimal
    **Agent**: Ada
    - Add `size900` (base × 9 = 72) to `SizingTokens.ts`
    - Regenerate `dist/` platform token files
    - Verify: formula validation test passes, token present in generated output
    - _Requirements: 2.5_

- [x] 2. iOS Easing Modernization

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive

  **Success Criteria:**
  - All 8 iOS files use semantic motion tokens
  - No `.easeInOut`, `.easeIn`, `.easeOut` in production code (preview blocks excluded)
  - No `.speed()` modifier in any animation
  - All tests pass

  **Completion Documentation:**
  - Detailed: `.kiro/specs/093-native-implementation-modernization/completion/task-2-completion.md`

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 2 Complete: iOS Easing Modernization"`

  - [x] 2.1 Update FormInput family iOS easing (Checkbox-Base, Radio-Base)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (Kenya reviews)
    - `.easeOut` → `MotionButtonPress`, `.easeInOut` → `MotionSelectionTransition`
    - Verify: tests pass
    - _Requirements: 1.1, 1.2_

  - [x] 2.2 Update Chip family iOS easing (Chip-Base, Chip-Filter, Chip-Input)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (Kenya reviews)
    - `.easeInOut` → `MotionButtonPress`
    - Verify: tests pass
    - _Requirements: 1.1, 1.2_

  - [x] 2.3 Update Button-VerticalList-Item iOS easing
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (Kenya reviews)
    - `.easeInOut` → `MotionSelectionTransition`
    - Verify: tests pass
    - _Requirements: 1.1, 1.2_

  - [x] 2.4 Update Progress-Pagination-Base iOS easing
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (Kenya reviews)
    - `.easeInOut` → `MotionSelectionTransition`
    - Verify: tests pass
    - _Requirements: 1.1, 1.2_

  - [x] 2.5 Update Nav-TabBar-Base iOS easing
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (Kenya reviews)
    - `.easeIn`/`.easeOut` → `MotionSelectionTransition`
    - Verify: tests pass
    - _Requirements: 1.1, 1.2_

- [ ] 3. Android Modernization

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive

  **Success Criteria:**
  - Button-CTA config uses Compose types (zero `Int`, zero `.toInt()`)
  - VerticalList-Item uses blend utility, explicit easing, no LocalDesignTokens
  - Checkbox/Radio have explicit easing + reduced motion
  - Progress-Node uses IconBase, no Material Icons import
  - All tests pass

  **Completion Documentation:**
  - Detailed: `.kiro/specs/093-native-implementation-modernization/completion/task-3-completion.md`

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 3 Complete: Android Modernization"`

  - [x] 3.1 Modernize Button-CTA Android config
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (Data reviews)
    **Depends on**: Task 1.1 (size900 must exist)
    - `Int` → `Dp`/`TextUnit`, eliminate `.toInt()` round-trips
    - `minWidth`: `size700` (56), `size900` (72), `size1000` (80)
    - `touchTargetHeight`: `size600` (48), `size700` (56)
    - Verify: tests pass
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 3.2 Modernize Button-VerticalList-Item Android
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (Data reviews)
    - Press overlay → `pressedBlend()`
    - `tween()` → explicit easing
    - Remove `LocalDesignTokens.current` → direct `DesignTokens.*`
    - Verify: tests pass
    - _Requirements: 3.1, 3.2, 3.3_

  - [x] 3.3 Add easing + reduced motion to Checkbox/Radio Android
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (Data reviews)
    - Add explicit easing to `tween()` animations
    - Add reduced motion check
    - Verify: tests pass, reduced motion disables animations
    - _Requirements: 4.1, 4.2_

  - [x] 3.4 Replace Material checkmark in Progress-Node Android
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (Data reviews)
    - `Icons.Filled.Check` → `IconBase("check")`
    - Remove Material Icons import
    - Verify: tests pass, checkmark renders correctly
    - _Requirements: 5.1, 5.2_

- [x] 4. Documentation and Verification

  **Type**: Parent
  **Validation**: Tier 2 - Standard

  **Success Criteria:**
  - Ripple vs blend documented in Button family doc
  - All correctness properties verified
  - All tests pass

  **Completion Documentation:**
  - Detailed: `.kiro/specs/093-native-implementation-modernization/completion/task-4-completion.md`
  - Summary: `docs/specs/093-native-implementation-modernization/task-4-summary.md`

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 4 Complete: Documentation and Verification"`

  - [x] 4.1 Document ripple vs blend design decision
    **Type**: Implementation
    **Validation**: Tier 1 - Minimal
    **Agent**: Lina
    - Add to `Component-Family-Button.md` Cross-Platform Notes
    - _Requirements: 6.1, 6.2_

  - [x] 4.2 Final verification
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Thurgood
    **Depends on**: Tasks 2, 3, 4.1
    - Grep iOS production code (excluding previews) for `.easeInOut`, `.easeIn`, `.easeOut` — zero matches (Property #1)
    - Grep iOS code for `.speed(` — zero matches (Property #2)
    - Grep Button-CTA config for `Int` type declarations — zero matches (Property #3)
    - Grep Button-CTA for `.toInt()` — zero matches (Property #4)
    - Grep VerticalList-Item for `LocalDesignTokens` — zero matches (Property #5)
    - Grep Progress-Node for `Icons.Filled` — zero matches (Property #6)
    - Verify Checkbox/Radio reduced motion behavior (Property #7)
    - Run `npm test` — full suite passes
    - _Requirements: all_
