# Button-Icon Component

**Stemma System**: Buttons Family  
**Component Type**: Standalone (no behavioral variants)  
**Readiness**: 🟡 In Development  
**Version**: 1.0.0

---

## Overview

The Button-Icon component is a circular, icon-only interactive button that provides accessible actions without text labels. It follows True Native Architecture with build-time platform separation and maintains WCAG 2.1 AA accessibility compliance.

**Stemma System Naming**: This component follows the `[Family]-[Type]` naming convention:
- **Family**: Button
- **Type**: Icon (icon-only circular button)

**Key Distinction from CTA Button**: Button-Icon uses a circular shape (`radiusCircle`) and requires an `ariaLabel` prop for accessibility since there's no visible text label.

---

## Key Features

- ✅ Token-based styling (zero hard-coded values)
- ✅ Three size variants (small, medium, large)
- ✅ Three visual variants via `variant` prop (primary, secondary, tertiary)
- ✅ Circular shape via `radiusCircle` semantic token
- ✅ Self-contained focus ring buffer (4px on all sides)
- ✅ Platform-specific interaction patterns (scale on iOS, ripple on Android)
- ✅ WCAG 2.1 AA accessibility compliance
- ✅ True Native Architecture (separate implementations per platform)
- ❌ No disabled state (by design—see Design Decisions)

---

## Usage

### HTML Custom Element

```html
<!-- Basic usage -->
<button-icon icon="settings" aria-label="Open settings"></button-icon>

<!-- With all attributes -->
<button-icon
  icon="close"
  aria-label="Close dialog"
  size="large"
  variant="primary"
  test-id="close-button"
></button-icon>

<!-- Secondary variant (outlined) -->
<button-icon
  icon="edit"
  aria-label="Edit item"
  variant="secondary"
></button-icon>

<!-- Tertiary variant (minimal) -->
<button-icon
  icon="more-vertical"
  aria-label="More options"
  variant="tertiary"
></button-icon>
```

### JavaScript/TypeScript

```typescript
import { ButtonIcon } from './platforms/web/ButtonIcon.web';

// Programmatic usage
const button = document.createElement('button-icon') as ButtonIcon;
button.icon = 'settings';
button.ariaLabel = 'Open settings';
button.size = 'medium';
button.variant = 'primary';
button.addEventListener('press', () => console.log('Pressed'));
document.body.appendChild(button);
```

### iOS (SwiftUI)

```swift
import DesignerPunk

ButtonIcon(
    icon: "settings",
    ariaLabel: "Open settings",
    size: .medium,
    variant: .primary
) {
    handleSettings()
}
```

### Android (Jetpack Compose)

```kotlin
import com.designerpunk.components

ButtonIcon(
    icon = "settings",
    ariaLabel = "Open settings",
    size = ButtonIconSize.Medium,
    variant = ButtonIconVariant.Primary,
    onPress = { handleSettings() }
)
```

---

## API Reference

### Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `icon` | `IconBaseName` | ✅ Yes | - | Icon to display (from Icon component) |
| `ariaLabel` | `string` | ✅ Yes | - | Accessible label for screen readers |
| `size` | `'small' \| 'medium' \| 'large'` | No | `'medium'` | Button size variant |
| `variant` | `'primary' \| 'secondary' \| 'tertiary'` | No | `'primary'` | Button visual variant |
| `onPress` | `() => void` | ✅ Yes | - | Press/click handler |
| `testID` | `string` | No | - | Test identifier |

