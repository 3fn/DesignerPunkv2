# Implementation Plan: Component Code Quality Sweep

**Date**: December 9, 2025
**Spec**: 017 - Component Code Quality Sweep
**Status**: Implementation Planning
**Dependencies**: None

---

## Implementation Plan

This implementation plan systematically replaces hard-coded values with design tokens across all existing components. The approach uses manual token replacement guided by audit reports, with three-tier testing (cleanup-specific tests for immediate feedback, evergreen prevention tests for long-term protection, and existing component tests for behavior validation).

---

## Task List

- [x] 1. Create Audit Infrastructure

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Audit script identifies all hard-coded values across components
  - Report categorizes violations by type and priority
  - Token suggestions provided for each violation
  - Audit can be re-run to verify cleanup progress
  
  **Primary Artifacts:**
  - `scripts/audit-component-tokens.js`
  - `.kiro/specs/017-component-code-quality-sweep/audit-report.md`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/017-component-code-quality-sweep/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/017-component-code-quality-sweep/task-1-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Create Audit Infrastructure"`
  - Verify: Check GitHub for committed changes

  - [x] 1.1 Create audit script structure
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create `scripts/audit-component-tokens.js`
    - Set up file scanner to identify component files
    - Create basic report structure
    - _Requirements: 2.1_

  - [x] 1.2 Implement violation detection
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Detect hard-coded RGB/hex color values (web, iOS, Android)
    - Detect hard-coded spacing values (px, dp, CGFloat)
    - Detect hard-coded motion durations
    - Detect hard-coded typography values
    - Detect fallback patterns (`||`, `??`, ternary with hard-coded values)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [x] 1.3 Implement token matching
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Match detected values to semantic tokens (prefer semantic first)
    - Fall back to primitive tokens when semantic doesn't exist
    - Provide token suggestions in audit report
    - _Requirements: 1.6, 2.2_

  - [x] 1.4 Generate audit report
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create markdown report with summary statistics
    - Group violations by component and platform
    - Prioritize violations (high: color/spacing, medium: motion, low: edge cases)
    - Include line numbers and context for each violation
    - _Requirements: 2.1, 2.3_

  - [x] 1.5 Add npm script for audit
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Add `audit:tokens` script to package.json
    - Support component-specific audits
    - Support detailed report flag
    - _Requirements: 2.1_

- [x] 2. Create Evergreen Prevention Tests

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Tests scan all component files for violations
  - Tests detect hard-coded color values across all platforms
  - Tests detect hard-coded fallback patterns
  - Tests run automatically with test suite
  - Tests remain valuable after cleanup complete
  
  **Primary Artifacts:**
  - `src/components/__tests__/TokenCompliance.test.ts`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/017-component-code-quality-sweep/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/017-component-code-quality-sweep/task-2-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 2 Complete: Create Evergreen Prevention Tests"`
  - Verify: Check GitHub for committed changes

  - [x] 2.1 Create token compliance test file
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create `src/components/__tests__/TokenCompliance.test.ts`
    - Set up helper function to get all component files
    - _Requirements: 8.1_

  - [x] 2.2 Implement hard-coded color detection test
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test for `Color(red:green:blue:)` pattern (iOS)
    - Test for `Color(0xRRGGBB)` pattern (Android)
    - Test for `rgb()` and hex patterns (Web)
    - Scan all component files
    - _Requirements: 1.1, 8.1_

  - [x] 2.3 Implement fallback pattern detection test
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test for `|| number` patterns
    - Test for `|| 'string'` patterns
    - Test for `?? number` patterns
    - Scan all component files
    - _Requirements: 1.5, 8.1_

  - [x] 2.4 Implement spacing/motion/typography detection tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test for hard-coded spacing values
    - Test for hard-coded motion durations
    - Test for hard-coded typography values
    - Scan all component files
    - _Requirements: 1.2, 1.3, 1.4, 8.1_

