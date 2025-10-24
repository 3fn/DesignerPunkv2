# Design Document: Border Width Tokens

**Date**: October 23, 2025
**Spec**: border-width-tokens - Border Width Token System
**Status**: Design Phase
**Dependencies**: mathematical-token-system, cross-platform-build-system

---

## Overview

The border width token system extends DesignerPunk's mathematical token foundation to border widths, providing three primitive tokens (borderWidth100, borderWidth200, borderWidth400) with explicit doubling relationships and three semantic tokens (borderDefault, borderEmphasis, borderHeavy) that provide contextual meaning. The system integrates with the existing cross-platform build system to generate platform-specific output files (CSS, Swift, Kotlin) from unitless base values.

This design follows the established patterns from SpacingTokens and FontSizeTokens: primitive tokens with mathematical relationships stored in PrimitiveTokenRegistry, semantic tokens with primitive references stored in SemanticTokenRegistry, and cross-platform generation through BuildOrchestrator coordinating platform-specific generators.

The system intentionally excludes focus ring tokens, deferring to platform-native focus indicator patterns documented in usage guides. This decision respects platform differences (web outline, iOS system focus, Android ripple) while providing clear guidance on using borderEmphasis for web outline-width.

---

## Architecture

### System Integration

```
┌─────────────────────────────────────────────────────────────┐
│                    Border Width Token System                 │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐         ┌──────────────────┐          │
│  │ BorderWidthTokens│         │ SemanticBorder   │          │
│  │   (Primitive)    │────────▶│  WidthTokens     │          │
│  │                  │         │   (Semantic)     │          │
│  │ - borderWidth100 │         │ - borderDefault  │          │
│  │ - borderWidth200 │         │ - borderEmphasis │          │
│  │ - borderWidth400 │         │ - borderHeavy    │          │
│  └──────────────────┘         └──────────────────┘          │
│           │                            │                     │
│           └────────────┬───────────────┘                     │
│                        ▼                                     │
│           ┌────────────────────────┐                         │
│           │  PrimitiveTokenRegistry│                         │
│           │  SemanticTokenRegistry │                         │
│           └────────────────────────┘                         │
│                        │                                     │
│                        ▼                                     │
│           ┌────────────────────────┐                         │
│           │   BuildOrchestrator    │                         │
│           └────────────────────────┘                         │
│                        │                                     │
│           ┌────────────┼────────────┐                        │
│           ▼            ▼            ▼                        │
│    ┌──────────┐ ┌──────────┐ ┌──────────┐                  │
│    │   Web    │ │   iOS    │ │ Android  │                  │
│    │   CSS    │ │  Swift   │ │  Kotlin  │                  │
│    └──────────┘ └──────────┘ └──────────┘                  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Integration Points

**PrimitiveTokenRegistry**: Stores BorderWidthTokens with mathematical relationships preserved. Validates that borderWidth200 = borderWidth100 × 2 and borderWidth400 = borderWidth100 × 4.

**SemanticTokenRegistry**: Stores SemanticBorderWidthTokens with references to primitive tokens. Resolves borderDefault → borderWidth100, borderEmphasis → borderWidth200, borderHeavy → borderWidth400.

**BuildOrchestrator**: Coordinates token selection and platform-specific generation. Retrieves border width tokens from registries and delegates to platform generators.

**Platform Generators**: Convert unitless values to platform-specific units:
- WebCSSGenerator: borderWidth100 → `--border-width-100: 1px;`
- iOSSwiftGenerator: borderWidth100 → `static let borderWidth100: CGFloat = 1`
- AndroidKotlinGenerator: borderWidth100 → `val borderWidth100 = 1.dp`

---

## Components and Interfaces

### BorderWidthTokens (Primitive)

```typescript
/**
 * Primitive border width tokens with explicit mathematical relationships.
 * Base value: borderWidth100 = 1 (unitless)
 * Progression: Doubling (1 → 2 → 4)
 */
