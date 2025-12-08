# Implementation Plan: Color Palette & Display Font Update

**Date**: December 8, 2025  
**Spec**: 015 - Color Palette & Display Font Update  
**Status**: Implementation Planning  
**Dependencies**: None

---

## Implementation Plan

This implementation plan converts the color palette and display font design into actionable coding tasks. The update leverages the existing token architecture to deliver significant visual impact with minimal code changes.

**Key Strategy**: Update primitive tokens (green/pink colors, Rajdhani font) and let semantic tokens and components inherit automatically through the token system.

---

## Task List

- [x] 1. Update Primitive Color Tokens

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Green and pink color families added with all 5 variants (100-500)
  - Violet color family removed completely
  - All color tokens follow existing format with mode-aware values
  - Token generation produces correct platform-specific output
  - All tests pass
  
  **Primary Artifacts:**
  - `src/tokens/ColorTokens.ts` (updated)
  - Generated platform files with green/pink colors
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/015-color-palette-update/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/015-color-palette-update/task-1-summary.md` (triggers release detection)

  - [x] 1.1 Add green color family primitive tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add green100-500 tokens to `ColorTokens.ts`
    - Follow existing color token format with mode-aware values (light/dark, base/wcag)
    - Include all metadata fields (baseValue, familyBaseValue, mathematicalRelationship, etc.)
    - Use electric green base color (#00FF88 for green400)
    - _Requirements: 1.1, 1.4_

  - [x] 1.2 Add pink color family primitive tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add pink100-500 tokens to `ColorTokens.ts`
    - Follow existing color token format with mode-aware values (light/dark, base/wcag)
    - Include all metadata fields matching existing color families
    - Use hot pink base color (#FF1493 for pink400)
    - _Requirements: 1.2, 1.4_

  - [x] 1.3 Remove violet color family primitive tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Remove violet100-500 tokens from `ColorTokens.ts`
    - Remove violetTokens export from ColorTokens
    - Update ColorTokens export to exclude violet family
    - _Requirements: 1.3_

  - [x] 1.4 Write unit tests for new color families
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test green family has 5 variants with correct hex values
    - Test pink family has 5 variants with correct hex values
    - Test violet family is completely removed
    - Test mode-aware values (light/dark, base/wcag) for green/pink
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 1.5 Verify cross-platform token generation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run build system to generate platform-specific tokens
    - Verify web CSS includes green/pink, excludes violet
    - Verify iOS Swift includes green/pink, excludes violet
    - Verify Android Kotlin includes green/pink, excludes violet
    - _Requirements: 1.5, 9.1, 9.2, 9.3, 9.4_

- [x] 2. Update Semantic Color Tokens

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All semantic color tokens updated to reference new primitives
  - color.secondary token removed
  - New semantic tokens added (attention, highlight, tech, data, glow variants)
  - Components automatically inherit new colors through token references
  - All tests pass
  
  **Primary Artifacts:**
  - `src/tokens/semantic/ColorTokens.ts` (updated)
  - Updated semantic token mappings
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/015-color-palette-update/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/015-color-palette-update/task-2-summary.md` (triggers release detection)

  - [x] 2.1 Update success semantic tokens to green
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update `color.success.strong` to reference `green400` (was cyan400)
    - Update `color.success.subtle` to reference `green100` (was cyan100)
    - Verify semantic token references resolve correctly
    - _Requirements: 2.1, 2.7_

  - [x] 2.2 Update error semantic tokens to pink
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update `color.error.strong` to reference `pink400` (was orange300)
    - Add `color.error.subtle` referencing `pink100` (new token)
    - Verify semantic token references resolve correctly
    - _Requirements: 2.2, 2.7_

  - [x] 2.3 Update warning semantic tokens to amber
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update `color.warning.strong` to reference `amber400` (was yellow400)
    - Update `color.warning.subtle` to reference `amber100` (was yellow100)
    - Verify semantic token references resolve correctly
    - _Requirements: 2.3, 2.7_

  - [x] 2.4 Add new semantic tokens for yellow, cyan, and glow
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add `color.attention` referencing `yellow400`
    - Add `color.highlight` referencing `yellow300`
    - Add `color.tech` referencing `cyan400`
    - Add `color.data` referencing `cyan300`
    - Add `glow.neonGreen` referencing `green500`
    - Add `glow.neonPink` referencing `pink500`
    - _Requirements: 2.4, 2.5_

  - [x] 2.5 Remove color.secondary semantic token
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Remove `color.secondary` token from semantic color tokens
    - Search codebase for any usage of `color.secondary`
    - Document any components that need migration
    - _Requirements: 2.6_

  - [x] 2.6 Write unit tests for semantic token updates
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test success tokens reference green primitives
    - Test error tokens reference pink primitives
    - Test warning tokens reference amber primitives
    - Test new attention/highlight/tech/data tokens exist
    - Test color.secondary is removed
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [x] 3. Add Font File Assets

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Inter and Rajdhani font files added to project
  - All required weights (Regular, Medium, SemiBold, Bold) included
  - All required formats (TTF, WOFF, WOFF2) included
  - Files organized in correct directory structure
  - All tests pass
  
  **Primary Artifacts:**
  - `src/assets/fonts/inter/` directory with font files
  - `src/assets/fonts/rajdhani/` directory with font files
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/015-color-palette-update/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/015-color-palette-update/task-3-summary.md` (triggers release detection)

  - [x] 3.1 Create font assets directory structure
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create `src/assets/` directory if it doesn't exist
    - Create `src/assets/fonts/` directory
    - Create `src/assets/fonts/inter/` subdirectory
    - Create `src/assets/fonts/rajdhani/` subdirectory
    - _Requirements: 5.1, 5.4_

  - [x] 3.2 Add Inter font files
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Download Inter font files (Regular, Medium, SemiBold, Bold) | Note from Peter: "I've downloaded the lastest font package and added it to the root directory: Inter-4"
    - Add TTF files to `src/assets/fonts/inter/`
    - Add WOFF files to `src/assets/fonts/inter/`
    - Add WOFF2 files to `src/assets/fonts/inter/`
    - Verify all 12 files present (4 weights × 3 formats)
    - _Requirements: 5.2, 5.4, 5.5_

  - [x] 3.3 Add Rajdhani font files
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Download Rajdhani font files (Regular, Medium, SemiBold, Bold) | Note from Peter: "I've added a collection of files for the font and added them to src/assets/fonts/rajdhani"
    - Add TTF files to `src/assets/fonts/rajdhani/`
    - Add WOFF files to `src/assets/fonts/rajdhani/`
    - Add WOFF2 files to `src/assets/fonts/rajdhani/`
    - Verify all 12 files present (4 weights × 3 formats)
    - _Requirements: 5.3, 5.4, 5.5_

- [ ] 4. Update Font Family Primitive Tokens

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - fontFamilyDisplay updated to reference Rajdhani
  - fontFamilyBody updated to reference Inter
  - All 15 semantic typography tokens automatically inherit Rajdhani
  - Token generation produces correct platform-specific output
  - All tests pass
  
  **Primary Artifacts:**
  - `src/tokens/FontFamilyTokens.ts` (updated)
  - Generated platform files with Rajdhani/Inter fonts
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/015-color-palette-update/completion/task-4-parent-completion.md`
  - Summary: `docs/specs/015-color-palette-update/task-4-summary.md` (triggers release detection)

  - [ ] 4.1 Update fontFamilyDisplay to Rajdhani
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update `fontFamilyDisplay` in `FontFamilyTokens.ts`
    - Change font stack to: `'Rajdhani, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'`
    - Verify all 15 semantic typography tokens automatically inherit Rajdhani
    - _Requirements: 4.1, 4.2, 4.5_

  - [ ] 4.2 Update fontFamilyBody to Inter
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update `fontFamilyBody` in `FontFamilyTokens.ts`
    - Ensure font stack includes: `'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'`
    - Verify body typography tokens reference Inter correctly
    - _Requirements: 4.3, 4.4_

  - [ ]* 4.3 Write unit tests for font family tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test fontFamilyDisplay references Rajdhani
    - Test fontFamilyBody references Inter
    - Test font stacks include proper fallbacks
    - Test platform-specific generation includes both fonts
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [ ] 4.4 Verify cross-platform font token generation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run build system to generate platform-specific tokens
    - Verify web CSS includes Rajdhani and Inter font stacks
    - Verify iOS Swift includes Rajdhani and Inter references
    - Verify Android Kotlin includes Rajdhani and Inter references
    - _Requirements: 4.4, 9.1, 9.2, 9.3, 9.5_

