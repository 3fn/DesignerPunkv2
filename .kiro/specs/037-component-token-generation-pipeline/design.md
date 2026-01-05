# Design Document: Component Token Generation Pipeline

**Date**: January 5, 2026
**Spec**: 037 - Component Token Generation Pipeline
**Status**: Design Phase
**Dependencies**: 
- Spec 035 (Button-Icon Component) - QA validation case, complete
- Rosetta System principles - Token architecture foundation
- Primitive/Semantic token pipeline - Pattern to follow

---

## Overview

This design document describes the architecture for integrating component tokens into the Rosetta System generation pipeline. The solution introduces a hybrid component token authoring system (`defineComponentTokens()`) that provides lightweight authoring while producing rich metadata for pipeline integration.

**Core Problem**: Component tokens exist but are disconnected from the generation pipeline. Platform files contain hard-coded values instead of consuming generated tokens.

**Solution**: A three-part system:
1. **Architecture Documentation** - `Rosetta-System-Architecture.md` steering doc for AI agents
2. **Hybrid Authoring API** - `defineComponentTokens()` helper with lightweight syntax and rich metadata
3. **Pipeline Integration** - Registry, validation, and generation infrastructure

---

## Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        COMPONENT TOKEN AUTHORING                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  src/components/*/tokens.ts                                                  │
│  ├── defineComponentTokens({ component, family, tokens })                   │
│  └── Returns: usable token values + registers with global registry          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        COMPONENT TOKEN REGISTRY                              │
├─────────────────────────────────────────────────────────────────────────────┤
│  src/registries/ComponentTokenRegistry.ts                                    │
│  ├── register(componentTokens) - Called by defineComponentTokens()          │
│  ├── getAll() - All component tokens                                        │
│  ├── getByComponent(name) - Tokens for specific component                   │
│  └── getByFamily(family) - Tokens by token family                           │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        VALIDATION LAYER                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│  src/integration/ValidationCoordinator.ts (updated)                          │
│  ├── validateComponentToken() - Single token validation                     │
│  ├── validateComponentTokens() - Batch validation                           │
│  └── Family-aware validation (formula-based vs other patterns)              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        GENERATION LAYER                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│  src/generators/TokenFileGenerator.ts (updated)                              │
│  ├── generateComponentTokens() - Component token generation                 │
│  ├── WebFormatGenerator - CSS custom properties                             │
│  ├── iOSFormatGenerator - Swift constants                                   │
│  └── AndroidFormatGenerator - Kotlin constants                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        PLATFORM OUTPUT                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│  dist/ComponentTokens.web.css                                                │
│  dist/ComponentTokens.ios.swift                                              │
│  dist/ComponentTokens.android.kt                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Authoring**: Developer calls `defineComponentTokens()` in component's token file
2. **Registration**: Helper registers tokens with global `ComponentTokenRegistry`
3. **Validation**: `ValidationCoordinator` validates tokens (reasoning required, valid reference or family-conformant value)
4. **Generation**: `TokenFileGenerator` generates platform-specific output
5. **Consumption**: Platform files import generated tokens instead of hard-coded values

---

## Components and Interfaces

### defineComponentTokens() Helper

The core authoring API that bridges lightweight syntax with rich metadata.

