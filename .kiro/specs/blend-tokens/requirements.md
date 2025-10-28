# Requirements Document: Blend Token System

**Date**: October 27, 2025
**Spec**: blend-tokens
**Status**: Requirements Phase
**Dependencies**: mathematical-token-system, cross-platform-build-system
**Coordinated With**: opacity-tokens (shares mathematical foundation, developed in parallel)

---

## Introduction

This specification defines the Blend token system for DesignerPunk. The system provides mathematical foundations for color modification effects across web, iOS, and Android platforms, enabling dynamic interaction states, focus feedback, and visual emphasis without requiring explicit color variant tokens.

Blend tokens modify colors through overlay operations (darker, lighter) and color space adjustments (saturate, desaturate). Unlike opacity tokens which create transparency, blend tokens create new opaque colors through mathematical color manipulation. The system uses a 0.04 base value with a refined 5-token scale optimized for subtle interaction feedback.

Key architectural principles:
- **Color modification**: Blend creates new colors, not transparency
- **Refined scale**: 0.04 base value with 5 tokens (4%, 8%, 12%, 16%, 20%)
- **Multiple directions**: darker, lighter, saturate, desaturate
- **Universal application**: Works with any color token
- **Unified generator integration**: Generates blend values and platform-specific utilities
- **Runtime calculation**: Blend utilities calculate colors at runtime (Phase 1)
- **Future build-time pre-calculation**: Component tokens can pre-calculate colors during build (Phase 2 - deferred)

**Coordination Note**: This spec is developed in coordination with opacity-tokens. While opacity creates transparency effects (see-through), blend creates color modification effects (darker/lighter/saturated). Both systems share mathematical approach (formula-based derivation, scale notation) and architectural patterns (strategic flexibility, semantic layer boundary, composition support) but serve fundamentally different purposes with different base values (0.04 vs 0.08) and scale lengths (5 tokens vs 13 tokens) optimized for their distinct use cases. See `.kiro/specs/opacity-blend-comparison-analysis.md` for detailed comparison.

---

## Glossary

- **Blend Token System**: Token system for color modification values that create new opaque colors through mathematical operations
- **Base Value**: Foundation value (0.04 or 4%) from which all blend tokens are mathematically derived
- **Scale Notation**: Naming convention where token number represents scale multiplier, not actual value (blend100 = 1 × base, blend200 = 2 × base)
- **Blend Direction**: Type of color modification operation (darker, lighter, saturate, desaturate)
- **Darker**: Blend direction that overlays black at specified opacity to darken a color
- **Lighter**: Blend direction that overlays white at specified opacity to lighten a color
- **Saturate**: Blend direction that increases color intensity in HSL color space
- **Desaturate**: Blend direction that decreases color intensity in HSL color space
- **Color Modification**: Process of creating a new opaque color from a base color using blend operations
- **Overlay Operation**: Blending technique where black or white is overlaid at specified opacity (darker/lighter)
- **HSL Color Space**: Hue, Saturation, Lightness color model used for saturation adjustments
- **sRGB Color Space**: Standard RGB color space used for consistent cross-platform color calculations
- **Unified Token Generator**: Cross-platform build system that generates blend values and utilities for web, iOS, and Android
- **Blend Utility Function**: Platform-specific function that calculates blended colors at runtime using blend values
- **Runtime Calculation**: Process of calculating blended colors during application execution using blend utilities
- **Build-Time Pre-Calculation**: Future enhancement where component tokens pre-calculate colors during build (deferred to Phase 2)
- **Universal Blend**: Blend tokens that work with any color token (not color-specific)
- **Semantic Blend Token**: Generic, reusable blend pattern for common interaction states (hover, pressed, focus)
- **Component Token**: Component-specific composition using semantic blend tokens (defined in component library, not token system)
- **Strategic Flexibility**: Intentional deviation from base scale for specific design needs (blend150 = 6%, blend250 = 10%)

---

## Requirements

### Requirement 1: Mathematical Foundation with Refined Base Value

**User Story**: As a product architect, I want blend tokens derived from a refined mathematical base value optimized for subtle interaction feedback, so that color modifications are noticeable but not overwhelming.

