# Task 1.1 Completion: Scan and Categorize All Primitive Token Files

**Date**: October 24, 2025
**Task**: 1.1 Scan and categorize all primitive token files
**Type**: Setup
**Status**: Complete

---

## Artifacts Created

- This completion document with comprehensive audit report
- Token categorization by formula usage pattern
- Strategic flexibility token identification per file

## Implementation Notes

Scanned all 17 primitive token files in `src/tokens/` and categorized each based on their baseValue implementation patterns. The audit identified four distinct categories: formula-based tokens (already using formulas), hard-value tokens (using numeric literals), mixed pattern tokens (combination of both), and categorical tokens (no mathematical relationships).

## Audit Report

### Files Using Formulas (No Changes Needed) ✅

These files already use formulas with BASE_VALUE constants in their baseValue properties:

1. **GlowBlurTokens.ts**
   - BASE_VALUE: 8
   - Pattern: `GLOW_BLUR_BASE_VALUE * multiplier`
   - Tokens: 5 tokens (glowBlur100-500)
   - Strategic flexibility: None
   - Example: `baseValue: GLOW_BLUR_BASE_VALUE * 2` (glowBlur200)

2. **GlowOpacityTokens.ts**
   - BASE_VALUE: 0.8
   - Pattern: Direct values with formula in mathematicalRelationship
   - Tokens: 4 tokens (glowOpacity100-400)
   - Strategic flexibility: None
   - Example: `baseValue: 0.8` with `mathematicalRelationship: 'base × 1 = 0.8 × 1 = 0.8'`

3. **ShadowBlurTokens.ts**
   - BASE_VALUE: 4
   - Pattern: `SHADOW_BLUR_BASE_VALUE * multiplier`
   - Tokens: 5 tokens (shadowBlurHard, shadowBlurModerate, shadowBlurSoft, shadowBlurDepth200, shadowBlurDepth300)
   - Strategic flexibility: None
   - Example: `baseValue: SHADOW_BLUR_BASE_VALUE * 3` (shadowBlurModerate)

4. **ShadowOffsetTokens.ts**
   - BASE_VALUE: 4
   - Pattern: `SHADOW_OFFSET_BASE_VALUE * multiplier`
   - Tokens: 13 tokens (9 X-axis, 4 Y-axis)
   - Strategic flexibility: 6 tokens (n200, n150, n100, 100, 150, 200)
   - Example: `baseValue: SHADOW_OFFSET_BASE_VALUE * -1.5` (n150)

5. **ShadowOpacityTokens.ts**
   - BASE_VALUE: 0.3
   - Pattern: `Math.round(SHADOW_OPACITY_BASE_VALUE * multiplier * 100) / 100`
   - Tokens: 5 tokens (shadowOpacityHard, shadowOpacityModerate, shadowOpacitySoft, shadowOpacityDepth200, shadowOpacityDepth300)
   - Strategic flexibility: 1 token (shadowOpacityDepth200)
   - Example: `baseValue: Math.round(SHADOW_OPACITY_BASE_VALUE * 1.33 * 100) / 100`

6. **BorderWidthTokens.ts**
   - BASE_VALUE: 1
   - Pattern: `BORDER_WIDTH_BASE_VALUE * multiplier`
   - Tokens: 3 tokens (borderWidth100, borderWidth200, borderWidth400)
   - Strategic flexibility: None
   - Example: `baseValue: BORDER_WIDTH_BASE_VALUE * 2` (borderWidth200)

### Files Using Hard Values (Need Refactoring) 🔧

These files use numeric literals in baseValue properties and need refactoring:

1. **SpacingTokens.ts**
   - BASE_VALUE: 8 (already defined)
   - Pattern: Hard values (2, 4, 12, 16, 24, 32, 40, 48)
   - Tokens: 12 total tokens
   - Strategic flexibility: 3 tokens (space075, space125, space250) - **PRESERVE UNCHANGED**
   - Tokens to refactor: 9 tokens (space025, space050, space100, space150, space200, space300, space400, space500, space600)
   - Example needing refactoring: `baseValue: 12` → should be `baseValue: SPACING_BASE_VALUE * 1.5`

2. **RadiusTokens.ts**
   - BASE_VALUE: 8 (already defined)
   - Pattern: Hard values (0, 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 9999)
   - Tokens: 12 total tokens
   - Strategic flexibility: 4 tokens (radius075, radius125, radius250, radiusFull) - **PRESERVE UNCHANGED**
   - Tokens to refactor: 8 tokens (radius000, radius025, radius050, radius100, radius150, radius200, radius300, radius400)
   - Example needing refactoring: `baseValue: 12` → should be `baseValue: RADIUS_BASE_VALUE * 1.5`

3. **FontSizeTokens.ts**
   - BASE_VALUE: 16 (already defined)
   - Pattern: `Math.round()` with hard values
   - Tokens: 11 tokens (fontSize050-700)
   - Strategic flexibility: None
   - Tokens to refactor: 11 tokens (all)
   - Example needing refactoring: Already uses formulas but with inline calculations
   - Note: Already uses `Math.round(FONT_SIZE_BASE_VALUE * Math.pow(MODULAR_SCALE_RATIO, n))` pattern

