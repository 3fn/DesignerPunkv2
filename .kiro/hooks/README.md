# Kiro Task Completion Hooks

This directory contains hooks and automation for task completion workflows, specifically addressing the automatic commit requirement identified in the task completion process.

---

## Problem Identified

During Task 6 completion, we discovered that tasks specify "Post-Complete: Commit with message" but this doesn't happen automatically when using the `taskStatus` tool. This creates a workflow gap between task completion and version control.

---

## Solution Components

### 1. Task Completion Commit Script (`task-completion-commit.sh`)
**Purpose**: Automatically commit and push changes when a task is completed  
**Usage**: `./.kiro/hooks/task-completion-commit.sh [tasks-file] "[task-name]"`

**Features**:
- Detects uncommitted changes
- Extracts commit message from task's "Post-Complete" instruction
- Commits all changes with appropriate message
- Pushes to GitHub automatically
- Handles errors gracefully

### 2. Simple Wrapper (`commit-task.sh`)
**Purpose**: Easy-to-use wrapper for task completion commits  
**Usage**: `./.kiro/hooks/commit-task.sh "Task Name"`

**Features**:
- Simplified interface for common use case
- Automatically uses the current spec's tasks.md file
- Clear error messages and usage instructions

### 3. Agent Hook Configuration (`task-completion-agent-hook.md`)
**Purpose**: Documentation for setting up automatic Kiro agent hooks  
**Status**: Documentation ready, implementation pending

**Features**:
- File change monitoring for tasks.md
- Automatic trigger on task status changes
- Integration with Kiro's hook system

---

## Current Workflow

### Manual Process (Current)
1. Complete task work
2. Use `taskStatus` tool to mark task as completed
3. **Manually run**: `./.kiro/hooks/commit-task.sh "Task Name"`
4. Changes are automatically committed and pushed

### Example Usage
```bash
# After completing "6. Create Strategic Framework Documentation Package"
./.kiro/hooks/commit-task.sh "6. Create Strategic Framework Documentation Package"
```

### Future Automated Process (Goal)
1. Complete task work
2. Use `taskStatus` tool to mark task as completed
3. **Automatic**: Kiro hook detects completion and runs commit script
4. Changes are automatically committed and pushed

---

## Integration with Kiro

### Current Integration
- **Manual Trigger**: Scripts can be run manually after task completion
- **Git Integration**: Full git add, commit, and push automation
- **Message Extraction**: Parses task files to extract proper commit messages

### Future Integration Opportunities
- **File Watching**: Monitor tasks.md for status changes
- **Kiro Agent Hooks**: Integrate with Kiro's native hook system
- **Steering Integration**: Use Kiro steering to customize commit behavior
- **Notification Integration**: Notify team members of task completion

---

## Testing and Validation

### Tested Scenarios ✅
- Manual script execution with task name
- Git operations (add, commit, push)
- Commit message extraction from tasks
- Error handling for missing changes

### Validation Results ✅
- Scripts execute successfully
- Commits appear on GitHub with correct messages
- Push operations work correctly
- Error handling prevents workflow disruption

---

## Workflow Improvements Identified

### 1. Commit Message Extraction
**Issue**: Script needs better parsing of task-specific commit messages  
**Solution**: Enhanced AWK parsing to find correct task section  
**Status**: Implemented in updated script

### 2. Selective Staging
**Issue**: Currently stages all changes, not just task-related files  
**Solution**: Could implement selective staging based on task artifacts  
**Status**: Future enhancement

### 3. Branch Management
**Issue**: All commits go to main branch  
**Solution**: Could create feature branches for tasks  
**Status**: Future enhancement

### 4. Integration with taskStatus Tool
**Issue**: Manual step required after using taskStatus  
**Solution**: Integrate commit script with taskStatus workflow  
**Status**: Requires Kiro integration

---

## Next Steps

### Immediate (Manual Process)
1. ✅ **Scripts Created**: Task completion commit automation ready
2. ✅ **Testing Complete**: Scripts validated with real task completion
3. ✅ **Documentation**: Usage instructions and workflow documented

