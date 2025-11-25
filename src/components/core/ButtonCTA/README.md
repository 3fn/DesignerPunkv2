# ButtonCTA Component

## Overview

The ButtonCTA (Call-to-Action Button) component is a cross-platform button following True Native Architecture with build-time platform separation. It provides three size variants, three visual styles, and comprehensive interaction states while maintaining WCAG 2.1 AA accessibility compliance.

**Key Features**:
- Token-based styling (zero hard-coded values)
- Three size variants (small, medium, large)
- Three visual styles (primary, secondary, tertiary)
- Optional leading icons with optical weight compensation
- Platform-specific interaction patterns (ripple on Android, scale on iOS, hover on web)
- WCAG 2.1 AA accessibility compliance
- True Native Architecture (separate implementations per platform)

---

## Related Documentation

### Component Specification
- [Requirements Document](../../../.kiro/specs/005-cta-button-component/requirements.md) - Complete requirements and acceptance criteria
- [Design Document](../../../.kiro/specs/005-cta-button-component/design.md) - Architectural decisions and design rationale

### Related Components
- Icon System (Spec 004) - Provides icons for optional leading icon prop
- Icon Size Tokens (Spec 006) - Defines icon sizing tokens used by buttons
- Accessibility Token Family (Spec 007) - Provides focus indicator tokens

### Validation Files
- [BasicUsage.html](./examples/BasicUsage.html) - Validates basic button functionality
- [WithIcon.html](./examples/WithIcon.html) - Validates icon integration
- [Variants.html](./examples/Variants.html) - Validates all size and style combinations

**Note**: Validation files are automated tests, not documentation. See usage examples in this README for component documentation.

---

## Usage

### Basic Usage

The simplest button requires only a label and onPress handler:

```tsx
<ButtonCTA 
  label="Click me" 
  onPress={() => console.log('Button clicked')} 
/>
```

This creates a medium-sized primary button with default styling.

### Size Variants

Three size variants provide visual hierarchy:

```tsx
// Small button (40px height, extends to 44px touch target on mobile)
<ButtonCTA 
  label="Small Button" 
  size="small"
  onPress={handlePress} 
/>

// Medium button (48px height, default)
<ButtonCTA 
  label="Medium Button" 
  size="medium"
  onPress={handlePress} 
/>

// Large button (56px height)
<ButtonCTA 
  label="Large Button" 
  size="large"
  onPress={handlePress} 
/>
```

**When to use each size**:
- **Small**: Compact buttons for secondary actions, toolbars, dense layouts
- **Medium**: Default size for most buttons, balances visibility and space efficiency
- **Large**: Prominent buttons for primary CTAs, hero sections, high-emphasis actions

### Visual Styles

Three visual styles establish emphasis hierarchy:

```tsx
// Primary style (filled background, highest emphasis)
<ButtonCTA 
  label="Primary Action" 
  style="primary"
  onPress={handlePress} 
/>

// Secondary style (outlined, medium emphasis)
<ButtonCTA 
  label="Secondary Action" 
  style="secondary"
  onPress={handlePress} 
/>

// Tertiary style (text-only, lowest emphasis)
<ButtonCTA 
  label="Tertiary Action" 
  style="tertiary"
  onPress={handlePress} 
/>
```

**When to use each style**:
- **Primary**: Main action on a page (e.g., "Save", "Submit", "Continue")
- **Secondary**: Alternative actions (e.g., "Cancel", "Go Back", "Learn More")
- **Tertiary**: Low-emphasis actions (e.g., "Skip", "Not Now", "View Details")

### With Icons

Add optional leading icons for enhanced visual communication:

```tsx
<ButtonCTA 
  label="Next Step" 
  icon="arrow-right"
  onPress={handleNext} 
/>

<ButtonCTA 
  label="Download" 
  icon="download"
  size="large"
  onPress={handleDownload} 
/>
```

**Icon sizing**:
- Small and medium buttons use `icon.size100` (24px)
- Large buttons use `icon.size125` (32px)

**Optical weight compensation**: Icons on secondary and tertiary buttons are automatically lightened by 20% to achieve optical balance with text.

### States

Buttons support multiple interaction states:

```tsx
// Disabled state
<ButtonCTA 
  label="Submit" 
  disabled={true}
  onPress={handleSubmit} 
/>

// With test ID for automated testing
<ButtonCTA 
  label="Login" 
  testID="login-button"
  onPress={handleLogin} 
/>

// Prevent text wrapping
<ButtonCTA 
  label="Very Long Button Label That Might Wrap" 
  noWrap={true}
  onPress={handlePress} 
/>
```

**Interaction states** (automatic):
- **Hover**: 8% opacity overlay (web only)
- **Pressed**: 16% opacity overlay (all platforms)
- **Focus**: 2px outline with primary color (keyboard navigation)
- **Disabled**: Reduced opacity, no interaction

---

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | *required* | Button text label |
| `onPress` | `() => void` | *required* | Click/tap handler function |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Button size variant |
| `style` | `'primary' \| 'secondary' \| 'tertiary'` | `'primary'` | Button visual style |
| `icon` | `IconName` | `undefined` | Optional leading icon from Icon System |
| `noWrap` | `boolean` | `false` | Prevent text wrapping (single line) |
| `disabled` | `boolean` | `false` | Disable button interaction |
| `testID` | `string` | `undefined` | Test identifier for automated testing |

### Types

```typescript
type ButtonSize = 'small' | 'medium' | 'large';
type ButtonStyle = 'primary' | 'secondary' | 'tertiary';

interface ButtonProps {
  label: string;
  onPress: () => void;
  size?: ButtonSize;
  style?: ButtonStyle;
  icon?: IconName;
  noWrap?: boolean;
  disabled?: boolean;
  testID?: string;
}
```

---

## Token Consumption

The ButtonCTA component uses the following design tokens:

### Typography Tokens
- `typography.bodyMd` - Small and medium button text
- `typography.bodyLg` - Large button text

### Spacing Tokens
- `space.inset.spacious` (16px) - Small button horizontal padding
- `space.inset.expansive` (24px) - Medium button horizontal padding
- `space.inset.generous` (32px) - Large button horizontal padding
- `space.inset.normal` (8px) - Small button vertical padding
- `space.inset.comfortable` (12px) - Medium and large button vertical padding
- `space.grouped.tight` (4px) - Small button icon-text spacing
- `space.grouped.normal` (8px) - Medium and large button icon-text spacing

### Color Tokens
- `color.primary` - Primary button background, secondary/tertiary text and border
- `color.text.onPrimary` - Text color on primary background (white)
- `color.background` - Secondary button background
- `color.icon.opticalBalance` - Icon optical weight compensation (20% lighter)

### Border Radius Tokens
- `radius100` (8px) - Small button border radius
- `radius150` (12px) - Medium button border radius
- `radius200` (16px) - Large button border radius

### Interaction Tokens
- `opacity.hover` (8%) - Hover state overlay
- `opacity.pressed` (16%) - Pressed state overlay

### Accessibility Tokens
- `accessibility.focus.width` (2px) - Focus outline width
- `accessibility.focus.color` - Focus outline color (primary)
- `accessibility.focus.offset` (2px) - Focus outline offset

### Icon Tokens
- `icon.size100` (24px) - Small and medium button icon size
- `icon.size125` (32px) - Large button icon size

---

## Accessibility

### WCAG 2.1 AA Compliance

The ButtonCTA component meets WCAG 2.1 AA requirements:

**Touch Targets** (Success Criterion 2.5.5):
- Small buttons: 40px visual height, extends to 44px touch target on mobile
- Medium buttons: 48px height (exceeds 44px minimum)
- Large buttons: 56px height (exceeds 44px minimum)

**Color Contrast** (Success Criterion 1.4.3):
- Primary buttons: White text on primary color (contrast ratio ≥ 4.5:1)
- Secondary buttons: Primary color text on white background (contrast ratio ≥ 4.5:1)
- Tertiary buttons: Primary color text on transparent background (contrast ratio ≥ 4.5:1)

**Keyboard Navigation** (Success Criterion 2.1.1):
- All buttons are keyboard accessible via Tab key
- Buttons activate on Enter or Space key
- Focus indicators visible on keyboard navigation (2px outline)

**Text Resize** (Success Criterion 1.4.4):
- Text wraps by default (supports 200% zoom without content loss)
- Use `noWrap` prop only when necessary for layout constraints

