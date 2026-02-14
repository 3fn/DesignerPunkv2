---
inclusion: manual
name: Completion-Documentation-Guide
description: Comprehensive completion and summary documentation guide — two-document workflow, documentation tiers, naming conventions, document templates, and cross-references. Load when creating completion docs, writing summary docs, or completing parent tasks.
---

# Completion Documentation Guide

**Date**: 2026-01-03
**Purpose**: Comprehensive guide for creating completion and summary documentation
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 2
**Relevant Tasks**: all-tasks

---

## Overview

This guide consolidates all guidance for creating completion documentation, including:
- When to create completion docs (subtasks vs parent tasks)
- What content to include (documentation tiers)
- Where to place files (directory structure)
- How to name files (naming conventions)
- Why summary docs matter (release detection)

**Key Principle**: Parent task completion requires TWO documents - a detailed completion doc for internal knowledge preservation and a summary doc for release detection and public-facing release notes.

---

## Two-Document Workflow

### Why Two Documents?

Parent task completion produces two complementary documents:

| Document Type | Location | Purpose | Audience |
|---------------|----------|---------|----------|
| **Detailed Completion Doc** | `.kiro/specs/[spec-name]/completion/` | Comprehensive internal documentation | Internal team, knowledge preservation |
| **Summary Doc** | `docs/specs/[spec-name]/` | Concise, commit-style summary | Public-facing, release notes, hook trigger |

**Rationale**:
- **Hook Triggering**: The `.kiro/` directory is filtered from Kiro IDE's file watching system. Summary documents in `docs/specs/` enable automatic release detection.
- **Dual Purpose**: Summary documents serve both as hook triggers and as concise, public-facing release note content.
- **Clear Separation**: Detailed completion docs (internal knowledge preservation) remain in `.kiro/`, while summaries (public-facing) live in `docs/`.

### When to Create Each Document

| Task Type | Detailed Completion Doc | Summary Doc |
|-----------|------------------------|-------------|
| **Subtask** | ✅ Required | ❌ Not required |
| **Parent Task** | ✅ Required (Tier 3) | ✅ Required |
| **Setup Task** | ✅ Required (Tier 1) | ❌ Not required (unless parent) |
| **Documentation Task** | ✅ Required (Tier 1) | ❌ Not required (unless parent) |
| **Implementation Task** | ✅ Required (Tier 2) | ❌ Not required (unless parent) |
| **Architecture Task** | ✅ Required (Tier 3) | ❌ Not required (unless parent) |

**Key Rule**: Summary docs are ONLY created for parent tasks, not subtasks.

---

## Documentation Tiers

Documentation tiers define the depth and comprehensiveness of completion documentation based on task type.

### Quick Reference

| Tier | Task Types | Documentation Depth |
|------|------------|---------------------|
| **Tier 1: Minimal** | Setup, Documentation | Artifact verification, basic notes |
| **Tier 2: Standard** | Implementation | Functional validation, implementation details |
| **Tier 3: Comprehensive** | Architecture, Parent Tasks | Full validation, architecture decisions, lessons learned |

### Tier Details

**For complete tier definitions and templates**, query Spec Planning Standards via MCP:

```
get_section({ path: ".kiro/steering/Process-Spec-Planning.md", heading: "Three-Tier Completion Documentation System" })
```

---

## Naming Conventions

### Detailed Completion Documents

**Location**: `.kiro/specs/[spec-name]/completion/`

| Task Type | Naming Pattern | Example |
|-----------|----------------|---------|
| Parent Task | `task-N-completion.md` | `task-1-completion.md` |
| Subtask | `task-N-M-completion.md` | `task-1-1-completion.md`, `task-2-3-completion.md` |

**Examples**:
```
.kiro/specs/cross-platform-build-system/completion/
├── task-1-completion.md           # Parent task 1 completion
├── task-1-1-completion.md         # Subtask 1.1 completion
├── task-1-2-completion.md         # Subtask 1.2 completion
├── task-2-completion.md           # Parent task 2 completion
├── task-2-1-completion.md         # Subtask 2.1 completion
└── task-2-2-completion.md         # Subtask 2.2 completion
```