### Short Term (Semi-Automated)
1. **Kiro Hook Setup**: Configure Kiro agent hook for file monitoring
2. **Workflow Integration**: Integrate with existing task completion process
3. **Team Training**: Document process for team members

### Long Term (Fully Automated)
1. **Native Integration**: Integrate with Kiro's taskStatus tool
2. **Advanced Features**: Branch management, selective staging, notifications
3. **Process Refinement**: Continuous improvement based on usage

---

## Usage Examples

### Basic Task Completion
```bash
# Complete your task work, then:
./.kiro/hooks/commit-task.sh "1. Create North Star Vision Document"
```

### Advanced Usage
```bash
# For different specs or custom task files:
./.kiro/hooks/task-completion-commit.sh path/to/tasks.md "Task Name"
```

### Integration with Current Workflow
```bash
# After using taskStatus tool:
# 1. Mark task complete (already done)
# 2. Commit the completion:
./.kiro/hooks/commit-task.sh "6. Create Strategic Framework Documentation Package"
```

---

*This hook system addresses the workflow gap identified during Task 6 completion, providing both immediate manual solutions and a path toward full automation integration with Kiro's task management system.*
-
--

## File Organization Hooks

### Metadata-Driven Organization (`organize-by-metadata.sh`)
**Purpose**: Organize files based on **Organization** metadata in file headers  
**Usage**: `./.kiro/hooks/organize-by-metadata.sh [OPTIONS]`

**Features**:
- Scans markdown files for Organization metadata
- Validates metadata format and values
- Moves files to appropriate directories based on metadata
- Updates cross-references automatically
- Interactive confirmation before moving files

**Options**:
- `--validate-only`: Check metadata without organizing files
- `--dry-run`: Preview organization without moving files
- `--help`: Show detailed usage information

**Organization Values**:
- `framework-strategic`: Move to `strategic-framework/`
- `spec-validation`: Move to `.kiro/specs/[scope]/validation/`
- `spec-completion`: Move to `.kiro/specs/[scope]/completion/`
- `process-standard`: Keep in `.kiro/steering/`
- `working-document`: Keep in root directory

**Examples**:
```bash
# Interactive organization
./.kiro/hooks/organize-by-metadata.sh

# Validate metadata only
./.kiro/hooks/organize-by-metadata.sh --validate-only

# Preview organization
./.kiro/hooks/organize-by-metadata.sh --dry-run
```

### Enhanced Task Commit with Organization (`commit-task-organized.sh`)
**Purpose**: Commit task completion with optional file organization  
**Usage**: `./.kiro/hooks/commit-task-organized.sh "Task Name" [OPTIONS]`

**Features**:
- Optional file organization before commit
- Metadata validation before commit
- Standard task completion commit workflow
- Interactive confirmation for organization and commit
- Automatic cross-reference updates

**Options**:
- `--organize`: Run file organization before commit
- `--validate-metadata`: Validate metadata before commit
- `--help`: Show detailed usage information

**Examples**:
```bash
# Standard task completion
./.kiro/hooks/commit-task-organized.sh "7. Validate Strategic Framework"

# With file organization
./.kiro/hooks/commit-task-organized.sh "7. Validate Strategic Framework" --organize

# With metadata validation and organization
./.kiro/hooks/commit-task-organized.sh "7. Validate Strategic Framework" --validate-metadata --organize
```

---

## Integration with File Organization Standards

The organization hooks integrate with the **File Organization Standards** steering document to provide:

### Process-First Tool Development
- Manual organization process established first
- Hooks enhance proven manual processes
- Human control maintained with hook assistance
- Fallback to manual organization always available

### Metadata-Driven Safety
- No keyword detection or automated guessing
- Explicit human intent through metadata
- Validation prevents organization errors
- Interactive confirmation for all moves

### Sustainable Project Structure
- Framework artifacts separated from spec-specific artifacts
- Cross-reference integrity maintained automatically
- Directory structure scales with project growth
- Organization patterns work across multiple specs

### Quality Assurance
- Metadata validation ensures correct organization values
- Cross-reference updates prevent broken links
- Interactive confirmation prevents accidental moves
- Dry-run capability for safe preview