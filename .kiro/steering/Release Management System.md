---
inclusion: manual
---

# Release Management System

**Date**: 2025-12-30
**Last Updated**: 2026-01-03
**Purpose**: Conceptual mental model of the release management system for AI agents
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 2
**Relevant Tasks**: task-completion, release-related-work

---

## AI Agent Reading Priorities

**This document provides the conceptual mental model for release management. Read strategically based on your current task.**

### WHEN Completing Tasks (Most Common)
**Focus on:**
- **Overview** - Understand the release pipeline purpose
- **AI Agent Decision Points** - Know how your work affects releases
- **Manual Trigger Commands** - Know when and how to trigger release detection

**Skip:** Hook troubleshooting sections unless experiencing issues

### WHEN Debugging Release Issues
**Focus on:**
- **Hook Troubleshooting** - Release-specific troubleshooting
- **Agent Hook Dependency Chains** - Understand hook execution order
- **Manual Trigger Commands** - Fallback commands when automation fails

**Also query Development Workflow** for comprehensive hook troubleshooting:
```
get_section({ path: ".kiro/steering/Development Workflow.md", heading: "Hook Troubleshooting" })
```

### WHEN Understanding Release Architecture
**Focus on:**
- **Release Pipeline Architecture** - Visual flow diagram
- **Key Concepts** - Completion docs, summary docs, triggers, version bumps
- **Release Flow** - Step-by-step journey from task to release

---

## Document Structure

| Section | Purpose | When to Read |
|---------|---------|--------------|
| Overview | Core purpose and key insight | Always |
| Release Pipeline Architecture | Visual flow diagram | Understanding architecture |
| Key Concepts | Definitions and roles | Reference as needed |
| Release Flow | Step-by-step journey | Understanding process |
| Automation vs Manual | What requires action | Task completion |
| AI Agent Decision Points | How your work affects releases | Task completion |
| Boundary with Development Workflow | Document scope clarification | When confused about which doc to use |
| Agent Hook Dependency Chains | Hook execution order | Debugging hook issues |
| Hook Troubleshooting | Release-specific troubleshooting | Debugging release issues |
| Manual Trigger Commands | Fallback commands | Task completion, debugging |

---

## Overview

The Release Management System automates the journey from completed work to published releases. It transforms task completion documentation into versioned releases with generated release notes, following semantic versioning principles.

**Core Purpose**: Enable AI agents to understand how their task completion work feeds into the release pipeline without needing to read operational documentation.

**Key Insight**: Your work on tasks creates a documentation trail that the release system uses to determine version bumps and generate release notes automatically.

---

## Release Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        RELEASE PIPELINE FLOW                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐              │
│  │    Task      │    │   Summary    │    │   Release    │              │
│  │  Completion  │───►│   Document   │───►│  Detection   │              │
│  │              │    │   Created    │    │   Triggered  │              │
│  └──────────────┘    └──────────────┘    └──────────────┘              │
│         │                                       │                       │
│         │                                       ▼                       │
│         │                              ┌──────────────┐                 │
│         │                              │   Release    │                 │
│         │                              │   Analysis   │                 │
│         │                              │   Engine     │                 │
│         │                              └──────────────┘                 │
│         │                                       │                       │
│         ▼                                       ▼                       │
│  ┌──────────────┐                      ┌──────────────┐                 │
│  │   Detailed   │                      │   Version    │                 │
│  │  Completion  │─────────────────────►│    Bump     │                 │
│  │     Doc      │   (content source)   │  Calculated  │                 │
│  └──────────────┘                      └──────────────┘                 │
│                                               │                         │
│                                               ▼                         │
│                                        ┌──────────────┐                 │
│                                        │   Release    │                 │
│                                        │    Notes     │                 │
│                                        │  Generated   │                 │
│                                        └──────────────┘                 │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Pipeline Components**:
- **Task Completion**: AI agent completes work and creates documentation
- **Summary Document**: Concise summary triggers release detection
- **Detailed Completion Doc**: Comprehensive documentation provides content for release notes
- **Release Detection**: System detects new completion and initiates analysis
- **Release Analysis Engine**: Scans completion docs, determines version bump type
- **Version Bump**: Semantic version calculated based on change type
- **Release Notes**: Generated from completion document content

---

## Key Concepts

### Completion Documents
The detailed record of what was implemented. Contains:
- Changes made (features, fixes, improvements)
- Breaking changes (if any)
- Validation results
- Implementation notes

**Role in Pipeline**: Source of truth for release note content and version bump decisions.

### Summary Documents
Concise, commit-style summaries of parent task completion. Contains:
- What was done (brief)
- Why it matters
- Key changes (bullet points)

**Role in Pipeline**: Triggers release detection when created in watched directories.

