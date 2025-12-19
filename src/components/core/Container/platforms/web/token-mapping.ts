/**
 * Token-to-CSS Mapping Functions
 * 
 * Converts Container component props to CSS custom properties that reference
 * design system tokens. These functions handle the translation from platform-agnostic
 * token names to web-specific CSS custom property format.
 * 
 * Token Format Conversion:
 * - Input: 'space.inset.200' (dot notation)
 * - Output: 'var(--space-inset-200)' (CSS custom property)
 * 
 * @see .kiro/specs/010-container-component/design.md for token consumption strategy
 * @see Requirements 2.1-2.5, 3.1-3.3, 4.1-4.3, 5.1-5.3, 6.1-6.3, 7.1-7.3, 8.1-8.4, 9.1-9.6
 */

import {
  paddingTokenMap,
  borderTokenMap,
  borderRadiusTokenMap,
  layeringTokenMap,
  BORDER_COLOR_TOKEN
} from '../../tokens';
import type {
  PaddingValue,
  BorderValue,
  BorderRadiusValue,
  LayeringValue
} from '../../types';
import type {
  ColorTokenName,
  ShadowTokenName,
  OpacityTokenName
} from '../../../../../types/generated/TokenTypes';

/**
 * Convert token name to CSS custom property format
 * 
 * Transforms dot-notation token names to CSS variable format with var() wrapper:
 * - 'space.inset.200' -> 'var(--space-inset-200)'
 * - 'color.primary' -> 'var(--color-primary)'
 * - 'shadow.container' -> 'var(--shadow-container)'
 * 
 * @param tokenName - Token name in dot notation
 * @returns CSS custom property with var() wrapper
 * 
 * @example
 * ```typescript
 * tokenToCssVar('space.inset.200') // Returns 'var(--space-inset-200)'
 * tokenToCssVar('color.primary') // Returns 'var(--color-primary)'
 * ```
 */
export function tokenToCssVar(tokenName: string): string {
  return `var(--${tokenName.replace(/\./g, '-')})`;
}

/**
 * Map padding value to CSS padding property
 * 
 * Converts padding prop value to CSS padding using space.inset tokens.
 * Returns empty string for 'none' value.
 * 
 * @param padding - Padding prop value
 * @returns CSS padding property or empty string
 * 
 * @example
 * ```typescript
 * mapPaddingToCSS('200') // Returns 'padding: var(--space-inset-200)'
 * mapPaddingToCSS('none') // Returns ''
 * ```
 * 
 * @see Requirements 2.1, 3.1-3.7
 */
export function mapPaddingToCSS(padding: PaddingValue | null): string {
  if (!padding || padding === 'none') {
    return '';
  }

  const tokenName = paddingTokenMap[padding];
  if (!tokenName) {
    return '';
  }

  return `padding: ${tokenToCssVar(tokenName)}`;
}

/**
 * Map border value to CSS border property
 * 
 * Converts border prop value to CSS border using border width tokens
 * and color.border token for border color.
 * Returns empty string for 'none' value.
 * 
 * @param border - Border prop value
 * @returns CSS border property or empty string
 * 
 * @example
 * ```typescript
 * mapBorderToCSS('default') // Returns 'border: var(--border-default) solid var(--color-border)'
 * mapBorderToCSS('none') // Returns ''
 * ```
 * 
 * @see Requirements 2.4, 6.1-6.5
 */
export function mapBorderToCSS(border: BorderValue | null): string {
  if (!border || border === 'none') {
    return '';
  }

  const tokenName = borderTokenMap[border];
  if (!tokenName) {
    return '';
  }

  const widthVar = tokenToCssVar(tokenName);
  const colorVar = tokenToCssVar(BORDER_COLOR_TOKEN);
  return `border: ${widthVar} solid ${colorVar}`;
}

/**
 * Map border radius value to CSS border-radius property
 * 
 * Converts borderRadius prop value to CSS border-radius using radius tokens.
 * Returns empty string for 'none' value.
 * 
 * @param borderRadius - Border radius prop value
 * @returns CSS border-radius property or empty string
 * 
 * @example
 * ```typescript
 * mapBorderRadiusToCSS('normal') // Returns 'border-radius: var(--radius100)'
 * mapBorderRadiusToCSS('none') // Returns ''
 * ```
 * 
 * @see Requirements 2.5, 7.1-7.4
 */
export function mapBorderRadiusToCSS(borderRadius: BorderRadiusValue | null): string {
  if (!borderRadius || borderRadius === 'none') {
    return '';
  }

  const tokenName = borderRadiusTokenMap[borderRadius];
  if (!tokenName) {
    return '';
  }

  return `border-radius: ${tokenToCssVar(tokenName)}`;
}

/**
 * Map color token to CSS background property
 * 
 * Converts background prop value (color token name) to CSS background property.
 * Returns empty string if no color provided.
 * 
 * @param color - Color token name
 * @returns CSS background property or empty string
 * 
 * @example
 * ```typescript
 * mapColorToCSS('color.primary') // Returns 'background: var(--color-primary)'
 * mapColorToCSS('color.surface') // Returns 'background: var(--color-surface)'
 * ```
 * 
 * @see Requirements 2.2, 4.1-4.4
 */
