# Implementation Plan: Shadow and Glow Token System

**Date**: October 23, 2025
**Spec**: shadow-glow-token-system
**Status**: Implementation Planning - Requires Fix Tasks First
**Dependencies**: mathematical-token-system, cross-platform-build-system

---

## Implementation Plan

This implementation plan addresses the incorrect file structure from Task 1.1, then continues with proper shadow and glow token implementation following the Token Category Pattern Guide.

**Current Issue**: Task 1.1 created `src/tokens/shadow/` subdirectory, but primitive tokens should be in `src/tokens/` directly (like SpacingTokens.ts, FontSizeTokens.ts). This mirrors the border-width token issue that required fix tasks.

---

## Task List

- [x] 1.Fix Align Shadow Token File Structure with System Patterns

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Shadow primitive tokens moved to `src/tokens/` (no subdirectory)
  - `src/tokens/shadow/` subdirectory removed
  - `src/tokens/index.ts` updated to import from correct locations
  - All shadow tokens follow Token Category Pattern Guide

  **Primary Artifacts:**
  - `src/tokens/ShadowOffsetTokens.ts` (moved from shadow/ subdirectory)
  - `src/tokens/index.ts` (corrected imports)

  **Completion Documentation:**
  - `.kiro/specs/shadow-glow-token-system/completion/task-1-fix-completion.md`

  - [x] 1.Fix.1 Move ShadowOffsetTokens.ts to correct location
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Move `src/tokens/shadow/ShadowOffsetTokens.ts` to `src/tokens/ShadowOffsetTokens.ts`
    - Update import paths in moved file (change `../types/` to `./types/` if needed)
    - Verify file follows PrimitiveToken interface correctly
    - _Requirements: 1.1_

  - [x] 1.Fix.2 Delete shadow subdirectory and update index
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Delete `src/tokens/shadow/index.ts`
    - Delete `src/tokens/shadow/` directory
    - Update `src/tokens/index.ts` to import from `./ShadowOffsetTokens` (not `./shadow/ShadowOffsetTokens`)
    - Verify no broken imports remain
    - _Requirements: 1.1_

  - [x] 1.Fix.3 Verify shadow offset tokens integration
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run getDiagnostics to verify no errors
    - Verify shadow offset tokens accessible via `getAllTokens()`
    - Verify shadow offset tokens accessible via `getTokensByCategory(TokenCategory.SHADOW)`
    - Create tests in `src/tokens/__tests__/ShadowOffsetTokens.test.ts`
    - _Requirements: 1.1_

