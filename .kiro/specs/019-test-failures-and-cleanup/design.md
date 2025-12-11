# Design Document: Test Failures and Component Cleanup

**Date**: December 11, 2025
**Spec**: 019 - Test Failures and Component Cleanup
**Status**: Design Phase
**Dependencies**: 
- Spec 017 (Component Code Quality Sweep) - Builds on cleanup plan and follow-up recommendations

---

## Overview

This spec addresses 80 test failures and 111 remaining component violations identified in Spec 017. The work is organized into three phases: (1) Fix critical TypeScript compilation errors blocking the build, (2) Complete component token compliance cleanup, and (3) Update tests to reflect the current token system. The design prioritizes quick wins first, then tackles complex component cleanup, and finally addresses performance test issues.

---

## Architecture

### Phase-Based Execution Strategy

```
Phase 1: Critical Fixes (Unblock Build)
├── Fix TypeScript compilation errors
├── Add missing space000 token (COMPLETE)
└── Verify build succeeds

Phase 2: Component Cleanup (Token Compliance)
├── Icon Component (34 violations)
├── Container Component (47 violations)
├── TextInputField Remaining (23 violations)
├── ButtonCTA Web (1 violation)
└── TextInputField.browser.ts (13 violations - legacy)

Phase 3: Test Updates (Reflect Current System)
├── Update token count expectations
├── Fix integration test compilation
├── Update token compliance tests
└── Address performance test timeouts

Phase 4: Verification
├── Run full test suite
├── Run audit script
└── Confirm zero violations
```

### Cleanup Priority Matrix

| Component | Violations | Complexity | Risk | Priority |
|-----------|-----------|------------|------|----------|
| ButtonCTA Web | 1 | Low | Low | P1 (Quick Win) |
| Icon Web Tests | 2 | Low | Low | P1 (Quick Win) |
| TextInputField.browser.ts | 13 | Low | Low | P1 (Legacy Check) |
| Icon Android Docs | 32 | Medium | Low | P2 (Documentation) |
| TextInputField Remaining | 23 | Medium | Medium | P3 (Production) |
| Container Web | 3 | Low | Medium | P3 (Production) |
| Container Android | 44 | High | High | P4 (Complex) |

---

## Components and Interfaces

### TypeScript Compilation Fixes

**Issue**: ButtonCTA passes `number` to Icon component expecting `IconSize` type

**Root Cause**: Icon size calculation returns number instead of IconSize union type

**Solution**: Type-safe icon size mapping

```typescript
// ButtonCTA.web.ts - Current (BROKEN)
const iconSize = this.size === 'large' ? 32 : 24;

// ButtonCTA.web.ts - Fixed (TYPE-SAFE)
const iconSize: IconSize = this.size === 'large' ? 'large' : 'medium';
```

**Alternative Approach**: If numeric values are needed, create type assertion helper:

```typescript
function getIconSizeForButton(buttonSize: ButtonSize): IconSize {
  switch (buttonSize) {
    case 'small': return 'medium';  // 24px
    case 'medium': return 'medium'; // 24px
    case 'large': return 'large';   // 32px
    default: return 'medium';
  }
}
```

### Component Cleanup Patterns

#### Pattern 1: Documentation Contamination

**Issue**: Hard-coded values in code comments

```kotlin
// BEFORE (Contamination Vector)
// Example: mapPaddingToDp(PaddingValue.P200) // Returns 16.dp

// AFTER (Token Reference)
// Example: mapPaddingToDp(PaddingValue.P200) // Returns spaceInset200 (16.dp)
```

**Strategy**: Reference token name first, hard-coded value in parentheses for context

#### Pattern 2: Test Code Contamination

**Issue**: Hard-coded values in test assertions

```typescript
// BEFORE (Contamination Vector)
expect(buttonSize === 'large' ? 32 : 24).toBe(expectedSize);

// AFTER (Token Reference)
expect(buttonSize === 'large' ? iconSize125 : iconSize100).toBe(expectedSize);
```

**Strategy**: Import token values and reference them in test assertions

#### Pattern 3: Fallback Pattern Removal

**Issue**: Silent fallbacks mask token system issues

```typescript
// BEFORE (Anti-Pattern)
const duration = this.getAttribute('duration') || '250ms';

// AFTER (Fail Loudly)
const duration = this.getAttribute('duration');
if (!duration) {
  throw new Error('TextInputField: duration attribute is required');
}
```

**Strategy**: Remove fallbacks, fail loudly when tokens missing

#### Pattern 4: Legacy File Handling

