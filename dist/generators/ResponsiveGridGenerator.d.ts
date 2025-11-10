/**
 * Responsive Grid Generator
 *
 * Generates CSS media queries for responsive grid system with:
 * - Progressive column counts (4→8→12→16)
 * - Breakpoint-specific grid spacing (gutters and margins)
 * - CSS custom properties for all values
 */
export interface ResponsiveGridConfig {
    breakpoint: string;
    columns: number;
    gutter: string;
    margin: string;
}
/**
 * Responsive grid configurations for each breakpoint
 * Maps breakpoints to column counts and grid spacing tokens
 */
export declare const responsiveGridConfigs: ResponsiveGridConfig[];
/**
 * Responsive Grid Generator
 * Generates CSS media queries for responsive grid system
 */
export declare class ResponsiveGridGenerator {
    /**
     * Generate complete responsive grid CSS
     * Includes base grid styles and media queries for all breakpoints
     */
    generateResponsiveGridCSS(): string;
    /**
     * Generate base grid container styles (xs breakpoint)
     * Mobile-first approach - xs is the default
     */
    private generateBaseGridStyles;
    /**
     * Generate media query for a specific breakpoint
     * Applies progressive column count and grid spacing
     */
    private generateMediaQuery;
    /**
     * Generate grid item styles with column span support
     * Provides utility classes for responsive column spanning
     */
    generateGridItemStyles(): string;
    /**
     * Generate complete responsive grid system CSS
     * Includes container, item, and utility styles
     */
    generateCompleteGridSystem(): string;
    /**
     * Convert camelCase to kebab-case
     * Example: gridGutterXs -> grid-gutter-xs
     */
    private toKebabCase;
    /**
     * Validate responsive grid configuration
     * Ensures all referenced tokens exist
     */
    validateConfiguration(): {
        valid: boolean;
        errors: string[];
    };
}
//# sourceMappingURL=ResponsiveGridGenerator.d.ts.map