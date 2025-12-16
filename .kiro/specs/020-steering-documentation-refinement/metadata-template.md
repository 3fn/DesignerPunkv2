# Steering Document Metadata Template

**Date**: December 15, 2025
**Purpose**: Template for steering document metadata headers with examples and field documentation
**Organization**: spec-guide
**Scope**: 020-steering-documentation-refinement

---

## Overview

This template provides the standard metadata header format for all steering documentation. Use this template when creating new steering documents or updating existing documents to include metadata.

---

## Standard Metadata Header Format

```markdown
# Document Title

**Date**: YYYY-MM-DD
**Last Reviewed**: YYYY-MM-DD
**Purpose**: Clear description of document purpose
**Organization**: process-standard
**Scope**: cross-project
**Layer**: [0 | 1 | 2 | 3]
**Relevant Tasks**: [task-type-1, task-type-2, ...] or "all-tasks"

---
inclusion: [always | conditional]
trigger: [task-type-1, task-type-2, ...]
---
```

---

## Metadata Field Definitions

### Date
**Format**: `YYYY-MM-DD` (ISO 8601 date format)  
**Purpose**: Document creation date  
**Required**: Yes  
**Example**: `**Date**: December 15, 2025`

**Guidelines**:
- Use the date when the document was first created
- Do not update this field when making revisions
- Use full month name and 4-digit year for readability

---

### Last Reviewed
**Format**: `YYYY-MM-DD` (ISO 8601 date format)  
**Purpose**: Most recent metadata review date for staleness detection  
**Required**: Yes  
**Example**: `**Last Reviewed**: December 15, 2025`

**Guidelines**:
- Update this field whenever metadata is reviewed or updated
- Update when document content is significantly revised
- Used to identify documents that may need review (> 6 months = warning, > 12 months = error)
- Set to audit date during initial metadata addition

---

### Purpose
**Format**: Free text (1-2 sentences)  
**Purpose**: Brief description of document purpose and scope  
**Required**: Yes  
**Example**: `**Purpose**: Guide AI agents in building components with appropriate token usage and True Native Architecture`

**Guidelines**:
- Be concise but descriptive
- Focus on what the document helps users accomplish
- Avoid implementation details
- Should answer: "Why would I read this document?"

---

### Organization
**Format**: Controlled vocabulary value  
**Purpose**: File organization category for metadata-driven organization  
**Required**: Yes  
**Valid Values**: `process-standard` (for steering documents)  
**Example**: `**Organization**: process-standard`

**Guidelines**:
- All steering documents use `process-standard`
- This field enables automatic file organization
- See File Organization Standards for complete list of organization values

---

### Scope
**Format**: Controlled vocabulary value  
**Purpose**: Applicability scope of the document  
**Required**: Yes  
**Valid Values**: `cross-project` (for steering documents)  
**Example**: `**Scope**: cross-project`

**Guidelines**:
- All steering documents use `cross-project`
- Indicates document applies across all project work
- Distinguishes from spec-specific documentation

---

### Layer
**Format**: Integer (0, 1, 2, or 3)  
**Purpose**: Progressive disclosure layer assignment  
**Required**: Yes  
**Valid Values**: 
- `0` - Meta-guide (how to use steering system)
- `1` - Foundational Concepts (project principles)
- `2` - Frameworks and Patterns (core workflows)
- `3` - Specific Implementations (domain-specific guidance)

**Example**: `**Layer**: 2`

**Guidelines**:
- Layer 0: Only the meta-guide document (00-Steering Documentation Directional Priorities.md)
- Layer 1: Core Goals, Personal Note, Start Up Tasks
- Layer 2: Development Workflow, File Organization Standards, Spec Planning Standards, Task Type Definitions
- Layer 3: Component Development Guide, Build System Setup, Technology Stack
- See Progressive Disclosure Map in design.md for complete layer assignments

---

### Relevant Tasks
**Format**: Comma-separated list of task types OR "all-tasks"  
**Purpose**: Task types that need this document  
**Required**: Yes  
**Valid Values**: See Standardized Task Vocabulary below, or "all-tasks"  
**Example**: `**Relevant Tasks**: spec-creation, documentation`  
**Example**: `**Relevant Tasks**: all-tasks`

**Guidelines**:
- Use "all-tasks" if document applies to all task types
- List specific task types if document is task-specific
- Use kebab-case for task type names
- Separate multiple task types with commas
- Task types must match standardized vocabulary exactly

---

### inclusion (YAML Front Matter)
**Format**: `always` or `conditional`  
**Purpose**: Whether document is always-loaded or conditionally-loaded  
**Required**: Yes  
**Valid Values**: `always`, `conditional`  
**Example**: 
```markdown
---
inclusion: always
---
```

**Guidelines**:
- Use `always` for documents loaded for every task (Layer 0, 1, 2)
- Use `conditional` for documents loaded only when triggers match (Layer 3)
- Placed in YAML front matter section after main metadata header
- Separated by `---` markers

---

### trigger (YAML Front Matter)
**Format**: Comma-separated list of task types  
**Purpose**: Task types that trigger conditional loading  
**Required**: Only if `inclusion: conditional`  
**Valid Values**: See Standardized Task Vocabulary below  
**Example**: 
```markdown
---
inclusion: conditional
trigger: component-development, token-selection, cross-platform-components
---
```

