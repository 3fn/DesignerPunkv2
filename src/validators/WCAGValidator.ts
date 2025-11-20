/**
 * WCAG Validator
 * 
 * Validates accessibility tokens against WCAG (Web Content Accessibility Guidelines)
 * success criteria to ensure compliance with accessibility standards.
 * 
 * WCAG References:
 * - 2.4.7 Focus Visible (Level AA): Keyboard focus indicator must be visible
 * - 1.4.11 Non-text Contrast (Level AA): UI components must have 3:1 contrast minimum
 * 
 * @see https://www.w3.org/WAI/WCAG21/quickref/
 */

export interface WCAGValidationResult {
  /** Validation level: 'pass', 'warning', or 'error' */
  level: 'pass' | 'warning' | 'error';
  
  /** Human-readable validation message */
  message: string;
  
  /** WCAG success criterion reference (optional) */
  wcag?: string;
  
  /** Contrast ratio value (for contrast validations) */
  contrastRatio?: number;
}

/**
 * WCAG Validator for accessibility token compliance
 */
export class WCAGValidator {
  /**
   * Validate focus indicator contrast ratio
   * 
   * WCAG 1.4.11 Non-text Contrast (Level AA) requires a minimum 3:1 contrast ratio
   * for UI components and graphical objects, including focus indicators.
   * 
   * @param focusColor - Focus indicator color (hex format)
   * @param backgroundColor - Background color to compare against (hex format)
   * @returns Validation result with contrast ratio and compliance status
   * 
   * @example
   * ```typescript
   * const result = validator.validateFocusContrast('#3B82F6', '#FFFFFF');
   * // Returns: { level: 'pass', message: '...', contrastRatio: 3.14 }
   * ```
   */
  validateFocusContrast(
    focusColor: string,
    backgroundColor: string
  ): WCAGValidationResult {
    const contrastRatio = this.calculateContrastRatio(focusColor, backgroundColor);
    const minimumRatio = 3.0; // WCAG 1.4.11 Level AA requirement
    
    if (contrastRatio >= minimumRatio) {
      return {
        level: 'pass',
        message: `Focus indicator contrast ratio ${contrastRatio.toFixed(2)}:1 meets WCAG 1.4.11 (minimum 3:1)`,
        contrastRatio,
      };
    } else {
      return {
        level: 'error',
        message: `Focus indicator contrast ratio ${contrastRatio.toFixed(2)}:1 fails WCAG 1.4.11 (minimum 3:1)`,
        wcag: '1.4.11 Non-text Contrast (Level AA)',
        contrastRatio,
      };
    }
  }
  
  /**
   * Validate focus indicator visibility
   * 
   * WCAG 2.4.7 Focus Visible (Level AA) requires that keyboard focus indicators
   * are visible. This validation checks that offset and width values support
   * visibility requirements.
   * 
   * @param offset - Focus indicator offset in pixels
   * @param width - Focus indicator width in pixels
   * @returns Validation result with visibility compliance status
   * 
   * @example
   * ```typescript
   * const result = validator.validateFocusVisibility(2, 2);
   * // Returns: { level: 'pass', message: '...' }
   * ```
   */
  validateFocusVisibility(
    offset: number,
    width: number
  ): WCAGValidationResult {
    const minimumWidth = 1; // Minimum 1px for visibility
    const minimumOffset = 0; // Can be 0 or positive
    
    // Check for invalid values
    if (width < minimumWidth) {
      return {
        level: 'error',
        message: `Focus indicator width ${width}px is below minimum ${minimumWidth}px for visibility (WCAG 2.4.7)`,
        wcag: '2.4.7 Focus Visible (Level AA)',
      };
    }
    
    if (offset < minimumOffset) {
      return {
        level: 'error',
        message: `Focus indicator offset ${offset}px is negative, must be ${minimumOffset}px or greater (WCAG 2.4.7)`,
        wcag: '2.4.7 Focus Visible (Level AA)',
      };
    }
    
    // Check for suboptimal but valid values
    if (offset === 0 && width < 2) {
      return {
        level: 'warning',
        message: `Focus indicator (${width}px width, ${offset}px offset) may have reduced visibility - consider 2px width with 2px offset for better clarity`,
        wcag: '2.4.7 Focus Visible (Level AA)',
      };
    }
    
    // Valid configuration
    return {
      level: 'pass',
      message: `Focus indicator (${width}px width, ${offset}px offset) meets WCAG 2.4.7 visibility requirements`,
    };
  }
  
  /**
   * Calculate contrast ratio between two colors
   * 
   * Implements the WCAG contrast ratio formula:
   * (L1 + 0.05) / (L2 + 0.05)
   * where L1 is the relative luminance of the lighter color
   * and L2 is the relative luminance of the darker color.
   * 
   * @param color1 - First color in hex format (#RRGGBB or #RGB)
   * @param color2 - Second color in hex format (#RRGGBB or #RGB)
   * @returns Contrast ratio (1:1 to 21:1)
   * 
   * @see https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
   * 
   * @example
   * ```typescript
   * const ratio = validator.calculateContrastRatio('#000000', '#FFFFFF');
   * // Returns: 21 (maximum contrast)
   * ```
   */
  calculateContrastRatio(color1: string, color2: string): number {
    const luminance1 = this.getRelativeLuminance(color1);
    const luminance2 = this.getRelativeLuminance(color2);
    
    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }
  
  /**
   * Calculate relative luminance of a color
   * 
   * Implements the WCAG relative luminance formula:
   * L = 0.2126 * R + 0.7152 * G + 0.0722 * B
   * where R, G, and B are the linearized RGB values.
   * 
   * @param hexColor - Color in hex format (#RRGGBB or #RGB)
   * @returns Relative luminance (0 to 1)
   * 
   * @private
   */
  private getRelativeLuminance(hexColor: string): number {
    // Parse hex color to RGB
    const rgb = this.hexToRgb(hexColor);
    
    // Convert RGB values to linear RGB (remove gamma correction)
    const linearRgb = rgb.map(channel => {
      const normalized = channel / 255;
      return normalized <= 0.03928
        ? normalized / 12.92
        : Math.pow((normalized + 0.055) / 1.055, 2.4);
    });
    
    // Calculate relative luminance using WCAG formula
    return 0.2126 * linearRgb[0] + 0.7152 * linearRgb[1] + 0.0722 * linearRgb[2];
  }
  
  /**
   * Convert hex color to RGB array
   * 
   * Supports both 3-digit (#RGB) and 6-digit (#RRGGBB) hex formats.
   * 
   * @param hexColor - Color in hex format
   * @returns RGB array [r, g, b] with values 0-255
   * 
   * @private
   */
  private hexToRgb(hexColor: string): [number, number, number] {
    // Remove # prefix if present
    const hex = hexColor.replace(/^#/, '');
    
    // Handle 3-digit hex format (#RGB)
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      return [r, g, b];
    }
    
    // Handle 6-digit hex format (#RRGGBB)
    if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return [r, g, b];
    }
    
    // Invalid format - return black as fallback
    return [0, 0, 0];
  }
}
