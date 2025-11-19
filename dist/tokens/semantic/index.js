"use strict";
/**
 * Semantic Token Barrel Export and Utilities
 *
 * Semantic tokens provide contextual meaning by referencing primitive tokens.
 * They enable design intent while maintaining mathematical consistency.
 *
 * This module provides:
 * - Exports for all semantic token families (color, spacing, typography)
 * - Utility functions for semantic token access and validation
 * - Helper functions for hierarchical spacing token navigation
 * - Mode-aware color token resolution utilities
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllIconTokens = exports.getIconToken = exports.iconTokenNames = exports.iconTokens = exports.getAllGridSpacingTokens = exports.getGridSpacingToken = exports.gridSpacingTokenNames = exports.gridSpacingTokens = exports.getLayeringTokensByPlatform = exports.getAllLayeringTokens = exports.getAllElevationTokens = exports.getElevationToken = exports.elevationTokenNames = exports.elevationTokens = exports.getAllZIndexTokens = exports.getZIndexToken = exports.zIndexTokenNames = exports.zIndexTokens = exports.validateBlendTokenCount = exports.getAllBlendTokens = exports.getBlendToken = exports.blendTokenNames = exports.blendTokens = exports.validateOpacityTokenCount = exports.getAllOpacityTokens = exports.getOpacityToken = exports.opacityTokenNames = exports.opacityTokens = exports.borderHeavy = exports.borderEmphasis = exports.borderDefault = exports.SemanticBorderWidthTokens = exports.getAllShadowTokens = exports.getShadowToken = exports.shadowTokenNames = exports.shadowTokens = exports.getAllTypographyTokens = exports.getTypographyToken = exports.typographyTokenNames = exports.typographyTokens = exports.insetSpacing = exports.layoutSpacing = exports.spacingTokens = exports.validateColorTokenCount = exports.getAllColorTokens = exports.getColorToken = exports.colorTokenNames = exports.colorTokens = exports.getStyleToken = exports.styleTokens = void 0;
exports.generateIconSizeTokens = exports.calculateIconSize = void 0;
exports.getSemanticToken = getSemanticToken;
exports.getAllSemanticTokens = getAllSemanticTokens;
exports.getSemanticTokensByCategory = getSemanticTokensByCategory;
exports.validateSemanticTokenStructure = validateSemanticTokenStructure;
exports.getSpacingRecommendation = getSpacingRecommendation;
exports.getTypographyRecommendation = getTypographyRecommendation;
exports.getSemanticTokenStats = getSemanticTokenStats;
// Export all semantic token families
__exportStar(require("./ColorTokens"), exports);
__exportStar(require("./SpacingTokens"), exports);
__exportStar(require("./TypographyTokens"), exports);
__exportStar(require("./BorderWidthTokens"), exports);
__exportStar(require("./ShadowTokens"), exports);
__exportStar(require("./OpacityTokens"), exports);
__exportStar(require("./BlendTokens"), exports);
__exportStar(require("./LayeringTokens"), exports);
__exportStar(require("./GridSpacingTokens"), exports);
__exportStar(require("./IconTokens"), exports);
// StyleTokens placeholder - will be implemented in future tasks
var StyleTokens_1 = require("./StyleTokens");
Object.defineProperty(exports, "styleTokens", { enumerable: true, get: function () { return StyleTokens_1.styleTokens; } });
Object.defineProperty(exports, "getStyleToken", { enumerable: true, get: function () { return StyleTokens_1.getStyleToken; } });
// Re-export specific token collections for convenience
var ColorTokens_1 = require("./ColorTokens");
Object.defineProperty(exports, "colorTokens", { enumerable: true, get: function () { return ColorTokens_1.colorTokens; } });
Object.defineProperty(exports, "colorTokenNames", { enumerable: true, get: function () { return ColorTokens_1.colorTokenNames; } });
Object.defineProperty(exports, "getColorToken", { enumerable: true, get: function () { return ColorTokens_1.getColorToken; } });
Object.defineProperty(exports, "getAllColorTokens", { enumerable: true, get: function () { return ColorTokens_1.getAllColorTokens; } });
Object.defineProperty(exports, "validateColorTokenCount", { enumerable: true, get: function () { return ColorTokens_1.validateColorTokenCount; } });
var SpacingTokens_1 = require("./SpacingTokens");
Object.defineProperty(exports, "spacingTokens", { enumerable: true, get: function () { return SpacingTokens_1.spacingTokens; } });
Object.defineProperty(exports, "layoutSpacing", { enumerable: true, get: function () { return SpacingTokens_1.layoutSpacing; } });
Object.defineProperty(exports, "insetSpacing", { enumerable: true, get: function () { return SpacingTokens_1.insetSpacing; } });
var TypographyTokens_1 = require("./TypographyTokens");
Object.defineProperty(exports, "typographyTokens", { enumerable: true, get: function () { return TypographyTokens_1.typographyTokens; } });
Object.defineProperty(exports, "typographyTokenNames", { enumerable: true, get: function () { return TypographyTokens_1.typographyTokenNames; } });
Object.defineProperty(exports, "getTypographyToken", { enumerable: true, get: function () { return TypographyTokens_1.getTypographyToken; } });
Object.defineProperty(exports, "getAllTypographyTokens", { enumerable: true, get: function () { return TypographyTokens_1.getAllTypographyTokens; } });
var ShadowTokens_1 = require("./ShadowTokens");
Object.defineProperty(exports, "shadowTokens", { enumerable: true, get: function () { return ShadowTokens_1.shadowTokens; } });
Object.defineProperty(exports, "shadowTokenNames", { enumerable: true, get: function () { return ShadowTokens_1.shadowTokenNames; } });
Object.defineProperty(exports, "getShadowToken", { enumerable: true, get: function () { return ShadowTokens_1.getShadowToken; } });
Object.defineProperty(exports, "getAllShadowTokens", { enumerable: true, get: function () { return ShadowTokens_1.getAllShadowTokens; } });
var BorderWidthTokens_1 = require("./BorderWidthTokens");
Object.defineProperty(exports, "SemanticBorderWidthTokens", { enumerable: true, get: function () { return BorderWidthTokens_1.SemanticBorderWidthTokens; } });
Object.defineProperty(exports, "borderDefault", { enumerable: true, get: function () { return BorderWidthTokens_1.borderDefault; } });
Object.defineProperty(exports, "borderEmphasis", { enumerable: true, get: function () { return BorderWidthTokens_1.borderEmphasis; } });
Object.defineProperty(exports, "borderHeavy", { enumerable: true, get: function () { return BorderWidthTokens_1.borderHeavy; } });
var OpacityTokens_1 = require("./OpacityTokens");
Object.defineProperty(exports, "opacityTokens", { enumerable: true, get: function () { return OpacityTokens_1.opacityTokens; } });
Object.defineProperty(exports, "opacityTokenNames", { enumerable: true, get: function () { return OpacityTokens_1.opacityTokenNames; } });
Object.defineProperty(exports, "getOpacityToken", { enumerable: true, get: function () { return OpacityTokens_1.getOpacityToken; } });
Object.defineProperty(exports, "getAllOpacityTokens", { enumerable: true, get: function () { return OpacityTokens_1.getAllOpacityTokens; } });
Object.defineProperty(exports, "validateOpacityTokenCount", { enumerable: true, get: function () { return OpacityTokens_1.validateOpacityTokenCount; } });
var BlendTokens_1 = require("./BlendTokens");
Object.defineProperty(exports, "blendTokens", { enumerable: true, get: function () { return BlendTokens_1.blendTokens; } });
Object.defineProperty(exports, "blendTokenNames", { enumerable: true, get: function () { return BlendTokens_1.blendTokenNames; } });
Object.defineProperty(exports, "getBlendToken", { enumerable: true, get: function () { return BlendTokens_1.getBlendToken; } });
Object.defineProperty(exports, "getAllBlendTokens", { enumerable: true, get: function () { return BlendTokens_1.getAllBlendTokens; } });
Object.defineProperty(exports, "validateBlendTokenCount", { enumerable: true, get: function () { return BlendTokens_1.validateBlendTokenCount; } });
var LayeringTokens_1 = require("./LayeringTokens");
Object.defineProperty(exports, "zIndexTokens", { enumerable: true, get: function () { return LayeringTokens_1.zIndexTokens; } });
Object.defineProperty(exports, "zIndexTokenNames", { enumerable: true, get: function () { return LayeringTokens_1.zIndexTokenNames; } });
Object.defineProperty(exports, "getZIndexToken", { enumerable: true, get: function () { return LayeringTokens_1.getZIndexToken; } });
Object.defineProperty(exports, "getAllZIndexTokens", { enumerable: true, get: function () { return LayeringTokens_1.getAllZIndexTokens; } });
Object.defineProperty(exports, "elevationTokens", { enumerable: true, get: function () { return LayeringTokens_1.elevationTokens; } });
Object.defineProperty(exports, "elevationTokenNames", { enumerable: true, get: function () { return LayeringTokens_1.elevationTokenNames; } });
Object.defineProperty(exports, "getElevationToken", { enumerable: true, get: function () { return LayeringTokens_1.getElevationToken; } });
Object.defineProperty(exports, "getAllElevationTokens", { enumerable: true, get: function () { return LayeringTokens_1.getAllElevationTokens; } });
Object.defineProperty(exports, "getAllLayeringTokens", { enumerable: true, get: function () { return LayeringTokens_1.getAllLayeringTokens; } });
Object.defineProperty(exports, "getLayeringTokensByPlatform", { enumerable: true, get: function () { return LayeringTokens_1.getLayeringTokensByPlatform; } });
var GridSpacingTokens_1 = require("./GridSpacingTokens");
Object.defineProperty(exports, "gridSpacingTokens", { enumerable: true, get: function () { return GridSpacingTokens_1.gridSpacingTokens; } });
Object.defineProperty(exports, "gridSpacingTokenNames", { enumerable: true, get: function () { return GridSpacingTokens_1.gridSpacingTokenNames; } });
Object.defineProperty(exports, "getGridSpacingToken", { enumerable: true, get: function () { return GridSpacingTokens_1.getGridSpacingToken; } });
Object.defineProperty(exports, "getAllGridSpacingTokens", { enumerable: true, get: function () { return GridSpacingTokens_1.getAllGridSpacingTokens; } });
var IconTokens_1 = require("./IconTokens");
Object.defineProperty(exports, "iconTokens", { enumerable: true, get: function () { return IconTokens_1.iconTokens; } });
Object.defineProperty(exports, "iconTokenNames", { enumerable: true, get: function () { return IconTokens_1.iconTokenNames; } });
Object.defineProperty(exports, "getIconToken", { enumerable: true, get: function () { return IconTokens_1.getIconToken; } });
Object.defineProperty(exports, "getAllIconTokens", { enumerable: true, get: function () { return IconTokens_1.getAllIconTokens; } });
Object.defineProperty(exports, "calculateIconSize", { enumerable: true, get: function () { return IconTokens_1.calculateIconSize; } });
Object.defineProperty(exports, "generateIconSizeTokens", { enumerable: true, get: function () { return IconTokens_1.generateIconSizeTokens; } });
const SemanticToken_1 = require("../../types/SemanticToken");
const ColorTokens_2 = require("./ColorTokens");
const SpacingTokens_2 = require("./SpacingTokens");
const TypographyTokens_2 = require("./TypographyTokens");
const BorderWidthTokens_2 = require("./BorderWidthTokens");
const ShadowTokens_2 = require("./ShadowTokens");
const OpacityTokens_2 = require("./OpacityTokens");
const BlendTokens_2 = require("./BlendTokens");
const LayeringTokens_2 = require("./LayeringTokens");
const GridSpacingTokens_2 = require("./GridSpacingTokens");
const IconTokens_2 = require("./IconTokens");
/**
 * Get any semantic token by name across all categories
 * Searches color, spacing, typography, border, shadow, and opacity tokens
 */
