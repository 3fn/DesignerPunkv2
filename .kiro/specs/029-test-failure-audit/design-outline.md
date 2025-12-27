# Spec 029: Test Failure Audit - Design Outline

**Date**: December 26, 2025
**Status**: Draft
**Organization**: spec-guide
**Scope**: 029-test-failure-audit

---

## Problem Statement

After multiple bug hunt specs (025, 026), **17 failing test suites** with **40 failing tests** remain. While previous specs successfully reduced failures (from 391→24→17 suites), the remaining issues represent persistent technical debt that:

1. **Blocks CI/CD confidence** - Can't trust green builds with known failures
2. **Obscures real regressions** - New failures hidden among existing failures
3. **Indicates deeper patterns** - Recurring issues may share root causes
4. **Prevents feature development** - Can't confidently add new features

### Current State Analysis (December 26, 2025)

**Test Run Summary:**
- 17 failing test suites
- 40 failing tests
- 242 passing test suites
- 5,882 passing tests
- 13 skipped tests

**Progress from Previous Specs:**
- Spec 025: Started with 391 failing suites / 797 failing tests
- Spec 026: Reduced to 24 failing suites / 45 failing tests
- Current: 17 failing suites / 40 failing tests

**Initial Pattern Observations:**

| Pattern | Est. Test Count | Category |
|---------|-----------------|----------|
| Performance timeouts (10s limit) | ~12 | Release Analysis |
| Icon strokeWidth token integration | 2 | Component/Token |
| Icon token generation (parseMultiplier) | 4 | Type Safety |
| State integration timeout | 1 | Integration |
| Cache functionality validation | 1 | Cache |
| Concise output format | 1 | Output Format |
| Cross-platform token format | ~4 | Token Generation |

**Key Insight**: Multiple test suites may share single root causes. Audit must identify patterns, not just list failures.

---

## Goals

### Primary Goals

1. **Comprehensive Failure Audit** - Understand all 40 test failures before any code changes
2. **Root Cause Identification** - Group failures by underlying issue, not by test file
3. **Failure History Tracking** - Distinguish recurring vs new vs cascading issues
4. **Produce Spec 030 Design-Outline** - Actionable implementation plan for fixes
5. **Create Audit Methodology Steering Doc** - Reusable guidance for future audits

### Secondary Goals

1. **Validate Previous Fixes** - Confirm improvements are stable
2. **Identify Cascading Issues** - Issues revealed by fixing something else
3. **Document Resolution Patterns** - What worked, what didn't, why
4. **Establish Audit Best Practices** - Methodology for future test failure audits

---

## Scope

### Audit-Only Approach (No Code Changes)

**This spec produces documentation only - no code changes**

Following the successful 025/026 pattern:
1. **Audit** - Systematic review of all failing tests (no code changes)
2. **Findings** - Document patterns and recommendations
3. **Human Confirmation** - Review findings and confirm approach
4. **Deliverables** - Spec 030 design-outline + steering doc

### In Scope

1. **Comprehensive Failure Audit**
   - Catalog all failing tests
   - Group by root cause pattern (not test file)
   - Identify shared underlying issues
   - Flag tests that might reveal real bugs
   - Document failure signatures for baseline comparison

2. **Failure Lineage Analysis** (Story Behind the Numbers)
   - **Stable Failures**: Present in 025, 026, and now (never successfully fixed)
   - **Fixed Then Regressed**: Was fixed in previous spec, now failing again
   - **Newly Surfaced**: Appeared after a fix (was masked, now visible)
   - **Cascading**: Expected consequence of another fix
   - **True New**: First appearance, not related to previous work

3. **Root Cause Analysis**
   - Why does this test fail?
   - Is this a test issue or code issue?
   - Do multiple tests share this root cause?
   - Is this a quick fix or systemic problem?
   - Has this been attempted before? What happened?

4. **Findings Documentation**
   - Create findings document with pattern-based analysis
   - Categorize each failure pattern with recommendation
   - Include rationale for each recommendation
   - Reference previous spec attempts if applicable

**Recommendation Types** (nuanced, not binary):
- **Fix Test** - Test checks right thing wrong way
- **Fix Code** - Test reveals actual bug in implementation
- **Fix Environment** - Test environment configuration issue
- **Adjust Expectations** - Test assertions too strict/loose (e.g., timing)
- **Investigate** - Unclear if test or code issue
- **Defer** - Known issue, not blocking, address later

