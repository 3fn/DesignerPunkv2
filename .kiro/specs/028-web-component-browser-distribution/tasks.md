# Implementation Plan: Web Component Browser Distribution

**Date**: December 22, 2025
**Spec**: 028 - Web Component Browser Distribution
**Status**: Implementation In Progress
**Dependencies**: None

---

## Task List

- [x] 1. Set up browser bundle infrastructure

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Browser entry point created with component imports and auto-registration
  - esbuild configured for ESM and UMD bundle generation
  - Build pipeline integrated with browser bundle generation after TypeScript compilation
  - Release detection triggered
  
  **Primary Artifacts:**
  - `src/browser-entry.ts`
  - `scripts/build-browser-bundles.js`
  - Updated `package.json` with build:browser script
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/028-web-component-browser-distribution/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/028-web-component-browser-distribution/task-1-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Set up browser bundle infrastructure"`
  - Verify: Check GitHub for committed changes

  - [x] 1.1 Create browser entry point file
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/browser-entry.ts` with component imports and auto-registration
    - Implement `safeDefine()` function for idempotent registration
    - Implement `checkTokensLoaded()` function for token detection warning
    - Export all components for UMD global access
    - _Requirements: 1.2, 2.3, 3.4, 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 1.2 Install and configure esbuild
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Add esbuild as a dev dependency
    - Create `scripts/build-browser-bundles.js` build script
    - Configure ESM output (ES2020 target, source maps)
    - Configure UMD output (ES2017 target, `DesignerPunk` global, source maps)
    - _Requirements: 1.4, 1.5, 2.4, 2.5_

  - [x] 1.3 Integrate into build pipeline
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Add `build:browser` script to package.json
    - Update main `build` script to include browser bundle generation
    - Ensure browser bundles generate after TypeScript compilation
    - _Requirements: 7.1, 7.2_

- [x] 2. Implement bundle generation and minification

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Development bundles (ESM and UMD) generated and loadable in JSDOM
  - Minified bundles generated with source maps
  - Minification effectiveness validated (at least 50% size reduction)
  - Release detection triggered
  
  **Primary Artifacts:**
  - `dist/browser/designerpunk.esm.js`
  - `dist/browser/designerpunk.esm.min.js`
  - `dist/browser/designerpunk.umd.js`
  - `dist/browser/designerpunk.umd.min.js`
  - Source map files (`.map`)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/028-web-component-browser-distribution/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/028-web-component-browser-distribution/task-2-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 2 Complete: Implement bundle generation and minification"`
  - Verify: Check GitHub for committed changes

  - [x] 2.1 Generate development bundles
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Generate `dist/browser/designerpunk.esm.js`
    - Generate `dist/browser/designerpunk.umd.js`
    - Verify bundles load without errors in JSDOM
    - _Requirements: 1.1, 2.1_

  - [x] 2.2 Generate minified bundles
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Generate `dist/browser/designerpunk.esm.min.js`
    - Generate `dist/browser/designerpunk.umd.min.js`
    - Generate source maps for all bundles (`.map` files)
    - _Requirements: 5.1, 5.2, 5.4_

  - [x] 2.3 Write property test for minification effectiveness
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - **Property 3: Minification Effectiveness**
    - Verify minified bundles are at least 50% smaller than non-minified
    - **Validates: Requirements 5.3**

- [x] 3. Implement token CSS distribution

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Token CSS copied to browser distribution directory
  - Token completeness validated (all component references exist in tokens.css)
  - Token loading behavior verified with console warning when missing
  - Release detection triggered
  
  **Primary Artifacts:**
  - `dist/browser/tokens.css`
  - Token completeness property test
  - Token loading unit tests
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/028-web-component-browser-distribution/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/028-web-component-browser-distribution/task-3-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 3 Complete: Implement token CSS distribution"`
  - Verify: Check GitHub for committed changes

  - [x] 3.1 Copy token CSS to browser distribution
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Copy `DesignTokens.web.css` to `dist/browser/tokens.css` during build
    - Verify file is copied correctly
    - _Requirements: 3.1_

  - [x] 3.2 Write property test for token completeness
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - **Property 1: Token CSS Completeness**
    - Extract CSS custom property references from components
    - Verify all referenced properties exist in tokens.css
    - **Validates: Requirements 3.2**

  - [x] 3.3 Verify token loading behavior
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Write unit test: tokens load correctly via link tag
    - Write unit test: console warning appears when tokens not loaded
    - _Requirements: 3.2, 3.3, 3.4_

