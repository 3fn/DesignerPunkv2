# Validation Refactoring Migration Guide

**Date**: November 9, 2025
**Purpose**: Guide for migrating from old validation pattern to new separation of concerns pattern
**Organization**: process-standard
**Scope**: architecture-separation-of-concerns  
**Last Reviewed**: December 30, 2025  
**Status**: Active Reference

> **MCP Exclusion Note**: This document is intentionally excluded from the MCP documentation server. Migration guides serve a different purpose than steering/MCP documentation—they are architecture-specific transition guides that help users migrate between patterns, not ongoing development guidance for AI agents. The patterns documented here remain relevant for understanding the current architecture and troubleshooting validation issues, but the primary architectural guidance lives in `docs/architecture/registry-validator-pattern.md`.

---

## Overview

This guide helps you migrate code from the old validation pattern (where registries and generators performed validation) to the new separation of concerns pattern (where callers validate before registration/generation).

**Key Changes**:
- Validation logic removed from `TokenFileGenerator`, `PrimitiveTokenRegistry`, and `SemanticTokenRegistry`
- Validation now performed by dedicated validator classes implementing `IValidator` interface
- Callers responsible for validating tokens before registration or generation
- Clear separation: validators validate, registries store, generators generate

---

## Migration Patterns

### Pattern 1: ValidationCoordinator Usage

**Before** (validation in registry):
```typescript
// Old pattern - registry validates during registration
class ValidationCoordinator {
  validateToken(token: PrimitiveToken): ValidationResult {
    // Registry validates internally
    return this.primitiveRegistry.validateToken(token);
  }
  
  validateAllTokens(): ValidationResult[] {
    // Registry validates all tokens
    return this.primitiveRegistry.validateAll();
  }
}
```

**After** (caller validates before registration):
```typescript
// New pattern - coordinator validates before calling registry
class ValidationCoordinator {
  constructor(
    private primitiveRegistry: IRegistry<PrimitiveToken>,
    private semanticRegistry: IRegistry<SemanticToken>,
    private baselineGridValidator: BaselineGridValidator,
    private semanticTokenValidator: SemanticTokenValidator
  ) {}
  
  validateToken(token: PrimitiveToken): ValidationResult {
    // Validate using dedicated validator
    const validationResult = this.baselineGridValidator.validate(token);
    
    // Handle validation result
    if (validationResult.level === 'Error') {
      throw new Error(`Validation failed: ${validationResult.errors.join(', ')}`);
    }
    
    // Register only if validation passes
    this.primitiveRegistry.register(token);
    
    return validationResult;
  }
  
  validateAllTokens(tokens: PrimitiveToken[]): ValidationResult[] {
    const results: ValidationResult[] = [];
    
    for (const token of tokens) {
      // Validate each token
      const result = this.baselineGridValidator.validate(token);
      results.push(result);
      
      // Register only if validation passes
      if (result.level !== 'Error') {
        this.primitiveRegistry.register(token);
      }
    }
    
    return results;
  }
}
```

**Key Changes**:
- ✅ Inject validators in constructor
- ✅ Call `validator.validate()` before registration
- ✅ Check validation result level
- ✅ Call `registry.register()` only after validation passes
- ✅ Handle validation failures appropriately

---

### Pattern 2: TokenEngine Usage

**Before** (validation in registry):
```typescript
// Old pattern - registry validates during registration
class TokenEngine {
  validateToken(token: PrimitiveToken): ValidationResult {
    // Delegates to ValidationCoordinator which delegates to registry
    return this.validationCoordinator.validateToken(token);
  }
}
```

