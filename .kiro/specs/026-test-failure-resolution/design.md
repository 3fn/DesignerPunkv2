# Design Document: Test Failure Resolution

**Date**: 2025-12-20
**Spec**: 026 - Test Failure Resolution
**Status**: Design Phase
**Dependencies**: 025-test-suite-overhaul

---

## Overview

This spec systematically resolves the 24 failing test suites (45 failing tests) remaining after Spec 025 (Test Suite Overhaul). The approach follows the successful 025 audit-first pattern: comprehensive audit before any code changes, pattern-based findings documentation, human confirmation checkpoint, and systematic implementation with regression prevention.

### Problem Context

After Spec 025 successfully reorganized test structure and established performance baselines, 24 test suites with 45 failing tests remain. These failures represent technical debt that blocks CI/CD confidence, obscures real regressions, and prevents feature development.

### Solution Approach

**Audit-First Methodology**: Systematic review of all failures before any implementation, grouping by root cause pattern rather than test file, with human confirmation before executing fixes.

**Regression Prevention**: Establish failure baseline before fixes, track unique failure instances (not counts), compare after each fix category, block completion if new failures introduced.

**Sequential Fixes**: Fix one root cause category at a time with verification between each to isolate issues and prevent cascading failures.

---

## Architecture

### Three-Phase Workflow

```
┌─────────────────────────────────────────┐
│  PHASE 1: AUDIT                         │
│  (No Code Changes)                      │
│                                         │
│  1. Run npm test, capture output       │
│  2. Catalog all 45 failing tests        │
│  3. Group by root cause pattern         │
│  4. Document failure signatures         │
│  5. Assess: test vs code issue          │
│  6. Create findings document            │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  PHASE 2: CONFIRMATION                  │
│  (Human Review)                         │
│                                         │
│  1. Present findings to Peter           │
│  2. Review recommendations              │
│  3. Discuss questions/concerns          │
│  4. Confirm actions                     │
│  5. Create confirmed actions doc        │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  PHASE 3: IMPLEMENTATION                │
│  (Execute Confirmed Actions)            │
│                                         │
│  1. Capture baseline                    │
│  2. Fix one category                    │
│  3. Run tests, verify no regressions    │
│  4. Document fix                        │
│  5. Repeat for next category            │
│  6. Final verification                  │
└─────────────────────────────────────────┘
```

### Failure Pattern Structure

**Pattern-Based Grouping**: Multiple test files may share single root cause. Group by underlying issue, not by test file location.

**Initial Observations** (to be validated during audit):
- Environment configuration issues (HTMLElement not defined)
- Type safety issues (undefined property access)
- Cross-platform consistency (token generation differences)
- Performance/timing issues (test timeouts, git operations)
- Cache/state issues (validation failures)

**Note**: Audit phase will refine and validate these patterns. No premature solutions.

---

## Components and Interfaces

### Audit Phase Components

#### Test Output Capture
```typescript
interface TestOutput {
  timestamp: string;
  totalSuites: number;
  failingSuites: number;
  totalTests: number;
  failingTests: number;
  rawOutput: string;
}

function captureTestOutput(): TestOutput {
  // Run npm test and capture complete output
  // Parse summary statistics
  // Store raw output for analysis
}
```

#### Failure Cataloger
```typescript
interface FailureInstance {
  testFile: string;
  testName: string;
  errorType: string;
  errorMessage: string;
  stackTrace: string;
  sourceFile?: string;
  sourceLine?: number;
}

function catalogFailures(output: TestOutput): FailureInstance[] {
  // Parse test output for each failure
  // Extract test file, test name, error details
  // Capture stack trace for context
}
```

#### Pattern Analyzer
```typescript
interface FailurePattern {
  patternId: string;
  patternName: string;
  rootCause: string;
  affectedTests: FailureInstance[];
  testCount: number;
  recommendation: RecommendationType;
  rationale: string;
  impact: string;
}

type RecommendationType = 
  | 'Fix Test'
  | 'Fix Code'
  | 'Fix Environment'
  | 'Adjust Expectations'
  | 'Investigate';

function analyzePatterns(failures: FailureInstance[]): FailurePattern[] {
  // Group failures by error type + message similarity
  // Identify shared root causes
  // Assess impact (how many tests affected)
  // Generate recommendations with rationale
}
```

