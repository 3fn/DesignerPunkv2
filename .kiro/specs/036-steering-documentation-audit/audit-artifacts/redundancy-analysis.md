# Redundancy Analysis Report

**Date**: 2026-01-03
**Spec**: 036 - Steering Documentation Audit
**Status**: Discovery Phase - Task 3.2 Complete (Classification)

---

## Cross-Reference Analysis Summary

### MCP Cross-Reference Query Results

| Document | Cross-References Found | Notes |
|----------|----------------------|-------|
| 00-Steering Documentation Directional Priorities.md | 0 | Uses `#[[file:...]]` syntax not detected by MCP |
| Core Goals.md | 0 | Minimal cross-references |
| Development Workflow.md | 0 | Self-contained with extensive internal sections |
| File Organization Standards.md | 80 | Heavy cross-referencing (mostly examples) |
| Spec Planning Standards.md | 6 | Cross-references to completion docs |
| Component Development and Practices Guide.md | 6 | References to related guides |
| Test Failure Audit Methodology.md | 3 | References to related process docs |
| Browser Distribution Guide.md | 3 | References to related docs |
| Release Management System.md | 0 | Self-contained |
| Component Quick Reference.md | 0 | Self-contained |
| Token Quick Reference.md | 0 | Self-contained |
| Test Development Standards.md | 0 | Self-contained |
| A Vision of the Future.md | 0 | Self-contained |
| Personal Note.md | 0 | Self-contained |
| Start Up Tasks.md | 0 | Self-contained |

---

## Topics Appearing in Multiple Documents

### Topic 1: Task Completion Workflow

**Documents containing this topic:**
1. **Development Workflow.md** - Comprehensive coverage (~500+ lines)
2. **Start Up Tasks.md** - Checklist format (~50 lines)
3. **Release Management System.md** - Pipeline context (~30 lines)
4. **File Organization Standards.md** - Organization context (~20 lines)
5. **Spec Planning Standards.md** - Validation context (~30 lines)

**Overlap Assessment:**
- Development Workflow.md is the canonical source with full detail
- Start Up Tasks.md provides checklist priming (acceptable)
- Release Management System.md provides pipeline context (acceptable)
- File Organization Standards.md provides organization context (acceptable)
- Spec Planning Standards.md provides validation context (acceptable)

#### Classification: ✅ INTENTIONAL PRIMING (Acceptable)

**Rationale:**
- **Start Up Tasks.md**: Provides a quick checklist (~50 lines) that orients agents to *what* steps to follow without explaining *how* each step works. This is classic priming - it tells you what to do and points to Development Workflow for the how. Length is appropriate (checklist format, not prose duplication).
- **Release Management System.md**: Provides pipeline context (~30 lines) explaining *why* task completion triggers release detection. This is purpose-based priming that helps agents understand the system without duplicating operational details.
- **File Organization Standards.md**: Provides organization context (~20 lines) explaining *what* happens to files after task completion. Brief, purpose-focused.
- **Spec Planning Standards.md**: Provides validation context (~30 lines) explaining *what* validation tier applies. Brief, purpose-focused.

**Verdict**: All secondary documents provide appropriate priming (3-4 sentences or checklist items) that orient agents before directing to Development Workflow.md as the canonical source. No consolidation needed.

---

### Topic 2: Validation Tiers (Tier 1/2/3)

**Documents containing this topic:**
1. **Spec Planning Standards.md** - Comprehensive definition (~200 lines)
2. **Task-Type-Definitions.md** - Per-task-type definitions (~100 lines)
3. **Development Workflow.md** - Brief references (~10 lines)
4. **File Organization Standards.md** - Brief references (~5 lines)
5. **behavioral-contract-validation-framework.md** - Different tier system (~50 lines)

**Overlap Assessment:**
- Spec Planning Standards.md is the canonical source
- Task-Type-Definitions.md duplicates tier definitions per task type
- behavioral-contract-validation-framework.md uses same tier names for different purpose

#### Classification: ⚠️ HARMFUL REDUNDANCY (Consolidation Candidate)

**Rationale:**
- **Task-Type-Definitions.md**: Contains ~100 lines of validation tier definitions that duplicate Spec Planning Standards.md. This is detailed content duplication, not priming. Each task type section repeats the full tier definition rather than referencing the canonical source. This creates maintenance burden - if tier definitions change, both documents need updating.
- **behavioral-contract-validation-framework.md**: Uses "Tier 1/2/3" naming for a completely different validation system (behavioral contracts vs documentation). This is a naming collision that could cause confusion, not redundancy per se.
- **Development Workflow.md** and **File Organization Standards.md**: Brief references (~5-10 lines) are acceptable priming.

