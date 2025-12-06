# Design Outline: Motion Token System

**Date**: December 1, 2025  
**Purpose**: Explore motion token architecture before formal requirements  
**Organization**: spec-guide  
**Scope**: 014-motion-token-system

---

## Overview

This design outline explores the motion token system architecture for DesignerPunk. Motion tokens follow the same **compositional pattern as Shadow and Typography tokens** - semantic tokens that compose primitive duration, easing, scale, and delay values.

**Key Principle**: Like Shadow tokens compose offsetX/offsetY/blur/opacity/color, Motion tokens compose duration/easing/delay. We fill only what we need now, but structure allows incremental expansion.

---

## ✅ DEPENDENCY RESOLVED

**Text Input Field design outline is complete.** Motion token requirements are now defined and validated.

**Motion Token Requirements (from Text Input Field)**:
- **Duration primitive**: `duration250` (250ms) - Label float transition timing
- **Easing primitive**: `easingStandard` (cubic-bezier(0.4, 0.0, 0.2, 1)) - Balanced animation curve
- **Scale primitive**: `scale088` (0.88) - Typography scale for 16px → 14px transition (with rounding)
- **Semantic token**: `motion.floatLabel` - Composes duration250 + easingStandard
- **Rounding approach**: Token generation system handles rounding to nearest whole pixel
- **Cross-platform**: Same timing/easing across web, iOS, Android
- **Accessibility**: Respect `prefers-reduced-motion` (disable animations when requested)

**Dependency Chain**: Text Input Field design outline ✅ → Motion token requirements ✅ → **Ready for Requirements phase**

**Related Spec**: `.kiro/specs/013-text-input-field/design-outline.md`

---

## Design Philosophy

### Compositional Pattern (Like Shadow Tokens)

**Approach**: Motion tokens follow the same compositional pattern as Shadow and Typography tokens. Semantic motion tokens compose primitive duration, easing, scale, and delay values.

**Pattern Comparison**:
```typescript
// Shadow tokens compose primitives
'shadow.container': {
  primitiveReferences: {
    offsetX: 'shadowOffsetX.000',
    offsetY: 'shadowOffsetY.100',
    blur: 'shadowBlurModerate',
    opacity: 'shadowOpacityModerate',
    color: 'shadowBlack100'
  }
}

// Motion tokens compose primitives (same pattern!)
'motion.floatLabel': {
  primitiveReferences: {
    duration: 'duration250',
    easing: 'easingStandard'
  }
}
```

**Rationale**:
- **Consistent architecture**: Matches existing Shadow and Typography token patterns
- **Simpler structure**: No complex nested categories
- **Semantic meaning**: `motion.floatLabel` is clearer than `animation.duration.normal`
- **Industry-aligned**: Simpler approach like Atlassian/Polaris, but compositional
- **Fill incrementally**: Only create semantic motion tokens when patterns emerge

---

## Token Structure

### Primitive Motion Tokens (Foundation Layer)

Primitive tokens are the building blocks that semantic motion tokens compose.

#### Duration Primitives (Fill What We Need)

```typescript
// DurationTokens.ts
export const durationTokens = {
  duration150: 150,  // Fast interactions (hover, focus)
  duration250: 250,  // Standard transitions (float label) ← Need for Text Input
  duration350: 350,  // Deliberate animations (modals, drawers)
};
```

**Rationale for Values**:
- 150ms: Fast enough to feel responsive, slow enough to perceive
- 250ms: Sweet spot for most transitions (Material Design standard)
- 350ms: Deliberate without feeling sluggish
- Mathematical progression: 150 → 250 (+100) → 350 (+100)

**Note**: These values are preliminary based on Text Input Field needs. May expand with additional primitives (duration100, duration400, etc.) as more animation patterns emerge.

#### Easing Primitives (Fill What We Need)

```typescript
// EasingTokens.ts
export const easingTokens = {
  // Timing curves (cross-platform)
  easingStandard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',    // Material standard ← Need for Text Input
  easingDecelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',  // Elements entering
  easingAccelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',    // Elements exiting
  
  // Spring (iOS-native, approximated on other platforms) - Structure only, fill when needed
  easingSpring: {
    type: 'spring',
    response: 0.3,
    dampingFraction: 0.7
  }
};
```

**Rationale for Curves**:
- Standard: Balanced curve for most transitions
- Decelerate: Elements slow down as they enter (natural motion)
- Accelerate: Elements speed up as they exit (natural motion)
- Material Design curves chosen for cross-platform familiarity

**Spring Easing** (iOS-Specific):
- Native iOS spring animation (bouncy, natural feel)
- Approximated on web/Android with cubic-bezier overshoot
- Available for component-level override when iOS-native feel desired
- Structure documented but not implemented until needed

#### Delay Primitives (Structure Only - Fill Later)

