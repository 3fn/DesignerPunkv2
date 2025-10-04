# Token Specifications v3.0

**Date**: October 1, 2025  
**Purpose**: Current token specifications for DesignerPunk Design System v2  
**Status**: Working Document - Current Direction  
**Organization**: working-document
**Scope**: temporary

---

## Overview

This document defines the current token specifications for the Mathematical Token System, representing the evolution from Token Architecture 2.0 to the current unitless, per-family base value approach with primitive and semantic token layers.

## Key Changes from Previous Iteration

### **Unitless Values**
- **Previous**: `space100 = 8px`
- **Current**: `space100 = 8` (unitless, platforms apply units during translation)

### **Per-Token-Family Base Values**
- **Previous**: Single 8px base for all tokens
- **Current**: Different base values per token family for mathematical precision

### **Expanded Token Categories**
- Added line height, scale density, minimum tap areas, and other accessibility tokens
- Separated primitive tokens (foundational mathematical values) from semantic tokens (contextual references)

### **Two-Layer Token Architecture**
- **Primitive Tokens**: Foundational unitless mathematical values organized by token families
- **Semantic Tokens**: Contextual tokens that reference primitives with semantic meaning (e.g., `color.warning`, `space.tight`, `typography.bodyText`)

---

## Primitive Token Family Specifications

The following specifications define **primitive tokens** - the foundational mathematical values that serve as the building blocks for semantic tokens.

### **Spacing Token Family**
**Base Value**: 8  
**Unit Application**: Web (×1px), iOS (×1pt), Android (×1dp)

```
space050 = (space100 × 0.5)
space075 = (space100 × 0.75) - Strategic Flexibility
space100 = baseValue - Base Unit
space125 = (space100 × 1.25) - Strategic Flexibility  
space150 = (space100 × 1.5)
space200 = (space100 × 2)
space250 = (space100 × 2.5) - Strategic Flexibility
space300 = (space100 × 3)
space400 = (space100 × 4)
space500 = (space100 × 5)
space600 = (space100 × 6)
```

### **Font Size Token Family**
**Base Value**: 16  
**Unit Application**: Web (÷ Base Unit = REM), iOS (×1pt), Android (×1sp)  
**Mathematical Progression**: 1.125 modular scale (musical fourth)

**Pairing Principle**: Font size tokens are exactly paired with lineHeight tokens (fontSize050↔lineHeight050, fontSize100↔lineHeight100, etc.)

**Typography Hierarchy**: 
- Body text: fontSize050-fontSize125 (13-18px) with looser line height ratios
- Headers: fontSize150-fontSize700 (20-42px) with tighter line height ratios
  - fontSize150 = H6 (smallest header)
  - fontSize200 = H5
  - fontSize300 = H4
  - fontSize400 = H3
  - fontSize500 = H2
  - fontSize600 = H1
  - fontSize700 = Display text

```
fontSize050 = 13 - (base ÷ 1.125²) rounded
fontSize075 = 14 - (base ÷ 1.125) rounded  
fontSize100 = 16 - Base Unit
fontSize125 = 18 - (base × 1.125) rounded
fontSize150 = 20 - (base × 1.125²) rounded
fontSize200 = 23 - (base × 1.125³) rounded
fontSize300 = 26 - (base × 1.125⁴) rounded
fontSize400 = 29 - (base × 1.125⁵) rounded
fontSize500 = 33 - (base × 1.125⁶) rounded
fontSize600 = 37 - (base × 1.125⁷) rounded
fontSize700 = 42 - (base × 1.125⁸) rounded
```

### **Font Family Token Family**
**Base Value**: N/A (categorical, not mathematical)  
**Unit Application**: Font family names/stacks across all platforms

```
fontFamilySystem     = Platform (Browser, iOS, Android) default font stack 
fontFamilyMono       = SF Mono, Monaco, Inconsolata, 'Roboto Mono', Consolas, 'Courier New', monospace
fontFamilyDisplay    = Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
fontFamilyBody       = Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
```

### **Font Weight Token Family**
**Base Value**: 400 (normal weight)  
**Unit Application**: Numeric font weights across all platforms