**Proposed Action:**
1. **Task-Type-Definitions.md**: Replace detailed tier definitions with brief priming + MCP query direction to Spec Planning Standards.md
2. **behavioral-contract-validation-framework.md**: Consider renaming tiers to avoid collision (e.g., "Contract Validation Level 1/2/3")

**Canonical Source**: Spec Planning Standards.md

---

### Topic 3: Token Selection

**Documents containing this topic:**
1. **Component Development and Practices Guide.md** - Token Selection Decision Framework (~100 lines)
2. **Token Quick Reference.md** - Token routing (~50 lines)
3. **Core Goals.md** - Brief reference (~5 lines)
4. **Multiple token guides** (layering, glow, shadow, border, etc.) - AI Agent Token Selection Guidance sections

**Overlap Assessment:**
- Component Development and Practices Guide.md is the canonical source
- Token Quick Reference.md provides routing (acceptable priming)
- Token guides provide domain-specific guidance (acceptable specialization)

#### Classification: ✅ INTENTIONAL PRIMING (Acceptable)

**Rationale:**
- **Token Quick Reference.md**: Provides routing guidance (~50 lines) that tells agents *what* token type to use and *where* to find detailed guidance. This is purpose-based priming - it answers "which token family?" without explaining "how to implement?". Length is appropriate for a routing document.
- **Core Goals.md**: Brief reference (~5 lines) establishes the principle "prioritize design tokens over hard-coded values" without explaining the decision framework. Classic priming.
- **Token guides (layering, glow, shadow, etc.)**: Each provides domain-specific "AI Agent Token Selection Guidance" sections that specialize the general framework for their specific token type. This is appropriate specialization, not duplication - each guide adds unique domain knowledge.

**Verdict**: Well-structured hierarchy with clear canonical source (Component Development Guide) and appropriate priming/specialization in supporting documents. No consolidation needed.

---

### Topic 4: Release Detection

**Documents containing this topic:**
1. **Development Workflow.md** - Comprehensive hook integration (~300 lines)
2. **Release Management System.md** - Pipeline overview (~100 lines)
3. **File Organization Standards.md** - Hook trigger context (~50 lines)
4. **Start Up Tasks.md** - Checklist items (~10 lines)
5. **component-family-development-standards.md** - Family completion context (~20 lines)

**Overlap Assessment:**
- Development Workflow.md has operational details (hooks, troubleshooting)
- Release Management System.md has conceptual overview (pipeline, decisions)
- Significant overlap in explaining the same concepts from different angles

#### Classification: ⚠️ HARMFUL REDUNDANCY (Consolidation Candidate)

**Rationale:**
- **Development Workflow.md** (~300 lines): Contains extensive release detection content including hook configuration, troubleshooting, dependency chains, and manual trigger commands. This is detailed *how* content.
- **Release Management System.md** (~100 lines): Contains pipeline overview, AI agent decision points, and release detection concepts. This is also detailed *how* content, just from a different angle.
- **The problem**: Both documents explain the same system in detail. An agent reading Development Workflow gets one explanation; an agent reading Release Management System gets another. This creates:
  - Maintenance burden (changes need updating in both places)
  - Potential inconsistency (explanations may drift apart)
  - Confusion about which document is authoritative

**Proposed Action:**
1. **Designate canonical source**: Release Management System.md should be the canonical source for release detection *concepts* and *pipeline architecture*
2. **Development Workflow.md**: Should contain only operational priming (~3-4 sentences) + MCP query direction to Release Management System.md for detailed guidance
3. **Keep troubleshooting in Development Workflow**: Hook troubleshooting is operational and belongs in workflow context

**Human Decision Required**: Which document should be canonical for release detection? Options:
- A) Release Management System.md (conceptual home)
- B) Development Workflow.md (operational home)
- C) Split: concepts in Release Management, operations in Development Workflow

---

### Topic 5: File Organization

**Documents containing this topic:**
1. **File Organization Standards.md** - Comprehensive coverage (~1500 lines)
2. **Development Workflow.md** - Hook integration (~200 lines)
3. **Spec Planning Standards.md** - Completion doc organization (~50 lines)

**Overlap Assessment:**
- File Organization Standards.md is the canonical source
- Development Workflow.md duplicates organization concepts in hook context
- Significant overlap in explaining metadata-driven organization