#### Failure Signature Generator
```typescript
interface FailureSignature {
  testFile: string;
  errorType: string;
  errorMessage: string; // Normalized (no line numbers)
  sourceFile?: string;
}

function generateSignature(failure: FailureInstance): FailureSignature {
  // Extract stable identifiers
  // Normalize error message (strip line numbers)
  // Create comparable signature
}

function compareSignatures(
  baseline: FailureSignature[],
  current: FailureSignature[]
): ComparisonResult {
  // Identify same failures (in both)
  // Identify resolved failures (in baseline, not current)
  // Identify new failures (in current, not baseline)
}
```

### Findings Document Components

#### Findings Document Structure
```markdown
# Test Failure Audit Findings

**Date**: [Audit Date]
**Spec**: 026 - Test Failure Resolution
**Total Failures**: 45 tests in 24 suites

## Executive Summary

[High-level overview of findings]

## Failure Patterns

### Pattern 1: [Pattern Name]

**Root Cause**: [Underlying issue]

**Affected Tests**: [Count] tests in [Count] suites

**Recommendation**: [Fix Test | Fix Code | Fix Environment | Adjust | Investigate]

**Rationale**: [Why this recommendation]

**Impact**: [What happens if we fix this]

**Examples**:
- Test file: [path]
  Error: [error message]
  
- Test file: [path]
  Error: [error message]

**Failure Signatures**:
```
[Normalized signatures for baseline]
```

[Repeat for each pattern]

## Summary Table

| Pattern | Tests Affected | Recommendation | Priority |
|---------|---------------|----------------|----------|
| Pattern 1 | N tests | Fix Environment | High |
| Pattern 2 | N tests | Fix Test | Medium |
| ... | ... | ... | ... |

## Baseline Signatures

[Complete list of unique failure signatures for comparison]
```

### Confirmation Phase Components

#### Confirmed Actions Document
```markdown
# Test Failure Confirmed Actions

**Date**: [Confirmation Date]
**Spec**: 026 - Test Failure Resolution
**Reviewed By**: Peter
**Status**: Confirmed

## Confirmed Fix Categories

### Category 1: [Pattern Name]

**Action**: [Confirmed action to take]

**Priority**: [High | Medium | Low]

**Expected Impact**: [Tests that should pass]

**Special Considerations**: [Any notes from review]

[Repeat for each confirmed category]

## Implementation Order

1. [Category name] - [Rationale for order]
2. [Category name] - [Rationale for order]
...

## Deferred Items

[Any patterns deferred to future work]
```

### Implementation Phase Components

#### Baseline Capture
```typescript
interface Baseline {
  timestamp: string;
  uniqueFailures: FailureSignature[];
  failureCount: number;
  testOutput: TestOutput;
}

function captureBaseline(): Baseline {
  // Run npm test
  // Extract unique failure signatures
  // Store for comparison
}
```

#### Regression Detector
```typescript
interface ComparisonResult {
  sameFailures: FailureSignature[];
  resolvedFailures: FailureSignature[];
  newFailures: FailureSignature[];
  regressionDetected: boolean;
}

function detectRegressions(
  baseline: Baseline,
  current: TestOutput
): ComparisonResult {
  // Extract current failure signatures
  // Compare against baseline
  // Identify new failures (regressions)
  // Report results
}
```

---

## Data Models

### Failure Instance
```typescript
interface FailureInstance {
  // Test identification
  testFile: string;           // "Container.web.test.ts"
  testName: string;           // "should render with children"
  
  // Error details
  errorType: string;          // "ReferenceError"
  errorMessage: string;       // "HTMLElement is not defined"
  stackTrace: string;         // Full stack trace
  
  // Source location (if different from test file)
  sourceFile?: string;        // "Icon.web.ts"
  sourceLine?: number;        // 212
  
  // Metadata
  timestamp: string;
  testSuite: string;
}
```

