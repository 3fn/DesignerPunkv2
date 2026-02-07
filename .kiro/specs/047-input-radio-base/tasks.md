# Implementation Plan: Input-Radio-Base & Input-Radio-Set

**Date**: February 7, 2026
**Spec**: 047 - Input-Radio-Base
**Status**: Implementation Planning
**Dependencies**: 
- Spec 046 (Input-Checkbox-Base) - Established patterns for selection controls

---

## Implementation Plan

This implementation follows a phased approach:
1. **Foundation**: Create directory structure and type definitions
2. **Input-Radio-Base**: Implement the primitive component for all platforms
3. **Input-Radio-Set**: Implement the orchestrator component for all platforms
4. **Testing**: Comprehensive tests following Test-Development-Standards
5. **Documentation**: README files and family documentation updates

---

## Task List

- [x] 1. Input-Radio-Base Foundation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Directory structure created following True Native Architecture
  - Type definitions complete with all props and observed attributes
  - README created following Component-Template pattern
  
  **Primary Artifacts:**
  - `src/components/core/Input-Radio-Base/` directory structure
  - `src/components/core/Input-Radio-Base/types.ts`
  - `src/components/core/Input-Radio-Base/README.md`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/047-input-radio-base/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/047-input-radio-base/task-1-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Input-Radio-Base Foundation"`
  - Verify: Check GitHub for committed changes

  - [x] 1.1 Create Input-Radio-Base directory structure
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create `src/components/core/Input-Radio-Base/` directory
    - Create `platforms/web/`, `platforms/ios/`, `platforms/android/` subdirectories
    - Create `__tests__/` subdirectory
    - _Requirements: 8.1_

  - [x] 1.2 Create Input-Radio-Base type definitions
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `types.ts` with `InputRadioBaseProps` interface
    - Define `RadioSize` and `LabelAlignment` types
    - Define `INPUT_RADIO_BASE_DEFAULTS` constants
    - Define `INPUT_RADIO_BASE_OBSERVED_ATTRIBUTES` array
    - Define `InputRadioBaseElement` web component interface
    - Include JSDoc documentation with requirement references
    - _Requirements: 1.1-1.7, 2.1-2.9, 3.1-3.4_

  - [x] 1.3 Create Input-Radio-Base README
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `README.md` following Component-Template pattern
    - Document behavioral contracts (focusable, pressable, selected_state, etc.)
    - Include usage examples for web, iOS, and Android
    - Document API reference with all properties
    - Document size variants and token dependencies
    - Include accessibility section with WCAG compliance
    - _Requirements: 13.1, 13.4_

---

- [x] 2. Input-Radio-Base Web Implementation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Web component registers as `<input-radio-base>` custom element
  - All three size variants render correctly (sm, md, lg)
  - Selected/unselected states display with correct tokens
  - Hover state uses blend utilities for border color
  - Focus ring displays on keyboard navigation
  - Form integration works (value included in submission)
  - RTL support via CSS logical properties
  
  **Primary Artifacts:**
  - `src/components/core/Input-Radio-Base/platforms/web/InputRadioBase.web.ts`
  - `src/components/core/Input-Radio-Base/platforms/web/InputRadioBase.web.css`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/047-input-radio-base/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/047-input-radio-base/task-2-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 2 Complete: Input-Radio-Base Web Implementation"`
  - Verify: Check GitHub for committed changes

  - [x] 2.1 Implement InputRadioBase web component class
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `InputRadioBase.web.ts` extending HTMLElement
    - Implement Shadow DOM with style encapsulation
    - Implement attribute reflection for all observed attributes
    - Implement `connectedCallback` with blend utility initialization
    - Implement `attributeChangedCallback` for reactive updates
    - Register as `<input-radio-base>` custom element
    - _Requirements: 8.1, 8.2, 8.6_

  - [x] 2.2 Implement radio circle and dot rendering
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Render hidden native `<input type="radio">` for form compatibility
    - Render radio circle with correct size based on variant
    - Render dot with scale animation on selection
    - Apply correct border colors for selected/unselected states
    - Apply error border color when errorMessage present
    - _Requirements: 1.1, 1.2, 1.5, 4.1-4.6_

  - [x] 2.3 Implement hover and focus states
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Import and initialize blend utilities from ThemeAwareBlendUtilities
    - Calculate hover border color using `blend.hoverDarker`
    - Apply hover color via CSS custom property `--_radio-hover-border`
    - Implement `:focus-visible` focus ring using accessibility tokens
    - _Requirements: 1.3, 1.4, 7.4, 7.5_

  - [x] 2.4 Implement CSS with logical properties
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `InputRadioBase.web.css` with all styles
    - Use CSS logical properties for RTL support (`padding-inline-start`, `margin-inline-start`)
    - Implement size variant classes (`.radio--sm`, `.radio--md`, `.radio--lg`)
    - Implement label alignment classes (`.radio--align-center`, `.radio--align-top`)
    - Implement state classes (`.radio--selected`, `.radio--error`)
    - Use CSS custom properties for all token values
    - _Requirements: 2.1-2.9, 3.1-3.4, 8.3_

  - [x] 2.5 Implement form integration
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Ensure hidden native radio participates in form submission
    - Implement `name` attribute for radio grouping
    - Implement `value` attribute for form submission value
    - Test form submission includes radio value when selected
    - _Requirements: 8.7, 8.8, 8.9_