### Release Triggers
Events that initiate release analysis:
- **Summary Document Creation**: Primary trigger for parent task completion
- **Manual Trigger**: Explicit command when automatic detection doesn't apply
- **Spec Completion**: All tasks in a spec completed

### Version Bumps (Semantic Versioning)
The system determines version changes based on completion document content:

| Change Type | Version Impact | Example |
|-------------|----------------|---------|
| Breaking Changes | Major (X.0.0) | API signature changes, removed features |
| New Features | Minor (0.X.0) | New components, new capabilities |
| Bug Fixes | Patch (0.0.X) | Corrections, minor improvements |

### Release Notes
Auto-generated documentation of what's in a release:
- Aggregated from completion documents
- Organized by change type (Breaking, Features, Fixes)
- Public-facing release documentation

---

## Release Flow

The journey from completed work to published release:

```
1. TASK COMPLETION
   └── AI agent completes task work
       └── Creates detailed completion doc (.kiro/specs/[spec]/completion/)
       └── Creates summary doc (docs/specs/[spec]/)

2. RELEASE DETECTION
   └── Summary doc creation triggers detection (automatic or manual)
       └── System identifies new completion documents
       └── Queues documents for analysis

3. RELEASE ANALYSIS
   └── Engine scans completion documents
       └── Identifies change types (breaking, feature, fix)
       └── Calculates appropriate version bump
       └── Aggregates content for release notes

4. VERSION BUMP
   └── Semantic version updated based on analysis
       └── Major: Breaking changes present
       └── Minor: New features, no breaking changes
       └── Patch: Bug fixes only

5. RELEASE NOTES GENERATION
   └── Content extracted from completion docs
       └── Organized by change category
       └── Formatted for public consumption
```

---

## Automation vs Manual

Understanding what's automated helps you know when action is required.

### Automated (No Action Needed)
- **Release detection** from summary documents (for manual file operations)
- **Version bump calculation** based on change types
- **Release notes generation** from completion documents
- **Content aggregation** across multiple completion docs

### Requires AI Agent Action
- **Creating completion documents** with proper structure
- **Creating summary documents** in correct location
- **Triggering release detection** for AI-created files (manual trigger required)
- **Documenting breaking changes** explicitly in completion docs
- **Validating release notes** accuracy before publication

### Requires Human Action
- **Approving major version bumps** (breaking changes)
- **Publishing releases** to external systems
- **Reviewing generated release notes** for accuracy
- **Deciding release timing** for coordinated releases

---

## AI Agent Decision Points

When completing tasks, you make decisions that affect releases:

### 1. Change Classification
**Decision**: How do you classify the changes in your completion document?
- Mark breaking changes explicitly → Triggers major version bump
- Document as new feature → Triggers minor version bump
- Document as fix/improvement → Triggers patch version bump

**Impact**: Incorrect classification leads to wrong version bumps.

### 2. Completion Document Quality
**Decision**: How thoroughly do you document the changes?
- Detailed documentation → Better release notes
- Sparse documentation → Incomplete release notes

**Impact**: Release notes quality depends on completion doc quality.

### 3. Summary Document Creation
**Decision**: Do you create the summary document in the correct location?
- `docs/specs/[spec]/` → Triggers automatic detection (manual files only)
- `.kiro/specs/[spec]/` → Does NOT trigger detection

**Impact**: Wrong location means release detection doesn't trigger automatically.

### 4. Manual Trigger Decision
**Decision**: When do you run the manual release detection trigger?
- After AI-created summary documents → Required for detection
- After manual file operations → Optional (automatic works)

**Impact**: Skipping manual trigger for AI-created files means no release detection.

---

## Boundary with Development Workflow

This document provides the **conceptual mental model**. Development Workflow provides the **operational mechanics**.

### This Document Covers (Conceptual)
- How the release pipeline works architecturally
- What each component does and why
- Where AI agents make decisions affecting releases
- What's automated vs what requires action

### Development Workflow Covers (Operational)
- Specific hook commands and syntax
- File paths and directory structures
- Step-by-step task completion workflow
- Troubleshooting hook issues
- File watching behavior details

**When to use which**:
- **Understanding releases**: Read this document
- **Executing task completion**: Follow Development Workflow
- **Debugging release issues**: Check Development Workflow troubleshooting

---

## Agent Hook Dependency Chains

Understanding how hooks depend on each other is critical for reliable release detection.

### Current Hook Chain

```
Task Completion Event (taskStatusChange: completed)
    ↓
File Organization Hook (organize-after-task.sh)
    - Requires user confirmation
    - 10-minute timeout
    - Scans root directory for files with Organization metadata
    ↓
Release Detection Hook (release-manager.sh)
    - Auto-approve (no confirmation)
    - 5-minute timeout
    - runAfter: ["organize-after-task-completion"]
    - Detects completion documents and creates release triggers
```

