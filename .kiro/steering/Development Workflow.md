---
inclusion: always
---

# Development Workflow and Task Completion Practices

## AI Agent Reading Priorities

**This document contains both essential workflow guidance and detailed troubleshooting reference material. Read strategically based on what you're doing RIGHT NOW.**

### WHEN Executing Normal Tasks THEN Read:
1. ✅ **Task Completion Workflow** (MUST READ)
2. ✅ **Spec Planning** (brief reference)
3. ✅ **Hook System Usage** (basic commands)
4. ✅ **Quality Standards** (MUST READ)
5. ✅ **Workflow Improvements** (context)
6. ❌ **SKIP**: Agent Hook Dependency Chains, Troubleshooting sections, Hook Integration details

### WHEN Debugging Hook Issues THEN Read:
1. ✅ **Task Completion Workflow** (context)
2. ✅ **Agent Hook Dependency Chains** (understand dependencies)
3. ✅ **Troubleshooting** (diagnose and resolve issues)
4. ✅ **Hook Integration** (understand automation details)
5. ❌ **SKIP**: Spec Planning, Workflow Improvements

### WHEN Setting Up or Modifying Hooks THEN Read:
1. ✅ **Agent Hook Dependency Chains** (understand configuration)
2. ✅ **Kiro Agent Hook Integration** (setup details)
3. ✅ **Troubleshooting** (reference for testing)
4. ❌ **SKIP**: Task Completion Workflow, Quality Standards

---

## Task Completion Workflow

### Recommended Process (IDE-based with Automation)
1. **[MANUAL]** **Complete Task Work**: Implement all requirements and create specified artifacts
2. **[MANUAL]** **Create Detailed Completion Document**: For parent tasks, create comprehensive completion doc at `.kiro/specs/[spec-name]/completion/task-N-parent-completion.md` (Tier 3)
3. **[MANUAL]** **Create Summary Document**: For parent tasks, create concise summary doc at `docs/specs/[spec-name]/task-N-summary.md` (triggers release detection for manual files only)
4. **[MANUAL - AI Workflows]** **Trigger Release Detection**: Run `./.kiro/hooks/release-manager.sh auto` (required for AI-created files; automatic hooks only work for manual IDE file operations)
5. **[AUTOMATED - Manual Files]** **Release Detection**: Kiro IDE detects summary document creation and triggers release detection hook automatically (only for manually created files through IDE UI)
6. **[MANUAL]** **Mark Task Complete**: Use `taskStatus` tool to update task status to "completed" when finished
7. **[MANUAL]** **Commit Changes**: Run `./.kiro/hooks/commit-task.sh "Task Name"` to automatically commit and push
8. **[MANUAL]** **Verify on GitHub**: Confirm changes appear in repository with correct commit message

**Why use `taskStatus` tool?**
- Triggers agent hooks for automatic file organization
- Triggers agent hooks for automatic release detection
- Maintains consistent task tracking in tasks.md
- Enables automation without manual steps

### Alternative Process (Script-based without Automation)
1. **Complete Task Work**: Implement all requirements and create specified artifacts
2. **Manually update tasks.md**: Change task status from `[ ]` to `[x]`
3. **Commit Changes**: Run `./.kiro/hooks/commit-task.sh "Task Name"` to automatically commit and push
4. **Verify on GitHub**: Confirm changes appear in repository with correct commit message
5. **[OPTIONAL]** **Manual Release Detection**: Run `./.kiro/hooks/release-manager.sh auto` if release analysis needed

**When to use this approach:**
- Quick fixes or minor changes
- Non-spec work that doesn't need automation
- When agent hooks aren't available or needed
- When you prefer direct control over each step

**Trade-off**: No automatic file organization or release detection, but simpler and more direct

### Commit Message Standards
- All task completions should use the commit message specified in the task's "Post-Complete" instruction
- Format: "Task [Number] Complete: [Task Description]"
- Example: "Task 6 Complete: Strategic Framework Documentation Package"

### Git Practices
- **Repository**: https://github.com/3fn/DesignerPunkv2
- **Branch**: All work on `main` branch (single-branch workflow for now)
- **Commits**: Atomic commits per task completion with descriptive messages
- **Push**: Always push immediately after commit to maintain synchronization

