# Requirements Document: Vertical List Button Item

**Date**: January 6, 2026
**Spec**: 038 - Vertical List Button Item
**Status**: Requirements Phase
**Dependencies**: 
- `Icon-Base` — Icon component for leading icons and checkmark indicator
- `Button-CTA` — Shares focus state patterns and padding compensation approach

---

## Introduction

The Vertical List Button Item is an individual button component designed for use within vertical list contexts. It renders visual states based on props received from a parent container/pattern, functioning as a "dumb" component that emits events and displays state without managing selection logic.

This component is consumed by the Vertical List Buttons Pattern (XXX-vertical-list-buttons-pattern), which manages selection modes, state transitions, and accessibility semantics at the container level.

---

## Glossary

- **Button_VerticalListItem**: The individual button component that renders visual states based on props
- **Visual_State**: The appearance mode of the button (rest, selected, notSelected, checked, unchecked)
- **Mode**: The selection behavior context set by the parent pattern (Tap, Select, Multi-Select)
- **Selection_Indicator**: The checkmark icon shown when an item is selected or checked
- **Padding_Compensation**: The technique of reducing padding when border width increases to maintain constant total height
- **Optical_Balance**: Color adjustment applied to icons to achieve visual consistency with text

---

## Requirements

### Requirement 1: Visual State Rendering

**User Story**: As a developer, I want the button to render different visual appearances based on its visual state prop, so that users can perceive the current selection status.

#### Acceptance Criteria

1. WHEN visualState is `rest` THEN Button_VerticalListItem SHALL render with `color.background` background, `borderDefault` (1px) border width, and `color.text.default` label color
2. WHEN visualState is `selected` THEN Button_VerticalListItem SHALL render with `color.select.selected.subtle` background, `borderEmphasis` (2px) border width, `color.select.selected.strong` border color, and `color.select.selected.strong` label color
3. WHEN visualState is `notSelected` THEN Button_VerticalListItem SHALL render with `color.select.notSelected.subtle` background, `borderDefault` (1px) border width, transparent border color, and `color.select.notSelected.strong` label color
4. WHEN visualState is `checked` THEN Button_VerticalListItem SHALL render with `color.select.selected.subtle` background, `borderDefault` (1px) border width, transparent border color, and `color.select.selected.strong` label color
5. WHEN visualState is `unchecked` THEN Button_VerticalListItem SHALL render with `color.background` background, `borderDefault` (1px) border width, transparent border color, and `color.text.default` label color

### Requirement 2: Selection Indicator Display

**User Story**: As a user, I want to see a checkmark when an item is selected or checked, so that I can clearly identify my selections.

#### Acceptance Criteria

1. WHEN visualState is `selected` OR `checked` THEN Button_VerticalListItem SHALL display the Selection_Indicator (checkmark) on the far right
2. WHEN visualState is `rest`, `notSelected`, OR `unchecked` THEN Button_VerticalListItem SHALL hide the Selection_Indicator
3. WHEN Selection_Indicator is visible THEN it SHALL use `color.select.selected.strong` with `color.icon.opticalBalance` blend applied
4. WHEN Selection_Indicator is visible AND error is true THEN it SHALL use `color.error.strong` with `color.icon.opticalBalance` blend applied
5. WHEN Selection_Indicator is displayed THEN it SHALL be marked as decorative with `aria-hidden="true"`

### Requirement 3: Error State Rendering

**User Story**: As a developer, I want to apply error styling to indicate validation failures, so that users understand when their selection is invalid.

#### Acceptance Criteria

1. WHEN error is true AND visualState is any Select mode state (rest, selected, notSelected) THEN Button_VerticalListItem SHALL render with `color.error.subtle` background, `borderEmphasis` (2px) border width, and `color.error.strong` border color
2. WHEN error is true AND visualState is any Multi-Select mode state (checked, unchecked) THEN Button_VerticalListItem SHALL render with `color.error.strong` label and icon colors only (no border or background change)
3. WHEN error is true THEN label and icon colors SHALL be `color.error.strong` regardless of mode
4. IF visualState is `rest` in Tap mode context THEN error prop SHALL have no effect (Tap mode has nothing to validate)

