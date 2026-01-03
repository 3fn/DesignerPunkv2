# File Split Candidates Analysis

**Date**: 2026-01-03
**Spec**: 036 - Steering Documentation Audit
**Task**: 6.4 - Identify file split candidates
**Status**: Analysis Phase - Candidates Pending Human Approval at Checkpoint 2

---

## Overview

This analysis evaluates large steering documents for potential file splitting based on:
- **Conditional loading sections**: Can sections be loaded independently?
- **MCP query precision**: Would splitting improve query targeting?
- **Maintenance burden**: Would splitting reduce or increase maintenance complexity?

Per Requirements 10.1-10.5, all split recommendations are **candidates pending human approval**.

---

## Evaluation Criteria

### Split Benefit Factors
1. **Token savings at session start**: Reduces always-loaded context
2. **MCP query precision**: Enables targeted section retrieval
3. **Conditional loading enablement**: Allows task-based loading
4. **Maintenance isolation**: Changes to one section don't require full doc review

### Split Cost Factors
1. **Cross-reference complexity**: More files = more links to maintain
2. **Navigation overhead**: Agents must know which file to query
3. **Context fragmentation**: Related content separated across files
4. **Implementation effort**: Splitting requires careful content migration

---

## Large Document Analysis

### Documents Evaluated (>10,000 tokens)

| Document | Tokens | Always Loaded? | Split Candidate? |
|----------|--------|----------------|------------------|
| Spec Planning Standards.md | 27,135 | No (Manual) | ⚠️ Evaluate |
| File Organization Standards.md | 16,680 | **Yes** | ⚠️ Evaluate |
| Development Workflow.md | 16,093 | **Yes** | ⚠️ Evaluate |
| Test Development Standards.md | 16,485 | No (Manual) | ⚠️ Evaluate |
| Test Failure Audit Methodology.md | 14,845 | No (Manual) | ⚠️ Evaluate |
| Component Development and Practices Guide.md | 11,208 | No (Manual) | ⚠️ Evaluate |

---

## Candidate 1: Development Workflow.md (16,093 tokens)

### Current State
- **Always loaded**: Yes (Layer 2)
- **Session start impact**: 41.1% of session start load
- **Content structure**: Multiple distinct sections with conditional loading markers

### Identified Sections

| Section | Estimated Tokens | Load Frequency | Split Potential |
|---------|------------------|----------------|-----------------|
| Task Completion Workflow | ~800 | Every task | Keep (core) |
| Quality Standards | ~300 | Every task | Keep (core) |
| Hook System Usage | ~200 | Every task | Keep (core) |
| Agent Hook Dependency Chains | ~2,500 | Debugging only | **High** |
| Troubleshooting | ~3,000 | Debugging only | **High** |
| Kiro Agent Hook Integration | ~4,000 | Setup/debugging | **High** |
| File Organization sections | ~2,000 | Organization tasks | **Medium** |
| Release Detection sections | ~2,500 | Release tasks | **Medium** |

### Split Recommendation: ✅ YES - HIGH PRIORITY

**Rationale**:
- **41.1% of session start load** - highest impact always-loaded document
- Contains extensive conditional sections already marked with "📖 CONDITIONAL SECTION"
- Troubleshooting and hook debugging content rarely needed during normal tasks
- Consolidation proposals (Task 6.2) already recommend moving content out

**Proposed Split Structure**:

```
Development Workflow.md (CORE - Always Loaded)
├── Task Completion Workflow (~800 tokens)
├── Quality Standards (~300 tokens)
├── Hook System Usage (~200 tokens)
├── Brief priming for conditional content (~200 tokens)
└── MCP query directions to split-out docs

Process-Hook-Troubleshooting.md (NEW - Manual)
├── Agent Hook Dependency Chains
├── Troubleshooting procedures
├── Common issues and solutions
└── ~5,500 tokens

Process-Hook-Integration.md (NEW - Manual)
├── Kiro Agent Hook Integration
├── Automatic File Organization details
├── Automatic Release Detection details
└── ~4,000 tokens
```

