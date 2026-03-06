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
  LAYERING = 'layering',
  INTERACTION = 'interaction',
  ICON = 'icon',
  ACCESSIBILITY = 'accessibility'
}

/**
 * Modifier applied to a semantic token's resolved value.
 * Modifiers are resolved in array order after the base value.
 */
export interface TokenModifier {
  /** Modifier type. Currently only 'opacity' is supported. */
  type: 'opacity';
  /** Reference to a primitive token (e.g., 'opacity080') */
  reference: string;
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
   * For icon tokens: multiplier can be a lineHeight token reference or 'custom:X.XXX' for optical correction
   */
  primitiveReferences: Record<string, string>;

  /** Ordered modifiers applied after base value resolution (e.g., opacity on a color) */
  modifiers?: TokenModifier[];

  /** When true, this token resolves to the same value in all theme modes */
  modeInvariant?: boolean;

  /** Semantic category for organizational purposes */
  category: SemanticCategory;

  /** Contextual meaning or usage description */
  context: string;

  /** Detailed description of semantic meaning and appropriate usage */
  description: string;

  /** Resolved primitive tokens (populated during token resolution) */
  primitiveTokens?: Record<string, PrimitiveToken>;

  /** 
   * Platform-specific properties for tokens that need different values per platform
   * Used by shadow tokens to specify Android elevation values alongside web/iOS primitive references
   */
  platforms?: {
    web?: Record<string, any>;
    ios?: Record<string, any>;
    android?: {
      elevation?: number;
      [key: string]: any;
    };
  };

  /** Optional metadata for additional context (e.g., dedications, notes) */
  _meta?: Record<string, string>;
}