---

- [x] 3. Input-Radio-Base iOS Implementation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - SwiftUI InputRadioBase view renders correctly
  - All three size variants work (sm, md, lg)
  - Press feedback uses scale096 token
  - VoiceOver announces selected/not selected state
  - RTL handled automatically via SwiftUI
  
  **Primary Artifacts:**
  - `src/components/core/Input-Radio-Base/platforms/ios/InputRadioBase.ios.swift`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/047-input-radio-base/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/047-input-radio-base/task-3-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 3 Complete: Input-Radio-Base iOS Implementation"`
  - Verify: Check GitHub for committed changes

  - [x] 3.1 Implement InputRadioBase SwiftUI view
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `InputRadioBase.ios.swift` with SwiftUI View
    - Implement `@Binding var selectedValue: String?` for state
    - Implement RadioSize enum with dotSize, inset, circleSize, gap properties
    - Implement LabelAlignment enum with verticalAlignment property
    - Implement press gesture with scale animation using scale096
    - _Requirements: 7.1, 7.2_

  - [x] 3.2 Implement iOS accessibility
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add `.accessibilityLabel(label)` for VoiceOver
    - Add `.accessibilityValue(isSelected ? "selected" : "not selected")`
    - Add `.accessibilityAddTraits(.isButton)`
    - Ensure entire label area is tappable
    - _Requirements: 6.1, 6.2, 6.5_

---

- [x] 4. Input-Radio-Base Android Implementation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Jetpack Compose InputRadioBase renders correctly
  - All three size variants work (sm, md, lg)
  - Material ripple effect on press
  - TalkBack announces selected state
  - RTL handled automatically via Compose
  
  **Primary Artifacts:**
  - `src/components/core/Input-Radio-Base/platforms/android/InputRadioBase.android.kt`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/047-input-radio-base/completion/task-4-parent-completion.md`
  - Summary: `docs/specs/047-input-radio-base/task-4-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 4 Complete: Input-Radio-Base Android Implementation"`
  - Verify: Check GitHub for committed changes

  - [x] 4.1 Implement InputRadioBase Compose function
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `InputRadioBase.android.kt` with @Composable function
    - Implement RadioSize enum with dotSize, inset, circleSize, gap properties
    - Implement LabelAlignment enum
    - Implement RadioCircle composable with AnimatedVisibility for dot
    - Implement Material ripple using blend.pressedDarker
    - _Requirements: 7.3_

  - [x] 4.2 Implement Android accessibility
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add `.semantics { role = Role.RadioButton; selected = isSelected }`
    - Ensure TalkBack announces selection state
    - Ensure entire label area is clickable
    - _Requirements: 6.1, 6.2, 6.5_

---

- [ ] 5. Input-Radio-Set Foundation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Directory structure created following True Native Architecture
  - Type definitions complete with all props and observed attributes
  - README created following Component-Template pattern
  - Orchestration pattern documented (not duplication)
  
  **Primary Artifacts:**
  - `src/components/core/Input-Radio-Set/` directory structure
  - `src/components/core/Input-Radio-Set/types.ts`
  - `src/components/core/Input-Radio-Set/README.md`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/047-input-radio-base/completion/task-5-parent-completion.md`
  - Summary: `docs/specs/047-input-radio-base/task-5-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 5 Complete: Input-Radio-Set Foundation"`
  - Verify: Check GitHub for committed changes

  - [ ] 5.1 Create Input-Radio-Set directory structure
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create `src/components/core/Input-Radio-Set/` directory
    - Create `platforms/web/`, `platforms/ios/`, `platforms/android/` subdirectories
    - Create `__tests__/` subdirectory
    - _Requirements: 9.1_

  - [ ] 5.2 Create Input-Radio-Set type definitions
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `types.ts` with `InputRadioSetProps` interface
    - Define `INPUT_RADIO_SET_DEFAULTS` constants
    - Define `INPUT_RADIO_SET_OBSERVED_ATTRIBUTES` array
    - Define `InputRadioSetElement` web component interface
    - Include JSDoc documentation with requirement references
    - _Requirements: 9.1-9.10, 11.1-11.5_

  - [ ] 5.3 Create Input-Radio-Set README
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `README.md` following Component-Template pattern
    - Document orchestration pattern (Set orchestrates Base, not duplicates)
    - Document behavioral contracts (mutual_exclusivity, keyboard_navigation, etc.)
    - Include usage examples for web, iOS, and Android
    - Document keyboard navigation patterns
    - Document validation and error handling
    - Include accessibility section with WCAG compliance
    - _Requirements: 13.1, 13.4, 13.5_

