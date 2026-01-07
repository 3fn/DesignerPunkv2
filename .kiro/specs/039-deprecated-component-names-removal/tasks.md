# Implementation Plan: Deprecated Component Names Removal

**Date**: January 7, 2026
**Spec**: 039 - Deprecated Component Names Removal
**Status**: Implementation Planning
**Dependencies**: None

---

## Implementation Plan

This spec removes deprecated component names (`dp-icon`, `dp-container`) from the DesignerPunk codebase. The removal follows a dependency-aware order: tests first, then production code, then schemas, then documentation. This ensures tests pass at each step of the removal process.

The audit findings in `findings/deprecated-names-audit-findings.md` identified 28 references across 10 files.

---

## Task List

- [x] 1. Remove Deprecated Component Name Support

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All deprecated name assertions removed from test files
  - All deprecated name registrations removed from browser entry
  - All deprecated name references removed from schemas
  - All deprecated name documentation removed from READMEs
  - All tests pass after removal
  - Browser bundle builds successfully
  - No references to `dp-icon` or `dp-container` in active code/tests/docs (excluding specs)
  
  **Primary Artifacts:**
  - `src/__tests__/browser-distribution/component-registration.test.ts` (updated)
  - `src/__tests__/browser-distribution/umd-bundle-loading.test.ts` (updated)
  - `src/__tests__/browser-distribution/registration-idempotency.property.test.ts` (updated)
  - `src/browser-entry.ts` (updated)
  - `src/components/core/Icon-Base/Icon-Base.schema.yaml` (updated)
  - `src/components/core/Container-Base/Container-Base.schema.yaml` (updated)
  - `src/components/core/Icon-Base/README.md` (updated)
  - `src/components/core/Container-Base/README.md` (updated)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/039-deprecated-component-names-removal/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/039-deprecated-component-names-removal/task-1-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Remove Deprecated Component Name Support"`
  - Verify: Check GitHub for committed changes

  - [x] 1.1 Update test files to remove deprecated name assertions
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update `registration-idempotency.property.test.ts`: Replace `dp-icon` and `dp-container` with `icon-base` and `container-base` in COMPONENT_NAMES array
    - Update `component-registration.test.ts`: Remove 8 assertions expecting deprecated names, update 3 comments from "seven custom elements" to "five custom elements"
    - Update `umd-bundle-loading.test.ts`: Remove 2 assertions expecting deprecated names in bundle content
    - Run targeted tests to verify updates work: `npm test -- src/__tests__/browser-distribution/`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 1.2 Remove deprecated registrations from browser entry
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Remove `DpIconElement` class definition and `safeDefine('dp-icon', DpIconElement)` registration
    - Remove `DpContainerElement` class definition and `safeDefine('dp-container', DpContainerElement)` registration
    - Remove associated comments about legacy tags
    - Run tests to verify removal: `npm test`
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 1.3 Update component schemas to remove legacy element references
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update `Icon-Base.schema.yaml`: Remove `legacy_element: "<dp-icon>"` field and backward compatibility note
    - Update `Container-Base.schema.yaml`: Remove `legacy_element: "<dp-container>"` field and backward compatibility note
    - Verify schema files remain valid YAML
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [x] 1.4 Update component documentation to remove legacy sections
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update `Icon-Base/README.md`: Remove entire "Backward Compatibility" section
    - Update `Container-Base/README.md`: Remove "Backward Compatibility" section and platform note about legacy tag support
    - Verify documentation remains coherent after removal
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 1.5 Final validation and verification
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run full test suite: `npm test`
    - Build browser bundle to confirm no errors
    - Grep codebase to verify no deprecated names remain in active code/tests/docs (excluding `.kiro/specs/`)
    - Verify `--dp-*` CSS custom property prefix unchanged
    - _Requirements: 5.1, 5.2, 6.1, 6.2_
