# Design Document: Test Failure Audit

**Date**: December 26, 2025
**Spec**: 029 - Test Failure Audit
**Status**: Design Phase
**Dependencies**: 025-test-suite-overhaul (complete), 026-test-failure-resolution (complete)

---

## Overview

This spec implements a comprehensive audit of remaining test failures (17 suites / 40 tests) to produce two deliverables: a Spec 030 design-outline for implementing fixes, and an Audit Methodology steering doc for future audits. The design follows the proven audit-first pattern from Specs 025/026, with enhanced failure lineage tracking and performance investigation protocols.

### Design Principles

1. **Audit-Only**: No code changes - documentation artifacts only
2. **Pattern-Based**: Group failures by root cause, not by test file
3. **Lineage-Aware**: Track failure history to inform strategy
4. **Investigation-First**: Understand root causes before recommending solutions
5. **Human-Gated**: Confirmation checkpoint before deliverables

---

## Architecture

### Audit Workflow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         PHASE 1: AUDIT                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐               │
│  │   CATALOG    │───▶│    GROUP     │───▶│   ANALYZE    │               │
│  │              │    │              │    │              │               │
│  │ • Run tests  │    │ • By root    │    │ • Lineage    │               │
│  │ • Capture    │    │   cause      │    │ • Performance│               │
│  │   output     │    │ • By error   │    │   investigation              │
│  │ • Document   │    │   type       │    │ • Bug flags  │               │
│  │   each fail  │    │              │    │              │               │
│  └──────────────┘    └──────────────┘    └──────────────┘               │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      PHASE 2: FINDINGS                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                    FINDINGS DOCUMENT                              │   │
│  │                                                                   │   │
│  │  Pattern 1: [Name]                                               │   │
│  │  ├── Root Cause: [Description]                                   │   │
│  │  ├── Lineage: [Stable/Regressed/Surfaced/Cascading/New]         │   │
│  │  ├── Tests Affected: [Count]                                     │   │
│  │  ├── Examples: [File paths]                                      │   │
│  │  ├── Recommendation: [Fix Test/Code/Env/Adjust/Investigate]     │   │
│  │  └── Rationale: [Why this recommendation]                        │   │
│  │                                                                   │   │
│  │  Pattern 2: [Name]                                               │   │
│  │  └── [Same structure]                                            │   │
│  │                                                                   │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                   PHASE 3: HUMAN CONFIRMATION                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐               │
│  │   PRESENT    │───▶│   REVIEW     │───▶│   CONFIRM    │               │
│  │              │    │              │    │              │               │
│  │ • Findings   │    │ • Decisions  │    │ • Approved   │               │
│  │ • Decisions  │    │ • Priorities │    │   actions    │               │
│  │ • Bug flags  │    │ • Deferrals  │    │ • Priority   │               │
│  │              │    │              │    │   order      │               │
│  └──────────────┘    └──────────────┘    └──────────────┘               │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      PHASE 4: DELIVERABLES                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────┐    ┌─────────────────────────┐             │
│  │  SPEC 030 DESIGN-OUTLINE│    │  AUDIT METHODOLOGY      │             │
│  │                         │    │  STEERING DOC           │             │
│  │  • Problem statement    │    │                         │             │
│  │  • Prioritized fixes    │    │  • Audit workflow       │             │
│  │  • Success criteria     │    │  • Clean exit audit     │             │
│  │  • Risks/mitigations    │    │  • Opportunity logging  │             │
│  │                         │    │  • Lessons learned      │             │
│  └─────────────────────────┘    └─────────────────────────┘             │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Components and Interfaces

### Failure Catalog Structure

```typescript
interface FailureCatalogEntry {
  testFilePath: string;           // e.g., "src/release-analysis/cli/__tests__/quick-analyze.test.ts"
  testName: string;               // e.g., "should complete analysis within 10 seconds"
  errorType: string;              // e.g., "expect().toBeLessThan()", "Timeout", "ReferenceError"
  errorMessage: string;           // e.g., "Expected: < 10000, Received: 10017"
  stackTraceContext: string;      // Relevant portion of stack trace
  lineNumber?: number;            // Line number where failure occurred
}
```

### Pattern Structure

