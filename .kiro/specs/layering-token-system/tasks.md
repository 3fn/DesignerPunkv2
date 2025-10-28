# Implementation Plan: Layering Token System

**Date**: October 28, 2025
**Spec**: layering-token-system
**Status**: Implementation Planning
**Dependencies**: shadow-glow-token-system, semantic-token-generation

---

## Implementation Plan

This implementation plan converts the Layering Token System design into actionable coding tasks. The plan follows an incremental approach: create token definitions, integrate with existing systems, update shadow tokens for Android compatibility, and validate cross-platform generation.

---

## Task List

- [x] 1. Create Z-Index Token Definitions (Web + iOS)

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Z-Index tokens defined with semantic-only structure
  - Six semantic levels implemented (container, navigation, dropdown, modal, toast, tooltip)
  - Platform metadata correctly specifies web and iOS support
  - Helper functions provide token access and retrieval
  
  **Primary Artifacts:**
  - `src/tokens/semantic/ZIndexTokens.ts`
  
  **Completion Documentation:**
  - `.kiro/specs/layering-token-system/completion/task-1-completion.md`

  - [x] 1.1 Create ZIndexTokens.ts file structure
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create `src/tokens/semantic/ZIndexTokens.ts` file
    - Add file header documentation explaining z-index tokens for web/iOS
    - Import SemanticToken and SemanticCategory types
    - _Requirements: 3.1, 10.2_

  - [x] 1.2 Implement z-index token definitions
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Define zIndexTokens object with six semantic levels
    - Each token includes name, value, platforms array, category, context, description
    - Use 100-based scale (100, 200, 300, 400, 500, 600)
    - Platform metadata specifies ['web', 'ios']
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 3.2, 5.1, 5.2, 5.3_

  - [x] 1.3 Implement helper functions
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create getZIndexToken() function for single token retrieval
    - Create getAllZIndexTokens() function for all tokens
    - Export zIndexTokenNames array
    - _Requirements: 3.1_

- [ ] 2. Create Elevation Token Definitions (Android)

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Elevation tokens defined with semantic-only structure
  - Six semantic levels implemented matching z-index semantic names
  - Platform metadata correctly specifies Android support
  - Shadow references documented for cross-platform alignment
  
  **Primary Artifacts:**
  - `src/tokens/semantic/ElevationTokens.ts`
  
  **Completion Documentation:**
  - `.kiro/specs/layering-token-system/completion/task-2-completion.md`

  - [x] 2.1 Create ElevationTokens.ts file structure
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create `src/tokens/semantic/ElevationTokens.ts` file
    - Add file header documentation explaining elevation tokens for Android
    - Import SemanticToken and SemanticCategory types
    - _Requirements: 4.1, 10.2_

  - [ ] 2.2 Implement elevation token definitions
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Define elevationTokens object with six semantic levels
    - Each token includes name, value, platforms array, category, shadowReference, context, description
    - Use Material Design scale (4dp, 8dp, 16dp, 24dp)
    - Platform metadata specifies ['android']
    - Shadow references align with semantic names (e.g., 'shadow.modal')
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 4.2, 4.5, 5.1, 5.2, 5.4, 11.1, 11.2_

  - [ ] 2.3 Implement helper functions
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create getElevationToken() function for single token retrieval
    - Create getAllElevationTokens() function for all tokens
    - Export elevationTokenNames array
    - _Requirements: 4.1_

