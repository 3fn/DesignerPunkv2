# Design Document: Test Failure Analysis

**Date**: November 21, 2025
**Spec**: test-failure-analysis
**Status**: Design Phase
**Dependencies**: None

---

## Overview

This design establishes a systematic, evidence-based approach to analyzing test failures. The key principle is **investigation without implementation** - we capture current state, investigate root causes, group by underlying issues, and produce a comprehensive analysis report. No code changes are made during this spec.

The output of this spec will inform a future implementation spec that fixes the identified issues.

---

## Architecture

### Investigation-First Approach

```
Current State Capture
    ↓
Root Cause Investigation (per failure)
    ↓
Root Cause Grouping (systematic issues)
    ↓
Priority Assessment
    ↓
Analysis Report Generation
```

**Key Principle**: Understand before fixing. We investigate thoroughly, document evidence, and produce findings that will guide future implementation.

---

## Components and Interfaces

### Test Execution Capture

```typescript
interface TestExecutionResult {
  timestamp: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  suites: TestSuiteResult[];
  executionTime: number;
}

interface TestSuiteResult {
  suiteName: string;
  filePath: string;
  status: 'passed' | 'failed' | 'skipped';
  tests: TestResult[];
}

interface TestResult {
  testName: string;
  status: 'passed' | 'failed' | 'skipped';
  error?: {
    message: string;
    stack: string;
    type: string;
  };
  duration: number;
}
```

### Root Cause Analysis

```typescript
interface RootCauseAnalysis {
  testName: string;
  testFile: string;
  errorMessage: string;
  investigation: {
    testCodeExamined: string[];      // Files examined during investigation
    implementationCodeExamined: string[];
    mockSetupExamined: string[];
  };
  hypotheses: RootCauseHypothesis[];
  likelyRootCause: RootCauseHypothesis;
  evidence: string[];                 // Specific evidence supporting the conclusion
}

interface RootCauseHypothesis {
  cause: string;                      // e.g., "Async operation not awaited"
  likelihood: 'high' | 'medium' | 'low';
  evidence: string[];
  affectedCode: string[];             // Files/functions involved
}
```

### Root Cause Grouping

```typescript
interface RootCauseGroup {
  rootCause: string;                  // e.g., "WorkflowMonitor async handling"
  affectedTests: string[];            // Test names in this group
  testCount: number;
  examples: {
    testName: string;
    errorMessage: string;
    evidence: string;
  }[];
  suggestedFixApproach: string;       // High-level approach (no implementation)
}
```

### Priority Assessment

```typescript
interface PriorityAssessment {
  rootCauseGroup: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  rationale: string;
  impact: {
    testsAffected: number;
    functionalityAtRisk: string[];
    indicatesActualBug: boolean;
  };
  estimatedFixEffort: 'Low' | 'Medium' | 'High';
}
```

---

## Data Models

### Analysis Report

```typescript
interface AnalysisReport {
  reportDate: string;
  executionResult: TestExecutionResult;
  rootCauseAnalyses: RootCauseAnalysis[];
  rootCauseGroups: RootCauseGroup[];
  priorityAssessments: PriorityAssessment[];
  summary: {
    totalFailures: number;
    rootCausesIdentified: number;
    criticalIssues: number;
    highPriorityIssues: number;
    mediumPriorityIssues: number;
    lowPriorityIssues: number;
  };
  recommendations: string[];
}
```

---

## Implementation Approach

### Artifact Location

**Important**: All analysis artifacts should be contained within the spec directory (`.kiro/specs/test-failure-analysis/`) to keep the investigation organized and self-contained. This includes:
- Test execution output files
- Analysis documents
- Root cause investigation files
- Priority assessment documents
- Final analysis report

**Do not** create artifacts in the root directory - move them to the spec directory immediately after creation.

### Phase 1: Current State Capture

**Objective**: Capture ground truth about what's failing right now

**Steps**:
1. Execute `npm test` and capture complete output
2. Parse test results to extract:
   - Failed test names and suite names
   - Exact error messages and stack traces
   - Test counts (passed, failed, skipped)
   - Execution time
3. Compare to documented failures in `.kiro/issues/test-suite-failures.md`
4. Document which documented failures are still present vs resolved

**Output**: `current-failure-state.md` with exact current state (in `.kiro/specs/test-failure-analysis/`)

### Phase 2: Root Cause Investigation

