# Design Document: CTA Button Component

**Date**: November 19, 2025
**Spec**: 005 - CTA Button Component
**Status**: Design Phase
**Dependencies**: Spec 004 (Icon System), Spec 006 (Icon Size Tokens), Spec 007 (Accessibility Token Family)

---

## Overview

The CTA Button Component is a cross-platform call-to-action button following True Native Architecture with build-time platform separation. The component provides three size variants (small, medium, large), three visual styles (primary, secondary, tertiary), and comprehensive interaction states (hover, pressed, focus) while maintaining WCAG 2.1 AA accessibility compliance.

The design leverages the mathematical token system for all styling properties, integrates with the Icon System (Spec 004) for optional leading icons with optical weight compensation, and follows the established True Native Architecture pattern with separate platform implementations sharing type definitions.

**Design Goals**:
- **Token-based styling**: Zero hard-coded values, all styling via semantic/primitive tokens
- **Mathematical consistency**: Sizing follows 8px baseline grid with strategic flexibility
- **Cross-platform unity**: Identical visual design with platform-specific interactions
- **Accessibility-first**: WCAG 2.1 AA compliance for touch targets, contrast, keyboard navigation
- **Compositional architecture**: Reuse existing tokens, create new semantic tokens only when justified

---

## Architecture

### High-Level Component Structure


```
┌─────────────────────────────────────────────────────────────┐
│                    ButtonCTA Component                       │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              Platform Abstraction Layer             │    │
│  │  (Shared types.ts - ButtonProps, ButtonSize, etc.) │    │
│  └────────────────────────────────────────────────────┘    │
│                           │                                  │
│         ┌─────────────────┼─────────────────┐              │
│         │                 │                 │              │
│    ┌────▼────┐      ┌────▼────┐      ┌────▼────┐         │
│    │   Web   │      │   iOS   │      │ Android │         │
│    │Web Comp │      │ SwiftUI │      │ Compose │         │
│    └────┬────┘      └────┬────┘      └────┬────┘         │
│         │                 │                 │              │
│    ┌────▼────────────────▼─────────────────▼────┐         │
│    │         Token System Integration           │         │
│    │  (Semantic tokens → Platform generation)   │         │
│    └────────────────────────────────────────────┘         │
│                           │                                  │
│    ┌──────────────────────▼──────────────────────┐         │
│    │         Icon System Integration             │         │
│    │  (Optional leading icon with optical blend) │         │
│    └─────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────┘
```


### True Native Architecture Pattern

The Button Component follows the established True Native Architecture pattern from the Icon System (Spec 004):

**Build-Time Platform Separation**:
- Separate implementation files per platform (`.web.tsx`, `.ios.swift`, `.android.kt`)
- No runtime platform detection or conditional rendering
- Platform-specific optimizations and native patterns
- Shared type definitions for API consistency

**Directory Structure**:
```
src/components/core/ButtonCTA/
├── README.md                    # Component documentation
├── types.ts                     # Shared TypeScript interfaces
├── __tests__/                   # Cross-platform tests
├── examples/                    # Usage examples
└── platforms/                   # Platform-specific implementations
    ├── web/
    │   ├── ButtonCTA.web.ts    # Vanilla Web Component
    │   └── ButtonCTA.web.css   # Component styles
    ├── ios/ButtonCTA.ios.swift
    └── android/ButtonCTA.android.kt
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
 * Button size variants
 * - small: 40px height (extends to 44px touch target on mobile)
 * - medium: 48px height (meets 44px touch target)
 * - large: 56px height (exceeds 44px touch target)
 */
export type ButtonSize = 'small' | 'medium' | 'large';

/**
 * Button visual styles
 * - primary: Filled background with primary color
 * - secondary: Outlined with primary color border
 * - tertiary: Text-only with primary color text
 */
export type ButtonStyle = 'primary' | 'secondary' | 'tertiary';

/**
 * Button component props (platform-agnostic)
 */
export interface ButtonProps {
  /** Button text label (required) */
  label: string;
  
  /** Button size variant (default: 'medium') */
  size?: ButtonSize;
  
  /** Button visual style (default: 'primary') */
  style?: ButtonStyle;
  
  /** Optional leading icon from Icon System */
  icon?: IconName;
  
  /** Prevent text wrapping (default: false) */
  noWrap?: boolean;
  
  /** Click/tap handler (required) */
  onPress: () => void;
  
  /** Optional test ID for automated testing */
  testID?: string;
  
  /** Optional disabled state (default: false) */
  disabled?: boolean;
}
```


### Platform-Specific Implementations

#### Web Implementation (ButtonCTA.web.tsx)

```typescript
import React from 'react';
import { ButtonProps } from '../types';
import { Icon } from '../../Icon/platforms/web/Icon.web';

export const ButtonCTA: React.FC<ButtonProps> = ({
  label,
  size = 'medium',
  style = 'primary',
  icon,
  noWrap = false,
  onPress,
  testID,
  disabled = false
}) => {
  return (
    <button
      className={`button-cta button-cta--${size} button-cta--${style}`}
      onClick={onPress}
      data-testid={testID}
      disabled={disabled}
      type="button"
    >
      {icon && (
        <Icon
          name={icon}
          size={size === 'large' ? 'size125' : 'size100'}
          color={style === 'primary' ? 'onPrimary' : 'primary'}
        />
      )}
      <span className={noWrap ? 'button-cta__label--no-wrap' : 'button-cta__label'}>
        {label}
      </span>
    </button>
  );
};
```

**Styling Approach**:
- CSS custom properties for token consumption
- Flexbox for icon-text layout with `gap` for spacing
- `:focus-visible` for keyboard-only focus indicators
- `:hover` and `:active` pseudo-classes for interaction states


#### iOS Implementation (ButtonCTA.ios.swift)

```swift
import SwiftUI

struct ButtonCTA: View {
    let label: String
    let size: ButtonSize
    let style: ButtonStyle
    let icon: IconName?
    let noWrap: Bool
    let onPress: () -> Void
    let testID: String?
    let disabled: Bool
    
    @State private var isPressed = false
    
    var body: some View {
        Button(action: onPress) {
            HStack(spacing: iconTextSpacing) {
                if let iconName = icon {
                    Icon(
                        name: iconName,
                        size: iconSize,
                        color: iconColor
                    )
                }
                
                Text(label)
                    .font(typography)
                    .foregroundColor(textColor)
                    .lineLimit(noWrap ? 1 : nil)
            }
            .padding(.horizontal, horizontalPadding)
            .padding(.vertical, verticalPadding)
            .frame(minWidth: minWidth, minHeight: touchTargetHeight)
            .background(backgroundColor)
            .cornerRadius(borderRadius)
            .overlay(
                RoundedRectangle(cornerRadius: borderRadius)
                    .stroke(borderColor, lineWidth: borderWidth)
            )
        }
        .buttonStyle(PlainButtonStyle())
        .scaleEffect(isPressed ? 0.97 : 1.0)
        .animation(.easeOut(duration: 0.1), value: isPressed)
        .disabled(disabled)
        .accessibilityIdentifier(testID ?? "")
    }
}
```

