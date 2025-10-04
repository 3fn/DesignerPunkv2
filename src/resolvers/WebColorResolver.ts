/**
 * Web Color Resolver
 * 
 * Generates CSS custom properties with automatic mode detection via @media queries.
 * Supports prefers-color-scheme for native light/dark mode detection and theme switching.
 * 
 * Output Format:
 * - CSS custom properties with --token-name naming convention
 * - @media (prefers-color-scheme: dark) for automatic mode detection
 * - Theme switching via data-theme attribute on :root
 */

import { ColorTokenValue } from '../types/PrimitiveToken';
import { ModeThemeResolver, SystemMode, UserTheme } from './ModeThemeResolver';

/**
 * CSS output options
 */
export interface CSSOutputOptions {
  /** Include @media queries for automatic mode detection */
  includeMediaQueries?: boolean;
  /** Include theme switching via data-theme attribute */
  includeThemeSwitching?: boolean;
  /** CSS variable prefix (default: '--') */
  prefix?: string;
  /** Default theme to use */
  defaultTheme?: UserTheme;
}

/**
 * WebColorResolver generates CSS custom properties for web platform
 */
export class WebColorResolver {
  private resolver: ModeThemeResolver;

  constructor() {
    this.resolver = new ModeThemeResolver();
  }

  /**
   * Generate CSS custom property for a single color token
   * 
   * @param tokenName - Name of the color token (e.g., 'purple300')
   * @param colorValue - Color token value with mode/theme structure
   * @param options - CSS output options
   * @returns CSS custom property declaration
   */
  generateCSSVariable(
    tokenName: string,
    colorValue: ColorTokenValue,
    options: CSSOutputOptions = {}
  ): string {
    const {
      includeMediaQueries = true,
      includeThemeSwitching = true,
      prefix = '--',
      defaultTheme = 'base'
    } = options;

    const varName = `${prefix}${tokenName}`;
    const allValues = this.resolver.resolveAll(colorValue);

    let css = '';

    // Base light mode with default theme
    css += `:root {\n`;
    css += `  ${varName}: ${allValues.light[defaultTheme]};\n`;
    css += `}\n\n`;

    // Theme switching via data-theme attribute
    if (includeThemeSwitching) {
      css += `:root[data-theme="wcag"] {\n`;
      css += `  ${varName}: ${allValues.light.wcag};\n`;
      css += `}\n\n`;
    }

    // Dark mode with @media query
    if (includeMediaQueries) {
      css += `@media (prefers-color-scheme: dark) {\n`;
      css += `  :root {\n`;
      css += `    ${varName}: ${allValues.dark[defaultTheme]};\n`;
      css += `  }\n`;

      if (includeThemeSwitching) {
        css += `\n`;
        css += `  :root[data-theme="wcag"] {\n`;
        css += `    ${varName}: ${allValues.dark.wcag};\n`;
        css += `  }\n`;
      }

      css += `}\n`;
    }

    return css;
  }

