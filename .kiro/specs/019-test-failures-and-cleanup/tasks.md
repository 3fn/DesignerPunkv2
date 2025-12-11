# Implementation Plan: Test Failures and Component Cleanup

**Date**: December 11, 2025
**Spec**: 019 - Test Failures and Component Cleanup
**Status**: Implementation Planning
**Dependencies**: 
- Spec 017 (Component Code Quality Sweep) - Builds on cleanup plan and follow-up recommendations

---

## Implementation Plan

This spec addresses 80 test failures and 111 remaining component violations through a phase-based approach: Critical Fixes → Component Cleanup → Test Updates → Verification.

---

## Task List

- [x] 1. Phase 1: Critical Fixes (Unblock Build)

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive
  
  **Success Criteria:**
  - TypeScript compilation succeeds without errors
  - `npm run build` completes successfully
  - Build system can generate tokens with space000
  
  **Primary Artifacts:**
  - `src/components/core/ButtonCTA/platforms/web/ButtonCTA.web.ts` (fixed icon size type)
  - `src/tokens/SpacingTokens.ts` (space000 token added - COMPLETE)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/019-test-failures-and-cleanup/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/019-test-failures-and-cleanup/task-1-summary.md`

  - [x] 1.1 Fix ButtonCTA icon size TypeScript error
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update ButtonCTA.web.ts to pass IconSize type instead of number
    - Create type-safe icon size mapping function
    - Verify getDiagnostics shows no TypeScript errors
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 1.2 Verify build succeeds
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run `npm run build` and verify success
    - Verify token generation includes space000
    - Run quick smoke tests on generated tokens
    - _Requirements: 1.1, 2.2_

- [x] 2. Phase 2A: Quick Wins (Build Momentum)

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive
  
  **Success Criteria:**
  - ButtonCTA web violation fixed
  - Icon web test violations fixed
  - TextInputField.browser.ts evaluated and handled
  - Audit script shows reduced violation count
  
  **Primary Artifacts:**
  - `src/components/core/ButtonCTA/platforms/web/ButtonCTA.web.ts`
  - `src/components/core/Icon/platforms/web/__tests__/Icon.test.ts`
  - `src/components/core/TextInputField/platforms/web/TextInputField.browser.ts` (or deleted)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/019-test-failures-and-cleanup/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/019-test-failures-and-cleanup/task-2-summary.md`

  - [x] 2.1 Fix ButtonCTA web fallback pattern
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Remove fallback pattern `? 32 : 24` for icon size
    - Use explicit icon size token references
    - Fail loudly when icon size token missing
    - _Requirements: 3.1, 5.1_

  - [x] 2.2 Fix Icon web test violations
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update backward-compatibility test to remove fallback pattern
    - Update test assertion to check for token reference instead of hard-coded `8px`
    - Verify tests pass
    - _Requirements: 3.2, 3.3, 3.4_

  - [x] 2.3 Evaluate TextInputField.browser.ts status
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Check import statements and usage across codebase
    - Determine if file is actively used or legacy
    - If legacy: mark for deletion and document as deprecated
    - If active: remove all 13 color fallback patterns, update to token-first
    - _Requirements: 5.6, 5.7_

