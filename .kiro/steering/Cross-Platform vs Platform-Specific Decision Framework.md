---
inclusion: manual
---

# Cross-Platform vs Platform-Specific Decision Framework

**Date**: 2025-12-19
**Last Reviewed**: 2025-12-19
**Purpose**: Strategic guidance on when to use cross-platform patterns vs platform-specific idioms
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 2
**Relevant Tasks**: component-development, platform-implementation

## Overview

DesignerPunk's True Native Architecture creates a fundamental tension: we want cross-platform consistency through design tokens while respecting platform-appropriate UX through native idioms. This framework helps you make informed decisions about when to prioritize each approach.

**Key Principle**: Neither cross-platform consistency nor platform-specific idioms are always correct. The right choice depends on context, user expectations, and design system goals.

---

## Decision Framework

### When to Use Cross-Platform Patterns

**Use cross-platform patterns when:**

- **Core functionality should work identically** across platforms
  - Example: Button tap behavior, form validation logic
  
- **Token-based styling maintains design system consistency**
  - Example: Color schemes, typography scales, spacing systems
  
- **Component APIs need platform-agnostic interfaces**
  - Example: Props like `variant`, `size`, `disabled` work the same everywhere
  
- **Behavior users expect to be consistent**
  - Example: Navigation patterns, data display, content hierarchy

**Benefits**:
- Predictable behavior across platforms
- Easier maintenance (one design decision applies everywhere)
- Consistent brand expression
- Simplified documentation

**Trade-offs**:
- May feel less "native" on some platforms
- Can miss platform-specific UX improvements
- Requires more abstraction in implementation


### When to Use Platform-Specific Idioms

**Use platform-specific idioms when:**

- **Platform-native animations provide superior UX**
  - Example: iOS spring animations, Android ripple effects
  
- **Platform-specific interaction patterns users expect**
  - Example: iOS swipe gestures, Android floating action buttons
  
- **Accessibility features leverage platform capabilities**
  - Example: iOS VoiceOver, Android TalkBack, platform-specific touch targets
  
- **Performance optimizations use platform-specific APIs**
  - Example: iOS Metal rendering, Android Jetpack Compose optimizations

**Benefits**:
- Feels native and familiar to platform users
- Leverages platform strengths and conventions
- Better accessibility through platform features
- Often better performance

**Trade-offs**:
- Requires platform-specific implementation
- More complex maintenance (different code per platform)
- Can create inconsistent experiences across platforms
- Requires more documentation

---

## Decision Criteria

**Ask these questions to guide your decision:**

### 1. Does this affect user-facing behavior or just implementation?

- **User-facing behavior**: Lean toward cross-platform consistency
  - Users expect consistent functionality across devices
  - Example: Form validation, data display, navigation
  
- **Implementation details**: Lean toward platform idioms
  - Users don't see implementation, only results
  - Example: Animation curves, rendering optimizations

### 2. Is there a platform convention that users expect?

- **Strong platform convention**: Use platform idiom
  - Users have learned platform patterns
  - Example: iOS swipe-to-delete, Android back button behavior
  
- **No strong convention**: Use cross-platform pattern
  - No user expectations to violate
  - Example: Custom component interactions

### 3. Does the platform provide superior UX through native patterns?

- **Superior platform UX**: Use platform idiom
  - Platform pattern is objectively better
  - Example: iOS spring animations feel more responsive
  
- **Equivalent UX**: Use cross-platform pattern
  - No meaningful UX difference
  - Example: Button border radius

### 4. Can we maintain design system consistency while respecting platform idioms?

- **Yes**: Use platform idiom with token-based values
  - Example: iOS spring animation with motion token duration
  
- **No**: Pause and ask for guidance
  - Example: Platform color scheme conflicts with brand colors

---

## Motion Token Usage

### Strategic Guidance

**Motion tokens define timing, easing, and duration values** that maintain consistent animation feel across the design system.

**When to use motion tokens:**
- Transitions between states (hover, focus, active)
- Content reveal/hide animations
- Loading states and progress indicators
- Cross-platform animations where consistency matters

**When platform-native animations may use hard-coded values:**
- Platform-specific interaction feedback (iOS springs, Android ripples)
- System-level animations following platform guidelines
- Accessibility-driven animations (reduced motion preferences)
- Performance-critical animations using platform APIs

**Key principle**: Document rationale when choosing platform idioms over tokens.

### Decision Tree: Should I Use Motion Tokens?

```
Is this animation cross-platform?
├─ YES → Use motion tokens for consistency
└─ NO → Is there a platform-native animation that provides superior UX?
    ├─ YES → Does the platform animation follow platform guidelines?
    │   ├─ YES → Use platform animation, document rationale
    │   └─ NO → Use motion tokens
    └─ NO → Use motion tokens
```

### When to Pause and Ask

**Pause and ask Peter when:**
- Unclear whether platform animation should use tokens or native values
- Motion token doesn't exist for the needed animation
- Platform idiom conflicts with design system consistency
- Animation is critical to brand expression

**Example questions:**
- "iOS spring animation provides better UX but doesn't use motion tokens. Should I use the spring or token-based animation?"
- "Android ripple effect is platform convention but conflicts with our interaction design. Which should I prioritize?"

---

