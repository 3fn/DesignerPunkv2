/**
 * @jest-environment jsdom
 * @category evergreen
 * @purpose Property test for registration idempotency
 */

/**
 * Registration Idempotency Property Test
 *
 * Property 2: Registration Idempotency
 * Verifies that for any custom element name that is already registered in the
 * browser's custom elements registry, loading the Browser_Bundle SHALL not
 * throw an error and the existing registration SHALL remain unchanged.
 *
 * This property ensures that:
 * - The bundle can be safely loaded multiple times
 * - Pre-existing custom element registrations are not overwritten
 * - No errors are thrown for duplicate registration attempts
 *
 * @see .kiro/specs/028-web-component-browser-distribution/design.md
 * @see Requirements: 4.5
 * @validates Requirements 4.5
 *
 * Feature: web-component-browser-distribution, Property 2: Registration Idempotency
 */

import * as fs from 'fs';
import * as path from 'path';
import * as vm from 'vm';

describe('Property 2: Registration Idempotency', () => {
  const BROWSER_DIST_DIR = path.join(process.cwd(), 'dist', 'browser');
  const UMD_BUNDLE_PATH = path.join(BROWSER_DIST_DIR, 'designerpunk.umd.js');

  /**
   * Component names that are registered by the browser bundle
   * Note: Stemma System migration - text-input-field removed, using input-text-base instead
   */
  const COMPONENT_NAMES = [
    'input-text-base',
    'button-cta',
    'icon-base',
    'container-base',
  ];

  let bundleContent: string;

  beforeAll(() => {
    // Ensure bundles exist before running tests
    if (!fs.existsSync(BROWSER_DIST_DIR)) {
      throw new Error(
        'Browser bundles not found. Run "npm run build:browser" first.'
      );
    }

    bundleContent = fs.readFileSync(UMD_BUNDLE_PATH, 'utf-8');
  });

  /**
   * Creates a mock browser context for testing bundle execution
   */
  function createMockContext(
    preRegisteredElements: Map<string, CustomElementConstructor>
  ): Record<string, unknown> {
    // Track all registered elements (including pre-registered ones)
    const registeredElements = new Map(preRegisteredElements);

    return {
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
          // Simulate browser behavior: throw if already registered
          if (registeredElements.has(name)) {
            throw new DOMException(
              `Failed to execute 'define' on 'CustomElementRegistry': the name "${name}" has already been used with this registry`,
              'NotSupportedError'
            );
          }
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
      // Return the registered elements map for verification
      _registeredElements: registeredElements,
    };
  }

  describe('Pre-registered Element Handling', () => {
    /**
     * Property: For any pre-registered custom element, loading the bundle
     * SHALL NOT throw an error.
     *
     * This tests the core idempotency property by pre-registering elements
     * before loading the bundle.
     */
    test.each(COMPONENT_NAMES)(
      'should not throw error when %s is pre-registered',
      (componentName) => {
        // Create a mock constructor for the pre-registered element
        const preRegisteredConstructor = class extends (class {} as typeof HTMLElement) {
          static get observedAttributes() {
            return [];
          }
        } as unknown as CustomElementConstructor;

        // Pre-register the element
        const preRegistered = new Map<string, CustomElementConstructor>();
        preRegistered.set(componentName, preRegisteredConstructor);

        const mockContext = createMockContext(preRegistered);

        // Property assertion: loading bundle should not throw
        expect(() => {
          const script = new vm.Script(bundleContent);
          const context = vm.createContext(mockContext);
          script.runInContext(context);
        }).not.toThrow();

        console.log(`✓ Bundle loaded without error when ${componentName} was pre-registered`);
      }
    );

    /**
     * Property: For any pre-registered custom element, the original
     * registration SHALL remain unchanged after loading the bundle.
     *
     * This ensures that safeDefine() preserves existing registrations.
     */
    test.each(COMPONENT_NAMES)(
      'should preserve original registration when %s is pre-registered',
      (componentName) => {
        // Create a mock constructor for the pre-registered element
        const preRegisteredConstructor = class extends (class {} as typeof HTMLElement) {
          static get observedAttributes() {
            return [];
          }
          static readonly __preRegistered = true;
        } as unknown as CustomElementConstructor;

        // Pre-register the element
        const preRegistered = new Map<string, CustomElementConstructor>();
        preRegistered.set(componentName, preRegisteredConstructor);

        const mockContext = createMockContext(preRegistered);

        // Load the bundle
        const script = new vm.Script(bundleContent);
        const context = vm.createContext(mockContext);
        script.runInContext(context);

        // Get the registered elements map
        const registeredElements = mockContext._registeredElements as Map<
          string,
          CustomElementConstructor
        >;

        // Property assertion: original constructor should still be registered
        const registeredConstructor = registeredElements.get(componentName);
        expect(registeredConstructor).toBe(preRegisteredConstructor);

        // Verify it's the pre-registered one by checking our marker
        expect((registeredConstructor as unknown as { __preRegistered: boolean }).__preRegistered).toBe(true);

        console.log(`✓ Original registration preserved for ${componentName}`);
      }
    );
  });

  describe('Multiple Bundle Loads', () => {
    /**
     * Property: Loading the bundle multiple times SHALL NOT throw an error.
     *
     * This tests idempotency when the same bundle is loaded twice,
     * simulating scenarios where the script tag is duplicated.
     */
    it('should not throw error when bundle is loaded twice', () => {
      const mockContext = createMockContext(new Map());

      // First load
      expect(() => {
        const script = new vm.Script(bundleContent);
        const context = vm.createContext(mockContext);
        script.runInContext(context);
      }).not.toThrow();

      // Second load - should also not throw
      expect(() => {
        const script = new vm.Script(bundleContent);
        const context = vm.createContext(mockContext);
        script.runInContext(context);
      }).not.toThrow();

      console.log('✓ Bundle loaded twice without error');
    });

    /**
     * Property: After loading the bundle multiple times, all components
     * SHALL still be registered.
     *
     * This ensures that multiple loads don't corrupt the registry.
     */
    it('should have all components registered after multiple loads', () => {
      const mockContext = createMockContext(new Map());
      const context = vm.createContext(mockContext);

      // Load bundle twice
      const script = new vm.Script(bundleContent);
      script.runInContext(context);
      script.runInContext(context);

      // Get the registered elements map
      const registeredElements = mockContext._registeredElements as Map<
        string,
        CustomElementConstructor
      >;

      // Property assertion: all components should be registered
      for (const componentName of COMPONENT_NAMES) {
        expect(registeredElements.has(componentName)).toBe(true);
      }

      console.log('✓ All components registered after multiple loads');
    });
  });

  describe('All Components Pre-registered', () => {
    /**
     * Property: When ALL components are pre-registered, loading the bundle
     * SHALL NOT throw an error.
     *
     * This is the most extreme idempotency test - all elements already exist.
     */
    it('should not throw error when all components are pre-registered', () => {
      // Pre-register all components
      const preRegistered = new Map<string, CustomElementConstructor>();
      for (const componentName of COMPONENT_NAMES) {
        const constructor = class extends (class {} as typeof HTMLElement) {
          static get observedAttributes() {
            return [];
          }
        } as unknown as CustomElementConstructor;
        preRegistered.set(componentName, constructor);
      }

      const mockContext = createMockContext(preRegistered);

      // Property assertion: loading bundle should not throw
      expect(() => {
        const script = new vm.Script(bundleContent);
        const context = vm.createContext(mockContext);
        script.runInContext(context);
      }).not.toThrow();

      console.log('✓ Bundle loaded without error when all components were pre-registered');
    });

    /**
     * Property: When ALL components are pre-registered, ALL original
     * registrations SHALL remain unchanged.
     *
     * This verifies that safeDefine() correctly skips all registrations.
     */
    it('should preserve all original registrations when all components are pre-registered', () => {
      // Pre-register all components with markers
      const preRegistered = new Map<string, CustomElementConstructor>();
      for (const componentName of COMPONENT_NAMES) {
        const constructor = class extends (class {} as typeof HTMLElement) {
          static get observedAttributes() {
            return [];
          }
          static readonly __preRegistered = true;
          static readonly __componentName = componentName;
        } as unknown as CustomElementConstructor;
        preRegistered.set(componentName, constructor);
      }

      const mockContext = createMockContext(preRegistered);

      // Load the bundle
      const script = new vm.Script(bundleContent);
      const context = vm.createContext(mockContext);
      script.runInContext(context);

      // Get the registered elements map
      const registeredElements = mockContext._registeredElements as Map<
        string,
        CustomElementConstructor
      >;

      // Property assertion: all original constructors should still be registered
      for (const componentName of COMPONENT_NAMES) {
        const registeredConstructor = registeredElements.get(componentName);
        expect(registeredConstructor).toBeDefined();
        expect(
          (registeredConstructor as unknown as { __preRegistered: boolean }).__preRegistered
        ).toBe(true);
        expect(
          (registeredConstructor as unknown as { __componentName: string }).__componentName
        ).toBe(componentName);
      }

      console.log('✓ All original registrations preserved');
    });
  });

  describe('safeDefine Function Verification', () => {
    /**
     * Property: The safeDefine function SHALL check customElements.get()
     * before calling customElements.define().
     *
     * This verifies the implementation pattern in browser-entry.ts.
     */
    it('should use safeDefine pattern in browser entry source', () => {
      const browserEntryPath = path.join(process.cwd(), 'src', 'browser-entry.ts');
      const content = fs.readFileSync(browserEntryPath, 'utf-8');

      // Property assertion: safeDefine should check before defining
      expect(content).toContain('customElements.get(name)');
      expect(content).toContain('customElements.define(name, constructor)');

      // Verify the pattern: check first, then define
      const safeDefineMatch = content.match(
        /function\s+safeDefine[\s\S]*?if\s*\(\s*!customElements\.get\(name\)\s*\)[\s\S]*?customElements\.define\(name,\s*constructor\)/
      );
      expect(safeDefineMatch).not.toBeNull();

      console.log('✓ safeDefine function uses correct idempotency pattern');
    });

    /**
     * Property: The bundle SHALL contain the safeDefine pattern.
     *
     * This verifies that the idempotency logic is preserved in the bundle.
     */
    it('should contain safeDefine pattern in UMD bundle', () => {
      // Property assertion: bundle should contain the idempotency check
      expect(bundleContent).toContain('customElements.get');
      expect(bundleContent).toContain('customElements.define');

      console.log('✓ UMD bundle contains safeDefine pattern');
    });
  });
});
