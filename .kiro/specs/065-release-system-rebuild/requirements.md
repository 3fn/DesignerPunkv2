# Requirements Document: Release System Rebuild

**Date**: 2026-02-27
**Spec**: 065 - Release System Rebuild
**Status**: Requirements Phase
**Dependencies**: None

---

## Introduction

The current release management system (203 source files across two disconnected subsystems) has accumulated complexity across 10+ specs without achieving reliable core functionality. The state pointer is frozen, change extraction uses naive regex, no actual version bumping occurs, and 82MB of waste files have accumulated from a runaway timer.

This spec rebuilds the release system as a focused CLI tool in `.kiro/tools/release/` that uses git tags as release boundaries, parses structured summary docs for change extraction, and produces human-reviewable markdown release notes.

---

## Requirements

### Requirement 1: Release Boundary Resolution

**User Story**: As Peter, I want the release tool to automatically determine what's changed since the last release, so that I don't have to manually track which commits are included.

#### Acceptance Criteria

1. WHEN the tool runs THEN it SHALL resolve the most recent release tag using `git describe --tags --abbrev=0`
2. WHEN a release tag exists THEN the tool SHALL scope analysis to commits between that tag and HEAD
3. WHEN no release tag exists THEN the tool SHALL analyze all summary docs (full scan) and WARN the user
4. WHEN the tool creates a release THEN it SHALL create a new git tag in the format `vX.Y.Z`

### Requirement 2: Summary Doc Discovery

**User Story**: As Peter, I want the tool to find all completed work since the last release by scanning summary docs, so that nothing is missed.

#### Acceptance Criteria

1. WHEN analyzing changes THEN the tool SHALL scan `docs/specs/*/task-*-summary.md` for summary docs
2. WHEN a release tag exists THEN the tool SHALL use `git log` to identify summary docs added or modified since that tag
3. WHEN summary docs are found THEN the tool SHALL parse the structured sections (What Was Done, Why It Matters, Key Changes, Impact)
4. IF a summary doc contains a `## Deliverables` section THEN the tool SHALL use it for deliverable type classification
5. IF a summary doc lacks a `## Deliverables` section THEN the tool SHALL fall back to section-based extraction from What/Impact sections

### Requirement 3: Deliverable Classification

**User Story**: As Peter, I want changes classified by deliverable type and priority, so that I can quickly assess the significance of a release.

#### Acceptance Criteria

1. WHEN changes are extracted THEN the tool SHALL classify each against the deliverable taxonomy:
   - 🔴 Always surface: Breaking changes, token creation/updates, component creation/updates
   - 🟡 Surface prominently: New tools, 3rd party tool changes, new AI agents/MCPs, build system changes
   - 🔵 Include as context: Governance/process changes, infrastructure specs
2. WHEN classification is complete THEN the tool SHALL sort changes by priority tier (🔴 → 🟡 → 🔵)

### Requirement 4: Version Recommendation

**User Story**: As Peter, I want a version bump recommendation based on what actually changed, so that semantic versioning is accurate.

#### Acceptance Criteria

1. WHEN changes include 🔴 breaking changes THEN the tool SHALL recommend a major version bump
2. WHEN changes include 🔴 token/component creation or 🟡 new tools/agents THEN the tool SHALL recommend a minor version bump
3. WHEN changes include only 🔵 context items or 🔴 token/component updates (non-breaking) THEN the tool SHALL recommend a patch version bump
4. WHEN no changes are detected THEN the tool SHALL report "no changes since last release" and exit without recommending a bump
5. WHEN recommending a version THEN the tool SHALL display the current version, recommended version, and the evidence (list of changes by tier)

### Requirement 5: Release Notes Generation

**User Story**: As Peter, I want markdown release notes generated from summary docs, so that I have a draft ready to review and publish.

#### Acceptance Criteria

1. WHEN generating release notes THEN the tool SHALL produce a markdown file organized by priority tier
2. WHEN generating release notes THEN the tool SHALL include spec name, task title, and summary for each change
3. WHEN generating release notes THEN the tool SHALL produce both a public-facing summary (🔴 + 🟡 items) and an internal summary (all tiers)
4. WHEN release notes are generated THEN the tool SHALL write them to `docs/releases/` with a version-based filename (e.g., `v8.0.0.md`)

