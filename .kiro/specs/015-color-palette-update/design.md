# Design Document: Color Palette & Display Font Update

**Date**: December 8, 2025  
**Spec**: 015 - Color Palette & Display Font Update  
**Status**: Design Phase  
**Dependencies**: None

---

## Overview

This design document outlines the technical approach for updating the DesignerPunk color palette and display typography. The update leverages the existing token architecture to deliver significant visual impact with minimal code changes.

### Key Design Principles

1. **Token Architecture Leverage**: Update primitive tokens; semantic tokens and components inherit automatically
2. **Single Responsibility**: Each primitive token change has one clear purpose
3. **Cross-Platform Consistency**: Same visual identity across web, iOS, and Android
4. **Accessibility First**: Color values chosen for WCAG 2.1 AA compliance
5. **Graceful Degradation**: Font stacks include fallbacks for all platforms

### Scope Summary

**Color Palette**: 7 families (down from 9) with clearer semantic roles
**Display Font**: Rajdhani for display typography, Inter for body typography
**Implementation**: 2 primitive token changes + font file additions
**Impact**: 23 semantic color tokens + 15 semantic typography tokens updated

---

## Architecture

### Token Hierarchy


```
Primitive Tokens (Base Layer)
├── Color Families
│   ├── green100-500 (NEW - electric green)
│   ├── pink100-500 (NEW - hot pink)
│   ├── violet100-500 (REMOVED)
│   └── [other families unchanged]
└── Font Families
    ├── fontFamilyDisplay → 'Rajdhani, ...' (UPDATED)
    └── fontFamilyBody → 'Inter, ...' (UPDATED to include font files)

Semantic Tokens (Context Layer)
├── Color Semantics
│   ├── color.success.* → green (was cyan)
│   ├── color.error.* → pink (was orange)
│   ├── color.warning.* → amber (was yellow)
│   ├── color.attention → yellow (NEW)
│   ├── color.tech/data → cyan (NEW)
│   └── color.secondary (REMOVED)
└── Typography Semantics
    ├── typography.h1-h6 → fontFamilyDisplay (inherits Rajdhani)
    ├── typography.label* → fontFamilyDisplay (inherits Rajdhani)
    ├── typography.button* → fontFamilyDisplay (inherits Rajdhani)
    └── typography.body* → fontFamilyBody (inherits Inter)

Components (Usage Layer)
└── Automatically inherit through semantic token references
```

### Update Strategy

**Phase 1: Primitive Tokens**
- Add green/pink color families
- Remove violet color family
- Update `fontFamilyDisplay` to Rajdhani
- Update `fontFamilyBody` to Inter (with font files)

**Phase 2: Semantic Tokens**
- Update color semantic mappings
- Typography semantics unchanged (already reference primitives)

**Phase 3: Font Assets**
- Add Inter and Rajdhani font files
- Configure platform-specific font loading

**Phase 4: Validation**
- Verify components inherit changes correctly
- Update visual regression baselines
- Remove migration-specific tests

---

## Components and Interfaces

### Primitive Token Updates


#### Color Token Interface

```typescript
// New primitive color families
export const colorTokens: Record<string, PrimitiveToken> = {
  // NEW: Electric Green family
  green100: { /* lightest green */ },
  green200: { /* light green */ },
  green300: { /* medium green */ },
  green400: { /* strong green */ },
  green500: { /* darkest green - glow */ },
  
  // NEW: Hot Pink family
  pink100: { /* lightest pink */ },
  pink200: { /* light pink */ },
  pink300: { /* medium pink */ },
  pink400: { /* strong pink */ },
  pink500: { /* darkest pink - glow */ },
  
  // REMOVED: violet100-500 (no longer needed)
  
  // Existing families unchanged
  yellow100: { /* ... */ },
  amber100: { /* ... */ },
  purple100: { /* ... */ },
  cyan100: { /* ... */ },
  teal100: { /* ... */ },
  // ... etc
};
```

#### Font Token Interface

```typescript
// Updated font family tokens
export const fontFamilyTokens: Record<string, PrimitiveToken> = {
  fontFamilyDisplay: {
    name: 'fontFamilyDisplay',
    category: TokenCategory.FONT_FAMILY,
    description: 'Display font stack for headings and prominent text',
    platforms: generateFontFamilyPlatformValues(
      'Rajdhani, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    )
  },
  
  fontFamilyBody: {
    name: 'fontFamilyBody',
    category: TokenCategory.FONT_FAMILY,
    description: 'Body font stack for general text content',
    platforms: generateFontFamilyPlatformValues(
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    )
  },
  
  // fontFamilySystem and fontFamilyMono unchanged
};
```

### Semantic Token Updates


#### Color Semantic Token Updates