**Platform-Specific Features**:
- Scale transform (0.97) on press for tactile feedback
- `.frame(minHeight: 44)` for touch target compliance
- Dynamic Type support via `.font()` modifier
- Safe area inset handling for full-width buttons


#### Android Implementation (ButtonCTA.android.kt)

```kotlin
import androidx.compose.foundation.layout.*
import androidx.compose.material.ripple.rememberRipple
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun ButtonCTA(
    label: String,
    size: ButtonSize = ButtonSize.MEDIUM,
    style: ButtonStyle = ButtonStyle.PRIMARY,
    icon: IconName? = null,
    noWrap: Boolean = false,
    onPress: () -> Unit,
    testID: String? = null,
    disabled: Boolean = false
) {
    Button(
        onClick = onPress,
        modifier = Modifier
            .heightIn(min = touchTargetHeight.dp)
            .widthIn(min = minWidth.dp)
            .testTag(testID ?: ""),
        enabled = !disabled,
        colors = buttonColors(style),
        shape = RoundedCornerShape(borderRadius.dp),
        contentPadding = PaddingValues(
            horizontal = horizontalPadding.dp,
            vertical = verticalPadding.dp
        ),
        indication = rememberRipple(color = colorPrimary.copy(alpha = 0.16f))
    ) {
        Row(
            horizontalArrangement = Arrangement.spacedBy(iconTextSpacing.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            icon?.let { iconName ->
                Icon(
                    name = iconName,
                    size = iconSize,
                    color = iconColor
                )
            }
            
            Text(
                text = label,
                style = typography,
                color = textColor,
                maxLines = if (noWrap) 1 else Int.MAX_VALUE
            )
        }
    }
}
```

**Platform-Specific Features**:
- Material ripple effect with 16% opacity overlay
- TalkBack screen reader support via semantics
- `Modifier.heightIn(min = 44.dp)` for touch target
- Material 3 button colors and shapes

---

## Data Models


### Size Configuration

The button size configuration defines the mathematical relationships between size variants and their corresponding tokens:

```typescript
interface SizeConfig {
  /** Total button height (visual) */
  height: number;
  
  /** Touch target height (iOS/Android) */
  touchTarget: number;
  
  /** Typography token reference */
  typography: string;
  
  /** Horizontal padding token reference */
  paddingX: string;
  
  /** Vertical padding token reference */
  paddingY: string;
  
  /** Border radius token reference */
  borderRadius: string;
  
  /** Minimum width */
  minWidth: number;
  
  /** Icon size token reference */
  iconSize: string;
  
  /** Icon-text spacing token reference */
  iconSpacing: string;
}

const SIZE_CONFIG: Record<ButtonSize, SizeConfig> = {
  small: {
    height: 40,
    touchTarget: 44,
    typography: 'typography.bodyMd',
    paddingX: 'space.inset.spacious',      // 16px
    paddingY: 'space.inset.normal',        // 8px
    borderRadius: 'radius100',             // 8px
    minWidth: 56,
    iconSize: 'icon.size100',              // 24px
    iconSpacing: 'space.grouped.tight'     // 4px
  },
  medium: {
    height: 48,
    touchTarget: 48,
    typography: 'typography.bodyMd',
    paddingX: 'space.inset.expansive',     // 24px
    paddingY: 'space.inset.comfortable',   // 12px
    borderRadius: 'radius150',             // 12px
    minWidth: 72,
    iconSize: 'icon.size100',              // 24px
    iconSpacing: 'space.grouped.normal'    // 8px
  },
  large: {
    height: 56,
    touchTarget: 56,
    typography: 'typography.bodyLg',
    paddingX: 'space.inset.generous',      // 32px (NEW TOKEN)
    paddingY: 'space.inset.comfortable',   // 12px
    borderRadius: 'radius200',             // 16px
    minWidth: 80,
    iconSize: 'icon.size125',              // 32px
    iconSpacing: 'space.grouped.normal'    // 8px
  }
};
```


### Style Configuration

The button style configuration defines color and border properties for each visual style:

```typescript
interface StyleConfig {
  /** Background color token reference */
  background: string;
  
  /** Text color token reference */
  textColor: string;
  
  /** Icon color token reference */
  iconColor: string;
  
  /** Border width (0 for no border) */
  borderWidth: number;
  
  /** Border color token reference (if borderWidth > 0) */
  borderColor?: string;
}

const STYLE_CONFIG: Record<ButtonStyle, StyleConfig> = {
  primary: {
    background: 'color.primary',
    textColor: 'color.text.onPrimary',     // NEW TOKEN (white100)
    iconColor: 'color.text.onPrimary',
    borderWidth: 0
  },
  secondary: {
    background: 'color.background',
    textColor: 'color.primary',
    iconColor: 'color.primary',            // With optical blend
    borderWidth: 1,
    borderColor: 'color.primary'
  },
  tertiary: {
    background: 'transparent',
    textColor: 'color.primary',
    iconColor: 'color.primary',            // With optical blend
    borderWidth: 0
  }
};
```

### Interaction State Configuration

```typescript
interface InteractionConfig {
  /** Hover opacity overlay (web only) */
  hoverOpacity: string;
  
  /** Pressed opacity overlay (all platforms) */
  pressedOpacity: string;
  
  /** Focus outline width token reference */
  focusWidth: string;
  
  /** Focus outline color token reference */
  focusColor: string;
  
  /** Focus outline offset token reference */
  focusOffset: string;
  
  /** Focus shadow token reference */
  focusShadow: string;
}

const INTERACTION_CONFIG: InteractionConfig = {
  hoverOpacity: 'opacity.hover',              // 8% overlay
  pressedOpacity: 'opacity.pressed',          // 16% overlay
  focusWidth: 'accessibility.focus.width',    // 2px (Spec 007)
  focusColor: 'accessibility.focus.color',    // primary color (Spec 007)
  focusOffset: 'accessibility.focus.offset',  // 2px (Spec 007)
  focusShadow: 'shadow.hover'                 // Elevation shadow
};
```

---

## Error Handling


### Validation Strategy

The Button Component uses TypeScript's type system for compile-time validation and runtime checks for critical properties:

**Compile-Time Validation**:
- `ButtonSize` and `ButtonStyle` are string literal types (not arbitrary strings)
- `IconName` type from Icon System ensures only valid icons can be used
- Required props (`label`, `onPress`) enforced by TypeScript
- Optional props have sensible defaults

**Runtime Validation**:
```typescript
// Validate required props
if (!label || label.trim().length === 0) {
  console.warn('ButtonCTA: label prop is required and cannot be empty');
  return null;
}

if (!onPress || typeof onPress !== 'function') {
  console.warn('ButtonCTA: onPress prop is required and must be a function');
  return null;
}

// Validate icon exists (if provided)
if (icon && !isValidIconName(icon)) {
  console.warn(`ButtonCTA: Invalid icon name "${icon}". Icon will not render.`);
  // Continue rendering without icon
}
```

### Error Recovery

**Missing Token Values**:
- If token value is undefined, fall back to hard-coded value with console warning
- Example: `const paddingX = tokens['space.inset.spacious'] ?? 16;`
- Log warning: `"ButtonCTA: Token 'space.inset.spacious' not found, using fallback value"`

