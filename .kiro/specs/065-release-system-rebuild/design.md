# Design Document: Release System Rebuild

**Date**: 2026-02-27
**Spec**: 065 - Release System Rebuild
**Status**: Design Phase
**Dependencies**: None

---

## Overview

A CLI tool in `.kiro/tools/release/` that replaces the existing 203-file release system with a focused pipeline: discover summary docs since last git tag → extract structured changes → classify by deliverable taxonomy → recommend version bump → generate markdown release notes → create GitHub release (human-approved).

The tool runs on-demand only. No timers, no hooks, no passive file generation.

---

## Architecture

```
CLI Entry Point
  ├── analyze command → ReleasePipeline.analyze()
  ├── notes command   → ReleasePipeline.generateNotes()
  └── release command → ReleasePipeline.release()

ReleasePipeline
  ├── TagResolver        — git describe --tags --abbrev=0
  ├── SummaryScanner     — git log + glob docs/specs/*/task-*-summary.md
  ├── ChangeExtractor    — parse summary doc sections + optional Deliverables field
  ├── ChangeClassifier   — map to 🔴/🟡/🔵 taxonomy
  ├── VersionCalculator  — (extracted) semver recommendation from classified changes
  ├── NotesRenderer      — markdown generation from classified changes
  └── GitHubPublisher    — (extracted) git tag + GitHub release creation
```

No state files. No caches. No history accumulation. Git tags are the only persistent state.

---

## Components and Interfaces

### TagResolver

```typescript
interface TagInfo {
  tag: string;        // e.g., "v7.0.0"
  commit: string;     // commit hash the tag points to
  date: string;       // tag creation date
}

interface ITagResolver {
  getLatestTag(): Promise<TagInfo | null>;
  createTag(version: string, message: string): Promise<void>;
}
```

Wraps `git describe --tags --abbrev=0` and `git tag -a`. Returns null when no tags exist (triggers full scan).

### SummaryScanner

```typescript
interface SummaryDoc {
  path: string;           // e.g., "docs/specs/063-uniform-contract-system/task-1-summary.md"
  specName: string;       // e.g., "063-uniform-contract-system"
  taskNumber: number;     // e.g., 1
  raw: string;            // full file content
}

interface ISummaryScanner {
  findSummariesSinceTag(tag: TagInfo | null): Promise<SummaryDoc[]>;
}
```

When tag exists: `git log --diff-filter=A --name-only v7.0.0..HEAD -- "docs/specs/*/task-*-summary.md"`. When no tag: glob all matching files.

### ChangeExtractor

```typescript
interface ExtractedChange {
  specName: string;
  taskTitle: string;
  taskType: string;
  whatWasDone: string;
  whyItMatters: string;
  keyChanges: string[];
  impact: string[];
  deliverables?: DeliverableEntry[];  // from optional ## Deliverables section
}

interface DeliverableEntry {
  priority: '🔴' | '🟡' | '🔵';
  type: string;
  description: string;
}

interface IChangeExtractor {
  extract(doc: SummaryDoc): ExtractedChange;
}
```

Parses markdown sections by heading. If `## Deliverables` exists, parses structured entries. Otherwise extracts from What/Impact sections.

### ChangeClassifier

```typescript
type Priority = 'breaking' | 'prominent' | 'context';

interface ClassifiedChange {
  change: ExtractedChange;
  priority: Priority;
  deliverableType: string;
}

interface IChangeClassifier {
  classify(changes: ExtractedChange[]): ClassifiedChange[];
}
```

When `deliverables` field exists on the change, uses it directly. Otherwise applies keyword heuristics against the taxonomy (token → 🔴, component → 🔴, tool → 🟡, governance → 🔵, etc.). Heuristic classification is the fallback, not the primary path.

### VersionCalculator (extracted)

```typescript
interface VersionRecommendation {
  currentVersion: string;
  recommendedVersion: string;
  bumpType: 'major' | 'minor' | 'patch' | 'none';
  evidence: ClassifiedChange[];
}

interface IVersionCalculator {
  recommend(currentVersion: string, changes: ClassifiedChange[]): VersionRecommendation;
}
```

Extracted from `src/release-analysis/versioning/VersionCalculator.ts`. Simplified to: breaking → major, new features/tokens/components → minor, updates/context → patch.

### NotesRenderer

```typescript
interface RenderedNotes {
  public: string;     // 🔴 + 🟡 items only
  internal: string;   // all tiers
  json: object;       // structured intermediate for testability
}

interface INotesRenderer {
  render(recommendation: VersionRecommendation): RenderedNotes;
}
```

Generates markdown organized by priority tier. Public notes omit 🔵 context items. Internal notes include everything.

### GitHubPublisher (extracted)

```typescript
interface PublishResult {
  success: boolean;
  releaseUrl?: string;
  error?: string;
}

interface IGitHubPublisher {
  publish(version: string, notes: string, repoUrl: string): Promise<PublishResult>;
}
```