### Summary Documents

**Location**: `docs/specs/[spec-name]/`

| Document Type | Naming Pattern | Example |
|---------------|----------------|---------|
| Parent Task Summary | `task-N-summary.md` | `task-1-summary.md`, `task-10-summary.md` |

**Hook Pattern**: `**/task-*-summary.md` - must have "task-" prefix and "-summary.md" suffix

**Examples**:
```
docs/specs/cross-platform-build-system/
├── task-1-summary.md              # Parent task 1 summary
├── task-2-summary.md              # Parent task 2 summary
└── task-10-summary.md             # Parent task 10 summary
```

---

## Directory Structure

### Two-Directory Structure

```
docs/specs/[spec-name]/                   # Public-facing documentation (TRIGGERS HOOKS)
├── task-1-summary.md                     # ✅ Parent task summary (triggers release detection)
├── task-2-summary.md                     # ✅ Parent task summary (triggers release detection)
└── task-N-summary.md                     # ✅ Parent task summary (triggers release detection)

.kiro/specs/[spec-name]/                  # Internal documentation (NO HOOK TRIGGERS)
├── requirements.md                        # ❌ Spec requirements (no hook trigger)
├── design.md                             # ❌ Spec design (no hook trigger)
├── tasks.md                              # ❌ Implementation tasks (no hook trigger)
└── completion/                           # ❌ Completion documentation (no hook trigger)
    ├── task-1-completion.md              # Parent task detailed docs
    ├── task-1-1-completion.md            # Subtask completion docs
    ├── task-1-2-completion.md            # Subtask completion docs
    └── task-2-completion.md              # Parent task detailed docs
```

### Key Distinctions

| Location | Purpose | Hook Trigger | Audience |
|----------|---------|--------------|----------|
| `docs/specs/[spec-name]/` | Concise summaries | ✅ Yes | Public-facing, release notes |
| `.kiro/specs/[spec-name]/completion/` | Comprehensive docs | ❌ No | Internal, knowledge preservation |

---

## Document Templates

### Detailed Completion Document (Tier 2 Example)

```markdown
# Task N.M Completion: [Task Title]

**Date**: YYYY-MM-DD
**Task**: N.M [Task description from tasks.md]
**Type**: Implementation
**Status**: Complete

---

## Artifacts Created

- `path/to/file1.ts` - Description of what was created
- `path/to/file2.ts` - Description of what was created

## Implementation Details

### Approach

[Describe the implementation approach taken]

### Key Decisions

[Document any significant decisions made during implementation]

### Integration Points

[Describe how this integrates with other components]

## Validation (Tier 2: Standard)

### Syntax Validation
- ✅ TypeScript compilation passes
- ✅ ESLint passes

### Functional Validation
- ✅ [Specific test or validation performed]
- ✅ [Another validation]

### Requirements Compliance
- ✅ Requirement X.Y: [How it was satisfied]
```

### Summary Document Template

```markdown
# Task N Summary: [Brief Task Title]

**Date**: YYYY-MM-DD
**Purpose**: Concise summary of parent task completion
**Organization**: spec-summary
**Scope**: [spec-name]

## What Was Done

[2-3 sentences describing what was implemented]

## Why It Matters

[1-2 sentences on business value or technical benefit]

## Key Changes

- [Change 1]
- [Change 2]
- [Change 3]

## Impact

- ✅ [Positive impact 1]
- ✅ [Positive impact 2]

---

*For detailed implementation notes, see [task-N-completion.md](../../.kiro/specs/[spec-name]/completion/task-N-completion.md)*
```

---

## Cross-References

### From Summary to Detailed Docs

Summary documents should include a link to the detailed completion document at the end:

```markdown
---

*For detailed implementation notes, see [task-N-completion.md](../../.kiro/specs/[spec-name]/completion/task-N-completion.md)*
```

**Example** from `docs/specs/release-detection-trigger-fix/task-1-summary.md`:
```markdown
---

*For detailed implementation notes, see [task-1-completion.md](../../.kiro/specs/release-detection-trigger-fix/completion/task-1-completion.md)*
```