```typescript
// DelayTokens.ts (structure only, don't implement yet)
export const delayTokens = {
  delay50: 50,    // For future stagger patterns
  delay100: 100,  // For future sequential animations
  delay200: 200,  // For future choreographed animations
};
```

**Rationale**: Delay tokens are for staggered/sequential animations (list items appearing one by one). We don't have these patterns yet, so we document the structure but don't implement until needed.

**What's Stagger?** Stagger is sequential animation with delay between items (e.g., list items fading in one by one with 50ms between each). We don't need this yet - it's a specialized pattern we can add when we have that use case.

### Semantic Motion Tokens (Compositional Layer)

Semantic motion tokens compose primitive duration, easing, and (optionally) delay values for specific use cases.

#### Fill Only What We Need Now

```typescript
// MotionTokens.ts
export const motionTokens = {
  'motion.floatLabel': {
    name: 'motion.floatLabel',
    primitiveReferences: {
      duration: 'duration250',
      easing: 'easingStandard'
    },
    category: SemanticCategory.MOTION,
    context: 'Float label animation for text inputs',
    description: 'Standard motion for label floating up with balanced easing (250ms, standard curve)'
  }
};
```

#### Structure for Future (Don't Fill Yet)

```typescript
// Future semantic motion tokens (document but don't implement)
'motion.hover': null          // Fill when hover animations emerge
'motion.fadeIn': null         // Fill when fade patterns emerge
'motion.slideIn': null        // Fill when slide patterns emerge
'motion.staggerList': null    // Fill when stagger patterns emerge (uses delay primitives)
```

**Rationale**: Only create semantic motion tokens when we have real use cases. Don't guess at what we'll need - let patterns emerge from actual component development.

---

## Accessibility Requirements

### Reduced Motion Support (WCAG 2.1 AA - REQUIRED)

**All motion tokens MUST respect user reduced motion preferences.** This is a WCAG 2.1 AA requirement and non-negotiable.

#### Web Implementation

```css
/* Default: animations enabled */
.input-label {
  transition: font-size var(--motion-float-label-duration) var(--motion-float-label-easing);
}

/* Reduced motion: disable animations */
@media (prefers-reduced-motion: reduce) {
  .input-label {
    transition: none;
  }
}
```

#### iOS Implementation

```swift
// Access reduced motion preference
@Environment(\.accessibilityReduceMotion) var reduceMotion

// Apply animation conditionally
Text(label)
    .font(isFloated ? typographyLabelMdFloat : typographyLabelMd)
    .animation(reduceMotion ? .none : MotionFloatLabel.easing)
```

#### Android Implementation

```kotlin
// Access reduced motion preference
val reduceMotion = LocalAccessibilityManager.current.isReduceMotionEnabled

// Apply animation conditionally
val animationSpec = if (reduceMotion) {
    snap()  // Instant, no animation
} else {
    tween(
        durationMillis = MotionFloatLabel.duration,
        easing = MotionFloatLabel.easing
    )
}

animateFloatAsState(
    targetValue = targetValue,
    animationSpec = animationSpec
)
```

**Implementation Requirement**: Every component using motion tokens MUST check reduced motion preference and disable animations when requested.

---

## Platform-Specific Considerations

### Cross-Platform Animation Consistency

**Goal**: Same timing and feel across web, iOS, and Android while respecting platform conventions.

#### Timing Curves vs Springs (iOS)

**Default Approach**: Use timing curves (cubic-bezier) on all platforms for mathematical consistency.

**iOS-Specific Override**: Components can use `easingSpring` for iOS-native feel:

```typescript
// Most components use timing curves
'motion.floatLabel': {
  primitiveReferences: {
    duration: 'duration250',
    easing: 'easingStandard'  // Timing curve
  }
}

// Component wanting iOS-native spring feel
'motion.bounceIn': {
  primitiveReferences: {
    duration: 'duration250',
    easing: 'easingSpring'  // Spring on iOS, approximated elsewhere
  }
}
```

**Platform Generation**:
- **iOS**: Native spring (`Animation.spring(response: 0.3, dampingFraction: 0.7)`)
- **Web**: Approximated with cubic-bezier overshoot (`cubic-bezier(0.5, 1.5, 0.5, 1)`)
- **Android**: Approximated with cubic-bezier overshoot (`CubicBezierEasing(0.5f, 1.5f, 0.5f, 1.0f)`)

#### Coordinated Timing (All Platforms)

**When multiple properties animate together** (font-size + color + position), use **same duration for all properties**:

- **iOS**: Animates entire view state changes holistically
- **Android**: Uses same `animationSpec` for all coordinated values
- **Web**: Uses same `transition` duration for all coordinated properties

**Avoid property-specific timing** (color 150ms, transform 250ms) - this is a web-specific micro-optimization that doesn't map well to iOS/Android animation models.

#### Platform API Choices

