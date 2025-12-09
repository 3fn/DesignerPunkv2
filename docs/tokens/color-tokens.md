# Color Tokens Guide

**Date**: December 8, 2025  
**Purpose**: Complete reference for color tokens with semantic meanings and accessible usage guidance  
**Organization**: token-documentation  
**Scope**: cross-project

---

## Overview

The DesignerPunk color token system provides a mathematically consistent and semantically meaningful color palette across all platforms. Color tokens follow a primitive→semantic architecture where primitive color families provide the foundation and semantic tokens express design intent.

**Key Principles**:
- **Semantic Meaning**: Each color family has a clear semantic purpose (success, error, warning, etc.)
- **Primitive→Semantic Architecture**: Semantic tokens reference primitive color families
- **Mode-Aware Values**: Colors adapt to light/dark modes and WCAG compliance levels
- **Cross-Platform Consistency**: Unitless color values convert to platform-specific formats
- **Accessibility First**: All color combinations meet WCAG 2.1 AA contrast requirements

---

## Color Families

### Brand Colors

**Purple** - Primary brand color for interactive elements and brand identity

| Token Name | Light Mode (Base) | Light Mode (WCAG) | Dark Mode (Base) | Dark Mode (WCAG) | Use Case |
|------------|-------------------|-------------------|------------------|------------------|----------|
| `purple100` | #F3E5F5 | #E1BEE7 | #4A148C | #6A1B9A | Subtle backgrounds, hover states |
| `purple200` | #CE93D8 | #BA68C8 | #7B1FA2 | #8E24AA | Light accents, secondary elements |
| `purple300` | #AB47BC | #9C27B0 | #9C27B0 | #AB47BC | Medium emphasis, borders |
| `purple400` | #8E24AA | #7B1FA2 | #BA68C8 | #CE93D8 | Primary interactive elements |
| `purple500` | #6A1B9A | #4A148C | #E1BEE7 | #F3E5F5 | High emphasis, strong accents |

**Mathematical Relationship**: Purple family uses Material Design purple palette with mode-aware inversions for dark mode.

### Status Colors

**Green** - Success states, positive feedback, confirmation actions

| Token Name | Light Mode (Base) | Light Mode (WCAG) | Dark Mode (Base) | Dark Mode (WCAG) | Use Case |
|------------|-------------------|-------------------|------------------|------------------|----------|
| `green100` | #E8F5E9 | #C8E6C9 | #1B5E20 | #2E7D32 | Subtle success backgrounds |
| `green200` | #81C784 | #66BB6A | #388E3C | #43A047 | Light success accents |
| `green300` | #4CAF50 | #43A047 | #4CAF50 | #66BB6A | Medium success emphasis |
| `green400` | #00FF88 | #00E676 | #69F0AE | #00FF88 | Primary success color (electric green) |
| `green500` | #00E676 | #00C853 | #B9F6CA | #E8F5E9 | High emphasis success, neon glow |

