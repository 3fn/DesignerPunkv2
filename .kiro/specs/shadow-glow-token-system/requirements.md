# Requirements Document: Shadow and Glow Token System

**Date**: October 23, 2025
**Spec**: shadow-glow-token-system
**Status**: Requirements Phase - Complete
**Dependencies**: mathematical-token-system, cross-platform-build-system

---

## Draft Status Note

This requirements document has been updated from DRAFT to complete status. Requirements 3 and 4 have been refined based on exploration exercises that defined the sun arc conceptual model (sunrise/morning/noon/dusk/sunset) and shadow quality framework (hard/moderate/soft). All requirements are now complete and ready for design phase.

---

## Introduction

This specification defines the Shadow and Glow token system for DesignerPunk. The system provides mathematical foundations for depth (shadows) and emphasis (glows) effects across web, iOS, and Android platforms.

Shadows convey elevation and spatial relationships using directional lighting principles. Glows convey energy and emphasis using multi-layer radial effects. Both systems use the established 8-base mathematical foundation with baseline grid alignment.

---

## Glossary

- **Shadow Token System**: Token system for directional shadows that convey depth and spatial relationships
- **Glow Token System**: Token system for radial glow effects that convey emphasis and energy
- **Light Source Position**: Conceptual position of light relative to an element that determines shadow offset direction (inspired by sun arc: sunrise, morning, noon, dusk, sunset)
- **Shadow Quality**: Characteristic of shadow edge definition and opacity (hard, moderate, soft)
- **Depth**: Distance of an element from the surface behind it, conveyed through shadow size and softness (depth100, depth200, depth300)
- **Sun Arc**: Conceptual model of light source positions based on sun position throughout the day
- **Glow Layer**: Individual shadow layer in a multi-layer glow effect
- **Base-8 System**: Mathematical foundation using 8 as the base unit with multipliers (0.5, 1, 1.5, 2, etc.)
- **Baseline Grid**: 4px grid system that all token values should preferably align to
- **Primitive Token**: Foundational token value (offsetX, offsetY, blur, opacity, spread, color)
- **Semantic Token**: Compositional token combining multiple primitives for specific use cases
- **Cross-Platform Translation**: Process of converting unitless token values to platform-specific formats

---

## Requirements

### Requirement 1: Shadow Primitive Token Foundation

**User Story**: As a product architect, I want mathematically consistent shadow primitive tokens, so that I can compose depth-based shadows with predictable relationships.

#### Acceptance Criteria

1. WHEN defining shadow offset primitives THEN the Shadow Token System SHALL use base-8 values aligned to the 4px baseline grid
2. WHEN defining shadow blur primitives THEN the Shadow Token System SHALL use base-8 values with progressive blur amounts
3. WHEN defining shadow opacity primitives THEN the Shadow Token System SHALL use decimal values that vary with shadow quality and depth
4. WHEN defining shadow color primitives THEN the Shadow Token System SHALL add shadow color family to ColorTokens.ts as mode-agnostic primitive color tokens (shadowBlack100, shadowBlue100, shadowOrange100, shadowGray100)
5. WHEN defining shadow color semantics THEN the Shadow Token System SHALL map shadow color family to semantic tokens (shadowBlack100 → color.shadow.default, shadowBlue100 → color.shadow.warm, shadowOrange100 → color.shadow.cool, shadowGray100 → color.shadow.ambient)

**Note**: Shadow colors were identified during design phase exploration as needing proper treatment based on art theory (shadows are rarely pure black, but tinted by ambient light). Following the compositional architecture pattern (like typography tokens not including color), shadow colors are primitive color tokens in ColorTokens.ts that shadow semantic tokens reference. This maintains separation of concerns where colors are colors and shadows are spatial properties. Shadow colors are mode-agnostic (always dark) regardless of light/dark theme mode.

