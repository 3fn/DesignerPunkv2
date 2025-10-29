"use strict";
/**
 * Semantic Blend Token Definitions
 *
 * Semantic blend tokens provide contextual meaning for common color modification use cases.
 * All tokens reference primitive blend tokens with explicit blend direction to maintain
 * mathematical consistency and clear intent.
 *
 * Blend Directions:
 * - darker: Overlay black at specified opacity (for light backgrounds)
 * - lighter: Overlay white at specified opacity (for dark backgrounds)
 * - saturate: Increase color saturation in HSL space (for focus/emphasis)
 * - desaturate: Decrease color saturation in HSL space (for disabled states)
 *
 * Use Cases:
 * - blendHoverDarker: Standard hover feedback with darkening (8% darker)
 * - blendHoverLighter: Hover feedback on dark backgrounds (8% lighter)
 * - blendPressedDarker: Pressed state feedback with darkening (12% darker)
 * - blendFocusSaturate: Focus state with increased saturation (8% more saturated)
 * - blendDisabledDesaturate: Disabled state with decreased saturation (12% less saturated)
 * - blendContainerHoverDarker: Subtle container hover feedback (4% darker)
 *
 * Total: 6 semantic blend tokens
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.blendTokenNames = exports.blendTokens = void 0;
exports.getBlendToken = getBlendToken;
exports.getAllBlendTokens = getAllBlendTokens;
exports.validateBlendTokenCount = validateBlendTokenCount;
const BlendTokens_1 = require("../BlendTokens");
/**
 * Semantic blend tokens for common interaction states
 * Total: 6 tokens
 */
exports.blendTokens = {
    'blend.hoverDarker': {
        name: 'blend.hoverDarker',
        primitiveReference: 'blend200',
        direction: BlendTokens_1.BlendDirection.DARKER,
        category: 'interaction',
        context: 'Standard hover feedback - darker color for light backgrounds',
        description: 'Blend for hover states with darkening (8% darker) - provides noticeable feedback on light-colored buttons, cards, and interactive elements'
    },
    'blend.hoverLighter': {
        name: 'blend.hoverLighter',
        primitiveReference: 'blend200',
        direction: BlendTokens_1.BlendDirection.LIGHTER,
        category: 'interaction',
        context: 'Hover feedback on dark backgrounds - lighter color for dark surfaces',
        description: 'Blend for hover states with lightening (8% lighter) - provides noticeable feedback on dark-colored buttons, cards, and interactive elements'
    },
    'blend.pressedDarker': {
        name: 'blend.pressedDarker',
        primitiveReference: 'blend300',
        direction: BlendTokens_1.BlendDirection.DARKER,
        category: 'interaction',
        context: 'Pressed state feedback - clear darkening for active press',
        description: 'Blend for pressed states with darkening (12% darker) - provides clear visual feedback when buttons or interactive elements are actively pressed'
    },
    'blend.focusSaturate': {
        name: 'blend.focusSaturate',
        primitiveReference: 'blend200',
        direction: BlendTokens_1.BlendDirection.SATURATE,
        category: 'interaction',
        context: 'Focus state feedback - more vibrant, attention-drawing color',
        description: 'Blend for focus states with saturation increase (8% more saturated) - creates energized, attention-drawing appearance for focused interactive elements'
    },
    'blend.disabledDesaturate': {
        name: 'blend.disabledDesaturate',
        primitiveReference: 'blend300',
        direction: BlendTokens_1.BlendDirection.DESATURATE,
        category: 'interaction',
        context: 'Disabled state appearance - muted, inactive color',
        description: 'Blend for disabled states with desaturation (12% less saturated) - creates muted, inactive appearance indicating non-interactive state'
    },
    'blend.containerHoverDarker': {
        name: 'blend.containerHoverDarker',
        primitiveReference: 'blend100',
        direction: BlendTokens_1.BlendDirection.DARKER,
        category: 'interaction',
        context: 'Subtle container hover - gentle surface feedback for large areas',
        description: 'Blend for container/surface hover with subtle darkening (4% darker) - provides gentle feedback for large interactive surfaces like cards, tiles, and list items'
    }
};
/**
 * Array of all blend semantic token names for iteration
 * Total: 6 tokens
 */
exports.blendTokenNames = Object.keys(exports.blendTokens);
/**
 * Get blend semantic token by name
 */
function getBlendToken(name) {
    return exports.blendTokens[name];
}
/**
 * Get all blend semantic tokens as array
 */
function getAllBlendTokens() {
    return Object.values(exports.blendTokens);
}
/**
 * Validate token count matches spec (6 tokens)
 */
function validateBlendTokenCount() {
    const expectedCount = 6;
    const actualCount = exports.blendTokenNames.length;
    if (actualCount !== expectedCount) {
        console.warn(`Blend token count mismatch: expected ${expectedCount}, got ${actualCount}`);
        return false;
    }
    return true;
}
/**
 * AI Agent Guidance for Blend Token Selection
 *
 * When applying blend modifications to colors:
 *
 * 1. Standard hover on light backgrounds?
 *    → Use blend.hoverDarker (8% darker)
 *    → Provides noticeable darkening for buttons, cards, interactive elements
 *
 * 2. Hover on dark backgrounds?
 *    → Use blend.hoverLighter (8% lighter)
 *    → Provides noticeable lightening for dark-themed interactive elements
 *
 * 3. Pressed/active states?
 *    → Use blend.pressedDarker (12% darker)
 *    → Provides clear feedback for active button press or interaction
 *
 * 4. Focus states needing emphasis?
 *    → Use blend.focusSaturate (8% more saturated)
 *    → Creates vibrant, attention-drawing appearance for focused elements
 *
 * 5. Disabled states?
 *    → Use blend.disabledDesaturate (12% less saturated)
 *    → Creates muted appearance indicating non-interactive state
 *
 * 6. Large container/surface hover?
 *    → Use blend.containerHoverDarker (4% darker)
 *    → Provides subtle feedback for cards, tiles, list items without being overwhelming
 *
 * 7. Custom blend needs?
 *    → Use primitive blend tokens (blend100, blend200, etc.) with explicit direction
 *    → Semantic tokens cover common use cases; primitives provide flexibility
 *
 * 8. Compositional patterns?
 *    → Combine with color tokens: "color with blend direction"
 *    → Example: "purple500 with blend.hoverDarker" for button hover state
 *    → Can compose with opacity: "color with blend direction at opacity"
 *    → Example: "purple500 with blend.hoverDarker at opacity600" for complex effects
 *
 * 9. Semantic vs Component Boundary?
 *    → Semantic tokens (this file): Generic, reusable patterns for interaction states
 *    → Component tokens (component library): Component-specific compositions
 *    → Example: button.hover uses blend.hoverDarker, but defined in component library
 */
//# sourceMappingURL=BlendTokens.js.map