### From Detailed Docs to Summary (Optional)

Detailed completion documents can optionally link to the summary document:

```markdown
## Related Documentation

- [Task N Summary](../../../../docs/specs/[spec-name]/task-N-summary.md) - Public-facing summary that triggered release detection
```

### Relative Path Calculation

| From | To | Path |
|------|-----|------|
| Summary → Detailed | `docs/specs/[spec]/` → `.kiro/specs/[spec]/completion/` | `../../.kiro/specs/[spec]/completion/task-N-completion.md` |
| Detailed → Summary | `.kiro/specs/[spec]/completion/` → `docs/specs/[spec]/` | `../../../../docs/specs/[spec]/task-N-summary.md` |

---

## Release Detection Integration

### How Summary Documents Trigger Release Detection

1. **Summary document created** in `docs/specs/[spec-name]/`
2. **Kiro IDE detects** file creation (for manual files only)
3. **Release detection hook** triggers automatically
4. **Release manager** scans for completion documents
5. **Trigger files** created in `.kiro/release-triggers/`

### Hook Limitation

Kiro IDE's `fileCreated` hooks only trigger for **manual file operations through the IDE UI**, not for programmatically created files by AI agents.

**Hybrid Approach**:
- ✅ **Manual file creation**: Hook triggers automatically
- ❌ **AI-created files**: Requires manual trigger

### Manual Trigger for AI Workflows

After AI agent creates summary document:

```bash
./.kiro/hooks/release-manager.sh auto
```

**Verification**:
```bash
# Check trigger files created
ls -la .kiro/release-triggers/

# Check release manager log
tail -20 .kiro/logs/release-manager.log
```

---

## Common Mistakes to Avoid

### ❌ Wrong Summary Document Location

```bash
# WRONG - This won't trigger hooks (.kiro/ directory is filtered)
.kiro/specs/[spec-name]/task-1-summary.md

# CORRECT - This triggers hooks
docs/specs/[spec-name]/task-1-summary.md
```

### ❌ Wrong Naming Format

```bash
# WRONG - These don't match hook pattern
task-1-1-summary.md      # Subtask format
task-1-completion.md     # Completion doc format
summary-task-1.md        # Wrong order

# CORRECT - Matches **/task-*-summary.md pattern
task-1-summary.md
task-10-summary.md
```

### ❌ Creating Summary for Subtasks

Summary documents are ONLY for parent tasks. Subtasks only need detailed completion docs.

### ❌ Forgetting Manual Trigger for AI Workflows

If AI agent created the summary document, you MUST run:
```bash
./.kiro/hooks/release-manager.sh auto
```

---

## Workflow Checklist

### For Subtasks

- [ ] Complete subtask work
- [ ] Create detailed completion doc: `.kiro/specs/[spec-name]/completion/task-N-M-completion.md`
- [ ] Mark subtask complete using `taskStatus` tool
- [ ] STOP and wait for user authorization

### For Parent Tasks

- [ ] Complete all subtasks first
- [ ] Run validation (`npm test` or `npm run test:all`)
- [ ] Create detailed completion doc: `.kiro/specs/[spec-name]/completion/task-N-completion.md`
- [ ] Create summary doc: `docs/specs/[spec-name]/task-N-summary.md`
- [ ] Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
- [ ] Mark parent task complete using `taskStatus` tool
- [ ] Commit changes: `./.kiro/hooks/commit-task.sh "Task N Complete: Description"`
- [ ] STOP and wait for user authorization

---

## Related Documentation

- **Spec Planning Standards** - Documentation tier definitions and templates
- **Development Workflow** - Task completion workflow steps
- **File Organization Standards** - Metadata and directory structure
- **Release Management System** - Release detection pipeline

**MCP Queries**:
```
get_section({ path: ".kiro/steering/Process-Spec-Planning.md", heading: "Three-Tier Completion Documentation System" })
get_section({ path: ".kiro/steering/Process-Development-Workflow.md", heading: "Task Completion Workflow" })
get_section({ path: ".kiro/steering/Release Management System.md", heading: "Release Pipeline Architecture" })
```
