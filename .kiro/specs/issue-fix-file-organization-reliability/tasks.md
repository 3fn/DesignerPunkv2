# Implementation Plan: File Organization Reliability Fixes

**Date**: November 7, 2025
**Spec**: issue-fix-file-organization-reliability
**Status**: Implementation Planning
**Dependencies**: None

---

## Implementation Plan

This implementation plan addresses three related file organization reliability issues discovered during Phase 1 Infrastructure Audit. The tasks are organized to fix metadata validation (Issue #005), improve cross-reference reliability (Issue #006), and document scanning scope (Issue #007).

**Key Approach**:
- Audit-first: Identify all files with organization metadata before making changes
- Enhance validation: Add missing values with clear rationale
- Improve reliability: Add Python check, path validation, exclusion rules
- Document decisions: Explicitly document intentional design choices

---

## Task List

- [x] 1. Fix Metadata Validation Inconsistency (Issue #005)

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All files with organization metadata audited and validated (289 files)
  - File Organization Standards updated with 3 new valid values (spec-guide, audit-findings, token-documentation)
  - Consolidation decisions documented and implemented (process-documentation → process-standard)
  - All 289 files eligible for automatic organization with validated metadata
  - Clear rationale documented for all metadata values
  - spec-guide location established as `docs/specs/[spec-name]/guides/` (output documentation)
  
  **Primary Artifacts:**
  - `.kiro/steering/File Organization Standards.md` (updated)
  - Audit results documenting all files with metadata
  - Updated validation list with rationale
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/issue-fix-file-organization-reliability/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/issue-fix-file-organization-reliability/task-1-summary.md` (triggers release detection)

  - [x] 1.1 Audit all files with organization metadata
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Scan all markdown files in repository for organization metadata
    - Create list of files with metadata and their values
    - Identify files using undocumented metadata values
    - Document findings in audit report
    - _Requirements: 1.1_

  - [x] 1.2 Update File Organization Standards with missing values
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - **Add new valid values** (clear winners from audit):
      - Add "spec-guide" with location `docs/specs/[spec-name]/guides/` (19 files - guides for spec outputs)
      - Add "audit-findings" with location `.kiro/audits/` (7 files - cross-project audit reports)
      - Add "token-documentation" with location `docs/tokens/` (2 files - foundational token guides)
    - **Document consolidation decisions**:
      - Consolidate "process-documentation" → "process-standard" (update 2 files: BUILD-SYSTEM-SETUP.md, .kiro/hooks/archive/README.md)
      - Decide on "framework-documentation": keep separate OR consolidate with "framework-strategic" (1 file: docs/tokens/layering-tokens.md)
      - Update "project-documentation" → "process-standard" (1 file, example only)
    - **Update validation script** (organize-by-metadata.sh):
      - Add new values to VALID_ORG_VALUES array
      - Update validation error messages to include new values
    - Document purpose, location, and examples for each new value
    - Ensure all values have clear definitions and rationale
    - _Requirements: 1.2, 1.3_

  - [x] 1.3 Enhance validation error messages
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update organize-by-metadata.sh validation logic
    - Add clear error message showing invalid value and valid options
    - Test with invalid metadata value to verify error message
    - _Requirements: 1.4_

  - [x] 1.4 Verify all files can be organized
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run organization script in dry-run mode
    - Verify no files rejected due to invalid metadata
    - Document any remaining issues
    - _Requirements: 1.5_

---

- [x] 2. Improve Cross-Reference Update Reliability (Issue #006)

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Python availability checked before cross-reference updates
  - Exclusion rules protect preserved-knowledge/ from modifications
  - Link validation detects broken links after updates
  - Clear logging shows all actions and skipped files
  
  **Primary Artifacts:**
  - `.kiro/hooks/organize-by-metadata.sh` (updated)
  - Enhanced cross-reference update logic
  - Exclusion rules implementation
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/issue-fix-file-organization-reliability/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/issue-fix-file-organization-reliability/task-2-summary.md` (triggers release detection)

  - [x] 2.1 Add Python availability check
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create check_python_available() function
    - Display clear error message with installation instructions if not found
    - Skip cross-reference updates gracefully if Python unavailable
    - Test with Python hidden to verify graceful degradation
    - _Requirements: 2.1, 2.2_

  - [x] 2.2 Implement exclusion rules
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create EXCLUDED_DIRS array with preserved-knowledge/, node_modules/, .git/, etc.
    - Create is_excluded_path() function to check exclusions
    - Skip excluded files with clear message
    - Log excluded files with reason
    - Test with file in preserved-knowledge/ to verify exclusion
    - _Requirements: 2.6, 2.7_

  - [x] 2.3 Add link validation after updates
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create validate_markdown_link() function
    - Extract all markdown links from updated files
    - Verify each link resolves to existing file
    - Report broken links with file and target path
    - Provide guidance for manual correction
    - _Requirements: 2.4, 2.5_

  - [x] 2.4 Enhance cross-reference update logging
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Log which files had links updated
    - Log how many links were changed per file
    - Log excluded files with reasons
    - Log broken links detected
    - Write logs to .kiro/logs/file-organization.log
    - _Requirements: 2.7, 2.8_

  - [x] 2.5 Test cross-reference reliability improvements
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test Python availability check (with and without Python)
    - Test exclusion rules (preserved-knowledge/, node_modules/)
    - Test link validation (with broken links)
    - Test logging (verify all actions logged)
    - Document test results
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_

---

- [x] 3. Document Root Directory Scanning Limitation (Issue #007)

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - File Organization Standards explicitly document root-only scanning
  - Rationale clearly explained (avoid moving already-organized files)
  - Guidance provided for organizing subdirectory files
  - Scanning scope logged when script runs
  
  **Primary Artifacts:**
  - `.kiro/steering/File Organization Standards.md` (updated)
  - `.kiro/hooks/organize-by-metadata.sh` (logging added)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/issue-fix-file-organization-reliability/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/issue-fix-file-organization-reliability/task-3-summary.md` (triggers release detection)

  - [x] 3.1 Document scanning scope in File Organization Standards
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add "File Organization Scope" section to standards
    - Document that only root directory is scanned
    - Explain rationale (completion docs already organized, avoid moving organized files)
    - Provide three options for organizing subdirectory files
    - **Note**: spec-guide files will move from `.kiro/specs/[spec-name]/` to `docs/specs/[spec-name]/guides/` (per Task 1.2 decision)
    - _Requirements: 3.1, 3.2, 3.3_

  - [x] 3.2 Add scanning scope logging
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create log_scanning_scope() function
    - Log current directory being scanned
    - Log that scope is root-only by design
    - Log rationale for limitation
    - Call at start of organization script
    - _Requirements: 3.4_

  - [x] 3.3 Add optional warning for subdirectory files
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Scan subdirectories for files with organization metadata (optional check)
    - If found, warn that they were not scanned
    - Make warning configurable (can be disabled)
    - Log subdirectory files found but not scanned
    - _Requirements: 3.5_

---

## Success Criteria

This implementation will be considered successful when:

1. ✅ All files with organization metadata use validated, documented values (Issue #005)
2. ✅ Cross-reference updates include Python check, exclusion rules, and link validation (Issue #006)
3. ✅ Root directory scanning limitation is documented with rationale and guidance (Issue #007)
4. ✅ File organization system can automatically organize all files with valid metadata
5. ✅ Preserved knowledge directory protected from automated modifications
6. ✅ Clear error messages and logging for all operations

---

*This implementation plan provides systematic fixes for three file organization reliability issues, improving validation, cross-reference updates, and documentation clarity.*
