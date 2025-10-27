/**
 * Spacing Token Constants
 *
 * Central definition of spacing family base value and mathematical progressions.
 */
/**
 * Spacing family base value (space100)
 *
 * This is the foundational value for the spacing token family.
 * All other spacing tokens are derived from this value through
 * mathematical relationships.
 */
export declare const SPACING_BASE_VALUE = 8;
/**
 * Common spacing multipliers
 *
 * Grid Alignment:
 * - 8-unit grid (primary): space100, space200, space300, space400, space600, space800
 * - Strategic flexibility: space025 (2), space050 (4), space075 (6), space125 (10), space150 (12), space250 (20)
 *
 * Note: Strategic flexibility tokens break the 8-unit grid for specific design needs.
 * Usage should maintain ≥80% appropriate usage patterns across the design system.
 */
export declare const SPACING_MULTIPLIERS: {
    readonly SPACE_025: 0.25;
    readonly SPACE_050: 0.5;
    readonly SPACE_075: 0.75;
    readonly SPACE_100: 1;
    readonly SPACE_150: 1.5;
    readonly SPACE_200: 2;
    readonly SPACE_300: 3;
    readonly SPACE_400: 4;
    readonly SPACE_600: 6;
    readonly SPACE_800: 8;
};
/**
 * Calculate spacing value from multiplier
 */
export declare function getSpacingValue(multiplier: number): number;
/**
 * Get spacing token name from multiplier
 */
export declare function getSpacingTokenName(multiplier: number): string;
//# sourceMappingURL=SpacingTokens.d.ts.map