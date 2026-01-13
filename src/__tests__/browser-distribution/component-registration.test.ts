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
      expect(bundleContent).toContain('input-text-base');
      expect(bundleContent).toContain('input-text-email');
      expect(bundleContent).toContain('button-cta');
      expect(bundleContent).toContain('icon-base');
      expect(bundleContent).toContain('container-base');
    });

    it('should register all custom elements via safeDefine', () => {
      // Requirements 4.1, 4.2, 4.3, 4.4
      // Note: text-input-field removed - use input-text-base instead (Stemma System migration)
      // Note: dp-icon and dp-container deprecated names removed
      // Note: button-vertical-list-item added in spec 038
      // Note: button-vertical-list-set added in spec 041
      expect(bundleContent).toMatch(/safeDefine\s*\(\s*['"]input-text-base['"]/);
      expect(bundleContent).toMatch(/safeDefine\s*\(\s*['"]input-text-email['"]/);
      expect(bundleContent).toMatch(/safeDefine\s*\(\s*['"]button-cta['"]/);
      expect(bundleContent).toMatch(/safeDefine\s*\(\s*['"]icon-base['"]/);
      expect(bundleContent).toMatch(/safeDefine\s*\(\s*['"]container-base['"]/);
    });

    it('should export all component classes', () => {
      // Requirements 1.2, 1.3
      // Note: Stemma System migration - legacy exports removed, using new naming
      expect(bundleContent).toMatch(/export\s*\{[^}]*InputTextBase[^}]*\}/);
      expect(bundleContent).toMatch(/export\s*\{[^}]*InputTextEmail[^}]*\}/);
      expect(bundleContent).toMatch(/export\s*\{[^}]*ButtonCTA[^}]*\}/);
      expect(bundleContent).toMatch(/export\s*\{[^}]*IconBaseElement[^}]*\}/);
      expect(bundleContent).toMatch(/export\s*\{[^}]*ContainerBaseWeb[^}]*\}/);
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
        // Browser animation API - required for token loading check
        requestAnimationFrame: jest.fn((callback: () => void) => {
          callback();
          return 0;
        }),
      };

      // Execute bundle once
      const script = new vm.Script(bundleContent);
      const context = vm.createContext(mockContext);
      script.runInContext(context);
    });

    it('should expose DesignerPunk global object (Req 2.2)', () => {
      expect(mockContext.DesignerPunk).toBeDefined();
    });

    it('should register all custom elements (Req 2.3, 4.1-4.4)', () => {
      // Note: text-input-field removed - use input-text-base instead (Stemma System migration)
      // Note: dp-icon and dp-container deprecated names removed
      // Note: button-vertical-list-item added in spec 038
      // Note: button-vertical-list-set added in spec 041
      expect(registeredElements.has('input-text-base')).toBe(true);
      expect(registeredElements.has('button-cta')).toBe(true);
      expect(registeredElements.has('icon-base')).toBe(true);
      expect(registeredElements.has('container-base')).toBe(true);
    });

    it('should expose all components in DesignerPunk global', () => {
      const dp = mockContext.DesignerPunk as Record<string, unknown>;
      // Note: Stemma System migration - legacy exports removed, using new naming
      expect(dp.InputTextBase).toBeDefined();
      expect(dp.ButtonCTA).toBeDefined();
      expect(dp.IconBaseElement).toBeDefined();
      expect(dp.ContainerBaseWeb).toBeDefined();
    });

    it('should expose Icon, IconBase, Container, ContainerBase, and TextInputField aliases', () => {
      const dp = mockContext.DesignerPunk as Record<string, unknown>;
      expect(dp.Icon).toBe(dp.IconBaseElement);
      expect(dp.IconBase).toBe(dp.IconBaseElement);
      expect(dp.Container).toBe(dp.ContainerBaseWeb);
      expect(dp.ContainerBase).toBe(dp.ContainerBaseWeb);
      // Legacy alias for backward compatibility
      expect(dp.TextInputField).toBe(dp.InputTextBase);
    });
  });

  describe('Browser Entry Source Verification', () => {
    let content: string;

    beforeAll(() => {
      const browserEntryPath = path.join(process.cwd(), 'src', 'browser-entry.ts');
      content = fs.readFileSync(browserEntryPath, 'utf-8');
    });

    it('should have correct component imports', () => {
      // Note: Stemma System migration - legacy imports removed, using new naming
      expect(content).toContain("import { InputTextBase }");
      expect(content).toContain("import { InputTextEmail }");
      expect(content).toContain("import { ButtonCTA }");
      expect(content).toContain("import { IconBaseElement }");
      expect(content).toContain("import { ContainerBaseWeb }");
    });

    it('should have safeDefine calls for all five components', () => {
      // Note: text-input-field removed - use input-text-base instead (Stemma System migration)
      // Note: dp-icon and dp-container deprecated names removed
      expect(content).toContain("safeDefine('input-text-base', InputTextBase)");
      expect(content).toContain("safeDefine('input-text-email', InputTextEmail)");
      expect(content).toContain("safeDefine('button-cta', ButtonCTA)");
      expect(content).toContain("safeDefine('icon-base', IconBaseElement)");
      expect(content).toContain("safeDefine('container-base', ContainerBaseWeb)");
    });

    it('should export all components for UMD global access', () => {
      // Note: Stemma System migration - legacy exports removed, using new naming
      // ButtonVerticalListItem added as part of spec 038
      // ButtonVerticalListSet added as part of spec 041
      expect(content).toContain('export { InputTextBase, InputTextEmail, InputTextPassword, InputTextPhoneNumber, ButtonCTA, IconBaseElement, ButtonIcon, ContainerBaseWeb, ButtonVerticalListItem, ButtonVerticalListSet }');
      expect(content).toContain('export const Icon = IconBaseElement');
      expect(content).toContain('export const IconBase = IconBaseElement');
      expect(content).toContain('export const Container = ContainerBaseWeb');
      expect(content).toContain('export const ContainerBase = ContainerBaseWeb');
      // Legacy alias for backward compatibility
      expect(content).toContain('export const TextInputField = InputTextBase');
    });
  });
});
