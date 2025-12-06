# Implementation Plan: Motion Token System

**Date**: December 3, 2025  
**Spec**: 014-motion-token-system  
**Status**: Implementation Planning  
**Dependencies**: None (foundational token system)

---

## Implementation Plan

This implementation plan creates motion tokens (duration, easing, scale) following the established compositional pattern used by Shadow and Typography tokens. The plan focuses on extending existing infrastructure rather than building new systems, with incremental validation at each step.

The implementation follows a bottom-up approach: primitive tokens → semantic tokens → platform generation → validation → testing. Each task builds on previous work and integrates with existing token infrastructure.

---

## Task List

- [x] 1. Create Primitive Motion Tokens

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All primitive motion token files created (Duration, Easing, Scale)
  - Tokens follow established primitive token patterns
  - Tokens integrate with existing token registry system
  - All primitive tokens exported from main index
  
  **Primary Artifacts:**
  - `src/tokens/DurationTokens.ts`
  - `src/tokens/EasingTokens.ts`
  - `src/tokens/ScaleTokens.ts`
  - `src/tokens/index.ts` (updated)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/014-motion-token-system/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/014-motion-token-system/task-1-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Create Primitive Motion Tokens"`
  - Verify: Check GitHub for committed changes

  - [x] 1.1 Create DurationTokens.ts primitive file
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/tokens/DurationTokens.ts` with duration150, duration250, duration350
    - Follow existing primitive token pattern (like SpacingTokens.ts)
    - Include JSDoc comments explaining usage context
    - Export durationTokens object and utility functions
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 1.2 Create EasingTokens.ts primitive file
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/tokens/EasingTokens.ts` with easingStandard, easingDecelerate, easingAccelerate
    - Use Material Design cubic-bezier curves
    - Include JSDoc comments explaining curve characteristics
    - Export easingTokens object and utility functions
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 1.3 Create ScaleTokens.ts primitive file
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/tokens/ScaleTokens.ts` with scale088, scale092, scale096, scale100, scale104, scale108
    - Follow 8-interval progression pattern
    - Include JSDoc comments with example calculations (16px × 0.88 = 14px)
    - Export scaleTokens object and utility functions
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

  - [x] 1.4 Update src/tokens/index.ts with motion token exports
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add exports for durationTokens, easingTokens, scaleTokens
    - Follow existing export pattern in index.ts
    - Verify all motion primitives are accessible from main index
    - _Requirements: 8.2_

- [x] 2. Create Semantic Motion Tokens

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Semantic motion token file created following Shadow/Typography pattern
  - motion.floatLabel token correctly references primitive tokens
  - Token structure supports incremental expansion
  - Semantic tokens integrate with existing semantic token system
  
  **Primary Artifacts:**
  - `src/tokens/semantic/MotionTokens.ts`
  - `src/tokens/semantic/index.ts` (updated)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/014-motion-token-system/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/014-motion-token-system/task-2-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 2 Complete: Create Semantic Motion Tokens"`
  - Verify: Check GitHub for committed changes

  - [x] 2.1 Create MotionTokens.ts semantic file
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/tokens/semantic/MotionTokens.ts` following ShadowTokens.ts pattern
    - Define SemanticMotionToken interface with primitiveReferences property
    - Create motion.floatLabel token composing duration250 + easingStandard
    - Include JSDoc comments explaining compositional pattern
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 8.3_

  - [x] 2.2 Add utility functions to MotionTokens.ts
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement getMotionToken(name: string) function
    - Implement getAllMotionTokens() function
    - Follow same pattern as getShadowToken(), getTypographyToken()
    - Export utility functions for external use
    - _Requirements: 8.5_

  - [x] 2.3 Update src/tokens/semantic/index.ts with motion exports
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add exports for motionTokens and utility functions
    - Follow existing semantic token export pattern
    - Verify motion tokens accessible from semantic index
    - _Requirements: 8.4_

- [x] 3. Extend Platform Builders for Motion Token Generation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All platform builders extended with motion token generation methods
  - Platform-specific output uses correct syntax (CSS, Swift, Kotlin)
  - Cross-platform mathematical equivalence maintained
  - Generated tokens integrate with existing build pipeline
  
  **Primary Artifacts:**
  - `src/build/platforms/WebBuilder.ts` (updated)
  - `src/build/platforms/iOSBuilder.ts` (updated)
  - `src/build/platforms/AndroidBuilder.ts` (updated)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/014-motion-token-system/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/014-motion-token-system/task-3-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 3 Complete: Extend Platform Builders for Motion Token Generation"`
  - Verify: Check GitHub for committed changes

  - [x] 3.1 Extend WebBuilder with motion token generation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add generateDurationTokens() method to WebBuilder
    - Add generateEasingTokens() method to WebBuilder
    - Add generateScaleTokens() method to WebBuilder
    - Add generateSemanticMotionTokens() method to WebBuilder
    - Generate CSS custom properties format (--duration-150: 150ms;)
    - Use existing toKebabCase utility for naming
    - _Requirements: 1.5, 2.5, 6.1, 6.4_

  - [x] 3.2 Extend iOSBuilder with motion token generation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add generateDurationTokens() method to iOSBuilder
    - Add generateEasingTokens() method to iOSBuilder
    - Add generateScaleTokens() method to iOSBuilder
    - Add generateSemanticMotionTokens() method to iOSBuilder
    - Generate Swift constants (let duration150: TimeInterval = 0.15)
    - Convert milliseconds to seconds for TimeInterval
    - Use Animation.timingCurve() for easing curves
    - _Requirements: 1.6, 2.6, 6.2, 6.5, 6.6_

  - [x] 3.3 Extend AndroidBuilder with motion token generation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add generateDurationTokens() method to AndroidBuilder
    - Add generateEasingTokens() method to AndroidBuilder
    - Add generateScaleTokens() method to AndroidBuilder
    - Add generateSemanticMotionTokens() method to AndroidBuilder
    - Generate Kotlin constants (val Duration150 = 150)
    - Use CubicBezierEasing() for easing curves
    - _Requirements: 1.7, 2.7, 6.3, 6.7_

  - [x] 3.4 Integrate motion token generation with BuildOrchestrator
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update BuildOrchestrator to call motion token generation methods
    - Ensure motion tokens generate during standard build process (npm run build)
    - Verify motion tokens output to correct directories (dist/web/, dist/ios/, dist/android/)
    - Test that existing build workflow remains unchanged
    - _Requirements: 8.1_