```typescript
// Updated semantic color tokens
export const semanticColorTokens = {
  // SUCCESS: Cyan → Green
  'color.success.strong': { value: 'green400' },  // was cyan400
  'color.success.subtle': { value: 'green100' },  // was cyan100
  
  // ERROR: Orange → Pink (split into strong/subtle)
  'color.error.strong': { value: 'pink400' },     // was orange300
  'color.error.subtle': { value: 'pink100' },     // NEW
  
  // WARNING: Yellow → Amber
  'color.warning.strong': { value: 'amber400' },  // was yellow400
  'color.warning.subtle': { value: 'amber100' },  // was yellow100
  
  // ATTENTION: New role for yellow
  'color.attention': { value: 'yellow400' },      // NEW
  'color.highlight': { value: 'yellow300' },      // NEW
  
  // TECH/DATA: New role for cyan
  'color.tech': { value: 'cyan400' },             // NEW
  'color.data': { value: 'cyan300' },             // NEW
  
  // INFO: Unchanged (teal)
  'color.info.strong': { value: 'teal400' },      // unchanged
  'color.info.subtle': { value: 'teal100' },      // unchanged
  
  // BRAND: Unchanged (purple)
  'color.primary': { value: 'purple300' },        // unchanged
  
  // SECONDARY: Removed
  // 'color.secondary': { value: 'violet300' },   // REMOVED
  
  // GLOW: Add green and pink
  'glow.neonGreen': { value: 'green500' },        // NEW
  'glow.neonPink': { value: 'pink500' },          // NEW
  'glow.neonPurple': { value: 'purple500' },      // unchanged
  'glow.neonCyan': { value: 'cyan500' },          // unchanged
  'glow.neonYellow': { value: 'yellow500' },      // unchanged
  
  // Text & Surfaces: Unchanged
  'color.text.default': { value: 'gray300' },
  'color.text.muted': { value: 'gray200' },
  'color.text.subtle': { value: 'gray100' },
  'color.text.onPrimary': { value: 'white100' },
  'color.background': { value: 'white100' },
  'color.surface': { value: 'white200' },
  'color.border': { value: 'gray100' }
};
```

**Total Semantic Color Tokens**: 23 (was 19)
- **Added**: 7 new tokens (error.subtle, attention, highlight, tech, data, glow.neonGreen, glow.neonPink)
- **Removed**: 1 token (color.secondary)
- **Updated**: 6 tokens (success.*, error.strong, warning.*)

#### Typography Semantic Tokens

**No changes needed** - all typography tokens already reference `fontFamilyDisplay` or `fontFamilyBody`:

```typescript
// These automatically inherit Rajdhani when fontFamilyDisplay is updated
export const semanticTypographyTokens = {
  'typography.h1': { fontFamily: 'fontFamilyDisplay', /* ... */ },
  'typography.h2': { fontFamily: 'fontFamilyDisplay', /* ... */ },
  'typography.labelMd': { fontFamily: 'fontFamilyDisplay', /* ... */ },
  'typography.buttonMd': { fontFamily: 'fontFamilyDisplay', /* ... */ },
  
  // These automatically inherit Inter when fontFamilyBody is updated
  'typography.body': { fontFamily: 'fontFamilyBody', /* ... */ },
  'typography.bodyLg': { fontFamily: 'fontFamilyBody', /* ... */ },
};
```

**Typography Token Impact**: 15 tokens inherit Rajdhani, 0 code changes needed

---

## Data Models

### Color Token Data Model


