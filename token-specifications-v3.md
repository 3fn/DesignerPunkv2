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

```
fontSize050 = 13 - (base ÷ 1.125²) rounded
fontSize075 = 14 - (base ÷ 1.125) rounded  
fontSize100 = 16 - Base Unit
fontSize125 = 18 - (base × 1.125) rounded
fontSize150 = 20 - (base × 1.125²) rounded
fontSize200 = 23 - (base × 1.125³) rounded
fontSize300 = 26 - (base × 1.125⁴) rounded
fontSize400 = 29 - (base × 1.125⁵) rounded
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

**Precision Targeting**: Line height multipliers are calculated to align with 8pt vertical rhythm when combined with their corresponding fontSize tokens, ensuring systematic vertical spacing.

```
lineHeight050 = (lineHeight100 × 0.833)
lineHeight075 = (lineHeight100 × 0.889)
lineHeight100 = baseValue - Base Unit
lineHeight125 = (lineHeight100 × 1.037)
lineHeight150 = (lineHeight100 × 1.167)
lineHeight200 = (lineHeight100 × 1.333)
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

**Color Palette Structure**: Systematic color scales with 50-900 progression for each hue, following modern design system conventions.

```
// Gray Scale (Neutral Colors)
gray050 = #F9FAFB - Lightest gray
gray100 = #F3F4F6 - Very light gray
gray200 = #E5E7EB - Light gray
gray300 = #D1D5DB - Medium light gray
gray400 = #9CA3AF - Medium gray
gray500 = #6B7280 - Base gray
gray600 = #4B5563 - Medium dark gray
gray700 = #374151 - Dark gray
gray800 = #1F2937 - Very dark gray
gray900 = #111827 - Darkest gray

// Blue Scale (Primary Brand Colors)
blue050 = #EFF6FF - Lightest blue
blue100 = #DBEAFE - Very light blue
blue200 = #BFDBFE - Light blue
blue300 = #93C5FD - Medium light blue
blue400 = #60A5FA - Medium blue
blue500 = #3B82F6 - Base blue
blue600 = #2563EB - Medium dark blue
blue700 = #1D4ED8 - Dark blue
blue800 = #1E40AF - Very dark blue
blue900 = #1E3A8A - Darkest blue

// Red Scale (Error/Danger Colors)
red050 = #FEF2F2 - Lightest red
red100 = #FEE2E2 - Very light red
red200 = #FECACA - Light red
red300 = #FCA5A5 - Medium light red
red400 = #F87171 - Medium red
red500 = #EF4444 - Base red
red600 = #DC2626 - Medium dark red
red700 = #B91C1C - Dark red
red800 = #991B1B - Very dark red
red900 = #7F1D1D - Darkest red

// Green Scale (Success Colors)
green050 = #F0FDF4 - Lightest green
green100 = #DCFCE7 - Very light green
green200 = #BBF7D0 - Light green
green300 = #86EFAC - Medium light green
green400 = #4ADE80 - Medium green
green500 = #22C55E - Base green
green600 = #16A34A - Medium dark green
green700 = #15803D - Dark green
green800 = #166534 - Very dark green
green900 = #14532D - Darkest green

// Yellow Scale (Warning Colors)
yellow050 = #FEFCE8 - Lightest yellow
yellow100 = #FEF3C7 - Very light yellow
yellow200 = #FDE68A - Light yellow
yellow300 = #FCD34D - Medium light yellow
yellow400 = #FBBF24 - Medium yellow
yellow500 = #F59E0B - Base yellow
yellow600 = #D97706 - Medium dark yellow
yellow700 = #B45309 - Dark yellow
yellow800 = #92400E - Very dark yellow
yellow900 = #78350F - Darkest yellow
```

---

## Semantic Token Specifications

Semantic tokens provide contextual meaning by referencing primitive tokens. They enable design intent while maintaining mathematical consistency.

### **Typography Semantic Tokens**
Semantic typography tokens combine multiple primitive tokens to create complete text styles. Based on the previous DesignerPunk iteration, we use a three-layer approach:

#### **Content Typography (Semantic Layer)**
```
// Body Text Variants
typography.body = {
  fontSize: fontSize100,     // 16px
  lineHeight: lineHeight100, // 1.5
  fontFamily: fontFamilyBody,
  fontWeight: fontWeight400
}

typography.bodySmall = {
  fontSize: fontSize075,     // 14px
  lineHeight: lineHeight075, // 1.25
  fontFamily: fontFamilyBody,
  fontWeight: fontWeight400
}

typography.bodyLarge = {
  fontSize: fontSize125,     // 18px
  lineHeight: lineHeight125, // 1.75
  fontFamily: fontFamilyBody,
  fontWeight: fontWeight400
}

// Heading Hierarchy
typography.heading1 = {
  fontSize: fontSize300,     // 26px
  lineHeight: lineHeight075, // 1.25
  fontFamily: fontFamilyDisplay,
  fontWeight: fontWeight700
}

typography.heading2 = {
  fontSize: fontSize250,     // ~23px (fontSize200 equivalent)
  lineHeight: lineHeight075, // 1.25
  fontFamily: fontFamilyDisplay,
  fontWeight: fontWeight600
}

typography.heading3 = {
  fontSize: fontSize200,     // 23px
  lineHeight: lineHeight100, // 1.5
  fontFamily: fontFamilyDisplay,
  fontWeight: fontWeight600
}

typography.heading4 = {
  fontSize: fontSize150,     // 20px
  lineHeight: lineHeight100, // 1.5
  fontFamily: fontFamilyBody,
  fontWeight: fontWeight600
}

// Specialized Text
typography.caption = {
  fontSize: fontSize050,     // 13px
  lineHeight: lineHeight050, // 1.0
  fontFamily: fontFamilyBody,
  fontWeight: fontWeight300
}

typography.legal = {
  fontSize: fontSize050,     // 13px
  lineHeight: lineHeight050, // 1.0
  fontFamily: fontFamilyBody,
  fontWeight: fontWeight400
}
```

#### **Interface Typography (UI Layer)**
```
// UI Component Text Styles
typography.button = {
  fontSize: fontSize100,     // 16px
  fontFamily: fontFamilyBody,
  fontWeight: fontWeight500
}

typography.input = {
  fontSize: fontSize100,     // 16px
  fontFamily: fontFamilyBody,
  fontWeight: fontWeight400
}

typography.label = {
  fontSize: fontSize075,     // 14px
  fontFamily: fontFamilyBody,
  fontWeight: fontWeight500
}
```

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
Color semantic tokens reference primitive color values with contextual meaning:

```
color.primary    = blue500   - Primary brand color
color.secondary  = gray600   - Secondary brand color
color.success    = green500  - Success states
color.warning    = yellow500 - Warning states
color.error      = red500    - Error states
color.text       = gray900   - Primary text color
color.textMuted  = gray600   - Secondary text color
```

### **Usage Priority**
1. **Prefer semantic tokens** when available for the use case
2. **Fallback to primitive tokens** when no appropriate semantic token exists
3. **Avoid raw values** - always use token references

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
Color: hexValue (direct hex usage)
```

#### **iOS Platform**
```
Spacing: unitlessValue × 1pt
Typography: unitlessValue × 1pt
Line Height: unitlessValue (unitless)
Radius: unitlessValue × 1pt
Density: unitlessValue (multiplier)
Tap Area: unitlessValue × 1pt
Color: hexValue (UIColor from hex)
```

#### **Android Platform**
```
Spacing: unitlessValue × 1dp
Typography: unitlessValue × 1sp
Line Height: unitlessValue (unitless)
Radius: unitlessValue × 1dp
Density: unitlessValue (multiplier)
Tap Area: unitlessValue × 1dp
Color: hexValue (Color.parseColor)
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
- `gray`, `blue`, `red`, `green`, `yellow` - Color tokens by hue

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
- Line height multipliers align with 8pt vertical rhythm when combined with fontSize tokens
- Tap area multipliers hit specific accessibility targets at default scale
- This precision targeting maintains mathematical rigor while achieving practical design goals

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