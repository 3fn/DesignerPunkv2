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
export * from './BorderWidthTokens';
export * from './RadiusTokens';
export * from './ShadowTokens';
export * from './OpacityTokens';
export * from './BlendTokens';
export * from './LayeringTokens';
export * from './GridSpacingTokens';
export * from './IconTokens';
export * from './AccessibilityTokens';
export * from './MotionTokens';

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

export {
  shadowTokens,
  shadowTokenNames,
  getShadowToken,
  getAllShadowTokens
} from './ShadowTokens';

export {
  SemanticBorderWidthTokens,
  borderNone,
  borderDefault,
  borderEmphasis,
  borderHeavy
} from './BorderWidthTokens';

export {
  SemanticRadiusTokens,
  // Individual exports for direct usage (original names preserved)
  radiusNone,
  radiusSubtle,
  radiusSmall,
  radiusNormal,
  radiusLarge,
  radiusFull,
  radiusCircle
} from './RadiusTokens';

export {
  opacityTokens,
  opacityTokenNames,
  getOpacityToken,
  getAllOpacityTokens,
  validateOpacityTokenCount
} from './OpacityTokens';

export {
  blendTokens,
  blendTokenNames,
  getBlendToken,
  getAllBlendTokens,
  validateBlendTokenCount
} from './BlendTokens';

export {
  zIndexTokens,
  zIndexTokenNames,
  getZIndexToken,
  getAllZIndexTokens,
  elevationTokens,
  elevationTokenNames,
  getElevationToken,
  getAllElevationTokens,
  getAllLayeringTokens,
  getLayeringTokensByPlatform
} from './LayeringTokens';

export {
  gridSpacingTokens,
  gridSpacingTokenNames,
  getGridSpacingToken,
  getAllGridSpacingTokens
} from './GridSpacingTokens';

export {
  iconTokens,
  iconTokenNames,
  getIconToken,
  getAllIconTokens,
  calculateIconSize,
  generateIconSizeTokens
} from './IconTokens';

export {
  accessibility,
  accessibilityTokens,
  accessibilityTokenNames,
  getAccessibilityToken,
  getAllAccessibilityTokens
} from './AccessibilityTokens';

export {
  motionTokens,
  motionTokenNames,
  getMotionToken,
  getAllMotionTokens
} from './MotionTokens';

export {
  progressColorTokens,
  progressColorTokenNames,
  PROGRESS_COLOR_TOKEN_COUNT,
  getProgressColorToken,
  getAllProgressColorTokens,
  validateProgressColorTokenCount
} from './color-progress';

// Import types for utility functions
import type { SemanticToken } from '../../types/SemanticToken';
import { SemanticCategory } from '../../types/SemanticToken';
import { colorTokens } from './ColorTokens';
import { spacingTokens } from './SpacingTokens';
import { typographyTokens } from './TypographyTokens';
import { SemanticBorderWidthTokens } from './BorderWidthTokens';
import { SemanticRadiusTokens } from './RadiusTokens';
import { shadowTokens } from './ShadowTokens';
import { opacityTokens } from './OpacityTokens';
import { blendTokens } from './BlendTokens';
import { zIndexTokens, elevationTokens } from './LayeringTokens';
import { gridSpacingTokens } from './GridSpacingTokens';
import { iconTokens } from './IconTokens';
import { accessibility, accessibilityTokens } from './AccessibilityTokens';
import { motionTokens } from './MotionTokens';
import { progressColorTokens } from './color-progress';

/**
 * Get any semantic token by name across all categories
 * Searches color, spacing, typography, border, shadow, and opacity tokens
 */
