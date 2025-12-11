# Requirements Document: Test Failures and Component Cleanup

**Date**: December 11, 2025
**Spec**: 019 - Test Failures and Component Cleanup
**Status**: Requirements Phase
**Dependencies**: 
- Spec 017 (Component Code Quality Sweep) - Builds on cleanup plan and follow-up recommendations

---

## Introduction

This spec addresses the remaining test failures and component cleanup work identified in Spec 017's completion summary. The work includes fixing TypeScript compilation errors, updating tests to reflect new tokens, completing component token compliance cleanup, and addressing performance test issues.

## Glossary

- **Token Compliance**: Components using only design tokens (no hard-coded values)
- **Contamination Vector**: Code patterns that encourage copying hard-coded values
- **Semantic "None" Tokens**: Explicit zero-value tokens (space.inset.none, border.none, etc.)
- **Strategic Flexibility**: Mathematically-derived exceptions to 8px baseline grid
- **Evergreen Prevention Tests**: Automated tests that continuously scan for token violations

---

## Requirements

### Requirement 1: Fix TypeScript Compilation Errors

**User Story**: As a developer, I want the codebase to compile without TypeScript errors, so that I can build and test the project successfully.

#### Acceptance Criteria

1. WHEN running `npm run build` THEN the system SHALL compile without TypeScript errors
2. WHEN ButtonCTA passes icon size to Icon component THEN the system SHALL use correct IconSize type
3. WHEN all TypeScript files are checked THEN the system SHALL report zero type errors
4. WHEN getDiagnostics is run THEN the system SHALL show no compilation errors

### Requirement 2: Update Tests for New Tokens

**User Story**: As a developer, I want tests to reflect the current token system, so that test failures indicate real issues rather than outdated expectations.

#### Acceptance Criteria

1. WHEN tests check for token counts THEN the system SHALL expect correct counts including new semantic "none" tokens
2. WHEN tests validate spacing tokens THEN the system SHALL include space000 in expected tokens
3. WHEN tests check border width tokens THEN the system SHALL expect correct semantic border tokens
4. WHEN tests validate shadow offset tokens THEN the system SHALL expect correct token structure

### Requirement 3: Complete Icon Component Cleanup

**User Story**: As a developer, I want Icon component to be 100% token compliant, so that it follows the token-first development approach.

#### Acceptance Criteria

1. WHEN Icon Android documentation contains examples THEN the system SHALL reference token names instead of hard-coded dp values
2. WHEN Icon Android preview code uses sizes THEN the system SHALL use token references instead of hard-coded values
3. WHEN Icon web tests check sizes THEN the system SHALL reference token values instead of hard-coded numbers
4. WHEN audit script scans Icon component THEN the system SHALL report zero violations

### Requirement 4: Complete Container Component Cleanup

**User Story**: As a developer, I want Container component to be 100% token compliant, so that it provides a token-first foundation for layout.

#### Acceptance Criteria

1. WHEN Container Android TokenMapping uses zero values THEN the system SHALL use semantic "none" tokens where appropriate
2. WHEN Container Android TokenMapping uses border widths THEN the system SHALL reference border tokens
3. WHEN Container Android TokenMapping uses radius values THEN the system SHALL reference radius tokens
4. WHEN Container Android TokenMapping uses elevation values THEN the system SHALL reference elevation tokens
5. WHEN Container Android TokenMapping uses colors THEN the system SHALL reference semantic color tokens
6. WHEN Container web uses focus outline THEN the system SHALL reference accessibility tokens
7. WHEN audit script scans Container component THEN the system SHALL report zero violations

### Requirement 5: Complete TextInputField Cleanup

**User Story**: As a developer, I want TextInputField component to be 100% token compliant, so that form inputs follow consistent token usage.

#### Acceptance Criteria

1. WHEN TextInputField iOS uses opacity fallback THEN the system SHALL remove fallback pattern and fail loudly
2. WHEN TextInputField iOS uses motion duration THEN the system SHALL reference motion tokens
3. WHEN TextInputField Android uses label offset THEN the system SHALL use appropriate spacing token
4. WHEN TextInputField Android uses radius THEN the system SHALL properly reference radius token
5. WHEN TextInputField Android uses icon sizes THEN the system SHALL reference icon size tokens
6. WHEN TextInputField.browser.ts is evaluated THEN the system SHALL determine if file is legacy and should be removed or updated
7. WHEN audit script scans TextInputField component THEN the system SHALL report zero violations

### Requirement 6: Fix Component Integration Tests

**User Story**: As a developer, I want component integration tests to pass, so that I can verify components work together correctly.

#### Acceptance Criteria

1. WHEN ButtonCTA integration tests run THEN the system SHALL compile without TypeScript errors
2. WHEN Icon integration tests run THEN the system SHALL compile without TypeScript errors
3. WHEN TextInputField cross-platform tests run THEN the system SHALL find correct motion token references
4. WHEN TextInputField touch target tests run THEN the system SHALL find correct accessibility token references

### Requirement 7: Address Performance Test Issues

**User Story**: As a developer, I want performance tests to complete within acceptable timeframes, so that CI/CD pipelines remain efficient.

#### Acceptance Criteria

1. WHEN release analysis performance tests run THEN the system SHALL complete within timeout limits
2. WHEN hook integration tests run THEN the system SHALL complete within timeout limits
3. WHEN quick analyze tests run THEN the system SHALL complete within timeout limits
4. IF performance tests consistently timeout THEN the system SHALL document performance optimization recommendations

### Requirement 8: Update Token Compliance Tests

**User Story**: As a developer, I want token compliance tests to accurately detect violations, so that the evergreen prevention system works correctly.

#### Acceptance Criteria

1. WHEN token compliance tests scan iOS files THEN the system SHALL correctly identify Color(red:green:blue:) patterns
2. WHEN token compliance tests scan all platforms THEN the system SHALL report zero violations in compliant components
3. WHEN token compliance tests run THEN the system SHALL validate against current token system
4. WHEN new components are added THEN the system SHALL automatically include them in compliance scans

### Requirement 9: Verify Zero Violations

**User Story**: As a developer, I want to confirm all components are token compliant, so that the codebase maintains consistent token usage.

#### Acceptance Criteria

1. WHEN audit script runs on all components THEN the system SHALL report zero hard-coded color violations
2. WHEN audit script runs on all components THEN the system SHALL report zero hard-coded spacing violations
3. WHEN audit script runs on all components THEN the system SHALL report zero hard-coded motion violations
4. WHEN audit script runs on all components THEN the system SHALL report zero fallback pattern violations
5. WHEN all tests pass THEN the system SHALL confirm 100% token compliance across all components

---

**Organization**: spec-requirements
**Scope**: 019-test-failures-and-cleanup
