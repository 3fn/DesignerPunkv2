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
 * - Web: CSS custom properties (var(--buttonicon-inset-large))
 * - iOS: Swift constants (ButtonIconTokens.insetLarge)
 * - Android: Kotlin constants (ButtonIconTokens.insetLarge)
 * 
 * Token Relationships:
 * - buttonIcon.inset.large (12px) references space150
 * - buttonIcon.inset.medium (10px) references space125 (strategic flexibility token)
 * - buttonIcon.inset.small (8px) references space100
 * - buttonIcon.size.large (48px) references space600
 * - buttonIcon.size.medium (40px) references space500
 * - buttonIcon.size.small (32px) references space400
 * 
 * @see .kiro/specs/035-button-icon-component/design.md for token consumption strategy
 * @see .kiro/specs/034-component-architecture-system for Stemma System details
 * @see .kiro/specs/037-component-token-generation-pipeline for pipeline integration
 * @see .kiro/specs/040-component-alignment/requirements.md Requirements 6.1, 6.2, 6.3
 */

import { defineComponentTokens } from '../../../build/tokens';
import { spacingTokens } from '../../../tokens/SpacingTokens';

/**
 * Button-Icon component tokens defined using the hybrid authoring API.
 * 
 * Each token references a primitive spacing token and includes reasoning
 * explaining why the token exists and its purpose in the component.
 * 
 * Inset (padding) token values:
 * - inset.large: 12px (1.5 × base, references space150)
 * - inset.medium: 10px (1.25 × base, references space125 strategic flexibility token)
 * - inset.small: 8px (1 × base, references space100)
 * 
 * Size (width/height) token values:
 * - size.large: 48px (6 × base, references space600)
 * - size.medium: 40px (5 × base, references space500)
 * - size.small: 32px (4 × base, references space400)
 * 
 * @see Requirements 6.1, 6.2, 6.3 in .kiro/specs/040-component-alignment/requirements.md
 */
export const ButtonIconTokens = defineComponentTokens({
  component: 'ButtonIcon',
  family: 'spacing',
  tokens: {
    // Inset (padding) tokens
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
    // Size (width/height) tokens - @see Requirements 6.1, 6.2, 6.3
    'size.large': {
      reference: spacingTokens.space600,
      reasoning: 'Large button size (48px = 6× base) provides generous touch target exceeding tapAreaRecommended, calculated as icon (24px) + padding (12px × 2)',
    },
    'size.medium': {
      reference: spacingTokens.space500,
      reasoning: 'Medium button size (40px = 5× base) provides standard touch target, calculated as icon (18px) + padding (10px × 2) rounded to grid',
    },
    'size.small': {
      reference: spacingTokens.space400,
      reasoning: 'Small button size (32px = 4× base) provides compact visual footprint, calculated as icon (13px) + padding (8px × 2) rounded to grid',
    },
  },
});

/**
 * Type for Button-Icon inset variants
 */
export type ButtonIconInsetVariant = 'large' | 'medium' | 'small';

/**
 * Type for Button-Icon size variants
 */
export type ButtonIconSizeVariant = 'large' | 'medium' | 'small';

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
 * Get Button-Icon size (width/height) value for a given size variant
 * 
 * @param variant - Size variant ('small' | 'medium' | 'large')
 * @returns Size value in pixels
 * 
 * @example
 * ```typescript
 * getButtonIconSize('large')  // Returns 48
 * getButtonIconSize('medium') // Returns 40
 * getButtonIconSize('small')  // Returns 32
 * ```
 * 
 * @see Requirements 6.1, 6.2, 6.3 in .kiro/specs/040-component-alignment/requirements.md
 */
export function getButtonIconSize(variant: ButtonIconSizeVariant): number {
  return ButtonIconTokens[`size.${variant}`];
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
 * Semantic token references for Button-Icon size values
 * 
 * Maps size variants to their primitive token references.
 * Used for documentation and cross-referencing with the token system.
 * 
 * @see Requirements 6.1, 6.2, 6.3 in .kiro/specs/040-component-alignment/requirements.md
 */
export const ButtonIconSizeTokenReferences = {
  /** Large size (48px) references space600 */
  large: 'space600',
  
  /** Medium size (40px) references space500 */
  medium: 'space500',
  
  /** Small size (32px) references space400 */
  small: 'space400',
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

/**
 * Get the primitive token reference for a Button-Icon size variant
 * 
 * @param variant - Size variant ('small' | 'medium' | 'large')
 * @returns Primitive token reference name
 * 
 * @example
 * ```typescript
 * getButtonIconSizeTokenReference('large')  // Returns 'space600'
 * getButtonIconSizeTokenReference('medium') // Returns 'space500'
 * getButtonIconSizeTokenReference('small')  // Returns 'space400'
 * ```
 * 
 * @see Requirements 6.1, 6.2, 6.3 in .kiro/specs/040-component-alignment/requirements.md
 */
export function getButtonIconSizeTokenReference(variant: ButtonIconSizeVariant): string {
  return ButtonIconSizeTokenReferences[variant];
}