```
fontWeight100 = 100 - Thin
fontWeight200 = 200 - Extra Light
fontWeight300 = 300 - Light
fontWeight400 = 400 - Normal (Base Unit)
fontWeight500 = 500 - Medium
fontWeight600 = 600 - Semi Bold
fontWeight700 = 700 - Bold
fontWeight800 = 800 - Extra Bold
fontWeight900 = 900 - Black
```

### **Letter Spacing Token Family**
**Base Value**: 0 (normal spacing)  
**Unit Application**: Web (×1em), iOS (×1em equivalent), Android (×1em equivalent)

```
letterSpacing025 = -0.025 - Tight spacing for large text
letterSpacing050 = -0.05  - Very tight spacing for display text  
letterSpacing100 = 0      - Normal spacing (Base Unit)
letterSpacing125 = 0.025  - Loose spacing for small text
letterSpacing150 = 0.05   - Very loose spacing for emphasis
```

### **Line Height Token Family**
**Base Value**: 1.5  
**Unit Application**: Unitless ratio multiplied by font size across all platforms

**Usage Pattern**: `fontSize × lineHeight = computed line height`
**Example**: `fontSize100 (16) × lineHeight100 (1.5) = 24 units of line height`

**Pairing Principle**: Line height tokens are exactly paired with fontSize tokens (fontSize050↔lineHeight050, fontSize100↔lineHeight100, etc.)

**4pt Typography Subgrid**: Line height multipliers are calculated to align with 4pt typography subgrid when combined with their paired fontSize tokens, ensuring systematic vertical rhythm. Valid line heights: 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, etc.

**Tightening Pattern**: Multipliers decrease as font size increases - body text uses looser ratios (1.429-1.556) for readability, while headers use tighter ratios (1.143-1.4) for visual impact.

```
lineHeight050 = 1.538 - (fontSize050: 13 → 20px line height)
lineHeight075 = 1.429 - (fontSize075: 14 → 20px line height)
lineHeight100 = 1.5 - Base Unit (fontSize100: 16 → 24px line height)
lineHeight125 = 1.556 - (fontSize125: 18 → 28px line height)
lineHeight150 = 1.4 - (fontSize150: 20 → 28px line height)
lineHeight200 = 1.391 - (fontSize200: 23 → 32px line height)
lineHeight300 = 1.231 - (fontSize300: 26 → 32px line height)
lineHeight400 = 1.241 - (fontSize400: 29 → 36px line height)
lineHeight500 = 1.212 - (fontSize500: 33 → 40px line height)
lineHeight600 = 1.19 - (fontSize600: 37 → 44px line height)
lineHeight700 = 1.143 - (fontSize700: 42 → 48px line height)
```

### **Border Radius Token Family**
**Base Value**: 8  
**Unit Application**: Web (×1px), iOS (×1pt), Android (×1dp)

```
radius025 = (radius100 × 0.25)
radius050 = (radius100 × 0.5)
radius075 = (radius100 × 0.75) - Strategic Flexibility
radius100 = baseValue - Base Unit
radius150 = (radius100 × 1.5)
radius200 = (radius100 × 2)
radius300 = (radius100 × 3)
radius400 = (radius100 × 4)
```

### **Scale Density Token Family**
**Base Value**: 1.0  
**Unit Application**: Multiplier applied selectively to functional token values (not aesthetic properties)

**Selective Application**:
- **Applies to**: Spacing, typography, tap areas (functional/usability tokens)
- **Does NOT apply to**: Border radius, line height ratios (aesthetic/visual tokens)
- **Usage**: `finalValue = computedTokenValue × densityMultiplier`

```
densityCompact     = (densityDefault × 0.875)
densityDefault     = baseValue - Base Unit
densityComfortable = (densityDefault × 1.125)
```

### **Minimum Tap Area Token Family**
**Base Value**: 44  
**Unit Application**: Web (×1px), iOS (×1pt), Android (×1dp)

**Precision Targeting**: Multipliers are calculated to achieve specific accessibility targets at default scale, ensuring WCAG compliance and enhanced usability.

```
tapAreaMinimum     = baseValue - WCAG AA Minimum
tapAreaRecommended = (tapAreaMinimum × 1.091) - Enhanced Accessibility
tapAreaComfortable = (tapAreaMinimum × 1.273) - Comfortable Touch
```

