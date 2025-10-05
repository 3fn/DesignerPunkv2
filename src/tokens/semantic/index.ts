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

// Export all semantic token families
export * from './ColorTokens';
export * from './SpacingTokens';
export * from './TypographyTokens';

// StyleTokens placeholder - will be implemented in future tasks
export { styleTokens, getStyleToken } from './StyleTokens';

// Re-export specific token collections for convenience
export {
  colorTokens,
  colorTokenNames,
  getColorToken,
  getAllColorTokens,
  validateColorTokenCount
} from './ColorTokens';

export {
  spacingTokens,
  layoutSpacing,
  insetSpacing
} from './SpacingTokens';

export {
  typographyTokens,
  typographyTokenNames,
  getTypographyToken,
  getAllTypographyTokens
} from './TypographyTokens';

// Import types for utility functions
import type { SemanticToken } from '../../types/SemanticToken';
import { SemanticCategory } from '../../types/SemanticToken';
import { colorTokens } from './ColorTokens';
import { spacingTokens } from './SpacingTokens';
import { typographyTokens } from './TypographyTokens';

/**
 * Get any semantic token by name across all categories
 * Searches color, spacing, and typography tokens
 */
export function getSemanticToken(name: string): Omit<SemanticToken, 'primitiveTokens'> | undefined {
  // Check color tokens
  if (name.startsWith('color.')) {
    return colorTokens[name];
  }
  
  // Check typography tokens
  if (name.startsWith('typography.')) {
    return typographyTokens[name];
  }
  
  // Check spacing tokens (hierarchical structure)
  if (name.startsWith('space.')) {
    return getSpacingTokenByPath(name);
  }
  
  return undefined;
}

/**
 * Get spacing token by hierarchical path
 * Examples: 'space.grouped.normal', 'space.inset.comfortable'
 */
function getSpacingTokenByPath(path: string): Omit<SemanticToken, 'primitiveTokens'> | undefined {
  const parts = path.split('.');
  
  if (parts.length !== 3 || parts[0] !== 'space') {
    return undefined;
  }
  
  const [, category, level] = parts;
  
  // Navigate the hierarchical spacing structure
  const categoryTokens = (spacingTokens as any)[category];
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
    category: SemanticCategory.SPACING,
    context: getSpacingContext(category, level),
    description: getSpacingDescription(category, level)
  };
}

/**
 * Get contextual description for spacing tokens
 */
function getSpacingContext(category: string, level: string): string {
  const contexts: Record<string, Record<string, string>> = {
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
function getSpacingDescription(category: string, level: string): string {
  if (category === 'inset') {
    return `Inset spacing for ${level} density interfaces`;
  }
  return `Layout spacing for ${category} elements with ${level} separation`;
}

/**
 * Get all semantic tokens across all categories
 */
export function getAllSemanticTokens(): Array<Omit<SemanticToken, 'primitiveTokens'>> {
  const tokens: Array<Omit<SemanticToken, 'primitiveTokens'>> = [];
  
  // Add color tokens
  tokens.push(...Object.values(colorTokens));
  
  // Add typography tokens
  tokens.push(...Object.values(typographyTokens));
  
  // Add spacing tokens (flatten hierarchical structure)
  for (const [category, levels] of Object.entries(spacingTokens)) {
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
export function getSemanticTokensByCategory(category: SemanticCategory): Array<Omit<SemanticToken, 'primitiveTokens'>> {
  switch (category) {
    case SemanticCategory.COLOR:
      return Object.values(colorTokens);
    case SemanticCategory.TYPOGRAPHY:
      return Object.values(typographyTokens);
    case SemanticCategory.SPACING:
      return getAllSemanticTokens().filter(t => t.category === SemanticCategory.SPACING);
    default:
      return [];
  }
}

/**
 * Validate semantic token structure
 * Checks that token has required fields and valid primitive references
 */
export function validateSemanticTokenStructure(token: Omit<SemanticToken, 'primitiveTokens'>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!token.name || typeof token.name !== 'string') {
    errors.push('Token must have a valid name');
  }
  
  if (!token.primitiveReferences || typeof token.primitiveReferences !== 'object') {
    errors.push('Token must have primitiveReferences object');
  } else if (Object.keys(token.primitiveReferences).length === 0) {
    errors.push('Token must reference at least one primitive token');
  }
  
  if (!token.category || !Object.values(SemanticCategory).includes(token.category)) {
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
export function getSpacingRecommendation(useCase: 'layout' | 'inset', density?: 'tight' | 'normal' | 'loose' | 'comfortable' | 'spacious' | 'expansive'): string[] {
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
  const recommendations: string[] = [];
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
export function getTypographyRecommendation(useCase: 'heading' | 'body' | 'ui' | 'specialized'): string[] {
  const recommendations: Record<string, string[]> = {
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
      'typography.body',
      'typography.bodySmall',
      'typography.bodyLarge'
    ],
    ui: [
      'typography.button',
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
export function getSemanticTokenStats() {
  const allTokens = getAllSemanticTokens();
  
  const categoryCount: Record<string, number> = {};
  for (const token of allTokens) {
    categoryCount[token.category] = (categoryCount[token.category] || 0) + 1;
  }
  
  return {
    total: allTokens.length,
    byCategory: categoryCount,
    colorTokens: Object.keys(colorTokens).length,
    typographyTokens: Object.keys(typographyTokens).length,
    spacingTokens: allTokens.filter(t => t.category === SemanticCategory.SPACING).length
  };
}