#### Acceptance Criteria

1. WHEN defining the blend base value THEN the Blend Token System SHALL use 0.04 (4%) as the foundation value
2. WHEN calculating blend token values THEN each token SHALL be derived using the formula: `value = BLEND_BASE_VALUE × multiplier`
3. WHEN the base value is 0.04 THEN blend100 SHALL equal 0.04 (4%), blend200 SHALL equal 0.08 (8%), blend300 SHALL equal 0.12 (12%)
4. WHEN documenting the mathematical relationship THEN each token SHALL include its formula (e.g., "base × 2 = 0.04 × 2 = 0.08")
5. WHEN the base value changes THEN all token values SHALL update automatically through the formula

**Rationale**: The 0.04 (4%) base value provides subtler control than opacity tokens (0.08 base), optimized for interaction states where dramatic changes would be overwhelming. Interactive surfaces like buttons and containers need gentle feedback (4-12%) rather than strong transparency effects. This refined scale enables nuanced state changes while maintaining mathematical consistency.

**Comparison to Opacity**: Opacity tokens use 0.08 base for transparency effects that can range from subtle (8%) to complete (100%). Blend tokens use 0.04 base for color modifications that should always remain subtle (4-20%). This difference reflects their distinct purposes: transparency vs color modification.

### Requirement 2: Refined Five-Token Scale

**User Story**: As a product architect, I want a focused blend scale optimized for interaction states, so that I have sufficient control without unnecessary complexity.

#### Acceptance Criteria

1. WHEN defining the blend scale THEN the Blend Token System SHALL provide 5 tokens from 4% to 20% in 4% increments
2. WHEN the scale includes blend100 THEN it SHALL equal 0.04 (4% - subtle hover feedback)
3. WHEN the scale includes blend200 THEN it SHALL equal 0.08 (8% - standard hover feedback)
4. WHEN the scale includes blend300 THEN it SHALL equal 0.12 (12% - pressed state feedback)
5. WHEN the scale includes blend400 THEN it SHALL equal 0.16 (16% - strong pressed feedback)
6. WHEN the scale includes blend500 THEN it SHALL equal 0.20 (20% - maximum blend intensity)
7. WHEN 4% increments provide insufficient granularity THEN strategic flexibility tokens (blend150, blend250, blend350, blend450) MAY be added with documented rationale

**Token Scale**:
- blend100 = 0.04 (4%) - Subtle hover, gentle feedback
- blend200 = 0.08 (8%) - Standard hover, noticeable feedback
- blend300 = 0.12 (12%) - Pressed state, clear feedback
- blend400 = 0.16 (16%) - Strong pressed, emphasized feedback
- blend500 = 0.20 (20%) - Maximum blend, dramatic feedback

**Rationale**: The 5-token scale provides focused control for interaction states without the complexity of a full 0-100% range. Blend modifications beyond 20% become too dramatic for interaction feedback. The 4% increment enables nuanced control (4% for subtle containers, 8% for standard buttons, 12% for pressed states) while maintaining simplicity.

**Comparison to Opacity**: Opacity tokens provide 13 tokens (0-100%) because transparency effects need full range from invisible to opaque. Blend tokens provide 5 tokens (4-20%) because color modifications should remain subtle. This shorter scale reflects blend's focused purpose: interaction feedback, not full color transformation.

### Requirement 3: Scale Notation for System Consistency

**User Story**: As a product architect, I want blend tokens to use scale notation consistent with opacity and other token families, so that naming patterns are predictable across the entire token system.

#### Acceptance Criteria

1. WHEN naming blend tokens THEN the Blend Token System SHALL use scale notation where the number represents the multiplier, not the percentage value
2. WHEN blend100 equals 4% THEN the "100" SHALL represent "1 × base value", not "4%" or "100%"
3. WHEN blend300 equals 12% THEN the "300" SHALL represent "3 × base value", not "12%" or "300%"
4. WHEN documenting for AI agents THEN the system SHALL provide a quick reference mapping scale notation to percentage values
5. WHEN developers learn the system THEN they SHALL understand "the number is a scale, not a value" consistent with opacity and other token families

