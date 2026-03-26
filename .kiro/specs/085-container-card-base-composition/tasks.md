# Implementation Plan: Container-Card-Base Composition Refactor

**Date**: 2026-03-26
**Spec**: 085 - Container-Card-Base Composition Refactor
**Status**: Implementation Planning
**Dependencies**: None

---

## Task List

- [x] 1. Web Platform Composition (Highest Risk)

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Container-Card-Base renders through `<container-base>` in its Shadow DOM
  - All existing Card web tests pass or are deliberately updated with rationale
  - Interactive cards suppress Base's semantic element (`semantic="div"`)
  - Consumer content projects correctly through nested shadow boundaries
  - Demo visual comparison shows identical rendering

  **Primary Artifacts:**
  - `src/components/core/Container-Card-Base/platforms/web/ContainerCardBase.web.ts`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/085-container-card-base-composition/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/085-container-card-base-composition/task-1-summary.md`

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Web Platform Composition"`
  - Verify: Demo comparison, full test suite

  - [x] 1.1 Audit existing web tests for structural assertions
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Thurgood
    - Read all Container-Card-Base web test files
    - Identify tests that assert on shadow DOM hierarchy (element queries, child structure)
    - Identify tests that use `::slotted()` or query projected content
    - Document which tests will break and why
    - _Requirements: 5.1, 5.2_

  - [x] 1.2 Refactor web implementation
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    **Agent**: Lina
    - Replace Card's direct layout rendering with `<container-base>` in Shadow DOM
    - Implement two-track prop forwarding (direct for padding/border/borderRadius/semantic/accessibilityLabel, resolve for background/shadow/borderColor)
    - Set `hoverable: false` on Base (or omit)
    - Omit attributes on Base when Card's value resolves to `'none'`
    - Pass `semantic="div"` to Base when `interactive="true"`
    - Implement interaction wrapper (hover/press/focus/keyboard) on Card's root element
    - Verify nested slot projection (Card slot → Base slot → consumer content)
    - Check `::slotted()` selectors still work or update them
    - _Requirements: 1.1, 1.4, 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 3.4, 3.5, 4.1, 4.2, 4.3_

  - [x] 1.3 Update broken web tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    **Depends on**: Task 1.1 (audit identifies which tests break), Task 1.2 (refactor changes structure)
    - Update tests identified in 1.1 audit with documented rationale for each change
    - Add runtime composition test: query Card's shadow DOM for `<container-base>` element
    - Add accessibility tree test: verify ARIA nesting for interactive and non-interactive cards
    - Run full test suite, verify zero failures
    - _Requirements: 1.5, 1.6, 3.5, 5.1, 5.2, 5.3_

  - [x] 1.4 Demo validation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Build demos (`npm run build:browser`)
    - Visual comparison of `container-card-demo.html` before and after
    - Verify interactive cards (Section 6) hover/press/focus behavior
    - Verify Section 9 (Base vs Card comparison) renders identically
    - Verify slot content renders correctly in all demo sections
    - _Requirements: 2.1, 2.4_

  - [x] 1.5 Leonardo cross-platform review (web)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Leonardo
    - Review web implementation for pattern consistency
    - Verify accessibility tree structure with screen reader (manual check)
    - Confirm the composition pattern is clean enough to generalize
    - _Requirements: 2.1, 3.5_

- [ ] 2. Native Platform Composition

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Container-Card-Base renders through `ContainerBase` on iOS and Android
  - All existing Card native tests pass or are deliberately updated with rationale
  - Interaction modifiers are on the outer wrapper, not on ContainerBase
  - Full test suite passes with zero failures

  **Primary Artifacts:**
  - `src/components/core/Container-Card-Base/platforms/ios/ContainerCardBase.ios.swift`
  - `src/components/core/Container-Card-Base/platforms/android/ContainerCardBase.android.kt`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/085-container-card-base-composition/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/085-container-card-base-composition/task-2-summary.md`

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 2 Complete: Native Platform Composition"`
  - Verify: Full test suite

  - [x] 2.0 Extend Base's native token mappings
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (implementation) + Ada (verification)
    - Add surface variant mappings to iOS `resolveColorToken()`: `color.surface.primary`, `color.surface.secondary`, `color.surface.tertiary`
    - Add surface variant mappings to Android `resolveColorToken()`: `color.surface.primary`, `color.surface.secondary`, `color.surface.tertiary`
    - Add `color.structure.border.subtle` mapping to iOS `resolveColorToken()`
    - Add shadow variant mappings to both platforms as needed
    - Ada verifies resolved values match web platform output
    - Run existing Container-Base tests to confirm no regressions
    - _Requirements: 1.2, 1.3, 1.4_

  - [x] 2.1 Refactor iOS implementation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    **Depends on**: Task 2.0 (Base must handle the token names Card passes)
    - Replace Card's direct layout rendering with `ContainerBase(...)` view
    - Implement two-track prop forwarding (use computed properties for resolved values)
    - Set `hoverable: false` on Base
    - Pass `nil` for props when Card's value resolves to `'none'`
    - Interaction modifiers on outer wrapper, not on ContainerBase
    - Run existing iOS tests
    - _Requirements: 1.2, 1.4, 2.1, 3.1, 3.2, 3.4, 4.1, 4.2, 4.3_

  - [ ] 2.2 Refactor Android implementation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    **Depends on**: Task 2.0 (Base must handle the token names Card passes)
    - Replace Card's direct layout rendering with `ContainerBase()` composable
    - Implement two-track prop forwarding
    - Set `hoverable = false` on Base
    - Pass `null` for props when Card's value resolves to `'none'`
    - Interaction modifiers on outer wrapper, not on ContainerBase
    - Run existing Android tests
    - _Requirements: 1.3, 1.4, 2.1, 3.1, 3.2, 3.4, 4.1, 4.2, 4.3_

  - [ ] 2.3 Leonardo cross-platform review (native)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Leonardo
    - Review iOS and Android implementations for pattern consistency with web
    - Verify interaction wrapper pattern matches across all 3 platforms
    - Verify prop forwarding pattern matches across all 3 platforms
    - _Requirements: 2.1_

- [ ] 3. Cleanup and Compliance

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Composition compliance test passes with zero known-mismatch skips
  - Schema description corrected
  - Application MCP sanity check confirms unchanged resolvedTokens.composed
  - Full test suite passes

  **Primary Artifacts:**
  - `src/__tests__/stemma-system/composition-compliance-validation.test.ts`
  - `src/components/core/Container-Card-Base/Container-Card-Base.schema.yaml`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/085-container-card-base-composition/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/085-container-card-base-composition/task-3-summary.md`

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 3 Complete: Cleanup and Compliance"`
  - Verify: Full test suite, MCP sanity check

  - [ ] 3.1 Remove compliance test known-mismatch skips
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Thurgood
    - Remove Container-Card-Base from `KNOWN_MISMATCHES` in `composition-compliance-validation.test.ts`
    - Verify all 61+ checks pass with zero skips
    - _Requirements: 1.5_

  - [ ] 3.2 Correct schema description
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    **Agent**: Lina
    - Update `Container-Card-Base.schema.yaml` interactive prop description from "sets hoverable: true" to "sets hoverable: false"
    - _Requirements: 2.1_

  - [ ] 3.3 Application MCP sanity check
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Thurgood
    - Query `getComponent("Container-Card-Base")` via Application MCP
    - Verify `resolvedTokens.composed` is unchanged from pre-refactor
    - Document result
    - _Requirements: 5.4_
