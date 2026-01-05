/**
 * Button-Icon Component Token Definitions
 * 
 * Stemma System naming: [Family]-[Type] = Button-Icon
 * Type: Primitive (foundational component)
 * 
 * Platform-agnostic token definitions for the Button-Icon component.
 * Uses the defineComponentTokens() API to register tokens with the global
 * ComponentTokenRegistry for pipeline integration.
 * 
 * The build system generates platform-specific values from these definitions:
 * - Web: CSS custom properties (var(--button-icon-inset-large))
 * - iOS: Swift constants (ButtonIconTokens.insetLarge)
 * - Android: Kotlin constants (ButtonIconTokens.insetLarge)
 * 
 * Token Relationships:
 * - buttonIcon.inset.large (12px) references space150
 * - buttonIcon.inset.medium (10px) references space125 (strategic flexibility token)
 * - buttonIcon.inset.small (8px) references space100
 * 
 * @see .kiro/specs/035-button-icon-component/design.md for token consumption strategy
 * @see .kiro/specs/034-component-architecture-system for Stemma System details
 * @see .kiro/specs/037-component-token-generation-pipeline for pipeline integration
 */

import { defineComponentTokens } from '../../../build/tokens';
import { spacingTokens } from '../../../tokens/SpacingTokens';

/**
 * Button-Icon component tokens defined using the hybrid authoring API.
 * 
 * Each token references a primitive spacing token and includes reasoning
 * explaining why the token exists and its purpose in the component.
 * 
 * Token values:
 * - inset.large: 12px (1.5 × base, references space150)
 * - inset.medium: 10px (1.25 × base, references space125 strategic flexibility token)
 * - inset.small: 8px (1 × base, references space100)
 * 
 * @see Requirements 6.1, 6.2, 6.3 in .kiro/specs/037-component-token-generation-pipeline/requirements.md
 */
export const ButtonIconTokens = defineComponentTokens({
  component: 'ButtonIcon',
  family: 'spacing',
  tokens: {
    'inset.large': {
      reference: spacingTokens.space150,
      reasoning: 'Large button variant requires 12px padding (1.5× base) for comfortable touch target and visual balance with larger icon sizes',
    },
    'inset.medium': {
      reference: spacingTokens.space125,
      reasoning: 'Medium button variant uses 10px padding (1.25× base strategic flexibility token) for compact appearance while maintaining adequate touch area',
    },
    'inset.small': {
      reference: spacingTokens.space100,
      reasoning: 'Small button variant uses 8px padding (1× base) for minimal footprint in dense UI layouts while meeting minimum touch target requirements',
    },
  },
});

/**
 * Type for Button-Icon inset variants
 */
export type ButtonIconInsetVariant = 'large' | 'medium' | 'small';

/**
 * Get Button-Icon inset (padding) value for a given size variant
 * 
 * @param variant - Size variant ('small' | 'medium' | 'large')
 * @returns Padding value in pixels
 * 
 * @example
 * ```typescript
 * getButtonIconInset('large')  // Returns 12
 * getButtonIconInset('medium') // Returns 10
 * getButtonIconInset('small')  // Returns 8
 * ```
 */
export function getButtonIconInset(variant: ButtonIconInsetVariant): number {
  return ButtonIconTokens[`inset.${variant}`];
}

/**
 * Semantic token references for Button-Icon inset values
 * 
 * Maps size variants to their primitive token references.
 * Used for documentation and cross-referencing with the token system.
 */
export const ButtonIconInsetTokenReferences = {
  /** Large size references space150 */
  large: 'space150',
  
  /** Medium size references space125 (strategic flexibility token) */
  medium: 'space125',
  
  /** Small size references space100 */
  small: 'space100',
} as const;

/**
 * Get the primitive token reference for a Button-Icon inset variant
 * 
 * @param variant - Size variant ('small' | 'medium' | 'large')
 * @returns Primitive token reference name
 * 
 * @example
 * ```typescript
 * getButtonIconInsetTokenReference('large')  // Returns 'space150'
 * getButtonIconInsetTokenReference('medium') // Returns 'space125'
 * getButtonIconInsetTokenReference('small')  // Returns 'space100'
 * ```
 */
export function getButtonIconInsetTokenReference(variant: ButtonIconInsetVariant): string {
  return ButtonIconInsetTokenReferences[variant];
}
