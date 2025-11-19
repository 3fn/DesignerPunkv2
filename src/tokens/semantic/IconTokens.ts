/**
 * Semantic Icon Size Token Definitions
 * 
 * Icon size tokens are calculated using the formula: fontSize × lineHeight
 * This ensures icons maintain perfect optical balance with their paired typography
 * by filling the vertical space of text lines.
 * 
 * Each token references fontSize and lineHeight primitives, enabling automatic
 * adaptation when typography scales change. The mathematical relationships are
 * preserved across all platforms through the unitless token architecture.
 */

import { SemanticToken, SemanticCategory } from '../../types/SemanticToken';
import { PrimitiveToken } from '../../types/PrimitiveToken';
import { fontSizeTokens } from '../FontSizeTokens';
import { lineHeightTokens } from '../LineHeightTokens';

/**
 * Typography context mapping for icon size tokens
 * Maps scale levels to their typical typography usage
 */
const typographyContextMap: Record<string, string> = {
  '050': 'Icon size for caption, legal, labelXs typography (smallest text)',
  '075': 'Icon size for bodySm, buttonSm, labelSm typography',
  '100': 'Icon size for bodyMd, buttonMd, labelMd, input typography (standard)',
  '125': 'Icon size for bodyLg, buttonLg, labelLg typography',
  '150': 'Icon size for h6 typography (smallest heading)',
  '200': 'Icon size for h5 typography',
  '300': 'Icon size for h4 typography',
  '400': 'Icon size for h3 typography',
  '500': 'Icon size for h2 typography',
  '600': 'Icon size for h1 typography',
  '700': 'Icon size for display typography (hero text)'
};

/**
 * Calculate icon size from fontSize and lineHeight tokens
 * Formula: iconSize = fontSize.baseValue × lineHeight.baseValue (rounded)
 * 
 * @param fontSizeToken - The fontSize primitive token
 * @param lineHeightToken - The lineHeight primitive token
 * @returns The calculated icon size (rounded to nearest integer)
 */
export function calculateIconSize(
  fontSizeToken: PrimitiveToken,
  lineHeightToken: PrimitiveToken
): number {
  return Math.round(fontSizeToken.baseValue * lineHeightToken.baseValue);
}

/**
 * Generate context description for an icon size token
 * 
 * @param scale - The scale level (e.g., '050', '100', '200')
 * @returns Context description for the icon size
 */
function generateIconSizeContext(scale: string): string {
  return typographyContextMap[scale] || `Icon size for scale ${scale}`;
}

/**
 * Generate description with calculation details for an icon size token
 * 
 * @param scale - The scale level (e.g., '050', '100', '200')
 * @param fontSize - The fontSize value
 * @param lineHeight - The lineHeight value
 * @param calculatedSize - The calculated icon size
 * @returns Description with calculation details
 */
function generateIconSizeDescription(
  scale: string,
  fontSize: number,
  lineHeight: number,
  calculatedSize: number
): string {
  const rawCalculation = fontSize * lineHeight;
  const needsRounding = rawCalculation !== calculatedSize;
  
  if (needsRounding) {
    return `Icon size calculated from fontSize${scale} × lineHeight${scale} = ${fontSize} × ${lineHeight} = ${calculatedSize}px (rounded from ${rawCalculation.toFixed(3)})`;
  }
  
  return `Icon size calculated from fontSize${scale} × lineHeight${scale} = ${fontSize} × ${lineHeight} = ${calculatedSize}px`;
}

/**
 * Generate all icon size tokens from fontSize and lineHeight primitives
 * 
 * @returns Record of icon size tokens with all 11 scale levels
 */
export function generateIconSizeTokens(): Record<string, Omit<SemanticToken, 'primitiveTokens'>> {
  const scales = ['050', '075', '100', '125', '150', '200', '300', '400', '500', '600', '700'];
  const tokens: Record<string, Omit<SemanticToken, 'primitiveTokens'>> = {};
  
  for (const scale of scales) {
    const fontSizeName = `fontSize${scale}`;
    const lineHeightName = `lineHeight${scale}`;
    const fontSize = fontSizeTokens[fontSizeName];
    const lineHeight = lineHeightTokens[lineHeightName];
    
    if (fontSize && lineHeight) {
      const size = calculateIconSize(fontSize, lineHeight);
      const tokenName = `icon.size${scale}`;
      
      tokens[tokenName] = {
        name: tokenName,
        primitiveReferences: {
          fontSize: fontSizeName,
          lineHeight: lineHeightName
        },
        category: SemanticCategory.ICON,
        context: generateIconSizeContext(scale),
        description: generateIconSizeDescription(scale, fontSize.baseValue, lineHeight.baseValue, size)
      };
    }
  }
  
  return tokens;
}

/**
 * Icon size semantic tokens for typography pairing
 * Following fontSize × lineHeight formula for optical balance
 */
