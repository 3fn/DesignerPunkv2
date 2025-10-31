# Design Document: Infrastructure Automation Fixes

**Date**: October 29, 2025
**Spec**: infrastructure-automation-fixes
**Status**: Design Phase
**Dependencies**: release-detection-infrastructure-investigation

---

## Overview

This design implements 10 specific fixes for infrastructure automation failures identified through systematic investigation. The fixes are organized into three priority tiers and focus on restoring release detection automation, improving debugging visibility, and enhancing system reliability.

**Design Approach**: Surgical fixes to existing scripts and documentation rather than architectural changes. Each fix is independent and can be implemented incrementally. The design preserves existing functionality while addressing specific bugs and gaps.

**Key Principles**:
- Minimal changes to achieve maximum impact
- Preserve existing behavior except where bugs exist
- Add visibility without changing core logic
- Document intentional design decisions
- Enable validation through existing test scripts

---

## Architecture

### Current System Architecture

```
Developer Workflow
    ↓
taskStatus Tool (marks task complete)
    ↓
Kiro IDE (emits taskStatusChange event)
    ↓
Agent Hook System (matches event to hooks)
    ↓
┌─────────────────────────────────────────┐
│ File Organization Hook (runs first)     │
│ - organize-after-task.sh                │
│ - Requires user confirmation            │
│ - 10-minute timeout                     │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ Release Detection Hook (runs after)     │
│ - release-manager.sh auto               │
│ - Auto-approve (no confirmation)        │
│ - 5-minute timeout                      │
│ - runAfter: organize-after-task         │
└─────────────────────────────────────────┘
    ↓
Release Manager Script
    ├─ Detects completion documents
    ├─ Creates trigger files
    └─ Processes with TypeScript system
```

### Problem Points (Before Fixes)

```
Release Manager Script (line 117)
    ↓
npm run release:detect process-triggers  ❌ WRONG SYNTAX
    ↓
npm hangs looking for non-existent script
    ↓
Output redirected to /dev/null (errors hidden)
    ↓
Script stalls indefinitely
    ↓
Hook times out after 5 minutes
    ↓
Appears as silent failure (no logs)
```

### Fixed Architecture (After Implementation)

```
Release Manager Script (line 117)
    ↓
npm run release:detect -- process-triggers  ✅ CORRECT SYNTAX
    ↓
npm passes arguments correctly
    ↓
Output redirected to log file (errors visible)
    ↓
Script completes successfully
    ↓
Hook completes within timeout
    ↓
Entry logging confirms execution
```

---

## Components and Interfaces

### Component 1: release-manager.sh Script Fixes

**File**: `.kiro/hooks/release-manager.sh`

**Current Issues**:
- Line 117: Incorrect npm syntax causes stall
- Line 117: Output redirection hides errors
- No entry logging to confirm hook triggering

**Fix Design**:

```bash
# BEFORE (lines 115-120):
log "Attempting to process trigger with TypeScript release system..."
if cd "$PROJECT_ROOT" && npm run release:detect process-triggers >/dev/null 2>&1; then
    success "Release trigger processed by TypeScript system"
else
    log "TypeScript release system not available, trigger queued for manual processing"
fi

# AFTER (lines 1-10 + 115-120):
#!/bin/bash
# Add at start of script (after shebang)
LOG_FILE=".kiro/logs/release-manager.log"

# Entry logging function
log_entry() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Hook triggered by Kiro IDE agent hook system" >> "$LOG_FILE"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Event: taskStatusChange, Status: completed" >> "$LOG_FILE"
}

# Call entry logging at script start
log_entry

# ... existing script content ...

# Fixed npm command (line 117):
log "Attempting to process trigger with TypeScript release system..."
if cd "$PROJECT_ROOT" && npm run release:detect -- process-triggers >> "$LOG_FILE" 2>&1; then
    success "Release trigger processed by TypeScript system"
else
    log "TypeScript release system not available, trigger queued for manual processing"
fi
```

