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
 * 
 * RGBA Migration (Spec 052): All primitive color tokens now use RGBA format for native
 * alpha channel support and direct cross-platform color API mapping.
 */

import { PrimitiveToken, TokenCategory, ColorTokenValue } from '../types/PrimitiveToken';

/**
 * Color token base value (N/A for RGBA values, not mathematical)
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
          light: { base: 'rgba(184, 182, 200, 1)', wcag: 'rgba(184, 182, 200, 1)' },
          dark: { base: 'rgba(184, 182, 200, 1)', wcag: 'rgba(184, 182, 200, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(184, 182, 200, 1)', wcag: 'rgba(184, 182, 200, 1)' },
          dark: { base: 'rgba(184, 182, 200, 1)', wcag: 'rgba(184, 182, 200, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(184, 182, 200, 1)', wcag: 'rgba(184, 182, 200, 1)' },
          dark: { base: 'rgba(184, 182, 200, 1)', wcag: 'rgba(184, 182, 200, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(104, 101, 138, 1)', wcag: 'rgba(104, 101, 138, 1)' },
          dark: { base: 'rgba(104, 101, 138, 1)', wcag: 'rgba(104, 101, 138, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(104, 101, 138, 1)', wcag: 'rgba(104, 101, 138, 1)' },
          dark: { base: 'rgba(104, 101, 138, 1)', wcag: 'rgba(104, 101, 138, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(104, 101, 138, 1)', wcag: 'rgba(104, 101, 138, 1)' },
          dark: { base: 'rgba(104, 101, 138, 1)', wcag: 'rgba(104, 101, 138, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(45, 43, 62, 1)', wcag: 'rgba(45, 43, 62, 1)' },
          dark: { base: 'rgba(45, 43, 62, 1)', wcag: 'rgba(45, 43, 62, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(45, 43, 62, 1)', wcag: 'rgba(45, 43, 62, 1)' },
          dark: { base: 'rgba(45, 43, 62, 1)', wcag: 'rgba(45, 43, 62, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(45, 43, 62, 1)', wcag: 'rgba(45, 43, 62, 1)' },
          dark: { base: 'rgba(45, 43, 62, 1)', wcag: 'rgba(45, 43, 62, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(31, 29, 46, 1)', wcag: 'rgba(31, 29, 46, 1)' },
          dark: { base: 'rgba(31, 29, 46, 1)', wcag: 'rgba(31, 29, 46, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(31, 29, 46, 1)', wcag: 'rgba(31, 29, 46, 1)' },
          dark: { base: 'rgba(31, 29, 46, 1)', wcag: 'rgba(31, 29, 46, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(31, 29, 46, 1)', wcag: 'rgba(31, 29, 46, 1)' },
          dark: { base: 'rgba(31, 29, 46, 1)', wcag: 'rgba(31, 29, 46, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(21, 19, 31, 1)', wcag: 'rgba(21, 19, 31, 1)' },
          dark: { base: 'rgba(21, 19, 31, 1)', wcag: 'rgba(21, 19, 31, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(21, 19, 31, 1)', wcag: 'rgba(21, 19, 31, 1)' },
          dark: { base: 'rgba(21, 19, 31, 1)', wcag: 'rgba(21, 19, 31, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(21, 19, 31, 1)', wcag: 'rgba(21, 19, 31, 1)' },
          dark: { base: 'rgba(21, 19, 31, 1)', wcag: 'rgba(21, 19, 31, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(58, 58, 69, 1)', wcag: 'rgba(82, 82, 92, 1)' },
          dark: { base: 'rgba(58, 58, 69, 1)', wcag: 'rgba(82, 82, 92, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(58, 58, 69, 1)', wcag: 'rgba(82, 82, 92, 1)' },
          dark: { base: 'rgba(58, 58, 69, 1)', wcag: 'rgba(82, 82, 92, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(58, 58, 69, 1)', wcag: 'rgba(82, 82, 92, 1)' },
          dark: { base: 'rgba(58, 58, 69, 1)', wcag: 'rgba(82, 82, 92, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(34, 34, 42, 1)', wcag: 'rgba(46, 46, 56, 1)' },
          dark: { base: 'rgba(34, 34, 42, 1)', wcag: 'rgba(46, 46, 56, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(34, 34, 42, 1)', wcag: 'rgba(46, 46, 56, 1)' },
          dark: { base: 'rgba(34, 34, 42, 1)', wcag: 'rgba(46, 46, 56, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(34, 34, 42, 1)', wcag: 'rgba(46, 46, 56, 1)' },
          dark: { base: 'rgba(34, 34, 42, 1)', wcag: 'rgba(46, 46, 56, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(10, 10, 15, 1)', wcag: 'rgba(10, 10, 15, 1)' },
          dark: { base: 'rgba(10, 10, 15, 1)', wcag: 'rgba(10, 10, 15, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(10, 10, 15, 1)', wcag: 'rgba(10, 10, 15, 1)' },
          dark: { base: 'rgba(10, 10, 15, 1)', wcag: 'rgba(10, 10, 15, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(10, 10, 15, 1)', wcag: 'rgba(10, 10, 15, 1)' },
          dark: { base: 'rgba(10, 10, 15, 1)', wcag: 'rgba(10, 10, 15, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(6, 6, 10, 1)', wcag: 'rgba(6, 6, 10, 1)' },
          dark: { base: 'rgba(6, 6, 10, 1)', wcag: 'rgba(6, 6, 10, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(6, 6, 10, 1)', wcag: 'rgba(6, 6, 10, 1)' },
          dark: { base: 'rgba(6, 6, 10, 1)', wcag: 'rgba(6, 6, 10, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(6, 6, 10, 1)', wcag: 'rgba(6, 6, 10, 1)' },
          dark: { base: 'rgba(6, 6, 10, 1)', wcag: 'rgba(6, 6, 10, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(0, 0, 0, 1)', wcag: 'rgba(0, 0, 0, 1)' },
          dark: { base: 'rgba(0, 0, 0, 1)', wcag: 'rgba(0, 0, 0, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(0, 0, 0, 1)', wcag: 'rgba(0, 0, 0, 1)' },
          dark: { base: 'rgba(0, 0, 0, 1)', wcag: 'rgba(0, 0, 0, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(0, 0, 0, 1)', wcag: 'rgba(0, 0, 0, 1)' },
          dark: { base: 'rgba(0, 0, 0, 1)', wcag: 'rgba(0, 0, 0, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(255, 255, 255, 1)', wcag: 'rgba(255, 255, 255, 1)' },
          dark: { base: 'rgba(255, 255, 255, 1)', wcag: 'rgba(255, 255, 255, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(255, 255, 255, 1)', wcag: 'rgba(255, 255, 255, 1)' },
          dark: { base: 'rgba(255, 255, 255, 1)', wcag: 'rgba(255, 255, 255, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(255, 255, 255, 1)', wcag: 'rgba(255, 255, 255, 1)' },
          dark: { base: 'rgba(255, 255, 255, 1)', wcag: 'rgba(255, 255, 255, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(245, 245, 250, 1)', wcag: 'rgba(245, 245, 250, 1)' },
          dark: { base: 'rgba(245, 245, 250, 1)', wcag: 'rgba(245, 245, 250, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(245, 245, 250, 1)', wcag: 'rgba(245, 245, 250, 1)' },
          dark: { base: 'rgba(245, 245, 250, 1)', wcag: 'rgba(245, 245, 250, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(245, 245, 250, 1)', wcag: 'rgba(245, 245, 250, 1)' },
          dark: { base: 'rgba(245, 245, 250, 1)', wcag: 'rgba(245, 245, 250, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(232, 232, 240, 1)', wcag: 'rgba(232, 232, 240, 1)' },
          dark: { base: 'rgba(232, 232, 240, 1)', wcag: 'rgba(232, 232, 240, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(232, 232, 240, 1)', wcag: 'rgba(232, 232, 240, 1)' },
          dark: { base: 'rgba(232, 232, 240, 1)', wcag: 'rgba(232, 232, 240, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(232, 232, 240, 1)', wcag: 'rgba(232, 232, 240, 1)' },
          dark: { base: 'rgba(232, 232, 240, 1)', wcag: 'rgba(232, 232, 240, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(197, 197, 213, 1)', wcag: 'rgba(197, 197, 213, 1)' },
          dark: { base: 'rgba(197, 197, 213, 1)', wcag: 'rgba(197, 197, 213, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(197, 197, 213, 1)', wcag: 'rgba(197, 197, 213, 1)' },
          dark: { base: 'rgba(197, 197, 213, 1)', wcag: 'rgba(197, 197, 213, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(197, 197, 213, 1)', wcag: 'rgba(197, 197, 213, 1)' },
          dark: { base: 'rgba(197, 197, 213, 1)', wcag: 'rgba(197, 197, 213, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(153, 153, 171, 1)', wcag: 'rgba(153, 153, 171, 1)' },
          dark: { base: 'rgba(153, 153, 171, 1)', wcag: 'rgba(153, 153, 171, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(153, 153, 171, 1)', wcag: 'rgba(153, 153, 171, 1)' },
          dark: { base: 'rgba(153, 153, 171, 1)', wcag: 'rgba(153, 153, 171, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(153, 153, 171, 1)', wcag: 'rgba(153, 153, 171, 1)' },
          dark: { base: 'rgba(153, 153, 171, 1)', wcag: 'rgba(153, 153, 171, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      }
    }
  } as PrimitiveToken
};


/**
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
          light: { base: 'rgba(254, 251, 204, 1)', wcag: 'rgba(254, 251, 204, 1)' },
          dark: { base: 'rgba(254, 251, 204, 1)', wcag: 'rgba(252, 246, 128, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(254, 251, 204, 1)', wcag: 'rgba(254, 251, 204, 1)' },
          dark: { base: 'rgba(254, 251, 204, 1)', wcag: 'rgba(252, 246, 128, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(254, 251, 204, 1)', wcag: 'rgba(254, 251, 204, 1)' },
          dark: { base: 'rgba(254, 251, 204, 1)', wcag: 'rgba(252, 246, 128, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(252, 246, 128, 1)', wcag: 'rgba(252, 246, 128, 1)' },
          dark: { base: 'rgba(252, 246, 128, 1)', wcag: 'rgba(249, 240, 2, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(252, 246, 128, 1)', wcag: 'rgba(252, 246, 128, 1)' },
          dark: { base: 'rgba(252, 246, 128, 1)', wcag: 'rgba(249, 240, 2, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(252, 246, 128, 1)', wcag: 'rgba(252, 246, 128, 1)' },
          dark: { base: 'rgba(252, 246, 128, 1)', wcag: 'rgba(249, 240, 2, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(249, 240, 2, 1)', wcag: 'rgba(249, 240, 2, 1)' },
          dark: { base: 'rgba(249, 240, 2, 1)', wcag: 'rgba(199, 192, 2, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(249, 240, 2, 1)', wcag: 'rgba(249, 240, 2, 1)' },
          dark: { base: 'rgba(249, 240, 2, 1)', wcag: 'rgba(199, 192, 2, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(249, 240, 2, 1)', wcag: 'rgba(249, 240, 2, 1)' },
          dark: { base: 'rgba(249, 240, 2, 1)', wcag: 'rgba(199, 192, 2, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(199, 192, 2, 1)', wcag: 'rgba(199, 192, 2, 1)' },
          dark: { base: 'rgba(199, 192, 2, 1)', wcag: 'rgba(143, 139, 1, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(199, 192, 2, 1)', wcag: 'rgba(199, 192, 2, 1)' },
          dark: { base: 'rgba(199, 192, 2, 1)', wcag: 'rgba(143, 139, 1, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(199, 192, 2, 1)', wcag: 'rgba(199, 192, 2, 1)' },
          dark: { base: 'rgba(199, 192, 2, 1)', wcag: 'rgba(143, 139, 1, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(143, 139, 1, 1)', wcag: 'rgba(143, 139, 1, 1)' },
          dark: { base: 'rgba(143, 139, 1, 1)', wcag: 'rgba(143, 139, 1, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(143, 139, 1, 1)', wcag: 'rgba(143, 139, 1, 1)' },
          dark: { base: 'rgba(143, 139, 1, 1)', wcag: 'rgba(143, 139, 1, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(143, 139, 1, 1)', wcag: 'rgba(143, 139, 1, 1)' },
          dark: { base: 'rgba(143, 139, 1, 1)', wcag: 'rgba(143, 139, 1, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(255, 229, 220, 1)', wcag: 'rgba(255, 243, 224, 1)' },
          dark: { base: 'rgba(255, 229, 220, 1)', wcag: 'rgba(255, 217, 163, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(255, 229, 220, 1)', wcag: 'rgba(255, 243, 224, 1)' },
          dark: { base: 'rgba(255, 229, 220, 1)', wcag: 'rgba(255, 217, 163, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(255, 229, 220, 1)', wcag: 'rgba(255, 243, 224, 1)' },
          dark: { base: 'rgba(255, 229, 220, 1)', wcag: 'rgba(255, 217, 163, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(255, 184, 160, 1)', wcag: 'rgba(245, 158, 0, 1)' },
          dark: { base: 'rgba(255, 184, 160, 1)', wcag: 'rgba(255, 184, 77, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(255, 184, 160, 1)', wcag: 'rgba(245, 158, 0, 1)' },
          dark: { base: 'rgba(255, 184, 160, 1)', wcag: 'rgba(255, 184, 77, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(255, 184, 160, 1)', wcag: 'rgba(245, 158, 0, 1)' },
          dark: { base: 'rgba(255, 184, 160, 1)', wcag: 'rgba(255, 184, 77, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(255, 107, 53, 1)', wcag: 'rgba(184, 117, 0, 1)' },
          dark: { base: 'rgba(255, 107, 53, 1)', wcag: 'rgba(217, 149, 0, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(255, 107, 53, 1)', wcag: 'rgba(184, 117, 0, 1)' },
          dark: { base: 'rgba(255, 107, 53, 1)', wcag: 'rgba(217, 149, 0, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(255, 107, 53, 1)', wcag: 'rgba(184, 117, 0, 1)' },
          dark: { base: 'rgba(255, 107, 53, 1)', wcag: 'rgba(217, 149, 0, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(204, 85, 41, 1)', wcag: 'rgba(140, 90, 0, 1)' },
          dark: { base: 'rgba(204, 85, 41, 1)', wcag: 'rgba(166, 112, 0, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(204, 85, 41, 1)', wcag: 'rgba(140, 90, 0, 1)' },
          dark: { base: 'rgba(204, 85, 41, 1)', wcag: 'rgba(166, 112, 0, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(204, 85, 41, 1)', wcag: 'rgba(140, 90, 0, 1)' },
          dark: { base: 'rgba(204, 85, 41, 1)', wcag: 'rgba(166, 112, 0, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(143, 60, 29, 1)', wcag: 'rgba(77, 49, 0, 1)' },
          dark: { base: 'rgba(143, 60, 29, 1)', wcag: 'rgba(92, 61, 0, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(143, 60, 29, 1)', wcag: 'rgba(77, 49, 0, 1)' },
          dark: { base: 'rgba(143, 60, 29, 1)', wcag: 'rgba(92, 61, 0, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(143, 60, 29, 1)', wcag: 'rgba(77, 49, 0, 1)' },
          dark: { base: 'rgba(143, 60, 29, 1)', wcag: 'rgba(92, 61, 0, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(243, 224, 255, 1)', wcag: 'rgba(243, 224, 255, 1)' },
          dark: { base: 'rgba(243, 224, 255, 1)', wcag: 'rgba(243, 224, 255, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(243, 224, 255, 1)', wcag: 'rgba(243, 224, 255, 1)' },
          dark: { base: 'rgba(243, 224, 255, 1)', wcag: 'rgba(243, 224, 255, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(243, 224, 255, 1)', wcag: 'rgba(243, 224, 255, 1)' },
          dark: { base: 'rgba(243, 224, 255, 1)', wcag: 'rgba(243, 224, 255, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(217, 138, 255, 1)', wcag: 'rgba(217, 138, 255, 1)' },
          dark: { base: 'rgba(217, 138, 255, 1)', wcag: 'rgba(217, 138, 255, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(217, 138, 255, 1)', wcag: 'rgba(217, 138, 255, 1)' },
          dark: { base: 'rgba(217, 138, 255, 1)', wcag: 'rgba(217, 138, 255, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(217, 138, 255, 1)', wcag: 'rgba(217, 138, 255, 1)' },
          dark: { base: 'rgba(217, 138, 255, 1)', wcag: 'rgba(217, 138, 255, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(176, 38, 255, 1)', wcag: 'rgba(176, 38, 255, 1)' },
          dark: { base: 'rgba(176, 38, 255, 1)', wcag: 'rgba(176, 38, 255, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(176, 38, 255, 1)', wcag: 'rgba(176, 38, 255, 1)' },
          dark: { base: 'rgba(176, 38, 255, 1)', wcag: 'rgba(176, 38, 255, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(176, 38, 255, 1)', wcag: 'rgba(176, 38, 255, 1)' },
          dark: { base: 'rgba(176, 38, 255, 1)', wcag: 'rgba(176, 38, 255, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(141, 30, 204, 1)', wcag: 'rgba(141, 30, 204, 1)' },
          dark: { base: 'rgba(141, 30, 204, 1)', wcag: 'rgba(141, 30, 204, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(141, 30, 204, 1)', wcag: 'rgba(141, 30, 204, 1)' },
          dark: { base: 'rgba(141, 30, 204, 1)', wcag: 'rgba(141, 30, 204, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(141, 30, 204, 1)', wcag: 'rgba(141, 30, 204, 1)' },
          dark: { base: 'rgba(141, 30, 204, 1)', wcag: 'rgba(141, 30, 204, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(99, 21, 143, 1)', wcag: 'rgba(99, 21, 143, 1)' },
          dark: { base: 'rgba(99, 21, 143, 1)', wcag: 'rgba(99, 21, 143, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(99, 21, 143, 1)', wcag: 'rgba(99, 21, 143, 1)' },
          dark: { base: 'rgba(99, 21, 143, 1)', wcag: 'rgba(99, 21, 143, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(99, 21, 143, 1)', wcag: 'rgba(99, 21, 143, 1)' },
          dark: { base: 'rgba(99, 21, 143, 1)', wcag: 'rgba(99, 21, 143, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(255, 218, 232, 1)', wcag: 'rgba(252, 228, 236, 1)' },
          dark: { base: 'rgba(255, 218, 232, 1)', wcag: 'rgba(255, 179, 209, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(255, 218, 232, 1)', wcag: 'rgba(252, 228, 236, 1)' },
          dark: { base: 'rgba(255, 218, 232, 1)', wcag: 'rgba(255, 179, 209, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(255, 218, 232, 1)', wcag: 'rgba(252, 228, 236, 1)' },
          dark: { base: 'rgba(255, 218, 232, 1)', wcag: 'rgba(255, 179, 209, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(255, 130, 180, 1)', wcag: 'rgba(233, 30, 99, 1)' },
          dark: { base: 'rgba(255, 130, 180, 1)', wcag: 'rgba(255, 107, 163, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(255, 130, 180, 1)', wcag: 'rgba(233, 30, 99, 1)' },
          dark: { base: 'rgba(255, 130, 180, 1)', wcag: 'rgba(255, 107, 163, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(255, 130, 180, 1)', wcag: 'rgba(233, 30, 99, 1)' },
          dark: { base: 'rgba(255, 130, 180, 1)', wcag: 'rgba(255, 107, 163, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(255, 42, 109, 1)', wcag: 'rgba(194, 24, 91, 1)' },
          dark: { base: 'rgba(255, 42, 109, 1)', wcag: 'rgba(230, 48, 117, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(255, 42, 109, 1)', wcag: 'rgba(194, 24, 91, 1)' },
          dark: { base: 'rgba(255, 42, 109, 1)', wcag: 'rgba(230, 48, 117, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(255, 42, 109, 1)', wcag: 'rgba(194, 24, 91, 1)' },
          dark: { base: 'rgba(255, 42, 109, 1)', wcag: 'rgba(230, 48, 117, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(204, 34, 87, 1)', wcag: 'rgba(136, 14, 79, 1)' },
          dark: { base: 'rgba(204, 34, 87, 1)', wcag: 'rgba(179, 38, 89, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(204, 34, 87, 1)', wcag: 'rgba(136, 14, 79, 1)' },
          dark: { base: 'rgba(204, 34, 87, 1)', wcag: 'rgba(179, 38, 89, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(204, 34, 87, 1)', wcag: 'rgba(136, 14, 79, 1)' },
          dark: { base: 'rgba(204, 34, 87, 1)', wcag: 'rgba(179, 38, 89, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(128, 21, 55, 1)', wcag: 'rgba(77, 8, 41, 1)' },
          dark: { base: 'rgba(128, 21, 55, 1)', wcag: 'rgba(92, 26, 51, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(128, 21, 55, 1)', wcag: 'rgba(77, 8, 41, 1)' },
          dark: { base: 'rgba(128, 21, 55, 1)', wcag: 'rgba(92, 26, 51, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(128, 21, 55, 1)', wcag: 'rgba(77, 8, 41, 1)' },
          dark: { base: 'rgba(128, 21, 55, 1)', wcag: 'rgba(92, 26, 51, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(230, 255, 245, 1)', wcag: 'rgba(232, 245, 233, 1)' },
          dark: { base: 'rgba(230, 255, 245, 1)', wcag: 'rgba(179, 255, 179, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(230, 255, 245, 1)', wcag: 'rgba(232, 245, 233, 1)' },
          dark: { base: 'rgba(230, 255, 245, 1)', wcag: 'rgba(179, 255, 179, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(230, 255, 245, 1)', wcag: 'rgba(232, 245, 233, 1)' },
          dark: { base: 'rgba(230, 255, 245, 1)', wcag: 'rgba(179, 255, 179, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(128, 255, 187, 1)', wcag: 'rgba(76, 175, 80, 1)' },
          dark: { base: 'rgba(128, 255, 187, 1)', wcag: 'rgba(102, 255, 102, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(128, 255, 187, 1)', wcag: 'rgba(76, 175, 80, 1)' },
          dark: { base: 'rgba(128, 255, 187, 1)', wcag: 'rgba(102, 255, 102, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(128, 255, 187, 1)', wcag: 'rgba(76, 175, 80, 1)' },
          dark: { base: 'rgba(128, 255, 187, 1)', wcag: 'rgba(102, 255, 102, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(51, 255, 153, 1)', wcag: 'rgba(56, 142, 60, 1)' },
          dark: { base: 'rgba(51, 255, 153, 1)', wcag: 'rgba(51, 224, 51, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(51, 255, 153, 1)', wcag: 'rgba(56, 142, 60, 1)' },
          dark: { base: 'rgba(51, 255, 153, 1)', wcag: 'rgba(51, 224, 51, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(51, 255, 153, 1)', wcag: 'rgba(56, 142, 60, 1)' },
          dark: { base: 'rgba(51, 255, 153, 1)', wcag: 'rgba(51, 224, 51, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(0, 255, 136, 1)', wcag: 'rgba(27, 94, 32, 1)' },
          dark: { base: 'rgba(0, 255, 136, 1)', wcag: 'rgba(38, 179, 38, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(0, 255, 136, 1)', wcag: 'rgba(27, 94, 32, 1)' },
          dark: { base: 'rgba(0, 255, 136, 1)', wcag: 'rgba(38, 179, 38, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(0, 255, 136, 1)', wcag: 'rgba(27, 94, 32, 1)' },
          dark: { base: 'rgba(0, 255, 136, 1)', wcag: 'rgba(38, 179, 38, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(0, 204, 110, 1)', wcag: 'rgba(13, 48, 16, 1)' },
          dark: { base: 'rgba(0, 204, 110, 1)', wcag: 'rgba(20, 89, 20, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(0, 204, 110, 1)', wcag: 'rgba(13, 48, 16, 1)' },
          dark: { base: 'rgba(0, 204, 110, 1)', wcag: 'rgba(20, 89, 20, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(0, 204, 110, 1)', wcag: 'rgba(13, 48, 16, 1)' },
          dark: { base: 'rgba(0, 204, 110, 1)', wcag: 'rgba(20, 89, 20, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(204, 251, 255, 1)', wcag: 'rgba(204, 251, 255, 1)' },
          dark: { base: 'rgba(204, 251, 255, 1)', wcag: 'rgba(204, 251, 255, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(204, 251, 255, 1)', wcag: 'rgba(204, 251, 255, 1)' },
          dark: { base: 'rgba(204, 251, 255, 1)', wcag: 'rgba(204, 251, 255, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(204, 251, 255, 1)', wcag: 'rgba(204, 251, 255, 1)' },
          dark: { base: 'rgba(204, 251, 255, 1)', wcag: 'rgba(204, 251, 255, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(128, 246, 255, 1)', wcag: 'rgba(128, 246, 255, 1)' },
          dark: { base: 'rgba(128, 246, 255, 1)', wcag: 'rgba(128, 246, 255, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(128, 246, 255, 1)', wcag: 'rgba(128, 246, 255, 1)' },
          dark: { base: 'rgba(128, 246, 255, 1)', wcag: 'rgba(128, 246, 255, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(128, 246, 255, 1)', wcag: 'rgba(128, 246, 255, 1)' },
          dark: { base: 'rgba(128, 246, 255, 1)', wcag: 'rgba(128, 246, 255, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(0, 240, 255, 1)', wcag: 'rgba(0, 240, 255, 1)' },
          dark: { base: 'rgba(0, 240, 255, 1)', wcag: 'rgba(0, 240, 255, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(0, 240, 255, 1)', wcag: 'rgba(0, 240, 255, 1)' },
          dark: { base: 'rgba(0, 240, 255, 1)', wcag: 'rgba(0, 240, 255, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(0, 240, 255, 1)', wcag: 'rgba(0, 240, 255, 1)' },
          dark: { base: 'rgba(0, 240, 255, 1)', wcag: 'rgba(0, 240, 255, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(0, 192, 204, 1)', wcag: 'rgba(0, 192, 204, 1)' },
          dark: { base: 'rgba(0, 192, 204, 1)', wcag: 'rgba(0, 192, 204, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(0, 192, 204, 1)', wcag: 'rgba(0, 192, 204, 1)' },
          dark: { base: 'rgba(0, 192, 204, 1)', wcag: 'rgba(0, 192, 204, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(0, 192, 204, 1)', wcag: 'rgba(0, 192, 204, 1)' },
          dark: { base: 'rgba(0, 192, 204, 1)', wcag: 'rgba(0, 192, 204, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(0, 136, 143, 1)', wcag: 'rgba(0, 136, 143, 1)' },
          dark: { base: 'rgba(0, 136, 143, 1)', wcag: 'rgba(0, 136, 143, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(0, 136, 143, 1)', wcag: 'rgba(0, 136, 143, 1)' },
          dark: { base: 'rgba(0, 136, 143, 1)', wcag: 'rgba(0, 136, 143, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(0, 136, 143, 1)', wcag: 'rgba(0, 136, 143, 1)' },
          dark: { base: 'rgba(0, 136, 143, 1)', wcag: 'rgba(0, 136, 143, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(217, 232, 234, 1)', wcag: 'rgba(217, 232, 234, 1)' },
          dark: { base: 'rgba(217, 232, 234, 1)', wcag: 'rgba(217, 232, 234, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(217, 232, 234, 1)', wcag: 'rgba(217, 232, 234, 1)' },
          dark: { base: 'rgba(217, 232, 234, 1)', wcag: 'rgba(217, 232, 234, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(217, 232, 234, 1)', wcag: 'rgba(217, 232, 234, 1)' },
          dark: { base: 'rgba(217, 232, 234, 1)', wcag: 'rgba(217, 232, 234, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(77, 155, 165, 1)', wcag: 'rgba(77, 155, 165, 1)' },
          dark: { base: 'rgba(77, 155, 165, 1)', wcag: 'rgba(77, 155, 165, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(77, 155, 165, 1)', wcag: 'rgba(77, 155, 165, 1)' },
          dark: { base: 'rgba(77, 155, 165, 1)', wcag: 'rgba(77, 155, 165, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(77, 155, 165, 1)', wcag: 'rgba(77, 155, 165, 1)' },
          dark: { base: 'rgba(77, 155, 165, 1)', wcag: 'rgba(77, 155, 165, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(26, 83, 92, 1)', wcag: 'rgba(26, 83, 92, 1)' },
          dark: { base: 'rgba(26, 83, 92, 1)', wcag: 'rgba(0, 240, 255, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(26, 83, 92, 1)', wcag: 'rgba(26, 83, 92, 1)' },
          dark: { base: 'rgba(26, 83, 92, 1)', wcag: 'rgba(0, 240, 255, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(26, 83, 92, 1)', wcag: 'rgba(26, 83, 92, 1)' },
          dark: { base: 'rgba(26, 83, 92, 1)', wcag: 'rgba(0, 240, 255, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(21, 66, 74, 1)', wcag: 'rgba(21, 66, 74, 1)' },
          dark: { base: 'rgba(21, 66, 74, 1)', wcag: 'rgba(21, 66, 74, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(21, 66, 74, 1)', wcag: 'rgba(21, 66, 74, 1)' },
          dark: { base: 'rgba(21, 66, 74, 1)', wcag: 'rgba(21, 66, 74, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(21, 66, 74, 1)', wcag: 'rgba(21, 66, 74, 1)' },
          dark: { base: 'rgba(21, 66, 74, 1)', wcag: 'rgba(21, 66, 74, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(15, 46, 51, 1)', wcag: 'rgba(15, 46, 51, 1)' },
          dark: { base: 'rgba(15, 46, 51, 1)', wcag: 'rgba(15, 46, 51, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(15, 46, 51, 1)', wcag: 'rgba(15, 46, 51, 1)' },
          dark: { base: 'rgba(15, 46, 51, 1)', wcag: 'rgba(15, 46, 51, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(15, 46, 51, 1)', wcag: 'rgba(15, 46, 51, 1)' },
          dark: { base: 'rgba(15, 46, 51, 1)', wcag: 'rgba(15, 46, 51, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(0, 0, 0, 1)', wcag: 'rgba(0, 0, 0, 1)' },
          dark: { base: 'rgba(0, 0, 0, 1)', wcag: 'rgba(0, 0, 0, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(0, 0, 0, 1)', wcag: 'rgba(0, 0, 0, 1)' },
          dark: { base: 'rgba(0, 0, 0, 1)', wcag: 'rgba(0, 0, 0, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(0, 0, 0, 1)', wcag: 'rgba(0, 0, 0, 1)' },
          dark: { base: 'rgba(0, 0, 0, 1)', wcag: 'rgba(0, 0, 0, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(20, 25, 40, 1)', wcag: 'rgba(20, 25, 40, 1)' },
          dark: { base: 'rgba(20, 25, 40, 1)', wcag: 'rgba(20, 25, 40, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(20, 25, 40, 1)', wcag: 'rgba(20, 25, 40, 1)' },
          dark: { base: 'rgba(20, 25, 40, 1)', wcag: 'rgba(20, 25, 40, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(20, 25, 40, 1)', wcag: 'rgba(20, 25, 40, 1)' },
          dark: { base: 'rgba(20, 25, 40, 1)', wcag: 'rgba(20, 25, 40, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(25, 20, 15, 1)', wcag: 'rgba(25, 20, 15, 1)' },
          dark: { base: 'rgba(25, 20, 15, 1)', wcag: 'rgba(25, 20, 15, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(25, 20, 15, 1)', wcag: 'rgba(25, 20, 15, 1)' },
          dark: { base: 'rgba(25, 20, 15, 1)', wcag: 'rgba(25, 20, 15, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(25, 20, 15, 1)', wcag: 'rgba(25, 20, 15, 1)' },
          dark: { base: 'rgba(25, 20, 15, 1)', wcag: 'rgba(25, 20, 15, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
          light: { base: 'rgba(15, 20, 30, 1)', wcag: 'rgba(15, 20, 30, 1)' },
          dark: { base: 'rgba(15, 20, 30, 1)', wcag: 'rgba(15, 20, 30, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      ios: {
        value: {
          light: { base: 'rgba(15, 20, 30, 1)', wcag: 'rgba(15, 20, 30, 1)' },
          dark: { base: 'rgba(15, 20, 30, 1)', wcag: 'rgba(15, 20, 30, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
      },
      android: {
        value: {
          light: { base: 'rgba(15, 20, 30, 1)', wcag: 'rgba(15, 20, 30, 1)' },
          dark: { base: 'rgba(15, 20, 30, 1)', wcag: 'rgba(15, 20, 30, 1)' }
        } as ColorTokenValue,
        unit: 'rgba' as const
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
 * Get color tokens by family
 */
