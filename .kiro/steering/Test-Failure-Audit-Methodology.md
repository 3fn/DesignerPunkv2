---
inclusion: manual
name: Test-Failure-Audit-Methodology
description: Reusable methodology for conducting test failure audits — workflow steps, pattern identification, severity classification, clean exit audit requirements, and performance investigation protocol. Load when conducting test failure audits, completing specs with clean exit audits, or investigating performance issues.
---

# Test Failure Audit Methodology

**Date**: 2025-12-26
**Last Reviewed**: 2025-12-26
**Purpose**: Reusable methodology guidance for conducting test failure audits, including workflow steps, pattern identification, and lessons learned from Specs 025/026/029
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 2
**Relevant Tasks**: test-failure-audit, test-quality, spec-completion

---

## AI Agent Reading Priorities

**This document provides methodology guidance for test failure audits. Read strategically based on your current task.**

### WHEN Conducting a Test Failure Audit
**Focus on:**
- **Audit Workflow** - Step-by-step process
- **Pattern Identification Techniques** - How to group failures
- **Failure Lineage Tracking** - Categorizing failure history
- **Findings Document Template** - Standard format for documenting findings

### WHEN Completing a Spec (Clean Exit Audit)
**Focus on:**
- **Clean Exit Audit Requirement** - Mandatory process before spec closure
- **Issue Registry Maintenance** - Tracking discovered issues

### WHEN Investigating Performance Issues
**Focus on:**
- **Performance Investigation Protocol** - Steps before adjusting timeouts

### WHEN Learning from Past Audits
**Focus on:**
- **Lessons Learned** - Insights from 025/026/029 experiences

---

## Introduction

This document provides reusable methodology guidance for conducting test failure audits. It captures the systematic approach developed through Specs 025 (Test Suite Overhaul), 026 (Test Failure Resolution), and 029 (Test Failure Audit), enabling future audits to benefit from proven patterns and avoid reinventing the wheel.

**Key Principles:**
- **Audit-Only Scope**: Diagnosis before treatment - audits produce documentation, not code changes
- **Pattern-Based Analysis**: Group failures by root cause, not by test file
- **Lineage-Aware**: Track failure history to inform strategy
- **Investigation-First**: Understand root causes before recommending solutions
- **Human-Gated**: Confirmation checkpoint before implementing fixes

---

## When to Run a Test Failure Audit

A test failure audit should be conducted when:

1. **Significant Test Failures Accumulate**: When the number of failing tests exceeds a threshold that impacts development velocity (e.g., 20+ failures across multiple suites)

2. **After Major Refactoring**: Following significant architectural changes that may have introduced test regressions

3. **Before Major Releases**: To ensure test suite health before shipping

4. **When Previous Fix Attempts Failed**: When multiple specs have attempted to fix failures without achieving zero failures

5. **When Failure Patterns Are Unclear**: When it's not obvious whether failures are test issues, code bugs, or environmental problems

**Key Indicator**: If you find yourself repeatedly encountering the same failures across multiple development sessions, it's time for a systematic audit rather than ad-hoc fixes.

---

## Audit Workflow Steps

The audit workflow follows a four-phase process: Audit → Findings → Confirmation → Deliverables.

### Phase 1: Audit (Catalog and Analyze)

**Step 1.1: Capture Complete Test Output**

Run the full test suite and capture complete output:

```bash
npm test 2>&1 | tee test-output.txt
```

Document the test run metadata:
- Date and timestamp
- Total test suites (passing/failing)
- Total tests (passing/failing/skipped)
- Total execution time

**Step 1.2: Catalog Each Failing Test**

For each failing test, document:
- **Test file path**: Full path to the test file
- **Test name**: Complete test name including describe blocks
- **Error type**: The assertion or error type (e.g., `expect().toBe()`, `Timeout`, `Error thrown`)
- **Error message**: The specific error message
- **Stack trace context**: Relevant line numbers and context

**Step 1.3: Group Failures by Pattern**

Identify shared root causes across test files:
- Failures with the **same error message** → Single pattern
- Failures with the **same error type + similar context** → Related pattern
- Failures in the **same test file** → Potentially same pattern

Create pattern entries with:
- Pattern ID (P1, P2, etc.)
- Pattern name (descriptive)
- Root cause description
- Affected test count
- Example failures (3-5 representative examples)

**Step 1.4: Track Failure Lineage**

Compare current failures against previous audit findings (if available):

| Lineage Category | Definition | Implication |
|------------------|------------|-------------|
| **Stable** | Present in previous audits, never fixed | May need different approach |
| **Fixed-then-regressed** | Was fixed, now failing again | Identify what broke it |
| **Newly-surfaced** | Appeared after a fix (was masked) | Often good - reveals hidden issues |
| **Cascading** | Expected consequence of another fix | Address root cause first |
| **True-new** | First appearance, unrelated to previous work | Standard fix approach |

**Step 1.5: Investigate Performance Patterns**

For patterns involving performance timeouts:
1. Baseline actual execution time (not just "exceeded limit")
2. Identify bottleneck source (git operations, file I/O, analysis logic)
3. Determine scale relationship (linear, exponential, constant)
4. Compare to original baseline when limit was set (if available)

Apply decision framework:
- If inefficiency → recommend code optimization
- If legitimate scale → recommend threshold adjustment with justification
- If unclear → flag for further investigation

### Phase 2: Findings (Document Analysis)

**Step 2.1: Create Findings Document**

Create `findings/test-failure-audit-findings.md` with:
- Header (date, spec, test run timestamp)
- Summary table (all failures with pattern assignment)
- Detailed failure catalog (each failure with metadata)
- Pattern details (each pattern with full analysis)

**Step 2.2: Document Each Pattern**

For each pattern, document:
- **Pattern name and description**: Clear, descriptive name
- **Root cause analysis**: Why these tests are failing
- **Failure lineage category**: History of this pattern
- **Affected test count**: Number of tests in this pattern
- **Example failures with file paths**: Representative examples
- **Recommendation**: One of:
  - Fix Test (test checks right thing wrong way)
  - Fix Code (test reveals actual bug)
  - Fix Environment (test environment configuration issue)
  - Adjust Expectations (test assertions too strict/loose)
  - Investigate (unclear if test or code issue)
  - Defer (known issue, not blocking, address later)
- **Rationale**: Why this recommendation makes sense

**Step 2.3: Flag Potential Bugs**

Explicitly flag patterns that may reveal real bugs:
- Evidence for why this might be a real bug
- Recommendation for investigation or fix

### Phase 3: Confirmation (Human Review)

**Step 3.1: Present Findings for Review**

Present the findings document to the human reviewer, highlighting:
- Patterns requiring decision (e.g., optimize vs adjust threshold)
- Patterns flagged as potential bugs
- Stable failures that may need different approach

