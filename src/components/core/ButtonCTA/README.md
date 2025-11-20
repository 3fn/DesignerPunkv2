# ButtonCTA Component

**Date**: November 19, 2025  
**Status**: Implementation  
**Platform**: Cross-platform (Web, iOS, Android)

---

## Overview

The ButtonCTA (Call-to-Action) component is a cross-platform button following True Native Architecture with build-time platform separation. It provides three size variants, three visual styles, and comprehensive interaction states while maintaining WCAG 2.1 AA accessibility compliance.

**Key Features**:
- Three size variants (small, medium, large) aligned to 8px baseline grid
- Three visual styles (primary, secondary, tertiary) for clear hierarchy
- Optional leading icons with automatic optical weight compensation
- Platform-specific interaction patterns (hover on web, scale on iOS, ripple on Android)
- Full WCAG 2.1 AA accessibility compliance
- Token-based styling with zero hard-coded values

---

## Size Variants

The component provides three size variants optimized for different UI contexts:

### Small (40px height)

**Use Cases**: Secondary actions, toolbars, dense layouts, compact UIs

**Specifications**:
- Height: 40px (extends to 44px touch target on mobile)
- Horizontal padding: 16px (`space.inset.spacious`)
- Vertical padding: 8px (`space.inset.normal`)
- Typography: `typography.bodyMd`
- Border radius: 8px (`radius100`)
- Icon size: 24px (`icon.size100`)
- Icon spacing: 4px (`space.grouped.tight`)
- Minimum width: 56px

**Example**:
```typescript
<ButtonCTA 
  label="Cancel" 
  size="small" 
  style="secondary"
  onPress={() => console.log('Cancelled')} 
/>
```

### Medium (48px height) - Default

**Use Cases**: Most buttons, standard actions, default size for balanced visibility

**Specifications**:
- Height: 48px (meets 44px touch target requirement)
- Horizontal padding: 24px (`space.inset.expansive`)
- Vertical padding: 12px (`space.inset.comfortable`)
- Typography: `typography.bodyMd`
- Border radius: 12px (`radius150`)
- Icon size: 24px (`icon.size100`)
- Icon spacing: 8px (`space.grouped.normal`)
- Minimum width: 72px

**Example**:
```typescript
<ButtonCTA 
  label="Continue" 
  size="medium" 
  onPress={() => console.log('Continue')} 
/>
```

### Large (56px height)

**Use Cases**: Primary CTAs, hero sections, high-emphasis actions, prominent buttons

**Specifications**:
- Height: 56px (exceeds 44px touch target requirement)
- Horizontal padding: 32px (`space.inset.generous`)
- Vertical padding: 12px (`space.inset.comfortable`)
- Typography: `typography.bodyLg`
- Border radius: 16px (`radius200`)
- Icon size: 32px (`icon.size125`)
- Icon spacing: 8px (`space.grouped.normal`)
- Minimum width: 80px

**Example**:
```typescript
<ButtonCTA 
  label="Get Started" 
  size="large" 
  style="primary"
  icon="arrow-right"
  onPress={() => console.log('Get Started')} 
/>
```

---

## Visual Styles

The component provides three visual styles to establish clear hierarchy:

### Primary (Filled)

**Visual Treatment**: Solid background with primary color, white text

**Use Cases**: Main actions, form submissions, primary CTAs, highest emphasis

**Specifications**:
- Background: `color.primary`
- Text color: `color.text.onPrimary` (white)
- Icon color: `color.text.onPrimary` (white)
- Border: None
- Visual weight: Highest

**Example**:
```typescript
<ButtonCTA 
  label="Submit" 
  style="primary"
  onPress={() => console.log('Submitted')} 
/>
```

### Secondary (Outlined)

**Visual Treatment**: Transparent background with primary color border and text

**Use Cases**: Alternative actions, secondary CTAs, medium emphasis

**Specifications**:
- Background: `color.background` (transparent)
- Text color: `color.primary`
- Icon color: `color.primary` with `color.icon.opticalBalance` blend (20% lighter)
- Border: 1px `color.primary`
- Visual weight: Medium

**Example**:
```typescript
<ButtonCTA 
  label="Learn More" 
  style="secondary"
  onPress={() => console.log('Learn More')} 
/>
```

### Tertiary (Text-only)

**Visual Treatment**: Transparent background with primary color text, no border

**Use Cases**: Subtle actions, navigation, lowest emphasis, cancel buttons

**Specifications**:
- Background: Transparent
- Text color: `color.primary`
- Icon color: `color.primary` with `color.icon.opticalBalance` blend (20% lighter)
- Border: None
- Visual weight: Lowest

**Example**:
```typescript
<ButtonCTA 
  label="Skip" 
  style="tertiary"
  onPress={() => console.log('Skipped')} 
/>
```

---

## Props API