export function getColorTokensByFamily(family: 'gray' | 'black' | 'white' | 'yellow' | 'orange' | 'purple' | 'pink' | 'green' | 'cyan' | 'teal' | 'shadow'): PrimitiveToken[] {
  switch (family) {
    case 'gray':
      return Object.values(grayTokens);
    case 'black':
      return Object.values(blackTokens);
    case 'white':
      return Object.values(whiteTokens);
    case 'yellow':
      return Object.values(yellowTokens);
    case 'orange':
      return Object.values(orangeTokens);
    case 'purple':
      return Object.values(purpleTokens);
    case 'pink':
      return Object.values(pinkTokens);
    case 'green':
      return Object.values(greenTokens);
    case 'cyan':
      return Object.values(cyanTokens);
    case 'teal':
      return Object.values(tealTokens);
    case 'shadow':
      return Object.values(shadowColorTokens);
    default:
      throw new Error(`Unknown color family: ${family}`);
  }
}


/**
 * Color family constants for systematic organization
 */
export const COLOR_FAMILIES = {
  GRAY: 'gray',
  BLACK: 'black',
  WHITE: 'white',
  YELLOW: 'yellow',
  ORANGE: 'orange',
  PURPLE: 'purple',
  PINK: 'pink',
  GREEN: 'green',
  CYAN: 'cyan',
  TEAL: 'teal',
  SHADOW: 'shadow',
  SHADOW_BLACK: 'shadowBlack',
  SHADOW_BLUE: 'shadowBlue',
  SHADOW_ORANGE: 'shadowOrange',
  SHADOW_GRAY: 'shadowGray'
} as const;
export type ColorFamily = typeof COLOR_FAMILIES[keyof typeof COLOR_FAMILIES];

