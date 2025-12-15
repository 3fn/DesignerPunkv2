# Task 9.1 Completion: Create iOS Motion Token Equivalents

**Date**: December 14, 2025
**Task**: 9.1 Create iOS motion token equivalents
**Type**: Implementation
**Status**: Complete

---

## Artifacts Created

- `src/tokens/platforms/ios/MotionTokens.swift` - iOS motion token constants and Animation objects
- `src/tokens/platforms/ios/MotionTokens.md` - Comprehensive usage guide for iOS motion tokens

## Implementation Details

### Approach

Created iOS-specific motion token equivalents that map CSS cubic-bezier curves to SwiftUI `Animation.timingCurve` equivalents. The implementation provides:

1. **Duration Tokens**: TimeInterval constants (in seconds) for direct use with SwiftUI animations
2. **Easing Tokens**: Animation.timingCurve objects that map CSS cubic-bezier control points
3. **Semantic Motion Tokens**: Combined duration + easing tokens for specific animation contexts
4. **Usage Documentation**: Comprehensive guide with patterns and examples

### Key Decisions

**Decision 1**: Use TimeInterval for Duration Tokens
- **Rationale**: SwiftUI animations expect TimeInterval (seconds), so storing durations in seconds provides direct compatibility
- **Conversion**: Milliseconds from primitive tokens converted to seconds (150ms → 0.15s)
- **Benefit**: No runtime conversion needed in components

**Decision 2**: Use Animation.timingCurve for Easing Tokens
- **Rationale**: SwiftUI's Animation.timingCurve directly maps to CSS cubic-bezier control points
- **Mapping**: `cubic-bezier(p1, p2, p3, p4)` → `Animation.timingCurve(p1, p2, p3, p4)`
- **Benefit**: Ensures cross-platform consistency with identical control points

**Decision 3**: Use .speed() Modifier for Duration Control
- **Rationale**: SwiftUI animations default to 1 second, .speed() modifier scales the duration
- **Formula**: `.speed(1.0 / duration)` converts TimeInterval to animation speed
- **Example**: `.speed(1.0 / 0.25)` = 4x speed = 0.25 seconds
- **Benefit**: Combines easing curve with duration in a single animation object

**Decision 4**: Create Semantic Motion Token (motionFloatLabel)
- **Rationale**: Provides ready-to-use combined token for common animation pattern
- **Composition**: `motionEasingStandard.speed(1.0 / motionDurationNormal)`
- **Benefit**: Components can use semantic token directly without combining primitives

### Token Structure

#### Duration Tokens

| Token Name | Value | Milliseconds | Usage |
|------------|-------|--------------|-------|
| `motionDurationFast` | 0.15s | 150ms | Fast interactions |
| `motionDurationNormal` | 0.25s | 250ms | Standard transitions |
| `motionDurationSlow` | 0.35s | 350ms | Deliberate animations |

#### Easing Tokens

| Token Name | CSS Equivalent | Material Design |
|------------|----------------|-----------------|
| `motionEasingStandard` | `cubic-bezier(0.4, 0.0, 0.2, 1)` | Standard curve |
| `motionEasingDecelerate` | `cubic-bezier(0.0, 0.0, 0.2, 1)` | Deceleration curve |
| `motionEasingAccelerate` | `cubic-bezier(0.4, 0.0, 1, 1)` | Acceleration curve |

#### Semantic Motion Tokens

| Token Name | Duration | Easing | Usage |
|------------|----------|--------|-------|
| `motionFloatLabel` | 250ms | Standard | Text input label floating animation |

### Usage Patterns Documented

The implementation includes five usage patterns:

1. **Basic Animation**: Combine easing and duration for custom animations
2. **WithAnimation Block**: Use motion tokens in imperative animations
3. **Combined Motion Token**: Create reusable combined tokens
4. **Reduced Motion Support**: Respect accessibility preferences (required)
5. **Semantic Motion Tokens**: Use semantic tokens when available (preferred)

### Cross-Platform Consistency

All platforms use identical cubic-bezier control points and durations:

**Web**:
```css
transition: all 250ms cubic-bezier(0.4, 0.0, 0.2, 1);
```

