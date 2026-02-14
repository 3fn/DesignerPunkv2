---
inclusion: manual
name: Process-Hook-Operations
description: Agent hook operational guidance — dependency chains, execution order, automatic file organization, release detection, troubleshooting, and best practices. Load when debugging hook issues, setting up or modifying hooks, or troubleshooting automation failures.
---

# Hook Operations Guide

**Date**: 2026-01-04
**Last Reviewed**: 2026-01-04
**Purpose**: Comprehensive operational guidance for agent hook dependency chains, troubleshooting, and best practices
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 2
**Relevant Tasks**: hook-debugging, hook-setup, automation-troubleshooting

## Overview

This document provides detailed operational guidance for working with Kiro agent hooks. It covers dependency chain behavior, troubleshooting procedures, and best practices for reliable automation.

**When to use this document**:
- Debugging hook issues or automation failures
- Understanding hook dependencies and execution order
- Setting up new hooks or modifying existing ones
- Investigating why dependent hooks didn't execute
- Troubleshooting release detection or file organization issues

**When NOT to use this document**:
- Normal task execution (hooks working correctly)
- General development work
- Creating or updating specs

**Related Documents**:
- **Process-Development-Workflow.md**: Core task completion workflow (always loaded)
- **Release Management System.md**: Release detection pipeline details (query via MCP)
- **Process-File-Organization.md**: File organization metadata and structure (always loaded)

---

## Agent Hook Dependency Chains

Agent hooks can specify dependencies using the `runAfter` configuration field. This creates a dependency chain where hooks wait for prerequisite hooks to complete before executing.

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

In this example, the release detection hook waits for the file organization hook (`organize-after-task-completion`) to complete before executing.

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

### Dependency Chain Behavior

Agent hooks with `runAfter` dependencies create execution chains where dependent hooks wait for prerequisite hooks to complete. Understanding how these chains behave in different scenarios is critical for troubleshooting and ensuring reliable automation.

#### When Prerequisite Hook Succeeds

**Behavior**: The dependent hook executes normally after the prerequisite hook completes successfully.

**Execution Flow**:
1. Prerequisite hook (e.g., file organization) starts execution
2. Prerequisite hook completes all operations successfully
3. Prerequisite hook logs completion message
4. Dependent hook (e.g., release detection) starts immediately
5. Dependent hook executes its operations
6. Both hooks log their execution in respective log files

**Timing**: The dependent hook starts immediately after the prerequisite finishes. There is no artificial delay between hooks - the transition happens as soon as the prerequisite hook's process exits with a success code.

**Logs**: Both hooks log execution in their respective log files with timestamps that show the execution order:
- Prerequisite hook log: `.kiro/logs/file-organization.log`
- Dependent hook log: `.kiro/logs/release-manager.log`

**Example Workflow**:
```
[2025-11-07 10:30:00] File organization hook triggered
[2025-11-07 10:30:15] File organization complete
[2025-11-07 10:30:16] Release detection hook triggered
[2025-11-07 10:30:25] Release detection complete
```

**Verification**:
```bash
# Check both logs to verify successful execution chain
tail -20 .kiro/logs/file-organization.log
tail -20 .kiro/logs/release-manager.log

# Compare timestamps to confirm execution order
grep "Hook triggered" .kiro/logs/file-organization.log
grep "Hook triggered" .kiro/logs/release-manager.log
```

---

#### When Prerequisite Hook Fails

**Behavior**: The dependent hook behavior depends on Kiro IDE implementation when the prerequisite hook fails. Based on current observations, the dependent hook typically does not execute if the prerequisite fails.

**What Constitutes a Failure**:
- Script exits with non-zero exit code
- Unhandled exception or error in hook script
- Missing dependencies (npm, Python, etc.)
- File permission errors
- Invalid configuration or syntax errors

**Expected Behavior**: The dependent hook will likely not execute if the prerequisite fails. The Kiro IDE agent hook system appears to check the exit status of prerequisite hooks before triggering dependent hooks.

**Logs**: The prerequisite hook log will contain error messages indicating the failure:
```
[2025-11-07 10:30:00] File organization hook triggered
[2025-11-07 10:30:05] ERROR: Failed to move file - permission denied
[2025-11-07 10:30:05] Hook execution failed with exit code 1
```

The dependent hook log will show no entry, indicating it was never triggered:
```
# No entries after the prerequisite failure time
```

**Troubleshooting Steps**:

1. **Check prerequisite hook logs first**:
   ```bash
   # Look for errors in prerequisite hook log
   grep "ERROR\|Failed" .kiro/logs/file-organization.log
   
   # View full log for context
   cat .kiro/logs/file-organization.log
   ```

2. **Identify the root cause**:
   - Missing dependencies: Check if npm, Python, or other tools are installed
   - Permission errors: Verify file and directory permissions
   - Configuration errors: Validate hook configuration JSON syntax
   - Script bugs: Review error messages for specific issues

