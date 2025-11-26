# Implementation Plan: Inset Token Renaming

**Date**: November 25, 2025
**Spec**: 011 - Inset Token Renaming
**Status**: Implementation Planning
**Dependencies**: None

---

## Implementation Plan

This plan implements the renaming of inset spacing semantic tokens from subjective synonyms to numeric scale with "inset" prefix in component props. The implementation follows a phased approach to ensure clean migration with no visual changes.

---

## Task List

- [x] 1. Update Semantic Token Definitions

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Inset tokens use numeric names (050, 100, 150, 200, 300, 400)
  - Token paths resolve correctly (space.inset.150)
  - Mathematical relationships documented
  - No references to old token names
  
  **Primary Artifacts:**
  - `src/tokens/semantic/SpacingTokens.ts`
  - Updated token documentation
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/011-inset-token-renaming/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/011-inset-token-renaming/task-1-summary.md` (triggers release detection)

  - [x] 1.1 Rename inset token keys to numeric names
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update `insetSpacing` object keys from synonyms to numbers
    - Change: `tight` → `'050'`, `normal` → `'100'`, etc.
    - Maintain primitive token references (value: 'space050', etc.)
    - Update JSDoc comments with mathematical relationships
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 1.2 Update token path resolution
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Verify `getSpacingTokenByPath()` resolves numeric names
    - Test token path format: `space.inset.150`
    - Ensure no breaking changes to token resolution logic
    - _Requirements: 1.2_

  - [x] 1.3 Verify token exports and utilities
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Verify `spacingTokens` export includes renamed inset tokens
    - Test `getSemanticToken()` with new token paths
    - Verify `getAllSemanticTokens()` returns renamed tokens
    - _Requirements: 1.1, 1.2_

- [x] 2. Update TypeScript Types

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - TypeScript types use "inset" prefix
  - Type safety enforced for valid values
  - IDE autocomplete shows correct options
  - No compilation errors
  
  **Primary Artifacts:**
  - Component interface files
  - Type definition files
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/011-inset-token-renaming/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/011-inset-token-renaming/task-2-summary.md` (triggers release detection)

  - [x] 2.1 Create InsetPadding type
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create string literal union type with "inset" prefix
    - Type: `'inset050' | 'inset100' | 'inset150' | 'inset200' | 'inset300' | 'inset400'`
    - Add JSDoc documentation with pixel values and mathematical relationships
    - Export from appropriate module
    - _Requirements: 6.1, 6.3, 6.4_

  - [x] 2.2 Update component interfaces
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update ButtonCTA interface to use `InsetPadding` type
    - Update Icon interface to use `InsetPadding` type (if applicable)
    - Update any other components using inset padding
    - Verify TypeScript compilation succeeds
    - _Requirements: 6.1, 6.2_

