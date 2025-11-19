# Validator API Reference Document

**Date**: November 18, 2025
**Task**: 2.1 Analyze current validator API signatures
**Purpose**: Document current validator APIs to guide test updates
**Organization**: spec-validation
**Scope**: typescript-error-resolution

---

## Overview

This document provides a comprehensive reference for the current validator API signatures, documenting what changed from test expectations and providing guidance for updating test files.

---

## BaselineGridValidator API

### Current Implementation

**File**: `src/validators/BaselineGridValidator.ts`

#### Constructor Signature

```typescript
constructor(options: BaselineGridValidationOptions = {})

interface BaselineGridValidationOptions {
  allowStrategicFlexibility?: boolean;
  customGridUnit?: number;
}
```

**Default Values**:
- `allowStrategicFlexibility`: `true`
- `customGridUnit`: `8` (BASELINE_GRID_UNIT constant)

#### validate() Method Signature

```typescript
validate(input: BaselineGridValidationInput): ValidationResult

interface BaselineGridValidationInput {
  value: number;
  tokenName?: string;
}
```

**Key Changes from Test Expectations**:
1. **Input Type Changed**: Now accepts `BaselineGridValidationInput` object instead of two separate parameters
2. **Object Structure**: Input is `{ value: number, tokenName?: string }` instead of `(value, tokenName)`

#### Legacy validateValue() Method

```typescript
validateValue(value: number, tokenName?: string): ValidationResult
```

**Note**: This is the legacy method that tests are currently calling. It still exists but is not the primary IValidator interface method.

#### ValidationResult Structure

```typescript
interface ValidationResult {
  level: ValidationLevel;              // 'Pass' | 'Warning' | 'Error'
  token: string;                       // Token name or 'value-{number}'
  message: string;                     // Human-readable message
  rationale: string;                   // Detailed explanation
  suggestions?: string[];              // Optional correction suggestions
  mathematicalReasoning: string;       // Mathematical explanation
}
```

**Key Properties**:
- `level`: Validation tier ('Pass', 'Warning', or 'Error')
- `token`: Token identifier (uses `tokenName` or generates `value-{number}`)
- `message`: Concise validation message
- `rationale`: Detailed reasoning for the result
- `suggestions`: Array of actionable recommendations (for Error level)
- `mathematicalReasoning`: Mathematical explanation of the validation

#### Other Methods

```typescript
validateBatch(values: Array<{ value: number; tokenName?: string }>): ValidationResult[]
getGridInfo(): { gridUnit: number; allowStrategicFlexibility: boolean; strategicFlexibilityValues: number[] }
```

---

## SyntaxValidator API

### Current Implementation

**File**: `src/validators/SyntaxValidator.ts`

#### Constructor Signature

```typescript
constructor()
```

**Note**: No parameters required. Initializes platform-specific syntax rules internally.

#### validate() Method Signature

```typescript
validate(input: SyntaxValidationInput): ValidationResult

interface SyntaxValidationInput {
  content: string;
  platform: TargetPlatform;
  format: OutputFormat;
}
```

**Key Changes from Test Expectations**:
1. **Input Type Changed**: Now accepts `SyntaxValidationInput` object instead of three separate parameters
2. **Object Structure**: Input is `{ content: string, platform: TargetPlatform, format: OutputFormat }` instead of `(content, platform, format)`
3. **Return Type Changed**: Returns `ValidationResult` instead of `SyntaxValidationResult`

#### Legacy validateSyntax() Method

```typescript
validateSyntax(
  content: string,
  platform: TargetPlatform,
  format: OutputFormat
): SyntaxValidationResult
```

**Note**: This is the legacy method that returns `SyntaxValidationResult`. Tests are currently calling this method.

#### SyntaxValidationResult Structure (Legacy)

```typescript
interface SyntaxValidationResult {
  valid: boolean;
  platform: TargetPlatform;
  format: OutputFormat;
  errors?: SyntaxError[];
  warnings?: SyntaxWarning[];
  details?: string;
}
```

**Key Differences from ValidationResult**:
- Uses `valid: boolean` instead of `level: ValidationLevel`
- Has separate `errors` and `warnings` arrays with detailed structures
- Includes `platform` and `format` properties
- Has `details` string instead of `rationale` and `mathematicalReasoning`

#### ValidationResult Structure (Current IValidator Interface)

The `validate()` method converts `SyntaxValidationResult` to `ValidationResult`:

```typescript
interface ValidationResult {
  level: ValidationLevel;              // 'Pass' if valid, 'Error' if not
  token: string;                       // '{platform}-{format}'
  message: string;                     // 'Syntax validation passed/failed'
  rationale: string;                   // From result.details
  suggestions?: string[];              // From result.errors[].suggestion
  mathematicalReasoning: string;       // Platform-specific syntax reasoning
}
```

#### Other Methods

```typescript
validateExtension(filename: string, platform: TargetPlatform, format: OutputFormat): { valid: boolean; error?: string }
validateBatch(files: Array<{ content: string; platform: TargetPlatform; format: OutputFormat }>): Map<string, SyntaxValidationResult>
getSummary(results: Map<string, SyntaxValidationResult>): { total: number; valid: number; invalid: number; totalErrors: number; totalWarnings: number }
```

---

## What Changed from Test Expectations

### BaselineGridValidator Tests

**Current Test Pattern** (Incorrect):
```typescript
const result = validator.validate(value, tokenName);
```