- [x] 4. Implement custom element auto-registration

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All four components register automatically on bundle load
  - ESM and UMD bundle registration verified
  - Registration idempotency validated (no errors on duplicate registration)
  - Release detection triggered
  
  **Primary Artifacts:**
  - Component registration unit tests
  - Registration idempotency property test
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/028-web-component-browser-distribution/completion/task-4-parent-completion.md`
  - Summary: `docs/specs/028-web-component-browser-distribution/task-4-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 4 Complete: Implement custom element auto-registration"`
  - Verify: Check GitHub for committed changes

  - [x] 4.1 Verify component registration
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Write unit tests verifying all four components register on bundle load
    - Test ESM bundle registration
    - Test UMD bundle registration and global object
    - _Requirements: 1.2, 1.3, 2.2, 2.3, 4.1, 4.2, 4.3, 4.4_

  - [x] 4.2 Write property test for registration idempotency
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - **Property 2: Registration Idempotency**
    - Pre-register element, load bundle, verify no error
    - **Validates: Requirements 4.5**

- [x] 5. Checkpoint - Verify core bundle functionality

  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  
  - Run all tests, ensure bundles generate and load correctly
  - Verify ESM and UMD bundles work in JSDOM
  - Verify token warning appears when tokens missing
  - Ask user if questions arise
  - _Requirements: 1.1, 1.2, 2.1, 2.2, 3.4_

- [x] 6. Configure npm package exports

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - package.json exports field configured with import/require conditions
  - browser and module fields pointing to ESM bundle
  - tokens.css export mapping configured
  - Bundler resolution verified
  - Release detection triggered
  
  **Primary Artifacts:**
  - Updated `package.json` with exports configuration
  - Bundler resolution test
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/028-web-component-browser-distribution/completion/task-6-parent-completion.md`
  - Summary: `docs/specs/028-web-component-browser-distribution/task-6-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 6 Complete: Configure npm package exports"`
  - Verify: Check GitHub for committed changes

  - [x] 6.1 Update package.json exports
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Add `exports` field with import/require conditions
    - Add `browser` field pointing to ESM bundle
    - Add `module` field pointing to ESM bundle
    - Add `./tokens.css` export mapping
    - _Requirements: 6.1, 6.2, 6.3_

  - [x] 6.2 Verify bundler resolution
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Write test verifying import resolves to ESM bundle
    - _Requirements: 6.4_

- [x] 7. Implement bundle size tracking

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Size reporting outputs raw and gzipped sizes during build
  - Soft ceiling warning implemented for 100KB gzipped threshold
  - Build error handling verified with descriptive error messages
  - Release detection triggered
  
  **Primary Artifacts:**
  - Size reporting in `scripts/build-browser-bundles.js`
  - Build error handling tests
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/028-web-component-browser-distribution/completion/task-7-parent-completion.md`
  - Summary: `docs/specs/028-web-component-browser-distribution/task-7-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 7 Complete: Implement bundle size tracking"`
  - Verify: Check GitHub for committed changes

  - [x] 7.1 Add size reporting to build script
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Calculate raw and gzipped sizes for each bundle
    - Output sizes to console during build
    - Calculate and display total size
    - _Requirements: 7.3, 11.1, 11.2, 11.3_

  - [x] 7.2 Implement soft ceiling warning
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add 100KB gzipped threshold check
    - Output warning if any bundle exceeds threshold
    - _Requirements: 11.4_

  - [x] 7.3 Verify build error handling
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test that build fails with descriptive error on bundle generation failure
    - _Requirements: 7.4_

