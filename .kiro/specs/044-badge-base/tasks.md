# Implementation Plan: Badge Component Family

**Date**: January 23, 2026
**Spec**: 044 - Badge Component Family
**Status**: Implementation Planning
**Dependencies**: Icon-Base (src/components/core/Icon-Base/README.md), Rosetta Pipeline, Stemma System

---

## Implementation Plan

This implementation plan follows a progressive approach:
1. Token foundation (new tokens required by components)
2. Badge-Label-Base (simplest component, establishes patterns)
3. Badge-Count-Base (builds on patterns, adds shape logic)
4. Badge-Count-Notification (semantic variant with live regions)

---

## Task List

- [x] 1. Token Foundation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - New semantic color tokens defined and validated
  - Component token defined with reasoning
  - Tokens generate correctly for all platforms
  - Release detection triggered
  
  **Primary Artifacts:**
  - `src/tokens/semantic/ColorTokens.ts` (updated)
  - `src/components/core/Badge-Label-Base/tokens.ts`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/044-badge-base/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/044-badge-base/task-1-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Token Foundation"`
  - Verify: Check GitHub for committed changes

  - [x] 1.1 Add semantic color tokens for notification badge
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add `color.badge.background.notification` referencing `pink400`
    - Add `color.badge.text.notification` referencing `white100`
    - Follow industry-standard naming pattern `[semantic token family].[component].[property].[variant]`
    - Add tests verifying primitive references
    - _Requirements: 4.7, 9.1, 9.2, 9.7_

  - [x] 1.2 Create component token for badge max-width
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/components/core/Badge-Label-Base/tokens.ts`
    - Use `defineComponentTokens()` helper
    - Define `badge.label.maxWidth` with value `120px`
    - Include required reasoning explaining token purpose
    - Verify token passes ValidationCoordinator checks
    - _Requirements: 4.8, 9.3, 9.4, 9.5_

---

- [x] 2. Badge-Label-Base Component

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Component renders label with correct typography per size
  - Icon support working via Icon-Base integration
  - Truncation behavior working with component token
  - Component passes all Stemma validators
  - Cross-platform implementations complete
  - Release detection triggered
  
  **Primary Artifacts:**
  - `src/components/core/Badge-Label-Base/`
  - `src/components/core/Badge-Label-Base/README.md`
  - `src/components/core/Badge-Label-Base/platforms/web/BadgeLabelBase.web.ts`
  - `src/components/core/Badge-Label-Base/platforms/ios/BadgeLabelBase.swift`
  - `src/components/core/Badge-Label-Base/platforms/android/BadgeLabelBase.kt`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/044-badge-base/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/044-badge-base/task-2-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 2 Complete: Badge-Label-Base Component"`
  - Verify: Check GitHub for committed changes

  - [x] 2.1 Create component directory structure
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create `src/components/core/Badge-Label-Base/` directory
    - Create `platforms/web/`, `platforms/ios/`, `platforms/android/` subdirectories
    - Create `__tests__/` directory
    - Create placeholder `index.ts` with basic exports
    - _Requirements: 7.1_

  - [x] 2.2 Implement web component
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `BadgeLabelBase.web.ts` as custom element `<badge-label-base>`
    - Implement Shadow DOM with style encapsulation
    - Apply typography tokens based on size prop
    - Apply spacing tokens for padding
    - Apply `radiusSubtle` for border radius
    - Implement icon rendering via Icon-Base
    - Implement truncation with `badge.label.maxWidth` token
    - Add `title` attribute when truncated
    - Ensure non-interactive (no tabindex, no click handlers)
    - _Requirements: 1.1-1.10, 4.1, 4.2, 4.4, 4.5, 4.6, 4.8, 5.1_

  - [x] 2.3 Implement iOS component
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `BadgeLabelBase.swift` as SwiftUI view
    - Apply typography tokens via Swift extensions
    - Apply spacing tokens for padding
    - Apply `radiusSubtle` for corner radius
    - Implement icon rendering via Icon-Base
    - Implement truncation with accessibility label for full text
    - Ensure non-interactive
    - _Requirements: 1.1-1.10, 4.1, 4.2, 4.4, 4.5, 4.6, 4.8, 5.2_

  - [x] 2.4 Implement Android component
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `BadgeLabelBase.kt` as Jetpack Compose composable
    - Apply typography tokens via Kotlin extensions
    - Apply spacing tokens for padding
    - Apply `radiusSubtle` for corner radius
    - Implement icon rendering via Icon-Base
    - Implement truncation with content description for full text
    - Ensure non-interactive
    - _Requirements: 1.1-1.10, 4.1, 4.2, 4.4, 4.5, 4.6, 4.8, 5.3_

  - [x] 2.5 Create schema, behavioral contracts, and README
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `Badge-Label-Base.schema.yaml` following Component-Templates.md "Primitive Base Component Schema" template
    - Create `contracts.yaml` with behavioral contracts (displays_label, non_interactive, supports_icon, supports_truncation, color_contrast, text_scaling)
    - Create `README.md` with component documentation
    - Include Stemma naming convention explanation
    - Document props, usage examples, accessibility notes
    - Reference: `.kiro/steering/Component-Templates.md`
    - _Requirements: 7.8, 7.9_

  - [x] 2.6 Write tests and Stemma validation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `BadgeLabelBase.test.ts` with evergreen tests
    - Test label rendering, size variants, icon support
    - Test truncation behavior with title attribute
    - Test non-interactivity
    - Create `BadgeLabelBase.stemma.test.ts` for validator tests
    - Verify StemmaComponentNamingValidator passes
    - Verify StemmaTokenUsageValidator passes (no hardcoded values)
    - Verify StemmaPropertyAccessibilityValidator passes
    - _Requirements: 7.5, 7.6, 7.7, 8.1-8.10_

