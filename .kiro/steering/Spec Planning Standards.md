---
inclusion: conditional
trigger: spec-creation
---

# Spec Planning Standards

**Date**: January 10, 2025  
**Purpose**: Standards for creating requirements, design, and task documents for feature specifications  
**Organization**: process-standard  
**Scope**: cross-project  
**Trigger**: Conditional - loaded when AI Agent creates or updates specs

---

## Overview

This document defines the format and structure for creating feature specifications in the DesignerPunk project. Specs follow a three-phase workflow: Requirements → Design → Tasks, with each phase building on the previous to create comprehensive, actionable implementation plans.

**When to use this document**: When creating new specs or updating existing spec documents (requirements.md, design.md, tasks.md).

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
  - [Implementation step 1]
  - [Implementation step 2]
  - _Requirements: [Requirement IDs]_

- [ ] [N.2] [Sub-task Title]
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
- One completion doc per primary task
- Path: `.kiro/specs/[spec-name]/completion/task-[N]-completion.md`
- Documents approach, decisions, and learnings

**Sub-tasks**:
- Focus on implementation steps
- Reference requirements
- Keep concise and actionable
- No success criteria (covered by primary)

**Post-Complete Commits**:
- **NOT included in tasks** - handled automatically by task completion hook
- Hook extracts commit message from task name
- Follows Development Workflow automation

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
3. Add success criteria at primary task level
4. Include artifacts and completion documentation
5. Get user approval before implementation

### Phase 4: Implementation

1. Execute tasks incrementally (one at a time)
2. Mark tasks in progress, then complete
3. Create completion documentation
4. Commit using task completion hook (automatic)
5. Validate before moving to next task

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
