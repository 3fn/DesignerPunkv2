/**
 * Container-Base Component Token References
 * 
 * Stemma System naming: [Family]-[Type] = Container-Base
 * Type: Primitive (foundational component)
 * 
 * Platform-agnostic token reference mappings for the Container-Base component.
 * These mappings define which design system tokens the component uses,
 * not how they're implemented per platform.
 * 
 * The build system generates platform-specific values from these references:
 * - Web: CSS custom properties (var(--space-inset-200))
 * - iOS: Swift constants (spaceInset200)
 * - Android: Kotlin constants (spaceInset200.dp)
 * 
 * @see .kiro/specs/010-container-component/design.md for token consumption strategy
 * @see .kiro/specs/034-component-architecture-system for Stemma System details
 */

import type { PaddingValue, BorderValue, BorderRadiusValue, LayeringValue } from './types';

/**
 * Platform identifier for token mapping
 */
export type Platform = 'web' | 'ios' | 'android';

/**
 * Padding token mapping
 * 
 * Maps padding prop values to space.inset token names.
 * These tokens follow the 8px baseline grid with mathematical relationships.
 * 
 * Token values:
 * - inset.050: 4px (0.5 × base)
 * - inset.100: 8px (1 × base)
 * - inset.150: 12px (1.5 × base)
 * - inset.200: 16px (2 × base)
 * - inset.300: 24px (3 × base)
 * - inset.400: 32px (4 × base)
 * 
 * @see Requirements 2.1, 3.1-3.7
 */
export const paddingTokenMap: Record<PaddingValue, string> = {
  'none': '',
  '050': 'space.inset.050',
  '100': 'space.inset.100',
  '150': 'space.inset.150',
  '200': 'space.inset.200',
  '300': 'space.inset.300',
  '400': 'space.inset.400'
};

/**
 * Border token mapping
 * 
 * Maps border prop values to border width token names.
 * Border color is always color.border token.
 * 
 * Token values:
 * - border.border.default: 1px
 * - border.border.emphasis: 2px
 * - border.border.heavy: 4px
 * 
 * Note: The double "border" in the token name (border.border.default) is intentional.
 * The first "border" is the category prefix, the second is part of the semantic name.
 * This converts to CSS custom property: --border-default
 * 
 * @see Requirements 2.4, 6.1-6.5
 */
export const borderTokenMap: Record<BorderValue, string> = {
  'none': '',
  'default': 'border.border.default',
  'emphasis': 'border.border.emphasis',
  'heavy': 'border.border.heavy'
};

/**
 * Border radius token mapping
 * 
 * Maps borderRadius prop values to radius token names.
 * 
 * Token values:
 * - radius-050: 4px
 * - radius-100: 8px
 * - radius-200: 16px
 * 
 * @see Requirements 2.5, 7.1-7.4
 */
export const borderRadiusTokenMap: Record<BorderRadiusValue, string> = {
  'none': '',
  'tight': 'radius-050',
  'normal': 'radius-100',
  'loose': 'radius-200'
};

/**
 * Platform-specific token mapping structure
 * 
 * Allows different token references per platform.
 * Used for layering tokens where web/iOS use z-index and Android uses elevation.
 */
export interface PlatformTokenMap {
  web: Record<string, string>;
  ios: Record<string, string>;
  android: Record<string, string>;
}

/**
 * Layering token mapping (platform-specific)
 * 
 * Maps layering prop values to platform-specific stacking tokens:
 * - Web/iOS: z-index tokens (control stacking order only)
 * - Android: elevation tokens (control both stacking order and shadow rendering)
 * 
 * Z-Index token values (web/iOS):
 * - zIndex.container: 100
 * - zIndex.navigation: 200
 * - zIndex.dropdown: 300
 * - zIndex.modal: 400
 * - zIndex.toast: 500
 * - zIndex.tooltip: 600
 * 
 * Elevation token values (Android):
 * - elevation.container: 8dp
 * - elevation.navigation: 4dp
 * - elevation.dropdown: 8dp
 * - elevation.modal: 16dp
 * - elevation.toast: 24dp
 * - elevation.tooltip: 24dp
 * 
 * Note: Android elevation tokens couple stacking order with shadow rendering,
 * following Material Design guidelines. If both layering and shadow props are
 * provided on Android, layering takes precedence.
 * 
 * @see Requirements 9.1-9.9, 16.2-16.3
 */
export const layeringTokenMap: PlatformTokenMap = {
  web: {
    'container': 'zIndex.container',
    'navigation': 'zIndex.navigation',
    'dropdown': 'zIndex.dropdown',
    'modal': 'zIndex.modal',
    'toast': 'zIndex.toast',
    'tooltip': 'zIndex.tooltip'
  },
  ios: {
    'container': 'zIndex.container',
    'navigation': 'zIndex.navigation',
    'dropdown': 'zIndex.dropdown',
    'modal': 'zIndex.modal',
    'toast': 'zIndex.toast',
    'tooltip': 'zIndex.tooltip'
  },
  android: {
    'container': 'elevation.container',
    'navigation': 'elevation.navigation',
    'dropdown': 'elevation.dropdown',
    'modal': 'elevation.modal',
    'toast': 'elevation.toast',
    'tooltip': 'elevation.tooltip'
  }
};

/**
 * Get padding token name for a given padding value
 * 
 * @param padding - Padding prop value
 * @returns Token name or empty string for 'none'
 * 
 * @example
 * ```typescript
 * getPaddingToken('200') // Returns 'space.inset.200'
 * getPaddingToken('none') // Returns ''
 * ```
 */
export function getPaddingToken(padding: PaddingValue): string {
  return paddingTokenMap[padding];
}

/**
 * Get border token name for a given border value
 * 
 * @param border - Border prop value
 * @returns Token name or empty string for 'none'
 * 
 * @example
 * ```typescript
 * getBorderToken('default') // Returns 'border.border.default'
 * getBorderToken('none') // Returns ''
 * ```
 */
export function getBorderToken(border: BorderValue): string {
  return borderTokenMap[border];
}

/**
 * Get border radius token name for a given border radius value
 * 
 * @param borderRadius - Border radius prop value
 * @returns Token name or empty string for 'none'
 * 
 * @example
 * ```typescript
 * getBorderRadiusToken('normal') // Returns 'radius-100'
 * getBorderRadiusToken('none') // Returns ''
 * ```
 */
export function getBorderRadiusToken(borderRadius: BorderRadiusValue): string {
  return borderRadiusTokenMap[borderRadius];
}

/**
 * Get layering token name for a given layering value and platform
 * 
 * Returns platform-specific token name:
 * - Web/iOS: z-index token
 * - Android: elevation token
 * 
 * @param layering - Layering prop value
 * @param platform - Target platform
 * @returns Token name for the specified platform
 * 
 * @example
 * ```typescript
 * getLayeringToken('modal', 'web') // Returns 'zIndex.modal'
 * getLayeringToken('modal', 'android') // Returns 'elevation.modal'
 * ```
 */
export function getLayeringToken(layering: LayeringValue, platform: Platform): string {
  return layeringTokenMap[platform][layering];
}

/**
 * Border color token constant
 * 
 * All borders use the same semantic color token for consistency.
 * This ensures borders have consistent appearance across the design system.
 * 
 * @see Requirements 6.5
 */
export const BORDER_COLOR_TOKEN = 'color.border';