---

- [x] 3. Badge-Count-Base Component

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Component renders count with correct typography per size
  - Circular shape for single digits, pill for multi-digit
  - Max truncation working ("99+")
  - showZero behavior correct
  - Component passes all Stemma validators
  - Cross-platform implementations complete
  - Release detection triggered
  
  **Primary Artifacts:**
  - `src/components/core/Badge-Count-Base/`
  - `src/components/core/Badge-Count-Base/README.md`
  - `src/components/core/Badge-Count-Base/platforms/web/BadgeCountBase.web.ts`
  - `src/components/core/Badge-Count-Base/platforms/ios/BadgeCountBase.swift`
  - `src/components/core/Badge-Count-Base/platforms/android/BadgeCountBase.kt`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/044-badge-base/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/044-badge-base/task-3-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 3 Complete: Badge-Count-Base Component"`
  - Verify: Check GitHub for committed changes

  - [x] 3.1 Create component directory structure
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create `src/components/core/Badge-Count-Base/` directory
    - Create `platforms/web/`, `platforms/ios/`, `platforms/android/` subdirectories
    - Create `__tests__/` directory
    - Create placeholder `index.ts` with basic exports
    - _Requirements: 7.1_

  - [x] 3.2 Implement web component
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `BadgeCountBase.web.ts` as custom element `<badge-count-base>`
    - Implement Shadow DOM with style encapsulation
    - Apply typography tokens based on size prop
    - Apply spacing tokens for padding
    - Apply `radiusHalf` for circular/pill shape
    - Implement min-width = line-height for circular single digits
    - Implement max truncation logic ("[max]+")
    - Implement showZero behavior (hide when count=0 and showZero=false)
    - Ensure non-interactive
    - _Requirements: 2.1-2.13, 4.3, 4.4, 5.1_

  - [x] 3.3 Implement iOS component
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `BadgeCountBase.swift` as SwiftUI view
    - Apply typography tokens via Swift extensions
    - Apply spacing tokens for padding
    - Apply `radiusHalf` for circular/pill shape
    - Implement min-width logic for circular single digits
    - Implement max truncation and showZero behavior
    - Ensure non-interactive
    - _Requirements: 2.1-2.13, 4.3, 4.4, 5.2_

  - [x] 3.4 Implement Android component
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `BadgeCountBase.kt` as Jetpack Compose composable
    - Apply typography tokens via Kotlin extensions
    - Apply spacing tokens for padding
    - Apply `radiusHalf` for circular/pill shape
    - Implement min-width logic for circular single digits
    - Implement max truncation and showZero behavior
    - Ensure non-interactive
    - _Requirements: 2.1-2.13, 4.3, 4.4, 5.3_

  - [x] 3.5 Create schema, behavioral contracts, and README
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `Badge-Count-Base.schema.yaml` following Component-Templates.md "Primitive Base Component Schema" template
    - Create `contracts.yaml` with behavioral contracts (displays_count, truncates_at_max, circular_single_digit, pill_multi_digit, non_interactive, color_contrast, text_scaling)
    - Create `README.md` with component documentation
    - Include shape behavior documentation (circular vs pill)
    - Document props, usage examples, accessibility notes
    - Reference: `.kiro/steering/Component-Templates.md`
    - _Requirements: 7.8, 7.9_

  - [x] 3.6 Write tests and Stemma validation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `BadgeCountBase.test.ts` with evergreen tests
    - Test count rendering for single/double/triple digits
    - Test circular vs pill shape behavior
    - Test max truncation ("99+")
    - Test showZero behavior
    - Test non-interactivity
    - Create `BadgeCountBase.stemma.test.ts` for validator tests
    - _Requirements: 7.5, 7.6, 7.7, 8.1-8.10_