## Spec Planning

**WHEN creating or updating specification documents (requirements.md, design.md, tasks.md):**

See **Spec Planning Standards** (`.kiro/steering/Spec Planning Standards.md`) for complete guidance on:
- Requirements format (EARS, user stories, acceptance criteria)
- Design document structure and principles
- Tasks document format with task type classification
- Validation and documentation tier requirements

**This document (Development Workflow) focuses on task execution and git workflow, not spec creation.**

---

## Hook System Usage

### Available Tools
- **`.kiro/hooks/commit-task.sh`**: Simple wrapper for task completion commits
- **`.kiro/hooks/task-completion-commit.sh`**: Full automation script with message extraction
- **`.kiro/hooks/README.md`**: Complete documentation and usage examples

### Usage Examples
```bash
# Standard task completion commit
./.kiro/hooks/commit-task.sh "1. Create North Star Vision Document"

# For different specs or custom task files
./.kiro/hooks/task-completion-commit.sh path/to/tasks.md "Task Name"
```

---

## Agent Hook Dependency Chains (Conditional Loading)

**📖 CONDITIONAL SECTION - Read only when needed**

**Load when**: 
- Debugging hook issues or automation failures
- Understanding hook dependencies and execution order
- Setting up new hooks or modifying existing ones
- Investigating why dependent hooks didn't execute

**Skip when**: 
- Normal task execution
- Spec creation or documentation work
- Hooks are working correctly
- General development without hook issues

---

### Overview

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

**Expected Outcome**: When everything works correctly, you should see:
- File organization completes successfully
- Release detection starts immediately after
- Both hooks complete their operations
- All expected artifacts are created (organized files, release triggers)

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
   - **npm command stalls**: Check for incorrect npm command syntax
     ```bash
     # Correct syntax (with -- separator)
     npm run release:detect -- process-triggers
     
     # Wrong syntax (causes stall)
     npm run release:detect process-triggers
     ```
   - **Infinite loops**: Review script logic for blocking operations
   - **User confirmation**: Check if hook is waiting for user input
   - **Large operations**: Verify file operations aren't processing too much data

3. **Fix the underlying issue**:
   - Correct npm command syntax in hook scripts
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

**Best Practices**:
- Review hook preview carefully before confirming or cancelling
- If unsure, cancel and investigate what the hook will do
- Use manual triggers to test hooks independently
- Document reasons for cancellation to improve hook design

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

### Troubleshooting Hook Dependencies

1. **Verify Hook Execution Order**:
   ```bash
   # Check file organization log
   tail -20 .kiro/logs/file-organization.log
   
   # Check release detection log
   tail -20 .kiro/logs/release-manager.log
   
   # Compare timestamps to verify order
   ```

2. **Check for Prerequisite Failures**:
   ```bash
   # Look for errors in prerequisite hook log
   grep "ERROR\|Failed" .kiro/logs/file-organization.log
   ```

3. **Verify Hook Configuration**:
   ```bash
   # Check runAfter configuration
   cat .kiro/hooks/release-detection-auto.kiro.hook | grep -A 3 "runAfter"
   ```

4. **Manual Trigger as Fallback**:
   ```bash
   # If automatic hook didn't run, trigger manually
   ./.kiro/hooks/release-manager.sh auto
   ```

### Best Practices

Working effectively with agent hook dependency chains requires understanding how to monitor execution, manage dependencies, handle failures, and test independently. These best practices help ensure reliable automation while maintaining fallback options when issues arise.

#### 1. Monitor Logs Regularly

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

#### 2. Understand Dependencies

**Why This Matters**: Knowing which hooks depend on others helps you predict behavior and troubleshoot issues when automation doesn't work as expected.

**Current Dependency Chain**:

```
Task Completion (taskStatusChange: completed)
    ↓
File Organization Hook
    - Requires user confirmation
    - 10-minute timeout
    - Scans root directory for organization metadata
    ↓
Release Detection Hook
    - Auto-approved (no confirmation needed)
    - 5-minute timeout
    - Depends on file organization completing first
    - Creates release trigger files
```

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

