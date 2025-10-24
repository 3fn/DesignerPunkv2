# Token Category Pattern Guide

**Date**: October 23, 2025
**Purpose**: Definitive guide for adding new token categories to the DesignerPunk token system
**Organization**: process-standard
**Scope**: cross-project

---

## Introduction

This guide documents the established patterns for adding new token categories to the DesignerPunk token system. Following these patterns ensures consistency, maintainability, and proper integration with the existing token infrastructure.

**When to use this guide**: When creating a new token category (e.g., BorderWidthTokens, OpacityTokens, etc.)

**Key Principle**: Tokens are consumed directly from their definition files. There are no registration functions or separate registration steps. The token objects themselves contain all necessary metadata.

---

## Primitive Token Structure

### PrimitiveToken Object Format

All primitive tokens must be exported as complete `PrimitiveToken` objects with all required fields:

```typescript
import { PrimitiveToken, TokenCategory, PlatformValues } from '../types/PrimitiveToken';

export const tokenFamilyTokens: Record<string, PrimitiveToken> = {
  tokenName: {
    name: 'tokenName',                           // Token identifier
    category: TokenCategory.TOKEN_FAMILY,        // Token category enum
    baseValue: 8,                                // Numeric base value
    familyBaseValue: 8,                          // Family base value for calculations
    description: 'Token description',            // Human-readable description
    mathematicalRelationship: 'base × 1 = 8',   // Mathematical expression
    baselineGridAlignment: true,                 // Whether value aligns to baseline grid
    isStrategicFlexibility: false,               // Whether this is a strategic flexibility token
    isPrecisionTargeted: false,                  // Whether value is precision-adjusted
    platforms: {                                 // Platform-specific values
      web: { value: 8, unit: 'px' },
      ios: { value: 8, unit: 'pt' },
      android: { value: 8, unit: 'dp' }
    }
  }
};
```

### Required Metadata Fields

Every `PrimitiveToken` object must include:

- **name**: String identifier matching the object key
- **category**: TokenCategory enum value (e.g., `TokenCategory.SPACING`)
- **baseValue**: Numeric value for the token
- **familyBaseValue**: Base value for the entire token family (used for mathematical relationships)
- **description**: Human-readable description of the token's purpose
- **mathematicalRelationship**: String expressing the mathematical derivation (e.g., "base × 2 = 8 × 2 = 16")
- **baselineGridAlignment**: Boolean indicating if value aligns to 8-unit baseline grid
- **isStrategicFlexibility**: Boolean indicating if this is a strategic flexibility exception
- **isPrecisionTargeted**: Boolean indicating if value is precision-adjusted for subgrid alignment
- **platforms**: Object with platform-specific values (web, ios, android)

### Export Pattern

Primitive token files must export:

1. **Token objects**: `Record<string, PrimitiveToken>` containing all tokens
2. **Base value constant**: `FAMILY_BASE_VALUE` for the token family
3. **Token names array**: Array of token names for type safety
4. **Helper functions**: `getToken()` and `getAllTokens()` for convenient access

```typescript
// Export token objects
export const tokenFamilyTokens: Record<string, PrimitiveToken> = {
  // ... token definitions
};

// Export base value constant
export const TOKEN_FAMILY_BASE_VALUE = 8;

// Export token names array
export const tokenFamilyTokenNames = Object.keys(tokenFamilyTokens);

// Export helper functions
export function getTokenFamilyToken(name: string): PrimitiveToken | undefined {
  return tokenFamilyTokens[name];
}

export function getAllTokenFamilyTokens(): PrimitiveToken[] {
  return Object.values(tokenFamilyTokens);
}
```

### Example: SpacingTokens.ts

See `src/tokens/SpacingTokens.ts` for a complete example of primitive tokens with:
- Strategic flexibility tokens (space075, space125, space250)
- Mathematical relationships with explicit expressions
- Baseline grid alignment tracking
- Platform-specific value generation

### Example: FontSizeTokens.ts

