# Auto-Organize on Task Completion

**Hook Name**: Auto-Organize on Task Completion  
**Trigger**: Task status changes to "completed"  
**Purpose**: Automatically organize files based on metadata after task completion  
**Date**: January 10, 2025  
**Organization**: process-standard  
**Scope**: cross-project

---

## Hook Configuration

### Trigger Conditions
- **Event**: Task status change
- **Condition**: Status changes to "completed"
- **Scope**: All tasks in all specs
- **Timing**: Immediately after task completion

### Agent Instructions

When a task is completed, execute the following workflow:

#### Step 1: Check for Unorganized Files
Run the organization hook in validation mode to identify files that need organization:

```bash
./.kiro/hooks/organize-by-metadata.sh --validate-only
```

If validation shows files without organization metadata, prompt the user about adding metadata.

#### Step 2: Run File Organization
If files with organization metadata are found that need organizing, run:

```bash
./.kiro/hooks/organize-by-metadata.sh --dry-run
```

Show the user what would be organized and ask for confirmation to proceed.

#### Step 3: Execute Organization
If user confirms, run the full organization:

```bash
./.kiro/hooks/organize-by-metadata.sh
```

This will:
- Move files to appropriate directories based on metadata
- Update cross-references automatically
- Maintain bidirectional link integrity

#### Step 4: Commit Organization Changes
If files were organized, commit the organization changes:

```bash
git add -A
git commit -m "Auto-organize files after task completion

- Organized files based on **Organization** metadata
- Updated cross-references to maintain link integrity
- Applied File Organization Standards automatically"
git push
```

### Safety Features

#### Human Control Maintained
- **Interactive Confirmation**: User must approve organization before execution
- **Dry-Run Preview**: Show what will be organized before moving files
- **Metadata Validation**: Validate metadata before attempting organization
- **Manual Override**: User can skip organization if desired

#### Quality Assurance
- **Cross-Reference Updates**: Automatically update links after file moves
- **Metadata Validation**: Ensure organization metadata is correct before organizing
- **Directory Creation**: Create target directories if they don't exist
- **Conflict Prevention**: Skip moves that would overwrite existing files

#### Fallback Options
- **Manual Organization**: User can always run hooks manually
- **Skip Organization**: User can choose not to organize after task completion
- **Partial Organization**: User can organize some files but not others
- **Rollback Capability**: Git history maintains ability to rollback organization

---

## Integration with Existing Workflow

### Current Task Completion Process
1. Complete task work and create artifacts
2. Mark task complete using `taskStatus` tool
3. **[NEW]** Agent hook automatically triggers organization check
4. Commit changes using existing commit hooks
5. Verify changes on GitHub

### Enhanced Task Completion Process
1. Complete task work and create artifacts
2. Mark task complete using `taskStatus` tool
3. **Agent hook automatically runs organization workflow:**
   - Validates metadata in new files
   - Shows preview of files to be organized
   - Prompts for user confirmation
   - Organizes files and updates cross-references
   - Commits organization changes
4. Continue with existing commit workflow if needed
5. Verify changes on GitHub

### Workflow Benefits
- **Automatic Organization**: Files organized immediately after task completion
- **Prevents Accumulation**: No buildup of unorganized files in root directory
- **Maintains Quality**: Cross-reference integrity preserved automatically
- **User Control**: Human confirmation required for all organization actions

---

## Hook Implementation

### Agent Prompt Template

```
A task has just been completed. Please help organize any new files based on their **Organization** metadata.

Follow this workflow:

1. **Check for files needing organization:**
   Run: `./.kiro/hooks/organize-by-metadata.sh --validate-only`
   
2. **Preview organization:**
   Run: `./.kiro/hooks/organize-by-metadata.sh --dry-run`
   
3. **If files need organization:**
   - Show the user what will be organized
   - Ask for confirmation to proceed
   - If confirmed, run: `./.kiro/hooks/organize-by-metadata.sh`
   
4. **If organization occurred:**
   - Commit the organization changes
   - Include descriptive commit message about what was organized

Remember:
- Always get user confirmation before organizing files
- Validate metadata before attempting organization
- Update cross-references automatically after moves
- Maintain the File Organization Standards throughout

The goal is to keep the project structure clean and organized while maintaining human control over all organization decisions.
```

### Configuration Settings
- **Auto-Approve**: `false` (require human confirmation)
- **Timeout**: 10 minutes (allow time for user interaction)
- **Context Files**: Include organization hooks and standards
- **Working Directory**: Project root

---

## Expected Outcomes

### Immediate Benefits
- **Clean Project Structure**: Files automatically organized after task completion
- **Reduced Manual Work**: Organization happens automatically with user confirmation
- **Maintained Quality**: Cross-reference integrity preserved through automation
- **Consistent Application**: Organization standards applied consistently

### Long-Term Benefits
- **Scalable Organization**: Pattern works as project grows and more specs are created
- **Knowledge Preservation**: Framework artifacts properly separated from spec-specific work
- **Developer Experience**: Clean, navigable project structure maintained automatically
- **Quality Assurance**: Organization standards enforced through automation

### Success Metrics
- **Organization Rate**: Percentage of new files that get organized automatically
- **User Adoption**: Frequency of users confirming organization vs. skipping
- **Quality Maintenance**: Cross-reference integrity maintained through automated updates
- **Time Savings**: Reduction in manual organization effort

---

## Troubleshooting

### Common Issues
- **Metadata Validation Errors**: Files with incorrect or missing organization metadata
- **Cross-Reference Update Failures**: Links that can't be automatically updated
- **Directory Creation Issues**: Problems creating target directories
- **Git Commit Failures**: Issues committing organization changes

### Resolution Approaches
- **Metadata Guidance**: Prompt user to add or fix organization metadata
- **Manual Cross-Reference Updates**: Fall back to manual link updates if automation fails
- **Directory Permissions**: Ensure proper permissions for directory creation
- **Git Status Check**: Verify git status before attempting commits

### Fallback Procedures
- **Manual Organization**: User can always run organization hooks manually
- **Skip Automation**: User can choose to skip automatic organization
- **Partial Organization**: Organize some files manually, others automatically
- **Rollback Changes**: Use git history to rollback problematic organization

---

*This agent hook integrates file organization automation with the existing task completion workflow while maintaining human control and quality assurance throughout the process.*