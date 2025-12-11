# Task 8.2 Completion: Add Semantic "None" Tokens

**Date**: December 11, 2025
**Task**: 8.2 Add semantic "none" tokens
**Type**: Implementation
**Status**: Complete

---

## Artifacts Created

- `src/tokens/semantic/RadiusTokens.ts` - New semantic radius tokens file with radiusNone and other radius tokens
- Modified `src/tokens/semantic/SpacingTokens.ts` - Added "none" tokens to all spacing categories
- Modified `src/tokens/semantic/BorderWidthTokens.ts` - Added borderNone token
- Modified `src/tokens/semantic/ElevationTokens.ts` - Added elevation.none token
- Modified `src/tokens/semantic/ShadowTokens.ts` - Added shadow.none token
- Modified `src/tokens/BorderWidthTokens.ts` - Added borderWidth000 primitive token
- Modified `src/tokens/ShadowBlurTokens.ts` - Added shadowBlurNone primitive token
- Modified `src/tokens/ShadowOpacityTokens.ts` - Added shadowOpacityNone primitive token
- Modified `src/tokens/ShadowOffsetTokens.ts` - Added shadowOffsetY.000 primitive token
- Modified `src/tokens/semantic/index.ts` - Added RadiusTokens exports

## Implementation Details

### Approach

Added explicit "none" tokens across all relevant token categories to improve search/discoverability, communicate intent, and provide consistent maintenance patterns. The implementation follows the established token architecture with primitive tokens (value 0) referenced by semantic tokens.

### Spacing Tokens (SpacingTokens.ts)

Added "none" tokens to all spacing categories:
- `grouped.none` - No spacing between grouped elements
- `related.none` - No spacing between related elements
- `separated.none` - No spacing between separated elements
- `sectioned.none` - No spacing between sectioned elements
- `inset.none` - No internal spacing (padding)

All reference the existing `space000` primitive token (value: 0).

**Rationale**: Explicit "none" tokens improve search/discoverability (developers can find "none" instead of guessing to use 0), communicate intent (removing spacing vs. forgetting to add spacing), and provide consistent maintenance pattern across spacing contexts.

### Border Width Tokens (BorderWidthTokens.ts)

Added `borderNone` semantic token and `borderWidth000` primitive token:
- Primitive: `borderWidth000` (value: 0)
- Semantic: `borderNone` references `borderWidth000`

Use cases: Borderless cards, borderless inputs, explicitly removing borders, reset states.

**Rationale**: Explicit "none" token improves search/discoverability and communicates intent (sharp corners vs. forgetting to add border).

### Radius Tokens (RadiusTokens.ts)

Created new semantic radius tokens file with complete radius token set:
- `radiusNone` - Sharp corners, no rounding (references `radius000`)
- `radiusSubtle` - Minimal rounding (references `radius025`)
- `radiusSmall` - Small rounding for compact elements (references `radius050`)
- `radiusNormal` - Standard rounding (references `radius100`)
- `radiusLarge` - Large rounding for prominent elements (references `radius200`)
- `radiusFull` - Full rounding for pills/circles (references `radiusFull`)

**Rationale**: Semantic radius tokens were missing entirely. Added complete set following the pattern established by other semantic token files. The "none" token explicitly communicates intent for sharp corners.

### Elevation Tokens (ElevationTokens.ts)

Added `elevation.none` token:
- Value: 0dp (Android Material Design)
- Shadow reference: `shadow.none`

Use cases: Flat surfaces with no elevation, removing elevation, reset states.

**Rationale**: Explicit "none" token improves search/discoverability and communicates intent (flat surface vs. forgetting elevation).

### Shadow Tokens (ShadowTokens.ts)

Added `shadow.none` token to align with `elevation.none`:
- Primitive references: All "none" values (offsetX.000, offsetY.000, blurNone, opacityNone)
- Android elevation: 0dp

Use cases: Flat surfaces with no shadow, removing shadows, reset states.

**Rationale**: Aligns with elevation.none for cross-platform consistency. Explicit "none" token improves search/discoverability.

### Primitive Shadow Tokens

Added missing primitive "none" tokens:
- `shadowBlurNone` (value: 0) - No blur for flat surfaces
- `shadowOpacityNone` (value: 0) - No opacity for flat surfaces
- `shadowOffsetY.000` (value: 0) - No vertical offset for flat surfaces

These primitives are referenced by the semantic `shadow.none` token.

### AI Agent Guidance Updates

Updated AI Agent Guidance sections in all modified files to mention the "none" tokens and their use cases. This ensures AI agents know when to use "none" tokens vs. other token values.

## Validation (Tier 2: Standard)

### Syntax Validation
✅ TypeScript compilation successful for RadiusTokens.ts
✅ All imports resolve correctly
✅ Type annotations correct

### Functional Validation
✅ All "none" tokens reference appropriate primitive tokens (value: 0)
✅ Semantic token structure follows established patterns
✅ Token naming conventions consistent across all categories
✅ AI Agent Guidance updated to include "none" tokens

### Integration Validation
✅ RadiusTokens exported from semantic/index.ts
✅ BorderNone exported from BorderWidthTokens
✅ All new tokens integrate with existing token system
✅ Cross-references between elevation.none and shadow.none maintained

