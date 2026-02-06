# Implementation Plan: Input-Checkbox-Base & Input-Checkbox-Legal

**Date**: February 5, 2026
**Spec**: 046 - Input-Checkbox-Base
**Status**: Implementation Planning
**Dependencies**: 
- Icon-Base component
- Accessibility token family
- Feedback color tokens

---

## Implementation Plan

This spec implements two components across three platforms:
- **Input-Checkbox-Base**: General-purpose checkbox (web, iOS, Android)
- **Input-Checkbox-Legal**: Legal consent checkbox extending Base

**Estimated Effort**: 5 parent tasks

---

## Task List

- [x] 1. Token Foundation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - `inset.075` semantic token created and documented
  - Token follows Rosetta System architecture
  - Platform-specific token generation includes new token
  - Token Quick Reference updated
  
  **Primary Artifacts:**
  - `src/tokens/semantic/SpacingTokens.ts` (updated)
  - Token generation output files
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/046-input-checkbox-base/completion/task-1-completion.md`
  - Summary: `docs/specs/046-input-checkbox-base/task-1-summary.md`
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Token Foundation"`
  - Verify: Check GitHub for committed changes

  - [x] 1.1 Create inset.075 semantic token
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add `inset.075` to `src/tokens/semantic/SpacingTokens.ts`
    - Reference `space075` primitive token
    - Include JSDoc documentation following existing inset patterns
    - Verify mathematical relationship: 0.75 × base (8px) = 6px
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

  - [x] 1.2 Verify platform token generation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run token generation pipeline
    - Verify `inset.075` appears in web CSS output
    - Verify `inset.075` appears in iOS Swift output
    - Verify `inset.075` appears in Android Kotlin output
    - _Requirements: 10.5_

  - [x] 1.3 Update Token Quick Reference
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Add `inset.075` entry to Token-Quick-Reference.md
    - Document use case: compact internal spacing for medium-density components
    - _Requirements: 12.3_

  - [x] 1.4 Refactor Chip-Base to use inset.075
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Optional**: Yes - improves consistency but not blocking
    - Update `src/components/core/Chip-Base/tokens.ts` to reference `inset.075` instead of `space075`
    - Update iOS implementation to use semantic token reference
    - Update Android implementation to use semantic token reference
    - Update documentation/comments to reflect semantic token usage
    - Verify Chip-Base tests still pass
    - _Requirements: 10.6_


---

- [x] 2. Input-Checkbox-Base Web Implementation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - `<input-checkbox-base>` custom element registered and functional
  - All three size variants (sm, md, lg) render correctly
  - All states (unchecked, checked, indeterminate, error) work
  - Form integration (submission, reset) functional
  - Accessibility requirements met (WCAG 2.1 AA)
  - RTL support via CSS logical properties
  
  **Primary Artifacts:**
  - `src/components/core/Input-Checkbox-Base/platforms/web/InputCheckboxBase.web.ts`
  - `src/components/core/Input-Checkbox-Base/types.ts`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/046-input-checkbox-base/completion/task-2-completion.md`
  - Summary: `docs/specs/046-input-checkbox-base/task-2-summary.md`
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 2 Complete: Input-Checkbox-Base Web Implementation"`
  - Verify: Check GitHub for committed changes

  - [x] 2.1 Create component directory structure
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create `src/components/core/Input-Checkbox-Base/` directory
    - Create `platforms/web/` subdirectory
    - Create `types.ts` with TypeScript interfaces from design doc
    - _Requirements: 8.1_

  - [x] 2.2 Implement web component core
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `InputCheckboxBase.web.ts` as custom element
    - Implement Shadow DOM with hidden native checkbox
    - Implement attribute reflection for reactive updates
    - Implement size variants (sm, md, lg) with computed box sizes
    - Implement label alignment (center, top)
    - _Requirements: 8.1, 8.2, 8.4, 2.1-2.9, 3.1-3.4_

  - [x] 2.3 Implement checkbox states
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement unchecked state (transparent background, default border)
    - Implement checked state (filled background, checkmark via Icon-Base)
    - Implement indeterminate state (filled background, minus icon via Icon-Base)
    - Implement error state (error border color)
    - Implement state transition animation using `motion.selectionTransition`
    - _Requirements: 1.1-1.7, 4.1-4.5_

  - [x] 2.4 Implement interaction patterns
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement hover feedback using `blend.hoverDarker`
    - Implement focus ring using `:focus-visible` and accessibility tokens
    - Implement click/tap handling on entire label area
    - Ensure cursor: pointer on hover
    - _Requirements: 7.4, 7.5, 6.5_

  - [x] 2.5 Implement helper text and error messages
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement helper text display below checkbox
    - Implement error message display below helper text
    - Implement `aria-invalid="true"` when error present
    - Implement `aria-describedby` for error and helper text association
    - _Requirements: 5.1-5.6_

  - [x] 2.6 Implement form integration
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Ensure native checkbox value included in form submission
    - Implement form reset behavior (always reset to unchecked)
    - Use CSS logical properties for RTL support
    - _Requirements: 8.5, 8.7, 8.8, 8.3_

  - [x] 2.7 Implement accessibility
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Associate label with checkbox via for/id
    - Ensure screen reader announces state changes
    - Implement keyboard navigation (Tab focus, Space toggle)
    - Ensure minimum 44px touch target
    - _Requirements: 6.1-6.6_

  - [x] 2.8 Write web component tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test custom element registration
    - Test all size variants render correct dimensions
    - Test all states (unchecked, checked, indeterminate, error)
    - Test attribute reactivity
    - Test form submission and reset
    - Test accessibility (ARIA attributes, keyboard navigation)
    - Use Stemma System validators for token compliance
    - _Requirements: 11.1-11.6_