See `src/tokens/FontSizeTokens.ts` for a complete example of primitive tokens with:
- Modular scale mathematical progression
- Precision-targeted adjustments for subgrid alignment
- Complex mathematical relationships (powers of modular scale ratio)

---

## Semantic Token Structure

### Semantic Token Format

Semantic tokens reference primitive tokens using the `{ value: 'primitiveTokenName' }` format:

```typescript
interface SemanticTokenStructure {
  value: string;  // Primitive token name (e.g., 'space100', 'fontSize100')
}

export const semanticTokenFamily = {
  tokenName: { value: 'primitiveTokenName' } as SemanticTokenStructure
};
```

### Nested Object Structure

For hierarchical semantic tokens, use nested objects:

```typescript
export const layoutSpacing = {
  grouped: {
    tight: { value: 'space050' },
    normal: { value: 'space100' },
    loose: { value: 'space150' }
  },
  related: {
    tight: { value: 'space100' },
    normal: { value: 'space200' },
    loose: { value: 'space300' }
  }
};
```

### Multi-Primitive Composition

For semantic tokens that compose multiple primitives (like typography), use object with multiple references:

```typescript
export const typographyTokens = {
  'typography.body': {
    name: 'typography.body',
    primitiveReferences: {
      fontSize: 'fontSize100',
      lineHeight: 'lineHeight100',
      fontFamily: 'fontFamilyBody',
      fontWeight: 'fontWeight400',
      letterSpacing: 'letterSpacing100'
    },
    category: SemanticCategory.TYPOGRAPHY,
    context: 'Standard body text for paragraphs',
    description: 'Body typography with 16px font size, 1.5 line height'
  }
};
```

### No Registration Functions

**IMPORTANT**: Semantic tokens do NOT use registration functions. They are consumed directly from their definition files.

❌ **WRONG - Don't create registration functions**:
```typescript
// Don't do this!
export function registerSemanticTokens(registry: SemanticTokenRegistry) {
  registry.register('tokenName', { value: 'primitiveTokenName' });
}
```

✅ **CORRECT - Export tokens directly**:
```typescript
// Do this instead!
export const semanticTokenFamily = {
  tokenName: { value: 'primitiveTokenName' }
};
```

### Example: semantic/SpacingTokens.ts

See `src/tokens/semantic/SpacingTokens.ts` for a complete example of semantic tokens with:
- Nested hierarchical structure (grouped, related, separated, sectioned)
- Clear contextual descriptions
- Primitive token references using `{ value: 'primitiveTokenName' }` format

### Example: semantic/TypographyTokens.ts

See `src/tokens/semantic/TypographyTokens.ts` for a complete example of semantic tokens with:
- Multi-primitive composition (fontSize, lineHeight, fontFamily, fontWeight, letterSpacing)
- Comprehensive context and description fields
- Helper functions for token access

---

## File Organization Pattern

### Directory Structure

```
src/tokens/
├── TokenFamilyTokens.ts              # Primitive token definitions
├── semantic/
│   └── TokenFamilyTokens.ts          # Semantic token definitions
├── __tests__/
│   └── TokenFamilyTokens.test.ts     # Primitive token tests
└── index.ts                          # Token system integration
```

### Primitive Token File

**Location**: `src/tokens/TokenFamilyTokens.ts`

**Contents**:
- Import statements for types
- Base value constant
- Helper function for platform values (if needed)
- Token object definitions
- Token names array
- Helper functions (getToken, getAllTokens)

**Template**:
```typescript
/**
 * Token Family Token Definitions
 * 
 * [Description of token family and mathematical foundation]
 */

import { PrimitiveToken, TokenCategory, PlatformValues } from '../types/PrimitiveToken';

export const TOKEN_FAMILY_BASE_VALUE = 8;

function generatePlatformValues(baseValue: number): PlatformValues {
  return {
    web: { value: baseValue, unit: 'px' },
    ios: { value: baseValue, unit: 'pt' },
    android: { value: baseValue, unit: 'dp' }
  };
}

export const tokenFamilyTokens: Record<string, PrimitiveToken> = {
  // Token definitions here
};

export const tokenFamilyTokenNames = Object.keys(tokenFamilyTokens);

export function getTokenFamilyToken(name: string): PrimitiveToken | undefined {
  return tokenFamilyTokens[name];
}

export function getAllTokenFamilyTokens(): PrimitiveToken[] {
  return Object.values(tokenFamilyTokens);
}
```

