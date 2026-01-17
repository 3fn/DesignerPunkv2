# Implementation Plan: Avatar Component

**Date**: January 16, 2026
**Spec**: 042 - Avatar Component
**Status**: Implementation Planning
**Dependencies**: 
- Icon-Base Component - Icon component for placeholder icons (`<icon-base>` web, Icon SwiftUI, Icon Compose)
- Spacing Tokens - For avatar sizing
- Border Tokens - For avatar borders
- Opacity Tokens - For border opacity
- Motion Tokens - For hover transitions

---

## Implementation Plan

This implementation follows a phased approach:
1. **Phase 1**: Create prerequisite tokens (semantic colors, component tokens)
2. **Phase 2**: Implement web component with circle (human) and hexagon (agent) shapes
3. **Phase 3**: Implement iOS component with SwiftUI
4. **Phase 4**: Implement Android component with Jetpack Compose
5. **Phase 5**: Testing and documentation
6. **Phase 6**: Cross-platform validation

---

## Task List

- [x] 1. Create Prerequisite Tokens

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All 5 semantic color tokens created and registered
  - All 2 component icon size tokens created
  - All 6 avatar size component tokens created
  - Tokens generate correctly for all platforms (web, iOS, Android)
  - Token values match design specification
  
  **Primary Artifacts:**
  - Semantic color token definitions
  - Component token definitions for avatar sizes and icon sizes
  - Generated platform-specific token files
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/042-avatar-component/completion/task-1-completion.md`
  - Summary: `docs/specs/042-avatar-component/task-1-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Prerequisite Tokens"`
  - Verify: Check GitHub for committed changes

  - [x] 1.1 Create semantic color tokens for avatar backgrounds
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add `color.avatar.human` semantic token (references `orange300`)
    - Add `color.avatar.agent` semantic token (references `teal300`)
    - Verify tokens generate correctly for all platforms
    - _Requirements: 4.1, 4.2_

  - [x] 1.2 Create semantic color tokens for icon contrast
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add `color.avatar.contrast.onHuman` semantic token (references `white100`)
    - Add `color.avatar.contrast.onAgent` semantic token (references `white100`)
    - Verify tokens generate correctly for all platforms
    - _Requirements: 6.1, 6.2_

  - [x] 1.3 Create semantic color token for avatar border
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add `color.avatar.border` semantic token (references `gray100`)
    - Verify token generates correctly for all platforms
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [x] 1.4 Create component tokens for avatar sizes
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `avatar.size.xs` (references `space300` = 24px)
    - Create `avatar.size.sm` (references `space400` = 32px)
    - Create `avatar.size.md` (references `space500` = 40px)
    - Create `avatar.size.lg` (references `space600` = 48px)
    - Create `avatar.size.xl` (derivation: `SPACING_BASE_VALUE * 10` = 80px)
    - Create `avatar.size.xxl` (derivation: `SPACING_BASE_VALUE * 16` = 128px)
    - Verify tokens generate correctly for all platforms
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [x] 1.5 Create component tokens for icon sizes (gap fillers)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `avatar.icon.size.xs` (derivation: `SPACING_BASE_VALUE * 1.5` = 12px)
    - Create `avatar.icon.size.xxl` (derivation: `SPACING_BASE_VALUE * 8` = 64px)
    - Verify tokens generate correctly for all platforms
    - _Requirements: 3.1, 3.6_

  - [x] 1.6 Run token generation and verify output
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run token generation pipeline
    - Verify CSS custom properties generated for web
    - Verify Swift constants generated for iOS
    - Verify Kotlin constants generated for Android
    - Run existing token tests to ensure no regressions
    - _Requirements: 14.1, 14.2_

