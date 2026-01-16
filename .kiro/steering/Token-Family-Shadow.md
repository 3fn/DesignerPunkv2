---
inclusion: manual
---

# Shadow Token Usage Documentation

**Date**: 2025-10-24
**Last Reviewed**: 2025-12-30
**Purpose**: Shadow token reference and usage guide
**Organization**: token-documentation
**Scope**: shadow-glow-token-system
**Layer**: 3
**Relevant Tasks**: component-development, token-selection

---

## Overview

The Shadow Token System provides mathematically consistent primitives for creating depth effects across web, iOS, and Android platforms. Shadows convey elevation and spatial relationships using directional lighting principles inspired by the sun's arc throughout the day.

The system follows a compositional architecture where semantic shadow tokens compose multiple primitive tokens (offsetX, offsetY, blur, opacity, color) to create complete shadow styles for specific use cases.

---

## Shadow Primitive Tokens

Shadow primitives are the foundational building blocks that semantic shadows compose. Each primitive represents a single shadow property with mathematically consistent values across platforms.

### Shadow Offset Tokens

Shadow offsets determine shadow direction based on light source position (sun arc).

#### Shadow Offset X (Horizontal Direction)

Horizontal offsets represent the sun's position throughout the day:

| Token | Value | Description | Use Case |
|-------|-------|-------------|----------|
| `shadowOffsetX.n300` | -12px | Sunrise - large left offset | Dramatic sunrise lighting |
| `shadowOffsetX.n200` | -8px | Strategic flexibility - medium-large left | Morning variations |
| `shadowOffsetX.n150` | -6px | Morning - medium left offset | Morning lighting |
| `shadowOffsetX.n100` | -4px | Strategic flexibility - small left | Subtle morning shadows |
| `shadowOffsetX.000` | 0px | Noon - no horizontal offset | Standard UI shadows |
| `shadowOffsetX.100` | 4px | Strategic flexibility - small right | Subtle afternoon shadows |
| `shadowOffsetX.150` | 6px | Afternoon - medium right offset | Afternoon lighting |
| `shadowOffsetX.200` | 8px | Strategic flexibility - medium-large right | Afternoon variations |
| `shadowOffsetX.300` | 12px | Sunset - large right offset | Dramatic sunset lighting |

**Mathematical Foundation**: Base value = 4px (4px baseline grid alignment)

**Sun Arc Framework**:
- **Negative values**: Sunrise/morning shadows (shadow falls left)
- **Zero value**: Noon shadows (no horizontal offset)
- **Positive values**: Afternoon/sunset shadows (shadow falls right)

#### Shadow Offset Y (Vertical Direction)

Vertical offsets scale with depth (all positive - shadows fall downward):

| Token | Value | Description | Use Case |
|-------|-------|-------------|----------|
| `shadowOffsetY.100` | 4px | Depth 100 / Noon - short shadow | Low elevation elements |
| `shadowOffsetY.200` | 8px | Depth 200 - medium shadow | Raised elements (cards, modals) |
| `shadowOffsetY.300` | 12px | Morning/Afternoon - medium-long | Directional lighting |
| `shadowOffsetY.400` | 16px | Depth 300 / Sunrise/Sunset - long | Floating elements (FABs) |

**Mathematical Foundation**: Base value = 4px, scales with multipliers (1x, 2x, 3x, 4x)

### Shadow Blur Tokens

Shadow blur determines edge definition based on shadow quality and depth.

#### Quality-Based Blur

| Token | Value | Description | Use Case |
|-------|-------|-------------|----------|
| `shadowBlurHard` | 4px | Sharp, defined edges | Strong shadows, high contrast |
| `shadowBlurModerate` | 12px | Balanced definition | Standard UI shadows |
| `shadowBlurSoft` | 20px | Diffuse, gentle edges | Subtle shadows, hover states |

#### Depth-Based Blur