---

- [x] 4. Badge-Count-Notification Component

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Component uses notification color tokens
  - Live region announcements working on all platforms
  - Pluralization correct ("1 notification", "5 notifications")
  - announceChanges opt-out working
  - Component passes all Stemma validators
  - Cross-platform implementations complete
  - Release detection triggered
  
  **Primary Artifacts:**
  - `src/components/core/Badge-Count-Notification/`
  - `src/components/core/Badge-Count-Notification/README.md`
  - `src/components/core/Badge-Count-Notification/platforms/web/BadgeCountNotification.web.ts`
  - `src/components/core/Badge-Count-Notification/platforms/ios/BadgeCountNotification.swift`
  - `src/components/core/Badge-Count-Notification/platforms/android/BadgeCountNotification.kt`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/044-badge-base/completion/task-4-parent-completion.md`
  - Summary: `docs/specs/044-badge-base/task-4-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 4 Complete: Badge-Count-Notification Component"`
  - Verify: Check GitHub for committed changes

  - [x] 4.1 Create component directory structure
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create `src/components/core/Badge-Count-Notification/` directory
    - Create `platforms/web/`, `platforms/ios/`, `platforms/android/` subdirectories
    - Create `__tests__/` directory
    - Create placeholder `index.ts` with basic exports
    - _Requirements: 7.4_

  - [x] 4.2 Implement web component with live regions
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `BadgeCountNotification.web.ts` as custom element
    - Inherit/compose with Badge-Count-Base behavior
    - Apply `color.badge.background.notification` and `color.badge.text.notification` tokens
    - Implement `aria-live="polite"` and `aria-atomic="true"`
    - Implement visually hidden announcement text
    - Implement pluralization logic ("1 notification", "5 notifications", "99 or more notifications")
    - Implement `announceChanges` prop with default `true`
    - _Requirements: 3.1-3.10, 4.7, 5.1, 6.3_

  - [x] 4.3 Implement iOS component with accessibility announcements
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `BadgeCountNotification.swift` as SwiftUI view
    - Inherit/compose with Badge-Count-Base behavior
    - Apply notification color tokens via Swift extensions
    - Implement `.accessibilityAddTraits(.updatesFrequently)`
    - Implement `UIAccessibility.post(notification:)` for announcements
    - Implement pluralization and announceChanges prop
    - _Requirements: 3.1-3.10, 4.7, 5.2, 6.3_

  - [x] 4.4 Implement Android component with live regions
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `BadgeCountNotification.kt` as Jetpack Compose composable
    - Inherit/compose with Badge-Count-Base behavior
    - Apply notification color tokens via Kotlin extensions
    - Implement `LiveRegionMode.Polite` in semantics
    - Implement `announceForAccessibility()` for announcements
    - Implement pluralization and announceChanges prop
    - _Requirements: 3.1-3.10, 4.7, 5.3, 6.3_

  - [x] 4.5 Create schema, behavioral contracts, and README
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `Badge-Count-Notification.schema.yaml` following Component-Templates.md "Semantic Variant Component Schema" template
    - Create `contracts.yaml` with behavioral contracts (inherited + notification_semantics, announces_count_changes, pluralized_announcements)
    - Create `README.md` with component documentation
    - Document live region behavior per platform
    - Document announceChanges opt-out use cases
    - Reference: `.kiro/steering/Component-Templates.md`
    - _Requirements: 7.8, 7.9_

  - [x] 4.6 Write tests and Stemma validation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `BadgeCountNotification.test.ts` with evergreen tests
    - Test notification color tokens applied
    - Test live region attributes present (Web)
    - Test announcement text pluralization
    - Test announceChanges opt-out behavior
    - Create `BadgeCountNotification.stemma.test.ts` for validator tests
    - _Requirements: 7.5, 7.6, 7.7, 8.1-8.10_