**Invalid Icon**:
- If icon name is invalid, render button without icon (graceful degradation)
- Log warning but don't crash component
- Ensure button remains functional for user interaction

**Missing onPress Handler**:
- If onPress is undefined, render button in disabled state
- Log error: `"ButtonCTA: onPress handler is required"`
- Prevent user interaction to avoid undefined behavior

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


### Unit Testing

**Component Rendering Tests**:
```typescript
describe('ButtonCTA', () => {
  it('renders with required props', () => {
    const onPress = jest.fn();
    render(<ButtonCTA label="Click me" onPress={onPress} />);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });
  
  it('applies correct size classes', () => {
    const onPress = jest.fn();
    const { rerender } = render(
      <ButtonCTA label="Button" size="small" onPress={onPress} />
    );
    expect(screen.getByRole('button')).toHaveClass('button-cta--small');
    
    rerender(<ButtonCTA label="Button" size="large" onPress={onPress} />);
    expect(screen.getByRole('button')).toHaveClass('button-cta--large');
  });
  
  it('renders icon when provided', () => {
    const onPress = jest.fn();
    render(<ButtonCTA label="Button" icon="arrow-right" onPress={onPress} />);
    expect(screen.getByTestId('icon-arrow-right')).toBeInTheDocument();
  });
});
```

**Interaction Tests**:
```typescript
describe('ButtonCTA interactions', () => {
  it('calls onPress when clicked', () => {
    const onPress = jest.fn();
    render(<ButtonCTA label="Click me" onPress={onPress} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
  
  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    render(<ButtonCTA label="Button" disabled onPress={onPress} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });
  
  it('activates on Enter key', () => {
    const onPress = jest.fn();
    render(<ButtonCTA label="Button" onPress={onPress} />);
    const button = screen.getByRole('button');
    button.focus();
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
```

### Accessibility Testing

**WCAG Compliance Tests**:
```typescript
describe('ButtonCTA accessibility', () => {
  it('has correct ARIA role', () => {
    const onPress = jest.fn();
    render(<ButtonCTA label="Button" onPress={onPress} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
  
  it('meets minimum touch target size', () => {
    const onPress = jest.fn();
    render(<ButtonCTA label="Button" size="small" onPress={onPress} />);
    const button = screen.getByRole('button');
    const { height } = button.getBoundingClientRect();
    expect(height).toBeGreaterThanOrEqual(44);
  });
  
  it('has sufficient color contrast', async () => {
    const onPress = jest.fn();
    render(<ButtonCTA label="Button" style="primary" onPress={onPress} />);
    const button = screen.getByRole('button');
    const contrastRatio = await getContrastRatio(button);
    expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
  });
  
  it('shows focus indicator on keyboard navigation', () => {
    const onPress = jest.fn();
    render(<ButtonCTA label="Button" onPress={onPress} />);
    const button = screen.getByRole('button');
    button.focus();
    expect(button).toHaveClass('button-cta--focused');
  });
});
```


### Visual Regression Testing

**Snapshot Tests**:
```typescript
describe('ButtonCTA visual regression', () => {
  it('matches snapshot for all size variants', () => {
    const onPress = jest.fn();
    const { container } = render(
      <>
        <ButtonCTA label="Small" size="small" onPress={onPress} />
        <ButtonCTA label="Medium" size="medium" onPress={onPress} />
        <ButtonCTA label="Large" size="large" onPress={onPress} />
      </>
    );
    expect(container).toMatchSnapshot();
  });
  
  it('matches snapshot for all style variants', () => {
    const onPress = jest.fn();
    const { container } = render(
      <>
        <ButtonCTA label="Primary" style="primary" onPress={onPress} />
        <ButtonCTA label="Secondary" style="secondary" onPress={onPress} />
        <ButtonCTA label="Tertiary" style="tertiary" onPress={onPress} />
      </>
    );
    expect(container).toMatchSnapshot();
  });
  
  it('matches snapshot with icon', () => {
    const onPress = jest.fn();
    const { container } = render(
      <ButtonCTA label="With Icon" icon="arrow-right" onPress={onPress} />
    );
    expect(container).toMatchSnapshot();
  });
});
```

### Cross-Platform Integration Testing

**Token Integration Tests**:
```typescript
describe('ButtonCTA token integration', () => {
  it('uses correct typography tokens', () => {
    const onPress = jest.fn();
    render(<ButtonCTA label="Button" size="small" onPress={onPress} />);
    const button = screen.getByRole('button');
    expect(getComputedStyle(button).font).toContain('var(--typography-body-md)');
  });
  
  it('uses correct spacing tokens', () => {
    const onPress = jest.fn();
    render(<ButtonCTA label="Button" size="medium" onPress={onPress} />);
    const button = screen.getByRole('button');
    expect(getComputedStyle(button).paddingLeft).toBe('var(--space-inset-expansive)');
  });
  
  it('uses correct color tokens', () => {
    const onPress = jest.fn();
    render(<ButtonCTA label="Button" style="primary" onPress={onPress} />);
    const button = screen.getByRole('button');
    expect(getComputedStyle(button).backgroundColor).toBe('var(--color-primary)');
  });
});
```

---

## Component Examples Pattern

### Pattern Overview

The ButtonCTA component uses a "canary pattern" for component examples where:
- **README serves as source of truth** for component usage and API documentation
- **HTML validation files** provide automated validation that examples remain functional
- **Examples are embedded in README** using standard markdown code blocks

This pattern emerged from Task 7 prototype work evaluating separate example files vs README-embedded examples.

### Pattern Decision

**Decision**: Use README as single source of truth with HTML validation files as canaries.

**Rationale**:
- README is the natural first stop for developers learning a component
- Embedding examples in README keeps documentation and examples synchronized
- HTML validation files catch breaking changes without duplicating documentation
- Simpler mental model: one place for docs, validation files for CI/CD

### README Structure

The component README follows this structure:

```markdown
# ButtonCTA Component

## Overview
[Component description and key features]

## Usage

### Basic Usage
[Code example with explanation]

### Size Variants
[Code examples for small, medium, large]

### Visual Styles
[Code examples for primary, secondary, tertiary]

### With Icons
[Code example with leading icon]

### States
[Code examples for hover, pressed, focus, disabled]

## API Reference
[Props table with types and descriptions]

## Accessibility
[WCAG compliance notes and keyboard navigation]

## Platform-Specific Notes
[Web, iOS, Android implementation differences]
```

### HTML Validation Files

HTML validation files serve as automated tests that examples remain functional:

**Location**: `src/components/core/ButtonCTA/examples/*.html`

**Purpose**:
- Validate that component examples work in actual browser environment
- Catch breaking changes in component API or token generation
- Provide runnable examples for manual testing during development

**Important**: These files are validation mechanisms, not documentation. They include a warning comment to prevent misuse:

```html
<head>
  <!--
    VALIDATION FILE - NOT DOCUMENTATION
    
    This HTML file validates that ButtonCTA examples work correctly.
    It is NOT the source of truth for component documentation.
    
    For component usage and examples, see: ../README.md
    
    Purpose: Automated validation that examples remain functional
    Usage: Run validation script or open in browser for manual testing
  -->
  <title>ButtonCTA Validation - [Example Name]</title>
  ...
</head>
```

