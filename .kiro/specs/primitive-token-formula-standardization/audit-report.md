# Primitive Token Formula Standardization - Audit Report

**Date**: October 24, 2025
**Spec**: primitive-token-formula-standardization
**Purpose**: Document refactoring scope for converting hard values to formulas
**Organization**: spec-validation
**Scope**: primitive-token-formula-standardization

---

## Executive Summary

This audit report identifies the scope of refactoring required to convert primitive token hard values to formula-based values using category-specific BASE_VALUE constants. The audit scanned 17 primitive token files and categorized them into four groups: formula-based (no changes needed), hard-value (need refactoring), mixed pattern, and categorical (exclude from refactoring).

### Key Findings

- **Total Files Analyzed**: 17 primitive token files
- **Files Already Using Formulas**: 6 files (35%)
- **Files Requiring Refactoring**: 8 files (47%)
- **Categorical Files (Excluded)**: 3 files (18%)
- **Total Tokens Requiring Refactoring**: 57 tokens
- **Strategic Flexibility Tokens to Preserve**: 13 tokens

---

## Category 1: Formula-Based Tokens (No Changes Needed) ✅

These files already use formulas with BASE_VALUE constants in their baseValue properties and require no refactoring.

### 1.1 GlowBlurTokens.ts

**Status**: ✅ Already uses formulas
**BASE_VALUE**: 8
**Pattern**: `GLOW_BLUR_BASE_VALUE * multiplier`
**Total Tokens**: 5 tokens
**Strategic Flexibility Tokens**: None
**Refactoring Required**: None

**Example**:
```typescript
glowBlur200: {
  baseValue: GLOW_BLUR_BASE_VALUE * 2,
  mathematicalRelationship: 'base × 2 = 8 × 2 = 16'
}
```

### 1.2 GlowOpacityTokens.ts

**Status**: ✅ Already uses formulas
**BASE_VALUE**: 0.8
**Pattern**: Direct values with formula in mathematicalRelationship
**Total Tokens**: 4 tokens
**Strategic Flexibility Tokens**: None
**Refactoring Required**: None

**Example**:
```typescript
glowOpacity100: {
  baseValue: 0.8,
  mathematicalRelationship: 'base × 1 = 0.8 × 1 = 0.8'
}
```

### 1.3 ShadowBlurTokens.ts

**Status**: ✅ Already uses formulas
**BASE_VALUE**: 4
**Pattern**: `SHADOW_BLUR_BASE_VALUE * multiplier`
**Total Tokens**: 5 tokens
**Strategic Flexibility Tokens**: None
**Refactoring Required**: None

**Example**:
```typescript
shadowBlurModerate: {
  baseValue: SHADOW_BLUR_BASE_VALUE * 3,
  mathematicalRelationship: 'base × 3 = 4 × 3 = 12'
}
```

### 1.4 ShadowOffsetTokens.ts

**Status**: ✅ Already uses formulas
**BASE_VALUE**: 4
**Pattern**: `SHADOW_OFFSET_BASE_VALUE * multiplier`
**Total Tokens**: 13 tokens (9 X-axis, 4 Y-axis)
**Strategic Flexibility Tokens**: 6 tokens (n200, n150, n100, 100, 150, 200)
**Refactoring Required**: None

**Example**:
```typescript
n150: {
  baseValue: SHADOW_OFFSET_BASE_VALUE * -1.5,
  mathematicalRelationship: 'base × -1.5 = 4 × -1.5 = -6',
  isStrategicFlexibility: true
}
```

### 1.5 ShadowOpacityTokens.ts

**Status**: ✅ Already uses formulas
**BASE_VALUE**: 0.3
**Pattern**: `Math.round(SHADOW_OPACITY_BASE_VALUE * multiplier * 100) / 100`
**Total Tokens**: 5 tokens
**Strategic Flexibility Tokens**: 1 token (shadowOpacityDepth200)
**Refactoring Required**: None

**Example**:
```typescript
shadowOpacityModerate: {
  baseValue: Math.round(SHADOW_OPACITY_BASE_VALUE * 1.33 * 100) / 100,
  mathematicalRelationship: 'base × 1.33 = 0.3 × 1.33 ≈ 0.4'
}
```

### 1.6 BorderWidthTokens.ts

**Status**: ✅ Already uses formulas
**BASE_VALUE**: 1
**Pattern**: `BORDER_WIDTH_BASE_VALUE * multiplier`
**Total Tokens**: 3 tokens
**Strategic Flexibility Tokens**: None
**Refactoring Required**: None

