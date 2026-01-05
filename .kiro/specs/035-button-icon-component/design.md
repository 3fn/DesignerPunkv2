# Design Document: Button-Icon Component

**Date**: January 4, 2026
**Spec**: 035 - Button-Icon Component
**Status**: Design Phase
**Dependencies**: Icon Component (Spec 004), CTA Button Component, Accessibility Tokens, Radius Tokens

---

## Overview

Button-Icon is a circular, icon-only interactive button component that provides accessible actions without text labels. It follows the same style matrix as CTA buttons (Primary, Secondary, Tertiary × Small, Medium, Large) while introducing icon-specific accessibility patterns and circular visual treatment.

The component uses the Icon component internally for icon rendering, applies token-based styling throughout, and includes a self-contained focus ring buffer to prevent overlap with adjacent elements.

---

## Architecture

### Component Structure

Button-Icon follows True Native Architecture with separate platform implementations:

```
src/components/core/ButtonIcon/
├── types.ts                    # Shared TypeScript interfaces
├── buttonIcon.tokens.ts        # Component-specific tokens
├── platforms/
│   ├── web/
│   │   ├── ButtonIcon.web.ts   # Web Component implementation
│   │   └── ButtonIcon.web.css  # Web styles
│   ├── ios/
│   │   └── ButtonIcon.swift    # SwiftUI implementation
│   └── android/
│       └── ButtonIcon.kt       # Jetpack Compose implementation
└── __tests__/
    └── ButtonIcon.test.ts      # Cross-platform tests
```

### Token Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Button-Icon Component                     │
├─────────────────────────────────────────────────────────────┤
│  Semantic Tokens                                             │
│  ├── icon.size050/075/100 → Icon sizing                     │
│  ├── color.primary → Background (primary), Icon (sec/tert)  │
│  ├── color.contrast.onPrimary → Icon (primary)              │
│  ├── color.background.primary.subtle → Hover bg (secondary) │
│  ├── radiusCircle → Circular shape                          │
│  ├── accessibility.focus.* → Focus ring                     │
│  ├── blend.hoverDarker/pressedDarker → State overlays       │
│  ├── borderDefault/borderEmphasis → Secondary borders       │
│  ├── duration150 → Transition timing                        │
│  └── tapAreaRecommended → Touch target minimum              │
├─────────────────────────────────────────────────────────────┤
│  Component Tokens                                            │
│  └── buttonIcon.inset.small/medium/large → Padding          │
└─────────────────────────────────────────────────────────────┘
```

---

## Components and Interfaces

### Props Interface

```typescript
// types.ts
import { IconName } from '../Icon/types';

export type ButtonIconSize = 'small' | 'medium' | 'large';
export type ButtonIconVariant = 'primary' | 'secondary' | 'tertiary';

export interface ButtonIconProps {
  /** Icon to display (from Icon component) */
  icon: IconName;
  
  /** Accessible label for screen readers (required) */
  ariaLabel: string;
  
  /** Visual size variant */
  size?: ButtonIconSize;  // default: 'medium'
  
  /** Visual style variant */
  variant?: ButtonIconVariant;  // default: 'primary'
  
  /** Click/tap handler */
  onPress: () => void;
  
  /** Optional test ID for automated testing */
  testID?: string;
}
// Note: No `disabled` prop by design (see Design Decision 3)
```

### Component Token Interface

```typescript
// buttonIcon.tokens.ts
export const ButtonIconTokens = {
  inset: {
    /** Large size padding - references space.inset.150 */
    large: 12,
    
    /** Medium size padding - unique value, no semantic equivalent */
    medium: 10,
    
    /** Small size padding - references space.inset.100 */
    small: 8,
  },
} as const;

export type ButtonIconInsetVariant = keyof typeof ButtonIconTokens.inset;