**We use modern, recommended APIs per platform**:
- **Web**: CSS transitions (not CSS animations, Web Animations API, or libraries)
- **iOS**: SwiftUI `.animation()` modifier (not UIKit animations or Core Animation)
- **Android**: Jetpack Compose `animate*AsState` (not View animations or Property animations)

**Rationale**: These are the modern, recommended APIs that align with True Native Architecture. We don't support legacy APIs.

---

## Performance Considerations

### Hardware Acceleration Trade-offs

**GPU-Accelerated Properties**:
- **Web**: `transform`, `opacity` (NOT: `font-size`, `color`, `width`, `height`)
- **iOS**: Most SwiftUI animations are GPU-accelerated by default
- **Android**: Jetpack Compose animations are GPU-accelerated by default

### Transform Scale Tokens (For GPU-Accelerated Animations)

**Scale Primitive Tokens**: For transform-based animations that need GPU acceleration while maintaining token system integrity.

```typescript
// ScaleTokens.ts
export const scaleTokens = {
  scale088: 0.88,  // Float label scale (16px × 0.88 = 14.08px → rounds to 14px)
  scale092: 0.92,  // Subtle scale down
  scale096: 0.96,  // Button press feedback
  scale100: 1.00,  // Default/reset state
  scale104: 1.04,  // Hover emphasis
  scale108: 1.08,  // Strong emphasis
};
```

**Rationale**:
- **Token-based values**: No hard-coded scale factors in components
- **GPU acceleration**: Transform animations are hardware-accelerated
- **Mathematical consistency**: Scale values follow logical progression
- **Cross-platform**: Same scale values work on web, iOS, Android

**Usage Pattern**:
```typescript
// Component tokens reference primitive scale tokens
labelFloat: {
  scale: 'scale088',  // References primitive token
  duration: 'duration250',
  easing: 'easingStandard'
}
```

**Platform Implementation**:
- **Web**: `transform: scale(var(--scale-088))`
- **iOS**: `.scaleEffect(scale088)`
- **Android**: `.scale(scale088f)`

**Why Scale Over Transform**: "Scale" describes the value (0.88 scale factor), not the CSS property. All platforms understand "scale" as a concept, making it platform-agnostic. The implementation uses platform-specific transform syntax, but the token name describes the value itself.

#### Scale Token Rounding (Token Generation Concern)

**Implementation Strategy**: Rounding to nearest whole number is handled by the **token generation system**, not by components.

**Where Rounding Happens**:
- **Token Generation** (build system): Applies rounding when generating platform-specific typography tokens
- **Components**: Consume pre-rounded values, no rounding logic needed

**Rationale**:
- **Separation of concerns**: Token system handles rounding, components just consume values
- **Consistency**: All platforms get same rounded values from single source of truth
- **Subpixel rendering**: Whole pixel values render consistently across browsers, iOS, Android
- **Predictable outcomes**: `scale088` × 16px = 14.08px → token generation rounds to 14px

**Example (Token Generation)**:
```typescript
// Token generation system (build system)
function generateTypographyToken(semanticToken) {
  const baseSize = primitiveTokens[semanticToken.fontSize];
  const scaledSize = Math.round(baseSize * scaleTokens.scale088);  // ✅ Round here
  
  return {
    fontSize: `${scaledSize}px`,  // Already rounded to 14px
    lineHeight: semanticToken.lineHeight,
    // ...
  };
}

// Generated output: typography.labelMdFloat has fontSize: 14px (already rounded)
```

**Component Usage** (no rounding needed):
```css
/* Web - component just uses generated token */
.label {
  font-size: var(--typography-label-md-float-font-size);  /* Already 14px */
}
```

```swift
// iOS - component just uses generated token
Text(label)
  .font(typographyLabelMdFloat)  // Already 14pt
```

```kotlin
// Android - component just uses generated token
Text(
  text = label,
  style = typographyLabelMdFloat  // Already 14sp
)
```

**Trade-offs**:
- ✅ **Gained**: Consistent rendering, single source of truth, components stay simple
- ❌ **Lost**: Sub-pixel precision (negligible for most use cases)
- ⚠️ **Note**: Cumulative rounding error possible at very large sizes (e.g., 32px × 0.88 = 28.16px → 28px)

**When Rounding Matters Most**:
- Typography scaling (font-size changes)
- Icon sizing (consistent pixel-aligned rendering)
- Component dimensions (avoid subpixel layout shifts)

**When Rounding Matters Less**:
- Transform animations (GPU-accelerated, subpixel precision acceptable)
- Opacity transitions (continuous values, no pixel alignment needed)

**Other Transform Capabilities** (documented for future expansion):
- **Translate tokens**: For slide animations (translateSm, translateMd, translateLg)
- **Rotate tokens**: For icon rotations (rotate090, rotate180, rotate045)
- **Opacity tokens**: Often combined with transforms (though separate from "transform")