Extracted from `src/release/publishing/GitHubPublisher.ts`. Creates git tag, then GitHub release via API.

### ReleasePipeline

```typescript
interface IReleasePipeline {
  analyze(): Promise<VersionRecommendation>;
  generateNotes(): Promise<RenderedNotes>;
  release(): Promise<PublishResult>;
}
```

Orchestrates the pipeline. `analyze` stops after recommendation. `generateNotes` writes files. `release` does everything including GitHub publish (after human approval prompt).

---

## Data Models

### Internal JSON (intermediate, not user-facing)

```typescript
interface ReleaseData {
  version: string;
  previousVersion: string;
  date: string;
  changes: ClassifiedChange[];
  recommendation: VersionRecommendation;
}
```

This is the structured intermediate that NotesRenderer consumes. Written to output directory alongside markdown for testability. Not a persistent store — regenerated on every run.

### Config

```typescript
interface ReleaseConfig {
  npmPublishEnabled: boolean;   // default: false
  repoUrl: string;              // from package.json repository field
  outputDir: string;            // default: "docs/releases"
}
```

Minimal config. Read from `.kiro/tools/release/release-config.json` with sensible defaults.

---

## Error Handling

| Scenario | Behavior |
|----------|----------|
| No git tags found | Warn, full scan all summary docs |
| No summary docs found | Report "no changes since last release", exit cleanly |
| Summary doc parse failure | Warn for that doc, continue with others |
| GitHub API failure | Report error, preserve git tag, provide manual instructions |
| npm publish failure | Report error, don't roll back GitHub release |
| Git not available | Fatal error with clear message |
| >5 files in output dir | Warn about unexpected accumulation |

No retry logic. No recovery strategies. If something fails, report it clearly and let the human decide.

---

## Testing Strategy

- Unit tests for each component (TagResolver, SummaryScanner, ChangeExtractor, ChangeClassifier, VersionCalculator, NotesRenderer)
- Integration test: full pipeline from summary docs → release notes (using fixture summary docs, mocked git)
- Extracted code (VersionCalculator, GitHubPublisher, SemanticVersionValidator) retains existing tests adapted to new location
- All tests run as part of normal `npm test` via Jest

---

## Design Decisions

### Decision 1: Git Tags as Release Boundary

**Options Considered**:
1. Persistent state file tracking last analyzed commit (current approach)
2. Git tags as source of truth
3. Package.json version as boundary marker

**Decision**: Git tags

**Rationale**: Git tags are immutable, verifiable, and already exist (v1.0.0–v7.0.0). A state file can freeze (as it did at `fb255af`), drift, or be deleted. Tags are the release — they should be the boundary.

**Trade-offs**: Requires consistent tagging. Mitigated by making the tool create tags as part of the release workflow.

### Decision 2: No Persistent State

**Options Considered**:
1. State file with last analyzed commit + accumulated results (current approach)
2. No state — derive everything from git on each run
3. Lightweight cache with TTL

**Decision**: No state

**Rationale**: With <20 summary docs per release, scanning is fast enough to do from scratch every time. State files are a liability — they freeze, corrupt, and accumulate. The 82MB `.kiro/release-state/` directory is proof.

**Trade-offs**: Slightly slower on large repos. Irrelevant at DesignerPunk's scale.

### Decision 3: Summary Docs as Primary Source

**Options Considered**:
1. Parse completion docs directly (current approach — regex on raw markdown)
2. Parse summary docs (human-curated, structured)
3. Parse git commit messages

**Decision**: Summary docs

**Rationale**: Summary docs are already human-curated extractions with consistent sections (What/Why/Impact). They're the right abstraction level for release notes. Parsing them is simpler and more reliable than parsing raw completion docs with regex.

**Trade-offs**: Depends on summary docs being created. Mitigated by the existing task completion workflow which already requires them.

### Decision 4: On-Demand Only

**Options Considered**:
1. Hook-triggered analysis on every commit (current approach)
2. On-demand CLI invocation only
3. Scheduled analysis (cron-style)

**Decision**: On-demand only

**Rationale**: Peter makes manual release decisions based on project phase judgment. Continuous analysis produces output nobody reads and files nobody wants (20,880 of them). The tool should run when Peter wants to release, not when a timer fires.

**Trade-offs**: No "ambient awareness" of release readiness. Acceptable — Peter knows when he wants to release.

### Decision 5: Extract and Rebuild (not preserve-and-refactor)

**Options Considered**:
1. Preserve existing code and refactor in place
2. Extract salvageable pieces, rebuild the rest
3. Clean slate — rewrite everything

**Decision**: Extract and rebuild

**Rationale**: The existing code has proven logic (semver calculation, GitHub publishing, version validation) buried in a disconnected architecture. Extracting the good parts and rebuilding the pipeline around them is faster than refactoring 203 files and more reliable than rewriting proven validators.

**Trade-offs**: Some existing test coverage may not transfer cleanly. Mitigated by adapting tests alongside extracted code.
