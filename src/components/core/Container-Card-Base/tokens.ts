/**
 * Container-Card-Base Component Token References
 * 
 * Stemma System naming: [Family]-[Type]-[Variant] = Container-Card-Base
 * Type: Type Primitive (Card)
 * 
 * Token reference mappings for the Container-Card-Base component.
 * These mappings define which design system tokens the component uses.
 * 
 * Container-Card-Base uses a CURATED SUBSET of Container-Base tokens,
 * plus card-specific interaction tokens (blend, motion).
 * 
 * @see .kiro/specs/043-container-card-base/design.md for token consumption strategy
 * @see .kiro/specs/034-component-architecture-system for Stemma System details
 */

import type {
  CardPaddingValue,
  CardVerticalPaddingValue,
  CardHorizontalPaddingValue,
  CardBackgroundValue,
  CardShadowValue,
  CardBorderValue,
  CardBorderColorValue,
  CardBorderRadiusValue
} from './types';

/**
 * Card padding token mapping
 * 
 * Maps card padding prop values to space.inset token names.
 * Curated subset of Container-Base padding tokens.
 * 
 * @see Requirements 3.1, 4.1
 */
export const cardPaddingTokenMap: Record<CardPaddingValue, string> = {
  'none': '',
  '100': 'space.inset.100',
  '150': 'space.inset.150',
  '200': 'space.inset.200'
};

/**
 * Card vertical padding token mapping
 * 
 * Includes '050' for fine-tuning vertical rhythm with typography.
 * 
 * @see Requirements 3.2, 3.4, 3.5
 */
export const cardVerticalPaddingTokenMap: Record<CardVerticalPaddingValue, string> = {
  'none': '',
  '050': 'space.inset.050',
  '100': 'space.inset.100',
  '150': 'space.inset.150',
  '200': 'space.inset.200'
};

/**
 * Card horizontal padding token mapping
 * 
 * Same values as cardPaddingTokenMap (excludes '050').
 * 
 * @see Requirements 3.3, 3.6, 3.7
 */
export const cardHorizontalPaddingTokenMap: Record<CardHorizontalPaddingValue, string> = {
  'none': '',
  '100': 'space.inset.100',
  '150': 'space.inset.150',
  '200': 'space.inset.200'
};

/**
 * Card background token mapping
 * 
 * Maps card background prop values to color.surface token names.
 * 
 * @see Requirements 3.8, 4.2
 */
export const cardBackgroundTokenMap: Record<CardBackgroundValue, string> = {
  'surface.primary': 'color.surface.primary',
  'surface.secondary': 'color.surface.secondary',
  'surface.tertiary': 'color.surface.tertiary'
};

/**
 * Card shadow token mapping
 * 
 * Maps card shadow prop values to shadow token names.
 * 
 * @see Requirements 3.9, 4.3
 */
export const cardShadowTokenMap: Record<CardShadowValue, string> = {
  'none': '',
  'container': 'shadow.container'
};

/**
 * Card border token mapping
 * 
 * Maps card border prop values to border width token names.
 * 
 * @see Requirements 3.10, 4.4
 */
export const cardBorderTokenMap: Record<CardBorderValue, string> = {
  'none': '',
  'default': 'border.border.default'
};

/**
 * Card border color token mapping
 * 
 * Maps card border color prop values to color.border token names.
 * 
 * @see Requirements 3.11
 */
export const cardBorderColorTokenMap: Record<CardBorderColorValue, string> = {
  'border.default': 'color.border.default',
  'border.subtle': 'color.border.subtle'
};

/**
 * Card border radius token mapping
 * 
 * Maps card border radius prop values to radius token names.
 * Only rounded values (no 'none' or 'tight' for cards).
 * 
 * @see Requirements 3.12, 4.5
 */
export const cardBorderRadiusTokenMap: Record<CardBorderRadiusValue, string> = {
  'normal': 'radius-100',
  'loose': 'radius-200'
};

/**
 * Default token values for Container-Card-Base
 * 
 * These are the opinionated defaults that make zero-config cards look good.
 * 
 * @see Requirements 4.1-4.7
 */
export const cardDefaultTokens = {
  /** Default padding: space.inset.150 (12px) */
  padding: 'space.inset.150',
  /** Default background: color.surface.primary */
  background: 'color.surface.primary',
  /** Default shadow: shadow.container */
  shadow: 'shadow.container',
  /** Default border radius: radius-100 (8px) */
  borderRadius: 'radius-100',
  /** Default border color: color.border.default */
  borderColor: 'color.border.default'
} as const;

/**
 * Interaction token values for Container-Card-Base
 * 
 * These tokens control hover, press, and focus state styling.
 * 
 * @see Requirements 5.1-5.10
 */
export const cardInteractionTokens = {
  /** Hover feedback: blend.hoverDarker (8% darker) */
  hoverDarker: 'blend.hoverDarker',
  /** Press feedback: blend.pressedDarker (12% darker) */
  pressedDarker: 'blend.pressedDarker',
  /** Focus transition: motion.focusTransition (150ms ease-out) */
  focusTransition: 'motion.focusTransition'
} as const;

/**
 * Get padding token name for a given card padding value
 */
export function getCardPaddingToken(padding: CardPaddingValue): string {
  return cardPaddingTokenMap[padding];
}

/**
 * Get vertical padding token name for a given card vertical padding value
 */
export function getCardVerticalPaddingToken(padding: CardVerticalPaddingValue): string {
  return cardVerticalPaddingTokenMap[padding];
}

/**
 * Get horizontal padding token name for a given card horizontal padding value
 */
export function getCardHorizontalPaddingToken(padding: CardHorizontalPaddingValue): string {
  return cardHorizontalPaddingTokenMap[padding];
}

/**
 * Get background token name for a given card background value
 */
export function getCardBackgroundToken(background: CardBackgroundValue): string {
  return cardBackgroundTokenMap[background];
}

/**
 * Get shadow token name for a given card shadow value
 */
export function getCardShadowToken(shadow: CardShadowValue): string {
  return cardShadowTokenMap[shadow];
}

/**
 * Get border token name for a given card border value
 */
export function getCardBorderToken(border: CardBorderValue): string {
  return cardBorderTokenMap[border];
}

/**
 * Get border color token name for a given card border color value
 */
export function getCardBorderColorToken(borderColor: CardBorderColorValue): string {
  return cardBorderColorTokenMap[borderColor];
}

/**
 * Get border radius token name for a given card border radius value
 */
export function getCardBorderRadiusToken(borderRadius: CardBorderRadiusValue): string {
  return cardBorderRadiusTokenMap[borderRadius];
}
