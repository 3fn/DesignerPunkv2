# Release System Rebuild

**Date**: 2026-02-27
**Purpose**: Clarify the vision, define the minimum viable function, and simplify the release management system from its current over-engineered state into something that works reliably
**Organization**: spec-guide
**Scope**: 065-release-system-rebuild
**Status**: Early draft — vision clarification phase

---

## Problem Statement

The release management system has accumulated significant complexity across 10+ specs without achieving reliable core functionality. The current state:

### What Exists

Two separate TypeScript subsystems totaling 203 source files:

| Subsystem | Source Files | Test Files | Directories |
|-----------|-------------|------------|-------------|
| `src/release/` | 46 | 45 | 12 (ai, automation, cli, config, coordination, detection, integration, interfaces, orchestration, publishing, types, validation) |
| `src/release-analysis/` | 70 | 42 | 17 (analyzer, cli, collection, config, detection, docs, errors, evaluation, extraction, git, hooks, notes, performance, reporting, state, types, validation, versioning) |

Plus a shell hook (`release-manager.sh`), a JSON config (`release-config.json`), a 3.8MB history file, and a steering doc.

### What Actually Runs

Only the quick analyzer (`quick-analyze.ts`) executes during the workflow. The full analysis pipeline is disconnected — the shell hook explicitly notes: "TypeScript integration disabled due to architectural issues (WorkflowMonitor creates multiple unclearable setInterval timers causing hangs)."

### What's Broken

1. **Frozen state pointer**: The `lastAnalyzedCommit` in every cached analysis points to `fb255af` — 29 commits behind HEAD. The "append-only optimization" never advances its checkpoint, so every run re-discovers all documents from scratch.

2. **Naive change extraction**: The quick analyzer counts regex matches for words like "feature", "new", "add", "fix", "bug", "deprecated" in raw markdown. A completion doc saying "Added canonical name mapping" registers as a "feature." A doc mentioning "standard library deprecated" (a governance documentation change) triggers a major version bump recommendation.

3. **No actual version bumping**: Despite the elaborate config for semver rules, npm publishing, GitHub releases, and retry strategies — none of it executes. The system produces JSON cache files that nothing consumes.

4. **Unbounded history growth**: `history.json` is 3.8MB and stores full document content inline in every analysis entry.

5. **Inconsistent analysis**: 9 cached analyses over 3 days show document counts growing from 12→18 with the same frozen commit pointer, all with `"gitCommit": "unknown"` on every document.

### The Pattern

The release system has been the subject of at least 10 specs:
- `release-analysis-system` — initial build
- `release-management-system` — management layer
- `release-detection-infrastructure-investigation` — investigation
- `release-detection-trigger-fix` — fix attempt
- `003-release-analysis-test-cleanup` — test cleanup
- `011-release-system-test-fixes` — test fixes
- `012-release-system-test-fixes` — more test fixes
- `018-release-analysis-performance-optimization` — performance
- `057-release-analysis-tag-filtering` — tag filtering
- `XXX-release-system-operations` — operations (draft)

This is a system that has been repeatedly patched without a clear vision of what it needs to be. Each spec addressed a symptom. This spec addresses the cause.

---

## Vision Clarification

Before any implementation decisions, the fundamental question: **what does this system need to do, for whom, and when?**

### Users

| User | What They Need | When |
|------|---------------|------|
| Peter (human lead) | Know what's changed since last release, decide when to release, review generated release notes | Before publishing a release |
| AI agents (Ada, Lina, Thurgood) | Know if their completed work has been captured by the release system | After task completion |
| Future package consumers | Accurate changelogs, semantic versioning they can depend on | When consuming published packages |

### Decisions the System Supports

1. **What version should this release be?** — Based on what actually changed (breaking, feature, fix), not word counting.
2. **What's in this release?** — Aggregated from completion docs, organized by change type.
3. **Is this release ready?** — Are all tasks complete? Are tests passing? Are completion docs present?
4. **What changed since the last release?** — The diff between the last published version and current HEAD.

### What's NOT Needed Right Now

- **Automated npm publishing** — DesignerPunk doesn't have external package consumers yet. Publishing is a future concern.
- **AI collaboration interface** — Agents don't currently use analysis output to make decisions. The spec/task system drives the workflow.
- **Performance optimization layer** — With <20 completion docs per release, performance is not a constraint.
- **Parallel processing** — Same reason.
- **Hot-reload config** — The config changes maybe once a quarter.

---

## Objectives

