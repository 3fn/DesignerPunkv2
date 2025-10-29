# Task 1.2 Completion: Document Issue Format and Guidelines

**Date**: October 28, 2025
**Task**: 1.2 Document issue format and guidelines
**Type**: Implementation
**Status**: Complete
**Organization**: spec-completion
**Scope**: phase-1-discovery-audit

---

## Artifacts Modified

- `.kiro/audits/phase-1-issues-registry.md` - Added comprehensive issue format documentation and guidelines

## Implementation Details

### Approach

Documented the complete issue format and guidelines directly in the centralized issues registry to ensure all auditors have immediate access to the standards when documenting issues. The documentation is structured in four main sections:

1. **Complete Issue Format**: Full template with all required fields
2. **Required Fields**: Detailed explanation of each field with examples
3. **Severity Classification Criteria**: Objective criteria for Critical, Important, and Minor severities
4. **Well-Formatted Issue Examples**: Three complete examples demonstrating proper formatting

### Key Decisions

**Decision 1**: Document guidelines in the registry itself
- **Rationale**: Keeps format documentation with the issues, ensuring auditors always have the reference available when documenting
- **Alternative**: Could have created a separate guidelines document, but that would require cross-referencing

**Decision 2**: Include three complete examples
- **Rationale**: Examples demonstrate proper formatting better than abstract descriptions. Included one example for each severity level to show how criteria apply in practice
- **Examples chosen**:
  - Critical: Infrastructure issue (release detection hook failure)
  - Important: Architecture issue (platform generator inconsistency)
  - Minor: Documentation issue (outdated examples)

**Decision 3**: Provide objective severity criteria
- **Rationale**: Severity classification must be consistent across all auditors. Defined specific criteria that can be objectively evaluated rather than subjective judgment
- **Criteria structure**: Each severity level has clear definition, specific criteria, examples, and "when to use" guidance

### Documentation Structure

#### Required Fields Section
Documented all 14 required fields with:
- Format specifications
- Purpose explanations
- Examples where helpful
- Special requirements or notes

Key fields include:
- Issue ID (sequential numbering)
- Severity (with classification criteria)
- Location (file paths, line numbers, context)
- Steps to Reproduce (specific, verifiable steps)
- Evidence (actual code, errors, or output)
- Cross-Area Impact (enables cross-area awareness)

#### Severity Classification Criteria
Provided objective criteria for each severity level:

**Critical**: 
- Must meet at least 2 criteria (blocks development, causes failures, affects multiple systems, no workaround)
- Examples: Complete system failures, broken core functionality

**Important**:
- Must meet at least 1 criterion (reduces efficiency, creates debt, violates patterns, affects single system)
- Examples: Platform inconsistencies, validation gaps, documentation drift

**Minor**:
- Minimal impact criteria (cosmetic, isolated, easy workaround)
- Examples: Naming inconsistencies, missing comments, outdated examples

#### Reproduction Steps Requirements
Defined 5 requirements for reproduction steps:
1. Specific (exact commands and paths)
2. Sequential (numbered in order)
3. Complete (includes prerequisites)
4. Verifiable (others can reproduce)
5. Minimal (fewest steps necessary)

Included good vs bad examples to demonstrate proper formatting.

#### Evidence Requirements
Defined 5 requirements for evidence:
1. Actual (real code/errors, not hypothetical)
2. Relevant (directly demonstrates issue)
3. Sufficient (enough to understand)
4. Formatted (code blocks with language)
5. Contextualized (file paths and line numbers)

Included good vs bad examples to demonstrate proper evidence.

### Integration Points

The documented format integrates with:
- **Discovery Reports**: Reports reference issues by ID using this format
- **Known Issues**: Related Issues field connects to existing `.kiro/issues/` documentation
- **Cross-Area Awareness**: Cross-Area Impact field enables understanding of issue scope
- **Future Fix Specs**: Severity classification guides prioritization for fix specs

## Validation (Tier 2: Standard)

### Syntax Validation
✅ getDiagnostics passed - no syntax errors
✅ Markdown formatting correct
✅ Code blocks properly formatted with language specifications

### Functional Validation
✅ Complete issue format template included with all required fields
✅ All 14 required fields documented with explanations
✅ Severity classification criteria defined with objective criteria
✅ Reproduction steps requirements documented with examples
✅ Evidence requirements documented with examples
✅ Three well-formatted issue examples included (one per severity level)

### Integration Validation
✅ Format integrates with existing registry structure
✅ Examples reference actual project files and systems
✅ Severity criteria align with requirements document definitions
✅ Format supports cross-area awareness through Cross-Area Impact field

### Requirements Compliance
✅ Requirement 1.1: Complete issue format documented with all required fields
✅ Requirement 1.2: Examples of well-formatted issues included (3 examples covering all severity levels)
✅ Requirement 1.3: Severity classification criteria documented with objective criteria
✅ Requirement 1.4: Reproduction steps requirements documented with specific guidelines

## Requirements Compliance

**Requirement 1.1**: Document complete issue format with all required fields
- ✅ Complete template included with all 14 required fields
- ✅ Each field explained with format, purpose, and examples

**Requirement 1.2**: Include examples of well-formatted issues
- ✅ Three complete examples included
- ✅ Examples cover all severity levels (Critical, Important, Minor)
- ✅ Examples demonstrate proper formatting for all required fields

**Requirement 1.3**: Document severity classification criteria
- ✅ Objective criteria defined for each severity level
- ✅ "When to use" guidance provided for each level
- ✅ Examples included for each severity level

**Requirement 1.4**: Document reproduction steps requirements
- ✅ Five specific requirements defined
- ✅ Good vs bad examples provided
- ✅ Evidence requirements also documented with examples

## Lessons Learned

### What Worked Well

- **In-registry documentation**: Keeping the format documentation in the registry itself ensures auditors always have the reference available
- **Complete examples**: The three examples effectively demonstrate proper formatting and show how severity criteria apply in practice
- **Objective criteria**: Defining specific criteria for severity classification removes ambiguity and ensures consistency

### Challenges

- **Balancing detail vs readability**: Had to provide enough detail for clarity without making the documentation overwhelming
  - **Resolution**: Used clear section headings and structured each section consistently
- **Example selection**: Needed examples that were realistic but not too complex
  - **Resolution**: Chose examples from actual project systems that auditors will encounter

### Future Considerations

- **Template automation**: Could create a script to generate issue stubs from the template
- **Validation checklist**: Could add a checklist for auditors to verify they've included all required fields
- **Cross-reference validation**: Could add tooling to validate that Related Issues references actually exist

---

*This completion document records the implementation of comprehensive issue format documentation and guidelines for the Phase 1 Discovery Audit.*