export const BorderWidthTokens = {
  /**
   * Base border width value.
   * Used for: Standard borders, default state
   * Platform output: 1px (web), 1pt (iOS), 1dp (Android)
   */
  borderWidth100: 1,

  /**
   * 2x base border width.
   * Mathematical relationship: borderWidth100 × 2
   * Used for: Emphasized borders, active/focus states
   * Platform output: 2px (web), 2pt (iOS), 2dp (Android)
   */
  borderWidth200: 1 * 2, // Explicit multiplication for mathematical clarity

  /**
   * 4x base border width.
   * Mathematical relationship: borderWidth100 × 4
   * Used for: Heavy emphasis, strong visual weight (rare)
   * Platform output: 4px (web), 4pt (iOS), 4dp (Android)
   */
  borderWidth400: 1 * 4, // Explicit multiplication for mathematical clarity
} as const;

/**
 * Type definition for primitive border width token keys.
 */
export type BorderWidthTokenKey = keyof typeof BorderWidthTokens;
```

### SemanticBorderWidthTokens (Semantic)

```typescript
/**
 * Semantic border width tokens providing contextual meaning.
 * All tokens reference primitive BorderWidthTokens.
 */
export const SemanticBorderWidthTokens = {
  /**
   * Default border width for standard elements.
   * References: borderWidth100
   * Use cases: Cards, inputs at rest, buttons at rest, dividers
   * Visual weight: Standard, neutral
   */
  borderDefault: BorderWidthTokens.borderWidth100,

  /**
   * Emphasized border width for active/focused states.
   * References: borderWidth200
   * Use cases: Inputs on focus, selected cards, active buttons
   * Visual weight: Emphasized, attention-drawing
   * Note: Use for web outline-width in focus states
   */
  borderEmphasis: BorderWidthTokens.borderWidth200,

  /**
   * Heavy border width for strong visual weight.
   * References: borderWidth400
   * Use cases: Strong emphasis (rare, use sparingly)
   * Visual weight: Heavy, dominant
   */
  borderHeavy: BorderWidthTokens.borderWidth400,
} as const;

/**
 * Type definition for semantic border width token keys.
 */
export type SemanticBorderWidthTokenKey = keyof typeof SemanticBorderWidthTokens;
```

### Token Registration Interface

```typescript
/**
 * Interface for registering border width tokens with the token system.
 */
export interface BorderWidthTokenRegistration {
  /**
   * Register primitive border width tokens with PrimitiveTokenRegistry.
   * Validates mathematical relationships during registration.
   */
  registerPrimitiveTokens(): void;

  /**
   * Register semantic border width tokens with SemanticTokenRegistry.
   * Validates that all references point to valid primitive tokens.
   */
  registerSemanticTokens(): void;

  /**
   * Validate mathematical relationships in primitive tokens.
   * Returns validation results (Pass/Warning/Error).
   */
  validateMathematicalRelationships(): ValidationResult;
}
```

---

## Data Models

### Token Structure

```typescript
/**
 * Primitive border width token structure.
 */
interface PrimitiveBorderWidthToken {
  /** Token identifier (e.g., "borderWidth100") */
  name: string;

  /** Unitless numeric value */
  value: number;

  /** Mathematical relationship expression (e.g., "borderWidth100 × 2") */
  relationship: string | null;

  /** Token category for organization */
  category: "border-width";

  /** Token type for registry */
  type: "primitive";
}

/**
 * Semantic border width token structure.
 */
interface SemanticBorderWidthToken {
  /** Token identifier (e.g., "borderDefault") */
  name: string;

  /** Reference to primitive token */
  reference: string;

  /** Contextual meaning and use cases */
  description: string;

  /** Token category for organization */
  category: "border-width";

  /** Token type for registry */
  type: "semantic";
}

/**
 * Platform-specific border width output.
 */
interface PlatformBorderWidthOutput {
  /** Platform identifier */
  platform: "web" | "ios" | "android";

  /** Token name */
  tokenName: string;

  /** Platform-specific value with unit */
  value: string; // e.g., "1px", "1pt", "1dp"

  /** Output format (CSS variable, Swift constant, Kotlin val) */
  format: "css-variable" | "swift-constant" | "kotlin-val";
}
```

### Validation Model

```typescript
/**
 * Mathematical relationship validation result.
 */
interface MathematicalValidationResult {
  /** Token being validated */
  tokenName: string;

  /** Expected value based on mathematical relationship */
  expectedValue: number;

  /** Actual value in token definition */
  actualValue: number;

  /** Validation status */
  status: "pass" | "warning" | "error";

  /** Validation message */
  message: string;

  /** Mathematical expression that was validated */
  expression: string;
}

