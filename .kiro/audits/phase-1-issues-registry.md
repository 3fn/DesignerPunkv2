# Phase 1 Issues Registry

**Date**: October 28, 2025
**Last Updated**: October 29, 2025 (Task 5.4 completion)
**Total Issues**: 25 (24 issues + 1 validation completion note)
**Status**: Discovery Phase
**Organization**: audit-findings
**Scope**: phase-1-discovery-audit

---

## Overview

This registry serves as the centralized record of all issues discovered during the Phase 1 Discovery Audit. Each issue is assigned a unique ID and documented with complete details including severity, evidence, reproduction steps, and cross-area impact.

All discovery reports reference issues in this registry rather than duplicating information, ensuring consistency and enabling cross-area awareness.

---

## Issue Format and Guidelines

### Complete Issue Format

All issues documented in this registry MUST follow this format:

```markdown
## Issue #[ID]: [Title]

**Discovered By**: [Area] Discovery Audit
**Date Discovered**: [Date]
**Severity**: Critical | Important | Minor
**Category**: [Specific category within area]
**Affects**: [What systems/areas this impacts]

**Location**:
- **File(s)**: `path/to/file.ts` (lines 45-67)
- **System**: [Specific system/component]
- **Context**: [Where in the codebase/workflow this occurs]

**Description**:
[Full description of what's wrong]

**Steps to Reproduce**:
1. [Specific step 1]
2. [Specific step 2]
3. [Specific step 3]
4. [Observe the issue]

**Expected Behavior**:
[What should happen]

**Actual Behavior**:
[What actually happens]

**Evidence**:
```[language]
[Code snippet, configuration, error message, or output]
```

**Workaround** (if applicable):
[Temporary workaround if one exists]

**Cross-Area Impact**:
- Infrastructure: [Impact if any]
- Architecture: [Impact if any]
- Token System: [Impact if any]
- Documentation: [Impact if any]

**Related Issues**:
[References to known issues in .kiro/issues/ if applicable]

---
```

### Required Fields

#### Issue ID
- **Format**: Sequential numbering starting at #001
- **Pattern**: #001, #002, #003, etc.
- **Purpose**: Unique identifier for cross-referencing from discovery reports

#### Title
- **Format**: Brief, descriptive title (5-10 words)
- **Purpose**: Quick identification of the issue
- **Example**: "Release detection hook not triggering on task completion"

#### Discovered By
- **Format**: [Area] Discovery Audit
- **Values**: Infrastructure, Architecture, Token System, or Documentation
- **Purpose**: Track which audit discovered the issue

#### Date Discovered
- **Format**: YYYY-MM-DD
- **Purpose**: Track when issue was found during audit

#### Severity
- **Values**: Critical, Important, or Minor
- **Purpose**: Prioritize issues for future fix specs
- **See**: Severity Classification Criteria section below

#### Category
- **Format**: Specific category within the discovery area
- **Examples**: 
  - Infrastructure: "Release Management", "Build Automation", "File Organization"
  - Architecture: "Platform Consistency", "Separation of Concerns", "Interface Contracts"
  - Token System: "Mathematical Consistency", "Reference Integrity", "Generation Accuracy"
  - Documentation: "Completion Accuracy", "Cross-Reference Integrity", "Spec Drift"

#### Affects
- **Format**: List of systems, components, or areas impacted
- **Purpose**: Understand blast radius of the issue
- **Example**: "Release management system, task completion workflow, CI/CD pipeline"

#### Location
- **File(s)**: Specific file paths with line numbers if applicable
- **System**: Specific system or component name
- **Context**: Where in the codebase or workflow this occurs
- **Purpose**: Enable someone to find and reproduce the issue

#### Description
- **Format**: 2-4 paragraphs explaining the issue in detail
- **Content**: What's wrong, why it's wrong, what the impact is
- **Purpose**: Complete understanding of the issue

#### Steps to Reproduce
- **Format**: Numbered list of specific, actionable steps
- **Content**: Exact commands, file paths, actions needed to see the issue
- **Purpose**: Enable verification and future testing
- **Requirement**: Must be specific enough for someone else to reproduce

#### Expected Behavior
- **Format**: 1-2 sentences describing correct behavior
- **Purpose**: Define what success looks like

#### Actual Behavior
- **Format**: 1-2 sentences describing current behavior
- **Purpose**: Contrast with expected behavior

#### Evidence
- **Format**: Code snippets, error messages, configuration files, or output
- **Language**: Specify language for syntax highlighting
- **Purpose**: Concrete proof of the issue
- **Requirement**: Must be actual evidence, not hypothetical

#### Workaround
- **Format**: Description of temporary solution if one exists
- **Optional**: Only include if a workaround is available
- **Purpose**: Enable continued development while issue remains unfixed

#### Cross-Area Impact
- **Format**: List impact on each discovery area
- **Content**: Specific description of how this issue affects other areas
- **Purpose**: Enable cross-area awareness and prioritization
- **Note**: Use "None" if no impact on a particular area

#### Related Issues
- **Format**: References to existing issues in `.kiro/issues/` directory
- **Purpose**: Connect to known issues and avoid duplication
- **Note**: Include explanation of relationship

---

### Severity Classification Criteria

#### Critical Severity

**Definition**: Issues that block development, cause system failures, or violate core architectural principles.

**Criteria**:
- Prevents development or deployment
- Causes system crashes or data loss
- Breaks fundamental architectural patterns
- Affects multiple systems or platforms
- No workaround available

**Examples**:
- Release detection completely broken with no workaround
- Build system fails for all platforms
- Core validation system non-functional
- Mathematical foundation violated across entire system
- Cross-platform generation produces incorrect output for all platforms

**When to Use**:
- Issue must meet at least 2 of the criteria above
- Impact is immediate and severe
- Cannot proceed with development without addressing

#### Important Severity

**Definition**: Issues that reduce efficiency, create technical debt, or violate established patterns.

**Criteria**:
- Reduces development efficiency
- Creates maintenance burden
- Violates established patterns
- Affects single system or platform
- Workaround available but inconvenient

**Examples**:
- Platform implementation inconsistent with other platforms
- Validation gaps for specific token types
- Documentation drift for major features
- Cross-reference integrity issues affecting navigation
- Build automation requires manual intervention

**When to Use**:
- Issue meets at least 1 of the criteria above
- Impact is significant but not blocking
- Workaround exists but adds friction
- Should be addressed soon but not immediately

#### Minor Severity

**Definition**: Issues that are cosmetic, isolated, or have minimal impact.

**Criteria**:
- Cosmetic or style issues
- Documentation inconsistencies
- Non-blocking improvements
- Isolated to specific component
- Easy workaround available

**Examples**:
- Inconsistent file naming conventions
- Missing inline code comments
- Outdated examples in documentation
- Minor cross-reference issues
- Formatting inconsistencies

**When to Use**:
- Issue has minimal impact on development
- Easy to work around
- Isolated to small area
- Nice to fix but not urgent

---

### Reproduction Steps Requirements

Reproduction steps MUST be:

1. **Specific**: Include exact commands, file paths, and actions
2. **Sequential**: Numbered steps in order of execution
3. **Complete**: Include all prerequisites and setup
4. **Verifiable**: Someone else can follow and see the same issue
5. **Minimal**: Fewest steps necessary to reproduce

**Good Example**:
```markdown
**Steps to Reproduce**:
1. Open `.kiro/specs/cross-platform-build-system/tasks.md`
2. Mark task 1.1 as complete using taskStatus tool
3. Check `.kiro/logs/release-manager.log` for execution
4. Observe: No log entry created, hook did not execute
```

**Bad Example**:
```markdown
**Steps to Reproduce**:
1. Complete a task
2. Check if release detection ran
3. It didn't work
```

---

### Evidence Requirements

Evidence MUST be:

1. **Actual**: Real code, errors, or output (not hypothetical)
2. **Relevant**: Directly demonstrates the issue
3. **Sufficient**: Enough to understand the problem
4. **Formatted**: Use code blocks with language specification
5. **Contextualized**: Include file paths and line numbers

**Good Example**:
```markdown
**Evidence**:
```bash
# .kiro/hooks/release-manager.sh (lines 45-52)
if [ "$TRIGGER_TYPE" = "taskStatus" ]; then
    echo "Task completion detected" >> "$LOG_FILE"
    # This code never executes - taskStatus events not received
    create_trigger_file "$SPEC_NAME" "task-completion"
fi
```

**Bad Example**:
```markdown
**Evidence**:
The hook doesn't work properly.
```

---

### Well-Formatted Issue Examples

#### Example 1: Critical Infrastructure Issue

```markdown
## Issue #001: Release Detection Hook Not Triggering on Task Completion

**Discovered By**: Infrastructure Discovery Audit
**Date Discovered**: 2025-10-28
**Severity**: Critical
**Category**: Release Management
**Affects**: Release management system, task completion workflow, automated release analysis

**Location**:
- **File(s)**: `.kiro/hooks/release-manager.sh` (lines 45-52), `.kiro/agent-hooks/release-detection-on-task-completion.json`
- **System**: Release Management System
- **Context**: Task completion event handling in agent hooks

**Description**:
The release detection hook is configured to trigger automatically when tasks are marked complete via the taskStatus tool, but the hook is not executing. This prevents automatic release analysis from running after spec completion, requiring manual intervention to trigger release detection.

The issue appears to be that taskStatus events are not being received by the agent hook system, or the hook configuration is not properly registered. This breaks the automated release detection workflow that was designed to run after task completions.

**Steps to Reproduce**:
1. Open `.kiro/specs/phase-1-discovery-audit/tasks.md`
2. Mark task 1.1 as complete using taskStatus tool: `taskStatus("1.1 Create centralized issues registry", "completed")`
3. Check `.kiro/logs/release-manager.log` for execution log entry
4. Observe: No log entry created, indicating hook did not execute
5. Check `.kiro/release-triggers/` directory for trigger files
6. Observe: No trigger files created

**Expected Behavior**:
When a task is marked complete using the taskStatus tool, the release detection hook should automatically execute, check for release triggers, and create trigger files if spec completion is detected.

**Actual Behavior**:
The release detection hook does not execute when tasks are marked complete. No log entries are created in `.kiro/logs/release-manager.log` and no trigger files are created in `.kiro/release-triggers/`.

**Evidence**:
```bash
# .kiro/logs/release-manager.log - No entries after task completion
# Expected to see:
# [2025-10-28 10:30:00] Task completion detected: 1.1 Create centralized issues registry
# [2025-10-28 10:30:01] Checking for release triggers...

# Actual: File is empty or has no recent entries
```

```json
// .kiro/agent-hooks/release-detection-on-task-completion.json
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

**Workaround**:
Manually trigger release detection after task completion:
```bash
./.kiro/hooks/release-manager.sh auto
```

**Cross-Area Impact**:
- Infrastructure: Critical - Breaks automated release detection workflow
- Architecture: None - Does not affect code architecture
- Token System: None - Does not affect token generation
- Documentation: Minor - Release analysis documentation may be incomplete

**Related Issues**:
- `.kiro/issues/release-manager-taskstatus-trigger-issue.md` - Known issue documenting this problem

---
```

#### Example 2: Important Architecture Issue

```markdown
## Issue #002: Platform Generator Interface Inconsistency

**Discovered By**: Architecture Discovery Audit
**Date Discovered**: 2025-10-28
**Severity**: Important
**Category**: Platform Consistency
**Affects**: Cross-platform build system, platform generators (Web, iOS, Android)

**Location**:
- **File(s)**: `src/providers/WebFormatGenerator.ts`, `src/providers/iOSFormatGenerator.ts`, `src/providers/AndroidFormatGenerator.ts`
- **System**: Platform Generation System
- **Context**: Platform-specific format generator implementations

**Description**:
The three platform generators (Web, iOS, Android) implement similar functionality but use inconsistent method names and signatures. WebFormatGenerator uses `generateCSS()`, iOSFormatGenerator uses `generateSwift()`, and AndroidFormatGenerator uses `generateKotlin()`, but they all serve the same purpose of generating platform-specific token files.

This inconsistency makes it difficult to work with generators polymorphically and violates the principle of consistent interfaces across platform implementations.

**Steps to Reproduce**:
1. Open `src/providers/WebFormatGenerator.ts` and note the `generateCSS()` method
2. Open `src/providers/iOSFormatGenerator.ts` and note the `generateSwift()` method
3. Open `src/providers/AndroidFormatGenerator.ts` and note the `generateKotlin()` method
4. Observe: Different method names for the same conceptual operation

**Expected Behavior**:
All platform generators should implement a common interface with consistent method names, such as `generate()` or `generateTokenFile()`, allowing them to be used polymorphically.

**Actual Behavior**:
Each platform generator uses a platform-specific method name, requiring conditional logic or type checking to work with different generators.

**Evidence**:
```typescript
// src/providers/WebFormatGenerator.ts
export class WebFormatGenerator {
  generateCSS(tokens: Token[]): string {
    // Web-specific generation
  }
}

// src/providers/iOSFormatGenerator.ts
export class iOSFormatGenerator {
  generateSwift(tokens: Token[]): string {
    // iOS-specific generation
  }
}

// src/providers/AndroidFormatGenerator.ts
export class AndroidFormatGenerator {
  generateKotlin(tokens: Token[]): string {
    // Android-specific generation
  }
}
```

**Workaround**:
Use conditional logic based on platform type:
```typescript
if (platform === 'web') {
  output = webGenerator.generateCSS(tokens);
} else if (platform === 'ios') {
  output = iosGenerator.generateSwift(tokens);
} else if (platform === 'android') {
  output = androidGenerator.generateKotlin(tokens);
}
```

**Cross-Area Impact**:
- Infrastructure: Minor - Build orchestration requires platform-specific logic
- Architecture: Important - Violates interface consistency principle
- Token System: None - Does not affect token definitions
- Documentation: Minor - Documentation must explain platform-specific methods

**Related Issues**:
None - New issue discovered during architecture audit

---
```

#### Example 3: Minor Documentation Issue

```markdown
## Issue #003: Outdated Token Examples in Typography Guide

**Discovered By**: Documentation Discovery Audit
**Date Discovered**: 2025-10-28
**Severity**: Minor
**Category**: Documentation Accuracy
**Affects**: Typography token documentation

**Location**:
- **File(s)**: `docs/tokens/typography-tokens.md` (lines 45-67)
- **System**: Documentation
- **Context**: Typography token usage examples

**Description**:
The typography token guide includes code examples that reference old token names (`typography.bodyText` and `typography.headingText`) that were renamed to `typography.body` and `typography.heading` in the typography token expansion spec. The examples still work conceptually but use outdated naming.

**Steps to Reproduce**:
1. Open `docs/tokens/typography-tokens.md`
2. Scroll to "Usage Examples" section (around line 45)
3. Observe: Examples use `typography.bodyText` and `typography.headingText`
4. Open `src/tokens/semantic/TypographyTokens.ts`
5. Observe: Actual tokens are named `typography.body` and `typography.heading`

**Expected Behavior**:
Documentation examples should use current token names that match the actual implementation.

**Actual Behavior**:
Documentation examples use old token names from before the typography token expansion.

**Evidence**:
```markdown
<!-- docs/tokens/typography-tokens.md (lines 45-50) -->
## Usage Examples

```typescript
// Apply body text styling
const bodyStyle = tokens.typography.bodyText;

// Apply heading styling
const headingStyle = tokens.typography.headingText;
```
```

```typescript
// src/tokens/semantic/TypographyTokens.ts (actual implementation)
export const TypographyTokens = {
  body: { fontSize: 16, lineHeight: 24, ... },
  heading: { fontSize: 24, lineHeight: 32, ... }
};
```

**Workaround**:
Developers can infer the correct token names from the implementation file or other documentation.

**Cross-Area Impact**:
- Infrastructure: None
- Architecture: None
- Token System: None
- Documentation: Minor - May cause brief confusion for developers

**Related Issues**:
None - Isolated documentation issue

---
```

---

## Issue Counter

**Next Issue ID**: #038

---

## Issues by Severity

### Critical Issues
_Issues that block development, cause system failures, or violate core architectural principles_

- **Issue #001**: Release Detection Hook Not Triggering on taskStatus Events (Infrastructure)
- **Issue #010**: Z-Index Token Handling Inconsistency Across Platforms (Architecture)
- **Issue #021**: Web CSS Color Tokens Output as JSON Objects Instead of Hex Values (Token System)
- **Issue #022**: iOS Color Tokens Use Placeholder Implementation Instead of Actual Colors (Token System)

## Issue #001: Release Detection Hook Not Triggering on taskStatus Events

**Discovered By**: Infrastructure Discovery Audit
**Date Discovered**: 2025-10-28
**Severity**: Critical
**Category**: Release Management
**Affects**: Release management system, task completion workflow, automated release analysis, version management

**Location**:
- **File(s)**: `.kiro/agent-hooks/release-detection-on-task-completion.json`, `.kiro/hooks/release-manager.sh`
- **System**: Release Management System - Agent Hook Integration
- **Context**: Task completion event handling in Kiro IDE agent hooks

**Description**:
The release detection agent hook is configured to trigger automatically when tasks are marked complete via the taskStatus tool, but the hook is not executing. This prevents automatic release analysis from running after spec completion, requiring manual intervention to trigger release detection.

The agent hook configuration specifies `"type": "taskStatusChange"` with `"status": "completed"` as the trigger, and is set to run after the file organization hook. However, when tasks are marked complete using the taskStatus tool, no log entries appear in `.kiro/logs/release-manager.log` and no release trigger files are created in `.kiro/release-triggers/`.

This breaks the entire automated release detection workflow. The system was designed to automatically detect spec completions, analyze completion documents, calculate version bumps, and generate release notes. Without the hook triggering, all of this automation is non-functional.

The issue was discovered when completing the Layering Token System spec (Task 7) with 20 completion documents. Despite using the taskStatus tool as recommended, the release analyzer found "0 completion documents" and reported no version bump.

**Steps to Reproduce**:
1. Open `.kiro/specs/layering-token-system/tasks.md`
2. Mark task 7 as complete using taskStatus tool
3. Verify 20 completion documents exist: `find .kiro/specs/layering-token-system/completion -name "*completion.md" | wc -l`
4. Check release manager log: `tail -20 .kiro/logs/release-manager.log`
5. Observe: No log entry for layering-token-system completion (last entry is from afternoon-to-dusk-rename on Oct 28 18:03:55)
6. Check for release trigger files: `ls -la .kiro/release-triggers/ | grep layering`
7. Observe: No trigger files created for layering-token-system
8. Run release analysis: `npm run release:analyze`
9. Observe: "Found 0 completion documents" despite 20 documents existing

**Expected Behavior**:
When a task is marked complete using the taskStatus tool:
1. Kiro IDE emits a `taskStatusChange` event with status "completed"
2. Release detection agent hook receives the event
3. Hook executes `.kiro/hooks/release-manager.sh auto`
4. Release manager scans for completion documents in the spec directory
5. Release manager creates trigger files in `.kiro/release-triggers/`
6. Release manager logs activity to `.kiro/logs/release-manager.log`
7. Release analyzer processes trigger files and analyzes completion documents
8. Version bump is calculated and release notes are generated