### Requirement 4: Content Layout

**User Story**: As a user, I want the button content to be clearly organized with label, optional description, and optional icon, so that I can understand each option.

#### Acceptance Criteria

1. THE Button_VerticalListItem SHALL always display a label using `typography.buttonMd` styling
2. WHEN description is provided THEN Button_VerticalListItem SHALL display it below the label using `typography.bodySm` styling
3. WHEN description is displayed THEN it SHALL use `color.text.muted` color regardless of visual state
4. WHEN leadingIcon is provided THEN Button_VerticalListItem SHALL display it on the far left, vertically centered to button height
5. WHEN leadingIcon is displayed THEN it SHALL use the same color as the label with `color.icon.opticalBalance` blend applied
6. THE spacing between leadingIcon and label SHALL be `space.grouped.loose` (12px)
7. THE spacing between label and Selection_Indicator SHALL be `space.grouped.loose` (12px)

### Requirement 5: Sizing and Touch Targets

**User Story**: As a user, I want buttons that are easy to tap on touch devices, so that I can interact comfortably without precision.

#### Acceptance Criteria

1. THE Button_VerticalListItem SHALL have a minimum height of `accessibility.tapAreaRecommended` (48px)
2. THE Button_VerticalListItem SHALL fill 100% of its container width
3. THE Button_VerticalListItem SHALL use `radiusNormal` (8px) for border radius
4. THE inline padding (left/right) SHALL be `space.inset.200` (16px)

### Requirement 6: Height Stability with Padding Compensation

**User Story**: As a user, I want the button height to remain constant when selection state changes, so that the layout doesn't shift unexpectedly.

#### Acceptance Criteria

1. WHEN border width is `borderDefault` (1px) THEN block padding SHALL be 11px per side
2. WHEN border width is `borderEmphasis` (2px) THEN block padding SHALL be 10px per side
3. THE total button height SHALL remain constant at 48px regardless of border width changes
4. WHEN transitioning between visual states THEN padding and border width SHALL animate together to maintain height stability

### Requirement 7: Animation and Transitions

**User Story**: As a user, I want smooth visual transitions when selection state changes, so that the interface feels polished and responsive.

#### Acceptance Criteria

1. WHEN visualState changes THEN Button_VerticalListItem SHALL animate background color, border color, border width, padding, text color, and icon color using `motion.selectionTransition` (250ms, standard easing)
2. WHEN Selection_Indicator becomes visible THEN it SHALL fade in using `motion.selectionTransition`
3. WHEN checkmarkTransition prop is `fade` AND Selection_Indicator becomes hidden THEN it SHALL fade out using `motion.selectionTransition`
4. WHEN checkmarkTransition prop is `instant` AND Selection_Indicator becomes hidden THEN it SHALL hide immediately without animation
5. WHEN transitionDelay prop is provided THEN Button_VerticalListItem SHALL delay its transition by the specified milliseconds

### Requirement 8: Interactive States

**User Story**: As a user, I want visual feedback when I hover over or press a button, so that I know the interface is responding to my actions.

#### Acceptance Criteria

1. WHEN user hovers over Button_VerticalListItem THEN it SHALL apply `blend.hoverDarker` overlay on top of current visual state
2. WHEN user presses Button_VerticalListItem THEN it SHALL apply `blend.pressedDarker` overlay on top of current visual state
3. WHEN Button_VerticalListItem receives keyboard focus THEN it SHALL display focus outline using `accessibility.focus.width`, `accessibility.focus.offset`, and `accessibility.focus.color` tokens
4. THE Button_VerticalListItem SHALL use `:focus-visible` for keyboard focus indicators (web platform)

### Requirement 9: Icon Sizing

**User Story**: As a developer, I want icons to be sized consistently with the button typography, so that the visual hierarchy is maintained.

