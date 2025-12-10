# Design Document: Component Code Quality Sweep

**Date**: December 9, 2025
**Spec**: 017 - Component Code Quality Sweep
**Status**: Design Phase
**Dependencies**: None

---

## Overview

This design document outlines the systematic approach to replacing hard-coded values with design tokens across all existing components. The design focuses on creating a repeatable audit process, platform-specific token replacement patterns, and validation strategies that ensure refactoring doesn't break component behavior.

The approach prioritizes failing loudly when tokens are missing rather than masking issues with fallback values, ensuring the token system remains robust and issues are caught immediately during development.

---

## Architecture

### Audit System Architecture

```
Component Code Quality Sweep
├── Audit Process
│   ├── File Scanner (identifies components to audit)
│   ├── Violation Detector (finds hard-coded values)
│   ├── Token Matcher (suggests token replacements)
│   └── Report Generator (creates prioritized violation list)
├── Token Replacement Patterns
│   ├── Web Platform (CSS custom properties)
│   ├── iOS Platform (Swift constants)
│   └── Android Platform (Kotlin constants)
├── Validation Strategy
│   ├── Existing Test Suite (validates behavior unchanged)
│   ├── Visual Review (documents intentional changes)
│   └── Token Compliance Check (verifies 100% token usage)
└── Documentation Updates
    ├── Component READMEs (document token usage)
    ├── Component Development Guide (anti-patterns section)
    └── Completion Summary (lessons learned)
```

### Audit Process Flow

```
1. Scan Components
   ↓
2. Detect Violations (categorize by type)
   ↓
3. Prioritize by Impact
   ↓
4. Generate Replacement Suggestions
   ↓
5. Create Audit Report
```

### Token Replacement Flow

```
1. Review Violation
   ↓
2. Identify Appropriate Token (semantic → primitive)
   ↓
3. Replace Hard-Coded Value
   ↓
4. Remove Fallback Pattern (if present)
   ↓
5. Run Existing Tests
   ↓
6. Visual Review (if needed)
   ↓
7. Document Token Usage
```

---

## Components and Interfaces

### Audit Report Structure

```typescript
/**
 * Audit report structure
 */
interface AuditReport {
  // Summary statistics
  summary: {
    totalComponents: number;
    totalViolations: number;
    violationsByType: {
      color: number;
      spacing: number;
      motion: number;
      typography: number;
    };
    violationsByPriority: {
      high: number;    // Colors, spacing
      medium: number;  // Motion
      low: number;     // Edge cases
    };
  };
  
  // Violations by component
  components: ComponentViolations[];
}

/**
 * Component violations structure
 */
interface ComponentViolations {
  componentName: string;
  platform: 'web' | 'ios' | 'android';
  filePath: string;
  violations: Violation[];
}

/**
 * Individual violation structure
 */
interface Violation {
  type: 'color' | 'spacing' | 'motion' | 'typography';
  priority: 'high' | 'medium' | 'low';
  lineNumber: number;
  currentValue: string;
  suggestedToken: string;
  context: string;  // Surrounding code for context
  isFallbackPattern: boolean;  // True if using || fallback
}
```

### Token Replacement Patterns

```typescript
/**
 * Token replacement pattern structure
 */
interface TokenReplacementPattern {
  platform: 'web' | 'ios' | 'android';
  violationType: 'color' | 'spacing' | 'motion' | 'typography';
  pattern: {
    search: RegExp;
    replace: string;
    example: {
      before: string;
      after: string;
    };
  };
}
```

---

## Token Replacement Patterns by Platform

### Web Platform (CSS Custom Properties)

#### Color Replacement

**Pattern**: Replace RGB/hex values with CSS custom properties

```typescript
// Before: Hard-coded RGB
color: rgb(59, 130, 246);
background: #3B82F6;

// After: CSS custom property
color: var(--color-primary);
background: var(--color-primary);
```

**Fallback Anti-Pattern Removal**:

```typescript
// Before: Fallback pattern (ANTI-PATTERN)
const duration = this.getAttribute('duration') || '250ms';
const spacing = this.getAttribute('spacing') || 8;

// After: Fail loudly when token missing
const duration = this.getAttribute('duration');
if (!duration) {
  throw new Error('TextInputField: duration attribute is required');
}

const spacing = this.getAttribute('spacing');
if (!spacing) {
  console.error('TextInputField: spacing attribute is required');
  // Component renders with missing spacing, making issue visible
}
```