**Estimated Impact**:
- **Current**: 16,093 tokens always loaded
- **After split**: ~1,500 tokens always loaded (core content only)
- **Token savings**: ~14,500 tokens removed from session start
- **Session start reduction**: 37% reduction in session start load

**⚠️ INTERACTION WITH CONSOLIDATION PROPOSALS**:
- Consolidation Proposal 2 (Release Detection) moves content to Release Management System.md
- Consolidation Proposal 3 (File Organization) removes duplicated content
- Consolidation Proposal 4 (Completion Docs) creates new Completion Documentation Guide.md
- **Net effect**: After consolidation, Development Workflow.md may be ~3,000-4,000 tokens
- **Recommendation**: Execute consolidation FIRST, then evaluate if further splitting needed

---

## Candidate 2: File Organization Standards.md (16,680 tokens)

### Current State
- **Always loaded**: Yes (Layer 2)
- **Session start impact**: 42.6% of session start load
- **Content structure**: Multiple conditional sections with clear markers

### Identified Sections

| Section | Estimated Tokens | Load Frequency | Split Potential |
|---------|------------------|----------------|-----------------|
| Required Metadata Fields | ~1,500 | Every task | Keep (core) |
| Directory Structure | ~1,000 | Every task | Keep (core) |
| Organization Implementation | ~2,000 | Organization tasks | **Medium** |
| File Organization Scope | ~1,500 | Debugging only | **High** |
| Cross-Reference Standards | ~4,000 | Documentation tasks | **High** |
| Anti-Patterns | ~2,000 | Documentation tasks | **Medium** |
| Organization Decision Guidelines | ~1,500 | New file creation | **Medium** |

### Split Recommendation: ⚠️ CONDITIONAL - MEDIUM PRIORITY

**Rationale**:
- **42.6% of session start load** - highest impact always-loaded document
- Contains extensive conditional sections already marked
- Cross-Reference Standards section is large (~4,000 tokens) and only needed for documentation tasks
- However, metadata fields and directory structure are frequently referenced

**Proposed Split Structure**:

```
File Organization Standards.md (CORE - Always Loaded)
├── Required Metadata Fields (~1,500 tokens)
├── Directory Structure (~1,000 tokens)
├── Brief priming for conditional content (~300 tokens)
└── MCP query directions to split-out docs

Process-Cross-Reference-Standards.md (NEW - Manual)
├── Cross-Reference Standards
├── Common Cross-Reference Patterns
├── Anti-Patterns to Avoid
└── ~6,000 tokens

Process-File-Organization-Advanced.md (NEW - Manual)
├── Organization Implementation details
├── File Organization Scope
├── Organization Decision Guidelines
└── ~5,000 tokens
```

**Estimated Impact**:
- **Current**: 16,680 tokens always loaded
- **After split**: ~2,800 tokens always loaded (core content only)
- **Token savings**: ~13,800 tokens removed from session start
- **Session start reduction**: 35% reduction in session start load

**⚠️ CONCERNS**:
- Cross-reference standards are frequently needed during documentation tasks
- Splitting may increase navigation overhead for documentation-heavy work
- **Recommendation**: Consider keeping Cross-Reference Standards in core if documentation tasks are common

---

## Candidate 3: Spec Planning Standards.md (27,135 tokens)

### Current State
- **Always loaded**: No (Manual - MCP query)
- **Session start impact**: None (not always loaded)
- **Content structure**: Large document with distinct sections per spec document type

### Identified Sections

| Section | Estimated Tokens | Load Frequency | Split Potential |
|---------|------------------|----------------|-----------------|
| Requirements Document Format | ~6,000 | Requirements creation | **High** |
| Design Document Format | ~8,000 | Design creation | **High** |
| Tasks Document Format | ~5,000 | Tasks creation | **High** |
| Task Type Classification | ~3,000 | Tasks creation | **Medium** |
| Validation Tiers | ~2,000 | All spec work | Keep (core) |
| Documentation Tiers | ~2,000 | All spec work | Keep (core) |