- [x] 3. Clean Up ButtonCTA Component

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All hard-coded values replaced with tokens
  - All fallback patterns removed
  - Existing tests still pass
  - Cleanup-specific tests pass
  - Component README updated with token consumption
  
  **Primary Artifacts:**
  - `src/components/core/ButtonCTA/platforms/ios/ButtonCTA.ios.swift` (updated)
  - `src/components/core/ButtonCTA/platforms/web/ButtonCTA.web.tsx` (updated)
  - `src/components/core/ButtonCTA/platforms/android/ButtonCTA.android.kt` (updated)
  - `src/components/core/ButtonCTA/README.md` (updated)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/017-component-code-quality-sweep/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/017-component-code-quality-sweep/task-3-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 3 Complete: Clean Up ButtonCTA Component"`
  - Verify: Check GitHub for committed changes

  - [x] 3.1 Create ButtonCTA cleanup-specific tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create test file for ButtonCTA token replacements
    - Test iOS color token usage (colorPrimary, colorTextDefault)
    - Test web CSS custom property usage
    - Test Android color token usage
    - Mark as TEMPORARY in comments
    - _Requirements: 1.1, 1.6, 8.1_

  - [x] 3.2 Replace ButtonCTA iOS hard-coded colors
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Replace `Color(red:green:blue:)` with semantic tokens
    - Prefer semantic tokens (colorPrimary, colorTextDefault)
    - Document any primitive token usage
    - Update component tests to check for token references instead of hard-coded values
    - Run cleanup-specific tests
    - Run existing ButtonCTA tests
    - _Requirements: 1.1, 1.6, 3.1, 7.5, 7.6_

  - [x] 3.3 Replace ButtonCTA web hard-coded values
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Replace hard-coded colors with CSS custom properties
    - Replace hard-coded spacing with spacing tokens
    - Replace hard-coded motion with motion tokens
    - Update component tests to check for token references instead of hard-coded values
    - Run cleanup-specific tests
    - Run existing ButtonCTA tests
    - _Requirements: 1.1, 1.2, 1.3, 3.2, 7.5, 7.6_

  - [x] 3.4 Replace ButtonCTA Android hard-coded values
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Replace `Color(0xRRGGBB)` with semantic tokens
    - Replace hard-coded spacing with spacing tokens
    - Replace hard-coded motion with motion tokens
    - Update component tests to check for token references instead of hard-coded values
    - Run cleanup-specific tests
    - Run existing ButtonCTA tests
    - _Requirements: 1.1, 1.2, 1.3, 3.3, 7.5, 7.6_

  - [x] 3.5 Update ButtonCTA README with token consumption
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add "Token Consumption" section to README
    - Document color tokens used
    - Document spacing tokens used
    - Document typography tokens used
    - Document motion tokens used
    - _Requirements: 9.1_

- [x] 4. Clean Up TextInputField Component

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All hard-coded values replaced with tokens
  - All fallback patterns removed (fail loudly instead)
  - Existing tests still pass
  - Cleanup-specific tests pass
  - Component README updated with token consumption
  
  **Primary Artifacts:**
  - `src/components/core/TextInputField/platforms/web/TextInputField.web.ts` (updated)
  - `src/components/core/TextInputField/platforms/ios/TextInputField.ios.swift` (updated)
  - `src/components/core/TextInputField/platforms/android/TextInputField.android.kt` (updated)
  - `src/components/core/TextInputField/README.md` (updated)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/017-component-code-quality-sweep/completion/task-4-parent-completion.md`
  - Summary: `docs/specs/017-component-code-quality-sweep/task-4-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 4 Complete: Clean Up TextInputField Component"`
  - Verify: Check GitHub for committed changes

  - [x] 4.1 Create TextInputField cleanup-specific tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create test file for TextInputField token replacements
    - Test web fallback pattern removal
    - Test iOS color token usage
    - Test motion token usage across platforms
    - Mark as TEMPORARY in comments
    - _Requirements: 1.1, 1.3, 1.5, 8.1_

  - [x] 4.2 Remove TextInputField web fallback patterns
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Replace `|| '250ms'` with explicit error handling
    - Replace `|| 8` with explicit error handling
    - Fail loudly when tokens missing
    - Update component tests to check for no-fallback pattern
    - Run cleanup-specific tests
    - Run existing TextInputField tests
    - _Requirements: 1.5, 7.1, 7.5, 7.6_

  - [x] 4.3 Replace TextInputField iOS hard-coded values
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Replace hard-coded RGB colors with semantic tokens
    - Replace hard-coded spacing with spacing tokens
    - Replace hard-coded motion with motion tokens
    - Update component tests to check for token references instead of hard-coded values
    - Run cleanup-specific tests
    - Run existing TextInputField tests
    - _Requirements: 1.1, 1.2, 1.3, 3.1, 7.5, 7.6_

  - [x] 4.4 Replace TextInputField Android hard-coded values
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Replace hard-coded colors with semantic tokens
    - Replace hard-coded spacing with spacing tokens
    - Replace hard-coded motion with motion tokens
    - Update component tests to check for token references instead of hard-coded values
    - Run cleanup-specific tests
    - Run existing TextInputField tests
    - _Requirements: 1.1, 1.2, 1.3, 3.3, 7.5, 7.6_

  - [x] 4.5 Update TextInputField README with token consumption
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add "Token Consumption" section to README
    - Document all tokens used across platforms
    - Document fallback pattern removal
    - _Requirements: 9.1_

