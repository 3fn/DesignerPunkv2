# Token Output Patterns Documentation

**Date**: December 28, 2025
**Task**: 2.2 Document token output patterns
**Spec**: 024 - Blend Token Infrastructure Audit
**Phase**: 2 - Current System Assessment

---

## Overview

This document catalogs the token output patterns for all three platforms (web, iOS, Android), with specific focus on how blend tokens are output compared to other token families, and whether runtime utilities are generated.

---

## Platform Output Patterns

### Web Output Pattern (CSS Custom Properties)

**File**: `dist/DesignTokens.web.css`
**Format**: CSS custom properties with `var()` references

#### Primitive Token Pattern

```css
/* Primitive tokens use direct values */
--blend-100: 0.04;
--blend-200: 0.08;
--blend-300: 0.12;
--blend-400: 0.16;
--blend-500: 0.2;

/* Opacity follows same pattern */
--opacity-000: 0;
--opacity-100: 0.08;
--opacity-200: 0.15;
/* ... */
```

#### Semantic Token Pattern

```css
/* Semantic tokens reference primitives via var() */
--blend-hover-darker: var(--blend-200);
--blend-hover-lighter: var(--blend-200);
--blend-pressed-darker: var(--blend-300);
--blend-focus-saturate: var(--blend-200);
--blend-disabled-desaturate: var(--blend-300);
--blend-container-hover-darker: var(--blend-100);

/* Opacity semantics follow same pattern */
--opacity-subtle: var(--opacity-1100);
--opacity-medium: var(--opacity-900);
--opacity-heavy: var(--opacity-600);
--opacity-ghost: var(--opacity-400);
```

#### Key Characteristics

| Aspect | Pattern |
|--------|---------|
| Naming | kebab-case (`--blend-hover-darker`) |
| Primitives | Direct numeric values |
| Semantics | `var()` references to primitives |
| Units | Unitless (opacity/blend values) |
| Runtime utilities | ❌ Not included |

---

### iOS Output Pattern (Swift Constants)

**File**: `dist/DesignTokens.ios.swift`
**Format**: Swift static constants with direct value references

#### Primitive Token Pattern

```swift
// Primitive tokens use CGFloat values
public static let blend100: CGFloat = 0.04
public static let blend200: CGFloat = 0.08
public static let blend300: CGFloat = 0.12
public static let blend400: CGFloat = 0.16
public static let blend500: CGFloat = 0.2

// Opacity follows same pattern
public static let opacity000: CGFloat = 0
public static let opacity100: CGFloat = 0.08
public static let opacity200: CGFloat = 0.15
// ...
```

#### Semantic Token Pattern

```swift
// Semantic tokens reference primitives directly (no var())
public static let blendHoverDarker = blend200
public static let blendHoverLighter = blend200
public static let blendPressedDarker = blend300
public static let blendFocusSaturate = blend200
public static let blendDisabledDesaturate = blend300
public static let blendContainerHoverDarker = blend100

// Opacity semantics follow same pattern
public static let opacitySubtle = opacity1100
public static let opacityMedium = opacity900
public static let opacityHeavy = opacity600
public static let opacityGhost = opacity400
```

#### Key Characteristics

| Aspect | Pattern |
|--------|---------|
| Naming | camelCase (`blendHoverDarker`) |
| Primitives | `CGFloat` typed values |
| Semantics | Direct constant references |
| Units | Unitless (CGFloat) |
| Runtime utilities | ❌ Not included |

---

### Android Output Pattern (Kotlin Constants)

**File**: `dist/DesignTokens.android.kt`
**Format**: Kotlin const vals with direct value references

#### Primitive Token Pattern

```kotlin
// Primitive tokens use Float values with 'f' suffix
const val blend_100: Float = 0.04f
const val blend_200: Float = 0.08f
const val blend_300: Float = 0.12f
const val blend_400: Float = 0.16f
const val blend_500: Float = 0.2f

// Opacity follows same pattern
const val opacity_000: Float = 0f
const val opacity_100: Float = 0.08f
const val opacity_200: Float = 0.15f
// ...
```

#### Semantic Token Pattern

```kotlin
// Semantic tokens reference primitives directly
val blend_hover_darker = blend_200
val blend_hover_lighter = blend_200
val blend_pressed_darker = blend_300
val blend_focus_saturate = blend_200
val blend_disabled_desaturate = blend_300
val blend_container_hover_darker = blend_100

// Opacity semantics follow same pattern
val opacity_subtle = opacity_1100
val opacity_medium = opacity_900
val opacity_heavy = opacity_600
val opacity_ghost = opacity_400
```

#### Key Characteristics

| Aspect | Pattern |
|--------|---------|
| Naming | snake_case (`blend_hover_darker`) |
| Primitives | `const val` with `Float` type |
| Semantics | `val` references to primitives |
| Units | Unitless (Float with `f` suffix) |
| Runtime utilities | ❌ Not included |

---

## Runtime Utility Status

### What Exists in Build Output

| Component | Location | Platform | Status |
|-----------|----------|----------|--------|
| BlendCalculator | `dist/blend/BlendCalculator.js` | JavaScript only | ✅ Exists |
| ColorSpaceUtils | `dist/blend/ColorSpaceUtils.js` | JavaScript only | ✅ Exists |
| BlendTokens | `dist/tokens/BlendTokens.js` | JavaScript only | ✅ Exists |

### What's NOT in Generated Platform Files

