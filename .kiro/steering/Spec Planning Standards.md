# Spec Planning Standards

**Date**: January 10, 2025  
**Updated**: October 20, 2025  
**Purpose**: Standards for creating requirements, design, and task documents for feature specifications  
**Organization**: process-standard  
**Scope**: cross-project  
**Trigger**: Conditional - loaded when AI Agent creates or updates specs

---
inclusion: conditional
trigger: spec-work
---

## AI Agent Reading Priorities

**This document is comprehensive but NOT all sections are needed for every task. Read strategically based on what you're doing RIGHT NOW.**

### WHEN Creating Requirements Document THEN Read:
1. ✅ **Requirements Document Format** (MUST READ)
2. ✅ **Spec Workflow: Phase 1** (scroll to Spec Workflow section)
3. ❌ **SKIP**: Design format, Tasks format, Validation system, Documentation system, Rationale

### WHEN Creating Design Document THEN Read:
1. ✅ **Design Document Format** (MUST READ)
2. ✅ **Spec Workflow: Phase 2** (scroll to Spec Workflow section)
3. ❌ **SKIP**: Requirements format, Tasks format, Validation system, Documentation system, Rationale

### WHEN Creating Tasks Document THEN Read:
1. ✅ **Tasks Document Format** (MUST READ)
2. ✅ **Task Type Classification System** (MUST READ - understand Setup/Implementation/Architecture)
3. ✅ **Reference: Task Type Definitions** (`.kiro/steering/Task-Type-Definitions.md` - if unclear on classification)
4. ✅ **Spec Workflow: Phase 3** (scroll to Spec Workflow section)
5. ❌ **SKIP**: Detailed validation tiers, detailed documentation tiers, rationale sections

### WHEN Executing Tasks (Implementation Phase) THEN Read:
1. ✅ **Spec Workflow: Phase 4** (MUST READ)
2. ✅ **Three-Tier Validation System** - READ ONLY YOUR TASK'S TIER:
   - Setup task? Read Tier 1: Minimal Validation only
   - Implementation task? Read Tier 2: Standard Validation only
   - Architecture/Parent task? Read Tier 3: Comprehensive Validation only
3. ✅ **Three-Tier Completion Documentation** - READ ONLY YOUR TASK'S TIER:
   - Setup task? Read Tier 1: Minimal Documentation only
   - Implementation task? Read Tier 2: Standard Documentation only
   - Architecture/Parent task? Read Tier 3: Comprehensive Documentation only
4. ❌ **SKIP**: Requirements format, Design format, Task creation sections, other validation tiers, rationale

### WHEN Stuck or Questioning Approach THEN Read:
1. 📖 **Rationale for Three-Tier Approach** (OPTIONAL - understand the "why")
2. 📖 **Anti-Patterns to Avoid** (OPTIONAL - learn from mistakes)
3. 📖 **Quality Standards** (OPTIONAL - understand quality expectations)

### WHEN Validating Quality or Reviewing Work THEN Read:
1. ✅ **Quality Standards** (MUST READ)
2. ✅ **Anti-Patterns to Avoid** (MUST READ)
3. ✅ **Your specific validation tier requirements**

---

## Overview

This document defines the format and structure for creating feature specifications in the DesignerPunk project. Specs follow a three-phase workflow: Requirements → Design → Tasks, with each phase building on the previous to create comprehensive, actionable implementation plans.

**When to use this document**: When creating new specs or updating existing spec documents (requirements.md, design.md, tasks.md).

**How to use this document**: See "AI Agent Reading Priorities" above - read only the sections relevant to your current task.

---

## Requirements Document Format

### Structure

```markdown
# Requirements Document: [Feature Name]

**Date**: [Creation Date]
**Spec**: [Spec ID] - [Feature Name]
**Status**: Requirements Phase
**Dependencies**: [List of dependent specs]

---

## Introduction

[Brief overview of the feature and its purpose]

[Key architectural principles or context]

---

## Requirements

### Requirement [N]: [Requirement Title]

**User Story**: As a [role], I want [feature], so that [benefit]

#### Acceptance Criteria

1. WHEN [event/condition] THEN [system] SHALL [response]
2. IF [precondition] THEN [system] SHALL [response]
3. WHEN [event] AND [condition] THEN [system] SHALL [response]
```

### Key Principles

**EARS Format** (Easy Approach to Requirements Syntax):
- Use WHEN/IF/THEN structure for clarity
- Focus on system behavior, not implementation
- Make requirements testable and verifiable
- Include edge cases and error conditions

**User Stories**:
- Start with "As a [role]" to identify stakeholder
- Describe desired capability with "I want [feature]"
- Explain benefit with "so that [benefit]"

**Acceptance Criteria**:
- Numbered list of specific, testable conditions
- Use SHALL for mandatory requirements
- Focus on observable behavior
- Include success and failure scenarios

---

## Design Document Format

### Structure

```markdown
# Design Document: [Feature Name]

**Date**: [Creation Date]
**Spec**: [Spec ID] - [Feature Name]
**Status**: Design Phase
**Dependencies**: [List of dependent specs]

---

## Overview

[High-level design summary and approach]

---

## Architecture

[System architecture with diagrams if helpful]

---

## Components and Interfaces

[Detailed component descriptions with TypeScript interfaces]

---

## Data Models

[Data structures and type definitions]

---

## Error Handling

[Error handling strategy and recovery approaches]

---

## Testing Strategy

[Unit, integration, and validation testing approaches]

---

## Design Decisions

### Decision [N]: [Decision Title]

**Options Considered**: [List alternatives]
**Decision**: [Chosen approach]
**Rationale**: [Why this approach]
**Trade-offs**: [What we're giving up]
```

### Key Principles

**Architecture First**:
- Start with high-level architecture
- Show component relationships
- Use diagrams when helpful (Mermaid)

**Interface-Driven**:
- Define clear interfaces for all components
- Use TypeScript for type safety
- Document responsibilities clearly

**Design Decisions**:
- Document alternatives considered
- Explain rationale for chosen approach
- Acknowledge trade-offs honestly
- Apply systematic skepticism (counter-arguments)

---

## Tasks Document Format

### Structure

```markdown
# Implementation Plan: [Feature Name]

**Date**: [Creation Date]
**Spec**: [Spec ID] - [Feature Name]
**Status**: Implementation Planning
**Dependencies**: [List of dependent specs]

---

## Implementation Plan

[Brief overview of implementation approach]

---

## Task List

- [ ] [N]. [Primary Task Title]

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - [Overall goal 1]
  - [Overall goal 2]
  - [Overall goal 3]
  
  **Primary Artifacts:**
  - [Key file 1]
  - [Key file 2]
  - [Key file 3]
  
  **Completion Documentation:**
  - [Path to completion doc]

  - [ ] [N.1] [Sub-task Title]
    **Type**: [Setup | Implementation | Architecture]
    **Validation**: [Tier 1: Minimal | Tier 2: Standard | Tier 3: Comprehensive]
    - [Implementation step 1]
    - [Implementation step 2]
    - _Requirements: [Requirement IDs]_

  - [ ] [N.2] [Sub-task Title]
    **Type**: [Setup | Implementation | Architecture]
    **Validation**: [Tier 1: Minimal | Tier 2: Standard | Tier 3: Comprehensive]
    - [Implementation step 1]
    - [Implementation step 2]
    - _Requirements: [Requirement IDs]_
```

### Key Principles

**Hierarchical Structure**:
- **Primary tasks** (N) define WHAT success looks like
- **Sub-tasks** (N.1, N.2) define HOW to achieve it
- Maximum two levels of hierarchy

**Success Criteria at Primary Level**:
- State overall goals for the primary task
- Encompass all sub-tasks
- Provide clear validation point
- Avoid repetition in sub-tasks

**Primary Artifacts**:
- List key files created by primary task
- Focus on main deliverables
- Helps track what's being built

**Completion Documentation**:
- Two documents per primary task:
  - Detailed: `.kiro/specs/[spec-name]/completion/task-[N]-parent-completion.md` (comprehensive internal documentation)
  - Summary: `docs/specs/[spec-name]/task-[N]-summary.md` (concise public-facing summary that triggers release detection)
- Detailed docs preserve comprehensive knowledge; summary docs trigger hooks and serve as release notes

**Sub-tasks**:
- Focus on implementation steps
- Reference requirements
- Keep concise and actionable
- No success criteria (covered by primary)

**Post-Complete Commits**:
- **NOT included in tasks** - handled automatically by task completion hook
- Hook extracts commit message from task name
- Follows Development Workflow automation

**Task Type Metadata**:
- All subtasks must include **Type** metadata field
- All subtasks must include **Validation** metadata field
- Parent tasks use Type: Parent with Tier 3: Comprehensive validation
- Type determines which validation tier and documentation tier to apply

### Task Format Examples

#### Example 1: Parent Task with Mixed Subtask Types

```markdown
- [ ] 1. Build System Foundation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Build system foundation established with clear architecture
  - Platform-specific generation working for web, iOS, and Android
  - Error handling comprehensive across all components
  - Release detection triggered
  
  **Primary Artifacts:**
  - `src/build/` directory structure
  - `src/build/TokenSelector.ts`
  - `src/build/BuildOrchestrator.ts`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/cross-platform-build-system/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/cross-platform-build-system/task-1-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Run `./.kiro/hooks/release-manager.sh auto` to trigger release detection

  - [ ] 1.1 Create directory structure
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create `src/build/` directory
    - Create `src/build/platforms/` subdirectory
    - Create `src/build/interfaces/` subdirectory
    - _Requirements: 1.1_

  - [ ] 1.2 Implement TokenSelector class
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement TokenSelector with selectToken() method
    - Add priority logic (semantic > primitive)
    - Implement error handling for invalid references
    - _Requirements: 9.1, 9.2, 9.3_

  - [ ] 1.3 Design BuildOrchestrator architecture
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    - Design orchestration pattern for build coordination
    - Establish error handling and rollback strategy
    - Define platform generator interfaces
    - _Requirements: 1.1, 6.3, 8.2_
```

#### Example 2: Setup Task (Tier 1 - Minimal)