**Issue**: TextInputField.browser.ts may be deprecated

**Decision Tree**:
```
Is file actively used?
├── YES → Remove all fallback patterns, update to token-first
└── NO → Mark for deletion, document as deprecated
```

**Verification**: Check import statements and usage across codebase

---

## Data Models

### Violation Tracking

```typescript
interface ViolationReport {
  component: string;
  platform: 'web' | 'ios' | 'android';
  file: string;
  lineNumber: number;
  violationType: 'color' | 'spacing' | 'motion' | 'fallback' | 'documentation';
  hardCodedValue: string;
  suggestedToken: string;
  priority: 'P1' | 'P2' | 'P3' | 'P4';
}
```

### Test Failure Categories

```typescript
interface TestFailure {
  suite: string;
  test: string;
  category: 'compilation' | 'token-count' | 'integration' | 'performance';
  rootCause: string;
  fix: string;
  blocksOtherTests: boolean;
}
```

---

## Error Handling

### Compilation Error Strategy

**Approach**: Fix TypeScript errors first, as they block all other work

**Priority Order**:
1. Type mismatches (ButtonCTA icon size)
2. Missing imports
3. Invalid type assertions

### Test Failure Strategy

**Approach**: Categorize failures, fix by category

**Categories**:
1. **Compilation Failures** (P1) - Block test execution
2. **Token Count Mismatches** (P2) - Easy to fix, update expectations
3. **Integration Failures** (P3) - Require component fixes
4. **Performance Timeouts** (P4) - May require optimization or documentation

### Cleanup Verification Strategy

**Approach**: Incremental verification after each component

**Verification Steps**:
1. Run audit script on cleaned component
2. Run component-specific tests
3. Verify zero violations before moving to next component

---

## Token Unit Consistency Investigation

### Issue Discovery

During Task 3.2 (Icon Android preview cleanup), a critical architectural inconsistency was discovered in token generation patterns:

**Icon Size Tokens** (generated WITH units):
```kotlin
// dist/android/DesignTokens.android.kt
val icon_size_050 = 16.dp
val icon_size_075 = 20.dp
val icon_size_100 = 24.dp
val icon_size_125 = 28.dp
val icon_size_150 = 32.dp
```

**Spacing Tokens** (generated WITHOUT units):
```kotlin
// dist/android/DesignTokens.android.kt
const val space_000: Float = 0f
const val space_050: Float = 4f
const val space_075: Float = 6f
const val space_100: Float = 8f
const val space_200: Float = 16f
```

### Usage Pattern Inconsistency

This creates two different usage patterns in component code:

```kotlin
// Icon size tokens - unit included in token
Icon(
    size = DesignTokens.icon_size_100  // No .dp needed
)

// Spacing tokens - unit added at usage
Box(
    modifier = Modifier.padding(DesignTokens.space_200.dp)  // .dp required
)
```

### Investigation Scope

The investigation will determine:

1. **Token Type Coverage**: Which token types include units and which don't?
   - Icon sizes (confirmed: WITH units)
   - Spacing (confirmed: WITHOUT units)
   - Border widths (unknown)
   - Radius (unknown)
   - Elevation (unknown)
   - Typography (unknown)

2. **Cross-Platform Consistency**: Is this issue Android-specific or system-wide?
   - Android (confirmed inconsistent)
   - iOS (unknown)
   - Web (unknown)

3. **Generation Logic**: Why are different token types generated differently?
   - Locate token generation source code
   - Understand decision points in generation logic
   - Document rationale (if any) for different approaches

4. **Impact Assessment**: How widespread is the inconsistency?
   - Audit component code for usage patterns
   - Audit preview code for usage patterns
   - Audit test code for usage patterns
   - Estimate refactoring effort for standardization

5. **Standardization Recommendation**: What's the best path forward?
   - Option A: All tokens WITH units (consistent with icon sizes)
   - Option B: All tokens WITHOUT units (consistent with spacing)
   - Document rationale and trade-offs
   - Provide implementation plan

### Investigation Priority

This investigation takes priority over remaining cleanup tasks (Phase 2C, 2D, and Phase 3) because:

- **Prevents Compounding Debt**: Continuing cleanup with inconsistent patterns makes future standardization exponentially more expensive
- **Informs Cleanup Approach**: Understanding the correct pattern ensures remaining cleanup work follows standardized approach
- **Relatively Quick**: Investigation estimated at 2-4 hours, small delay compared to risk of spreading inconsistency
- **High Impact**: Affects all Android components, potentially iOS and Web as well

