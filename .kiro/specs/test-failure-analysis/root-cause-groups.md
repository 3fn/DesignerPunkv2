# Root Cause Groups: Test Failure Analysis

**Date**: November 21, 2025
**Spec**: test-failure-analysis
**Task**: 3.2 Document root cause groups
**Status**: Complete

---

## Executive Summary

**Total Test Failures**: 65 tests across 11 test suites
**Root Cause Groups**: 6 distinct groups
**Tests Grouped**: 65 (100% coverage)

### Group Distribution by Priority

| Priority | Root Cause Group | Test Count | Severity |
|----------|------------------|------------|----------|
| Critical | Validation Preventing Registration | 37 | Critical |
| Critical | Async Operations Not Completing | 14 | Critical |
| High | Validation Rules Tightened | 7 | High |
| High | Detection Logic Changed | 5 | High |
| High | Task Name Extraction Regex Bug | 1 | High |
| Medium | Performance Degradation | 2 | Medium |

---

## Group 1: Validation Preventing Registration

**Root Cause**: Validation fails with 'Error' level, preventing token registration. Tests don't check validation results before attempting to retrieve tokens, leading to undefined access errors.

**Affected Tests**: 37
**Test Suites**: 
- CrossPlatformConsistency.test.ts (19 failures)
- TokenSystemIntegration.test.ts (18 failures)

**Severity**: Critical - Blocks core token registration functionality
**Confidence**: 95%

### Examples

#### Example 1: CrossPlatformConsistency - Space Token Registration
```typescript
// Test registers tokens with autoValidate: true
engine.registerPrimitiveTokens(tokens);

// Attempts to retrieve token
const space100 = engine.getPrimitiveToken('space100')!;

// Accessing properties on undefined throws TypeError
expect(space100.platforms.web.value).toBe(8);
```

**Error Message**:
```
TypeError: Cannot read properties of undefined (reading 'platforms')
```

**Evidence**: 
- `getPrimitiveToken()` returns `undefined` because validation failed
- Registration code returns early when `validationResult.level === 'Error'`
- Token never added to registry

#### Example 2: TokenSystemIntegration - Color Token Registration
```typescript
// Test registers color tokens
engine.registerPrimitiveTokens(colorTokens);

// Attempts to retrieve token
const blue500 = engine.getPrimitiveToken('blue500')!;

// Accessing platforms property fails
expect(blue500.platforms.web.value).toBe('#3B82F6');
```

**Error Message**:
```
TypeError: Cannot read properties of undefined (reading 'platforms')
```

**Evidence**:
- Same pattern as Example 1
- Validation preventing registration
- Tests don't verify validation results before retrieval

#### Example 3: TokenSystemIntegration - Typography Token Registration
```typescript
// Test registers typography tokens
engine.registerPrimitiveTokens(typographyTokens);

// Attempts to retrieve token
const fontSize100 = engine.getPrimitiveToken('fontSize100')!;

// Accessing properties fails
expect(fontSize100.platforms.ios.value).toBe(16);
```

**Error Message**:
```
TypeError: Cannot read properties of undefined (reading 'platforms')
```

**Evidence**:
- Consistent pattern across all token types
- Validation is stricter than when tests were written
- `autoValidate: true` in test setup causes registration to fail

### Evidence Supporting Grouping

**Common Pattern**:
1. Tests register tokens with `autoValidate: true`
2. Validation fails with 'Error' level
3. Registration returns early without adding token to registry
4. Tests attempt to retrieve tokens that were never registered
5. `getPrimitiveToken()` returns `undefined`
6. Accessing properties on `undefined` throws TypeError

**Code Evidence** (`TokenEngine.ts`):
```typescript
registerPrimitiveToken(token: PrimitiveToken): ValidationResult {
  if (this.config.autoValidate) {
    const validationResult = this.validateToken(token);
    
    // Prevent registration if validation fails with error
    if (validationResult.level === 'Error') {
      return validationResult;  // Token NOT registered!
    }
    
    // Proceed with registration
    this.registryCoordinator.registerPrimitive(token, {
      skipValidation: true,
      allowOverwrite: false
    });
    return validationResult;
  }
}
```

