# Implementation Plan: Component Token Generation Pipeline

**Date**: January 5, 2026
**Spec**: 037 - Component Token Generation Pipeline
**Status**: Implementation Planning
**Dependencies**: 
- Spec 035 (Button-Icon Component) - QA validation case, complete
- Rosetta System principles - Token architecture foundation
- Primitive/Semantic token pipeline - Pattern to follow

---

## Overview

This implementation plan converts the component token generation pipeline design into actionable tasks. The work is organized into four phases:

1. **Architecture Documentation** - Create Rosetta-System-Architecture.md steering doc
2. **Core Infrastructure** - Build defineComponentTokens() helper and ComponentTokenRegistry
3. **Pipeline Integration** - Connect validation and generation to existing pipeline
4. **QA Validation** - Update Button-Icon to use new system and verify end-to-end

Each task builds incrementally on previous work, with Button-Icon serving as the proof-of-concept throughout.

---

## Tasks

- [x] 1. Create Rosetta System Architecture Documentation
  **Type**: Setup
  **Validation**: Tier 1 - Minimal
  - [x] 1.1 Create `.kiro/steering/Rosetta-System-Architecture.md` steering document
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Reference `preliminary-audit-findings.md` for current pipeline state
    - Document high-level token pipeline flow: Definition → Validation → Registry → Generation → Platform Output
    - Provide entry points to detailed documentation for each subsystem (validators, registries, generators)
    - Show where component tokens fit in the pipeline (new layer between semantic and platform output)
    - Keep evergreen by avoiding specific token counts, names, or values
    - Complement (not replace) existing `rosetta-system-principles.md`
    - Note: Audit work already completed in preliminary-audit-findings.md; this task creates the MCP-accessible steering doc
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

---

- [ ] 2. Implement Component Token Authoring Infrastructure
  **Type**: Architecture
  **Validation**: Tier 3 - Comprehensive
  **Success Criteria**:
  - `defineComponentTokens()` helper exists with full TypeScript types
  - Helper returns usable token values for immediate consumption
  - Helper registers tokens with global ComponentTokenRegistry
  - Registry supports getAll(), getByComponent(), getByFamily() queries
  - Naming conflicts are detected and reported with descriptive errors
  
  - [ ] 2.1 Create `defineComponentTokens()` helper function
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/build/tokens/defineComponentTokens.ts`
    - Implement `TokenWithReference<T>` interface for primitive references
    - Implement `TokenWithValue` interface for family-conformant values
    - Implement `ComponentTokenConfig<T>` interface for configuration
    - Implement `RegisteredComponentToken` interface for stored tokens
    - Helper must return usable token values (ComponentTokenValues<T>)
    - Helper must call ComponentTokenRegistry.registerBatch() on invocation
    - Export all interfaces and the helper function
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [ ] 2.2 Create ComponentTokenRegistry
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/registries/ComponentTokenRegistry.ts`
    - Follow pattern from PrimitiveTokenRegistry and SemanticTokenRegistry
    - Implement `registerBatch(component, tokens)` method
    - Implement `getAll()` method returning all registered tokens
    - Implement `getByComponent(componentName)` method
    - Implement `getByFamily(familyName)` method
    - Implement `has(tokenName)` and `get(tokenName)` methods
    - Implement `clear()` method for testing
    - Detect naming conflicts and throw descriptive errors
    - Export singleton instance
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

  - [ ] 2.3 Write unit tests for defineComponentTokens and ComponentTokenRegistry
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/build/tokens/__tests__/defineComponentTokens.test.ts`
    - Create `src/registries/__tests__/ComponentTokenRegistry.test.ts`
    - Test: defineComponentTokens returns correct token values
    - Test: defineComponentTokens registers tokens with registry
    - Test: Reference tokens resolve to primitive baseValue
    - Test: Value tokens store the provided value
    - Test: Missing reasoning is rejected (if validation enabled at this stage)
    - Test: Registry getAll() returns all tokens
    - Test: Registry getByComponent() filters correctly
    - Test: Registry getByFamily() filters correctly
    - Test: Registry detects naming conflicts
    - Test: Registry clear() resets state
    - _Requirements: 2.1-2.6, 4.1-4.6_

---

- [ ] 3. Implement Component Token Validation
  **Type**: Architecture
  **Validation**: Tier 3 - Comprehensive
  **Success Criteria**:
  - ValidationCoordinator validates component tokens
  - Reasoning requirement is enforced
  - Primitive references are validated against PrimitiveTokenRegistry
  - Custom values are validated against family-specific patterns
  - Validation imports base values from actual token files (no hardcoded magic numbers)
  - Actionable error messages are provided for all failure cases
  
  - [ ] 3.1 Add component token validation to ValidationCoordinator
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update `src/integration/ValidationCoordinator.ts`
    - Add `validateComponentToken(token)` method
    - Add `validateAllComponentTokens()` method
    - Implement reasoning requirement check (non-empty string)
    - Implement primitive reference validation (check PrimitiveTokenRegistry.has())
    - _Requirements: 3.1, 3.4, 3.5, 3.6_

  - [ ] 3.2 Implement family-aware value validation
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    - Implement `validateFamilyConformance(family, value)` function
    - Import SPACING_BASE_VALUE from src/tokens/SpacingTokens.ts
    - Import RADIUS_BASE_VALUE from src/tokens/RadiusTokens.ts
    - Implement formula-based validation for spacing family
    - Implement formula-based validation for radius family
    - Implement modular scale validation for fontSize family
    - Implement discrete value rejection for color family (must use references)
    - Return warnings when custom value matches existing primitive
    - Handle unknown families with warning (allow but suggest adding validation)
    - _Requirements: 3.2, 3.3_

  - [ ] 3.3 Write unit tests for component token validation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/integration/__tests__/ComponentTokenValidation.test.ts`
    - Test: Valid primitive reference passes validation
    - Test: Invalid primitive reference fails with descriptive error
    - Test: Missing reasoning fails with descriptive error
    - Test: Valid spacing value (derivable from SPACING_BASE_VALUE) passes
    - Test: Invalid spacing value (magic number) fails with descriptive error
    - Test: Valid radius value passes
    - Test: Invalid radius value fails
    - Test: Color family rejects custom numeric values
    - Test: Unknown family allows with warning
    - Test: Warning returned when value matches existing primitive
    - _Requirements: 3.1-3.6_

  - [ ] 3.4 Add performance test for NFR 3 compliance
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create performance test in appropriate test file
    - Test: Validation of 50 component tokens completes in under 1 second
    - Mark as @category evergreen (permanent NFR behavior)
    - _Requirements: NFR 3.2_