| Token | Value | Description | Use Case |
|-------|-------|-------------|----------|
| `shadowBlurDepth200` | 16px | Increased blur for raised elements | Modals, elevated cards |
| `shadowBlurDepth300` | 24px | Maximum blur for floating elements | FABs, tooltips |

**Mathematical Foundation**: Base value = 4px, scales with multipliers (1x, 3x, 4x, 5x, 6x)

### Shadow Opacity Tokens

Shadow opacity determines shadow darkness based on quality and depth.

#### Quality-Based Opacity

| Token | Value | Description | Use Case |
|-------|-------|-------------|----------|
| `shadowOpacityHard` | 0.4 | Darker for sharp shadows | Strong, defined shadows |
| `shadowOpacityModerate` | 0.3 | Balanced opacity | Standard UI shadows |
| `shadowOpacitySoft` | 0.2 | Lighter for diffuse shadows | Subtle, gentle shadows |

#### Depth-Based Opacity

| Token | Value | Description | Use Case |
|-------|-------|-------------|----------|
| `shadowOpacityDepth200` | 0.35 | Slightly darker for raised elements | Modals, elevated cards |
| `shadowOpacityDepth300` | 0.4 | Darkest for floating elements | FABs, tooltips |

**Mathematical Foundation**: Base value = 0.3, scales with multipliers (0.67x, 1x, 1.17x, 1.33x)

### Shadow Color Tokens

Shadow colors are based on art theory: shadows are rarely pure black but tinted by ambient light.

#### Primitive Shadow Colors

| Token | Value | Description | Art Theory |
|-------|-------|-------------|------------|
| `shadowBlack100` | rgb(0, 0, 0) | Pure black | Neutral lighting (noon) |
| `shadowBlue100` | rgb(20, 25, 40) | Blue-gray tint | Warm light creates cool shadows (sunrise/sunset) |
| `shadowOrange100` | rgb(25, 20, 15) | Warm tint | Cool light creates warm shadows |
| `shadowGray100` | rgb(15, 20, 30) | Blue-gray tint | Ambient/overcast lighting |

#### Semantic Shadow Colors

| Token | References | Description | Use Case |
|-------|-----------|-------------|----------|
| `color.shadow.default` | shadowBlack100 | Default shadow color | Standard UI shadows (noon) |
| `color.shadow.warm` | shadowBlue100 | Warm shadow color | Sunrise/sunset lighting |
| `color.shadow.cool` | shadowOrange100 | Cool shadow color | Cool lighting environments |
| `color.shadow.ambient` | shadowGray100 | Ambient shadow color | Overcast/ambient lighting |

**Note**: Shadow colors are mode-agnostic (always dark) regardless of light/dark theme.

---

## Shadow Semantic Tokens

Semantic shadow tokens compose primitives to create complete shadow styles for specific use cases.

### Standard UI Shadows

#### shadow.container

Standard container shadow with noon lighting and moderate quality.

**Composition**:
- offsetX: `shadowOffsetX.000` (0px)
- offsetY: `shadowOffsetY.100` (4px)
- blur: `shadowBlurModerate` (12px)
- opacity: `shadowOpacityModerate` (0.3)
- color: `color.shadow.default` (black)

**Use Cases**: Cards, panels, containers with subtle elevation

**Visual Effect**: Subtle shadow directly below element, balanced definition

#### shadow.modal

Modal shadow with noon lighting and depth 200.

**Composition**:
- offsetX: `shadowOffsetX.000` (0px)
- offsetY: `shadowOffsetY.200` (8px)
- blur: `shadowBlurDepth200` (16px)
- opacity: `shadowOpacityDepth200` (0.35)
- color: `color.shadow.default` (black)

**Use Cases**: Modals, dialogs, overlays with medium elevation

**Visual Effect**: Medium shadow with increased blur and opacity for raised elements

#### shadow.hover

Hover state shadow with noon lighting and soft quality.

**Composition**:
- offsetX: `shadowOffsetX.000` (0px)
- offsetY: `shadowOffsetY.100` (4px)
- blur: `shadowBlurSoft` (20px)
- opacity: `shadowOpacitySoft` (0.2)
- color: `color.shadow.default` (black)

