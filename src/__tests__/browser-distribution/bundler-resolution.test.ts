/**
 * @jest-environment node
 * @category evergreen
 * @purpose Verify npm package exports resolve correctly for bundlers
 */

/**
 * Bundler Resolution Tests
 *
 * Tests that verify package.json exports configuration enables bundlers
 * to correctly resolve imports to the ESM browser bundle.
 *
 * @see .kiro/specs/028-web-component-browser-distribution/design.md
 * @see Requirements: 6.4
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Bundler Resolution', () => {
  const PROJECT_ROOT = process.cwd();
  const PACKAGE_JSON_PATH = path.join(PROJECT_ROOT, 'package.json');
  const BROWSER_DIST_DIR = path.join(PROJECT_ROOT, 'dist', 'browser');

  let packageJson: {
    name: string;
    main: string;
    module: string;
    browser: string;
    types: string;
    exports: {
      '.': {
        import: string;
        require: string;
        types: string;
      };
      './tokens.css': string;
    };
  };

  beforeAll(() => {
    // Load package.json
    const packageJsonContent = fs.readFileSync(PACKAGE_JSON_PATH, 'utf-8');
    packageJson = JSON.parse(packageJsonContent);
  });

  describe('Package.json Exports Configuration', () => {
    it('should have exports field defined', () => {
      expect(packageJson.exports).toBeDefined();
      expect(typeof packageJson.exports).toBe('object');
    });

    it('should have main entry point export with import/require conditions', () => {
      const mainExport = packageJson.exports['.'];
      expect(mainExport).toBeDefined();
      expect(mainExport.import).toBeDefined();
      expect(mainExport.require).toBeDefined();
    });

    it('should have import condition pointing to ESM bundle (Req 6.1)', () => {
      const importPath = packageJson.exports['.'].import;
      expect(importPath).toBe('./dist/browser/designerpunk.esm.js');
    });

    it('should have require condition pointing to CommonJS entry', () => {
      const requirePath = packageJson.exports['.'].require;
      expect(requirePath).toBe('./dist/TokenEngine.js');
    });

    it('should have types condition for TypeScript support', () => {
      const typesPath = packageJson.exports['.'].types;
      expect(typesPath).toBe('./dist/TokenEngine.d.ts');
    });

    it('should have tokens.css export mapping (Req 6.3)', () => {
      const tokensExport = packageJson.exports['./tokens.css'];
      expect(tokensExport).toBe('./dist/browser/tokens.css');
    });
  });

  describe('Legacy Field Configuration', () => {
    it('should have browser field pointing to ESM bundle (Req 6.2)', () => {
      expect(packageJson.browser).toBe('./dist/browser/designerpunk.esm.js');
    });

    it('should have module field pointing to ESM bundle (Req 6.2)', () => {
      expect(packageJson.module).toBe('./dist/browser/designerpunk.esm.js');
    });

    it('should have main field for CommonJS fallback', () => {
      expect(packageJson.main).toBe('./dist/TokenEngine.js');
    });

    it('should have types field for TypeScript', () => {
      expect(packageJson.types).toBe('./dist/TokenEngine.d.ts');
    });
  });

  describe('Export Target File Existence', () => {
    it('should have ESM bundle at export path', () => {
      const esmPath = path.join(PROJECT_ROOT, 'dist', 'browser', 'designerpunk.esm.js');
      expect(fs.existsSync(esmPath)).toBe(true);
    });

    it('should have CommonJS entry at require path', () => {
      const cjsPath = path.join(PROJECT_ROOT, 'dist', 'TokenEngine.js');
      expect(fs.existsSync(cjsPath)).toBe(true);
    });

    it('should have tokens.css at export path', () => {
      const tokensPath = path.join(PROJECT_ROOT, 'dist', 'browser', 'tokens.css');
      expect(fs.existsSync(tokensPath)).toBe(true);
    });

    it('should have TypeScript declarations at types path', () => {
      const typesPath = path.join(PROJECT_ROOT, 'dist', 'TokenEngine.d.ts');
      expect(fs.existsSync(typesPath)).toBe(true);
    });
  });

  describe('Bundler Resolution Simulation (Req 6.4)', () => {
    /**
     * Simulates how modern bundlers resolve package imports using the exports field.
     * Modern bundlers (webpack 5+, Rollup, esbuild, Vite) use the following resolution order:
     * 1. Check exports field for matching condition (import/require)
     * 2. Fall back to browser/module/main fields
     */

    it('should resolve ESM import to browser bundle', () => {
      // When a bundler sees: import { TextInputField } from 'designer-punk-v2'
      // It should resolve to the ESM bundle via exports['.'].import

      const resolvedPath = resolvePackageExport(packageJson, '.', 'import');
      expect(resolvedPath).toBe('./dist/browser/designerpunk.esm.js');
      expect(resolvedPath).toBeDefined();

      // Verify the resolved file exists and contains ESM syntax
      const absolutePath = path.join(PROJECT_ROOT, resolvedPath!);
      expect(fs.existsSync(absolutePath)).toBe(true);

      const content = fs.readFileSync(absolutePath, 'utf-8');
      expect(content).toMatch(/export\s*\{/); // ESM export syntax
    });

    it('should resolve CommonJS require to main entry', () => {
      // When a bundler sees: const dp = require('designer-punk-v2')
      // It should resolve to CommonJS via exports['.'].require

      const resolvedPath = resolvePackageExport(packageJson, '.', 'require');
      expect(resolvedPath).toBe('./dist/TokenEngine.js');
      expect(resolvedPath).toBeDefined();

      // Verify the resolved file exists
      const absolutePath = path.join(PROJECT_ROOT, resolvedPath!);
      expect(fs.existsSync(absolutePath)).toBe(true);
    });

    it('should resolve tokens.css import correctly', () => {
      // When a bundler sees: import 'designer-punk-v2/tokens.css'
      // It should resolve via exports['./tokens.css']

      const resolvedPath = resolvePackageExport(packageJson, './tokens.css', 'import');
      expect(resolvedPath).toBe('./dist/browser/tokens.css');
      expect(resolvedPath).toBeDefined();

      // Verify the resolved file exists and contains CSS
      const absolutePath = path.join(PROJECT_ROOT, resolvedPath!);
      expect(fs.existsSync(absolutePath)).toBe(true);

      const content = fs.readFileSync(absolutePath, 'utf-8');
      expect(content).toContain(':root'); // CSS custom properties
    });

    it('should fall back to module field for legacy bundlers', () => {
      // Legacy bundlers that don't support exports field use module field for ESM
      expect(packageJson.module).toBe('./dist/browser/designerpunk.esm.js');

      const absolutePath = path.join(PROJECT_ROOT, packageJson.module);
      expect(fs.existsSync(absolutePath)).toBe(true);
    });

    it('should fall back to browser field for browser-specific bundlers', () => {
      // Some bundlers use browser field for browser-specific entry
      expect(packageJson.browser).toBe('./dist/browser/designerpunk.esm.js');

      const absolutePath = path.join(PROJECT_ROOT, packageJson.browser);
      expect(fs.existsSync(absolutePath)).toBe(true);
    });
  });

  describe('ESM Bundle Content Verification', () => {
    it('should have valid ESM module that exports components', () => {
      const esmPath = path.join(BROWSER_DIST_DIR, 'designerpunk.esm.js');
      const content = fs.readFileSync(esmPath, 'utf-8');

      // Verify ESM export syntax
      expect(content).toMatch(/export\s*\{[^}]*TextInputField[^}]*\}/);
      expect(content).toMatch(/export\s*\{[^}]*ButtonCTA[^}]*\}/);
      expect(content).toMatch(/export\s*\{[^}]*DPIcon[^}]*\}/);
      expect(content).toMatch(/export\s*\{[^}]*ContainerWeb[^}]*\}/);
    });

    it('should not have CommonJS syntax in ESM bundle', () => {
      const esmPath = path.join(BROWSER_DIST_DIR, 'designerpunk.esm.js');
      const content = fs.readFileSync(esmPath, 'utf-8');

      // ESM bundle should not have CommonJS patterns
      expect(content).not.toMatch(/module\.exports\s*=/);
      expect(content).not.toMatch(/exports\.\w+\s*=/);
    });
  });
});

