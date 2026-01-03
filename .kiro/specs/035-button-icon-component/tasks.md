# Implementation Plan: Button-Icon Component

**Date**: January 3, 2026
**Spec**: 035 - Button-Icon Component
**Status**: Implementation Planning
**Dependencies**: 
- Icon Component - Icon rendering
  - Status: Complete
  - Required for: Task 3 (icon integration)
  - Integration point: `<icon-base>` web component, Icon SwiftUI/Compose views
- CTA Button Component - Pattern reference
  - Status: Complete
  - Required for: Architecture patterns, style matrix
- Accessibility Tokens - Focus ring tokens
  - Status: Complete
  - Required for: Task 3 (focus ring implementation)
  - Integration point: `accessibility.focus.*` tokens

---

## Implementation Plan

This implementation plan converts the Button-Icon Component design into actionable coding tasks. The component follows True Native Architecture with build-time platform separation, integrates with the mathematical token system, and maintains WCAG 2.1 AA accessibility compliance.

**Implementation Approach**:
1. Create prerequisite tokens first (token rename, radiusCircle, component tokens)
2. Set up component directory structure following True Native Architecture pattern
3. Implement shared type definitions for cross-platform API consistency
4. Implement platform-specific versions (web, iOS, Android) with native interaction patterns
5. Create comprehensive tests using dual validation approach:
   - Stemma validators (linting) for structural validation
   - Runtime tests for behavioral validation
6. Document component usage and token consumption

**Key Principles**:
- Token-based styling (zero hard-coded values)
- Mathematical consistency (8px baseline grid alignment)
- Accessibility-first (WCAG 2.1 AA compliance)
- Self-contained focus ring (4px buffer included in component)
- Platform-specific press feedback (scale on iOS, ripple on Android)

---

## Task List

