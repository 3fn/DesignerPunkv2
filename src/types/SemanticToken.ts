/**
 * Semantic Token Interface and Semantic Category Enum
 * 
 * Defines semantic tokens that provide contextual meaning while referencing
 * primitive tokens to maintain mathematical consistency. Semantic tokens
 * represent higher-level abstractions for specific design contexts.
 */

import type { PrimitiveToken } from './PrimitiveToken.js';

/**
 * Semantic categories for contextual token organization
 */
export enum SemanticCategory {
  COLOR = 'color',
  SPACING = 'spacing',
  TYPOGRAPHY = 'typography',
  BORDER = 'border',
  SHADOW = 'shadow',
  LAYOUT = 'layout',
  INTERACTION = 'interaction'
}

/**
 * Semantic token interface providing contextual abstraction over primitive tokens
 * Supports both single primitive references and composite multi-primitive tokens
 */
export interface SemanticToken {
  /** Semantic token name with contextual meaning (e.g., "color.warning", "space.tight") */
  name: string;

  /** 
   * References to primitive tokens this semantic token uses
   * For simple tokens: { default: 'primitiveTokenName' }
   * For composite tokens: { fontSize: 'fontSize100', lineHeight: 'lineHeight100', fontFamily: 'fontFamilyBody' }
   */
  primitiveReferences: Record<string, string>;

  /** Semantic category for organizational purposes */
  category: SemanticCategory;

  /** Contextual meaning or usage description */
  context: string;

  /** Detailed description of semantic meaning and appropriate usage */
  description: string;

  /** Resolved primitive tokens (populated during token resolution) */
  primitiveTokens?: Record<string, PrimitiveToken>;
}