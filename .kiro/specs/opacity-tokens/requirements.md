# Requirements Document: Opacity Token System

**Date**: October 27, 2025
**Spec**: opacity-tokens
**Status**: Requirements Phase
**Dependencies**: mathematical-token-system, cross-platform-build-system, shadow-glow-token-system
**Coordinated With**: blend-tokens (shares mathematical foundation, developed in parallel)

---

## Introduction

This specification defines the Opacity token system for DesignerPunk. The system provides mathematical foundations for transparency effects across web, iOS, and Android platforms, enabling compositional patterns for state changes, overlays, and visual effects.

**Coordination Note**: This spec is developed in coordination with blend-tokens. Both systems share mathematical approach (formula-based derivation, scale notation) and architectural patterns (strategic flexibility, semantic layer boundary, composition support) while maintaining independent base values and scales optimized for their distinct purposes. Opacity creates transparency effects (see-through), while blend creates color modification effects (darker/lighter/saturated). See `.kiro/specs/opacity-blend-comparison-analysis.md` for detailed comparison.

Opacity tokens follow the established 8-base mathematical foundation (0.08 base value) with scale notation consistent with spacing, fontSize, and other token families. The system supports both primitive opacity values and semantic compositions for common use cases like disabled states, hover effects, modal overlays, and glassmorphism.

Key architectural principles:
- **Compositional modifier**: Opacity is applied to colors, not defined as colors
- **Mathematical progression**: Base value (0.08) with multiplier-based scale
- **Unified generator integration**: Generates opacity values in platform-appropriate formats
- **Cross-platform consistency**: Unitless values that translate to platform-specific alpha channels
- **State color blending**: Enables dynamic theming where one opacity value works across all colors

---

## Glossary

- **Opacity Token System**: Token system for transparency values that modify color visibility
- **Base Value**: Foundation value (0.08 or 8%) from which all opacity tokens are mathematically derived
- **Scale Notation**: Naming convention where token number represents scale multiplier, not actual value (opacity100 = 1 × base, opacity200 = 2 × base)
- **Value Notation**: Alternative naming where token number represents actual percentage (opacity008 = 8%, opacity016 = 16%) - not used in this system
- **Unified Token Generator**: Cross-platform build system that generates opacity values for web, iOS, and Android
- **Compositional Modifier**: Opacity applied to existing colors rather than defining new colors
- **State Color Blending**: Technique where opacity modifies base color for interaction states (hover, pressed, disabled)
- **Alpha Channel**: Platform-specific representation of transparency (CSS opacity, SwiftUI .opacity(), Android alpha)
- **Modal Scrim**: Semi-transparent overlay behind modal dialogs that blocks interaction with background content
- **Glassmorphism**: Visual effect combining background blur with semi-transparent surfaces
- **Strategic Flexibility**: Intentional deviation from base scale for specific design needs (opacity150 = 12%, opacity350 = 28%)
- **Platform Calibration**: Adjustment of opacity values per platform to achieve visual consistency across different rendering engines

---

## Requirements

### Requirement 1: Mathematical Foundation with Base Value

**User Story**: As a product architect, I want opacity tokens derived from a mathematical base value, so that opacity progression follows the same systematic approach as spacing, fontSize, and other token families.

#### Acceptance Criteria

1. WHEN defining the opacity base value THEN the Opacity Token System SHALL use 0.08 (8%) as the foundation value
2. WHEN calculating opacity token values THEN each token SHALL be derived using the formula: `value = OPACITY_BASE_VALUE × multiplier`
3. WHEN the base value is 0.08 THEN opacity100 SHALL equal 0.08 (8%), opacity200 SHALL equal 0.16 (16%), opacity300 SHALL equal 0.24 (24%)
4. WHEN documenting the mathematical relationship THEN each token SHALL include its formula (e.g., "base × 3 = 0.08 × 3 = 0.24")
5. WHEN the base value changes THEN all token values SHALL update automatically through the formula

**Rationale**: The 0.08 (8%) base value aligns with the 8px baseline grid philosophy, creating conceptual consistency across the token system. This mathematical foundation enables AI agents to reason about opacity relationships and supports future calibration if the base value needs adjustment.

### Requirement 2: Scale Notation for System Consistency

**User Story**: As a product architect, I want opacity tokens to use scale notation (opacity100, opacity200), so that naming is consistent with spacing, fontSize, radius, and other token families.

#### Acceptance Criteria