#### 3. Have Fallbacks Ready

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

#### 4. Test Independently

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

#### 5. Plan for Common Failure Scenarios

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

#### 6. Maintain Configuration Validity

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

#### Summary: Best Practices Checklist

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

## Quality Standards

### Before Task Completion
- Verify all success criteria are met
- Ensure all specified artifacts are created
- Validate cross-references and links work correctly
- Check that documentation follows concept-based approach (no implementation details)

### After Task Completion
- Confirm commit appears on GitHub with correct message
- Verify all files are properly tracked in git
- Check that task status is marked as completed in tasks.md

## Workflow Improvements

### Current State
- Manual commit step required after task completion
- Hook system provides automation for git operations
- Commit messages automatically extracted from task specifications

### Current Enhancements
- ✅ **Automatic File Organization**: Kiro agent hook triggers organization on task completion
- ✅ **Metadata-Driven Organization**: Safe automation based on explicit **Organization** metadata
- ✅ **Cross-Reference Integrity**: Automatic link updates after file organization
- ✅ **Human Control**: Interactive confirmation for all organization actions

### Future Enhancements
- Branch management for individual tasks
- Integration with pull request workflow
- Notification system for team coordination
- Smart metadata suggestion for new files

---

## Troubleshooting (Conditional Loading)

**📖 CONDITIONAL SECTION - Read only when needed**

**Load when**: 
- Experiencing errors or failures during task completion
- Hooks not triggering or executing correctly
- Debugging automation issues
- Need diagnostic commands or troubleshooting procedures

**Skip when**: 
- Normal task execution without issues
- Hooks working correctly
- General development work
- Creating or updating specs

---

### Common Issues
- **No changes to commit**: Ensure all work is saved and files are created
- **Wrong commit message**: Verify task name matches exactly with tasks.md
- **Push failures**: Check GitHub authentication and network connectivity
- **Hook script errors**: Ensure scripts have execute permissions (`chmod +x`)

### Error Recovery
- If commit fails: Fix issues and re-run hook script
- If push fails: Run `git push origin main` manually
- If wrong message: Use `git commit --amend -m "Correct Message"` then force push

### Hook Troubleshooting

This section provides comprehensive guidance for diagnosing and resolving agent hook issues.

#### Verifying Hook Execution

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

#### Manual Trigger Commands

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

#### Common Issues and Solutions

**Issue 1: No Entry Logs (Hooks Not Triggering)**

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

**Issue 2: Entry Logs Present But No Completion**

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

**Issue 3: Hook Timeout**

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
   ```bash
   # Correct syntax (with -- separator)
   npm run release:detect -- process-triggers
   
   # Wrong syntax (causes stall)
   npm run release:detect process-triggers
   ```

2. **Review script logic**: Check for infinite loops or blocking operations

3. **Provide user confirmation**: For interactive hooks, respond to prompts promptly

4. **Use manual trigger**: Test hook execution manually to identify bottlenecks

**Issue 4: Dependency Chain Broken**

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

**Issue 5: Cross-Reference Updates Fail**

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

#### Best Practices for Hook Reliability

**1. Always Use `taskStatus` Tool**
- Ensures hooks trigger correctly
- Maintains consistent task tracking
- Enables full automation workflow

**2. Monitor Log Files**
- Check entry logs after task completion
- Review error messages immediately
- Verify hook execution order

**3. Test Independently**
- Use manual triggers to test hooks
- Verify scripts work before relying on automation
- Test dependency chains separately

**4. Understand Dependencies**
- Know which hooks depend on others
- Understand execution order requirements
- Plan for dependency failures

**5. Maintain Fallback Procedures**
- Know how to trigger hooks manually
- Have manual organization procedures ready
- Document workarounds for common issues

**6. Keep Configurations Valid**
- Validate JSON syntax regularly
- Review hook configurations after changes
- Test configuration changes before committing

#### Release Detection Not Triggering

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

#### Quick Reference: Diagnostic Commands

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

## Integration with Strategic Framework