**Guidelines**:
- Only include if `inclusion: conditional`
- List task types that should trigger loading this document
- Use kebab-case for task type names
- Separate multiple task types with commas
- Task types must match standardized vocabulary exactly

---

## Standardized Task Vocabulary

The following 14 task types are the standardized vocabulary for metadata:

1. **spec-creation** - Creating or updating specification documents
2. **general-task-execution** - Standard task execution without special requirements
3. **architecture** - Architectural design and system structure decisions
4. **coding** - Writing or modifying implementation code
5. **accessibility-development** - Building accessible components and features
6. **validation** - Validating implementations against requirements
7. **debugging** - Diagnosing and fixing issues
8. **documentation** - Creating or updating documentation
9. **maintenance** - Routine maintenance and updates
10. **performance-optimization** - Improving performance characteristics
11. **file-organization** - Organizing files and directory structure
12. **refactoring** - Restructuring code without changing behavior
13. **migration** - Migrating code or data between systems
14. **hook-setup** - Setting up or modifying agent hooks

**Additional task types for conditional triggers** (not in core 14):
- **component-development** - Building or modifying components
- **token-selection** - Working with design tokens
- **cross-platform-components** - Implementing cross-platform components
- **build-issues** - Troubleshooting build system issues
- **typescript-errors** - Resolving TypeScript compilation errors
- **testing-output** - Testing generated output files

**Guidelines**:
- Always use kebab-case
- Task type names must match exactly (case-sensitive)
- Use core 14 types for "Relevant Tasks" field
- Additional types can be used for conditional "trigger" field
- Propose new task types if needed patterns emerge

---

## Complete Examples

### Example 1: Always-Loaded Layer 2 Document

```markdown
# Development Workflow and Task Completion Practices

**Date**: October 20, 2025
**Last Reviewed**: December 15, 2025
**Purpose**: Guide task completion workflow and git practices for all development work
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 2
**Relevant Tasks**: all-tasks

---
inclusion: always
---

## AI Agent Reading Priorities

[Content continues...]
```

### Example 2: Conditionally-Loaded Layer 3 Document

```markdown
# Component Development Guide

**Date**: November 17, 2025
**Last Reviewed**: December 15, 2025
**Purpose**: Guide AI agents in building components with appropriate token usage and True Native Architecture
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 3
**Relevant Tasks**: coding, architecture, accessibility-development

---
inclusion: conditional
trigger: component-development, token-selection, cross-platform-components
---

## AI Agent Reading Priorities

[Content continues...]
```

### Example 3: Layer 0 Meta-Guide Document

```markdown
# Steering Documentation Directional Priorities

**Date**: October 20, 2025
**Last Reviewed**: December 15, 2025
**Purpose**: Meta-guide teaching AI agents how to use the conditional loading steering system
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 0
**Relevant Tasks**: all-tasks

---
inclusion: always
---

## How This Steering System Works

[Content continues...]
```

### Example 4: Layer 1 Foundational Document

```markdown
# Core Goals

**Date**: October 20, 2025
**Last Reviewed**: December 15, 2025
**Purpose**: Core project context and development practices for DesignerPunk design system
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 1
**Relevant Tasks**: all-tasks

---
inclusion: always
---

## Core Project Context

[Content continues...]
```

---

## Validation Checklist

Before finalizing metadata, verify:

- [ ] All required fields are present (Date, Last Reviewed, Purpose, Organization, Scope, Layer, Relevant Tasks)
- [ ] Date format is YYYY-MM-DD (ISO 8601)
- [ ] Last Reviewed date is current
- [ ] Purpose is clear and concise (1-2 sentences)
- [ ] Organization is "process-standard"
- [ ] Scope is "cross-project"
- [ ] Layer is 0, 1, 2, or 3 (matches progressive disclosure map)
- [ ] Relevant Tasks uses standardized vocabulary or "all-tasks"
- [ ] YAML front matter is present with inclusion field
- [ ] If inclusion is "conditional", trigger field is present
- [ ] Task type names use kebab-case
- [ ] Task type names match standardized vocabulary exactly

---

## Usage Instructions

### For New Documents

1. Copy the standard metadata header format
2. Fill in all required fields
3. Choose appropriate layer based on document purpose
4. Determine if document is always-loaded or conditional
5. Add YAML front matter with inclusion and trigger (if conditional)
6. Validate using checklist above

### For Existing Documents

1. Add metadata header at the top of the document
2. Set Date to original creation date (if known)
3. Set Last Reviewed to current audit date
4. Fill in all other required fields
5. Add YAML front matter with inclusion and trigger
6. Validate using checklist above

### For Metadata Updates

1. Update Last Reviewed date to current date
2. Review all metadata fields for accuracy
3. Update Relevant Tasks if document scope changed
4. Update Layer if document purpose changed
5. Validate using checklist above

---

## Related Documentation

- [Requirements Document](./requirements.md) - Metadata system requirements
- [Design Document](./design.md) - Metadata schema and architecture
- [File Organization Standards](../../steering/File Organization Standards.md) - Organization field values

---

**Note**: This template is part of Spec 020 - Steering Documentation Refinement. For questions or proposed changes to the metadata schema, refer to the spec documentation.