```typescript
// src/build/tokens/defineComponentTokens.ts

import { ComponentTokenRegistry } from '../../registries/ComponentTokenRegistry';

/**
 * Token definition with primitive reference
 */
interface TokenWithReference<T> {
  /** Reference to existing primitive token */
  reference: T;
  /** Required explanation of why this token exists */
  reasoning: string;
}

/**
 * Token definition with family-conformant value
 */
interface TokenWithValue {
  /** Value conforming to family's value definition pattern */
  value: number;
  /** Required explanation of why this token exists */
  reasoning: string;
}

/**
 * Union type for token definitions
 */
type TokenDefinition<T> = TokenWithReference<T> | TokenWithValue;

/**
 * Configuration for defineComponentTokens()
 */
interface ComponentTokenConfig<T extends Record<string, TokenDefinition<unknown>>> {
  /** Component name (e.g., 'ButtonIcon') */
  component: string;
  /** Token family (e.g., 'spacing', 'fontSize', 'radius') */
  family: string;
  /** Token definitions */
  tokens: T;
}

/**
 * Registered component token with full metadata
 */
interface RegisteredComponentToken {
  /** Full token name (e.g., 'buttonIcon.inset.large') */
  name: string;
  /** Component this token belongs to */
  component: string;
  /** Token family */
  family: string;
  /** Resolved numeric value */
  value: number;
  /** Reference to primitive token (if applicable) */
  primitiveReference?: string;
  /** Explanation of why this token exists */
  reasoning: string;
}

/**
 * Return type: usable token values
 */
type ComponentTokenValues<T> = {
  [K in keyof T]: number;
};

/**
 * Define component tokens with explicit metadata.
 * Registers tokens with global registry and returns usable values.
 */
function defineComponentTokens<T extends Record<string, TokenDefinition<unknown>>>(
  config: ComponentTokenConfig<T>
): ComponentTokenValues<T> {
  const { component, family, tokens } = config;
  const values: Record<string, number> = {};
  const registeredTokens: RegisteredComponentToken[] = [];

  for (const [key, definition] of Object.entries(tokens)) {
    const tokenName = `${component.toLowerCase()}.${key}`;
    
    if ('reference' in definition) {
      // Token with primitive reference
      const primitiveToken = definition.reference as { baseValue: number; name?: string };
      values[key] = primitiveToken.baseValue;
      registeredTokens.push({
        name: tokenName,
        component,
        family,
        value: primitiveToken.baseValue,
        primitiveReference: primitiveToken.name,
        reasoning: definition.reasoning,
      });
    } else {
      // Token with family-conformant value
      values[key] = definition.value;
      registeredTokens.push({
        name: tokenName,
        component,
        family,
        value: definition.value,
        reasoning: definition.reasoning,
      });
    }
  }

  // Register with global registry
  ComponentTokenRegistry.registerBatch(component, registeredTokens);

  return values as ComponentTokenValues<T>;
}

export { defineComponentTokens, ComponentTokenConfig, RegisteredComponentToken };
```

### ComponentTokenRegistry

Global registry for collecting and querying component tokens.

```typescript
// src/registries/ComponentTokenRegistry.ts

import { RegisteredComponentToken } from '../build/tokens/defineComponentTokens';

/**
 * Global registry for component tokens.
 * Follows same pattern as PrimitiveTokenRegistry and SemanticTokenRegistry.
 */
class ComponentTokenRegistryImpl {
  private tokens: Map<string, RegisteredComponentToken> = new Map();
  private byComponent: Map<string, RegisteredComponentToken[]> = new Map();
  private byFamily: Map<string, RegisteredComponentToken[]> = new Map();

  /**
   * Register a batch of component tokens
   */
  registerBatch(component: string, tokens: RegisteredComponentToken[]): void {
    for (const token of tokens) {
      // Check for conflicts
      if (this.tokens.has(token.name)) {
        throw new Error(
          `Component token conflict: "${token.name}" already registered by ` +
          `${this.tokens.get(token.name)!.component}. ` +
          `Attempted registration by ${component}.`
        );
      }

      this.tokens.set(token.name, token);

      // Index by component
      if (!this.byComponent.has(component)) {
        this.byComponent.set(component, []);
      }
      this.byComponent.get(component)!.push(token);

      // Index by family
      if (!this.byFamily.has(token.family)) {
        this.byFamily.set(token.family, []);
      }
      this.byFamily.get(token.family)!.push(token);
    }
  }

  /**
   * Get all registered component tokens
   */
  getAll(): RegisteredComponentToken[] {
    return Array.from(this.tokens.values());
  }

  /**
   * Get tokens for a specific component
   */
  getByComponent(componentName: string): RegisteredComponentToken[] {
    return this.byComponent.get(componentName) || [];
  }

  /**
   * Get tokens by token family
   */
  getByFamily(familyName: string): RegisteredComponentToken[] {
    return this.byFamily.get(familyName) || [];
  }

  /**
   * Check if a token exists
   */
  has(tokenName: string): boolean {
    return this.tokens.has(tokenName);
  }

  /**
   * Get a specific token by name
   */
  get(tokenName: string): RegisteredComponentToken | undefined {
    return this.tokens.get(tokenName);
  }

  /**
   * Clear registry (for testing)
   */
  clear(): void {
    this.tokens.clear();
    this.byComponent.clear();
    this.byFamily.clear();
  }
}

// Singleton instance
export const ComponentTokenRegistry = new ComponentTokenRegistryImpl();
```

