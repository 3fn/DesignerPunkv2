/**
 * Semantic Color Token Definitions
 * 
 * Mode-aware semantic color tokens following systematic palette guidelines:
 * - primary = purple (brand authority and focus states)
 * - secondary = violet (sophisticated depth and secondary elements)
 * - success = cyan (tech/digital and success states)
 * - warning = yellow (urgent attention and warnings)
 * - error = orange (approachable error states)
 * - info = teal (informational states)
 * - shadow colors = mode-agnostic shadow tints based on art theory
 * - glow colors = vibrant neon colors for emphasis effects
 * 
 * All color tokens reference mode-aware primitive color tokens that support
 * light/dark modes with base/wcag themes.
 * 
 * Shadow colors are mode-agnostic (always dark) and reference primitive shadow
 * color tokens based on art theory (warm light creates cool shadows, etc.)
 * 
 * Glow colors reference existing vibrant primitive colors (purple500, cyan500, yellow500)
 * for neon emphasis effects.
 * 
 * Spec-aligned: 22 color semantic tokens (15 original + 4 shadow + 3 glow)
 */

import { SemanticToken, SemanticCategory } from '../../types/SemanticToken';

/**
 * Semantic color tokens for systematic color usage
 * Total: 22 tokens (15 original + 4 shadow + 3 glow)
 */
