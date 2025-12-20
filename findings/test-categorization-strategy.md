# Test Categorization Strategy

**Date**: December 20, 2025
**Spec**: 025 - Test Suite Overhaul and Standards Alignment
**Task**: 4.6 - Categorize all tests as evergreen or temporary
**Status**: Implementation

---

## Overview

This document defines the categorization strategy for all 252 test files in the DesignerPunk test suite. Each test will be explicitly categorized as either **evergreen** (permanent behavior verification) or **temporary** (has retirement criteria).

---

## Categorization Approach

### JSDoc Comment Format

All test files will include a JSDoc comment block at the top with categorization metadata:

```typescript
/**
 * @category evergreen
 * @purpose Verify Icon component renders correctly with token-based sizing
 */
```

or

```typescript
/**
 * @category temporary
 * @retirementCriteria Remove when Icon component is refactored to use CSS-only sizing (Spec 030)
 * @createdInSpec 023
 * @purpose Validate Icon component during transition to new sizing approach
 */
```

### Metadata Fields

| Field | Required | Description |
|-------|----------|-------------|
| `@category` | Yes | Either `evergreen` or `temporary` |
| `@purpose` | Yes | Brief description of what the test validates |
| `@retirementCriteria` | If temporary | Specific conditions for test removal |
| `@createdInSpec` | If temporary | Spec number where test was created |

---

## Categorization Decision Framework

### Evergreen Tests (Permanent)

Tests are **evergreen** if they verify:

1. **Core Functionality**: Fundamental behavior that should always work
   - Token generation produces valid output
   - Components render with correct attributes
   - Build system creates required files

2. **Public Contracts**: APIs and interfaces that won't change
   - Token registry provides expected methods
   - Component props work as documented
   - Platform generators accept correct inputs

3. **Cross-Platform Consistency**: Behavior that must remain consistent
   - Same tokens generated for all platforms
   - Components work identically across platforms
   - Build outputs follow platform conventions

4. **Compliance Requirements**: Standards that are permanent
   - Token compliance (no hard-coded values)
   - Accessibility requirements (WCAG 2.1 AA)
   - Security restrictions (contamination prevention)

### Temporary Tests (Has Retirement Criteria)

Tests are **temporary** if they:

1. **Validate Transitions**: Check behavior during migration
   - Tests for deprecated APIs during transition period
   - Validation of old and new approaches side-by-side
   - Compatibility checks during refactoring

2. **Enforce Temporary Constraints**: Check rules that will be removed
   - Specific token count expectations during development
   - Temporary validation rules for work-in-progress features
   - Scaffolding tests for incomplete implementations

3. **Document Known Issues**: Track bugs or limitations
   - Tests that expect current (incorrect) behavior
   - Workaround validation until proper fix is implemented
   - Regression tests for specific bugs

**Note**: Based on confirmed actions review, NO temporary tests were found from Spec 017 or Spec 023. All tests in current suite are evergreen.

---

## Categorization by Test Type

### Component Tests (Evergreen)

**Category**: Evergreen  
**Rationale**: Component behavior is permanent - tests verify public contracts

**Examples**:
- `Icon.lifecycle.test.ts` - Icon rendering behavior
- `ButtonCTA.icon-integration.test.ts` - Button with icon integration
- `TextInputField.test.ts` - Text input behavior

**Purpose Pattern**: "Verify [Component] [behavior] with [conditions]"

### Token Compliance Tests (Evergreen)

**Category**: Evergreen  
**Rationale**: Token compliance is permanent requirement (Decision 8 in design doc)

**Examples**:
- `TokenCompliance.test.ts` - Token usage validation
- `PrimitiveReferenceValidator.test.ts` - Token reference validation
- `SemanticTokenValidator.test.ts` - Semantic token validation

**Purpose Pattern**: "Verify [system] uses tokens correctly without hard-coded values"

### Build System Tests (Evergreen)

**Category**: Evergreen  
**Rationale**: Build system behavior is permanent - tests verify required outputs

**Examples**:
- `BuildSystemIntegration.test.ts` - Build orchestration
- `TokenFileGenerator.test.ts` - Token file generation
- `BuildOrchestrator.test.ts` - Build coordination

**Purpose Pattern**: "Verify build system generates [output] for [platform]"

### Integration Tests (Evergreen)

**Category**: Evergreen  
**Rationale**: Integration behavior is permanent - tests verify system coordination