**Step 3.2: Incorporate Feedback**

Based on human review:
- Adjust recommendations as directed
- Document decisions made with rationale
- Resolve any ambiguous patterns

**Step 3.3: Create Confirmed Actions Document**

Create `findings/test-failure-confirmed-actions.md` with:
- Summary table by action category
- Confirmed actions in priority order
- Deferred actions with rationale
- Decisions made with rationale

### Phase 4: Deliverables (Implementation Plan)

**Step 4.1: Create Implementation Spec**

Create a new spec (e.g., `030-test-failure-fixes`) with:
- Design-outline based on confirmed actions only
- Prioritized fix order considering:
  - Test count affected
  - Severity of issue
  - Dependencies between patterns
- Success criteria (all tests passing, no regressions)

**Step 4.2: Update Methodology (Optional)**

If the audit revealed new patterns or techniques:
- Update this methodology document
- Add lessons learned
- Refine workflow steps

---

## Pattern Identification Techniques

### Technique 1: Error Message Clustering

Group failures by exact error message match:
```
"Expected: < 10000, Received: 10006" → Performance threshold pattern
"Multiplier reference is undefined" → Undefined reference pattern
```

### Technique 2: Error Type Grouping

Group by assertion type:
- `expect().toBe()` - Value mismatch
- `expect().toContain()` - Missing element
- `expect().toEqual()` - Object mismatch
- `Timeout` - Performance/async issues
- `Error thrown` - Runtime errors

### Technique 3: File Path Analysis

Group by test file location:
- Same test file → Likely same root cause
- Same directory → Potentially related subsystem
- Same component → Component-specific issue

### Technique 4: Lineage Comparison

Compare against previous audit findings:
- Match by test name
- Match by error message
- Match by file path

### Technique 5: Root Cause Tracing

For each pattern, trace to root cause:
1. What is the test checking?
2. What is the actual behavior?
3. Is the test correct or is the code wrong?
4. What would fix this?

---

## Findings Document Template

```markdown
# Test Failure Audit Findings

**Date**: [Audit Date]
**Spec**: [Spec Number] - [Spec Name]
**Test Run**: [Timestamp]
**Summary**: [X] patterns identified across [Y] failing tests

---

## Summary Table

| # | Test File Path | Test Name | Error Type | Lineage |
|---|----------------|-----------|------------|---------|
| 1 | `path/to/test.ts` | Test name | Error type | Lineage |
| ... | ... | ... | ... | ... |

---

## Detailed Failure Catalog

### Failure 1: [Brief Description]

**Test File Path**: `path/to/test.ts`
**Test Name**: `Describe Block › Test Name`
**Error Type**: `expect().toBe()` - Value mismatch
**Error Message**: Expected X, Received Y
**Stack Trace Context**: Line N - relevant context

---

## Pattern Details

### Pattern P1: [Pattern Name]

**Root Cause Analysis**: [Description of underlying issue]

**Failure Lineage Category**: [Stable/Fixed-then-regressed/Newly-surfaced/Cascading/True-new]
- [Context about history, previous attempts if applicable]

**Affected Test Count**: [N] tests

**Example Failures with File Paths**:
1. `path/to/test.ts:LN` - Brief description
2. `path/to/test.ts:LN` - Brief description
3. `path/to/test.ts:LN` - Brief description

**Recommendation**: [Fix Test / Fix Code / Fix Environment / Adjust Expectations / Investigate / Defer]

**Rationale**: [Why this recommendation makes sense]

**[If Performance Pattern] Investigation Findings**:
- Actual execution time: [X]ms
- Current threshold: [Y]ms
- Bottleneck source: [Source]
- Scale relationship: [Relationship]
- Decision: [Optimize code / Adjust threshold / Investigate further]
- Justification: [Why this decision]

**[If Bug Flag] Potential Bug**:
- Evidence: [Why this might be a real bug]
- Recommendation: [Investigate / Fix in scope / Separate task]

---

## Patterns Requiring Decision

[List patterns where human input is needed]

## Potential Bugs Flagged

[List patterns that may reveal real bugs]

## Deferred Patterns

[List patterns recommended for deferral with rationale]
```

---

## Failure Lineage Tracking Approach

### Purpose

Lineage tracking answers: "Have we seen this failure before, and what happened when we tried to fix it?"

### Lineage Categories

| Category | Definition | Action Implication |
|----------|------------|-------------------|
| **Stable** | Present in multiple previous audits, never successfully fixed | Consider different approach; may need architectural change |
| **Fixed-then-regressed** | Was fixed in previous spec, now failing again | Identify what broke it; may need regression test |
| **Newly-surfaced** | Appeared after a fix (was masked by other failures) | Often positive - reveals hidden issues; standard fix |
| **Cascading** | Expected consequence of another fix | Address root cause first; may resolve automatically |
| **True-new** | First appearance, unrelated to previous work | Standard fix approach |

### Tracking Process

1. **Gather Previous Findings**: Collect findings documents from previous audits (e.g., Spec 025, 026)

2. **Match by Test Name**: For each current failure, search previous findings for matching test names

3. **Match by Error Message**: If test name doesn't match, search for similar error messages

4. **Match by Pattern**: If no direct match, check if failure fits a previously identified pattern

5. **Assign Lineage**: Based on matches, assign appropriate lineage category

6. **Document History**: For stable/regressed patterns, document what was tried before

### Example Lineage Documentation

```markdown
**Failure Lineage Category**: **Stable** (025 Pattern 6 → 026 → 029)
- Spec 025: Identified as Pattern 6 (Build System Token Generation Failures)
- Spec 026: Not directly addressed
- Spec 029: Still failing - same root cause

**Previous Fix Attempts**:
- Spec 025: Recommended "Fix Test" but not implemented
- Spec 026: Deferred due to scope constraints
```

### Benefits of Lineage Tracking

1. **Prevents Repeated Failures**: Identifies patterns that keep recurring
2. **Informs Strategy**: Stable failures may need different approach
3. **Measures Progress**: Shows which patterns have been successfully resolved
4. **Preserves Knowledge**: Documents what was tried and why it didn't work

---

## Clean Exit Audit Requirement

The Clean Exit Audit is a **mandatory process** that must be completed before any spec can be closed. This requirement exists to prevent issue accumulation and ensure explicit accountability for all discovered problems.

### Why This Is Mandatory

**The Problem**: AI agents (and humans) naturally stay focused on their assigned task—which is good for productivity. However, this focus can lead to "sidestepping" unrelated issues discovered during work. When issues are noticed but not documented, they accumulate silently until a dedicated cleanup spec (like Spec 029) becomes necessary.

