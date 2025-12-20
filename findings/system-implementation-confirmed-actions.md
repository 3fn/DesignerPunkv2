# Section 2 Confirmed Actions: System Implementation

**Date**: December 19, 2025
**Spec**: 025 - Test Suite Overhaul and Standards Alignment
**Section**: System Implementation (Components, Tokens, Build System, Integration)
**Status**: Confirmed - Ready for Implementation

---

## Executive Summary

This document contains human-confirmed actions for System Implementation test fixes. All 13 patterns have been reviewed and categorized. Implementation will proceed with these confirmed actions.

### Confirmation Summary

| Category | Pattern Count | Test Count | Notes |
|----------|---------------|------------|-------|
| **Refine** | 4 | ~32 | Adjust criteria, keep tests |
| **Fix** | 7 | ~60-85 | Rewrite to check behavior |
| **Keep** | 2 | ~20-30 | Already TDS-aligned |
| **Total** | **13** | **~112-147** | |

### Bugs Addressed

| Bug | Status | Action |
|-----|--------|--------|
| Invalid icon size token reference | Resolved | Fix validation test to support custom: pattern |
| Icon size token mismatch | Flagged | Investigate in scope |
| LineHeight token value mismatch | Flagged | Investigate in scope |

---

## Refine Actions (Adjust Criteria)

### R1: Fallback Pattern False Positives (Pattern 1)

**Status**: ✅ Confirmed by human

**Affected Tests**: 3-5 violations in TokenCompliance tests

**Current Issue**: Tests flag `|| 'fallback'` patterns as violations, but these are intentional defensive programming

**Refinement**:
- Distinguish acceptable fallbacks (default values for optional attributes) from problematic ones (masking missing tokens)
- Allow patterns like `|| '24'` for default size attributes
- Allow patterns like `|| 'icon--size-100'` for default size classes
- Continue flagging patterns that mask missing required tokens

**Examples**:
- `src/components/core/Icon/platforms/web/Icon.web.ts:100` - Acceptable: default size class
- `src/components/core/Icon/platforms/web/Icon.web.ts:259` - Acceptable: default size attribute
- `src/components/core/Icon/platforms/web/Icon.web.ts:318` - Acceptable: default size class

