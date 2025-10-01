---
inclusion: always
---

# Development Workflow and Task Completion Practices

## Task Completion Workflow

### Standard Process
1. **Complete Task Work**: Implement all requirements and create specified artifacts
2. **Mark Task Complete**: Use `taskStatus` tool to update task status to "completed"
3. **Commit Changes**: Run `./.kiro/hooks/commit-task.sh "Task Name"` to automatically commit and push
4. **Verify on GitHub**: Confirm changes appear in repository with correct commit message

### Commit Message Standards
- All task completions should use the commit message specified in the task's "Post-Complete" instruction
- Format: "Task [Number] Complete: [Task Description]"
- Example: "Task 6 Complete: Strategic Framework Documentation Package"

### Git Practices
- **Repository**: https://github.com/3fn/DesignerPunkv2
- **Branch**: All work on `main` branch (single-branch workflow for now)
- **Commits**: Atomic commits per task completion with descriptive messages
- **Push**: Always push immediately after commit to maintain synchronization

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

### Future Enhancements
- Automatic trigger on task status change (Kiro agent hook)
- Branch management for individual tasks
- Integration with pull request workflow
- Notification system for team coordination

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