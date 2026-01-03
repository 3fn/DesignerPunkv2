# Design Document: Button-Icon Component

**Date**: January 3, 2026
**Spec**: 035 - Button-Icon Component
**Status**: Design Phase
**Dependencies**: Icon Component, CTA Button Component, Accessibility Tokens

---

## Overview

The Button-Icon Component is a circular, icon-only interactive button following True Native Architecture with build-time platform separation. The component provides three size variants (small, medium, large), three visual styles (primary, secondary, tertiary), and comprehensive interaction states (hover, pressed, focus) while maintaining WCAG 2.1 AA accessibility compliance.

The design leverages the mathematical token system for all styling properties, integrates with the Icon Component for icon rendering, and follows the established True Native Architecture pattern with separate platform implementations sharing type definitions.

**Design Goals**:
- **Token-based styling**: Zero hard-coded values, all styling via semantic/primitive/component tokens
- **Mathematical consistency**: Sizing follows 8px baseline grid with strategic flexibility
- **Cross-platform unity**: Identical visual design with platform-specific interactions
- **Accessibility-first**: WCAG 2.1 AA compliance for touch targets, contrast, keyboard navigation
- **Self-contained focus ring**: 4px transparent buffer included in component box model
- **Circular shape**: Uses `radiusCircle` semantic token for true circular rendering

**Key Differences from CTA Button**:
- Circular shape (50% radius) vs rounded rectangle
- Icon-only content vs text + optional icon
- `aria-label` for accessibility vs visible text label
- Self-contained focus ring buffer vs external spacing
- No disabled state by design

---

## Architecture

### High-Level Component Structure

```
┌─────────────────────────────────────────────────────────────┐
│                   ButtonIcon Component                      │
│                                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Platform Abstraction Layer                │ │
│  │  (Shared types.ts - ButtonIconProps, ButtonIconSize)   │ │
│  └────────────────────────────────────────────────────────┘ │
│                           │                                 │
│         ┌─────────────────┼─────────────────┐               │
│         │                 │                 │               │
│    ┌────▼────┐      ┌────▼────┐      ┌──────▼──┐            │
│    │   Web   │      │   iOS   │      │ Android │            │
│    │Web Comp │      │ SwiftUI │      │ Compose │            │
│    └────┬────┘      └────┬────┘      └────┬────┘            │
│         │                │                │                 │
│    ┌────▼────────────────▼────────────────▼─────┐           │
│    │         Token System Integration           │           │
│    │  (Semantic tokens → Platform generation)   │           │
│    └────────────────────────────────────────────┘           │
│                           │                                 │
│    ┌──────────────────────▼──────────────────────┐          │
│    │           Icon Component Integration        │          │
│    │  (Icon rendering with size/color tokens)    │          │
│    └─────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

### True Native Architecture Pattern

The Button-Icon Component follows the established True Native Architecture pattern from the Icon Component and CTA Button Component:

**Build-Time Platform Separation**:
- Separate implementation files per platform (`.web.ts`, `.ios.swift`, `.android.kt`)
- No runtime platform detection or conditional rendering
- Platform-specific optimizations and native patterns
- Shared type definitions for API consistency

**Directory Structure**:
```
src/components/core/ButtonIcon/
├── README.md                      # Component documentation
├── types.ts                       # Shared TypeScript interfaces
├── __tests__/                     # Cross-platform tests
├── examples/                      # Usage examples (validation files)
└── platforms/                     # Platform-specific implementations
    ├── web/
    │   ├── ButtonIcon.web.ts     # Vanilla Web Component
    │   └── ButtonIcon.web.css    # Component styles
    ├── ios/
    │   └── ButtonIcon.ios.swift  # iOS implementation (SwiftUI)
    └── android/
        └── ButtonIcon.android.kt # Android implementation (Jetpack Compose)
```

**Benefits**:
- Zero runtime overhead from platform detection
- Platform-specific optimizations (SwiftUI modifiers, Compose semantics)
- Native interaction patterns (ripple on Android, scale on iOS)
- Type-safe APIs with platform-specific prop types

---

## Components and Interfaces

### Shared Type Definitions (types.ts)

```typescript
/**
 * Button-Icon size variants
 * - small: 32px visual circle, 40px total box (with focus buffer)
 * - medium: 40px visual circle, 48px total box (with focus buffer)
 * - large: 48px visual circle, 56px total box (with focus buffer)
 */
export type ButtonIconSize = 'small' | 'medium' | 'large';

/**
 * Button-Icon visual styles
 * - primary: Filled background with primary color
 * - secondary: Outlined with primary color border
 * - tertiary: Transparent background with primary color icon
 */
export type ButtonIconVariant = 'primary' | 'secondary' | 'tertiary';

/**
 * Button-Icon component props (platform-agnostic)
 */
export interface ButtonIconProps {
  /** Icon to display (from Icon Component) */
  icon: IconName;
  
  /** Accessible label for screen readers (required) */
  ariaLabel: string;
  
  /** Button size variant (default: 'medium') */
  size?: ButtonIconSize;
  
  /** Button visual style (default: 'primary') */
  variant?: ButtonIconVariant;
  
  /** Click/tap handler (required) */
  onPress: () => void;
  
  /** Optional test ID for automated testing */
  testID?: string;
}
```

### Platform-Specific Implementations

#### Web Implementation (ButtonIcon.web.ts)

```typescript
import { ButtonIconProps } from '../types';
import { Icon } from '../../Icon/platforms/web/Icon.web';

