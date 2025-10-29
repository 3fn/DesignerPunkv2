"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlendCompositionParser = void 0;
const PrimitiveToken_1 = require("../types/PrimitiveToken");
const SemanticToken_1 = require("../types/SemanticToken");
const BlendTokens_1 = require("../tokens/BlendTokens");
class BlendCompositionParser {
    constructor(primitiveRegistry, semanticRegistry) {
        this.primitiveRegistry = primitiveRegistry;
        this.semanticRegistry = semanticRegistry;
    }
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
    parse(compositionString) {
        // Trim whitespace
        const trimmed = compositionString.trim();
        // Check for "with" keyword
        if (!trimmed.includes(' with ')) {
            return {
                valid: false,
                error: `Invalid composition syntax: "${compositionString}". Expected format: "color with blend direction"`
            };
        }
        // Split on " with "
        const parts = trimmed.split(' with ');
        if (parts.length !== 2) {
            return {
                valid: false,
                error: `Invalid composition syntax: "${compositionString}". Expected exactly one "with" keyword`
            };
        }
        const [colorPart, blendDirectionPart] = parts.map(p => p.trim());
        // Parse blend and direction (e.g., "blend200 darker")
        // Split on whitespace and filter out empty strings to handle multiple spaces
        const blendParts = blendDirectionPart.split(/\s+/).filter(p => p.length > 0);
        if (blendParts.length !== 2) {
            return {
                valid: false,
                error: `Invalid blend syntax: "${blendDirectionPart}". Expected format: "blendXXX direction" (e.g., "blend200 darker")`
            };
        }
        const [blendToken, direction] = blendParts;
        // Validate color token exists
        const colorValidation = this.validateColorToken(colorPart);
        if (!colorValidation.valid) {
            return colorValidation;
        }
        // Validate blend token exists
        const blendValidation = this.validateBlendToken(blendToken);
        if (!blendValidation.valid) {
            return blendValidation;
        }
        // Validate direction is valid
        const directionValidation = this.validateBlendDirection(direction);
        if (!directionValidation.valid) {
            return directionValidation;
        }
        // Return valid composition
        return {
            valid: true,
            composition: {
                color: colorPart,
                blend: blendToken,
                direction: direction,
                original: compositionString
            }
        };
    }
    /**
     * Validate color token exists in primitive or semantic registry
     */
    validateColorToken(tokenName) {
        // Check primitive color tokens
        const primitiveToken = this.primitiveRegistry.get(tokenName);
        if (primitiveToken && primitiveToken.category === PrimitiveToken_1.TokenCategory.COLOR) {
            return { valid: true };
        }
        // Check semantic color tokens
        const semanticToken = this.semanticRegistry.get(tokenName);
        if (semanticToken && semanticToken.category === SemanticToken_1.SemanticCategory.COLOR) {
            return { valid: true };
        }
        // Token not found
        return {
            valid: false,
            error: `Color token "${tokenName}" not found in primitive or semantic registries`
        };
    }
    /**
     * Validate blend token exists in primitive or semantic registry
     */
    validateBlendToken(tokenName) {
        // Check primitive blend tokens
        const primitiveToken = this.primitiveRegistry.get(tokenName);
        if (primitiveToken && primitiveToken.category === PrimitiveToken_1.TokenCategory.BLEND) {
            return { valid: true };
        }
        // Check semantic blend tokens (they use INTERACTION category)
        const semanticToken = this.semanticRegistry.get(tokenName);
        if (semanticToken && semanticToken.category === SemanticToken_1.SemanticCategory.INTERACTION) {
            // Verify it's actually a blend token by checking the name pattern
            if (tokenName.startsWith('blend')) {
                return { valid: true };
            }
        }
        // Token not found
        return {
            valid: false,
            error: `Blend token "${tokenName}" not found in primitive or semantic registries`
        };
    }
    /**
     * Validate blend direction is valid
     */
    validateBlendDirection(direction) {
        const validDirections = Object.values(BlendTokens_1.BlendDirection);
        if (!validDirections.includes(direction)) {
            return {
                valid: false,
                error: `Invalid blend direction "${direction}". Valid directions: ${validDirections.join(', ')}`
            };
        }
        return { valid: true };
    }
    /**
     * Parse and validate composition, throwing error if invalid
     * Convenience method for cases where errors should be thrown
     */
    parseOrThrow(compositionString) {
        const result = this.parse(compositionString);
        if (!result.valid) {
            throw new Error(result.error);
        }
        return result.composition;
    }
    /**
     * Check if a string matches blend composition syntax
     * Does not validate token existence, only syntax
     */
    isBlendComposition(str) {
        const trimmed = str.trim();
        // Must have " with " and the part after "with" should have two parts (blend + direction)
        if (!trimmed.includes(' with ')) {
            return false;
        }
        const parts = trimmed.split(' with ');
        if (parts.length !== 2) {
            return false;
        }
        const blendPart = parts[1].trim();
        const blendParts = blendPart.split(/\s+/).filter(p => p.length > 0);
        return blendParts.length === 2;
    }
}
exports.BlendCompositionParser = BlendCompositionParser;
//# sourceMappingURL=BlendCompositionParser.js.map