function getSemanticToken(name) {
    // Check color tokens
    if (name.startsWith('color.')) {
        return ColorTokens_2.colorTokens[name];
    }
    // Check typography tokens
    if (name.startsWith('typography.')) {
        return TypographyTokens_2.typographyTokens[name];
    }
    // Check spacing tokens (hierarchical structure)
    if (name.startsWith('space.')) {
        return getSpacingTokenByPath(name);
    }
    // Check border tokens
    if (name.startsWith('border.')) {
        const borderName = name.replace('border.', '');
        const token = BorderWidthTokens_2.SemanticBorderWidthTokens[borderName];
        if (token) {
            return {
                name,
                primitiveReferences: { value: token.value },
                category: SemanticToken_1.SemanticCategory.BORDER,
                context: `Border width for ${borderName.replace(/([A-Z])/g, ' $1').toLowerCase().trim()}`,
                description: `Semantic border width token: ${borderName}`
            };
        }
    }
    // Check shadow tokens
    if (name.startsWith('shadow.')) {
        return ShadowTokens_2.shadowTokens[name];
    }
    // Check opacity tokens
    if (name.startsWith('opacity.')) {
        return OpacityTokens_2.opacityTokens[name];
    }
    // Check blend tokens
    if (name.startsWith('blend.')) {
        return BlendTokens_2.blendTokens[name];
    }
    // Check z-index tokens
    if (name.startsWith('zIndex.')) {
        return LayeringTokens_2.zIndexTokens[name];
    }
    // Check elevation tokens
    if (name.startsWith('elevation.')) {
        return LayeringTokens_2.elevationTokens[name];
    }
    // Check grid spacing tokens
    if (name.startsWith('grid')) {
        return GridSpacingTokens_2.gridSpacingTokens[name];
    }
    // Check icon tokens
    if (name.startsWith('icon.')) {
        return IconTokens_2.iconTokens[name];
    }
    return undefined;
}
/**
 * Get spacing token by hierarchical path
 * Examples: 'space.grouped.normal', 'space.inset.comfortable'
 */
