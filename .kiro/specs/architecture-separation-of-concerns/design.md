# Design Document: Architecture - Separation of Concerns

**Date**: November 8, 2025
**Spec**: architecture-separation-of-concerns
**Status**: Design Phase
**Dependencies**: None

---

## Overview

This design document addresses five critical architectural violations discovered during the Phase 1 Architecture Audit: validation logic duplicated across multiple components and missing common interfaces for validators and registries. The solution establishes proper separation of concerns by creating common interfaces and extracting validation logic from components with mixed responsibilities.

**Core Design Principles**:
- Single Responsibility: Each component has one well-defined purpose
- Interface Segregation: Common interfaces enable polymorphic usage
- Dependency Inversion: Components depend on abstractions, not concrete implementations
- Separation of Concerns: Validation, storage, and generation are distinct responsibilities

**Issues Being Addressed**:
- Issue #012: TokenFileGenerator performs validation (should only generate)
- Issue #013: PrimitiveTokenRegistry performs validation (should only store)
- Issue #014: SemanticTokenRegistry performs validation (should only store)
- Issue #016: Validator system lacks common interface (prevents polymorphic usage)
- Issue #017: Registry system lacks common interface (prevents polymorphic usage)

---

## Current State Analysis (Requirement 7)

### Dependency Investigation Results

**Investigation Date**: November 8, 2025
**Method**: Searched codebase for all usages of validation methods being removed

#### TokenFileGenerator.validateSemanticReferences()

**Location**: `src/generators/TokenFileGenerator.ts` (lines 531-560)

**Internal Usage** (3 calls within TokenFileGenerator):
- Line 232: `generateWebTokens()` - validates before generating semantic section
- Line 347: `generateiOSTokens()` - validates before generating semantic section  
- Line 462: `generateAndroidTokens()` - validates before generating semantic section

**Test Usage** (5 test cases):
- `src/generators/__tests__/TokenFileGenerator.test.ts` (lines 476, 508, 542, 572, 606)

**External Usage**: None - method is only called internally by TokenFileGenerator

**Impact Assessment**: LOW - No external dependencies, easy to refactor

---

#### Registry.validateToken()

**Locations**: 
- `src/registries/PrimitiveTokenRegistry.ts` (line 170)
- `src/registries/SemanticTokenRegistry.ts` (line 224)

**Internal Usage** (registries call their own validateToken):
- `PrimitiveTokenRegistry.register()` (line 59) - validates during registration
- `SemanticTokenRegistry.register()` (line 60) - validates during registration
- `PrimitiveTokenRegistry.validateAll()` (line 170) - validates all tokens
- `SemanticTokenRegistry.validateAll()` (line 224) - validates all tokens

**External Usage** (HIGH - many callers):
- `ValidationCoordinator.validateToken()` (line 248) - delegates to registry
- `ValidationCoordinator.validateAllTokens()` (line 127) - maps over tokens
- `ValidationCoordinator.validatePrimitiveTokens()` (line 135) - maps over primitives
- `ValidationCoordinator.validateSemanticTokens()` (line 143) - maps over semantics
- `TokenEngine.validateToken()` (line 248) - delegates to ValidationCoordinator
- `ValidationPipeline` (lines 120, 137) - validates primitives and semantics
- `CrossPlatformConsistencyValidator.validateToken()` (line 440)
- `TokenComparator` (line 317) - F1 validator integration
- `MathematicalConsistencyValidator` (line 198) - cross-platform validation
- Multiple test files (extensive test coverage)

**Impact Assessment**: HIGH - Many external callers, requires careful migration strategy

---

#### Registry.validateAll()

**Locations**:
- `src/registries/PrimitiveTokenRegistry.ts` (line 170)
- `src/registries/SemanticTokenRegistry.ts` (line 224)

**External Usage**: 
- Test files only (lines 288, 316, 369 in registry tests)

**Impact Assessment**: LOW - Only used in tests, easy to refactor

---

