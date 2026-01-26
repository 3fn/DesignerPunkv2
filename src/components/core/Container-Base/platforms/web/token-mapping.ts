/**
 * Container-Base Token-to-CSS Mapping Functions
 * 
 * Stemma System naming: [Family]-[Type] = Container-Base
 * Type: Primitive (foundational component)
 * 
 * Converts Container-Base component props to CSS custom properties that reference
 * design system tokens. These functions handle the translation from platform-agnostic
 * token names to web-specific CSS custom property format.
 * 
 * Token Format Conversion:
 * - Input: 'space.inset.200' (dot notation)
 * - Output: 'var(--space-inset-200)' (CSS custom property)
 * 
 * Directional Padding Support:
 * Uses CSS logical properties for internationalization (RTL support):
 * - padding-block: vertical axis (top/bottom)
 * - padding-inline: horizontal axis (left/right in LTR, right/left in RTL)
 * - padding-block-start, padding-block-end: individual vertical edges
 * - padding-inline-start, padding-inline-end: individual horizontal edges
 * 
 * Override Hierarchy (highest to lowest priority):
 * 1. Individual edges (paddingBlockStart, paddingBlockEnd, paddingInlineStart, paddingInlineEnd)
 * 2. Axis props (paddingVertical, paddingHorizontal)
 * 3. Uniform padding (padding prop)
 * 
 * @see .kiro/specs/010-container-component/design.md for token consumption strategy
 * @see .kiro/specs/034-component-architecture-system for Stemma System details
 * @see .kiro/specs/043-container-card-base for directional padding requirements
 * @see Requirements 1.1-1.10, 2.1-2.5, 3.1-3.3, 4.1-4.3, 5.1-5.3, 6.1-6.3, 7.1-7.3, 8.1-8.4, 9.1-9.6
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
 * Map paddingVertical value to CSS padding-block property
 * 
 * Converts paddingVertical prop value to CSS padding-block using space.inset tokens.
 * Uses CSS logical property for internationalization support.
 * Returns empty string for 'none' value or if not provided.
 * 
 * @param paddingVertical - Padding vertical prop value
 * @returns CSS padding-block property or empty string
 * 
 * @example
 * ```typescript
 * mapPaddingVerticalToCSS('200') // Returns 'padding-block: var(--space-inset-200)'
 * mapPaddingVerticalToCSS('none') // Returns ''
 * ```
 * 
 * @see Requirements 1.1, 1.7, 1.10
 */
export function mapPaddingVerticalToCSS(paddingVertical: PaddingValue | null): string {
  if (!paddingVertical || paddingVertical === 'none') {
    return '';
  }

  const tokenName = paddingTokenMap[paddingVertical];
  if (!tokenName) {
    return '';
  }

  return `padding-block: ${tokenToCssVar(tokenName)}`;
}

/**
 * Map paddingHorizontal value to CSS padding-inline property
 * 
 * Converts paddingHorizontal prop value to CSS padding-inline using space.inset tokens.
 * Uses CSS logical property for internationalization support (RTL).
 * Returns empty string for 'none' value or if not provided.
 * 
 * @param paddingHorizontal - Padding horizontal prop value
 * @returns CSS padding-inline property or empty string
 * 
 * @example
 * ```typescript
 * mapPaddingHorizontalToCSS('200') // Returns 'padding-inline: var(--space-inset-200)'
 * mapPaddingHorizontalToCSS('none') // Returns ''
 * ```
 * 
 * @see Requirements 1.2, 1.7, 1.10
 */
export function mapPaddingHorizontalToCSS(paddingHorizontal: PaddingValue | null): string {
  if (!paddingHorizontal || paddingHorizontal === 'none') {
    return '';
  }

  const tokenName = paddingTokenMap[paddingHorizontal];
  if (!tokenName) {
    return '';
  }

  return `padding-inline: ${tokenToCssVar(tokenName)}`;
}

/**
 * Map paddingBlockStart value to CSS padding-block-start property
 * 
 * Converts paddingBlockStart prop value to CSS padding-block-start using space.inset tokens.
 * Uses CSS logical property for internationalization support.
 * Returns empty string for 'none' value or if not provided.
 * 
 * @param paddingBlockStart - Padding block start prop value
 * @returns CSS padding-block-start property or empty string
 * 
 * @example
 * ```typescript
 * mapPaddingBlockStartToCSS('200') // Returns 'padding-block-start: var(--space-inset-200)'
 * mapPaddingBlockStartToCSS('none') // Returns ''
 * ```
 * 
 * @see Requirements 1.3, 1.8, 1.10
 */