### Validation Files Structure

**BasicUsage.html**:
- Single button with minimal props
- Validates core functionality works

**WithIcon.html**:
- Button with leading icon
- Validates Icon System integration

**Variants.html**:
- All size and style combinations
- Validates token generation for all variants
- Validates interaction states (hover, pressed, focus)

### Pattern Benefits

**For Developers**:
- Single source of truth (README) for learning component usage
- Copy-paste examples directly from documentation
- No confusion about which file contains "the real examples"

**For AI Agents**:
- Clear documentation structure in README
- Validation files provide functional verification
- No ambiguity about documentation vs validation

**For Maintenance**:
- Update examples in one place (README)
- Validation files catch breaking changes automatically
- Simpler to keep documentation synchronized with implementation

### Pattern Trade-offs

**Advantages**:
- ✅ Single source of truth reduces documentation drift
- ✅ README is natural first stop for developers
- ✅ Validation files provide automated testing without documentation duplication
- ✅ Simpler mental model (docs in README, validation in HTML)

**Disadvantages**:
- ❌ HTML validation files require maintenance when component API changes
- ❌ Cannot run examples directly from README (must copy-paste or use validation files)
- ❌ Validation files may become stale if not run regularly

**Mitigation**:
- Include validation script in CI/CD pipeline to catch stale validation files
- Document validation file purpose clearly to prevent misuse as documentation
- Keep validation files minimal (only essential examples)

### Future Considerations

**If Pattern Proves Insufficient**:
- Consider interactive documentation tools (Storybook, Docusaurus)
- Evaluate separate example files if README becomes too long
- Assess whether validation files provide sufficient value vs maintenance cost

**Success Metrics**:
- Developers find examples easily in README
- Validation files catch breaking changes before production
- Documentation remains synchronized with implementation

---

## Design Decisions


### Decision 1: No Component-Level Tokens

**Options Considered**:
1. **Create component-level tokens** (e.g., `button.padding.small`, `button.height.medium`)
2. **Use existing semantic/primitive tokens directly** (chosen approach)
3. **Hybrid approach** (component tokens for some properties, semantic tokens for others)

**Decision**: Use existing semantic/primitive tokens directly without creating component-level tokens.

**Rationale**:

The Button Component can be fully implemented using existing tokens from the mathematical token system:
- **Typography**: `typography.bodyMd`, `typography.bodyLg` (already exist)
- **Spacing**: `space.inset.*`, `space.grouped.*` (already exist, except `space.inset.generous`)
- **Colors**: `color.primary`, `color.background` (already exist, except `color.text.onPrimary`)
- **Border Radius**: `radius100`, `radius150`, `radius200` (already exist)
- **Icons**: `icon.size100`, `icon.size125` (from Spec 006)
- **Accessibility**: `accessibility.focus.*` (from Spec 007)

Creating component-level tokens would add unnecessary abstraction without providing additional value. The existing token system already provides the mathematical relationships and semantic meaning needed for button styling.

**Trade-offs**:
- ✅ **Gained**: Simpler token system, fewer tokens to maintain, direct semantic meaning
- ✅ **Gained**: Button sizing can be understood by reading token names directly
- ✅ **Gained**: Changes to spacing/typography tokens automatically affect buttons
- ❌ **Lost**: Cannot change button-specific styling without affecting other components
- ❌ **Lost**: No single source of truth for "button padding" (must reference size config)
- ⚠️ **Risk**: If button styling diverges significantly from semantic tokens, refactoring may be needed

**Counter-Arguments**:

**Argument**: "Component-level tokens provide better encapsulation and make it easier to change button styling independently."

**Response**: While encapsulation is valuable, the Button Component's styling is intentionally aligned with the semantic token system. Button padding uses the same `space.inset.*` tokens as other components (cards, containers, inputs), ensuring visual consistency across the design system. Creating button-specific tokens would break this consistency and create maintenance overhead.

**Argument**: "Other design systems (Material, Ant Design) use component-level tokens extensively."

**Response**: Those systems often have component-level tokens because they lack a comprehensive semantic token foundation. DesignerPunk's mathematical token system provides semantic tokens that already express the design intent (e.g., `space.inset.comfortable` is more meaningful than `button.padding.medium`). Component-level tokens would be redundant abstractions.

**Argument**: "What if we need to change button padding without affecting other components?"

**Response**: This scenario suggests the semantic token isn't truly semantic. If `space.inset.comfortable` (12px) is appropriate for buttons but not for other components, those other components should use different semantic tokens. The solution is better semantic token selection, not component-level tokens. However, if this pattern emerges across 3+ components, we should consider elevating to a new semantic token following the component-sizing-token-guide.md elevation criteria.


### Decision 2: Icon Optical Weight Compensation via Blend Token

**Options Considered**:
1. **Create color-specific icon tokens** (e.g., `color.icon.primary.light`, `color.icon.secondary.light`)
2. **Use blend token with lighter direction** (chosen approach)
3. **No optical compensation** (accept heavier icon appearance)
4. **Manual opacity adjustment** (e.g., `opacity: 0.8` on icon)

**Decision**: Use `color.icon.opticalBalance` blend token with `BlendDirection.LIGHTER` for optical weight compensation.

**Rationale**:

Icons appear visually heavier than text at the same color due to stroke density and fill area. When pairing icons with text (as in buttons), the icon needs to be lightened slightly to achieve optical balance. The blend token approach provides several advantages:

1. **Color-agnostic**: Works with any base color (primary, secondary, error, etc.) without creating color-specific tokens
2. **Consistent compensation**: Same blend amount (blend200 = 20% lighter) across all icon-text pairings
3. **Compositional architecture**: Follows the established pattern of separating concerns (color selection vs color modification)
4. **Scalable**: Adding new button styles or colors doesn't require new icon color tokens

The blend token is applied only to secondary and tertiary buttons where icons use `color.primary` on light backgrounds. Primary buttons use `color.text.onPrimary` (white) for both icon and text, where optical compensation isn't needed due to high contrast.

**Trade-offs**:
- ✅ **Gained**: Single token handles all icon-text optical compensation scenarios
- ✅ **Gained**: No explosion of color-specific icon tokens
- ✅ **Gained**: Consistent optical balance across all button styles
- ✅ **Gained**: Follows compositional architecture (color + blend vs pre-blended colors)
- ❌ **Lost**: Slightly more complex implementation (apply blend in addition to base color)
- ❌ **Lost**: Cannot fine-tune compensation per color (same blend for all colors)
- ⚠️ **Risk**: If different colors need different compensation amounts, may need color-specific tokens

**Counter-Arguments**:

**Argument**: "Creating color-specific icon tokens (e.g., `color.icon.primary.light`) would be simpler to implement."

**Response**: While simpler for a single color, this approach doesn't scale. Every new color (error, warning, success, info) would require corresponding icon tokens, leading to token explosion. The blend token approach handles all colors with a single token, reducing maintenance burden and ensuring consistency.