### **Color Token Family**
**Base Value**: N/A (hex values, not mathematical)  
**Unit Application**: Hex color values across all platforms  
**Architecture**: Mode-aware and theme-aware token structure

**Color Palette Structure**: Scales with 100, 200, 300, 400, 500 progression for each hue. Each primitive color token supports:
- **Light/Dark Modes**: Native platform mode support
- **Original/WCAG Themes**: Original for aesthetic impact, WCAG for accessibility compliance

**Token Architecture**:
```typescript
colorToken = {
  light: {
    base: "#hex",  // Light mode, base aesthetic
    wcag: "#hex"   // Light mode, WCAG 2.2 compliant
  },
  dark: {
    base: "#hex",  // Dark mode, base aesthetic  
    wcag: "#hex"   // Dark mode, WCAG 2.2 compliant
  }
}
```

```typescript
// Gray Scale
gray100 = {
  light: { base: "#B8B6C8", wcag: "#C2C0D4" },
  dark: { base: "#B8B6C8", wcag: "#C2C0D4" }
}
gray200 = {
  light: { base: "#68658A", wcag: "#8A879E" },
  dark: { base: "#68658A", wcag: "#8A879E" }
}
gray300 = {
  light: { base: "#2D2B3E", wcag: "#4D4A5C" },
  dark: { base: "#2D2B3E", wcag: "#4D4A5C" }
}
gray400 = {
  light: { base: "#1F1D2E", wcag: "#2E2C3D" },
  dark: { base: "#1F1D2E", wcag: "#2E2C3D" }
}
gray500 = {
  light: { base: "#15131F", wcag: "#1A1826" },
  dark: { base: "#15131F", wcag: "#1A1826" }
}

// Black Scale
black100 = {
  light: { base: "#3A3A45", wcag: "#52525C" },
  dark: { base: "#3A3A45", wcag: "#52525C" }
}
black200 = {
  light: { base: "#22222A", wcag: "#2E2E38" },
  dark: { base: "#22222A", wcag: "#2E2E38" }
}
black300 = {
  light: { base: "#0A0A0F", wcag: "#0A0A0F" },
  dark: { base: "#0A0A0F", wcag: "#0A0A0F" }
}
black400 = {
  light: { base: "#06060A", wcag: "#06060A" },
  dark: { base: "#06060A", wcag: "#06060A" }
}
black500 = {
  light: { base: "#000000", wcag: "#000000" },
  dark: { base: "#000000", wcag: "#000000" }
}

// White Scale
white100 = {
  light: { base: "#FFFFFF", wcag: "#FFFFFF" },
  dark: { base: "#FFFFFF", wcag: "#FFFFFF" }
}
white200 = {
  light: { base: "#F5F5FA", wcag: "#F2F2FA" },
  dark: { base: "#F5F5FA", wcag: "#F2F2FA" }
}
white300 = {
  light: { base: "#E8E8F0", wcag: "#D9D9E6" },
  dark: { base: "#E8E8F0", wcag: "#D9D9E6" }
}
white400 = {
  light: { base: "#C5C5D5", wcag: "#A6A6BF" },
  dark: { base: "#C5C5D5", wcag: "#A6A6BF" }
}
white500 = {
  light: { base: "#9999AB", wcag: "#737388" },
  dark: { base: "#9999AB", wcag: "#737388" }
}

// Yellow Scale
yellow100 = {
  light: { base: "#FEFBCC", wcag: "#FFF9B3" },
  dark: { base: "#FEFBCC", wcag: "#FFF9B3" }
}
yellow200 = {
  light: { base: "#FCF680", wcag: "#F5E34A" },
  dark: { base: "#FCF680", wcag: "#F5E34A" }
}
yellow300 = {
  light: { base: "#F9F002", wcag: "#E6D200" },
  dark: { base: "#F9F002", wcag: "#E6D200" }
}
yellow400 = {
  light: { base: "#C7C002", wcag: "#9B8E00" },
  dark: { base: "#C7C002", wcag: "#9B8E00" }
}
yellow500 = {
  light: { base: "#8F8B01", wcag: "#5C5400" },
  dark: { base: "#8F8B01", wcag: "#5C5400" }
}

// Orange Scale
orange100 = {
  light: { base: "#FFE5DC", wcag: "#FFD4C2" },
  dark: { base: "#FFE5DC", wcag: "#FFD4C2" }
}
orange200 = {
  light: { base: "#FFB8A0", wcag: "#FFA380" },
  dark: { base: "#FFB8A0", wcag: "#FFA380" }
}
orange300 = {
  light: { base: "#FF6B35", wcag: "#E65A2A" },
  dark: { base: "#FF6B35", wcag: "#E65A2A" }
}
orange400 = {
  light: { base: "#CC5529", wcag: "#B34621" },
  dark: { base: "#CC5529", wcag: "#B34621" }
}
orange500 = {
  light: { base: "#8F3C1D", wcag: "#6B2A14" },
  dark: { base: "#8F3C1D", wcag: "#6B2A14" }
}

// Purple Scale - Primary
purple100 = {
  light: { base: "#F3E0FF", wcag: "#F5D4FF" },
  dark: { base: "#F3E0FF", wcag: "#F5D4FF" }
}
purple200 = {
  light: { base: "#D98AFF", wcag: "#D580FF" },
  dark: { base: "#D98AFF", wcag: "#D580FF" }
}
purple300 = {
  light: { base: "#B026FF", wcag: "#A928E6" },
  dark: { base: "#B026FF", wcag: "#A928E6" }
}
purple400 = {
  light: { base: "#8D1ECC", wcag: "#7A1DA6" },
  dark: { base: "#8D1ECC", wcag: "#7A1DA6" }
}
purple500 = {
  light: { base: "#63158F", wcag: "#4A1166" },
  dark: { base: "#63158F", wcag: "#4A1166" }
}

// Violet Scale
violet100 = {
  light: { base: "#E8DDF3", wcag: "#DCC8F0" },
  dark: { base: "#E8DDF3", wcag: "#DCC8F0" }
}
violet200 = {
  light: { base: "#9A6BC2", wcag: "#A87DD9" },
  dark: { base: "#9A6BC2", wcag: "#A87DD9" }
}
violet300 = {
  light: { base: "#5B2C91", wcag: "#7A48B3" },
  dark: { base: "#5B2C91", wcag: "#7A48B3" }
}
violet400 = {
  light: { base: "#482374", wcag: "#5A3380" },
  dark: { base: "#482374", wcag: "#5A3380" }
}
violet500 = {
  light: { base: "#331951", wcag: "#3A2159" },
  dark: { base: "#331951", wcag: "#3A2159" }
}

// Cyan Scale
cyan100 = {
  light: { base: "#CCFBFF", wcag: "#B3F5FF" },
  dark: { base: "#CCFBFF", wcag: "#B3F5FF" }
}
cyan200 = {
  light: { base: "#80F6FF", wcag: "#66E5F5" },
  dark: { base: "#80F6FF", wcag: "#66E5F5" }
}
cyan300 = {
  light: { base: "#00F0FF", wcag: "#00C5D9" },
  dark: { base: "#00F0FF", wcag: "#00C5D9" }
}
cyan400 = {
  light: { base: "#00C0CC", wcag: "#008C99" },
  dark: { base: "#00C0CC", wcag: "#008C99" }
}
cyan500 = {
  light: { base: "#00888F", wcag: "#005259" },
  dark: { base: "#00888F", wcag: "#005259" }
}

// Teal Scale
teal100 = {
  light: { base: "#D9E8EA", wcag: "#B3D9E0" },
  dark: { base: "#D9E8EA", wcag: "#B3D9E0" }
}
teal200 = {
  light: { base: "#4D9BA5", wcag: "#66A6B3" },
  dark: { base: "#4D9BA5", wcag: "#66A6B3" }
}
teal300 = {
  light: { base: "#1A535C", wcag: "#2D7380" },
  dark: { base: "#1A535C", wcag: "#2D7380" }
}
teal400 = {
  light: { base: "#15424A", wcag: "#1F5159" },
  dark: { base: "#15424A", wcag: "#1F5159" }
}
teal500 = {
  light: { base: "#0F2E33", wcag: "#143740" },
  dark: { base: "#0F2E33", wcag: "#143740" }
}

```