5. **Deliverable Creation**
   - **Spec 030 Design-Outline**: Implementation plan for confirmed fixes
   - **Audit Methodology Steering Doc**: Reusable guidance for future audits

### Out of Scope

1. **Code Changes** - This spec is audit-only
2. **New Feature Tests** - Not adding tests for new features
3. **Performance Optimization** - Not optimizing code performance
4. **Test Refactoring** - Not refactoring passing tests

---

## Key Decisions

### Decision 1: Audit-Only, No Code Changes

**Approach**: Systematic audit producing documentation only

**Rationale**: 
- Mirrors successful Spec 025/026 pattern
- Prevents wasted effort fixing wrong things
- Enables informed decisions based on full landscape
- Separates diagnosis from treatment

**Process**:
1. Audit all failing tests (no code changes)
2. Document findings with recommendations
3. Human confirmation of findings
4. Create Spec 030 design-outline for implementation
5. Create steering doc for future audits

### Decision 2: Failure Lineage Tracking (Story Behind the Numbers)

**Approach**: Track not just "is this recurring" but "what caused this to appear/disappear"

**Problem with Simple Counting**: Tracking "17 failing suites" masks important dynamics:
- Did fixing Test A break Test B?
- Did fixing Test A reveal Test C was always broken but masked?
- Are we playing whack-a-mole?

**Lineage Categories**:
- **Stable Failures**: Present in 025, 026, and now (never successfully fixed)
- **Fixed Then Regressed**: Was fixed in previous spec, now failing again (something broke it)
- **Newly Surfaced**: Appeared after a fix (was masked, now visible - often good sign)
- **Cascading**: Expected consequence of another fix (good sign of progress)
- **True New**: First appearance, not related to previous work (may be regression)

**Rationale**:
- Stable failures may need fundamentally different approach
- Regressions indicate fragile fixes that need reinforcement
- Surfaced failures are often good - they were always broken, now visible
- Lineage tells the "story behind the numbers"
- History informs strategy and prevents repeating failed approaches

### Decision 3: Two Deliverables

**Approach**: Produce both implementation plan and methodology guidance

**Deliverables**:
1. **Spec 030 Design-Outline**: Actionable implementation plan
   - Based on confirmed findings
   - Prioritized fix order
   - Estimated effort per pattern
   - Success criteria

2. **Audit Methodology Steering Doc**: Reusable guidance
   - Audit workflow steps
   - Pattern identification techniques
   - Findings document template
   - Lessons learned from 025/026/029
   - **Clean Exit Audit Requirement** (see Decision 5)

**Rationale**:
- Spec 030 enables immediate action on fixes
- Steering doc prevents reinventing the wheel for future audits
- Captures institutional knowledge

### Decision 4: Pattern-Based Findings (Spec 011/025/026 Format)

**Approach**: Group failures by pattern with examples, not test-by-test listing

**Format**:
- Group failures by pattern (not test-by-test)
- For each pattern: Root cause, recommendation, impact, rationale, examples
- Include failure lineage (stable/regressed/surfaced/cascading)
- Reference previous spec attempts if applicable

**Rationale**:
- Proven format from Spec 011, 025, 026
- Scannable and actionable
- Avoids redundancy (12 tests with same issue = 1 pattern)
- Findings inform implementation (not the other way around)

### Decision 5: Clean Exit Audit Requirement (For Steering Doc)

**Problem**: AI agents stay focused on their task (good), but sidestep unrelated issues they discover (bad). This leads to issue accumulation that eventually requires dedicated specs like this one.

**Approach**: The steering doc will mandate a "clean exit audit" at spec completion

**Clean Exit Audit Requirements**:
1. **Issue Registry**: Any issues discovered during spec work get logged to an issues registry
2. **Exit Audit**: Before spec closure, run full test suite and document any new failures
3. **Resolution or Deferral**: Issues must be either:
   - Resolved within the spec, OR
   - Explicitly deferred with rationale and logged to issues registry
4. **No Silent Ignoring**: Spec cannot close with undocumented issues

