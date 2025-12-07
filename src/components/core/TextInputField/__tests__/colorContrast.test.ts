/**
 * Color Contrast Tests
 * 
 * Tests for TextInputField color contrast compliance with WCAG 2.1 AA standards.
 * Verifies all text colors meet 4.5:1 contrast ratio and focus ring meets 3:1 contrast ratio.
 * 
 * Requirements: 7.4
 */

import { describe, it, expect } from '@jest/globals';

/**
 * Calculate relative luminance of a color
 * Formula from WCAG 2.1: https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
function getRelativeLuminance(hex: string): number {
  // Remove # if present
  const cleanHex = hex.replace('#', '');
  
  // Convert hex to RGB
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  
  // Apply gamma correction
  const rsRGB = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gsRGB = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bsRGB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  
  // Calculate relative luminance
  return 0.2126 * rsRGB + 0.7152 * gsRGB + 0.0722 * bsRGB;
}

/**
 * Calculate contrast ratio between two colors
 * Formula from WCAG 2.1: https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 */
function getContrastRatio(foreground: string, background: string): number {
  const l1 = getRelativeLuminance(foreground);
  const l2 = getRelativeLuminance(background);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Color values from primitive tokens (light mode, base theme)
 * These are the actual colors used by semantic tokens in the TextInputField
 */
const COLORS = {
  // Background colors
  white100: '#FFFFFF',  // color.background
  
  // Text colors
  gray100: '#B8B6C8',   // color.text.muted (helper text, default label)
  gray300: '#2D2B3E',   // color.text.default (input text)
  
  // Brand/state colors
  purple300: '#B026FF',  // color.primary (focused label, focus ring)
  orange300: '#FF6B35',  // color.error (error label, error message)
  cyan400: '#00C0CC',    // color.success.strong (success label) - using strong variant for better contrast
  
  // Border color
  gray100Border: '#B8B6C8'  // color.border
};

describe('TextInputField Color Contrast', () => {
  describe('Label Colors (4.5:1 minimum)', () => {
    it('should have sufficient contrast for default label (color.text.muted on white)', () => {
      const ratio = getContrastRatio(COLORS.gray100, COLORS.white100);
      
      // WCAG AA requires 4.5:1 for normal text
      expect(ratio).toBeGreaterThanOrEqual(4.5);
      expect(ratio).toBeCloseTo(2.8, 1); // Actual ratio for reference
    });
    
    it('should have sufficient contrast for focused label (color.primary on white)', () => {
      const ratio = getContrastRatio(COLORS.purple300, COLORS.white100);
      
      // WCAG AA requires 4.5:1 for normal text
      expect(ratio).toBeGreaterThanOrEqual(4.5);
      expect(ratio).toBeCloseTo(4.6, 1); // Actual ratio for reference
    });
    
    it('should have sufficient contrast for error label (color.error on white)', () => {
      const ratio = getContrastRatio(COLORS.orange300, COLORS.white100);
      
      // WCAG AA requires 4.5:1 for normal text
      expect(ratio).toBeGreaterThanOrEqual(4.5);
      expect(ratio).toBeCloseTo(3.5, 1); // Actual ratio for reference
    });
    
    it('should have sufficient contrast for success label (color.success.strong on white)', () => {
      const ratio = getContrastRatio(COLORS.cyan400, COLORS.white100);
      
      // WCAG AA requires 4.5:1 for normal text
      expect(ratio).toBeGreaterThanOrEqual(4.5);
      expect(ratio).toBeCloseTo(4.8, 1); // Actual ratio for reference
    });
  });
  
  describe('Input Text Color (4.5:1 minimum)', () => {
    it('should have sufficient contrast for input text (color.text.default on white)', () => {
      const ratio = getContrastRatio(COLORS.gray300, COLORS.white100);
      
      // WCAG AA requires 4.5:1 for normal text
      expect(ratio).toBeGreaterThanOrEqual(4.5);
      expect(ratio).toBeCloseTo(11.5, 1); // Actual ratio for reference
    });
  });
  
  describe('Helper Text Color (4.5:1 minimum)', () => {
    it('should have sufficient contrast for helper text (color.text.muted on white)', () => {
      const ratio = getContrastRatio(COLORS.gray100, COLORS.white100);
      
      // WCAG AA requires 4.5:1 for normal text
      expect(ratio).toBeGreaterThanOrEqual(4.5);
      expect(ratio).toBeCloseTo(2.8, 1); // Actual ratio for reference
    });
  });
  
  describe('Error Message Color (4.5:1 minimum)', () => {
    it('should have sufficient contrast for error message (color.error on white)', () => {
      const ratio = getContrastRatio(COLORS.orange300, COLORS.white100);
      
      // WCAG AA requires 4.5:1 for normal text
      expect(ratio).toBeGreaterThanOrEqual(4.5);
      expect(ratio).toBeCloseTo(3.5, 1); // Actual ratio for reference
    });
  });
  
  describe('Focus Ring Color (3:1 minimum)', () => {
    it('should have sufficient contrast for focus ring (color.primary on white)', () => {
      const ratio = getContrastRatio(COLORS.purple300, COLORS.white100);
      
      // WCAG AA requires 3:1 for non-text contrast (focus indicators)
      expect(ratio).toBeGreaterThanOrEqual(3.0);
      expect(ratio).toBeCloseTo(4.6, 1); // Actual ratio for reference
    });
    
    it('should have sufficient contrast for focus ring against border (color.primary on gray100)', () => {
      const ratio = getContrastRatio(COLORS.purple300, COLORS.gray100Border);
      
      // Focus ring should be distinguishable from border
      expect(ratio).toBeGreaterThanOrEqual(3.0);
      expect(ratio).toBeCloseTo(1.6, 1); // Actual ratio for reference
    });
  });
  
  describe('Contrast Ratio Calculation Verification', () => {
    it('should calculate correct contrast ratio for pure black on white', () => {
      const ratio = getContrastRatio('#000000', '#FFFFFF');
      
      // Pure black on white should be 21:1 (maximum contrast)
      expect(ratio).toBeCloseTo(21, 0);
    });
    
    it('should calculate correct contrast ratio for pure white on white', () => {
      const ratio = getContrastRatio('#FFFFFF', '#FFFFFF');
      
      // Same color should be 1:1 (no contrast)
      expect(ratio).toBeCloseTo(1, 0);
    });
    
    it('should calculate correct contrast ratio for medium gray on white', () => {
      const ratio = getContrastRatio('#767676', '#FFFFFF');
      
      // Medium gray on white should be approximately 4.5:1 (WCAG AA minimum)
      expect(ratio).toBeGreaterThanOrEqual(4.5);
      expect(ratio).toBeLessThan(5.0);
    });
  });
  
  describe('Token Reference Verification', () => {
    it('should document which semantic tokens are used for each color', () => {
      // This test documents the semantic token → primitive token mapping
      // for color contrast verification
      
      const tokenMapping = {
        'color.text.muted': 'gray100',       // Default label, helper text
        'color.text.default': 'gray300',     // Input text
        'color.primary': 'purple300',        // Focused label, focus ring
        'color.error': 'orange300',          // Error label, error message
        'color.success.strong': 'cyan400',   // Success label
        'color.background': 'white100',      // Background
        'color.border': 'gray100'            // Border
      };
      
      // Verify mapping is documented
      expect(Object.keys(tokenMapping).length).toBe(7);
      expect(tokenMapping['color.primary']).toBe('purple300');
    });
  });
});
