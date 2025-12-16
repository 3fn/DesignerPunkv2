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

- [x] 8. Final Validation and Documentation

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

  - [x] 8.1 Run final audit
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run audit script on all components
    - Verify zero violations reported
    - Document any legitimate exceptions with rationale
    - _Requirements: 2.1, 8.2_

  - [x] 8.2 Add semantic "none" tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add `space.inset.none`, `space.separated.none`, `space.grouped.none` tokens
    - Add `border.none`, `radius.none`, `elevation.none` tokens
    - Update token generation to include none tokens
    - Document rationale: search/discoverability/maintenance/intent
    - _Requirements: 1.2, 1.6_

  - [x] 8.3 Clean up documentation examples
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update Container Android TokenMapping.kt documentation examples
    - Replace hard-coded values in comments with token references
    - Format: `mapPaddingToDp(PaddingValue.P200) // Returns spaceInset200 (16.dp)`
    - Critical: Prevents contamination vector from documentation
    - _Requirements: 9.2_

  - [x] 8.4 Review animation interaction values
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Review ButtonCTA iOS: scale transform (0.97), duration (0.1)
    - Review TextInputField iOS: opacity toggle (0/1), duration (0.15)
    - Determine if these should be motion tokens or component-specific
    - Document findings and recommendations
    - _Requirements: 1.3_

  - [x] 8.5 Audit accessibility token usage
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Review ButtonCTA iOS touch target height (44px)
    - Verify accessibility tokens exist for WCAG constants
    - Update components to use accessibility tokens consistently
    - Document: `accessibility.touchTarget.minimum` or `tapAreaRecommended`
    - _Requirements: 1.2_

  - [x] 8.6 Update test verification code
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update Icon web test (line 223) to use token references
    - Replace: `buttonSize === 'large' ? 32 : 24`
    - With: `buttonSize === 'large' ? iconSize125 : iconSize100`
    - Prevents contamination vector from test code
    - _Requirements: 7.5, 9.2_

  - [x] 8.7 Fix genuine violations
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Fix ButtonCTA iOS touch target heights (lines 298, 301, 303)
    - Replace hard-coded `44`, `48`, `56` with `tapAreaMinimum`, `tapAreaRecommended`, `tapAreaComfortable` tokens
    - Fix ButtonCTA Android touch target height (line 280)
    - Replace hard-coded `44` with `tapAreaMinimum` token
    - Fix TextInputField Android icon sizes (lines 348, 353, 358)
    - Replace hard-coded `24.dp` with `iconSize100` token
    - Run tests to verify changes
    - Context: Task 8.5 audit identified ButtonCTA components using hard-coded accessibility values
    - _Requirements: 1.1, 1.2, 1.6_

  - [x] 8.8 Verify all component READMEs updated
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Check each component README has Token Consumption section
    - Verify token documentation is accurate
    - Ensure consistent format across all READMEs
    - _Requirements: 9.1_

  - [x] 8.9 Create completion summary
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Document common violation patterns discovered
    - Document token gaps identified (semantic none tokens, animation tokens, accessibility tokens)
    - Document contamination vectors found (documentation examples, test code)
    - Document platform differences observed
    - Document fallback pattern prevalence
    - Document test coverage gaps
    - Propose new semantic tokens if patterns emerged
    - _Requirements: 12.3_