**After** (caller validates before registration):
```typescript
// New pattern - engine validates before registration
class TokenEngine {
  constructor(
    private primitiveRegistry: IRegistry<PrimitiveToken>,
    private baselineGridValidator: BaselineGridValidator,
    private validationCoordinator: ValidationCoordinator
  ) {}
  
  validateToken(token: PrimitiveToken): ValidationResult {
    // Validate using dedicated validator
    const validationResult = this.baselineGridValidator.validate(token);
    
    // Handle validation failures
    if (validationResult.level === 'Error') {
      throw new Error(`Token validation failed: ${validationResult.errors.join(', ')}`);
    }
    
    // Register only if validation succeeds
    this.primitiveRegistry.register(token);
    
    return validationResult;
  }
}
```

**Key Changes**:
- ✅ Inject validators in constructor
- ✅ Validate before registration
- ✅ Handle validation failures explicitly
- ✅ Register only after validation passes

---

### Pattern 3: ValidationPipeline Usage

**Before** (validation in registry):
```typescript
// Old pattern - pipeline relies on registry validation
class ValidationPipeline {
  async validatePrimitives(tokens: PrimitiveToken[]): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    
    for (const token of tokens) {
      // Registry validates during registration
      this.primitiveRegistry.register(token);
      results.push({ valid: true, level: 'Pass', errors: [], warnings: [] });
    }
    
    return results;
  }
}
```

**After** (caller validates before registration):
```typescript
// New pattern - pipeline validates before registration
class ValidationPipeline {
  constructor(
    private primitiveRegistry: IRegistry<PrimitiveToken>,
    private semanticRegistry: IRegistry<SemanticToken>,
    private baselineGridValidator: BaselineGridValidator,
    private semanticTokenValidator: SemanticTokenValidator
  ) {}
  
  async validatePrimitives(tokens: PrimitiveToken[]): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    
    for (const token of tokens) {
      // Validate before registration
      const result = this.baselineGridValidator.validate(token);
      results.push(result);
      
      // Register only if validation passes
      if (result.level !== 'Error') {
        this.primitiveRegistry.register(token);
      }
    }
    
    return results;
  }
  
  async validateSemantics(tokens: SemanticToken[]): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    
    for (const token of tokens) {
      // Validate semantic token references
      const result = this.semanticTokenValidator.validate(token);
      results.push(result);
      
      // Register only if validation passes
      if (result.level !== 'Error') {
        this.semanticRegistry.register(token);
      }
    }
    
    return results;
  }
}
```

**Key Changes**:
- ✅ Inject validators in constructor
- ✅ Validate each token before registration
- ✅ Collect validation results
- ✅ Register only tokens that pass validation
- ✅ Handle errors appropriately

---

### Pattern 4: TokenFileGenerator Usage

**Before** (validation in generator):
```typescript
// Old pattern - generator validates during generation
class TokenFileGenerator {
  generateWebTokens(tokens: PrimitiveToken[], semantics: SemanticToken[]): GenerationResult {
    // Generator validates semantic references
    const validationResult = this.validateSemanticReferences(semantics, tokens);
    
    if (!validationResult.valid) {
      return { content: '', valid: false, errors: validationResult.errors };
    }
    
    // Generate tokens
    return this.generateWebContent(tokens, semantics);
  }
  
  private validateSemanticReferences(semantics: SemanticToken[], tokens: PrimitiveToken[]): ValidationResult {
    // Validation logic in generator (mixed responsibility)
    // ...
  }
}
```

**After** (caller validates before generation):
```typescript
// New pattern - caller validates before calling generator
class TokenGenerationWorkflow {
  constructor(
    private tokenFileGenerator: TokenFileGenerator,
    private semanticTokenValidator: SemanticTokenValidator
  ) {}
  
  generateWebTokens(tokens: PrimitiveToken[], semantics: SemanticToken[]): GenerationResult {
    // Validate semantic references before generation
    const validationResult = this.semanticTokenValidator.validate({
      semantics,
      primitives: tokens
    });
    
    if (!validationResult.valid) {
      console.error('Semantic validation failed:', validationResult.errors);
      return { content: '', valid: false, errors: validationResult.errors };
    }
    
    // Generator just generates (no validation)
    return this.tokenFileGenerator.generateWebTokens(tokens, semantics);
  }
}

// TokenFileGenerator now only generates
class TokenFileGenerator {
  generateWebTokens(tokens: PrimitiveToken[], semantics: SemanticToken[]): GenerationResult {
    // No validation - just generation
    return this.generateWebContent(tokens, semantics);
  }
}
```

