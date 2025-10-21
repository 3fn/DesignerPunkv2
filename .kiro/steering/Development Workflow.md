---
inclusion: always
---

# Development Workflow and Task Completion Practices

## Task Completion Workflow

### Standard Process
1. **Complete Task Work**: Implement all requirements and create specified artifacts
2. **Mark Task Complete**: Use `taskStatus` tool to update task status to "completed"
3. **[AUTOMATED]** **File Organization**: Kiro agent hook automatically checks for files needing organization
4. **Commit Changes**: Run `./.kiro/hooks/commit-task.sh "Task Name"` to automatically commit and push
5. **Verify on GitHub**: Confirm changes appear in repository with correct commit message

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

### Automatic Release Detection

**Trigger**: Task status changes to "completed" (runs after file organization)  
**Hook**: `.kiro/hooks/release-manager.sh`  
**Purpose**: Automatically detect release triggers and process them through the release management system

#### Workflow
1. **Detection**: Kiro detects task completion event
2. **Organization First**: File organization hook runs first (if needed)
3. **Release Detection**: Release manager checks for release triggers
4. **Trigger Processing**: Creates release trigger files with metadata
5. **Analysis**: Runs release analysis if triggers detected
6. **Logging**: Records all activity in release manager log

#### How It Works

**Hook Chain**:
```
Task Completion Event
    ↓
File Organization Hook (if needed)
    ↓
Release Detection Hook
    ↓
Release Analysis (if triggered)
```

**Trigger Detection**:
- **Spec Completion**: Detects completion documents in `.kiro/specs/*/completion/`
- **Task Completion**: Detects task completion commits with "Task X Complete" messages
- **Configuration**: Controlled by `.kiro/release-config.json`

**Automatic vs Manual**:
- **Automatic**: Runs when using `taskStatus` tool to mark tasks complete
- **Manual**: Can be triggered with `./.kiro/hooks/release-manager.sh auto`
- **Bypass**: Direct git commits bypass the automation (no task status change event)

#### Configuration

**Release Config** (`.kiro/release-config.json`):
```json
{
  "detection": {
    "specCompletionTrigger": true,
    "taskCompletionTrigger": true
  }
}
```

**Agent Hook Config** (`.kiro/agent-hooks/release-detection-on-task-completion.json`):
```json
{
  "name": "Release Detection on Task Completion",
  "trigger": {
    "type": "taskStatusChange",
    "status": "completed"
  },
  "settings": {
    "requireConfirmation": false,
    "autoApprove": true,
    "runAfter": ["organize-after-task-completion"]
  }
}
```

#### Why It Didn't Run

**Common Reasons**:

1. **No Task Status Change Event**
   - Used direct git commands instead of `taskStatus` tool
   - Manual commits bypass Kiro IDE automation
   - Hook only triggers on IDE events, not raw git operations

2. **Hook Chain Dependency**
   - Release detection runs after file organization
   - If organization hook doesn't run, release detection may not run
   - Dependency chain: task completion → organization → release detection

3. **Configuration Disabled**
   - Release detection may be disabled in `.kiro/release-config.json`
   - Check `specCompletionTrigger` and `taskCompletionTrigger` settings

#### Manual Trigger

**When to use**:
- After manual git commits that should trigger release analysis
- When automatic detection didn't run
- For testing release detection logic

**How to trigger**:
```bash
# Automatic mode (detects triggers from recent changes)
./.kiro/hooks/release-manager.sh auto

# Check release manager log
cat .kiro/logs/release-manager.log

# Check for trigger files
ls -la .kiro/release-triggers/
```

#### Logging and Debugging

**Log Location**: `.kiro/logs/release-manager.log`

**What's Logged**:
- Task completion events detected
- Release triggers found
- Trigger files created
- Analysis execution
- Errors and warnings

**Debugging Steps**:
1. Check if log file exists: `cat .kiro/logs/release-manager.log`
2. Check for trigger files: `ls .kiro/release-triggers/`
3. Verify release config: `cat .kiro/release-config.json`
4. Check agent hook config: `cat .kiro/agent-hooks/release-detection-on-task-completion.json`

#### Best Practices

**For Automatic Triggering**:
- Use `taskStatus` tool to mark tasks complete (triggers automation)
- Let the hook chain execute (organization → release detection)
- Check logs to verify execution

**For Manual Commits**:
- Understand that direct git commits bypass automation
- Manually trigger release detection if needed: `./.kiro/hooks/release-manager.sh auto`
- Consider using `taskStatus` tool even for manual work to maintain automation

**For Development**:
- Test hooks with `taskStatus` tool to verify automation
- Check logs after task completion to confirm execution
- Use manual trigger for testing and debugging

#### Integration Benefits

- **Automatic Release Detection**: No manual release analysis needed
- **Consistent Process**: Release detection happens automatically for all task completions
- **Audit Trail**: All release triggers logged with metadata
- **Flexible Triggering**: Automatic via IDE events or manual via script