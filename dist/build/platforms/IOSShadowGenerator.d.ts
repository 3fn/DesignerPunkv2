/**
 * iOS Shadow Generator
 *
 * Translates shadow tokens to iOS Swift shadow properties.
 * Generates Swift code for shadowOffset, shadowRadius, shadowOpacity, and shadowColor.
 *
 * Note: iOS does not support shadow spread property.
 *
 * Requirements: 6.2, 6.5
 */
/**
 * Shadow Swift value structure
 */
export interface ShadowSwiftValue {
    /** Swift shadowOffset value (CGSize) */
    shadowOffset: string;
    /** Swift shadowRadius value (CGFloat) */
    shadowRadius: string;
    /** Swift shadowOpacity value (Float) */
    shadowOpacity: string;
    /** Swift shadowColor value (UIColor) */
    shadowColor: string;
    /** Individual shadow properties */
    properties: {
        offsetX: number;
        offsetY: number;
        blur: number;
        opacity: number;
        color: string;
    };
}
/**
 * iOS Shadow Generator
 *
 * Translates shadow semantic tokens to iOS Swift shadow properties.
 * Resolves primitive token references and generates Swift code.
 *
 * Note: iOS does not support shadow spread. The spread property is omitted
 * from shadow composition to maintain cross-platform consistency.
 */
export declare class IOSShadowGenerator {
    /**
     * Generate Swift shadow properties from shadow token name
     *
     * @param shadowTokenName - Semantic shadow token name (e.g., 'shadow.container')
     * @returns Shadow Swift value structure or null if token not found
     */
    generateShadowSwiftValue(shadowTokenName: string): ShadowSwiftValue | null;
    /**
     * Generate Swift extension code for all shadow tokens
     *
     * @returns Swift code string with shadow token extensions
     */
    generateSwiftExtension(): string;
    /**
     * Resolve primitive token from token registry
     */
    private resolvePrimitiveToken;
    /**
     * Resolve color token from color token registry
     */
    private resolveColorToken;
    /**
     * Extract color string value from ColorTokenValue or string
     */
    private extractColorValue;
    /**
     * Generate UIColor Swift code from color value
     *
     * @param colorValue - Color value (rgb string or UIColor code)
     * @param opacity - Opacity value (0-1)
     * @returns Swift UIColor code
     */
    private generateUIColor;
    /**
     * Convert token name to Swift token name
     * Example: shadow.container -> container
     */
    private toSwiftTokenName;
}
//# sourceMappingURL=IOSShadowGenerator.d.ts.map