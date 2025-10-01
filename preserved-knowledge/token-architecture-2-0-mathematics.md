# Token Architecture 2.0 Mathematical Concepts

**Purpose**: Pure mathematical relationships and unit conversion formulas that enable cross-platform token relationships in the DesignerPunk design system.

**Status**: ✅ **PRESERVED KNOWLEDGE** - Mathematical concepts only, no implementation details  
**Date**: January 9, 2025  
**Source**: Extracted from Token System Architecture 2.0 and Mathematical Flexibility Philosophy

---

## Core Mathematical Foundation

### 8px Baseline Grid System

**Base Unit Calculation:**
```
Base Unit = 8px
All spacing values = Base Unit × Multiplier
```

**Mathematical Progression:**
```
space050 = 8px × 0.5 = 4px
space075 = 8px × 0.75 = 6px (strategic flexibility)
space100 = 8px × 1 = 8px (base unit)
space125 = 8px × 1.25 = 10px (strategic flexibility)
space150 = 8px × 1.5 = 12px
space200 = 8px × 2 = 16px
space250 = 8px × 2.5 = 20px (strategic flexibility)
space300 = 8px × 3 = 24px
space400 = 8px × 4 = 32px
space500 = 8px × 5 = 40px
space600 = 8px × 6 = 48px
```

**General Formula:**
```
spaceN = 8px × (N/100)
```
Where N is the token number (050, 100, 150, etc.)

### Strategic Flexibility Mathematical Exceptions

**Strategic Flexibility Tokens:**
- `space075` (6px) = 8px × 0.75 - Fine-grained flexibility
- `space125` (10px) = 8px × 1.25 - Component flexibility  
- `space250` (20px) = 8px × 2.5 - Large flexibility

**Mathematical Justification:**
- Maintains 4px minimum increment compliance
- Provides intermediate values between baseline increments
- Enables visual balance without breaking mathematical foundation

## Typography Mathematical Relationships

### 1.125 Modular Scale (Musical Fourth)

**Base Calculation:**
```
Base Font Size = 1rem (16px in most browsers)
Scale Ratio = 1.125 (musical fourth interval)
```

**Mathematical Progression:**
```
fontSize050 = 1rem × (1/1.125)² = 0.75rem (12px)
fontSize075 = 1rem × (1/1.125) = 0.875rem (14px)
fontSize100 = 1rem × 1 = 1rem (16px) - base unit
fontSize125 = 1rem × 1.125 = 1.125rem (18px)
fontSize150 = 1rem × 1.125² = 1.25rem (20px)
fontSize200 = 1rem × 1.125³ = 1.424rem (22.8px)
fontSize250 = 1rem × 1.125⁴ = 1.75rem (28px)
fontSize300 = 1rem × 1.125⁵ = 2rem (32px)
```

**General Formula:**
```
fontSizeN = 1rem × 1.125^(step)
```
Where step is the position in the modular scale progression.

### Line Height Mathematical Relationships

**Proportional Line Height Calculation:**
```
Line Height Ratio = Line Height ÷ Font Size

Optimal ratios:
- Small text (12-14px): 1.25-1.333
- Body text (16-18px): 1.5-1.556  
- Large text (20px+): 1.125-1.405
```

**Mathematical Examples:**
```
fontSize100 (16px) → lineHeight = 24px → ratio = 1.5
fontSize125 (18px) → lineHeight = 28px → ratio = 1.556
fontSize200 (22.8px) → lineHeight = 32px → ratio = 1.405
```

## Cross-Platform Unit Conversion Formulas

### REM to Pixel Conversion

**Base Conversion:**
```
1rem = 16px (default browser base font size)
```

**REM to Pixel Formula:**
```
Pixels = REM × Base Font Size
Pixels = REM × 16px
```

**Examples:**
```
0.75rem = 0.75 × 16px = 12px
1rem = 1 × 16px = 16px
1.125rem = 1.125 × 16px = 18px
1.25rem = 1.25 × 16px = 20px
```

### Cross-Platform Unit Relationships

**Web Platform (CSS Pixels):**
```
1px = 1px (direct relationship)
1rem = 16px (browser default)
```

**iOS Platform (Points):**
```
1pt = 1px on standard displays
1pt = 2px on Retina displays (@2x)
1pt = 3px on Super Retina displays (@3x)
```

**Android Platform (Density-Independent Pixels):**
```
1dp = 1px on mdpi (160dpi baseline)
1dp = 1.5px on hdpi (240dpi)
1dp = 2px on xhdpi (320dpi)
1dp = 3px on xxhdpi (480dpi)
1dp = 4px on xxxhdpi (640dpi)
```

**Cross-Platform Consistency Formula:**
```
Logical Unit = Physical Pixels ÷ Density Scale Factor
```

## Mathematical Validation Formulas

### Baseline Grid Validation

**Alignment Check:**
```
isAligned = (value % 4 === 0) // 4px minimum increment
isBaselineCompliant = (value % 8 === 0) // 8px baseline
```

**Strategic Flexibility Validation:**
```
isStrategicFlexibility = value ∈ [6, 10, 20] // Known flexibility tokens
isAcceptable = isBaselineCompliant || isStrategicFlexibility
```

### Proportional Relationship Validation