- [x] 9. Implement Motion Token Cross-Platform Support

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Motion tokens have iOS Animation equivalents
  - Motion tokens have Android AnimationSpec equivalents
  - Build system generates platform-specific motion tokens
  - Components use motion tokens instead of hard-coded animations
  - Semantic motion tokens created for common animations
  
  **Primary Artifacts:**
  - `src/tokens/semantic/MotionTokens.ts` (updated)
  - `dist/ios/MotionTokens.swift` (generated)
  - `dist/android/MotionTokens.kt` (generated)
  - Updated component files using motion tokens
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/017-component-code-quality-sweep/completion/task-9-parent-completion.md`
  - Summary: `docs/specs/017-component-code-quality-sweep/task-9-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 9 Complete: Implement Motion Token Cross-Platform Support"`
  - Verify: Check GitHub for committed changes

  - [x] 9.1 Create iOS motion token equivalents
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create Swift constants for motion durations (TimeInterval)
    - Create Swift Animation objects for easing curves (timingCurve)
    - Map CSS cubic-bezier to iOS Animation.timingCurve
    - Document iOS motion token usage patterns
    - _Requirements: 6.1, 6.2_

  - [x] 9.2 Create Android motion token equivalents
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create Kotlin constants for motion durations (milliseconds)
    - Create Kotlin Easing objects for easing curves (CubicBezierEasing)
    - Map CSS cubic-bezier to Android CubicBezierEasing
    - Document Android motion token usage patterns
    - _Requirements: 6.1, 6.3_

  - [x] 9.3 Update build system for motion token generation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Extend token generator to create iOS MotionTokens.swift
    - Extend token generator to create Android MotionTokens.kt
    - Generate duration constants for all platforms
    - Generate easing curve equivalents for all platforms
    - Test generated motion tokens
    - _Requirements: 6.1, 6.4_

  - [x] 9.4 Create semantic motion tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Define semantic motion tokens (floatLabel, focusTransition, buttonPress, modalSlide)
    - Reference primitive motion tokens (duration + easing)
    - Document semantic motion token usage
    - Update MotionTokens.ts with semantic tokens
    - _Requirements: 6.1_

  - [x] 9.5 Replace hard-coded animations with motion tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update TextInputField iOS to use motion tokens
    - Update ButtonCTA iOS to use motion tokens
    - Update other components with hard-coded animations
    - Run tests to verify animations still work
    - Document motion token usage in component READMEs
    - _Requirements: 6.2, 6.3, 6.4_

- [ ] 10. Standardize Icon System Integration

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All icon sizes use icon size tokens
  - Icon component usage patterns documented
  - Direct platform icon usage justified and documented
  - Consistent icon integration across components
  
  **Primary Artifacts:**
  - Updated component files with icon size tokens
  - Component Development Guide (icon integration section)
  - Component READMEs (icon usage documentation)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/017-component-code-quality-sweep/completion/task-10-parent-completion.md`
  - Summary: `docs/specs/017-component-code-quality-sweep/task-10-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 10 Complete: Standardize Icon System Integration"`
  - Verify: Check GitHub for committed changes

  - [ ] 10.1 Replace hard-coded icon sizes with tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update TextInputField iOS icon sizes (16 → iconSize075)
    - Update other components with hard-coded icon sizes
    - Use iconSize050, iconSize075, iconSize100, iconSize125, iconSize150 tokens
    - Run tests to verify icons render correctly
    - _Requirements: 5.3_

  - [ ] 10.2 Document icon system integration patterns
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add "Icon System Integration" section to Component Development Guide
    - Document when to use Icon component vs. direct platform icons
    - Document icon sizing token usage patterns
    - Provide examples for each platform (web, iOS, Android)
    - _Requirements: 5.1, 5.2, 5.4_

  - [ ] 10.3 Audit and document icon usage decisions
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Review TextInputField iOS icon usage (SF Symbols for status indicators)
    - Document rationale for direct platform icon usage
    - Identify components that should use Icon component
    - Update component READMEs with icon usage documentation
    - _Requirements: 5.4, 5.5_