**Rationale**:
- Prevents "I'll just ignore that" pattern
- Forces explicit decisions about discovered issues
- Creates accountability for issue accumulation
- May prevent future specs like 029 from being necessary

**Implementation**: This will be a core requirement in the Audit Methodology Steering Doc

### Decision 5b: Optimization Opportunity Logging (Optional Practice)

**Problem**: AI agents passively encounter optimization opportunities (TDS alignment, performance, code quality) that aren't issues but could inform future work. Without logging, this knowledge is lost.

**Approach**: The steering doc will include optional "Opportunity Logging" as a lightweight practice

**Opportunity Logging Guidelines** (Optional):
1. **Separate Registry**: Distinct from Issues registry
   - Issues = broken or blocking
   - Opportunities = could be better, not urgent
2. **Lightweight Format**:
   ```
   - Location: [file/test]
   - Type: TDS alignment / Performance / Code quality
   - Observation: [one sentence]
   - Discovered during: [spec number]
   ```
3. **No Obligation to Act**: Opportunities are informational, not actionable items
4. **Threshold for Recording**: Only record if:
   - It's a pattern (not a one-off)
   - It's clearly an improvement (not a style preference)
   - It's actionable (not vague "this could be better")

**Rationale**:
- Captures institutional knowledge without creating overhead
- Informs future planning without blocking current work
- Prevents scope creep (opportunities ≠ requirements)
- Human decides if/when to address opportunities

**Implementation**: This will be an optional practice in the Audit Methodology Steering Doc

### Decision 6: Performance Investigation Protocol (Before Adjusting Timeouts)

**Problem**: We've repeatedly moved the goal posts on performance timeouts by increasing the time limit. This treats symptoms, not causes.

**Approach**: Before recommending "adjust timeout," the audit must investigate root cause

**Investigation Protocol**:
1. **Baseline Actual Performance**: What's the real execution time? (not just "exceeded 10s")
2. **Identify Bottleneck**: Is it git operations? File I/O? Analysis logic? Network?
3. **Determine Scale Relationship**: Does it grow with project size? Linearly? Exponentially?
4. **Historical Comparison**: What was the performance when the 10s limit was set?
5. **Decision Framework**:
   - If performance degraded due to inefficiency → **Fix the code**
   - If performance grew due to legitimate scale → **Adjust threshold with justification**
   - If unclear → **Investigate further before deciding**

**Rationale**:
- The 10s limit was set for a reason
- Repeatedly increasing limits hides real problems
- Understanding root cause enables informed decisions
- "Adjust threshold" is valid IF justified by scale, not by convenience

**Implementation**: Performance timeout patterns will include investigation findings, not just "increase timeout" recommendations

---

## Architecture

### Audit Workflow

```
┌─────────────────────────────────────────┐
│  1. AUDIT (No Code Changes)             │
│  - Run npm test, capture output         │
│  - Catalog all 40 failing tests         │
│  - Group by root cause pattern          │
│  - Track failure history                │
│  - Assess: test issue vs code issue     │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  2. FINDINGS DOCUMENT                   │
│  - Pattern-based analysis               │
│  - Recommendation for each pattern      │
│  - Failure history for each pattern     │
│  - Rationale for each recommendation    │
│  - Flag potential bugs                  │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  3. HUMAN CONFIRMATION                  │
│  - Review findings                      │
│  - Confirm recommendations              │
│  - Adjust based on system knowledge     │
│  - Prioritize patterns                  │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  4. DELIVERABLES                        │
│  - Spec 030 Design-Outline              │
│  - Audit Methodology Steering Doc       │
└─────────────────────────────────────────┘
```

### Failure Pattern Structure (Initial Observations)

```
Pattern 1: Performance Timeouts (~12 tests)
├── QuickAnalyzer 10s limit exceeded
├── HookIntegration timing failures
├── State integration timeouts
├── Lineage: STABLE (present in 025, 026, now)
├── Root Cause: TBD - requires investigation
└── Investigation Required:
    ├── Baseline actual execution time
    ├── Identify bottleneck (git? I/O? analysis?)
    ├── Determine scale relationship
    └── Compare to original 10s baseline

Pattern 2: Icon Token Integration (2 tests)
├── strokeWidth not using CSS variable
├── Expected: var(--icon-stroke-width)
├── Actual: stroke-width="2"
├── Lineage: TRUE NEW (not in 025/026 findings)
└── Root Cause: Token integration incomplete

Pattern 3: Icon Token Generation (4 tests)
├── parseMultiplier undefined error
├── Kotlin format validation failures
├── Lineage: STABLE (present in 026, now)
└── Root Cause: Type safety / null handling

Pattern 4: Cache Functionality (1 test)
├── fullResultCached expected true, got false
├── Lineage: STABLE (present in 026, now)
└── Root Cause: Cache validation logic

Pattern 5: Output Format (1 test)
├── Concise summary format validation
├── Lineage: TRUE NEW
└── Root Cause: Output format expectations
```

