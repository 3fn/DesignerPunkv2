# Requirements Document: Release Detection Trigger Fix

**Date**: October 30, 2025
**Spec**: release-detection-trigger-fix
**Status**: Requirements Phase
**Dependencies**: infrastructure-automation-fixes

---

## Introduction

This specification fixes the fundamental issue with release detection automation: the agent hooks are configured to trigger on `taskStatusChange` events, which is **not a supported trigger type in Kiro IDE**.

**Root Cause Discovery**: 
1. Investigation of Kiro IDE Agent Hooks documentation revealed only four supported trigger types: `fileCreated`, `fileEdited`, `fileDeleted`, and `manual`
2. Testing confirmed the `.kiro/` directory is excluded from file watching (hooks don't trigger on files created there)
3. Pattern matching works with wildcards in middle of filename (e.g., `task-*-summary.md`) but not at the start

**Solution**: Create lightweight summary documents in `docs/specs/[spec-name]/` directory that trigger hooks when created. Summary docs provide concise, commit-style summaries of parent task completion while detailed completion documentation remains in `.kiro/` directory unchanged.

**Benefits**:
- Minimal change to existing structure (detailed completion docs stay in `.kiro/`)
- Summary docs serve dual purpose (hook trigger + release note content)
- Clear separation: detailed docs (internal) vs summaries (public-facing)
- Better release notes (already in concise, user-facing format)

---

## Glossary

- **Parent Task Completion Document**: Detailed completion documentation for parent tasks in `.kiro/specs/[spec-name]/completion/task-[N]-parent-completion.md` using Tier 3 comprehensive format
- **Parent Task Summary Document**: Concise, commit-style summary in `docs/specs/[spec-name]/task-[N]-summary.md` that triggers release detection hooks
- **Subtask Completion Document**: Completion documentation for subtasks using naming format `task-[N.M]-completion.md` in `.kiro/specs/[spec-name]/completion/` directory
- **onFileCreate Trigger**: Kiro IDE trigger type that fires when a new file matching a pattern is created
- **Manual Trigger**: Kiro IDE trigger type that fires when user explicitly runs the hook
- **Release Detection**: Automated process that scans for completion documents and creates release trigger files
- **File Organization**: Process of moving files to appropriate directories based on Organization metadata (will remain manual)

---

## Requirements

### Requirement 1: Fix Automatic Release Detection Hook Trigger Type

**User Story**: As a developer, I want release detection to trigger automatically when I complete a parent task, so that I don't have to manually run release analysis.

#### Acceptance Criteria

1. WHEN the automatic release detection hook configuration is updated THEN the trigger type SHALL be `fileCreated`
2. WHEN the file pattern is configured THEN it SHALL match parent task summary documents using pattern: `**/task-*-summary.md`
3. WHEN a parent task summary document is created in `docs/specs/[spec-name]/` THEN the release detection hook SHALL trigger automatically within 5 seconds
4. WHEN the hook triggers THEN it SHALL execute `.kiro/hooks/release-manager.sh` with argument `auto`
5. WHEN the hook configuration is updated THEN it SHALL include a 5-minute timeout to prevent indefinite hangs
6. WHEN the hook configuration is updated THEN it SHALL NOT include `runAfter` dependencies (no file organization dependency)

---

### Requirement 2: Create Manual Release Detection Hook

**User Story**: As a developer, I want a manual trigger for release detection, so that I can run it on-demand for edge cases or when automation fails.

#### Acceptance Criteria

1. WHEN the manual release detection hook is created THEN the trigger type SHALL be `manual`
2. WHEN the manual hook is configured THEN it SHALL execute `.kiro/hooks/release-manager.sh` with argument `auto`
3. WHEN I run the manual hook THEN it SHALL prompt for confirmation before executing
4. WHEN the manual hook executes THEN it SHALL have a 5-minute timeout
5. WHEN the manual hook is available THEN I SHALL be able to trigger it from the Agent Hooks panel or command palette

---

### Requirement 3: Update Spec Planning Standards for Parent Task Summary Documents

**User Story**: As a developer, I want to create concise summary documents for parent tasks that trigger release detection hooks, so that I can maintain detailed internal documentation while providing public-facing summaries.

#### Acceptance Criteria

1. WHEN Spec Planning Standards are updated THEN parent task summary documents SHALL use naming format `task-[N]-summary.md` in `docs/specs/[spec-name]/` directory
2. WHEN the naming convention is documented THEN it SHALL explain the distinction between detailed completion docs (`.kiro/specs/[spec-name]/completion/`) and summary docs (`docs/specs/[spec-name]/`)
3. WHEN examples are provided THEN they SHALL show: `task-1-summary.md`, `task-2-summary.md`, `task-10-summary.md`
4. WHEN the standard is updated THEN it SHALL note this is a forward-looking change (existing completion docs don't need migration)
5. WHEN hooks are configured THEN they SHALL use the pattern `**/task-*-summary.md` to match parent task summaries only
6. WHEN summary document format is defined THEN it SHALL include: date, spec name, what was done, why it matters, key changes, and impact

---

### Requirement 4: Create or Update Hook Configuration Files

**User Story**: As a developer, I want hook configuration files to use supported trigger types and correct file patterns, so that automatic release detection works reliably.

#### Acceptance Criteria

1. WHEN the automatic release detection hook is created THEN it SHALL be saved as `.kiro/hooks/release-detection-auto.kiro.hook` using Kiro IDE's `.kiro.hook` format
2. WHEN the automatic hook uses `when` configuration THEN it SHALL specify `type: "fileCreated"` with pattern `**/task-*-summary.md`
3. WHEN the automatic hook uses `then` configuration THEN it SHALL use `type: "askAgent"` with prompt to execute `.kiro/hooks/release-manager.sh auto`
4. WHEN a manual release detection hook is created THEN it SHALL be saved as `.kiro/hooks/release-detection-manual.kiro.hook`
5. WHEN the manual hook is configured THEN it SHALL use `type: "manual"` trigger and execute the same release-manager.sh script via askAgent

---

### Requirement 5: Update Spec Planning Standards Documentation

**User Story**: As a developer, I want Spec Planning Standards to document the new parent task naming convention, so that future specs use the correct format.

#### Acceptance Criteria

1. WHEN Spec Planning Standards completion documentation section is updated THEN it SHALL specify two types of documentation: detailed completion docs (`.kiro/`) and summary docs (`docs/`)
2. WHEN examples are provided THEN they SHALL show both documentation types with clear distinction
3. WHEN the rationale is documented THEN it SHALL explain that summary docs trigger hooks (`.kiro/` directory is filtered) and serve as release note content
4. WHEN migration guidance is provided THEN it SHALL note existing completion docs don't need changes (forward-looking change)
5. WHEN the standard is updated THEN it SHALL include the file pattern for hooks: `**/task-*-summary.md`
6. WHEN summary document format is defined THEN it SHALL provide a template with required sections

---

### Requirement 6: Update Development Workflow Documentation

**User Story**: As a developer, I want Development Workflow documentation to explain the hook trigger behavior, so that I understand how automatic release detection works.

#### Acceptance Criteria

1. WHEN Development Workflow documentation is updated THEN it SHALL explain release detection triggers on parent task summary document creation in `docs/specs/[spec-name]/`
2. WHEN documentation describes the workflow THEN it SHALL show: create detailed completion doc → create summary doc → automatic release detection → manual file organization (optional)
3. WHEN documentation describes troubleshooting THEN it SHALL explain how to use the manual release detection trigger
4. WHEN documentation describes hook behavior THEN it SHALL reference only supported Kiro IDE trigger types (`fileCreated`, `manual`) and explain `.kiro/` directory filtering
5. WHEN documentation describes file organization THEN it SHALL indicate it remains manual (not automated)

---

### Requirement 7: Validate Trigger Behavior

**User Story**: As a developer, I want to verify that the new triggers work correctly, so that I can trust the automation.

#### Acceptance Criteria

1. WHEN I create a parent task summary document using format `task-N-summary.md` in `docs/specs/[spec-name]/` THEN the automatic release detection hook SHALL trigger within 5 seconds
2. WHEN the automatic hook triggers THEN entry logging SHALL appear in `.kiro/logs/release-manager.log`
3. WHEN the automatic hook completes THEN release trigger files SHALL be created in `.kiro/release-triggers/`
4. WHEN I run the manual release detection hook THEN it SHALL execute successfully and create trigger files
5. WHEN I create a file in `.kiro/` directory THEN the automatic hook SHALL NOT trigger (`.kiro/` directory is filtered from file watching)
6. WHEN I create a subtask completion document THEN the automatic hook SHALL NOT trigger (pattern only matches `task-*-summary.md` format)

---

## Success Criteria

This specification will be considered successful when:

1. ✅ Automatic release detection triggers on parent task completion document creation (using new naming format)
2. ✅ Manual release detection trigger is available as fallback
3. ✅ Spec Planning Standards updated with new parent task naming convention
4. ✅ Hook configurations use only supported Kiro IDE trigger types (`.kiro.hook` format)
5. ✅ Documentation accurately reflects the new trigger behavior and naming convention
6. ✅ Validation confirms triggers work as expected with new naming format

---

## Out of Scope

The following are explicitly out of scope for this specification:

- ❌ Renaming existing completion documents (forward-looking change only)
- ❌ Fixing file organization automation bugs (keeping it manual instead)
- ❌ Implementing subtask-level release detection (parent tasks only)
- ❌ Adding `taskStatusChange` support to Kiro IDE (not possible without IDE team)
- ❌ Changing the release detection logic itself (only fixing triggers)
- ❌ Modifying the release-manager.sh script behavior (already fixed in previous spec)

---

*This specification addresses the root cause of release detection automation failure: using an unsupported trigger type. By switching to `onFileCreate` for parent task completion documents and providing a manual fallback, we enable reliable automatic release detection while maintaining human control.*
