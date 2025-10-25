# Shadow Lighting Framework

**Date**: October 23, 2025
**Purpose**: Document the conceptual lighting model that informs shadow token design
**Organization**: spec-guide
**Scope**: shadow-glow-token-system

---

## Overview

The Shadow Lighting Framework provides conceptual guidance for creating realistic, consistent shadows across the DesignerPunk design system. The framework is inspired by natural lighting principles—specifically, how the sun's position throughout the day affects shadow direction, length, and quality.

This framework translates real-world lighting concepts into mathematical primitives that can be composed into semantic shadow tokens and translated across web, iOS, and Android platforms.

---

## Core Concepts

### 1. Light Source Position (Sun Arc)

The sun's position throughout the day determines shadow direction and length. We model five key positions that represent the full arc of the sun from sunrise to sunset.

#### Sunrise (Low Angle from Left)

**Time**: Early morning, sun rising in the east
**Light Characteristics**:
- Low angle (15-30° above horizon)
- Light comes from the left side
- Creates long, dramatic shadows

**Shadow Behavior**:
- Shadows fall to the **left** (negative offsetX)
- Shadows fall **down** (positive offsetY)
- Long shadow length due to low angle

**Primitive Mapping**:
```typescript
offsetX: -12 to -8  // Shadow falls left
offsetY: 16 to 12   // Long shadow (low angle)
```

**Use Cases**:
- Dramatic, directional emphasis
- Cinematic or artistic effects
- Left-side lighting scenarios

#### Morning (Medium Angle from Left)

**Time**: Mid-morning, sun rising higher
**Light Characteristics**:
- Medium angle (30-45° above horizon)
- Light comes from the left side
- Creates moderate shadows

**Shadow Behavior**:
- Shadows fall to the **left** (negative offsetX)
- Shadows fall **down** (positive offsetY)
- Medium shadow length

**Primitive Mapping**:
```typescript
offsetX: -6 to -4   // Shadow falls left
offsetY: 12 to 8    // Medium shadow
```

**Use Cases**:
- Balanced directional lighting
- Natural morning atmosphere
- Left-side accent lighting

#### Noon (Overhead)

**Time**: Midday, sun directly overhead
**Light Characteristics**:
- High angle (80-90° above horizon)
- Light comes from directly above
- Creates short, subtle shadows

**Shadow Behavior**:
- Shadows fall **straight down** (offsetX = 0)
- Shadows fall **down** (positive offsetY)
- Short shadow length due to high angle

**Primitive Mapping**:
```typescript
offsetX: 0          // No horizontal offset
offsetY: 4 to 8     // Short shadow (high angle)
```

**Use Cases**:
- Standard UI shadows (cards, buttons, modals)
- Neutral, non-directional lighting
- Most common shadow scenario

#### Dusk (Medium Angle from Right)

**Time**: Mid-afternoon to early evening, sun descending
**Light Characteristics**:
- Medium angle (30-45° above horizon)
- Light comes from the right side
- Creates moderate shadows

**Shadow Behavior**:
- Shadows fall to the **right** (positive offsetX)
- Shadows fall **down** (positive offsetY)
- Medium shadow length

**Primitive Mapping**:
```typescript
offsetX: 4 to 6     // Shadow falls right
offsetY: 8 to 12    // Medium shadow
```

**Use Cases**:
- Balanced directional lighting
- Natural dusk atmosphere
- Right-side accent lighting

#### Sunset (Low Angle from Right)

**Time**: Late afternoon/evening, sun setting in the west
**Light Characteristics**:
- Low angle (15-30° above horizon)
- Light comes from the right side
- Creates long, dramatic shadows

**Shadow Behavior**:
- Shadows fall to the **right** (positive offsetX)
- Shadows fall **down** (positive offsetY)
- Long shadow length due to low angle

**Primitive Mapping**:
```typescript
offsetX: 8 to 12    // Shadow falls right
offsetY: 12 to 16   // Long shadow (low angle)
```

**Use Cases**:
- Dramatic, directional emphasis
- Cinematic or artistic effects
- Right-side lighting scenarios

---

### 2. Shadow Quality

Shadow quality describes the sharpness or softness of shadow edges, determined by light characteristics and atmospheric conditions.

#### Hard Shadows

**Light Characteristics**:
- Direct, focused light source
- Clear atmospheric conditions
- Close light source (relative to object size)

**Visual Characteristics**:
- Sharp, well-defined edges
- High contrast between lit and shadowed areas
- Darker shadow opacity

**Primitive Mapping**:
```typescript
blur: 4px           // Minimal blur for sharp edges
opacity: 0.4        // Darker for higher contrast
```

**Use Cases**:
- Floating action buttons
- High-emphasis elements
- Dramatic depth effects
- Direct sunlight scenarios