- [ ] 11. Implement Accessibility Pattern Standardization

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Reduced motion patterns standardized across platforms
  - Accessibility tokens created for WCAG constants
  - All components respect reduced motion preferences
  - Hard-coded accessibility values replaced with tokens
  
  **Primary Artifacts:**
  - `src/tokens/semantic/AccessibilityTokens.ts` (new)
  - Updated component files with accessibility patterns
  - Component Development Guide (accessibility section)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/017-component-code-quality-sweep/completion/task-11-parent-completion.md`
  - Summary: `docs/specs/017-component-code-quality-sweep/task-11-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 11 Complete: Implement Accessibility Pattern Standardization"`
  - Verify: Check GitHub for committed changes

  - [ ] 11.1 Create accessibility tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create AccessibilityTokens.ts with touch target sizes (minimum: 44, recommended: 48, comfortable: 56)
    - Add contrast ratio tokens (normalTextAA: 4.5, normalTextAAA: 7, etc.)
    - Add animation duration tokens (instant: 0, minimal: 100, standard: 200)
    - Generate platform-specific accessibility tokens
    - _Requirements: 7.6_

  - [ ] 11.2 Document reduced motion patterns by platform
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Document iOS pattern (@Environment(\.accessibilityReduceMotion))
    - Document Android pattern (LocalAccessibilityManager)
    - Document web pattern (@media (prefers-reduced-motion: reduce))
    - Add "Accessibility Patterns" section to Component Development Guide
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [ ] 11.3 Standardize reduced motion implementation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Audit components for reduced motion support
    - Add reduced motion support to components missing it
    - Use TextInputField iOS pattern as reference
    - Test reduced motion behavior on all platforms
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [ ] 11.4 Replace hard-coded accessibility values with tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update ButtonCTA iOS touch targets (44, 48, 56 → tokens)
    - Update other components with hard-coded accessibility values
    - Use accessibilityTouchTargetMinimum, accessibilityTouchTargetRecommended, accessibilityTouchTargetComfortable
    - Run tests to verify accessibility compliance
    - _Requirements: 7.6_

  - [ ] 11.5 Consider semantic motion tokens with reduced motion
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Evaluate creating semantic motion tokens with respectsReducedMotion flag
    - Design platform-specific generation for reduced motion handling
    - Document trade-offs and implementation approach
    - Propose semantic motion token structure
    - _Requirements: 7.5_

- [x] 12. Fix Critical Build Issues (Merged from Spec 019)

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - TypeScript compilation succeeds without errors
  - `npm run build` completes successfully
  - Build system can generate tokens with space000
  
  **Primary Artifacts:**
  - `src/components/core/ButtonCTA/platforms/web/ButtonCTA.web.ts` (fixed icon size type)
  - `src/tokens/SpacingTokens.ts` (space000 token added)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/017-component-code-quality-sweep/completion/task-12-parent-completion.md`
  - Summary: `docs/specs/017-component-code-quality-sweep/task-12-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 12 Complete: Fix Critical Build Issues"`
  - Verify: Check GitHub for committed changes
  
  **Context**: Merged from Spec 019 Phase 1. These critical fixes unblocked the build and enabled all subsequent cleanup work.

  - [x] 12.1 Fix ButtonCTA icon size TypeScript error
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update ButtonCTA.web.ts to pass IconSize type instead of number
    - Create type-safe icon size mapping function
    - Verify getDiagnostics shows no TypeScript errors
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
    - _Status: COMPLETE (Spec 019 Task 1.1)_

  - [x] 12.2 Add space000 token
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add space000 = 0 to SpacingTokens.ts
    - Update token generation to include space000
    - Verify semantic "none" tokens can reference space000
    - _Requirements: 1.1, 2.2_
    - _Status: COMPLETE (Spec 019 - completed before spec creation)_

  - [x] 12.3 Verify build succeeds
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run `npm run build` and verify success
    - Verify token generation includes space000
    - Run quick smoke tests on generated tokens
    - _Requirements: 1.1, 2.2_
    - _Status: COMPLETE (Spec 019 Task 1.2)_