```typescript
interface FailurePattern {
  id: string;                     // e.g., "P1", "P2"
  name: string;                   // e.g., "Performance Timeouts"
  description: string;            // Root cause description
  lineage: FailureLineage;        // History category
  testsAffected: number;          // Count of tests with this pattern
  examples: FailureCatalogEntry[]; // Representative examples (3-5)
  recommendation: Recommendation;
  rationale: string;              // Why this recommendation
  performanceInvestigation?: PerformanceInvestigation; // For timeout patterns
  bugFlag?: boolean;              // True if may reveal real bug
  previousAttempts?: string[];    // For stable/regressed patterns
}

type FailureLineage = 
  | 'stable'           // Present in 025, 026, and now
  | 'fixed-then-regressed' // Was fixed, now failing again
  | 'newly-surfaced'   // Appeared after a fix (was masked)
  | 'cascading'        // Expected consequence of another fix
  | 'true-new';        // First appearance, unrelated to previous work

type Recommendation = 
  | 'fix-test'         // Test checks right thing wrong way
  | 'fix-code'         // Test reveals actual bug
  | 'fix-environment'  // Test environment configuration issue
  | 'adjust-expectations' // Test assertions too strict/loose
  | 'investigate'      // Unclear if test or code issue
  | 'defer';           // Known issue, not blocking, address later
```

### Performance Investigation Structure

```typescript
interface PerformanceInvestigation {
  actualExecutionTime: number;    // Measured time in ms
  threshold: number;              // Current limit in ms
  bottleneckSource: BottleneckSource;
  scaleRelationship: ScaleRelationship;
  originalBaseline?: number;      // Time when limit was set (if known)
  recommendation: 'optimize-code' | 'adjust-threshold' | 'investigate-further';
  justification: string;
}

type BottleneckSource = 
  | 'git-operations'
  | 'file-io'
  | 'analysis-logic'
  | 'network'
  | 'unknown';

type ScaleRelationship = 
  | 'linear'           // Grows proportionally with project size
  | 'exponential'      // Grows faster than project size
  | 'constant'         // Doesn't grow with project size
  | 'unknown';
```

---

## Data Models

### Findings Document Format

```markdown
# Test Failure Audit Findings

**Date**: [Audit Date]
**Spec**: 029 - Test Failure Audit
**Test Run**: [Timestamp]
**Summary**: [X] patterns identified across [Y] failing tests

---

## Summary Table

| Pattern | Tests | Lineage | Recommendation | Priority |
|---------|-------|---------|----------------|----------|
| P1: [Name] | [N] | [Lineage] | [Rec] | [High/Med/Low] |
| P2: [Name] | [N] | [Lineage] | [Rec] | [High/Med/Low] |

---

## Pattern Details

### Pattern 1: [Pattern Name]

**Root Cause**: [Description of underlying issue]

**Lineage**: [Stable/Fixed-then-regressed/Newly-surfaced/Cascading/True-new]
- [Context about history, previous attempts if applicable]

**Tests Affected**: [N] tests across [M] test suites

**Examples**:
- `[file-path]:[line]` - [Brief description]
- `[file-path]:[line]` - [Brief description]
- `[file-path]:[line]` - [Brief description]

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

### Pattern 2: [Pattern Name]
[Same structure]

---

## Patterns Requiring Decision

[List patterns where human input is needed to choose between options]

## Potential Bugs Flagged

[List patterns that may reveal real bugs in implementation]

## Deferred Patterns

[List patterns recommended for deferral with rationale]
```

### Confirmed Actions Document Format

```markdown
# Test Failure Audit - Confirmed Actions

**Date**: [Confirmation Date]
**Spec**: 029 - Test Failure Audit
**Confirmed By**: [Human name]

---

## Summary

| Category | Pattern Count | Test Count |
|----------|---------------|------------|
| Fix Test | [N] | [M] |
| Fix Code | [N] | [M] |
| Fix Environment | [N] | [M] |
| Adjust Expectations | [N] | [M] |
| Investigate | [N] | [M] |
| Defer | [N] | [M] |

---

## Confirmed Actions (Priority Order)

### Priority 1: [Pattern Name]
- **Action**: [Confirmed action]
- **Rationale**: [Why confirmed]
- **Notes**: [Any adjustments from original recommendation]

### Priority 2: [Pattern Name]
[Same structure]

---

## Deferred Actions

### [Pattern Name]
- **Reason for Deferral**: [Why not addressing now]
- **Future Spec**: [Where this should be addressed]

---

## Decisions Made

### [Decision Topic]
- **Options**: [What was considered]
- **Decision**: [What was chosen]
- **Rationale**: [Why]
```

---

## Error Handling

### Audit Phase Errors

| Error | Handling |
|-------|----------|
| Test run fails to complete | Capture partial output, document incomplete state |
| Ambiguous error message | Flag for human review, don't force categorization |
| Missing historical data | Mark lineage as "unknown", note in findings |
| Performance measurement inconsistent | Run multiple times, report range |

### Confirmation Phase Errors

