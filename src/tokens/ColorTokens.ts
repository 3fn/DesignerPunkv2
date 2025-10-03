/**
 * Color Primitive Tokens
 * 
 * Implements mode-aware and theme-aware color primitive tokens with systematic color families.
 * Each color token supports light/dark modes with base/wcag themes for comprehensive
 * accessibility and aesthetic flexibility.
 * 
 * Color families: gray, black, white, yellow, orange, purple, violet, cyan, teal
 * Progression: 100-500 scale for systematic color relationships
 * Architecture: colorToken[systemMode][userTheme] resolution pattern
 */

import { PrimitiveToken, TokenCategory, ColorTokenValue } from '../types/PrimitiveToken';

/**
 * Color token base value (N/A for hex values, not mathematical)
 */
export const COLOR_BASE_VALUE = 0; // N/A for categorical color tokens

/**
 * Gray scale color tokens - Neutral surfaces and text colors
 */
export const grayTokens = {
  gray100: {
    name: 'gray100',
    category: TokenCategory.COLOR,
    baseValue: 0, // N/A for color tokens
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Light gray for subtle backgrounds and muted text',
    mathematicalRelationship: 'Systematic gray scale progression - lightest',
    baselineGridAlignment: false, // N/A for color tokens
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { 
        value: {
          light: { base: '#B8B6C8', wcag: '#C2C0D4' },
          dark: { base: '#B8B6C8', wcag: '#C2C0D4' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      ios: { 
        value: {
          light: { base: '#B8B6C8', wcag: '#C2C0D4' },
          dark: { base: '#B8B6C8', wcag: '#C2C0D4' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      android: { 
        value: {
          light: { base: '#B8B6C8', wcag: '#C2C0D4' },
          dark: { base: '#B8B6C8', wcag: '#C2C0D4' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      }
    }
  } as PrimitiveToken,

  gray200: {
    name: 'gray200',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Medium-light gray for secondary text and borders',
    mathematicalRelationship: 'Systematic gray scale progression - medium-light',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { 
        value: {
          light: { base: '#68658A', wcag: '#8A879E' },
          dark: { base: '#68658A', wcag: '#8A879E' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      ios: { 
        value: {
          light: { base: '#68658A', wcag: '#8A879E' },
          dark: { base: '#68658A', wcag: '#8A879E' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      android: { 
        value: {
          light: { base: '#68658A', wcag: '#8A879E' },
          dark: { base: '#68658A', wcag: '#8A879E' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      }
    }
  } as PrimitiveToken,

  gray300: {
    name: 'gray300',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Medium gray for primary text and prominent borders',
    mathematicalRelationship: 'Systematic gray scale progression - medium',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { 
        value: {
          light: { base: '#2D2B3E', wcag: '#4D4A5C' },
          dark: { base: '#2D2B3E', wcag: '#4D4A5C' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      ios: { 
        value: {
          light: { base: '#2D2B3E', wcag: '#4D4A5C' },
          dark: { base: '#2D2B3E', wcag: '#4D4A5C' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      android: { 
        value: {
          light: { base: '#2D2B3E', wcag: '#4D4A5C' },
          dark: { base: '#2D2B3E', wcag: '#4D4A5C' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      }
    }
  } as PrimitiveToken,

  gray400: {
    name: 'gray400',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Dark gray for strong text and container backgrounds',
    mathematicalRelationship: 'Systematic gray scale progression - dark',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { 
        value: {
          light: { base: '#1F1D2E', wcag: '#2E2C3D' },
          dark: { base: '#1F1D2E', wcag: '#2E2C3D' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      ios: { 
        value: {
          light: { base: '#1F1D2E', wcag: '#2E2C3D' },
          dark: { base: '#1F1D2E', wcag: '#2E2C3D' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      android: { 
        value: {
          light: { base: '#1F1D2E', wcag: '#2E2C3D' },
          dark: { base: '#1F1D2E', wcag: '#2E2C3D' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      }
    }
  } as PrimitiveToken,

  gray500: {
    name: 'gray500',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Darkest gray for deep backgrounds and high contrast text',
    mathematicalRelationship: 'Systematic gray scale progression - darkest',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { 
        value: {
          light: { base: '#15131F', wcag: '#1A1826' },
          dark: { base: '#15131F', wcag: '#1A1826' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      ios: { 
        value: {
          light: { base: '#15131F', wcag: '#1A1826' },
          dark: { base: '#15131F', wcag: '#1A1826' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      android: { 
        value: {
          light: { base: '#15131F', wcag: '#1A1826' },
          dark: { base: '#15131F', wcag: '#1A1826' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      }
    }
  } as PrimitiveToken
};

/**
 * Black scale color tokens - Deep backgrounds and containers
 */
export const blackTokens = {
  black100: {
    name: 'black100',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Light black for subtle container backgrounds',
    mathematicalRelationship: 'Systematic black scale progression - lightest',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { 
        value: {
          light: { base: '#3A3A45', wcag: '#52525C' },
          dark: { base: '#3A3A45', wcag: '#52525C' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      ios: { 
        value: {
          light: { base: '#3A3A45', wcag: '#52525C' },
          dark: { base: '#3A3A45', wcag: '#52525C' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      android: { 
        value: {
          light: { base: '#3A3A45', wcag: '#52525C' },
          dark: { base: '#3A3A45', wcag: '#52525C' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      }
    }
  } as PrimitiveToken,

  black200: {
    name: 'black200',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Medium black for container backgrounds and surfaces',
    mathematicalRelationship: 'Systematic black scale progression - medium',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { 
        value: {
          light: { base: '#22222A', wcag: '#2E2E38' },
          dark: { base: '#22222A', wcag: '#2E2E38' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      ios: { 
        value: {
          light: { base: '#22222A', wcag: '#2E2E38' },
          dark: { base: '#22222A', wcag: '#2E2E38' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      android: { 
        value: {
          light: { base: '#22222A', wcag: '#2E2E38' },
          dark: { base: '#22222A', wcag: '#2E2E38' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      }
    }
  } as PrimitiveToken,

  black300: {
    name: 'black300',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Dark black for primary backgrounds and deep containers',
    mathematicalRelationship: 'Systematic black scale progression - dark',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { 
        value: {
          light: { base: '#0A0A0F', wcag: '#0A0A0F' },
          dark: { base: '#0A0A0F', wcag: '#0A0A0F' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      ios: { 
        value: {
          light: { base: '#0A0A0F', wcag: '#0A0A0F' },
          dark: { base: '#0A0A0F', wcag: '#0A0A0F' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      android: { 
        value: {
          light: { base: '#0A0A0F', wcag: '#0A0A0F' },
          dark: { base: '#0A0A0F', wcag: '#0A0A0F' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      }
    }
  } as PrimitiveToken,

  black400: {
    name: 'black400',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Very dark black for deep system backgrounds',
    mathematicalRelationship: 'Systematic black scale progression - very dark',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { 
        value: {
          light: { base: '#06060A', wcag: '#06060A' },
          dark: { base: '#06060A', wcag: '#06060A' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      ios: { 
        value: {
          light: { base: '#06060A', wcag: '#06060A' },
          dark: { base: '#06060A', wcag: '#06060A' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      android: { 
        value: {
          light: { base: '#06060A', wcag: '#06060A' },
          dark: { base: '#06060A', wcag: '#06060A' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      }
    }
  } as PrimitiveToken,

  black500: {
    name: 'black500',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Pure black for maximum contrast and system elements',
    mathematicalRelationship: 'Systematic black scale progression - pure black',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { 
        value: {
          light: { base: '#000000', wcag: '#000000' },
          dark: { base: '#000000', wcag: '#000000' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      ios: { 
        value: {
          light: { base: '#000000', wcag: '#000000' },
          dark: { base: '#000000', wcag: '#000000' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      android: { 
        value: {
          light: { base: '#000000', wcag: '#000000' },
          dark: { base: '#000000', wcag: '#000000' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      }
    }
  } as PrimitiveToken
};

/**
 * White scale color tokens - Light surfaces and primary text
 */
export const whiteTokens = {
  white100: {
    name: 'white100',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Pure white for maximum contrast and primary surfaces',
    mathematicalRelationship: 'Systematic white scale progression - pure white',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { 
        value: {
          light: { base: '#FFFFFF', wcag: '#FFFFFF' },
          dark: { base: '#FFFFFF', wcag: '#FFFFFF' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      ios: { 
        value: {
          light: { base: '#FFFFFF', wcag: '#FFFFFF' },
          dark: { base: '#FFFFFF', wcag: '#FFFFFF' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      android: { 
        value: {
          light: { base: '#FFFFFF', wcag: '#FFFFFF' },
          dark: { base: '#FFFFFF', wcag: '#FFFFFF' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      }
    }
  } as PrimitiveToken,

  white200: {
    name: 'white200',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Near-white for subtle surface variations',
    mathematicalRelationship: 'Systematic white scale progression - near white',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { 
        value: {
          light: { base: '#F5F5FA', wcag: '#F2F2FA' },
          dark: { base: '#F5F5FA', wcag: '#F2F2FA' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      ios: { 
        value: {
          light: { base: '#F5F5FA', wcag: '#F2F2FA' },
          dark: { base: '#F5F5FA', wcag: '#F2F2FA' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      android: { 
        value: {
          light: { base: '#F5F5FA', wcag: '#F2F2FA' },
          dark: { base: '#F5F5FA', wcag: '#F2F2FA' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      }
    }
  } as PrimitiveToken,

  white300: {
    name: 'white300',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Light gray-white for secondary surfaces and backgrounds',
    mathematicalRelationship: 'Systematic white scale progression - light gray-white',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { 
        value: {
          light: { base: '#E8E8F0', wcag: '#D9D9E6' },
          dark: { base: '#E8E8F0', wcag: '#D9D9E6' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      ios: { 
        value: {
          light: { base: '#E8E8F0', wcag: '#D9D9E6' },
          dark: { base: '#E8E8F0', wcag: '#D9D9E6' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      android: { 
        value: {
          light: { base: '#E8E8F0', wcag: '#D9D9E6' },
          dark: { base: '#E8E8F0', wcag: '#D9D9E6' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      }
    }
  } as PrimitiveToken,

  white400: {
    name: 'white400',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Medium gray-white for borders and dividers',
    mathematicalRelationship: 'Systematic white scale progression - medium gray-white',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { 
        value: {
          light: { base: '#C5C5D5', wcag: '#A6A6BF' },
          dark: { base: '#C5C5D5', wcag: '#A6A6BF' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      ios: { 
        value: {
          light: { base: '#C5C5D5', wcag: '#A6A6BF' },
          dark: { base: '#C5C5D5', wcag: '#A6A6BF' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      android: { 
        value: {
          light: { base: '#C5C5D5', wcag: '#A6A6BF' },
          dark: { base: '#C5C5D5', wcag: '#A6A6BF' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      }
    }
  } as PrimitiveToken,

  white500: {
    name: 'white500',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Dark gray-white for muted text and subtle elements',
    mathematicalRelationship: 'Systematic white scale progression - dark gray-white',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { 
        value: {
          light: { base: '#9999AB', wcag: '#737388' },
          dark: { base: '#9999AB', wcag: '#737388' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      ios: { 
        value: {
          light: { base: '#9999AB', wcag: '#737388' },
          dark: { base: '#9999AB', wcag: '#737388' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      android: { 
        value: {
          light: { base: '#9999AB', wcag: '#737388' },
          dark: { base: '#9999AB', wcag: '#737388' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      }
    }
  } as PrimitiveToken
};/**

 * Yellow scale color tokens - High-energy CTAs and warnings
 */
export const yellowTokens = {
  yellow100: {
    name: 'yellow100',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Light yellow for subtle warning backgrounds and highlights',
    mathematicalRelationship: 'Systematic yellow scale progression - lightest',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { 
        value: {
          light: { base: '#FEFBCC', wcag: '#FFF9B3' },
          dark: { base: '#FEFBCC', wcag: '#FFF9B3' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      ios: { 
        value: {
          light: { base: '#FEFBCC', wcag: '#FFF9B3' },
          dark: { base: '#FEFBCC', wcag: '#FFF9B3' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      android: { 
        value: {
          light: { base: '#FEFBCC', wcag: '#FFF9B3' },
          dark: { base: '#FEFBCC', wcag: '#FFF9B3' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      }
    }
  } as PrimitiveToken,

  yellow200: {
    name: 'yellow200',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Medium-light yellow for warning highlights and attention',
    mathematicalRelationship: 'Systematic yellow scale progression - medium-light',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { 
        value: {
          light: { base: '#FCF680', wcag: '#F5E34A' },
          dark: { base: '#FCF680', wcag: '#F5E34A' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      ios: { 
        value: {
          light: { base: '#FCF680', wcag: '#F5E34A' },
          dark: { base: '#FCF680', wcag: '#F5E34A' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      android: { 
        value: {
          light: { base: '#FCF680', wcag: '#F5E34A' },
          dark: { base: '#FCF680', wcag: '#F5E34A' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      }
    }
  } as PrimitiveToken,

  yellow300: {
    name: 'yellow300',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Bright yellow for high-energy CTAs and urgent warnings',
    mathematicalRelationship: 'Systematic yellow scale progression - bright',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { 
        value: {
          light: { base: '#F9F002', wcag: '#E6D200' },
          dark: { base: '#F9F002', wcag: '#E6D200' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      ios: { 
        value: {
          light: { base: '#F9F002', wcag: '#E6D200' },
          dark: { base: '#F9F002', wcag: '#E6D200' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      android: { 
        value: {
          light: { base: '#F9F002', wcag: '#E6D200' },
          dark: { base: '#F9F002', wcag: '#E6D200' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      }
    }
  } as PrimitiveToken,

  yellow400: {
    name: 'yellow400',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Dark yellow for warning text and secondary warning elements',
    mathematicalRelationship: 'Systematic yellow scale progression - dark',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { 
        value: {
          light: { base: '#C7C002', wcag: '#9B8E00' },
          dark: { base: '#C7C002', wcag: '#9B8E00' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      ios: { 
        value: {
          light: { base: '#C7C002', wcag: '#9B8E00' },
          dark: { base: '#C7C002', wcag: '#9B8E00' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      android: { 
        value: {
          light: { base: '#C7C002', wcag: '#9B8E00' },
          dark: { base: '#C7C002', wcag: '#9B8E00' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      }
    }
  } as PrimitiveToken,

  yellow500: {
    name: 'yellow500',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Darkest yellow for warning text on light backgrounds',
    mathematicalRelationship: 'Systematic yellow scale progression - darkest',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { 
        value: {
          light: { base: '#8F8B01', wcag: '#5C5400' },
          dark: { base: '#8F8B01', wcag: '#5C5400' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      ios: { 
        value: {
          light: { base: '#8F8B01', wcag: '#5C5400' },
          dark: { base: '#8F8B01', wcag: '#5C5400' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      android: { 
        value: {
          light: { base: '#8F8B01', wcag: '#5C5400' },
          dark: { base: '#8F8B01', wcag: '#5C5400' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      }
    }
  } as PrimitiveToken
};

/**
 * Orange scale color tokens - Secondary CTAs and approachable error states
 */
export const orangeTokens = {
  orange100: {
    name: 'orange100',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Light orange for subtle error backgrounds and warm highlights',
    mathematicalRelationship: 'Systematic orange scale progression - lightest',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { 
        value: {
          light: { base: '#FFE5DC', wcag: '#FFD4C2' },
          dark: { base: '#FFE5DC', wcag: '#FFD4C2' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      ios: { 
        value: {
          light: { base: '#FFE5DC', wcag: '#FFD4C2' },
          dark: { base: '#FFE5DC', wcag: '#FFD4C2' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      android: { 
        value: {
          light: { base: '#FFE5DC', wcag: '#FFD4C2' },
          dark: { base: '#FFE5DC', wcag: '#FFD4C2' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      }
    }
  } as PrimitiveToken,

  orange200: {
    name: 'orange200',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Medium-light orange for warm accents and secondary CTAs',
    mathematicalRelationship: 'Systematic orange scale progression - medium-light',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { 
        value: {
          light: { base: '#FFB8A0', wcag: '#FFA380' },
          dark: { base: '#FFB8A0', wcag: '#FFA380' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      ios: { 
        value: {
          light: { base: '#FFB8A0', wcag: '#FFA380' },
          dark: { base: '#FFB8A0', wcag: '#FFA380' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      android: { 
        value: {
          light: { base: '#FFB8A0', wcag: '#FFA380' },
          dark: { base: '#FFB8A0', wcag: '#FFA380' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      }
    }
  } as PrimitiveToken,

  orange300: {
    name: 'orange300',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Bright orange for approachable error states and warm CTAs',
    mathematicalRelationship: 'Systematic orange scale progression - bright',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { 
        value: {
          light: { base: '#FF6B35', wcag: '#E65A2A' },
          dark: { base: '#FF6B35', wcag: '#E65A2A' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      ios: { 
        value: {
          light: { base: '#FF6B35', wcag: '#E65A2A' },
          dark: { base: '#FF6B35', wcag: '#E65A2A' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      android: { 
        value: {
          light: { base: '#FF6B35', wcag: '#E65A2A' },
          dark: { base: '#FF6B35', wcag: '#E65A2A' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      }
    }
  } as PrimitiveToken,

  orange400: {
    name: 'orange400',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Dark orange for error text and secondary error elements',
    mathematicalRelationship: 'Systematic orange scale progression - dark',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { 
        value: {
          light: { base: '#CC5529', wcag: '#B34621' },
          dark: { base: '#CC5529', wcag: '#B34621' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      ios: { 
        value: {
          light: { base: '#CC5529', wcag: '#B34621' },
          dark: { base: '#CC5529', wcag: '#B34621' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      android: { 
        value: {
          light: { base: '#CC5529', wcag: '#B34621' },
          dark: { base: '#CC5529', wcag: '#B34621' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      }
    }
  } as PrimitiveToken,

  orange500: {
    name: 'orange500',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Darkest orange for error text on light backgrounds',
    mathematicalRelationship: 'Systematic orange scale progression - darkest',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { 
        value: {
          light: { base: '#8F3C1D', wcag: '#6B2A14' },
          dark: { base: '#8F3C1D', wcag: '#6B2A14' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      ios: { 
        value: {
          light: { base: '#8F3C1D', wcag: '#6B2A14' },
          dark: { base: '#8F3C1D', wcag: '#6B2A14' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      android: { 
        value: {
          light: { base: '#8F3C1D', wcag: '#6B2A14' },
          dark: { base: '#8F3C1D', wcag: '#6B2A14' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      }
    }
  } as PrimitiveToken
};

/**
 * Purple scale color tokens - Primary brand and focus states
 */
export const purpleTokens = {
  purple100: {
    name: 'purple100',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Light purple for subtle brand backgrounds and highlights',
    mathematicalRelationship: 'Systematic purple scale progression - lightest',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { 
        value: {
          light: { base: '#F3E0FF', wcag: '#F5D4FF' },
          dark: { base: '#F3E0FF', wcag: '#F5D4FF' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      ios: { 
        value: {
          light: { base: '#F3E0FF', wcag: '#F5D4FF' },
          dark: { base: '#F3E0FF', wcag: '#F5D4FF' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      android: { 
        value: {
          light: { base: '#F3E0FF', wcag: '#F5D4FF' },
          dark: { base: '#F3E0FF', wcag: '#F5D4FF' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      }
    }
  } as PrimitiveToken,

  purple200: {
    name: 'purple200',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Medium-light purple for brand accents and secondary elements',
    mathematicalRelationship: 'Systematic purple scale progression - medium-light',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { 
        value: {
          light: { base: '#D98AFF', wcag: '#D580FF' },
          dark: { base: '#D98AFF', wcag: '#D580FF' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      ios: { 
        value: {
          light: { base: '#D98AFF', wcag: '#D580FF' },
          dark: { base: '#D98AFF', wcag: '#D580FF' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      android: { 
        value: {
          light: { base: '#D98AFF', wcag: '#D580FF' },
          dark: { base: '#D98AFF', wcag: '#D580FF' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      }
    }
  } as PrimitiveToken,

  purple300: {
    name: 'purple300',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Bright purple for primary brand color and focus states',
    mathematicalRelationship: 'Systematic purple scale progression - primary brand',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { 
        value: {
          light: { base: '#B026FF', wcag: '#A928E6' },
          dark: { base: '#B026FF', wcag: '#A928E6' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      ios: { 
        value: {
          light: { base: '#B026FF', wcag: '#A928E6' },
          dark: { base: '#B026FF', wcag: '#A928E6' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      android: { 
        value: {
          light: { base: '#B026FF', wcag: '#A928E6' },
          dark: { base: '#B026FF', wcag: '#A928E6' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      }
    }
  } as PrimitiveToken,

  purple400: {
    name: 'purple400',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Dark purple for brand text and secondary brand elements',
    mathematicalRelationship: 'Systematic purple scale progression - dark',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { 
        value: {
          light: { base: '#8D1ECC', wcag: '#7A1DA6' },
          dark: { base: '#8D1ECC', wcag: '#7A1DA6' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      ios: { 
        value: {
          light: { base: '#8D1ECC', wcag: '#7A1DA6' },
          dark: { base: '#8D1ECC', wcag: '#7A1DA6' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      android: { 
        value: {
          light: { base: '#8D1ECC', wcag: '#7A1DA6' },
          dark: { base: '#8D1ECC', wcag: '#7A1DA6' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      }
    }
  } as PrimitiveToken,

  purple500: {
    name: 'purple500',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Darkest purple for brand text on light backgrounds',
    mathematicalRelationship: 'Systematic purple scale progression - darkest',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { 
        value: {
          light: { base: '#63158F', wcag: '#4A1166' },
          dark: { base: '#63158F', wcag: '#4A1166' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      ios: { 
        value: {
          light: { base: '#63158F', wcag: '#4A1166' },
          dark: { base: '#63158F', wcag: '#4A1166' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      android: { 
        value: {
          light: { base: '#63158F', wcag: '#4A1166' },
          dark: { base: '#63158F', wcag: '#4A1166' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      }
    }
  } as PrimitiveToken
};

/**
 * Violet scale color tokens - Depth, hover states, and secondary elements
 */
export const violetTokens = {
  violet100: {
    name: 'violet100',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Light violet for subtle secondary backgrounds and highlights',
    mathematicalRelationship: 'Systematic violet scale progression - lightest',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { 
        value: {
          light: { base: '#E8DDF3', wcag: '#DCC8F0' },
          dark: { base: '#E8DDF3', wcag: '#DCC8F0' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      ios: { 
        value: {
          light: { base: '#E8DDF3', wcag: '#DCC8F0' },
          dark: { base: '#E8DDF3', wcag: '#DCC8F0' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      android: { 
        value: {
          light: { base: '#E8DDF3', wcag: '#DCC8F0' },
          dark: { base: '#E8DDF3', wcag: '#DCC8F0' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      }
    }
  } as PrimitiveToken,

  violet200: {
    name: 'violet200',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Medium-light violet for secondary brand elements and depth',
    mathematicalRelationship: 'Systematic violet scale progression - medium-light',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { 
        value: {
          light: { base: '#9A6BC2', wcag: '#A87DD9' },
          dark: { base: '#9A6BC2', wcag: '#A87DD9' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      ios: { 
        value: {
          light: { base: '#9A6BC2', wcag: '#A87DD9' },
          dark: { base: '#9A6BC2', wcag: '#A87DD9' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      android: { 
        value: {
          light: { base: '#9A6BC2', wcag: '#A87DD9' },
          dark: { base: '#9A6BC2', wcag: '#A87DD9' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      }
    }
  } as PrimitiveToken,

  violet300: {
    name: 'violet300',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Medium violet for secondary brand color and hover states',
    mathematicalRelationship: 'Systematic violet scale progression - secondary brand',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { 
        value: {
          light: { base: '#5B2C91', wcag: '#7A48B3' },
          dark: { base: '#5B2C91', wcag: '#7A48B3' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      ios: { 
        value: {
          light: { base: '#5B2C91', wcag: '#7A48B3' },
          dark: { base: '#5B2C91', wcag: '#7A48B3' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      android: { 
        value: {
          light: { base: '#5B2C91', wcag: '#7A48B3' },
          dark: { base: '#5B2C91', wcag: '#7A48B3' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      }
    }
  } as PrimitiveToken,

  violet400: {
    name: 'violet400',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Dark violet for secondary text and depth elements',
    mathematicalRelationship: 'Systematic violet scale progression - dark',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { 
        value: {
          light: { base: '#482374', wcag: '#5A3380' },
          dark: { base: '#482374', wcag: '#5A3380' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      ios: { 
        value: {
          light: { base: '#482374', wcag: '#5A3380' },
          dark: { base: '#482374', wcag: '#5A3380' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      android: { 
        value: {
          light: { base: '#482374', wcag: '#5A3380' },
          dark: { base: '#482374', wcag: '#5A3380' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      }
    }
  } as PrimitiveToken,

  violet500: {
    name: 'violet500',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Darkest violet for secondary text on light backgrounds',
    mathematicalRelationship: 'Systematic violet scale progression - darkest',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { 
        value: {
          light: { base: '#331951', wcag: '#3A2159' },
          dark: { base: '#331951', wcag: '#3A2159' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      ios: { 
        value: {
          light: { base: '#331951', wcag: '#3A2159' },
          dark: { base: '#331951', wcag: '#3A2159' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      android: { 
        value: {
          light: { base: '#331951', wcag: '#3A2159' },
          dark: { base: '#331951', wcag: '#3A2159' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      }
    }
  } as PrimitiveToken
};

/**
 * Cyan scale color tokens - Tech elements, links, and success states
 */
export const cyanTokens = {
  cyan100: {
    name: 'cyan100',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Light cyan for subtle tech backgrounds and success highlights',
    mathematicalRelationship: 'Systematic cyan scale progression - lightest',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { 
        value: {
          light: { base: '#CCFBFF', wcag: '#B3F5FF' },
          dark: { base: '#CCFBFF', wcag: '#B3F5FF' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      ios: { 
        value: {
          light: { base: '#CCFBFF', wcag: '#B3F5FF' },
          dark: { base: '#CCFBFF', wcag: '#B3F5FF' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      android: { 
        value: {
          light: { base: '#CCFBFF', wcag: '#B3F5FF' },
          dark: { base: '#CCFBFF', wcag: '#B3F5FF' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      }
    }
  } as PrimitiveToken,

  cyan200: {
    name: 'cyan200',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Medium-light cyan for tech accents and link highlights',
    mathematicalRelationship: 'Systematic cyan scale progression - medium-light',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { 
        value: {
          light: { base: '#80F6FF', wcag: '#66E5F5' },
          dark: { base: '#80F6FF', wcag: '#66E5F5' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      ios: { 
        value: {
          light: { base: '#80F6FF', wcag: '#66E5F5' },
          dark: { base: '#80F6FF', wcag: '#66E5F5' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      android: { 
        value: {
          light: { base: '#80F6FF', wcag: '#66E5F5' },
          dark: { base: '#80F6FF', wcag: '#66E5F5' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      }
    }
  } as PrimitiveToken,

  cyan300: {
    name: 'cyan300',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Bright cyan for tech elements, links, and success states',
    mathematicalRelationship: 'Systematic cyan scale progression - tech primary',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { 
        value: {
          light: { base: '#00F0FF', wcag: '#00C5D9' },
          dark: { base: '#00F0FF', wcag: '#00C5D9' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      ios: { 
        value: {
          light: { base: '#00F0FF', wcag: '#00C5D9' },
          dark: { base: '#00F0FF', wcag: '#00C5D9' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      android: { 
        value: {
          light: { base: '#00F0FF', wcag: '#00C5D9' },
          dark: { base: '#00F0FF', wcag: '#00C5D9' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      }
    }
  } as PrimitiveToken,

  cyan400: {
    name: 'cyan400',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Dark cyan for tech text and secondary success elements',
    mathematicalRelationship: 'Systematic cyan scale progression - dark',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { 
        value: {
          light: { base: '#00C0CC', wcag: '#008C99' },
          dark: { base: '#00C0CC', wcag: '#008C99' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      ios: { 
        value: {
          light: { base: '#00C0CC', wcag: '#008C99' },
          dark: { base: '#00C0CC', wcag: '#008C99' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      android: { 
        value: {
          light: { base: '#00C0CC', wcag: '#008C99' },
          dark: { base: '#00C0CC', wcag: '#008C99' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      }
    }
  } as PrimitiveToken,

  cyan500: {
    name: 'cyan500',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Darkest cyan for tech text on light backgrounds',
    mathematicalRelationship: 'Systematic cyan scale progression - darkest',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { 
        value: {
          light: { base: '#00888F', wcag: '#005259' },
          dark: { base: '#00888F', wcag: '#005259' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      ios: { 
        value: {
          light: { base: '#00888F', wcag: '#005259' },
          dark: { base: '#00888F', wcag: '#005259' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      android: { 
        value: {
          light: { base: '#00888F', wcag: '#005259' },
          dark: { base: '#00888F', wcag: '#005259' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      }
    }
  } as PrimitiveToken
};

/**
 * Teal scale color tokens - Secondary UI elements and alternative success states
 */
export const tealTokens = {
  teal100: {
    name: 'teal100',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Light teal for subtle secondary backgrounds and highlights',
    mathematicalRelationship: 'Systematic teal scale progression - lightest',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { 
        value: {
          light: { base: '#D9E8EA', wcag: '#B3D9E0' },
          dark: { base: '#D9E8EA', wcag: '#B3D9E0' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      ios: { 
        value: {
          light: { base: '#D9E8EA', wcag: '#B3D9E0' },
          dark: { base: '#D9E8EA', wcag: '#B3D9E0' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      android: { 
        value: {
          light: { base: '#D9E8EA', wcag: '#B3D9E0' },
          dark: { base: '#D9E8EA', wcag: '#B3D9E0' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      }
    }
  } as PrimitiveToken,

  teal200: {
    name: 'teal200',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Medium-light teal for secondary UI elements and accents',
    mathematicalRelationship: 'Systematic teal scale progression - medium-light',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { 
        value: {
          light: { base: '#4D9BA5', wcag: '#66A6B3' },
          dark: { base: '#4D9BA5', wcag: '#66A6B3' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      ios: { 
        value: {
          light: { base: '#4D9BA5', wcag: '#66A6B3' },
          dark: { base: '#4D9BA5', wcag: '#66A6B3' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      android: { 
        value: {
          light: { base: '#4D9BA5', wcag: '#66A6B3' },
          dark: { base: '#4D9BA5', wcag: '#66A6B3' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      }
    }
  } as PrimitiveToken,

  teal300: {
    name: 'teal300',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Medium teal for secondary UI elements and alternative success states',
    mathematicalRelationship: 'Systematic teal scale progression - secondary UI',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { 
        value: {
          light: { base: '#1A535C', wcag: '#2D7380' },
          dark: { base: '#1A535C', wcag: '#2D7380' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      ios: { 
        value: {
          light: { base: '#1A535C', wcag: '#2D7380' },
          dark: { base: '#1A535C', wcag: '#2D7380' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      android: { 
        value: {
          light: { base: '#1A535C', wcag: '#2D7380' },
          dark: { base: '#1A535C', wcag: '#2D7380' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      }
    }
  } as PrimitiveToken,

  teal400: {
    name: 'teal400',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Dark teal for secondary text and UI elements',
    mathematicalRelationship: 'Systematic teal scale progression - dark',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { 
        value: {
          light: { base: '#15424A', wcag: '#1F5159' },
          dark: { base: '#15424A', wcag: '#1F5159' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      ios: { 
        value: {
          light: { base: '#15424A', wcag: '#1F5159' },
          dark: { base: '#15424A', wcag: '#1F5159' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      android: { 
        value: {
          light: { base: '#15424A', wcag: '#1F5159' },
          dark: { base: '#15424A', wcag: '#1F5159' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      }
    }
  } as PrimitiveToken,

  teal500: {
    name: 'teal500',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Darkest teal for secondary text on light backgrounds',
    mathematicalRelationship: 'Systematic teal scale progression - darkest',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { 
        value: {
          light: { base: '#0F2E33', wcag: '#143740' },
          dark: { base: '#0F2E33', wcag: '#143740' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      ios: { 
        value: {
          light: { base: '#0F2E33', wcag: '#143740' },
          dark: { base: '#0F2E33', wcag: '#143740' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      },
      android: { 
        value: {
          light: { base: '#0F2E33', wcag: '#143740' },
          dark: { base: '#0F2E33', wcag: '#143740' }
        } as ColorTokenValue, 
        unit: 'hex' as const 
      }
    }
  } as PrimitiveToken
};

/**
 * Combined color tokens object containing all color families
 */
export const colorTokens = {
  ...grayTokens,
  ...blackTokens,
  ...whiteTokens,
  ...yellowTokens,
  ...orangeTokens,
  ...purpleTokens,
  ...violetTokens,
  ...cyanTokens,
  ...tealTokens
};

/**
 * Color token names for easy reference
 */
export const colorTokenNames = Object.keys(colorTokens) as Array<keyof typeof colorTokens>;

/**
 * Get a specific color token by name
 */
export function getColorToken(name: keyof typeof colorTokens): PrimitiveToken {
  const token = colorTokens[name];
  if (!token) {
    throw new Error(`Color token "${name}" not found`);
  }
  return token;
}

/**
 * Get all color tokens as an array
 */
export function getAllColorTokens(): PrimitiveToken[] {
  return Object.values(colorTokens);
}

/**
 * Get color tokens by family (gray, black, white, etc.)
 */
export function getColorTokensByFamily(family: 'gray' | 'black' | 'white' | 'yellow' | 'orange' | 'purple' | 'violet' | 'cyan' | 'teal'): PrimitiveToken[] {
  return Object.values(colorTokens).filter(token => token.name.startsWith(family));
}

/**
 * Get systematic color families for reference
 */
export const COLOR_FAMILIES = {
  GRAY: 'gray',
  BLACK: 'black', 
  WHITE: 'white',
  YELLOW: 'yellow',
  ORANGE: 'orange',
  PURPLE: 'purple',
  VIOLET: 'violet',
  CYAN: 'cyan',
  TEAL: 'teal'
} as const;

/**
 * Color progression scale for reference
 */
export const COLOR_SCALE = [100, 200, 300, 400, 500] as const;

/**
 * Mode and theme options for color resolution
 */
export const COLOR_MODES = ['light', 'dark'] as const;
export const COLOR_THEMES = ['base', 'wcag'] as const;

/**
 * Resolve color token value for specific mode and theme
 */
export function resolveColorTokenValue(
  token: PrimitiveToken, 
  mode: 'light' | 'dark' = 'light', 
  theme: 'base' | 'wcag' = 'base'
): string {
  if (token.category !== TokenCategory.COLOR) {
    throw new Error(`Token "${token.name}" is not a color token`);
  }
  
  const colorValue = token.platforms.web.value as ColorTokenValue;
  return colorValue[mode][theme];
}