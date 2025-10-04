/**
 * WebColorResolver Unit Tests
 * 
 * Tests for Web CSS custom property generation and media query handling.
 * Covers CSS variable generation, @media queries, theme switching, and JavaScript module generation.
 */

import { WebColorResolver, CSSOutputOptions } from '../WebColorResolver';
import { ColorTokenValue } from '../../types/PrimitiveToken';

// Mock color token factory for testing
const createMockColorToken = (): ColorTokenValue => ({
  light: {
    base: '#8B5CF6',
    wcag: '#7C3AED'
  },
  dark: {
    base: '#A78BFA',
    wcag: '#C4B5FD'
  }
});

const createMultipleColorTokens = (): Record<string, ColorTokenValue> => ({
  purple300: {
    light: { base: '#8B5CF6', wcag: '#7C3AED' },
    dark: { base: '#A78BFA', wcag: '#C4B5FD' }
  },
  orange300: {
    light: { base: '#FF6B35', wcag: '#E65A2A' },
    dark: { base: '#FFB8A0', wcag: '#FFA380' }
  },
  cyan300: {
    light: { base: '#06B6D4', wcag: '#0891B2' },
    dark: { base: '#67E8F9', wcag: '#A5F3FC' }
  }
});

describe('WebColorResolver', () => {
  let resolver: WebColorResolver;

  beforeEach(() => {
    resolver = new WebColorResolver();
  });

  describe('CSS Variable Generation', () => {
    test('should generate CSS variable with default options', () => {
      const colorToken = createMockColorToken();
      const css = resolver.generateCSSVariable('purple300', colorToken);

      expect(css).toContain(':root {');
      expect(css).toContain('--purple300: #8B5CF6;');
      expect(css).toContain('@media (prefers-color-scheme: dark)');
      expect(css).toContain('[data-theme="wcag"]');
    });

    test('should generate CSS variable with custom prefix', () => {
      const colorToken = createMockColorToken();
      const css = resolver.generateCSSVariable('purple300', colorToken, { prefix: '--ds-' });

      expect(css).toContain('--ds-purple300: #8B5CF6;');
    });

    test('should generate CSS variable without media queries', () => {
      const colorToken = createMockColorToken();
      const css = resolver.generateCSSVariable('purple300', colorToken, { includeMediaQueries: false });

      expect(css).toContain('--purple300: #8B5CF6;');
      expect(css).not.toContain('@media (prefers-color-scheme: dark)');
    });

    test('should generate CSS variable without theme switching', () => {
      const colorToken = createMockColorToken();
      const css = resolver.generateCSSVariable('purple300', colorToken, { includeThemeSwitching: false });

      expect(css).toContain('--purple300: #8B5CF6;');
      expect(css).not.toContain('[data-theme="wcag"]');
    });

    test('should generate CSS variable with wcag as default theme', () => {
      const colorToken = createMockColorToken();
      const css = resolver.generateCSSVariable('purple300', colorToken, { defaultTheme: 'wcag' });

      expect(css).toContain('--purple300: #7C3AED;'); // WCAG light mode value
    });
  });

  describe('Media Query Handling', () => {
    test('should include prefers-color-scheme media query', () => {
      const colorToken = createMockColorToken();
      const css = resolver.generateCSSVariable('purple300', colorToken);

      expect(css).toContain('@media (prefers-color-scheme: dark)');
      expect(css).toContain('--purple300: #A78BFA;'); // Dark mode base value
    });

    test('should include dark mode theme switching in media query', () => {
      const colorToken = createMockColorToken();
      const css = resolver.generateCSSVariable('purple300', colorToken);

      expect(css).toContain('@media (prefers-color-scheme: dark)');
      expect(css).toContain(':root[data-theme="wcag"]');
      expect(css).toContain('--purple300: #C4B5FD;'); // Dark mode WCAG value
    });

    test('should not include media query when disabled', () => {
      const colorToken = createMockColorToken();
      const css = resolver.generateCSSVariable('purple300', colorToken, { includeMediaQueries: false });

      expect(css).not.toContain('@media');
      expect(css).not.toContain('prefers-color-scheme');
    });
  });

  describe('Theme Switching Support', () => {
    test('should include data-theme attribute for light mode', () => {
      const colorToken = createMockColorToken();
      const css = resolver.generateCSSVariable('purple300', colorToken);

      expect(css).toContain(':root[data-theme="wcag"]');
      expect(css).toContain('--purple300: #7C3AED;'); // Light mode WCAG value
    });

    test('should include data-theme attribute for dark mode', () => {
      const colorToken = createMockColorToken();
      const css = resolver.generateCSSVariable('purple300', colorToken);

      expect(css).toContain('@media (prefers-color-scheme: dark)');
      expect(css).toContain(':root[data-theme="wcag"]');
      expect(css).toContain('--purple300: #C4B5FD;'); // Dark mode WCAG value
    });

    test('should not include theme switching when disabled', () => {
      const colorToken = createMockColorToken();
      const css = resolver.generateCSSVariable('purple300', colorToken, { includeThemeSwitching: false });

      expect(css).not.toContain('[data-theme="wcag"]');
      expect(css).not.toContain('#7C3AED'); // WCAG values should not appear
      expect(css).not.toContain('#C4B5FD');
    });
  });

  describe('Complete Stylesheet Generation', () => {
    test('should generate stylesheet with multiple tokens', () => {
      const tokens = createMultipleColorTokens();
      const css = resolver.generateStylesheet(tokens);

      expect(css).toContain('Design System Color Tokens');
      expect(css).toContain('--purple300: #8B5CF6;');
      expect(css).toContain('--orange300: #FF6B35;');
      expect(css).toContain('--cyan300: #06B6D4;');
    });

    test('should generate stylesheet with all mode/theme combinations', () => {
      const tokens = createMultipleColorTokens();
      const css = resolver.generateStylesheet(tokens);

      // Light mode base (default)
      expect(css).toContain('--purple300: #8B5CF6;');
      
      // Light mode WCAG
      expect(css).toContain(':root[data-theme="wcag"]');
      expect(css).toContain('--purple300: #7C3AED;');
      
      // Dark mode base
      expect(css).toContain('@media (prefers-color-scheme: dark)');
      expect(css).toContain('--purple300: #A78BFA;');
      
      // Dark mode WCAG
      expect(css).toContain('--purple300: #C4B5FD;');
    });

    test('should generate stylesheet with custom options', () => {
      const tokens = createMultipleColorTokens();
      const css = resolver.generateStylesheet(tokens, {
        prefix: '--ds-',
        defaultTheme: 'wcag',
        includeMediaQueries: true,
        includeThemeSwitching: true
      });

      expect(css).toContain('--ds-purple300: #7C3AED;'); // WCAG as default
      expect(css).toContain('--ds-orange300: #E65A2A;');
      expect(css).toContain('--ds-cyan300: #0891B2;');
    });

    test('should generate stylesheet without media queries', () => {
      const tokens = createMultipleColorTokens();
      const css = resolver.generateStylesheet(tokens, { includeMediaQueries: false });

      expect(css).not.toContain('@media');
      expect(css).toContain('--purple300: #8B5CF6;'); // Only light mode values
    });

    test('should generate stylesheet without theme switching', () => {
      const tokens = createMultipleColorTokens();
      const css = resolver.generateStylesheet(tokens, { includeThemeSwitching: false });

      expect(css).not.toContain('[data-theme="wcag"]');
      expect(css).toContain('--purple300: #8B5CF6;'); // Only base theme values
    });
  });

  describe('JavaScript Module Generation', () => {
    test('should generate JavaScript module with color tokens', () => {
      const tokens = createMultipleColorTokens();
      const js = resolver.generateJavaScriptModule(tokens);

      expect(js).toContain('export const colorTokens');
      expect(js).toContain('purple300:');
      expect(js).toContain('orange300:');
      expect(js).toContain('cyan300:');
    });

    test('should generate JavaScript module with mode/theme structure', () => {
      const tokens = createMultipleColorTokens();
      const js = resolver.generateJavaScriptModule(tokens);

      expect(js).toContain('light: {');
      expect(js).toContain('dark: {');
      expect(js).toContain("base: '#8B5CF6'");
      expect(js).toContain("wcag: '#7C3AED'");
    });

    test('should generate resolveColor helper function', () => {
      const tokens = createMultipleColorTokens();
      const js = resolver.generateJavaScriptModule(tokens);

      expect(js).toContain('export function resolveColor');
      expect(js).toContain('tokenName, mode = \'light\', theme = \'base\'');
      expect(js).toContain('return token[mode][theme]');
    });

    test('should generate detectSystemMode helper function', () => {
      const tokens = createMultipleColorTokens();
      const js = resolver.generateJavaScriptModule(tokens);

      expect(js).toContain('export function detectSystemMode');
      expect(js).toContain('window.matchMedia');
      expect(js).toContain('prefers-color-scheme: dark');
    });

    test('should include error handling in resolveColor', () => {
      const tokens = createMultipleColorTokens();
      const js = resolver.generateJavaScriptModule(tokens);

      expect(js).toContain('if (!token)');
      expect(js).toContain('throw new Error');
      expect(js).toContain('Color token');
      expect(js).toContain('not found');
    });

    test('should handle server-side rendering in detectSystemMode', () => {
      const tokens = createMultipleColorTokens();
      const js = resolver.generateJavaScriptModule(tokens);

      expect(js).toContain('if (typeof window === \'undefined\')');
      expect(js).toContain('return \'light\'');
    });
  });

  describe('CSS Output Structure', () => {
    test('should generate valid CSS syntax', () => {
      const colorToken = createMockColorToken();
      const css = resolver.generateCSSVariable('purple300', colorToken);

      // Check for proper CSS structure
      expect(css).toMatch(/:root\s*\{/);
      expect(css).toMatch(/--purple300:\s*#[0-9A-Fa-f]{6};/);
      expect(css).toMatch(/\}/);
    });

    test('should generate properly nested media queries', () => {
      const colorToken = createMockColorToken();
      const css = resolver.generateCSSVariable('purple300', colorToken);

      // Check for proper nesting
      expect(css).toMatch(/@media \(prefers-color-scheme: dark\)\s*\{/);
      expect(css).toContain('@media (prefers-color-scheme: dark)');
      expect(css).toContain(':root {');
      expect(css).toContain(':root[data-theme="wcag"]');
    });

    test('should include proper documentation comments', () => {
      const tokens = createMultipleColorTokens();
      const css = resolver.generateStylesheet(tokens);

      expect(css).toContain('/**');
      expect(css).toContain('Design System Color Tokens');
      expect(css).toContain('Generated with mode-aware and theme-aware support');
      expect(css).toContain('*/');
    });
  });

  describe('Integration with ModeThemeResolver', () => {
    test('should use ModeThemeResolver for color resolution', () => {
      const colorToken = createMockColorToken();
      const modeThemeResolver = resolver.getResolver();

      const result = modeThemeResolver.resolve(colorToken, 'light', 'base');
      expect(result.color).toBe('#8B5CF6');
    });

    test('should resolve all mode/theme combinations correctly', () => {
      const colorToken = createMockColorToken();
      const modeThemeResolver = resolver.getResolver();

      const allValues = modeThemeResolver.resolveAll(colorToken);
      
      expect(allValues.light.base).toBe('#8B5CF6');
      expect(allValues.light.wcag).toBe('#7C3AED');
      expect(allValues.dark.base).toBe('#A78BFA');
      expect(allValues.dark.wcag).toBe('#C4B5FD');
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty token object', () => {
      const css = resolver.generateStylesheet({});

      expect(css).toContain('Design System Color Tokens');
      expect(css).toContain(':root {');
      expect(css).toContain('}');
    });

    test('should handle single token', () => {
      const tokens = { purple300: createMockColorToken() };
      const css = resolver.generateStylesheet(tokens);

      expect(css).toContain('--purple300: #8B5CF6;');
      expect(css).toContain('@media (prefers-color-scheme: dark)');
    });

    test('should handle token names with numbers', () => {
      const tokens = { color100: createMockColorToken() };
      const css = resolver.generateStylesheet(tokens);

      expect(css).toContain('--color100: #8B5CF6;');
    });

    test('should handle token names with hyphens', () => {
      const tokens = { 'primary-color': createMockColorToken() };
      const css = resolver.generateStylesheet(tokens);

      expect(css).toContain('--primary-color: #8B5CF6;');
    });

    test('should handle uppercase hex values', () => {
      const colorToken: ColorTokenValue = {
        light: { base: '#8B5CF6', wcag: '#7C3AED' },
        dark: { base: '#A78BFA', wcag: '#C4B5FD' }
      };
      const css = resolver.generateCSSVariable('purple300', colorToken);

      expect(css).toContain('#8B5CF6');
      expect(css).toContain('#7C3AED');
    });

    test('should handle lowercase hex values', () => {
      const colorToken: ColorTokenValue = {
        light: { base: '#8b5cf6', wcag: '#7c3aed' },
        dark: { base: '#a78bfa', wcag: '#c4b5fd' }
      };
      const css = resolver.generateCSSVariable('purple300', colorToken);

      expect(css).toContain('#8b5cf6');
      expect(css).toContain('#7c3aed');
    });
  });

  describe('Custom Configuration', () => {
    test('should support all configuration options together', () => {
      const colorToken = createMockColorToken();
      const options: CSSOutputOptions = {
        includeMediaQueries: true,
        includeThemeSwitching: true,
        prefix: '--custom-',
        defaultTheme: 'wcag'
      };

      const css = resolver.generateCSSVariable('purple300', colorToken, options);

      expect(css).toContain('--custom-purple300: #7C3AED'); // WCAG as default
      expect(css).toContain('@media (prefers-color-scheme: dark)');
      expect(css).toContain('[data-theme="wcag"]');
    });

    test('should support minimal configuration', () => {
      const colorToken = createMockColorToken();
      const options: CSSOutputOptions = {
        includeMediaQueries: false,
        includeThemeSwitching: false
      };

      const css = resolver.generateCSSVariable('purple300', colorToken, options);

      expect(css).toContain('--purple300: #8B5CF6');
      expect(css).not.toContain('@media');
      expect(css).not.toContain('[data-theme');
    });
  });
});