**Actual Behavior**:
When a task is marked complete using the taskStatus tool:
1. Task status updates in tasks.md (this works)
2. File organization hook may execute (separate issue)
3. Release detection hook does NOT execute
4. No log entries created in release manager log
5. No trigger files created
6. Release analyzer finds 0 completion documents
7. No version bump calculated
8. No release notes generated

**Evidence**:
```bash
# Completion documents exist
$ find .kiro/specs/layering-token-system/completion -name "*completion.md" | wc -l
20

# But release manager log shows no detection
$ tail -20 .kiro/logs/release-manager.log | grep layering
# (no results - last entry is afternoon-to-dusk-rename from Oct 28 18:03:55)

# No trigger files created
$ ls -la .kiro/release-triggers/ | grep layering
# (no results)

# Release analyzer finds nothing
$ npm run release:analyze
🔍 Starting enhanced release analysis...
📄 Found 0 completion documents
🔍 Extracting changes...
🏷️  Calculating version recommendation...
📝 Generating release notes...
✅ Enhanced analysis complete!

📊 Release Analysis Summary
==============================
🏷️  Version: 1.0.0 → 1.0.0
📈 Bump type: none
🎯 Confidence: 10.0%
📝 Changes: 0 total
```

```json
// .kiro/agent-hooks/release-detection-on-task-completion.json
// Hook configuration looks correct
{
  "name": "Release Detection on Task Completion",
  "trigger": {
    "type": "taskStatusChange",
    "status": "completed"
  },
  "action": {
    "type": "runScript",
    "script": ".kiro/hooks/release-manager.sh",
    "args": ["auto"]
  },
  "settings": {
    "requireConfirmation": false,
    "timeout": 300,
    "autoApprove": true,
    "runAfter": ["organize-after-task-completion"]
  }
}
```

```json
// .kiro/release-config.json
// Release detection is enabled
{
  "detection": {
    "specCompletionTrigger": true,
    "taskCompletionTrigger": true,
    "monitorPaths": [
      ".kiro/specs/*/completion/",
      ".kiro/specs/*/tasks.md"
    ]
  }
}
```

**Workaround**:
Manually trigger release detection after task completion:
```bash
./.kiro/hooks/release-manager.sh auto
```

This workaround defeats the purpose of automation and requires developers to remember to run the command after every task completion.

**Cross-Area Impact**:
- Infrastructure: Critical - Breaks automated release detection workflow, requires manual intervention
- Architecture: None - Does not affect code architecture or patterns
- Token System: None - Does not affect token generation or validation
- Documentation: Important - Release analysis documentation may be incomplete without automated detection

**Related Issues**:
- `.kiro/issues/release-manager-taskstatus-trigger-issue.md` - Known issue documenting this problem in detail with additional context and investigation notes

---

---

### Important Issues
_Issues that reduce efficiency, create technical debt, or violate established patterns_

- **Issue #002**: commit-task.sh Treats --help as Task Name (Infrastructure)
- **Issue #003**: Agent Hook Triggering Cannot Be Verified (Infrastructure)
- **Issue #005**: File Organization Metadata Validation Inconsistent (Infrastructure)
- **Issue #006**: Cross-Reference Update Logic Has Path Calculation Issues (Infrastructure)
- **Issue #008**: Format Generator Constructor Inconsistency Across Platforms (Architecture)
- **Issue #009**: Platform-Specific Method Naming Inconsistency (Architecture)
- **Issue #012**: TokenFileGenerator Performs Validation Logic (Architecture)
- **Issue #013**: PrimitiveTokenRegistry Performs Validation (Architecture)
- **Issue #014**: SemanticTokenRegistry Performs Validation (Architecture)

## Issue #002: commit-task.sh Treats --help as Task Name

**Discovered By**: Infrastructure Discovery Audit
**Date Discovered**: 2025-10-28
**Severity**: Important
**Category**: Build Automation - Commit Hooks
**Affects**: Task completion workflow, developer experience, git commit history

**Location**:
- **File(s)**: `.kiro/hooks/commit-task.sh` (lines 1-75)
- **System**: Build Automation System - Task Completion Hooks
- **Context**: Command-line argument parsing in commit-task.sh wrapper script

**Description**:
The commit-task.sh script does not properly handle the --help flag. Instead of displaying help information, it treats "--help" as a task name and attempts to commit changes with the message "Task Complete: --help". This creates confusion for developers trying to learn how to use the script and can result in accidental commits with meaningless commit messages.

The script uses a simple argument parsing approach that doesn't check for help flags before processing the task name. The --help flag is passed directly to the underlying task-completion-commit.sh script, which also doesn't handle it, resulting in the flag being treated as a literal task name.

This violates the principle of least surprise - developers expect --help to show usage information, not trigger a commit operation.

**Steps to Reproduce**:
1. Run `./.kiro/hooks/commit-task.sh --help`
2. Observe: Script attempts to commit with message "Task Complete: --help"
3. Observe: No help information is displayed
4. Check git log: `git log -1 --oneline`
5. Observe: Commit created with message "Task Complete: --help"

**Expected Behavior**:
When --help flag is provided, the script should:
1. Display usage information showing correct syntax
2. Show examples of proper usage
3. Exit without performing any git operations
4. Return exit code 0

**Actual Behavior**:
When --help flag is provided, the script:
1. Treats "--help" as a task name
2. Attempts to find task in tasks.md
3. Commits all changes with message "Task Complete: --help"
4. Pushes to GitHub
5. Runs release analysis

**Evidence**:
```bash
$ ./.kiro/hooks/commit-task.sh --help
🚀 Committing completion of: --help
🔍 Checking for changes to commit...
📝 Changes detected, preparing commit...
💾 Committing with message: Task Complete: --help
[main 2decec3] Task Complete: --help
 15 files changed, 3467 insertions(+), 1 deletion(-)
 # ... commit details ...
🚀 Pushing to GitHub...
# ... push output ...
✅ Task completion committed and pushed successfully!
```

```bash
# commit-task.sh (lines 1-20) - No help flag handling
#!/bin/bash
set -e

TASK_NAME="$1"
TASKS_FILE=".kiro/specs/fresh-repository-roadmap-refinement/tasks.md"
NO_ANALYZE=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --no-analyze)
            NO_ANALYZE=true
            shift
            ;;
        *)
            if [ -z "$TASK_NAME" ]; then
                TASK_NAME="$1"  # --help gets assigned here
            fi
            shift
            ;;
    esac
done
```

**Workaround**:
Read the script source code or README.md to understand usage:
```bash
cat ./.kiro/hooks/README.md
# or
cat ./.kiro/hooks/commit-task.sh
```

**Cross-Area Impact**:
- Infrastructure: Important - Reduces usability of build automation tools
- Architecture: None - Does not affect code architecture
- Token System: None - Does not affect token generation
- Documentation: Minor - README.md provides usage information as workaround

**Related Issues**:
None - New issue discovered during build automation review

---

## Issue #003: Agent Hook Triggering Cannot Be Verified

**Discovered By**: Infrastructure Discovery Audit
**Date Discovered**: 2025-10-28
**Severity**: Important
**Category**: Build Automation - Agent Hooks
**Affects**: File organization automation, agent hook system, testing and validation

**Location**:
- **File(s)**: `.kiro/agent-hooks/organize-after-task.sh`, `.kiro/agent-hooks/organize-after-task-completion.json`
- **System**: Build Automation System - Agent Hooks
- **Context**: Kiro IDE event system integration for taskStatusChange events

**Description**:
The file organization agent hook is properly configured and the script executes correctly when run manually, but there is no way to verify whether the hook is actually being triggered by Kiro IDE taskStatusChange events. The hook depends on Kiro IDE's event system to emit events when tasks are marked complete, but this event system is not accessible for testing or verification.

This creates a testing gap where the hook configuration and script logic can be validated, but the critical integration point (event triggering) cannot be verified. This is directly related to Issue #001 (release detection hook not triggering), suggesting a systemic issue with agent hook event handling.

Without the ability to verify hook triggering, we cannot determine if:
- Kiro IDE is emitting taskStatusChange events
- Agent hooks are receiving these events
- Hook configuration is being properly registered
- Event filtering (status: "completed") is working correctly

**Steps to Reproduce**:
1. Configure agent hook: `.kiro/agent-hooks/organize-after-task-completion.json` exists
2. Mark a task complete using taskStatus tool
3. Attempt to verify hook execution
4. Observe: No way to check if hook was triggered
5. Check for log files or execution traces
6. Observe: No logging mechanism for agent hook triggering
7. Run hook manually: `./.kiro/agent-hooks/organize-after-task.sh`
8. Observe: Script works correctly when run manually

**Expected Behavior**:
When a task is marked complete using taskStatus tool:
1. Kiro IDE emits taskStatusChange event with status "completed"
2. Agent hook system receives event
3. Hook configuration is matched against event
4. organize-after-task.sh script is executed
5. Execution is logged for verification
6. Developer can verify hook triggered successfully

**Actual Behavior**:
When a task is marked complete using taskStatus tool:
1. Task status updates in tasks.md (this works)
2. Unknown if Kiro IDE emits taskStatusChange event
3. Unknown if agent hook system receives event
4. Unknown if hook configuration is matched
5. Unknown if script is executed
6. No logging or verification mechanism available

**Evidence**:
```json
// .kiro/agent-hooks/organize-after-task-completion.json
// Hook configuration appears correct
{
  "name": "Auto-Organize Files After Task Completion",
  "trigger": {
    "type": "taskStatusChange",
    "status": "completed"
  },
  "action": {
    "type": "runScript",
    "script": ".kiro/agent-hooks/organize-after-task.sh"
  },
  "settings": {
    "requireConfirmation": true,
    "timeout": 600,
    "autoApprove": false
  }
}
```

```bash
# Manual execution works correctly
$ ./.kiro/agent-hooks/organize-after-task.sh --help
Kiro Agent Hook: Organize Files After Task Completion

DESCRIPTION:
    Automatically checks for and organizes files based on **Organization** 
    metadata when tasks are completed.
# ... help output continues ...
```

```bash
# No agent hook execution logs found
$ find .kiro/logs -name "*agent*" -o -name "*hook*"
.kiro/logs/release-manager.log  # Only release manager logs exist
```

**Workaround**:
Run file organization manually after task completion:
```bash
./.kiro/agent-hooks/organize-after-task.sh
```

This defeats the purpose of automation and requires developers to remember to run the script.

**Cross-Area Impact**:
- Infrastructure: Important - Cannot verify automated file organization works
- Architecture: None - Does not affect code architecture
- Token System: None - Does not affect token generation
- Documentation: Important - Cannot verify documentation organization automation

**Related Issues**:
- **Issue #001**: Release Detection Hook Not Triggering on taskStatus Events
  - Same root cause: taskStatusChange events not being received by agent hooks
  - Both hooks configured correctly but not executing
  - Suggests systemic issue with Kiro IDE event system integration

---

---

### Minor Issues
_Cosmetic issues, documentation inconsistencies, or isolated improvements_

- **Issue #004**: Release Manager Hook Dependency Chain Unclear (Infrastructure)
- **Issue #007**: File Organization Hook Only Scans Root Directory (Infrastructure)
- **Issue #011**: Opacity/Alpha Terminology Inconsistency (Architecture)
- **Issue #018**: Missing Index File in Registries Module (Architecture)
- **Issue #019**: Test Directory Organization Inconsistency (Architecture)
- **Issue #020**: Validator File Naming Suffix Inconsistency (Architecture)

## Issue #004: Release Manager Hook Dependency Chain Unclear

**Discovered By**: Infrastructure Discovery Audit
**Date Discovered**: 2025-10-28
**Severity**: Minor
**Category**: Build Automation - Release Management
**Affects**: Release detection workflow, hook dependency understanding, developer experience

**Location**:
- **File(s)**: `.kiro/agent-hooks/release-detection-on-task-completion.json`, `.kiro/agent-hooks/README.md`
- **System**: Build Automation System - Release Management
- **Context**: Agent hook dependency chain configuration and documentation

**Description**:
The release detection agent hook is configured to run after the file organization hook using the "runAfter" setting, but the documentation doesn't clearly explain what happens if the organization hook fails or is skipped. This creates ambiguity about the dependency chain behavior and could lead to confusion about why release detection doesn't run in certain scenarios.

The configuration specifies `"runAfter": ["organize-after-task-completion"]`, which suggests a dependency relationship, but it's unclear whether:
- Release detection waits for organization to complete successfully
- Release detection runs even if organization fails
- Release detection is skipped if organization is skipped by user
- Release detection has a timeout if organization takes too long

This is a documentation and clarity issue rather than a functional problem, but it could cause confusion during troubleshooting or when trying to understand why release detection didn't run.

**Steps to Reproduce**:
1. Read `.kiro/agent-hooks/release-detection-on-task-completion.json`
2. Note the "runAfter" setting: `["organize-after-task-completion"]`
3. Read `.kiro/agent-hooks/README.md` for explanation
4. Observe: No clear explanation of dependency chain behavior
5. Search for "runAfter" documentation
6. Observe: No documentation explaining what "runAfter" means

**Expected Behavior**:
Documentation should clearly explain:
1. What "runAfter" means in hook configuration
2. Whether dependent hook must complete successfully
3. What happens if dependent hook fails
4. What happens if dependent hook is skipped
5. Timeout behavior for dependent hooks

**Actual Behavior**:
Documentation provides:
1. Hook configuration examples
2. General workflow descriptions
3. No specific explanation of "runAfter" behavior
4. No troubleshooting guidance for dependency issues

**Evidence**:
```json
// .kiro/agent-hooks/release-detection-on-task-completion.json
{
  "name": "Release Detection on Task Completion",
  "settings": {
    "requireConfirmation": false,
    "autoApprove": true,
    "runAfter": ["organize-after-task-completion"]  // What does this mean?
  },
  "integration": {
    "dependsOn": ["organize-after-task-completion"],
    "description": "Runs after file organization to detect release triggers from organized completion documents"
  }
}
```

```markdown
<!-- .kiro/agent-hooks/README.md - No explanation of runAfter -->
## Available Agent Hooks

#### 1. Task Completion File Organization
**File**: `organize-after-task.sh`  
**Trigger**: Task status changes to "completed"  
**Purpose**: Automatically organize files based on **Organization** metadata

<!-- No section explaining hook dependencies or runAfter behavior -->
```

**Workaround**:
Infer behavior from configuration and test empirically:
- Assume "runAfter" means sequential execution
- Test different scenarios to understand behavior
- Read Kiro IDE documentation if available

**Cross-Area Impact**:
- Infrastructure: Minor - Doesn't affect functionality, only understanding
- Architecture: None - Does not affect code architecture
- Token System: None - Does not affect token generation
- Documentation: Minor - Documentation gap in agent hook system

**Related Issues**:
- **Issue #001**: Release Detection Hook Not Triggering on taskStatus Events
  - Understanding dependency chain is important for troubleshooting Issue #001
  - If organization hook doesn't run, release detection won't run either
- **Issue #003**: Agent Hook Triggering Cannot Be Verified
  - Cannot verify dependency chain behavior without hook triggering

---

## Issue #005: File Organization Metadata Validation Inconsistent

**Discovered By**: Infrastructure Discovery Audit
**Date Discovered**: 2025-10-28
**Severity**: Important
**Category**: File Organization - Metadata Validation
**Affects**: File organization system, metadata-driven organization, documentation quality

**Location**:
- **File(s)**: `.kiro/hooks/organize-by-metadata.sh` (lines 50-75), root directory markdown files
- **System**: File Organization System - Metadata Validation
- **Context**: Validation of **Organization** metadata values in markdown files

**Description**:
The file organization system validates **Organization** metadata against a list of approved values (framework-strategic, spec-validation, spec-completion, process-standard, working-document), but several files in the root directory use invalid organization values that don't match this list. Specifically, "process-documentation" is used in BUILD-SYSTEM-SETUP.md, which is not a valid organization value according to the validation logic.

This inconsistency means that files with invalid metadata values will fail validation and cannot be organized automatically. The validation function in organize-by-metadata.sh will reject these files, but they remain in the root directory without clear guidance on how to fix them.

The issue suggests either:
1. The validation list is incomplete and should include "process-documentation"
2. Files are using incorrect metadata values and should be updated
3. The validation is too strict and should be more flexible

**Steps to Reproduce**:
1. Check BUILD-SYSTEM-SETUP.md metadata: `grep "**Organization**:" BUILD-SYSTEM-SETUP.md`
2. Observe: Uses "process-documentation" as organization value
3. Run validation: `./.kiro/hooks/organize-by-metadata.sh --validate-only`
4. Observe: Validation fails for BUILD-SYSTEM-SETUP.md
5. Check valid values in organize-by-metadata.sh: `grep -A 5 "case.*organization" .kiro/hooks/organize-by-metadata.sh`
6. Observe: "process-documentation" is not in the valid values list

**Expected Behavior**:
All markdown files should use organization metadata values that match the validation list, OR the validation list should include all values actually used in the codebase.

**Actual Behavior**:
Files use organization values ("process-documentation") that are not in the validation list, causing validation failures and preventing automatic organization.

**Evidence**:
```markdown
<!-- BUILD-SYSTEM-SETUP.md (lines 162-165) -->
---

**Organization**: process-documentation  
**Scope**: cross-project
```

```bash
# organize-by-metadata.sh (lines 60-72) - Valid values
case "$organization" in
    "framework-strategic"|"spec-validation"|"spec-completion"|"process-standard"|"working-document")
        return 0
        ;;
    *)
        print_error "Invalid organization value '$organization' in $file"
        print_error "Valid values: framework-strategic, spec-validation, spec-completion, process-standard, working-document"
        return 1
        ;;
esac
```

```bash
# Validation output
$ ./.kiro/hooks/organize-by-metadata.sh --validate-only
❌ Invalid organization value 'process-documentation' in ./BUILD-SYSTEM-SETUP.md
❌ Valid values: framework-strategic, spec-validation, spec-completion, process-standard, working-document
📁 Found 1 validation errors
```

**Workaround**:
Manually update files to use valid organization values:
- Change "process-documentation" to "process-standard" in BUILD-SYSTEM-SETUP.md
- Or add "process-documentation" to the validation list if it's a legitimate value

**Cross-Area Impact**:
- Infrastructure: Important - Prevents automatic file organization for affected files
- Architecture: None - Does not affect code architecture
- Token System: None - Does not affect token generation
- Documentation: Important - Documentation files cannot be organized automatically

**Related Issues**:
None - New issue discovered during file organization review

---

## Issue #006: Cross-Reference Update Logic Has Path Calculation Issues

**Discovered By**: Infrastructure Discovery Audit
**Date Discovered**: 2025-10-28
**Severity**: Important
**Category**: File Organization - Cross-Reference Integrity
**Affects**: File organization system, cross-reference maintenance, documentation navigation

**Location**:
- **File(s)**: `.kiro/hooks/organize-by-metadata.sh` (lines 150-180)
- **System**: File Organization System - Cross-Reference Updates
- **Context**: Automatic cross-reference link updates after file moves

**Description**:
The file organization hook includes logic to update cross-references after moving files, but the path calculation logic has several issues that could cause broken links:

1. **Python dependency**: Uses Python to calculate relative paths, but doesn't check if Python is available
2. **Fallback path**: Falls back to `$new_relative_path` if Python fails, which may not be correct
3. **Simple pattern matching**: Uses sed with simple pattern `[$old_name](...$old_name)` which could match unintended links
4. **No validation**: Doesn't validate that updated links are correct after replacement
5. **Backup file cleanup**: Creates .bak files but doesn't verify they're safe to delete

