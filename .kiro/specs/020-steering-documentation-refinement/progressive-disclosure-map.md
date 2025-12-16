# Progressive Disclosure Map

**Date**: December 15, 2025
**Purpose**: Document the four-layer progressive disclosure structure for steering documentation
**Organization**: spec-guide
**Scope**: 020-steering-documentation-refinement

---

## Overview

The steering documentation system uses a four-layer progressive disclosure architecture that gradually increases complexity. This structure enables AI agents to understand foundational concepts before encountering specialized implementation details.

The progressive disclosure metaphor maps to a meal experience:
- **Layer 0**: Reading the menu (understanding how to navigate)
- **Layer 1**: Appetizer (essential context to begin)
- **Layer 2**: Main course (core workflows and patterns)
- **Layer 3**: Dessert (specialized knowledge for specific domains)

---

## Layer 0: Meta-guide

### Purpose
Teach AI agents how to use the steering documentation system itself.

### Characteristics
- **Audience**: All AI agents, first-time readers
- **Complexity**: Minimal - focuses on navigation and system understanding
- **Loading**: Always loaded for every task
- **Content Focus**: System mechanics, conditional loading, reading strategies

### Documents

#### 00-Steering Documentation Directional Priorities.md
- **Purpose**: Meta-guide teaching AI agents how to use conditional loading
- **Key Content**: 
  - How the steering system works
  - When to read which documents
  - Completion confirmation protocol
- **Relevant Tasks**: all-tasks
- **Inclusion**: always

### When to Assign Documents to Layer 0
- Document teaches how to use the steering system
- Document explains navigation or reading strategies
- Document is prerequisite to understanding other layers
- Document applies to all AI agents regardless of task type

---

## Layer 1: Foundational Concepts

### Purpose
Provide foundational concepts and project principles that apply across all work.

### Characteristics
- **Audience**: All AI agents, all task types
- **Complexity**: Low - essential context without deep technical detail
- **Loading**: Always loaded for every task
- **Content Focus**: Project values, collaboration principles, essential checklists

### Documents

#### Core Goals.md
- **Purpose**: Core project context and development practices
- **Key Content**:
  - DesignerPunk design system overview
  - True Native architecture principles
  - Mathematical token foundations
  - Development practices and priorities
- **Relevant Tasks**: all-tasks
- **Inclusion**: always

#### Personal Note.md
- **Purpose**: Collaboration principles and partnership values
- **Key Content**:
  - Human-AI collaboration philosophy
  - Respect and partnership expectations
  - Communication principles
- **Relevant Tasks**: all-tasks
- **Inclusion**: always

#### Start Up Tasks.md
- **Purpose**: Essential checklist for every task
- **Key Content**:
  - Date verification
  - Jest command reference (not Vitest)
  - Test command selection guidelines
- **Relevant Tasks**: all-tasks
- **Inclusion**: always

### When to Assign Documents to Layer 1
- Document provides essential context for all work
- Document establishes project principles or values
- Document contains information needed regardless of task type
- Document is concise (ideally under 100 lines)
- Document has no conditional sections (all content applies to all tasks)

---

## Layer 2: Frameworks and Patterns

### Purpose
Provide reusable frameworks and patterns for common workflows.

### Characteristics
- **Audience**: AI agents working on standard development tasks
- **Complexity**: Medium - detailed workflows and systematic approaches
- **Loading**: Always loaded, but contains conditional sections
- **Content Focus**: Task completion workflows, organizational standards, systematic methodologies

### Documents

#### Development Workflow.md
- **Purpose**: Task completion workflow and git practices
- **Key Content**:
  - Task completion workflow (IDE-based and script-based)
  - Hook system usage
  - Agent hook dependency chains (conditional)
  - Troubleshooting (conditional)
- **Relevant Tasks**: all-tasks
- **Inclusion**: always
- **Note**: Contains extensive conditional sections for hook debugging and setup

#### File Organization Standards.md
- **Purpose**: Metadata-driven file organization system
- **Key Content**:
  - Required metadata fields
  - Organization field values
  - Directory structure
  - Cross-reference standards
- **Relevant Tasks**: all-tasks
- **Inclusion**: always
- **Note**: Contains conditional sections for specific organization scenarios

#### Spec Planning Standards.md
- **Purpose**: Standards for creating requirements, design, and task documents
- **Key Content**:
  - Requirements document format (EARS, user stories)
  - Design document structure
  - Tasks document format with task type classification
  - Three-tier validation and documentation systems
- **Relevant Tasks**: spec-creation
- **Inclusion**: conditional
- **Trigger**: spec-creation

#### Task Type Definitions.md
- **Purpose**: Define task types for three-tier validation and documentation
- **Key Content**:
  - Setup task definition and examples
  - Implementation task definition and examples
  - Architecture task definition and examples
  - Update history for new patterns