## Semantic Token Specifications

Semantic tokens provide contextual meaning by referencing primitive tokens. They enable design intent while maintaining mathematical consistency.

### **Typography Semantic Tokens**
Semantic typography tokens combine multiple primitive tokens to create complete text styles. Based on the previous DesignerPunk iteration, we use a three-layer approach:

#### **Content Typography (Semantic Layer)**
```
// Body Text Variants
typography.body = {
  fontSize: fontSize100,
  lineHeight: lineHeight100,
  fontFamily: fontFamilyBody,
  fontWeight: fontWeight400
}

typography.bodySmall = {
  fontSize: fontSize075,
  lineHeight: lineHeight075,
  fontFamily: fontFamilyBody,
  fontWeight: fontWeight400
}

typography.bodyLarge = {
  fontSize: fontSize125,
  lineHeight: lineHeight125,
  fontFamily: fontFamilyBody,
  fontWeight: fontWeight400
}

// Heading Hierarchy
typography.h1 = {
  fontSize: fontSize600, 
  lineHeight: lineHeight600,
  fontFamily: fontFamilyDisplay,
  fontWeight: fontWeight700
}

typography.h2 = {
  fontSize: fontSize500,
  lineHeight: lineHeight500,
  fontFamily: fontFamilyDisplay,
  fontWeight: fontWeight700
}

typography.h3 = {
  fontSize: fontSize400,
  lineHeight: lineHeight400,
  fontFamily: fontFamilyDisplay,
  fontWeight: fontWeight600
}

typography.h4 = {
  fontSize: fontSize300,
  lineHeight: lineHeight300,
  fontFamily: fontFamilyBody,
  fontWeight: fontWeight600
}

typography.h5 = {
  fontSize: fontSize200,
  lineHeight: lineHeight200,
  fontFamily: fontFamilyBody,
  fontWeight: fontWeight600
}

typography.h6 = {
  fontSize: fontSize150,
  lineHeight: lineHeight150,
  fontFamily: fontFamilyBody,
  fontWeight: fontWeight700
}



// Specialized Text
typography.caption = {
  fontSize: fontSize050,
  lineHeight: lineHeight050,
  fontFamily: fontFamilyBody,
  fontWeight: fontWeight300
}

typography.legal = {
  fontSize: fontSize050,
  lineHeight: lineHeight050,
  fontFamily: fontFamilyBody,
  fontWeight: fontWeight400
}

typography.display = {
  fontSize: fontSize700,
  lineHeight: lineHeight700,
  fontFamily: fontFamilyDisplay,
  fontWeight: fontWeight700
}
```

