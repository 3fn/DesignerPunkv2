/**
 * Blend Composition Types
 *
 * Defines types for blend composition patterns where blend modifications are applied to colors.
 * Supports "color with blend direction" syntax for compositional color modification effects.
 *
 * Examples:
 * - "purple500 with blend200 darker" → purple500 darkened by 8%
 * - "blue500 with blend300 lighter" → blue500 lightened by 12%
 * - "red500 with blend200 saturate" → red500 with 8% more saturation
 * - "gray500 with blend300 desaturate" → gray500 with 12% less saturation
 */
import { BlendDirection } from '../tokens/BlendTokens';
/**
 * Blend composition structure
 * Represents a color token with applied blend modification
 */
export interface BlendComposition {
    /** Color token name (e.g., "purple500", "blue500") */
    color: string;
    /** Blend token name (e.g., "blend200", "blend300") */
    blend: string;
    /** Blend direction (darker, lighter, saturate, desaturate) */
    direction: BlendDirection;
    /** Original composition string for reference */
    original: string;
}
/**
 * Blend composition validation result
 */
export interface BlendCompositionValidationResult {
    /** Whether the composition is valid */
    valid: boolean;
    /** Error message if invalid */
    error?: string;
    /** Parsed composition if valid */
    composition?: BlendComposition;
}
//# sourceMappingURL=BlendComposition.d.ts.map