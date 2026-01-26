# Implementation Plan: Semantic Token Naming Implementation

**Date**: January 24, 2026
**Spec**: 052 - Semantic Token Naming Implementation
**Status**: Implementation Planning
**Dependencies**: Spec 051 (Design Authority) — Complete
**Design Authority**: `.kiro/specs/051-semantic-token-naming-restructure/design-outline.md`

---

## Implementation Plan

This spec executes the semantic color token naming restructure defined in Spec 051. Implementation follows a strict sequence: token definitions → platform generation → component updates → documentation → tests.

**Platforms**: Web (CSS), iOS (Swift), Android (Kotlin)

**Critical Sequencing**: Platform token generation (`npx ts-node scripts/generate-platform-tokens.ts`) must complete before component updates begin.

---

## Task List

### Task 1: Primitive RGBA Migration

- [x] 1. Primitive RGBA Migration

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All ~50 primitive color tokens converted to RGBA format
  - Semantic tokens automatically inherit RGBA format via references
  - No hex color values remain in primitive token definitions
  - Platform generation produces correct RGBA output
  
  **Primary Artifacts:**
  - `src/tokens/ColorTokens.ts` (updated)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/052-semantic-token-naming-implementation/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/052-semantic-token-naming-implementation/task-1-summary.md`
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Primitive RGBA Migration"`
  - Verify: Check GitHub for committed changes

  - [x] 1.1 Convert primitive color tokens to RGBA format
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Open `src/tokens/ColorTokens.ts`
    - Convert all hex values (`#RRGGBB`) to RGBA format (`rgba(R, G, B, 1)`)
    - Preserve token names (only values change)
    - Verify ~50 tokens converted
    - _Requirements: 1.1, 1.2_

  - [x] 1.2 Verify RGBA inheritance in semantic tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Verify semantic tokens reference primitives correctly
    - Confirm RGBA format cascades through token hierarchy
    - Run targeted tests to validate token resolution
    - _Requirements: 1.2_

---

### Task 2: Semantic Concept Token Creation

- [x] 2. Semantic Concept Token Creation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All five semantic concepts implemented (feedback, identity, action, contrast, structure)
  - All tokens from design authority migration mapping created
  - Old token names removed (clean break)
  - Design decision code comments added
  
  **Primary Artifacts:**
  - `src/tokens/semantic/ColorSemanticTokens.ts` (updated)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/052-semantic-token-naming-implementation/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/052-semantic-token-naming-implementation/task-2-summary.md`
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 2 Complete: Semantic Concept Token Creation"`
  - Verify: Check GitHub for committed changes

  - [x] 2.1 Create Feedback concept tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `color.feedback.success.{text|background|border}` tokens
    - Create `color.feedback.error.{text|background|border}` tokens
    - Create `color.feedback.warning.{text|background|border}` tokens
    - Create `color.feedback.info.{text|background|border}` tokens
    - Create `color.feedback.select.{text|background|border}.{rest|default}` tokens
    - Add design note code comment about select→interaction potential migration
    - Remove old tokens: `color.success.*`, `color.error.*`, `color.warning.*`, `color.info.*`, `color.select.*`
    - _Requirements: 2.1, 4.1, 4.2, 9.1_

  - [x] 2.2 Create Identity concept tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `color.identity.human` (orange300)
    - Create `color.identity.agent` (teal200)
    - Remove old tokens: `color.avatar.human`, `color.avatar.agent`
    - _Requirements: 2.2, 4.1, 4.2_

  - [x] 2.3 Create Action concept tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `color.action.primary` (purple300)
    - Create `color.action.secondary` (black400)
    - Remove old token: `color.primary`
    - _Requirements: 2.3, 4.1, 4.2_

  - [x] 2.4 Create Contrast concept tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `color.contrast.onLight` (black500)
    - Create `color.contrast.onDark` (white100)
    - Remove old token: `color.contrast.onPrimary`
    - _Requirements: 2.4, 4.1, 4.2_

  - [x] 2.5 Create Structure concept tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `color.structure.canvas` (white100)
    - Create `color.structure.surface` (white200)
    - Create `color.structure.border` (gray100)
    - Create `color.structure.border.subtle` with baked-in alpha (rgba(gray100, 0.48))
    - Remove old tokens: `color.background`, `color.surface`, `color.border`, `color.canvas`
    - _Requirements: 2.5, 4.1, 4.2_

