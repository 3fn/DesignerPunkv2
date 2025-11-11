# Registry-Validator Interaction Pattern

**Date**: November 9, 2025
**Purpose**: Document the caller-validates-then-registers pattern for registry-validator interaction
**Organization**: process-standard
**Scope**: cross-project

---

## Overview

This document defines the standard pattern for how validators and registries interact in the DesignerPunk token system. The pattern establishes clear separation of concerns: **validators validate, registries store, and callers coordinate**.

### Core Principle

**Callers are responsible for validation before registration.** Registries trust that tokens are valid and focus solely on storage operations.

---

## Pattern Definition

### The Caller-Validates-Then-Registers Pattern

```typescript
// 1. Caller validates the token
const validationResult = validator.validate(token);

// 2. Caller checks validation result
if (validationResult.valid) {
  // 3. Caller registers the token
  registry.register(token);
} else {
  // 4. Caller handles validation failure
  throw new Error(`Validation failed: ${validationResult.errors.join(', ')}`);
}
```

### Who Does What

**Validators** (IValidator implementations):
- Validate tokens against specific criteria
- Return structured validation results
- Have no knowledge of registries
- Focus on validation logic only

**Registries** (IRegistry implementations):
- Store and retrieve tokens
- Provide query operations (get, has, query)
- Have no knowledge of validators
- Focus on storage operations only

**Callers** (ValidationCoordinator, TokenEngine, application code):
- Coordinate validation and registration
- Call validators before registration
- Handle validation failures appropriately
- Decide when to skip validation (if needed)

---

## Pattern Considerations

### Separation of Concerns

**Benefit**: Each component has a single, well-defined responsibility.

```typescript
// ✅ GOOD - Clear separation
class PrimitiveTokenRegistry implements IRegistry<PrimitiveToken> {
  register(token: PrimitiveToken): void {
    // Just store - no validation
    this.tokens.set(token.name, token);
  }
}

// ❌ BAD - Mixed responsibilities
class PrimitiveTokenRegistry {
  register(token: PrimitiveToken): void {
    // Validation mixed with storage
    const result = this.validator.validate(token);
    if (!result.valid) throw new Error('Invalid token');
    this.tokens.set(token.name, token);
  }
}
```

### Ease of Use

**Benefit**: Clear API that's easy to understand and use correctly.

```typescript
// Simple, explicit workflow
const result = validator.validate(token);
if (result.valid) {
  registry.register(token);
}
```

**Trade-off**: Callers must remember to validate. This is mitigated by:
- Clear documentation and examples
- TypeScript types that guide usage
- Orchestrator classes (ValidationCoordinator) that handle the pattern

### Type Safety

**Benefit**: TypeScript enforces correct usage through interfaces.

```typescript
// IValidator interface ensures consistent validation contract
interface IValidator<TInput = any> {
  validate(input: TInput): ValidationResult | Promise<ValidationResult>;
  readonly name: string;
}

// IRegistry interface ensures consistent storage contract
interface IRegistry<TToken> {
  register(token: TToken, options?: RegistrationOptions): void;
  query(): TToken[];
  get(name: string): TToken | undefined;
  has(name: string): boolean;
  readonly name: string;
}
```

### Testability

**Benefit**: Easy to test validation and registration independently.

```typescript
// Test validation independently
describe('BaselineGridValidator', () => {
  it('should validate tokens against baseline grid', () => {
    const validator = new BaselineGridValidator();
    const result = validator.validate(token);
    expect(result.valid).toBe(true);
  });
});

// Test registration independently
describe('PrimitiveTokenRegistry', () => {
  it('should store tokens', () => {
    const registry = new PrimitiveTokenRegistry();
    registry.register(token);
    expect(registry.has(token.name)).toBe(true);
  });
});

// Test coordination
describe('ValidationCoordinator', () => {
  it('should validate before registration', () => {
    const coordinator = new ValidationCoordinator(validator, registry);
    coordinator.validateAndRegister(token);
    expect(registry.has(token.name)).toBe(true);
  });
});
```

### Consistency

**Benefit**: Pattern is unambiguous and always applied the same way.

**For AI Agents**: This pattern provides clear, consistent guidance:
- Always validate before registering
- Always check validation results
- Always handle failures appropriately
- Never mix validation with storage

---

## Usage Examples

### Example 1: ValidationCoordinator

The ValidationCoordinator orchestrates validation and registration for the entire system.

