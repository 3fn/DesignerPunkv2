# Design Document: Test Suite Overhaul and Standards Alignment

**Date**: December 19, 2025
**Spec**: 025 - Test Suite Overhaul and Standards Alignment
**Status**: Design Phase
**Dependencies**: Spec 023 (Component Token Compliance Audit - provides reference implementations)

---

## Overview

This spec implements a three-section audit process (Infrastructure → System Implementation → Release Analysis) with mandatory human confirmation before any code changes. The design prioritizes understanding all 797 test failures through systematic audit before implementation, preventing wasted effort on tests that should be deleted or revealing bugs that need separate handling.

### Design Principles

1. **Audit-first, no code changes until confirmation**: Systematic review prevents fixing tests that should be deleted
2. **Section-based organization**: Different evaluation criteria for Infrastructure, System Implementation, and Release Analysis
3. **Nuanced recommendations**: Five categories (Delete, Fix, Refine, Convert, Keep) avoid binary thinking
4. **Pattern-based findings**: Group failures by pattern (Spec 011 format) for scannable, actionable documentation
5. **Sequential execution**: Complete sections one at a time for smaller test runs and progressive learning
6. **Comprehensive TDS alignment**: Audit passing tests too, not just failing tests

---

## Architecture

### Three-Section Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    SECTION 1: INFRASTRUCTURE                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐               │
│  │   AUDIT      │───▶│   CONFIRM    │───▶│  IMPLEMENT   │               │
│  │              │    │              │    │              │               │
│  │ • Jest       │    │ • Review     │    │ • Fix Jest   │               │
│  │   config     │    │ • Approve    │    │   config     │               │
│  │ • Test env   │    │ • Adjust     │    │ • Update env │               │
│  │ • Utilities  │    │              │    │ • Fix utils  │               │
│  └──────────────┘    └──────────────┘    └──────────────┘               │
│         │                   │                   │                        │
│         ▼                   ▼                   ▼                        │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐               │
│  │Infrastructure│    │  Confirmed   │    │  Green Tests │               │
│  │  Findings    │    │  Actions     │    │  (~25 fixed) │               │
│  └──────────────┘    └──────────────┘    └──────────────┘               │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                 SECTION 2: SYSTEM IMPLEMENTATION                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐               │
│  │   AUDIT      │───▶│   CONFIRM    │───▶│  IMPLEMENT   │               │
│  │              │    │              │    │              │               │
│  │ • Components │    │ • Review     │    │ • Fix tests  │               │
│  │ • Tokens     │    │ • Approve    │    │ • Delete     │               │
│  │ • Build      │    │ • Adjust     │    │ • Refine     │               │
│  │ • Integration│    │              │    │ • Convert    │               │
│  └──────────────┘    └──────────────┘    └──────────────┘               │
│         │                   │                   │                        │
│         ▼                   ▼                   ▼                        │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐               │
│  │   System     │    │  Confirmed   │    │  Green Tests │               │
│  │  Findings    │    │  Actions     │    │(~500-600 fix)│               │
│  └──────────────┘    └──────────────┘    └──────────────┘               │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                  SECTION 3: RELEASE ANALYSIS                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐               │
│  │   AUDIT      │───▶│   CONFIRM    │───▶│  IMPLEMENT   │               │
│  │              │    │              │    │              │               │
│  │ • Performance│    │ • Review     │    │ • Adjust     │               │
│  │ • Hooks      │    │ • Approve    │    │   timeouts   │               │
│  │ • Analysis   │    │ • Adjust     │    │ • Update     │               │
│  │   tooling    │    │              │    │   targets    │               │
│  └──────────────┘    └──────────────┘    └──────────────┘               │
│         │                   │                   │                        │
│         ▼                   ▼                   ▼                        │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐               │
│  │  Release     │    │  Confirmed   │    │  Green Tests │               │
│  │  Findings    │    │  Actions     │    │(~200-300 fix)│               │
│  └──────────────┘    └──────────────┘    └──────────────┘               │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │  FINAL VERIFICATION    │
                    │  • 0 failing suites    │
                    │  • 0 failing tests     │
                    │  • TDS aligned         │
                    │  • New baseline        │
                    └────────────────────────┘
