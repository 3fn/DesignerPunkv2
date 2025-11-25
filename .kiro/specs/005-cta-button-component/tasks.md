# Implementation Plan: CTA Button Component

**Date**: November 19, 2025
**Spec**: 005 - CTA Button Component
**Status**: Implementation Planning
**Dependencies**: 
- Spec 004 (Icon System) - createIcon() function
  - Status: Complete
  - Required for: Task 3.3 (icon integration)
  - Integration point: createIcon({ name, size, color }) API
- Spec 006 (Icon Size Tokens) - Icon sizing tokens
  - Status: Complete
  - Required for: Task 3.3 (icon sizing)
  - Integration point: icon.size100, icon.size125 tokens
- Spec 007 (Accessibility Token Family) - Accessibility tokens
  - Status: Complete
  - Required for: Task 3.6 (accessibility features)
  - Integration point: accessibility.focus tokens

**Dependents**:
- Spec 008 (Icon Web Component Conversion) - Task 3.7 blocked on our Task 3.3
  - Waiting for: ButtonCTA web component functional in test environment
  - Waiting for: Icon integration implementation (Task 3.3)

---

## Implementation Plan

This implementation plan converts the CTA Button Component design into actionable coding tasks. The component follows True Native Architecture with build-time platform separation, integrates with the mathematical token system, and maintains WCAG 2.1 AA accessibility compliance.

**Implementation Approach**:
1. Create required semantic tokens first (color.text.onPrimary, color.icon.opticalBalance, space.inset.generous)
2. Set up component directory structure following True Native Architecture pattern
3. Implement shared type definitions for cross-platform API consistency
4. Implement platform-specific versions (web, iOS, Android) with native interaction patterns
5. Create comprehensive tests (unit, accessibility, visual regression, integration)
6. Document component usage and token consumption

**Key Principles**:
- Token-based styling (zero hard-coded values)
- Mathematical consistency (8px baseline grid alignment)
- Accessibility-first (WCAG 2.1 AA compliance)
- Platform-specific optimizations (native interaction patterns)

---

## Task List


- [x] 1. Create Required Semantic Tokens

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Three new semantic tokens created and registered with SemanticTokenRegistry
  - Tokens follow compositional architecture (reference primitive tokens)
  - Cross-platform generation working (web CSS, iOS Swift, Android Kotlin)
  - Token values validated against design specifications
  
  **Primary Artifacts:**
  - `src/tokens/semantic/ColorTokens.ts` (updated with new color tokens)
  - `src/tokens/semantic/SpacingTokens.ts` (updated with space.inset.generous)
  - Platform-specific generated token files
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/005-cta-button-component/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/005-cta-button-component/task-1-summary.md` (triggers release detection)

  - [x] 1.1 Create color.text.onPrimary semantic token
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add `onPrimary: 'white100'` to `SemanticColorTokens.text` object
    - Register token with SemanticTokenRegistry
    - Verify token references primitive `white100` correctly
    - Test token resolution in token system
    - _Requirements: 2.1, 14.1_

  - [x] 1.2 Create color.icon.opticalBalance blend token
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add `opticalBalance` to `SemanticColorTokens.icon` object
    - Configure blend token with `blend200` and `BlendDirection.LIGHTER`
    - Register token with SemanticTokenRegistry
    - Verify blend token applies 20% lighter modification
    - Test blend token with different base colors
    - _Requirements: 9.2, 9.3_

  - [x] 1.3 Create space.inset.generous semantic token
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add `generous: 'space400'` to `SemanticSpacingTokens.inset` object
    - Register token with SemanticTokenRegistry
    - Verify token references primitive `space400` (32px) correctly
    - Test token resolution in token system
    - _Requirements: 3.3_

  - [x] 1.4 Generate platform-specific token files
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run token generation for web platform (CSS custom properties)
    - Run token generation for iOS platform (Swift constants)
    - Run token generation for Android platform (Kotlin constants)
    - Verify all three new tokens appear in generated files
    - Verify token values are correct (white100, blend200, 32px)
    - _Requirements: 18.1, 18.2_


- [x] 2. Set Up Component Directory Structure

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Component directory follows True Native Architecture pattern
  - Directory structure matches Icon System (Spec 004) pattern
  - All required subdirectories and placeholder files created
  - README.md provides component overview and usage guidance
  
  **Primary Artifacts:**
  - `src/components/core/ButtonCTA/` directory structure
  - `src/components/core/ButtonCTA/README.md`
  - `src/components/core/ButtonCTA/types.ts`
  - Platform subdirectories (web, ios, android)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/005-cta-button-component/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/005-cta-button-component/task-2-summary.md` (triggers release detection)

  - [x] 2.1 Create component directory structure
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create `src/components/core/ButtonCTA/` directory
    - Create `src/components/core/ButtonCTA/platforms/` subdirectory
    - Create `src/components/core/ButtonCTA/platforms/web/` subdirectory
    - Create `src/components/core/ButtonCTA/platforms/ios/` subdirectory
    - Create `src/components/core/ButtonCTA/platforms/android/` subdirectory
    - Create `src/components/core/ButtonCTA/__tests__/` subdirectory
    - Create `src/components/core/ButtonCTA/examples/` subdirectory
    - _Requirements: 18.4_

  - [x] 2.2 Create shared type definitions
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `types.ts` with `ButtonSize` type ('small' | 'medium' | 'large')
    - Create `ButtonStyle` type ('primary' | 'secondary' | 'tertiary')
    - Create `ButtonProps` interface with all required and optional props
    - Add JSDoc comments for all types and interfaces
    - Export all types for platform implementations
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3_

  - [x] 2.3 Create component README
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create README.md with component overview
    - Document size variants (small, medium, large) with heights
    - Document visual styles (primary, secondary, tertiary)
    - Document props API with examples
    - Document token consumption (typography, spacing, colors)
    - Include usage examples for common scenarios
    - Document accessibility features (WCAG 2.1 AA compliance)
    - _Requirements: 1.1-1.7, 2.1-2.4_