**Rationale**: Scale notation maintains consistency with opacity tokens (opacity100, opacity200) and other token families (space100, fontSize100). While value notation (blend004, blend008) would be more explicit, scale notation enables pattern-based reasoning for AI agents and supports base value changes without renaming tokens.

### Requirement 4: Multiple Blend Directions

**User Story**: As a product architect, I want multiple blend directions (darker, lighter, saturate, desaturate), so that I can create diverse interaction feedback and visual emphasis patterns.

#### Acceptance Criteria

1. WHEN defining blend directions THEN the Blend Token System SHALL support darker, lighter, saturate, and desaturate operations
2. WHEN blend direction is "darker" THEN the system SHALL overlay black at the specified blend value on top of the base color
3. WHEN blend direction is "lighter" THEN the system SHALL overlay white at the specified blend value on top of the base color
4. WHEN blend direction is "saturate" THEN the system SHALL increase color saturation in HSL color space by the specified blend value
5. WHEN blend direction is "desaturate" THEN the system SHALL decrease color saturation in HSL color space by the specified blend value
6. WHEN documenting blend directions THEN the system SHALL provide examples of each direction applied to various colors

**Blend Direction Examples**:

**Darker** (Black overlay):
```typescript
purple500 with blend200 darker
→ purple500 + (black at 8% opacity overlay)
→ Result: Darker purple, fully opaque
```

**Lighter** (White overlay):
```typescript
purple500 with blend200 lighter
→ purple500 + (white at 8% opacity overlay)
→ Result: Lighter purple, fully opaque
```

**Saturate** (Increase intensity):
```typescript
purple500 with blend200 saturate
→ Convert purple500 to HSL: hsl(258, 90%, 66%)
→ Increase saturation: hsl(258, 98%, 66%) // +8% saturation
→ Convert back to RGB
→ Result: More vibrant purple, fully opaque
```

**Desaturate** (Decrease intensity):
```typescript
purple500 with blend200 desaturate
→ Convert purple500 to HSL: hsl(258, 90%, 66%)
→ Decrease saturation: hsl(258, 82%, 66%) // -8% saturation
→ Convert back to RGB
→ Result: More muted purple, fully opaque
```

**Rationale**: Multiple blend directions enable diverse interaction patterns. Darker/lighter provide luminosity changes for hover/pressed states. Saturate/desaturate provide intensity changes for focus/disabled states. This range supports rich interaction design while maintaining mathematical consistency across all directions.

### Requirement 5: Universal Color Application

**User Story**: As a product architect, I want blend tokens to work with any color token, so that one blend value creates consistent feedback across all brand colors and enables dynamic theming.

#### Acceptance Criteria

1. WHEN applying blend to colors THEN the Blend Token System SHALL support universal application where one blend token works with any color
2. WHEN purple500 uses blend200 darker for hover THEN the same blend200 darker SHALL work for blue500, green500, and all other colors
3. WHEN brand colors change THEN blend token values SHALL continue to work without modification
4. WHEN documenting universal application THEN the system SHALL provide examples of the same blend token applied to multiple colors
5. WHEN blend creates a new color THEN the result SHALL be fully opaque (no transparency)

**Universal Application Examples**:
```typescript
// Same blend token works for any color
purple500 with blend200 darker → Darker purple
blue500 with blend200 darker → Darker blue
yellow500 with blend200 darker → Darker yellow
gray300 with blend200 darker → Darker gray

// Dynamic theming: change base color, blend automatically works
brandPrimary: purple500 → Change to blue500
button.hover: brandPrimary with blend200 darker
// Automatically works with new brand color
```

**Rationale**: Universal application eliminates the need for color-specific blend tokens (blend.purple200, blend.blue200, etc.), reduces token count, and enables dynamic theming where brand colors can change without updating blend values. This aligns with the compositional architecture philosophy where blend is a modifier, not a color definition.

### Requirement 6: Unified Token Generator Integration

**User Story**: As a product architect, I want blend tokens generated through the unified token generator, so that blend values and utilities are available across all platforms with consistent mathematical foundations.

#### Acceptance Criteria