- [ ] 1. Create Prerequisite Tokens

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Token rename (`color.text.onPrimary` → `color.contrast.onPrimary`) complete
  - `radiusHalf` primitive token created with platform-specific values
  - `radiusCircle` semantic token created referencing `radiusHalf`
  - `buttonIcon.inset.*` component tokens created
  - Platform generators updated to handle new unit types
  - All tokens generate correctly for web, iOS, Android
  
  **Primary Artifacts:**
  - `src/tokens/semantic/ColorTokens.ts` (token rename)
  - `src/tokens/RadiusTokens.ts` (radiusHalf primitive)
  - `src/tokens/semantic/RadiusTokens.ts` (radiusCircle semantic)
  - `src/tokens/component/ButtonIconTokens.ts` (component tokens)
  - `src/types/PrimitiveToken.ts` (unit type extensions)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/035-button-icon-component/completion/task-1-completion.md`
  - Summary: `docs/specs/035-button-icon-component/task-1-summary.md` (triggers release detection)

  - [ ] 1.1 Rename color.text.onPrimary to color.contrast.onPrimary
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Rename token in `SemanticColorTokens.ts`
    - Update CTA Button Component to use `color.contrast.onPrimary`
    - Update any other references to `color.text.onPrimary`
    - Verify token generates correctly for all platforms
    - Run tests to ensure no regressions
    - _Requirements: 2.1, 10.1_

  - [ ] 1.2 Extend PrimitiveToken unit types
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add `'%'` unit type for web platform
    - Add `'shape'` unit type for iOS platform
    - Add `'percent'` unit type for Android platform
    - Update type definitions in `PrimitiveToken.ts`
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [ ] 1.3 Create radiusHalf primitive token
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add `radiusHalf` to `RadiusTokens.ts`
    - Set baseValue to 50 (representing 50%)
    - Configure platform values: web `{ value: 50, unit: '%' }`, iOS `{ value: 'Circle', unit: 'shape' }`, Android `{ value: 50, unit: 'percent' }`
    - Add description and mathematical relationship documentation
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [ ] 1.4 Create radiusCircle semantic token
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add `radiusCircle` to `SemanticRadiusTokens.ts`
    - Reference `radiusHalf` primitive token
    - Add description documenting use cases (circular buttons, avatars, badges)
    - Register with SemanticTokenRegistry
    - _Requirements: 3.1, 3.5_

  - [ ] 1.5 Update platform generators for new unit types
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update web generator to output `50%` for `'%'` unit
    - Update iOS generator to output `.clipShape(Circle())` for `'shape'` unit
    - Update Android generator to output `RoundedCornerShape(50)` for `'percent'` unit
    - Test generation for all platforms
    - _Requirements: 3.2, 3.3, 3.4_

  - [ ] 1.6 Create buttonIcon.inset component tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `ButtonIconTokens.ts` in component tokens directory
    - Add `buttonIcon.inset.large` referencing `inset.150` (12px)
    - Add `buttonIcon.inset.medium` with unique value (10px)
    - Add `buttonIcon.inset.small` referencing `inset.100` (8px)
    - Register tokens with component token system
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [ ] 1.7 Write property tests for token generation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - **Property 4: Circular Shape via Token** - Verify radiusCircle outputs 50% on web
    - **Property 5: Component Tokens for Inset Padding** - Verify all three component tokens resolve correctly
    - Test token references resolve to correct primitive values
    - _Requirements: 3.1, 3.2, 4.1, 4.2, 4.3_

- [ ] 2. Checkpoint - Verify Token Prerequisites
  - Ensure all prerequisite tokens created and generating correctly
  - Run `npm test` to verify no regressions
  - Ask the user if questions arise

- [ ] 3. Set Up Component Directory Structure

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Component directory follows True Native Architecture pattern
  - Directory structure matches Icon Component and CTA Button patterns
  - All required subdirectories and placeholder files created
  - Shared type definitions complete with all props
  - README.md provides component overview and usage guidance
  
  **Primary Artifacts:**
  - `src/components/core/ButtonIcon/` directory structure
  - `src/components/core/ButtonIcon/README.md`
  - `src/components/core/ButtonIcon/types.ts`
  - Platform subdirectories (web, ios, android)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/035-button-icon-component/completion/task-3-completion.md`
  - Summary: `docs/specs/035-button-icon-component/task-3-summary.md` (triggers release detection)

  - [ ] 3.1 Create component directory structure
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create `src/components/core/ButtonIcon/` directory
    - Create `src/components/core/ButtonIcon/platforms/` subdirectory
    - Create `src/components/core/ButtonIcon/platforms/web/` subdirectory
    - Create `src/components/core/ButtonIcon/platforms/ios/` subdirectory
    - Create `src/components/core/ButtonIcon/platforms/android/` subdirectory
    - Create `src/components/core/ButtonIcon/__tests__/` subdirectory
    - Create `src/components/core/ButtonIcon/examples/` subdirectory
    - _Requirements: 12.4_

  - [ ] 3.2 Create shared type definitions
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `types.ts` with `ButtonIconSize` type ('small' | 'medium' | 'large')
    - Create `ButtonIconVariant` type ('primary' | 'secondary' | 'tertiary')
    - Create `ButtonIconProps` interface with required props (icon, ariaLabel, onPress)
    - Create `ButtonIconProps` interface with optional props (size, variant, testID)
    - Note: No `disabled` prop by design
    - Add JSDoc comments for all types and interfaces
    - Export all types for platform implementations
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 11.1_

  - [ ] 3.3 Create component README
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create README.md with component overview
    - Document size variants (small, medium, large) with dimensions
    - Document visual styles (primary, secondary, tertiary)
    - Document props API with examples
    - Document required `ariaLabel` prop for accessibility
    - Document token consumption (icon sizes, colors, radius)
    - Include usage examples for common scenarios
    - Document accessibility features (WCAG 2.1 AA compliance)
    - Document no disabled state design decision with alternatives
    - _Requirements: 1.1-1.5, 2.1-2.4, 5.1-5.5, 11.1-11.3_