### Required Props

#### `label: string`

Button text label displayed to users.

**Validation**: Cannot be empty or whitespace-only

**Example**:
```typescript
<ButtonCTA label="Click Me" onPress={handleClick} />
```

#### `onPress: () => void`

Click/tap handler function called when button is activated.

**Validation**: Must be a function

**Example**:
```typescript
<ButtonCTA 
  label="Submit" 
  onPress={() => {
    console.log('Button clicked');
    submitForm();
  }} 
/>
```

### Optional Props

#### `size?: 'small' | 'medium' | 'large'`

Button size variant. Default: `'medium'`

**Example**:
```typescript
<ButtonCTA label="Small Button" size="small" onPress={handleClick} />
<ButtonCTA label="Medium Button" size="medium" onPress={handleClick} />
<ButtonCTA label="Large Button" size="large" onPress={handleClick} />
```

#### `style?: 'primary' | 'secondary' | 'tertiary'`

Button visual style. Default: `'primary'`

**Example**:
```typescript
<ButtonCTA label="Primary" style="primary" onPress={handleClick} />
<ButtonCTA label="Secondary" style="secondary" onPress={handleClick} />
<ButtonCTA label="Tertiary" style="tertiary" onPress={handleClick} />
```

#### `icon?: IconName`

Optional leading icon from Icon System (Spec 004).

**Type**: `IconName` from Icon System  
**Position**: Leading (left of text)  
**Color**: Inherits from button style with optical balance for secondary/tertiary

**Example**:
```typescript
<ButtonCTA 
  label="Next" 
  icon="arrow-right" 
  onPress={handleNext} 
/>
```

#### `noWrap?: boolean`

Prevent text wrapping. Default: `false`

**Behavior**:
- `false` (default): Text wraps to multiple lines if needed
- `true`: Text truncates with ellipsis on single line

**Example**:
```typescript
<ButtonCTA 
  label="Very Long Button Text That Might Wrap" 
  noWrap={true}
  onPress={handleClick} 
/>
```

#### `disabled?: boolean`

Disable button interaction. Default: `false`

**Behavior**:
- Prevents `onPress` from being called
- Applies disabled styling
- Removes interactive cursor

**Example**:
```typescript
<ButtonCTA 
  label="Submit" 
  disabled={!formValid}
  onPress={handleSubmit} 
/>
```

#### `testID?: string`

Test identifier for automated testing.

**Platform-specific**:
- Web: `data-testid` attribute
- iOS: `accessibilityIdentifier`
- Android: `testTag`

**Example**:
```typescript
<ButtonCTA 
  label="Submit" 
  testID="submit-button"
  onPress={handleSubmit} 
/>
```

---

## Token Consumption

The ButtonCTA component uses the following design tokens:

### Typography Tokens

- **Small/Medium**: `typography.bodyMd` - Standard body text for most buttons
- **Large**: `typography.bodyLg` - Larger text for prominent buttons

### Spacing Tokens

**Horizontal Padding**:
- **Small**: `space.inset.spacious` (16px)
- **Medium**: `space.inset.expansive` (24px)
- **Large**: `space.inset.generous` (32px)

**Vertical Padding**:
- **Small**: `space.inset.normal` (8px)
- **Medium/Large**: `space.inset.comfortable` (12px)

**Icon Spacing**:
- **Small**: `space.grouped.tight` (4px)
- **Medium/Large**: `space.grouped.normal` (8px)

### Color Tokens

**Primary Style**:
- Background: `color.primary`
- Text: `color.text.onPrimary`
- Icon: `color.text.onPrimary`

**Secondary Style**:
- Background: `color.background`
- Text: `color.primary`
- Icon: `color.primary` + `color.icon.opticalBalance`
- Border: `color.primary`

**Tertiary Style**:
- Background: Transparent
- Text: `color.primary`
- Icon: `color.primary` + `color.icon.opticalBalance`

### Border Radius Tokens

- **Small**: `radius100` (8px)
- **Medium**: `radius150` (12px)
- **Large**: `radius200` (16px)

### Icon Size Tokens

- **Small/Medium**: `icon.size100` (24px)
- **Large**: `icon.size125` (32px)

### Interaction Tokens

- **Hover**: `opacity.hover` (8% overlay)
- **Pressed**: `opacity.pressed` (16% overlay)

### Accessibility Tokens

- **Focus Width**: `accessibility.focus.width` (2px)
- **Focus Color**: `accessibility.focus.color` (primary)
- **Focus Offset**: `accessibility.focus.offset` (2px)
- **Focus Shadow**: `shadow.hover`

---

## Usage Examples

### Basic Button

```typescript
<ButtonCTA 
  label="Click Me" 
  onPress={() => console.log('Clicked')} 
/>
```

### Primary CTA with Icon

