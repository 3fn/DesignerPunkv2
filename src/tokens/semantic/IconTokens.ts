/**
 * Semantic Icon Size Token Definitions
 * 
 * Icon size tokens are calculated using the formula: fontSize × multiplier
 * This ensures icons maintain perfect optical balance with their paired typography.
 * 
 * The multiplier can be:
 * - A lineHeight token reference (e.g., 'lineHeight100') for standard typography pairing
 * - A raw number (e.g., 1.231) for optical correction at edge cases
 * 
 * Most tokens use lineHeight references, enabling automatic adaptation when typography
 * scales change. Edge cases like icon.size050 use custom multipliers for better
 * optical balance with small text.
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
 * Calculate icon size from fontSize and multiplier
 * Formula: iconSize = fontSize.baseValue × multiplier (rounded)
 * 
 * @param fontSizeToken - The fontSize primitive token
 * @param multiplier - Either a lineHeight primitive token or a raw number
 * @returns The calculated icon size (rounded to nearest integer)
 */
export function calculateIconSize(
  fontSizeToken: PrimitiveToken,
  multiplier: PrimitiveToken | number
): number {
  const multiplierValue = typeof multiplier === 'number' ? multiplier : multiplier.baseValue;
  return Math.round(fontSizeToken.baseValue * multiplierValue);
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
 * @param multiplier - The multiplier value (from lineHeight token or custom)
 * @param multiplierSource - Source of multiplier ('lineHeight' token name or 'custom')
 * @param calculatedSize - The calculated icon size
 * @returns Description with calculation details
 */
function generateIconSizeDescription(
  scale: string,
  fontSize: number,
  multiplier: number,
  multiplierSource: string,
  calculatedSize: number
): string {
  const rawCalculation = fontSize * multiplier;
  const needsRounding = rawCalculation !== calculatedSize;
  const sourceLabel = multiplierSource === 'custom' ? 'custom multiplier' : multiplierSource;
  
  if (needsRounding) {
    return `Icon size calculated from fontSize${scale} × ${sourceLabel} = ${fontSize} × ${multiplier} = ${calculatedSize}px (rounded from ${rawCalculation.toFixed(3)})`;
  }
  
  return `Icon size calculated from fontSize${scale} × ${sourceLabel} = ${fontSize} × ${multiplier} = ${calculatedSize}px`;
}

/**
 * Custom multiplier prefix for icon tokens that don't use lineHeight references
 * Format: 'custom:X.XXX' where X.XXX is the multiplier value
 */
export const CUSTOM_MULTIPLIER_PREFIX = 'custom:';

/**
 * Custom multiplier overrides for specific scales
 * Used when lineHeight doesn't provide optimal optical balance
 */
const customMultiplierOverrides: Record<string, number> = {
  '050': 1.231  // 16px icon for 13px text (vs 20px from lineHeight050)
};

/**
 * Generate all icon size tokens from fontSize and multiplier (lineHeight or custom)
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
      // Check if this scale has a custom multiplier override
      const customMultiplier = customMultiplierOverrides[scale];
      const useCustom = customMultiplier !== undefined;
      
      const multiplierValue = useCustom ? customMultiplier : lineHeight.baseValue;
      const multiplierRef = useCustom ? `${CUSTOM_MULTIPLIER_PREFIX}${customMultiplier}` : lineHeightName;
      const multiplierSource = useCustom ? 'custom' : lineHeightName;
      
      const size = calculateIconSize(fontSize, multiplierValue);
      const tokenName = `icon.size${scale}`;
      
      tokens[tokenName] = {
        name: tokenName,
        primitiveReferences: {
          fontSize: fontSizeName,
          multiplier: multiplierRef
        },
        category: SemanticCategory.ICON,
        context: generateIconSizeContext(scale),
        description: generateIconSizeDescription(scale, fontSize.baseValue, multiplierValue, multiplierSource, size)
      };
    }
  }
  
  return tokens;
}

/**
 * Parse a multiplier value from primitiveReferences
 * Returns the numeric value whether it's a lineHeight reference or custom multiplier
 */
export function parseMultiplier(multiplierRef: string | undefined): number {
  if (!multiplierRef) {
    throw new Error('Multiplier reference is undefined');
  }
  if (multiplierRef.startsWith(CUSTOM_MULTIPLIER_PREFIX)) {
    return parseFloat(multiplierRef.slice(CUSTOM_MULTIPLIER_PREFIX.length));
  }
  // It's a lineHeight token reference
  const lineHeightToken = lineHeightTokens[multiplierRef];
  if (!lineHeightToken) {
    throw new Error(`Invalid lineHeight reference: ${multiplierRef}`);
  }
  return lineHeightToken.baseValue;
}

/**
 * Check if a multiplier is a custom value (not a lineHeight reference)
 */
export function isCustomMultiplier(multiplierRef: string | undefined): boolean {
  if (!multiplierRef) {
    return false;
  }
  return multiplierRef.startsWith(CUSTOM_MULTIPLIER_PREFIX);
}

/**
 * Icon semantic tokens for typography pairing and icon properties
 * 
 * Icon size tokens follow fontSize × multiplier formula for optical balance.
 * Most tokens use lineHeight references as multipliers for standard typography pairing.
 * icon.size050 uses a custom multiplier (custom:1.231) for better optical balance with 13px text.
 * 
 * Icon property tokens define standard icon characteristics like stroke width.
 * 
 * Updated to reflect precision-targeted lineHeight multipliers for 8pt vertical rhythm
 */
export const iconTokens: Record<string, Omit<SemanticToken, 'primitiveTokens'>> = {
  // Icon Properties (1 token)
  'icon.strokeWidth': {
    name: 'icon.strokeWidth',
    primitiveReferences: {
      value: 'borderWidth200'
    },
    category: SemanticCategory.ICON,
    context: 'Standard stroke width for icon outlines',
    description: 'Standard stroke width for icon outlines, references borderWidth200 (2px) for consistency with Feather Icons design'
  },

  // Icon Sizes (11 tokens)
  'icon.size050': {
    name: 'icon.size050',
    primitiveReferences: {
      fontSize: 'fontSize050',
      multiplier: 'custom:1.231'  // Custom multiplier for optical balance (16px vs 20px from lineHeight050)
    },
    category: SemanticCategory.ICON,
    context: 'Icon size for caption, legal, labelXs typography (smallest text)',
    description: 'Icon size calculated from fontSize050 × custom multiplier = 13 × 1.231 = 16px (rounded from 16.003). Uses optical correction multiplier instead of lineHeight050 (1.538) for better balance with small text.'
  },

  'icon.size075': {
    name: 'icon.size075',
    primitiveReferences: {
      fontSize: 'fontSize075',
      multiplier: 'lineHeight075'
    },
    category: SemanticCategory.ICON,
    context: 'Icon size for bodySm, buttonSm, labelSm typography',
    description: 'Icon size calculated from fontSize075 × lineHeight075 = 14 × 1.429 = 20px (rounded from 20.006)'
  },

  'icon.size100': {
    name: 'icon.size100',
    primitiveReferences: {
      fontSize: 'fontSize100',
      multiplier: 'lineHeight100'
    },
    category: SemanticCategory.ICON,
    context: 'Icon size for bodyMd, buttonMd, labelMd, input typography (standard)',
    description: 'Icon size calculated from fontSize100 × lineHeight100 = 16 × 1.5 = 24px'
  },

  'icon.size125': {
    name: 'icon.size125',
    primitiveReferences: {
      fontSize: 'fontSize125',
      multiplier: 'lineHeight125'
    },
    category: SemanticCategory.ICON,
    context: 'Icon size for bodyLg, buttonLg, labelLg typography',
    description: 'Icon size calculated from fontSize125 × lineHeight125 = 18 × 1.556 = 28px (rounded from 28.008)'
  },

  'icon.size150': {
    name: 'icon.size150',
    primitiveReferences: {
      fontSize: 'fontSize150',
      multiplier: 'lineHeight150'
    },
    category: SemanticCategory.ICON,
    context: 'Icon size for h6 typography (smallest heading)',
    description: 'Icon size calculated from fontSize150 × lineHeight150 = 20 × 1.4 = 28px'
  },

  'icon.size200': {
    name: 'icon.size200',
    primitiveReferences: {
      fontSize: 'fontSize200',
      multiplier: 'lineHeight200'
    },
    category: SemanticCategory.ICON,
    context: 'Icon size for h5 typography',
    description: 'Icon size calculated from fontSize200 × lineHeight200 = 23 × 1.391 = 32px (rounded from 31.993)'
  },

  'icon.size300': {
    name: 'icon.size300',
    primitiveReferences: {
      fontSize: 'fontSize300',
      multiplier: 'lineHeight300'
    },
    category: SemanticCategory.ICON,
    context: 'Icon size for h4 typography',
    description: 'Icon size calculated from fontSize300 × lineHeight300 = 26 × 1.231 = 32px (rounded from 32.006)'
  },

  'icon.size400': {
    name: 'icon.size400',
    primitiveReferences: {
      fontSize: 'fontSize400',
      multiplier: 'lineHeight400'
    },
    category: SemanticCategory.ICON,
    context: 'Icon size for h3 typography',
    description: 'Icon size calculated from fontSize400 × lineHeight400 = 29 × 1.241 = 36px (rounded from 35.989)'
  },

  'icon.size500': {
    name: 'icon.size500',
    primitiveReferences: {
      fontSize: 'fontSize500',
      multiplier: 'lineHeight500'
    },
    category: SemanticCategory.ICON,
    context: 'Icon size for h2 typography',
    description: 'Icon size calculated from fontSize500 × lineHeight500 = 33 × 1.212 = 40px (rounded from 39.996)'
  },

  'icon.size600': {
    name: 'icon.size600',
    primitiveReferences: {
      fontSize: 'fontSize600',
      multiplier: 'lineHeight600'
    },
    category: SemanticCategory.ICON,
    context: 'Icon size for h1 typography',
    description: 'Icon size calculated from fontSize600 × lineHeight600 = 37 × 1.19 = 44px (rounded from 44.03)'
  },

  'icon.size700': {
    name: 'icon.size700',
    primitiveReferences: {
      fontSize: 'fontSize700',
      multiplier: 'lineHeight700'
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
