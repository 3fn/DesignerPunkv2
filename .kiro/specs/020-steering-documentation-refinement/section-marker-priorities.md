# Section-Level Marker Priorities

**Date**: 2025-12-15
**Purpose**: Prioritization of documents for section-level conditional marker addition
**Organization**: spec-validation
**Scope**: 020-steering-documentation-refinement

---

## Overview

This document identifies steering documents that need section-level conditional markers based on:
- Document length (> 200 lines)
- Multiple distinct topics within document
- Sections that apply to different task types
- Current conditional loading coverage

**Source Data**:
- `baseline-metrics.md` - Document size analysis
- `steering-structure-map.md` - Section organization analysis

---

## Documents > 200 Lines

### Large Documents (1000+ lines)

#### 1. Spec Planning Standards.md (3067 lines, 82 H2 sections)

**Current State**:
- ✅ Has "AI Agent Reading Priorities" section
- ✅ Has 1 conditional loading marker ("Cross-Spec Coordination")
- ❌ Many sections apply to different spec phases

**Multiple Distinct Topics**:
- Requirements Document Format (spec creation phase)
- Design Document Format (spec creation phase)
- Tasks Document Format (spec creation phase)
- Task Type Classification System (planning phase)
- Three-Tier Validation System (execution phase)
- Three-Tier Completion Documentation System (execution phase)
- Spec Workflow (all phases)
- Cross-Spec Coordination (integration scenarios)

**Sections by Task Type**:
- **Spec creation**: Requirements, Design, Tasks formats
- **Task execution**: Validation tiers, Documentation tiers
- **Integration work**: Cross-Spec Coordination
- **Quality review**: Quality Standards, Anti-Patterns

**Priority**: **HIGH** - Most complex document with clearest separation of concerns

**Recommended Markers**:
1. "Requirements Document Format" - Load when creating requirements.md
2. "Design Document Format" - Load when creating design.md
3. "Tasks Document Format" - Load when creating tasks.md
4. "Three-Tier Validation System" - Load when executing tasks
5. "Three-Tier Completion Documentation System" - Load when documenting completion
6. "Cross-Spec Coordination" - Already marked, keep as-is

---

#### 2. Development Workflow.md (1683 lines, 10 H2 sections)

**Current State**:
- ✅ Has "AI Agent Reading Priorities" section
- ✅ Has 3 conditional loading markers:
  - "Agent Hook Dependency Chains"
  - "Troubleshooting"
  - "Kiro Agent Hook Integration"

**Multiple Distinct Topics**:
- Task Completion Workflow (all tasks)
- Spec Planning (spec creation only)
- Hook System Usage (all tasks)
- Agent Hook Dependency Chains (hook debugging)
- Quality Standards (all tasks)
- Workflow Improvements (context)
- Troubleshooting (debugging only)
- Kiro Agent Hook Integration (hook setup)

**Sections by Task Type**:
- **All tasks**: Task Completion Workflow, Quality Standards
- **Spec creation**: Spec Planning
- **Hook debugging**: Agent Hook Dependency Chains, Troubleshooting
- **Hook setup**: Kiro Agent Hook Integration

**Priority**: **MEDIUM** - Already has good conditional loading coverage, may need refinement

**Recommended Markers**:
- Current markers are appropriate
- Consider adding marker to "Spec Planning" section (currently just references other doc)

---

#### 3. File Organization Standards.md (1526 lines, 55 H2 sections)

**Current State**:
- ✅ Has "AI Agent Reading Priorities" section
- ✅ Has conditional loading guidance in reading priorities
- ❌ No explicit conditional section markers in document body

**Multiple Distinct Topics**:
- File Organization Philosophy (all tasks)
- Required Metadata Fields (all tasks)
- Directory Structure (reference)
- Organization Implementation (file organization tasks)
- File Organization Scope (file organization tasks)
- Cross-Reference Standards (documentation tasks)
- Quality Standards (all tasks)
- Organization Decision Guidelines (file organization tasks)

**Sections by Task Type**:
- **All tasks**: Philosophy, Required Metadata Fields, Quality Standards
- **File organization**: Implementation, Scope, Decision Guidelines
- **Documentation**: Cross-Reference Standards
- **Reference**: Directory Structure