```

### Test Section Breakdown

```
Section 1: Infrastructure (~25 failures)
├── Jest Configuration
│   ├── .d.ts file exclusion
│   ├── Test path patterns
│   └── Test environment setup
└── Shared Test Utilities
    ├── Test helpers
    ├── Fixtures
    └── Mocks

Section 2: System Implementation (~500-600 failures)
├── Component Tests
│   ├── Icon (✅ passing - audit for TDS)
│   ├── ButtonCTA (✅ passing - audit for TDS)
│   ├── TextInputField (✅ passing - audit for TDS)
│   ├── Container (✅ passing - audit for TDS)
│   └── Other components (failing - audit and fix)
├── Token Compliance Tests
│   ├── Hard-coded value detection
│   ├── Fallback pattern detection
│   └── Token usage validation
├── Build System Tests
│   ├── Token generation
│   ├── Platform builds
│   └── NPM package structure
└── Integration Tests
    ├── Component integration
    ├── Cross-platform consistency
    └── Build system integration

Section 3: Release Analysis (~200-300 failures)
├── Performance Regression Tests
│   ├── Analysis speed tests
│   ├── Timeout issues
│   └── Performance targets
├── Hook Integration Tests
│   ├── Hook workflow tests
│   ├── Agent hook tests
│   └── Performance monitoring
└── Quick Analyzer Tests
    ├── Analysis speed
    ├── Breaking change detection
    └── Version bump recommendations
```

---

## Components and Interfaces

### Findings Document Structure (Pattern-Based)

Each section audit produces a findings document with this structure (inspired by Spec 011):

```markdown
# Section [N] Audit Findings: [Section Name]

## Summary

| Pattern | Test Count | Impact | Recommendation |
|---------|-----------|--------|----------------|
| Pattern 1 | 150 | High | Fix |
| Pattern 2 | 75 | Medium | Refine |
| Pattern 3 | 50 | Low | Delete |

## Pattern 1: [Pattern Name]

**TDS Reference**: [Which TDS principle this violates]
**Test Count**: [Number of tests with this pattern]
**Impact**: [High/Medium/Low - why this matters]
**Recommendation**: [Delete/Fix/Refine/Convert/Keep]

**Rationale**: [Why this recommendation]

**Examples**:
- `test/path/to/test1.test.ts:45` - [Brief description]
- `test/path/to/test2.test.ts:120` - [Brief description]
- `test/path/to/test3.test.ts:89` - [Brief description]

**Proposed Fix** (if applicable):
```typescript
// Before
expect(component.shadowRoot.querySelector('.icon')).toBeTruthy();

// After
expect(component.getAttribute('aria-label')).toBe('Expected label');
```

## Pattern 2: [Pattern Name]
[Same structure]

## Potential Bugs

### Bug 1: [Description]
**Evidence**: [Why this might be a real bug]
**Tests Affected**: [List of tests]
**Recommendation**: [Investigate/Fix in scope/Create separate task]
```

### Confirmed Actions Document Structure

```markdown
# Section [N] Confirmed Actions: [Section Name]

## Summary

| Category | Count | Notes |
|----------|-------|-------|
| Delete | 50 | Retirement criteria met |
| Fix | 150 | Check behavior not implementation |
| Refine | 75 | Adjust criteria |
| Convert | 25 | Temporary → Evergreen |
| Keep | 200 | Already TDS-aligned |

## Delete (Retirement Criteria Met)
- [ ] D1: Pattern 3 tests - [Brief rationale]
  - Affected tests: [List or pattern]
  - Retirement criteria: [What criteria was met]

## Fix (Check Right Thing Wrong Way)
- [ ] F1: Pattern 1 tests - [Brief rationale]
  - Affected tests: [List or pattern]
  - Fix approach: [What to change]

## Refine (Adjust Criteria)
- [ ] R1: Pattern 2 tests - [Brief rationale]
  - Affected tests: [List or pattern]
  - Refinement: [How to adjust]

## Convert (Temporary → Evergreen)
- [ ] C1: Pattern 4 tests - [Brief rationale]
  - Affected tests: [List or pattern]
  - New criteria: [Evergreen criteria]

## Keep (Already Aligned)
- K1: Pattern 5 tests - [Brief rationale]
  - Affected tests: [List or pattern]

## Bugs to Address
- [ ] B1: [Bug description] - [In scope/Separate task]

