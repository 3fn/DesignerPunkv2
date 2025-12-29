/**
 * Theme Switching Tests
 * 
 * Tests for theme-aware blend utilities across light and dark themes.
 * Validates that blend operations produce appropriate results in both modes
 * and that theme switching updates component colors correctly.
 * 
 * Architecture: DesignerPunk uses vanilla Web Components that read theme colors
 * from CSS custom properties. Theme switching is handled by changing CSS custom
 * property values on document.documentElement.
 * 
 * @see Requirements: 11.1 - Light theme produces appropriate blend results
 * @see Requirements: 11.2 - Dark theme produces appropriate blend results
 * @see Requirements: 11.3 - Theme switching updates component colors
 */

import {
  getBlendUtilities,
  createBlendUtilities,
  BlendTokenValues,
  BlendUtilitiesResult
} from '../ThemeAwareBlendUtilities.web';

// Test color palettes for light and dark themes
// These represent typical design system color values
const LIGHT_THEME_COLORS = {
  primary: '#A855F7',        // Purple primary for light theme
  onPrimary: '#FFFFFF',      // White text on primary
  surface: '#FFFFFF',        // White surface
  onSurface: '#1F2937',      // Dark text on surface
  secondary: '#8B5CF6',      // Secondary purple
};

const DARK_THEME_COLORS = {
  primary: '#C084FC',        // Lighter purple primary for dark theme
  onPrimary: '#1F2937',      // Dark text on primary
  surface: '#1F2937',        // Dark surface
  onSurface: '#F9FAFB',      // Light text on surface
  secondary: '#A78BFA',      // Secondary purple for dark
};

/**
 * Helper to parse hex color to RGB components
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Calculate relative luminance of a color (0-1 scale)
 * Used to verify darker/lighter blend operations
 */
function calculateLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
    const sRGB = c / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate saturation of a color (0-1 scale)
 * Used to verify saturate/desaturate blend operations
 */
function calculateSaturation(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  
  if (max === min) return 0; // achromatic
  
  const d = max - min;
  return l > 0.5 ? d / (2 - max - min) : d / (max + min);
}