### ValidationCoordinator Updates

Add component token validation to existing coordinator.

```typescript
// src/integration/ValidationCoordinator.ts (additions)

import { RegisteredComponentToken } from '../build/tokens/defineComponentTokens';
import { ComponentTokenRegistry } from '../registries/ComponentTokenRegistry';

interface ComponentTokenValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate a single component token
 */
function validateComponentToken(token: RegisteredComponentToken): ComponentTokenValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Rule 1: Reasoning is required
  if (!token.reasoning || token.reasoning.trim() === '') {
    errors.push(`Token "${token.name}" is missing required reasoning.`);
  }

  // Rule 2: Must have either primitive reference or family-conformant value
  if (token.primitiveReference) {
    // Validate primitive reference exists in PrimitiveTokenRegistry
    const { PrimitiveTokenRegistry } = require('../../registries/PrimitiveTokenRegistry');
    if (!PrimitiveTokenRegistry.has(token.primitiveReference)) {
      errors.push(
        `Token "${token.name}" references non-existent primitive "${token.primitiveReference}".`
      );
    }
  } else {
    // Validate value conforms to family pattern
    const familyValidation = validateFamilyConformance(token.family, token.value);
    if (!familyValidation.valid) {
      errors.push(
        `Token "${token.name}" value ${token.value} does not conform to ` +
        `${token.family} family pattern. ${familyValidation.message}`
      );
    }
    // Collect warnings (e.g., value matches existing primitive)
    if (familyValidation.warning) {
      warnings.push(`Token "${token.name}": ${familyValidation.warning}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Family-aware value validation
 * 
 * IMPORTANT: Different token families use different validation patterns:
 * 
 * 1. FORMULA-BASED FAMILIES (spacing, radius, tap area, border width):
 *    - Values must be derivable from BASE_VALUE × multiplier
 *    - Base values imported from actual token implementation files
 *    - Example: spacing uses SPACING_BASE_VALUE (8) from SpacingTokens.ts
 * 
 * 2. MODULAR SCALE FAMILIES (typography):
 *    - Values follow exponential scale: BASE × ratio^n
 *    - Example: fontSize uses 16px base with 1.125 ratio
 * 
 * 3. DISCRETE VALUE FAMILIES (colors, shadows):
 *    - Values are hex codes or specific numeric values
 *    - Validation checks format (e.g., valid hex) rather than formula
 *    - For component tokens, typically reference existing primitives
 * 
 * 4. CATEGORICAL FAMILIES (font family):
 *    - String values, not numeric
 *    - Component tokens should reference existing primitives
 * 
 * This function is extensible — new families should add their validation pattern
 * to the switch statement, importing constants from the actual token files.
 * 
 * @see src/tokens/SpacingTokens.ts - SPACING_BASE_VALUE
 * @see src/tokens/RadiusTokens.ts - RADIUS_BASE_VALUE
 * @see src/tokens/ColorTokens.ts - Hex value patterns
 */
