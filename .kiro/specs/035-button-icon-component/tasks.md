# Implementation Plan: Button-Icon Component

**Date**: January 4, 2026
**Spec**: 035 - Button-Icon Component
**Status**: Implementation Planning
**Dependencies**: 
- Icon Component (Spec 004) - Icon rendering
- CTA Button Component - Pattern reference
- Accessibility Tokens - Focus ring tokens
- Radius Tokens - radiusCircle token (prerequisite)

---

## Implementation Plan

This implementation plan converts the Button-Icon Component design into actionable coding tasks. The component follows True Native Architecture with build-time platform separation, integrates with the mathematical token system, and maintains WCAG 2.1 AA accessibility compliance.

**Implementation Approach**:
1. Create prerequisite tokens first (token rename, new semantic tokens, radius tokens, component tokens)
2. Set up component directory structure following True Native Architecture pattern
3. Implement shared type definitions for cross-platform API consistency
4. Implement platform-specific versions (web, iOS, Android) with native interaction patterns
5. Create comprehensive tests using dual validation approach

**Key Principles**:
- Token-based styling (zero hard-coded values)
- Mathematical consistency (8px baseline grid alignment)
- Accessibility-first (WCAG 2.1 AA compliance)
- Self-contained focus ring (buffer included in component)
- Platform-specific press feedback (scale on iOS, ripple on Android)

---

## Task List

- [x] 1. Create Prerequisite Tokens

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Token rename (`color.text.onPrimary` → `color.contrast.onPrimary`) complete
  - New semantic token `color.background.primary.subtle` created
  - `radiusHalf` primitive token created with platform-specific values
  - `radiusCircle` semantic token created referencing `radiusHalf`
  - `buttonIcon.inset.*` component tokens created
  - All tokens generate correctly for web, iOS, Android
  - Existing tests pass after token changes
  
  **Primary Artifacts:**
  - `src/tokens/semantic/ColorTokens.ts` (token rename + new token)
  - `src/tokens/RadiusTokens.ts` (radiusHalf primitive)
  - `src/tokens/semantic/RadiusTokens.ts` (radiusCircle semantic)
  - `src/components/core/ButtonIcon/buttonIcon.tokens.ts` (component tokens)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/035-button-icon-component/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/035-button-icon-component/task-1-summary.md`
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Create Prerequisite Tokens"`

  - [x] 1.1 Rename color.text.onPrimary to color.contrast.onPrimary
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Rename token in `SemanticColorTokens.ts`
    - Update CTA Button Component to use `color.contrast.onPrimary`
    - Update any other references to `color.text.onPrimary`
    - Verify token generates correctly for all platforms
    - _Requirements: 2.1_

  - [x] 1.2 Create color.background.primary.subtle semantic token
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add `color.background.primary.subtle` to `SemanticColorTokens.ts`
    - Reference `purple100` primitive
    - Add description for hover states and selections
    - Verify token generates correctly for all platforms
    - _Requirements: 7.2, 8.2_

  - [x] 1.3 Create radiusHalf primitive token
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add `radiusHalf` to `RadiusTokens.ts`
    - Set baseValue to 50 (representing 50%)
    - Configure platform values: web `50%`, iOS `Circle` shape, Android `50` percent
    - Add description and mathematical relationship documentation
    - _Requirements: 3.1_

  - [x] 1.4 Create radiusCircle semantic token
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add `radiusCircle` to `SemanticRadiusTokens.ts`
    - Reference `radiusHalf` primitive token
    - Add description documenting use cases (circular buttons, avatars, badges)
    - Register with SemanticTokenRegistry
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [x] 1.5 Create buttonIcon.inset component tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/components/core/ButtonIcon/buttonIcon.tokens.ts`
    - Add `buttonIcon.inset.large` (12px, references `space.inset.150`)
    - Add `buttonIcon.inset.medium` (10px, unique value)
    - Add `buttonIcon.inset.small` (8px, references `space.inset.100`)
    - Export token getter function
    - _Requirements: 10.1, 10.2, 10.3_


- [x] 2. Set Up Component Directory Structure

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Component directory follows True Native Architecture pattern
  - Directory structure matches Icon Component and CTA Button patterns
  - Shared type definitions complete with all props
  - README.md provides component overview and usage guidance
  
  **Primary Artifacts:**
  - `src/components/core/ButtonIcon/` directory structure
  - `src/components/core/ButtonIcon/types.ts`
  - `src/components/core/ButtonIcon/README.md`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/035-button-icon-component/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/035-button-icon-component/task-2-summary.md`
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 2 Complete: Set Up Component Directory Structure"`

  - [x] 2.1 Create component directory structure
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create `src/components/core/ButtonIcon/` directory
    - Create `src/components/core/ButtonIcon/platforms/web/` subdirectory
    - Create `src/components/core/ButtonIcon/platforms/ios/` subdirectory
    - Create `src/components/core/ButtonIcon/platforms/android/` subdirectory
    - Create `src/components/core/ButtonIcon/__tests__/` subdirectory
    - _Requirements: 14.3_

  - [x] 2.2 Create shared type definitions
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `types.ts` with `ButtonIconSize` type ('small' | 'medium' | 'large')
    - Create `ButtonIconVariant` type ('primary' | 'secondary' | 'tertiary')
    - Create `ButtonIconProps` interface with required props (icon, ariaLabel, onPress)
    - Add optional props (size, variant, testID) with defaults noted
    - Note: No `disabled` prop by design
    - Add JSDoc comments for all types and interfaces
    - _Requirements: 1.5, 2.4, 4.1, 11.1_

  - [x] 2.3 Create component README
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create README.md with component overview
    - Document size variants with token references
    - Document visual styles (primary, secondary, tertiary)
    - Document props API with examples
    - Document required `ariaLabel` prop for accessibility
    - Document no disabled state design decision with alternatives
    - _Requirements: 11.2_

