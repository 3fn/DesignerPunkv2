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
  BORDER = 'border',
  SHADOW = 'shadow',
  TYPOGRAPHY = 'typography'
}

/**
 * Semantic token interface providing contextual abstraction over primitive tokens
 */
export interface SemanticToken {
  /** Semantic token name with contextual meaning (e.g., "color.warning", "space.tight") */
  name: string;
  
  /** Reference to the primitive token this semantic token uses */
  primitiveReference: string;
  
  /** Semantic category for organizational purposes */
  category: SemanticCategory;
  
  /** Contextual meaning or usage description */
  context: string;
  
  /** Detailed description of semantic meaning and appropriate usage */
  description: string;
  
  /** Resolved primitive token (populated during token resolution) */
  primitiveToken: PrimitiveToken;
}