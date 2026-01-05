/**
 * Semantic Color Token Definitions
 * 
 * Mode-aware semantic color tokens following systematic palette guidelines:
 * - primary = purple (brand authority and focus states)
 * - success = green (success states and positive feedback)
 * - warning = amber (urgent attention and warnings)
 * - error = pink (error states and destructive actions)
 * - info = teal (informational states)
 * - attention = yellow (attention-grabbing elements)
 * - highlight = yellow (emphasized content)
 * - tech = cyan (technical elements)
 * - data = cyan (data visualization)
 * - glow colors = vibrant neon colors for emphasis effects
 * 
 * All color tokens reference mode-aware primitive color tokens that support
 * light/dark modes with base/wcag themes.
 * 
 * Glow colors reference existing vibrant primitive colors (purple500, cyan500, yellow500,
 * green500, pink500) for neon emphasis effects.
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
 * Spec-aligned: 29 color semantic tokens (16 original + 4 new color tokens + 5 glow tokens + 2 icon/print tokens + 1 canvas token + 1 background.primary.subtle)
 * Note: color.secondary removed as part of color palette update (Spec 015)
 * Added: color.icon.default and color.print.default (Spec 023)
 * Added: color.canvas (Spec 023 - Container token compliance)
 * Added: color.background.primary.subtle (Spec 035 - Button-Icon Component)
 */

import { SemanticToken, SemanticCategory } from '../../types/SemanticToken';

/**
 * Semantic color tokens for systematic color usage
 * Total: 29 tokens (16 original + 4 new color tokens + 5 glow tokens + 2 icon/print tokens + 1 canvas token + 1 background.primary.subtle)
 * Note: color.secondary removed as part of color palette update (Spec 015)
 * Added: color.icon.default and color.print.default (Spec 023)
 * Added: color.canvas (Spec 023 - Container token compliance)
 * Added: color.background.primary.subtle (Spec 035 - Button-Icon Component)
 */
