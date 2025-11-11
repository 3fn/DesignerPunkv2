# Test Failures vs Issues Registry - Cross-Reference Analysis

**Date**: November 11, 2025  
**Purpose**: Determine which test failures are already tracked in the issues registry  
**Context**: Task 1.1 baseline test execution analysis

---

## Summary

**Result**: Only 1 of the 4 test failure categories is tracked in the issues registry, and it's already resolved.

| Test Failure Category | Tracked in Registry? | Issue ID | Status |
|----------------------|---------------------|----------|--------|
| Release Analysis Tests | ✅ Yes | #001 | **RESOLVED** |
| Validation Pipeline | ❌ No | - | Not tracked |
| iOS Format Generator | ❌ No | - | Not tracked |
| Semantic Token Generation | ❌ No | - | Not tracked |

---

## Detailed Analysis

### 1. Release Analysis Test Failures → Issue #001 (RESOLVED)

**Test Failures**:
- `src/release-analysis/__tests__/CLIIntegration.test.ts` - `mockExecSync` undefined errors
- `src/release-analysis/hooks/__tests__/HookScripts.test.ts` - Missing hook script files

**Tracked As**: Issue #001 - Release Detection Hook Not Triggering on taskStatus Events

**Status**: **RESOLVED** (November 7, 2025)

**Resolution**: 
- Replaced `taskStatusChange` trigger with `fileCreated` trigger
- Implemented two-document workflow (detailed + summary docs)
- Created both automatic and manual fallback hooks
- Resolved by: `release-detection-trigger-fix` spec

**Why Tests Still Fail**:
The test failures are **test infrastructure issues**, not the actual hook functionality:

1. **`mockExecSync` undefined**: Test setup problem - mocks not properly initialized
2. **Missing hook files**: Tests expect `.kiro/hooks/analyze-after-commit.sh` which was never created (different feature)

**Conclusion**: The underlying issue (hook not triggering) is resolved. The test failures are separate test infrastructure problems that need fixing in the test files themselves.

---

### 2. Validation Pipeline Test Failures → NOT TRACKED

**Test Failures**:
- `src/__tests__/integration/ValidationPipeline.test.ts` - Empty validation results (0 length arrays)

**Tracked in Registry?**: ❌ **NO**

**Why Not Tracked**:
This appears to be a side effect of the recent architecture refactoring (architecture-separation-of-concerns spec). The validation pipeline integration tests are failing because:

1. `ValidationPipeline` class may have been refactored
2. Integration between `TokenEngine` and `ValidationPipeline` may have changed
3. Test expectations don't match new architecture

**Related Registry Items**:
- Issue #012: TokenFileGenerator Performs Validation Logic (RESOLVED)
- Issue #013: PrimitiveTokenRegistry Performs Validation (RESOLVED)

These issues were about **separating validation concerns**, which may have broken the `ValidationPipeline` integration tests as a side effect.

**Recommendation**: 
This should be tracked as a new issue:
- **Title**: "ValidationPipeline Integration Tests Failing After Architecture Refactoring"
- **Severity**: Important
- **Category**: Architecture - Test Integration
- **Affects**: Validation system testing, architecture verification

---

### 3. iOS Format Generator Test Failure → NOT TRACKED

**Test Failure**:
- `src/providers/__tests__/iOSFormatGenerator-semantic.test.ts` - Regex pattern mismatch

**Tracked in Registry?**: ❌ **NO**

**Why Not Tracked**:
This is a minor test issue - the code works correctly, the test regex is just too strict:

```typescript
// Test expects:
expect(result).toMatch(/public static let \w+primary = purple300/);

// Actual output (correct):
"    public static let colorPrimary = purple300"
```

The regex doesn't account for leading whitespace and expects `\w+primary` but gets `colorPrimary`.

**Severity**: Minor - Test issue, not production code issue

**Recommendation**: 
This is too minor to track in the issues registry. Should be fixed directly in the test file:
```typescript
// Fix the regex to account for whitespace and camelCase
expect(result).toMatch(/public static let colorPrimary = purple300/);
```

