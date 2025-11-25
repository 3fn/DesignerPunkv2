/**
 * Manual test script to validate the regex pattern behavior
 * for task name extraction in WorkflowMonitor
 */

// Current regex pattern from WorkflowMonitor.ts
function extractTaskNameCurrent(tasksContent, taskNumber) {
  const lines = tasksContent.split('\n');
  
  for (const line of lines) {
    // Current pattern: uses negative lookahead (?!\.) to prevent subtask matching
    const taskMatch = line.match(new RegExp(`^- \\[ \\] ${taskNumber}(?!\\.)\\s+(.+)$`));
    if (taskMatch) {
      return taskMatch[1].trim();
    }
  }
  
  return null;
}

// Test cases - Format WITH period after task number (actual tasks.md format)
const tasksContentWithPeriod = `
# Implementation Plan

- [ ] 1. Fix Task Name Extraction Regex Bug
  **Type**: Parent
  - [ ] 1.1 Update regex pattern
  - [ ] 1.2 Verify commit message generation

- [ ] 10. Build System Foundation
  **Type**: Parent
  - [ ] 10.1 Create directory structure

- [ ] 100. Complete Feature Implementation
  **Type**: Parent
  - [ ] 100.1 Implement core logic
`;

// Test cases - Format WITHOUT period (edge case)
const tasksContentNoPeriod = `
# Implementation Plan

- [ ] 1 Fix Task Name Extraction Regex Bug
  **Type**: Parent
  - [ ] 1.1 Update regex pattern
  - [ ] 1.2 Verify commit message generation

- [ ] 10 Build System Foundation
  **Type**: Parent
  - [ ] 10.1 Create directory structure

- [ ] 100 Complete Feature Implementation
  **Type**: Parent
  - [ ] 100.1 Implement core logic
`;

console.log('=== Testing WITH period after task number (actual tasks.md format) ===\n');

// Test parent tasks
console.log('Parent task 1:', extractTaskNameCurrent(tasksContentWithPeriod, '1'));
console.log('Expected: "Fix Task Name Extraction Regex Bug"');
console.log('Match:', extractTaskNameCurrent(tasksContentWithPeriod, '1') === 'Fix Task Name Extraction Regex Bug' ? '✓' : '✗');
console.log('');

console.log('Parent task 10:', extractTaskNameCurrent(tasksContentWithPeriod, '10'));
console.log('Expected: "Build System Foundation"');
console.log('Match:', extractTaskNameCurrent(tasksContentWithPeriod, '10') === 'Build System Foundation' ? '✓' : '✗');
console.log('');

console.log('Parent task 100:', extractTaskNameCurrent(tasksContentWithPeriod, '100'));
console.log('Expected: "Complete Feature Implementation"');
console.log('Match:', extractTaskNameCurrent(tasksContentWithPeriod, '100') === 'Complete Feature Implementation' ? '✓' : '✗');
console.log('');

// Test subtasks
console.log('Subtask 1.1:', extractTaskNameCurrent(tasksContentWithPeriod, '1.1'));
console.log('Expected: "Update regex pattern"');
console.log('Match:', extractTaskNameCurrent(tasksContentWithPeriod, '1.1') === 'Update regex pattern' ? '✓' : '✗');
console.log('');

console.log('Subtask 1.2:', extractTaskNameCurrent(tasksContentWithPeriod, '1.2'));
console.log('Expected: "Verify commit message generation"');
console.log('Match:', extractTaskNameCurrent(tasksContentWithPeriod, '1.2') === 'Verify commit message generation' ? '✓' : '✗');
console.log('');

console.log('Subtask 10.1:', extractTaskNameCurrent(tasksContentWithPeriod, '10.1'));
console.log('Expected: "Create directory structure"');
console.log('Match:', extractTaskNameCurrent(tasksContentWithPeriod, '10.1') === 'Create directory structure' ? '✓' : '✗');
console.log('');

console.log('Subtask 100.1:', extractTaskNameCurrent(tasksContentWithPeriod, '100.1'));
console.log('Expected: "Implement core logic"');
console.log('Match:', extractTaskNameCurrent(tasksContentWithPeriod, '100.1') === 'Implement core logic' ? '✓' : '✗');
console.log('');

console.log('\n=== Testing WITHOUT period after task number (edge case) ===\n');

console.log('Parent task 1:', extractTaskNameCurrent(tasksContentNoPeriod, '1'));
console.log('Expected: "Fix Task Name Extraction Regex Bug"');
console.log('Match:', extractTaskNameCurrent(tasksContentNoPeriod, '1') === 'Fix Task Name Extraction Regex Bug' ? '✓' : '✗');
console.log('');

console.log('Parent task 10:', extractTaskNameCurrent(tasksContentNoPeriod, '10'));
console.log('Expected: "Build System Foundation"');
console.log('Match:', extractTaskNameCurrent(tasksContentNoPeriod, '10') === 'Build System Foundation' ? '✓' : '✗');
console.log('');

// Test edge cases
const edgeCaseContent = `
- [ ] 1 Task One
- [ ] 1.1 Task One Point One
- [ ] 1.10 Task One Point Ten
- [ ] 10 Task Ten
- [ ] 10.1 Task Ten Point One
- [ ] 100 Task One Hundred
- [ ] 100.1 Task One Hundred Point One
`;

console.log('\nEdge case testing:\n');
console.log('Task 1:', extractTaskNameCurrent(edgeCaseContent, '1'));
console.log('Expected: "Task One" (should NOT match 1.1 or 1.10)');
console.log('');

console.log('Task 10:', extractTaskNameCurrent(edgeCaseContent, '10'));
console.log('Expected: "Task Ten" (should NOT match 10.1)');
console.log('');

console.log('Task 100:', extractTaskNameCurrent(edgeCaseContent, '100'));
console.log('Expected: "Task One Hundred" (should NOT match 100.1)');
console.log('');

console.log('Task 1.10:', extractTaskNameCurrent(edgeCaseContent, '1.10'));
console.log('Expected: "Task One Point Ten"');
console.log('');