- [x] 4. Implement Scale Token Rounding in Generation System

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Rounding logic implemented in token generation system
  - Components receive pre-rounded values
  - Rounding produces whole pixel values consistently
  - Cross-platform rounding behavior verified
  
  **Primary Artifacts:**
  - `src/build/tokens/UnitConverter.ts` (updated)
  - Platform builders (updated with rounding logic)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/014-motion-token-system/completion/task-4-parent-completion.md`
  - Summary: `docs/specs/014-motion-token-system/task-4-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 4 Complete: Implement Scale Token Rounding"`
  - Verify: Check GitHub for committed changes

  - [x] 4.1 Add rounding utility to UnitConverter
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add applyScaleWithRounding(baseValue: number, scaleFactor: number) method
    - Implement Math.round() for whole pixel values
    - Add warning logging for significant precision loss (>0.5px)
    - Export utility for use in platform builders
    - _Requirements: 4.1, 4.2_

  - [x] 4.2 Apply rounding in platform-specific generation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update platform builders to use applyScaleWithRounding utility
    - Ensure rounding happens during token generation, not component consumption
    - Verify components receive pre-rounded values
    - Test rounding behavior across all platforms
    - _Requirements: 4.3, 4.4, 4.5_

- [x] 5. Add Motion Token Validation Rules

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Validation rules test structural correctness (not philosophy)
  - Cross-platform validation verifies mathematical equivalence
  - Error handling provides actionable messages
  - Validation integrates with existing three-tier system
  
  **Primary Artifacts:**
  - `src/build/validation/MathematicalConsistencyValidator.ts` (updated)
  - `src/build/validation/CrossPlatformValidationReporter.ts` (updated)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/014-motion-token-system/completion/task-5-parent-completion.md`
  - Summary: `docs/specs/014-motion-token-system/task-5-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 5 Complete: Add Motion Token Validation Rules"`
  - Verify: Check GitHub for committed changes

  - [x] 5.1 Add structural validation rules for motion tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add validation for primitive token existence and type correctness
    - Add validation for semantic token primitiveReferences validity
    - Add validation for platform-specific syntax correctness
    - Focus on structural correctness, not philosophical alignment
    - _Requirements: 8.1, 8.4_

  - [x] 5.2 Add cross-platform equivalence validation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update CrossPlatformValidationReporter to validate motion tokens
    - Verify web ms = iOS seconds × 1000 = Android ms
    - Verify easing curves are mathematically equivalent across platforms
    - Use existing TokenComparator for consistency checks
    - _Requirements: 6.8_

  - [x] 5.3 Add error handling for motion token failures
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add TokenGenerationError for invalid primitive references
    - Add PlatformGenerationError for platform-specific failures
    - Add TokenReferenceError for non-existent token references
    - Use existing BuildError base class and error reporting infrastructure
    - Provide actionable error messages with context
    - _Requirements: 8.1_