### Semantic Token File

**Location**: `src/tokens/semantic/TokenFamilyTokens.ts`

**Contents**:
- Documentation header
- Interface definitions (if needed)
- Semantic token definitions
- Helper functions (optional)

**Template**:
```typescript
/**
 * Semantic Token Family Token Definitions
 * 
 * [Description of semantic token purpose and usage patterns]
 */

interface TokenFamilySemanticToken {
  value: string;
}

export const semanticTokenFamily = {
  tokenName: { value: 'primitiveTokenName' } as TokenFamilySemanticToken
};
```

### Test File

**Location**: `src/tokens/__tests__/TokenFamilyTokens.test.ts`

**Contents**:
- Tests for PrimitiveToken object structure
- Tests for mathematical relationships
- Tests for helper functions
- Tests for token names array
- Tests for platform values

**Template**:
```typescript
import { tokenFamilyTokens, getTokenFamilyToken, getAllTokenFamilyTokens, tokenFamilyTokenNames, TOKEN_FAMILY_BASE_VALUE } from '../TokenFamilyTokens';
import { TokenCategory } from '../../types/PrimitiveToken';

describe('TokenFamilyTokens', () => {
  describe('Token Structure', () => {
    test('all tokens have required PrimitiveToken fields', () => {
      Object.values(tokenFamilyTokens).forEach(token => {
        expect(token).toHaveProperty('name');
        expect(token).toHaveProperty('category');
        expect(token).toHaveProperty('baseValue');
        expect(token).toHaveProperty('familyBaseValue');
        expect(token).toHaveProperty('description');
        expect(token).toHaveProperty('mathematicalRelationship');
        expect(token).toHaveProperty('baselineGridAlignment');
        expect(token).toHaveProperty('isStrategicFlexibility');
        expect(token).toHaveProperty('isPrecisionTargeted');
        expect(token).toHaveProperty('platforms');
      });
    });
  });

  describe('Mathematical Relationships', () => {
    test('token values follow mathematical relationships', () => {
      expect(tokenFamilyTokens.token200.baseValue).toBe(TOKEN_FAMILY_BASE_VALUE * 2);
    });
  });

  describe('Helper Functions', () => {
    test('getTokenFamilyToken returns correct token', () => {
      const token = getTokenFamilyToken('token100');
      expect(token).toBeDefined();
      expect(token?.name).toBe('token100');
    });

    test('getAllTokenFamilyTokens returns all tokens', () => {
      const tokens = getAllTokenFamilyTokens();
      expect(tokens.length).toBe(Object.keys(tokenFamilyTokens).length);
    });
  });
});
```

### Index Integration

**Location**: `src/tokens/index.ts`

**Integration Steps**:

1. Import token family exports
2. Add to `allTokens` object
3. Add to `TOKEN_FAMILY_BASE_VALUES` object
4. Update `getAllTokens()` function
5. Update `getTokensByCategory()` function

**Template**:
```typescript
// Import token family
import {
  tokenFamilyTokens,
  tokenFamilyTokenNames,
  getTokenFamilyToken,
  getAllTokenFamilyTokens,
  TOKEN_FAMILY_BASE_VALUE
} from './TokenFamilyTokens';

// Add to allTokens object
export const allTokens = {
  [TokenCategory.TOKEN_FAMILY]: tokenFamilyTokens,
  // ... other token families
};

// Add to base values
export const TOKEN_FAMILY_BASE_VALUES = {
  [TokenCategory.TOKEN_FAMILY]: TOKEN_FAMILY_BASE_VALUE,
  // ... other base values
};

// Export token family
export {
  tokenFamilyTokens,
  tokenFamilyTokenNames,
  getTokenFamilyToken,
  getAllTokenFamilyTokens,
  TOKEN_FAMILY_BASE_VALUE
};
```