**Example**:
```typescript
borderWidth200: {
  baseValue: BORDER_WIDTH_BASE_VALUE * 2,
  mathematicalRelationship: 'base × 2 = 1 × 2 = 2'
}
```

---

## Category 2: Hard-Value Tokens (Need Refactoring) 🔧

These files use numeric literals in baseValue properties and require refactoring to use formulas.

### 2.1 SpacingTokens.ts

**Status**: 🔧 Requires refactoring
**BASE_VALUE**: 8 (already defined as `SPACING_BASE_VALUE`)
**Current Pattern**: Hard values (2, 4, 8, 12, 16, 24, 32, 40, 48)
**Target Pattern**: `SPACING_BASE_VALUE * multiplier`
**Total Tokens**: 12 tokens
**Strategic Flexibility Tokens**: 3 tokens (space075, space125, space250) - **PRESERVE UNCHANGED**
**Tokens to Refactor**: 9 tokens

**Tokens Requiring Refactoring**:
1. `space025`: `baseValue: 2` → `baseValue: SPACING_BASE_VALUE * 0.25`
2. `space050`: `baseValue: 4` → `baseValue: SPACING_BASE_VALUE * 0.5`
3. `space100`: `baseValue: 8` → `baseValue: SPACING_BASE_VALUE`
4. `space150`: `baseValue: 12` → `baseValue: SPACING_BASE_VALUE * 1.5`
5. `space200`: `baseValue: 16` → `baseValue: SPACING_BASE_VALUE * 2`
6. `space300`: `baseValue: 24` → `baseValue: SPACING_BASE_VALUE * 3`
7. `space400`: `baseValue: 32` → `baseValue: SPACING_BASE_VALUE * 4`
8. `space500`: `baseValue: 40` → `baseValue: SPACING_BASE_VALUE * 5`
9. `space600`: `baseValue: 48` → `baseValue: SPACING_BASE_VALUE * 6`

**Strategic Flexibility Tokens (Preserve)**:
- `space075`: Uses `STRATEGIC_FLEXIBILITY_TOKENS.space075.value` (6) - **DO NOT CHANGE**
- `space125`: Uses `STRATEGIC_FLEXIBILITY_TOKENS.space125.value` (10) - **DO NOT CHANGE**
- `space250`: Uses `STRATEGIC_FLEXIBILITY_TOKENS.space250.value` (20) - **DO NOT CHANGE**

### 2.2 RadiusTokens.ts

**Status**: 🔧 Requires refactoring
**BASE_VALUE**: 8 (already defined as `RADIUS_BASE_VALUE`)
**Current Pattern**: Hard values (0, 2, 4, 8, 12, 16, 24, 32)
**Target Pattern**: `RADIUS_BASE_VALUE * multiplier`
**Total Tokens**: 12 tokens
**Strategic Flexibility Tokens**: 4 tokens (radius075, radius125, radius250, radiusFull) - **PRESERVE UNCHANGED**
**Tokens to Refactor**: 8 tokens

**Tokens Requiring Refactoring**:
1. `radius000`: `baseValue: 0` → `baseValue: RADIUS_BASE_VALUE * 0`
2. `radius025`: `baseValue: 2` → `baseValue: RADIUS_BASE_VALUE * 0.25`
3. `radius050`: `baseValue: 4` → `baseValue: RADIUS_BASE_VALUE * 0.5`
4. `radius100`: `baseValue: 8` → `baseValue: RADIUS_BASE_VALUE`
5. `radius150`: `baseValue: 12` → `baseValue: RADIUS_BASE_VALUE * 1.5`
6. `radius200`: `baseValue: 16` → `baseValue: RADIUS_BASE_VALUE * 2`
7. `radius300`: `baseValue: 24` → `baseValue: RADIUS_BASE_VALUE * 3`
8. `radius400`: `baseValue: 32` → `baseValue: RADIUS_BASE_VALUE * 4`

**Strategic Flexibility Tokens (Preserve)**:
- `radius075`: Uses `STRATEGIC_FLEXIBILITY_TOKENS.radius075.value` (6) - **DO NOT CHANGE**
- `radius125`: Uses `STRATEGIC_FLEXIBILITY_TOKENS.radius125.value` (10) - **DO NOT CHANGE**
- `radius250`: Uses `STRATEGIC_FLEXIBILITY_TOKENS.radius250.value` (20) - **DO NOT CHANGE**
- `radiusFull`: Uses `STRATEGIC_FLEXIBILITY_TOKENS.radiusFull.value` (9999) - **DO NOT CHANGE**

