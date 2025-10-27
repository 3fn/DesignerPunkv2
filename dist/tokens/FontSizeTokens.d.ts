/**
 * Font Size Token Definitions
 *
 * Font size tokens follow 1.125 modular scale (musical fourth) with base value 16.
 * Base value: 16 units (standard browser default)
 * Mathematical progression: Modular scale with strategic flexibility exceptions
 */
import { PrimitiveToken } from '../types/PrimitiveToken';
/**
 * Font size token base value for mathematical calculations
 */
export declare const FONT_SIZE_BASE_VALUE = 16;
/**
 * Modular scale ratio for fontSize progression (musical fourth)
 */
export declare const MODULAR_SCALE_RATIO = 1.125;
/**
 * FontSize tokens with 1.125 modular scale progression
 */
export declare const fontSizeTokens: Record<string, PrimitiveToken>;
/**
 * Array of all font size token names for iteration
 */
export declare const fontSizeTokenNames: string[];
/**
 * Get font size token by name
 */
export declare function getFontSizeToken(name: string): PrimitiveToken | undefined;
/**
 * Get all font size tokens as array
 */
export declare function getAllFontSizeTokens(): PrimitiveToken[];
//# sourceMappingURL=FontSizeTokens.d.ts.map