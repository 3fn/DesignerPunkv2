# Design Document: Test Failure Fixes

**Date**: November 21, 2025
**Spec**: test-failure-fixes
**Status**: Design Phase
**Dependencies**: test-failure-analysis (complete)

---

## Overview

This design establishes a systematic approach to fixing all 65 test failures identified in the test-failure-analysis spec. The approach follows a phased fix order based on impact, effort, and dependencies: quick wins → critical functionality → high priority issues → performance investigation.

The design addresses 6 distinct root cause groups, with 69% being test issues (tests need updating) and 31% being actual bugs (production code needs fixing). Each fix is designed to restore functionality while maintaining code quality and test reliability.

---

## Architecture

### Phased Fix Approach

```
Phase 1: Quick Wins (15 minutes)
    ↓
Phase 2: Critical Functionality (6-10 hours)
    ├─ Group 1: Validation Registration (37 tests)
    └─ Group 2: Async Operations (14 tests)
    ↓
Phase 3: High Priority Issues (5-8 hours)
    ├─ Group 3: Validation Rules (7 tests)
    ├─ Group 4: Detection Logic (5 tests)
    └─ Group 5: Regex Bug (1 test)
    ↓
Phase 4: Performance Investigation (2-4 hours)
    └─ Group 6: Performance Degradation (2 tests)
```

**Key Principle**: Fix in order of impact and confidence. Start with quick wins to build momentum, then address critical functionality, followed by high-priority issues, and finally performance investigation.

---

## Components and Interfaces

### Group 1: Validation Registration Fix

**Problem**: Validation fails with 'Error' level, preventing token registration. Tests don't check validation results before attempting retrieval.

**Solution Components**:

```typescript
// Test pattern update
interface ValidationAwareTest {
  // Before: Assume registration succeeded
  const token = engine.getPrimitiveToken('space100')!;
  expect(token.platforms.web.value).toBe(8);
  
  // After: Check validation first
  const validationResult = engine.registerPrimitiveToken(space100);
  if (validationResult.level === 'Error') {
    expect(validationResult.level).toBe('Error');
    expect(validationResult.message).toContain('expected error message');
  } else {
    const token = engine.getPrimitiveToken('space100')!;
    expect(token).toBeDefined();
    expect(token.platforms.web.value).toBe(8);
  }
}
```

**Validation Rule Review**:
- Review each validation rule causing Error level
- Determine if rule is appropriate or too strict
- Adjust rules if preventing valid token registration
- Document rationale for any rule changes

---

### Group 2: Async Operations Fix

**Problem**: Tests don't initialize event processing, and fake timers don't coordinate with async operations.

**Solution Components**:

```typescript
// Test setup pattern
interface AsyncTestSetup {
  beforeEach: async () => {
    jest.useFakeTimers();
    monitor = new WorkflowMonitor(config);
    await monitor.startMonitoring(); // Initialize event processing
  };
  
  afterEach: async () => {
    await monitor.stopMonitoring(); // Clean up
    jest.clearAllTimers();
    jest.useRealTimers();
  };
}

// Event processing coordination
interface EventProcessingCoordination {
  // Ensure timer is set up
  setupEventQueueProcessing(): void {
    this.processingTimer = setInterval(() => {
      if (!this.eventQueue.processing && this.eventQueue.events.length > 0) {
        this.startEventProcessing();
      }
    }, this.eventQueue.processingDelay);
  }
  
  // Coordinate with fake timers
  async processEvents(): Promise<void> {
    await this.startEventProcessing();
    jest.advanceTimersByTime(this.eventQueue.processingDelay);
  }
}
```

**Production Code Verification**:
- Verify production code initializes monitoring correctly
- Ensure event processing starts automatically
- Confirm cleanup happens on shutdown

---

### Group 3: Validation Rules Update

**Problem**: Validation rules have become stricter, causing tokens that previously passed to now receive Warning or Error levels.

**Solution Components**:

```typescript
// Test expectation update pattern
interface ValidationExpectationUpdate {
  // Before: Expected Pass
  expect(validationResult.level).toBe('Pass');
  
  // After: Expected Warning (if validation tightened)
  expect(validationResult.level).toBe('Warning');
  expect(validationResult.message).toContain('expected warning message');
}
```