3. **Fix the underlying issue**:
   - Install missing dependencies
   - Fix file permissions with `chmod` or `chown`
   - Correct configuration syntax errors
   - Debug and fix script logic issues

4. **Re-trigger the workflow**:
   - Mark the task complete again to re-trigger hooks
   - Or use manual triggers to test the fix

**Workaround**: If the prerequisite hook failed but you need the dependent hook to run:

```bash
# Run the dependent hook manually
./.kiro/hooks/release-manager.sh auto

# Verify it executed
cat .kiro/logs/release-manager.log
ls -la .kiro/release-triggers/
```

**Recommendation**: Always check prerequisite hook logs first when troubleshooting dependency chain issues. The root cause is usually in the prerequisite hook, not the dependent hook.

**Prevention**:
- Test hooks independently before relying on dependency chains
- Ensure all dependencies (npm, Python, etc.) are installed
- Validate hook configurations regularly
- Monitor logs after task completion to catch failures early

---

#### When Prerequisite Hook Times Out

**Behavior**: The prerequisite hook stops execution after exceeding its timeout limit. The dependent hook behavior depends on whether the timeout is treated as a failure by Kiro IDE.

**Timeout Values**:
- **File organization hook**: 10 minutes
- **Release detection hook**: 5 minutes

These timeout values are configured in the hook configuration files and represent the maximum time a hook can run before being forcibly terminated.

**What Causes Timeouts**:
- npm command stalls (incorrect syntax or network issues)
- Script infinite loops or blocking operations
- Large file operations taking too long
- User confirmation not provided for interactive hooks
- Network latency for remote operations

**Timeout Behavior**:

When a hook times out:
1. The hook process is forcibly terminated by Kiro IDE
2. A timeout message is logged to the hook's log file
3. The hook is considered to have failed (non-zero exit)
4. The dependent hook likely does not execute (treated as failure)

**Logs**: The prerequisite hook log will show a timeout message:
```
[2025-11-07 10:30:00] File organization hook triggered
[2025-11-07 10:30:05] Scanning for files to organize...
[2025-11-07 10:40:00] ERROR: Hook execution timed out after 10 minutes
[2025-11-07 10:40:00] Hook terminated
```

The dependent hook log will show no entry:
```
# No entries - dependent hook was not triggered due to timeout
```

**Troubleshooting Steps**:

1. **Check for timeout messages**:
   ```bash
   # Look for timeout errors
   grep "timeout\|timed out\|terminated" .kiro/logs/file-organization.log
   
   # Check execution duration
   head -1 .kiro/logs/file-organization.log  # Start time
   tail -1 .kiro/logs/file-organization.log  # End time
   ```

2. **Identify the bottleneck**:
   - **Infinite loops**: Review script logic for blocking operations
   - **User confirmation**: Check if hook is waiting for user input
   - **Large operations**: Verify file operations aren't processing too much data

3. **Fix the underlying issue**:
   - Fix infinite loops or blocking operations
   - Provide user confirmation promptly for interactive hooks
   - Optimize file operations or increase timeout if justified

4. **Test with manual trigger**:
   ```bash
   # Test hook execution manually to identify bottleneck
   ./.kiro/agent-hooks/organize-by-metadata.sh
   
   # Time the execution to see if it's close to timeout
   time ./.kiro/agent-hooks/organize-by-metadata.sh
   ```

**Workaround**: If the prerequisite hook timed out but you need the dependent hook to run:

```bash
# Run the dependent hook manually
./.kiro/hooks/release-manager.sh auto

# Verify it executed
cat .kiro/logs/release-manager.log
```

**Prevention**:
- Review hook scripts for potential blocking operations
- Test hooks with realistic data volumes before relying on automation
- Ensure npm commands use correct syntax with `--` separator
- Respond promptly to user confirmation prompts
- Monitor execution times to identify hooks approaching timeout limits

**When to Increase Timeout**:

Consider increasing timeout values if:
- Hook legitimately needs more time for large operations
- Network latency is consistently high
- User confirmation requires more time for review

Update timeout in hook configuration file:
```json
{
  "settings": {
    "timeout": 900  // 15 minutes (in seconds)
  }
}
```

---

#### When User Cancels Prerequisite Hook

**Behavior**: Users can decline confirmation prompts for hooks that require user approval. When a user cancels a prerequisite hook, the dependent hook behavior depends on Kiro IDE implementation.

**Hooks Requiring Confirmation**:
- **File organization hook**: Requires user confirmation before moving files
- **Release detection hook**: Auto-approved, no confirmation required

**Cancellation Scenarios**:

1. **User declines confirmation prompt**:
   - Hook shows preview of actions (e.g., files to organize)
   - User is prompted: "Would you like to organize these files now? [y/N]"
   - User responds with "N" or "n" or simply presses Enter (default is No)
   - Hook exits without performing operations

2. **User closes confirmation dialog**:
   - Hook displays confirmation dialog in IDE
   - User closes dialog without responding
   - Hook treats this as cancellation

