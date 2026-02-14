---
inclusion: manual
name: Component-Development-Standards
description: Step-by-step guidelines for creating new component families in the Stemma System — family creation criteria, primitive vs semantic design, scaffolding workflow, and documentation requirements. Load when creating new component families or evaluating component design decisions.
---

# Component Family Development Standards

**Date**: 2026-01-02
**Purpose**: Step-by-step guidelines for creating new component families in the Stemma System
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 2
**Relevant Tasks**: component-development, architecture, spec-planning
**Last Reviewed**: 2026-01-02

---

## Overview

This document provides comprehensive guidelines for creating new component families in the Stemma System. It covers the complete lifecycle from initial planning through implementation and documentation, with decision frameworks for primitive vs semantic component design.

**Audience**: AI agents and developers creating new component families
**Prerequisites**: Familiarity with Stemma System Principles and Component Schema Format

---

## Family Creation Decision Framework

### When to Create a New Family

**Create a new family when ALL of these criteria are met**:

| Criterion | Question | Example |
|-----------|----------|---------|
| **Shared Purpose** | Do components share a common purpose that doesn't fit existing families? | "Progress indication" doesn't fit Form Inputs or Buttons |
| **Multiple Variants** | Can you identify at least 3 potential semantic variants? | Loading: Spinner, Progress, Skeleton |
| **Clear Base Behaviors** | Can you define foundational behaviors that ALL variants share? | All loading indicators: `indicates_loading`, `accessible_label` |
| **Cross-Platform Need** | Is this needed across web, iOS, and Android? | Yes - all platforms need loading indicators |

**Do NOT create a new family when**:
- The component fits within an existing family's purpose
- Only 1-2 variants are needed (consider adding to existing family)
- Behaviors don't generalize across variants
- It's platform-specific functionality

### Family vs Component Decision Tree

```
Need a new component?
    │
    ├── Does it fit an existing family's purpose?
    │   ├── YES → Add as semantic variant to existing family
    │   └── NO → Continue evaluation...
    │
    ├── Can you identify 3+ semantic variants?
    │   ├── YES → Continue evaluation...
    │   └── NO → Consider standalone component or existing family
    │
    ├── Do variants share foundational behaviors?
    │   ├── YES → Create new family
    │   └── NO → May need multiple families or standalone components
    │
    └── Human-AI checkpoint for approval
```

---

## Step-by-Step Family Creation Process

### Phase 1: Planning and Design

#### Step 1.1: Define Family Purpose

Document the shared need that unites all components in the family.

**Template**:
```markdown
## Family: [Family Name]

**Shared Need**: [One sentence describing what all components in this family do]

**Examples of Use Cases**:
- [Use case 1]
- [Use case 2]
- [Use case 3]

**Why This Needs a New Family**:
[Explain why existing families don't cover this need]
```

**Form Inputs Example**:
```markdown
## Family: Form Inputs

**Shared Need**: Data collection and validation

**Examples of Use Cases**:
- Collecting email addresses with validation
- Secure password entry with visibility toggle
- Phone number collection with formatting

**Why This Needs a New Family**:
Form inputs share common behaviors (focusable, validatable, float-label) that don't 
fit within Buttons (action-focused) or Containers (layout-focused).
```

#### Step 1.2: Identify Primitive Base Behaviors

List the foundational behaviors that ALL semantic variants will inherit.

**Behavior Identification Checklist**:
- [ ] What interaction patterns are common to all variants?
- [ ] What accessibility requirements apply to all variants?
- [ ] What visual states are shared (focus, error, disabled)?
- [ ] What token dependencies are universal?

**Template**:
```yaml
base_behaviors:
  - behavior_name: [name]
    description: [what it does]
    wcag_reference: [WCAG criterion if applicable]
    platforms: [web, ios, android]
```

**Form Inputs Example**:
```yaml
base_behaviors:
  - behavior_name: focusable
    description: Can receive keyboard focus via Tab key
    wcag_reference: WCAG 2.1.1
    platforms: [web, ios, android]
    
  - behavior_name: float_label_animation
    description: Label animates between placeholder and floated positions
    wcag_reference: WCAG 2.3.3
    platforms: [web, ios, android]
    
  - behavior_name: validates_on_blur
    description: Validation triggers when field loses focus
    wcag_reference: WCAG 3.3.1
    platforms: [web, ios, android]
    
  - behavior_name: error_state_display
    description: Shows error message and visual error indication
    wcag_reference: WCAG 3.3.1, 1.4.1
    platforms: [web, ios, android]
```

