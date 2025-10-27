/**
 * Radius Token Definitions
 *
 * Radius tokens follow 8-unit baseline grid alignment with strategic flexibility exceptions.
 * Base value: 8 units
 * Mathematical progression: Systematic multiples of base value with strategic flexibility tokens
 */
import { PrimitiveToken } from '../types/PrimitiveToken';
/**
 * Radius token base value for mathematical calculations
 */
export declare const RADIUS_BASE_VALUE = 8;
/**
 * Radius tokens with 8-unit baseline grid alignment and strategic flexibility
 */
export declare const radiusTokens: Record<string, PrimitiveToken>;
/**
 * Array of all radius token names for iteration
 */
export declare const radiusTokenNames: string[];
/**
 * Get radius token by name
 */
export declare function getRadiusToken(name: string): PrimitiveToken | undefined;
/**
 * Get all radius tokens as array
 */
export declare function getAllRadiusTokens(): PrimitiveToken[];
/**
 * Get radius tokens by baseline grid alignment
 */
export declare function getBaselineAlignedRadiusTokens(): PrimitiveToken[];
/**
 * Get strategic flexibility radius tokens
 */
export declare function getStrategicFlexibilityRadiusTokens(): PrimitiveToken[];
//# sourceMappingURL=RadiusTokens.d.ts.map