#### Spacing Replacement

**Pattern**: Replace hard-coded pixel values with spacing tokens

```typescript
// Before: Hard-coded spacing
padding: 8px;
margin: 16px;
gap: 4px;

// After: Spacing tokens
padding: var(--space-inset-100);
margin: var(--space-separated-200);
gap: var(--space-grouped-tight);
```

#### Motion Replacement

**Pattern**: Replace hard-coded durations with motion tokens

```typescript
// Before: Hard-coded duration
transition: all 250ms ease-out;
animation-duration: 0.25s;

// After: Motion tokens
transition: all var(--motion-float-label-duration) var(--motion-float-label-easing);
animation-duration: var(--motion-float-label-duration);
```

**Fallback Anti-Pattern Removal**:

```typescript
// Before: Fallback pattern (ANTI-PATTERN)
private getAnimationDuration(): number {
  const durationStr = getComputedStyle(this.element)
    .getPropertyValue('--motion-float-label-duration').trim();
  
  if (durationStr) {
    return parseFloat(durationStr);
  }
  
  return 250; // Fallback to hard-coded value
}

// After: Fail loudly when token missing
private getAnimationDuration(): number {
  const durationStr = getComputedStyle(this.element)
    .getPropertyValue('--motion-float-label-duration').trim();
  
  if (!durationStr) {
    console.error('TextInputField: --motion-float-label-duration token not found');
    throw new Error('Required motion token missing: --motion-float-label-duration');
  }
  
  return parseFloat(durationStr);
}
```

#### Typography Replacement

**Pattern**: Replace hard-coded font properties with typography tokens

```typescript
// Before: Hard-coded typography
font-size: 16px;
line-height: 24px;
font-weight: 500;

// After: Typography tokens
font-size: var(--typography-body-md-font-size);
line-height: var(--typography-body-md-line-height);
font-weight: var(--typography-body-md-font-weight);

// Or use shorthand if available
font: var(--typography-body-md);
```

### iOS Platform (Swift Constants)

#### Color Replacement

**Pattern**: Replace Color(red:green:blue:) with semantic color tokens

```swift
// Before: Hard-coded RGB
Color(red: 59/255, green: 130/255, blue: 246/255)
Color(red: 0.231, green: 0.510, blue: 0.965)

// After: Semantic color token
colorPrimary
```

**Token Hierarchy**:

```swift
// Prefer semantic tokens
colorPrimary           // ✅ Best choice
colorTextDefault       // ✅ Best choice

// Use primitives only when semantic doesn't exist
blue500                // ⚠️ Document why semantic doesn't exist
```

#### Spacing Replacement

**Pattern**: Replace hard-coded CGFloat values with spacing tokens

```swift
// Before: Hard-coded spacing
.padding(.horizontal, 8)
.padding(.vertical, 16)
.frame(minHeight: 44)

// After: Spacing tokens
.padding(.horizontal, spaceInset100)
.padding(.vertical, spaceInset200)
.frame(minHeight: tapAreaRecommended)
```

#### Motion Replacement

**Pattern**: Replace hard-coded TimeInterval values with motion tokens

```swift
// Before: Hard-coded duration
.animation(.easeOut(duration: 0.25), value: isFloated)
withAnimation(.easeInOut(duration: 0.15)) { }

// After: Motion tokens
.animation(.easeOut(duration: motionFloatLabelDuration), value: isFloated)
withAnimation(.easeInOut(duration: motionFocusDuration)) { }
```

#### Typography Replacement

**Pattern**: Replace hard-coded Font.system() calls with typography tokens

```swift
// Before: Hard-coded typography
Font.system(size: 16, weight: .regular)
Font.system(size: 14, weight: .medium)

// After: Typography tokens
Font.system(size: typographyBodyMdFontSize)
    .weight(typographyBodyMdFontWeight)
Font.system(size: typographyLabelMdFontSize)
    .weight(typographyLabelMdFontWeight)
```

### Android Platform (Kotlin Constants)

#### Color Replacement

**Pattern**: Replace Color(0xRRGGBB) with semantic color tokens