---

### Task 3: Component Token Migration

- [x] 3. Component Token Migration

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Avatar component tokens follow `{component}.{variant}.{property}` pattern
  - Badge component tokens reordered to `{component}.{variant}.{property}` pattern
  - Component tokens reference semantic tokens correctly
  
  **Primary Artifacts:**
  - `src/tokens/components/AvatarTokens.ts` (updated)
  - `src/tokens/components/BadgeTokens.ts` (updated)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/052-semantic-token-naming-implementation/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/052-semantic-token-naming-implementation/task-3-summary.md`
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 3 Complete: Component Token Migration"`
  - Verify: Check GitHub for committed changes

  - [x] 3.1 Migrate Avatar component tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `color.avatar.human.background` → references `color.identity.human`
    - Create `color.avatar.agent.background` → references `color.identity.agent`
    - Create `color.avatar.human.icon` → references `color.contrast.onDark`
    - Create `color.avatar.agent.icon` → references `color.contrast.onDark`
    - Create `color.avatar.default.border` → references gray100
    - Remove old tokens: `color.avatar.contrast.onHuman`, `color.avatar.contrast.onAgent`, `color.avatar.border`
    - _Requirements: 3.1, 4.1, 4.2_

  - [x] 3.2 Migrate Badge component tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Rename `color.badge.background.notification` → `color.badge.notification.background`
    - Rename `color.badge.text.notification` → `color.badge.notification.text`
    - _Requirements: 3.2, 4.1, 4.2_

---

### Task 4: Platform Token Generation

- [x] 4. Platform Token Generation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Platform generation script runs successfully
  - Web output (`dist/DesignTokens.web.css`) contains new token names in RGBA format
  - iOS output (`dist/DesignTokens.ios.swift`) contains new token names with UIColor format
  - Android output (`dist/DesignTokens.android.kt`) contains new token names with Color.argb format
  - No old token names in any platform output
  
  **Primary Artifacts:**
  - `dist/DesignTokens.web.css`
  - `dist/DesignTokens.ios.swift`
  - `dist/DesignTokens.android.kt`
  - `dist/ComponentTokens.web.css`
  - `dist/ComponentTokens.ios.swift`
  - `dist/ComponentTokens.android.kt`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/052-semantic-token-naming-implementation/completion/task-4-parent-completion.md`
  - Summary: `docs/specs/052-semantic-token-naming-implementation/task-4-summary.md`
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 4 Complete: Platform Token Generation"`
  - Verify: Check GitHub for committed changes

  - [x] 4.1 Update Rosetta generators for RGBA output
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update `src/generators/WebFormatGenerator.ts` for RGBA CSS output
    - Update `src/generators/iOSFormatGenerator.ts` for UIColor RGBA output
    - Update `src/generators/AndroidFormatGenerator.ts` for Color.argb output
    - Verify generators handle baked-in alpha values correctly
    - _Requirements: 1.3, 1.4, 5.4_

  - [x] 4.2 Run platform token generation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Execute: `npx ts-node scripts/generate-platform-tokens.ts`
    - Verify `dist/DesignTokens.web.css` contains new token names
    - Verify `dist/DesignTokens.ios.swift` contains new token names
    - Verify `dist/DesignTokens.android.kt` contains new token names
    - Verify `dist/ComponentTokens.*` files regenerated
    - _Requirements: 5.1, 5.2, 5.3, 5.5_

  - [x] 4.3 Verify platform output formats
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Verify Web: `--color-feedback-success-text: rgba(74, 222, 128, 1);`
    - Verify iOS: `UIColor(red: 0.29, green: 0.87, blue: 0.50, alpha: 1)`
    - Verify Android: `Color.argb(255, 74, 222, 128)`
    - Verify `color.structure.border.subtle` has correct alpha in all platforms
    - _Requirements: 1.3, 5.4_

---

### Task 5: Component Updates (Web)