---

- [x] 5. Browser Entry and Final Integration

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All badge components registered in browser entry
  - Components tree-shakeable
  - Bundle size within limits (<5KB per component)
  - All tests passing
  - Release detection triggered
  
  **Primary Artifacts:**
  - `src/browser-entry.ts` (updated)
  - Final test results
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/044-badge-base/completion/task-5-parent-completion.md`
  - Summary: `docs/specs/044-badge-base/task-5-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 5 Complete: Browser Entry and Final Integration"`
  - Verify: Check GitHub for committed changes

  - [x] 5.1 Register components in browser entry
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Import Badge-Label-Base, Badge-Count-Base, Badge-Count-Notification in `browser-entry.ts`
    - Register custom elements following Stemma naming convention
    - Verify tree-shaking works (unused components not bundled)
    - _Requirements: 5.1, NFR-2_

  - [x] 5.2 Run full test suite and verify bundle size
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run `npm test` to verify all tests pass
    - Verify bundle size for each component (<5KB uncompressed)
    - Verify no layout shifts on render
    - Document any performance observations
    - _Requirements: NFR-1, NFR-2_

---

- [x] 6. Token Documentation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Token-Family-Color.md updated with notification badge tokens
  - New tokens documented with use cases and WCAG compliance
  - Release detection triggered
  
  **Primary Artifacts:**
  - `.kiro/steering/Token-Family-Color.md` (updated)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/044-badge-base/completion/task-6-parent-completion.md`
  - Summary: `docs/specs/044-badge-base/task-6-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 6 Complete: Token Documentation"`
  - Verify: Check GitHub for committed changes

  - [x] 6.1 Update Token-Family-Color.md with notification badge tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add `color.badge.background.notification` to semantic color tokens section
    - Add `color.badge.text.notification` to semantic color tokens section
    - Document primitive references (pink400, white100)
    - Document use case (notification badges)
    - Document WCAG compliance (6.33:1 contrast ratio verified)
    - Follow existing documentation patterns in the file
    - _Requirements: 9.1, 9.2, 9.7_

---

