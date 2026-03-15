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

- [x] 1. Category Migration, Duplicate Elimination & Generator Fix

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive
  **Agent**: Ada

  **Success Criteria:**
  - `DURATION` and `SCALE` categories exist in `TokenCategory` enum
  - All duration and scale tokens use correct categories
  - Browser CSS output has zero duplicate motion token declarations
  - Android generator outputs `Dp` for all dimensional token families
  - All existing tests pass

  **Primary Artifacts:**
  - `src/types/PrimitiveToken.ts` (modified)
  - `src/tokens/DurationTokens.ts` (modified)
  - `src/tokens/ScaleTokens.ts` (modified)
  - `src/tokens/index.ts` (modified)
  - `src/generators/TokenFileGenerator.ts` (modified)
  - `src/providers/AndroidFormatGenerator.ts` (modified)

  **Completion Documentation:**
  - Detailed: `.kiro/specs/079-token-compliance-and-motion-build-fix/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/079-token-compliance-and-motion-build-fix/task-1-summary.md`

  **Post-Completion:**
  - Commit: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Category Migration, Duplicate Elimination & Generator Fix"`

  - [x] 1.1 Add DURATION and SCALE to TokenCategory enum
    **Type**: Implementation
    **Validation**: Tier 1 - Minimal
    **Agent**: Ada
    - Add `DURATION = 'duration'` and `SCALE = 'scale'` to `TokenCategory` in `src/types/PrimitiveToken.ts`
    - _Requirements: 2.1_

  - [x] 1.2 Migrate duration and scale token categories
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Update `DurationTokens.ts`: change category from `SPACING` to `DURATION`
    - Update `ScaleTokens.ts`: change category from `SPACING` to `SCALE`
    - Update `allTokens` map in `src/tokens/index.ts` to include `DURATION` and `SCALE` entries
    - Remove "Using SPACING temporarily" comments
    - _Requirements: 2.2, 2.3, 2.4, 2.5_

  - [x] 1.3 Filter motion tokens from primitive pass
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - In `TokenFileGenerator.generateWebTokens()`, add category filter excluding `EASING`, `DURATION`, `SCALE` from primitive loop
    - Rebuild browser bundle and verify no duplicate `--duration-*` declarations in `tokens.css`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 5.2_

  - [x] 1.4 Fix Android generator type inconsistency
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Update `AndroidBuilder` to output `Dp` for spacing, radius, and tap area families (matching existing icon/elevation pattern)
    - Regenerate `dist/android/DesignTokens.android.kt`
    - Verify: spacing/radius/tap area tokens now output as `val X: Dp = N.dp` instead of `const val X: Float = Nf`
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

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

  - [x] 2.1 Create avatar component tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Define `avatar.dimension.*` tokens (xs=24, s=32, m=40, l=48, xl=80, xxl=128)
    - Define `avatar.icon.xs` = 12dp and `avatar.icon.xxl` = 64dp (only 2 gaps — S through XL map to existing icon tokens)
    - Use `defineComponentTokens()` pattern with reasoning documenting the 0.5× icon-to-dimension ratio
    - _Requirements: 3.2_

  - [ ] 2.2 Fix Avatar-Base Android token references
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Replace hard-coded icon sizes: S→`icon.size050`, M→`icon.size075`, L→`icon.size100`, XL→`icon.size500`, XS/XXL→avatar component tokens
    - Replace hard-coded avatar dimensions with avatar component token references
    - Replace hard-coded border widths with border width token references
    - Remove `.dp` suffix on token references (after Task 1.4 generator fix)
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
    - Replace `24.dp` icon size with `DesignTokens.icon_size_100` (already `Dp` type — no suffix needed)
    - Replace `RoundedCornerShape(4.dp)` in `PlaceholderIcon` with token reference (production code)
    - Remove `.dp` from 4 spacing/radius token references (after Task 1.4 generator fix)
    - Leave Preview composable hard-coded values as-is (intentional decoupling)
    - _Requirements: 4.1, 4.2, 4.3, 5.5_

  - [ ] 3.2 Fix Button-VerticalList-Set padding violations
    **Type**: Implementation
    **Validation**: Tier 1 - Minimal
    **Agent**: Lina
    - iOS: Replace `.padding(.bottom, 8)` with `DesignTokens.space100` reference
    - Android: Replace `.padding(bottom = 8.dp)` with `DesignTokens.space_100` reference (no `.dp` after Task 1.4)
    - _Requirements: 4.4, 5.5_

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
    - _Requirements: 6.1, 6.2_

---

## Dependency Graph

```
Task 1.1 (enum) → Task 1.2 (migration) → Task 1.3 (filter)
                                        → Task 1.4 (Android generator)

Task 1.4 (generator) → Task 2.2 (avatar fixes)
Task 1.4 (generator) → Task 3.1 (VerticalList-Item fixes)
Task 1.4 (generator) → Task 3.2 (VerticalList-Set fixes)

Task 2.1 (avatar tokens) → Task 2.2 (avatar fixes)

Task 1, 2, 3 → Task 4 (validation)
```

Tasks 2.1 and 1.1-1.3 are independent. Tasks 2.2, 3.1, and 3.2 depend on Task 1.4 (generator fix) so compliance fixes are done against correct output. Task 4 runs after all others complete.