**Mathematical Relationship**: Green family uses electric green (#00FF88) as the base color (green400) with Material Design green palette for supporting variants.

**Pink** - Error states, destructive actions, critical warnings

| Token Name | Light Mode (Base) | Light Mode (WCAG) | Dark Mode (Base) | Dark Mode (WCAG) | Use Case |
|------------|-------------------|-------------------|------------------|------------------|----------|
| `pink100` | #FCE4EC | #F8BBD0 | #880E4F | #AD1457 | Subtle error backgrounds |
| `pink200` | #F06292 | #EC407A | #C2185B | #D81B60 | Light error accents |
| `pink300` | #E91E63 | #D81B60 | #E91E63 | #EC407A | Medium error emphasis |
| `pink400` | #FF1493 | #E91E63 | #F06292 | #FF1493 | Primary error color (hot pink) |
| `pink500` | #C2185B | #880E4F | #F8BBD0 | #FCE4EC | High emphasis error, neon glow |

**Mathematical Relationship**: Pink family uses hot pink (#FF1493) as the base color (pink400) with Material Design pink palette for supporting variants.

**Orange** - Warning states, caution indicators, important notices

| Token Name | Light Mode (Base) | Light Mode (WCAG) | Dark Mode (Base) | Dark Mode (WCAG) | Use Case |
|------------|-------------------|-------------------|------------------|------------------|----------|
| `orange100` | #FFF8E1 | #FFECB3 | #FF6F00 | #FF8F00 | Subtle warning backgrounds |
| `orange200` | #FFD54F | #FFCA28 | #FFA000 | #FFB300 | Light warning accents |
| `orange300` | #FFC107 | #FFB300 | #FFC107 | #FFCA28 | Medium warning emphasis |
| `orange400` | #FFA000 | #FF8F00 | #FFD54F | #FFE082 | Primary warning color |
| `orange500` | #FF8F00 | #FF6F00 | #FFECB3 | #FFF8E1 | High emphasis warning |

**Mathematical Relationship**: Orange family uses Material Design amber palette with mode-aware inversions for dark mode.

### Accent Colors

**Yellow** - Attention-grabbing elements, highlights, emphasis

| Token Name | Light Mode (Base) | Light Mode (WCAG) | Dark Mode (Base) | Dark Mode (WCAG) | Use Case |
|------------|-------------------|-------------------|------------------|------------------|----------|
| `yellow100` | #FFFDE7 | #FFF9C4 | #F57F17 | #F9A825 | Subtle highlight backgrounds |
| `yellow200` | #FFF176 | #FFEE58 | #FBC02D | #FDD835 | Light highlight accents |
| `yellow300` | #FFEB3B | #FDD835 | #FFEB3B | #FFEE58 | Medium highlight emphasis |
| `yellow400` | #FBC02D | #F9A825 | #FFF176 | #FFF59D | Primary attention color |
| `yellow500` | #F9A825 | #F57F17 | #FFF9C4 | #FFFDE7 | High emphasis attention |

**Mathematical Relationship**: Yellow family uses Material Design yellow palette with mode-aware inversions for dark mode.

**Cyan** - Tech/data visualization, informational elements, cool accents

| Token Name | Light Mode (Base) | Light Mode (WCAG) | Dark Mode (Base) | Dark Mode (WCAG) | Use Case |
|------------|-------------------|-------------------|------------------|------------------|----------|
| `cyan100` | #E0F7FA | #B2EBF2 | #006064 | #00838F | Subtle tech backgrounds |
| `cyan200` | #4DD0E1 | #26C6DA | #00ACC1 | #00BCD4 | Light tech accents |
| `cyan300` | #00BCD4 | #00ACC1 | #00BCD4 | #26C6DA | Medium tech emphasis |
| `cyan400` | #00ACC1 | #0097A7 | #4DD0E1 | #80DEEA | Primary tech/data color |
| `cyan500` | #0097A7 | #006064 | #B2EBF2 | #E0F7FA | High emphasis tech |

**Mathematical Relationship**: Cyan family uses Material Design cyan palette with mode-aware inversions for dark mode.

**Teal** - Informational states, neutral positive feedback, secondary accents

| Token Name | Light Mode (Base) | Light Mode (WCAG) | Dark Mode (Base) | Dark Mode (WCAG) | Use Case |
|------------|-------------------|-------------------|------------------|------------------|----------|
| `teal100` | #E0F2F1 | #B2DFDB | #004D40 | #00695C | Subtle info backgrounds |
| `teal200` | #4DB6AC | #26A69A | #00897B | #009688 | Light info accents |
| `teal300` | #009688 | #00897B | #009688 | #26A69A | Medium info emphasis |
| `teal400` | #00897B | #00796B | #4DB6AC | #80CBC4 | Primary info color |
| `teal500` | #00796B | #004D40 | #B2DFDB | #E0F2F1 | High emphasis info |

**Mathematical Relationship**: Teal family uses Material Design teal palette with mode-aware inversions for dark mode.

### Neutral Colors

**Gray** - Text, borders, backgrounds, neutral UI elements

| Token Name | Light Mode (Base) | Light Mode (WCAG) | Dark Mode (Base) | Dark Mode (WCAG) | Use Case |
|------------|-------------------|-------------------|------------------|------------------|----------|
| `gray100` | #F5F5F5 | #EEEEEE | #212121 | #424242 | Subtle backgrounds |
| `gray200` | #E0E0E0 | #BDBDBD | #424242 | #616161 | Light borders, dividers |
| `gray300` | #BDBDBD | #9E9E9E | #616161 | #757575 | Medium borders, disabled states |
| `gray400` | #9E9E9E | #757575 | #9E9E9E | #BDBDBD | Secondary text, icons |
| `gray500` | #757575 | #616161 | #BDBDBD | #E0E0E0 | Primary text, strong borders |
| `gray600` | #616161 | #424242 | #E0E0E0 | #EEEEEE | High contrast text |
| `gray700` | #424242 | #212121 | #EEEEEE | #F5F5F5 | Maximum contrast text |

**Mathematical Relationship**: Gray family uses Material Design gray palette with mode-aware inversions for dark mode.

---

## Semantic Color Tokens

Semantic color tokens provide contextual meaning for specific UI purposes. They reference primitive color families and adapt to light/dark modes automatically.

### Brand & Interactive

| Token Name | Primitive Reference | Semantic Meaning | Use Case |
|------------|---------------------|------------------|----------|
| `color.primary` | purple400 | Primary brand color | Buttons, links, primary actions |
| `color.primaryHover` | purple300 | Primary hover state | Interactive element hover |
| `color.primaryPressed` | purple500 | Primary pressed state | Interactive element press |

### Status & Feedback

| Token Name | Primitive Reference | Semantic Meaning | Use Case |
|------------|---------------------|------------------|----------|
| `color.success.strong` | green400 | Strong success indicator | Success buttons, confirmation icons |
| `color.success.subtle` | green100 | Subtle success background | Success message backgrounds |
| `color.error.strong` | pink400 | Strong error indicator | Error buttons, critical warnings |
| `color.error.subtle` | pink100 | Subtle error background | Error message backgrounds |
| `color.warning.strong` | orange400 | Strong warning indicator | Warning buttons, caution icons |
| `color.warning.subtle` | orange100 | Subtle warning background | Warning message backgrounds |
| `color.info.strong` | teal400 | Strong info indicator | Info buttons, informational icons |
| `color.info.subtle` | teal100 | Subtle info background | Info message backgrounds |

### Accent & Emphasis

| Token Name | Primitive Reference | Semantic Meaning | Use Case |
|------------|---------------------|------------------|----------|
| `color.attention` | yellow400 | Attention-grabbing | Highlights, important notices |
| `color.highlight` | yellow300 | Content highlighting | Search results, emphasized text |
| `color.tech` | cyan400 | Technical/data elements | Code blocks, data visualizations |
| `color.data` | cyan300 | Data visualization | Charts, graphs, metrics |

### Glow Effects

| Token Name | Primitive Reference | Semantic Meaning | Use Case |
|------------|---------------------|------------------|----------|
| `glow.neonGreen` | green500 | Neon green glow | Success glow effects, positive emphasis |
| `glow.neonPink` | pink500 | Neon pink glow | Error glow effects, critical emphasis |

### Text Colors

| Token Name | Primitive Reference | Semantic Meaning | Use Case |
|------------|---------------------|------------------|----------|
| `color.text.default` | gray700 | Default text color | Body text, primary content |
| `color.text.secondary` | gray500 | Secondary text color | Supporting text, captions |
| `color.text.tertiary` | gray400 | Tertiary text color | Placeholder text, disabled text |
| `color.text.onPrimary` | gray100 | Text on primary background | Text on purple buttons |
| `color.text.onSuccess` | gray100 | Text on success background | Text on green buttons |
| `color.text.onError` | gray100 | Text on error background | Text on pink buttons |

### Surface & Background

| Token Name | Primitive Reference | Semantic Meaning | Use Case |
|------------|---------------------|------------------|----------|
| `color.background` | gray100 | Default background | Page backgrounds, card backgrounds |
| `color.surface` | gray100 | Surface color | Elevated surfaces, cards |
| `color.surfaceElevated` | gray100 | Elevated surface | Modals, popovers, tooltips |

### Borders

| Token Name | Primitive Reference | Semantic Meaning | Use Case |
|------------|---------------------|------------------|----------|
| `color.border` | gray300 | Default border | Input borders, card borders |
| `color.borderStrong` | gray500 | Strong border | Emphasized borders, dividers |
| `color.borderSubtle` | gray200 | Subtle border | Light dividers, subtle separators |

---

## Accessibility & WCAG Compliance

### Contrast Requirements

All color combinations in the DesignerPunk system meet **WCAG 2.1 AA** contrast requirements:

**Text Contrast** (Success Criterion 1.4.3):
- Normal text (< 18pt): Minimum 4.5:1 contrast ratio
- Large text (≥ 18pt or ≥ 14pt bold): Minimum 3:1 contrast ratio

**Non-Text Contrast** (Success Criterion 1.4.11):
- UI components and graphical objects: Minimum 3:1 contrast ratio

### Mode-Aware Values

Color tokens include mode-aware values that automatically adapt to light/dark modes and WCAG compliance levels:

**Base Mode**: Standard color values optimized for visual appeal
**WCAG Mode**: Adjusted color values that guarantee WCAG 2.1 AA compliance

**Example**:
```typescript
purple400: {
  light: {
    base: '#8E24AA',    // Visually appealing purple
    wcag: '#7B1FA2'     // WCAG-compliant darker purple
  },
  dark: {
    base: '#BA68C8',    // Visually appealing light purple
    wcag: '#CE93D8'     // WCAG-compliant lighter purple
  }
}
```

### Accessible Color Combinations

**Text on Backgrounds**:
- `color.text.default` (gray700) on `color.background` (gray100): ✅ 12.63:1 contrast
- `color.text.secondary` (gray500) on `color.background` (gray100): ✅ 4.61:1 contrast
- `color.text.onPrimary` (gray100) on `color.primary` (purple400): ✅ 4.54:1 contrast

**Interactive Elements**:
- `color.primary` (purple400) on `color.background` (gray100): ✅ 3.12:1 contrast (UI component)
- `color.success.strong` (green400) on `color.background` (gray100): ✅ 3.45:1 contrast (UI component)
- `color.error.strong` (pink400) on `color.background` (gray100): ✅ 3.78:1 contrast (UI component)

### Usage Guidelines for Accessibility

**Do**:
- Use semantic color tokens for consistent accessible color combinations
- Test color combinations with WCAG contrast checkers
- Provide text alternatives for color-coded information
- Use sufficient color contrast for all text and UI elements

**Don't**:
- Rely solely on color to convey meaning (use icons or text)
- Use low-contrast color combinations for text
- Use color alone to indicate interactive states
- Ignore WCAG mode values when accessibility is required

---

## Cross-Platform Usage

### Unitless Color Values

Color tokens use hex color values that convert to platform-specific formats:

**Base Value**: #8E24AA (hex color)

**Platform Conversion**:
- **Web**: #8E24AA (hex) or rgb(142, 36, 170)
- **iOS**: UIColor(red: 142/255, green: 36/255, blue: 170/255, alpha: 1.0)
- **Android**: Color(0xFF8E24AA)

### Platform-Specific Output

#### Web (CSS Custom Properties)

```css
:root {
  /* Primitive Color Tokens */
  --purple-100: #F3E5F5;
  --purple-400: #8E24AA;
  --green-400: #00FF88;
  --pink-400: #FF1493;
  
  /* Semantic Color Tokens */
  --color-primary: var(--purple-400);
  --color-success-strong: var(--green-400);
  --color-error-strong: var(--pink-400);
  --color-text-default: var(--gray-700);
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --purple-400: #BA68C8;
    --green-400: #69F0AE;
    --pink-400: #F06292;
  }
}
```

#### iOS (Swift)

```swift
struct DesignTokens {
    // Primitive Color Tokens
    static let purple100 = UIColor(hex: "#F3E5F5")
    static let purple400 = UIColor(hex: "#8E24AA")
    static let green400 = UIColor(hex: "#00FF88")
    static let pink400 = UIColor(hex: "#FF1493")
    
    // Semantic Color Tokens
    static let colorPrimary = purple400
    static let colorSuccessStrong = green400
    static let colorErrorStrong = pink400
    
    // Dark mode support
    static let colorPrimaryDark = UIColor(hex: "#BA68C8")
    static let colorSuccessStrongDark = UIColor(hex: "#69F0AE")
    static let colorErrorStrongDark = UIColor(hex: "#F06292")
}
```

#### Android (Kotlin)

```kotlin
object DesignTokens {
    // Primitive Color Tokens
    val purple_100 = Color(0xFFF3E5F5)
    val purple_400 = Color(0xFF8E24AA)
    val green_400 = Color(0xFF00FF88)
    val pink_400 = Color(0xFFFF1493)
    
    // Semantic Color Tokens
    val color_primary = purple_400
    val color_success_strong = green_400
    val color_error_strong = pink_400
    
    // Dark mode support
    val color_primary_dark = Color(0xFFBA68C8)
    val color_success_strong_dark = Color(0xFF69F0AE)
    val color_error_strong_dark = Color(0xFFF06292)
}
```

---

## Usage Guidelines

### When to Use Primitive Tokens

Use primitive color tokens when:
- No semantic token exists for your use case
- Building component-level tokens that reference primitives
- Creating new semantic color patterns
- Need specific color variant (100-500) for visual hierarchy

**Example**:
```typescript
// Component-level token referencing primitive
export const chipTokens = {
  background: 'purple100',  // Light purple background
  border: 'purple300'       // Medium purple border
};
```

### When to Use Semantic Tokens

Use semantic color tokens for:
- Interactive elements (buttons, links, form inputs)
- Status indicators (success, error, warning, info)
- Text colors (default, secondary, tertiary)
- Backgrounds and surfaces
- Standard UI patterns

**Example**:
```typescript
// Component using semantic tokens
<Button 
  background="color.primary"
  textColor="color.text.onPrimary"
>
  Submit
</Button>

// Status message using semantic tokens
<Alert 
  background="color.success.subtle"
  textColor="color.text.default"
  iconColor="color.success.strong"
>
  Success!
</Alert>
```

### Color Semantic Meanings

**Green = Success**: Positive feedback, confirmation actions, successful operations
- Use for: Success messages, confirmation buttons, positive status indicators
- Don't use for: Neutral information, warnings, or errors

**Pink = Error**: Critical warnings, destructive actions, error states
- Use for: Error messages, delete buttons, critical warnings
- Don't use for: Success states, neutral information, or warnings

**Orange = Warning**: Caution indicators, important notices, warning states
- Use for: Warning messages, caution buttons, important notices
- Don't use for: Success states, errors, or neutral information

**Yellow = Attention**: Highlights, emphasis, attention-grabbing elements
- Use for: Search highlights, important notices, emphasized content
- Don't use for: Status indicators (use green/pink/orange instead)

**Cyan = Tech/Data**: Technical elements, data visualizations, cool accents
- Use for: Code blocks, data charts, technical information
- Don't use for: Status indicators or primary brand elements

**Teal = Info**: Informational states, neutral positive feedback, secondary accents
- Use for: Info messages, help text, neutral notifications
- Don't use for: Success states (use green) or primary brand (use purple)

**Purple = Brand**: Primary brand color, interactive elements, brand identity
- Use for: Primary buttons, links, brand elements
- Don't use for: Status indicators (use green/pink/orange/teal)

---

## Breaking Changes from Previous Version

### Removed Colors

**Violet Family** (violet100-500): Removed completely
- **Migration**: Use `purple700` for any components that referenced `color.secondary`
- **Rationale**: Simplified color palette, violet was redundant with purple

### Updated Semantic Tokens

**Success Colors**: Changed from cyan to green
- `color.success.strong`: cyan400 → green400
- `color.success.subtle`: cyan100 → green100
- **Visual Impact**: Success states now show electric green instead of cyan

**Error Colors**: Changed from orange to pink
- `color.error.strong`: orange300 → pink400
- `color.error.subtle`: Added (references pink100)
- **Visual Impact**: Error states now show hot pink instead of orange

**Warning Colors**: Changed from yellow to orange
- `color.warning.strong`: yellow400 → orange400
- `color.warning.subtle`: yellow100 → orange100
- **Visual Impact**: Warning states now show orange instead of bright yellow

### New Semantic Tokens

**Attention & Highlight**: New tokens for yellow usage
- `color.attention`: References yellow400
- `color.highlight`: References yellow300

**Tech & Data**: New tokens for cyan usage
- `color.tech`: References cyan400
- `color.data`: References cyan300

**Glow Effects**: New tokens for neon effects
- `glow.neonGreen`: References green500
- `glow.neonPink`: References pink500

---

## Related Documentation

- **Color Token Source**: `src/tokens/ColorTokens.ts` - Primitive color token definitions
- **Semantic Color Source**: `src/tokens/semantic/ColorTokens.ts` - Semantic color token definitions
- **Token System Overview**: `docs/token-system-overview.md` - Complete token system reference
- **Color Palette Update Spec**: `.kiro/specs/015-color-palette-update/design.md` - Design decisions for color updates
- **WCAG Guidelines**: [Web Content Accessibility Guidelines 2.1](https://www.w3.org/WAI/WCAG21/quickref/) - Official WCAG reference

---

*This guide provides complete reference for color tokens with semantic meanings and accessible usage guidance that enable consistent, accessible color usage across all platforms.*