**Objective**: Understand why each test is failing

**Investigation Process** (per failing test):

1. **Examine Test Code**:
   - Read the failing test file
   - Understand what the test is trying to validate
   - Check test setup, mocks, and assertions

2. **Examine Implementation Code**:
   - Read the code being tested
   - Look for recent changes that might affect the test
   - Check if API signatures have changed

3. **Examine Test Setup**:
   - Review mock configurations
   - Check async handling (promises, callbacks, timeouts)
   - Verify test environment setup

4. **Form Hypotheses**:
   - List possible root causes based on evidence
   - Rank by likelihood (high/medium/low)
   - Document specific evidence for each hypothesis

5. **Identify Likely Root Cause**:
   - Select most likely cause based on evidence
   - Document reasoning
   - Note if multiple causes are equally likely

**Output**: Individual root cause analysis for each failing test

### Phase 3: Root Cause Grouping

**Objective**: Group failures by shared underlying issues

**Grouping Logic**:

```typescript
function groupByRootCause(analyses: RootCauseAnalysis[]): RootCauseGroup[] {
  // Group tests that share the same root cause
  // Example groups:
  // - "WorkflowMonitor async operations not completing"
  // - "Mock setup outdated after API changes"
  // - "Test timeouts due to missing jest.setTimeout()"
  
  const groups = new Map<string, RootCauseAnalysis[]>();
  
  for (const analysis of analyses) {
    const rootCause = analysis.likelyRootCause.cause;
    if (!groups.has(rootCause)) {
      groups.set(rootCause, []);
    }
    groups.get(rootCause)!.push(analysis);
  }
  
  return Array.from(groups.entries()).map(([cause, tests]) => ({
    rootCause: cause,
    affectedTests: tests.map(t => t.testName),
    testCount: tests.length,
    examples: tests.slice(0, 3).map(t => ({
      testName: t.testName,
      errorMessage: t.errorMessage,
      evidence: t.evidence[0] || 'See analysis for details'
    })),
    suggestedFixApproach: generateFixApproach(cause, tests)
  }));
}
```

**Output**: Grouped failures by root cause with examples

### Phase 4: Priority Assessment

**Objective**: Determine which root causes are most important to fix

**Priority Criteria**:

**Critical Priority**:
- Affects core functionality
- Indicates actual bugs in production code
- Affects many tests (10+ tests)
- Blocks validation of critical features

**High Priority**:
- Affects important functionality
- May indicate bugs
- Affects moderate number of tests (5-9 tests)
- Impacts confidence in test suite

**Medium Priority**:
- Affects secondary functionality
- Likely test issues, not bugs
- Affects few tests (2-4 tests)
- Doesn't block development

**Low Priority**:
- Affects edge cases
- Definitely test issues, not bugs
- Affects single test
- Minimal impact on development

**Assessment Process**:
1. Evaluate impact (how many tests, what functionality)
2. Determine if root cause indicates actual bug vs test issue
3. Assign priority based on criteria
4. Document rationale for priority assignment
5. Estimate fix effort (Low/Medium/High)

**Output**: Priority assessment for each root cause group

### Phase 5: Analysis Report Generation

**Objective**: Produce comprehensive report with all findings

**Report Structure**:

```markdown
# Test Failure Analysis Report

**Date**: [Date]
**Spec**: test-failure-analysis
**Total Failures Analyzed**: [Count]

## Executive Summary

- Total failing tests: [Count]
- Root causes identified: [Count]
- Critical issues: [Count]
- High priority issues: [Count]
- Medium priority issues: [Count]
- Low priority issues: [Count]

## Current Failure State

[Exact current state with test counts]

## Root Cause Groups

### [Priority] - [Root Cause Name]

**Affected Tests**: [Count]
**Functionality at Risk**: [List]
**Indicates Actual Bug**: [Yes/No]
**Estimated Fix Effort**: [Low/Medium/High]

**Root Cause**: [Detailed explanation]

**Evidence**:
- [Evidence point 1]
- [Evidence point 2]

**Examples**:
1. Test: [Name]
   Error: [Message]
   Evidence: [Specific evidence]

**Suggested Fix Approach**: [High-level approach without implementation]

[Repeat for each root cause group]

## Recommendations

1. [Recommendation 1]
2. [Recommendation 2]
3. [Recommendation 3]

## Next Steps

[Guidance for implementation spec]
```

