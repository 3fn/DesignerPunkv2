# Generator Patterns Documentation

**Date**: December 28, 2025
**Task**: 2.1 Document generator patterns
**Spec**: 024 - Blend Token Infrastructure Audit
**Phase**: 2 - Current System Assessment

---

## Overview

This document catalogs the generator patterns in the DesignerPunk token system, with specific focus on how blend tokens integrate compared to other token families.

---

## Generator Directory Structure

```
src/generators/
├── __tests__/
│   ├── AccessibilityTokenGeneration.test.ts
│   ├── BlendUtilityGenerator.test.ts
│   ├── BlendValueGenerator.test.ts
│   ├── BreakpointTokenGeneration.test.ts
│   ├── GridSpacingTokenGeneration.test.ts
│   ├── IconTokenGeneration.test.ts
│   ├── ResponsiveGridGeneration.test.ts
│   └── TokenFileGenerator.test.ts
├── BlendUtilityGenerator.ts      # Generates runtime blend utility functions
├── BlendValueGenerator.ts        # Generates blend value constants
├── generateTokenFiles.ts         # Main entry point for token generation
├── ResponsiveGridGenerator.ts    # Responsive grid token generation
└── TokenFileGenerator.ts         # Unified generator orchestrator
```

---

## Unified Generator Architecture

### TokenFileGenerator (Orchestrator)

The `TokenFileGenerator` class is the **unified generator** that orchestrates platform-specific token file generation.

**Location**: `src/generators/TokenFileGenerator.ts`

**Key Responsibilities**:
1. Generates platform-specific token files (web, iOS, Android)
2. Coordinates primitive and semantic token generation
3. Validates cross-platform consistency
4. Handles special token types (icons, motion, layering)

**Generation Flow**:
```
TokenFileGenerator.generateAll()
    ├── generateWebTokens()     → DesignTokens.web.css
    ├── generateiOSTokens()     → DesignTokens.ios.swift
    └── generateAndroidTokens() → DesignTokens.android.kt
```

### Platform-Specific Format Generators

Each platform has a dedicated format generator in `src/providers/`:

| Platform | Generator | Output Format |
|----------|-----------|---------------|
| Web | `WebFormatGenerator` | CSS custom properties |
| iOS | `iOSFormatGenerator` | Swift constants |
| Android | `AndroidFormatGenerator` | Kotlin constants |

**Base Interface**: `FormatProvider` defines the contract:
- `formatToken()` - Format individual token
- `generateHeader()` / `generateFooter()` - File structure
- `validateSyntax()` - Platform-specific validation
- `getTokenName()` - Platform naming conventions

---

## Token Integration Patterns

### Pattern 1: Primitive Token Integration

**How it works**: Primitive tokens are collected via `getAllPrimitiveTokens()` and formatted by platform generators.

**Token families using this pattern**:
- Spacing, FontSize, FontWeight, LineHeight, LetterSpacing
- Radius, Color, BorderWidth, Opacity
- Shadow (offset, blur, opacity), Glow (blur, opacity)
- **Blend** (blend100-blend500)

**Build output**: ✅ All primitive tokens appear in generated files

**Example (blend tokens in output)**:
```css
/* Web: DesignTokens.web.css */
--blend-100: 0.04;
--blend-200: 0.08;
--blend-300: 0.12;
--blend-400: 0.16;
--blend-500: 0.2;
```

### Pattern 2: Semantic Token Integration

**How it works**: Semantic tokens are collected via `getAllSemanticTokens()` and formatted with primitive references.

**Token families using this pattern**:
- Typography (references fontSize, lineHeight, fontFamily, fontWeight, letterSpacing)
- Shadow (references offsetX, offsetY, blur, opacity, color)
- Opacity (semantic aliases like opacityHeavy, opacityGhost)
- **Blend** (semantic aliases like blendHoverDarker, blendFocusSaturate)

**Build output**: ✅ Semantic blend tokens appear in generated files