```typescript
<ButtonCTA 
  label="Get Started" 
  size="large"
  style="primary"
  icon="arrow-right"
  onPress={() => navigate('/onboarding')} 
/>
```

### Secondary Action

```typescript
<ButtonCTA 
  label="Learn More" 
  style="secondary"
  onPress={() => openModal('info')} 
/>
```

### Tertiary Cancel Button

```typescript
<ButtonCTA 
  label="Cancel" 
  size="small"
  style="tertiary"
  onPress={() => closeDialog()} 
/>
```

### Disabled State

```typescript
<ButtonCTA 
  label="Submit" 
  disabled={!formValid}
  onPress={handleSubmit} 
/>
```

### With Icon and No Wrap

```typescript
<ButtonCTA 
  label="Download Report" 
  icon="download"
  noWrap={true}
  onPress={downloadReport} 
/>
```

### Form Submission

```typescript
<form onSubmit={handleSubmit}>
  <ButtonCTA 
    label="Create Account" 
    size="large"
    style="primary"
    testID="create-account-button"
    onPress={handleSubmit} 
  />
</form>
```

---

## Accessibility Features

The ButtonCTA component implements comprehensive WCAG 2.1 AA accessibility features:

### Touch Target Compliance

**Requirement**: Minimum 44px × 44px interactive area (WCAG 2.1 AA)

**Implementation**:
- **Small buttons (40px)**: Touch target extended to 44px on iOS/Android
- **Medium buttons (48px)**: Visual height meets requirement
- **Large buttons (56px)**: Visual height exceeds requirement

**Platform-specific**:
- **iOS**: `.frame(minHeight: 44)` extends touch area while maintaining 40px visual height
- **Android**: `Modifier.heightIn(min = 44.dp)` extends touch area
- **Web**: Padding ensures minimum height

### Color Contrast

**Requirement**: Minimum 4.5:1 contrast ratio for text (WCAG 2.1 AA)

**Implementation**:
- **Primary**: `color.text.onPrimary` (white) on `color.primary` background ≥ 4.5:1
- **Secondary**: `color.primary` text on `color.background` ≥ 4.5:1
- **Tertiary**: `color.primary` text on transparent background ≥ 4.5:1
- **Focus outline**: `color.primary` outline ≥ 3:1 contrast with any background

### Keyboard Navigation

**Requirement**: Full keyboard accessibility (WCAG 2.1 AA)

**Implementation**:
- **Tab**: Moves focus to button
- **Enter**: Activates button
- **Space**: Activates button
- **Focus indicator**: Visible outline on keyboard focus (`:focus-visible` on web)

**Platform-specific**:
- **Web**: Semantic `<button>` element with native keyboard support
- **iOS**: Native `Button` component with VoiceOver support
- **Android**: Native `Button` composable with TalkBack support

### Screen Reader Support

**Requirement**: Clear announcements for assistive technology

**Implementation**:
- **Semantic elements**: Uses native button elements with `role="button"`
- **Accessible labels**: Button text announced by screen readers
- **Icon decoration**: Icons marked as decorative (`aria-hidden="true"` on web)
- **Disabled state**: Announced via `aria-disabled` or platform equivalents

**Platform-specific**:
- **Web**: ARIA attributes for screen reader support
- **iOS**: Dynamic Type support for text scaling, VoiceOver announcements
- **Android**: TalkBack support with semantic properties

### Focus Indicators

**Requirement**: Visible focus indicators (WCAG 2.1 AA)

**Implementation**:
- **Width**: 2px outline (`accessibility.focus.width`)
- **Color**: Primary color (`accessibility.focus.color`)
- **Offset**: 2px outside button bounds (`accessibility.focus.offset`)
- **Shadow**: Elevation shadow for additional depth (`shadow.hover`)
- **Keyboard-only**: Focus visible only on keyboard navigation (`:focus-visible`)

---

## Platform-Specific Behaviors

### Web (React/TypeScript)

**Interaction Patterns**:
- **Hover**: 8% opacity overlay (`opacity.hover`)
- **Pressed**: 16% opacity overlay (`opacity.pressed`)
- **Focus**: Outline with `:focus-visible` (keyboard-only)
- **Cursor**: `cursor: pointer` on hover

**Implementation**:
- Semantic `<button>` element
- CSS custom properties for token consumption
- Flexbox for icon-text layout

### iOS (SwiftUI)

**Interaction Patterns**:
- **Pressed**: Scale transform to 0.97 (97%) with 100ms ease-out animation
- **Focus**: Native focus ring via accessibility system
- **Touch**: Native touch feedback

**Implementation**:
- Native `Button` component
- Swift constants for token consumption
- `HStack` for icon-text layout
- `.frame(minHeight: 44)` for touch target extension

### Android (Jetpack Compose)

