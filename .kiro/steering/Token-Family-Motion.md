---
inclusion: manual
---

# Motion Token Usage Documentation

**Date**: December 6, 2025
**Last Reviewed**: 2025-12-30
**Purpose**: Motion token reference and usage guide
**Organization**: token-documentation
**Scope**: motion-token-system
**Layer**: 3
**Relevant Tasks**: component-development, token-selection

---

## Overview

The Motion Token System provides mathematically consistent primitives for creating animation timing, easing, and scale effects across web, iOS, and Android platforms. Motion tokens enable consistent, natural-feeling animations that enhance user experience through predictable timing and smooth transitions.

The system follows a compositional architecture where semantic motion tokens compose multiple primitive tokens (duration, easing, scale) to create complete motion styles for specific use cases.

---

## Motion Primitive Tokens

Motion primitives are the foundational building blocks that semantic motion tokens compose. Each primitive represents a single motion property with mathematically consistent values across platforms.

### Duration Tokens

Duration tokens determine animation timing in milliseconds.

| Token | Value | Description | Use Case |
|-------|-------|-------------|----------|
| `duration150` | 150ms | Fast interactions | Hover states, focus indicators, quick feedback |
| `duration250` | 250ms | Standard transitions | Float labels, menu animations, standard UI transitions |
| `duration350` | 350ms | Deliberate animations | Modals, drawers, page transitions, complex state changes |

**Mathematical Foundation**: Linear progression with +100ms steps (150, 250, 350)

**Design Philosophy**:
- **150ms**: Faster than Material Design's 200ms for more responsive feel
- **250ms**: Standard transition duration for most UI animations
- **350ms**: Slower than Material Design's 300ms for more deliberate animations

**Platform-Specific Output**:
- **Web**: `150ms`, `250ms`, `350ms` (milliseconds with "ms" suffix)
- **iOS**: `0.15`, `0.25`, `0.35` (TimeInterval in seconds)
- **Android**: `150`, `250`, `350` (milliseconds as integers)

### Easing Tokens

Easing tokens determine animation acceleration curves using Material Design cubic-bezier definitions.

| Token | Value | Description | Use Case |
|-------|-------|-------------|----------|
| `easingStandard` | cubic-bezier(0.4, 0.0, 0.2, 1) | Balanced acceleration | Standard UI transitions, float labels, most animations |
| `easingDecelerate` | cubic-bezier(0.0, 0.0, 0.2, 1) | Slow start, fast end | Entering elements, expanding panels, appearing content |
| `easingAccelerate` | cubic-bezier(0.4, 0.0, 1, 1) | Fast start, slow end | Exiting elements, collapsing panels, disappearing content |

**Mathematical Foundation**: Material Design cubic-bezier curves for natural motion feel

**Design Philosophy**:
- **easingStandard**: Most versatile curve for general UI animations
- **easingDecelerate**: Elements entering the screen feel natural with slow start
- **easingAccelerate**: Elements leaving the screen feel natural with fast start

**Platform-Specific Output**:
- **Web**: `cubic-bezier(0.4, 0.0, 0.2, 1)` (CSS cubic-bezier format)
- **iOS**: `Animation.timingCurve(0.4, 0.0, 0.2, 1.0)` (Swift Animation API)
- **Android**: `CubicBezierEasing(0.4f, 0.0f, 0.2f, 1.0f)` (Kotlin Compose API)

### Scale Tokens

Scale tokens determine transform-based animation scale factors with 8-interval progression.

| Token | Value | Description | Use Case |
|-------|-------|-------------|----------|
| `scale088` | 0.88 | Float label scale | Text input labels (16px → 14px), subtle scale down |
| `scale092` | 0.92 | Subtle scale down | Minor emphasis reduction, gentle scale animations |
| `scale096` | 0.96 | Button press feedback | Active button states, pressed elements |
| `scale100` | 1.00 | Default/reset state | Normal element size, animation endpoints |
| `scale104` | 1.04 | Hover emphasis | Hover states, subtle emphasis increase |
| `scale108` | 1.08 | Strong emphasis | Focus states, strong emphasis, attention-grabbing |

**Mathematical Foundation**: 8-interval progression (0.88, 0.92, 0.96, 1.00, 1.04, 1.08) aligns with 8px baseline grid

**Design Philosophy**:
- **8-interval progression**: Maintains consistency with DesignerPunk's 8px baseline grid
- **Rounding**: Scale values are pre-rounded during token generation (e.g., 16px × 0.88 = 14.08px → 14px)
- **GPU-accelerated**: Transform-based animations use GPU for smooth performance