### Configuration Example

```json
{
  "name": "Release Detection on Task Completion",
  "trigger": {
    "type": "fileCreated",
    "patterns": ["**/task-*-summary.md"]
  },
  "settings": {
    "runAfter": ["organize-after-task-completion"]
  }
}
```

The `runAfter` field specifies that release detection waits for file organization to complete before executing.

### Dependency Chain Behavior

| Scenario | Prerequisite Hook | Dependent Hook (Release Detection) |
|----------|-------------------|-----------------------------------|
| Success | Completes normally | Executes immediately after |
| Failure | Exits with error | Does NOT execute |
| Timeout | Forcibly terminated | Does NOT execute |
| User Cancels | Exits without action | Likely does NOT execute |

**Key Insight**: If release detection doesn't run, check the prerequisite hook (file organization) first. The root cause is usually there.

### Verification Commands

```bash
# Check if hooks triggered
grep "Hook triggered" .kiro/logs/file-organization.log
grep "Hook triggered" .kiro/logs/release-manager.log

# Compare timestamps to verify execution order
tail -20 .kiro/logs/file-organization.log
tail -20 .kiro/logs/release-manager.log

# Check for errors in prerequisite hook
grep "ERROR\|Failed" .kiro/logs/file-organization.log
```

### When Dependency Chain Breaks

If release detection doesn't execute after task completion:

1. **Check prerequisite hook logs** - Look for errors or timeout messages
2. **Verify hook configuration** - Ensure `runAfter` references correct hook name
3. **Use manual trigger** - Run `./.kiro/hooks/release-manager.sh auto` as fallback

**For detailed troubleshooting scenarios** (failure, timeout, cancellation), see Development Workflow's "Agent Hook Dependency Chains" section.

---

## Hook Troubleshooting

This section provides troubleshooting guidance specific to release management hooks. For general hook troubleshooting, see Development Workflow.

### Release Detection Not Triggering

**Symptoms**:
- Completed parent task but no release detection occurred
- No entry in `.kiro/logs/release-manager.log`
- No trigger files created in `.kiro/release-triggers/`

**Quick Diagnostic**:
```bash
# Check if release detection hook triggered
grep "Hook triggered" .kiro/logs/release-manager.log

# Check for trigger files
ls -la .kiro/release-triggers/

# Verify summary document exists in correct location
ls -la docs/specs/[spec-name]/task-*-summary.md
```

### Common Causes and Solutions

#### 1. Summary Document in Wrong Location

**Problem**: Summary document created in `.kiro/` instead of `docs/`

```bash
# WRONG - .kiro/ directory is filtered from file watching
.kiro/specs/[spec-name]/task-1-summary.md

# CORRECT - triggers automatic detection
docs/specs/[spec-name]/task-1-summary.md
```

**Solution**: Move to correct location or use manual trigger:
```bash
# Option 1: Move the file
mv .kiro/specs/[spec-name]/task-1-summary.md docs/specs/[spec-name]/task-1-summary.md

# Option 2: Manual trigger
./.kiro/hooks/release-manager.sh auto
```

#### 2. AI-Created Files Don't Trigger Automatic Hooks

**Problem**: Kiro IDE file watching only triggers for manual file operations, not AI-created files.

**Solution**: Always run manual trigger after AI creates summary documents:
```bash
./.kiro/hooks/release-manager.sh auto
```

**This is expected behavior** - add manual trigger to your task completion workflow.

#### 3. Incorrect File Naming

**Problem**: Summary document doesn't match hook pattern `**/task-*-summary.md`

```bash
# Correct format (triggers hook)
task-1-summary.md
task-2-summary.md

# Wrong format (doesn't trigger)
task-1-1-summary.md    # Subtask format
task-1-completion.md   # Completion doc format
summary-task-1.md      # Wrong order
```

**Solution**: Rename to correct format.

#### 4. Prerequisite Hook Failed

**Problem**: File organization hook failed, preventing release detection from running.

**Diagnostic**:
```bash
# Check file organization completed
grep "Organization complete" .kiro/logs/file-organization.log

# Check for errors
grep "ERROR\|Failed" .kiro/logs/file-organization.log
```

**Solution**: Fix prerequisite hook issue, then run manual trigger.

### Release Analysis Failures

**Symptoms**:
- Release detection triggered but no version bump calculated
- Error messages in release manager log
- Trigger files created but no release generated

**Diagnostic**:
```bash
# Check release manager log for errors
cat .kiro/logs/release-manager.log

# Verify completion documents exist
ls -la .kiro/specs/[spec-name]/completion/

# Check release analysis output
ls -la .kiro/release-analysis/
```

