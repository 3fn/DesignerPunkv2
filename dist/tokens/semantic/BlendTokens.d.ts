/**
 * Semantic Blend Token Definitions
 *
 * Semantic blend tokens provide contextual meaning for common color modification use cases.
 * All tokens reference primitive blend tokens with explicit blend direction to maintain
 * mathematical consistency and clear intent.
 *
 * Blend Directions:
 * - darker: Overlay black at specified opacity (for light backgrounds)
 * - lighter: Overlay white at specified opacity (for dark backgrounds)
 * - saturate: Increase color saturation in HSL space (for focus/emphasis)
 * - desaturate: Decrease color saturation in HSL space (for disabled states)
 *
 * Use Cases:
 * - blendHoverDarker: Standard hover feedback with darkening (8% darker)
 * - blendHoverLighter: Hover feedback on dark backgrounds (8% lighter)
 * - blendPressedDarker: Pressed state feedback with darkening (12% darker)
 * - blendFocusSaturate: Focus state with increased saturation (8% more saturated)
 * - blendDisabledDesaturate: Disabled state with decreased saturation (12% less saturated)
 * - blendContainerHoverDarker: Subtle container hover feedback (4% darker)
 *
 * Total: 6 semantic blend tokens
 */
import { BlendDirection } from '../BlendTokens';
/**
 * Semantic blend token interface
 * Extends base semantic token pattern with blend-specific direction
 */
export interface SemanticBlendToken {
    /** Semantic token name with contextual meaning */
    name: string;
    /** Reference to primitive blend token (e.g., 'blend200') */
    primitiveReference: string;
    /** Blend direction for color modification */
    direction: BlendDirection;
    /** Semantic category (always 'interaction' for blend tokens) */
    category: 'interaction';
    /** Contextual meaning or usage description */
    context: string;
    /** Detailed description of semantic meaning and appropriate usage */
    description: string;
}
/**
 * Semantic blend tokens for common interaction states
 * Total: 6 tokens
 */
export declare const blendTokens: Record<string, SemanticBlendToken>;
/**
 * Array of all blend semantic token names for iteration
 * Total: 6 tokens
 */
export declare const blendTokenNames: string[];
/**
 * Get blend semantic token by name
 */
export declare function getBlendToken(name: string): SemanticBlendToken | undefined;
/**
 * Get all blend semantic tokens as array
 */
export declare function getAllBlendTokens(): SemanticBlendToken[];
/**
 * Validate token count matches spec (6 tokens)
 */
export declare function validateBlendTokenCount(): boolean;
/**
 * AI Agent Guidance for Blend Token Selection
 *
 * When applying blend modifications to colors:
 *
 * 1. Standard hover on light backgrounds?
 *    → Use blend.hoverDarker (8% darker)
 *    → Provides noticeable darkening for buttons, cards, interactive elements
 *
 * 2. Hover on dark backgrounds?
 *    → Use blend.hoverLighter (8% lighter)
 *    → Provides noticeable lightening for dark-themed interactive elements
 *
 * 3. Pressed/active states?
 *    → Use blend.pressedDarker (12% darker)
 *    → Provides clear feedback for active button press or interaction
 *
 * 4. Focus states needing emphasis?
 *    → Use blend.focusSaturate (8% more saturated)
 *    → Creates vibrant, attention-drawing appearance for focused elements
 *
 * 5. Disabled states?
 *    → Use blend.disabledDesaturate (12% less saturated)
 *    → Creates muted appearance indicating non-interactive state
 *
 * 6. Large container/surface hover?
 *    → Use blend.containerHoverDarker (4% darker)
 *    → Provides subtle feedback for cards, tiles, list items without being overwhelming
 *
 * 7. Custom blend needs?
 *    → Use primitive blend tokens (blend100, blend200, etc.) with explicit direction
 *    → Semantic tokens cover common use cases; primitives provide flexibility
 *
 * 8. Compositional patterns?
 *    → Combine with color tokens: "color with blend direction"
 *    → Example: "purple500 with blend.hoverDarker" for button hover state
 *    → Can compose with opacity: "color with blend direction at opacity"
 *    → Example: "purple500 with blend.hoverDarker at opacity600" for complex effects
 *
 * 9. Semantic vs Component Boundary?
 *    → Semantic tokens (this file): Generic, reusable patterns for interaction states
 *    → Component tokens (component library): Component-specific compositions
 *    → Example: button.hover uses blend.hoverDarker, but defined in component library
 */
//# sourceMappingURL=BlendTokens.d.ts.map