---
inclusion: manual
---

# Blend Tokens Guide

**Date**: December 29, 2025
**Last Reviewed**: 2025-12-30
**Purpose**: Complete reference for blend tokens with utility functions and theme-aware patterns
**Organization**: token-documentation
**Scope**: cross-project
**Layer**: 3
**Relevant Tasks**: component-development, token-selection

---

## Overview

The DesignerPunk blend token system provides a mathematically consistent foundation for color modifications across all platforms. Blend tokens enable components to create new opaque colors through mathematical operations (darken, lighten, saturate, desaturate) rather than using opacity-based workarounds.

**Key Principles**:
- **Mathematical Foundation**: All values derive from base unit (blend100 = 0.04 / 4%) with clear multipliers
- **Opaque Color Results**: Blend operations produce new opaque colors, not transparent overlays
- **Cross-Platform Consistency**: Same blend calculations produce identical results (±1 RGB) across Web, iOS, and Android
- **Theme-Aware**: Blend utilities work correctly with both light and dark themes
- **Semantic Meaning**: Semantic blend tokens express design intent (hover, pressed, disabled, focus)

---

## Primitive Blend Tokens

### Base Unit System

All blend tokens derive from a base unit of **0.04 (4%)** (blend100):

| Token Name | Value | Mathematical Relationship | Use Case |
|------------|-------|---------------------------|----------|
| `blend100` | 0.04 (4%) | 1 × base | Subtle modification - gentle feedback, container hover |
| `blend200` | 0.08 (8%) | 2 × base | Standard modification - noticeable feedback, button hover |
| `blend300` | 0.12 (12%) | 3 × base | Strong modification - clear feedback, pressed state |
| `blend400` | 0.16 (16%) | 4 × base | Very strong modification - emphasized feedback |
| `blend500` | 0.20 (20%) | 5 × base | Maximum modification - dramatic feedback |

### Blend Directions

Blend tokens can be applied in four directions:

| Direction | Operation | Use Case |
|-----------|-----------|----------|
| `darker` | Overlay black at specified opacity | Hover/pressed states on light backgrounds |
| `lighter` | Overlay white at specified opacity | Hover/pressed states on dark backgrounds, icon optical balance |
| `saturate` | Increase color saturation in HSL space | Focus states, emphasis |
| `desaturate` | Decrease color saturation in HSL space | Disabled states |

---

## Semantic Blend Tokens

Semantic blend tokens provide contextual meaning for common color modification use cases. They reference primitive blend tokens with explicit blend direction.

| Token Name | Primitive | Direction | Value | Use Case |
|------------|-----------|-----------|-------|----------|
| `blend.hoverDarker` | blend200 | darker | 8% | Standard hover feedback on light backgrounds |
| `blend.hoverLighter` | blend200 | lighter | 8% | Hover feedback on dark backgrounds |
| `blend.pressedDarker` | blend300 | darker | 12% | Pressed state feedback |
| `blend.focusSaturate` | blend200 | saturate | 8% | Focus state with increased saturation |
| `blend.disabledDesaturate` | blend300 | desaturate | 12% | Disabled state with decreased saturation |
| `blend.containerHoverDarker` | blend100 | darker | 4% | Subtle container/surface hover |
| `color.icon.opticalBalance` | blend200 | lighter | 8% | Icon optical weight compensation |

---

## Blend Utility Functions

### Overview

Blend utilities are runtime functions that apply blend operations to colors. They are generated for each platform (Web, iOS, Android) and produce cross-platform consistent results.

### Web Platform (TypeScript)

**Import**:
```typescript
import { 
  getBlendUtilities, 
  createBlendUtilities,
  BlendTokenValues 
} from '@designerpunk/tokens/ThemeAwareBlendUtilities';
```

**Available Functions**:

| Function | Description | Parameters |
|----------|-------------|------------|
| `darkerBlend(color, amount)` | Darkens a color | color: hex string, amount: 0.0-1.0 |
| `lighterBlend(color, amount)` | Lightens a color | color: hex string, amount: 0.0-1.0 |
| `saturate(color, amount)` | Increases saturation | color: hex string, amount: 0.0-1.0 |
| `desaturate(color, amount)` | Decreases saturation | color: hex string, amount: 0.0-1.0 |