- [ ] 13. Complete Component Token Compliance (Merged from Spec 019)

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All remaining component violations fixed (111 total from Spec 017 follow-up)
  - All components follow Rosetta unit handling pattern (no manual `.dp` additions)
  - Audit script shows zero violations
  - Component READMEs updated if needed
  
  **Primary Artifacts:**
  - `src/components/core/ButtonCTA/platforms/web/ButtonCTA.web.ts`
  - `src/components/core/Icon/platforms/web/__tests__/Icon.test.ts`
  - `src/components/core/Icon/platforms/android/Icon.android.kt`
  - `src/components/core/TextInputField/platforms/ios/TextInputField.ios.swift`
  - `src/components/core/TextInputField/platforms/android/TextInputField.android.kt`
  - `src/components/core/Container/platforms/web/Container.web.ts`
  - `src/components/core/Container/platforms/android/TokenMapping.kt`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/017-component-code-quality-sweep/completion/task-13-parent-completion.md`
  - Summary: `docs/specs/017-component-code-quality-sweep/task-13-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 13 Complete: Complete Component Token Compliance"`
  - Verify: Check GitHub for committed changes
  
  **Context**: Merged from Spec 019 Phase 2. Addresses 111 remaining violations discovered after Spec 017's initial cleanup (Tasks 1-8). Includes critical Rosetta unit handling pattern fixes discovered during investigation.

  - [x] 13.1 Fix ButtonCTA web fallback pattern
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Remove fallback pattern `? 32 : 24` for icon size
    - Use explicit icon size token references
    - Fail loudly when icon size token missing
    - _Requirements: 3.1, 5.1_
    - _Status: COMPLETE (Spec 019 Task 2.1)_

  - [x] 13.2 Fix Icon web test violations
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update backward-compatibility test to remove fallback pattern
    - Update test assertion to check for token reference instead of hard-coded `8px`
    - Verify tests pass
    - _Requirements: 3.2, 3.3, 3.4_
    - _Status: COMPLETE (Spec 019 Task 2.2)_

  - [x] 13.3 Evaluate TextInputField.browser.ts status
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Check import statements and usage across codebase
    - Determine if file is actively used or legacy
    - If legacy: mark for deletion and document as deprecated
    - If active: remove all 13 color fallback patterns, update to token-first
    - _Requirements: 5.6, 5.7_
    - _Status: COMPLETE (Spec 019 Task 2.3)_

  - [x] 13.4 Update Icon Android documentation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Replace hard-coded dp values in comments with token references
    - Format: `iconSize100 (24.dp)` instead of `24.dp`
    - Update all 32 documentation violations
    - Update Icon Android preview examples
    - _Requirements: 3.1, 3.2, 3.4_
    - _Status: COMPLETE (Spec 019 Tasks 3.1, 3.2)_

  - [x] 13.5 Fix TextInputField iOS violations
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Remove opacity fallback pattern `? 1 : 0`
    - Replace hard-coded motion duration `0.15` with `motionFocus` token
    - Fail loudly when tokens missing
    - _Requirements: 5.1, 5.2_
    - _Status: COMPLETE (Spec 019 Task 5.1)_

  - [ ] 13.6 Fix TextInputField Android violations (Rosetta pattern)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Remove manual `.dp` additions from existing token references (21 instances)
    - Replace hard-coded `0.dp` label offset with appropriate spacing token (reference directly, no `.dp`)
    - Fix radius reference to use `DesignTokens.radius150` (not `DesignTokens.radius150.dp`)
    - Replace hard-coded `4.dp` label padding with `DesignTokens.spaceGroupedTight` (not `.dp`)
    - Replace hard-coded `24.dp` icon sizes with `DesignTokens.iconSize100` (3 occurrences, no `.dp`)
    - Follow Rosetta pattern: trust build system includes units, reference tokens directly
    - _Requirements: 5.3, 5.4, 5.5_
    - _Context: Spec 019 Task 5.2 - Rosetta unit handling pattern from Task 4 investigation_

  - [ ] 13.7 Fix Container web violations
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Replace hard-coded `2px` focus outline width with accessibility token
    - Replace hard-coded `2px` high contrast border width with border token
    - Verify focus styles work correctly
    - _Requirements: 4.6_
    - _Context: Spec 019 Task 6.1_

  - [ ] 13.8 Fix Container Android border widths (Rosetta pattern)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Remove manual `.dp` additions from existing token references
    - Replace hard-coded `1.dp` with `DesignTokens.borderDefault` (not `.borderDefault.dp`)
    - Replace hard-coded `2.dp` with `DesignTokens.borderEmphasis` (not `.borderEmphasis.dp`)
    - Replace hard-coded `4.dp` with appropriate token reference (no manual `.dp`)
    - Follow Rosetta pattern: reference tokens directly without adding units
    - Verify token mapping works correctly
    - _Requirements: 4.2, 4.7_
    - _Context: Spec 019 Task 6.2 - Rosetta unit handling pattern from Task 4 investigation_

  - [ ] 13.9 Fix Container Android radius values (Rosetta pattern)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Remove manual `.dp` additions from existing token references
    - Replace hard-coded `4.dp` with `DesignTokens.radius050` (not `.radius050.dp`)
    - Replace hard-coded `8.dp` with `DesignTokens.radius100` (not `.radius100.dp`)
    - Replace hard-coded `16.dp` with `DesignTokens.radius200` (not `.radius200.dp`)
    - Follow Rosetta pattern: reference tokens directly without adding units
    - Verify radius mapping works correctly
    - _Requirements: 4.3, 4.7_
    - _Context: Spec 019 Task 6.3 - Rosetta unit handling pattern from Task 4 investigation_

  - [ ] 13.10 Fix Container Android elevation values (Rosetta pattern)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Remove manual `.dp` additions from existing token references
    - Replace hard-coded elevation values with elevation token references (no manual `.dp`)
    - Map `2.dp`, `4.dp`, `8.dp`, `16.dp`, `24.dp` to appropriate elevation tokens
    - Follow Rosetta pattern: reference tokens directly without adding units
    - Verify elevation mapping works correctly
    - _Requirements: 4.4, 4.7_
    - _Context: Spec 019 Task 6.4 - Rosetta unit handling pattern from Task 4 investigation_

  - [ ] 13.11 Fix Container Android colors
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Replace `Color(0xFFE5E7EB)` with `DesignTokens.colorBorder` semantic token
    - Verify color mapping works correctly
    - _Requirements: 4.5, 4.7_
    - _Context: Spec 019 Task 6.5_

  - [ ] 13.12 Handle Container Android zero values
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Review 15 occurrences of `0.dp` in TokenMapping.kt
    - Keep legitimate "None" enum values as `0.dp` (these are intentional zero values, not token references)
    - Replace inappropriate zero values with semantic "none" tokens where applicable
    - Document rationale for each decision
    - Note: Zero values are not token references, so `.dp` is appropriate here
    - _Requirements: 4.1, 4.7_
    - _Context: Spec 019 Task 6.6_