- [x] 8. Create demo page

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Demo HTML file created with all four components
  - Interactivity demonstrations working (focus states, click handlers)
  - Page works from local file server
  - Release detection triggered
  
  **Primary Artifacts:**
  - `dist/browser/demo.html`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/028-web-component-browser-distribution/completion/task-8-parent-completion.md`
  - Summary: `docs/specs/028-web-component-browser-distribution/task-8-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 8 Complete: Create demo page"`
  - Verify: Check GitHub for committed changes

  - [x] 8.1 Create demo HTML file
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create `dist/browser/demo.html` template
    - Include tokens.css link
    - Include ESM bundle script
    - Add all four components with example props
    - _Requirements: 8.1, 8.2_

  - [x] 8.2 Add interactivity demonstrations
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add focus state demonstrations
    - Add click handler demonstrations
    - Verify page works from local file server
    - _Requirements: 8.3, 8.4_

  - [x] 8.3 Fix component CSS bundling for browser distribution
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    
    **Problem**: Web components load external CSS files via `<link>` tags in shadow DOM, but these CSS files aren't included in the browser bundle. Components render but appear unstyled.
    
    **Approved Solution**: esbuild CSS-as-string plugin (Option 3) - CSS in separate files during development, bundled into JS at build time. This matches industry standard (Lit, Shoelace).
    
    - [x] 8.3.1 Research and propose CSS bundling solution
      **Type**: Research
      **Validation**: Tier 1 - Minimal
      - Investigate current component CSS loading approach
      - Evaluate options: inline CSS at build time, copy CSS files, constructable stylesheets
      - Document trade-offs and recommend solution
      - **Checkpoint**: Get user approval before implementation
      - _Requirements: 8.2 (components render correctly)_
    
    - [x] 8.3.2 Create esbuild CSS-as-string plugin
      **Type**: Implementation
      **Validation**: Tier 2 - Standard
      - Create `scripts/esbuild-css-plugin.js`
      - Intercept `.css` imports and return content as JS string export
      - Add TypeScript declaration for CSS imports (`src/types/css.d.ts`)
      - _Requirements: 8.2_
    
    - [x] 8.3.3 Update ButtonCTA to use imported CSS
      **Type**: Implementation
      **Validation**: Tier 2 - Standard
      - Change from `<link rel="stylesheet" href="./ButtonCTA.web.css">` to imported CSS string
      - Import CSS file: `import buttonStyles from './ButtonCTA.web.css';`
      - Use `<style>${buttonStyles}</style>` in shadow DOM
      - _Requirements: 8.2, 8.3_
    
    - [x] 8.3.4 Update build script to use CSS plugin
      **Type**: Implementation
      **Validation**: Tier 1 - Minimal
      - Import CSS plugin in `scripts/build-browser-bundles.js`
      - Add plugin to esbuild configuration
      - Verify build completes without errors
      - _Requirements: 8.2_
    
    - [x] 8.3.5 Update tests for new CSS loading approach
      **Type**: Implementation
      **Validation**: Tier 2 - Standard
      - Update any tests that check for `<link>` tags in shadow DOM
      - Add test verifying CSS is bundled into JS (no external CSS file requests)
      - Verify existing bundle-loading tests still pass
      - _Requirements: 8.2_
    
    - [x] 8.3.6 Verify demo page styling
      **Type**: Implementation
      **Validation**: Tier 2 - Standard
      - Rebuild browser bundles with CSS plugin
      - Open demo.html and verify ButtonCTA is properly styled
      - Verify all interactive states work (hover, focus, active)
      - _Requirements: 8.2, 8.3, 8.4_
    
    - [ ]* 8.3.7 Revert Icon to external CSS for consistency (optional)
      **Type**: Implementation
      **Validation**: Tier 1 - Minimal
      - Move Icon's inline CSS back to external `Icon.web.css` file
      - Update Icon to use imported CSS string pattern
      - Ensures all components use consistent CSS loading approach
      - _Requirements: 8.2_

    - [x] 8.3.8 Fix border token naming inconsistency in TextInputField
      **Type**: Bug Fix
      **Validation**: Tier 2 - Standard
      
      **Problem**: TextInputField uses `--border-default` but tokens.css defines `--border-border-default`. This causes input borders to not render because the CSS variable doesn't exist.
      
      **Root Cause**: Naming inconsistency between component code and token generation:
      - tokens.css outputs: `--border-border-default` (with double "border")
      - TextInputField uses: `--border-default` (without double "border")
      - ButtonCTA correctly uses: `--border-border-default`
      
      **Current Workaround**: Test file `token-completeness.property.test.ts` has a `PROPERTY_ALIASES` mapping that masks this bug during testing.
      
      **Fix Required**:
      - Update TextInputField.web.ts line ~284 to use `--border-border-default`
      - Audit other components for similar border token naming issues
      - Remove the workaround alias from test file once all components are fixed
      - _Requirements: 8.2 (components render correctly)_

    - [x] 8.3.9 Architectural review: ButtonCTA icon composition
      **Type**: Research
      **Validation**: Tier 1 - Minimal
      
      **Problem**: ButtonCTA uses `createIcon()` function which returns an SVG string. The SVG has CSS classes like `icon--size-100`, but those CSS rules are defined in the Icon component's Shadow DOM styles, not in ButtonCTA's Shadow DOM. This causes icons to render at 0x0 dimensions.
      
      **Current Workaround**: Added explicit `width` and `height` attributes to SVG in `createIcon()` function.
      
      **Architectural Question**: Should ButtonCTA use `<dp-icon>` web component instead of `createIcon()` function for proper component composition?
      
      **Trade-offs to evaluate**:
      - `createIcon()`: Simpler, no nested Shadow DOM, but CSS isolation issues
      - `<dp-icon>`: Proper encapsulation, but nested Shadow DOM complexity
      
      **Checkpoint**: Document findings and get user decision before implementation
      - _Requirements: 8.2, 8.3 (components render correctly with interactivity)_
      
      **Decision**: Migrate to `<dp-icon>` for cross-platform consistency with iOS and Android.
      **Completion**: `.kiro/specs/028-web-component-browser-distribution/completion/task-8-3-9-completion.md`

    - [x] 8.3.10 Migrate ButtonCTA to use `<dp-icon>` component
      **Type**: Implementation
      **Validation**: Tier 2 - Standard
      
      **Background**: Architectural review (8.3.9) determined that ButtonCTA should use `<dp-icon>` web component instead of `createIcon()` function for cross-platform consistency. iOS and Android both use component composition (`Icon()`), and web should follow the same pattern.
      
      **Implementation Steps**:
      1. Update ButtonCTA render method to use `<dp-icon>` instead of `createIcon()` string injection
      2. Remove `createIcon` and related imports from ButtonCTA
      3. Verify color inheritance works via `currentColor` across Shadow DOM boundary
      4. Update tests to handle nested Shadow DOM (ButtonCTA → dp-icon)
      5. Verify demo page still renders icons correctly
      6. Remove duplicated size mapping logic (now handled by DPIcon)
      
      **Code Change**:
      ```typescript
      // Before (string injection)
      const iconHTML = icon ? createIcon({ name, size, color: 'inherit' }) : '';
      ${icon ? `<span class="button-cta__icon">${iconHTML}</span>` : ''}
      
      // After (component composition)
      ${icon ? `<dp-icon name="${icon}" size="${iconSize}" class="button-cta__icon" aria-hidden="true"></dp-icon>` : ''}
      ```
      
      **Benefits**:
      - Cross-platform alignment with iOS/Android
      - Single source of truth for icon rendering
      - AI agent clarity (same pattern across all platforms)
      - Removes duplicated size mapping logic
      
      - _Requirements: 8.2, 8.3 (components render correctly with interactivity)_

