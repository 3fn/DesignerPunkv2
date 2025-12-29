/**
 * Theme-Aware Blend Utilities for Web (Vanilla TypeScript)
 * 
 * Provides factory functions that wrap blend utilities for use in Web Components.
 * Components read theme colors from CSS custom properties on document.documentElement
 * and use these utilities to calculate state colors (hover, pressed, disabled, etc.).
 * 
 * Architecture: DesignerPunk uses vanilla Web Components (extending HTMLElement, Shadow DOM),
 * NOT React. Theme colors are accessed via getComputedStyle(document.documentElement).
 * 
 * @module blend/ThemeAwareBlendUtilities.web
 * @see Requirements: 11.4 - Theme-aware wrapper functions
 */

import {
  hexToRgb,
  rgbToHex,
  calculateDarkerBlend,
  calculateLighterBlend,
  calculateSaturateBlend,
  calculateDesaturateBlend,
  RGB
} from './ColorSpaceUtils';

/**
 * Theme mode type for light/dark theme support
 */
export type ThemeMode = 'light' | 'dark';

/**
 * Theme context interface for blend utilities
 */
export interface BlendThemeContext {
  /** Current theme mode (light or dark) */
  mode: ThemeMode;
  /** Primary color for the current theme */
  primaryColor: string;
  /** On-primary color (text/icon color on primary background) */
  onPrimaryColor: string;
  /** Surface color for the current theme */
  surfaceColor: string;
  /** On-surface color (text/icon color on surface background) */
  onSurfaceColor: string;
}

/**
 * Blend token values from semantic blend tokens
 * These match the CSS custom properties and design token definitions
 */
export const BlendTokenValues = {
  /** Hover state darkening - blend200 (8%) */
  hoverDarker: 0.08,
  /** Pressed state darkening - blend300 (12%) */
  pressedDarker: 0.12,
  /** Focus state saturation increase - blend200 (8%) */
  focusSaturate: 0.08,
  /** Disabled state desaturation - blend300 (12%) */
  disabledDesaturate: 0.12,
  /** Icon optical balance lightening - blend200 (8%) */
  iconLighter: 0.08
} as const;

/**
 * Result type for blend utility functions
 */
export interface BlendUtilitiesResult {
  /**
   * Calculate hover color by darkening the base color
   * @param baseColor - Base color as hex string (e.g., "#A855F7")
   * @returns Darkened hex color string for hover state
   */
  hoverColor: (baseColor: string) => string;
  
  /**
   * Calculate pressed color by darkening the base color more than hover
   * @param baseColor - Base color as hex string (e.g., "#A855F7")
   * @returns Darkened hex color string for pressed state
   */
  pressedColor: (baseColor: string) => string;
  
  /**
   * Calculate focus color by saturating the base color
   * @param baseColor - Base color as hex string (e.g., "#A855F7")
   * @returns Saturated hex color string for focus state
   */
  focusColor: (baseColor: string) => string;
  
  /**
   * Calculate disabled color by desaturating the base color
   * @param baseColor - Base color as hex string (e.g., "#A855F7")
   * @returns Desaturated hex color string for disabled state
   */
  disabledColor: (baseColor: string) => string;
  
  /**
   * Calculate icon color with optical balance adjustment
   * @param baseColor - Base color as hex string (e.g., "#A855F7")
   * @returns Lightened hex color string for icon optical balance
   */
  iconColor: (baseColor: string) => string;
  
  /**
   * Generic darker blend function
   * @param color - Base color as hex string
   * @param amount - Blend amount (0.0-1.0)
   * @returns Darkened hex color string
   */
  darkerBlend: (color: string, amount: number) => string;
  
  /**
   * Generic lighter blend function
   * @param color - Base color as hex string
   * @param amount - Blend amount (0.0-1.0)
   * @returns Lightened hex color string
   */
  lighterBlend: (color: string, amount: number) => string;
  
  /**
   * Generic saturate blend function
   * @param color - Base color as hex string
   * @param amount - Blend amount (0.0-1.0)
   * @returns Saturated hex color string
   */
  saturate: (color: string, amount: number) => string;
  
  /**
   * Generic desaturate blend function
   * @param color - Base color as hex string
   * @param amount - Blend amount (0.0-1.0)
   * @returns Desaturated hex color string
   */
  desaturate: (color: string, amount: number) => string;
}

/**
 * Apply darker blend to a hex color string.
 * Returns original color if parsing fails (invalid input handling).
 * 
 * @param color - Hex color string (e.g., "#A855F7")
 * @param amount - Blend amount as decimal (0.0-1.0)
 * @returns Darkened hex color string
 */
function darkerBlend(color: string, amount: number): string {
  try {
    const rgb: RGB = hexToRgb(color);
    const blended = calculateDarkerBlend(rgb, amount);
    return rgbToHex(blended);
  } catch {
    // Return original color if parsing fails (Requirement 2.6)
    return color;
  }
}

/**
 * Apply lighter blend to a hex color string.
 * Returns original color if parsing fails (invalid input handling).
 * 
 * @param color - Hex color string (e.g., "#A855F7")
 * @param amount - Blend amount as decimal (0.0-1.0)
 * @returns Lightened hex color string
 */