---

- [ ] 6. Input-Radio-Set Web Implementation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Web component registers as `<input-radio-set>` custom element
  - Slot-based composition renders child Input-Radio-Base components
  - Mutual exclusivity works (selecting one deselects others)
  - Keyboard navigation works (arrow keys, Tab, Space, Home, End)
  - Error message displays with role="alert"
  - ARIA radiogroup role applied
  
  **Primary Artifacts:**
  - `src/components/core/Input-Radio-Set/platforms/web/InputRadioSet.web.ts`
  - `src/components/core/Input-Radio-Set/platforms/web/InputRadioSet.web.css`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/047-input-radio-base/completion/task-6-parent-completion.md`
  - Summary: `docs/specs/047-input-radio-base/task-6-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 6 Complete: Input-Radio-Set Web Implementation"`
  - Verify: Check GitHub for committed changes

  - [ ] 6.1 Implement InputRadioSet web component class
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `InputRadioSet.web.ts` extending HTMLElement
    - Implement Shadow DOM with `<slot>` for child composition
    - Apply `role="radiogroup"` for accessibility
    - Implement attribute reflection for observed attributes
    - Register as `<input-radio-set>` custom element
    - _Requirements: 9.1, 9.2, 11.1_

  - [ ] 6.2 Implement selection state coordination
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Listen for selection events from child Input-Radio-Base components
    - Update `selectedValue` when child is selected
    - Propagate selection state to children via custom event or attribute
    - Ensure mutual exclusivity (only one selected at a time)
    - Prevent deselection when clicking already-selected radio
    - _Requirements: 9.3, 9.4, 9.5, 9.6_

  - [ ] 6.3 Implement keyboard navigation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement roving tabindex pattern (Tab enters/exits group)
    - Implement Arrow Down/Right to move focus to next radio
    - Implement Arrow Up/Left to move focus to previous radio
    - Implement wrap-around at group boundaries
    - Implement Space to select focused radio
    - Implement Home/End to jump to first/last radio
    - _Requirements: 10.1-10.9_

  - [ ] 6.4 Implement validation and error display
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `required` validation (fail if no selection)
    - Display error message with `role="alert"` for screen readers
    - Apply error styling to container when `error` is true
    - Create `InputRadioSet.web.css` with error styles
    - _Requirements: 9.7, 9.8, 9.9_

---

- [ ] 7. Input-Radio-Set iOS Implementation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - SwiftUI InputRadioSet view renders correctly
  - Environment values pass selection state to children
  - Mutual exclusivity works
  - VoiceOver announces group and selection state
  
  **Primary Artifacts:**
  - `src/components/core/Input-Radio-Set/platforms/ios/InputRadioSet.ios.swift`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/047-input-radio-base/completion/task-7-parent-completion.md`
  - Summary: `docs/specs/047-input-radio-base/task-7-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 7 Complete: Input-Radio-Set iOS Implementation"`
  - Verify: Check GitHub for committed changes

  - [ ] 7.1 Implement InputRadioSet SwiftUI view
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `InputRadioSet.ios.swift` with SwiftUI View
    - Implement `@Binding var selectedValue: String?` for controlled state
    - Use `@ViewBuilder` for child content
    - Pass selection state via environment values
    - Implement error message display
    - _Requirements: 9.1, 9.3, 9.4, 9.8, 11.2_

  - [ ] 7.2 Implement iOS accessibility for Set
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add `.accessibilityElement(children: .contain)` for group
    - Ensure VoiceOver announces group context
    - Ensure error message is announced
    - _Requirements: 9.2, 9.9_

---