```typescript
export class ValidationCoordinator {
  constructor(
    private primitiveValidator: IValidator<PrimitiveToken>,
    private semanticValidator: IValidator<SemanticToken>,
    private primitiveRegistry: IRegistry<PrimitiveToken>,
    private semanticRegistry: IRegistry<SemanticToken>
  ) {}

  /**
   * Validate and register a primitive token
   */
  validatePrimitiveToken(token: PrimitiveToken): ValidationResult {
    // 1. Validate the token
    const result = this.primitiveValidator.validate(token);

    // 2. Check validation result
    if (result.level === 'Error') {
      // Validation failed - don't register
      return result;
    }

    // 3. Register the token (validation passed or warning)
    this.primitiveRegistry.register(token);

    return result;
  }

  /**
   * Validate and register a semantic token
   */
  validateSemanticToken(token: SemanticToken): ValidationResult {
    // 1. Validate the token
    const result = this.semanticValidator.validate(token);

    // 2. Check validation result
    if (result.level === 'Error') {
      // Validation failed - don't register
      return result;
    }

    // 3. Register the token (validation passed or warning)
    this.semanticRegistry.register(token);

    return result;
  }

  /**
   * Validate and register all tokens
   */
  validateAllTokens(
    primitives: PrimitiveToken[],
    semantics: SemanticToken[]
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate and register primitives
    for (const token of primitives) {
      const result = this.validatePrimitiveToken(token);
      errors.push(...result.errors);
      warnings.push(...result.warnings);
    }

    // Validate and register semantics
    for (const token of semantics) {
      const result = this.validateSemanticToken(token);
      errors.push(...result.errors);
      warnings.push(...result.warnings);
    }

    return {
      valid: errors.length === 0,
      level: errors.length > 0 ? 'Error' : warnings.length > 0 ? 'Warning' : 'Pass',
      errors,
      warnings
    };
  }
}
```

### Example 2: TokenEngine

The TokenEngine provides a high-level API for token operations.

```typescript
export class TokenEngine {
  constructor(
    private validationCoordinator: ValidationCoordinator,
    private primitiveRegistry: IRegistry<PrimitiveToken>,
    private semanticRegistry: IRegistry<SemanticToken>
  ) {}

  /**
   * Add a primitive token to the system
   */
  addPrimitiveToken(token: PrimitiveToken): void {
    // Delegate to ValidationCoordinator for validation and registration
    const result = this.validationCoordinator.validatePrimitiveToken(token);

    if (result.level === 'Error') {
      throw new Error(
        `Failed to add primitive token: ${result.errors.join(', ')}`
      );
    }

    if (result.level === 'Warning') {
      console.warn(
        `Primitive token added with warnings: ${result.warnings.join(', ')}`
      );
    }
  }

  /**
   * Add a semantic token to the system
   */
  addSemanticToken(token: SemanticToken): void {
    // Delegate to ValidationCoordinator for validation and registration
    const result = this.validationCoordinator.validateSemanticToken(token);

    if (result.level === 'Error') {
      throw new Error(
        `Failed to add semantic token: ${result.errors.join(', ')}`
      );
    }

    if (result.level === 'Warning') {
      console.warn(
        `Semantic token added with warnings: ${result.warnings.join(', ')}`
      );
    }
  }

  /**
   * Get a primitive token by name
   */
  getPrimitiveToken(name: string): PrimitiveToken | undefined {
    return this.primitiveRegistry.get(name);
  }

  /**
   * Get a semantic token by name
   */
  getSemanticToken(name: string): SemanticToken | undefined {
    return this.semanticRegistry.get(name);
  }
}
```

### Example 3: Direct Usage

Application code can use validators and registries directly when needed.

```typescript
// Example: Custom token validation and registration
export function registerCustomToken(
  token: PrimitiveToken,
  validator: IValidator<PrimitiveToken>,
  registry: IRegistry<PrimitiveToken>
): void {
  // 1. Validate the token
  const result = validator.validate(token);

  // 2. Check validation result
  if (!result.valid) {
    throw new Error(
      `Token validation failed: ${result.errors.join(', ')}`
    );
  }

  // 3. Log warnings if present
  if (result.warnings.length > 0) {
    console.warn(
      `Token registered with warnings: ${result.warnings.join(', ')}`
    );
  }

  // 4. Register the token
  registry.register(token);
}

// Example: Batch token registration with validation
export function registerTokenBatch(
  tokens: PrimitiveToken[],
  validator: IValidator<PrimitiveToken>,
  registry: IRegistry<PrimitiveToken>
): { succeeded: number; failed: number } {
  let succeeded = 0;
  let failed = 0;

  for (const token of tokens) {
    // 1. Validate each token
    const result = validator.validate(token);

    // 2. Only register if validation passed
    if (result.valid) {
      registry.register(token);
      succeeded++;
    } else {
      console.error(
        `Failed to register ${token.name}: ${result.errors.join(', ')}`
      );
      failed++;
    }
  }

  return { succeeded, failed };
}

// Example: Conditional validation
export function registerTokenWithOptions(
  token: PrimitiveToken,
  validator: IValidator<PrimitiveToken>,
  registry: IRegistry<PrimitiveToken>,
  options: { skipValidation?: boolean } = {}
): void {
  // 1. Optionally skip validation
  if (!options.skipValidation) {
    const result = validator.validate(token);
    
    if (!result.valid) {
      throw new Error(
        `Token validation failed: ${result.errors.join(', ')}`
      );
    }
  }

  // 2. Register the token
  registry.register(token);
}
```

---

## Pattern Variations

### Variation 1: Validation with Warnings

Some callers may want to register tokens even with warnings:

```typescript
const result = validator.validate(token);

// Register if no errors (warnings are acceptable)
if (result.level !== 'Error') {
  registry.register(token);
  
  if (result.warnings.length > 0) {
    console.warn(`Warnings: ${result.warnings.join(', ')}`);
  }
}
```

