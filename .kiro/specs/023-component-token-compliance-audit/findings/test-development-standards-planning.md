# Test Development Standards Planning

**Date**: December 17, 2025
**Context**: Task 2.FIX.6 planning discussion
**Purpose**: Capture findings and design decisions for Test Development Standards steering document

---

## Background

During Icon test investigation (tasks 2.FIX.1 and 2.FIX.2), we identified patterns that suggest broader test quality issues beyond Icon-specific problems. This document captures the discussion and decisions about creating a Test Development Standards steering document.

---

## Key Findings from Icon Test Investigation

### 1. Web Component Testing Gap (2.FIX.1)
- **Issue**: 24 tests failing due to improper JSDOM/custom element setup
- **Root Cause**: Tests don't account for async web component lifecycle
- **Pattern**: Missing `customElements.whenDefined()`, no async waits for `connectedCallback`
- **Implication**: Knowledge gap in web component testing practices

### 2. Implementation Detail Testing (2.FIX.2)
- **Issue**: 6 tests failing because they check for inline attributes instead of CSS classes
- **Root Cause**: Tests assume implementation details rather than testing behavior
- **Pattern**: Tests check "how" (width="24" attribute) instead of "what" (icon renders at correct size)
- **Implication**: Tests are brittle and fail when implementation changes even though behavior is correct

### 3. Common Thread
Both issues stem from **tests being written against implementation details rather than behavior/contracts**.

---

## Collective vs Individual Issues Analysis

### Individual Issues
- 2.FIX.1: Technical problem with test environment setup
- 2.FIX.2: Test expectations mismatch with design

### Collective Issue
Broader pattern of:
- Tests not being maintained as design evolved
- Tests checking implementation details instead of contracts
- Insufficient web component testing expertise
- Possible lack of test review process

### Conclusion
**Mix of both**: Individual technical issues that reveal a collective need for test development standards.

---

## Proposed Solution: Test Development Standards Document

### Rationale for New Steering Document

**Why create a new document?**
1. **Captures learning while fresh**: Concrete examples from Icon investigation
2. **Parallels Task 9 pattern**: Accumulate guidance similar to Component Development Guide opportunities
3. **Prevents future issues**: Other components will face similar testing challenges
4. **Timing is right**: First component in audit - remaining components benefit immediately

**Why not wait?**
- We have enough signal now (30 failing tests with clear patterns)
- Don't need to wait for more components to see the patterns
- Can apply immediately to ButtonCTA, TextInputField, Container

### Document Scope

**Core Topics** (from Icon findings):
1. Web component testing patterns (JSDOM setup, async lifecycle)
2. Integration testing patterns (behavior vs implementation)
3. Anti-patterns to avoid (concrete examples from Icon)

**Additional Topics** (from planning discussion):
4. Evergreen vs temporary test categories
5. Testing behavior vs philosophical preferences
6. Test lifecycle management (write, update, delete, retire)

---

## Key Concepts to Cover

### 1. Evergreen vs Temporary Tests

**Evergreen Tests**: Maintained indefinitely, verify core behavior
- Test public APIs and contracts
- Verify functional requirements
- Survive refactoring
- Provide long-term value
- **Example**: Icon.test.ts (functional API tests)

**Temporary Tests**: Serve specific purpose, should be retired after completion
- Verify migration progress
- Check temporary constraints
- Become maintenance burden after purpose served
- Should have explicit retirement criteria
- **Example**: Token compliance tests (retire after all components migrated)

**Decision Framework**:
- Does this test verify permanent behavior? → Evergreen
- Does this test check temporary constraint? → Temporary
- Will this test provide value in 6 months? → If no, Temporary

**Why This Matters**:
- Helps teams decide which tests to maintain forever vs delete after spec completes
- Prevents accumulation of maintenance burden from tests that served their purpose
- Makes test suite more sustainable over time

### 2. Testing Behavior vs Philosophical Preferences

**Behavior**: What the system does (functional requirements)
**Philosophy**: How the system should be structured (opinions/preferences)

**Philosophical Tests to Avoid**:
- "Components must use CSS classes for sizing" (preference)
- "All values must come from tokens" (becomes philosophical after migration)
- "Code must follow specific pattern" (unless pattern affects behavior)

**Functional Tests to Keep**:
- "Icon renders at 24px when size prop is 24" (behavior)
- "ButtonCTA icon matches button size variant" (behavior)
- "Components are accessible to screen readers" (behavior)

**Example from Icon**:
- ❌ Bad: "Icon has width='24' attribute" (tests philosophical preference for inline attributes)
- ✅ Good: "Icon renders at correct size" (tests functional behavior)

**Why This Matters**:
- Philosophical tests become brittle when implementation changes
- Functional tests survive refactoring
- Teams waste time maintaining tests that don't verify requirements

### 3. Test Lifecycle Management

**When to Write Tests**:
- During feature development (evergreen tests)
- During migration/cleanup (temporary tests with retirement plan)

**When to Update Tests**:
- When requirements change
- When contracts change
- When tests fail due to refactoring (evaluate if test is too brittle)

**When to Delete Tests**:
- Temporary tests after purpose served
- Tests that check implementation details that changed
- Tests that provide no value (philosophical tests)
- Duplicate tests

**Retirement Criteria for Temporary Tests**:
- Link temporary tests to spec/task completion
- Document retirement criteria in test comments
- Review temporary tests after each spec completes
- Delete confidently when criteria met

**Why This Matters**:
- Prevents test suite from growing unbounded
- Reduces maintenance burden
- Keeps test suite focused on valuable tests