| Error | Handling |
|-------|----------|
| Human disagrees with recommendation | Update recommendation with human's rationale |
| Pattern needs more investigation | Mark as "investigate" in confirmed actions |
| Conflicting priorities | Human decides, document rationale |

---

## Testing Strategy

### Audit Validation

Since this is an audit-only spec, "testing" means validating the audit process:

1. **Completeness Check**: Verify all 40 failing tests are cataloged
2. **Pattern Coverage**: Verify every failure is assigned to a pattern
3. **Lineage Accuracy**: Cross-reference with 025/026 findings
4. **Performance Investigation**: Verify timeout patterns include investigation data

### Deliverable Validation

1. **Spec 030 Design-Outline**: Verify all confirmed actions are included
2. **Steering Doc**: Verify all methodology elements are documented
3. **Cross-Reference**: Verify deliverables reference findings correctly

---

## Design Decisions

### Decision 1: Audit-Only Scope

**Options Considered**:
- A) Audit and fix in same spec
- B) Audit only, fixes in separate spec

**Decision**: B - Audit only

**Rationale**: 
- Separates diagnosis from treatment
- Prevents "fix it as you find it" scope creep
- Enables informed decisions based on full landscape
- Mirrors successful 025/026 pattern

**Trade-offs**: Requires additional spec (030) for implementation

### Decision 2: Failure Lineage Categories

**Options Considered**:
- A) Simple recurring/new binary
- B) Detailed lineage categories (stable, regressed, surfaced, cascading, new)

**Decision**: B - Detailed lineage categories

**Rationale**:
- Simple counting masks important dynamics
- "Stable" failures may need different approach than "regressed"
- "Surfaced" failures are often good (were always broken, now visible)
- Lineage tells the "story behind the numbers"

**Trade-offs**: More complex analysis, requires historical comparison

### Decision 3: Performance Investigation Protocol

**Options Considered**:
- A) Default to adjusting timeout thresholds
- B) Require investigation before any threshold adjustment

**Decision**: B - Require investigation

**Rationale**:
- Repeatedly increasing limits hides real problems
- The 10s limit was set for a reason
- Understanding root cause enables informed decisions
- "Adjust threshold" is valid IF justified by scale, not convenience

**Trade-offs**: More time spent on investigation, may delay fixes

### Decision 4: Clean Exit Audit Requirement

**Options Considered**:
- A) Optional best practice
- B) Mandatory requirement for all specs

**Decision**: B - Mandatory requirement (for steering doc)

**Rationale**:
- Prevents "I'll just ignore that" pattern
- Forces explicit decisions about discovered issues
- Creates accountability for issue accumulation
- May prevent future specs like 029 from being necessary

**Trade-offs**: Adds overhead to spec completion

### Decision 5: Opportunity Logging

**Options Considered**:
- A) Skip opportunity logging
- B) Make it mandatory alongside clean exit audit
- C) Make it optional with guidelines

**Decision**: C - Optional with guidelines

**Rationale**:
- Captures institutional knowledge without creating overhead
- Prevents scope creep (opportunities ≠ requirements)
- Human decides if/when to address opportunities
- Keeps clean exit audit focused on issues (broken things)

**Trade-offs**: May miss some opportunities if not logged

---

## Artifacts

### Phase 1: Audit

| Artifact | Location | Purpose |
|----------|----------|---------|
| Test output capture | (in-memory) | Raw test failure data |
| Failure catalog | (in-memory) | Structured failure entries |

### Phase 2: Findings

| Artifact | Location | Purpose |
|----------|----------|---------|
| Findings document | `findings/test-failure-audit-findings.md` | Pattern-based analysis |

### Phase 3: Confirmation

| Artifact | Location | Purpose |
|----------|----------|---------|
| Confirmed actions | `findings/test-failure-confirmed-actions.md` | Human-approved actions |

### Phase 4: Deliverables

| Artifact | Location | Purpose |
|----------|----------|---------|
| Spec 030 design-outline | `.kiro/specs/030-test-failure-fixes/design-outline.md` | Implementation plan |
| Audit methodology steering doc | `.kiro/steering/Test Failure Audit Methodology.md` | Reusable guidance |

---

## Integration Points

### Dependencies

- **Spec 025 Findings**: Reference for lineage tracking (what was present before)
- **Spec 026 Findings**: Reference for lineage tracking (what was fixed/attempted)
- **Test Development Standards**: Reference for evaluating test quality

### Enables

- **Spec 030**: Implementation of confirmed fixes
- **Future Audits**: Methodology steering doc provides guidance
- **Future Specs**: Clean exit audit requirement prevents accumulation

---

**Status**: Ready for tasks document development