- [ ] 14. Update Test Suite (Merged from Spec 019)

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All token count tests updated for space000 and semantic "none" tokens
  - All integration tests compile without TypeScript errors
  - All cross-platform consistency tests pass
  - All touch target sizing tests pass
  - Token compliance tests accurately detect violations
  - Build system integration tests pass
  - Performance test issues documented
  
  **Primary Artifacts:**
  - Updated test files across all test categories
  - Performance test documentation
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/017-component-code-quality-sweep/completion/task-14-parent-completion.md`
  - Summary: `docs/specs/017-component-code-quality-sweep/task-14-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 14 Complete: Update Test Suite"`
  - Verify: Check GitHub for committed changes
  
  **Context**: Merged from Spec 019 Phase 3. Addresses 80 test failures caused by new tokens (space000, semantic "none") and component changes from cleanup work.

  - [ ] 14.1 Update token count expectation tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update BorderWidthTokens tests for new token counts
    - Update ShadowOffsetTokens tests for new token counts
    - Update Semantic BorderWidthTokens tests for semantic "none" tokens
    - Update GridSpacingTokenGeneration tests for space000
    - Update SemanticTokenGeneration tests for semantic "none" tokens
    - Update AccessibilityTokenGeneration tests for new accessibility tokens
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
    - _Context: Spec 019 Task 7.1_

  - [ ] 14.2 Fix integration test compilation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Fix ButtonCTA icon integration test TypeScript errors
    - Fix Icon buttonCTA integration test TypeScript errors
    - Fix ButtonCTA setup test TypeScript errors
    - Fix ButtonCTA main test TypeScript errors
    - Verify all integration tests compile and pass
    - _Requirements: 6.1, 6.2_
    - _Context: Spec 019 Task 7.2_

  - [ ] 14.3 Update cross-platform consistency tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update TextInputField crossPlatformConsistency tests
    - Change expectations from hard-coded `0.25` to motion token reference
    - Verify tests pass across all platforms
    - _Requirements: 6.3_
    - _Context: Spec 019 Task 7.3_

  - [ ] 14.4 Update touch target sizing tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update TextInputField touchTargetSizing tests
    - Change expectations to use `tapAreaRecommended` token
    - Verify tests pass
    - _Requirements: 6.4_
    - _Context: Spec 019 Task 7.4_

  - [ ] 14.5 Update token compliance tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Verify iOS Color() pattern detection regex
    - Update TokenCompliance tests if needed
    - Verify tests accurately detect violations
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
    - _Context: Spec 019 Task 7.5_

  - [ ] 14.6 Verify build system integration tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run BuildSystemIntegration tests
    - Run BuildOrchestrator tests
    - Verify tests pass with space000 token added
    - _Requirements: 2.1, 2.2_
    - _Context: Spec 019 Task 7.6_

  - [ ] 14.7 Update component integration tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update TextInputField labelAssociation tests
    - Update TextInputField keyboardNavigation tests
    - Update ButtonCTA/Icon integration test expectations
    - Verify tests pass
    - _Requirements: 6.1, 6.2, 6.3_
    - _Context: Spec 019 Task 7.7_

  - [ ] 14.8 Document performance test issues
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Document PerformanceRegression test timeout issues
    - Document HookIntegration test timeout issues
    - Document QuickAnalyze test timeout issues
    - Create recommendations for future performance optimization spec
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
    - _Context: Spec 019 Task 7.8_

