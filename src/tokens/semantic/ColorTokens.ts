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
 * - glow colors = vibrant neon colors for emphasis effects
 * 
 * All color tokens reference mode-aware primitive color tokens that support
 * light/dark modes with base/wcag themes.
 * 
 * Glow colors reference existing vibrant primitive colors (purple500, cyan500, yellow500)
 * for neon emphasis effects.
 * 
 * ARCHITECTURAL DECISION: Shadow Color Semantic Layer Removed
 * 
 * Shadow tokens now reference primitive shadow colors directly (e.g., shadowBlack100)
 * instead of going through a semantic color layer (e.g., color.shadow.default).
 * 
 * Rationale:
 * 1. Matches Industry Patterns: Major design systems (Material Design, Carbon, Polaris)
 *    include shadow color directly in shadow token definitions rather than creating
 *    separate semantic color tokens for shadows.
 * 
 * 2. Aligns with Typography Architecture: Typography tokens compose primitives directly
 *    (fontSize, lineHeight, fontWeight) without intermediate semantic layers. Shadow
 *    tokens should follow the same pattern.
 * 
 * 3. Eliminates Hierarchical References: Semantic→semantic references (shadow.dusk →
 *    color.shadow.default → shadowBlack100) create unnecessary complexity. Direct
 *    primitive references (shadow.dusk → shadowBlack100) are clearer.
 * 
 * 4. Shadow Colors Aren't Reusable: Shadow-specific colors like shadowBlack100 won't
 *    be used outside shadow contexts, so a semantic abstraction layer provides no value.
 * 
 * 5. Semantic Meaning in Shadow Token: The semantic meaning belongs in the shadow token
 *    name itself (shadow.dusk, shadow.sunrise) rather than in a separate color token.
 * 
 * Spec-aligned: 18 color semantic tokens (15 original + 3 glow, shadow colors removed)
 */

import { SemanticToken, SemanticCategory } from '../../types/SemanticToken';

/**
 * Semantic color tokens for systematic color usage
 * Total: 18 tokens (15 original + 3 glow, shadow colors removed)
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
 * Total: 18 tokens (15 original + 3 glow, shadow colors removed)
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
 * Validate token count matches spec (18 tokens: 15 original + 3 glow, shadow colors removed)
 */
export function validateColorTokenCount(): boolean {
  const expectedCount = 18;
  const actualCount = colorTokenNames.length;
  if (actualCount !== expectedCount) {
    console.warn(`Color token count mismatch: expected ${expectedCount}, got ${actualCount}`);
    return false;
  }
  return true;
}
