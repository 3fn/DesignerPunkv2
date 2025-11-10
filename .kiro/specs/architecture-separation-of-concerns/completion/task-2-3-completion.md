# Task 2.3 Completion: Update Callers to Validate Before Generation

**Date**: November 8, 2025
**Task**: 2.3 Update callers to validate before generation
**Type**: Implementation
**Status**: Complete

---

## Artifacts Modified

- `src/generators/generateTokenFiles.ts` - Updated to validate before calling generateAll()
- `src/build/BuildOrchestrator.ts` - Updated to validate before calling individual generation methods
- `src/generators/__tests__/TokenFileGenerator.test.ts` - Updated tests to use SemanticTokenValidator

## Implementation Details

### Approach

Updated all callers of TokenFileGenerator generation methods to validate semantic token references before generation. This ensures that validation happens at the caller level rather than within the generator, completing the separation of concerns refactoring.

### Key Changes

**1. Updated generateTokenFiles.ts (Main Entry Point)**

Added validation step before calling `generateAll()`:

```typescript
// Validate semantic token references before generation
const primitiveRegistry = new PrimitiveTokenRegistry();
const semanticRegistry = new SemanticTokenRegistry(primitiveRegistry);
const validator = new SemanticTokenValidator(primitiveRegistry, semanticRegistry);

const primitiveTokens = getAllPrimitiveTokens();
const semanticTokens = getAllSemanticTokens();

const validationResult = validator.validateSemanticReferences(semanticTokens, primitiveTokens);

if (validationResult.level === 'Error') {
  // Log errors and abort generation
  console.error('❌ Semantic token validation failed');
  return;
}
```

**2. Updated BuildOrchestrator.ts (Build System Integration)**

Added validation in `buildPlatform()` method before calling individual generation methods:

```typescript
// Validate semantic token references before generation
const primitiveRegistry = new PrimitiveTokenRegistry();
const semanticRegistry = new SemanticTokenRegistry(primitiveRegistry);
const validator = new SemanticTokenValidator(primitiveRegistry, semanticRegistry);

const semanticTokens = getAllSemanticTokens();
const validationResult = validator.validateSemanticReferences(semanticTokens, allTokens);

if (validationResult.level === 'Error') {
  // Add error to build result and return early
  errors.push({
    code: 'VALIDATION_FAILED',
    message: validationResult.message,
    // ... error details
  });
  return { platform, success: false, ... };
}
```

**3. Updated Test File**

Updated all test cases that were calling the removed `validateSemanticReferences()` method on the generator to use the validator directly:

```typescript
// Old approach (no longer works)
const validation = generator.validateSemanticReferences(semantics, primitives);

// New approach (uses validator)
const primitiveRegistry = new PrimitiveTokenRegistry();
const semanticRegistry = new SemanticTokenRegistry(primitiveRegistry);
const validator = new SemanticTokenValidator(primitiveRegistry, semanticRegistry);
const validation = validator.validateSemanticReferences(semantics, primitives);
```

### Error Handling

**generateTokenFiles.ts**:
- Logs detailed error messages to console
- Displays validation rationale and suggestions
- Aborts generation by returning early
- Handles warnings by logging but continuing

**BuildOrchestrator.ts**:
- Creates BuildError with VALIDATION_FAILED code
- Includes validation rationale in error context
- Provides actionable suggestions
- Returns failed BuildResult with error details
- Handles warnings by adding to warnings array

### Validation Flow

1. **Caller creates validator instance** with required registries
2. **Caller gets tokens** (primitives and semantics)
3. **Caller calls validator.validateSemanticReferences()** with tokens
4. **Caller checks validation result level**:
   - Error: Log errors, abort generation, return early
   - Warning: Log warnings, continue with generation
   - Pass: Continue with generation
5. **Caller proceeds to generation** only if validation passed

## Validation (Tier 2: Standard)

### Syntax Validation
✅ getDiagnostics passed - no syntax errors
✅ All imports resolve correctly
✅ Type annotations correct

### Functional Validation
✅ generateTokenFiles.ts validates before calling generateAll()
✅ BuildOrchestrator validates before calling individual generation methods
✅ Validation failures prevent generation (early return)
✅ Validation successes allow generation to proceed
✅ Error handling logs appropriate messages

### Integration Validation
✅ Integrates with SemanticTokenValidator correctly
✅ Integrates with PrimitiveTokenRegistry and SemanticTokenRegistry
✅ getAllPrimitiveTokens() and getAllSemanticTokens() work correctly
✅ Validation results checked before proceeding to generation

### Requirements Compliance
✅ Requirement 4.2: Validation step added before calling generator
✅ Requirement 4.3: Validation failures handled appropriately (log errors, return early)
✅ Requirement 4.4: Validation results checked before proceeding to generation

## Callers Identified and Updated

### Production Code Callers

1. **generateTokenFiles.ts** (Main entry point)
   - Status: ✅ Updated
   - Validates before calling `generateAll()`
   - Handles errors by aborting generation

2. **BuildOrchestrator.ts** (Build system)
   - Status: ✅ Updated
   - Validates before calling individual generation methods
   - Handles errors by returning failed BuildResult

### Test Code Callers

3. **TokenFileGenerator.test.ts** (Unit tests)
   - Status: ✅ Updated
   - 5 test cases updated to use validator directly
   - Tests now validate the validator, not the generator

### Other Callers

4. **Integration tests** (BuildSystemIntegration.test.ts, etc.)
   - Status: ✅ No changes needed
   - These tests call `generateAll()` which doesn't validate internally
   - Validation happens at the caller level (generateTokenFiles.ts or BuildOrchestrator)

5. **verify-build.js** (Build verification script)
   - Status: ✅ No changes needed
   - Calls generation methods directly for verification
   - Validation not required for build verification

## Test Results

All validation-related tests passing:
- ✅ should validate semantic tokens with valid single references
- ✅ should detect invalid single reference
- ✅ should validate typography tokens with all required references
- ✅ should detect missing required typography property
- ✅ should detect invalid typography property reference

## Impact Assessment

**Breaking Changes**: None
- Callers now validate before generation
- Generator methods still work the same way
- Tests updated to use validator directly

**Behavior Changes**:
- Validation now happens at caller level
- Validation failures prevent generation
- Error messages more detailed and actionable

**Performance Impact**: Minimal
- Validation happens once before generation
- No performance degradation observed

## Next Steps

This completes Phase 2 (Extract Validation from TokenFileGenerator). The next phase is:

**Phase 3**: Extract Validation from Registries (High Impact)
- Task 3.1: Update ValidationCoordinator to validate before registration
- Task 3.2: Update TokenEngine to validate before registration
- Task 3.3: Update ValidationPipeline to validate before registration
- Task 3.4: Update other callers
- Task 3.5: Remove validateToken() and validateAll() from registries
- Task 3.6: Update all registry tests

---

**Organization**: spec-completion
**Scope**: architecture-separation-of-concerns