**Expected Behavior**: When a user cancels a prerequisite hook:
- The prerequisite hook exits without performing its operations
- The hook may log a cancellation message
- The dependent hook behavior depends on how Kiro IDE treats cancellation:
  - If treated as failure: Dependent hook does not execute
  - If treated as success: Dependent hook may execute (unlikely)
  - Current behavior: Requires testing to confirm

**Logs**: The prerequisite hook log will show a cancellation message:
```
[2025-11-07 10:30:00] File organization hook triggered
[2025-11-07 10:30:05] Found files that need organization
[2025-11-07 10:30:10] User declined confirmation
[2025-11-07 10:30:10] Hook cancelled by user
```

The dependent hook log may or may not show an entry depending on Kiro IDE behavior:
```
# Likely no entry if cancellation is treated as failure
```

**Troubleshooting Steps**:

1. **Verify cancellation occurred**:
   ```bash
   # Check for cancellation messages
   grep "cancelled\|declined\|user" .kiro/logs/file-organization.log
   ```

2. **Check if dependent hook ran**:
   ```bash
   # Check if release detection was triggered despite cancellation
   grep "Hook triggered" .kiro/logs/release-manager.log
   ```

3. **Understand why cancellation occurred**:
   - User intentionally declined (no issue)
   - User didn't see confirmation prompt (UI issue)
   - User unsure about proposed actions (needs better preview)

**Workaround**: If you cancelled the prerequisite hook but need the dependent hook to run:

```bash
# Option 1: Re-trigger the entire workflow
# Mark task complete again to re-trigger hooks
# This time, approve the prerequisite hook confirmation

# Option 2: Run dependent hook manually
./.kiro/hooks/release-manager.sh auto

# Verify it executed
cat .kiro/logs/release-manager.log
```

**Recommendation**: If you cancel a prerequisite hook:
- Understand that dependent hooks may not execute
- Manually run dependent hooks if their operations are still needed
- Consider why you cancelled and whether the hook needs adjustment

**When Cancellation is Appropriate**:
- Hook preview shows unexpected file moves
- You want to review changes before organizing
- Testing hook behavior without committing changes
- Troubleshooting hook issues

**When to Approve Instead**:
- Hook preview shows expected operations
- You trust the hook's logic and metadata
- You want the full automation workflow to complete
- Dependent hooks need to run as part of the workflow



---

## Troubleshooting

This section provides comprehensive guidance for diagnosing and resolving agent hook issues.

### Verifying Hook Execution

**Step 1: Check Entry Logs**

Entry logs confirm whether hooks were triggered by the Kiro IDE agent hook system:

```bash
# Check file organization hook log
cat .kiro/logs/file-organization.log

# Check release detection hook log
cat .kiro/logs/release-manager.log
```

**Entry Message Format**:
```
[YYYY-MM-DD HH:MM:SS] Hook triggered by Kiro IDE agent hook system
[YYYY-MM-DD HH:MM:SS] Event: taskStatusChange, Status: completed
```

**What Entry Logs Tell You**:
- **Entry message present**: Hook was triggered by IDE (check for execution errors in rest of log)
- **No entry message**: Hook was not triggered (IDE event emission issue or configuration problem)

**Step 2: Verify Hook Execution Order**

For hooks with dependencies (like release detection depending on file organization):

```bash
# Compare timestamps in both log files
grep "Hook triggered" .kiro/logs/file-organization.log
grep "Hook triggered" .kiro/logs/release-manager.log
```

**Expected Order**:
1. File organization hook (earlier timestamp)
2. Release detection hook (later timestamp, after organization completes)

**Step 3: Check Hook Configurations**

Verify hook configuration files are valid and correctly structured:

```bash
# Check file organization hook config
cat .kiro/agent-hooks/organize-after-task-completion.json

# Check release detection hook config
cat .kiro/agent-hooks/release-detection-on-task-completion.json

# Validate JSON syntax (should return nothing if valid)
python3 -m json.tool .kiro/agent-hooks/organize-after-task-completion.json > /dev/null
python3 -m json.tool .kiro/agent-hooks/release-detection-on-task-completion.json > /dev/null
```

**Configuration Checklist**:
- ✅ Valid JSON syntax (no trailing commas, proper quotes)
- ✅ `trigger.type` matches expected event (`taskStatusChange`)
- ✅ `trigger.status` matches expected status (`completed`)
- ✅ `runAfter` dependencies reference correct hook names
- ✅ `settings.autoApprove` configured appropriately

### Manual Trigger Commands

When automatic hook triggering fails or for testing purposes:

**File Organization Hook**:
```bash
# File organization requires IDE event - no manual trigger available
# Workaround: Use organize-by-metadata.sh directly
./.kiro/agent-hooks/organize-by-metadata.sh
```

**Release Detection Hook**:
```bash
# Manual trigger for release detection
./.kiro/hooks/release-manager.sh auto

# Check results
cat .kiro/logs/release-manager.log
ls -la .kiro/release-triggers/
```