**Priority**: **MEDIUM** - Large document with clear separation between always-needed and conditional content

**Recommended Markers**:
1. "Organization Implementation" - Load when organizing files
2. "File Organization Scope" - Load when organizing files
3. "Cross-Reference Standards" - Load when adding cross-references
4. "Organization Decision Guidelines" - Load when making organization decisions

---

### Medium Documents (200-1000 lines)

#### 4. Component Development Guide.md (759 lines, 11 H2 sections)

**Current State**:
- ✅ Has "AI Agent Reading Priorities" section
- ❌ No conditional section markers
- ✅ Conditionally loaded (trigger: component-development, token-selection)

**Multiple Distinct Topics**:
- Token Selection Decision Framework (component development)
- System-Specific Terminology Glossary (reference)
- Component Attribute Standards (component development)
- Component Structure Pattern (component development)
- Component Token Files (component development)
- Cross-Platform Token Consumption (component development)
- Common Component Patterns (component development)
- Anti-Patterns to Avoid (component development)
- Validation Checklist (component development)
- Component Spec Development Workflow (spec creation for components)

**Sections by Task Type**:
- **Component development**: Most sections
- **Spec creation**: Component Spec Development Workflow
- **Reference**: Glossary, Common Patterns

**Priority**: **LOW** - Document is already conditionally loaded, most sections apply to same task type

**Recommended Markers**:
- "Component Spec Development Workflow" - Load when creating component specs
- Most other sections should be read together when building components

---

#### 5. A Vision of the Future.md (670 lines, 1 H2 section)

**Current State**:
- ✅ Has "AI Agent Reading Priorities" section
- ❌ No conditional section markers
- ✅ Conditionally loaded (trigger: architecture)

**Multiple Distinct Topics**:
- Entire document is philosophical context
- No clear section separation (only 1 H2 section)

**Priority**: **NONE** - Document is already conditionally loaded and lacks section structure for markers

**Recommended Markers**: None needed

---

#### 6. Task-Type-Definitions.md (305 lines, 5 H2 sections)

**Current State**:
- ❌ No "AI Agent Reading Priorities" section
- ❌ No conditional section markers
- ✅ Conditionally loaded (trigger: spec-creation)

**Multiple Distinct Topics**:
- Overview (all spec creation)
- Setup Tasks (reference)
- Implementation Tasks (reference)
- Architecture Tasks (reference)
- Update History (reference)

**Sections by Task Type**:
- **Spec creation**: All sections (reference material)
- **Task execution**: Specific task type definitions

**Priority**: **LOW** - Document is reference material, sections are interdependent

**Recommended Markers**: None needed (reference document should be read completely when loaded)

---

#### 7. BUILD-SYSTEM-SETUP.md (219 lines, 10 H2 sections)

**Current State**:
- ✅ Has "AI Agent Reading Priorities" section
- ❌ No conditional section markers
- ✅ Conditionally loaded (trigger: build-issues, typescript-errors)

**Multiple Distinct Topics**:
- Overview (context)
- Available Scripts (reference)
- How It Works (context)
- When to Build (critical)
- Development Workflow (critical)
- Troubleshooting (debugging only)
- Type Safety Enforcement (context)
- Future Improvements (context)

**Sections by Task Type**:
- **Build issues**: Troubleshooting
- **Testing output**: When to Build, Development Workflow
- **TypeScript errors**: Type Safety Enforcement, Troubleshooting
- **Reference**: Available Scripts, How It Works

**Priority**: **LOW** - Document is already conditionally loaded, reading priorities section provides good guidance

**Recommended Markers**:
- "Troubleshooting" - Already guided by reading priorities, explicit marker could help

---

## Prioritization Summary

### High Priority (Implement First)

1. **Spec Planning Standards.md** (3067 lines)
   - Clearest separation of concerns
   - Multiple distinct phases (requirements, design, tasks, execution)
   - Highest token savings potential
   - Most complex document

### Medium Priority (Implement Second)

2. **File Organization Standards.md** (1526 lines)
   - Clear separation between always-needed and conditional content
   - Cross-reference standards only needed for documentation tasks
   - Organization implementation only needed for file organization tasks

