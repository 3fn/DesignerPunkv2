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
export declare class WCAGValidator {
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
    validateFocusContrast(focusColor: string, backgroundColor: string): WCAGValidationResult;
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
    validateFocusVisibility(offset: number, width: number): WCAGValidationResult;
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
    calculateContrastRatio(color1: string, color2: string): number;
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
    private getRelativeLuminance;
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
    private hexToRgb;
}
//# sourceMappingURL=WCAGValidator.d.ts.map