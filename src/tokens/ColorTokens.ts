/**
 * Color Primitive Tokens
 * 
 * Implements mode-aware and theme-aware color primitive tokens with systematic color families.
 * Each color token supports light/dark modes with base/wcag themes for comprehensive
 * accessibility and aesthetic flexibility.
 * 
 * Color families: gray, black, white, yellow, orange, purple, green, pink, cyan, teal
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
          light: { base: '#B8B6C8', wcag: '#B8B6C8' },
          dark: { base: '#B8B6C8', wcag: '#B8B6C8' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      ios: {
        value: {
          light: { base: '#B8B6C8', wcag: '#B8B6C8' },
          dark: { base: '#B8B6C8', wcag: '#B8B6C8' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      android: {
        value: {
          light: { base: '#B8B6C8', wcag: '#B8B6C8' },
          dark: { base: '#B8B6C8', wcag: '#B8B6C8' }
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
          light: { base: '#68658A', wcag: '#68658A' },
          dark: { base: '#68658A', wcag: '#68658A' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      ios: {
        value: {
          light: { base: '#68658A', wcag: '#68658A' },
          dark: { base: '#68658A', wcag: '#68658A' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      android: {
        value: {
          light: { base: '#68658A', wcag: '#68658A' },
          dark: { base: '#68658A', wcag: '#68658A' }
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
          light: { base: '#2D2B3E', wcag: '#2D2B3E' },
          dark: { base: '#2D2B3E', wcag: '#2D2B3E' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      ios: {
        value: {
          light: { base: '#2D2B3E', wcag: '#2D2B3E' },
          dark: { base: '#2D2B3E', wcag: '#2D2B3E' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      android: {
        value: {
          light: { base: '#2D2B3E', wcag: '#2D2B3E' },
          dark: { base: '#2D2B3E', wcag: '#2D2B3E' }
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
          light: { base: '#1F1D2E', wcag: '#1F1D2E' },
          dark: { base: '#1F1D2E', wcag: '#1F1D2E' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      ios: {
        value: {
          light: { base: '#1F1D2E', wcag: '#1F1D2E' },
          dark: { base: '#1F1D2E', wcag: '#1F1D2E' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      android: {
        value: {
          light: { base: '#1F1D2E', wcag: '#1F1D2E' },
          dark: { base: '#1F1D2E', wcag: '#1F1D2E' }
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
          light: { base: '#15131F', wcag: '#15131F' },
          dark: { base: '#15131F', wcag: '#15131F' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      ios: {
        value: {
          light: { base: '#15131F', wcag: '#15131F' },
          dark: { base: '#15131F', wcag: '#15131F' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      android: {
        value: {
          light: { base: '#15131F', wcag: '#15131F' },
          dark: { base: '#15131F', wcag: '#15131F' }
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
          light: { base: '#F5F5FA', wcag: '#F5F5FA' },
          dark: { base: '#F5F5FA', wcag: '#F5F5FA' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      ios: {
        value: {
          light: { base: '#F5F5FA', wcag: '#F5F5FA' },
          dark: { base: '#F5F5FA', wcag: '#F5F5FA' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      android: {
        value: {
          light: { base: '#F5F5FA', wcag: '#F5F5FA' },
          dark: { base: '#F5F5FA', wcag: '#F5F5FA' }
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
          light: { base: '#E8E8F0', wcag: '#E8E8F0' },
          dark: { base: '#E8E8F0', wcag: '#E8E8F0' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      ios: {
        value: {
          light: { base: '#E8E8F0', wcag: '#E8E8F0' },
          dark: { base: '#E8E8F0', wcag: '#E8E8F0' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      android: {
        value: {
          light: { base: '#E8E8F0', wcag: '#E8E8F0' },
          dark: { base: '#E8E8F0', wcag: '#E8E8F0' }
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
          light: { base: '#C5C5D5', wcag: '#C5C5D5' },
          dark: { base: '#C5C5D5', wcag: '#C5C5D5' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      ios: {
        value: {
          light: { base: '#C5C5D5', wcag: '#C5C5D5' },
          dark: { base: '#C5C5D5', wcag: '#C5C5D5' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      android: {
        value: {
          light: { base: '#C5C5D5', wcag: '#C5C5D5' },
          dark: { base: '#C5C5D5', wcag: '#C5C5D5' }
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
          light: { base: '#9999AB', wcag: '#9999AB' },
          dark: { base: '#9999AB', wcag: '#9999AB' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      ios: {
        value: {
          light: { base: '#9999AB', wcag: '#9999AB' },
          dark: { base: '#9999AB', wcag: '#9999AB' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      android: {
        value: {
          light: { base: '#9999AB', wcag: '#9999AB' },
          dark: { base: '#9999AB', wcag: '#9999AB' }
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
          light: { base: '#FEFBCC', wcag: '#FEFBCC' },
          dark: { base: '#FEFBCC', wcag: '#FCF680' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      ios: {
        value: {
          light: { base: '#FEFBCC', wcag: '#FEFBCC' },
          dark: { base: '#FEFBCC', wcag: '#FCF680' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      android: {
        value: {
          light: { base: '#FEFBCC', wcag: '#FEFBCC' },
          dark: { base: '#FEFBCC', wcag: '#FCF680' }
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
          light: { base: '#FCF680', wcag: '#FCF680' },
          dark: { base: '#FCF680', wcag: '#F9F002' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      ios: {
        value: {
          light: { base: '#FCF680', wcag: '#FCF680' },
          dark: { base: '#FCF680', wcag: '#F9F002' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      android: {
        value: {
          light: { base: '#FCF680', wcag: '#FCF680' },
          dark: { base: '#FCF680', wcag: '#F9F002' }
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
          light: { base: '#F9F002', wcag: '#F9F002' },
          dark: { base: '#F9F002', wcag: '#C7C002' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      ios: {
        value: {
          light: { base: '#F9F002', wcag: '#F9F002' },
          dark: { base: '#F9F002', wcag: '#C7C002' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      android: {
        value: {
          light: { base: '#F9F002', wcag: '#F9F002' },
          dark: { base: '#F9F002', wcag: '#C7C002' }
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
          light: { base: '#C7C002', wcag: '#C7C002' },
          dark: { base: '#C7C002', wcag: '#8F8B01' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      ios: {
        value: {
          light: { base: '#C7C002', wcag: '#C7C002' },
          dark: { base: '#C7C002', wcag: '#8F8B01' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      android: {
        value: {
          light: { base: '#C7C002', wcag: '#C7C002' },
          dark: { base: '#C7C002', wcag: '#8F8B01' }
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
          light: { base: '#8F8B01', wcag: '#8F8B01' },
          dark: { base: '#8F8B01', wcag: '#8F8B01' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      ios: {
        value: {
          light: { base: '#8F8B01', wcag: '#8F8B01' },
          dark: { base: '#8F8B01', wcag: '#8F8B01' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      android: {
        value: {
          light: { base: '#8F8B01', wcag: '#8F8B01' },
          dark: { base: '#8F8B01', wcag: '#8F8B01' }
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
          light: { base: '#FFE5DC', wcag: '#FFF3E0' },
          dark: { base: '#FFE5DC', wcag: '#FFD9A3' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      ios: {
        value: {
          light: { base: '#FFE5DC', wcag: '#FFF3E0' },
          dark: { base: '#FFE5DC', wcag: '#FFD9A3' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      android: {
        value: {
          light: { base: '#FFE5DC', wcag: '#FFF3E0' },
          dark: { base: '#FFE5DC', wcag: '#FFD9A3' }
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
    description: 'Medium-light orange for warm accents and secondary CTAs (Cyberpunk WCAG - AA Large ~3:1 for headings)',
    mathematicalRelationship: 'Systematic orange scale progression - medium-light',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: {
        value: {
          light: { base: '#FFB8A0', wcag: '#F59E00' },
          dark: { base: '#FFB8A0', wcag: '#FFB84D' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      ios: {
        value: {
          light: { base: '#FFB8A0', wcag: '#F59E00' },
          dark: { base: '#FFB8A0', wcag: '#FFB84D' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      android: {
        value: {
          light: { base: '#FFB8A0', wcag: '#F59E00' },
          dark: { base: '#FFB8A0', wcag: '#FFB84D' }
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
    description: 'Bright orange for approachable error states and warm CTAs (Cyberpunk WCAG - AA ~4.5:1 for body text)',
    mathematicalRelationship: 'Systematic orange scale progression - bright',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: {
        value: {
          light: { base: '#FF6B35', wcag: '#B87500' },
          dark: { base: '#FF6B35', wcag: '#D99500' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      ios: {
        value: {
          light: { base: '#FF6B35', wcag: '#B87500' },
          dark: { base: '#FF6B35', wcag: '#D99500' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      android: {
        value: {
          light: { base: '#FF6B35', wcag: '#B87500' },
          dark: { base: '#FF6B35', wcag: '#D99500' }
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
          light: { base: '#CC5529', wcag: '#8C5A00' },
          dark: { base: '#CC5529', wcag: '#A67000' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      ios: {
        value: {
          light: { base: '#CC5529', wcag: '#8C5A00' },
          dark: { base: '#CC5529', wcag: '#A67000' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      android: {
        value: {
          light: { base: '#CC5529', wcag: '#8C5A00' },
          dark: { base: '#CC5529', wcag: '#A67000' }
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
          light: { base: '#8F3C1D', wcag: '#4D3100' },
          dark: { base: '#8F3C1D', wcag: '#5C3D00' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      ios: {
        value: {
          light: { base: '#8F3C1D', wcag: '#4D3100' },
          dark: { base: '#8F3C1D', wcag: '#5C3D00' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      android: {
        value: {
          light: { base: '#8F3C1D', wcag: '#4D3100' },
          dark: { base: '#8F3C1D', wcag: '#5C3D00' }
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
          light: { base: '#F3E0FF', wcag: '#F3E0FF' },
          dark: { base: '#F3E0FF', wcag: '#F3E0FF' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      ios: {
        value: {
          light: { base: '#F3E0FF', wcag: '#F3E0FF' },
          dark: { base: '#F3E0FF', wcag: '#F3E0FF' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      android: {
        value: {
          light: { base: '#F3E0FF', wcag: '#F3E0FF' },
          dark: { base: '#F3E0FF', wcag: '#F3E0FF' }
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
          light: { base: '#D98AFF', wcag: '#D98AFF' },
          dark: { base: '#D98AFF', wcag: '#D98AFF' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      ios: {
        value: {
          light: { base: '#D98AFF', wcag: '#D98AFF' },
          dark: { base: '#D98AFF', wcag: '#D98AFF' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      android: {
        value: {
          light: { base: '#D98AFF', wcag: '#D98AFF' },
          dark: { base: '#D98AFF', wcag: '#D98AFF' }
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
          light: { base: '#B026FF', wcag: '#B026FF' },
          dark: { base: '#B026FF', wcag: '#B026FF' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      ios: {
        value: {
          light: { base: '#B026FF', wcag: '#B026FF' },
          dark: { base: '#B026FF', wcag: '#B026FF' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      android: {
        value: {
          light: { base: '#B026FF', wcag: '#B026FF' },
          dark: { base: '#B026FF', wcag: '#B026FF' }
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
          light: { base: '#8D1ECC', wcag: '#8D1ECC' },
          dark: { base: '#8D1ECC', wcag: '#8D1ECC' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      ios: {
        value: {
          light: { base: '#8D1ECC', wcag: '#8D1ECC' },
          dark: { base: '#8D1ECC', wcag: '#8D1ECC' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      android: {
        value: {
          light: { base: '#8D1ECC', wcag: '#8D1ECC' },
          dark: { base: '#8D1ECC', wcag: '#8D1ECC' }
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
          light: { base: '#63158F', wcag: '#63158F' },
          dark: { base: '#63158F', wcag: '#63158F' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      ios: {
        value: {
          light: { base: '#63158F', wcag: '#63158F' },
          dark: { base: '#63158F', wcag: '#63158F' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      android: {
        value: {
          light: { base: '#63158F', wcag: '#63158F' },
          dark: { base: '#63158F', wcag: '#63158F' }
        } as ColorTokenValue,
        unit: 'hex' as const
      }
    }
  } as PrimitiveToken
};

/**
 * Pink scale color tokens - Error states and urgent feedback
 */
