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

import { SemanticToken, SemanticCategory } from '../../types/SemanticToken';

/**
 * Shadow semantic tokens for common UI shadow styles
 * Following compositional architecture with explicit multi-primitive composition
 */
export const shadowTokens: Record<string, Omit<SemanticToken, 'primitiveTokens'>> = {
  'shadow.container': {
    name: 'shadow.container',
    primitiveReferences: {
      offsetX: 'shadowOffsetX.000',
      offsetY: 'shadowOffsetY.100',
      blur: 'shadowBlurModerate',
      opacity: 'shadowOpacityModerate',
      color: 'color.shadow.default'
    },
    category: SemanticCategory.SHADOW,
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
    category: SemanticCategory.SHADOW,
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
    category: SemanticCategory.SHADOW,
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
    category: SemanticCategory.SHADOW,
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
    category: SemanticCategory.SHADOW,
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
    category: SemanticCategory.SHADOW,
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
    category: SemanticCategory.SHADOW,
    context: 'Noon lighting shadow with no horizontal offset and default color',
    description: 'Shadow with no horizontal offset, 8px vertical offset, 12px blur, moderate opacity, default color for noon lighting'
  },
  
  'shadow.afternoon': {
    name: 'shadow.afternoon',
    primitiveReferences: {
      offsetX: 'shadowOffsetX.150',
      offsetY: 'shadowOffsetY.200',
      blur: 'shadowBlurModerate',
      opacity: 'shadowOpacityModerate',
      color: 'color.shadow.default'
    },
    category: SemanticCategory.SHADOW,
    context: 'Afternoon lighting shadow with medium right offset and default color',
    description: 'Shadow with 6px right offset, 8px vertical offset, 12px blur, moderate opacity, default color for afternoon lighting'
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
    category: SemanticCategory.SHADOW,
    context: 'Sunset lighting shadow with right offset and warm color',
    description: 'Shadow with 12px right offset, 8px vertical offset, 12px blur, moderate opacity, warm (blue-gray) tint for sunset lighting'
  }
};

/**
 * Array of all shadow semantic token names for iteration
 */
export const shadowTokenNames = Object.keys(shadowTokens);

/**
 * Get shadow semantic token by name
 */
export function getShadowToken(name: string): Omit<SemanticToken, 'primitiveTokens'> | undefined {
  return shadowTokens[name];
}

/**
 * Get all shadow semantic tokens as array
 */
export function getAllShadowTokens(): Array<Omit<SemanticToken, 'primitiveTokens'>> {
  return Object.values(shadowTokens);
}