export const colorTokens: Record<string, Omit<SemanticToken, 'primitiveTokens'>> = {
  // Brand Identity (1 token)
  'color.primary': {
    name: 'color.primary',
    primitiveReferences: { value: 'purple300' },
    category: SemanticCategory.COLOR,
    context: 'Primary brand color for main CTAs, links, and brand elements',
    description: 'Primary purple color representing brand authority and focus states'
  },

  // Status Feedback - Success (2 tokens)
  'color.success.strong': {
    name: 'color.success.strong',
    primitiveReferences: { value: 'green400' },
    category: SemanticCategory.COLOR,
    context: 'Strong success color for prominent success states and text',
    description: 'Strong green for prominent success indicators, text, and icons'
  },

  'color.success.subtle': {
    name: 'color.success.subtle',
    primitiveReferences: { value: 'green100' },
    category: SemanticCategory.COLOR,
    context: 'Subtle success color for backgrounds and light indicators',
    description: 'Subtle green for success backgrounds and light success indicators'
  },

  // Status Feedback - Warning (2 tokens)
  'color.warning.strong': {
    name: 'color.warning.strong',
    primitiveReferences: { value: 'orange400' },
    category: SemanticCategory.COLOR,
    context: 'Strong warning color for prominent warning states and text',
    description: 'Strong amber (orange) for prominent warning indicators, text, and icons'
  },

  'color.warning.subtle': {
    name: 'color.warning.subtle',
    primitiveReferences: { value: 'orange100' },
    category: SemanticCategory.COLOR,
    context: 'Subtle warning color for backgrounds and light indicators',
    description: 'Subtle amber (orange) for warning backgrounds and light warning indicators'
  },

  // Status Feedback - Error (2 tokens)
  'color.error.strong': {
    name: 'color.error.strong',
    primitiveReferences: { value: 'pink400' },
    category: SemanticCategory.COLOR,
    context: 'Strong error color for prominent error states and text',
    description: 'Strong pink for prominent error indicators, text, and icons'
  },

  'color.error.subtle': {
    name: 'color.error.subtle',
    primitiveReferences: { value: 'pink100' },
    category: SemanticCategory.COLOR,
    context: 'Subtle error color for backgrounds and light indicators',
    description: 'Subtle pink for error backgrounds and light error indicators'
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

  // Attention & Highlight (2 tokens)
  'color.attention': {
    name: 'color.attention',
    primitiveReferences: { value: 'yellow400' },
    category: SemanticCategory.COLOR,
    context: 'Attention color for elements requiring user focus',
    description: 'Yellow for attention-grabbing elements and notifications'
  },

  'color.highlight': {
    name: 'color.highlight',
    primitiveReferences: { value: 'yellow300' },
    category: SemanticCategory.COLOR,
    context: 'Highlight color for emphasized content',
    description: 'Yellow for highlighted text and emphasized content'
  },

  // Tech & Data (2 tokens)
  'color.tech': {
    name: 'color.tech',
    primitiveReferences: { value: 'cyan400' },
    category: SemanticCategory.COLOR,
    context: 'Tech color for technical elements and code',
    description: 'Cyan for technical elements, code snippets, and tech-related UI'
  },

  'color.data': {
    name: 'color.data',
    primitiveReferences: { value: 'cyan300' },
    category: SemanticCategory.COLOR,
    context: 'Data color for data visualization and metrics',
    description: 'Cyan for data visualization, metrics, and data-related elements'
  },

  // Text Hierarchy (4 tokens)
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

  'color.contrast.onPrimary': {
    name: 'color.contrast.onPrimary',
    primitiveReferences: { value: 'white100' },
    category: SemanticCategory.COLOR,
    context: 'Contrast color for content (text, icons) on primary-colored backgrounds',
    description: 'White color for use on primary color backgrounds - semantically accurate for both text and icons, aligns with WCAG terminology'
  },

  // Surfaces (5 tokens)
  'color.canvas': {
    name: 'color.canvas',
    primitiveReferences: { value: 'white100' },
    category: SemanticCategory.COLOR,
    context: 'Base canvas color for page backgrounds',
    description: 'Canvas background color - default surface for all pages'
  },

  'color.background': {
    name: 'color.background',
    primitiveReferences: { value: 'white100' },
    category: SemanticCategory.COLOR,
    context: 'Primary background color for main surfaces',
    description: 'Primary white background for main content areas'
  },

  'color.background.primary.subtle': {
    name: 'color.background.primary.subtle',
    primitiveReferences: { value: 'purple100' },
    category: SemanticCategory.COLOR,
    context: 'Subtle primary background for hover states and selections',
    description: 'Subtle purple tint background for secondary button hover states, selected list items, and hover states on cards/containers'
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

  // Icon Colors (1 token)
  'color.icon.default': {
    name: 'color.icon.default',
    primitiveReferences: { value: 'gray200' },
    category: SemanticCategory.COLOR,
    context: 'Default icon color with optical balance (slightly lighter than text)',
    description: 'Default icon color using gray200 for optical balance - slightly lighter than text (gray300) for proper visual weight'
  },

  // Print Media Colors (1 token)
  'color.print.default': {
    name: 'color.print.default',
    primitiveReferences: { value: 'black100' },
    category: SemanticCategory.COLOR,
    context: 'Pure black color for print media',
    description: 'Pure black (#000000) for optimal printing quality in print media queries'
  },

  // Glow Colors (5 tokens) - Reference existing vibrant primitive colors
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
  },

  'glow.neonGreen': {
    name: 'glow.neonGreen',
    primitiveReferences: { value: 'green500' },
    category: SemanticCategory.COLOR,
    context: 'Neon green glow color for emphasis effects',
    description: 'Vibrant green glow referencing green500'
  },

  'glow.neonPink': {
    name: 'glow.neonPink',
    primitiveReferences: { value: 'pink500' },
    category: SemanticCategory.COLOR,
    context: 'Neon pink glow color for emphasis effects',
    description: 'Vibrant pink glow referencing pink500'
  }
};

/**
 * Array of all color semantic token names for iteration
 * Total: 29 tokens (16 original + 4 new color tokens + 5 glow tokens + 2 icon/print tokens + 1 canvas token + 1 background.primary.subtle)
 * Note: color.secondary removed as part of color palette update (Spec 015)
 * Added: color.icon.default and color.print.default (Spec 023)
 * Added: color.canvas (Spec 023 - Container token compliance)
 * Added: color.background.primary.subtle (Spec 035 - Button-Icon Component)
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
 * Validate token count matches spec (29 tokens: 16 original + 4 new color tokens + 5 glow tokens + 2 icon/print tokens + 1 canvas token + 1 background.primary.subtle)
 * Note: color.secondary removed as part of color palette update (Spec 015)
 * Added: color.icon.default and color.print.default (Spec 023)
 * Added: color.canvas (Spec 023 - Container token compliance)
 * Added: color.background.primary.subtle (Spec 035 - Button-Icon Component)
 */
export function validateColorTokenCount(): boolean {
  const expectedCount = 29;
  const actualCount = colorTokenNames.length;
  if (actualCount !== expectedCount) {
    console.warn(`Color token count mismatch: expected ${expectedCount}, got ${actualCount}`);
    return false;
  }
  return true;
}