## Rejected Findings
- RJ1: [Finding] - Rationale: [Why rejected]
```

---

## Data Models

### Test Evaluation Criteria by Section

```typescript
enum TestSection {
  INFRASTRUCTURE = 'infrastructure',
  SYSTEM_IMPLEMENTATION = 'system',
  RELEASE_ANALYSIS = 'release'
}

enum RecommendationType {
  DELETE = 'delete',   // No longer provides value
  FIX = 'fix',         // Checks right thing wrong way
  REFINE = 'refine',   // Too strict or too loose
  CONVERT = 'convert', // Temporary → Evergreen
  KEEP = 'keep'        // Already aligned
}

interface EvaluationCriteria {
  section: TestSection;
  questions: string[];
  references: string[];
}

const INFRASTRUCTURE_CRITERIA: EvaluationCriteria = {
  section: TestSection.INFRASTRUCTURE,
  questions: [
    'Is this a configuration issue or test issue?',
    'Does this affect multiple test suites?',
    'Is this a quick fix or systemic problem?'
  ],
  references: ['Jest documentation', 'Test environment setup']
};

const SYSTEM_IMPLEMENTATION_CRITERIA: EvaluationCriteria = {
  section: TestSection.SYSTEM_IMPLEMENTATION,
  questions: [
    'Does this test check behavior or implementation?',
    'Is this evergreen or temporary?',
    'Does this test a contract or internal details?',
    'Is this testing a functional requirement or philosophical preference?',
    'Would this test survive refactoring?',
    'Does this test provide long-term value?'
  ],
  references: ['Test Development Standards']
};

const RELEASE_ANALYSIS_CRITERIA: EvaluationCriteria = {
  section: TestSection.RELEASE_ANALYSIS,
  questions: [
    'Are performance targets realistic?',
    'Are timeout values appropriate?',
    'Does this test verify developer tooling works?',
    'Is this test checking the right thing for tooling?',
    'Should we optimize performance or adjust targets?'
  ],
  references: ['Performance baselines', 'Tooling requirements']
};
```

### Test Pattern Classification

```typescript
interface TestPattern {
  id: string;              // e.g., "P1", "P2"
  name: string;            // e.g., "Implementation Detail Testing"
  section: TestSection;
  testCount: number;
  impact: 'high' | 'medium' | 'low';
  recommendation: RecommendationType;
  rationale: string;
  tdsReference?: string;   // For System Implementation patterns
  examples: TestExample[];
  proposedFix?: string;    // Code example if applicable
}

interface TestExample {
  filePath: string;
  lineNumber: number;
  description: string;
}

interface PotentialBug {
  id: string;
  description: string;
  evidence: string;
  testsAffected: string[];
  recommendation: 'investigate' | 'fix-in-scope' | 'separate-task';
}
```

### Test Categorization

```typescript
enum TestCategory {
  EVERGREEN = 'evergreen',   // Permanent behavior verification
  TEMPORARY = 'temporary'     // Has retirement criteria
}

interface TestMetadata {
  category: TestCategory;
  retirementCriteria?: string;  // Required for TEMPORARY
  createdInSpec?: string;        // e.g., "017", "023"
  purpose: string;
}
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Audit Before Implementation
*For any* test section, the audit phase SHALL be completed and findings documented before any code changes are made.
**Validates: Requirements 1.1**

### Property 2: Appropriate Evaluation Criteria
*For any* test being evaluated, the evaluation criteria SHALL match the test's section (TDS for System Implementation, performance for Release Analysis, configuration for Infrastructure).
**Validates: Requirements 2.1, 2.2, 2.3**

### Property 3: Nuanced Recommendation
*For any* test in findings, the recommendation SHALL be one of five categories (Delete, Fix, Refine, Convert, Keep) with explicit rationale.
**Validates: Requirements 3.1-3.7**

### Property 4: Confirmation Gate
*For any* implementation action, there SHALL exist a corresponding entry in the confirmed actions document.
**Validates: Requirements 4.1, 5.1**

### Property 5: Sequential Section Completion
*For any* section N+1, section N SHALL be completed (all tests passing) before section N+1 begins implementation.
**Validates: Requirements 7.1, 7.2**

### Property 6: Pattern-Based Grouping
*For any* findings document, test failures SHALL be grouped by pattern rather than listed individually.
**Validates: Requirements 11.1, 11.2**

