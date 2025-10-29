/**
 * Opacity Composition Parser
 *
 * Parses "color at opacity" and "color with blend direction at opacity" syntax
 * for compositional transparency effects.
 * Validates that color, blend, and opacity tokens exist in their respective registries.
 *
 * Syntax:
 * - Simple: "color at opacity" → OpacityComposition
 * - Example: "purple500 at opacity600" → { color: "purple500", opacity: "opacity600" }
 * - Blend + Opacity: "color with blend direction at opacity" → BlendOpacityComposition
 * - Example: "purple500 with blend200 darker at opacity600"
 */
import type { OpacityComposition, BlendOpacityComposition, CompositionValidationResult } from './OpacityComposition';
import type { PrimitiveTokenRegistry } from '../registries/PrimitiveTokenRegistry';
import type { SemanticTokenRegistry } from '../registries/SemanticTokenRegistry';
export declare class OpacityCompositionParser {
    private primitiveRegistry;
    private semanticRegistry;
    constructor(primitiveRegistry: PrimitiveTokenRegistry, semanticRegistry: SemanticTokenRegistry);
    /**
     * Parse composition syntax (simple or blend + opacity)
     *
     * @param compositionString - String in format "color at opacity" or "color with blend direction at opacity"
     * @returns Validation result with parsed composition or error
     *
     * @example
     * parse("purple500 at opacity600")
     * // Returns: { valid: true, composition: { color: "purple500", opacity: "opacity600", original: "..." } }
     *
     * @example
     * parse("purple500 with blend200 darker at opacity600")
     * // Returns: { valid: true, composition: { color: "purple500", blend: "blend200", blendDirection: "darker", opacity: "opacity600", original: "..." } }
     *
     * @example
     * parse("invalidColor at opacity600")
     * // Returns: { valid: false, error: "Color token 'invalidColor' not found" }
     */
    parse(compositionString: string): CompositionValidationResult;
    /**
     * Parse simple "color at opacity" composition
     */
    private parseSimpleOpacityComposition;
    /**
     * Parse "color with blend direction at opacity" composition
     * Enforces order: blend first, then opacity
     */
    private parseBlendOpacityComposition;
    /**
     * Validate color token exists in primitive or semantic registry
     */
    private validateColorToken;
    /**
     * Validate opacity token exists in primitive or semantic registry
     * Note: Semantic opacity tokens use INTERACTION category (like blend tokens)
     */
    private validateOpacityToken;
    /**
     * Validate blend token exists in primitive or semantic registry
     */
    private validateBlendToken;
    /**
     * Validate blend direction is valid
     */
    private validateBlendDirection;
    /**
     * Parse and validate composition, throwing error if invalid
     * Convenience method for cases where errors should be thrown
     */
    parseOrThrow(compositionString: string): OpacityComposition | BlendOpacityComposition;
    /**
     * Check if a string matches opacity composition syntax
     * Does not validate token existence, only syntax
     */
    isOpacityComposition(str: string): boolean;
    /**
     * Check if a string matches blend + opacity composition syntax
     * Does not validate token existence, only syntax
     */
    isBlendOpacityComposition(str: string): boolean;
}
//# sourceMappingURL=OpacityCompositionParser.d.ts.map