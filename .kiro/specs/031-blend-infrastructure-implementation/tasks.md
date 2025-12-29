# Implementation Plan: Blend Infrastructure Implementation

**Date**: December 28, 2025
**Spec**: 031 - Blend Infrastructure Implementation
**Status**: Implementation Planning
**Dependencies**: 024-blend-token-infrastructure-audit (completed)

---

## Implementation Plan

This implementation plan addresses the blend token infrastructure gap identified in Spec 024. The work is organized into three phases: Build Integration, Component Updates, and Theme Support.

**Estimated Total Effort**: 7-11 days

---

## Task List

- [x] 1. Build Pipeline Integration

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - BlendUtilityGenerator integrated into TokenFileGenerator
  - Blend utilities generated for Web, iOS, and Android
  - Package exports blend utilities correctly
  - Layer 1 validation tests pass (±1 RGB tolerance)
  
  **Primary Artifacts:**
  - `dist/BlendUtilities.web.ts`
  - `dist/BlendUtilities.ios.swift`
  - `dist/BlendUtilities.android.kt`
  - Updated `src/generators/TokenFileGenerator.ts`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/031-blend-infrastructure-implementation/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/031-blend-infrastructure-implementation/task-1-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Build Pipeline Integration"`
  - Verify: Check GitHub for committed changes

  - [x] 1.1 Integrate BlendUtilityGenerator into TokenFileGenerator
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Import BlendUtilityGenerator in TokenFileGenerator
    - Add BlendUtilityGenerator.generate() call to build pipeline
    - Ensure blend utilities are generated alongside token files
    - Handle BlendUtilityGenerator errors appropriately
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 1.2 Generate Web blend utilities
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Verify BlendUtilityGenerator produces valid TypeScript
    - Ensure output file is `dist/BlendUtilities.web.ts`
    - Validate function signatures match design (darkerBlend, lighterBlend, saturate, desaturate)
    - Test invalid input handling (returns original color)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [x] 1.3 Generate iOS blend utilities
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Verify BlendUtilityGenerator produces valid Swift
    - Ensure output file is `dist/BlendUtilities.ios.swift`
    - Validate Color extension methods match design
    - Test blend amount clamping (0.0-1.0)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [x] 1.4 Generate Android blend utilities
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Verify BlendUtilityGenerator produces valid Kotlin
    - Ensure output file is `dist/BlendUtilities.android.kt`
    - Validate Color extension functions match design
    - Test blend amount clamping (0.0f-1.0f)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

  - [x] 1.5 Configure package exports
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Update package.json exports to include BlendUtilities
    - Ensure TypeScript types are exported
    - Verify import path `@designerpunk/tokens/BlendUtilities` works
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [x] 1.6 Write Layer 1 validation tests (Property-Based)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - **Property 1: Blend Direction Correctness**
      - For any valid color and blend amount, darkerBlend produces lower luminance
      - For any valid color and blend amount, lighterBlend produces higher luminance
      - For any valid color and blend amount, saturate produces higher saturation
      - For any valid color and blend amount, desaturate produces lower saturation
    - **Property 2: Invalid Input Handling**
      - For any invalid input, blend functions return original color unchanged
    - **Property 3: Cross-Platform Consistency**
      - For any color and blend amount, Web/iOS/Android produce results within ±1 RGB
    - Configure minimum 100 iterations per property test
    - _Requirements: 5.1, 5.3, 12.1, 12.4_

---