### Property 7: Bug Flagging
*For any* test failure that might indicate a real bug, the findings document SHALL flag it with evidence and recommendation.
**Validates: Requirements 12.1, 12.2, 12.3**

### Property 8: Test Categorization
*For any* test, it SHALL be explicitly categorized as evergreen or temporary with appropriate metadata.
**Validates: Requirements 13.1, 13.2, 13.3**

---

## Error Handling

### Audit Phase Errors

| Error | Handling |
|-------|----------|
| Test file not found | Log warning, continue with available tests |
| Test parse error | Log error with location, flag for manual review |
| Ambiguous pattern | Create separate pattern, flag for confirmation |
| TDS interpretation unclear | Flag for human decision during confirmation |

### Confirmation Phase Errors

| Error | Handling |
|-------|----------|
| Missing categorization | Block implementation until all patterns categorized |
| Conflicting recommendations | Flag for human resolution |
| Incomplete bug investigation | Block implementation until investigation complete |

### Implementation Phase Errors

| Error | Handling |
|-------|----------|
| Test still failing after fix | Log failure, investigate root cause, escalate if needed |
| Unintended test breakage | Revert change, re-evaluate in findings |
| Performance regression | Document, decide if in scope or separate optimization task |

---

## Testing Strategy

### Manual Verification (Primary)

Given the human-in-the-loop nature of this spec, most verification is manual:

1. **Audit completeness**: Human reviews findings document for coverage and pattern accuracy
2. **Confirmation accuracy**: Human verifies recommendations match system knowledge
3. **Implementation correctness**: Human reviews test changes for TDS alignment

### Automated Checks (Supporting)

1. **Document structure**: Verify findings/confirmation documents have required sections
2. **Test execution**: Run section tests after implementation to verify green
3. **Full suite**: Run complete test suite after all sections for final verification
4. **Baseline establishment**: Capture new performance baseline after fixes

### Property-Based Testing

Due to the process-oriented nature of this spec (audit → confirm → implement), traditional property-based testing is limited. The correctness properties above are verified through:

1. **Process gates**: Implementation blocked without confirmation
2. **Document validation**: Required sections and patterns present
3. **Section completion**: Tests must pass before next section begins

---

## Design Decisions

### Decision 1: Audit-First, No Code Changes Until Confirmation

**Context**: Should we fix tests as we find issues or audit everything first?

**Decision**: Complete audit of all failing tests before any code changes, with mandatory human confirmation.

**Rationale**: 
- Mirrors successful Spec 023 pattern
- Prevents wasted effort fixing tests that should be deleted
- Distinguishes test issues from real bugs
- Enables informed decisions based on full landscape
- Avoids assumptions about test intent

**Alternatives Considered**:
- Fix as we go: Would waste effort on tests that should be deleted
- Parallel audit and fix: Would create confusion and potential rework

### Decision 2: Three-Section Structure

**Context**: Should we audit all tests together or separate by system?

**Decision**: Three separate sections (Infrastructure, System Implementation, Release Analysis) with different evaluation criteria.

**Rationale**:
- Different systems have different purposes and requirements
- Infrastructure tests validate configuration, not behavior
- System Implementation tests validate product functionality (TDS applies)
- Release Analysis tests validate tooling performance (different criteria)
- Clear boundaries enable appropriate evaluation

**Alternatives Considered**:
- Single audit: Would apply wrong criteria to some tests
- More sections: Would create unnecessary complexity

### Decision 3: Nuanced Recommendations (Five Categories)

**Context**: How should we categorize test recommendations?

**Decision**: Five categories - Delete, Fix, Refine, Convert, Keep.

**Rationale**:
- Avoids binary "good vs bad" thinking
- Fix: Checks right thing wrong way (e.g., implementation instead of behavior)
- Refine: Too strict or too loose, needs adjusted criteria
- Convert: Temporary test that should become evergreen
- Delete: No longer provides value, retirement criteria met
- Keep: Already aligned with standards

**Alternatives Considered**:
- Binary (Fix/Delete): Too limiting, misses nuance
- Free-form: Too unstructured for systematic processing

### Decision 4: Pattern-Based Findings (Spec 011 Format)

**Context**: How should findings documents be structured?

**Decision**: Group failures by pattern with examples, not test-by-test listing.

