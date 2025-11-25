/**
 * Test script to validate the regex fix for task name extraction
 * Tests both formats: with period (real tasks.md) and without period (test fixtures)
 */

// Test the new regex pattern: ${taskNumber}\\.?\\s+(.+)$
function testRegexPattern(taskNumber, line) {
  const pattern = new RegExp(`^- \\[ \\] ${taskNumber}\\.?\\s+(.+)$`);
  const match = line.match(pattern);
  return match ? match[1] : null;
}

console.log('=== Testing Regex Fix ===\n');

// Test Format WITH Period (Real tasks.md format)
console.log('Format WITH Period (Real tasks.md):');
console.log('-----------------------------------');

const withPeriodLines = [
  '- [ ] 1. Fix Task Name Extraction Regex Bug',
  '- [ ] 1.1 Validate Group 2 root cause',
  '- [ ] 10. Build System Foundation',
  '- [ ] 10.1 Set up project structure',
  '- [ ] 100. Complete Feature Implementation',
  '- [ ] 100.1 Implement core functionality'
];

console.log('Parent task 1:', testRegexPattern('1', withPeriodLines[0]));
console.log('Subtask 1.1:', testRegexPattern('1.1', withPeriodLines[1]));
console.log('Parent task 10:', testRegexPattern('10', withPeriodLines[2]));
console.log('Subtask 10.1:', testRegexPattern('10.1', withPeriodLines[3]));
console.log('Parent task 100:', testRegexPattern('100', withPeriodLines[4]));
console.log('Subtask 100.1:', testRegexPattern('100.1', withPeriodLines[5]));

// Test Format WITHOUT Period (Test fixture format)
console.log('\nFormat WITHOUT Period (Test fixtures):');
console.log('--------------------------------------');

const withoutPeriodLines = [
  '- [ ] 1 Fix Task Name Extraction Regex Bug',
  '- [ ] 1.1 Validate Group 2 root cause',
  '- [ ] 10 Build System Foundation',
  '- [ ] 10.1 Set up project structure',
  '- [ ] 100 Complete Feature Implementation',
  '- [ ] 100.1 Implement core functionality'
];

console.log('Parent task 1:', testRegexPattern('1', withoutPeriodLines[0]));
console.log('Subtask 1.1:', testRegexPattern('1.1', withoutPeriodLines[1]));
console.log('Parent task 10:', testRegexPattern('10', withoutPeriodLines[2]));
console.log('Subtask 10.1:', testRegexPattern('10.1', withoutPeriodLines[3]));
console.log('Parent task 100:', testRegexPattern('100', withoutPeriodLines[4]));
console.log('Subtask 100.1:', testRegexPattern('100.1', withoutPeriodLines[5]));

// Test that parent task number doesn't match subtasks
console.log('\nNegative Tests (Should NOT match):');
console.log('----------------------------------');
console.log('Searching for "1" in "- [ ] 1.1 Subtask":', testRegexPattern('1', '- [ ] 1.1 Subtask'));
console.log('Searching for "10" in "- [ ] 10.1 Subtask":', testRegexPattern('10', '- [ ] 10.1 Subtask'));

// Test edge cases
console.log('\nEdge Cases:');
console.log('-----------');
console.log('Task with special chars:', testRegexPattern('1', '- [ ] 1. Fix "critical" bug (urgent)'));
console.log('Task with long name:', testRegexPattern('1', '- [ ] 1. ' + 'A'.repeat(200)));

console.log('\n=== All Tests Complete ===');
