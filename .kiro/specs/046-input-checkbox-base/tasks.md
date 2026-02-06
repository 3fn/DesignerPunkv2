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

**Organization**: spec-validation
**Scope**: 046-input-checkbox-base