### 2.3 FontSizeTokens.ts

**Status**: 🔧 Verify formula pattern
**BASE_VALUE**: 16 (already defined as `FONT_SIZE_BASE_VALUE`)
**Current Pattern**: Already uses `Math.round(FONT_SIZE_BASE_VALUE * Math.pow(MODULAR_SCALE_RATIO, n))`
**Target Pattern**: Same pattern (verify consistency)
**Total Tokens**: 11 tokens
**Strategic Flexibility Tokens**: None
**Tokens to Refactor**: 11 tokens (verify formula consistency)

**Tokens Requiring Verification**:
1. `fontSize050`: Verify uses `Math.round(FONT_SIZE_BASE_VALUE / Math.pow(MODULAR_SCALE_RATIO, 2))`
2. `fontSize075`: Verify uses `Math.round(FONT_SIZE_BASE_VALUE / MODULAR_SCALE_RATIO)`
3. `fontSize100`: Verify uses `FONT_SIZE_BASE_VALUE`
4. `fontSize125`: Verify uses `Math.round(FONT_SIZE_BASE_VALUE * MODULAR_SCALE_RATIO)`
5. `fontSize150`: Verify uses `Math.round(FONT_SIZE_BASE_VALUE * Math.pow(MODULAR_SCALE_RATIO, 2))`
6. `fontSize200`: Verify uses `Math.round(FONT_SIZE_BASE_VALUE * Math.pow(MODULAR_SCALE_RATIO, 3))`
7. `fontSize300`: Verify uses `Math.round(FONT_SIZE_BASE_VALUE * Math.pow(MODULAR_SCALE_RATIO, 4))`
8. `fontSize400`: Verify uses `Math.round(FONT_SIZE_BASE_VALUE * Math.pow(MODULAR_SCALE_RATIO, 5))`
9. `fontSize500`: Verify uses `Math.round(FONT_SIZE_BASE_VALUE * Math.pow(MODULAR_SCALE_RATIO, 6))`
10. `fontSize600`: Verify uses `Math.round(FONT_SIZE_BASE_VALUE * Math.pow(MODULAR_SCALE_RATIO, 7))`
11. `fontSize700`: Verify uses `Math.round(FONT_SIZE_BASE_VALUE * Math.pow(MODULAR_SCALE_RATIO, 8))`

**Note**: FontSizeTokens.ts already uses formulas but may have inline calculations that need verification for consistency.

### 2.4 LineHeightTokens.ts

**Status**: 🔧 Requires refactoring
**BASE_VALUE**: 1.5 (already defined as `LINE_HEIGHT_BASE_VALUE`)
**Current Pattern**: Hard values (1.0, 1.25, 1.5, 1.75, 1.4, 1.391, 1.231, 1.241, 1.212, 1.19, 1.143)
**Target Pattern**: `LINE_HEIGHT_BASE_VALUE * multiplier` (simple multipliers, defer cross-token dependencies)
**Total Tokens**: 11 tokens
**Strategic Flexibility Tokens**: None
**Tokens to Refactor**: 11 tokens

**Tokens Requiring Refactoring**:
1. `lineHeight050`: `baseValue: 1.0` → Calculate multiplier from BASE_VALUE
2. `lineHeight075`: `baseValue: 1.25` → Calculate multiplier from BASE_VALUE
3. `lineHeight100`: `baseValue: 1.5` → `baseValue: LINE_HEIGHT_BASE_VALUE`
4. `lineHeight125`: `baseValue: 1.75` → Calculate multiplier from BASE_VALUE
5. `lineHeight150`: `baseValue: 1.4` → Calculate multiplier from BASE_VALUE
6. `lineHeight200`: `baseValue: 1.391` → Calculate multiplier from BASE_VALUE
7. `lineHeight300`: `baseValue: 1.231` → Calculate multiplier from BASE_VALUE
8. `lineHeight400`: `baseValue: 1.241` → Calculate multiplier from BASE_VALUE
9. `lineHeight500`: `baseValue: 1.212` → Calculate multiplier from BASE_VALUE
10. `lineHeight600`: `baseValue: 1.19` → Calculate multiplier from BASE_VALUE
11. `lineHeight700`: `baseValue: 1.143` → Calculate multiplier from BASE_VALUE