  /**
   * Generate CSS custom properties for multiple color tokens
   * 
   * @param tokens - Object mapping token names to color values
   * @param options - CSS output options
   * @returns Complete CSS stylesheet with all color tokens
   */
  generateStylesheet(
    tokens: Record<string, ColorTokenValue>,
    options: CSSOutputOptions = {}
  ): string {
    const {
      includeMediaQueries = true,
      includeThemeSwitching = true,
      prefix = '--',
      defaultTheme = 'base'
    } = options;

    let css = '/**\n';
    css += ' * Design System Color Tokens\n';
    css += ' * Generated with mode-aware and theme-aware support\n';
    css += ' */\n\n';

    // Collect all light mode base theme values
    const lightBaseValues: Record<string, string> = {};
    const lightWcagValues: Record<string, string> = {};
    const darkBaseValues: Record<string, string> = {};
    const darkWcagValues: Record<string, string> = {};

    Object.entries(tokens).forEach(([tokenName, colorValue]) => {
      const allValues = this.resolver.resolveAll(colorValue);
      const varName = `${prefix}${tokenName}`;

      lightBaseValues[varName] = allValues.light.base;
      lightWcagValues[varName] = allValues.light.wcag;
      darkBaseValues[varName] = allValues.dark.base;
      darkWcagValues[varName] = allValues.dark.wcag;
    });

    // Light mode with default theme
    css += `:root {\n`;
    Object.entries(lightBaseValues).forEach(([varName, value]) => {
      css += `  ${varName}: ${value};\n`;
    });
    css += `}\n\n`;

    // Theme switching for light mode
    if (includeThemeSwitching) {
      css += `:root[data-theme="wcag"] {\n`;
      Object.entries(lightWcagValues).forEach(([varName, value]) => {
        css += `  ${varName}: ${value};\n`;
      });
      css += `}\n\n`;
    }

    // Dark mode with @media query
    if (includeMediaQueries) {
      css += `@media (prefers-color-scheme: dark) {\n`;
      css += `  :root {\n`;
      Object.entries(darkBaseValues).forEach(([varName, value]) => {
        css += `    ${varName}: ${value};\n`;
      });
      css += `  }\n`;

      if (includeThemeSwitching) {
        css += `\n`;
        css += `  :root[data-theme="wcag"] {\n`;
        Object.entries(darkWcagValues).forEach(([varName, value]) => {
          css += `    ${varName}: ${value};\n`;
        });
        css += `  }\n`;
      }

      css += `}\n`;
    }

    return css;
  }

  /**
   * Generate JavaScript module exporting color tokens
   * Useful for runtime color resolution in JavaScript
   * 
   * @param tokens - Object mapping token names to color values
   * @returns JavaScript module code
   */
  generateJavaScriptModule(tokens: Record<string, ColorTokenValue>): string {
    let js = '/**\n';
    js += ' * Design System Color Tokens\n';
    js += ' * Mode-aware and theme-aware color token exports\n';
    js += ' */\n\n';

    js += 'export const colorTokens = {\n';

    Object.entries(tokens).forEach(([tokenName, colorValue], index, array) => {
      const allValues = this.resolver.resolveAll(colorValue);
      js += `  ${tokenName}: {\n`;
      js += `    light: {\n`;
      js += `      base: '${allValues.light.base}',\n`;
      js += `      wcag: '${allValues.light.wcag}'\n`;
      js += `    },\n`;
      js += `    dark: {\n`;
      js += `      base: '${allValues.dark.base}',\n`;
      js += `      wcag: '${allValues.dark.wcag}'\n`;
      js += `    }\n`;
      js += `  }${index < array.length - 1 ? ',' : ''}\n`;
    });

    js += '};\n\n';

    js += '/**\n';
    js += ' * Resolve color token based on system mode and user theme\n';
    js += ' * @param {string} tokenName - Name of the color token\n';
    js += ' * @param {\'light\'|\'dark\'} mode - System mode\n';
    js += ' * @param {\'base\'|\'wcag\'} theme - User theme preference (defaults to \'base\')\n';
    js += ' * @returns {string} Resolved hex color value\n';
    js += ' */\n';
    js += 'export function resolveColor(tokenName, mode = \'light\', theme = \'base\') {\n';
    js += '  const token = colorTokens[tokenName];\n';
    js += '  if (!token) {\n';
    js += '    throw new Error(`Color token "${tokenName}" not found`);\n';
    js += '  }\n';
    js += '  return token[mode][theme];\n';
    js += '}\n\n';

    js += '/**\n';
    js += ' * Detect system color scheme preference\n';
    js += ' * @returns {\'light\'|\'dark\'} Detected system mode\n';
    js += ' */\n';
    js += 'export function detectSystemMode() {\n';
    js += '  if (typeof window === \'undefined\') return \'light\';\n';
    js += '  return window.matchMedia(\'(prefers-color-scheme: dark)\').matches ? \'dark\' : \'light\';\n';
    js += '}\n';

    return js;
  }

  /**
   * Get resolver instance for direct color resolution
   */
  getResolver(): ModeThemeResolver {
    return this.resolver;
  }
}