**Grouping Rationale**: All 37 failures share the same root cause (validation preventing registration), same error pattern (TypeError on undefined), and same fix approach (check validation results or adjust validation rules).

---

## Group 2: Async Operations Not Completing

**Root Cause**: Tests don't initialize event processing (by calling `startMonitoring()`), and fake timers don't properly coordinate with async operations, causing events to be queued but never processed.

**Affected Tests**: 14
**Test Suites**:
- WorkflowMonitor.test.ts (11 failures)
- ReleaseCLI.test.ts (3 failures)

**Severity**: Critical - Blocks release workflow functionality
**Confidence**: 90%

### Examples

#### Example 1: WorkflowMonitor - Event Queue Processing
```typescript
it('should queue events and process them in order', async () => {
  // Trigger events
  await monitor.triggerEvent('task-completion', 'test-source-1');
  
  // Advance timers
  jest.advanceTimersByTime(1500);
  await new Promise(resolve => setTimeout(resolve, 0));
  
  // Expect events to be processed
  expect(processedEvents).toHaveLength(3);  // FAILS - events not processed
});
```

**Error Message**:
```
Timeout - Async operation did not complete within 5000ms
```

**Evidence**:
- Test doesn't call `startMonitoring()`, so `setupEventQueueProcessing()` never runs
- Without timer setup, events are queued but never processed
- Fake timers don't properly advance async operations

#### Example 2: WorkflowMonitor - Event Processing Delay
```typescript
it('should respect processing delay between events', async () => {
  // Trigger multiple events
  await monitor.triggerEvent('task-completion', 'test-source-1');
  await monitor.triggerEvent('task-completion', 'test-source-2');
  
  // Advance timers
  jest.advanceTimersByTime(2000);
  
  // Expect delayed processing
  expect(processedEvents).toHaveLength(2);  // FAILS - timeout
});
```

**Error Message**:
```
Timeout - Async operation did not complete within 5000ms
```

**Evidence**:
- Same root cause as Example 1
- Event processing timer not initialized
- Fake timer/async coordination issue

#### Example 3: ReleaseCLI - Release Detection Workflow
```typescript
it('should detect release from completion documents', async () => {
  // Trigger release detection
  await cli.detectRelease();
  
  // Advance timers
  jest.advanceTimersByTime(3000);
  
  // Expect release detected
  expect(releaseDetected).toBe(true);  // FAILS - timeout
});
```

**Error Message**:
```
Timeout - Async operation did not complete within 5000ms
```

**Evidence**:
- CLI depends on WorkflowMonitor for event processing
- Same async coordination issues
- Events queued but not processed

### Evidence Supporting Grouping

**Common Pattern**:
1. Tests use fake timers (`jest.useFakeTimers()`)
2. Tests don't initialize monitoring (`startMonitoring()` not called)
3. Event processing timer never set up
4. Events queued but never processed
5. Tests timeout after 5000ms

**Code Evidence** (`WorkflowMonitor.ts`):
```typescript
private setupEventQueueProcessing(): void {
  // Process events periodically
  this.processingTimer = setInterval(() => {
    if (!this.eventQueue.processing && this.eventQueue.events.length > 0) {
      this.startEventProcessing();
    }
  }, this.eventQueue.processingDelay);
}
```

**Test Setup Pattern**:
```typescript
beforeEach(() => {
  jest.useFakeTimers();
  // Missing: await monitor.startMonitoring();
});
```

**Grouping Rationale**: All 14 failures share the same root cause (event processing not initialized), same error pattern (timeout), and same fix approach (initialize monitoring or improve timer advancement).

---

## Group 3: Validation Rules Tightened

**Root Cause**: Validation rules have become stricter, causing tokens that previously passed to now receive Warning or Error levels. Tests need to be updated to match current validation behavior.