1. WHEN naming opacity tokens THEN the Opacity Token System SHALL use scale notation where the number represents the multiplier, not the percentage value
2. WHEN opacity100 equals 8% THEN the "100" SHALL represent "1 × base value", not "100%"
3. WHEN opacity900 equals 72% THEN the "900" SHALL represent "9 × base value", not "900%"
4. WHEN documenting for AI agents THEN the system SHALL provide a quick reference mapping scale notation to percentage values
5. WHEN developers learn the system THEN they SHALL understand "the number is a scale, not a value" consistent with all other token families

**Rationale**: Scale notation maintains consistency with the entire token system, enabling pattern-based reasoning for AI agents. While value notation (opacity072 = 72%) would be more explicit, scale notation aligns with the mathematical foundation philosophy and supports base value changes without renaming tokens.

### Requirement 3: Comprehensive Opacity Scale

**User Story**: As a product architect, I want a comprehensive opacity scale from 0% to 100%, so that I have sufficient granularity for subtle state transitions and strong overlays.

#### Acceptance Criteria

1. WHEN defining the opacity scale THEN the Opacity Token System SHALL provide 13 base tokens from 0% to 100% in 8% increments
2. WHEN the scale includes opacity000 THEN it SHALL equal 0.0 (0% - fully transparent)
3. WHEN the scale includes opacity100 through opacity1200 THEN they SHALL progress in 8% increments (8%, 16%, 24%, 32%, 40%, 48%, 56%, 64%, 72%, 80%, 88%, 96%)
4. WHEN the scale includes opacity1300 THEN it SHALL equal 1.0 (100% - fully opaque) as a special case
5. WHEN 8% increments provide insufficient granularity THEN strategic flexibility tokens (opacity150, opacity350) MAY be added with documented rationale

**Token Scale**:
- opacity000 = 0.0 (0%) - Fully transparent
- opacity100 = 0.08 (8%) - Subtle hover, very light overlay
- opacity200 = 0.16 (16%) - Light overlay, pressed state
- opacity300 = 0.24 (24%) - Medium-light overlay
- opacity400 = 0.32 (32%) - Modal scrim, medium overlay
- opacity500 = 0.40 (40%) - Strong overlay
- opacity600 = 0.48 (48%) - Disabled state, very strong overlay
- opacity700 = 0.56 (56%) - Nearly opaque
- opacity800 = 0.64 (64%) - Very opaque
- opacity900 = 0.72 (72%) - Extremely opaque
- opacity1000 = 0.80 (80%) - Nearly full opacity
- opacity1100 = 0.88 (88%) - Subtle transparency
- opacity1200 = 0.96 (96%) - Almost fully opaque
- opacity1300 = 1.0 (100%) - Fully opaque

**Rationale**: The 8% increment provides nuance for subtle transitions (e.g., 80% → 88% hover) while maintaining mathematical consistency. The 13-token scale offers comprehensive coverage without overwhelming complexity.

### Requirement 4: Compositional State Color Blending

**User Story**: As a product architect, I want to use opacity tokens to modify colors for interaction states, so that one opacity value works across all brand colors and enables dynamic theming.

#### Acceptance Criteria

1. WHEN applying opacity to interaction states THEN the Opacity Token System SHALL support compositional patterns where opacity modifies base colors
2. WHEN a button uses purple500 at opacity1000 (80%) for hover THEN the same opacity1000 SHALL work for blue500, green500, and all other colors
3. WHEN brand colors change THEN interaction state opacity values SHALL continue to work without modification
4. WHEN documenting state blending THEN the system SHALL provide examples of opacity applied to colors for hover, pressed, and disabled states
5. WHEN opacity modifies color THEN the result SHALL be treated as a visual modifier, not a new color definition

**Compositional Pattern Examples**:
```typescript
// Button states using opacity composition
button.default: purple500 at opacity1300 (100%)
button.hover: purple500 at opacity1000 (80%)
button.pressed: purple500 at opacity900 (72%)
button.disabled: purple500 at opacity600 (48%)

// Same opacity values work for any color
button.default: blue500 at opacity1300 (100%)
button.hover: blue500 at opacity1000 (80%)
// Opacity values remain consistent across all colors
```

**Rationale**: Compositional state blending reduces token count, enables dynamic theming, and provides consistent interaction feedback across all colors. This aligns with the compositional architecture philosophy established in typography tokens.

### Requirement 5: Semantic Opacity Layer

**User Story**: As a product architect, I want semantic opacity tokens for common use cases, so that intent is clear and I don't need to remember numeric scales for standard patterns.

#### Acceptance Criteria