### Contamination Prevention
- Hook system follows process-first tool development approach
- Scripts enhance proven manual processes rather than replace them
- Automation only after manual workflow validation

### AI Collaboration
- Hook development used systematic skepticism protocols
- Counter-arguments considered for automation vs manual approaches
- Evidence-based validation through real-world testing

### Sustainable Development
- Hook system prevents over-engineering through simple, focused scripts
- Tool complexity justified by clear process limitations
- Fallback to manual processes always available

---

*This workflow ensures consistent task completion practices while maintaining the strategic framework principles of contamination prevention, sustainable development, and effective AI-human collaboration.*

---

## Kiro Agent Hook Integration (Conditional Loading)

**📖 CONDITIONAL SECTION - Read only when needed**

**Load when**: 
- Setting up or modifying agent hooks
- Understanding automatic file organization
- Understanding automatic release detection
- Need details on hook execution order and dependencies
- Working with file organization scope or Kiro IDE file watching

**Skip when**: 
- Normal task execution
- Hooks already set up and working
- General development work
- Not working with automation setup

---

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

**Current Hook Chain**:

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

**Best Practices for Hook Chains**:

- **Use `taskStatus` tool**: Ensures agent hooks trigger correctly
- **Monitor log files**: Check entry logs after task completion to verify execution
- **Test independently**: Use manual triggers to test individual hooks
- **Understand dependencies**: Know which hooks depend on others and why
- **Plan for failures**: Have manual fallback procedures for critical automation

---

### Automatic File Organization

**Trigger**: Task status changes to "completed"  
**Hook**: `.kiro/agent-hooks/organize-after-task.sh`  
**Purpose**: Automatically organize files based on **Organization** metadata

#### Workflow
1. **Detection**: Kiro detects task completion event
2. **Scanning**: Agent hook scans for files with organization metadata
3. **Preview**: Shows user what files would be organized
4. **Confirmation**: Prompts user for approval before organizing
5. **Organization**: Moves files and updates cross-references
6. **Commit**: Automatically commits organization changes

#### Safety Features
- **Human Control**: User confirmation required for all file moves
- **Metadata Validation**: Validates organization metadata before organizing
- **Dry-Run Preview**: Shows what will be organized before execution
- **Cross-Reference Updates**: Automatically maintains link integrity
- **Fallback Available**: Manual organization always available

#### User Experience
```
🤖 [Agent Hook] Task completion detected - checking for file organization needs...
🤖 [Agent Hook] Found files that need organization:
  - new-document.md -> strategic-framework/ (framework-strategic, cross-spec)

Would you like to organize these files now? [y/N]: y

📁 Moving: ./new-document.md -> strategic-framework/new-document.md
✅ Organized: new-document.md -> strategic-framework/
📁 Updating cross-references...
✅ Cross-references updated
✅ Organization complete!
```

#### Configuration
- **Auto-Approve**: `false` (requires human confirmation)
- **Timeout**: 10 minutes (allows time for user interaction)
- **Integration**: Seamless with existing task completion workflow
- **Fallback**: Manual hooks available if automation fails

### Benefits of Agent Hook Integration

#### Immediate Benefits
- **Automatic Organization**: Files organized immediately after task completion
- **Prevents Clutter**: No accumulation of unorganized files in root directory
- **Maintains Quality**: Cross-reference integrity preserved automatically
- **Reduces Manual Work**: Organization happens with minimal user intervention

#### Long-Term Benefits
- **Scalable Organization**: Pattern works as project grows and more specs are created
- **Consistent Application**: Organization standards applied automatically across all development
- **Knowledge Preservation**: Framework artifacts properly separated from spec-specific work
- **Developer Experience**: Clean, navigable project structure maintained without manual effort

#### Process-First Validation
- ✅ **Manual Process Proven**: File organization validated manually before automation
- ✅ **Hook Enhancement**: Automation enhances proven processes rather than replacing them
- ✅ **Safety Maintained**: All safety features from manual process preserved in automation
- ✅ **Human Override**: Manual organization always available as fallback option

---

### File Organization Scope

**Intentional Design**: File organization scans **root directory only**, not subdirectories

#### Why Root Directory Only?

