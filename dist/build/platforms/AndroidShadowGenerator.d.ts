/**
 * Android Shadow Generator
 *
 * Translates shadow tokens to Android Kotlin elevation values.
 * Generates Kotlin code for Material Design elevation.
 *
 * Note: Android uses elevation (dp) for shadows, which is an approximation
 * of the shadow system. For precise shadow control, custom drawable generation
 * would be required (future enhancement).
 *
 * Requirements: 6.3, 6.4
 */
/**
 * Shadow Kotlin value structure
 */
export interface ShadowKotlinValue {
    /** Android elevation value (dp) */
    elevation: string;
    /** Elevation approximation strategy used */
    strategy: 'blur-based' | 'offset-based' | 'combined';
    /** Individual shadow properties (for documentation) */
    properties: {
        offsetX: number;
        offsetY: number;
        blur: number;
        opacity: number;
        color: string;
    };
    /** Limitations note */
    limitations: string[];
}
/**
 * Android Shadow Generator
 *
 * Translates shadow semantic tokens to Android elevation values.
 * Uses approximation strategy to convert shadow properties to Material elevation.
 *
 * Android Limitations:
 * - Elevation is a single dp value, not separate offset/blur/opacity
 * - Shadow direction is fixed (light source from top)
 * - Shadow color is system-controlled (cannot be customized in standard elevation)
 * - Spread is not supported
 *
 * Approximation Strategy:
 * - Primary: Use blur value as elevation approximation (blur ≈ elevation)
 * - Secondary: Consider offsetY for depth adjustment
 * - Ignore: offsetX (directional shadows not supported), opacity, color
 */
export declare class AndroidShadowGenerator {
    /**
     * Generate Android elevation value from shadow token name
     *
     * @param shadowTokenName - Semantic shadow token name (e.g., 'shadow.container')
     * @returns Shadow Kotlin value structure or null if token not found
     */
    generateShadowKotlinValue(shadowTokenName: string): ShadowKotlinValue | null;
    /**
     * Calculate elevation from shadow properties
     *
     * Approximation Strategy:
     * 1. Blur-based: elevation ≈ blur (primary strategy)
     * 2. Offset-based: elevation ≈ offsetY (for shadows with large offsets)
     * 3. Combined: elevation ≈ (blur + offsetY) / 2 (for balanced shadows)
     *
     * @returns Elevation value (dp) and strategy used
     */
    private calculateElevation;
    /**
     * Get elevation limitations for this shadow
     *
     * Documents what shadow properties cannot be represented in Android elevation
     */
    private getElevationLimitations;
    /**
     * Generate Kotlin code for all shadow tokens
     *
     * @returns Kotlin code string with shadow token definitions
     */
    generateKotlinCode(): string;
    /**
     * Resolve primitive token from token registry
     */
    private resolvePrimitiveToken;
    /**
     * Resolve color token from color token registry
     *
     * Shadow tokens now reference primitive colors directly (e.g., 'shadowBlack100')
     * rather than semantic colors (e.g., 'color.shadow.default').
     */
    private resolveColorToken;
    /**
     * Extract color string value from ColorTokenValue or string
     */
    private extractColorValue;
    /**
     * Convert token name to Kotlin token name
     * Example: shadow.container -> container
     */
    private toKotlinTokenName;
}
//# sourceMappingURL=AndroidShadowGenerator.d.ts.map