## Token Mapping Patterns

### Strategic Guidance

**Token mapping** is how platform implementations consume design tokens while respecting platform idioms.

**Cross-platform token equivalence**: Same token → same visual result
- `space.inset.normal` = 8px on web = 8pt on iOS = 8dp on Android
- Mathematical relationships preserved across platforms

**Platform-appropriate idioms for token consumption**:
- **Web**: CSS custom properties (`var(--space-inset-normal)`)
- **iOS**: Swift constants (`spaceInsetNormal`)
- **Android**: Kotlin constants (`spaceInsetNormal.dp`)

### Platform-Specific Mapping Approaches

**Web Platform**:
```css
/* Token-based styling with CSS custom properties */
.button {
  padding: var(--space-inset-normal);
  background: var(--color-primary);
  transition: var(--motion-duration-normal) var(--motion-easing-standard);
}

/* Platform-specific enhancement */
.button:hover {
  /* Browser-native hover state */
  filter: brightness(1.1);
}
```

**iOS Platform**:
```swift
// Token-based styling with Swift constants
Button(action: action) {
    Text(label)
}
.padding(spaceInsetNormal)
.background(colorPrimary)

// Platform-specific enhancement
.animation(.spring(response: 0.3, dampingFraction: 0.7))
```

**Android Platform**:
```kotlin
// Token-based styling with Kotlin constants
Button(
    onClick = onClick,
    modifier = Modifier.padding(spaceInsetNormal.dp)
) {
    Text(text = label)
}

// Platform-specific enhancement
.clickable(
    indication = rememberRipple(),
    interactionSource = remember { MutableInteractionSource() }
)
```

### When to Pause and Ask

**Pause and ask Peter when:**
- Token mapping pattern doesn't exist for your use case
- Platform idiom requires values that don't map to tokens
- Unclear how to maintain token equivalence across platforms

---

## Examples and Patterns

### Example 1: Button Interaction Feedback

**Scenario**: Button needs visual feedback on interaction

**Cross-Platform Approach**:
- Use motion tokens for transition timing
- Use color tokens for state changes
- Consistent behavior across platforms

**Platform-Specific Approach**:
- iOS: Spring animation on tap
- Android: Ripple effect on touch
- Web: Hover state with brightness filter

**Decision**: Use platform-specific approach
- **Rationale**: Platform conventions provide superior UX
- **Token usage**: Still use color tokens for button colors
- **Documentation**: Note in component README why platform idioms used

### Example 2: Form Validation Timing

**Scenario**: When to show validation errors

**Cross-Platform Approach**:
- Validate on blur (when user leaves field)
- Show errors after first submission attempt
- Consistent timing across platforms

**Platform-Specific Approach**:
- iOS: Validate on blur (iOS convention)
- Android: Validate on input (Material Design guideline)
- Web: Validate on blur (web convention)

**Decision**: Use cross-platform approach
- **Rationale**: Consistent validation behavior more important than platform conventions
- **Token usage**: Use motion tokens for error reveal animation
- **Documentation**: Note validation timing in component README

### Example 3: Loading Indicators

**Scenario**: Show loading state during async operations

**Cross-Platform Approach**:
- Use design system spinner component
- Use motion tokens for rotation timing
- Consistent visual across platforms

**Platform-Specific Approach**:
- iOS: UIActivityIndicatorView (system spinner)
- Android: CircularProgressIndicator (Material Design)
- Web: Custom SVG spinner

**Decision**: Depends on context
- **Brand-critical contexts**: Use cross-platform design system spinner
- **System-level operations**: Use platform-native indicators
- **Token usage**: Use motion tokens for custom spinner timing
- **Documentation**: Document when to use each approach

---

## Documentation Requirements

**When using platform-specific idioms**, document in component README:

### Required Documentation

1. **Rationale**: Why platform idiom chosen over cross-platform pattern
2. **Platform differences**: What differs between platforms and why
3. **Token usage**: Which tokens still used despite platform idioms
4. **Accessibility**: How platform idiom affects accessibility

### Example Documentation

```markdown
## Platform-Specific Behavior

### Interaction Feedback

**iOS**: Uses spring animation for button tap feedback
- Rationale: iOS users expect spring animations for interactive elements
- Token usage: Still uses color tokens for button states
- Accessibility: Respects reduced motion preference

**Android**: Uses ripple effect for button tap feedback
- Rationale: Material Design guideline for touch feedback
- Token usage: Still uses color tokens for ripple color
- Accessibility: Ripple effect provides visual feedback for touch

**Web**: Uses hover state with brightness filter
- Rationale: Web convention for button hover states
- Token usage: Uses motion tokens for transition timing
- Accessibility: Hover state doesn't affect keyboard navigation
```

---

## Related Documentation

- [Component Development and Practices Guide](./Component Development and Practices Guide.md) - Component implementation guidance with collaboration practices
- [Token Resolution Patterns](./Token-Resolution-Patterns.md) - Strategic guidance on token type selection and validation
- [True Native Architecture](../../preserved-knowledge/true-native-architecture-concepts.md) - Build-time platform separation principles

---

*This framework provides strategic guidance for balancing cross-platform consistency with platform-appropriate UX. When in doubt, pause and ask Peter for guidance.*