**iOS**:
```swift
.animation(motionEasingStandard.speed(1.0 / motionDurationNormal), value: state)
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

### Component Integration Examples

Provided three complete examples:

1. **TextInputField Float Label**: Demonstrates semantic motion token usage with reduced motion support
2. **ButtonCTA Press Animation**: Shows custom combined token creation
3. **Modal Presentation**: Illustrates withAnimation block usage

### Documentation Structure

The usage guide includes:

- Token structure reference tables
- Five usage patterns with code examples
- Speed calculation explanation
- Cross-platform consistency examples
- Component integration examples
- Best practices (DO/DON'T patterns)
- Token mapping reference (CSS to iOS)
- Duration conversion table
- Related documentation links

## Validation (Tier 2: Standard)

### Syntax Validation
✅ getDiagnostics passed - no syntax errors
✅ Swift file compiles without errors
✅ All imports and type annotations correct

### Functional Validation
✅ Duration tokens use correct TimeInterval values (seconds)
✅ Easing tokens use correct Animation.timingCurve control points
✅ Semantic motion token combines duration and easing correctly
✅ Speed calculation formula documented and explained

### Integration Validation
✅ Token values match primitive token definitions
✅ CSS cubic-bezier control points map correctly to iOS
✅ Duration conversions accurate (ms to seconds)
✅ Cross-platform consistency maintained

### Requirements Compliance
✅ Requirement 6.1: Motion tokens provide platform-specific equivalents
✅ Requirement 6.2: iOS components can use motion token constants for duration and easing

## Requirements Compliance

**Requirement 6.1**: WHEN motion tokens are defined THEN the system SHALL provide platform-specific equivalents (CSS cubic-bezier, iOS Animation, Android AnimationSpec)
- ✅ Created iOS Animation.timingCurve equivalents for all easing tokens
- ✅ Created iOS TimeInterval constants for all duration tokens
- ✅ Documented mapping from CSS cubic-bezier to iOS Animation.timingCurve

**Requirement 6.2**: WHEN iOS components use animations THEN the components SHALL use motion token constants for duration and easing
- ✅ Provided duration constants (motionDurationFast, motionDurationNormal, motionDurationSlow)
- ✅ Provided easing constants (motionEasingStandard, motionEasingDecelerate, motionEasingAccelerate)
- ✅ Documented usage patterns for combining duration and easing in components
- ✅ Provided semantic motion token (motionFloatLabel) for direct use

## Implementation Notes

### Speed Calculation Explained

SwiftUI's `.speed()` modifier controls animation duration by scaling the default 1-second animation:

- `speed(1.0)` = 1 second
- `speed(2.0)` = 0.5 seconds (twice as fast)
- `speed(4.0)` = 0.25 seconds (four times as fast)

Formula: `.speed(1.0 / duration)` converts TimeInterval to animation speed

Example: `motionDurationNormal = 0.25s` → `speed(1.0 / 0.25) = speed(4.0)` = 0.25 seconds

### Reduced Motion Support

All usage patterns include reduced motion support using SwiftUI's `@Environment(\.accessibilityReduceMotion)`:

```swift
@Environment(\.accessibilityReduceMotion) var reduceMotion
.animation(reduceMotion ? .none : motionFloatLabel, value: isFloated)
```

This ensures WCAG 2.1 AA compliance by respecting user's motion preferences.

### Semantic Token Strategy

Created `motionFloatLabel` as the first semantic motion token. Future semantic tokens can follow the same pattern:

```swift
public let motionButtonPress = motionEasingSharp.speed(1.0 / motionDurationFast)
public let motionModalSlide = motionEasingDecelerate.speed(1.0 / motionDurationSlow)
```

This provides ready-to-use tokens for common animation patterns while maintaining flexibility for custom animations.

## Related Documentation

- [Motion Token Design](.kiro/specs/017-component-code-quality-sweep/design.md#motion-token-cross-platform-implementation) - Design decisions and cross-platform strategy
- [iOS Motion Token Usage Guide](../../../src/tokens/platforms/ios/MotionTokens.md) - Comprehensive usage documentation
- [Component Development Guide](.kiro/steering/Component Development Guide.md) - Component development standards
- [Accessibility Pattern Standardization](.kiro/specs/017-component-code-quality-sweep/design.md#accessibility-pattern-standardization) - Reduced motion patterns

---

*This implementation provides iOS-specific motion token equivalents that ensure cross-platform consistency while following SwiftUI best practices and maintaining accessibility compliance.*