1. **Define the minimum viable release workflow** — What's the simplest path from "work is done" to "release is published with accurate notes"?
2. **Decide what to keep, simplify, or remove** from the existing 203 source files
3. **Fix the core analysis** — Replace regex word counting with structured extraction from completion docs (which already have consistent sections: What, Why, Impact, Artifacts)
4. **Fix state management** — The commit pointer must advance. Analysis must be truly incremental.
5. **Produce accurate version recommendations** — Based on structured change data, not pattern matching
6. **Generate useful release notes** — From completion doc content, organized by spec and change type
7. **Integrate reliably with the hook system** — The shell hook must actually work end-to-end

---

## Key Design Questions

### Q1: What's the right granularity for release detection?

**Answered**: Per-spec. Summary docs in `docs/specs/{spec-name}/` are the unit of analysis. Completion doc directories provide drill-down granularity.

**Deliverable Taxonomy** — Priority types to surface in release notes:

| Priority | Deliverable Type | Example |
|----------|-----------------|---------|
| 🔴 Always surface | Breaking changes (any category) | API signature change, removed feature |
| 🔴 Always surface | Token creation or updates | New color primitives, semantic token additions |
| 🔴 Always surface | Component creation or updates | New ButtonCTA variant, Avatar component |
| 🟡 Surface prominently | New tools | DTCG format generator, component analysis CLI |
| 🟡 Surface prominently | 3rd party tool additions or removals | Figma plugin integration, dependency changes |
| 🟡 Surface prominently | New AI agents or MCPs | New specialist agent, new MCP server |
| 🟡 Surface prominently | Build system changes | New platform support, build config changes |
| 🔵 Include as context | Governance/process changes | Steering doc updates, workflow changes |
| 🔵 Include as context | Infrastructure specs | Audits, migrations, system alignment work |

**Open question**: Who are the release notes for? If external package consumers, governance changes are noise. If Peter reviewing a release, they're relevant. Recommend: generate both a public-facing summary (🔴 + 🟡) and an internal summary (all tiers).

### Q2: How should change extraction work?

**Answered**: Parse summary docs as the primary source, completion docs as the detail layer.

**Extraction pipeline:**
1. Scan `docs/specs/` for summary docs created since last release tag
2. Parse structured sections (What, Why, Impact) from each summary
3. Classify each spec's changes against the deliverable taxonomy
4. Generate release notes from summaries
5. Link to completion docs for detail

Summary docs are already human-curated extractions of completion docs. Parsing them is simpler and more reliable than parsing raw completion docs with regex.

### Q3: What's the right scope for version 1?

**Answered**: Minimum viable plus npm publishing and GitHub release creation.

**v1 scope:**
- Scan summary docs since last release tag
- Extract structured change data from known sections
- Classify against deliverable taxonomy
- Recommend version bump based on change types
- Generate markdown release notes draft
- Human reviews and approves
- Tag and create GitHub release (human-triggered, after approval)

**Ready to activate (blocked on package architecture):**
- npm publishing — The release tool will have the publishing code extracted from `NpmPublisher.ts`, but the packages themselves aren't publishable yet. See "npm Publishability Assessment" below.

