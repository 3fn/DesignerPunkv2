# Design Document: Primitive Token Formula Standardization

**Date**: October 24, 2025
**Spec**: primitive-token-formula-standardization
**Status**: Design Phase
**Dependencies**: None

---

## Overview

This design document outlines the approach for refactoring primitive token files from hard-coded values to formula-based values using category-specific BASE_VALUE constants. The refactoring transforms the token system from documentation-based to truth-based mathematical relationships, enabling reliable AI-human collaboration through executable formulas.

The design follows a systematic approach: audit existing tokens, identify refactoring patterns, apply formulas while preserving strategic flexibility tokens, and validate that refactored values match original values. The refactoring is transparent to token consumers and maintains backward compatibility.

---

## Architecture

### High-Level Approach

```
┌─────────────────────────────────────────────────────────────┐
│                    Refactoring Workflow                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  1. Audit Phase  │
                    │  Identify tokens │
                    │  needing refactor│
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ 2. Pattern Phase │
                    │ Determine formula│
                    │ pattern per token│
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ 3. Refactor Phase│
                    │ Apply formulas to│
                    │ baseValue props  │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ 4. Validate Phase│
                    │ Verify formulas  │
                    │ match originals  │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ 5. Test Phase    │
                    │ Run existing tests│
                    │ verify compat    │
                    └──────────────────┘
```

### Token Classification System

Tokens are classified into four categories for refactoring:

1. **Formula Tokens**: Already using formulas (e.g., GlowBlurTokens) - no changes needed
2. **Hard Value Tokens**: Using hard values (e.g., SpacingTokens, RadiusTokens) - need refactoring
3. **Strategic Flexibility Tokens**: Using constant references (e.g., space075) - preserve as-is
4. **Categorical Tokens**: No mathematical relationships (e.g., ColorTokens) - exclude from refactoring

---

## Components and Interfaces

### Token File Structure

Each primitive token file follows this structure:

```typescript
/**
 * [Category] Token Definitions
 * 
 * [Description of token category and mathematical foundation]
 * Base value: [number] units
 * Mathematical progression: [description]
 */

import { PrimitiveToken, TokenCategory, PlatformValues } from '../types/PrimitiveToken';

/**
 * [Category] token base value for mathematical calculations
 */
export const [CATEGORY]_BASE_VALUE = [number];

/**
 * Generate platform values for [category] tokens
 */
function generate[Category]PlatformValues(baseValue: number): PlatformValues {
  return {
    web: { value: baseValue, unit: '[unit]' },
    ios: { value: baseValue, unit: '[unit]' },
    android: { value: baseValue, unit: '[unit]' }
  };
}

/**
 * [Category] tokens with [mathematical description]
 */
export const [category]Tokens: Record<string, PrimitiveToken> = {
  [tokenName]: {
    name: '[tokenName]',
    category: TokenCategory.[CATEGORY],
    baseValue: [CATEGORY]_BASE_VALUE * [multiplier],  // ← Formula, not hard value
    familyBaseValue: [CATEGORY]_BASE_VALUE,
    description: '[description]',
    mathematicalRelationship: '[formula string]',
    baselineGridAlignment: [boolean],
    isStrategicFlexibility: [boolean],
    isPrecisionTargeted: [boolean],
    platforms: generate[Category]PlatformValues([CATEGORY]_BASE_VALUE * [multiplier])
  },
  // ... more tokens
};
```

### Refactoring Patterns

#### Pattern 1: Simple Multiplier

**Before:**
```typescript
space150: {
  baseValue: 12,
  mathematicalRelationship: 'base × 1.5 = 8 × 1.5 = 12',
}
```

**After:**
```typescript
space150: {
  baseValue: SPACING_BASE_VALUE * 1.5,
  mathematicalRelationship: 'base × 1.5 = 8 × 1.5 = 12',
}
```

#### Pattern 2: Simple Divisor

**Before:**
```typescript
fontSize075: {
  baseValue: 14,
  mathematicalRelationship: 'base ÷ 1.125 = 16 ÷ 1.125 ≈ 14',
}
```

**After:**
```typescript
fontSize075: {
  baseValue: Math.round(FONT_SIZE_BASE_VALUE / MODULAR_SCALE_RATIO),
  mathematicalRelationship: 'base ÷ 1.125 = 16 ÷ 1.125 ≈ 14',
}
```

#### Pattern 3: Complex Formula with Rounding