- [x] 2. Create Remaining Shadow Primitive Tokens

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - All shadow primitive tokens implemented with PrimitiveToken interface
  - Blur, opacity, spread, and color primitives created
  - All tokens follow base-8 mathematical foundation
  - All tokens integrated with `src/tokens/index.ts`

  **Primary Artifacts:**
  - `src/tokens/ShadowBlurTokens.ts`
  - `src/tokens/ShadowOpacityTokens.ts`
  - `src/tokens/ShadowSpreadTokens.ts`
  - `src/tokens/ShadowColorTokens.ts`

  **Completion Documentation:**
  - `.kiro/specs/shadow-glow-token-system/completion/task-2-completion.md`

  - [x] 2.1 Create shadow blur primitive tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/tokens/ShadowBlurTokens.ts` with PrimitiveToken objects
    - Implement quality-based blur tokens (shadowBlurHard, shadowBlurModerate, shadowBlurSoft)
    - Implement depth-based blur tokens (shadowBlurDepth200, shadowBlurDepth300)
    - Include helper functions and constants
    - Update `src/tokens/index.ts` to export shadow blur tokens
    - _Requirements: 1.2, 4.2, 4.3, 4.4_

  - [x] 2.2 Create shadow opacity primitive tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/tokens/ShadowOpacityTokens.ts` with PrimitiveToken objects
    - Implement quality-based opacity tokens (shadowOpacityHard, shadowOpacityModerate, shadowOpacitySoft)
    - Implement depth-based opacity tokens (shadowOpacityDepth200, shadowOpacityDepth300)
    - Include helper functions and constants
    - Update `src/tokens/index.ts` to export shadow opacity tokens
    - _Requirements: 1.3, 4.2, 4.3, 4.4_

  - [x] 2.3 Add shadow color primitives to ColorTokens.ts
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add shadow color family to existing `src/tokens/ColorTokens.ts`
    - Implement shadowDefault, shadowWarm, shadowCool, shadowAmbient as PrimitiveToken objects
    - Follow existing color token structure (light/dark modes, mode-agnostic for shadows)
    - Include helper functions for shadow colors
    - Update `src/tokens/index.ts` to export shadow color tokens
    - _Requirements: 1.4_

  - [x] 2.4 Add shadow color semantics to semantic/ColorTokens.ts
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add shadow color semantics to existing `src/tokens/semantic/ColorTokens.ts`
    - Implement color.shadow.default, color.shadow.warm, color.shadow.cool, color.shadow.ambient
    - Reference primitive shadow colors using primitiveReferences pattern
    - Follow existing semantic color token structure
    - _Requirements: 1.4, 5.5_

  - [x] 2.5 Update design document with shadow color family architecture
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add "Design Decision: Shadow Color Family Architecture" section to design.md
    - Document rationale for systematic color families vs purpose-based naming
    - Explain shadow color family structure (shadowBlack, shadowBlue, shadowOrange, shadowGray)
    - Note identical values across modes/themes with future flexibility
    - Document trade-offs and architectural consistency benefits
    - _Requirements: 1.4_

  - [x] 2.6 Refactor shadow color primitives to use color families
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    - Refactor shadowColorTokens in `src/tokens/ColorTokens.ts` to use family structure
    - Create shadowBlack100, shadowBlue100, shadowOrange100, shadowGray100 as PrimitiveToken objects
    - Follow existing color family pattern (light/dark modes, base/wcag themes)
    - Use identical values across modes/themes initially (future flexibility maintained)
    - Update helper functions (getShadowColorToken, getAllShadowColorTokens)
    - Remove old shadowDefault, shadowWarm, shadowCool, shadowAmbient tokens
    - Update exports in `src/tokens/index.ts`
    - _Requirements: 1.4_

  - [x] 2.7 Update semantic shadow colors to reference new primitives
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update `src/tokens/semantic/ColorTokens.ts` shadow color primitiveReferences
    - Change color.shadow.default: shadowDefault → shadowBlack100
    - Change color.shadow.warm: shadowWarm → shadowBlue100
    - Change color.shadow.cool: shadowCool → shadowOrange100
    - Change color.shadow.ambient: shadowAmbient → shadowGray100
    - Verify semantic token names remain unchanged (color.shadow.default, etc.)
    - Update token count validation if needed
    - Verify all semantic tokens resolve correctly
    - _Requirements: 1.4, 5.5_

  - [x] 2.8 Update requirements document with shadow color family acceptance criteria
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update Requirement 1.4 acceptance criteria in requirements.md
    - Change from shadowDefault/shadowWarm/shadowCool/shadowAmbient to shadowBlack100/shadowBlue100/shadowOrange100/shadowGray100
    - Update semantic mapping criteria (shadowBlack100 → color.shadow.default, etc.)
    - Maintain art theory rationale (warm light creates cool shadows)
    - Document systematic color family structure benefits
    - _Requirements: 1.4_

