# Metadata Maintenance Guidelines

**Date**: December 15, 2025
**Purpose**: Decision frameworks for maintaining steering documentation metadata
**Organization**: spec-guide
**Scope**: 020-steering-documentation-refinement

---

## Overview

This document provides decision frameworks and guidelines for maintaining steering documentation metadata. It answers three critical questions:

1. **When to add new task types** to the standardized vocabulary
2. **When to reassign documents** to different layers
3. **When to change inclusion strategy** (always vs conditional)

These guidelines ensure metadata remains accurate and useful as the project evolves while maintaining stability for AI agents and the future MCP server.

---

## When to Add New Task Types

### Decision Framework

Use this framework to determine if a new task type should be added to the standardized vocabulary:

```
Is there a new pattern of work that doesn't fit existing task types?
├─ NO → Use existing task type
└─ YES → Does this pattern occur frequently (3+ times)?
    ├─ NO → Wait for more evidence
    └─ YES → Does this pattern have distinct documentation needs?
        ├─ NO → Use existing task type
        └─ YES → Add new task type to vocabulary
```

### Criteria for New Task Types

A new task type should be added when **ALL** of these criteria are met:

1. **Pattern Recognition**: The work pattern has occurred 3+ times across different contexts
2. **Distinct Documentation Needs**: The pattern requires different guidance than existing task types
3. **Clear Definition**: The task type can be clearly defined and distinguished from existing types
4. **Stable Naming**: A clear, unambiguous name exists that follows kebab-case convention
5. **MCP Compatibility**: The task type name is suitable for use as an MCP function parameter

### Examples of Valid New Task Types

#### Example 1: Performance Optimization

**Pattern**: Multiple tasks focused on improving performance characteristics
- Task 1: Optimize token generation performance
- Task 2: Improve release analysis speed
- Task 3: Reduce build system compilation time

**Distinct Needs**: Performance tasks require:
- Performance measurement guidance
- Baseline establishment
- Optimization techniques
- Performance regression testing

**Decision**: ✅ Add "performance-optimization" task type

**Rationale**: Pattern occurs frequently, has distinct documentation needs, clear definition

---

#### Example 2: Accessibility Development

**Pattern**: Multiple tasks focused on building accessible components
- Task 1: Add WCAG compliance to button component
- Task 2: Implement keyboard navigation
- Task 3: Add screen reader support

**Distinct Needs**: Accessibility tasks require:
- WCAG standards reference
- Accessibility testing guidance
- Screen reader testing
- Keyboard navigation patterns

**Decision**: ✅ Add "accessibility-development" task type

**Rationale**: Pattern occurs frequently, has distinct documentation needs, clear definition

---

### Examples of Invalid New Task Types

#### Example 1: Button Development

**Pattern**: Multiple tasks focused on button components
- Task 1: Create primary button
- Task 2: Add button variants
- Task 3: Implement button states

**Distinct Needs**: None - uses same guidance as general component development

**Decision**: ❌ Do NOT add "button-development" task type

**Rationale**: Too specific, no distinct documentation needs, use "coding" task type

---

#### Example 2: Quick Fixes

**Pattern**: Multiple small bug fixes
- Task 1: Fix typo in documentation
- Task 2: Correct import path
- Task 3: Update version number

**Distinct Needs**: None - uses same guidance as general maintenance

**Decision**: ❌ Do NOT add "quick-fixes" task type

**Rationale**: Too vague, no distinct documentation needs, use "maintenance" task type

---

### Process for Adding New Task Types

When adding a new task type to the standardized vocabulary:

#### Step 1: Document the Pattern

Create a document describing:
- **Pattern Name**: Clear, descriptive name
- **Occurrences**: List of 3+ tasks that match this pattern
- **Distinct Needs**: Documentation needs that differ from existing task types
- **Proposed Name**: Kebab-case name following conventions

**Example**:
```markdown
# Pattern: Performance Optimization

**Occurrences**:
1. Task: Optimize token generation (Spec 015)
2. Task: Improve release analysis speed (Spec 018)
3. Task: Reduce build compilation time (Spec 012)

**Distinct Needs**:
- Performance measurement guidance
- Baseline establishment
- Optimization techniques
- Performance regression testing

**Proposed Name**: performance-optimization
```