**Shadow Color Family Architecture**: Shadow colors follow the systematic color family structure used throughout the DesignerPunk color system (gray100-900, purple100-900, etc.) rather than purpose-based naming. This provides:
- **Architectural Consistency**: Shadow colors use the same family pattern as all other colors
- **Systematic Structure**: Numeric scale (100) indicates intensity level within the family
- **Future Flexibility**: Family structure allows for additional shadow color variants (shadowBlack200, shadowBlue200, etc.) if needed
- **Clear Relationships**: Family grouping makes color relationships explicit (shadowBlack, shadowBlue, shadowOrange, shadowGray are all shadow colors)

**Art Theory Rationale**: Shadow color selection follows art theory principles where warm light creates cool shadows and cool light creates warm shadows:
- **shadowBlack100**: Pure black for neutral lighting (noon)
- **shadowBlue100**: Cool blue-gray tint for warm lighting environments (sunrise/sunset)
- **shadowOrange100**: Warm orange-gray tint for cool lighting environments
- **shadowGray100**: Neutral gray for ambient/overcast lighting

Semantic shadow color tokens (color.shadow.default, color.shadow.warm, color.shadow.cool, color.shadow.ambient) provide purpose-based naming while referencing the systematic color family primitives.

### Requirement 2: Glow Primitive Token Foundation

**User Story**: As a product architect, I want mathematically consistent glow primitive tokens, so that I can compose multi-layer glow effects with predictable relationships.

#### Acceptance Criteria

1. WHEN defining glow blur primitives THEN the Glow Token System SHALL use base-8 values with larger blur amounts than shadow primitives
2. WHEN defining glow opacity primitives THEN the Glow Token System SHALL use decimal values that decrease from inner to outer layers
3. WHEN defining glow color semantics THEN the Glow Token System SHALL reference existing vibrant color tokens (purple500, cyan500, yellow500)

**Note**: Glow colors reference existing vibrant colors from ColorTokens. Semantic glow color tokens (glow.neonPurple, glow.neonCyan, glow.neonYellow) will be added to semantic/ColorTokens.ts to provide semantic naming while referencing the core 500 neon colors.

### Requirement 3: Light Source Position Conceptual Framework

**User Story**: As a product architect, I want conceptual guidance on light source positioning inspired by the sun's arc throughout the day, so that I can create shadows that convey consistent spatial relationships.

#### Acceptance Criteria

1. WHEN documenting light source concepts THEN the Shadow Token System SHALL provide guidance based on sun position throughout the day (sunrise, morning, noon, dusk, sunset)
2. WHEN light source is at sunrise position THEN shadows SHALL offset left and down (negative offsetX, positive offsetY)
3. WHEN light source is at morning position THEN shadows SHALL offset left and down with medium angle (negative offsetX, positive offsetY)
4. WHEN light source is at noon position THEN shadows SHALL offset straight down (offsetX = 0, positive offsetY)
5. WHEN light source is at dusk position THEN shadows SHALL offset right and down with medium angle (positive offsetX, positive offsetY)
6. WHEN light source is at sunset position THEN shadows SHALL offset right and down (positive offsetX, positive offsetY)
7. WHEN applying light source concepts THEN semantic shadow tokens SHALL demonstrate the sun arc framework in practice

### Requirement 4: Shadow Quality Conceptual Framework

**User Story**: As a product architect, I want conceptual guidance on shadow quality (hard, moderate, soft), so that I can create shadows that convey appropriate definition and atmosphere.

#### Acceptance Criteria

1. WHEN documenting shadow quality concepts THEN the Shadow Token System SHALL provide guidance on how quality affects blur and opacity
2. WHEN shadow quality is hard THEN shadows SHALL use small blur values and higher opacity for sharp, defined edges
3. WHEN shadow quality is moderate THEN shadows SHALL use medium blur values and balanced opacity for standard definition
4. WHEN shadow quality is soft THEN shadows SHALL use large blur values and lower opacity for diffuse, gentle edges
5. WHEN applying shadow quality concepts THEN semantic shadow tokens SHALL demonstrate the quality framework in practice

### Requirement 5: Compositional Shadow Architecture

**User Story**: As a product architect, I want shadows composed from primitive tokens, so that shadow definitions follow the same compositional pattern as typography tokens.