- [x] 2. Component Updates

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All four components (ButtonCTA, TextInputField, Container, Icon) use blend utilities
  - All workarounds removed (opacity, filter, scaleEffect, Material ripple)
  - Layer 2 validation tests pass (token-naming validation)
  - No breaking changes to component APIs
  
  **Primary Artifacts:**
  - Updated `src/components/ButtonCTA/` (Web, iOS, Android)
  - Updated `src/components/TextInputField/` (Web, iOS, Android)
  - Updated `src/components/Container/` (Web, iOS, Android)
  - Updated `src/components/Icon/` (Web, iOS, Android)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/031-blend-infrastructure-implementation/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/031-blend-infrastructure-implementation/task-2-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 2 Complete: Component Updates"`
  - Verify: Check GitHub for committed changes

  - [x] 2.1 Update ButtonCTA component
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Replace `opacity: 0.92` hover with `darkerBlend(color.primary, blend.hoverDarker)`
    - Replace `opacity: 0.84` pressed with `darkerBlend(color.primary, blend.pressedDarker)`
    - Replace `opacity: 0.6` disabled with `desaturate(color.primary, blend.disabledDesaturate)`
    - Replace `filter: brightness(1.08)` icon with `lighterBlend(color.onPrimary, blend.iconLighter)`
    - Update Web, iOS, and Android implementations
    - Remove iOS `scaleEffect(0.96)` pressed workaround
    - Remove Android Material ripple pressed workaround
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 13.1, 13.2, 13.3, 13.4_

  - [x] 2.2 Update TextInputField component
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Replace direct `color.primary` focus with `saturate(color.primary, blend.focusSaturate)`
    - Replace `opacity: 0.6` disabled with `desaturate(color.primary, blend.disabledDesaturate)`
    - Update Web, iOS, and Android implementations
    - _Requirements: 8.1, 8.2, 8.3, 13.1_

  - [x] 2.3 Update Container component
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add hover state using `darkerBlend(color.surface, blend.hoverDarker)`
    - Update Web, iOS, and Android implementations
    - _Requirements: 9.1, 9.2_

  - [x] 2.4 Update Icon component
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Replace CSS filter optical balance with `lighterBlend(color, blend.iconLighter)`
    - Update Web, iOS, and Android implementations
    - _Requirements: 10.1, 10.2, 13.2_

  - [x] 2.5 Write Layer 2 validation tests (Token-Naming)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create static analysis tests for component token usage
    - Verify ButtonCTA uses correct blend utility + token combinations
    - Verify TextInputField uses correct blend utility + token combinations
    - Verify Container uses correct blend utility + token combinations
    - Verify Icon uses correct blend utility + token combinations
    - Verify no workarounds remain (opacity, filter, scaleEffect, Material ripple)
    - _Requirements: 12.2, 12.3, 13.5_

---

