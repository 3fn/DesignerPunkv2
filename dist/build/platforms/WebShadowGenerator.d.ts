/**
 * Web Shadow Generator
 *
 * Translates shadow tokens to CSS box-shadow format for web platform.
 * Generates CSS custom properties for shadow tokens.
 *
 * Requirements: 6.1
 */
/**
 * Shadow CSS value structure
 */
export interface ShadowCSSValue {
    /** CSS box-shadow value */
    boxShadow: string;
    /** Individual shadow properties as CSS custom properties */
    customProperties: {
        offsetX: string;
        offsetY: string;
        blur: string;
        opacity: string;
        color: string;
    };
}
/**
 * Web Shadow Generator
 *
 * Translates shadow semantic tokens to CSS box-shadow format.
 * Resolves primitive token references and generates complete CSS values.
 */
export declare class WebShadowGenerator {
    /**
     * Generate CSS box-shadow value from shadow token name
     *
     * @param shadowTokenName - Semantic shadow token name (e.g., 'shadow.container')
     * @returns CSS box-shadow value or null if token not found
     */
    generateBoxShadow(shadowTokenName: string): string | null;
    /**
     * Generate complete shadow CSS value with custom properties
     *
     * @param shadowTokenName - Semantic shadow token name
     * @returns Shadow CSS value structure or null if token not found
     */
    generateShadowCSSValue(shadowTokenName: string): ShadowCSSValue | null;
    /**
     * Generate CSS custom properties for all shadow tokens
     *
     * @returns CSS string with custom properties for all shadow tokens
     */
    generateCSSCustomProperties(): string;
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
     * Apply opacity to color value
     *
     * Converts rgb() to rgba() with opacity
     */
    private applyOpacityToColor;
    /**
     * Convert token name to CSS variable name
     * Example: shadow.container -> shadow-container
     */
    private toCSSVariableName;
}
//# sourceMappingURL=WebShadowGenerator.d.ts.map