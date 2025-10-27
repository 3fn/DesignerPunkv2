/**
 * Font Family Token Definitions
 *
 * Font family tokens provide categorical font stack definitions for different use cases.
 * These are not mathematical values but categorical selections for typography.
 */
import { PrimitiveToken } from '../types/PrimitiveToken';
/**
 * Font family tokens with platform-appropriate font stacks
 */
export declare const fontFamilyTokens: Record<string, PrimitiveToken>;
/**
 * Array of all font family token names for iteration
 */
export declare const fontFamilyTokenNames: string[];
/**
 * Get font family token by name
 */
export declare function getFontFamilyToken(name: string): PrimitiveToken | undefined;
/**
 * Get all font family tokens as array
 */
export declare function getAllFontFamilyTokens(): PrimitiveToken[];
//# sourceMappingURL=FontFamilyTokens.d.ts.map