The cross-reference update logic is critical for maintaining documentation integrity after file organization, but these issues could result in broken links or incorrect path updates.

**Steps to Reproduce**:
1. Create a test file with cross-reference: `echo "[Test](./test.md)" > test-ref.md`
2. Create test.md with organization metadata
3. Run organization: `./.kiro/hooks/organize-by-metadata.sh`
4. Check if Python is available: `which python3`
5. If Python not available, observe fallback behavior
6. Check updated reference in test-ref.md
7. Verify if relative path is correct

**Expected Behavior**:
When files are moved during organization:
1. All cross-references to moved files are identified
2. Relative paths are calculated correctly from each referencing file
3. Links are updated with correct relative paths
4. Updated links are validated to ensure they resolve correctly
5. Process handles missing dependencies gracefully

**Actual Behavior**:
When files are moved during organization:
1. Cross-references are identified (works)
2. Relative paths calculated using Python (may fail if Python unavailable)
3. Falls back to potentially incorrect path if Python fails
4. Links updated without validation
5. No verification that updated links work

**Evidence**:
```bash
# organize-by-metadata.sh (lines 150-180) - Cross-reference update logic
update_cross_references() {
    # ...
    while IFS='|' read -r old_path new_path; do
        # ...
        find . -name "*.md" -type f -exec grep -l "\[$old_name\]" {} \; | while read -r ref_file; do
            if [[ "$ref_file" != "./$new_path" ]]; then
                # Calculate relative path from ref_file to new location
                local ref_dir=$(dirname "$ref_file")
                local relative_path=$(python3 -c "
import os
print(os.path.relpath('$new_path', '$ref_dir'))
" 2>/dev/null || echo "$new_relative_path")  # Fallback may be incorrect
                
                # Update the reference
                sed -i.bak "s|\[$old_name\](\([^)]*\)$old_name)|\[$old_name\]($relative_path)|g" "$ref_file"
                rm -f "${ref_file}.bak"  # Deletes backup without verification
                print_status "Updated reference in: $ref_file"
            fi
        done
    done < /tmp/organized_files.txt
}
```

**Workaround**:
Manually verify and fix cross-references after file organization:
1. Run organization
2. Check all markdown files for broken links
3. Manually update any incorrect relative paths
4. Test navigation to verify links work

**Cross-Area Impact**:
- Infrastructure: Important - Affects reliability of automated file organization
- Architecture: None - Does not affect code architecture
- Token System: None - Does not affect token generation
- Documentation: Important - Could result in broken documentation links

**Related Issues**:
None - New issue discovered during file organization review

---

## Issue #007: File Organization Hook Only Scans Root Directory

**Discovered By**: Infrastructure Discovery Audit
**Date Discovered**: 2025-10-28
**Severity**: Minor
**Category**: File Organization - Scope Limitation
**Affects**: File organization system, documentation organization completeness

**Location**:
- **File(s)**: `.kiro/hooks/organize-by-metadata.sh` (lines 200-220)
- **System**: File Organization System - File Discovery
- **Context**: Scanning for files that need organization

**Description**:
The file organization hook only scans the root directory for markdown files that need organization, using `find . -maxdepth 1 -name "*.md"`. This means that markdown files in subdirectories with organization metadata will not be discovered or organized automatically.

While this may be intentional (to avoid organizing files that are already in appropriate subdirectories), it's not documented and could lead to confusion. Files that are created in subdirectories during development but have organization metadata indicating they should be elsewhere will not be moved.

This is a minor issue because:
1. Most files needing organization are created in the root directory
2. Files in subdirectories are likely already organized
3. The limitation prevents accidentally moving files that are already in correct locations

However, it does mean the organization system is not comprehensive and may miss files that need to be moved.

**Steps to Reproduce**:
1. Create a test file in a subdirectory: `mkdir -p test-dir && echo "**Organization**: framework-strategic" > test-dir/test.md`
2. Add proper metadata to test-dir/test.md
3. Run organization: `./.kiro/hooks/organize-by-metadata.sh --dry-run`
4. Observe: test-dir/test.md is not discovered
5. Check find command in script: `grep "find.*maxdepth" .kiro/hooks/organize-by-metadata.sh`
6. Observe: Uses `-maxdepth 1` which limits to root directory only

**Expected Behavior**:
Either:
1. Scan all directories recursively and organize any files with metadata indicating they're in wrong location
2. Document that only root directory is scanned and explain why
3. Provide option to scan recursively when needed

**Actual Behavior**:
Only root directory is scanned, with no documentation explaining this limitation or providing alternatives for organizing files in subdirectories.

**Evidence**:
```bash
# organize-by-metadata.sh (lines 200-220) - Only scans root directory
organize_files() {
    # ...
    while IFS= read -r -d '' file; do
        if [[ -f "$file" && "$file" == *.md ]]; then
            # Process file...
        fi
    done < <(find . -maxdepth 1 -name "*.md" -print0)  # maxdepth 1 = root only
    # ...
}
```

```bash
# Test showing subdirectory files are not discovered
$ mkdir -p test-dir
$ cat > test-dir/test.md << 'EOF'
# Test Document
**Organization**: framework-strategic
**Scope**: cross-spec
EOF

$ ./.kiro/hooks/organize-by-metadata.sh --dry-run
📁 Dry run - showing what would be organized...
✅ No files need organization
# test-dir/test.md was not discovered
```

**Workaround**:
Manually move files from subdirectories to root directory before running organization, or manually organize files in subdirectories.

**Cross-Area Impact**:
- Infrastructure: Minor - Limits scope of automated organization
- Architecture: None - Does not affect code architecture
- Token System: None - Does not affect token generation
- Documentation: Minor - Some documentation files may not be organized automatically

**Related Issues**:
None - New issue discovered during file organization review

---

---

## Issues by Discovery Area

### Infrastructure Discovery
_Issues discovered during infrastructure audit_

- **Issue #001**: Release Detection Hook Not Triggering on taskStatus Events (Critical)
- **Issue #002**: commit-task.sh Treats --help as Task Name (Important)
- **Issue #003**: Agent Hook Triggering Cannot Be Verified (Important)
- **Issue #004**: Release Manager Hook Dependency Chain Unclear (Minor)
- **Issue #005**: File Organization Metadata Validation Inconsistent (Important)
- **Issue #006**: Cross-Reference Update Logic Has Path Calculation Issues (Important)
- **Issue #007**: File Organization Hook Only Scans Root Directory (Minor)

---

### Architecture Discovery
_Issues discovered during architecture audit_

- **Issue #008**: Format Generator Constructor Inconsistency Across Platforms (Important)
- **Issue #009**: Platform-Specific Method Naming Inconsistency (Important)
- **Issue #010**: Z-Index Token Handling Inconsistency Across Platforms (Critical)
- **Issue #011**: Opacity/Alpha Terminology Inconsistency (Minor)
- **Issue #012**: TokenFileGenerator Performs Validation Logic (Important)
- **Issue #013**: PrimitiveTokenRegistry Performs Validation (Important)
- **Issue #014**: SemanticTokenRegistry Performs Validation (Important)
- **Issue #015**: ThreeTierValidator Orchestrates Multiple Validators - NOT AN ISSUE (Correct Architecture)
- **Issue #016**: Validator System Lacks Common Interface (Important)
- **Issue #017**: Registry System Lacks Common Interface (Important)
- **Issue #018**: Missing Index File in Registries Module (Minor)
- **Issue #019**: Test Directory Organization Inconsistency (Minor)
- **Issue #020**: Validator File Naming Suffix Inconsistency (Minor)

---

### Token System Discovery
_Issues discovered during token system audit_

- **Issue #021**: Web CSS Color Tokens Output as JSON Objects Instead of Hex Values (Critical)
- **Issue #022**: iOS Color Tokens Use Placeholder Implementation Instead of Actual Colors (Critical)

---

### Documentation Discovery
_Issues discovered during documentation audit_

- **Issue #035**: Cross-Reference Integrity Issues Across Phase 1 Documentation (Important)
- **Issue #036**: Two Phase 1 Specs Missing Design Decisions Sections (Important)
- **Issue #037**: Cross-Platform Build System Design-Implementation Architectural Drift (Important)

---

## Cross-Area Issues

_Issues that affect multiple discovery areas_

(No cross-area issues discovered yet)

---

*This registry will be updated as issues are discovered during the Phase 1 Discovery Audit. Each discovery report will reference issues by ID rather than duplicating information.*


## Issue #008: Format Generator Constructor Inconsistency Across Platforms

**Discovered By**: Architecture Discovery Audit
**Date Discovered**: 2025-10-29
**Severity**: Important
**Category**: Platform Consistency - Format Generators
**Affects**: Cross-platform build system, format generator initialization, platform consistency

**Location**:
- **File(s)**: `src/providers/iOSFormatGenerator.ts`, `src/providers/AndroidFormatGenerator.ts`, `src/providers/WebFormatGenerator.ts`
- **System**: Platform Generation System - Format Generators
- **Context**: Constructor implementation and format selection across platform generators

**Description**:
The three platform format generators (iOS, Android, Web) have inconsistent constructor implementations. iOS has no constructor and uses default format selection, while Android and Web both have constructors that accept an `outputFormat` parameter for format selection.

iOS only supports Swift format and has no constructor:
```typescript
export class iOSFormatGenerator extends BaseFormatProvider {
  readonly platform: TargetPlatform = 'ios';
  readonly formats: OutputFormat[] = ['swift'];
  // No constructor
}
```

Android and Web both support multiple formats and have constructors:
```typescript
export class AndroidFormatGenerator extends BaseFormatProvider {
  constructor(outputFormat: OutputFormat = 'kotlin') { ... }
}

export class WebFormatGenerator extends BaseFormatProvider {
  constructor(outputFormat: OutputFormat = 'css') { ... }
}
```

This inconsistency creates different initialization patterns across platforms, making it difficult to work with generators polymorphically and violating the principle of consistent interfaces.

**Steps to Reproduce**:
1. Open `src/providers/iOSFormatGenerator.ts`
2. Observe: No constructor defined
3. Open `src/providers/AndroidFormatGenerator.ts`
4. Observe: Constructor with `outputFormat` parameter
5. Open `src/providers/WebFormatGenerator.ts`
6. Observe: Constructor with `outputFormat` parameter
7. Attempt to instantiate all generators with same pattern
8. Observe: iOS requires different instantiation pattern

**Expected Behavior**:
All platform generators should have consistent constructor signatures, either:
1. All have constructors with format selection parameter (even if iOS only supports one format)
2. All use default constructors with format selection via separate method
3. All implement a common interface that defines initialization pattern

**Actual Behavior**:
iOS has no constructor, Android and Web have constructors with format selection, creating inconsistent initialization patterns across platforms.

**Evidence**:
```typescript
// src/providers/iOSFormatGenerator.ts - No constructor
export class iOSFormatGenerator extends BaseFormatProvider {
  readonly platform: TargetPlatform = 'ios';
  readonly formats: OutputFormat[] = ['swift'];
  // No constructor - uses default initialization
}

// src/providers/AndroidFormatGenerator.ts - Has constructor
export class AndroidFormatGenerator extends BaseFormatProvider {
  readonly platform: TargetPlatform = 'android';
  readonly formats: OutputFormat[] = ['kotlin', 'xml'];
  
  private outputFormat: OutputFormat;

  constructor(outputFormat: OutputFormat = 'kotlin') {
    super();
    this.outputFormat = outputFormat;
  }
}

// src/providers/WebFormatGenerator.ts - Has constructor
export class WebFormatGenerator extends BaseFormatProvider {
  readonly platform: TargetPlatform = 'web';
  readonly formats: OutputFormat[] = ['css', 'javascript'];
  
  private outputFormat: OutputFormat;

  constructor(outputFormat: OutputFormat = 'css') {
    super();
    this.outputFormat = outputFormat;
  }
}
```

**Workaround**:
Use conditional logic based on platform type:
```typescript
let generator;
if (platform === 'ios') {
  generator = new iOSFormatGenerator(); // No format parameter
} else if (platform === 'android') {
  generator = new AndroidFormatGenerator('kotlin'); // With format parameter
} else if (platform === 'web') {
  generator = new WebFormatGenerator('css'); // With format parameter
}
```

**Cross-Area Impact**:
- Infrastructure: Minor - Build orchestration requires platform-specific initialization logic
- Architecture: Important - Violates interface consistency principle
- Token System: None - Does not affect token definitions
- Documentation: Minor - Documentation must explain platform-specific initialization

**Related Issues**:
None - New issue discovered during architecture audit

---

## Issue #009: Platform-Specific Method Naming Inconsistency

**Discovered By**: Architecture Discovery Audit
**Date Discovered**: 2025-10-29
**Severity**: Important
**Category**: Platform Consistency - Method Naming
**Affects**: Cross-platform build system, code readability, developer experience

**Location**:
- **File(s)**: `src/providers/iOSFormatGenerator.ts`, `src/providers/AndroidFormatGenerator.ts`, `src/providers/WebFormatGenerator.ts`
- **System**: Platform Generation System - Format Generators
- **Context**: Method naming conventions for equivalent functionality across platforms

**Description**:
The three platform format generators use different naming conventions for equivalent methods. iOS uses "Swift" prefix, Android uses "Kotlin/XML" prefix, and Web uses "CSS/JS" prefix for methods that serve the same purpose.

Examples of inconsistent naming:
- Type mapping: `getSwiftType()` vs `getKotlinType()` + `getXMLResourceType()` vs (handled inline in Web)
- Value formatting: `formatSwiftValue()` vs `formatKotlinValue()` + `formatXMLValue()` vs `formatCSSValue()` + `formatJSValue()`
- Constant formatting: `formatSwiftConstant()` vs `formatKotlinConstant()` + `formatXMLResource()` vs `formatCSSCustomProperty()` + `formatJavaScriptConstant()`

This inconsistency makes it difficult to understand equivalent functionality across platforms and violates the principle of consistent naming patterns. Developers working across platforms must learn different method names for the same concepts.

**Steps to Reproduce**:
1. Open `src/providers/iOSFormatGenerator.ts`
2. Find type mapping method: `getSwiftType()`
3. Open `src/providers/AndroidFormatGenerator.ts`
4. Find type mapping method: `getKotlinType()`
5. Open `src/providers/WebFormatGenerator.ts`
6. Search for type mapping method: Not found (handled inline)
7. Observe: Different naming patterns for equivalent functionality

**Expected Behavior**:
All platform generators should use consistent method naming patterns, such as:
- `getPlatformType()` instead of `getSwiftType()/getKotlinType()`
- `formatPlatformValue()` instead of `formatSwiftValue()/formatKotlinValue()/formatCSSValue()`
- `formatPlatformConstant()` instead of `formatSwiftConstant()/formatKotlinConstant()/formatCSSCustomProperty()`

Or use a common interface that defines these methods with platform-agnostic names.

**Actual Behavior**:
Each platform uses platform-specific prefixes in method names, creating inconsistent naming patterns that make it difficult to understand equivalent functionality.

**Evidence**:
```typescript
// iOS - Uses "Swift" prefix
private getSwiftType(category: string, unit: string): string { ... }
private formatSwiftValue(value: number | string | object, unit: string, swiftType: string): string { ... }
private formatSwiftConstant(name: string, value: number | string | object, unit: string, swiftType: string): string { ... }

// Android - Uses "Kotlin/XML" prefix
private getKotlinType(category: string, unit: string): string { ... }
private getXMLResourceType(category: string): string { ... }
private formatKotlinValue(value: number | string | object, unit: string, kotlinType: string): string { ... }
private formatXMLValue(value: number | string | object, unit: string): string { ... }

// Web - Uses "CSS/JS" prefix
private formatCSSValue(value: number | string | object, unit: string): string { ... }
private formatJSValue(value: number | string | object, unit: string): string { ... }
private formatCSSCustomProperty(name: string, value: number | string | object, unit: string): string { ... }
```

**Workaround**:
Developers must learn platform-specific method names and remember which prefix corresponds to which platform. Documentation can help but doesn't solve the underlying inconsistency.

**Cross-Area Impact**:
- Infrastructure: Minor - Doesn't affect functionality, only code readability
- Architecture: Important - Violates consistent naming principle
- Token System: None - Does not affect token definitions
- Documentation: Important - Must document platform-specific method names

**Related Issues**:
None - New issue discovered during architecture audit

---

## Issue #010: Z-Index Token Handling Inconsistency Across Platforms

**Discovered By**: Architecture Discovery Audit
**Date Discovered**: 2025-10-29
**Severity**: Critical
**Category**: Platform Consistency - Token Handling
**Affects**: Cross-platform build system, layering token generation, platform consistency

**Location**:
- **File(s)**: `src/providers/iOSFormatGenerator.ts` (lines 25-35), `src/providers/WebFormatGenerator.ts` (lines 20-30), `src/providers/AndroidFormatGenerator.ts`
- **System**: Platform Generation System - Layering Token Handling
- **Context**: Z-index/layering token value transformation across platforms

**Description**:
Z-index/layering tokens are handled inconsistently across platforms. iOS scales down values by dividing by 100 (e.g., 100→1, 200→2), Web uses direct values (100→100), and Android's handling is not documented in the format generator.

iOS implementation:
```typescript
if (token.category === 'layering') {
  value = token.value / 100;  // Scales down: 100→1, 200→2
}
```

Web implementation:
```typescript
// Uses direct value without transformation
return this.formatCSSCustomProperty(tokenName, token.value, 'unitless');
```

Android implementation:
```typescript
// No special handling for layering tokens documented
// Unclear if values are transformed or used directly
```

This inconsistency means that the same layering token (e.g., `elevation.modal = 100`) will generate different values across platforms:
- iOS: `1.0` (scaled down)
- Web: `100` (direct value)
- Android: Unknown (not documented)

This violates the principle of cross-platform consistency and could lead to visual inconsistencies in layered UI elements.

**Steps to Reproduce**:
1. Create a layering token with value 100
2. Generate iOS output: Observe value is 1.0
3. Generate Web output: Observe value is 100
4. Generate Android output: Observe value is unclear
5. Compare generated values across platforms
6. Observe: Inconsistent values for same token

**Expected Behavior**:
All platforms should handle layering tokens consistently, either:
1. All use direct values (100→100 on all platforms)
2. All scale down values (100→1 on all platforms)
3. Document platform-specific conventions and rationale for differences

**Actual Behavior**:
iOS scales down by 100, Web uses direct values, Android handling is undocumented, creating cross-platform inconsistency.

**Evidence**:
```typescript
// src/providers/iOSFormatGenerator.ts (lines 25-35)
if ('value' in token && typeof token.value === 'number' && 
    'platforms' in token && Array.isArray(token.platforms)) {
  let value = token.value;
  
  // For z-index tokens, scale down values (divide by 100) for SwiftUI conventions
  // Web uses 100, 200, 300... but iOS uses 1, 2, 3...
  if (token.category === 'layering') {
    value = token.value / 100;  // Scales down
  }
  
  const swiftType = this.getSwiftType(token.category, 'unitless');
  return this.formatSwiftConstant(tokenName, value, 'unitless', swiftType);
}

// src/providers/WebFormatGenerator.ts (lines 20-30)
if ('value' in token && typeof token.value === 'number' && 
    'platforms' in token && Array.isArray(token.platforms)) {
  // Uses direct value without transformation
  if (this.outputFormat === 'css') {
    return this.formatCSSCustomProperty(tokenName, token.value, 'unitless');
  } else {
    return this.formatJavaScriptConstant(tokenName, token.value, 'unitless');
  }
}

// src/providers/AndroidFormatGenerator.ts
// No special handling for layering tokens found
// Unclear if values are transformed or used directly
```

