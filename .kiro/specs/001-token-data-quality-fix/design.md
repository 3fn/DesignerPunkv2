# Design Document: Token Data Quality Fix

**Date**: November 16, 2025
**Spec**: 001-token-data-quality-fix
**Status**: Design Phase
**Dependencies**: None
**Related Issues**: #016

---

## Overview

This design document outlines the technical approach for fixing semantic tokens that are missing the required `primitiveReferences` field. The issue affects the SemanticTokenIntegration test suite and violates the SemanticToken interface contract.

**Design Goals**:
- Identify all tokens missing the `primitiveReferences` field
- Add the field to valid tokens with correct primitive references
- Remove obsolete or invalid tokens from the system
- Validate all tokens conform to the SemanticToken interface
- Document token structure requirements to prevent recurrence

**Approach**: Three-phase audit-fix-validate pattern:
1. **Phase 1**: Audit semantic token files to identify missing fields
2. **Phase 2**: Categorize tokens as valid (fix) or invalid (remove)
3. **Phase 3**: Validate all tokens have required structure and tests pass

---

## Architecture

### Current State (Before Fix)

```
┌─────────────────────────────────────────────────────────────┐
│           Semantic Token Definitions                         │
│  src/tokens/semantic/*.ts                                    │
│                                                              │
│  Some tokens MISSING primitiveReferences:                   │
│  {                                                           │
│    name: 'color.example',                                   │
│    category: SemanticCategory.COLOR,                        │
│    // primitiveReferences: MISSING ❌                       │
│    description: 'Example color',                            │
│    context: 'Example usage'                                 │
│  }                                                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│        SemanticTokenIntegration.test.ts                      │
│  Test: "should ensure each token has valid structure"       │
│  expect(token.primitiveReferences).toBeDefined()            │
│  ❌ FAILS - Received: undefined                             │
└─────────────────────────────────────────────────────────────┘
```

### Target State (After Fix)

```
┌─────────────────────────────────────────────────────────────┐
│           Semantic Token Definitions                         │
│  src/tokens/semantic/*.ts                                    │
│                                                              │
│  All tokens HAVE primitiveReferences:                       │
│  {                                                           │
│    name: 'color.example',                                   │
│    category: SemanticCategory.COLOR,                        │
│    primitiveReferences: { default: 'purple500' }, ✓         │
│    description: 'Example color',                            │
│    context: 'Example usage'                                 │
│  }                                                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│        SemanticTokenIntegration.test.ts                      │
│  Test: "should ensure each token has valid structure"       │
│  expect(token.primitiveReferences).toBeDefined()            │
│  ✅ PASSES - All tokens have required field                 │
└─────────────────────────────────────────────────────────────┘
```

### Audit-Fix-Validate Workflow

```
┌──────────────────┐
│  Phase 1: Audit  │
│  - Scan files    │
│  - Identify      │
│    missing       │
│    fields        │
│  - Generate      │
│    report        │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Phase 2: Fix     │
│  - Categorize    │
│    tokens        │
│  - Add fields    │
│    to valid      │
│  - Remove        │
│    invalid       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Phase 3:Validate │
│  - Run tests     │
│  - Verify        │
│    structure     │
│  - Document      │
│    standards     │
└──────────────────┘
```

---

## Components and Interfaces

### Audit Script (Manual Process)

**Purpose**: Identify all semantic tokens missing `primitiveReferences` field

**Approach**:
- Manually review semantic token definition files in `src/tokens/semantic/`
- Search for token objects without `primitiveReferences` field
- Document findings in audit report

**Audit Report Structure**:
```markdown
# Semantic Token Audit Report

## Summary
- Total files scanned: X
- Total tokens found: Y
- Tokens missing primitiveReferences: Z

## Affected Files

### File: src/tokens/semantic/ColorTokens.ts
- Token: color.example (line 45) - MISSING primitiveReferences
- Token: color.another (line 67) - MISSING primitiveReferences

### File: src/tokens/semantic/SpacingTokens.ts
- Token: spacing.custom (line 23) - MISSING primitiveReferences
```

**Search Pattern**:
```bash
# Search for semantic token definitions
grep -A 10 "name:" src/tokens/semantic/*.ts | grep -v "primitiveReferences"
```

---

### Token Categorization (Manual Review)

**Purpose**: Determine which tokens should be fixed vs removed

**Categories**:

**Valid Tokens** (Fix by adding field):
- Token is actively used in token generation
- Token has clear design purpose
- Token matches current design system
- Token name follows naming conventions

**Invalid Tokens** (Remove):
- Token is unused or obsolete
- Token doesn't match current design system
- Token is duplicate or redundant
- Token has unclear purpose

**Decision Criteria**:
```typescript
// Valid token example - FIX
{
  name: 'color.primary',
  category: SemanticCategory.COLOR,
  // primitiveReferences: MISSING - ADD THIS
  description: 'Primary brand color',
  context: 'Primary actions'
}
// Action: Add primitiveReferences: { default: 'purple500' }

// Invalid token example - REMOVE
{
  name: 'color.oldBrand',
  category: SemanticCategory.COLOR,
  // primitiveReferences: MISSING
  description: 'Old brand color (deprecated)',
  context: 'Legacy usage'
}
// Action: Remove entire token definition
```

---

### Fix Implementation (Manual Editing)

**Purpose**: Add `primitiveReferences` field to valid tokens

**Process**:
1. Open semantic token definition file
2. Locate token missing `primitiveReferences`
3. Determine appropriate primitive token reference
4. Add `primitiveReferences` field with correct mapping
5. Save file and verify syntax

**Example Fix**:
```typescript
// BEFORE (missing field)
export const ColorTokens: SemanticToken[] = [
  {
    name: 'color.primary',
    category: SemanticCategory.COLOR,
    description: 'Primary brand color',
    context: 'Primary actions, buttons, links'
  }
];

// AFTER (field added)
export const ColorTokens: SemanticToken[] = [
  {
    name: 'color.primary',
    category: SemanticCategory.COLOR,
    primitiveReferences: { default: 'purple500' }, // ← ADDED
    description: 'Primary brand color',
    context: 'Primary actions, buttons, links'
  }
];
```

**Validation After Fix**:
- Run `getDiagnostics` to check TypeScript errors
- Verify primitive token exists in system
- Verify token structure matches interface

---

### Token Removal (Manual Editing)

**Purpose**: Remove obsolete or invalid tokens

**Process**:
1. Search codebase for references to token
2. Document any references found
3. Remove token definition from file
4. Verify no broken references remain
5. Document removal in report

**Reference Search**:
```bash
# Search for token references
grep -r "color.oldBrand" src/
```

**Removal Documentation**:
```markdown
## Tokens Removed

### color.oldBrand
- **File**: src/tokens/semantic/ColorTokens.ts
- **Reason**: Deprecated, no longer used
- **References Found**: None
- **Removed**: Yes
```

---

## Data Models

### SemanticToken Interface (Reference)

```typescript
export interface SemanticToken {
  name: string;                                    // Required
  category: SemanticCategory;                      // Required
  primitiveReferences: Record<string, string>;     // Required ← FOCUS
  description: string;                             // Required
  context: string;                                 // Required
}
```

**primitiveReferences Field**:
- **Type**: `Record<string, string>` (object with string keys and values)
- **Purpose**: Maps reference names to primitive token names
- **Example**: `{ default: 'purple500' }` or `{ light: 'purple300', dark: 'purple700' }`
- **Validation**: Must have at least one key-value pair, all values must reference existing primitive tokens

---

## Error Handling

### Audit Phase

**File Access Errors**:
- Document files that cannot be read
- Continue with remaining files
- Include errors in audit report

**Parse Errors**:
- Document files with syntax errors
- Skip problematic files
- Note in audit report for manual review

### Fix Phase

**Invalid Primitive Reference**:
- Verify primitive token exists before adding reference
- If not found, document error and skip token
- Add to manual review list

**Syntax Errors After Edit**:
- Run `getDiagnostics` after each file edit
- Fix syntax errors immediately
- Verify file compiles before moving to next token

### Validation Phase

**Test Failures**:
- Document which tests fail and why
- Identify tokens still missing fields
- Re-audit and fix remaining issues

---

## Testing Strategy

### Manual Validation

**After Each Fix**:
- Run `getDiagnostics` on edited file
- Verify no TypeScript errors
- Verify primitive references exist

### Integration Testing

**After All Fixes**:
- Run `SemanticTokenIntegration.test.ts`
- Verify "should ensure each token has valid structure" test passes
- Verify all tokens have `primitiveReferences` field
- Verify all primitive references are valid

### End-to-End Validation

