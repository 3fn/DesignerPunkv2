# Token Compliance Tests - Detailed Audit

**Date**: December 19, 2025
**Task**: 3.2 Audit token compliance tests
**Spec**: 025 - Test Suite Overhaul and Standards Alignment
**Status**: Audit Phase

---

## Executive Summary

This detailed audit examines the token compliance tests in `src/components/__tests__/TokenCompliance.test.ts` to evaluate whether detected "violations" are intentional patterns, assess if tests check temporary constraints or permanent requirements, and identify tests that are too strict.

**Key Findings**:
- Token compliance tests are **evergreen** (permanent requirements)
- Many detected "violations" are **intentional defensive programming patterns**
- Tests are **too strict** in several areas, flagging valid implementation choices
- Some patterns (like `|| 'fallback'`) serve legitimate purposes
- CSS files should be excluded from hard-coded value detection

---

## Test File Overview

**File**: `src/components/__tests__/TokenCompliance.test.ts`
**Purpose**: Evergreen prevention tests that scan all components for token compliance violations
**Test Categories**:
1. Hard-Coded Color Detection (3 tests)
2. Fallback Pattern Detection (3 tests)
3. Hard-Coded Spacing Detection (1 test)
4. Hard-Coded Motion Detection (1 test)
5. Hard-Coded Typography Detection (1 test)

**Total Tests**: 9 compliance tests
**Current Status**: All tests passing (0 failures)

---

## Pattern Analysis

### Pattern 1: Fallback Pattern Detection (|| and ??)

**Tests**:
- `should not contain || number fallback patterns`
- `should not contain || string fallback patterns`
- `should not contain ?? number fallback patterns`

**Current Behavior**:
Tests flag any use of `||` or `??` operators with hard-coded values as violations:

```typescript
// Detected patterns
const fallbackPattern = /\|\|\s*[1-9]\d*(?:\.\d+)?(?!\d)/;  // || number
const fallbackPattern = /\|\|\s*['"`][^'"`]*\d+[^'"`]*['"`]/;  // || string
const fallbackPattern = /\?\?\s*[1-9]\d*(?:\.\d+)?(?!\d)/;  // ?? number
```

**Evaluation**:

**Are these violations intentional patterns?** YES

Examples from Icon component:
```typescript
// Icon.web.ts:100
const sizeClass = sizeClassMap[size] || 'icon--size-100';

// Icon.web.ts:259
const size = parseInt(this.getAttribute('size') || '24', 10);

// Icon.web.ts:318
const sizeClass = sizeClassMap[size] || 'icon--size-100';
```

**Purpose of these patterns**:
1. **Graceful degradation**: Provides sensible defaults when attributes are missing
2. **Defensive programming**: Prevents crashes from invalid input
3. **Developer experience**: Makes components more forgiving during development
4. **Optional attributes**: Handles cases where attributes are legitimately optional

**Are these temporary or permanent requirements?** PERMANENT

Token compliance is a permanent requirement for the design system. However, the specific enforcement of "no fallback patterns" is a **philosophical preference**, not a functional requirement.

**Are tests too strict?** YES

**Rationale**:
- Tests enforce "fail loudly" philosophy, which is not a functional requirement
- Fallbacks for optional attributes are valid implementation choices
- Defensive programming is a best practice, not a violation
- Tests should distinguish between:
  - **Acceptable fallbacks**: Default values for optional attributes (e.g., `|| '24'` for size)
  - **Problematic fallbacks**: Masking missing required tokens (e.g., `|| '250ms'` for motion duration)

**Recommendation**: REFINE

**Proposed Refinement**:
1. **Allow fallbacks for optional attributes**: Don't flag `|| 'default'` when attribute is optional
2. **Flag fallbacks for required tokens**: Continue flagging `|| 'value'` when token should always be present
3. **Context-aware detection**: Distinguish between attribute defaults and token fallbacks

**Example Refinement**:
```typescript
// ACCEPTABLE: Optional attribute with default
const size = parseInt(this.getAttribute('size') || '24', 10);

// PROBLEMATIC: Required token with fallback
const duration = motionToken.duration || 250; // Should fail loudly if token missing
```

---

### Pattern 2: Hard-Coded Color Detection

**Tests**:
- `should not contain Color(red:green:blue:) pattern in iOS files`
- `should not contain Color(0xRRGGBB) pattern in Android files`
- `should not contain rgb() or hex color patterns in Web files`

**Current Behavior**:
Tests scan for hard-coded RGB/hex color values across all platforms.

**Evaluation**:

**Are these violations intentional patterns?** NO

Hard-coded color values are genuine violations - components should use semantic color tokens.

**Are these temporary or permanent requirements?** PERMANENT

Color token compliance is a permanent requirement for:
- Design system consistency
- Theme support
- Accessibility (color contrast)
- Maintainability

**Are tests too strict?** NO

**Rationale**:
- Color tokens are always required
- No legitimate use case for hard-coded colors in components
- Tests correctly identify violations

**Recommendation**: KEEP

**Current Status**: Tests are working correctly and should remain as-is.

---

### Pattern 3: Hard-Coded Spacing Detection

**Test**: `should not contain hard-coded spacing values`

**Current Behavior**:
Tests scan for hard-coded spacing values (px, dp, CGFloat) across all platforms.

**Evaluation**:

**Are these violations intentional patterns?** MIXED

**Examples**:
```css
/* ButtonCTA.web.css:79 */
min-width: 56px; /* buttonCTA.minWidth.small */

/* ButtonCTA.web.css:107 */
min-width: 72px; /* buttonCTA.minWidth.medium */

/* ButtonCTA.web.css:135 */
min-width: 80px; /* buttonCTA.minWidth.large */
```

**Analysis**:
- These are **CSS files**, not source files
- Values are **generated from tokens** during build
- Comments document the **token source**
- Not actual violations

**Are these temporary or permanent requirements?** PERMANENT

Spacing token compliance is a permanent requirement, but the test is incorrectly flagging generated CSS.

**Are tests too strict?** YES

**Rationale**:
- Tests scan CSS files, which contain generated values
- CSS files are the output of token generation, not the source
- Tests should only scan source files (.ts, .tsx, .swift, .kt)

**Recommendation**: REFINE

**Proposed Refinement**:
1. **Exclude CSS files**: Don't scan `.css` files (they're generated)
2. **Focus on source files**: Only scan `.ts`, `.tsx`, `.swift`, `.kt` files
3. **Ignore comments**: Don't flag values in comments