function lighterBlend(color: string, amount: number): string {
  try {
    const rgb: RGB = hexToRgb(color);
    const blended = calculateLighterBlend(rgb, amount);
    return rgbToHex(blended);
  } catch {
    // Return original color if parsing fails (Requirement 2.6)
    return color;
  }
}

/**
 * Apply saturate blend to a hex color string.
 * Returns original color if parsing fails (invalid input handling).
 * 
 * @param color - Hex color string (e.g., "#A855F7")
 * @param amount - Blend amount as decimal (0.0-1.0)
 * @returns Saturated hex color string
 */
function saturate(color: string, amount: number): string {
  try {
    const rgb: RGB = hexToRgb(color);
    const blended = calculateSaturateBlend(rgb, amount);
    return rgbToHex(blended);
  } catch {
    // Return original color if parsing fails (Requirement 2.6)
    return color;
  }
}

/**
 * Apply desaturate blend to a hex color string.
 * Returns original color if parsing fails (invalid input handling).
 * 
 * @param color - Hex color string (e.g., "#A855F7")
 * @param amount - Blend amount as decimal (0.0-1.0)
 * @returns Desaturated hex color string
 */
function desaturate(color: string, amount: number): string {
  try {
    const rgb: RGB = hexToRgb(color);
    const blended = calculateDesaturateBlend(rgb, amount);
    return rgbToHex(blended);
  } catch {
    // Return original color if parsing fails (Requirement 2.6)
    return color;
  }
}

/**
 * Create blend utilities with theme-aware convenience functions.
 * 
 * This is a factory function that creates blend utilities. It provides both 
 * generic blend functions and semantic convenience functions for common 
 * component states.
 * 
 * Usage in Web Components:
 * 1. Read theme colors from CSS custom properties via getComputedStyle()
 * 2. Pass colors to these utility functions to calculate state colors
 * 
 * @returns Object containing all blend utility functions
 * 
 * @example
 * ```typescript
 * // In a Web Component
 * class MyButton extends HTMLElement {
 *   private _calculateBlendColors(): void {
 *     const computedStyle = getComputedStyle(document.documentElement);
 *     const primaryColor = computedStyle.getPropertyValue('--color-primary').trim();
 *     
 *     const blendUtils = createBlendUtilities();
 *     this._hoverColor = blendUtils.hoverColor(primaryColor);
 *     this._pressedColor = blendUtils.pressedColor(primaryColor);
 *   }
 * }
 * ```
 */
export function createBlendUtilities(): BlendUtilitiesResult {
  return {
    // Semantic convenience functions using blend token values
    hoverColor: (baseColor: string) => darkerBlend(baseColor, BlendTokenValues.hoverDarker),
    pressedColor: (baseColor: string) => darkerBlend(baseColor, BlendTokenValues.pressedDarker),
    focusColor: (baseColor: string) => saturate(baseColor, BlendTokenValues.focusSaturate),
    disabledColor: (baseColor: string) => desaturate(baseColor, BlendTokenValues.disabledDesaturate),
    iconColor: (baseColor: string) => lighterBlend(baseColor, BlendTokenValues.iconLighter),
    
    // Generic blend functions for custom usage
    darkerBlend,
    lighterBlend,
    saturate,
    desaturate
  };
}

/**
 * Get blend utilities for use in Web Components and vanilla TypeScript.
 * 
 * This is the primary export for web platform usage. Web Components should:
 * 1. Read theme colors from CSS custom properties
 * 2. Use these utilities to calculate state colors
 * 3. Apply calculated colors to component styling
 * 
 * @returns Object containing all blend utility functions
 * 
 * @example
 * ```typescript
 * // In a Web Component
 * class ButtonCTA extends HTMLElement {
 *   connectedCallback() {
 *     const computedStyle = getComputedStyle(document.documentElement);
 *     const primaryColor = computedStyle.getPropertyValue('--color-primary').trim();
 *     
 *     const blendUtils = getBlendUtilities();
 *     this._hoverColor = blendUtils.hoverColor(primaryColor);
 *     this._pressedColor = blendUtils.pressedColor(primaryColor);
 *   }
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // For SSR, testing, or build-time calculations
 * import { getBlendUtilities } from '@designerpunk/tokens/ThemeAwareBlendUtilities';
 * 
 * const blendUtils = getBlendUtilities();
 * const hoverColor = blendUtils.hoverColor('#A855F7');
 * ```
 */
export function getBlendUtilities(): BlendUtilitiesResult {
  return createBlendUtilities();
}

/**
 * Alias for getBlendUtilities() - kept for backward compatibility.
 * 
 * @deprecated Use getBlendUtilities() instead. This alias will be removed in a future version.
 * @returns Object containing all blend utility functions
 */
export function useBlendUtilities(): BlendUtilitiesResult {
  // Alias for backward compatibility during migration
  return createBlendUtilities();
}

// Re-export blend token values for direct access
export { BlendTokenValues as blendTokens };

// Default export for convenience
export default {
  getBlendUtilities,
  createBlendUtilities,
  BlendTokenValues,
  // Deprecated alias - kept for backward compatibility
  useBlendUtilities
};
