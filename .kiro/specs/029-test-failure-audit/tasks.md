# Implementation Plan: Test Failure Audit

**Date**: December 26, 2025
**Spec**: 029 - Test Failure Audit
**Status**: Implementation Planning
**Dependencies**: 025-test-suite-overhaul (complete), 026-test-failure-resolution (complete)

---

## Overview

This implementation plan executes a comprehensive audit of remaining test failures (17 suites / 40 tests) to produce two deliverables: a Spec 030 design-outline for implementing fixes, and an Audit Methodology steering doc for future audits.

**Key Constraint**: This is an audit-only spec. No code changes are permitted.

---

## Task List

- [x] 1. Audit Phase: Catalog and Analyze Failures
  **Type**: Implementation
  **Validation**: Tier 2: Standard
  - Execute comprehensive failure audit
  - No code changes permitted
  - _Requirements: 1, 2, 3, 4_

  - [x] 1.1 Catalog All Failing Tests
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Run `npm test` and capture complete output
    - For each failing test, document:
      - Test file path
      - Test name
      - Error type
      - Error message
      - Stack trace context
    - Verify all 40 failing tests are cataloged
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 1.2 Group Failures by Pattern
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Identify shared root causes across test files
    - Group failures with same error message as single pattern
    - Evaluate failures with same error type + similar context as related
    - Create pattern entries with:
      - Pattern name
      - Root cause description
      - Affected test count
      - Example failures (3-5 per pattern)
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 1.3 Track Failure Lineage
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Compare current failures against 025/026 findings
    - Categorize each pattern by lineage:
      - **Stable**: Present in 025, 026, and now
      - **Fixed-then-regressed**: Was fixed, now failing again
      - **Newly-surfaced**: Appeared after a fix (was masked)
      - **Cascading**: Expected consequence of another fix
      - **True-new**: First appearance, unrelated to previous work
    - Document previous fix attempts for stable patterns
    - Identify what broke regressed patterns
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [x] 1.4 Investigate Performance Timeout Patterns ✓
    **Type**: Architecture
    **Validation**: Tier 3: Comprehensive
    - For each performance timeout pattern:
      - Baseline actual execution time (not just "exceeded limit")
      - Identify bottleneck source (git operations, file I/O, analysis logic)
      - Determine scale relationship (linear, exponential, constant)
      - Compare to original baseline when limit was set (if available)
    - Apply decision framework:
      - If inefficiency → recommend code optimization
      - If legitimate scale → recommend threshold adjustment with justification
      - If unclear → flag for further investigation
    - Document investigation findings for each pattern
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
    - **Completed**: December 26, 2025 - Performance investigation findings documented in `findings/test-failure-audit-findings.md`

- [x] 2. Findings Phase: Create Findings Document
  **Type**: Implementation
  **Validation**: Tier 2: Standard
  - Create pattern-based findings document
  - _Requirements: 5_

  - [x] 2.1 Create Findings Document Structure
    **Type**: Setup
    **Validation**: Tier 1: Minimal
    - Create `findings/test-failure-audit-findings.md`
    - Add header with date, spec, test run timestamp
    - Add summary table template
    - _Requirements: 5.5_

  - [x] 2.2 Document Each Pattern
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - For each pattern, document:
      - Pattern name and description
      - Root cause analysis
      - Failure lineage category
      - Affected test count
      - Example failures with file paths
      - Recommendation (Fix Test / Fix Code / Fix Environment / Adjust Expectations / Investigate / Defer)
      - Rationale for recommendation
    - Include performance investigation findings for timeout patterns
    - Flag patterns that may reveal real bugs
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 3. Confirmation Phase: Human Review
  **Type**: Architecture
  **Validation**: Tier 3: Comprehensive
  - Present findings for human confirmation
  - _Requirements: 6_
  - **Completed**: December 26, 2025 - All patterns reviewed and confirmed by Peter

  - [x] 3.1 Present Findings for Review
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Present findings document to Peter
    - Highlight:
      - Patterns requiring decision (e.g., optimize vs adjust threshold)
      - Patterns flagged as potential bugs
      - Stable failures that may need different approach
    - _Requirements: 6.1, 6.2_
    - **Completed**: December 26, 2025 - All 11 patterns presented and reviewed

  - [x] 3.2 Incorporate Feedback and Create Confirmed Actions
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Incorporate any adjustments from human feedback
    - Create `findings/test-failure-confirmed-actions.md` with:
      - Summary table by action category
      - Confirmed actions in priority order
      - Deferred actions with rationale
      - Decisions made with rationale
    - _Requirements: 6.3, 6.4, 6.5_
    - **Completed**: December 26, 2025 - Confirmed actions document created