#### Classification: ⚠️ HARMFUL REDUNDANCY (Consolidation Candidate)

**Rationale:**
- **Development Workflow.md** (~200 lines): Contains extensive file organization content including:
  - Automatic File Organization section explaining the workflow
  - File Organization Scope section explaining root-only scanning
  - Kiro IDE File Watching Behavior section explaining directory filtering
  - These are detailed *how* explanations that duplicate File Organization Standards.md
- **File Organization Standards.md** (~1500 lines): The canonical source with comprehensive coverage of all organization concepts.
- **The problem**: Development Workflow.md contains ~200 lines of file organization content that largely duplicates File Organization Standards.md. This is not priming (too detailed) - it's content duplication.

**Proposed Action:**
1. **Development Workflow.md**: Replace detailed file organization sections with brief priming (~3-4 sentences) + MCP query direction to File Organization Standards.md
2. **Keep hook integration context**: Brief explanation of how hooks trigger organization is appropriate priming
3. **Remove duplicated content**: File Organization Scope, Kiro IDE File Watching Behavior sections should reference File Organization Standards.md

**Canonical Source**: File Organization Standards.md

**Estimated Token Savings**: ~200 lines × ~4 tokens/line = ~800 tokens from Development Workflow.md

---

### Topic 6: Completion Documentation

**Documents containing this topic:**
1. **File Organization Standards.md** - Organization and naming (~100 lines)
2. **Development Workflow.md** - Workflow steps (~50 lines)
3. **Spec Planning Standards.md** - Documentation tiers (~150 lines)
4. **Start Up Tasks.md** - Checklist items (~20 lines)
5. **Release Management System.md** - Pipeline context (~30 lines)

**Overlap Assessment:**
- Multiple documents explain completion doc creation from different angles
- No single canonical source - distributed across workflow, organization, and spec planning

#### Classification: ⚠️ HARMFUL REDUNDANCY (Consolidation Candidate)

**Rationale:**
- **The fragmentation problem**: Completion documentation is explained in 5 different documents, each providing partial information:
  - File Organization Standards.md: Where to put files, naming conventions
  - Development Workflow.md: When to create, workflow steps
  - Spec Planning Standards.md: What content to include, documentation tiers
  - Start Up Tasks.md: Checklist reminder
  - Release Management System.md: Why it matters for release detection
- **No single source of truth**: An agent asking "how do I create a completion document?" must consult multiple documents to get the full picture. This is harmful because:
  - Increases cognitive load
  - Risk of missing information
  - Potential for inconsistent guidance across documents

**Proposed Action:**
1. **Designate canonical source**: Spec Planning Standards.md should be the canonical source for completion documentation (it already has the most comprehensive content about *what* to include)
2. **File Organization Standards.md**: Keep naming conventions and directory structure (organization-specific)
3. **Development Workflow.md**: Replace with brief priming + MCP query direction
4. **Start Up Tasks.md**: Keep checklist items (appropriate priming)
5. **Release Management System.md**: Keep pipeline context (appropriate priming)

**Human Decision Required**: Should completion documentation guidance be consolidated into Spec Planning Standards.md, or should a new dedicated document be created?

---

### Topic 7: Summary Documents

**Documents containing this topic:**
1. **File Organization Standards.md** - Organization and naming (~80 lines)
2. **Development Workflow.md** - Workflow steps and troubleshooting (~100 lines)
3. **Release Management System.md** - Pipeline trigger (~30 lines)
4. **Start Up Tasks.md** - Checklist items (~10 lines)

**Overlap Assessment:**
- Similar to completion documentation - fragmented explanation
- Development Workflow has most operational detail
- File Organization Standards has naming conventions

#### Classification: ⚠️ HARMFUL REDUNDANCY (Consolidation Candidate)

**Rationale:**
- **Same fragmentation problem as completion docs**: Summary document creation is explained across 4 documents with no single source of truth.
- **Development Workflow.md** (~100 lines): Contains detailed explanation of summary documents including:
  - Why two documents (summary + detailed)
  - Hook triggering behavior
  - Troubleshooting for release detection not triggering
  - This is detailed *how* content, not priming
- **File Organization Standards.md** (~80 lines): Contains naming conventions, cross-reference patterns, and organization metadata. Also detailed *how* content.
- **The overlap**: Both documents explain the two-document workflow (summary + detailed) in detail. An agent gets the same explanation twice.

