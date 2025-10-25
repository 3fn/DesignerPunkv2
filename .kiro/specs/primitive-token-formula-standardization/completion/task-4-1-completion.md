# Task 4.1 Completion: Replace Hard Values with FONT_SIZE_BASE_VALUE Formulas

**Date**: October 24, 2025
**Task**: 4.1 Replace hard values with FONT_SIZE_BASE_VALUE formulas
**Type**: Implementation
**Status**: Complete

---

## Artifacts Created

- `src/tokens/FontSizeTokens.ts` (modified) - Replaced hard values with formulas for fontSize500, fontSize600, fontSize700

## Implementation Details

### Approach

Replaced the remaining hard values in FontSizeTokens with formulas using FONT_SIZE_BASE_VALUE and MODULAR_SCALE_RATIO constants. Most tokens (fontSize050 through fontSize400) already used formulas, so the focus was on fontSize500, fontSize600, and fontSize700.

These three tokens required special handling because they are marked as `isPrecisionTargeted: true` and were manually adjusted for 4pt subgrid alignment. The mathematical formulas produce values that are 1 less than the design requirements:

- fontSize500: Math.round produces 32, but design requires 33
- fontSize600: Math.round produces 36, but design requires 37  
- fontSize700: Math.round produces 41, but design requires 42

### Key Decisions

**Decision 1**: Add +1 adjustment to maintain 4pt subgrid alignment
- **Rationale**: The original hard values (33, 37, 42) were intentional design decisions for 4pt subgrid alignment, not mathematical errors. The formulas needed to preserve this design intent.
- **Implementation**: Used `Math.round(FONT_SIZE_BASE_VALUE * Math.pow(MODULAR_SCALE_RATIO, n)) + 1` pattern
- **Alternative**: Could have used different rounding (Math.ceil), but that would change the mathematical relationship

**Decision 2**: Preserve mathematicalRelationship strings unchanged
- **Rationale**: The strings already document the adjustment (e.g., "≈ 32.4 → 33 (adjusted for 4pt subgrid)")
- **Implementation**: Left all mathematicalRelationship strings exactly as they were
- **Benefit**: Maintains human-readable documentation of the design decision

### Formula Patterns Applied

All fontSize tokens now use formulas:

```typescript
// Tokens below base (division)
fontSize050: Math.round(FONT_SIZE_BASE_VALUE / Math.pow(MODULAR_SCALE_RATIO, 2)) // 13
fontSize075: Math.round(FONT_SIZE_BASE_VALUE / MODULAR_SCALE_RATIO) // 14

// Base token
fontSize100: FONT_SIZE_BASE_VALUE // 16

// Tokens above base (multiplication)
fontSize125: Math.round(FONT_SIZE_BASE_VALUE * MODULAR_SCALE_RATIO) // 18
fontSize150: Math.round(FONT_SIZE_BASE_VALUE * Math.pow(MODULAR_SCALE_RATIO, 2)) // 20
fontSize200: Math.round(FONT_SIZE_BASE_VALUE * Math.pow(MODULAR_SCALE_RATIO, 3)) // 23
fontSize300: Math.round(FONT_SIZE_BASE_VALUE * Math.pow(MODULAR_SCALE_RATIO, 4)) // 26
fontSize400: Math.round(FONT_SIZE_BASE_VALUE * Math.pow(MODULAR_SCALE_RATIO, 5)) // 29

// Precision-targeted tokens (4pt subgrid adjusted)
fontSize500: Math.round(FONT_SIZE_BASE_VALUE * Math.pow(MODULAR_SCALE_RATIO, 6)) + 1 // 33
fontSize600: Math.round(FONT_SIZE_BASE_VALUE * Math.pow(MODULAR_SCALE_RATIO, 7)) + 1 // 37
fontSize700: Math.round(FONT_SIZE_BASE_VALUE * Math.pow(MODULAR_SCALE_RATIO, 8)) + 1 // 42
```

### Integration Points

The refactored tokens integrate with:
- Platform value generation functions (generateFontSizePlatformValues)
- Token consumers that access baseValue property
- Cross-platform build system that generates platform-specific files

## Validation (Tier 2: Standard)

### Syntax Validation
✅ getDiagnostics passed - no syntax errors
✅ All imports resolve correctly
✅ Type annotations correct

### Functional Validation
✅ fontSize050 formula produces 13 (matches original)
✅ fontSize075 formula produces 14 (matches original)
✅ fontSize100 formula produces 16 (matches original)
✅ fontSize125 formula produces 18 (matches original)
✅ fontSize150 formula produces 20 (matches original)
✅ fontSize200 formula produces 23 (matches original)
✅ fontSize300 formula produces 26 (matches original)
✅ fontSize400 formula produces 29 (matches original)
✅ fontSize500 formula produces 33 (matches original with 4pt subgrid adjustment)
✅ fontSize600 formula produces 37 (matches original with 4pt subgrid adjustment)
✅ fontSize700 formula produces 42 (matches original with 4pt subgrid adjustment)

### Integration Validation
✅ Tokens export correctly from FontSizeTokens.ts
✅ Token structure unchanged (name, category, baseValue, platforms)
✅ Platform values generated correctly using formulas
✅ All existing tests pass without modification

### Requirements Compliance
✅ Requirement 3.1: baseValue expressed as formula using BASE_VALUE constant
✅ Requirement 3.3: Division pattern used for tokens below base (fontSize050, fontSize075)
✅ Requirement 3.4: Math.round() used where mathematically required
✅ Requirement 5.1: mathematicalRelationship strings preserved unchanged
✅ Requirement 6.1: Math.round() used for modular scale calculations
✅ Requirement 6.4: Rounded values match original hard values (with +1 adjustment for precision-targeted tokens)

## Formula Verification Results

All formulas produce correct values:

| Token | Formula | Result | Expected | Match |
|-------|---------|--------|----------|-------|
| fontSize050 | Math.round(16 / 1.125²) | 13 | 13 | ✅ |
| fontSize075 | Math.round(16 / 1.125) | 14 | 14 | ✅ |
| fontSize100 | 16 | 16 | 16 | ✅ |
| fontSize125 | Math.round(16 × 1.125) | 18 | 18 | ✅ |
| fontSize150 | Math.round(16 × 1.125²) | 20 | 20 | ✅ |
| fontSize200 | Math.round(16 × 1.125³) | 23 | 23 | ✅ |
| fontSize300 | Math.round(16 × 1.125⁴) | 26 | 26 | ✅ |
| fontSize400 | Math.round(16 × 1.125⁵) | 29 | 29 | ✅ |
| fontSize500 | Math.round(16 × 1.125⁶) + 1 | 33 | 33 | ✅ |
| fontSize600 | Math.round(16 × 1.125⁷) + 1 | 37 | 37 | ✅ |
| fontSize700 | Math.round(16 × 1.125⁸) + 1 | 42 | 42 | ✅ |

**100% match rate achieved** - all formulas produce values identical to original hard values.

---

**Organization**: spec-completion
**Scope**: primitive-token-formula-standardization