### Failure Pattern
```typescript
interface FailurePattern {
  // Pattern identification
  patternId: string;          // "pattern-1-htmlelement"
  patternName: string;        // "HTMLElement Environment"
  
  // Root cause analysis
  rootCause: string;          // "Jest environment not providing HTMLElement"
  category: PatternCategory;  // Environment | TypeSafety | Logic | Performance
  
  // Affected tests
  affectedTests: FailureInstance[];
  testCount: number;
  suiteCount: number;
  
  // Recommendation
  recommendation: RecommendationType;
  rationale: string;
  impact: string;
  priority: 'High' | 'Medium' | 'Low';
  
  // Baseline tracking
  signatures: FailureSignature[];
}

type PatternCategory = 
  | 'Environment'
  | 'TypeSafety'
  | 'Logic'
  | 'Performance'
  | 'State';
```

### Failure Signature
```typescript
interface FailureSignature {
  // Stable identifiers (for comparison)
  testFile: string;
  errorType: string;
  errorMessage: string;       // Normalized (no line numbers)
  sourceFile?: string;
  
  // Comparison helpers
  signatureHash: string;      // Hash for quick comparison
  normalizedMessage: string;  // Whitespace normalized
}
```

### Baseline
```typescript
interface Baseline {
  // Metadata
  timestamp: string;
  specId: string;
  phase: string;              // "pre-fixes" | "post-category-1" | etc
  
  // Failure data
  uniqueFailures: FailureSignature[];
  failureCount: number;
  suiteCount: number;
  
  // Raw data
  testOutput: TestOutput;
  
  // Comparison results (if comparing)
  comparisonResult?: ComparisonResult;
}
```

---

## Error Handling

### Audit Phase Errors

**Test Execution Failure**:
- If npm test fails to run: Document error, cannot proceed
- If test output unparseable: Manual review required
- If no failures found: Verify test suite actually ran

**Pattern Analysis Errors**:
- If unable to group failures: Document as individual patterns
- If root cause unclear: Mark as "Investigate" recommendation
- If conflicting patterns: Flag for human review

### Implementation Phase Errors

**Baseline Capture Failure**:
- If baseline cannot be captured: Block implementation
- If baseline signatures invalid: Re-capture baseline
- If baseline file corrupted: Regenerate from test output

**Regression Detection**:
- If new failures detected: Block task completion
- If comparison fails: Manual review of test output
- If flaky tests suspected: Run tests multiple times (2-3)

**Fix Application Errors**:
- If fix causes new failures: Revert fix, investigate
- If fix doesn't resolve failures: Re-evaluate recommendation
- If fix breaks other tests: Revert, adjust approach

---

## Testing Strategy

### Audit Phase Validation

**Test Output Capture**:
- Verify npm test runs successfully
- Verify output captured completely
- Verify statistics parsed correctly

**Failure Cataloging**:
- Verify all 45 failures cataloged
- Verify test file paths correct
- Verify error messages captured

**Pattern Analysis**:
- Verify failures grouped logically
- Verify root causes identified
- Verify recommendations reasonable

### Implementation Phase Validation

**Baseline Comparison**:
- Verify baseline captures unique signatures
- Verify comparison detects same failures
- Verify comparison detects new failures
- Verify comparison detects resolved failures

**Fix Verification**:
- Run npm test after each fix category
- Verify expected tests now pass
- Verify no new failures introduced
- Verify baseline comparison passes

**Final Verification**:
- Run npm test for complete suite
- Verify 0 failing test suites
- Verify 0 failing tests
- Verify all 246 test suites pass
- Verify all 5555+ tests pass

---

## Design Decisions

### Decision 1: Audit-First, No Code Changes Until Confirmation

**Rationale**: Mirrors successful Spec 025 pattern. Prevents wasted effort fixing wrong things. Distinguishes test issues from real bugs. Enables informed decisions based on full landscape.

**Trade-offs**:
- **Pro**: Comprehensive understanding before implementation
- **Pro**: Human confirmation prevents wrong fixes
- **Pro**: Identifies patterns across multiple failures
- **Con**: Requires time investment in audit phase
- **Con**: Delays implementation until audit complete

**Decision**: Accept time investment for better outcomes. Audit is faster than blind fixing.

### Decision 2: Pattern-Based Grouping Over File-Based

**Rationale**: Multiple test files may share single root cause. Example: 8 test suites fail with "HTMLElement is not defined" (1 root cause). Fixing root cause resolves multiple failures efficiently.