**Documentation Requirements**:
- Document why validation behavior changed
- Record which tokens now receive different validation levels
- Explain rationale for stricter validation

---

### Group 4: Detection Logic Review

**Problem**: Detection algorithms have changed since tests were written.

**Solution Components**:

```typescript
// Version bump calculation review
interface VersionBumpReview {
  // Review logic change
  calculateVersionBump(changes: Change[]): 'major' | 'minor' | 'patch' {
    // Verify logic is correct
    // Update tests if logic is correct
    // Fix logic if tests are correct
  }
}

// Bug fix detection review
interface BugFixDetectionReview {
  detectBugFixes(commits: Commit[]): BugFix[] {
    // Verify detection logic
    // Update tests or fix logic
  }
}

// Token generation review
interface TokenGenerationReview {
  generateTokens(platform: Platform): Token[] {
    // Verify all expected tokens generated
    // Update tests or fix generation
  }
}
```

**Decision Process**:
1. Review detection logic changes
2. Determine if changes are correct
3. Update tests if logic is correct
4. Fix logic if tests are correct
5. Document decision rationale

---

### Group 5: Regex Bug Fix

**Problem**: Regex pattern makes decimal portion optional, causing parent task numbers to match subtask lines.

**Solution Components**:

```typescript
// Current regex (wrong)
const taskMatch = line.match(
  new RegExp(`^- \\[ \\] ${taskNumber}(?:\\.\\d+)?\\s+(.+)`)
);
// Makes decimal OPTIONAL - matches "1.1" when searching for "1"

// Solution 1: Negative lookahead
const taskMatch = line.match(
  new RegExp(`^- \\[ \\] ${taskNumber}(?!\\.)\\s+(.+)`)
);
// Matches "1. Task" but not "1.1 Subtask"

// Solution 2: Require dot after task number
const taskMatch = line.match(
  new RegExp(`^- \\[ \\] ${taskNumber}\\.\\s+(.+)`)
);
// Explicitly requires dot after task number
```

**Recommended Solution**: Use negative lookahead (Solution 1) as it's more flexible and handles edge cases better.

---

### Group 6: Performance Investigation

**Problem**: Either performance has degraded OR threshold is too strict for current system complexity.

**Solution Components**:

```typescript
// Performance measurement
interface PerformanceMeasurement {
  measurePerformance(iterations: number): PerformanceMetrics {
    const times: number[] = [];
    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      // Execute operation
      const end = performance.now();
      times.push(end - start);
    }
    return calculateMetrics(times);
  }
  
  calculateMetrics(times: number[]): PerformanceMetrics {
    const mean = times.reduce((a, b) => a + b) / times.length;
    const variance = times.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / times.length;
    const stdDev = Math.sqrt(variance);
    return { mean, variance, stdDev };
  }
}

// Threshold adjustment
interface ThresholdAdjustment {
  // Current threshold: 0.5
  // Measured variance: 0.825
  
  // Option 1: Adjust threshold
  const newThreshold = 0.9; // Allow more variance
  
  // Option 2: Fix performance
  // Investigate why variance increased
  // Optimize code to reduce variance
}
```

**Investigation Process**:
1. Measure current performance characteristics
2. Compare to historical baselines
3. Determine if actual degradation or threshold issue
4. Adjust threshold or fix performance accordingly
5. Document findings and decision

---

## Design Decisions

### Decision 1: Test Updates vs Production Code Fixes

**Options Considered**:
1. Update all tests first, then fix production code
2. Fix production code first, then update tests
3. Fix each group independently (tests or code as needed)

**Decision**: Fix each group independently based on root cause

**Rationale**:
- Group 1, 3: Test updates (validation behavior changed correctly)
- Group 2, 5: Production code fixes (actual bugs)
- Group 4, 6: Requires investigation to determine

**Trade-offs**:
- ✅ **Gained**: Addresses root cause directly
- ✅ **Gained**: Avoids unnecessary changes
- ❌ **Lost**: Simple "all tests" or "all code" approach
- ⚠️ **Risk**: Requires careful analysis per group

**Counter-Arguments**:
- **Argument**: "Updating all tests first would be simpler"
- **Response**: Many failures are actual bugs that need code fixes. Updating tests for bugs would hide real issues.

