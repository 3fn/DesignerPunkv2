"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.COLOR_THEMES = exports.COLOR_MODES = exports.COLOR_SCALE = exports.COLOR_FAMILIES = exports.shadowColorTokenNames = exports.colorTokenNames = exports.colorTokens = exports.shadowColorTokens = exports.tealTokens = exports.cyanTokens = exports.violetTokens = exports.purpleTokens = exports.orangeTokens = exports.yellowTokens = exports.whiteTokens = exports.blackTokens = exports.grayTokens = exports.COLOR_BASE_VALUE = void 0;
exports.getColorToken = getColorToken;
exports.getAllColorTokens = getAllColorTokens;
exports.getColorTokensByFamily = getColorTokensByFamily;
exports.getShadowColorToken = getShadowColorToken;
exports.getAllShadowColorTokens = getAllShadowColorTokens;
exports.getShadowColorTokensByFamily = getShadowColorTokensByFamily;
exports.resolveColorTokenValue = resolveColorTokenValue;
const PrimitiveToken_1 = require("../types/PrimitiveToken");
/**
 * Color token base value (N/A for hex values, not mathematical)
 */
exports.COLOR_BASE_VALUE = 0; // N/A for categorical color tokens
/**
 * Gray scale color tokens - Neutral surfaces and text colors
 */
exports.grayTokens = {
    gray100: {
        name: 'gray100',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0, // N/A for color tokens
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#B8B6C8', wcag: '#C2C0D4' },
                    dark: { base: '#B8B6C8', wcag: '#C2C0D4' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#B8B6C8', wcag: '#C2C0D4' },
                    dark: { base: '#B8B6C8', wcag: '#C2C0D4' }
                },
                unit: 'hex'
            }
        }
    },
    gray200: {
        name: 'gray200',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#68658A', wcag: '#8A879E' },
                    dark: { base: '#68658A', wcag: '#8A879E' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#68658A', wcag: '#8A879E' },
                    dark: { base: '#68658A', wcag: '#8A879E' }
                },
                unit: 'hex'
            }
        }
    },
    gray300: {
        name: 'gray300',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#2D2B3E', wcag: '#4D4A5C' },
                    dark: { base: '#2D2B3E', wcag: '#4D4A5C' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#2D2B3E', wcag: '#4D4A5C' },
                    dark: { base: '#2D2B3E', wcag: '#4D4A5C' }
                },
                unit: 'hex'
            }
        }
    },
    gray400: {
        name: 'gray400',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#1F1D2E', wcag: '#2E2C3D' },
                    dark: { base: '#1F1D2E', wcag: '#2E2C3D' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#1F1D2E', wcag: '#2E2C3D' },
                    dark: { base: '#1F1D2E', wcag: '#2E2C3D' }
                },
                unit: 'hex'
            }
        }
    },
    gray500: {
        name: 'gray500',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#15131F', wcag: '#1A1826' },
                    dark: { base: '#15131F', wcag: '#1A1826' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#15131F', wcag: '#1A1826' },
                    dark: { base: '#15131F', wcag: '#1A1826' }
                },
                unit: 'hex'
            }
        }
    }
};
/**
 * Black scale color tokens - Deep backgrounds and containers
 */
exports.blackTokens = {
    black100: {
        name: 'black100',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#3A3A45', wcag: '#52525C' },
                    dark: { base: '#3A3A45', wcag: '#52525C' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#3A3A45', wcag: '#52525C' },
                    dark: { base: '#3A3A45', wcag: '#52525C' }
                },
                unit: 'hex'
            }
        }
    },
    black200: {
        name: 'black200',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#22222A', wcag: '#2E2E38' },
                    dark: { base: '#22222A', wcag: '#2E2E38' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#22222A', wcag: '#2E2E38' },
                    dark: { base: '#22222A', wcag: '#2E2E38' }
                },
                unit: 'hex'
            }
        }
    },
    black300: {
        name: 'black300',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#0A0A0F', wcag: '#0A0A0F' },
                    dark: { base: '#0A0A0F', wcag: '#0A0A0F' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#0A0A0F', wcag: '#0A0A0F' },
                    dark: { base: '#0A0A0F', wcag: '#0A0A0F' }
                },
                unit: 'hex'
            }
        }
    },
    black400: {
        name: 'black400',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#06060A', wcag: '#06060A' },
                    dark: { base: '#06060A', wcag: '#06060A' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#06060A', wcag: '#06060A' },
                    dark: { base: '#06060A', wcag: '#06060A' }
                },
                unit: 'hex'
            }
        }
    },
    black500: {
        name: 'black500',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#000000', wcag: '#000000' },
                    dark: { base: '#000000', wcag: '#000000' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#000000', wcag: '#000000' },
                    dark: { base: '#000000', wcag: '#000000' }
                },
                unit: 'hex'
            }
        }
    }
};
/**
 * White scale color tokens - Light surfaces and primary text
 */
