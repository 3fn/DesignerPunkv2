/**
 * Container-Base Component Index
 * 
 * Stemma System naming: [Family]-[Type] = Container-Base
 * Type: Primitive (foundational component)
 * 
 * Container-Base is a foundational primitive component that provides structural
 * wrapping with individual styling capabilities. It serves as the building block
 * for semantic components (Card, Panel, Hero) by exposing granular styling props
 * that map to design system tokens.
 * 
 * @see ./README.md for complete documentation
 * @see .kiro/specs/034-component-architecture-system for Stemma System details
 */

// Export types
export type {
  PaddingValue,
  BorderValue,
  BorderRadiusValue,
  LayeringValue,
  SemanticHTMLElement,
  ContainerBaseProps
} from './types';

export {
  isPaddingValue,
  isBorderValue,
  isBorderRadiusValue,
  isLayeringValue,
  isSemanticHTMLElement
} from './types';

// Export tokens
export type { Platform, PlatformTokenMap } from './tokens';

export {
  paddingTokenMap,
  borderTokenMap,
  borderRadiusTokenMap,
  layeringTokenMap,
  getPaddingToken,
  getBorderToken,
  getBorderRadiusToken,
  getLayeringToken,
  BORDER_COLOR_TOKEN
} from './tokens';
