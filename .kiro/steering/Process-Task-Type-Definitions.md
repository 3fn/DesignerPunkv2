---
inclusion: manual
name: Process-Task-Type-Definitions
description: Task type definitions for the three-tier validation and documentation system — Setup, Implementation, Architecture, and Documentation task types with validation tier requirements and completion documentation expectations. Load when classifying tasks, determining validation tiers, or understanding task completion requirements.
---

# Task Type Definitions

**Date**: 2025-10-20
**Last Reviewed**: 2025-12-15
**Purpose**: Define task types for three-tier validation and documentation system
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 2
**Relevant Tasks**: spec-creation

## AI Agent Reading Priorities

**Note**: This section intentionally uses the same heading as other steering documents because each document provides reading priorities specific to its content. This structural pattern enables progressive disclosure and helps AI agents navigate to relevant sections efficiently.

**This document is loaded conditionally when creating or updating specs. Read strategically based on your current phase.**

### WHEN Creating Tasks Document (Planning Phase) THEN Read:
1. ✅ **Overview** (MUST READ - understand task type purpose)
2. ✅ **All Task Type Definitions** (Setup, Implementation, Architecture)
3. ✅ **Characteristics and Examples** for each type
4. ✅ **Validation and Documentation Tiers** for each type
5. ❌ **SKIP**: Update History (unless encountering new patterns)

### WHEN Classifying Ambiguous Tasks THEN Read:
1. ✅ **Task Type Definitions** (review characteristics)
2. ✅ **Examples** for similar tasks
3. ✅ **Update History** (check for similar patterns previously classified)
4. ✅ **Guidance for AI Agents** section

### WHEN Executing Tasks (Implementation Phase) THEN Read:
1. ✅ **Your Task's Type Definition** (understand what's expected)
2. ✅ **Validation Tier** for your task type
3. ✅ **Documentation Tier** for your task type
4. ❌ **SKIP**: Other task type definitions, Update History

### WHEN Encountering New Task Patterns THEN Read:
1. ✅ **All Task Type Definitions** (find closest match)
2. ✅ **Update History** (check for similar patterns)
3. ✅ **Guidelines for Updates** section
4. ✅ Prompt human for classification decision

**SKIP when:**
- Executing tasks with clear type classification
- Working on non-spec tasks
- Task type is obvious from characteristics

---

## Overview

**Note**: This section intentionally uses the same heading as other steering documents because each document provides an overview of its specific system or process. This structural pattern enables consistent navigation across documentation.

This document defines the three task types used in the Spec Planning Standards to determine appropriate validation depth and completion documentation detail. Task types are determined during the planning phase and guide execution practices.

**Layer Context**: This is a Layer 2 (Frameworks and Patterns) document that provides reusable classification framework for spec planning. It works with Spec Planning Standards to enable consistent task type assignment across all specs.

---

## Setup Tasks

### Definition

Setup tasks are **structural work that prepares the environment for implementation**. These tasks create the scaffolding, configuration, and organizational structure needed before coding begins. They involve minimal logic or decision-making and focus on establishing the foundation for subsequent work.

### Characteristics

- **Structural work**: Creates directories, files, or configuration without complex logic
- **Low complexity**: Straightforward operations with clear success criteria
- **Minimal logic**: Little to no algorithmic thinking or decision-making required
- **Low risk**: Errors are easily detected and fixed
- **Preparatory nature**: Enables subsequent implementation work
- **Clear artifacts**: Success is measured by presence of expected files/directories

### Examples

1. **Create directory structure**
   - Create `src/build/` directory
   - Create `src/build/platforms/` subdirectory
   - Create `src/build/interfaces/` subdirectory

2. **Install project dependencies**
   - Run `npm install` to install packages from package.json
   - Verify node_modules directory created
   - Confirm no installation errors

3. **Configure build scripts**
   - Add build script to package.json
   - Add test script to package.json
   - Add lint script to package.json

4. **Set up test framework**
   - Install Jest testing dependencies
   - Create jest.config.js with basic configuration
   - Create `__tests__` directory structure

5. **Create placeholder files**
   - Create index.ts with basic exports
   - Create README.md with project title
   - Create .gitignore with standard Node patterns

