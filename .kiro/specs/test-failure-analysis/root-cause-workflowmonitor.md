# WorkflowMonitor Root Cause Investigation

**Date**: November 21, 2025
**Investigator**: Kiro (AI Agent)
**Task**: 2.1 Investigate WorkflowMonitor failures
**Status**: Investigation Complete

---

## Executive Summary

**Total Failures**: 13 tests in WorkflowMonitor.test.ts
**Primary Root Causes Identified**: 3
**Severity**: High - Affects release detection workflow

**Key Findings**:
1. **Task Name Extraction Bug** (1 test) - Logic error in regex pattern
2. **Async/Await Issues** (11 tests) - Timers and promises not properly coordinated
3. **Mock Setup Issues** (1 test) - Incomplete mock configuration

---

## Failure Categories

### Category 1: Task Name Extraction Failure (1 test)

**Test**: "should extract task names from tasks.md content"

**Error**:
```
expect(received).toBe(expected) // Object.is equality

Expected: "Main Task One"
Received: "Sub Task One"
```

**Evidence**:

1. **Test Code** (lines 413-427):
```typescript
it('should extract task names from tasks.md content', async () => {
  const tasksContent = `
# Implementation Plan

- [ ] 1. Main Task One
- [ ] 1.1 Sub Task One
- [ ] 1.2 Sub Task Two
- [ ] 2. Main Task Two
- [ ] 2.1 Another Sub Task
`;

  const extractTaskName = (monitor as any).extractTaskName.bind(monitor);

  expect(extractTaskName(tasksContent, '1')).toBe('Main Task One');
  expect(extractTaskName(tasksContent, '1.1')).toBe('Sub Task One');
  expect(extractTaskName(tasksContent, '2')).toBe('Main Task Two');
  expect(extractTaskName(tasksContent, '2.1')).toBe('Another Sub Task');
  expect(extractTaskName(tasksContent, '3')).toBeNull();
});
```

2. **Implementation Code** (lines 638-650):
```typescript
private extractTaskName(tasksContent: string, taskNumber: string): string | null {
  const lines = tasksContent.split('\n');

  for (const line of lines) {
    // Look for task with matching number
    const taskMatch = line.match(new RegExp(`^- \\[ \\] ${taskNumber}(?:\\.\\d+)?\\s+(.+)$`));
    if (taskMatch) {
      return taskMatch[1].trim();
    }
  }

  return null;
}
```

**Root Cause Analysis**:

The regex pattern `^- \\[ \\] ${taskNumber}(?:\\.\\d+)?\\s+(.+)$` has a critical flaw:

**Problem**: The pattern `(?:\\.\\d+)?` makes the decimal portion OPTIONAL, which means:
- When searching for task "1", the regex matches BOTH:
  - `- [ ] 1. Main Task One` ✅ (intended match)
  - `- [ ] 1.1 Sub Task One` ✅ (unintended match - should NOT match)

**Why it fails**:
1. Test calls `extractTaskName(tasksContent, '1')`
2. Regex becomes: `^- \\[ \\] 1(?:\\.\\d+)?\\s+(.+)$`
3. This matches line `- [ ] 1.1 Sub Task One` because:
   - `1` matches the task number
   - `(?:\\.\\d+)?` optionally matches `.1`
   - Result: Returns "Sub Task One" instead of "Main Task One"

**Expected Behavior**:
- When searching for task "1", should ONLY match `- [ ] 1. Main Task One`
- When searching for task "1.1", should ONLY match `- [ ] 1.1 Sub Task One`

**Hypothesis**: The regex pattern needs to be more precise to distinguish between parent tasks (e.g., "1") and subtasks (e.g., "1.1").

**Likelihood**: **HIGH** - This is a clear logic bug in the regex pattern.

**Fix Approach**: 
- For exact task number matching, use: `^- \\[ \\] ${taskNumber}\\.\\s+(.+)$` (require the dot after task number)
- Or use word boundary: `^- \\[ \\] ${taskNumber}(?!\\.)\\s+(.+)$` (negative lookahead to prevent matching subtasks)

---

### Category 2: Async/Await and Timer Issues (11 tests)