export function mapColorToCSS(color: ColorTokenName | null): string {
  if (!color) {
    return '';
  }

  return `background: ${tokenToCssVar(color)}`;
}

/**
 * Map shadow token to CSS box-shadow property
 * 
 * Converts shadow prop value (shadow token name) to CSS box-shadow property.
 * Returns empty string if no shadow provided.
 * 
 * @param shadow - Shadow token name
 * @returns CSS box-shadow property or empty string
 * 
 * @example
 * ```typescript
 * mapShadowToCSS('shadow.container') // Returns 'box-shadow: var(--shadow-container)'
 * mapShadowToCSS('shadow.modal') // Returns 'box-shadow: var(--shadow-modal)'
 * ```
 * 
 * @see Requirements 2.3, 5.1-5.4
 */
export function mapShadowToCSS(shadow: ShadowTokenName | null): string {
  if (!shadow) {
    return '';
  }

  return `box-shadow: ${tokenToCssVar(shadow)}`;
}

/**
 * Map opacity token to CSS opacity property
 * 
 * Converts opacity prop value (opacity token name) to CSS opacity property.
 * Defaults to opacity.subtle (0.88) when no value provided for cross-platform consistency.
 * 
 * @param opacity - Opacity token name
 * @returns CSS opacity property with token reference
 * 
 * @example
 * ```typescript
 * mapOpacityToCSS('opacity.subtle') // Returns 'opacity: var(--opacity-subtle)'
 * mapOpacityToCSS('opacity.ghost') // Returns 'opacity: var(--opacity-ghost)'
 * mapOpacityToCSS(null) // Returns 'opacity: var(--opacity-subtle)' (default)
 * ```
 * 
 * @see Requirements 8.1-8.4
 * @see Confirmed Action A4 - Web opacity default consistency
 */
export function mapOpacityToCSS(opacity: OpacityTokenName | null): string {
  if (!opacity) {
    return 'opacity: var(--opacity-subtle)';
  }

  return `opacity: ${tokenToCssVar(opacity)}`;
}

/**
 * Map layering value to CSS z-index property
 * 
 * Converts layering prop value to CSS z-index using z-index tokens (web platform).
 * Returns empty string if no layering provided.
 * 
 * Note: Web platform uses z-index tokens for stacking order.
 * Android uses elevation tokens which handle both stacking and shadow.
 * 
 * @param layering - Layering prop value
 * @returns CSS z-index property or empty string
 * 
 * @example
 * ```typescript
 * mapLayeringToCSS('modal') // Returns 'z-index: var(--z-index-modal)'
 * mapLayeringToCSS('navigation') // Returns 'z-index: var(--z-index-navigation)'
 * ```
 * 
 * @see Requirements 9.1-9.9
 */
export function mapLayeringToCSS(layering: LayeringValue | null): string {
  if (!layering) {
    return '';
  }

  const tokenName = layeringTokenMap.web[layering];
  if (!tokenName) {
    return '';
  }

  return `z-index: ${tokenToCssVar(tokenName)}`;
}

/**
 * Build complete CSS styles from Container props
 * 
 * Combines all token-to-CSS mapping functions to generate complete CSS styles
 * for the Container component. Only includes styles for props that are actually set.
 * 
 * @param props - Container props object
 * @returns CSS string with all applicable styles
 * 
 * @example
 * ```typescript
 * buildContainerStyles({
 *   padding: '200',
 *   background: 'color.surface',
 *   shadow: 'shadow.container',
 *   borderRadius: 'normal'
 * })
 * // Returns:
 * // padding: var(--space-inset-200);
 * // background: var(--color-surface);
 * // box-shadow: var(--shadow-container);
 * // border-radius: var(--radius100)
 * ```
 */
export function buildContainerStyles(props: {
  padding?: PaddingValue | null;
  background?: ColorTokenName | null;
  shadow?: ShadowTokenName | null;
  border?: BorderValue | null;
  borderRadius?: BorderRadiusValue | null;
  opacity?: OpacityTokenName | null;
  layering?: LayeringValue | null;
}): string {
  const styles: string[] = [];

  // Map each prop to CSS if provided
  const paddingStyle = mapPaddingToCSS(props.padding ?? null);
  if (paddingStyle) styles.push(paddingStyle);

  const backgroundStyle = mapColorToCSS(props.background ?? null);
  if (backgroundStyle) styles.push(backgroundStyle);

  const shadowStyle = mapShadowToCSS(props.shadow ?? null);
  if (shadowStyle) styles.push(shadowStyle);

  const borderStyle = mapBorderToCSS(props.border ?? null);
  if (borderStyle) styles.push(borderStyle);

  const borderRadiusStyle = mapBorderRadiusToCSS(props.borderRadius ?? null);
  if (borderRadiusStyle) styles.push(borderRadiusStyle);

  const opacityStyle = mapOpacityToCSS(props.opacity ?? null);
  if (opacityStyle) styles.push(opacityStyle);

  const layeringStyle = mapLayeringToCSS(props.layering ?? null);
  if (layeringStyle) styles.push(layeringStyle);

  // Join with semicolons and newlines for readability
  return styles.join(';\n          ');
}