export function mapPaddingBlockStartToCSS(paddingBlockStart: PaddingValue | null): string {
  if (!paddingBlockStart || paddingBlockStart === 'none') {
    return '';
  }

  const tokenName = paddingTokenMap[paddingBlockStart];
  if (!tokenName) {
    return '';
  }

  return `padding-block-start: ${tokenToCssVar(tokenName)}`;
}

/**
 * Map paddingBlockEnd value to CSS padding-block-end property
 * 
 * Converts paddingBlockEnd prop value to CSS padding-block-end using space.inset tokens.
 * Uses CSS logical property for internationalization support.
 * Returns empty string for 'none' value or if not provided.
 * 
 * @param paddingBlockEnd - Padding block end prop value
 * @returns CSS padding-block-end property or empty string
 * 
 * @example
 * ```typescript
 * mapPaddingBlockEndToCSS('200') // Returns 'padding-block-end: var(--space-inset-200)'
 * mapPaddingBlockEndToCSS('none') // Returns ''
 * ```
 * 
 * @see Requirements 1.4, 1.8, 1.10
 */
export function mapPaddingBlockEndToCSS(paddingBlockEnd: PaddingValue | null): string {
  if (!paddingBlockEnd || paddingBlockEnd === 'none') {
    return '';
  }

  const tokenName = paddingTokenMap[paddingBlockEnd];
  if (!tokenName) {
    return '';
  }

  return `padding-block-end: ${tokenToCssVar(tokenName)}`;
}

/**
 * Map paddingInlineStart value to CSS padding-inline-start property
 * 
 * Converts paddingInlineStart prop value to CSS padding-inline-start using space.inset tokens.
 * Uses CSS logical property for internationalization support (RTL).
 * Returns empty string for 'none' value or if not provided.
 * 
 * @param paddingInlineStart - Padding inline start prop value
 * @returns CSS padding-inline-start property or empty string
 * 
 * @example
 * ```typescript
 * mapPaddingInlineStartToCSS('200') // Returns 'padding-inline-start: var(--space-inset-200)'
 * mapPaddingInlineStartToCSS('none') // Returns ''
 * ```
 * 
 * @see Requirements 1.5, 1.8, 1.10
 */
export function mapPaddingInlineStartToCSS(paddingInlineStart: PaddingValue | null): string {
  if (!paddingInlineStart || paddingInlineStart === 'none') {
    return '';
  }

  const tokenName = paddingTokenMap[paddingInlineStart];
  if (!tokenName) {
    return '';
  }

  return `padding-inline-start: ${tokenToCssVar(tokenName)}`;
}

/**
 * Map paddingInlineEnd value to CSS padding-inline-end property
 * 
 * Converts paddingInlineEnd prop value to CSS padding-inline-end using space.inset tokens.
 * Uses CSS logical property for internationalization support (RTL).
 * Returns empty string for 'none' value or if not provided.
 * 
 * @param paddingInlineEnd - Padding inline end prop value
 * @returns CSS padding-inline-end property or empty string
 * 
 * @example
 * ```typescript
 * mapPaddingInlineEndToCSS('200') // Returns 'padding-inline-end: var(--space-inset-200)'
 * mapPaddingInlineEndToCSS('none') // Returns ''
 * ```
 * 
 * @see Requirements 1.6, 1.8, 1.10
 */
export function mapPaddingInlineEndToCSS(paddingInlineEnd: PaddingValue | null): string {
  if (!paddingInlineEnd || paddingInlineEnd === 'none') {
    return '';
  }

  const tokenName = paddingTokenMap[paddingInlineEnd];
  if (!tokenName) {
    return '';
  }

  return `padding-inline-end: ${tokenToCssVar(tokenName)}`;
}

/**
 * Map border value to CSS border property
 * 
 * Converts border prop value to CSS border using border width tokens
 * and optional borderColor token for border color.
 * Returns empty string for 'none' value.
 * 
 * @param border - Border prop value
 * @param borderColor - Optional border color token name
 * @returns CSS border property or empty string
 * 
 * @example
 * ```typescript
 * mapBorderToCSS('default') // Returns 'border: var(--border-default) solid var(--color-border)'
 * mapBorderToCSS('default', 'color.structure.border.subtle') // Returns 'border: var(--border-default) solid var(--color-structure-border-subtle)'
 * mapBorderToCSS('none') // Returns ''
 * ```
 * 
 * @see Requirements 2.1, 2.2, 2.3, 6.1-6.5
 */
