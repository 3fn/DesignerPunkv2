# Implementation Plan: Primary Action Color Migration & Color Foundation Harmonization

**Date**: 2026-03-12
**Spec**: 076 - Primary Action Color Migration
**Status**: Implementation Planning
**Dependencies**: None

---

## Ada/Lina Review Feedback — Resolved

| # | Feedback | Resolution |
|---|----------|------------|
| A1 | Data/tech reassignment needed | Task 2.5 added |
| A2 | Info feedback WCAG migration needed | Task 2.6 added |
| A3 | DTCG/Figma guard rails needed | Task 1.4 added |
| A4 | Task 2.4 scope too narrow | Expanded with data/tech/info test assertions |
| L1 | Task 3.3 underscoped (3 test-utils files missed) | Task 3.3 expanded with all 5 files |
| L2 | Task 3.1 should note visible behavioral change | Updated with contrast flip note |
| L3 | Task 3.2 is adding consumption, not swapping | Updated with `color: inherit` context |
| L4 | DTCG/Figma gap | Resolved via A3 (Option A guard rails) |

---

## Implementation Plan

4 parent tasks, sequenced:

1. **`wcagValue` Infrastructure** — Extend `primitiveReferences`, update generators
2. **Token Migration** — Migrate primitives and semantic tokens
3. **Component & Test Updates** — Button-CTA/Button-Icon contrast token, test refactoring
4. **Verification & Documentation** — Visual verification, steering doc updates

Task 1 is prerequisite for Task 2. Task 3 depends on Task 2. Task 4 depends on Task 3.

---

## Task List

- [x] 1. `wcagValue` Infrastructure

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - `primitiveReferences` interface supports optional `wcagValue` field
  - All 3 platform generators resolve `wcagValue` for WCAG theme output
  - Tokens without `wcagValue` generate identically to before (backward compatible)
  - Invalid `wcagValue` references produce clear errors
  - DTCG and Figma exporters throw descriptive errors when encountering `wcagValue` tokens
  - All existing tests pass unchanged

  **Primary Artifacts:**
  - `src/tokens/semantic/SemanticColorTokens.ts` (interface change)
  - `src/build/platforms/WebBuilder.ts` (resolution logic)
  - `src/build/platforms/iOSBuilder.ts` (resolution logic)
  - `src/build/platforms/AndroidBuilder.ts` (resolution logic)
  - `src/generators/DTCGFormatGenerator.ts` (guard rail)
  - `src/generators/transformers/FigmaTransformer.ts` (guard rail)

  **Completion Documentation:**
  - Detailed: `.kiro/specs/076-primary-action-color-migration/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/076-primary-action-color-migration/task-1-summary.md`

  **Post-Completion:**
  - Commit: `./.kiro/hooks/commit-task.sh "Task 1 Complete: wcagValue Infrastructure"`
  - Verify: `npm test` — all suites pass

  - [x] 1.1 Extend `primitiveReferences` interface
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    **Agent**: Ada
    - Add optional `wcagValue?: string` to `PrimitiveReferences` interface
    - Verify TypeScript compilation — no existing code breaks
    - _Requirements: 1.1, 1.2, 1.7_

  - [x] 1.2 Update platform generators
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Web: Add `wcagValue` resolution in WCAG theme output path
    - iOS: Add `wcagValue` resolution in WCAG theme output path
    - Android: Add `wcagValue` resolution in WCAG theme output path
    - Verify backward compatibility: tokens without `wcagValue` generate identically
    - _Requirements: 1.3, 1.4, 1.5, 1.6_

  - [x] 1.3 Infrastructure tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Test: token with `wcagValue` resolves correctly per theme on all 3 platforms
    - Test: token without `wcagValue` falls back to `value` (backward compat)
    - Test: invalid `wcagValue` reference produces clear error
    - Verify all existing color generation tests still pass
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

  - [x] 1.4 DTCG/Figma export guard rails
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - `DTCGFormatGenerator.ts`: Add check in semantic color export path — if token has `wcagValue`, throw descriptive error identifying the token and recommending follow-up spec
    - `FigmaTransformer.ts`: Same guard rail
    - Test: export of token with `wcagValue` produces clear error
    - Test: export of tokens without `wcagValue` is unaffected
    - _Requirements: 11.1, 11.2, 11.3_

