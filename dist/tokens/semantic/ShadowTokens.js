"use strict";
/**
 * Semantic Shadow Token Definitions
 *
 * Shadow semantic tokens compose primitive shadow tokens using string references
 * to create complete shadow styles for specific use cases.
 *
 * Each shadow token explicitly defines all shadow properties using multi-primitive structure:
 * - offsetX: Horizontal shadow offset based on light source position
 * - offsetY: Vertical shadow offset based on depth
 * - blur: Shadow blur amount based on quality and depth
 * - opacity: Shadow opacity based on quality and depth
 * - color: Shadow color based on lighting environment
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.shadowTokenNames = exports.shadowTokens = void 0;
exports.getShadowToken = getShadowToken;
exports.getAllShadowTokens = getAllShadowTokens;
const SemanticToken_1 = require("../../types/SemanticToken");
/**
 * Shadow semantic tokens for common UI shadow styles
 * Following compositional architecture with explicit multi-primitive composition
 */
exports.shadowTokens = {
    'shadow.container': {
        name: 'shadow.container',
        primitiveReferences: {
            offsetX: 'shadowOffsetX.000',
            offsetY: 'shadowOffsetY.100',
            blur: 'shadowBlurModerate',
            opacity: 'shadowOpacityModerate',
            color: 'color.shadow.default'
        },
        category: SemanticToken_1.SemanticCategory.SHADOW,
        context: 'Standard container shadow with noon lighting and moderate quality',
        description: 'Container shadow with no horizontal offset, 4px vertical offset, 12px blur, moderate opacity'
    },
    'shadow.modal': {
        name: 'shadow.modal',
        primitiveReferences: {
            offsetX: 'shadowOffsetX.000',
            offsetY: 'shadowOffsetY.200',
            blur: 'shadowBlurDepth200',
            opacity: 'shadowOpacityDepth200',
            color: 'color.shadow.default'
        },
        category: SemanticToken_1.SemanticCategory.SHADOW,
        context: 'Modal shadow with noon lighting and depth 200',
        description: 'Modal shadow with no horizontal offset, 8px vertical offset, 16px blur, slightly darker opacity'
    },
    'shadow.fab': {
        name: 'shadow.fab',
        primitiveReferences: {
            offsetX: 'shadowOffsetX.300',
            offsetY: 'shadowOffsetY.400',
            blur: 'shadowBlurHard',
            opacity: 'shadowOpacityHard',
            color: 'color.shadow.warm'
        },
        category: SemanticToken_1.SemanticCategory.SHADOW,
        context: 'Floating action button shadow with sunset lighting and hard quality',
        description: 'Dramatic shadow with 12px right offset, 16px down offset, 4px blur, darker opacity, warm (blue-gray) tint'
    },
    'shadow.hover': {
        name: 'shadow.hover',
        primitiveReferences: {
            offsetX: 'shadowOffsetX.000',
            offsetY: 'shadowOffsetY.100',
            blur: 'shadowBlurSoft',
            opacity: 'shadowOpacitySoft',
            color: 'color.shadow.default'
        },
        category: SemanticToken_1.SemanticCategory.SHADOW,
        context: 'Hover state shadow with noon lighting and soft quality',
        description: 'Subtle shadow with no horizontal offset, 4px vertical offset, 20px blur, lighter opacity'
    },
    // Directional shadow variations demonstrating sun arc framework
    'shadow.sunrise': {
        name: 'shadow.sunrise',
        primitiveReferences: {
            offsetX: 'shadowOffsetX.n300',
            offsetY: 'shadowOffsetY.200',
            blur: 'shadowBlurModerate',
            opacity: 'shadowOpacityModerate',
            color: 'color.shadow.warm'
        },
        category: SemanticToken_1.SemanticCategory.SHADOW,
        context: 'Sunrise lighting shadow with left offset and warm color',
        description: 'Shadow with -12px left offset, 8px vertical offset, 12px blur, moderate opacity, warm (blue-gray) tint for sunrise lighting'
    },
    'shadow.morning': {
        name: 'shadow.morning',
        primitiveReferences: {
            offsetX: 'shadowOffsetX.n150',
            offsetY: 'shadowOffsetY.200',
            blur: 'shadowBlurModerate',
            opacity: 'shadowOpacityModerate',
            color: 'color.shadow.default'
        },
        category: SemanticToken_1.SemanticCategory.SHADOW,
        context: 'Morning lighting shadow with medium left offset and default color',
        description: 'Shadow with -6px left offset, 8px vertical offset, 12px blur, moderate opacity, default color for morning lighting'
    },
    'shadow.noon': {
        name: 'shadow.noon',
        primitiveReferences: {
            offsetX: 'shadowOffsetX.000',
            offsetY: 'shadowOffsetY.200',
            blur: 'shadowBlurModerate',
            opacity: 'shadowOpacityModerate',
            color: 'color.shadow.default'
        },
        category: SemanticToken_1.SemanticCategory.SHADOW,
        context: 'Noon lighting shadow with no horizontal offset and default color',
        description: 'Shadow with no horizontal offset, 8px vertical offset, 12px blur, moderate opacity, default color for noon lighting'
    },
    // Easter egg: TW - "she lights me up" - Oct 2025
    'shadow.dusk': {
        name: 'shadow.dusk',
        primitiveReferences: {
            offsetX: 'shadowOffsetX.150',
            offsetY: 'shadowOffsetY.200',
            blur: 'shadowBlurModerate',
            opacity: 'shadowOpacityModerate',
            color: 'color.shadow.default'
        },
        category: SemanticToken_1.SemanticCategory.SHADOW,
        context: 'Dusk lighting shadow with medium right offset and default color',
        description: 'Shadow with 6px right offset, 8px vertical offset, 12px blur, moderate opacity, default color for dusk lighting',
        _meta: { dedicatedTo: 'Tracy Weiss', reason: 'illuminating inspiration' }
    },
    'shadow.sunset': {
        name: 'shadow.sunset',
        primitiveReferences: {
            offsetX: 'shadowOffsetX.300',
            offsetY: 'shadowOffsetY.200',
            blur: 'shadowBlurModerate',
            opacity: 'shadowOpacityModerate',
            color: 'color.shadow.warm'
        },
        category: SemanticToken_1.SemanticCategory.SHADOW,
        context: 'Sunset lighting shadow with right offset and warm color',
        description: 'Shadow with 12px right offset, 8px vertical offset, 12px blur, moderate opacity, warm (blue-gray) tint for sunset lighting'
    }
};
/**
 * Array of all shadow semantic token names for iteration
 */
exports.shadowTokenNames = Object.keys(exports.shadowTokens);
/**
 * Get shadow semantic token by name
 */
function getShadowToken(name) {
    return exports.shadowTokens[name];
}
/**
 * Get all shadow semantic tokens as array
 */
function getAllShadowTokens() {
    return Object.values(exports.shadowTokens);
}
//# sourceMappingURL=ShadowTokens.js.map