**Changes**:
1. **Line 117 npm syntax**: Add `--` separator before `process-triggers`
2. **Line 117 output**: Change `>/dev/null 2>&1` to `>> "$LOG_FILE" 2>&1`
3. **Lines 1-10**: Add entry logging function and call at script start

**Validation**: Run `test-manual-release-detection.sh` to verify script completes without stalling

---

### Component 2: organize-after-task.sh Entry Logging

**File**: `.kiro/agent-hooks/organize-after-task.sh`

**Current Issue**: No entry logging to confirm hook triggering

**Fix Design**:

```bash
#!/bin/bash
# Add at start of script (after shebang)
LOG_FILE=".kiro/logs/file-organization.log"

# Entry logging function
log_entry() {
    echo "[$(date '+%Y-%m-%d %H:%M:SS')] Hook triggered by Kiro IDE agent hook system" >> "$LOG_FILE"
    echo "[$(date '+%Y-%m-%d %H:%M:%SS')] Event: taskStatusChange, Status: completed" >> "$LOG_FILE"
}

# Call entry logging at script start
log_entry

# ... existing script content ...
```

**Changes**:
1. Add entry logging function at script start
2. Call entry logging before any other operations
3. Use dedicated log file for file organization

**Validation**: Mark task complete and check `.kiro/logs/file-organization.log` for entry message

---

### Component 3: organize-by-metadata.sh Cross-Reference Fixes

**File**: `.kiro/agent-hooks/organize-by-metadata.sh`

**Current Issues**:
- Cross-reference update logic has path handling concerns
- Python dependency not clearly communicated

**Fix Design**:

```bash
# Add Python dependency check
check_python() {
    if ! command -v python3 &> /dev/null; then
        echo "ERROR: Python 3 is required for cross-reference updates but not found"
        echo "Please install Python 3 or update cross-references manually"
        return 1
    fi
    return 0
}

# Improve cross-reference update with better error handling
update_cross_references() {
    local old_path="$1"
    local new_path="$2"
    
    if ! check_python; then
        log "WARNING: Skipping cross-reference updates (Python not available)"
        return 0
    fi
    
    log "Updating cross-references from $old_path to $new_path"
    
    # Calculate relative path correctly
    local relative_path=$(python3 -c "import os.path; print(os.path.relpath('$new_path', os.path.dirname('$old_path')))")
    
    if [ $? -ne 0 ]; then
        log "ERROR: Failed to calculate relative path for cross-reference update"
        log "  Old path: $old_path"
        log "  New path: $new_path"
        return 1
    fi
    
    # Update cross-references in all markdown files
    find . -name "*.md" -type f -exec sed -i.bak "s|$old_path|$relative_path|g" {} \;
    
    log "Cross-references updated successfully"
    return 0
}
```

**Changes**:
1. Add Python dependency check with clear error message
2. Improve error handling for path calculation
3. Add specific logging for cross-reference operations
4. Gracefully handle missing Python (skip updates with warning)

**Validation**: Run `test-file-organization.sh` to verify cross-reference updates

---

### Component 4: commit-task.sh Help Flag Handling

**File**: `.kiro/hooks/commit-task.sh`

**Current Issue**: Treats `--help` as a task name instead of displaying help

**Fix Design**:

```bash
#!/bin/bash

# Add help function
show_help() {
    cat << EOF
Usage: commit-task.sh [OPTIONS] "Task Name"

Commit completed task with standardized message format.

OPTIONS:
    -h, --help      Display this help message
    
ARGUMENTS:
    Task Name       The name of the completed task (required)
                    Example: "1. Create North Star Vision Document"

EXAMPLES:
    # Display help
    commit-task.sh --help
    
    # Commit a completed task
    commit-task.sh "1. Create North Star Vision Document"
    
    # Commit with task number
    commit-task.sh "Task 2.3 Complete: Create Typography Guides"

NOTES:
    - Task name should match the task in tasks.md
    - Commit message format: "Task [Number] Complete: [Description]"
    - Changes are automatically pushed to origin main

EOF
    exit 0
}

# Check for help flags BEFORE processing task name
if [ "$1" = "--help" ] || [ "$1" = "-h" ] || [ -z "$1" ]; then
    show_help
fi

# ... existing script content for task processing ...
```