### Expected Outcomes

The investigation will produce:

1. **Comprehensive Audit**: Documentation of which token types include units across all platforms
2. **Root Cause Analysis**: Understanding of why generation patterns differ
3. **Impact Assessment**: Scope of changes needed for standardization
4. **Standardization Recommendation**: Clear path forward with rationale and trade-offs
5. **Implementation Plan**: Detailed steps for standardization (if needed)

---

## Test Failure Analysis

### Current Test Failures by Category

**Category 1: TypeScript Compilation (4 test suites)**
- ButtonCTA icon integration tests
- Icon buttonCTA integration tests  
- ButtonCTA setup tests
- ButtonCTA main tests

**Root Cause**: ButtonCTA passes `number` to Icon expecting `IconSize` type

**Fix**: Update ButtonCTA to pass IconSize union type instead of numeric value

---

**Category 2: Token Count Mismatches (6 test suites)**
- BorderWidthTokens tests
- ShadowOffsetTokens tests
- Semantic BorderWidthTokens tests
- GridSpacingTokenGeneration tests
- SemanticTokenGeneration tests
- AccessibilityTokenGeneration tests

**Root Cause**: Tests expect old token counts, don't include space000 or semantic "none" tokens

**Fix**: Update expected token counts to include new tokens

---

**Category 3: Cross-Platform Consistency (1 test suite)**
- TextInputField crossPlatformConsistency tests

**Root Cause**: Tests expect hard-coded motion duration `0.25`, not motion token reference

**Fix**: Update test expectations to look for motion token references instead of hard-coded values

---

**Category 4: Touch Target Sizing (1 test suite)**
- TextInputField touchTargetSizing tests

**Root Cause**: Tests expect old accessibility values, not new tapAreaRecommended token

**Fix**: Update test expectations to use new accessibility token names

---

**Category 5: Token Compliance (1 test suite)**
- TokenCompliance tests (iOS Color() pattern detection)

**Root Cause**: Test regex may not correctly detect all Color(red:green:blue:) patterns

**Fix**: Verify and update regex pattern for iOS color detection

---

**Category 6: Build System Integration (2 test suites)**
- BuildSystemIntegration tests
- BuildOrchestrator tests

**Root Cause**: Semantic "none" tokens reference space000 which didn't exist until now

**Fix**: Tests should now pass with space000 token added

---

**Category 7: Component Integration (3 test suites)**
- TextInputField labelAssociation tests
- TextInputField keyboardNavigation tests
- ButtonCTA/Icon integration tests

**Root Cause**: Component changes broke integration test expectations

**Fix**: Update test expectations to match current component implementations

---

**Category 8: Performance Timeouts (3 test suites)**
- PerformanceRegression tests (>5 seconds)
- HookIntegration tests (>10 seconds)
- QuickAnalyze tests (>5 seconds)

**Root Cause**: Release analysis performance issues from Spec 018

**Fix**: Document for future performance optimization spec (out of scope)

---

## Testing Strategy

### Unit Testing Approach

**Focus**: Verify token references are correct

**Example Test Updates**:

```typescript
// BEFORE (Hard-coded expectation)
expect(element.style.padding).toBe('16px');

// AFTER (Token-based expectation)
expect(element.style.padding).toBe('var(--space-inset-200)');
```

### Integration Testing Approach

**Focus**: Verify components work together with token system

**Example Integration Test**:

```typescript
describe('ButtonCTA with Icon Integration', () => {
  it('should pass correct IconSize type to Icon component', () => {
    const button = new ButtonCTA({ size: 'large', icon: 'arrow-right' });
    const icon = button.querySelector('dp-icon');
    expect(icon.getAttribute('size')).toBe('large'); // IconSize type
  });
});
```

### Test Update Patterns

**Pattern 1: Token Count Expectations**

Tests that validate token counts need updating for new tokens:

```typescript
// BEFORE (Expects old count)
expect(spacingTokens).toHaveLength(11); // Missing space000

// AFTER (Expects new count)
expect(spacingTokens).toHaveLength(12); // Includes space000
```

**Pattern 2: Token Reference Expectations**

Tests that check for specific token references need updating:

```typescript
// BEFORE (Expects old token)
expect(component.style.minHeight).toBe('44px');

// AFTER (Expects new token)
expect(component.style.minHeight).toBe('var(--tap-area-recommended)');
```

**Pattern 3: Cross-Platform Consistency**

Tests that verify cross-platform token usage need updating:

```typescript
// BEFORE (Expects hard-coded value)
expect(iosFile).toContain('motionFloatLabelDuration: TimeInterval = 0.25');

// AFTER (Expects token reference)
expect(iosFile).toContain('motionFloatLabelDuration: TimeInterval = motionFocus');
```

**Pattern 4: Build System Validation**

Tests that validate token generation need updating for semantic "none" tokens:

```typescript
// BEFORE (Doesn't expect semantic "none" tokens)
const semanticTokens = ['space.inset.tight', 'space.inset.normal'];

// AFTER (Includes semantic "none" tokens)
const semanticTokens = ['space.inset.none', 'space.inset.tight', 'space.inset.normal'];
```

### Evergreen Prevention Testing

**Focus**: Ensure audit script catches future violations

**Test Coverage**:
- Hard-coded colors (all platforms)
- Hard-coded spacing (all platforms)
- Hard-coded motion (all platforms)
- Fallback patterns (all platforms)
- Documentation contamination

---

## Design Decisions

### Decision 1: Phase-Based Execution

**Options Considered**:
1. Fix all TypeScript errors first, then cleanup, then tests
2. Fix component-by-component (all issues per component)
3. Fix by violation type (all colors, then all spacing, etc.)

**Decision**: Phase-based execution (TypeScript → Cleanup → Tests)

**Rationale**:
TypeScript compilation errors block the build, preventing any testing or verification. Fixing these first unblocks all other work. Component cleanup follows the priority matrix from Spec 017's cleanup plan, tackling quick wins first to build momentum. Test updates come last because they depend on component cleanup being complete.

**Trade-offs**:
- ✅ **Gained**: Clear progress milestones, unblock work early, build momentum
- ❌ **Lost**: Some context switching between phases
- ⚠️ **Risk**: Later phases might reveal issues in earlier phases

**Counter-Arguments**:
- **Argument**: "Component-by-component would maintain better context"
- **Response**: Phase-based approach unblocks the build faster and allows parallel work on different components once TypeScript errors are fixed

### Decision 2: Legacy File Handling

**Options Considered**:
1. Always update legacy files to token-first approach
2. Always delete legacy files
3. Evaluate each legacy file individually

**Decision**: Evaluate individually with clear decision criteria

**Rationale**:
TextInputField.browser.ts may be deprecated, but we need to verify before deleting. If it's actively used, updating it is necessary. If it's truly legacy, deleting it prevents future maintenance burden. The evaluation criteria (check imports and usage) provides objective decision-making.

**Trade-offs**:
- ✅ **Gained**: Avoid unnecessary work on deprecated code, clear decision criteria
- ❌ **Lost**: Slight delay while evaluating file status
- ⚠️ **Risk**: File might be partially used, requiring careful migration

**Counter-Arguments**:
- **Argument**: "Just update all files to be safe"
- **Response**: Updating deprecated files wastes effort and creates maintenance burden for code that should be deleted

### Decision 3: Performance Test Handling

**Options Considered**:
1. Optimize performance tests to meet timeouts
2. Increase timeout limits
3. Document performance issues for future optimization
4. Skip performance tests in this spec

**Decision**: Document performance issues, defer optimization to future spec

**Rationale**:
Performance test timeouts (release analysis tests taking >5 seconds) are a separate concern from token compliance. Optimizing performance requires different expertise and could expand scope significantly. Documenting the issues allows focused work in a future performance optimization spec.

**Trade-offs**:
- ✅ **Gained**: Keep scope focused, avoid scope creep, enable specialized optimization work
- ❌ **Lost**: Performance tests continue to timeout during this spec
- ⚠️ **Risk**: Performance issues might worsen if not addressed soon

**Counter-Arguments**:
- **Argument**: "We should fix all test failures in this spec"
- **Response**: Performance optimization is a distinct problem requiring different approach. Documenting issues enables focused optimization work without derailing token compliance cleanup.

### Decision 4: Token Unit Consistency Investigation Priority

**Options Considered**:
1. Continue with remaining cleanup tasks and investigate later
2. Pause cleanup work and investigate token unit consistency now
3. Create separate spec for token generation investigation

**Decision**: Pause cleanup work and investigate token unit consistency now

**Rationale**:
During Task 3.2 (Icon Android preview cleanup), a critical architectural inconsistency was discovered: icon size tokens are generated WITH units (`val icon_size_100 = 24.dp`) while spacing tokens are generated WITHOUT units (`const val space_200: Float = 16f`). This creates inconsistent usage patterns across the codebase (`DesignTokens.icon_size_100` vs `DesignTokens.space_200.dp`).