- [x] 2. Create Web Component Structure

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Avatar web component directory structure created
  - Custom element registered as `<avatar-base>`
  - Basic rendering working for both human (circle) and agent (hexagon) types
  - External CSS file architecture in place
  - SVG clipPath for hexagon shape implemented
  
  **Primary Artifacts:**
  - `src/components/core/Avatar/` directory
  - `platforms/web/Avatar.web.ts`
  - `platforms/web/Avatar.styles.css`
  - `platforms/web/hexagon-clip.svg`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/042-avatar-component/completion/task-2-completion.md`
  - Summary: `docs/specs/042-avatar-component/task-2-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 2 Complete: Web Component Structure"`
  - Verify: Check GitHub for committed changes

  - [x] 2.1 Create directory structure
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create `src/components/core/Avatar/` directory
    - Create `platforms/web/` subdirectory
    - Create `tokens/` subdirectory
    - Create `__tests__/` subdirectory
    - Create placeholder files
    - _Requirements: 11.1_

  - [x] 2.2 Implement base web component class
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `AvatarBaseElement` class extending `HTMLElement`
    - Define `observedAttributes` for all props (type, size, src, alt, interactive, decorative, testid)
    - Implement `connectedCallback()` with initial render
    - Implement `attributeChangedCallback()` for prop updates
    - Register custom element as `<avatar-base>`
    - _Requirements: 1.1, 1.5, 2.7, 11.1_

  - [x] 2.3 Create SVG clipPath for rounded hexagon
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `hexagon-clip.svg` with `<clipPath>` definition
    - Use `clipPathUnits="objectBoundingBox"` for responsive scaling
    - Implement pointy-top hexagon with vertices at correct positions
    - Add circles at vertices for rounded corners (Ana Tudor technique)
    - Verify aspect ratio matches `cos(30°) ≈ 0.866`
    - _Requirements: 1.2, 1.3, 1.4, 11.1, 11.2, 11.3, 11.4_

  - [x] 2.4 Create external CSS file
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `Avatar.styles.css`
    - Define `.avatar` base styles
    - Define `.avatar--human` with `border-radius: 50%`
    - Define `.avatar--agent` with `clip-path: url(#rounded-hexagon)` and correct aspect ratio
    - Define size variant classes (`.avatar--size-xs` through `.avatar--size-xxl`)
    - Use CSS custom properties from avatar tokens
    - _Requirements: 1.1, 1.2, 1.3, 2.1-2.6_

  - [x] 2.5 Implement shape rendering logic
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Render circle shape for `type="human"`
    - Render hexagon shape for `type="agent"` using SVG clipPath
    - Apply correct CSS classes based on type prop
    - Default to "human" type when prop omitted
    - _Requirements: 1.1, 1.2, 1.5_

  - [x] 2.6 Implement size rendering logic
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Apply correct size class based on size prop
    - Default to "md" size when prop omitted
    - Verify all six sizes render correctly
    - _Requirements: 2.1-2.7_

