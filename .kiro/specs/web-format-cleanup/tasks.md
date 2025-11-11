# Implementation Plan: Web Format Cleanup

**Date**: November 9, 2025
**Spec**: web-format-cleanup
**Status**: Implementation Planning
**Dependencies**: None
**Related Issues**: #019, #020

---

## Implementation Plan

This implementation plan removes JavaScript format support from the web token generation system through systematic cleanup of core components, test suites, and documentation. The approach follows three phases: core component cleanup, test suite updates, and documentation/validation.

---

## Task List

- [x] 1. Establish Baseline and Prepare for Cleanup

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Pre-cleanup baseline established with passing tests and valid CSS output
  - Current state documented for comparison
  - Rollback plan ready if issues arise
  
  **Primary Artifacts:**
  - Baseline test results
  - Baseline CSS output file
  - Pre-cleanup validation report
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/web-format-cleanup/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/web-format-cleanup/task-1-summary.md` (triggers release detection)

  - [x] 1.1 Run full test suite and document baseline
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Run `npm test` and capture results
    - Document which tests pass/fail currently
    - Save test output for comparison
    - _Requirements: 5.1_

  - [x] 1.2 Generate tokens and save baseline output
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Run token generation: `npm run generate:tokens` or equivalent
    - Save generated CSS file for comparison
    - Verify CSS output is valid
    - Document baseline CSS structure
    - _Requirements: 5.2, 5.3_

  - [x] 1.3 Run diagnostics on files to be modified
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Run `getDiagnostics` on `src/providers/WebFormatGenerator.ts`
    - Run `getDiagnostics` on `src/providers/WebFileOrganizer.ts`
    - Run `getDiagnostics` on `src/generators/TokenFileGenerator.ts`
    - Document any existing issues
    - _Requirements: 5.1_

---

- [ ] 2. Remove JavaScript Format Support from WebFormatGenerator

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - JavaScript format support completely removed from WebFormatGenerator
  - CSS format functionality works without regression
  - All format conditionals eliminated
  - WebFormatGenerator tests pass with CSS-only implementation
  
  **Primary Artifacts:**
  - `src/providers/WebFormatGenerator.ts` (modified)
  - `src/providers/__tests__/WebFormatGenerator*.test.ts` (modified)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/web-format-cleanup/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/web-format-cleanup/task-2-summary.md` (triggers release detection)

  - [ ] 2.1 Remove format parameter and outputFormat property
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Remove `outputFormat: OutputFormat` property
    - Remove constructor parameter: `constructor(outputFormat: OutputFormat = 'css')`
    - Change to: `constructor() { super(); }`
    - Update `formats` array from `['css', 'javascript']` to `['css']`
    - Run `getDiagnostics` to check for type errors
    - _Requirements: 1.1, 1.2, 1.3_

  - [ ] 2.2 Remove formatJavaScriptConstant method and helpers
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Remove `formatJavaScriptConstant()` method
    - Remove `formatJSValue()` helper method
    - Remove any JavaScript-specific utility methods
    - Run `getDiagnostics` to verify no broken references
    - _Requirements: 1.5_

  - [ ] 2.3 Remove format conditionals from token formatting methods
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Find all `if (this.outputFormat === 'css')` conditionals
    - Remove conditionals, keep CSS code path only
    - Update `formatToken()` to call `formatCSSCustomProperty()` directly
    - Update `generateHeader()` to remove format conditional
    - Update `generateFooter()` to remove format conditional
    - Run `getDiagnostics` to verify no errors
    - _Requirements: 1.4_

  - [ ] 2.4 Remove format conditionals from semantic token methods
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update `formatSingleReferenceToken()` to remove format conditionals
    - Update `formatMultiReferenceToken()` to remove format conditionals
    - Update `generateSemanticTokensSection()` to remove format conditionals
    - Keep CSS code paths only
    - Run `getDiagnostics` to verify no errors
    - _Requirements: 1.4_

  - [ ] 2.5 Update getTokenName to remove JavaScript-specific logic
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Remove `if (this.outputFormat === 'javascript')` conditional
    - Keep CSS token naming logic only
    - Simplify method to always use CSS naming convention
    - Run `getDiagnostics` to verify no errors
    - _Requirements: 1.4_

  - [ ] 2.6 Update WebFormatGenerator tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Remove JavaScript format test cases
    - Update constructor tests to not pass format parameter
    - Verify CSS format tests still pass
    - Run `npm test -- src/providers/__tests__/WebFormatGenerator*.test.ts`
    - _Requirements: 3.1, 3.2_