/**
 * Semantic token reference validation result.
 */
interface ReferenceValidationResult {
  /** Semantic token being validated */
  tokenName: string;

  /** Referenced primitive token */
  referencedToken: string;

  /** Whether reference is valid */
  isValid: boolean;

  /** Validation status */
  status: "pass" | "error";

  /** Validation message */
  message: string;
}
```

---

## Error Handling

### Validation Errors

**Mathematical Relationship Violation**:
```typescript
// Error: borderWidth200 does not equal borderWidth100 × 2
{
  tokenName: "borderWidth200",
  expectedValue: 2,
  actualValue: 3, // Incorrect value
  status: "error",
  message: "Mathematical relationship violated: borderWidth200 should equal borderWidth100 × 2 (expected: 2, actual: 3)",
  expression: "borderWidth100 × 2"
}
```

**Invalid Primitive Reference**:
```typescript
// Error: borderDefault references non-existent primitive token
{
  tokenName: "borderDefault",
  referencedToken: "borderWidth150", // Does not exist
  isValid: false,
  status: "error",
  message: "Invalid reference: borderDefault references borderWidth150 which does not exist in PrimitiveTokenRegistry"
}
```

### Build Errors

**Missing Token in Registry**:
```
Error: Border width token 'borderWidth100' not found in PrimitiveTokenRegistry
Resolution: Ensure BorderWidthTokens are registered before build process
```

**Platform Generation Failure**:
```
Error: Failed to generate iOS Swift output for border width tokens
Cause: iOSSwiftGenerator encountered invalid token value
Resolution: Validate token values are numeric before generation
```

---

## Testing Strategy

### Unit Tests

**Primitive Token Mathematical Relationships**:
```typescript
describe('BorderWidthTokens', () => {
  test('borderWidth100 has base value of 1', () => {
    expect(BorderWidthTokens.borderWidth100).toBe(1);
  });

  test('borderWidth200 equals borderWidth100 × 2', () => {
    expect(BorderWidthTokens.borderWidth200).toBe(BorderWidthTokens.borderWidth100 * 2);
  });

  test('borderWidth400 equals borderWidth100 × 4', () => {
    expect(BorderWidthTokens.borderWidth400).toBe(BorderWidthTokens.borderWidth100 * 4);
  });
});
```

**Semantic Token References**:
```typescript
describe('SemanticBorderWidthTokens', () => {
  test('borderDefault references borderWidth100', () => {
    expect(SemanticBorderWidthTokens.borderDefault).toBe(BorderWidthTokens.borderWidth100);
  });

  test('borderEmphasis references borderWidth200', () => {
    expect(SemanticBorderWidthTokens.borderEmphasis).toBe(BorderWidthTokens.borderWidth200);
  });

  test('borderHeavy references borderWidth400', () => {
    expect(SemanticBorderWidthTokens.borderHeavy).toBe(BorderWidthTokens.borderWidth400);
  });
});
```

### Integration Tests

**Token Registry Integration**:
```typescript
describe('Border Width Token Registration', () => {
  test('primitive tokens register successfully', () => {
    const registry = new PrimitiveTokenRegistry();
    registerPrimitiveBorderWidthTokens(registry);
    
    expect(registry.getToken('borderWidth100')).toBeDefined();
    expect(registry.getToken('borderWidth200')).toBeDefined();
    expect(registry.getToken('borderWidth400')).toBeDefined();
  });

  test('semantic tokens register with valid references', () => {
    const primitiveRegistry = new PrimitiveTokenRegistry();
    const semanticRegistry = new SemanticTokenRegistry();
    
    registerPrimitiveBorderWidthTokens(primitiveRegistry);
    registerSemanticBorderWidthTokens(semanticRegistry, primitiveRegistry);
    
    const borderDefault = semanticRegistry.getToken('borderDefault');
    expect(borderDefault.reference).toBe('borderWidth100');
  });
});
```

**Cross-Platform Generation**:
```typescript
describe('Border Width Platform Generation', () => {
  test('generates correct CSS output', () => {
    const generator = new WebCSSGenerator();
    const output = generator.generateBorderWidthTokens(BorderWidthTokens);
    
    expect(output).toContain('--border-width-100: 1px;');
    expect(output).toContain('--border-width-200: 2px;');
    expect(output).toContain('--border-width-400: 4px;');
  });

  test('generates correct Swift output', () => {
    const generator = new iOSSwiftGenerator();
    const output = generator.generateBorderWidthTokens(BorderWidthTokens);
    
    expect(output).toContain('static let borderWidth100: CGFloat = 1');
    expect(output).toContain('static let borderWidth200: CGFloat = 2');
    expect(output).toContain('static let borderWidth400: CGFloat = 4');
  });

  test('generates correct Kotlin output', () => {
    const generator = new AndroidKotlinGenerator();
    const output = generator.generateBorderWidthTokens(BorderWidthTokens);
    
    expect(output).toContain('val borderWidth100 = 1.dp');
    expect(output).toContain('val borderWidth200 = 2.dp');
    expect(output).toContain('val borderWidth400 = 4.dp');
  });
});
```

### Validation Tests

**Mathematical Validation**:
```typescript
describe('Border Width Mathematical Validation', () => {
  test('validates correct mathematical relationships', () => {
    const validator = new ThreeTierValidator();
    const result = validator.validateBorderWidthRelationships(BorderWidthTokens);
    
    expect(result.status).toBe('pass');
    expect(result.errors).toHaveLength(0);
  });

  test('detects mathematical relationship violations', () => {
    const invalidTokens = {
      borderWidth100: 1,
      borderWidth200: 3, // Should be 2
      borderWidth400: 4,
    };
    
    const validator = new ThreeTierValidator();
    const result = validator.validateBorderWidthRelationships(invalidTokens);
    
    expect(result.status).toBe('error');
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        tokenName: 'borderWidth200',
        expectedValue: 2,
        actualValue: 3,
      })
    );
  });
});
```

---

## Documentation Strategy

### Documentation Artifacts

Following the cross-reference standards defined in File Organization Standards, the border width token system will include the following documentation:

**1. Usage Pattern Guide** (`.kiro/specs/border-width-tokens/usage-patterns-guide.md`)
- When to use borderDefault, borderEmphasis, borderHeavy
- Component-specific examples (cards, inputs, buttons, dividers)
- Appropriate and inappropriate usage patterns
- Cross-references to compositional color guide for border color composition

**2. Focus Indicator Guide** (`.kiro/specs/border-width-tokens/focus-indicator-guide.md`)
- Platform-native focus patterns (web outline, iOS system focus, Android ripple)
- Web implementation examples using borderEmphasis for outline-width
- iOS implementation examples using system-provided focus indicators
- Android implementation examples using ripple effects and elevation
- Cross-references to accessibility guidelines and platform-specific documentation

**3. Integration Examples** (`.kiro/specs/border-width-tokens/integration-examples.md`)
- Code examples showing border width + color composition
- Component implementation patterns across platforms
- Migration examples from hardcoded values to border width tokens
- Cross-references to existing component documentation

### Cross-Reference Pattern

All documentation guides will follow the cross-reference standards:

**Related Guides Section Format**:
```markdown
## Related Guides

