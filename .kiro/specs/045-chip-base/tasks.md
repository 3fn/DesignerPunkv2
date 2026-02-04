# Implementation Plan: Chip Component Family

**Date**: February 3, 2026
**Spec**: 045 - Chip Component Family
**Status**: Implementation Planning
**Dependencies**: 
- Icon-Base component (type alignment fix included)
- Rosetta token pipeline
- Stemma System schema infrastructure

---

## Implementation Plan

This spec implements the Chip component family following the Stemma System architecture. The implementation is organized into four parent tasks:

1. **Prerequisites & Foundation** — Icon-Base type fix, component token, directory structure
2. **Chip-Base Implementation** — Core primitive component across all platforms
3. **Semantic Variants** — Chip-Filter and Chip-Input implementations
4. **Documentation & Integration** — Stemma schemas, MCP documentation

---

## Task List

- [x] 1. Prerequisites & Foundation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Icon-Base TypeScript types align with actual token values (20px for icon.size075)
  - Dependent components (Button-Icon, Avatar, Badge-Label-Base) updated and validated
  - Component token `chip.paddingBlock` defined in Rosetta pipeline
  - Directory structure created for all three chip components
  
  **Primary Artifacts:**
  - `src/components/core/Icon-Base/types.ts` (updated)
  - `src/components/core/Icon-Base/platforms/web/IconBase.web.ts` (updated)
  - `src/tokens/components/chip.ts`
  - `src/components/core/Chip-Base/` directory
  - `src/components/core/Chip-Filter/` directory
  - `src/components/core/Chip-Input/` directory
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/045-chip-base/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/045-chip-base/task-1-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Prerequisites & Foundation"`
  - Verify: Check GitHub for committed changes

  - [x] 1.1 Fix Icon-Base TypeScript types
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update `IconBaseSize` type: replace `18` with `20`
    - Update `iconBaseSizes.size075`: change value from `18` to `20`
    - Update `sizePixelMap` key in IconBase.web.ts: `18: 20` → `20: 20`
    - Update `sizeClassMap` key: `18:` → `20:`
    - Update `validSizes` array: replace `18` with `20`
    - Run Icon-Base tests to verify no regressions
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [x] 1.2 Update dependent components using size={18}
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Search codebase for `size={18}` or `size: 18` references
    - Update Button-Icon to use `size={20}` for icon.size075
    - Update Avatar to use `size={20}` for icon.size075
    - Update Badge-Label-Base to use `size={20}` for icon.size075
    - Update any tests referencing size 18
    - Run tests for each updated component
    - _Requirements: 9.5_

  - [x] 1.3 Define chip component token
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/tokens/components/chip.ts`
    - Define `chip.paddingBlock` referencing `space075` (6px)
    - Include reasoning explaining token purpose
    - Use `defineComponentTokens()` helper
    - Specify component name as `Chip` and family as `spacing`
    - Verify token generates correctly for web, iOS, Android
    - _Requirements: 8.1, 8.2, 8.3, 12.1, 12.2, 12.3, 12.4, 12.5_

  - [x] 1.4 Create directory structure
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create `src/components/core/Chip-Base/` directory
    - Create `src/components/core/Chip-Base/platforms/web/` subdirectory
    - Create `src/components/core/Chip-Base/platforms/ios/` subdirectory
    - Create `src/components/core/Chip-Base/platforms/android/` subdirectory
    - Create `src/components/core/Chip-Filter/` with same structure
    - Create `src/components/core/Chip-Input/` with same structure
    - Create placeholder `index.ts` and `types.ts` files
    - _Requirements: 10.1_

---

- [ ] 2. Chip-Base Implementation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Chip-Base renders correctly on web, iOS, and Android
  - All visual specifications match design (32px height, 48px tap area)
  - All state styling works (default, hover, pressed, disabled)
  - Icon integration works with Icon-Base at icon.size075
  - Accessibility requirements met (focusable, keyboard activation, ARIA)
  - Tests follow Test Development Standards (evergreen, behavior-focused)
  
  **Primary Artifacts:**
  - `src/components/core/Chip-Base/types.ts`
  - `src/components/core/Chip-Base/platforms/web/ChipBase.web.ts`
  - `src/components/core/Chip-Base/platforms/web/ChipBase.styles.css`
  - `src/components/core/Chip-Base/platforms/web/ChipBase.test.ts`
  - `src/components/core/Chip-Base/platforms/ios/ChipBase.swift`
  - `src/components/core/Chip-Base/platforms/android/ChipBase.kt`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/045-chip-base/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/045-chip-base/task-2-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 2 Complete: Chip-Base Implementation"`
  - Verify: Check GitHub for committed changes

  - [ ] 2.1 Implement Chip-Base types
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `ChipBaseProps` interface with label, icon, disabled, onPress, testID
    - Export `IconName` type alias
    - Create web component interface `ChipBaseElement`
    - Define `observedAttributes` for web component
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [ ] 2.2 Implement Chip-Base web component
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `ChipBaseElement` class extending HTMLElement
    - Implement `connectedCallback` with shadow DOM rendering
    - Implement `attributeChangedCallback` for reactive updates
    - Implement press handling with onPress callback
    - Implement disabled state (prevent interaction, apply styling)
    - Use CSS custom properties for all token values
    - Use logical properties (padding-block, padding-inline)
    - Implement expanded tap area via ::before pseudo-element
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 6.1, 6.4_

  - [ ] 2.3 Implement Chip-Base styles
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create CSS with all state styling (default, hover, pressed, disabled)
    - Use semantic color tokens for each state
    - Implement transition using `motion.duration.fast`
    - Implement focus indicator using accessibility tokens
    - Ensure pill shape with `radius.full`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 7.2_

  - [ ] 2.4 Implement Chip-Base accessibility
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add `role="button"` and `tabindex="0"`
    - Implement keyboard activation (Space/Enter)
    - Add `aria-disabled` when disabled
    - Ensure 48px tap area meets WCAG requirements
    - _Requirements: 7.1, 7.2, 7.3, 7.6_

  - [ ] 2.5 Write Chip-Base tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Use explicit custom element registration pattern
    - Wait for `customElements.whenDefined()` before tests
    - Wait after `appendChild()` before querying shadow DOM
    - Test behavior (label renders, icon appears, press works, disabled prevents press)
    - Test accessibility (focusable, keyboard activation, ARIA attributes)
    - Clean up DOM after each test
    - Do NOT test implementation details (specific CSS values, token sources)
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7_

  - [ ] 2.6 Implement Chip-Base iOS
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create SwiftUI `ChipBase` view
    - Use token constants for all styling
    - Implement Button with HStack layout
    - Use Capsule shape for pill appearance
    - Implement disabled state
    - Ensure 48px minimum tap area
    - _Requirements: 6.2, 6.4, 6.5_

  - [ ] 2.7 Implement Chip-Base Android
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create Jetpack Compose `ChipBase` composable
    - Use DesignTokens constants for all styling
    - Use Surface with RoundedCornerShape(50) for pill
    - Implement Row layout with icon and label
    - Implement disabled state
    - Ensure 48px minimum tap area
    - _Requirements: 6.3, 6.4, 6.5_