#### **Interface Typography (UI Layer)**
// UI Component Text Styles
typography.button = typography.body + fontWeight: fontWeight500

typography.input = typography.body

typography.label = typography.bodySmall + fontWeight: fontWeight500

### **Spacing Semantic Tokens**
Semantic spacing tokens provide contextual meaning for specific use cases:

```
space.tight      = space050  - Compact layouts
space.normal     = space100  - Standard spacing
space.loose      = space200  - Generous spacing
space.component  = space125  - Component internal spacing (strategic flexibility)
space.section    = space400  - Section separation
```

### **Color Semantic Tokens**
Color semantic tokens reference primitive color values with contextual meaning. These tokens are mode-aware and theme-aware, automatically resolving to appropriate values based on system context.

```
// Brand Identity Tokens
color.primary    = purple300  - Primary brand color
color.secondary  = violet300  - Secondary brand color

// Status and Feedback Tokens  
color.success.strong = cyan300    - Default success states (mode-aware: cyan300 dark, teal300 light)
color.success.subtle = teal300    - Subtle success states (mode-aware: teal300 dark, cyan300 light)
color.warning.strong = yellow300  - Default warning states (mode-aware: yellow300 dark, orange400 light)
color.warning.subtle = orange300  - Subtle warning states (mode-aware: orange300 dark, yellow500 light)
color.error          = orange300  - Error states (mode-aware: orange400 dark, orange500 light)

// Text Hierarchy Tokens
color.text       = white300   - Primary text color (mode-aware: white300 dark, black300 light)
color.textMuted  = gray200    - Secondary text color (mode-aware: gray200 dark, gray300 light)
color.textSubtle = gray100    - Tertiary text color (mode-aware: gray100 dark, gray500 light)

// Surface and Background Tokens
color.background = black300   - Primary background (mode-aware: black300 dark, white100 light)
color.surface    = gray500    - Primary surface/card color (mode-aware: gray500 dark, white200 light)
color.border     = gray400    - Border and divider color (mode-aware: gray400 dark, gray200 light)

// Info Tokens
color.info.strong = violet200  - Default informational messaging (mode-aware: violet200 dark, violet400 light)
color.info.subtle = purple200  - Default informational messaging (mode-aware: purple200 dark, purple400 light)
```