```typescript
// Primitive color token structure
interface PrimitiveColorToken {
  name: string;                    // e.g., 'green400'
  category: TokenCategory.COLOR;
  description: string;
  platforms: {
    web: string;                   // Hex value: '#00FF88'
    ios: string;                   // Hex value: '#00FF88'
    android: string;               // Hex value: '#00FF88'
  };
}

// Example: Electric Green family (all 5 variants)
const green100: PrimitiveColorToken = {
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
        light: { base: '#E6FFF5', wcag: '#D4FFE8' },
        dark: { base: '#E6FFF5', wcag: '#D4FFE8' }
      } as ColorTokenValue,
      unit: 'hex' as const
    },
    ios: {
      value: {
        light: { base: '#E6FFF5', wcag: '#D4FFE8' },
        dark: { base: '#E6FFF5', wcag: '#D4FFE8' }
      } as ColorTokenValue,
      unit: 'hex' as const
    },
    android: {
      value: {
        light: { base: '#E6FFF5', wcag: '#D4FFE8' },
        dark: { base: '#E6FFF5', wcag: '#D4FFE8' }
      } as ColorTokenValue,
      unit: 'hex' as const
    }
  }
};

const green200: PrimitiveColorToken = {
  name: 'green200',
  category: TokenCategory.COLOR,
  baseValue: 0,
  familyBaseValue: COLOR_BASE_VALUE,
  description: 'Medium-light electric green - success highlights',
  mathematicalRelationship: 'Systematic green scale progression - medium-light',
  baselineGridAlignment: false,
  isStrategicFlexibility: false,
  isPrecisionTargeted: false,
  platforms: {
    web: {
      value: {
        light: { base: '#80FFBB', wcag: '#66FFA8' },
        dark: { base: '#80FFBB', wcag: '#66FFA8' }
      } as ColorTokenValue,
      unit: 'hex' as const
    },
    ios: {
      value: {
        light: { base: '#80FFBB', wcag: '#66FFA8' },
        dark: { base: '#80FFBB', wcag: '#66FFA8' }
      } as ColorTokenValue,
      unit: 'hex' as const
    },
    android: {
      value: {
        light: { base: '#80FFBB', wcag: '#66FFA8' },
        dark: { base: '#80FFBB', wcag: '#66FFA8' }
      } as ColorTokenValue,
      unit: 'hex' as const
    }
  }
};

const green300: PrimitiveColorToken = {
  name: 'green300',
  category: TokenCategory.COLOR,
  baseValue: 0,
  familyBaseValue: COLOR_BASE_VALUE,
  description: 'Bright electric green - success accents',
  mathematicalRelationship: 'Systematic green scale progression - bright',
  baselineGridAlignment: false,
  isStrategicFlexibility: false,
  isPrecisionTargeted: false,
  platforms: {
    web: {
      value: {
        light: { base: '#33FF99', wcag: '#1AE680' },
        dark: { base: '#33FF99', wcag: '#1AE680' }
      } as ColorTokenValue,
      unit: 'hex' as const
    },
    ios: {
      value: {
        light: { base: '#33FF99', wcag: '#1AE680' },
        dark: { base: '#33FF99', wcag: '#1AE680' }
      } as ColorTokenValue,
      unit: 'hex' as const
    },
    android: {
      value: {
        light: { base: '#33FF99', wcag: '#1AE680' },
        dark: { base: '#33FF99', wcag: '#1AE680' }
      } as ColorTokenValue,
      unit: 'hex' as const
    }
  }
};

const green400: PrimitiveColorToken = {
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
        light: { base: '#00FF88', wcag: '#00CC6E' },
        dark: { base: '#00FF88', wcag: '#00CC6E' }
      } as ColorTokenValue,
      unit: 'hex' as const
    },
    ios: {
      value: {
        light: { base: '#00FF88', wcag: '#00CC6E' },
        dark: { base: '#00FF88', wcag: '#00CC6E' }
      } as ColorTokenValue,
      unit: 'hex' as const
    },
    android: {
      value: {
        light: { base: '#00FF88', wcag: '#00CC6E' },
        dark: { base: '#00FF88', wcag: '#00CC6E' }
      } as ColorTokenValue,
      unit: 'hex' as const
    }
  }
};

const green500: PrimitiveColorToken = {
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
        light: { base: '#00CC6E', wcag: '#009954' },
        dark: { base: '#00CC6E', wcag: '#009954' }
      } as ColorTokenValue,
      unit: 'hex' as const
    },
    ios: {
      value: {
        light: { base: '#00CC6E', wcag: '#009954' },
        dark: { base: '#00CC6E', wcag: '#009954' }
      } as ColorTokenValue,
      unit: 'hex' as const
    },
    android: {
      value: {
        light: { base: '#00CC6E', wcag: '#009954' },
        dark: { base: '#00CC6E', wcag: '#009954' }
      } as ColorTokenValue,
      unit: 'hex' as const
    }
  }
};

// Example: Hot Pink family (all 5 variants)
const pink100: PrimitiveColorToken = {
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
        light: { base: '#FFE6F5', wcag: '#FFD4ED' },
        dark: { base: '#FFE6F5', wcag: '#FFD4ED' }
      } as ColorTokenValue,
      unit: 'hex' as const
    },
    ios: {
      value: {
        light: { base: '#FFE6F5', wcag: '#FFD4ED' },
        dark: { base: '#FFE6F5', wcag: '#FFD4ED' }
      } as ColorTokenValue,
      unit: 'hex' as const
    },
    android: {
      value: {
        light: { base: '#FFE6F5', wcag: '#FFD4ED' },
        dark: { base: '#FFE6F5', wcag: '#FFD4ED' }
      } as ColorTokenValue,
      unit: 'hex' as const
    }
  }
};

const pink200: PrimitiveColorToken = {
  name: 'pink200',
  category: TokenCategory.COLOR,
  baseValue: 0,
  familyBaseValue: COLOR_BASE_VALUE,
  description: 'Medium-light hot pink - error highlights',
  mathematicalRelationship: 'Systematic pink scale progression - medium-light',
  baselineGridAlignment: false,
  isStrategicFlexibility: false,
  isPrecisionTargeted: false,
  platforms: {
    web: {
      value: {
        light: { base: '#FFB3DB', wcag: '#FF99CF' },
        dark: { base: '#FFB3DB', wcag: '#FF99CF' }
      } as ColorTokenValue,
      unit: 'hex' as const
    },
    ios: {
      value: {
        light: { base: '#FFB3DB', wcag: '#FF99CF' },
        dark: { base: '#FFB3DB', wcag: '#FF99CF' }
      } as ColorTokenValue,
      unit: 'hex' as const
    },
    android: {
      value: {
        light: { base: '#FFB3DB', wcag: '#FF99CF' },
        dark: { base: '#FFB3DB', wcag: '#FF99CF' }
      } as ColorTokenValue,
      unit: 'hex' as const
    }
  }
};

const pink300: PrimitiveColorToken = {
  name: 'pink300',
  category: TokenCategory.COLOR,
  baseValue: 0,
  familyBaseValue: COLOR_BASE_VALUE,
  description: 'Bright hot pink - error accents',
  mathematicalRelationship: 'Systematic pink scale progression - bright',
  baselineGridAlignment: false,
  isStrategicFlexibility: false,
  isPrecisionTargeted: false,
  platforms: {
    web: {
      value: {
        light: { base: '#FF66B8', wcag: '#E64DA3' },
        dark: { base: '#FF66B8', wcag: '#E64DA3' }
      } as ColorTokenValue,
      unit: 'hex' as const
    },
    ios: {
      value: {
        light: { base: '#FF66B8', wcag: '#E64DA3' },
        dark: { base: '#FF66B8', wcag: '#E64DA3' }
      } as ColorTokenValue,
      unit: 'hex' as const
    },
    android: {
      value: {
        light: { base: '#FF66B8', wcag: '#E64DA3' },
        dark: { base: '#FF66B8', wcag: '#E64DA3' }
      } as ColorTokenValue,
      unit: 'hex' as const
    }
  }
};

const pink400: PrimitiveColorToken = {
  name: 'pink400',
  category: TokenCategory.COLOR,
  baseValue: 0,
  familyBaseValue: COLOR_BASE_VALUE,
  description: 'Strong hot pink - primary error color',
  mathematicalRelationship: 'Systematic pink scale progression - strong',
  baselineGridAlignment: false,
  isStrategicFlexibility: false,
  isPrecisionTargeted: false,
  platforms: {
    web: {
      value: {
        light: { base: '#FF1493', wcag: '#CC1075' },
        dark: { base: '#FF1493', wcag: '#CC1075' }
      } as ColorTokenValue,
      unit: 'hex' as const
    },
    ios: {
      value: {
        light: { base: '#FF1493', wcag: '#CC1075' },
        dark: { base: '#FF1493', wcag: '#CC1075' }
      } as ColorTokenValue,
      unit: 'hex' as const
    },
    android: {
      value: {
        light: { base: '#FF1493', wcag: '#CC1075' },
        dark: { base: '#FF1493', wcag: '#CC1075' }
      } as ColorTokenValue,
      unit: 'hex' as const
    }
  }
};

const pink500: PrimitiveColorToken = {
  name: 'pink500',
  category: TokenCategory.COLOR,
  baseValue: 0,
  familyBaseValue: COLOR_BASE_VALUE,
  description: 'Darkest hot pink - neon glow effect',
  mathematicalRelationship: 'Systematic pink scale progression - darkest/glow',
  baselineGridAlignment: false,
  isStrategicFlexibility: false,
  isPrecisionTargeted: false,
  platforms: {
    web: {
      value: {
        light: { base: '#CC1075', wcag: '#990C57' },
        dark: { base: '#CC1075', wcag: '#990C57' }
      } as ColorTokenValue,
      unit: 'hex' as const
    },
    ios: {
      value: {
        light: { base: '#CC1075', wcag: '#990C57' },
        dark: { base: '#CC1075', wcag: '#990C57' }
      } as ColorTokenValue,
      unit: 'hex' as const
    },
    android: {
      value: {
        light: { base: '#CC1075', wcag: '#990C57' },
        dark: { base: '#CC1075', wcag: '#990C57' }
      } as ColorTokenValue,
      unit: 'hex' as const
    }
  }
};
```