---

- [x] 3. Input-Checkbox-Base Native Implementations

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - iOS SwiftUI implementation functional with all features
  - Android Jetpack Compose implementation functional with all features
  - Platform-specific interactions work (iOS scale, Android ripple)
  - Native RTL support via platform conventions
  - Accessibility requirements met on both platforms
  
  **Primary Artifacts:**
  - `src/components/core/Input-Checkbox-Base/platforms/ios/InputCheckboxBase.ios.swift`
  - `src/components/core/Input-Checkbox-Base/platforms/android/InputCheckboxBase.android.kt`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/046-input-checkbox-base/completion/task-3-completion.md`
  - Summary: `docs/specs/046-input-checkbox-base/task-3-summary.md`
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 3 Complete: Input-Checkbox-Base Native Implementations"`
  - Verify: Check GitHub for committed changes

  - [x] 3.1 Implement iOS SwiftUI component
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `InputCheckboxBase.ios.swift`
    - Implement CheckboxSize enum with computed boxSize from tokens
    - Implement all states (unchecked, checked, indeterminate, error)
    - Implement Icon-Base integration for checkmark/minus icons
    - Implement press feedback using scale096 and motion.buttonPress
    - Implement helper text and error message display
    - Use SwiftUI's native RTL handling (leading/trailing)
    - _Requirements: 1.1-1.7, 2.1-2.9, 4.1-4.5, 7.1, 7.2, 8.4_

  - [x] 3.2 Implement iOS accessibility
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add accessibilityLabel for checkbox
    - Add accessibilityValue for state (checked/unchecked/partially checked)
    - Ensure VoiceOver announces state changes
    - Ensure minimum 44pt touch target
    - _Requirements: 6.1-6.6_

  - [x] 3.3 Implement Android Jetpack Compose component
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `InputCheckboxBase.android.kt`
    - Implement CheckboxSize enum with computed boxSize from tokens
    - Implement all states (unchecked, checked, indeterminate, error)
    - Implement Icon-Base integration for checkmark/minus icons
    - Implement Material ripple effect using blend.pressedDarker
    - Implement helper text and error message display
    - Use Compose's native RTL handling (Arrangement.Start/End)
    - _Requirements: 1.1-1.7, 2.1-2.9, 4.1-4.5, 7.3, 8.5_

  - [x] 3.4 Implement Android accessibility
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add semantics for checkbox role
    - Add stateDescription for state announcements
    - Ensure TalkBack announces state changes
    - Ensure minimum 44dp touch target
    - _Requirements: 6.1-6.6_


---