**When to Use Manual Triggers**:
- After manual git commits that should trigger release analysis
- When automatic detection didn't run
- For testing hook logic independently
- To verify hook scripts work correctly

### Common Issues and Solutions

#### Issue 1: No Entry Logs (Hooks Not Triggering)

**Symptoms**:
- No entry messages in log files
- Hooks don't execute after task completion
- No automatic file organization or release detection

**Causes**:
- Using direct git commands instead of `taskStatus` tool
- Task status not actually changing to "completed"
- Hook configuration disabled or misconfigured
- Kiro IDE not emitting taskStatusChange events

**Solutions**:
1. **Use `taskStatus` tool**: Ensure you're using the tool to mark tasks complete
   ```bash
   # Correct approach (triggers hooks)
   # Use taskStatus tool in Kiro IDE
   
   # Wrong approach (bypasses hooks)
   # git commit -m "message" && git push
   ```

2. **Verify task status changed**: Check tasks.md to confirm task is marked `[x]`

3. **Check hook configurations**: Verify JSON files are valid and enabled

4. **Test with manual trigger**: Use manual trigger commands to verify hook scripts work

#### Issue 2: Entry Logs Present But No Completion

**Symptoms**:
- Entry messages appear in log files
- Hook starts executing but doesn't complete
- Error messages in log files
- Hook times out

**Causes**:
- Missing dependencies (npm, Python, etc.)
- File path or permission errors
- Script bugs or infinite loops
- Network issues (for npm commands)

**Solutions**:
1. **Review error logs**: Read complete log file for error messages
   ```bash
   cat .kiro/logs/file-organization.log
   cat .kiro/logs/release-manager.log
   ```

2. **Check dependencies**: Verify required tools are installed
   ```bash
   # Check npm is available
   which npm
   npm --version
   
   # Check Python is available (for cross-reference updates)
   which python3
   python3 --version
   ```

3. **Verify file paths**: Ensure all referenced files and directories exist
   ```bash
   # Check project structure
   ls -la .kiro/hooks/
   ls -la .kiro/agent-hooks/
   ls -la .kiro/logs/
   ```

4. **Check permissions**: Ensure hook scripts are executable
   ```bash
   chmod +x .kiro/hooks/release-manager.sh
   chmod +x .kiro/agent-hooks/organize-after-task.sh
   chmod +x .kiro/agent-hooks/organize-by-metadata.sh
   ```

#### Issue 3: Hook Timeout

**Symptoms**:
- Hook execution exceeds timeout limit
- File organization times out (10-minute limit)
- Release detection times out (5-minute limit)
- Partial execution with timeout error

**Causes**:
- npm command stalls (incorrect syntax or network issues)
- Script infinite loops or blocking operations
- Large file operations taking too long
- User confirmation not provided (for interactive hooks)

**Solutions**:
1. **Check for npm stalls**: Review npm command syntax in scripts

2. **Review script logic**: Check for infinite loops or blocking operations

3. **Provide user confirmation**: For interactive hooks, respond to prompts promptly

4. **Use manual trigger**: Test hook execution manually to identify bottlenecks

#### Issue 4: Dependency Chain Broken

**Symptoms**:
- File organization runs but release detection doesn't
- Dependent hook never executes
- No errors in prerequisite hook log
- Dependency chain appears broken

**Causes**:
- Prerequisite hook failed silently
- `runAfter` configuration incorrect
- Hook name mismatch in configuration
- Kiro IDE dependency handling issue

**Solutions**:
1. **Verify prerequisite completed**: Check that file organization completed successfully
   ```bash
   # Look for completion message in log
   grep "Organization complete" .kiro/logs/file-organization.log
   ```

2. **Check `runAfter` configuration**: Verify hook name matches exactly
   ```json
   {
     "settings": {
       "runAfter": ["organize-after-task-completion"]
     }
   }
   ```

3. **Test hooks independently**: Use manual triggers to test each hook separately

4. **Review Kiro IDE behavior**: Check IDE documentation for dependency handling

#### Issue 5: Cross-Reference Updates Fail

**Symptoms**:
- File organization moves files but links break
- Cross-reference update errors in log
- Python dependency errors
- Relative path calculation failures

**Causes**:
- Python not installed or not in PATH
- Relative path calculation errors
- Invalid markdown link syntax
- File paths with special characters

**Solutions**:
1. **Install Python**: Ensure Python 3 is available
   ```bash
   # Check Python installation
   which python3
   
   # Install if needed (macOS with Homebrew)
   brew install python3
   ```

2. **Review error messages**: Check log for specific path calculation errors
   ```bash
   grep "ERROR" .kiro/logs/file-organization.log
   ```

3. **Verify link syntax**: Ensure markdown links use correct relative path format

4. **Test manually**: Move files manually and update cross-references to verify paths

### Release Detection Not Triggering