**Affected Tests**: 7
**Test Suites**:
- EndToEndWorkflow.test.ts (7 failures)

**Severity**: High - Affects workflow validation expectations
**Confidence**: 85%

### Examples

#### Example 1: EndToEndWorkflow - Token Validation Pass Expected
```typescript
it('should validate tokens in end-to-end workflow', async () => {
  const result = engine.validateToken(token);
  expect(result.level).toBe('Pass');  // FAILS - receives 'Warning'
});
```

**Error Message**:
```
expect(received).toBe(expected)

Expected: "Pass"
Received: "Warning"
```

**Evidence**:
- Validation rules became stricter
- Token that previously passed now receives Warning
- Test expectations outdated

#### Example 2: EndToEndWorkflow - Baseline Grid Validation
```typescript
it('should validate baseline grid alignment', async () => {
  const result = engine.validateToken(spacingToken);
  expect(result.level).toBe('Pass');  // FAILS - receives 'Error'
});
```

**Error Message**:
```
expect(received).toBe(expected)

Expected: "Pass"
Received: "Error"
```

**Evidence**:
- Baseline grid validation rules tightened
- Token that previously passed now fails validation
- Test expectations need updating

#### Example 3: EndToEndWorkflow - Cross-Platform Consistency
```typescript
it('should validate cross-platform consistency', async () => {
  const result = engine.validateToken(colorToken);
  expect(result.level).toBe('Pass');  // FAILS - receives 'Warning'
});
```

**Error Message**:
```
expect(received).toBe(expected)

Expected: "Pass"
Received: "Warning"
```

**Evidence**:
- Cross-platform validation rules stricter
- Consistent pattern of Pass to Warning changes
- Validation evolved but tests didn't

### Evidence Supporting Grouping

**Common Pattern**:
1. Tests expect validation level 'Pass'
2. Validation returns 'Warning' or 'Error' instead
3. Consistent pattern across multiple validation types
4. Tests written with old validation rules

**Grouping Rationale**: All 7 failures share the same root cause (validation rules tightened), same error pattern (Pass to Warning/Error), and same fix approach (update test expectations to match current validation behavior).

---

## Group 4: Detection Logic Changed

**Root Cause**: Detection algorithms (version bump calculation, bug fix detection, token generation) have changed, causing tests with old expectations to fail.

**Affected Tests**: 5
**Test Suites**:
- DetectionSystemIntegration.test.ts (3 failures)
- SemanticTokenGeneration.test.ts (2 failures)

**Severity**: High - Affects release detection and token generation
**Confidence**: 80%

### Examples

#### Example 1: DetectionSystemIntegration - Version Bump Calculation
```typescript
it('should calculate correct version bump', async () => {
  const bump = await detector.calculateVersionBump(commits);
  expect(bump).toBe('minor');  // FAILS - receives 'major'
});
```

**Error Message**:
```
expect(received).toBe(expected)

Expected: "minor"
Received: "major"
```

**Evidence**:
- Version bump calculation algorithm changed
- Test expectations based on old algorithm
- Specific, deterministic mismatch

#### Example 2: DetectionSystemIntegration - Bug Fix Detection
```typescript
it('should detect bug fixes from commits', async () => {
  const bugFixes = await detector.detectBugFixes(commits);
  expect(bugFixes).toHaveLength(3);  // FAILS - receives 0
});
```

**Error Message**:
```
expect(received).toHaveLength(expected)

Expected length: 3
Received length: 0
```

**Evidence**:
- Bug fix detection logic changed
- Different commit message parsing rules
- Test data may use old format

#### Example 3: SemanticTokenGeneration - Android Token Output
```typescript
it('should generate Android tokens correctly', async () => {
  const output = await generator.generateAndroid(tokens);
  expect(output).toContain('z_index_container');  // FAILS - token not found
});
```

**Error Message**:
```
Expected token "z_index_container" not found in Android output
```

