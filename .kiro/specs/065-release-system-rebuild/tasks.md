# Implementation Plan: Release System Rebuild

**Date**: 2026-02-27
**Spec**: 065 - Release System Rebuild
**Status**: Implementation Planning
**Dependencies**: None

---

## Implementation Plan

Build the release tool incrementally: scaffold → extract salvageable code → build pipeline components → wire CLI → clean up old system. Each parent task produces a working increment.

---

## Task List

- [x] 1. Summary Format Enhancement (Ballot Measure)

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Process-Spec-Planning.md updated with optional Deliverables field in summary template
  - Ballot measure approved by Peter before application
  - Existing summary docs unaffected (field is optional)

  **Primary Artifacts:**
  - `.kiro/steering/Process-Spec-Planning.md` (updated)

  **Completion Documentation:**
  - Detailed: `.kiro/specs/065-release-system-rebuild/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/065-release-system-rebuild/task-1-summary.md` (triggers release detection)

  **Post-Completion:**
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Summary Format Enhancement"`
  - Verify: Check GitHub for committed changes

  - [x] 1.1 Draft ballot measure for Deliverables field addition
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    - Draft proposed change to Parent Task Summary Documents section
    - Include the Deliverables field template with 🔴/🟡/🔵 taxonomy
    - Document what changed, why, counter-argument, and impact
    - Present to Peter for approval
    - _Requirements: 10.1, 10.2, 10.3_

  - [x] 1.2 Apply approved ballot measure
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Apply the approved change to Process-Spec-Planning.md
    - Verify the template renders correctly
    - Confirm existing summary doc format still valid
    - _Requirements: 10.1, 10.4_

- [ ] 2. Tool Scaffold and Code Extraction

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - `.kiro/tools/release/` directory structure created
  - Salvageable code extracted with passing tests
  - TypeScript compiles, Jest discovers tests

  **Primary Artifacts:**
  - `.kiro/tools/release/` directory structure
  - Extracted VersionCalculator, GitHubPublisher, SemanticVersionValidator, NpmPublisher
  - Adapted test files

  **Completion Documentation:**
  - Detailed: `.kiro/specs/065-release-system-rebuild/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/065-release-system-rebuild/task-2-summary.md`

  **Post-Completion:**
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 2 Complete: Tool Scaffold and Code Extraction"`

  - [x] 2.1 Create directory structure
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create `.kiro/tools/release/` with subdirectories: `cli/`, `pipeline/`, `publishers/`, `validators/`, `types/`, `__tests__/`
    - Create `docs/releases/` directory for release notes output
    - Create `release-config.json` with defaults (npmPublishEnabled: false, outputDir: "docs/releases")
    - Verify Jest can discover test files in the new location
    - _Requirements: 7.1, 7.5_

  - [x] 2.2 Extract and adapt VersionCalculator
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Copy `src/release-analysis/versioning/VersionCalculator.ts` to `.kiro/tools/release/pipeline/`
    - Simplify to accept ClassifiedChange[] input (remove old AnalysisResult dependency)
    - Adapt existing tests to new location and simplified interface
    - Verify tests pass
    - _Requirements: 8.1, 8.2, 8.3_

  - [x] 2.3 Extract and adapt publishers and validators
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Extract `GitHubPublisher.ts` to `.kiro/tools/release/publishers/`
    - Extract `NpmPublisher.ts` to `.kiro/tools/release/publishers/` (gated behind config flag)
    - Extract `SemanticVersionValidator.ts` to `.kiro/tools/release/validators/`
    - Adapt tests for each extracted module
    - Verify all tests pass
    - _Requirements: 8.1, 8.2, 8.3, 11.1, 11.2_

  - [x] 2.4 Define shared types
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create type definitions: TagInfo, SummaryDoc, ExtractedChange, DeliverableEntry, ClassifiedChange, VersionRecommendation, RenderedNotes, PublishResult, ReleaseConfig
    - Audit existing type definitions from both subsystems for anything worth preserving
    - Ensure extracted code compiles against new types
    - _Requirements: 8.2_