- [ ] 5. Clean Up Remaining Components

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All remaining components cleaned up
  - All hard-coded values replaced with tokens
  - All fallback patterns removed
  - Existing tests still pass
  - Component READMEs updated
  
  **Primary Artifacts:**
  - All remaining component files (updated)
  - All remaining component READMEs (updated)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/017-component-code-quality-sweep/completion/task-5-parent-completion.md`
  - Summary: `docs/specs/017-component-code-quality-sweep/task-5-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 5 Complete: Clean Up Remaining Components"`
  - Verify: Check GitHub for committed changes

  - [x] 5.1 Audit remaining components
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run audit script on all components
    - Identify components with violations
    - Prioritize by violation count and impact
    - Create cleanup plan for each component
    - _Requirements: 2.1, 2.3_

  - [x] 5.2 Clean up Icon component
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create cleanup-specific tests
    - Replace hard-coded values with tokens
    - Remove fallback patterns
    - Update component tests to check for new patterns
    - Run tests
    - Update README
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 7.5, 7.6, 9.1_

  - [x] 5.3 Clean up Container component
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create cleanup-specific tests
    - Replace hard-coded values with tokens
    - Remove fallback patterns
    - Update component tests to check for new patterns
    - Run tests
    - Update README
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 7.5, 7.6, 9.1_

  - [x] 5.4 Clean up additional components as needed
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Repeat cleanup process for each remaining component
    - Create cleanup-specific tests
    - Replace hard-coded values
    - Remove fallback patterns
    - Update component tests to check for new patterns
    - Run tests
    - Update READMEs
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 7.5, 7.6, 9.1_

- [x] 6. Delete Cleanup-Specific Tests

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All cleanup-specific tests deleted
  - Evergreen prevention tests remain
  - Existing component tests remain
  - Test suite still passes
  
  **Primary Artifacts:**
  - Cleanup-specific test files (deleted)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/017-component-code-quality-sweep/completion/task-6-parent-completion.md`
  - Summary: `docs/specs/017-component-code-quality-sweep/task-6-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 6 Complete: Delete Cleanup-Specific Tests"`
  - Verify: Check GitHub for committed changes

  - [x] 6.1 Identify all cleanup-specific test files
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - List all test files marked as TEMPORARY
    - Verify cleanup is complete for each component
    - Confirm evergreen tests are in place
    - _Requirements: 8.1_

  - [x] 6.2 Delete cleanup-specific test files
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Delete ButtonCTA cleanup-specific tests
    - Delete TextInputField cleanup-specific tests
    - Delete all other cleanup-specific tests
    - Run test suite to verify evergreen tests still work
    - _Requirements: 8.1_

- [x] 7. Update Component Development Guide

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Anti-patterns section added to guide
  - Hard-coded fallback values documented as anti-pattern
  - Examples provided for correct approach
  - Benefits of failing loudly explained
  
  **Primary Artifacts:**
  - `.kiro/steering/Component Development Guide.md` (updated)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/017-component-code-quality-sweep/completion/task-7-parent-completion.md`
  - Summary: `docs/specs/017-component-code-quality-sweep/task-7-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 7 Complete: Update Component Development Guide"`
  - Verify: Check GitHub for committed changes

  - [x] 7.1 Add anti-patterns section to Component Development Guide
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add "Anti-Pattern: Hard-Coded Fallback Values" section
    - Include problem statement
    - Include anti-pattern examples
    - Include correct approach examples
    - Include benefits of failing loudly
    - _Requirements: 9.2_

- [ ] 8. Final Validation and Documentation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Audit report shows zero violations
  - All component READMEs updated
  - Completion summary documents lessons learned
  - Token gaps identified and documented
  
  **Primary Artifacts:**
  - `.kiro/specs/017-component-code-quality-sweep/completion-summary.md`
  - Updated audit report showing zero violations
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/017-component-code-quality-sweep/completion/task-8-parent-completion.md`
  - Summary: `docs/specs/017-component-code-quality-sweep/task-8-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 8 Complete: Final Validation and Documentation"`
  - Verify: Check GitHub for committed changes

  - [ ] 8.1 Run final audit
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run audit script on all components
    - Verify zero violations reported
    - Document any legitimate exceptions with rationale
    - _Requirements: 2.1, 8.2_

  - [ ] 8.2 Verify all component READMEs updated
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Check each component README has Token Consumption section
    - Verify token documentation is accurate
    - Ensure consistent format across all READMEs
    - _Requirements: 9.1_

  - [ ] 8.3 Create completion summary
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Document common violation patterns discovered
    - Document token gaps identified
    - Document platform differences observed
    - Document fallback pattern prevalence
    - Document test coverage gaps
    - Propose new semantic tokens if patterns emerged
    - _Requirements: 9.3_

---

*This implementation plan provides a systematic approach to replacing hard-coded values with design tokens across all components while maintaining component behavior and preventing future violations through evergreen prevention tests.*