### Split Recommendation: ❌ NO - LOW PRIORITY

**Rationale**:
- **Not always loaded** - no session start impact
- MCP already enables section-level queries (`get_section`)
- Splitting would fragment related spec planning content
- Current structure allows agents to query specific sections as needed

**Why NOT to split**:
1. **MCP query precision already works**: Agents can query `get_section({ heading: "Requirements Document Format" })` without loading full doc
2. **Related content**: Requirements, Design, and Tasks formats are related - agents often need multiple sections
3. **Maintenance burden**: Splitting would create 3-4 new files to maintain
4. **No session start benefit**: Document is manual-load only

**Alternative Recommendation**: Keep as single document, rely on MCP section queries

---

## Candidate 4: Test Development Standards.md (16,485 tokens)

### Current State
- **Always loaded**: No (Manual - MCP query)
- **Session start impact**: None (not always loaded)
- **Content structure**: Testing patterns organized by category

### Identified Sections

| Section | Estimated Tokens | Load Frequency | Split Potential |
|---------|------------------|----------------|-----------------|
| Test Categories | ~2,000 | Test planning | Keep (core) |
| Web Component Testing Patterns | ~4,000 | Web component tests | **Medium** |
| Linting and Testing Integration | ~3,000 | CI/CD setup | **Medium** |
| Integrated Workflow Examples | ~3,000 | Test implementation | **Medium** |
| Stemma System Validators | ~2,000 | Component tests | **Medium** |

### Split Recommendation: ❌ NO - LOW PRIORITY

**Rationale**:
- **Not always loaded** - no session start impact
- MCP section queries provide adequate precision
- Testing content is cohesive - splitting would fragment related patterns
- Agents working on tests typically need multiple sections

**Why NOT to split**:
1. **No session start benefit**: Manual-load document
2. **Cohesive content**: Testing patterns are interrelated
3. **MCP precision sufficient**: Section queries work well for this document

---

## Candidate 5: Test Failure Audit Methodology.md (14,845 tokens)

### Current State
- **Always loaded**: No (Manual - MCP query)
- **Session start impact**: None (not always loaded)
- **Content structure**: Audit workflow with distinct phases

### Identified Sections

| Section | Estimated Tokens | Load Frequency | Split Potential |
|---------|------------------|----------------|-----------------|
| Audit Workflow Steps | ~4,000 | Audit tasks | Keep (core) |
| Clean Exit Audit Requirement | ~2,000 | Spec completion | **Medium** |
| Performance Investigation Protocol | ~3,000 | Performance issues | **High** |
| Categorization Framework | ~3,000 | Audit tasks | Keep (core) |

### Split Recommendation: ❌ NO - LOW PRIORITY

**Rationale**:
- **Not always loaded** - no session start impact
- Performance Investigation Protocol could theoretically be split, but it's contextually related to audit methodology
- MCP section queries provide adequate precision

**Why NOT to split**:
1. **No session start benefit**: Manual-load document
2. **Contextual cohesion**: Performance investigation is part of audit methodology
3. **Low usage frequency**: Audit methodology is used infrequently

---

## Candidate 6: Component Development and Practices Guide.md (11,208 tokens)

### Current State
- **Always loaded**: No (Manual - MCP query)
- **Session start impact**: None (not always loaded)
- **Content structure**: Component development guidance with Token Selection Framework

### Identified Sections

| Section | Estimated Tokens | Load Frequency | Split Potential |
|---------|------------------|----------------|-----------------|
| Token Selection Decision Framework | ~3,000 | Component development | Keep (core) |
| Component Architecture Patterns | ~2,500 | Component development | Keep (core) |
| Platform-Specific Guidance | ~2,500 | Platform work | **Medium** |
| Best Practices | ~2,000 | Component development | Keep (core) |

### Split Recommendation: ❌ NO - LOW PRIORITY

**Rationale**:
- **Not always loaded** - no session start impact
- Token Selection Decision Framework is the most-queried section
- Content is cohesive for component development tasks
- MCP section queries provide adequate precision