```kotlin
// Before: Hard-coded hex
Color(0xFF3B82F6)
Color(0xFFEF4444)

// After: Semantic color token
colorPrimary
colorError
```

#### Spacing Replacement

**Pattern**: Replace hard-coded .dp values with spacing tokens

```kotlin
// Before: Hard-coded spacing
.padding(horizontal = 8.dp, vertical = 16.dp)
.size(24.dp)

// After: Spacing tokens
.padding(horizontal = spaceInset100.dp, vertical = spaceInset200.dp)
.size(iconSize100.dp)
```

#### Motion Replacement

**Pattern**: Replace hard-coded animation specs with motion tokens

```kotlin
// Before: Hard-coded duration
animateFloatAsState(
    targetValue = if (isFloated) 1f else 0f,
    animationSpec = tween(durationMillis = 250)
)

// After: Motion tokens
animateFloatAsState(
    targetValue = if (isFloated) 1f else 0f,
    animationSpec = tween(durationMillis = motionFloatLabelDuration)
)
```

#### Typography Replacement

**Pattern**: Replace hard-coded TextStyle with typography tokens

```kotlin
// Before: Hard-coded typography
TextStyle(
    fontSize = 16.sp,
    lineHeight = 24.sp,
    fontWeight = FontWeight.Normal
)

// After: Typography tokens
typographyBodyMd
```

---

## Fallback Pattern Removal Strategy

### Identifying Fallback Patterns

**Common fallback patterns to remove**:

```typescript
// Pattern 1: OR operator with hard-coded value
const value = tokenValue || 250;
const spacing = getAttribute('spacing') || 8;

// Pattern 2: Ternary with hard-coded fallback
const duration = tokenValue ? tokenValue : '250ms';

// Pattern 3: Nullish coalescing with hard-coded fallback
const padding = tokenValue ?? 16;

// Pattern 4: Default parameter with hard-coded value
function animate(duration = 250) { }
```

### Replacement Strategy

**Replace fallbacks with explicit error handling**:

```typescript
// Before: Silent fallback (ANTI-PATTERN)
const duration = this.getAttribute('duration') || '250ms';

// After: Fail loudly (CORRECT)
const duration = this.getAttribute('duration');
if (!duration) {
  throw new Error('Component: duration attribute is required');
}

// Or for non-critical values
const duration = this.getAttribute('duration');
if (!duration) {
  console.error('Component: duration attribute missing, animation will not work');
}
```

**When fallback is genuinely optional**:

```typescript
// Before: Unclear if optional
const helperText = this.getAttribute('helper-text') || '';

// After: Explicit optional handling
const helperText = this.getAttribute('helper-text') || undefined;
if (helperText !== undefined) {
  // Render helper text
}

// Document why it's optional
/**
 * Helper text (optional)
 * Provides additional context below the input
 */
```

---

## Validation Strategy

### Existing Test Suite Validation

**Approach**: Rely on existing component tests to validate refactoring doesn't break behavior

**Process**:
1. Run existing test suite before token replacement
2. Replace hard-coded values with tokens
3. Run existing test suite after token replacement
4. Compare results - all tests should still pass
5. If tests fail, investigate and fix (either token replacement or test update needed)

**Rationale**: Existing tests already validate component behavior. If token replacement breaks tests, either:
- Token replacement was incorrect (fix the replacement)
- Test was testing implementation details (update test to test behavior)

### Visual Review Process

**When visual review is needed**:
- Color changes (semantic token may differ from hard-coded value)
- Spacing changes (token may differ from hard-coded value)
- Typography changes (token may differ from hard-coded value)

**Process**:
1. Take screenshot before token replacement
2. Replace tokens
3. Take screenshot after token replacement
4. Compare screenshots
5. Document intentional changes
6. Get design approval if changes are significant

**Rationale**: Some token replacements may result in intentional visual changes (e.g., hard-coded value was incorrect, token is correct). These changes should be documented and approved.

### Token Compliance Check

**Final validation**: Verify 100% token compliance after all replacements

**Process**:
1. Re-run audit script on updated components
2. Verify zero violations reported
3. Manually review any edge cases
4. Document any legitimate exceptions (with rationale)