- [ ] 5. Configure Web Font Loading

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - @font-face declarations created for all Inter and Rajdhani weights
  - Fonts load correctly in web browsers
  - Fallback fonts work when custom fonts unavailable
  - font-display: swap prevents invisible text
  - All tests pass
  
  **Primary Artifacts:**
  - Web font configuration file with @font-face declarations
  - Font loading tests
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/015-color-palette-update/completion/task-5-parent-completion.md`
  - Summary: `docs/specs/015-color-palette-update/task-5-summary.md` (triggers release detection)

  - [ ] 5.1 Create @font-face declarations for Inter
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create @font-face declarations for Inter Regular, Medium, SemiBold, Bold
    - Use font-display: swap for all declarations
    - Prioritize WOFF2 format over WOFF
    - Reference correct font file paths in src/assets/fonts/inter/
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [ ] 5.2 Create @font-face declarations for Rajdhani
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create @font-face declarations for Rajdhani Regular, Medium, SemiBold, Bold
    - Use font-display: swap for all declarations
    - Prioritize WOFF2 format over WOFF
    - Reference correct font file paths in src/assets/fonts/rajdhani/
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [ ]* 5.3 Write font loading tests for web
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test Rajdhani fonts load successfully
    - Test Inter fonts load successfully
    - Test fallback fonts work when custom fonts unavailable
    - Test font-display: swap prevents FOIT
    - _Requirements: 6.1, 6.2, 6.5_

- [ ] 6. Configure iOS Font Integration

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Font files bundled in iOS app
  - Info.plist configured with all font files
  - Custom fonts load correctly in iOS
  - Fallback to SF Pro fonts works correctly
  - All tests pass
  
  **Primary Artifacts:**
  - iOS Info.plist with font configuration
  - iOS font loading validation
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/015-color-palette-update/completion/task-6-parent-completion.md`
  - Summary: `docs/specs/015-color-palette-update/task-6-summary.md` (triggers release detection)

  - [ ] 6.1 Update iOS Info.plist with font files
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add Inter font files to UIAppFonts array (Inter-Regular.ttf, Inter-Medium.ttf, Inter-SemiBold.ttf, Inter-Bold.ttf)
    - Add Rajdhani font files to UIAppFonts array (Rajdhani-Regular.ttf, Rajdhani-Medium.ttf, Rajdhani-SemiBold.ttf, Rajdhani-Bold.ttf)
    - Verify all 8 font files listed in Info.plist
    - _Requirements: 7.1, 7.2_

  - [ ] 6.2 Create iOS font loading documentation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Document SwiftUI usage: `.custom("Rajdhani", size:)` for display text
    - Document SwiftUI usage: `.custom("Inter", size:)` for body text
    - Document fallback behavior (SF Pro Display/Text)
    - Document font weight mapping (Regular=400, Medium=500, SemiBold=600, Bold=700)
    - _Requirements: 7.3, 7.4, 7.5_

  - [ ]* 6.3 Write iOS font loading validation tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test custom fonts are available in bundle
    - Test font weight mapping works correctly
    - Test fallback fonts work when custom fonts unavailable
    - _Requirements: 7.1, 7.2, 7.5_

