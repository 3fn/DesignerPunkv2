/**
 * Semantic Typography Token Definitions
 *
 * Typography semantic tokens combine fontSize, lineHeight, fontFamily, fontWeight,
 * and letterSpacing primitives to create complete typography styles for specific contexts.
 *
 * Each token explicitly defines all five typography properties using multi-primitive structure:
 * - fontSize: Size of the text
 * - lineHeight: Line height ratio paired with fontSize
 * - fontFamily: Font family stack
 * - fontWeight: Font weight value
 * - letterSpacing: Letter spacing adjustment (default: letterSpacing100)
 */
import { SemanticToken } from '../../types/SemanticToken';
/**
 * Typography semantic tokens for common text styles
 * Following token-specifications-v3.md structure with explicit multi-primitive composition
 */
export declare const typographyTokens: Record<string, Omit<SemanticToken, 'primitiveTokens'>>;
/**
 * Array of all typography semantic token names for iteration
 */
export declare const typographyTokenNames: string[];
/**
 * Get typography semantic token by name
 */
export declare function getTypographyToken(name: string): Omit<SemanticToken, 'primitiveTokens'> | undefined;
/**
 * Get all typography semantic tokens as array
 */
export declare function getAllTypographyTokens(): Array<Omit<SemanticToken, 'primitiveTokens'>>;
//# sourceMappingURL=TypographyTokens.d.ts.map