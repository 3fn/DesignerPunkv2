/**
 * Blend Composition Parser
 *
 * Parses "color with blend direction" syntax for compositional color modification effects.
 * Validates that color and blend tokens exist in their respective registries.
 * Validates that direction is a valid blend direction.
 *
 * Syntax:
 * - "color with blend direction" → BlendComposition
 * - Example: "purple500 with blend200 darker" → { color: "purple500", blend: "blend200", direction: "darker" }
 * - Example: "blue500 with blend300 lighter" → { color: "blue500", blend: "blend300", direction: "lighter" }
 * - Example: "red500 with blend200 saturate" → { color: "red500", blend: "blend200", direction: "saturate" }
 */
import type { BlendComposition, BlendCompositionValidationResult } from './BlendComposition';
import type { PrimitiveTokenRegistry } from '../registries/PrimitiveTokenRegistry';
import type { SemanticTokenRegistry } from '../registries/SemanticTokenRegistry';
export declare class BlendCompositionParser {
    private primitiveRegistry;
    private semanticRegistry;
    constructor(primitiveRegistry: PrimitiveTokenRegistry, semanticRegistry: SemanticTokenRegistry);
    /**
     * Parse blend composition syntax
     *
     * @param compositionString - String in format "color with blend direction"
     * @returns Validation result with parsed composition or error
     *
     * @example
     * parse("purple500 with blend200 darker")
     * // Returns: { valid: true, composition: { color: "purple500", blend: "blend200", direction: "darker", original: "..." } }
     *
     * @example
     * parse("blue500 with blend300 lighter")
     * // Returns: { valid: true, composition: { color: "blue500", blend: "blend300", direction: "lighter", original: "..." } }
     *
     * @example
     * parse("invalidColor with blend200 darker")
     * // Returns: { valid: false, error: "Color token 'invalidColor' not found" }
     */
    parse(compositionString: string): BlendCompositionValidationResult;
    /**
     * Validate color token exists in primitive or semantic registry
     */
    private validateColorToken;
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
    parseOrThrow(compositionString: string): BlendComposition;
    /**
     * Check if a string matches blend composition syntax
     * Does not validate token existence, only syntax
     */
    isBlendComposition(str: string): boolean;
}
//# sourceMappingURL=BlendCompositionParser.d.ts.map