**Proposed Action:**
1. **Consolidate with completion documentation**: Summary documents are part of the completion documentation workflow - they should be explained together
2. **File Organization Standards.md**: Keep naming conventions and directory structure only
3. **Development Workflow.md**: Replace with brief priming + MCP query direction
4. **Release Management System.md**: Keep pipeline context (appropriate priming)

**Canonical Source**: Should be consolidated with completion documentation in Spec Planning Standards.md

**Estimated Token Savings**: ~100 lines from Development Workflow.md + ~50 lines from File Organization Standards.md = ~600 tokens

---

### Topic 8: MCP Query Patterns

**Documents containing this topic:**
1. **00-Steering Documentation Directional Priorities.md** - Query examples (~100 lines)
2. **Component Quick Reference.md** - MCP Query Examples section (~30 lines)
3. **component-family-inheritance-structures.md** - Query examples per family (~50 lines)
4. **component-readiness-status-system.md** - MCP Query Examples section (~20 lines)

**Overlap Assessment:**
- Meta-guide provides general MCP query patterns
- Component docs provide domain-specific examples
- Some duplication of basic query syntax

#### Classification: ✅ INTENTIONAL PRIMING (Acceptable)

**Rationale:**
- **00-Steering Documentation Directional Priorities.md** (~100 lines): Provides general MCP query patterns and teaches agents *how* to use the MCP documentation server. This is the canonical source for MCP query methodology.
- **Component Quick Reference.md** (~30 lines): Provides domain-specific examples for component queries. This is appropriate specialization - it shows *what* to query for components, not *how* MCP works.
- **component-family-inheritance-structures.md** (~50 lines): Provides family-specific query examples. Appropriate specialization for component family context.
- **component-readiness-status-system.md** (~20 lines): Provides readiness-specific query examples. Appropriate specialization.

**Why this is acceptable priming, not harmful redundancy:**
- Each document provides domain-specific examples that add unique value
- The basic query syntax repetition is minimal (~5 lines per document)
- Domain-specific examples help agents understand *what* to query in their specific context
- This follows the priming guideline: "enough context to understand *what* to query"

**Verdict**: Well-structured hierarchy with general methodology in meta-guide and domain-specific examples in specialized documents. No consolidation needed.

---

## Harmful Redundancy (Consolidation Candidates)

| Content Topic | Documents | Proposed Canonical Source | Estimated Token Savings |
|---------------|-----------|---------------------------|------------------------|
| Validation Tiers | Spec Planning Standards.md, Task-Type-Definitions.md | Spec Planning Standards.md | ~400 tokens |
| Release Detection | Development Workflow.md, Release Management System.md | TBD - Human Decision Required | ~300 tokens |
| File Organization in Workflow | Development Workflow.md, File Organization Standards.md | File Organization Standards.md | ~800 tokens |
| Completion Documentation | File Organization Standards.md, Development Workflow.md, Spec Planning Standards.md | Spec Planning Standards.md (consolidate) | ~200 tokens |
| Summary Documents | File Organization Standards.md, Development Workflow.md, Release Management System.md | Consolidate with Completion Docs | ~600 tokens |

**Total Estimated Token Savings**: ~2,300 tokens (primarily from Development Workflow.md)

---

## Intentional Priming (Acceptable)

| Content Topic | Priming Location | Canonical Source | Priming Length | Classification Rationale |
|---------------|------------------|------------------|----------------|-------------------------|
| Task Completion | Start Up Tasks.md | Development Workflow.md | ~50 lines (checklist) | Checklist format, not prose duplication |
| Task Completion | Release Management System.md | Development Workflow.md | ~30 lines (pipeline context) | Purpose-based: explains *why* not *how* |
| Task Completion | File Organization Standards.md | Development Workflow.md | ~20 lines | Brief organization context |
| Task Completion | Spec Planning Standards.md | Development Workflow.md | ~30 lines | Brief validation context |
| Token Selection | Core Goals.md | Component Development Guide.md | ~5 lines | Principle statement only |
| Token Selection | Token Quick Reference.md | Component Development Guide.md | ~50 lines (routing) | Routing guidance, not implementation |
| Token Selection | Token guides (layering, glow, etc.) | Component Development Guide.md | Varies | Domain-specific specialization |
| MCP Queries | Component Quick Reference.md | Meta-guide | ~30 lines (domain examples) | Domain-specific examples |
| MCP Queries | component-family-inheritance-structures.md | Meta-guide | ~50 lines (family examples) | Family-specific examples |
| MCP Queries | component-readiness-status-system.md | Meta-guide | ~20 lines | Readiness-specific examples |