**Example (semantic blend tokens in output)**:
```css
/* Web: DesignTokens.web.css */
--blend-hover-darker: var(--blend-200);
--blend-hover-lighter: var(--blend-200);
--blend-pressed-darker: var(--blend-300);
--blend-focus-saturate: var(--blend-200);
--blend-disabled-desaturate: var(--blend-300);
--blend-container-hover-darker: var(--blend-100);
```

### Pattern 3: Special Token Handling

**How it works**: Some token types require special generation logic:

| Token Type | Special Handling | Generator Method |
|------------|------------------|------------------|
| Icon sizes | fontSize × multiplier calculation | `generateIconSizeToken()` |
| Motion | Duration, easing, scale primitives + semantic | `generateMotionSection()` |
| Layering | Z-index (web/iOS) vs Elevation (Android) | `generateLayeringSection()` |

**Blend tokens**: No special handling required - use standard primitive/semantic patterns.

---

## Blend-Specific Generators

### BlendValueGenerator

**Location**: `src/generators/BlendValueGenerator.ts`

**Purpose**: Generates blend value constants for all platforms.

**Output Format**:
```typescript
// Web
export const BlendTokens = {
  blend100: 0.04,
  blend200: 0.08,
  // ...
};

// iOS
struct BlendTokens {
  static let blend100: Double = 0.04
  static let blend200: Double = 0.08
  // ...
}

// Android
object BlendTokens {
  const val blend100 = 0.04f
  const val blend200 = 0.08f
  // ...
}
```

**Integration Status**: ⚠️ **ORPHANED** - This generator exists but is NOT called by TokenFileGenerator. Blend values are instead generated through the standard primitive token flow.

### BlendUtilityGenerator

**Location**: `src/generators/BlendUtilityGenerator.ts`

**Purpose**: Generates runtime blend utility functions for color manipulation.

**Output Functions**:
- `darkerBlend(color, blendValue)` - Overlay black
- `lighterBlend(color, blendValue)` - Overlay white
- `saturate(color, blendValue)` - Increase HSL saturation
- `desaturate(color, blendValue)` - Decrease HSL saturation

**Platform Implementations**:
- **Web**: TypeScript functions with hex color support
- **iOS**: Swift Color extension methods
- **Android**: Kotlin Color extension functions

**Integration Status**: ⚠️ **ORPHANED** - This generator exists but is NOT called by TokenFileGenerator. The generated utilities are NOT included in the build output.

---

## Build Pipeline Integration

### What's IN the Build Pipeline

| Component | In TokenFileGenerator | In Build Output |
|-----------|----------------------|-----------------|
| Primitive blend tokens (blend100-500) | ✅ Yes | ✅ Yes |
| Semantic blend tokens (hoverDarker, etc.) | ✅ Yes | ✅ Yes |
| BlendCalculator (runtime) | N/A | ✅ Yes (dist/blend/) |
| ColorSpaceUtils (runtime) | N/A | ✅ Yes (dist/blend/) |

### What's NOT in the Build Pipeline

| Component | In TokenFileGenerator | In Build Output |
|-----------|----------------------|-----------------|
| BlendValueGenerator output | ❌ No | ❌ No |
| BlendUtilityGenerator output | ❌ No | ❌ No |
| Runtime utility functions | ❌ No | ❌ No |

---

## Comparison: How Other Token Families Integrate

### Opacity Tokens

**Primitive tokens**: ✅ In build output (opacity000-opacity1300)
**Semantic tokens**: ✅ In build output (opacityHeavy, opacityGhost)
**Runtime utilities**: ❌ None needed - opacity is a simple multiplier

**Usage pattern**: Components apply opacity directly via CSS/Swift/Kotlin opacity properties.

### Color Tokens

**Primitive tokens**: ✅ In build output (all color families)
**Semantic tokens**: ✅ In build output (via shadow tokens)
**Runtime utilities**: ❌ None in generated output

**Usage pattern**: Components reference color tokens directly. No runtime color manipulation utilities are generated.

### Shadow Tokens

