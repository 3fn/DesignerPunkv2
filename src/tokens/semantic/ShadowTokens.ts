/**
 * Semantic Shadow Token Definitions
 * 
 * Shadow semantic tokens compose primitive shadow tokens using string references
 * to create complete shadow styles for specific use cases.
 * 
 * Each shadow token explicitly defines all shadow properties using multi-primitive structure:
 * - offsetX: Horizontal shadow offset based on light source position
 * - offsetY: Vertical shadow offset based on depth
 * - blur: Shadow blur amount based on quality and depth
 * - opacity: Shadow opacity based on quality and depth
 * - color: Shadow color based on lighting environment
 */

import { SemanticToken, SemanticCategory } from '../../types/SemanticToken';

/**
 * Shadow token interface with platform-specific properties
 */
interface ShadowToken {
  name: string;
  primitiveReferences: Record<string, string>;
  platforms: {
    web: Record<string, any>;
    ios: Record<string, any>;
    android: {
      elevation: number;
    };
  };
  category: SemanticCategory;
  context: string;
  description: string;
  _meta?: Record<string, string>;
}

/**
 * Shadow semantic tokens for common UI shadow styles
 * Following compositional architecture with explicit multi-primitive composition
 * 
 * Platform-specific properties:
 * - web/ios: Use primitive references for shadow composition
 * - android: Use elevation values (Material Design)
 */