**Evidence**:
- Token generation logic changed
- Token naming or inclusion rules different
- Generator evolved since test was written

### Evidence Supporting Grouping

**Common Pattern**:
1. Specific, deterministic mismatches between expected and received values
2. Detection/generation algorithms changed since tests were written
3. Tests use old expectations or data formats
4. Consistent failures within each test suite

**Grouping Rationale**: All 5 failures share the same root cause (detection logic changed), same error pattern (specific value mismatches), and same fix approach (update test expectations or fix detection logic if incorrect).

---

## Group 5: Task Name Extraction Regex Bug

**Root Cause**: Regex pattern makes the decimal portion optional, causing parent task numbers to match subtask lines. When searching for task "1", it matches "1.1 Sub Task One" instead of "1. Main Task One".

**Affected Tests**: 1
**Test Suites**:
- WorkflowMonitor.test.ts (1 failure)

**Severity**: High - Documented bug in task name extraction
**Confidence**: 95%

### Examples

#### Example 1: WorkflowMonitor - Task Name Extraction
```typescript
it('should extract task names from tasks.md content', async () => {
  const tasksContent = `
- [ ] 1. Main Task One
- [ ] 1.1 Sub Task One
`;

  expect(extractTaskName(tasksContent, '1')).toBe('Main Task One');
  // FAILS - returns 'Sub Task One' instead
});
```

**Error Message**:
```
expect(received).toBe(expected)

Expected: "Main Task One"
Received: "Sub Task One"
```

**Evidence**:
- Regex pattern has documented flaw
- Pattern makes decimal portion optional
- When searching for "1", matches both "1." and "1.1"
- First match is "1.1 Sub Task One" instead of "1. Main Task One"

#### Code Evidence
```typescript
private extractTaskName(tasksContent: string, taskNumber: string): string | null {
  const taskMatch = line.match(new RegExp(`^- \\[ \\] ${taskNumber}(?:\\.\\d+)?\\s+(.+)`));
  //                                                                  ^^^^^^^^^^
  //                                                                  Makes decimal OPTIONAL
  if (taskMatch) {
    return taskMatch[1].trim();
  }
  return null;
}
```

### Evidence Supporting Grouping

**Common Pattern**:
- Single test failure with clear, documented bug
- Regex pattern flaw identified in code
- Specific fix approach documented

**Grouping Rationale**: Single failure with unique root cause (regex bug), clear error pattern (wrong task name extracted), and specific fix approach (use negative lookahead or require dot).

---

## Group 6: Performance Degradation

**Root Cause**: Either performance has degraded (variance increased) OR threshold is too strict for current system complexity. Requires investigation to determine which.

**Affected Tests**: 2
**Test Suites**:
- AccuracyRegressionTests.test.ts (1 failure)
- PerformanceValidation.test.ts (1 failure)

**Severity**: Medium - Affects performance metrics
**Confidence**: 70%

### Examples

#### Example 1: PerformanceValidation - Variance Threshold
```typescript
it('should maintain performance variance within threshold', async () => {
  const variance = await measurePerformanceVariance();
  expect(variance).toBeLessThan(0.5);  // FAILS - variance is 0.825
});
```

**Error Message**:
```
expect(received).toBeLessThan(expected)

Expected: < 0.5
Received: 0.825
```

**Evidence**:
- Performance variance significantly exceeds threshold
- Either performance degraded or threshold too strict
- Requires investigation to determine root cause

#### Example 2: AccuracyRegressionTests - Performance Regression
```typescript
it('should not regress in performance', async () => {
  const currentPerformance = await measurePerformance();
  const baselinePerformance = getBaselinePerformance();
  
  expect(currentPerformance).toBeLessThanOrEqual(baselinePerformance * 1.1);
  // FAILS - current performance exceeds baseline by more than 10%
});
```

**Error Message**:
```
expect(received).toBeLessThanOrEqual(expected)

Expected: <= 110 (baseline * 1.1)
Received: 125
```