**Primitive tokens**: ✅ In build output (offset, blur, opacity, color)
**Semantic tokens**: ✅ In build output (shadowContainer, shadowModal, etc.)
**Runtime utilities**: ❌ None needed - shadows are composed from primitives

**Usage pattern**: Semantic shadow tokens compose multiple primitives into complete shadow definitions.

---

## Key Finding: The Blend Token Gap

### What Exists

1. **Primitive blend tokens** (blend100-500) - ✅ In build output
2. **Semantic blend tokens** (hoverDarker, etc.) - ✅ In build output
3. **BlendCalculator** - ✅ In dist/blend/ (runtime calculation)
4. **ColorSpaceUtils** - ✅ In dist/blend/ (color conversion)
5. **BlendValueGenerator** - ✅ Exists but orphaned
6. **BlendUtilityGenerator** - ✅ Exists but orphaned

### What's Missing

**The bridge from token definition to component consumption.**

Unlike opacity (simple multiplier) or shadow (composed from primitives), blend tokens require **runtime color calculation**:

```
color.primary + blend.hoverDarker → calculated darker color
```

This calculation requires:
1. A base color (from color tokens)
2. A blend direction (darker, lighter, saturate, desaturate)
3. A blend amount (from blend tokens)
4. A runtime function to perform the calculation

**The runtime functions exist** (`BlendCalculator`, `ColorSpaceUtils`) but:
- They're in `dist/blend/` (TypeScript/JavaScript only)
- They're NOT exported in the generated platform files
- Components have no documented pattern for using them

---

## Extension Points for New Token Types

### Adding New Primitive Token Family

1. Create token definition file in `src/tokens/`
2. Export from `src/tokens/index.ts`
3. Add to `getAllPrimitiveTokens()` array
4. TokenFileGenerator automatically includes in generation

### Adding New Semantic Token Family

1. Create semantic token definition in `src/tokens/semantic/`
2. Export from `src/tokens/semantic/index.ts`
3. Add to `getAllSemanticTokens()` array
4. TokenFileGenerator automatically includes in generation

### Adding Special Token Handling

1. Create specialized generator method in `TokenFileGenerator`
2. Call from platform-specific generation methods
3. Add section comments for organization

### Adding Runtime Utilities (THE GAP)

**Current pattern**: No established pattern exists.

**Potential approaches**:
1. Include utility functions in generated platform files
2. Export utilities as separate module (current state for blend)
3. Generate platform-native extensions (Swift/Kotlin)

---

## Recommendations for Phase 3

1. **Determine if runtime utilities should be in generated files**
   - Pro: Single source of truth, platform-native code
   - Con: Increases generated file size, maintenance burden

2. **Evaluate BlendUtilityGenerator integration**
   - The generator exists and produces valid platform code
   - Could be integrated into TokenFileGenerator

3. **Document component consumption pattern**
   - How should components use blend tokens today?
   - What's the expected import/usage pattern?

4. **Consider platform-specific approaches**
   - Web: CSS color-mix() function (modern browsers)
   - iOS: SwiftUI Color modifiers
   - Android: Compose Color utilities

---

## Summary

| Aspect | Status | Notes |
|--------|--------|-------|
| Unified generator exists | ✅ Yes | TokenFileGenerator orchestrates all platforms |
| Blend primitives in output | ✅ Yes | blend100-500 in all platform files |
| Blend semantics in output | ✅ Yes | hoverDarker, etc. in all platform files |
| Blend utility generators | ✅ Exist | BlendValueGenerator, BlendUtilityGenerator |
| Generators integrated | ❌ No | Generators exist but not called by build |
| Runtime utilities in output | ❌ No | Not included in generated platform files |
| Component consumption pattern | ❌ Missing | No documented pattern for using blend tokens |

**The gap is NOT in token definition or generation capability - it's in the integration of runtime utilities into the build pipeline and the documentation of component consumption patterns.**

---

*This document fulfills Task 2.1 requirements for documenting generator patterns.*