---

## What NOT to Do

### ❌ Don't Export Simple Values

**WRONG**:
```typescript
// Don't export simple numeric values
export const BorderWidthTokens = {
  borderWidth100: 1,
  borderWidth200: 2,
  borderWidth400: 4
};
```

**CORRECT**:
```typescript
// Export complete PrimitiveToken objects
export const borderWidthTokens: Record<string, PrimitiveToken> = {
  borderWidth100: {
    name: 'borderWidth100',
    category: TokenCategory.BORDER_WIDTH,
    baseValue: 1,
    familyBaseValue: 1,
    description: 'Base border width',
    mathematicalRelationship: 'base × 1 = 1',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { value: 1, unit: 'px' },
      ios: { value: 1, unit: 'pt' },
      android: { value: 1, unit: 'dp' }
    }
  }
};
```

### ❌ Don't Create Registration Functions

**WRONG**:
```typescript
// Don't create registration functions
export function registerBorderWidthTokens(registry: PrimitiveTokenRegistry) {
  registry.register('borderWidth100', borderWidthTokens.borderWidth100);
  registry.register('borderWidth200', borderWidthTokens.borderWidth200);
}
```

**CORRECT**:
```typescript
// Tokens are consumed directly from definition files
// No registration functions needed
export const borderWidthTokens: Record<string, PrimitiveToken> = {
  // Token definitions
};
```

### ❌ Don't Create Tests for Registration

**WRONG**:
```typescript
// Don't test registration functions
describe('registerBorderWidthTokens', () => {
  test('registers tokens with registry', () => {
    const registry = new PrimitiveTokenRegistry();
    registerBorderWidthTokens(registry);
    expect(registry.getToken('borderWidth100')).toBeDefined();
  });
});
```

**CORRECT**:
```typescript
// Test token structure and mathematical relationships
describe('BorderWidthTokens', () => {
  test('all tokens have required PrimitiveToken fields', () => {
    Object.values(borderWidthTokens).forEach(token => {
      expect(token).toHaveProperty('name');
      expect(token).toHaveProperty('category');
      // ... test all required fields
    });
  });

  test('mathematical relationships are correct', () => {
    expect(borderWidthTokens.borderWidth200.baseValue).toBe(
      borderWidthTokens.borderWidth100.baseValue * 2
    );
  });
});
```

### ❌ Don't Import Primitive Tokens in Semantic Token Files

**WRONG**:
```typescript
// Don't import primitive token objects
import { BorderWidthTokens } from '../BorderWidthTokens';

export const SemanticBorderWidthTokens = {
  borderDefault: BorderWidthTokens.borderWidth100  // Direct object reference
};
```

**CORRECT**:
```typescript
// Use string references to primitive token names
export const semanticBorderWidthTokens = {
  borderDefault: { value: 'borderWidth100' }  // String reference
};
```

---

## Complete Checklist for Adding New Token Categories

### Phase 1: Planning

- [ ] Define token category purpose and use cases
- [ ] Determine mathematical foundation (base value, progression)
- [ ] Identify platform-specific considerations
- [ ] Review existing token patterns for consistency

### Phase 2: Primitive Token Implementation

- [ ] Create `src/tokens/TokenFamilyTokens.ts` file
- [ ] Define `TOKEN_FAMILY_BASE_VALUE` constant
- [ ] Create platform value generation function (if needed)
- [ ] Define token objects as `Record<string, PrimitiveToken>`
- [ ] Include all required PrimitiveToken fields for each token
- [ ] Export `tokenFamilyTokenNames` array
- [ ] Export `getTokenFamilyToken()` helper function
- [ ] Export `getAllTokenFamilyTokens()` helper function
- [ ] Add JSDoc comments for all exports

### Phase 3: Semantic Token Implementation