- [ ] 3. Phase 2B: Icon Component Cleanup

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive
  
  **Success Criteria:**
  - All 32 Icon Android documentation violations fixed
  - Documentation references token names instead of hard-coded values
  - Audit script shows zero Icon violations
  
  **Primary Artifacts:**
  - `src/components/core/Icon/platforms/android/Icon.android.kt`
  - Icon Android preview examples
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/019-test-failures-and-cleanup/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/019-test-failures-and-cleanup/task-3-summary.md`

  - [ ] 3.1 Update Icon Android documentation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Replace hard-coded dp values in comments with token references
    - Format: `iconSize100 (24.dp)` instead of `24.dp`
    - Update all 32 documentation violations
    - _Requirements: 3.1, 3.2_

  - [ ] 3.2 Update Icon Android preview examples
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Replace hard-coded dp values in preview code with token references
    - Verify previews still render correctly
    - _Requirements: 3.2, 3.4_

- [ ] 4. Phase 2C: TextInputField Remaining Cleanup

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive
  
  **Success Criteria:**
  - All 23 remaining TextInputField violations fixed
  - iOS fallback patterns removed
  - Android hard-coded values replaced with tokens
  - Audit script shows zero TextInputField violations
  
  **Primary Artifacts:**
  - `src/components/core/TextInputField/platforms/ios/TextInputField.ios.swift`
  - `src/components/core/TextInputField/platforms/android/TextInputField.android.kt`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/019-test-failures-and-cleanup/completion/task-4-parent-completion.md`
  - Summary: `docs/specs/019-test-failures-and-cleanup/task-4-summary.md`

  - [ ] 4.1 Fix TextInputField iOS violations
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Remove opacity fallback pattern `? 1 : 0`
    - Replace hard-coded motion duration `0.15` with `motionFocus` token
    - Fail loudly when tokens missing
    - _Requirements: 5.1, 5.2_

  - [ ] 4.2 Fix TextInputField Android violations
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Replace hard-coded `0.dp` label offset with appropriate spacing token
    - Fix radius reference `150.dp` to properly reference `radius150` token
    - Replace hard-coded `4.dp` label padding with `space.grouped.tight`
    - Replace hard-coded `24.dp` icon sizes with `iconSize100` token (3 occurrences)
    - _Requirements: 5.3, 5.4, 5.5_