---

## Cross-Reference Analysis

### Documents with High Cross-Reference Counts

**File Organization Standards.md (80 references)**
- Most references are example patterns in documentation
- Many are template examples showing how to format cross-references
- Not actual navigation links - teaching examples

### Documents with Moderate Cross-Reference Counts

**Spec Planning Standards.md (6 references)**
- References to completion doc templates
- Appropriate for spec planning context

**Component Development and Practices Guide.md (6 references)**
- References to related guides (Token Resolution Patterns, Cross-Platform Decision Framework)
- Appropriate for component development context

**Test Failure Audit Methodology.md (3 references)**
- References to Development Workflow, File Organization Standards, Spec Planning Standards
- Appropriate for audit methodology context

**Browser Distribution Guide.md (3 references)**
- References to Technology Stack, Component Development Guide, Token System Overview
- Appropriate for browser distribution context

---

## Redundancy Classification Criteria

### Harmful Redundancy
- Detailed content duplicated across multiple documents
- Creates maintenance burden (updates needed in multiple places)
- Risk of inconsistency between copies
- **Action**: Consolidate to single canonical source

### Intentional Priming
- Light context that orients before directing to canonical source
- Purpose-based: explains *what* and *why* to query, not *how*
- ~3-4 sentences max before MCP query direction
- **Action**: Keep as acceptable priming

---

## Key Findings Summary

### High-Priority Consolidation Candidates

1. **Development Workflow.md is too large** (~16,000 tokens)
   - Contains extensive file organization content that duplicates File Organization Standards.md (~800 tokens)
   - Contains extensive release detection content that overlaps with Release Management System.md (~300 tokens)
   - Contains extensive completion/summary documentation that could be consolidated (~200 tokens)
   - **Total potential savings from Development Workflow.md**: ~1,300 tokens

2. **Completion/Summary Documentation is fragmented**
   - Explained in 4-5 different documents from different angles
   - No single source of truth for "how to create completion docs"
   - Creates confusion about which document to reference
   - **Recommendation**: Consolidate into Spec Planning Standards.md

3. **Validation Tiers defined in multiple places**
   - Spec Planning Standards.md has comprehensive definition
   - Task-Type-Definitions.md repeats definitions per task type (~400 tokens)
   - **Recommendation**: Replace Task-Type-Definitions.md content with priming + MCP query

4. **Release Detection has unclear canonical source**
   - Development Workflow.md has operational details
   - Release Management System.md has conceptual overview
   - **Human Decision Required**: Which should be canonical?

### Well-Structured Priming (No Action Needed)

1. **Token documentation hierarchy** - Token Quick Reference routes to specific guides
2. **MCP query examples** - Domain-specific examples in component docs
3. **Start Up Tasks checklist** - Appropriate priming for Development Workflow
4. **Task completion priming** - Brief context in supporting documents

### Classification Summary

| Classification | Topic Count | Action Required |
|---------------|-------------|-----------------|
| ✅ Intentional Priming | 3 topics | No action needed |
| ⚠️ Harmful Redundancy | 5 topics | Consolidation required |

---

## Recommendations

### Immediate Actions (No Human Decision Required)

1. **Task-Type-Definitions.md**: Replace detailed validation tier definitions with:
   ```markdown
   **Validation Tier**: See Spec Planning Standards.md for tier definitions
   Query: `get_section({ path: ".kiro/steering/Spec Planning Standards.md", heading: "Validation Tiers" })`
   ```

2. **Development Workflow.md - File Organization sections**: Replace with:
   ```markdown
   ## File Organization
   
   File organization is handled automatically via agent hooks. For detailed guidance on metadata-driven organization, naming conventions, and directory structure, query File Organization Standards via MCP.
   
   Query: `get_section({ path: ".kiro/steering/File Organization Standards.md", heading: "Organization Implementation" })`
   ```

### Human Decisions - APPROVED at Checkpoint 1

**Date Approved**: 2026-01-03

1. **Release Detection Canonical Source** ✅ DECIDED
   - **Decision**: Move operational troubleshooting FROM Development Workflow TO Release Management System
   - **Development Workflow keeps**: WHEN to trigger release detection + priming/MCP query to RMS
   - **Release Management System gets**: HOW to run it, operational troubleshooting, hook debugging, manual triggers
   - **Rationale**: Reduces Development Workflow load while making RMS the comprehensive operational guide