**The Evidence**: Specs 025, 026, and 029 demonstrate this pattern:
- Issues discovered in one spec were not documented
- The same issues appeared in subsequent specs
- Eventually, a dedicated audit spec was required to address accumulated problems
- This represents wasted effort that could have been prevented

**The Solution**: By mandating a clean exit audit, we:
- Force explicit decisions about every discovered issue
- Create accountability for issue accumulation
- Prevent the "I'll just ignore that" pattern
- Reduce the need for future dedicated cleanup specs

### Issue Registry Maintenance Requirement

**Requirement**: Any issues discovered during spec work MUST be logged to an issues registry.

**What Constitutes an Issue**:
- Test failures (new or existing)
- Code bugs discovered during implementation
- Configuration problems
- Documentation gaps
- Technical debt that blocks or complicates work
- Environment issues affecting development

**What Is NOT an Issue** (see Opportunity Logging):
- Optimization opportunities
- Style preferences
- "Nice to have" improvements
- Refactoring ideas

**Registry Format**:

Issues should be logged in `.kiro/issues/issues-registry.md` (or spec-specific location) with:

```markdown
## Issue [ID]: [Brief Description]

**Discovered**: [Date]
**Discovered During**: Spec [Number] - [Name], Task [N.M]
**Severity**: Critical / High / Medium / Low
**Type**: Test Failure / Code Bug / Configuration / Documentation / Technical Debt / Environment

**Description**:
[Clear description of the issue]

**Evidence**:
[Error messages, test output, or other evidence]

**Status**: Open / Resolved / Deferred
**Resolution**: [If resolved, how it was fixed]
**Deferral Rationale**: [If deferred, why and where it should be addressed]
```

**Maintenance Responsibilities**:
1. **During Spec Work**: Log issues as they are discovered
2. **Before Spec Closure**: Review registry for completeness
3. **At Spec Closure**: Ensure all issues have a status (Resolved or Deferred)

### Exit Audit Before Spec Closure Requirement

**Requirement**: Before marking a spec as complete, an exit audit MUST be performed.

**Exit Audit Steps**:

1. **Run Full Test Suite**
   ```bash
   npm test
   ```
   Document the results:
   - Total test suites (passing/failing)
   - Total tests (passing/failing/skipped)
   - Any new failures since spec started

2. **Compare to Baseline**
   - What was the test status when the spec started?
   - Are there any new failures introduced by this spec?
   - Are there any failures that should have been fixed but weren't?

3. **Review Issues Registry**
   - Are all discovered issues logged?
   - Does each issue have a status?
   - Are deferral rationales documented?

4. **Document Exit Audit Results**
   
   In the spec's completion documentation, include:
   ```markdown
   ## Exit Audit Results
   
   **Test Suite Status**:
   - Suites: [X] passing, [Y] failing
   - Tests: [X] passing, [Y] failing, [Z] skipped
   
   **Comparison to Baseline**:
   - New failures introduced: [None / List]
   - Failures resolved: [List]
   - Net change: [+/-N failures]
   
   **Issues Registry Status**:
   - Total issues logged: [N]
   - Resolved: [N]
   - Deferred: [N]
   
   **Exit Audit Passed**: [Yes/No]
   ```

**When Exit Audit Fails**:
- If new failures were introduced, they must be resolved or explicitly deferred
- If issues are undocumented, they must be logged
- Spec cannot close until exit audit passes

### Resolution or Explicit Deferral Requirement

**Requirement**: Every discovered issue MUST be either resolved within the spec OR explicitly deferred with documented rationale.

**Resolution Path**:

When an issue can be resolved within the spec:
1. Fix the issue as part of the spec work
2. Update the issues registry with resolution details
3. Verify the fix (run tests, validate behavior)
4. Mark issue as "Resolved"

**Deferral Path**:

When an issue cannot or should not be resolved within the spec:
1. Document why deferral is appropriate:
   - Out of scope for current spec
   - Requires architectural changes beyond spec scope
   - Blocked by external dependencies
   - Lower priority than spec objectives
   - Requires investigation before fix can be determined
2. Specify where the issue should be addressed:
   - Specific future spec number
   - Backlog for prioritization
   - Separate investigation task
3. Mark issue as "Deferred" with rationale

**Deferral Rationale Requirements**:

A valid deferral rationale MUST include:
- **Why**: Clear explanation of why the issue cannot be resolved now
- **Where**: Where the issue should be addressed (specific spec, backlog, etc.)
- **Impact**: What is the impact of deferring (blocking, degraded experience, technical debt)

**Example Valid Deferral**:
```markdown
**Status**: Deferred
**Deferral Rationale**: 
- **Why**: This performance issue requires profiling and optimization work that is outside the scope of this audit-only spec. The audit identified the issue but cannot implement fixes.
- **Where**: Spec 030 - Test Failure Fixes (Pattern P9)
- **Impact**: Performance tests will continue to fail until addressed. Not blocking other development.
```

**Example Invalid Deferral**:
```markdown
**Status**: Deferred
**Deferral Rationale**: Will fix later.
```
This is invalid because it lacks specificity about why, where, and impact.

### No Silent Ignoring Policy

**Requirement**: A spec CANNOT close with undocumented issues. Every issue must be explicitly acknowledged.

**What "Silent Ignoring" Looks Like**:
- Noticing a test failure but not logging it
- Seeing an error message but not investigating
- Encountering a bug but working around it without documentation
- Discovering technical debt but not recording it
- Observing configuration problems but not reporting them

**Why Silent Ignoring Is Prohibited**:
1. **Knowledge Loss**: Undocumented issues are forgotten and rediscovered later
2. **Accountability Gap**: No one is responsible for issues that aren't logged
3. **Accumulation**: Silent issues accumulate until they require dedicated cleanup
4. **Wasted Effort**: Future developers will spend time rediscovering known issues

**Enforcement Mechanism**:

The exit audit serves as the enforcement mechanism:
- Exit audit requires running full test suite
- Any failures must be in the issues registry
- Any issues discovered during spec work must be logged
- Spec cannot close until all issues are documented

**What To Do When You Discover an Issue**:

1. **Stop and Log**: Take 2 minutes to log the issue in the registry
2. **Assess Scope**: Is this within spec scope or out of scope?
3. **Decide Path**: Resolve now or defer with rationale
4. **Continue Work**: Resume your task with the issue documented

**The 2-Minute Rule**: If logging an issue takes more than 2 minutes, you're over-documenting. Keep entries concise but complete.

### Rationale for Mandatory Status

The Clean Exit Audit is mandatory (not optional) for the following reasons:

**1. Prevents Issue Accumulation**

Without mandatory exit audits, issues accumulate silently. Specs 025, 026, and 029 demonstrate this pattern—each spec discovered issues that should have been caught earlier. Mandatory audits break this cycle.

**2. Creates Explicit Accountability**

