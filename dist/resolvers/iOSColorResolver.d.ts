/**
 * iOS Color Resolver
 *
 * Generates UIColor.dynamicColor implementations with trait collection detection.
 * Supports native iOS light/dark mode via UITraitCollection and theme switching.
 *
 * Output Format:
 * - Swift UIColor extensions with dynamicColor
 * - Trait collection detection for automatic mode switching
 * - Theme switching via custom trait or user defaults
 */
import { ColorTokenValue } from '../types/PrimitiveToken';
import { ModeThemeResolver, UserTheme } from './ModeThemeResolver';
/**
 * Swift output options
 */
export interface SwiftOutputOptions {
    /** Include theme switching support */
    includeThemeSwitching?: boolean;
    /** Default theme to use */
    defaultTheme?: UserTheme;
    /** Extension name (default: 'DesignSystemColors') */
    extensionName?: string;
}
/**
 * iOSColorResolver generates Swift UIColor code for iOS platform
 */
export declare class iOSColorResolver {
    private resolver;
    constructor();
    /**
     * Convert hex color to Swift UIColor initialization
     *
     * @param hex - Hex color string (e.g., '#FF6B35')
     * @returns Swift UIColor initialization code
     */
    private hexToUIColor;
    /**
     * Generate Swift UIColor.dynamicColor for a single color token
     *
     * @param tokenName - Name of the color token (e.g., 'purple300')
     * @param colorValue - Color token value with mode/theme structure
     * @param options - Swift output options
     * @returns Swift UIColor.dynamicColor code
     */
    generateDynamicColor(tokenName: string, colorValue: ColorTokenValue, options?: SwiftOutputOptions): string;
    /**
     * Generate complete Swift extension with all color tokens
     *
     * @param tokens - Object mapping token names to color values
     * @param options - Swift output options
     * @returns Complete Swift extension code
     */
    generateSwiftExtension(tokens: Record<string, ColorTokenValue>, options?: SwiftOutputOptions): string;
    /**
     * Generate usage example documentation
     *
     * @param extensionName - Extension name used in generation
     * @returns Swift usage example code
     */
    generateUsageExample(extensionName?: string): string;
    /**
     * Get resolver instance for direct color resolution
     */
    getResolver(): ModeThemeResolver;
}
//# sourceMappingURL=iOSColorResolver.d.ts.map