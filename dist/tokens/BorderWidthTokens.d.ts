/**
 * Border Width Token Definitions
 *
 * Border width tokens follow a doubling progression with explicit mathematical relationships.
 * Base value: 1 unit
 * Mathematical progression: Doubling (1 → 2 → 4)
 */
import { PrimitiveToken } from '../types/PrimitiveToken';
/**
 * Border width token base value for mathematical calculations
 */
export declare const BORDER_WIDTH_BASE_VALUE = 1;
/**
 * Border width tokens with doubling progression
 */
export declare const borderWidthTokens: Record<string, PrimitiveToken>;
/**
 * Array of all border width token names for iteration
 */
export declare const borderWidthTokenNames: string[];
/**
 * Get border width token by name
 */
export declare function getBorderWidthToken(name: string): PrimitiveToken | undefined;
/**
 * Get all border width tokens as array
 */
export declare function getAllBorderWidthTokens(): PrimitiveToken[];
//# sourceMappingURL=BorderWidthTokens.d.ts.map