**Note**: There is no `disabled` prop. See [Design Decisions](#no-disabled-state) for rationale and alternatives.

### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `press` | `{ originalEvent: Event }` | Fired when button is clicked or activated via keyboard |

---

## Size Variants

All sizes include a 4px transparent focus buffer on all sides (`accessibility.focus.offset` + `accessibility.focus.width`).

| Size | Icon Token | Padding Token | Visual Circle | Total Box | Touch Target |
|------|------------|---------------|---------------|-----------|--------------|
| `small` | `icon.size050` (16px) | `buttonIcon.inset.small` (8px) | 32px | 40px | 48px (extended) |
| `medium` | `icon.size075` (20px) | `buttonIcon.inset.medium` (10px) | 40px | 48px | 48px |
| `large` | `icon.size100` (24px) | `buttonIcon.inset.large` (12px) | 48px | 56px | 56px |

**Visual circle formula**: `iconSize + (padding × 2)`  
**Total box formula**: `visualCircle + (focusBuffer × 2)`

---

## Visual Variants

| Variant | Background | Border | Icon Color | Emphasis |
|---------|------------|--------|------------|----------|
| `primary` | `color.primary` | none | `color.contrast.onPrimary` | Highest |
| `secondary` | transparent | `borderDefault` (1px) `color.primary` | `color.primary` | Medium |
| `tertiary` | transparent | none | `color.primary` | Lowest |

### State Behavior

| State | Primary | Secondary | Tertiary |
|-------|---------|-----------|----------|
| Default | Solid fill | 1px border | Icon only |
| Hover | + `blend.hoverDarker` | + `color.background.primary.subtle` bg, 2px border | Icon + `blend.hoverDarker` |
| Pressed | + `blend.pressedDarker` | + `color.background.primary.subtle` bg, 2px border | Icon + `blend.pressedDarker` |
| Focused | Focus ring | Focus ring | Focus ring |

---

## Token Dependencies

### Icon
- `icon.size050` - Small icon (16px)
- `icon.size075` - Medium icon (20px)
- `icon.size100` - Large icon (24px)

### Color
- `color.primary` - Primary variant background, secondary/tertiary icon
- `color.contrast.onPrimary` - Primary variant icon
- `color.background.primary.subtle` - Secondary hover background

### Radius
- `radiusCircle` - Circular shape (50%)

### Spacing (Component Tokens)
- `buttonIcon.inset.small` - 8px (references `space.inset.100`)
- `buttonIcon.inset.medium` - 10px (unique value)
- `buttonIcon.inset.large` - 12px (references `space.inset.150`)

### Border
- `borderDefault` - 1px secondary border
- `borderEmphasis` - 2px secondary hover/pressed border

### Blend
- `blend.hoverDarker` - Hover state (8% darker)
- `blend.pressedDarker` - Pressed state (12% darker)

### Motion
- `duration150` - State transition timing

### Accessibility
- `tapAreaRecommended` - 48px minimum touch target
- `accessibility.focus.width` - 2px focus ring width
- `accessibility.focus.offset` - 2px focus ring offset
- `accessibility.focus.color` - Focus ring color

---

## Accessibility

### Required `ariaLabel` Prop

The `ariaLabel` prop is **required** because icon-only buttons need explicit labels for screen reader users to understand the button's purpose.

```html
<!-- ✅ Good: Descriptive label -->
<button-icon icon="close" aria-label="Close dialog"></button-icon>

<!-- ✅ Good: Action-oriented label -->
<button-icon icon="edit" aria-label="Edit profile"></button-icon>

<!-- ❌ Bad: Missing label (TypeScript will error) -->
<button-icon icon="settings"></button-icon>

<!-- ❌ Bad: Non-descriptive label -->
<button-icon icon="settings" aria-label="Settings icon"></button-icon>
```

**Best practices for `ariaLabel`**:
- Describe the action, not the icon: "Close dialog" not "X icon"
- Be concise but specific: "Edit profile" not "Click to edit your profile settings"
- Use verb-first format: "Open settings", "Delete item", "Add to favorites"

### WCAG 2.1 AA Compliance

| Criterion | Status | Implementation |
|-----------|--------|----------------|
| 1.4.1 Use of Color | ✅ | Visual variants use shape/border, not just color |
| 1.4.3 Contrast | ✅ | Icon colors meet 4.5:1 contrast ratio |
| 1.4.11 Non-text Contrast | ✅ | Focus ring meets 3:1 contrast ratio |
| 2.1.1 Keyboard | ✅ | Fully keyboard accessible (Tab, Enter, Space) |
| 2.4.7 Focus Visible | ✅ | Clear focus indicator with :focus-visible |
| 2.5.5 Target Size | ✅ | All sizes meet 48px minimum touch target |
| 2.5.8 Target Size Minimum | ✅ | Touch targets meet WCAG requirements |
| 4.1.2 Name, Role, Value | ✅ | Proper ARIA attributes via ariaLabel |

### Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab | Move focus to/from button |
| Enter | Activate button |
| Space | Activate button |

### Screen Reader Support

- Semantic `<button>` element provides implicit role
- `aria-label` set from ariaLabel prop
- Icon marked as decorative (`aria-hidden="true"`)
- State changes announced to assistive technology

---

## Design Decisions

### No Disabled State

Button-Icon intentionally does not support a `disabled` prop.

**Rationale**:
- Disabled buttons remove affordance without explanation
- Screen reader users may not understand *why* something is disabled
- Disabled states often have poor contrast (ironic for accessibility)

**Alternative Patterns**:

1. **Hide unavailable actions**: If an action isn't available, don't show the button
   ```html
   <!-- Instead of disabled button -->
   {canEdit && <button-icon icon="edit" aria-label="Edit item" />}
   ```

2. **Show validation messaging**: Keep button enabled, show error on interaction
   ```typescript
   button.addEventListener('press', () => {
     if (!isValid) {
       showError('Please complete the form first');
       return;
     }
     handleAction();
   });
   ```

3. **Use loading states**: When action is in progress (future feature)
   ```html
   <button-icon icon="save" aria-label="Saving..." loading />
   ```

### Self-Contained Focus Ring Buffer

The component includes a 4px transparent buffer on all sides to contain the focus ring without requiring external spacing.

**Benefits**:
- Consumers don't need to track spacing requirements
- Focus ring never clips or overlaps adjacent elements
- Component is truly self-contained and predictable

**Trade-off**: Total box size is larger than visual size (e.g., medium is 48px total but 40px visual circle).

### Circular Shape via Token

Uses `radiusCircle` semantic token (50%) instead of hardcoded values.

**Benefits**:
- Consistent circular shape across Button-Icon, avatars, badges
- Token-based approach enables theming
- Platform-specific output (CSS %, SwiftUI Circle(), Compose CircleShape)

---

## Platform-Specific Behavior

### Web
- Hover state with color transition
- `:focus-visible` for keyboard-only focus ring
- Shadow DOM for style encapsulation
- Box-shadow technique for secondary border shift prevention

### iOS
- Scale animation on press (scale096 = 0.96)
- `.clipShape(Circle())` for circular shape
- `.accessibilityLabel()` for screen reader support

### Android
- Material ripple effect on press
- `CircleShape` for circular shape
- `contentDescription` for accessibility

---

## File Structure

```
src/components/core/Button-Icon/
├── buttonIcon.tokens.ts          # Component-specific tokens
├── types.ts                      # Shared type definitions
├── README.md                     # This documentation
├── platforms/
│   ├── web/
│   │   ├── ButtonIcon.web.ts     # Web Component implementation
│   │   └── ButtonIcon.web.css    # Web styles
│   ├── ios/
│   │   └── ButtonIcon.swift      # SwiftUI implementation
│   └── android/
│       └── ButtonIcon.kt         # Compose implementation
└── __tests__/
    └── ButtonIcon.test.ts        # Unit tests
```

---

## Related Documentation

- [Button-CTA Component](../Button-CTA/README.md) - Text button with similar style matrix
- [Icon-Base Component](../Icon-Base/README.md) - Icon rendering component used internally
- [Component Quick Reference](/.kiro/steering/Component-Quick-Reference.md)

---

*This component is part of the DesignerPunk Design System, following Stemma System principles for cross-platform consistency and AI-optimal discoverability.*
