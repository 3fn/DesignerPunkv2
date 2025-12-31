---
inclusion: manual
---

# Release Management System

**Date**: 2025-12-30
**Purpose**: Conceptual mental model of the release management system for AI agents
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 2
**Relevant Tasks**: task-completion, release-related-work

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

*This steering document provides the mental model for understanding releases. For operational details, see Development Workflow.*
