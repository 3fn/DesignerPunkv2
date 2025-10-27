"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModeThemeResolver = void 0;
/**
 * ModeThemeResolver handles resolution of mode-aware color tokens
 */
class ModeThemeResolver {
    constructor() {
        this.defaultTheme = 'base';
    }
    /**
     * Resolve color token value based on system mode and user theme
     *
     * @param colorValue - Color token value with mode/theme structure
     * @param systemMode - System mode (light/dark), defaults to 'light'
     * @param userTheme - User theme preference (base/wcag), defaults to 'base'
     * @returns Resolved color resolution result
     */
    resolve(colorValue, systemMode = 'light', userTheme) {
        // Use default theme if not specified
        const resolvedTheme = userTheme ?? this.defaultTheme;
        const usedDefaultTheme = userTheme === undefined;
        // Resolve: colorToken[systemMode][userTheme]
        const modeValues = colorValue[systemMode];
        const resolvedColor = modeValues[resolvedTheme];
        return {
            color: resolvedColor,
            mode: systemMode,
            theme: resolvedTheme,
            usedDefaultTheme
        };
    }
    /**
     * Get default theme
     */
    getDefaultTheme() {
        return this.defaultTheme;
    }
    /**
     * Set default theme
     *
     * @param theme - Theme to set as default
     */
    setDefaultTheme(theme) {
        this.defaultTheme = theme;
    }
    /**
     * Resolve all mode/theme combinations for a color token
     * Useful for generating platform-specific outputs that need all variants
     *
     * @param colorValue - Color token value with mode/theme structure
     * @returns Object containing all mode/theme combinations
     */
    resolveAll(colorValue) {
        return {
            light: {
                base: colorValue.light.base,
                wcag: colorValue.light.wcag
            },
            dark: {
                base: colorValue.dark.base,
                wcag: colorValue.dark.wcag
            }
        };
    }
    /**
     * Validate color token value structure
     *
     * @param colorValue - Color token value to validate
     * @returns True if valid, false otherwise
     */
    validate(colorValue) {
        try {
            // Check light mode exists
            if (!colorValue.light || typeof colorValue.light !== 'object') {
                return false;
            }
            // Check dark mode exists
            if (!colorValue.dark || typeof colorValue.dark !== 'object') {
                return false;
            }
            // Check light mode themes
            if (typeof colorValue.light.base !== 'string' || typeof colorValue.light.wcag !== 'string') {
                return false;
            }
            // Check dark mode themes
            if (typeof colorValue.dark.base !== 'string' || typeof colorValue.dark.wcag !== 'string') {
                return false;
            }
            // Validate hex color format (basic check)
            const hexPattern = /^#[0-9A-Fa-f]{6}$/;
            return (hexPattern.test(colorValue.light.base) &&
                hexPattern.test(colorValue.light.wcag) &&
                hexPattern.test(colorValue.dark.base) &&
                hexPattern.test(colorValue.dark.wcag));
        }
        catch {
            return false;
        }
    }
}
exports.ModeThemeResolver = ModeThemeResolver;
//# sourceMappingURL=ModeThemeResolver.js.map