export function getSemanticToken(name: string): Omit<SemanticToken, 'primitiveTokens'> | undefined {
  // Check color tokens (includes progress color tokens)
  if (name.startsWith('color.')) {
    return colorTokens[name] || progressColorTokens[name];
  }

  // Check typography tokens
  if (name.startsWith('typography.')) {
    return typographyTokens[name];
  }

  // Check spacing tokens (hierarchical structure)
  if (name.startsWith('space.')) {
    return getSpacingTokenByPath(name);
  }

  // Check border tokens
  if (name.startsWith('border.')) {
    const borderName = name.replace('border.', '');
    const token = SemanticBorderWidthTokens[borderName as keyof typeof SemanticBorderWidthTokens];
    if (token) {
      return {
        name,
        primitiveReferences: { value: token.value },
        category: SemanticCategory.BORDER,
        context: `Border width for ${borderName.replace(/([A-Z])/g, ' $1').toLowerCase().trim()}`,
        description: `Semantic border width token: ${borderName}`
      };
    }
  }

  // Check radius tokens
  if (name.startsWith('radius.')) {
    const radiusName = name.replace('radius.', '');
    const token = SemanticRadiusTokens[radiusName as keyof typeof SemanticRadiusTokens];
    if (token) {
      return {
        name,
        primitiveReferences: { value: token.value },
        category: SemanticCategory.LAYOUT,
        context: `Border radius for ${radiusName.replace(/([A-Z])/g, ' $1').toLowerCase().trim()}`,
        description: `Semantic radius token: ${radiusName}`
      };
    }
  }

  // Check shadow tokens
  if (name.startsWith('shadow.')) {
    return shadowTokens[name];
  }

  // Check opacity tokens
  if (name.startsWith('opacity.')) {
    return opacityTokens[name];
  }

  // Check blend tokens
  if (name.startsWith('blend.')) {
    return blendTokens[name] as any;
  }

  // Check z-index tokens
  if (name.startsWith('zIndex.')) {
    return zIndexTokens[name] as any;
  }

  // Check elevation tokens
  if (name.startsWith('elevation.')) {
    return elevationTokens[name] as any;
  }

  // Check grid spacing tokens
  if (name.startsWith('grid')) {
    return gridSpacingTokens[name];
  }

  // Check icon tokens
  if (name.startsWith('icon.')) {
    return iconTokens[name];
  }

  // Check accessibility tokens
  if (name.startsWith('accessibility.')) {
    const parts = name.split('.');
    if (parts[1] === 'focus' && parts[2]) {
      const focusProperty = parts[2] as keyof typeof accessibility.focus;
      const value = accessibility.focus[focusProperty];
      return {
        name,
        primitiveReferences: { value: String(value) },
        category: SemanticCategory.ACCESSIBILITY,
        context: `Focus indicator ${focusProperty} for keyboard navigation`,
        description: `Accessibility token for focus ${focusProperty} (WCAG 2.4.7)`
      };
    }
  }

  // Check motion tokens
  if (name.startsWith('motion.')) {
    return motionTokens[name];
  }

  return undefined;
}

/**
 * Get spacing token by hierarchical path
 * Examples: 'space.grouped.normal', 'space.inset.150'
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
      '050': 'Minimal internal spacing (4px) - 0.5 × base',
      '100': 'Compact internal spacing (8px) - 1 × base',
      '150': 'Standard internal spacing (12px) - 1.5 × base',
      '200': 'Comfortable internal spacing (16px) - 2 × base',
      '300': 'Spacious internal spacing (24px) - 3 × base',
      '400': 'Maximum internal spacing (32px) - 4 × base'
    }
  };

  return contexts[category]?.[level] || 'Spacing token';
}

/**
 * Get detailed description for spacing tokens
 */
