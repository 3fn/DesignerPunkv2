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
import { TokenCategory } from '../types/PrimitiveToken';
import { SemanticCategory } from '../types/SemanticToken';
import { BlendDirection } from '../tokens/BlendTokens';

export class BlendCompositionParser {
    private primitiveRegistry: PrimitiveTokenRegistry;
    private semanticRegistry: SemanticTokenRegistry;

    constructor(
        primitiveRegistry: PrimitiveTokenRegistry,
        semanticRegistry: SemanticTokenRegistry
    ) {
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
    parse(compositionString: string): BlendCompositionValidationResult {
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
                direction: direction as BlendDirection,
                original: compositionString
            }
        };
    }

    /**
     * Validate color token exists in primitive or semantic registry
     */
    private validateColorToken(tokenName: string): BlendCompositionValidationResult {
        // Check primitive color tokens
        const primitiveToken = this.primitiveRegistry.get(tokenName);
        if (primitiveToken && primitiveToken.category === TokenCategory.COLOR) {
            return { valid: true };
        }

        // Check semantic color tokens
        const semanticToken = this.semanticRegistry.get(tokenName);
        if (semanticToken && semanticToken.category === SemanticCategory.COLOR) {
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
    private validateBlendToken(tokenName: string): BlendCompositionValidationResult {
        // Check primitive blend tokens
        const primitiveToken = this.primitiveRegistry.get(tokenName);
        if (primitiveToken && primitiveToken.category === TokenCategory.BLEND) {
            return { valid: true };
        }

        // Check semantic blend tokens (they use INTERACTION category)
        const semanticToken = this.semanticRegistry.get(tokenName);
        if (semanticToken && semanticToken.category === SemanticCategory.INTERACTION) {
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
    private validateBlendDirection(direction: string): BlendCompositionValidationResult {
        const validDirections = Object.values(BlendDirection);
        
        if (!validDirections.includes(direction as BlendDirection)) {
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
    parseOrThrow(compositionString: string): BlendComposition {
        const result = this.parse(compositionString);
        if (!result.valid) {
            throw new Error(result.error);
        }
        return result.composition as BlendComposition;
    }

    /**
     * Check if a string matches blend composition syntax
     * Does not validate token existence, only syntax
     */
    isBlendComposition(str: string): boolean {
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