- [x] 3. Implement Web Component Content and Styling

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Icon content rendering correctly with Icon component integration
  - Image content rendering correctly for human avatars
  - Background colors applied correctly per type
  - Border styles applied correctly per size
  - Icon colors have correct contrast
  
  **Primary Artifacts:**
  - Icon integration in Avatar component
  - Image rendering with fallback logic
  - Complete CSS styling with all tokens
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/042-avatar-component/completion/task-3-completion.md`
  - Summary: `docs/specs/042-avatar-component/task-3-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 3 Complete: Web Content and Styling"`
  - Verify: Check GitHub for committed changes

  - [x] 3.1 Implement icon content rendering
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Integrate with `<icon-base>` web component
    - Render person icon for human type without image
    - Render bot/AI icon for agent type
    - Apply correct icon size based on avatar size (using icon size token mapping)
    - _Requirements: 3.1-3.8, 15.1, 15.2_

  - [x] 3.2 Implement image content rendering
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Render image when `src` prop provided for human type
    - Apply `object-fit: cover` for image scaling
    - Clip image to circle shape
    - Ignore `src` prop for agent type
    - _Requirements: 5.1, 5.2, 5.3, 5.5_

  - [x] 3.3 Implement image error handling
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add `onerror` handler to image element
    - Fall back to icon placeholder when image fails to load
    - Remove src attribute on error to prevent retry loops
    - _Requirements: 5.6_

  - [x] 3.4 Implement background color styling
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Apply `color.avatar.human` token for human type background
    - Apply `color.avatar.agent` token for agent type background
    - Hide background when image is displayed
    - _Requirements: 4.1, 4.2, 4.3_

  - [x] 3.5 Implement icon color styling
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Apply `color.avatar.contrast.onHuman` token for human type icons
    - Apply `color.avatar.contrast.onAgent` token for agent type icons
    - Pass color to Icon component
    - _Requirements: 6.1, 6.2_

  - [x] 3.6 Implement border styling
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Apply `borderDefault` width for xs through xl sizes
    - Apply `color.avatar.border` with `opacity.heavy` for xs through xl sizes
    - Apply `borderEmphasis` width for xxl size
    - Apply `color.contrast.onSurface` with full opacity for xxl size
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 4. Implement Web Component Interactive and Accessibility Features

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Interactive hover state working with border width transition
  - Decorative mode hiding avatar from screen readers
  - Alt text applied correctly to images
  - testID prop applied as data-testid attribute
  - No onPress/onClick prop (wrapper-delegated interaction)
  
  **Primary Artifacts:**
  - Interactive hover CSS styles
  - Accessibility attributes implementation
  - testID implementation
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/042-avatar-component/completion/task-4-completion.md`
  - Summary: `docs/specs/042-avatar-component/task-4-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 4 Complete: Web Interactive and Accessibility"`
  - Verify: Check GitHub for committed changes

  - [x] 4.1 Implement interactive hover state
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add `.avatar--interactive` CSS class when `interactive` prop is true
    - Implement hover state that increases border width from `borderDefault` to `borderEmphasis`
    - Apply `motion.duration.fast` token for transition
    - Default `interactive` to false when prop omitted
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [x] 4.2 Implement decorative mode
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Apply `aria-hidden="true"` when `decorative` prop is true
    - Default `decorative` to false when prop omitted
    - Ensure avatar is announced to screen readers when not decorative
    - _Requirements: 9.2, 9.3_

  - [x] 4.3 Implement image accessibility
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Apply `alt` attribute to image element
    - Require `alt` prop when `src` is provided (console warning in dev)
    - Ensure alt text is announced by screen readers
    - _Requirements: 5.4, 9.1_

  - [x] 4.4 Implement testID support
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Apply `data-testid` attribute when `testID` prop provided
    - Do not apply attribute when prop omitted
    - _Requirements: 16.1, 16.2_

  - [x] 4.5 Verify wrapper-delegated interaction pattern
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Confirm no `onPress` or `onClick` prop exists on component
    - Document wrapper usage pattern in README
    - Verify focus ring and touch targets are wrapper's responsibility
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [x] 5. Web Component Testing

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All unit tests passing
  - Web component lifecycle tests passing
  - Accessibility tests passing
  - Icon integration tests passing
  - Image loading and fallback tests passing
  
  **Primary Artifacts:**
  - `__tests__/Avatar.test.ts`
  - `__tests__/Avatar.accessibility.test.ts`
  - `__tests__/Avatar.lifecycle.test.ts`
  - `__tests__/Avatar.rendering.test.ts`
  - `__tests__/Avatar.icon-integration.test.ts`
  - `__tests__/Avatar.image.test.ts`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/042-avatar-component/completion/task-5-completion.md`
  - Summary: `docs/specs/042-avatar-component/task-5-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 5 Complete: Web Component Testing"`
  - Verify: Check GitHub for committed changes

  - [x] 5.1 Write core API tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test all prop combinations (type, size, src, alt, interactive, decorative, testID)
    - Test default values for all props
    - Test attribute reflection
    - Follow web component testing patterns from Test Development Standards
    - _Requirements: 1.5, 2.7, 8.4, 9.3, 16.2_

  - [x] 5.2 Write web component lifecycle tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test custom element registration
    - Test connectedCallback behavior
    - Test attributeChangedCallback behavior
    - Test shadow DOM initialization
    - _Requirements: 11.1_

  - [x] 5.3 Write rendering tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test circle shape for human type (CSS class verification)
    - Test hexagon shape for agent type (CSS class verification)
    - Test all six size variants (CSS class verification)
    - Test border styles per size
    - Test interactive hover state
    - _Requirements: 1.1, 1.2, 2.1-2.6, 7.1-7.4, 8.1-8.2_

  - [x] 5.4 Write accessibility tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test `aria-hidden` when decorative
    - Test `alt` text on images
    - Test screen reader announcements
    - Test no `aria-hidden` when not decorative
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [x] 5.5 Write icon integration tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test Icon component integration (contract testing, not implementation)
    - Test correct icon size class per avatar size
    - Test correct icon color per avatar type
    - Test person icon for human placeholder
    - Test bot icon for agent placeholder
    - _Requirements: 3.1-3.8, 6.1, 6.2, 15.1, 15.2_

  - [x] 5.6 Write image handling tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test image display when src provided
    - Test image clipping to circle shape
    - Test fallback to icon on image error
    - Test src ignored for agent type
    - _Requirements: 5.1-5.6_