**Note**: These are initial observations. Audit phase will refine, validate, and complete lineage tracking.

---

## Implementation Strategy

### Phase 1: Audit (No Code Changes)

**Goal**: Understand all 40 test failures before any recommendations

**Audit Tasks:**
1. Run `npm test` and capture complete output ✅ (completed above)
2. Catalog each failing test with:
   - Test file path
   - Test name
   - Error type
   - Error message
   - Stack trace (for context)
3. Group failures by pattern:
   - Same error message = likely same root cause
   - Same error type + similar context = related issue
4. Track failure lineage:
   - Compare against 025/026 findings
   - Categorize: Stable / Fixed-then-regressed / Newly-surfaced / Cascading / True-new
5. Assess each pattern:
   - Is this a test issue or code issue?
   - How many tests affected?
   - Quick fix or systemic problem?
   - Previous attempts and outcomes?
6. **Performance Investigation** (for timeout patterns):
   - Baseline actual execution time
   - Identify bottleneck source
   - Determine scale relationship
   - Compare to original baseline when limit was set

**Evaluation Questions:**
- Why does this test fail?
- Is the test checking the right thing?
- Is the code behaving incorrectly?
- Are test expectations realistic?
- Has this been attempted before? What happened?

**Findings Document**: `findings/test-failure-audit-findings.md`

---

### Phase 2: Human Confirmation

**Goal**: Review findings and confirm approach before creating deliverables

**Confirmation Process:**
1. Present findings document to Peter
2. Review each pattern and recommendation
3. Discuss failure history insights
4. Confirm which patterns to address in Spec 030
5. Prioritize patterns for implementation
6. Identify any patterns to defer

**Confirmation Criteria:**
- Do recommendations make sense?
- Are there alternative approaches?
- Should any patterns be investigated further?
- What's the priority order for Spec 030?
- Any patterns to defer to future specs?

**Confirmed Actions Document**: `findings/test-failure-confirmed-actions.md`

---

### Phase 3: Deliverables

**Goal**: Create actionable outputs for implementation and future audits

**Deliverable 1: Spec 030 Design-Outline**
Location: `.kiro/specs/030-test-failure-fixes/design-outline.md`

Contents:
- Problem Statement (confirmed patterns to fix)
- Goals (achieve 0 failing tests)
- Scope (confirmed fixes only)
- Implementation Strategy (prioritized fix order)
- Success Criteria (all tests passing, no regressions)
- Risks and Mitigations

**Deliverable 2: Audit Methodology Steering Doc**
Location: `.kiro/steering/Test Failure Audit Methodology.md`

Contents:
- When to run a test failure audit
- Audit workflow steps
- Pattern identification techniques
- Findings document template
- Failure lineage tracking approach
- **Clean Exit Audit Requirement** (mandatory for all specs)
  - Issue registry maintenance
  - Exit audit before spec closure
  - Resolution or explicit deferral requirement
- **Optimization Opportunity Logging** (optional practice)
  - Separate registry from issues
  - Lightweight format
  - Threshold for recording
- Performance investigation protocol
- Lessons learned from 025/026/029
- Best practices and anti-patterns

---

## Success Criteria

### Audit Phase Success
- All 40 failing tests cataloged
- Failures grouped by root cause pattern
- Failure lineage tracked (stable/regressed/surfaced/cascading/new)
- Performance patterns include investigation findings (not just "increase timeout")
- Findings document created with recommendations
- Human confirmation received

### Deliverables Success
- Spec 030 design-outline created with:
  - Clear problem statement
  - Prioritized implementation plan
  - Performance decisions backed by investigation
  - Success criteria