### Font Token Data Model

```typescript
// Font family token structure
interface FontFamilyToken {
  name: string;                    // e.g., 'fontFamilyDisplay'
  category: TokenCategory.FONT_FAMILY;
  description: string;
  platforms: {
    web: string;                   // Font stack string
    ios: string;                   // Font stack string
    android: string;               // Font stack string
  };
}

// Example: Display font (Rajdhani)
const fontFamilyDisplay: FontFamilyToken = {
  name: 'fontFamilyDisplay',
  category: TokenCategory.FONT_FAMILY,
  description: 'Display font stack for headings and prominent text',
  platforms: {
    web: 'Rajdhani, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    ios: 'Rajdhani, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    android: 'Rajdhani, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  }
};

// Example: Body font (Inter)
const fontFamilyBody: FontFamilyToken = {
  name: 'fontFamilyBody',
  category: TokenCategory.FONT_FAMILY,
  description: 'Body font stack for general text content',
  platforms: {
    web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    ios: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    android: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  }
};
```

### Semantic Token Data Model

```typescript
// Semantic color token structure
interface SemanticColorToken {
  name: string;                    // e.g., 'color.success.strong'
  value: string;                   // Reference to primitive: 'green400'
  description: string;
}

// Example: Success semantic tokens
const successStrong: SemanticColorToken = {
  name: 'color.success.strong',
  value: 'green400',
  description: 'Strong success color for primary success states'
};

const successSubtle: SemanticColorToken = {
  name: 'color.success.subtle',
  value: 'green100',
  description: 'Subtle success color for success backgrounds'
};
```

### Font Asset Data Model

```typescript
// Font file structure
interface FontAsset {
  family: 'inter' | 'rajdhani';
  weight: 400 | 500 | 600 | 700;
  formats: {
    ttf: string;                   // Path to TTF file
    woff: string;                  // Path to WOFF file
    woff2: string;                 // Path to WOFF2 file
  };
}

// Example: Rajdhani Medium weight
const rajdhaniMedium: FontAsset = {
  family: 'rajdhani',
  weight: 500,
  formats: {
    ttf: 'src/assets/fonts/rajdhani/Rajdhani-Medium.ttf',
    woff: 'src/assets/fonts/rajdhani/Rajdhani-Medium.woff',
    woff2: 'src/assets/fonts/rajdhani/Rajdhani-Medium.woff2'
  }
};
```

---

## Error Handling

### Color Token Errors

**Missing Primitive Token Reference**:
```typescript
// Semantic token references non-existent primitive
'color.success.strong': { value: 'violet400' }  // ERROR: violet removed

// Error handling:
- Build system validates all semantic token references
- Throws TokenReferenceError if primitive doesn't exist
- Provides clear error message with available alternatives
```

**Invalid Color Value**:
```typescript
// Primitive token with invalid hex value
green400: { platforms: { web: '#GGGGGG' } }  // ERROR: Invalid hex

// Error handling:
- Validation during token definition
- Throws TokenGenerationError with specific validation failure
- Suggests correct hex format
```

### Font Loading Errors

**Web Font Loading Failure**:
```typescript
// Font fails to load from server
@font-face {
  font-family: 'Rajdhani';
  src: url('/assets/fonts/rajdhani/Rajdhani-Medium.woff2') format('woff2');
  font-display: swap;  // Prevents FOIT, shows fallback immediately
}

// Error handling:
- font-display: swap ensures text remains visible
- Fallback fonts in stack provide graceful degradation
- Browser console logs font loading errors
```

**iOS Font Bundle Missing**:
```swift
// Custom font not found in bundle
let font = UIFont(name: "Rajdhani", size: 24)  // Returns nil if not found

// Error handling:
- Check font availability before use
- Fall back to SF Pro Display if Rajdhani unavailable
- Log warning for debugging
```

**Android Font Resource Missing**:
```kotlin
// Font resource not found
val fontFamily = FontFamily(Font(R.font.rajdhani_medium))  // Crashes if missing

// Error handling:
- Validate font resources exist at build time
- Provide clear error message if font missing
- Fall back to Roboto if font unavailable
```

### Migration Errors