Continuing cleanup work without understanding this inconsistency risks:
- **Compounding Technical Debt**: Every component updated with inconsistent patterns makes future standardization harder
- **Developer Confusion**: Inconsistent patterns create cognitive load and increase error rates
- **Maintenance Burden**: Having to remember "icon tokens include units, spacing tokens don't" is unsustainable
- **Cross-Platform Implications**: If Android has this issue, iOS and Web may have similar inconsistencies

The investigation should complete before continuing with Phase 2C (TextInputField), 2D (Container), and Phase 3 (Test Updates) to ensure cleanup work follows a consistent, standardized approach.

**Trade-offs**:
- ✅ **Gained**: Prevent building on inconsistent foundation, inform all remaining cleanup work, reduce future refactoring cost
- ❌ **Lost**: Slight delay in completing remaining cleanup tasks
- ⚠️ **Risk**: Investigation might reveal larger architectural issues requiring separate spec

**Counter-Arguments**:
- **Argument**: "We should finish cleanup first, then investigate"
- **Response**: The risk of spreading inconsistent patterns through remaining cleanup work (TextInputField, Container, tests) outweighs the delay. Investigation is relatively quick (2-4 hours) and prevents compounding technical debt.

### Decision 5: Container Android TokenMapping Complexity

**Options Considered**:
1. Replace all 44 violations in one task
2. Break into subtasks by token type (borders, radius, elevation, colors)
3. Create helper functions to reduce duplication

**Decision**: Break into subtasks by token type

**Rationale**:
Container Android TokenMapping has 44 violations, making it the highest-risk cleanup task. Breaking it into subtasks (borders, radius, elevation, colors) allows incremental progress with verification at each step. This reduces risk of breaking token mapping for all Container instances.

**Trade-offs**:
- ✅ **Gained**: Incremental progress, reduced risk, easier debugging
- ❌ **Lost**: More task overhead, longer overall timeline
- ⚠️ **Risk**: Subtasks might have dependencies requiring careful sequencing

**Counter-Arguments**:
- **Argument**: "One task would be faster"
- **Response**: The risk of breaking Container token mapping for all instances justifies the incremental approach. Thorough testing at each step prevents cascading failures.

---

## Implementation Plan Summary

### Phase 1: Critical Fixes (2-3 hours)

**Goal**: Unblock build and enable testing

**Tasks**:
1. Fix ButtonCTA icon size TypeScript error
2. Verify build succeeds
3. Run quick smoke tests

**Success Criteria**: `npm run build` succeeds without errors

### Phase 2: Component Cleanup (10-15 hours)

**Goal**: Achieve 100% token compliance across all components

**Tasks**:
1. ButtonCTA web (1 violation) - 15 min
2. Icon web tests (2 violations) - 30 min
3. TextInputField.browser.ts evaluation (13 violations) - 1 hour
4. Icon Android documentation (32 violations) - 2-3 hours
5. TextInputField remaining (23 violations) - 2-3 hours
6. Container web (3 violations) - 1 hour
7. Container Android TokenMapping (44 violations) - 4-5 hours

**Success Criteria**: Audit script reports zero violations

### Phase 3: Test Updates (4-6 hours)

**Goal**: All tests pass with current token system

**Tasks**:
1. Update token count expectations (space000, semantic "none" tokens)
2. Fix integration test compilation (ButtonCTA/Icon TypeScript errors)
3. Update cross-platform consistency tests (TextInputField motion token references)
4. Update touch target sizing tests (tapAreaRecommended token expectations)
5. Update token compliance tests (iOS Color() pattern detection)
6. Update build system integration tests (semantic token validation)
7. Document performance test issues (defer optimization)

**Success Criteria**: `npm test` passes (excluding documented performance issues)

### Phase 4: Verification (1 hour)

**Goal**: Confirm 100% token compliance and zero test failures

**Tasks**:
1. Run full test suite
2. Run audit script
3. Verify zero violations
4. Update component READMEs if needed

**Success Criteria**: Zero violations, all tests pass

---

## Related Documentation

- [Spec 017 Completion Summary](../../017-component-code-quality-sweep/completion-summary.md) - Lessons learned and follow-up recommendations
- [Spec 017 Cleanup Plan](../../017-component-code-quality-sweep/cleanup-plan.md) - Detailed violation breakdown and cleanup strategy
- [Component Development Guide](../../../.kiro/steering/Component%20Development%20Guide.md) - Token-first development patterns and anti-patterns

---

**Organization**: spec-design
**Scope**: 019-test-failures-and-cleanup