- [ ] 3. Implement Web Platform

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Web button-icon component renders with all size and style variants
  - Token-based styling via CSS custom properties working
  - Icon integration with Icon Component functional
  - Circular shape via radiusCircle token working
  - Interaction states (hover, pressed, focus) working correctly
  - Focus ring contained within buffer
  - Accessibility features (WCAG 2.1 AA) implemented
  - Touch target meets tapAreaRecommended for all sizes
  
  **Primary Artifacts:**
  - `src/components/core/ButtonIcon/platforms/web/ButtonIcon.web.ts`
  - `src/components/core/ButtonIcon/platforms/web/ButtonIcon.web.css`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/035-button-icon-component/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/035-button-icon-component/task-3-summary.md`
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 3 Complete: Implement Web Platform"`

  - [ ] 3.1 Create Web Component structure
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `ButtonIcon.web.ts` extending HTMLElement
    - Attach Shadow DOM for style encapsulation
    - Import `ButtonIconProps` from shared types
    - Implement observed attributes for reactivity (icon, aria-label, size, variant)
    - Add semantic `<button>` element with type="button"
    - Register custom element as `<button-icon>`
    - _Requirements: 4.2, 14.3_

  - [ ] 3.2 Implement CSS styling with token consumption
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `ButtonIcon.web.css` with CSS custom properties
    - Implement circular shape via `border-radius: 50%` (radiusCircle token)
    - Implement size variant styles using icon and inset tokens
    - Implement focus buffer margin on all sides
    - Implement style variant styles (primary, secondary, tertiary)
    - Use token references for all styling (colors, spacing)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 3.2, 4_

  - [ ] 3.3 Implement icon integration
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Import Icon component from Icon Component
    - Render icon using `<icon-base>` with correct size token
    - Apply icon color based on variant
    - Mark icon as decorative (`aria-hidden="true"`)
    - Center icon within circular button
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 4.5_

  - [ ] 3.4 Implement accessibility features
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Apply `aria-label` attribute from ariaLabel prop
    - Validate ariaLabel is provided (warn if empty)
    - Use semantic `<button>` element
    - Implement keyboard navigation (Tab, Enter, Space)
    - Add testID prop support via data-testid attribute
    - _Requirements: 4.1, 4.2, 4.5_

  - [ ] 3.5 Implement focus ring with buffer
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement focus ring using `accessibility.focus.*` tokens
    - Position focus ring at `accessibility.focus.offset` from visual button
    - Ensure focus ring contained within buffer (no overflow)
    - Use `:focus-visible` for keyboard-only focus indicators
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ] 3.6 Implement interaction states
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement hover state with `blend.hoverDarker` overlay
    - Implement pressed state with `blend.pressedDarker` overlay
    - Maintain circular shape during all interaction states
    - Apply `cursor: pointer` on hover
    - Use `duration150` token for transitions
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 8.1, 8.2, 8.3, 8.6, 12.1, 12.2_

  - [ ] 3.7 Implement secondary border shift prevention
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Reserve `borderEmphasis` (2px) border space
    - Simulate `borderDefault` (1px) with inset box-shadow
    - Transition to actual border on hover/pressed
    - Verify no layout shift during state transitions
    - _Requirements: 9.1, 9.2, 9.3_

  - [ ] 3.8 Implement touch target extension for small size
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Small size needs touch target extended to `tapAreaRecommended`
    - Implement invisible hit area extension using CSS pseudo-element
    - Maintain visual button size while providing 48px interactive area
    - Verify medium and large meet minimum without extension
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_