export const pinkTokens = {
  pink100: {
    name: 'pink100',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Lightest hot pink - subtle error backgrounds',
    mathematicalRelationship: 'Systematic pink scale progression - lightest',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: {
        value: {
          light: { base: '#FFDAE8', wcag: '#FCE4EC' },
          dark: { base: '#FFDAE8', wcag: '#FFB3D1' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      ios: {
        value: {
          light: { base: '#FFDAE8', wcag: '#FCE4EC' },
          dark: { base: '#FFDAE8', wcag: '#FFB3D1' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      android: {
        value: {
          light: { base: '#FFDAE8', wcag: '#FCE4EC' },
          dark: { base: '#FFDAE8', wcag: '#FFB3D1' }
        } as ColorTokenValue,
        unit: 'hex' as const
      }
    }
  } as PrimitiveToken,

  pink200: {
    name: 'pink200',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Medium-light hot pink - error highlights (Cyberpunk WCAG - AA Large ~3:1 for headings)',
    mathematicalRelationship: 'Systematic pink scale progression - medium-light',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: {
        value: {
          light: { base: '#FF82B4', wcag: '#E91E63' },
          dark: { base: '#FF82B4', wcag: '#FF6BA3' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      ios: {
        value: {
          light: { base: '#FF82B4', wcag: '#E91E63' },
          dark: { base: '#FF82B4', wcag: '#FF6BA3' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      android: {
        value: {
          light: { base: '#FF82B4', wcag: '#E91E63' },
          dark: { base: '#FF82B4', wcag: '#FF6BA3' }
        } as ColorTokenValue,
        unit: 'hex' as const
      }
    }
  } as PrimitiveToken,

  pink300: {
    name: 'pink300',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Bright hot pink - base pink color (Cyberpunk WCAG - AA ~4.5:1 for body text)',
    mathematicalRelationship: 'Systematic pink scale progression - base',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: {
        value: {
          light: { base: '#FF2A6D', wcag: '#C2185B' },
          dark: { base: '#FF2A6D', wcag: '#E63075' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      ios: {
        value: {
          light: { base: '#FF2A6D', wcag: '#C2185B' },
          dark: { base: '#FF2A6D', wcag: '#E63075' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      android: {
        value: {
          light: { base: '#FF2A6D', wcag: '#C2185B' },
          dark: { base: '#FF2A6D', wcag: '#E63075' }
        } as ColorTokenValue,
        unit: 'hex' as const
      }
    }
  } as PrimitiveToken,

  pink400: {
    name: 'pink400',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Dark hot pink - primary error color',
    mathematicalRelationship: 'Systematic pink scale progression - dark',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: {
        value: {
          light: { base: '#CC2257', wcag: '#880E4F' },
          dark: { base: '#CC2257', wcag: '#B32659' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      ios: {
        value: {
          light: { base: '#CC2257', wcag: '#880E4F' },
          dark: { base: '#CC2257', wcag: '#B32659' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      android: {
        value: {
          light: { base: '#CC2257', wcag: '#880E4F' },
          dark: { base: '#CC2257', wcag: '#B32659' }
        } as ColorTokenValue,
        unit: 'hex' as const
      }
    }
  } as PrimitiveToken,

  pink500: {
    name: 'pink500',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Darkest hot pink - strong error color',
    mathematicalRelationship: 'Systematic pink scale progression - darkest',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: {
        value: {
          light: { base: '#801537', wcag: '#4D0829' },
          dark: { base: '#801537', wcag: '#5C1A33' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      ios: {
        value: {
          light: { base: '#801537', wcag: '#4D0829' },
          dark: { base: '#801537', wcag: '#5C1A33' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      android: {
        value: {
          light: { base: '#801537', wcag: '#4D0829' },
          dark: { base: '#801537', wcag: '#5C1A33' }
        } as ColorTokenValue,
        unit: 'hex' as const
      }
    }
  } as PrimitiveToken
};

/**
 * Green scale color tokens - Success states and positive feedback
 */
export const greenTokens = {
  green100: {
    name: 'green100',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Lightest electric green - subtle success backgrounds',
    mathematicalRelationship: 'Systematic green scale progression - lightest',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: {
        value: {
          light: { base: '#E6FFF5', wcag: '#E8F5E9' },
          dark: { base: '#E6FFF5', wcag: '#B3FFB3' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      ios: {
        value: {
          light: { base: '#E6FFF5', wcag: '#E8F5E9' },
          dark: { base: '#E6FFF5', wcag: '#B3FFB3' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      android: {
        value: {
          light: { base: '#E6FFF5', wcag: '#E8F5E9' },
          dark: { base: '#E6FFF5', wcag: '#B3FFB3' }
        } as ColorTokenValue,
        unit: 'hex' as const
      }
    }
  } as PrimitiveToken,

  green200: {
    name: 'green200',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Medium-light electric green - success highlights (Cyberpunk WCAG - AA Large ~3:1 for headings)',
    mathematicalRelationship: 'Systematic green scale progression - medium-light',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: {
        value: {
          light: { base: '#80FFBB', wcag: '#4CAF50' },
          dark: { base: '#80FFBB', wcag: '#66FF66' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      ios: {
        value: {
          light: { base: '#80FFBB', wcag: '#4CAF50' },
          dark: { base: '#80FFBB', wcag: '#66FF66' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      android: {
        value: {
          light: { base: '#80FFBB', wcag: '#4CAF50' },
          dark: { base: '#80FFBB', wcag: '#66FF66' }
        } as ColorTokenValue,
        unit: 'hex' as const
      }
    }
  } as PrimitiveToken,

  green300: {
    name: 'green300',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Bright electric green - success accents (Cyberpunk WCAG - AA ~4.5:1 for body text)',
    mathematicalRelationship: 'Systematic green scale progression - bright',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: {
        value: {
          light: { base: '#33FF99', wcag: '#388E3C' },
          dark: { base: '#33FF99', wcag: '#33E033' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      ios: {
        value: {
          light: { base: '#33FF99', wcag: '#388E3C' },
          dark: { base: '#33FF99', wcag: '#33E033' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      android: {
        value: {
          light: { base: '#33FF99', wcag: '#388E3C' },
          dark: { base: '#33FF99', wcag: '#33E033' }
        } as ColorTokenValue,
        unit: 'hex' as const
      }
    }
  } as PrimitiveToken,

  green400: {
    name: 'green400',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Strong electric green - primary success color',
    mathematicalRelationship: 'Systematic green scale progression - strong',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: {
        value: {
          light: { base: '#00FF88', wcag: '#1B5E20' },
          dark: { base: '#00FF88', wcag: '#26B326' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      ios: {
        value: {
          light: { base: '#00FF88', wcag: '#1B5E20' },
          dark: { base: '#00FF88', wcag: '#26B326' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      android: {
        value: {
          light: { base: '#00FF88', wcag: '#1B5E20' },
          dark: { base: '#00FF88', wcag: '#26B326' }
        } as ColorTokenValue,
        unit: 'hex' as const
      }
    }
  } as PrimitiveToken,

  green500: {
    name: 'green500',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Darkest electric green - neon glow effect',
    mathematicalRelationship: 'Systematic green scale progression - darkest/glow',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: {
        value: {
          light: { base: '#00CC6E', wcag: '#0D3010' },
          dark: { base: '#00CC6E', wcag: '#145914' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      ios: {
        value: {
          light: { base: '#00CC6E', wcag: '#0D3010' },
          dark: { base: '#00CC6E', wcag: '#145914' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      android: {
        value: {
          light: { base: '#00CC6E', wcag: '#0D3010' },
          dark: { base: '#00CC6E', wcag: '#145914' }
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
          light: { base: '#CCFBFF', wcag: '#CCFBFF' },
          dark: { base: '#CCFBFF', wcag: '#CCFBFF' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      ios: {
        value: {
          light: { base: '#CCFBFF', wcag: '#CCFBFF' },
          dark: { base: '#CCFBFF', wcag: '#CCFBFF' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      android: {
        value: {
          light: { base: '#CCFBFF', wcag: '#CCFBFF' },
          dark: { base: '#CCFBFF', wcag: '#CCFBFF' }
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
          light: { base: '#80F6FF', wcag: '#80F6FF' },
          dark: { base: '#80F6FF', wcag: '#80F6FF' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      ios: {
        value: {
          light: { base: '#80F6FF', wcag: '#80F6FF' },
          dark: { base: '#80F6FF', wcag: '#80F6FF' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      android: {
        value: {
          light: { base: '#80F6FF', wcag: '#80F6FF' },
          dark: { base: '#80F6FF', wcag: '#80F6FF' }
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
          light: { base: '#00F0FF', wcag: '#00F0FF' },
          dark: { base: '#00F0FF', wcag: '#00F0FF' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      ios: {
        value: {
          light: { base: '#00F0FF', wcag: '#00F0FF' },
          dark: { base: '#00F0FF', wcag: '#00F0FF' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      android: {
        value: {
          light: { base: '#00F0FF', wcag: '#00F0FF' },
          dark: { base: '#00F0FF', wcag: '#00F0FF' }
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
          light: { base: '#00C0CC', wcag: '#00C0CC' },
          dark: { base: '#00C0CC', wcag: '#00C0CC' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      ios: {
        value: {
          light: { base: '#00C0CC', wcag: '#00C0CC' },
          dark: { base: '#00C0CC', wcag: '#00C0CC' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      android: {
        value: {
          light: { base: '#00C0CC', wcag: '#00C0CC' },
          dark: { base: '#00C0CC', wcag: '#00C0CC' }
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
          light: { base: '#00888F', wcag: '#00888F' },
          dark: { base: '#00888F', wcag: '#00888F' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      ios: {
        value: {
          light: { base: '#00888F', wcag: '#00888F' },
          dark: { base: '#00888F', wcag: '#00888F' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      android: {
        value: {
          light: { base: '#00888F', wcag: '#00888F' },
          dark: { base: '#00888F', wcag: '#00888F' }
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
          light: { base: '#D9E8EA', wcag: '#D9E8EA' },
          dark: { base: '#D9E8EA', wcag: '#D9E8EA' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      ios: {
        value: {
          light: { base: '#D9E8EA', wcag: '#D9E8EA' },
          dark: { base: '#D9E8EA', wcag: '#D9E8EA' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      android: {
        value: {
          light: { base: '#D9E8EA', wcag: '#D9E8EA' },
          dark: { base: '#D9E8EA', wcag: '#D9E8EA' }
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
          light: { base: '#4D9BA5', wcag: '#4D9BA5' },
          dark: { base: '#4D9BA5', wcag: '#4D9BA5' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      ios: {
        value: {
          light: { base: '#4D9BA5', wcag: '#4D9BA5' },
          dark: { base: '#4D9BA5', wcag: '#4D9BA5' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      android: {
        value: {
          light: { base: '#4D9BA5', wcag: '#4D9BA5' },
          dark: { base: '#4D9BA5', wcag: '#4D9BA5' }
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
          light: { base: '#1A535C', wcag: '#1A535C' },
          dark: { base: '#1A535C', wcag: '#00F0FF' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      ios: {
        value: {
          light: { base: '#1A535C', wcag: '#1A535C' },
          dark: { base: '#1A535C', wcag: '#00F0FF' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      android: {
        value: {
          light: { base: '#1A535C', wcag: '#1A535C' },
          dark: { base: '#1A535C', wcag: '#00F0FF' }
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
          light: { base: '#15424A', wcag: '#15424A' },
          dark: { base: '#15424A', wcag: '#15424A' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      ios: {
        value: {
          light: { base: '#15424A', wcag: '#15424A' },
          dark: { base: '#15424A', wcag: '#15424A' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      android: {
        value: {
          light: { base: '#15424A', wcag: '#15424A' },
          dark: { base: '#15424A', wcag: '#15424A' }
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
          light: { base: '#0F2E33', wcag: '#0F2E33' },
          dark: { base: '#0F2E33', wcag: '#0F2E33' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      ios: {
        value: {
          light: { base: '#0F2E33', wcag: '#0F2E33' },
          dark: { base: '#0F2E33', wcag: '#0F2E33' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      android: {
        value: {
          light: { base: '#0F2E33', wcag: '#0F2E33' },
          dark: { base: '#0F2E33', wcag: '#0F2E33' }
        } as ColorTokenValue,
        unit: 'hex' as const
      }
    }
  } as PrimitiveToken
};

/**
 * Shadow color family - Systematic shadow colors following color family pattern
 * 
 * Shadow colors are tinted by ambient light (art theory: warm light creates cool shadows, 
 * cool light creates warm shadows). Shadow colors are mode-agnostic (always dark) regardless 
 * of light/dark theme mode.
 * 
 * Color families: shadowBlack (neutral), shadowBlue (warm light/cool shadows), 
 * shadowOrange (cool light/warm shadows), shadowGray (ambient/overcast)
 */
export const shadowColorTokens = {
  shadowBlack100: {
    name: 'shadowBlack100',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Shadow black 100 - pure black for neutral lighting (noon)',
    mathematicalRelationship: 'Systematic shadow color family - pure black (0, 0, 0) - mode-agnostic',
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
  } as PrimitiveToken,

  shadowBlue100: {
    name: 'shadowBlue100',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Shadow blue 100 - cool blue-gray tint (warm light creates cool shadows)',
    mathematicalRelationship: 'Systematic shadow color family - blue-tinted gray for sunrise/sunset lighting - mode-agnostic',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: {
        value: {
          light: { base: '#141928', wcag: '#141928' },
          dark: { base: '#141928', wcag: '#141928' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      ios: {
        value: {
          light: { base: '#141928', wcag: '#141928' },
          dark: { base: '#141928', wcag: '#141928' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      android: {
        value: {
          light: { base: '#141928', wcag: '#141928' },
          dark: { base: '#141928', wcag: '#141928' }
        } as ColorTokenValue,
        unit: 'hex' as const
      }
    }
  } as PrimitiveToken,

  shadowOrange100: {
    name: 'shadowOrange100',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Shadow orange 100 - warm gray tint (cool light creates warm shadows)',
    mathematicalRelationship: 'Systematic shadow color family - warm-tinted gray for cool lighting environments - mode-agnostic',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: {
        value: {
          light: { base: '#19140F', wcag: '#19140F' },
          dark: { base: '#19140F', wcag: '#19140F' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      ios: {
        value: {
          light: { base: '#19140F', wcag: '#19140F' },
          dark: { base: '#19140F', wcag: '#19140F' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      android: {
        value: {
          light: { base: '#19140F', wcag: '#19140F' },
          dark: { base: '#19140F', wcag: '#19140F' }
        } as ColorTokenValue,
        unit: 'hex' as const
      }
    }
  } as PrimitiveToken,

  shadowGray100: {
    name: 'shadowGray100',
    category: TokenCategory.COLOR,
    baseValue: 0,
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Shadow gray 100 - blue-gray tint for overcast/ambient lighting',
    mathematicalRelationship: 'Systematic shadow color family - blue-gray for ambient/overcast conditions - mode-agnostic',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: {
        value: {
          light: { base: '#0F141E', wcag: '#0F141E' },
          dark: { base: '#0F141E', wcag: '#0F141E' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      ios: {
        value: {
          light: { base: '#0F141E', wcag: '#0F141E' },
          dark: { base: '#0F141E', wcag: '#0F141E' }
        } as ColorTokenValue,
        unit: 'hex' as const
      },
      android: {
        value: {
          light: { base: '#0F141E', wcag: '#0F141E' },
          dark: { base: '#0F141E', wcag: '#0F141E' }
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
  ...pinkTokens,
  ...greenTokens,
  ...cyanTokens,
  ...tealTokens,
  ...shadowColorTokens
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
export function getColorTokensByFamily(family: 'gray' | 'black' | 'white' | 'yellow' | 'orange' | 'purple' | 'green' | 'pink' | 'cyan' | 'teal'): PrimitiveToken[] {
  return Object.values(colorTokens).filter(token => token.name.startsWith(family));
}

/**
 * Get shadow color token by name
 */
export function getShadowColorToken(name: keyof typeof shadowColorTokens): PrimitiveToken {
  const token = shadowColorTokens[name];
  if (!token) {
    throw new Error(`Shadow color token "${name}" not found`);
  }
  return token;
}

/**
 * Get all shadow color tokens as an array
 */
export function getAllShadowColorTokens(): PrimitiveToken[] {
  return Object.values(shadowColorTokens);
}

/**
 * Shadow color token names for easy reference
 */
export const shadowColorTokenNames = Object.keys(shadowColorTokens) as Array<keyof typeof shadowColorTokens>;

/**
 * Get shadow color tokens by family (shadowBlack, shadowBlue, shadowOrange, shadowGray)
 */
export function getShadowColorTokensByFamily(family: 'shadowBlack' | 'shadowBlue' | 'shadowOrange' | 'shadowGray'): PrimitiveToken[] {
  return Object.values(shadowColorTokens).filter(token => token.name.startsWith(family));
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
  GREEN: 'green',
  PINK: 'pink',
  CYAN: 'cyan',
  TEAL: 'teal',
  SHADOW_BLACK: 'shadowBlack',
  SHADOW_BLUE: 'shadowBlue',
  SHADOW_ORANGE: 'shadowOrange',
  SHADOW_GRAY: 'shadowGray'
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