**Key Changes**:
- ✅ Validation moved to `SemanticTokenValidator`
- ✅ Caller validates before calling generator
- ✅ Generator focuses solely on generation
- ✅ Clear separation of concerns

---

### Pattern 5: Direct Registry Usage

**Before** (validation in registry):
```typescript
// Old pattern - registry validates during registration
const registry = new PrimitiveTokenRegistry();

// Registry validates internally
registry.register(token);

// Registry validates all tokens
const results = registry.validateAll();
```

**After** (caller validates before registration):
```typescript
// New pattern - caller validates before registration
const registry = new PrimitiveTokenRegistry();
const validator = new BaselineGridValidator();

// Validate before registration
const validationResult = validator.validate(token);

if (validationResult.level === 'Error') {
  throw new Error(`Validation failed: ${validationResult.errors.join(', ')}`);
}

// Register only if validation passes
registry.register(token);

// To validate all tokens, iterate and validate each
const tokens = [token1, token2, token3];
const results: ValidationResult[] = [];

for (const token of tokens) {
  const result = validator.validate(token);
  results.push(result);
  
  if (result.level !== 'Error') {
    registry.register(token);
  }
}
```

**Key Changes**:
- ✅ Create validator instance
- ✅ Validate before registration
- ✅ Check validation result
- ✅ Register only after validation passes
- ✅ Handle validation failures

---

## Common Migration Scenarios

### Scenario 1: Component Using ValidationCoordinator

**Migration Steps**:

1. **Update constructor** to inject validators:
```typescript
constructor(
  private validationCoordinator: ValidationCoordinator,
  private baselineGridValidator: BaselineGridValidator,
  private semanticTokenValidator: SemanticTokenValidator
) {}
```

2. **Replace registry validation calls** with validator calls:
```typescript
// Before
const result = this.validationCoordinator.validateToken(token);

// After
const result = this.baselineGridValidator.validate(token);
if (result.level !== 'Error') {
  this.primitiveRegistry.register(token);
}
```

3. **Update tests** to provide validators:
```typescript
const coordinator = new ValidationCoordinator(
  primitiveRegistry,
  semanticRegistry,
  new BaselineGridValidator(),
  new SemanticTokenValidator()
);
```

---

### Scenario 2: Component Using TokenEngine

**Migration Steps**:

1. **Update constructor** to inject validators:
```typescript
constructor(
  private tokenEngine: TokenEngine,
  private baselineGridValidator: BaselineGridValidator
) {}
```

2. **Validate before calling TokenEngine**:
```typescript
// Before
const result = this.tokenEngine.validateToken(token);

// After
const result = this.baselineGridValidator.validate(token);
if (result.level !== 'Error') {
  this.primitiveRegistry.register(token);
}
```

3. **Update tests** to provide validators

---

### Scenario 3: Component Using TokenFileGenerator

**Migration Steps**:

1. **Update constructor** to inject validators:
```typescript
constructor(
  private tokenFileGenerator: TokenFileGenerator,
  private semanticTokenValidator: SemanticTokenValidator
) {}
```

2. **Validate before generation**:
```typescript
// Before
const result = this.tokenFileGenerator.generateWebTokens(tokens, semantics);

// After
const validationResult = this.semanticTokenValidator.validate({
  semantics,
  primitives: tokens
});

if (!validationResult.valid) {
  throw new Error('Validation failed');
}

const result = this.tokenFileGenerator.generateWebTokens(tokens, semantics);
```

3. **Update tests** to validate separately

---

