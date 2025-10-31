# Design Document: Release Detection Trigger Fix

**Date**: October 30, 2025
**Spec**: release-detection-trigger-fix
**Status**: Design Phase
**Dependencies**: infrastructure-automation-fixes

---

## Overview

This design implements a fix for release detection automation by replacing the unsupported `taskStatusChange` trigger with Kiro IDE's supported `fileCreated` trigger. Testing revealed that the `.kiro/` directory is filtered from Kiro IDE's file watching, preventing hooks from triggering on files created there.

**Solution**: Create lightweight summary documents in `docs/specs/[spec-name]/` directory that trigger hooks when created, while keeping detailed completion documentation in `.kiro/` unchanged.

**Key Changes:**
1. Create parent task summary document format (`task-N-summary.md` in `docs/specs/[spec-name]/`)
2. Update Spec Planning Standards to include summary document workflow
3. Create automatic release detection hook using `fileCreated` trigger with pattern `**/task-*-summary.md`
4. Create manual release detection hook as fallback
5. Update Development Workflow documentation

**Design Principles**: 
- **Minimal change**: Detailed completion docs stay in `.kiro/` unchanged
- **Dual purpose**: Summary docs serve as both hook trigger and release note content
- **Clear separation**: Detailed docs (internal) vs summaries (public-facing)
- **Forward-looking**: Applies to new specs only, no migration needed

---

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Kiro IDE Hook System                      │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  File System Watcher                                │    │
│  │  - Monitors: docs/specs/*/                         │    │
│  │  - Pattern: **/task-*-summary.md                   │    │
│  │  - Excludes: .kiro/ directory (filtered)           │    │
│  └────────────────┬───────────────────────────────────┘    │
│                   │ fileCreated event                       │
│                   ▼                                          │
│  ┌────────────────────────────────────────────────────┐    │
│  │  release-detection-auto.kiro.hook                  │    │
│  │  - Trigger: fileCreated                            │    │
│  │  - Action: askAgent → run release-manager.sh      │    │
│  └────────────────┬───────────────────────────────────┘    │
└───────────────────┼──────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│              Release Manager Script                          │
│              (.kiro/hooks/release-manager.sh)               │
│                                                              │
│  1. Detect release triggers from recent git changes         │
│  2. Create trigger files in .kiro/release-triggers/        │
│  3. Log execution to .kiro/logs/release-manager.log        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              Manual Trigger (Fallback)                       │
│              (release-detection-manual.kiro.hook)           │
│                                                              │
│  - User initiates from Agent Hooks panel                    │
│  - Runs same release-manager.sh script                     │
│  - Provides fallback for edge cases                        │
└─────────────────────────────────────────────────────────────┘
```

### Documentation Structure

```
docs/
└── specs/
    └── [spec-name]/
        ├── task-1-summary.md  ← Triggers hook! (public-facing)
        └── task-2-summary.md  ← Triggers hook! (public-facing)

.kiro/
└── specs/
    └── [spec-name]/
        ├── requirements.md
        ├── design.md
        ├── tasks.md
        └── completion/
            ├── task-1-parent-completion.md  ← Detailed (internal)
            ├── task-1-1-completion.md       ← Subtask (internal)
            └── task-1-2-completion.md       ← Subtask (internal)
```

### Documentation Architecture

**Parent Task Summary Documents** (triggers hooks):
- **Location**: `docs/specs/[spec-name]/task-N-summary.md`
- **Format**: `task-N-summary.md`
- **Examples**: `task-1-summary.md`, `task-2-summary.md`, `task-10-summary.md`
- **Pattern**: `**/task-*-summary.md` (simple glob, wildcard in middle)
- **Purpose**: Concise, commit-style summary that triggers release detection
- **Content**: What was done, why it matters, key changes, impact

**Parent Task Completion Documents** (detailed, internal):
- **Location**: `.kiro/specs/[spec-name]/completion/task-N-parent-completion.md`
- **Format**: `task-N-parent-completion.md` (unchanged from current)
- **Purpose**: Comprehensive Tier 3 documentation (architecture decisions, validation, lessons learned)
- **No hook trigger**: `.kiro/` directory is filtered from file watching

**Subtask Completion Documents** (detailed, internal):
- **Location**: `.kiro/specs/[spec-name]/completion/task-N.M-completion.md`
- **Format**: `task-N.M-completion.md` (unchanged)
- **Examples**: `task-1-1-completion.md`, `task-2-3-completion.md`
- **No hook trigger**: Subtasks don't trigger release detection

**Pattern Matching:**
```
✅ Matches summary pattern (**/task-*-summary.md):
   docs/specs/my-spec/task-1-summary.md
   docs/specs/my-spec/task-2-summary.md
   docs/specs/my-spec/task-10-summary.md

