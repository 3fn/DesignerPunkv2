# Implementation Plan: Pagination Container Styling

**Date**: 2026-03-07
**Spec**: 072 - Pagination Container Styling
**Status**: Implementation Planning
**Dependencies**: Spec 073 (Opacity Architecture Evolution) — ✅ Complete

---

## Task List

- [x] 1. Pagination Container Styling

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Container renders with dark translucent pill background on all 3 platforms
  - Padding and gap use semantic tokens with correct values per size variant
  - No behavioral regressions (existing test suite passes)
  - README and schema updated with all 6 container tokens
  - Visual inspection matches Figma design for all 3 sizes on all 3 platforms

  **Primary Artifacts:**
  - `src/components/core/Progress-Pagination-Base/platforms/web/ProgressPaginationBase.styles.css` (modified)
  - `src/components/core/Progress-Pagination-Base/platforms/ios/ProgressPaginationBase.ios.swift` (modified)
  - `src/components/core/Progress-Pagination-Base/platforms/android/ProgressPaginationBase.android.kt` (modified)

  **Completion Documentation:**
  - Detailed: `.kiro/specs/072-pagination-container-styling/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/072-pagination-container-styling/task-1-summary.md`

  **Post-Completion:**
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Pagination Container Styling"` (runs release analysis automatically)
  - Verify: Check GitHub for committed changes

  - [x] 1.1 Update web CSS
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (component implementation)
    - Add `background`, `border-radius` to `.pagination` base class
    - Collapse `.pagination--sm` and `.pagination--md` into shared rule (same padding and gap)
    - Update `.pagination--lg` with new padding and gap values
    - Remove all CSS custom property fallback values
    - Verify existing behavioral tests pass: `npm test -- PaginationBase.test.ts`
    - _Requirements: 1.3, 2.3, 3.4, 4.4, 4.5_

  - [x] 1.2 Update iOS styling
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (component implementation)
    - Add `.background()`, `.clipShape(Capsule())`, `.padding()` modifiers to container `HStack`
    - Update `PaginationGap.value(for:)` — replace hardcoded values with `DesignTokens` semantic references, collapse to 2 tiers
    - _Requirements: 1.4, 2.4, 3.5, 4.6_

  - [x] 1.3 Update Android styling
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (component implementation)
    - Add `.background()` with scrim color and `RoundedCornerShape(percent = 50)`, `.padding()` to container `Row`
    - Update `paginationGap()` — replace primitive token references with semantic grouped tokens, collapse to 2 tiers
    - _Requirements: 1.5, 2.5, 3.6, 4.7_

  - [x] 1.4 Update README and schema
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (component documentation)
    - Add all 6 container tokens to README Token Dependencies section
    - Add container styling documentation to README (background, pill shape, padding, gap)
    - Add 6 token references to `Progress-Pagination-Base.schema.yaml`
    - _Requirements: 5.1, 5.2, 5.3_

  - [x] 1.5 Delivery validation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (visual verification) → Thurgood (behavioral audit)
    - Visual inspection against Figma screenshots for all 3 sizes on all 3 platforms
    - Verify container background, pill shape, padding, gap per token values
    - Run full behavioral test suite — confirm zero regressions
    - Temporary validation artifacts removed after Peter's sign-off
    - _Requirements: 1.1–1.5, 2.1–2.5, 3.1–3.6, 4.1–4.7_