**Current Scope**: Only scale tokens needed for float label animation. Translate/rotate tokens can be added when concrete use cases emerge.

#### Scale Token Rounding Approach

**Implementation Strategy**: Scale token values are applied with rounding to nearest whole number for consistent cross-platform rendering.

**Rationale**:
- **Subpixel rendering consistency**: Browsers, iOS, and Android handle subpixel rendering differently
- **Predictable outcomes**: Whole pixel values (14px) render consistently across all platforms
- **Mathematical clarity**: `scale088` × 16px = 14.08px → rounds to 14px (clear, predictable)
- **Cross-platform reliability**: Whole numbers work best across web, iOS, and Android

**Example**:
```typescript
// Scale token definition
scale088: 0.88

// Implementation (pseudo-code)
const scaledSize = Math.round(baseSize * scale088);
// 16px × 0.88 = 14.08px → rounds to 14px ✅
```

**Platform Implementation**:
- **Web**: `Math.round(baseFontSize * scale088)` before applying to CSS
- **iOS**: `round(baseFontSize * scale088)` before applying to SwiftUI
- **Android**: `round(baseFontSize * scale088)` before applying to Compose

**Trade-offs**:
- ✅ **Gained**: Consistent rendering, predictable outcomes, cross-platform reliability
- ❌ **Lost**: Sub-pixel precision (negligible for most use cases)
- ⚠️ **Note**: Cumulative rounding error possible at very large sizes (e.g., 32px × 0.88 = 28.16px → 28px)

**When Rounding Matters Most**:
- Typography scaling (font-size changes)
- Icon sizing (consistent pixel-aligned rendering)
- Component dimensions (avoid subpixel layout shifts)

**When Rounding Matters Less**:
- Transform animations (GPU-accelerated, subpixel precision acceptable)
- Opacity transitions (continuous values, no pixel alignment needed)

---

## Industry Comparison

### Material Design (Google)
**Approach**: Comprehensive from day one (8 durations, 4+ easings)
- ✅ Granular duration steps (50ms increments)
- ❌ No property-specific durations
- ❌ No delay or stagger tokens
- ❌ All tokens filled immediately (no incremental approach)

**Our Advantage**: More structured categories, incremental fill approach

### Atlassian Design System
**Approach**: Simple, semantic naming (instant/fast/medium/slow)
- ✅ Fewer tokens (4 durations, 3 easings)
- ❌ No property-specific durations
- ❌ No delay or stagger tokens
- ❌ Less granular than Material

**Our Advantage**: More comprehensive framework while maintaining simplicity

### Carbon Design System (IBM)
**Approach**: Paired durations (fast-01/02, moderate-01/02)
- ✅ Paired durations for variety
- ❌ Odd duration values (70ms, 110ms) - not mathematically consistent
- ❌ No property-specific, delay, or stagger tokens

**Our Advantage**: Mathematical consistency, explicit categories

### Polaris (Shopify)
**Approach**: Minimal (5 durations, minimal easings)
- ✅ Very simple (100ms increments)
- ❌ No easing tokens (uses CSS defaults)
- ❌ No property-specific, delay, or stagger tokens

**Our Advantage**: Much more comprehensive framework

**Key Insight**: No major design system uses "comprehensive framework, foundational fill" approach. This is unique to DesignerPunk and optimized for AI collaboration.

---

## Complete Token Structure (TypeScript)

### Primitive Tokens

```typescript
// src/tokens/DurationTokens.ts
/**
 * Duration Primitive Tokens
 * Base duration values in milliseconds for motion timing
 */
export const durationTokens: Record<string, number> = {
  duration150: 150,  // Fast interactions
  duration250: 250,  // Standard transitions
  duration350: 350,  // Deliberate animations
};

// src/tokens/EasingTokens.ts
/**
 * Easing Primitive Tokens
 * Cubic bezier curves for motion easing
 */
export const easingTokens: Record<string, string> = {
  easingStandard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',    // Material standard
  easingDecelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',  // Entering elements
  easingAccelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',    // Exiting elements
};

// src/tokens/ScaleTokens.ts (structure only - don't implement yet)
/**
 * Scale Primitive Tokens
 * Scale factor values for transform-based animations
 * 
 * Values follow 8-interval progression (0.88, 0.92, 0.96, 1.00, 1.04, 1.08)
 * aligned with 8px baseline grid philosophy.
 * 
 * Implementation applies rounding to nearest whole number for consistent
 * cross-platform rendering (e.g., 16px × 0.88 = 14.08px → rounds to 14px).
 * 
 * NOTE: Structure documented but not implemented until Text Input Field
 * design outline defines specific scale values needed for float label animation
 */
export const scaleTokens: Record<string, number> = {
  scale088: 0.88,  // Float label scale (16px × 0.88 = 14.08px → rounds to 14px)
  scale092: 0.92,  // Subtle scale down
  scale096: 0.96,  // Button press feedback
  scale100: 1.00,  // Default/reset state
  scale104: 1.04,  // Hover emphasis
  scale108: 1.08,  // Strong emphasis
};

// src/tokens/DelayTokens.ts (structure only - don't implement yet)
/**
 * Delay Primitive Tokens
 * Delay values in milliseconds for staggered/sequential animations
 * 
 * NOTE: Structure documented but not implemented until stagger patterns emerge
 */
export const delayTokens: Record<string, number> = {
  delay50: 50,    // Fast stagger
  delay100: 100,  // Normal stagger
  delay200: 200,  // Slow stagger
};
```

