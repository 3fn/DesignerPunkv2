/**
 * @jest-environment jsdom
 * @category evergreen
 * @purpose Verify custom element auto-registration in browser bundles
 */

/**
 * Component Registration Tests
 *
 * Tests that verify:
 * 1. All four components register automatically on bundle load (Requirements 4.1, 4.2, 4.3, 4.4)
 * 2. ESM bundle registration (Requirements 1.2, 1.3)
 * 3. UMD bundle registration and global object (Requirements 2.2, 2.3)
 *
 * @see .kiro/specs/028-web-component-browser-distribution/design.md
 * @see Requirements: 1.2, 1.3, 2.2, 2.3, 4.1, 4.2, 4.3, 4.4
 */

import * as fs from 'fs';
import * as path from 'path';
import * as vm from 'vm';

describe('Component Registration', () => {
  const BROWSER_DIST_DIR = path.join(process.cwd(), 'dist', 'browser');
  const ESM_BUNDLE_PATH = path.join(BROWSER_DIST_DIR, 'designerpunk.esm.js');
  const UMD_BUNDLE_PATH = path.join(BROWSER_DIST_DIR, 'designerpunk.umd.js');

  beforeAll(() => {
    if (!fs.existsSync(BROWSER_DIST_DIR)) {
      throw new Error('Browser bundles not found. Run "npm run build:browser" first.');
    }
  });

  describe('ESM Bundle Component Registration', () => {
    let bundleContent: string;

    beforeAll(() => {
      bundleContent = fs.readFileSync(ESM_BUNDLE_PATH, 'utf-8');
    });

    it('should contain safeDefine and all component registrations', () => {
      expect(bundleContent).toContain('safeDefine');
      expect(bundleContent).toContain('text-input-field');
      expect(bundleContent).toContain('input-text-base');
      expect(bundleContent).toContain('input-text-email');
      expect(bundleContent).toContain('button-cta');
      expect(bundleContent).toContain('dp-icon');
      expect(bundleContent).toContain('dp-container');
    });

    it('should register all six custom elements via safeDefine', () => {
      // Requirements 4.1, 4.2, 4.3, 4.4
      expect(bundleContent).toMatch(/safeDefine\s*\(\s*['"]text-input-field['"]/);
      expect(bundleContent).toMatch(/safeDefine\s*\(\s*['"]input-text-base['"]/);
      expect(bundleContent).toMatch(/safeDefine\s*\(\s*['"]input-text-email['"]/);
      expect(bundleContent).toMatch(/safeDefine\s*\(\s*['"]button-cta['"]/);
      expect(bundleContent).toMatch(/safeDefine\s*\(\s*['"]dp-icon['"]/);
      expect(bundleContent).toMatch(/safeDefine\s*\(\s*['"]dp-container['"]/);
    });

    it('should export all component classes', () => {
      // Requirements 1.2, 1.3
      expect(bundleContent).toMatch(/export\s*\{[^}]*TextInputField[^}]*\}/);
      expect(bundleContent).toMatch(/export\s*\{[^}]*InputTextBase[^}]*\}/);
      expect(bundleContent).toMatch(/export\s*\{[^}]*InputTextEmail[^}]*\}/);
      expect(bundleContent).toMatch(/export\s*\{[^}]*ButtonCTA[^}]*\}/);
      expect(bundleContent).toMatch(/export\s*\{[^}]*DPIcon[^}]*\}/);
      expect(bundleContent).toMatch(/export\s*\{[^}]*ContainerWeb[^}]*\}/);
    });
  });

  describe('UMD Bundle Component Registration', () => {
    let bundleContent: string;
    let mockContext: Record<string, unknown>;
    let registeredElements: Map<string, CustomElementConstructor>;

    beforeAll(() => {
      bundleContent = fs.readFileSync(UMD_BUNDLE_PATH, 'utf-8');
      registeredElements = new Map();

      mockContext = {
        React: {
          createElement: jest.fn(),
          useState: jest.fn(() => [null, jest.fn()]),
          useEffect: jest.fn(),
          useRef: jest.fn(() => ({ current: null })),
          useCallback: jest.fn((fn: unknown) => fn),
          useMemo: jest.fn((fn: () => unknown) => fn()),
          forwardRef: jest.fn((c: unknown) => c),
          memo: jest.fn((c: unknown) => c),
        },
        jsxRuntime: { jsx: jest.fn(), jsxs: jest.fn(), Fragment: 'Fragment' },
        emotionReact: { css: jest.fn(() => ''), keyframes: jest.fn(() => '') },
        document: {
          documentElement: {},
          readyState: 'complete',
          createElement: jest.fn(() => ({
            attachShadow: jest.fn(() => ({ appendChild: jest.fn() })),
          })),
          addEventListener: jest.fn(),
        },
        getComputedStyle: jest.fn(() => ({
          getPropertyValue: jest.fn(() => '#FF00FF'),
        })),
        customElements: {
          get: jest.fn((name: string) => registeredElements.get(name)),
          define: jest.fn((name: string, ctor: CustomElementConstructor) => {
            registeredElements.set(name, ctor);
          }),
        },
        console: { warn: jest.fn(), log: jest.fn(), error: jest.fn() },
        HTMLElement: class MockHTMLElement {},
      };

      // Execute bundle once
      const script = new vm.Script(bundleContent);
      const context = vm.createContext(mockContext);
      script.runInContext(context);
    });

    it('should expose DesignerPunk global object (Req 2.2)', () => {
      expect(mockContext.DesignerPunk).toBeDefined();
    });

    it('should register all five custom elements (Req 2.3, 4.1-4.4)', () => {
      expect(registeredElements.has('text-input-field')).toBe(true);
      expect(registeredElements.has('input-text-base')).toBe(true);
      expect(registeredElements.has('button-cta')).toBe(true);
      expect(registeredElements.has('dp-icon')).toBe(true);
      expect(registeredElements.has('dp-container')).toBe(true);
    });

    it('should expose all components in DesignerPunk global', () => {
      const dp = mockContext.DesignerPunk as Record<string, unknown>;
      expect(dp.TextInputField).toBeDefined();
      expect(dp.InputTextBase).toBeDefined();
      expect(dp.ButtonCTA).toBeDefined();
      expect(dp.DPIcon).toBeDefined();
      expect(dp.ContainerWeb).toBeDefined();
    });

    it('should expose Icon and Container aliases', () => {
      const dp = mockContext.DesignerPunk as Record<string, unknown>;
      expect(dp.Icon).toBe(dp.DPIcon);
      expect(dp.Container).toBe(dp.ContainerWeb);
    });
  });

  describe('Browser Entry Source Verification', () => {
    let content: string;

    beforeAll(() => {
      const browserEntryPath = path.join(process.cwd(), 'src', 'browser-entry.ts');
      content = fs.readFileSync(browserEntryPath, 'utf-8');
    });

    it('should have correct component imports', () => {
      expect(content).toContain("import { TextInputField }");
      expect(content).toContain("import { InputTextBase }");
      expect(content).toContain("import { InputTextEmail }");
      expect(content).toContain("import { ButtonCTA }");
      expect(content).toContain("import { DPIcon }");
      expect(content).toContain("import { ContainerWeb }");
    });

    it('should have safeDefine calls for all six components', () => {
      expect(content).toContain("safeDefine('text-input-field', TextInputField)");
      expect(content).toContain("safeDefine('input-text-base', InputTextBase)");
      expect(content).toContain("safeDefine('input-text-email', InputTextEmail)");
      expect(content).toContain("safeDefine('button-cta', ButtonCTA)");
      expect(content).toContain("safeDefine('dp-icon', DPIcon)");
      expect(content).toContain("safeDefine('dp-container', ContainerWeb)");
    });

    it('should export all components for UMD global access', () => {
      expect(content).toContain('export { TextInputField, InputTextBase, InputTextEmail, ButtonCTA, DPIcon, ContainerWeb }');
      expect(content).toContain('export const Icon = DPIcon');
      expect(content).toContain('export const Container = ContainerWeb');
    });
  });
});