```markdown
- [ ] 2.1 Initialize project configuration

  **Type**: Setup
  **Validation**: Tier 1 - Minimal
  
  - Create `tsconfig.json` with compiler options
  - Create `.eslintrc.json` with linting rules
  - Create `jest.config.js` with test configuration
  - Install development dependencies
  - _Requirements: 1.2, 1.3_
```

#### Example 3: Implementation Task (Tier 2 - Standard)

```markdown
- [ ] 3.2 Implement validation functions

  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  
  - Create BaselineGridValidator class
  - Implement alignment validation logic
  - Add tolerance calculation for edge cases
  - Implement error message generation
  - Write integration tests for validator
  - _Requirements: 4.1, 4.2, 4.3_
```

#### Example 4: Architecture Task (Tier 3 - Comprehensive)

```markdown
- [ ] 4.3 Design three-tier validation system

  **Type**: Architecture
  **Validation**: Tier 3 - Comprehensive
  
  - Design Pass/Warning/Error classification system
  - Establish validation priority and composition patterns
  - Create extensibility points for custom validators
  - Define validation result data structures
  - Document architectural decisions and trade-offs
  - _Requirements: 2.1, 2.2, 2.3, 2.4_
```

#### Example 5: Complete Feature with All Task Types

```markdown
- [ ] 5. Token Generation System

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Token generation working for all platforms
  - Mathematical relationships validated
  - Cross-platform consistency verified
  - Release detection triggered
  
  **Primary Artifacts:**
  - `src/generators/TokenFileGenerator.ts`
  - `src/generators/PlatformGenerators/`
  - Platform-specific output files
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/token-generation/completion/task-5-parent-completion.md`
  - Summary: `docs/specs/token-generation/task-5-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Run `./.kiro/hooks/release-manager.sh auto` to trigger release detection

  - [ ] 5.1 Set up generator directory structure
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create `src/generators/` directory
    - Create `src/generators/PlatformGenerators/` subdirectory
    - Create placeholder files for each platform
    - _Requirements: 1.1_

  - [ ] 5.2 Implement CSS generator for web
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create WebCSSGenerator class
    - Implement token-to-CSS conversion logic
    - Add formatting and file writing
    - Test with sample tokens
    - _Requirements: 3.1, 3.2_

  - [ ] 5.3 Implement Swift generator for iOS
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create iOSSwiftGenerator class
    - Implement token-to-Swift conversion logic
    - Add UIColor and CGFloat generation
    - Test with sample tokens
    - _Requirements: 3.3, 3.4_

  - [ ] 5.4 Design generator plugin architecture
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    - Design plugin interface for custom generators
    - Establish generator lifecycle (load, initialize, generate)
    - Create generator registry and discovery system
    - Define extension points and hooks
    - _Requirements: 8.1, 8.2, 8.3_
```

---

## Task Type Classification System

### Overview

The Task Type Classification System provides a three-tier approach to categorizing tasks based on their complexity, risk, and nature of work. Task types are determined during the planning phase (when creating tasks.md) and guide the appropriate level of validation and completion documentation during execution.

This classification system enables:
- **Objective task categorization** based on clear characteristics
- **Appropriate validation depth** matched to task complexity and risk
- **Proportional documentation detail** aligned with task type
- **Consistent AI agent execution** through unambiguous task metadata

### Three Task Types

#### Setup Tasks

**Definition**: Structural work that prepares the environment for implementation

**Characteristics**:
- Creates directories, files, or configuration without complex logic
- Low complexity with straightforward operations
- Minimal logic or decision-making required
- Low risk with easily detected and fixed errors
- Clear success criteria based on artifact presence

**Examples**:
- Create directory structure for new feature
- Install project dependencies via package manager
- Configure build scripts in package.json
- Set up test framework with basic configuration
- Create placeholder files with basic exports
- Initialize configuration files (tsconfig.json, .eslintrc)

**Validation & Documentation**: Tier 1 - Minimal

#### Implementation Tasks

**Definition**: Coding work that implements features or functionality

**Characteristics**:
- Writes code to implement specific functionality or features
- Medium complexity requiring understanding of requirements and integration
- Functional validation needed to ensure correctness
- Integration focus connecting with existing code and components
- Medium risk with errors typically contained to specific features
- Testable outcomes measured by functional correctness

**Examples**:
- Implement class methods with business logic
- Create API endpoints with request validation
- Build UI components with event handlers
- Write integration logic coordinating multiple components
- Implement data transformations and conversions
- Create validation functions with error handling
- Build file generation logic for specific platforms

**Validation & Documentation**: Tier 2 - Standard

#### Architecture Tasks

**Definition**: Design work that establishes patterns, algorithms, or system structure

**Characteristics**:
- Makes architectural decisions affecting system structure and patterns
- High complexity requiring deep understanding of system requirements
- Design validation needed for extensibility and maintainability
- Pattern establishment creating abstractions other code will follow
- High risk with decisions affecting entire system
- Strategic impact influencing development approach and evolution

**Examples**:
- Design orchestration architecture with separation of concerns
- Create validation algorithms with extensibility points
- Establish error handling strategy and recovery patterns
- Design plugin system with clear extension points
- Create mathematical token system with hierarchical relationships
- Design caching strategy with multi-level architecture
- Establish state management architecture and patterns

**Validation & Documentation**: Tier 3 - Comprehensive

#### Parent Tasks

**Definition**: Container tasks that encompass multiple subtasks and define overall success criteria

**Characteristics**:
- Defines WHAT success looks like for a group of related subtasks
- Includes explicit success criteria that span all subtasks
- Requires verification that all subtasks integrate correctly
- Validates end-to-end functionality across subtask boundaries
- Documents overall approach and integration story

**Validation & Documentation**: Tier 3 - Comprehensive (with success criteria verification)

### Classification During Planning Phase

#### When to Classify

Task types are determined during **Phase 3: Tasks** of the spec workflow, when converting the design document into actionable implementation tasks.

#### Classification Process

1. **Review task description and implementation steps**
2. **Identify task characteristics** (structural vs coding vs design work)
3. **Assess complexity and risk** (low vs medium vs high)
4. **Determine validation needs** (minimal vs standard vs comprehensive)
5. **Assign task type** (Setup, Implementation, or Architecture)
6. **Add type metadata** to task in tasks.md

#### Classification Decision Examples

**Example 1: Configuration File Creation**

```markdown
Task: "Create tsconfig.json with compiler options"

Analysis:
- Structural work: Creating configuration file
- Low complexity: Standard TypeScript configuration
- Minimal logic: Copying/adapting standard config
- Low risk: Easy to verify and fix

Classification: Setup
Rationale: Preparatory structural work with clear success criteria
```

**Example 2: Token Selector Implementation**

```markdown
Task: "Implement TokenSelector class with priority logic"

Analysis:
- Coding work: Writing class methods and logic
- Medium complexity: Requires understanding token hierarchy
- Functional validation: Must verify selection logic works correctly
- Medium risk: Errors affect token selection but contained to this feature

Classification: Implementation
Rationale: Feature implementation requiring functional validation
```

**Example 3: Orchestration Architecture Design**

```markdown
Task: "Design BuildOrchestrator architecture with error handling strategy"

Analysis:
- Design work: Establishing architectural patterns
- High complexity: Affects how entire build system operates
- Design validation: Must verify extensibility and separation of concerns
- High risk: Poor decisions affect entire system

Classification: Architecture
Rationale: Architectural decisions establishing patterns for other code
```

**Example 4: Ambiguous Classification**

```markdown
Task: "Implement configuration validation logic"

Analysis:
- Could be Implementation: Writing validation code
- Could be Architecture: Designing validation strategy

Resolution: Ask human for clarification
- If implementing specific validation rules: Implementation
- If establishing validation patterns for system: Architecture

Document decision in tasks.md for future reference
```

### Guidance for AI Agents

#### Clear Classification

When task type is obvious from characteristics:
1. Assign appropriate type (Setup, Implementation, Architecture)
2. Add type metadata to task
3. Proceed with task creation

#### Unclear Classification

When task type is ambiguous:
1. Identify the ambiguity (e.g., "Could be Implementation or Architecture")
2. Prompt human: "This task could be classified as [Type A] or [Type B]. Which is more appropriate?"
3. Document human's decision and rationale
4. Consider updating Task Type Definitions if new pattern emerges

#### New Patterns

When encountering a task pattern not covered by existing definitions:
1. Classify based on closest match to existing characteristics
2. Prompt human for confirmation
3. Document the new pattern in Task Type Definitions document
4. Include date, pattern description, classification decision, and rationale

### Reference Documentation

For detailed task type definitions with comprehensive examples, see:

**Task Type Definitions**: `.kiro/steering/Task-Type-Definitions.md`

This living document provides:
- Detailed definitions for each task type
- Comprehensive examples (5+ per type)
- Validation and documentation tier specifications
- Update history tracking new patterns and classification decisions
- Guidelines for collaborative human-AI classification decisions

### Integration with Tasks Document Format

Task type metadata is included in the tasks.md format:

```markdown
- [ ] [N.1] [Sub-task Title]
  **Type**: [Setup | Implementation | Architecture]
  **Validation**: [Tier 1: Minimal | Tier 2: Standard | Tier 3: Comprehensive]
  - [Implementation step 1]
  - [Implementation step 2]
  - _Requirements: [Requirement IDs]_
```

This explicit metadata ensures AI agents know exactly which validation and documentation tier to apply during task execution.

---

## Rationale for Three-Tier Approach

### Overview

The three-tier system for task classification, validation, and completion documentation was developed in response to quality concerns identified through comparative analysis of two major spec executions: F1 (Mathematical Token System) and F2 (Cross-Platform Build System).

This section explains the audit findings, why the three-tier approach was chosen, and the expected impact on both quality and token efficiency.

### Background: F1 vs F2 Execution Patterns

#### F1 Approach (Original Pattern)

**Characteristics**:
- Completion documentation for 95% of subtasks (37/39)
- Validation after every subtask (~39 validation cycles)
- Average ~800 lines per completion document
- Immediate error detection after each subtask
- Comprehensive architectural documentation with code examples