**Symptoms**:
- Completed parent task but no release detection occurred
- No entry in `.kiro/logs/release-manager.log`
- No trigger files created in `.kiro/release-triggers/`
- Automatic release detection hook didn't run

**Common Causes and Solutions**:

**Check 1: Summary Document Creation**

Release detection triggers on parent task summary document creation in `docs/specs/[spec-name]/`:

```bash
# Verify summary document exists
ls -la docs/specs/[spec-name]/task-*-summary.md

# Check if summary document was created
# Should see: task-1-summary.md, task-2-summary.md, etc.
```

**Solution**: Create the summary document if missing:
- Location: `docs/specs/[spec-name]/task-N-summary.md`
- Format: Concise, commit-style summary (see Spec Planning Standards)
- This triggers the automatic release detection hook

**Check 2: Summary Document Location**

**Common Mistake**: Creating summary document in `.kiro/` directory instead of `docs/`

```bash
# WRONG - This won't trigger hooks (.kiro/ directory is filtered)
.kiro/specs/[spec-name]/task-1-summary.md

# CORRECT - This triggers hooks
docs/specs/[spec-name]/task-1-summary.md
```

**Why this matters**: The `.kiro/` directory is filtered from Kiro IDE file watching, so hooks don't trigger on files created there. Summary documents must be in `docs/specs/[spec-name]/` to trigger automatic release detection.

**Solution**: Move summary document to correct location:
```bash
# If you created it in the wrong location
mv .kiro/specs/[spec-name]/task-1-summary.md docs/specs/[spec-name]/task-1-summary.md
```

**Check 3: File Naming Format**

Verify the summary document uses the correct naming format:

```bash
# Correct format (triggers hook)
task-1-summary.md
task-2-summary.md
task-10-summary.md

# Wrong format (doesn't trigger hook)
task-1-1-summary.md  # Subtask format
task-1-completion.md  # Completion doc format
summary-task-1.md     # Wrong order
```

**Pattern**: Hook pattern is `**/task-*-summary.md` - must have "task-" prefix and "-summary.md" suffix

**Check 4: Hook Configuration**

Verify the release detection hook is enabled and configured correctly:

```bash
# Check hook configuration
cat .kiro/hooks/release-detection-auto.kiro.hook

# Verify hook is enabled
grep '"enabled": true' .kiro/hooks/release-detection-auto.kiro.hook
```

**Solution**: If hook is disabled, enable it in the configuration file or through Kiro IDE Agent Hooks panel

**Fallback Options**:

If automatic detection still doesn't work, use one of these fallback options:

**Option 1: Manual Release Detection Hook**
1. Open Agent Hooks panel in Kiro IDE
2. Find "Manual Release Detection" hook
3. Click "Run" or "▶" button
4. Confirm execution

**Option 2: Run Script Directly**
```bash
# Trigger release detection manually
./.kiro/hooks/release-manager.sh auto

# Verify it ran
cat .kiro/logs/release-manager.log
ls -la .kiro/release-triggers/
```

**Option 3: Check Detailed Completion Document**

If you only created the detailed completion document (`.kiro/specs/[spec-name]/completion/task-N-parent-completion.md`), you need to also create the summary document:

```bash
# Detailed doc exists (internal documentation)
.kiro/specs/[spec-name]/completion/task-1-parent-completion.md

# Summary doc needed (triggers hook)
docs/specs/[spec-name]/task-1-summary.md
```

**Why two documents?**:
- Detailed completion doc: Comprehensive Tier 3 documentation (internal)
- Summary doc: Concise, commit-style summary (triggers hook + release notes)

**Verification Steps**:

After creating/moving the summary document:

1. **Check hook triggered**:
   ```bash
   tail -n 20 .kiro/logs/release-manager.log
   # Should see: "Hook triggered by Kiro IDE agent hook system"
   ```

2. **Verify trigger files created**:
   ```bash
   ls -la .kiro/release-triggers/
   # Should see new trigger files
   ```

3. **Confirm detection worked**:
   ```bash
   # Check log for completion document detection
   grep "Found completion document" .kiro/logs/release-manager.log
   ```

### Quick Reference: Diagnostic Commands

```bash
# Check if hooks were triggered
cat .kiro/logs/file-organization.log | grep "Hook triggered"
cat .kiro/logs/release-manager.log | grep "Hook triggered"

# View recent log entries
tail -n 20 .kiro/logs/file-organization.log
tail -n 20 .kiro/logs/release-manager.log

# Validate hook configurations
python3 -m json.tool .kiro/agent-hooks/organize-after-task-completion.json
python3 -m json.tool .kiro/agent-hooks/release-detection-on-task-completion.json

# Check hook script permissions
ls -la .kiro/hooks/release-manager.sh
ls -la .kiro/agent-hooks/organize-after-task.sh

# Manual trigger commands
./.kiro/agent-hooks/organize-by-metadata.sh
./.kiro/hooks/release-manager.sh auto

# Check for trigger files
ls -la .kiro/release-triggers/

# Verify dependencies
which npm && npm --version
which python3 && python3 --version
```