### Scenario 4: Direct Registry Usage

**Migration Steps**:

1. **Create validator instance**:
```typescript
const validator = new BaselineGridValidator();
```

2. **Validate before registration**:
```typescript
// Before
registry.register(token);

// After
const result = validator.validate(token);
if (result.level !== 'Error') {
  registry.register(token);
}
```

3. **Replace validateAll() calls**:
```typescript
// Before
const results = registry.validateAll();

// After
const results: ValidationResult[] = [];
for (const token of tokens) {
  results.push(validator.validate(token));
}
```

---

## Troubleshooting

### Issue 1: "validateToken is not a function"

**Symptom**: Error when calling `registry.validateToken()`

**Cause**: `validateToken()` method removed from registries

**Solution**: Use dedicated validators instead:
```typescript
// Wrong
const result = registry.validateToken(token);

// Correct
const validator = new BaselineGridValidator();
const result = validator.validate(token);
```

---

### Issue 2: "validateAll is not a function"

**Symptom**: Error when calling `registry.validateAll()`

**Cause**: `validateAll()` method removed from registries

**Solution**: Iterate and validate each token:
```typescript
// Wrong
const results = registry.validateAll();

// Correct
const validator = new BaselineGridValidator();
const results: ValidationResult[] = [];
for (const token of registry.query()) {
  results.push(validator.validate(token));
}
```

---

### Issue 3: Tokens registered without validation

**Symptom**: Invalid tokens being registered

**Cause**: Forgot to validate before registration

**Solution**: Always validate before registration:
```typescript
// Wrong
registry.register(token);

// Correct
const result = validator.validate(token);
if (result.level !== 'Error') {
  registry.register(token);
}
```

---

### Issue 4: Validation failures not handled

**Symptom**: No error messages when validation fails

**Cause**: Not checking validation result level

**Solution**: Check validation result and handle failures:
```typescript
const result = validator.validate(token);

if (result.level === 'Error') {
  throw new Error(`Validation failed: ${result.errors.join(', ')}`);
}

registry.register(token);
```

---

### Issue 5: Missing validator dependencies

**Symptom**: "Cannot read property 'validate' of undefined"

**Cause**: Validator not injected in constructor

**Solution**: Inject validators in constructor:
```typescript
// Wrong
class MyComponent {
  constructor(private registry: IRegistry<PrimitiveToken>) {}
}

// Correct
class MyComponent {
  constructor(
    private registry: IRegistry<PrimitiveToken>,
    private validator: BaselineGridValidator
  ) {}
}
```

---

## Validation Checklist

Use this checklist when migrating code:

- [ ] **Remove registry validation calls**: No more `registry.validateToken()` or `registry.validateAll()`
- [ ] **Inject validators**: Add validators to constructor dependencies
- [ ] **Validate before registration**: Call `validator.validate()` before `registry.register()`
- [ ] **Check validation results**: Verify `validationResult.level` before proceeding
- [ ] **Handle validation failures**: Throw errors or log warnings for failed validations
- [ ] **Update tests**: Provide validators in test setup
- [ ] **Remove generator validation**: No validation logic in `TokenFileGenerator`
- [ ] **Validate before generation**: Call validators before calling generator methods
- [ ] **Update imports**: Import validators from `src/validators/`
- [ ] **Verify separation of concerns**: Validators validate, registries store, generators generate

---

## Related Documentation

- [Registry-Validator Interaction Pattern](../architecture/registry-validator-pattern.md) - Definitive guide for validation and registration patterns
- [IValidator Interface](../../src/validators/IValidator.ts) - Common validator interface
- [IRegistry Interface](../../src/registries/IRegistry.ts) - Common registry interface
- [Architecture Separation of Concerns Spec](../../.kiro/specs/architecture-separation-of-concerns/design.md) - Complete design and rationale

---

*This migration guide provides practical patterns and troubleshooting for transitioning to the new separation of concerns architecture.*