exports.whiteTokens = {
    white100: {
        name: 'white100',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#FFFFFF', wcag: '#FFFFFF' },
                    dark: { base: '#FFFFFF', wcag: '#FFFFFF' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#FFFFFF', wcag: '#FFFFFF' },
                    dark: { base: '#FFFFFF', wcag: '#FFFFFF' }
                },
                unit: 'hex'
            }
        }
    },
    white200: {
        name: 'white200',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#F5F5FA', wcag: '#F2F2FA' },
                    dark: { base: '#F5F5FA', wcag: '#F2F2FA' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#F5F5FA', wcag: '#F2F2FA' },
                    dark: { base: '#F5F5FA', wcag: '#F2F2FA' }
                },
                unit: 'hex'
            }
        }
    },
    white300: {
        name: 'white300',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#E8E8F0', wcag: '#D9D9E6' },
                    dark: { base: '#E8E8F0', wcag: '#D9D9E6' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#E8E8F0', wcag: '#D9D9E6' },
                    dark: { base: '#E8E8F0', wcag: '#D9D9E6' }
                },
                unit: 'hex'
            }
        }
    },
    white400: {
        name: 'white400',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#C5C5D5', wcag: '#A6A6BF' },
                    dark: { base: '#C5C5D5', wcag: '#A6A6BF' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#C5C5D5', wcag: '#A6A6BF' },
                    dark: { base: '#C5C5D5', wcag: '#A6A6BF' }
                },
                unit: 'hex'
            }
        }
    },
    white500: {
        name: 'white500',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#9999AB', wcag: '#737388' },
                    dark: { base: '#9999AB', wcag: '#737388' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#9999AB', wcag: '#737388' },
                    dark: { base: '#9999AB', wcag: '#737388' }
                },
                unit: 'hex'
            }
        }
    }
}; /**

 * Yellow scale color tokens - High-energy CTAs and warnings
 */
exports.yellowTokens = {
    yellow100: {
        name: 'yellow100',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#FEFBCC', wcag: '#FFF9B3' },
                    dark: { base: '#FEFBCC', wcag: '#FFF9B3' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#FEFBCC', wcag: '#FFF9B3' },
                    dark: { base: '#FEFBCC', wcag: '#FFF9B3' }
                },
                unit: 'hex'
            }
        }
    },
    yellow200: {
        name: 'yellow200',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#FCF680', wcag: '#F5E34A' },
                    dark: { base: '#FCF680', wcag: '#F5E34A' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#FCF680', wcag: '#F5E34A' },
                    dark: { base: '#FCF680', wcag: '#F5E34A' }
                },
                unit: 'hex'
            }
        }
    },
    yellow300: {
        name: 'yellow300',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#F9F002', wcag: '#E6D200' },
                    dark: { base: '#F9F002', wcag: '#E6D200' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#F9F002', wcag: '#E6D200' },
                    dark: { base: '#F9F002', wcag: '#E6D200' }
                },
                unit: 'hex'
            }
        }
    },
    yellow400: {
        name: 'yellow400',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#C7C002', wcag: '#9B8E00' },
                    dark: { base: '#C7C002', wcag: '#9B8E00' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#C7C002', wcag: '#9B8E00' },
                    dark: { base: '#C7C002', wcag: '#9B8E00' }
                },
                unit: 'hex'
            }
        }
    },
    yellow500: {
        name: 'yellow500',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#8F8B01', wcag: '#5C5400' },
                    dark: { base: '#8F8B01', wcag: '#5C5400' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#8F8B01', wcag: '#5C5400' },
                    dark: { base: '#8F8B01', wcag: '#5C5400' }
                },
                unit: 'hex'
            }
        }
    }
};
/**
 * Orange scale color tokens - Secondary CTAs and approachable error states
 */
