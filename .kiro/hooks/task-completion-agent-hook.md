# Task Completion Auto-Commit Agent Hook

**Hook Name**: Task Completion Auto-Commit  
**Trigger**: When a task is marked as completed in tasks.md  
**Purpose**: Automatically commit and push changes when tasks are completed  
**Type**: File Change Hook

---

## Hook Configuration

### Trigger Conditions
- **File Pattern**: `.kiro/specs/*/tasks.md`
- **Change Type**: File modification
- **Specific Pattern**: Task status change from `in_progress` to `completed`

### Hook Behavior
When a task status changes to completed:
1. Check for uncommitted changes in the repository
2. Extract the commit message from the task's "Post-Complete" instruction
3. Add all changes to git staging
4. Commit with the extracted message
5. Push to the remote repository
6. Log the completion for audit trail

### Agent Instructions
```
You are a task completion commit agent. When triggered by a task status change to "completed":

1. **Detect Task Completion**:
   - Monitor changes to tasks.md files
   - Identify when a task status changes to "completed"
   - Extract the task name and completion details

2. **Extract Commit Information**:
   - Look for "Post-Complete: Commit with message" in the completed task
   - Extract the specified commit message
   - If no message specified, use format: "Task Complete: [Task Name]"

3. **Perform Git Operations**:
   - Check if there are uncommitted changes: `git status --porcelain`
   - If changes exist, add all files: `git add .`
   - Commit with extracted message: `git commit -m "[message]"`
   - Push to remote: `git push origin main`

4. **Error Handling**:
   - If git operations fail, log the error but don't block task completion
   - If no commit message found, use generic format
   - If no changes to commit, log info message

5. **Logging**:
   - Log all actions taken for audit trail
   - Include timestamp, task name, and commit hash
   - Store logs in `.kiro/logs/task-completion-commits.log`

Use the bash script at `.kiro/hooks/task-completion-commit.sh` as a helper tool.
```

---

## Manual Usage

Until the automatic hook is configured, you can manually trigger the commit script:

```bash
# After completing a task, run:
./.kiro/hooks/task-completion-commit.sh .kiro/specs/fresh-repository-roadmap-refinement/tasks.md "Task Name"

# Or for any task file:
./.kiro/hooks/task-completion-commit.sh [path-to-tasks.md] "[Task Name]"
```

---

## Hook Testing

To test the hook functionality:

1. **Make a test change** to a task status
2. **Run the script manually** to verify it works
3. **Check the commit** appears correctly on GitHub
4. **Verify the commit message** matches the task's Post-Complete instruction

---

## Future Enhancements

- **Selective Staging**: Only stage files related to the completed task
- **Commit Message Templates**: Standardized commit message formats
- **Branch Management**: Create feature branches for tasks
- **Pull Request Creation**: Automatically create PRs for task completion
- **Notification Integration**: Notify team members of task completion

---

*This hook implements the automatic commit workflow identified as missing from the task completion process, enabling seamless integration between task management and version control.*