**Platform-Specific Output**:
- **Web**: `0.88`, `0.92`, `0.96`, `1.00`, `1.04`, `1.08` (unitless numbers)
- **iOS**: `0.88`, `0.92`, `0.96`, `1.00`, `1.04`, `1.08` (CGFloat values)
- **Android**: `0.88f`, `0.92f`, `0.96f`, `1.00f`, `1.04f`, `1.08f` (Float values)

**Rounding Behavior**:

Scale tokens are applied during token generation, producing pre-rounded values:

```typescript
// Example: Float label scale
16px × scale088 (0.88) = 14.08px → rounds to 14px
14px × scale088 (0.88) = 12.32px → rounds to 12px
12px × scale088 (0.88) = 10.56px → rounds to 11px
```

Components receive pre-rounded values, ensuring consistent rendering across platforms without subpixel issues.

---

## Motion Semantic Tokens

Semantic motion tokens compose primitives to create complete motion styles for specific use cases.

### motion.floatLabel

Float label animation for text input fields.

**Composition**:
- duration: `duration250` (250ms)
- easing: `easingStandard` (cubic-bezier(0.4, 0.0, 0.2, 1))

**Use Cases**: Text input label floating up on focus, form field label transitions

**Visual Effect**: Smooth, balanced animation with 250ms duration and standard easing curve

**Example Calculation**:
```
Label starts at 16px font size
Applies scale088 (0.88) during animation
16px × 0.88 = 14.08px → rounds to 14px
Final label size: 14px
```

---

## Cross-Platform Usage

### Web (CSS)

Motion tokens translate to CSS transition and animation properties.

#### Using Semantic Motion Tokens

```css
/* Apply motion.floatLabel to text input label */
.input-label {
  transition: 
    font-size var(--motion-float-label-duration) var(--motion-float-label-easing),
    transform var(--motion-float-label-duration) var(--motion-float-label-easing);
}

/* Float label on focus */
.input:focus + .input-label {
  font-size: 14px;  /* Pre-rounded from 16px × scale088 */
  transform: translateY(-20px);
}
```

#### Using Individual Motion Properties

```css
/* Access individual motion properties */
.custom-animation {
  transition-duration: var(--duration-250);
  transition-timing-function: var(--easing-standard);
}

/* Use scale tokens for transform animations */
.button:hover {
  transform: scale(var(--scale-104));
  transition: transform var(--duration-150) var(--easing-standard);
}

.button:active {
  transform: scale(var(--scale-096));
}
```

#### Generated CSS Custom Properties

```css
:root {
  /* Duration tokens */
  --duration-150: 150ms;
  --duration-250: 250ms;
  --duration-350: 350ms;
  
  /* Easing tokens */
  --easing-standard: cubic-bezier(0.4, 0.0, 0.2, 1);
  --easing-decelerate: cubic-bezier(0.0, 0.0, 0.2, 1);
  --easing-accelerate: cubic-bezier(0.4, 0.0, 1, 1);
  
  /* Scale tokens */
  --scale-088: 0.88;
  --scale-092: 0.92;
  --scale-096: 0.96;
  --scale-100: 1.00;
  --scale-104: 1.04;
  --scale-108: 1.08;
  
  /* Semantic motion tokens */
  --motion-float-label-duration: var(--duration-250);
  --motion-float-label-easing: var(--easing-standard);
}
```

#### Web Platform Notes

- **Full Support**: Web supports all motion properties (duration, easing, scale)
- **Performance**: Use CSS custom properties for efficient animation updates
- **GPU Acceleration**: Transform-based animations (scale, translate) use GPU
- **Browser Support**: Modern browsers support CSS transitions and animations

#### Reduced Motion Support (Web)

```css
/* Respect user's reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .input-label {
    transition: none;
  }
  
  .input:focus + .input-label {
    /* Apply instant state change without animation */
    font-size: 14px;
    transform: translateY(-20px);
  }
}
```

### iOS (Swift)

Motion tokens translate to iOS animation APIs.

#### Using Semantic Motion Tokens

```swift
// Apply motion.floatLabel to text input label
withAnimation(
    .timingCurve(
        MotionTokens.floatLabel.easing.p1,
        MotionTokens.floatLabel.easing.p2,
        MotionTokens.floatLabel.easing.p3,
        MotionTokens.floatLabel.easing.p4,
        duration: MotionTokens.floatLabel.duration
    )
) {
    labelOffset = -20
    labelScale = ScaleTokens.scale088
}
```

