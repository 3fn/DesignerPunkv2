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
import { TokenCategory } from '../types/PrimitiveToken';
import { SemanticCategory } from '../types/SemanticToken';
import { BlendDirection } from '../tokens/BlendTokens';

export class OpacityCompositionParser {
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
    parse(compositionString: string): CompositionValidationResult {
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
    private parseSimpleOpacityComposition(trimmed: string, original: string): CompositionValidationResult {
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
    private parseBlendOpacityComposition(trimmed: string, original: string): CompositionValidationResult {
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
                blendDirection: direction as BlendDirection,
                opacity: opacityPart,
                original
            }
        };
    }

    /**
     * Validate color token exists in primitive or semantic registry
     */
    private validateColorToken(tokenName: string): CompositionValidationResult {
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
     * Validate opacity token exists in primitive or semantic registry
     * Note: Semantic opacity tokens use INTERACTION category (like blend tokens)
     */
    private validateOpacityToken(tokenName: string): CompositionValidationResult {
        // Check primitive opacity tokens
        const primitiveToken = this.primitiveRegistry.get(tokenName);
        if (primitiveToken && primitiveToken.category === TokenCategory.OPACITY) {
            return { valid: true };
        }

        // Check semantic opacity tokens (they use INTERACTION category)
        const semanticToken = this.semanticRegistry.get(tokenName);
        if (semanticToken && semanticToken.category === SemanticCategory.INTERACTION) {
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
    private validateBlendToken(tokenName: string): CompositionValidationResult {
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
    private validateBlendDirection(direction: string): CompositionValidationResult {
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
    parseOrThrow(compositionString: string): OpacityComposition | BlendOpacityComposition {
        const result = this.parse(compositionString);
        if (!result.valid) {
            throw new Error(result.error);
        }
        return result.composition as OpacityComposition | BlendOpacityComposition;
    }

    /**
     * Check if a string matches opacity composition syntax
     * Does not validate token existence, only syntax
     */
    isOpacityComposition(str: string): boolean {
        const trimmed = str.trim();
        return trimmed.includes(' at ') && trimmed.split(' at ').length === 2;
    }

    /**
     * Check if a string matches blend + opacity composition syntax
     * Does not validate token existence, only syntax
     */
    isBlendOpacityComposition(str: string): boolean {
        const trimmed = str.trim();
        return trimmed.includes(' with ') && trimmed.includes(' at ');
    }
}