**Real-World Examples**:
- Shadow cast by object in direct sunlight
- Shadow under bright desk lamp
- Shadow in clear, cloudless conditions

#### Moderate Shadows

**Light Characteristics**:
- Balanced lighting conditions
- Typical indoor or outdoor lighting
- Standard atmospheric conditions

**Visual Characteristics**:
- Balanced edge definition
- Moderate contrast
- Standard shadow opacity

**Primitive Mapping**:
```typescript
blur: 12px          // Balanced blur
opacity: 0.3        // Moderate opacity
```

**Use Cases**:
- Standard UI elements (cards, panels, dropdowns)
- Most common shadow scenario
- Balanced depth perception

**Real-World Examples**:
- Shadow cast by object in typical indoor lighting
- Shadow on partly cloudy day
- Shadow in standard office environment

#### Soft Shadows

**Light Characteristics**:
- Diffuse, scattered light source
- Overcast or hazy atmospheric conditions
- Distant light source (relative to object size)

**Visual Characteristics**:
- Diffuse, gentle edges
- Low contrast
- Lighter shadow opacity

**Primitive Mapping**:
```typescript
blur: 20px          // High blur for soft edges
opacity: 0.2        // Lighter for subtle effect
```

**Use Cases**:
- Hover states
- Subtle depth hints
- Ambient, atmospheric effects
- Overcast day scenarios

**Real-World Examples**:
- Shadow cast by object on overcast day
- Shadow under diffuse ceiling lighting
- Shadow in foggy or hazy conditions

---

### 3. Depth (Distance from Surface)

Depth represents how far an element is from the surface behind it. Greater depth creates larger, softer shadows as the shadow "spreads out" over distance.

#### Depth 100 (Close to Surface)

**Physical Relationship**:
- Element is close to the surface (1-2cm in real world)
- Shadow is tight and well-defined
- Minimal shadow spread

**Shadow Characteristics**:
- Small offset values (1× scale)
- Base blur values
- Standard opacity

**Primitive Mapping**:
```typescript
offsetScale: 1×     // Base offset values
blurScale: 1×       // Base blur values
opacity: 0.3        // Standard opacity
```

**Use Cases**:
- Cards on page surface
- Buttons in default state
- Standard UI elements

**Real-World Examples**:
- Paper lying flat on desk
- Sticker on wall
- Thin object close to surface

#### Depth 200 (Raised)

**Physical Relationship**:
- Element is raised from surface (2-5cm in real world)
- Shadow is larger and slightly softer
- Moderate shadow spread

**Shadow Characteristics**:
- Medium offset values (2× scale)
- Increased blur values
- Slightly darker opacity

**Primitive Mapping**:
```typescript
offsetScale: 2×     // Double offset values
blurScale: 1.33×    // 33% more blur
opacity: 0.35       // Slightly darker
```

**Use Cases**:
- Modals and dialogs
- Elevated panels
- Hover states (raised effect)

**Real-World Examples**:
- Book standing on desk
- Raised platform
- Object held slightly above surface

#### Depth 300 (Floating)

**Physical Relationship**:
- Element is floating above surface (5-10cm in real world)
- Shadow is large and soft
- Significant shadow spread

**Shadow Characteristics**:
- Large offset values (3× scale)
- Significantly increased blur
- Darker opacity (more separation)

**Primitive Mapping**:
```typescript
offsetScale: 3×     // Triple offset values
blurScale: 2×       // Double blur values
opacity: 0.4        // Darker for emphasis
```

**Use Cases**:
- Floating action buttons
- Tooltips and popovers
- Highest-emphasis elements

**Real-World Examples**:
- Drone hovering above ground
- Balloon floating above surface
- Object suspended in air

---

## Combining Concepts

The framework's power comes from combining light position, shadow quality, and depth to create specific shadow effects.

### Example 1: Standard Card Shadow

**Concept**:
- Light: Noon (overhead, neutral)
- Quality: Moderate (balanced definition)
- Depth: 100 (close to surface)

**Primitive Values**:
```typescript
offsetX: 0          // Noon = no horizontal offset
offsetY: 4          // Depth 100 = small offset
blur: 12            // Moderate = balanced blur
opacity: 0.3        // Moderate = balanced opacity
```

**Result**: Subtle, neutral shadow that conveys slight elevation without drawing attention.

### Example 2: Dramatic Floating Button

**Concept**:
- Light: Sunset (low angle from right)
- Quality: Hard (sharp definition)
- Depth: 300 (floating)

**Primitive Values**:
```typescript
offsetX: 12         // Sunset = right offset
offsetY: 16         // Depth 300 = large offset
blur: 4             // Hard = minimal blur
opacity: 0.4        // Hard = darker shadow
```

