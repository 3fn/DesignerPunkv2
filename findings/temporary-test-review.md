# Temporary Test Review: Spec 017 and Spec 023

**Date**: December 19, 2025
**Spec**: 025 - Test Suite Overhaul and Standards Alignment
**Task**: 3.5 - Review temporary tests for retirement
**Purpose**: Identify and evaluate all tests marked "TEMPORARY" from Spec 017 and Spec 023 work

---

## Executive Summary

After comprehensive search of the test suite, **no tests were found with explicit "TEMPORARY" markers from Spec 017 or Spec 023 work**. However, the search identified **3 temporary category assignments** in `MotionTokens.test.ts` that warrant review.

### Key Findings

- **0 tests** explicitly marked "TEMPORARY" from Spec 017 (Component Code Quality Sweep)
- **0 tests** explicitly marked "TEMPORARY" from Spec 023 (Component Token Compliance Audit)
- **3 temporary category assignments** found in motion token tests (not marked for retirement)
- **No retirement criteria** documented for any temporary tests

---

## Search Methodology

### Search Patterns Used

1. **Direct TEMPORARY markers**: Searched for "TEMPORARY" in all test files
2. **Spec-specific markers**: Searched for "Spec 017", "Spec 023", "spec-017", "spec-023"
3. **Retirement keywords**: Searched for "retirement", "retire", "temporary test"
4. **Component test files**: Reviewed Icon, ButtonCTA, Container, TextInputField test files
5. **Completion documents**: Reviewed Spec 017 and 023 completion docs for test creation notes

### Files Searched

- All `**/*.test.ts` files in the codebase
- Spec 017 completion documents (45 files)
- Spec 023 completion documents (15 files)
- Component test files for Icon, ButtonCTA, Container, TextInputField

---

## Findings

### Finding 1: Motion Token Category Assignments (Not Retirement Candidates)

**Location**: `src/tokens/__tests__/MotionTokens.test.ts`

**Issue**: Three test assertions use temporary category assignments with inline comments:

```typescript
// Line 63
expect(token.category).toBe(TokenCategory.SPACING); // Temporary until DURATION category added

// Line 177
expect(token.category).toBe(TokenCategory.SPACING); // Temporary until EASING category added

// Line 298
expect(token.category).toBe(TokenCategory.SPACING); // Temporary until SCALE category added
```

**Context**: These are not "temporary tests" but rather tests checking temporary implementation details. The tests themselves are permanent - they validate that motion tokens have correct category assignments. The "temporary" comment refers to the implementation (using SPACING category as a placeholder) not the test.

**Retirement Criteria**: Not applicable - these are not temporary tests. The tests should be updated when:
- `TokenCategory.DURATION` is added to the type system
- `TokenCategory.EASING` is added to the type system
- `TokenCategory.SCALE` is added to the type system

**Recommendation**: **Keep tests, update assertions when categories are added**. These tests are evergreen behavior validation that will need assertion updates when the token category system is expanded.

**Related Requirements**: Requirements 9.1, 9.2 (identify temporary tests)

---

### Finding 2: No Explicit Temporary Tests from Spec 017

**Spec 017 Context**: Component Code Quality Sweep focused on replacing hard-coded values with design tokens across Icon, ButtonCTA, TextInputField, and Container components.

**Search Results**:
- Reviewed all component test files created/modified during Spec 017
- Searched for "TEMPORARY", "Spec 017", "temporary test" markers
- Reviewed 45 completion documents from Spec 017

**Finding**: No tests were marked as temporary or included retirement criteria.

**Analysis**: Spec 017 created permanent behavior validation tests for token compliance. The tests validate that components use tokens instead of hard-coded values - this is evergreen behavior that should always hold.

**Recommendation**: **No action needed**. All tests from Spec 017 are evergreen.

**Related Requirements**: Requirements 9.1, 9.2 (identify temporary tests from Spec 017)

---

### Finding 3: No Explicit Temporary Tests from Spec 023

**Spec 023 Context**: Component Token Compliance Audit established systematic audit process with human confirmation before implementation. Created reference implementations for Icon, ButtonCTA, TextInputField, and Container.

**Search Results**:
- Reviewed all component test files created/modified during Spec 023
- Searched for "TEMPORARY", "Spec 023", "temporary test" markers
- Reviewed 15 completion documents from Spec 023