- [x] 6. iOS Implementation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - SwiftUI View implemented for Avatar
  - Circle shape working for human type
  - Custom RoundedPointyTopHexagon Shape working for agent type
  - All six sizes rendering correctly
  - Icon and image content rendering correctly
  - VoiceOver accessibility working
  - Consistent behavior with Web implementation
  
  **Primary Artifacts:**
  - `platforms/ios/Avatar.swift`
  - `platforms/ios/RoundedPointyTopHexagon.swift`
  - `platforms/ios/AvatarPreview.swift`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/042-avatar-component/completion/task-6-completion.md`
  - Summary: `docs/specs/042-avatar-component/task-6-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 6 Complete: iOS Implementation"`
  - Verify: Check GitHub for committed changes

  - [x] 6.1 Create iOS directory structure
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create `platforms/ios/` directory
    - Create placeholder Swift files
    - _Requirements: 12.1_

  - [x] 6.2 Implement RoundedPointyTopHexagon Shape
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    - Create custom `Shape` conforming struct
    - Implement `path(in:)` method with hexagon vertices
    - Use `addArc` for rounded corners at vertices
    - Maintain pointy-top orientation
    - Maintain aspect ratio of `cos(30°) ≈ 0.866`
    - _Requirements: 12.1, 12.2, 12.3_

  - [x] 6.3 Implement SwiftUI Avatar View structure
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `Avatar` SwiftUI View
    - Define props: type, size, src, alt, interactive, decorative, testID
    - Implement default values matching web component
    - Use `@ViewBuilder` for conditional content
    - _Requirements: 1.5, 2.7, 8.4, 9.3, 14.3_

  - [x] 6.4 Implement iOS shape rendering
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Use `Circle()` clipShape for human type
    - Use `RoundedPointyTopHexagon()` clipShape for agent type
    - Apply correct frame size based on size prop
    - _Requirements: 1.1, 1.2, 12.1, 12.2, 12.3_

  - [x] 6.5 Implement iOS icon content
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Integrate with Icon SwiftUI view
    - Render person icon for human placeholder
    - Render bot icon for agent placeholder
    - Apply correct icon size based on avatar size
    - Apply correct icon color based on avatar type
    - _Requirements: 3.1-3.8, 6.1, 6.2, 15.3_

  - [x] 6.6 Implement iOS image content
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Use `AsyncImage` for image loading
    - Apply `.scaledToFill()` for image scaling
    - Clip image to circle shape
    - Implement fallback to icon on load failure
    - Ignore src for agent type
    - _Requirements: 5.1, 5.2, 5.3, 5.5, 5.6_

  - [x] 6.7 Implement iOS styling
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Apply background colors using avatar color tokens
    - Apply border using `.overlay()` with stroke
    - Apply correct border width per size
    - Apply correct border color and opacity per size
    - _Requirements: 4.1, 4.2, 7.1-7.4_

  - [x] 6.8 Implement iOS accessibility
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Apply `.accessibilityHidden()` when decorative
    - Apply `.accessibilityIdentifier()` for testID
    - Ensure VoiceOver announces alt text for images
    - _Requirements: 9.1, 9.2, 9.3, 16.1, 16.2_

  - [x] 6.9 Create iOS preview and verify
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create SwiftUI Preview showing all type/size combinations
    - Include image examples
    - Include interactive examples
    - Verify visual consistency with web implementation
    - _Requirements: 14.1, 14.2, 14.3_