export class ButtonIcon extends HTMLElement {
  static get observedAttributes() {
    return ['icon', 'aria-label', 'size', 'variant'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  private render() {
    const icon = this.getAttribute('icon') || '';
    const ariaLabel = this.getAttribute('aria-label') || '';
    const size = this.getAttribute('size') || 'medium';
    const variant = this.getAttribute('variant') || 'primary';

    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          display: inline-block;
        }
        
        .button-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          border-radius: 50%;
          transition: background-color 0.15s ease;
        }
        
        .button-icon:focus-visible {
          outline: var(--accessibility-focus-width) solid var(--accessibility-focus-color);
          outline-offset: var(--accessibility-focus-offset);
        }
        
        /* Size variants */
        .button-icon--small {
          width: var(--button-icon-visual-small);
          height: var(--button-icon-visual-small);
          padding: var(--button-icon-inset-small);
          margin: var(--button-icon-focus-buffer);
        }
        
        .button-icon--medium {
          width: var(--button-icon-visual-medium);
          height: var(--button-icon-visual-medium);
          padding: var(--button-icon-inset-medium);
          margin: var(--button-icon-focus-buffer);
        }
        
        .button-icon--large {
          width: var(--button-icon-visual-large);
          height: var(--button-icon-visual-large);
          padding: var(--button-icon-inset-large);
          margin: var(--button-icon-focus-buffer);
        }
        
        /* Style variants */
        .button-icon--primary {
          background-color: var(--color-primary);
        }
        
        .button-icon--primary:hover {
          background-color: var(--color-primary-hover);
        }
        
        .button-icon--secondary {
          background-color: transparent;
          border: 1px solid var(--color-primary);
        }
        
        .button-icon--tertiary {
          background-color: transparent;
        }
      </style>
      
      <button
        class="button-icon button-icon--${size} button-icon--${variant}"
        aria-label="${ariaLabel}"
        type="button"
      >
        <icon-base 
          name="${icon}" 
          size="${this.getIconSize(size)}"
          color="${variant === 'primary' ? 'onPrimary' : 'primary'}"
          aria-hidden="true"
        ></icon-base>
      </button>
    `;
  }

  private getIconSize(size: string): string {
    switch (size) {
      case 'small': return 'size050';
      case 'medium': return 'size075';
      case 'large': return 'size100';
      default: return 'size075';
    }
  }
}

customElements.define('button-icon-base', ButtonIcon);
```

#### iOS Implementation (ButtonIcon.ios.swift)

```swift
import SwiftUI

struct ButtonIcon: View {
    let icon: IconName
    let ariaLabel: String
    let size: ButtonIconSize
    let variant: ButtonIconVariant
    let onPress: () -> Void
    let testID: String?
    
    @State private var isPressed = false
    
    init(
        icon: IconName,
        ariaLabel: String,
        size: ButtonIconSize = .medium,
        variant: ButtonIconVariant = .primary,
        onPress: @escaping () -> Void,
        testID: String? = nil
    ) {
        self.icon = icon
        self.ariaLabel = ariaLabel
        self.size = size
        self.variant = variant
        self.onPress = onPress
        self.testID = testID
    }
    
    var body: some View {
        Button(action: onPress) {
            Icon(
                name: icon,
                size: iconSize,
                color: iconColor
            )
            .frame(width: visualCircleSize, height: visualCircleSize)
            .background(backgroundColor)
            .clipShape(Circle())
            .overlay(
                Circle()
                    .stroke(borderColor, lineWidth: borderWidth)
            )
        }
        .buttonStyle(PlainButtonStyle())
        .frame(width: totalBoxSize, height: totalBoxSize)
        .frame(minWidth: touchTargetSize, minHeight: touchTargetSize)
        .scaleEffect(isPressed ? 0.97 : 1.0)
        .animation(.easeOut(duration: 0.1), value: isPressed)
        .accessibilityLabel(ariaLabel)
        .accessibilityIdentifier(testID ?? "")
    }
    
    // MARK: - Size Configuration
    
    private var iconSize: IconSize {
        switch size {
        case .small: return .size050   // 16px
        case .medium: return .size075  // 20px
        case .large: return .size100   // 24px
        }
    }
    
    private var visualCircleSize: CGFloat {
        switch size {
        case .small: return 32
        case .medium: return 40
        case .large: return 48
        }
    }
    
    private var totalBoxSize: CGFloat {
        visualCircleSize + 8  // 4px focus buffer on each side
    }
    
    private var touchTargetSize: CGFloat {
        return 48  // WCAG minimum
    }
    
    // MARK: - Style Configuration
    
    private var backgroundColor: Color {
        switch variant {
        case .primary: return Color("colorPrimary")
        case .secondary: return .clear
        case .tertiary: return .clear
        }
    }
    
    private var iconColor: Color {
        switch variant {
        case .primary: return Color("colorContrastOnPrimary")
        case .secondary: return Color("colorPrimary")
        case .tertiary: return Color("colorPrimary")
        }
    }
    
    private var borderColor: Color {
        switch variant {
        case .secondary: return Color("colorPrimary")
        default: return .clear
        }
    }
    
    private var borderWidth: CGFloat {
        switch variant {
        case .secondary: return 1
        default: return 0
        }
    }
}

enum ButtonIconSize {
    case small, medium, large
}

enum ButtonIconVariant {
    case primary, secondary, tertiary
}
```

#### Android Implementation (ButtonIcon.android.kt)

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.ripple.rememberRipple
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

@Composable
fun ButtonIcon(
    icon: IconName,
    ariaLabel: String,
    size: ButtonIconSize = ButtonIconSize.MEDIUM,
    variant: ButtonIconVariant = ButtonIconVariant.PRIMARY,
    onPress: () -> Unit,
    testID: String? = null
) {
    val interactionSource = remember { MutableInteractionSource() }
    
    Box(
        modifier = Modifier
            .size(totalBoxSize(size))
            .sizeIn(minWidth = 48.dp, minHeight = 48.dp)  // Touch target
            .semantics { contentDescription = ariaLabel }
            .testTag(testID ?: ""),
        contentAlignment = Alignment.Center
    ) {
        Box(
            modifier = Modifier
                .size(visualCircleSize(size))
                .clip(CircleShape)
                .background(backgroundColor(variant))
                .then(
                    if (variant == ButtonIconVariant.SECONDARY) {
                        Modifier.border(1.dp, borderColor(variant), CircleShape)
                    } else {
                        Modifier
                    }
                )
                .clickable(
                    interactionSource = interactionSource,
                    indication = rememberRipple(
                        bounded = true,
                        color = rippleColor(variant)
                    ),
                    onClick = onPress
                ),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                name = icon,
                size = iconSize(size),
                color = iconColor(variant)
            )
        }
    }
}

enum class ButtonIconSize { SMALL, MEDIUM, LARGE }
enum class ButtonIconVariant { PRIMARY, SECONDARY, TERTIARY }

// Size configuration
private fun iconSize(size: ButtonIconSize): IconSize = when (size) {
    ButtonIconSize.SMALL -> IconSize.SIZE_050   // 16dp
    ButtonIconSize.MEDIUM -> IconSize.SIZE_075  // 20dp
    ButtonIconSize.LARGE -> IconSize.SIZE_100   // 24dp
}

private fun visualCircleSize(size: ButtonIconSize): Dp = when (size) {
    ButtonIconSize.SMALL -> 32.dp
    ButtonIconSize.MEDIUM -> 40.dp
    ButtonIconSize.LARGE -> 48.dp
}

private fun totalBoxSize(size: ButtonIconSize): Dp = 
    visualCircleSize(size) + 8.dp  // 4dp focus buffer on each side

// Style configuration
@Composable
private fun backgroundColor(variant: ButtonIconVariant): Color = when (variant) {
    ButtonIconVariant.PRIMARY -> DesignTokens.colorPrimary
    ButtonIconVariant.SECONDARY -> Color.Transparent
    ButtonIconVariant.TERTIARY -> Color.Transparent
}

@Composable
private fun iconColor(variant: ButtonIconVariant): Color = when (variant) {
    ButtonIconVariant.PRIMARY -> DesignTokens.colorContrastOnPrimary
    ButtonIconVariant.SECONDARY -> DesignTokens.colorPrimary
    ButtonIconVariant.TERTIARY -> DesignTokens.colorPrimary
}

@Composable
private fun borderColor(variant: ButtonIconVariant): Color = when (variant) {
    ButtonIconVariant.SECONDARY -> DesignTokens.colorPrimary
    else -> Color.Transparent
}

@Composable
private fun rippleColor(variant: ButtonIconVariant): Color = when (variant) {
    ButtonIconVariant.PRIMARY -> Color.White.copy(alpha = 0.16f)
    else -> DesignTokens.colorPrimary.copy(alpha = 0.16f)
}
```

---

## Data Models

### Size Configuration

The button-icon size configuration defines the mathematical relationships between size variants and their corresponding tokens:

```typescript
interface SizeConfig {
  /** Icon size token reference */
  iconSize: string;
  