function getSpacingTokenByPath(path) {
    const parts = path.split('.');
    if (parts.length !== 3 || parts[0] !== 'space') {
        return undefined;
    }
    const [, category, level] = parts;
    // Navigate the hierarchical spacing structure
    const categoryTokens = SpacingTokens_2.spacingTokens[category];
    if (!categoryTokens) {
        return undefined;
    }
    const token = categoryTokens[level];
    if (!token || !token.value) {
        return undefined;
    }
    // Convert spacing token structure to SemanticToken format
    return {
        name: path,
        primitiveReferences: { value: token.value },
        category: SemanticToken_1.SemanticCategory.SPACING,
        context: getSpacingContext(category, level),
        description: getSpacingDescription(category, level)
    };
}
/**
 * Get contextual description for spacing tokens
 */
function getSpacingContext(category, level) {
    const contexts = {
        grouped: {
            minimal: 'Extremely tight grouping for metadata and labels',
            tight: 'Tight grouping for closely related elements',
            normal: 'Standard grouping for form fields and related elements',
            loose: 'Generous grouping for related cards'
        },
        related: {
            tight: 'Minimal related separation',
            normal: 'Standard related separation',
            loose: 'Generous related separation'
        },
        separated: {
            tight: 'Minimal separated distinction',
            normal: 'Standard separated distinction',
            loose: 'Generous separated distinction'
        },
        sectioned: {
            tight: 'Minimal section boundary',
            normal: 'Standard section boundary',
            loose: 'Generous section boundary'
        },
        inset: {
            tight: 'High-density interfaces (compact, efficient)',
            normal: 'Standard-density interfaces (balanced)',
            comfortable: 'Low-density interfaces (generous, content-focused)',
            spacious: 'Very low-density interfaces (emphasis, breathing room)',
            expansive: 'Maximum breathing room (heroes, feature sections)'
        }
    };
    return contexts[category]?.[level] || 'Spacing token';
}
/**
 * Get detailed description for spacing tokens
 */