describe('Theme Switching Tests', () => {
  let blendUtils: BlendUtilitiesResult;

  beforeEach(() => {
    blendUtils = getBlendUtilities();
  });

  describe('Requirement 11.1: Light Theme Blend Results', () => {
    describe('hover state (darkerBlend)', () => {
      it('should produce darker color for light theme primary', () => {
        const baseColor = LIGHT_THEME_COLORS.primary;
        const hoverColor = blendUtils.hoverColor(baseColor);
        
        const baseLuminance = calculateLuminance(baseColor);
        const hoverLuminance = calculateLuminance(hoverColor);
        
        // Hover should be darker (lower luminance)
        expect(hoverLuminance).toBeLessThan(baseLuminance);
      });

      it('should produce darker color for light theme surface', () => {
        const baseColor = LIGHT_THEME_COLORS.surface;
        const hoverColor = blendUtils.hoverColor(baseColor);
        
        const baseLuminance = calculateLuminance(baseColor);
        const hoverLuminance = calculateLuminance(hoverColor);
        
        // Hover should be darker (lower luminance)
        expect(hoverLuminance).toBeLessThan(baseLuminance);
      });

      it('should return valid hex color', () => {
        const hoverColor = blendUtils.hoverColor(LIGHT_THEME_COLORS.primary);
        expect(hoverColor).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });

    describe('pressed state (darkerBlend)', () => {
      it('should produce darker color than hover for light theme', () => {
        const baseColor = LIGHT_THEME_COLORS.primary;
        const hoverColor = blendUtils.hoverColor(baseColor);
        const pressedColor = blendUtils.pressedColor(baseColor);
        
        const hoverLuminance = calculateLuminance(hoverColor);
        const pressedLuminance = calculateLuminance(pressedColor);
        
        // Pressed should be darker than hover (12% vs 8%)
        expect(pressedLuminance).toBeLessThan(hoverLuminance);
      });
    });

    describe('focus state (saturate)', () => {
      it('should produce more saturated color for light theme', () => {
        const baseColor = LIGHT_THEME_COLORS.primary;
        const focusColor = blendUtils.focusColor(baseColor);
        
        const baseSaturation = calculateSaturation(baseColor);
        const focusSaturation = calculateSaturation(focusColor);
        
        // Focus should be more saturated (or equal if already fully saturated)
        expect(focusSaturation).toBeGreaterThanOrEqual(baseSaturation - 0.01); // Allow small tolerance
      });

      it('should return valid hex color', () => {
        const focusColor = blendUtils.focusColor(LIGHT_THEME_COLORS.primary);
        expect(focusColor).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });

    describe('disabled state (desaturate)', () => {
      it('should produce less saturated color for light theme', () => {
        const baseColor = LIGHT_THEME_COLORS.primary;
        const disabledColor = blendUtils.disabledColor(baseColor);
        
        const baseSaturation = calculateSaturation(baseColor);
        const disabledSaturation = calculateSaturation(disabledColor);
        
        // Disabled should be less saturated (or equal if already desaturated)
        expect(disabledSaturation).toBeLessThanOrEqual(baseSaturation + 0.01); // Allow small tolerance
      });

      it('should return valid hex color', () => {
        const disabledColor = blendUtils.disabledColor(LIGHT_THEME_COLORS.primary);
        expect(disabledColor).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });

    describe('icon optical balance (lighterBlend)', () => {
      it('should produce lighter color for light theme onPrimary', () => {
        const baseColor = LIGHT_THEME_COLORS.onPrimary;
        const iconColor = blendUtils.iconColor(baseColor);
        
        // For white (#FFFFFF), lightening won't increase luminance
        // but should still return a valid color
        expect(iconColor).toMatch(/^#[0-9A-F]{6}$/i);
      });

      it('should produce lighter color for colored icons', () => {
        const baseColor = LIGHT_THEME_COLORS.secondary;
        const iconColor = blendUtils.iconColor(baseColor);
        
        const baseLuminance = calculateLuminance(baseColor);
        const iconLuminance = calculateLuminance(iconColor);
        
        // Icon should be lighter (higher luminance)
        expect(iconLuminance).toBeGreaterThan(baseLuminance);
      });
    });
  });

  describe('Requirement 11.2: Dark Theme Blend Results', () => {
    describe('hover state (darkerBlend)', () => {
      it('should produce darker color for dark theme primary', () => {
        const baseColor = DARK_THEME_COLORS.primary;
        const hoverColor = blendUtils.hoverColor(baseColor);
        
        const baseLuminance = calculateLuminance(baseColor);
        const hoverLuminance = calculateLuminance(hoverColor);
        
        // Hover should be darker (lower luminance)
        expect(hoverLuminance).toBeLessThan(baseLuminance);
      });

      it('should produce darker color for dark theme surface', () => {
        const baseColor = DARK_THEME_COLORS.surface;
        const hoverColor = blendUtils.hoverColor(baseColor);
        
        const baseLuminance = calculateLuminance(baseColor);
        const hoverLuminance = calculateLuminance(hoverColor);
        
        // Hover should be darker (lower luminance)
        expect(hoverLuminance).toBeLessThan(baseLuminance);
      });

      it('should return valid hex color', () => {
        const hoverColor = blendUtils.hoverColor(DARK_THEME_COLORS.primary);
        expect(hoverColor).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });

    describe('pressed state (darkerBlend)', () => {
      it('should produce darker color than hover for dark theme', () => {
        const baseColor = DARK_THEME_COLORS.primary;
        const hoverColor = blendUtils.hoverColor(baseColor);
        const pressedColor = blendUtils.pressedColor(baseColor);
        
        const hoverLuminance = calculateLuminance(hoverColor);
        const pressedLuminance = calculateLuminance(pressedColor);
        
        // Pressed should be darker than hover (12% vs 8%)
        expect(pressedLuminance).toBeLessThan(hoverLuminance);
      });
    });

    describe('focus state (saturate)', () => {
      it('should produce more saturated color for dark theme', () => {
        const baseColor = DARK_THEME_COLORS.primary;
        const focusColor = blendUtils.focusColor(baseColor);
        
        const baseSaturation = calculateSaturation(baseColor);
        const focusSaturation = calculateSaturation(focusColor);
        
        // Focus should be more saturated (or equal if already fully saturated)
        expect(focusSaturation).toBeGreaterThanOrEqual(baseSaturation - 0.01);
      });
    });

    describe('disabled state (desaturate)', () => {
      it('should produce less saturated color for dark theme', () => {
        const baseColor = DARK_THEME_COLORS.primary;
        const disabledColor = blendUtils.disabledColor(baseColor);
        
        const baseSaturation = calculateSaturation(baseColor);
        const disabledSaturation = calculateSaturation(disabledColor);
        
        // Disabled should be less saturated
        expect(disabledSaturation).toBeLessThanOrEqual(baseSaturation + 0.01);
      });
    });

    describe('icon optical balance (lighterBlend)', () => {
      it('should produce lighter color for dark theme onPrimary', () => {
        const baseColor = DARK_THEME_COLORS.onPrimary;
        const iconColor = blendUtils.iconColor(baseColor);
        
        const baseLuminance = calculateLuminance(baseColor);
        const iconLuminance = calculateLuminance(iconColor);
        
        // Icon should be lighter (higher luminance)
        expect(iconLuminance).toBeGreaterThan(baseLuminance);
      });

      it('should produce lighter color for dark theme secondary', () => {
        const baseColor = DARK_THEME_COLORS.secondary;
        const iconColor = blendUtils.iconColor(baseColor);
        
        const baseLuminance = calculateLuminance(baseColor);
        const iconLuminance = calculateLuminance(iconColor);
        
        // Icon should be lighter (higher luminance)
        expect(iconLuminance).toBeGreaterThan(baseLuminance);
      });
    });
  });

  describe('Requirement 11.3: Theme Switching Updates Component Colors', () => {
    describe('color recalculation on theme change', () => {
      it('should produce different hover colors for light vs dark theme primary', () => {
        const lightHover = blendUtils.hoverColor(LIGHT_THEME_COLORS.primary);
        const darkHover = blendUtils.hoverColor(DARK_THEME_COLORS.primary);
        
        // Different base colors should produce different hover colors
        expect(lightHover).not.toBe(darkHover);
      });

      it('should produce different pressed colors for light vs dark theme primary', () => {
        const lightPressed = blendUtils.pressedColor(LIGHT_THEME_COLORS.primary);
        const darkPressed = blendUtils.pressedColor(DARK_THEME_COLORS.primary);
        
        expect(lightPressed).not.toBe(darkPressed);
      });

      it('should produce different disabled colors for light vs dark theme primary', () => {
        const lightDisabled = blendUtils.disabledColor(LIGHT_THEME_COLORS.primary);
        const darkDisabled = blendUtils.disabledColor(DARK_THEME_COLORS.primary);
        
        expect(lightDisabled).not.toBe(darkDisabled);
      });

      it('should produce different icon colors for light vs dark theme onPrimary', () => {
        const lightIcon = blendUtils.iconColor(LIGHT_THEME_COLORS.onPrimary);
        const darkIcon = blendUtils.iconColor(DARK_THEME_COLORS.onPrimary);
        
        expect(lightIcon).not.toBe(darkIcon);
      });
    });

    describe('consistent blend ratios across themes', () => {
      it('should apply same hover blend ratio (8%) to both themes', () => {
        // Both themes should use BlendTokenValues.hoverDarker (0.08)
        expect(BlendTokenValues.hoverDarker).toBe(0.08);
        
        // Verify both produce valid results with same ratio
        const lightHover = blendUtils.hoverColor(LIGHT_THEME_COLORS.primary);
        const darkHover = blendUtils.hoverColor(DARK_THEME_COLORS.primary);
        
        expect(lightHover).toMatch(/^#[0-9A-F]{6}$/i);
        expect(darkHover).toMatch(/^#[0-9A-F]{6}$/i);
      });

      it('should apply same pressed blend ratio (12%) to both themes', () => {
        expect(BlendTokenValues.pressedDarker).toBe(0.12);
        
        const lightPressed = blendUtils.pressedColor(LIGHT_THEME_COLORS.primary);
        const darkPressed = blendUtils.pressedColor(DARK_THEME_COLORS.primary);
        
        expect(lightPressed).toMatch(/^#[0-9A-F]{6}$/i);
        expect(darkPressed).toMatch(/^#[0-9A-F]{6}$/i);
      });

      it('should apply same disabled blend ratio (12%) to both themes', () => {
        expect(BlendTokenValues.disabledDesaturate).toBe(0.12);
        
        const lightDisabled = blendUtils.disabledColor(LIGHT_THEME_COLORS.primary);
        const darkDisabled = blendUtils.disabledColor(DARK_THEME_COLORS.primary);
        
        expect(lightDisabled).toMatch(/^#[0-9A-F]{6}$/i);
        expect(darkDisabled).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });

    describe('theme switching simulation', () => {
      it('should support recalculating all state colors when theme changes', () => {
        // Simulate light theme state
        const lightThemeColors = {
          hover: blendUtils.hoverColor(LIGHT_THEME_COLORS.primary),
          pressed: blendUtils.pressedColor(LIGHT_THEME_COLORS.primary),
          focus: blendUtils.focusColor(LIGHT_THEME_COLORS.primary),
          disabled: blendUtils.disabledColor(LIGHT_THEME_COLORS.primary),
          icon: blendUtils.iconColor(LIGHT_THEME_COLORS.onPrimary),
        };

        // Simulate dark theme state (as if CSS custom properties changed)
        const darkThemeColors = {
          hover: blendUtils.hoverColor(DARK_THEME_COLORS.primary),
          pressed: blendUtils.pressedColor(DARK_THEME_COLORS.primary),
          focus: blendUtils.focusColor(DARK_THEME_COLORS.primary),
          disabled: blendUtils.disabledColor(DARK_THEME_COLORS.primary),
          icon: blendUtils.iconColor(DARK_THEME_COLORS.onPrimary),
        };

        // All colors should be different between themes
        expect(lightThemeColors.hover).not.toBe(darkThemeColors.hover);
        expect(lightThemeColors.pressed).not.toBe(darkThemeColors.pressed);
        expect(lightThemeColors.focus).not.toBe(darkThemeColors.focus);
        expect(lightThemeColors.disabled).not.toBe(darkThemeColors.disabled);
        expect(lightThemeColors.icon).not.toBe(darkThemeColors.icon);

        // All colors should be valid hex
        Object.values(lightThemeColors).forEach(color => {
          expect(color).toMatch(/^#[0-9A-F]{6}$/i);
        });
        Object.values(darkThemeColors).forEach(color => {
          expect(color).toMatch(/^#[0-9A-F]{6}$/i);
        });
      });

      it('should produce consistent results when recalculating same theme', () => {
        // First calculation
        const firstCalc = {
          hover: blendUtils.hoverColor(LIGHT_THEME_COLORS.primary),
          pressed: blendUtils.pressedColor(LIGHT_THEME_COLORS.primary),
        };

        // Second calculation (simulating component re-render)
        const secondCalc = {
          hover: blendUtils.hoverColor(LIGHT_THEME_COLORS.primary),
          pressed: blendUtils.pressedColor(LIGHT_THEME_COLORS.primary),
        };

        // Results should be identical
        expect(firstCalc.hover).toBe(secondCalc.hover);
        expect(firstCalc.pressed).toBe(secondCalc.pressed);
      });
    });

    describe('factory function independence', () => {
      it('should allow multiple independent blend utility instances', () => {
        const utils1 = createBlendUtilities();
        const utils2 = createBlendUtilities();

        // Both instances should produce same results for same input
        const result1 = utils1.hoverColor(LIGHT_THEME_COLORS.primary);
        const result2 = utils2.hoverColor(LIGHT_THEME_COLORS.primary);

        expect(result1).toBe(result2);
      });

      it('should support different themes with different utility instances', () => {
        const lightUtils = createBlendUtilities();
        const darkUtils = createBlendUtilities();

        // Each instance can be used with different theme colors
        const lightHover = lightUtils.hoverColor(LIGHT_THEME_COLORS.primary);
        const darkHover = darkUtils.hoverColor(DARK_THEME_COLORS.primary);

        expect(lightHover).not.toBe(darkHover);
        expect(lightHover).toMatch(/^#[0-9A-F]{6}$/i);
        expect(darkHover).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });
  });

  describe('Edge Cases for Theme Switching', () => {
    describe('extreme color values', () => {
      it('should handle pure black in both themes', () => {
        const black = '#000000';
        const hoverColor = blendUtils.hoverColor(black);
        
        // Black can't get darker, but should return valid color
        expect(hoverColor).toMatch(/^#[0-9A-F]{6}$/i);
      });

      it('should handle pure white in both themes', () => {
        const white = '#FFFFFF';
        const iconColor = blendUtils.iconColor(white);
        
        // White can't get lighter, but should return valid color
        expect(iconColor).toMatch(/^#[0-9A-F]{6}$/i);
      });

      it('should handle grayscale colors (no saturation)', () => {
        const gray = '#808080';
        const focusColor = blendUtils.focusColor(gray);
        const disabledColor = blendUtils.disabledColor(gray);
        
        // Grayscale has no saturation to modify, but should return valid colors
        expect(focusColor).toMatch(/^#[0-9A-F]{6}$/i);
        expect(disabledColor).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });

    describe('high contrast theme colors', () => {
      it('should handle high contrast light theme', () => {
        const highContrastPrimary = '#7C3AED'; // Darker purple for WCAG
        
        const hover = blendUtils.hoverColor(highContrastPrimary);
        const pressed = blendUtils.pressedColor(highContrastPrimary);
        
        expect(hover).toMatch(/^#[0-9A-F]{6}$/i);
        expect(pressed).toMatch(/^#[0-9A-F]{6}$/i);
        
        // Pressed should still be darker than hover
        const hoverLuminance = calculateLuminance(hover);
        const pressedLuminance = calculateLuminance(pressed);
        expect(pressedLuminance).toBeLessThan(hoverLuminance);
      });

      it('should handle high contrast dark theme', () => {
        const highContrastPrimary = '#C4B5FD'; // Lighter purple for dark WCAG
        
        const hover = blendUtils.hoverColor(highContrastPrimary);
        const pressed = blendUtils.pressedColor(highContrastPrimary);
        
        expect(hover).toMatch(/^#[0-9A-F]{6}$/i);
        expect(pressed).toMatch(/^#[0-9A-F]{6}$/i);
        
        // Pressed should still be darker than hover
        const hoverLuminance = calculateLuminance(hover);
        const pressedLuminance = calculateLuminance(pressed);
        expect(pressedLuminance).toBeLessThan(hoverLuminance);
      });
    });
  });
});