- [Compositional Color Guide](../typography-token-expansion/compositional-color-guide.md) - Explains compositional architecture for border width + color
- [Spacing Token Guide](../mathematical-token-system/spacing-tokens-guide.md) - Related mathematical token system
- [Platform-Native Patterns](../typography-token-expansion/inline-emphasis-guide.md) - Similar platform-native approach for emphasis
```

**Documentation Organization**:
- Guides stored in `.kiro/specs/border-width-tokens/`
- Use relative paths for cross-references
- Include relevance explanations for each link
- Bidirectional linking between related guides

---

## Design Decisions

### Decision 1: Doubling Progression (1 → 2 → 4) vs Linear Progression (1 → 2 → 3 → 4)

**Options Considered**:
1. Doubling progression: borderWidth100 (1), borderWidth200 (2), borderWidth400 (4)
2. Linear progression: borderWidth100 (1), borderWidth200 (2), borderWidth300 (3), borderWidth400 (4)
3. Modular scale: borderWidth100 (1), borderWidth112 (1.125), borderWidth125 (1.25), etc.

**Decision**: Doubling progression (1 → 2 → 4)

**Rationale**:

The doubling progression provides a clean, minimal set of border widths that covers the vast majority of use cases while maintaining mathematical clarity. Border widths don't require the same granularity as spacing or typography - the visual difference between 1px and 2px borders is significant, and 4px borders are rare but occasionally needed for strong emphasis.

The doubling pattern is immediately understandable (each step is 2x the previous) and aligns with binary thinking common in digital design. It also leaves room for strategic flexibility: if 3px borders are needed in the future, borderWidth300 can be added without breaking the existing pattern.

**Trade-offs**:
- ✅ **Gained**: Simplicity, clear mathematical pattern, minimal token set
- ❌ **Lost**: Middle ground option (3px), granularity for fine-tuning
- ⚠️ **Risk**: May need to add borderWidth300 later if 3px borders become common

**Counter-Arguments**:
- **Argument**: Linear progression (1, 2, 3, 4) provides more flexibility and aligns with spacing tokens
- **Response**: Border widths don't need the same granularity as spacing. The jump from 2px to 4px is acceptable for the rare cases where heavy borders are needed. Starting minimal and adding borderWidth300 later (if needed) is better than premature abstraction.

### Decision 2: No Focus Ring Token

**Options Considered**:
1. Dedicated focus ring token: `borderFocusRing: @borderWidth200`
2. Focus ring as alias: `borderFocusRing: @borderEmphasis` (alias, not independent)
3. No focus ring token: Use borderEmphasis for focus states, document in usage guide

**Decision**: No focus ring token (Option 3)

**Rationale**:

Focus indicators are fundamentally platform-specific and often don't use borders at all. On web, best practice is `outline` (not `border`) for accessibility. On iOS, the system provides focus indicators automatically. On Android, focus is handled through ripple effects and elevation changes.

Creating a `borderFocusRing` token would be misleading because:
1. It implies border-based focus indicators are universal (they're not)
2. It's misnamed for web (should be `outlineFocusRing`)
3. It's unused on iOS/Android (platform-native patterns)

Instead, we document that web implementations should use `borderEmphasis` for `outline-width` in focus states, and iOS/Android should use platform-native focus patterns. This is more honest about platform differences and aligns with the platform-native philosophy demonstrated in the typography inline emphasis guide.

**Trade-offs**:
- ✅ **Gained**: Platform honesty, no misleading token names, simpler token set
- ❌ **Lost**: Explicit focus ring token for AI agent clarity
- ⚠️ **Risk**: Developers might use borders instead of outlines on web

**Counter-Arguments**:
- **Argument**: An explicit `borderFocusRing` token (even as an alias) would make accessibility expectations clearer for AI agents
- **Response**: Accessibility is better served by clear documentation of platform-appropriate patterns than by a token that implies cross-platform uniformity where none exists. The usage guide provides unambiguous guidance: "On web, use outline with borderEmphasis width."

### Decision 3: No borderSubtle Token

**Options Considered**:
1. Include borderSubtle: `borderSubtle: @borderWidth100` (same as borderDefault)
2. Include borderSubtle with future hairline: `borderSubtle: @borderWidth050` (requires adding borderWidth050)
3. No borderSubtle: Use borderDefault for all standard borders

**Decision**: No borderSubtle token (Option 3)

**Rationale**:

Currently, borderSubtle would be identical to borderDefault (both reference borderWidth100). Adding a token that's just an alias to another semantic token creates unnecessary complexity without providing value.

If hairline borders (0.5px) become necessary in the future, we can add:
1. `borderWidth050: 0.5` as a strategic flexibility primitive token
2. `borderSubtle: @borderWidth050` as a semantic token

This follows the principle of proving the need before adding abstraction. Starting minimal and expanding based on actual requirements is better than premature token proliferation.

**Trade-offs**:
- ✅ **Gained**: Simpler token set, no redundant aliases, clear semantic meaning
- ❌ **Lost**: Explicit "subtle" semantic token for dividers/hairlines
- ⚠️ **Risk**: May need to add later if hairline borders become common

**Counter-Arguments**:
- **Argument**: Having borderSubtle now (even as an alias) provides semantic clarity for dividers and hairlines
- **Response**: Semantic clarity without functional difference is just noise. If borderSubtle and borderDefault both resolve to 1px, they're the same token with different names. Better to have one clear token (borderDefault) and add borderSubtle when it has a distinct value (0.5px).

### Decision 4: Explicit Mathematical Relationships in Code

**Options Considered**:
1. Explicit multiplication: `borderWidth200: borderWidth100 * 2`
2. Computed values: `borderWidth200: 2` (relationship implied by naming)
3. Function-based: `borderWidth200: multiply(borderWidth100, 2)`

**Decision**: Explicit multiplication (Option 1)

**Rationale**:

Explicit multiplication expressions make mathematical relationships visible in the code, not just implied by naming conventions. This serves multiple purposes:

1. **AI Agent Clarity**: AI agents can see the mathematical relationship directly in the code
2. **Validation**: The three-tier validation system can verify that the expression matches the actual value
3. **Maintainability**: Changing borderWidth100 automatically updates dependent values
4. **Documentation**: The code itself documents the mathematical foundation

This aligns with the existing pattern in SpacingTokens and FontSizeTokens, where mathematical relationships are explicit rather than implied.

**Trade-offs**:
- ✅ **Gained**: Explicit relationships, automatic updates, validation-friendly, AI-readable
- ❌ **Lost**: Slightly more verbose than hardcoded values
- ⚠️ **Risk**: None - this is a proven pattern in the existing system

**Counter-Arguments**:
- **Argument**: Hardcoded values (borderWidth200: 2) are simpler and the relationship is obvious from naming
- **Response**: "Obvious from naming" is human interpretation, not machine-verifiable. Explicit relationships enable validation, automatic updates, and AI reasoning about the mathematical foundation.

---

## Integration Points

### Existing System Integration

**PrimitiveTokenRegistry**:
- Border width tokens register alongside spacing, font size, and color tokens
- Mathematical validation runs during registration
- Token retrieval by name for build process

**SemanticTokenRegistry**:
- Semantic border width tokens register with primitive references
- Reference validation ensures all semantic tokens point to valid primitives
- Token resolution follows reference chain (borderDefault → borderWidth100 → 1)

**BuildOrchestrator**:
- Coordinates border width token generation across platforms
- Retrieves tokens from registries
- Delegates to platform-specific generators

**Platform Generators**:
- WebCSSGenerator: Generates CSS custom properties with px units
- iOSSwiftGenerator: Generates Swift constants with CGFloat type and pt units
- AndroidKotlinGenerator: Generates Kotlin vals with dp extension

### Component Integration

**Border Width + Color Composition**:
```typescript
// Web component example
<div style={{
  border: `${borderDefault}px solid ${colorCardBorder}`,
}}>
  Card content