**Strengths**:
- Frequent quality checkpoints
- Immediate error detection
- Comprehensive knowledge preservation
- Clear progress markers

**Weaknesses**:
- High token usage (~39,000 tokens for completion docs + validation)
- Potential over-documentation of simple tasks
- Repetitive validation for low-risk work

#### F2 Approach (Token-Optimized Pattern)

**Characteristics**:
- Completion documentation for 68% of subtasks (28/41)
- Validation only at parent task level (~10 validation cycles)
- Average ~400 lines per completion document
- Delayed error detection until parent task complete
- More concise, implementation-focused documentation

**Strengths**:
- 65% token reduction (~13,200 tokens vs ~39,000)
- Faster execution
- Less documentation overhead

**Weaknesses**:
- Delayed error detection (errors can compound)
- Fewer incremental checkpoints (harder to pinpoint issues)
- Less detailed architectural documentation
- Ambiguity about when subtask completion docs are appropriate

### Audit Findings Summary

**Quantitative Findings**:

| Metric | F1 (Original) | F2 (Optimized) | Change |
|--------|---------------|----------------|--------|
| Completion Doc Coverage | 95% | 68% | -27% |
| Validation Cycles | 39 | 10 | -75% |
| Avg Doc Length | ~800 lines | ~400 lines | -50% |
| Token Usage | ~39,000 | ~13,200 | -65% |

**Quality Impact**:
- **Delayed Error Detection**: Errors accumulate until parent task validation, making debugging more complex
- **Reduced Checkpoints**: Fewer "save points" make it harder to identify when issues were introduced
- **Less Knowledge Preservation**: Shorter docs with less architectural discussion and fewer lessons learned
- **Inconsistent Application**: Ambiguity about when subtask completion docs are appropriate

**User Experience**:
- F2 execution felt "less refined" despite successful token reduction
- Quality concerns outweighed token savings benefits
- Need for balance between quality and efficiency

### Why Three Tiers?

#### Alignment Principle

The three-tier system aligns three critical dimensions:

1. **Task Complexity** (Setup → Implementation → Architecture)
2. **Validation Depth** (Minimal → Standard → Comprehensive)
3. **Documentation Detail** (Brief → Standard → Extensive)

This alignment ensures that validation effort and documentation detail match the actual complexity and risk of the work being performed.

#### Objective Classification

Three task types provide clear, objective classification criteria:

- **Setup**: Structural work (directories, configuration, dependencies)
- **Implementation**: Coding work (features, functionality, integration)
- **Architecture**: Design work (patterns, algorithms, system structure)

This removes ambiguity about when to apply which tier, enabling consistent AI agent execution.

#### Balanced Approach

Three tiers provide the optimal balance:

**Too Few Tiers (F2's Two-Tier Approach)**:
- Simple vs Complex is subjective
- No middle ground for standard implementation work
- Forces binary decisions that don't match reality

**Too Many Tiers (Four or More)**:
- Increased cognitive load during classification
- Diminishing returns on granularity
- More complex to implement and maintain

**Three Tiers (Goldilocks Zone)**:
- Clear distinction between structural, coding, and design work
- Objective classification criteria
- Sufficient granularity without excessive complexity

### Token Impact Analysis

#### Estimated Token Usage by Tier

**Tier 1: Minimal (Setup Tasks)**:
- ~50 tokens for validation
- ~150 lines for completion documentation
- **Total per task**: ~200 tokens

**Tier 2: Standard (Implementation Tasks)**:
- ~200 tokens for validation
- ~300 lines for completion documentation
- **Total per task**: ~500 tokens

**Tier 3: Comprehensive (Architecture + Parent Tasks)**:
- ~400-600 tokens for validation
- ~600-800 lines for completion documentation
- **Total per task**: ~1,000-1,400 tokens

#### Projected Token Usage for Typical Spec

**Typical Spec Structure**:
- 10 parent tasks (Tier 3)
- 15 implementation subtasks (Tier 2)
- 10 setup subtasks (Tier 1)
- 5 architecture subtasks (Tier 3)

**Token Calculation**:
- Parent tasks: 10 × 1,200 = 12,000 tokens
- Implementation: 15 × 500 = 7,500 tokens
- Setup: 10 × 200 = 2,000 tokens
- Architecture: 5 × 1,200 = 6,000 tokens
- **Total**: ~27,500 tokens

**Comparison**:
- F1 Approach: ~39,000 tokens (validate + document everything)
- Three-Tier: ~27,500 tokens (validate + document by complexity)
- F2 Approach: ~13,200 tokens (validate + document minimally)

**Result**: Three-tier approach provides **30% token savings vs F1** while maintaining **quality checkpoints** that F2 lacked.

### Quality Improvements Over F2

#### Incremental Validation

**F2 Problem**: Validation only at parent task level allowed errors to compound

**Three-Tier Solution**: 
- Setup tasks: Minimal validation (syntax + artifacts)
- Implementation tasks: Standard validation (syntax + functional + integration)
- Architecture tasks: Comprehensive validation (syntax + functional + design + integration + edge cases)

**Benefit**: Errors caught at appropriate granularity based on task complexity

#### Completion Documentation for All Subtasks

**F2 Problem**: Only 68% of subtasks had completion docs, creating gaps in knowledge preservation

**Three-Tier Solution**: All subtasks receive completion documentation with detail appropriate to complexity

**Benefit**: 100% completion doc coverage with proportional detail

#### Objective Classification Criteria

**F2 Problem**: Ambiguity about when subtask completion docs were appropriate

**Three-Tier Solution**: Task type determined during planning phase with explicit metadata

**Benefit**: No ambiguity during execution - AI agents know exactly which tier to apply

### Decision-Making Process

#### Systematic Skepticism Applied

**Counter-Argument 1**: "F2's approach is simpler - why add complexity?"

**Response**: The simplicity of F2 came at the cost of quality. The three-tier system adds minimal complexity (just task type classification) while restoring quality checkpoints.

**Counter-Argument 2**: "Why not just revert to F1's approach?"

**Response**: F1's approach over-validated simple tasks. A setup task creating directories doesn't need comprehensive validation. The three-tier system provides appropriate validation for each complexity level.

**Counter-Argument 3**: "Three tiers is arbitrary - why not two or four?"

**Response**: Three tiers map to natural work categories (structural, coding, design) and provide sufficient granularity without excessive complexity. Two tiers force binary decisions; four tiers add cognitive load without proportional benefit.

#### Evidence-Based Validation

The three-tier approach was validated through:

1. **Quantitative Analysis**: Measured completion doc coverage, validation frequency, and token usage across F1 and F2
2. **Quality Assessment**: Identified specific quality issues (delayed error detection, reduced checkpoints, less knowledge preservation)
3. **Token Modeling**: Calculated expected token usage for three-tier approach
4. **Comparative Evaluation**: Compared three-tier approach against F1, F2, and alternative approaches

### Expected Outcomes

#### Quality Metrics

- **Completion Doc Coverage**: 100% (vs 68% in F2, 95% in F1)
- **Error Detection Timing**: Appropriate to task complexity (vs delayed in F2, immediate in F1)
- **Documentation Depth**: Proportional to complexity (vs uniform in F1/F2)
- **Classification Consistency**: >90% of tasks classified without human clarification

#### Efficiency Metrics

- **Token Usage**: ~27,500 per spec (vs ~39,000 in F1, ~13,200 in F2)
- **Token Savings vs F1**: ~30% reduction
- **Quality Improvement vs F2**: Restored incremental validation and comprehensive documentation

#### Developer Experience

- **Execution Feel**: More refined than F2 through incremental validation
- **Knowledge Preservation**: Better than F2 through comprehensive documentation for complex tasks
- **Efficiency**: Better than F1 through appropriate validation for simple tasks

### Reference Documentation

For complete audit findings and detailed analysis, see:

**Audit Summary**: `.kiro/specs/spec-standards-refinement/completion/audit-summary.md`

This document provides:
- Complete F1 vs F2 comparative analysis
- Detailed token impact calculations
- Quality assessment methodology
- Decision-making process documentation
- Recommendations for future refinements

---

## Three-Tier Validation System

### Overview

The Three-Tier Validation System aligns validation depth with task complexity and risk. Each task type (Setup, Implementation, Architecture, Parent) has a corresponding validation tier that specifies the checks required before marking a task complete.

This validation system ensures:
- **Appropriate error detection** matched to task complexity
- **Incremental quality gates** that catch issues early
- **Objective validation criteria** that AI agents can apply consistently
- **Efficient resource allocation** by avoiding over-validation of simple tasks

### Validation Principles

**Validation Depth Matches Risk**: Low-risk Setup tasks receive minimal validation, while high-risk Architecture tasks receive comprehensive validation.

**Objective Checks**: All validation checks are specific, measurable, and unambiguous.

**Incremental Validation**: Validation occurs after each task completion, not accumulated to parent level.

**Documented Results**: All validation results are documented in completion documentation with specific checks listed.

---

### Tier 1: Minimal Validation (Setup Tasks)

**Purpose**: Verify structural work is complete and syntactically correct

**When to Apply**: 
- Setup tasks (directory creation, configuration files, dependency installation)
- Low complexity, low risk work
- Clear success criteria based on artifact presence

**Required Checks**:

1. **Syntax Validation**
   - Run `getDiagnostics` to check for syntax and type errors
   - Verify no compilation errors in created files
   - Confirm all imports and references resolve correctly

2. **Artifact Verification**
   - Verify all specified artifacts (files, directories) were created
   - Confirm files are in correct locations
   - Check that directory structure matches specification

3. **Basic Structure Validation**
   - Verify basic structure is correct and accessible
   - Confirm configuration files have required fields
   - Check that placeholder content is present where specified

**Validation Example**:

```markdown
## Validation (Tier 1: Minimal)

### Syntax Validation
✅ getDiagnostics passed - no syntax errors
✅ All imports resolve correctly

### Artifact Verification
✅ Created src/build/ directory
✅ Created src/build/platforms/ subdirectory
✅ Created src/build/interfaces/ subdirectory

### Basic Structure Validation
✅ Directory structure accessible
✅ All specified directories exist at correct paths
```

**When Validation Fails**:
- Fix syntax errors before proceeding
- Create missing artifacts
- Correct directory structure issues
- Re-run validation until all checks pass

---

### Tier 2: Standard Validation (Implementation Tasks)

**Purpose**: Verify functional correctness and integration with existing code

**When to Apply**:
- Implementation tasks (class methods, API endpoints, UI components)
- Medium complexity, medium risk work
- Functional validation needed to ensure correctness

**Required Checks**:

1. **Syntax Validation**
   - Run `getDiagnostics` to check for syntax and type errors
   - Verify no compilation errors
   - Confirm all imports and type annotations are correct

2. **Functional Correctness**
   - Verify code executes as intended
   - Test primary functionality works correctly
   - Confirm expected outputs for given inputs
   - Validate error handling for invalid inputs

3. **Integration Validation**
   - Verify integration with existing code
   - Confirm imports resolve correctly
   - Check that interfaces match expectations
   - Validate method signatures align with usage

4. **Requirements Compliance**
   - Verify all requirements for this task are addressed
   - Confirm acceptance criteria are met
   - Check that specified functionality is implemented

5. **Test Execution**
   - Run `npm test` for standard validation (unit/integration tests)
   - Excludes performance tests for fast feedback (~10 minutes)
   - Sufficient for most implementation task validation

**Validation Example**:

```markdown
## Validation (Tier 2: Standard)

### Syntax Validation
✅ getDiagnostics passed - no syntax errors
✅ All imports resolve correctly
✅ Type annotations correct

### Functional Validation
✅ TokenSelector.selectToken() returns correct priority
✅ Semantic tokens prioritized over primitive tokens
✅ Fallback to primitive tokens when semantic unavailable
✅ Error handling works for invalid token references

### Integration Validation
✅ Integrates with PrimitiveTokenRegistry correctly
✅ Integrates with SemanticTokenRegistry correctly
✅ Method signatures match BuildOrchestrator expectations
✅ Return types compatible with downstream consumers

### Requirements Compliance
✅ Requirement 9.1: Token selection priority implemented
✅ Requirement 9.2: Fallback mechanism implemented
✅ Requirement 9.3: Error handling for invalid references
```

**When Validation Fails**:
- Fix functional issues before proceeding
- Correct integration problems
- Address requirements gaps
- Re-run validation until all checks pass

---

### Tier 3: Comprehensive Validation (Architecture & Parent Tasks)

**Purpose**: Verify design soundness, system integration, and end-to-end functionality

**When to Apply**:
- Architecture tasks (design decisions, algorithms, system patterns)
- Parent tasks (container tasks with success criteria)
- High complexity, high risk work
- Design validation needed for extensibility

**Required Checks**:

1. **Syntax Validation**
   - Run `getDiagnostics` to check for syntax and type errors
   - Verify no compilation errors
   - Confirm all imports and type annotations are correct

2. **Functional Correctness**
   - Verify code executes as intended
   - Test all functionality works correctly
   - Confirm expected outputs for various inputs
   - Validate error handling comprehensively

3. **Design Soundness**
   - Verify architecture supports extensibility
   - Confirm separation of concerns is maintained
   - Check that design patterns are applied correctly
   - Validate abstractions are appropriate for use case

4. **System Integration**
   - Verify integration with overall system architecture
   - Confirm interfaces are clear and well-defined
   - Check that component fits within system boundaries
   - Validate dependencies are managed correctly

5. **Edge Cases and Error Handling**
   - Verify handling of invalid inputs
   - Test boundary conditions
   - Confirm error messages are actionable
   - Validate recovery mechanisms work correctly

6. **Requirements Compliance**
   - Verify all requirements for this task are addressed
   - Confirm acceptance criteria are met
   - Check that design decisions align with requirements

7. **Test Execution**
   - Run `npm run test:all` for comprehensive validation (includes performance tests)
   - Required for parent task completion (~28 minutes)
   - Ensures no performance regressions introduced

**Validation Example (Architecture Task)**:

```markdown
## Validation (Tier 3: Comprehensive)

### Syntax Validation
✅ getDiagnostics passed - no syntax errors
✅ All imports resolve correctly
✅ Type annotations correct

### Functional Validation
✅ BuildOrchestrator.orchestrate() executes successfully
✅ Token selection, generation, and file writing coordinated correctly
✅ Error handling works for all failure scenarios
✅ Rollback mechanism functions correctly

### Design Validation
✅ Architecture supports extensibility (new platforms can be added)
✅ Separation of concerns maintained (selection, generation, writing separated)
✅ Strategy pattern applied correctly for platform-specific generation
✅ Abstractions appropriate (BuildOrchestrator coordinates, doesn't implement)

### System Integration
✅ Integrates with TokenSelector correctly
✅ Integrates with platform generators (Web, iOS, Android)
✅ Integrates with file writing system
✅ Interfaces clear and well-defined

### Edge Cases
✅ Handles missing tokens gracefully
✅ Handles file write failures with rollback
✅ Handles invalid platform specifications
✅ Provides actionable error messages

### Requirements Compliance
✅ Requirement 1.1: Orchestration architecture established
✅ Requirement 6.3: Error handling strategy implemented
✅ Requirement 8.2: Extensibility for new platforms
```

---

### Tier 3: Comprehensive Validation (Parent Tasks - Additional Checks)

**Purpose**: Verify all subtasks integrate correctly and success criteria are met

**When to Apply**:
- Parent tasks that encompass multiple subtasks
- Tasks with explicit success criteria
- End-to-end functionality validation needed

**Additional Checks (Beyond Architecture Tier 3)**:

1. **Subtask Integration Verification**
   - Verify all subtask validations passed
   - Confirm subtasks integrate correctly with each other
   - Check that subtask outputs work together as expected
   - Validate no conflicts between subtask implementations

2. **Success Criteria Verification**
   - Verify each success criterion is met with evidence
   - Document how each criterion was achieved
   - Provide specific examples or test results as proof
   - Confirm overall goals of parent task are accomplished

3. **End-to-End Functionality**
   - Verify complete workflow functions correctly
   - Test integration across all subtasks
   - Confirm system behavior matches expectations
   - Validate user-facing functionality works as intended

4. **Requirements Coverage**
   - Verify all requirements for parent task are covered
   - Confirm no requirements were missed by subtasks
   - Check that requirements are fully implemented, not partially

**Validation Example (Parent Task)**:

```markdown
## Validation (Tier 3: Comprehensive - Parent Task)

### Syntax Validation
✅ getDiagnostics passed - no syntax errors across all subtask artifacts

### Functional Validation
✅ All subtask functionality works correctly
✅ End-to-end build process executes successfully

### Design Validation
✅ Overall architecture is sound and extensible
✅ Separation of concerns maintained across all components

### System Integration
✅ All subtasks integrate correctly with each other
✅ No conflicts between subtask implementations
✅ System interfaces are clear and consistent

### Edge Cases
✅ Error handling works across entire system
✅ Edge cases handled at all integration points

### Subtask Integration
✅ Task 1.1 (directory structure) integrates with Task 1.2 (token selector)
✅ Task 1.2 (token selector) integrates with Task 1.3 (orchestration)
✅ Task 1.3 (orchestration) coordinates all components correctly

### Success Criteria Verification
✅ Criterion 1: Build system foundation established
  - Evidence: BuildOrchestrator successfully coordinates token selection and generation
✅ Criterion 2: Platform-specific generation working
  - Evidence: Web, iOS, and Android files generated correctly
✅ Criterion 3: Error handling comprehensive
  - Evidence: All error scenarios tested and handled appropriately

### End-to-End Functionality
✅ Complete build workflow: token selection → platform generation → file writing
✅ Cross-platform consistency verified
✅ Error recovery and rollback tested

### Requirements Coverage
✅ All requirements from subtasks 1.1, 1.2, 1.3 covered
✅ Parent task requirements fully implemented
✅ No gaps in requirements coverage
```

---

### Validation Workflow

#### During Task Execution

1. **Before Starting Task**
   - Review task type and validation tier
   - Understand what validation checks will be required
   - Plan implementation to meet validation criteria

2. **During Implementation**
   - Run `getDiagnostics` frequently to catch syntax errors early
   - Test functionality incrementally
   - Verify integration points as you build

3. **After Implementation**
   - Run complete validation for the task's tier
   - Document validation results in completion documentation
   - Fix any validation failures before marking task complete

4. **Before Moving to Next Task**
   - Confirm all validation checks passed
   - Verify completion documentation includes validation results
   - Ensure no errors or warnings remain unresolved

#### Validation Failure Handling

**When validation fails at any tier**:

1. **Document the Failure**
   - Record specific validation checks that failed
   - Note error messages or unexpected behavior
   - Identify root cause of failure

2. **Fix the Issues**
   - Address syntax errors
   - Correct functional problems
   - Fix integration issues
   - Resolve design flaws

3. **Re-run Validation**
   - Execute validation checks again
   - Verify all issues are resolved
   - Confirm no new issues introduced

4. **Document Resolution**
   - Record what was fixed and how
   - Update completion documentation with final validation results
   - Note any lessons learned

**Example of Validation Failure Documentation**:

```markdown
## Validation (Tier 2: Standard)

### Initial Validation (Failed)
❌ getDiagnostics found 2 type errors in TokenSelector.ts
  - Line 45: Property 'priority' does not exist on type 'Token'
  - Line 67: Argument of type 'string' not assignable to parameter of type 'TokenType'
❌ Functional validation: selectToken() not returning correct priority
  - Expected semantic token, got primitive token

### Resolution
- Fixed type errors: Added 'priority' property to Token interface
- Fixed type error: Changed argument type from string to TokenType enum
- Fixed priority logic: Corrected semantic token check in selectToken()

### Final Validation (Passed)
✅ getDiagnostics passed - no syntax errors
✅ All imports resolve correctly
✅ Functional validation: selectToken() returns correct priority
✅ Integration validation: Works correctly with token registries
✅ Requirements compliance: All requirements addressed
```

---

### Validation Best Practices

**Use getDiagnostics First**: Always run `getDiagnostics` before other validation checks. Syntax errors must be fixed before functional validation.

**Validate Incrementally**: Don't wait until task completion to validate. Check syntax and functionality as you build.

**Document Specific Checks**: List specific validation checks performed, not just "validation passed."

**Provide Evidence**: For comprehensive validation, provide evidence (test results, examples) that checks passed.

**Fix Before Proceeding**: Never move to the next task with validation failures. Fix issues immediately.

**Learn from Failures**: Document what went wrong and how it was fixed. This helps prevent similar issues in future tasks.

---

## Three-Tier Completion Documentation System

### Overview

The Three-Tier Completion Documentation System aligns documentation detail with task complexity and type. Each task type (Setup, Implementation, Architecture, Parent) has a corresponding documentation tier that specifies the required sections and level of detail for completion documentation.

This documentation system ensures:
- **Appropriate documentation depth** matched to task complexity
- **Consistent documentation structure** across all tasks
- **Efficient knowledge capture** without excessive overhead
- **Clear completion artifacts** for future reference

### Documentation Principles

**Documentation Depth Matches Complexity**: Low-complexity Setup tasks receive minimal documentation, while high-complexity Architecture tasks receive comprehensive documentation.

**All Subtasks Documented**: Every subtask receives a completion document, regardless of tier.

**Structured Templates**: Each tier has a defined template with required sections.

**Evidence-Based**: Documentation includes specific evidence of completion and validation results.

---

### Tier 1: Minimal Documentation (Setup Tasks)

**Purpose**: Document structural work completion with basic verification

**When to Apply**:
- Setup tasks (directory creation, configuration files, dependency installation)
- Low complexity, low risk work
- Straightforward operations with clear outcomes

**Required Sections**:

1. **Metadata Header**
   - Date of completion
   - Task number and name
   - Task type (Setup)
   - Status (Complete)

2. **Artifacts Created**
   - List of files and directories created
   - Specific paths for all artifacts
   - Brief description if needed

3. **Implementation Notes**
   - Brief description of what was done
   - Any deviations from plan
   - Simple observations or notes

4. **Validation**
   - Document Tier 1: Minimal validation results
   - List specific checks performed
   - Confirm all checks passed

**Template Example**:

```markdown
# Task [N.M] Completion: [Task Name]

**Date**: [Date]
**Task**: [N.M] [Task name]
**Type**: Setup
**Status**: Complete

---

## Artifacts Created

- [File/directory 1 with path]
- [File/directory 2 with path]
- [File/directory 3 with path]

## Implementation Notes

[Brief description of what was done - 2-3 sentences]

[Any deviations from the plan or notable observations]

## Validation (Tier 1: Minimal)

### Syntax Validation
✅ getDiagnostics passed - no syntax errors
✅ All imports resolve correctly

### Artifact Verification
✅ [Specific artifact 1] created at [path]
✅ [Specific artifact 2] created at [path]
✅ All specified artifacts present

### Basic Structure Validation
✅ Directory structure accessible
✅ Configuration files have required fields
✅ Basic structure correct
```

**Example - Directory Structure Creation**:

```markdown
# Task 1.1 Completion: Create Directory Structure

**Date**: October 20, 2025
**Task**: 1.1 Create directory structure
**Type**: Setup
**Status**: Complete

---

## Artifacts Created

- `src/build/` - Main build system directory
- `src/build/platforms/` - Platform-specific generators
- `src/build/interfaces/` - Build system interfaces
- `src/build/orchestration/` - Build orchestration logic

## Implementation Notes

Created the foundational directory structure for the build system. All directories follow the established project organization pattern with clear separation between interfaces, platform-specific code, and orchestration logic.

## Validation (Tier 1: Minimal)

### Syntax Validation
✅ getDiagnostics passed - no syntax errors
✅ No compilation issues

### Artifact Verification
✅ src/build/ directory created
✅ src/build/platforms/ subdirectory created
✅ src/build/interfaces/ subdirectory created
✅ src/build/orchestration/ subdirectory created

### Basic Structure Validation
✅ All directories accessible
✅ Directory structure matches specification
✅ Paths follow project conventions
```

---

### Tier 2: Standard Documentation (Implementation Tasks)

**Purpose**: Document implementation approach, decisions, and validation results

**When to Apply**:
- Implementation tasks (class methods, API endpoints, UI components)
- Medium complexity, medium risk work
- Functional code requiring integration validation

**Required Sections**:

1. **Metadata Header**
   - Date of completion
   - Task number and name
   - Task type (Implementation)
   - Status (Complete)

2. **Artifacts Created**
   - List of files created or modified
   - Specific paths and descriptions
   - Key components or functions added

3. **Implementation Details**
   - Description of implementation approach
   - Key decisions made during implementation
   - How the solution addresses requirements
   - Any trade-offs or alternatives considered

4. **Validation**
   - Document Tier 2: Standard validation results
   - Syntax validation checks
   - Functional validation checks
   - Integration validation checks
   - Requirements compliance checks

5. **Requirements Compliance**
   - List requirements addressed by this task
   - Confirm each requirement is met
   - Note any partial implementations or future work

**Template Example**:

```markdown
# Task [N.M] Completion: [Task Name]

**Date**: [Date]
**Task**: [N.M] [Task name]
**Type**: Implementation
**Status**: Complete

---

## Artifacts Created

- [File 1 with path] - [Description]
- [File 2 with path] - [Description]
- [Modified file with path] - [What was changed]

## Implementation Details

### Approach

[Description of the implementation approach - 1-2 paragraphs]

### Key Decisions

**Decision 1**: [Decision made]
- **Rationale**: [Why this approach]
- **Alternative**: [What was considered but not chosen]

**Decision 2**: [Decision made]
- **Rationale**: [Why this approach]

### Integration Points

[How this implementation integrates with existing code]

## Validation (Tier 2: Standard)

### Syntax Validation
✅ getDiagnostics passed - no syntax errors
✅ All imports resolve correctly
✅ Type annotations correct

### Functional Validation
✅ [Functional check 1 with specific test]
✅ [Functional check 2 with specific test]
✅ [Error handling check]

### Integration Validation
✅ [Integration check 1 with component]
✅ [Integration check 2 with component]
✅ Method signatures match expectations

### Requirements Compliance
✅ Requirement [X.X]: [Description of how met]
✅ Requirement [Y.Y]: [Description of how met]
```

**Example - Token Selector Implementation**:

```markdown
# Task 1.2 Completion: Implement Token Selector

**Date**: October 20, 2025
**Task**: 1.2 Implement TokenSelector class with priority logic
**Type**: Implementation
**Status**: Complete

---

## Artifacts Created

- `src/build/TokenSelector.ts` - Token selection logic with priority handling
- `src/build/interfaces/ITokenSelector.ts` - Token selector interface

## Implementation Details

### Approach

Implemented the TokenSelector class to handle token selection with priority logic that favors semantic tokens over primitive tokens. The implementation uses a two-phase lookup strategy: first checking the semantic token registry, then falling back to the primitive token registry if needed.

The class maintains references to both registries and provides a single `selectToken()` method that encapsulates the priority logic. Error handling was added to provide clear messages when tokens are not found in either registry.

### Key Decisions

**Decision 1**: Two-phase lookup strategy
- **Rationale**: Keeps the priority logic simple and explicit - semantic tokens are always checked first
- **Alternative**: Could have used a unified registry with priority metadata, but that would complicate the registry implementation

**Decision 2**: Explicit error messages
- **Rationale**: When a token isn't found, the error message indicates which registries were checked, helping developers debug token reference issues
- **Alternative**: Could have returned null/undefined, but explicit errors are better for development experience

### Integration Points

The TokenSelector integrates with:
- `PrimitiveTokenRegistry` for primitive token lookups
- `SemanticTokenRegistry` for semantic token lookups
- `BuildOrchestrator` which uses TokenSelector to resolve token references during generation

## Validation (Tier 2: Standard)

### Syntax Validation
✅ getDiagnostics passed - no syntax errors
✅ All imports resolve correctly
✅ Type annotations correct

### Functional Validation
✅ selectToken() returns semantic token when available
✅ selectToken() falls back to primitive token when semantic unavailable
✅ selectToken() throws clear error when token not found in either registry
✅ Priority logic correctly favors semantic over primitive

### Integration Validation
✅ Integrates with PrimitiveTokenRegistry correctly
✅ Integrates with SemanticTokenRegistry correctly
✅ Method signatures match BuildOrchestrator expectations
✅ Return types compatible with downstream consumers

### Requirements Compliance
✅ Requirement 9.1: Token selection priority logic implemented (semantic > primitive)
✅ Requirement 9.2: Fallback mechanism implemented for missing semantic tokens
✅ Requirement 9.3: Error handling provides actionable messages for invalid references
```

---

### Tier 3: Comprehensive Documentation (Architecture & Parent Tasks)

**Purpose**: Document design decisions, architectural rationale, and system integration

**When to Apply**:
- Architecture tasks (design decisions, algorithms, system patterns)
- Parent tasks (container tasks with success criteria)
- High complexity, high risk work
- Design decisions affecting system structure

**Required Sections**:

1. **Metadata Header**
   - Date of completion
   - Task number and name
   - Task type (Architecture or Parent)
   - Status (Complete)

2. **Artifacts Created**
   - List of files created or modified
   - Specific paths and descriptions
   - Key components, interfaces, or patterns established

3. **Architecture Decisions**
   - Each major design decision documented separately
   - Options considered for each decision
   - Chosen approach with detailed rationale
   - Trade-offs and what was given up
   - Counter-arguments and why they were rejected

4. **Implementation Details**
   - Description of implementation approach
   - How the architecture was realized in code
   - Key patterns or abstractions used
   - Integration strategy

5. **Algorithm** (if applicable)
   - Pseudocode or code examples
   - Explanation of algorithmic approach
   - Complexity analysis if relevant
   - Edge cases handled

6. **Validation**
   - Document Tier 3: Comprehensive validation results
   - Syntax validation checks
   - Functional validation checks
   - Design validation checks
   - System integration checks
   - Edge case validation checks
   - Requirements compliance checks

7. **Requirements Compliance**
   - List all requirements addressed
   - Confirm each requirement is met
   - Explain how design decisions support requirements

8. **Lessons Learned**
   - Insights gained during implementation
   - What worked well
   - What was challenging
   - What would be done differently

9. **Integration Points**
   - How this component integrates with other system components
   - Dependencies and dependents
   - Extension points for future work
   - API surface and contracts

**Template Example**:

```markdown
# Task [N.M] Completion: [Task Name]

**Date**: [Date]
**Task**: [N.M] [Task name]
**Type**: Architecture
**Status**: Complete

---

## Artifacts Created

- [File 1 with path] - [Description]
- [File 2 with path] - [Description]
- [Interface/pattern established]

## Architecture Decisions

### Decision 1: [Decision Title]

**Options Considered**:
1. [Option A] - [Brief description]
2. [Option B] - [Brief description]
3. [Option C] - [Brief description]

**Decision**: [Chosen approach]

**Rationale**: 
[Detailed explanation of why this approach was chosen - 2-3 paragraphs]

**Trade-offs**:
- ✅ **Gained**: [What this approach provides]
- ❌ **Lost**: [What was given up]
- ⚠️ **Risk**: [Potential risks or concerns]

**Counter-Arguments**:
- **Argument**: [Why this might be wrong]
- **Response**: [Why we proceeded anyway]

### Decision 2: [Decision Title]

[Same structure as Decision 1]

## Implementation Details

### Approach

[Detailed description of implementation approach - 2-3 paragraphs]

### Key Patterns

**Pattern 1**: [Pattern name]
- [How it's used]
- [Why it's appropriate]

**Pattern 2**: [Pattern name]
- [How it's used]
- [Why it's appropriate]

## Algorithm

[If applicable - pseudocode or code examples]

```
[Pseudocode or algorithm description]
```

[Explanation of algorithmic approach]

## Validation (Tier 3: Comprehensive)

### Syntax Validation
✅ getDiagnostics passed - no syntax errors
✅ All imports resolve correctly
✅ Type annotations correct

### Functional Validation
✅ [Functional check 1]
✅ [Functional check 2]
✅ [Error handling check]

### Design Validation
✅ Architecture supports extensibility - [specific example]
✅ Separation of concerns maintained - [specific example]
✅ Design patterns applied correctly - [specific example]
✅ Abstractions appropriate - [specific example]

### System Integration
✅ Integrates with [component 1] correctly
✅ Integrates with [component 2] correctly
✅ Interfaces clear and well-defined
✅ Dependencies managed correctly

### Edge Cases
✅ [Edge case 1 handled]
✅ [Edge case 2 handled]
✅ Error messages actionable
✅ Recovery mechanisms work

### Requirements Compliance
✅ Requirement [X.X]: [How design decision supports this]
✅ Requirement [Y.Y]: [How design decision supports this]

## Requirements Compliance

[Detailed explanation of how each requirement is met]

## Lessons Learned

### What Worked Well
- [Insight 1]
- [Insight 2]

### Challenges
- [Challenge 1 and how it was overcome]
- [Challenge 2 and how it was overcome]

### Future Considerations
- [What would be done differently]
- [Potential improvements]

## Integration Points

### Dependencies
- [Component this depends on] - [Why and how]

### Dependents
- [Component that depends on this] - [Why and how]

### Extension Points
- [How this can be extended in the future]
- [What's designed for future expansion]

### API Surface
- [Key interfaces or methods exposed]
- [Contracts and guarantees]
```

---

### Tier 3: Comprehensive Documentation (Parent Tasks - Additional Sections)

**Purpose**: Document overall integration story and success criteria verification

**When to Apply**:
- Parent tasks that encompass multiple subtasks
- Tasks with explicit success criteria
- End-to-end functionality requiring integration verification

**Additional Sections (Beyond Architecture Tier 3)**:

1. **Success Criteria Verification**
   - Each success criterion listed separately
   - Evidence provided for each criterion
   - Specific examples or test results
   - Confirmation that overall goals are met

2. **Overall Integration Story**
   - How all subtasks fit together
   - The complete workflow or system behavior
   - End-to-end functionality description
   - User-facing capabilities delivered

3. **Subtask Summary**
   - Brief summary of each subtask contribution
   - How subtasks integrate with each other
   - Any cross-subtask considerations

**Additional Template Sections**:

```markdown
## Success Criteria Verification

### Criterion 1: [Success criterion text]

**Evidence**: [Specific evidence that this criterion is met]

**Verification**: 
- [Specific test or check 1]
- [Specific test or check 2]
- [Specific test or check 3]

**Example**: [Concrete example demonstrating this criterion is met]

### Criterion 2: [Success criterion text]

[Same structure as Criterion 1]

## Overall Integration Story

### Complete Workflow

[Description of the end-to-end workflow enabled by this parent task - 2-3 paragraphs]

### Subtask Contributions

**Task [N.1]**: [Subtask name]
- [What it contributed to the overall system]
- [How it integrates with other subtasks]

**Task [N.2]**: [Subtask name]
- [What it contributed to the overall system]
- [How it integrates with other subtasks]

**Task [N.3]**: [Subtask name]
- [What it contributed to the overall system]
- [How it integrates with other subtasks]

### System Behavior

[Description of the complete system behavior after all subtasks are integrated]

### User-Facing Capabilities

[What capabilities are now available to users/developers as a result of this work]
```

**Example - Parent Task Completion**:

```markdown
# Task 1 Completion: Build System Foundation

**Date**: October 20, 2025
**Task**: 1. Build System Foundation
**Type**: Parent
**Status**: Complete

---

## Artifacts Created

- `src/build/` directory structure
- `src/build/TokenSelector.ts` - Token selection with priority logic
- `src/build/BuildOrchestrator.ts` - Build orchestration architecture
- `src/build/interfaces/` - All build system interfaces
- `src/build/platforms/` - Platform generator structure

## Architecture Decisions

### Decision 1: Orchestration Pattern

**Options Considered**:
1. Monolithic builder - Single class handling all build logic
2. Pipeline pattern - Sequential stages with data passing
3. Orchestrator pattern - Coordinator delegating to specialized components

**Decision**: Orchestrator pattern

**Rationale**: 
The orchestrator pattern provides the best balance of separation of concerns and coordination. The BuildOrchestrator coordinates between token selection, platform-specific generation, and file writing without implementing any of these concerns itself. This makes the system highly extensible - new platforms can be added by implementing the platform generator interface without modifying the orchestrator.

The pattern also provides clear error handling boundaries. Each component (TokenSelector, platform generators, file writers) can fail independently, and the orchestrator can handle these failures with appropriate recovery strategies.

**Trade-offs**:
- ✅ **Gained**: Clear separation of concerns, high extensibility, testable components
- ❌ **Lost**: Some simplicity - more classes and interfaces than monolithic approach
- ⚠️ **Risk**: Coordination complexity if many components need to interact

**Counter-Arguments**:
- **Argument**: Pipeline pattern would be simpler and more functional
- **Response**: Pipeline pattern works well for linear data transformations, but our build process has branching logic (different platforms) and error recovery needs that fit better with orchestration

### Decision 2: Token Selection Priority

**Options Considered**:
1. Unified registry with priority metadata
2. Two-phase lookup (semantic first, then primitive)
3. Configuration-driven priority

**Decision**: Two-phase lookup

**Rationale**:
Two-phase lookup makes the priority explicit in code rather than hidden in configuration or metadata. When reading the TokenSelector code, it's immediately clear that semantic tokens are checked first, then primitive tokens. This explicitness helps developers understand the system behavior without needing to trace through configuration or metadata.

The approach also keeps the registries simple - they don't need to know about priority, they just store and retrieve tokens. Priority is a concern of the selector, not the storage.

**Trade-offs**:
- ✅ **Gained**: Explicit priority logic, simple registries, clear code flow
- ❌ **Lost**: Flexibility to change priority without code changes
- ⚠️ **Risk**: If priority rules become complex, two-phase lookup might not scale

**Counter-Arguments**:
- **Argument**: Configuration-driven priority would be more flexible
- **Response**: Priority is a core architectural decision, not a configuration concern. Making it explicit in code is appropriate for this level of system behavior.

## Implementation Details

### Approach

Built the foundation in three phases:
1. Directory structure and interfaces (Task 1.1)
2. Token selection logic (Task 1.2)
3. Orchestration architecture (Task 1.3)

This bottom-up approach ensured each component was solid before building the coordination layer. The interfaces were defined first to establish clear contracts between components.

### Key Patterns

**Pattern 1**: Strategy Pattern for Platform Generators
- Each platform implements the same interface
- Orchestrator doesn't know about platform-specific details
- New platforms can be added without modifying orchestrator

**Pattern 2**: Dependency Injection
- Orchestrator receives registries and generators as constructor parameters
- Makes testing easier and dependencies explicit
- Allows for different configurations in different contexts

## Validation (Tier 3: Comprehensive - Parent Task)

### Syntax Validation
✅ getDiagnostics passed - no syntax errors across all artifacts
✅ All imports resolve correctly
✅ Type annotations correct throughout

### Functional Validation
✅ TokenSelector correctly prioritizes semantic over primitive tokens
✅ BuildOrchestrator successfully coordinates all components
✅ End-to-end build process executes successfully
✅ Error handling works for all failure scenarios

### Design Validation
✅ Architecture supports extensibility - new platforms can be added via interface
✅ Separation of concerns maintained - selection, generation, writing are separate
✅ Strategy pattern applied correctly for platform-specific generation
✅ Abstractions appropriate - orchestrator coordinates, doesn't implement

### System Integration
✅ All subtasks integrate correctly with each other
✅ TokenSelector integrates with both registries
✅ BuildOrchestrator integrates with TokenSelector and generators
✅ No conflicts between subtask implementations

### Edge Cases
✅ Missing tokens handled gracefully with clear errors
✅ File write failures trigger rollback mechanism
✅ Invalid platform specifications caught early
✅ Error messages provide actionable guidance

### Subtask Integration
✅ Task 1.1 (directory structure) provides foundation for Task 1.2 and 1.3
✅ Task 1.2 (TokenSelector) integrates seamlessly with Task 1.3 (orchestrator)
✅ All interfaces defined in Task 1.1 properly implemented in Tasks 1.2 and 1.3

## Success Criteria Verification

### Criterion 1: Build system foundation established

**Evidence**: BuildOrchestrator successfully coordinates token selection, platform-specific generation, and file writing in a single orchestrate() call.

**Verification**:
- Created complete directory structure for build system
- Implemented TokenSelector with priority logic
- Implemented BuildOrchestrator with coordination logic
- All components integrate correctly

**Example**: 
```typescript
const orchestrator = new BuildOrchestrator(
  primitiveRegistry,
  semanticRegistry,
  platformGenerators
);
const result = orchestrator.orchestrate('web');
// Successfully generates web platform files
```

### Criterion 2: Platform-specific generation working

**Evidence**: Build system can generate files for web, iOS, and Android platforms with correct platform-specific formatting.

**Verification**:
- Platform generator interface defined
- Structure in place for platform-specific generators
- Orchestrator delegates to appropriate generator based on platform
- Generated files follow platform conventions

**Example**: Web generates CSS, iOS generates Swift, Android generates Kotlin - all from same token source.

### Criterion 3: Error handling comprehensive

**Evidence**: All error scenarios tested and handled with appropriate recovery strategies.

**Verification**:
- Token not found errors provide clear messages
- File write failures trigger rollback
- Invalid platform specifications caught early
- All error paths tested

**Example**: When a token reference is invalid, error message indicates which registries were checked and suggests valid alternatives.

## Overall Integration Story

### Complete Workflow

The build system foundation enables a complete workflow from token definition to platform-specific file generation:

1. **Token Selection**: TokenSelector resolves token references by checking semantic registry first, then falling back to primitive registry
2. **Platform Generation**: BuildOrchestrator delegates to platform-specific generators based on target platform
3. **File Writing**: Generated content is written to appropriate platform directories
4. **Error Recovery**: Any failures trigger appropriate error handling and rollback

This workflow is coordinated by the BuildOrchestrator, which maintains clear separation between these concerns while ensuring they work together correctly.

### Subtask Contributions

**Task 1.1**: Create directory structure
- Established organizational foundation for build system
- Defined clear separation between interfaces, platform code, and orchestration
- Provided structure that guides future development

**Task 1.2**: Implement TokenSelector
- Implemented priority logic for token resolution
- Provided clear interface for token lookup
- Handles fallback and error cases gracefully

**Task 1.3**: Design BuildOrchestrator architecture
- Established coordination pattern for build process
- Defined clear interfaces for platform generators
- Implemented error handling and recovery strategies

### System Behavior

The build system now provides a unified interface for generating platform-specific files from design tokens. Developers can call `orchestrator.orchestrate(platform)` and receive platform-appropriate files without needing to understand the internal coordination logic.

The system prioritizes semantic tokens over primitive tokens, ensuring that design intent (semantic) is preferred over raw values (primitive) when both are available. This supports the design system's goal of maintaining semantic meaning across platforms.

### User-Facing Capabilities

Developers can now:
- Generate platform-specific token files with a single command
- Rely on automatic token resolution with semantic priority
- Receive clear error messages when token references are invalid
- Trust that the system handles platform-specific formatting correctly

## Requirements Compliance

✅ Requirement 1.1: Build system foundation with clear architecture
✅ Requirement 6.3: Comprehensive error handling strategy
✅ Requirement 8.2: Extensibility for new platforms via interface
✅ Requirement 9.1: Token selection priority (semantic > primitive)
✅ Requirement 9.2: Fallback mechanism for missing semantic tokens
✅ Requirement 9.3: Clear error messages for invalid references

## Lessons Learned

### What Worked Well

- **Bottom-up approach**: Building interfaces first, then implementations, ensured clear contracts
- **Explicit priority logic**: Two-phase lookup made token selection behavior obvious
- **Orchestrator pattern**: Provided excellent separation of concerns and extensibility

### Challenges

- **Coordination complexity**: Ensuring all components work together required careful interface design
  - **Resolution**: Defined interfaces early and validated integration points incrementally
- **Error handling boundaries**: Determining which component should handle which errors
  - **Resolution**: Established clear ownership - components detect errors, orchestrator handles recovery

### Future Considerations

- **Performance optimization**: Current implementation prioritizes clarity over performance
  - Could add caching layer for token lookups if performance becomes an issue
- **Configuration flexibility**: Priority logic is hardcoded
  - Could make configurable if different priority strategies are needed
- **Parallel generation**: Currently generates platforms sequentially
  - Could parallelize for better performance with many platforms

## Integration Points

### Dependencies

- **PrimitiveTokenRegistry**: TokenSelector depends on this for primitive token lookups
- **SemanticTokenRegistry**: TokenSelector depends on this for semantic token lookups
- **Platform Generators**: BuildOrchestrator depends on these for platform-specific generation

### Dependents

- **Build CLI**: Will depend on BuildOrchestrator to trigger builds
- **Watch Mode**: Will depend on BuildOrchestrator for incremental builds
- **Test Utilities**: Will depend on these components for testing token generation

### Extension Points

- **New Platforms**: Add by implementing platform generator interface
- **Custom Token Resolution**: Could extend TokenSelector for custom priority logic
- **Build Plugins**: Could add plugin system to BuildOrchestrator for custom build steps

### API Surface

**TokenSelector**:
- `selectToken(tokenName: string): Token` - Main token resolution method

**BuildOrchestrator**:
- `orchestrate(platform: string): BuildResult` - Main build coordination method
- `rollback(): void` - Error recovery method
```

---

### Documentation Workflow

#### During Task Execution

1. **Start Documentation Early**
   - Create completion document when starting task
   - Add notes as you implement
   - Document decisions as they're made

2. **Document Incrementally**
   - Add to completion doc throughout implementation
   - Don't wait until end to write everything
   - Capture insights while they're fresh

3. **Use Appropriate Tier**
   - Check task type to determine documentation tier
   - Follow template for that tier
   - Include all required sections

4. **Provide Evidence**
   - Include specific examples
   - Reference validation results
   - Show concrete outcomes

#### After Task Completion

1. **Review Completeness**
   - Verify all required sections present
   - Check that validation results documented
   - Confirm requirements compliance listed

2. **Review Clarity**
   - Ensure decisions are clearly explained
   - Verify examples are helpful
   - Check that future readers will understand

3. **File Organization**
   - Save to `.kiro/specs/[spec-name]/completion/`
   - Use naming convention: `task-[N]-completion.md` or `task-[N.M]-completion.md`
   - Add organization metadata: `spec-completion`

---

### Documentation Best Practices

**Write for Future You**: Document as if you'll need to understand this in 6 months without any context.

**Be Specific**: "Implemented token selection" is vague. "Implemented two-phase token lookup prioritizing semantic over primitive tokens" is specific.

**Document Decisions**: Don't just document what you did - document why you did it that way.

**Include Counter-Arguments**: For architecture tasks, document why alternative approaches were rejected.

**Provide Examples**: Concrete examples make documentation much more useful than abstract descriptions.

**Link to Requirements**: Always reference which requirements are addressed by the work.

**Capture Lessons**: Document what you learned, what was challenging, and what you'd do differently.

---

### Parent Task Summary Documents

**Purpose**: Create concise, commit-style summaries of parent task completion that trigger release detection hooks and serve as release note content.

**Location**: `docs/specs/[spec-name]/task-N-summary.md`

**When to Create**: After completing a parent task and writing detailed completion documentation in `.kiro/specs/[spec-name]/completion/task-N-parent-completion.md`

**Hook Limitation**: Kiro IDE's `fileCreated` and `fileSaved` hooks only trigger for manual file operations through the IDE UI, not for programmatically created files by AI agents. This requires a hybrid approach:
- **Automatic hooks**: Work for manually created/edited files through IDE UI
- **Manual trigger**: Required for AI-assisted workflows after summary document creation

**Rationale**: 
- **Hook Triggering**: The `.kiro/` directory is filtered from Kiro IDE's file watching system, preventing hooks from triggering on files created there. Summary documents in `docs/specs/` directory enable automatic release detection for manual file operations.
- **Dual Purpose**: Summary documents serve both as hook triggers and as concise, public-facing release note content.
- **Clear Separation**: Detailed completion docs (internal knowledge preservation) remain in `.kiro/`, while summaries (public-facing) live in `docs/`.
- **Hybrid Approach**: Automatic hooks for manual edits, manual trigger for AI workflows ensures release detection works in all scenarios.

**Forward-Looking Note**: This summary document workflow applies to new specs going forward. Existing completion documents don't need changes - this is a forward-looking enhancement to enable reliable hook triggering.

**Important Note on Hook Behavior**: Kiro IDE's `fileCreated` and `fileSaved` hooks only trigger for manual file operations through the IDE UI, not for programmatically created files by AI agents. When working with AI agents to create summary documents:
1. Create the summary document programmatically as part of task completion
2. Manually run `./.kiro/hooks/release-manager.sh auto` to trigger release detection
3. This manual trigger is the standard practice for AI-assisted workflows

**Format Template**:

```markdown
# Task N Summary: [Task Title]

**Date**: [Date]
**Spec**: [spec-name]
**Type**: [Setup | Implementation | Architecture | Infrastructure Fix]

---

## What Was Done

[Concise description of what was implemented - 2-3 sentences focusing on the deliverable]

## Why It Matters

[Business value, user impact, or technical benefit - 1-2 sentences]

## Key Changes

- [Change 1 - specific artifact or capability]
- [Change 2 - specific artifact or capability]
- [Change 3 - specific artifact or capability]

## Impact

- ✅ [Positive impact 1]
- ✅ [Positive impact 2]
- ✅ [Positive impact 3]

---

*For detailed implementation notes, see [task-N-parent-completion.md](../../.kiro/specs/[spec-name]/completion/task-N-parent-completion.md)*
```

**Example - Task 1 Summary**:

```markdown
# Task 1 Summary: Update Spec Planning Standards with Summary Document Workflow

**Date**: October 30, 2025
**Spec**: release-detection-trigger-fix
**Type**: Implementation

---

## What Was Done

Added "Parent Task Summary Documents" section to Spec Planning Standards documenting the new two-document workflow for parent task completion. This section explains the purpose, location, format, and rationale for creating concise summary documents that trigger release detection hooks.

## Why It Matters

Enables automatic release detection by creating summary documents in a location where Kiro IDE file watching can detect them (`.kiro/` directory is filtered). Provides clear guidance for future specs on creating both detailed internal documentation and concise public-facing summaries.

## Key Changes

- Added "Parent Task Summary Documents" section after "Documentation Best Practices"
- Included format template with required sections (What Was Done, Why It Matters, Key Changes, Impact)
- Explained rationale for two-document approach (hook triggering + dual purpose as release notes)
- Added forward-looking note about applying to new specs only

## Impact

- ✅ Clear documentation of summary document workflow for future specs
- ✅ Format template ensures consistent summary document structure
- ✅ Rationale explains why two documents are needed (`.kiro/` filtering + dual purpose)
- ✅ Forward-looking approach avoids migration complexity

---

*For detailed implementation notes, see [task-1-parent-completion.md](../../.kiro/specs/release-detection-trigger-fix/completion/task-1-parent-completion.md)*
```

**Naming Convention**:
- Summary docs: `task-N-summary.md` (e.g., `task-1-summary.md`, `task-2-summary.md`, `task-10-summary.md`)
- Detailed docs: `task-N-parent-completion.md` (e.g., `task-1-parent-completion.md`)

**Hook Pattern**: `**/task-*-summary.md` (matches summary format with wildcard in middle)

**Cross-References**:

Summary documents and detailed completion documents should cross-reference each other to enable easy navigation between public-facing summaries and comprehensive internal documentation.

**From Summary to Detailed Docs**:

Summary documents should include a link to the detailed completion document at the end, providing readers a path to comprehensive implementation notes.

Format:
```markdown
---

*For detailed implementation notes, see [task-N-parent-completion.md](../../.kiro/specs/[spec-name]/completion/task-N-parent-completion.md)*
```

Example from `docs/specs/release-detection-trigger-fix/task-1-summary.md`:
```markdown
---

*For detailed implementation notes, see [task-1-parent-completion.md](../../.kiro/specs/release-detection-trigger-fix/completion/task-1-parent-completion.md)*
```

**From Detailed Docs to Summary (Optional)**:

Detailed completion documents can optionally link to the summary document, though this is less critical since detailed docs are the primary reference.

Format:
```markdown
## Related Documentation

- [Task N Summary](../../../docs/specs/[spec-name]/task-N-summary.md) - Public-facing summary that triggered release detection
```

Example from `.kiro/specs/release-detection-trigger-fix/completion/task-1-parent-completion.md`:
```markdown
## Related Documentation

- [Task 1 Summary](../../../docs/specs/release-detection-trigger-fix/task-1-summary.md) - Public-facing summary that triggered release detection
```

**In Tasks.md**:

Parent tasks should reference both documentation types in the "Completion Documentation" section to make it clear that two documents will be created.

Format:
```markdown
**Completion Documentation:**
- Detailed: `.kiro/specs/[spec-name]/completion/task-[N]-parent-completion.md`
- Summary: `docs/specs/[spec-name]/task-[N]-summary.md` (triggers release detection)
```

Example:
```markdown
**Completion Documentation:**
- Detailed: `.kiro/specs/release-detection-trigger-fix/completion/task-1-parent-completion.md`
- Summary: `docs/specs/release-detection-trigger-fix/task-1-summary.md` (triggers release detection)
```

**Relative Path Calculation**:

When creating cross-references, calculate relative paths based on the source document location:

- **From summary to detailed**: Summary docs are in `docs/specs/[spec-name]/`, detailed docs are in `.kiro/specs/[spec-name]/completion/`
  - Path: `../../.kiro/specs/[spec-name]/completion/task-N-parent-completion.md`
  - Breakdown: `../..` (up to root) → `.kiro/specs/[spec-name]/completion/` (down to target)

- **From detailed to summary**: Detailed docs are in `.kiro/specs/[spec-name]/completion/`, summary docs are in `docs/specs/[spec-name]/`
  - Path: `../../../docs/specs/[spec-name]/task-N-summary.md`
  - Breakdown: `../../..` (up to root) → `docs/specs/[spec-name]/` (down to target)

**Best Practices**:

- Always use relative paths (not absolute paths) for cross-references
- Include descriptive link text that explains what the linked document contains
- Test links by clicking them in rendered markdown to verify they work
- Update cross-references if files are moved during organization

---

## Spec Workflow

### Phase 1: Requirements

1. Generate initial requirements based on feature idea
2. Use EARS format for acceptance criteria
3. Include user stories for context
4. Get user approval before proceeding

### Phase 2: Design

1. Create architecture based on requirements
2. Define components and interfaces
3. Document design decisions with rationale
4. Apply systematic skepticism (counter-arguments)
5. Get user approval before proceeding

### Phase 3: Tasks

1. Convert design into actionable coding tasks
2. Use hierarchical format (primary + sub-tasks)
3. **Classify task types** for each subtask:
   - Review task characteristics (structural vs coding vs design work)
   - Assess complexity and risk (low vs medium vs high)
   - Assign task type (Setup, Implementation, or Architecture)
   - Add **Type** and **Validation** metadata to each subtask
   - Reference **Task Type Definitions** (`.kiro/steering/Task-Type-Definitions.md`) for classification guidance
   - Prompt human for clarification if task type is ambiguous
4. Add success criteria at primary task level
5. Include artifacts and completion documentation paths
6. Get user approval before implementation

### Phase 4: Implementation

1. **Before starting task**: Review task type and validation tier requirements
2. Execute tasks incrementally (one at a time)
3. **Mark tasks using `taskStatus` tool**:
   - Mark task "in_progress" when starting
   - Mark task "completed" when finished
   - **Important**: Using `taskStatus` tool (not direct git commits) triggers agent hooks for:
     - Automatic file organization (based on Organization metadata)
     - Automatic release detection (creates release triggers for analysis)
4. **Validate by tier** before marking complete:
   - **Tier 1 (Setup)**: Syntax validation + artifact verification + basic structure
   - **Tier 2 (Implementation)**: Syntax + functional + integration + requirements compliance
   - **Tier 3 (Architecture/Parent)**: Syntax + functional + design + system integration + edge cases + requirements
   - Fix any validation failures before proceeding
5. **Create completion documentation** using appropriate tier format:
   - **Tier 1 (Setup)**: Minimal format - artifacts, notes, validation
   - **Tier 2 (Implementation)**: Standard format - artifacts, details, validation, requirements
   - **Tier 3 (Architecture/Parent)**: Comprehensive format - artifacts, decisions, algorithm, validation, lessons, integration
6. **Commit changes**: Run `./.kiro/hooks/commit-task.sh "Task Name"` to commit and push
7. Verify all validation checks passed before moving to next task

**Two Workflow Paths:**

**Path A (Recommended - IDE-based with automation)**:
- Use `taskStatus` tool → Triggers agent hooks → Auto organization → Auto release detection → Manual commit
- **Benefit**: Automated file organization and release detection
- **Use when**: Working within Kiro IDE on spec tasks

**Path B (Manual - Script-based)**:
- Manual task status updates → Manual commit via script → No agent hooks triggered
- **Benefit**: Simpler, direct control
- **Use when**: Quick fixes, non-spec work, or when agent hooks aren't needed
- **Note**: Can manually trigger release detection with `./.kiro/hooks/release-manager.sh auto`

---

## Examples

### Example: F1 Mathematical Token System

**Good example of**:
- Comprehensive requirements with EARS format
- Detailed design with architecture diagrams
- Hierarchical tasks with success criteria at primary level
- Clear completion documentation per task

**Reference**: `.kiro/specs/mathematical-token-system/`

### Example: F2 Cross-Platform Build System

**Good example of**:
- Requirements informed by preserved knowledge
- Design with systematic skepticism applied
- Hierarchical task format (improved from F1)
- Success criteria at primary level only

**Reference**: `.kiro/specs/cross-platform-build-system/`

---

## Quality Standards

### Requirements Quality

- All requirements testable and verifiable
- EARS format used consistently
- User stories provide stakeholder context
- Edge cases and error conditions included

### Design Quality

- Architecture clearly explained
- Interfaces well-defined with TypeScript
- Design decisions documented with rationale
- Trade-offs acknowledged honestly
- Systematic skepticism applied (counter-arguments)

### Tasks Quality

- Hierarchical structure (primary + sub-tasks)
- Success criteria at primary level
- Artifacts clearly identified
- Completion documentation specified
- Requirements referenced
- Incremental and buildable

---

## Anti-Patterns to Avoid

### Requirements Anti-Patterns

❌ **Implementation details in requirements** - Focus on behavior, not how  
❌ **Vague acceptance criteria** - Must be specific and testable  
❌ **Missing user stories** - Context helps understand intent  
❌ **Arbitrary metrics** - Validate metrics are achievable and meaningful

### Design Anti-Patterns

❌ **No architecture diagram** - Visual representation helps understanding  
❌ **Undocumented design decisions** - Future you needs to know why  
❌ **No trade-off analysis** - Every decision has costs  
❌ **Missing systematic skepticism** - Challenge assumptions with counter-arguments

### Tasks Anti-Patterns

❌ **Success criteria on every sub-task** - Repetitive and token-heavy  
❌ **Post-complete in tasks** - Redundant with hook automation  
❌ **Vague implementation steps** - Be specific about what to build  
❌ **Missing artifacts** - Hard to know what files should exist  
❌ **No completion documentation** - Learnings get lost

---

## Conditional Loading Pattern

This document uses **conditional loading** - it's only loaded when AI agents are creating or updating specs.

**Trigger conditions**:
- User asks to create a new spec
- User asks to update existing spec documents
- AI agent is in spec planning workflow

**Not loaded when**:
- Executing implementation tasks
- Regular development work
- Non-spec-related activities

**This pattern**:
- Saves tokens for irrelevant work
- Ensures standards applied when needed
- Keeps context focused and relevant
- Scales to other conditional guidance

---

*This document provides the standards for creating well-structured, actionable specifications that enable systematic feature development while maintaining quality and consistency across all specs.*
