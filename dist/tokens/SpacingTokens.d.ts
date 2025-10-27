/**
 * Spacing Token Definitions
 *
 * Spacing tokens follow 8-unit baseline grid alignment with strategic flexibility exceptions.
 * Base value: 8 units
 * Mathematical progression: Systematic multiples of base value with strategic flexibility tokens
 */
import { PrimitiveToken } from '../types/PrimitiveToken';
/**
 * Spacing token base value for mathematical calculations
 */
export declare const SPACING_BASE_VALUE = 8;
/**
 * Spacing tokens with 8-unit baseline grid alignment and strategic flexibility
 */
export declare const spacingTokens: Record<string, PrimitiveToken>;
/**
 * Array of all spacing token names for iteration
 */
export declare const spacingTokenNames: string[];
/**
 * Get spacing token by name
 */
export declare function getSpacingToken(name: string): PrimitiveToken | undefined;
/**
 * Get all spacing tokens as array
 */
export declare function getAllSpacingTokens(): PrimitiveToken[];
//# sourceMappingURL=SpacingTokens.d.ts.map