- [ ] 3. Create LayeringTokens Unified Entry Point

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Note**: This task was added after Task 1 implementation to establish clearer conceptual unity between ZIndexTokens and ElevationTokens. See Design.md Decision 6 for rationale.
  
  **Success Criteria:**
  - LayeringTokens.ts index file created with unified API
  - Re-exports all tokens and helpers from ZIndexTokens and ElevationTokens
  - Cross-references added to ZIndexTokens.ts and ElevationTokens.ts headers
  - Documentation explains relationship between token sets
  
  **Primary Artifacts:**
  - `src/tokens/semantic/LayeringTokens.ts`
  - Updated `src/tokens/semantic/ZIndexTokens.ts` (header)
  - Updated `src/tokens/semantic/ElevationTokens.ts` (header, when created)
  
  **Completion Documentation:**
  - `.kiro/specs/layering-token-system/completion/task-3-completion.md`

  - [ ] 3.1 Create LayeringTokens.ts index file
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/tokens/semantic/LayeringTokens.ts` file
    - Add comprehensive header documentation explaining Layering Token System
    - Re-export all exports from ZIndexTokens.ts
    - Re-export all exports from ElevationTokens.ts (when available)
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [ ] 3.2 Implement unified helper functions
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create getAllLayeringTokens() function returning both token sets
    - Create getLayeringTokensByPlatform() function for platform-specific access
    - Export all helper functions
    - _Requirements: 7.1, 7.3_

  - [ ] 3.3 Update ZIndexTokens.ts header with cross-reference
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add "Part of the Layering Token System" to header
    - Add cross-reference to ElevationTokens.ts for Android
    - Keep cross-reference minimal (file name only, no path)
    - _Requirements: 7.5_

  - [ ] 3.4 Update semantic token index to export LayeringTokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update `src/tokens/semantic/index.ts` to export from LayeringTokens.ts
    - Ensure all layering tokens accessible through semantic token index
    - _Requirements: 7.1, 7.2_

- [ ] 4. Update Shadow Tokens for Android Elevation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Shadow tokens include android.elevation values
  - Elevation values align with Material Design scale
  - Cross-platform visual consistency maintained
  
  **Primary Artifacts:**
  - `src/tokens/semantic/ShadowTokens.ts`
  
  **Completion Documentation:**
  - `.kiro/specs/layering-token-system/completion/task-4-completion.md`

  - [ ] 4.1 Add platforms property to shadow token structure
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update shadow token definitions to include platforms object
    - Add web, ios, and android platform-specific properties
    - Maintain existing primitive references for web/iOS
    - _Requirements: 11.3, 11.4_

  - [ ] 4.2 Add Android elevation values to shadow tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add android.elevation property to shadow.container (8dp)
    - Add android.elevation property to shadow.navigation (4dp)
    - Add android.elevation property to shadow.dropdown (8dp)
    - Add android.elevation property to shadow.modal (16dp)
    - Add android.elevation property to shadow.toast (24dp)
    - Add android.elevation property to shadow.tooltip (24dp)
    - _Requirements: 11.3, 11.4, 11.5_

- [ ] 5. Integrate with Cross-Platform Build System

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - TokenFileGenerator processes layering tokens
  - Platform-specific output files generated correctly
  - Platform naming conventions applied
  - Generated code is syntactically correct
  
  **Primary Artifacts:**
  - `src/generators/TokenFileGenerator.ts`
  - `src/providers/WebFormatGenerator.ts`
  - `src/providers/iOSFormatGenerator.ts`
  - `src/providers/AndroidFormatGenerator.ts`
  
  **Completion Documentation:**
  - `.kiro/specs/layering-token-system/completion/task-5-completion.md`

  - [ ] 5.1 Update TokenFileGenerator to process layering tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Import layering token functions from semantic index
    - Add layering token processing to generation pipeline
    - Route z-index tokens to web/iOS generators
    - Route elevation tokens to Android generator
    - _Requirements: 10.1, 10.2_

  - [ ] 5.2 Update WebFormatGenerator for z-index tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add z-index token formatting logic
    - Generate CSS custom properties with --z-index- prefix
    - Apply kebab-case naming convention
    - Output format: --z-index-modal: 400;
    - _Requirements: 10.1, 10.5_

  - [ ] 5.3 Update iOSFormatGenerator for z-index tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add z-index token formatting logic
    - Generate Swift constants with CGFloat type
    - Apply camelCase naming convention
    - Scale values down (divide by 100) for SwiftUI conventions
    - Output format: static let zIndexModal: CGFloat = 4
    - _Requirements: 10.1, 10.5_

  - [ ] 5.4 Update AndroidFormatGenerator for elevation tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add elevation token formatting logic
    - Generate Kotlin constants with .dp suffix
    - Apply snake_case naming convention
    - Output format: val elevation_modal = 16.dp
    - _Requirements: 10.1, 10.5_

- [ ] 6. Create Documentation and Examples

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Documentation explains layering token architecture
  - Platform-specific usage examples provided
  - AI agent generation rules documented
  - Edge case handling documented with code examples
  
  **Primary Artifacts:**
  - `docs/tokens/layering-tokens.md`
  - Updated `docs/token-system-overview.md`
  
  **Completion Documentation:**
  - `.kiro/specs/layering-token-system/completion/task-6-completion.md`

  - [ ] 6.1 Create layering tokens documentation guide
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create docs/tokens/layering-tokens.md
    - Explain semantic-only architecture and rationale
    - Document z-index tokens (web/iOS) with usage examples
    - Document elevation tokens (Android) with usage examples
    - Explain shadow token integration
    - Document edge case handling with code examples
    - _Requirements: 8.4, 9.3, 9.4, 12.5_

  - [ ] 6.2 Update token system overview
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add layering tokens section to docs/token-system-overview.md
    - Link to layering tokens documentation guide
    - Explain two token sets (z-index and elevation)
    - Note semantic-only architecture exception
    - _Requirements: 9.3, 12.5_

  - [ ] 6.3 Document AI agent generation rules
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create AI agent system prompt section in layering-tokens.md
    - Document platform-specific token usage rules
    - Provide generation decision tree
    - Include conversation examples for common scenarios
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 9.4_

- [ ] 7. Validate Cross-Platform Generation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Generated web CSS includes z-index tokens with correct format
  - Generated iOS Swift includes z-index tokens with scaled values
  - Generated Android Kotlin includes elevation tokens with correct format
  - Platform naming conventions applied correctly
  - No syntax errors in generated code
  
  **Primary Artifacts:**
  - Generated platform files (web, iOS, Android)
  
  **Completion Documentation:**
  - `.kiro/specs/layering-token-system/completion/task-7-completion.md`

  - [ ] 7.1 Generate and validate web output
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run build system to generate web CSS file
    - Verify z-index tokens present with --z-index- prefix
    - Verify kebab-case naming (--z-index-modal)
    - Verify values match token definitions (400, etc.)
    - Run getDiagnostics to check for syntax errors
    - _Requirements: 10.2, 10.5_

  - [ ] 7.2 Generate and validate iOS output
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run build system to generate iOS Swift file
    - Verify z-index tokens present with CGFloat type
    - Verify camelCase naming (zIndexModal)
    - Verify values are scaled down (4 instead of 400)
    - Run getDiagnostics to check for syntax errors
    - _Requirements: 10.2, 10.5_

  - [ ] 7.3 Generate and validate Android output
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run build system to generate Android Kotlin file
    - Verify elevation tokens present with .dp suffix
    - Verify snake_case naming (elevation_modal)
    - Verify values match Material Design scale (16.dp)
    - Run getDiagnostics to check for syntax errors
    - _Requirements: 10.2, 10.5_

---

*This implementation plan provides actionable coding tasks for implementing the Layering Token System with platform-specific token sets, cross-platform generation, and comprehensive documentation.*