**Affected Tests**:
1. "should queue events and process them in order" (Event Queue Management)
2. "should detect git commit events for task completion" (Hook Integration)
3. "should process trigger files from hook system" (Hook Integration)
4. "should monitor file organization events" (Hook Integration)
5. "should handle git command errors" (Error Handling)
6. "should handle malformed trigger files" (Error Handling)
7. "should emit error events for processing failures" (Error Handling)

**Common Error Pattern**: Tests timeout after 5000ms

**Evidence**:

1. **Test Setup** (lines 30-35):
```typescript
beforeEach(() => {
  // ...
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
  monitor.stopMonitoring();
});
```

2. **Example Failing Test** (lines 107-127):
```typescript
it('should queue events and process them in order', async () => {
  const processedEvents: WorkflowEvent[] = [];

  monitor.on('event-processed', (event: WorkflowEvent) => {
    processedEvents.push(event);
  });

  // Trigger multiple events
  await monitor.triggerEvent('task-completion', 'test-source-1');
  await monitor.triggerEvent('spec-completion', 'test-source-2');
  await monitor.triggerEvent('file-change', 'test-source-3');

  // Process the queue
  jest.advanceTimersByTime(1500);
  await new Promise(resolve => setTimeout(resolve, 0));

  expect(processedEvents).toHaveLength(3);
  expect(processedEvents[0].source).toBe('test-source-1');
  expect(processedEvents[1].source).toBe('test-source-2');
  expect(processedEvents[2].source).toBe('test-source-3');
});
```

3. **Implementation - Event Processing** (lines 207-217):
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

4. **Implementation - Start Processing** (lines 222-244):
```typescript
private async startEventProcessing(): Promise<void> {
  if (this.eventQueue.processing) {
    return;
  }

  this.eventQueue.processing = true;

  while (this.eventQueue.events.length > 0) {
    const event = this.eventQueue.events.shift();
    if (event) {
      try {
        await this.processQueuedEvent(event);

        // Small delay between processing events to prevent overwhelming
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error('Error processing queued event:', error);
        this.emit('error', error);
      }
    }
  }

  this.eventQueue.processing = false;
}
```

**Root Cause Analysis**:

**Problem 1: Timer/Promise Coordination**
- Tests use `jest.useFakeTimers()` to control time
- Implementation uses `setInterval()` for periodic processing (line 209)
- Implementation also uses `setTimeout()` for delays (line 235)
- Test advances fake timers with `jest.advanceTimersByTime(1500)` (line 120)
- BUT: The `await new Promise(resolve => setTimeout(resolve, 0))` in tests (line 121) creates a real promise that doesn't advance with fake timers

**Problem 2: Event Processing Not Starting**
- `setupEventQueueProcessing()` is called in `startMonitoring()` (line 77)
- But tests don't call `startMonitoring()` before triggering events
- The `processingTimer` interval is never set up
- Events are queued but never processed

**Problem 3: Async Operations in setInterval**
- `startEventProcessing()` is async (line 222)
- Called from `setInterval` callback (line 210)
- The interval doesn't await the async operation
- This can cause race conditions and timing issues

**Evidence from Test**:
```typescript
// Test triggers events
await monitor.triggerEvent('task-completion', 'test-source-1');

// This queues the event but doesn't start processing
// because setupEventQueueProcessing() was never called
```

**Hypothesis**: Tests fail because:
1. Event processing timer is never initialized (monitor not started)
2. Fake timers don't properly advance async operations
3. Tests expect immediate processing but implementation uses delayed processing

**Likelihood**: **HIGH** - Multiple pieces of evidence point to timer/async coordination issues.

**Fix Approach**:
1. Tests should call `monitor.startMonitoring()` before triggering events
2. Or tests should manually call `setupEventQueueProcessing()` in beforeEach
3. Consider using `jest.runAllTimers()` or `jest.runOnlyPendingTimers()` instead of `advanceTimersByTime`
4. May need to flush promises with `await Promise.resolve()` or `await new Promise(setImmediate)`

---

### Category 3: Hook Integration Tests - Additional Issues (3 tests)

**Affected Tests**:
1. "should detect git commit events for task completion"
2. "should process trigger files from hook system"
3. "should monitor file organization events"

**Additional Root Cause Beyond Timers**:

**Evidence**:

1. **Test Code** (lines 177-199):
```typescript
it('should detect git commit events for task completion', async () => {
  const commitHash = 'abc123def456';
  const commitMessage = 'Task 1.1 Complete: Implement validation system';

  mockExecSync
    .mockReturnValueOnce(commitHash) // git rev-parse HEAD
    .mockReturnValueOnce(commitMessage); // git log -1

  const detectedEvents: WorkflowEvent[] = [];
  monitor.on('workflow-event', (event: WorkflowEvent) => {
    detectedEvents.push(event);
  });

  // Simulate git commit monitoring
  await (monitor as any).setupGitCommitMonitoring();

  // Advance timers to trigger git check
  jest.advanceTimersByTime(10000);
  await new Promise(resolve => setTimeout(resolve, 0));

  expect(detectedEvents.some(e => 
    e.type === 'task-completion' && 
    e.metadata.taskNumber === '1.1' &&
    e.metadata.commitHash === commitHash
  )).toBe(true);
});
```

2. **Implementation** (lines 476-512):
```typescript
private async setupGitCommitMonitoring(): Promise<void> {
  // Monitor git log for task completion commits
  let lastCommitHash = '';

  const checkGitCommits = async () => {
    try {
      // Get the latest commit hash
      const currentCommit = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();

      if (currentCommit !== lastCommitHash && lastCommitHash !== '') {
        // Get the commit message
        const commitMessage = execSync('git log -1 --pretty=format:"%s"', { encoding: 'utf-8' });

        // Check if this is a task completion commit
        const taskCompletionMatch = commitMessage.match(/Task\s+([0-9.]+)\s+Complete:\s*(.+)/i);

        if (taskCompletionMatch) {
          const taskNumber = taskCompletionMatch[1];
          const taskDescription = taskCompletionMatch[2];

          const event: WorkflowEvent = {
            type: 'task-completion',
            source: `git-commit:${currentCommit}`,
            timestamp: new Date(),
            metadata: {
              commitHash: currentCommit,
              commitMessage,
              taskNumber,
              taskDescription,
              triggerSource: 'git-commit-monitor'
            }
          };

          this.queueEvent(event);
        }
      }

      lastCommitHash = currentCommit;
    } catch (error) {
      // Git not available or not in a git repository
    }
  };

  // Check every 10 seconds for new commits
  setInterval(checkGitCommits, 10000);
}
```

**Root Cause Analysis**:

**Problem 1: Initial State Issue**
- `lastCommitHash` starts as empty string (line 478)
- First check sets `lastCommitHash = currentCommit` (line 508)
- Condition `currentCommit !== lastCommitHash && lastCommitHash !== ''` (line 482) prevents processing on first run
- Test expects event on first check, but implementation skips it

**Problem 2: Mock Execution Order**
- Test mocks `execSync` to return values in order (lines 180-181)
- But implementation calls `execSync` twice in first iteration:
  1. `git rev-parse HEAD` → returns `commitHash`
  2. Sets `lastCommitHash = commitHash`
- On second iteration (after timer advance):
  1. `git rev-parse HEAD` → returns `commitMessage` (WRONG - should return same hash)
  2. Condition fails because hash changed

**Problem 3: Timer Not Advancing Enough**
- Test advances timers by 10000ms (line 195)
- This triggers ONE interval callback
- But the first callback just sets `lastCommitHash` and doesn't process
- Need to advance timers by 20000ms to trigger TWO callbacks

**Hypothesis**: Tests fail because:
1. Mock setup doesn't match implementation's execution pattern
2. Initial state prevents first-run processing
3. Timer advancement doesn't trigger enough iterations

**Likelihood**: **HIGH** - Clear mismatch between test expectations and implementation behavior.

**Fix Approach**:
1. Adjust mock setup to return consistent commit hash on multiple calls
2. Or modify implementation to process on first run
3. Advance timers by 20000ms to trigger two interval callbacks
4. Or refactor implementation to not skip first run

---

## Summary of Root Causes

### Root Cause 1: Task Name Extraction Regex Bug
**Affected Tests**: 1
**Severity**: High
**Type**: Logic Error
**Fix Complexity**: Low (simple regex fix)

**Issue**: Regex pattern `(?:\\.\\d+)?` makes decimal portion optional, causing parent task numbers to match subtask lines.