**Before:**
```typescript
fontSize150: {
  baseValue: 20,
  mathematicalRelationship: 'base × (1.125²) = 16 × 1.266 ≈ 20',
}
```

**After:**
```typescript
fontSize150: {
  baseValue: Math.round(FONT_SIZE_BASE_VALUE * Math.pow(MODULAR_SCALE_RATIO, 2)),
  mathematicalRelationship: 'base × (1.125²) = 16 × 1.266 ≈ 20',
}
```

#### Pattern 4: Base Token (100 level)

**Before:**
```typescript
space100: {
  baseValue: 8,
  mathematicalRelationship: 'base × 1 = 8 × 1 = 8',
}
```

**After:**
```typescript
space100: {
  baseValue: SPACING_BASE_VALUE,
  mathematicalRelationship: 'base × 1 = 8 × 1 = 8',
}
```

#### Pattern 5: Strategic Flexibility (Preserve)

**Before and After (unchanged):**
```typescript
space075: {
  baseValue: STRATEGIC_FLEXIBILITY_TOKENS.space075.value,
  isStrategicFlexibility: true,
  mathematicalRelationship: STRATEGIC_FLEXIBILITY_TOKENS.space075.derivation,
}
```

---

## Data Models

### Audit Report Structure

```typescript
interface AuditReport {
  totalFiles: number;
  filesUsingFormulas: string[];
  filesUsingHardValues: string[];
  filesWithMixedPattern: string[];
  categoricalTokens: string[];
  refactoringScope: {
    filesToRefactor: string[];
    tokensToRefactor: number;
    strategicFlexibilityTokens: number;
    excludedTokens: number;
  };
}
```

### Validation Result Structure

```typescript
interface ValidationResult {
  tokenName: string;
  originalValue: number;
  calculatedValue: number;
  matches: boolean;
  formula: string;
  error?: string;
}

interface ValidationReport {
  totalTokens: number;
  validatedTokens: number;
  passedValidation: number;
  failedValidation: number;
  failures: ValidationResult[];
  successRate: number;
}
```

---

## Token Types Excluded from Formula Standardization

### Rationale for Exclusions

Not all token types benefit from formula standardization. The following token families use hard values intentionally:

#### Line Height Tokens

- **Why excluded**: Line heights are design decisions paired with specific fontSize values
- **Example**: `lineHeight150: 1.4` is designed to pair with `fontSize150: 20px` to create 28px total height
- **Rationale**: The relationship is to a specific fontSize, not to a base scale
- **Formula complexity**: Converting `1.4` to `LINE_HEIGHT_BASE_VALUE * 0.933` obscures the design intent

#### Letter Spacing Tokens

- **Why excluded**: Base value is 0, making formulas more complex than hard values
- **Example**: `letterSpacing025: -0.025` is clearer than `LETTER_SPACING_BASE_VALUE - 0.025`
- **Rationale**: When base is 0, formulas add complexity without value
- **Mathematical truth**: `0 - 0.025 = -0.025` is not more meaningful than `-0.025`

#### Font Weight Tokens

- **Why excluded**: Font weights are CSS/OpenType industry standards
- **Example**: `fontWeight700: 700` is a standard "bold" weight defined by spec
- **Rationale**: These are industry standards, not our mathematical scale
- **Standard values**: 100, 200, 300, 400, 500, 600, 700, 800, 900 are fixed by CSS/OpenType specification

#### Tap Area Tokens

- **Why excluded**: Tap areas are accessibility guideline requirements
- **Example**: `tapArea100: 44` is iOS Human Interface Guidelines minimum
- **Rationale**: These are regulatory/guideline-driven values, not mathematical derivations
- **Standards**:
  - 44px minimum (iOS Human Interface Guidelines)
  - 48px minimum (Material Design / Android)
  - 24px minimum (WCAG 2.1 Level AAA for pointer targets)

### Formula Standardization Criteria

**Use formulas when:**
- ✅ Token family forms a **generative scale** (fontSize, spacing, radius)
- ✅ Changing base value would meaningfully affect entire system
- ✅ Mathematical relationships are **generative**, not **descriptive**
- ✅ Formulas are **simpler or equal** in complexity to hard values

**Use hard values when:**
- ✅ Values are **design decisions** paired with specific other tokens
- ✅ Values are **industry standards** or **regulatory requirements**
- ✅ Formulas would be **more complex** than hard values
- ✅ Mathematical relationships are **descriptive**, not **generative**
- ✅ Base value is **0** or another value that makes formulas unnecessarily complex

