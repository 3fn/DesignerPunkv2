/**
 * Avatar Component Token Definitions
 * 
 * Stemma System naming: [Family]-[Type] = Avatar
 * Type: Primitive (foundational component)
 * 
 * Platform-agnostic token definitions for the Avatar component.
 * Uses the defineComponentTokens() API to register tokens with the global
 * ComponentTokenRegistry for pipeline integration.
 * 
 * The build system generates platform-specific values from these definitions:
 * - Web: CSS custom properties (var(--avatar-size-xs))
 * - iOS: Swift constants (AvatarTokens.sizeXs)
 * - Android: Kotlin constants (AvatarTokens.sizeXs)
 * 
 * IMPORTANT: Web Platform Token Strategy
 * The web platform uses CSS calc() with icon tokens to derive avatar sizes,
 * ensuring proper px units and maintaining the mathematical relationship
 * (avatar size = icon size × multiplier). The component tokens defined here
 * are primarily used for:
 * - iOS and Android platforms (which don't use CSS calc())
 * - Documentation and cross-referencing
 * - Maintaining the token chain for traceability
 * 
 * Web CSS Derivations (in Avatar.styles.css):
 * - xs: calc(icon.size050 × 1.5) = 24px
 * - sm: calc(icon.size050 × 2) = 32px
 * - md: calc(icon.size075 × 2) = 40px
 * - lg: calc(icon.size100 × 2) = 48px
 * - xl: calc(icon.size500 × 2) = 80px
 * - xxl: calc(icon.size050 × 8) = 128px
 * 
 * Icon Size Derivations (in Avatar.web.ts):
 * - xs: calc(icon.size050 × 0.75) = 12px
 * - xxl: calc(icon.size050 × 4) = 64px
 * 
 * @see .kiro/specs/042-avatar-component/design.md for token consumption strategy
 * @see .kiro/specs/034-component-architecture-system for Stemma System details
 * @see .kiro/specs/037-component-token-generation-pipeline for pipeline integration
 * @see .kiro/specs/042-avatar-component/requirements.md Requirements 2.1-2.6, 3.1, 3.6
 */

import { defineComponentTokens } from '../../../build/tokens';
import { spacingTokens, SPACING_BASE_VALUE } from '../../../tokens/SpacingTokens';

/**
 * Avatar component tokens defined using the hybrid authoring API.
 * 
 * Each token either references a primitive spacing token or uses a family-conformant
 * derivation, and includes reasoning explaining why the token exists.
 * 
 * NOTE: Web platform uses CSS calc() with icon tokens for sizing (see Avatar.styles.css).
 * These component tokens are primarily used for iOS/Android platforms and documentation.
 * 
 * Size token values:
 * - size.xs: 24px (3 × base, references space300)
 * - size.sm: 32px (4 × base, references space400)
 * - size.md: 40px (5 × base, references space500)
 * - size.lg: 48px (6 × base, references space600)
 * - size.xl: 80px (10 × base, derivation)
 * - size.xxl: 128px (16 × base, derivation)
 * 
 * Icon size token values (gap fillers - web uses calc() instead):
 * - icon.size.xs: 12px (1.5 × base, derivation) - web uses calc(icon.size050 × 0.75)
 * - icon.size.xxl: 64px (8 × base, derivation) - web uses calc(icon.size050 × 4)
 * 
 * @see Requirements 2.1-2.6, 3.1, 3.6 in .kiro/specs/042-avatar-component/requirements.md
 */
export const AvatarTokens = defineComponentTokens({
  component: 'Avatar',
  family: 'spacing',
  tokens: {
    // Size tokens for avatar dimensions
    'size.xs': {
      reference: spacingTokens.space300,
      reasoning: 'Extra small avatar (24px = 3× base) for inline mentions and compact UI contexts where minimal visual footprint is needed',
    },
    'size.sm': {
      reference: spacingTokens.space400,
      reasoning: 'Small avatar (32px = 4× base) for list items and secondary UI contexts with moderate visual presence',
    },
    'size.md': {
      reference: spacingTokens.space500,
      reasoning: 'Medium avatar (40px = 5× base) as the default size, providing balanced visual weight for most UI contexts',
    },
    'size.lg': {
      reference: spacingTokens.space600,
      reasoning: 'Large avatar (48px = 6× base) for profile headers and primary UI contexts requiring prominent visual presence',
    },
    'size.xl': {
      value: SPACING_BASE_VALUE * 10,
      reasoning: 'Extra large avatar (80px = 10× base) for profile pages and hero sections where avatar is a focal point',
    },
    'size.xxl': {
      value: SPACING_BASE_VALUE * 16,
      reasoning: 'Extra extra large avatar (128px = 16× base) for hero profiles and full-page profile views requiring maximum visual impact',
    },
    
    // Icon size tokens (gap fillers for sizes without existing icon tokens)
    // These fill gaps where no standard icon token exists at the required 50% ratio
    'icon.size.xs': {
      value: SPACING_BASE_VALUE * 1.5,
      reasoning: 'Icon size for xs avatar (12px = 1.5× base) maintains 50% ratio (12/24). No existing icon token at this size, so component token fills the gap.',
    },
    'icon.size.xxl': {
      value: SPACING_BASE_VALUE * 8,
      reasoning: 'Icon size for xxl avatar (64px = 8× base) maintains 50% ratio (64/128). No existing icon token at this size, so component token fills the gap.',
    },
  },
});

/**
 * Type for Avatar size variants
 */
export type AvatarSizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

/**
 * Type for Avatar icon size variants (gap fillers only)
 * These are the sizes where no standard icon token exists
 */