2. **Completion Documentation Consolidation** ✅ DECIDED
   - **Decision**: Create standalone "Completion Documentation Guide.md" (Layer 2, manual)
   - **Start Up Tasks**: Add checklist item "Query Completion Documentation Guide via MCP before starting any task from a Tasks doc"
   - **All other docs**: Priming + MCP query to the new guide
   - **Rationale**: Reduces Development Workflow load, ensures discoverability via Start Up Tasks checklist

3. **Tier Naming Collision** ✅ DECIDED
   - **Decision**: Rename behavioral contract validation to use "Basic/Extended/Full Contract Validation" (no numbered tiers)
   - **Documentation Validation**: Keeps "Tier 1/2/3" naming
   - **Rationale**: Eliminates collision, self-documenting terminology, AI agent optimal

---

## Consolidation Proposals (Task 6.2)

**Date**: 2026-01-03
**Status**: Analysis Phase - Proposals Pending Human Approval at Checkpoint 2

### Proposal 1: Validation Tiers Consolidation

**Canonical Source**: Task-Type-Definitions.md *(REVISED at Checkpoint 2)*

**Current State**:
- Spec Planning Standards.md: Comprehensive tier definitions (~200 lines, ~800 tokens)
- Task-Type-Definitions.md: Tier definitions per task type (~100 lines)

**Rationale for Revision**: Task-Type-Definitions was created specifically to make task type information more accessible because Spec Planning Standards is large (27,135 tokens). Making Task-Type-Definitions the canonical source improves discoverability.

**Proposed Changes**:

| Document | Current Content | Proposed Content | Token Impact |
|----------|-----------------|------------------|--------------|
| Task-Type-Definitions.md | Keep as-is (canonical source) | No change | 0 |
| Spec Planning Standards.md | Full tier definitions | Brief priming + MCP query direction | -800 tokens |

**Priming Template for Spec Planning Standards.md**:
```markdown
### Validation Tiers

Each task type has an associated validation tier. For complete tier definitions and requirements, query Task-Type-Definitions via MCP:

**MCP Query**: `get_section({ path: ".kiro/steering/Task-Type-Definitions.md", heading: "Validation Tiers" })`

**Quick Reference**:
- **Tier 1 (Minimal)**: Setup/Documentation tasks - artifact verification only
- **Tier 2 (Standard)**: Implementation tasks - functional validation
- **Tier 3 (Comprehensive)**: Architecture tasks - full validation suite
```

**Estimated Token Savings**: ~800 tokens from Spec Planning Standards.md

---

### Proposal 2: Release Detection Consolidation

**Canonical Source**: Release Management System.md (for operational details)

**Current State**:
- Development Workflow.md: ~300 lines of release detection content (hooks, troubleshooting, dependency chains)
- Release Management System.md: ~100 lines of pipeline overview

**Proposed Changes**:

| Document | Current Content | Proposed Content | Token Impact |
|----------|-----------------|------------------|--------------|
| Development Workflow.md | Extensive hook integration, troubleshooting, dependency chains (~300 lines) | Brief priming (~30 lines) + MCP query direction | -1,100 tokens |
| Release Management System.md | Pipeline overview only | Add operational troubleshooting, hook debugging, manual triggers | +800 tokens |

**Priming Template for Development Workflow.md**:
```markdown
## Release Detection

Release detection triggers automatically when parent task summary documents are created in `docs/specs/[spec-name]/`.

**Key Points**:
- Summary documents trigger automatic release detection (manual files only)
- AI-assisted workflows require manual trigger: `./.kiro/hooks/release-manager.sh auto`
- Hook depends on file organization completing first

**For detailed guidance** on release detection pipeline, troubleshooting, hook debugging, and manual triggers, query Release Management System via MCP:

**MCP Query**: `get_document_full({ path: ".kiro/steering/Release Management System.md" })`
```

**Content to Move to Release Management System.md**:
- Agent Hook Dependency Chains section
- Hook troubleshooting procedures
- Manual trigger commands
- Common issues and solutions for release detection

**Estimated Token Savings**: ~300 tokens net (1,100 removed from Dev Workflow, 800 added to RMS)

---

### Proposal 3: File Organization Consolidation

**Canonical Source**: File Organization Standards.md

**Current State**:
- Development Workflow.md: ~200 lines of file organization content (scope, Kiro IDE behavior, organization workflow)
- File Organization Standards.md: ~1,500 lines comprehensive coverage

**Proposed Changes**:

| Document | Current Content | Proposed Content | Token Impact |
|----------|-----------------|------------------|--------------|
| Development Workflow.md | File Organization Scope, Kiro IDE File Watching Behavior, Automatic File Organization sections (~200 lines) | Brief priming (~20 lines) + MCP query direction | -720 tokens |
| File Organization Standards.md | Keep as-is (canonical source) | No change | 0 |

**Priming Template for Development Workflow.md**:
```markdown
## File Organization

File organization is handled automatically via agent hooks when tasks are marked complete.

**Key Points**:
- Agent hook scans root directory for files with **Organization** metadata
- User confirmation required before moving files
- Cross-references updated automatically

**For detailed guidance** on metadata-driven organization, naming conventions, directory structure, and Kiro IDE file watching behavior, query File Organization Standards via MCP:

**MCP Query**: `get_section({ path: ".kiro/steering/File Organization Standards.md", heading: "Organization Implementation" })`
```

**Sections to Remove from Development Workflow.md**:
- "File Organization Scope" section
- "Kiro IDE File Watching Behavior" section
- Detailed "Automatic File Organization" content (keep brief priming)

**Estimated Token Savings**: ~720 tokens from Development Workflow.md

---

### Proposal 4: Completion Documentation Consolidation

**Canonical Source**: NEW - Completion Documentation Guide.md (to be created)

**Current State**:
- File Organization Standards.md: ~100 lines (naming, organization)
- Development Workflow.md: ~50 lines (workflow steps)
- Spec Planning Standards.md: ~150 lines (documentation tiers)
- Start Up Tasks.md: ~20 lines (checklist items)
- Release Management System.md: ~30 lines (pipeline context)

**Proposed Changes**:

| Document | Current Content | Proposed Content | Token Impact |
|----------|-----------------|------------------|--------------|
| NEW: Completion Documentation Guide.md | N/A | Comprehensive guide consolidating all completion doc guidance | +1,500 tokens |
| Development Workflow.md | Completion doc workflow steps (~50 lines) | Brief priming + MCP query | -160 tokens |
| File Organization Standards.md | Completion doc naming/organization (~100 lines) | Brief priming + MCP query | -320 tokens |
| Spec Planning Standards.md | Keep documentation tier content (canonical for tiers) | Add cross-reference to new guide | 0 |
| Start Up Tasks.md | Keep checklist items (appropriate priming) | Add MCP query reminder | +20 tokens |
| Release Management System.md | Keep pipeline context (appropriate priming) | No change | 0 |

**New Document Structure - Completion Documentation Guide.md**:
```markdown
# Completion Documentation Guide

**Date**: 2026-01-03
**Purpose**: Comprehensive guide for creating completion and summary documentation
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 2
**Relevant Tasks**: all-tasks

## Overview

This guide consolidates all guidance for creating completion documentation, including:
- When to create completion docs (subtasks vs parent tasks)
- What content to include (documentation tiers)
- Where to place files (directory structure)
- How to name files (naming conventions)
- Why summary docs matter (release detection)

## Two-Document Workflow

[Consolidated content explaining detailed completion docs + summary docs]

## Documentation Tiers

[Reference to Spec Planning Standards for tier definitions]

## Naming Conventions

[Consolidated from File Organization Standards]

## Directory Structure

[Consolidated from File Organization Standards]

## Cross-References

[Consolidated from File Organization Standards]

## Release Detection Integration

[Consolidated from Development Workflow and Release Management System]
```

**Priming Template for Development Workflow.md**:
```markdown
## Completion Documentation

After completing parent tasks, create both detailed completion docs and summary docs.

**Quick Reference**:
- **Detailed doc**: `.kiro/specs/[spec-name]/completion/task-N-completion.md`
- **Summary doc**: `docs/specs/[spec-name]/task-N-summary.md`

**For comprehensive guidance** on completion documentation workflow, naming conventions, and content requirements, query Completion Documentation Guide via MCP:

**MCP Query**: `get_document_full({ path: ".kiro/steering/Completion Documentation Guide.md" })`
```

**Addition to Start Up Tasks.md**:
```markdown
6. **CRITICAL: Query Completion Documentation Guide Before Task Execution**
   
   **WHEN starting any task from a Tasks doc THEN you MUST:**
   - Query Completion Documentation Guide via MCP
   - Understand completion doc requirements for your task type
   
   **MCP Query**: `get_document_full({ path: ".kiro/steering/Completion Documentation Guide.md" })`
```