**Evidence**:
- Performance exceeds baseline by significant margin
- Could indicate actual performance degradation
- Or baseline may be outdated for current system complexity

### Evidence Supporting Grouping

**Common Pattern**:
1. Performance metrics exceed thresholds
2. Either actual degradation or unrealistic thresholds
3. Requires investigation to determine root cause
4. Lower confidence than other groups (70%)

**Grouping Rationale**: Both failures share the same root cause category (performance issues), same error pattern (threshold exceeded), and same fix approach (investigate performance or adjust thresholds).

---

## Summary by Priority

### Critical Priority (51 failures)

**Group 1: Validation Preventing Registration** - 37 failures
- **Impact**: Core token registration broken
- **Fix Approach**: Check validation results in tests or adjust validation rules
- **Estimated Fix Time**: 2-4 hours

**Group 2: Async Operations Not Completing** - 14 failures
- **Impact**: Release workflow broken
- **Fix Approach**: Initialize monitoring in tests or improve timer advancement
- **Estimated Fix Time**: 4-6 hours

### High Priority (13 failures)

**Group 3: Validation Rules Tightened** - 7 failures
- **Impact**: Workflow validation expectations outdated
- **Fix Approach**: Update test expectations to match current validation behavior
- **Estimated Fix Time**: 2-3 hours

**Group 4: Detection Logic Changed** - 5 failures
- **Impact**: Release detection and token generation
- **Fix Approach**: Update test expectations or fix detection logic if incorrect
- **Estimated Fix Time**: 3-5 hours

**Group 5: Task Name Extraction Regex Bug** - 1 failure
- **Impact**: Task name extraction incorrect
- **Fix Approach**: Use negative lookahead or require dot in regex
- **Estimated Fix Time**: 15 minutes

### Medium Priority (2 failures)

**Group 6: Performance Degradation** - 2 failures
- **Impact**: Performance metrics
- **Fix Approach**: Investigate performance or adjust thresholds
- **Estimated Fix Time**: 2-4 hours

---

## Recommended Fix Order

1. **Group 5: Task Name Extraction Regex Bug** (15 min)
   - Quick win, high confidence, clear fix

2. **Group 1: Validation Preventing Registration** (2-4 hours)
   - Highest impact (37 failures)
   - Critical for core functionality

3. **Group 2: Async Operations Not Completing** (4-6 hours)
   - Critical for release workflow
   - Complex but well-understood

4. **Group 3: Validation Rules Tightened** (2-3 hours)
   - Quick wins (7 failures)
   - Straightforward test updates

5. **Group 4: Detection Logic Changed** (3-5 hours)
   - Important features
   - Requires logic review

6. **Group 6: Performance Degradation** (2-4 hours)
   - Lower priority
   - Requires investigation

**Total Estimated Fix Time**: 14-25 hours

---

## Fix Approaches by Root Cause Group

### Group 1: Validation Preventing Registration

**Suggested Fix Approach**: Two-phase approach with validation result checking

**Conceptual Approach**:
1. **Phase 1: Test Updates** - Update tests to check validation results before attempting token retrieval
   - Add validation result assertions before token access
   - Handle cases where validation fails with Error level
   - Verify token registration succeeded before retrieval

2. **Phase 2: Validation Rule Review** - Review validation rules to ensure they're appropriate
   - Identify which validation rules are causing failures
   - Determine if rules are too strict for legitimate tokens
   - Adjust rules if they're preventing valid token registration

**Why This Addresses Root Cause**:
- Tests currently assume registration always succeeds
- Validation failures prevent registration, causing undefined access
- Checking validation results prevents undefined access errors
- Reviewing rules ensures validation is appropriate for token types

**Multiple Approaches Viable**: Yes
- **Approach A**: Update tests only (faster, assumes validation is correct)
- **Approach B**: Adjust validation rules (if rules are too strict)
- **Approach C**: Hybrid - update tests AND adjust specific rules