---

- [ ] 3. Semantic Variants Implementation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Chip-Filter toggles selected state with visual feedback
  - Chip-Filter shows checkmark when selected (replaces leading icon)
  - Chip-Input always shows X icon as trailing element
  - Chip-Input dismisses on tap anywhere
  - Both variants inherit Chip-Base styling correctly
  - Both variants work on web, iOS, and Android
  - Tests follow Test Development Standards
  
  **Primary Artifacts:**
  - `src/components/core/Chip-Filter/types.ts`
  - `src/components/core/Chip-Filter/platforms/web/ChipFilter.web.ts`
  - `src/components/core/Chip-Filter/platforms/web/ChipFilter.test.ts`
  - `src/components/core/Chip-Filter/platforms/ios/ChipFilter.swift`
  - `src/components/core/Chip-Filter/platforms/android/ChipFilter.kt`
  - `src/components/core/Chip-Input/types.ts`
  - `src/components/core/Chip-Input/platforms/web/ChipInput.web.ts`
  - `src/components/core/Chip-Input/platforms/web/ChipInput.test.ts`
  - `src/components/core/Chip-Input/platforms/ios/ChipInput.swift`
  - `src/components/core/Chip-Input/platforms/android/ChipInput.kt`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/045-chip-base/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/045-chip-base/task-3-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 3 Complete: Semantic Variants Implementation"`
  - Verify: Check GitHub for committed changes

  - [ ] 3.1 Implement Chip-Filter types
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `ChipFilterProps` extending `ChipBaseProps`
    - Add `selected` boolean prop
    - Add `onSelectionChange` callback prop
    - _Requirements: 4.1_

  - [ ] 3.2 Implement Chip-Filter web component
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `ChipFilterElement` extending or composing ChipBaseElement
    - Implement selected state styling (primary background, onPrimary text)
    - Implement checkmark icon when selected (replaces leading icon)
    - Implement toggle behavior on press
    - Add `aria-pressed` attribute for accessibility
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 7.4_

  - [ ] 3.3 Write Chip-Filter tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test toggle behavior (selected state changes on press)
    - Test onSelectionChange callback
    - Test checkmark appears when selected
    - Test checkmark replaces leading icon when both present
    - Test disabled prevents toggle
    - Test aria-pressed attribute
    - _Requirements: 13.1, 13.5_

  - [ ] 3.4 Implement Chip-Filter iOS and Android
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create SwiftUI `ChipFilter` view
    - Create Jetpack Compose `ChipFilter` composable
    - Implement selected state styling on both platforms
    - Implement checkmark icon logic
    - _Requirements: 6.2, 6.3, 6.5_

  - [ ] 3.5 Implement Chip-Input types
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `ChipInputProps` extending `Omit<ChipBaseProps, 'onPress'>`
    - Add `onDismiss` callback prop
    - _Requirements: 5.1_

  - [ ] 3.6 Implement Chip-Input web component
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `ChipInputElement` extending or composing ChipBaseElement
    - Always render X icon as trailing element
    - Support both leading icon AND trailing X icon
    - Implement dismiss behavior (tap anywhere calls onDismiss)
    - Add accessible label "Remove [label]" to X icon
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 7.5_

  - [ ] 3.7 Write Chip-Input tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test X icon always visible
    - Test both leading and trailing icons when icon prop provided
    - Test onDismiss callback on press
    - Test disabled prevents dismiss
    - Test X icon accessible label
    - _Requirements: 13.1, 13.5_

  - [ ] 3.8 Implement Chip-Input iOS and Android
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create SwiftUI `ChipInput` view
    - Create Jetpack Compose `ChipInput` composable
    - Implement X icon as trailing element
    - Implement dismiss behavior
    - _Requirements: 6.2, 6.3, 6.5_