#### Using Individual Motion Properties

```swift
// Access individual motion properties
withAnimation(.easeInOut(duration: DurationTokens.duration250)) {
    viewState.toggle()
}

// Use scale tokens for transform animations
Button(action: {}) {
    Text("Press Me")
}
.scaleEffect(isPressed ? ScaleTokens.scale096 : ScaleTokens.scale100)
.animation(.easeInOut(duration: DurationTokens.duration150), value: isPressed)
```

#### Generated Swift Code

```swift
import SwiftUI

/// Duration tokens (TimeInterval in seconds)
enum DurationTokens {
    static let duration150: TimeInterval = 0.15
    static let duration250: TimeInterval = 0.25
    static let duration350: TimeInterval = 0.35
}

/// Easing tokens (cubic-bezier control points)
struct EasingToken {
    let p1: Double
    let p2: Double
    let p3: Double
    let p4: Double
}

enum EasingTokens {
    static let easingStandard = EasingToken(p1: 0.4, p2: 0.0, p3: 0.2, p4: 1.0)
    static let easingDecelerate = EasingToken(p1: 0.0, p2: 0.0, p3: 0.2, p4: 1.0)
    static let easingAccelerate = EasingToken(p1: 0.4, p2: 0.0, p3: 1.0, p4: 1.0)
}

/// Scale tokens (CGFloat values)
enum ScaleTokens {
    static let scale088: CGFloat = 0.88
    static let scale092: CGFloat = 0.92
    static let scale096: CGFloat = 0.96
    static let scale100: CGFloat = 1.00
    static let scale104: CGFloat = 1.04
    static let scale108: CGFloat = 1.08
}

/// Semantic motion token
struct MotionFloatLabel {
    let duration = DurationTokens.duration250
    let easing = EasingTokens.easingStandard
}

enum MotionTokens {
    static let floatLabel = MotionFloatLabel()
}
```

#### iOS Platform Notes

- **TimeInterval**: Duration values converted from milliseconds to seconds (250ms → 0.25s)
- **Animation.timingCurve**: Easing curves use SwiftUI Animation API
- **CGFloat**: Scale values use CGFloat for transform operations
- **Performance**: SwiftUI animations are GPU-accelerated by default

#### Reduced Motion Support (iOS)

```swift
// Respect user's reduced motion preference
@Environment(\.accessibilityReduceMotion) var reduceMotion

var body: some View {
    Text("Label")
        .offset(y: labelOffset)
        .scaleEffect(labelScale)
        .animation(
            reduceMotion ? nil : .timingCurve(
                MotionTokens.floatLabel.easing.p1,
                MotionTokens.floatLabel.easing.p2,
                MotionTokens.floatLabel.easing.p3,
                MotionTokens.floatLabel.easing.p4,
                duration: MotionTokens.floatLabel.duration
            ),
            value: labelOffset
        )
}
```

### Android (Kotlin)

Motion tokens translate to Android Compose animation APIs.

#### Using Semantic Motion Tokens

```kotlin
// Apply motion.floatLabel to text input label
val labelOffset by animateFloatAsState(
    targetValue = if (isFocused) -20f else 0f,
    animationSpec = tween(
        durationMillis = MotionTokens.floatLabel.duration,
        easing = MotionTokens.floatLabel.easing
    )
)

val labelScale by animateFloatAsState(
    targetValue = if (isFocused) ScaleTokens.Scale088 else ScaleTokens.Scale100,
    animationSpec = tween(
        durationMillis = MotionTokens.floatLabel.duration,
        easing = MotionTokens.floatLabel.easing
    )
)
```

#### Using Individual Motion Properties

```kotlin
// Access individual motion properties
val alpha by animateFloatAsState(
    targetValue = if (isVisible) 1f else 0f,
    animationSpec = tween(
        durationMillis = DurationTokens.Duration250,
        easing = EasingTokens.EasingStandard
    )
)

// Use scale tokens for transform animations
Button(
    onClick = {},
    modifier = Modifier.scale(
        if (isPressed) ScaleTokens.Scale096 else ScaleTokens.Scale100
    )
) {
    Text("Press Me")
}
```

#### Generated Kotlin Code

