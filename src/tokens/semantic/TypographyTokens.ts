/**
 * Semantic Typography Token Definitions
 * 
 * Typography semantic tokens combine fontSize, lineHeight, fontFamily, fontWeight, 
 * and letterSpacing primitives to create complete typography styles for specific contexts.
 * 
 * Each token explicitly defines all five typography properties using multi-primitive structure:
 * - fontSize: Size of the text
 * - lineHeight: Line height ratio paired with fontSize
 * - fontFamily: Font family stack
 * - fontWeight: Font weight value
 * - letterSpacing: Letter spacing adjustment (default: letterSpacing100)
 */

import { SemanticToken, SemanticCategory } from '../../types/SemanticToken';

/**
 * Typography semantic tokens for common text styles
 * Following token-specifications-v3.md structure with explicit multi-primitive composition
 */
export const typographyTokens: Record<string, Omit<SemanticToken, 'primitiveTokens'>> = {
  // Body Text Variants
  'typography.body': {
    name: 'typography.body',
    primitiveReferences: {
      fontSize: 'fontSize100',
      lineHeight: 'lineHeight100',
      fontFamily: 'fontFamilyBody',
      fontWeight: 'fontWeight400',
      letterSpacing: 'letterSpacing100'
    },
    category: SemanticCategory.TYPOGRAPHY,
    context: 'Standard body text for paragraphs and general content',
    description: 'Body typography style with base font size (16), optimal line height (1.5), body font family, normal weight, and default letter spacing'
  },

  'typography.bodySmall': {
    name: 'typography.bodySmall',
    primitiveReferences: {
      fontSize: 'fontSize075',
      lineHeight: 'lineHeight075',
      fontFamily: 'fontFamilyBody',
      fontWeight: 'fontWeight400',
      letterSpacing: 'letterSpacing100'
    },
    category: SemanticCategory.TYPOGRAPHY,
    context: 'Smaller body text for secondary content',
    description: 'Small body typography style with reduced font size (14), paired line height (1.429), body font family, normal weight, and default letter spacing'
  },

  'typography.bodyLarge': {
    name: 'typography.bodyLarge',
    primitiveReferences: {
      fontSize: 'fontSize125',
      lineHeight: 'lineHeight125',
      fontFamily: 'fontFamilyBody',
      fontWeight: 'fontWeight400',
      letterSpacing: 'letterSpacing100'
    },
    category: SemanticCategory.TYPOGRAPHY,
    context: 'Larger body text for emphasis or lead paragraphs',
    description: 'Large body typography style with increased font size (18), paired line height (1.556), body font family, normal weight, and default letter spacing'
  },

  // Heading Hierarchy (H1-H6 following HTML semantics)
  'typography.h1': {
    name: 'typography.h1',
    primitiveReferences: {
      fontSize: 'fontSize600',
      lineHeight: 'lineHeight600',
      fontFamily: 'fontFamilyDisplay',
      fontWeight: 'fontWeight700',
      letterSpacing: 'letterSpacing100'
    },
    category: SemanticCategory.TYPOGRAPHY,
    context: 'Primary heading level for page titles and major sections',
    description: 'H1 typography style with large font size (37), tight line height (1.19), display font family, bold weight, and default letter spacing'
  },

  'typography.h2': {
    name: 'typography.h2',
    primitiveReferences: {
      fontSize: 'fontSize500',
      lineHeight: 'lineHeight500',
      fontFamily: 'fontFamilyDisplay',
      fontWeight: 'fontWeight700',
      letterSpacing: 'letterSpacing100'
    },
    category: SemanticCategory.TYPOGRAPHY,
    context: 'Secondary heading level for major subsections',
    description: 'H2 typography style with medium-large font size (33), tight line height (1.212), display font family, bold weight, and default letter spacing'
  },

  'typography.h3': {
    name: 'typography.h3',
    primitiveReferences: {
      fontSize: 'fontSize400',
      lineHeight: 'lineHeight400',
      fontFamily: 'fontFamilyDisplay',
      fontWeight: 'fontWeight600',
      letterSpacing: 'letterSpacing100'
    },
    category: SemanticCategory.TYPOGRAPHY,
    context: 'Tertiary heading level for subsections',
    description: 'H3 typography style with medium font size (29), moderate line height (1.241), display font family, semi-bold weight, and default letter spacing'
  },

  'typography.h4': {
    name: 'typography.h4',
    primitiveReferences: {
      fontSize: 'fontSize300',
      lineHeight: 'lineHeight300',
      fontFamily: 'fontFamilyBody',
      fontWeight: 'fontWeight600',
      letterSpacing: 'letterSpacing100'
    },
    category: SemanticCategory.TYPOGRAPHY,
    context: 'Quaternary heading level for smaller sections',
    description: 'H4 typography style with small-medium font size (26), moderate line height (1.231), body font family, semi-bold weight, and default letter spacing'
  },

  'typography.h5': {
    name: 'typography.h5',
    primitiveReferences: {
      fontSize: 'fontSize200',
      lineHeight: 'lineHeight200',
      fontFamily: 'fontFamilyBody',
      fontWeight: 'fontWeight600',
      letterSpacing: 'letterSpacing100'
    },
    category: SemanticCategory.TYPOGRAPHY,
    context: 'Quinary heading level for minor sections',
    description: 'H5 typography style with small font size (23), moderate line height (1.391), body font family, semi-bold weight, and default letter spacing'
  },

  'typography.h6': {
    name: 'typography.h6',
    primitiveReferences: {
      fontSize: 'fontSize150',
      lineHeight: 'lineHeight150',
      fontFamily: 'fontFamilyBody',
      fontWeight: 'fontWeight700',
      letterSpacing: 'letterSpacing100'
    },
    category: SemanticCategory.TYPOGRAPHY,
    context: 'Senary heading level for smallest sections',
    description: 'H6 typography style with smallest heading font size (20), moderate line height (1.4), body font family, bold weight, and default letter spacing'
  },

  // Specialized Text
  'typography.caption': {
    name: 'typography.caption',
    primitiveReferences: {
      fontSize: 'fontSize050',
      lineHeight: 'lineHeight050',
      fontFamily: 'fontFamilyBody',
      fontWeight: 'fontWeight300',
      letterSpacing: 'letterSpacing100'
    },
    category: SemanticCategory.TYPOGRAPHY,
    context: 'Caption text for images, tables, and supplementary information',
    description: 'Caption typography style with small font size (13), paired line height (1.538), body font family, light weight, and default letter spacing'
  },

  'typography.legal': {
    name: 'typography.legal',
    primitiveReferences: {
      fontSize: 'fontSize050',
      lineHeight: 'lineHeight050',
      fontFamily: 'fontFamilyBody',
      fontWeight: 'fontWeight400',
      letterSpacing: 'letterSpacing100'
    },
    category: SemanticCategory.TYPOGRAPHY,
    context: 'Legal text, disclaimers, and fine print',
    description: 'Legal typography style with small font size (13), paired line height (1.538), body font family, normal weight, and default letter spacing'
  },

  'typography.display': {
    name: 'typography.display',
    primitiveReferences: {
      fontSize: 'fontSize700',
      lineHeight: 'lineHeight700',
      fontFamily: 'fontFamilyDisplay',
      fontWeight: 'fontWeight700',
      letterSpacing: 'letterSpacing100'
    },
    category: SemanticCategory.TYPOGRAPHY,
    context: 'Large display text for hero sections and major headings',
    description: 'Display typography style with largest font size (42), tightest line height (1.143), display font family, bold weight, and default letter spacing'
  },

  // UI Layer Typography
  'typography.button': {
    name: 'typography.button',
    primitiveReferences: {
      fontSize: 'fontSize100',
      lineHeight: 'lineHeight100',
      fontFamily: 'fontFamilyBody',
      fontWeight: 'fontWeight500',
      letterSpacing: 'letterSpacing100'
    },
    category: SemanticCategory.TYPOGRAPHY,
    context: 'Button text with appropriate sizing and weight',
    description: 'Button typography style with base font size (16), optimal line height (1.5), body font family, medium weight for emphasis, and default letter spacing'
  },

  'typography.input': {
    name: 'typography.input',
    primitiveReferences: {
      fontSize: 'fontSize100',
      lineHeight: 'lineHeight100',
      fontFamily: 'fontFamilyBody',
      fontWeight: 'fontWeight400',
      letterSpacing: 'letterSpacing100'
    },
    category: SemanticCategory.TYPOGRAPHY,
    context: 'Input field text for forms and data entry',
    description: 'Input typography style with base font size (16), optimal line height (1.5), body font family, normal weight, and default letter spacing'
  },

  'typography.label': {
    name: 'typography.label',
    primitiveReferences: {
      fontSize: 'fontSize075',
      lineHeight: 'lineHeight075',
      fontFamily: 'fontFamilyBody',
      fontWeight: 'fontWeight500',
      letterSpacing: 'letterSpacing100'
    },
    category: SemanticCategory.TYPOGRAPHY,
    context: 'Label text for form fields and UI elements',
    description: 'Label typography style with small-medium font size (14), paired line height (1.429), body font family, medium weight for emphasis, and default letter spacing'
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