- [ ] 4. Implement iOS Platform

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - iOS button-icon component renders with all size and style variants
  - Token-based styling via Swift constants working
  - Icon integration with Icon Component functional
  - Circular shape via Circle() clip shape working
  - Platform-specific interaction (scale transform on press) working
  - Touch target meets tapAreaRecommended for all sizes
  
  **Primary Artifacts:**
  - `src/components/core/ButtonIcon/platforms/ios/ButtonIcon.swift`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/035-button-icon-component/completion/task-4-parent-completion.md`
  - Summary: `docs/specs/035-button-icon-component/task-4-summary.md`
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 4 Complete: Implement iOS Platform"`

  - [ ] 4.1 Create SwiftUI component structure
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `ButtonIcon.swift` with SwiftUI View struct
    - Define ButtonIconSize and ButtonIconVariant enums matching TypeScript types
    - Define ButtonIcon struct with required properties (icon, ariaLabel, onPress)
    - Define optional properties with defaults (size: .medium, variant: .primary)
    - Implement Button view with action closure
    - _Requirements: 1.5, 2.4, 4.1, 11.1, 14.3_

  - [ ] 4.2 Implement styling with Swift token constants
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Import generated Swift token constants
    - Implement circular shape via `.clipShape(Circle())`
    - Implement size variant styling using icon and inset tokens
    - Implement focus buffer via frame sizing
    - Implement style variant styling (primary, secondary, tertiary)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 3.3_

  - [ ] 4.3 Implement icon integration
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Import Icon component from Icon Component
    - Render icon with correct size token
    - Apply icon color based on variant
    - Mark icon as decorative (`.accessibilityHidden(true)`)
    - Center icon within circular button
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.6_

  - [ ] 4.4 Implement iOS-specific interaction patterns
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement scale transform to 0.97 on press
    - Add animation for scale transform
    - Use @State variable to track pressed state
    - Apply `.scaleEffect()` modifier with animation
    - _Requirements: 8.4_

  - [ ] 4.5 Implement accessibility features
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Apply `.accessibilityLabel()` modifier with ariaLabel value
    - Add `.accessibilityIdentifier()` for testID support
    - Extend touch target to `tapAreaRecommended` using `.frame(minWidth:minHeight:)`
    - Maintain visual size while providing 48pt interactive area
    - _Requirements: 4.3, 5.1, 5.2, 5.3, 5.4_