- [ ] 5. Phase 2D: Container Component Cleanup

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive
  
  **Success Criteria:**
  - All 47 Container violations fixed
  - Container web focus styles use accessibility tokens
  - Container Android TokenMapping uses semantic tokens
  - Audit script shows zero Container violations
  
  **Primary Artifacts:**
  - `src/components/core/Container/platforms/web/Container.web.ts`
  - `src/components/core/Container/platforms/android/TokenMapping.kt`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/019-test-failures-and-cleanup/completion/task-5-parent-completion.md`
  - Summary: `docs/specs/019-test-failures-and-cleanup/task-5-summary.md`

  - [ ] 5.1 Fix Container web violations
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Replace hard-coded `2px` focus outline width with accessibility token
    - Replace hard-coded `2px` high contrast border width with border token
    - Verify focus styles work correctly
    - _Requirements: 4.6_

  - [ ] 5.2 Fix Container Android border widths
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Replace `1.dp` with `borderDefault` token
    - Replace `2.dp` with `borderEmphasis` token
    - Replace `4.dp` with appropriate border or spacing token
    - Verify token mapping works correctly
    - _Requirements: 4.2, 4.7_

  - [ ] 5.3 Fix Container Android radius values
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Replace `4.dp` with `radius050` token
    - Replace `8.dp` with `radius100` token
    - Replace `16.dp` with `radius200` token
    - Verify radius mapping works correctly
    - _Requirements: 4.3, 4.7_

  - [ ] 5.4 Fix Container Android elevation values
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Replace hard-coded elevation values with elevation tokens
    - Map `2.dp`, `4.dp`, `8.dp`, `16.dp`, `24.dp` to appropriate elevation tokens
    - Verify elevation mapping works correctly
    - _Requirements: 4.4, 4.7_

  - [ ] 5.5 Fix Container Android colors
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Replace `Color(0xFFE5E7EB)` with `colorBorder` semantic token
    - Verify color mapping works correctly
    - _Requirements: 4.5, 4.7_

  - [ ] 5.6 Handle Container Android zero values
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Review 15 occurrences of `0.dp` in TokenMapping.kt
    - Keep legitimate "None" enum values as `0.dp`
    - Replace inappropriate zero values with semantic "none" tokens where applicable
    - Document rationale for each decision
    - _Requirements: 4.1, 4.7_

- [ ] 6. Phase 3: Test Updates

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive
  
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
  - Detailed: `.kiro/specs/019-test-failures-and-cleanup/completion/task-6-parent-completion.md`
  - Summary: `docs/specs/019-test-failures-and-cleanup/task-6-summary.md`

  - [ ] 6.1 Update token count expectation tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update BorderWidthTokens tests for new token counts
    - Update ShadowOffsetTokens tests for new token counts
    - Update Semantic BorderWidthTokens tests for semantic "none" tokens
    - Update GridSpacingTokenGeneration tests for space000
    - Update SemanticTokenGeneration tests for semantic "none" tokens
    - Update AccessibilityTokenGeneration tests for new accessibility tokens
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [ ] 6.2 Fix integration test compilation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Fix ButtonCTA icon integration test TypeScript errors
    - Fix Icon buttonCTA integration test TypeScript errors
    - Fix ButtonCTA setup test TypeScript errors
    - Fix ButtonCTA main test TypeScript errors
    - Verify all integration tests compile and pass
    - _Requirements: 6.1, 6.2_

  - [ ] 6.3 Update cross-platform consistency tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update TextInputField crossPlatformConsistency tests
    - Change expectations from hard-coded `0.25` to motion token reference
    - Verify tests pass across all platforms
    - _Requirements: 6.3_

  - [ ] 6.4 Update touch target sizing tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update TextInputField touchTargetSizing tests
    - Change expectations to use `tapAreaRecommended` token
    - Verify tests pass
    - _Requirements: 6.4_

  - [ ] 6.5 Update token compliance tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Verify iOS Color() pattern detection regex
    - Update TokenCompliance tests if needed
    - Verify tests accurately detect violations
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [ ] 6.6 Verify build system integration tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run BuildSystemIntegration tests
    - Run BuildOrchestrator tests
    - Verify tests pass with space000 token added
    - _Requirements: 2.1, 2.2_

  - [ ] 6.7 Update component integration tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update TextInputField labelAssociation tests
    - Update TextInputField keyboardNavigation tests
    - Update ButtonCTA/Icon integration test expectations
    - Verify tests pass
    - _Requirements: 6.1, 6.2, 6.3_

  - [ ] 6.8 Document performance test issues
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Document PerformanceRegression test timeout issues
    - Document HookIntegration test timeout issues
    - Document QuickAnalyze test timeout issues
    - Create recommendations for future performance optimization spec
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 7. Phase 4: Final Verification

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive
  
  **Success Criteria:**
  - Full test suite passes (excluding documented performance issues)
  - Audit script reports zero violations
  - All components 100% token compliant
  - Component READMEs updated if needed
  
  **Primary Artifacts:**
  - Test results showing all tests passing
  - Audit report showing zero violations
  - Updated component READMEs (if needed)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/019-test-failures-and-cleanup/completion/task-7-parent-completion.md`
  - Summary: `docs/specs/019-test-failures-and-cleanup/task-7-summary.md`

  - [ ] 7.1 Run full test suite
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run `npm test` and verify all tests pass (excluding documented performance issues)
    - Document any remaining test failures
    - Verify test count matches expectations
    - _Requirements: 9.5_

  - [ ] 7.2 Run audit script
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run audit script on all components
    - Verify zero hard-coded color violations
    - Verify zero hard-coded spacing violations
    - Verify zero hard-coded motion violations
    - Verify zero fallback pattern violations
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

  - [ ] 7.3 Update component READMEs if needed
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Review component READMEs for accuracy
    - Update Token Consumption sections if needed
    - Verify all token references are current
    - _Requirements: 9.5_

  - [ ] 7.4 Create completion summary
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Document all violations fixed (111 total)
    - Document all test failures resolved (80 total)
    - Document lessons learned
    - Document any remaining issues or recommendations
    - _Requirements: 9.5_

---

**Organization**: spec-tasks
**Scope**: 019-test-failures-and-cleanup