### Generative vs Descriptive Mathematics

**Generative Mathematics** (use formulas):
- The formula **generates** the value from a base
- Changing the base meaningfully affects the system
- Example: `SPACING_BASE_VALUE * 1.5` - if base changes from 8 to 12, spacing150 becomes 18

**Descriptive Mathematics** (use hard values):
- The formula **describes** a relationship after the fact
- The value is chosen for specific reasons (design, standards, accessibility)
- Example: `fontWeight700: 700` - this is "bold" by CSS spec, not derived from 400

---

## Token Files Requiring Refactoring

Based on the audit and exclusion criteria, the following files require refactoring:

### Files Using Hard Values (Need Refactoring)

1. **SpacingTokens.ts**
   - BASE_VALUE: 8
   - Pattern: Simple multipliers (0.25x, 0.5x, 1.5x, 2x, 3x, 4x, 5x, 6x)
   - Strategic flexibility: space075, space125, space250 (preserve)
   - Tokens to refactor: 9 tokens (excluding 3 strategic flexibility)

2. **RadiusTokens.ts**
   - BASE_VALUE: 8
   - Pattern: Simple multipliers (0x, 0.25x, 0.5x, 1x, 1.5x, 2x, 3x, 4x)
   - Strategic flexibility: radius075, radius125, radius250, radiusFull (preserve)
   - Tokens to refactor: 8 tokens (excluding 4 strategic flexibility)

3. **FontSizeTokens.ts**
   - BASE_VALUE: 16
   - Pattern: Modular scale with Math.pow() and Math.round()
   - Strategic flexibility: None
   - Tokens to refactor: 11 tokens

4. **BorderWidthTokens.ts** (Partial)
   - BASE_VALUE: 1
   - Pattern: Simple multipliers (1x, 2x, 4x)
   - Already uses formulas for borderWidth200 and borderWidth400
   - Tokens to refactor: 1 token (borderWidth100 already uses BASE_VALUE)

### Files Already Using Formulas (No Changes)

1. **GlowBlurTokens.ts** ✅
2. **GlowOpacityTokens.ts** ✅
3. **ShadowBlurTokens.ts** ✅
4. **ShadowOpacityTokens.ts** ✅
5. **ShadowOffsetTokens.ts** ✅

### Files Excluded (Categorical Tokens)

1. **ColorTokens.ts** - No mathematical relationships
2. **FontFamilyTokens.ts** - Categorical values
3. **DensityTokens.ts** - Categorical values

### Files Excluded (Design Decisions & Standards)

1. **LineHeightTokens.ts** - Design decisions paired with specific fontSize values
2. **LetterSpacingTokens.ts** - Base value is 0, formulas add unnecessary complexity
3. **FontWeightTokens.ts** - CSS/OpenType industry standards (100-900)
4. **TapAreaTokens.ts** - Accessibility guideline requirements (44px iOS, 48px Android)

---

## Refactoring Strategy

### Phase 1: Audit and Classification

1. Scan all files in `src/tokens/`
2. Classify each file as: formula-based, hard-value-based, mixed, or categorical
3. Identify strategic flexibility tokens in each file
4. Generate audit report with refactoring scope

### Phase 2: Pattern Identification

For each token requiring refactoring:

1. Identify the mathematical relationship from the `mathematicalRelationship` string
2. Determine if rounding is needed (FontSize, TapArea)
3. Determine if it's a base token (100 level)
4. Determine the formula pattern (multiplier, divisor, complex)

### Phase 3: Formula Application

For each token:

1. Replace hard value with formula using BASE_VALUE constant
2. Preserve the `mathematicalRelationship` string unchanged
3. Apply Math.round() if needed
4. Update platform value generation to use formula

### Phase 4: Validation

For each refactored token:

1. Calculate the formula result
2. Compare to original hard value
3. Report any mismatches
4. Verify 100% match rate before proceeding

### Phase 5: Testing

1. Run existing token tests
2. Verify backward compatibility
3. Confirm no breaking changes

---

## Error Handling

### Validation Errors

**Error Type**: Formula result doesn't match original value

**Handling**:
- Report token name, expected value, calculated value
- Do not proceed with refactoring until resolved
- Investigate formula or rounding requirements

**Example**:
```
Validation Error: fontSize150
Expected: 20
Calculated: 20.25
Formula: FONT_SIZE_BASE_VALUE * Math.pow(MODULAR_SCALE_RATIO, 2)
Resolution: Add Math.round() wrapper
```