6. **Initialize configuration files**
   - Create tsconfig.json with compiler options
   - Create .eslintrc.json with linting rules
   - Create .prettierrc with formatting preferences

7. **Set up Git repository structure**
   - Initialize Git repository with `git init`
   - Create initial commit with project structure
   - Configure remote repository connection

### Validation Tier

**Tier 1: Minimal**

Setup tasks use minimal validation because they are low-risk and have clear success criteria:

- Run getDiagnostics to check for syntax and type errors
- Verify all specified artifacts (files, directories) were created
- Verify basic structure is correct and accessible

### Documentation Tier

**Tier 1: Minimal**

Setup tasks use minimal documentation because they are straightforward:

- **Artifacts Created**: List of files/directories created
- **Implementation Notes**: Brief description of what was done
- **Validation**: Document Tier 1 validation results

---

## Implementation Tasks

### Definition

Implementation tasks are **coding work that implements features or functionality**. These tasks write the actual code that delivers business value, integrates with existing systems, and implements the design decisions made in architecture tasks. They require functional validation to ensure the code works as intended and integrates properly with the rest of the system.

### Characteristics

- **Coding work**: Writes code to implement specific functionality or features
- **Medium complexity**: Requires understanding of requirements and integration points
- **Functional validation needed**: Must verify code executes correctly and meets requirements
- **Integration focus**: Connects with existing code, APIs, or components
- **Medium risk**: Errors can affect functionality but are typically contained to specific features
- **Testable outcomes**: Success measured by functional correctness and requirements compliance

### Examples

1. **Implement class methods**
   - Write TokenSelector class with selectToken() method
   - Implement priority logic for semantic vs primitive token selection
   - Add error handling for invalid token references

2. **Create API endpoints**
   - Implement POST /api/tokens endpoint for token creation
   - Add request validation and error responses
   - Integrate with token registry for persistence

3. **Build UI components**
   - Create Button component with variant props
   - Implement click handlers and accessibility attributes
   - Style component using design system tokens

4. **Write integration logic**
   - Implement BuildOrchestrator.orchestrate() method
   - Coordinate between token selection, platform generation, and file writing
   - Add error handling and rollback logic

5. **Implement data transformations**
   - Create token-to-CSS conversion function
   - Transform unitless values to platform-specific units
   - Handle edge cases for color formats and spacing values

6. **Create validation functions**
   - Implement baseline grid alignment validator
   - Check spacing values against 4px grid
   - Return validation results with specific error messages

7. **Build file generation logic**
   - Implement CSS file generator for web platform
   - Generate token declarations with proper formatting
   - Write files to correct output directories

### Validation Tier

**Tier 2: Standard**

Implementation tasks use standard validation because they involve functional code that must work correctly:

- Run getDiagnostics to check for syntax and type errors
- Verify functional correctness (code executes as intended)
- Verify integration with existing code (imports resolve, interfaces match)
- Verify requirements compliance (all requirements for this task addressed)

### Documentation Tier

**Tier 2: Standard**

Implementation tasks use standard documentation to capture implementation approach and decisions:

- **Artifacts Created**: List of files/directories created
- **Implementation Details**: Description of implementation approach and key decisions
- **Validation**: Document Tier 2 validation results (syntax, functional, integration, requirements)
- **Requirements Compliance**: Which requirements were addressed

---

## Architecture Tasks

### Definition

Architecture tasks are **design work that establishes patterns, algorithms, or system structure**. These tasks make fundamental design decisions that affect how the system is organized, how components interact, and what patterns other code will follow. They require comprehensive design validation to ensure the architecture supports extensibility, maintainability, and system-wide consistency.

### Characteristics

- **Design work**: Makes architectural decisions that shape system structure and patterns
- **High complexity**: Requires deep understanding of system requirements, trade-offs, and long-term implications
- **Design validation needed**: Must verify architecture supports extensibility, separation of concerns, and system integration
- **Pattern establishment**: Creates patterns and abstractions that other code will follow
- **High risk**: Poor architectural decisions can affect entire system and be costly to change
- **Strategic impact**: Decisions influence development approach and system evolution

### Examples

1. **Design orchestration architecture**
   - Design BuildOrchestrator architecture with clear separation of concerns
   - Establish coordination pattern between token selection, platform generation, and file writing
   - Define error handling and rollback strategy for multi-step build process
   - Document architectural decisions and trade-offs

