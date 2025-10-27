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
import { ModeThemeResolver, UserTheme } from './ModeThemeResolver';
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
export declare class WebColorResolver {
    private resolver;
    constructor();
    /**
     * Generate CSS custom property for a single color token
     *
     * @param tokenName - Name of the color token (e.g., 'purple300')
     * @param colorValue - Color token value with mode/theme structure
     * @param options - CSS output options
     * @returns CSS custom property declaration
     */
    generateCSSVariable(tokenName: string, colorValue: ColorTokenValue, options?: CSSOutputOptions): string;
    /**
     * Generate CSS custom properties for multiple color tokens
     *
     * @param tokens - Object mapping token names to color values
     * @param options - CSS output options
     * @returns Complete CSS stylesheet with all color tokens
     */
    generateStylesheet(tokens: Record<string, ColorTokenValue>, options?: CSSOutputOptions): string;
    /**
     * Generate JavaScript module exporting color tokens
     * Useful for runtime color resolution in JavaScript
     *
     * @param tokens - Object mapping token names to color values
     * @returns JavaScript module code
     */
    generateJavaScriptModule(tokens: Record<string, ColorTokenValue>): string;
    /**
     * Get resolver instance for direct color resolution
     */
    getResolver(): ModeThemeResolver;
}
//# sourceMappingURL=WebColorResolver.d.ts.map