---

## Summary: Split Candidates

### High Priority (Session Start Impact)

| Document | Current Tokens | After Split | Savings | Priority |
|----------|----------------|-------------|---------|----------|
| Development Workflow.md | 16,093 | ~1,500 | ~14,500 | **HIGH** |
| File Organization Standards.md | 16,680 | ~2,800 | ~13,800 | **MEDIUM** |

### Low Priority (No Session Start Impact)

| Document | Tokens | Recommendation | Rationale |
|----------|--------|----------------|-----------|
| Spec Planning Standards.md | 27,135 | ❌ No split | MCP section queries sufficient |
| Test Development Standards.md | 16,485 | ❌ No split | Cohesive content, MCP sufficient |
| Test Failure Audit Methodology.md | 14,845 | ❌ No split | Low usage, MCP sufficient |
| Component Development Guide.md | 11,208 | ❌ No split | Cohesive content, MCP sufficient |

---

## Interaction with Consolidation Proposals

**CRITICAL**: File split decisions should be made AFTER consolidation proposals are executed.

### Consolidation Impact on Development Workflow.md

| Consolidation Proposal | Token Impact | Effect on Split Decision |
|------------------------|--------------|--------------------------|
| Proposal 2: Release Detection | -1,100 tokens | Reduces split urgency |
| Proposal 3: File Organization | -720 tokens | Reduces split urgency |
| Proposal 4: Completion Docs | -160 tokens | Minor impact |
| **Total Consolidation** | **-1,980 tokens** | **Significant reduction** |

**Post-Consolidation Estimate**: Development Workflow.md would be ~14,100 tokens after consolidation.

**Recommendation**: 
1. Execute consolidation proposals FIRST
2. Re-evaluate split need after consolidation
3. If still >10,000 tokens, proceed with split

### Consolidation Impact on File Organization Standards.md

| Consolidation Proposal | Token Impact | Effect on Split Decision |
|------------------------|--------------|--------------------------|
| Proposal 4: Completion Docs | -320 tokens | Minor impact |
| **Total Consolidation** | **-320 tokens** | **Minor reduction** |

**Post-Consolidation Estimate**: File Organization Standards.md would be ~16,360 tokens after consolidation.

**Recommendation**: Split decision largely unaffected by consolidation. Evaluate independently.

---

## Recommended Execution Order

Based on analysis, recommend the following execution order:

### Phase 1: Consolidation (Prerequisite)
1. Execute Consolidation Proposal 2 (Release Detection)
2. Execute Consolidation Proposal 3 (File Organization)
3. Execute Consolidation Proposal 4 (Completion Docs)
4. Measure post-consolidation token counts

### Phase 2: Split Evaluation (Post-Consolidation)
1. Re-measure Development Workflow.md token count
2. If >10,000 tokens, proceed with split
3. Evaluate File Organization Standards.md split independently

### Phase 3: Split Execution (If Approved)
1. Split Development Workflow.md (if still needed)
2. Split File Organization Standards.md (if approved)
3. Update all cross-references
4. Re-index MCP server

---

## Human Decisions Required at Checkpoint 2

1. **Development Workflow.md Split**: 
   - A) Execute split as proposed
   - B) Execute consolidation first, then re-evaluate
   - C) No split - accept current size

2. **File Organization Standards.md Split**:
   - A) Execute split as proposed
   - B) Keep Cross-Reference Standards in core (partial split)
   - C) No split - accept current size

3. **Execution Order**:
   - A) Consolidation first, then split evaluation
   - B) Split first, then consolidation
   - C) Execute both in parallel

**Recommendation**: Option A for all decisions - consolidation first provides clearer picture of actual split needs.

---

## Notes

- All split recommendations are candidates pending human approval per Requirements 10.5
- Token estimates are approximate based on section analysis
- MCP section queries provide alternative to splitting for manual-load documents
- Session start impact is the primary driver for split priority
- Consolidation proposals should be executed before final split decisions