**Use Cases**: Hover states, interactive elements with subtle elevation change

**Visual Effect**: Soft, diffuse shadow for gentle elevation feedback

#### shadow.fab

Floating action button shadow with sunset lighting and hard quality.

**Composition**:
- offsetX: `shadowOffsetX.300` (12px)
- offsetY: `shadowOffsetY.400` (16px)
- blur: `shadowBlurHard` (4px)
- opacity: `shadowOpacityHard` (0.4)
- color: `color.shadow.warm` (blue-gray)

**Use Cases**: Floating action buttons, prominent CTAs with dramatic elevation

**Visual Effect**: Dramatic shadow with directional offset and warm tint

### Directional Shadow Variations

Directional shadows demonstrate the sun arc framework with lighting-appropriate colors. These tokens follow the sun's arc throughout the day, providing consistent directional lighting for themed interfaces.

**Note**: `shadow.container` uses the same noon lighting pattern (no horizontal offset, default color) but is named semantically for its use case rather than its lighting. Use `shadow.noon` when you want to explicitly indicate noon lighting in a directional series.

#### shadow.sunrise

Sunrise lighting shadow with left offset and warm color.

**Composition**:
- offsetX: `shadowOffsetX.n300` (-12px)
- offsetY: `shadowOffsetY.200` (8px)
- blur: `shadowBlurModerate` (12px)
- opacity: `shadowOpacityModerate` (0.3)
- color: `color.shadow.warm` (blue-gray)

**Use Cases**: Sunrise-themed interfaces, morning dashboards

**Visual Effect**: Shadow falls to the left with warm blue-gray tint

#### shadow.morning

Morning lighting shadow with medium left offset and default color.

**Composition**:
- offsetX: `shadowOffsetX.n150` (-6px)
- offsetY: `shadowOffsetY.200` (8px)
- blur: `shadowBlurModerate` (12px)
- opacity: `shadowOpacityModerate` (0.3)
- color: `color.shadow.default` (black)

**Use Cases**: Morning-themed interfaces, subtle directional lighting

**Visual Effect**: Shadow falls to the left with neutral color

#### shadow.noon

Noon lighting shadow with no horizontal offset and default color.

**Composition**:
- offsetX: `shadowOffsetX.000` (0px)
- offsetY: `shadowOffsetY.200` (8px)
- blur: `shadowBlurModerate` (12px)
- opacity: `shadowOpacityModerate` (0.3)
- color: `color.shadow.default` (black)

**Use Cases**: Noon-themed interfaces, neutral directional lighting, completing the sun arc series

**Visual Effect**: Shadow falls directly below with neutral color (no horizontal offset)

**Relationship to shadow.container**: This token uses the same noon lighting pattern as `shadow.container` (no horizontal offset, default color). The difference is semantic naming: `shadow.noon` explicitly indicates noon lighting in a directional series, while `shadow.container` is named for its use case (standard container shadows). Both are valid choices depending on whether you want to emphasize lighting (noon) or use case (container).

#### shadow.afternoon

Afternoon lighting shadow with medium right offset and default color.

**Composition**:
- offsetX: `shadowOffsetX.150` (6px)
- offsetY: `shadowOffsetY.200` (8px)
- blur: `shadowBlurModerate` (12px)
- opacity: `shadowOpacityModerate` (0.3)
- color: `color.shadow.default` (black)

**Use Cases**: Afternoon-themed interfaces, subtle directional lighting

**Visual Effect**: Shadow falls to the right with neutral color

#### shadow.sunset

Sunset lighting shadow with right offset and warm color.

**Composition**:
- offsetX: `shadowOffsetX.300` (12px)
- offsetY: `shadowOffsetY.200` (8px)
- blur: `shadowBlurModerate` (12px)
- opacity: `shadowOpacityModerate` (0.3)
- color: `color.shadow.warm` (blue-gray)