function getSpacingDescription(category, level) {
    if (category === 'inset') {
        return `Inset spacing for ${level} density interfaces`;
    }
    return `Layout spacing for ${category} elements with ${level} separation`;
}
/**
 * Get all semantic tokens across all categories
 */
function getAllSemanticTokens() {
    const tokens = [];
    // Add color tokens
    tokens.push(...Object.values(ColorTokens_2.colorTokens));
    // Add typography tokens
    tokens.push(...Object.values(TypographyTokens_2.typographyTokens));
    // Add shadow tokens
    tokens.push(...Object.values(ShadowTokens_2.shadowTokens));
    // Add opacity tokens
    tokens.push(...Object.values(OpacityTokens_2.opacityTokens));
    // Add blend tokens
    tokens.push(...Object.values(BlendTokens_2.blendTokens));
    // Add z-index tokens
    tokens.push(...Object.values(LayeringTokens_2.zIndexTokens));
    // Add elevation tokens
    tokens.push(...Object.values(LayeringTokens_2.elevationTokens));
    // Add grid spacing tokens
    tokens.push(...Object.values(GridSpacingTokens_2.gridSpacingTokens));
    // Add icon tokens
    tokens.push(...Object.values(IconTokens_2.iconTokens));
    // Add border width tokens
    for (const [name, token] of Object.entries(BorderWidthTokens_2.SemanticBorderWidthTokens)) {
        tokens.push({
            name: `border.${name}`,
            primitiveReferences: { value: token.value },
            category: SemanticToken_1.SemanticCategory.BORDER,
            context: `Border width for ${name.replace(/([A-Z])/g, ' $1').toLowerCase().trim()}`,
            description: `Semantic border width token: ${name}`
        });
    }
    // Add spacing tokens (flatten hierarchical structure)
    for (const [category, levels] of Object.entries(SpacingTokens_2.spacingTokens)) {
        for (const [level, token] of Object.entries(levels)) {
            const path = `space.${category}.${level}`;
            const semanticToken = getSpacingTokenByPath(path);
            if (semanticToken) {
                tokens.push(semanticToken);
            }
        }
    }
    return tokens;
}
/**
 * Get semantic tokens by category
 */