export const colorTokens: Record<string, Omit<SemanticToken, 'primitiveTokens'>> = {
  // Brand Identity (2 tokens)
  'color.primary': {
    name: 'color.primary',
    primitiveReferences: { value: 'purple300' },
    category: SemanticCategory.COLOR,
    context: 'Primary brand color for main CTAs, links, and brand elements',
    description: 'Primary purple color representing brand authority and focus states'
  },

  'color.secondary': {
    name: 'color.secondary',
    primitiveReferences: { value: 'violet300' },
    category: SemanticCategory.COLOR,
    context: 'Secondary brand color for secondary CTAs and elements',
    description: 'Secondary violet color providing sophisticated depth and secondary UI elements'
  },

  // Status Feedback - Success (2 tokens)
  'color.success.strong': {
    name: 'color.success.strong',
    primitiveReferences: { value: 'cyan400' },
    category: SemanticCategory.COLOR,
    context: 'Strong success color for prominent success states and text',
    description: 'Strong cyan for prominent success indicators, text, and icons'
  },

  'color.success.subtle': {
    name: 'color.success.subtle',
    primitiveReferences: { value: 'cyan100' },
    category: SemanticCategory.COLOR,
    context: 'Subtle success color for backgrounds and light indicators',
    description: 'Subtle cyan for success backgrounds and light success indicators'
  },

  // Status Feedback - Warning (2 tokens)
  'color.warning.strong': {
    name: 'color.warning.strong',
    primitiveReferences: { value: 'yellow400' },
    category: SemanticCategory.COLOR,
    context: 'Strong warning color for prominent warning states and text',
    description: 'Strong yellow for prominent warning indicators, text, and icons'
  },

  'color.warning.subtle': {
    name: 'color.warning.subtle',
    primitiveReferences: { value: 'yellow100' },
    category: SemanticCategory.COLOR,
    context: 'Subtle warning color for backgrounds and light indicators',
    description: 'Subtle yellow for warning backgrounds and light warning indicators'
  },

  // Status Feedback - Error (1 token)
  'color.error': {
    name: 'color.error',
    primitiveReferences: { value: 'orange300' },
    category: SemanticCategory.COLOR,
    context: 'Error state color for errors and destructive actions',
    description: 'Error orange color for approachable error states and destructive actions'
  },

  // Informational (2 tokens)
  'color.info.strong': {
    name: 'color.info.strong',
    primitiveReferences: { value: 'teal400' },
    category: SemanticCategory.COLOR,
    context: 'Strong informational color for prominent info states and text',
    description: 'Strong teal for prominent informational indicators, text, and icons'
  },

  'color.info.subtle': {
    name: 'color.info.subtle',
    primitiveReferences: { value: 'teal100' },
    category: SemanticCategory.COLOR,
    context: 'Subtle informational color for backgrounds and light indicators',
    description: 'Subtle teal for informational backgrounds and light info indicators'
  },

  // Text Hierarchy (3 tokens)
  'color.text.default': {
    name: 'color.text.default',
    primitiveReferences: { value: 'gray300' },
    category: SemanticCategory.COLOR,
    context: 'Primary text color for body content',
    description: 'Primary gray for main text content'
  },

  'color.text.muted': {
    name: 'color.text.muted',
    primitiveReferences: { value: 'gray200' },
    category: SemanticCategory.COLOR,
    context: 'Muted text color for secondary content',
    description: 'Muted gray for secondary and less prominent text'
  },

  'color.text.subtle': {
    name: 'color.text.subtle',
    primitiveReferences: { value: 'gray100' },
    category: SemanticCategory.COLOR,
    context: 'Subtle text color for tertiary content',
    description: 'Subtle gray for tertiary and very subtle text elements'
  },

  // Surfaces (3 tokens)
  'color.background': {
    name: 'color.background',
    primitiveReferences: { value: 'white100' },
    category: SemanticCategory.COLOR,
    context: 'Primary background color for main surfaces',
    description: 'Primary white background for main content areas'
  },

  'color.surface': {
    name: 'color.surface',
    primitiveReferences: { value: 'white200' },
    category: SemanticCategory.COLOR,
    context: 'Surface color for cards and elevated containers',
    description: 'Surface near-white for cards, containers, and elevated surfaces'
  },

  'color.border': {
    name: 'color.border',
    primitiveReferences: { value: 'gray100' },
    category: SemanticCategory.COLOR,
    context: 'Border color for UI elements and dividers',
    description: 'Border gray for standard UI element borders and dividers'
  },

  // Shadow Colors (4 tokens) - Mode-agnostic shadow tints
  'color.shadow.default': {
    name: 'color.shadow.default',
    primitiveReferences: { value: 'shadowBlack100' },
    category: SemanticCategory.COLOR,
    context: 'Default shadow color for standard UI shadows',
    description: 'Pure black shadow for neutral lighting (noon)'
  },

  'color.shadow.warm': {
    name: 'color.shadow.warm',
    primitiveReferences: { value: 'shadowBlue100' },
    category: SemanticCategory.COLOR,
    context: 'Warm shadow color for sunrise/sunset lighting',
    description: 'Cool blue-gray tinted shadow (warm light creates cool shadows)'
  },

  'color.shadow.cool': {
    name: 'color.shadow.cool',
    primitiveReferences: { value: 'shadowOrange100' },
    category: SemanticCategory.COLOR,
    context: 'Cool shadow color for cool lighting environments',
    description: 'Warm gray tinted shadow (cool light creates warm shadows)'
  },

  'color.shadow.ambient': {
    name: 'color.shadow.ambient',
    primitiveReferences: { value: 'shadowGray100' },
    category: SemanticCategory.COLOR,
    context: 'Ambient shadow color for overcast/ambient lighting',
    description: 'Blue-gray tinted shadow for ambient conditions'
  },

  // Glow Colors (3 tokens) - Reference existing vibrant primitive colors
  'glow.neonPurple': {
    name: 'glow.neonPurple',
    primitiveReferences: { value: 'purple500' },
    category: SemanticCategory.COLOR,
    context: 'Neon purple glow color for emphasis effects',
    description: 'Vibrant purple glow referencing purple500'
  },

  'glow.neonCyan': {
    name: 'glow.neonCyan',
    primitiveReferences: { value: 'cyan500' },
    category: SemanticCategory.COLOR,
    context: 'Neon cyan glow color for emphasis effects',
    description: 'Vibrant cyan glow referencing cyan500'
  },

  'glow.neonYellow': {
    name: 'glow.neonYellow',
    primitiveReferences: { value: 'yellow500' },
    category: SemanticCategory.COLOR,
    context: 'Neon yellow glow color for emphasis effects',
    description: 'Vibrant yellow glow referencing yellow500'
  }
};

/**
 * Array of all color semantic token names for iteration
 * Total: 22 tokens (15 original + 4 shadow + 3 glow)
 */
export const colorTokenNames = Object.keys(colorTokens);

/**
 * Get color semantic token by name
 */
export function getColorToken(name: string): Omit<SemanticToken, 'primitiveTokens'> | undefined {
  return colorTokens[name];
}

/**
 * Get all color semantic tokens as array
 */
export function getAllColorTokens(): Array<Omit<SemanticToken, 'primitiveTokens'>> {
  return Object.values(colorTokens);
}

/**
 * Validate token count matches spec (22 tokens: 15 original + 4 shadow + 3 glow)
 */
export function validateColorTokenCount(): boolean {
  const expectedCount = 22;
  const actualCount = colorTokenNames.length;
  if (actualCount !== expectedCount) {
    console.warn(`Color token count mismatch: expected ${expectedCount}, got ${actualCount}`);
    return false;
  }
  return true;
}