**Use Cases**: Sunset-themed interfaces, evening dashboards

**Visual Effect**: Shadow falls to the right with warm blue-gray tint

---

## Cross-Platform Usage

### Web (CSS)

Shadow tokens translate to CSS `box-shadow` format.

#### Using Semantic Shadows

```css
/* Apply shadow.container to an element */
.card {
  box-shadow: var(--shadow-container);
}

/* Apply shadow.modal to a modal */
.modal {
  box-shadow: var(--shadow-modal);
}

/* Apply shadow.hover on hover state */
.button:hover {
  box-shadow: var(--shadow-hover);
}
```

#### Using Individual Shadow Properties

```css
/* Access individual shadow properties */
.custom-shadow {
  box-shadow: 
    var(--shadow-container-offset-x) 
    var(--shadow-container-offset-y) 
    var(--shadow-container-blur) 
    rgba(0, 0, 0, var(--shadow-container-opacity));
}
```

#### Generated CSS Custom Properties

```css
:root {
  /* shadow.container */
  --shadow-container: 0px 4px 12px rgba(0, 0, 0, 0.3);
  --shadow-container-offset-x: 0px;
  --shadow-container-offset-y: 4px;
  --shadow-container-blur: 12px;
  --shadow-container-opacity: 0.3;
  --shadow-container-color: rgb(0, 0, 0);
  
  /* shadow.modal */
  --shadow-modal: 0px 8px 16px rgba(0, 0, 0, 0.35);
  --shadow-modal-offset-x: 0px;
  --shadow-modal-offset-y: 8px;
  --shadow-modal-blur: 16px;
  --shadow-modal-opacity: 0.35;
  --shadow-modal-color: rgb(0, 0, 0);
  
  /* shadow.fab */
  --shadow-fab: 12px 16px 4px rgba(20, 25, 40, 0.4);
  --shadow-fab-offset-x: 12px;
  --shadow-fab-offset-y: 16px;
  --shadow-fab-blur: 4px;
  --shadow-fab-opacity: 0.4;
  --shadow-fab-color: rgb(20, 25, 40);
}
```

#### Web Platform Notes