### Semantic Motion Tokens

```typescript
// src/tokens/semantic/MotionTokens.ts
import { SemanticToken, SemanticCategory } from '../../types/SemanticToken';

/**
 * Semantic Motion Token Definitions
 * 
 * Motion semantic tokens compose primitive duration, easing, and delay tokens
 * to create complete motion styles for specific use cases.
 * 
 * Each motion token explicitly defines motion properties using multi-primitive structure:
 * - duration: Animation duration in milliseconds
 * - easing: Cubic bezier easing curve
 * - delay: Optional delay before animation starts (for stagger patterns)
 * 
 * Pattern matches Shadow tokens (compose offsetX/offsetY/blur/opacity/color)
 * and Typography tokens (compose fontSize/lineHeight/fontWeight/etc)
 */

export const motionTokens: Record<string, Omit<SemanticToken, 'primitiveTokens'>> = {
  'motion.floatLabel': {
    name: 'motion.floatLabel',
    primitiveReferences: {
      duration: 'duration250',
      easing: 'easingStandard'
    },
    category: SemanticCategory.MOTION,
    context: 'Float label animation for text inputs',
    description: 'Standard motion for label floating up with balanced easing (250ms, standard curve)'
  }
  
  // Future semantic motion tokens (document but don't implement)
  // 'motion.hover': null          // Fill when hover animations emerge
  // 'motion.fadeIn': null         // Fill when fade patterns emerge
  // 'motion.slideIn': null        // Fill when slide patterns emerge
  // 'motion.staggerList': null    // Fill when stagger patterns emerge
};

/**
 * Array of all motion semantic token names for iteration
 */
export const motionTokenNames = Object.keys(motionTokens);

/**
 * Get motion semantic token by name
 */
export function getMotionToken(name: string): Omit<SemanticToken, 'primitiveTokens'> | undefined {
  return motionTokens[name];
}

/**
 * Get all motion semantic tokens as array
 */
export function getAllMotionTokens(): Array<Omit<SemanticToken, 'primitiveTokens'>> {
  return Object.values(motionTokens);
}
```

---

## Cross-Platform Generation

Motion tokens follow the same generation pattern as other semantic tokens - primitives are generated into platform-specific formats, then semantic tokens compose them.

### Web (CSS Custom Properties)

**Primitive Tokens**:
```css
/* Duration primitives */
--duration-150: 150ms;
--duration-250: 250ms;
--duration-350: 350ms;

/* Easing primitives */
--easing-standard: cubic-bezier(0.4, 0.0, 0.2, 1);
--easing-decelerate: cubic-bezier(0.0, 0.0, 0.2, 1);
--easing-accelerate: cubic-bezier(0.4, 0.0, 1, 1);
```

**Semantic Motion Token** (composed from primitives):
```css
/* motion.floatLabel composes duration250 + easingStandard */
--motion-float-label-duration: var(--duration-250);
--motion-float-label-easing: var(--easing-standard);

/* Usage in component */
.input-label {
  transition: font-size var(--motion-float-label-duration) var(--motion-float-label-easing);
}
```

### iOS (SwiftUI Constants)

**Primitive Tokens**:
```swift
// Duration primitives (TimeInterval = seconds)
let duration150: TimeInterval = 0.15
let duration250: TimeInterval = 0.25
let duration350: TimeInterval = 0.35

// Easing primitives (SwiftUI Animation curves)
let easingStandard = Animation.timingCurve(0.4, 0.0, 0.2, 1.0)
let easingDecelerate = Animation.timingCurve(0.0, 0.0, 0.2, 1.0)
let easingAccelerate = Animation.timingCurve(0.4, 0.0, 1.0, 1.0)
```

**Semantic Motion Token** (composed from primitives):
```swift
// motion.floatLabel composes duration250 + easingStandard
struct MotionFloatLabel {
    let duration = duration250
    let easing = easingStandard
}

// Usage in component
Text(label)
    .animation(MotionFloatLabel.easing.speed(1.0 / MotionFloatLabel.duration))
```

### Android (Jetpack Compose Constants)