export function getButtonIconInset(variant: ButtonIconInsetVariant): number {
  return ButtonIconTokens.inset[variant];
}
```

### Size Configuration

```typescript
// Internal size configuration mapping
const SIZE_CONFIG = {
  small: {
    iconToken: 'icon.size050',
    insetToken: 'buttonIcon.inset.small',
  },
  medium: {
    iconToken: 'icon.size075',
    insetToken: 'buttonIcon.inset.medium',
  },
  large: {
    iconToken: 'icon.size100',
    insetToken: 'buttonIcon.inset.large',
  },
} as const;
```

### Variant Configuration

```typescript
// Internal variant configuration mapping
const VARIANT_CONFIG = {
  primary: {
    background: 'color.primary',
    iconColor: 'color.contrast.onPrimary',
    border: null,
  },
  secondary: {
    background: 'transparent',
    iconColor: 'color.primary',
    border: { width: 'borderDefault', color: 'color.primary' },
    hoverBackground: 'color.background.primary.subtle',
    hoverBorder: { width: 'borderEmphasis', color: 'color.primary' },
  },
  tertiary: {
    background: 'transparent',
    iconColor: 'color.primary',
    border: null,
  },
} as const;
```

---

## Data Models

### Box Model

The component uses a layered box model with self-contained focus ring buffer:

```
┌─────────────────────────────────────────┐
│  Focus Ring Buffer (transparent)        │  ← accessibility.focus.offset + width
│  ┌─────────────────────────────────┐    │
│  │  Inset Padding                  │    │  ← buttonIcon.inset.*
│  │  ┌─────────────────────────┐    │    │
│  │  │                         │    │    │
│  │  │    Icon (centered)      │    │    │  ← icon.size*
│  │  │                         │    │    │
│  │  └─────────────────────────┘    │    │
│  │  Inset Padding                  │    │
│  └─────────────────────────────────┘    │
│  Focus Ring Buffer (transparent)        │
└─────────────────────────────────────────┘
```

### State Machine

```
                    ┌─────────┐
                    │ Default │
                    └────┬────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
    ┌─────────┐    ┌─────────┐    ┌─────────┐
    │  Hover  │    │ Focused │    │ Pressed │
    └────┬────┘    └────┬────┘    └────┬────┘
         │               │               │
         └───────────────┼───────────────┘
                         │
                    ┌────▼────┐
                    │ Default │
                    └─────────┘