**Component Using Removed Token**:
```typescript
// Component references removed color.secondary
const buttonStyle = {
  background: tokens.color.secondary  // ERROR: Token removed
};

// Error handling:
- Build system detects removed token usage
- Provides migration guidance (use purple700 directly)
- Lists all components using removed token
```

**Visual Regression Failure**:
```typescript
// Component appearance changed unexpectedly
// Expected: Green success button
// Actual: Cyan success button (old color)

// Error handling:
- Visual regression tests catch unexpected changes
- Provide before/after screenshots for comparison
- Require explicit baseline update to proceed
```

---

## Testing Strategy

### Unit Testing

**Primitive Token Tests**:
```typescript
describe('Green Color Family', () => {
  test('green400 has correct hex value', () => {
    expect(colorTokens.green400.platforms.web).toBe('#00FF88');
  });
  
  test('green family has 5 variants', () => {
    const greenTokens = Object.keys(colorTokens).filter(k => k.startsWith('green'));
    expect(greenTokens).toHaveLength(5);
  });
  
  test('violet family is removed', () => {
    const violetTokens = Object.keys(colorTokens).filter(k => k.startsWith('violet'));
    expect(violetTokens).toHaveLength(0);
  });
});

describe('Font Family Tokens', () => {
  test('fontFamilyDisplay references Rajdhani', () => {
    expect(fontFamilyTokens.fontFamilyDisplay.platforms.web).toContain('Rajdhani');
  });
  
  test('fontFamilyBody references Inter', () => {
    expect(fontFamilyTokens.fontFamilyBody.platforms.web).toContain('Inter');
  });
});
```

**Semantic Token Tests**:
```typescript
describe('Semantic Color Tokens', () => {
  test('color.success.strong references green400', () => {
    expect(semanticColorTokens['color.success.strong'].value).toBe('green400');
  });
  
  test('color.error.strong references pink400', () => {
    expect(semanticColorTokens['color.error.strong'].value).toBe('pink400');
  });
  
  test('color.warning.strong references amber400', () => {
    expect(semanticColorTokens['color.warning.strong'].value).toBe('amber400');
  });
  
  test('color.secondary is removed', () => {
    expect(semanticColorTokens['color.secondary']).toBeUndefined();
  });
});
```

### Integration Testing

**Token Generation Tests**:
```typescript
describe('Cross-Platform Token Generation', () => {
  test('generates web CSS with green and pink families', () => {
    const webTokens = generateWebTokens();
    expect(webTokens).toContain('--green-400: #00FF88');
    expect(webTokens).toContain('--pink-400: #FF1493');
    expect(webTokens).not.toContain('--violet-');
  });
  
  test('generates iOS Swift with Rajdhani font', () => {
    const iosTokens = generateiOSTokens();
    expect(iosTokens).toContain('let fontFamilyDisplay = "Rajdhani"');
  });
  
  test('generates Android Kotlin with green and pink colors', () => {
    const androidTokens = generateAndroidTokens();
    expect(androidTokens).toContain('val green400 = Color(0xFF00FF88)');
    expect(androidTokens).toContain('val pink400 = Color(0xFFFF1493)');
  });
});
```

**Component Inheritance Tests**:
```typescript
describe('Component Token Inheritance', () => {
  test('ButtonCTA inherits Rajdhani from typography.buttonMd', () => {
    const button = new ButtonCTA({ label: 'Test' });
    expect(button.getFontFamily()).toBe('Rajdhani');
  });
  
  test('TextInputField success state uses green', () => {
    const input = new TextInputField({ state: 'success' });
    expect(input.getBorderColor()).toBe('#00FF88');  // green400
  });
});
```

### Accessibility Testing

**WCAG Contrast Tests**:
```typescript
describe('Color Accessibility', () => {
  test('green400 on white meets WCAG AA (4.5:1)', () => {
    const contrast = calculateContrast('#00FF88', '#FFFFFF');
    expect(contrast).toBeGreaterThanOrEqual(4.5);
  });
  
  test('pink400 on white meets WCAG AA (4.5:1)', () => {
    const contrast = calculateContrast('#FF1493', '#FFFFFF');
    expect(contrast).toBeGreaterThanOrEqual(4.5);
  });
  
  test('amber400 on white meets WCAG AA (4.5:1)', () => {
    const contrast = calculateContrast('#FFA500', '#FFFFFF');
    expect(contrast).toBeGreaterThanOrEqual(4.5);
  });
});
```

**Font Readability Tests**:
```typescript
describe('Typography Accessibility', () => {
  test('Rajdhani maintains readability at heading sizes', () => {
    // Manual validation: Rajdhani tested at 24px, 32px, 48px
    // Confirmed: Clear letterforms, good x-height, readable at all sizes
  });
  
  test('Inter maintains readability at body sizes', () => {
    // Manual validation: Inter tested at 14px, 16px, 18px
    // Confirmed: Excellent readability, clear at small sizes
  });
});
```

### Visual Regression Testing

**Component Visual Tests**:
```typescript
describe('Visual Regression', () => {
  test('ButtonCTA with success variant shows green', async () => {
    const screenshot = await captureComponent(
      <ButtonCTA variant="success" label="Success" />
    );
    expect(screenshot).toMatchBaseline('button-success-green.png');
  });
  
  test('TextInputField error state shows pink', async () => {
    const screenshot = await captureComponent(
      <TextInputField state="error" helperText="Error message" />
    );
    expect(screenshot).toMatchBaseline('input-error-pink.png');
  });
  
  test('Heading uses Rajdhani font', async () => {
    const screenshot = await captureComponent(
      <h1>Heading Text</h1>
    );
    expect(screenshot).toMatchBaseline('heading-rajdhani.png');
  });
});
```

