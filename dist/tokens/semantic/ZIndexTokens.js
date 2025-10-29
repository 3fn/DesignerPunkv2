"use strict";
/**
 * Z-Index Tokens (Web + iOS)
 *
 * Part of the Layering Token System.
 * For Android layering, see ElevationTokens.ts
 *
 * Semantic tokens for stacking order on web and iOS platforms.
 * Use independently with shadow tokens for visual depth.
 *
 * Platform: Web, iOS
 * Android: Use elevation tokens instead
 *
 * Architecture Note:
 * Z-Index tokens are semantic-only tokens with no primitive token layer.
 * Unlike other token categories that follow a primitive→semantic hierarchy,
 * layering tokens use direct semantic values because:
 *
 * 1. No Mathematical Relationships: Z-index values are ordinal (ordering),
 *    not mathematical (relationships). There's no meaningful mathematical
 *    relationship between z-index 100 and 400.
 *
 * 2. Platform-Specific Scales: Web uses arbitrary z-index values (100, 200, 300),
 *    iOS uses small integers (1, 2, 3). These scales don't align mathematically.
 *
 * 3. Component-Driven: Layering is inherently about component stacking order
 *    (modal above dropdown), not mathematical progressions.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.zIndexTokenNames = exports.zIndexTokens = void 0;
exports.getZIndexToken = getZIndexToken;
exports.getAllZIndexTokens = getAllZIndexTokens;
const SemanticToken_1 = require("../../types/SemanticToken");
/**
 * Z-Index tokens for web and iOS platforms
 * Uses 100-based scale (100, 200, 300, 400, 500, 600) to allow for future insertion of intermediate levels
 *
 * Total: 6 semantic levels
 */
exports.zIndexTokens = {
    'zIndex.container': {
        name: 'zIndex.container',
        value: 100,
        platforms: ['web', 'ios'],
        category: SemanticToken_1.SemanticCategory.LAYERING,
        context: 'Container stacking order',
        description: 'Base z-index for container components (cards, panels, surfaces)'
    },
    'zIndex.navigation': {
        name: 'zIndex.navigation',
        value: 200,
        platforms: ['web', 'ios'],
        category: SemanticToken_1.SemanticCategory.LAYERING,
        context: 'Navigation and sticky elements',
        description: 'Z-index for persistent navigation (headers, sidebars, sticky elements)'
    },
    'zIndex.dropdown': {
        name: 'zIndex.dropdown',
        value: 300,
        platforms: ['web', 'ios'],
        category: SemanticToken_1.SemanticCategory.LAYERING,
        context: 'Dropdowns and popovers',
        description: 'Z-index for temporary overlay content (dropdowns, popovers, menus)'
    },
    'zIndex.modal': {
        name: 'zIndex.modal',
        value: 400,
        platforms: ['web', 'ios'],
        category: SemanticToken_1.SemanticCategory.LAYERING,
        context: 'Modal dialogs',
        description: 'Z-index for modal overlay content (dialogs, sheets, overlays)'
    },
    'zIndex.toast': {
        name: 'zIndex.toast',
        value: 500,
        platforms: ['web', 'ios'],
        category: SemanticToken_1.SemanticCategory.LAYERING,
        context: 'Toasts and notifications',
        description: 'Z-index for notification elements (toasts, snackbars, alerts)'
    },
    'zIndex.tooltip': {
        name: 'zIndex.tooltip',
        value: 600,
        platforms: ['web', 'ios'],
        category: SemanticToken_1.SemanticCategory.LAYERING,
        context: 'Tooltips and critical overlays',
        description: 'Highest z-index for always-visible elements (tooltips, critical overlays)'
    }
};
/**
 * Array of all z-index token names for iteration
 * Total: 6 tokens
 */
exports.zIndexTokenNames = Object.keys(exports.zIndexTokens);
/**
 * Get z-index token by name
 */
function getZIndexToken(name) {
    return exports.zIndexTokens[name];
}
/**
 * Get all z-index tokens as array
 */
function getAllZIndexTokens() {
    return Object.values(exports.zIndexTokens);
}
//# sourceMappingURL=ZIndexTokens.js.map