- [ ] Create `src/tokens/semantic/TokenFamilyTokens.ts` file
- [ ] Define semantic token structure using `{ value: 'primitiveTokenName' }` format
- [ ] Use nested objects for hierarchical tokens (if applicable)
- [ ] Add contextual descriptions for each semantic token
- [ ] Export semantic token objects
- [ ] Add helper functions (optional)
- [ ] Add JSDoc comments for all exports

### Phase 4: Testing

- [ ] Create `src/tokens/__tests__/TokenFamilyTokens.test.ts` file
- [ ] Test PrimitiveToken object structure (all required fields present)
- [ ] Test mathematical relationships between tokens
- [ ] Test helper functions (getToken, getAllTokens)
- [ ] Test token names array matches exported tokens
- [ ] Test platform values are correct
- [ ] Test baselineGridAlignment values
- [ ] Test isStrategicFlexibility values
- [ ] Run tests and verify all pass

### Phase 5: Index Integration

- [ ] Import token family exports in `src/tokens/index.ts`
- [ ] Add token family to `allTokens` object
- [ ] Add base value to `TOKEN_FAMILY_BASE_VALUES` object
- [ ] Update `getAllTokens()` function to include new tokens
- [ ] Update `getTokensByCategory()` function to handle new category
- [ ] Export all token family exports
- [ ] Test that tokens are accessible via index exports

### Phase 6: Documentation

- [ ] Update `docs/token-system-overview.md` with new token category
- [ ] Add token category to appropriate section (Primitive or Semantic)
- [ ] Include file path, description, base value, and scale information
- [ ] Add cross-references to related guides (if applicable)
- [ ] Create usage guides for the new token category (if needed)

### Phase 7: Validation

- [ ] Run `getDiagnostics` to check for syntax errors
- [ ] Run all tests to verify no regressions
- [ ] Verify tokens accessible via `getAllTokens()`
- [ ] Verify tokens accessible via `getTokensByCategory()`
- [ ] Verify tokens accessible via `getTokenByName()`
- [ ] Test cross-platform generation (if applicable)
- [ ] Review code for consistency with existing patterns

---

## Cross-References to Example Files

### Primitive Token Examples

- **SpacingTokens.ts** (`src/tokens/SpacingTokens.ts`)
  - Example of primitive tokens with strategic flexibility
  - Shows baseline grid alignment tracking
  - Demonstrates mathematical relationship expressions
  - Includes platform value generation function

- **FontSizeTokens.ts** (`src/tokens/FontSizeTokens.ts`)
  - Example of primitive tokens with modular scale
  - Shows precision-targeted adjustments
  - Demonstrates complex mathematical relationships (powers)
  - Includes REM unit conversion for web platform

### Semantic Token Examples

- **semantic/SpacingTokens.ts** (`src/tokens/semantic/SpacingTokens.ts`)
  - Example of semantic tokens with nested structure
  - Shows hierarchical organization (grouped, related, separated, sectioned)
  - Demonstrates contextual descriptions
  - Includes AI agent guidance comments

- **semantic/TypographyTokens.ts** (`src/tokens/semantic/TypographyTokens.ts`)
  - Example of semantic tokens composing multiple primitives
  - Shows multi-primitive composition pattern
  - Demonstrates comprehensive metadata (name, primitiveReferences, category, context, description)
  - Includes helper functions for token access

---

## Summary

This guide provides the definitive patterns for adding new token categories to the DesignerPunk token system. Key principles:

1. **Export PrimitiveToken objects** with all required metadata fields
2. **No registration functions** - tokens are consumed directly from definition files
3. **Use string references** in semantic tokens (`{ value: 'primitiveTokenName' }`)
4. **Follow established file organization** (tokens/, semantic/, __tests__/, index.ts)
5. **Test token structure** and mathematical relationships, not registration
6. **Integrate with index.ts** for system-wide access

Following these patterns ensures consistency, maintainability, and proper integration with the existing token infrastructure.

---

*This pattern guide prevents common mistakes and ensures new token categories follow established system patterns.*