#### Step 1.3: Plan Semantic Variants

Identify the semantic variants that will extend the primitive base.

**Variant Planning Template**:
```markdown
### Semantic Variant: [Variant Name]

**Inherits From**: [Primitive Base]
**Specialized Purpose**: [What makes this variant unique]

**Extended Behaviors**:
- [Behavior 1]: [Description]
- [Behavior 2]: [Description]

**Extended Properties**:
- [Property 1]: [Type] - [Description]
- [Property 2]: [Type] - [Description]
```

**Form Inputs Example**:
```markdown
### Semantic Variant: Input-Text-Email

**Inherits From**: Input-Text-Base
**Specialized Purpose**: Email address collection with validation and autocomplete

**Extended Behaviors**:
- validates_email_format: Validates input against RFC 5322 email pattern
- provides_email_autocomplete: Enables browser/platform email autofill

**Extended Properties**:
- customValidator: (email: string) => boolean - Custom validation function
- invalidEmailMessage: string - Custom error message for invalid emails
```

#### Step 1.4: Human-AI Checkpoint

**Before proceeding to implementation, present the following for Human approval**:

1. Family purpose and justification
2. Primitive base behaviors (complete list)
3. Planned semantic variants (at least 3)
4. Naming convention decisions
5. Token dependency overview

**Checkpoint Questions**:
- Does this family fill a genuine gap in the component system?
- Are the base behaviors truly universal to all variants?
- Is the naming convention clear and consistent?
- Are there any existing components that should be migrated to this family?

---

### Phase 2: Naming Convention Decisions

#### Step 2.1: Choose Naming Pattern

Select the appropriate naming pattern based on family characteristics.

**Decision Framework**:

| Family Characteristic | Pattern | Example |
|----------------------|---------|---------|
| Foundational component, no specific type needed | `[Family]-Base` | `Container-Base`, `Icon-Base` |
| Has semantic variants with shared type | `[Family]-[Type]-Base` | `Input-Text-Base` |
| Standalone with descriptive type | `[Family]-[Type]` | `Button-CTA` |

**Form Inputs Decision**:
- Family has multiple types (Text, Select, Checkbox, etc.)
- Text inputs have semantic variants (Email, Password, PhoneNumber)
- Pattern: `[Family]-[Type]-Base` → `Input-Text-Base`
- Semantic variants: `Input-Text-Email`, `Input-Text-Password`

#### Step 2.2: Document Naming Rationale

```markdown
### Naming Convention for [Family Name]

**Pattern Used**: [Pattern]
**Rationale**: [Why this pattern was chosen]

**Primitive Component**: [Name]
**Semantic Variants**:
- [Variant 1 Name]
- [Variant 2 Name]
- [Variant 3 Name]
```

---

### Phase 3: Schema Definition

#### Step 3.1: Create Primitive Base Schema

Create the YAML schema for the primitive base component.

**Schema Location**: `src/components/core/[Component-Name]/[Component-Name].schema.yaml`

**Required Schema Sections**:
```yaml
# Identity
name: [Component-Name]
type: primitive
family: [FamilyName]

# Behaviors
behaviors:
  - [behavior1]
  - [behavior2]

# Properties
properties:
  [property_name]:
    type: [string | boolean | number | enum]
    required: [true | false]
    default: [default_value]
    description: [description]

# Contracts
contracts:
  - name: [contract_name]
    description: [what the contract guarantees]
    platforms: [web, ios, android]
    required: [true | false]
    wcag: [WCAG reference if applicable]

# Token Dependencies
tokens:
  - [token.pattern.*]

# Platform Support
platforms: [web, ios, android]

# Status
readiness: [placeholder | beta | production-ready]
```

**Form Inputs Example** (Input-Text-Base):
```yaml
name: Input-Text-Base
type: primitive
family: FormInputs

behaviors:
  - focusable
  - validatable
  - float-label

properties:
  id:
    type: string
    required: true
    description: Unique identifier for the input element
  label:
    type: string
    required: true
    description: Label text (floats between placeholder and floated positions)
  value:
    type: string
    required: true
    description: Current input value
  onChange:
    type: function
    required: true
    description: Callback when value changes
  errorMessage:
    type: string
    required: false
    description: Error message to display
  disabled:
    type: boolean
    required: false
    default: false
    description: Whether input is disabled

contracts:
  - name: focusable
    description: Can receive keyboard focus via Tab key navigation
    platforms: [web, ios, android]
    required: true
    wcag: "2.1.1"
  - name: float_label_animation
    description: Label animates from placeholder to floating position on focus
    platforms: [web, ios, android]
    required: true
    wcag: "2.3.3"
  - name: validates_on_blur
    description: Validation triggers when field loses focus
    platforms: [web, ios, android]
    required: true
    wcag: "3.3.1"
  - name: error_state_display
    description: Displays error message and visual error indication
    platforms: [web, ios, android]
    required: true
    wcag: "3.3.1, 1.4.1"

tokens:
  - typography.labelMd
  - typography.input
  - color.text.*
  - color.primary
  - color.error
  - space.inset.*
  - motion.floatLabel
  - accessibility.focus.*

platforms: [web, ios, android]
readiness: production-ready
```