---

#### Step 2: Validate Against Criteria

Check that the pattern meets all criteria:
- [ ] Pattern occurs 3+ times
- [ ] Has distinct documentation needs
- [ ] Can be clearly defined
- [ ] Has stable, clear name
- [ ] Name is MCP-compatible

If any criterion is not met, do NOT add the task type.

---

#### Step 3: Update Task Vocabulary

Add the new task type to the standardized vocabulary in:

**File**: `.kiro/specs/020-steering-documentation-refinement/design.md`

**Section**: "Standardized Task Vocabulary"

**Format**:
```markdown
[N]. **[task-type-name]**: [Description of task type]
```

**Example**:
```markdown
15. **performance-optimization**: Improving performance characteristics
```

---

#### Step 4: Update Validation Script

Update the metadata validation script to recognize the new task type:

**File**: `scripts/validate-steering-metadata.js`

**Section**: `VALID_TASK_TYPES` array

**Example**:
```javascript
const VALID_TASK_TYPES = [
  'spec-creation',
  'general-task-execution',
  // ... existing types ...
  'performance-optimization'  // New task type
];
```

---

#### Step 5: Review Existing Documents

Review all steering documents to determine if the new task type applies:

```bash
# Use metadata analysis artifact
cat .kiro/specs/020-steering-documentation-refinement/metadata-analysis.md
```

For each document:
1. Review purpose statement
2. Determine if new task type is relevant
3. Update "Relevant Tasks" metadata if applicable
4. Update "Last Reviewed" date

---

#### Step 6: Document the Addition

Create a record of the task type addition:

**File**: `.kiro/specs/020-steering-documentation-refinement/task-type-additions.md`

**Format**:
```markdown
## [Date] - [Task Type Name]

**Pattern**: [Description of pattern]
**Occurrences**: [List of 3+ tasks]
**Distinct Needs**: [Documentation needs]
**Rationale**: [Why this task type was added]
**Documents Updated**: [List of documents that now reference this task type]
```

---

### Common Mistakes to Avoid

#### Mistake 1: Adding Task Types Too Early

**Problem**: Adding a task type after only 1-2 occurrences

**Why It's Wrong**: Pattern may not be stable, could be a one-time need

**Solution**: Wait for 3+ occurrences before adding task type

---

#### Mistake 2: Adding Overly Specific Task Types

**Problem**: Creating task types for specific components or features

**Example**: "button-development", "icon-system", "color-tokens"

**Why It's Wrong**: Too specific, no distinct documentation needs

**Solution**: Use existing task types ("coding", "architecture", etc.)

---

#### Mistake 3: Adding Vague Task Types

**Problem**: Creating task types that are too broad or unclear

**Example**: "general-work", "miscellaneous", "other-tasks"

**Why It's Wrong**: Doesn't provide clear guidance, defeats purpose of task types

**Solution**: Use existing task types or define more specific pattern

---

#### Mistake 4: Ignoring MCP Compatibility

**Problem**: Creating task type names that don't work as function parameters

**Example**: "task-type-1", "new_task", "TaskType"

**Why It's Wrong**: Breaks MCP server API, inconsistent with conventions

**Solution**: Use kebab-case, descriptive names that work as parameters

---

## When to Reassign Documents to Different Layers

### Decision Framework

Use this framework to determine if a document should be reassigned to a different layer:

```
Has the document's purpose or scope changed?
├─ NO → Keep current layer assignment
└─ YES → What is the document's new scope?
    ├─ Meta-guidance (how to use steering system) → Layer 0
    ├─ Foundational concepts (applies to all work) → Layer 1
    ├─ Frameworks and patterns (reusable workflows) → Layer 2
    └─ Specific implementations (domain-specific) → Layer 3
```

### Layer Assignment Criteria

Each layer has specific criteria for document assignment:

#### Layer 0: Meta-guide

**Purpose**: Teach AI agents how to use the steering documentation system

**Criteria**:
- Document explains the steering system itself
- Provides guidance on reading priorities
- Explains conditional loading
- Teaches navigation strategies