**Token Generation**:
- Generate tokens for all platforms (web, iOS, Android)
- Verify semantic tokens resolve correctly
- Verify no broken references in generated output
- Compare output to baseline (should be identical)

---

## Design Decisions

### Decision 1: Manual vs Automated Fix

**Options Considered**:
1. **Fully Automated**: Script determines primitive references using heuristics
2. **Semi-Automated**: Script audits, human fixes manually
3. **Fully Manual**: Human identifies and fixes everything

**Decision**: Semi-Automated (script audits, human fixes)

**Rationale**:
Determining the correct primitive reference requires understanding design intent. A token named `color.primary` could reference `purple500`, `blue500`, or any other color primitive - only a human familiar with the design system can make this decision correctly. Automated heuristics would guess and could create incorrect token relationships that break the design system.

Manual fixing ensures accuracy and provides an opportunity to review token validity. The audit script handles the tedious work of scanning files and identifying missing fields.

**Trade-offs**:
- ✅ **Gained**: Accuracy in primitive references, correct token relationships, opportunity to review token validity
- ✅ **Gained**: Understanding of token system during manual review
- ❌ **Lost**: Speed (manual fixing takes longer than automated)
- ⚠️ **Risk**: Human error in manual fixing (mitigated by validation tests and getDiagnostics)

**Counter-Arguments**:
- **Argument**: Automated fix would be faster and we could use token names to guess references
- **Response**: Speed isn't critical for a one-time data quality fix. Incorrect primitive references would break the design system and require more time to debug and fix. Accuracy is more important than speed.

---

### Decision 2: Fix vs Remove Invalid Tokens

**Options Considered**:
1. **Fix All**: Add `primitiveReferences` to every token
2. **Remove All**: Delete all tokens without the field
3. **Categorize**: Review each token and decide fix vs remove

**Decision**: Categorize and handle appropriately

**Rationale**:
Not all tokens without `primitiveReferences` are valid tokens that should be fixed. Some may be obsolete, deprecated, or incorrectly defined. Categorization allows us to:
- Fix valid tokens that are actively used
- Remove obsolete tokens that add technical debt
- Clean up the token system while fixing the data quality issue

This approach treats the data quality fix as an opportunity to improve overall token system health.

**Trade-offs**:
- ✅ **Gained**: Cleaner token system, removal of technical debt, improved token quality
- ✅ **Gained**: Opportunity to review and understand all semantic tokens
- ❌ **Lost**: Slightly more complex process (requires categorization decision for each token)
- ⚠️ **Risk**: Accidentally removing valid tokens (mitigated by reference search and careful review)

**Counter-Arguments**:
- **Argument**: Just fix everything to be safe - don't risk removing valid tokens
- **Response**: Keeping obsolete tokens creates ongoing technical debt and confusion. The reference search mitigates the risk of removing valid tokens. Better to clean up now than carry technical debt forward.

---

### Decision 3: Validation Approach

**Options Considered**:
1. **TypeScript Only**: Rely on TypeScript compiler to catch missing fields
2. **Runtime Tests Only**: Use integration tests to validate structure
3. **Both**: TypeScript compilation + runtime validation tests

**Decision**: Both TypeScript compilation and runtime validation

**Rationale**:
TypeScript provides compile-time type checking that catches structural issues during development. However, TypeScript only validates that the code matches the interface definition - it doesn't validate that the actual token data is correct.

Runtime validation in tests ensures:
- All tokens actually have the `primitiveReferences` field (not just typed correctly)
- All primitive references point to existing primitive tokens
- Token structure matches expectations in practice, not just in theory

Both layers provide comprehensive validation and catch different types of issues.

**Trade-offs**:
- ✅ **Gained**: Comprehensive validation at compile-time and runtime
- ✅ **Gained**: Early error detection (TypeScript) and runtime verification (tests)
- ✅ **Gained**: Confidence in data quality from multiple validation layers
- ❌ **Lost**: Slightly more validation code (minimal - tests already exist)
- ⚠️ **Risk**: None - validation is worth the minimal additional effort

**Counter-Arguments**:
- **Argument**: TypeScript validation is sufficient - we don't need runtime tests
- **Response**: TypeScript validates code structure, but runtime tests validate actual data. A token could be typed correctly but still have invalid data (e.g., referencing a non-existent primitive token). Both layers are needed for comprehensive validation.

---

**Organization**: spec-design
**Scope**: 001-token-data-quality-fix