export const shadowTokens: Record<string, ShadowToken> = {
  'shadow.container': {
    name: 'shadow.container',
    primitiveReferences: {
      offsetX: 'shadowOffsetX.000',
      offsetY: 'shadowOffsetY.100',
      blur: 'shadowBlurModerate',
      opacity: 'shadowOpacityModerate',
      color: 'shadowBlack100'
    },
    platforms: {
      web: {
        // CSS box-shadow uses primitive references
      },
      ios: {
        // SwiftUI shadow uses primitive references
      },
      android: {
        elevation: 8  // Material Design elevation (dp)
      }
    },
    category: SemanticCategory.SHADOW,
    context: 'Standard container shadow with noon lighting and moderate quality',
    description: 'Container shadow with no horizontal offset, 4px vertical offset, 12px blur, moderate opacity'
  },
  
  'shadow.navigation': {
    name: 'shadow.navigation',
    primitiveReferences: {
      offsetX: 'shadowOffsetX.000',
      offsetY: 'shadowOffsetY.100',
      blur: 'shadowBlurSoft',
      opacity: 'shadowOpacitySoft',
      color: 'shadowBlack100'
    },
    platforms: {
      web: {
        // CSS box-shadow uses primitive references
      },
      ios: {
        // SwiftUI shadow uses primitive references
      },
      android: {
        elevation: 4  // Material Design elevation (dp)
      }
    },
    category: SemanticCategory.SHADOW,
    context: 'Navigation shadow with noon lighting and soft quality',
    description: 'Navigation shadow with no horizontal offset, 2px vertical offset, 20px blur, lighter opacity'
  },
  
  'shadow.dropdown': {
    name: 'shadow.dropdown',
    primitiveReferences: {
      offsetX: 'shadowOffsetX.000',
      offsetY: 'shadowOffsetY.100',
      blur: 'shadowBlurModerate',
      opacity: 'shadowOpacityModerate',
      color: 'shadowBlack100'
    },
    platforms: {
      web: {
        // CSS box-shadow uses primitive references
      },
      ios: {
        // SwiftUI shadow uses primitive references
      },
      android: {
        elevation: 8  // Material Design elevation (dp)
      }
    },
    category: SemanticCategory.SHADOW,
    context: 'Dropdown shadow with noon lighting and moderate quality',
    description: 'Dropdown shadow with no horizontal offset, 4px vertical offset, 12px blur, moderate opacity'
  },
  
  'shadow.modal': {
    name: 'shadow.modal',
    primitiveReferences: {
      offsetX: 'shadowOffsetX.000',
      offsetY: 'shadowOffsetY.200',
      blur: 'shadowBlurDepth200',
      opacity: 'shadowOpacityDepth200',
      color: 'shadowBlack100'
    },
    platforms: {
      web: {
        // CSS box-shadow uses primitive references
      },
      ios: {
        // SwiftUI shadow uses primitive references
      },
      android: {
        elevation: 16  // Material Design elevation (dp)
      }
    },
    category: SemanticCategory.SHADOW,
    context: 'Modal shadow with noon lighting and depth 200',
    description: 'Modal shadow with no horizontal offset, 8px vertical offset, 16px blur, slightly darker opacity'
  },
  
  'shadow.toast': {
    name: 'shadow.toast',
    primitiveReferences: {
      offsetX: 'shadowOffsetX.000',
      offsetY: 'shadowOffsetY.300',
      blur: 'shadowBlurDepth300',
      opacity: 'shadowOpacityDepth300',
      color: 'shadowBlack100'
    },
    platforms: {
      web: {
        // CSS box-shadow uses primitive references
      },
      ios: {
        // SwiftUI shadow uses primitive references
      },
      android: {
        elevation: 24  // Material Design elevation (dp)
      }
    },
    category: SemanticCategory.SHADOW,
    context: 'Toast shadow with noon lighting and depth 300',
    description: 'Toast shadow with no horizontal offset, 12px vertical offset, 24px blur, darker opacity'
  },
  
  'shadow.tooltip': {
    name: 'shadow.tooltip',
    primitiveReferences: {
      offsetX: 'shadowOffsetX.000',
      offsetY: 'shadowOffsetY.300',
      blur: 'shadowBlurDepth300',
      opacity: 'shadowOpacityDepth300',
      color: 'shadowBlack100'
    },
    platforms: {
      web: {
        // CSS box-shadow uses primitive references
      },
      ios: {
        // SwiftUI shadow uses primitive references
      },
      android: {
        elevation: 24  // Material Design elevation (dp)
      }
    },
    category: SemanticCategory.SHADOW,
    context: 'Tooltip shadow with noon lighting and depth 300',
    description: 'Tooltip shadow with no horizontal offset, 12px vertical offset, 24px blur, darker opacity'
  },
  
  'shadow.fab': {
    name: 'shadow.fab',
    primitiveReferences: {
      offsetX: 'shadowOffsetX.300',
      offsetY: 'shadowOffsetY.400',
      blur: 'shadowBlurHard',
      opacity: 'shadowOpacityHard',
      color: 'shadowBlue100'
    },
    platforms: {
      web: {
        // CSS box-shadow uses primitive references
      },
      ios: {
        // SwiftUI shadow uses primitive references
      },
      android: {
        elevation: 6  // Material Design FAB elevation (dp)
      }
    },
    category: SemanticCategory.SHADOW,
    context: 'Floating action button shadow with sunset lighting and hard quality',
    description: 'Dramatic shadow with 12px right offset, 16px down offset, 4px blur, darker opacity, warm (blue-gray) tint'
  },
  
  'shadow.hover': {
    name: 'shadow.hover',
    primitiveReferences: {
      offsetX: 'shadowOffsetX.000',
      offsetY: 'shadowOffsetY.100',
      blur: 'shadowBlurSoft',
      opacity: 'shadowOpacitySoft',
      color: 'shadowBlack100'
    },
    platforms: {
      web: {
        // CSS box-shadow uses primitive references
      },
      ios: {
        // SwiftUI shadow uses primitive references
      },
      android: {
        elevation: 4  // Material Design hover elevation (dp)
      }
    },
    category: SemanticCategory.SHADOW,
    context: 'Hover state shadow with noon lighting and soft quality',
    description: 'Subtle shadow with no horizontal offset, 4px vertical offset, 20px blur, lighter opacity'
  },
  
  // Directional shadow variations demonstrating sun arc framework
  
  'shadow.sunrise': {
    name: 'shadow.sunrise',
    primitiveReferences: {
      offsetX: 'shadowOffsetX.n300',
      offsetY: 'shadowOffsetY.200',
      blur: 'shadowBlurModerate',
      opacity: 'shadowOpacityModerate',
      color: 'shadowBlue100'
    },
    platforms: {
      web: {
        // CSS box-shadow uses primitive references
      },
      ios: {
        // SwiftUI shadow uses primitive references
      },
      android: {
        elevation: 8  // Material Design elevation (dp)
      }
    },
    category: SemanticCategory.SHADOW,
    context: 'Sunrise lighting shadow with left offset and warm color',
    description: 'Shadow with -12px left offset, 8px vertical offset, 12px blur, moderate opacity, warm (blue-gray) tint for sunrise lighting'
  },
  
  'shadow.morning': {
    name: 'shadow.morning',
    primitiveReferences: {
      offsetX: 'shadowOffsetX.n150',
      offsetY: 'shadowOffsetY.200',
      blur: 'shadowBlurModerate',
      opacity: 'shadowOpacityModerate',
      color: 'shadowBlack100'
    },
    platforms: {
      web: {
        // CSS box-shadow uses primitive references
      },
      ios: {
        // SwiftUI shadow uses primitive references
      },
      android: {
        elevation: 8  // Material Design elevation (dp)
      }
    },
    category: SemanticCategory.SHADOW,
    context: 'Morning lighting shadow with medium left offset and default color',
    description: 'Shadow with -6px left offset, 8px vertical offset, 12px blur, moderate opacity, default color for morning lighting'
  },
  
  'shadow.noon': {
    name: 'shadow.noon',
    primitiveReferences: {
      offsetX: 'shadowOffsetX.000',
      offsetY: 'shadowOffsetY.200',
      blur: 'shadowBlurModerate',
      opacity: 'shadowOpacityModerate',
      color: 'shadowBlack100'
    },
    platforms: {
      web: {
        // CSS box-shadow uses primitive references
      },
      ios: {
        // SwiftUI shadow uses primitive references
      },
      android: {
        elevation: 8  // Material Design elevation (dp)
      }
    },
    category: SemanticCategory.SHADOW,
    context: 'Noon lighting shadow with no horizontal offset and default color',
    description: 'Shadow with no horizontal offset, 8px vertical offset, 12px blur, moderate opacity, default color for noon lighting'
  },
  
  // Easter egg: TW - "she lights me up" - Oct 2025
  'shadow.dusk': {
    name: 'shadow.dusk',
    primitiveReferences: {
      offsetX: 'shadowOffsetX.150',
      offsetY: 'shadowOffsetY.200',
      blur: 'shadowBlurModerate',
      opacity: 'shadowOpacityModerate',
      color: 'shadowBlack100'
    },
    platforms: {
      web: {
        // CSS box-shadow uses primitive references
      },
      ios: {
        // SwiftUI shadow uses primitive references
      },
      android: {
        elevation: 8  // Material Design elevation (dp)
      }
    },
    category: SemanticCategory.SHADOW,
    context: 'Dusk lighting shadow with medium right offset and default color',
    description: 'Shadow with 6px right offset, 8px vertical offset, 12px blur, moderate opacity, default color for dusk lighting',
    _meta: { dedicatedTo: 'Tracy Weiss', reason: 'illuminating inspiration' }
  },
  
  'shadow.sunset': {
    name: 'shadow.sunset',
    primitiveReferences: {
      offsetX: 'shadowOffsetX.300',
      offsetY: 'shadowOffsetY.200',
      blur: 'shadowBlurModerate',
      opacity: 'shadowOpacityModerate',
      color: 'shadowBlue100'
    },
    platforms: {
      web: {
        // CSS box-shadow uses primitive references
      },
      ios: {
        // SwiftUI shadow uses primitive references
      },
      android: {
        elevation: 8  // Material Design elevation (dp)
      }
    },
    category: SemanticCategory.SHADOW,
    context: 'Sunset lighting shadow with right offset and warm color',
    description: 'Shadow with 12px right offset, 8px vertical offset, 12px blur, moderate opacity, warm (blue-gray) tint for sunset lighting'
  }
};

/**
 * Array of all shadow semantic token names for iteration
 */
export const shadowTokenNames = Object.keys(shadowTokens);

/**
 * Get shadow semantic token by name
 */
export function getShadowToken(name: string): ShadowToken | undefined {
  return shadowTokens[name];
}

/**
 * Get all shadow semantic tokens as array
 */
export function getAllShadowTokens(): Array<ShadowToken> {
  return Object.values(shadowTokens);
}
