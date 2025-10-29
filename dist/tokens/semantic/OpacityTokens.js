"use strict";
/**
 * Semantic Opacity Token Definitions
 *
 * Semantic opacity tokens provide contextual meaning for common transparency use cases.
 * All tokens reference primitive opacity tokens to maintain mathematical consistency.
 *
 * Use Cases:
 * - opacityDisabled: Disabled UI elements with faded appearance
 * - opacityOverlay: Modal scrims and overlays that block background interaction
 * - opacityHover: Subtle hover feedback for interactive elements
 * - opacityPressed: Pressed state feedback for buttons and interactive elements
 * - opacityLoading: Loading skeleton states and placeholders
 *
 * Total: 5 semantic opacity tokens
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.opacityTokenNames = exports.opacityTokens = void 0;
exports.getOpacityToken = getOpacityToken;
exports.getAllOpacityTokens = getAllOpacityTokens;
exports.validateOpacityTokenCount = validateOpacityTokenCount;
const SemanticToken_1 = require("../../types/SemanticToken");
/**
 * Semantic opacity tokens for common use cases
 * Total: 5 tokens
 */
exports.opacityTokens = {
    'opacity.disabled': {
        name: 'opacity.disabled',
        primitiveReferences: { value: 'opacity600' },
        category: SemanticToken_1.SemanticCategory.INTERACTION,
        context: 'Disabled UI elements - faded, inactive appearance indicating non-interactive state',
        description: 'Opacity for disabled states (48% opacity) - creates faded appearance for buttons, inputs, and other disabled UI elements'
    },
    'opacity.overlay': {
        name: 'opacity.overlay',
        primitiveReferences: { value: 'opacity400' },
        category: SemanticToken_1.SemanticCategory.INTERACTION,
        context: 'Modal scrims and overlays - blocks background interaction while maintaining context',
        description: 'Opacity for modal backdrops and overlays (32% opacity) - provides visual separation while keeping background content visible'
    },
    'opacity.hover': {
        name: 'opacity.hover',
        primitiveReferences: { value: 'opacity100' },
        category: SemanticToken_1.SemanticCategory.INTERACTION,
        context: 'Subtle hover feedback - gentle transparency change for interactive elements',
        description: 'Opacity for subtle hover states (8% opacity) - provides gentle visual feedback on hover without being intrusive'
    },
    'opacity.pressed': {
        name: 'opacity.pressed',
        primitiveReferences: { value: 'opacity200' },
        category: SemanticToken_1.SemanticCategory.INTERACTION,
        context: 'Pressed state feedback - noticeable transparency change indicating active press',
        description: 'Opacity for pressed states (16% opacity) - provides clear visual feedback when buttons or interactive elements are pressed'
    },
    'opacity.loading': {
        name: 'opacity.loading',
        primitiveReferences: { value: 'opacity200' },
        category: SemanticToken_1.SemanticCategory.INTERACTION,
        context: 'Loading skeleton states - subtle, non-intrusive loading indicators',
        description: 'Opacity for loading skeletons and placeholders (16% opacity) - creates subtle loading states that don\'t distract from content'
    }
};
/**
 * Array of all opacity semantic token names for iteration
 * Total: 5 tokens
 */
exports.opacityTokenNames = Object.keys(exports.opacityTokens);
/**
 * Get opacity semantic token by name
 */
function getOpacityToken(name) {
    return exports.opacityTokens[name];
}
/**
 * Get all opacity semantic tokens as array
 */
function getAllOpacityTokens() {
    return Object.values(exports.opacityTokens);
}
/**
 * Validate token count matches spec (5 tokens)
 */
function validateOpacityTokenCount() {
    const expectedCount = 5;
    const actualCount = exports.opacityTokenNames.length;
    if (actualCount !== expectedCount) {
        console.warn(`Opacity token count mismatch: expected ${expectedCount}, got ${actualCount}`);
        return false;
    }
    return true;
}
/**
 * AI Agent Guidance for Opacity Token Selection
 *
 * When applying opacity to UI elements:
 *
 * 1. Disabled states?
 *    → Use opacity.disabled (48% opacity)
 *    → Creates faded appearance for non-interactive elements
 *
 * 2. Modal overlays or scrims?
 *    → Use opacity.overlay (32% opacity)
 *    → Blocks interaction while maintaining background context
 *
 * 3. Hover feedback?
 *    → Use opacity.hover (8% opacity)
 *    → Subtle transparency change for gentle feedback
 *
 * 4. Pressed/active states?
 *    → Use opacity.pressed (16% opacity)
 *    → Noticeable feedback for active interactions
 *
 * 5. Loading states or skeletons?
 *    → Use opacity.loading (16% opacity)
 *    → Non-intrusive loading indicators
 *
 * 6. Custom opacity needs?
 *    → Use primitive opacity tokens (opacity100, opacity200, etc.)
 *    → Semantic tokens cover common use cases; primitives provide flexibility
 *
 * 7. Compositional patterns?
 *    → Combine with color tokens: "color at opacity"
 *    → Example: "purple500 at opacity.disabled" for disabled button
 */
//# sourceMappingURL=OpacityTokens.js.map