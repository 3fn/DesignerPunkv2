# Design Document: Test Failure Fixes

**Date**: December 27, 2025
**Spec**: 030 - Test Failure Fixes
**Status**: Design Phase
**Dependencies**: 029-test-failure-audit (complete)

---

## Overview

This design document describes the implementation approach for fixing 40 failing tests identified in Spec 029 (Test Failure Audit). The fixes are organized into five phases based on risk level and dependency order, following the scientific method principle of changing one variable at a time.

The implementation strategy prioritizes:
1. **Quick wins first** - Test-only changes with no code risk
2. **Code fixes second** - Actual code changes identified by tests
3. **Expectation adjustments third** - Updating thresholds and expectations
4. **Investigation-dependent fixes fourth** - Fixes requiring prior investigation
5. **Final verification** - Ensuring all tests pass with no regressions

---

## Architecture

### Fix Categories

The 40 failing tests fall into five distinct fix categories:

```
┌─────────────────────────────────────────────────────────────────┐
│                    Test Failure Fix Categories                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Fix Test    │  │  Fix Code    │  │ Adjust Expectations  │  │
│  │  (18 tests)  │  │  (10 tests)  │  │     (13 tests)       │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│                                                                  │
│  ┌──────────────────────┐  ┌─────────────────────────────────┐  │
│  │ Adjust Test Config   │  │      Investigate + Fix          │  │
│  │     (3 tests)        │  │         (6 tests)               │  │
│  └──────────────────────┘  └─────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Implementation Phases

```
Phase 1: Quick Wins          Phase 2: Code Fixes
┌─────────────────────┐      ┌─────────────────────┐
│ • Icon token tests  │      │ • Icon CSS variable │
│ • Token structure   │  →   │ • Remove fallbacks  │
│ • Regex improvements│      │ • Remove .dp suffix │
│   (23 tests)        │      │   (17 tests)        │
└─────────────────────┘      └─────────────────────┘
           │                            │
           ▼                            ▼
Phase 3: Expectations        Phase 4: Investigation
┌─────────────────────┐      ┌─────────────────────┐
│ • LineHeight formula│      │ • Performance config│
│ • Release timeouts  │  →   │ • Cross-platform    │
│ • QuickAnalyzer     │      │   registry          │
│   (14 tests)        │      │   (9 tests)         │
└─────────────────────┘      └─────────────────────┘
           │                            │
           └──────────┬─────────────────┘
                      ▼
              Phase 5: Verification
              ┌─────────────────────┐
              │ • Full test suite   │
              │ • Regression check  │
              │ • Exit code 0       │
              └─────────────────────┘
```

---

## Components and Interfaces

### Component 1: Icon Token Test Fixes

**Files Affected**:
- `src/tokens/__tests__/IconTokenGeneration.test.ts`
- Related icon token test files

**Changes**:
- Exclude `icon.strokeWidth` from size validation (it's a fixed value, not size-based)
- Update icon/token structure expectations to match generated output

**Interface**: No interface changes - test-only modifications

---

### Component 2: Icon Component CSS Variable

**Files Affected**:
- `src/components/Icon/Icon.tsx` (or equivalent)
- `src/tokens/IconTokens.css` (or equivalent stylesheet)

**Changes**:
- Replace hard-coded `stroke-width="2"` with `var(--icon-stroke-width)`
- Define `--icon-stroke-width` CSS variable in token stylesheet

**Interface**:
```css
/* Token stylesheet addition */
:root {
  --icon-stroke-width: 2;
}
```

---

### Component 3: Token Compliance Fixes

**Files Affected**:
- `src/__tests__/TokenCompliance.test.ts`
- Android source files with `.dp` suffix violations
- Files with `|| 24` fallback patterns

**Changes**:
- Remove `|| 24` fallback patterns (fail loudly philosophy)
- Remove `.dp` suffix from Android token references
- Improve regex patterns for iOS, Android, and Web compliance tests

**Regex Improvements**:
```typescript
// iOS: Exclude DesignTokens. references
const iosRegex = /(?<!DesignTokens\.)\b\d+(\.\d+)?\b/g;

// Android: Allow 0.dp as valid literal
const androidRegex = /(?<!0)\.\s*dp\b/g;

