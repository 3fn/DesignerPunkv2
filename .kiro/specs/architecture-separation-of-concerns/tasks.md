# Implementation Plan: Architecture - Separation of Concerns

**Date**: November 8, 2025
**Spec**: architecture-separation-of-concerns
**Status**: Implementation Planning
**Dependencies**: None

---

## Implementation Plan

This implementation plan addresses five critical architectural violations by establishing proper separation of concerns through common interfaces and extracted validation logic. The approach follows a phased migration strategy: create interfaces first (no breaking changes), then extract validation from low-impact components (TokenFileGenerator), and finally migrate high-impact components (registries) with careful coordination.

The plan prioritizes safety through incremental changes, comprehensive testing at each phase, and clear rollback points via atomic commits per task.

---

## Task List

- [x] 1. Create Common Interfaces

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - IValidator and IRegistry interfaces created with clear contracts
  - All validators implement IValidator interface
  - Both registries implement IRegistry interface
  - No breaking changes to existing functionality
  - Interfaces enable polymorphic usage
  
  **Primary Artifacts:**
  - `src/validators/IValidator.ts`
  - `src/registries/IRegistry.ts`
  - Updated validator classes implementing IValidator
  - Updated registry classes implementing IRegistry
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/architecture-separation-of-concerns/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/architecture-separation-of-concerns/task-1-summary.md` (triggers release detection)

  - [x] 1.1 Create IValidator interface
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    - Create `src/validators/IValidator.ts` with interface definition
    - Define `validate(input: TInput): ValidationResult | Promise<ValidationResult>` method
    - Define `name: string` property for identification
    - Include ValidationResult interface definition
    - Add comprehensive JSDoc documentation
    - _Requirements: 1.1, 1.2_

  - [x] 1.2 Create IRegistry interface
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    - Create `src/registries/IRegistry.ts` with interface definition
    - Define `register(token: TToken, options?: RegistrationOptions): void` method
    - Define `query(): TToken[]` method
    - Define `get(name: string): TToken | undefined` method
    - Define `has(name: string): boolean` method
    - Define `name: string` property for identification
    - Include RegistrationOptions interface with skipValidation option
    - Add comprehensive JSDoc documentation
    - _Requirements: 2.1, 2.2_

  - [x] 1.3 Update validators to implement IValidator
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update PassValidator to implement IValidator
    - Update WarningValidator to implement IValidator
    - Update ErrorValidator to implement IValidator
    - Update BaselineGridValidator to implement IValidator
    - Update SemanticTokenValidator to implement IValidator
    - Update SyntaxValidator to implement IValidator
    - Update ThreeTierValidator to use IValidator interface for orchestrating validators
    - Add `name` property to each validator
    - Verify all validators return correct ValidationResult structure
    - Run tests to ensure no breaking changes
    - _Requirements: 1.1, 1.2, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

  - [x] 1.4 Update registries to implement IRegistry
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update PrimitiveTokenRegistry to implement IRegistry<PrimitiveToken>
    - Update SemanticTokenRegistry to implement IRegistry<SemanticToken>
    - Add `name` property to each registry
    - Verify all required methods are present (register, query, get, has)
    - Keep existing validateToken() and validateAll() methods (will remove in Phase 3)
    - Run tests to ensure no breaking changes
    - _Requirements: 2.1, 2.2_

- [x] 2. Extract Validation from TokenFileGenerator

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Validation logic moved from TokenFileGenerator to SemanticTokenValidator
  - TokenFileGenerator has no validation logic (only generation)
  - All callers updated to validate before calling generator
  - Generated output identical to before refactoring
  - All tests passing
  
  **Primary Artifacts:**
  - Updated `src/validators/SemanticTokenValidator.ts`
  - Updated `src/generators/TokenFileGenerator.ts`
  - Updated test files
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/architecture-separation-of-concerns/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/architecture-separation-of-concerns/task-2-summary.md` (triggers release detection)

  - [x] 2.1 Move validateSemanticReferences logic to SemanticTokenValidator
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Copy validateSemanticReferences() logic from TokenFileGenerator to SemanticTokenValidator
    - Create new method: `validateSemanticReferences(semantics, tokens): ValidationResult`
    - Ensure method signature matches IValidator.validate() pattern
    - Add comprehensive error messages for invalid references
    - Test validator independently with sample data
    - _Requirements: 4.1, 4.2_

  - [x] 2.2 Update TokenFileGenerator to remove validation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Remove validateSemanticReferences() method from TokenFileGenerator
    - Update generateWebTokens() to remove validation call
    - Update generateiOSTokens() to remove validation call
    - Update generateAndroidTokens() to remove validation call
    - Verify generator methods only perform generation (no validation)
    - _Requirements: 4.1, 4.5_

  - [x] 2.3 Update callers to validate before generation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Identify all callers of TokenFileGenerator generation methods
    - Add validation step before calling generator (use SemanticTokenValidator)
    - Handle validation failures appropriately (log errors, return early)
    - Ensure validation results are checked before proceeding to generation
    - _Requirements: 4.2, 4.3, 4.4_

  - [x] 2.4 Update TokenFileGenerator tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update tests to use SemanticTokenValidator directly for validation tests
    - Update generation tests to assume valid input (no validation in generator)
    - Add integration tests that validate then generate
    - Verify all tests pass with refactored code
    - Confirm generated output matches pre-refactoring output
    - _Requirements: 4.2, 4.3, 4.4_