- [x] 7. MCP Component Family Documentation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Component-Family-Badge.md created following MCP template
  - Document indexed by MCP server
  - All sections queryable via MCP tools
  - Release detection triggered
  
  **Primary Artifacts:**
  - `.kiro/steering/Component-Family-Badge.md`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/044-badge-base/completion/task-7-parent-completion.md`
  - Summary: `docs/specs/044-badge-base/task-7-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 7 Complete: MCP Component Family Documentation"`
  - Verify: Check GitHub for committed changes

  - [x] 7.1 Create Component-Family-Badge.md
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `.kiro/steering/Component-Family-Badge.md` following Component-MCP-Document-Template.md
    - Include front-matter with `inclusion: manual`
    - Section 1: Family Overview (Badge family, read-only indicators, 🟢 Production Ready)
    - Section 2: Inheritance Structure (Badge-Label-Base, Badge-Count-Base, Badge-Count-Notification hierarchy)
    - Section 3: Behavioral Contracts (all contracts from design.md)
    - Section 4: Component Schemas (props, types, defaults for each component)
    - Section 5: Token Dependencies (typography, spacing, radius, color tokens)
    - Section 6: Usage Guidelines (when to use badges vs tags, primitive vs semantic selection)
    - Section 7: Cross-Platform Notes (Web/iOS/Android implementation details)
    - Section 8: Related Documentation (links to related steering docs)
    - Reference: `.kiro/steering/Component-MCP-Document-Template.md`
    - _Requirements: 7.9_

  - [x] 7.2 Verify MCP indexing
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Run `get_index_health()` to check MCP server status
    - Run `rebuild_index()` if needed
    - Verify document summary via `get_document_summary()`
    - Test section queries for Family Overview, Behavioral Contracts, Component Schemas
    - _Requirements: 7.9_

---