**Semantic Token Usage Guidelines**:

- **Primary (Purple)**: Brand authority, luxury, electric sophistication. Use for hero CTAs, key UI moments, primary brand color
- **Secondary (Violet)**: Mysterious depth, sophisticated secondary brand color. Use when purple feels too intense
- **Success (Cyan)**: Tech/digital success, sharp contrast. Perfect for AI, data, and tech features
- **Warning (Yellow)**: Aggressive, energetic, urgent attention. Most visible color for immediate attention
- **Error (Orange)**: Warm, approachable errors. Less aggressive than yellow while maintaining energy

**Mode-Aware Resolution**:
```typescript
// Example: color.primary resolves to:
// Dark mode: purple300.dark[theme] 
// Light mode: purple300.light[theme]
// Where theme = 'base' | 'wcag'
```

### **Usage Priority**
1. **Prefer semantic tokens** when available for the use case
2. **Fallback to primitive tokens** when no appropriate semantic token exists
3. **Avoid raw values** - always use token references. Prompt human for permission to use

---

## Mathematical Relationships

### **Strategic Flexibility Tokens**
Strategic flexibility tokens are mathematically derived but break the systematic progression within their token family:

- **space075 = 6** (space100 × 0.75) - Fine-grained spacing flexibility
- **space125 = 10** (space100 × 1.25) - Component spacing flexibility  
- **space250 = 20** (space100 × 2.5) - Large spacing flexibility
- **radius075 = 6** (radius100 × 0.75) - Fine-grained radius flexibility

**Key Distinction**: These tokens ARE mathematically derived using formulas, but they are EXCEPTIONS to their family's systematic scale progression. They provide design flexibility while maintaining mathematical relationships to the base unit.

### **Modular Scale Relationships**
- **Typography**: 1.125 ratio (musical fourth)
- **Spacing**: Linear progression with strategic flexibility
- **Line Height**: Multiplier ratios applied to font sizes for computed line height values

### **Cross-Platform Unit Conversion**

#### **Web Platform**
```
Spacing: unitlessValue × 1px
Typography: unitlessValue ÷ baseValue = REM
Line Height: unitlessValue (unitless)
Radius: unitlessValue × 1px
Density: unitlessValue (multiplier)
Tap Area: unitlessValue × 1px
Color: CSS custom properties with automatic mode detection
  - Mode: Automatic via @media (prefers-color-scheme)
  - Theme: Manual via CSS class or data attribute (default: base)
  - Resolution: colorToken[systemMode][userTheme]
  - Example: var(--color-primary) → purple300.dark.base
```

#### **iOS Platform**
```
Spacing: unitlessValue × 1pt
Typography: unitlessValue × 1pt
Line Height: unitlessValue (unitless)
Radius: unitlessValue × 1pt
Density: unitlessValue (multiplier)
Tap Area: unitlessValue × 1pt
Color: UIColor.dynamicColor with native trait collection detection
  - Mode: Automatic via traitCollection.userInterfaceStyle
  - Theme: Manual via app-level theme manager (default: base)
  - Resolution: colorToken[systemMode][userTheme]
  - Example: UIColor.dynamicColor(light: purple300.light.base, dark: purple300.dark.base)
```

#### **Android Platform**
```
Spacing: unitlessValue × 1dp
Typography: unitlessValue × 1sp
Line Height: unitlessValue (unitless)
Radius: unitlessValue × 1dp
Density: unitlessValue (multiplier)
Tap Area: unitlessValue × 1dp
Color: Resource qualifiers with native configuration detection
  - Mode: Automatic via res/values-night/ configuration qualifiers
  - Theme: Manual via resource overlay or theme switching (default: base)
  - Resolution: colorToken[systemMode][userTheme]
  - Example: @color/color_primary → purple300_dark_base (in values-night/)
```

---

## Token Naming Conventions

### **Naming Structure**
```
{category}{value}
```