- [ ] 7. Configure Android Font Integration

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Font files added to Android res/font/ directory
  - FontFamily objects created for Inter and Rajdhani
  - Custom fonts load correctly in Android
  - Fallback to Roboto works correctly
  - All tests pass
  
  **Primary Artifacts:**
  - Android font resources in res/font/
  - Android FontFamily configuration
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/015-color-palette-update/completion/task-7-parent-completion.md`
  - Summary: `docs/specs/015-color-palette-update/task-7-summary.md` (triggers release detection)

  - [ ] 7.1 Add font files to Android resources
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Copy Inter TTF files to `app/src/main/res/font/` with lowercase names (inter_regular.ttf, inter_medium.ttf, inter_semibold.ttf, inter_bold.ttf)
    - Copy Rajdhani TTF files to `app/src/main/res/font/` with lowercase names (rajdhani_regular.ttf, rajdhani_medium.ttf, rajdhani_semibold.ttf, rajdhani_bold.ttf)
    - Verify all 8 font files present in res/font/
    - _Requirements: 8.1_

  - [ ] 7.2 Create Android FontFamily configuration
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create FontFamily object for Inter with all weights
    - Create FontFamily object for Rajdhani with all weights
    - Document Jetpack Compose usage: `fontFamily = rajdhaniFamily` for display
    - Document Jetpack Compose usage: `fontFamily = interFamily` for body
    - _Requirements: 8.2, 8.3_

  - [ ]* 7.3 Write Android font loading validation tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test font resources exist in res/font/
    - Test FontFamily objects can be instantiated
    - Test font weight mapping works correctly
    - Test fallback to Roboto when custom fonts unavailable
    - _Requirements: 8.1, 8.2, 8.4, 8.5_

- [ ] 8. Checkpoint - Verify Token System Integration

  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  
  - Run full test suite to verify all token changes
  - Verify build system generates correct platform-specific files
  - Check for any broken token references
  - Ensure all tests pass before proceeding to component validation
  - _Requirements: All previous requirements_

- [ ] 9. Component Migration and Validation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All components automatically inherit new colors and fonts
  - Components using color.secondary migrated to purple700
  - Visual regression baselines updated
  - Migration validation tests pass
  - All tests pass
  
  **Primary Artifacts:**
  - Updated components (if any use color.secondary)
  - Visual regression baseline screenshots
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/015-color-palette-update/completion/task-9-parent-completion.md`
  - Summary: `docs/specs/015-color-palette-update/task-9-summary.md` (triggers release detection)

  - [ ] 9.1 Audit components for color.secondary usage
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Search all component files for `color.secondary` references
    - List components that need migration
    - Update components to use `purple700` directly
    - Verify no remaining color.secondary references
    - _Requirements: 12.2_

  - [ ] 9.2 Validate component color inheritance
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test ButtonCTA success variant shows green (not cyan)
    - Test TextInputField error state shows pink (not orange)
    - Test warning states show amber (not yellow)
    - Verify components automatically inherited new colors
    - _Requirements: 2.7, 10.1, 10.2, 10.3_

  - [ ] 9.3 Validate component typography inheritance
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test headings render in Rajdhani font
    - Test labels render in Rajdhani font
    - Test buttons render in Rajdhani font
    - Test body text renders in Inter font
    - Verify components automatically inherited new fonts
    - _Requirements: 4.5, 10.4, 10.5_

  - [ ]* 9.4 Update visual regression baselines
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Capture new baseline screenshots for all affected components
    - Update baseline images to reflect new colors and fonts
    - Verify visual regression tests pass with new baselines
    - Remove old baseline images
    - _Requirements: 10.6, 10.7_

  - [ ]* 9.5 Remove migration-specific test files
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Identify migration-specific test files
    - Remove temporary migration validation tests
    - Keep permanent tests for color/font token validation
    - Verify test suite still passes after cleanup
    - _Requirements: 10.8_