**Estimated Token Impact**: +1,040 tokens net (1,500 new guide - 460 removed from other docs)

**Rationale**: While this adds tokens overall, it:
1. Creates a single source of truth (reduces confusion)
2. Removes fragmented guidance from always-loaded docs (Development Workflow, File Organization Standards)
3. Makes completion doc guidance discoverable via Start Up Tasks checklist
4. Reduces cognitive load for agents (one place to look)

---

### Proposal 5: Tier Naming Collision Resolution

**Canonical Source**: Spec Planning Standards.md (for documentation validation tiers)

**Current State**:
- Spec Planning Standards.md: Uses "Tier 1/2/3" for documentation validation
- behavioral-contract-validation-framework.md: Uses "Tier 1/2/3" for behavioral contract validation

**Proposed Changes**:

| Document | Current Content | Proposed Content | Token Impact |
|----------|-----------------|------------------|--------------|
| behavioral-contract-validation-framework.md | "Tier 1/2/3" naming | "Basic/Extended/Full Contract Validation" | ~0 (rename only) |
| Spec Planning Standards.md | Keep "Tier 1/2/3" naming | No change | 0 |

**Renaming Mapping**:
| Current Name | New Name |
|--------------|----------|
| Tier 1 Contract Validation | Basic Contract Validation |
| Tier 2 Contract Validation | Extended Contract Validation |
| Tier 3 Contract Validation | Full Contract Validation |

**Estimated Token Impact**: ~0 (terminology change, not content reduction)

**Rationale**: Eliminates naming collision that could confuse AI agents. Self-documenting terminology ("Basic/Extended/Full") is clearer than numbered tiers.

---

## Consolidation Summary

### Token Impact Summary

| Proposal | Source Document | Token Change | Net Impact |
|----------|-----------------|--------------|------------|
| 1. Validation Tiers | Task-Type-Definitions.md | -400 | -400 |
| 2. Release Detection | Development Workflow.md | -1,100 | |
| 2. Release Detection | Release Management System.md | +800 | -300 |
| 3. File Organization | Development Workflow.md | -720 | -720 |
| 4. Completion Docs | NEW: Completion Documentation Guide.md | +1,500 | |
| 4. Completion Docs | Development Workflow.md | -160 | |
| 4. Completion Docs | File Organization Standards.md | -320 | |
| 4. Completion Docs | Start Up Tasks.md | +20 | +1,040 |
| 5. Tier Naming | behavioral-contract-validation-framework.md | ~0 | ~0 |
| **TOTAL** | | | **-380 tokens** |

### Session Start Load Impact

**Current Session Start Load**: 39,124 tokens

**Changes to Always-Loaded Documents**:
- Development Workflow.md: -1,980 tokens (release detection + file organization + completion docs)
- File Organization Standards.md: -320 tokens (completion docs)
- Start Up Tasks.md: +20 tokens (MCP query reminder)

**Projected Session Start Load**: 36,844 tokens (-2,280 tokens, -5.8%)

### MCP Query Directions Summary

| Topic | MCP Query |
|-------|-----------|
| Validation Tiers | `get_section({ path: ".kiro/steering/Spec Planning Standards.md", heading: "Validation Tiers" })` |
| Release Detection | `get_document_full({ path: ".kiro/steering/Release Management System.md" })` |
| File Organization | `get_section({ path: ".kiro/steering/File Organization Standards.md", heading: "Organization Implementation" })` |
| Completion Documentation | `get_document_full({ path: ".kiro/steering/Completion Documentation Guide.md" })` |

---

## Notes

- Cross-reference analysis completed using MCP `list_cross_references()` on all key documents (Task 3.1)
- Topic overlap identified through grep searches across steering documentation (Task 3.1)
- Classification follows priming guidelines from Requirements 3.3-3.4 (Task 3.2)
- Priming guideline applied: purpose-based (what/why vs how) + ~3-4 sentences max
- Consolidation recommendations require human approval at Checkpoint 2
- Estimated total token savings from consolidation: ~2,300 tokens

### Classification Methodology

**Harmful Redundancy Criteria Applied:**
- Detailed content duplicated (not just brief mentions)
- Creates maintenance burden (updates needed in multiple places)
- Risk of inconsistency between copies
- Content explains *how* to do something, not just *what* or *why*

**Intentional Priming Criteria Applied:**
- Light context that orients before directing to canonical source
- Purpose-based: explains *what* and *why* to query, not *how*
- ~3-4 sentences max before MCP query direction
- Domain-specific specialization that adds unique value