### Strategic Flexibility Token Errors

**Error Type**: Strategic flexibility token accidentally refactored

**Handling**:
- Verify `isStrategicFlexibility: true` flag
- Restore original baseValue pattern
- Add to exclusion list

### Backward Compatibility Errors

**Error Type**: Existing tests fail after refactoring

**Handling**:
- Verify formula produces same numeric value
- Check that token structure unchanged
- Verify platform values unchanged

---

## Testing Strategy

### Unit Tests

Test that formulas produce correct values:

```typescript
describe('SpacingTokens Formula Refactoring', () => {
  it('should calculate space150 correctly', () => {
    const expected = 12;
    const calculated = SPACING_BASE_VALUE * 1.5;
    expect(calculated).toBe(expected);
  });

  it('should preserve strategic flexibility tokens', () => {
    const space075 = spacingTokens.space075;
    expect(space075.isStrategicFlexibility).toBe(true);
    expect(space075.baseValue).toBe(STRATEGIC_FLEXIBILITY_TOKENS.space075.value);
  });
});
```

### Integration Tests

Test that token consumers work unchanged:

```typescript
describe('Token Consumer Compatibility', () => {
  it('should return numeric baseValue', () => {
    const space150 = spacingTokens.space150;
    expect(typeof space150.baseValue).toBe('number');
    expect(space150.baseValue).toBe(12);
  });

  it('should return correct platform values', () => {
    const space150 = spacingTokens.space150;
    expect(space150.platforms.web.value).toBe(12);
    expect(space150.platforms.web.unit).toBe('px');
  });
});
```

### Validation Tests

Test that all refactored tokens match original values:

```typescript
describe('Formula Validation', () => {
  it('should validate all spacing tokens', () => {
    const originalValues = {
      space025: 2,
      space050: 4,
      space100: 8,
      space150: 12,
      space200: 16,
      // ... etc
    };

    Object.entries(originalValues).forEach(([name, expected]) => {
      const token = spacingTokens[name];
      expect(token.baseValue).toBe(expected);
    });
  });
});
```

---

## Design Decisions

### Decision 1: Category-Specific BASE_VALUE Naming

**Options Considered**:
1. Single `BASE_VALUE` per file
2. Category-specific naming (e.g., `SPACING_BASE_VALUE`)
3. Universal `BASE_VALUE` across all files

**Decision**: Category-specific naming

**Rationale**:
- Provides clarity when reading code ("SPACING_BASE_VALUE tells me this is for spacing")
- Enables potential cross-file references in future
- Makes AI reasoning more explicit (category is in the constant name)
- Aligns with existing pattern in some files (e.g., `FONT_SIZE_BASE_VALUE`)

**Trade-offs**:
- ✅ **Gained**: Explicit clarity, better AI reasoning, cross-file reference potential
- ❌ **Lost**: Slight verbosity vs single `BASE_VALUE`
- ⚠️ **Risk**: None - this is purely additive clarity

**Counter-Arguments**:
- **Argument**: Single `BASE_VALUE` is simpler and less verbose
- **Response**: The clarity gained for AI collaboration outweighs the minor verbosity. When an AI agent sees `SPACING_BASE_VALUE * 1.5`, it immediately knows this is a spacing calculation.

### Decision 2: Preserve Strategic Flexibility Tokens

**Options Considered**:
1. Refactor strategic flexibility tokens to formulas
2. Preserve existing constant reference pattern
3. Hybrid approach (formula with strategic flexibility flag)

**Decision**: Preserve existing constant reference pattern

**Rationale**:
- Strategic flexibility tokens already use constant references (correct pattern)
- The `STRATEGIC_FLEXIBILITY_TOKENS` constant enables usage tracking
- Refactoring would break the ≥80% usage tracking system
- No benefit to changing what's already correct

**Trade-offs**:
- ✅ **Gained**: Preserved usage tracking, no risk of breaking existing system
- ❌ **Lost**: Slight inconsistency (some tokens use formulas, some use constants)
- ⚠️ **Risk**: None - preserving working system

**Counter-Arguments**:
- **Argument**: All tokens should use the same pattern for consistency
- **Response**: Strategic flexibility tokens serve a different purpose (tracked exceptions). The constant reference is the correct pattern for this use case.

### Decision 3: Math.round() Only Where Necessary