**Padding Ratio Validation:**
```
paddingRatio = paddingX ÷ paddingY
targetRatio = 4 ÷ 3 // 1.33 (4:3 ratio)
deviation = |paddingRatio - targetRatio| ÷ targetRatio
isValid = deviation ≤ 0.25 // 25% tolerance
```

**Modular Scale Validation:**
```
scaleRatio = largerFontSize ÷ smallerFontSize
expectedRatio = 1.125^steps
deviation = |scaleRatio - expectedRatio| ÷ expectedRatio
isValid = deviation ≤ 0.05 // 5% tolerance for rounding
```

## Density Scaling Mathematical Relationships

### Density Multipliers

**Density Scale Factors:**
```
Compact: 0.875 = 7/8
Default: 1.0 = 8/8 (base)
Comfortable: 1.125 = 9/8
```

**Symmetrical Relationship:**
```
Compact ÷ Default = 0.875
Comfortable ÷ Default = 1.125
Comfortable ÷ Compact = 1.125 ÷ 0.875 = 1.286
```

**Density Application Formula:**
```
scaledValue = baseValue × densityMultiplier
scaledValue = Math.round(baseValue × densityMultiplier)
```

## Component Mathematical Relationships

### Button Size Mathematical Progression

**Size Scaling Relationships:**
```
Small Button:
- Height: 40px (5 × 8px baseline)
- PaddingX: 16px (2 × 8px baseline)
- PaddingY: 10px (strategic flexibility)
- Ratio X:Y = 16:10 = 1.6:1

Medium Button:
- Height: 48px (6 × 8px baseline)
- PaddingX: 16px (2 × 8px baseline)  
- PaddingY: 12px (1.5 × 8px baseline)
- Ratio X:Y = 16:12 = 1.33:1

Large Button:
- Height: 56px (7 × 8px baseline)
- PaddingX: 24px (3 × 8px baseline)
- PaddingY: 16px (2 × 8px baseline)
- Ratio X:Y = 24:16 = 1.5:1
```

### Border Radius Mathematical Relationships

**Radius Scaling:**
```
radius025 = 2px = 8px × 0.25
radius050 = 4px = 8px × 0.5
radius075 = 6px = 8px × 0.75 (strategic flexibility)
radius100 = 8px = 8px × 1 (base unit)
radius150 = 12px = 8px × 1.5
radius200 = 16px = 8px × 2
```

**Proportional Radius Formula:**
```
componentRadius = componentHeight × radiusRatio
```
Where radiusRatio typically ranges from 0.1 to 0.25 for optimal visual balance.

## Accessibility Mathematical Requirements

### Touch Target Calculations

**Minimum Touch Target:**
```
minTouchTarget = 44px (iOS/Android guidelines)
recommendedTouchTarget = 48px (enhanced accessibility)
```

**Touch Target Validation:**
```
isTouchTargetValid = (width ≥ 44) && (height ≥ 44)
isRecommendedSize = (width ≥ 48) && (height ≥ 48)
```

### Color Contrast Mathematical Relationships

**Contrast Ratio Formula:**
```
contrastRatio = (L1 + 0.05) ÷ (L2 + 0.05)
```
Where L1 is the relative luminance of the lighter color and L2 is the relative luminance of the darker color.

**WCAG Compliance Thresholds:**
```
AA Normal Text: contrastRatio ≥ 4.5
AA Large Text: contrastRatio ≥ 3.0
AAA Normal Text: contrastRatio ≥ 7.0
AAA Large Text: contrastRatio ≥ 4.5
```

## Mathematical Tolerance and Validation Tiers

### Three-Tier Validation System

**Pass Tier (Strict Compliance):**
```
deviation ≤ 0.05 (5%) from mathematical ideal
```

**Warning Tier (Acceptable Flexibility):**
```
0.05 < deviation ≤ 0.25 (5-25%) from mathematical ideal
```

**Error Tier (Significant Violation):**
```
deviation > 0.25 (>25%) from mathematical ideal
```

### Practical Tolerance Calculations

**Spacing Tolerance:**
```
practicalTolerance = Math.max(1, baseValue × 0.125) // 12.5% or 1px minimum
```

**Typography Tolerance:**
```
typographyTolerance = fontSize × 0.05 // 5% for font size relationships
```

**Ratio Tolerance:**
```
ratioTolerance = targetRatio × 0.25 // 25% for proportional relationships
```

---

## Mathematical Principles Summary

### Core Formulas
1. **Baseline Grid**: `value = 8px × multiplier`
2. **Modular Scale**: `fontSize = 1rem × 1.125^step`
3. **Cross-Platform**: `logicalUnit = physicalPixels ÷ densityFactor`
4. **Validation**: `isValid = deviation ≤ tolerance`

### Strategic Flexibility
- Maintains mathematical foundation while allowing exceptional design requirements
- Uses 4px minimum increments as compromise between strict 8px grid and design needs
- Provides intermediate values (6px, 10px, 20px) for visual balance

### Cross-Platform Consistency
- Mathematical relationships preserved across web, iOS, and Android
- Unit conversion formulas ensure visual consistency despite different measurement systems
- Density scaling maintains proportional relationships across device densities

**Mathematical Foundation**: These formulas enable systematic, predictable design token relationships that scale consistently across platforms while maintaining visual harmony and accessibility compliance.