#### Step 3.2: Create Semantic Variant Schemas

For each semantic variant, create a schema that extends the base.

**Semantic Schema Template**:
```yaml
name: [Variant-Name]
type: semantic
family: [FamilyName]
inherits: [Base-Component-Name]

# Additional behaviors (extends base)
behaviors:
  # Inherits all base behaviors
  - [extended_behavior1]
  - [extended_behavior2]

# Extended properties (in addition to inherited)
extends:
  properties:
    [new_property]:
      type: [type]
      required: [true | false]
      description: [description]

# Extended contracts (in addition to inherited)
contracts:
  # Inherits all base contracts
  - name: [extended_contract]
    description: [description]
    platforms: [web, ios, android]
    required: [true | false]

platforms: [web, ios, android]
readiness: [status]
```

---

### Phase 4: Implementation

#### Step 4.1: Create Directory Structure

```
src/components/core/[Component-Name]/
├── [Component-Name].schema.yaml
├── index.ts
├── types.ts
├── tokens.ts
├── README.md
├── __tests__/
│   └── [Component-Name].test.ts
└── platforms/
    ├── web/
    │   ├── [Component-Name].web.ts
    │   └── styles.css
    ├── ios/
    │   └── [Component-Name].ios.swift
    └── android/
        └── [Component-Name].android.kt
```

#### Step 4.2: Implement Primitive Base

**Implementation Order**:
1. Define types (`types.ts`)
2. Define token mappings (`tokens.ts`)
3. Implement web component (`platforms/web/`)
4. Implement iOS component (`platforms/ios/`)
5. Implement Android component (`platforms/android/`)
6. Write tests (`__tests__/`)
7. Create README documentation

**Key Implementation Principles**:
- All behavioral contracts MUST be implemented on all platforms
- Token usage MUST follow Rosetta System patterns
- Accessibility requirements MUST be met per WCAG references
- Platform-specific implementations are allowed if contracts are preserved

#### Step 4.3: Implement Semantic Variants

For each semantic variant:
1. Extend the primitive base
2. Add extended behaviors
3. Add extended properties
4. Implement extended contracts
5. Write variant-specific tests

**Inheritance Verification Checklist**:
- [ ] All base contracts are preserved
- [ ] All base properties are available
- [ ] Extended behaviors don't conflict with base
- [ ] Token dependencies include base tokens

---

### Phase 5: Documentation

#### Step 5.1: Create MCP Family Document

Create the MCP-queryable documentation for the family.

**Location**: `.kiro/steering/Component-Family-[FamilyName].md`

**Required Sections**:
1. Family Overview
2. Inheritance Structure
3. Behavioral Contracts
4. Component Schemas
5. Token Dependencies
6. Usage Guidelines
7. Cross-Platform Notes
8. Related Documentation

**Use the MCP Component Family Document Template**: `.kiro/steering/Component-MCP-Document-Template.md`

#### Step 5.2: Update Component Quick Reference

Add the new family to the Component Quick Reference routing table.

**Location**: `.kiro/steering/Component-Quick-Reference.md`

**Add entry**:
```markdown
| [Family Name] | [Shared Need] | `.kiro/steering/Component-Family-[FamilyName].md` | [Status] |
```

#### Step 5.3: Update Inheritance Structures Document

Add the new family to the Component Family Inheritance Structures document.

**Location**: `.kiro/steering/Component-Inheritance-Structures.md`

**Add section with**:
- Inheritance structure diagram
- Component summary table
- Behavioral contracts
- Token dependencies
- MCP documentation reference

---

### Phase 6: Validation and Review

#### Step 6.1: Schema Validation

Verify all schemas are valid and complete:
- [ ] All required fields present
- [ ] Property types are valid
- [ ] Contracts reference valid WCAG criteria
- [ ] Token patterns exist in token system
- [ ] Platforms list is complete

#### Step 6.2: Implementation Validation