- [x] 5. Component Updates (Web)

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All 9 web components updated to use new token names
  - No references to old token names in web component CSS
  - No hard-coded color values (except documented exceptions)
  - All web components render correctly
  
  **Primary Artifacts:**
  - `src/components/core/*/[Component].web.css` (multiple files)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/052-semantic-token-naming-implementation/completion/task-5-parent-completion.md`
  - Summary: `docs/specs/052-semantic-token-naming-implementation/task-5-summary.md`
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 5 Complete: Component Updates (Web)"`
  - Verify: Check GitHub for committed changes

  - [x] 5.1 Update Avatar component (Web)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update CSS to use `--color-avatar-human-background`, `--color-avatar-agent-background`
    - Update CSS to use `--color-avatar-human-icon`, `--color-avatar-agent-icon`
    - Update CSS to use `--color-avatar-default-border`
    - Replace `--white-100` primitive with semantic token
    - _Requirements: 6.1_

  - [x] 5.2 Update Button-CTA component (Web)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Replace `--color-primary` with `--color-action-primary`
    - Replace `--color-contrast-on-primary` with `--color-contrast-on-dark`
    - _Requirements: 6.2_

  - [x] 5.3 Update Button-Icon component (Web)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Replace `--color-primary` with `--color-action-primary`
    - Replace `--color-contrast-on-primary` with `--color-contrast-on-dark`
    - _Requirements: 6.3_

  - [x] 5.4 Update Button-VerticalList-Item component (Web)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update visualStateMapping.ts to use `color.feedback.select.*` tokens
    - Replace `--color-select-selected-strong` with `--color-feedback-select-text-rest`
    - Replace `--color-select-selected-subtle` with `--color-feedback-select-background-rest`
    - _Requirements: 6.4_

  - [x] 5.5 Update Button-VerticalList-Set component (Web)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Replace `--color-error-strong` with `--color-feedback-error-text`
    - _Requirements: 6.5_

  - [x] 5.6 Update Container-Base component (Web)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Replace `--color-primary` focus outline with `--accessibility-focus-color`
    - _Requirements: 6.6_

  - [x] 5.7 Update Container-Card-Base component (Web)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Replace `--color-pr us-color`
    - Remove hard-coded `#A855F7` fallback
    - _Requirements: 6.7_

  - [x] 5.8 Update Input-Text-Base component (Web)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Replace `--color-error-strong` with `--color-feedback-error-text`
    - Replace `--color-success-strong` with `--color-feedback-success-text`
    - _Requirements: 6.8_

  - [x] 5.9 Update Badge-Count-Notification component (Web)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Replace `--color-badge-background-notification` with `--color-badge-notification-background`
    - Replace `--color-badge-text-notification` with `--color-badge-notification-text`
    - _Requirements: 6.9_

---

### Task 6: Component Updates (iOS)

- [x] 6. Component Updates (iOS)

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All 9 iOS components updated to use new token names
  - No references to old token names in iOS Swift files
  - No hard-coded color values (except documented exceptions)
  - All iOS components compile and render correctly
  
  **Primary Artifacts:**
  - `src/components/core/*/[Component].ios.swift` (multiple files)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/052-semantic-token-naming-implementation/completion/task-6-parent-completion.md`
  - Summary: `docs/specs/052-semantic-token-naming-implementation/task-6-summary.md`
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 6 Complete: Component Updates (iOS)"`
  - Verify: Check GitHub for committed changes

  - [x] 6.1 Update Avatar component (iOS)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update Swift to use new avatar token names
    - Verify UIColor references resolve correctly
    - _Requirements: 6.1_

  - [x] 6.2 Update Button-CTA component (iOS)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Replace `colorPrimary` with `colorActionPrimary`
    - Replace `colorContrastOnPrimary` with `colorContrastOnDark`
    - _Requirements: 6.2_

  - [x] 6.3 Update Button-Icon component (iOS)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Replace `colorPrimary` with `colorActionPrimary`
    - Replace `colorContrastOnPrimary` with `colorContrastOnDark`
    - _Requirements: 6.3_

  - [x] 6.4 Update Button-VerticalList-Item component (iOS)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update to use `colorFeedbackSelect*` tokens
    - _Requirements: 6.4_

  - [x] 6.5 Update Button-VerticalList-Set component (iOS)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Replace error token with `colorFeedbackErrorText`
    - _Requirements: 6.5_

  - [x] 6.6 Update Container-Base component (iOS)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update focus outline to use accessibility token
    - _Requirements: 6.6_

  - [x] 6.7 Update Container-Card-Base component (iOS)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update focus outline to use accessibility token
    - Remove any hard-coded color fallbacks
    - _Requirements: 6.7_

  - [x] 6.8 Update Input-Text-Base component (iOS)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Replace error/success tokens with feedback concept tokens
    - _Requirements: 6.8_

  - [x] 6.9 Update Badge-Count-Notification component (iOS)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update to use reordered badge token names
    - _Requirements: 6.9_