---

- [ ] 3. Simplify WebFileOrganizer to CSS-Only

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - WebFileOrganizer only handles CSS format
  - No format parameter in getFileName()
  - Build system integration references CSS only
  - PathProviders tests pass with CSS-only implementation
  
  **Primary Artifacts:**
  - `src/providers/WebFileOrganizer.ts` (modified)
  - `src/providers/__tests__/PathProviders.test.ts` (modified)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/web-format-cleanup/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/web-format-cleanup/task-3-summary.md` (triggers release detection)

  - [ ] 3.1 Remove format parameter from getFileName
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Change signature from `getFileName(format: OutputFormat)` to `getFileName()`
    - Remove switch statement
    - Return `'DesignTokens.web.css'` directly
    - Run `getDiagnostics` to check for type errors
    - _Requirements: 2.1, 2.2_

  - [ ] 3.2 Remove JavaScript import patterns from getBuildSystemIntegration
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Remove JavaScript import patterns from `importPatterns` array
    - Keep only: `"import '@/tokens/DesignTokens.web.css'"`
    - Update `watchPatterns` to remove `**/*.js` if present
    - Run `getDiagnostics` to verify no errors
    - _Requirements: 2.3_

  - [ ] 3.3 Update validatePath to CSS-only
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update validation to only check for `.css` extension
    - Remove `.js` extension validation
    - Update error messages to reference CSS only
    - Run `getDiagnostics` to verify no errors
    - _Requirements: 2.4_

  - [ ] 3.4 Update PathProviders tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update file path expectations from `.web.js` to `.web.css`
    - Remove JavaScript format validation tests
    - Verify CSS format tests pass
    - Run `npm test -- src/providers/__tests__/PathProviders.test.ts`
    - _Requirements: 3.5_

---

- [ ] 4. Update TokenFileGenerator and Integration Tests

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - TokenFileGenerator uses WebFormatGenerator without format parameter
  - TokenFileGenerator tests expect CSS format only (Issue #019 resolved)
  - BuildSystemIntegration tests validate CSS format only
  - BuildSystemCompatibility tests validate CSS format only
  
  **Primary Artifacts:**
  - `src/generators/TokenFileGenerator.ts` (modified)
  - `src/generators/__tests__/TokenFileGenerator.test.ts` (modified)
  - `src/__tests__/BuildSystemIntegration.test.ts` (modified)
  - `src/__tests__/integration/BuildSystemCompatibility.test.ts` (modified)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/web-format-cleanup/completion/task-4-parent-completion.md`
  - Summary: `docs/specs/web-format-cleanup/task-4-summary.md` (triggers release detection)

  - [ ] 4.1 Update TokenFileGenerator constructor
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Change from `new WebFormatGenerator('css')` to `new WebFormatGenerator()`
    - Run `getDiagnostics` to verify no errors
    - _Requirements: 1.1_

  - [ ] 4.2 Update TokenFileGenerator tests (Issue #019)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update file extension expectations from `.web.js` to `.web.css`
    - Update content expectations from `export` to `:root`
    - Update 4 failing tests identified in Issue #019
    - Run `npm test -- src/generators/__tests__/TokenFileGenerator.test.ts`
    - _Requirements: 3.1, 3.2_

  - [ ] 4.3 Update BuildSystemIntegration tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Remove JavaScript import pattern expectations
    - Keep CSS import pattern tests
    - Update any file path expectations
    - Run `npm test -- src/__tests__/BuildSystemIntegration.test.ts`
    - _Requirements: 3.3_

  - [ ] 4.4 Update BuildSystemCompatibility tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Remove JavaScript format compatibility tests
    - Keep CSS format compatibility tests
    - Run `npm test -- src/__tests__/integration/BuildSystemCompatibility.test.ts`
    - _Requirements: 3.4_

---

- [ ] 5. Update Documentation and Validate Cleanup

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All documentation references CSS format only
  - No JavaScript format references remain in codebase
  - Full test suite passes
  - Generated CSS output identical to baseline
  - Issues #019 and #020 resolved
  
  **Primary Artifacts:**
  - `src/generators/generateTokenFiles.ts` (comment updated)
  - Updated code comments across modified files
  - Final validation report
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/web-format-cleanup/completion/task-5-parent-completion.md`
  - Summary: `docs/specs/web-format-cleanup/task-5-summary.md` (triggers release detection)

  - [ ] 5.1 Update generateTokenFiles.ts comment
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update comment from `DesignTokens.web.js` to `DesignTokens.web.css`
    - Search for any other JavaScript format references in file
    - Update all references to CSS format
    - _Requirements: 4.1_

  - [ ] 5.2 Update code comments in modified files
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Search for "JavaScript" in comments in modified files
    - Update comments to reference CSS only
    - Remove format selection references
    - Search for "format" in comments and update as needed
    - _Requirements: 4.2, 4.3, 4.4_

  - [ ] 5.3 Run full test suite
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run `npm test` to execute all tests
    - Verify all tests pass
    - Compare to baseline test results
    - Document any differences
    - _Requirements: 5.1_

  - [ ] 5.4 Generate tokens and compare to baseline
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run token generation
    - Compare generated CSS to baseline CSS
    - Verify output is identical
    - Document any differences (should be none)
    - _Requirements: 5.2, 5.3_

  - [ ] 5.5 Run diagnostics on all modified files
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run `getDiagnostics` on all modified files
    - Verify no TypeScript errors
    - Verify no linting errors
    - Document final state
    - _Requirements: 5.1_

  - [ ] 5.6 Update issues registry
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Mark Issue #019 as resolved
    - Mark Issue #020 as resolved
    - Update `.kiro/audits/phase-1-issues-registry.md`
    - Reference this spec as resolution
    - _Requirements: All requirements_

---

## Task Summary

**Total Tasks**: 5 parent tasks, 22 subtasks

**By Phase**:
- Phase 1 (Baseline): 1 parent task, 3 subtasks
- Phase 2 (Core Cleanup): 2 parent tasks, 10 subtasks
- Phase 3 (Integration & Validation): 2 parent tasks, 9 subtasks

**By Type**:
- Setup: 3 tasks (baseline establishment)
- Implementation: 19 tasks (code changes and test updates)
- Parent: 5 tasks (overall coordination)

**Estimated Complexity**: Low-Medium
- Most tasks are straightforward code removal
- Test updates are mechanical
- Clear success criteria for each task

**Estimated Lines Changed**:
- Code removed: ~200 lines
- Tests updated/removed: ~160 lines
- Documentation updated: ~10 lines
- **Total impact**: ~370 lines

---

## Execution Notes

### Task Execution Order

Tasks should be executed in numerical order (1 → 2 → 3 → 4 → 5) because:
- Task 1 establishes baseline needed for validation
- Task 2 must complete before Task 3 (WebFileOrganizer depends on WebFormatGenerator)
- Task 3 must complete before Task 4 (TokenFileGenerator uses both)
- Task 5 validates all previous tasks

### Validation Strategy

After each parent task:
1. Run `getDiagnostics` on modified files
2. Run affected test suites
3. Verify no regressions
4. Commit changes before moving to next task

### Rollback Points

Commit after each parent task completes:
- After Task 1: Baseline established
- After Task 2: WebFormatGenerator cleaned up
- After Task 3: WebFileOrganizer cleaned up
- After Task 4: Integration tests updated
- After Task 5: Documentation updated and validated

### Success Criteria

Spec is complete when:
- ✅ All 5 parent tasks marked complete
- ✅ All tests pass (100% pass rate)
- ✅ Generated CSS identical to baseline
- ✅ ~370 lines of code removed
- ✅ No JavaScript format references remain
- ✅ Issues #019 and #020 resolved

---

**Organization**: spec-tasks
**Scope**: web-format-cleanup