- [x] 3.1.1 Investigate P9 Performance Regression Root Cause ✓
  **Type**: Architecture
  **Validation**: Tier 3: Comprehensive
  **Context**: P9 shows 3-15x performance degradation vs November 2025 baseline. Before Spec 030 can decide between "optimize code" or "adjust thresholds", we need to understand the root cause.
  - Profile state export operation to identify degradation source
  - Compare current code to November 2025 baseline (git diff)
  - Identify what changed in state management since baseline was set
  - Determine if degradation is:
    - **Code inefficiency**: Something changed that made it slower → recommend optimize
    - **Scale growth**: Token system grew legitimately → recommend adjust thresholds
    - **Bug**: Measurement or test setup issue → recommend fix bug
    - **Environment**: CI vs local differences → document and adjust
  - Document findings in `findings/p9-performance-investigation.md`
  - Update confirmed actions with final recommendation
  - _Requirements: 4.5 (investigation before deciding)_
  - **Deliverable**: Investigation report with clear recommendation for Spec 030
  - **Completed**: December 26, 2025 - Root cause: Test environment interference (NOT code inefficiency). Tests pass in isolation but fail in full suite due to Jest worker overhead. Recommendation: Adjust test configuration to run performance tests in isolation.

- [x] 4. Deliverables Phase: Create Spec 030 Design-Outline
  **Type**: Architecture
  **Validation**: Tier 3: Comprehensive
  - Create implementation plan for confirmed fixes
  - _Requirements: 7_

  - [x] 4.1 Create Spec 030 Directory and Design-Outline
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Create `.kiro/specs/030-test-failure-fixes/` directory
    - Create `design-outline.md` with:
      - Problem statement (confirmed patterns to fix)
      - Goals (achieve 0 failing tests)
      - Scope (confirmed fixes only)
      - Implementation strategy (prioritized fix order)
      - Success criteria (all tests passing, no regressions)
      - Risks and mitigations
    - Base content on confirmed actions only
    - Consider test count, severity, and dependencies when prioritizing
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 5. Deliverables Phase: Create Audit Methodology Steering Doc
  **Type**: Architecture
  **Validation**: Tier 3: Comprehensive
  - Create reusable audit methodology guidance
  - _Requirements: 8_

  - [x] 5.1 Create Steering Doc Structure
    **Type**: Setup
    **Validation**: Tier 1: Minimal
    - Create `.kiro/steering/Test Failure Audit Methodology.md`
    - Add metadata header (Date, Purpose, Organization, Scope, Layer)
    - _Requirements: 8.6_

  - [x] 5.2 Document Audit Workflow
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Document when to run a test failure audit
    - Document audit workflow steps
    - Document pattern identification techniques
    - Include findings document template
    - Document failure lineage tracking approach
    - _Requirements: 8.1_

  - [x] 5.3 Document Clean Exit Audit Requirement
    **Type**: Architecture
    **Validation**: Tier 3: Comprehensive
    - Document issue registry maintenance requirement
    - Document exit audit before spec closure requirement
    - Document resolution or explicit deferral requirement
    - Document no silent ignoring policy
    - Explain rationale for mandatory status
    - _Requirements: 8.2_

  - [x] 5.4 Document Opportunity Logging (Optional Practice)
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Document optional practice status
    - Document separate registry from issues
    - Document lightweight format
    - Document threshold for recording
    - Explain rationale for optional status
    - _Requirements: 8.3_

  - [x] 5.5 Document Performance Investigation Protocol
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Document investigation steps before adjusting timeouts
    - Document decision framework (optimize vs adjust)
    - Include examples from this audit
    - _Requirements: 8.4_

  - [x] 5.6 Document Lessons Learned
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Document lessons from 025/026/029 experiences
    - Document best practices discovered
    - Document anti-patterns to avoid
    - _Requirements: 8.5_

  - [x] 5.7 Update MCP Meta-Guide
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Add Test Failure Audit Methodology to `.kiro/steering/00-Steering Documentation Directional Priorities.md`
    - Register in appropriate tier (Tier 2 MCP-Only or conditional loading section)
    - Document trigger conditions (when to query this doc)
    - Add MCP access examples (get_document_summary, get_section)
    - Ensure AI agents can discover and access the methodology via MCP
    - Fix aggressive language patterns that cause AI agents to get stuck in reading loops
    - _Requirements: 8.6 (steering doc completeness)_
    - **Completed**: December 26, 2025 - Removed aggressive language ("ALL AI AGENTS MUST read this doc COMPLETELY WITHOUT EXCEPTION", "ABSOLUTE REQUIREMENT", threatening ❌ bullet points) and replaced with calmer, efficient guidance that preserves intent

