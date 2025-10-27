/**
 * Mode Theme Resolver
 *
 * Core resolution logic for handling colorToken[systemMode][userTheme] pattern.
 * Resolves color tokens based on system mode (light/dark) and user theme preference (base/wcag).
 *
 * Resolution Pattern: colorToken[systemMode][userTheme]
 * - systemMode: 'light' | 'dark' (detected from system preferences)
 * - userTheme: 'base' | 'wcag' (user preference, defaults to 'base')
 */
import { ColorTokenValue } from '../types/PrimitiveToken';
/**
 * System mode options
 */
export type SystemMode = 'light' | 'dark';
/**
 * User theme options
 */
export type UserTheme = 'base' | 'wcag';
/**
 * Resolution result containing resolved color and metadata
 */
export interface ColorResolutionResult {
    /** Resolved hex color value */
    color: string;
    /** System mode used for resolution */
    mode: SystemMode;
    /** User theme used for resolution */
    theme: UserTheme;
    /** Whether default theme was used */
    usedDefaultTheme: boolean;
}
/**
 * ModeThemeResolver handles resolution of mode-aware color tokens
 */
export declare class ModeThemeResolver {
    private defaultTheme;
    /**
     * Resolve color token value based on system mode and user theme
     *
     * @param colorValue - Color token value with mode/theme structure
     * @param systemMode - System mode (light/dark), defaults to 'light'
     * @param userTheme - User theme preference (base/wcag), defaults to 'base'
     * @returns Resolved color resolution result
     */
    resolve(colorValue: ColorTokenValue, systemMode?: SystemMode, userTheme?: UserTheme): ColorResolutionResult;
    /**
     * Get default theme
     */
    getDefaultTheme(): UserTheme;
    /**
     * Set default theme
     *
     * @param theme - Theme to set as default
     */
    setDefaultTheme(theme: UserTheme): void;
    /**
     * Resolve all mode/theme combinations for a color token
     * Useful for generating platform-specific outputs that need all variants
     *
     * @param colorValue - Color token value with mode/theme structure
     * @returns Object containing all mode/theme combinations
     */
    resolveAll(colorValue: ColorTokenValue): {
        light: {
            base: string;
            wcag: string;
        };
        dark: {
            base: string;
            wcag: string;
        };
    };
    /**
     * Validate color token value structure
     *
     * @param colorValue - Color token value to validate
     * @returns True if valid, false otherwise
     */
    validate(colorValue: ColorTokenValue): boolean;
}
//# sourceMappingURL=ModeThemeResolver.d.ts.map