**Changes**:
1. Add `show_help()` function with comprehensive usage information
2. Check for help flags (`--help`, `-h`) before task name processing
3. Display help and exit if no arguments provided
4. Preserve existing task processing logic

**Validation**: Run `commit-task.sh --help` and verify help is displayed

---

### Component 5: Development Workflow Documentation Updates

**File**: `.kiro/steering/Development Workflow.md`

**Current Issues**:
- runAfter behavior not documented
- File organization scope limitation not explained
- Hook troubleshooting guidance missing

**Fix Design**:

Add new sections to Development Workflow documentation:

**Section 1: Agent Hook Execution Order**
```markdown
### Agent Hook Execution Order

**runAfter Dependencies**:

The release detection hook depends on file organization completing first:
- File organization runs first (requires user confirmation)
- Release detection runs after (auto-approve, no confirmation)
- Dependency specified via `runAfter: ["organize-after-task-completion"]`

**Dependency Behavior**:

- **Execution Order**: runAfter specifies execution order, not hard dependency
- **Prerequisite Failure**: If file organization fails, release detection behavior depends on Kiro IDE implementation (currently unclear - requires testing)
- **User Cancellation**: If user declines file organization, release detection behavior depends on Kiro IDE implementation (currently unclear - requires testing)
- **Timeout**: Each hook has independent timeout (file organization: 10 min, release detection: 5 min)

**Troubleshooting**:

To verify hooks are triggering:
1. Check `.kiro/logs/file-organization.log` for file organization entry message
2. Check `.kiro/logs/release-manager.log` for release detection entry message
3. If entry messages present: hooks are triggering (check for execution errors)
4. If no entry messages: hooks are not triggering (check Kiro IDE event emission)
```

