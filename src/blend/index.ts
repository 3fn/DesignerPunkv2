/**
 * Blend Token System
 * 
 * Color space conversion utilities and blend calculation functions
 * for the blend token system.
 * 
 * @module blend
 */

export {
  rgbToHsl,
  hslToRgb,
  hexToRgb,
  rgbToHex,
  calculateDarkerBlend,
  calculateLighterBlend,
  calculateSaturateBlend,
  calculateDesaturateBlend,
  RGB,
  HSL
} from './ColorSpaceUtils';

export {
  BlendCalculator,
  calculateBlend
} from './BlendCalculator';

// Theme-aware blend utilities for Web (React)
export {
  useBlendUtilities,
  getBlendUtilities,
  createBlendUtilities,
  BlendTokenValues,
  BlendUtilitiesResult,
  BlendThemeContext,
  ThemeMode
} from './ThemeAwareBlendUtilities.web';