- [x] 3. Implement Web Platform (Vanilla Web Components)

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Web button component renders with all size and style variants
  - Token-based styling via CSS custom properties working
  - Icon integration with Icon System (Spec 004) functional
  - Interaction states (hover, pressed, focus) working correctly
  - Accessibility features (WCAG 2.1 AA) implemented and validated
  
  **Primary Artifacts:**
  - `src/components/core/ButtonCTA/platforms/web/ButtonCTA.web.ts`
  - `src/components/core/ButtonCTA/platforms/web/ButtonCTA.web.css`
  - Web-specific interaction patterns (hover, focus-visible)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/005-cta-button-component/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/005-cta-button-component/task-3-summary.md` (triggers release detection)

  - [x] 3.1 Create Web Component structure
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `ButtonCTA.web.ts` extending HTMLElement
    - Attach Shadow DOM for style encapsulation
    - Import `ButtonProps` from shared types
    - Implement observed attributes for reactivity
    - Add semantic `<button>` element with proper type="button"
    - Implement icon-text layout with flexbox
    - Add className generation for size and style variants
    - Register custom element as `<button-cta>`
    - _Requirements: 1.1-1.7, 2.1-2.4, 15.4_

  - [x] 3.2 Implement CSS styling with token consumption
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `ButtonCTA.web.css` with CSS custom properties
    - Implement size variant styles (small: 40px, medium: 48px, large: 56px)
    - Implement style variant styles (primary, secondary, tertiary)
    - Use token references for all styling (typography, spacing, colors, radius)
    - Implement horizontal padding (spacious, expansive, generous)
    - Implement vertical padding (normal, comfortable)
    - Implement border radius (radius100, radius150, radius200)
    - Implement minimum width constraints
    - _Requirements: 1.1-1.7, 3.1-3.4, 4.1-4.4, 5.1-5.3, 6.1-6.4_

  - [x] 3.3 Implement icon integration
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Coordination**: This task unblocks Spec 008 Task 3.7 (Icon integration tests)
    **Critical**: Must work in test environment (shadow DOM must initialize correctly)
    **Integration Contract**: `.kiro/specs/integration-contracts/icon-buttoncta.md`
    
    - Import Icon component from Icon System (Spec 004)
    - Conditionally render icon when `icon` prop provided
    - Use correct icon size based on button size (size100 or size125)
    - Apply icon color with optical balance blend for secondary/tertiary
    - Implement icon-text spacing (tight for small, normal for medium/large)
    - Center icon vertically to button height (not text baseline)
    - Mark icon as decorative (aria-hidden="true")
    - **Fix test setup**: Ensure ButtonCTA shadow DOM initializes in test environment
    - **Verify integration**: Write basic tests proving icon rendering works
    - **Notify**: Update integration contract when complete
    - _Requirements: 8.1-8.6, 9.1-9.3_

  - [x] 3.4 Implement text wrapping and truncation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement default text wrapping behavior (multi-line support)
    - Implement `noWrap` prop for single-line truncation with ellipsis
    - Center-align text horizontally within button
    - Ensure button height grows with wrapped text
    - Maintain minimum height for all text lengths
    - _Requirements: 7.1-7.4_

  - [x] 3.5 Implement interaction states
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement hover state with opacity.hover (8% overlay)
    - Implement pressed state with opacity.pressed (16% overlay)
    - Implement focus state with accessibility.focus tokens
    - Use `:focus-visible` for keyboard-only focus indicators
    - Apply `cursor: pointer` on hover
    - Implement disabled state styling
    - _Requirements: 10.1-10.3, 11.1-11.3, 12.1-12.6_

  - [x] 3.6 Implement accessibility features
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Use semantic `<button>` element with role="button"
    - Implement keyboard navigation (Tab, Enter, Space)
    - Ensure focus indicators meet 3:1 contrast ratio
    - Verify color contrast meets 4.5:1 for all styles
    - Add testID prop for automated testing
    - Implement disabled state with aria-disabled
    - _Requirements: 12.1-12.6, 14.1-14.4, 15.1-15.4, 16.1-16.3_

  - [x] 3.7 FIX: Shadow DOM initialization in test environment
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Note**: Discovered during test validation (Task 6.5) - all 26 ButtonCTA tests failing due to shadow DOM being undefined
    - Investigate why shadowRoot is undefined in test environment
    - Debug component initialization timing (connectedCallback execution)
    - Ensure shadow DOM is available synchronously after appendChild
    - Add test-specific initialization if needed (e.g., manual connectedCallback call)
    - Verify component works in both browser and Jest/jsdom test environments
    - Run all ButtonCTA tests to confirm fix (expect 26/26 passing)
    - _Requirements: 1.1-1.7, 2.1-2.4, 7.1-7.4, 8.1-8.6, Testing infrastructure_


- [x] 4. Implement iOS Platform (SwiftUI)

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - iOS button component renders with all size and style variants
  - Token-based styling via Swift constants working
  - Icon integration with Icon System functional
  - Platform-specific interaction (scale transform on press) working
  - Touch target accessibility (44px minimum) implemented
  
  **Primary Artifacts:**
  - `src/components/core/ButtonCTA/platforms/ios/ButtonCTA.ios.swift`
  - iOS-specific interaction patterns (scale transform)
  - Touch target extension for small buttons
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/005-cta-button-component/completion/task-4-parent-completion.md`
  - Summary: `docs/specs/005-cta-button-component/task-4-summary.md` (triggers release detection)

  - [x] 4.1 Create SwiftUI component structure
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `ButtonCTA.ios.swift` with SwiftUI View struct
    - Define ButtonSize and ButtonStyle enums matching TypeScript types
    - Define ButtonCTA struct with all required and optional properties
    - Implement Button view with action closure
    - Use HStack for icon-text layout
    - Add @State for pressed state tracking
    - _Requirements: 1.1-1.7, 2.1-2.4_

  - [x] 4.2 Implement styling with Swift token constants
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Import generated Swift token constants
    - Implement size variant styling (40px, 48px, 56px heights)
    - Implement style variant styling (primary, secondary, tertiary)
    - Apply typography tokens via .font() modifier
    - Apply spacing tokens via .padding() modifiers
    - Apply color tokens via .foregroundColor() and .background()
    - Apply border radius via .cornerRadius() modifier
    - Implement minimum width constraints
    - _Requirements: 1.1-1.7, 3.1-3.4, 4.1-4.4, 5.1-5.3, 6.1-6.4_

  - [x] 4.3 Implement icon integration
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Import Icon component from Icon System
    - Conditionally render icon in HStack when provided
    - Use correct icon size based on button size
    - Apply icon color with optical balance for secondary/tertiary
    - Implement icon-text spacing via HStack spacing parameter
    - Center icon vertically within button height
    - Mark icon as decorative (.accessibilityHidden(true))
    - _Requirements: 8.1-8.6, 9.1-9.3_

  - [x] 4.4 Implement iOS-specific interaction patterns
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement scale transform to 0.97 (97%) on press
    - Add 100ms ease-out animation for scale transform
    - Use @State variable to track pressed state
    - Apply .scaleEffect() modifier with animation
    - Respect safe area insets for full-width buttons
    - Render border inside frame bounds
    - _Requirements: 17.2, 17.4, 17.5_

  - [x] 4.5 Implement touch target accessibility
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Extend small button (40px) touch target to 44px using .frame(minHeight: 44)
    - Maintain 40px visual height while providing 44px interactive area
    - Verify medium (48px) and large (56px) meet 44px minimum
    - Support Dynamic Type for text size preferences
    - Add accessibility identifier for testing
    - _Requirements: 13.1-13.4, 16.4_


