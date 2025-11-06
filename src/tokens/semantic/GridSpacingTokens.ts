/**
 * Semantic Grid Spacing Token Definitions
 * 
 * Grid spacing semantic tokens define gutter and margin values for responsive grid layouts.
 * These tokens reference existing mathematical spacing tokens for consistency with the 8px baseline grid.
 * 
 * Web platforms use breakpoint-specific tokens (Xs/Sm/Md/Lg) for responsive grid systems.
 * Native platforms use dedicated native tokens (gridGutterNative, gridMarginNative) for consistent spacing.
 * 
 * Token Categories:
 * - Grid Gutter: Spacing between grid columns
 * - Grid Margin: Container margins at page edges
 * 
 * Scaling Pattern:
 * Grid spacing scales with layout complexity to maintain visual hierarchy and readability.
 * More columns require more spacing to prevent visual crowding.
 */

import { SemanticToken, SemanticCategory } from '../../types/SemanticToken';

/**
 * Grid spacing semantic tokens for responsive layout spacing
 * Reference existing mathematical spacing tokens for consistency
 */
export const gridSpacingTokens: Record<string, Omit<SemanticToken, 'primitiveTokens'>> = {
  // Web Grid Gutter Tokens (spacing between columns)
  'gridGutterXs': {
    name: 'gridGutterXs',
    primitiveReferences: {
      spacing: 'space200' // 16px
    },
    category: SemanticCategory.SPACING,
    context: 'Grid gutter spacing for 4-column layouts (xs breakpoint)',
    description: 'Compact gutter spacing for mobile layouts with limited screen space'
  },

  'gridGutterSm': {
    name: 'gridGutterSm',
    primitiveReferences: {
      spacing: 'space250' // 20px
    },
    category: SemanticCategory.SPACING,
    context: 'Grid gutter spacing for 8-column layouts (sm breakpoint)',
    description: 'Standard gutter spacing for large mobile and small tablet layouts'
  },

  'gridGutterMd': {
    name: 'gridGutterMd',
    primitiveReferences: {
      spacing: 'space300' // 24px
    },
    category: SemanticCategory.SPACING,
    context: 'Grid gutter spacing for 12-column layouts (md breakpoint)',
    description: 'Comfortable gutter spacing for desktop and tablet layouts'
  },

  'gridGutterLg': {
    name: 'gridGutterLg',
    primitiveReferences: {
      spacing: 'space400' // 32px
    },
    category: SemanticCategory.SPACING,
    context: 'Grid gutter spacing for 16-column layouts (lg breakpoint)',
    description: 'Generous gutter spacing for large desktop and wide screen layouts'
  },

  // Web Grid Margin Tokens (container margins at page edges)
  'gridMarginXs': {
    name: 'gridMarginXs',
    primitiveReferences: {
      spacing: 'space300' // 24px
    },
    category: SemanticCategory.SPACING,
    context: 'Grid container margin for xs breakpoint layouts',
    description: 'Compact container margins for mobile layouts'
  },

  'gridMarginSm': {
    name: 'gridMarginSm',
    primitiveReferences: {
      spacing: 'space300' // 24px - Note: Design specifies space350 (28px) but token doesn't exist yet
    },
    category: SemanticCategory.SPACING,
    context: 'Grid container margin for sm breakpoint layouts',
    description: 'Standard container margins for large mobile layouts'
  },

  'gridMarginMd': {
    name: 'gridMarginMd',
    primitiveReferences: {
      spacing: 'space400' // 32px
    },
    category: SemanticCategory.SPACING,
    context: 'Grid container margin for md breakpoint layouts',
    description: 'Comfortable container margins for desktop layouts'
  },

  'gridMarginLg': {
    name: 'gridMarginLg',
    primitiveReferences: {
      spacing: 'space500' // 40px
    },
    category: SemanticCategory.SPACING,
    context: 'Grid container margin for lg breakpoint layouts',
    description: 'Generous container margins for large desktop layouts'
  },

  // Native Platform Grid Spacing Tokens (reference Sm-level values)
  'gridGutterNative': {
    name: 'gridGutterNative',
    primitiveReferences: {
      spacing: 'space250' // 20px - references Sm value
    },
    category: SemanticCategory.SPACING,
    context: 'Grid gutter spacing for native platforms (iOS, Android)',
    description: 'Standard gutter spacing for native adaptive layouts, equivalent to Sm-level web spacing'
  },

  'gridMarginNative': {
    name: 'gridMarginNative',
    primitiveReferences: {
      spacing: 'space300' // 24px - references Sm value (using existing token)
    },
    category: SemanticCategory.SPACING,
    context: 'Grid container margin for native platforms (iOS, Android)',
    description: 'Standard container margins for native adaptive layouts, equivalent to Sm-level web spacing'
  }
};

/**
 * Array of all grid spacing semantic token names for iteration
 */
export const gridSpacingTokenNames = Object.keys(gridSpacingTokens);

/**
 * Get grid spacing semantic token by name
 */
export function getGridSpacingToken(name: string): Omit<SemanticToken, 'primitiveTokens'> | undefined {
  return gridSpacingTokens[name];
}

/**
 * Get all grid spacing semantic tokens as array
 */
export function getAllGridSpacingTokens(): Array<Omit<SemanticToken, 'primitiveTokens'>> {
  return Object.values(gridSpacingTokens);
}