### Requirement 6: GitHub Release Creation

**User Story**: As Peter, I want the tool to create a GitHub release after I approve the notes, so that the release is published with accurate information.

#### Acceptance Criteria

1. WHEN Peter approves release notes THEN the tool SHALL create a git tag with the approved version
2. WHEN a git tag is created THEN the tool SHALL create a GitHub release using the approved markdown notes as the release body
3. IF GitHub release creation fails THEN the tool SHALL report the error, preserve the git tag, and provide instructions for manual release creation
4. WHEN creating a GitHub release THEN the tool SHALL use the repository configured in `package.json` (`https://github.com/3fn/DesignerPunkv2`)

### Requirement 7: CLI Interface

**User Story**: As Peter, I want to invoke the release tool from the command line with clear commands, so that releases are manual and intentional.

#### Acceptance Criteria

1. The tool SHALL provide a `analyze` command that scans changes and displays the recommendation
2. The tool SHALL provide a `release` command that generates notes, prompts for approval, and executes the release
3. The tool SHALL provide a `notes` command that generates release notes without executing a release
4. WHEN any command runs THEN the tool SHALL display progress and results in the terminal
5. IF the tool detects unexpected file accumulation (>5 files in working directory) THEN it SHALL warn the user

### Requirement 8: Existing Code Extraction

**User Story**: As a developer, I want salvageable code extracted from the existing system, so that proven logic isn't rewritten from scratch.

#### Acceptance Criteria

1. WHEN building the release tool THEN the following SHALL be extracted and adapted:
   - `VersionCalculator.ts` — semver calculation logic
   - `GitHubPublisher.ts` — GitHub release creation
   - `SemanticVersionValidator.ts` — version validation
2. WHEN extracting code THEN type definitions SHALL be audited for relevance and simplified
3. WHEN extraction is complete THEN the extracted code SHALL have passing tests in the new location

### Requirement 9: Cleanup

**User Story**: As Peter, I want the old release system artifacts removed, so that the codebase isn't carrying 82MB of dead weight.

#### Acceptance Criteria

1. WHEN the rebuild is complete THEN the following SHALL be removed:
   - `.kiro/release-state/` (82MB, 20,880 files)
   - `.kiro/release-analysis/cache/` (frozen quick-analysis outputs)
   - `history.json` (3.8MB unbounded history)
   - `src/release/` (46 source files, 45 test files)
   - `src/release-analysis/` (70 source files, 42 test files)
2. WHEN removing old code THEN the hook files SHALL be updated:
   - Remove `release-detection-auto.kiro.hook`
   - Update `release-detection-manual.kiro.hook` to point to new CLI
   - Update `release-manager.sh` to invoke new CLI

### Requirement 10: Summary Format Enhancement

**User Story**: As Peter, I want summary docs to optionally include a structured Deliverables field, so that the release tool can classify changes accurately without guessing from prose.

#### Acceptance Criteria

1. WHEN updating Process-Spec-Planning.md THEN an optional `## Deliverables` section SHALL be added to the Parent Task Summary Documents template
2. The Deliverables section SHALL use the priority emoji taxonomy (🔴/🟡/🔵) with deliverable type and description
3. The field SHALL be optional — summaries without it SHALL still be parseable via fallback extraction
4. WHEN the Deliverables field is present THEN the release tool SHALL prefer it over section-based extraction

### Requirement 11: npm Publishing Readiness

**User Story**: As a developer, I want the release tool to include npm publishing code that can be activated when packages are ready, so that enabling publishing is a config change, not a code change.

#### Acceptance Criteria

1. WHEN building the release tool THEN `NpmPublisher.ts` SHALL be extracted and adapted from the existing code
2. The npm publishing code path SHALL be gated behind a config flag (disabled by default)
3. WHEN the config flag is enabled AND packages are publishable THEN the tool SHALL execute `npm publish` after GitHub release creation
4. IF npm publishing fails THEN the tool SHALL report the error without rolling back the GitHub release