/**
 * Simulates package export resolution as performed by modern bundlers.
 * This follows the Node.js package exports resolution algorithm.
 *
 * @param packageJson - The parsed package.json object
 * @param exportPath - The export path to resolve (e.g., '.', './tokens.css')
 * @param condition - The condition to use ('import' or 'require')
 * @returns The resolved path or undefined if not found
 */
function resolvePackageExport(
  packageJson: {
    exports?: Record<string, string | Record<string, string>>;
    module?: string;
    browser?: string;
    main?: string;
  },
  exportPath: string,
  condition: 'import' | 'require'
): string | undefined {
  // Check exports field first (modern resolution)
  if (packageJson.exports) {
    const exportEntry = packageJson.exports[exportPath];

    if (typeof exportEntry === 'string') {
      // Direct string export (e.g., "./tokens.css": "./dist/browser/tokens.css")
      return exportEntry;
    }

    if (typeof exportEntry === 'object' && exportEntry !== null) {
      // Conditional export (e.g., ".": { "import": "...", "require": "..." })
      return exportEntry[condition];
    }
  }

  // Fall back to legacy fields for main entry
  if (exportPath === '.') {
    if (condition === 'import') {
      return packageJson.module || packageJson.browser;
    }
    return packageJson.main;
  }

  return undefined;
}