**Recommended**: Start with Approach A (test updates), then evaluate if Approach B (rule adjustment) is needed based on which tokens are failing validation.

---

### Group 2: Async Operations Not Completing

**Suggested Fix Approach**: Initialize event processing in test setup

**Conceptual Approach**:
1. **Add Monitoring Initialization** - Call `startMonitoring()` in test setup
   - Ensures event processing timer is initialized
   - Allows events to be processed from queue
   - Coordinates with fake timers properly

2. **Improve Timer Advancement** - Use proper async/timer coordination
   - Advance timers after triggering events
   - Add microtask flushes (`await Promise.resolve()`)
   - Ensure sufficient time for event processing

3. **Add Cleanup** - Stop monitoring in test teardown
   - Prevents timer leaks between tests
   - Cleans up event processing state
   - Ensures test isolation

**Why This Addresses Root Cause**:
- Tests don't initialize monitoring, so event processing never starts
- Without timer setup, events queue but never process
- Proper initialization enables the event processing loop
- Timer advancement ensures events are processed during tests

**Multiple Approaches Viable**: Yes
- **Approach A**: Initialize monitoring in tests (recommended)
- **Approach B**: Mock event processing entirely (simpler but less realistic)
- **Approach C**: Use real timers instead of fake timers (slower but more reliable)

**Recommended**: Approach A (initialize monitoring) - maintains test speed while fixing the actual issue.

---

### Group 3: Validation Rules Tightened

**Suggested Fix Approach**: Update test expectations to match current validation behavior

**Conceptual Approach**:
1. **Identify Current Validation Behavior** - Run tests to see actual validation levels
   - Document which tokens receive Warning vs Error
   - Understand why validation rules changed
   - Verify changes are intentional

2. **Update Test Expectations** - Change assertions to match current behavior
   - Update `expect(result.level).toBe('Pass')` to match actual level
   - Add comments explaining why Warning/Error is expected
   - Ensure tests validate the right behavior

3. **Document Validation Changes** - Record why validation rules tightened
   - Helps future developers understand expectations
   - Prevents confusion about validation levels
   - Maintains test documentation quality

**Why This Addresses Root Cause**:
- Validation rules evolved but tests didn't
- Tests expect old validation behavior
- Updating expectations aligns tests with current system
- Ensures tests validate actual behavior, not outdated expectations

