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
export * from './ColorTokens';
export * from './SpacingTokens';
export * from './TypographyTokens';
export * from './BorderWidthTokens';
export * from './ShadowTokens';
export * from './OpacityTokens';
export * from './BlendTokens';
export * from './LayeringTokens';
export * from './GridSpacingTokens';
export { styleTokens, getStyleToken } from './StyleTokens';
export { colorTokens, colorTokenNames, getColorToken, getAllColorTokens, validateColorTokenCount } from './ColorTokens';
export { spacingTokens, layoutSpacing, insetSpacing } from './SpacingTokens';
export { typographyTokens, typographyTokenNames, getTypographyToken, getAllTypographyTokens } from './TypographyTokens';
export { shadowTokens, shadowTokenNames, getShadowToken, getAllShadowTokens } from './ShadowTokens';
export { SemanticBorderWidthTokens, borderDefault, borderEmphasis, borderHeavy } from './BorderWidthTokens';
export { opacityTokens, opacityTokenNames, getOpacityToken, getAllOpacityTokens, validateOpacityTokenCount } from './OpacityTokens';
export { blendTokens, blendTokenNames, getBlendToken, getAllBlendTokens, validateBlendTokenCount } from './BlendTokens';
export { zIndexTokens, zIndexTokenNames, getZIndexToken, getAllZIndexTokens, elevationTokens, elevationTokenNames, getElevationToken, getAllElevationTokens, getAllLayeringTokens, getLayeringTokensByPlatform } from './LayeringTokens';
export { gridSpacingTokens, gridSpacingTokenNames, getGridSpacingToken, getAllGridSpacingTokens } from './GridSpacingTokens';
import type { SemanticToken } from '../../types/SemanticToken';
import { SemanticCategory } from '../../types/SemanticToken';
/**
 * Get any semantic token by name across all categories
 * Searches color, spacing, typography, border, shadow, and opacity tokens
 */
export declare function getSemanticToken(name: string): Omit<SemanticToken, 'primitiveTokens'> | undefined;
/**
 * Get all semantic tokens across all categories
 */
export declare function getAllSemanticTokens(): Array<Omit<SemanticToken, 'primitiveTokens'>>;
/**
 * Get semantic tokens by category
 */
export declare function getSemanticTokensByCategory(category: SemanticCategory): Array<Omit<SemanticToken, 'primitiveTokens'>>;
/**
 * Validate semantic token structure
 * Checks that token has required fields and valid primitive references
 */
export declare function validateSemanticTokenStructure(token: Omit<SemanticToken, 'primitiveTokens'>): {
    valid: boolean;
    errors: string[];
};
/**
 * Get spacing token recommendations based on use case
 */
export declare function getSpacingRecommendation(useCase: 'layout' | 'inset', density?: 'tight' | 'normal' | 'loose' | 'comfortable' | 'spacious' | 'expansive'): string[];
/**
 * Get typography token recommendations based on use case
 */
export declare function getTypographyRecommendation(useCase: 'heading' | 'body' | 'ui' | 'specialized'): string[];
/**
 * Semantic token statistics
 */
export declare function getSemanticTokenStats(): {
    total: number;
    byCategory: Record<string, number>;
    colorTokens: number;
    typographyTokens: number;
    spacingTokens: number;
    borderTokens: number;
    shadowTokens: number;
    opacityTokens: number;
    blendTokens: number;
    zIndexTokens: number;
    elevationTokens: number;
    gridSpacingTokens: number;
};
//# sourceMappingURL=index.d.ts.map