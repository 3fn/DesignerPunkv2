---
inclusion: always
---

# Development Workflow and Task Completion Practices

**Date**: 2025-10-20
**Last Reviewed**: 2026-01-04
**Purpose**: Task completion workflow and git practices for all development work
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 2
**Relevant Tasks**: all-tasks

## AI Agent Reading Priorities

**Note**: This section intentionally uses the same heading as other steering documents because each document provides reading priorities specific to its content. This structural pattern enables progressive disclosure and helps AI agents navigate to relevant sections efficiently.

**This document contains both essential workflow guidance and detailed troubleshooting reference material. Read strategically based on what you're doing RIGHT NOW.**

**Layer Context**: This is a Layer 2 (Frameworks and Patterns) document that provides reusable task completion workflows. It's always loaded but contains extensive conditional sections for specialized scenarios like hook debugging and setup.

### WHEN Executing Normal Tasks THEN **MUST** Read:
1. ✅ **Task Completion Workflow** (MUST READ - includes completion documentation quick reference)
2. ✅ **Spec Planning** (brief reference - points to Spec Planning Standards via MCP)
3. ✅ **Hook System Usage** (basic commands)
4. ✅ **Quality Standards** (MUST READ)
5. ❌ **SKIP**: Agent Hook Dependency Chains (priming only - query MCP for details), Troubleshooting sections, Hook Integration details

**MCP Queries for Detailed Guidance** (query when needed):
- **Completion Documentation**: `get_section({ path: ".kiro/steering/Completion Documentation Guide.md", heading: "Two-Document Workflow" })`
- **Release Detection**: `get_section({ path: ".kiro/steering/Release Management System.md", heading: "Release Pipeline Architecture" })`
- **File Organization**: `get_section({ path: ".kiro/steering/Process-File-Organization.md", heading: "Organization Implementation (Conditional Loading)" })`
- **Hook Operations**: `get_section({ path: ".kiro/steering/Process-Hook-Operations.md", heading: "Agent Hook Dependency Chains" })`

### WHEN Debugging Hook Issues THEN Read:
1. ✅ **Task Completion Workflow** (context)
2. ✅ **Agent Hook Dependency Chains** (priming - then query MCP for detailed guidance)
3. ✅ **Troubleshooting** (priming - then query MCP for detailed guidance)
4. ❌ **SKIP**: Spec Planning, Kiro Agent Hook Integration

**MCP Queries for Detailed Guidance** (query when needed):
- **Hook Dependency Chains**: `get_section({ path: ".kiro/steering/Process-Hook-Operations.md", heading: "Agent Hook Dependency Chains" })`
- **Hook Troubleshooting**: `get_section({ path: ".kiro/steering/Process-Hook-Operations.md", heading: "Troubleshooting" })`
- **Common Issues**: `get_section({ path: ".kiro/steering/Process-Hook-Operations.md", heading: "Common Issues and Solutions" })`
- **Release Detection Issues**: `get_section({ path: ".kiro/steering/Process-Hook-Operations.md", heading: "Release Detection Not Triggering" })`
- **Hook Best Practices**: `get_section({ path: ".kiro/steering/Process-Hook-Operations.md", heading: "Best Practices" })`

### WHEN Setting Up or Modifying Hooks THEN Read:
1. ✅ **Agent Hook Dependency Chains** (priming - then query MCP for detailed guidance)
2. ✅ **Kiro Agent Hook Integration** (priming - then query MCP for detailed guidance)
3. ✅ **Troubleshooting** (priming - then query MCP for detailed guidance)
4. ❌ **SKIP**: Task Completion Workflow, Quality Standards

**MCP Queries for Detailed Guidance** (query when needed):
- **Hook Dependency Chains**: `get_section({ path: ".kiro/steering/Process-Hook-Operations.md", heading: "Agent Hook Dependency Chains" })`
- **Hook Troubleshooting**: `get_section({ path: ".kiro/steering/Process-Hook-Operations.md", heading: "Troubleshooting" })`
- **Kiro Agent Hook Integration**: `get_section({ path: ".kiro/steering/Process-Hook-Operations.md", heading: "Kiro Agent Hook Integration" })`