- [ ] 5. Implement Android Platform

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Android button-icon component renders with all size and style variants
  - Token-based styling via Kotlin constants working
  - Icon integration with Icon Component functional
  - Circular shape via CircleShape working
  - Platform-specific interaction (Material ripple) working
  - Touch target meets tapAreaRecommended for all sizes
  
  **Primary Artifacts:**
  - `src/components/core/ButtonIcon/platforms/android/ButtonIcon.kt`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/035-button-icon-component/completion/task-5-parent-completion.md`
  - Summary: `docs/specs/035-button-icon-component/task-5-summary.md`
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 5 Complete: Implement Android Platform"`

  - [ ] 5.1 Create Jetpack Compose component structure
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `ButtonIcon.kt` with @Composable function
    - Define ButtonIconSize and ButtonIconVariant enums matching TypeScript types
    - Define ButtonIcon composable with required parameters (icon, ariaLabel, onPress)
    - Define optional parameters with defaults (size, variant, testID)
    - Use Box for layout with centered content
    - _Requirements: 1.5, 2.4, 4.1, 11.1, 14.3_

  - [ ] 5.2 Implement styling with Kotlin token constants
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Import generated Kotlin token constants
    - Implement circular shape via `CircleShape`
    - Implement size variant styling using icon and inset tokens
    - Implement focus buffer via outer Box sizing
    - Implement style variant styling (primary, secondary, tertiary)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 3.4_

  - [ ] 5.3 Implement icon integration
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Import Icon component from Icon Component
    - Render icon with correct size token
    - Apply icon color based on variant
    - Mark icon as decorative (`contentDescription = null`)
    - Center icon within circular button
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.7_

  - [ ] 5.4 Implement Android-specific interaction patterns
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement Material ripple effect with `rememberRipple()`
    - Configure ripple color based on variant
    - Apply ripple via indication parameter
    - Use MutableInteractionSource for interaction tracking
    - _Requirements: 8.5_

  - [ ] 5.5 Implement accessibility features
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Apply `contentDescription` via semantics modifier
    - Add test tag for testID support
    - Extend touch target to `tapAreaRecommended` using `Modifier.sizeIn()`
    - Maintain visual size while providing 48dp interactive area
    - _Requirements: 4.4, 5.1, 5.2, 5.3, 5.4_


- [ ] 6. Create Component Tests

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Property-based tests cover all 13 correctness properties
  - Unit tests cover edge cases and examples
  - Stemma validators integrated for static analysis
  - All tests pass
  - Cross-platform token consistency verified
  
  **Primary Artifacts:**
  - `src/components/core/ButtonIcon/__tests__/ButtonIcon.test.ts`
  - `src/components/core/ButtonIcon/__tests__/ButtonIcon.properties.test.ts`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/035-button-icon-component/completion/task-6-parent-completion.md`
  - Summary: `docs/specs/035-button-icon-component/task-6-summary.md`
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 6 Complete: Create Component Tests"`

  - [ ] 6.1 Set up test infrastructure
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Configure Jest for web components
    - Create test utilities for custom element registration
    - Create helper for shadow DOM rendering waits
    - Write one smoke test to verify setup works
    - _Requirements: Testing infrastructure_

  - [ ] 6.2 Write property-based tests (Properties 1-7)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - **Property 1**: Size→Token Mapping - verify all sizes use correct tokens
    - **Property 2**: Focus Buffer Presence - verify buffer on all configs
    - **Property 3**: Variant→Styling Mapping - verify all variants have correct styling
    - **Property 4**: Circular Shape Token - verify radiusCircle usage
    - **Property 5**: ariaLabel Applied - verify aria-label in output
    - **Property 6**: Icon Decorative - verify aria-hidden on icon
    - **Property 7**: Touch Target Minimum - verify all sizes meet 48px
    - _Requirements: 1.1-1.4, 2.1-2.3, 3.1, 4.2, 4.5, 5.1-5.4_

  - [ ] 6.3 Write property-based tests (Properties 8-13)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - **Property 8**: Focus Ring Styling - verify focus ring tokens and containment
    - **Property 9**: Hover State Styling - verify blend tokens per variant
    - **Property 10**: Pressed State Styling - verify blend tokens per variant
    - **Property 11**: Secondary Border No Layout Shift - verify dimensions stable
    - **Property 12**: Animation Tokens - verify duration150 usage
    - **Property 13**: Icon Component Integration - verify Icon props
    - _Requirements: 6.1-6.3, 7.1-7.4, 8.1-8.3, 9.1-9.2, 12.1-12.2, 13.1-13.4_

  - [ ] 6.4 Write unit tests for edge cases
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test default prop values (size: medium, variant: primary)
    - Test focus-visible vs focus (mouse click vs keyboard)
    - Test empty ariaLabel warning
    - Test box-shadow technique for secondary border
    - _Requirements: 1.5, 2.4, 6.4, 6.5, 9.3_

  - [ ] 6.5 Integrate Stemma validators
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add component naming validation
    - Add token usage validation (no hardcoded values)
    - Add required props validation
    - Add accessibility attribute validation
    - _Requirements: Static analysis_

---

## Notes

- All tasks follow the three-tier validation system
- Parent tasks include success criteria and completion documentation paths
- Subtasks include task type and validation tier metadata
- Property-based tests map to correctness properties from design document
- Platform-specific press feedback: scale on iOS, ripple on Android, CSS on web
- No disabled state by design - document alternatives in README