---

### Task 7: Component Updates (Android)

- [x] 7. Component Updates (Android)

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All 9 Android components updated to use new token names
  - No references to old token names in Android Kotlin files
  - No hard-coded color values (except documented exceptions)
  - All Android components compile and render correctly
  
  **Primary Artifacts:**
  - `src/components/core/*/[Component].android.kt` (multiple files)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/052-semantic-token-naming-implementation/completion/task-7-parent-completion.md`
  - Summary: `docs/specs/052-semantic-token-naming-implementation/task-7-summary.md`
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 7 Complete: Component Updates (Android)"`
  - Verify: Check GitHub for committed changes

  - [x] 7.1 Update Avatar component (Android)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update Kotlin to use new avatar token names
    - Verify Color references resolve correctly
    - _Requirements: 6.1_

  - [x] 7.2 Update Button-CTA component (Android)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Replace `colorPrimary` with `colorActionPrimary`
    - Replace `colorContrastOnPrimary` with `colorContrastOnDark`
    - _Requirements: 6.2_

  - [x] 7.3 Update Button-Icon component (Android)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Replace `colorPrimary` with `colorActionPrimary`
    - Replace `colorContrastOnPrimary` with `colorContrastOnDark`
    - _Requirements: 6.3_

  - [x] 7.4 Update Button-VerticalList-Item component (Android)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update to use `colorFeedbackSelect*` tokens
    - _Requirements: 6.4_

  - [x] 7.5 Update Button-VerticalList-Set component (Android)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Replace error token with `colorFeedbackErrorText`
    - _Requirements: 6.5_

  - [x] 7.6 Update Container-Base component (Android)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update focus outline to use accessibility token
    - _Requirements: 6.6_

  - [x] 7.7 Update Container-Card-Base component (Android)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update focus outline to use accessibility token
    - Remove any hard-coded color fallbacks
    - _Requirements: 6.7_

  - [x] 7.8 Update Input-Text-Base component (Android)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Replace error/success tokens with feedback concept tokens
    - _Requirements: 6.8_

  - [x] 7.9 Update Badge-Count-Notification component (Android)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update to use reordered badge token names
    - _Requirements: 6.9_

---

### Task 8: Documentation Updates

- [x] 8. Documentation Updates

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All steering documentation updated with new token names and concepts
  - Component steering documentation updated
  - MCP documentation server indexes rebuilt
  - No references to old token names in documentation
  
  **Primary Artifacts:**
  - `.kiro/steering/Token-Family-Color.md`
  - `.kiro/steering/Token-Governance.md`
  - `.kiro/steering/Token-Quick-Reference.md`
  - `.kiro/steering/Rosetta-System-Architecture.md`
  - `.kiro/steering/Component-Family-Avatar.md`
  - `.kiro/steering/Component-Family-Button.md`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/052-semantic-token-naming-implementation/completion/task-8-parent-completion.md`
  - Summary: `docs/specs/052-semantic-token-naming-implementation/task-8-summary.md`
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 8 Complete: Documentation Updates"`
  - Verify: Check GitHub for committed changes

  - [x] 8.1 Update Token-Family-Color.md
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Rewrite for concept-based organization (feedback, identity, action, contrast, structure)
    - Document all new token names with values
    - Remove references to old token names
    - Add usage guidance for each concept
    - _Requirements: 7.1_

  - [x] 8.2 Update Token-Governance.md
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update all examples to use new token names
    - Update token selection guidance for concept-first approach
    - _Requirements: 7.1_

  - [x] 8.3 Update Token-Quick-Reference.md
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update with new concept-based organization
    - Update token lookup tables
    - _Requirements: 7.1_

  - [x] 8.4 Update Rosetta-System-Architecture.md
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Document RGBA pipeline changes
    - Update platform output format examples
    - _Requirements: 7.1_

  - [x] 8.5 Update Component-Family-Avatar.md
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update for identity/contrast token usage
    - Document new component token pattern
    - _Requirements: 7.2_

  - [x] 8.6 Update Component-Family-Button.md
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update for action/feedback token usage
    - Document emphasis prop guidance (primary vs secondary)
    - _Requirements: 7.2_

  - [x] 8.7 Rebuild MCP documentation indexes
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Verify MCP server detects file changes
    - Run `get_index_health()` to confirm index status
    - Verify new token names searchable via MCP
    - _Requirements: 7.4_