---

- [ ] 4. Documentation & Integration

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Stemma schemas exist for all three chip components
  - Schemas specify inheritance relationships correctly
  - MCP-queryable family documentation complete
  - Component tokens integrate with Rosetta pipeline
  - All platform outputs generate correctly
  
  **Primary Artifacts:**
  - `src/components/core/Chip-Base/Chip-Base.schema.yaml`
  - `src/components/core/Chip-Filter/Chip-Filter.schema.yaml`
  - `src/components/core/Chip-Input/Chip-Input.schema.yaml`
  - `.kiro/steering/Component-Family-Chip.md`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/045-chip-base/completion/task-4-parent-completion.md`
  - Summary: `docs/specs/045-chip-base/task-4-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 4 Complete: Documentation & Integration"`
  - Verify: Check GitHub for committed changes

  - [ ] 4.1 Create Chip-Base Stemma schema
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `Chip-Base.schema.yaml`
    - Specify type as `primitive` and family as `Chip`
    - Define all props with types and descriptions
    - List all required tokens
    - Define behavioral contracts (press, disabled)
    - Add platform implementation notes
    - _Requirements: 10.1, 10.2, 10.5, 10.6, 10.7_

  - [ ] 4.2 Create Chip-Filter and Chip-Input schemas
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `Chip-Filter.schema.yaml` with `inherits: Chip-Base`
    - Create `Chip-Input.schema.yaml` with `inherits: Chip-Base`
    - Define additional props for each variant
    - Define behavioral contracts for toggle and dismiss
    - _Requirements: 10.3, 10.4, 10.5_

  - [ ] 4.3 Create MCP-queryable family documentation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `.kiro/steering/Component-Family-Chip.md`
    - Include Family Overview section (~200-400 tokens)
    - Include Inheritance Structure section
    - Include Behavioral Contracts section
    - Include Component Schemas section
    - Include Token Dependencies section
    - Include Usage Guidelines (primitive vs semantic selection)
    - Include Cross-Platform Notes section
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 11.8_

  - [ ] 4.4 Verify Rosetta pipeline integration
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Verify `chip.paddingBlock` generates in web CSS output
    - Verify `chip.paddingBlock` generates in iOS Swift output
    - Verify `chip.paddingBlock` generates in Android Kotlin output
    - Run token generation and verify outputs
    - _Requirements: 12.6, 12.7, 12.8_

---

## Requirements Traceability

| Requirement | Tasks |
|-------------|-------|
| R1: Component Structure | 2.1, 2.2 |
| R2: Visual Specifications | 2.2, 2.3 |
| R3: State Styling | 2.3 |
| R4: Chip-Filter | 3.1, 3.2, 3.3, 3.4 |
| R5: Chip-Input | 3.5, 3.6, 3.7, 3.8 |
| R6: Cross-Platform | 2.6, 2.7, 3.4, 3.8 |
| R7: Accessibility | 2.4, 3.2, 3.6 |
| R8: Component Token | 1.3 |
| R9: Icon-Base Type Fix | 1.1, 1.2 |
| R10: Stemma Compliance | 1.4, 4.1, 4.2 |
| R11: Documentation | 4.3 |
| R12: Rosetta Integration | 1.3, 4.4 |
| R13: Test Standards | 2.5, 3.3, 3.7 |

---

**Organization**: spec-validation
**Scope**: 045-chip-base
