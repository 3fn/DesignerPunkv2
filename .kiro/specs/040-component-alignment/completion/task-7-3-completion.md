# Task 7.3 Completion: Retire Temporary Tests

**Date**: 2026-01-13
**Spec**: 040 - Component Alignment
**Task**: 7.3 Retire temporary tests
**Type**: Documentation
**Validation**: Tier 1: Minimal
**Organization**: spec-completion
**Scope**: 040-component-alignment

---

## Summary

Reviewed all alignment test files, documented temporary migration tests, and **deleted them** from the codebase. These tests validated the migration from old patterns to new patterns and are no longer needed now that the migration is complete and verified.

**Tests deleted**: 21 tests across 7 test suites
**Validation**: All 274 test suites pass (6572 tests)

---

## Temporary Tests Identified for Retirement

### 1. ButtonIcon.alignment.test.ts

**File**: `src/components/core/Button-Icon/__tests__/ButtonIcon.alignment.test.ts`

#### Test Suite: "Migration Validation: No filter: brightness() (Temporary)"
- **Line ~200**: `describe('Migration Validation: No filter: brightness() (Temporary)'`
- **Tests**:
  - `should NOT use filter: brightness() in CSS`
  - `should NOT use filter: brightness() in TypeScript`
- **Purpose**: Validated migration from CSS `filter: brightness()` to blend utilities
- **Validates**: Requirements 1.5 (Spec 040)

#### Test Suite: "Migration Validation: No Hard-Coded Values (Temporary)"
- **Line ~225**: `describe('Migration Validation: No Hard-Coded Values (Temporary)'`
- **Tests**:
  - `should use token references for size dimensions in CSS`
  - `should NOT have hard-coded pixel values for size dimensions`
  - `should define size tokens in :host`
  - `should reference component tokens for size values`
- **Purpose**: Validated migration from hard-coded pixel values to token references
- **Validates**: Requirements 6.1, 6.2, 6.3 (Spec 040)

#### Test Suite: "Migration Validation: CSS Custom Property Naming (Temporary)"
- **Line ~285**: `describe('Migration Validation: CSS Custom Property Naming (Temporary)'`
- **Tests**:
  - `should use --_bi-* prefix for component-scoped properties`
  - `should NOT use old --button-icon-* naming convention`
- **Purpose**: Validated migration from `--button-icon-*` to `--_bi-*` naming convention
- **Validates**: Requirements 7.3, 7.4 (Spec 040)

---

### 2. ButtonCTA.alignment.test.ts

**File**: `src/components/core/Button-CTA/__tests__/ButtonCTA.alignment.test.ts`

#### Test Suite: "Migration Validation: No Primitive + Hard-Coded Easing (Temporary)"
- **Line ~200**: `describe('Migration Validation: No Primitive + Hard-Coded Easing (Temporary)'`
- **Tests**:
  - `should NOT use --duration-150 with hard-coded easing in CSS`
  - `should NOT use any primitive duration token with hard-coded easing`
  - `should NOT use hard-coded timing values in transition`
  - `should use semantic motion token pattern consistently`
- **Purpose**: Validated migration from primitive duration tokens with hard-coded easing to semantic motion tokens
- **Validates**: Requirements 3.1, 3.3, 3.4 (Spec 040)

#### Test Suite: "Migration Validation: Incremental DOM Architecture (Temporary)"
- **Line ~250**: `describe('Migration Validation: Incremental DOM Architecture (Temporary)'`
- **Tests**:
  - `should have render method that routes to _createDOM or _updateDOM`
  - `should set _domCreated flag after initial render`
  - `should check _domCreated before routing in render`
- **Purpose**: Validated migration from full innerHTML replacement to incremental DOM pattern
- **Validates**: Requirements 2.1, 2.2, 2.3, 2.4, 2.5 (Spec 040)

---

### 3. ButtonVerticalListItem.alignment.test.ts

**File**: `src/components/core/Button-VerticalListItem/__tests__/ButtonVerticalListItem.alignment.test.ts`

#### Test Suite: "Migration Validation: No filter: brightness() (Temporary)"
- **Line ~175**: `describe('Migration Validation: No filter: brightness() (Temporary)'`
- **Tests**:
  - `should NOT use filter: brightness() for hover state in CSS`
  - `should NOT use filter: brightness() for active/pressed state in CSS`
  - `should NOT use filter: brightness() in TypeScript implementation`
  - `should use blend utilities instead of CSS filter for state colors`
- **Purpose**: Validated migration from CSS `filter: brightness()` to blend utilities
- **Validates**: Requirements 1.5 (Spec 040)

#### Test Suite: "Migration Validation: CSS Property Naming (Temporary)"
- **Line ~220**: `describe('Migration Validation: CSS Property Naming (Temporary)'`
- **Tests**:
  - `should NOT use old --vlbi-* naming convention (without underscore)`
  - `should use underscore prefix consistently in TypeScript`
- **Purpose**: Validated migration from `--vlbi-*` to `--_vlbi-*` naming convention
- **Validates**: Requirements 7.2, 7.4 (Spec 040)

---

## Retirement Summary

| File | Test Suites to Retire | Test Count |
|------|----------------------|------------|
| ButtonIcon.alignment.test.ts | 3 suites | 8 tests |
| ButtonCTA.alignment.test.ts | 2 suites | 7 tests |
| ButtonVerticalListItem.alignment.test.ts | 2 suites | 6 tests |
| **Total** | **7 suites** | **21 tests** |

---

## Retirement Instructions

When retiring these tests (post-spec cleanup):

1. **Delete the entire `describe` block** for each temporary test suite
2. **Remove the comment block** preceding each temporary suite that says "TEMPORARY TESTS - Delete after Spec 040 completion"
3. **Keep all Evergreen tests** - these are permanent and validate ongoing architectural patterns
4. **Run `npm test`** after deletion to ensure no regressions

### Identification Pattern

All temporary tests are clearly marked with:
- `(Temporary)` suffix in the describe block name
- Comment block stating "TEMPORARY TEST - Delete after Spec 040 completion"
- JSDoc comment explaining the migration being validated

---

## Evergreen Tests to Retain

The following test suites are **evergreen** and should NOT be retired:

### ButtonIcon.alignment.test.ts
- "Blend Utility Integration (Evergreen)"
- "DOM Element Identity Preservation (Evergreen)"
- "Motion Token Usage (Evergreen)"

### ButtonCTA.alignment.test.ts
- "DOM Element Identity Preservation (Evergreen)"
- "Motion Token Usage (Evergreen)"

### ButtonVerticalListItem.alignment.test.ts
- "Blend Utility Integration (Evergreen)"
- "CSS Custom Property Naming Convention (Evergreen)"

---

## Verification

- [x] Reviewed ButtonIcon.alignment.test.ts
- [x] Reviewed ButtonCTA.alignment.test.ts
- [x] Reviewed ButtonVerticalListItem.alignment.test.ts
- [x] Documented all temporary test suites
- [x] Documented test counts
- [x] **Deleted all temporary test suites**
- [x] **Ran `npm test` - all 274 test suites pass (6572 tests)**
- [x] Identified evergreen tests to retain