- **Relevant Tasks**: spec-creation
- **Inclusion**: conditional
- **Trigger**: spec-creation

### When to Assign Documents to Layer 2
- Document provides systematic workflows or methodologies
- Document establishes organizational standards
- Document applies to multiple task types (but not necessarily all)
- Document contains reusable patterns or frameworks
- Document may have conditional sections for specific scenarios
- Document is comprehensive (200+ lines acceptable)

---

## Layer 3: Specific Implementations

### Purpose
Provide specific implementation guidance for particular domains.

### Characteristics
- **Audience**: AI agents working on specialized tasks
- **Complexity**: High - detailed technical implementation guidance
- **Loading**: Conditional - only loaded when task type matches
- **Content Focus**: Domain-specific techniques, platform-specific details, specialized tooling

### Documents

#### Component Development Guide.md
- **Purpose**: Guide for building components with token usage and True Native Architecture
- **Key Content**:
  - Token selection decision framework
  - Component structure patterns
  - Cross-platform token consumption
  - Common component patterns
  - Anti-patterns to avoid
- **Relevant Tasks**: coding, accessibility-development
- **Inclusion**: conditional
- **Trigger**: coding, accessibility-development

#### BUILD-SYSTEM-SETUP.md
- **Purpose**: Build system configuration and troubleshooting
- **Key Content**:
  - TypeScript compilation approach
  - Build vs test execution
  - When to build
  - Troubleshooting build issues
  - Type safety enforcement
- **Relevant Tasks**: debugging, validation
- **Inclusion**: conditional
- **Trigger**: debugging, validation

#### Technology Stack.md
- **Purpose**: Technology choices for cross-platform implementation
- **Key Content**:
  - Platform technologies (iOS, Android, Web)
  - Web CSS standards (logical properties)
  - True Native Architecture file organization
- **Relevant Tasks**: architecture, coding
- **Inclusion**: conditional
- **Trigger**: architecture, coding

### When to Assign Documents to Layer 3
- Document provides domain-specific implementation details
- Document focuses on specialized techniques or tooling
- Document applies to narrow set of task types
- Document contains platform-specific or technology-specific guidance
- Document is reference material for specific scenarios
- Document is not needed for general development work

---

## Progressive Disclosure Metaphor

### The Meal Experience

The four-layer structure maps to a restaurant meal experience:

**Layer 0: Reading the Menu**
- Before you can order, you need to understand how the menu works
- What do the symbols mean? How are items organized?
- This is prerequisite knowledge for navigating the meal

**Layer 1: Appetizer**
- Small, essential dishes that set the tone
- Provides context and prepares you for the main course
- Everyone gets the appetizer regardless of what they order

**Layer 2: Main Course**
- Substantial, filling content that forms the core of the meal
- Different people may focus on different parts of their plate
- This is where most of the work happens

**Layer 3: Dessert**
- Specialized, optional items for specific preferences
- Not everyone needs dessert, but it's there when you want it
- Provides finishing touches for specific needs

### Why This Metaphor Works

**Progressive Complexity**: Each layer builds on the previous, gradually increasing detail and specialization.

**Clear Boundaries**: Just as you don't eat dessert before the appetizer, you shouldn't jump to Layer 3 without understanding Layers 0-2.

**Flexible Consumption**: Like a meal, you can focus on what you need. Some tasks only need the appetizer and main course; others benefit from dessert.

**Intuitive Navigation**: The metaphor helps AI agents understand when to read deeply vs when to skim or skip.

---

## Layer Assignment Guidelines

### Decision Framework

When assigning a new document to a layer, ask these questions:

**Is this about the steering system itself?**
- YES → Layer 0 (Meta-guide)
- NO → Continue to next question

**Does this apply to all tasks regardless of type?**
- YES → Is it essential context or a detailed workflow?
  - Essential context → Layer 1 (Foundational Concepts)
  - Detailed workflow → Layer 2 (Frameworks and Patterns)
- NO → Continue to next question

**Does this provide reusable patterns for multiple task types?**
- YES → Layer 2 (Frameworks and Patterns)
- NO → Layer 3 (Specific Implementations)

### Common Assignment Scenarios

**New Process Standard**
- If it applies to all tasks → Layer 1 or 2 (depending on complexity)
- If it applies to specific task types → Layer 2 (with conditional loading)
- If it's highly specialized → Layer 3

**New Technical Guide**
- If it's about general development practices → Layer 2
- If it's about specific technology or domain → Layer 3

**New Troubleshooting Guide**
- If it's general troubleshooting → Layer 2 (as conditional section)
- If it's specific to a tool or technology → Layer 3