### Current Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                   TokenFileGenerator                         │
│  - generateWebTokens()                                       │
│  - generateiOSTokens()                                       │
│  - generateAndroidTokens()                                   │
│  - validateSemanticReferences() ❌ MIXED RESPONSIBILITY      │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ uses
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              PrimitiveTokenRegistry                          │
│  - register(token)                                           │
│  - query()                                                   │
│  - validateToken() ❌ MIXED RESPONSIBILITY                   │
│  - validateAll() ❌ MIXED RESPONSIBILITY                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              SemanticTokenRegistry                           │
│  - register(token)                                           │
│  - query()                                                   │
│  - validateToken() ❌ MIXED RESPONSIBILITY                   │
│  - validateAll() ❌ MIXED RESPONSIBILITY                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                 Validator Classes                            │
│  - PassValidator                                             │
│  - WarningValidator                                          │
│  - ErrorValidator                                            │
│  - BaselineGridValidator                                     │
│  - SemanticTokenValidator                                    │
│  - SyntaxValidator                                           │
│  - ThreeTierValidator (orchestrator)                         │
│  ❌ NO COMMON INTERFACE                                      │
└─────────────────────────────────────────────────────────────┘
```

**Problems**:
1. TokenFileGenerator has validation logic (mixed responsibility)
2. Registries have validation logic (mixed responsibility)
3. Validators have no common interface (can't use polymorphically)
4. Registries have no common interface (can't use polymorphically)
5. Validation logic duplicated across 3 components

---

## Desired State Architecture

### Target Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                   TokenFileGenerator                         │
│  - generateWebTokens()                                       │
│  - generateiOSTokens()                                       │
│  - generateAndroidTokens()                                   │
│  ✅ NO VALIDATION LOGIC                                      │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ uses
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              PrimitiveTokenRegistry                          │
│  implements IRegistry<PrimitiveToken>                        │
│  - register(token)                                           │
│  - query()                                                   │
│  - get(name)                                                 │
│  - has(name)                                                 │
│  ✅ NO VALIDATION LOGIC                                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              SemanticTokenRegistry                           │
│  implements IRegistry<SemanticToken>                         │
│  - register(token)                                           │
│  - query()                                                   │
│  - get(name)                                                 │
│  - has(name)                                                 │
│  ✅ NO VALIDATION LOGIC                                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    IValidator Interface                      │
│  - validate(input): ValidationResult                         │
│  ✅ COMMON CONTRACT                                          │
└─────────────────────────────────────────────────────────────┘
                           ▲
                           │ implements
                           │
┌─────────────────────────────────────────────────────────────┐
│                 Validator Classes                            │
│  - PassValidator implements IValidator                       │
│  - WarningValidator implements IValidator                    │
│  - ErrorValidator implements IValidator                      │
│  - BaselineGridValidator implements IValidator               │
│  - SemanticTokenValidator implements IValidator             │
│  - SyntaxValidator implements IValidator                     │
│  - ThreeTierValidator (orchestrates IValidator[])            │
│  ✅ POLYMORPHIC USAGE ENABLED                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              ValidationCoordinator                           │
│  - Calls validators BEFORE registration                      │
│  - Delegates to IValidator implementations                   │
│  - Passes validation results to callers                      │
│  ✅ ORCHESTRATES VALIDATION                                  │
└─────────────────────────────────────────────────────────────┘
```

**Benefits**:
1. Clear separation: generators generate, registries store, validators validate
2. Common interfaces enable polymorphic usage
3. Validation logic centralized in validators only
4. Easy to add new validators (implement IValidator)
5. Easy to add new registries (implement IRegistry)
6. Testable components with single responsibilities

---

## Component Design

### IValidator Interface

**Purpose**: Common contract for all validators enabling polymorphic usage

**Interface Definition**:
```typescript
/**
 * Common interface for all validators
 * Enables polymorphic usage and consistent validation contracts
 */
export interface IValidator<TInput = any> {
  /**
   * Validate input and return validation result
   * @param input - The input to validate (token, configuration, etc.)
   * @returns Validation result with status and messages
   */
  validate(input: TInput): ValidationResult | Promise<ValidationResult>;
  
  /**
   * Validator name for identification and logging
   */
  readonly name: string;
}

/**
 * Validation result structure
 * Matches existing pattern used throughout codebase
 */
export interface ValidationResult {
  valid: boolean;
  level: 'Pass' | 'Warning' | 'Error';
  errors: string[];
  warnings: string[];
  messages?: string[];
}
```

**Design Decisions**:
- Generic `<TInput>` allows validators to accept different input types
- Supports both sync and async validation (Promise<ValidationResult>)
- Uses existing ValidationResult structure (no breaking changes)
- Includes `name` property for identification in logs and debugging

---

### IRegistry Interface

**Purpose**: Common contract for all registries enabling polymorphic usage