**Examples**:
- ✅ "00-Steering Documentation Directional Priorities.md"
- ❌ "Core Goals.md" (foundational, not meta)

**When to Assign**: Document teaches how to use steering docs, not project work

---

#### Layer 1: Foundational Concepts

**Purpose**: Provide essential context for all work

**Criteria**:
- Document applies to all task types
- Provides foundational project principles
- Essential for understanding project context
- Concise (< 200 lines preferred)

**Examples**:
- ✅ "Core Goals.md" (project principles)
- ✅ "Personal Note.md" (collaboration values)
- ✅ "Start Up Tasks.md" (essential checklist)
- ❌ "Development Workflow.md" (framework, not foundational)

**When to Assign**: Document provides essential context needed for all work

---

#### Layer 2: Frameworks and Patterns

**Purpose**: Provide reusable workflows and methodologies

**Criteria**:
- Document describes reusable processes
- Applies to multiple task types (but not all)
- Provides systematic approaches
- Can be referenced by multiple specs

**Examples**:
- ✅ "Development Workflow.md" (task completion workflow)
- ✅ "File Organization Standards.md" (organization framework)
- ✅ "Spec Planning Standards.md" (spec creation methodology)
- ❌ "Component Development Guide.md" (specific implementation)

**When to Assign**: Document provides reusable framework or pattern

---

#### Layer 3: Specific Implementations

**Purpose**: Provide domain-specific technical guidance

**Criteria**:
- Document focuses on specific domain or technology
- Applies to narrow set of task types
- Provides detailed technical implementation guidance
- Conditionally loaded based on task type

**Examples**:
- ✅ "Component Development Guide.md" (component-specific)
- ✅ "Build System Setup.md" (build system-specific)
- ✅ "Technology Stack.md" (platform-specific)
- ❌ "Development Workflow.md" (framework, not specific)

**When to Assign**: Document provides specialized technical guidance

---

### Reassignment Scenarios

#### Scenario 1: Document Specialization

**Situation**: Document content became more specialized over time

**Example**: General development guide → Component-specific guide

**Before**:
```markdown
**Layer**: 2
**Relevant Tasks**: all-tasks
```

**After**:
```markdown
**Layer**: 3
**Relevant Tasks**: coding, accessibility-development
```

**Rationale**: Document focus narrowed to specific domain (components)

**Process**:
1. Update layer assignment (2 → 3)
2. Update relevant tasks (all-tasks → specific types)
3. Change inclusion strategy (always → conditional)
4. Update "Last Reviewed" date
5. Run validation

---

#### Scenario 2: Document Generalization

**Situation**: Document content became more general and foundational

**Example**: Specific implementation guide → Framework pattern

**Before**:
```markdown
**Layer**: 3
**Relevant Tasks**: coding
```

**After**:
```markdown
**Layer**: 2
**Relevant Tasks**: all-tasks
```

**Rationale**: Document scope expanded to reusable framework

**Process**:
1. Update layer assignment (3 → 2)
2. Update relevant tasks (specific → all-tasks)
3. Change inclusion strategy (conditional → always)
4. Update "Last Reviewed" date
5. Run validation

---

#### Scenario 3: Document Promotion to Foundational

**Situation**: Document became essential for all work

**Example**: Framework guide → Foundational concept

**Before**:
```markdown
**Layer**: 2
**Relevant Tasks**: spec-creation, documentation
```

**After**:
```markdown
**Layer**: 1
**Relevant Tasks**: all-tasks
```

**Rationale**: Document provides essential context for all work

**Process**:
1. Verify document is concise (< 200 lines preferred)
2. Update layer assignment (2 → 1)
3. Update relevant tasks (specific → all-tasks)
4. Ensure inclusion is "always"
5. Update "Last Reviewed" date
6. Run validation

**Warning**: Layer 1 should remain small - only promote truly foundational documents

---

### Common Reassignment Mistakes

#### Mistake 1: Promoting Too Many Documents to Layer 1

**Problem**: Layer 1 becomes bloated with non-essential documents

**Why It's Wrong**: Layer 1 should be concise, essential context only