- [x] 3. Theme Support

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Theme-aware wrapper functions available
  - Components work correctly in light and dark themes
  - Theme switching updates blend colors appropriately
  - Documentation updated with theme-aware patterns
  
  **Primary Artifacts:**
  - Theme-aware utility wrappers (Web, iOS, Android)
  - Updated component theme integration
  - Developer documentation
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/031-blend-infrastructure-implementation/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/031-blend-infrastructure-implementation/task-3-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 3 Complete: Theme Support"`
  - Verify: Check GitHub for committed changes

  - [x] 3.1 Create theme-aware wrapper functions
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `getBlendUtilities()` factory and `createBlendUtilities()` for Web (vanilla TypeScript)
    - Create theme-aware extensions for iOS (SwiftUI)
    - Create theme-aware extensions for Android (Compose)
    - Wrappers automatically use current theme's color values
    - _Requirements: 11.4_
    
    **Note**: Original implementation completed with React-style naming (`useBlendUtilities`). 
    Refactor subtasks below correct this to align with vanilla Web Component architecture.

  - [x] 3.1.REFACTOR.1 Update ThemeAwareBlendUtilities.web.ts naming and documentation
    **Type**: Implementation
    **Validation**: Tier 1 - Minimal
    - Rename `useBlendUtilities` to `getBlendUtilities` (primary export)
    - Remove React-specific documentation and comments
    - Add documentation about CSS custom property integration pattern
    - Keep `createBlendUtilities()` as factory function
    - Ensure exports align with vanilla TypeScript patterns

  - [x] 3.1.REFACTOR.2 Update ThemeAwareBlendUtilities tests
    **Type**: Implementation
    **Validation**: Tier 1 - Minimal
    - Update test descriptions to remove React references
    - Rename test cases from "useBlendUtilities" to "getBlendUtilities"
    - Ensure tests validate vanilla TypeScript patterns

  - [x] 3.1.REFACTOR.3 Update task 3.1 completion documentation
    **Type**: Documentation
    **Validation**: Tier 1 - Minimal
    - Update completion doc to reflect corrected architecture
    - Document the refactoring that was performed
    - Note lessons learned about architecture assumptions

  - [x] 3.2 Update ButtonCTA to use theme-aware blend utilities
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Web: Integrate `getBlendUtilities()` for hover/pressed/disabled states
    - iOS: Use Color extensions with SwiftUI environment for theme colors
    - Android: Use Color extensions with Compose MaterialTheme for theme colors
    - Ensure hover uses `darkerBlend(color.primary, blend.hoverDarker)`
    - Ensure pressed uses `darkerBlend(color.primary, blend.pressedDarker)`
    - Ensure disabled uses `desaturate(color.primary, blend.disabledDesaturate)`
    - Ensure icon uses `lighterBlend(color.onPrimary, blend.iconLighter)`
    - _Requirements: 11.1, 11.2, 11.3, 7.1, 7.2, 7.3, 7.4_

  - [x] 3.3 Update TextInputField to use theme-aware blend utilities
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Web: Integrate `getBlendUtilities()` for focus/disabled states
    - iOS: Use Color extensions with SwiftUI environment for theme colors
    - Android: Use Color extensions with Compose MaterialTheme for theme colors
    - Ensure focus uses `saturate(color.primary, blend.focusSaturate)`
    - Ensure disabled uses `desaturate(color.primary, blend.disabledDesaturate)`
    - _Requirements: 11.1, 11.2, 11.3, 8.1, 8.2_

  - [x] 3.4 Update Container to use theme-aware blend utilities
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Web: Integrate `getBlendUtilities()` for hover state
    - iOS: Use Color extensions with SwiftUI environment for theme colors
    - Android: Use Color extensions with Compose MaterialTheme for theme colors
    - Ensure hover uses `darkerBlend(color.surface, blend.hoverDarker)`
    - _Requirements: 11.1, 11.2, 11.3, 9.1_

  - [x] 3.5 Update Icon to use theme-aware blend utilities
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Web: Integrate `getBlendUtilities()` for optical balance
    - iOS: Use Color extensions with SwiftUI environment for theme colors
    - Android: Use Color extensions with Compose MaterialTheme for theme colors
    - Ensure icon color uses `lighterBlend(color, blend.iconLighter)`
    - _Requirements: 11.1, 11.2, 11.3, 10.1_

  - [x] 3.6 Write theme switching tests ✅
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test light theme produces appropriate blend results
    - Test dark theme produces appropriate blend results
    - Test theme switching updates component colors
    - _Requirements: 11.1, 11.2, 11.3_
    - **Completed**: December 29, 2025
    - **Tests**: 34 tests passing in `src/blend/__tests__/ThemeSwitching.test.ts`

  - [x] 3.7 Update documentation
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Update component guides with blend utility usage examples
    - Document theme-aware patterns
    - Update AI agent steering documentation
    - _Requirements: 14.1, 14.2, 14.3_

---

## Checkpoint Tasks

- [ ] 4. Checkpoint - Phase 1 Complete
  - Ensure all Phase 1 tests pass
  - Verify blend utilities are in build output
  - Ask user if questions arise before proceeding to Phase 2

- [ ] 5. Checkpoint - Phase 2 Complete
  - Ensure all Phase 2 tests pass
  - Verify all components use blend utilities
  - Verify all workarounds removed
  - Ask user if questions arise before proceeding to Phase 3

- [ ] 6. Final Checkpoint - All Phases Complete
  - Ensure all tests pass (Layer 1 + Layer 2)
  - Verify theme support working
  - Verify documentation updated
  - Ask user for final review

---

## Notes

- All tasks are required for comprehensive implementation
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties (Layer 1)
- Token-naming tests validate semantic usage (Layer 2)
- TypeScript (Web) is the reference implementation for cross-platform consistency