**Interface Definition**:
```typescript
/**
 * Common interface for all token registries
 * Enables polymorphic usage and consistent storage contracts
 */
export interface IRegistry<TToken> {
  /**
   * Register a token in the registry
   * @param token - The token to register
   * @param options - Optional registration options
   */
  register(token: TToken, options?: RegistrationOptions): void;
  
  /**
   * Query all tokens in the registry
   * @returns Array of all registered tokens
   */
  query(): TToken[];
  
  /**
   * Get a specific token by name
   * @param name - Token name
   * @returns Token if found, undefined otherwise
   */
  get(name: string): TToken | undefined;
  
  /**
   * Check if a token exists in the registry
   * @param name - Token name
   * @returns True if token exists, false otherwise
   */
  has(name: string): boolean;
  
  /**
   * Registry name for identification
   */
  readonly name: string;
}

/**
 * Registration options
 */
export interface RegistrationOptions {
  /**
   * Skip validation during registration
   * Used when token is already validated
   */
  skipValidation?: boolean;
}
```

**Design Decisions**:
- Generic `<TToken>` allows registries to store different token types
- Maintains existing `skipValidation` option for backward compatibility
- No validation methods (validateToken, validateAll) - registries just store
- Includes `name` property for identification

---

## Registry-Validator Interaction Pattern (Requirement 8)

### Chosen Pattern: Caller Validates, Then Registers

**Pattern Description**: The caller is responsible for validating tokens before registration. Registries trust that tokens are valid and focus solely on storage.

**Rationale**:
- **Separation of Concerns**: Registries don't know about validation
- **Flexibility**: Callers can choose when/how to validate
- **Testability**: Easy to test validation and registration separately
- **Existing Pattern**: ValidationCoordinator already follows this pattern

**Code Example**:
```typescript
// Caller validates, then registers
const validationResult = validator.validate(token);

if (validationResult.valid) {
  registry.register(token);
} else {
  // Handle validation failure
  console.error('Validation failed:', validationResult.errors);
}
```

**Alternative Patterns Considered**:

**Pattern B: Registry Accepts Validation Results**
```typescript
// Registry receives validation proof
const validationResult = validator.validate(token);
registry.register(token, validationResult);
```
- ❌ Rejected: Couples registry to validation results
- ❌ Rejected: Registry needs to understand validation

**Pattern C: Registry Requires Validator Reference**
```typescript
// Registry has validator reference
const registry = new Registry(validator);
registry.register(token); // Validates internally
```
- ❌ Rejected: Registry performs validation (mixed responsibility)
- ❌ Rejected: Tight coupling between registry and validator

---

## Migration Strategy

### Phase 1: Create Interfaces (No Breaking Changes)

**Tasks**:
1. Create `IValidator` interface in `src/validators/IValidator.ts`
2. Create `IRegistry` interface in `src/registries/IRegistry.ts`
3. Update all validators to implement `IValidator`
4. Update both registries to implement `IRegistry`

**Impact**: None - interfaces are additive, no breaking changes

---

### Phase 2: Extract Validation from TokenFileGenerator

**Current Code**:
```typescript
// TokenFileGenerator.generateWebTokens()
const validationResult = this.validateSemanticReferences(semantics, tokens);
if (!validationResult.valid) {
  console.error('Semantic validation failed:', validationResult.errors);
  return { content: '', valid: false, errors: validationResult.errors };
}
```

**Refactored Code**:
```typescript
// Caller validates before calling generator
const validationResult = semanticTokenValidator.validate(semantics, tokens);
if (!validationResult.valid) {
  console.error('Semantic validation failed:', validationResult.errors);
  return { content: '', valid: false, errors: validationResult.errors };
}

// Generator just generates
const result = tokenFileGenerator.generateWebTokens(tokens, semantics);
```

**Migration Steps**:
1. Move `validateSemanticReferences()` logic to `SemanticTokenValidator`
2. Update `generateWebTokens()`, `generateiOSTokens()`, `generateAndroidTokens()` to remove validation
3. Update callers to validate before calling generator
4. Update tests to use validator directly

**Impact**: LOW - Only internal usage, no external callers

---

### Phase 3: Extract Validation from Registries (HIGH IMPACT)

**Current Code**:
```typescript
// PrimitiveTokenRegistry.register()
let validationResult: ValidationResult;
if (!skipValidation) {
  validationResult = this.validateToken(token);
  if (validationResult.level === 'Error') {
    return validationResult;
  }
}
this.tokens.set(token.name, token);
```

**Refactored Code**:
```typescript
// Caller validates before registration
const validationResult = validator.validate(token);
if (validationResult.level === 'Error') {
  throw new Error(`Validation failed: ${validationResult.errors.join(', ')}`);
}

// Registry just stores
registry.register(token);
```

**Migration Steps**:
1. Update `ValidationCoordinator` to validate before calling `registry.register()`
2. Update `TokenEngine` to validate before registration
3. Update `ValidationPipeline` to validate before registration
4. Remove `validateToken()` and `validateAll()` from registries
5. Update all tests to validate separately