function getSemanticTokensByCategory(category) {
    switch (category) {
        case SemanticToken_1.SemanticCategory.COLOR:
            return Object.values(ColorTokens_2.colorTokens);
        case SemanticToken_1.SemanticCategory.TYPOGRAPHY:
            return Object.values(TypographyTokens_2.typographyTokens);
        case SemanticToken_1.SemanticCategory.SPACING:
            return getAllSemanticTokens().filter(t => t.category === SemanticToken_1.SemanticCategory.SPACING);
        case SemanticToken_1.SemanticCategory.BORDER:
            return getAllSemanticTokens().filter(t => t.category === SemanticToken_1.SemanticCategory.BORDER);
        case SemanticToken_1.SemanticCategory.SHADOW:
            return Object.values(ShadowTokens_2.shadowTokens);
        case SemanticToken_1.SemanticCategory.INTERACTION:
            return [...Object.values(OpacityTokens_2.opacityTokens), ...Object.values(BlendTokens_2.blendTokens)];
        case SemanticToken_1.SemanticCategory.LAYERING:
            return [...Object.values(LayeringTokens_2.zIndexTokens), ...Object.values(LayeringTokens_2.elevationTokens)];
        case SemanticToken_1.SemanticCategory.ICON:
            return Object.values(IconTokens_2.iconTokens);
        default:
            return [];
    }
}
/**
 * Validate semantic token structure
 * Checks that token has required fields and valid primitive references
 */