1. WHEN defining semantic opacity tokens THEN the Opacity Token System SHALL provide contextual names that reference primitive opacity tokens
2. WHEN semantic tokens are used THEN they SHALL clearly communicate intent (opacityDisabled, opacityOverlay, opacityHover)
3. WHEN semantic tokens reference primitives THEN the references SHALL be explicit and traceable
4. WHEN use cases emerge during component development THEN additional semantic tokens MAY be added
5. WHEN semantic tokens are documented THEN they SHALL include use case guidance and examples

**Initial Semantic Tokens**:
- opacityDisabled: opacity600 (48%) - Disabled UI elements
- opacityOverlay: opacity400 (32%) - Modal scrims, overlays
- opacityHover: opacity100 (8%) - Subtle hover feedback
- opacityPressed: opacity200 (16%) - Pressed state feedback
- opacityLoading: opacity200 (16%) - Loading skeleton states

**Rationale**: Semantic tokens provide intent-driven naming while maintaining traceability to mathematical primitives. The semantic layer can expand as component patterns emerge without changing the primitive foundation.

### Requirement 6: Opacity Composition Patterns

**User Story**: As a product architect, I want documented patterns for opacity composition, so that I can create glassmorphism, layered overlays, and gradient effects consistently.

#### Acceptance Criteria

1. WHEN documenting opacity patterns THEN the Opacity Token System SHALL provide examples of single opacity, layered opacity, and gradient opacity compositions
2. WHEN creating glassmorphism effects THEN the pattern SHALL combine background opacity, blur, and border opacity
3. WHEN creating layered overlays THEN the pattern SHALL demonstrate multiple opacity layers for depth
4. WHEN creating gradient overlays THEN the pattern SHALL show opacity combined with color gradients
5. WHEN patterns are documented THEN they SHALL include use cases and platform considerations

**Composition Pattern Examples**:

**Single Opacity** (Button hover):
```typescript
button.hover: purple500 at opacity1000 (80%)
```

**Glassmorphism** (Card with glass effect):
```typescript
card.glass: {
  background: gray700 at opacity600 (48%)
  blur: 20px
  border: white300 at opacity200 (16%)
}
```

**Layered Overlay** (Modal with backdrop):
```typescript
modal.backdrop: black500 at opacity400 (32%)
modal.container: {
  background: white100
  shadow: shadow.modal
}
```

**Gradient Overlay** (Hero image overlay):
```typescript
hero.overlay: {
  gradient: black500 to transparent
  opacity: opacity400 (32%)
}
```

**Rationale**: Documented patterns enable consistent implementation across components and provide guidance for AI agents generating component code. Patterns demonstrate the flexibility of the opacity system without prescribing every possible use case.

### Requirement 7: Unified Token Generator Integration

**User Story**: As a product architect, I want opacity tokens generated through the unified token generator, so that opacity values are available across all platforms with consistent mathematical foundations.

#### Acceptance Criteria

1. WHEN generating platform tokens THEN the Unified Token Generator SHALL output opacity value constants (opacity000-opacity1300) in platform-appropriate format
2. WHEN generating web styles THEN the Unified Token Generator SHALL translate opacity tokens to CSS opacity property or rgba alpha channel format
3. WHEN generating iOS styles THEN the Unified Token Generator SHALL translate opacity tokens to SwiftUI .opacity() modifier or Color alpha parameter format
4. WHEN generating Android styles THEN the Unified Token Generator SHALL translate opacity tokens to alpha attribute or Color.copy(alpha) parameter format
5. WHEN opacity values are unitless THEN they SHALL translate directly to platform alpha values (0.48 → 0.48 across all platforms)
6. WHEN platform-specific calibration is needed THEN the Unified Token Generator SHALL support per-platform value adjustments

**Platform Translation Examples**:

**Web (CSS)**:
```css
/* Opacity property */
.button:hover {
  opacity: 0.8; /* opacity1000 */
}

/* RGBA alpha channel */
.button {
  background-color: rgba(107, 80, 164, 0.8); /* purple500 at opacity1000 */
}
```

**iOS (SwiftUI)**:
```swift
// Opacity modifier
Button("Click")
  .opacity(0.8) // opacity1000

// Color alpha parameter
Color(red: 0.42, green: 0.31, blue: 0.64, opacity: 0.8) // purple500 at opacity1000
```

**Android (Jetpack Compose)**:
```kotlin
// Alpha modifier
Button(
  modifier = Modifier.alpha(0.8f) // opacity1000
)

// Color alpha parameter
Color(0xFF6B50A4).copy(alpha = 0.8f) // purple500 at opacity1000
```

**Rationale**: Unitless opacity values translate naturally to platform alpha channels. Direct translation maintains mathematical consistency while supporting future calibration if visual differences emerge across platforms.