**Examples**:
- `SemanticTokenGeneration.test.ts` - Token generation integration
- `ValidationCoordinator.test.ts` - Validation system integration
- `PublishingWorkflow.integration.test.ts` - Publishing integration

**Purpose Pattern**: "Verify [system A] integrates correctly with [system B]"

### Performance Tests (Evergreen)

**Category**: Evergreen  
**Rationale**: Performance requirements are permanent - tests verify acceptable performance

**Examples**:
- `PerformanceValidation.test.ts` - Performance thresholds
- Performance regression tests in release analysis

**Purpose Pattern**: "Verify [operation] completes within [threshold]"

### Security Tests (Evergreen)

**Category**: Evergreen  
**Rationale**: Security requirements are permanent - tests verify safety constraints

**Examples**:
- `ContaminationPrevention.test.ts` - Contamination prevention
- `AIAgentRestrictions.test.ts` - AI agent safety
- `SecurityIntegration.test.ts` - Security system integration

**Purpose Pattern**: "Verify [security constraint] prevents [threat]"

---

## Implementation Plan

### Phase 1: Categorize Test Files (All Evergreen)

Based on confirmed actions review, all 252 test files will be categorized as **evergreen**. No temporary tests exist in the current suite.

**Approach**:
1. Add JSDoc comment block to top of each test file
2. Set `@category evergreen`
3. Write descriptive `@purpose` based on test file name and content
4. No `@retirementCriteria` or `@createdInSpec` needed (all evergreen)

### Phase 2: Verify Categorization

1. Scan all test files for categorization metadata
2. Verify all files have `@category` field
3. Verify all files have `@purpose` field
4. Count evergreen vs temporary tests

### Phase 3: Document Results

Create completion document with:
- Total test count: 252
- Evergreen count: 252
- Temporary count: 0
- Categorization approach and rationale

---

## Purpose Statement Patterns

### Component Tests
- "Verify [Component] renders correctly with [conditions]"
- "Verify [Component] [behavior] when [event occurs]"
- "Verify [Component] integrates with [other component]"

### Token Tests
- "Verify [token type] generation produces valid tokens"
- "Verify [system] uses tokens correctly without hard-coded values"
- "Verify [token] references are valid and resolvable"

### Build System Tests
- "Verify build system generates [output] for [platform]"
- "Verify [generator] produces [format] with correct structure"
- "Verify build orchestration coordinates [systems]"

### Integration Tests
- "Verify [system A] integrates correctly with [system B]"
- "Verify [workflow] completes successfully across [systems]"
- "Verify [operation] maintains consistency across [platforms]"

### Performance Tests
- "Verify [operation] completes within [threshold]"
- "Verify [system] performance meets requirements"
- "Verify [operation] doesn't regress beyond [threshold]"

### Security Tests
- "Verify [security constraint] prevents [threat]"
- "Verify [system] enforces [security requirement]"
- "Verify [operation] maintains [security property]"

---

## Validation Criteria

### Success Criteria

- ✅ All 252 test files have categorization metadata
- ✅ All files have `@category` field (evergreen or temporary)
- ✅ All files have `@purpose` field with descriptive text
- ✅ Temporary tests have `@retirementCriteria` field
- ✅ Categorization documented in completion document

### Verification Commands

```bash
# Count test files
find src -name "*.test.ts" -o -name "*.test.tsx" | wc -l

# Check for categorization metadata
grep -r "@category" src --include="*.test.ts" --include="*.test.tsx" | wc -l

# Verify all have purpose
grep -r "@purpose" src --include="*.test.ts" --include="*.test.tsx" | wc -l

# Count evergreen tests
grep -r "@category evergreen" src --include="*.test.ts" --include="*.test.tsx" | wc -l

# Count temporary tests
grep -r "@category temporary" src --include="*.test.ts" --include="*.test.tsx" | wc -l
```

---

## Requirements Validation

This categorization strategy validates:

- ✅ **Requirement 13.1**: Mark each test as evergreen or temporary
- ✅ **Requirement 13.2**: Document evergreen tests as permanent behavior verification
- ✅ **Requirement 13.3**: Document explicit retirement criteria for temporary tests
- ✅ **Requirement 13.4**: Flag unclear categories for human decision (none found)
- ✅ **Requirement 13.5**: Document count of evergreen vs temporary tests

---

*Categorization strategy complete. Ready for implementation.*