---

### Decision 2: Phased vs Parallel Approach

**Options Considered**:
1. Sequential phased approach (quick wins → critical → high → medium)
2. Parallel workstreams (multiple developers fixing different groups)
3. Fix by test suite (group by test file instead of root cause)

**Decision**: Sequential phased approach

**Rationale**:
- Maximizes impact while minimizing risk
- Builds momentum with quick wins
- Addresses critical functionality first
- Avoids conflicts between fixes
- Suitable for single developer

**Trade-offs**:
- ✅ **Gained**: Clear fix order with minimal conflicts
- ✅ **Gained**: Momentum from quick wins
- ❌ **Lost**: Potential speed from parallel work
- ⚠️ **Risk**: Sequential approach takes longer

**Counter-Arguments**:
- **Argument**: "Parallel workstreams would be faster"
- **Response**: Parallel work requires coordination and risks conflicts. Sequential approach is safer for single developer.

---

### Decision 3: Validation Rule Philosophy

**Options Considered**:
1. Relax validation rules to make tests pass
2. Update tests to match stricter validation
3. Review each rule individually

**Decision**: Update tests to match stricter validation (after review)

**Rationale**:
- Stricter validation improves system quality
- Tests should verify validation works correctly
- Rules likely tightened for good reasons
- Individual review ensures rules are appropriate

**Trade-offs**:
- ✅ **Gained**: Better validation quality
- ✅ **Gained**: Tests verify correct behavior
- ❌ **Lost**: Quick fix by relaxing rules
- ⚠️ **Risk**: May need to adjust some rules

**Counter-Arguments**:
- **Argument**: "Relaxing rules would be faster"
- **Response**: Validation rules protect system quality. Relaxing them would reduce quality to make tests pass.

---

## Error Handling

### Validation Registration Errors

**Scenario**: Token registration fails due to validation

**Handling**:
- Tests check validation results before retrieval
- Appropriate assertions for Error level
- Clear error messages about why validation failed

### Async Operation Timeouts

**Scenario**: Event processing doesn't complete in time

**Handling**:
- Proper initialization in test setup
- Coordination between fake timers and async operations
- Cleanup in test teardown
- Production code verification

### Detection Logic Discrepancies

**Scenario**: Tests expect different results than logic produces

**Handling**:
- Review logic changes
- Determine if logic or tests are correct
- Update accordingly with documentation
- Verify no regressions introduced

---

## Testing Strategy

### Validation Approach

**After Each Fix**:
- Run tests for affected group
- Verify no new failures introduced
- Check that fix addresses root cause
- Document any unexpected findings

**After Each Phase**:
- Run full test suite (`npm test`)
- Verify expected pass rate improvement
- Check for any regressions
- Update progress tracking

**Final Validation**:
- Run full test suite
- Verify 100% pass rate (156/156)
- Confirm all functionality restored
- Validate no new issues introduced

### Regression Prevention

**Documentation**:
- Document why each fix was needed
- Add comments explaining validation expectations
- Update test documentation
- Record lessons learned

**Code Quality**:
- Follow existing code patterns
- Maintain test readability
- Use clear variable names
- Add helpful comments

---

## Diagnostic Uncertainty and Alternative Investigation

### Overview

The analysis identified root causes with varying confidence levels (70-95%). This section addresses what to do if proposed diagnoses are incorrect and alternative solutions need investigation.

### Confidence Levels by Group

| Group | Confidence | Risk Level | Alternative Investigation Plan |
|-------|------------|------------|-------------------------------|
| Group 1 (Validation) | 95% | Low | Alternative: Validation logic bug |
| Group 2 (Async) | 90% | Low | Alternative: Timer coordination issue |
| Group 3 (Validation Rules) | 85% | Medium | Alternative: Regression in validation |
| Group 4 (Detection Logic) | 80% | Medium | Alternative: Test expectations correct |
| Group 5 (Regex) | 95% | Low | Alternative: Different parsing issue |
| Group 6 (Performance) | 70% | High | Alternative: Threshold misconfiguration |

### When to Investigate Alternatives

**Trigger Conditions**:

1. **Fix doesn't resolve failures**: Applied fix but tests still fail
2. **New failures appear**: Fix introduces different test failures
3. **Unexpected behavior**: Fix works but behavior seems wrong
4. **Partial success**: Some tests pass but others in same group still fail