- [x] 5. Implement Android Platform (Jetpack Compose)

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Android button component renders with all size and style variants
  - Token-based styling via Kotlin constants working
  - Icon integration with Icon System functional
  - Platform-specific interaction (Material ripple) working
  - Touch target accessibility (44dp minimum) implemented
  
  **Primary Artifacts:**
  - `src/components/core/ButtonCTA/platforms/android/ButtonCTA.android.kt`
  - Android-specific interaction patterns (Material ripple)
  - Touch target extension for small buttons
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/005-cta-button-component/completion/task-5-parent-completion.md`
  - Summary: `docs/specs/005-cta-button-component/task-5-summary.md` (triggers release detection)

  - [x] 5.1 Create Jetpack Compose component structure
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `ButtonCTA.android.kt` with @Composable function
    - Define ButtonSize and ButtonStyle enums matching TypeScript types
    - Define ButtonCTA composable with all required and optional parameters
    - Use Material3 Button composable as base
    - Use Row for icon-text layout
    - Add remember state for interaction tracking
    - _Requirements: 1.1-1.7, 2.1-2.4_

  - [x] 5.2 Implement styling with Kotlin token constants
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Import generated Kotlin token constants
    - Implement size variant styling (40dp, 48dp, 56dp heights)
    - Implement style variant styling (primary, secondary, tertiary)
    - Apply typography tokens via TextStyle
    - Apply spacing tokens via PaddingValues
    - Apply color tokens via ButtonColors
    - Apply border radius via RoundedCornerShape
    - Implement minimum width constraints via Modifier.widthIn()
    - _Requirements: 1.1-1.7, 3.1-3.4, 4.1-4.4, 5.1-5.3, 6.1-6.4_

  - [x] 5.3 Implement icon integration
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Import Icon component from Icon System
    - Conditionally render icon in Row when provided
    - Use correct icon size based on button size
    - Apply icon color with optical balance for secondary/tertiary
    - Implement icon-text spacing via Row arrangement
    - Center icon vertically within button height
    - Mark icon as decorative (contentDescription = null)
    - _Requirements: 8.1-8.6, 9.1-9.3_

  - [x] 5.4 Implement Android-specific interaction patterns
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement Material ripple effect with rememberRipple()
    - Configure ripple color as color.primary at 16% opacity
    - Apply ripple via indication parameter
    - Use MutableInteractionSource for interaction tracking
    - Ensure ripple emanates from touch point
    - _Requirements: 17.3_

  - [x] 5.5 Implement touch target accessibility
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Extend small button (40dp) touch target to 44dp using Modifier.heightIn(min = 44.dp)
    - Maintain 40dp visual height while providing 44dp interactive area
    - Verify medium (48dp) and large (56dp) meet 44dp minimum
    - Support TalkBack screen reader via semantics
    - Add test tag for automated testing
    - _Requirements: 13.1-13.4, 16.5_


- [x] 6. Create Component Tests

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Unit tests cover all component rendering scenarios
  - Interaction tests verify all user interactions work correctly
  - Accessibility tests validate WCAG 2.1 AA compliance
  - Visual regression tests catch unintended visual changes
  - Integration tests verify token system integration
  - Test coverage meets 90%+ for unit tests, 100% for accessibility
  
  **Primary Artifacts:**
  - `src/components/core/ButtonCTA/__tests__/ButtonCTA.test.tsx`
  - `src/components/core/ButtonCTA/__tests__/ButtonCTA.accessibility.test.tsx`
  - `src/components/core/ButtonCTA/__tests__/ButtonCTA.visual.test.tsx`
  - `src/components/core/ButtonCTA/__tests__/ButtonCTA.integration.test.tsx`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/005-cta-button-component/completion/task-6-parent-completion.md`
  - Summary: `docs/specs/005-cta-button-component/task-6-summary.md` (triggers release detection)

  - [x] 6.1 Set up test infrastructure
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Configure Jest for web components
    - Create test utilities for custom element registration
    - Create helper for shadow DOM rendering waits
    - Write one smoke test to verify setup works
    - _Requirements: Testing infrastructure_

  - [x] 6.2 Test basic rendering
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test button renders with required props (label)
    - Test default values (size: medium, style: primary)
    - Test component mounts and renders in DOM
    - _Requirements: 1.1, 1.2, 2.1_

  - [x] 6.3 Test size variants
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test all three size variants (small, medium, large)
    - Verify correct CSS classes applied for each size
    - _Requirements: 1.1-1.3_

  - [x] 6.4 Test style variants
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test all three style variants (primary, secondary, tertiary)
    - Verify correct CSS classes applied for each style
    - _Requirements: 2.1-2.3_

  - [x] 6.5 Test icon integration
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test icon renders when icon prop provided
    - Test icon doesn't render when icon prop omitted
    - Test icon sizing for different button sizes
    - Test icon marked as decorative (aria-hidden="true")
    - _Requirements: 8.1-8.6_

  - [x] 6.6 Test text and disabled state
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test text wrapping behavior (default multi-line)
    - Test noWrap prop truncates text with ellipsis
    - Test disabled prop prevents interaction
    - _Requirements: 7.1-7.4_

  - [x] 6.7 Create interaction tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test onPress called when button clicked
    - Test onPress NOT called when button disabled
    - Test button receives focus via Tab key
    - Test onPress called when Enter key pressed while focused
    - Test onPress called when Space key pressed while focused
    - Test multiple clicks call onPress multiple times
    - Test rapid clicks don't cause issues
    - _Requirements: 15.1-15.4_

  - [x] 6.8 Test ARIA and keyboard navigation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test button has correct ARIA role (role="button")
    - Test button is keyboard focusable
    - Test icon is marked decorative (aria-hidden="true")
    - Test focus indicator visible on keyboard navigation
    - _Requirements: 12.1-12.6, 15.1-15.4_

  - [x] 6.9 Test touch targets and contrast
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test small button meets 44px minimum touch target
    - Test medium and large buttons meet 44px minimum
    - Test primary button text has ≥4.5:1 contrast ratio
    - Test secondary button text has ≥4.5:1 contrast ratio
    - Test tertiary button text has ≥4.5:1 contrast ratio
    - Test focus outline has ≥3:1 contrast ratio
    - _Requirements: 13.1-13.4, 14.1-14.4, 16.1-16.5_

  - [x] 6.10 Test size and style variant snapshots
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create snapshot tests for all size variants (small, medium, large)
    - Create snapshot tests for all style variants (primary, secondary, tertiary)
    - _Requirements: 1.1-1.7, 2.1-2.4_

  - [x] 6.11 Test icon and text variant snapshots
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create snapshot tests for buttons with icons
    - Create snapshot tests for buttons without icons
    - Create snapshot tests for multi-line text
    - Create snapshot tests for truncated text (noWrap)
    - _Requirements: 7.1-7.4, 8.1-8.6_

  - [x] 6.12 Test interaction state snapshots
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create snapshot tests for hover state
    - Create snapshot tests for pressed state
    - Create snapshot tests for focus state
    - Create snapshot tests for disabled state
    - _Requirements: 10.1-10.3, 11.1-11.3, 12.1-12.6_

  - [x] 6.13 Test typography and spacing tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test small button uses typography.bodyMd
    - Test medium button uses typography.bodyMd
    - Test large button uses typography.bodyLg
    - Test small button uses space.inset.spacious (16px) horizontal padding
    - Test medium button uses space.inset.expansive (24px) horizontal padding
    - Test large button uses space.inset.generous (32px) horizontal padding
    - _Requirements: 1.5-1.7, 3.1-3.3_

  - [x] 6.14 Test color and radius tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test primary button uses color.primary background
    - Test primary button uses color.text.onPrimary text
    - Test secondary button uses color.primary text and border
    - Test small button uses radius100 (8px)
    - Test medium button uses radius150 (12px)
    - Test large button uses radius200 (16px)
    - _Requirements: 2.4, 4.1-4.3, 5.1-5.3_

  - [x] 6.15 Test icon and accessibility tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test small/medium button uses icon.size100 (24px)
    - Test large button uses icon.size125 (32px)
    - Test focus outline uses accessibility.focus tokens
    - _Requirements: 8.2-8.3, 12.1-12.4, 18.1-18.2_