**Workaround**:
Document the platform-specific conventions and adjust token values manually if needed:
- Define layering tokens with platform-specific values
- Or document that iOS uses scaled values and adjust UI code accordingly

**Cross-Area Impact**:
- Infrastructure: None - Does not affect build infrastructure
- Architecture: Critical - Violates cross-platform consistency principle
- Token System: Critical - Affects layering token definitions and usage
- Documentation: Important - Must document platform-specific conventions

**Related Issues**:
None - New issue discovered during architecture audit

---

## Issue #011: Opacity/Alpha Terminology Inconsistency

**Discovered By**: Architecture Discovery Audit
**Date Discovered**: 2025-10-29
**Severity**: Minor
**Category**: Platform Consistency - Terminology
**Affects**: Code readability, developer experience, API consistency

**Location**:
- **File(s)**: `src/providers/iOSFormatGenerator.ts`, `src/providers/AndroidFormatGenerator.ts`, `src/providers/WebFormatGenerator.ts`
- **System**: Platform Generation System - Opacity/Alpha Methods
- **Context**: Method naming for opacity/alpha functionality across platforms

**Description**:
The three platform format generators use inconsistent terminology for opacity/alpha functionality. iOS uses "opacity", Android uses "alpha", and Web uses "opacity", even though they refer to the same concept (transparency).

iOS methods:
- `generateOpacityModifier()` - Outputs `.opacity(0.48)`
- `generateColorWithOpacity()` - Outputs `Color(red: r, green: g, blue: b, opacity: 0.48)`

Android methods:
- `generateAlphaModifier()` - Outputs `Modifier.alpha(0.48f)`
- `generateColorWithAlpha()` - Outputs `Color(0xFF6B50A4).copy(alpha = 0.48f)`

Web methods:
- `generateOpacityProperty()` - Outputs `opacity: 0.48;`
- `generateRgbaAlpha()` - Outputs `rgba(r, g, b, 0.48)`

This inconsistency creates confusion about whether "opacity" and "alpha" are different concepts or the same concept with different names. It also makes it harder to find equivalent methods across platforms.

**Steps to Reproduce**:
1. Open `src/providers/iOSFormatGenerator.ts`
2. Find opacity methods: `generateOpacityModifier()`, `generateColorWithOpacity()`
3. Open `src/providers/AndroidFormatGenerator.ts`
4. Find alpha methods: `generateAlphaModifier()`, `generateColorWithAlpha()`
5. Open `src/providers/WebFormatGenerator.ts`
6. Find opacity methods: `generateOpacityProperty()`, `generateRgbaAlpha()`
7. Observe: Inconsistent terminology for same concept

**Expected Behavior**:
All platforms should use consistent terminology, preferably "opacity" since:
1. It's the CSS standard term
2. It's more commonly used in design tools
3. Two out of three platforms already use it

Methods should be named:
- `generateOpacityModifier()` (all platforms)
- `generateColorWithOpacity()` (all platforms)

**Actual Behavior**:
iOS and Web use "opacity", Android uses "alpha", creating terminology inconsistency.

**Evidence**:
```typescript
// iOS - Uses "opacity"
generateOpacityModifier(opacityValue: number): string {
  return `.opacity(${opacityValue})`;
}

generateColorWithOpacity(r: number, g: number, b: number, opacity: number): string {
  return `Color(red: ${r}, green: ${g}, blue: ${b}, opacity: ${opacity})`;
}

// Android - Uses "alpha"
generateAlphaModifier(opacityValue: number): string {
  const formattedValue = this.formatFloatValue(opacityValue);
  return `Modifier.alpha(${formattedValue}f)`;
}

generateColorWithAlpha(colorHex: string, alpha: number): string {
  const formattedAlpha = this.formatFloatValue(alpha);
  return `Color(${colorHex}).copy(alpha = ${formattedAlpha}f)`;
}

// Web - Uses "opacity" and "alpha"
generateOpacityProperty(opacityValue: number): string {
  return `opacity: ${opacityValue};`;
}

generateRgbaAlpha(r: number, g: number, b: number, alpha: number): string {
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
```

**Workaround**:
Developers must remember that "opacity" and "alpha" refer to the same concept and use the appropriate term for each platform.

**Cross-Area Impact**:
- Infrastructure: None - Does not affect functionality
- Architecture: Minor - Violates consistent terminology principle
- Token System: None - Does not affect token definitions
- Documentation: Minor - Must document terminology differences

**Related Issues**:
None - New issue discovered during architecture audit

---



## Issue #012: TokenFileGenerator Performs Validation Logic (Mixed Responsibilities)

**Discovered By**: Architecture Discovery Audit
**Date Discovered**: 2025-10-29
**Severity**: Important
**Category**: Separation of Concerns - Generator vs Validator
**Affects**: Token generation system, validation system, code maintainability

**Location**:
- **File(s)**: `src/generators/TokenFileGenerator.ts` (lines 400-480)
- **System**: Token Generation System
- **Context**: Semantic token reference validation within generator class

**Description**:
The TokenFileGenerator class contains a `validateSemanticReferences()` method that performs validation logic to check if semantic tokens reference valid primitive tokens. This violates separation of concerns by mixing generation responsibilities (creating platform-specific files) with validation responsibilities (checking token reference integrity).

The validation logic in TokenFileGenerator duplicates functionality that should belong in the validation system (SemanticTokenValidator, PrimitiveReferenceValidator). This creates several problems:

1. **Duplicate validation logic**: Same validation rules exist in both generator and validator
2. **Inconsistent validation**: Generator validation may differ from validator validation
3. **Mixed responsibilities**: Generator should generate, not validate
4. **Maintenance burden**: Validation rules must be updated in multiple places
5. **Testing complexity**: Generator tests must cover validation scenarios

The generator uses this validation to decide whether to skip semantic token generation if validation fails, but this decision should be made before generation begins, not during generation.

**Steps to Reproduce**:
1. Open `src/generators/TokenFileGenerator.ts`
2. Find `validateSemanticReferences()` method (lines 400-480)
3. Observe: Method performs validation logic checking primitive token references
4. Open `src/validators/SemanticTokenValidator.ts`
5. Observe: Similar validation logic exists in validator
6. Compare validation logic between generator and validator
7. Observe: Duplicate validation rules with potential for inconsistency

**Expected Behavior**:
Generators should focus solely on generation responsibilities:
- Format tokens for platform-specific output
- Generate file headers and footers
- Organize tokens by category
- Produce syntactically correct output

Validation should be performed by validators before generation:
- SemanticTokenValidator validates semantic token structure
- PrimitiveReferenceValidator validates primitive references
- Validation results passed to generator to inform generation decisions

**Actual Behavior**:
TokenFileGenerator performs validation during generation:
- Checks if primitive references exist
- Validates typography token structure
- Decides whether to skip semantic generation based on validation
- Logs validation errors during generation

**Evidence**:
```typescript
// src/generators/TokenFileGenerator.ts (lines 400-480)
// Generator performing validation logic
validateSemanticReferences(
  semantics: SemanticToken[],
  primitives: PrimitiveToken[]
): {
  valid: boolean;
  invalidReferences: Array<{
    semanticToken: string;
    property: string;
    reference: string;
    reason: string;
  }>;
} {
  const invalidReferences: Array<{...}> = [];
  
  // Create a set of primitive token names for fast lookup
  const primitiveNames = new Set(primitives.map(p => p.name));
  
  // Validate each semantic token
  for (const semantic of semantics) {
    // Validation logic checking references...
    if (!primitiveNames.has(refs.value)) {
      invalidReferences.push({
        semanticToken: semantic.name,
        property: 'value',
        reference: refs.value,
        reason: `Semantic token '${semantic.name}' references non-existent primitive '${refs.value}'`
      });
    }
    // More validation logic...
  }
  
  return {
    valid: invalidReferences.length === 0,
    invalidReferences
  };
}

// Generator using validation to control generation
generateWebTokens(options: GenerationOptions = {}): GenerationResult {
  // ... generation code ...
  
  // Validate semantic token references before generating semantic section
  const validationResult = this.validateSemanticReferences(semantics, tokens);
  
  if (!validationResult.valid) {
    // Log errors for invalid references
    validationResult.invalidReferences.forEach(ref => {
      errors.push(ref.reason);
    });
    
    // Skip semantic generation if validation fails
    warnings.push('Semantic token generation skipped due to validation errors');
  } else {
    // Generate semantic tokens...
  }
}
```

```typescript
// src/validators/SemanticTokenValidator.ts
// Validator with similar validation logic
export class SemanticTokenValidator {
  validate(
    semanticToken: SemanticToken,
    options: SemanticValidationOptions = {}
  ): ComprehensiveValidationResult {
    // Validate primitive references
    if (validatePrimitiveReferences) {
      primitiveReferencesResult = this.primitiveReferenceValidator.validate(semanticToken, {
        allowEmptyReferences,
        strictValidation
      });
      validationResults.push(primitiveReferencesResult);
    }
    // Similar validation logic exists here
  }
}
```

**Workaround**:
Current workaround is to accept the mixed responsibilities and maintain validation logic in both generator and validator. Developers must ensure validation rules stay synchronized.

**Cross-Area Impact**:
- Infrastructure: None - Does not affect build automation
- Architecture: Important - Violates separation of concerns principle
- Token System: Minor - Validation logic duplication could lead to inconsistencies
- Documentation: Minor - Must document that validation occurs in multiple places

**Related Issues**:
None - New issue discovered during separation of concerns review

---

## Issue #013: PrimitiveTokenRegistry Performs Validation (Mixed Responsibilities)

**Discovered By**: Architecture Discovery Audit
**Date Discovered**: 2025-10-29
**Severity**: Important
**Category**: Separation of Concerns - Registry vs Validator
**Affects**: Token registry system, validation system, code organization

**Location**:
- **File(s)**: `src/registries/PrimitiveTokenRegistry.ts` (lines 60-90, 120-140)
- **System**: Token Registry System
- **Context**: Validation logic within registry class

**Description**:
The PrimitiveTokenRegistry class contains validation logic that checks tokens against baseline grid requirements during registration. This violates separation of concerns by mixing registry responsibilities (storing and retrieving tokens) with validation responsibilities (checking token correctness).

The registry instantiates a BaselineGridValidator and calls it during token registration:

```typescript
constructor() {
  this.validator = new BaselineGridValidator({
    allowStrategicFlexibility: true
  });
}

register(token: PrimitiveToken, options: TokenRegistrationOptions = {}): ValidationResult {
  // Validate token if not skipped
  if (!skipValidation) {
    validationResult = this.validateToken(token);
    if (validationResult.level === 'Error') {
      return validationResult;
    }
  }
  // Register the token...
}

validateToken(token: PrimitiveToken): ValidationResult {
  // Validation logic...
  if (baselineGridCategories.includes(token.category)) {
    return this.validator.validate(token.baseValue, token.name);
  }
}
```

This creates several problems:

1. **Mixed responsibilities**: Registry should store/retrieve, not validate
2. **Tight coupling**: Registry depends on validator implementation
3. **Validation timing**: Validation happens during registration, not before
4. **Inconsistent validation**: Registry validation may differ from external validation
5. **Testing complexity**: Registry tests must cover validation scenarios

**Steps to Reproduce**:
1. Open `src/registries/PrimitiveTokenRegistry.ts`
2. Find constructor (lines 20-25)
3. Observe: Registry instantiates BaselineGridValidator
4. Find `register()` method (lines 60-90)
5. Observe: Method calls `validateToken()` during registration
6. Find `validateToken()` method (lines 120-140)
7. Observe: Method performs validation logic
8. Observe: Registry has validation responsibilities mixed with storage responsibilities

**Expected Behavior**:
Registries should focus solely on storage and retrieval:
- Store tokens in internal data structures
- Retrieve tokens by name or category
- Provide query methods for token discovery
- Maintain category indexes for efficient lookup

Validation should be performed by validators before registration:
- Validators check token correctness
- Validation results inform registration decisions
- Registry accepts pre-validated tokens
- Separation between validation and storage

**Actual Behavior**:
Registry performs validation during registration:
- Instantiates validator in constructor
- Calls validator during registration
- Returns validation results from registration
- Mixes storage and validation responsibilities

**Evidence**:
```typescript
// src/registries/PrimitiveTokenRegistry.ts
export class PrimitiveTokenRegistry {
  private tokens: Map<string, PrimitiveToken> = new Map();
  private validator: BaselineGridValidator;  // Registry owns validator
  private categoryIndex: Map<TokenCategory, Set<string>> = new Map();

  constructor() {
    this.validator = new BaselineGridValidator({  // Registry creates validator
      allowStrategicFlexibility: true
    });
    this.initializeCategoryIndex();
  }

  register(token: PrimitiveToken, options: TokenRegistrationOptions = {}): ValidationResult {
    const { skipValidation = false, allowOverwrite = false } = options;

    // Registry performs validation
    let validationResult: ValidationResult;
    if (!skipValidation) {
      validationResult = this.validateToken(token);  // Registry validates
      if (validationResult.level === 'Error') {
        return validationResult;  // Registry returns validation result
      }
    }

    // Register the token (actual registry responsibility)
    this.tokens.set(token.name, token);
    this.addToCategory(token.category, token.name);

    return validationResult;  // Returns validation result, not registration result
  }

  // Registry has validation method
  validateToken(token: PrimitiveToken): ValidationResult {
    const baselineGridCategories: TokenCategory[] = [TokenCategory.SPACING, TokenCategory.RADIUS];
    
    if (baselineGridCategories.includes(token.category)) {
      return this.validator.validate(token.baseValue, token.name);
    }

    return {
      level: 'Pass',
      token: token.name,
      message: 'Token category does not require baseline grid validation',
      // ...
    };
  }

  // Registry has validateAll method
  validateAll(): ValidationResult[] {
    return Array.from(this.tokens.values()).map(token => this.validateToken(token));
  }
}
```

**Workaround**:
Use `skipValidation: true` option when registering tokens to bypass registry validation and perform validation separately:

```typescript
// Validate separately
const validationResult = validator.validate(token);

// Register with validation skipped
if (validationResult.level !== 'Error') {
  registry.register(token, { skipValidation: true });
}
```

**Cross-Area Impact**:
- Infrastructure: None - Does not affect build automation
- Architecture: Important - Violates separation of concerns principle
- Token System: Minor - Registry validation could differ from external validation
- Documentation: Minor - Must document validation options and timing

**Related Issues**:
- **Issue #012**: TokenFileGenerator Performs Validation Logic
  - Same pattern: component performing validation instead of delegating to validators
  - Both issues show validation logic mixed into non-validation components

---

## Issue #014: SemanticTokenRegistry Performs Validation (Mixed Responsibilities)

**Discovered By**: Architecture Discovery Audit
**Date Discovered**: 2025-10-29
**Severity**: Important
**Category**: Separation of Concerns - Registry vs Validator
**Affects**: Token registry system, validation system, code organization

**Location**:
- **File(s)**: `src/registries/SemanticTokenRegistry.ts` (lines 50-80, 110-150)
- **System**: Token Registry System
- **Context**: Validation logic within semantic token registry class

**Description**:
The SemanticTokenRegistry class contains validation logic that checks semantic tokens for valid primitive references during registration. This violates separation of concerns by mixing registry responsibilities (storing and retrieving semantic tokens) with validation responsibilities (checking token correctness).

Similar to Issue #013 (PrimitiveTokenRegistry validation), the semantic registry performs validation during registration:

```typescript
register(token: SemanticToken, options: SemanticTokenRegistrationOptions = {}): ValidationResult {
  // Validate token if not skipped
  if (!skipValidation) {
    validationResult = this.validateToken(token);
    if (validationResult.level === 'Error') {
      return validationResult;
    }
  }
  // Register the token...
}

validateToken(token: SemanticToken): ValidationResult {
  // Validation logic checking primitive references...
  for (const [key, primitiveRef] of Object.entries(token.primitiveReferences)) {
    const primitiveToken = this.primitiveRegistry.get(primitiveRef);
    if (!primitiveToken) {
      invalidReferences.push(`${key}: ${primitiveRef}`);
    }
  }
}
```

This creates the same problems as Issue #013:

1. **Mixed responsibilities**: Registry should store/retrieve, not validate
2. **Tight coupling**: Registry depends on primitive registry for validation
3. **Validation timing**: Validation happens during registration, not before
4. **Duplicate validation**: Similar validation exists in SemanticTokenValidator
5. **Testing complexity**: Registry tests must cover validation scenarios

**Steps to Reproduce**:
1. Open `src/registries/SemanticTokenRegistry.ts`
2. Find constructor (lines 15-20)
3. Observe: Registry accepts PrimitiveTokenRegistry for validation
4. Find `register()` method (lines 50-80)
5. Observe: Method calls `validateToken()` during registration
6. Find `validateToken()` method (lines 110-150)
7. Observe: Method performs validation logic checking primitive references
8. Compare with `src/validators/SemanticTokenValidator.ts`
9. Observe: Similar validation logic exists in validator

**Expected Behavior**:
Semantic token registry should focus solely on storage and retrieval:
- Store semantic tokens in internal data structures
- Retrieve semantic tokens by name or category
- Provide query methods for semantic token discovery
- Maintain category indexes for efficient lookup
- Resolve mode-aware color values (this is appropriate for registry)

Validation should be performed by SemanticTokenValidator before registration:
- Validator checks primitive reference validity
- Validator checks semantic token structure
- Validation results inform registration decisions
- Registry accepts pre-validated tokens

**Actual Behavior**:
Registry performs validation during registration:
- Checks primitive references exist
- Validates semantic token structure
- Returns validation results from registration
- Mixes storage and validation responsibilities