### WHEN Creating Completion Documentation THEN Read:
1. ✅ **Task Completion Workflow** (quick reference section)
2. ✅ Query **Completion Documentation Guide** via MCP for detailed guidance:
   - `get_document_full({ path: ".kiro/steering/Completion Documentation Guide.md" })`
   - Or specific sections: `get_section({ path: ".kiro/steering/Completion Documentation Guide.md", heading: "Documentation Tiers" })`

---

## Task Completion Workflow

### Recommended Process (IDE-based with Automation)
1. **[MANUAL]** **Complete Task Work**: Implement all requirements and create specified artifacts
2. **[MANUAL]** **Validate Implementation**: 
   - For regular tasks: Run `npm test` (fast validation, ~10 min)
   - For parent tasks (default): Run `npm test` (comprehensive functional validation, ~10 min)
   - For parent tasks modifying release-analysis/release-detection: Run `npm run test:all` (~28 min)
   - For performance tasks: Run `npm run test:performance` (~20 min)
3. **[MANUAL]** **Create Detailed Completion Document**: For parent tasks, create comprehensive completion doc at `.kiro/specs/[spec-name]/completion/task-N-parent-completion.md` (Tier 3)
4. **[MANUAL]** **Create Summary Document**: For parent tasks, create concise summary doc at `docs/specs/[spec-name]/task-N-summary.md` (triggers release detection for manual files only)
5. **[MANUAL - CRITICAL AI Workflows]** **Trigger Release Detection**: Run `./.kiro/hooks/release-manager.sh auto` (required for AI-created files; automatic hooks only work for manual IDE file operations)
6. **[AUTOMATED - Manual Files]** **Release Detection**: Kiro IDE detects summary document creation and triggers release detection hook automatically (only for manually created files through IDE UI)
7. **[MANUAL]** **Mark Task Complete**: Use `taskStatus` tool to update task status to "completed" when finished
8. **[MANUAL]** **Commit Changes**: Run `./.kiro/hooks/commit-task.sh "Task Name"` to automatically commit and push
9. **[MANUAL]** **Verify on GitHub**: Confirm changes appear in repository with correct commit message

**Why use `taskStatus` tool?**
- Triggers agent hooks for automatic file organization
- Triggers agent hooks for automatic release detection
- Maintains consistent task tracking in tasks.md
- Enables automation without manual steps

**Completion Documentation Quick Reference**:
- **Parent tasks require TWO documents**: detailed completion doc + summary doc
- **Detailed doc**: `.kiro/specs/[spec-name]/completion/task-N-completion.md` (internal)
- **Summary doc**: `docs/specs/[spec-name]/task-N-summary.md` (triggers release detection)
- **Subtasks**: Only need detailed completion doc (no summary)

**For detailed guidance** on documentation tiers, naming conventions, templates, and the two-document workflow, query Completion Documentation Guide via MCP:

```
get_document_full({ path: ".kiro/steering/Completion Documentation Guide.md" })
```

Or query specific sections:
```
get_section({ path: ".kiro/steering/Completion Documentation Guide.md", heading: "Two-Document Workflow" })
get_section({ path: ".kiro/steering/Completion Documentation Guide.md", heading: "Documentation Tiers" })
get_section({ path: ".kiro/steering/Completion Documentation Guide.md", heading: "Naming Conventions" })
```

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

## Spec Planning (Conditional Loading)

**📖 CONDITIONAL SECTION - Read only when needed**

**Load when**: 
- Creating or updating specification documents (requirements.md, design.md, tasks.md)
- Need reference to spec planning standards location
- Working on spec-related tasks

**Skip when**: 
- Executing implementation tasks
- Normal development work without spec creation
- Following established task specifications

---

**WHEN creating or updating specification documents (requirements.md, design.md, tasks.md):**

See **Spec Planning Standards** (`.kiro/steering/Process-Spec-Planning.md`) for complete guidance on:
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

## Agent Hook Dependency Chains

Agent hooks use `runAfter` configuration to create dependency chains where hooks wait for prerequisite hooks to complete. Understanding these chains is essential for debugging hook issues and ensuring reliable automation.