- [x] 2. Token Migration

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Gray primitives updated to proposed values (5 tokens)
  - `color.action.primary` references cyan300/teal300
  - `color.background.primary.subtle` references cyan100/teal100
  - `color.contrast.onAction` created with black500/white100
  - `color.action.navigation` created with cyan500/teal500
  - `color.action.secondary` references gray400
  - `color.data` references purple300, `color.tech` references purple400
  - `color.feedback.info.*` tokens have `wcagValue` pointing to purple500/purple100
  - All platform outputs regenerated with correct values
  - All existing tests pass (except the 2 component test files with hardcoded hex — addressed in Task 3)

  **Primary Artifacts:**
  - `src/tokens/primitives/ColorPrimitives.ts` (gray values)
  - `src/tokens/semantic/SemanticColorTokens.ts` (action, contrast, navigation tokens)

  **Completion Documentation:**
  - Detailed: `.kiro/specs/076-primary-action-color-migration/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/076-primary-action-color-migration/task-2-summary.md`

  **Post-Completion:**
  - Commit: `./.kiro/hooks/commit-task.sh "Task 2 Complete: Token Migration"`

  - [x] 2.1 Update gray primitive values
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Update gray100–gray500 RGBA values to proposed cool blue-gray
    - Verify luminosity preservation (±1 across scale)
    - Regenerate platform outputs
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [x] 2.2 Migrate semantic action tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - `color.action.primary`: change `value` to `cyan300`, add `wcagValue: 'teal300'`
    - `color.background.primary.subtle`: change `value` to `cyan100`, add `wcagValue: 'teal100'`
    - `color.action.secondary`: change `value` to `gray400`
    - _Requirements: 2.1, 2.2, 5.1_

  - [x] 2.3 Create new semantic tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Create `color.contrast.onAction` with `value: 'black500'`, `wcagValue: 'white100'`
    - Create `color.action.navigation` with `value: 'cyan500'`, `wcagValue: 'teal500'`
    - Verify no naming conflict with Spec 052 (`color.contrast.onPrimary` must remain undefined)
    - _Requirements: 3.1, 3.4, 4.1_

  - [x] 2.4 Token migration tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Test each migrated/new semantic token resolves to correct primitive per theme
    - Test gray primitives output new RGBA values
    - Test `color.contrast.onPrimary` remains undefined (Spec 052 guard)
    - Test `color.data` resolves to purple300 (both themes)
    - Test `color.tech` resolves to purple400 (both themes)
    - Test `color.feedback.info.text` resolves to teal400/purple500 per theme
    - Test `color.feedback.info.background` resolves to teal100/purple100 per theme
    - Test `color.feedback.info.border` resolves to teal400/purple500 per theme
    - _Requirements: 2.1, 2.2, 3.1, 4.1, 5.1, 6.1, 9.1, 9.2, 10.1, 10.2, 10.3_

  - [x] 2.5 Reassign data/tech semantic tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - `color.data`: change `value` to `purple300` (from `cyan300`)
    - `color.tech`: change `value` to `purple400` (from `cyan400`)
    - No `wcagValue` needed — purple serves both themes for data/tech
    - Verify no component consumers are affected (expected: zero)
    - _Requirements: 9.1, 9.2, 9.3_

  - [x] 2.6 Migrate info feedback tokens for WCAG theme
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - `color.feedback.info.text`: retain `value: 'teal400'`, add `wcagValue: 'purple500'`
    - `color.feedback.info.background`: retain `value: 'teal100'`, add `wcagValue: 'purple100'`
    - `color.feedback.info.border`: retain `value: 'teal400'`, add `wcagValue: 'purple500'`
    - Verify WCAG contrast: purple500 on purple100 ≥ 7:1 (expected: 8.32:1 AAA)
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [x] 3. Component & Test Updates

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Button-CTA consumes `color.contrast.onAction` for filled variant text
  - Button-Icon consumes `color.contrast.onAction` for primary variant icon
  - Component tests refactored to verify token consumption, not hardcoded hex
  - Blend math tests unchanged with clarifying comments added
  - All tests pass

  **Primary Artifacts:**
  - `src/components/core/Button-CTA/` (contrast token consumption)
  - `src/components/core/Button-Icon/` (contrast token consumption)
  - `src/components/core/Button-CTA/__tests__/ButtonCTA.test.ts` (refactored)
  - `src/components/core/Button-CTA/platforms/web/__tests__/ButtonCTA.icon-integration.test.ts` (refactored)
  - `src/components/core/Button-CTA/__tests__/test-utils.ts` (refactored)
  - `src/components/core/Button-Icon/__tests__/test-utils.ts` (refactored)
  - `src/components/core/Input-Text-Base/__tests__/test-utils.ts` (refactored)

  **Completion Documentation:**
  - Detailed: `.kiro/specs/076-primary-action-color-migration/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/076-primary-action-color-migration/task-3-summary.md`

  **Post-Completion:**
  - Commit: `./.kiro/hooks/commit-task.sh "Task 3 Complete: Component & Test Updates"`

  - [x] 3.1 Update Button-CTA contrast token consumption
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Switch filled variant text color from `color.contrast.onDark` to `color.contrast.onAction`
    - Switch icon optical balance from `color.contrast.onDark` to `color.contrast.onAction`
    - Note: this is a visible behavioral change — filled button text goes from white (onDark) to dark (onAction/black500) in Standard theme. Correct behavior for cyan background.
    - Verify rendering in both Standard and WCAG themes
    - _Requirements: 3.2_

  - [x] 3.2 Update Button-Icon contrast token consumption
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Add `color.contrast.onAction` consumption for primary variant icon color (currently uses `color: inherit`)
    - Update stemma test reference from `var(--color-contrast-on-dark)` to `var(--color-contrast-on-action)`
    - _Requirements: 3.3_

  - [x] 3.3 Refactor component tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - `ButtonCTA.test.ts`: Replace hardcoded `#A855F7` mock with token consumption assertion
    - `ButtonCTA.icon-integration.test.ts`: Same refactoring
    - `Button-CTA/__tests__/test-utils.ts`: Replace hardcoded `#A855F7` for `--color-action-primary`
    - `Button-Icon/__tests__/test-utils.ts`: Replace hardcoded `#A855F7` for `--color-action-primary` and `--accessibility-focus-color`
    - `Input-Text-Base/__tests__/test-utils.ts`: Replace hardcoded `#A855F7` for `--color-primary` (also update to `--color-action-primary` if still using pre-Spec 052 name)
    - Verify tests pass with new cyan token values
    - _Requirements: 7.1, 7.2, 7.3_

  - [x] 3.4 Add blend math test comments
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    **Agent**: Thurgood
    - Add clarifying comment to each blend math test file: "Input colors are arbitrary — they test pure blend math, not token values"
    - Files: BlendCalculator, ThemeAwareBlendUtilities, CrossPlatformConsistency, ColorSpaceUtils, BlendCompositionParser, ThemeSwitching
    - _Requirements: 7.3, 7.4_