### Requirement 8: Platform Calibration Strategy

**User Story**: As a product architect, I want a strategy for platform-specific opacity calibration, so that visual consistency can be achieved if rendering differences emerge.

#### Acceptance Criteria

1. WHEN implementing Phase 1 THEN all platforms SHALL use the same mathematical opacity values (0.48 = 0.48 across web/iOS/Android)
2. WHEN implementing Phase 2 THEN visual differences SHALL be documented through cross-platform testing
3. WHEN visual inconsistencies are identified THEN platform-specific calibration values MAY be added to the token definition
4. WHEN calibration is applied THEN the platform generator SHALL use calibrated values while maintaining the base mathematical value as the source of truth
5. WHEN calibration is documented THEN it SHALL include rationale, visual comparison, and platform-specific adjustments

**Calibration Phases**:

**Phase 1: Mathematical Consistency** (Initial implementation)
- All platforms use same values
- opacity600 = 0.48 on web, iOS, and Android
- Establishes baseline for comparison

**Phase 2: Visual Documentation** (After cross-platform testing)
- Document visual differences across platforms
- Identify cases where 0.48 looks different on iOS vs web vs Android
- Determine if differences are acceptable or require calibration

**Phase 3: Calibration** (If needed, based on Phase 2 findings)
- Add platform-specific values to token definitions
- Example: opacity600 = { base: 0.48, ios: 0.50, android: 0.46 }
- Platform generators use calibrated values
- Base value remains source of truth for mathematical relationships

**Rationale**: Starting with mathematical consistency enables objective comparison. Calibration is applied only if visual differences are problematic, maintaining the mathematical foundation while achieving visual consistency.

### Requirement 9: Safe Opacity + Color Combination Documentation

**User Story**: As a product architect, I want documentation of safe opacity + color combinations, so that I can ensure WCAG contrast compliance when applying opacity to text and UI elements.

#### Acceptance Criteria

1. WHEN documenting opacity usage THEN the Opacity Token System SHALL provide guidance on safe opacity + color combinations for WCAG compliance
2. WHEN opacity is applied to text THEN the documentation SHALL warn that contrast validation is required
3. WHEN opacity is applied to backgrounds THEN the documentation SHALL provide examples of combinations that maintain 4.5:1 contrast ratio
4. WHEN unsafe combinations are identified THEN the documentation SHALL suggest alternatives
5. WHEN documentation is created THEN it SHALL be comprehensive enough to support future build-time validation

**Documentation Structure**:
```markdown
## Safe Opacity + Color Combinations

### Text Opacity (WCAG 4.5:1 Contrast Required)

**Safe Combinations** (Maintains contrast):
- Dark text on light background: gray900 at opacity1300 (100%) on white100
- Dark text on light background: gray900 at opacity1200 (96%) on white100
- Light text on dark background: white100 at opacity1300 (100%) on gray900

**Unsafe Combinations** (Fails contrast):
- Dark text with opacity: gray900 at opacity600 (48%) on white100 ❌
- Light text with opacity: white100 at opacity600 (48%) on gray900 ❌

**Recommendation**: Avoid applying opacity to text. Use explicit color tokens instead.

### Background Opacity (Context-Dependent)

**Modal Overlays** (Blocks content, doesn't need contrast):
- black500 at opacity400 (32%) ✅
- gray900 at opacity500 (40%) ✅

**Glassmorphism** (Content visible through, contrast required):
- gray700 at opacity600 (48%) with blur - validate contrast ⚠️
- white100 at opacity800 (64%) with blur - validate contrast ⚠️

### Button State Opacity

**Hover/Pressed States** (Maintains contrast):
- purple500 at opacity1000 (80%) - validate against background ⚠️
- blue500 at opacity900 (72%) - validate against background ⚠️

**Disabled States** (Contrast not required):
- Any color at opacity600 (48%) ✅ (disabled elements exempt from WCAG)
```

**Rationale**: Documentation provides guidance without enforcing validation at this stage. As the system matures, this documentation enables build-time validation where AI agents check opacity + color combinations during component generation.

### Requirement 10: Relationship to Shadow and Glow Opacity

**User Story**: As a product architect, I want to understand the relationship between general opacity tokens and shadow/glow opacity tokens, so that I use the appropriate tokens for each use case.

#### Acceptance Criteria