/**
 * Color scale constants (100-500 progression)
 */
export const COLOR_SCALE = [100, 200, 300, 400, 500] as const;
export type ColorScale = typeof COLOR_SCALE[number];

/**
 * Color mode constants
 */
export const COLOR_MODES = ['light', 'dark'] as const;
export type ColorMode = typeof COLOR_MODES[number];

/**
 * Color theme constants
 */
export const COLOR_THEMES = ['base', 'wcag'] as const;
export type ColorTheme = typeof COLOR_THEMES[number];

/**
 * Shadow color token names for easy reference
 */
export const shadowColorTokenNames = Object.keys(shadowColorTokens) as Array<keyof typeof shadowColorTokens>;

/**
 * Get a specific shadow color token by name
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
 * Get shadow color tokens by family
 */
export function getShadowColorTokensByFamily(family: 'shadowBlack' | 'shadowBlue' | 'shadowOrange' | 'shadowGray'): PrimitiveToken[] {
  const familyTokens = Object.entries(shadowColorTokens)
    .filter(([name]) => name.startsWith(family))
    .map(([, token]) => token);
  return familyTokens;
}

/**
 * Resolve a color token value for a specific mode and theme
 * 
 * @param token - The color token object (PrimitiveToken)
 * @param mode - The color mode ('light', 'dark') - defaults to 'light'
 * @param theme - The color theme ('base', 'wcag') - defaults to 'base'
 * @returns The resolved color value as a string (RGBA format)
 */
export function resolveColorTokenValue(
  token: PrimitiveToken,
  mode: ColorMode = 'light',
  theme: ColorTheme = 'base'
): string {
  if (!token || token.category !== TokenCategory.COLOR) {
    throw new Error(`Token "${token?.name || 'unknown'}" is not a color token`);
  }
  
  // Use web platform as the canonical source for color values
  const platformValue = token.platforms.web;
  if (!platformValue) {
    throw new Error(`Web platform not found for token "${token.name}"`);
  }
  
  const colorValue = platformValue.value as ColorTokenValue;
  if (!colorValue || typeof colorValue !== 'object') {
    throw new Error(`Invalid color value structure for token "${token.name}"`);
  }
  
  const modeValue = colorValue[mode];
  if (!modeValue) {
    throw new Error(`Mode "${mode}" not found for token "${token.name}"`);
  }
  
  const themeValue = modeValue[theme];
  if (!themeValue) {
    throw new Error(`Theme "${theme}" not found for token "${token.name}" in mode "${mode}"`);
  }
  
  return themeValue;
}
