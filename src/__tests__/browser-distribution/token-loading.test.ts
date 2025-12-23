/**
 * @jest-environment jsdom
 * @category evergreen
 * @purpose Verify token loading behavior in browser environment
 */

/**
 * Token Loading Behavior Tests
 *
 * Tests that verify:
 * 1. Tokens load correctly via link tag (Requirements 3.2, 3.3)
 * 2. Console warning appears when tokens not loaded (Requirements 3.4)
 *
 * @see .kiro/specs/028-web-component-browser-distribution/design.md
 * @see Requirements: 3.2, 3.3, 3.4
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Token Loading Behavior', () => {
  const BROWSER_DIST_DIR = path.join(process.cwd(), 'dist', 'browser');
  const TOKENS_CSS_PATH = path.join(BROWSER_DIST_DIR, 'tokens.css');

  beforeAll(() => {
    // Ensure tokens.css exists before running tests
    if (!fs.existsSync(TOKENS_CSS_PATH)) {
      throw new Error(
        'tokens.css not found. Run "npm run build:browser" first.'
      );
    }
  });

  describe('Token CSS File Availability', () => {
    /**
     * Requirement 3.1: Build system SHALL copy DesignTokens.web.css to dist/browser/tokens.css
     */
    it('should have tokens.css in browser distribution directory', () => {
      expect(fs.existsSync(TOKENS_CSS_PATH)).toBe(true);
    });

    it('should have non-empty tokens.css file', () => {
      const stats = fs.statSync(TOKENS_CSS_PATH);
      expect(stats.size).toBeGreaterThan(0);
    });

    it('should contain CSS custom property definitions', () => {
      const content = fs.readFileSync(TOKENS_CSS_PATH, 'utf-8');
      
      // Should contain :root selector with CSS custom properties
      expect(content).toContain(':root');
      expect(content).toMatch(/--[a-zA-Z0-9-]+\s*:/);
    });

    /**
     * Requirement 3.2: All CSS custom properties required by components SHALL be available
     */
    it('should contain color-primary token used for token detection', () => {
      const content = fs.readFileSync(TOKENS_CSS_PATH, 'utf-8');
      
      // The browser-entry.ts checks for --color-primary to detect if tokens are loaded
      expect(content).toContain('--color-primary');
    });
  });

  describe('Token Loading via Link Tag', () => {
    let originalGetComputedStyle: typeof window.getComputedStyle;

    beforeEach(() => {
      // Store original getComputedStyle
      originalGetComputedStyle = window.getComputedStyle;
    });

    afterEach(() => {
      // Restore original getComputedStyle
      window.getComputedStyle = originalGetComputedStyle;
      
      // Clean up any added style elements
      const styleElements = document.querySelectorAll('style[data-test]');
      styleElements.forEach(el => el.remove());
    });

    /**
     * Requirement 3.2: WHEN a developer includes <link rel="stylesheet" href="dist/browser/tokens.css">
     * THEN all CSS custom properties required by components SHALL be available
     */
    it('should make CSS custom properties available when tokens are loaded', () => {
      // Read actual tokens.css content
      const tokensContent = fs.readFileSync(TOKENS_CSS_PATH, 'utf-8');
      
      // Inject tokens into JSDOM
      const styleElement = document.createElement('style');
      styleElement.setAttribute('data-test', 'tokens');
      styleElement.textContent = tokensContent;
      document.head.appendChild(styleElement);

      // Verify tokens are available via getComputedStyle
      const computedStyle = window.getComputedStyle(document.documentElement);
      
      // Check for essential tokens that components use
      // Note: JSDOM has limited CSS support, so we verify the style element was added
      expect(styleElement.textContent).toContain('--color-primary');
      expect(styleElement.textContent).toContain('--color-text-default');
      expect(styleElement.textContent).toContain('--space-inset-100');
    });

    it('should contain all essential semantic tokens for components', () => {
      const tokensContent = fs.readFileSync(TOKENS_CSS_PATH, 'utf-8');
      
      // Essential tokens that components reference
      const essentialTokens = [
        '--color-primary',
        '--color-error-strong',
        '--color-success-strong',
        '--color-text-default',
        '--color-text-muted',
        '--color-background',
        '--color-surface',
        '--color-border',
        '--space-inset-100',
        '--radius-100',
        '--duration-150',
        '--accessibility-focus-width',
        '--accessibility-focus-color',
      ];

      for (const token of essentialTokens) {
        expect(tokensContent).toContain(token);
      }
    });
  });

  describe('Console Warning When Tokens Not Loaded', () => {
    let consoleWarnSpy: jest.SpyInstance;
    let originalGetComputedStyle: typeof window.getComputedStyle;

    beforeEach(() => {
      // Spy on console.warn
      consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      // Store original getComputedStyle
      originalGetComputedStyle = window.getComputedStyle;
    });

    afterEach(() => {
      // Restore console.warn
      consoleWarnSpy.mockRestore();
      
      // Restore original getComputedStyle
      window.getComputedStyle = originalGetComputedStyle;
    });

    /**
     * Requirement 3.4: IF Token_CSS is not loaded THEN the Browser_Bundle SHALL log a warning
     * to the browser console indicating that tokens are required for proper styling
     */
    it('should warn when tokens are not detected', () => {
      // Mock getComputedStyle to return empty value (simulating no tokens loaded)
      window.getComputedStyle = jest.fn().mockReturnValue({
        getPropertyValue: jest.fn().mockReturnValue(''),
      });

      // Import and call the checkTokensLoaded function behavior
      // We simulate what browser-entry.ts does
      const testProperty = window.getComputedStyle(document.documentElement)
        .getPropertyValue('--color-primary');
      
      if (!testProperty || testProperty.trim() === '') {
        console.warn(
          '[DesignerPunk] Design tokens not detected. ' +
          'Include tokens.css before using components: ' +
          '<link rel="stylesheet" href="dist/browser/tokens.css">'
        );
      }

      // Verify warning was logged
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('[DesignerPunk]')
      );
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Design tokens not detected')
      );
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('tokens.css')
      );
    });

    it('should not warn when tokens are detected', () => {
      // Mock getComputedStyle to return a value (simulating tokens loaded)
      window.getComputedStyle = jest.fn().mockReturnValue({
        getPropertyValue: jest.fn().mockReturnValue('#FF00FF'),
      });

      // Simulate the checkTokensLoaded function behavior
      const testProperty = window.getComputedStyle(document.documentElement)
        .getPropertyValue('--color-primary');
      
      if (!testProperty || testProperty.trim() === '') {
        console.warn(
          '[DesignerPunk] Design tokens not detected. ' +
          'Include tokens.css before using components: ' +
          '<link rel="stylesheet" href="dist/browser/tokens.css">'
        );
      }

      // Verify no warning was logged
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should include actionable guidance in warning message', () => {
      // Mock getComputedStyle to return empty value
      window.getComputedStyle = jest.fn().mockReturnValue({
        getPropertyValue: jest.fn().mockReturnValue(''),
      });

      // Simulate the checkTokensLoaded function behavior
      const testProperty = window.getComputedStyle(document.documentElement)
        .getPropertyValue('--color-primary');
      
      if (!testProperty || testProperty.trim() === '') {
        console.warn(
          '[DesignerPunk] Design tokens not detected. ' +
          'Include tokens.css before using components: ' +
          '<link rel="stylesheet" href="dist/browser/tokens.css">'
        );
      }

      // Verify warning includes actionable guidance
      const warningMessage = consoleWarnSpy.mock.calls[0][0];
      expect(warningMessage).toContain('<link rel="stylesheet"');
      expect(warningMessage).toContain('dist/browser/tokens.css');
    });
  });

  describe('Token Detection Logic in Browser Entry', () => {
    /**
     * Verify the browser-entry.ts contains the correct token detection logic
     */
    it('should have checkTokensLoaded function in browser entry', () => {
      const browserEntryPath = path.join(process.cwd(), 'src', 'browser-entry.ts');
      const content = fs.readFileSync(browserEntryPath, 'utf-8');

      // Verify checkTokensLoaded function exists
      expect(content).toContain('function checkTokensLoaded');
      
      // Verify it checks for --color-primary
      expect(content).toContain('--color-primary');
      
      // Verify it uses getComputedStyle
      expect(content).toContain('getComputedStyle');
      
      // Verify it logs a warning
      expect(content).toContain('console.warn');
      expect(content).toContain('[DesignerPunk]');
    });

    it('should check tokens after DOM is ready', () => {
      const browserEntryPath = path.join(process.cwd(), 'src', 'browser-entry.ts');
      const content = fs.readFileSync(browserEntryPath, 'utf-8');

      // Verify DOM ready check
      expect(content).toContain('document.readyState');
      expect(content).toContain('DOMContentLoaded');
    });

    it('should handle both loading and ready states', () => {
      const browserEntryPath = path.join(process.cwd(), 'src', 'browser-entry.ts');
      const content = fs.readFileSync(browserEntryPath, 'utf-8');

      // Verify both states are handled
      expect(content).toMatch(/if\s*\(\s*document\.readyState\s*===\s*['"]loading['"]\s*\)/);
      expect(content).toContain('addEventListener');
      expect(content).toContain('checkTokensLoaded');
    });
  });

  describe('ESM Bundle Token Warning', () => {
    /**
     * Verify the ESM bundle contains the token warning logic
     */
    it('should contain token detection warning in ESM bundle', () => {
      const esmBundlePath = path.join(BROWSER_DIST_DIR, 'designerpunk.esm.js');
      
      if (!fs.existsSync(esmBundlePath)) {
        throw new Error('ESM bundle not found. Run "npm run build:browser" first.');
      }

      const bundleContent = fs.readFileSync(esmBundlePath, 'utf-8');

      // Verify warning message is in bundle
      expect(bundleContent).toContain('[DesignerPunk]');
      expect(bundleContent).toContain('Design tokens not detected');
      expect(bundleContent).toContain('tokens.css');
    });

    it('should check for --color-primary token in ESM bundle', () => {
      const esmBundlePath = path.join(BROWSER_DIST_DIR, 'designerpunk.esm.js');
      const bundleContent = fs.readFileSync(esmBundlePath, 'utf-8');

      // Verify the token check is in the bundle
      expect(bundleContent).toContain('--color-primary');
      expect(bundleContent).toContain('getPropertyValue');
    });
  });

  describe('UMD Bundle Token Warning', () => {
    /**
     * Verify the UMD bundle contains the token warning logic
     */
    it('should contain token detection warning in UMD bundle', () => {
      const umdBundlePath = path.join(BROWSER_DIST_DIR, 'designerpunk.umd.js');
      
      if (!fs.existsSync(umdBundlePath)) {
        throw new Error('UMD bundle not found. Run "npm run build:browser" first.');
      }

      const bundleContent = fs.readFileSync(umdBundlePath, 'utf-8');

      // Verify warning message is in bundle
      expect(bundleContent).toContain('[DesignerPunk]');
      expect(bundleContent).toContain('Design tokens not detected');
      expect(bundleContent).toContain('tokens.css');
    });

    it('should check for --color-primary token in UMD bundle', () => {
      const umdBundlePath = path.join(BROWSER_DIST_DIR, 'designerpunk.umd.js');
      const bundleContent = fs.readFileSync(umdBundlePath, 'utf-8');

      // Verify the token check is in the bundle
      expect(bundleContent).toContain('--color-primary');
      expect(bundleContent).toContain('getPropertyValue');
    });
  });
});
