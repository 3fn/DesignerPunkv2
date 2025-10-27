/**
 * Android Color Resolver
 *
 * Generates resource qualifiers (values/values-night) with configuration detection.
 * Supports native Android light/dark mode via resource qualifiers and theme switching.
 *
 * Output Format:
 * - XML color resources in values/ and values-night/ directories
 * - Automatic mode detection via Android configuration
 * - Theme switching via custom theme attributes
 */
import { ColorTokenValue } from '../types/PrimitiveToken';
import { ModeThemeResolver, UserTheme } from './ModeThemeResolver';
/**
 * Android XML output options
 */
export interface AndroidOutputOptions {
    /** Include theme switching support */
    includeThemeSwitching?: boolean;
    /** Default theme to use */
    defaultTheme?: UserTheme;
    /** Resource file name (default: 'design_system_colors') */
    resourceFileName?: string;
}
/**
 * AndroidColorResolver generates XML color resources for Android platform
 */
export declare class AndroidColorResolver {
    private resolver;
    constructor();
    /**
     * Convert hex color to Android color resource format
     * Android uses #AARRGGBB or #RRGGBB format
     *
     * @param hex - Hex color string (e.g., '#FF6B35')
     * @returns Android color resource value
     */
    private hexToAndroidColor;
    /**
     * Generate XML color resource for a single color token
     *
     * @param tokenName - Name of the color token (e.g., 'purple300')
     * @param colorValue - Hex color value
     * @returns XML color resource line
     */
    private generateColorResource;
    /**
     * Generate values/colors.xml for light mode
     *
     * @param tokens - Object mapping token names to color values
     * @param options - Android output options
     * @returns XML content for values/colors.xml
     */
    generateLightModeColors(tokens: Record<string, ColorTokenValue>, options?: AndroidOutputOptions): string;
    /**
     * Generate values-night/colors.xml for dark mode
     *
     * @param tokens - Object mapping token names to color values
     * @param options - Android output options
     * @returns XML content for values-night/colors.xml
     */
    generateDarkModeColors(tokens: Record<string, ColorTokenValue>, options?: AndroidOutputOptions): string;
    /**
     * Generate WCAG theme colors for light mode
     *
     * @param tokens - Object mapping token names to color values
     * @returns XML content for values/colors_wcag.xml
     */
    generateLightModeWcagColors(tokens: Record<string, ColorTokenValue>): string;
    /**
     * Generate WCAG theme colors for dark mode
     *
     * @param tokens - Object mapping token names to color values
     * @returns XML content for values-night/colors_wcag.xml
     */
    generateDarkModeWcagColors(tokens: Record<string, ColorTokenValue>): string;
    /**
     * Generate Kotlin extension functions for color access
     *
     * @param tokens - Object mapping token names to color values
     * @param options - Android output options
     * @returns Kotlin extension code
     */
    generateKotlinExtension(tokens: Record<string, ColorTokenValue>, options?: AndroidOutputOptions): string;
    /**
     * Generate complete Android resource structure
     * Returns object with all necessary files
     *
     * @param tokens - Object mapping token names to color values
     * @param options - Android output options
     * @returns Object containing all Android resource files
     */
    generateAndroidResources(tokens: Record<string, ColorTokenValue>, options?: AndroidOutputOptions): {
        'values/colors.xml': string;
        'values-night/colors.xml': string;
        'values/colors_wcag.xml'?: string;
        'values-night/colors_wcag.xml'?: string;
        'kotlin/DesignSystemColors.kt': string;
    };
    /**
     * Generate usage example documentation
     *
     * @returns Kotlin usage example code
     */
    generateUsageExample(): string;
    /**
     * Get resolver instance for direct color resolution
     */
    getResolver(): ModeThemeResolver;
}
//# sourceMappingURL=AndroidColorResolver.d.ts.map