**Migration Validation Tests**:
```typescript
describe('Migration Validation', () => {
  test('all components using success colors render correctly', async () => {
    const components = [
      <ButtonCTA variant="success" />,
      <TextInputField state="success" />,
      <StatusBadge status="success" />
    ];
    
    for (const component of components) {
      const screenshot = await captureComponent(component);
      expect(screenshot).toMatchBaseline();
    }
  });
  
  test('no components reference removed color.secondary', () => {
    const componentFiles = getAllComponentFiles();
    for (const file of componentFiles) {
      const content = readFileSync(file, 'utf-8');
      expect(content).not.toContain('color.secondary');
    }
  });
});
```

### Font Loading Tests

**Web Font Loading**:
```typescript
describe('Web Font Loading', () => {
  test('Rajdhani fonts load successfully', async () => {
    await page.goto('http://localhost:3000');
    const fonts = await page.evaluate(() => document.fonts.check('16px Rajdhani'));
    expect(fonts).toBe(true);
  });
  
  test('Inter fonts load successfully', async () => {
    await page.goto('http://localhost:3000');
    const fonts = await page.evaluate(() => document.fonts.check('16px Inter'));
    expect(fonts).toBe(true);
  });
  
  test('fallback fonts work when custom fonts unavailable', async () => {
    // Block font loading
    await page.setRequestInterception(true);
    page.on('request', req => {
      if (req.url().includes('/fonts/')) req.abort();
      else req.continue();
    });
    
    await page.goto('http://localhost:3000');
    const computedFont = await page.evaluate(() => 
      getComputedStyle(document.querySelector('h1')).fontFamily
    );
    expect(computedFont).toContain('system');  // Fallback font
  });
});
```

**iOS Font Loading**:
```swift
// Manual test: Verify custom fonts load in iOS app
func testCustomFontsAvailable() {
    XCTAssertNotNil(UIFont(name: "Rajdhani-Medium", size: 24))
    XCTAssertNotNil(UIFont(name: "Inter-Regular", size: 16))
}
```

**Android Font Loading**:
```kotlin
// Manual test: Verify custom fonts load in Android app
@Test
fun testCustomFontsAvailable() {
    val rajdhaniFamily = FontFamily(Font(R.font.rajdhani_medium))
    val interFamily = FontFamily(Font(R.font.inter_regular))
    
    assertNotNull(rajdhaniFamily)
    assertNotNull(interFamily)
}
```

---

## Design Decisions

### Decision 1: Color Palette Simplification (9 → 7 Families)

**Options Considered**:
1. **Keep all 9 families** - Maintain violet and current semantic mappings
2. **Remove violet, add green/pink** - Clearer semantic roles (chosen)
3. **Remove violet only** - Simplify without adding new colors
4. **Complete redesign** - Start from scratch with new palette

**Decision**: Remove violet, add green/pink (Option 2)

**Rationale**:
- **Violet redundancy**: Violet served as "purple but less" with unclear functional purpose
- **Success clarity**: Green is universally recognized for success (cyan is ambiguous)
- **Error urgency**: Pink provides stronger visual urgency than orange for errors
- **Semantic precision**: Each color has one clear job, enabling reliable AI collaboration
- **Accessibility**: Amber for warnings improves WCAG compliance over yellow

**Trade-offs**:
- ✅ **Gained**: Clearer semantic mapping, better accessibility, universal color recognition
- ❌ **Lost**: Violet as secondary brand color option
- ⚠️ **Risk**: Visual breaking changes require component migration and user communication

**Counter-Arguments**:
- **Argument**: "Violet provides sophisticated depth for secondary brand elements"
- **Response**: Purple variants (purple700) can serve this role without separate family
- **Argument**: "Cyan for success is established in tech/digital contexts"
- **Response**: Green is more universally recognized; cyan better suited for tech/data role

### Decision 2: Yellow Role Assignment (Attention/Highlight)

**Options Considered**:
1. **Remove yellow entirely** - Simplify to 6 families
2. **Keep yellow for warnings** - Maintain current usage
3. **Yellow for attention/highlight** - Non-status promotional elements (chosen)
4. **Yellow for data visualization** - Technical/analytical contexts

**Decision**: Yellow for attention/highlight (Option 3)

**Rationale**:
- **Distinct from status**: Yellow draws attention without implying success/error/warning/info
- **Promotional use cases**: "New" badges, featured content, highlights without status meaning
- **Color theory balance**: Maintains split-complementary relationship (purple/yellow/green)
- **Accessibility consideration**: Amber better for warnings (better contrast than yellow)
- **Clear functional purpose**: Doesn't overlap with other color roles

**Trade-offs**:
- ✅ **Gained**: Clear non-status attention color, maintains color theory balance
- ❌ **Lost**: Yellow as warning color (moved to amber)
- ⚠️ **Risk**: Developers might confuse attention with warning (requires clear documentation)

**Counter-Arguments**:
- **Argument**: "Yellow is traditionally used for warnings"
- **Response**: Amber provides better accessibility for warnings; yellow better for non-critical attention
- **Argument**: "We don't need a separate attention color"
- **Response**: Promotional moments need color without status implications; yellow fills this gap

### Decision 3: Display Font Selection (Rajdhani)

**Options Considered**:
1. **Keep Inter for display** - No change, maintain consistency
2. **Use Rajdhani for display** - Distinct display font (chosen)
3. **Use Orbitron** - More aggressive cyberpunk aesthetic
4. **Use custom font** - Commission unique typeface

**Decision**: Rajdhani for display (Option 2)

**Rationale**:
- **Visual hierarchy**: Distinct display font creates clear separation from body text
- **Cyberpunk alignment**: Geometric, tech-forward aesthetic matches DesignerPunk identity
- **Readability**: Excellent at display sizes (headings, labels, buttons)
- **Weight availability**: 5 weights (300-700) provide flexibility
- **Open source**: Free, no licensing concerns
- **Cross-platform**: Works consistently across web/iOS/Android