```kotlin
package com.designerpunk.tokens

import androidx.compose.animation.core.CubicBezierEasing

/**
 * Duration tokens (milliseconds)
 */
object DurationTokens {
    const val Duration150 = 150
    const val Duration250 = 250
    const val Duration350 = 350
}

/**
 * Easing tokens (CubicBezierEasing)
 */
object EasingTokens {
    val EasingStandard = CubicBezierEasing(0.4f, 0.0f, 0.2f, 1.0f)
    val EasingDecelerate = CubicBezierEasing(0.0f, 0.0f, 0.2f, 1.0f)
    val EasingAccelerate = CubicBezierEasing(0.4f, 0.0f, 1.0f, 1.0f)
}

/**
 * Scale tokens (Float values)
 */
object ScaleTokens {
    const val Scale088 = 0.88f
    const val Scale092 = 0.92f
    const val Scale096 = 0.96f
    const val Scale100 = 1.00f
    const val Scale104 = 1.04f
    const val Scale108 = 1.08f
}

/**
 * Semantic motion token
 */
data class MotionToken(
    val duration: Int,
    val easing: CubicBezierEasing
)

/**
 * Motion tokens
 */
object MotionTokens {
    val floatLabel = MotionToken(
        duration = DurationTokens.Duration250,
        easing = EasingTokens.EasingStandard
    )
}
```

#### Android Platform Notes

- **Milliseconds**: Duration values remain in milliseconds (250ms)
- **CubicBezierEasing**: Easing curves use Compose animation API
- **Float**: Scale values use Float suffix for Kotlin type system
- **Performance**: Compose animations are GPU-accelerated by default

#### Reduced Motion Support (Android)

```kotlin
// Respect user's reduced motion preference
val context = LocalContext.current
val reduceMotion = remember {
    val accessibilityManager = context.getSystemService(Context.ACCESSIBILITY_SERVICE) as AccessibilityManager
    accessibilityManager.isReduceMotionEnabled()
}

val labelOffset by animateFloatAsState(
    targetValue = if (isFocused) -20f else 0f,
    animationSpec = if (reduceMotion) {
        snap()  // Instant state change
    } else {
        tween(
            durationMillis = MotionTokens.floatLabel.duration,
            easing = MotionTokens.floatLabel.easing
        )
    }
)
```

---

## Design Guidelines

### When to Use Each Duration

#### duration150 (Fast)
- **Use for**: Hover states, focus indicators, quick feedback
- **Timing**: Fast, responsive feel
- **Visual weight**: Subtle, immediate
- **Examples**: Button hover, input focus ring, tooltip appearance

#### duration250 (Standard)
- **Use for**: Float labels, menu animations, standard UI transitions
- **Timing**: Balanced, natural feel
- **Visual weight**: Noticeable, smooth
- **Examples**: Text input labels, dropdown menus, tab switching

#### duration350 (Deliberate)
- **Use for**: Modals, drawers, page transitions, complex state changes
- **Timing**: Slower, more deliberate
- **Visual weight**: Prominent, intentional
- **Examples**: Modal dialogs, navigation drawers, page transitions

### When to Use Each Easing

#### easingStandard (Balanced)
- **Use for**: Most UI animations, float labels, standard transitions
- **Acceleration**: Balanced start and end
- **Feel**: Natural, versatile
- **Examples**: Float labels, menu animations, general UI transitions

#### easingDecelerate (Slow Start)
- **Use for**: Entering elements, expanding panels, appearing content
- **Acceleration**: Slow start, fast end
- **Feel**: Elements entering the screen
- **Examples**: Modal appearing, panel expanding, content fading in

#### easingAccelerate (Fast Start)
- **Use for**: Exiting elements, collapsing panels, disappearing content
- **Acceleration**: Fast start, slow end
- **Feel**: Elements leaving the screen
- **Examples**: Modal dismissing, panel collapsing, content fading out

### When to Use Each Scale

#### scale088 (Float Label)
- **Use for**: Text input labels, subtle scale down
- **Scale factor**: 0.88 (16px → 14px)
- **Visual effect**: Noticeable size reduction
- **Examples**: Float label animation, secondary text emphasis

#### scale092-096 (Subtle)
- **Use for**: Minor emphasis changes, gentle scale animations
- **Scale factor**: 0.92-0.96
- **Visual effect**: Subtle size change
- **Examples**: Button press feedback, gentle hover effects

#### scale100 (Default)
- **Use for**: Normal element size, animation endpoints
- **Scale factor**: 1.00 (no scaling)
- **Visual effect**: Original size
- **Examples**: Default state, animation reset

#### scale104-108 (Emphasis)
- **Use for**: Hover states, focus states, attention-grabbing
- **Scale factor**: 1.04-1.08
- **Visual effect**: Noticeable size increase
- **Examples**: Button hover, focus emphasis, call-to-action

