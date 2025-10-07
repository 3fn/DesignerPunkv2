/**
 * Web CSS Token Generation Tests
 * 
 * Tests CSS custom property generation from F1 tokens
 * Validates Requirements 3.6, 3.7
 */

import { WebBuilder } from '../platforms/WebBuilder';
import { PlatformTokens } from '../tokens/PlatformTokens';
import { BuildConfig } from '../types/BuildConfig';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('WebBuilder - CSS Token Generation', () => {
  let webBuilder: WebBuilder;
  let mockTokens: PlatformTokens;
  let testOutputDir: string;

  const createTestConfig = (): BuildConfig => ({
    platforms: ['web'],
    mode: 'development',
    outputDir: testOutputDir,
    parallel: false,
    incremental: false,
    sourceMaps: false,
    minify: false,
    validation: {
      interfaces: false,
      tokens: false,
      mathematical: false,
    },
  });

  const createMockTokens = (): PlatformTokens => ({
    platform: 'web',
    primitives: {
      spacing: {
        'space100': { value: 8, unit: 'px', token: 'space100' },
        'space150': { value: 12, unit: 'px', token: 'space150' },
        'space200': { value: 16, unit: 'px', token: 'space200' },
      },
      colors: {
        'color.blue.500': { value: '#3B82F6', unit: '', token: 'color.blue.500' },
        'color.red.500': { value: '#EF4444', unit: '', token: 'color.red.500' },
      },
      typography: {
        'fontSize100': { value: 16, unit: 'px', token: 'fontSize100' },
        'fontSize150': { value: 24, unit: 'px', token: 'fontSize150' },
      },
      radius: {
        'radius050': { value: 4, unit: 'px', token: 'radius050' },
        'radius100': { value: 8, unit: 'px', token: 'radius100' },
      },
      sizing: {
        'size100': { value: 32, unit: 'px', token: 'size100' },
        'size200': { value: 64, unit: 'px', token: 'size200' },
      },
      opacity: {},
      elevation: {},
      animation: {},
    },
    semantics: {
      spacing: {
        'space.inset.small': { value: 8, unit: 'px', token: 'space100' },
        'space.stack.normal': { value: 16, unit: 'px', token: 'space200' },
      },
      colors: {
        'color.primary': { value: '#3B82F6', unit: '', token: 'color.blue.500' },
        'color.error': { value: '#EF4444', unit: '', token: 'color.red.500' },
      },
      typography: {
        'fontSize.body': { value: 16, unit: 'px', token: 'fontSize100' },
        'fontSize.heading': { value: 24, unit: 'px', token: 'fontSize150' },
      },
      radius: {
        'radius.small': { value: 4, unit: 'px', token: 'radius050' },
        'radius.medium': { value: 8, unit: 'px', token: 'radius100' },
      },
      sizing: {
        'size.button': { value: 32, unit: 'px', token: 'size100' },
        'size.icon': { value: 64, unit: 'px', token: 'size200' },
      },
      opacity: {},
      elevation: {},
      animation: {},
    },
    components: {
      spacing: {
        'button.padding': { value: 12, unit: 'px', token: 'button.padding' },
      },
      colors: {
        'button.background': { value: '#2563EB', unit: '', token: 'button.background' },
      },
      typography: {},
      radius: {},
      sizing: {},
      opacity: {},
      elevation: {},
      animation: {},
    },
    metadata: {
      platform: 'web',
      defaultSpacingUnit: 'px',
      defaultTypographyUnit: 'px',
      supportedUnits: ['px', 'rem', 'em'],
      constraints: {
        decimalPrecision: 2,
        supportsSubpixel: true,
        roundingMode: 'round',
      },
      generatedAt: new Date(),
    },
  });

  beforeEach(() => {
    webBuilder = new WebBuilder();
    testOutputDir = path.join(__dirname, '../../__test-output__/web-css-tokens');
    mockTokens = createMockTokens();
  });

  afterEach(async () => {
    // Clean up test output
    try {
      await fs.rm(testOutputDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('Requirement 3.6: CSS Custom Properties from Tokens', () => {
    it('should generate CSS custom properties from primitive tokens with px/rem units', async () => {
      const config = createTestConfig();
      const result = await webBuilder.build([], mockTokens, config);

      expect(result.success).toBe(true);

      // Read generated CSS file
      const cssPath = path.join(testOutputDir, 'web/src/styles/tokens.css');
      const cssContent = await fs.readFile(cssPath, 'utf-8');

      // Verify primitive spacing tokens
      expect(cssContent).toContain('--space-100: 8px;');
      expect(cssContent).toContain('--space-150: 12px;');
      expect(cssContent).toContain('--space-200: 16px;');

      // Verify primitive color tokens
      expect(cssContent).toContain('--color-blue-500: #3B82F6;');
      expect(cssContent).toContain('--color-red-500: #EF4444;');

      // Verify primitive typography tokens
      expect(cssContent).toContain('--font-size-100: 16px;');
      expect(cssContent).toContain('--font-size-150: 24px;');
    });

    it('should generate CSS custom properties from semantic tokens', async () => {
      const config = createTestConfig();
      const result = await webBuilder.build([], mockTokens, config);

      expect(result.success).toBe(true);

      // Read generated CSS file
      const cssPath = path.join(testOutputDir, 'web/src/styles/tokens.css');
      const cssContent = await fs.readFile(cssPath, 'utf-8');

      // Verify semantic spacing tokens with references
      expect(cssContent).toContain('--space-inset-small: 8px;');
      expect(cssContent).toContain('references: space100');
      expect(cssContent).toContain('--space-stack-normal: 16px;');
      expect(cssContent).toContain('references: space200');

      // Verify semantic color tokens with references
      expect(cssContent).toContain('--color-primary: #3B82F6;');
      expect(cssContent).toContain('references: color.blue.500');
    });

    it('should generate CSS custom properties from component tokens when needed', async () => {
      const config = createTestConfig();
      const result = await webBuilder.build([], mockTokens, config);

      expect(result.success).toBe(true);

      // Read generated CSS file
      const cssPath = path.join(testOutputDir, 'web/src/styles/tokens.css');
      const cssContent = await fs.readFile(cssPath, 'utf-8');

      // Verify component tokens section exists
      expect(cssContent).toContain('/* Component Tokens */');
      expect(cssContent).toContain('Generated when semantic and primitive tokens are insufficient');

      // Verify component spacing token
      expect(cssContent).toContain('--button-padding: 12px;');

      // Verify component color token
      expect(cssContent).toContain('--button-background: #2563EB;');
    });
  });

  describe('Requirement 3.7: CSS Custom Property Syntax Validation', () => {
    it('should generate valid CSS custom property syntax', async () => {
      const config = createTestConfig();
      const result = await webBuilder.build([], mockTokens, config);

      expect(result.success).toBe(true);

      // Read generated CSS file
      const cssPath = path.join(testOutputDir, 'web/src/styles/tokens.css');
      const cssContent = await fs.readFile(cssPath, 'utf-8');

      // Validate CSS structure
      expect(cssContent).toContain(':root {');
      expect(cssContent).toMatch(/}\s*$/); // Ends with closing brace

      // Validate custom property naming (must start with --)
      const customPropertyRegex = /--[a-z0-9-]+:/g;
      const matches = cssContent.match(customPropertyRegex);
      expect(matches).toBeTruthy();
      expect(matches!.length).toBeGreaterThan(0);

      // Validate no uppercase letters in variable names
      const uppercaseRegex = /--[^:]*[A-Z]/;
      expect(cssContent).not.toMatch(uppercaseRegex);
    });

    it('should properly convert token names to CSS variable names', async () => {
      const config = createTestConfig();
      const result = await webBuilder.build([], mockTokens, config);

      expect(result.success).toBe(true);

      // Read generated CSS file
      const cssPath = path.join(testOutputDir, 'web/src/styles/tokens.css');
      const cssContent = await fs.readFile(cssPath, 'utf-8');

      // Verify camelCase converted to kebab-case
      expect(cssContent).toContain('--font-size-100'); // fontSize100 -> font-size-100

      // Verify dot notation converted to kebab-case
      expect(cssContent).toContain('--color-blue-500'); // color.blue.500 -> color-blue-500
      expect(cssContent).toContain('--space-inset-small'); // space.inset.small -> space-inset-small
    });

    it('should include proper documentation comments', async () => {
      const config = createTestConfig();
      const result = await webBuilder.build([], mockTokens, config);

      expect(result.success).toBe(true);

      // Read generated CSS file
      const cssPath = path.join(testOutputDir, 'web/src/styles/tokens.css');
      const cssContent = await fs.readFile(cssPath, 'utf-8');

      // Verify file header
      expect(cssContent).toContain('tokens.css');
      expect(cssContent).toContain('DesignerPunk Design System');
      expect(cssContent).toContain('Auto-generated CSS custom properties for Web');
      expect(cssContent).toContain('DO NOT EDIT - Generated from F1 Mathematical Token System');

      // Verify section comments
      expect(cssContent).toContain('/* Primitive Tokens */');
      expect(cssContent).toContain('/* Semantic Tokens */');

      // Verify category comments
      expect(cssContent).toContain('/* Primitive spacing tokens (px/rem units) */');
      expect(cssContent).toContain('/* Primitive color tokens */');
    });
  });
});