**Note**: LineHeight tokens use precision multipliers. Cross-token dependencies to FontSize are deferred to future work.

### 2.5 LetterSpacingTokens.ts

**Status**: 🔧 Requires refactoring
**BASE_VALUE**: 0 (already defined as `LETTER_SPACING_BASE_VALUE`)
**Current Pattern**: Hard values (-0.025, -0.05, 0, 0.025, 0.05)
**Target Pattern**: `LETTER_SPACING_BASE_VALUE + offset` (addition/subtraction pattern)
**Total Tokens**: 5 tokens
**Strategic Flexibility Tokens**: None
**Tokens to Refactor**: 5 tokens

**Tokens Requiring Refactoring**:
1. `letterSpacing025`: `baseValue: -0.025` → `baseValue: LETTER_SPACING_BASE_VALUE - 0.025`
2. `letterSpacing050`: `baseValue: -0.05` → `baseValue: LETTER_SPACING_BASE_VALUE - 0.05`
3. `letterSpacing100`: `baseValue: 0` → `baseValue: LETTER_SPACING_BASE_VALUE`
4. `letterSpacing125`: `baseValue: 0.025` → `baseValue: LETTER_SPACING_BASE_VALUE + 0.025`
5. `letterSpacing150`: `baseValue: 0.05` → `baseValue: LETTER_SPACING_BASE_VALUE + 0.05`

### 2.6 FontWeightTokens.ts

**Status**: 🔧 Requires refactoring
**BASE_VALUE**: 400 (already defined as `FONT_WEIGHT_BASE_VALUE`)
**Current Pattern**: Hard values (100, 200, 300, 400, 500, 600, 700, 800, 900)
**Target Pattern**: `FONT_WEIGHT_BASE_VALUE * multiplier`
**Total Tokens**: 9 tokens
**Strategic Flexibility Tokens**: None
**Tokens to Refactor**: 9 tokens

**Tokens Requiring Refactoring**:
1. `fontWeight100`: `baseValue: 100` → `baseValue: FONT_WEIGHT_BASE_VALUE * 0.25`
2. `fontWeight200`: `baseValue: 200` → `baseValue: FONT_WEIGHT_BASE_VALUE * 0.5`
3. `fontWeight300`: `baseValue: 300` → `baseValue: FONT_WEIGHT_BASE_VALUE * 0.75`
4. `fontWeight400`: `baseValue: 400` → `baseValue: FONT_WEIGHT_BASE_VALUE`
5. `fontWeight500`: `baseValue: 500` → `baseValue: FONT_WEIGHT_BASE_VALUE * 1.25`
6. `fontWeight600`: `baseValue: 600` → `baseValue: FONT_WEIGHT_BASE_VALUE * 1.5`
7. `fontWeight700`: `baseValue: 700` → `baseValue: FONT_WEIGHT_BASE_VALUE * 1.75`
8. `fontWeight800`: `baseValue: 800` → `baseValue: FONT_WEIGHT_BASE_VALUE * 2`
9. `fontWeight900`: `baseValue: 900` → `baseValue: FONT_WEIGHT_BASE_VALUE * 2.25`

### 2.7 TapAreaTokens.ts

**Status**: 🔧 Verify formula pattern
**BASE_VALUE**: 44 (already defined as `TAP_AREA_BASE_VALUE`)
**Current Pattern**: Already uses `Math.round(TAP_AREA_BASE_VALUE * multiplier)`
**Target Pattern**: Same pattern (verify consistency)
**Total Tokens**: 4 tokens
**Strategic Flexibility Tokens**: None
**Tokens to Refactor**: 4 tokens (verify formula consistency)

**Tokens Requiring Verification**:
1. `tapAreaMinimum`: Verify uses `TAP_AREA_BASE_VALUE`
2. `tapAreaRecommended`: Verify uses `Math.round(TAP_AREA_BASE_VALUE * 1.09)`
3. `tapAreaComfortable`: Verify uses `Math.round(TAP_AREA_BASE_VALUE * 1.27)`
4. `tapAreaGenerous`: Verify uses `Math.round(TAP_AREA_BASE_VALUE * 1.45)`

**Note**: TapAreaTokens.ts already uses formulas but may have inline calculations that need verification for consistency.

---

## Category 3: Categorical Tokens (Exclude from Refactoring) ⛔

