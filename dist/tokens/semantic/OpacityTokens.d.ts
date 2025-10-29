/**
 * Semantic Opacity Token Definitions
 *
 * Semantic opacity tokens provide contextual meaning for common transparency use cases.
 * All tokens reference primitive opacity tokens to maintain mathematical consistency.
 *
 * Use Cases:
 * - opacityDisabled: Disabled UI elements with faded appearance
 * - opacityOverlay: Modal scrims and overlays that block background interaction
 * - opacityHover: Subtle hover feedback for interactive elements
 * - opacityPressed: Pressed state feedback for buttons and interactive elements
 * - opacityLoading: Loading skeleton states and placeholders
 *
 * Total: 5 semantic opacity tokens
 */
import { SemanticToken } from '../../types/SemanticToken';
/**
 * Semantic opacity tokens for common use cases
 * Total: 5 tokens
 */
export declare const opacityTokens: Record<string, Omit<SemanticToken, 'primitiveTokens'>>;
/**
 * Array of all opacity semantic token names for iteration
 * Total: 5 tokens
 */
export declare const opacityTokenNames: string[];
/**
 * Get opacity semantic token by name
 */
export declare function getOpacityToken(name: string): Omit<SemanticToken, 'primitiveTokens'> | undefined;
/**
 * Get all opacity semantic tokens as array
 */
export declare function getAllOpacityTokens(): Array<Omit<SemanticToken, 'primitiveTokens'>>;
/**
 * Validate token count matches spec (5 tokens)
 */
export declare function validateOpacityTokenCount(): boolean;
/**
 * AI Agent Guidance for Opacity Token Selection
 *
 * When applying opacity to UI elements:
 *
 * 1. Disabled states?
 *    → Use opacity.disabled (48% opacity)
 *    → Creates faded appearance for non-interactive elements
 *
 * 2. Modal overlays or scrims?
 *    → Use opacity.overlay (32% opacity)
 *    → Blocks interaction while maintaining background context
 *
 * 3. Hover feedback?
 *    → Use opacity.hover (8% opacity)
 *    → Subtle transparency change for gentle feedback
 *
 * 4. Pressed/active states?
 *    → Use opacity.pressed (16% opacity)
 *    → Noticeable feedback for active interactions
 *
 * 5. Loading states or skeletons?
 *    → Use opacity.loading (16% opacity)
 *    → Non-intrusive loading indicators
 *
 * 6. Custom opacity needs?
 *    → Use primitive opacity tokens (opacity100, opacity200, etc.)
 *    → Semantic tokens cover common use cases; primitives provide flexibility
 *
 * 7. Compositional patterns?
 *    → Combine with color tokens: "color at opacity"
 *    → Example: "purple500 at opacity.disabled" for disabled button
 */
//# sourceMappingURL=OpacityTokens.d.ts.map