| Component | Web CSS | iOS Swift | Android Kotlin |
|-----------|---------|-----------|----------------|
| Blend calculation functions | ❌ | ❌ | ❌ |
| Color manipulation utilities | ❌ | ❌ | ❌ |
| Hex/RGB conversion | ❌ | ❌ | ❌ |
| HSL saturation utilities | ❌ | ❌ | ❌ |

### BlendCalculator Capabilities (JavaScript Only)

The `BlendCalculator` in `dist/blend/` provides:

```javascript
// Available functions
calculateBlend(baseColor, blendToken, direction)
// Directions: DARKER, LIGHTER, SATURATE, DESATURATE

// Example usage
const darker = calculateBlend("#A855F7", blend200Token, BlendDirection.DARKER);
// Returns: "#9A4EE3"
```

**Key limitation**: These utilities exist only in JavaScript. iOS and Android have no equivalent runtime utilities in the generated output.

---

## Comparison: Blend vs Other Token Families

### Opacity Tokens

| Aspect | Opacity | Blend |
|--------|---------|-------|
| Primitives in output | ✅ Yes | ✅ Yes |
| Semantics in output | ✅ Yes | ✅ Yes |
| Runtime utilities needed | ❌ No | ✅ Yes |
| Runtime utilities generated | N/A | ❌ No |

**Why opacity doesn't need runtime utilities**: Opacity is a simple multiplier applied directly to elements via CSS `opacity`, Swift `.opacity()`, or Kotlin `alpha`. No calculation required.

**Why blend needs runtime utilities**: Blend requires color calculation:
```
baseColor + blendDirection + blendAmount → calculatedColor
```

### Color Tokens

| Aspect | Color | Blend |
|--------|-------|-------|
| Primitives in output | ✅ Yes | ✅ Yes |
| Semantics in output | ✅ Yes | ✅ Yes |
| Runtime utilities needed | ❌ No | ✅ Yes |
| Runtime utilities generated | N/A | ❌ No |

**Why color doesn't need runtime utilities**: Colors are static values. Components reference color tokens directly without calculation.

### Shadow Tokens

| Aspect | Shadow | Blend |
|--------|--------|-------|
| Primitives in output | ✅ Yes | ✅ Yes |
| Semantics in output | ✅ Yes (composed) | ✅ Yes |
| Runtime utilities needed | ❌ No | ✅ Yes |
| Runtime utilities generated | N/A | ❌ No |

**Why shadow doesn't need runtime utilities**: Shadows are composed from primitives at build time. The semantic shadow token contains all values needed.

---

## KEY FINDING: Is the Gap Unique to Blends?

### Answer: The pattern is systemic, but the NEED is unique to blends

**Systemic pattern**: No token family has runtime utilities generated in platform files. All token families output:
- Primitive values
- Semantic references to primitives

**Unique to blends**: Blend tokens are the ONLY token family that requires runtime calculation to be useful:

| Token Family | Requires Runtime Calculation | Has Runtime Utilities |
|--------------|------------------------------|----------------------|
| Spacing | ❌ No | N/A |
| Color | ❌ No | N/A |
| Opacity | ❌ No | N/A |
| Shadow | ❌ No | N/A |
| Typography | ❌ No | N/A |
| **Blend** | ✅ **Yes** | ❌ **No** |

### Why Blend is Different

Other token families are **static values** that can be applied directly:
- `color.primary` → Apply as background color
- `opacity.heavy` → Apply as opacity value
- `shadow.container` → Apply as shadow definition

Blend tokens are **calculation parameters** that require a function:
- `blend.hoverDarker` → Need: `darken(color.primary, blend.hoverDarker)`

The blend token value (0.08) is meaningless without:
1. A base color to modify
2. A direction (darker, lighter, saturate, desaturate)
3. A function to perform the calculation

---

## Platform-Specific Considerations

### Web: Modern CSS Alternative

CSS `color-mix()` function (supported in modern browsers) could potentially replace runtime utilities:

```css
/* Theoretical usage */
.button:hover {
  background-color: color-mix(in srgb, var(--color-primary), black var(--blend-hover-darker));
}
```

**Status**: Not currently implemented in DesignerPunk.

### iOS: SwiftUI Color Modifiers

SwiftUI provides color manipulation methods:

```swift
// Theoretical usage
Color.primary.opacity(1 - blendHoverDarker) // Approximation
```

**Status**: No direct equivalent for blend operations. Would require custom Color extension.

### Android: Compose Color Utilities

Jetpack Compose provides some color utilities:

```kotlin
// Theoretical usage
Color.primary.copy(alpha = 1f - blend_hover_darker) // Approximation
```

**Status**: No direct equivalent for blend operations. Would require custom extension functions.

---

## Summary

| Aspect | Status | Notes |
|--------|--------|-------|
| Web primitives | ✅ In output | CSS custom properties |
| Web semantics | ✅ In output | `var()` references |
| iOS primitives | ✅ In output | Swift CGFloat constants |
| iOS semantics | ✅ In output | Direct constant references |
| Android primitives | ✅ In output | Kotlin Float constants |
| Android semantics | ✅ In output | Direct val references |
| Runtime utilities (any platform) | ❌ Not in generated files | Only in `dist/blend/` (JS) |
| Gap unique to blends? | ⚠️ Pattern systemic, need unique | Only blend requires runtime calculation |

**The gap is NOT in token output - it's in the bridge from token values to component consumption. Blend tokens output correctly, but components have no way to USE them without runtime utilities.**

---

*This document fulfills Task 2.2 requirements for documenting token output patterns.*