- Audit methodology steering doc created with:
  - Reusable workflow
  - Templates and examples
  - **Clean exit audit requirement**
  - Performance investigation protocol
  - Lessons learned

### Overall Success
- Clear understanding of all failure patterns
- Actionable plan for achieving 0 failures
- Reusable methodology for future audits
- Clean exit audit process documented
- No code changes made (audit-only)

---

## Risks and Mitigations

### Risk 1: Audit Reveals More Complex Issues

**Risk**: Systematic audit might reveal failures are more complex than initial observations suggest

**Mitigation:**
- Audit phase designed to uncover complexity before committing to solutions
- Human confirmation allows adjustment of approach
- Can break complex issues into multiple Spec 030 phases
- Document additional issues for future specs if needed

### Risk 2: Recurring Issues Indicate Deeper Problems

**Risk**: Issues that recurred from 025/026 may need fundamentally different approach

**Mitigation:**
- Track failure lineage explicitly (stable vs regressed vs surfaced)
- Analyze why previous fixes didn't stick
- Consider architectural changes if pattern keeps recurring
- Document lessons learned for steering doc

### Risk 3: Scope Creep to Implementation

**Risk**: Temptation to "just fix it" during audit

**Mitigation:**
- Strict audit-only scope
- All fixes go into Spec 030
- Human confirmation checkpoint before deliverables
- Clear separation of diagnosis and treatment

### Risk 4: Performance Investigation Reveals Optimization Needed

**Risk**: Investigation may show performance degradation requires code optimization, not threshold adjustment

**Mitigation:**
- Document findings clearly with data
- Present options to human for decision
- If optimization needed, scope it appropriately in Spec 030
- Don't default to "increase timeout" without justification

### Risk 5: Clean Exit Audit Adds Overhead

**Risk**: Requiring clean exit audits on all specs may slow down development

**Mitigation:**
- Clean exit audit is lightweight if issues are addressed during spec
- Overhead is front-loaded (prevents larger cleanup specs later)
- Issue registry makes tracking efficient
- Long-term benefit outweighs short-term overhead

---

## Dependencies

### Depends On

- ✅ **Spec 025 Complete** - Test structure and organization established
- ✅ **Spec 026 Complete** - Previous failure resolution attempted
- ✅ **Test baseline available** - Can run npm test to capture failures

### Enables

- **Spec 030** - Implementation of confirmed fixes
- **Future Audits** - Methodology steering doc provides guidance

---

## Open Questions

### Questions for Audit Phase

1. **Are initial pattern observations accurate?**
   - Audit will validate or refine initial groupings
   - May discover additional patterns not visible in initial review

2. **What does performance investigation reveal?**
   - What's the actual execution time for timeout failures?
   - What's the bottleneck? (git operations, file I/O, analysis logic)
   - Has performance degraded since 10s limit was set, or was limit always tight?
   - Is this scale-related growth or inefficiency?

3. **Which stable failures need fundamentally different approach?**
   - parseMultiplier: Why didn't previous fixes stick?
   - Cache functionality: Is the test wrong or is caching broken?

4. **Are any failures actually revealing real bugs?**
   - Icon strokeWidth: Is this a test issue or implementation gap?
   - Cache functionality: Is caching actually broken?

### Questions for Human Confirmation

1. **Priority order for Spec 030?**
   - Performance timeouts (most tests affected, but needs investigation first)
   - Icon token issues (component functionality)
   - Cache/output format (lower impact)

2. **Performance decision framework?**
   - If investigation shows inefficiency → optimize code
   - If investigation shows legitimate scale → adjust threshold
   - What's the threshold for "legitimate scale"?

3. **Clean exit audit scope?**
   - Apply to all future specs?
   - What constitutes "explicit deferral with rationale"?
   - Where should issue registry live?

---

## References

- **Spec 025 Design-Outline**: `.kiro/specs/025-test-suite-overhaul/design-outline.md`
- **Spec 026 Design-Outline**: `.kiro/specs/026-test-failure-resolution/design-outline.md`
- **Spec 025 Findings**: `findings/` directory
- **Spec 026 Findings**: `findings/` directory
- **Test Development Standards**: `.kiro/steering/Test Development Standards.md`

---

**Status**: Ready for review and audit phase execution

