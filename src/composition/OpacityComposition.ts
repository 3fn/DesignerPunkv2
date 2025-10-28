/**
 * Opacity Composition Types
 * 
 * Defines types for opacity composition patterns where opacity is applied to colors.
 * Supports "color at opacity" syntax for compositional transparency effects.
 * 
 * Examples:
 * - "purple500 at opacity600" → purple500 with 48% opacity
 * - "black500 at opacityOverlay" → black500 with 32% opacity (semantic)
 * - "white100 at opacity1000" → white100 with 80% opacity
 */

/**
 * Opacity composition structure
 * Represents a color token with applied opacity
 */
export interface OpacityComposition {
  /** Color token name (e.g., "purple500", "black500") */
  color: string;

  /** Opacity token name (e.g., "opacity600", "opacityOverlay") */
  opacity: string;

  /** Original composition string for reference */
  original: string;
}

/**
 * Blend + Opacity composition structure (coordinated with blend-tokens)
 * Represents a color with blend modification then opacity applied
 * Order: blend first, then opacity
 */
export interface BlendOpacityComposition {
  /** Color token name */
  color: string;

  /** Blend token name */
  blend: string;

  /** Blend direction (darker, lighter, saturate, desaturate) */
  blendDirection: 'darker' | 'lighter' | 'saturate' | 'desaturate';

  /** Opacity token name */
  opacity: string;

  /** Original composition string for reference */
  original: string;
}

/**
 * Composition validation result
 */
export interface CompositionValidationResult {
  /** Whether the composition is valid */
  valid: boolean;

  /** Error message if invalid */
  error?: string;

  /** Parsed composition if valid */
  composition?: OpacityComposition | BlendOpacityComposition;
}