- [x] 8. Component Token Generation Pipeline Fix

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Root Cause (from Task 8.1 audit):**
  Badge-Label-Base was registered with hyphenated name (`'Badge-Label-Base'`) instead of PascalCase (`'BadgeLabelBase'`). This is inconsistent with the established pattern used by all other components (ButtonIcon, VerticalListItem, Avatar). The generator is working correctly — it simply outputs the component name as registered.
  
  **Success Criteria:**
  - Badge-Label-Base token registration uses PascalCase (`'BadgeLabelBase'`)
  - Generated iOS Swift uses PascalCase enum names (e.g., `BadgeLabelBaseTokens`)
  - Generated Android Kotlin uses PascalCase object names (e.g., `BadgeLabelBaseTokens`)
  - iOS/Android badge implementations reference generated component tokens
  - All component tokens regenerate with valid syntax
  - Release detection triggered
  
  **Primary Artifacts:**
  - `src/components/core/Badge-Label-Base/tokens.ts` (updated - component name fix)
  - `src/components/core/Badge-Label-Base/platforms/ios/BadgeLabelBase.ios.swift` (updated)
  - `src/components/core/Badge-Label-Base/platforms/android/BadgeLabelBase.android.kt` (updated)
  - `dist/ComponentTokens.ios.swift` (regenerated)
  - `dist/ComponentTokens.android.kt` (regenerated)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/044-badge-base/completion/task-8-parent-completion.md`
  - Summary: `docs/specs/044-badge-base/task-8-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 8 Complete: Component Token Generation Pipeline Fix"`
  - Verify: Check GitHub for committed changes

  - [x] 8.1 Audit current component token generation
    **Type**: Investigation
    **Validation**: Tier 1 - Minimal
    - Document all components with hyphenated names in ComponentTokenRegistry
    - Identify which generated tokens have invalid identifiers
    - Document the exact lines in TokenFileGenerator.ts causing the issue
    - Create findings document at `.kiro/specs/044-badge-base/completion/task-8-1-completion.md`
    - Review findings with Peter and decide on next course of action — including possible updates remaining subtasks based on findings
    - _Requirements: 9.3, 9.4_

  - [x] 8.2 Fix Badge-Label-Base component token registration
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Root Cause**: Badge-Label-Base was registered with hyphenated name (`'Badge-Label-Base'`) instead of PascalCase (`'BadgeLabelBase'`), breaking the established convention used by all other components (ButtonIcon, VerticalListItem, Avatar).
    - Update `src/components/core/Badge-Label-Base/tokens.ts` to use PascalCase component name
    - Change `component: 'Badge-Label-Base'` to `component: 'BadgeLabelBase'`
    - Update any related tests that reference the old component name
    - Verify token registration uses correct name via ComponentTokenRegistry
    - **Pattern Reference**: See `Button-VerticalList-Item/Button-VerticalList-Item.tokens.ts` which uses `component: 'VerticalListItem'`
    - _Requirements: 9.3, 9.4, 9.5_

  - [x] 8.3 Regenerate component tokens and verify syntax
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run `npx ts-node scripts/generate-platform-tokens.ts` to regenerate
    - Verify `dist/ComponentTokens.ios.swift` has `public enum BadgeLabelBaseTokens` (not `Badge-Label-BaseTokens`)
    - Verify `dist/ComponentTokens.android.kt` has `object BadgeLabelBaseTokens` (not `Badge-Label-BaseTokens`)
    - Confirm all component enum/object names are valid identifiers (no hyphens)
    - _Requirements: 9.3, 9.4, 9.5_

  - [x] 8.4 Update iOS Badge-Label-Base to reference generated token
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update `BadgeLabelBase.ios.swift` to import/reference `BadgeLabelBaseTokens.maxWidth`
    - Remove hardcoded `maxWidth: CGFloat = 120` value
    - Verify component compiles with token reference
    - _Requirements: 4.8, 5.2_

  - [x] 8.5 Update Android Badge-Label-Base to reference generated token
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update `BadgeLabelBase.android.kt` to use a single `BadgeLabelBaseTokens` object
    - The object name should match the generated `ComponentTokens.android.kt` file
    - Include `maxWidth = 120` (matching generated value) plus semantic token references
    - Remove workaround calculation `DesignTokens.space_150 * 10`
    - Reference pattern: See `BadgeLabelBase.ios.swift` (Task 8.4) or `Avatar.swift` for established pattern
    - Verify component compiles with token reference
    - _Requirements: 4.8, 5.3_

  - [x] 8.6 Run tests and verify integration
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run `npm test` to verify all tests pass
    - Verify Stemma validators pass for badge components
    - Document any additional components needing similar updates
    - _Requirements: 7.5, 7.6, 7.7_

---

## Requirements Traceability

| Requirement | Tasks |
|-------------|-------|
| Req 1: Badge-Label-Base | 2.1, 2.2, 2.3, 2.4, 2.5, 2.6 |
| Req 2: Badge-Count-Base | 3.1, 3.2, 3.3, 3.4, 3.5, 3.6 |
| Req 3: Badge-Count-Notification | 4.1, 4.2, 4.3, 4.4, 4.5, 4.6 |
| Req 4: Token Integration | 1.1, 1.2, 2.2, 3.2, 4.2, 8.4, 8.5 |
| Req 5: Cross-Platform Consistency | 2.2-2.4, 3.2-3.4, 4.2-4.4, 5.1, 8.4, 8.5 |
| Req 6: Accessibility Compliance | 2.2-2.6, 3.2-3.6, 4.2-4.6 |
| Req 7: Stemma System Alignment | 2.5, 2.6, 3.5, 3.6, 4.5, 4.6, 7.1, 8.6 |
| Req 8: Test Development Standards | 2.6, 3.6, 4.6, 8.6 |
| Req 9: Rosetta Pipeline Integration | 1.1, 1.2, 6.1, 8.1, 8.2, 8.3 |
| NFR-1: Performance | 5.2 |
| NFR-2: Bundle Size | 5.1, 5.2 |

---

**Organization**: spec-validation
**Scope**: 044-badge-base