States can combine: Hover+Focused, Pressed+Focused
```

---

## Design Decisions

### Decision 1: Self-Contained Focus Ring Buffer

**Options Considered**:
1. External spacing requirement (consumers add margin)
2. Focus ring clips at component boundary
3. Self-contained buffer within component

**Decision**: Self-contained buffer (Option 3)

**Rationale**: 
- Consumers don't need to track spacing requirements
- Focus ring never clips or overlaps adjacent elements
- Component is truly self-contained and predictable

**Trade-offs**: 
- Component total size is larger than visual size
- May require documentation to explain the difference

---

### Decision 2: Icon Component Integration

**Options Considered**:
1. Render SVG directly within Button-Icon
2. Use Icon component internally
3. Accept pre-rendered icon as children

**Decision**: Use Icon component internally (Option 2)

**Rationale**:
- Consistent icon rendering across all components
- Icon component handles sizing, color, and accessibility
- Single source of truth for icon behavior

**Trade-offs**:
- Dependency on Icon component
- Less flexibility for custom icon rendering

---

### Decision 3: No Disabled State

**Options Considered**:
1. Support disabled prop with reduced opacity
2. Support disabled prop with custom styling
3. No disabled state by design

**Decision**: No disabled state (Option 3)

**Rationale**:
- Disabled buttons remove affordance without explanation
- Screen reader users may not understand why something is disabled
- Disabled states often have poor contrast (ironic for accessibility)

**Trade-offs**:
- Consumers must implement alternative patterns (hide, validation messaging, loading states)
- May surprise developers expecting disabled prop

---

### Decision 4: Secondary Border Shift Prevention

**Options Considered**:
1. Keep border width constant (1px always)
2. Use padding adjustment to compensate
3. Reserve 2px space, simulate 1px with box-shadow

**Decision**: Box-shadow technique (Option 3)

**Rationale**:
- No layout shift during state transitions
- Visual border thickness changes as designed
- CSS-only solution, no JavaScript needed

**Trade-offs**:
- Slightly more complex CSS
- Box-shadow may render differently across browsers

---

### Decision 5: Platform-Specific Press Feedback

**Options Considered**:
1. Unified press feedback across platforms (e.g., opacity change)
2. Platform-specific native feedback
3. No press feedback

**Decision**: Platform-specific native feedback (Option 2)

**Rationale**:
- iOS users expect scale transform
- Android users expect Material ripple
- Web users expect CSS transitions
- Native patterns feel more natural per platform

**Trade-offs**:
- Different visual behavior across platforms
- More implementation complexity

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Size→Token Mapping

*For any* Button-Icon with a valid size variant (small, medium, large), the rendered component SHALL use the corresponding icon token (`icon.size050`, `icon.size075`, `icon.size100`) and padding token (`buttonIcon.inset.small`, `buttonIcon.inset.medium`, `buttonIcon.inset.large`).

**Validates: Requirements 1.1, 1.2, 1.3, 10.1, 10.2, 10.3**

---

### Property 2: Focus Buffer Presence

*For any* Button-Icon regardless of size or variant, the component SHALL include a transparent focus buffer on all sides equal to `accessibility.focus.offset` + `accessibility.focus.width`.

**Validates: Requirements 1.4, 6.3**

---

### Property 3: Variant→Styling Mapping

*For any* Button-Icon with a valid variant (primary, secondary, tertiary), the rendered component SHALL apply the correct background color, border, and icon color tokens as specified in the variant configuration.

**Validates: Requirements 2.1, 2.2, 2.3**

---

### Property 4: Circular Shape Token

*For any* Button-Icon regardless of size or variant, the component SHALL use the `radiusCircle` semantic token for border-radius, resulting in a perfect circle.

**Validates: Requirements 3.1**

---

### Property 5: ariaLabel Applied

*For any* Button-Icon with a non-empty ariaLabel string, the rendered component SHALL include that exact string as the accessible name (via `aria-label` on web, `.accessibilityLabel()` on iOS, `contentDescription` on Android).

**Validates: Requirements 4.2, 4.3, 4.4**

---

### Property 6: Icon Decorative

*For any* Button-Icon, the internal Icon component SHALL be marked as decorative (`aria-hidden="true"` on web) since the button itself provides the accessible name.

**Validates: Requirements 4.5**

---

### Property 7: Touch Target Minimum

*For any* Button-Icon regardless of size, the interactive touch target area SHALL be at least `tapAreaRecommended` (48px). For small size, this requires invisible hit area extension beyond the visual bounds.

**Validates: Requirements 5.1, 5.2, 5.3, 5.4**

---

### Property 8: Focus Ring Styling

*For any* Button-Icon that receives keyboard focus, the focus ring SHALL use `accessibility.focus.width` and `accessibility.focus.color` tokens, be positioned at `accessibility.focus.offset` from the visual button edge, and remain contained within the focus buffer.

**Validates: Requirements 6.1, 6.2, 6.3**

---

### Property 9: Hover State Styling

*For any* Button-Icon variant on hover, the component SHALL apply the correct blend token (`blend.hoverDarker`) to the appropriate element (background for primary, background+border+icon for secondary, icon only for tertiary) while maintaining circular shape.

**Validates: Requirements 7.1, 7.2, 7.3, 7.4**

---

### Property 10: Pressed State Styling

*For any* Button-Icon variant on press, the component SHALL apply the correct blend token (`blend.pressedDarker`) to the appropriate element while maintaining circular shape.

**Validates: Requirements 8.1, 8.2, 8.3, 8.6**

---

### Property 11: Secondary Border No Layout Shift

*For any* Button-Icon with secondary variant, transitioning between default, hover, and pressed states SHALL NOT cause any change in component dimensions (no layout shift).

**Validates: Requirements 9.1, 9.2**

---

### Property 12: Animation Tokens

*For any* Button-Icon state transition (default↔hover, default↔pressed), the transition SHALL use `duration150` token for timing and standard ease-in-out easing.

**Validates: Requirements 12.1, 12.2**

---

### Property 13: Icon Component Integration

*For any* Button-Icon, the Icon component SHALL be used internally with the correct icon name, size token based on Button-Icon size, and color based on Button-Icon variant.

**Validates: Requirements 13.1, 13.2, 13.3, 13.4**

---

## Error Handling

### Invalid Props

| Error Condition | Handling |
|-----------------|----------|
| Missing `icon` prop | TypeScript compile error |
| Missing `ariaLabel` prop | TypeScript compile error |
| Invalid `icon` name | Icon component handles (renders fallback or throws) |
| Empty `ariaLabel` string | Runtime warning in development, renders with empty label |
| Invalid `size` value | TypeScript compile error |
| Invalid `variant` value | TypeScript compile error |

### Runtime Errors

- **Icon component failure**: If Icon component fails to render, Button-Icon should still render as interactive button without icon
- **Token resolution failure**: If token cannot be resolved, fall back to hardcoded value and log warning

---

## Testing Strategy

### Dual Validation Approach

Testing uses two complementary approaches:

1. **Stemma Validators (Linting)**: Static analysis for structural validation
   - Component naming conventions
   - Token usage patterns (no hardcoded values)
   - Required props validation
   - Accessibility attribute presence

2. **Runtime Tests (Behavioral)**: Dynamic testing for functional validation
   - Rendering behavior
   - User interactions
   - State transitions
   - Cross-platform consistency

### Property-Based Tests

Each correctness property maps to a property-based test:

| Property | Test Approach |
|----------|---------------|
| 1. Size→Token Mapping | Generate all size variants, verify token usage |
| 2. Focus Buffer Presence | Generate random configs, verify buffer dimensions |
| 3. Variant→Styling Mapping | Generate all variants, verify styling |
| 4. Circular Shape Token | Generate random configs, verify radiusCircle usage |
| 5. ariaLabel Applied | Generate random strings, verify in output |
| 6. Icon Decorative | Generate random configs, verify aria-hidden |
| 7. Touch Target Minimum | Generate all sizes, verify touch target ≥ 48px |
| 8. Focus Ring Styling | Simulate focus, verify ring styling |
| 9. Hover State Styling | Simulate hover per variant, verify blend tokens |
| 10. Pressed State Styling | Simulate press per variant, verify blend tokens |
| 11. Secondary Border No Layout Shift | Measure dimensions across states |
| 12. Animation Tokens | Verify transition CSS properties |
| 13. Icon Component Integration | Verify Icon component props |

### Unit Tests (Examples and Edge Cases)

- Default prop values (size: medium, variant: primary)
- Focus-visible vs focus (mouse click vs keyboard)
- Platform-specific press feedback (scale on iOS, ripple on Android)
- Box-shadow technique for secondary border

---

## Platform-Specific Notes

### Web

```typescript
// Web Component registration
customElements.define('button-icon', ButtonIconElement);

