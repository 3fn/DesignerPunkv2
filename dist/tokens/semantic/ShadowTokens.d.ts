/**
 * Semantic Shadow Token Definitions
 *
 * Shadow semantic tokens compose primitive shadow tokens using string references
 * to create complete shadow styles for specific use cases.
 *
 * Each shadow token explicitly defines all shadow properties using multi-primitive structure:
 * - offsetX: Horizontal shadow offset based on light source position
 * - offsetY: Vertical shadow offset based on depth
 * - blur: Shadow blur amount based on quality and depth
 * - opacity: Shadow opacity based on quality and depth
 * - color: Shadow color based on lighting environment
 */
import { SemanticToken } from '../../types/SemanticToken';
/**
 * Shadow semantic tokens for common UI shadow styles
 * Following compositional architecture with explicit multi-primitive composition
 */
export declare const shadowTokens: Record<string, Omit<SemanticToken, 'primitiveTokens'>>;
/**
 * Array of all shadow semantic token names for iteration
 */
export declare const shadowTokenNames: string[];
/**
 * Get shadow semantic token by name
 */
export declare function getShadowToken(name: string): Omit<SemanticToken, 'primitiveTokens'> | undefined;
/**
 * Get all shadow semantic tokens as array
 */
export declare function getAllShadowTokens(): Array<Omit<SemanticToken, 'primitiveTokens'>>;
//# sourceMappingURL=ShadowTokens.d.ts.map