### Composing Custom Motion

When semantic motion tokens don't meet your needs, compose custom motion from primitives:

```typescript
// Example: Custom motion for a specific use case
const customMotion = {
  duration: 'duration350',        // Deliberate animation
  easing: 'easingDecelerate',     // Entering element
  scale: 'scale104'               // Hover emphasis
};
```

**Guidelines for Custom Motion**:
1. **Start with semantic motion**: Use existing semantic motion tokens when possible
2. **Compose from primitives**: Build custom motion from primitive tokens
3. **Match duration and easing**: Combine duration and easing consistently
4. **Consider scale context**: Use scale tokens for transform animations only
5. **Test across platforms**: Verify motion feels natural on all platforms

### Accessibility Considerations

**Reduced Motion**:
- Always respect user's reduced motion preference
- Disable animations when reduced motion is enabled
- Apply instant state changes instead of animated transitions
- Test with reduced motion enabled on all platforms

**Motion Sensitivity**:
- Avoid rapid motion changes that could trigger motion sensitivity
- Use appropriate easing functions for natural motion feel
- Test animations with users who have motion sensitivity

**Semantic Meaning**:
- Use motion consistently to convey state changes
- Don't rely solely on motion to convey critical information
- Provide alternative cues (color, text) for users who may not perceive motion

---

## Mathematical Foundation

### Linear Duration Progression

Duration tokens follow a linear +100ms progression:

- **duration150** = 150ms (base)
- **duration250** = 150ms + 100ms = 250ms
- **duration350** = 250ms + 100ms = 350ms

**Design Philosophy**: Linear progression provides predictable timing relationships. Each step up feels proportionally slower, making it easy to reason about animation timing.

### Material Design Easing Curves

Easing tokens use Material Design cubic-bezier curves:

- **easingStandard**: cubic-bezier(0.4, 0.0, 0.2, 1) - Balanced acceleration
- **easingDecelerate**: cubic-bezier(0.0, 0.0, 0.2, 1) - Slow start, fast end
- **easingAccelerate**: cubic-bezier(0.4, 0.0, 1, 1) - Fast start, slow end

**Design Philosophy**: Material Design curves are industry-proven and feel natural across platforms. They provide consistent motion feel that users recognize.

### 8-Interval Scale Progression

Scale tokens follow an 8-interval progression aligned with the 8px baseline grid:

- **scale088** = 0.88 (16px × 0.88 = 14.08px → 14px)
- **scale092** = 0.92 (16px × 0.92 = 14.72px → 15px)
- **scale096** = 0.96 (16px × 0.96 = 15.36px → 15px)
- **scale100** = 1.00 (16px × 1.00 = 16px)
- **scale104** = 1.04 (16px × 1.04 = 16.64px → 17px)
- **scale108** = 1.08 (16px × 1.08 = 17.28px → 17px)

**Design Philosophy**: 8-interval progression maintains consistency with DesignerPunk's 8px baseline grid. Scale values are pre-rounded during token generation to ensure whole pixel values.

### Rounding Behavior

Scale tokens are applied during token generation with Math.round():

```typescript
// Example: Float label scale
const baseSize = 16;
const scaledSize = Math.round(baseSize * scale088);
// 16 × 0.88 = 14.08 → rounds to 14

// Rounding ensures whole pixel values
expect(scaledSize).toBe(14);
expect(Number.isInteger(scaledSize)).toBe(true);
```

**Rounding Strategy**:
- Rounding happens during token generation, not component consumption
- Components receive pre-rounded values
- Ensures consistent rendering across platforms
- Prevents subpixel rendering issues

---

## Related Documentation

- [Shadow Token Documentation](./Token-Family-Shadow.md) - Shadow primitive tokens for depth effects
- [Token System Overview](../token-system-overview.md) - Complete token system architecture
- [Motion Token Design Document](../../.kiro/specs/014-motion-token-system/design.md) - Detailed design decisions and rationale
- [Motion Token Requirements](../../.kiro/specs/014-motion-token-system/requirements.md) - System requirements and acceptance criteria
- [Component Development Guide](./Component-Development-Guide.md) - Token usage in component development
- [Token Resolution Patterns](./Token-Resolution-Patterns.md) - Strategic guidance on token type selection and validation

---

*This documentation provides comprehensive guidance for using motion tokens across web, iOS, and Android platforms with mathematically consistent values and cross-platform unity.*