- [ ] 7. Android Implementation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Jetpack Compose Composable implemented for Avatar
  - Circle shape working for human type
  - Custom HexagonShape working for agent type
  - All six sizes rendering correctly
  - Icon and image content rendering correctly
  - TalkBack accessibility working
  - Consistent behavior with Web and iOS implementations
  
  **Primary Artifacts:**
  - `platforms/android/Avatar.kt`
  - `platforms/android/HexagonShape.kt`
  - `platforms/android/AvatarPreview.kt`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/042-avatar-component/completion/task-7-completion.md`
  - Summary: `docs/specs/042-avatar-component/task-7-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 7 Complete: Android Implementation"`
  - Verify: Check GitHub for committed changes

  - [ ] 7.1 Create Android directory structure
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create `platforms/android/` directory
    - Create placeholder Kotlin files
    - _Requirements: 13.1_

  - [ ] 7.2 Implement HexagonShape
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    - Create custom `Shape` implementing class
    - Implement `createOutline()` method with hexagon path
    - Use `quadraticBezierTo` for rounded corners at vertices
    - Maintain pointy-top orientation
    - Maintain aspect ratio of `cos(30°) ≈ 0.866`
    - _Requirements: 13.1, 13.2, 13.3_

  - [ ] 7.3 Implement Jetpack Compose Avatar Composable structure
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `Avatar` Composable function
    - Define parameters: type, size, src, alt, interactive, decorative, testID
    - Implement default values matching web component
    - Use `Box` with appropriate modifiers
    - _Requirements: 1.5, 2.7, 8.4, 9.3, 14.3_

  - [ ] 7.4 Implement Android shape rendering
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Use `CircleShape` with `Modifier.clip()` for human type
    - Use `HexagonShape()` with `Modifier.clip()` for agent type
    - Apply correct size based on size prop
    - _Requirements: 1.1, 1.2, 13.1, 13.2, 13.3_

  - [ ] 7.5 Implement Android icon content
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Integrate with Icon Compose component
    - Render person icon for human placeholder
    - Render bot icon for agent placeholder
    - Apply correct icon size based on avatar size
    - Apply correct icon color based on avatar type
    - _Requirements: 3.1-3.8, 6.1, 6.2, 15.4_

  - [ ] 7.6 Implement Android image content
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Use `AsyncImage` (Coil) for image loading
    - Apply `ContentScale.Crop` for image scaling
    - Clip image to circle shape
    - Implement fallback to icon on load failure
    - Ignore src for agent type
    - _Requirements: 5.1, 5.2, 5.3, 5.5, 5.6_

  - [ ] 7.7 Implement Android styling
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Apply background colors using avatar color tokens
    - Apply border using `Modifier.border()`
    - Apply correct border width per size
    - Apply correct border color and opacity per size
    - _Requirements: 4.1, 4.2, 7.1-7.4_

  - [ ] 7.8 Implement Android accessibility
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Apply `semantics { invisibleToUser() }` when decorative
    - Apply `Modifier.testTag()` for testID
    - Ensure TalkBack announces content description for images
    - _Requirements: 9.1, 9.2, 9.3, 16.1, 16.2_

  - [ ] 7.9 Create Android preview and verify
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create Compose Preview showing all type/size combinations
    - Include image examples
    - Include interactive examples
    - Verify visual consistency with web and iOS implementations
    - _Requirements: 14.1, 14.2, 14.3_