- [x] 4. Input-Checkbox-Legal Implementation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Input-Checkbox-Legal extends Base correctly on all platforms
  - Fixed sizing (lg box + labelSm typography) enforced
  - Explicit consent enforcement works (pre-check override + console warning)
  - Audit trail (ISO 8601 timestamp, legalTextId, version) functional
  - Required indicator displays by default
  - No indeterminate state support
  
  **Primary Artifacts:**
  - `src/components/core/Input-Checkbox-Legal/platforms/web/InputCheckboxLegal.web.ts`
  - `src/components/core/Input-Checkbox-Legal/platforms/ios/InputCheckboxLegal.ios.swift`
  - `src/components/core/Input-Checkbox-Legal/platforms/android/InputCheckboxLegal.android.kt`
  - `src/components/core/Input-Checkbox-Legal/types.ts`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/046-input-checkbox-base/completion/task-4-completion.md`
  - Summary: `docs/specs/046-input-checkbox-base/task-4-summary.md`
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 4 Complete: Input-Checkbox-Legal Implementation"`
  - Verify: Check GitHub for committed changes

  - [x] 4.1 Create Legal component directory structure
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create `src/components/core/Input-Checkbox-Legal/` directory
    - Create `platforms/web/`, `platforms/ios/`, `platforms/android/` subdirectories
    - Create `types.ts` with TypeScript interfaces extending Base
    - _Requirements: 9.1_

  - [x] 4.2 Implement Legal web component
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `InputCheckboxLegal.web.ts` extending/wrapping Base
    - Enforce fixed sizing (lg box + labelSm typography)
    - Enforce top label alignment
    - Implement explicit consent enforcement (override + console warning)
    - Implement onConsentChange with ISO 8601 timestamp
    - Implement audit trail (legalTextId, legalTextVersion in callback)
    - Implement required indicator (default visible)
    - Disable indeterminate state support
    - Prevent label truncation
    - _Requirements: 9.1-9.11_

  - [x] 4.3 Implement Legal iOS component
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `InputCheckboxLegal.ios.swift` extending/wrapping Base
    - Enforce fixed sizing and top alignment
    - Implement explicit consent enforcement
    - Implement onConsentChange with ISO 8601 timestamp
    - Implement audit trail support
    - Implement required indicator
    - _Requirements: 9.1-9.11_

  - [x] 4.4 Implement Legal Android component
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `InputCheckboxLegal.android.kt` extending/wrapping Base
    - Enforce fixed sizing and top alignment
    - Implement explicit consent enforcement
    - Implement onConsentChange with ISO 8601 timestamp
    - Implement audit trail support
    - Implement required indicator
    - _Requirements: 9.1-9.11_

  - [x] 4.5 Write Legal component tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test explicit consent enforcement (pre-check override + console warning)
    - Test ISO 8601 timestamp format in callback
    - Test audit trail data (legalTextId, version) in callback
    - Test fixed configuration (size, alignment not configurable)
    - Test required indicator default visibility
    - Test indeterminate state rejection
    - _Requirements: 11.7_


---

- [x] 5. Documentation and Integration

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Component READMEs created for both components
  - Component-Quick-Reference.md updated with checkbox family
  - Usage examples created and functional
  - Legal consent best practices documented
  
  **Primary Artifacts:**
  - `src/components/core/Input-Checkbox-Base/README.md`
  - `src/components/core/Input-Checkbox-Legal/README.md`
  - `.kiro/steering/Component-Quick-Reference.md` (updated)
  - `.kiro/steering/Component-Family-Form-Inputs.md` (updated)
  - `dist/browser/checkbox-demo.html`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/046-input-checkbox-base/completion/task-5-completion.md`
  - Summary: `docs/specs/046-input-checkbox-base/task-5-summary.md`
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 5 Complete: Documentation and Integration"`
  - Verify: Check GitHub for committed changes

  - [x] 5.1 Create Input-Checkbox-Base README
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create README following existing component documentation patterns
    - Document props interface and default values
    - Document size variants and their token usage
    - Document states and visual specifications
    - Include usage examples for common scenarios
    - _Requirements: 12.1, 12.4_

  - [x] 5.2 Create Input-Checkbox-Legal README
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create README following existing component documentation patterns
    - Document props interface and default values
    - Document legal consent best practices
    - Document audit trail usage and timestamp format
    - Include usage examples for GDPR/legal scenarios
    - _Requirements: 12.1, 12.5_

  - [x] 5.3 Update Component-Quick-Reference.md and Component-Family-Form-Inputs.md
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Add checkbox family entry to Component-Quick-Reference.md Component Documentation Map
    - Include Input-Checkbox-Base and Input-Checkbox-Legal
    - Document inheritance relationship (Legal extends Base)
    - Update Component-Family-Form-Inputs.md to add checkbox components:
      - Add Input-Checkbox-Base and Input-Checkbox-Legal to inheritance structure
      - Document checkbox behavioral contracts (9 contracts)
      - Add Input-Checkbox-Base schema/properties section
      - Add Input-Checkbox-Legal schema/properties section
      - Add checkbox usage examples and patterns
      - Add checkbox token dependencies
    - _Requirements: 12.2_

  - [x] 5.4 Create checkbox demo page
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Prerequisites**: Browser bundle registration
    - Register Input-Checkbox-Base and Input-Checkbox-Legal in `src/browser-entry.ts`
    - Rebuild browser distribution: `npm run build:browser`
    - Create `dist/browser/checkbox-demo.html` following avatar-demo.html pattern
    - Demo sections to include:
      - Size variants (sm, md, lg) for Input-Checkbox-Base
      - Label alignment (center vs top) comparison
      - States (unchecked, checked, indeterminate, error)
      - Helper text and error message display
      - Interactive hover/focus states
      - Form integration example (submission and reset)
      - Input-Checkbox-Legal with audit trail demonstration
      - Token verification section
      - Usage examples (HTML and JavaScript)
    - Verify demo works when served from local file server
    - _Requirements: 12.4_

