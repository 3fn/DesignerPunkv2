# iOS Motion Token Usage Guide

**Date**: December 14, 2025  
**Purpose**: Document iOS motion token usage patterns and cross-platform mapping  
**Organization**: token-documentation  
**Scope**: cross-project

---

## Overview

This guide explains how to use iOS motion tokens for consistent animations across the DesignerPunk design system. iOS motion tokens map CSS cubic-bezier curves to SwiftUI `Animation.timingCurve` equivalents, ensuring cross-platform consistency.

---

## Token Structure

### Duration Tokens

Duration tokens are stored as `TimeInterval` (seconds) for direct use with SwiftUI animations:

| Token Name | Value | Milliseconds | Usage |
|------------|-------|--------------|-------|
| `motionDurationFast` | 0.15s | 150ms | Fast interactions (hover, focus states, micro-interactions) |
| `motionDurationNormal` | 0.25s | 250ms | Standard transitions (float labels, state changes, most animations) |
| `motionDurationSlow` | 0.35s | 350ms | Deliberate animations (modals, drawers, complex transitions) |

### Easing Tokens

Easing tokens are stored as `Animation.timingCurve` for direct use with SwiftUI:

| Token Name | CSS Equivalent | Material Design | Usage |
|------------|----------------|-----------------|-------|
| `motionEasingStandard` | `cubic-bezier(0.4, 0.0, 0.2, 1)` | Standard curve | Most animations (float labels, state changes, general transitions) |
| `motionEasingDecelerate` | `cubic-bezier(0.0, 0.0, 0.2, 1)` | Deceleration curve | Elements entering the screen (modals, drawers, tooltips) |
| `motionEasingAccelerate` | `cubic-bezier(0.4, 0.0, 1, 1)` | Acceleration curve | Elements leaving the screen (dismissals, closures, exits) |

### Semantic Motion Tokens

Semantic motion tokens combine duration and easing for specific animation contexts:

| Token Name | Duration | Easing | Usage |
|------------|----------|--------|-------|
| `motionFloatLabel` | 250ms | Standard | Text input label floating animation |

---

## Usage Patterns

### Pattern 1: Basic Animation with Duration and Easing

Combine easing and duration tokens for custom animations:

```swift
.animation(motionEasingStandard.speed(1.0 / motionDurationFast), value: isFocused)
```

**When to use**: Custom animations that don't have semantic tokens yet.

### Pattern 2: WithAnimation Block

Use motion tokens in `withAnimation` blocks for imperative animations:

```swift
withAnimation(motionEasingStandard.speed(1.0 / motionDurationFast)) {
    isFloated = true
}
```

**When to use**: Imperative state changes that need animation.

### Pattern 3: Combined Motion Token (Recommended)

Create a combined token for reuse across multiple animations:

```swift
let motionFocusTransition = motionEasingStandard.speed(1.0 / motionDurationFast)

.animation(motionFocusTransition, value: isFocused)
```

**When to use**: Multiple animations with the same duration and easing.

### Pattern 4: Reduced Motion Support (Required for Accessibility)

Always respect user's reduced motion preference:

```swift
@Environment(\.accessibilityReduceMotion) var reduceMotion

.animation(reduceMotion ? .none : motionFocusTransition, value: isFocused)
```

**When to use**: All animations (required for WCAG 2.1 AA compliance).

### Pattern 5: Semantic Motion Tokens (Preferred)

Use semantic motion tokens when available:

```swift
@Environment(\.accessibilityReduceMotion) var reduceMotion

.animation(reduceMotion ? .none : motionFloatLabel, value: isFloated)
```

**When to use**: Animations that have semantic tokens defined (preferred approach).

---

## Speed Calculation Explained

SwiftUI's `.speed()` modifier controls animation duration:

- `speed(1.0)` = normal speed (1 second)
- `speed(2.0)` = twice as fast (0.5 seconds)
- `speed(4.0)` = four times as fast (0.25 seconds)

To convert a `TimeInterval` to animation speed:

```swift
.speed(1.0 / duration)
```

**Example**:
- `motionDurationFast = 0.15` seconds
- `speed(1.0 / 0.15) = speed(6.67)` = 6.67x speed = 0.15 seconds

**Why this works**: SwiftUI animations default to 1 second. Multiplying speed by `1.0 / duration` scales the animation to the desired duration.

---

## Cross-Platform Consistency

All platforms use the same cubic-bezier control points and durations:

### Standard Easing Example

**Web**:
```css
transition: all 250ms cubic-bezier(0.4, 0.0, 0.2, 1);
```

**iOS**:
```swift
.animation(motionEasingStandard.speed(1.0 / motionDurationNormal), value: state)
// Animation.timingCurve(0.4, 0.0, 0.2, 1.0).speed(1.0 / 0.25)
```

**Android**:
```kotlin
animateFloatAsState(
    targetValue = if (state) 1f else 0f,
    animationSpec = tween(
        durationMillis = 250,
        easing = CubicBezierEasing(0.4f, 0.0f, 0.2f, 1.0f)
    )
)
```

**Result**: All platforms produce the same animation timing and feel.

---