exports.orangeTokens = {
    orange100: {
        name: 'orange100',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#FFE5DC', wcag: '#FFD4C2' },
                    dark: { base: '#FFE5DC', wcag: '#FFD4C2' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#FFE5DC', wcag: '#FFD4C2' },
                    dark: { base: '#FFE5DC', wcag: '#FFD4C2' }
                },
                unit: 'hex'
            }
        }
    },
    orange200: {
        name: 'orange200',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#FFB8A0', wcag: '#FFA380' },
                    dark: { base: '#FFB8A0', wcag: '#FFA380' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#FFB8A0', wcag: '#FFA380' },
                    dark: { base: '#FFB8A0', wcag: '#FFA380' }
                },
                unit: 'hex'
            }
        }
    },
    orange300: {
        name: 'orange300',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#FF6B35', wcag: '#E65A2A' },
                    dark: { base: '#FF6B35', wcag: '#E65A2A' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#FF6B35', wcag: '#E65A2A' },
                    dark: { base: '#FF6B35', wcag: '#E65A2A' }
                },
                unit: 'hex'
            }
        }
    },
    orange400: {
        name: 'orange400',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#CC5529', wcag: '#B34621' },
                    dark: { base: '#CC5529', wcag: '#B34621' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#CC5529', wcag: '#B34621' },
                    dark: { base: '#CC5529', wcag: '#B34621' }
                },
                unit: 'hex'
            }
        }
    },
    orange500: {
        name: 'orange500',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#8F3C1D', wcag: '#6B2A14' },
                    dark: { base: '#8F3C1D', wcag: '#6B2A14' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#8F3C1D', wcag: '#6B2A14' },
                    dark: { base: '#8F3C1D', wcag: '#6B2A14' }
                },
                unit: 'hex'
            }
        }
    }
};
/**
 * Purple scale color tokens - Primary brand and focus states
 */
exports.purpleTokens = {
    purple100: {
        name: 'purple100',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#F3E0FF', wcag: '#F5D4FF' },
                    dark: { base: '#F3E0FF', wcag: '#F5D4FF' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#F3E0FF', wcag: '#F5D4FF' },
                    dark: { base: '#F3E0FF', wcag: '#F5D4FF' }
                },
                unit: 'hex'
            }
        }
    },
    purple200: {
        name: 'purple200',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#D98AFF', wcag: '#D580FF' },
                    dark: { base: '#D98AFF', wcag: '#D580FF' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#D98AFF', wcag: '#D580FF' },
                    dark: { base: '#D98AFF', wcag: '#D580FF' }
                },
                unit: 'hex'
            }
        }
    },
    purple300: {
        name: 'purple300',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#B026FF', wcag: '#A928E6' },
                    dark: { base: '#B026FF', wcag: '#A928E6' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#B026FF', wcag: '#A928E6' },
                    dark: { base: '#B026FF', wcag: '#A928E6' }
                },
                unit: 'hex'
            }
        }
    },
    purple400: {
        name: 'purple400',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#8D1ECC', wcag: '#7A1DA6' },
                    dark: { base: '#8D1ECC', wcag: '#7A1DA6' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#8D1ECC', wcag: '#7A1DA6' },
                    dark: { base: '#8D1ECC', wcag: '#7A1DA6' }
                },
                unit: 'hex'
            }
        }
    },
    purple500: {
        name: 'purple500',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#63158F', wcag: '#4A1166' },
                    dark: { base: '#63158F', wcag: '#4A1166' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#63158F', wcag: '#4A1166' },
                    dark: { base: '#63158F', wcag: '#4A1166' }
                },
                unit: 'hex'
            }
        }
    }
};
/**
 * Violet scale color tokens - Depth, hover states, and secondary elements
 */
exports.violetTokens = {
    violet100: {
        name: 'violet100',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#E8DDF3', wcag: '#DCC8F0' },
                    dark: { base: '#E8DDF3', wcag: '#DCC8F0' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#E8DDF3', wcag: '#DCC8F0' },
                    dark: { base: '#E8DDF3', wcag: '#DCC8F0' }
                },
                unit: 'hex'
            }
        }
    },
    violet200: {
        name: 'violet200',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#9A6BC2', wcag: '#A87DD9' },
                    dark: { base: '#9A6BC2', wcag: '#A87DD9' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#9A6BC2', wcag: '#A87DD9' },
                    dark: { base: '#9A6BC2', wcag: '#A87DD9' }
                },
                unit: 'hex'
            }
        }
    },
    violet300: {
        name: 'violet300',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#5B2C91', wcag: '#7A48B3' },
                    dark: { base: '#5B2C91', wcag: '#7A48B3' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#5B2C91', wcag: '#7A48B3' },
                    dark: { base: '#5B2C91', wcag: '#7A48B3' }
                },
                unit: 'hex'
            }
        }
    },
    violet400: {
        name: 'violet400',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#482374', wcag: '#5A3380' },
                    dark: { base: '#482374', wcag: '#5A3380' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#482374', wcag: '#5A3380' },
                    dark: { base: '#482374', wcag: '#5A3380' }
                },
                unit: 'hex'
            }
        }
    },
    violet500: {
        name: 'violet500',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#331951', wcag: '#3A2159' },
                    dark: { base: '#331951', wcag: '#3A2159' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#331951', wcag: '#3A2159' },
                    dark: { base: '#331951', wcag: '#3A2159' }
                },
                unit: 'hex'
            }
        }
    }
};
/**
 * Cyan scale color tokens - Tech elements, links, and success states
 */