export type AvatarIconSizeVariant = 'xs' | 'xxl';

/**
 * Get Avatar size (width/height) value for a given size variant
 * 
 * @param variant - Size variant ('xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl')
 * @returns Size value in pixels
 * 
 * @example
 * ```typescript
 * getAvatarSize('xs')   // Returns 24
 * getAvatarSize('sm')   // Returns 32
 * getAvatarSize('md')   // Returns 40
 * getAvatarSize('lg')   // Returns 48
 * getAvatarSize('xl')   // Returns 80
 * getAvatarSize('xxl')  // Returns 128
 * ```
 * 
 * @see Requirements 2.1-2.6 in .kiro/specs/042-avatar-component/requirements.md
 */
export function getAvatarSize(variant: AvatarSizeVariant): number {
  return AvatarTokens[`size.${variant}`];
}

/**
 * Get Avatar icon size value for gap filler sizes (xs and xxl)
 * 
 * For sizes with existing icon tokens (sm, md, lg, xl), use the standard
 * icon tokens directly (icon.size050, icon.size075, icon.size100, icon.size500).
 * 
 * @param variant - Icon size variant ('xs' | 'xxl')
 * @returns Icon size value in pixels
 * 
 * @example
 * ```typescript
 * getAvatarIconSize('xs')   // Returns 12
 * getAvatarIconSize('xxl')  // Returns 64
 * ```
 * 
 * @see Requirements 3.1, 3.6 in .kiro/specs/042-avatar-component/requirements.md
 */
export function getAvatarIconSize(variant: AvatarIconSizeVariant): number {
  return AvatarTokens[`icon.size.${variant}`];
}

/**
 * Semantic token references for Avatar size values
 * 
 * Maps size variants to their primitive token references or derivation formulas.
 * Used for documentation and cross-referencing with the token system.
 * 
 * @see Requirements 2.1-2.6 in .kiro/specs/042-avatar-component/requirements.md
 */
export const AvatarSizeTokenReferences = {
  /** Extra small size (24px) references space300 */
  xs: 'space300',
  
  /** Small size (32px) references space400 */
  sm: 'space400',
  
  /** Medium size (40px) references space500 */
  md: 'space500',
  
  /** Large size (48px) references space600 */
  lg: 'space600',
  
  /** Extra large size (80px) derivation: SPACING_BASE_VALUE * 10 */
  xl: 'SPACING_BASE_VALUE * 10',
  
  /** Extra extra large size (128px) derivation: SPACING_BASE_VALUE * 16 */
  xxl: 'SPACING_BASE_VALUE * 16',
} as const;

/**
 * Icon size token references for Avatar icon sizes
 * 
 * Maps avatar sizes to their icon size token references.
 * - xs and xxl use component tokens (gap fillers)
 * - sm, md, lg, xl use existing icon tokens
 * 
 * @see Requirements 3.1-3.6 in .kiro/specs/042-avatar-component/requirements.md
 */
export const AvatarIconSizeTokenReferences = {
  /** xs avatar icon (12px) - component token gap filler */
  xs: 'avatar.icon.size.xs',
  
  /** sm avatar icon (16px) - existing icon token */
  sm: 'icon.size050',
  
  /** md avatar icon (20px) - existing icon token */
  md: 'icon.size075',
  
  /** lg avatar icon (24px) - existing icon token */
  lg: 'icon.size100',
  
  /** xl avatar icon (40px) - existing icon token */
  xl: 'icon.size500',
  
  /** xxl avatar icon (64px) - component token gap filler */
  xxl: 'avatar.icon.size.xxl',
} as const;

/**
 * Get the primitive token reference or derivation formula for an Avatar size variant
 * 
 * @param variant - Size variant ('xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl')
 * @returns Primitive token reference name or derivation formula
 * 
 * @example
 * ```typescript
 * getAvatarSizeTokenReference('xs')   // Returns 'space300'
 * getAvatarSizeTokenReference('md')   // Returns 'space500'
 * getAvatarSizeTokenReference('xl')   // Returns 'SPACING_BASE_VALUE * 10'
 * getAvatarSizeTokenReference('xxl')  // Returns 'SPACING_BASE_VALUE * 16'
 * ```
 * 
 * @see Requirements 2.1-2.6 in .kiro/specs/042-avatar-component/requirements.md
 */
export function getAvatarSizeTokenReference(variant: AvatarSizeVariant): string {
  return AvatarSizeTokenReferences[variant];
}

/**
 * Get the icon size token reference for an Avatar size variant
 * 
 * @param variant - Size variant ('xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl')
 * @returns Icon size token reference (component token for xs/xxl, icon token for others)
 * 
 * @example
 * ```typescript
 * getAvatarIconSizeTokenReference('xs')   // Returns 'avatar.icon.size.xs'
 * getAvatarIconSizeTokenReference('sm')   // Returns 'icon.size050'
 * getAvatarIconSizeTokenReference('md')   // Returns 'icon.size075'
 * getAvatarIconSizeTokenReference('lg')   // Returns 'icon.size100'
 * getAvatarIconSizeTokenReference('xl')   // Returns 'icon.size500'
 * getAvatarIconSizeTokenReference('xxl')  // Returns 'avatar.icon.size.xxl'
 * ```
 * 
 * @see Requirements 3.1-3.6 in .kiro/specs/042-avatar-component/requirements.md
 */
export function getAvatarIconSizeTokenReference(variant: AvatarSizeVariant): string {
  return AvatarIconSizeTokenReferences[variant];
}
