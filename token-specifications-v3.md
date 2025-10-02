# Token Specifications v3.0

**Date**: October 1, 2025  
**Purpose**: Current token specifications for DesignerPunk Design System v2  
**Status**: Working Document - Current Direction  
**Organization**: working-document
**Scope**: temporary

---

## Overview

This document defines the current token specifications for the Mathematical Token System, representing the evolution from Token Architecture 2.0 to the current unitless, per-family base value approach.

## Key Changes from Previous Iteration

### **Unitless Values**
- **Previous**: `space100 = 8px`
- **Current**: `space100 = 8` (unitless, platforms apply units during translation)

### **Per-Token-Family Base Values**
- **Previous**: Single 8px base for all tokens
- **Current**: Different base values per token family for mathematical precision

### **Expanded Token Categories**
- Added line height, scale density, minimum tap areas, and other accessibility tokens

---

## Token Family Specifications

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

### **Typography Token Family**
**Base Value**: 16  
**Unit Application**: Web (÷(Base Unit) = REM), iOS (×1pt), Android (×1sp)

```
fontSize050 = (fontSize100 × 0.75)
fontSize075 = (fontSize100 × 0.875)
fontSize100 = baseValue - Base Unit
fontSize125 = (fontSize100 x 1.125)
fontSize150 = (fontSize100 × 1.25)
fontSize200 = (fontSize100 × 1.424) - Rounded from 1.125³
fontSize250 = (fontSize100 × 1.75)
fontSize300 = (fontSize100 × 2)
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
```

#### **iOS Platform**
```
Spacing: unitlessValue × 1pt
Typography: unitlessValue × 1pt
Line Height: unitlessValue (unitless)
Radius: unitlessValue × 1pt
Density: unitlessValue (multiplier)
Tap Area: unitlessValue × 1pt
```

#### **Android Platform**
```
Spacing: unitlessValue × 1dp
Typography: unitlessValue × 1sp
Line Height: unitlessValue (unitless)
Radius: unitlessValue × 1dp
Density: unitlessValue (multiplier)
Tap Area: unitlessValue × 1dp
```

---

## Token Naming Conventions

### **Naming Structure**
```
{category}{value}
```

### **Category Prefixes**
- `space` - Spacing tokens
- `fontSize` - Typography size tokens
- `lineHeight` - Line height ratio tokens
- `radius` - Border radius tokens
- `density` - Scale density tokens
- `tapArea` - Minimum touch target tokens

### **Value Suffixes**
- Numbers typically represent relative scale position (050, 075, 100, 125, etc.)
- 100 = base unit typically for each token family

---

## Implementation Notes

### **Per-Family Base Values Rationale**
- **Spacing (8)**: Maintains 8px baseline grid foundation
- **Typography (16)**: Aligns with browser default font size
- **Line Height (1.5)**: Optimal readability ratio for body text
- **Radius (8)**: Consistent with spacing for visual harmony
- **Density (1.0)**: Neutral multiplier for scaling
- **Tap Area (44)**: WCAG AA minimum touch target requirement

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

1. **Token Categories**: Are there additional token categories needed beyond these six? Peter: Probably, but we can evaluate those needs as we get more into development. 
2. **Token Values**: Do the specific token values and progressions look correct?
3. **Base Values**: Are the per-family base values appropriate? Peter: I believe they are, yes.
4. **Naming Conventions**: Does the naming structure work for all use cases? Peter: Mostly, but this also doesn't seem to include semantic tokens whose naming conventions will be drastically different as they're defined more conceptually.
5. **Cross-Platform Units**: Are the platform-specific unit applications correct?

---

*This document captures the current direction for token specifications and will inform updates to the Mathematical Token System spec.*