- [x] 3. Extract Validation from Registries (High Impact)

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Validation logic removed from both registries
  - Registries only perform storage operations (register, query, get, has)
  - All callers updated to validate before registration
  - ValidationCoordinator, TokenEngine, and ValidationPipeline updated
  - All tests passing with no breaking changes
  - System behavior identical to before refactoring
  
  **Primary Artifacts:**
  - Updated `src/registries/PrimitiveTokenRegistry.ts`
  - Updated `src/registries/SemanticTokenRegistry.ts`
  - Updated `src/validation/ValidationCoordinator.ts`
  - Updated `src/TokenEngine.ts`
  - Updated `src/validation/ValidationPipeline.ts`
  - Updated test files
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/architecture-separation-of-concerns/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/architecture-separation-of-concerns/task-3-summary.md` (triggers release detection)

  - [x] 3.1 Update ValidationCoordinator to validate before registration
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update validateToken() to validate before calling registry.register()
    - Update validateAllTokens() to validate each token before registration
    - Update validatePrimitiveTokens() to validate before registration
    - Update validateSemanticTokens() to validate before registration
    - Handle validation failures (throw errors or return validation results)
    - Ensure skipValidation option still works (skip validation step)
    - Test ValidationCoordinator with various validation scenarios
    - _Requirements: 5.3, 5.4, 6.3, 6.4, 8.1, 8.2, 8.3, 8.4_

  - [x] 3.2 Update TokenEngine to validate before registration
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update validateToken() method to validate before calling registry
    - Ensure validation failures prevent registration
    - Ensure validation successes allow registration
    - Test TokenEngine with valid and invalid tokens
    - _Requirements: 5.3, 5.4, 6.3, 6.4, 8.1, 8.4_

  - [x] 3.3 Update ValidationPipeline to validate before registration
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update pipeline to validate primitives before registration
    - Update pipeline to validate semantics before registration
    - Ensure validation failures are handled appropriately
    - Test pipeline with various token combinations
    - _Requirements: 5.3, 5.4, 6.3, 6.4, 8.1, 8.4_

  - [x] 3.4 Update other callers (CrossPlatformConsistencyValidator, TokenComparator, MathematicalConsistencyValidator)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Identify all remaining callers of registry.validateToken()
    - Update each caller to use validators directly instead of registry methods
    - Ensure validation logic is consistent across all callers
    - Test each updated component independently
    - _Requirements: 5.3, 5.4, 6.3, 6.4, 8.1, 8.4_

  - [x] 3.5 Remove validateToken() and validateAll() from registries
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Remove BaselineGridValidator instantiation from PrimitiveTokenRegistry constructor
    - Remove validateToken() method from PrimitiveTokenRegistry
    - Remove validateToken() method from SemanticTokenRegistry
    - Remove validateAll() method from PrimitiveTokenRegistry
    - Remove validateAll() method from SemanticTokenRegistry
    - Remove primitive reference validation from SemanticTokenRegistry registration logic
    - Update registry classes to only have storage methods (register, query, get, has)
    - Run all tests to ensure no breaking changes
    - _Requirements: 5.1, 5.2, 5.5, 5.6, 6.1, 6.2, 6.5, 6.6_

  - [x] 3.6 Update all registry tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update PrimitiveTokenRegistry tests to remove validation tests
    - Update SemanticTokenRegistry tests to remove validation tests
    - Add tests for storage-only behavior (register, query, get, has)
    - Update integration tests to validate separately from registration
    - Verify all tests pass with refactored registries
    - _Requirements: 5.3, 5.4, 5.5, 5.6, 6.3, 6.4, 6.5, 6.6_
    - **Note**: Discovered async validator support issue in ThreeTierValidator (see task 3.7)

  - [x] 3.7 Investigate async validator support in ThreeTierValidator
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    - **Context**: Task 3.6 discovered TypeScript compilation errors in ThreeTierValidator due to IValidator interface supporting async validators (added in task 3.5)
    - **Issue**: ThreeTierValidator's internal methods are typed for sync results but IValidator.validate() can return Promise
    - **Files Affected**: `src/validators/ThreeTierValidator.ts`, `src/__tests__/integration/ValidationPipeline.test.ts`
    - Investigate: Do we actually need async validators in the system?
    - Evaluate: Performance implications of making validation pipeline async
    - Analyze: Which validators (if any) require async operations
    - Design: If async needed, design proper async handling pattern for ThreeTierValidator
    - Alternative: If async not needed, update IValidator interface to be sync-only
    - Document: Decision and rationale with architectural implications
    - Implement: Chosen solution (either async support or sync-only interface)
    - Test: Verify ValidationPipeline integration tests pass
    - _Requirements: 6.3, 6.4, 8.1, 8.4_
    - **Completion Documentation**: `.kiro/specs/architecture-separation-of-concerns/completion/task-3-7-completion.md`

- [ ] 4. Document Registry-Validator Interaction Pattern and Update Documentation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Registry-validator interaction pattern documented with code examples
  - Pattern is unambiguous and consistently applicable
  - Phase 1 audit documents updated (Architecture Report + Issues Registry)
  - Issues #012-#017 marked as resolved with resolution details
  - Token System Overview updated with new validation flow
  - All documentation reflects new separation of concerns
  - Documentation accurate enough for AI agents to build consistently
  - Cross-references updated and working
  
  **Primary Artifacts:**
  - New `docs/architecture/registry-validator-pattern.md`
  - Updated `.kiro/audits/phase-1-architecture-report.md`
  - Updated `.kiro/audits/phase-1-issues-registry.md`
  - Updated `docs/token-system-overview.md`
  - New `docs/migration/validation-refactoring-guide.md`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/architecture-separation-of-concerns/completion/task-4-parent-completion.md`
  - Summary: `docs/specs/architecture-separation-of-concerns/task-4-summary.md` (triggers release detection)

  - [ ] 4.1 Document registry-validator interaction pattern
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `docs/architecture/registry-validator-pattern.md`
    - Document the caller-validates-then-registers pattern
    - Explain who is responsible for calling validators (caller)
    - Include code examples showing correct usage
    - Document pattern considerations (separation of concerns, ease of use, type safety, testability, consistency)
    - Provide examples for ValidationCoordinator, TokenEngine, and direct usage
    - Make pattern unambiguous for AI agents to follow
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 9.7_

  - [ ] 4.2 Update Phase 1 audit documents
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update `.kiro/audits/phase-1-architecture-report.md`:
      - Mark Issues #012, #013, #014, #016, #017 as resolved
      - Add "Resolution" section for each issue documenting the refactoring approach
      - Update architecture diagrams to show new separation of concerns
      - Add cross-references to this spec's completion documentation
    - Update `.kiro/audits/phase-1-issues-registry.md`:
      - Mark Issues #012-#017 as ✅ Resolved
      - Add resolution date, resolved by spec, resolution summary
      - Add verification notes confirming successful validation
      - Add cross-references to completion documentation
    - _Requirements: 9.1, 9.2, 9.3_

  - [ ] 4.3 Update Token System Overview
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update validation flow description to reflect new pattern
    - Update examples to show validation before registration (if any exist)
    - Add section on IValidator and IRegistry interfaces
    - Update architecture diagrams if present
    - Reference registry-validator-pattern.md for detailed pattern explanation
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [ ] 4.4 Create migration guide and update API documentation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `docs/migration/validation-refactoring-guide.md`:
      - Document migration from old pattern (validation in registries/generator) to new pattern (caller validates)
      - Provide before/after code examples
      - List common migration scenarios (ValidationCoordinator, TokenEngine, direct usage)
      - Include troubleshooting section for common issues
    - Update API documentation (if exists):
      - Document IValidator and IRegistry interfaces
      - Update examples to show validation before registration
      - Include code examples demonstrating correct usage patterns
    - Ensure documentation is accurate enough for AI agents to build consistently
    - _Requirements: 9.1, 9.2, 9.4, 9.5, 9.7_

---

**Organization**: spec-tasks
**Scope**: architecture-separation-of-concerns