**Evidence**:
```typescript
// src/registries/SemanticTokenRegistry.ts
export class SemanticTokenRegistry {
  private tokens: Map<string, SemanticToken> = new Map();
  private primitiveRegistry: PrimitiveTokenRegistry;  // Registry depends on primitive registry
  private categoryIndex: Map<SemanticCategory, Set<string>> = new Map();

  constructor(primitiveRegistry: PrimitiveTokenRegistry) {
    this.primitiveRegistry = primitiveRegistry;  // For validation purposes
    this.initializeCategoryIndex();
  }

  register(token: SemanticToken, options: SemanticTokenRegistrationOptions = {}): ValidationResult {
    const { skipValidation = false, allowOverwrite = false } = options;

    // Registry performs validation
    let validationResult: ValidationResult;
    if (!skipValidation) {
      validationResult = this.validateToken(token);  // Registry validates
      if (validationResult.level === 'Error') {
        return validationResult;  // Registry returns validation result
      }
    }

    // Register the token (actual registry responsibility)
    this.tokens.set(token.name, token);
    this.addToCategory(token.category, token.name);

    return validationResult;  // Returns validation result
  }

  // Registry has validation method
  validateToken(token: SemanticToken): ValidationResult {
    const invalidReferences: string[] = [];
    const resolvedTokens: Record<string, PrimitiveToken> = {};

    // Validate all primitive references
    for (const [key, primitiveRef] of Object.entries(token.primitiveReferences)) {
      const primitiveToken = this.primitiveRegistry.get(primitiveRef);  // Registry performs lookup
      
      if (!primitiveToken) {
        invalidReferences.push(`${key}: ${primitiveRef}`);
      } else {
        resolvedTokens[key] = primitiveToken;
      }
    }

    // Check if any references were invalid
    if (invalidReferences.length > 0) {
      return {
        level: 'Error',
        token: token.name,
        message: 'Invalid primitive token reference(s)',
        // ...
      };
    }

    // Attach resolved primitive tokens (this is appropriate)
    token.primitiveTokens = resolvedTokens;

    return {
      level: 'Pass',
      // ...
    };
  }

  // Registry has validateAll method
  validateAll(): ValidationResult[] {
    return Array.from(this.tokens.values()).map(token => this.validateToken(token));
  }
}
```

```typescript
// src/validators/SemanticTokenValidator.ts
// Similar validation logic exists in validator
export class SemanticTokenValidator {
  private primitiveReferenceValidator: PrimitiveReferenceValidator;

  validate(
    semanticToken: SemanticToken,
    options: SemanticValidationOptions = {}
  ): ComprehensiveValidationResult {
    // Validate primitive references
    if (validatePrimitiveReferences) {
      primitiveReferencesResult = this.primitiveReferenceValidator.validate(semanticToken, {
        allowEmptyReferences,
        strictValidation
      });
      // Similar validation logic
    }
  }
}
```

**Workaround**:
Use `skipValidation: true` option when registering semantic tokens to bypass registry validation and perform validation separately:

```typescript
// Validate separately
const validationResult = semanticValidator.validate(token);

// Register with validation skipped
if (validationResult.overall.level !== 'Error') {
  registry.register(token, { skipValidation: true });
}
```

**Cross-Area Impact**:
- Infrastructure: None - Does not affect build automation
- Architecture: Important - Violates separation of concerns principle
- Token System: Minor - Registry validation could differ from external validation
- Documentation: Minor - Must document validation options and timing

**Related Issues**:
- **Issue #012**: TokenFileGenerator Performs Validation Logic
  - Same pattern: component performing validation instead of delegating to validators
- **Issue #013**: PrimitiveTokenRegistry Performs Validation
  - Same pattern in primitive registry
  - Both registries mix storage and validation responsibilities

---

## Issue #015: ThreeTierValidator Orchestrates Multiple Validators (Appropriate Responsibility)

**Discovered By**: Architecture Discovery Audit
**Date Discovered**: 2025-10-29
**Severity**: None (Not an Issue)
**Category**: Separation of Concerns - Validator Orchestration
**Affects**: N/A - This is correct architecture

**Location**:
- **File(s)**: `src/validators/ThreeTierValidator.ts`
- **System**: Validation System
- **Context**: Validator orchestration pattern

**Description**:
The ThreeTierValidator class orchestrates multiple validators (PassValidator, WarningValidator, ErrorValidator) to provide comprehensive three-tier validation. This is NOT a violation of separation of concerns - it is the correct architectural pattern for coordinating multiple validation levels.

This issue is documented to clarify that orchestration is different from mixed responsibilities:

**Orchestration (Appropriate)**:
- ThreeTierValidator coordinates multiple validators
- Each validator maintains its own validation logic
- Orchestrator combines results and determines priority
- Clear separation: orchestrator coordinates, validators validate

**Mixed Responsibilities (Violation)**:
- TokenFileGenerator performs validation during generation
- Registries perform validation during registration
- Components doing validation that should delegate to validators

**Why ThreeTierValidator is Correct**:
1. **Single Responsibility**: Orchestrates validation, doesn't perform validation logic
2. **Delegation**: Delegates to specialized validators (Pass, Warning, Error)
3. **Composition**: Composes validation results without duplicating validation logic
4. **Extensibility**: New validators can be added without changing orchestrator

**Evidence**:
```typescript
// src/validators/ThreeTierValidator.ts
// Correct orchestration pattern
export class ThreeTierValidator {
  private passValidator: PassValidator;
  private warningValidator: WarningValidator;
  private errorValidator: ErrorValidator;

  constructor(
    passValidator?: PassValidator,
    warningValidator?: WarningValidator,
    errorValidator?: ErrorValidator
  ) {
    // Orchestrator composes validators
    this.passValidator = passValidator || new PassValidator();
    this.warningValidator = warningValidator || new WarningValidator();
    this.errorValidator = errorValidator || new ErrorValidator();
  }

  validate(context: ThreeTierValidationContext): ThreeTierValidationResult {
    // Orchestrator delegates to validators
    const errorResult = this.executeErrorValidation(context);
    const warningResult = this.executeWarningValidation(context);
    const passResult = this.executePassValidation(context);

    // Orchestrator combines results
    const primaryResult = this.determinePrimaryResult(resultsByLevel, context);
    
    return {
      primaryResult,
      resultsByLevel,
      summary,
      metadata
    };
  }

  // Orchestrator delegates, doesn't validate
  private executeErrorValidation(context: ThreeTierValidationContext): ValidationResult | null {
    return this.errorValidator.validate(errorContext);
  }
}
```

**Cross-Area Impact**:
None - This is correct architecture, not an issue

**Related Issues**:
None - This documents correct pattern for comparison with Issues #012, #013, #014

---


## Issue #016: Validator System Lacks Common Interface

**Discovered By**: Architecture Discovery Audit
**Date Discovered**: 2025-10-29
**Severity**: Important
**Category**: Interface Contracts - Validation System
**Affects**: Validation system, extensibility, architectural consistency

**Location**:
- **File(s)**: `src/validators/PassValidator.ts`, `src/validators/WarningValidator.ts`, `src/validators/ErrorValidator.ts`, `src/validators/ThreeTierValidator.ts`
- **System**: Validation System
- **Context**: Validator class definitions and orchestration

**Description**:
The validation system (PassValidator, WarningValidator, ErrorValidator) does not have a common interface or base class. Each validator is an independent class with different method signatures and validation contexts, making it impossible to work with validators polymorphically or enforce consistent validation patterns.

The ThreeTierValidator orchestrates these three validators, but there is no common contract that defines what a validator must implement. This means:
1. Cannot add new validators without modifying ThreeTierValidator
2. No contract enforcement for validator implementations
3. Each validator has different method signatures (validate, validatePass, validateWarning, validateError)
4. Cannot test validators through a common interface
5. Violates open/closed principle (open for extension, closed for modification)

This contrasts with the provider system, which uses a common interface (FormatProvider, UnitProvider, PathProvider) with abstract base classes to enforce implementation.

**Steps to Reproduce**:
1. Open `src/validators/PassValidator.ts`
2. Observe: No interface or base class, standalone class
3. Open `src/validators/WarningValidator.ts`
4. Observe: No interface or base class, standalone class
5. Open `src/validators/ErrorValidator.ts`
6. Observe: No interface or base class, standalone class
7. Open `src/validators/ThreeTierValidator.ts`
8. Observe: Orchestrator directly instantiates concrete validator classes
9. Attempt to add a new validator type (e.g., InfoValidator)
10. Observe: Must modify ThreeTierValidator to integrate new validator

**Expected Behavior**:
Validators should implement a common interface:
```typescript
interface IValidator {
  validate(context: ValidationContext): ValidationResult;
}

class PassValidator implements IValidator {
  validate(context: ValidationContext): ValidationResult { ... }
}

class ThreeTierValidator {
  constructor(private validators: IValidator[]) { ... }
  
  validate(context: ThreeTierValidationContext): ThreeTierValidationResult {
    // Can work with any validator through common interface
    for (const validator of this.validators) {
      const result = validator.validate(context);
      // ...
    }
  }
}
```

**Actual Behavior**:
Each validator is a standalone class with no common interface:
```typescript
// No common interface
class PassValidator {
  validatePass(context: PassValidationContext): ValidationResult { ... }
}

class WarningValidator {
  validateWarning(context: WarningValidationContext): ValidationResult { ... }
}

class ErrorValidator {
  validateError(context: ErrorValidationContext): ValidationResult { ... }
}

class ThreeTierValidator {
  private passValidator: PassValidator;
  private warningValidator: WarningValidator;
  private errorValidator: ErrorValidator;
  
  // Must know about each validator type explicitly
  constructor(
    passValidator?: PassValidator,
    warningValidator?: WarningValidator,
    errorValidator?: ErrorValidator
  ) { ... }
}
```

**Evidence**:
```typescript
// src/validators/PassValidator.ts - No interface
export class PassValidator {
  validatePass(context: PassValidationContext): ValidationResult {
    // Validation logic
  }
}

// src/validators/WarningValidator.ts - No interface
export class WarningValidator {
  validateWarning(context: WarningValidationContext): ValidationResult {
    // Validation logic
  }
}

// src/validators/ErrorValidator.ts - No interface
export class ErrorValidator {
  validateError(context: ErrorValidationContext): ValidationResult {
    // Validation logic
  }
}

// src/validators/ThreeTierValidator.ts - Tightly coupled to concrete classes
export class ThreeTierValidator {
  private passValidator: PassValidator;
  private warningValidator: WarningValidator;
  private errorValidator: ErrorValidator;

  constructor(
    passValidator?: PassValidator,
    warningValidator?: WarningValidator,
    errorValidator?: ErrorValidator
  ) {
    this.passValidator = passValidator || new PassValidator();
    this.warningValidator = warningValidator || new WarningValidator();
    this.errorValidator = errorValidator || new ErrorValidator();
  }
}
```

**Workaround**:
To add a new validator type, must:
1. Create new validator class
2. Modify ThreeTierValidator constructor to accept new validator
3. Modify ThreeTierValidator validation logic to call new validator
4. Update all ThreeTierValidator instantiations

**Cross-Area Impact**:
- Infrastructure: None - Does not affect build automation
- Architecture: Important - Violates interface consistency principle
- Token System: Minor - Makes validation system less extensible
- Documentation: None - Does not affect documentation

**Related Issues**:
- **Issue #008**: Format Generator Constructor Inconsistency
  - Contrast: Providers have common interface, validators don't
- **Issue #017**: Registry System Lacks Common Interface
  - Same architectural pattern: missing common interface

---

## Issue #017: Registry System Lacks Common Interface

**Discovered By**: Architecture Discovery Audit
**Date Discovered**: 2025-10-29
**Severity**: Important
**Category**: Interface Contracts - Registry System
**Affects**: Registry system, extensibility, code reusability

**Location**:
- **File(s)**: `src/registries/PrimitiveTokenRegistry.ts`, `src/registries/SemanticTokenRegistry.ts`
- **System**: Token Registry System
- **Context**: Token registration and retrieval

**Description**:
PrimitiveTokenRegistry and SemanticTokenRegistry do not implement a common interface. Each registry has different method signatures and capabilities, making it impossible to work with registries polymorphically or enforce consistent registry patterns.

The two registries serve similar purposes (storing and retrieving tokens) but have different APIs:
- PrimitiveTokenRegistry: `register()`, `get()`, `getByCategory()`, `validateToken()`
- SemanticTokenRegistry: `register()`, `get()`, `getAllTokens()`, `resolveReferences()`

This inconsistency means:
1. Cannot abstract over registry type
2. Cannot write generic code that works with any registry
3. Difficult to add new registry types (e.g., ComponentTokenRegistry)
4. No contract enforcement for registry implementations
5. Code duplication between registries

This contrasts with the provider system, which uses common interfaces (FormatProvider, UnitProvider, PathProvider) to enable polymorphic usage.

**Steps to Reproduce**:
1. Open `src/registries/PrimitiveTokenRegistry.ts`
2. Observe: No interface, standalone class with specific methods
3. Open `src/registries/SemanticTokenRegistry.ts`
4. Observe: No interface, standalone class with different methods
5. Attempt to write generic function that works with any registry:
```typescript
function getToken(registry: ???, name: string) {
  return registry.get(name); // What type is registry?
}
```
6. Observe: No common type to use for registry parameter

**Expected Behavior**:
Registries should implement a common interface:
```typescript
interface ITokenRegistry<T extends PrimitiveToken | SemanticToken> {
  register(token: T, options?: RegistrationOptions): ValidationResult;
  get(name: string): T | undefined;
  getAll(): T[];
  has(name: string): boolean;
}

class PrimitiveTokenRegistry implements ITokenRegistry<PrimitiveToken> {
  register(token: PrimitiveToken, options?: RegistrationOptions): ValidationResult { ... }
  get(name: string): PrimitiveToken | undefined { ... }
  getAll(): PrimitiveToken[] { ... }
  has(name: string): boolean { ... }
}

class SemanticTokenRegistry implements ITokenRegistry<SemanticToken> {
  register(token: SemanticToken, options?: RegistrationOptions): ValidationResult { ... }
  get(name: string): SemanticToken | undefined { ... }
  getAll(): SemanticToken[] { ... }
  has(name: string): boolean { ... }
}
```

**Actual Behavior**:
Each registry is a standalone class with no common interface:
```typescript
// No common interface
export class PrimitiveTokenRegistry {
  register(token: PrimitiveToken, options?: TokenRegistrationOptions): ValidationResult { ... }
  get(name: string): PrimitiveToken | undefined { ... }
  getByCategory(category: TokenCategory, options?: TokenQueryOptions): PrimitiveToken[] { ... }
  validateToken(token: PrimitiveToken): ValidationResult { ... }
}

export class SemanticTokenRegistry {
  register(token: SemanticToken, options?: SemanticTokenRegistrationOptions): ValidationResult { ... }
  get(name: string): SemanticToken | undefined { ... }
  getAllTokens(): SemanticToken[] { ... }
  resolveReferences(token: SemanticToken): SemanticToken { ... }
}
```

**Evidence**:
```typescript
// src/registries/PrimitiveTokenRegistry.ts - No interface
export interface TokenRegistrationOptions {
  skipValidation?: boolean;
  allowOverwrite?: boolean;
}

export interface TokenQueryOptions {
  category?: TokenCategory;
  includeStrategicFlexibility?: boolean;
  sortBy?: 'name' | 'value' | 'category';
}

export class PrimitiveTokenRegistry {
  private tokens: Map<string, PrimitiveToken> = new Map();
  private validator: BaselineGridValidator;
  private categoryIndex: Map<TokenCategory, Set<string>> = new Map();

  register(token: PrimitiveToken, options: TokenRegistrationOptions = {}): ValidationResult {
    // Registration logic
  }

  get(name: string): PrimitiveToken | undefined {
    return this.tokens.get(name);
  }

  getByCategory(category: TokenCategory, options: TokenQueryOptions = {}): PrimitiveToken[] {
    // Category-specific retrieval
  }
}

// src/registries/SemanticTokenRegistry.ts - No interface, different API
export interface SemanticTokenRegistrationOptions {
  skipValidation?: boolean;
  allowOverwrite?: boolean;
  resolveReferences?: boolean;
}

export class SemanticTokenRegistry {
  private tokens: Map<string, SemanticToken> = new Map();
  private primitiveRegistry: PrimitiveTokenRegistry;

  register(token: SemanticToken, options: SemanticTokenRegistrationOptions = {}): ValidationResult {
    // Registration logic
  }

  get(name: string): SemanticToken | undefined {
    return this.tokens.get(name);
  }

  getAllTokens(): SemanticToken[] {
    return Array.from(this.tokens.values());
  }

  resolveReferences(token: SemanticToken): SemanticToken {
    // Reference resolution logic
  }
}
```

**Workaround**:
Use union types or conditional logic:
```typescript
function getToken(
  registry: PrimitiveTokenRegistry | SemanticTokenRegistry,
  name: string
): PrimitiveToken | SemanticToken | undefined {
  return registry.get(name);
}

// Or use conditional logic
if (registry instanceof PrimitiveTokenRegistry) {
  const token = registry.get(name);
  const byCategory = registry.getByCategory('spacing');
} else if (registry instanceof SemanticTokenRegistry) {
  const token = registry.get(name);
  const all = registry.getAllTokens();
}
```

**Cross-Area Impact**:
- Infrastructure: None - Does not affect build automation
- Architecture: Important - Violates interface consistency principle
- Token System: Important - Makes registry system less extensible and reusable
- Documentation: None - Does not affect documentation

**Related Issues**:
- **Issue #016**: Validator System Lacks Common Interface
  - Same architectural pattern: missing common interface
- **Issue #013**: PrimitiveTokenRegistry Performs Validation
  - Related: Registry performing validation suggests unclear responsibilities
- **Issue #014**: SemanticTokenRegistry Performs Validation
  - Related: Registry performing validation suggests unclear responsibilities

---


## Issue #018: Missing Index File in Registries Module

**Discovered By**: Architecture Discovery Audit
**Date Discovered**: 2025-10-29
**Severity**: Minor
**Category**: Code Organization - Module Boundaries
**Affects**: Import patterns, module consistency, developer experience

**Location**:
- **File(s)**: `src/registries/` directory (missing `index.ts`)
- **System**: Token Registry System
- **Context**: Module-level exports and barrel file patterns

**Description**:
The `src/registries/` directory lacks an index.ts barrel export file, while all other major modules in the codebase have index.ts files that provide clean module-level exports. This creates inconsistent import patterns where registries must be imported directly from their implementation files rather than through a module-level export.

All other major modules follow the barrel export pattern:
- `src/providers/index.ts` - exports all providers
- `src/validators/index.ts` - exports all validators
- `src/resolvers/index.ts` - exports all resolvers
- `src/tokens/index.ts` - exports all tokens
- `src/types/index.ts` - exports all types
- `src/analytics/index.ts` - exports all analytics
- `src/blend/index.ts` - exports all blend utilities
- `src/composition/index.ts` - exports all composition utilities
- `src/integration/index.ts` - exports all integration components
- `src/naming/index.ts` - exports all naming utilities
- `src/performance/index.ts` - exports all performance utilities
- `src/security/index.ts` - exports all security components

The registries module is the only major module without this pattern, creating an organizational inconsistency.

**Steps to Reproduce**:
1. Check for index.ts files: `find src -maxdepth 2 -name "index.ts" | sort`
2. Observe: All major modules have index.ts except registries
3. Try to import from registries module: `import { PrimitiveTokenRegistry } from '@/registries'`
4. Observe: Import fails because no barrel export exists
5. Must use direct import: `import { PrimitiveTokenRegistry } from '@/registries/PrimitiveTokenRegistry'`

**Expected Behavior**:
The registries module should have an index.ts file that exports both registries:
```typescript
// src/registries/index.ts (expected)
export { PrimitiveTokenRegistry } from './PrimitiveTokenRegistry';
export { SemanticTokenRegistry } from './SemanticTokenRegistry';
```

This would enable consistent import patterns:
```typescript
import { PrimitiveTokenRegistry, SemanticTokenRegistry } from '@/registries';
```

**Actual Behavior**:
No index.ts file exists in src/registries/, requiring direct imports from implementation files:
```typescript
import { PrimitiveTokenRegistry } from '@/registries/PrimitiveTokenRegistry';
import { SemanticTokenRegistry } from '@/registries/SemanticTokenRegistry';
```