function getSpacingDescription(category: string, level: string): string {
  if (category === 'inset') {
    // Map numeric levels to descriptive text
    const densityMap: Record<string, string> = {
      '050': 'minimal (4px)',
      '100': 'compact (8px)',
      '150': 'standard (12px)',
      '200': 'comfortable (16px)',
      '300': 'spacious (24px)',
      '400': 'maximum (32px)'
    };
    const density = densityMap[level] || level;
    return `Inset spacing for ${density} density interfaces`;
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

  // Add shadow tokens
  tokens.push(...Object.values(shadowTokens));

  // Add opacity tokens
  tokens.push(...Object.values(opacityTokens));

  // Add blend tokens
  tokens.push(...(Object.values(blendTokens) as any));

  // Add z-index tokens
  tokens.push(...(Object.values(zIndexTokens) as any));

  // Add elevation tokens
  tokens.push(...(Object.values(elevationTokens) as any));

  // Add grid spacing tokens
  tokens.push(...Object.values(gridSpacingTokens));

  // Add icon tokens
  tokens.push(...Object.values(iconTokens));

  // Add accessibility tokens
  tokens.push(...Object.values(accessibilityTokens));

  // Add motion tokens
  tokens.push(...Object.values(motionTokens));

  // Add progress color tokens
  tokens.push(...Object.values(progressColorTokens));

  // Add border width tokens
  for (const [name, token] of Object.entries(SemanticBorderWidthTokens)) {
    tokens.push({
      name: `border.${name}`,
      primitiveReferences: { value: token.value },
      category: SemanticCategory.BORDER,
      context: `Border width for ${name.replace(/([A-Z])/g, ' $1').toLowerCase().trim()}`,
      description: `Semantic border width token: ${name}`
    });
  }

  // Add radius tokens
  for (const [name, token] of Object.entries(SemanticRadiusTokens)) {
    tokens.push({
      name: `radius.${name}`,
      primitiveReferences: { value: token.value },
      category: SemanticCategory.LAYOUT,
      context: `Border radius for ${name.replace(/([A-Z])/g, ' $1').toLowerCase().trim()}`,
      description: `Semantic radius token: ${name}`
    });
  }

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
      return [...Object.values(colorTokens), ...Object.values(progressColorTokens)];
    case SemanticCategory.TYPOGRAPHY:
      return Object.values(typographyTokens);
    case SemanticCategory.SPACING:
      return getAllSemanticTokens().filter(t => t.category === SemanticCategory.SPACING);
    case SemanticCategory.BORDER:
      return getAllSemanticTokens().filter(t => t.category === SemanticCategory.BORDER);
    case SemanticCategory.SHADOW:
      return Object.values(shadowTokens);
    case SemanticCategory.INTERACTION:
      return [...Object.values(opacityTokens), ...(Object.values(blendTokens) as any), ...Object.values(motionTokens)];
    case SemanticCategory.LAYERING:
      return [...(Object.values(zIndexTokens) as any), ...(Object.values(elevationTokens) as any)];
    case SemanticCategory.ICON:
      return Object.values(iconTokens);
    case SemanticCategory.ACCESSIBILITY:
      return Object.values(accessibilityTokens);
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
export function getSpacingRecommendation(useCase: 'layout' | 'inset', density?: 'tight' | 'normal' | 'loose' | 'comfortable' | 'spacious' | 'expansive' | 'generous'): string[] {
  if (useCase === 'inset') {
    return [
      'space.inset.050',
      'space.inset.100',
      'space.inset.150',
      'space.inset.200',
      'space.inset.300',
      'space.inset.400'
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
export function getSemanticTokenStats() {
  const allTokens = getAllSemanticTokens();

  const categoryCount: Record<string, number> = {};
  for (const token of allTokens) {
    categoryCount[token.category] = (categoryCount[token.category] || 0) + 1;
  }

  return {
    total: allTokens.length,
    byCategory: categoryCount,
    colorTokens: Object.keys(colorTokens).length + Object.keys(progressColorTokens).length,
    typographyTokens: Object.keys(typographyTokens).length,
    spacingTokens: allTokens.filter(t => t.category === SemanticCategory.SPACING).length,
    borderTokens: Object.keys(SemanticBorderWidthTokens).length,
    radiusTokens: Object.keys(SemanticRadiusTokens).length,
    shadowTokens: Object.keys(shadowTokens).length,
    opacityTokens: Object.keys(opacityTokens).length,
    blendTokens: Object.keys(blendTokens).length,
    zIndexTokens: Object.keys(zIndexTokens).length,
    elevationTokens: Object.keys(elevationTokens).length,
    gridSpacingTokens: Object.keys(gridSpacingTokens).length,
    iconTokens: Object.keys(iconTokens).length,
    accessibilityTokens: Object.keys(accessibility.focus).length,
    motionTokens: Object.keys(motionTokens).length,
    progressColorTokens: Object.keys(progressColorTokens).length
  };
}