---

---

- [ ] 7. Audit & Diagnose Test-Implementation Mismatches

  **Type**: Parent
  **Validation**: Tier 2 - Standard
  
  **Success Criteria:**
  - All 26 test failures documented with root cause analysis
  - Mismatches between design doc, tests, and implementation catalogued
  - Recommended fix approach documented for each category of issue
  - Decision documented: fix implementation vs update design doc
  
  **Primary Artifacts:**
  - `.kiro/specs/046-input-checkbox-base/completion/task-7-completion.md` (audit report)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/046-input-checkbox-base/completion/task-7-completion.md`
  - Summary: `docs/specs/046-input-checkbox-base/task-7-summary.md`
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 7 Complete: Audit & Diagnose Test-Implementation Mismatches"`
  - Verify: Check GitHub for committed changes

  - [x] 7.1 Audit InputCheckboxBase.stemma.test.ts failure
    **Type**: Investigation
    **Validation**: Tier 1 - Minimal
    - Document token naming mismatch: test expects `--color-select-selected-strong`, CSS uses `--color-feedback-select-background-rest`
    - Verify which token name is correct per Rosetta System
    - Document recommended fix (update test or update CSS)
    - _Related: Design doc Token Architecture section_

  - [x] 7.2 Audit token-completeness.property.test.ts failures
    **Type**: Investigation
    **Validation**: Tier 1 - Minimal
    - Document browser bundle token reference issues
    - Identify which tokens are missing or misnamed
    - Verify token generation pipeline output
    - Document recommended fix approach
    - _Related: Task 1 Token Foundation_

  - [x] 7.3 Audit InputCheckboxLegal.test.ts failures (23 tests)
    **Type**: Investigation
    **Validation**: Tier 2 - Standard
    - Document architectural mismatch: tests expect Legal to wrap Base, implementation is standalone
    - Catalogue all selector mismatches (`.checkbox__input` vs actual DOM)
    - Document DOM structure differences between design doc and implementation
    - Identify which approach is better: wrapper pattern vs standalone
    - Document recommended fix approach for each test category:
      - ISO 8601 timestamp tests
      - Audit trail tests
      - Fixed configuration tests
      - Required indicator tests
      - Indeterminate rejection tests
      - Form integration tests
      - Accessibility tests
      - Event tests
    - _Related: Design doc Input-Checkbox-Legal Implementation section_

  - [x] 7.4 Document fix strategy decision
    **Type**: Documentation
    **Validation**: Tier 1 - Minimal
    - Summarize findings from 7.1-7.3
    - Recommend: fix implementation to match design doc OR update design doc to match implementation
    - Document rationale for recommendation
    - Review and discuss how to proceed with Peter
    - Get user approval before proceeding to Task 8


---