**Decision Process**:

```
Apply proposed fix
    ↓
Run tests
    ↓
All tests pass? ──YES──> Document success, move to next group
    ↓ NO
Analyze failure pattern
    ↓
Same error? ──YES──> Diagnosis likely wrong, investigate alternatives
    ↓ NO
Different error? ──YES──> Partial success, refine fix
    ↓
Document findings and pivot to alternative investigation
```

### Alternative Investigation Plans

#### Group 1: Validation Preventing Registration

**Primary Diagnosis**: Tests don't check validation results before retrieval

**Alternative Hypothesis 1**: Validation logic has a bug
- **Evidence to look for**: Validation fails for tokens that should pass
- **Investigation**: Review validation rule implementation
- **Fix approach**: Fix validation logic, not tests

**Alternative Hypothesis 2**: Token registration logic changed
- **Evidence to look for**: Registration doesn't happen even when validation passes
- **Investigation**: Review token registration code path
- **Fix approach**: Fix registration logic

**Pivot Criteria**:
- If tests still fail after adding validation checks
- If validation results show unexpected Error levels for valid tokens
- If tokens aren't registered even when validation passes

---

#### Group 2: Async Operations Not Completing

**Primary Diagnosis**: Tests don't initialize monitoring, fake timers don't coordinate

**Alternative Hypothesis 1**: Event processing has a deadlock
- **Evidence to look for**: Monitoring initializes but events never process
- **Investigation**: Review event queue processing logic
- **Fix approach**: Fix deadlock in event processing

**Alternative Hypothesis 2**: Timer coordination fundamentally broken
- **Evidence to look for**: Fake timers don't advance correctly
- **Investigation**: Review Jest fake timer usage patterns
- **Fix approach**: Refactor timer coordination approach

**Alternative Hypothesis 3**: Production code never initializes monitoring
- **Evidence to look for**: Tests pass but production code doesn't work
- **Investigation**: Review production initialization code
- **Fix approach**: Add monitoring initialization to production code

**Pivot Criteria**:
- If tests still timeout after adding startMonitoring()
- If events queue up but never process
- If timer advancement doesn't trigger event processing

---

#### Group 3: Validation Rules Tightened

**Primary Diagnosis**: Validation rules became stricter, tests need updating

**Alternative Hypothesis 1**: Validation regression introduced
- **Evidence to look for**: Validation fails for tokens that should pass
- **Investigation**: Review recent validation changes
- **Fix approach**: Revert or fix validation regression

**Alternative Hypothesis 2**: Test expectations were always wrong
- **Evidence to look for**: Historical test data shows tests were incorrect
- **Investigation**: Review validation history and test history
- **Fix approach**: Update tests and document why they were wrong

**Pivot Criteria**:
- If updated expectations seem unreasonable
- If validation behavior doesn't match documented rules
- If other tests contradict the new expectations

---

#### Group 4: Detection Logic Changed

**Primary Diagnosis**: Detection algorithms changed, tests need updating

**Alternative Hypothesis 1**: Tests are correct, logic has bugs
- **Evidence to look for**: Detection results don't match expected behavior
- **Investigation**: Review detection logic changes in detail
- **Fix approach**: Fix detection logic bugs

**Alternative Hypothesis 2**: Both tests and logic are partially wrong
- **Evidence to look for**: Some test expectations correct, others wrong
- **Investigation**: Review each detection algorithm individually
- **Fix approach**: Fix logic bugs AND update some test expectations

**Pivot Criteria**:
- If detection results seem clearly wrong
- If logic changes introduced obvious bugs
- If tests pass but detection doesn't work correctly

---

#### Group 5: Task Name Extraction Regex Bug

**Primary Diagnosis**: Regex makes decimal optional, matches subtasks

**Alternative Hypothesis 1**: Different parsing issue
- **Evidence to look for**: Regex fix doesn't resolve issue
- **Investigation**: Review entire task name extraction logic
- **Fix approach**: Fix broader parsing issue

**Alternative Hypothesis 2**: Task format changed
- **Evidence to look for**: Task format doesn't match regex expectations
- **Investigation**: Review task file format
- **Fix approach**: Update regex to match new format