**Trade-offs**:
- **Pro**: Clear understanding of actual problem count
- **Pro**: Efficient fix strategy (one fix → multiple tests pass)
- **Pro**: Better estimation of effort required
- **Con**: Requires analysis to identify patterns
- **Con**: May miss file-specific issues

**Decision**: Pattern-based grouping provides better ROI. File-specific issues will surface during implementation.

### Decision 3: Regression Prevention Through Baseline Comparison

**Rationale**: Prevents introducing new failures during fixes. Catches unintended side effects immediately. Provides clear completion criteria.

**Trade-offs**:
- **Pro**: Immediate regression detection
- **Pro**: Clear pass/fail criteria
- **Pro**: Builds confidence in fixes
- **Con**: Adds ~20 minutes per parent task (baseline + comparison)
- **Con**: Requires baseline management

**Decision**: Time investment justified by regression prevention. Faster than debugging regressions after the fact.

### Decision 4: Unique Instances Over Failure Counts

**Rationale**: Failure counts misleading (fixing one root cause might resolve 10 test failures). Unique instances represent actual problems to solve.

**Trade-offs**:
- **Pro**: Accurate problem count
- **Pro**: Clear success criteria (zero unique instances)
- **Pro**: Prevents false sense of progress
- **Con**: Requires signature normalization
- **Con**: More complex tracking

**Decision**: Accuracy more important than simplicity. Unique instances provide true measure of progress.

### Decision 5: Sequential Fix Approach

**Rationale**: Fix one category at a time with verification between each. Smaller blast radius. Easier to isolate issues. Learn patterns from earlier fixes.

**Trade-offs**:
- **Pro**: Smaller test runs = faster feedback
- **Pro**: Easier to isolate issues
- **Pro**: Less cognitive load
- **Con**: Takes longer than parallel fixes
- **Con**: May discover dependencies between categories

**Decision**: Sequential approach reduces risk. Can adjust if dependencies discovered.

### Decision 6: Nuanced Recommendations Over Binary

**Rationale**: Not all failures are "fix test" or "delete test". Some need environment fixes, some reveal code bugs, some need adjusted expectations.

**Trade-offs**:
- **Pro**: More accurate recommendations
- **Pro**: Avoids binary "good vs bad" thinking
- **Pro**: Provides clear action for each pattern
- **Con**: Requires more analysis
- **Con**: More options to consider

**Decision**: Nuanced recommendations lead to better outcomes. Worth the analysis effort.

---

## Implementation Plan

### Phase 1: Audit (No Code Changes)

**Duration**: ~2-4 hours

**Steps**:
1. Run `npm test` and capture complete output
2. Catalog all 45 failing tests with details
3. Group failures by pattern (error type + message similarity)
4. Identify root cause for each pattern
5. Generate recommendations with rationale
6. Document failure signatures for baseline
7. Create findings document

**Deliverable**: `findings/test-failure-audit-findings.md`

**Success Criteria**:
- All 45 failures cataloged
- Failures grouped by root cause pattern
- Recommendations provided for each pattern
- Rationale documented for each recommendation
- Baseline signatures documented

### Phase 2: Confirmation (Human Review)

**Duration**: ~1-2 hours

**Steps**:
1. Present findings document to Peter
2. Review each pattern and recommendation
3. Discuss questions or concerns
4. Confirm which actions to take
5. Establish priority order
6. Create confirmed actions document

**Deliverable**: `findings/test-failure-confirmed-actions.md`

**Success Criteria**:
- All patterns reviewed
- Actions confirmed
- Priority order established
- Special considerations noted

### Phase 3: Implementation (Execute Confirmed Actions)

**Duration**: ~4-8 hours (depends on fix complexity)

**Steps**:
1. **Capture Baseline**:
   - Run `npm test` and save output
   - Extract unique failure signatures
   - Document baseline

2. **For Each Confirmed Category** (in priority order):
   - Implement confirmed fix
   - Document what was changed and why
   - Run `npm test`
   - Extract current failure signatures
   - Compare against baseline
   - If new failures: investigate and fix regression
   - If no new failures: document fix and proceed