**Trade-offs**:
- ✅ **Gained**: Strong visual hierarchy, brand differentiation, cyberpunk aesthetic
- ❌ **Lost**: Consistency between display and body fonts
- ⚠️ **Risk**: Font loading performance, fallback font differences

**Counter-Arguments**:
- **Argument**: "Using same font for display and body is simpler"
- **Response**: Visual hierarchy benefits outweigh simplicity; token system makes change trivial
- **Argument**: "Orbitron is more cyberpunk"
- **Response**: Orbitron is too aggressive for UI elements; Rajdhani balances aesthetic with usability
- **Argument**: "Custom font would be more unique"
- **Response**: Cost and timeline don't justify marginal uniqueness gain; Rajdhani is distinctive enough

### Decision 4: Font File Storage Location

**Options Considered**:
1. **Store in public/assets/** - Web-focused approach
2. **Store in src/assets/fonts/** - Source-level assets (chosen)
3. **Use CDN** - External font hosting
4. **System fonts only** - No custom fonts

**Decision**: Store in src/assets/fonts/ (Option 2)

**Rationale**:
- **True Native Architecture**: Fonts are part of design system source, not just web assets
- **Cross-platform**: iOS/Android need fonts bundled in app, not served from public directory
- **Token system alignment**: Assets that are part of token system should live in src/
- **Build system control**: Bundler can optimize font loading (subset, compress, etc.)
- **Version control**: Font files tracked in git ensure consistency across environments

**Trade-offs**:
- ✅ **Gained**: Cross-platform consistency, build system control, version tracking
- ❌ **Lost**: Simplicity of public directory approach
- ⚠️ **Risk**: Larger repository size with binary font files

**Counter-Arguments**:
- **Argument**: "Public directory is standard for web assets"
- **Response**: This is a cross-platform design system, not just web; src/ is appropriate
- **Argument**: "CDN would be faster for web"
- **Response**: Self-hosting provides control and eliminates external dependencies

### Decision 5: Secondary Brand Token Removal

**Options Considered**:
1. **Map to purple700** - Darker purple for secondary
2. **Map to teal300** - Distinct from primary
3. **Remove entirely** - Simplify to single brand color (chosen)
4. **Keep violet** - Maintain separate secondary family

**Decision**: Remove color.secondary entirely (Option 3)

**Rationale**:
- **Industry standard**: Most design systems use single primary brand color
- **Reduced complexity**: Fewer semantic tokens, clearer decision-making
- **Direct reference**: Components can use purple variants directly when needed
- **Token simplification**: Removes ambiguity about when to use primary vs secondary
- **Migration clarity**: Clear path forward (use purple700 directly)

**Trade-offs**:
- ✅ **Gained**: Simpler token vocabulary, clearer brand color usage
- ❌ **Lost**: Semantic abstraction for secondary brand actions
- ⚠️ **Risk**: Components using color.secondary need migration

**Counter-Arguments**:
- **Argument**: "Secondary brand color is useful for CTAs"
- **Response**: Components can reference purple700 directly; semantic abstraction not needed
- **Argument**: "Removing tokens is a breaking change"
- **Response**: True, but simplification justifies the migration effort

### Decision 6: Info Token Assignment (Teal)

**Options Considered**:
1. **Keep teal for info** - Maintain current usage (chosen)
2. **Migrate to cyan** - Consolidate tech/info roles
3. **Remove info tokens** - Simplify status colors
4. **Use blue** - Traditional info color

**Decision**: Keep teal for info (Option 1)

**Rationale**:
- **Distinct quality**: Teal provides calming, grounding quality for informational states
- **Separation from tech**: Cyan's energetic quality better suited for tech/data contexts
- **Established usage**: Teal already used for info; no migration needed
- **Color theory**: Teal provides analogous harmony with green (success)
- **Accessibility**: Teal values meet WCAG AA contrast requirements

**Trade-offs**:
- ✅ **Gained**: Clear separation between info (teal) and tech/data (cyan)
- ❌ **Lost**: Potential simplification by consolidating teal/cyan
- ⚠️ **Risk**: None - maintaining current usage

**Counter-Arguments**:
- **Argument**: "Cyan could serve both info and tech roles"
- **Response**: Distinct qualities (calming vs energetic) justify separate colors

### Decision 7: Combined Update Strategy

**Options Considered**:
1. **Color update only** - Defer font update to separate release
2. **Font update only** - Defer color update to separate release
3. **Combined update** - Both changes in one release (chosen)
4. **Phased rollout** - Color first, then font

**Decision**: Combined update (Option 3)

**Rationale**:
- **Single migration**: Components update once for both changes
- **Cohesive refresh**: Color and typography changes feel intentional together
- **Reduced disruption**: One visual regression cycle instead of two
- **Brand evolution**: Complete visual identity refresh in one release
- **Token architecture**: Both changes leverage same token system, natural to combine

**Trade-offs**:
- ✅ **Gained**: Cohesive brand refresh, single migration effort, reduced disruption
- ❌ **Lost**: Ability to validate changes independently
- ⚠️ **Risk**: Larger scope increases complexity of visual regression testing

**Counter-Arguments**:
- **Argument**: "Separate updates would be safer"
- **Response**: Token architecture makes both changes low-risk; combined update is more efficient
- **Argument**: "Users might be overwhelmed by too many changes"
- **Response**: Changes are complementary and reinforce each other; feels like cohesive refresh

### Decision 8: Font Loading Strategy (font-display: swap)

**Options Considered**:
1. **font-display: block** - Wait for font, show invisible text (FOIT)
2. **font-display: swap** - Show fallback immediately, swap when loaded (chosen)
3. **font-display: optional** - Use fallback if font not cached
4. **font-display: fallback** - Brief block, then swap

**Decision**: font-display: swap (Option 2)

**Rationale**:
- **Accessibility**: Text remains visible immediately (no FOIT)
- **Performance**: Doesn't block rendering waiting for fonts
- **User experience**: Content readable immediately, enhanced when fonts load
- **Industry standard**: Most design systems use swap for custom fonts
- **Graceful degradation**: Fallback fonts provide acceptable experience

**Trade-offs**:
- ✅ **Gained**: Immediate text visibility, better performance, accessibility
- ❌ **Lost**: Brief layout shift when custom fonts load (FOUT)
- ⚠️ **Risk**: Layout shift can be jarring if fallback fonts differ significantly

**Counter-Arguments**:
- **Argument**: "Block would prevent layout shift"
- **Response**: Invisible text (FOIT) is worse for accessibility than brief layout shift
- **Argument**: "Optional would be more performant"
- **Response**: Swap ensures custom fonts always load; optional might never show them

---

## Implementation Notes

### Token Generation

The build system will automatically generate platform-specific token files:

**Web (CSS Custom Properties)**:
```css
:root {
  /* New green family */
  --green-100: #E6FFF5;
  --green-400: #00FF88;
  --green-500: #00FF66;
  
  /* New pink family */
  --pink-100: #FFE6F5;
  --pink-400: #FF1493;
  --pink-500: #FF0080;
  
  /* Updated font families */
  --font-family-display: 'Rajdhani', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-family-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