**Implementation Approach**:
```typescript
// Update TokenCompliance test to distinguish fallback types
const acceptableFallbackPatterns = [
  /\|\|\s*['"`]\d+['"`]/,           // Numeric defaults (|| '24')
  /\|\|\s*['"`]icon--size-\d+['"`]/ // Size class defaults
];

// Only flag fallbacks that don't match acceptable patterns
```

**Requirements Validated**: 5.4, 14.3, 14.4

---

### R2: Hard-Coded Spacing Detection (Pattern 4)

**Status**: ✅ Confirmed by human (with refinement)

**Affected Tests**: 23 violations in TokenCompliance tests

**Current Issue**: Tests flag CSS files with comments like `min-width: 56px; /* buttonCTA.minWidth.small */`

**Human Feedback**: "If we exclude CSS files, how will we know if hard values aren't being in the code of those files — outside of the comments?"

**Refined Approach**: Use smarter regex to distinguish documented vs undocumented hard-coded values

**Refinement**:
- Flag hard-coded values WITHOUT token documentation comments
- Allow hard-coded values WITH token documentation comments (generated CSS)
- Continue scanning CSS files (don't exclude them)

**Examples**:
- ✅ Allow: `min-width: 56px; /* buttonCTA.minWidth.small */` (documented)
- ❌ Flag: `min-width: 56px;` (undocumented)

**Implementation Approach**:
```typescript
// Update regex to exclude values followed by token comments
const hardCodedPattern = /\d+px(?!\s*\/\*)/; // Matches "56px" but not "56px /* comment */"
```

**Requirements Validated**: 5.4, 14.4, 14.5

---

### R3: Token Compliance Overly Strict (Pattern 5)

**Status**: ✅ Confirmed by human

**Affected Tests**: 5-10 tests with overly strict criteria

**Current Issue**: Tests enforce philosophical preferences rather than functional requirements

**Refinement**:
- Combine refinements from R1 (fallback patterns) and R2 (hard-coded spacing)
- Focus on functional requirements: verify tokens are used correctly
- Allow defensive programming patterns
- Reduce false positives from CSS files and comments

**Implementation Approach**:
- Apply R1 refinements to fallback pattern detection
- Apply R2 refinements to hard-coded value detection
- Update test documentation to clarify functional vs philosophical requirements

**Requirements Validated**: 5.4, 14.4, 14.5

---

### R4: Performance Threshold Unrealistic (Pattern 11)

**Status**: ✅ Confirmed by human

**Affected Tests**: 1 test in PerformanceValidation.test.ts

**Current Issue**: Platform generation threshold is 10ms, actual performance is ~20ms

**Refinement**:
- Adjust normal threshold from 10ms to 25ms
- Keep regression threshold at 3ms (2x P95 measured performance)
- Document that 25ms provides headroom for system variance

**Examples**:
- `src/__tests__/integration/PerformanceValidation.test.ts:568` - Platform generation threshold

**Implementation Approach**:
```typescript
const NORMAL_THRESHOLDS = {
  platformGeneration: 25,    // ms - Increased from 10ms to 25ms
  // ... other thresholds
};
```

**Requirements Validated**: 5.1, 10.2, 10.4

---

## Fix Actions (Rewrite to Check Behavior)

### F1: Web Component Lifecycle Testing (Pattern 2)

**Status**: ✅ Confirmed by human

**Affected Tests**: 15-20 tests in Icon.lifecycle.test.ts and similar files

**Current Issue**: Tests check that lifecycle methods fire instead of checking behavior

**Fix Approach**:
- Remove `describe('connectedCallback')` blocks - test behavior, not lifecycle methods
- Focus on observable behavior: "icon renders when added to DOM"
- Tests should survive refactoring of lifecycle implementation

**Examples**:
- `src/components/core/Icon/platforms/web/__tests__/Icon.lifecycle.test.ts` - Entire file needs refactoring

**Implementation Approach**:
```typescript
// Before:
describe('connectedCallback', () => {
  it('should render icon when added to DOM', async () => { ... });
});

// After:
describe('Icon Rendering', () => {
  it('should render icon when added to DOM', async () => { ... });
});
```

**Requirements Validated**: 5.2, 8.1, 8.2, 8.3

---

### F2: Shadow DOM Implementation Details (Pattern 3)

**Status**: ✅ Confirmed by human

**Affected Tests**: 10-15 tests checking shadow DOM internals

**Current Issue**: Tests check SVG structure (viewBox, fill, stroke-linecap) instead of behavior

**Fix Approach**:
- Remove checks for internal SVG attributes
- Focus on public contract: icon name, accessibility attributes
- Tests should survive refactoring of SVG structure

**Examples**:
- `src/components/core/Icon/__tests__/Icon.test.ts:22-26` - Checks SVG viewBox
- `src/components/core/Icon/__tests__/Icon.test.ts:115-120` - Checks SVG attributes

**Implementation Approach**:
```typescript
// Before:
expect(result).toContain('viewBox="0 0 24 24"');

// After:
expect(result).toContain('icon-arrow-right');
expect(result).toContain('aria-hidden="true"');
```

**Requirements Validated**: 5.2, 8.1, 8.2, 8.3

---

### F3: Build System Token Generation Failures (Pattern 6)

**Status**: ✅ Confirmed by human

**Affected Tests**: 10-15 tests in TokenFileGenerator.test.ts and related files

**Current Issue**: Tests expect exact token counts that no longer match (145 vs 144, 23 vs 26)

**Fix Approach**:
- Remove hardcoded token counts
- Verify tokens are valid (have name and value)
- Verify cross-platform consistency (same count across platforms)
- Tests should survive token system evolution

**Examples**:
- `src/generators/__tests__/TokenFileGenerator.test.ts` - Cross-platform consistency validation
- `src/generators/__tests__/GridSpacingTokenGeneration.test.ts` - Grid spacing token count
- `src/__tests__/integration/SemanticTokenGeneration.test.ts` - Semantic token generation

**Implementation Approach**:
```typescript
// Before:
expect(webTokens.length).toBe(145);

// After:
expect(webTokens.length).toBeGreaterThan(0);
expect(webTokens.every(t => t.name && t.value)).toBe(true);
expect(webTokens.length).toBe(iosTokens.length); // Cross-platform consistency
```

**Requirements Validated**: 5.2, 5.3, 5.4

---

### F4: BuildOrchestrator Validation Failures (Pattern 7)

**Status**: ✅ Confirmed by human (with clarification)

**Affected Tests**: 5-10 tests in BuildOrchestrator.test.ts

**Current Issue**: Tests failing due to "invalid" `custom:1.231` multiplier reference

**Human Clarification**: This is intentional - `icon.size050` uses custom multiplier for optical correction. The IconTokens.ts implementation already supports `custom:` pattern with proper parsing and documentation.

**Fix Approach**:
- Update validation test to recognize `CUSTOM_MULTIPLIER_PREFIX` pattern
- Validate custom multipliers are valid numbers
- Stop checking if custom multipliers exist in primitive registry
- The code is correct - the test validation logic is wrong

**Examples**:
- `src/build/__tests__/BuildOrchestrator.test.ts:*` - Multiple tests failing due to validation

**Implementation Approach**:
```typescript
// Import from IconTokens
import { CUSTOM_MULTIPLIER_PREFIX, isCustomMultiplier } from '../semantic/IconTokens';

// In validation logic:
if (isCustomMultiplier(multiplierRef)) {
  // Custom multipliers are allowed - validate it's a number
  const value = parseFloat(multiplierRef.slice(CUSTOM_MULTIPLIER_PREFIX.length));
  if (isNaN(value)) {
    errors.push(`Invalid custom multiplier: ${multiplierRef}`);
  }
} else {
  // It's a primitive token reference - check it exists
  if (!primitiveTokenRegistry[multiplierRef]) {
    errors.push(`Invalid primitive reference: ${multiplierRef}`);
  }
}
```

**Requirements Validated**: 5.2, 12.2, 12.3

---

### F5: Icon SVG Attribute Testing (Pattern 10)

**Status**: ✅ Confirmed by human

**Affected Tests**: 8-10 tests in integration test files

**Current Issue**: Tests check for `width="24"` and `height="24"` attributes, but Icon now uses CSS classes

**Fix Approach**:
- Check for size classes (`icon--size-100`) instead of attributes
- Focus on behavior (icon displays at correct size) not implementation (SVG has width attribute)
- Tests should survive implementation changes

**Examples**:
- `src/components/core/TextInputField/__tests__/integration.test.ts:33` - Error icon width check
- `src/components/core/ButtonCTA/platforms/web/__tests__/ButtonCTA.icon-integration.test.ts:91` - Small button icon

**Implementation Approach**:
```typescript
// Before:
expect(errorIcon).toContain('width="24"');

// After:
expect(errorIcon).toContain('icon--size-100'); // Checks size class
```

**Requirements Validated**: 5.2, 8.1, 8.2

---

### F6: Build System Token Count Validation (Pattern 12)

**Status**: ✅ Confirmed by human

**Affected Tests**: 5-10 tests in BuildSystemIntegration.test.ts

**Current Issue**: Tests hardcode expected token counts instead of verifying behavior

**Fix Approach**: Same as F3 (Pattern 6) - remove hardcoded counts, verify behavior

**Examples**:
- `src/__tests__/BuildSystemIntegration.test.ts:309` - Cross-platform consistency validation

**Implementation Approach**: Same as F3

**Requirements Validated**: 5.2, 5.3, 5.4

---

### F7: Semantic Token Generation Cross-Platform (Pattern 13)

**Status**: ✅ Confirmed by human

**Affected Tests**: 1 test in SemanticTokenGeneration.test.ts

**Current Issue**: Test expects 145 tokens but receives 144

**Fix Approach**: Same as F3 and F6 - remove hardcoded counts, verify behavior

**Examples**:
- `src/__tests__/integration/SemanticTokenGeneration.test.ts:256` - Cross-platform token count

**Implementation Approach**: Same as F3

**Requirements Validated**: 5.2, 5.3, 5.4

---

## Keep Actions (Already TDS-Aligned)

### K1: NPM Package Structure Tests (Pattern 8)

**Status**: ✅ Confirmed by human

**Affected Tests**: 5-10 tests in BuildSystemIntegration.test.ts

**Rationale**: Tests verify correct file organization for each platform's build system. These check behavior (files organized correctly), not implementation details.

**Examples**:
- `src/__tests__/BuildSystemIntegration.test.ts` - File organization tests

**Action**: Keep as-is

**Requirements Validated**: 8.1, 8.2, 8.3

---

### K2: Platform Build Configuration Tests (Pattern 9)

**Status**: ✅ Confirmed by human

**Affected Tests**: 15-20 tests in BuildSystemIntegration.test.ts

**Rationale**: Tests verify build system integration provides correct configuration. These check contracts (required config fields), not internal details.

**Examples**:
- `src/__tests__/BuildSystemIntegration.test.ts` - All "Build System Integration" tests

**Action**: Keep as-is

**Requirements Validated**: 8.1, 8.2, 8.3

---

## Bugs to Address

### B1: Icon Size Token Mismatch

**Evidence**: Test failure in `IconTokens.test.ts:752` - Generated tokens don't match manually defined tokens

**Status**: Flagged for investigation

**Recommendation**: Investigate in scope - This appears to be a real bug where generated tokens don't match manually defined tokens

**Tests Affected**: 
- `src/tokens/semantic/__tests__/IconTokens.test.ts:750-755`

**Action**: Investigate during implementation phase

---

### B2: LineHeight Token Value Mismatch

**Evidence**: Test failure in `TokenCategories.test.ts:187` - `lineHeight050` has value 1.538 instead of expected 1.0

**Status**: Flagged for investigation

**Recommendation**: Investigate in scope - This appears to be a real bug where lineHeight050 has wrong value

**Tests Affected**:
- `src/tokens/__tests__/TokenCategories.test.ts:187`

**Action**: Investigate during implementation phase

---

## Temporary Tests Review

**Finding**: No temporary tests found from Spec 017 or Spec 023

**Action**: No retirement actions needed

**Details**: See `findings/temporary-test-review.md` for comprehensive review

**Requirements Validated**: 9.1, 9.2, 9.3, 9.4, 9.5

---

## Implementation Sequence

### Phase 1: Refinements (Low Risk)
1. R4: Performance threshold adjustment (1 test)
2. R1: Fallback pattern refinement (3-5 tests)
3. R2: Hard-coded spacing detection (23 tests)
4. R3: Token compliance overall (combines R1 + R2)

### Phase 2: Fixes (Medium Risk)
1. F4: BuildOrchestrator validation (5-10 tests) - Unblocks other tests
2. F3, F6, F7: Token count validation (combined, ~16-26 tests)
3. F5: Icon SVG attributes (8-10 tests)
4. F1: Web component lifecycle (15-20 tests)
5. F2: Shadow DOM implementation (10-15 tests)

### Phase 3: Bug Investigation (High Risk)
1. B1: Icon size token mismatch
2. B2: LineHeight token value mismatch

### Phase 4: Verification
1. Run System Implementation tests
2. Verify 0 failures in this section
3. Document any unexpected failures

---

## Success Criteria

- ✅ All Refine actions implemented (adjust criteria, tests still run)
- ✅ All Fix actions implemented (tests rewritten to check behavior)
- ✅ All Keep actions verified (tests remain unchanged)
- ✅ Bugs investigated and resolved or documented
- ✅ System Implementation tests passing (0 failures)
- ✅ All tests categorized as evergreen or temporary
- ✅ Section verified before proceeding to Release Analysis

---

## Requirements Validation

This confirmed actions document validates the following requirements:

- ✅ **Requirement 3.1-3.7**: Nuanced recommendations (Delete, Fix, Refine, Convert, Keep)
- ✅ **Requirement 4.1-4.6**: Confirmation process with human review
- ✅ **Requirement 5.1-5.6**: Implementation process follows confirmed actions only
- ✅ **Requirement 8.1-8.5**: Comprehensive TDS alignment (passing and failing tests)
- ✅ **Requirement 9.1-9.5**: Temporary test review and retirement decisions
- ✅ **Requirement 12.1-12.5**: Bug discovery handling
- ✅ **Requirement 14.1-14.5**: Token compliance test refinement

---

*Confirmed actions document complete. Ready for implementation (Task 4).*