**Solution**: Keep Layer 1 small (3-5 documents), use Layer 2 for frameworks

---

#### Mistake 2: Demoting Documents Without Updating Inclusion

**Problem**: Moving document to Layer 3 but keeping "always" inclusion

**Why It's Wrong**: Layer 3 documents should be conditionally loaded

**Solution**: Update inclusion strategy when changing layers

---

#### Mistake 3: Reassigning Based on Document Length

**Problem**: Moving long documents to Layer 3 regardless of content

**Why It's Wrong**: Layer assignment is about scope, not length

**Solution**: Assign based on purpose and scope, not document size

---

## When to Change Inclusion Strategy

### Decision Framework

Use this framework to determine if a document's inclusion strategy should change:

```
Does the document apply to all task types?
├─ YES → Use "always" inclusion
└─ NO → Does the document apply to 3+ task types?
    ├─ YES → Consider "always" inclusion (if frequently needed)
    └─ NO → Use "conditional" inclusion
```

### Inclusion Strategy Criteria

#### Always-Loaded Documents

**Criteria**:
- Document applies to all task types (or nearly all)
- Document provides essential context
- Document is frequently referenced
- Document is Layer 0, 1, or 2 (typically)

**Examples**:
- ✅ "Core Goals.md" (all tasks need project context)
- ✅ "Development Workflow.md" (all tasks follow workflow)
- ✅ "Start Up Tasks.md" (all tasks need checklist)
- ❌ "Component Development Guide.md" (only coding tasks)

**When to Use**: Document is essential for most or all work

---

#### Conditionally-Loaded Documents

**Criteria**:
- Document applies to specific task types only
- Document provides specialized guidance
- Document is Layer 3 (typically)
- Document is large (> 200 lines) and specialized

**Examples**:
- ✅ "Component Development Guide.md" (coding, accessibility)
- ✅ "Build System Setup.md" (debugging, validation)
- ✅ "Technology Stack.md" (architecture, coding)
- ❌ "Core Goals.md" (applies to all tasks)

**When to Use**: Document is specialized for specific task types

---

### Inclusion Strategy Change Scenarios

#### Scenario 1: Always → Conditional

**Situation**: Document became specialized over time

**Before**:
```markdown
**Relevant Tasks**: all-tasks
---
inclusion: always
---
```

**After**:
```markdown
**Relevant Tasks**: coding, debugging
---
inclusion: conditional
trigger: coding, debugging
---
```

**Rationale**: Document content narrowed to specific task types

**Process**:
1. Update relevant tasks (all-tasks → specific types)
2. Change inclusion (always → conditional)
3. Add trigger conditions
4. Update "Last Reviewed" date
5. Run validation

**Impact**: Document will only load for specified task types, reducing token usage

---

#### Scenario 2: Conditional → Always

**Situation**: Document became broadly applicable

**Before**:
```markdown
**Relevant Tasks**: coding
---
inclusion: conditional
trigger: coding
---
```

**After**:
```markdown
**Relevant Tasks**: all-tasks
---
inclusion: always
---
```

**Rationale**: Document content expanded to apply to all tasks

**Process**:
1. Update relevant tasks (specific → all-tasks)
2. Change inclusion (conditional → always)
3. Remove trigger conditions
4. Update "Last Reviewed" date
5. Run validation

**Impact**: Document will load for all tasks, increasing token usage but ensuring availability

---

### Trigger Condition Guidelines

When using conditional inclusion, follow these guidelines for trigger conditions:

#### Guideline 1: Match Relevant Tasks

**Rule**: Trigger conditions should match "Relevant Tasks" metadata

**Example**:
```markdown
**Relevant Tasks**: coding, debugging
---
inclusion: conditional
trigger: coding, debugging
---
```

**Why**: Ensures consistency between metadata and loading behavior

---

#### Guideline 2: Use Specific Task Types

**Rule**: Avoid using "all-tasks" with conditional inclusion

**Example**:
```markdown
# ❌ WRONG
**Relevant Tasks**: all-tasks
---
inclusion: conditional
trigger: all-tasks
---

# ✅ CORRECT
**Relevant Tasks**: all-tasks
---
inclusion: always
---
```