- **Full Support**: Web supports all shadow properties (offsetX, offsetY, blur, opacity, color)
- **Spread Property**: Omitted for cross-platform consistency (iOS/Android don't support spread)
- **Performance**: Use CSS custom properties for efficient shadow updates
- **Browser Support**: Modern browsers support `box-shadow` with rgba colors

### iOS (Swift)

Shadow tokens translate to iOS `CALayer` shadow properties.

#### Using Semantic Shadows

```swift
// Apply shadow.container to a view
view.layer.applyShadow(ShadowTokens.container)

// Apply shadow.modal to a modal view
modalView.layer.applyShadow(ShadowTokens.modal)

// Apply shadow.fab to a floating action button
fabButton.layer.applyShadow(ShadowTokens.fab)
```

#### Using Individual Shadow Properties

```swift
// Access individual shadow properties
view.layer.shadowOffset = ShadowTokens.container.offset
view.layer.shadowRadius = ShadowTokens.container.radius
view.layer.shadowOpacity = ShadowTokens.container.opacity
view.layer.shadowColor = ShadowTokens.container.color.cgColor
```

#### Generated Swift Code

```swift
import UIKit

extension CALayer {
  /// Apply shadow token to layer
  func applyShadow(_ shadow: ShadowToken) {
    self.shadowOffset = shadow.offset
    self.shadowRadius = shadow.radius
    self.shadowOpacity = shadow.opacity
    self.shadowColor = shadow.color.cgColor
  }
}

/// Shadow token structure
struct ShadowToken {
  let offset: CGSize
  let radius: CGFloat
  let opacity: Float
  let color: UIColor
}

/// Shadow tokens
enum ShadowTokens {
  /// Container shadow with no horizontal offset, 4px vertical offset, 12px blur, moderate opacity
  static let container = ShadowToken(
    offset: CGSize(width: 0, height: 4),
    radius: 6,  // blur / 2 for iOS
    opacity: 0.3,
    color: UIColor(red: 0.000, green: 0.000, blue: 0.000, alpha: 1.0)
  )
  
  /// Modal shadow with no horizontal offset, 8px vertical offset, 16px blur, slightly darker opacity
  static let modal = ShadowToken(
    offset: CGSize(width: 0, height: 8),
    radius: 8,  // blur / 2 for iOS
    opacity: 0.35,
    color: UIColor(red: 0.000, green: 0.000, blue: 0.000, alpha: 1.0)
  )
  
  /// Dramatic shadow with 12px right offset, 16px down offset, 4px blur, darker opacity, warm (blue-gray) tint
  static let fab = ShadowToken(
    offset: CGSize(width: 12, height: 16),
    radius: 2,  // blur / 2 for iOS
    opacity: 0.4,
    color: UIColor(red: 0.078, green: 0.098, blue: 0.157, alpha: 1.0)
  )
}
```

#### iOS Platform Notes

- **shadowOffset**: CGSize(width: offsetX, height: offsetY)
- **shadowRadius**: blur / 2 (iOS shadowRadius is half the blur value to match visual appearance)
- **shadowOpacity**: Float value (0-1)
- **shadowColor**: UIColor.cgColor
- **Spread Not Supported**: iOS does not support shadow spread property
- **Performance**: Set `shadowPath` for better performance with complex shapes

### Android (Kotlin)

Shadow tokens translate to Android `elevation` values (Material Design).

#### Using Semantic Shadows

```kotlin
// Apply shadow.container to a view
view.elevation = ShadowTokens.container.elevation.value

// Apply shadow.modal to a modal
modalView.elevation = ShadowTokens.modal.elevation.value

// Apply shadow.fab to a FAB (Compose)
FloatingActionButton(
    modifier = Modifier.shadow(ShadowTokens.fab)
) {
    Icon(Icons.Default.Add, contentDescription = "Add")
}
```

#### Using Shadow Extension

```kotlin
// Compose modifier extension
Box(
    modifier = Modifier
        .shadow(ShadowTokens.container)
        .background(Color.White)
) {
    Text("Card Content")
}
```

#### Generated Kotlin Code

```kotlin
package com.designerpunk.tokens

import androidx.compose.ui.unit.dp

/**
 * Shadow token data class
 */
data class ShadowToken(
    val elevation: androidx.compose.ui.unit.Dp,
    val strategy: String,
    val limitations: List<String>
)

/**
 * Shadow tokens
 */
object ShadowTokens {
    /**
     * Container shadow with no horizontal offset, 4px vertical offset, 12px blur, moderate opacity
     * 
     * Approximation Strategy: blur-based
     * Original Properties:
     * - offsetX: 0dp
     * - offsetY: 4dp
     * - blur: 12dp
     * - opacity: 0.3
     * 
     * Limitations:
     * - Shadow spread not supported - omitted for cross-platform consistency
     */
    val container = ShadowToken(
        elevation = 12.dp,
        strategy = "blur-based",
        limitations = listOf(
            "Shadow spread not supported - omitted for cross-platform consistency"
        )
    )
    
    /**
     * Modal shadow with no horizontal offset, 8px vertical offset, 16px blur, slightly darker opacity
     * 
     * Approximation Strategy: blur-based
     * Original Properties:
     * - offsetX: 0dp
     * - offsetY: 8dp
     * - blur: 16dp
     * - opacity: 0.35
     * 
     * Limitations:
     * - Shadow spread not supported - omitted for cross-platform consistency
     */
    val modal = ShadowToken(
        elevation = 16.dp,
        strategy = "blur-based",
        limitations = listOf(
            "Shadow spread not supported - omitted for cross-platform consistency"
        )
    )
    
    /**
     * Dramatic shadow with 12px right offset, 16px down offset, 4px blur, darker opacity, warm (blue-gray) tint
     * 
     * Approximation Strategy: combined
     * Original Properties:
     * - offsetX: 12dp
     * - offsetY: 16dp
     * - blur: 4dp
     * - opacity: 0.4
     * 
     * Limitations:
     * - Directional shadow (offsetX: 12dp) not supported - Android elevation uses fixed light source from top
     * - Custom opacity (0.4) not supported - Android elevation uses system-controlled opacity
     * - Custom shadow color not supported - Android elevation uses system-controlled shadow color
     * - Shadow spread not supported - omitted for cross-platform consistency
     */
    val fab = ShadowToken(
        elevation = 10.dp,
        strategy = "combined",
        limitations = listOf(
            "Directional shadow (offsetX: 12dp) not supported - Android elevation uses fixed light source from top",
            "Custom opacity (0.4) not supported - Android elevation uses system-controlled opacity",
            "Custom shadow color not supported - Android elevation uses system-controlled shadow color",
            "Shadow spread not supported - omitted for cross-platform consistency"
        )
    )
}

/**
 * Extension function to apply shadow token to Modifier
 */
fun androidx.compose.ui.Modifier.shadow(shadow: ShadowToken): androidx.compose.ui.Modifier {
    return this.shadow(elevation = shadow.elevation)
}
```

#### Android Platform Limitations

Android uses Material Design elevation, which is an approximation of the shadow system:

**Elevation Approximation Strategies**:
1. **Blur-based** (most common): elevation ≈ blur
2. **Offset-based**: elevation ≈ offsetY (for shadows with large offsets)
3. **Combined**: elevation ≈ (blur + offsetY) / 2 (for balanced shadows)

**What's Not Supported**:
- **Directional shadows** (offsetX): Android elevation uses fixed light source from top
- **Custom opacity**: Android elevation uses system-controlled opacity
- **Custom shadow color**: Android elevation uses system-controlled shadow color
- **Shadow spread**: Not supported (omitted for cross-platform consistency)

**When to Use Custom Drawables**:

For precise shadow control beyond elevation approximation, custom drawable generation would be required. This is a future enhancement for cases where:
- Directional shadows are critical to the design
- Custom shadow colors are required
- Precise opacity control is needed

---

## Design Guidelines

### When to Use Each Shadow

#### shadow.container
- **Use for**: Cards, panels, containers with subtle elevation
- **Elevation level**: Low (depth 100)
- **Visual weight**: Subtle, balanced
- **Lighting**: Noon (no directional offset)

#### shadow.modal
- **Use for**: Modals, dialogs, overlays with medium elevation
- **Elevation level**: Medium (depth 200)
- **Visual weight**: Moderate, noticeable
- **Lighting**: Noon (no directional offset)

#### shadow.hover
- **Use for**: Hover states, interactive elements with subtle elevation change
- **Elevation level**: Low (depth 100)
- **Visual weight**: Very subtle, soft
- **Lighting**: Noon (no directional offset)

#### shadow.fab
- **Use for**: Floating action buttons, prominent CTAs with dramatic elevation
- **Elevation level**: High (depth 300)
- **Visual weight**: Strong, dramatic
- **Lighting**: Sunset (directional offset with warm tint)

#### Directional Shadows (sunrise, morning, noon, afternoon, sunset)
- **Use for**: Themed interfaces, time-of-day experiences, completing the sun arc series
- **Elevation level**: Medium (depth 200)
- **Visual weight**: Moderate with directional character
- **Lighting**: Varies by time of day (sunrise → morning → noon → afternoon → sunset)

**Note**: For standard UI shadows without directional theming, use `shadow.container` instead of `shadow.noon`. Both use noon lighting, but `shadow.container` is semantically named for its use case.

### Composing Custom Shadows

When semantic shadows don't meet your needs, compose custom shadows from primitives:

```typescript
// Example: Custom shadow for a specific use case
const customShadow = {
  offsetX: 'shadowOffsetX.150',      // Afternoon offset
  offsetY: 'shadowOffsetY.200',      // Medium depth
  blur: 'shadowBlurSoft',            // Soft edges
  opacity: 'shadowOpacityModerate',  // Balanced opacity
  color: 'color.shadow.default'      // Neutral color
};
```

**Guidelines for Custom Shadows**:
1. **Start with semantic shadows**: Use existing semantic shadows when possible
2. **Compose from primitives**: Build custom shadows from primitive tokens
3. **Follow sun arc framework**: Use appropriate offsetX for lighting direction
4. **Match quality and depth**: Combine quality-based and depth-based tokens consistently
5. **Consider cross-platform**: Remember Android limitations when using directional shadows

### Accessibility Considerations

**Contrast and Visibility**:
- Ensure shadows provide sufficient contrast for depth perception
- Test shadows in both light and dark modes
- Consider users with low vision or color blindness

**Motion and Animation**:
- Animate shadow changes smoothly for hover/focus states
- Use appropriate easing functions for natural shadow transitions
- Avoid rapid shadow changes that could trigger motion sensitivity

**Semantic Meaning**:
- Use shadows consistently to convey elevation hierarchy
- Don't rely solely on shadows to convey critical information
- Provide alternative cues (borders, spacing) for users who may not perceive shadows

---

## Mathematical Foundation

### Base-8 System

All shadow tokens follow the base-8 mathematical foundation:

- **Offset base**: 4px (4px baseline grid alignment)
- **Blur base**: 4px (4px baseline grid alignment)
- **Opacity base**: 0.3 (unitless)

### Baseline Grid Alignment

Shadow values preferably align to the 4px baseline grid:

- **Aligned values**: 0, 4, 8, 12, 16, 20, 24 (multiples of 4)
- **Strategic flexibility**: 6 (1.5x multiplier) for natural shadow progression
- **Opacity**: Unitless values don't require grid alignment

### Mathematical Relationships

**Offset Tokens**:
- shadowOffsetX.n300 = base × -3 = 4 × -3 = -12
- shadowOffsetX.000 = base × 0 = 4 × 0 = 0
- shadowOffsetX.300 = base × 3 = 4 × 3 = 12
- shadowOffsetY.100 = base × 1 = 4 × 1 = 4
- shadowOffsetY.400 = base × 4 = 4 × 4 = 16

**Blur Tokens**:
- shadowBlurHard = base × 1 = 4 × 1 = 4
- shadowBlurModerate = base × 3 = 4 × 3 = 12
- shadowBlurSoft = base × 5 = 4 × 5 = 20
- shadowBlurDepth200 = base × 4 = 4 × 4 = 16
- shadowBlurDepth300 = base × 6 = 4 × 6 = 24

**Opacity Tokens**:
- shadowOpacityHard = base × 1.33 = 0.3 × 1.33 ≈ 0.4
- shadowOpacityModerate = base × 1 = 0.3 × 1 = 0.3
- shadowOpacitySoft = base × 0.67 = 0.3 × 0.67 ≈ 0.2
- shadowOpacityDepth200 = base × 1.17 = 0.3 × 1.17 ≈ 0.35
- shadowOpacityDepth300 = base × 1.33 = 0.3 × 1.33 ≈ 0.4

---

## Related Documentation

- [Glow Token Documentation](./Token-Family-Glow.md) - Glow primitive tokens for emphasis effects
- [Token System Overview](../../docs/token-system-overview.md) - Complete token system architecture
- [Shadow and Glow Design Document](../../.kiro/specs/shadow-glow-token-system/design.md) - Detailed design decisions and rationale
- [Shadow and Glow Requirements](../../.kiro/specs/shadow-glow-token-system/requirements.md) - System requirements and acceptance criteria
- [Component Development Guide](./Component-Development-Guide.md) - Token usage in component development
- [Token Resolution Patterns](./Token-Resolution-Patterns.md) - Strategic guidance on token type selection and validation

---

*This documentation provides comprehensive guidance for using shadow tokens across web, iOS, and Android platforms with mathematically consistent values and cross-platform unity.*
