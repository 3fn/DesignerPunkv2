"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessibilityTokenNames = exports.accessibilityTokens = exports.accessibility = void 0;
exports.getAccessibilityToken = getAccessibilityToken;
exports.getAllAccessibilityTokens = getAllAccessibilityTokens;
const BorderWidthTokens_1 = require("./BorderWidthTokens");
const ColorTokens_1 = require("./ColorTokens");
// Reference primitive token names (not resolved values)
const space025Ref = 'space025'; // Primitive token name
const borderEmphasisRef = BorderWidthTokens_1.borderEmphasis.value; // Already a primitive token name: 'borderWidth200'
const colorPrimaryRef = ColorTokens_1.colorTokens['color.primary'].primitiveReferences.value; // Already a primitive token name: 'purple300'
/**
 * Accessibility token family
 *
 * Implementation uses compositional architecture - references existing tokens
 * rather than hard-coded values. This ensures consistency with the mathematical
 * token system and allows changes to propagate automatically.
 */
exports.accessibility = {
    /**
     * Focus Indicator Tokens
     *
     * Tokens for keyboard focus indicators that help users navigate
     * interfaces using keyboard controls.
     *
     * WCAG: 2.4.7 Focus Visible (Level AA)
     * WCAG: 1.4.11 Non-text Contrast (Level AA) - 3:1 minimum for focus indicators
     */
    focus: {
        /**
         * Focus indicator outline offset from component bounds
         *
         * @value 'space025' → 2px (primitive token reference)
         * @wcag 2.4.7 Focus Visible (Level AA)
         * @usage Position focus outline outside element bounds
         * @example outlineOffset: accessibility.focus.offset
         */
        offset: space025Ref,
        /**
         * Focus indicator outline width
         *
         * @value 'borderWidth200' → 2px (primitive token reference via border.emphasis)
         * @wcag 2.4.7 Focus Visible (Level AA)
         * @usage Render focus outline with specified width
         * @example outlineWidth: accessibility.focus.width
         */
        width: borderEmphasisRef,
        /**
         * Focus indicator outline color
         *
         * @value 'purple300' (primitive token reference via color.primary)
         * @wcag 2.4.7 Focus Visible (Level AA)
         * @wcag 1.4.11 Non-text Contrast (Level AA) - 3:1 minimum
         * @usage Apply color to focus outline
         * @example outlineColor: accessibility.focus.color
         */
        color: colorPrimaryRef,
    },
};
/**
 * Accessibility tokens as semantic token objects
 * Following the same pattern as ColorTokens for proper integration with the generation system
 */
const SemanticToken_1 = require("../../types/SemanticToken");
exports.accessibilityTokens = {
    'accessibility.focus.offset': {
        name: 'accessibility.focus.offset',
        primitiveReferences: { value: space025Ref },
        category: SemanticToken_1.SemanticCategory.ACCESSIBILITY,
        context: 'Focus indicator outline offset for keyboard navigation',
        description: 'WCAG 2.4.7 Focus Visible - positions outline outside element bounds (2px)'
    },
    'accessibility.focus.width': {
        name: 'accessibility.focus.width',
        primitiveReferences: { value: borderEmphasisRef },
        category: SemanticToken_1.SemanticCategory.ACCESSIBILITY,
        context: 'Focus indicator outline width for keyboard navigation',
        description: 'WCAG 2.4.7 Focus Visible - visible indicator thickness (2px)'
    },
    'accessibility.focus.color': {
        name: 'accessibility.focus.color',
        primitiveReferences: { value: colorPrimaryRef },
        category: SemanticToken_1.SemanticCategory.ACCESSIBILITY,
        context: 'Focus indicator outline color for keyboard navigation',
        description: 'WCAG 2.4.7 Focus Visible + 1.4.11 Non-text Contrast - 3:1 contrast minimum'
    },
};
/**
 * Array of all accessibility token names for iteration
 */
exports.accessibilityTokenNames = ['accessibility.focus.offset', 'accessibility.focus.width', 'accessibility.focus.color'];
/**
 * Get accessibility token by path
 * @example getAccessibilityToken('accessibility.focus.offset') => 'space050'
 */
function getAccessibilityToken(path) {
    const parts = path.split('.');
    if (parts[0] !== 'accessibility') {
        return undefined;
    }
    if (parts[1] === 'focus') {
        if (parts[2] === 'offset')
            return exports.accessibility.focus.offset;
        if (parts[2] === 'width')
            return exports.accessibility.focus.width;
        if (parts[2] === 'color')
            return exports.accessibility.focus.color;
    }
    return undefined;
}
/**
 * Get all accessibility tokens as array
 */
function getAllAccessibilityTokens() {
    return [
        { name: 'accessibility.focus.offset', value: exports.accessibility.focus.offset },
        { name: 'accessibility.focus.width', value: exports.accessibility.focus.width },
        { name: 'accessibility.focus.color', value: exports.accessibility.focus.color },
    ];
}
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
//# sourceMappingURL=AccessibilityTokens.js.map