- [ ] 8. Architectural Alignment & Test Resolution

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Context**: Task 7 audit revealed that Input-Checkbox-Legal implementation drifted from the design doc's wrapper pattern to a standalone pattern. This task refactors Legal to properly wrap Base per the design doc, fixes token naming issues, and resolves all test failures.
  
  **Success Criteria:**
  - Token naming issues fixed in CSS (deprecated tokens replaced)
  - Badge-Count-Notification tokens added to generation pipeline
  - Input-Checkbox-Base extended to support Legal's typography needs
  - Input-Checkbox-Legal refactored to wrapper pattern per design doc
  - All previously failing tests pass
  - No regressions in other component tests
  - `npm test` passes with 0 failures
  
  **Primary Artifacts:**
  - `src/components/core/Input-Checkbox-Base/platforms/web/InputCheckboxBase.web.ts` (extended)
  - `src/components/core/Input-Checkbox-Base/platforms/web/InputCheckboxBase.web.css` (token fixes)
  - `src/components/core/Input-Checkbox-Legal/platforms/web/InputCheckboxLegal.web.ts` (refactored)
  - `src/components/core/Input-Checkbox-Legal/platforms/web/InputCheckboxLegal.web.css` (token fixes)
  - `scripts/generate-platform-tokens.ts` (badge tokens added)
  - Test files (updated selectors)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/046-input-checkbox-base/completion/task-8-completion.md`
  - Summary: `docs/specs/046-input-checkbox-base/task-8-summary.md`
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 8 Complete: Architectural Alignment & Test Resolution"`
  - Verify: Check GitHub for committed changes

  - [x] 8.1 Fix deprecated token names in CSS
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Rationale**: Token fixes are isolated bugs that exist regardless of architecture. Fixing first gives cleaner baseline.
    - In `InputCheckboxBase.web.css`:
      - Replace `var(--color-contrast-on-primary)` → `var(--color-contrast-on-light)` (icon on light cyan background needs dark color)
      - Replace `var(--color-error-strong)` → `var(--color-feedback-error-border)`
    - In `InputCheckboxLegal.web.css`:
      - Replace `var(--color-contrast-on-primary)` → `var(--color-contrast-on-light)` (icon on light cyan background needs dark color)
      - Replace `var(--color-error-strong)` → `var(--color-feedback-error-border)`
    - Verify CSS still compiles correctly
    - _Requirements: 1.6 (error state), 4.4 (icon color)_

  - [x] 8.2 Fix Badge-Count-Notification token references
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Rationale**: Unrelated to checkbox but blocks token-completeness tests.
    
    **Context**: The `defineComponentTokens()` API only supports numeric values (spacing, sizing), 
    not color tokens. Investigation during this task revealed that color tokens require the semantic 
    token pipeline. New semantic tokens `color.feedback.notification.background` and 
    `color.feedback.notification.text` have been added to resolve this architectural gap.
    
    **Architectural Decision**: See Spec 059 (Component Color Token Architecture Investigation) 
    for documentation of this gap and future considerations.
    
    **Steps**:
    1. **Update `src/components/core/Badge-Count-Notification/tokens.ts`**:
       - Update `BadgeNotificationColorTokens` to reference semantic tokens instead of primitives:
         ```typescript
         export const BadgeNotificationColorTokens = {
           'notification.background': 'color.feedback.notification.background',
           'notification.text': 'color.feedback.notification.text',
         } as const;
         ```
       - Update JSDoc to reflect semantic token references
       - Keep the `BadgeNotificationTokenReferences` documentation object for traceability
    
    2. **Update `src/components/core/Badge-Count-Notification/platforms/web/BadgeCountNotification.styles.css`**:
       - Replace `var(--color-badge-notification-background)` → `var(--color-feedback-notification-background)`
       - Replace `var(--color-badge-notification-text)` → `var(--color-feedback-notification-text)`
    
    3. **Run token generation and rebuild**:
       - Run `npm run generate:tokens`
       - Run `npm run build:browser`
       - Verify `--color-feedback-notification-background` and `--color-feedback-notification-text` 
         appear in `dist/DesignTokens.web.css`
    
    4. **Verify token-completeness test passes**:
       - Run `npm test -- src/__tests__/browser-distribution/token-completeness.property.test.ts`
    
    - _Requirements: N/A (fixes pre-existing issue from Spec 044)_

  - [x] 8.3 Update stemma test token expectations
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Rationale**: Test uses deprecated token names from before Spec 052.
    - Update `InputCheckboxBase.stemma.test.ts` expected token patterns:
      - Replace `--color-select-selected-strong` → `--color-feedback-select-background-rest`
      - Replace `--color-select-not-selected-strong` → `--color-feedback-select-border-default`
    - Run stemma test to verify it passes
    - _Requirements: 11.2_

  - [x] 8.4 Extend Input-Checkbox-Base to support Legal's typography needs
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    **Rationale**: Base must support lg+labelSm combination before Legal can wrap it.
    - Add `labelTypography` prop to Base component types:
      ```typescript
      labelTypography?: 'inherit' | 'sm' | 'md' | 'lg';  // defaults to 'inherit' (matches size)
      ```
    - Update `InputCheckboxBase.web.ts` to support `labelTypography` attribute
    - Update `InputCheckboxBase.web.css` to apply typography override when specified
    - Add `label-typography` to observed attributes
    - Ensure backward compatibility (existing usage unchanged)
    - Write unit test for new prop
    - _Requirements: 9.1 (Legal uses lg box + labelSm typography)_

    - [x] 8.4.1 Web implementation of labelTypography
      **Type**: Implementation
      **Validation**: Tier 2 - Standard
      - Add `LabelTypography` type to types.ts
      - Add `labelTypography` prop to `InputCheckboxBaseProps` interface
      - Add `label-typography` to observed attributes
      - Update `InputCheckboxBase.web.ts` with property accessor
      - Update `InputCheckboxBase.web.css` with typography override classes
      - Write unit tests for new prop
      - _Requirements: 9.1_

    - [x] 8.4.2 iOS implementation of labelTypography
      **Type**: Implementation
      **Validation**: Tier 2 - Standard
      - Add `LabelTypography` enum to iOS implementation
      - Add `labelTypography` parameter to `InputCheckboxBase` struct
      - Update `labelText` view to use override typography when not `.inherit`
      - Update preview to demonstrate lg+sm combination
      - Ensure backward compatibility (default is `.inherit`)
      - _Requirements: 9.1_

    - [x] 8.4.3 Android implementation of labelTypography
      **Type**: Implementation
      **Validation**: Tier 2 - Standard
      - Add `LabelTypography` enum to Android implementation
      - Add `labelTypography` parameter to `InputCheckboxBase` composable
      - Update label `Text` to use override typography when not `Inherit`
      - Update preview to demonstrate lg+sm combination
      - Ensure backward compatibility (default is `Inherit`)
      - _Requirements: 9.1_

  - [x] 8.5 Refactor Input-Checkbox-Legal to wrapper pattern
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    **Rationale**: Aligns implementation with design doc, reduces code duplication, enables inheritance benefits.
    
    Currently, all three platform implementations of Input-Checkbox-Legal are standalone (duplicating checkbox rendering logic). This task refactors them to wrap Input-Checkbox-Base, reducing code duplication by ~80% and ensuring Legal inherits Base improvements automatically.

    - [x] 8.5.1 Refactor Web Legal to wrapper pattern
      **Type**: Architecture
      **Validation**: Tier 2 - Standard
      - Rewrite `InputCheckboxLegal.web.ts` to wrap `<input-checkbox-base>`:
        - Create `<input-checkbox-base>` element in shadow DOM
        - Configure Base with fixed props: `size="lg"`, `label-align="top"`, `label-typography="sm"`
        - Forward relevant attributes to Base (label, helper-text, error-message, name, value)
        - Implement Legal-specific features on top:
          - Required indicator (rendered by Legal, not Base)
          - Explicit consent enforcement (intercept checked attribute)
          - Audit trail (onConsentChange with timestamp, legalTextId, version)
          - Indeterminate rejection (ignore/warn if set)
        - Listen to Base's change event and transform to consent-change event
      - Remove duplicated code (~80% reduction expected)
      - Update `InputCheckboxLegal.web.css` to style only Legal-specific elements
      - Verify all Legal-specific features still work
      - _Requirements: 9.1-9.11_

    - [x] 8.5.2 Refactor iOS Legal to wrapper pattern
      **Type**: Architecture
      **Validation**: Tier 2 - Standard
      - Rewrite `InputCheckboxLegal.ios.swift` to wrap `InputCheckboxBase`:
        - Use `InputCheckboxBase` view internally with fixed configuration:
          - `size: .lg`
          - `labelAlign: .top`
          - `labelTypography: .sm`
        - Forward relevant properties to Base (label, helperText, errorMessage)
        - Implement Legal-specific features on top:
          - Required indicator (rendered by Legal, above Base)
          - Explicit consent enforcement (intercept checked binding)
          - Audit trail (onConsentChange with timestamp, legalTextId, version)
          - No indeterminate support (don't pass indeterminate to Base)
        - Transform Base's onChange to Legal's onConsentChange
      - Remove duplicated code (checkboxBox, labelText, pressGesture, etc.)
      - Keep only Legal-specific: ConsentChangeData, required indicator, consent enforcement
      - _Requirements: 9.1-9.11_

    - [x] 8.5.3 Refactor Android Legal to wrapper pattern
      **Type**: Architecture
      **Validation**: Tier 2 - Standard
      - Rewrite `InputCheckboxLegal.android.kt` to wrap `InputCheckboxBase`:
        - Use `InputCheckboxBase` composable internally with fixed configuration:
          - `size = CheckboxSize.Large`
          - `labelAlign = LabelAlignment.Top`
          - `labelTypography = LabelTypography.Small`
        - Forward relevant parameters to Base (label, helperText, errorMessage)
        - Implement Legal-specific features on top:
          - Required indicator (rendered by Legal, above Base)
          - Explicit consent enforcement (intercept checked state)
          - Audit trail (onConsentChange with timestamp, legalTextId, version)
          - No indeterminate support (don't pass indeterminate to Base)
        - Transform Base's onCheckedChange to Legal's onConsentChange
      - Remove duplicated code (LegalCheckboxBox, LegalCheckboxTokens colors, etc.)
      - Keep only Legal-specific: ConsentChangeData, required indicator, consent enforcement
      - _Requirements: 9.1-9.11_

  - [ ] 8.6 Update Legal component tests for wrapper DOM structure
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Rationale**: After refactor, tests should mostly work; update remaining selector mismatches.
    - Update tests that query Base's internal elements to traverse nested shadow DOM:
      ```typescript
      const baseCheckbox = el.shadowRoot?.querySelector('input-checkbox-base');
      const input = baseCheckbox?.shadowRoot?.querySelector('.checkbox__input');
      ```
    - Update selector for required indicator if Legal renders it directly
    - Verify form reset propagates correctly to Base
    - Run all Legal tests to verify they pass
    - _Requirements: 11.7_

  - [ ] 8.7 Full test suite validation
    **Type**: Verification
    **Validation**: Tier 2 - Standard
    - Run `npm test` to verify all tests pass
    - Verify no regressions in:
      - Input-Checkbox-Base tests
      - Input-Checkbox-Legal tests
      - Stemma tests
      - Token-completeness tests
      - Other component tests
    - Document final test results
    - _Requirements: 11.1-11.7_


---

**Organization**: spec-validation
**Scope**: 046-input-checkbox-base


---

- [x] 6. Fix InputCheckboxLegal Test Failures

  **Type**: Parent
  **Validation**: Tier 2 - Standard
  
  **Success Criteria:**
  - All 3 previously failing tests now pass
  - Test selectors correctly match component implementation
  - No regressions in other Legal component tests
  
  **Primary Artifacts:**
  - `src/components/core/Input-Checkbox-Legal/__tests__/InputCheckboxLegal.test.ts` (updated)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/046-input-checkbox-base/completion/task-6-completion.md`
  - Summary: `docs/specs/046-input-checkbox-base/task-6-summary.md`
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 6 Complete: Fix InputCheckboxLegal Test Failures"`
  - Verify: Check GitHub for committed changes

  - [x] 6.1 Analyze Test-Implementation Mismatch
    **Type**: Investigation
    **Validation**: Tier 1 - Minimal
    - Review failing tests in `InputCheckboxLegal.test.ts`
    - Document the selector mismatch:
      - Tests expected `.checkbox__required`, `.checkbox__error`, `.checkbox__helper`
      - Component uses `legal-checkbox__helper`, `legal-checkbox__error`
      - Required indicator is inside nested `<input-checkbox-base>` shadow DOM
    - Decide on fix approach: update tests to match implementation

  - [x] 6.2 Update Test Selectors
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update "should render with required indicator" test:
      - Query through nested shadow DOM: `el.shadowRoot?.querySelector('input-checkbox-base')?.shadowRoot?.querySelector('.checkbox__required')`
    - Update "should render with error state" test:
      - Change selector from `.checkbox__error` to `.legal-checkbox__error`
    - Update "should render with helper text" test:
      - Change selector from `.checkbox__helper` to `.legal-checkbox__helper`

  - [x] 6.3 Verify All Legal Component Tests Pass
    **Type**: Verification
    **Validation**: Tier 2 - Standard
    - Run `npm test -- InputCheckboxLegal.test.ts`
    - Ensure all 3 previously failing tests now pass
    - Ensure no regressions in other Legal component tests (20 tests total)
    - Document test results
