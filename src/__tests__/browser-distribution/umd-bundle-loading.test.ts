/**
 * @category evergreen
 * @purpose Verify UMD bundle loading functionality for browser distribution
 */

/**
 * UMD Bundle Loading Tests
 *
 * Tests that the UMD bundle loads correctly via script tag
 * and exposes the global DesignerPunk namespace.
 *
 * @see .kiro/specs/028-web-component-browser-distribution/design.md
 * @see Requirements: 4.1, 4.2, 4.3
 */

import * as fs from 'fs';
import * as path from 'path';

describe('UMD Bundle Loading', () => {
  const BROWSER_DIST_DIR = path.join(process.cwd(), 'dist', 'browser');
  const UMD_BUNDLE = path.join(BROWSER_DIST_DIR, 'designerpunk.umd.js');
  const UMD_MIN_BUNDLE = path.join(BROWSER_DIST_DIR, 'designerpunk.umd.min.js');

  beforeAll(() => {
    // Ensure bundles exist before running tests
    if (!fs.existsSync(BROWSER_DIST_DIR)) {
      throw new Error(
        'Browser bundles not found. Run "npm run build:browser" first.'
      );
    }
  });

  describe('UMD Bundle Structure', () => {
    it('should have UMD bundle file', () => {
      expect(fs.existsSync(UMD_BUNDLE)).toBe(true);
    });

    it('should have minified UMD bundle file', () => {
      expect(fs.existsSync(UMD_MIN_BUNDLE)).toBe(true);
    });

    it('should have source map for UMD bundle', () => {
      const sourceMapPath = `${UMD_BUNDLE}.map`;
      expect(fs.existsSync(sourceMapPath)).toBe(true);
    });

    it('should have source map for minified UMD bundle', () => {
      const sourceMapPath = `${UMD_MIN_BUNDLE}.map`;
      expect(fs.existsSync(sourceMapPath)).toBe(true);
    });
  });

  describe('Global Namespace', () => {
    it('should define DesignerPunk global namespace', () => {
      const bundleContent = fs.readFileSync(UMD_BUNDLE, 'utf-8');

      // UMD/IIFE bundles should define the global namespace
      expect(bundleContent).toContain('DesignerPunk');
    });

    it('should use IIFE pattern for global assignment', () => {
      const bundleContent = fs.readFileSync(UMD_BUNDLE, 'utf-8');

      // esbuild generates IIFE format with var assignment
      expect(bundleContent).toMatch(/var\s+DesignerPunk\s*=/);
    });

    it('should expose components via global namespace', () => {
      const bundleContent = fs.readFileSync(UMD_BUNDLE, 'utf-8');

      // Components should be accessible via the namespace
      // Actual component names from browser-entry.ts exports (Stemma System naming)
      expect(bundleContent).toContain('InputTextBase');
      expect(bundleContent).toContain('ButtonCTA');
      expect(bundleContent).toContain('IconBaseElement');
      expect(bundleContent).toContain('ContainerBaseWeb');
    });
  });

  describe('Script Tag Compatibility', () => {
    it('should be valid JavaScript that can be parsed', () => {
      const bundleContent = fs.readFileSync(UMD_BUNDLE, 'utf-8');

      // Try to parse the bundle as JavaScript
      expect(() => {
        new Function(bundleContent);
      }).not.toThrow();
    });

    it('should be self-executing (IIFE)', () => {
      const bundleContent = fs.readFileSync(UMD_BUNDLE, 'utf-8');

      // IIFE pattern: starts with ( or var and contains function execution
      expect(bundleContent).toMatch(/\(\s*\(\s*\)\s*=>|\(\s*function\s*\(/);
    });

    it('should not require module system', () => {
      const bundleContent = fs.readFileSync(UMD_BUNDLE, 'utf-8');

      // UMD bundles should work without require/import
      // They should not have top-level import statements
      expect(bundleContent).not.toMatch(/^import\s+/m);
    });
  });

  describe('Minified Bundle', () => {
    it('should be smaller than non-minified bundle', () => {
      const umdSize = fs.statSync(UMD_BUNDLE).size;
      const umdMinSize = fs.statSync(UMD_MIN_BUNDLE).size;

      expect(umdMinSize).toBeLessThan(umdSize);
    });

    it('should still define DesignerPunk namespace', () => {
      const bundleContent = fs.readFileSync(UMD_MIN_BUNDLE, 'utf-8');

      // Minified bundle should still have the namespace
      expect(bundleContent).toContain('DesignerPunk');
    });

    it('should still contain component exports', () => {
      const bundleContent = fs.readFileSync(UMD_MIN_BUNDLE, 'utf-8');

      // Minified bundle should still export components
      // Note: Minification may mangle internal names, but exports should remain
      // Check for custom element tag names which are preserved as strings
      // Note: Stemma System migration - text-input-field removed, using input-text-base instead
      // Note: dp-icon and dp-container deprecated names removed
      expect(bundleContent).toContain('input-text-base');
      expect(bundleContent).toContain('button-cta');
      expect(bundleContent).toContain('icon-base');
      expect(bundleContent).toContain('container-base');
    });

    it('should be valid JavaScript', () => {
      const bundleContent = fs.readFileSync(UMD_MIN_BUNDLE, 'utf-8');

      expect(() => {
        new Function(bundleContent);
      }).not.toThrow();
    });
  });

  describe('Browser Target Compatibility', () => {
    it('should be self-contained (no external dependencies)', () => {
      const bundleContent = fs.readFileSync(UMD_BUNDLE, 'utf-8');

      // Bundle should not have import statements for external packages
      // All dependencies should be inlined
      const importMatches = bundleContent.match(/import\s+.*from\s+['"][^'"]+['"]/g) || [];
      
      // Filter out any internal imports (if any)
      const externalImports = importMatches.filter(
        (imp) => !imp.includes('./') && !imp.includes('../')
      );

      expect(externalImports.length).toBe(0);
    });

    it('should work in browser environment without Node.js APIs', () => {
      const bundleContent = fs.readFileSync(UMD_BUNDLE, 'utf-8');

      // Should not reference Node.js-specific globals
      expect(bundleContent).not.toMatch(/\bprocess\.env\b/);
      expect(bundleContent).not.toMatch(/\b__dirname\b/);
      expect(bundleContent).not.toMatch(/\b__filename\b/);
    });
  });
});