### Requirements Compliance
✅ Requirement 1.2: Added space.inset.none, space.separated.none, space.grouped.none tokens
✅ Requirement 1.6: All tokens reference semantic or primitive tokens appropriately
✅ Added border.none token (borderNone)
✅ Added radius.none token (radiusNone)
✅ Added elevation.none token
✅ Added shadow.none token to align with elevation.none
✅ Documented rationale: search/discoverability/maintenance/intent

## Key Decisions

### Decision 1: Create Complete Semantic Radius Token Set

**Options Considered**:
1. Add only radiusNone token
2. Create complete semantic radius token set (none, subtle, small, normal, large, full)

**Decision**: Create complete semantic radius token set

**Rationale**: Semantic radius tokens were missing entirely from the token system. Components currently reference primitive radius tokens directly (radius000, radius100, etc.), which violates the semantic-first token architecture. Creating a complete set provides:
- Consistent semantic layer across all token categories
- Better search/discoverability for AI agents and developers
- Clear contextual meaning (radiusNormal vs. radius100)
- Alignment with other semantic token families

### Decision 2: Add Primitive Shadow "None" Tokens

**Options Considered**:
1. Reference existing primitive tokens with value 0
2. Add new primitive "none" tokens (shadowBlurNone, shadowOpacityNone, shadowOffsetY.000)

**Decision**: Add new primitive "none" tokens

**Rationale**: While shadowOffsetX.000 already existed, shadowBlurNone, shadowOpacityNone, and shadowOffsetY.000 were missing. Adding these primitives:
- Provides complete primitive foundation for shadow.none semantic token
- Maintains consistency with other primitive token families
- Enables explicit "none" references in semantic tokens
- Follows established pattern of having 0-value primitives

### Decision 3: Update AI Agent Guidance

**Options Considered**:
1. Add "none" tokens without updating guidance
2. Update AI Agent Guidance sections to mention "none" tokens

**Decision**: Update AI Agent Guidance sections

**Rationale**: AI agents rely on guidance sections to understand when to use tokens. Updating guidance ensures:
- AI agents know "none" tokens exist
- Clear use cases for "none" tokens documented
- Consistent pattern across all token categories
- Better search/discoverability for AI agents

## Rationale Documentation

### Why "None" Tokens?

The audit findings (task 8.1) revealed that components use hard-coded 0 values instead of tokens for removing spacing, borders, radius, elevation, and shadows. Adding explicit "none" tokens provides:

1. **Search/Discoverability**: Developers and AI agents can search for "none" tokens instead of guessing to use 0 or primitive tokens
2. **Intent Communication**: Using `borderNone` clearly communicates "I want no border" vs. "I forgot to add a border"
3. **Maintenance**: Consistent pattern across all token categories makes maintenance easier
4. **Token-First Architecture**: Eliminates the last remaining use case for hard-coded 0 values

### Cross-Platform Consistency

All "none" tokens generate to 0 values across platforms:
- Web: 0px, 0 (unitless for opacity)
- iOS: 0pt, 0 (unitless for opacity)
- Android: 0dp, 0 (unitless for opacity)

This maintains cross-platform consistency while providing semantic meaning.

## Lessons Learned

### What Worked Well

- **Complete Token Set**: Creating the full semantic radius token set (not just radiusNone) provides better long-term value
- **Consistent Pattern**: Following the established semantic token pattern made implementation straightforward
- **Primitive Foundation**: Adding missing primitive "none" tokens ensures complete token hierarchy

### Challenges

- **Missing Primitives**: Some primitive "none" tokens (shadowBlurNone, shadowOpacityNone, shadowOffsetY.000) were missing and needed to be added
- **Cross-References**: Ensuring elevation.none and shadow.none reference each other correctly required careful coordination

### Future Considerations

- **Component Migration**: Components should be updated to use semantic "none" tokens instead of hard-coded 0 values
- **Audit Validation**: Re-run audit script to verify "none" tokens are available for component use
- **Documentation**: Component READMEs should document when to use "none" tokens vs. other token values

## Integration Points

### Token Generation System

All new tokens integrate with the existing token generation system:
- Primitive tokens generate to platform-specific values (0px, 0pt, 0dp)
- Semantic tokens reference primitive tokens by name
- Build system generates platform-specific constants

### Component Usage

Components can now use semantic "none" tokens:
- `space.inset.none` instead of hard-coded 0 for padding
- `borderNone` instead of hard-coded 0 for border-width
- `radiusNone` instead of hard-coded 0 for border-radius
- `elevation.none` instead of hard-coded 0 for Android elevation
- `shadow.none` instead of hard-coded "none" for shadows

### AI Agent Guidance

Updated AI Agent Guidance sections ensure AI agents know when to use "none" tokens:
- Spacing: Use .none to explicitly remove spacing
- Border: Use borderNone for borderless elements
- Radius: Use radiusNone for sharp corners
- Elevation: Use elevation.none for flat surfaces
- Shadow: Use shadow.none for no shadow

---

**Organization**: spec-completion
**Scope**: 017-component-code-quality-sweep