**Argument**: "Manual opacity adjustment (e.g., `opacity: 0.8`) would be easier than blend tokens."

**Response**: Opacity affects the entire icon including transparency, which can create muddy colors on colored backgrounds. Blend tokens modify the color value itself (making it lighter/darker) while preserving opacity, resulting in cleaner visual appearance. Additionally, opacity values would be hard-coded magic numbers, while blend tokens are part of the semantic token system.

**Argument**: "Why not skip optical compensation entirely? Users might not notice the difference."

**Response**: While subtle, optical weight compensation is a design refinement that improves visual quality. Icons without compensation appear heavier and draw more attention than the text, disrupting visual hierarchy. This is particularly noticeable in secondary and tertiary buttons where the icon and text should have equal visual weight. The blend token approach makes this refinement systematic and consistent rather than ad-hoc.

**Argument**: "What if 20% lighter isn't the right amount for all colors?"

**Response**: The blend200 (20% lighter) value is based on design testing and provides good optical balance for most colors. If specific colors require different compensation, we can create additional blend tokens (e.g., `blend150` for 15% lighter) and use them selectively. However, starting with a single blend amount ensures consistency and avoids premature optimization. We can refine based on real-world usage patterns.


### Decision 3: Text Wrapping by Default

**Options Considered**:
1. **Text wrapping by default with opt-out** (chosen approach)
2. **No text wrapping by default with opt-in**
3. **Truncate with ellipsis by default**
4. **Platform-specific defaults** (wrap on mobile, truncate on web)

**Decision**: Allow text wrapping by default with `noWrap` prop for opt-out.

**Rationale**:

Text wrapping ensures that all button text remains visible and accessible, which is critical for:
- **Internationalization**: Translated text can be significantly longer than English
- **Accessibility**: Screen readers can announce complete button labels
- **User experience**: Users can read full button text without truncation
- **Responsive design**: Buttons adapt to different viewport widths

The `noWrap` prop provides an escape hatch for specific use cases where single-line buttons are required (e.g., navigation bars, toolbars), but the default behavior prioritizes accessibility and content visibility.