**Options Considered**:
1. Use Math.round() on all formulas for consistency
2. Use Math.round() only where mathematically required
3. Use Math.floor() or Math.ceil() for specific cases

**Decision**: Math.round() only where mathematically required

**Rationale**:
- FontSize uses modular scale (produces decimals, needs rounding)
- TapArea uses accessibility multipliers (produces decimals, needs rounding)
- Spacing, Radius, BorderWidth use whole number multipliers (no rounding needed)
- Unnecessary rounding adds complexity without benefit

**Trade-offs**:
- ✅ **Gained**: Simpler formulas where rounding not needed, explicit where it is
- ❌ **Lost**: Slight inconsistency in formula patterns
- ⚠️ **Risk**: None - rounding only applied where mathematically necessary

**Counter-Arguments**:
- **Argument**: Consistent Math.round() everywhere is simpler
- **Response**: Unnecessary Math.round() obscures the mathematical truth. If `SPACING_BASE_VALUE * 2` produces 16, wrapping it in Math.round() adds no value and suggests the calculation might produce decimals when it doesn't.

### Decision 4: Defer Cross-Token Dependencies

**Options Considered**:
1. Make LineHeight formulas reference FontSize tokens
2. Keep LineHeight as simple multipliers
3. Create a dependency resolution system

**Decision**: Keep LineHeight as simple multipliers

**Rationale**:
- Cross-token dependencies are complex and delicate
- LineHeight values are precision-targeted for vertical rhythm
- The relationship to FontSize is documented in the `mathematicalRelationship` string
- Refactoring to reference FontSize tokens is a separate, larger effort

**Trade-offs**:
- ✅ **Gained**: Simpler refactoring, lower risk, focused scope
- ❌ **Lost**: LineHeight doesn't automatically update if FontSize changes
- ⚠️ **Risk**: None for this refactoring - deferred to future work

**Counter-Arguments**:
- **Argument**: LineHeight should reference FontSize for true mathematical relationships
- **Response**: Agreed, but this is a separate architectural decision that requires careful design. The current refactoring focuses on converting hard values to formulas within each token category. Cross-token dependencies are explicitly out of scope.

### Decision 5: Preserve mathematicalRelationship Strings

**Options Considered**:
1. Remove mathematicalRelationship strings (formula is in code now)
2. Preserve strings as human-readable documentation
3. Generate strings programmatically from formulas

**Decision**: Preserve strings as human-readable documentation

**Rationale**:
- Strings provide quick human-readable reference
- Strings include final calculated values (helpful for humans)
- Strings serve as validation (should match formula in code)
- Removing them reduces human readability without benefit

**Trade-offs**:
- ✅ **Gained**: Human-readable documentation, validation reference
- ❌ **Lost**: Potential for string/formula mismatch if not validated
- ⚠️ **Risk**: Low - validation ensures string matches formula

**Counter-Arguments**:
- **Argument**: Strings are redundant now that formulas are in code
- **Response**: Strings serve humans, formulas serve machines. The string `'base × 1.5 = 8 × 1.5 = 12'` is much faster to read than parsing `SPACING_BASE_VALUE * 1.5`. Both serve important purposes.

---

## Integration Points

### Token Consumers

Token consumers (components, semantic tokens) access tokens through:

```typescript
import { spacingTokens } from '@/tokens/SpacingTokens';

const spacing = spacingTokens.space150.baseValue; // Returns 12 (number)
```

**Integration Impact**: None - consumers receive the same numeric values as before.

### Platform Generators

Platform generators use token values to generate platform-specific files:

```typescript
const webValue = token.platforms.web.value; // Returns numeric value
const webUnit = token.platforms.web.unit;   // Returns 'px'
```

**Integration Impact**: None - platform values remain unchanged.

### Validation System

The three-tier validation system checks token values:

```typescript
const isBaselineAligned = token.baselineGridAlignment;
const isStrategicFlex = token.isStrategicFlexibility;
```

**Integration Impact**: None - validation flags remain unchanged.

---

## Migration Path

This refactoring is transparent to consumers - no migration needed. The changes are internal to token definition files.

**Before (consumer code):**
```typescript
const spacing = spacingTokens.space150.baseValue; // 12
```

**After (consumer code):**
```typescript
const spacing = spacingTokens.space150.baseValue; // Still 12
```

---

*This design document provides the technical approach for refactoring primitive tokens from hard values to formulas, enabling machine-readable mathematical relationships while maintaining backward compatibility.*