  /** Inset padding (component token) */
  insetPadding: string;
  
  /** Visual circle diameter (computed) */
  visualCircle: number;
  
  /** Focus ring buffer (constant) */
  focusBuffer: number;
  
  /** Total box size (computed) */
  totalBox: number;
  
  /** Touch target minimum */
  touchTarget: number;
}

const SIZE_CONFIG: Record<ButtonIconSize, SizeConfig> = {
  small: {
    iconSize: 'icon.size050',              // 16px
    insetPadding: 'buttonIcon.inset.small', // 8px
    visualCircle: 32,                       // 16 + (8 × 2)
    focusBuffer: 4,
    totalBox: 40,                           // 32 + (4 × 2)
    touchTarget: 48                         // Requires invisible extension
  },
  medium: {
    iconSize: 'icon.size075',               // 20px
    insetPadding: 'buttonIcon.inset.medium', // 10px
    visualCircle: 40,                        // 20 + (10 × 2)
    focusBuffer: 4,
    totalBox: 48,                            // 40 + (4 × 2)
    touchTarget: 48                          // Meets minimum exactly
  },
  large: {
    iconSize: 'icon.size100',               // 24px
    insetPadding: 'buttonIcon.inset.large', // 12px
    visualCircle: 48,                        // 24 + (12 × 2)
    focusBuffer: 4,
    totalBox: 56,                            // 48 + (4 × 2)
    touchTarget: 56                          // Exceeds minimum
  }
};
```

**Mathematical Relationships**:
- Visual circle = iconSize + (insetPadding × 2)
- Total box = visualCircle + (focusBuffer × 2)
- Focus buffer = 4px (constant, accommodates 2px offset + 2px width)

### Style Configuration

The button-icon style configuration defines color and border properties for each visual style:

```typescript
interface StyleConfig {
  /** Background color token reference */
  background: string;
  