Verify implementations match schemas:
- [ ] All contracts implemented on all platforms
- [ ] All properties available on all platforms
- [ ] Token usage matches schema dependencies
- [ ] Accessibility requirements met

#### Step 6.3: Documentation Validation

Verify documentation is complete:
- [ ] MCP family document created
- [ ] Component Quick Reference updated
- [ ] Inheritance Structures updated
- [ ] README files created for each component

#### Step 6.4: Human-AI Checkpoint

**Final review before marking family as Production Ready**:
- Present implementation summary
- Demonstrate cross-platform consistency
- Review test coverage
- Confirm documentation completeness

---

## Primitive vs Semantic Decision Criteria

### When to Create a Primitive Component

**Create a primitive (Base) component when**:

| Criterion | Description |
|-----------|-------------|
| **Foundational Behaviors** | The component provides behaviors that multiple semantic variants will share |
| **No Specialized Purpose** | The component doesn't have a specific use case beyond being a foundation |
| **Extensibility Required** | Semantic variants will extend this with specialized functionality |
| **Coverage Gap Legitimate** | Using the primitive directly is acceptable when no semantic variant fits |

### When to Create a Semantic Component

**Create a semantic component when**:

| Criterion | Description |
|-----------|-------------|
| **Specialized Purpose** | The component has a specific, well-defined use case |
| **Extended Behaviors** | The component adds behaviors beyond the primitive base |
| **Domain-Specific** | The component handles domain-specific validation, formatting, or functionality |
| **Reusable Pattern** | The specialized behavior is needed in multiple places |

### Decision Examples

| Scenario | Decision | Rationale |
|----------|----------|-----------|
| Need a text input for any text | Use `Input-Text-Base` | No specialized validation needed |
| Need email input with validation | Use `Input-Text-Email` | Semantic variant exists with email validation |
| Need credit card input | Create `Input-Text-CreditCard` | Specialized formatting and validation needed |
| Need a generic container | Use `Container-Base` | No specialized layout behavior needed |
| Need a card with shadow | Create `Container-Card` | Specialized elevation and styling |

### Primitive Usage Philosophy

**Key Distinction from Token Philosophy**:

| System | Primitive Usage | Rationale |
|--------|-----------------|-----------|
| **Tokens** | Discouraged | Semantic tokens provide context and maintainability |
| **Components** | Legitimate | Primitives serve as valid coverage gap solutions |

**When Primitive Component Usage is Appropriate**:
1. No semantic variant exists for the use case
2. Building custom functionality that doesn't fit existing variants
3. Prototyping new patterns before creating semantic variants
4. One-off use cases that don't warrant a new semantic variant

**Goal**: Reduce primitive usage over time by creating semantic variants for common patterns, NOT by avoiding primitives entirely.

---

## Form Inputs Family: Implementation Reference

The Form Inputs family serves as the reference implementation for family creation. Key lessons learned:

### What Worked Well

1. **Clear Base Behaviors**: Defining 9 foundational contracts that ALL variants inherit
2. **Consistent Naming**: `Input-Text-Base` → `Input-Text-Email` pattern is predictable
3. **Token Dependency Documentation**: Comprehensive token mapping enables consistent styling
4. **Cross-Platform Contracts**: Same contracts implemented identically across platforms

### Lessons Learned

1. **Start with Contracts**: Define behavioral contracts before implementation
2. **Document Token Dependencies Early**: Token mapping should be part of schema design
3. **Test Inheritance**: Verify semantic variants properly inherit base behaviors
4. **Accessibility First**: WCAG references in contracts ensure compliance

### Reference Files

| Artifact | Location |
|----------|----------|
| Primitive Schema | `src/components/core/Input-Text-Base/Input-Text-Base.schema.yaml` |
| MCP Documentation | `.kiro/steering/Component-Family-Form-Inputs.md` |
| Web Implementation | `src/components/core/Input-Text-Base/platforms/web/InputTextBase.web.ts` |
| iOS Implementation | `src/components/core/Input-Text-Base/platforms/ios/InputTextBase.ios.swift` |
| Android Implementation | `src/components/core/Input-Text-Base/platforms/android/InputTextBase.android.kt` |

---

## Quick Reference Checklist

### Family Creation Checklist

- [ ] **Phase 1: Planning**
  - [ ] Define family purpose and shared need
  - [ ] Identify primitive base behaviors (minimum 5)
  - [ ] Plan semantic variants (minimum 3)
  - [ ] Human-AI checkpoint approval

