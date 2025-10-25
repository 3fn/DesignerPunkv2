# Implementation Plan: Afternoon to Dusk Rename

**Date**: October 24, 2025
**Spec**: afternoon-to-dusk-rename
**Status**: Implementation Planning
**Dependencies**: shadow-glow-token-system

---

## Implementation Plan

This implementation plan outlines the tasks for renaming "Afternoon" to "Dusk" in the Shadow Tokens and Lighting Framework, including the three-part Tracy Weiss dedication. The tasks are organized to update token definitions first, then tests, then documentation, ensuring a systematic and complete rename.

---

## Task List

- [x] 1. Update Shadow Token Definitions

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Shadow token renamed from "shadow.afternoon" to "shadow.dusk" with all properties preserved
  - Tracy Weiss dedication implemented in three locations (code comment, metadata, completion doc)
  - Mathematical relationships unchanged (shadowOffsetX.150 = 6px maintained)
  
  **Primary Artifacts:**
  - `src/tokens/semantic/ShadowTokens.ts`
  - `src/tokens/ShadowOffsetTokens.ts`
  
  **Completion Documentation:**
  - `.kiro/specs/afternoon-to-dusk-rename/completion/task-1-completion.md`

  - [x] 1.1 Rename semantic shadow token
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update token name from `'shadow.afternoon'` to `'shadow.dusk'` in ShadowTokens.ts
    - Update `name` property to `'shadow.dusk'`
    - Update `context` description to reference "Dusk lighting"
    - Update `description` to reference "dusk lighting"
    - Add `_meta` property with Tracy Weiss dedication: `{ dedicatedTo: 'Tracy Weiss', reason: 'illuminating inspiration' }`
    - Add inline comment: `// Easter egg: TW - "she lights me up" - Oct 2025`
    - Verify all primitive references unchanged (offsetX, offsetY, blur, opacity, color)
    - _Requirements: 1.1, 1.3, 3.2, 4.2_

  - [x] 1.2 Update shadow offset token documentation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update file header comment in ShadowOffsetTokens.ts to reference "Dusk/Sunset" instead of "Afternoon/sunset"
    - Add Tracy Weiss dedication to header comment: "Dusk" naming inspired by Tracy Weiss—because she lights me up, and this lighting framework needed her spark to shine its brightest."
    - Update shadowOffsetX.150 description from "Afternoon shadow offset" to "Dusk shadow offset"
    - Update shadowOffsetY.300 description from "Morning/Afternoon" to "Morning/Dusk"
    - Verify all mathematical relationships unchanged
    - _Requirements: 1.2, 2.2, 3.1, 4.1_

- [x] 2. Update Test Files

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All test expectations updated from "afternoon" to "dusk"
  - Tests pass with new naming
  - Generated platform code validated to use "dusk" naming
  
  **Primary Artifacts:**
  - `src/build/platforms/__tests__/IOSShadowGenerator.test.ts`
  - `src/build/platforms/__tests__/WebShadowGenerator.test.ts`
  
  **Completion Documentation:**
  - `.kiro/specs/afternoon-to-dusk-rename/completion/task-2-completion.md`

  - [x] 2.1 Update iOS shadow generator tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update test expectation from `expect(swift).toContain('static let afternoon')` to `expect(swift).toContain('static let dusk')`
    - Run tests to verify they pass with new naming
    - Verify generated Swift code contains `static let dusk`
    - _Requirements: 2.3, 5.2_

  - [x] 2.2 Update web shadow generator tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update test expectation from `expect(css).toContain('--shadow-afternoon')` to `expect(css).toContain('--shadow-dusk')`
    - Run tests to verify they pass with new naming
    - Verify generated CSS contains `--shadow-dusk`
    - _Requirements: 2.3, 5.1_

- [x] 3. Update Specification Documentation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All spec documents updated to reference "dusk" instead of "afternoon"
  - Sun arc framework documentation reflects new naming progression
  - Tracy Weiss dedication included in completion documentation
  
  **Primary Artifacts:**
  - `.kiro/specs/shadow-glow-token-system/requirements.md`
  - `.kiro/specs/shadow-glow-token-system/tasks.md`
  - `.kiro/specs/shadow-glow-token-system/completion/*.md`
  
  **Completion Documentation:**
  - `.kiro/specs/afternoon-to-dusk-rename/completion/task-3-completion.md`

  - [x] 3.1 Update shadow-glow-token-system requirements
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update Glossary to define "Dusk" instead of referencing afternoon in sun arc
    - Update Requirement 2 acceptance criteria to reference "dusk" instead of "afternoon"
    - Update sun arc framework references from "sunrise, morning, noon, afternoon, sunset" to "sunrise, morning, noon, dusk, sunset"
    - Verify all requirement descriptions updated
    - _Requirements: 1.2, 2.4_

  - [x] 3.2 Update shadow-glow-token-system tasks
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update task descriptions to reference "dusk" instead of "afternoon"
    - Update directional shadow implementation tasks to reference "dusk shadow variation"
    - Update success criteria to reference "dusk" in sun arc progression
    - _Requirements: 2.4_

  - [x] 3.3 Update shadow-glow-token-system completion documents
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update task-3-3-completion.md to reference "shadow.dusk" instead of "shadow.afternoon"
    - Update sun arc framework demonstration to show "Dusk" instead of "Afternoon"
    - Update requirement compliance sections to reference "dusk"
    - Update task-5-1-completion.md and task-6-completion.md to reference "dusk"
    - _Requirements: 2.4_