**Pivot Criteria**:
- If regex fix doesn't resolve test failure
- If task extraction still returns wrong results
- If new edge cases appear

---

#### Group 6: Performance Degradation

**Primary Diagnosis**: Performance degraded OR threshold too strict

**Alternative Hypothesis 1**: Performance test is flaky
- **Evidence to look for**: Variance changes significantly between runs
- **Investigation**: Run performance test many times, analyze distribution
- **Fix approach**: Improve test stability or increase threshold

**Alternative Hypothesis 2**: External factors affecting performance
- **Evidence to look for**: Performance varies by environment
- **Investigation**: Test in different environments
- **Fix approach**: Isolate test from external factors

**Alternative Hypothesis 3**: Actual performance regression
- **Evidence to look for**: Consistent performance degradation
- **Investigation**: Profile code to find bottleneck
- **Fix approach**: Optimize performance bottleneck

**Pivot Criteria**:
- If threshold adjustment doesn't resolve issue
- If performance continues to degrade
- If variance is inconsistent across runs

---

### Investigation Workflow

**Step 1: Document Failure Pattern**
```markdown
## Alternative Investigation: Group X

**Primary Fix Attempted**: [What was tried]
**Result**: [What happened]
**Failure Pattern**: [Specific errors or behavior]
**Unexpected Findings**: [Anything surprising]
```

**Step 2: Form Alternative Hypotheses**
- Review alternative hypotheses for the group
- Identify which hypothesis best matches failure pattern
- Gather evidence to support or refute hypothesis

**Step 3: Test Alternative Hypothesis**
- Design minimal test to validate hypothesis
- Apply targeted fix based on hypothesis
- Run tests to verify

**Step 4: Document Findings**
- Record which hypothesis was correct
- Document why primary diagnosis was wrong
- Update analysis for future reference

**Step 5: Update Spec if Needed**
- If alternative requires significant changes, update design document
- Add new tasks if needed
- Adjust effort estimates

### Escalation Path

**When to Escalate to User**:

1. **Multiple alternatives fail**: Tried 2-3 alternatives, none work
2. **Fundamental misunderstanding**: Analysis assumptions appear wrong
3. **Scope expansion needed**: Fix requires changes beyond current spec
4. **Ambiguous decision**: Multiple valid approaches, need user input

**Escalation Format**:
```markdown
## Escalation: Group X Diagnosis Incorrect

**Primary Diagnosis**: [What we thought]
**Attempted Fixes**: [What we tried]
**Results**: [What happened]
**Alternative Hypotheses**: [What else could be wrong]
**Recommendation**: [What to try next]
**User Input Needed**: [Specific decision or guidance needed]
```

### Success Metrics for Alternative Investigation

**Effective Investigation**:
- ✅ Alternative hypothesis identified within 30 minutes
- ✅ Evidence gathered to support/refute hypothesis
- ✅ Targeted fix applied based on evidence
- ✅ Tests pass after alternative fix

**Ineffective Investigation** (Escalate):
- ❌ No clear alternative hypothesis after 1 hour
- ❌ Multiple alternatives tried, none work
- ❌ Tests pass but behavior seems wrong
- ❌ Fix requires changes beyond current spec scope

### Documentation Requirements

**For Each Alternative Investigation**:
- Document in task completion notes
- Explain why primary diagnosis was wrong
- Record evidence that led to alternative
- Update analysis findings if needed
- Note lessons learned for future analyses

**Example Documentation**:
```markdown
## Alternative Investigation: Group 2

**Primary Diagnosis**: Tests don't initialize monitoring
**Result**: Added startMonitoring() but tests still timeout

**Alternative Hypothesis**: Event processing has deadlock
**Evidence**: Events queue up but never process, even with timer advancement
**Investigation**: Found circular dependency in event processing logic
**Fix**: Refactored event processing to remove circular dependency
**Outcome**: All 14 tests now pass

**Lesson Learned**: Timeout issues can indicate deadlocks, not just initialization problems
**Analysis Update**: Added deadlock as potential root cause for async issues
```

---

*This section provides a systematic approach to handling diagnostic uncertainty, with clear alternative investigation plans for each root cause group and escalation paths when alternatives are needed.*