**Section 2: File Organization Scope**
```markdown
### File Organization Scope

**Intentional Design**:

File organization scans **root directory only**, not subdirectories:
- **Rationale**: Completion documents are in subdirectories (`.kiro/specs/*/completion/`)
- **Purpose**: Organization targets new files created in root directory
- **Behavior**: Files in subdirectories are not automatically organized

**Manual Organization**:

To organize files in subdirectories:
1. Add **Organization** metadata to file header
2. Manually move file to appropriate directory
3. Update cross-references if needed
4. Or: Move file to root directory temporarily, let automation organize it, then move to subdirectory
```

**Section 3: Hook Troubleshooting**
```markdown
### Hook Troubleshooting

**Verifying Hook Execution**:

1. **Check Entry Logs**:
   - File organization: `.kiro/logs/file-organization.log`
   - Release detection: `.kiro/logs/release-manager.log`
   - Entry message format: `[YYYY-MM-DD HH:MM:SS] Hook triggered by Kiro IDE agent hook system`

2. **Check Hook Configurations**:
   - Run `test-hook-configuration.sh` to verify configurations are valid
   - Check `.kiro/agent-hooks/*.json` for syntax errors

3. **Manual Trigger**:
   - File organization: Not available (requires IDE event)
   - Release detection: `./.kiro/hooks/release-manager.sh auto`

**Common Issues**:

- **No entry logs**: Hooks not triggering (Kiro IDE event emission issue)
- **Entry logs but no completion**: Hook executing but failing (check error logs)
- **Timeout**: Hook taking too long (check for stalls or infinite loops)
```

**Changes**:
1. Document runAfter dependency behavior
2. Explain file organization scope limitation
3. Provide troubleshooting guidance
4. Add manual trigger information

**Validation**: Review documentation for completeness and accuracy

---

### Component 6: Long-Term IDE Improvements Documentation

**File**: `.kiro/specs/infrastructure-automation-fixes/ide-feature-requests.md` (new file)

**Purpose**: Document long-term improvements requiring Kiro IDE team involvement

**Content Structure**:

```markdown
# Kiro IDE Feature Requests: Infrastructure Automation

**Date**: October 29, 2025
**Spec**: infrastructure-automation-fixes
**Status**: Documented for Future Implementation
**Priority**: Medium (improves debugging experience significantly)

---

## Feature Request 1: Agent Hook Execution Logging

**Problem**: No logging for agent hook execution makes debugging extremely difficult

**Requested Capabilities**:

1. **Event Emission Logging**:
   - Log when taskStatusChange events are emitted
   - Include event metadata (task name, status, file path)
   - Include timestamp and source (which tool emitted event)

2. **Hook Triggering Logging**:
   - Log when agent hook system receives events
   - Log when events are matched against hooks
   - Include which hooks matched and why

3. **Hook Execution Logging**:
   - Log when hooks start execution
   - Log when hooks complete successfully
   - Log when hooks fail or timeout
   - Include execution time and exit code

4. **Dependency Chain Logging**:
   - Log when hooks wait for dependencies
   - Log when dependencies complete
   - Log when dependency chain fails

**Example Log Format**:
[See detailed example in root cause analysis]

**Benefits**:
- Enables verification of hook execution
- Significantly improves debugging experience
- Reduces time spent debugging hook issues
- Enables verification of runAfter dependencies

**Priority**: Medium (important for long-term maintainability)

---

## Feature Request 2: runAfter Failure Handling Configuration

**Problem**: runAfter behavior unclear when dependencies fail, timeout, or are cancelled

**Requested Capabilities**:

Add configuration options for dependency failure handling:

```json
"settings": {
  "runAfter": ["organize-after-task-completion"],
  "continueOnFailure": true,
  "continueOnSkip": true,
  "continueOnTimeout": false
}
```

**Configuration Options**:
- `continueOnFailure`: Run dependent hook if prerequisite fails
- `continueOnSkip`: Run dependent hook if user skips prerequisite
- `continueOnTimeout`: Run dependent hook if prerequisite times out

**Benefits**:
- Explicit control over failure handling
- Predictable behavior in all scenarios
- Easier to design reliable hook chains
- Self-documenting configuration

**Priority**: Low (nice to have, not critical)

---

*These feature requests are documented for future submission to Kiro IDE team. Implementation timeline depends on Kiro team priorities.*
```

**Changes**:
1. Create new document for IDE feature requests
2. Document detailed logging requirements
3. Document runAfter failure handling requirements
4. Include rationale, benefits, and priority assessment

**Validation**: Review with Kiro IDE team when appropriate

---

## Data Models

### Entry Log Format

```
[YYYY-MM-DD HH:MM:SS] Hook triggered by Kiro IDE agent hook system
[YYYY-MM-DD HH:MM:SS] Event: taskStatusChange, Status: completed
```

**Fields**:
- Timestamp: ISO 8601 format (YYYY-MM-DD HH:MM:SS)
- Trigger source: "Kiro IDE agent hook system"
- Event type: "taskStatusChange"
- Event status: "completed"

**Purpose**: Provides evidence that hook was triggered by IDE

---

### Error Log Format

```
[YYYY-MM-DD HH:MM:SS] ERROR: [Error description]
[YYYY-MM-DD HH:MM:SS]   Context: [Additional context]
[YYYY-MM-DD HH:MM:SS]   File: [File path if applicable]
```

**Fields**:
- Timestamp: ISO 8601 format
- Error level: ERROR, WARNING, INFO
- Error description: Human-readable error message
- Context: Additional information for debugging
- File path: Relevant file path if applicable

**Purpose**: Provides actionable error information for debugging

---

## Error Handling

### Script Execution Errors

**Strategy**: Log errors with context, continue execution where possible

**Implementation**:
```bash
# Check for errors and log with context
if [ $? -ne 0 ]; then
    log "ERROR: Command failed"
    log "  Command: $command"
    log "  Exit code: $?"
    log "  Context: $context"
    return 1
fi
```

**Rationale**: Errors should be visible in logs but shouldn't crash entire script

---

### Missing Dependencies

**Strategy**: Check for dependencies, provide clear error messages, gracefully degrade

**Implementation**:
```bash
# Check for Python dependency
if ! command -v python3 &> /dev/null; then
    log "WARNING: Python 3 not available, skipping cross-reference updates"
    log "  Install Python 3 for automatic cross-reference updates"
    log "  Or update cross-references manually after file organization"
    return 0  # Continue without cross-reference updates
fi
```

**Rationale**: Missing dependencies shouldn't block core functionality

---

### npm Command Failures

**Strategy**: Redirect output to log file, check exit code, provide context

**Implementation**:
```bash
# Run npm command with output to log
if cd "$PROJECT_ROOT" && npm run release:detect -- process-triggers >> "$LOG_FILE" 2>&1; then
    log "SUCCESS: TypeScript release system processed trigger"
else
    log "WARNING: TypeScript release system not available or failed"
    log "  Check log file for npm output: $LOG_FILE"
    log "  Trigger file queued for manual processing"
fi
```

**Rationale**: npm failures should be visible but not block trigger file creation

---

## Testing Strategy

### Unit Testing

**Approach**: Use existing test scripts from investigation

**Test Scripts**:
1. `test-manual-release-detection.sh` - Validates release-manager.sh execution
2. `test-hook-configuration.sh` - Validates hook configuration correctness
3. `test-event-emission.sh` - Detects evidence of hook triggering
4. `test-file-organization.sh` - Validates file organization behavior

**Validation Criteria**:
- All test scripts pass after fixes implemented
- Scripts complete without errors
- Expected log entries present
- Expected files created

---

### Integration Testing

**Approach**: End-to-end testing of complete workflow

**Test Procedure**:
1. Mark a task complete using taskStatus tool
2. Wait 30 seconds for hooks to execute
3. Check `.kiro/logs/file-organization.log` for entry message
4. Check `.kiro/logs/release-manager.log` for entry message
5. Check `.kiro/release-triggers/` for new trigger files
6. Verify trigger files are processed (status changes from "pending")
7. Confirm no manual intervention required

**Success Criteria**:
- Entry logs confirm both hooks triggered
- Trigger files created and processed
- No errors in log files
- Automation works end-to-end

---

### Regression Testing

**Approach**: Verify existing functionality not broken by fixes

**Test Cases**:
1. Manual release detection still works: `./.kiro/hooks/release-manager.sh auto`
2. File organization still works with user confirmation
3. commit-task.sh still processes task names correctly
4. Existing hook configurations still valid

**Success Criteria**:
- All existing functionality preserved
- No new errors introduced
- Performance not degraded

---

## Design Decisions

### Decision 1: Surgical Fixes vs Architectural Changes

**Options Considered**:
1. Rewrite release manager script from scratch
2. Redesign agent hook system
3. Surgical fixes to existing code (chosen)

**Decision**: Surgical fixes to existing code

**Rationale**:

The investigation revealed specific, well-understood bugs that can be fixed with minimal changes. Rewriting or redesigning would:
- Introduce new risks and potential bugs
- Require extensive testing and validation
- Delay restoration of automation
- Potentially break existing functionality

Surgical fixes:
- Address root causes directly
- Minimize risk of introducing new issues
- Enable incremental implementation and validation
- Preserve existing functionality
- Can be implemented quickly

The investigation already validated that the architecture is sound - the issues are implementation bugs, not design flaws.

**Trade-offs**:
- ✅ **Gained**: Low risk, fast implementation, preserves existing functionality
- ❌ **Lost**: Opportunity to improve architecture (not needed)
- ⚠️ **Risk**: Minimal - fixes are well-understood and testable

**Counter-Arguments**:
- **Argument**: "Rewriting would be cleaner and more maintainable"
- **Response**: The existing code is well-structured and maintainable. The bugs are specific and isolated. Rewriting would introduce unnecessary risk without proportional benefit.

---

### Decision 2: Entry Logging vs Comprehensive Logging

**Options Considered**:
1. Entry logging only (chosen)
2. Comprehensive logging throughout script
3. No logging (rely on Kiro IDE logging)

**Decision**: Entry logging only

**Rationale**:

The primary problem is inability to verify if hooks are triggering. Entry logging solves this specific problem without adding excessive logging overhead.

Comprehensive logging would:
- Add significant code changes
- Increase log file size
- Potentially impact performance
- Require more extensive testing

Entry logging:
- Solves the immediate problem (verification of triggering)
- Minimal code changes (3-4 lines per script)
- Low performance impact
- Easy to test and validate

The scripts already have logging for important operations. Entry logging fills the specific gap identified by investigation.

**Trade-offs**:
- ✅ **Gained**: Solves verification problem, minimal changes, low risk
- ❌ **Lost**: Detailed execution logging (not needed for current issues)
- ⚠️ **Risk**: Minimal - entry logging is simple and well-understood

**Counter-Arguments**:
- **Argument**: "Comprehensive logging would help with future debugging"
- **Response**: True, but not needed to solve current problem. Can add more logging later if needed. Entry logging provides 80% of value with 20% of effort.

---

### Decision 3: Fix Cross-References vs Document Limitation

**Options Considered**:
1. Fix cross-reference update logic (chosen)
2. Document limitation and require manual updates
3. Remove cross-reference updates entirely

**Decision**: Fix cross-reference update logic

**Rationale**:

Cross-reference updates are valuable automation that should work reliably. The investigation identified specific reliability concerns that can be addressed with better error handling and dependency checking.

Documenting limitation would:
- Reduce automation value
- Require manual work after file organization
- Create friction in workflow

Removing updates would:
- Break existing functionality
- Require manual cross-reference updates
- Reduce system reliability

Fixing the logic:
- Preserves automation value
- Improves reliability with better error handling
- Gracefully handles missing dependencies
- Provides clear error messages

**Trade-offs**:
- ✅ **Gained**: Reliable automation, better error handling, graceful degradation
- ❌ **Lost**: Slightly more complex code (minimal)
- ⚠️ **Risk**: Low - improvements are defensive and well-tested

**Counter-Arguments**:
- **Argument**: "Cross-reference updates are complex and error-prone"
- **Response**: The investigation showed the logic works but needs better error handling. Fixing error handling is lower risk than removing functionality.

---

### Decision 4: Document Long-Term Improvements vs Implement Workarounds

**Options Considered**:
1. Document for future IDE team implementation (chosen)
2. Implement workarounds in scripts
3. Ignore long-term improvements

**Decision**: Document for future IDE team implementation

**Rationale**:

Three fixes require Kiro IDE team involvement and cannot be implemented in scripts:
- Comprehensive IDE logging
- runAfter failure handling configuration
- Hook execution visibility in IDE UI

Implementing workarounds would:
- Not solve the fundamental problem (IDE logging gap)
- Add complexity to scripts
- Potentially conflict with future IDE features

Ignoring improvements would:
- Miss opportunity to improve long-term maintainability
- Leave debugging difficult for future issues

Documenting for IDE team:
- Preserves requirements for future implementation
- Provides detailed specifications for IDE team
- Enables future improvements without blocking current fixes
- Maintains clear separation between script fixes and IDE features

**Trade-offs**:
- ✅ **Gained**: Clear requirements for future improvements, no script complexity
- ❌ **Lost**: Immediate implementation of IDE features (not possible)
- ⚠️ **Risk**: None - documentation doesn't impact current fixes

**Counter-Arguments**:
- **Argument**: "Should implement workarounds to solve problems now"
- **Response**: The problems (IDE logging, runAfter configuration) cannot be solved with script workarounds. They require IDE changes. Documenting requirements enables future implementation.

---

*This design document provides surgical fixes for infrastructure automation failures, preserving existing functionality while addressing specific bugs and gaps identified through investigation. All fixes are independently testable and can be implemented incrementally.*