**Rationale**: Final audit ensures no hard-coded values remain and all components use tokens consistently.

---

## Component Development Guide Updates

### Anti-Patterns Section Addition

**New section**: "Anti-Pattern: Hard-Coded Fallback Values"

**Content**:

```markdown
### ❌ Hard-Coded Fallback Values

**Problem**: Using fallback values masks token system issues and prevents early detection of problems.

**Anti-Pattern Examples**:

```typescript
// DON'T: Silent fallback to hard-coded value
const duration = this.getAttribute('duration') || '250ms';
const spacing = tokenValue || 8;
const color = getToken('color.primary') ?? '#3B82F6';
```

**Why This is Wrong**:
- Masks missing tokens - component appears to work but token system is broken
- Prevents early detection - issues discovered in production instead of development
- Inconsistent behavior - some components use tokens, others use fallbacks
- Maintenance burden - fallback values can drift from token values

**Correct Approach**:

```typescript
// DO: Fail loudly when token is missing
const duration = this.getAttribute('duration');
if (!duration) {
  throw new Error('Component: duration attribute is required');
}

// Or for non-critical values
const spacing = tokenValue;
if (!spacing) {
  console.error('Component: spacing token missing, layout may be incorrect');
}
```

**When Fallback is Genuinely Optional**:

```typescript
// DO: Explicit optional handling with documentation
/**
 * Helper text (optional)
 * Provides additional context below the input
 */
const helperText = this.getAttribute('helper-text') || undefined;
if (helperText !== undefined) {
  // Render helper text
}
```

**Benefits of Failing Loudly**:
- ✅ Immediate detection of token system issues
- ✅ Clear error messages guide developers to fix
- ✅ Prevents silent failures in production
- ✅ Maintains token system integrity
```

---

## Testing Strategy

### Three-Tier Testing Approach

This cleanup effort uses three types of tests, each serving a distinct purpose:

#### 1. Cleanup-Specific Tests (Temporary)

**Purpose**: Provide immediate feedback during cleanup process

**Lifecycle**: Created during cleanup, deleted after cleanup complete

**Rationale**:
- Immediate validation that token replacements work correctly
- Faster feedback loop than running full component test suite
- Focused on specific violations being fixed
- Deleted as part of the spec to avoid maintenance burden

**Example - Cleanup-Specific Test**:

```typescript
/**
 * TEMPORARY TEST - Delete after cleanup complete
 * Validates ButtonCTA iOS color token replacements
 */
describe('ButtonCTA iOS - Color Token Cleanup', () => {
  it('should use colorPrimary instead of Color(red:green:blue:)', () => {
    const file = 'src/components/core/ButtonCTA/platforms/ios/ButtonCTA.ios.swift';
    const content = readFileSync(file, 'utf-8');
    
    // Verify no hard-coded Color(red:green:blue:) patterns
    expect(content).not.toMatch(/Color\(red:\s*\d+/);
    
    // Verify colorPrimary token is used
    expect(content).toMatch(/colorPrimary/);
  });
  
  it('should use colorTextDefault instead of hard-coded white', () => {
    const file = 'src/components/core/ButtonCTA/platforms/ios/ButtonCTA.ios.swift';
    const content = readFileSync(file, 'utf-8');
    
    // Verify colorTextDefault token is used
    expect(content).toMatch(/colorTextDefault/);
  });
});
```

**When to Delete**: After all ButtonCTA iOS color violations are fixed and verified

#### 2. Evergreen Prevention Tests (Permanent)

**Purpose**: Prevent future violations across all components

**Lifecycle**: Created during cleanup, kept permanently

**Rationale**:
- Scans all components to catch new violations
- Remains valuable after cleanup is complete
- Prevents regression to hard-coded values
- Low maintenance burden (runs automatically)

**Example - Evergreen Prevention Test**:

```typescript
/**
 * PERMANENT TEST - Prevents future hard-coded value violations
 * Scans all components for common anti-patterns
 */
describe('Token Compliance - All Components', () => {
  it('should not contain hard-coded RGB color values', () => {
    const componentFiles = getComponentFiles();
    
    componentFiles.forEach(file => {
      const content = readFileSync(file, 'utf-8');
      
      // Check for Color(red:green:blue:) pattern (iOS)
      expect(content).not.toMatch(/Color\(red:\s*\d+/);
      
      // Check for Color(0xRRGGBB) pattern (Android)
      expect(content).not.toMatch(/Color\(0x[0-9A-F]{6,8}\)/);
      
      // Check for rgb() pattern (Web)
      expect(content).not.toMatch(/rgb\(\s*\d+/);
    });
  });
  
  it('should not contain hard-coded fallback patterns', () => {
    const componentFiles = getComponentFiles();
    
    componentFiles.forEach(file => {
      const content = readFileSync(file, 'utf-8');
      
      // Check for || fallback with hard-coded number
      expect(content).not.toMatch(/\|\|\s*\d+(?!\.)/);
      
      // Check for || fallback with hard-coded string
      expect(content).not.toMatch(/\|\|\s*['"`]\d+/);
    });
  });
});
```

**When to Keep**: Permanently - runs with every test suite execution

#### 3. Existing Component Tests (Permanent)

**Purpose**: Validate component behavior unchanged after token replacement

**Lifecycle**: Already exist, continue running

**Rationale**:
- Existing tests already validate component behavior
- If token replacement breaks tests, either:
  - Token replacement was incorrect (fix the replacement)
  - Test was testing implementation details (update test to test behavior)
- No new tests needed - existing coverage is sufficient

**Process**:
1. Run existing test suite before token replacement
2. Replace hard-coded values with tokens
3. Run existing test suite after token replacement
4. Compare results - all tests should still pass
5. If tests fail, investigate and fix

### Testing Workflow

```
1. Create Cleanup-Specific Tests
   ↓
2. Replace Hard-Coded Values
   ↓
3. Run Cleanup-Specific Tests (immediate feedback)
   ↓
4. Run Existing Component Tests (behavior validation)
   ↓
5. Fix Any Failures
   ↓
6. Delete Cleanup-Specific Tests (after cleanup complete)
   ↓
