/**
 * Semantic Spacing Token Definitions
 * 
 * Spacing semantic tokens provide contextual meaning for spacing primitives,
 * making it easier to apply consistent spacing patterns across components.
 */

import { SemanticToken, SemanticCategory } from '../../types/SemanticToken';

/**
 * Semantic spacing tokens for common spacing contexts
 */
export const spacingTokens: Record<string, Omit<SemanticToken, 'primitiveTokens'>> = {
  // Component internal spacing
  'space.tight': {
    name: 'space.tight',
    primitiveReferences: { default: 'space050' },
    category: SemanticCategory.SPACING,
    context: 'Tight spacing within components for closely related elements',
    description: 'Tight spacing (4px) for elements that should be visually grouped closely'
  },

  'space.compact': {
    name: 'space.compact',
    primitiveReferences: { default: 'space075' },
    category: SemanticCategory.SPACING,
    context: 'Compact spacing for dense layouts',
    description: 'Compact spacing (6px) for dense UI layouts and compact components'
  },

  'space.default': {
    name: 'space.default',
    primitiveReferences: { default: 'space100' },
    category: SemanticCategory.SPACING,
    context: 'Default spacing for standard component padding and gaps',
    description: 'Default spacing (8px) for standard component internal spacing'
  },

  'space.comfortable': {
    name: 'space.comfortable',
    primitiveReferences: { default: 'space150' },
    category: SemanticCategory.SPACING,
    context: 'Comfortable spacing for relaxed layouts',
    description: 'Comfortable spacing (12px) for relaxed component layouts'
  },

  'space.loose': {
    name: 'space.loose',
    primitiveReferences: { default: 'space200' },
    category: SemanticCategory.SPACING,
    context: 'Loose spacing for separated elements',
    description: 'Loose spacing (16px) for elements that should be visually separated'
  },

  // Layout spacing
  'space.layoutTight': {
    name: 'space.layoutTight',
    primitiveReferences: { default: 'space200' },
    category: SemanticCategory.SPACING,
    context: 'Tight layout spacing between sections',
    description: 'Tight layout spacing (16px) for closely related sections'
  },

  'space.layoutDefault': {
    name: 'space.layoutDefault',
    primitiveReferences: { default: 'space300' },
    category: SemanticCategory.SPACING,
    context: 'Default layout spacing between sections',
    description: 'Default layout spacing (24px) for standard section separation'
  },

  'space.layoutLoose': {
    name: 'space.layoutLoose',
    primitiveReferences: { default: 'space400' },
    category: SemanticCategory.SPACING,
    context: 'Loose layout spacing between major sections',
    description: 'Loose layout spacing (32px) for major section separation'
  },

  'space.layoutWide': {
    name: 'space.layoutWide',
    primitiveReferences: { default: 'space500' },
    category: SemanticCategory.SPACING,
    context: 'Wide layout spacing for distinct content areas',
    description: 'Wide layout spacing (40px) for distinct content area separation'
  },

  // Stack spacing (vertical)
  'space.stackTight': {
    name: 'space.stackTight',
    primitiveReferences: { default: 'space050' },
    category: SemanticCategory.SPACING,
    context: 'Tight vertical spacing in stacks',
    description: 'Tight stack spacing (4px) for closely related vertical elements'
  },

  'space.stackDefault': {
    name: 'space.stackDefault',
    primitiveReferences: { default: 'space100' },
    category: SemanticCategory.SPACING,
    context: 'Default vertical spacing in stacks',
    description: 'Default stack spacing (8px) for standard vertical element separation'
  },

  'space.stackLoose': {
    name: 'space.stackLoose',
    primitiveReferences: { default: 'space200' },
    category: SemanticCategory.SPACING,
    context: 'Loose vertical spacing in stacks',
    description: 'Loose stack spacing (16px) for separated vertical elements'
  },

  // Inline spacing (horizontal)
  'space.inlineTight': {
    name: 'space.inlineTight',
    primitiveReferences: { default: 'space050' },
    category: SemanticCategory.SPACING,
    context: 'Tight horizontal spacing between inline elements',
    description: 'Tight inline spacing (4px) for closely related horizontal elements'
  },

  'space.inlineDefault': {
    name: 'space.inlineDefault',
    primitiveReferences: { default: 'space100' },
    category: SemanticCategory.SPACING,
    context: 'Default horizontal spacing between inline elements',
    description: 'Default inline spacing (8px) for standard horizontal element separation'
  },

  'space.inlineLoose': {
    name: 'space.inlineLoose',
    primitiveReferences: { default: 'space200' },
    category: SemanticCategory.SPACING,
    context: 'Loose horizontal spacing between inline elements',
    description: 'Loose inline spacing (16px) for separated horizontal elements'
  },

  // Padding
  'space.paddingTight': {
    name: 'space.paddingTight',
    primitiveReferences: { default: 'space050' },
    category: SemanticCategory.SPACING,
    context: 'Tight padding for compact components',
    description: 'Tight padding (4px) for compact component internal spacing'
  },

  'space.paddingDefault': {
    name: 'space.paddingDefault',
    primitiveReferences: { default: 'space100' },
    category: SemanticCategory.SPACING,
    context: 'Default padding for standard components',
    description: 'Default padding (8px) for standard component internal spacing'
  },

  'space.paddingComfortable': {
    name: 'space.paddingComfortable',
    primitiveReferences: { default: 'space150' },
    category: SemanticCategory.SPACING,
    context: 'Comfortable padding for relaxed components',
    description: 'Comfortable padding (12px) for relaxed component internal spacing'
  },

  'space.paddingLoose': {
    name: 'space.paddingLoose',
    primitiveReferences: { default: 'space200' },
    category: SemanticCategory.SPACING,
    context: 'Loose padding for spacious components',
    description: 'Loose padding (16px) for spacious component internal spacing'
  },

  // Gap (for flexbox/grid)
  'space.gapTight': {
    name: 'space.gapTight',
    primitiveReferences: { default: 'space050' },
    category: SemanticCategory.SPACING,
    context: 'Tight gap for dense flex/grid layouts',
    description: 'Tight gap (4px) for dense flexbox or grid layouts'
  },

  'space.gapDefault': {
    name: 'space.gapDefault',
    primitiveReferences: { default: 'space100' },
    category: SemanticCategory.SPACING,
    context: 'Default gap for standard flex/grid layouts',
    description: 'Default gap (8px) for standard flexbox or grid layouts'
  },

  'space.gapLoose': {
    name: 'space.gapLoose',
    primitiveReferences: { default: 'space200' },
    category: SemanticCategory.SPACING,
    context: 'Loose gap for spacious flex/grid layouts',
    description: 'Loose gap (16px) for spacious flexbox or grid layouts'
  }
};

/**
 * Array of all spacing semantic token names for iteration
 */
export const spacingTokenNames = Object.keys(spacingTokens);

/**
 * Get spacing semantic token by name
 */
export function getSpacingToken(name: string): Omit<SemanticToken, 'primitiveTokens'> | undefined {
  return spacingTokens[name];
}

/**
 * Get all spacing semantic tokens as array
 */
export function getAllSpacingTokens(): Array<Omit<SemanticToken, 'primitiveTokens'>> {
  return Object.values(spacingTokens);
}