- [ ] 10. Update Documentation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Token documentation updated with new color palette
  - Typography documentation updated with Rajdhani/Inter
  - Component examples updated to show new colors and fonts
  - Migration guidance documented in completion notes
  - All tests pass
  
  **Primary Artifacts:**
  - Updated token documentation
  - Updated component examples
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/015-color-palette-update/completion/task-10-parent-completion.md`
  - Summary: `docs/specs/015-color-palette-update/task-10-summary.md` (triggers release detection)

  - [ ] 10.1 Update color token documentation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Document semantic meaning of each color family
    - Explain green=success, pink=error, amber=warning, yellow=attention, cyan=tech/data, teal=info, purple=brand
    - Include guidance on accessible usage contexts
    - Document WCAG contrast considerations
    - _Requirements: 11.1, 11.4_

  - [ ] 10.2 Update typography token documentation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Document that display typography uses Rajdhani
    - Document that body typography uses Inter
    - Explain which semantic tokens use which font family
    - Include font weight mapping guidance
    - _Requirements: 11.2_

  - [ ] 10.3 Update component examples
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update component examples to demonstrate new color palette
    - Update component examples to show Rajdhani typography
    - Verify examples render correctly with new tokens
    - Update screenshots if needed
    - _Requirements: 11.3_

  - [ ] 10.4 Document breaking changes and migration
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Document visual breaking changes (success/error/warning colors, display font)
    - Document API breaking changes (color.secondary removal)
    - Include before/after comparisons
    - Provide migration guidance for color.secondary users
    - Document as major version change
    - _Requirements: 11.5, 12.1, 12.2, 12.3, 12.4, 12.5_

- [ ] 11. Final Checkpoint - Complete Validation

  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  
  - Run full test suite to verify all changes
  - Verify build system generates correct platform-specific files
  - Check visual regression tests pass with new baselines
  - Ensure documentation is complete and accurate
  - Confirm all requirements are met
  - Ensure all tests pass, ask the user if questions arise
  - _Requirements: All requirements_

---

*This implementation plan provides a systematic approach to updating the color palette and display font while leveraging the token architecture for automatic component inheritance.*