**Impact**: HIGH - Many external callers, requires systematic updates

**Mitigation Strategy**:
- Update callers incrementally (one component at a time)
- Keep `skipValidation` option during transition
- Add deprecation warnings before removing methods
- Comprehensive testing at each step

---

## Documentation Updates (Requirement 9)

### Documents Requiring Updates

**1. Phase 1 Architecture Report**
- **File**: `.kiro/audits/phase-1-architecture-report.md`
- **Updates**: Mark Issues #012-#017 as resolved, document refactoring approach
- **Effort**: 30 minutes

**2. Token System Overview**
- **File**: `docs/token-system-overview.md`
- **Updates**: Update validation flow description if mentioned
- **Effort**: 15 minutes

**3. Preserved Knowledge - Token Architecture**
- **File**: `preserved-knowledge/token-architecture-2-0-mathematics.md`
- **Updates**: Update validation section to reflect new separation
- **Effort**: 30 minutes

**4. API Documentation** (if exists)
- **Files**: Any developer guides for using registries/validators
- **Updates**: Update examples to show new validation pattern
- **Effort**: 30 minutes

**Total Estimated Effort**: 1.5-2 hours

---

## Testing Strategy

### Unit Tests

**IValidator Interface**:
- Test that all validators implement interface correctly
- Test that validators return correct ValidationResult structure
- Test both sync and async validation paths

**IRegistry Interface**:
- Test that both registries implement interface correctly
- Test that registries store and retrieve tokens correctly
- Test that registries don't perform validation

**Extracted Validation**:
- Test SemanticTokenValidator with logic from TokenFileGenerator
- Test that validation logic works identically after extraction
- Test error cases and edge cases

### Integration Tests

**Validation → Registration Flow**:
- Test that ValidationCoordinator validates before registration
- Test that TokenEngine validates before registration
- Test that validation failures prevent registration
- Test that validation successes allow registration

**End-to-End Tests**:
- Test complete token generation workflow
- Test complete token registration workflow
- Verify no breaking changes in generated output

---

## Design Decisions

### Decision 1: Caller Validates Pattern

**Options Considered**:
1. Caller validates, then registers (chosen)
2. Registry accepts validation results
3. Registry requires validator reference

**Decision**: Caller validates, then registers

**Rationale**: Best separation of concerns, most flexible, matches existing ValidationCoordinator pattern

**Trade-offs**:
- ✅ Gained: Clean separation, flexibility, testability
- ❌ Lost: Slight increase in caller responsibility
- ⚠️ Risk: Callers might forget to validate (mitigated by TypeScript types and documentation)

---

### Decision 2: Generic Interface Types

**Options Considered**:
1. Generic interfaces (IValidator<TInput>, IRegistry<TToken>)
2. Specific interfaces (ITokenValidator, IPrimitiveRegistry, ISemanticRegistry)

**Decision**: Generic interfaces

**Rationale**: More flexible, supports future validator/registry types, follows TypeScript best practices

**Trade-offs**:
- ✅ Gained: Flexibility, reusability, type safety
- ❌ Lost: Slightly more complex type signatures
- ⚠️ Risk: None - generics are well-understood TypeScript pattern

---

### Decision 3: Incremental Migration

**Options Considered**:
1. Big bang refactoring (all at once)
2. Incremental migration (phase by phase)

**Decision**: Incremental migration

**Rationale**: Safer, easier to test, allows validation at each step, reduces risk

**Trade-offs**:
- ✅ Gained: Safety, testability, incremental validation
- ❌ Lost: Takes longer than big bang approach
- ⚠️ Risk: Minimal - each phase is independently testable

---

## Implementation Order

**Phase 1: Interfaces** (Low Risk)
1. Create IValidator interface
2. Create IRegistry interface
3. Update validators to implement IValidator
4. Update registries to implement IRegistry

**Phase 2: TokenFileGenerator** (Low Risk)
1. Extract validation to SemanticTokenValidator
2. Remove validation from TokenFileGenerator
3. Update callers and tests

**Phase 3: Registries** (High Risk - Careful Migration)
1. Update ValidationCoordinator
2. Update TokenEngine
3. Update ValidationPipeline
4. Update other callers
5. Remove validateToken() and validateAll()
6. Update all tests

**Phase 4: Documentation** (Low Risk)
1. Update architecture report
2. Update token system overview
3. Update preserved knowledge
4. Update API documentation

---

*This design document provides the complete architecture for establishing proper separation of concerns across the validation, registry, and generation systems through common interfaces and extracted validation logic.*

**Organization**: spec-design
**Scope**: architecture-separation-of-concerns
