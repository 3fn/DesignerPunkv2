/**
 * Semantic Color Token Definitions
 * 
 * Mode-aware semantic color tokens following systematic palette guidelines:
 * - primary = purple (brand authority and focus states)
 * - secondary = violet (sophisticated depth and secondary elements)
 * - success = cyan (tech/digital and success states)
 * - warning = yellow (urgent attention and warnings)
 * - error = orange (approachable error states)
 * 
 * All color tokens reference mode-aware primitive color tokens that support
 * light/dark modes with base/wcag themes.
 */

import { SemanticToken, SemanticCategory } from '../../types/SemanticToken';

/**
 * Semantic color tokens for systematic color usage
 */
export const colorTokens: Record<string, Omit<SemanticToken, 'primitiveTokens'>> = {
  // Primary brand colors (purple - brand authority)
  'color.primary': {
    name: 'color.primary',
    primitiveReferences: { default: 'purple300' },
    category: SemanticCategory.COLOR,
    context: 'Primary brand color for main CTAs, links, and brand elements',
    description: 'Primary purple color representing brand authority and focus states'
  },

  'color.primaryLight': {
    name: 'color.primaryLight',
    primitiveReferences: { default: 'purple200' },
    category: SemanticCategory.COLOR,
    context: 'Light primary color for hover states and backgrounds',
    description: 'Light purple for primary element hover states and subtle backgrounds'
  },

  'color.primaryDark': {
    name: 'color.primaryDark',
    primitiveReferences: { default: 'purple400' },
    category: SemanticCategory.COLOR,
    context: 'Dark primary color for pressed states and emphasis',
    description: 'Dark purple for primary element pressed states and strong emphasis'
  },

  'color.primarySubtle': {
    name: 'color.primarySubtle',
    primitiveReferences: { default: 'purple100' },
    category: SemanticCategory.COLOR,
    context: 'Subtle primary color for backgrounds and highlights',
    description: 'Very light purple for subtle primary backgrounds and highlights'
  },

  // Secondary colors (violet - sophisticated depth)
  'color.secondary': {
    name: 'color.secondary',
    primitiveReferences: { default: 'violet300' },
    category: SemanticCategory.COLOR,
    context: 'Secondary brand color for secondary CTAs and elements',
    description: 'Secondary violet color providing sophisticated depth and secondary UI elements'
  },

  'color.secondaryLight': {
    name: 'color.secondaryLight',
    primitiveReferences: { default: 'violet200' },
    category: SemanticCategory.COLOR,
    context: 'Light secondary color for hover states',
    description: 'Light violet for secondary element hover states'
  },

  'color.secondaryDark': {
    name: 'color.secondaryDark',
    primitiveReferences: { default: 'violet400' },
    category: SemanticCategory.COLOR,
    context: 'Dark secondary color for pressed states',
    description: 'Dark violet for secondary element pressed states'
  },

  'color.secondarySubtle': {
    name: 'color.secondarySubtle',
    primitiveReferences: { default: 'violet100' },
    category: SemanticCategory.COLOR,
    context: 'Subtle secondary color for backgrounds',
    description: 'Very light violet for subtle secondary backgrounds'
  },

  // Success colors (cyan - tech/digital)
  'color.success': {
    name: 'color.success',
    primitiveReferences: { default: 'cyan300' },
    category: SemanticCategory.COLOR,
    context: 'Success state color for confirmations and positive feedback',
    description: 'Success cyan color representing tech/digital and positive states'
  },

  'color.successLight': {
    name: 'color.successLight',
    primitiveReferences: { default: 'cyan200' },
    category: SemanticCategory.COLOR,
    context: 'Light success color for backgrounds',
    description: 'Light cyan for success backgrounds and subtle indicators'
  },

  'color.successDark': {
    name: 'color.successDark',
    primitiveReferences: { default: 'cyan400' },
    category: SemanticCategory.COLOR,
    context: 'Dark success color for text and icons',
    description: 'Dark cyan for success text and icon elements'
  },

  'color.successSubtle': {
    name: 'color.successSubtle',
    primitiveReferences: { default: 'cyan100' },
    category: SemanticCategory.COLOR,
    context: 'Subtle success color for backgrounds',
    description: 'Very light cyan for subtle success backgrounds'
  },

  // Warning colors (yellow - urgent attention)
  'color.warning': {
    name: 'color.warning',
    primitiveReferences: { default: 'yellow300' },
    category: SemanticCategory.COLOR,
    context: 'Warning state color for cautions and alerts',
    description: 'Warning yellow color for urgent attention and caution states'
  },

  'color.warningLight': {
    name: 'color.warningLight',
    primitiveReferences: { default: 'yellow200' },
    category: SemanticCategory.COLOR,
    context: 'Light warning color for backgrounds',
    description: 'Light yellow for warning backgrounds and subtle indicators'
  },

  'color.warningDark': {
    name: 'color.warningDark',
    primitiveReferences: { default: 'yellow400' },
    category: SemanticCategory.COLOR,
    context: 'Dark warning color for text and icons',
    description: 'Dark yellow for warning text and icon elements'
  },

  'color.warningSubtle': {
    name: 'color.warningSubtle',
    primitiveReferences: { default: 'yellow100' },
    category: SemanticCategory.COLOR,
    context: 'Subtle warning color for backgrounds',
    description: 'Very light yellow for subtle warning backgrounds'
  },

  // Error colors (orange - approachable errors)
  'color.error': {
    name: 'color.error',
    primitiveReferences: { default: 'orange300' },
    category: SemanticCategory.COLOR,
    context: 'Error state color for errors and destructive actions',
    description: 'Error orange color for approachable error states and destructive actions'
  },

  'color.errorLight': {
    name: 'color.errorLight',
    primitiveReferences: { default: 'orange200' },
    category: SemanticCategory.COLOR,
    context: 'Light error color for backgrounds',
    description: 'Light orange for error backgrounds and subtle indicators'
  },

  'color.errorDark': {
    name: 'color.errorDark',
    primitiveReferences: { default: 'orange400' },
    category: SemanticCategory.COLOR,
    context: 'Dark error color for text and icons',
    description: 'Dark orange for error text and icon elements'
  },

  'color.errorSubtle': {
    name: 'color.errorSubtle',
    primitiveReferences: { default: 'orange100' },
    category: SemanticCategory.COLOR,
    context: 'Subtle error color for backgrounds',
    description: 'Very light orange for subtle error backgrounds'
  },

  // Neutral colors (gray scale)
  'color.textPrimary': {
    name: 'color.textPrimary',
    primitiveReferences: { default: 'gray300' },
    category: SemanticCategory.COLOR,
    context: 'Primary text color for body content',
    description: 'Primary gray for main text content'
  },

  'color.textSecondary': {
    name: 'color.textSecondary',
    primitiveReferences: { default: 'gray200' },
    category: SemanticCategory.COLOR,
    context: 'Secondary text color for less prominent content',
    description: 'Secondary gray for less prominent text'
  },

  'color.textTertiary': {
    name: 'color.textTertiary',
    primitiveReferences: { default: 'gray100' },
    category: SemanticCategory.COLOR,
    context: 'Tertiary text color for subtle content',
    description: 'Tertiary gray for subtle text elements'
  },

  'color.textInverse': {
    name: 'color.textInverse',
    primitiveReferences: { default: 'white100' },
    category: SemanticCategory.COLOR,
    context: 'Inverse text color for dark backgrounds',
    description: 'White text for use on dark backgrounds'
  },

  // Background colors
  'color.backgroundPrimary': {
    name: 'color.backgroundPrimary',
    primitiveReferences: { default: 'white100' },
    category: SemanticCategory.COLOR,
    context: 'Primary background color for main surfaces',
    description: 'Primary white background for main content areas'
  },

  'color.backgroundSecondary': {
    name: 'color.backgroundSecondary',
    primitiveReferences: { default: 'white200' },
    category: SemanticCategory.COLOR,
    context: 'Secondary background color for cards and containers',
    description: 'Secondary near-white background for elevated surfaces'
  },

  'color.backgroundTertiary': {
    name: 'color.backgroundTertiary',
    primitiveReferences: { default: 'white300' },
    category: SemanticCategory.COLOR,
    context: 'Tertiary background color for subtle surfaces',
    description: 'Tertiary light gray-white for subtle surface variations'
  },

  'color.backgroundInverse': {
    name: 'color.backgroundInverse',
    primitiveReferences: { default: 'black300' },
    category: SemanticCategory.COLOR,
    context: 'Inverse background color for dark mode surfaces',
    description: 'Dark black background for inverse/dark mode surfaces'
  },

  // Border colors
  'color.borderDefault': {
    name: 'color.borderDefault',
    primitiveReferences: { default: 'white400' },
    category: SemanticCategory.COLOR,
    context: 'Default border color for UI elements',
    description: 'Default gray-white border for standard UI elements'
  },

  'color.borderSubtle': {
    name: 'color.borderSubtle',
    primitiveReferences: { default: 'white300' },
    category: SemanticCategory.COLOR,
    context: 'Subtle border color for dividers',
    description: 'Subtle light gray-white border for dividers and separators'
  },

  'color.borderStrong': {
    name: 'color.borderStrong',
    primitiveReferences: { default: 'gray200' },
    category: SemanticCategory.COLOR,
    context: 'Strong border color for emphasis',
    description: 'Strong gray border for emphasized UI elements'
  },

  // Interactive colors
  'color.interactive': {
    name: 'color.interactive',
    primitiveReferences: { default: 'purple300' },
    category: SemanticCategory.COLOR,
    context: 'Interactive element color for links and clickable items',
    description: 'Interactive purple for links and clickable elements'
  },

  'color.interactiveHover': {
    name: 'color.interactiveHover',
    primitiveReferences: { default: 'purple200' },
    category: SemanticCategory.COLOR,
    context: 'Interactive hover state color',
    description: 'Light purple for interactive element hover states'
  },

  'color.interactivePressed': {
    name: 'color.interactivePressed',
    primitiveReferences: { default: 'purple400' },
    category: SemanticCategory.COLOR,
    context: 'Interactive pressed state color',
    description: 'Dark purple for interactive element pressed states'
  },

  'color.focus': {
    name: 'color.focus',
    primitiveReferences: { default: 'purple300' },
    category: SemanticCategory.COLOR,
    context: 'Focus indicator color for keyboard navigation',
    description: 'Purple focus indicator for accessibility and keyboard navigation'
  }
};

/**
 * Array of all color semantic token names for iteration
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