The file organization system is intentionally designed to scan only the root directory for files needing organization. This design decision is based on the typical workflow pattern:

1. **Completion Documents in Subdirectories**: Task completion documents are created directly in `.kiro/specs/[spec-name]/completion/` subdirectories and don't need organization
2. **New Files in Root**: New documentation, analysis, and framework files are typically created in the root directory during development
3. **Targeted Organization**: The system focuses on organizing new files that accumulate in root, not reorganizing existing subdirectory structures

#### Rationale

- **Completion docs already organized**: Files created in `.kiro/specs/*/completion/` are already in their correct location
- **Root directory clutter prevention**: New files created during development typically appear in root and need organization
- **Subdirectory stability**: Files in subdirectories are usually already organized and shouldn't be moved automatically
- **Clear scope boundary**: Limiting scope to root directory makes the automation predictable and safe

#### Manual Organization for Subdirectory Files

If you need to organize files that are already in subdirectories:

**Option 1: Move to Root Temporarily**
1. Move the file from subdirectory to root directory
2. Add appropriate **Organization** metadata to the file header
3. Mark a task complete to trigger automatic organization
4. The file will be organized to its correct location based on metadata

**Option 2: Manual Organization**
1. Add **Organization** metadata to the file header
2. Manually move the file to the appropriate directory based on metadata value:
   - `framework-strategic` → `strategic-framework/`
   - `spec-validation` → `.kiro/specs/[spec-name]/validation/`
   - `spec-completion` → `.kiro/specs/[spec-name]/completion/`
   - `process-standard` → `.kiro/steering/` or `docs/processes/`
3. Update any cross-references in other files to reflect the new location
4. Commit the changes manually

**Option 3: Use organize-by-metadata.sh Directly**
```bash
# Run organization script directly (scans root only by default)
./.kiro/agent-hooks/organize-by-metadata.sh

# For subdirectory files, move to root first, then run script
```

#### Scope Behavior Summary

| Location | Automatic Organization | Manual Organization |
|----------|----------------------|---------------------|
| Root directory | ✅ Yes (on task completion) | ✅ Yes (anytime) |
| Subdirectories | ❌ No (intentionally excluded) | ✅ Yes (manual process) |
| Completion docs | ❌ No (already organized) | ✅ Yes (if needed) |

**Note**: This scope limitation is an intentional design decision that keeps the automation focused and predictable. Files in subdirectories are assumed to be already organized or require manual review before moving.

---

### Automatic Release Detection

**Trigger**: Parent task summary document creation in `docs/specs/[spec-name]/` (manual file operations only)

**Important Hook Limitation**: Kiro IDE's `fileCreated` and `fileSaved` hooks only trigger for **manual file operations through the IDE UI**, not for programmatically created files by AI agents. This requires a hybrid approach:

- **Automatic hooks**: Work for manually created/edited files through IDE UI
- **Manual trigger**: Required for AI-assisted workflows after summary document creation

**How it works**:
1. Complete parent task work
2. Create detailed completion document: `.kiro/specs/[spec-name]/completion/task-N-parent-completion.md` (Tier 3 comprehensive)
3. Create summary document: `docs/specs/[spec-name]/task-N-summary.md` (concise, commit-style)
4. **[AUTOMATIC - Manual Files Only]** Kiro IDE detects summary file creation and triggers release detection hook (only for manually created files)
5. **[MANUAL - AI Workflows]** Run `./.kiro/hooks/release-manager.sh auto` to trigger release detection (standard practice for AI-assisted workflows)
6. Release manager scans for completion documents and creates trigger files
7. Release analysis can be run to calculate version bump and generate notes

**File naming**: 
- Summary docs: `task-N-summary.md` in `docs/specs/[spec-name]/` (triggers hook for manual files)
- Detailed docs: `task-N-parent-completion.md` in `.kiro/specs/[spec-name]/completion/` (internal)