1. WHEN generating platform tokens THEN the Unified Token Generator SHALL output blend value constants (blend100-blend500) in platform-appropriate format
2. WHEN generating platform tokens THEN the Unified Token Generator SHALL output platform-specific blend utility functions (darkerBlend, lighterBlend, saturate, desaturate)
3. WHEN blend values are generated THEN they SHALL use the same mathematical foundation (0.04 base value) across all platforms
4. WHEN blend utilities are generated THEN they SHALL implement the same color calculation algorithms across all platforms
5. WHEN documenting generator integration THEN the system SHALL explain that blend tokens generate VALUES and UTILITIES, not pre-calculated color combinations

**Unified Generator Output Examples**:

**Web (TypeScript)**:
```typescript
// Blend value constants
export const BlendTokens = {
  blend100: 0.04,
  blend200: 0.08,
  blend300: 0.12,
  blend400: 0.16,
  blend500: 0.20
};

// Blend utility functions
export function darkerBlend(color: string, blendValue: number): string {
  // Implementation using color space utilities
  const rgb = hexToRgb(color);
  const blended = calculateDarkerBlend(rgb, blendValue);
  return rgbToHex(blended);
}

export function lighterBlend(color: string, blendValue: number): string {
  // Implementation using color space utilities
}
```

**iOS (Swift)**:
```swift
// Blend value constants
struct BlendTokens {
  static let blend100: Double = 0.04
  static let blend200: Double = 0.08
  static let blend300: Double = 0.12
  static let blend400: Double = 0.16
  static let blend500: Double = 0.20
}

// Blend utility functions
extension Color {
  func darkerBlend(_ amount: Double) -> Color {
    // Implementation using same algorithm as web
  }
  
  func lighterBlend(_ amount: Double) -> Color {
    // Implementation using same algorithm as web
  }
}
```

**Android (Kotlin)**:
```kotlin
// Blend value constants
object BlendTokens {
  const val blend100 = 0.04f
  const val blend200 = 0.08f
  const val blend300 = 0.12f
  const val blend400 = 0.16f
  const val blend500 = 0.20f
}

// Blend utility functions
fun Color.darkerBlend(amount: Float): Color {
  // Implementation using same algorithm as web/iOS
}

fun Color.lighterBlend(amount: Float): Color {
  // Implementation using same algorithm as web/iOS
}
```

**Rationale**: The unified token generator ensures cross-platform consistency by generating both blend values and platform-specific utilities. This approach provides:
- **Consistent values**: Same mathematical foundation (0.04 base) across all platforms
- **Platform-appropriate utilities**: Functions that work with platform-native color APIs
- **Flexibility**: Blend values can be used at runtime for dynamic theming
- **Performance**: Utilities are available for runtime calculation when needed
- **Future expansion**: Architecture supports both current runtime usage and future build-time pre-calculation

**Component Token Integration**: Component tokens (button.hover, card.pressed) can specify color + blend + direction compositions. These can be:
- **Runtime calculated**: Using generated blend utilities (Phase 1 - current focus)
- **Build-time pre-calculated**: Using same utilities during build (Phase 2 - future enhancement)

The unified generator provides the foundation for both approaches without requiring architectural changes.

### Requirement 7: sRGB Color Space Standardization

**User Story**: As a product architect, I want blend calculations standardized on sRGB color space, so that blended colors are consistent and predictable across all devices and platforms.

#### Acceptance Criteria

1. WHEN calculating blended colors THEN the Blend Token System SHALL use sRGB color space for all calculations
2. WHEN darker/lighter blends are calculated THEN overlay operations SHALL be performed in sRGB space
3. WHEN saturate/desaturate blends are calculated THEN HSL conversions SHALL use sRGB as the base color space
4. WHEN documenting color space decisions THEN the system SHALL explain the rationale for sRGB standardization
5. WHEN Display P3 support is needed THEN it SHALL be deferred to future work with documented migration path

**Rationale**: sRGB provides universal device support, predictable color calculations, and consistent results across platforms. While Display P3 offers wider color gamut (50% more colors than sRGB), blend tokens prioritize consistency over gamut. Interaction feedback needs predictable results more than maximum vibrancy. Display P3 support can be added as future enhancement without changing the mathematical foundation.