When exit audits are optional, there's no accountability for discovered issues. Making them mandatory ensures someone is responsible for every issue—either resolving it or explicitly deferring it.

**3. Front-Loads Overhead**

The overhead of exit audits is minimal when issues are addressed during spec work. The alternative—dedicated cleanup specs—is far more expensive. Mandatory audits front-load small overhead to prevent large cleanup efforts.

**4. Preserves Institutional Knowledge**

Issues discovered but not documented are lost knowledge. Mandatory logging ensures that discoveries are preserved for future reference, even if they're deferred.

**5. Enables Informed Prioritization**

A well-maintained issues registry enables informed prioritization. Without it, decisions are made without full knowledge of outstanding problems.

**6. Reduces Cognitive Load**

When issues are documented, developers don't need to remember them. The registry serves as external memory, reducing cognitive load and preventing issues from being forgotten.

### Lightweight Implementation

The Clean Exit Audit is designed to be lightweight when issues are addressed during spec work:

**During Normal Spec Work**:
- Log issues as discovered (2 minutes each)
- Resolve issues when possible
- Defer with rationale when necessary

**At Spec Closure**:
- Run test suite (already part of validation)
- Review issues registry (5 minutes)
- Document exit audit results (5 minutes)

**Total Overhead**: ~10-15 minutes at spec closure, plus 2 minutes per issue discovered during work.

**When Overhead Increases**:
- If many issues were not logged during work → More time needed at closure
- If issues were silently ignored → Exit audit will fail, requiring remediation

**The Key Insight**: The overhead is proportional to how well issues were managed during the spec. Good issue hygiene during work means minimal overhead at closure.

---

## Opportunity Logging (Optional Practice)

Opportunity Logging is an **optional practice** for capturing optimization opportunities, improvement ideas, and "nice to have" enhancements discovered during spec work. Unlike the Clean Exit Audit (which is mandatory), Opportunity Logging is a lightweight, voluntary practice that preserves institutional knowledge without creating overhead.

### Why This Is Optional (Not Mandatory)

**The Distinction**: Issues and opportunities are fundamentally different:

| Aspect | Issues (Mandatory) | Opportunities (Optional) |
|--------|-------------------|-------------------------|
| **Nature** | Problems that block or degrade functionality | Improvements that would enhance functionality |
| **Urgency** | Must be addressed or explicitly deferred | Can be addressed when convenient |
| **Impact of Ignoring** | Accumulates technical debt, causes regressions | Misses potential improvements |
| **Overhead** | Worth the overhead to prevent problems | Overhead may exceed benefit |

**Rationale for Optional Status**:

1. **Overhead vs. Value**: Mandatory opportunity logging would create overhead that may exceed the value captured. Issues must be logged because ignoring them causes problems; opportunities can be safely forgotten without immediate harm.

2. **Focus Preservation**: Requiring opportunity logging could distract from primary spec objectives. The Clean Exit Audit already ensures issues are addressed; adding mandatory opportunity logging would dilute focus.

3. **Natural Discovery**: Good opportunities tend to resurface naturally when they become relevant. Unlike issues (which accumulate silently), opportunities often re-emerge when the relevant code is touched again.

4. **Developer Judgment**: Developers are best positioned to judge which opportunities are worth recording. Making it optional respects this judgment rather than imposing blanket requirements.

5. **Avoiding Backlog Bloat**: Mandatory opportunity logging tends to create large backlogs of "nice to have" items that are never addressed. Optional logging encourages recording only high-value opportunities.

### Separate Registry from Issues

**Requirement**: Opportunities MUST be logged separately from issues.

**Why Separate Registries**:

1. **Different Lifecycles**: Issues require resolution or explicit deferral; opportunities can remain open indefinitely without harm.

2. **Different Prioritization**: Issues are prioritized by severity and impact; opportunities are prioritized by value and effort.

3. **Different Review Cadence**: Issues should be reviewed at spec closure (exit audit); opportunities can be reviewed periodically or when relevant.

4. **Prevents Confusion**: Mixing issues and opportunities makes it unclear what requires action vs. what is optional.

**Registry Location**:

Opportunities should be logged in `.kiro/opportunities/opportunities-registry.md` (or spec-specific location), separate from the issues registry at `.kiro/issues/issues-registry.md`.

**Example Registry Structure**:

```markdown
# Opportunities Registry

**Last Updated**: [Date]
**Total Opportunities**: [N]

---

## Opportunity [ID]: [Brief Description]

**Discovered**: [Date]
**Discovered During**: Spec [Number] - [Name], Task [N.M]
**Category**: Performance / Code Quality / Developer Experience / Architecture / Testing
**Estimated Value**: High / Medium / Low
**Estimated Effort**: High / Medium / Low

**Description**:
[Clear description of the opportunity]

**Potential Benefits**:
- [Benefit 1]
- [Benefit 2]

**Status**: Open / Implemented / Declined
**Implementation**: [If implemented, where and when]
**Decline Rationale**: [If declined, why]
```

### Lightweight Format

**Principle**: Opportunity logging should take no more than 2-3 minutes per entry.

**Minimum Required Fields**:

For a valid opportunity entry, only these fields are required:
- **ID**: Unique identifier (e.g., OPP-001)
- **Brief Description**: One-line summary
- **Discovered**: Date discovered
- **Category**: Type of opportunity
- **Description**: 2-3 sentences explaining the opportunity

**Optional Fields** (add if valuable):

- **Discovered During**: Spec and task context
- **Estimated Value/Effort**: Quick assessment
- **Potential Benefits**: List of benefits
- **Related Code**: File paths or components affected

**Example Minimal Entry**:

```markdown
## OPP-042: Cache token validation results

**Discovered**: 2025-12-26
**Category**: Performance
**Description**: Token validation is called multiple times during build. Caching validation results could reduce build time by ~15%.
```

**Example Detailed Entry** (when warranted):

```markdown
## OPP-043: Refactor release analysis to use streaming

**Discovered**: 2025-12-26
**Discovered During**: Spec 029 - Test Failure Audit, Task 1.4
**Category**: Performance
**Estimated Value**: High
**Estimated Effort**: Medium

**Description**: 
The release analysis system loads entire git history into memory before processing. Refactoring to use streaming would reduce memory usage and enable analysis of larger repositories.

**Potential Benefits**:
- Reduced memory footprint during analysis
- Ability to analyze repositories with longer history
- Faster startup time (no upfront loading)

**Related Code**: 
- `src/release-analysis/git-operations.ts`
- `src/release-analysis/history-analyzer.ts`
```

### Threshold for Recording

**Guidance**: Not every improvement idea is worth recording. Use these thresholds to decide what to log.

**Record When**:

1. **Significant Impact**: The opportunity would meaningfully improve performance, code quality, or developer experience
   - Example: "Caching could reduce build time by 30%"
   - Example: "Refactoring would eliminate 500 lines of duplicate code"

2. **Non-Obvious Discovery**: The opportunity required investigation or insight to discover
   - Example: "Profiling revealed unexpected bottleneck in token validation"
   - Example: "Cross-referencing specs showed pattern that could be abstracted"

3. **Future Relevance**: The opportunity is likely to be relevant when the related code is touched again
   - Example: "When we add new token types, this abstraction would simplify the work"
   - Example: "Next time we optimize builds, this should be considered"

4. **Knowledge Preservation**: The opportunity captures institutional knowledge that would be lost otherwise
   - Example: "This approach was considered but rejected because X; if X changes, reconsider"
   - Example: "This workaround exists because of Y; when Y is fixed, this can be simplified"

**Don't Record When**:

1. **Trivial Improvements**: The opportunity is minor and obvious
   - Example: "Could rename this variable to be clearer" (just do it or skip it)
   - Example: "Could add a comment here" (just do it or skip it)

2. **Style Preferences**: The opportunity is a matter of preference, not objective improvement
   - Example: "I prefer tabs over spaces" (not an opportunity)
   - Example: "This could use a different design pattern" (unless there's clear benefit)

3. **Already Documented**: The opportunity is already captured elsewhere
   - Example: "This is mentioned in the README" (don't duplicate)
   - Example: "There's already a TODO comment for this" (don't duplicate)

4. **Speculative**: The opportunity is based on speculation rather than evidence
   - Example: "This might be slow" (profile first, then record if confirmed)
   - Example: "Users might want this feature" (validate first, then record if confirmed)

**The 30-Second Rule**: If you can't articulate the opportunity in 30 seconds, it's either not clear enough to record or needs more investigation before recording.

### When to Review Opportunities

Unlike issues (which are reviewed at spec closure), opportunities can be reviewed:

1. **Before Starting Related Work**: When beginning work on a component, check if there are logged opportunities for that area

2. **During Planning**: When planning new specs, review the opportunities registry for relevant items to include

3. **Periodically**: Quarterly review to archive stale opportunities and identify patterns

4. **When Capacity Allows**: During slower periods, review opportunities for quick wins

### Relationship to Clean Exit Audit

**Key Distinction**: The Clean Exit Audit is mandatory and focuses on issues. Opportunity logging is optional and separate.

**At Spec Closure**:
- **Required**: Complete Clean Exit Audit (issues registry, test status, exit audit results)
- **Optional**: Log any opportunities discovered during the spec

**The Exit Audit Does NOT**:
- Require reviewing the opportunities registry
- Require logging opportunities
- Fail if opportunities are not documented

**The Exit Audit DOES**:
- Ensure issues are documented (not opportunities)
- Require resolution or deferral of issues (not opportunities)
- Prevent silent ignoring of issues (opportunities can be silently ignored)

---

## Performance Investigation Protocol

Performance timeout failures require investigation before adjusting thresholds. This protocol ensures that timeout adjustments are justified by evidence rather than convenience, preventing the gradual erosion of performance standards.

### Why Investigation Is Required

**The Problem**: When performance tests fail, the easiest "fix" is to increase the timeout threshold. However, this approach:
- Hides real performance regressions
- Gradually erodes performance standards over time
- Masks inefficiencies that should be optimized
- Creates technical debt that compounds

**The Solution**: Before any threshold adjustment, investigate to determine whether the issue is:
- **Code inefficiency** → Optimize the code
- **Legitimate scale growth** → Adjust threshold with justification
- **Test environment interference** → Adjust test configuration
- **Bug** → Fix the bug

### Investigation Steps

#### Step 1: Baseline Actual Execution Time

Measure the actual execution time outside of the test environment:

```bash
# Create a profiling script to measure operation in isolation
npx ts-node profile-operation.ts
```

**What to measure**:
- Average execution time across multiple runs (10-20 iterations)
- P95 execution time (95th percentile)
- Minimum and maximum times
- Standard deviation (to assess variance)

**Why this matters**: Test frameworks add overhead. Measuring in isolation reveals the true operation performance.

#### Step 2: Compare to Original Baseline

If the original baseline is documented (e.g., in test file comments), compare:

```
Current P95: 1.085ms
Original P95: 0.802ms
Ratio: 1.35x (35% slower)
```

**Interpretation**:
- **< 1.5x**: Within normal variance, likely not a regression
- **1.5x - 2x**: Borderline, investigate further
- **> 2x**: Likely regression, investigate root cause

#### Step 3: Identify Bottleneck Source

Profile the operation to identify where time is spent:

| Bottleneck Source | Indicators | Typical Causes |
|-------------------|------------|----------------|
| **Git operations** | High time in git commands | Large repository, many commits |
| **File I/O** | High time in read/write | Large files, many files, slow disk |
| **Analysis logic** | High time in processing | Inefficient algorithms, unnecessary work |
| **Network** | High time in network calls | External dependencies, latency |
| **Test environment** | High time only in test suite | Jest overhead, concurrent tests |

**Profiling approach**:
```typescript
// Break down operation into components
const start = performance.now();
const step1 = await operation1();
const step1Time = performance.now() - start;

const step2Start = performance.now();
const step2 = await operation2();
const step2Time = performance.now() - step2Start;

console.log(`Step 1: ${step1Time}ms, Step 2: ${step2Time}ms`);
```

#### Step 4: Determine Scale Relationship

Understand how the operation scales:

| Scale Relationship | Behavior | Implication |
|-------------------|----------|-------------|
| **Constant** | Time doesn't grow with input size | Threshold should remain stable |
| **Linear** | Time grows proportionally with input | Threshold may need adjustment as project grows |
| **Exponential** | Time grows faster than input | Optimization required |

**How to test**:
```typescript
// Test with different input sizes
for (const size of [10, 100, 1000]) {
  const time = await measureOperation(size);
  console.log(`Size ${size}: ${time}ms`);
}
```

#### Step 5: Check for Code Changes

Review git history for changes since the baseline was set:

```bash
# Check for changes to the relevant code
git log --oneline --since="YYYY-MM-DD" -- path/to/relevant/code.ts

# Compare current code to baseline
git diff BASELINE_COMMIT..HEAD -- path/to/relevant/code.ts
```

**What to look for**:
- New functionality that adds overhead
- Refactoring that changed performance characteristics
- Dependencies that were updated
- Configuration changes

#### Step 6: Test in Isolation vs Full Suite

Compare performance in isolation vs full test suite:

```bash
# Run specific test in isolation
npm test -- --testPathPatterns="PerformanceTest"

# Run full test suite
npm test
```

**If isolation passes but full suite fails**: The issue is test environment interference, not code performance.

### Decision Framework

Based on investigation findings, apply this decision framework:

```
┌─────────────────────────────────────────────────────────────────┐
│                    INVESTIGATION COMPLETE                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ Is current performance significantly worse than baseline?        │
│ (> 1.5x slower in isolated measurement)                         │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              │ NO                            │ YES
              ▼                               ▼
┌─────────────────────────┐   ┌─────────────────────────────────┐
│ Issue is likely test    │   │ Were there code changes since   │
│ environment, not code   │   │ baseline was set?               │
│                         │   └─────────────────────────────────┘
│ RECOMMENDATION:         │                   │
│ • Adjust test config    │       ┌───────────┴───────────┐
│ • Run perf tests in     │       │ NO                    │ YES
│   isolation             │       ▼                       ▼
│ • OR adjust threshold   │   ┌───────────────┐   ┌─────────────┐
│   for full-suite        │   │ Scale growth  │   │ Code change │
│   overhead              │   │ or env change │   │ caused      │
└─────────────────────────┘   │               │   │ regression  │
                              │ RECOMMENDATION:│   │             │
                              │ • Adjust       │   │ RECOMMEND:  │
                              │   threshold    │   │ • Optimize  │
                              │   with         │   │   code      │
                              │   justification│   │ • Revert    │
                              └───────────────┘   │   change    │
                                                  └─────────────┘
```

### Recommendation Categories

#### Optimize Code

**When to recommend**: Investigation reveals code inefficiency that can be improved.

**Documentation required**:
- Specific inefficiency identified
- Proposed optimization approach
- Expected improvement

**Example**:
```markdown
**Recommendation**: Optimize Code
**Inefficiency**: Token validation is called N times per build, where N = number of tokens
**Proposed Fix**: Cache validation results after first call
**Expected Improvement**: O(N) → O(1) for repeated validations
```

#### Adjust Threshold

**When to recommend**: Investigation confirms legitimate scale growth or environment factors.

**Documentation required**:
- Evidence that code is not inefficient
- Justification for new threshold value
- Comparison to baseline

**Example**:
```markdown
**Recommendation**: Adjust Threshold
**Evidence**: 
- Isolated performance: 1.085ms P95 (within 35% of baseline)
- Full suite performance: 25ms (test environment overhead)
- No code changes since baseline
**Justification**: Test environment overhead causes 25x slowdown in full suite
**New Threshold**: 30ms (allows for environment variance while catching 2x+ regressions)
```

#### Adjust Test Configuration

**When to recommend**: Investigation reveals test environment interference.

**Documentation required**:
- Evidence of environment interference
- Proposed configuration change
- Expected outcome

**Example**:
```markdown
**Recommendation**: Adjust Test Configuration
**Evidence**:
- Tests pass in isolation (1.255s total)
- Tests fail in full suite (25ms+ per operation vs 2ms threshold)
- No code changes since baseline
**Proposed Change**: Run performance tests in separate Jest project
**Expected Outcome**: Accurate performance measurement without suite overhead
```

#### Investigate Further

**When to recommend**: Investigation is inconclusive.

**Documentation required**:
- What was investigated
- What remains unclear
- Proposed next steps

**Example**:
```markdown
**Recommendation**: Investigate Further
**Investigated**: Isolated performance, code changes, scale relationship
**Unclear**: Why P95 variance is high (0.5ms - 2.5ms range)
**Next Steps**: 
1. Profile memory allocation during operation
2. Check for GC pauses affecting timing
3. Test on different hardware to rule out machine-specific issues
```

### Example from Spec 029: P9 Performance Investigation

This section documents the actual investigation performed during Spec 029 for Pattern P9 (Performance Validation Timeouts), demonstrating the protocol in practice.

#### Context

**Pattern**: P9 - Performance Validation Timeouts
**Symptoms**: 3 tests failing with 3-15x performance degradation vs November 2025 baseline
**Initial Assessment**: Unclear whether code regression or threshold issue

#### Investigation Performed

**Step 1: Baseline Actual Execution Time**

Created `profile-p9-performance.ts` to measure operations outside Jest:

```
Statistics Operation:
  Current:  avg=0.434ms, p95=1.085ms
  Baseline: avg=0.338ms, p95=0.802ms
  Ratio:    1.35x P95

State Export Operation:
  Current:  avg=0.291ms, p95=0.477ms
  Baseline: avg=0.416ms, p95=0.544ms
  Ratio:    0.88x P95 (FASTER than baseline)

Large Scale Operation:
  Current:  avg=0.942ms, p95=1.795ms
  Baseline: avg=1.103ms, p95=1.702ms
  Ratio:    1.05x P95
```

**Finding**: Isolated performance is within 35% of baseline - NOT a regression.

**Step 2: Compare Isolated vs Full Suite**

```bash
# Isolated execution
npm test -- --testPathPatterns="PerformanceValidation"
# Result: All 32 tests PASS in 1.255 seconds

# Full suite execution
npm test
# Result: 3 tests FAIL with 25ms+ times (vs 2ms threshold)
```

**Finding**: Same tests pass in isolation but fail in full suite.

**Step 3: Check for Code Changes**

```bash
git log --oneline --since="2025-11-22" -- src/TokenEngine.ts
# Result: No changes

git log --oneline --since="2025-11-22" -- src/registries/ src/validation/
# Result: Only test file changes (adding @category annotations)
```

**Finding**: No code changes to performance-critical paths since baseline.

**Step 4: Identify Bottleneck Source**

| Scenario | Statistics Time | Degradation Factor |
|----------|-----------------|-------------------|
| Isolated (ts-node) | 0.434ms avg | 1x (baseline) |
| Isolated (Jest) | ~1ms | ~2x |
| Full Suite (Jest) | 25.68ms | ~60x |

**Finding**: Bottleneck is Jest worker overhead in full suite, not code.

#### Decision Applied

Based on the decision framework:
- Current performance NOT significantly worse than baseline in isolation
- Issue is test environment interference

**Recommendation**: Adjust Test Configuration
- Run PerformanceValidation.test.ts in isolation
- OR adjust thresholds to account for full-suite overhead

#### Documentation Produced

Full investigation documented in `findings/p9-performance-investigation.md` with:
- Executive summary
- Methodology
- Raw profiling data
- Root cause analysis
- Recommendation for Spec 030

### Anti-Patterns to Avoid

#### Anti-Pattern 1: Threshold Inflation Without Investigation

**Problem**: Increasing thresholds whenever tests fail without understanding why.

**Example**:
```markdown
❌ WRONG:
"Test failed with 25ms, threshold is 2ms. Increasing threshold to 30ms."

✅ CORRECT:
"Test failed with 25ms in full suite. Investigation shows:
- Isolated performance: 0.5ms (within baseline)
- Full suite adds 50x overhead due to Jest workers
- Recommendation: Run in isolation OR adjust to 30ms with documented justification"
```

#### Anti-Pattern 2: Assuming Code Is Always Wrong

**Problem**: Assuming performance failures always indicate code problems.

**Example**:
```markdown
❌ WRONG:
"Performance test failed. Must be a code regression. Starting optimization work."

✅ CORRECT:
"Performance test failed. Before optimizing, investigate:
1. Is isolated performance degraded? (No → environment issue)
2. Were there code changes? (No → scale or environment)
3. What's the bottleneck? (Identify before fixing)"
```

#### Anti-Pattern 3: Ignoring Test Environment Factors

**Problem**: Not considering that test frameworks add overhead.

**Example**:
```markdown
❌ WRONG:
"Operation takes 25ms in tests. Code must be slow."

✅ CORRECT:
"Operation takes 25ms in full test suite but 0.5ms in isolation.
The 50x difference is test environment overhead, not code performance."
```

#### Anti-Pattern 4: Undocumented Threshold Changes

**Problem**: Changing thresholds without documenting why.

**Example**:
```markdown
❌ WRONG:
// Changed threshold from 2ms to 30ms
const THRESHOLD = 30;

✅ CORRECT:
// Threshold: 30ms
// Baseline (Nov 2025): 0.8ms P95 in isolation
// Full suite overhead: ~25x due to Jest workers
// This threshold catches 2x+ regressions while allowing environment variance
// See: findings/p9-performance-investigation.md
const THRESHOLD = 30;
```

### Protocol Checklist

Use this checklist when investigating performance timeout failures:

- [ ] **Baseline measured**: Actual execution time measured outside test framework
- [ ] **Baseline compared**: Current performance compared to original baseline (if available)
- [ ] **Bottleneck identified**: Source of slowdown identified (git, I/O, logic, network, environment)
- [ ] **Scale relationship determined**: Constant, linear, or exponential growth understood
- [ ] **Code changes reviewed**: Git history checked for relevant changes since baseline
- [ ] **Isolation tested**: Performance compared between isolated and full suite execution
- [ ] **Decision framework applied**: Recommendation based on evidence, not convenience
- [ ] **Documentation complete**: Investigation findings documented with evidence and rationale

---

## Lessons Learned

This section captures institutional knowledge from Specs 025 (Test Suite Overhaul), 026 (Test Failure Resolution), and 029 (Test Failure Audit). These lessons inform future audit work and help avoid repeating past mistakes.

### Lessons from Spec 025: Test Suite Overhaul

#### Lesson 1: Audit-First Prevents Wasted Effort

**What We Learned**: Completing a full audit before making any code changes prevents wasted effort on tests that should be deleted or reveals bugs that need separate handling.

**Evidence**: Spec 025 identified 797 failing tests. By auditing first, we discovered that many failures shared common patterns - fixing one pattern addressed dozens of tests. Without the audit, we would have fixed tests individually, wasting significant effort.

**Best Practice**: Always complete the full audit phase before implementing any fixes. The time invested in understanding the landscape pays dividends in implementation efficiency.

#### Lesson 2: Pattern-Based Grouping Is Essential

**What We Learned**: Grouping failures by root cause pattern (not by test file) makes findings scannable, actionable, and prevents redundant work.

**Evidence**: Spec 025 grouped 797 failures into ~15 patterns. This made it possible to review findings in a single session and make informed decisions about each pattern. A test-by-test listing would have been overwhelming and redundant.

**Best Practice**: Always group failures by pattern. If 50 tests fail for the same reason, document it as one pattern with 50 affected tests, not 50 separate findings.

#### Lesson 3: Nuanced Recommendations Avoid Binary Thinking

**What We Learned**: Five recommendation categories (Delete, Fix, Refine, Convert, Keep) capture nuance that binary "fix or delete" misses.

**Evidence**: Spec 025 found tests that were "checking the right thing the wrong way" (Fix), tests that were "too strict" (Refine), and tests that should "become evergreen" (Convert). Binary categorization would have forced incorrect decisions.

**Best Practice**: Use the full recommendation taxonomy. "Fix Test" and "Fix Code" are different actions with different implications.

#### Lesson 4: Section-Based Organization Enables Appropriate Criteria

**What We Learned**: Different test categories (Infrastructure, System Implementation, Release Analysis) require different evaluation criteria.

**Evidence**: Spec 025 applied Test Development Standards to System Implementation tests but performance criteria to Release Analysis tests. Applying TDS to performance tests would have been inappropriate.

**Best Practice**: Identify test categories early and apply appropriate evaluation criteria to each. Don't apply one-size-fits-all standards.

### Lessons from Spec 026: Test Failure Resolution

#### Lesson 5: Stable Failures May Need Different Approaches

**What We Learned**: Failures that persist across multiple specs ("stable" failures) may need fundamentally different approaches than new failures.

**Evidence**: Spec 026 attempted to fix failures that had been present since Spec 025. Some of these required architectural changes beyond the spec's scope. Recognizing them as "stable" earlier would have enabled better planning.

**Best Practice**: Track failure lineage. If a failure has been present across multiple specs, consider whether the standard fix approach is appropriate or if a different strategy is needed.

#### Lesson 6: Performance Tests Are Environment-Sensitive

**What We Learned**: Performance tests can pass in isolation but fail in full test suite due to environment factors (Jest worker overhead, concurrent tests, shared resources).

**Evidence**: Spec 026 (and later Spec 029) found that P9 performance tests passed when run in isolation but failed in the full suite. The 25x slowdown was environment overhead, not code regression.

**Best Practice**: Before assuming performance regression, test in isolation. If isolated performance is acceptable, the issue is environment interference, not code.

#### Lesson 7: Threshold Adjustments Require Investigation

**What We Learned**: Increasing timeout thresholds without investigation hides real problems and erodes performance standards over time.

**Evidence**: Spec 026 initially considered simply increasing thresholds for failing performance tests. Investigation revealed that some failures were environment issues (adjust threshold) while others might be real regressions (investigate further).

**Best Practice**: Never adjust thresholds without investigation. Use the Performance Investigation Protocol to determine whether the issue is code inefficiency, legitimate scale growth, or environment interference.

### Lessons from Spec 029: Test Failure Audit

#### Lesson 8: Lineage Tracking Prevents Repeated Failures

**What We Learned**: Tracking failure history across specs reveals patterns of recurring issues and informs strategy.

**Evidence**: Spec 029 categorized each failure by lineage (Stable, Fixed-then-regressed, Newly-surfaced, Cascading, True-new). This revealed that many failures had been present since Spec 025 and had never been successfully fixed.

**Best Practice**: Always compare current failures against previous audit findings. Lineage tells the "story behind the numbers" and informs whether standard approaches will work.

#### Lesson 9: Scientific Method for Debugging

**What We Learned**: When multiple potential fixes exist, change one variable at a time to isolate the cause.

**Evidence**: Spec 029 faced a decision for P4 (Icon Undefined Multiplier): fix the test OR add a null check to the code. Peter's guidance: "If you change two variables, you can't identify what change caused the resulting behavior." Fix one thing first, then reevaluate.

**Best Practice**: Apply scientific method to debugging. Change one variable at a time. If the first fix resolves the issue, you've identified the cause. If not, you've eliminated one possibility.

#### Lesson 10: "Fail Loudly" Philosophy for Development Stage

**What We Learned**: During active development, fallbacks and defensive code can mask problems. It's better to fail loudly and surface issues early.

**Evidence**: Spec 029 found `|| 24` fallback patterns in Icon component code. Peter's guidance: "At this stage of development, fallbacks prevent diagnosing issues. We want to surface problems early, not mask them."

**Best Practice**: During development, prefer failing loudly over graceful degradation. Fallbacks can be added for production hardening later, but during development they hide bugs.

#### Lesson 11: Test Environment Interference Is Real

**What We Learned**: Full test suite execution creates significant overhead that can cause performance tests to fail even when the underlying code is performant.

**Evidence**: Spec 029's P9 investigation found that operations taking 0.5ms in isolation took 25ms in the full test suite - a 50x slowdown from Jest worker overhead, concurrent tests, and shared resources.

**Best Practice**: Performance tests should either run in isolation (separate npm script) or have thresholds that account for full-suite overhead. Document which approach is used and why.

#### Lesson 12: Cross-Platform Differences May Be Intentional

**What We Learned**: Not all cross-platform inconsistencies are bugs. Some are intentional platform-specific affordances.

**Evidence**: Spec 029 found cross-platform consistency failures (P6) where platforms had different token counts. Investigation revealed some differences were intentional (platform-specific features) while others were bugs.

**Best Practice**: Create an "acknowledged differences registry" documenting which cross-platform differences are intentional. Update tests to allow intentional differences while catching unintentional inconsistencies.

#### Lesson 13: Clean Exit Audits Prevent Issue Accumulation

**What We Learned**: Without mandatory exit audits, issues accumulate silently until a dedicated cleanup spec becomes necessary.

**Evidence**: Specs 025, 026, and 029 demonstrate this pattern - issues discovered in one spec were not documented, reappeared in subsequent specs, and eventually required a dedicated audit spec (029) to address.

**Best Practice**: Make clean exit audits mandatory. Every spec should end with documented issues (resolved or explicitly deferred). This prevents the "I'll just ignore that" pattern.

### Anti-Patterns to Avoid

#### Anti-Pattern 1: Fixing Tests Without Understanding Root Cause

**Problem**: Jumping to fix tests without understanding why they're failing leads to incorrect fixes and wasted effort.

**Example**: Changing test expectations to match current behavior without verifying the behavior is correct.

**Better Approach**: Complete audit phase first. Understand whether the test is wrong, the code is wrong, or the expectation is outdated.

#### Anti-Pattern 2: Threshold Inflation Without Investigation

**Problem**: Increasing timeout thresholds whenever tests fail hides real performance regressions.

**Example**: Test fails at 10s threshold, increase to 15s. Fails again, increase to 20s. Eventually thresholds are meaningless.

**Better Approach**: Use Performance Investigation Protocol. Measure isolated performance, identify bottleneck, then decide whether to optimize code or adjust threshold with documented justification.

#### Anti-Pattern 3: Silent Issue Ignoring

**Problem**: Noticing issues but not documenting them leads to issue accumulation and eventual cleanup specs.

**Example**: Seeing a test failure during unrelated work, working around it, and not logging it anywhere.

**Better Approach**: Log every discovered issue in the issues registry. Takes 2 minutes and prevents future rediscovery.

#### Anti-Pattern 4: Applying Wrong Evaluation Criteria

**Problem**: Using Test Development Standards criteria for performance tests, or performance criteria for unit tests.

**Example**: Evaluating a performance test by asking "does it check behavior or implementation?" when the real question is "is the threshold realistic?"

**Better Approach**: Identify test category first, then apply appropriate evaluation criteria for that category.

#### Anti-Pattern 5: Test-by-Test Analysis

**Problem**: Analyzing each failing test individually creates overwhelming documentation and misses patterns.

**Example**: Creating 40 separate findings entries for 40 failing tests when they share 5 common root causes.

**Better Approach**: Group by pattern first. If 10 tests fail for the same reason, that's one pattern with 10 affected tests.

#### Anti-Pattern 6: Assuming Code Is Always Wrong

**Problem**: Assuming test failures always indicate code bugs leads to unnecessary code changes.

**Example**: Test expects `strokeWidth="var(--icon-stroke-width)"` but component outputs `strokeWidth="2"`. Assuming the component is wrong without checking if the test expectation is correct.

**Better Approach**: Evaluate both possibilities. The test might be checking the right thing (component should use CSS variable) or the test might be outdated (component correctly uses hard-coded value for valid reason).

#### Anti-Pattern 7: Parallel Audit and Implementation

**Problem**: Fixing tests while still auditing creates confusion and potential rework.

**Example**: Fixing Pattern 1 tests while still discovering Pattern 2 tests, then realizing Pattern 1 and Pattern 2 share a root cause that requires different fix.

**Better Approach**: Complete full audit before any implementation. The time invested in understanding the full landscape prevents rework.

### Best Practices Summary

| Practice | Rationale |
|----------|-----------|
| **Audit before implementing** | Prevents wasted effort on tests that should be deleted |
| **Group by pattern** | Makes findings scannable and actionable |
| **Track lineage** | Reveals recurring issues and informs strategy |
| **Use nuanced recommendations** | Captures nuance that binary thinking misses |
| **Apply appropriate criteria** | Different test types need different evaluation |
| **Investigate before adjusting thresholds** | Prevents erosion of performance standards |
| **Test performance in isolation** | Distinguishes code issues from environment issues |
| **Change one variable at a time** | Enables root cause identification |
| **Fail loudly during development** | Surfaces issues early rather than masking them |
| **Document all discovered issues** | Prevents silent accumulation |
| **Complete clean exit audits** | Ensures explicit decisions about all issues |

---

## Related Documentation

- [Development Workflow](./Development%20Workflow.md) - Task completion and git practices
- [File Organization Standards](./File%20Organization%20Standards.md) - Documentation organization
- [Spec Planning Standards](./Spec%20Planning%20Standards.md) - Spec document formatting

---

*This methodology was developed through the systematic audit work in Specs 025, 026, and 029, capturing institutional knowledge for future test quality initiatives.*