**Evidence**:
```bash
# All major modules have index.ts
$ find src -maxdepth 2 -name "index.ts" | sort
src/analytics/index.ts
src/blend/index.ts
src/build/index.ts
src/composition/index.ts
src/integration/index.ts
src/naming/index.ts
src/performance/index.ts
src/providers/index.ts
src/release-analysis/index.ts
src/resolvers/index.ts
src/security/index.ts
src/tokens/index.ts
src/types/index.ts
src/validators/index.ts
# Note: src/registries/index.ts is missing

# Registries directory contents
$ ls -la src/registries/
total 40
drwxr-xr-x@  5 3fn  staff   160 Oct 23 13:58 .
drwxr-xr-x@ 24 3fn  staff   768 Oct 28 09:26 ..
-rw-r--r--@  1 3fn  staff  7608 Oct 23 12:27 PrimitiveTokenRegistry.ts
-rw-r--r--@  1 3fn  staff  9384 Oct  4 13:09 SemanticTokenRegistry.ts
drwxr-xr-x@  4 3fn  staff   128 Oct 23 13:58 __tests__
# No index.ts file
```

**Workaround**:
Use direct imports from implementation files:
```typescript
import { PrimitiveTokenRegistry } from '@/registries/PrimitiveTokenRegistry';
import { SemanticTokenRegistry } from '@/registries/SemanticTokenRegistry';
```

This works but creates inconsistent import patterns compared to other modules.

**Cross-Area Impact**:
- Infrastructure: None - Does not affect build automation
- Architecture: Minor - Creates inconsistent module organization pattern
- Token System: Minor - Affects how registries are imported but not functionality
- Documentation: None - Does not affect documentation

**Related Issues**:
- **Issue #017**: Registry System Lacks Common Interface
  - Related: Both issues affect registry module organization and consistency
  - Missing index.ts compounds the lack of common interface by making imports inconsistent

---

## Issue #019: Test Directory Organization Inconsistency

**Discovered By**: Architecture Discovery Audit
**Date Discovered**: 2025-10-29
**Severity**: Minor
**Category**: Code Organization - Test Structure
**Affects**: Test organization, developer experience, test discovery

**Location**:
- **File(s)**: Multiple test directories across `src/` directory
- **System**: Test Organization System
- **Context**: Test file placement and directory structure patterns

**Description**:
Test files are organized using two different patterns across the codebase, creating ambiguity about where tests should be placed:

**Pattern 1: Module-Level __tests__ Directories** (Most Common)
Most modules place tests in `__tests__/` subdirectories within each module:
- `src/analytics/__tests__/`
- `src/blend/__tests__/`
- `src/providers/__tests__/`
- `src/validators/__tests__/`
- `src/resolvers/__tests__/`
- `src/registries/__tests__/`

**Pattern 2: Top-Level __tests__ Directory**
Integration and performance tests are placed in a top-level directory:
- `src/__tests__/integration/` - Integration tests
- `src/__tests__/performance/` - Performance tests
- `src/__tests__/fixtures/` - Test fixtures
- `src/__tests__/examples/` - Test examples

**Pattern 3: Nested __tests__ Directories** (Build Module)
The build module has __tests__ directories at multiple nesting levels:
- `src/build/__tests__/`
- `src/build/errors/__tests__/`
- `src/build/orchestration/__tests__/`
- `src/build/platforms/__tests__/`
- `src/build/tokens/__tests__/`
- `src/build/validation/__tests__/`
- `src/build/workflow/__tests__/`

**Pattern 4: Deep Nesting** (Release-Analysis Module)
The release-analysis module has extensive subdirectory structure with tests at each level:
- `src/release-analysis/__tests__/` - Top-level integration tests
- `src/release-analysis/cli/__tests__/`
- `src/release-analysis/collection/__tests__/`
- `src/release-analysis/config/__tests__/`
- `src/release-analysis/errors/__tests__/`
- And 10+ more subdirectory-level __tests__ directories

This mixed pattern creates confusion about:
- Where to place new tests (module-level vs top-level vs nested)
- How to organize integration tests (top-level vs module-level)
- When to create nested __tests__ directories vs flat structure

**Steps to Reproduce**:
1. List all test directories: `find src -type d -name "__tests__" | sort`
2. Observe: 38 different __tests__ directories at various nesting levels
3. Compare patterns:
   - Most modules: Single __tests__ directory at module level
   - Build module: Multiple nested __tests__ directories
   - Release-analysis: Extensive nested __tests__ directories
   - Top-level: Separate integration/performance directories
4. Observe: No clear guideline for which pattern to use

**Expected Behavior**:
Consistent test organization pattern with clear guidelines:
- Unit tests: Colocated with source in module-level __tests__ directories
- Integration tests: Either top-level src/__tests__/integration/ OR module-level
- Performance tests: Top-level src/__tests__/performance/
- Nested tests: Only when module has deep subdirectory structure

Or document the rationale for different patterns and when to use each.

**Actual Behavior**:
Mixed test organization patterns without clear guidelines:
- Some modules use flat __tests__ structure
- Some modules use nested __tests__ at multiple levels
- Integration tests split between top-level and module-level
- No documented rationale for different patterns

**Evidence**:
```bash
# Test directory count and patterns
$ find src -type d -name "__tests__" | wc -l
38

# Pattern 1: Module-level (most common)
src/analytics/__tests__
src/blend/__tests__
src/providers/__tests__
src/validators/__tests__

# Pattern 2: Top-level integration/performance
src/__tests__/integration/
src/__tests__/performance/
src/__tests__/fixtures/
src/__tests__/examples/

# Pattern 3: Nested (build module)
src/build/__tests__
src/build/errors/__tests__
src/build/orchestration/__tests__
src/build/platforms/__tests__

# Pattern 4: Deep nesting (release-analysis)
src/release-analysis/__tests__
src/release-analysis/cli/__tests__
src/release-analysis/collection/__tests__
src/release-analysis/config/__tests__
# ... and 10+ more
```

**Workaround**:
Follow the most common pattern (module-level __tests__) for new tests, but be aware that integration tests may go in top-level directory and deeply nested modules may have multiple __tests__ directories.

**Cross-Area Impact**:
- Infrastructure: Minor - Test discovery may be affected by inconsistent patterns
- Architecture: Minor - Affects code organization and navigation
- Token System: None - Does not affect token functionality
- Documentation: Minor - Test organization not clearly documented

**Related Issues**:
None - New issue discovered during code organization review

---

## Issue #020: Validator File Naming Suffix Inconsistency

**Discovered By**: Architecture Discovery Audit
**Date Discovered**: 2025-10-29
**Severity**: Minor
**Category**: Code Organization - File Naming
**Affects**: Code navigation, developer experience, naming consistency

**Location**:
- **File(s)**: `src/validators/` directory
- **System**: Validation System
- **Context**: File naming conventions for validator components

**Description**:
The validators module uses inconsistent naming suffixes for files that serve similar purposes. While most files use the "Validator" suffix, some use "Handler", "Calculator", or descriptive names without suffixes. This creates confusion about file naming conventions and makes it harder to understand the purpose of files at a glance.

**Naming Patterns Found:**

**Pattern 1: "Validator" Suffix** (Most Common)
- BaselineGridValidator.ts
- CompositionPatternValidator.ts
- CrossPlatformConsistencyValidator.ts
- ErrorValidator.ts
- PassValidator.ts
- PrimitiveReferenceValidator.ts
- SemanticTokenValidator.ts
- SyntaxValidator.ts
- ThreeTierValidator.ts
- WarningValidator.ts

**Pattern 2: "Handler" Suffix**
- PlatformConstraintHandler.ts

**Pattern 3: "Calculator" Suffix**
- ToleranceCalculator.ts

**Pattern 4: Descriptive Name (No Suffix)**
- ValidationReasoning.ts

The inconsistency is particularly confusing because:
- PlatformConstraintHandler performs validation but uses "Handler" suffix
- ToleranceCalculator is used by validators but uses "Calculator" suffix
- ValidationReasoning provides validation logic but has no suffix

In contrast, other modules show consistent naming:
- **Providers**: All use platform prefix + function suffix (WebFormatGenerator, iOSUnitConverter)
- **Resolvers**: All use platform prefix + "ColorResolver" suffix
- **Tokens**: All use descriptive name + "Tokens" suffix

**Steps to Reproduce**:
1. List validator files: `ls -1 src/validators/ | grep -v "__tests__" | grep -v "index.ts"`
2. Observe: Mix of "Validator", "Handler", "Calculator", and no-suffix patterns
3. Compare with other modules:
   - Providers: Consistent suffix patterns
   - Resolvers: Consistent "ColorResolver" suffix
   - Tokens: Consistent "Tokens" suffix
4. Observe: Validators are the only module with inconsistent suffix patterns

**Expected Behavior**:
Consistent naming pattern for all validator-related files, such as:
- All validation components use "Validator" suffix
- Support utilities use descriptive suffixes ("Calculator", "Reasoning")
- Or establish clear guidelines for when to use each suffix

**Actual Behavior**:
Mixed naming patterns without clear guidelines:
- Most files use "Validator" suffix
- One file uses "Handler" suffix for validation functionality
- One file uses "Calculator" suffix for validation support
- One file has no suffix despite providing validation logic

**Evidence**:
```bash
# Validator directory file listing
$ ls -1 src/validators/ | grep -v "__tests__" | grep -v "index.ts"
BaselineGridValidator.ts          # "Validator" suffix
CompositionPatternValidator.ts    # "Validator" suffix
CrossPlatformConsistencyValidator.ts  # "Validator" suffix
ErrorValidator.ts                 # "Validator" suffix
PassValidator.ts                  # "Validator" suffix
PlatformConstraintHandler.ts      # "Handler" suffix (inconsistent)
PrimitiveReferenceValidator.ts    # "Validator" suffix
SemanticTokenValidator.ts         # "Validator" suffix
SyntaxValidator.ts                # "Validator" suffix
ThreeTierValidator.ts             # "Validator" suffix
ToleranceCalculator.ts            # "Calculator" suffix (inconsistent)
ValidationReasoning.ts            # No suffix (inconsistent)
WarningValidator.ts               # "Validator" suffix

# Compare with consistent naming in other modules
$ ls -1 src/providers/ | grep -v "__tests__" | grep -v "index.ts" | head -6
AndroidFileOrganizer.ts           # Platform + Function suffix
AndroidFormatGenerator.ts         # Platform + Function suffix
AndroidUnitConverter.ts           # Platform + Function suffix
FormatProvider.ts                 # Function + "Provider" suffix
PathProvider.ts                   # Function + "Provider" suffix
UnitProvider.ts                   # Function + "Provider" suffix

$ ls -1 src/resolvers/ | grep -v "__tests__" | grep -v "index.ts"
AndroidColorResolver.ts           # Platform + "ColorResolver" suffix
iOSColorResolver.ts               # Platform + "ColorResolver" suffix
ModeThemeResolver.ts              # Function + "Resolver" suffix
WebColorResolver.ts               # Platform + "ColorResolver" suffix
```

**Workaround**:
Understand that:
- Files ending in "Validator" perform validation
- PlatformConstraintHandler also performs validation despite different suffix
- ToleranceCalculator is a utility used by validators
- ValidationReasoning provides validation logic

Developers must learn these exceptions rather than relying on consistent naming.

**Cross-Area Impact**:
- Infrastructure: None - Does not affect build automation
- Architecture: Minor - Affects code organization and naming consistency
- Token System: None - Does not affect token functionality
- Documentation: None - Does not affect documentation

**Related Issues**:
- **Issue #016**: Validator System Lacks Common Interface
  - Related: Inconsistent naming compounds the lack of common interface
  - Both issues affect validator module organization and consistency

---

## Issue #021: Primitive→Semantic Reference Integrity Review - No Issues Found

**Discovered By**: Token System Discovery Audit
**Date Discovered**: 2025-10-29
**Severity**: None (Not an Issue)
**Category**: Reference Integrity - Validation Complete
**Affects**: N/A - All references valid

**Location**:
- **File(s)**: `src/tokens/semantic/ColorTokens.ts`, `src/tokens/semantic/TypographyTokens.ts`, `src/tokens/semantic/SpacingTokens.ts`, `src/tokens/semantic/OpacityTokens.ts`
- **System**: Token System - Semantic Token Layer
- **Context**: Primitive→semantic reference validation across all semantic token categories

**Description**:
Systematic review of all semantic token primitive references found no issues. All 69+ semantic tokens across color, typography, spacing, and opacity categories reference valid primitive tokens. No broken references, no circular references, no invalid references found.

This issue documents the completion of the reference integrity review with positive results, confirming that the token system maintains excellent reference integrity across all semantic token categories.

**Validation Performed**:
1. **Color Tokens**: Validated 18 semantic color tokens
   - All references to color primitives (purple300, violet300, cyan400, cyan100, yellow400, yellow100, orange300, teal400, teal100, gray300, gray200, gray100, white100, white200, purple500, cyan500, yellow500) exist in ColorTokens.ts
   - No broken references found

2. **Typography Tokens**: Validated 23 semantic typography tokens with multi-primitive composition
   - All fontSize references (fontSize050 through fontSize700) exist in FontSizeTokens.ts
   - All lineHeight references (lineHeight050 through lineHeight700) exist in LineHeightTokens.ts
   - All fontFamily references (fontFamilyBody, fontFamilyDisplay, fontFamilyMono) exist in FontFamilyTokens.ts
   - All fontWeight references (fontWeight300, fontWeight400, fontWeight500, fontWeight600, fontWeight700) exist in FontWeightTokens.ts
   - All letterSpacing references (letterSpacing100) exist in LetterSpacingTokens.ts
   - Total: 115 primitive references across 23 semantic tokens - all valid

3. **Spacing Tokens**: Validated hierarchical spacing structure
   - All layout spacing references (space025, space050, space100, space150, space200, space300, space400, space500, space600) exist in SpacingTokens.ts
   - All inset spacing references (space050, space100, space150, space200, space300) exist in SpacingTokens.ts
   - Hierarchical structure maintains reference integrity

4. **Opacity Tokens**: Validated 5 semantic opacity tokens
   - All references (opacity600, opacity400, opacity100, opacity200) exist in OpacityTokens.ts
   - No broken references found

5. **Circular Reference Check**:
   - No semantic→semantic references found
   - All semantic tokens reference primitives directly
   - No circular reference chains detected

**Steps to Reproduce**:
1. Review all semantic token files in `src/tokens/semantic/`
2. Extract all primitive references from `primitiveReferences` objects
3. Verify each primitive reference exists in corresponding primitive token file
4. Check for circular references between semantic tokens
5. Observe: All references valid, no broken references, no circular references

**Expected Behavior**:
All semantic tokens should reference valid primitive tokens with no broken references, no circular references, and proper reference chain resolution.

**Actual Behavior**:
All semantic tokens reference valid primitive tokens. Reference integrity is excellent across all token categories.

**Evidence**:
```typescript
// Example: Color semantic token with valid primitive reference
'color.primary': {
  name: 'color.primary',
  primitiveReferences: { value: 'purple300' }, // ✅ purple300 exists in ColorTokens.ts
  category: SemanticCategory.COLOR,
  // ...
}

// Example: Typography semantic token with valid multi-primitive references
'typography.bodyMd': {
  name: 'typography.bodyMd',
  primitiveReferences: {
    fontSize: 'fontSize100',        // ✅ Exists in FontSizeTokens.ts
    lineHeight: 'lineHeight100',    // ✅ Exists in LineHeightTokens.ts
    fontFamily: 'fontFamilyBody',   // ✅ Exists in FontFamilyTokens.ts
    fontWeight: 'fontWeight400',    // ✅ Exists in FontWeightTokens.ts
    letterSpacing: 'letterSpacing100' // ✅ Exists in LetterSpacingTokens.ts
  },
  // ...
}

// Example: Spacing semantic token with valid primitive reference
grouped: {
  normal: { value: 'space100' } // ✅ space100 exists in SpacingTokens.ts
}

// Example: Opacity semantic token with valid primitive reference
'opacity.disabled': {
  name: 'opacity.disabled',
  primitiveReferences: { value: 'opacity600' }, // ✅ opacity600 exists in OpacityTokens.ts
  // ...
}
```

**Validation Results Summary**:
- **Color Tokens**: 18/18 valid references (100%)
- **Typography Tokens**: 23/23 valid references, 115/115 total primitive references (100%)
- **Spacing Tokens**: All hierarchical references valid (100%)
- **Opacity Tokens**: 5/5 valid references (100%)
- **Circular References**: 0 found
- **Broken References**: 0 found
- **Invalid References**: 0 found

**Cross-Area Impact**:
- Infrastructure: None - This is a validation completion note
- Architecture: None - This is a validation completion note
- Token System: Positive - Confirms excellent reference integrity
- Documentation: None - This is a validation completion note

**Related Issues**:
None - This documents successful validation with no issues found

---



## Issue #021: Web CSS Color Tokens Output as JSON Objects Instead of Hex Values

**Discovered By**: Token System Discovery Audit
**Date Discovered**: 2025-10-29
**Severity**: Critical
**Category**: Generation Accuracy - Web Platform
**Affects**: Web token generation, CSS output, color token usability, cross-platform consistency

**Location**:
- **File(s)**: `src/providers/WebFormatGenerator.ts`, `output/DesignTokens.web.css`
- **System**: Token Generation System - Web Format Generator
- **Context**: Color token formatting in CSS custom properties

**Description**:
The Web format generator outputs color tokens as JSON objects instead of actual hex color values in the generated CSS file. Color tokens are being serialized as complete JSON objects with light/dark mode and base/wcag variants, making them unusable in CSS.

For example, instead of generating:
```css
--gray-100: #B8B6C8;
```

The generator outputs:
```css
--gray-100: {"light":{"base":"#B8B6C8","wcag":"#C2C0D4"},"dark":{"base":"#B8B6C8","wcag":"#C2C0D4"}};
```

This makes the color tokens completely unusable in CSS because browsers cannot parse JSON objects as color values. Any attempt to use these tokens (e.g., `color: var(--gray-100)`) will fail silently.

This is a critical issue because:
1. All color tokens in the web platform are broken
2. The generated CSS file cannot be used in production
3. Mathematical consistency cannot be verified when values are JSON objects
4. Cross-platform comparison is impossible when web colors are not actual colors

The issue appears to be in the WebFormatGenerator's formatToken method, which is calling `JSON.stringify()` on the color token value object instead of extracting the appropriate color hex value.

**Steps to Reproduce**:
1. Run token generation: `npx ts-node src/generators/generateTokenFiles.ts output`
2. Open generated file: `output/DesignTokens.web.css`
3. Search for color tokens (e.g., `--gray-100`)
4. Observe: Color value is JSON object instead of hex color
5. Attempt to use in CSS: `color: var(--gray-100);`
6. Observe: Browser cannot parse JSON object as color value

**Expected Behavior**:
Web color tokens should output actual hex color values that can be used in CSS:
```css
/* Light mode default */
--gray-100: #B8B6C8;
--gray-200: #68658A;
--gray-300: #2D2B3E;

/* Or with mode-specific values */
@media (prefers-color-scheme: light) {
  --gray-100: #B8B6C8;
}
@media (prefers-color-scheme: dark) {
  --gray-100: #B8B6C8; /* or dark mode variant */
}
```