- [ ] 15. Final Verification (Merged from Spec 019)

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Full test suite passes (excluding documented performance issues)
  - Audit script reports zero violations
  - All components 100% token compliant
  - Component READMEs updated if needed
  - Spec 019 closure documented
  
  **Primary Artifacts:**
  - Test results showing all tests passing
  - Audit report showing zero violations
  - Updated component READMEs (if needed)
  - Spec 019 closure document
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/017-component-code-quality-sweep/completion/task-15-parent-completion.md`
  - Summary: `docs/specs/017-component-code-quality-sweep/task-15-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 15 Complete: Final Verification"`
  - Verify: Check GitHub for committed changes
  
  **Context**: Merged from Spec 019 Phase 4. Final verification that all work from both Spec 017 and Spec 019 is complete and integrated.

  - [ ] 15.1 Run full test suite
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run `npm test` and verify all tests pass (excluding documented performance issues)
    - Document any remaining test failures
    - Verify test count matches expectations
    - _Requirements: 9.5_
    - _Context: Spec 019 Task 8.1_

  - [ ] 15.2 Run audit script
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run audit script on all components
    - Verify zero hard-coded color violations
    - Verify zero hard-coded spacing violations
    - Verify zero hard-coded motion violations
    - Verify zero fallback pattern violations
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
    - _Context: Spec 019 Task 8.2_

  - [ ] 15.3 Update component READMEs if needed
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Review component READMEs for accuracy
    - Update Token Consumption sections if needed
    - Verify all token references are current
    - _Requirements: 9.5_
    - _Context: Spec 019 Task 8.3_

  - [ ] 15.4 Create Spec 019 closure document
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Document why Spec 019 was merged into Spec 017
    - Explain overlap between specs (Icon, TextInputField, Container work)
    - Document Rosetta unit handling pattern discovery
    - Reference Task 13 for merged work
    - Create closure document at `.kiro/specs/019-test-failures-and-cleanup/CLOSURE.md`
    - _Requirements: 9.5_

  - [ ] 15.5 Create completion summary
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Document all violations fixed (111 from Spec 017 follow-up + work from Spec 019)
    - Document all test failures resolved (80 total from Spec 019)
    - Document Rosetta unit handling pattern and its impact
    - Document lessons learned from both specs
    - Document any remaining issues or recommendations
    - _Requirements: 9.5, 12.3_
    - _Context: Spec 019 Task 8.4 + Spec 017 completion_

---

*This implementation plan provides a systematic approach to replacing hard-coded values with design tokens across all components, implementing cross-platform motion token support, standardizing icon system integration, implementing accessibility pattern standardization, and completing all remaining cleanup work from Spec 019.*