**Result**: Dramatic, directional shadow that emphasizes floating state and creates visual interest.

### Example 3: Subtle Hover Effect

**Concept**:
- Light: Noon (overhead, neutral)
- Quality: Soft (gentle definition)
- Depth: 100 (close to surface)

**Primitive Values**:
```typescript
offsetX: 0          // Noon = no horizontal offset
offsetY: 4          // Depth 100 = small offset
blur: 20            // Soft = high blur
opacity: 0.2        // Soft = lighter opacity
```

**Result**: Gentle, ambient shadow that hints at elevation without strong visual emphasis.

### Example 4: Morning Panel

**Concept**:
- Light: Morning (medium angle from left)
- Quality: Soft (gentle definition)
- Depth: 100 (close to surface)

**Primitive Values**:
```typescript
offsetX: -6         // Morning = left offset
offsetY: 12         // Medium angle = moderate offset
blur: 20            // Soft = high blur
opacity: 0.2        // Soft = lighter opacity
```

**Result**: Directional but subtle shadow that creates atmosphere and visual interest.

---

## Design Principles

### 1. Physical Grounding

The framework is grounded in real-world lighting physics:
- Light angle determines shadow direction and length
- Light quality determines shadow sharpness
- Object distance determines shadow size and softness

This physical grounding makes shadows feel natural and intuitive.

### 2. Conceptual Clarity

The framework uses natural concepts (sunrise, noon, sunset) rather than technical terms (angle degrees, lux values). This makes the system:
- Easier to understand for designers
- Easier to communicate between team members
- Easier for AI agents to reason about

### 3. Mathematical Consistency

Despite using natural concepts, the framework translates to precise mathematical primitives:
- All offset values align to 4px subgrid
- Blur values follow consistent progression
- Opacity values have clear relationships

This ensures shadows remain mathematically consistent while feeling natural.

### 4. Strategic Flexibility

The framework provides preferred patterns (noon lighting, moderate quality) while allowing strategic flexibility:
- Sunrise/sunset for dramatic effects
- Hard/soft quality for emphasis or subtlety
- Off-grid values when visual quality demands it

The goal is "mostly consistent with intentional variation," not rigid perfection.

---

## Future Enhancements

### Dynamic Time-Based Shadows

The sun arc framework enables future dynamic shadow systems:

```typescript
// Concept: Shadows change based on actual time of day
const hour = new Date().getHours();
let lightPosition;

if (hour >= 5 && hour < 8) lightPosition = 'sunrise';
else if (hour >= 8 && hour < 11) lightPosition = 'morning';
else if (hour >= 11 && hour < 14) lightPosition = 'noon';
else if (hour >= 14 && hour < 17) lightPosition = 'dusk';
else if (hour >= 17 && hour < 20) lightPosition = 'sunset';
else lightPosition = 'noon'; // Default for night

// Apply appropriate shadow based on time
element.style.boxShadow = getShadowForTime(lightPosition, depth, quality);
```

This would create interfaces that respond to real-world time, enhancing immersion and atmosphere.

### Seasonal Variations

Different seasons could affect shadow characteristics:
- Summer: Higher sun angle, shorter shadows
- Winter: Lower sun angle, longer shadows
- Spring/Fall: Moderate angles

### Weather-Based Shadows

Weather conditions could affect shadow quality:
- Clear: Hard shadows
- Partly cloudy: Moderate shadows
- Overcast: Soft shadows
- Foggy: Very soft, diffuse shadows

---

## Relationship to Token System

This lighting framework is **conceptual guidance** that informs **primitive token values**:

**Framework Concepts** → **Primitive Tokens** → **Semantic Tokens**

```typescript
// Framework concept:
"Noon light, moderate quality, depth 100"

// Translates to primitives:
offsetX: shadowOffsetX000 (0)
offsetY: shadowOffsetY100 (4)
blur: shadowBlurModerate (12)
opacity: shadowOpacityModerate (0.3)

// Composed into semantic token:
shadow.card = {
  offsetX: shadowOffsetX000,
  offsetY: shadowOffsetY100,
  blur: shadowBlurModerate,
  spread: shadowSpread000,
  opacity: shadowOpacityModerate,
  color: shadowColor
}
```

The framework provides the "why" behind token values, making the system understandable and maintainable.

---

## Related Documentation

- [Requirements Document](./requirements.md) - Formal requirements for shadow and glow token system
- [Shadow Model Demo](../../shadow-model-demo.html) - Interactive visual demonstration of lighting framework
- [Design Document](./design.md) - Technical implementation of shadow token system (to be created)

---

*This lighting framework provides conceptual foundations for creating realistic, consistent shadows inspired by natural lighting principles. The framework translates real-world concepts into mathematical primitives that maintain cross-platform consistency while feeling natural and intuitive.*