**Why two documents?**:
- `.kiro/` directory is filtered from Kiro IDE file watching (hooks don't trigger there)
- Summary docs serve dual purpose: hook trigger + release note content
- Detailed docs remain internal for comprehensive knowledge preservation

**Hybrid Approach - When Hooks Trigger**:
- ✅ **Manual file creation**: User creates summary document through IDE UI → Hook triggers automatically
- ✅ **Manual file edits**: User edits existing summary document through IDE UI → Hook triggers automatically
- ❌ **AI-created files**: AI agent creates summary document programmatically → Hook does NOT trigger (requires manual trigger)
- ❌ **Script-created files**: Files created via scripts or command line → Hook does NOT trigger (requires manual trigger)

**Standard Practice for AI-Assisted Workflows**:
1. AI agent creates summary document programmatically
2. **Manually run**: `./.kiro/hooks/release-manager.sh auto` to trigger release detection
3. Verify trigger files created in `.kiro/release-triggers/`

**Subtask completion documents** use format `task-N.M-completion.md` in `.kiro/` and do NOT trigger automatic release detection (by design - only parent tasks represent complete features)

---

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

---

### Kiro IDE File Watching Behavior

**Important**: The `.kiro/` directory is filtered from Kiro IDE's file watching system. This means hooks that trigger on file creation, modification, or deletion will not fire for files within the `.kiro/` directory structure.

#### Directories Where Hooks Will NOT Trigger

❌ **Hooks will NOT trigger** for files created, modified, or deleted in:
- `.kiro/specs/` - Spec documents and completion documentation
- `.kiro/hooks/` - Hook scripts and configurations
- `.kiro/logs/` - Log files
- `.kiro/agent-hooks/` - Agent hook scripts
- `.kiro/release-triggers/` - Release trigger files
- `.kiro/steering/` - Process documentation and standards
- Any subdirectory of `.kiro/` - All subdirectories are filtered

#### Directories Where Hooks WILL Trigger

✅ **Hooks WILL trigger** for files created, modified, or deleted in:
- `docs/` - Documentation directory (including `docs/specs/`)
- `src/` - Source code directory
- `strategic-framework/` - Strategic framework documents
- `preserved-knowledge/` - Preserved knowledge documents
- Root directory - Files in the project root
- Any non-hidden directory - Directories not starting with `.`

#### Why This Matters for Release Detection

The `.kiro/` directory filtering is the reason for the two-document workflow for parent task completion:

**Detailed Completion Documents** (`.kiro/specs/[spec-name]/completion/`):
- Location: `.kiro/specs/[spec-name]/completion/task-N-parent-completion.md`
- Purpose: Comprehensive Tier 3 internal documentation
- Hook Behavior: **Does NOT trigger hooks** (in filtered directory)
- Audience: Internal team, comprehensive knowledge preservation

**Summary Documents** (`docs/specs/[spec-name]/`):
- Location: `docs/specs/[spec-name]/task-N-summary.md`
- Purpose: Concise, commit-style public-facing summary
- Hook Behavior: **DOES trigger hooks** (in watched directory)
- Audience: Public-facing, release notes, hook trigger

#### Common Mistake: Wrong Summary Document Location

**Problem**: Creating summary document in `.kiro/` directory instead of `docs/`

```bash
# ❌ WRONG - This won't trigger hooks (.kiro/ directory is filtered)
.kiro/specs/[spec-name]/task-1-summary.md

# ✅ CORRECT - This triggers hooks (docs/ directory is watched)
docs/specs/[spec-name]/task-1-summary.md
```

**Solution**: Always create summary documents in `docs/specs/[spec-name]/` to ensure automatic release detection triggers correctly.

#### Design Rationale

The `.kiro/` directory filtering is an intentional design decision by Kiro IDE:

**Benefits**:
- **Reduces Noise**: Internal tooling files don't trigger unnecessary hook executions
- **Performance**: Fewer file watch events improves IDE performance
- **Clear Separation**: Internal files (`.kiro/`) vs public files (`docs/`, `src/`)
- **Predictable Behavior**: Developers know which directories trigger automation

**Implications**:
- Summary documents must be in watched directories to trigger hooks
- Detailed completion docs can remain in `.kiro/` for internal organization
- Hook testing requires files in watched directories
- File organization automation focuses on root directory (watched) not `.kiro/` (filtered)