---

## Best Practices

Working effectively with agent hook dependency chains requires understanding how to monitor execution, manage dependencies, handle failures, and test independently. These best practices help ensure reliable automation while maintaining fallback options when issues arise.

### 1. Monitor Logs Regularly

**Why This Matters**: Logs are your primary visibility into hook execution. Regular monitoring helps catch issues early before they compound.

**What to Monitor**:

```bash
# Check if hooks triggered after task completion
grep "Hook triggered" .kiro/logs/file-organization.log
grep "Hook triggered" .kiro/logs/release-manager.log

# View recent activity
tail -n 20 .kiro/logs/file-organization.log
tail -n 20 .kiro/logs/release-manager.log

# Look for errors or warnings
grep "ERROR\|WARN\|Failed" .kiro/logs/file-organization.log
grep "ERROR\|WARN\|Failed" .kiro/logs/release-manager.log
```

**When to Check Logs**:
- Immediately after marking a task complete
- When expected automation doesn't occur
- Before starting a new task (verify previous task's hooks completed)
- During troubleshooting sessions

**What to Look For**:
- **Entry messages**: Confirm hooks were triggered by IDE
- **Completion messages**: Verify hooks finished successfully
- **Timestamps**: Check execution order matches dependencies
- **Error messages**: Identify specific failures requiring attention

**Best Practice**: Make log checking part of your task completion routine. A quick `tail -n 20` on both log files takes seconds and prevents issues from going unnoticed.

### 2. Understand Dependencies

**Why This Matters**: Knowing which hooks depend on others helps you predict behavior and troubleshoot issues when automation doesn't work as expected.

**Key Dependency Concepts**:

**runAfter Configuration**: The `runAfter` field in hook configuration specifies prerequisite hooks:
```json
{
  "settings": {
    "runAfter": ["organize-after-task-completion"]
  }
}
```

**Execution Order**: Dependent hooks wait for prerequisite hooks to complete before starting. There's no artificial delay - the transition happens immediately when the prerequisite exits successfully.

**Failure Propagation**: If a prerequisite hook fails, the dependent hook typically does not execute. This prevents cascading issues but means you need to fix the prerequisite before the dependent hook will run.

**Timeout Independence**: Each hook has its own timeout. A prerequisite timing out is treated as a failure, preventing the dependent hook from executing.

**Best Practice**: Document your project's hook dependencies in a simple diagram or list. When troubleshooting, always start with the first hook in the chain and work forward.

### 3. Have Fallbacks Ready

**Why This Matters**: Automation fails sometimes. Having manual fallback procedures ensures you can complete critical operations even when hooks don't work.

**Fallback Procedures**:

**File Organization Fallback**:
```bash
# Option 1: Run organization script directly
./.kiro/agent-hooks/organize-by-metadata.sh

# Option 2: Manual organization
# 1. Add Organization metadata to file header
# 2. Move file to appropriate directory
# 3. Update cross-references manually
# 4. Commit changes
```

**Release Detection Fallback**:
```bash
# Option 1: Run release manager script
./.kiro/hooks/release-manager.sh auto

# Option 2: Use manual release detection hook in IDE
# 1. Open Agent Hooks panel
# 2. Find "Manual Release Detection"
# 3. Click "Run" button
# 4. Confirm execution
```

**When to Use Fallbacks**:
- Automatic hooks didn't trigger (no entry logs)
- Hooks failed during execution (error in logs)
- Timeout occurred before completion
- User cancelled prerequisite hook but needs dependent hook
- Testing or debugging hook behavior

**Best Practice**: Keep a cheat sheet of fallback commands near your workspace. When automation fails, you want to quickly execute the fallback without searching for the right command.

### 4. Test Independently

**Why This Matters**: Testing hooks independently helps isolate issues and verify that each hook works correctly before relying on the full automation chain.

**Independent Testing Strategies**:

**Test File Organization Independently**:
```bash
# Create a test file with organization metadata
echo '**Organization**: framework-strategic' > test-doc.md
echo '**Scope**: cross-spec' >> test-doc.md

# Run organization script directly
./.kiro/agent-hooks/organize-by-metadata.sh

# Verify file moved correctly
ls -la strategic-framework/test-doc.md

# Clean up test file
rm strategic-framework/test-doc.md
```

**Test Release Detection Independently**:
```bash
# Create a test summary document
mkdir -p docs/specs/test-spec
echo '# Test Summary' > docs/specs/test-spec/task-1-summary.md

# Run release detection manually
./.kiro/hooks/release-manager.sh auto

# Check if trigger files created
ls -la .kiro/release-triggers/

# Clean up test files
rm -rf docs/specs/test-spec
```

**Test Hook Configurations**:
```bash
# Validate JSON syntax
python3 -m json.tool .kiro/agent-hooks/organize-after-task-completion.json
python3 -m json.tool .kiro/agent-hooks/release-detection-on-task-completion.json

# Check hook script permissions
ls -la .kiro/hooks/release-manager.sh
ls -la .kiro/agent-hooks/organize-after-task.sh

# Verify dependencies are available
which npm && npm --version
which python3 && python3 --version
```

**When to Test Independently**:
- After modifying hook scripts or configurations
- Before relying on automation for important work
- When troubleshooting dependency chain issues
- To verify fixes after resolving hook failures
- During onboarding to understand how hooks work

**Best Practice**: Test hooks independently in a safe environment (test files, test specs) before relying on them for production work. This builds confidence in the automation and helps you understand failure modes.

### 5. Plan for Common Failure Scenarios

**Why This Matters**: Understanding common failure scenarios helps you respond quickly when issues occur rather than spending time diagnosing from scratch.

**Common Scenarios and Responses**:

**Scenario 1: No Entry Logs (Hooks Not Triggering)**
- **Cause**: Using direct git commands instead of `taskStatus` tool
- **Response**: Verify you're using `taskStatus` tool to mark tasks complete
- **Fallback**: Run hooks manually with fallback commands

**Scenario 2: Prerequisite Hook Fails**
- **Cause**: Missing dependencies, permission errors, script bugs
- **Response**: Check prerequisite hook logs for specific error messages
- **Fallback**: Fix the issue, then re-trigger the workflow or run dependent hook manually

**Scenario 3: Hook Timeout**
- **Cause**: npm command stalls, infinite loops, large operations
- **Response**: Review script for blocking operations, check npm command syntax
- **Fallback**: Fix the bottleneck, increase timeout if justified, or run manually

**Scenario 4: User Cancels Prerequisite**
- **Cause**: User declines confirmation prompt
- **Response**: Understand why cancellation occurred, review hook preview
- **Fallback**: Re-trigger workflow and approve, or run dependent hook manually

**Scenario 5: Dependency Chain Broken**
- **Cause**: Prerequisite failed silently, configuration mismatch
- **Response**: Verify prerequisite completed, check `runAfter` configuration
- **Fallback**: Test hooks independently to isolate the issue

**Best Practice**: Keep a troubleshooting decision tree handy. When a hook fails, follow the tree to quickly identify the issue and apply the appropriate response.

### 6. Maintain Configuration Validity

**Why This Matters**: Invalid configurations prevent hooks from working correctly. Regular validation catches issues before they cause failures.

**Configuration Validation Checklist**:

```bash
# Validate JSON syntax (should return nothing if valid)
python3 -m json.tool .kiro/agent-hooks/organize-after-task-completion.json > /dev/null
python3 -m json.tool .kiro/agent-hooks/release-detection-on-task-completion.json > /dev/null

# Check for common configuration issues
grep '"enabled": true' .kiro/agent-hooks/*.json  # Verify hooks are enabled
grep '"runAfter"' .kiro/agent-hooks/*.json       # Check dependency configuration
grep '"timeout"' .kiro/agent-hooks/*.json        # Verify timeout values
```

**What to Validate**:
- **JSON Syntax**: No trailing commas, proper quotes, valid structure
- **Hook Names**: `runAfter` references match actual hook names exactly
- **Trigger Configuration**: Event types and patterns are correct
- **Timeout Values**: Appropriate for hook complexity and operations
- **Auto-Approve Settings**: Match intended user interaction model

**When to Validate**:
- After modifying hook configurations
- When adding new hooks to the system
- During troubleshooting sessions
- As part of regular maintenance (monthly or quarterly)

**Best Practice**: Add configuration validation to your pre-commit checks or run it periodically as part of project maintenance. Catching configuration errors early prevents runtime failures.

### Summary: Best Practices Checklist

Use this checklist to ensure reliable hook automation:

- ✅ **Monitor logs** after every task completion
- ✅ **Understand dependencies** in your hook chain
- ✅ **Have fallback commands** ready for manual execution
- ✅ **Test hooks independently** before relying on automation
- ✅ **Plan for common failures** with documented responses
- ✅ **Validate configurations** regularly to catch issues early
- ✅ **Use `taskStatus` tool** to ensure hooks trigger correctly
- ✅ **Document your workflow** so others can follow the same practices

**Remember**: Automation is a tool to enhance your workflow, not replace your understanding. The best automation users know how to work both with and without the automation.

---

## Kiro Agent Hook Integration

This section provides details on hook execution order, automatic file organization, and release detection.

### Agent Hook Execution Order

**runAfter Dependencies**:

The release detection hook depends on file organization completing first:
- File organization runs first (requires user confirmation)
- Release detection runs after (auto-approve, no confirmation)
- Dependency specified via `runAfter: ["organize-after-task-completion"]`

**Dependency Behavior**:

The `runAfter` configuration specifies execution order for agent hooks. When a hook has a `runAfter` dependency:

- **Execution Order**: The dependent hook waits for prerequisite hooks to complete before starting
- **Prerequisite Success**: If the prerequisite hook completes successfully, the dependent hook runs normally
- **Prerequisite Failure**: Behavior depends on Kiro IDE implementation (currently unclear - requires testing)
- **User Cancellation**: If user declines prerequisite hook confirmation, dependent hook behavior depends on Kiro IDE implementation (currently unclear - requires testing)
- **Timeout**: Each hook has independent timeout (file organization: 10 min, release detection: 5 min)

**Troubleshooting Hook Chains**:

To verify hooks are triggering and executing correctly:

1. **Check Entry Logs**:
   - File organization: `.kiro/logs/file-organization.log`
   - Release detection: `.kiro/logs/release-manager.log`
   - Entry message format: `[YYYY-MM-DD HH:MM:SS] Hook triggered by Kiro IDE agent hook system`

2. **Verify Hook Execution Order**:
   - Check timestamps in log files to confirm execution order
   - File organization should have earlier timestamp than release detection
   - If release detection timestamp is missing, check if file organization completed

3. **Check Hook Configurations**:
   - File organization config: `.kiro/agent-hooks/organize-after-task-completion.json`
   - Release detection config: `.kiro/agent-hooks/release-detection-on-task-completion.json`
   - Verify `runAfter` dependency is correctly specified
   - Check for syntax errors in JSON configuration

4. **Manual Trigger for Testing**:
   - File organization: Not available (requires IDE event)
   - Release detection: `./.kiro/hooks/release-manager.sh auto`
   - Use manual trigger to test release detection independently

**Common Hook Chain Issues**:

- **No entry logs**: Hooks not triggering (Kiro IDE event emission issue)
  - Verify you're using `taskStatus` tool to mark tasks complete
  - Direct git commits bypass agent hook system
  - Check that task status actually changed to "completed"

- **Entry logs but no completion**: Hook executing but failing (check error logs)
  - Review log files for error messages
  - Check that all dependencies are available (npm, Python, etc.)
  - Verify file paths and permissions are correct

- **Timeout**: Hook taking too long (check for stalls or infinite loops)
  - File organization: 10-minute timeout
  - Release detection: 5-minute timeout
  - Check for npm command stalls or script errors

- **Dependency chain broken**: Dependent hook not running after prerequisite
  - Verify prerequisite hook completed successfully
  - Check `runAfter` configuration matches hook name exactly
  - Review Kiro IDE behavior for prerequisite failures

### Automatic File Organization

File organization triggers automatically when task status changes to "completed" via the `taskStatus` tool.

**Key Points**:
- Hook scans root directory for files with **Organization** metadata
- User confirmation required before moving files (safety feature)
- Cross-references automatically updated after file moves
- Manual fallback: `./.kiro/agent-hooks/organize-by-metadata.sh`

**Quick Reference**:
- **Hook**: `.kiro/agent-hooks/organize-after-task.sh`
- **Timeout**: 10 minutes (allows time for user interaction)
- **Scope**: Root directory only (subdirectories intentionally excluded)

**For detailed guidance** on file organization workflow, metadata values, directory structure, scope rationale, and manual organization options, query File Organization Standards via MCP:

```
get_document_full({ path: ".kiro/steering/Process-File-Organization.md" })
```

Or query specific sections:
```
get_section({ path: ".kiro/steering/Process-File-Organization.md", heading: "Organization Implementation (Conditional Loading)" })
get_section({ path: ".kiro/steering/Process-File-Organization.md", heading: "File Organization Scope (Conditional Loading)" })
```

### Release Detection

Release detection triggers automatically when parent task summary documents are created in `docs/specs/[spec-name]/`.

**Key Points**:
- Summary documents in `docs/specs/` trigger automatic release detection (manual files only)
- AI-assisted workflows require manual trigger: `./.kiro/hooks/release-manager.sh auto`
- Hook depends on file organization completing first (via `runAfter` dependency)
- `.kiro/` directory is filtered from Kiro IDE file watching (hooks don't trigger there)

**Quick Reference**:
- **Summary docs**: `docs/specs/[spec-name]/task-N-summary.md` (triggers hooks)
- **Detailed docs**: `.kiro/specs/[spec-name]/completion/task-N-parent-completion.md` (internal)
- **Manual trigger**: `./.kiro/hooks/release-manager.sh auto`

**For detailed guidance** on release detection pipeline, troubleshooting, hook debugging, and manual triggers, query Release Management System via MCP:

```
get_document_full({ path: ".kiro/steering/Release Management System.md" })
```

Or query specific sections:
```
get_section({ path: ".kiro/steering/Release Management System.md", heading: "Release Pipeline Architecture" })
get_section({ path: ".kiro/steering/Release Management System.md", heading: "AI Agent Decision Points" })
```

---

*This document provides comprehensive operational guidance for agent hooks. For core task completion workflow, see Process-Development-Workflow.md (always loaded). For release detection pipeline details, query Release Management System via MCP.*