function validateFamilyConformance(
  family: string, 
  value: number
): { valid: boolean; message: string; warning?: string } {
  // Import base values from actual token implementation files
  // This ensures validation uses the same constants as primitive token definitions
  
  switch (family) {
    // ============================================
    // FORMULA-BASED FAMILIES: BASE_VALUE × multiplier
    // ============================================
    
    case 'spacing': {
      // Import from src/tokens/SpacingTokens.ts
      const { SPACING_BASE_VALUE } = require('../../tokens/SpacingTokens');
      const multiplier = value / SPACING_BASE_VALUE;
      
      // Valid multipliers match those used in SpacingTokens.ts primitive definitions
      // Check if multiplier produces a value derivable from the base
      const isValidMultiplier = multiplier >= 0 && 
                                 multiplier <= 8.0 && 
                                 (multiplier * 4) % 1 === 0; // 0.25 increments
      
      if (!isValidMultiplier) {
        return { 
          valid: false, 
          message: `Spacing value ${value} is not derivable from SPACING_BASE_VALUE (${SPACING_BASE_VALUE}). ` +
                   `Use SPACING_BASE_VALUE * multiplier (e.g., ${SPACING_BASE_VALUE} * 1.25 = ${SPACING_BASE_VALUE * 1.25}).`
        };
      }
      
      // Check if this value matches an existing primitive (suggest reference instead)
      const { PrimitiveTokenRegistry } = require('../../registries/PrimitiveTokenRegistry');
      const existingPrimitive = PrimitiveTokenRegistry.getByFamily('spacing')
        .find((t: { baseValue: number }) => t.baseValue === value);
      
      if (existingPrimitive) {
        return { 
          valid: true, 
          message: '',
          warning: `Value ${value} matches existing primitive '${existingPrimitive.name}'. ` +
                   `Consider using a reference instead of a custom value.`
        };
      }
      
      return { valid: true, message: '' };
    }

    case 'radius': {
      // Import from src/tokens/RadiusTokens.ts
      const { RADIUS_BASE_VALUE } = require('../../tokens/RadiusTokens');
      
      if (value < 0) {
        return { 
          valid: false, 
          message: 'Radius values must be non-negative.' 
        };
      }
      
      // Special case: 9999 is valid for pill/full radius
      if (value === 9999) {
        return { valid: true, message: '' };
      }
      
      const multiplier = value / RADIUS_BASE_VALUE;
      
      // Valid multipliers match those used in RadiusTokens.ts primitive definitions
      const isValidMultiplier = multiplier >= 0 && 
                                 multiplier <= 4.0 && 
                                 (multiplier * 4) % 1 === 0; // 0.25 increments
      
      if (!isValidMultiplier && value !== 0) {
        return { 
          valid: false, 
          message: `Radius value ${value} is not derivable from RADIUS_BASE_VALUE (${RADIUS_BASE_VALUE}). ` +
                   `Use RADIUS_BASE_VALUE * multiplier or 9999 for pill shape.`
        };
      }
      
      // Check if this value matches an existing primitive
      const { PrimitiveTokenRegistry } = require('../../registries/PrimitiveTokenRegistry');
      const existingPrimitive = PrimitiveTokenRegistry.getByFamily('radius')
        .find((t: { baseValue: number }) => t.baseValue === value);
      
      if (existingPrimitive) {
        return { 
          valid: true, 
          message: '',
          warning: `Value ${value} matches existing primitive '${existingPrimitive.name}'. ` +
                   `Consider using a reference instead of a custom value.`
        };
      }
      
      return { valid: true, message: '' };
    }

    // ============================================
    // MODULAR SCALE FAMILIES: BASE × ratio^n
    // ============================================
    
    case 'fontSize': {
      // Typography uses modular scale - import constants from TypographyTokens
      const FONT_BASE_VALUE = 16; // Standard base, could be imported
      const SCALE_RATIO = 1.125;
      
      if (value <= 0) {
        return { 
          valid: false, 
          message: 'Font size values must be positive.' 
        };
      }
      
      // Check if value is approximately on the modular scale
      const logValue = Math.log(value / FONT_BASE_VALUE) / Math.log(SCALE_RATIO);
      const nearestStep = Math.round(logValue);
      const expectedValue = FONT_BASE_VALUE * Math.pow(SCALE_RATIO, nearestStep);
      const tolerance = 0.5; // Allow 0.5px tolerance for rounding
      
      if (Math.abs(value - expectedValue) > tolerance) {
        return { 
          valid: false, 
          message: `Font size ${value} does not follow the 1.125 modular scale from base ${FONT_BASE_VALUE}px. ` +
                   `Expected approximately ${expectedValue.toFixed(1)}px.`
        };
      }
      return { valid: true, message: '' };
    }

    // ============================================
    // DISCRETE VALUE FAMILIES: Specific values, no formula
    // ============================================
    
    case 'color': {
      // Color tokens use hex values - component tokens should reference primitives
      // If a custom value is provided, it should be a valid hex or the developer
      // should be using a reference instead
      return { 
        valid: false, 
        message: `Color family does not support custom numeric values. ` +
                 `Use a reference to an existing color primitive instead.`
      };
    }

    // ============================================
    // UNKNOWN FAMILIES: Allow with warning
    // ============================================
    
    default:
      // Unknown family - allow but warn that validation may be incomplete
      return { 
        valid: true, 
        message: '',
        warning: `Family '${family}' does not have specific validation rules. ` +
                 `Consider adding validation for this family or using a primitive reference.`
      };
  }
}

