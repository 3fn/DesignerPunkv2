"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpacityCompositionParser = void 0;
const PrimitiveToken_1 = require("../types/PrimitiveToken");
const SemanticToken_1 = require("../types/SemanticToken");
const BlendTokens_1 = require("../tokens/BlendTokens");
class OpacityCompositionParser {
    constructor(primitiveRegistry, semanticRegistry) {
        this.primitiveRegistry = primitiveRegistry;
        this.semanticRegistry = semanticRegistry;
    }
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
    parse(compositionString) {
        // Trim whitespace
        const trimmed = compositionString.trim();
        // Check for "at" keyword
        if (!trimmed.includes(' at ')) {
            return {
                valid: false,
                error: `Invalid composition syntax: "${compositionString}". Expected format: "color at opacity" or "color with blend direction at opacity"`
            };
        }
        // Check if this is a blend + opacity composition
        if (trimmed.includes(' with ')) {
            return this.parseBlendOpacityComposition(trimmed, compositionString);
        }
        // Parse simple opacity composition
        return this.parseSimpleOpacityComposition(trimmed, compositionString);
    }
    /**
     * Parse simple "color at opacity" composition
     */
    parseSimpleOpacityComposition(trimmed, original) {
        // Split on " at "
        const parts = trimmed.split(' at ');
        if (parts.length !== 2) {
            return {
                valid: false,
                error: `Invalid composition syntax: "${original}". Expected exactly one "at" keyword`
            };
        }
        const [colorPart, opacityPart] = parts.map(p => p.trim());
        // Validate color token exists
        const colorValidation = this.validateColorToken(colorPart);
        if (!colorValidation.valid) {
            return colorValidation;
        }
        // Validate opacity token exists
        const opacityValidation = this.validateOpacityToken(opacityPart);
        if (!opacityValidation.valid) {
            return opacityValidation;
        }
        // Return valid composition
        return {
            valid: true,
            composition: {
                color: colorPart,
                opacity: opacityPart,
                original
            }
        };
    }
    /**
     * Parse "color with blend direction at opacity" composition
     * Enforces order: blend first, then opacity
     */
    parseBlendOpacityComposition(trimmed, original) {
        // Split on " at " to separate blend part from opacity part
        const atParts = trimmed.split(' at ');
        if (atParts.length !== 2) {
            return {
                valid: false,
                error: `Invalid composition syntax: "${original}". Expected exactly one "at" keyword`
            };
        }
        const [blendPart, opacityPart] = atParts.map(p => p.trim());
        // Split blend part on " with " to separate color from blend
        const withParts = blendPart.split(' with ');
        if (withParts.length !== 2) {
            return {
                valid: false,
                error: `Invalid composition syntax: "${original}". Expected exactly one "with" keyword before "at"`
            };
        }
        const [colorPart, blendDirectionPart] = withParts.map(p => p.trim());
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
        // Validate opacity token exists
        const opacityValidation = this.validateOpacityToken(opacityPart);
        if (!opacityValidation.valid) {
            return opacityValidation;
        }
        // Return valid blend + opacity composition
        return {
            valid: true,
            composition: {
                color: colorPart,
                blend: blendToken,
                blendDirection: direction,
                opacity: opacityPart,
                original
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
     * Validate opacity token exists in primitive or semantic registry
     * Note: Semantic opacity tokens use INTERACTION category (like blend tokens)
     */
    validateOpacityToken(tokenName) {
        // Check primitive opacity tokens
        const primitiveToken = this.primitiveRegistry.get(tokenName);
        if (primitiveToken && primitiveToken.category === PrimitiveToken_1.TokenCategory.OPACITY) {
            return { valid: true };
        }
        // Check semantic opacity tokens (they use INTERACTION category)
        const semanticToken = this.semanticRegistry.get(tokenName);
        if (semanticToken && semanticToken.category === SemanticToken_1.SemanticCategory.INTERACTION) {
            // Verify it's actually an opacity token by checking the name pattern
            if (tokenName.startsWith('opacity')) {
                return { valid: true };
            }
        }
        // Token not found
        return {
            valid: false,
            error: `Opacity token "${tokenName}" not found in primitive or semantic registries`
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
     * Check if a string matches opacity composition syntax
     * Does not validate token existence, only syntax
     */
    isOpacityComposition(str) {
        const trimmed = str.trim();
        return trimmed.includes(' at ') && trimmed.split(' at ').length === 2;
    }
    /**
     * Check if a string matches blend + opacity composition syntax
     * Does not validate token existence, only syntax
     */
    isBlendOpacityComposition(str) {
        const trimmed = str.trim();
        return trimmed.includes(' with ') && trimmed.includes(' at ');
    }
}
exports.OpacityCompositionParser = OpacityCompositionParser;
//# sourceMappingURL=OpacityCompositionParser.js.map