- [x] 9. Create AI agent guidance documentation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Browser Distribution Guide created with MCP-ready metadata
  - ESM and UMD loading patterns documented
  - Troubleshooting guidance included
  - MCP format compliance validated
  - Documentation queryable via MCP server
  - Release detection triggered
  
  **Primary Artifacts:**
  - `.kiro/steering/Browser Distribution Guide.md`
  - MCP format compliance property test
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/028-web-component-browser-distribution/completion/task-9-parent-completion.md`
  - Summary: `docs/specs/028-web-component-browser-distribution/task-9-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 9 Complete: Create AI agent guidance documentation"`
  - Verify: Check GitHub for committed changes

  - [x] 9.1 Create Browser Distribution Guide
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `.kiro/steering/Browser Distribution Guide.md`
    - Add MCP-ready metadata headers (Date, Purpose, Organization, Scope, Layer)
    - Document ESM loading pattern with example
    - Document UMD loading pattern with example
    - _Requirements: 9.1, 9.2, 9.3_

  - [~] 9.2 Add troubleshooting guidance (SKIPPED - consolidated into 9.1)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Status**: Skipped - Content consolidated into Browser Distribution Guide (Task 9.1)
    - Document "tokens not loaded" troubleshooting ✓ (in Browser Distribution Guide)
    - Document "component not rendering" troubleshooting ✓ (in Browser Distribution Guide)
    - Document common integration issues ✓ (in Browser Distribution Guide)
    - _Requirements: 9.4_
    - **Completion**: `.kiro/specs/028-web-component-browser-distribution/completion/task-9-2-skipped.md`

  - [x] 9.3 Write property test for MCP format compliance
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - **Property 4: MCP Documentation Format Compliance**
    - Verify all required metadata fields present
    - **Validates: Requirements 9.2**

  - [x] 9.4 Verify MCP queryability
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test that documentation is indexed by MCP server
    - _Requirements: 9.5_

- [x] 10. Final checkpoint - Complete verification

  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  
  - Run full test suite (`npm test`)
  - Verify all browser bundles generate correctly
  - Verify demo page renders all components
  - Verify documentation is MCP-queryable
  - Ask user if questions arise
  - _Requirements: 10.1, 10.2, 10.3_

---

## Notes

- All tasks are required for comprehensive correctness validation
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- Implementation uses esbuild for fast bundle generation
- All tests use Jest (existing project standard) with JSDOM for browser environment simulation