/**
 * Validate all registered component tokens
 */
function validateAllComponentTokens(): ComponentTokenValidationResult {
  const allTokens = ComponentTokenRegistry.getAll();
  const allErrors: string[] = [];
  const allWarnings: string[] = [];

  for (const token of allTokens) {
    const result = validateComponentToken(token);
    allErrors.push(...result.errors);
    allWarnings.push(...result.warnings);
  }

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
  };
}
```

### Platform Output Generation

Generate platform-specific files from component tokens.

```typescript
// Platform output format examples

// Web CSS (dist/ComponentTokens.web.css)
:root {
  /* ButtonIcon Component Tokens */
  --button-icon-inset-large: var(--space-150);
  --button-icon-inset-medium: var(--space-125);
  --button-icon-inset-small: var(--space-100);
}

// iOS Swift (dist/ComponentTokens.ios.swift)
import UIKit

public enum ButtonIconTokens {
  public static let insetLarge: CGFloat = SpacingTokens.space150
  public static let insetMedium: CGFloat = SpacingTokens.space125
  public static let insetSmall: CGFloat = SpacingTokens.space100
}

// Android Kotlin (dist/ComponentTokens.android.kt)
package com.designerpunk.tokens

object ButtonIconTokens {
  val insetLarge = SpacingTokens.space150
  val insetMedium = SpacingTokens.space125
  val insetSmall = SpacingTokens.space100
}
```

---

## Data Models

### Core Types

```typescript
/**
 * Primitive token structure (existing)
 */
interface PrimitiveToken {
  name: string;
  baseValue: number;
  family: string;
  formula?: string;
}

/**
 * Component token definition (input)
 */
interface ComponentTokenDefinition {
  reference?: PrimitiveToken;
  value?: number;
  reasoning: string;
}

/**
 * Registered component token (stored)
 */
interface RegisteredComponentToken {
  name: string;
  component: string;
  family: string;
  value: number;
  primitiveReference?: string;
  reasoning: string;
}

/**
 * Platform output configuration
 */