- [x] 3. Create Shadow Semantic Tokens

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Shadow semantic tokens created using string reference pattern
  - Standard UI shadows implemented (card, modal, hover, fab)
  - Directional shadows implemented (sunrise, morning, afternoon, sunset variations)
  - All semantic tokens follow semantic/TypographyTokens.ts pattern

  **Primary Artifacts:**
  - `src/tokens/semantic/ShadowTokens.ts`

  **Completion Documentation:**
  - `.kiro/specs/shadow-glow-token-system/completion/task-3-completion.md`

  - [x] 3.1 Create semantic shadow token file and structure
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/tokens/semantic/ShadowTokens.ts`
    - Define semantic token structure using `primitiveReferences` pattern
    - Include helper functions (getShadowToken, getAllShadowTokens)
    - _Requirements: 5.1, 5.2, 5.4_

  - [x] 3.2 Implement standard UI shadow tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement shadow.container (noon, moderate, depth100, color.shadow.default)
    - Implement shadow.modal (noon, moderate, depth200, color.shadow.default)
    - Implement shadow.hover (noon, soft, depth100, color.shadow.default)
    - Implement shadow.fab (sunset, hard, depth300, color.shadow.warm)
    - Reference semantic shadow colors from semantic/ColorTokens.ts
    - _Requirements: 5.1, 5.2, 5.3, 5.5_

  - [x] 3.3 Implement directional shadow tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement sunrise shadow variation (negative offsetX, color.shadow.warm)
    - Implement morning shadow variation (negative offsetX, color.shadow.default)
    - Implement afternoon shadow variation (positive offsetX, color.shadow.default)
    - Implement sunset shadow variation (positive offsetX, color.shadow.warm)
    - Reference appropriate shadow colors based on lighting environment
    - _Requirements: 3.2, 3.3, 3.5, 3.6, 5.1, 5.5_

- [x] 4. Create Glow Primitive Tokens

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Glow primitive tokens implemented with PrimitiveToken interface
  - Blur, opacity, spread, and color primitives created
  - All tokens follow base-8 mathematical foundation
  - Primitives support future multi-layer glow architecture

  **Primary Artifacts:**
  - `src/tokens/GlowBlurTokens.ts`
  - `src/tokens/GlowOpacityTokens.ts`
  - `src/tokens/GlowSpreadTokens.ts`
  - `src/tokens/GlowColorTokens.ts`

  **Completion Documentation:**
  - `.kiro/specs/shadow-glow-token-system/completion/task-4-completion.md`

  - [x] 4.1 Create glow blur primitive tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/tokens/GlowBlurTokens.ts` with PrimitiveToken objects
    - Implement extended blur range (100: 8, 200: 16, 300: 24, 400: 32, 500: 40)
    - Include helper functions and constants
    - Update `src/tokens/index.ts` to export glow blur tokens
    - _Requirements: 2.1_

  - [x] 4.2 Create glow opacity primitive tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/tokens/GlowOpacityTokens.ts` with PrimitiveToken objects
    - Implement decreasing progression (100: 0.8, 200: 0.6, 300: 0.4, 400: 0.2)
    - Include helper functions and constants
    - Update `src/tokens/index.ts` to export glow opacity tokens
    - _Requirements: 2.2_

  - [x] 4.3 Add glow color semantics to semantic/ColorTokens.ts
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add glow color semantics to existing `src/tokens/semantic/ColorTokens.ts`
    - Implement glow.neonPurple, glow.neonCyan, glow.neonYellow
    - Reference existing vibrant primitive colors (purple500, cyan500, yellow500)
    - Follow existing semantic color token structure
    - _Requirements: 2.3_

- [x] 5. Implement Cross-Platform Shadow Translation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Shadow tokens translate to CSS box-shadow format for web
  - Shadow tokens translate to iOS shadowOffset/shadowRadius/shadowOpacity
  - Shadow tokens translate to Android elevation or custom drawable
  - Platform-specific limitations documented

  **Primary Artifacts:**
  - `src/build/platforms/WebShadowGenerator.ts`
  - `src/build/platforms/IOSShadowGenerator.ts`
  - `src/build/platforms/AndroidShadowGenerator.ts`

  **Completion Documentation:**
  - `.kiro/specs/shadow-glow-token-system/completion/task-5-completion.md`

  - [x] 5.1 Implement web CSS shadow translation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `WebShadowGenerator.ts` with CSS translation function
    - Translate shadow tokens to box-shadow format
    - Generate CSS custom properties for shadow tokens
    - _Requirements: 6.1_

  - [x] 5.2 Implement iOS Swift shadow translation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `IOSShadowGenerator.ts` with Swift translation function
    - Translate to shadowOffset, shadowRadius, shadowOpacity, shadowColor
    - Document that spread is not supported on iOS
    - _Requirements: 6.2, 6.5_

  - [x] 5.3 Implement Android Kotlin shadow translation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `AndroidShadowGenerator.ts` with Kotlin translation function
    - Implement elevation approximation strategy
    - Document Android shadow limitations
    - _Requirements: 6.3, 6.4_

- [x] 6. Create Token Documentation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Shadow token usage documented with examples
  - Lighting framework concepts explained
  - Cross-platform translation strategies documented
  - Token system overview updated with shadow/glow tokens

  **Primary Artifacts:**
  - `docs/tokens/shadow-tokens.md`
  - `docs/tokens/glow-tokens.md`
  - `docs/token-system-overview.md` (updated)

  **Completion Documentation:**
  - `.kiro/specs/shadow-glow-token-system/completion/task-6-completion.md`

  - [x] 6.1 Create shadow token usage documentation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `docs/tokens/shadow-tokens.md` with token reference
    - Document all shadow primitives with examples
    - Document all shadow semantic tokens with use cases
    - Provide code examples for web, iOS, Android
    - _Requirements: 3.1, 4.1, 5.1_

  - [x] 6.2 Create glow token documentation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `docs/tokens/glow-tokens.md` with primitive reference
    - Document all glow primitives with examples
    - Note that semantic glows are future scope
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 8.5_

  - [x] 6.3 Update token system overview
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update `docs/token-system-overview.md` with shadow/glow tokens
    - Add shadow and glow sections to primitive tokens
    - Link to lighting framework guide
    - _Requirements: 3.1, 4.1_

---

*This implementation plan corrects the file structure issues from Task 1.1, then implements the complete Shadow and Glow token system following the Token Category Pattern Guide.*