2. **Create validation algorithm**
   - Design three-tier validation system (Pass/Warning/Error)
   - Establish validation priority and composition patterns
   - Create algorithm for baseline grid alignment with tolerance calculations
   - Define extensibility points for custom validators

3. **Establish error handling strategy**
   - Design error classification system (recoverable vs fatal)
   - Create error propagation and recovery patterns
   - Establish error context preservation approach
   - Define user-facing error message strategy

4. **Design plugin system**
   - Create plugin architecture with clear extension points
   - Establish plugin lifecycle management (load, initialize, execute, cleanup)
   - Define plugin communication and dependency patterns
   - Design plugin isolation and security boundaries

5. **Create mathematical token system**
   - Design primitive→semantic token hierarchy
   - Establish mathematical relationship patterns (modular scale, baseline grid)
   - Create strategic flexibility framework with usage tracking
   - Define cross-platform unitless architecture

6. **Design caching strategy**
   - Create multi-level caching architecture (memory, disk, distributed)
   - Establish cache invalidation patterns and strategies
   - Define cache key generation and collision handling
   - Design cache performance monitoring approach

7. **Establish state management architecture**
   - Design state flow patterns (unidirectional data flow, event sourcing)
   - Create state synchronization strategy across components
   - Establish state persistence and hydration approach
   - Define state debugging and time-travel capabilities

### Validation Tier

**Tier 3: Comprehensive**

Architecture tasks use comprehensive validation because they establish patterns that affect the entire system:

- Run getDiagnostics to check for syntax and type errors
- Verify functional correctness (code executes as intended)
- Verify design soundness (architecture supports extensibility, separation of concerns maintained)
- Verify integration with system (fits with overall architecture, interfaces clear)
- Verify edge cases and error handling (handles invalid inputs, provides actionable errors)
- Verify requirements compliance (all requirements for this task addressed)

### Documentation Tier

**Tier 3: Comprehensive**

Architecture tasks use comprehensive documentation to capture design decisions and rationale:

- **Artifacts Created**: List of files/directories created
- **Architecture Decisions**: Design decisions with options considered, rationale, and trade-offs
- **Implementation Details**: Description of implementation approach
- **Algorithm**: Code examples, pseudocode (if applicable)
- **Validation**: Document Tier 3 validation results (syntax, functional, design, integration, edge cases, requirements)
- **Requirements Compliance**: Which requirements were addressed
- **Lessons Learned**: Insights from implementation
- **Integration Points**: How this integrates with other components

---

## Update History

This section tracks updates to task type definitions as new patterns emerge through human-AI collaborative decision-making.

### Update Format

Each update should follow this format:

```markdown
### [Date] - [Pattern Name]

**Pattern**: [Brief description of the new task pattern or edge case]
**Classification Decision**: [Setup / Implementation / Architecture]
**Rationale**: [Why this classification was chosen]
**Decided By**: [Human name] + [AI Agent]
**Examples**: [Specific examples of this pattern]
```

### Guidelines for Updates

- **When to Update**: Add an entry when a new task pattern emerges that doesn't clearly fit existing definitions
- **Collaborative Decision**: All classification decisions should involve both human and AI agent discussion
- **Document Rationale**: Explain why the chosen classification is appropriate based on task characteristics
- **Provide Examples**: Include specific examples to help future classification of similar patterns
- **Maintain Consistency**: Ensure new patterns align with existing task type characteristics

### Example Entry

```markdown
### October 20, 2025 - Configuration Validation Logic

**Pattern**: Tasks that implement validation logic for configuration files
**Classification Decision**: Implementation
**Rationale**: While validation involves decision-making logic, these tasks implement specific validation rules rather than establishing system-wide validation architecture. They integrate with existing validation frameworks and have clear functional requirements.
**Decided By**: Peter Michaels Allen + Kiro
**Examples**: 
- Validate tsconfig.json compiler options against project standards
- Implement package.json dependency version validation
- Create environment variable validation with type checking
```

---

*Updates to this section help refine task type definitions over time while maintaining consistency in classification decisions.*

---

*This document provides clear task type definitions with examples to enable consistent classification during spec planning and execution.*