These files contain categorical values without mathematical relationships and are explicitly excluded from refactoring.

### 3.1 ColorTokens.ts

**Status**: ⛔ Excluded from refactoring
**BASE_VALUE**: 0 (N/A for hex values)
**Pattern**: Hex color values
**Total Tokens**: Multiple color families (gray, black, white, yellow, orange, purple, violet, cyan, teal)
**Strategic Flexibility Tokens**: N/A
**Refactoring Required**: None

**Rationale**: Color tokens are categorical values (hex codes), not mathematical progressions. The baseValue of 0 is a placeholder, and the actual color values are stored in platform-specific properties.

**Example**:
```typescript
gray500: {
  baseValue: 0,
  platforms: {
    web: { value: '#6B7280', unit: 'hex' },
    ios: { value: '#6B7280', unit: 'hex' },
    android: { value: '#6B7280', unit: 'hex' }
  }
}
```

### 3.2 FontFamilyTokens.ts

**Status**: ⛔ Excluded from refactoring
**BASE_VALUE**: 0 (N/A for categorical tokens)
**Pattern**: Font stack strings
**Total Tokens**: 4 tokens (fontFamilySystem, fontFamilyMono, fontFamilyDisplay, fontFamilyBody)
**Strategic Flexibility Tokens**: N/A
**Refactoring Required**: None

**Rationale**: Font families are categorical selections (font stack strings), not mathematical values. The baseValue of 0 is a placeholder, and the actual font stacks are stored in platform-specific properties.

**Example**:
```typescript
fontFamilySystem: {
  baseValue: 0,
  platforms: {
    web: { value: 'system-ui, -apple-system, sans-serif', unit: 'string' },
    ios: { value: 'SF Pro', unit: 'string' },
    android: { value: 'Roboto', unit: 'string' }
  }
}
```

### 3.3 DensityTokens.ts

**Status**: ⛔ Excluded from refactoring
**BASE_VALUE**: 1.0 (already defined as `DENSITY_BASE_VALUE`)
**Pattern**: Direct multiplier values (0.75, 1.0, 1.25, 1.5)
**Total Tokens**: 4 tokens (densityCompact, densityDefault, densityComfortable, densitySpacious)
**Strategic Flexibility Tokens**: N/A
**Refactoring Required**: None

**Rationale**: Density tokens are already multipliers that are applied to other tokens. They are not derived from BASE_VALUE through mathematical relationships - they ARE the multipliers themselves.

**Example**:
```typescript
densityCompact: {
  baseValue: 0.75,
  mathematicalRelationship: 'Compact density multiplier: 0.75'
}
```

---

## Refactoring Scope Summary

### Files by Category

| Category | Count | Percentage |
|----------|-------|------------|
| Formula-based (no changes) | 6 | 35% |
| Hard-value (need refactoring) | 8 | 47% |
| Categorical (excluded) | 3 | 18% |
| **Total** | **17** | **100%** |

### Tokens by Refactoring Status

| File | Total Tokens | Strategic Flexibility | Tokens to Refactor |
|------|--------------|----------------------|-------------------|
| SpacingTokens.ts | 12 | 3 | 9 |
| RadiusTokens.ts | 12 | 4 | 8 |
| FontSizeTokens.ts | 11 | 0 | 11 (verify) |
| LineHeightTokens.ts | 11 | 0 | 11 |
| LetterSpacingTokens.ts | 5 | 0 | 5 |
| FontWeightTokens.ts | 9 | 0 | 9 |
| TapAreaTokens.ts | 4 | 0 | 4 (verify) |
| **Total** | **64** | **7** | **57** |

### Strategic Flexibility Tokens (Preserve Unchanged)

**Total Strategic Flexibility Tokens**: 13 tokens across 3 files

1. **SpacingTokens.ts** (3 tokens):
   - `space075`: 6 (STRATEGIC_FLEXIBILITY_TOKENS.space075.value)
   - `space125`: 10 (STRATEGIC_FLEXIBILITY_TOKENS.space125.value)
   - `space250`: 20 (STRATEGIC_FLEXIBILITY_TOKENS.space250.value)

2. **RadiusTokens.ts** (4 tokens):
   - `radius075`: 6 (STRATEGIC_FLEXIBILITY_TOKENS.radius075.value)
   - `radius125`: 10 (STRATEGIC_FLEXIBILITY_TOKENS.radius125.value)
   - `radius250`: 20 (STRATEGIC_FLEXIBILITY_TOKENS.radius250.value)
   - `radiusFull`: 9999 (STRATEGIC_FLEXIBILITY_TOKENS.radiusFull.value)

