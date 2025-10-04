/**
 * Semantic Typography Token Definitions
 * 
 * Typography semantic tokens combine fontSize, lineHeight, fontFamily, fontWeight, 
 * and letterSpacing primitives to create complete typography styles for specific contexts.
 */

import { SemanticToken, SemanticCategory } from '../../types/SemanticToken';

/**
 * Typography semantic tokens for common text styles
 */
export const typographyTokens: Record<string, Omit<SemanticToken, 'primitiveTokens'>> = {
  'typography.heading1': {
    name: 'typography.display',
    primitiveReferences: { default: 'fontSize400' },
    category: SemanticCategory.TYPOGRAPHY,
    context: 'Large display text for hero sections and major headings',
    description: 'Display typography style combining large font size with appropriate line height and font family'
  },

  'typography.heading2': {
    name: 'typography.heading1',
    primitiveReferences: { default: 'fontSize300' },
    category: SemanticCategory.TYPOGRAPHY,
    context: 'Primary heading level for page titles and major sections',
    description: 'H1 typography style with large font size and display font family'
  },

  'typography.heading3': {
    name: 'typography.heading2',
    primitiveReferences: { default: 'fontSize200' },
    category: SemanticCategory.TYPOGRAPHY,
    context: 'Secondary heading level for subsections',
    description: 'H2 typography style with medium-large font size'
  },

  'typography.heading4': {
    name: 'typography.heading3',
    primitiveReferences: { default: 'fontSize150' },
    category: SemanticCategory.TYPOGRAPHY,
    context: 'Tertiary heading level for smaller sections',
    description: 'H3 typography style with medium font size'
  },

  'typography.heading5': {
    name: 'typography.heading4',
    primitiveReferences: { default: 'fontSize125' },
    category: SemanticCategory.TYPOGRAPHY,
    context: 'Quaternary heading level for minor sections',
    description: 'H4 typography style with slightly larger than base font size'
  },

  'typography.body': {
    name: 'typography.body',
    primitiveReferences: { default: 'fontSize100' },
    category: SemanticCategory.TYPOGRAPHY,
    context: 'Standard body text for paragraphs and general content',
    description: 'Body typography style with base font size and body font family'
  },

  'typography.bodyLarge': {
    name: 'typography.bodyLarge',
    primitiveReferences: { default: 'fontSize125' },
    category: SemanticCategory.TYPOGRAPHY,
    context: 'Larger body text for emphasis or lead paragraphs',
    description: 'Large body typography style with slightly increased font size'
  },

  'typography.bodySmall': {
    name: 'typography.bodySmall',
    primitiveReferences: { default: 'fontSize075' },
    category: SemanticCategory.TYPOGRAPHY,
    context: 'Smaller body text for secondary content',
    description: 'Small body typography style with reduced font size'
  },

  'typography.caption': {
    name: 'typography.caption',
    primitiveReferences: { default: 'fontSize050' },
    category: SemanticCategory.TYPOGRAPHY,
    context: 'Caption text for images, tables, and supplementary information',
    description: 'Caption typography style with small font size'
  },

  'typography.label': {
    name: 'typography.label',
    primitiveReferences: { default: 'fontSize075' },
    category: SemanticCategory.TYPOGRAPHY,
    context: 'Label text for form fields and UI elements',
    description: 'Label typography style with small-medium font size'
  },

  'typography.button': {
    name: 'typography.button',
    primitiveReferences: { default: 'fontSize100' },
    category: SemanticCategory.TYPOGRAPHY,
    context: 'Button text with appropriate sizing and weight',
    description: 'Button typography style with base font size and medium weight'
  },

  'typography.code': {
    name: 'typography.code',
    primitiveReferences: { default: 'fontSize100' },
    category: SemanticCategory.TYPOGRAPHY,
    context: 'Inline code and technical content',
    description: 'Code typography style with monospace font family'
  },

  'typography.codeBlock': {
    name: 'typography.codeBlock',
    primitiveReferences: { default: 'fontSize075' },
    category: SemanticCategory.TYPOGRAPHY,
    context: 'Code blocks and multi-line technical content',
    description: 'Code block typography style with monospace font family and smaller size'
  }
};

/**
 * Array of all typography semantic token names for iteration
 */
export const typographyTokenNames = Object.keys(typographyTokens);

/**
 * Get typography semantic token by name
 */
export function getTypographyToken(name: string): Omit<SemanticToken, 'primitiveTokens'> | undefined {
  return typographyTokens[name];
}

/**
 * Get all typography semantic tokens as array
 */
export function getAllTypographyTokens(): Array<Omit<SemanticToken, 'primitiveTokens'>> {
  return Object.values(typographyTokens);
}
