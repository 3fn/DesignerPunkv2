# Implementation Plan: Token Compliance & Motion Build Fix

**Date**: 2026-03-14
**Spec**: 079 — Token Compliance & Motion Build Fix
**Status**: Implementation Planning
**Dependencies**: Spec 049 (EASING category pattern)

---

## Overview

Three issues, ordered by dependency:
1. **Category Migration** — must complete first (enables the filter in Issue 2)
2. **Duplicate Primitive Elimination** — depends on Issue 1
3. **Token Compliance Fixes** — independent of Issues 1-2

## Task List

- [ ] 1. Category Migration & Duplicate Elimination

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive
  **Agent**: Ada

  **Success Criteria:**
  - `DURATION` and `SCALE` categories exist in `TokenCategory` enum
  - All duration and scale tokens use correct categories
  - Browser CSS output has zero duplicate motion token declarations
  - All existing tests pass

  **Primary Artifacts:**
  - `src/types/PrimitiveToken.ts` (modified)
  - `src/tokens/DurationTokens.ts` (modified)
  - `src/tokens/ScaleTokens.ts` (modified)
  - `src/tokens/index.ts` (modified)
  - `src/generators/TokenFileGenerator.ts` (modified)

  **Completion Documentation:**
  - Detailed: `.kiro/specs/079-token-compliance-and-motion-build-fix/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/079-token-compliance-and-motion-build-fix/task-1-summary.md`

  **Post-Completion:**
  - Commit: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Category Migration & Duplicate Elimination"`

  - [ ] 1.1 Add DURATION and SCALE to TokenCategory enum
    **Type**: Implementation
    **Validation**: Tier 1 - Minimal
    **Agent**: Ada
    - Add `DURATION = 'duration'` and `SCALE = 'scale'` to `TokenCategory` in `src/types/PrimitiveToken.ts`
    - _Requirements: 2.1_

  - [ ] 1.2 Migrate duration and scale token categories
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Update `DurationTokens.ts`: change category from `SPACING` to `DURATION`
    - Update `ScaleTokens.ts`: change category from `SPACING` to `SCALE`
    - Update `allTokens` map in `src/tokens/index.ts` to include `DURATION` and `SCALE` entries
    - Remove "Using SPACING temporarily" comments
    - _Requirements: 2.2, 2.3, 2.4, 2.5_

  - [ ] 1.3 Filter motion tokens from primitive pass
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - In `TokenFileGenerator.generateWebTokens()`, add category filter excluding `EASING`, `DURATION`, `SCALE` from primitive loop
    - Rebuild browser bundle and verify no duplicate `--duration-*` declarations in `tokens.css`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 5.2_

- [ ] 2. Avatar-Base Token Compliance

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive
  **Agent**: Ada (component tokens) + Lina (platform file fixes)

  **Success Criteria:**
  - Avatar component tokens defined for all 6 dimension and 6 icon sizes
  - Avatar-Base Android references component tokens instead of hard-coded values
  - Zero Avatar-related TokenCompliance violations
  - All existing tests pass

  **Primary Artifacts:**
  - `src/components/core/Avatar-Base/tokens.ts` (created or modified)
  - `src/components/core/Avatar-Base/platforms/android/Avatar.android.kt` (modified)

  **Completion Documentation:**
  - Detailed: `.kiro/specs/079-token-compliance-and-motion-build-fix/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/079-token-compliance-and-motion-build-fix/task-2-summary.md`

  **Post-Completion:**
  - Commit: `./.kiro/hooks/commit-task.sh "Task 2 Complete: Avatar-Base Token Compliance"`

  - [ ] 2.1 Create avatar component tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Define `avatar.dimension.*` tokens (xs=24, s=32, m=40, l=48, xl=80, xxl=128)
    - Define `avatar.icon.*` tokens (xs=12, s=16, m=20, l=24, xl=40, xxl=64)
    - Use `defineComponentTokens()` pattern with reasoning documenting the 0.5× ratio
    - _Requirements: 3.2_

  - [ ] 2.2 Fix Avatar-Base Android token references
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Replace hard-coded icon sizes with `DesignTokens.icon_size*` or avatar component token references
    - Replace hard-coded avatar dimensions with avatar component token references
    - Replace hard-coded border widths with border width token references
    - Remove any `.dp` suffix on `DesignTokens.*` references
    - _Requirements: 3.1, 3.3, 3.4, 3.5_

- [ ] 3. Button-VerticalList Token Compliance

  **Type**: Parent
  **Validation**: Tier 2 - Standard
  **Agent**: Lina

  **Success Criteria:**
  - Zero Button-VerticalList-related TokenCompliance violations
  - All existing tests pass

  **Primary Artifacts:**
  - `src/components/core/Button-VerticalList-Item/platforms/android/VerticalListButtonItem.android.kt` (modified)
  - `src/components/core/Button-VerticalList-Set/platforms/ios/ButtonVerticalListSet.ios.swift` (modified)
  - `src/components/core/Button-VerticalList-Set/platforms/android/ButtonVerticalListSet.android.kt` (modified)

  **Completion Documentation:**
  - Detailed: `.kiro/specs/079-token-compliance-and-motion-build-fix/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/079-token-compliance-and-motion-build-fix/task-3-summary.md`

  **Post-Completion:**
  - Commit: `./.kiro/hooks/commit-task.sh "Task 3 Complete: Button-VerticalList Token Compliance"`

  - [ ] 3.1 Fix Button-VerticalList-Item Android violations
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Remove `.dp` from `DesignTokens.radius_100.dp` (double-unitizing)
    - Replace `24.dp` icon size with `DesignTokens.icon_size100`
    - Replace hard-coded spacing in Preview composable with `DesignTokens.space*` references
    - Replace hard-coded `RoundedCornerShape(4.dp)` with token reference
    - _Requirements: 4.1, 4.2, 4.3_

  - [ ] 3.2 Fix Button-VerticalList-Set padding violations
    **Type**: Implementation
    **Validation**: Tier 1 - Minimal
    **Agent**: Lina
    - iOS: Replace `.padding(.bottom, 8)` with spacing token reference
    - Android: Replace `.padding(bottom = 8.dp)` with spacing token reference
    - _Requirements: 4.4_

- [ ] 4. Validation & Verification

  **Type**: Parent
  **Validation**: Tier 2 - Standard
  **Agent**: Thurgood

  **Success Criteria:**
  - TokenCompliance test passes with zero violations
  - Browser CSS has no duplicate motion token declarations
  - Full test suite passes

  **Primary Artifacts:**
  - Test results verification

  **Completion Documentation:**
  - Detailed: `.kiro/specs/079-token-compliance-and-motion-build-fix/completion/task-4-parent-completion.md`
  - Summary: `docs/specs/079-token-compliance-and-motion-build-fix/task-4-summary.md`

  **Post-Completion:**
  - Commit: `./.kiro/hooks/commit-task.sh "Task 4 Complete: Validation & Verification"`

  - [ ] 4.1 Run full validation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Thurgood
    - Run `npm test` — verify zero TokenCompliance failures
    - Run `npm run build:browser` — verify no duplicate `--duration-*` in `tokens.css`
    - Document results
    - _Requirements: 5.1, 5.2_

---

## Dependency Graph

```
Task 1.1 (enum) → Task 1.2 (migration) → Task 1.3 (filter)

Task 2.1 (avatar tokens) → Task 2.2 (avatar fixes)

Task 3.1, 3.2 (VerticalList fixes)     [independent]

Task 1, 2, 3 → Task 4 (validation)
```

Tasks 2 and 3 are independent of Task 1 and of each other. Task 4 runs after all others complete.