interface PlatformOutputConfig {
  platform: 'web' | 'ios' | 'android';
  outputPath: string;
  format: 'css' | 'swift' | 'kotlin';
}
```

---

## Correctness Properties

Based on the prework analysis of requirements acceptance criteria, the following correctness properties must hold:

### Property 1: Required Fields Validation

**Statement**: For any component token definition, the system SHALL require component name, family name, and reasoning string.

**Verification**: 
- TypeScript compiler enforces required fields in `ComponentTokenConfig`
- Runtime validation in `defineComponentTokens()` checks for empty reasoning
- Unit tests verify rejection of incomplete definitions

### Property 2: Token Value Validation

**Statement**: For any component token value, the system SHALL accept either a primitive token reference OR a value conforming to the family's value definition pattern, and SHALL reject magic numbers.

**Verification**:
- Type system enforces `TokenWithReference` or `TokenWithValue` union
- `validateFamilyConformance()` checks family-specific patterns
- Unit tests verify rejection of non-conformant values

### Property 3: Registry Registration

**Statement**: When `defineComponentTokens()` is called, the system SHALL register all defined tokens with the global `ComponentTokenRegistry`.

**Verification**:
- `defineComponentTokens()` calls `ComponentTokenRegistry.registerBatch()`
- Unit tests verify tokens appear in registry after definition
- Integration tests verify registry state across multiple components

### Property 4: Registry Query Methods

**Statement**: The `ComponentTokenRegistry` SHALL support `getAll()`, `getByComponent()`, and `getByFamily()` queries that return correct results.

**Verification**:
- Unit tests for each query method
- Property-based tests for query correctness
- Integration tests with multiple components and families

### Property 5: Conflict Detection

**Statement**: When two components define tokens with the same name, the system SHALL detect the conflict and report an error.

**Verification**:
- `registerBatch()` checks for existing token names
- Throws descriptive error on conflict
- Unit tests verify conflict detection and error messages

### Property 6: Platform Generation

**Statement**: For each registered component token, the system SHALL generate correct platform-specific output (CSS, Swift, Kotlin) that maintains the token chain to primitives.

**Verification**:
- Generated CSS uses `var(--primitive-name)` references
- Generated Swift/Kotlin uses primitive constant references
- Integration tests verify generated output format
- Snapshot tests for output stability

### Property 7: Token Collection

**Statement**: The build process SHALL discover and collect all component tokens from `src/components/**/**.tokens.ts` files.

**Verification**:
- Build script imports all token files
- Registry contains tokens from all components
- Integration tests verify collection completeness

---

## Error Handling

### Validation Errors

| Error Type | Message Format | Recovery |
|------------|----------------|----------|
| Missing reasoning | `Token "{name}" is missing required reasoning.` | Add reasoning string |
| Invalid reference | `Token "{name}" references non-existent primitive "{ref}".` | Fix reference |
| Non-conformant value | `Token "{name}" value {value} does not conform to {family} family pattern.` | Use formula or reference |
| Naming conflict | `Component token conflict: "{name}" already registered by {component}.` | Rename token |

### Build Errors

| Error Type | Message Format | Recovery |
|------------|----------------|----------|
| Collection failure | `Failed to collect component tokens: {error}` | Fix import errors |
| Generation failure | `Failed to generate {platform} output: {error}` | Fix generator |
| File write failure | `Failed to write {path}: {error}` | Check permissions |

### Error Message Principles

1. **Actionable**: Tell developer how to fix the issue
2. **Specific**: Include token name, component, and value
3. **Contextual**: Reference the family or pattern that was violated

---

## Testing Strategy

### Unit Tests

**defineComponentTokens()**:
- Returns correct token values
- Registers tokens with registry
- Handles reference tokens correctly
- Handles value tokens correctly
- Rejects missing reasoning
- Rejects invalid configurations

**ComponentTokenRegistry**:
- `registerBatch()` adds tokens correctly
- `getAll()` returns all tokens
- `getByComponent()` filters correctly
- `getByFamily()` filters correctly
- Detects naming conflicts
- `clear()` resets state

**Validation**:
- Validates reasoning requirement
- Validates primitive references
- Validates family conformance (spacing, fontSize, radius)
- Returns actionable error messages

### Integration Tests

**Pipeline Integration**:
- Tokens flow from definition to registry
- Validation runs on registered tokens
- Generation produces correct output
- Platform files are created

**Button-Icon QA Case**:
- `buttonIcon.tokens.ts` uses new API
- Tokens reference correct primitives
- Generated output is correct
- TokenCompliance tests pass

### Property-Based Tests

**Registry Properties**:
- All registered tokens are queryable
- Query results are consistent
- No tokens lost during registration

**Validation Properties**:
- Valid tokens always pass
- Invalid tokens always fail
- Error messages are always actionable

### Performance Tests

**NFR 3 Compliance** (validation under 1 second):
```typescript
/**
 * @category evergreen
 * @purpose Verify component token validation meets NFR 3 performance requirement
 */