**Multiple Approaches Viable**: Yes
- **Approach A**: Update test expectations (assumes validation is correct)
- **Approach B**: Relax validation rules (if they're too strict)
- **Approach C**: Fix tokens to pass stricter validation (if tokens are wrong)

**Recommended**: Approach A (update expectations) - validation rules likely tightened for good reasons.

---

### Group 4: Detection Logic Changed

**Suggested Fix Approach**: Investigate detection logic changes and update accordingly

**Conceptual Approach**:
1. **Review Detection Logic Changes** - Understand what changed and why
   - Check git history for detection algorithm changes
   - Understand rationale for changes
   - Determine if changes are correct

2. **Evaluate Test Expectations** - Determine if tests or logic is wrong
   - If logic is correct: Update test expectations
   - If logic is wrong: Fix detection algorithms
   - If both have issues: Fix logic AND update tests

3. **Update Test Data** - Ensure test data matches current formats
   - Commit messages may use new format
   - Token generation may have new rules
   - Test data should reflect current system

**Why This Addresses Root Cause**:
- Detection algorithms evolved since tests were written
- Tests use old expectations or data formats
- Reviewing changes ensures tests validate correct behavior
- Updating tests or logic aligns system with requirements

**Multiple Approaches Viable**: Yes
- **Approach A**: Update test expectations (if logic is correct)
- **Approach B**: Fix detection logic (if logic is wrong)
- **Approach C**: Update test data (if data format changed)
- **Approach D**: Combination of above

**Recommended**: Start with Approach A (review changes), then determine if B, C, or D is needed based on findings.

---

### Group 5: Task Name Extraction Regex Bug

**Suggested Fix Approach**: Fix regex pattern to require dot after task number

**Conceptual Approach**:
1. **Use Negative Lookahead** - Prevent matching subtask numbers
   ```typescript
   // Current (wrong): ^- \[ \] ${taskNumber}(?:\.\d+)?\s+(.+)
   // Fixed: ^- \[ \] ${taskNumber}(?!\.\d)\.\s+(.+)
   //                                ^^^^^^^^
   //                                Negative lookahead prevents matching "1.1" when searching for "1"
   ```

2. **Require Dot After Task Number** - Make dot mandatory, not optional
   ```typescript
   // Alternative fix: ^- \[ \] ${taskNumber}\.\s+(.+)
   //                                         ^^
   //                                         Dot is required, not optional
   ```

**Why This Addresses Root Cause**:
- Current regex makes decimal portion optional
- When searching for "1", matches both "1." and "1.1"
- Negative lookahead ensures only exact task number matches
- Requiring dot prevents matching subtasks

**Multiple Approaches Viable**: Yes
- **Approach A**: Negative lookahead (more precise)
- **Approach B**: Require dot (simpler)

**Recommended**: Approach A (negative lookahead) - more robust for edge cases.

---

### Group 6: Performance Degradation

**Suggested Fix Approach**: Investigate performance characteristics and adjust thresholds

**Conceptual Approach**:
1. **Measure Current Performance** - Establish baseline for current system
   - Run performance tests multiple times
   - Calculate mean and variance
   - Compare to historical baselines

2. **Identify Performance Changes** - Determine if degradation is real
   - Check git history for performance-impacting changes
   - Profile code to identify bottlenecks
   - Determine if complexity increased legitimately

3. **Adjust Thresholds or Fix Performance** - Based on investigation
   - If performance degraded: Fix bottlenecks
   - If thresholds too strict: Adjust to realistic values
   - If complexity increased: Update baselines

**Why This Addresses Root Cause**:
- Performance metrics exceed thresholds
- Could be actual degradation OR unrealistic thresholds
- Investigation determines which is true
- Fix depends on investigation results

**Multiple Approaches Viable**: Yes
- **Approach A**: Adjust thresholds (if current performance is acceptable)
- **Approach B**: Fix performance issues (if actual degradation)
- **Approach C**: Update baselines (if system complexity increased)

**Recommended**: Start with Approach A (investigation), then determine if B or C is needed.

---

## Fix Approach Summary

| Group | Primary Approach | Alternative Approaches | Estimated Effort |
|-------|-----------------|------------------------|------------------|
| 1. Validation Preventing Registration | Update tests to check validation results | Adjust validation rules, Hybrid | 2-4 hours |
| 2. Async Operations Not Completing | Initialize monitoring in tests | Mock event processing, Use real timers | 4-6 hours |
| 3. Validation Rules Tightened | Update test expectations | Relax validation rules, Fix tokens | 2-3 hours |
| 4. Detection Logic Changed | Review logic and update tests | Fix detection logic, Update test data | 3-5 hours |
| 5. Task Name Extraction Regex Bug | Use negative lookahead in regex | Require dot after task number | 15 minutes |
| 6. Performance Degradation | Investigate and adjust thresholds | Fix performance issues, Update baselines | 2-4 hours |

---

## Next Steps

1. Create implementation tasks for each root cause group
2. Start with quick wins (Group 5: regex bug)
3. Move to high-impact fixes (Group 1: validation registration)
4. Address critical workflow issues (Group 2: async operations)
5. Update test expectations (Group 3: validation rules)
6. Fix detection logic issues (Group 4: detection logic)
7. Investigate performance degradation (Group 6: performance)

---

**Document Complete**: November 21, 2025
**Analyst**: Kiro (AI Agent)
**Spec**: test-failure-analysis
**Task**: 3.3 Suggest fix approaches
**Status**: Complete