3. **Final Verification**:
   - Run `npm test` for complete suite
   - Verify 0 failing test suites
   - Verify 0 failing tests
   - Verify baseline comparison shows zero unique instances
   - Document resolution approach

**Deliverables**:
- Fixed tests/code/environment
- Baseline comparison results
- Fix documentation for each category
- Final verification report

**Success Criteria**:
- All confirmed actions executed
- All tests passing (0 failures)
- No new failures introduced
- Root causes documented
- Solutions documented

---

## Success Criteria

### Audit Phase Success
- ✅ All 45 failing tests cataloged
- ✅ Failures grouped by root cause pattern
- ✅ Findings document created with recommendations
- ✅ Baseline failure signatures documented
- ✅ Human confirmation received

### Implementation Phase Success
- ✅ All confirmed actions executed
- ✅ All tests passing (0 failures)
- ✅ No new failures introduced (baseline comparison)
- ✅ Root causes documented
- ✅ Solutions documented
- ✅ Lessons learned captured

### Overall Success
- ✅ 24 test suites passing (up from 0)
- ✅ 45 tests passing (up from 0)
- ✅ 246 total test suites passing
- ✅ 5555+ total tests passing
- ✅ Zero unique failure instances
- ✅ Regression prevention workflow validated
- ✅ Clear reference for future test failure resolution

---

## Lessons Learned from Initial Implementation (Tasks 1-3)

### What Worked Well

**1. Audit-First Methodology**
- Successfully identified and grouped 45 failures into 5 patterns
- Pattern-based analysis revealed shared root causes
- Human confirmation prevented premature fixes
- **Outcome**: Fixed 41 of 45 original failures (91% success rate)

**2. Sequential Fix Approach**
- Fixing one category at a time made issues easier to isolate
- Smaller blast radius when problems occurred
- Clear progress tracking through completion documents
- **Outcome**: Successfully fixed Patterns 1, 2, 3, and 5 completely

**3. Comprehensive Documentation**
- Detailed completion documents captured root causes and solutions
- Clear audit trail of what was changed and why
- Valuable reference for future test failure resolution
- **Outcome**: Well-documented resolution patterns for reuse

### What Didn't Work

**1. Insufficient Regression Prevention**
- **Problem**: Introduced 19 new failures while fixing original 45
- **Root Cause**: Didn't run full test suite after each fix category
- **Impact**: Regression only discovered in final verification
- **Lesson**: Targeted test runs insufficient for regression detection

**2. Incomplete Baseline Comparison**
- **Problem**: No automated comparison between subtasks
- **Root Cause**: Relied on manual verification instead of systematic comparison
- **Impact**: New failures went undetected until final verification
- **Lesson**: Need automated baseline comparison after every fix

**3. Test Environment Assumptions**
- **Problem**: Changes to Jest config affected unrelated tests
- **Root Cause**: Didn't verify test environment consistency
- **Impact**: TextInputField tests broke due to missing motion tokens
- **Lesson**: Test environment changes have cascading effects

### Critical Improvements for Phase 2 (Tasks 4-6)

**1. Comprehensive Test Execution**
```typescript
// After EVERY fix (not just targeted tests)
interface FixVerification {
  runFullSuite: true;              // Always run complete test suite
  captureOutput: true;             // Save output for comparison
  compareToBaseline: true;         // Automated baseline comparison
  blockOnNewFailures: true;        // Zero tolerance for regressions
}
```

**Rationale**: Targeted test runs miss side effects. Full suite execution catches regressions immediately.

**Implementation**: Run `npm test` (not targeted test files) after each subtask completion.

**2. Automated Regression Detection**
```typescript
interface RegressionDetection {
  baseline: FailureSignature[];    // Captured before fixes
  current: FailureSignature[];     // After each fix
  comparison: ComparisonResult;    // Automated comparison
  
  // Block completion if regression detected
  allowNewFailures: false;
  requireZeroRegressions: true;
}
```

**Rationale**: Manual comparison is error-prone. Automation ensures consistency.

**Implementation**: 
- Capture baseline before any fixes
- Extract signatures after each fix
- Compare automatically
- Block subtask completion if new failures detected