**Interaction Patterns**:
- **Pressed**: Material ripple effect with 16% opacity (`color.primary` at 0.16 alpha)
- **Focus**: Native focus indicator via semantics
- **Touch**: Ripple emanates from touch point

**Implementation**:
- Native `Button` composable
- Kotlin constants for token consumption
- `Row` for icon-text layout
- `Modifier.heightIn(min = 44.dp)` for touch target extension

---

## Related Components

- **Icon System (Spec 004)**: Provides icons for optional leading icon prop
- **Icon Size Tokens (Spec 006)**: Defines icon sizing based on typography
- **Accessibility Token Family (Spec 007)**: Provides focus indicator tokens

---

## Dependencies

### Spec Dependencies

- ✅ **Spec 004: Icon System** - Icon component for optional leading icons
- ✅ **Spec 006: Icon Size Tokens** - Icon sizing tokens (`icon.size100`, `icon.size125`)
- ✅ **Spec 007: Accessibility Token Family** - Focus indicator tokens

### Token Dependencies

**New Semantic Tokens** (must be created before implementation):
- `color.text.onPrimary` - Text color for primary button
- `color.icon.opticalBalance` - Icon optical weight compensation
- `space.inset.generous` - Large button horizontal padding

**Existing Tokens**:
- Typography: `typography.bodyMd`, `typography.bodyLg`
- Spacing: `space.inset.*`, `space.grouped.*`
- Colors: `color.primary`, `color.background`
- Border Radius: `radius100`, `radius150`, `radius200`
- Icons: `icon.size100`, `icon.size125`
- Accessibility: `accessibility.focus.*`

---

## Implementation Notes

### True Native Architecture

The ButtonCTA component follows True Native Architecture with build-time platform separation:

- **No runtime platform detection**: Platform determined at build time
- **Separate implementations**: Each platform has its own implementation file
- **Shared types**: Type definitions shared across platforms via `types.ts`
- **Platform-specific optimizations**: Each platform uses native APIs and patterns

### Token-Based Styling

All styling uses semantic or primitive tokens with zero hard-coded values:

- **Typography**: Token references for font size, line height, weight
- **Spacing**: Token references for padding, margins, gaps
- **Colors**: Token references for backgrounds, text, borders
- **Border Radius**: Token references for corner rounding
- **Icons**: Token references for icon sizing

### Mathematical Foundation

Button sizing follows the 8px baseline grid:

- **Heights**: 40px, 48px, 56px (all multiples of 8px)
- **Padding**: Calculated to align to baseline grid
- **Formula**: `(Target Height - Line Height) / 2 = Vertical Padding`

### Optical Weight Compensation

Icons are lightened by 20% when paired with text on secondary/tertiary buttons:

- **Rationale**: Icons appear heavier than text due to stroke density
- **Implementation**: `color.icon.opticalBalance` blend token (blend200 lighter)
- **Application**: Secondary and tertiary styles only (primary uses white for both)

---

## Troubleshooting

### Button Text Truncated

**Issue**: Button text is cut off with ellipsis

**Solution**: Remove `noWrap` prop or set to `false` to allow text wrapping

```typescript
// Before (truncated)
<ButtonCTA label="Very Long Text" noWrap={true} onPress={handleClick} />

// After (wrapped)
<ButtonCTA label="Very Long Text" noWrap={false} onPress={handleClick} />
```

### Icon Not Appearing

**Issue**: Icon prop provided but icon doesn't render

**Possible Causes**:
1. Invalid icon name (not in Icon System)
2. Icon System not imported correctly
3. Icon component not available

**Solution**: Verify icon name is valid from Icon System (Spec 004)

```typescript
// Check valid icon names from Icon System
import { IconName } from '../Icon/types';

<ButtonCTA label="Next" icon="arrow-right" onPress={handleClick} />
```

### Touch Target Too Small on Mobile

**Issue**: Small buttons difficult to tap on mobile devices

**Solution**: Component automatically extends touch target to 44px on iOS/Android. If still too small, use `medium` or `large` size.

```typescript
// Small button with extended touch target
<ButtonCTA label="Cancel" size="small" onPress={handleCancel} />

// Or use medium size
<ButtonCTA label="Cancel" size="medium" onPress={handleCancel} />
```

### Focus Indicator Not Visible

**Issue**: Focus outline not appearing when button receives focus

**Possible Causes**:
1. Focus via mouse click (`:focus-visible` only shows on keyboard focus)
2. Missing accessibility tokens
3. Platform-specific focus styling

**Solution**: Test with keyboard navigation (Tab key) to see focus indicator

```typescript
// Focus indicator appears on keyboard navigation only
<ButtonCTA label="Submit" onPress={handleSubmit} />
```

---

*This README provides comprehensive documentation for the ButtonCTA component, including size variants, visual styles, props API, token consumption, usage examples, accessibility features, and platform-specific behaviors.*