1. WHEN documenting opacity tokens THEN the Opacity Token System SHALL explain the relationship to shadow opacity and glow opacity tokens
2. WHEN shadows require opacity THEN shadowOpacity tokens SHALL be used (shadowOpacityHard, shadowOpacityModerate, shadowOpacitySoft)
3. WHEN glows require opacity THEN glowOpacity tokens SHALL be used (glowOpacity100, glowOpacity200, glowOpacity300, glowOpacity400)
4. WHEN UI elements require opacity THEN general opacity tokens SHALL be used (opacity100, opacity200, etc.)
5. WHEN the distinction is unclear THEN documentation SHALL provide use case examples

**Relationship Documentation**:

**Shadow Opacity** (Specialized for shadow quality):
- shadowOpacityHard (0.4) ≈ opacity500 (40%) - but contextual to shadow blur
- shadowOpacityModerate (0.3) ≈ opacity400 (32%) - but contextual to shadow quality
- shadowOpacitySoft (0.2) ≈ opacity200 (16%) - but contextual to shadow softness
- **Use for**: Shadow effects only (shadow.container, shadow.modal, etc.)

**Glow Opacity** (Specialized for multi-layer glow effects):
- glowOpacity100 (0.8) ≈ opacity1000 (80%) - but contextual to inner glow layer
- glowOpacity200 (0.6) ≈ opacity800 (64%) - but contextual to glow layer progression
- glowOpacity300 (0.4) ≈ opacity500 (40%) - but contextual to outer glow layer
- **Use for**: Glow effects only (glow.neonPurple, glow.emphasis, etc.)

**General Opacity** (For UI elements):
- opacity100 (8%) - Subtle hover states
- opacity400 (32%) - Modal overlays
- opacity600 (48%) - Disabled states
- **Use for**: Button states, overlays, glassmorphism, loading states, any UI element opacity

**Why Separate Systems**:
- Shadow opacity relates to shadow quality (hard/moderate/soft) and blur amount
- Glow opacity relates to multi-layer radial effects (inner to outer layer progression)
- General opacity relates to UI element transparency (interaction states, overlays)
- Each system has different contextual needs and mathematical relationships

**Rationale**: Clear distinction prevents confusion and ensures appropriate tokens are used for each use case. Shadow and glow opacity are specialized for their specific effects, while general opacity tokens serve broader UI needs.

### Requirement 11: Strategic Flexibility Support

**User Story**: As a product architect, I want the ability to add strategic flexibility opacity tokens, so that specific design needs can be met without compromising the mathematical foundation.

#### Acceptance Criteria

1. WHEN 8% increments are insufficient THEN strategic flexibility tokens MAY be added between base scale values
2. WHEN strategic flexibility tokens are added THEN they SHALL use the established naming pattern (opacity150, opacity350, opacity550, etc.)
3. WHEN strategic flexibility tokens are defined THEN they SHALL include documented rationale for the deviation
4. WHEN strategic flexibility is used THEN the mathematical formula SHALL still apply (opacity150 = OPACITY_BASE_VALUE × 1.5 = 0.12)
5. WHEN strategic flexibility tokens are tracked THEN usage patterns SHALL be monitored to ensure appropriate use

**Strategic Flexibility Examples**:

**opacity150** (12%):
- Formula: OPACITY_BASE_VALUE × 1.5 = 0.08 × 1.5 = 0.12
- Use case: Very subtle hover state between opacity100 (8%) and opacity200 (16%)
- Rationale: Provides nuanced feedback for sophisticated interactions

**opacity350** (28%):
- Formula: OPACITY_BASE_VALUE × 3.5 = 0.08 × 3.5 = 0.28
- Use case: Specific overlay need between opacity300 (24%) and opacity400 (32%)
- Rationale: Enables precise overlay darkness for specific design requirements

**Rationale**: Strategic flexibility acknowledges that design needs may require values between the base scale. The mathematical foundation is maintained through the formula, and the naming convention (150, 350) clearly signals "this is between standard values."

---

## Future Scope

The following topics are explicitly deferred to future specifications or component development:

- **Build-time opacity + color validation**: Automated WCAG contrast checking during component generation (requires component context)
- **Platform-specific calibration values**: Per-platform opacity adjustments based on visual testing (Phase 3 of calibration strategy)
- **Additional semantic opacity tokens**: Expanded semantic layer based on component patterns (e.g., opacityTooltip, opacityDropdown)
- **Opacity animation tokens**: Duration and easing for opacity transitions (may be part of broader animation token system)
- **Gradient opacity patterns**: Advanced gradient + opacity compositions (requires gradient token system)

---

*This requirements document establishes the foundation for a mathematically consistent opacity token system that enables compositional state color blending, cross-platform transparency, and flexible visual effects while maintaining the 8-base mathematical foundation and scale notation consistency with the entire Designe