**Output**: `test-failure-analysis-report.md` with comprehensive findings

---

## Error Handling

### Investigation Challenges

**Scenario**: Unable to determine root cause from available evidence
- **Handling**: Mark as "Requires deeper investigation"
- **Documentation**: Document what was examined and why root cause is unclear
- **Next Steps**: Flag for manual investigation during implementation

**Scenario**: Multiple equally likely root causes
- **Handling**: Document all likely causes
- **Documentation**: Explain why multiple causes are possible
- **Next Steps**: Implementation spec will need to test each hypothesis

**Scenario**: Test failure is intermittent or non-reproducible
- **Handling**: Document intermittent nature
- **Documentation**: Note conditions under which failure occurs
- **Next Steps**: Flag as requiring special attention during fixes

---

## Design Decisions

### Decision 1: Root Cause Investigation Before Grouping

**Options Considered**:
1. Group by error patterns (symptoms) then investigate
2. Investigate root causes then group by underlying issues
3. Investigate and group simultaneously

**Decision**: Investigate root causes then group by underlying issues

**Rationale**:
- Grouping by symptoms (timeouts, assertion failures) is superficial
- Root cause grouping identifies systematic issues
- Multiple symptoms can share one root cause
- Fixes are more effective when addressing root causes

**Trade-offs**:
- ✅ Gained: Systematic understanding of underlying issues
- ✅ Gained: More effective grouping for fixes
- ❌ Lost: Quick categorization by error type
- ⚠️ Risk: Root cause investigation takes more time

**Counter-Arguments**:
- **Argument**: "Grouping by error patterns is faster"
- **Response**: Faster but less useful. Symptom grouping doesn't reveal systematic issues. Root cause grouping enables fixing multiple failures with single solutions.

### Decision 2: No Code Changes During Analysis

**Options Considered**:
1. Fix obvious issues during analysis
2. Strict separation: analysis only, no fixes
3. Fix critical issues, analyze the rest

**Decision**: Strict separation - analysis only, no fixes

**Rationale**:
- Prevents rushing to solutions before understanding problems
- Ensures thorough investigation of all failures
- Analysis quality improves when not distracted by fixing
- Clear separation between investigation and implementation

**Trade-offs**:
- ✅ Gained: Thorough, unrushed investigation
- ✅ Gained: Better understanding of systematic issues
- ❌ Lost: Quick wins from fixing obvious issues
- ⚠️ Risk: Delayed gratification (no passing tests yet)

**Counter-Arguments**:
- **Argument**: "We should fix obvious issues immediately"
- **Response**: "Obvious" issues often aren't once investigated. Finishing analysis first ensures fixes address actual problems, not symptoms.

### Decision 3: Evidence-Based Hypotheses

**Options Considered**:
1. Make educated guesses about root causes
2. Require specific evidence for each hypothesis
3. Use automated tools to detect root causes

**Decision**: Require specific evidence for each hypothesis

**Rationale**:
- Evidence-based analysis is more reliable
- Specific evidence makes findings actionable
- Documentation of evidence helps future debugging
- Prevents assumptions from becoming "facts"

**Trade-offs**:
- ✅ Gained: Reliable, actionable findings
- ✅ Gained: Clear documentation of reasoning
- ❌ Lost: Speed of making quick guesses
- ⚠️ Risk: Some root causes may lack clear evidence

**Counter-Arguments**:
- **Argument**: "Experienced developers can identify root causes quickly"
- **Response**: Experience helps form hypotheses, but evidence validates them. Requiring evidence prevents confident but incorrect assumptions.

---

## Integration Points

### Test Framework (Jest)

**Integration**: Work within existing Jest test execution
- Execute tests via `npm test`
- Parse Jest output for failure information
- No modifications to Jest configuration

### Issue Tracking

**Integration**: Reference `.kiro/issues/test-suite-failures.md`
- Compare current failures to documented failures
- Update issue document with analysis findings
- Link analysis report to issue document

### Future Implementation Spec

**Integration**: Analysis report informs implementation spec
- Root cause groups become fix categories
- Priority assessments guide fix order
- Suggested fix approaches inform implementation design
- Evidence provides context for fixes

---

*This design provides a systematic, evidence-based approach to analyzing test failures through root cause investigation, grouping by underlying issues, and priority assessment - all without making code changes.*
