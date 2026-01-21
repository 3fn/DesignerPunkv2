/**
 * Container-Card-Base Component Type Definitions
 * 
 * Stemma System naming: [Family]-[Type]-[Variant] = Container-Card-Base
 * Type: Type Primitive (Card)
 * 
 * Platform-agnostic TypeScript interfaces for the Container-Card-Base component.
 * These types define a CURATED SUBSET of Container-Base props appropriate for card use cases.
 * 
 * @see .kiro/specs/043-container-card-base/design.md for complete design documentation
 * @see .kiro/specs/034-component-architecture-system for Stemma System details
 */

/**
 * Curated padding values for Container-Card-Base
 * 
 * Subset of Container-Base padding values appropriate for cards:
 * - none: No padding
 * - 100: 8px (space.inset.100)
 * - 150: 12px (space.inset.150) [DEFAULT]
 * - 200: 16px (space.inset.200)
 * 
 * Note: '050', '300', '400' are excluded as they're rarely appropriate for cards.
 */
export type CardPaddingValue = 'none' | '100' | '150' | '200';

/**
 * Curated vertical padding values for Container-Card-Base
 * 
 * Includes '050' for fine-tuning vertical rhythm with typography:
 * - none: No padding
 * - 050: 4px (space.inset.050) - for typography fine-tuning
 * - 100: 8px (space.inset.100)
 * - 150: 12px (space.inset.150)
 * - 200: 16px (space.inset.200)
 */
export type CardVerticalPaddingValue = 'none' | '050' | '100' | '150' | '200';

/**
 * Curated horizontal padding values for Container-Card-Base
 * 
 * Same as CardPaddingValue (excludes '050' as it's rarely needed horizontally):
 * - none: No padding
 * - 100: 8px (space.inset.100)
 * - 150: 12px (space.inset.150)
 * - 200: 16px (space.inset.200)
 */
export type CardHorizontalPaddingValue = 'none' | '100' | '150' | '200';

/**
 * Curated background values for Container-Card-Base
 * 
 * Limited to surface colors appropriate for cards:
 * - surface.primary: Primary surface color [DEFAULT]
 * - surface.secondary: Secondary surface color
 * - surface.tertiary: Tertiary surface color
 */
export type CardBackgroundValue = 'surface.primary' | 'surface.secondary' | 'surface.tertiary';

/**
 * Curated shadow values for Container-Card-Base
 * 
 * Limited to container shadow only:
 * - none: No shadow
 * - container: Container shadow [DEFAULT]
 */
export type CardShadowValue = 'none' | 'container';

/**
 * Curated border values for Container-Card-Base
 * 
 * Limited to subtle border only:
 * - none: No border [DEFAULT]
 * - default: 1px border using borderColor
 */
export type CardBorderValue = 'none' | 'default';

/**
 * Curated border color values for Container-Card-Base
 * 
 * Limited to card-appropriate colors:
 * - border.default: Standard border color [DEFAULT]
 * - border.subtle: Subtle/muted border color
 */
export type CardBorderColorValue = 'border.default' | 'border.subtle';

/**
 * Curated border radius values for Container-Card-Base
 * 
 * Limited to rounded values only (no sharp corners for cards):
 * - normal: 8px (radius-100) [DEFAULT]
 * - loose: 16px (radius-200)
 */
export type CardBorderRadiusValue = 'normal' | 'loose';

/**
 * Curated semantic HTML elements for Container-Card-Base (web only)
 * 
 * Limited to card-appropriate elements:
 * - div: Generic container [DEFAULT]
 * - section: Thematic grouping of content
 * - article: Self-contained composition
 */
export type CardSemanticElement = 'div' | 'section' | 'article';

/**
 * ARIA role for interactive cards
 * 
 * Determines keyboard activation behavior:
 * - button: Enter or Space triggers onPress [DEFAULT]
 * - link: Only Enter triggers onPress (Space scrolls page)
 */
export type CardRole = 'button' | 'link';

/**
 * Container-Card-Base component props interface
 * 
 * Curated subset of Container-Base props appropriate for card use cases.
 * Provides opinionated defaults for zero-config card rendering.
 * 
 * @example
 * ```typescript
 * // Zero-config card (uses all defaults)
 * <container-card-base>
 *   <p>Card content</p>
 * </container-card-base>
 * 
 * // Interactive card
 * <container-card-base interactive="true" accessibility-label="View details">
 *   <h3>Card Title</h3>
 *   <p>Card description</p>
 * </container-card-base>
 * 
 * // Custom styling
 * <container-card-base 
 *   padding="200"
 *   background="surface.secondary"
 *   border="default"
 *   border-color="border.subtle"
 * >
 *   <p>Styled card content</p>
 * </container-card-base>
 * ```
 */