### Requirement 8: Semantic Blend Layer

**User Story**: As a product architect, I want semantic blend tokens for common interaction states, so that intent is clear and I don't need to remember numeric scales for standard patterns.

#### Acceptance Criteria

1. WHEN defining semantic blend tokens THEN the Blend Token System SHALL provide generic, reusable patterns for common interaction states
2. WHEN semantic tokens include direction THEN the direction SHALL be explicit in the token name (blendHoverDarker, not blendHover)
3. WHEN semantic tokens reference primitives THEN the references SHALL be explicit and traceable
4. WHEN use cases emerge during component development THEN additional semantic tokens MAY be added
5. WHEN documenting semantic tokens THEN the system SHALL clearly distinguish between semantic tokens (token system) and component tokens (component library)

**Initial Semantic Tokens**:

**Hover States**:
- blendHoverDarker: blend200 darker (8% darker) - Standard hover feedback
- blendHoverLighter: blend200 lighter (8% lighter) - Hover on dark backgrounds
- blendHoverSaturate: blend200 saturate (8% more saturated) - Energized hover

**Pressed States**:
- blendPressedDarker: blend300 darker (12% darker) - Standard pressed feedback
- blendPressedLighter: blend300 lighter (12% lighter) - Pressed on dark backgrounds

**Focus States**:
- blendFocusSaturate: blend200 saturate (8% more saturated) - Attention-drawing focus

**Disabled States**:
- blendDisabledDesaturate: blend300 desaturate (12% less saturated) - Muted, inactive appearance

**Container/Surface States**:
- blendContainerHoverDarker: blend100 darker (4% darker) - Subtle container feedback
- blendContainerHoverLighter: blend100 lighter (4% lighter) - Subtle container feedback on dark

**Rationale**: Semantic tokens provide intent-driven naming while maintaining traceability to mathematical primitives. Explicit direction in names (blendHoverDarker vs blendHover) eliminates ambiguity for AI agents. The semantic layer can expand as component patterns emerge without changing the primitive foundation.

**Component Token Boundary**: Component-specific tokens (button.hover, tile.pressed, card.focus) are composed in the component library using these semantic blend tokens. The token system provides primitives and semantic patterns; the component library composes them into component-specific tokens.

### Requirement 9: Cross-Platform Blend Utility Consistency

**User Story**: As a product architect, I want blend utilities to produce consistent results across web, iOS, and Android, so that interaction feedback is mathematically identical regardless of platform.

#### Acceptance Criteria

1. WHEN generating web blend utilities THEN they SHALL use the same color calculation algorithms as iOS and Android
2. WHEN generating iOS blend utilities THEN they SHALL use the same color calculation algorithms as web and Android
3. WHEN generating Android blend utilities THEN they SHALL use the same color calculation algorithms as web and iOS
4. WHEN blend utilities calculate colors THEN all platforms SHALL produce mathematically identical results (within platform color representation limits)
5. WHEN documenting platform utilities THEN the system SHALL provide usage examples for each platform

**Platform Utility Usage Examples**:

**Web (TypeScript)**:
```typescript
import { BlendTokens, darkerBlend } from '@designerpunk/tokens';

// Runtime calculation
const hoverColor = darkerBlend('#A855F7', BlendTokens.blend200);
// Result: '#9A4EE3' (purple500 + 8% black)

// Usage in components
<button style={{ 
  background: purple500,
  ':hover': { background: darkerBlend(purple500, BlendTokens.blend200) }
}} />
```

**iOS (Swift)**:
```swift
import DesignerPunkTokens

// Runtime calculation
let hoverColor = Color(hex: "A855F7").darkerBlend(BlendTokens.blend200)
// Result: Color(hex: "9A4EE3") (purple500 + 8% black)

// Usage in components
Button("Click")
  .background(purple500)
  .onHover { isHovered in
    if isHovered {
      purple500.darkerBlend(BlendTokens.blend200)
    }
  }
```