## Component Integration Examples

### Example 1: TextInputField Float Label

```swift
import SwiftUI

struct TextInputField: View {
    @State private var isFloated: Bool = false
    @Environment(\.accessibilityReduceMotion) var reduceMotion
    
    var body: some View {
        VStack {
            Text("Label")
                .offset(y: isFloated ? -20 : 0)
                .animation(reduceMotion ? .none : motionFloatLabel, value: isFloated)
        }
    }
}
```

### Example 2: ButtonCTA Press Animation

```swift
import SwiftUI

struct ButtonCTA: View {
    @State private var isPressed: Bool = false
    @Environment(\.accessibilityReduceMotion) var reduceMotion
    
    let motionButtonPress = motionEasingSharp.speed(1.0 / motionDurationFast)
    
    var body: some View {
        Button(action: {}) {
            Text("Press Me")
        }
        .scaleEffect(isPressed ? 0.97 : 1.0)
        .animation(reduceMotion ? .none : motionButtonPress, value: isPressed)
    }
}
```

### Example 3: Modal Presentation

```swift
import SwiftUI

struct ModalView: View {
    @State private var isPresented: Bool = false
    @Environment(\.accessibilityReduceMotion) var reduceMotion
    
    let motionModalSlide = motionEasingDecelerate.speed(1.0 / motionDurationSlow)
    
    var body: some View {
        VStack {
            Button("Show Modal") {
                withAnimation(reduceMotion ? .none : motionModalSlide) {
                    isPresented = true
                }
            }
        }
        .sheet(isPresented: $isPresented) {
            Text("Modal Content")
        }
    }
}
```

---

## Best Practices

### ✅ DO: Use Semantic Motion Tokens

```swift
// ✅ CORRECT: Use semantic token
.animation(reduceMotion ? .none : motionFloatLabel, value: isFloated)
```

### ✅ DO: Always Respect Reduced Motion

```swift
// ✅ CORRECT: Check reduced motion preference
@Environment(\.accessibilityReduceMotion) var reduceMotion
.animation(reduceMotion ? .none : motionFocusTransition, value: isFocused)
```

### ✅ DO: Combine Duration and Easing for Custom Animations

```swift
// ✅ CORRECT: Combine tokens for custom animation
let motionCustom = motionEasingStandard.speed(1.0 / motionDurationFast)
.animation(motionCustom, value: state)
```

### ❌ DON'T: Use Hard-Coded Durations

```swift
// ❌ WRONG: Hard-coded duration
.animation(.easeInOut(duration: 0.2), value: isFocused)

// ✅ CORRECT: Use motion tokens
.animation(motionEasingStandard.speed(1.0 / motionDurationFast), value: isFocused)
```

### ❌ DON'T: Use Hard-Coded Easing Curves

```swift
// ❌ WRONG: Hard-coded easing
.animation(.easeOut(duration: 0.25), value: isFloated)

// ✅ CORRECT: Use motion tokens
.animation(motionEasingStandard.speed(1.0 / motionDurationNormal), value: isFloated)
```

### ❌ DON'T: Ignore Reduced Motion Preferences

```swift
// ❌ WRONG: No reduced motion support
.animation(motionFloatLabel, value: isFloated)

// ✅ CORRECT: Respect reduced motion
@Environment(\.accessibilityReduceMotion) var reduceMotion
.animation(reduceMotion ? .none : motionFloatLabel, value: isFloated)
```

---

## Token Mapping Reference

### CSS to iOS Mapping

| CSS | iOS |
|-----|-----|
| `cubic-bezier(0.4, 0.0, 0.2, 1)` | `Animation.timingCurve(0.4, 0.0, 0.2, 1.0)` |
| `cubic-bezier(0.0, 0.0, 0.2, 1)` | `Animation.timingCurve(0.0, 0.0, 0.2, 1.0)` |
| `cubic-bezier(0.4, 0.0, 1, 1)` | `Animation.timingCurve(0.4, 0.0, 1.0, 1.0)` |
| `250ms` | `0.25` (TimeInterval in seconds) |
| `transition: all 250ms cubic-bezier(...)` | `.animation(Animation.timingCurve(...).speed(1.0 / 0.25), value: state)` |

### Duration Conversion

| Milliseconds | iOS TimeInterval | Speed Multiplier |
|--------------|------------------|------------------|
| 150ms | 0.15s | `speed(1.0 / 0.15) = 6.67` |
| 250ms | 0.25s | `speed(1.0 / 0.25) = 4.0` |
| 350ms | 0.35s | `speed(1.0 / 0.35) = 2.86` |

---

## Related Documentation

- [Motion Token Design](.kiro/specs/017-component-code-quality-sweep/design.md#motion-token-cross-platform-implementation) - Design decisions and cross-platform strategy
- [Component Development Guide](.kiro/steering/Component Development Guide.md) - Component development standards
- [Accessibility Pattern Standardization](.kiro/specs/017-component-code-quality-sweep/design.md#accessibility-pattern-standardization) - Reduced motion patterns

---

*This guide ensures consistent motion token usage across iOS components while maintaining cross-platform consistency and accessibility compliance.*