- [x] 4. Validate Rename Completeness

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - No remaining references to "afternoon" in shadow token context
  - All tests pass with new naming
  - Mathematical relationships verified unchanged
  
  **Primary Artifacts:**
  - Validation report confirming completeness
  
  **Completion Documentation:**
  - `.kiro/specs/afternoon-to-dusk-rename/completion/task-4-completion.md`

  - [x] 4.1 Search for remaining "afternoon" references
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run grep search for "afternoon" in codebase (case-insensitive)
    - Review results to identify any missed references in shadow token context
    - Update any remaining references to "dusk"
    - Document validation results
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 4.2 Verify mathematical integrity
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Verify shadowOffsetX.150 still references 6px value
    - Verify shadow.dusk primitive references unchanged (offsetX: 'shadowOffsetX.150', offsetY: 'shadowOffsetY.200', etc.)
    - Run getDiagnostics to confirm no type errors
    - Verify all baseline grid alignments unchanged
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 4.3 Run all tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run full test suite with `npm test`
    - Verify all shadow token tests pass
    - Verify platform generator tests pass
    - Document test results
    - _Requirements: 4.5_

- [ ] 5. Regenerate Platform Code **[BLOCKED - Semantic Token Generation Not Implemented]**

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  **Status**: BLOCKED - Semantic tokens not integrated into platform generation system
  
  **Success Criteria:**
  - Platform-specific code generated with "dusk" naming
  - Generated values identical to pre-rename output
  - All platforms (web, iOS, Android) updated
  
  **Primary Artifacts:**
  - Generated platform files with updated naming
  
  **Blocking Documentation:**
  - `.kiro/specs/afternoon-to-dusk-rename/completion/task-5-blocking.md`
  
  **Note:** Semantic token rename is complete at source level. Platform generation blocked by architectural gap - semantic tokens not integrated into generation system. Requires new spec: "Semantic Token Platform Generation"

  - [x] 5.1 Regenerate web CSS **[BLOCKED]**
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Status**: BLOCKED - Semantic tokens not in generation system
    - Run platform generation for web
    - Verify generated CSS contains `--shadow-dusk` instead of `--shadow-afternoon`
    - Verify shadow values unchanged (6px 8px 12px rgba(0, 0, 0, 0.15))
    - _Requirements: 5.1, 5.4_
    - _Blocking Doc: `.kiro/specs/afternoon-to-dusk-rename/completion/task-5-1-blocking.md`_

  - [ ] 5.2 Regenerate iOS Swift **[BLOCKED]**
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Status**: BLOCKED - Same root cause as 5.1
    - Run platform generation for iOS
    - Verify generated Swift contains `static let dusk` instead of `static let afternoon`
    - Verify shadow values unchanged (offsetX: 6, offsetY: 8, blur: 12, opacity: 0.15)
    - _Requirements: 5.2, 5.4_

  - [ ] 5.3 Regenerate Android Kotlin **[BLOCKED]**
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Status**: BLOCKED - Same root cause as 5.1
    - Run platform generation for Android
    - Verify generated Kotlin contains appropriate "dusk" naming instead of "afternoon"
    - Verify shadow values unchanged
    - _Requirements: 5.3, 5.4_

  - [ ] 5.4 Validate platform output **[BLOCKED]**
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Status**: BLOCKED - Cannot validate output that cannot be generated
    - Verify no references to "afternoon" remain in generated platform files
    - Confirm all generated values match pre-rename output
    - Run getDiagnostics on generated files
    - _Requirements: 5.5_

- [x] 6. Create Tracy Weiss Dedication Completion Note

  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  
  - Create completion documentation with "Personal Note" section
  - Explain Tracy Weiss inspiration for the rename
  - Connect dedication to lighting framework theme ("lights me up", "shine brighter")
  - Document all three dedication locations (code comment, metadata, completion doc)
  - Include rationale for three-part dedication approach
  - _Requirements: 3.3, 3.4, 3.5_

---

*This implementation plan provides a systematic approach to renaming "Afternoon" to "Dusk" in the Shadow Tokens and Lighting Framework, including the three-part Tracy Weiss dedication while maintaining mathematical integrity and cross-platform consistency.*