  /** Icon color token reference */
  iconColor: string;
  
  /** Border width (0 for no border) */
  borderWidth: number;
  
  /** Border color token reference (if borderWidth > 0) */
  borderColor?: string;
}

const STYLE_CONFIG: Record<ButtonIconVariant, StyleConfig> = {
  primary: {
    background: 'color.primary',
    iconColor: 'color.contrast.onPrimary',
    borderWidth: 0
  },
  secondary: {
    background: 'transparent',
    iconColor: 'color.primary',
    borderWidth: 1,
    borderColor: 'color.primary'
  },
  tertiary: {
    background: 'transparent',
    iconColor: 'color.primary',
    borderWidth: 0
  }
};
```

### Interaction State Configuration

```typescript
interface InteractionConfig {
  /** Hover blend token (web only) */
  hoverBlend: string;
  
  /** Pressed blend token (all platforms) */
  pressedBlend: string;
  
  /** Focus outline width token reference */
  focusWidth: string;
  
  /** Focus outline color token reference */
  focusColor: string;
  
  /** Focus outline offset token reference */
  focusOffset: string;
}

const INTERACTION_CONFIG: InteractionConfig = {
  hoverBlend: 'blend.hoverDarker',
  pressedBlend: 'blend.pressedDarker',
  focusWidth: 'accessibility.focus.width',    // 2px
  focusColor: 'accessibility.focus.color',    // purple300
  focusOffset: 'accessibility.focus.offset'   // 2px
};
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*



### Property 1: Size Dimensions Match Specification

*For any* Button-Icon component with a valid size variant (small, medium, large), the rendered dimensions SHALL match the specification:
- Small: 16px icon, 8px padding, 32px visual circle, 40px total box
- Medium: 20px icon, 10px padding, 40px visual circle, 48px total box
- Large: 24px icon, 12px padding, 48px visual circle, 56px total box

**Validates: Requirements 1.1, 1.2, 1.3**

### Property 2: Variant Styling Matches Specification

*For any* Button-Icon component with a valid variant (primary, secondary, tertiary), the rendered styling SHALL match the specification:
- Primary: `color.primary` background, `color.contrast.onPrimary` icon
- Secondary: transparent background, `color.primary` border, `color.primary` icon
- Tertiary: transparent background, no border, `color.primary` icon

**Validates: Requirements 2.1, 2.2, 2.3**

### Property 3: Token-Only Styling

*For any* Button-Icon component, all styling properties (colors, spacing, sizing, radius) SHALL reference semantic, primitive, or component tokens with no hard-coded values.

**Validates: Requirements 2.4, 3.5**

### Property 4: Circular Shape via Token

*For any* Button-Icon component, the border-radius SHALL be applied using the `radiusCircle` semantic token, resulting in 50% border-radius on web platform.

**Validates: Requirements 3.1, 3.2**

### Property 5: Component Tokens for Inset Padding

*For any* Button-Icon component, the inset padding SHALL use component tokens:
- `buttonIcon.inset.small` (8px, references `inset.100`)
- `buttonIcon.inset.medium` (10px, unique value)
- `buttonIcon.inset.large` (12px, references `inset.150`)

**Validates: Requirements 4.1, 4.2, 4.3, 4.4**

### Property 6: Required ariaLabel Applied

*For any* Button-Icon component, the `ariaLabel` prop SHALL be required and applied to the button element as `aria-label` attribute (web), `.accessibilityLabel()` (iOS), or `contentDescription` (Android).

**Validates: Requirements 5.1, 5.2**

### Property 7: Icon Marked as Decorative

*For any* Button-Icon component, the icon element SHALL be marked as decorative (`aria-hidden="true"` on web) since the button has an accessible label.

**Validates: Requirements 5.5**

### Property 8: Touch Target Meets Minimum

*For any* Button-Icon component, the touch target SHALL be at least 48px × 48px:
- Large (56px total box): touch target equals total box
- Medium (48px total box): touch target equals total box
- Small (40px total box): touch target extends to 48px via invisible hit area

**Validates: Requirements 6.1, 6.2, 6.3, 6.4**

### Property 9: Focus Ring Contained in Buffer

*For any* Button-Icon component receiving keyboard focus, the focus ring SHALL:
- Use `accessibility.focus.width` and `accessibility.focus.color` tokens
- Be positioned at `accessibility.focus.offset` from visual circle edge
- Be fully contained within the 4px transparent buffer (no overflow beyond total box)

**Validates: Requirements 7.1, 7.2, 7.3**

### Property 10: Focus-Visible Only

*For any* Button-Icon component, the focus ring SHALL render only on keyboard navigation (`:focus-visible`), not on mouse click focus.

**Validates: Requirements 7.4, 7.5**

### Property 11: Interaction States Preserve Shape and Icon

*For any* Button-Icon component in hover or pressed state, the circular shape and icon color SHALL be maintained while background blend is applied.

**Validates: Requirements 8.4, 9.2, 10.4**

### Property 12: Cross-Platform Token Consistency

*For any* Button-Icon component rendered on any platform (web, iOS, Android), the token values for sizing, spacing, and colors SHALL be identical, maintaining consistent visual proportions.

**Validates: Requirements 12.1, 12.2**

---

## Error Handling

### Validation Strategy

The Button-Icon Component uses TypeScript's type system for compile-time validation and runtime checks for critical properties:

**Compile-Time Validation**:
- `ButtonIconSize` and `ButtonIconVariant` are string literal types (not arbitrary strings)
- `IconName` type from Icon Component ensures only valid icons can be used
- Required props (`icon`, `ariaLabel`, `onPress`) enforced by TypeScript
- No `disabled` prop in interface (by design)

**Runtime Validation**:
```typescript
// Validate required props
if (!ariaLabel || ariaLabel.trim().length === 0) {
  console.warn('ButtonIcon: ariaLabel prop is required and cannot be empty');
  return null;
}

if (!icon || !isValidIconName(icon)) {
  console.warn(`ButtonIcon: Invalid icon name "${icon}". Component will not render.`);
  return null;
}

if (!onPress || typeof onPress !== 'function') {
  console.warn('ButtonIcon: onPress prop is required and must be a function');
  return null;
}
```

### Error Recovery

**Missing ariaLabel**:
- Component does not render (accessibility requirement)
- Log warning: `"ButtonIcon: ariaLabel is required for accessibility"`
- This is a hard requirement, not a graceful degradation

**Invalid Icon**:
- Component does not render (icon is the only content)
- Log warning: `"ButtonIcon: Invalid icon name"`
- Unlike CTA button, there's no text fallback

**Missing onPress Handler**:
- Component renders but is non-interactive
- Log warning: `"ButtonIcon: onPress handler is required"`
- Button appears but does nothing on click

### Platform-Specific Error Handling

**Web**:
- Use `console.warn()` for development warnings
- Production builds can strip console statements via build config
- Graceful degradation for missing CSS custom properties

**iOS**:
- Use `assertionFailure()` for development-only checks
- Production builds ignore assertions
- Provide sensible defaults for missing token values

**Android**:
- Use `Log.w()` for warnings in development
- ProGuard strips logs in release builds
- Handle missing resources with fallback values

---

## Testing Strategy

### Dual Validation Approach

The Button-Icon Component uses a dual validation approach combining static analysis (linting) and runtime testing:

- **Static Analysis (Linting)**: Validates structure, naming, and token usage at development time
- **Runtime Testing**: Validates behavior, contracts, and interactions during test execution
- **Together**: Comprehensive coverage with minimal redundancy

### Stemma System Validators (Static Analysis)

The component integrates with Stemma System validators for structural validation:

**StemmaComponentNamingValidator**:
```typescript
import { validateComponentName } from '../validators';

// Validates component naming convention
const result = validateComponentName('ButtonIcon-Base');
// ✅ Valid: Family=ButtonIcon, Type=Base
```

**StemmaTokenUsageValidator**:
```typescript
import { validateTokenUsage } from '../validators';

// Validates no inline styles or hard-coded values
const result = validateTokenUsage(componentStyles);
// Catches: inline colors, hard-coded px values, missing token references
```

**StemmaPropertyAccessibilityValidator**:
```typescript
import { validatePropertyAndAccessibility } from '../validators';

// Validates required properties and accessibility
const result = validatePropertyAndAccessibility(
  'ButtonIcon-Base',
  { icon: 'close', ariaLabel: 'Close menu' },
  buttonIconSchema
);
// Validates: required props present, ariaLabel not empty, WCAG compliance
```

### Validation Type Decision Framework

| Validation Need | Linting | Testing |
|-----------------|---------|---------|
| Component naming convention | ✅ | |
| Token usage patterns (no inline styles) | ✅ | |
| Required properties present | ✅ | |
| Schema compliance | ✅ | |
| Component renders correctly | | ✅ |
| User interactions work | | ✅ |
| Integration contracts honored | | ✅ |
| Accessibility features work | | ✅ |
| WCAG compliance | ✅ | ✅ |
| Cross-platform consistency | | ✅ |
| Token values are correct | | ✅ |

### Stemma Validation Checklist

**For Button-Icon Component**:
- [ ] **Naming**: `validateComponentName('ButtonIcon-Base')` passes
- [ ] **Token Usage**: `validateTokenUsage()` passes (no hard-coded values)
- [ ] **Properties**: `validatePropertyAndAccessibility()` passes
- [ ] **Unit Tests**: Core behavior tested
- [ ] **Integration Tests**: Icon Component contract tested
- [ ] **Accessibility Tests**: WCAG compliance verified
- [ ] **Property Tests**: Correctness properties validated

### Unit Testing

**Component Rendering Tests**:
```typescript
describe('ButtonIcon', () => {
  it('renders with required props', () => {
    const onPress = jest.fn();
    render(<ButtonIcon icon="close" ariaLabel="Close menu" onPress={onPress} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Close menu');
  });
  
  it('applies correct size classes', () => {
    const onPress = jest.fn();
    const { rerender } = render(
      <ButtonIcon icon="close" ariaLabel="Close" size="small" onPress={onPress} />
    );
    expect(screen.getByRole('button')).toHaveClass('button-icon--small');
    
    rerender(<ButtonIcon icon="close" ariaLabel="Close" size="large" onPress={onPress} />);
    expect(screen.getByRole('button')).toHaveClass('button-icon--large');
  });
  
  it('renders icon with correct size token', () => {
    const onPress = jest.fn();
    render(<ButtonIcon icon="close" ariaLabel="Close" size="small" onPress={onPress} />);
    const icon = screen.getByTestId('icon-close');
    expect(icon).toHaveAttribute('size', 'size050');
  });
  
  it('marks icon as decorative', () => {
    const onPress = jest.fn();
    render(<ButtonIcon icon="close" ariaLabel="Close" onPress={onPress} />);
    const icon = screen.getByTestId('icon-close');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });
});
```

**Interaction Tests**:
```typescript
describe('ButtonIcon interactions', () => {
  it('calls onPress when clicked', () => {
    const onPress = jest.fn();
    render(<ButtonIcon icon="close" ariaLabel="Close" onPress={onPress} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
  
  it('activates on Enter key', () => {
    const onPress = jest.fn();
    render(<ButtonIcon icon="close" ariaLabel="Close" onPress={onPress} />);
    const button = screen.getByRole('button');
    button.focus();
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(onPress).toHaveBeenCalledTimes(1);
  });
  
  it('activates on Space key', () => {
    const onPress = jest.fn();
    render(<ButtonIcon icon="close" ariaLabel="Close" onPress={onPress} />);
    const button = screen.getByRole('button');
    button.focus();
    fireEvent.keyDown(button, { key: ' ' });
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
```

### Accessibility Testing

**WCAG Compliance Tests**:
```typescript
describe('ButtonIcon accessibility', () => {
  it('has correct ARIA role', () => {
    const onPress = jest.fn();
    render(<ButtonIcon icon="close" ariaLabel="Close" onPress={onPress} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
  
  it('has accessible name from ariaLabel', () => {
    const onPress = jest.fn();
    render(<ButtonIcon icon="close" ariaLabel="Close menu" onPress={onPress} />);
    expect(screen.getByRole('button', { name: 'Close menu' })).toBeInTheDocument();
  });
  
  it('meets minimum touch target size', () => {
    const onPress = jest.fn();
    render(<ButtonIcon icon="close" ariaLabel="Close" size="small" onPress={onPress} />);
    const button = screen.getByRole('button');
    const { width, height } = button.getBoundingClientRect();
    // Small size has 40px total box but 48px touch target
    expect(Math.max(width, 48)).toBeGreaterThanOrEqual(48);
    expect(Math.max(height, 48)).toBeGreaterThanOrEqual(48);
  });
  
  it('shows focus indicator on keyboard navigation', () => {
    const onPress = jest.fn();
    render(<ButtonIcon icon="close" ariaLabel="Close" onPress={onPress} />);
    const button = screen.getByRole('button');
    button.focus();
    // Simulate keyboard navigation (focus-visible)
    expect(button).toHaveClass('button-icon--focused');
  });
  
  it('does not show focus indicator on mouse click', () => {
    const onPress = jest.fn();
    render(<ButtonIcon icon="close" ariaLabel="Close" onPress={onPress} />);
    const button = screen.getByRole('button');
    fireEvent.mouseDown(button);
    fireEvent.mouseUp(button);
    expect(button).not.toHaveClass('button-icon--focused');
  });
});
```

### Visual Regression Testing

**Snapshot Tests**:
```typescript
describe('ButtonIcon visual regression', () => {
  it('matches snapshot for all size variants', () => {
    const onPress = jest.fn();
    const { container } = render(
      <>
        <ButtonIcon icon="close" ariaLabel="Close" size="small" onPress={onPress} />
        <ButtonIcon icon="close" ariaLabel="Close" size="medium" onPress={onPress} />
        <ButtonIcon icon="close" ariaLabel="Close" size="large" onPress={onPress} />
      </>
    );
    expect(container).toMatchSnapshot();
  });
  
  it('matches snapshot for all style variants', () => {
    const onPress = jest.fn();
    const { container } = render(
      <>
        <ButtonIcon icon="close" ariaLabel="Close" variant="primary" onPress={onPress} />
        <ButtonIcon icon="close" ariaLabel="Close" variant="secondary" onPress={onPress} />
        <ButtonIcon icon="close" ariaLabel="Close" variant="tertiary" onPress={onPress} />
      </>
    );
    expect(container).toMatchSnapshot();
  });
  
  it('matches snapshot for size × variant matrix', () => {
    const onPress = jest.fn();
    const sizes = ['small', 'medium', 'large'] as const;
    const variants = ['primary', 'secondary', 'tertiary'] as const;
    
    const { container } = render(
      <>
        {sizes.map(size => 
          variants.map(variant => (
            <ButtonIcon 
              key={`${size}-${variant}`}
              icon="close" 
              ariaLabel="Close" 
              size={size} 
              variant={variant} 
              onPress={onPress} 
            />
          ))
        )}
      </>
    );
    expect(container).toMatchSnapshot();
  });
});
```

### Token Integration Testing

**Token Usage Tests**:
```typescript
describe('ButtonIcon token integration', () => {
  it('uses correct icon size tokens', () => {
    const onPress = jest.fn();
    
    const { rerender } = render(
      <ButtonIcon icon="close" ariaLabel="Close" size="small" onPress={onPress} />
    );
    expect(screen.getByTestId('icon-close')).toHaveAttribute('size', 'size050');
    
    rerender(<ButtonIcon icon="close" ariaLabel="Close" size="medium" onPress={onPress} />);
    expect(screen.getByTestId('icon-close')).toHaveAttribute('size', 'size075');
    
    rerender(<ButtonIcon icon="close" ariaLabel="Close" size="large" onPress={onPress} />);
    expect(screen.getByTestId('icon-close')).toHaveAttribute('size', 'size100');
  });
  
  it('uses radiusCircle token for border-radius', () => {
    const onPress = jest.fn();
    render(<ButtonIcon icon="close" ariaLabel="Close" onPress={onPress} />);
    const button = screen.getByRole('button');
    expect(getComputedStyle(button).borderRadius).toBe('50%');
  });
  
  it('uses accessibility tokens for focus ring', () => {
    const onPress = jest.fn();
    render(<ButtonIcon icon="close" ariaLabel="Close" onPress={onPress} />);
    const button = screen.getByRole('button');
    button.focus();
    const styles = getComputedStyle(button);
    expect(styles.outlineWidth).toBe('var(--accessibility-focus-width)');
    expect(styles.outlineColor).toBe('var(--accessibility-focus-color)');
  });
});
```

---

## Design Decisions

### Decision 1: Self-Contained Focus Ring Buffer

**Options Considered**:
1. **External spacing requirement** (consumers add margin for focus ring)
2. **Self-contained buffer** (chosen approach: 4px transparent buffer in component)
3. **Focus ring inside visual bounds** (focus ring overlaps button content)

**Decision**: Include 4px transparent buffer on all sides within the component's total box size.

**Rationale**:

The self-contained approach provides several benefits:
1. **Consumer simplicity**: No need to track focus ring spacing requirements
2. **Predictable layout**: Total box size is the only dimension consumers need
3. **No clipping**: Focus ring never clips or overlaps adjacent elements
4. **Accessibility compliance**: Focus ring always visible without layout adjustments

**Mathematical Basis**:
- Focus offset: 2px (`accessibility.focus.offset`)
- Focus width: 2px (`accessibility.focus.width`)
- Total extension per side: 4px
- Buffer accommodates: offset + width = 2 + 2 = 4px

**Trade-offs**:
- ✅ **Gained**: Self-contained component, no external spacing requirements
- ✅ **Gained**: Predictable layout behavior
- ✅ **Gained**: Focus ring never clips
- ❌ **Lost**: Slightly larger total box than visual circle
- ❌ **Lost**: Cannot customize focus ring position without component changes

### Decision 2: No Disabled State

**Options Considered**:
1. **Support disabled state** (like most button components)
2. **No disabled state** (chosen approach)
3. **Disabled with tooltip** (explain why disabled)

**Decision**: Button-Icon does not support disabled states by design.

**Rationale**:

Disabled buttons are an accessibility anti-pattern:
1. **Removes affordance**: Users can't interact to learn why action is unavailable
2. **Poor contrast**: Disabled states often have insufficient contrast
3. **Screen reader confusion**: Users may not understand why button is disabled
4. **Better alternatives exist**: Hide unavailable actions or show validation on interaction

**Alternative Patterns**:
- Keep buttons enabled but show validation/error messaging on interaction
- Hide actions that aren't available rather than disabling them
- Use loading states when actions are in progress

**Trade-offs**:
- ✅ **Gained**: Better accessibility (no low-contrast disabled states)
- ✅ **Gained**: Forces better UX patterns (explain unavailability)
- ✅ **Gained**: Simpler component API
- ❌ **Lost**: Cannot match disabled patterns from other design systems
- ❌ **Lost**: Consumers must implement alternative patterns

### Decision 3: Component Tokens for Inset Padding Only

**Options Considered**:
1. **No component tokens** (use semantic tokens directly)
2. **Component tokens for padding only** (chosen approach)
3. **Full component token system** (all button-icon properties)

**Decision**: Create component tokens only for the inset padding family because semantic tokens cannot fully support all three values.

**Rationale**:

The medium size requires 10px padding, which has no semantic equivalent:
- Large (12px): `inset.150` exists
- Medium (10px): No semantic token
- Small (8px): `inset.100` exists

Creating component tokens for the entire family maintains consistency:
- `buttonIcon.inset.large` → references `inset.150`
- `buttonIcon.inset.medium` → unique value (10px)
- `buttonIcon.inset.small` → references `inset.100`

**Principle**: Component tokens are for *families of values that semantic tokens can't fully support*. If semantic tokens cover the need, use them directly.

**Trade-offs**:
- ✅ **Gained**: Consistent token family for all sizes
- ✅ **Gained**: References semantic tokens where available
- ✅ **Gained**: Single source of truth for button-icon padding
- ❌ **Lost**: Additional tokens to maintain
- ❌ **Lost**: Slight indirection for large/small sizes

### Decision 4: Platform-Specific Press Feedback

**Options Considered**:
1. **Unified press feedback** (same animation on all platforms)
2. **Platform-specific feedback** (chosen approach: scale on iOS, ripple on Android)
3. **No press feedback** (rely on state change only)

**Decision**: Implement platform-specific press feedback that follows native conventions.

**Rationale**:

Each platform has established interaction patterns:
- **iOS**: Scale transform (0.97) with spring animation
- **Android**: Material ripple effect emanating from touch point
- **Web**: CSS transitions for hover/active states

Using platform-specific patterns provides:
1. **Familiar experience**: Users encounter patterns they know
2. **Platform integration**: Buttons feel native
3. **Performance**: Platform-optimized implementations

**Trade-offs**:
- ✅ **Gained**: Native feel on each platform
- ✅ **Gained**: Optimal performance
- ✅ **Gained**: Better accessibility integration
- ❌ **Lost**: Interaction behavior differs across platforms
- ❌ **Lost**: Cannot demonstrate all interactions in single-platform prototypes

### Decision 5: Loading State Deferred

**Options Considered**:
1. **Implement loading state now** (spinner replaces icon)
2. **Defer loading state** (chosen approach, matching CTA button)
3. **No loading state** (not part of component API)

**Decision**: Defer loading state implementation to match CTA button approach.

**Rationale**:

CTA button designed the `loading?: boolean` API but deferred visual implementation pending animation token system. Button-Icon follows the same pattern for consistency:
- API designed now (future-proof interface)
- Visual implementation when animation tokens exist
- Consistent approach across button components

**Future Behavior** (when implemented):
- Spinner replaces icon
- Button remains interactive but action is suppressed
- Screen reader announces "Loading" or "Busy"

**Trade-offs**:
- ✅ **Gained**: Consistent with CTA button approach
- ✅ **Gained**: API ready for future implementation
- ✅ **Gained**: No incomplete visual implementation
- ❌ **Lost**: Loading state not available immediately
- ❌ **Lost**: Consumers must implement own loading pattern temporarily

### Decision 6: Token Rename (color.text.onPrimary → color.contrast.onPrimary)

**Options Considered**:
1. **Keep color.text.onPrimary** (use for icons despite name)
2. **Rename to color.contrast.onPrimary** (chosen approach)
3. **Create separate color.icon.onPrimary** (duplicate token)

**Decision**: Rename `color.text.onPrimary` to `color.contrast.onPrimary` for semantic accuracy.

**Rationale**:

"Contrast" is semantically accurate for both text and icons:
1. **Semantic accuracy**: "Contrast" describes the relationship (content on primary background)
2. **WCAG alignment**: WCAG uses "contrast" terminology
3. **Future-proof**: Works for any content type (text, icons, other elements)
4. **Single token**: No duplication for text vs icon

**Trade-offs**:
- ✅ **Gained**: Semantically accurate name
- ✅ **Gained**: Works for all content types
- ✅ **Gained**: Aligns with WCAG terminology
- ❌ **Lost**: Breaking change for existing CTA button usage
- ❌ **Lost**: Migration effort required

---

## Token Requirements Summary

### Prerequisite Tokens to Create

The following tokens must be created before implementing the Button-Icon Component:

#### 1. Token Rename: color.contrast.onPrimary

```typescript
// SemanticColorTokens.ts
export const SemanticColorTokens = {
  // ... existing tokens
  contrast: {
    onPrimary: 'white100'  // Renamed from color.text.onPrimary
  }
};
```

**Purpose**: Content color (text/icons) on primary-colored backgrounds
**Value**: `white100` (primitive)
**Migration**: Update CTA button to use `color.contrast.onPrimary`

#### 2. Primitive Token: radiusHalf

```typescript
// RadiusTokens.ts
export const RadiusTokens = {
  // ... existing tokens
  radiusHalf: {
    name: 'radiusHalf',
    category: TokenCategory.RADIUS,
    baseValue: 50,
    description: 'Half radius (50%) - creates perfect circles when width equals height',
    platforms: {
      web: { value: 50, unit: '%' },
      ios: { value: 'Circle', unit: 'shape' },
      android: { value: 50, unit: 'percent' }
    }
  }
};
```

**Purpose**: Primitive token for 50% border-radius
**Platform Output**: Web: `50%`, iOS: `Circle` shape, Android: `50` percent

#### 3. Semantic Token: radiusCircle

```typescript
// SemanticRadiusTokens.ts
export const SemanticRadiusTokens = {
  // ... existing tokens
  radiusCircle: {
    value: 'radiusHalf',
    description: 'Circle radius for perfectly circular elements'
  }
};
```

**Purpose**: Semantic token for circular elements
**References**: `radiusHalf` primitive
**Use Cases**: Button-Icon, circular avatars, circular badges

#### 4. Component Tokens: buttonIcon.inset.*

```typescript
// ButtonIconTokens.ts
export const ButtonIconTokens = {
  inset: {
    large: { value: 'inset.150', resolved: 12 },   // References semantic
    medium: { value: 10 },                          // Unique value
    small: { value: 'inset.100', resolved: 8 }     // References semantic
  }
};
```

**Purpose**: Inset padding for Button-Icon sizes
**Rationale**: Medium size (10px) has no semantic equivalent

---

## Component Examples Pattern

The Button-Icon Component follows the same "canary pattern" established by CTA Button:

- **README serves as source of truth** for component usage and API documentation
- **HTML validation files** provide automated validation that examples remain functional
- **Examples are embedded in README** using standard markdown code blocks

### README Structure

```markdown
# ButtonIcon Component

## Overview
Circular icon-only button for accessible actions without text labels.

## Usage

### Basic Usage
<button-icon-base icon="close" aria-label="Close menu"></button-icon-base>

### Size Variants
<button-icon-base icon="close" aria-label="Close" size="small"></button-icon-base>
<button-icon-base icon="close" aria-label="Close" size="medium"></button-icon-base>
<button-icon-base icon="close" aria-label="Close" size="large"></button-icon-base>

### Visual Styles
<button-icon-base icon="close" aria-label="Close" variant="primary"></button-icon-base>
<button-icon-base icon="close" aria-label="Close" variant="secondary"></button-icon-base>
<button-icon-base icon="close" aria-label="Close" variant="tertiary"></button-icon-base>

## API Reference
[Props table]

## Accessibility
- Required `aria-label` for screen reader support
- 48px minimum touch target on all sizes
- Focus-visible only (keyboard navigation)
- Icon marked as decorative (aria-hidden)

## Platform-Specific Notes
- iOS: Scale transform (0.97) on press
- Android: Material ripple effect on press
- Web: CSS transitions for hover/active states
```

---

*This design document provides comprehensive specifications for the Button-Icon Component, including architecture, interfaces, data models, correctness properties, error handling, testing strategy, and design decisions.*
