/**
 * Opacity Token Definitions
 *
 * Opacity tokens follow 0.08 base value with 13-token scale (0-100%) in 8% increments.
 * Base value: 0.08 (8%)
 * Mathematical progression: Systematic multiples of base value
 * Scale notation: opacity100 = 1 × base, opacity200 = 2 × base, etc.
 */
import { PrimitiveToken } from '../types/PrimitiveToken';
/**
 * Opacity token base value for mathematical calculations
 */
export declare const OPACITY_BASE_VALUE = 0.08;
/**
 * Opacity tokens with 13-token scale from 0% to 100% in 8% increments
 */
export declare const opacityTokens: Record<string, PrimitiveToken>;
/**
 * Array of all opacity token names for iteration
 */
export declare const opacityTokenNames: string[];
/**
 * Get opacity token by name
 */
export declare function getOpacityToken(name: string): PrimitiveToken | undefined;
/**
 * Get all opacity tokens as array
 */
export declare function getAllOpacityTokens(): PrimitiveToken[];
//# sourceMappingURL=OpacityTokens.d.ts.map