**Actual Behavior**:
Web color tokens output complete JSON objects that cannot be parsed by browsers:
```css
--gray-100: {"light":{"base":"#B8B6C8","wcag":"#C2C0D4"},"dark":{"base":"#B8B6C8","wcag":"#C2C0D4"}};
--gray-200: {"light":{"base":"#68658A","wcag":"#8A879E"},"dark":{"base":"#68658A","wcag":"#8A879E"}};
--gray-300: {"light":{"base":"#2D2B3E","wcag":"#4D4A5C"},"dark":{"base":"#2D2B3E","wcag":"#4D4A5C"}};
```

**Evidence**:
```css
/* output/DesignTokens.web.css (lines 43-53) */
/* COLOR TOKENS */
/* Systematic gray scale progression - lightest */
--gray-100: {"light":{"base":"#B8B6C8","wcag":"#C2C0D4"},"dark":{"base":"#B8B6C8","wcag":"#C2C0D4"}};
/* Systematic gray scale progression - medium-light */
--gray-200: {"light":{"base":"#68658A","wcag":"#8A879E"},"dark":{"base":"#68658A","wcag":"#8A879E"}};
/* Systematic gray scale progression - medium */
--gray-300: {"light":{"base":"#2D2B3E","wcag":"#4D4A5C"},"dark":{"base":"#2D2B3E","wcag":"#4D4A5C"}};
/* Systematic gray scale progression - dark */
--gray-400: {"light":{"base":"#1F1D2E","wcag":"#2E2C3D"},"dark":{"base":"#1F1D2E","wcag":"#2E2C3D"}};
/* Systematic gray scale progression - darkest */
--gray-500: {"light":{"base":"#15131F","wcag":"#1A1826"},"dark":{"base":"#15131F","wcag":"#1A1826"}};
```

```typescript
// src/providers/WebFormatGenerator.ts - Likely issue location
// formatToken method probably doing JSON.stringify on color value object
// instead of extracting the appropriate hex value
```

**Workaround**:
None - the generated CSS file cannot be used. Manual post-processing would be required to extract hex values from JSON objects and replace them in the CSS file.

**Cross-Area Impact**:
- Infrastructure: None - Does not affect build automation
- Architecture: None - Does not affect code architecture
- Token System: Critical - Breaks web platform token generation completely
- Documentation: None - Does not affect documentation

**Related Issues**:
- **Issue #022**: iOS Color Tokens Use Placeholder Implementation
  - Both issues indicate color token generation is not working correctly across platforms
  - Suggests systematic issue with color token handling in format generators

---

## Issue #022: iOS Color Tokens Use Placeholder Implementation Instead of Actual Colors

**Discovered By**: Token System Discovery Audit
**Date Discovered**: 2025-10-29
**Severity**: Critical
**Category**: Generation Accuracy - iOS Platform
**Affects**: iOS token generation, Swift output, color token usability, cross-platform consistency

**Location**:
- **File(s)**: `src/providers/iOSFormatGenerator.ts`, `output/DesignTokens.ios.swift`
- **System**: Token Generation System - iOS Format Generator
- **Context**: Color token formatting in Swift constants

**Description**:
The iOS format generator outputs color tokens with placeholder implementations instead of actual UIColor values. All color tokens use the same placeholder comment `/* dynamic color implementation */` without providing the actual color values.

For example, instead of generating:
```swift
public static let gray100: UIColor = UIColor(red: 0.722, green: 0.714, blue: 0.784, alpha: 1.0)
```

The generator outputs:
```swift
public static let gray100: UIColor = UIColor { traitCollection in /* dynamic color implementation */ }
```

This makes the color tokens completely unusable in iOS applications because they don't return actual colors. Any attempt to use these tokens will result in runtime errors or undefined behavior.

This is a critical issue because:
1. All color tokens in the iOS platform are broken
2. The generated Swift file cannot be used in production
3. Mathematical consistency cannot be verified when values are placeholders
4. Cross-platform comparison is impossible when iOS colors are not actual colors

The issue appears to be in the iOSFormatGenerator's formatToken method, which is generating placeholder UIColor closures instead of implementing the actual color values from the token definitions.

**Steps to Reproduce**:
1. Run token generation: `npx ts-node src/generators/generateTokenFiles.ts output`
2. Open generated file: `output/DesignTokens.ios.swift`
3. Search for color tokens (e.g., `gray100`)
4. Observe: Color value is placeholder closure instead of actual UIColor
5. Attempt to use in Swift: `view.backgroundColor = DesignTokens.gray100`
6. Observe: Placeholder implementation does not return actual color

**Expected Behavior**:
iOS color tokens should output actual UIColor values with proper RGB/hex values:
```swift
// Simple implementation
public static let gray100: UIColor = UIColor(red: 0.722, green: 0.714, blue: 0.784, alpha: 1.0)

// Or with dynamic color for light/dark mode
public static let gray100: UIColor = UIColor { traitCollection in
    if traitCollection.userInterfaceStyle == .dark {
        return UIColor(red: 0.722, green: 0.714, blue: 0.784, alpha: 1.0)
    } else {
        return UIColor(red: 0.722, green: 0.714, blue: 0.784, alpha: 1.0)
    }
}
```

**Actual Behavior**:
iOS color tokens output placeholder closures that don't implement actual colors:
```swift
/// Systematic gray scale progression - lightest
public static let gray100: UIColor = UIColor { traitCollection in /* dynamic color implementation */ }
/// Systematic gray scale progression - medium-light
public static let gray200: UIColor = UIColor { traitCollection in /* dynamic color implementation */ }
/// Systematic gray scale progression - medium
public static let gray300: UIColor = UIColor { traitCollection in /* dynamic color implementation */ }
```

**Evidence**:
```swift
// output/DesignTokens.ios.swift (lines 35-55)
// MARK: - COLOR TOKENS
/// Systematic gray scale progression - lightest
public static let gray100: UIColor = UIColor { traitCollection in /* dynamic color implementation */ }
/// Systematic gray scale progression - medium-light
public static let gray200: UIColor = UIColor { traitCollection in /* dynamic color implementation */ }
/// Systematic gray scale progression - medium
public static let gray300: UIColor = UIColor { traitCollection in /* dynamic color implementation */ }
/// Systematic gray scale progression - dark
public static let gray400: UIColor = UIColor { traitCollection in /* dynamic color implementation */ }
/// Systematic gray scale progression - darkest
public static let gray500: UIColor = UIColor { traitCollection in /* dynamic color implementation */ }
/// Systematic black scale progression - lightest
public static let black100: UIColor = UIColor { traitCollection in /* dynamic color implementation */ }
/// Systematic black scale progression - medium
public static let black200: UIColor = UIColor { traitCollection in /* dynamic color implementation */ }
/// Systematic black scale progression - dark
public static let black300: UIColor = UIColor { traitCollection in /* dynamic color implementation */ }
```

```typescript
// src/providers/iOSFormatGenerator.ts - Likely issue location
// formatToken method probably generating placeholder closure
// instead of implementing actual UIColor with RGB values
```

**Workaround**:
None - the generated Swift file cannot be used. Manual implementation of all color tokens would be required.

**Cross-Area Impact**:
- Infrastructure: None - Does not affect build automation
- Architecture: None - Does not affect code architecture
- Token System: Critical - Breaks iOS platform token generation completely
- Documentation: None - Does not affect documentation

**Related Issues**:
- **Issue #021**: Web CSS Color Tokens Output as JSON Objects
  - Both issues indicate color token generation is not working correctly across platforms
  - Suggests systematic issue with color token handling in format generators
- **Issue #010**: Z-Index Token Handling Inconsistency Across Platforms
  - Another cross-platform generation issue affecting layering tokens

---


## Issue #028: No Validation for Color Token Mathematical Relationships

**Discovered By**: Token System Discovery Audit (Task 4.4)
**Severity**: Important
**Category**: Validation Coverage Gap
**Affects**: Color tokens validation

**Location**:
- **System**: Validation System
- **Context**: Color tokens have no mathematical validation despite having `mathematicalRelationship` field

**Description**:
Color tokens define `mathematicalRelationship` fields (e.g., "Systematic gray scale progression - lightest") but there is no validator that checks whether these relationships are actually maintained. Unlike spacing or fontSize tokens which have BaselineGridValidator and mathematical progression validation, color tokens have no equivalent validation.

**Steps to Reproduce**:
1. Review ColorTokens.ts - all tokens have `mathematicalRelationship` field
2. Review validators directory - no ColorValidator exists
3. Check ThreeTierValidator - no color-specific validation logic
4. Observe: Color tokens can be modified without any validation of their systematic progression

**Expected Behavior**:
Color tokens should have validation that:
- Verifies systematic progression within color families (gray100-500, purple100-500, etc.)
- Validates mode/theme consistency (light/dark, base/wcag)
- Checks that color relationships maintain intended contrast ratios
- Ensures WCAG theme variants meet accessibility requirements

**Actual Behavior**:
No validation exists for color token mathematical relationships or systematic progression.

**Evidence**:
```typescript
// src/tokens/ColorTokens.ts
export const grayTokens = {
  gray100: {
    mathematicalRelationship: 'Systematic gray scale progression - lightest',
    // ... but no validator checks this
  },
  gray200: {
    mathematicalRelationship: 'Systematic gray scale progression - medium-light',
    // ... no validation of progression
  }
};
```

```bash
# No ColorValidator exists
$ ls src/validators/
BaselineGridValidator.ts
CompositionPatternValidator.ts
CrossPlatformConsistencyValidator.ts
ErrorValidator.ts
# ... no ColorValidator.ts
```

**Workaround**:
Manual review of color token changes required.

**Cross-Area Impact**:
- Infrastructure: None
- Architecture: None
- Token System: Important - Color tokens lack validation coverage
- Documentation: None

**Related Issues**:
None

---

## Issue #029: No Validation for Shadow/Glow Token Composition

**Discovered By**: Token System Discovery Audit (Task 4.4)
**Severity**: Important
**Category**: Validation Coverage Gap
**Affects**: Shadow and Glow token validation

**Location**:
- **System**: Validation System
- **Context**: Shadow and glow tokens have no composition validation

**Description**:
Shadow and glow effects require multiple tokens to work together (blur + offset + opacity for shadows, blur + opacity for glows). There is no validator that checks whether these token combinations are valid or whether they follow the intended composition patterns.

**Steps to Reproduce**:
1. Review shadow token files: ShadowBlurTokens.ts, ShadowOffsetTokens.ts, ShadowOpacityTokens.ts
2. Review glow token files: GlowBlurTokens.ts, GlowOpacityTokens.ts
3. Check validators directory - no ShadowValidator or GlowValidator exists
4. Check CompositionPatternValidator - only validates semantic token structure, not shadow/glow composition
5. Observe: Shadow/glow tokens can be used in invalid combinations without validation

**Expected Behavior**:
Shadow and glow tokens should have validation that:
- Verifies shadow compositions include required tokens (blur + offset + opacity)
- Validates glow compositions include required tokens (blur + opacity)
- Checks that token combinations follow intended patterns (e.g., shadowBlurHard with shadowOpacityHard)
- Ensures depth-based tokens are used consistently (shadowBlurDepth200 with appropriate offset)

**Actual Behavior**:
No validation exists for shadow/glow token composition patterns.

**Evidence**:
```typescript
// src/tokens/ShadowBlurTokens.ts
export const shadowBlur: Record<string, PrimitiveToken> = {
  shadowBlurHard: { /* ... */ },
  shadowBlurModerate: { /* ... */ },
  shadowBlurSoft: { /* ... */ },
  shadowBlurDepth200: { /* ... */ },
  shadowBlurDepth300: { /* ... */ }
};

// src/tokens/ShadowOffsetTokens.ts
export const shadowOffsetX: Record<string, PrimitiveToken> = {
  n300: { /* ... */ },
  // ... multiple offset tokens
};

// No validator checks that these are used together correctly
```

```bash
# No ShadowValidator or GlowValidator exists
$ ls src/validators/ | grep -i shadow
# (no results)
$ ls src/validators/ | grep -i glow
# (no results)
```

**Workaround**:
Manual review of shadow/glow token usage required.

**Cross-Area Impact**:
- Infrastructure: None
- Architecture: None
- Token System: Important - Shadow/glow tokens lack composition validation
- Documentation: None

**Related Issues**:
None

---

## Issue #030: No Validation for Typography Token Composition

**Discovered By**: Token System Discovery Audit (Task 4.4)
**Severity**: Important
**Category**: Validation Coverage Gap
**Affects**: Typography token validation

**Location**:
- **System**: Validation System
- **Context**: Typography tokens require multiple primitives but composition validation is incomplete

**Description**:
Typography tokens compose multiple primitive tokens (fontSize, lineHeight, fontWeight, fontFamily, letterSpacing) but validation only checks that primitive references exist, not that the composition makes typographic sense. For example, no validation ensures lineHeight is appropriate for the fontSize, or that letterSpacing values are reasonable for the font size.

**Steps to Reproduce**:
1. Review semantic typography tokens (if they exist)
2. Check SemanticTokenValidator - validates primitive references exist but not composition logic
3. Check CompositionPatternValidator - validates structure but not typographic relationships
4. Observe: Typography tokens can have invalid compositions (e.g., tiny lineHeight for large fontSize)

**Expected Behavior**:
Typography token validation should:
- Verify lineHeight is appropriate for fontSize (typically 1.2-1.8x fontSize)
- Check that letterSpacing is reasonable for fontSize
- Validate fontWeight is appropriate for fontFamily
- Ensure typography compositions follow typographic best practices

**Actual Behavior**:
Validation only checks that primitive references exist, not that the composition is typographically sound.

**Evidence**:
```typescript
// src/validators/SemanticTokenValidator.ts
// Only validates that primitive references exist:
const primitiveToken = this.primitiveRegistry.get(reference);
if (!primitiveToken) {
  invalidReferences.push(`${key}: ${reference}`);
}
// Does NOT validate that fontSize + lineHeight combination makes sense
```

```typescript
// src/validators/CompositionPatternValidator.ts
// Only validates structure, not typographic relationships
private validateSemanticStructure(semanticToken: SemanticToken): ValidationResult {
  // Checks for required fields but not typographic logic
}
```

**Workaround**:
Manual review of typography token compositions required.

**Cross-Area Impact**:
- Infrastructure: None
- Architecture: None
- Token System: Important - Typography tokens lack composition validation
- Documentation: None

**Related Issues**:
None

---

## Issue #031: No Validation for Density Token Application

**Discovered By**: Token System Discovery Audit (Task 4.4)
**Severity**: Minor
**Category**: Validation Coverage Gap
**Affects**: Density token validation

**Location**:
- **System**: Validation System
- **Context**: Density tokens have no validation for appropriate application

**Description**:
Density tokens (densityCompact, densityStandard, densityComfortable) are designed for selective application to functional tokens, but there is no validation that checks whether density tokens are being applied appropriately or consistently.

**Steps to Reproduce**:
1. Review DensityTokens.ts - tokens exist with descriptions of intended use
2. Check validators directory - no DensityValidator exists
3. Observe: No validation ensures density tokens are applied to appropriate token types
4. Observe: No validation checks for consistent density application across related tokens

**Expected Behavior**:
Density token validation should:
- Verify density tokens are applied to appropriate token types (spacing, tap areas, etc.)
- Check for consistent density application across related tokens
- Validate that density multipliers are applied correctly
- Ensure density tokens don't conflict with baseline grid alignment

**Actual Behavior**:
No validation exists for density token application.

**Evidence**:
```typescript
// src/tokens/DensityTokens.ts
export const densityTokens: Record<string, PrimitiveToken> = {
  densityCompact: {
    description: 'Compact density - 0.75x multiplier for functional tokens',
    // ... but no validator checks appropriate application
  }
};
```

```bash
# No DensityValidator exists
$ ls src/validators/ | grep -i density
# (no results)
```

**Workaround**:
Manual review of density token application required.

**Cross-Area Impact**:
- Infrastructure: None
- Architecture: None
- Token System: Minor - Density tokens lack application validation
- Documentation: None

**Related Issues**:
None

---

## Issue #032: No Validation for Blend Token Direction and Composition

**Discovered By**: Token System Discovery Audit (Task 4.4)
**Severity**: Minor
**Category**: Validation Coverage Gap
**Affects**: Blend token validation

**Location**:
- **System**: Validation System
- **Context**: Blend tokens have no validation for direction or composition

**Description**:
Blend tokens define blend directions (darker, lighter, saturate, desaturate) but there is no validation that checks whether blend tokens are being used with appropriate directions or in valid compositions. The BlendDirection enum exists but is not enforced by any validator.

**Steps to Reproduce**:
1. Review BlendTokens.ts - defines BlendDirection enum and blend tokens
2. Check validators directory - no BlendValidator exists
3. Check for usage of BlendDirection enum in validators - not used
4. Observe: Blend tokens can be used without specifying direction or with invalid directions

**Expected Behavior**:
Blend token validation should:
- Verify blend direction is specified when blend tokens are used
- Check that blend direction is one of the valid BlendDirection enum values
- Validate blend token + direction combinations make sense
- Ensure blend compositions follow intended patterns

**Actual Behavior**:
No validation exists for blend token direction or composition.

**Evidence**:
```typescript
// src/tokens/BlendTokens.ts
export enum BlendDirection {
  DARKER = 'darker',
  LIGHTER = 'lighter',
  SATURATE = 'saturate',
  DESATURATE = 'desaturate'
}
// Enum defined but not enforced by any validator
```

```bash
# No BlendValidator exists
$ ls src/validators/ | grep -i blend
# (no results)

# BlendDirection enum not used in validators
$ grep -r "BlendDirection" src/validators/
# (no results)
```

**Workaround**:
Manual review of blend token usage and direction specification required.

**Cross-Area Impact**:
- Infrastructure: None
- Architecture: None
- Token System: Minor - Blend tokens lack direction validation
- Documentation: None

**Related Issues**:
None

---

## Issue #033: Validation Rules Not Enforced for Invalid Tokens

**Discovered By**: Token System Discovery Audit (Task 4.4)
**Severity**: Important
**Category**: Validation Enforcement Gap
**Affects**: All token types

**Location**:
- **System**: Validation System
- **Context**: Validation rules exist but are not automatically enforced during token creation/modification

**Description**:
While validators exist (BaselineGridValidator, SemanticTokenValidator, etc.), there is no automatic enforcement mechanism that runs validation when tokens are created or modified. Developers must manually call validators, which means invalid tokens can be created and used without triggering validation errors.

**Steps to Reproduce**:
1. Create a new spacing token with value 7 (violates baseline grid)
2. Add token to spacingTokens object
3. Observe: No validation error occurs automatically
4. Token can be used in generation without validation
5. Only manual validator calls would catch the issue

**Expected Behavior**:
Validation should be automatically enforced:
- When tokens are registered in PrimitiveTokenRegistry
- When semantic tokens are created in SemanticTokenRegistry
- During token generation process
- With clear error messages preventing invalid token usage

**Actual Behavior**:
Validation is opt-in and must be manually invoked. Invalid tokens can be created and used without triggering validation.

**Evidence**:
```typescript
// src/registries/PrimitiveTokenRegistry.ts
register(token: PrimitiveToken): void {
  this.tokens.set(token.name, token);
  // No validation called here - invalid tokens can be registered
}
```