---

- [ ] 4. Implement Platform Output Generation
  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  **Success Criteria**:
  - Component tokens generate CSS custom properties referencing primitives
  - Component tokens generate iOS Swift constants referencing primitives
  - Component tokens generate Android Kotlin constants referencing primitives
  - Generated output maintains token chain (reference, not inline value)
  - Output placed in dist/ directory alongside primitive/semantic output
  
  - [ ] 4.1 Update TokenFileGenerator for component token generation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update `src/generators/TokenFileGenerator.ts`
    - Add `generateComponentTokens()` method
    - Query ComponentTokenRegistry.getAll() for tokens to generate
    - Generate output grouped by component
    - Maintain primitive token references in output (not inline values)
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [ ] 4.2 Implement Web CSS generation for component tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Generate CSS custom properties: `--button-icon-inset-large: var(--space-150)`
    - Output to `dist/ComponentTokens.web.css`
    - Follow naming conventions from primitive/semantic token output
    - Include component grouping comments
    - _Requirements: 5.1, 5.5, 5.6_

  - [ ] 4.3 Implement iOS Swift generation for component tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Generate Swift constants: `public static let insetLarge: CGFloat = SpacingTokens.space150`
    - Output to `dist/ComponentTokens.ios.swift`
    - Group by component using enums
    - Follow naming conventions from primitive/semantic token output
    - _Requirements: 5.2, 5.5, 5.6_

  - [ ] 4.4 Implement Android Kotlin generation for component tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Generate Kotlin constants: `val insetLarge = SpacingTokens.space150`
    - Output to `dist/ComponentTokens.android.kt`
    - Group by component using objects
    - Follow naming conventions from primitive/semantic token output
    - _Requirements: 5.3, 5.5, 5.6_

  - [ ] 4.5 Write integration tests for platform output generation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test: Web CSS output contains correct custom properties
    - Test: Web CSS references primitives (var(--space-*))
    - Test: iOS Swift output contains correct constants
    - Test: iOS Swift references primitive constants
    - Test: Android Kotlin output contains correct constants
    - Test: Android Kotlin references primitive constants
    - Test: Output files are created in dist/ directory
    - _Requirements: 5.1-5.6_