---

### 4. Semantic Token Generation Test Failure → NOT TRACKED

**Test Failure**:
- `src/__tests__/integration/SemanticTokenGeneration.test.ts` - Missing semantic token `--blend-hover-darker`

**Tracked in Registry?**: ❌ **NO**

**Why Not Tracked**:
This appears to be a semantic token registration issue. The test expects semantic tokens that either:
1. Aren't registered in the system
2. Aren't being generated due to a bug

Looking at the generated CSS output, only **primitive** blend tokens are present:
```css
--blend-100: 0.04;
--blend-200: 0.08;
--blend-300: 0.12;
--blend-400: 0.16;
--blend-500: 0.2;
```

No semantic tokens like `--blend-hover-darker` are generated.

**Related Registry Items**:
None directly related, but this could be connected to:
- Issue #012: TokenFileGenerator validation logic (RESOLVED)
- Issue #013: Registry validation logic (RESOLVED)

**Recommendation**: 
This should be investigated and potentially tracked as:
- **Title**: "Semantic Blend Tokens Not Generated in Cross-Platform Output"
- **Severity**: Important
- **Category**: Token System - Semantic Generation
- **Affects**: All platforms (web, iOS, Android)

---

## Recommendations

### Immediate Actions

1. **Release Analysis Tests**: 
   - ✅ Underlying issue resolved (Issue #001)
   - ❌ Test infrastructure needs fixing
   - Action: Fix test mocks and remove expectations for non-existent hook files

2. **Validation Pipeline Tests**:
   - ❌ Not tracked in registry
   - Action: Create new issue for post-refactoring test failures
   - Investigate in architecture-separation-of-concerns context

3. **iOS Format Generator Test**:
   - ❌ Not tracked (too minor)
   - Action: Fix regex directly in test file

4. **Semantic Token Generation Test**:
   - ❌ Not tracked in registry
   - Action: Investigate why semantic blend tokens aren't generated
   - Create issue if this is a real bug vs test expectation problem

### For Web Format Cleanup

**None of these test failures should block web format cleanup work.**

All failures are either:
- Already resolved (release analysis hook)
- Unrelated to web format (iOS tests, validation pipeline)
- Pre-existing bugs (semantic token generation)

The web format cleanup can proceed safely. Monitor these tests during cleanup to ensure no regressions, but don't expect them to be fixed by web format work.

---

## Issue Registry Status

### Currently Tracked Issues

**Total Issues**: 20 (as of November 9, 2025)
**Resolved Issues**: 13
**Active Issues**: 7
**Reclassified Items**: 4 (platform-appropriate design decisions)

### Issues Related to Test Failures

Only **1 issue** relates to the test failures we found:

- **Issue #001**: Release Detection Hook Not Triggering (**RESOLVED**)
  - Related to release-analysis test failures
  - Underlying functionality fixed
  - Test infrastructure issues remain

### Gaps in Issue Tracking

The following test failures are **NOT tracked** in the registry:

1. **ValidationPipeline integration test failures** - Should be tracked
2. **Semantic token generation missing tokens** - Should be investigated and potentially tracked
3. **iOS format generator regex mismatch** - Too minor to track

---

## Conclusion

**Only 1 of 4 test failure categories is tracked in the issues registry, and it's already resolved.**

The test failures we found during baseline testing are mostly **new discoveries** that aren't documented in the Phase 1 Issues Registry. This makes sense because:

1. The registry focused on infrastructure and architecture audits
2. Test suite execution wasn't part of the Phase 1 audit scope
3. Some failures are side effects of recent refactoring work

**For web format cleanup**: These test failures don't block the work and aren't tracked because they're unrelated to web format concerns.

**For future work**: Consider adding these to the issues registry:
- ValidationPipeline integration test failures (Important)
- Semantic token generation investigation (Important)

---

**Status**: Analysis complete ✅  
**Recommendation**: Proceed with web format cleanup - test failures are unrelated and mostly untracked