**Expected Pattern** (Correct):
```typescript
const result = validator.validate({ value, tokenName });
```

**Issue**: Tests are calling `validate()` with two separate parameters instead of a single object parameter.

**Impact**: 26 TypeScript errors in `BaselineGridValidator.test.ts`

### SyntaxValidator Tests

**Current Test Pattern** (Incorrect):
```typescript
const result = validator.validate(content, platform, format);
```

**Expected Pattern** (Correct):
```typescript
const result = validator.validate({ content, platform, format });
```

**Issue**: Tests are calling `validate()` with three separate parameters instead of a single object parameter.

**Impact**: 68 TypeScript errors in `SyntaxValidator.test.ts`

---

## Test Update Strategy

### Option 1: Update Tests to Use IValidator Interface (Recommended)

Update all test calls to use the new `validate()` method signature with object parameters:

**BaselineGridValidator**:
```typescript
// Before
const result = validator.validate(8, 'space100');

// After
const result = validator.validate({ value: 8, tokenName: 'space100' });
```

**SyntaxValidator**:
```typescript
// Before
const result = validator.validate(content, 'web', 'css');

// After
const result = validator.validate({ content, platform: 'web', format: 'css' });
```

**Pros**:
- Tests use the current IValidator interface
- Future-proof against API changes
- Consistent with validator contract

**Cons**:
- More verbose test code
- Requires updating all test calls

### Option 2: Use Legacy Methods (Not Recommended)

Keep tests calling legacy methods (`validateValue()` and `validateSyntax()`):

**BaselineGridValidator**:
```typescript
const result = validator.validateValue(8, 'space100');
```

**SyntaxValidator**:
```typescript
const result = validator.validateSyntax(content, 'web', 'css');
```

**Pros**:
- Minimal test changes
- Tests continue to work

**Cons**:
- Tests don't validate IValidator interface
- Legacy methods may be deprecated in future
- Inconsistent with validator contract

---

## Validation Result Expectations

### BaselineGridValidator Results

**Pass Level** (Baseline Grid Aligned):
```typescript
{
  level: 'Pass',
  token: 'space100',
  message: 'Baseline grid alignment validated',
  rationale: 'Value 8 aligns with 8-unit baseline grid',
  mathematicalReasoning: '8 ÷ 8 = 1 (whole number confirms alignment)'
}
```

**Pass Level** (Strategic Flexibility):
```typescript
{
  level: 'Pass',
  token: 'space075',
  message: 'Strategic flexibility token - mathematically derived exception',
  rationale: 'Value 6 is a strategic flexibility token that provides necessary design flexibility while maintaining mathematical relationships',
  mathematicalReasoning: 'Strategic flexibility tokens are mathematically derived (e.g., space075 = space100 × 0.75 = 6) but intentionally break systematic progression for exceptional design requirements'
}
```

**Error Level** (Baseline Grid Violation):
```typescript
{
  level: 'Error',
  token: 'test-7',
  message: 'Baseline grid alignment violation',
  rationale: 'Value 7 does not align with 8-unit baseline grid',
  suggestions: [
    'Use 0 (0 × 8)',
    'Use 8 (1 × 8)',
    'Consider if this should be a strategic flexibility token'
  ],
  mathematicalReasoning: '7 ÷ 8 = 0.875 (non-whole number indicates misalignment)'
}
```

### SyntaxValidator Results

**Pass Level**:
```typescript
{
  level: 'Pass',
  token: 'web-css',
  message: 'Syntax validation passed',
  rationale: 'Syntax validation passed',
  mathematicalReasoning: 'Platform-specific syntax follows required patterns'
}
```

**Error Level**:
```typescript
{
  level: 'Error',
  token: 'web-css',
  message: 'Syntax validation failed',
  rationale: 'Found 2 error(s)',
  suggestions: [
    'Add CSS :root selector to the generated file',
    'Add CSS custom property declaration to the generated file'
  ],
  mathematicalReasoning: 'Platform-specific syntax violations detected'
}
```

---

## Key Differences Summary

| Aspect | Old API (Tests Expect) | New API (Current Implementation) |
|--------|------------------------|----------------------------------|
| **BaselineGridValidator.validate()** | `validate(value, tokenName?)` | `validate({ value, tokenName? })` |
| **SyntaxValidator.validate()** | `validate(content, platform, format)` | `validate({ content, platform, format })` |
| **Return Type** | `ValidationResult` | `ValidationResult` (same structure) |
| **Legacy Methods** | N/A | `validateValue()`, `validateSyntax()` still available |

---

## Recommendations for Test Updates

1. **Update all test calls** to use the new object parameter format
2. **Verify ValidationResult structure** matches current implementation
3. **Test both IValidator interface** and legacy methods if needed
4. **Update test expectations** to match current message formats
5. **Validate mathematical reasoning** strings match current implementation

---

## Next Steps

With this reference document, the following tasks can be completed:

- **Task 2.2**: Update BaselineGridValidator tests to use `validate({ value, tokenName })`
- **Task 2.3**: Update SyntaxValidator tests to use `validate({ content, platform, format })`
- **Task 2.4**: Update TokenIntegrator tests (separate analysis needed)

---

**Status**: Complete
**Errors Documented**: 94 (26 BaselineGridValidator + 68 SyntaxValidator)
**Resolution Path**: Update test calls to use object parameters
