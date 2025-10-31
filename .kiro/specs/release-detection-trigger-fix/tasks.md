# Implementation Plan: Release Detection Trigger Fix

**Date**: October 30, 2025
**Spec**: release-detection-trigger-fix
**Status**: Implementation Planning
**Dependencies**: infrastructure-automation-fixes

---

## Implementation Plan

This implementation plan converts the design into actionable tasks for fixing release detection automation. The solution creates lightweight summary documents in `docs/specs/[spec-name]/` that trigger hooks, while keeping detailed completion documentation in `.kiro/` unchanged.

**Key Approach**:
- Update Spec Planning Standards to include summary document workflow
- Create hook configurations using validated format from testing
- Update documentation to reflect new workflow
- Validate with test files

---

## Task List

- [x] 1. Update Spec Planning Standards with Summary Document Workflow

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Spec Planning Standards updated with summary document section and format template
  - Task format examples show both detailed and summary documentation
  - Clear distinction between internal (detailed) and public (summary) documentation
  
  **Primary Artifacts:**
  - `.kiro/steering/Spec Planning Standards.md` (updated)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/release-detection-trigger-fix/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/release-detection-trigger-fix/task-1-summary.md` (triggers release detection)

  - [x] 1.1 Add summary document section to Spec Planning Standards
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add "Parent Task Summary Documents" section after completion documentation section
    - Include purpose, location, when to create, and format template
    - Explain rationale (`.kiro/` directory filtering, dual purpose as release notes)
    - Add forward-looking note about applying to new specs only
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 5.1, 5.6_

  - [x] 1.2 Update task format examples in Spec Planning Standards
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update parent task examples to show both detailed and summary documentation paths
    - Format: `Detailed: .kiro/specs/[spec-name]/completion/task-N-parent-completion.md`
    - Format: `Summary: docs/specs/[spec-name]/task-N-summary.md (triggers release detection)`
    - Ensure examples are clear and consistent
    - _Requirements: 3.2, 5.2_

  - [x] 1.3 Add cross-reference guidance between summary and detailed docs
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Document how to link from summary to detailed docs
    - Document how to link from detailed docs to summary
    - Document how to reference both in tasks.md
    - Include relative path examples
    - _Requirements: 5.2_

---

- [x] 2. Create Release Detection Hook Configurations

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Automatic hook created with validated format and pattern
  - Manual hook created as fallback
  - Both hooks use correct trigger types and action types
  
  **Primary Artifacts:**
  - `.kiro/hooks/release-detection-auto.kiro.hook`
  - `.kiro/hooks/release-detection-manual.kiro.hook`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/release-detection-trigger-fix/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/release-detection-trigger-fix/task-2-summary.md` (triggers release detection)

  - [x] 2.1 Create automatic release detection hook
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `.kiro/hooks/release-detection-auto.kiro.hook`
    - Use `fileCreated` trigger type with pattern `**/task-*-summary.md`
    - Use `askAgent` action type with prompt to execute release-manager.sh
    - Set enabled to true
    - Include clear description explaining when it triggers
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 4.1, 4.2, 4.3_

  - [x] 2.2 Create manual release detection hook
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `.kiro/hooks/release-detection-manual.kiro.hook`
    - Use `manual` trigger type
    - Use `askAgent` action type with same prompt as automatic hook
    - Set enabled to true
    - Include clear description explaining use cases
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 4.4, 4.5_

  - [x] 2.3 Disable old hook configurations
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Locate any existing hooks with `taskStatusChange` trigger
    - Set enabled to false (don't delete - preserve for reference)
    - Add comment explaining why disabled (unsupported trigger type)
    - _Requirements: 1.6_

---

- [x] 3. Update Development Workflow Documentation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Development Workflow updated with two-document workflow
  - Workflow diagram shows complete process including summary doc creation
  - Troubleshooting section explains `.kiro/` directory filtering
  
  **Primary Artifacts:**
  - `.kiro/steering/Development Workflow.md` (updated)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/release-detection-trigger-fix/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/release-detection-trigger-fix/task-3-summary.md` (triggers release detection)

  - [x] 3.1 Update automatic release detection section
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update "Automatic Release Detection" section with two-document workflow
    - Explain: detailed doc → summary doc → hook triggers
    - Document file naming for both types
    - Explain why two documents (`.kiro/` filtering, dual purpose)
    - _Requirements: 6.1, 6.2, 6.4_

  - [x] 3.2 Add manual release detection section
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add "Manual Release Detection" section
    - Document when to use manual trigger
    - Explain how to trigger from Agent Hooks panel
    - Include alternative (run script directly)
    - _Requirements: 6.3_

  - [x] 3.3 Update workflow diagram
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update "Task Completion Workflow" diagram to 7 steps
    - Include: detailed doc creation → summary doc creation → automatic trigger
    - Mark automatic vs manual steps clearly
    - _Requirements: 6.2_

  - [x] 3.4 Update troubleshooting section
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update "Release Detection Not Triggering" section
    - Add checks for summary document creation and location
    - Add common mistake: creating summary in `.kiro/` directory
    - Document fallback options
    - _Requirements: 6.3_

  - [x] 3.5 Add .kiro/ directory filtering explanation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add new section "Kiro IDE File Watching Behavior"
    - Explain `.kiro/` directory is filtered from file watching
    - List directories where hooks will/won't trigger
    - Explain why this matters for summary document location
    - _Requirements: 6.4_

---

- [x] 4. Update File Organization Standards Documentation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - File Organization Standards updated with summary document metadata
  - Directory structure documentation shows both docs/ and .kiro/ locations
  - Cross-reference guidance provided for linking between documents
  
  **Primary Artifacts:**
  - `.kiro/steering/File Organization Standards.md` (updated)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/release-detection-trigger-fix/completion/task-4-parent-completion.md`
  - Summary: `docs/specs/release-detection-trigger-fix/task-4-summary.md` (triggers release detection)

  - [x] 4.1 Add summary document organization metadata
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add "Summary Documents" section to organization metadata
    - Define organization: `spec-summary`, scope: `[spec-name]`
    - Document location: `docs/specs/[spec-name]/`
    - Include example with metadata header
    - _Requirements: 5.1, 5.2_

  - [x] 4.2 Update directory structure documentation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update "Spec-Specific Organization" section
    - Show both `docs/specs/` and `.kiro/specs/` structures
    - Clearly indicate which files trigger hooks
    - Include comments explaining purpose of each location
    - _Requirements: 5.2_

  - [x] 4.3 Add cross-reference guidance
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add section "Cross-References Between Summary and Detailed Docs"
    - Document how to link from summary to detailed docs (with relative paths)
    - Document how to link from detailed docs to summary (with relative paths)
    - Document how to reference both in tasks.md
    - Include working examples
    - _Requirements: 5.2_

---

- [x] 4.FIX Document Hook Limitation and Hybrid Approach

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Context**: During Task 4 completion, we discovered that `fileCreated` and `fileSaved` hooks only trigger for manual file operations through the IDE UI, not for programmatically created files by AI agents. This requires updating documentation to reflect a hybrid approach: automatic hooks for manual edits, manual trigger for AI-assisted workflows.
  
  **Success Criteria:**
  - Spec Planning Standards updated with manual trigger in parent task success criteria
  - Development Workflow updated with hook limitation explanation and hybrid approach
  - File Organization Standards updated with clarification about when hooks trigger
  - Hook limitation documented clearly across all three documents
  
  **Primary Artifacts:**
  - `.kiro/steering/Spec Planning Standards.md` (updated)
  - `.kiro/steering/Development Workflow.md` (updated)
  - `.kiro/steering/File Organization Standards.md` (updated)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/release-detection-trigger-fix/completion/task-4-fix-parent-completion.md`
  - Summary: `docs/specs/release-detection-trigger-fix/task-4-fix-summary.md` (triggers release detection)

  - [x] 4.FIX.1 Update Spec Planning Standards with manual trigger requirement
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add to parent task format: "Release detection triggered" in success criteria
    - Add post-completion step: "Run `./.kiro/hooks/release-manager.sh auto`"
    - Document hybrid approach (automatic for manual edits, manual for AI workflows)
    - Update parent task template examples
    - Add note about hook limitation (only triggers for IDE UI actions)
    - _Requirements: 3.1, 3.2, 6.1, 6.2_

  - [x] 4.FIX.2 Update Development Workflow with hook limitation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update "Automatic Release Detection" section with limitation explanation
    - Clarify hooks only trigger for manual file saves through IDE UI
    - Emphasize manual trigger as standard practice for AI-assisted workflows
    - Update workflow steps to include manual trigger after summary doc creation
    - Keep automatic hook documentation but clarify when it works
    - _Requirements: 6.1, 6.2, 6.4_

  - [x] 4.FIX.3 Update File Organization Standards with hybrid approach
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update summary document section with hook limitation
    - Clarify automatic hooks work for manually created/edited files only
    - Document manual trigger as standard practice for AI-assisted workflows
    - Update rationale to reflect hybrid approach
    - _Requirements: 5.2, 6.4_

---

- [x] 5. Validate Hook Trigger Behavior

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Automatic hook triggers when summary document manually created/saved through IDE UI
  - Automatic hook does NOT trigger for AI-created files (expected limitation)
  - Automatic hook does NOT trigger when files created in .kiro/ (directory filtered)
  - Manual hook executes successfully as fallback
  - Release trigger files created correctly
  
  **Primary Artifacts:**
  - Test files (temporary, will be deleted)
  - Validation results documented in completion doc
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/release-detection-trigger-fix/completion/task-5-parent-completion.md`
  - Summary: `docs/specs/release-detection-trigger-fix/task-5-summary.md` (triggers release detection)

  - [x] 5.1 Test automatic hook with manual file creation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create test directory: `docs/specs/test-spec/`
    - Manually create test summary through Kiro IDE UI: `task-1-summary.md`
    - Verify hook triggers when file is saved
    - Check that agent prompt appears
    - Verify release detection runs successfully
    - Delete test files after validation
    - _Requirements: 7.1, 7.2, 7.3_

  - [x] 5.2 Test .kiro/ directory filtering
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create test file in `.kiro/specs/test-spec/task-1-summary.md`
    - Verify hook does NOT trigger (directory filtered)
    - Confirm no new entries in release-manager.log
    - Delete test file after validation
    - _Requirements: 7.5_

  - [x] 5.3 Test manual hook execution
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Open Agent Hooks panel in Kiro IDE
    - Find "Manual Release Detection" hook
    - Click "Run" button
    - Verify script executes successfully
    - Check logs and trigger files
    - _Requirements: 7.4_

  - [x] 5.4 Test AI agent file creation limitation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Have AI agent create test summary programmatically in docs/
    - Verify hook does NOT trigger (AI-created files don't trigger hooks)
    - Document this as expected behavior and limitation
    - Verify manual trigger works as fallback
    - Delete test file after validation
    - _Requirements: 7.6_

---

- [x] 6. Clean Up Test Files and Old Configurations

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All test files removed from repository
  - Old hook configurations documented and archived
  - Repository clean and ready for normal use
  
  **Primary Artifacts:**
  - Clean repository (test files deleted)
  - Old configurations archived or documented
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/release-detection-trigger-fix/completion/task-6-parent-completion.md`
  - Summary: `docs/specs/release-detection-trigger-fix/task-6-summary.md` (triggers release detection)

  - [x] 6.1 Remove test hook files
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Delete `.kiro/hooks/test-file-created.kiro.hook`
    - Delete `.kiro/hooks/test-file-edited.kiro.hook`
    - Delete `.kiro/hooks/test-parent-task-completion.kiro.hook`
    - Verify files are removed
    - _Requirements: 7.1_

  - [x] 6.2 Remove test response files
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Delete `test-hook-response.txt`
    - Delete `test-hook-edited-response.txt`
    - Delete `parent-task-hook-triggered.txt`
    - Delete any other test response files
    - Verify files are removed
    - _Requirements: 7.1_

  - [x] 6.3 Remove test markdown files
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Delete `test-hook-example.md`
    - Delete `test-hook-trigger-2.md`
    - Delete `test-hook-trigger-test.md`
    - Delete `test-parent-completion.md`
    - Delete any test files in `docs/specs/release-detection-trigger-fix/` (task-test-*.md, task-filesave-test-*.md, task-manual-test-*.md)
    - Delete any test files in `docs/specs/test-spec/`
    - Delete `docs/specs/test-spec/` directory if empty
    - Verify files are removed
    - _Requirements: 7.1_

  - [x] 6.4 Archive old hook configurations
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Move old `.json` hook configs to `.kiro/hooks/archive/` directory
    - Add README.md in archive explaining why these were replaced
    - Document the unsupported `taskStatusChange` trigger issue
    - _Requirements: 4.1_

---

## Success Criteria

This implementation will be considered successful when:

1. ✅ Spec Planning Standards updated with summary document workflow
2. ✅ Hook configurations created with validated format
3. ✅ Development Workflow documentation updated with two-document workflow
4. ✅ File Organization Standards updated with summary document metadata
5. ✅ Validation confirms hooks trigger correctly with summary documents
6. ✅ Test files cleaned up and repository ready for normal use

---

*This implementation plan provides a systematic approach to fixing release detection automation by using summary documents in `docs/specs/` that trigger hooks, while maintaining detailed completion documentation in `.kiro/` unchanged.*