#### Acceptance Criteria

1. THE leadingIcon SHALL use `iconBaseSizes.size100` (24px) to match `typography.buttonMd`
2. THE Selection_Indicator SHALL use `iconBaseSizes.size100` (24px) to match `typography.buttonMd`
3. WHEN icons are rendered THEN they SHALL use the Icon-Base component with the `size` prop

### Requirement 10: Accessibility Compliance

**User Story**: As a user with accessibility needs, I want the button to work with assistive technologies, so that I can use the interface effectively.

#### Acceptance Criteria

1. THE Button_VerticalListItem SHALL render as a semantic `<button>` element (web platform)
2. THE Button_VerticalListItem SHALL NOT support disabled states (unavailable options should be hidden, not disabled)
3. WHEN Button_VerticalListItem is focused THEN screen readers SHALL announce the label and current state
4. THE Selection_Indicator icon SHALL be marked as decorative with `aria-hidden="true"`
5. WHEN using VoiceOver on iOS THEN Button_VerticalListItem SHALL announce the label and current selection state
6. WHEN using TalkBack on Android THEN Button_VerticalListItem SHALL announce the label and current selection state
7. THE iOS implementation SHALL use native SwiftUI accessibility modifiers for VoiceOver support
8. THE Android implementation SHALL use Compose semantics for TalkBack support

### Requirement 11: RTL Support

**User Story**: As a developer building for international audiences, I want the component to support right-to-left layouts, so that the interface works correctly in RTL languages.

#### Acceptance Criteria

1. THE web implementation SHALL use CSS logical properties for padding (`padding-block-start`, `padding-block-end`, `padding-inline-start`, `padding-inline-end`)
2. WHEN rendered in RTL context THEN leadingIcon SHALL appear on the right and Selection_Indicator on the left
3. THE layout SHALL automatically adapt to document direction without additional configuration
4. THE iOS implementation SHALL use SwiftUI's automatic RTL layout support via `Environment(\.layoutDirection)`
5. THE Android implementation SHALL use Compose's automatic RTL layout support via `LocalLayoutDirection`
6. WHEN iOS app language is RTL THEN the layout SHALL mirror automatically using SwiftUI's built-in RTL handling
7. WHEN Android app language is RTL THEN the layout SHALL mirror automatically using Compose's built-in RTL handling

### Requirement 12: Event Handling

**User Story**: As a developer, I want the button to emit events for user interactions, so that the parent pattern can respond appropriately.

#### Acceptance Criteria

1. WHEN user clicks/taps Button_VerticalListItem THEN it SHALL call the onClick callback if provided
2. WHEN Button_VerticalListItem receives focus THEN it SHALL call the onFocus callback if provided
3. WHEN Button_VerticalListItem loses focus THEN it SHALL call the onBlur callback if provided

### Requirement 13: Platform-Specific Rendering (iOS)

**User Story**: As an iOS developer, I want the button to use native SwiftUI patterns, so that it integrates seamlessly with the iOS platform.

#### Acceptance Criteria

1. THE iOS implementation SHALL use SwiftUI for native rendering
2. THE iOS implementation SHALL use `strokeBorder` modifier for border rendering (draws inside view bounds)
3. WHEN visual state changes THEN iOS implementation SHALL animate using SwiftUI's `withAnimation` with `motion.selectionTransition` timing
4. THE iOS implementation SHALL support haptic feedback delegation to the parent pattern
5. THE iOS implementation SHALL use SwiftUI's `@State` or `@Binding` for reactive prop updates
6. THE iOS implementation SHALL render borders inside the view bounds (not outside) to maintain consistent sizing

### Requirement 14: Platform-Specific Rendering (Android)

**User Story**: As an Android developer, I want the button to use native Jetpack Compose patterns, so that it integrates seamlessly with the Android platform.

#### Acceptance Criteria