**Rationale**:
- Spec 011 used this format successfully
- Scannable and actionable
- Avoids redundancy (150 tests with same issue = 1 pattern)
- Findings inform tasks (not the other way around)
- Easier to review and confirm

**Alternatives Considered**:
- Test-by-test: Would be overwhelming (797 tests)
- Task-first: Tasks don't exist during audit phase

### Decision 5: Sequential Section Execution

**Context**: Should sections be audited in parallel or sequentially?

**Decision**: Sequential execution (Infrastructure → System Implementation → Release Analysis).

**Rationale**:
- Smaller test runs = faster feedback
- Learn patterns from earlier sections
- Less cognitive load
- Can prioritize if time becomes issue
- Infrastructure fixes may resolve some System Implementation failures

**Alternatives Considered**:
- Parallel: Would be faster but harder to coordinate and learn from patterns

### Decision 6: Audit Passing Tests Too

**Context**: Should we only audit failing tests or include passing tests?

**Decision**: Audit both failing and passing tests for TDS alignment.

**Rationale**:
- Passing tests might have same anti-patterns (just haven't broken yet)
- Comprehensive TDS alignment prevents future issues
- Icon/ButtonCTA/etc are reference examples, but still audit them
- Don't assume Spec 023 was perfect

**Alternatives Considered**:
- Failing only: Would miss anti-patterns in passing tests
- All tests equally: Would be overwhelming, prioritize failing first

### Decision 7: Adjust Targets, Don't Optimize

**Context**: For Release Analysis performance tests, should we optimize code or adjust targets?

**Decision**: Adjust timeout values and performance targets to realistic values.

**Rationale**:
- Performance optimization is separate concern (different spec)
- This spec focuses on test quality, not code performance
- Realistic targets let us validate test suite works
- Can optimize later if performance becomes actual bottleneck

**Alternatives Considered**:
- Optimize code: Would expand scope significantly
- Delete performance tests: Would lose valuable regression detection

### Decision 8: Token Compliance Tests Are Evergreen

**Context**: Are token compliance tests temporary or evergreen?

**Decision**: Evergreen (permanent requirement) but refine evaluation criteria.

**Rationale**:
- Token compliance is permanent requirement for design system
- The goal (compliance) is valuable
- Implementation (what counts as violation) needs refinement
- Tests detecting `|| 'fallback'` patterns may be too strict if fallbacks are intentional

**Alternatives Considered**:
- Temporary: Would lose valuable compliance checking
- Delete: Would allow token violations to accumulate

---

## Artifacts

### Per-Section Artifacts

| Artifact | Location | Created By |
|----------|----------|------------|
| Infrastructure Findings | `findings/infrastructure-audit-findings.md` | Section 1 Audit |
| Infrastructure Confirmed Actions | `findings/infrastructure-confirmed-actions.md` | Section 1 Confirmation |
| System Implementation Findings | `findings/system-implementation-audit-findings.md` | Section 2 Audit |
| System Implementation Confirmed Actions | `findings/system-implementation-confirmed-actions.md` | Section 2 Confirmation |
| Release Analysis Findings | `findings/release-analysis-audit-findings.md` | Section 3 Audit |
| Release Analysis Confirmed Actions | `findings/release-analysis-confirmed-actions.md` | Section 3 Confirmation |

### Cross-Section Artifacts

| Artifact | Location | Created By |
|----------|----------|------------|
| Temporary Test Review | `findings/temporary-test-review.md` | Throughout |
| Final Verification Report | `findings/final-verification-report.md` | Verification phase |
| New Performance Baseline | `findings/performance-baseline.md` | After all fixes |

---

## Integration with Test Development Standards

### TDS Principles Applied

This spec systematically applies Test Development Standards principles:

1. **Behavior over Implementation**: Tests should verify what the system does, not how it does it
2. **Evergreen over Temporary**: Prefer permanent tests with clear retirement criteria for temporary tests
3. **Contracts over Details**: Test public APIs and contracts, not internal implementation details
4. **Functional Requirements over Philosophical Preferences**: Test what the system must do, not what we wish it did

### Reference Implementations

Icon, ButtonCTA, TextInputField, and Container tests (from Spec 023) serve as reference implementations of TDS-aligned tests. These will be audited to verify alignment and used as examples for fixing other component tests.

---

*Design document for Spec 025. Ready for tasks document development.*