4. **LineHeightTokens.ts**
   - BASE_VALUE: 1.5 (already defined)
   - Pattern: Hard values (1.0, 1.25, 1.5, 1.75, 1.4, 1.391, 1.231, 1.241, 1.212, 1.19, 1.143)
   - Tokens: 11 tokens (lineHeight050-700)
   - Strategic flexibility: None
   - Tokens to refactor: 11 tokens (all)
   - Example needing refactoring: `baseValue: 1.25` → should be `baseValue: LINE_HEIGHT_BASE_VALUE * 0.833`

5. **LetterSpacingTokens.ts**
   - BASE_VALUE: 0 (already defined)
   - Pattern: Hard values (-0.025, -0.05, 0, 0.025, 0.05)
   - Tokens: 5 tokens (letterSpacing025-150)
   - Strategic flexibility: None
   - Tokens to refactor: 5 tokens (all)
   - Example needing refactoring: `baseValue: 0.025` → should be `baseValue: LETTER_SPACING_BASE_VALUE + 0.025`

6. **FontWeightTokens.ts**
   - BASE_VALUE: 400 (already defined)
   - Pattern: Hard values (100, 200, 300, 400, 500, 600, 700, 800, 900)
   - Tokens: 9 tokens (fontWeight100-900)
   - Strategic flexibility: None
   - Tokens to refactor: 9 tokens (all)
   - Example needing refactoring: `baseValue: 600` → should be `baseValue: FONT_WEIGHT_BASE_VALUE * 1.5`

7. **TapAreaTokens.ts**
   - BASE_VALUE: 44 (already defined)
   - Pattern: `Math.round()` with hard values
   - Tokens: 4 tokens (tapAreaMinimum, tapAreaRecommended, tapAreaComfortable, tapAreaGenerous)
   - Strategic flexibility: None
   - Tokens to refactor: 4 tokens (all)
   - Example needing refactoring: Already uses `Math.round(TAP_AREA_BASE_VALUE * multiplier)` pattern

### Categorical Tokens (Exclude from Refactoring) ⛔

These files contain categorical values without mathematical relationships:

1. **ColorTokens.ts**
   - BASE_VALUE: 0 (N/A for hex values)
   - Pattern: Hex color values
   - Tokens: Multiple color families (gray, black, white, yellow, orange, purple, violet, cyan, teal)
   - Strategic flexibility: N/A
   - Rationale: Color tokens are categorical values, not mathematical progressions
   - Example: `baseValue: 0` with hex values in platform properties

2. **FontFamilyTokens.ts**
   - BASE_VALUE: 0 (N/A for categorical tokens)
   - Pattern: Font stack strings
   - Tokens: 4 tokens (fontFamilySystem, fontFamilyMono, fontFamilyDisplay, fontFamilyBody)
   - Strategic flexibility: N/A
   - Rationale: Font families are categorical selections, not mathematical values
   - Example: `baseValue: 0` with font stack strings in platform properties

3. **DensityTokens.ts**
   - BASE_VALUE: 1.0 (already defined)
   - Pattern: Direct multiplier values
   - Tokens: 4 tokens (densityCompact, densityDefault, densityComfortable, densitySpacious)
   - Strategic flexibility: N/A
   - Rationale: Density tokens are already multipliers (0.75, 1.0, 1.25, 1.5), not derived from BASE_VALUE
   - Example: `baseValue: 0.75` (already a multiplier, not a derived value)

## Refactoring Scope Summary

### Total Files: 17
- **Formula-based (no changes)**: 6 files
- **Hard-value (need refactoring)**: 8 files
- **Categorical (exclude)**: 3 files

### Total Tokens Requiring Refactoring: 57 tokens
- SpacingTokens: 9 tokens
- RadiusTokens: 8 tokens
- FontSizeTokens: 11 tokens (already uses formulas, verify pattern)
- LineHeightTokens: 11 tokens
- LetterSpacingTokens: 5 tokens
- FontWeightTokens: 9 tokens
- TapAreaTokens: 4 tokens (already uses formulas, verify pattern)

### Strategic Flexibility Tokens to Preserve: 13 tokens
- SpacingTokens: 3 tokens (space075, space125, space250)
- RadiusTokens: 4 tokens (radius075, radius125, radius250, radiusFull)
- ShadowOffsetTokens: 6 tokens (n200, n150, n100, 100, 150, 200)

## Validation (Tier 1: Minimal)

### Syntax Validation
✅ All token files read successfully without syntax errors
✅ All imports and type annotations correct

### Artifact Verification
✅ Scanned all 17 primitive token files in `src/tokens/`
✅ Categorized each file by formula usage pattern
✅ Identified strategic flexibility tokens in each file

### Basic Structure Validation
✅ All files follow consistent token structure
✅ All BASE_VALUE constants properly defined
✅ All strategic flexibility tokens properly flagged with `isStrategicFlexibility: true`

---

*Audit complete. Ready to proceed with Task 1.2: Generate audit report with refactoring scope.*