1. THE Android implementation SHALL use Jetpack Compose for native rendering
2. THE Android implementation SHALL apply Material-style ripple effects for touch feedback
3. WHEN visual state changes THEN Android implementation SHALL animate using Compose's `animateColorAsState` and related animation APIs with `motion.selectionTransition` timing
4. THE Android implementation SHALL use border modifier that draws inside composable bounds
5. THE Android implementation SHALL use Compose's `remember` and state hoisting patterns for reactive prop updates
6. THE Android implementation SHALL ensure proper touch target sizing meets Material Design guidelines (minimum 48dp)

---

## Token Dependencies

### Existing Tokens Required

| Token | Purpose |
|-------|---------|
| `color.background` | Rest state background |
| `color.text.default` | Rest state text color |
| `color.text.muted` | Description text color |
| `color.border` | Select mode rest state border |
| `color.select.selected.strong` | Selected state foreground |
| `color.select.selected.subtle` | Selected state background |
| `color.select.notSelected.strong` | Not-selected state foreground |
| `color.select.notSelected.subtle` | Not-selected state background |
| `color.error.strong` | Error state foreground |
| `color.error.subtle` | Error state background |
| `color.icon.opticalBalance` | Icon color adjustment |
| `blend.hoverDarker` | Hover overlay |
| `blend.pressedDarker` | Pressed overlay |
| `accessibility.focus.width` | Focus outline width |
| `accessibility.focus.offset` | Focus outline offset |
| `accessibility.focus.color` | Focus outline color |
| `accessibility.tapAreaRecommended` | Minimum touch target |
| `borderDefault` | 1px border width |
| `borderEmphasis` | 2px border width |
| `radiusNormal` | Border radius |
| `space.inset.200` | Inline padding |
| `space.grouped.loose` | Internal spacing |
| `typography.buttonMd` | Label typography |
| `typography.bodySm` | Description typography |

### New Tokens Required

| Token | Purpose | Specification |
|-------|---------|---------------|
| `motion.selectionTransition` | Selection state animation | duration: 250ms, easing: standard |

### Component Tokens (Defined in Component)

| Token | Formula | Value | Purpose |
|-------|---------|-------|---------|
| `verticalListItem.paddingBlock.rest` | `SPACING_BASE_VALUE * 1.375` | 11 | Block padding at rest state (with 1px border) |
| `verticalListItem.paddingBlock.selected` | references `space125` | 10 | Block padding when selected (with 2px border) |

**Note**: The 11px padding value uses the `TokenWithValue` pattern in `defineComponentTokens()` with the formula `SPACING_BASE_VALUE * 1.375`. This conforms to the spacing family's mathematical foundation and passes validation. The `paddingBlock.selected` token references the existing `space125` primitive.

---

## Platform Considerations

### Web
- Semantic `<button>` element
- CSS logical properties for RTL support
- CSS custom properties for theming
- CSS transitions for animation
- `:focus-visible` for keyboard focus
- Shadow DOM for style encapsulation (web component)

### iOS
- Native SwiftUI implementation
- `strokeBorder` modifier for border rendering (inside view bounds)
- VoiceOver: label and state announced via accessibility modifiers
- SwiftUI `withAnimation` for state transitions using `motion.selectionTransition` timing
- `Environment(\.layoutDirection)` for automatic RTL support
- Haptic feedback delegated to parent pattern
- `@State`/`@Binding` for reactive prop updates

### Android
- Native Jetpack Compose implementation
- Material-style ripple effects via `Modifier.clickable` with `indication`
- Border modifier draws inside composable bounds
- TalkBack: label and state announced via Compose semantics
- Compose animation APIs (`animateColorAsState`, `animateDpAsState`) for state transitions
- `LocalLayoutDirection` for automatic RTL support
- State hoisting pattern for reactive prop updates
- Minimum 48dp touch targets per Material Design guidelines

---

*This requirements document captures component-level behavior. Selection logic, mode management, and container-level accessibility are owned by the Vertical List Buttons Pattern (XXX-vertical-list-buttons-pattern).*