3. **ShadowOffsetTokens.ts** (6 tokens):
   - `n200`: -8 (SHADOW_OFFSET_BASE_VALUE * -2, isStrategicFlexibility: true)
   - `n150`: -6 (SHADOW_OFFSET_BASE_VALUE * -1.5, isStrategicFlexibility: true)
   - `n100`: -4 (SHADOW_OFFSET_BASE_VALUE * -1, isStrategicFlexibility: true)
   - `100`: 4 (SHADOW_OFFSET_BASE_VALUE, isStrategicFlexibility: true)
   - `150`: 6 (SHADOW_OFFSET_BASE_VALUE * 1.5, isStrategicFlexibility: true)
   - `200`: 8 (SHADOW_OFFSET_BASE_VALUE * 2, isStrategicFlexibility: true)

**Note**: ShadowOffsetTokens.ts already uses formulas and is in the "formula-based" category, but its strategic flexibility tokens are listed here for completeness.

---

## Implementation Priorities

### Phase 1: Simple Multipliers (Low Risk)
1. SpacingTokens.ts (9 tokens)
2. RadiusTokens.ts (8 tokens)
3. FontWeightTokens.ts (9 tokens)

**Rationale**: These use straightforward multipliers (0.25x, 0.5x, 1x, 1.5x, etc.) with no rounding required.

### Phase 2: Addition/Subtraction Pattern (Low Risk)
1. LetterSpacingTokens.ts (5 tokens)

**Rationale**: Uses addition/subtraction pattern (BASE_VALUE + offset) which is simple but different from multipliers.

### Phase 3: Complex Formulas with Rounding (Medium Risk)
1. FontSizeTokens.ts (11 tokens - verify)
2. TapAreaTokens.ts (4 tokens - verify)

**Rationale**: Already uses formulas with Math.round() but needs verification for consistency.

### Phase 4: Precision Multipliers (Medium Risk)
1. LineHeightTokens.ts (11 tokens)

**Rationale**: Uses precision multipliers (1.391, 1.231, etc.) that require careful calculation to maintain exact values.

---

## Validation Strategy

### Formula Correctness Validation

For each refactored token, validate that:
1. Formula result matches original hard value exactly
2. mathematicalRelationship string remains unchanged
3. Platform values remain unchanged
4. Strategic flexibility tokens remain unchanged

### Example Validation

**Before**:
```typescript
space150: {
  baseValue: 12,
  mathematicalRelationship: 'base × 1.5 = 8 × 1.5 = 12'
}
```

**After**:
```typescript
space150: {
  baseValue: SPACING_BASE_VALUE * 1.5,
  mathematicalRelationship: 'base × 1.5 = 8 × 1.5 = 12'
}
```

**Validation**:
- ✅ Formula result: `8 * 1.5 = 12` (matches original)
- ✅ mathematicalRelationship: unchanged
- ✅ Platform values: unchanged (generated from baseValue)

---

## Requirements Compliance

This audit report addresses the following requirements:

- **Requirement 1.3**: Audit report listing files by category ✅
- **Requirement 1.4**: Count tokens requiring refactoring per file ✅
- **Requirement 8.1**: Exclude ColorTokens.ts from refactoring scope ✅
- **Requirement 8.2**: Exclude FontFamilyTokens.ts from refactoring scope ✅
- **Requirement 8.3**: Exclude DensityTokens.ts from refactoring scope ✅
- **Requirement 8.4**: Document rationale for categorical token exclusion ✅

---

## Next Steps

1. **Task 2**: Refactor SpacingTokens.ts (9 tokens)
2. **Task 3**: Refactor RadiusTokens.ts (8 tokens)
3. **Task 4**: Refactor FontSizeTokens.ts (11 tokens - verify)
4. **Task 5**: Refactor LineHeightTokens.ts (11 tokens)
5. **Task 6**: Refactor LetterSpacingTokens.ts (5 tokens)
6. **Task 7**: Refactor FontWeightTokens.ts (9 tokens)
7. **Task 8**: Refactor TapAreaTokens.ts (4 tokens - verify)
8. **Task 9**: Run existing tests and verify backward compatibility

---

*This audit report provides the complete refactoring scope for converting primitive token hard values to formulas, enabling systematic implementation across all token files.*