**Key Concepts**:
- Hooks can depend on other hooks via `runAfter` configuration
- Dependent hooks wait for prerequisites to complete before executing
- If a prerequisite fails, times out, or is cancelled, dependent hooks typically don't execute
- Each hook has independent timeout values (file organization: 10 min, release detection: 5 min)

**For detailed guidance** on dependency chain behavior, troubleshooting, and best practices, query Process-Hook-Operations via MCP:

```
get_document_full({ path: ".kiro/steering/Process-Hook-Operations.md" })
```

Or query specific sections:
```
get_section({ path: ".kiro/steering/Process-Hook-Operations.md", heading: "Agent Hook Dependency Chains" })
get_section({ path: ".kiro/steering/Process-Hook-Operations.md", heading: "Dependency Chain Behavior" })
get_section({ path: ".kiro/steering/Process-Hook-Operations.md", heading: "Best Practices" })
```

---

## Quality Standards

**Note**: This section intentionally uses the same heading as other steering documents because each document defines quality standards specific to its domain. Development Workflow focuses on task completion quality, while other documents define standards for their respective processes.

### Before Task Completion
- Verify all success criteria are met
- Ensure all specified artifacts are created
- Validate cross-references and links work correctly
- Check that documentation follows concept-based approach (no implementation details)

### After Task Completion
- Confirm commit appears on GitHub with correct message
- Verify all files are properly tracked in git
- Check that task status is marked as completed in tasks.md

---

## Troubleshooting

When experiencing errors or failures during task completion, hooks not triggering, or debugging automation issues, comprehensive troubleshooting guidance is available via MCP. This includes common issues, error recovery procedures, hook troubleshooting, release detection issues, and diagnostic commands.

**For detailed troubleshooting guidance**, query Process-Hook-Operations via MCP:

```
get_document_full({ path: ".kiro/steering/Process-Hook-Operations.md" })
```

Or query specific sections:
```
get_section({ path: ".kiro/steering/Process-Hook-Operations.md", heading: "Troubleshooting" })
get_section({ path: ".kiro/steering/Process-Hook-Operations.md", heading: "Common Issues and Solutions" })
get_section({ path: ".kiro/steering/Process-Hook-Operations.md", heading: "Release Detection Not Triggering" })
get_section({ path: ".kiro/steering/Process-Hook-Operations.md", heading: "Quick Reference: Diagnostic Commands" })
```

**Quick Reference - Common Issues**:
- **No changes to commit**: Ensure all work is saved and files are created
- **Wrong commit message**: Verify task name matches exactly with tasks.md
- **Push failures**: Check GitHub authentication and network connectivity
- **Hook script errors**: Ensure scripts have execute permissions (`chmod +x`)

**Quick Reference - Error Recovery**:
- If commit fails: Fix issues and re-run hook script
- If push fails: Run `git push origin main` manually
- If wrong message: Use `git commit --amend -m "Correct Message"` then force push


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

Agent hooks provide automatic file organization and release detection when tasks are completed. Understanding hook execution order, automatic behaviors, and manual fallbacks is essential for reliable automation.

**Key Concepts**:
- File organization triggers on task completion (requires user confirmation)
- Release detection runs after file organization (auto-approve)
- Hooks use `runAfter` dependencies to ensure correct execution order
- `.kiro/` directory is filtered from Kiro IDE file watching

**For detailed guidance** on hook execution order, automatic file organization, release detection, and troubleshooting, query Process-Hook-Operations via MCP:

```
get_document_full({ path: ".kiro/steering/Process-Hook-Operations.md" })
```

Or query specific sections:
```
get_section({ path: ".kiro/steering/Process-Hook-Operations.md", heading: "Kiro Agent Hook Integration" })
get_section({ path: ".kiro/steering/Process-Hook-Operations.md", heading: "Agent Hook Execution Order" })
get_section({ path: ".kiro/steering/Process-Hook-Operations.md", heading: "Automatic File Organization" })
get_section({ path: ".kiro/steering/Process-Hook-Operations.md", heading: "Release Detection" })
```