describe('Component Token Validation Performance', () => {
  it('should validate typical component count within 1 second', () => {
    // Setup: Register 50 component tokens (typical upper bound)
    const tokens = generateMockComponentTokens(50);
    tokens.forEach(t => ComponentTokenRegistry.registerBatch(t.component, [t]));
    
    // Measure validation time
    const start = performance.now();
    validateAllComponentTokens();
    const duration = performance.now() - start;
    
    // NFR 3: validation SHALL complete in under 1 second
    expect(duration).toBeLessThan(1000);
  });
});
```

**Note**: This is an evergreen test per Test Development Standards — it verifies permanent NFR behavior, not a temporary constraint.

---

## Design Decisions

### Decision 1: Hybrid Component Token Approach

**Options Considered**:
1. **Use existing ComponentToken interface** — Rich metadata but verbose authoring
2. **Keep Spec 035's simple format** — Lightweight but loses family connection and reasoning
3. **Hybrid approach** — Lightweight authoring that produces rich metadata

**Decision**: Hybrid approach (Option 3)

**Rationale**:
- Maintains lightweight authoring experience (close to component implementation)
- Adds explicit family connection (not implicit through imports)
- Requires reasoning documentation (forces explanation of why token exists)
- References full primitive tokens (enables pipeline to extract relationships)
- Defers complexity (usage tracking, approval workflows) until demonstrated need

**Trade-offs**:
- ✅ Lightweight authoring with rich metadata
- ✅ Explicit family and reasoning requirements
- ❌ Requires creating new helper function
- ❌ Existing infrastructure needs deprecation

### Decision 2: Component Token Value Validation

**Options Considered**:
1. **Require primitive references only** — Strict but limiting
2. **Allow any numeric value** — Flexible but loses mathematical consistency
3. **Family-aware validation** — Reference OR family-conformant value

**Decision**: Family-aware validation (Option 3)

**Rationale**:
- Not all design needs can be met by existing primitives
- Component tokens should still follow family patterns
- Validation must be family-specific (spacing uses formulas, colors use hex, etc.)
- Reasoning required in ALL cases explains design intent

**Trade-offs**:
- ✅ Flexibility for unique design needs
- ✅ Maintains mathematical consistency
- ❌ More complex validation logic
- ❌ Family patterns must be documented

### Decision 3: Global Component Token Registry

**Options Considered**:
1. **Per-component registries** — Isolated but fragmented
2. **Global registry** — Centralized with component namespacing

**Decision**: Global registry (Option 2)

**Rationale** (optimized for AI agent developers):
- Single query point: "What component tokens exist?" → one call
- Cross-component awareness: Can detect naming conflicts, suggest reuse
- Simpler mental model: One registry pattern, same as primitives/semantics
- Pipeline integration: One collection mechanism, not N per component

**Trade-offs**:
- ✅ Single query point for AI agents
- ✅ Conflict detection across components
- ❌ Global state (mitigated by clear ownership)
- ❌ All tokens loaded at build time

### Decision 4: Platform Output Format

**Options Considered**:
1. **Inline values** — `--button-icon-inset-large: 12px`
2. **Primitive references** — `--button-icon-inset-large: var(--space-150)`

**Decision**: Primitive references (Option 2)

**Rationale**:
- Maintains token chain (component → primitive)
- Theme changes propagate automatically
- Debugging shows token relationships
- Aligns with semantic token output pattern

**Trade-offs**:
- ✅ Token chain preserved
- ✅ Theme-aware
- ❌ Requires primitives to be generated first
- ❌ Slightly more complex output

### Decision 5: Deprecate Existing Infrastructure

**Options Considered**:
1. **Keep both systems** — Backward compatible but confusing
2. **Deprecate old, use new** — Clean but requires migration

**Decision**: Deprecate old infrastructure (Option 2)

**Rationale**:
- `ComponentToken.ts` and `ComponentTokenGenerator.ts` are unused
- Hybrid approach supersedes their design
- Single system is easier to maintain and document
- No existing consumers to migrate

**Trade-offs**:
- ✅ Single, clear system
- ✅ No confusion about which to use
- ❌ Deprecation notices needed
- ❌ Old code remains until removed

---

## Related Files

### New Files to Create
- `src/build/tokens/defineComponentTokens.ts` - Hybrid authoring helper
- `src/registries/ComponentTokenRegistry.ts` - Global registry
- `.kiro/steering/Rosetta-System-Architecture.md` - Architecture documentation
- `dist/ComponentTokens.web.css` - Generated web output
- `dist/ComponentTokens.ios.swift` - Generated iOS output
- `dist/ComponentTokens.android.kt` - Generated Android output

### Files to Update
- `src/integration/ValidationCoordinator.ts` - Add component token validation
- `src/generators/TokenFileGenerator.ts` - Add component token generation
- `src/components/core/ButtonIcon/buttonIcon.tokens.ts` - Use new API
- `src/components/core/ButtonIcon/platforms/*/ButtonIcon.*` - Consume generated tokens

### Files to Deprecate
- `src/build/tokens/ComponentToken.ts` - Mark deprecated
- `src/build/tokens/ComponentTokenGenerator.ts` - Mark deprecated

---

## Open Questions (Resolved)

All open questions from the design-outline have been resolved:

1. ✅ **Platform output format**: CSS custom properties referencing primitives
2. ✅ **Validation strictness**: Reference primitive OR conform to family pattern; reasoning required always
3. ✅ **Registry scope**: Global registry with component namespacing
4. ✅ **Existing infrastructure**: Deprecate in favor of hybrid approach
5. ✅ **Generation trigger**: Align with existing primitive/semantic generation patterns
6. ✅ **Return value**: `defineComponentTokens()` returns usable values AND registers with registry