- [x] 6. Create Motion Token Tests

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Unit tests verify structural correctness
  - Property-based tests verify universal properties
  - Integration tests verify cross-platform generation
  - All tests pass with npm test
  
  **Primary Artifacts:**
  - `src/tokens/__tests__/DurationTokens.test.ts`
  - `src/tokens/__tests__/EasingTokens.test.ts`
  - `src/tokens/__tests__/ScaleTokens.test.ts`
  - `src/tokens/semantic/__tests__/MotionTokens.test.ts`
  - `src/build/__tests__/MotionTokenGeneration.test.ts`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/014-motion-token-system/completion/task-6-parent-completion.md`
  - Summary: `docs/specs/014-motion-token-system/task-6-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 6 Complete: Create Motion Token Tests"`
  - Verify: Check GitHub for committed changes

  - [x] 6.1 Create unit tests for primitive motion tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test that duration tokens exist and have valid numeric values
    - Test that easing tokens exist and have valid cubic-bezier strings
    - Test that scale tokens exist and have valid numeric values
    - Test utility functions (getDurationToken, getEasingToken, getScaleToken)
    - Focus on existence and type correctness, not specific values
    - _Requirements: 1.1, 2.1, 3.1_

  - [x] 6.2 Create unit tests for semantic motion tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test that motion.floatLabel exists and has required properties
    - Test that primitiveReferences point to existing primitive tokens
    - Test utility functions (getMotionToken, getAllMotionTokens)
    - Test that semantic tokens follow compositional pattern
    - _Requirements: 5.1, 5.2, 8.4_

  - [x] 6.3 Create property-based tests for motion tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - **Property 1**: Token existence and type correctness
    - **Property 2**: Cross-platform value equivalence
    - **Property 3**: Scale token rounding correctness
    - **Property 4**: Semantic token reference validity
    - **Property 5**: Incremental expansion backward compatibility
    - Use fast-check for property-based testing
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.8, 8.4, 9.5_

  - [x] 6.4 Create integration tests for cross-platform generation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test that motion tokens generate for all platforms (web, iOS, Android)
    - Test that output files are created with correct syntax
    - Test that mathematical equivalence is maintained across platforms
    - Test that generated tokens can be imported and used
    - Use existing build integration test patterns
    - _Requirements: 6.1, 6.2, 6.3, 6.8_

  - [x] 6.5 Run full test suite and verify all tests pass
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run npm test to execute all motion token tests
    - Verify no regressions in existing token tests
    - Fix any test failures before marking task complete
    - Document test coverage for motion tokens
    - _Requirements: All requirements_

- [ ] 7. Final Integration and Documentation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Motion tokens fully integrated with existing build system
  - Documentation complete and accurate
  - All requirements validated and met
  - System ready for Text Input Field component integration
  
  **Primary Artifacts:**
  - `docs/tokens/motion-tokens.md` (new documentation)
  - Updated build system documentation
  - Verified cross-platform output
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/014-motion-token-system/completion/task-7-parent-completion.md`
  - Summary: `docs/specs/014-motion-token-system/task-7-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 7 Complete: Final Integration and Documentation"`
  - Verify: Check GitHub for committed changes

  - [ ] 7.1 Verify end-to-end build process
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run npm run build and verify motion tokens generate correctly
    - Check dist/web/ for CSS custom properties
    - Check dist/ios/ for Swift constants
    - Check dist/android/ for Kotlin constants
    - Verify no build errors or warnings
    - _Requirements: 6.1, 6.2, 6.3, 8.1_

  - [ ] 7.2 Create motion token documentation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create docs/tokens/motion-tokens.md explaining motion token system
    - Document primitive tokens (duration, easing, scale)
    - Document semantic tokens (motion.floatLabel)
    - Document usage examples for components
    - Document design philosophy context (8-interval progression, etc.)
    - Include cross-references to related token documentation
    - _Requirements: All requirements_

  - [ ] 7.3 Verify all requirements are met
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Review requirements document and verify each requirement is implemented
    - Test each acceptance criterion manually if needed
    - Document any deviations or future work
    - Confirm system is ready for Text Input Field component integration
    - _Requirements: All requirements_

---

**Organization**: spec-tasks  
**Scope**: 014-motion-token-system