3. **Development Workflow.md** (1683 lines)
   - Already has good conditional loading coverage
   - May need refinement of existing markers
   - "Spec Planning" section could use explicit marker

### Low Priority (Consider for Future)

4. **Component Development Guide.md** (759 lines)
   - Already conditionally loaded
   - Most sections apply to same task type
   - Only "Component Spec Development Workflow" is clearly separable

5. **BUILD-SYSTEM-SETUP.md** (219 lines)
   - Already conditionally loaded
   - Reading priorities section provides good guidance
   - "Troubleshooting" section could use explicit marker

### No Action Needed

6. **A Vision of the Future.md** (670 lines)
   - Already conditionally loaded
   - Lacks section structure for markers
   - Philosophical context should be read completely when loaded

7. **Task-Type-Definitions.md** (305 lines)
   - Reference document
   - Sections are interdependent
   - Should be read completely when loaded

---

## Rationale for Prioritization

### Why Spec Planning Standards is Highest Priority

**Token Savings Potential**:
- 3067 lines total
- Requirements format: ~300 lines (only needed when creating requirements.md)
- Design format: ~400 lines (only needed when creating design.md)
- Tasks format: ~500 lines (only needed when creating tasks.md)
- Validation tiers: ~800 lines (only needed when executing tasks)
- Documentation tiers: ~600 lines (only needed when documenting completion)

**Estimated Token Savings**: 60-70% reduction when AI agents only read relevant sections

**Clear Separation**: Each section serves a distinct phase of spec workflow with minimal overlap

**High Usage**: Document is loaded for all spec-related work, making optimization high-impact

### Why File Organization Standards is Medium Priority

**Token Savings Potential**:
- 1526 lines total
- Cross-reference standards: ~400 lines (only needed when adding cross-references)
- Organization implementation: ~300 lines (only needed when organizing files)
- File organization scope: ~200 lines (only needed when organizing files)

**Estimated Token Savings**: 40-50% reduction for tasks not involving file organization or cross-references

**Moderate Separation**: Some sections are always-needed (metadata, philosophy), others are task-specific

### Why Development Workflow is Medium Priority

**Token Savings Potential**:
- 1683 lines total
- Already has 3 conditional markers covering ~800 lines
- Additional markers could save another ~200 lines

**Estimated Token Savings**: Already achieving ~50% reduction, additional 10-15% possible

**Good Current State**: Existing conditional loading is effective, refinement would be incremental improvement

### Why Component Development Guide is Low Priority

**Token Savings Potential**:
- 759 lines total
- Only "Component Spec Development Workflow" (~100 lines) is clearly separable
- Most sections apply to same task type (component development)

**Estimated Token Savings**: 10-15% reduction (minimal impact)

**Already Optimized**: Document is conditionally loaded, most content is relevant when loaded

---

## Implementation Approach

### Phase 1: High Priority Document

**Task 3.2**: Add section-level markers to Spec Planning Standards.md
- Requirements Document Format
- Design Document Format
- Tasks Document Format
- Three-Tier Validation System
- Three-Tier Completion Documentation System

### Phase 2: Medium Priority Documents

**Task 3.3**: Add section-level markers to File Organization Standards.md
- Organization Implementation
- File Organization Scope
- Cross-Reference Standards
- Organization Decision Guidelines

**Task 3.4**: Refine markers in Development Workflow.md
- Add marker to "Spec Planning" section
- Review existing markers for clarity

### Phase 3: Low Priority Documents (Optional)

**Task 3.5**: Consider markers for Component Development Guide.md and BUILD-SYSTEM-SETUP.md
- Only if token savings justify the effort
- May be deferred to future refinement

---

## Marker Format Template

Based on existing markers in Development Workflow.md:

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

---

## Success Criteria

Section-level markers are successful when:

1. **Token Savings**: AI agents report reduced token usage for focused tasks
2. **Clarity**: AI agents understand when to load/skip sections
3. **Completeness**: No reports of missing critical information
4. **Consistency**: Marker format is consistent across documents
5. **Maintainability**: Markers are easy to update as content evolves

---

**Organization**: spec-validation
**Scope**: 020-steering-documentation-refinement
