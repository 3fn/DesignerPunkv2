/**
 * Semantic Motion Token Definitions
 * 
 * Motion semantic tokens compose primitive duration, easing, and scale tokens
 * to create complete motion styles for specific animation contexts.
 * 
 * Each motion token explicitly defines animation properties using multi-primitive structure:
 * - duration: Animation timing in milliseconds
 * - easing: Animation curve for acceleration/deceleration
 * - scale (optional): Transform scale factor for size-based animations
 * 
 * Compositional Architecture:
 * Motion tokens follow the same compositional pattern as Shadow and Typography tokens.
 * They reference primitive tokens rather than containing hard-coded values, enabling
 * mathematical consistency and cross-platform generation.
 * 
 * Usage Context:
 * - motion.floatLabel: Text input label floating animation (duration + easing)
 * 
 * Future Expansion:
 * The structure supports incremental expansion as new animation patterns emerge:
 * - Additional semantic motion tokens can be added
 * - New primitive tokens can be referenced
 * - Scale properties can be included for transform-based animations
 */

import { SemanticToken, SemanticCategory } from '../../types/SemanticToken';

/**
 * Motion token interface with primitiveReferences property
 * Follows the same pattern as ShadowTokens and TypographyTokens
 */
interface SemanticMotionToken extends Omit<SemanticToken, 'primitiveTokens'> {
  /** References to primitive motion tokens (duration, easing, scale) */
  primitiveReferences: {
    duration: string;
    easing: string;
    scale?: string;
  };
}

/**
 * Motion semantic tokens for common animation patterns
 * Following compositional architecture with explicit multi-primitive composition
 * 
 * Semantic motion tokens compose primitive duration and easing tokens to create
 * complete animation definitions for specific interaction contexts. Each token
 * represents a common animation pattern used across components.
 */
export const motionTokens: Record<string, SemanticMotionToken> = {
  'motion.floatLabel': {
    name: 'motion.floatLabel',
    primitiveReferences: {
      duration: 'duration250',
      easing: 'easingStandard'
    },
    category: SemanticCategory.INTERACTION,
    context: 'Float label animation for text input fields',
    description: 'Standard motion for label floating up with balanced easing (250ms, standard curve). Used when text input receives focus and label transitions from placeholder to floating position.'
  },
  'motion.focusTransition': {
    name: 'motion.focusTransition',
    primitiveReferences: {
      duration: 'duration150',
      easing: 'easingStandard'
    },
    category: SemanticCategory.INTERACTION,
    context: 'Focus state transitions for interactive elements',
    description: 'Fast motion for focus state changes with balanced easing (150ms, standard curve). Used when elements receive or lose focus, providing quick visual feedback for user interactions.'
  },
  'motion.buttonPress': {
    name: 'motion.buttonPress',
    primitiveReferences: {
      duration: 'duration150',
      easing: 'easingAccelerate'
    },
    category: SemanticCategory.INTERACTION,
    context: 'Button press and release animations',
    description: 'Fast motion for button press feedback with accelerate easing (150ms, accelerate curve). Used for scale transforms during button press, providing immediate tactile response to user input.'
  },
  'motion.modalSlide': {
    name: 'motion.modalSlide',
    primitiveReferences: {
      duration: 'duration350',
      easing: 'easingDecelerate'
    },
    category: SemanticCategory.INTERACTION,
    context: 'Modal and overlay slide animations',
    description: 'Deliberate motion for modal entry with decelerate easing (350ms, decelerate curve). Used when modals, drawers, or overlays slide into view, creating a natural entrance effect that settles into place.'
  },
  'motion.selectionTransition': {
    name: 'motion.selectionTransition',
    primitiveReferences: {
      duration: 'duration250',
      easing: 'easingStandard'
    },
    category: SemanticCategory.INTERACTION,
    context: 'Selection state transitions for selectable elements',
    description: 'Standard motion for selection state changes with balanced easing (250ms, standard curve). Used when selectable elements (buttons, list items, checkboxes) transition between selected/unselected states, providing smooth visual feedback for user selections.'
  }
};

/**
 * Array of all motion semantic token names for iteration
 */
export const motionTokenNames = Object.keys(motionTokens);

/**
 * Get motion semantic token by name
 * 
 * @param name - Token name (e.g., 'motion.floatLabel')
 * @returns Motion token or undefined if not found
 * 
 * @example
 * const floatLabelMotion = getMotionToken('motion.floatLabel');
 * // Returns: { name: 'motion.floatLabel', primitiveReferences: { duration: 'duration250', easing: 'easingStandard' }, ... }
 */
export function getMotionToken(name: string): SemanticMotionToken | undefined {
  return motionTokens[name];
}

/**
 * Get all motion semantic tokens as array
 * 
 * @returns Array of all motion tokens
 * 
 * @example
 * const allMotions = getAllMotionTokens();
 * // Returns: [motion.floatLabel, ...]
 */
export function getAllMotionTokens(): Array<SemanticMotionToken> {
  return Object.values(motionTokens);
}