- [x] 3. Update Component Implementations

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Components use new prop values (inset050, inset100, etc.)
  - Visual appearance unchanged
  - Prop mapping to token paths works correctly
  - No references to old prop values
  
  **Primary Artifacts:**
  - `src/components/core/ButtonCTA/`
  - `src/components/core/Icon/`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/011-inset-token-renaming/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/011-inset-token-renaming/task-3-summary.md` (triggers release detection)

  - [x] 3.1 Update ButtonCTA component
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update padding prop values to use "inset" prefix
    - Implement prop-to-token-path mapping (strip "inset" prefix)
    - Update component tokens file if needed
    - Verify visual appearance unchanged
    - _Requirements: 4.1, 4.3_

  - [x] 3.2 Update Icon component
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Check if Icon uses inset padding
    - Update padding prop values if applicable
    - Implement prop-to-token-path mapping if needed
    - Verify visual appearance unchanged
    - _Requirements: 4.2, 4.3_

  - [x] 3.3 Update component documentation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update ButtonCTA README with new prop values
    - Update Icon README with new prop values (if applicable)
    - Update usage examples to show new syntax
    - Document migration from old to new values
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 4. Update Platform Generators

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Generated code uses new token names
  - Web CSS uses numeric names (--space-inset-050, etc.)
  - iOS Swift uses numeric names (spaceInset050, etc.)
  - Android Kotlin uses numeric names (spaceInset050, etc.)
  - Generated output produces same visual results
  
  **Primary Artifacts:**
  - `src/generators/platforms/WebCSSGenerator.ts`
  - `src/generators/platforms/iOSSwiftGenerator.ts`
  - `src/generators/platforms/AndroidKotlinGenerator.ts`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/011-inset-token-renaming/completion/task-4-parent-completion.md`
  - Summary: `docs/specs/011-inset-token-renaming/task-4-summary.md` (triggers release detection)

  - [x] 4.1 Update Web CSS Generator
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update token name formatting for inset tokens
    - Generate: `--space-inset-050`, `--space-inset-100`, etc.
    - Verify generated CSS matches expected format
    - Test that generated values are correct (4px, 8px, 12px, etc.)
    - _Requirements: 5.1, 5.4_

  - [x] 4.2 Update iOS Swift Generator
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update token name formatting for inset tokens
    - Generate: `spaceInset050`, `spaceInset100`, etc.
    - Verify generated Swift matches expected format
    - Test that generated values are correct (4, 8, 12, etc.)
    - _Requirements: 5.2, 5.4_

  - [x] 4.3 Update Android Kotlin Generator
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update token name formatting for inset tokens
    - Generate: `spaceInset050`, `spaceInset100`, etc.
    - Verify generated Kotlin matches expected format
    - Test that generated values are correct (4.dp, 8.dp, 12.dp, etc.)
    - _Requirements: 5.3, 5.4_

  - [x] 4.4 Rebuild platform outputs
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run build system to regenerate all platform files
    - Verify web CSS output uses new names
    - Verify iOS Swift output uses new names
    - Verify Android Kotlin output uses new names
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 5. Update Tests

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All tests pass
  - Tests verify numeric token names
  - Tests verify "inset" prefix in props
  - No references to old token names in tests
  
  **Primary Artifacts:**
  - Token test files
  - Component test files
  - Generator test files
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/011-inset-token-renaming/completion/task-5-parent-completion.md`
  - Summary: `docs/specs/011-inset-token-renaming/task-5-summary.md` (triggers release detection)

  - [x] 5.1 Update semantic token tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update tests to verify numeric token names (050, 100, 150, etc.)
    - Test that old names don't exist (tight, normal, comfortable, etc.)
    - Verify token paths resolve correctly (space.inset.150)
    - Verify primitive references unchanged (space050, space100, etc.)
    - _Requirements: 8.1, 8.4_

  - [x] 5.2 Update component tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update ButtonCTA tests to use new prop values (inset050, etc.)
    - Update Icon tests to use new prop values (if applicable)
    - Test prop-to-token-path mapping
    - Verify visual appearance unchanged (snapshot tests)
    - _Requirements: 8.2, 8.4_

  - [x] 5.3 Update platform generator tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update tests to verify new token names in generated output
    - Test Web CSS generation (--space-inset-050, etc.)
    - Test iOS Swift generation (spaceInset050, etc.)
    - Test Android Kotlin generation (spaceInset050, etc.)
    - Verify old names not in generated output
    - _Requirements: 8.3, 8.4_

  - [x] 5.4 Run full test suite
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run `npm test` to execute all tests
    - Verify all tests pass
    - Fix any failing tests
    - Verify no references to old token names in test output
    - _Requirements: 8.4_

- [x] 6. Update Documentation and Migration Guide

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Documentation explains new naming convention
  - Migration guide provides complete mapping table
  - Examples show new syntax
  - Rationale documented
  
  **Primary Artifacts:**
  - Token system documentation
  - Component documentation
  - Migration guide
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/011-inset-token-renaming/completion/task-6-parent-completion.md`
  - Summary: `docs/specs/011-inset-token-renaming/task-6-summary.md` (triggers release detection)

  - [x] 6.1 Create migration guide
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create migration guide document
    - Include complete mapping table (old → new)
    - Provide before/after code examples
    - Explain rationale for change
    - Document breaking change clearly
    - _Requirements: 7.4, 9.1, 9.2, 9.3, 9.4_

  - [x] 6.2 Update token system documentation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update spacing token documentation
    - Explain numeric naming convention
    - Document mathematical relationships
    - Provide usage examples with new names
    - _Requirements: 7.1, 7.2_

  - [x] 6.3 Update component usage documentation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update component README files
    - Show examples with new prop values (padding="inset150")
    - Update API reference sections
    - Document TypeScript types
    - _Requirements: 7.3_

