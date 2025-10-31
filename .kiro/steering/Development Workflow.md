---
inclusion: always
---

# Development Workflow and Task Completion Practices

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

## Troubleshooting

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


## Kiro Agent Hook Integration

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