- [ ] **Phase 2: Naming**
  - [ ] Choose naming pattern
  - [ ] Document naming rationale
  - [ ] Verify naming follows Stemma conventions

- [ ] **Phase 3: Schema**
  - [ ] Create primitive base schema
  - [ ] Create semantic variant schemas
  - [ ] Validate all schemas

- [ ] **Phase 4: Implementation**
  - [ ] Create directory structure
  - [ ] Implement primitive base (all platforms)
  - [ ] Implement semantic variants (all platforms)
  - [ ] Write tests

- [ ] **Phase 5: Documentation**
  - [ ] Create MCP family document
  - [ ] Update Component Quick Reference
  - [ ] Update Inheritance Structures
  - [ ] Create component READMEs

- [ ] **Phase 6: Validation**
  - [ ] Schema validation
  - [ ] Implementation validation
  - [ ] Documentation validation
  - [ ] Human-AI checkpoint approval

---

## Validation Checklist for New Families

This comprehensive checklist ensures new component families meet all Stemma System requirements before being marked as Production Ready.

### Pre-Implementation Validation

Complete these checks before starting implementation:

#### Planning Validation
- [ ] **Family Purpose Documented**: Clear shared need statement that distinguishes from existing families
- [ ] **Minimum 3 Semantic Variants Identified**: At least 3 planned semantic variants documented
- [ ] **Base Behaviors Defined**: Minimum 5 foundational behaviors that ALL variants will inherit
- [ ] **Human-AI Checkpoint Completed**: Planning phase approved by Human partner
- [ ] **Naming Convention Decided**: Pattern selected and rationale documented

#### Schema Validation
- [ ] **Primitive Base Schema Created**: Complete YAML schema with all required fields
- [ ] **Schema Location Correct**: `src/components/core/[Component-Name]/[Component-Name].schema.yaml`
- [ ] **Required Fields Present**: name, type, family, behaviors, properties, contracts, tokens, platforms, readiness
- [ ] **Property Types Valid**: All properties have valid type definitions
- [ ] **Contracts Reference WCAG**: Accessibility contracts include WCAG criterion references
- [ ] **Token Patterns Exist**: All referenced tokens exist in the token system
- [ ] **Platforms List Complete**: All supported platforms listed (web, ios, android)

### Implementation Validation

Complete these checks during and after implementation:

#### Directory Structure Validation
- [ ] **Standard Structure Created**: Component directory follows standard layout
- [ ] **All Platform Directories Present**: `platforms/web/`, `platforms/ios/`, `platforms/android/`
- [ ] **Test Directory Present**: `__tests__/` directory with test files
- [ ] **Required Files Present**: `index.ts`, `types.ts`, `tokens.ts`, `README.md`

#### Contract Implementation Validation
- [ ] **All Contracts Implemented**: Every contract in schema is implemented on all platforms
- [ ] **Web Implementation Complete**: All contracts work in web component
- [ ] **iOS Implementation Complete**: All contracts work in SwiftUI view
- [ ] **Android Implementation Complete**: All contracts work in Compose composable
- [ ] **Cross-Platform Consistency**: Same trigger conditions, state transitions, and outcomes

#### Token Usage Validation
- [ ] **No Inline Styles**: All styling uses design tokens
- [ ] **Token Dependencies Match Schema**: Implementation uses tokens listed in schema
- [ ] **Rosetta System Compliance**: Token usage follows mathematical relationships
- [ ] **Semantic Tokens Preferred**: Semantic tokens used over primitives where available

#### Accessibility Validation
- [ ] **WCAG AA Compliance**: All WCAG-referenced contracts meet criteria
- [ ] **Focus Management Correct**: Keyboard navigation works correctly
- [ ] **Screen Reader Support**: Proper ARIA attributes (web) and accessibility modifiers (mobile)
- [ ] **Reduced Motion Support**: Animations respect prefers-reduced-motion
- [ ] **Touch Target Size**: Minimum 44x44px touch targets on mobile

### Documentation Validation

Complete these checks for documentation:

#### MCP Documentation Validation
- [ ] **Family Document Created**: `.kiro/steering/Component-Family-[FamilyName].md`
- [ ] **Front-Matter Correct**: `inclusion: manual` in YAML front-matter
- [ ] **Required Sections Present**: Overview, Inheritance Structure, Behavioral Contracts, Component Schemas, Token Dependencies, Usage Guidelines, Cross-Platform Notes
- [ ] **Progressive Disclosure Supported**: Document structure supports summary → section → full queries
- [ ] **MCP Index Updated**: Document appears in MCP index after creation