### Variation 2: Validation with Logging

Callers may want to log validation results:

```typescript
const result = validator.validate(token);

// Log validation result
console.log(`Validation result for ${token.name}:`, result);

// Register if valid
if (result.valid) {
  registry.register(token);
}
```

### Variation 3: Validation with Retry

Callers may want to retry validation after fixing issues:

```typescript
let result = validator.validate(token);

// Retry with adjusted token if validation failed
if (!result.valid) {
  const adjustedToken = adjustTokenForValidation(token, result);
  result = validator.validate(adjustedToken);
  
  if (result.valid) {
    registry.register(adjustedToken);
  }
}
```

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Validation in Registry

❌ **DON'T** put validation logic in registries:

```typescript
// ❌ BAD - Registry performs validation
class PrimitiveTokenRegistry {
  register(token: PrimitiveToken): void {
    // Validation mixed with storage
    if (token.value % 4 !== 0) {
      throw new Error('Token must align to baseline grid');
    }
    this.tokens.set(token.name, token);
  }
}
```

✅ **DO** keep registries focused on storage:

```typescript
// ✅ GOOD - Registry just stores
class PrimitiveTokenRegistry implements IRegistry<PrimitiveToken> {
  register(token: PrimitiveToken): void {
    this.tokens.set(token.name, token);
  }
}
```

### Anti-Pattern 2: Registration in Validator

❌ **DON'T** put registration logic in validators:

```typescript
// ❌ BAD - Validator performs registration
class BaselineGridValidator {
  validate(token: PrimitiveToken): ValidationResult {
    const result = this.checkAlignment(token);
    
    // Registration mixed with validation
    if (result.valid) {
      this.registry.register(token);
    }
    
    return result;
  }
}
```

✅ **DO** keep validators focused on validation:

```typescript
// ✅ GOOD - Validator just validates
class BaselineGridValidator implements IValidator<PrimitiveToken> {
  validate(token: PrimitiveToken): ValidationResult {
    return this.checkAlignment(token);
  }
}
```

### Anti-Pattern 3: Skipping Validation

❌ **DON'T** register without validation unless explicitly intended:

```typescript
// ❌ BAD - No validation
registry.register(token);
```

✅ **DO** validate before registration:

```typescript
// ✅ GOOD - Validate first
const result = validator.validate(token);
if (result.valid) {
  registry.register(token);
}
```

✅ **ACCEPTABLE** - Explicit skip with clear intent:

```typescript
// ✅ ACCEPTABLE - Explicit skip with documentation
// Skip validation because token was already validated upstream
registry.register(token, { skipValidation: true });
```

---

## Guidelines for AI Agents

When working with validators and registries, AI agents should follow these guidelines:

### 1. Always Validate Before Registration

```typescript
// ✅ CORRECT
const result = validator.validate(token);
if (result.valid) {
  registry.register(token);
}

// ❌ WRONG
registry.register(token); // No validation
```

### 2. Check Validation Results

```typescript
// ✅ CORRECT - Check result level
if (result.level === 'Error') {
  throw new Error('Validation failed');
}

// ❌ WRONG - Ignore validation result
validator.validate(token);
registry.register(token);
```

### 3. Handle Failures Appropriately

```typescript
// ✅ CORRECT - Handle failures
const result = validator.validate(token);
if (!result.valid) {
  console.error(`Validation failed: ${result.errors.join(', ')}`);
  return; // Don't register
}
registry.register(token);

// ❌ WRONG - Ignore failures
const result = validator.validate(token);
registry.register(token); // Register anyway
```

### 4. Use Orchestrators When Available

```typescript
// ✅ CORRECT - Use ValidationCoordinator
validationCoordinator.validatePrimitiveToken(token);

// ❌ WRONG - Duplicate orchestration logic
const result = validator.validate(token);
if (result.valid) {
  registry.register(token);
}
// (This is fine for custom cases, but use orchestrators when available)
```

### 5. Document Validation Skips

```typescript
// ✅ CORRECT - Document why validation is skipped
// Token already validated by upstream system
registry.register(token, { skipValidation: true });

// ❌ WRONG - Skip without explanation
registry.register(token, { skipValidation: true });
```

---

## Summary

The caller-validates-then-registers pattern provides:

- **Clear separation of concerns**: Validators validate, registries store, callers coordinate
- **Type safety**: TypeScript interfaces enforce correct usage
- **Testability**: Easy to test components independently
- **Consistency**: Unambiguous pattern applied uniformly
- **Flexibility**: Callers control validation and error handling

This pattern is the foundation for reliable token management in the DesignerPunk system and provides clear guidance for both human developers and AI agents.

---

**Related Documentation**:
- [IValidator Interface](../../src/validators/IValidator.ts)
- [IRegistry Interface](../../src/registries/IRegistry.ts)
- [ValidationCoordinator](../../src/integration/ValidationCoordinator.ts)
- [TokenEngine](../../src/TokenEngine.ts)
- [Validation Refactoring Migration Guide](../migration/validation-refactoring-guide.md) - Step-by-step migration from old pattern to new pattern
