# Task 5.1 Completion: Investigate commit-task.sh --help Issue

**Date**: October 29, 2025
**Task**: 5.1 Investigate commit-task.sh --help issue
**Type**: Implementation
**Status**: Complete
**Organization**: spec-completion
**Scope**: release-detection-infrastructure-investigation

---

## Artifacts Created

- Investigation findings added to `investigation-notes.md` (Issue #002 section)
- Root cause analysis documented with code examples
- Fix approach recommended with implementation details

## Implementation Details

### Investigation Approach

Investigated Issue #002 from the Phase 1 Discovery Audit: "commit-task.sh treats --help as task name". The investigation involved:

1. **Testing Actual Behavior**: Executed `./.kiro/hooks/commit-task.sh --help` to observe what happens
2. **Code Analysis**: Examined argument parsing logic in commit-task.sh
3. **Root Cause Identification**: Traced through the code to understand why --help is treated as a task name
4. **Relationship Assessment**: Determined if this issue is related to hook system failures
5. **Fix Design**: Designed a simple fix with usage display

### Root Cause Identified

**Problem**: The script's argument parsing logic does not recognize `--help` as a special flag.

**Code Location**: `.kiro/hooks/commit-task.sh` lines 8-26

**Why It Happens**:

1. Script initializes `TASK_NAME="$1"` before parsing arguments
2. Argument parsing loop only handles `--no-analyze` case
3. Any unrecognized argument (including `--help`) falls through to `*)` case
4. The `*)` case would assign to `TASK_NAME`, but it's already set
5. Script continues with `TASK_NAME="--help"` and creates a commit

**Design Flaw**: Pre-assigning `TASK_NAME="$1"` means the first argument is always treated as the task name, even if it's a flag like `--help`.

### Test Results

**Test Performed**: `./.kiro/hooks/commit-task.sh --help`

**Actual Output**:
```bash
🚀 Committing completion of: --help
🔍 Checking for changes to commit...
📝 Changes detected, preparing commit...
💾 Committing with message: Task Complete: --help
[main ec2dd84] Task Complete: --help
```

**Evidence**: Created an actual git commit with message "Task Complete: --help", confirming the issue.

### Relationship to Hook System Issues

**Assessment**: This issue is **NOT related** to the agent hook system failures.

**Rationale**:
- This is a standalone script issue in argument parsing logic
- Affects manual script invocation, not hook triggering
- Hook system issues are about hooks not executing at all
- This issue is about incorrect behavior when script DOES execute
- Different failure modes: hook system = no execution, this = wrong execution

**Conclusion**: This issue exists independently and would need fixing regardless of hook system status.

### Fix Approach

**Recommended Solution**: Add `--help` and `-h` cases to argument parsing with usage display.

**Implementation Strategy**:

```bash
# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --help|-h)
            echo "Usage: $0 \"Task Name\" [--no-analyze]"
            echo ""
            echo "Arguments:"
            echo "  Task Name       Name of the task to commit (required)"
            echo "  --no-analyze    Skip release analysis after commit (optional)"
            echo "  --help, -h      Display this help message"
            echo ""
            echo "Examples:"
            echo "  $0 \"1. Create North Star Vision Document\""
            echo "  $0 \"2.3 Implement token validation\" --no-analyze"
            exit 0
            ;;
        --no-analyze)
            NO_ANALYZE=true
            shift
            ;;
        *)
            if [ -z "$TASK_NAME" ]; then
                TASK_NAME="$1"
            fi
            shift
            ;;
    esac
done
```

**Complexity**: Simple (single file change, one case statement addition)

**Risks**: Low (isolated change, backward compatible, no breaking changes)

**Testing Requirements**:
1. Test `--help` displays usage and exits without commit
2. Test `-h` displays usage and exits without commit
3. Test normal usage still works
4. Test `--no-analyze` flag still works
5. Test combination of flags
6. Test invalid usage displays error

### Additional Recommendations

**Pattern Consistency**: Should check if other hook scripts have the same argument parsing flaw:
- `.kiro/hooks/task-completion-commit.sh`
- `.kiro/hooks/release-manager.sh`
- `.kiro/agent-hooks/organize-after-task.sh`

**Recommendation**: Apply consistent argument parsing pattern across all hook scripts with proper `--help` support.

## Validation (Tier 2: Standard)

### Syntax Validation
✅ No code changes made (investigation only)
✅ Investigation notes properly formatted markdown

### Functional Validation
✅ Successfully reproduced the issue
✅ Confirmed --help is treated as task name
✅ Verified actual commit was created with "Task Complete: --help" message
✅ Traced through code to identify root cause

### Integration Validation
✅ Assessed relationship to hook system issues (not related)
✅ Identified issue as independent script bug
✅ Confirmed issue affects manual invocation only

### Requirements Compliance
✅ Requirement 4.1: Tested `.kiro/hooks/commit-task.sh --help` behavior
✅ Requirement 4.1: Traced through argument parsing logic
✅ Requirement 4.1: Determined why --help is treated as task name
✅ Requirement 4.1: Assessed if related to hook system issues (not related)
✅ Requirement 4.1: Documented root cause and fix approach
✅ Requirement 4.1: Recorded findings in investigation notes

## Key Findings

### Root Cause
Argument parsing logic does not recognize `--help` as a special flag. The script pre-assigns `TASK_NAME="$1"` before parsing, causing any first argument (including flags) to be treated as the task name.

### Independence
This issue is independent of hook system failures. It's a script design flaw that affects manual invocation, not automatic hook triggering.

### Fix Complexity
Simple fix requiring only a single case statement addition to handle `--help` and `-h` flags with usage display.

### Broader Pattern
Other hook scripts may have similar argument parsing issues and should be checked for consistency.

## Next Steps

This investigation is complete. The findings document:
1. The exact root cause (argument parsing logic flaw)
2. Why it happens (pre-assignment of TASK_NAME)
3. How to fix it (add --help case with usage display)
4. Testing approach (6 test scenarios)
5. Broader recommendations (check other scripts)

The fix should be implemented in a separate fix specification after all investigation tasks are complete.

---

*This investigation identified a simple script bug in argument parsing that causes --help to be treated as a task name. The issue is independent of hook system failures and has a straightforward fix with low complexity and risk.*