function validateSemanticTokenStructure(token) {
    const errors = [];
    if (!token.name || typeof token.name !== 'string') {
        errors.push('Token must have a valid name');
    }
    if (!token.primitiveReferences || typeof token.primitiveReferences !== 'object') {
        errors.push('Token must have primitiveReferences object');
    }
    else if (Object.keys(token.primitiveReferences).length === 0) {
        errors.push('Token must reference at least one primitive token');
    }
    if (!token.category || !Object.values(SemanticToken_1.SemanticCategory).includes(token.category)) {
        errors.push('Token must have a valid category');
    }
    if (!token.context || typeof token.context !== 'string') {
        errors.push('Token must have a context description');
    }
    if (!token.description || typeof token.description !== 'string') {
        errors.push('Token must have a description');
    }
    return {
        valid: errors.length === 0,
        errors
    };
}
/**
 * Get spacing token recommendations based on use case
 */
function getSpacingRecommendation(useCase, density) {
    if (useCase === 'inset') {
        return [
            'space.inset.tight',
            'space.inset.normal',
            'space.inset.comfortable',
            'space.inset.spacious',
            'space.inset.expansive'
        ];
    }
    // Layout recommendations
    const recommendations = [];
    const levels = density ? [density] : ['tight', 'normal', 'loose'];
    for (const category of ['grouped', 'related', 'separated', 'sectioned']) {
        for (const level of levels) {
            const path = `space.${category}.${level}`;
            if (getSpacingTokenByPath(path)) {
                recommendations.push(path);
            }
        }
    }
    return recommendations;
}
/**
 * Get typography token recommendations based on use case
 */
function getTypographyRecommendation(useCase) {
    const recommendations = {
        heading: [
            'typography.h1',
            'typography.h2',
            'typography.h3',
            'typography.h4',
            'typography.h5',
            'typography.h6',
            'typography.display'
        ],
        body: [
            'typography.bodyMd',
            'typography.bodySm',
            'typography.bodyLg'
        ],
        ui: [
            'typography.buttonMd',
            'typography.input',
            'typography.label'
        ],
        specialized: [
            'typography.caption',
            'typography.legal',
            'typography.display'
        ]
    };
    return recommendations[useCase] || [];
}
/**
 * Semantic token statistics
 */
function getSemanticTokenStats() {
    const allTokens = getAllSemanticTokens();
    const categoryCount = {};
    for (const token of allTokens) {
        categoryCount[token.category] = (categoryCount[token.category] || 0) + 1;
    }
    return {
        total: allTokens.length,
        byCategory: categoryCount,
        colorTokens: Object.keys(ColorTokens_2.colorTokens).length,
        typographyTokens: Object.keys(TypographyTokens_2.typographyTokens).length,
        spacingTokens: allTokens.filter(t => t.category === SemanticToken_1.SemanticCategory.SPACING).length,
        borderTokens: Object.keys(BorderWidthTokens_2.SemanticBorderWidthTokens).length,
        shadowTokens: Object.keys(ShadowTokens_2.shadowTokens).length,
        opacityTokens: Object.keys(OpacityTokens_2.opacityTokens).length,
        blendTokens: Object.keys(BlendTokens_2.blendTokens).length,
        zIndexTokens: Object.keys(LayeringTokens_2.zIndexTokens).length,
        elevationTokens: Object.keys(LayeringTokens_2.elevationTokens).length,
        gridSpacingTokens: Object.keys(GridSpacingTokens_2.gridSpacingTokens).length,
        iconTokens: Object.keys(IconTokens_2.iconTokens).length
    };
}
//# sourceMappingURL=index.js.map