</div>

// Focus state example
<button style={{
  outline: focused ? `${borderEmphasis}px solid ${colorFocus}` : 'none',
  outlineOffset: '2px',
}}>
  Button
</button>
```

**Platform-Specific Focus Patterns**:
```swift
// iOS SwiftUI example
Button("Label")
  .focusable() // System handles focus indicator
```

```kotlin
// Android Compose example
Button(
  onClick = {},
  modifier = Modifier.focusable() // System handles focus indicator
)
```

---

## Future Considerations

### Strategic Flexibility Expansion

If hairline borders (0.5px) become necessary:

```typescript
// Add primitive token
borderWidth050: 0.5, // Strategic flexibility for hairline borders

// Add semantic token
borderSubtle: BorderWidthTokens.borderWidth050, // Hairline dividers, subtle separation
```

This maintains the mathematical progression (050, 100, 200, 400) and naming conventions.

### Additional Semantic Tokens

If component-specific semantic tokens become necessary:

```typescript
// Component-specific semantic tokens (if needed)
borderCard: BorderWidthTokens.borderWidth100,
borderInput: BorderWidthTokens.borderWidth100,
borderDivider: BorderWidthTokens.borderWidth100,
```

However, this should be avoided unless there's a clear need for component-specific border widths that differ from the general semantic tokens (borderDefault, borderEmphasis, borderHeavy).

### Border Style Tokens

Border width tokens intentionally exclude border style (solid, dashed, dotted). If border style tokens become necessary, they should be separate tokens that compose with border width:

```typescript
// Future: Border style tokens (separate from width)
borderStyleSolid: 'solid',
borderStyleDashed: 'dashed',
borderStyleDotted: 'dotted',

// Usage: Composition of width + style + color
border: `${borderDefault}px ${borderStyleSolid} ${colorCardBorder}`,
```

---

*This design document establishes the architecture, components, and integration strategy for the border width token system, following DesignerPunk's mathematical foundation and cross-platform principles while respecting platform-native patterns for accessibility-critical features.*