#### Acceptance Criteria

1. WHEN defining semantic shadow tokens THEN the Shadow Token System SHALL compose shadows from offsetX, offsetY, blur, opacity, and color primitives
2. WHEN a semantic shadow token references primitives THEN all primitive references SHALL be explicit and traceable
3. WHEN semantic shadows convey depth THEN greater depth SHALL use larger offset and blur values
4. WHEN semantic shadows are platform-agnostic THEN the composition SHALL use unitless primitive values
5. WHEN semantic shadows reference colors THEN they SHALL reference semantic shadow color tokens from semantic/ColorTokens.ts (color.shadow.default, color.shadow.warm, etc.)

**Note**: Spread property removed from shadow composition as it is web-only, rarely used, and not supported on iOS/Android. Shadow colors are referenced from semantic/ColorTokens.ts following the compositional architecture pattern.

### Requirement 6: Cross-Platform Shadow Translation

**User Story**: As a product architect, I want shadows to translate to platform-specific formats, so that depth perception is consistent across web, iOS, and Android.

#### Acceptance Criteria

1. WHEN generating web shadows THEN the Build System SHALL translate shadow tokens to CSS box-shadow format
2. WHEN generating iOS shadows THEN the Build System SHALL translate shadow tokens to shadowOffset, shadowRadius, shadowOpacity, and shadowColor
3. WHEN generating Android shadows THEN the Build System SHALL translate shadow tokens to elevation values or custom drawable definitions
4. WHEN Android elevation approximation is insufficient THEN the Build System SHALL provide custom drawable generation for precise shadow control

### Requirement 7: Baseline Grid Alignment as Preferred Pattern

**User Story**: As a product architect, I want shadow and glow values to follow baseline grid alignment as a preferred pattern, so that mathematical consistency is maintained while allowing natural variation.

#### Acceptance Criteria

1. WHEN defining shadow and glow primitives THEN the Token System SHOULD prefer values that align to the 4px baseline grid
2. WHEN shadow or glow values require strategic flexibility THEN the Token System SHALL allow off-grid values with documented rationale
3. WHEN validating shadow and glow tokens THEN the Validation System SHALL track baseline grid alignment patterns
4. WHEN strategic flexibility is used THEN the Validation System SHALL verify the usage serves a clear design purpose
5. WHEN baseline grid alignment falls below expected patterns THEN the Validation System SHALL return a Warning result

**Note**: Shadows and glows are natural phenomena projected in digital space. Like the Golden Ratio in nature, baseline grid alignment is the preferred pattern with expected and valid variation for visual quality.

### Requirement 8: Shadow and Glow Separation

**User Story**: As a product architect, I want shadows and glows to be separate token systems, so that depth effects and emphasis effects have distinct mathematical foundations.

#### Acceptance Criteria

1. WHEN organizing token files THEN the Token System SHALL separate shadow primitives from glow primitives
2. WHEN defining semantic tokens THEN shadow semantics SHALL be separate from glow semantics
3. WHEN shadows convey depth THEN they SHALL use directional offsets based on light source position
4. WHEN glows convey emphasis THEN they SHALL use zero offsets (radial effects)
5. WHEN documentation explains the systems THEN it SHALL clearly distinguish between shadow use cases and glow use cases

**Note**: This spec focuses on shadow tokens (cross-platform) and glow primitives (foundation for future work). Multi-layer glow architecture and cross-platform glow implementation will be addressed in future specs after proof of concept validation.

---

## Future Scope

The following topics are explicitly deferred to future specifications:

- **Multi-layer glow architecture**: Semantic glow token structure with multiple layers (requires proof of concept)
- **Cross-platform glow implementation**: iOS/Android glow translation strategies (requires gradient token system)
- **Glow semantic tokens**: Web-specific glow effects based on cyberpunk patterns (separate spec after primitives are established)

---

*This requirements document establishes the foundation for a mathematically consistent shadow and glow token system inspired by natural lighting principles (sun arc throughout the day) and shadow quality characteristics (hard/moderate/soft).*
