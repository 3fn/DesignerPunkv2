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
 * - glow colors = vibrant neon colors for emphasis effects
 *
 * All color tokens reference mode-aware primitive color tokens that support
 * light/dark modes with base/wcag themes.
 *
 * Glow colors reference existing vibrant primitive colors (purple500, cyan500, yellow500)
 * for neon emphasis effects.
 *
 * ARCHITECTURAL DECISION: Shadow Color Semantic Layer Removed
 *
 * Shadow tokens now reference primitive shadow colors directly (e.g., shadowBlack100)
 * instead of going through a semantic color layer (e.g., color.shadow.default).
 *
 * Rationale:
 * 1. Matches Industry Patterns: Major design systems (Material Design, Carbon, Polaris)
 *    include shadow color directly in shadow token definitions rather than creating
 *    separate semantic color tokens for shadows.
 *
 * 2. Aligns with Typography Architecture: Typography tokens compose primitives directly
 *    (fontSize, lineHeight, fontWeight) without intermediate semantic layers. Shadow
 *    tokens should follow the same pattern.
 *
 * 3. Eliminates Hierarchical References: Semantic→semantic references (shadow.dusk →
 *    color.shadow.default → shadowBlack100) create unnecessary complexity. Direct
 *    primitive references (shadow.dusk → shadowBlack100) are clearer.
 *
 * 4. Shadow Colors Aren't Reusable: Shadow-specific colors like shadowBlack100 won't
 *    be used outside shadow contexts, so a semantic abstraction layer provides no value.
 *
 * 5. Semantic Meaning in Shadow Token: The semantic meaning belongs in the shadow token
 *    name itself (shadow.dusk, shadow.sunrise) rather than in a separate color token.
 *
 * Spec-aligned: 18 color semantic tokens (15 original + 3 glow, shadow colors removed)
 */
import { SemanticToken } from '../../types/SemanticToken';
/**
 * Semantic color tokens for systematic color usage
 * Total: 18 tokens (15 original + 3 glow, shadow colors removed)
 */
export declare const colorTokens: Record<string, Omit<SemanticToken, 'primitiveTokens'>>;
/**
 * Array of all color semantic token names for iteration
 * Total: 18 tokens (15 original + 3 glow, shadow colors removed)
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
 * Validate token count matches spec (18 tokens: 15 original + 3 glow, shadow colors removed)
 */
export declare function validateColorTokenCount(): boolean;
//# sourceMappingURL=ColorTokens.d.ts.map