7. Evergreen Prevention Tests Continue Running (permanent)
```

### Benefits of This Approach

**Cleanup-Specific Tests**:
- ✅ Fast feedback during cleanup process
- ✅ Focused validation of specific violations
- ✅ Easier debugging when replacements fail
- ✅ Deleted after cleanup to avoid maintenance burden

**Evergreen Prevention Tests**:
- ✅ Prevent future violations across all components
- ✅ Catch regressions immediately
- ✅ Low maintenance burden (automated scanning)
- ✅ Long-term value after cleanup complete

**Existing Component Tests**:
- ✅ Validate behavior unchanged
- ✅ Already exist (no additional work)
- ✅ Comprehensive coverage of component functionality

---

## Design Decisions

### Decision 1: Fail Loudly vs Silent Fallbacks

**Options Considered**:
1. Keep fallback values for graceful degradation
2. Remove fallbacks and fail loudly when tokens missing
3. Hybrid approach (fallbacks for optional, fail for required)

**Decision**: Remove fallbacks and fail loudly (Option 2)

**Rationale**:
- **Early Detection**: Failing loudly catches token system issues immediately during development
- **Clear Errors**: Error messages guide developers to fix the root cause
- **System Integrity**: Ensures token system is working correctly, not masked by fallbacks
- **Consistency**: All components behave the same way when tokens are missing

**Trade-offs**:
- ✅ **Gained**: Immediate issue detection, clear error messages, system integrity
- ❌ **Lost**: Graceful degradation (but this was masking real issues)
- ⚠️ **Risk**: More errors during development (but this is the goal - catch issues early)

**Counter-Arguments**:
- **Argument**: "Fallbacks provide graceful degradation for users"
- **Response**: Fallbacks mask token system issues. Better to fail during development than silently fail in production with inconsistent styling.

- **Argument**: "Failing loudly will break components during development"
- **Response**: Yes, and that's the point. We want to know immediately when tokens are missing so we can fix the token system, not mask the issue with fallbacks.

### Decision 2: Audit Script vs Manual Review

**Options Considered**:
1. Fully automated audit script with auto-replacement
2. Manual review of all components
3. Audit script for detection, manual replacement

**Decision**: Audit script for detection, manual replacement (Option 3)

**Rationale**:
- **Safety**: Manual replacement allows review of each change
- **Context**: Humans can determine appropriate token (semantic vs primitive)
- **Edge Cases**: Manual review catches edge cases automated script might miss
- **Learning**: Manual process builds understanding of token system

**Trade-offs**:
- ✅ **Gained**: Safety, context-aware decisions, edge case handling
- ❌ **Lost**: Speed of automation
- ⚠️ **Risk**: Human error during manual replacement (mitigated by existing tests)

**Counter-Arguments**:
- **Argument**: "Automated replacement would be faster"
- **Response**: Speed isn't the goal - correctness is. Manual replacement ensures each change is appropriate and reviewed.

### Decision 3: Three-Tier Testing Strategy

**Options Considered**:
1. Only rely on existing component tests
2. Create cleanup-specific tests and keep them permanently
3. Create cleanup-specific tests and delete them after cleanup
4. Only create evergreen prevention tests

**Decision**: Three-tier approach - cleanup-specific (temporary) + evergreen prevention (permanent) + existing tests (Option 3 + 4 + 1)

**Rationale**:
- **Cleanup-Specific Tests**: Provide immediate feedback during cleanup, then deleted to avoid maintenance burden
- **Evergreen Prevention Tests**: Prevent future violations, remain valuable long-term
- **Existing Tests**: Already validate component behavior, no additional work needed
- **Fast Feedback**: Cleanup-specific tests catch issues immediately during replacement
- **Long-Term Value**: Evergreen tests prevent regression after cleanup complete

**Trade-offs**:
- ✅ **Gained**: Fast feedback during cleanup, long-term prevention, no permanent maintenance burden for cleanup tests
- ❌ **Lost**: Simplicity of single test approach
- ⚠️ **Risk**: Need to remember to delete cleanup-specific tests (mitigated by including deletion in spec tasks)

**Counter-Arguments**:
- **Argument**: "Creating temporary tests that will be deleted is wasteful"
- **Response**: The immediate feedback during cleanup is valuable and speeds up the process. Deleting them after cleanup avoids long-term maintenance burden. The value during cleanup justifies the temporary nature.

- **Argument**: "Existing tests should be sufficient for validation"
- **Response**: Existing tests validate behavior, but cleanup-specific tests validate the specific token replacements we're making. They provide faster, more focused feedback than running the full component test suite.

---

## Integration Points

### Component Development Guide

**Integration**: Add "Anti-Pattern: Hard-Coded Fallback Values" section

**Purpose**: Prevent future violations by documenting anti-pattern

**Location**: `.kiro/steering/Component Development Guide.md` - Anti-Patterns section

### Component READMEs

**Integration**: Update each component README with token usage documentation

**Purpose**: Document which tokens each component uses

**Format**:

```markdown
## Token Consumption

This component uses the following design tokens:

### Color Tokens
- `color.primary` - Primary button background
- `color.text.default` - Button text color
- `color.border` - Secondary button border

### Spacing Tokens
- `space.inset.normal` - Button padding (horizontal)
- `space.inset.tight` - Button padding (vertical)

### Typography Tokens
- `typography.buttonMd` - Button text style

### Motion Tokens
- `motion.press` - Button press animation
```

### Audit Script

**Integration**: Create audit script that can be run periodically

**Purpose**: Verify token compliance and detect future violations

**Location**: `scripts/audit-component-tokens.js`

**Usage**:

```bash
# Run audit on all components
npm run audit:tokens

# Run audit on specific component
npm run audit:tokens -- ButtonCTA

# Generate detailed report
npm run audit:tokens -- --detailed
```

---

## Lessons Learned (Anticipated)

### What We Expect to Learn

1. **Common Violation Patterns**: Which types of hard-coded values are most common
2. **Token Gaps**: Which tokens are missing from the system
3. **Platform Differences**: How token usage differs across web/iOS/Android
4. **Fallback Prevalence**: How widespread the fallback anti-pattern is
5. **Test Coverage**: Which components have good test coverage vs gaps

### How We'll Capture Learnings

- Document in completion summary after cleanup
- Update Component Development Guide with new anti-patterns discovered
- Propose new semantic tokens if patterns emerge
- Identify test coverage gaps and address

---

*This design document provides the architecture and patterns needed to systematically replace hard-coded values with design tokens across all components while maintaining component behavior and preventing future violations.*