// Web: Exclude CSS comments
const webRegex = /(?<!\/\*[\s\S]*?)\b\d+px\b(?![\s\S]*?\*\/)/g;
```

---

### Component 4: Token Structure Test Updates

**Files Affected**:
- `src/tokens/__tests__/SemanticBorderWidthTokens.test.ts`
- `src/tokens/__tests__/PrimitiveTokens.test.ts`
- `src/tokens/__tests__/LineHeightTokens.test.ts`

**Changes**:
- Update border width token expectations to match current implementation
- Update primitive token count from 24 to 26
- Update lineHeight expectations to match formula outputs

---

### Component 5: Cross-Platform Consistency Registry

**Files Affected**:
- `src/__tests__/CrossPlatformConsistency.test.ts`
- New file: `src/__tests__/fixtures/acknowledged-differences.json`

**Changes**:
- Create acknowledged differences registry
- Update tests to reference registry
- Document each authorized platform-specific affordance

**Registry Structure**:
```json
{
  "acknowledgedDifferences": [
    {
      "token": "example.token",
      "platforms": ["ios", "android"],
      "difference": "iOS uses CGFloat, Android uses Float",
      "rationale": "Platform-native type requirements",
      "authorizedBy": "Peter Michaels Allen",
      "date": "2025-12-27"
    }
  ]
}
```

---

### Component 6: Performance Test Configuration

**Files Affected**:
- `src/__tests__/PerformanceValidation.test.ts`
- `package.json` (if isolation approach)

**Changes** (Option A - Preferred):
- Add npm script for isolated performance test execution
- Document environment sensitivity in test file

**Changes** (Option B - Alternative):
- Increase thresholds: Statistics 30ms, State Export 15ms, Large Scale 15ms
- Document justification in test file

---

### Component 7: Timeout Threshold Adjustments

**Files Affected**:
- `src/__tests__/ReleaseAnalysis.test.ts`
- `src/__tests__/QuickAnalyzer.test.ts`

**Changes**:
- Quick analysis: 10000ms → 12000ms (20% increase)
- skipDetailedExtraction: 20000ms → 25000ms (25% increase)
- Pipeline persistence: 15000ms → 20000ms (33% increase)
- QuickAnalyzer: 10000ms → 12000ms (20% increase)

**Documentation**: Add comments explaining repository growth justification

---

## Data Models

### Acknowledged Differences Registry Schema

```typescript
interface AcknowledgedDifference {
  token: string;           // Token path (e.g., "spacing.inset.100")
  platforms: Platform[];   // Affected platforms
  difference: string;      // Description of the difference
  rationale: string;       // Why this difference is intentional
  authorizedBy: string;    // Who approved this difference
  date: string;            // When it was authorized (ISO 8601)
}

interface AcknowledgedDifferencesRegistry {
  version: string;
  lastUpdated: string;
  acknowledgedDifferences: AcknowledgedDifference[];
}

type Platform = 'web' | 'ios' | 'android';
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Icon CSS Variable Usage

*For any* Icon component rendered, the stroke-width attribute SHALL use `var(--icon-stroke-width)` CSS variable instead of a hard-coded value.

**Validates: Requirements 2.1**

---

### Property 2: Token Resolution Without Fallbacks

*For any* token reference in the codebase, the reference SHALL either resolve to a valid token value OR fail loudly with a clear error. No silent fallback patterns (like `|| 24`) SHALL exist.

**Validates: Requirements 3.1, 3.2**

---

### Property 3: Android Token Reference Format

*For any* Android code file referencing design tokens, the token references SHALL NOT include `.dp` suffix. Unit conversion is handled at build time by the generator.

**Validates: Requirements 4.1, 4.2**

---

### Property 4: LineHeight Formula Consistency

*For any* lineHeight token test expectation, the expected value SHALL match the output of the mathematical formula. Legacy hardcoded values SHALL be replaced with formula-derived values.

**Validates: Requirements 5.1, 5.2**

---

### Property 5: iOS Regex Semantic Token Exclusion

*For any* iOS code line containing `DesignTokens.` references, the token compliance regex SHALL NOT flag it as a violation. Semantic token references are valid usage.

**Validates: Requirements 8.1, 8.2**

---

### Property 6: Web CSS Comment Handling

*For any* CSS content evaluated by the web token compliance test, values within CSS comment blocks SHALL be excluded from violation detection, AND actual violations outside comments SHALL still be detected.

