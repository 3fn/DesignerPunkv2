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
 * - color.icon.opticalBalance: Icon optical weight compensation (8% lighter)
 * 
 * Total: 7 semantic blend tokens
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
  primitiveReferences: {
    value: string;
  };

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
 * Total: 7 tokens
 */
export const blendTokens: Record<string, SemanticBlendToken> = {
  'blend.hoverDarker': {
    name: 'blend.hoverDarker',
    primitiveReferences: {
      value: 'blend200'
    },
    direction: BlendDirection.DARKER,
    category: 'interaction',
    context: 'Standard hover feedback - darker color for light backgrounds',
    description: 'Blend for hover states with darkening (8% darker) - provides noticeable feedback on light-colored buttons, cards, and interactive elements'
  },

  'blend.hoverLighter': {
    name: 'blend.hoverLighter',
    primitiveReferences: {
      value: 'blend200'
    },
    direction: BlendDirection.LIGHTER,
    category: 'interaction',
    context: 'Hover feedback on dark backgrounds - lighter color for dark surfaces',
    description: 'Blend for hover states with lightening (8% lighter) - provides noticeable feedback on dark-colored buttons, cards, and interactive elements'
  },

  'blend.pressedDarker': {
    name: 'blend.pressedDarker',
    primitiveReferences: {
      value: 'blend300'
    },
    direction: BlendDirection.DARKER,
    category: 'interaction',
    context: 'Pressed state feedback - clear darkening for active press',
    description: 'Blend for pressed states with darkening (12% darker) - provides clear visual feedback when buttons or interactive elements are actively pressed'
  },

  'blend.focusSaturate': {
    name: 'blend.focusSaturate',
    primitiveReferences: {
      value: 'blend200'
    },
    direction: BlendDirection.SATURATE,
    category: 'interaction',
    context: 'Focus state feedback - more vibrant, attention-drawing color',
    description: 'Blend for focus states with saturation increase (8% more saturated) - creates energized, attention-drawing appearance for focused interactive elements'
  },

  'blend.disabledDesaturate': {
    name: 'blend.disabledDesaturate',
    primitiveReferences: {
      value: 'blend300'
    },
    direction: BlendDirection.DESATURATE,
    category: 'interaction',
    context: 'Disabled state appearance - muted, inactive color',
    description: 'Blend for disabled states with desaturation (12% less saturated) - creates muted, inactive appearance indicating non-interactive state'
  },

  'blend.containerHoverDarker': {
    name: 'blend.containerHoverDarker',
    primitiveReferences: {
      value: 'blend100'
    },
    direction: BlendDirection.DARKER,
    category: 'interaction',
    context: 'Subtle container hover - gentle surface feedback for large areas',
    description: 'Blend for container/surface hover with subtle darkening (4% darker) - provides gentle feedback for large interactive surfaces like cards, tiles, and list items'
  },

  'color.icon.opticalBalance': {
    name: 'color.icon.opticalBalance',
    primitiveReferences: {
      value: 'blend200'
    },
    direction: BlendDirection.LIGHTER,
    category: 'interaction',
    context: 'Icon optical weight compensation when paired with text',
    description: 'Blend for icon-text pairing with lightening (8% lighter) - compensates for icons appearing heavier than text at same color due to stroke density and fill area'
  }
};

/**
 * Array of all blend semantic token names for iteration
 * Total: 7 tokens
 */
export const blendTokenNames = Object.keys(blendTokens);

/**
 * Get blend semantic token by name
 */
export function getBlendToken(name: string): SemanticBlendToken | undefined {
  return blendTokens[name];
}

/**
 * Get all blend semantic tokens as array
 */
export function getAllBlendTokens(): SemanticBlendToken[] {
  return Object.values(blendTokens);
}

/**
 * Validate token count matches spec (7 tokens)
 */
export function validateBlendTokenCount(): boolean {
  const expectedCount = 7;
  const actualCount = blendTokenNames.length;
  if (actualCount !== expectedCount) {
    console.warn(`Blend token count mismatch: expected ${expectedCount}, got ${actualCount}`);
    return false;
  }
  return true;
}

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

