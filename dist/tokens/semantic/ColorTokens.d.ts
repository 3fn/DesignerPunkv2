/**
 * Semantic Color Token Definitions
 *
 * Mode-aware semantic color tokens following systematic palette guidelines:
 * - primary = purple (brand authority and focus states)
 * - secondary = violet (sophisticated depth and secondary elements)
 * - success = cyan (tech/digital and success states)
 * - warning = yellow (urgent attention and warnings)
 * - error = orange (approachable error states)
 * - info = teal (informational states)
 * - shadow colors = mode-agnostic shadow tints based on art theory
 * - glow colors = vibrant neon colors for emphasis effects
 *
 * All color tokens reference mode-aware primitive color tokens that support
 * light/dark modes with base/wcag themes.
 *
 * Shadow colors are mode-agnostic (always dark) and reference primitive shadow
 * color tokens based on art theory (warm light creates cool shadows, etc.)
 *
 * Glow colors reference existing vibrant primitive colors (purple500, cyan500, yellow500)
 * for neon emphasis effects.
 *
 * Spec-aligned: 22 color semantic tokens (15 original + 4 shadow + 3 glow)
 */
import { SemanticToken } from '../../types/SemanticToken';
/**
 * Semantic color tokens for systematic color usage
 * Total: 22 tokens (15 original + 4 shadow + 3 glow)
 */
export declare const colorTokens: Record<string, Omit<SemanticToken, 'primitiveTokens'>>;
/**
 * Array of all color semantic token names for iteration
 * Total: 22 tokens (15 original + 4 shadow + 3 glow)
 */
export declare const colorTokenNames: string[];
/**
 * Get color semantic token by name
 */
export declare function getColorToken(name: string): Omit<SemanticToken, 'primitiveTokens'> | undefined;
/**
 * Get all color semantic tokens as array
 */
export declare function getAllColorTokens(): Array<Omit<SemanticToken, 'primitiveTokens'>>;
/**
 * Validate token count matches spec (22 tokens: 15 original + 4 shadow + 3 glow)
 */
export declare function validateColorTokenCount(): boolean;
//# sourceMappingURL=ColorTokens.d.ts.map