**Validates: Requirements 10.1, 10.2**

---

### Property 7: Cross-Platform Registry Enforcement

*For any* platform difference detected by the cross-platform consistency test, the test SHALL pass if and only if the difference is documented in the acknowledged differences registry. Undocumented differences SHALL cause test failure.

**Validates: Requirements 11.2, 11.3**

---

### Property 8: Regression Prevention

*For any* test that passed before the fixes in this spec are applied, that test SHALL continue to pass after all fixes are applied. No regressions SHALL be introduced.

**Validates: Requirements 15.2, 15.3**

---

## Error Handling

### Fix Application Errors

| Error Scenario | Handling Strategy |
|----------------|-------------------|
| Regex change creates false negatives | Test against known violations before committing |
| Code fix introduces new failures | Run full test suite after each code change |
| Threshold too aggressive | Start with conservative increases, adjust if needed |
| Registry missing authorized difference | Add to registry with proper documentation |

### Rollback Strategy

Each phase can be rolled back independently:
1. **Phase 1**: Revert test file changes only
2. **Phase 2**: Revert code changes, tests will fail again (expected)
3. **Phase 3**: Revert threshold changes
4. **Phase 4**: Revert registry and configuration changes
5. **Phase 5**: N/A (verification only)

---

## Testing Strategy

### Dual Testing Approach

This spec uses both unit tests and property-based verification:

**Unit Tests** (existing):
- The 40 failing tests themselves serve as unit tests
- Each fix is validated by the test(s) it addresses
- Regression tests ensure previously passing tests continue to pass

**Property Tests** (verification):
- Properties 1-8 can be verified through code analysis and test execution
- Property 8 (regression) is verified by comparing test counts before/after

### Test Execution Strategy

```bash
# Phase 1-4: After each task group
npm test -- --testPathPattern="<affected-test-file>"

# Phase 5: Final verification
npm test                    # Full suite, exit code 0 expected
npm run test:all           # Including performance tests
```

### Verification Checkpoints

| Checkpoint | Command | Expected Result |
|------------|---------|-----------------|
| After Phase 1 | `npm test` | ~23 fewer failures |
| After Phase 2 | `npm test` | ~17 fewer failures |
| After Phase 3 | `npm test` | ~14 fewer failures |
| After Phase 4 | `npm test` | ~9 fewer failures |
| After Phase 5 | `npm test` | 0 failures, exit code 0 |

---

## Design Decisions

### Decision 1: Scientific Method Approach

**Options**:
- A) Apply all fixes at once
- B) Apply fixes one at a time, verify after each

**Decision**: B - One change at a time

**Rationale**: "If you change two variables, you can't identify what change caused the resulting behavior." This approach isolates the effect of each fix and makes debugging easier if issues arise.

---

### Decision 2: Fail Loudly Philosophy

**Options**:
- A) Keep fallback patterns with documentation
- B) Remove fallbacks, fail loudly on missing tokens

**Decision**: B - Remove fallbacks

**Rationale**: At this stage of development, fallbacks mask problems. We want issues to surface early so they can be fixed properly. Fallbacks can be reconsidered for production hardening later.

---

### Decision 3: Performance Test Isolation vs Thresholds

**Options**:
- A) Run performance tests in isolation via separate npm script
- B) Increase thresholds to account for full-suite overhead

**Decision**: A (Preferred) with B as fallback

**Rationale**: P13 investigation confirmed the issue is test environment interference, not code degradation. Isolation provides accurate measurements. Threshold increases are acceptable if isolation proves impractical.

---

### Decision 4: Cross-Platform Differences Registry

**Options**:
- A) Force all platforms to be identical
- B) Create registry of acknowledged differences

**Decision**: B - Acknowledged differences registry

**Rationale**: Platform-specific affordances are expected and intentional. A registry documents which differences are authorized, making the test behavior explicit and maintainable.

---

## Reference Documents

- `findings/test-failure-audit-findings.md` - Complete failure catalog
- `findings/test-failure-confirmed-actions.md` - Human-confirmed actions
- `findings/p9-performance-investigation.md` - Performance investigation report
- `.kiro/specs/029-test-failure-audit/design.md` - Audit methodology
- `.kiro/specs/030-test-failure-fixes/requirements.md` - Requirements document

---

**Status**: Design Complete - Ready for Tasks Phase