### **Primitive Token Category Prefixes**
- `space` - Spacing tokens
- `fontSize` - Font size tokens
- `fontFamily` - Font family tokens
- `fontWeight` - Font weight tokens
- `lineHeight` - Line height ratio tokens
- `letterSpacing` - Letter spacing tokens
- `radius` - Border radius tokens
- `density` - Scale density tokens
- `tapArea` - Minimum touch target tokens
- `gray`, `black`, `white`, `yellow`, `orange`, `purple`, `violet`, `cyan`, `teal` - Color tokens by hue

### **Semantic Token Category Prefixes**
- `typography` - Complete text style definitions
- `color` - Contextual color references
- `space` - Contextual spacing references
- `border` - Border style combinations
- `shadow` - Shadow effect definitions

### **Value Suffixes**
- Numbers typically represent relative scale position (050, 075, 100, 125, etc.)
- 100 = base unit typically for each token family

---

## Implementation Notes

### **Per-Family Base Values Rationale**
- **Spacing (8)**: Maintains 8px baseline grid foundation
- **Font Size (16)**: Aligns with browser default font size
- **Font Family (N/A)**: Categorical values, not mathematical
- **Font Weight (400)**: Standard normal weight baseline
- **Line Height (1.5)**: Optimal readability ratio for body text
- **Letter Spacing (0)**: Normal spacing baseline for optimal readability
- **Radius (8)**: Consistent with spacing for visual harmony
- **Density (1.0)**: Neutral multiplier for scaling
- **Tap Area (44)**: WCAG AA minimum touch target requirement
- **Color (N/A)**: Hex color values, not mathematical

### **Unitless Benefits**
- **Platform Flexibility**: Each platform applies appropriate units
- **Mathematical Precision**: No rounding errors from unit conversion
- **Scalability**: Easy to apply density scaling and responsive adjustments
- **Consistency**: Same mathematical relationships across all platforms

### **Strategic Flexibility Integration**
- All token families support their own strategic flexibility tokens to resolve their unique needs
- Strategic flexibility tokens are mathematically derived but break systematic family progressions
- Maintains mathematical foundation while enabling design flexibility
- Three-tier validation system applies across all token families

### **Precision Multiplier Philosophy**
- Line height and tap area multipliers are not arbitrary - they are calculated to achieve specific systematic targets
- Line height multipliers align with 4pt typography subgrid when combined with their paired fontSize tokens
- Typography works on 4pt subgrid (4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, etc.) within the 8pt baseline grid system
- Tap area multipliers hit specific accessibility targets at default scale
- This precision targeting maintains mathematical rigor while achieving practical design goals

### **Typography Token Pairing System**
- fontSize and lineHeight tokens are exactly paired with matching numeric suffixes
- fontSize050 always pairs with lineHeight050, fontSize100 with lineHeight100, etc.
- Multipliers are rounded to thousandths for precision (e.g., 1.538, 1.429, 1.391)
- Tightening pattern: ratios decrease as font size increases (body: 1.429-1.556, headers: 1.143-1.4)
- All computed line heights align to 4pt subgrid for systematic vertical rhythm

---

## Questions for Validation

1. **Primitive Token Categories**: Are there additional primitive token categories needed beyond these nine families?
2. **Semantic Token Structure**: Does the three-layer approach (primitive → semantic → interface) provide the right abstraction levels?
3. **Typography Semantic Tokens**: Do the combined typography tokens (fontSize + lineHeight + fontFamily + fontWeight + letterSpacing) provide sufficient flexibility?
4. **Font Family Categories**: Are the font family categories (system, mono, display, body) comprehensive for cross-platform needs?
5. **Letter Spacing Integration**: Should letterSpacing be included in all semantic typography tokens or only specific ones?
6. **Interface Typography**: Does the separate interface layer (button, input, label) provide appropriate UI-specific styling?
7. **Heading Hierarchy**: Is the heading1-4 structure sufficient, or should we extend to full H1-H6 coverage?
8. **Usage Priority**: Is the semantic-first, primitive-fallback approach the right guidance across all typography use cases?
9. **Cross-Platform Units**: Are the platform-specific unit applications correct for all token families including letterSpacing?

---

*This document captures the current direction for token specifications and will inform updates to the Mathematical Token System spec.*