- [x] 7. Create Component Documentation with Canary Pattern

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - README serves as single source of truth for component usage
  - HTML validation files provide automated validation of examples
  - Examples demonstrate all component variants and features
  - Documentation explains token consumption and customization
  - Accessibility guidance provided for proper usage
  - Cross-platform considerations documented
  
  **Primary Artifacts:**
  - `src/components/core/ButtonCTA/README.md` (comprehensive documentation with embedded examples)
  - `src/components/core/ButtonCTA/examples/BasicUsage.html` (validation canary)
  - `src/components/core/ButtonCTA/examples/WithIcon.html` (validation canary)
  - `src/components/core/ButtonCTA/examples/Variants.html` (validation canary)
  - `scripts/validate-examples.js` (validation script)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/005-cta-button-component/completion/task-7-parent-completion.md`
  - Summary: `docs/specs/005-cta-button-component/task-7-summary.md` (triggers release detection)

  - [x] 7.1 Create basic usage examples
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create BasicUsage.tsx with simple button examples
    - Demonstrate default button (medium, primary)
    - Demonstrate button with custom label
    - Demonstrate button with onPress handler
    - Demonstrate disabled button
    - Add code comments explaining each example
    - _Requirements: 1.1-1.7, 2.1-2.4_

  - [x] 7.1-Prototype PROTOTYPE: Executable Examples Pattern
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    
    **Purpose**: Validate executable examples approach before committing to pattern
    
    **Scope**:
    - Create `src/components/core/ButtonCTA/examples/` directory
    - Create 3 minimal HTML examples (BasicUsage.html, WithIcon.html, Variants.html)
    - Create simple validation script (`scripts/validate-examples.js`)
    - Manually test examples in browser
    - Document findings and recommendation in completion notes
    
    **Decision Point**: 
    - If successful → Adopt pattern for Tasks 7.2-7.5
    - If unsuccessful → Revert to minimal static examples with staleness warnings
    
    **Success Criteria**:
    - Examples are clearer than static comments would be
    - Examples break when component API changes (self-correcting)
    - Validation script is maintainable (~50 lines or less)
    - Manual testing feels reasonable (< 5 minutes)
    
    _Requirements: 7.1_

  - [x] 7.1-Resolution ASSESSMENT: Evaluate Example Documentation Approach
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    
    **Purpose**: Assess prototype results and decide on documentation pattern
    
    **Scope**:
    - Review Task 7.1 and Task 7.1-Prototype completion documentation
    - Compare original approach (7.1) vs executable examples (7.1-Prototype)
    - Evaluate against success criteria (clarity, self-correction, maintainability, testing burden)
    - Consider test suite volume concerns (FUTURE-test-suite-volume-analysis.md)
    - Compare executable examples vs tests-as-documentation vs static examples
    - Document decision with evidence-based reasoning
    - Update design.md Documentation Strategy section with decision
    - Update remaining Task 7 subtasks based on decision
    
    **Decision Options**:
    1. **Adopt executable examples**: Update Tasks 7.2-7.5 to use examples/ pattern
    2. **Use tests as documentation**: Reference __tests__/ files, no separate examples
    3. **Use minimal static examples**: README-only with "may be stale" warnings
    
    **Deliverables**:
    - Decision document at `.kiro/specs/005-cta-button-component/task-7-1-resolution.md`
    - Updated design.md Documentation Strategy section
    - Updated Task 7.2-7.5 subtasks (if pattern changes)
    
    _Requirements: 7.1_

  - [x] 7.2 Write comprehensive README documentation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create README.md with component overview and key features
    - Document basic usage with code examples
    - Document all size variants (small, medium, large) with examples
    - Document all visual styles (primary, secondary, tertiary) with examples
    - Document icon integration with examples
    - Document interaction states (hover, pressed, focus, disabled)
    - Include API reference table with props, types, and descriptions
    - Document accessibility features and WCAG compliance
    - Document platform-specific implementation notes
    - _Requirements: 1.1-1.7, 2.1-2.4, 9.1-9.3_

  - [x] 7.3 Create HTML validation files
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create BasicUsage.html with minimal button example
    - Create WithIcon.html with icon integration example
    - Create Variants.html with all size/style combinations
    - Add warning comment in <head> explaining validation purpose
    - Ensure validation files reference README as source of truth
    - Test validation files manually in browser
    - _Requirements: 1.1-1.7, 2.1-2.4, 9.1-9.3_

  - [x] 7.4 Update validation script
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update scripts/validate-examples.js to validate all HTML files
    - Ensure script checks that validation files load without errors
    - Add check that validation files include warning comment
    - Document validation script usage in README
    - Test validation script with all HTML validation files
    - _Requirements: 1.1-1.7, 2.1-2.4_

---

*This implementation plan provides actionable coding tasks with proper task type classification, validation tiers, and requirement traceability for the CTA Button Component.*