- [x] 6. Final Verification
  **Type**: Architecture
  **Validation**: Tier 3: Comprehensive
  - Verify all deliverables are complete and no code changes were made
  - _Requirements: 9_

  - [x] 6.1 Verify Audit-Only Scope
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Verify no code changes were made
    - Verify no test files were modified
    - Verify no configuration files were modified
    - Verify only documentation artifacts were produced
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

  - [x] 6.2 Verify Deliverable Completeness
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Verify findings document exists and is complete
    - Verify confirmed actions document exists and is complete
    - Verify Spec 030 design-outline exists and is complete
    - Verify steering doc exists and is complete
    - Cross-reference deliverables with requirements
    - _Requirements: 5.5, 6.5, 7.4, 8.6_

---

## Success Criteria

### Parent Task 1: Audit Phase
- All 40 failing tests cataloged with required metadata
- Failures grouped into distinct patterns
- Lineage tracked for each pattern
- Performance patterns include investigation findings

### Parent Task 2: Findings Phase
- Findings document created at `findings/test-failure-audit-findings.md`
- All patterns documented with required fields
- Recommendations provided with rationale

### Parent Task 3: Confirmation Phase
- Findings presented to human for review
- Feedback incorporated
- Confirmed actions document created at `findings/test-failure-confirmed-actions.md`

### Parent Task 4: Spec 030 Design-Outline
- Design-outline created at `.kiro/specs/030-test-failure-fixes/design-outline.md`
- Based on confirmed actions only
- Includes prioritized implementation plan

### Parent Task 5: Steering Doc
- Steering doc created at `.kiro/steering/Test Failure Audit Methodology.md`
- Includes clean exit audit requirement (mandatory)
- Includes opportunity logging (optional)
- Includes performance investigation protocol
- Includes lessons learned

### Parent Task 6: Final Verification
- No code changes made
- All deliverables complete and cross-referenced

---

## Notes

- **Audit-Only**: This spec produces documentation only. All fixes go into Spec 030.
- **Human Confirmation**: Task 3 requires human review before proceeding to deliverables.
- **Performance Investigation**: Task 1.4 is critical - do not default to "increase timeout" without investigation.
- **Lineage Tracking**: Compare against 025/026 findings to understand failure history.

---

**Completion Documentation:**
- Detailed: `.kiro/specs/029-test-failure-audit/completion/task-N-parent-completion.md`
- Summary: `docs/specs/029-test-failure-audit/task-N-summary.md`