```

**iOS (Swift Constants)**:
```swift
// New green family
let green100 = UIColor(hex: "#E6FFF5")
let green400 = UIColor(hex: "#00FF88")
let green500 = UIColor(hex: "#00FF66")

// New pink family
let pink100 = UIColor(hex: "#FFE6F5")
let pink400 = UIColor(hex: "#FF1493")
let pink500 = UIColor(hex: "#FF0080")

// Updated font families
let fontFamilyDisplay = "Rajdhani"
let fontFamilyBody = "Inter"
```

**Android (Kotlin Constants)**:
```kotlin
// New green family
val green100 = Color(0xFFE6FFF5)
val green400 = Color(0xFF00FF88)
val green500 = Color(0xFF00FF66)

// New pink family
val pink100 = Color(0xFFFFE6F5)
val pink400 = Color(0xFFFF1493)
val pink500 = Color(0xFFFF0080)

// Updated font families
val fontFamilyDisplay = FontFamily(Font(R.font.rajdhani_medium))
val fontFamilyBody = FontFamily(Font(R.font.inter_regular))
```

### Migration Path

**Step 1: Update Primitive Tokens**
- Add green/pink color families to `ColorTokens.ts`
- Remove violet color family
- Update `fontFamilyDisplay` in `FontFamilyTokens.ts`
- Add font files to `src/assets/fonts/`

**Step 2: Update Semantic Tokens**
- Update color semantic mappings in `SemanticColorTokens.ts`
- Remove `color.secondary` token
- Typography tokens unchanged (already reference primitives)

**Step 3: Configure Font Loading**
- Web: Add @font-face declarations
- iOS: Update Info.plist with font files
- Android: Add font resources to res/font/

**Step 4: Component Migration**
- Identify components using `color.secondary`
- Update to use `purple700` directly
- No other component changes needed (automatic inheritance)

**Step 5: Visual Validation**
- Run visual regression tests
- Update baseline screenshots
- Verify accessibility (WCAG contrast)
- Remove migration-specific tests

### Breaking Changes

**Visual Breaking Changes**:
- Success colors change from cyan to green
- Error colors change from orange to pink
- Warning colors change from yellow to amber
- Display typography changes from Inter to Rajdhani
- Components using these tokens will have different appearance

**API Breaking Changes**:
- `color.secondary` token removed (use `purple700` directly)
- Violet color family removed (violet100-500 no longer available)

**Migration Required**:
- Components using `color.secondary` must be updated
- Visual regression baselines must be updated
- Documentation must be updated with new color/font examples

---

## Lessons Learned

### What Worked Well

**Token Architecture Leverage**: Updating primitive tokens and letting semantic tokens/components inherit automatically minimized code changes while delivering significant visual impact.

**Design Outline Process**: Exploring decisions in design outline before formalizing in requirements/design prevented premature commitments and enabled thorough consideration of alternatives.

**Combined Update Strategy**: Addressing color and typography together created cohesive brand refresh and reduced migration overhead.

### Challenges

**Color Semantic Clarity**: Determining yellow's role required careful consideration of color theory, accessibility, and functional purpose to avoid overlap with other status colors.

**Font Loading Complexity**: Cross-platform font configuration (web @font-face, iOS Info.plist, Android res/font) added implementation complexity beyond simple token update.

**Visual Regression Scope**: Combined update increased visual regression testing scope, requiring careful baseline management and validation.

### Future Considerations

**Font Subsetting**: Consider subsetting fonts to include only needed characters (Latin + numbers) to reduce file size and improve loading performance.

**Dark Mode**: Color palette update focused on light mode; dark mode color values will need separate consideration and testing.

**Additional Weights**: Current implementation includes 4 weights (Regular, Medium, SemiBold, Bold); consider adding Light (300) if needed for specific use cases.

**Performance Monitoring**: Monitor font loading performance in production and optimize (preload, subset) if needed.

---

*This design document provides comprehensive technical guidance for implementing the color palette and display font update while maintaining the mathematical token system's principles and cross-platform consistency.*