**Why**: If document applies to all tasks, use "always" inclusion

---

#### Guideline 3: List All Applicable Task Types

**Rule**: Include all task types that need the document

**Example**:
```markdown
# ❌ INCOMPLETE
**Relevant Tasks**: coding
---
inclusion: conditional
trigger: coding
---

# ✅ COMPLETE
**Relevant Tasks**: coding, accessibility-development, debugging
---
inclusion: conditional
trigger: coding, accessibility-development, debugging
---
```

**Why**: Ensures document loads for all relevant task types

---

### Common Inclusion Strategy Mistakes

#### Mistake 1: Using "Always" for Specialized Documents

**Problem**: Loading specialized documents for all tasks

**Why It's Wrong**: Wastes tokens, loads irrelevant guidance

**Solution**: Use conditional inclusion for specialized documents

---

#### Mistake 2: Using "Conditional" for Foundational Documents

**Problem**: Not loading essential documents for some tasks

**Why It's Wrong**: AI agents miss critical context

**Solution**: Use always inclusion for foundational documents

---

#### Mistake 3: Mismatched Triggers and Relevant Tasks

**Problem**: Trigger conditions don't match relevant tasks metadata

**Example**:
```markdown
**Relevant Tasks**: coding, debugging
---
trigger: coding  # Missing debugging
---
```

**Why It's Wrong**: Creates inconsistency, document won't load when needed

**Solution**: Ensure triggers match relevant tasks exactly

---

## Validation After Metadata Changes

After making any metadata changes, always run validation:

### Step 1: Run Metadata Validation

```bash
node scripts/validate-steering-metadata.js
```

**What It Checks**:
- All required fields present
- Task type names match standardized vocabulary
- Layer numbers valid (0-3)
- Date formats valid (ISO 8601)
- Trigger conditions match relevant tasks

---

### Step 2: Fix Validation Errors

If validation fails:

1. Review error messages
2. Identify specific issues
3. Fix errors in metadata
4. Re-run validation
5. Repeat until all documents pass

---

### Step 3: Run Staleness Detection

```bash
node scripts/detect-stale-metadata.js
```

**What It Checks**:
- "Last Reviewed" dates updated
- No documents > 12 months old (error)
- No documents > 6 months old (warning)

---

### Step 4: Document Changes

For significant metadata changes, document:

**File**: `.kiro/specs/020-steering-documentation-refinement/metadata-changes-log.md`

**Format**:
```markdown
## [Date] - [Document Name]

**Change Type**: [Task Type Addition / Layer Reassignment / Inclusion Change]
**Before**: [Previous metadata]
**After**: [New metadata]
**Rationale**: [Why change was made]
**Impact**: [Effect on AI agents and MCP server]
```

---

## Best Practices

### Do's

✅ **Wait for patterns** - Don't add task types after 1-2 occurrences
✅ **Use decision frameworks** - Follow structured decision-making
✅ **Validate after changes** - Always run validation scripts
✅ **Document rationale** - Explain why changes were made
✅ **Update "Last Reviewed"** - Always update date after changes
✅ **Consider MCP impact** - Think about future MCP server usage

### Don'ts

❌ **Don't add task types prematurely** - Wait for 3+ occurrences
❌ **Don't reassign without updating inclusion** - Keep metadata consistent
❌ **Don't skip validation** - Always verify changes are correct
❌ **Don't change metadata without rationale** - Document why
❌ **Don't ignore staleness warnings** - Address before they become errors

---

## Related Documentation

- **Quarterly Review Process**: `.kiro/specs/020-steering-documentation-refinement/quarterly-review-process.md`
- **Metadata Template**: `.kiro/specs/020-steering-documentation-refinement/metadata-template.md`
- **Metadata Validation Script**: `scripts/validate-steering-metadata.js`
- **Staleness Detection Script**: `scripts/detect-stale-metadata.js`
- **Design Document**: `.kiro/specs/020-steering-documentation-refinement/design.md`

---

**Organization**: spec-guide
**Scope**: 020-steering-documentation-refinement