**Primitive Tokens**:
```kotlin
// Duration primitives (milliseconds)
val Duration150 = 150
val Duration250 = 250
val Duration350 = 350

// Easing primitives (Compose Easing)
val EasingStandard = CubicBezierEasing(0.4f, 0.0f, 0.2f, 1.0f)
val EasingDecelerate = CubicBezierEasing(0.0f, 0.0f, 0.2f, 1.0f)
val EasingAccelerate = CubicBezierEasing(0.4f, 0.0f, 1.0f, 1.0f)
```

**Semantic Motion Token** (composed from primitives):
```kotlin
// motion.floatLabel composes Duration250 + EasingStandard
object MotionFloatLabel {
    val duration = Duration250
    val easing = EasingStandard
}

// Usage in component
animateFloatAsState(
    targetValue = targetValue,
    animationSpec = tween(
        durationMillis = MotionFloatLabel.duration,
        easing = MotionFloatLabel.easing
    )
)
```

**Platform Equivalence**: Same millisecond values across platforms, mathematically equivalent easing curves with platform-native syntax.

---

## Initial Use Case: Text Input Float Label

The Text Input Field component will be the first consumer of motion tokens:

**Animation Need**:
- Label transitions from `typography.labelMd` (16px) to `typography.labelMdFloat` (13px)
- Uses `motion.floatLabel` semantic token
- Composes `duration250` (250ms) + `easingStandard` (Material curve)

**Component Usage**:
```typescript
// Component references semantic motion token
const labelMotion = motionTokens['motion.floatLabel'];

// Web: Uses generated CSS custom properties
transition: font-size var(--motion-float-label-duration) var(--motion-float-label-easing);

// iOS: Uses generated Swift constants
.animation(MotionFloatLabel.easing.speed(1.0 / MotionFloatLabel.duration))

// Android: Uses generated Kotlin constants
animateFloatAsState(animationSpec = tween(MotionFloatLabel.duration, MotionFloatLabel.easing))
```

**Why This Validates the System**:
- Tests compositional pattern (semantic token composes primitives)
- Tests cross-platform generation (same motion, platform-specific syntax)
- Establishes pattern for future animated components
- Proves motion tokens work like Shadow/Typography tokens

---

## Open Questions

### 1. Property-Specific Motion Tokens
**Question**: If we need different timing for color vs transform animations, how do we handle that?

**Options**:
- Create property-specific primitives: `duration150Color`, `duration250Transform`
- Create property-specific semantic tokens: `motion.colorTransition`, `motion.transformTransition`
- Let components choose appropriate motion token

**Recommendation**: Create property-specific semantic motion tokens if pattern emerges (3+ components need same property-specific timing). Don't create property-specific primitives - that's too granular.

### 2. Platform-Specific Easing Adjustments
**Question**: Should easing curves be mathematically equivalent across platforms, or platform-native feel?

**Options**:
- Mathematical equivalence: Same cubic-bezier values everywhere
- Platform-native feel: Adjust curves to match platform conventions (iOS spring animations, Android Material motion)

**Recommendation**: Start with mathematical equivalence (same cubic-bezier values). Adjust if platform-specific feel is needed, but document why.

### 3. Delay Token Implementation
**Question**: When should we implement delay primitive tokens?

**Decision**: Wait for stagger/sequential animation patterns to emerge. Don't implement until we have real use case (e.g., list items animating in sequence).

### 4. Motion Token Generation
**Question**: Should motion tokens be generated by the build system like other tokens, or defined directly in platform code?

**Recommendation**: Generate via build system for consistency. Motion tokens are semantic tokens that should follow the same generation pattern as color, typography, spacing, shadow.

---

## Design Decisions

### Decision 1: Compositional Pattern (Like Shadow Tokens)

**Options Considered**:
1. Flat token structure (like Polaris: `motion.fast`, `motion.normal`, `motion.slow`)
2. Nested categories (like Material: `motion.duration.fast`, `motion.easing.standard`)
3. Compositional semantic tokens (like Shadow: compose primitives into semantic tokens)

**Decision**: Compositional semantic tokens

**Rationale**:
- Matches existing Shadow and Typography token patterns
- Semantic tokens have clear meaning (`motion.floatLabel` vs `motion.normal`)
- Primitives can be reused in different combinations
- Simpler than nested categories, more structured than flat tokens
- Industry-aligned (simpler approach) but maintains DesignerPunk's compositional architecture

**Trade-offs**:
- ✅ Gained: Consistency with existing patterns, semantic clarity, reusable primitives
- ❌ Lost: Simplicity of flat structure (but gained semantic meaning)
- ⚠️ Risk: Might need many semantic tokens (mitigated by only creating when patterns emerge)

### Decision 2: Material Design Easing Curves

**Options Considered**:
1. Material Design curves (industry standard)
2. Custom curves (brand-specific motion)
3. CSS defaults (ease, ease-in, ease-out)

**Decision**: Material Design curves

**Rationale**:
- Industry-proven curves that feel natural
- Cross-platform familiarity (developers know these curves)
- Well-documented and tested
- Can add custom curves later if brand needs emerge