exports.cyanTokens = {
    cyan100: {
        name: 'cyan100',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#CCFBFF', wcag: '#B3F5FF' },
                    dark: { base: '#CCFBFF', wcag: '#B3F5FF' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#CCFBFF', wcag: '#B3F5FF' },
                    dark: { base: '#CCFBFF', wcag: '#B3F5FF' }
                },
                unit: 'hex'
            }
        }
    },
    cyan200: {
        name: 'cyan200',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#80F6FF', wcag: '#66E5F5' },
                    dark: { base: '#80F6FF', wcag: '#66E5F5' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#80F6FF', wcag: '#66E5F5' },
                    dark: { base: '#80F6FF', wcag: '#66E5F5' }
                },
                unit: 'hex'
            }
        }
    },
    cyan300: {
        name: 'cyan300',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#00F0FF', wcag: '#00C5D9' },
                    dark: { base: '#00F0FF', wcag: '#00C5D9' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#00F0FF', wcag: '#00C5D9' },
                    dark: { base: '#00F0FF', wcag: '#00C5D9' }
                },
                unit: 'hex'
            }
        }
    },
    cyan400: {
        name: 'cyan400',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#00C0CC', wcag: '#008C99' },
                    dark: { base: '#00C0CC', wcag: '#008C99' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#00C0CC', wcag: '#008C99' },
                    dark: { base: '#00C0CC', wcag: '#008C99' }
                },
                unit: 'hex'
            }
        }
    },
    cyan500: {
        name: 'cyan500',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#00888F', wcag: '#005259' },
                    dark: { base: '#00888F', wcag: '#005259' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#00888F', wcag: '#005259' },
                    dark: { base: '#00888F', wcag: '#005259' }
                },
                unit: 'hex'
            }
        }
    }
};
/**
 * Teal scale color tokens - Secondary UI elements and alternative success states
 */
exports.tealTokens = {
    teal100: {
        name: 'teal100',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#D9E8EA', wcag: '#B3D9E0' },
                    dark: { base: '#D9E8EA', wcag: '#B3D9E0' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#D9E8EA', wcag: '#B3D9E0' },
                    dark: { base: '#D9E8EA', wcag: '#B3D9E0' }
                },
                unit: 'hex'
            }
        }
    },
    teal200: {
        name: 'teal200',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#4D9BA5', wcag: '#66A6B3' },
                    dark: { base: '#4D9BA5', wcag: '#66A6B3' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#4D9BA5', wcag: '#66A6B3' },
                    dark: { base: '#4D9BA5', wcag: '#66A6B3' }
                },
                unit: 'hex'
            }
        }
    },
    teal300: {
        name: 'teal300',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#1A535C', wcag: '#2D7380' },
                    dark: { base: '#1A535C', wcag: '#2D7380' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#1A535C', wcag: '#2D7380' },
                    dark: { base: '#1A535C', wcag: '#2D7380' }
                },
                unit: 'hex'
            }
        }
    },
    teal400: {
        name: 'teal400',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#15424A', wcag: '#1F5159' },
                    dark: { base: '#15424A', wcag: '#1F5159' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#15424A', wcag: '#1F5159' },
                    dark: { base: '#15424A', wcag: '#1F5159' }
                },
                unit: 'hex'
            }
        }
    },
    teal500: {
        name: 'teal500',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#0F2E33', wcag: '#143740' },
                    dark: { base: '#0F2E33', wcag: '#143740' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#0F2E33', wcag: '#143740' },
                    dark: { base: '#0F2E33', wcag: '#143740' }
                },
                unit: 'hex'
            }
        }
    }
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
exports.shadowColorTokens = {
    shadowBlack100: {
        name: 'shadowBlack100',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#000000', wcag: '#000000' },
                    dark: { base: '#000000', wcag: '#000000' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#000000', wcag: '#000000' },
                    dark: { base: '#000000', wcag: '#000000' }
                },
                unit: 'hex'
            }
        }
    },
    shadowBlue100: {
        name: 'shadowBlue100',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#141928', wcag: '#141928' },
                    dark: { base: '#141928', wcag: '#141928' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#141928', wcag: '#141928' },
                    dark: { base: '#141928', wcag: '#141928' }
                },
                unit: 'hex'
            }
        }
    },
    shadowOrange100: {
        name: 'shadowOrange100',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#19140F', wcag: '#19140F' },
                    dark: { base: '#19140F', wcag: '#19140F' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#19140F', wcag: '#19140F' },
                    dark: { base: '#19140F', wcag: '#19140F' }
                },
                unit: 'hex'
            }
        }
    },
    shadowGray100: {
        name: 'shadowGray100',
        category: PrimitiveToken_1.TokenCategory.COLOR,
        baseValue: 0,
        familyBaseValue: exports.COLOR_BASE_VALUE,
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
                },
                unit: 'hex'
            },
            ios: {
                value: {
                    light: { base: '#0F141E', wcag: '#0F141E' },
                    dark: { base: '#0F141E', wcag: '#0F141E' }
                },
                unit: 'hex'
            },
            android: {
                value: {
                    light: { base: '#0F141E', wcag: '#0F141E' },
                    dark: { base: '#0F141E', wcag: '#0F141E' }
                },
                unit: 'hex'
            }
        }
    }
};
/**
 * Combined color tokens object containing all color families
 */