**Semantic Convenience Functions**:

| Function | Blend Operation | Token Value |
|----------|-----------------|-------------|
| `hoverColor(baseColor)` | darkerBlend | 8% (blend200) |
| `pressedColor(baseColor)` | darkerBlend | 12% (blend300) |
| `focusColor(baseColor)` | saturate | 8% (blend200) |
| `disabledColor(baseColor)` | desaturate | 12% (blend300) |
| `iconColor(baseColor)` | lighterBlend | 8% (blend200) |

**Usage Example**:
```typescript
// In a Web Component
class ButtonCTA extends HTMLElement {
  connectedCallback() {
    // Read theme color from CSS custom properties
    const computedStyle = getComputedStyle(document.documentElement);
    const primaryColor = computedStyle.getPropertyValue('--color-primary').trim();
    
    // Get blend utilities
    const blendUtils = getBlendUtilities();
    
    // Calculate state colors
    this._hoverColor = blendUtils.hoverColor(primaryColor);
    this._pressedColor = blendUtils.pressedColor(primaryColor);
    this._disabledColor = blendUtils.disabledColor(primaryColor);
  }
}
```

### iOS Platform (Swift)

**Import**:
```swift
import DesignerPunkTokens
```

**Color Extension Methods**:

```swift
extension Color {
    /// Darkens the color by the specified blend amount
    func darkerBlend(_ amount: Double) -> Color
    
    /// Lightens the color by the specified blend amount
    func lighterBlend(_ amount: Double) -> Color
    
    /// Increases saturation by the specified blend amount
    func saturate(_ amount: Double) -> Color
    
    /// Decreases saturation by the specified blend amount
    func desaturate(_ amount: Double) -> Color
}
```

**Semantic Convenience Extensions**:

```swift
extension Color {
    /// Hover state color (8% darker)
    func hoverBlend() -> Color
    
    /// Pressed state color (12% darker)
    func pressedBlend() -> Color
    
    /// Focus state color (8% more saturated)
    func focusBlend() -> Color
    
    /// Disabled state color (12% less saturated)
    func disabledBlend() -> Color
    
    /// Icon optical balance (8% lighter)
    func iconBlend() -> Color
}
```

**Usage Example**:
```swift
struct ButtonCTA: View {
    @Environment(\.colorScheme) var colorScheme
    let primaryColor: Color
    
    var body: some View {
        Button(action: {}) {
            Text(label)
        }
        .background(isPressed ? primaryColor.pressedBlend() : 
                    isHovered ? primaryColor.hoverBlend() : 
                    primaryColor)
        .foregroundColor(isDisabled ? primaryColor.disabledBlend() : primaryColor)
    }
}
```

### Android Platform (Kotlin)

**Import**:
```kotlin
import com.designerpunk.tokens.BlendUtilities
```

**Color Extension Functions**:

```kotlin
fun Color.darkerBlend(amount: Float): Color
fun Color.lighterBlend(amount: Float): Color
fun Color.saturate(amount: Float): Color
fun Color.desaturate(amount: Float): Color
```

**Semantic Convenience Extensions**:

```kotlin
fun Color.hoverBlend(): Color    // 8% darker
fun Color.pressedBlend(): Color  // 12% darker
fun Color.focusBlend(): Color    // 8% more saturated
fun Color.disabledBlend(): Color // 12% less saturated
fun Color.iconBlend(): Color     // 8% lighter
```

**Usage Example**:
```kotlin
@Composable
fun ButtonCTA(
    primaryColor: Color = MaterialTheme.colorScheme.primary
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    val isHovered by interactionSource.collectIsHoveredAsState()
    
    Button(
        onClick = {},
        colors = ButtonDefaults.buttonColors(
            containerColor = when {
                isPressed -> primaryColor.pressedBlend()
                isHovered -> primaryColor.hoverBlend()
                else -> primaryColor
            }
        ),
        interactionSource = interactionSource
    ) {
        Text(label)
    }
}
```

---

## Theme-Aware Patterns

### Web Components

Web Components read theme colors from CSS custom properties and apply blend utilities:

```typescript
class ButtonCTA extends HTMLElement {
  private _calculateBlendColors(): void {
    // Read current theme colors from CSS custom properties
    const computedStyle = getComputedStyle(document.documentElement);
    const primaryColor = computedStyle.getPropertyValue('--color-primary').trim();
    const onPrimaryColor = computedStyle.getPropertyValue('--color-on-primary').trim();
    
    // Calculate state colors using blend utilities
    const blendUtils = getBlendUtilities();
    this._hoverColor = blendUtils.hoverColor(primaryColor);
    this._pressedColor = blendUtils.pressedColor(primaryColor);
    this._disabledColor = blendUtils.disabledColor(primaryColor);
    this._iconColor = blendUtils.iconColor(onPrimaryColor);
  }
  
  // Recalculate when theme changes
  private _observeThemeChanges(): void {
    const observer = new MutationObserver(() => {
      this._calculateBlendColors();
      this._updateStyles();
    });
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class', 'data-theme'] 
    });
  }
}
```

### iOS (SwiftUI)

SwiftUI uses `@Environment(\.colorScheme)` for automatic theme updates:

```swift
struct ButtonCTA: View {
    @Environment(\.colorScheme) var colorScheme
    
    var primaryColor: Color {
        colorScheme == .dark ? Color.primaryDark : Color.primaryLight
    }
    
    var body: some View {
        Button(action: {}) {
            Text(label)
        }
        .background(primaryColor.hoverBlend())
        // SwiftUI automatically re-renders when colorScheme changes
    }
}
```

### Android (Jetpack Compose)

Compose uses `MaterialTheme` and `isSystemInDarkTheme()` for theme awareness:

```kotlin
@Composable
fun ButtonCTA() {
    val isDarkTheme = isSystemInDarkTheme()
    val primaryColor = MaterialTheme.colorScheme.primary
    
    // Blend utilities work with current theme's colors
    Button(
        colors = ButtonDefaults.buttonColors(
            containerColor = primaryColor.hoverBlend()
        )
    ) {
        Text(label)
    }
    // Compose automatically recomposes when theme changes
}
```

---

## Component Integration Patterns

### ButtonCTA Component

**Before (Workarounds)**:
```typescript
// ❌ WRONG: Using opacity for state colors
const hoverStyle = { opacity: 0.92 };
const pressedStyle = { opacity: 0.84 };
const iconStyle = { filter: 'brightness(1.08)' };
```

**After (Blend Utilities)**:
```typescript
// ✅ CORRECT: Using blend utilities with semantic tokens
const blendUtils = getBlendUtilities();
const hoverColor = blendUtils.hoverColor(primaryColor);      // darkerBlend 8%
const pressedColor = blendUtils.pressedColor(primaryColor);  // darkerBlend 12%
const disabledColor = blendUtils.disabledColor(primaryColor); // desaturate 12%
const iconColor = blendUtils.iconColor(onPrimaryColor);      // lighterBlend 8%
```

### TextInputField Component

```typescript
const blendUtils = getBlendUtilities();
const focusColor = blendUtils.focusColor(primaryColor);      // saturate 8%
const disabledColor = blendUtils.disabledColor(primaryColor); // desaturate 12%
```

### Container Component

```typescript
const blendUtils = getBlendUtilities();
// Use generic darkerBlend with containerHoverDarker token value (4%)
const hoverColor = blendUtils.darkerBlend(surfaceColor, 0.04);
```

### Icon Component

```typescript
const blendUtils = getBlendUtilities();
const opticalBalanceColor = blendUtils.iconColor(iconColor); // lighterBlend 8%
```

---

## Cross-Platform Consistency

### Precision Guarantee

All blend operations produce results within **±1 RGB** (0-255 scale) across platforms:

| Platform | Reference | Tolerance |
|----------|-----------|-----------|
| Web (TypeScript) | Reference implementation | N/A |
| iOS (Swift) | Must match Web | ±1 RGB |
| Android (Kotlin) | Must match Web | ±1 RGB |

### Invalid Input Handling

All platforms handle invalid inputs consistently:

| Invalid Input | Behavior |
|---------------|----------|
| Malformed color string | Return original color unchanged |
| Blend amount < 0 | Clamp to 0 |
| Blend amount > 1 | Clamp to 1 |
| Null/undefined input | Return original color unchanged |

---

## Usage Guidelines

### When to Use Semantic Blend Tokens

Use semantic blend tokens for standard interaction states:

| State | Token | Function |
|-------|-------|----------|
| Hover (light bg) | `blend.hoverDarker` | `hoverColor()` |
| Hover (dark bg) | `blend.hoverLighter` | `lighterBlend(color, 0.08)` |
| Pressed | `blend.pressedDarker` | `pressedColor()` |
| Focus | `blend.focusSaturate` | `focusColor()` |
| Disabled | `blend.disabledDesaturate` | `disabledColor()` |
| Container hover | `blend.containerHoverDarker` | `darkerBlend(color, 0.04)` |
| Icon optical | `color.icon.opticalBalance` | `iconColor()` |

### When to Use Primitive Blend Tokens

Use primitive blend tokens when:
- No semantic token exists for your use case
- Building custom interaction patterns
- Need specific blend percentages not covered by semantic tokens

**Example**:
```typescript
// Custom emphasis effect using primitive token
const emphasisColor = blendUtils.darkerBlend(color, 0.16); // blend400 = 16%
```

### Anti-Patterns to Avoid

**❌ Don't use opacity for state colors**:
```typescript
// WRONG: Opacity creates transparency, not new colors
const hoverStyle = { opacity: 0.92 };
```

**❌ Don't use CSS filters for color modification**:
```typescript
// WRONG: Filters are not cross-platform consistent
const iconStyle = { filter: 'brightness(1.08)' };
```

**❌ Don't use platform-specific workarounds**:
```swift
// WRONG: iOS scaleEffect as pressed state workaround
.scaleEffect(isPressed ? 0.96 : 1.0)
```

**✅ Do use blend utilities**:
```typescript
// CORRECT: Blend utilities produce consistent opaque colors
const hoverColor = blendUtils.hoverColor(primaryColor);
```

---

## Mathematical Relationships

### Base Multiplier Pattern

All blend tokens follow a clear multiplier pattern from the base unit (blend100 = 0.04):

```
blend100 = base × 1 = 0.04 × 1 = 0.04 (4%)
blend200 = base × 2 = 0.04 × 2 = 0.08 (8%)
blend300 = base × 3 = 0.04 × 3 = 0.12 (12%)
blend400 = base × 4 = 0.04 × 4 = 0.16 (16%)
blend500 = base × 5 = 0.04 × 5 = 0.20 (20%)
```

### Semantic Token Mapping

| Semantic Token | Primitive | Percentage |
|----------------|-----------|------------|
| blend.hoverDarker | blend200 | 8% |
| blend.hoverLighter | blend200 | 8% |
| blend.pressedDarker | blend300 | 12% |
| blend.focusSaturate | blend200 | 8% |
| blend.disabledDesaturate | blend300 | 12% |
| blend.containerHoverDarker | blend100 | 4% |
| color.icon.opticalBalance | blend200 | 8% |

---

## Related Documentation

- **Blend Token Source**: `src/tokens/BlendTokens.ts` - Primitive blend token definitions
- **Semantic Blend Source**: `src/tokens/semantic/BlendTokens.ts` - Semantic blend token definitions
- **Theme-Aware Utilities**: `src/blend/ThemeAwareBlendUtilities.web.ts` - Web platform utilities
- **Token System Overview**: `docs/token-system-overview.md` - Complete token system reference
- **Color Tokens Guide**: `docs/tokens/color-tokens.md` - Color token reference
- **Blend Infrastructure Spec**: `.kiro/specs/031-blend-infrastructure-implementation/design.md` - Architecture and design decisions
- **Component Development Guide**: `.kiro/steering/Component Development and Practices Guide.md` - Token usage in component development
- **Token Resolution Patterns**: `.kiro/steering/Token Resolution Patterns.md` - Strategic guidance on token type selection and validation

---

*This guide provides complete reference for blend tokens with utility functions and theme-aware patterns that enable consistent color modifications across all platforms.*