**Trade-offs**:
- ✅ Gained: Proven curves, developer familiarity, cross-platform consistency
- ❌ Lost: Unique brand motion personality (can add later)

### Decision 3: Mathematical Duration Progression

**Options Considered**:
1. Linear progression (150, 250, 350 - +100ms steps)
2. Exponential progression (150, 250, 400 - increasing steps)
3. Material Design values (100, 200, 300, 400, 500)

**Decision**: Linear progression (150, 250, 350)

**Rationale**:
- Aligns with DesignerPunk's mathematical token foundation
- Simple, predictable progression
- 150ms is faster than Material's 200ms (feels more responsive)
- 350ms is slower than Material's 300ms (more deliberate)

**Trade-offs**:
- ✅ Gained: Mathematical consistency, responsive feel, deliberate slow animations
- ❌ Lost: Material Design familiarity for duration values
- ⚠️ Risk: 150ms might be too fast for some animations (can adjust if needed)

---

## Token Expansion Guidance

This section provides clear guidance for when and how to expand the motion token system as new animation patterns emerge.

### Expansion Philosophy

**Plan for expansion, implement on necessity** - We document the expansion pattern now so future development knows how to grow the system systematically.

### When to Create New Semantic Motion Tokens

#### Generic Motion Tokens (First Implementation)

**Create when**: First time implementing a new interaction type

**Naming Pattern**: `motion.{interactionType}`

**Examples**:
- `motion.hover` - First hover animation implementation
- `motion.fadeIn` - First fade-in animation implementation
- `motion.slideIn` - First slide-in animation implementation
- `motion.press` - First press/active state animation

**Decision Rule**: Start generic. Don't create component-specific tokens until pattern emerges.

#### Component-Specific Motion Tokens (Pattern Emerges)

**Create when**: 
- **3+ components** of same type need same timing
- **Clear differentiation** exists between component types (e.g., button hover vs container hover)
- **Semantic clarity** - component-specific name adds meaningful distinction

**Naming Pattern**: `motion.{interactionType}{ComponentType}`

**Examples**:
```typescript
// Generic (default)
'motion.hover': {
  primitiveReferences: {
    duration: 'duration150',  // Fast, snappy
    easing: 'easingStandard'
  },
  context: 'Default hover animation for interactive elements (buttons, links, inputs)'
}

// Component-specific (when pattern emerges)
'motion.hoverContainer': {
  primitiveReferences: {
    duration: 'duration250',  // Slower, more subtle
    easing: 'easingStandard'
  },
  context: 'Subtle hover animation for containers (cards, panels, surfaces)'
}

'motion.hoverSubtle': {
  primitiveReferences: {
    duration: 'duration350',  // Very slow, barely perceptible
    easing: 'easingStandard'
  },
  context: 'Very subtle hover for large surfaces and backgrounds'
}
```

**Decision Rule**: Only create component-specific when you have evidence that different component types need different timing. Don't create speculatively.

### Naming Conventions

**Use compound names** (not dot notation hierarchy):

✅ **Correct**:
- `motion.hover` (generic)
- `motion.hoverButton` (component-specific)
- `motion.hoverContainer` (component-specific)
- `motion.fadeInModal` (component-specific)

❌ **Incorrect**:
- `motion.hover.button` (too nested)
- `motion.hover.container` (too nested)
- `motion.button.hover` (wrong order)

**Rationale**: Matches existing token patterns (`typography.labelMd`, `shadow.container`) and keeps structure flat and scannable.

### Evolution Example

**Phase 1: First Implementation**
```typescript
// Implementing ButtonCTA hover
'motion.hover': { duration: 'duration150', easing: 'easingStandard' }

// ButtonCTA uses motion.hover
```

**Phase 2: Discover Nuance**
```typescript
// Container needs slower hover - create component-specific

'motion.hover': { duration: 'duration150' }           // Default (buttons, links, inputs)
'motion.hoverContainer': { duration: 'duration250' }  // Slower for containers
```

**Phase 3: Pattern Solidifies**
```typescript
// Multiple components follow clear patterns

'motion.hover': { duration: 'duration150' }           // Interactive elements (buttons, links, inputs)
'motion.hoverContainer': { duration: 'duration250' }  // Containers (cards, panels)
'motion.hoverSubtle': { duration: 'duration350' }     // Large surfaces (backgrounds, modals)
```

### Cross-Platform Considerations

**All motion tokens must work across web, iOS, and Android**:

**Coordinated Timing**: When multiple properties animate together (font-size + color + position), use **same duration for all properties**:
- ✅ iOS: Animates entire view state changes holistically
- ✅ Android: Uses same `animationSpec` for coordinated values
- ✅ Web: Uses same `transition` duration for coordinated properties