exports.colorTokens = {
    ...exports.grayTokens,
    ...exports.blackTokens,
    ...exports.whiteTokens,
    ...exports.yellowTokens,
    ...exports.orangeTokens,
    ...exports.purpleTokens,
    ...exports.violetTokens,
    ...exports.cyanTokens,
    ...exports.tealTokens,
    ...exports.shadowColorTokens
};
/**
 * Color token names for easy reference
 */
exports.colorTokenNames = Object.keys(exports.colorTokens);
/**
 * Get a specific color token by name
 */
function getColorToken(name) {
    const token = exports.colorTokens[name];
    if (!token) {
        throw new Error(`Color token "${name}" not found`);
    }
    return token;
}
/**
 * Get all color tokens as an array
 */
function getAllColorTokens() {
    return Object.values(exports.colorTokens);
}
/**
 * Get color tokens by family (gray, black, white, etc.)
 */
function getColorTokensByFamily(family) {
    return Object.values(exports.colorTokens).filter(token => token.name.startsWith(family));
}
/**
 * Get shadow color token by name
 */
function getShadowColorToken(name) {
    const token = exports.shadowColorTokens[name];
    if (!token) {
        throw new Error(`Shadow color token "${name}" not found`);
    }
    return token;
}
/**
 * Get all shadow color tokens as an array
 */
function getAllShadowColorTokens() {
    return Object.values(exports.shadowColorTokens);
}
/**
 * Shadow color token names for easy reference
 */
exports.shadowColorTokenNames = Object.keys(exports.shadowColorTokens);
/**
 * Get shadow color tokens by family (shadowBlack, shadowBlue, shadowOrange, shadowGray)
 */
function getShadowColorTokensByFamily(family) {
    return Object.values(exports.shadowColorTokens).filter(token => token.name.startsWith(family));
}
/**
 * Get systematic color families for reference
 */
exports.COLOR_FAMILIES = {
    GRAY: 'gray',
    BLACK: 'black',
    WHITE: 'white',
    YELLOW: 'yellow',
    ORANGE: 'orange',
    PURPLE: 'purple',
    VIOLET: 'violet',
    CYAN: 'cyan',
    TEAL: 'teal',
    SHADOW_BLACK: 'shadowBlack',
    SHADOW_BLUE: 'shadowBlue',
    SHADOW_ORANGE: 'shadowOrange',
    SHADOW_GRAY: 'shadowGray'
};
/**
 * Color progression scale for reference
 */
exports.COLOR_SCALE = [100, 200, 300, 400, 500];
/**
 * Mode and theme options for color resolution
 */
exports.COLOR_MODES = ['light', 'dark'];
exports.COLOR_THEMES = ['base', 'wcag'];
/**
 * Resolve color token value for specific mode and theme
 */
function resolveColorTokenValue(token, mode = 'light', theme = 'base') {
    if (token.category !== PrimitiveToken_1.TokenCategory.COLOR) {
        throw new Error(`Token "${token.name}" is not a color token`);
    }
    const colorValue = token.platforms.web.value;
    return colorValue[mode][theme];
}
//# sourceMappingURL=ColorTokens.js.map