```typescript
// src/registries/SemanticTokenRegistry.ts
register(token: SemanticToken): void {
  this.tokens.set(token.name, token);
  // No validation called here either
}
```

```typescript
// Validators must be manually invoked:
const validator = new BaselineGridValidator();
const result = validator.validate(value, tokenName);
// Developer must remember to call this
```

**Workaround**:
Manually call validators before registering tokens or during code review.

**Cross-Area Impact**:
- Infrastructure: None
- Architecture: Important - Validation not integrated into token lifecycle
- Token System: Important - Invalid tokens can be created without errors
- Documentation: None

**Related Issues**:
None

---

## Issue #034: No Test Coverage for Validation System Completeness

**Discovered By**: Token System Discovery Audit (Task 4.4)
**Severity**: Important
**Category**: Testing Gap
**Affects**: Validation system testing

**Location**:
- **System**: Testing Infrastructure
- **Context**: No tests verify that all token types have appropriate validation coverage

**Description**:
While individual validators have unit tests, there are no integration tests that verify all token types have appropriate validation coverage. This means new token types can be added without validation, and validation gaps can go undetected.

**Steps to Reproduce**:
1. Review test files in src/validators/__tests__/
2. Observe: Tests exist for individual validators (BaselineGridValidator.test.ts, etc.)
3. Observe: No test file validates that all token types have appropriate validators
4. Observe: No test ensures validation coverage is complete across all token categories
5. Add a new token type - no test fails to indicate missing validation

**Expected Behavior**:
Test suite should include:
- Integration test that checks all token types have appropriate validators
- Test that verifies validation coverage for each TokenCategory
- Test that ensures new token types trigger validation coverage checks
- Automated detection of validation gaps

**Actual Behavior**:
No tests verify validation system completeness. Validation gaps can exist without test failures.

**Evidence**:
```bash
# Existing validator tests
$ ls src/validators/__tests__/
BaselineGridValidator.test.ts
BorderWidthValidation.test.ts
CompositionPatterns.test.ts
CrossPlatformConsistency.test.ts
PlatformConstraints.test.ts
SemanticTokenValidator.test.ts
SyntaxValidator.test.ts
ThreeTierValidator.test.ts
ValidationReasoning.test.ts

# No ValidationCoverage.test.ts or similar
$ ls src/validators/__tests__/ | grep -i coverage
# (no results)
```

```typescript
// No test like this exists:
describe('Validation Coverage', () => {
  it('should have validators for all token categories', () => {
    const categories = Object.values(TokenCategory);
    categories.forEach(category => {
      expect(hasValidatorFor(category)).toBe(true);
    });
  });
});
```

**Workaround**:
Manual audit of validation coverage (like this task).

**Cross-Area Impact**:
- Infrastructure: None
- Architecture: None
- Token System: Important - Validation gaps can go undetected
- Documentation: None

**Related Issues**:
- **Issue #028**: No Validation for Color Token Mathematical Relationships
- **Issue #029**: No Validation for Shadow/Glow Token Composition
- **Issue #030**: No Validation for Typography Token Composition
- **Issue #031**: No Validation for Density Token Application
- **Issue #032**: No Validation for Blend Token Direction and Composition

---


## Issue #035: Cross-Reference Integrity Issues Across Phase 1 Documentation

**Discovered By**: Documentation Discovery Audit (Task 5.2)
**Date Discovered**: 2025-10-29
**Severity**: Important
**Category**: Cross-Reference Integrity
**Affects**: Phase 1 documentation navigation, completion document links, guide discoverability

**Location**:
- **File(s)**: Multiple files across all Phase 1 specs (see detailed analysis)
- **System**: Documentation System - Cross-Reference Links
- **Context**: Markdown links in Phase 1 spec documentation

**Description**:
Systematic testing of cross-reference integrity across all Phase 1 documentation revealed 27 broken links and 232 orphaned files (files with no incoming references). The broken links fall into several patterns:

1. **Incorrect Relative Paths** (9 instances): Completion documents use paths like `../.kiro/specs/` or `../../../docs/` that resolve incorrectly
2. **Missing Guide Files** (3 instances): References to guide files that don't exist (e.g., `spacing-tokens-guide.md`)
3. **Missing Source Files** (5 instances): Links to source code files that may have been moved or renamed
4. **Missing Platform Generators** (5 instances): References to shadow/glow platform generator files that don't exist
5. **Missing Documentation Files** (5 instances): Links to docs with incorrect paths
6. **Missing Demo Files** (1 instance): Reference to demo HTML file
7. **Missing Pattern Guides** (1 instance): Reference to token category pattern guide
8. **Missing Completion Docs** (1 instance): Reference to non-existent completion document

The 232 orphaned files are primarily completion documents (which are intentionally terminal nodes) and spec-specific guides that aren't linked from main spec documents.

**Steps to Reproduce**:
1. Run cross-reference integrity test: `python3 .kiro/audits/cross-reference-test.py`
2. Observe: 27 broken links reported
3. Observe: 232 orphaned files reported
4. Review detailed analysis: `.kiro/audits/phase-1-cross-reference-issues.md`

**Expected Behavior**:
All markdown links in Phase 1 documentation should resolve to existing files with correct relative paths. Guide documents and completion documents should be discoverable through navigation from main spec documents.

**Actual Behavior**:
- 27 links (18% of 149 total links) point to non-existent files or use incorrect paths
- 232 files have no incoming references, reducing discoverability
- Completion documents cannot reference source code, documentation, or other completion docs
- Guide documents are not linked from main spec documents

**Evidence**:
```bash
# Cross-reference test results
$ python3 .kiro/audits/cross-reference-test.py
📊 Cross-Reference Test Results
================================
Total links tested: 149
✅ Valid links: 122
❌ Broken links: 27

❌ Broken Links Found:
========================================
  - .kiro/specs/border-width-tokens/usage-patterns-guide.md -> ../mathematical-token-system/spacing-tokens-guide.md (TARGET NOT FOUND)
  - .kiro/specs/border-width-tokens/completion/task-2-fix-4-completion.md -> ../.kiro/specs/token-system/token-category-pattern-guide.md (TARGET NOT FOUND)
  - .kiro/specs/layering-token-system/completion/task-6-completion.md -> ../../docs/tokens/layering-tokens.md (TARGET NOT FOUND)
  # ... 24 more broken links

⚠️  Orphaned Files (no incoming references):
========================================
  - 232 files with no incoming references
  # Primarily completion documents and guides
```

**Detailed Analysis**:
See `.kiro/audits/phase-1-cross-reference-issues.md` for complete breakdown of:
- All 27 broken links categorized by pattern
- Analysis of 232 orphaned files by spec
- Impact assessment for each pattern
- Recommendations for fixes

**Workaround**:
Manually navigate to files using file system or search rather than following links. For completion documents, reference the tasks.md file to find related completion docs.

**Cross-Area Impact**:
- Infrastructure: None - Does not affect automation systems
- Architecture: None - Does not affect code architecture
- Token System: None - Does not affect token generation
- Documentation: Important - Significantly affects documentation navigation and discoverability

**Related Issues**:
None - New issue discovered during cross-reference integrity review

---

## Issue #036: Two Phase 1 Specs Missing Design Decisions Sections

**Discovered By**: Documentation Discovery Audit (Task 5.3)
**Date Discovered**: 2025-10-29
**Severity**: Important
**Category**: Documentation Completeness - Design Decision Documentation
**Affects**: Design documentation quality, architectural decision tracking, future maintainability

**Location**:
- **File(s)**: `.kiro/specs/mathematical-token-system/design.md`, `.kiro/specs/fresh-repository-roadmap-refinement/design.md`
- **System**: Documentation System - Design Documents
- **Context**: Design decision documentation in Phase 1 spec design documents

**Description**:
Two Phase 1 specs are missing "Design Decisions" sections in their design documents: mathematical-token-system and fresh-repository-roadmap-refinement. All other Phase 1 specs (13 out of 15 reviewed) include comprehensive Design Decisions sections with options considered, rationale, trade-offs, and counter-arguments.

The Spec Planning Standards require design documents to include a "Design Decisions" section that documents:
- Options considered for each major decision
- Chosen approach with detailed rationale
- Trade-offs and what was given up
- Counter-arguments and why they were rejected

These two specs are foundational to the entire system:
- **mathematical-token-system**: Establishes the mathematical foundation for all token types
- **fresh-repository-roadmap-refinement**: Defines the strategic framework and north star vision

The absence of documented design decisions makes it difficult to understand why specific architectural choices were made, what alternatives were considered, and what trade-offs were accepted. This is particularly problematic for foundational specs where design decisions have cascading effects on all subsequent work.

**Steps to Reproduce**:
1. Search for "Design Decisions" in all Phase 1 design documents:
   ```bash
   grep -l "Design Decisions" .kiro/specs/*/design.md
   ```
2. Observe: 13 specs have Design Decisions sections
3. Check mathematical-token-system design document:
   ```bash
   grep "Design Decisions" .kiro/specs/mathematical-token-system/design.md
   ```
4. Observe: No Design Decisions section found
5. Check fresh-repository-roadmap-refinement design document:
   ```bash
   grep "Design Decisions" .kiro/specs/fresh-repository-roadmap-refinement/design.md
   ```
6. Observe: No Design Decisions section found

**Expected Behavior**:
All Phase 1 design documents should include a "Design Decisions" section that documents:
- Major architectural decisions made during design
- Options considered for each decision
- Rationale for chosen approach
- Trade-offs accepted
- Counter-arguments and responses

**Actual Behavior**:
Two foundational specs (mathematical-token-system and fresh-repository-roadmap-refinement) have design documents without Design Decisions sections. The documents include Overview, Architecture, Components, Data Models, Error Handling, and Testing Strategy sections, but do not explicitly document design decisions with alternatives and rationale.

**Evidence**:
```bash
# Specs WITH Design Decisions sections (13 specs)
$ grep -l "Design Decisions" .kiro/specs/*/design.md
.kiro/specs/afternoon-to-dusk-rename/design.md
.kiro/specs/blend-tokens/design.md
.kiro/specs/border-width-tokens/design.md
.kiro/specs/cross-platform-build-system/design.md
.kiro/specs/cross-reference-integration/design.md
.kiro/specs/layering-token-system/design.md
.kiro/specs/opacity-tokens/design.md
.kiro/specs/phase-1-discovery-audit/design.md
.kiro/specs/primitive-token-formula-standardization/design.md
.kiro/specs/release-analysis-system/design.md
.kiro/specs/release-management-system/design.md
.kiro/specs/semantic-token-generation/design.md
.kiro/specs/shadow-glow-token-system/design.md
.kiro/specs/spec-standards-refinement/design.md
.kiro/specs/typography-token-expansion/design.md

# Specs WITHOUT Design Decisions sections (2 specs)
$ grep "Design Decisions" .kiro/specs/mathematical-token-system/design.md
# (no output - section missing)

$ grep "Design Decisions" .kiro/specs/fresh-repository-roadmap-refinement/design.md
# (no output - section missing)
```

```markdown
<!-- .kiro/specs/mathematical-token-system/design.md - Section headings -->
## Overview
## Architecture
## Components and Interfaces
## Data Models
## Error Handling
## Testing Strategy
<!-- No "Design Decisions" section -->
```

```markdown
<!-- .kiro/specs/fresh-repository-roadmap-refinement/design.md - Section headings -->
## Overview
## Architecture
## Components and Interfaces
## Data Models
## Error Handling
## Testing Strategy
## Implementation Considerations
<!-- No "Design Decisions" section -->
```

**Examples of Missing Decision Documentation**:

**mathematical-token-system** - Undocumented decisions:
- Why use business localization model vs other architectural patterns?
- Why two-layer architecture (primitive + semantic) vs single layer?
- Why per-family base values vs single global base value?
- Why unitless tokens vs platform-specific units in definitions?
- Why hierarchical spacing semantic tokens vs flat structure?
- What alternatives were considered for each of these decisions?
- What trade-offs were accepted?

**fresh-repository-roadmap-refinement** - Undocumented decisions:
- Why strategic framework approach vs other planning methodologies?
- Why north star vision vs other goal-setting approaches?
- Why supporting systems catalog vs other system organization methods?
- Why knowledge gaps register vs other uncertainty tracking approaches?
- What alternatives were considered?
- What trade-offs were accepted?

**Workaround**:
Infer design decisions from:
- Implementation details in the design document
- Preserved knowledge documents (e.g., `preserved-knowledge/token-architecture-2-0-mathematics.md`)
- Completion documents that may reference design decisions
- Code comments and implementation patterns

However, this requires significant effort and may not capture all alternatives considered or trade-offs accepted.

**Cross-Area Impact**:
- Infrastructure: None - Does not affect automation systems
- Architecture: Important - Missing documentation of foundational architectural decisions
- Token System: Important - Missing documentation of mathematical token system design rationale
- Documentation: Important - Reduces documentation completeness and future maintainability

**Related Issues**:
None - New issue discovered during design decision documentation review

---


## Issue #037: Cross-Platform Build System Design-Implementation Architectural Drift

**Discovered By**: Documentation Discovery Audit
**Date Discovered**: 2025-10-29
**Severity**: Important
**Category**: Spec Drift - Architectural Naming
**Affects**: Cross-platform build system understanding, developer onboarding, documentation accuracy

**Location**:
- **File(s)**: `.kiro/specs/cross-platform-build-system/design.md` (Architecture section), `src/build/`, `src/providers/`
- **System**: Cross-Platform Build System
- **Context**: Design document describes architecture that differs from actual implementation

**Description**:
The cross-platform-build-system design document describes an architecture with separate "iOS Builder", "Android Builder", and "Web Builder" classes, but the actual implementation uses "Format Generators" (`iOSFormatGenerator`, `AndroidFormatGenerator`, `WebFormatGenerator`) instead. This creates a disconnect between the design documentation and the actual codebase organization.

The design document states:
```
┌───────▼────────┐   ┌────────▼───────┐   ┌─────▼──────────┐
│  iOS Builder   │   │ Android Builder│   │  Web Builder   │
│  Swift Package │   │  AAR/Gradle    │   │  NPM Package   │
└───────┬────────┘   └────────┬───────┘   └─────┬──────────┘
```

But the actual implementation has:
- `src/providers/iOSFormatGenerator.ts` - Generates iOS Swift format
- `src/providers/AndroidFormatGenerator.ts` - Generates Android Kotlin format
- `src/providers/WebFormatGenerator.ts` - Generates Web CSS/JS format

The functionality exists and works correctly, but the architectural organization and naming differs from what the design document describes. This creates confusion when:
1. New developers read the design document and look for "Builder" classes
2. Existing developers try to understand the relationship between design and implementation
3. Documentation references need to map design concepts to actual code

Additionally, the design describes an "Interface Validation Layer" for "Cross-platform API contract validation" and "Type checking and signature matching", but this component-level interface validation is not implemented. The validation system focuses on token validation, not component interface validation.

**Steps to Reproduce**:
1. Read `.kiro/specs/cross-platform-build-system/design.md` Architecture section
2. Note references to "iOS Builder", "Android Builder", "Web Builder"
3. Search codebase for these classes: `grep -r "class.*Builder" src/`
4. Observe: No Builder classes found
5. Search for format generators: `grep -r "class.*FormatGenerator" src/`
6. Observe: Format generator classes exist instead
7. Read design section on "Interface Validation Layer"
8. Search for component interface validation: `grep -r "interface.*validation" src/`
9. Observe: Token validation exists, but not component interface validation

**Expected Behavior**:
Design document should accurately describe the actual implementation architecture:
- Use "Format Generator" terminology to match implementation
- Describe actual component organization (providers vs builders)
- Document what was implemented vs what was planned
- Note if "Interface Validation Layer" is future work or not implemented

**Actual Behavior**:
Design document describes architecture that differs from implementation:
- Uses "Builder" terminology when implementation uses "Generator"
- Describes component organization that doesn't match actual code
- Describes "Interface Validation Layer" that isn't implemented
- Creates disconnect between design and reality

**Evidence**:
```markdown
<!-- .kiro/specs/cross-platform-build-system/design.md (lines 30-40) -->
## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Build Orchestrator                        │
│  - Platform selection (iOS/Android/Web)                     │
│  - Build configuration management                            │
│  - Parallel/sequential build execution                       │
└──────────────────┬──────────────────────────────────────────┘
                   │
        ┌──────────┴──────────┬──────────────────┐
        │                     │                   │
┌───────▼────────┐   ┌────────▼───────┐   ┌─────▼──────────┐
│  iOS Builder   │   │ Android Builder│   │  Web Builder   │
│  Swift Package │   │  AAR/Gradle    │   │  NPM Package   │
└───────┬────────┘   └────────┬───────┘   └─────┬──────────┘
```

<!-- Design describes "Interface Validation Layer" -->
┌──────────▼──────────────────────────────────────────┐
│        Interface Validation Layer                    │
│  - Cross-platform API contract validation           │
│  - Type checking and signature matching             │
│  - Behavioral consistency verification              │
└─────────────────────────────────────────────────────┘
```

```bash
# Actual implementation - No Builder classes
$ find src -name "*Builder*"
# (no results)

# Actual implementation - Format Generator classes exist
$ find src -name "*FormatGenerator*"
src/providers/AndroidFormatGenerator.ts
src/providers/iOSFormatGenerator.ts
src/providers/WebFormatGenerator.ts

# Actual implementation - No component interface validation
$ grep -r "interface.*validation" src/ | grep -v token
# (no results for component interface validation)
```

```typescript
// src/providers/iOSFormatGenerator.ts
// Actual implementation uses "FormatGenerator" not "Builder"
export class iOSFormatGenerator extends BaseFormatProvider {
  readonly platform: TargetPlatform = 'ios';
  readonly formats: OutputFormat[] = ['swift'];
  
  // Generates iOS Swift format, not a "Builder"
  generateSwift(tokens: PrimitiveToken[]): string {
    // ...
  }
}
```

**Comparison Table**:

| Design Document | Actual Implementation | Status |
|-----------------|----------------------|--------|
| iOS Builder | iOSFormatGenerator | Different naming |
| Android Builder | AndroidFormatGenerator | Different naming |
| Web Builder | WebFormatGenerator | Different naming |
| Interface Validation Layer | Not implemented | Missing feature |
| Token Integration Layer | TokenFileGenerator | Implemented |
| Build Orchestrator | BuildOrchestrator | Implemented |

**Workaround**:
Developers must:
1. Read design document for conceptual understanding
2. Explore codebase to find actual implementation
3. Map design concepts to actual code organization
4. Understand that "Builder" in design means "FormatGenerator" in code
5. Recognize that "Interface Validation Layer" is not implemented

**Cross-Area Impact**:
- Infrastructure: None - Build system works correctly despite naming differences
- Architecture: Important - Design document doesn't accurately describe architecture
- Token System: None - Token generation works correctly
- Documentation: Important - Creates confusion between design and implementation

**Related Issues**:
None - New issue discovered during spec-to-implementation drift review

**Drift Analysis Reference**:
See `.kiro/audits/phase-1-spec-drift-analysis.md` for complete drift analysis across all Phase 1 specs. This issue represents the most significant architectural drift found in Phase 1 specs.

---