- [ ] 4. Implement Web Platform (Vanilla Web Components)

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Web button-icon component renders with all size and style variants
  - Token-based styling via CSS custom properties working
  - Icon integration with Icon Component functional
  - Circular shape via radiusCircle token working
  - Interaction states (hover, pressed, focus) working correctly
  - Focus ring contained within 4px buffer
  - Accessibility features (WCAG 2.1 AA) implemented and validated
  
  **Primary Artifacts:**
  - `src/components/core/ButtonIcon/platforms/web/ButtonIcon.web.ts`
  - `src/components/core/ButtonIcon/platforms/web/ButtonIcon.web.css`
  - Web-specific interaction patterns (hover, focus-visible)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/035-button-icon-component/completion/task-4-completion.md`
  - Summary: `docs/specs/035-button-icon-component/task-4-summary.md` (triggers release detection)

  - [ ] 4.1 Create Web Component structure
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `ButtonIcon.web.ts` extending HTMLElement
    - Attach Shadow DOM for style encapsulation
    - Import `ButtonIconProps` from shared types
    - Implement observed attributes for reactivity (icon, aria-label, size, variant)
    - Add semantic `<button>` element with proper type="button"
    - Implement icon rendering using `<icon-base>` component
    - Add className generation for size and style variants
    - Register custom element as `<button-icon-base>`
    - _Requirements: 1.1-1.5, 2.1-2.4, 3.1, 3.2_

  - [ ] 4.2 Implement CSS styling with token consumption
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `ButtonIcon.web.css` with CSS custom properties
    - Implement circular shape via `border-radius: 50%` (radiusCircle token)
    - Implement size variant styles (32px, 40px, 48px visual circles)
    - Implement 4px focus buffer margin on all sides
    - Implement style variant styles (primary, secondary, tertiary)
    - Use token references for all styling (colors, spacing)
    - Implement component token consumption for inset padding
    - _Requirements: 1.1-1.5, 2.1-2.4, 3.1, 3.2, 4.1-4.4_

  - [ ] 4.3 Implement icon integration
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Import Icon component from Icon Component
    - Render icon using `<icon-base>` with correct size token (size050, size075, size100)
    - Apply icon color based on variant (contrast.onPrimary for primary, primary for others)
    - Mark icon as decorative (`aria-hidden="true"`)
    - Center icon within circular button
    - _Requirements: 1.4, 5.5, 10.1, 10.2, 10.3_

  - [ ] 4.4 Implement accessibility features
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Apply `aria-label` attribute from ariaLabel prop
    - Validate ariaLabel is provided (warn if empty)
    - Use semantic `<button>` element with role="button"
    - Implement keyboard navigation (Tab, Enter, Space)
    - Add testID prop support via data-testid attribute
    - _Requirements: 5.1, 5.2, 5.5_

  - [ ] 4.5 Implement focus ring with buffer
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement focus ring using `accessibility.focus.*` tokens
    - Position focus ring at `accessibility.focus.offset` from visual circle
    - Ensure focus ring contained within 4px buffer (no overflow)
    - Use `:focus-visible` for keyboard-only focus indicators
    - Test focus ring doesn't clip or overlap adjacent elements
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [ ] 4.6 Implement interaction states
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement hover state with `blend.hoverDarker` overlay
    - Implement pressed state with `blend.pressedDarker` overlay
    - Maintain circular shape during all interaction states
    - Maintain icon color during interaction states
    - Apply `cursor: pointer` on hover
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 9.1, 9.2_

  - [ ] 4.7 Implement touch target extension for small size
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Small size (40px total box) needs 48px touch target
    - Implement invisible hit area extension using CSS pseudo-element or transparent padding
    - Maintain 32px visual circle while providing 48px interactive area
    - Verify medium (48px) and large (56px) meet minimum without extension
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [ ] 4.8 Write property tests for web implementation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - **Property 1: Size Dimensions Match Specification** - Test all size variants render correct dimensions
    - **Property 2: Variant Styling Matches Specification** - Test all variants have correct colors
    - **Property 6: Required ariaLabel Applied** - Test aria-label attribute present
    - **Property 7: Icon Marked as Decorative** - Test icon has aria-hidden="true"
    - **Property 9: Focus Ring Contained in Buffer** - Test focus ring doesn't overflow
    - _Requirements: 1.1-1.5, 2.1-2.4, 5.1, 5.2, 5.5, 7.1-7.3_

- [ ] 5. Checkpoint - Verify Web Implementation
  - Ensure web component renders correctly in browser
  - Run `npm test` to verify all tests pass
  - Ask the user if questions arise

- [ ] 6. Implement iOS Platform (SwiftUI)

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - iOS button-icon component renders with all size and style variants
  - Token-based styling via Swift constants working
  - Icon integration with Icon Component functional
  - Circular shape via Circle() clip shape working
  - Platform-specific interaction (scale transform on press) working
  - Touch target accessibility (48pt minimum) implemented
  
  **Primary Artifacts:**
  - `src/components/core/ButtonIcon/platforms/ios/ButtonIcon.ios.swift`
  - iOS-specific interaction patterns (scale transform)
  - Touch target extension for small buttons
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/035-button-icon-component/completion/task-6-completion.md`
  - Summary: `docs/specs/035-button-icon-component/task-6-summary.md` (triggers release detection)

  - [ ] 6.1 Create SwiftUI component structure
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `ButtonIcon.ios.swift` with SwiftUI View struct
    - Define ButtonIconSize and ButtonIconVariant enums matching TypeScript types
    - Define ButtonIcon struct with required properties (icon, ariaLabel, onPress)
    - Define optional properties with defaults (size: .medium, variant: .primary)
    - Implement Button view with action closure
    - Add @State for pressed state tracking
    - _Requirements: 1.1-1.5, 2.1-2.4, 11.1_

  - [ ] 6.2 Implement styling with Swift token constants
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Import generated Swift token constants
    - Implement circular shape via `.clipShape(Circle())`
    - Implement size variant styling (32pt, 40pt, 48pt visual circles)
    - Implement 4pt focus buffer via frame sizing
    - Implement style variant styling (primary, secondary, tertiary)
    - Apply color tokens via `.foregroundColor()` and `.background()`
    - Implement component token consumption for inset padding
    - _Requirements: 1.1-1.5, 2.1-2.4, 3.3, 4.1-4.4_

  - [ ] 6.3 Implement icon integration
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Import Icon component from Icon Component
    - Render icon with correct size (size050, size075, size100)
    - Apply icon color based on variant
    - Mark icon as decorative (`.accessibilityHidden(true)`)
    - Center icon within circular button
    - _Requirements: 1.4, 5.5, 10.1, 10.2, 10.3_

  - [ ] 6.4 Implement iOS-specific interaction patterns
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement scale transform to 0.97 (97%) on press
    - Add 100ms ease-out animation for scale transform
    - Use @State variable to track pressed state
    - Apply `.scaleEffect()` modifier with animation
    - _Requirements: 9.3_

  - [ ] 6.5 Implement accessibility features
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Apply `.accessibilityLabel()` modifier with ariaLabel value
    - Add `.accessibilityIdentifier()` for testID support
    - Extend touch target to 48pt minimum using `.frame(minWidth: 48, minHeight: 48)`
    - Maintain visual size while providing 48pt interactive area
    - _Requirements: 5.3, 6.1, 6.2, 6.3, 6.4_