**Android (Kotlin)**:
```kotlin
import com.designerpunk.tokens.BlendTokens
import com.designerpunk.tokens.darkerBlend

// Runtime calculation
val hoverColor = Color(0xFFA855F7).darkerBlend(BlendTokens.blend200)
// Result: Color(0xFF9A4EE3) (purple500 + 8% black)

// Usage in components
Button(
  colors = ButtonDefaults.buttonColors(
    containerColor = if (isHovered) {
      purple500.darkerBlend(BlendTokens.blend200)
    } else {
      purple500
    }
  )
)
```

**Rationale**: Consistent blend utilities ensure cross-platform color consistency through identical mathematical algorithms. All platforms calculate the same colors at runtime, providing predictable interaction feedback. This approach:
- **Guarantees consistency**: Same algorithm = same results across platforms
- **Enables dynamic theming**: Colors can be calculated at runtime for theme changes
- **Maintains flexibility**: Component tokens can use utilities for runtime calculation
- **Supports future optimization**: Same utilities can be used for build-time pre-calculation when needed

### Requirement 10: Blend and Opacity Composition

**User Story**: As a product architect, I want the ability to combine blend and opacity tokens, so that I can create sophisticated visual effects when needed.

#### Acceptance Criteria

1. WHEN blend and opacity are both specified THEN the Blend Token System SHALL support composition where blend is applied first, then opacity
2. WHEN purple500 with blend200 darker at opacity600 is specified THEN the system SHALL calculate the blended color first, then apply opacity
3. WHEN documenting composition THEN the system SHALL provide examples and explain the order of operations
4. WHEN composition is used THEN the system SHALL note that this is an advanced pattern for specific use cases
5. WHEN composition creates complexity THEN the system SHALL recommend using explicit color tokens for frequently-used combinations

**Composition Example**:
```typescript
// Composition: blend first, then opacity
purple500 with blend200 darker at opacity600
→ Step 1: Calculate blend: purple500 + 8% black = #7C3AED
→ Step 2: Apply opacity: #7C3AED at 48% opacity
→ Result: Darker purple with transparency
```

**Use Cases**:
- Overlay effects with color modification
- Glassmorphism with tinted backgrounds
- Loading states with darkened, semi-transparent overlays

**Rationale**: Composition provides flexibility for advanced use cases while maintaining clear order of operations (blend → opacity). Most use cases should use blend OR opacity, not both. Composition is available for sophisticated effects but should be used sparingly to avoid complexity.

### Requirement 11: Relationship to Explicit Color Tokens

**User Story**: As a product architect, I want blend tokens to coexist with explicit color variant tokens, so that I can use blend as a modifier while maintaining explicit colors where needed.

#### Acceptance Criteria

1. WHEN blend tokens are used THEN they SHALL coexist with explicit color variant tokens (purple500, purple600, purple700)
2. WHEN blend creates a color THEN it SHALL be treated as a modifier operation, not a color definition
3. WHEN explicit color variants exist THEN developers MAY choose between blend modifiers or explicit variants based on use case
4. WHEN documenting the relationship THEN the system SHALL explain when to use blend vs explicit colors
5. WHEN blend tokens are widely adopted THEN the system MAY recommend reducing explicit color variants to reduce token count

**Coexistence Examples**:

**Using Blend** (Dynamic, flexible):
```typescript
button.default: purple500
button.hover: purple500 with blend200 darker
// Advantage: Change purple500, hover automatically updates
```

**Using Explicit Colors** (Static, predictable):
```typescript
button.default: purple500
button.hover: purple600
// Advantage: Exact color control, no calculation
```

**When to Use Blend**:
- Dynamic theming (brand colors change frequently)
- Consistent interaction patterns (same blend for all colors)
- Reducing token count (one blend vs many color variants)

**When to Use Explicit Colors**:
- Precise color requirements (brand guidelines specify exact hover color)
- Frequently-used combinations (button.hover used everywhere)
- Performance-critical scenarios (avoid calculation overhead)

**Rationale**: Blend tokens are modifiers that coexist with explicit colors, not replacements. This provides flexibility: use blend for dynamic scenarios, explicit colors for precise control. Over time, blend adoption may reduce the need for explicit variants, but both approaches remain valid.

### Requirement 12: Strategic Flexibility Support