❌ Doesn't match summary pattern:
   task-1-1-completion.md (subtask - different format)
   task-1-parent-completion.md (completion doc - different suffix)
   .kiro/specs/my-spec/task-1-summary.md (in .kiro/ - directory filtered)
```

---

## Components and Interfaces

### Component 1: Spec Planning Standards Update

**Purpose**: Add parent task summary document workflow to enable reliable hook triggering while maintaining detailed internal documentation

**Location**: `.kiro/steering/Spec Planning Standards.md`

**Changes Required:**

1. **Add Summary Document Section**
   ```markdown
   ### Parent Task Summary Documents
   
   **Purpose**: Concise, commit-style summaries that trigger release detection hooks and serve as release note content.
   
   **Location**: `docs/specs/[spec-name]/task-N-summary.md`
   
   **When to create**: After completing parent task and writing detailed completion documentation
   
   **Format**:
   ```markdown
   # Task N Summary: [Task Title]
   
   **Date**: [Date]
   **Spec**: [spec-name]
   **Type**: [Setup | Implementation | Architecture | Infrastructure Fix]
   
   ## What Was Done
   [Concise description of what was implemented]
   
   ## Why It Matters
   [Business value, user impact, or technical benefit]
   
   ## Key Changes
   - [Change 1]
   - [Change 2]
   - [Change 3]
   
   ## Impact
   - ✅ [Positive impact 1]
   - ✅ [Positive impact 2]
   ```
   
   **Rationale**: 
   - Summary docs trigger release detection (`.kiro/` directory is filtered from file watching)
   - Serve dual purpose as release note content
   - Provide public-facing documentation while detailed docs remain internal
   ```

2. **Update Task Format Examples**
   ```markdown
   ## Task List
   
   - [ ] 1. Build System Foundation
   
     **Type**: Parent
     **Validation**: Tier 3 - Comprehensive
     
     **Completion Documentation:**
     - Detailed: `.kiro/specs/[spec-name]/completion/task-1-parent-completion.md`
     - Summary: `docs/specs/[spec-name]/task-1-summary.md` (triggers release detection)
   
     - [ ] 1.1 Create directory structure
       **Type**: Setup
       **Validation**: Tier 1 - Minimal
       - Create `src/build/` directory
       - _Requirements: 1.1_
   ```

3. **Add Forward-Looking Note**
   ```markdown
   **Note**: This summary document workflow applies to new specs going forward. 
   Existing completion documents don't need changes.
   ```

**Interface**: File naming convention and workflow (no code interface)

---

### Component 2: Automatic Release Detection Hook

**Purpose**: Trigger release detection automatically when parent task summary documents are created

**Location**: `.kiro/hooks/release-detection-auto.kiro.hook`

**Hook Configuration:**

```json
{
  "enabled": true,
  "name": "Automatic Release Detection on Parent Task Summary",
  "description": "When a parent task summary document is created (task-N-summary.md format in docs/specs/), automatically trigger release detection to scan for completion documents and create release trigger files.",
  "version": "1",
  "when": {
    "type": "fileCreated",
    "patterns": [
      "**/task-*-summary.md"
    ]
  },
  "then": {
    "type": "askAgent",
    "prompt": "A parent task summary document has been created. Please run the release detection script to scan for completion documents and create release trigger files. Execute: ./.kiro/hooks/release-manager.sh auto"
  }
}
```

**Key Design Decisions:**

1. **Trigger Type**: `fileCreated` (supported by Kiro IDE)
   - Fires when new file matching pattern is created
   - Doesn't fire on file saves (avoids repeated triggers)
   - Validated through testing with test hooks

2. **Pattern**: `**/task-*-summary.md`
   - `**/` matches any directory depth
   - `task-*-summary.md` matches summary format with wildcard in middle (validated to work)
   - Simple glob pattern, no regex complexity
   - Excludes `.kiro/` directory (filtered by Kiro IDE)

3. **Action**: `askAgent` with prompt to execute script
   - Uses `askAgent` type (validated format from working hooks)
   - Prompt instructs agent to run `.kiro/hooks/release-manager.sh auto`
   - Reuses existing release-manager.sh script (already fixed in previous spec)
   - `auto` argument triggers automatic detection mode

4. **No Timeout Specified**: Kiro IDE may have default timeout
   - release-manager.sh completes in ~2 seconds (well under any reasonable timeout)
   - Script has internal error handling

5. **Enabled by Default**: `"enabled": true`
   - Hook active immediately after creation
   - Can be disabled via Kiro IDE if needed

6. **Directory Filtering**: `.kiro/` directory is excluded
   - Kiro IDE filters `.kiro/` from file watching
   - Summary docs in `docs/specs/` directory will trigger
   - Detailed completion docs in `.kiro/specs/` won't trigger (by design)

---

### Component 3: Manual Release Detection Hook

**Purpose**: Provide user-initiated fallback for release detection

**Location**: `.kiro/hooks/release-detection-manual.kiro.hook`

**Hook Configuration:**

```json
{
  "enabled": true,
  "name": "Manual Release Detection",
  "description": "Manually trigger release detection to scan for completion documents and create release trigger files. Use this as a fallback when automatic detection doesn't run or for on-demand analysis.",
  "version": "1",
  "when": {
    "type": "manual"
  },
  "then": {
    "type": "askAgent",
    "prompt": "Please run the release detection script to scan for completion documents and create release trigger files. Execute: ./.kiro/hooks/release-manager.sh auto"
  }
}
```

**Key Design Decisions:**

1. **Trigger Type**: `manual`
   - User initiates from Agent Hooks panel or command palette
   - Provides explicit control

2. **Same Script**: Uses same `release-manager.sh auto` command
   - Consistent behavior between automatic and manual triggers
   - No duplication of logic

3. **Use Cases**:
   - Automatic hook didn't trigger (debugging)
   - Want to re-run release detection
   - Testing hook behavior
   - Edge cases where automatic detection missed something

---

### Component 4: Development Workflow Documentation Update

**Purpose**: Document the new summary document workflow and hook trigger behavior

**Location**: `.kiro/steering/Development Workflow.md`

**Changes Required:**

1. **Update "Automatic Release Detection" Section**
   ```markdown
   ### Automatic Release Detection
   
   **Trigger**: Parent task summary document creation in `docs/specs/[spec-name]/`
   
   **How it works**:
   1. Complete parent task work
   2. Create detailed completion document: `.kiro/specs/[spec-name]/completion/task-N-parent-completion.md` (Tier 3 comprehensive)
   3. Create summary document: `docs/specs/[spec-name]/task-N-summary.md` (concise, commit-style)
   4. Kiro IDE detects summary file creation and triggers release detection hook
   5. Release manager scans for completion documents and creates trigger files
   6. Release analysis can be run to calculate version bump and generate notes
   
   **File naming**: 
   - Summary docs: `task-N-summary.md` in `docs/specs/[spec-name]/` (triggers hook)
   - Detailed docs: `task-N-parent-completion.md` in `.kiro/specs/[spec-name]/completion/` (internal)
   
   **Why two documents?**:
   - `.kiro/` directory is filtered from Kiro IDE file watching (hooks don't trigger there)
   - Summary docs serve dual purpose: hook trigger + release note content
   - Detailed docs remain internal for comprehensive knowledge preservation
   
   **Subtask completion documents** use format `task-N.M-completion.md` in `.kiro/` and do NOT trigger 
   automatic release detection (by design - only parent tasks represent complete features).
   ```

2. **Add "Manual Release Detection" Section**
   ```markdown
   ### Manual Release Detection
   
   **When to use**:
   - Automatic detection didn't trigger
   - Want to re-run release detection
   - Testing or debugging
   - Edge cases
   
   **How to trigger**:
   1. Open Agent Hooks panel in Kiro IDE
   2. Find "Manual Release Detection" hook
   3. Click "Run" or "▶" button
   4. Confirm execution
   
   **Alternative**: Run script directly: `./.kiro/hooks/release-manager.sh auto`
   ```

3. **Update Workflow Diagram**
   ```markdown
   ## Task Completion Workflow
   
   1. Complete parent task work
   2. Create detailed completion document: `.kiro/specs/[spec-name]/completion/task-N-parent-completion.md`
   3. Create summary document: `docs/specs/[spec-name]/task-N-summary.md`
   4. **[AUTOMATIC]** Release detection hook triggers (on summary doc creation)
   5. **[AUTOMATIC]** Release trigger files created
   6. **[MANUAL]** Organize files (optional): `./.kiro/hooks/organize-by-metadata.sh`
   7. **[MANUAL]** Commit changes: `./.kiro/hooks/commit-task.sh "Task Name"`
   ```

4. **Update Troubleshooting Section**
   ```markdown
   ### Release Detection Not Triggering
   
   **Check**:
   - Did you create the summary document? (`task-N-summary.md` in `docs/specs/[spec-name]/`)
   - Did you use the correct naming format? (`task-N-summary.md`)
   - Is the file in the correct location? (`docs/specs/[spec-name]/`, NOT `.kiro/`)
   - Is the automatic hook enabled? (Check Agent Hooks panel)
   
   **Common mistake**: Creating summary in `.kiro/` directory (filtered from file watching)
   
   **Fallback**: Use manual release detection hook or run script directly
   ```

5. **Add ".kiro/ Directory Filtering" Explanation**
   ```markdown
   ### Kiro IDE File Watching Behavior
   
   **Important**: The `.kiro/` directory is filtered from Kiro IDE's file watching system. This means:
   
   ❌ **Hooks will NOT trigger** for files created in:
   - `.kiro/specs/`
   - `.kiro/hooks/`
   - `.kiro/logs/`
   - Any subdirectory of `.kiro/`
   
   ✅ **Hooks WILL trigger** for files created in:
   - `docs/`
   - `src/`
   - Root directory
   - Any non-hidden directory
   
   **Why this matters**: Parent task summary documents must be created in `docs/specs/[spec-name]/` 
   to trigger automatic release detection. Detailed completion docs can remain in `.kiro/` since 
   they don't need to trigger hooks.
   ```

---

### Component 5: File Organization Standards Documentation Update

**Purpose**: Document the new summary document location and organization metadata

**Location**: `.kiro/steering/File Organization Standards.md`

**Changes Required:**

1. **Add Summary Document Organization Metadata**
   ```markdown
   ### Summary Documents
   
   **Organization**: `spec-summary`
   **Scope**: `[spec-name]`
   **Location**: `docs/specs/[spec-name]/`
   
   **Purpose**: Concise, commit-style summaries of parent task completion that trigger release detection hooks
   
   **Naming**: `task-N-summary.md`
   
   **Example**:
   ```markdown
   # Task 1 Summary: Fix Release Detection Triggers
   
   **Date**: October 30, 2025
   **Purpose**: Concise summary of parent task completion
   **Organization**: spec-summary
   **Scope**: release-detection-trigger-fix
   
   ## What Was Done
   [Summary content...]
   ```
   ```

2. **Update Directory Structure Documentation**
   ```markdown
   ### Spec-Specific Organization
   
   ```
   docs/
   └── specs/
       └── [spec-name]/
           ├── task-1-summary.md              # Parent task summaries (trigger hooks)
           └── task-2-summary.md              # Parent task summaries (trigger hooks)
   
   .kiro/
   └── specs/
       └── [spec-name]/
           ├── requirements.md                 # Spec requirements
           ├── design.md                      # Spec design
           ├── tasks.md                       # Implementation tasks
           ├── validation/                    # Spec-specific validation artifacts
           │   └── [validation-files].md
           └── completion/                    # Spec-specific completion documentation
               ├── task-1-parent-completion.md  # Parent task detailed docs
               ├── task-1-1-completion.md       # Subtask completion docs
               └── task-1-2-completion.md       # Subtask completion docs
   ```
   ```

3. **Add Cross-Reference Guidance**
   ```markdown
   ### Cross-References Between Summary and Detailed Docs
   
   **In Summary Documents** (`docs/specs/[spec-name]/task-N-summary.md`):
   - Link to detailed completion doc for full context
   - Example: `For detailed implementation notes, see [task-1-parent-completion.md](../../.kiro/specs/[spec-name]/completion/task-1-parent-completion.md)`
   
   **In Detailed Completion Documents** (`.kiro/specs/[spec-name]/completion/task-N-parent-completion.md`):
   - Link to summary doc for public-facing version
   - Example: `Public summary: [task-1-summary.md](../../../../docs/specs/[spec-name]/task-1-summary.md)`
   
   **In Tasks Document** (`.kiro/specs/[spec-name]/tasks.md`):
   - Link to both summary and detailed docs
   - Example:
     ```markdown
     **Completion Documentation:**
     - Detailed: `.kiro/specs/[spec-name]/completion/task-1-parent-completion.md`
     - Summary: `docs/specs/[spec-name]/task-1-summary.md` (triggers release detection)
     ```
   ```

---

## Data Models

### Hook Configuration Schema

Based on your working `.kiro/hooks/organize-after-completion.kiro.hook`:

```typescript
interface KiroHook {
  enabled: boolean;
  name: string;
  description: string;
  version: string;
  when: {
    type: "fileCreated" | "fileEdited" | "fileDeleted" | "manual";
    patterns?: string[];  // For file-based triggers
  };
  then: {
    type: "runShellScript" | "askAgent";
    script?: string;      // For runShellScript
    prompt?: string;      // For askAgent
  };
}
```

### File Naming Patterns

```typescript
interface CompletionDocumentNaming {
  parentTask: {
    format: "task-{N}-parent-completion.md";
    pattern: "**/*task-*-parent-completion.md";
    examples: [
      "task-1-parent-completion.md",
      "task-2-parent-completion.md",
      "task-10-parent-completion.md"
    ];
  };
  subtask: {
    format: "task-{N.M}-completion.md";
    pattern: "**/*task-*-*-completion.md";  // Has extra dash
    examples: [
      "task-1-1-completion.md",
      "task-2-3-completion.md",
      "task-10-5-completion.md"
    ];
  };
}
```

---

## Error Handling

### Hook Trigger Failures

**Scenario**: Hook doesn't trigger when parent task completion document is created

**Detection**:
- No entry in `.kiro/logs/release-manager.log`
- No trigger files in `.kiro/release-triggers/`

**Recovery**:
1. Check file naming (must be `task-N-parent-completion.md`)
2. Check hook is enabled in Agent Hooks panel
3. Use manual release detection hook
4. Run script directly: `./.kiro/hooks/release-manager.sh auto`

### Script Execution Failures

**Scenario**: Hook triggers but release-manager.sh fails

**Detection**:
- Entry in log file but errors present
- No trigger files created

**Recovery**:
- Check `.kiro/logs/release-manager.log` for error messages
- Verify npm is available: `which npm`
- Verify release:detect script exists in package.json
- Run script manually to see full error output

### Pattern Matching Edge Cases

**Scenario**: File created but doesn't match pattern

**Examples**:
- `task-1-completion.md` (old format, no "-parent-")
- `task-1-1-completion.md` (subtask, has dot notation)
- `task-parent-completion.md` (missing number)

**Behavior**: Hook doesn't trigger (by design)

**Recovery**: Rename file to correct format or use manual trigger

---

## Testing Strategy

### Unit Testing (Manual Verification)

**Test 1: Automatic Hook Triggers on Parent Task Creation**
```bash
# Create test parent task completion document
mkdir -p .kiro/specs/test-spec/completion
echo "# Test Parent Task Completion" > .kiro/specs/test-spec/completion/task-1-parent-completion.md

# Expected: Hook triggers within 5 seconds
# Verify: Check .kiro/logs/release-manager.log for entry
# Verify: Check .kiro/release-triggers/ for new trigger file

# Cleanup
rm -rf .kiro/specs/test-spec
```

**Test 2: Hook Doesn't Trigger on Subtask Creation**
```bash
# Create test subtask completion document
mkdir -p .kiro/specs/test-spec/completion
echo "# Test Subtask Completion" > .kiro/specs/test-spec/completion/task-1-1-completion.md

# Expected: Hook does NOT trigger
# Verify: No new entry in .kiro/logs/release-manager.log
# Verify: No new trigger file in .kiro/release-triggers/

# Cleanup
rm -rf .kiro/specs/test-spec
```

**Test 3: Manual Hook Works**
```bash
# Trigger manual hook from Agent Hooks panel
# Or run script directly: ./.kiro/hooks/release-manager.sh auto

# Expected: Script executes successfully
# Verify: Entry in .kiro/logs/release-manager.log
# Verify: Trigger files created if completion docs exist
```

### Integration Testing

**Test 4: End-to-End Workflow**
```bash
# 1. Complete a real parent task
# 2. Create completion document with new naming format
# 3. Verify automatic hook triggers
# 4. Verify release trigger files created
# 5. Run release analysis: npm run release:analyze
# 6. Verify version bump calculated correctly
```

---

## Design Decisions

### Decision 1: Forward-Looking Naming Convention Change

**Options Considered**:
1. Rename all existing parent task completion documents
2. Support both old and new formats in hooks
3. New format for future specs only (chosen)

**Decision**: New format for future specs only

**Rationale**:
- **Simplicity**: No migration complexity, no cross-reference updates needed
- **Clean Break**: Since hooks never worked (wrong trigger type), there's no "existing functionality" to preserve
- **Low Risk**: Existing docs remain unchanged, no chance of breaking links
- **Clear Pattern**: Hook pattern is simple and unambiguous

**Trade-offs**:
- ✅ **Gained**: Simple implementation, no migration risk, clean pattern
- ❌ **Lost**: Inconsistency between old and new completion docs
- ⚠️ **Risk**: Developers might forget new convention (mitigated by documentation)

**Counter-Arguments**:
- **Argument**: "Inconsistent naming across specs looks unprofessional"
- **Response**: Consistency is less important than avoiding migration risk. The old docs work fine, and new docs will use the correct format going forward.

### Decision 2: Use `.kiro.hook` Format (Not `.json`)

**Options Considered**:
1. Use `.json` files in `.kiro/agent-hooks/` directory
2. Use `.kiro.hook` files in `.kiro/hooks/` directory (chosen)

**Decision**: Use `.kiro.hook` format

**Rationale**:
- **Proven**: Your working file organization hook uses this format
- **Kiro IDE Native**: This is the format Kiro IDE actually supports
- **Previous Failure**: The `.json` files never worked because they used unsupported trigger type

**Trade-offs**:
- ✅ **Gained**: Hooks that actually work, proven format
- ❌ **Lost**: Nothing (the `.json` files never worked)

**Counter-Arguments**:
- **Argument**: "The documentation showed `.json` format"
- **Response**: The documentation may have been outdated or the `.json` format requires different trigger types. We should use what actually works.

### Decision 3: Parent Tasks Only (No Subtask Triggers)

**Options Considered**:
1. Trigger on every subtask completion
2. Trigger on parent task completion only (chosen)
3. Configurable (user chooses)

**Decision**: Parent task completion only

**Rationale**:
- **Aligns with Spec Planning Standards**: Parent tasks represent complete features with success criteria
- **Reduces Noise**: One trigger per feature vs 5-10 triggers per feature
- **Better Signal**: Release notes should reflect complete features, not implementation steps
- **Cleaner Version Bumps**: Parent task = feature = minor bump (clear signal)

**Trade-offs**:
- ✅ **Gained**: Clean signals, meaningful releases, less noise
- ❌ **Lost**: Immediate feedback after subtasks (can use manual trigger if needed)

**Counter-Arguments**:
- **Argument**: "Want feedback after each subtask"
- **Response**: Manual trigger provides this capability. Automatic trigger should optimize for meaningful releases, not maximum frequency.

---

## Integration Points

### Dependencies

**Kiro IDE**:
- Depends on Kiro IDE's file system watcher
- Depends on `fileCreated` trigger type support
- Depends on Agent Hooks panel for manual triggers

**Release Manager Script**:
- Depends on `.kiro/hooks/release-manager.sh` (already fixed in previous spec)
- Depends on npm and release:detect script
- Depends on git for detecting recent changes

**Spec Planning Standards**:
- Depends on developers following new naming convention
- Depends on documentation being updated and accessible

### Dependents

**Future Specs**:
- All future specs will use new parent task naming convention
- Completion documents will trigger automatic release detection

**Release Analysis System**:
- Depends on trigger files created by release manager
- Depends on completion documents being in correct format

**Development Workflow**:
- Developers depend on automatic release detection working
- Developers depend on manual fallback being available

---

## Migration Strategy

**No migration required** - this is a forward-looking change.

**For Existing Specs**:
- Completion documents remain unchanged
- No renaming needed
- No cross-reference updates needed
- Hooks won't trigger for old format (by design)

**For New Specs**:
- Use new naming convention: `task-N-parent-completion.md`
- Automatic release detection will work
- Follow updated Spec Planning Standards

**Transition Period**:
- Both formats coexist (old specs use old format, new specs use new format)
- No conflicts or issues
- Clean, simple transition

---

*This design provides a reliable, forward-looking solution for automatic release detection by using supported Kiro IDE trigger types and a clear naming convention that enables simple pattern matching.*
