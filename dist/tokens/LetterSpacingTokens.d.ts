/**
 * Letter Spacing Token Definitions
 *
 * Letter spacing tokens provide unitless values for character spacing adjustments.
 * Base value: 0 (normal spacing)
 * Mathematical progression: Em-based increments for typography refinement
 */
import { PrimitiveToken } from '../types/PrimitiveToken';
/**
 * Letter spacing token base value for mathematical calculations
 */
export declare const LETTER_SPACING_BASE_VALUE = 0;
/**
 * Letter spacing tokens with em-based progression for typography refinement
 */
export declare const letterSpacingTokens: Record<string, PrimitiveToken>;
/**
 * Array of all letter spacing token names for iteration
 */
export declare const letterSpacingTokenNames: string[];
/**
 * Get letter spacing token by name
 */
export declare function getLetterSpacingToken(name: string): PrimitiveToken | undefined;
/**
 * Get all letter spacing tokens as array
 */
export declare function getAllLetterSpacingTokens(): PrimitiveToken[];
//# sourceMappingURL=LetterSpacingTokens.d.ts.map