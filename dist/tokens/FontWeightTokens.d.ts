/**
 * Font Weight Token Definitions
 *
 * Font weight tokens follow standard numeric font weight values.
 * Base value: 400 (normal weight)
 * Mathematical progression: Standard font weight increments
 */
import { PrimitiveToken } from '../types/PrimitiveToken';
/**
 * Font weight token base value for mathematical calculations
 */
export declare const FONT_WEIGHT_BASE_VALUE = 400;
/**
 * Font weight tokens with standard numeric progression
 */
export declare const fontWeightTokens: Record<string, PrimitiveToken>;
/**
 * Array of all font weight token names for iteration
 */
export declare const fontWeightTokenNames: string[];
/**
 * Get font weight token by name
 */
export declare function getFontWeightToken(name: string): PrimitiveToken | undefined;
/**
 * Get all font weight tokens as array
 */
export declare function getAllFontWeightTokens(): PrimitiveToken[];
//# sourceMappingURL=FontWeightTokens.d.ts.map