**Deferred:**
- Package coordination across @designerpunk/* packages (until packages are independently versioned)
- Rollback coordination
- Pre-release versioning
- Automated publishing without human approval

### npm Publishability Assessment

**Finding**: The three `@designerpunk/*` scoped packages (`tokens`, `build-system`, `components`) referenced in the release config don't exist. The project is a single monolithic package (`designer-punk-v2`).

The monolith is not publishable in its current state:

| Problem | Detail |
|---------|--------|
| No `files` field, no `.npmignore` | npm would publish the entire repo (5,126 files, 53MB compressed, 124MB unpacked) |
| Package name `designer-punk-v2` | Not scoped, doesn't match `@designerpunk/*` naming from release config |
| Broken export path | `BlendUtilities` export points to a `.ts` source file, not compiled output |
| `dist/` is gitignored | Build output exists locally but not in repo — CI/CD would need to build before publish |

The `dist/` directory contains the actual publishable content (multi-platform token outputs, compiled TokenEngine, browser bundle, component tokens), but the package isn't configured to publish only that.

**Prerequisites for npm publishing (separate spec):**
1. Add `files` field or `.npmignore` to limit published content to `dist/`
2. Fix broken export path (`BlendUtilities.web.ts` → compiled output)
3. Decide on package architecture (scoped `@designerpunk/*` packages vs single package)
4. Decide on package naming

The release tool will include the `NpmPublisher` code path, gated behind a config flag, so activating npm publishing is a config change once the packages are ready — not a code change.

### Q4: What happens to the existing code?

**Answered**: Extract and rebuild.

**Extract (salvageable):**
- `src/release-analysis/versioning/VersionCalculator.ts` + tests — semver logic
- `src/release/publishing/GitHubPublisher.ts` + tests — GitHub release creation
- `src/release/publishing/NpmPublisher.ts` + tests — npm publishing
- `src/release/validation/SemanticVersionValidator.ts` + tests — version validation
- `src/release-analysis/types/AnalysisTypes.ts` — type definitions (audit for relevance)
- `src/release/types/ReleaseTypes.ts` — type definitions (audit for relevance)

**Archive or remove (everything else):**
- AI collaboration interface, pipeline orchestration, package coordination, hook integration, performance optimization, evaluation, state management, config hot-reload, error recovery, parallel processing, document parsing cache, progress reporter, workflow preservation, CLI bridge, analysis reporter

**Principle**: Keep types, validators, and publisher implementations. Remove everything that serves disconnected features.

### Q5: Should the release system be a separate package?

**Answered**: Move to `src/tools/release/`. Originally planned for `.kiro/tools/release/`, but Jest roots and tsconfig are scoped to `src/` — using `src/tools/release/` avoids config changes while still separating tooling from product code via the `tools/` directory name.

- CLI commands point to `src/tools/release/cli/`
- Tests in `src/tools/release/__tests__/`
- Runs as part of normal Jest test suite

**Fallback**: If `src/tools/` creates friction with other conventions, revisit. The `tools/` directory name provides the separation.

**Migration**: After rebuild is complete, archive `src/release/` and `src/release-analysis/` (or remove if Peter approves).

---

## Constraints

- **Must integrate with existing hook system** — `.kiro/hooks/release-manager.sh` is the entry point
- **Must work with single-branch workflow** — No release branches, everything on main
- **Must respect completion doc format** — The structured sections in completion docs are the primary data source
- **Must produce human-reviewable output** — Peter approves releases, not automation
- **Jest, not Vitest** — Consistent with project test infrastructure

---

## Release Boundary Resolution

**Decision**: Git tags are the authoritative source of truth for release boundaries.

The current system tracks a `lastAnalyzedCommit` in a state file — but this tracks "last time the tool ran," not "last release." These are fundamentally different things, and conflating them is why the state pointer froze at `fb255af` (29 commits behind HEAD) without anyone noticing.

**How it works in the rebuild:**
- `git describe --tags --abbrev=0` resolves the most recent release tag (currently `v7.0.0` at `3fa2d07a`)
- Analysis scopes to commits between that tag and HEAD
- No persistent state file needed for boundary tracking — git tags are the state
- When a release is published, the tool creates a new tag, which automatically advances the boundary

**Prerequisite**: Tagging must be enforced as part of the release workflow. The tool creates the tag (after human approval), so this is self-enforcing.

---

## Summary Format Enhancement

**Decision**: Add an optional `Deliverables` field to the parent task summary doc template in Process-Spec-Planning.md.

Current summary docs have What/Why/Impact sections but don't classify deliverable types. The release tool would have to infer "this delivered tokens" from prose — exactly the kind of naive text parsing that broke the current system.

**Proposed addition to summary template:**
```
## Deliverables
- 🔴 Token updates: [list]
- 🟡 New tool: [name]
- 🔵 Process change: [description]
```

The field is optional — summaries without it still work (the tool falls back to section-based extraction). But when present, it gives the release tool structured data instead of guesswork.

**Scope**: This requires a ballot measure to update Process-Spec-Planning.md. The ballot measure will be drafted as part of 065's first task, applied before the extraction logic is built.

---

## Cleanup Targets

The current release system has accumulated significant disk waste that should be removed as part of the rebuild:

| Target | Size | Files | Reason |
|--------|------|-------|--------|
| `.kiro/release-state/` | 82MB | 20,880 | Runaway WorkflowMonitor timer dumping ~30 JSON files every ~2 minutes |
| `.kiro/release-analysis/cache/` | ~40KB | 10 | Frozen quick-analysis outputs with stale commit pointers |
| `history.json` | 3.8MB | 1 | Unbounded append-only history with full document content inline |
| `.kiro/release-state/analysis-state.json` | 13KB | 1 | State file with frozen `lastAnalyzedCommit` (replaced by git tags) |

Total: ~86MB of accumulated waste from a system that produces no usable output.

The rebuild eliminates the accumulation pattern entirely:
- No passive file generation (auto hook removed, no timer)
- On-demand tool writes one JSON state file + one markdown output per run
- Git tags replace persistent state tracking
- Defensive check: if the tool's working directory exceeds 5 files, warn about unexpected accumulation

---

## What This Spec Does NOT Cover

- Changing the hook system architecture (that's Process-Hook-Operations' domain)
- npm or GitHub publishing automation (deferred to future spec when consumers exist)
- Token or component release concerns (Ada's and Lina's domains respectively)

---

## Open Questions for Peter

1. ~~**How do you currently decide when to release?**~~ **Answered**: Manual judgment call based on project phase. Per-spec was the original intent but doesn't hold for multi-spec programs (e.g., 062→063→064). Keeping it manual is the right call — the system supports the decision, it doesn't make it.

2. ~~**What's the most useful output format?**~~ **Answered**: Markdown release notes as the primary user-facing output. Internally, a structured JSON intermediate (spec, change type, description, affected components) that the markdown is rendered from — not as a user-facing format, but as the internal data model. This makes markdown generation testable and leaves the door open for other renderings (GitHub release body, changelog entry) without parsing markdown back into structure.

3. ~~**How important is the "AI agent feedback after task completion" use case?**~~ **Answered (implied by Q1)**: Not important. Releases are manual decisions, so per-task analysis is overhead. The auto-detection hook (`release-detection-auto.kiro.hook`) rarely fires anyway — Kiro IDE file watching doesn't trigger for AI-created files. Removing the hook-triggered analysis eliminates noise without losing value.

4. ~~**What's your appetite for removing code?**~~ **Answered**: Aggressive in areas being removed entirely. Conservative at system interaction boundaries. Specific guidance:

   **Aggressive removal** (entire disconnected subsystems):
   - `src/release/ai/` — unused AI collaboration interface
   - `src/release/publishing/` — npm/GitHub publishing (no consumers yet)
   - `src/release/coordination/` — package coordination (premature)
   - `src/release/orchestration/` — pipeline orchestration (pipeline doesn't run)
   - `src/release-analysis/performance/` — parallel processing, benchmarks (unnecessary at scale)
   - `src/release-analysis/evaluation/` — artifact evaluation (nothing consumes it)
   - `src/release-analysis/hooks/` — hook integration (disabled)
   - `history.json` (3.8MB, unbounded growth)
   - `.kiro/release-state/` (82MB, 20,880 files from runaway timer)
   - `.kiro/release-analysis/cache/` (frozen quick-analysis JSON files)
   - `.kiro/release-state/analysis-state.json` (frozen state pointer, replaced by git tags)

   **Conservative treatment** (interaction boundaries, salvageable logic):
   - `src/release-analysis/extraction/` — types and test expectations encode real requirements; extraction logic needs replacement but types are worth auditing
   - `src/release-analysis/versioning/` — semver calculation logic is sound, inputs were garbage; likely salvageable
   - `src/release/config/` — typed config pattern worth preserving even if config is over-specified
   - `src/release/validation/` — semver validation and safety checks encode real rules
   - Shell hook integration with `commit-task.sh` — boundary where release touches development workflow

5. ~~**Is there a target release cadence?**~~ **Answered**: Ad-hoc, based on judgment. No fixed cadence.

### Kiro IDE Impact Assessment

Removing hook-triggered release analysis has no meaningful impact on the IDE experience:
- `release-detection-auto.kiro.hook` — remove (rarely fires, produces unused output)
- `release-detection-manual.kiro.hook` — repurpose as "what's changed since last release" on-demand query
- `release-manager.sh` — replace with CLI commands
- All other hooks (12 agent hooks, commit hook, organize hook) — unaffected
- Task completion workflow — unaffected

---

## Next Steps

1. Peter answers the open questions above
2. Based on answers, draft the minimum viable architecture
3. Audit existing code for salvageable components (types, validators, tests)
4. Formalize into requirements.md, design.md, tasks.md
5. Execute with appropriate domain coordination (Thurgood owns the spec, Lina may assist with implementation if needed)

---

## Related Documentation

- `.kiro/steering/Release Management System.md` — Current steering doc (conceptual model)
- `.kiro/steering/Process-Hook-Operations.md` — Hook system architecture
- `.kiro/steering/Process-Development-Workflow.md` — Task completion workflow
- `.kiro/steering/Completion Documentation Guide.md` — Completion doc format
- `.kiro/release-analysis/cache/` — Cached analysis outputs (evidence of current issues)
- `src/release/` — Existing release subsystem (46 source files)
- `src/release-analysis/` — Existing analysis subsystem (70 source files)