**Finding**: No tests were marked as temporary or included retirement criteria.

**Analysis**: Spec 023 created TDS-aligned tests that validate component behavior (not implementation details). These tests are designed to be evergreen and survive refactoring.

**Example Tests Reviewed**:
- `ButtonCTA.test.ts`: Validates rendering behavior, size variants, variant styles
- `ButtonCTA.tokens.test.ts`: Validates component token definitions
- `Container.test.ts`: Validates rendering with various props
- `IconTokens.test.ts`: Validates icon size token calculations

**Recommendation**: **No action needed**. All tests from Spec 023 are evergreen.

**Related Requirements**: Requirements 9.1, 9.2 (identify temporary tests from Spec 023)

---

## Evaluation Against Retirement Criteria

### Requirement 9.3: Evaluate if retirement criteria have been met

**Finding**: No retirement criteria were documented for any tests in Spec 017 or Spec 023 work.

**Analysis**: The absence of retirement criteria suggests that:
1. No tests were intended to be temporary
2. All tests created were designed as permanent behavior validation
3. The specs followed TDS principles of creating evergreen tests

**Recommendation**: No retirement evaluation needed - no temporary tests exist.

---

### Requirement 9.4: Recommend Delete with documentation

**Finding**: No tests meet deletion criteria.

**Recommendation**: No deletions recommended.

---

### Requirement 9.5: Recommend Keep with updated retirement criteria

**Finding**: No temporary tests exist that need updated retirement criteria.

**Recommendation**: No updates needed.

---

## Recommendations

### Recommendation 1: Motion Token Category Tests

**Action**: Keep tests, update assertions when token categories are added

**Rationale**: These tests validate correct category assignment. When `TokenCategory.DURATION`, `TokenCategory.EASING`, and `TokenCategory.SCALE` are added to the type system, update the test assertions to check for the correct categories instead of the temporary `TokenCategory.SPACING` placeholder.

**Implementation**:
```typescript
// Current (temporary implementation)
expect(token.category).toBe(TokenCategory.SPACING); // Temporary until DURATION category added

// Future (when DURATION category exists)
expect(token.category).toBe(TokenCategory.DURATION);
```

**Priority**: Low - Update when token category system is expanded (separate spec)

---

### Recommendation 2: Document Temporary Test Policy

**Action**: Add guidance to Test Development Standards about marking temporary tests

**Rationale**: The absence of temporary tests in Spec 017 and 023 suggests good test design practices. However, if future specs need temporary tests, they should be clearly marked with:
- Explicit "TEMPORARY" comment
- Documented retirement criteria
- Reference to the spec that created them
- Expected retirement timeline

**Example Format**:
```typescript
// TEMPORARY - Spec XXX - Retire when [specific condition]
// Retirement criteria: [specific measurable condition]
test('temporary validation', () => {
  // Test implementation
});
```

**Priority**: Low - Document for future reference

---

### Recommendation 3: No Immediate Action Required

**Action**: None

**Rationale**: The comprehensive search found no temporary tests requiring retirement. All tests from Spec 017 and 023 are evergreen behavior validation tests that should be kept.

**Priority**: N/A

---

## Conclusion

The review of temporary tests from Spec 017 and Spec 023 work found **no tests marked for retirement**. All tests created during these specs are evergreen behavior validation tests aligned with Test Development Standards.

The only "temporary" markers found were inline comments about temporary category assignments in motion token tests, which refer to implementation details rather than test lifecycle.

### Summary Statistics

| Category | Count |
|----------|-------|
| Temporary tests from Spec 017 | 0 |
| Temporary tests from Spec 023 | 0 |
| Tests requiring retirement | 0 |
| Tests requiring criteria updates | 0 |
| Temporary category assignments (not tests) | 3 |

### Validation Against Requirements

- ✅ **Requirement 9.1**: Identified all tests marked "TEMPORARY" from Spec 017 (none found)
- ✅ **Requirement 9.2**: Identified all tests marked "TEMPORARY" from Spec 023 (none found)
- ✅ **Requirement 9.3**: Evaluated retirement criteria (none exist)
- ✅ **Requirement 9.4**: Documented retirement recommendations (none needed)
- ✅ **Requirement 9.5**: Documented keep recommendations (all tests kept)

---

*Temporary test review complete. No tests require retirement.*