- [ ] 8. Input-Radio-Set Android Implementation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Jetpack Compose InputRadioSet renders correctly
  - CompositionLocal passes selection state to children
  - Mutual exclusivity works
  - TalkBack announces group and selection state
  
  **Primary Artifacts:**
  - `src/components/core/Input-Radio-Set/platforms/android/InputRadioSet.android.kt`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/047-input-radio-base/completion/task-8-parent-completion.md`
  - Summary: `docs/specs/047-input-radio-base/task-8-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 8 Complete: Input-Radio-Set Android Implementation"`
  - Verify: Check GitHub for committed changes

  - [ ] 8.1 Implement InputRadioSet Compose function
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `InputRadioSet.android.kt` with @Composable function
    - Use CompositionLocalProvider to pass selection state
    - Implement error message display with liveRegion
    - Apply `role = Role.RadioGroup` semantics
    - _Requirements: 9.1, 9.3, 9.4, 9.8, 11.3_

  - [ ] 8.2 Implement Android accessibility for Set
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add `.semantics { role = Role.RadioGroup }` for group
    - Ensure TalkBack announces group context
    - Ensure error message uses `liveRegion = LiveRegionMode.Polite`
    - _Requirements: 9.2, 9.9_

---

- [ ] 9. Testing

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Unit tests pass for Input-Radio-Base (all platforms)
  - Unit tests pass for Input-Radio-Set (all platforms)
  - Stemma System validators pass for both components
  - Integration tests pass for form submission
  - All tests follow Test-Development-Standards
  
  **Primary Artifacts:**
  - `src/components/core/Input-Radio-Base/__tests__/InputRadioBase.test.ts`
  - `src/components/core/Input-Radio-Base/__tests__/InputRadioBase.stemma.test.ts`
  - `src/components/core/Input-Radio-Set/__tests__/InputRadioSet.test.ts`
  - `src/components/core/Input-Radio-Set/__tests__/InputRadioSet.stemma.test.ts`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/047-input-radio-base/completion/task-9-parent-completion.md`
  - Summary: `docs/specs/047-input-radio-base/task-9-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 9 Complete: Testing"`
  - Verify: Check GitHub for committed changes

  - [ ] 9.1 Create Input-Radio-Base unit tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test custom element registration (`<input-radio-base>`)
    - Test attribute reactivity for all observed attributes
    - Test state rendering (selected, unselected, hover, focus, error)
    - Test size variants (sm, md, lg)
    - Test label alignment (center, top)
    - Test accessibility (ARIA attributes, keyboard interaction)
    - _Requirements: 12.1, 12.4, 12.5, 12.6_

  - [ ] 9.2 Create Input-Radio-Base Stemma validators
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Validate component naming convention (Input-Radio-Base)
    - Validate token usage (no hard-coded values)
    - Validate property and accessibility compliance
    - _Requirements: 12.2_

  - [ ] 9.3 Create Input-Radio-Set unit tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test custom element registration (`<input-radio-set>`)
    - Test orchestration pattern (Set does not duplicate Base rendering)
    - Test mutual exclusivity (selecting one deselects others)
    - Test keyboard navigation (arrow keys, Tab, Space, Home, End)
    - Test validation (required, error display)
    - Test accessibility (radiogroup role, error announcement)
    - _Requirements: 12.7, 12.8_

  - [ ] 9.4 Create Input-Radio-Set Stemma validators
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Validate component naming convention (Input-Radio-Set)
    - Validate orchestration pattern (not duplication)
    - Validate token usage (no hard-coded values)
    - _Requirements: 12.2, 12.8_

  - [ ] 9.5 Create form integration tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test form submission includes radio value when selected
    - Test form submission excludes radio value when unselected
    - Test form reset returns radio to unselected state
    - Test `name` attribute groups radios correctly
    - _Requirements: 12.9_

---

- [ ] 10. Documentation Updates

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Component-Family-Form-Inputs.md updated with radio components
  - Component-Quick-Reference.md updated with radio family entry
  - All documentation follows established patterns
  
  **Primary Artifacts:**
  - Updated `.kiro/steering/Component-Family-Form-Inputs.md`
  - Updated `.kiro/steering/Component-Quick-Reference.md`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/047-input-radio-base/completion/task-10-parent-completion.md`
  - Summary: `docs/specs/047-input-radio-base/task-10-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 10 Complete: Documentation Updates"`
  - Verify: Check GitHub for committed changes

  - [ ] 10.1 Update Component-Family-Form-Inputs.md
    **Type**: Documentation
    **Validation**: Tier 2 - Standard
    - Add Input-Radio-Base component entry
    - Add Input-Radio-Set component entry
    - Document relationship between Base and Set
    - Include behavioral contracts for both components
    - _Requirements: 13.3_

  - [ ] 10.2 Update Component-Quick-Reference.md
    **Type**: Documentation
    **Validation**: Tier 2 - Standard
    - Add radio family entry to component selection guide
    - Include usage examples for Base and Set
    - Document when to use Base vs Set
    - _Requirements: 13.2_
