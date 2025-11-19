/**
 * Semantic Icon Size Token Definitions
 *
 * Icon size tokens are calculated using the formula: fontSize × lineHeight
 * This ensures icons maintain perfect optical balance with their paired typography
 * by filling the vertical space of text lines.
 *
 * Each token references fontSize and lineHeight primitives, enabling automatic
 * adaptation when typography scales change. The mathematical relationships are
 * preserved across all platforms through the unitless token architecture.
 */
import { SemanticToken } from '../../types/SemanticToken';
import { PrimitiveToken } from '../../types/PrimitiveToken';
/**
 * Calculate icon size from fontSize and lineHeight tokens
 * Formula: iconSize = fontSize.baseValue × lineHeight.baseValue (rounded)
 *
 * @param fontSizeToken - The fontSize primitive token
 * @param lineHeightToken - The lineHeight primitive token
 * @returns The calculated icon size (rounded to nearest integer)
 */
export declare function calculateIconSize(fontSizeToken: PrimitiveToken, lineHeightToken: PrimitiveToken): number;
/**
 * Generate all icon size tokens from fontSize and lineHeight primitives
 *
 * @returns Record of icon size tokens with all 11 scale levels
 */
export declare function generateIconSizeTokens(): Record<string, Omit<SemanticToken, 'primitiveTokens'>>;
/**
 * Icon size semantic tokens for typography pairing
 * Following fontSize × lineHeight formula for optical balance
 */
export declare const iconTokens: Record<string, Omit<SemanticToken, 'primitiveTokens'>>;
/**
 * Array of all icon size token names for iteration
 */
export declare const iconTokenNames: string[];
/**
 * Get icon size token by name
 */
export declare function getIconToken(name: string): Omit<SemanticToken, 'primitiveTokens'> | undefined;
/**
 * Get all icon size tokens as array
 */
export declare function getAllIconTokens(): Array<Omit<SemanticToken, 'primitiveTokens'>>;
//# sourceMappingURL=IconTokens.d.ts.map