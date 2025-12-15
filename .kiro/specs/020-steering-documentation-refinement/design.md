# Design Document: Steering Documentation Refinement

**Date**: December 15, 2025
**Spec**: 020 - Steering Documentation Refinement
**Status**: Design Phase
**Dependencies**: None (but Spec 021 - MCP Documentation Server depends on this spec's completion)

---

## Overview

This design implements a refined steering documentation system that reduces redundancy, improves clarity through progressive disclosure, and prepares documentation for machine-readable consumption by an MCP server.

The design introduces task-relevant metadata, a four-layer progressive disclosure structure, section-level conditional markers, and intentional redundancy guidelines. These improvements enable AI agents to load only relevant documentation while maintaining comprehensive guidance.

---

## Architecture

### Four-Layer Progressive Disclosure Structure

The documentation system uses a four-layer architecture that progressively discloses complexity:

```
Layer 0: Meta-guide
├─ How to use the steering system
├─ Conditional loading explanation
└─ Reading priorities guidance

Layer 1: Foundational Concepts
├─ Core Goals (project principles)
├─ Personal Note (collaboration values)
└─ Start Up Tasks (essential checklist)

Layer 2: Frameworks and Patterns
├─ Development Workflow (task completion, git practices)
├─ File Organization Standards (metadata-driven organization)
├─ Spec Planning Standards (requirements, design, tasks)
└─ Task Type Definitions (classification system)

Layer 3: Specific Implementations
├─ Component Development Guide (token selection, True Native Architecture)
├─ Build System Setup (TypeScript compilation, testing)
├─ Technology Stack (platform-specific technologies)
└─ [Future domain-specific guides]
```

**Design Rationale**: The four-layer structure maps to the "appetizer → main course → dessert" metaphor:
- Layer 0: Reading the menu (how to navigate)
- Layer 1: Appetizer (essential context)
- Layer 2: Main course (core workflows)
- Layer 3: Dessert (specialized knowledge)

### Task-Relevant Metadata Schema

Each steering document includes machine-readable metadata in the header:

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

**Metadata Fields**:
- **Date**: Document creation date
- **Last Reviewed**: Most recent metadata review date (for staleness detection)
- **Purpose**: Brief description of document purpose
- **Organization**: File organization category (process-standard for steering docs)
- **Scope**: Applicability scope (cross-project for steering docs)
- **Layer**: Progressive disclosure layer (0, 1, 2, or 3)
- **Relevant Tasks**: Task types that need this document (or "all-tasks")
- **inclusion**: Whether document is always-loaded or conditionally-loaded
- **trigger**: Task types that trigger conditional loading

### Standardized Task Vocabulary

The system uses 14 standardized task types for metadata:

1. **spec-creation**: Creating or updating specification documents
2. **general-task-execution**: Standard task execution without special requirements
3. **architecture**: Architectural design and system structure decisions
4. **coding**: Writing or modifying implementation code
5. **accessibility-development**: Building accessible components and features
6. **validation**: Validating implementations against requirements
7. **debugging**: Diagnosing and fixing issues
8. **documentation**: Creating or updating documentation
9. **maintenance**: Routine maintenance and updates
10. **performance-optimization**: Improving performance characteristics
11. **file-organization**: Organizing files and directory structure
12. **refactoring**: Restructuring code without changing behavior
13. **migration**: Migrating code or data between systems
14. **hook-setup**: Setting up or modifying agent hooks

**Design Decision**: Use kebab-case for task type names to ensure consistency with file naming conventions and improve machine readability.

---

## Components and Interfaces

### 1. Metadata Schema

**Purpose**: Define machine-readable metadata structure for steering documents

**Schema Definition**:
```typescript
interface SteeringDocumentMetadata {
  date: string;                    // ISO 8601 date (YYYY-MM-DD)
  lastReviewed: string;            // ISO 8601 date (YYYY-MM-DD)
  purpose: string;                 // Brief description
  organization: 'process-standard'; // File organization category
  scope: 'cross-project';          // Applicability scope
  layer: 0 | 1 | 2 | 3;           // Progressive disclosure layer
  relevantTasks: TaskType[] | 'all-tasks'; // Task types or all
  inclusion: 'always' | 'conditional';     // Loading strategy
  trigger?: TaskType[];            // Conditional loading triggers
}

type TaskType = 
  | 'spec-creation'
  | 'general-task-execution'
  | 'architecture'
  | 'coding'
  | 'accessibility-development'
  | 'validation'
  | 'debugging'
  | 'documentation'
  | 'maintenance'
  | 'performance-optimization'
  | 'file-organization'
  | 'refactoring'
  | 'migration'
  | 'hook-setup';
```

### 2. Progressive Disclosure Map

**Purpose**: Define layer assignments for all steering documents

**Layer 0 Documents** (Meta-guide):
- `00-Steering Documentation Directional Priorities.md`

**Layer 1 Documents** (Foundational Concepts):
- `Core Goals.md`
- `Personal Note.md`
- `Start Up Tasks.md`

**Layer 2 Documents** (Frameworks and Patterns):
- `Development Workflow.md`
- `File Organization Standards.md`
- `Spec Planning Standards.md`
- `Task Type Definitions.md`

**Layer 3 Documents** (Specific Implementations):
- `Component Development Guide.md`
- `Build System Setup.md`
- `Technology Stack.md`

### 3. Section-Level Conditional Markers

**Purpose**: Enable skipping irrelevant sections within documents

**Marker Format**:
```markdown
## Section Name (Conditional Loading)

**📖 CONDITIONAL SECTION - Read only when needed**

**Load when**: 
- [Condition 1]
- [Condition 2]
- [Condition 3]

**Skip when**: 
- [Condition 1]
- [Condition 2]
- [Condition 3]

---

[Section content...]
```

**Example Usage**:
```markdown
## Agent Hook Dependency Chains (Conditional Loading)

**📖 CONDITIONAL SECTION - Read only when needed**

**Load when**: 
- Debugging hook issues or automation failures
- Understanding hook dependencies and execution order
- Setting up new hooks or modifying existing ones

**Skip when**: 
- Normal task execution
- Spec creation or documentation work
- Hooks are working correctly

---

[Section content about hook dependencies...]
```

### 4. Intentional Redundancy Guidelines

**Purpose**: Distinguish intentional redundancy from documentation issues

**Redundancy Decision Framework**:

```
Is content duplicated across documents?
├─ YES → Does it serve a clear purpose?
│   ├─ YES → Document rationale and mark as intentional
│   │   └─ Valid purposes:
│   │       - Different audience (human vs AI agent)
│   │       - Different context (overview vs deep dive)
│   │       - Different level of detail (summary vs comprehensive)
│   │       - Critical information that must be immediately visible
│   └─ NO → Consolidate into authoritative source
│       └─ Add cross-references from other documents
└─ NO → No action needed
```

**Intentional Redundancy Markers**:
```markdown
**Note**: This section intentionally duplicates content from [Document Name] 
because [rationale]. For comprehensive details, see [cross-reference].
```

---

## Data Models

### Document Metadata Structure

```yaml
# Example: Development Workflow.md metadata
date: "2025-12-15"
lastReviewed: "2025-12-15"
purpose: "Task completion workflow and git practices"
organization: "process-standard"
scope: "cross-project"
layer: 2
relevantTasks: "all-tasks"
inclusion: "always"
```

### Layer Assignment Matrix

```yaml
layers:
  0:
    name: "Meta-guide"
    purpose: "How to use the steering system"
    documents:
      - "00-Steering Documentation Directional Priorities.md"
    
  1:
    name: "Foundational Concepts"
    purpose: "Project principles and values"
    documents:
      - "Core Goals.md"
      - "Personal Note.md"
      - "Start Up Tasks.md"
    
  2:
    name: "Frameworks and Patterns"
    purpose: "Core workflows and reusable patterns"
    documents:
      - "Development Workflow.md"
      - "File Organization Standards.md"
      - "Spec Planning Standards.md"
      - "Task Type Definitions.md"
    
  3:
    name: "Specific Implementations"
    purpose: "Domain-specific implementation guidance"
    documents:
      - "Component Development Guide.md"
      - "Build System Setup.md"
      - "Technology Stack.md"
```

### Task Type Mapping

```yaml
taskTypes:
  spec-creation:
    description: "Creating or updating specification documents"
    requiredDocuments:
      - layer: 0
        doc: "00-Steering Documentation Directional Priorities.md"
      - layer: 1
        doc: "Core Goals.md"
      - layer: 2
        doc: "Spec Planning Standards.md"
  
  coding:
    description: "Writing or modifying implementation code"
    requiredDocuments:
      - layer: 0
        doc: "00-Steering Documentation Directional Priorities.md"
      - layer: 1
        doc: "Core Goals.md"
      - layer: 2
        doc: "Development Workflow.md"
  
  # [Additional task type mappings...]
```

---

## Error Handling

### Metadata Validation

**Invalid Metadata Detection**:
- Missing required fields → Error with field name
- Invalid task type names → Error with valid options list
- Invalid layer number → Error with valid range (0-3)
- Missing "Last Reviewed" date → Warning (not blocking)

**Validation Script**:
```bash
# Validate all steering document metadata
node scripts/validate-steering-metadata.js

# Output format:
# ✅ Core Goals.md - Valid metadata
# ❌ Development Workflow.md - Missing "lastReviewed" field
# ❌ Component Development Guide.md - Invalid task type "component-work"
```

### Stale Metadata Detection

**Staleness Criteria**:
- "Last Reviewed" date > 6 months old → Warning
- "Last Reviewed" date > 12 months old → Error

**Quarterly Review Process**:
1. Run staleness detection script
2. Review flagged documents
3. Update metadata if accurate
4. Update content if needed
5. Update "Last Reviewed" date

---

## Testing Strategy

### Metadata Validation Tests

**Unit Tests**:
- Validate metadata schema parsing
- Verify task type name validation
- Test layer number validation
- Verify date format validation

**Integration Tests**:
- Scan all steering documents for metadata
- Validate metadata completeness
- Check for invalid task type references
- Verify layer assignments are consistent

### AI Agent Testing

**Test Scenarios**:
1. **Spec Creation Task**: Verify only Layer 0, 1, and Spec Planning Standards load
2. **Coding Task**: Verify only Layer 0, 1, and Development Workflow load
3. **Component Development**: Verify Layer 3 Component Development Guide loads
4. **Hook Setup**: Verify Development Workflow hook sections load

**Success Criteria**:
- AI agents report improved clarity
- Token usage reduced by 20-30% for focused tasks
- No reports of missing critical information
- Cross-references resolve correctly

### MCP Compatibility Tests

**Validation Checks**:
- Metadata schema is machine-readable (valid YAML/JSON)
- Task vocabulary is stable (no breaking changes)
- Layer boundaries are clear (no ambiguous assignments)
- Content structure is parseable (consistent heading hierarchy)
- Cross-references use consistent format

---

## Design Decisions

### Decision 1: Four Layers vs Three Layers

**Options Considered**:
1. Three layers (Foundational, Frameworks, Implementations)
2. Four layers (Meta-guide, Foundational, Frameworks, Implementations)
3. Five layers (add "Advanced" layer)

**Decision**: Four layers (Layer 0, 1, 2, 3)

**Rationale**: 
The meta-guide serves a fundamentally different purpose than foundational concepts. Layer 0 teaches "how to read the docs" while Layer 1 teaches "what we value." Collapsing these creates confusion about whether you're learning the system or learning the project.

The progressive disclosure metaphor works better with four layers:
- Layer 0: Reading the menu
- Layer 1: Appetizer
- Layer 2: Main course
- Layer 3: Dessert

**Trade-offs**:
- ✅ **Gained**: Clear separation between meta-guidance and project principles
- ✅ **Gained**: Better progressive disclosure metaphor
- ❌ **Lost**: Slightly more complex layer numbering
- ⚠️ **Risk**: AI agents might skip Layer 0 thinking it's optional

**Counter-Arguments**:
- **Argument**: "Three layers is simpler and easier to understand"
- **Response**: The meta-guide is already distinguished by the "00-" prefix. Making it Layer 0 formalizes this distinction and makes the progressive disclosure clearer.

### Decision 2: Task-Relevant Metadata vs AI Agent Reading Priorities

**Options Considered**:
1. Remove "AI Agent Reading Priorities" sections, rely only on metadata
2. Keep both metadata and "AI Agent Reading Priorities" sections
3. Use only "AI Agent Reading Priorities" sections, no metadata

**Decision**: Keep both metadata and "AI Agent Reading Priorities" sections

**Rationale**:
Metadata enables machine-readable document selection (which documents to load), while "AI Agent Reading Priorities" sections enable human-readable section selection (which sections to read within loaded documents). These serve complementary purposes.

Metadata answers: "Should I load this document for my task type?"
Reading Priorities answer: "Which sections should I read within this document?"

**Trade-offs**:
- ✅ **Gained**: Machine-readable document selection for MCP server
- ✅ **Gained**: Human-readable section guidance for AI agents
- ✅ **Gained**: Flexibility to evolve each independently
- ❌ **Lost**: Some redundancy between metadata and reading priorities
- ⚠️ **Risk**: Metadata and reading priorities could drift out of sync

**Counter-Arguments**:
- **Argument**: "This creates redundancy - pick one approach"
- **Response**: The redundancy is intentional and serves different purposes. Metadata is for machines (MCP server), reading priorities are for AI agents (strategic reading). Both are needed for the complete system.

### Decision 3: Kebab-Case vs Snake_Case for Task Types

**Options Considered**:
1. kebab-case (spec-creation, general-task-execution)
2. snake_case (spec_creation, general_task_execution)
3. camelCase (specCreation, generalTaskExecution)

**Decision**: kebab-case

**Rationale**:
Kebab-case aligns with existing file naming conventions in the project (e.g., `task-1-completion.md`, `cross-platform-build-system`). Consistency across naming conventions improves readability and reduces cognitive load.

**Trade-offs**:
- ✅ **Gained**: Consistency with file naming conventions
- ✅ **Gained**: Improved readability in metadata
- ❌ **Lost**: Not valid JavaScript identifiers (can't use as object keys without quotes)
- ⚠️ **Risk**: Requires quoting in TypeScript/JavaScript code

**Counter-Arguments**:
- **Argument**: "camelCase is more JavaScript-friendly"
- **Response**: Task types are primarily used in metadata (YAML/markdown), not JavaScript code. When used in code, quoted strings are acceptable. Consistency with file naming is more valuable.

### Decision 4: Section-Level Markers vs Document-Level Only

**Options Considered**:
1. Conditional markers only at document level (current system)
2. Conditional markers at section level within documents
3. Split large documents into smaller, focused documents

**Decision**: Add section-level markers while keeping document-level markers

**Rationale**:
Some documents (like Development Workflow) contain multiple distinct topics that apply to different task types. Section-level markers enable AI agents to skip irrelevant sections without splitting documents into many small files.

Splitting documents would create navigation overhead and break the progressive disclosure structure. Section-level markers provide granular control while maintaining document cohesion.

**Trade-offs**:
- ✅ **Gained**: Granular control over what AI agents read
- ✅ **Gained**: Reduced token usage for focused tasks
- ✅ **Gained**: Maintains document cohesion
- ❌ **Lost**: Additional markup in documents
- ⚠️ **Risk**: Markers could become stale if sections are reorganized

**Counter-Arguments**:
- **Argument**: "Just split documents into smaller files"
- **Response**: Splitting creates navigation overhead and breaks progressive disclosure. A single "Development Workflow" document is easier to navigate than five separate documents. Section markers provide granularity without fragmentation.

### Decision 5: Intentional Redundancy Guidelines vs Eliminate All Redundancy

**Options Considered**:
1. Eliminate all redundancy (single source of truth for everything)
2. Allow redundancy without guidelines (current state)
3. Document intentional redundancy with clear rationale

**Decision**: Document intentional redundancy with clear rationale

**Rationale**:
Some redundancy serves valuable purposes (different audiences, different contexts, critical information visibility). The problem isn't redundancy itself - it's *unintentional* redundancy that creates maintenance burden and inconsistency.

Guidelines help distinguish intentional redundancy (serves a purpose) from unintentional redundancy (documentation issue). This enables informed decisions about when redundancy is valuable.

**Trade-offs**:
- ✅ **Gained**: Clear rationale for redundancy decisions
- ✅ **Gained**: Reduced unintentional redundancy
- ✅ **Gained**: Flexibility for valuable redundancy
- ❌ **Lost**: Slightly more complex documentation maintenance
- ⚠️ **Risk**: Guidelines could be ignored or misapplied

**Counter-Arguments**:
- **Argument**: "Single source of truth is always better"
- **Response**: Strict single source of truth creates navigation overhead when the same concept needs to be understood in different contexts. For example, Core Goals should summarize key principles even if they're detailed elsewhere, because AI agents need that context immediately.

---

## MCP-Readiness Design Considerations

This design explicitly supports future MCP server implementation (Spec 021) through:

### Machine-Readable Metadata Schema

**Design Feature**: Consistent YAML-based metadata in all steering documents

**MCP Benefit**: MCP server can parse metadata to determine which documents to serve for specific task types. Metadata becomes function parameters.

**Example MCP Function**:
```typescript
// MCP server function signature
getSteeringDocumentation(taskType: TaskType, layer?: number): Document[]

// Implementation uses metadata to filter documents
function getSteeringDocumentation(taskType, layer) {
  return documents.filter(doc => 
    doc.metadata.relevantTasks.includes(taskType) &&
    (layer === undefined || doc.metadata.layer === layer)
  );
}
```

### Stable Task Vocabulary

**Design Feature**: 14 standardized task types with explicit definitions

**MCP Benefit**: Task types become stable function parameters that won't break MCP server API. Clients can rely on consistent task type names.

**Example MCP Usage**:
```typescript
// Client calls MCP function with stable task type
const docs = await mcp.call('getSteeringDocumentation', {
  taskType: 'spec-creation',
  layer: 2
});
```

### Clear Layer Boundaries

**Design Feature**: Four distinct layers with clear purposes and document assignments

**MCP Benefit**: MCP server can implement different serving strategies per layer:
- Layer 0: Always serve (meta-guide)
- Layer 1: Serve for all tasks (foundational)
- Layer 2: Serve based on task type (frameworks)
- Layer 3: Serve on-demand (implementations)

**Example MCP Strategy**:
```typescript
// Layer-based serving strategy
function getDocumentsForTask(taskType: TaskType) {
  return [
    ...getLayer0Docs(),           // Always include meta-guide
    ...getLayer1Docs(),           // Always include foundational
    ...getLayer2Docs(taskType),   // Task-specific frameworks
    // Layer 3 served on-demand via separate function
  ];
}
```

### Content Structure for MCP

**Design Feature**: Consistent heading hierarchy and section markers

**MCP Benefit**: MCP server can parse document structure to serve specific sections rather than entire documents. Enables granular content delivery.

**Example MCP Section Serving**:
```typescript
// Serve specific section from document
getDocumentSection(
  documentName: string,
  sectionName: string
): Section

// Example: Get only the "Task Completion Workflow" section
const workflow = await mcp.call('getDocumentSection', {
  documentName: 'Development Workflow.md',
  sectionName: 'Task Completion Workflow'
});
```

### MCP Integration Benefits

**For AI Agents**:
- Reduced initial context load (only metadata, not full documents)
- On-demand document retrieval (load only what's needed)
- Granular section access (skip irrelevant sections)
- Consistent API for documentation access

**For MCP Server**:
- Machine-readable metadata enables intelligent serving
- Stable task vocabulary prevents API breaking changes
- Clear layer boundaries enable serving strategies
- Consistent structure enables section-level parsing

**For Maintenance**:
- Documentation updates don't break MCP server
- Metadata changes are versioned and trackable
- Layer assignments can evolve without API changes
- Content structure is validated automatically

---

## Implementation Notes

### Phase 0: Baseline Documentation Discovery

**Approach**: Document current state before making changes

**Steps**:
1. Create complete inventory of steering documents
2. Map section-level structure of each document
3. Analyze existing metadata patterns
4. Capture baseline metrics for comparison

**Deliverable**: Steering documentation structure map and baseline metrics report

### Phase 1: Metadata Audit and Addition

**Approach**: Audit all steering documents and add metadata headers

**Steps**:
1. Create metadata template with all required fields
2. Review each steering document to determine:
   - Layer assignment (0, 1, 2, or 3)
   - Relevant task types (or "all-tasks")
   - Inclusion strategy (always or conditional)
3. Add metadata header to each document
4. Set "Last Reviewed" date to audit date
5. Validate metadata with validation script

**Deliverable**: All steering documents have complete, valid metadata

### Phase 2: Progressive Disclosure Implementation

**Approach**: Reorganize documents according to four-layer structure

**Steps**:
1. Confirm Layer 0 assignment (meta-guide)
2. Confirm Layer 1 assignments (foundational concepts)
3. Confirm Layer 2 assignments (frameworks and patterns)
4. Confirm Layer 3 assignments (specific implementations)
5. Update cross-references to reflect layer structure
6. Add layer information to "AI Agent Reading Priorities" sections

**Deliverable**: Clear four-layer progressive disclosure structure

### Phase 3: Section-Level Markers and Redundancy Guidelines

**Approach**: Add conditional markers to large documents and document intentional redundancy

**Steps**:
1. Identify documents > 200 lines with multiple distinct topics
2. Add section-level conditional markers with load/skip criteria
3. Review all documents for redundant content
4. Evaluate redundancy using decision framework
5. Document intentional redundancy with rationale
6. Consolidate unintentional redundancy
7. Add cross-references to authoritative sources

**Deliverable**: Section-level markers in large documents, documented redundancy rationale

---

## Integration Points

### Dependencies

**Spec 021 (MCP Documentation Server)**: This spec's outputs (metadata schema, task vocabulary, layer structure) are prerequisites for Spec 021 implementation.

### Dependents

**All AI Agent Workflows**: All AI agent task execution depends on steering documentation. Improvements to steering documentation improve all workflows.

### Extension Points

**Future Task Types**: Task vocabulary can be extended as new task patterns emerge. Add new task types to standardized list and update metadata.

**Future Layers**: Layer structure can be extended if needed (e.g., Layer 4 for advanced topics). Current four-layer structure should accommodate most needs.

**Future Documents**: New steering documents can be added to any layer. Follow metadata schema and layer assignment guidelines.

---

**Organization**: spec-validation
**Scope**: 020-steering-documentation-refinement