export interface ContainerCardBaseProps {
  // Padding props (curated subset)
  /**
   * Uniform padding for the card
   * @default '150'
   */
  padding?: CardPaddingValue;
  
  /**
   * Vertical (block-axis) padding for the card
   * Includes '050' for fine-tuning typography rhythm
   */
  paddingVertical?: CardVerticalPaddingValue;
  
  /**
   * Horizontal (inline-axis) padding for the card
   */
  paddingHorizontal?: CardHorizontalPaddingValue;
  
  /**
   * Block-start padding for the card
   * Includes '050' for fine-tuning typography rhythm
   */
  paddingBlockStart?: CardVerticalPaddingValue;
  
  /**
   * Block-end padding for the card
   * Includes '050' for fine-tuning typography rhythm
   */
  paddingBlockEnd?: CardVerticalPaddingValue;
  
  /**
   * Inline-start padding for the card
   */
  paddingInlineStart?: CardHorizontalPaddingValue;
  
  /**
   * Inline-end padding for the card
   */
  paddingInlineEnd?: CardHorizontalPaddingValue;
  
  // Visual styling props (curated subset)
  /**
   * Background color for the card
   * @default 'surface.primary'
   */
  background?: CardBackgroundValue;
  
  /**
   * Shadow for the card
   * @default 'container'
   */
  shadow?: CardShadowValue;
  
  /**
   * Border for the card
   * @default 'none'
   */
  border?: CardBorderValue;
  
  /**
   * Border color for the card (only visible when border is 'default')
   * @default 'border.default'
   */
  borderColor?: CardBorderColorValue;
  
  /**
   * Border radius for the card
   * @default 'normal'
   */
  borderRadius?: CardBorderRadiusValue;
  
  // Semantic HTML (web only)
  /**
   * Semantic HTML element to render (web only)
   * @default 'div'
   * @platform web
   */
  semantic?: CardSemanticElement;
  
  // Accessibility
  /**
   * Accessibility label for the card
   */
  accessibilityLabel?: string;
  
  // Card-specific interactivity
  /**
   * Whether the card is interactive
   * When true, enables hover, press, focus, and keyboard activation
   * @default false
   */
  interactive?: boolean;
  
  /**
   * Callback when card is pressed/clicked
   * Only triggered when interactive is true
   */
  onPress?: () => void;
  
  /**
   * ARIA role for interactive cards
   * Determines keyboard activation behavior
   * @default 'button'
   */
  role?: CardRole;
  
  // Standard props
  /**
   * Child content to render inside the card
   */
  children?: any;
  
  /**
   * Test identifier for automated testing
   */
  testID?: string;
}

/**
 * Type guard to check if a value is a valid CardPaddingValue
 */
export function isCardPaddingValue(value: string): value is CardPaddingValue {
  return ['none', '100', '150', '200'].includes(value);
}

/**
 * Type guard to check if a value is a valid CardVerticalPaddingValue
 */
export function isCardVerticalPaddingValue(value: string): value is CardVerticalPaddingValue {
  return ['none', '050', '100', '150', '200'].includes(value);
}

/**
 * Type guard to check if a value is a valid CardHorizontalPaddingValue
 */
export function isCardHorizontalPaddingValue(value: string): value is CardHorizontalPaddingValue {
  return ['none', '100', '150', '200'].includes(value);
}

/**
 * Type guard to check if a value is a valid CardBackgroundValue
 */
export function isCardBackgroundValue(value: string): value is CardBackgroundValue {
  return ['surface.primary', 'surface.secondary', 'surface.tertiary'].includes(value);
}

/**
 * Type guard to check if a value is a valid CardShadowValue
 */
export function isCardShadowValue(value: string): value is CardShadowValue {
  return ['none', 'container'].includes(value);
}

/**
 * Type guard to check if a value is a valid CardBorderValue
 */
export function isCardBorderValue(value: string): value is CardBorderValue {
  return ['none', 'default'].includes(value);
}

/**
 * Type guard to check if a value is a valid CardBorderColorValue
 */
export function isCardBorderColorValue(value: string): value is CardBorderColorValue {
  return ['border.default', 'border.subtle'].includes(value);
}

/**
 * Type guard to check if a value is a valid CardBorderRadiusValue
 */
export function isCardBorderRadiusValue(value: string): value is CardBorderRadiusValue {
  return ['normal', 'loose'].includes(value);
}

/**
 * Type guard to check if a value is a valid CardSemanticElement
 */
export function isCardSemanticElement(value: string): value is CardSemanticElement {
  return ['div', 'section', 'article'].includes(value);
}

/**
 * Type guard to check if a value is a valid CardRole
 */
export function isCardRole(value: string): value is CardRole {
  return ['button', 'link'].includes(value);
}