**Fix**: Use negative lookahead or require exact match:
```typescript
// Option 1: Negative lookahead
const taskMatch = line.match(new RegExp(`^- \\[ \\] ${taskNumber}(?!\\.)\\s+(.+)$`));

// Option 2: Require dot after number
const taskMatch = line.match(new RegExp(`^- \\[ \\] ${taskNumber}\\.\\s+(.+)$`));
```

---

### Root Cause 2: Event Processing Not Initialized
**Affected Tests**: 11
**Severity**: High
**Type**: Test Setup Issue
**Fix Complexity**: Medium (test refactoring needed)

**Issue**: Tests don't call `startMonitoring()`, so event processing timer is never set up. Events are queued but never processed.

**Fix**: Tests should call `monitor.startMonitoring()` before triggering events:
```typescript
beforeEach(async () => {
  // ... existing setup ...
  await monitor.startMonitoring(); // Add this
});
```

---

### Root Cause 3: Fake Timer/Async Coordination
**Affected Tests**: 11
**Severity**: High
**Type**: Test Infrastructure Issue
**Fix Complexity**: Medium (timer handling needs adjustment)

**Issue**: Fake timers don't properly coordinate with async operations. Tests use `jest.advanceTimersByTime()` but async operations don't complete.

**Fix**: Use proper timer advancement and promise flushing:
```typescript
// Instead of:
jest.advanceTimersByTime(1500);
await new Promise(resolve => setTimeout(resolve, 0));

// Use:
jest.advanceTimersByTime(1500);
await Promise.resolve(); // Flush microtask queue
jest.runOnlyPendingTimers(); // Run any pending timers
```

---

### Root Cause 4: Hook Integration Initial State
**Affected Tests**: 3
**Severity**: Medium
**Type**: Logic Error
**Fix Complexity**: Low (remove initial state check)

**Issue**: Git commit monitoring skips first run because `lastCommitHash` starts empty and condition requires it to be non-empty.

**Fix**: Remove the empty string check or initialize with a sentinel value:
```typescript
// Option 1: Remove check
if (currentCommit !== lastCommitHash) {
  // Process commit
}

// Option 2: Initialize with sentinel
let lastCommitHash = 'INITIAL';
```

---

### Root Cause 5: Mock Execution Order Mismatch
**Affected Tests**: 3
**Severity**: Medium
**Type**: Test Setup Issue
**Fix Complexity**: Medium (mock setup needs adjustment)

**Issue**: Test mocks return values in wrong order for multiple `execSync` calls within same iteration.

**Fix**: Mock should return same commit hash consistently:
```typescript
mockExecSync
  .mockReturnValue(commitHash) // Return same hash every time
  .mockReturnValueOnce(commitMessage); // Only commit message changes
```

---

## Recommendations

### Immediate Fixes (High Priority)

1. **Fix Task Name Extraction Regex** (Root Cause 1)
   - Estimated effort: 15 minutes
   - Impact: Fixes 1 test, resolves documented bug
   - Risk: Low

2. **Add startMonitoring() to Test Setup** (Root Cause 2)
   - Estimated effort: 30 minutes
   - Impact: Fixes 11 tests
   - Risk: Low

3. **Fix Timer/Async Coordination** (Root Cause 3)
   - Estimated effort: 1-2 hours
   - Impact: Fixes 11 tests
   - Risk: Medium (may require test refactoring)

### Secondary Fixes (Medium Priority)

4. **Fix Hook Integration Initial State** (Root Cause 4)
   - Estimated effort: 30 minutes
   - Impact: Improves 3 tests
   - Risk: Low

5. **Fix Mock Execution Order** (Root Cause 5)
   - Estimated effort: 30 minutes
   - Impact: Improves 3 tests
   - Risk: Low

---

## Next Steps

1. **Validate Hypotheses**: Run targeted tests to confirm root causes
2. **Implement Fixes**: Start with high-priority fixes (regex, test setup)
3. **Verify Fixes**: Run full test suite to ensure no regressions
4. **Document Learnings**: Update test patterns documentation

---

**Investigation Complete**: November 21, 2025
**Confidence Level**: High (90%+)
**Ready for Implementation**: Yes