// CSS Custom Properties for token consumption
.button-icon {
  --button-icon-radius: var(--radius-circle);
  --button-icon-focus-offset: var(--accessibility-focus-offset);
  --button-icon-focus-width: var(--accessibility-focus-width);
  --button-icon-focus-color: var(--accessibility-focus-color);
  --button-icon-transition: var(--duration-150);
}

// Secondary border technique
.button-icon--secondary {
  border: var(--border-emphasis) solid transparent;
  box-shadow: inset 0 0 0 var(--border-default) var(--color-primary);
}
```

### iOS (SwiftUI)

```swift
struct ButtonIcon: View {
  let icon: IconName
  let ariaLabel: String
  var size: ButtonIconSize = .medium
  var variant: ButtonIconVariant = .primary
  let onPress: () -> Void
  
  @State private var isPressed = false
  
  var body: some View {
    Button(action: onPress) {
      Icon(name: icon, size: iconSize, color: iconColor)
    }
    .clipShape(Circle())
    .scaleEffect(isPressed ? 0.97 : 1.0)
    .accessibilityLabel(ariaLabel)
  }
}
```

### Android (Jetpack Compose)

```kotlin
@Composable
fun ButtonIcon(
  icon: IconName,
  ariaLabel: String,
  size: ButtonIconSize = ButtonIconSize.Medium,
  variant: ButtonIconVariant = ButtonIconVariant.Primary,
  onPress: () -> Unit,
  modifier: Modifier = Modifier
) {
  Box(
    modifier = modifier
      .clip(CircleShape)
      .clickable(
        interactionSource = remember { MutableInteractionSource() },
        indication = rememberRipple(),
        onClick = onPress
      )
      .semantics { contentDescription = ariaLabel }
  ) {
    Icon(name = icon, size = iconSize, tint = iconColor)
  }
}
```