- [x] 4. Verification & Documentation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Blend calculations on cyan visually verified (hover, pressed, disabled)
  - Steering docs updated (Token-Family-Color, Token-Quick-Reference)
  - All tests pass
  - Clean commit on main

  **Primary Artifacts:**
  - `.kiro/steering/Token-Family-Color.md` (updated)
  - `.kiro/steering/Token-Quick-Reference.md` (updated)

  **Completion Documentation:**
  - Detailed: `.kiro/specs/076-primary-action-color-migration/completion/task-4-parent-completion.md`
  - Summary: `docs/specs/076-primary-action-color-migration/task-4-summary.md`

  **Post-Completion:**
  - Commit: `./.kiro/hooks/commit-task.sh "Task 4 Complete: Verification & Documentation"`

  - [x] 4.1 Visual verification of blend calculations
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada + Peter
    - Generate blend outputs for cyan300: hover (8% darker), pressed (12% darker), disabled (12% desaturated)
    - Visual inspection — confirm blended states look correct
    - Document findings (acceptable / needs adjustment)
    - _Requirements: 2.4_

  - [x] 4.2 Steering doc updates
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Update Token-Family-Color with action color hierarchy (primary, navigation, secondary) and `wcagValue` mechanism
    - Update Token-Quick-Reference with new primitive and semantic token values
    - Ballot measures required for all changes
    - _Requirements: 8.1, 8.2, 8.3_

---

## Dependency Graph

```
Task 1 (wcagValue Infrastructure)
    ↓
Task 2 (Token Migration)
    ↓
Task 3 (Component & Test Updates)
    ↓
Task 4 (Verification & Documentation)
```

Strictly sequential — each task depends on the previous.