#### Quick Reference Validation
- [ ] **Routing Entry Added**: Family added to Component Quick Reference routing table
- [ ] **Shared Need Documented**: Clear purpose statement in routing table
- [ ] **MCP Path Correct**: Path to family MCP document is accurate
- [ ] **Status Indicator Set**: Appropriate readiness status shown

#### Inheritance Structures Validation
- [ ] **Family Section Added**: New section in Component-Inheritance-Structures.md
- [ ] **Hierarchy Diagram Included**: ASCII or Mermaid diagram showing inheritance
- [ ] **Component Table Complete**: All components listed with type, inherits, status, description
- [ ] **Behavioral Contracts Listed**: Key contracts documented
- [ ] **Token Dependencies Listed**: Key token patterns documented

### Post-Implementation Validation

Complete these checks before marking as Production Ready:

#### Testing Validation
- [ ] **Unit Tests Written**: Tests for all component behaviors
- [ ] **Contract Tests Written**: Tests verifying each behavioral contract
- [ ] **Cross-Platform Tests Pass**: Tests pass on all platforms
- [ ] **Accessibility Tests Pass**: Automated accessibility tests pass
- [ ] **Test Coverage Adequate**: Critical paths covered by tests

#### Integration Validation
- [ ] **Browser Entry Updated**: Web component registered in browser-entry.ts
- [ ] **Demo Page Updated**: Component demonstrated in demo page (if applicable)
- [ ] **No Breaking Changes**: Existing functionality not affected
- [ ] **Build Passes**: Full build completes without errors
- [ ] **All Tests Pass**: Full test suite passes

#### Final Review Validation
- [ ] **Human-AI Checkpoint Completed**: Final review approved by Human partner
- [ ] **Readiness Status Set**: Appropriate status (Production Ready, Beta, Placeholder)
- [ ] **Release Notes Prepared**: Changes documented for release detection

---

## Review Process for Compliance

This section defines the formal review process for ensuring new component families comply with Stemma System standards.

### Review Stages

#### Stage 1: Planning Review (Human-AI Checkpoint)

**Timing**: After Phase 1 (Planning and Design) completion

**Reviewer**: Human partner

**Review Criteria**:
| Criterion | Pass Condition |
|-----------|----------------|
| Family Justification | Clear explanation of why existing families don't cover the need |
| Base Behaviors | Minimum 5 foundational behaviors identified |
| Semantic Variants | Minimum 3 planned variants with clear purposes |
| Naming Convention | Pattern selected with documented rationale |
| Token Dependencies | Initial token requirements identified |

**Review Outcomes**:
- **Approved**: Proceed to implementation
- **Revisions Required**: Address feedback and re-submit
- **Rejected**: Family not needed or should be merged with existing family

**Documentation**: Record approval in completion document with date and reviewer notes

#### Stage 2: Schema Review

**Timing**: After Phase 3 (Schema Definition) completion

**Reviewer**: AI agent (automated validation) + Human partner (semantic review)

**Automated Validation Checks**:
```yaml
schema_validation:
  required_fields:
    - name
    - type
    - family
    - behaviors
    - properties
    - contracts
    - tokens
    - platforms
    - readiness
  
  type_validation:
    - type must be: primitive | semantic | standalone
    - readiness must be: placeholder | beta | production-ready
    - platforms must include: web, ios, android
  
  contract_validation:
    - Each contract must have: description, platforms, validation
    - WCAG-referenced contracts must have: wcag field
  
  token_validation:
    - All token patterns must exist in token system
    - Token patterns must follow Rosetta System naming
```

**Human Review Criteria**:
| Criterion | Pass Condition |
|-----------|----------------|
| Behavioral Completeness | Contracts cover all expected behaviors |
| Property Design | Properties are well-named and typed appropriately |
| Inheritance Correctness | Semantic variants properly extend base |
| WCAG Coverage | Accessibility requirements adequately addressed |

**Review Outcomes**:
- **Approved**: Proceed to implementation
- **Revisions Required**: Fix schema issues and re-validate

#### Stage 3: Implementation Review

**Timing**: After Phase 4 (Implementation) completion

**Reviewer**: AI agent (automated testing) + Human partner (code review)

**Automated Testing Requirements**:
```yaml
implementation_testing:
  unit_tests:
    - All public methods tested
    - All properties tested
    - Edge cases covered
  
  contract_tests:
    - Each contract has dedicated test
    - Tests verify trigger, state, outcome
    - Cross-platform tests included
  
  accessibility_tests:
    - axe-core tests pass (web)
    - VoiceOver tests documented (iOS)
    - TalkBack tests documented (Android)
```