- [ ] 8. Documentation and Registration

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - README.md complete with all props, examples, and platform notes
  - Component registered in design system index
  - Token consumption documented
  - Accessibility considerations documented
  - Design-outline referenced for architectural decisions
  
  **Primary Artifacts:**
  - `src/components/core/Avatar/README.md`
  - Updated component index/exports
  - Updated browser-entry.ts
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/042-avatar-component/completion/task-8-completion.md`
  - Summary: `docs/specs/042-avatar-component/task-8-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 8 Complete: Documentation and Registration"`
  - Verify: Check GitHub for committed changes

  - [ ] 8.1 Create README documentation
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Document all props with types and descriptions
    - Include usage examples for human, agent, interactive, with image
    - Document token consumption (which tokens the component uses)
    - Include platform-specific implementation notes
    - Document accessibility considerations and usage patterns
    - Reference design-outline for architectural decisions
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 17.6, 17.7_

  - [ ] 8.2 Register web component in browser-entry
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Add import for Avatar web component
    - Register `<avatar-base>` custom element
    - Verify component is available in browser bundle
    - _Requirements: 11.1_

  - [ ] 8.3 Update component exports
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Add Avatar to component index exports
    - Update any component catalogs
    - Verify component is discoverable
    - _Requirements: 14.3_

- [ ] 9. Cross-Platform Validation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All three platforms behave consistently
  - Visual appearance matches across platforms
  - Accessibility works on all platforms
  - All requirements satisfied
  - Full test suite passes
  
  **Primary Artifacts:**
  - Cross-platform consistency verification
  - Final test results
  - Accessibility audit results
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/042-avatar-component/completion/task-9-completion.md`
  - Summary: `docs/specs/042-avatar-component/task-9-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 9 Complete: Cross-Platform Validation"`
  - Verify: Check GitHub for committed changes

  - [ ] 9.1 Run full test suite
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run `npm test` and verify all tests pass
    - Fix any failing tests
    - Verify no TypeScript errors
    - Verify no linting errors
    - _Requirements: 16.3_

  - [ ] 9.2 Cross-platform behavioral consistency verification
    **Type**: Implementation
    **Validation**: Tier 3 - Comprehensive
    - Verify all type/size combinations work identically across platforms
    - Verify icon rendering matches across platforms
    - Verify image handling matches across platforms
    - Verify border styles match across platforms
    - Document any platform-specific variations
    - _Requirements: 14.1, 14.2, 14.3_

  - [ ] 9.3 Cross-platform accessibility audit
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test screen reader on Web (NVDA/VoiceOver)
    - Test VoiceOver on iOS
    - Test TalkBack on Android
    - Verify decorative mode works on all platforms
    - Verify alt text announced on all platforms
    - _Requirements: 9.1-9.4_

  - [ ] 9.4 Visual consistency verification
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Compare hexagon shape rendering across platforms
    - Compare circle shape rendering across platforms
    - Compare border rendering across platforms
    - Compare icon sizing across platforms
    - Document any visual differences and rationale
    - _Requirements: 14.1, 14.2_

  - [ ] 9.5 Final documentation update
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Update README with any platform-specific findings
    - Document any cross-platform considerations discovered
    - Ensure all examples work on all platforms
    - _Requirements: 17.5_

---

## Notes

- Tasks are ordered to build incrementally on previous work
- Task 1 (tokens) must complete before any component implementation
- Web implementation (Tasks 2-5) should complete before iOS (Task 6) and Android (Task 7)
- The hexagon shape implementation is the most complex part - Tasks 2.3, 6.2, and 7.2 are Architecture type
- All tests follow the web component testing patterns from Test Development Standards
- Cross-platform validation (Task 9) ensures behavioral consistency across all three platforms
- Icon component integration assumes Spec 004 is complete and working