**Example Refinement**:
```typescript
// Skip CSS files
if (file.endsWith('.css')) {
  return; // CSS files contain generated values
}

// Skip comments
const trimmedLine = line.trim();
if (trimmedLine.startsWith('//') || trimmedLine.startsWith('/*') || trimmedLine.startsWith('*')) {
  return;
}
```

---

### Pattern 4: Hard-Coded Motion Detection

**Test**: `should not contain hard-coded motion duration values`

**Current Behavior**:
Tests scan for hard-coded animation/transition durations across all platforms.

**Evaluation**:

**Are these violations intentional patterns?** NO

Hard-coded motion durations are genuine violations - components should use motion tokens.

**Are these temporary or permanent requirements?** PERMANENT

Motion token compliance is a permanent requirement for:
- Consistent animation timing
- Accessibility (respects prefers-reduced-motion)
- Maintainability

**Are tests too strict?** NO

**Rationale**:
- Motion tokens are always required
- No legitimate use case for hard-coded durations in components
- Tests correctly identify violations

**Recommendation**: KEEP

**Current Status**: Tests are working correctly and should remain as-is.

---

### Pattern 5: Hard-Coded Typography Detection

**Test**: `should not contain hard-coded typography values`

**Current Behavior**:
Tests scan for hard-coded font sizes, weights, and line heights across all platforms.

**Evaluation**:

**Are these violations intentional patterns?** NO

Hard-coded typography values are genuine violations - components should use typography tokens.

**Are these temporary or permanent requirements?** PERMANENT

Typography token compliance is a permanent requirement for:
- Consistent typography scale
- Accessibility (text sizing)
- Maintainability

**Are tests too strict?** NO

**Rationale**:
- Typography tokens are always required
- No legitimate use case for hard-coded typography in components
- Tests correctly identify violations

**Recommendation**: KEEP

**Current Status**: Tests are working correctly and should remain as-is.

---

## Test Categorization

### Evergreen Tests (Permanent Requirements)

All token compliance tests are **evergreen** - they verify permanent requirements:

1. ✅ **Color compliance**: Always required
2. ✅ **Spacing compliance**: Always required (but needs refinement)
3. ✅ **Motion compliance**: Always required
4. ✅ **Typography compliance**: Always required
5. ⚠️ **Fallback pattern detection**: Permanent goal, but too strict

**Rationale**:
- Token compliance is a core design system principle
- Tests prevent regression and maintain consistency
- Tests should remain active indefinitely

### Tests Requiring Refinement

**Test 1: Fallback Pattern Detection**
- **Current**: Flags all `||` and `??` patterns as violations
- **Refinement**: Distinguish between optional attribute defaults and token fallbacks
- **Impact**: Reduce false positives while maintaining token compliance

**Test 2: Hard-Coded Spacing Detection**
- **Current**: Scans CSS files and flags generated values
- **Refinement**: Exclude CSS files, focus on source files only
- **Impact**: Eliminate false positives from generated CSS

---

## Intentional Patterns vs. Violations

### Intentional Patterns (Should NOT be flagged)

1. **Optional attribute defaults**:
   ```typescript
   const size = this.getAttribute('size') || '24'; // Default size for optional attribute
   ```

2. **Defensive programming for user input**:
   ```typescript
   const sizeClass = sizeClassMap[size] || 'icon--size-100'; // Fallback for invalid size
   ```

3. **Generated CSS values**:
   ```css
   min-width: 56px; /* buttonCTA.minWidth.small */
   ```

### Genuine Violations (Should be flagged)

1. **Hard-coded colors**:
   ```typescript
   color: '#FF0000'; // Should use color token
   ```

2. **Hard-coded motion durations**:
   ```typescript
   transition: all 250ms; // Should use motion token
   ```

3. **Hard-coded typography**:
   ```typescript
   fontSize: 16; // Should use typography token
   ```

4. **Token fallbacks** (masking missing tokens):
   ```typescript
   const duration = motionToken.duration || 250; // Should fail loudly if token missing
   ```

---

## Recommendations Summary

### Keep As-Is (Working Correctly)

1. ✅ **Color detection tests**: Correctly identify violations
2. ✅ **Motion detection tests**: Correctly identify violations
3. ✅ **Typography detection tests**: Correctly identify violations

### Refine (Too Strict)

1. ⚠️ **Fallback pattern detection**: Distinguish between optional defaults and token fallbacks
2. ⚠️ **Spacing detection**: Exclude CSS files, focus on source files

### Test Evaluation Criteria

**For each pattern, evaluate**:
- ✅ Is this a functional requirement? (Yes for color, motion, typography)
- ✅ Is this a permanent requirement? (Yes for all token compliance)
- ⚠️ Is this too strict? (Yes for fallback patterns and CSS scanning)
- ✅ Does this provide long-term value? (Yes for all token compliance)

---

## Implementation Guidance

### Refinement 1: Fallback Pattern Detection

**Current Logic**:
```typescript
const fallbackPattern = /\|\|\s*['"`][^'"`]*\d+[^'"`]*['"`]/;
```

**Proposed Logic**:
```typescript
// Context-aware detection
// 1. Check if fallback is for getAttribute() - likely optional attribute
// 2. Check if fallback is for token access - likely masking missing token

// ACCEPTABLE: getAttribute() with default
if (line.includes('getAttribute') && fallbackPattern.test(line)) {
  return; // Optional attribute with default
}

// PROBLEMATIC: Token access with fallback
if (line.includes('Token') && fallbackPattern.test(line)) {
  violations.push(...); // Masking missing token
}
```

### Refinement 2: Spacing Detection

**Current Logic**:
```typescript
componentFiles.forEach(file => {
  // Scans all files including CSS
});
```

**Proposed Logic**:
```typescript
componentFiles.forEach(file => {
  // Skip CSS files (they contain generated values)
  if (file.endsWith('.css')) {
    return;
  }
  
  // Continue with source file scanning
});
```

---

## Conclusion

Token compliance tests are **evergreen** and provide permanent value for the design system. However, two areas need refinement:

1. **Fallback pattern detection**: Too strict, flags intentional defensive programming
2. **Spacing detection**: Incorrectly scans CSS files with generated values

All other token compliance tests (color, motion, typography) are working correctly and should remain as-is.

**Next Steps**:
1. Present findings to human for confirmation
2. Create confirmed actions document
3. Implement refinements
4. Verify tests still catch genuine violations

---

*Audit complete. Ready for human review and confirmation.*