**User Story**: As a product architect, I want the ability to add strategic flexibility blend tokens, so that specific design needs can be met without compromising the mathematical foundation.

#### Acceptance Criteria

1. WHEN 4% increments are insufficient THEN strategic flexibility tokens MAY be added between base scale values
2. WHEN strategic flexibility tokens are added THEN they SHALL use the established naming pattern (blend150, blend250, blend350, blend450)
3. WHEN strategic flexibility tokens are defined THEN they SHALL include documented rationale for the deviation
4. WHEN strategic flexibility is used THEN the mathematical formula SHALL still apply (blend150 = BLEND_BASE_VALUE × 1.5 = 0.06)
5. WHEN strategic flexibility tokens are tracked THEN usage patterns SHALL be monitored to ensure appropriate use

**Strategic Flexibility Examples**:

**blend150** (6%):
- Formula: BLEND_BASE_VALUE × 1.5 = 0.04 × 1.5 = 0.06
- Use case: Medium hover feedback between blend100 (4%) and blend200 (8%)
- Rationale: Provides nuanced feedback for specific interaction patterns

**blend250** (10%):
- Formula: BLEND_BASE_VALUE × 2.5 = 0.04 × 2.5 = 0.10
- Use case: Medium-strong pressed state between blend200 (8%) and blend300 (12%)
- Rationale: Enables precise feedback for specific component requirements

**Rationale**: Strategic flexibility acknowledges that design needs may require values between the base scale. The mathematical foundation is maintained through the formula, and the naming convention (150, 250) clearly signals "this is between standard values." Strategic flexibility should be used sparingly and with documented rationale.

---

## Implementation Phases

### Phase 1: Runtime Calculation (Current Focus)

**Scope**: Generate blend values and utilities for runtime color calculation

**Deliverables**:
- Blend value constants (blend100-blend500) for all platforms
- Platform-specific blend utility functions (darkerBlend, lighterBlend, saturate, desaturate)
- Color space conversion utilities (RGB ↔ HSL ↔ Hex)
- Semantic blend tokens (blendHoverDarker, blendPressedDarker, etc.)
- Cross-platform consistency through identical algorithms

**Usage Pattern**:
```typescript
// Component tokens use blend utilities at runtime
button.hover: darkerBlend(purple500, BlendTokens.blend200)
```

**Rationale**: Runtime calculation provides maximum flexibility for dynamic theming, theme switching, and user-customizable colors. The unified generator ensures consistent algorithms across platforms while enabling runtime color modification.

### Phase 2: Build-Time Pre-Calculation (Future Enhancement)

**Scope**: Pre-calculate component token color combinations during build

**Deliverables**:
- Build-time color calculation for component tokens
- Pre-calculated color constants for common combinations
- Optimization for static color combinations
- Backward compatibility with Phase 1 runtime utilities

**Usage Pattern**:
```typescript
// Component tokens pre-calculated at build time
button.hover: #9A4EE3 // Pre-calculated: purple500 with blend200 darker
```

**Rationale**: Build-time pre-calculation optimizes performance for static color combinations while maintaining the flexibility of runtime calculation for dynamic scenarios. Same blend utilities used for both runtime and build-time calculation.

**Migration Path**: Phase 1 runtime utilities provide the foundation for Phase 2 build-time pre-calculation. No architectural changes required - same functions, different execution context.

## Future Scope

The following topics are explicitly deferred to future specifications or enhancements:

- **CSS color-mix() integration**: Native browser blend support for web platform (requires browser support analysis)
- **Display P3 color space**: Wide gamut color support for modern displays (requires color space conversion strategy)
- **Hue shift direction**: Hue rotation for color transformation effects (requires perceptual hue shift research)
- **Additional blend modes**: Multiply, screen, overlay CSS blend modes (requires use case validation)
- **Blend animation tokens**: Duration and easing for blend transitions (may be part of broader animation token system)
- **Component-specific blend patterns**: Component library compositions using semantic blend tokens (separate from token system)

---

*This requirements document establishes the foundation for a mathematically consistent blend token system that enables dynamic color modification for interaction states, focus feedback, and visual emphasis while maintaining cross-platform consistency and compositional flexibility with the opacity token system.*