- [x] 7. Final Verification

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All tests pass
  - Build succeeds
  - No references to old token names
  - Visual appearance unchanged
  - Documentation complete
  
  **Primary Artifacts:**
  - Complete codebase
  - Generated platform files
  - Test results
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/011-inset-token-renaming/completion/task-7-parent-completion.md`
  - Summary: `docs/specs/011-inset-token-renaming/task-7-summary.md` (triggers release detection)

  - [x] 7.1 Run full build and test suite
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run `npm run build` to compile TypeScript
    - Run `npm test` to execute all tests
    - Verify no compilation errors
    - Verify all tests pass
    - _Requirements: All_

  - [x] 7.2 Search for old token name references
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Search codebase for "tight" in spacing context
    - Search codebase for "comfortable" in spacing context
    - Search codebase for "spacious" in spacing context
    - Search codebase for "expansive" in spacing context
    - Search codebase for "generous" in spacing context
    - Verify no references found (except in migration docs)
    - _Requirements: 4.4, 8.4_

  - [x] 7.3 Visual regression verification
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Compare ButtonCTA visual appearance before/after
    - Compare Icon visual appearance before/after (if applicable)
    - Verify spacing values unchanged
    - Run visual regression tests if available
    - _Requirements: 3.3, 4.3, 5.4_

  - [x] 7.4 Documentation completeness check
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Verify migration guide is complete
    - Verify token documentation updated
    - Verify component documentation updated
    - Verify all examples use new syntax
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 9.1, 9.2, 9.3, 9.4_

---

## Implementation Notes

### Breaking Change

This is a breaking change that renames all inset spacing tokens. The migration is intentionally done as a clean cutover with no deprecation period because:
- Early in project with minimal usage (only ButtonCTA and Icon)
- Clean cutover prevents confusion about which names to use
- Simpler implementation without dual support

### Layout Tokens Unchanged

Layout spacing tokens (grouped, related, separated, sectioned) are intentionally NOT renamed. They use density modifiers (tight, normal, loose) which work well with their two-level semantic structure.

### Prop Value Prefix

Component prop values use "inset" prefix (inset050, inset100, etc.) for clarity and AI-friendly context, while token definitions use numeric names (050, 100, etc.). Components map prefixed prop values to token paths by stripping the prefix.

### Visual Consistency

All pixel values remain unchanged. This is purely a naming change with no visual impact. Visual regression tests should confirm this.

---

## Success Criteria

The implementation is complete when:

1. ✅ All inset tokens use numeric names (050, 100, 150, 200, 300, 400)
2. ✅ All component prop values use "inset" prefix (inset050, inset100, etc.)
3. ✅ All existing components updated (ButtonCTA, Icon)
4. ✅ All platform generators output new token names
5. ✅ All tests pass with no references to old names
6. ✅ Documentation complete with migration guide
7. ✅ TypeScript enforces valid token values
8. ✅ Visual appearance unchanged
9. ✅ Layout tokens remain unchanged
10. ✅ Build succeeds with no errors