**Avoid property-specific timing** (color 150ms, transform 250ms) - this is a web-specific micro-optimization that doesn't map well to iOS/Android animation models.

### Pattern Matching Shadow Tokens

Motion tokens follow the same expansion pattern as Shadow tokens:

**Shadow Token Pattern**:
```typescript
'shadow.container'   // Component-specific
'shadow.modal'       // Component-specific
'shadow.dropdown'    // Component-specific
'shadow.hover'       // Generic interaction
```

**Motion Token Pattern** (same structure):
```typescript
'motion.floatLabel'     // Component-specific (text input)
'motion.hover'          // Generic interaction
'motion.hoverButton'    // Component-specific (when pattern emerges)
'motion.hoverContainer' // Component-specific (when pattern emerges)
```

### Decision Framework

Use this decision tree when considering new motion tokens:

```
Is this a new interaction type?
├─ YES → Create generic token (motion.{interaction})
└─ NO → Do 3+ components of same type need different timing?
    ├─ YES → Create component-specific token (motion.{interaction}{Component})
    └─ NO → Use existing generic token
```

**Examples**:

**Scenario 1**: Implementing first hover animation
- **Decision**: Create `motion.hover` (generic)
- **Rationale**: First implementation, no evidence of component-specific needs

**Scenario 2**: Container hover feels too fast with `motion.hover`
- **Decision**: Create `motion.hoverContainer` (component-specific)
- **Rationale**: Clear differentiation - containers need slower, more subtle hover

**Scenario 3**: Third button component needs hover
- **Decision**: Use existing `motion.hover`
- **Rationale**: No evidence that this button needs different timing than other buttons

### Documentation Requirements

When creating new motion tokens, document:

1. **Context**: What interaction/component is this for?
2. **Rationale**: Why does this need a separate token? (if component-specific)
3. **Cross-platform behavior**: How does this work on iOS/Android?
4. **Related tokens**: What other motion tokens are similar?

**Example**:
```typescript
'motion.hoverContainer': {
  name: 'motion.hoverContainer',
  primitiveReferences: {
    duration: 'duration250',
    easing: 'easingStandard'
  },
  category: SemanticCategory.MOTION,
  context: 'Subtle hover animation for containers (cards, panels, surfaces)',
  description: 'Slower than default hover (250ms vs 150ms) for more subtle elevation changes. Used when hover indicates elevation/depth rather than immediate interactivity.',
  relatedTokens: ['motion.hover', 'motion.hoverSubtle']
}
```

### Future Expansion Areas

**Documented for future reference** (don't implement until needed):

**Interaction Types**:
- `motion.press` - Active/pressed state animations
- `motion.focus` - Focus ring animations
- `motion.expand` - Accordion/disclosure animations
- `motion.collapse` - Closing/collapsing animations

**Entry/Exit Animations**:
- `motion.fadeIn` / `motion.fadeOut`
- `motion.slideIn` / `motion.slideOut`
- `motion.scaleIn` / `motion.scaleOut`

**Sequential Animations** (requires delay primitives):
- `motion.staggerList` - List items appearing in sequence
- `motion.staggerGrid` - Grid items appearing in sequence

**Component-Specific Variants** (create when pattern emerges):
- `motion.hoverButton` / `motion.hoverContainer` / `motion.hoverSubtle`
- `motion.fadeInModal` / `motion.fadeInTooltip` / `motion.fadeInToast`

---

## Next Steps

1. **Create formal requirements** - Convert this outline into EARS-formatted requirements
2. **Design token structure** - Detailed TypeScript interfaces and generation strategy
3. **Implement foundational tokens** - duration150/250/350, easingStandard/Decelerate/Accelerate
4. **Implement initial semantic token** - `motion.floatLabel` for Text Input Field
5. **Integrate with Text Input Field** - Use motion tokens for float label transition
6. **Document in Component Development Guide** - Add motion token guidance for future components

---

## Observations

**Compositional pattern is consistent**: Motion tokens follow the same pattern as Shadow and Typography tokens. This consistency makes the system easier to understand and use.

**Simpler than initially thought**: The industry's simpler approach (Atlassian, Polaris) is more appropriate than complex nested categories. We don't need property-specific, delay, and stagger categories upfront.

**Semantic tokens provide clarity**: `motion.floatLabel` is much clearer than `animation.duration.normal`. Semantic naming shows intent, not just values.

**Mathematical consistency matters**: Duration progression (150, 250, 350) aligns with DesignerPunk's mathematical token foundation. This isn't arbitrary - it's systematic.

**Platform equivalence is achievable**: Same millisecond values work across web/iOS/Android. Platform-specific syntax, but mathematically equivalent timing.

**Fill incrementally works**: We only need `motion.floatLabel` now. Other semantic motion tokens (`motion.hover`, `motion.fadeIn`) can wait until patterns emerge.

---

**Organization**: spec-guide  
**Scope**: 014-motion-token-system
