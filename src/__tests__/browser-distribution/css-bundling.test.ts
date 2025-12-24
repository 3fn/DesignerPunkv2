/**
 * @jest-environment node
 * @category evergreen
 * @purpose Verify CSS is bundled into JS for browser distribution
 */

/**
 * CSS Bundling Tests
 *
 * Tests that verify:
 * 1. CSS is bundled into JS (no external CSS file requests)
 * 2. Components use <style> tags instead of <link> tags in shadow DOM
 * 3. CSS content is properly escaped and included in bundles
 *
 * This validates the esbuild CSS-as-string plugin approach where component
 * CSS is imported as strings and injected via <style> tags in shadow DOM.
 *
 * @see .kiro/specs/028-web-component-browser-distribution/design.md
 * @see scripts/esbuild-css-plugin.js
 * @see Requirements: 8.2 (components render correctly)
 */

import * as fs from 'fs';
import * as path from 'path';

describe('CSS Bundling for Browser Distribution', () => {
  const BROWSER_DIST_DIR = path.join(process.cwd(), 'dist', 'browser');
  const ESM_BUNDLE_PATH = path.join(BROWSER_DIST_DIR, 'designerpunk.esm.js');
  const UMD_BUNDLE_PATH = path.join(BROWSER_DIST_DIR, 'designerpunk.umd.js');

  beforeAll(() => {
    if (!fs.existsSync(BROWSER_DIST_DIR)) {
      throw new Error('Browser bundles not found. Run "npm run build:browser" first.');
    }
  });

  describe('CSS Inlined in Bundles', () => {
    /**
     * Requirement 8.2: Components render correctly in browser bundles
     * 
     * CSS should be bundled into JS, not loaded via external files.
     * This test verifies that component CSS content is present in the bundle.
     */
    it('should contain ButtonCTA CSS styles in ESM bundle', () => {
      const bundleContent = fs.readFileSync(ESM_BUNDLE_PATH, 'utf-8');
      
      // ButtonCTA CSS should be inlined - check for distinctive CSS rules
      expect(bundleContent).toContain('.button-cta');
      expect(bundleContent).toContain('.button-cta--primary');
      expect(bundleContent).toContain('.button-cta--secondary');
      expect(bundleContent).toContain('.button-cta--tertiary');
      expect(bundleContent).toContain('.button-cta--small');
      expect(bundleContent).toContain('.button-cta--medium');
      expect(bundleContent).toContain('.button-cta--large');
    });

    it('should contain ButtonCTA CSS styles in UMD bundle', () => {
      const bundleContent = fs.readFileSync(UMD_BUNDLE_PATH, 'utf-8');
      
      // ButtonCTA CSS should be inlined - check for distinctive CSS rules
      expect(bundleContent).toContain('.button-cta');
      expect(bundleContent).toContain('.button-cta--primary');
      expect(bundleContent).toContain('.button-cta--secondary');
      expect(bundleContent).toContain('.button-cta--tertiary');
    });

    it('should contain Icon CSS styles in ESM bundle', () => {
      const bundleContent = fs.readFileSync(ESM_BUNDLE_PATH, 'utf-8');
      
      // Icon CSS should be inlined - check for distinctive CSS rules
      // Icon component uses .icon class (not .dp-icon)
      expect(bundleContent).toContain('.icon');
      expect(bundleContent).toContain('.icon--size-100');
    });

    it('should contain Icon CSS styles in UMD bundle', () => {
      const bundleContent = fs.readFileSync(UMD_BUNDLE_PATH, 'utf-8');
      
      // Icon CSS should be inlined
      // Icon component uses .icon class (not .dp-icon)
      expect(bundleContent).toContain('.icon');
      expect(bundleContent).toContain('.icon--size-100');
    });
  });

  describe('No External CSS File Dependencies', () => {
    /**
     * Requirement 8.2: Components render correctly without external CSS files
     * 
     * Browser bundles should not reference external CSS files via <link> tags.
     * All component CSS should be bundled into the JS.
     */
    it('should not contain link tag references for component CSS in ESM bundle', () => {
      const bundleContent = fs.readFileSync(ESM_BUNDLE_PATH, 'utf-8');
      
      // Should not have link tags referencing component CSS files
      // Note: tokens.css is still loaded via link tag (that's correct)
      expect(bundleContent).not.toMatch(/<link[^>]*ButtonCTA\.web\.css/);
      expect(bundleContent).not.toMatch(/<link[^>]*Icon\.web\.css/);
      expect(bundleContent).not.toMatch(/<link[^>]*Container\.web\.css/);
      expect(bundleContent).not.toMatch(/<link[^>]*TextInputField\.web\.css/);
    });

    it('should not contain link tag references for component CSS in UMD bundle', () => {
      const bundleContent = fs.readFileSync(UMD_BUNDLE_PATH, 'utf-8');
      
      // Should not have link tags referencing component CSS files
      expect(bundleContent).not.toMatch(/<link[^>]*ButtonCTA\.web\.css/);
      expect(bundleContent).not.toMatch(/<link[^>]*Icon\.web\.css/);
      expect(bundleContent).not.toMatch(/<link[^>]*Container\.web\.css/);
      expect(bundleContent).not.toMatch(/<link[^>]*TextInputField\.web\.css/);
    });

    it('should not have fetch or import calls for CSS files in ESM bundle', () => {
      const bundleContent = fs.readFileSync(ESM_BUNDLE_PATH, 'utf-8');
      
      // Should not dynamically load CSS files
      expect(bundleContent).not.toMatch(/fetch\([^)]*\.css/);
      expect(bundleContent).not.toMatch(/import\([^)]*\.css/);
    });

    it('should not have fetch or import calls for CSS files in UMD bundle', () => {
      const bundleContent = fs.readFileSync(UMD_BUNDLE_PATH, 'utf-8');
      
      // Should not dynamically load CSS files
      expect(bundleContent).not.toMatch(/fetch\([^)]*\.css/);
      expect(bundleContent).not.toMatch(/import\([^)]*\.css/);
    });
  });

  describe('Style Tag Usage Pattern', () => {
    /**
     * Requirement 8.2: Components use <style> tags in shadow DOM
     * 
     * Components should inject CSS via <style> tags, not <link> tags.
     * This pattern is used by Lit, Shoelace, and other web component libraries.
     */
    it('should use style tag pattern for CSS injection in ESM bundle', () => {
      const bundleContent = fs.readFileSync(ESM_BUNDLE_PATH, 'utf-8');
      
      // Should have <style> tag pattern for CSS injection
      // The pattern is: <style>${cssContent}</style>
      expect(bundleContent).toMatch(/<style>/);
    });

    it('should use style tag pattern for CSS injection in UMD bundle', () => {
      const bundleContent = fs.readFileSync(UMD_BUNDLE_PATH, 'utf-8');
      
      // Should have <style> tag pattern for CSS injection
      expect(bundleContent).toMatch(/<style>/);
    });
  });

  describe('CSS Content Integrity', () => {
    /**
     * Verify that CSS content is properly escaped and complete in bundles.
     */
    it('should contain complete CSS rules with selectors and properties', () => {
      const bundleContent = fs.readFileSync(ESM_BUNDLE_PATH, 'utf-8');
      
      // CSS should have proper structure with selectors and properties
      // Check for CSS custom property usage (design tokens)
      expect(bundleContent).toMatch(/var\(--[a-zA-Z0-9-]+\)/);
      
      // Check for common CSS properties used in components
      expect(bundleContent).toContain('background');
      expect(bundleContent).toContain('color');
      expect(bundleContent).toContain('padding');
      expect(bundleContent).toContain('border');
    });

    it('should contain focus state styles for accessibility', () => {
      const bundleContent = fs.readFileSync(ESM_BUNDLE_PATH, 'utf-8');
      
      // Components should have focus styles for accessibility
      expect(bundleContent).toMatch(/:focus|:focus-visible/);
    });

    it('should contain hover state styles for interactivity', () => {
      const bundleContent = fs.readFileSync(ESM_BUNDLE_PATH, 'utf-8');
      
      // Components should have hover styles
      expect(bundleContent).toMatch(/:hover/);
    });

    it('should contain disabled state styles', () => {
      const bundleContent = fs.readFileSync(ESM_BUNDLE_PATH, 'utf-8');
      
      // Components should have disabled styles
      expect(bundleContent).toMatch(/:disabled|--disabled/);
    });
  });

  describe('Source Component CSS Files', () => {
    /**
     * Verify that source CSS files exist and are properly structured
     * for the CSS-as-string import pattern.
     */
    it('should have ButtonCTA CSS source file', () => {
      const cssPath = path.join(process.cwd(), 'src/components/core/ButtonCTA/platforms/web/ButtonCTA.web.css');
      expect(fs.existsSync(cssPath)).toBe(true);
      
      const cssContent = fs.readFileSync(cssPath, 'utf-8');
      expect(cssContent).toContain('.button-cta');
    });

    it('should have Icon CSS source file', () => {
      const cssPath = path.join(process.cwd(), 'src/components/core/Icon/platforms/web/Icon.web.css');
      expect(fs.existsSync(cssPath)).toBe(true);
      
      const cssContent = fs.readFileSync(cssPath, 'utf-8');
      // Icon component uses .icon class (not .dp-icon)
      expect(cssContent).toContain('.icon');
    });
  });

  describe('CSS TypeScript Declaration', () => {
    /**
     * Verify that TypeScript declaration for CSS imports exists.
     * This enables type-safe CSS imports in TypeScript components.
     */
    it('should have CSS module declaration file', () => {
      const declarationPath = path.join(process.cwd(), 'src/types/css.d.ts');
      expect(fs.existsSync(declarationPath)).toBe(true);
      
      const content = fs.readFileSync(declarationPath, 'utf-8');
      // Should declare CSS modules as string exports
      expect(content).toMatch(/declare\s+module\s+['"].*\.css['"]/);
    });
  });
});