---

### Task 9: Test Updates

- [x] 9. Test Updates

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All token tests updated and passing
  - All component tests updated and passing
  - Platform output format tests passing
  - No visual regressions on any platform
  - Evergreen tests verify behavior/contracts (not implementation details)
  
  **Primary Artifacts:**
  - `src/__tests__/ColorTokens.test.ts`
  - Component test files
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/052-semantic-token-naming-implementation/completion/task-9-parent-completion.md`
  - Summary: `docs/specs/052-semantic-token-naming-implementation/task-9-summary.md`
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 9 Complete: Test Updates"`
  - Verify: Check GitHub for committed changes

  - [x] 9.1 Update token value tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update `ColorTokens.test.ts` for new token names
    - Verify tokens resolve to correct RGBA values
    - Verify semantic tokens reference correct primitives
    - _Requirements: 8.1, 8.2_

  - [x] 9.1.FIX Update component references from `color.border.subtle` to `color.structure.border.subtle`
    **Type**: Implementation (Bug Fix)
    **Validation**: Tier 2 - Standard
    **Context**: Components were referencing `color.border.subtle` (old naming pattern) which doesn't exist. 
    The token was renamed to `color.structure.border.subtle` per Spec 052 naming restructure but component 
    references were not updated during the migration.
    
    **Files to update:**
    - Container-Base (Web/iOS/Android):
      - `src/components/core/Container-Base/platforms/android/ContainerBase.android.kt`
      - `src/components/core/Container-Base/platforms/android/TokenMapping.kt`
      - `src/components/core/Container-Base/platforms/ios/ContainerBase.ios.swift`
      - `src/components/core/Container-Base/platforms/ios/TokenMapping.swift`
      - `src/components/core/Container-Base/platforms/web/token-mapping.ts`
      - `src/components/core/Container-Base/Container-Base.schema.yaml`
      - `src/components/core/Container-Base/README.md`
      - `src/components/core/Container-Base/__tests__/ContainerBase.test.ts`
    - Container-Card-Base (Web/iOS/Android):
      - `src/components/core/Container-Card-Base/tokens.ts`
      - `src/components/core/Container-Card-Base/Container-Card-Base.schema.yaml`
      - `src/components/core/Container-Card-Base/README.md`
      - `src/components/core/Container-Card-Base/__tests__/ContainerCardBase.test.ts`
      - `src/components/core/Container-Card-Base/platforms/android/ContainerCardBase.android.kt`
      - `src/components/core/Container-Card-Base/platforms/ios/ContainerCardBase.ios.swift`
    
    **Change pattern:** `color.border.subtle` → `color.structure.border.subtle`
    
    _Requirements: 2.5, 6.6, 6.7_

  - [x] 9.2 Update platform output tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test Web output format: `rgba(r, g, b, a)`
    - Test iOS output format: `UIColor(red:green:blue:alpha:)`
    - Test Android output format: `Color.argb()`
    - Verify alpha channel preservation
    - _Requirements: 8.3_

  - [x] 9.3 Update component tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update component tests to verify behavior (not token names)
    - Ensure tests survive future refactoring
    - Remove any tests checking specific token names used internally
    - _Requirements: 8.2, 8.4_

  - [x] 9.4 Run full test suite
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Execute: `npm test`
    - Verify all tests pass
    - Document any platform-specific issues encountered
    - _Requirements: 8.4_

  - [x] 9.4.FIX.1 Update `color.structure.border.subtle` to use opacity composition
    **Type**: Implementation (Architecture Fix)
    **Validation**: Tier 2 - Standard
    **Context**: The `color.structure.border.subtle` token currently uses a baked-in RGBA value 
    (`rgba(184, 182, 200, 0.48)`) which breaks the semantic→primitive reference pattern. This should 
    use opacity composition: `gray100` color + `opacity600` (0.48) to align with the mathematical 
    token foundation.
    
    **Changes:**
    - Update `src/tokens/semantic/ColorTokens.ts`:
      - Change `primitiveReferences: { value: 'rgba(184, 182, 200, 0.48)' }`
      - To: `primitiveReferences: { color: 'gray100', opacity: 'opacity600' }`
    - Add code comment explaining the composition pattern
    
    _Requirements: 1.4, 2.5_

  - [x] 9.4.FIX.2 Update validation tests to recognize opacity composition references
    **Type**: Implementation (Test Fix)
    **Validation**: Tier 2 - Standard
    **Context**: The `ValidatePrimitiveReferences.test.ts` currently expects all `primitiveReferences` 
    to be single primitive token names. It needs to recognize composite references (color + opacity).
    
    **Changes:**
    - Update `src/tokens/semantic/__tests__/ValidatePrimitiveReferences.test.ts`:
      - Add logic to validate composite references where `color` and `opacity` keys exist
      - Validate both the color primitive and opacity primitive exist
    - Update `src/tokens/semantic/__tests__/ColorTokens.test.ts`:
      - Update token count expectations (50 tokens)
      - Update structure token count (4 tokens including border.subtle)
      - Update primitive reference validation to handle composition
    
    _Requirements: 8.1, 8.2_

  - [x] 9.4.FIX.3 Update generators to resolve opacity composition to RGBA output
    **Type**: Implementation (Generator Fix)
    **Validation**: Tier 2 - Standard
    **Context**: Platform generators need to resolve composite color+opacity references to 
    platform-specific RGBA output.
    
    **Changes:**
    - Update `src/providers/WebFormatGenerator.ts`:
      - Detect composite references (has `color` and `opacity` keys)
      - Resolve color primitive to RGB values
      - Resolve opacity primitive to alpha value
      - Output: `rgba(r, g, b, alpha)`
    - Update `src/providers/iOSFormatGenerator.ts`:
      - Output: `UIColor(red: r/255, green: g/255, blue: b/255, alpha: alpha)`
    - Update `src/providers/AndroidFormatGenerator.ts`:
      - Output: `Color.argb(alpha*255, r, g, b)`
    
    _Requirements: 1.3, 5.4_

  - [x] 9.4.FIX.4 Regenerate platform tokens and verify output
    **Type**: Implementation (Verification)
    **Validation**: Tier 2 - Standard
    **Context**: After generator updates, regenerate platform tokens and verify the 
    `color.structure.border.subtle` token outputs correctly on all platforms.
    
    **Steps:**
    - Run: `npx ts-node scripts/generate-platform-tokens.ts`
    - Verify Web output: `--color-structure-border-subtle: rgba(184, 182, 200, 0.48);`
    - Verify iOS output: `colorStructureBorderSubtle = UIColor(red: 0.72, green: 0.71, blue: 0.78, alpha: 0.48)`
    - Verify Android output: `colorStructureBorderSubtle = Color.argb(122, 184, 182, 200)`
    
    _Requirements: 5.1, 5.2, 5.3_

  - [x] 9.4.FIX.5 Run full test suite and verify all tests pass
    **Type**: Implementation (Verification)
    **Validation**: Tier 2 - Standard
    - Execute: `npm test`
    - Verify all tests pass including:
      - Token count validation (50 tokens)
      - Primitive reference validation (composite references)
      - Platform output format tests
      - BuildOrchestrator tests
    - Document resolution of the opacity composition pattern
    
    _Requirements: 8.4_

---

## Summary

| Task | Type | Subtasks | Platform Scope |
|------|------|----------|----------------|
| 1. Primitive RGBA Migration | Parent | 2 | All (token layer) |
| 2. Semantic Concept Token Creation | Parent | 5 | All (token layer) |
| 3. Component Token Migration | Parent | 2 | All (token layer) |
| 4. Platform Token Generation | Parent | 3 | Web, iOS, Android |
| 5. Component Updates (Web) | Parent | 9 | Web |
| 6. Component Updates (iOS) | Parent | 9 | iOS |
| 7. Component Updates (Android) | Parent | 9 | Android |
| 8. Documentation Updates | Parent | 7 | N/A |
| 9. Test Updates | Parent | 9 (4 + 5 FIX) | All |

**Total**: 9 parent tasks, 55 subtasks (50 original + 5 FIX tasks)

**Critical Path**: Tasks 1-4 must complete before Tasks 5-7 can begin (token generation before component updates).