**3. Test Environment Validation**
```typescript
interface EnvironmentValidation {
  // Before fixes
  captureEnvironmentState: {
    jestConfig: string;
    setupFiles: string[];
    globalMocks: string[];
    cssVariables: string[];
  };
  
  // After each fix
  verifyEnvironmentUnchanged: boolean;
  documentEnvironmentChanges: string[];
}
```

**Rationale**: Environment changes have cascading effects. Validation catches issues early.

**Implementation**:
- Document test environment state before fixes
- Verify environment after each fix
- Flag any changes for review
- Test environment changes require full suite verification

**4. Incremental Verification Checkpoints**
```typescript
interface VerificationCheckpoint {
  frequency: 'after-each-subtask';  // Not just at end
  scope: 'full-test-suite';         // Not targeted tests
  comparison: 'automated';          // Not manual
  blocking: true;                   // Block on regression
}
```

**Rationale**: Early detection easier to debug. Waiting until end makes root cause analysis harder.

**Implementation**:
- Add verification checkpoint after each subtask
- Run full test suite at each checkpoint
- Compare against baseline automatically
- Investigate immediately if regression detected

### Improved Regression Prevention Workflow

```
┌─────────────────────────────────────────┐
│  CAPTURE BASELINE                       │
│  - Run npm test (full suite)           │
│  - Extract failure signatures           │
│  - Store for comparison                 │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  FIX ONE CATEGORY                       │
│  - Implement confirmed fix              │
│  - Document changes                     │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  VERIFICATION CHECKPOINT                │
│  - Run npm test (FULL SUITE)           │
│  - Extract current signatures           │
│  - Compare to baseline (AUTOMATED)      │
│  - Check for new failures               │
└─────────────────┬───────────────────────┘
                  │
                  ├─ New failures? ──> BLOCK & INVESTIGATE
                  │                    - Identify which change caused it
                  │                    - Fix regression
                  │                    - Re-run verification
                  │
                  ├─ No new failures? ──> PROCEED
                  │                       - Document fix
                  │                       - Move to next category
                  │
                  ▼
┌─────────────────────────────────────────┐
│  REPEAT FOR NEXT CATEGORY               │
│  (with updated baseline if needed)      │
└─────────────────────────────────────────┘
```

### Specific Improvements for Tasks 4-6

**Task 4: Audit Regression and Remaining Failures**
- Investigate which specific fix introduced TextInputField regression
- Map dependencies between test environment and fixes
- Identify test environment requirements (motion tokens, etc.)
- Document interconnections between test suites

**Task 5: Confirmation Phase**
- Review regression root cause analysis
- Confirm fix approach won't introduce new regressions
- Establish verification checkpoints for each fix
- Define test environment validation criteria

**Task 6: Implementation Phase**
- Run full test suite after EVERY subtask (not just targeted tests)
- Automated baseline comparison after each fix
- Block subtask completion if any new failures detected
- Document test environment state before and after each change
- Zero tolerance for regressions

### Success Metrics for Phase 2

**Process Metrics**:
- ✅ Full test suite run after each subtask
- ✅ Automated baseline comparison after each fix
- ✅ Zero new failures introduced during fixes
- ✅ Test environment validated before and after changes

**Outcome Metrics**:
- ✅ All 23 remaining failures resolved (19 regression + 4 original)
- ✅ Zero failing tests in final verification
- ✅ Zero unique failure instances
- ✅ No regressions introduced during Phase 2

### Documentation Improvements

**Completion Documents**:
- Include test environment state before/after changes
- Document full test suite results (not just targeted tests)
- Include baseline comparison results
- Flag any environment changes made

**Findings Documents**:
- Map dependencies between test suites
- Document test environment requirements
- Identify potential cascading effects
- Note which fixes might affect other tests

---

## References

- **Spec 025 Design Outline**: `.kiro/specs/025-test-suite-overhaul/design-outline.md` - Audit-first pattern
- **Spec 025 Findings**: `findings/release-analysis-audit-findings.md` - Example findings format
- **Test Output**: `test-output-026-audit.txt` - Current failure state
- **Requirements**: `.kiro/specs/026-test-failure-resolution/requirements.md` - User stories and acceptance criteria
- **Task 3.7 Completion**: `.kiro/specs/026-test-failure-resolution/completion/task-3-7-completion.md` - Lessons learned from initial implementation