---

- [ ] 5. Button-Icon QA Validation Integration
  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  **Success Criteria**:
  - buttonIcon.tokens.ts uses defineComponentTokens() API
  - Tokens reference primitive spacing tokens (space100, space125, space150)
  - Each token includes reasoning explaining its purpose
  - Platform files consume generated tokens (no hard-coded spacing values)
  - TokenCompliance tests pass for Button-Icon component
  
  - [ ] 5.1 Update buttonIcon.tokens.ts to use defineComponentTokens()
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update `src/components/core/ButtonIcon/buttonIcon.tokens.ts`
    - Import defineComponentTokens from build/tokens
    - Import spacingTokens from tokens/SpacingTokens
    - Define tokens using new API with explicit family ('spacing')
    - Reference space100, space125, space150 primitives
    - Add reasoning string for each token explaining its purpose
    - Export ButtonIconTokens for component consumption
    - _Requirements: 6.1, 6.2, 6.3_

  - [ ] 5.2 Update Button-Icon platform files to consume generated tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update `src/components/core/ButtonIcon/platforms/web/ButtonIcon.web.css`
    - Update `src/components/core/ButtonIcon/platforms/ios/ButtonIcon.ios.swift`
    - Update `src/components/core/ButtonIcon/platforms/android/ButtonIcon.android.kt`
    - Replace hard-coded spacing values with generated token references
    - Web: Use var(--button-icon-inset-*) custom properties
    - iOS: Use ButtonIconTokens.inset* constants
    - Android: Use ButtonIconTokens.inset* constants
    - _Requirements: 6.4_

  - [ ] 5.3 Verify TokenCompliance tests pass
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run TokenCompliance test suite
    - Verify Button-Icon component passes (no hard-coded spacing violations)
    - Document any remaining violations and resolution
    - _Requirements: 6.5_

---

- [ ] 6. Deprecate Existing Infrastructure
  **Type**: Setup
  **Validation**: Tier 1 - Minimal
  - [ ] 6.1 Mark old component token files as deprecated
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Add deprecation notice to `src/build/tokens/ComponentToken.ts`
    - Add deprecation notice to `src/build/tokens/ComponentTokenGenerator.ts`
    - Include JSDoc @deprecated tag with migration guidance
    - Point to defineComponentTokens() as replacement
    - _Requirements: 7.1, 7.2, 7.3_

  - [ ] 6.2 Update documentation references
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Update any documentation referencing old approach
    - Ensure Rosetta-System-Architecture.md references new approach
    - Document migration pattern for future component tokens
    - _Requirements: 7.4, 6.6_

---

- [ ] 7. Final Validation Checkpoint
  **Type**: Architecture
  **Validation**: Tier 3 - Comprehensive
  **Success Criteria**:
  - All tests pass (npm test)
  - TokenCompliance tests pass for Button-Icon
  - Generated platform output files exist in dist/
  - Pipeline flow works end-to-end: Definition → Validation → Registry → Generation → Platform Output
  - Pattern documented for future component token creation
  
  - [ ] 7.1 Run full test suite and verify all tests pass
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run `npm test`
    - Verify no regressions introduced
    - Document any test failures and resolutions
    - _Requirements: All_

  - [ ] 7.2 Verify end-to-end pipeline integration
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Verify Button-Icon tokens flow through complete pipeline
    - Verify generated output files are correct
    - Verify platform files consume generated tokens
    - Document the complete flow as reference for future components
    - _Requirements: All_

---

## Notes

- Tasks are ordered to build incrementally, with each task depending on previous work
- Button-Icon serves as the QA validation case throughout implementation
- Validation imports base values from actual token files to prevent documentation drift
- TokenCompliance tests already exist and will validate the end-to-end pipeline
- Performance test for NFR 3 follows Test Development Standards (evergreen category)
