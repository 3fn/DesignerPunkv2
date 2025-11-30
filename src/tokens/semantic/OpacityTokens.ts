/**
 * Semantic Opacity Token Definitions
 * 
 * Opacity tokens provide semantic transparency levels for overlays, effects,
 * and visual hierarchy. These tokens enable consistent transparency across
 * the design system while maintaining semantic meaning.
 * 
 * Opacity values:
 * - subtle: 0.9 (90%) - Minimal transparency for subtle effects
 * - medium: 0.7 (70%) - Moderate transparency for overlays
 * - heavy: 0.5 (50%) - Strong transparency for backgrounds
 * - ghost: 0.3 (30%) - Maximum transparency for ghost effects
 * 
 * All opacity tokens reference primitive opacity values that can be applied
 * to any color or surface for consistent transparency effects.
 */

import { SemanticToken, SemanticCategory } from '../../types/SemanticToken';

/**
 * Semantic opacity tokens for consistent transparency
 * Total: 4 tokens (subtle, medium, heavy, ghost)
 */
export const opacityTokens: Record<string, Omit<SemanticToken, 'primitiveTokens'>> = {
  'opacity.subtle': {
    name: 'opacity.subtle',
    primitiveReferences: { value: 'opacity1100' },
    category: SemanticCategory.INTERACTION,
    context: 'Subtle transparency for minimal visual effects',
    description: 'Subtle opacity (88%) for minimal transparency effects and subtle overlays'
  },

  'opacity.medium': {
    name: 'opacity.medium',
    primitiveReferences: { value: 'opacity900' },
    category: SemanticCategory.INTERACTION,
    context: 'Moderate transparency for overlays and effects',
    description: 'Medium opacity (72%) for moderate transparency in overlays and visual effects'
  },

  'opacity.heavy': {
    name: 'opacity.heavy',
    primitiveReferences: { value: 'opacity600' },
    category: SemanticCategory.INTERACTION,
    context: 'Strong transparency for backgrounds and overlays',
    description: 'Heavy opacity (48%) for strong transparency in backgrounds and modal overlays'
  },

  'opacity.ghost': {
    name: 'opacity.ghost',
    primitiveReferences: { value: 'opacity400' },
    category: SemanticCategory.INTERACTION,
    context: 'Maximum transparency for ghost effects',
    description: 'Ghost opacity (32%) for maximum transparency and ghost button effects'
  }
};

/**
 * Array of all opacity semantic token names for iteration
 * Total: 4 tokens
 */
export const opacityTokenNames = Object.keys(opacityTokens);

/**
 * Get opacity semantic token by name
 */
export function getOpacityToken(name: string): Omit<SemanticToken, 'primitiveTokens'> | undefined {
  return opacityTokens[name];
}

/**
 * Get all opacity semantic tokens as array
 */
export function getAllOpacityTokens(): Array<Omit<SemanticToken, 'primitiveTokens'>> {
  return Object.values(opacityTokens);
}

/**
 * Validate token count matches spec (4 tokens: subtle, medium, heavy, ghost)
 */
export function validateOpacityTokenCount(): boolean {
  const expectedCount = 4;
  const actualCount = opacityTokenNames.length;
  if (actualCount !== expectedCount) {
    console.warn(`Opacity token count mismatch: expected ${expectedCount}, got ${actualCount}`);
    return false;
  }
  return true;
}