- [ ] 7. Implement Android Platform (Jetpack Compose)

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Android button-icon component renders with all size and style variants
  - Token-based styling via Kotlin constants working
  - Icon integration with Icon Component functional
  - Circular shape via CircleShape working
  - Platform-specific interaction (Material ripple) working
  - Touch target accessibility (48dp minimum) implemented
  
  **Primary Artifacts:**
  - `src/components/core/ButtonIcon/platforms/android/ButtonIcon.android.kt`
  - Android-specific interaction patterns (Material ripple)
  - Touch target extension for small buttons
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/035-button-icon-component/completion/task-7-completion.md`
  - Summary: `docs/specs/035-button-icon-component/task-7-summary.md` (triggers release detection)

  - [ ] 7.1 Create Jetpack Compose component structure
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `ButtonIcon.android.kt` with @Composable function
    - Define ButtonIconSize and ButtonIconVariant enums matching TypeScript types
    - Define ButtonIcon composable with required parameters (icon, ariaLabel, onPress)
    - Define optional parameters with defaults (size, variant, testID)
    - Use Box for layout with centered content
    - Add remember state for interaction tracking
    - _Requirements: 1.1-1.5, 2.1-2.4, 11.1_

  - [ ] 7.2 Implement styling with Kotlin token constants
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Import generated Kotlin token constants
    - Implement circular shape via `CircleShape`
    - Implement size variant styling (32dp, 40dp, 48dp visual circles)
    - Implement 4dp focus buffer via outer Box sizing
    - Implement style variant styling (primary, secondary, tertiary)
    - Apply color tokens via background and tint
    - Implement component token consumption for inset padding
    - _Requirements: 1.1-1.5, 2.1-2.4, 3.4, 4.1-4.4_

  - [ ] 7.3 Implement icon integration
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Import Icon component from Icon Component
    - Render icon with correct size (SIZE_050, SIZE_075, SIZE_100)
    - Apply icon color based on variant
    - Mark icon as decorative (`contentDescription = null`)
    - Center icon within circular button
    - _Requirements: 1.4, 5.5, 10.1, 10.2, 10.3_

  - [ ] 7.4 Implement Android-specific interaction patterns
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement Material ripple effect with `rememberRipple()`
    - Configure ripple color based on variant (white for primary, primary for others)
    - Apply ripple via indication parameter
    - Use MutableInteractionSource for interaction tracking
    - Ensure ripple emanates from touch point
    - _Requirements: 9.4_

  - [ ] 7.5 Implement accessibility features
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Apply `contentDescription` via semantics modifier
    - Add test tag for testID support
    - Extend touch target to 48dp minimum using `Modifier.sizeIn(minWidth = 48.dp, minHeight = 48.dp)`
    - Maintain visual size while providing 48dp interactive area
    - _Requirements: 5.4, 6.1, 6.2, 6.3, 6.4_

- [ ] 8. Checkpoint - Verify All Platform Implementations
  - Ensure all three platforms render correctly
  - Run `npm test` to verify all tests pass
  - Verify cross-platform token consistency
  - Ask the user if questions arise

- [ ] 9. Create Component Tests

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Stemma validators integrated for static analysis (naming, token usage, properties)
  - Unit tests cover all component rendering scenarios (behavioral validation)
  - Interaction tests verify all user interactions work correctly
  - Accessibility tests validate WCAG 2.1 AA compliance
  - Visual regression tests catch unintended visual changes
  - Integration tests verify Icon Component contract
  - Property tests validate correctness properties from design
  
  **Primary Artifacts:**
  - `src/components/core/ButtonIcon/__tests__/ButtonIcon.test.ts`
  - `src/components/core/ButtonIcon/__tests__/ButtonIcon.accessibility.test.ts`
  - `src/components/core/ButtonIcon/__tests__/ButtonIcon.visual.test.ts`
  - `src/components/core/ButtonIcon/__tests__/ButtonIcon.integration.test.ts`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/035-button-icon-component/completion/task-9-completion.md`
  - Summary: `docs/specs/035-button-icon-component/task-9-summary.md` (triggers release detection)

  - [ ] 9.1 Set up test infrastructure and Stemma validators
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Configure Jest for web components
    - Create test utilities for custom element registration
    - Create helper for shadow DOM rendering waits
    - Import Stemma validators (validateComponentName, validateTokenUsage, validatePropertyAndAccessibility)
    - Create ButtonIcon schema for property validation
    - Write one smoke test to verify setup works
    - _Requirements: Testing infrastructure_

  - [ ] 9.2 Integrate Stemma static analysis validators
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - **Linting replaces runtime testing for structural validation**
    - Add `validateComponentName('ButtonIcon-Base')` test
    - Add `validateTokenUsage()` test for CSS output (catches hard-coded values)
    - Add `validatePropertyAndAccessibility()` test for required props
    - Verify validators catch missing ariaLabel, invalid icon names
    - **Property 3: Token-Only Styling** - Use `validateTokenUsage()` instead of runtime test
    - _Requirements: 2.4, 3.5, 5.1_

  - [ ] 9.3 Test basic rendering (behavioral)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test button-icon renders with required props (icon, ariaLabel, onPress)
    - Test default values (size: medium, variant: primary)
    - Test component mounts and renders in DOM
    - Test icon renders inside button
    - _Requirements: 1.2, 2.1_

  - [ ] 9.4 Test size variants (behavioral)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test all three size variants (small, medium, large)
    - Verify correct CSS classes applied for each size
    - Verify correct icon size token used for each size
    - Verify visual circle dimensions match specification
    - **Property 1: Size Dimensions Match Specification** - Test all sizes render correct dimensions
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [ ] 9.5 Test style variants (behavioral)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test all three style variants (primary, secondary, tertiary)
    - Verify correct CSS classes applied for each style
    - Verify correct icon color for each style
    - **Property 2: Variant Styling Matches Specification** - Test all variants have correct colors
    - _Requirements: 2.1, 2.2, 2.3, 10.1, 10.2, 10.3_

  - [ ] 9.6 Test accessibility features (behavioral)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test aria-label attribute applied from ariaLabel prop
    - Test button has correct ARIA role (role="button")
    - Test icon is marked decorative (aria-hidden="true")
    - Test button is keyboard focusable
    - Test focus indicator visible on keyboard navigation
    - Test focus indicator NOT visible on mouse click
    - **Property 6: Required ariaLabel Applied** - Test aria-label attribute present
    - **Property 7: Icon Marked as Decorative** - Test icon has aria-hidden="true"
    - **Property 10: Focus-Visible Only** - Verify focus ring behavior
    - _Requirements: 5.1, 5.2, 5.5, 7.4, 7.5_

  - [ ] 9.7 Test touch target accessibility (behavioral)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test small button has 48px minimum touch target
    - Test medium button has 48px minimum touch target
    - Test large button has 56px touch target (exceeds minimum)
    - Test visual size maintained while touch target extended
    - **Property 8: Touch Target Meets Minimum** - Verify all sizes meet 48px minimum
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [ ] 9.8 Test interaction states (behavioral)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test onPress called when button clicked
    - Test button receives focus via Tab key
    - Test onPress called when Enter key pressed while focused
    - Test onPress called when Space key pressed while focused
    - Test hover state applies correct styling
    - Test pressed state applies correct styling
    - **Property 11: Interaction States Preserve Shape and Icon** - Verify shape/icon during states
    - _Requirements: 8.1-8.4, 9.1, 9.2_

  - [ ] 9.9 Test circular shape (behavioral)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test border-radius is 50% (circular)
    - Test circular shape maintained during hover state
    - Test circular shape maintained during pressed state
    - Test circular shape maintained during focus state
    - **Property 4: Circular Shape via Token** - Verify radiusCircle outputs 50%
    - _Requirements: 3.1, 3.2, 8.4, 9.2, 11_

  - [ ] 9.10 Test token integration and Icon Component contract
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test icon size tokens used correctly (size050, size075, size100)
    - Test color tokens used correctly (primary, contrast.onPrimary)
    - Test component tokens used for inset padding
    - Test accessibility tokens used for focus ring
    - **Property 5: Component Tokens for Inset Padding** - Verify all three component tokens resolve correctly
    - **Property 9: Focus Ring Contained in Buffer** - Test focus ring doesn't overflow
    - _Requirements: 1.4, 2.4, 4.1-4.4, 7.1_

  - [ ] 9.11 Test cross-platform token consistency
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - **Property 12: Cross-Platform Token Consistency** - Verify token values match across platforms
    - Test web token output matches iOS token constants
    - Test web token output matches Android token constants
    - Verify sizing, spacing, and color tokens are identical
    - _Requirements: 12.1, 12.2_

- [ ] 10. Final Checkpoint - Ensure All Tests Pass
  - Run `npm test` to verify all tests pass
  - Verify test coverage meets requirements
  - Ask the user if questions arise

---

## Notes

- All tasks including property-based tests are required for comprehensive validation
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- **Dual Validation Approach**: Stemma validators (linting) for structural validation, runtime tests for behavioral validation
- **Linting validates**: Component naming, token usage patterns, required properties, schema compliance
- **Testing validates**: Rendering behavior, user interactions, accessibility features, cross-platform consistency
- Property tests validate universal correctness properties from design document
- Unit tests validate specific examples and edge cases
- No disabled state by design - document alternative patterns in README
- Loading state deferred to match CTA button approach
- Press animations are platform-specific (scale on iOS, ripple on Android, CSS on web)