export const iconTokens: Record<string, Omit<SemanticToken, 'primitiveTokens'>> = {
  'icon.size050': {
    name: 'icon.size050',
    primitiveReferences: {
      fontSize: 'fontSize050',
      lineHeight: 'lineHeight050'
    },
    category: SemanticCategory.ICON,
    context: 'Icon size for caption, legal, labelXs typography (smallest text)',
    description: 'Icon size calculated from fontSize050 × lineHeight050 = 13 × 1.0 = 13px'
  },

  'icon.size075': {
    name: 'icon.size075',
    primitiveReferences: {
      fontSize: 'fontSize075',
      lineHeight: 'lineHeight075'
    },
    category: SemanticCategory.ICON,
    context: 'Icon size for bodySm, buttonSm, labelSm typography',
    description: 'Icon size calculated from fontSize075 × lineHeight075 = 14 × 1.25 = 18px (rounded from 17.5)'
  },

  'icon.size100': {
    name: 'icon.size100',
    primitiveReferences: {
      fontSize: 'fontSize100',
      lineHeight: 'lineHeight100'
    },
    category: SemanticCategory.ICON,
    context: 'Icon size for bodyMd, buttonMd, labelMd, input typography (standard)',
    description: 'Icon size calculated from fontSize100 × lineHeight100 = 16 × 1.5 = 24px'
  },

  'icon.size125': {
    name: 'icon.size125',
    primitiveReferences: {
      fontSize: 'fontSize125',
      lineHeight: 'lineHeight125'
    },
    category: SemanticCategory.ICON,
    context: 'Icon size for bodyLg, buttonLg, labelLg typography',
    description: 'Icon size calculated from fontSize125 × lineHeight125 = 18 × 1.75 = 32px (rounded from 31.5)'
  },

  'icon.size150': {
    name: 'icon.size150',
    primitiveReferences: {
      fontSize: 'fontSize150',
      lineHeight: 'lineHeight150'
    },
    category: SemanticCategory.ICON,
    context: 'Icon size for h6 typography (smallest heading)',
    description: 'Icon size calculated from fontSize150 × lineHeight150 = 20 × 1.4 = 28px'
  },

  'icon.size200': {
    name: 'icon.size200',
    primitiveReferences: {
      fontSize: 'fontSize200',
      lineHeight: 'lineHeight200'
    },
    category: SemanticCategory.ICON,
    context: 'Icon size for h5 typography',
    description: 'Icon size calculated from fontSize200 × lineHeight200 = 23 × 1.391 = 32px (rounded from 31.993)'
  },

  'icon.size300': {
    name: 'icon.size300',
    primitiveReferences: {
      fontSize: 'fontSize300',
      lineHeight: 'lineHeight300'
    },
    category: SemanticCategory.ICON,
    context: 'Icon size for h4 typography',
    description: 'Icon size calculated from fontSize300 × lineHeight300 = 26 × 1.231 = 32px (rounded from 32.006)'
  },

  'icon.size400': {
    name: 'icon.size400',
    primitiveReferences: {
      fontSize: 'fontSize400',
      lineHeight: 'lineHeight400'
    },
    category: SemanticCategory.ICON,
    context: 'Icon size for h3 typography',
    description: 'Icon size calculated from fontSize400 × lineHeight400 = 29 × 1.241 = 36px (rounded from 35.989)'
  },

  'icon.size500': {
    name: 'icon.size500',
    primitiveReferences: {
      fontSize: 'fontSize500',
      lineHeight: 'lineHeight500'
    },
    category: SemanticCategory.ICON,
    context: 'Icon size for h2 typography',
    description: 'Icon size calculated from fontSize500 × lineHeight500 = 33 × 1.212 = 40px (rounded from 39.996)'
  },

  'icon.size600': {
    name: 'icon.size600',
    primitiveReferences: {
      fontSize: 'fontSize600',
      lineHeight: 'lineHeight600'
    },
    category: SemanticCategory.ICON,
    context: 'Icon size for h1 typography',
    description: 'Icon size calculated from fontSize600 × lineHeight600 = 37 × 1.19 = 44px (rounded from 44.03)'
  },

  'icon.size700': {
    name: 'icon.size700',
    primitiveReferences: {
      fontSize: 'fontSize700',
      lineHeight: 'lineHeight700'
    },
    category: SemanticCategory.ICON,
    context: 'Icon size for display typography (hero text)',
    description: 'Icon size calculated from fontSize700 × lineHeight700 = 42 × 1.143 = 48px (rounded from 48.006)'
  }
};

/**
 * Array of all icon size token names for iteration
 */
export const iconTokenNames = Object.keys(iconTokens);

/**
 * Get icon size token by name
 */
export function getIconToken(name: string): Omit<SemanticToken, 'primitiveTokens'> | undefined {
  return iconTokens[name];
}

/**
 * Get all icon size tokens as array
 */
export function getAllIconTokens(): Array<Omit<SemanticToken, 'primitiveTokens'>> {
  return Object.values(iconTokens);
}