**New Methodology Document**
- If it's a core workflow → Layer 2
- If it's a specialized technique → Layer 3

### Edge Cases

**Document Spans Multiple Layers**
- Assign to the lowest applicable layer
- Use conditional sections to separate general from specific content
- Consider splitting if the document becomes too large (>1000 lines)

**Document Evolves Over Time**
- Start at higher layer (more specific)
- Move to lower layer (more general) as patterns emerge
- Update metadata when layer assignment changes

**Unclear Layer Assignment**
- Default to Layer 2 (Frameworks and Patterns)
- Use conditional loading to limit scope
- Reassess after usage patterns emerge

---

## Layer Interaction Patterns

### How Layers Work Together

**Layer 0 → Layer 1**
- Layer 0 teaches how to read strategically
- Layer 1 provides the essential context Layer 0 references
- AI agents read Layer 0 first to understand the system, then Layer 1 for project context

**Layer 1 → Layer 2**
- Layer 1 establishes principles (e.g., "use design tokens")
- Layer 2 provides workflows for applying those principles (e.g., "token selection framework")
- AI agents use Layer 1 for "what" and "why", Layer 2 for "how"

**Layer 2 → Layer 3**
- Layer 2 provides general patterns (e.g., "component structure")
- Layer 3 provides specific implementations (e.g., "button component with tokens")
- AI agents use Layer 2 for systematic approach, Layer 3 for domain expertise

### Cross-Layer References

**Upward References** (Layer 3 → Layer 2 → Layer 1):
- Specific implementations reference general patterns
- General patterns reference foundational principles
- Creates clear dependency chain

**Downward References** (Layer 1 → Layer 2 → Layer 3):
- Foundational principles point to detailed workflows
- Detailed workflows point to specific implementations
- Enables progressive disclosure navigation

**Peer References** (within same layer):
- Documents at same layer can reference each other
- Useful for related workflows or complementary patterns
- Maintains layer cohesion

---

## Validation Checklist

Use this checklist to verify layer assignments are correct:

### Layer 0 Validation
- [ ] Document teaches how to use the steering system
- [ ] Document is prerequisite to understanding other layers
- [ ] Document applies to all AI agents regardless of task
- [ ] Document is always loaded

### Layer 1 Validation
- [ ] Document provides essential context for all work
- [ ] Document establishes project principles or values
- [ ] Document is concise (ideally under 100 lines)
- [ ] Document has no conditional sections
- [ ] Document is always loaded

### Layer 2 Validation
- [ ] Document provides systematic workflows or methodologies
- [ ] Document applies to multiple task types
- [ ] Document contains reusable patterns or frameworks
- [ ] Document may have conditional sections
- [ ] Document is comprehensive (200+ lines acceptable)

### Layer 3 Validation
- [ ] Document provides domain-specific implementation details
- [ ] Document applies to narrow set of task types
- [ ] Document is conditionally loaded based on task type
- [ ] Document contains specialized techniques or tooling
- [ ] Document is reference material for specific scenarios

---

## Future Evolution

### Adding New Layers

The current four-layer structure should accommodate most needs, but future expansion is possible:

**Layer 4: Advanced Topics** (potential future addition)
- Highly specialized, rarely-needed content
- Advanced optimization techniques
- Experimental or cutting-edge approaches
- Only loaded on explicit request

**Criteria for Adding Layer 4**:
- Layer 3 becomes too crowded with diverse content
- Clear distinction emerges between "specialized" and "advanced"
- Usage patterns show Layer 3 documents are too frequently loaded

### Evolving Layer Assignments

As the project evolves, layer assignments may need adjustment:

**Document Promotion** (Layer 3 → Layer 2):
- Pattern becomes widely used across task types
- Content becomes foundational rather than specialized
- Update metadata and cross-references

**Document Demotion** (Layer 2 → Layer 3):
- Content becomes less frequently needed
- Specialization increases
- Conditional loading becomes more appropriate

**Document Splitting**:
- Large documents with mixed layer content
- Split into focused documents at appropriate layers
- Maintain cross-references between split documents

---

## Summary

The four-layer progressive disclosure structure provides:

1. **Clear Navigation**: AI agents know where to find information
2. **Token Efficiency**: Load only what's needed for current task
3. **Gradual Complexity**: Build understanding progressively
4. **Flexible Consumption**: Read deeply or skim based on needs
5. **Maintainable Structure**: Clear guidelines for future additions

**Key Principle**: Each layer serves a distinct purpose in the progressive disclosure of complexity, from meta-guidance (Layer 0) through foundational concepts (Layer 1) and reusable patterns (Layer 2) to specialized implementations (Layer 3).

---

**Organization**: spec-guide
**Scope**: 020-steering-documentation-refinement