**Human Review Criteria**:
| Criterion | Pass Condition |
|-----------|----------------|
| Code Quality | Clean, readable, follows project conventions |
| Contract Fidelity | Implementation matches schema contracts |
| Token Usage | Correct tokens used, no inline styles |
| Platform Consistency | Same behavior across all platforms |

**Review Outcomes**:
- **Approved**: Proceed to documentation
- **Revisions Required**: Fix implementation issues and re-test

#### Stage 4: Documentation Review

**Timing**: After Phase 5 (Documentation) completion

**Reviewer**: AI agent (structure validation) + Human partner (content review)

**Automated Validation Checks**:
```yaml
documentation_validation:
  mcp_document:
    - Front-matter includes: inclusion: manual
    - Required sections present
    - MCP index includes document
  
  quick_reference:
    - Family entry exists
    - MCP path is valid
    - Status indicator present
  
  inheritance_structures:
    - Family section exists
    - Hierarchy diagram present
    - Component table complete
```

**Human Review Criteria**:
| Criterion | Pass Condition |
|-----------|----------------|
| Clarity | Documentation is clear and understandable |
| Completeness | All aspects of family documented |
| Accuracy | Documentation matches implementation |
| Examples | Usage examples are helpful and correct |

**Review Outcomes**:
- **Approved**: Proceed to final review
- **Revisions Required**: Update documentation and re-validate

#### Stage 5: Final Review (Human-AI Checkpoint)

**Timing**: After all validation complete

**Reviewer**: Human partner

**Final Review Checklist**:
- [ ] All validation checklist items completed
- [ ] All review stages passed
- [ ] No outstanding issues or TODOs
- [ ] Readiness status appropriate for current state
- [ ] Release notes prepared

**Review Outcomes**:
- **Production Ready**: Family approved for production use
- **Beta**: Family approved for development use, not production
- **Revisions Required**: Address remaining issues

**Documentation**: Create completion document with full validation results

### Review Documentation Template

```markdown
# [Family Name] Family Review Documentation

**Date**: [Date]
**Reviewer**: [Human/AI]
**Review Stage**: [1-5]

## Review Criteria Results

| Criterion | Status | Notes |
|-----------|--------|-------|
| [Criterion 1] | ✅ Pass / ❌ Fail | [Notes] |
| [Criterion 2] | ✅ Pass / ❌ Fail | [Notes] |

## Issues Identified

1. [Issue description and recommended fix]
2. [Issue description and recommended fix]

## Review Outcome

**Decision**: [Approved / Revisions Required / Rejected]

**Next Steps**:
- [Action item 1]
- [Action item 2]

**Reviewer Signature**: [Name/Date]
```

---

## Integration Requirements

This section documents the requirements for integrating new component families with the existing Stemma System infrastructure.

### MCP Server Integration

#### Document Registration

New family MCP documents must be registered with the designerpunk-docs MCP server:

1. **Create Document**: Place family document at `.kiro/steering/Component-Family-[FamilyName].md`
2. **Add Front-Matter**: Include `inclusion: manual` in YAML front-matter
3. **Verify Indexing**: Run `mcp_designerpunk_docs_get_index_health()` to verify document is indexed
4. **Rebuild if Needed**: Run `mcp_designerpunk_docs_rebuild_index()` if document not appearing

#### Progressive Disclosure Support

Family documents must support the MCP progressive disclosure workflow:

```yaml
progressive_disclosure_requirements:
  summary_query:
    - Document summary returns metadata and section outline
    - Summary is under 500 tokens
    - Key information visible without full document load
  
  section_query:
    - Each major section is independently queryable
    - Section headings are unique and descriptive
    - Sections are self-contained where possible
  
  full_document_query:
    - Full document returns complete content
    - Document is well-organized for scanning
    - Cross-references use relative paths
```

### Component Quick Reference Integration

#### Routing Table Entry

Add new family to the Component Quick Reference routing table:

```markdown
| [Family Name] | [Shared Need/Purpose] | `.kiro/steering/Component-Family-[FamilyName].md` | [Status] |
```

**Entry Requirements**:
- Family name matches naming convention
- Shared need is concise (under 50 characters)
- MCP path is accurate and tested
- Status reflects current readiness (🟢 Production Ready, 🟡 Beta, 🔴 Placeholder)

### Inheritance Structures Integration

#### Family Section

Add new family section to `Component-Inheritance-Structures.md`:

```markdown
## [Family Name] Family

**Shared Need**: [Purpose statement]
**MCP Documentation**: `.kiro/steering/Component-Family-[FamilyName].md`

### Inheritance Structure

[ASCII or Mermaid diagram]

### Component Summary

| Component | Type | Inherits | Status | Description |
|-----------|------|----------|--------|-------------|
| [Component] | [Type] | [Base] | [Status] | [Description] |

### Behavioral Contracts

[List of key contracts]

### Token Dependencies

[List of key token patterns]
```

### Browser Entry Integration (Web Components)

#### Component Registration

Register web components in `src/browser-entry.ts`:

```typescript
// Import component
import { [ComponentName] } from './components/core/[Component-Name]/platforms/web/[ComponentName].web';

// Register custom element
if (!customElements.get('[component-name]')) {
  customElements.define('[component-name]', [ComponentName]);
}

// For backward compatibility (if renaming existing component)
if (!customElements.get('[old-component-name]')) {
  customElements.define('[old-component-name]', [ComponentName]);
}
```

**Registration Requirements**:
- Custom element name follows kebab-case convention
- Check for existing registration before defining
- Include backward compatibility registration if renaming

### Validation Infrastructure Integration

#### Stemma Validators

New families should be validated by existing Stemma validators:

```yaml
validator_integration:
  naming_validator:
    - Component names validated against [Family]-[Type]-[Variant] pattern
    - Validator: StemmaComponentNamingValidator
  
  token_validator:
    - Token usage validated against schema dependencies
    - Validator: StemmaTokenUsageValidator
  
  accessibility_validator:
    - Accessibility properties validated
    - Validator: StemmaPropertyAccessibilityValidator
```

#### Test Infrastructure

New families should integrate with existing test infrastructure:

```yaml
test_integration:
  contract_tests:
    - Location: src/__tests__/stemma-system/
    - Pattern: [family-name]-contracts.test.ts
    - Reporter: contract-test-reporter.ts
  
  cross_platform_tests:
    - Location: src/__tests__/stemma-system/
    - Pattern: cross-platform-consistency.test.ts
    - Add family to test matrix
```

### Release Detection Integration

#### Completion Documentation

Family completion triggers release detection:

1. **Create Summary Document**: `docs/specs/[spec-name]/task-N-summary.md`
2. **Trigger Release Detection**: Run `./.kiro/hooks/release-manager.sh auto`
3. **Verify Trigger Created**: Check `.kiro/release-triggers/` for new trigger file

#### Version Impact

New families typically warrant:
- **Minor Version Bump**: New family with Production Ready components
- **Patch Version Bump**: New family with Beta or Placeholder components only

---

## Integration Checklist

Use this checklist to verify all integration requirements are met:

### MCP Integration
- [ ] Family document created at correct location
- [ ] Front-matter includes `inclusion: manual`
- [ ] Document indexed in MCP server
- [ ] Progressive disclosure queries work correctly

### Quick Reference Integration
- [ ] Routing table entry added
- [ ] MCP path is accurate
- [ ] Status indicator is correct

### Inheritance Structures Integration
- [ ] Family section added
- [ ] Hierarchy diagram included
- [ ] Component table complete
- [ ] Contracts and tokens documented

### Browser Entry Integration (Web)
- [ ] Component imported correctly
- [ ] Custom element registered
- [ ] Backward compatibility handled (if applicable)

### Validation Integration
- [ ] Naming validator recognizes family
- [ ] Token validator validates family tokens
- [ ] Accessibility validator checks family components

### Test Integration
- [ ] Contract tests created
- [ ] Cross-platform tests include family
- [ ] All tests pass

### Release Detection Integration
- [ ] Summary document created
- [ ] Release detection triggered
- [ ] Trigger file created

---

## Related Documentation

- [Stemma System Principles](./stemma-system-principles.md) - Core architecture and governance
- [Component Family Templates](./Component-Templates.md) - Ready-to-use schema, inheritance, and contract templates
- [Component Family Inheritance Structures](./Component-Inheritance-Structures.md) - All family structures
- [Component Quick Reference](./Component-Quick-Reference.md) - Family routing table
- [MCP Component Family Document Template](./Component-MCP-Document-Template.md) - Documentation template
- [Form Inputs Components](./Component-Family-Form-Inputs.md) - Reference implementation
- [Behavioral Contract Validation Framework](./Test-Behavioral-Contract-Validation.md) - Contract validation criteria

---

*This document provides the authoritative guidelines for creating new component families in the Stemma System. Follow these standards to ensure consistency, maintainability, and cross-platform compatibility.*