- [ ] 3. Pipeline Components

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - All pipeline components implemented with tests
  - Full pipeline runs end-to-end with fixture data
  - Summary doc parsing handles both Deliverables field and fallback extraction

  **Primary Artifacts:**
  - TagResolver, SummaryScanner, ChangeExtractor, ChangeClassifier, NotesRenderer
  - Pipeline integration test with fixtures

  **Completion Documentation:**
  - Detailed: `.kiro/specs/065-release-system-rebuild/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/065-release-system-rebuild/task-3-summary.md`

  **Post-Completion:**
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 3 Complete: Pipeline Components"`

  - [x] 3.1 Implement TagResolver
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `getLatestTag()` wrapping `git describe --tags --abbrev=0`
    - Implement `createTag()` wrapping `git tag -a`
    - Handle no-tags-exist case (return null)
    - Write tests with mocked git commands
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 3.2 Implement SummaryScanner
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `findSummariesSinceTag()` using `git log --diff-filter=A --name-only`
    - Handle null tag (full glob scan)
    - Parse file paths to extract specName and taskNumber
    - Write tests with fixture summary docs
    - _Requirements: 2.1, 2.2_

  - [x] 3.3 Implement ChangeExtractor
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Parse summary doc markdown by heading (What Was Done, Why It Matters, Key Changes, Impact)
    - Parse optional `## Deliverables` section with 🔴/🟡/🔵 entries
    - Handle missing sections gracefully
    - Write tests with fixture docs (with and without Deliverables field)
    - _Requirements: 2.3, 2.4, 2.5_

  - [x] 3.4 Implement ChangeClassifier
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - When DeliverableEntry exists, use it directly for classification
    - When no DeliverableEntry, apply keyword heuristics (token→🔴, component→🔴, tool→🟡, governance→🔵)
    - Sort output by priority tier
    - Write tests covering both paths
    - _Requirements: 3.1, 3.2_

  - [ ] 3.5 Implement NotesRenderer
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Generate markdown organized by priority tier with spec name and summary
    - Produce public notes (🔴 + 🟡 only) and internal notes (all tiers)
    - Produce JSON intermediate for testability
    - Write tests verifying markdown output structure
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [ ] 3.6 Pipeline integration test
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create fixture summary docs (with and without Deliverables field)
    - Wire all components into ReleasePipeline
    - Test `analyze()` end-to-end with mocked git
    - Test `generateNotes()` produces correct markdown
    - Verify version recommendation logic with classified changes
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 4. CLI and Hook Integration

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - CLI commands (`analyze`, `notes`, `release`) work from terminal
  - Hook files updated to point to new CLI
  - GitHub release creation works end-to-end (or fails gracefully)

  **Primary Artifacts:**
  - CLI entry point
  - Updated hook files

  **Completion Documentation:**
  - Detailed: `.kiro/specs/065-release-system-rebuild/completion/task-4-parent-completion.md`
  - Summary: `docs/specs/065-release-system-rebuild/task-4-summary.md`

  **Post-Completion:**
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 4 Complete: CLI and Hook Integration"`

  - [ ] 4.1 Implement CLI entry point
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create CLI with `analyze`, `notes`, and `release` commands
    - Wire commands to ReleasePipeline methods
    - Display progress and results in terminal
    - Add accumulation warning (>5 files in output dir)
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [ ] 4.2 Update hook files
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Remove `release-detection-auto.kiro.hook`
    - Update `release-detection-manual.kiro.hook` to invoke new CLI `analyze` command
    - Update `release-manager.sh` to invoke new CLI
    - Verify hooks point to correct paths
    - _Requirements: 9.2_

  - [ ] 4.3 Test GitHub release creation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test `release` command end-to-end with a dry-run flag
    - Verify git tag creation
    - Verify GitHub API call (mocked in test, manual verification for real)
    - Verify error handling for API failures
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 5. Cleanup and Removal

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - All old release system artifacts removed
  - No references to old paths in active code
  - `npm test` passes after removal
  - ~86MB of disk space reclaimed

  **Primary Artifacts:**
  - Removal of `.kiro/release-state/`, `.kiro/release-analysis/cache/`, `history.json`, `src/release/`, `src/release-analysis/`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/065-release-system-rebuild/completion/task-5-parent-completion.md`
  - Summary: `docs/specs/065-release-system-rebuild/task-5-summary.md`

  **Post-Completion:**
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 5 Complete: Cleanup and Removal"`

  - [ ] 5.1 Remove accumulated waste files
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Delete `.kiro/release-state/` (82MB, 20,880 files)
    - Delete `.kiro/release-analysis/cache/` (frozen analysis outputs)
    - Delete `history.json` (3.8MB)
    - Verify disk space reclaimed
    - _Requirements: 9.1_

  - [ ] 5.2 Remove old source code
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Remove `src/release/` (46 source + 45 test files)
    - Remove `src/release-analysis/` (70 source + 42 test files)
    - Update any tsconfig paths or Jest config that referenced old directories
    - Run `npm test` to verify no broken imports or test discovery issues
    - _Requirements: 9.1_

  - [ ] 5.3 Update references and documentation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update `.kiro/steering/Release Management System.md` to reflect new architecture
    - Remove or update any steering doc references to old release system paths
    - Verify `release-config.json` points to new tool location
    - _Requirements: 9.2_