**Common Causes**:
- Completion documents missing or malformed
- Breaking change markers not recognized
- Release analysis script errors

### Quick Reference: Diagnostic Commands

```bash
# Release detection status
grep "Hook triggered" .kiro/logs/release-manager.log
ls -la .kiro/release-triggers/

# Prerequisite hook status
grep "Hook triggered" .kiro/logs/file-organization.log
grep "Organization complete" .kiro/logs/file-organization.log

# Manual trigger (always works)
./.kiro/hooks/release-manager.sh auto

# Verify summary document location
ls -la docs/specs/[spec-name]/task-*-summary.md
```

### When to Use Manual Trigger

**Always use manual trigger when**:
- AI agent created the summary document
- Automatic detection didn't run
- Testing release detection independently
- After manual git commits that should trigger release analysis

**Manual trigger command**:
```bash
./.kiro/hooks/release-manager.sh auto
```

**For comprehensive hook troubleshooting** (general issues, dependency chains, configuration validation), see Development Workflow's "Hook Troubleshooting" section.

---

## Manual Trigger Commands

When automatic hook triggering doesn't apply or fails, use these manual commands to trigger release management operations.

### Primary Commands

#### Release Detection (Most Common)

```bash
# Trigger release detection manually
./.kiro/hooks/release-manager.sh auto

# Verify it executed
cat .kiro/logs/release-manager.log
ls -la .kiro/release-triggers/
```

**When to use**:
- After AI agent creates summary documents (required - automatic hooks don't trigger for AI-created files)
- When automatic detection didn't run
- After manual git commits that should trigger release analysis
- Testing release detection independently

#### File Organization (Prerequisite)

```bash
# Run file organization directly
./.kiro/agent-hooks/organize-by-metadata.sh

# Verify files were organized
ls -la strategic-framework/
ls -la .kiro/specs/[spec-name]/completion/
```

**When to use**:
- When file organization hook didn't trigger
- Before running release detection manually (ensures files are in correct locations)
- Testing file organization independently

### Command Reference Table

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `./.kiro/hooks/release-manager.sh auto` | Trigger release detection | After AI creates summary docs, when automatic detection fails |
| `./.kiro/agent-hooks/organize-by-metadata.sh` | Organize files by metadata | When file organization hook didn't run |
| `./.kiro/hooks/commit-task.sh "Task Name"` | Commit task completion | After all task work is complete |

### Verification Commands

After running manual triggers, verify the operations completed successfully:

```bash
# Verify release detection ran
grep "Hook triggered" .kiro/logs/release-manager.log
grep "Release detection complete" .kiro/logs/release-manager.log

# Check trigger files were created
ls -la .kiro/release-triggers/

# Verify file organization ran
grep "Organization complete" .kiro/logs/file-organization.log

# Check for any errors
grep "ERROR\|Failed" .kiro/logs/release-manager.log
grep "ERROR\|Failed" .kiro/logs/file-organization.log
```

### Workflow Integration

**Standard Task Completion with Manual Triggers**:

```bash
# 1. Complete task work (implementation, documentation)

# 2. Create detailed completion doc
#    Location: .kiro/specs/[spec-name]/completion/task-N-completion.md

# 3. Create summary doc
#    Location: docs/specs/[spec-name]/task-N-summary.md

# 4. Trigger release detection (REQUIRED for AI-created files)
./.kiro/hooks/release-manager.sh auto

# 5. Commit changes
./.kiro/hooks/commit-task.sh "Task N Complete: Description"
```

**Key Point**: Step 4 is required when AI creates the summary document. Automatic hooks only trigger for manual file operations in the IDE.

### Troubleshooting Manual Triggers

**If manual trigger fails**:

1. **Check script permissions**:
   ```bash
   ls -la .kiro/hooks/release-manager.sh
   # Should show: -rwxr-xr-x
   
   # Fix if needed:
   chmod +x .kiro/hooks/release-manager.sh
   ```

2. **Check dependencies**:
   ```bash
   which npm && npm --version
   which node && node --version
   ```

3. **Review error logs**:
   ```bash
   cat .kiro/logs/release-manager.log
   ```

4. **Verify file paths**:
   ```bash
   # Ensure summary doc exists
   ls -la docs/specs/[spec-name]/task-*-summary.md
   
   # Ensure completion doc exists
   ls -la .kiro/specs/[spec-name]/completion/task-*-completion.md
   ```

**If trigger runs but no release detected**:

1. **Check summary document location** - Must be in `docs/specs/`, not `.kiro/specs/`
2. **Check file naming** - Must match pattern `task-*-summary.md`
3. **Check completion document exists** - Release analysis needs content source

---

*This steering document provides the mental model for understanding releases. For operational details, see Development Workflow.*