### Screen Reader Support

Buttons are announced correctly by screen readers:
- Role: "button"
- Label: Button text content
- State: "disabled" when disabled prop is true

### Best Practices

**Do**:
- Use descriptive button labels that explain the action
- Provide sufficient color contrast for all button styles
- Ensure buttons are keyboard accessible
- Use appropriate size for touch targets (minimum 44px)

**Don't**:
- Use `noWrap` by default (prevents text resize accessibility)
- Rely solely on color to convey meaning (use icons or text)
- Create buttons smaller than 44px touch target on mobile
- Use vague labels like "Click here" or "Submit"

---

## Platform-Specific Notes

### Web Implementation

**Technology**: Vanilla Web Component (Custom Element)

**Interaction Pattern**:
- Hover states with 8% opacity overlay
- Cursor changes to pointer on hover
- Focus indicators visible only on keyboard navigation (`:focus-visible`)

**Styling**:
- CSS custom properties for token consumption
- Flexbox layout for icon-text arrangement
- `gap` property for icon-text spacing

### iOS Implementation

**Technology**: SwiftUI

**Interaction Pattern**:
- Scale transform (0.97) on press for tactile feedback
- Spring animation (0.1s duration) for smooth transitions
- No hover states (touch-only interface)

**Platform Features**:
- Dynamic Type support for text scaling
- Safe area inset handling for full-width buttons
- VoiceOver screen reader support

### Android Implementation

**Technology**: Jetpack Compose

**Interaction Pattern**:
- Material ripple effect emanating from touch point
- Ripple color: primary color at 16% opacity
- No hover states (touch-only interface)

**Platform Features**:
- TalkBack screen reader support
- Material 3 design system integration
- Semantic modifiers for accessibility

---

## Related Components

- **Icon System** (Spec 004): Provides icons for optional leading icon prop
- **Icon Size Tokens** (Spec 006): Defines icon sizing tokens used by buttons
- **Accessibility Token Family** (Spec 007): Provides focus indicator tokens

---

## Validation

This component includes HTML validation files in the `examples/` directory that serve as automated tests. These files validate that component examples remain functional but are NOT the source of truth for documentation.

**Validation files**:
- `examples/BasicUsage.html` - Validates basic button functionality
- `examples/WithIcon.html` - Validates icon integration
- `examples/Variants.html` - Validates all size and style combinations

**To run validation**:
```bash
# Run automated validation script
node scripts/validate-examples.js

# Or use npm script (if configured)
npm run validate:examples
```

**What the validation script checks**:
- Presence of button-cta elements
- Required label attribute on all buttons
- Valid attribute names and values
- Component import (ButtonCTA.web.js)
- Proper HTML structure (DOCTYPE, html, head, body tags)
- Warning comment present (VALIDATION FILE - NOT DOCUMENTATION)
- Basic HTML syntax validation (unclosed/mismatched tags)

**Exit codes**:
- `0` - All validations passed (or passed with warnings only)
- `1` - Validation failed with errors

**Manual testing**: Open validation files directly in a browser to verify component behavior visually.

---

## Troubleshooting

### Button not rendering

**Problem**: Button doesn't appear on screen

**Solutions**:
- Verify `label` prop is provided (required)
- Verify `onPress` prop is provided (required)
- Check console for validation warnings
- Ensure component is imported correctly

### Icon not appearing

**Problem**: Icon prop provided but icon doesn't render

**Solutions**:
- Verify icon name is valid (check Icon System documentation)
- Ensure Icon System is properly integrated
- Check console for icon validation warnings
- Verify icon tokens are generated correctly

### Touch target too small

**Problem**: Button difficult to tap on mobile devices

**Solutions**:
- Use `size="medium"` or `size="large"` (both exceed 44px minimum)
- For small buttons, touch target automatically extends to 44px on mobile
- Verify touch target extension is working in platform implementation

### Text truncated

**Problem**: Button text is cut off with ellipsis

**Solutions**:
- Remove `noWrap` prop to allow text wrapping (default behavior)
- Use shorter button labels
- Increase button size to accommodate longer text
- Consider using icon-only button for very constrained spaces

---

*For implementation details and design decisions, see the [Design Document](../../../.kiro/specs/005-cta-button-component/design.md).*