---

## Cross-References to Existing Documentation

### Spec 017 Design Doc
**File**: `.kiro/specs/017-component-code-quality-sweep/design.md`

**Relevant Content**:
- Test lifecycle and maintenance philosophy
- When tests should be retired
- Temporary vs permanent test distinctions

**Action**: Review this doc when creating Test Development Standards to extract and refine these principles.

### Component Development Guide
**File**: `.kiro/steering/Component Development Guide.md`

**Relevant Content**:
- Component-specific testing patterns
- Token-based design testing considerations

**Action**: Cross-reference for component testing context.

---

## Document Structure (Proposed)

```markdown
# Test Development Standards

**Date**: December 17, 2025
**Purpose**: Establish sustainable test development practices
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 2

## Overview
Standards for writing maintainable, meaningful tests that support system evolution.

## Test Categories
### Evergreen Tests
[Definition, characteristics, examples, decision framework]

### Temporary Tests
[Definition, characteristics, examples, retirement criteria]

## Testing Philosophy
### Test Behavior, Not Implementation
[Principles, examples from Icon]

### Test Contracts, Not Details
[Principles, examples from ButtonCTA integration]

### Don't Test Philosophical Preferences
[Definition, examples, decision framework]

## Web Component Testing Patterns
[Content from 2.FIX.1 findings]
- JSDOM setup requirements
- Custom element registration
- Async lifecycle handling
- Shadow DOM querying

## Integration Testing Patterns
[Content from 2.FIX.2 findings]
- What to verify in integration tests
- Checking contracts vs implementation
- CSS-based sizing vs inline attributes
- Token-based design considerations

## Anti-Patterns
[Concrete examples from Icon test issues]
- ❌ Checking for inline attributes when design uses CSS
- ❌ Assuming synchronous web component rendering
- ❌ Testing implementation details that might change
- ❌ Writing tests before design is finalized

## Test Lifecycle Management
### When to Write Tests
### When to Update Tests
### When to Delete Tests
### Retirement Criteria for Temporary Tests

## Examples from Icon
- ✅ Good: Icon.test.ts (functional API tests)
- ❌ Bad: Icon.lifecycle.test.ts (missing async setup)
- ❌ Bad: Icon.buttonCTA-integration.test.ts (checking wrong details)
- ✅ Fixed: How we corrected both issues

## Cross-References
- Spec 017 Design Doc: Test lifecycle philosophy
- Component Development Guide: Component testing patterns
- Development Workflow: Test execution practices
```

---

## Implementation Notes for Task 2.FIX.6

### Prerequisites
1. Complete tasks 2.FIX.3, 2.FIX.4, 2.FIX.5 (Icon test fixes)
2. Review Spec 017 design doc for test lifecycle guidance
3. Review icon-test-investigation.md for concrete examples

### Deliverables
1. `.kiro/steering/Test Development Standards.md` (new steering document)
2. Cross-references to Component Development Guide and Spec 017
3. Concrete examples from Icon test fixes

### Success Criteria
- Document covers all key concepts (evergreen/temporary, behavior/philosophy, lifecycle)
- Includes concrete examples from Icon investigation
- Provides actionable decision frameworks
- Cross-references existing documentation appropriately
- Follows steering document format and metadata standards

---

## Discussion Points Captured

### Peter's Suggestions
1. **Evergreen vs Temporary Tests**: Distinguish tests that should be maintained forever vs tests that create maintenance burden after serving their purpose
2. **Not Testing Philosophical Ideas**: Avoid tests that check opinions about code structure rather than functional requirements
3. **Spec 017 Connection**: Reference existing design doc that covers some of these ideas, refine and expand
4. **Timing**: Create this document now (after Icon fixes) rather than waiting for more components

### Agent's Analysis
1. **Common Thread**: Both Icon test issues stem from testing implementation details rather than behavior
2. **Mix of Issues**: Individual technical problems that reveal collective need for standards
3. **Timing Rationale**: Have enough signal now, don't need to wait for more components
4. **Document Scope**: Balance concrete examples from Icon with broader principles for all components

### Agreed Approach
1. Add task 2.FIX.6 to tasks.md (done)
2. Capture findings in this planning document (done)
3. Execute task after Icon test fixes complete (2.FIX.3, 2.FIX.4, 2.FIX.5)
4. Use Icon examples as concrete illustrations of principles
5. Extract and refine principles from Spec 017 design doc

---

## Next Steps

1. **Complete Icon test fixes** (tasks 2.FIX.3, 2.FIX.4, 2.FIX.5)
2. **Review Spec 017 design doc** for test lifecycle guidance
3. **Execute task 2.FIX.6** to create Test Development Standards document
4. **Apply standards** to ButtonCTA, TextInputField, Container test development

---

## Related Files

- **Icon Investigation**: `.kiro/specs/023-component-token-compliance-audit/findings/icon-test-investigation.md`
- **Spec 017 Design**: `.kiro/specs/017-component-code-quality-sweep/design.md`
- **Tasks**: `.kiro/specs/023-component-token-compliance-audit/tasks.md` (task 2.FIX.6)
- **Future Document**: `.kiro/steering/Test Development Standards.md` (to be created)

---

## Validation

**Planning Complete**: ✅
- Key concepts identified and defined
- Document structure proposed
- Cross-references identified
- Implementation approach agreed
- Task added to tasks.md

**Ready for Execution**: After tasks 2.FIX.3, 2.FIX.4, 2.FIX.5 complete
