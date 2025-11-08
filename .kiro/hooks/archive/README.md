# Archived Hook Configurations

**Date**: October 30, 2025  
**Purpose**: Archive of deprecated hook configurations that used unsupported trigger types  
**Organization**: process-standard  
**Scope**: cross-project

---

## Why These Hooks Were Archived

These hook configuration files were replaced because they used **unsupported trigger types** in Kiro IDE's agent hook system.

### Unsupported Trigger Type: `taskStatusChange`

**Problem**: The original hook configurations used `taskStatusChange` and `taskStatus` trigger types, which are **not supported by Kiro IDE**.

**Supported Trigger Types** (per Kiro IDE documentation):
- `fileCreated` - Triggers when a new file matching a pattern is created
- `fileEdited` - Triggers when a file matching a pattern is modified
- `fileDeleted` - Triggers when a file matching a pattern is deleted
- `manual` - Triggers when user explicitly runs the hook

**Investigation**: Testing confirmed that hooks configured with `taskStatusChange` or `taskStatus` triggers never executed, even when tasks were marked complete using the `taskStatus` tool.

---

## Archived Files

### 1. `organize-after-task-completion.json`

**Original Purpose**: Automatically organize files based on **Organization** metadata when task status changed to "completed"

**Trigger Type Used**: `taskStatusChange` (unsupported)

**Why It Failed**:
- Kiro IDE does not emit `taskStatusChange` events
- Hook never triggered, even when using `taskStatus` tool
- File organization never executed automatically

**Replacement Strategy**: 
- File organization remains manual via `organize-by-metadata.sh` script
- No automatic hook replacement (manual process proven effective)

### 2. `task-completion-organization.json`

**Original Purpose**: Trigger agent execution to run file organization when task status changed to "completed"

**Trigger Type Used**: `taskStatus` with condition `status_changed_to_completed` (unsupported)

**Why It Failed**:
- Kiro IDE does not support `taskStatus` trigger type
- Condition syntax `status_changed_to_completed` also unsupported
- Hook never triggered, agent execution never occurred

**Replacement Strategy**:
- File organization remains manual via `organize-by-metadata.sh` script
- No automatic hook replacement (manual process proven effective)

---

## Current Hook Strategy

### Release Detection Hooks

**Automatic Release Detection** (`.kiro/hooks/release-detection-auto.kiro.hook`):
- **Trigger**: `fileCreated` with pattern `**/task-*-summary.md`
- **Purpose**: Trigger release detection when parent task summary documents are created in `docs/specs/[spec-name]/`
- **Status**: Active and working for manually created files through IDE UI
- **Limitation**: Only triggers for manual file operations, not AI-created files

**Manual Release Detection** (`.kiro/hooks/release-detection-manual.kiro.hook`):
- **Trigger**: `manual`
- **Purpose**: Fallback for release detection when automatic hook doesn't trigger
- **Status**: Active and working
- **Usage**: Run from Agent Hooks panel or via `./.kiro/hooks/release-manager.sh auto`

### File Organization

**Current Approach**: Manual organization via script
- **Script**: `.kiro/hooks/organize-by-metadata.sh`
- **Trigger**: Manual execution when needed
- **Rationale**: Manual process proven effective; automatic hook not essential

---

## Lessons Learned

### 1. Verify Trigger Type Support

Always verify that trigger types are supported by Kiro IDE before creating hook configurations. The documentation clearly lists supported types, but it's easy to assume additional trigger types exist.

### 2. Test Hook Execution

Create test hooks with simple actions (like creating a response file) to verify that triggers actually fire before building complex hook logic.

### 3. Manual Fallbacks Are Essential

Even with working automatic hooks, manual fallback options are critical for:
- Debugging when automatic hooks fail
- Edge cases where automatic triggers don't fire
- Testing hook logic independently

### 4. Hook Limitations Require Hybrid Approaches

Kiro IDE's `fileCreated` and `fileSaved` hooks only trigger for manual file operations through the IDE UI, not for programmatically created files by AI agents. This requires:
- Automatic hooks for manual workflows
- Manual triggers for AI-assisted workflows
- Clear documentation of when each approach is needed

---

## Migration Notes

If you need to restore or reference these configurations:

1. **Don't restore as-is**: The trigger types are unsupported and won't work
2. **Use current hooks**: The `.kiro.hook` format with supported trigger types is the correct approach
3. **Manual processes work**: File organization via `organize-by-metadata.sh` is effective without automation
4. **Hybrid approach**: Combine automatic hooks (for manual files) with manual triggers (for AI workflows)

---

*These configurations are preserved for historical reference and to document the unsupported trigger type issue. They should not be restored or used as templates for new hooks.*
