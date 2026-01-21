/**
 * Container-Card-Base Component Index
 * 
 * Stemma System naming: [Family]-[Type]-[Variant] = Container-Card-Base
 * Type: Type Primitive (Card)
 * 
 * Container-Card-Base is a type primitive component that provides card-specific
 * styling and behaviors. It uses Container-Base internally via composition and
 * exposes a curated subset of props appropriate for card use cases.
 * 
 * @see ./README.md for complete documentation
 * @see .kiro/specs/043-container-card-base for design specification
 * @see .kiro/specs/034-component-architecture-system for Stemma System details
 */

// Export types
export type {
  CardPaddingValue,
  CardVerticalPaddingValue,
  CardHorizontalPaddingValue,
  CardBackgroundValue,
  CardShadowValue,
  CardBorderValue,
  CardBorderColorValue,
  CardBorderRadiusValue,
  CardSemanticElement,
  CardRole,
  ContainerCardBaseProps
} from './types';

export {
  isCardPaddingValue,
  isCardVerticalPaddingValue,
  isCardHorizontalPaddingValue,
  isCardBackgroundValue,
  isCardShadowValue,
  isCardBorderValue,
  isCardBorderColorValue,
  isCardBorderRadiusValue,
  isCardSemanticElement,
  isCardRole
} from './types';

// Export tokens
export {
  cardPaddingTokenMap,
  cardVerticalPaddingTokenMap,
  cardHorizontalPaddingTokenMap,
  cardBackgroundTokenMap,
  cardShadowTokenMap,
  cardBorderTokenMap,
  cardBorderColorTokenMap,
  cardBorderRadiusTokenMap,
  cardDefaultTokens,
  cardInteractionTokens,
  getCardPaddingToken,
  getCardVerticalPaddingToken,
  getCardHorizontalPaddingToken,
  getCardBackgroundToken,
  getCardShadowToken,
  getCardBorderToken,
  getCardBorderColorToken,
  getCardBorderRadiusToken
} from './tokens';