export function mapBorderToCSS(border: BorderValue | null, borderColor?: ColorTokenName | null): string {
  if (!border || border === 'none') {
    return '';
  }

  const tokenName = borderTokenMap[border];
  if (!tokenName) {
    return '';
  }

  const widthVar = tokenToCssVar(tokenName);
  // Use provided borderColor or default to BORDER_COLOR_TOKEN
  const colorVar = borderColor ? tokenToCssVar(borderColor) : tokenToCssVar(BORDER_COLOR_TOKEN);
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
 * mapBorderRadiusToCSS('normal') // Returns 'border-radius: var(--radius-100)'
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
 * Build complete CSS styles from Container-Base props
 * 
 * Combines all token-to-CSS mapping functions to generate complete CSS styles
 * for the Container-Base component. Only includes styles for props that are actually set.
 * 
 * Padding Override Hierarchy (CSS cascade order):
 * 1. Uniform padding (padding prop) - applied first as base
 * 2. Axis props (paddingVertical, paddingHorizontal) - override uniform for their axis
 * 3. Individual edges (paddingBlockStart, etc.) - override axis props for their edge
 * 
 * CSS logical properties are used for internationalization (RTL support):
 * - padding-block: vertical axis
 * - padding-inline: horizontal axis
 * - padding-block-start, padding-block-end: individual vertical edges
 * - padding-inline-start, padding-inline-end: individual horizontal edges
 * 
 * @param props - Container-Base props object
 * @returns CSS string with all applicable styles
 * 
 * @example
 * ```typescript
 * buildContainerBaseStyles({
 *   padding: '200',
 *   paddingVertical: '100',
 *   paddingBlockStart: '050',
 *   background: 'color.surface',
 *   shadow: 'shadow.container',
 *   borderRadius: 'normal'
 * })
 * // Returns:
 * // padding: var(--space-inset-200);
 * // padding-block: var(--space-inset-100);
 * // padding-block-start: var(--space-inset-050);
 * // background: var(--color-surface);
 * // box-shadow: var(--shadow-container);
 * // border-radius: var(--radius-100)
 * ```
 * 
 * @see Requirements 1.1-1.10, 2.1-2.3
 */
export function buildContainerBaseStyles(props: {
  padding?: PaddingValue | null;
  paddingVertical?: PaddingValue | null;
  paddingHorizontal?: PaddingValue | null;
  paddingBlockStart?: PaddingValue | null;
  paddingBlockEnd?: PaddingValue | null;
  paddingInlineStart?: PaddingValue | null;
  paddingInlineEnd?: PaddingValue | null;
  background?: ColorTokenName | null;
  shadow?: ShadowTokenName | null;
  border?: BorderValue | null;
  borderColor?: ColorTokenName | null;
  borderRadius?: BorderRadiusValue | null;
  opacity?: OpacityTokenName | null;
  layering?: LayeringValue | null;
}): string {
  const styles: string[] = [];

  // Padding hierarchy: uniform -> axis -> individual edges
  // CSS cascade handles override order naturally when properties are applied in this sequence
  
  // 1. Uniform padding (lowest priority - base)
  const paddingStyle = mapPaddingToCSS(props.padding ?? null);
  if (paddingStyle) styles.push(paddingStyle);

  // 2. Axis props (override uniform for their axis)
  const paddingVerticalStyle = mapPaddingVerticalToCSS(props.paddingVertical ?? null);
  if (paddingVerticalStyle) styles.push(paddingVerticalStyle);

  const paddingHorizontalStyle = mapPaddingHorizontalToCSS(props.paddingHorizontal ?? null);
  if (paddingHorizontalStyle) styles.push(paddingHorizontalStyle);

  // 3. Individual edges (highest priority - override axis props)
  const paddingBlockStartStyle = mapPaddingBlockStartToCSS(props.paddingBlockStart ?? null);
  if (paddingBlockStartStyle) styles.push(paddingBlockStartStyle);

  const paddingBlockEndStyle = mapPaddingBlockEndToCSS(props.paddingBlockEnd ?? null);
  if (paddingBlockEndStyle) styles.push(paddingBlockEndStyle);

  const paddingInlineStartStyle = mapPaddingInlineStartToCSS(props.paddingInlineStart ?? null);
  if (paddingInlineStartStyle) styles.push(paddingInlineStartStyle);

  const paddingInlineEndStyle = mapPaddingInlineEndToCSS(props.paddingInlineEnd ?? null);
  if (paddingInlineEndStyle) styles.push(paddingInlineEndStyle);

  // Visual styling
  const backgroundStyle = mapColorToCSS(props.background ?? null);
  if (backgroundStyle) styles.push(backgroundStyle);

  const shadowStyle = mapShadowToCSS(props.shadow ?? null);
  if (shadowStyle) styles.push(shadowStyle);

  // Border with optional borderColor
  const borderStyle = mapBorderToCSS(props.border ?? null, props.borderColor ?? null);
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
