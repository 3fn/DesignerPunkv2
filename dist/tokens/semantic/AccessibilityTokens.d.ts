/**
 * Accessibility Token Family
 *
 * Semantic tokens for accessibility-specific design values that support
 * WCAG compliance and inclusive design. These tokens serve users with
 * specific accessibility needs (keyboard navigation, screen readers,
 * motor impairments, visual impairments) rather than general usability.
 *
 * Decision Framework: "Is this for usability (for everyone) or
 * accessibility (usability for specific needs)?"
 *
 * Key Principles:
 * - Accessibility vs Usability: Tokens serve specific accessibility needs
 * - WCAG Traceability: Each token maps to specific WCAG success criteria
 * - Compositional Architecture: Tokens reference primitive/semantic tokens
 * - AI-Friendly: Clear semantic meaning enables AI agent reasoning
 * - Extensible: Pattern supports future accessibility tokens
 *
 * @see https://www.w3.org/WAI/WCAG21/quickref/
 */
/**
 * Focus indicator token structure
 *
 * Note: These types describe the resolved values, not the token references.
 * The implementation uses compositional architecture (references existing tokens),
 * but TypeScript sees the resolved primitive values.
 *
 * Example:
 * - offset: number (resolves from space050 → 2)
 * - width: string (resolves from border.emphasis → 'borderWidth200')
 * - color: string (resolves from color.primary → 'purple300')
 */
export interface FocusTokens {
    /** Focus indicator outline offset - resolves to number (2px from space050) */
    offset: number;
    /** Focus indicator outline width - resolves to string reference (borderWidth200 from border.emphasis) */
    width: string;
    /** Focus indicator outline color - resolves to string reference (purple300 from color.primary) */
    color: string;
}
/**
 * Accessibility token family structure
 */
export interface AccessibilityTokens {
    /** Focus indicator tokens for keyboard navigation */
    focus: FocusTokens;
}
/**
 * Accessibility token family
 *
 * Implementation uses compositional architecture - references existing tokens
 * rather than hard-coded values. This ensures consistency with the mathematical
 * token system and allows changes to propagate automatically.
 */
export declare const accessibility: AccessibilityTokens;
/**
 * Array of all accessibility token names for iteration
 */
export declare const accessibilityTokenNames: string[];
/**
 * Get accessibility token by path
 * @example getAccessibilityToken('accessibility.focus.offset') => 2
 */
export declare function getAccessibilityToken(path: string): number | string | undefined;
/**
 * Get all accessibility tokens as array
 */
export declare function getAllAccessibilityTokens(): Array<{
    name: string;
    value: number | string;
}>;
/**
 * AI Agent Guidance for Accessibility Token Usage
 *
 * When implementing focus indicators:
 *
 * 1. Focus outline offset?
 *    → Use accessibility.focus.offset
 *    → Positions outline outside element bounds (2px)
 *    → WCAG 2.4.7 Focus Visible compliance
 *
 * 2. Focus outline width?
 *    → Use accessibility.focus.width
 *    → Provides visible outline thickness (2px)
 *    → WCAG 2.4.7 Focus Visible compliance
 *
 * 3. Focus outline color?
 *    → Use accessibility.focus.color
 *    → Ensures sufficient contrast (3:1 minimum)
 *    → WCAG 2.4.7 Focus Visible + 1.4.11 Non-text Contrast compliance
 *
 * 4. Platform-specific implementation?
 *    → Web: Use with outline property (not border)
 *    → iOS: Apply to overlay or stroke
 *    → Android: Use with border or stroke
 *
 * 5. Complete focus indicator pattern?
 *    → Combine all three tokens for WCAG-compliant focus indicators
 *    → Example: outline: ${width} solid ${color}; outline-offset: ${offset};
 *
 * Decision Framework:
 * - Is this for usability (everyone) or accessibility (specific needs)?
 * - Focus indicators serve keyboard navigation users (accessibility)
 * - Touch targets serve all users (usability - not in accessibility family)
 */
//# sourceMappingURL=AccessibilityTokens.d.ts.map