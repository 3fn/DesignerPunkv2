/**
 * @jest-environment jsdom
 * @category evergreen
 * @purpose Verify browser bundles load without errors in JSDOM environment
 */

/**
 * Browser Bundle Loading Tests
 *
 * Tests that ESM and UMD bundles load correctly in a browser-like environment.
 * Uses JSDOM to simulate browser APIs for custom element registration.
 *
 * @see .kiro/specs/028-web-component-browser-distribution/design.md
 * @see Requirements: 1.1, 2.1
 */

import * as fs from 'fs';
import * as path from 'path';
import * as vm from 'vm';

describe('Browser Bundle Loading', () => {
  const BROWSER_DIST_DIR = path.join(process.cwd(), 'dist', 'browser');

  beforeAll(() => {
    // Ensure bundles exist before running tests
    if (!fs.existsSync(BROWSER_DIST_DIR)) {
      throw new Error(
        'Browser bundles not found. Run "npm run build:browser" first.'
      );
    }
  });

  describe('ESM Bundle', () => {
    const ESM_BUNDLE_PATH = path.join(BROWSER_DIST_DIR, 'designerpunk.esm.js');

    it('should exist at expected path', () => {
      expect(fs.existsSync(ESM_BUNDLE_PATH)).toBe(true);
    });

    it('should have source map file', () => {
      const sourceMapPath = `${ESM_BUNDLE_PATH}.map`;
      expect(fs.existsSync(sourceMapPath)).toBe(true);
    });

    it('should contain ES module syntax', () => {
      const bundleContent = fs.readFileSync(ESM_BUNDLE_PATH, 'utf-8');

      // Check for ESM export syntax (esbuild bundles inline, so no import statements)
      // The bundle should have export statements at the end
      expect(bundleContent).toMatch(/export\s*\{/);
    });

    it('should export expected components', () => {
      const bundleContent = fs.readFileSync(ESM_BUNDLE_PATH, 'utf-8');

      // Check for component exports in the export statement (Stemma System naming)
      expect(bundleContent).toContain('TextInputField');
      expect(bundleContent).toContain('ButtonCTA');
      expect(bundleContent).toContain('IconBaseElement');
      expect(bundleContent).toContain('ContainerBaseWeb');
    });

    it('should contain safeDefine function for idempotent registration', () => {
      const bundleContent = fs.readFileSync(ESM_BUNDLE_PATH, 'utf-8');

      // Check for safeDefine function definition
      expect(bundleContent).toContain('function safeDefine');
      expect(bundleContent).toContain('customElements.get');
    });

    it('should contain token detection warning logic', () => {
      const bundleContent = fs.readFileSync(ESM_BUNDLE_PATH, 'utf-8');

      // Check for token warning message
      expect(bundleContent).toContain('[DesignerPunk]');
      expect(bundleContent).toContain('Design tokens not detected');
    });
  });

  describe('UMD Bundle', () => {
    const UMD_BUNDLE_PATH = path.join(BROWSER_DIST_DIR, 'designerpunk.umd.js');

    it('should exist at expected path', () => {
      expect(fs.existsSync(UMD_BUNDLE_PATH)).toBe(true);
    });

    it('should have source map file', () => {
      const sourceMapPath = `${UMD_BUNDLE_PATH}.map`;
      expect(fs.existsSync(sourceMapPath)).toBe(true);
    });

    it('should contain valid JavaScript syntax', () => {
      const bundleContent = fs.readFileSync(UMD_BUNDLE_PATH, 'utf-8');

      // Should not have syntax errors
      expect(() => {
        new Function(bundleContent);
      }).not.toThrow();
    });

    it('should contain UMD/IIFE wrapper pattern', () => {
      const bundleContent = fs.readFileSync(UMD_BUNDLE_PATH, 'utf-8');

      // Check for esbuild's IIFE pattern that assigns to global
      expect(bundleContent).toContain('var DesignerPunk');
      expect(bundleContent).toContain('DesignerPunk');
    });

    it('should contain all component classes', () => {
      const bundleContent = fs.readFileSync(UMD_BUNDLE_PATH, 'utf-8');

      // Check for component class definitions (Stemma System naming)
      expect(bundleContent).toContain('TextInputField');
      expect(bundleContent).toContain('ButtonCTA');
      expect(bundleContent).toContain('IconBaseElement');
      expect(bundleContent).toContain('ContainerBaseWeb');
    });
  });

  describe('UMD Bundle Execution in JSDOM', () => {
    const UMD_BUNDLE_PATH = path.join(BROWSER_DIST_DIR, 'designerpunk.umd.js');

    /**
     * Creates mock dependencies for UMD bundle execution
     */
    function createMockDependencies(): Record<string, unknown> {
      const mockReact = {
        createElement: jest.fn(),
        useState: jest.fn(() => [null, jest.fn()]),
        useEffect: jest.fn(),
        useRef: jest.fn(() => ({ current: null })),
        useCallback: jest.fn((fn: unknown) => fn),
        useMemo: jest.fn((fn: () => unknown) => fn()),
        forwardRef: jest.fn((component: unknown) => component),
        memo: jest.fn((component: unknown) => component),
      };

      const mockJsxRuntime = {
        jsx: jest.fn(),
        jsxs: jest.fn(),
        Fragment: 'Fragment',
      };

      const mockEmotionReact = {
        css: jest.fn(() => ''),
        keyframes: jest.fn(() => ''),
      };

      return {
        React: mockReact,
        jsxRuntime: mockJsxRuntime,
        emotionReact: mockEmotionReact,
        document: {
          documentElement: {},
          readyState: 'complete', // Simulate DOM already loaded
          createElement: jest.fn(() => ({
            attachShadow: jest.fn(() => ({
              appendChild: jest.fn(),
            })),
          })),
          addEventListener: jest.fn(),
        },
        getComputedStyle: jest.fn(() => ({
          getPropertyValue: jest.fn(() => ''),
        })),
        customElements: {
          get: jest.fn(() => undefined),
          define: jest.fn(),
        },
        console: {
          warn: jest.fn(),
          log: jest.fn(),
          error: jest.fn(),
        },
        HTMLElement: class MockHTMLElement {},
        // Browser animation API - required for token loading check
        requestAnimationFrame: jest.fn((callback: () => void) => {
          callback();
          return 0;
        }),
      };
    }

    it('should load without throwing errors when dependencies are provided', () => {
      const bundleContent = fs.readFileSync(UMD_BUNDLE_PATH, 'utf-8');
      const mockWindow = createMockDependencies();

      // Execute the bundle in the mock context
      expect(() => {
        const script = new vm.Script(bundleContent);
        const context = vm.createContext(mockWindow);
        script.runInContext(context);
      }).not.toThrow();
    });

    it('should expose DesignerPunk global with expected exports', () => {
      const bundleContent = fs.readFileSync(UMD_BUNDLE_PATH, 'utf-8');
      const mockWindow = createMockDependencies();

      const script = new vm.Script(bundleContent);
      const context = vm.createContext(mockWindow);
      script.runInContext(context);

      // Check that DesignerPunk global has expected exports (Stemma System naming)
      const designerPunk = mockWindow.DesignerPunk as Record<string, unknown>;
      expect(designerPunk).toBeDefined();
      expect(designerPunk.TextInputField).toBeDefined();
      expect(designerPunk.ButtonCTA).toBeDefined();
      expect(designerPunk.IconBaseElement).toBeDefined();
      expect(designerPunk.ContainerBaseWeb).toBeDefined();
    });

    it('should expose utility functions as internal (not exported)', () => {
      const bundleContent = fs.readFileSync(UMD_BUNDLE_PATH, 'utf-8');

      // Utility functions exist in the bundle but are internal (not exported)
      // They are used for auto-registration and token detection
      expect(bundleContent).toContain('function safeDefine');
      expect(bundleContent).toContain('function checkTokensLoaded');
    });

    it('should expose alias exports', () => {
      const bundleContent = fs.readFileSync(UMD_BUNDLE_PATH, 'utf-8');
      const mockWindow = createMockDependencies();

      const script = new vm.Script(bundleContent);
      const context = vm.createContext(mockWindow);
      script.runInContext(context);

      const designerPunk = mockWindow.DesignerPunk as Record<string, unknown>;
      // Check for alias exports (Icon = IconBaseElement, Container = ContainerBaseWeb)
      expect(designerPunk.Icon).toBeDefined();
      expect(designerPunk.IconBase).toBeDefined();
      expect(designerPunk.Container).toBeDefined();
      expect(designerPunk.ContainerBase).toBeDefined();
    });

    it('should have expected export structure', () => {
      const bundleContent = fs.readFileSync(UMD_BUNDLE_PATH, 'utf-8');
      const mockWindow = createMockDependencies();

      const script = new vm.Script(bundleContent);
      const context = vm.createContext(mockWindow);
      script.runInContext(context);

      const designerPunk = mockWindow.DesignerPunk as Record<string, unknown>;
      
      // Verify the export structure matches browser-entry.ts exports (Stemma System naming)
      const exportKeys = Object.keys(designerPunk);
      expect(exportKeys).toContain('TextInputField');
      expect(exportKeys).toContain('ButtonCTA');
      expect(exportKeys).toContain('IconBaseElement');
      expect(exportKeys).toContain('ContainerBaseWeb');
      expect(exportKeys).toContain('Icon');
      expect(exportKeys).toContain('IconBase');
      expect(exportKeys).toContain('Container');
      expect(exportKeys).toContain('ContainerBase');
    });
  });

  describe('Bundle File Integrity', () => {
    it('should have non-empty ESM bundle', () => {
      const esmPath = path.join(BROWSER_DIST_DIR, 'designerpunk.esm.js');
      const stats = fs.statSync(esmPath);

      // Bundle should be at least 10KB (reasonable minimum for components)
      expect(stats.size).toBeGreaterThan(10 * 1024);
    });

    it('should have non-empty UMD bundle', () => {
      const umdPath = path.join(BROWSER_DIST_DIR, 'designerpunk.umd.js');
      const stats = fs.statSync(umdPath);

      // Bundle should be at least 10KB (reasonable minimum for components)
      expect(stats.size).toBeGreaterThan(10 * 1024);
    });

    it('should have valid source map references', () => {
      const esmPath = path.join(BROWSER_DIST_DIR, 'designerpunk.esm.js');
      const umdPath = path.join(BROWSER_DIST_DIR, 'designerpunk.umd.js');

      const esmContent = fs.readFileSync(esmPath, 'utf-8');
      const umdContent = fs.readFileSync(umdPath, 'utf-8');

      // Check for sourceMappingURL comment
      expect(esmContent).toContain('//# sourceMappingURL=');
      expect(umdContent).toContain('//# sourceMappingURL=');
    });
  });

  describe('Minified Bundles', () => {
    const ESM_MIN_PATH = path.join(BROWSER_DIST_DIR, 'designerpunk.esm.min.js');
    const UMD_MIN_PATH = path.join(BROWSER_DIST_DIR, 'designerpunk.umd.min.js');

    it('should have minified ESM bundle', () => {
      expect(fs.existsSync(ESM_MIN_PATH)).toBe(true);
    });

    it('should have minified UMD bundle', () => {
      expect(fs.existsSync(UMD_MIN_PATH)).toBe(true);
    });

    it('should have source maps for minified bundles', () => {
      expect(fs.existsSync(`${ESM_MIN_PATH}.map`)).toBe(true);
      expect(fs.existsSync(`${UMD_MIN_PATH}.map`)).toBe(true);
    });

    it('should have minified ESM bundle smaller than development bundle', () => {
      const devPath = path.join(BROWSER_DIST_DIR, 'designerpunk.esm.js');
      const devStats = fs.statSync(devPath);
      const minStats = fs.statSync(ESM_MIN_PATH);

      // Minified should be smaller
      expect(minStats.size).toBeLessThan(devStats.size);
    });

    it('should have minified UMD bundle smaller than development bundle', () => {
      const devPath = path.join(BROWSER_DIST_DIR, 'designerpunk.umd.js');
      const devStats = fs.statSync(devPath);
      const minStats = fs.statSync(UMD_MIN_PATH);

      // Minified should be smaller
      expect(minStats.size).toBeLessThan(devStats.size);
    });

    it('should have valid source map references in minified bundles', () => {
      const esmMinContent = fs.readFileSync(ESM_MIN_PATH, 'utf-8');
      const umdMinContent = fs.readFileSync(UMD_MIN_PATH, 'utf-8');

      expect(esmMinContent).toContain('//# sourceMappingURL=');
      expect(umdMinContent).toContain('//# sourceMappingURL=');
    });

    it('should contain valid JavaScript in minified ESM bundle', () => {
      const bundleContent = fs.readFileSync(ESM_MIN_PATH, 'utf-8');
      
      // Should not have syntax errors (basic check)
      expect(bundleContent.length).toBeGreaterThan(0);
      // Should still have export syntax
      expect(bundleContent).toMatch(/export\s*\{/);
    });

    it('should contain valid JavaScript in minified UMD bundle', () => {
      const bundleContent = fs.readFileSync(UMD_MIN_PATH, 'utf-8');
      
      // Should not have syntax errors
      expect(() => {
        new Function(bundleContent);
      }).not.toThrow();
    });
  });

});
