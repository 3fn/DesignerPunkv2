/**
 * Button-Icon Component Token References
 * 
 * Stemma System naming: [Family]-[Type] = Button-Icon
 * Type: Primitive (foundational component)
 * 
 * Platform-agnostic token reference mappings for the Button-Icon component.
 * These mappings define which design system tokens the component uses,
 * not how they're implemented per platform.
 * 
 * The build system generates platform-specific values from these references:
 * - Web: CSS custom properties (var(--button-icon-inset-large))
 * - iOS: Swift constants (buttonIconInsetLarge)
 * - Android: Kotlin constants (buttonIconInsetLarge.dp)
 * 
 * Token Relationships:
 * - buttonIcon.inset.large (12px) references space150
 * - buttonIcon.inset.medium (10px) references space125 (strategic flexibility token)
 * - buttonIcon.inset.small (8px) references space100
 * 
 * @see .kiro/specs/035-button-icon-component/design.md for token consumption strategy
 * @see .kiro/specs/034-component-architecture-system for Stemma System details
 */

import { spacingTokens } from '../../../tokens/SpacingTokens';

/**
 * Button-Icon inset (padding) token values
 * 
 * Maps size variants to padding values in pixels.
 * These values reference primitive spacing tokens to maintain mathematical consistency.
 * 
 * Token values:
 * - large: 12px (1.5 × base, references space150)
 * - medium: 10px (1.25 × base, references space125 strategic flexibility token)
 * - small: 8px (1 × base, references space100)
 * 
 * @see Requirements 10.1, 10.2, 10.3
 */
export const ButtonIconTokens = {
  inset: {
    /** Large size padding - references space150 (12px) */
    large: spacingTokens.space150.baseValue,
    
    /** Medium size padding - references space125 strategic flexibility token (10px) */
    medium: spacingTokens.space125.baseValue,
    
    /** Small size padding - references space100 (8px) */
    small: spacingTokens.space100.baseValue,
  },
} as const;

/**
 * Type for Button-Icon inset variants
 */
export type ButtonIconInsetVariant = keyof typeof ButtonIconTokens.inset;

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
  return ButtonIconTokens.inset[variant];
}

/**
 * Semantic token references for Button-Icon inset values
 * 
 * Maps size variants to their semantic token references.
 * Used for documentation and cross-referencing with the token system.
 * 
 * Note: 'medium' has no semantic equivalent - it's a component-specific value.
 */
export const ButtonIconInsetTokenReferences = {
  /** Large size references space.inset.150 */
  large: 'space.inset.150',
  
  /** Medium size has no semantic equivalent (unique component value) */
  medium: null,
  
  /** Small size references space.inset.100 */
  small: 'space.inset.100',
} as const;

/**
 * Get the semantic token reference for a Button-Icon inset variant
 * 
 * @param variant - Size variant ('small' | 'medium' | 'large')
 * @returns Semantic token reference or null if no equivalent exists
 * 
 * @example
 * ```typescript
 * getButtonIconInsetTokenReference('large')  // Returns 'space.inset.150'
 * getButtonIconInsetTokenReference('medium') // Returns null
 * getButtonIconInsetTokenReference('small')  // Returns 'space.inset.100'
 * ```
 */
export function getButtonIconInsetTokenReference(variant: ButtonIconInsetVariant): string | null {
  return ButtonIconInsetTokenReferences[variant];
}
