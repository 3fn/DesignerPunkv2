---
inclusion: manual
---

# Release Management System

**Date**: 2026-02-28
**Last Updated**: 2026-02-28
**Purpose**: Mental model of the release management system for AI agents
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 2
**Relevant Tasks**: task-completion, release-related-work

---

## Overview

The release tool is an on-demand CLI at `src/tools/release/`. It replaces the previous 203-file system with a focused pipeline: discover summary docs since last git tag → extract structured changes → classify by priority → recommend version bump → generate markdown release notes → optionally create GitHub release.

**Key principles:**
- Runs on-demand only. No timers, no hooks, no passive file generation.
- Git tags are the only persistent state. No state files, no caches, no history accumulation.
- Human-reviewed before publishing. The tool recommends; Peter decides.

---

## Architecture

```
CLI Entry Point (src/tools/release/cli/release-tool.ts)
  ├── analyze  → ReleasePipeline.analyze()
  ├── notes    → ReleasePipeline.generateNotes()
  └── release  → ReleasePipeline.release()

ReleasePipeline (src/tools/release/cli/ReleasePipeline.ts)
  ├── TagResolver        — git describe --tags --abbrev=0
  ├── SummaryScanner     — git log + glob docs/specs/*/task-*-summary.md
  ├── ChangeExtractor    — parse summary doc markdown sections
  ├── ChangeClassifier   — map to 🔴 breaking / 🟡 prominent / 🔵 context
  ├── NotesRenderer      — markdown generation (public + internal)
  └── GitHubPublisher    — git tag + GitHub release creation
```

---

## CLI Commands

| Command | What It Does | When to Use |
|---------|-------------|-------------|
| `npm run release:analyze` | Scan changes since last tag, display recommendation | Check what's accumulated |
| `npm run release:notes` | Generate markdown release notes to `docs/releases/` | Preview release content |
| `npm run release:run` | Full release: notes + tag + GitHub publish | Actual release |
| `npm run release:run -- --dry-run` | Preview release without tagging or publishing | Pre-release check |

Shell wrapper: `./.kiro/hooks/release-manager.sh analyze|notes|release`

---

## AI Agent Decision Points

### 1. Summary Document Quality
Release notes are generated from summary docs. Better summaries → better release notes.
- **What Was Done** → becomes the change description
- **Key Changes** → becomes the bullet points
- **Deliverables** → drives priority classification (🔴/🟡/🔵)

### 2. Deliverables Section
When present, the `## Deliverables *(optional)*` section drives classification directly:
- `🔴` → breaking/consumer-facing → major bump
- `🟡` → ecosystem → minor bump
- `🔵` → internal/context → patch bump

When absent, keyword heuristics apply (less accurate, human-reviewed anyway).

### 3. Summary Document Location
Must be `docs/specs/[spec-name]/task-N-summary.md` — the scanner looks here via git log.

---

## Post-Commit Analysis

`commit-task.sh` runs `release:analyze` after each task commit (non-blocking, fails silently). This provides immediate feedback on accumulated change significance. Skip with `--no-analyze` flag.

---

*For operational task completion workflow, see Process-Development-Workflow.md.*