**Trade-offs**:
- ✅ **Gained**: All button text visible by default (no hidden content)
- ✅ **Gained**: Better internationalization support (long translations don't break)
- ✅ **Gained**: Improved accessibility (screen readers announce full text)
- ✅ **Gained**: Responsive design (buttons adapt to content)
- ❌ **Lost**: Buttons can grow taller than expected with long text
- ❌ **Lost**: Less predictable button heights in layouts
- ⚠️ **Risk**: Designers may not anticipate multi-line buttons in mockups

**Counter-Arguments**:

**Argument**: "Truncating with ellipsis is more common in design systems and prevents layout issues."

**Response**: While truncation is common, it's an accessibility anti-pattern. Truncated text may hide critical information from users, and screen readers may not announce the full text. WCAG 2.1 Success Criterion 1.4.4 (Resize Text) requires that text can be resized up to 200% without loss of content or functionality. Text wrapping supports this requirement, while truncation violates it. The `noWrap` prop allows designers to opt into truncation for specific use cases where it's appropriate.

**Argument**: "Multi-line buttons look awkward and break visual rhythm."

**Response**: This is a valid design concern, but it's better addressed through content strategy (shorter button labels) than through technical constraints (forced truncation). If button text is too long to fit on one line, the solution is better copywriting, not hiding the text. Additionally, the button's vertical padding and line height are designed to accommodate wrapped text gracefully, maintaining visual balance even with multiple lines.

**Argument**: "Platform-specific defaults would be better (wrap on mobile, truncate on web)."

**Response**: Platform-specific defaults create inconsistent behavior and make the component API harder to understand. A button with the same props should behave the same way across platforms. Additionally, mobile devices aren't the only context where long text occurs - web applications also need to handle internationalization and responsive design. Consistent wrapping behavior across platforms simplifies implementation and testing.

**Argument**: "What about buttons in constrained spaces like navigation bars?"

**Response**: This is exactly what the `noWrap` prop is for. Designers can explicitly opt into truncation for buttons in constrained spaces where wrapping would break the layout. The key difference is that truncation is opt-in rather than default, ensuring that accessibility is the default behavior and truncation is a conscious design decision.


### Decision 4: Platform-Specific Interaction Patterns

**Options Considered**:
1. **Unified interaction pattern across all platforms** (e.g., opacity overlay everywhere)
2. **Platform-specific patterns** (chosen approach: ripple on Android, scale on iOS, hover on web)
3. **Configurable interaction patterns** (allow developers to choose)
4. **No interaction feedback** (rely on platform defaults)

**Decision**: Implement platform-specific interaction patterns that follow native conventions.

**Rationale**:

Each platform has established interaction patterns that users expect:
- **Web**: Hover states with cursor changes and opacity overlays
- **iOS**: Scale transforms (0.97) with spring animations for tactile feedback
- **Android**: Material ripple effects that emanate from touch point

Using platform-specific patterns provides several benefits:
1. **Familiar user experience**: Users encounter patterns they already know from native apps
2. **Platform integration**: Buttons feel native rather than foreign
3. **Performance optimization**: Each platform uses its optimized interaction implementation
4. **Accessibility**: Platform-specific patterns work with platform accessibility features

The True Native Architecture makes this approach natural - each platform implementation can use its native interaction APIs without runtime detection or conditional logic.

**Trade-offs**:
- ✅ **Gained**: Native feel on each platform (familiar to users)
- ✅ **Gained**: Optimal performance (platform-optimized implementations)
- ✅ **Gained**: Better accessibility integration (platform-specific features)
- ✅ **Gained**: Simpler implementation (no runtime platform detection)
- ❌ **Lost**: Interaction behavior differs across platforms
- ❌ **Lost**: Cannot demonstrate all interactions in single-platform prototypes
- ⚠️ **Risk**: Designers may not anticipate platform-specific behaviors

**Counter-Arguments**:

**Argument**: "Unified interaction patterns would provide more consistent brand experience across platforms."

**Response**: While brand consistency is important, interaction patterns are part of platform conventions that users have learned from years of using native apps. Violating these conventions creates friction and makes the app feel foreign. For example, iOS users expect buttons to scale slightly when pressed - using a ripple effect (Android convention) would feel wrong. The visual design (colors, typography, spacing) provides brand consistency, while interaction patterns provide platform familiarity.

**Argument**: "Platform-specific patterns make it harder to design and prototype across platforms."

**Response**: This is a valid concern for design tools, but it's a tooling problem, not a design system problem. Design tools should support platform-specific interaction previews, or designers should test on actual devices. The alternative - forcing all platforms to use the same interaction pattern - would compromise user experience to accommodate design tool limitations. Additionally, the True Native Architecture makes platform-specific implementations explicit in the codebase, making it clear what interactions occur on each platform.

**Argument**: "What if we want to override the interaction pattern for specific use cases?"

**Response**: The current design doesn't support overriding interaction patterns because they're considered platform conventions, not configurable properties. If a specific use case requires different interaction behavior, it likely needs a different component (e.g., a toggle button, icon button, or custom interactive element). However, if this need emerges across multiple use cases, we could add an `interactionStyle` prop with options like `'platform'` (default), `'subtle'`, or `'none'`.

**Argument**: "Ripple effects on Android can be distracting or overwhelming."

**Response**: The ripple effect uses 16% opacity (`color.primary` at 0.16 alpha), which provides visible feedback without being overwhelming. This opacity value is based on Material Design guidelines and extensive user testing. If specific use cases require more subtle feedback, we can add a `subtle` interaction style option, but the default should follow platform conventions that users expect.


### Decision 5: Icon Vertical Alignment to Button Height

**Options Considered**:
1. **Align icon to text baseline** (typographic alignment)
2. **Align icon to button center** (chosen approach)
3. **Align icon to text cap height** (optical alignment)
4. **Configurable alignment** (allow developers to choose)

**Decision**: Align icon vertically to button center (not text baseline).

**Rationale**:

Aligning icons to button center rather than text baseline provides better visual balance for several reasons:

1. **Optical centering**: Icons are geometric shapes that should be centered within the button's visual bounds, not aligned to text metrics
2. **Multi-line text support**: When text wraps to multiple lines, baseline alignment would place the icon next to the first line, creating visual imbalance
3. **Consistent spacing**: Center alignment maintains equal spacing above and below the icon regardless of text length
4. **Platform conventions**: Native button implementations (iOS Button, Android Button) center icons vertically by default

The icon-text spacing (`space.grouped.tight` or `space.grouped.normal`) provides horizontal separation, while vertical centering ensures the icon appears balanced within the button's height.

**Trade-offs**:
- ✅ **Gained**: Visually balanced icon placement within button bounds
- ✅ **Gained**: Consistent appearance with multi-line text
- ✅ **Gained**: Follows platform conventions (iOS, Android)
- ✅ **Gained**: Simpler implementation (center alignment is default in flexbox/HStack/Row)
- ❌ **Lost**: Icon not aligned to text baseline (may appear slightly off to typographers)
- ❌ **Lost**: Icon position shifts slightly when text wraps
- ⚠️ **Risk**: Designers accustomed to baseline alignment may find it unexpected

**Counter-Arguments**:

**Argument**: "Baseline alignment is more typographically correct and aligns with text metrics."

**Response**: While baseline alignment is appropriate for inline text elements (like superscripts or inline icons), buttons are block-level components where the icon is a separate visual element, not part of the text flow. Baseline alignment would create visual imbalance when text wraps or when the icon is significantly larger than the text. Center alignment treats the icon as a distinct element that should be balanced within the button's visual bounds.

**Argument**: "What about single-line buttons where baseline alignment would look better?"

**Response**: Even for single-line buttons, center alignment provides better visual balance. Text has descenders (letters like 'g', 'y', 'p') that extend below the baseline, so baseline-aligned icons would appear too high relative to the visual center of the text. Center alignment accounts for the entire text bounding box (including descenders), resulting in better optical balance.

**Argument**: "Platform-specific alignment would be better (baseline on web, center on mobile)."

**Response**: Platform-specific alignment would create inconsistent behavior and make the component harder to understand. Additionally, web buttons also benefit from center alignment, especially for responsive designs where text may wrap at different viewport widths. Consistent center alignment across platforms simplifies implementation and provides predictable behavior.

**Argument**: "What if designers want baseline alignment for specific use cases?"

**Response**: If baseline alignment is needed for specific use cases (e.g., inline icon-text combinations), those should use a different component (like an inline icon-text element) rather than a button. Buttons are interactive elements with padding and backgrounds, where center alignment is more appropriate. However, if this need emerges across multiple use cases, we could add an `iconAlignment` prop with options like `'center'` (default) or `'baseline'`.


### Decision 6: Three Size Variants (Small, Medium, Large)

**Options Considered**:
1. **Two size variants** (small, large)
2. **Three size variants** (chosen approach: small, medium, large)
3. **Four size variants** (xs, small, medium, large)
4. **Five size variants** (xs, small, medium, large, xl)

**Decision**: Provide three size variants (small, medium, large).

**Rationale**:

Three size variants provide sufficient flexibility for most UI hierarchies while maintaining simplicity:

1. **Small (40px)**: Compact buttons for secondary actions, toolbars, dense layouts
2. **Medium (48px)**: Default size for most buttons, balances visibility and space efficiency
3. **Large (56px)**: Prominent buttons for primary CTAs, hero sections, high-emphasis actions

This range covers the most common button sizing needs while avoiding the complexity of too many variants. The sizes follow the 8px baseline grid (40, 48, 56) and meet WCAG 2.1 AA touch target requirements (44px minimum).

**Mathematical Relationships**:
- Small to Medium: +8px (20% increase)
- Medium to Large: +8px (16.7% increase)
- Small to Large: +16px (40% increase)

These increments provide noticeable visual differences while maintaining proportional relationships.

**Trade-offs**:
- ✅ **Gained**: Clear visual hierarchy with three distinct sizes
- ✅ **Gained**: Covers most common button sizing needs
- ✅ **Gained**: Simple API (three options vs five or more)
- ✅ **Gained**: All sizes meet accessibility requirements
- ❌ **Lost**: No extra-small size for very compact UIs
- ❌ **Lost**: No extra-large size for hero CTAs
- ⚠️ **Risk**: Designers may request additional sizes for edge cases

**Counter-Arguments**:

**Argument**: "Two size variants (small, large) would be simpler and force better design decisions."

**Response**: While simplicity is valuable, two sizes may be too constraining for real-world UIs. The medium size (48px) serves as the default for most buttons and provides a middle ground between compact (small) and prominent (large). Removing the medium size would force designers to choose between too small or too large for many common use cases. Additionally, three variants is still simple enough to understand and use effectively.

**Argument**: "Four or five size variants would provide more flexibility for different contexts."

**Response**: More variants increase complexity without proportional benefit. Each additional size variant requires:
- More token definitions (padding, typography, border radius, icon size)
- More implementation code (size configuration, platform-specific styling)
- More testing (visual regression, accessibility, cross-platform)
- More design decisions (when to use each size)

Three variants provide sufficient flexibility while keeping the system manageable. If specific use cases require sizes outside this range, they likely need custom components rather than additional button variants.

**Argument**: "What about extra-small buttons for very dense UIs like data tables?"

**Response**: Extra-small buttons (e.g., 32px) would violate WCAG 2.1 AA touch target requirements (44px minimum) on mobile platforms. While we could extend touch targets beyond visual bounds, this creates complexity and potential overlap issues. For dense UIs, consider alternative patterns like icon buttons, dropdown menus, or context menus rather than smaller text buttons.

**Argument**: "What about extra-large buttons for hero sections or landing pages?"

**Response**: Hero CTAs often need custom styling beyond what a standard button component provides (e.g., gradients, animations, unique proportions). Rather than adding an XL size to the standard button, these use cases should use custom components or composed elements. The large size (56px) is already quite prominent and suitable for most high-emphasis CTAs.


### Decision 7: Three Visual Styles (Primary, Secondary, Tertiary)

**Options Considered**:
1. **Two visual styles** (primary, secondary)
2. **Three visual styles** (chosen approach: primary, secondary, tertiary)
3. **Four visual styles** (primary, secondary, tertiary, ghost)
4. **Semantic styles** (success, error, warning, info)

**Decision**: Provide three visual styles (primary, secondary, tertiary).

**Rationale**:

Three visual styles establish clear visual hierarchy for button importance:

1. **Primary**: Filled background with primary color - highest emphasis for main actions
2. **Secondary**: Outlined with primary color border - medium emphasis for alternative actions
3. **Tertiary**: Text-only with primary color - lowest emphasis for subtle actions

This hierarchy follows established design system patterns (Material Design, Carbon, Ant Design) and provides sufficient flexibility for most UI contexts. The styles use the same color palette (`color.primary`) with different visual treatments, maintaining brand consistency while establishing hierarchy through visual weight.

**Visual Weight Progression**:
- Primary: Solid fill (highest visual weight)
- Secondary: Outline (medium visual weight)
- Tertiary: Text only (lowest visual weight)

**Trade-offs**:
- ✅ **Gained**: Clear visual hierarchy with three distinct emphasis levels
- ✅ **Gained**: Follows industry-standard button hierarchy patterns
- ✅ **Gained**: Consistent color palette across all styles
- ✅ **Gained**: Simple API with clear semantic meaning
- ❌ **Lost**: No semantic color variants (success, error, warning)
- ❌ **Lost**: No ghost/transparent variant (though tertiary is similar)
- ⚠️ **Risk**: Designers may request semantic color variants for specific use cases

**Counter-Arguments**:

**Argument**: "Two styles (primary, secondary) would be simpler and force better hierarchy decisions."

**Response**: While two styles can work, the tertiary style serves an important role for low-emphasis actions that shouldn't compete visually with primary or secondary buttons. Examples include "Cancel" buttons, "Learn More" links styled as buttons, or navigation actions. Without a tertiary style, designers would either overuse secondary buttons (reducing their effectiveness) or use text links (which lack button affordances like padding and touch targets).

**Argument**: "We should add semantic color variants (success, error, warning) for different action types."

**Response**: Semantic color variants are valuable but should be separate components or props rather than visual styles. The current three styles focus on hierarchy (emphasis level), not semantic meaning (action type). Adding semantic variants would conflate two different concerns. If needed, we can add a `variant` prop with options like `'default'`, `'success'`, `'error'`, `'warning'` that works with any of the three styles. This keeps hierarchy and semantics separate.

**Argument**: "What about a ghost/transparent variant for buttons on colored backgrounds?"

**Response**: The tertiary style already provides a transparent background with colored text, which works well on light backgrounds. For buttons on colored backgrounds (e.g., dark hero sections), we should create a separate component or variant that inverts the color scheme (e.g., white text on transparent background). This is a different use case than the standard button hierarchy and deserves its own implementation.

**Argument**: "Material Design has more button variants (filled, outlined, text, elevated, tonal). Why only three?"

**Response**: Material Design's additional variants (elevated, tonal) serve specific Material Design patterns and visual language. DesignerPunk's mathematical token system and True Native Architecture have different design principles. The three styles (primary, secondary, tertiary) provide sufficient hierarchy while maintaining simplicity. If additional variants are needed, they should be justified by real use cases rather than matching other design systems.


### Decision 8: New Semantic Tokens Required

**Options Considered**:
1. **Use only existing tokens** (no new tokens)
2. **Create minimal new semantic tokens** (chosen approach: 3 new tokens)
3. **Create comprehensive button-specific tokens** (component-level token system)
4. **Use primitive tokens directly** (bypass semantic layer)

**Decision**: Create three new semantic tokens (`color.text.onPrimary`, `color.icon.opticalBalance`, `space.inset.generous`) to fill gaps in the existing token system.

**Rationale**:

The Button Component can be implemented using mostly existing tokens, but three semantic tokens are needed to complete the token system:

1. **`color.text.onPrimary`** (white100):
   - **Need**: Text color for content on primary-colored backgrounds
   - **Justification**: Follows compositional architecture and industry patterns (Material "on-primary", Carbon "text-on-color")
   - **Reusability**: Will be used by badges, chips, pills, and other components with primary backgrounds
   - **Elevation criteria**: Meets 3+ component threshold (buttons, badges, chips)

2. **`color.icon.opticalBalance`** (blend200 lighter):
   - **Need**: Icon optical weight compensation when paired with text
   - **Justification**: Icons appear heavier than text at same color due to stroke density
   - **Reusability**: Will be used by any component with icon-text pairing (buttons, list items, navigation)
   - **Elevation criteria**: Meets 3+ component threshold (buttons, list items, navigation items)

3. **`space.inset.generous`** (space400 = 32px):
   - **Need**: Generous internal spacing for large components
   - **Justification**: Fills gap in inset token progression (tight→normal→comfortable→spacious→expansive→generous)
   - **Reusability**: Will be used by large buttons, spacious cards, hero section insets
   - **Elevation criteria**: Meets 3+ component threshold (large buttons, cards, hero sections)

These tokens follow the compositional architecture (reference primitive tokens) and meet the elevation criteria from component-sizing-token-guide.md (3+ components using the same pattern).

**Trade-offs**:
- ✅ **Gained**: Complete semantic token coverage for button styling
- ✅ **Gained**: Reusable tokens for other components (badges, chips, cards)
- ✅ **Gained**: Follows compositional architecture and elevation criteria
- ✅ **Gained**: Minimal token additions (3 tokens vs comprehensive button token system)
- ❌ **Lost**: Slightly more tokens to maintain in the system
- ❌ **Lost**: Cannot implement button without adding these tokens first
- ⚠️ **Risk**: If tokens aren't reused by other components, may be premature elevation

**Counter-Arguments**:

**Argument**: "We should use only existing tokens to avoid token proliferation."

**Response**: While minimizing tokens is valuable, these three tokens fill genuine gaps in the semantic token system. `color.text.onPrimary` is needed by any component with primary-colored backgrounds (not just buttons). `color.icon.opticalBalance` is needed by any component pairing icons with text. `space.inset.generous` completes the inset token progression. These aren't button-specific tokens - they're semantic tokens that happen to be needed by buttons first.

**Argument**: "We should create comprehensive button-specific tokens instead of minimal semantic tokens."

**Response**: Component-specific tokens would violate the compositional architecture and create maintenance overhead. The button component should use semantic tokens that express design intent (e.g., `space.inset.generous` is more meaningful than `button.padding.large`). Component-specific tokens would also reduce reusability - other components needing generous inset spacing would have to reference button tokens or create duplicate tokens.

**Argument**: "We should use primitive tokens directly (e.g., `white100`, `space400`) instead of creating semantic tokens."

**Response**: Using primitive tokens directly bypasses the semantic layer and reduces flexibility. If we later want to change the "on-primary" text color (e.g., to a very light gray instead of pure white), we'd have to update every component using `white100`. With `color.text.onPrimary`, we change one semantic token definition and all components update automatically. The semantic layer provides the abstraction needed for systematic design changes.

**Argument**: "What if these tokens aren't reused by other components?"

**Response**: This is a valid concern, which is why we're documenting the expected reuse cases (badges, chips, cards, list items, navigation). If these tokens aren't reused within 2-3 additional components, we should revisit whether they should be semantic tokens or component-specific tokens. However, based on common UI patterns, these tokens are highly likely to be reused. The elevation criteria (3+ components) provides a threshold for validation.


---

## Token Requirements Summary

### New Semantic Tokens to Create

The following semantic tokens must be created before implementing the Button Component:

#### 1. color.text.onPrimary

```typescript
// SemanticColorTokens.ts
export const SemanticColorTokens = {
  // ... existing tokens
  text: {
    // ... existing text tokens
    onPrimary: 'white100'  // NEW: Text color for content on primary backgrounds
  }
};
```

**Purpose**: Text color for content on primary-colored backgrounds  
**Value**: `white100` (primitive)  
**Usage**: Primary buttons, badges, chips with primary background  
**Rationale**: Follows compositional architecture and industry patterns

#### 2. color.icon.opticalBalance

```typescript
// SemanticColorTokens.ts
export const SemanticColorTokens = {
  // ... existing tokens
  icon: {
    // ... existing icon tokens
    opticalBalance: {
      blend: 'blend200',           // 20% lighter
      direction: 'BlendDirection.LIGHTER'
    }
  }
};
```

**Purpose**: Icon optical weight compensation when paired with text  
**Value**: `blend200` (primitive) with `BlendDirection.LIGHTER`  
**Usage**: Secondary/tertiary buttons, any component with icon-text pairing  
**Rationale**: Icons appear heavier than text at same color due to stroke density

#### 3. space.inset.generous

```typescript
// SemanticSpacingTokens.ts
export const SemanticSpacingTokens = {
  // ... existing tokens
  inset: {
    // ... existing inset tokens
    generous: 'space400'  // NEW: 32px - Generous internal spacing
  }
};
```

**Purpose**: Generous internal spacing for large components  
**Value**: `space400` (32px primitive)  
**Usage**: Large button horizontal padding, spacious card padding, hero section insets  
**Rationale**: Fills gap in inset token progression

### Existing Tokens Used

The Button Component uses the following existing tokens:

**Typography**:
- `typography.bodyMd` - Small and medium button text
- `typography.bodyLg` - Large button text

**Spacing**:
- `space.inset.spacious` (16px) - Small button horizontal padding
- `space.inset.expansive` (24px) - Medium button horizontal padding
- `space.inset.normal` (8px) - Small button vertical padding
- `space.inset.comfortable` (12px) - Medium and large button vertical padding
- `space.grouped.tight` (4px) - Small button icon-text spacing
- `space.grouped.normal` (8px) - Medium and large button icon-text spacing

**Colors**:
- `color.primary` - Primary button background, secondary/tertiary text and border
- `color.background` - Secondary button background

**Border Radius**:
- `radius100` (8px) - Small button border radius
- `radius150` (12px) - Medium button border radius
- `radius200` (16px) - Large button border radius

**Interaction**:
- `opacity.hover` (8%) - Hover state overlay
- `opacity.pressed` (16%) - Pressed state overlay

**Accessibility** (from Spec 007):
- `accessibility.focus.width` (2px) - Focus outline width
- `accessibility.focus.color` (primary) - Focus outline color
- `accessibility.focus.offset` (2px) - Focus outline offset

**Icons** (from Spec 006):
- `icon.size100` (24px) - Small and medium button icon size
- `icon.size125` (32px) - Large button icon size

**Shadows**:
- `shadow.hover` - Focus state elevation shadow

---

## Implementation Dependencies

### Spec Dependencies

1. **Spec 004: Icon System** ✅ Complete
   - Provides Icon component for optional leading icons
   - Defines IconName type for type-safe icon references
   - Implements color inheritance mechanism

2. **Spec 006: Icon Size Tokens** ✅ Complete
   - Provides `icon.size100` (24px) and `icon.size125` (32px)
   - Icon sizes calculated from typography line heights

3. **Spec 007: Accessibility Token Family** ✅ Complete
   - Provides `accessibility.focus.*` tokens for focus indicators
   - WCAG 2.1 AA compliance validated

### Token Creation Order

Before implementing the Button Component, create semantic tokens in this order:

1. **Create `color.text.onPrimary`** (SemanticColorTokens.ts)
2. **Create `color.icon.opticalBalance`** (SemanticColorTokens.ts)
3. **Create `space.inset.generous`** (SemanticSpacingTokens.ts)
4. **Register tokens** with SemanticTokenRegistry
5. **Generate platform-specific tokens** (web CSS, iOS Swift, Android Kotlin)
6. **Validate token generation** (verify all platforms have new tokens)

### Implementation Order

After tokens are created, implement the Button Component in this order:

1. **Create shared types** (types.ts)
2. **Implement web version** (ButtonCTA.web.tsx)
3. **Implement iOS version** (ButtonCTA.ios.swift)
4. **Implement Android version** (ButtonCTA.android.kt)
5. **Create tests** (__tests__/)
6. **Create examples** (examples/)
7. **Write documentation** (README.md)

---

## Documentation Strategy

### Examples Directory (Experimental - Task 7.1)

**Status**: Prototype phase - evaluating pattern viability

**Context**: During Task 7.1 execution, work began prematurely before the task was properly defined or the design was planned. This section establishes the experimental framework for evaluating whether separate example files provide value over README-only documentation.

**Hypothesis**: Separate example files in an `examples/` directory will improve:
- **AI Agent Comprehension**: AI agents can more easily discover and understand component usage patterns
- **Developer Usability**: Developers can find copy-paste examples more efficiently
- **Documentation Maintainability**: Examples remain synchronized with component implementation

**Prototype Scope**:
- `examples/basic-usage.md` - Simple button instantiation with minimal props
- `examples/variant-showcase.md` - All size/variant combinations and state demonstrations

**Evaluation Criteria**:

After Task 7.1 completion, evaluate against these specific questions:

1. **AI Agent Comprehension**: Can AI agents locate and use examples effectively?
2. **Developer Usability**: Are examples easier to find than README documentation?
3. **Maintenance Burden**: Do examples stay synchronized with component changes?

**Decision Framework**:

The completion document for Task 7.1 MUST include one of these recommendations:

**If Adopting Pattern**:
- What worked well (specific benefits observed)
- Recommended adjustments (improvements to pattern)
- How to apply to remaining tasks (implementation guidance)

**If Rejecting Pattern**:
- What didn't work (specific problems encountered)
- Why README-only is better (comparative analysis)
- Alternative approach recommended (if any)

**Success Criteria**: The prototype is successful if it provides clear, evidence-based reasoning for adopting or rejecting the pattern. Success is NOT measured by whether we adopt the pattern, but by whether we have sufficient evidence to make an informed decision.

**Alternative**: If prototype shows limited value, consolidate examples into README and remove `examples/` directory.

**Reference**: See `.kiro/specs/005-cta-button-component/task-7-1-prototype-plan.md` for complete prototype plan.

---

*This design document provides comprehensive architectural guidance, design decisions with systematic skepticism, and clear implementation dependencies for the CTA Button Component.*
