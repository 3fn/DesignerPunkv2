---
inclusion: manual
---

# Color Tokens Guide

**Date**: December 8, 2025
**Last Reviewed**: 2026-01-04
**Purpose**: Complete reference for color tokens with semantic meanings and accessible usage guidance
**Organization**: token-documentation
**Scope**: cross-project
**Layer**: 3
**Relevant Tasks**: component-development, token-selection

---

## Overview

The DesignerPunk color token system provides a mathematically consistent and semantically meaningful color palette across all platforms. Color tokens follow a primitive→semantic architecture where primitive color families provide the foundation and semantic tokens express design intent.

**Key Principles**:
- **Semantic Meaning**: Each color family has a clear semantic purpose (success, error, warning, etc.)
- **Primitive→Semantic Architecture**: Semantic tokens reference primitive color families
- **Mode-Aware Values**: Colors support light/dark modes with base/wcag themes
- **Cross-Platform Consistency**: Unitless color values convert to platform-specific formats
- **Accessibility First**: WCAG theme variants ensure contrast compliance

---

## Primitive Color Families

### Gray Scale - Neutral Surfaces and Text

| Token Name | Light Base | Dark Base | Use Case |
|------------|------------|-----------|----------|
| `gray100` | #B8B6C8 | #B8B6C8 | Subtle backgrounds, muted text |
| `gray200` | #68658A | #68658A | Secondary text, borders |
| `gray300` | #2D2B3E | #2D2B3E | Primary text, prominent borders |
| `gray400` | #1F1D2E | #1F1D2E | Strong text, container backgrounds |
| `gray500` | #15131F | #15131F | Deep backgrounds, high contrast text |

**Mathematical Relationship**: Systematic gray scale with purple undertones for brand cohesion.

### Black Scale - Deep Backgrounds and Containers

| Token Name | Light Base | Light WCAG | Dark Base | Dark WCAG | Use Case |
|------------|------------|------------|-----------|-----------|----------|
| `black100` | #3A3A45 | #52525C | #3A3A45 | #52525C | Subtle container backgrounds |
| `black200` | #22222A | #2E2E38 | #22222A | #2E2E38 | Container backgrounds, surfaces |
| `black300` | #0A0A0F | #0A0A0F | #0A0A0F | #0A0A0F | Primary backgrounds, deep containers |
| `black400` | #06060A | #06060A | #06060A | #06060A | Very dark system backgrounds |
| `black500` | #000000 | #000000 | #000000 | #000000 | Pure black, maximum contrast |

### White Scale - Light Surfaces and Primary Text

| Token Name | Light Base | Dark Base | Use Case |
|------------|------------|-----------|----------|
| `white100` | #FFFFFF | #FFFFFF | Pure white, maximum contrast, primary surfaces |
| `white200` | #F5F5FA | #F5F5FA | Near-white, subtle surface variations |
| `white300` | #E8E8F0 | #E8E8F0 | Light gray-white, secondary surfaces |
| `white400` | #C5C5D5 | #C5C5D5 | Medium gray-white, borders and dividers |
| `white500` | #9999AB | #9999AB | Dark gray-white, muted text |

### Purple Scale - Primary Brand and Focus States

| Token Name | Light Base | Dark Base | Use Case |
|------------|------------|-----------|----------|
| `purple100` | #F3E0FF | #F3E0FF | Subtle brand backgrounds, highlights |
| `purple200` | #D98AFF | #D98AFF | Brand accents, secondary elements |
| `purple300` | #B026FF | #B026FF | **Primary brand color** - CTAs, links |
| `purple400` | #8D1ECC | #8D1ECC | Brand text, secondary brand elements |
| `purple500` | #63158F | #63158F | Darkest brand, neon glow effects |

**Mathematical Relationship**: Electric purple (#B026FF) as base with systematic progression.

### Green Scale - Success States and Positive Feedback

| Token Name | Light Base | Light WCAG | Dark Base | Dark WCAG | Use Case |
|------------|------------|------------|-----------|-----------|----------|
| `green100` | #E6FFF5 | #E8F5E9 | #E6FFF5 | #B3FFB3 | Subtle success backgrounds |
| `green200` | #80FFBB | #4CAF50 | #80FFBB | #66FF66 | Success highlights (AA Large ~3:1) |
| `green300` | #33FF99 | #388E3C | #33FF99 | #33E033 | Success accents (AA ~4.5:1) |
| `green400` | #00FF88 | #1B5E20 | #00FF88 | #26B326 | **Primary success** - electric green |
| `green500` | #00CC6E | #0D3010 | #00CC6E | #145914 | Neon green glow effects |

**Mathematical Relationship**: Electric green (#00FF88) as base with WCAG-compliant variants.

### Pink Scale - Error States and Urgent Feedback

| Token Name | Light Base | Light WCAG | Dark Base | Dark WCAG | Use Case |
|------------|------------|------------|-----------|-----------|----------|
| `pink100` | #FFDAE8 | #FCE4EC | #FFDAE8 | #FFB3D1 | Subtle error backgrounds |
| `pink200` | #FF82B4 | #E91E63 | #FF82B4 | #FF6BA3 | Error highlights (AA Large ~3:1) |
| `pink300` | #FF2A6D | #C2185B | #FF2A6D | #E63075 | Base pink (AA ~4.5:1) |
| `pink400` | #CC2257 | #880E4F | #CC2257 | #B32659 | **Primary error** - hot pink |
| `pink500` | #801537 | #4D0829 | #801537 | #5C1A33 | Neon pink glow effects |

**Mathematical Relationship**: Hot pink (#FF2A6D) as base with WCAG-compliant variants.

### Orange Scale - Warning States and Secondary CTAs

| Token Name | Light Base | Light WCAG | Dark Base | Dark WCAG | Use Case |
|------------|------------|------------|-----------|-----------|----------|
| `orange100` | #FFE5DC | #FFF3E0 | #FFE5DC | #FFD9A3 | Subtle warning backgrounds |
| `orange200` | #FFB8A0 | #F59E00 | #FFB8A0 | #FFB84D | Warm accents (AA Large ~3:1) |
| `orange300` | #FF6B35 | #B87500 | #FF6B35 | #D99500 | Approachable warnings (AA ~4.5:1) |
| `orange400` | #CC5529 | #8C5A00 | #CC5529 | #A67000 | **Primary warning** |
| `orange500` | #8F3C1D | #4D3100 | #8F3C1D | #5C3D00 | Warning text on light backgrounds |

### Yellow Scale - High-Energy CTAs and Attention

| Token Name | Light Base | Light WCAG | Dark Base | Dark WCAG | Use Case |
|------------|------------|------------|-----------|-----------|----------|
| `yellow100` | #FEFBCC | #FEFBCC | #FEFBCC | #FCF680 | Subtle highlight backgrounds |
| `yellow200` | #FCF680 | #FCF680 | #FCF680 | #F9F002 | Warning highlights |
| `yellow300` | #F9F002 | #F9F002 | #F9F002 | #C7C002 | **Bright yellow** - high-energy CTAs |
| `yellow400` | #C7C002 | #C7C002 | #C7C002 | #8F8B01 | **Attention color** |
| `yellow500` | #8F8B01 | #8F8B01 | #8F8B01 | #8F8B01 | Neon yellow glow effects |

### Cyan Scale - Tech Elements and Data Visualization

| Token Name | Light Base | Dark Base | Use Case |
|------------|------------|-----------|----------|
| `cyan100` | #CCFBFF | #CCFBFF | Subtle tech backgrounds |
| `cyan200` | #80F6FF | #80F6FF | Tech accents, link highlights |
| `cyan300` | #00F0FF | #00F0FF | **Data visualization** - bright cyan |
| `cyan400` | #00C0CC | #00C0CC | **Tech elements** - dark cyan |
| `cyan500` | #00888F | #00888F | Neon cyan glow effects |

### Teal Scale - Informational States

| Token Name | Light Base | Light WCAG | Dark Base | Dark WCAG | Use Case |
|------------|------------|------------|-----------|-----------|----------|
| `teal100` | #D9E8EA | #D9E8EA | #D9E8EA | #D9E8EA | Subtle info backgrounds |
| `teal200` | #4D9BA5 | #4D9BA5 | #4D9BA5 | #4D9BA5 | Info accents |
| `teal300` | #1A535C | #1A535C | #1A535C | #00F0FF | Secondary UI elements |
| `teal400` | #15424A | #15424A | #15424A | #15424A | **Info strong** - dark teal |
| `teal500` | #0F2E33 | #0F2E33 | #0F2E33 | #0F2E33 | Info text on light backgrounds |

### Shadow Colors - Ambient Light Tinting

| Token Name | Value | Use Case |
|------------|-------|----------|
| `shadowBlack100` | #000000 | Pure black - neutral lighting (noon) |
| `shadowBlue100` | #141928 | Cool blue-gray - warm light creates cool shadows |
| `shadowOrange100` | #19140F | Warm gray - cool light creates warm shadows |
| `shadowGray100` | #0F141E | Blue-gray - overcast/ambient lighting |

---

## Semantic Color Tokens

Semantic color tokens provide contextual meaning for specific UI purposes. They reference primitive color families and adapt to light/dark modes automatically.

**Total: 28 semantic color tokens**

### Brand & Interactive (1 token)

| Token Name | Primitive Reference | Use Case |
|------------|---------------------|----------|
| `color.primary` | purple300 (#B026FF) | Primary brand color - buttons, links, CTAs |

### Status & Feedback (8 tokens)

| Token Name | Primitive Reference | Use Case |
|------------|---------------------|----------|
| `color.success.strong` | green400 (#00FF88) | Strong success - icons, text, buttons |
| `color.success.subtle` | green100 (#E6FFF5) | Subtle success - backgrounds |
| `color.warning.strong` | orange400 (#CC5529) | Strong warning - icons, text, buttons |
| `color.warning.subtle` | orange100 (#FFE5DC) | Subtle warning - backgrounds |
| `color.error.strong` | pink400 (#CC2257) | Strong error - icons, text, buttons |
| `color.error.subtle` | pink100 (#FFDAE8) | Subtle error - backgrounds |
| `color.info.strong` | teal400 (#15424A) | Strong info - icons, text, buttons |
| `color.info.subtle` | teal100 (#D9E8EA) | Subtle info - backgrounds |

### Attention & Highlight (2 tokens)

| Token Name | Primitive Reference | Use Case |
|------------|---------------------|----------|
| `color.attention` | yellow400 (#C7C002) | Attention-grabbing elements, notifications |
| `color.highlight` | yellow300 (#F9F002) | Highlighted text, emphasized content |

### Tech & Data (2 tokens)

| Token Name | Primitive Reference | Use Case |
|------------|---------------------|----------|
| `color.tech` | cyan400 (#00C0CC) | Technical elements, code snippets |
| `color.data` | cyan300 (#00F0FF) | Data visualization, metrics |

### Text Hierarchy (3 tokens)

| Token Name | Primitive Reference | Use Case |
|------------|---------------------|----------|
| `color.text.default` | gray300 (#2D2B3E) | Primary text - body content |
| `color.text.muted` | gray200 (#68658A) | Secondary text - less prominent |
| `color.text.subtle` | gray100 (#B8B6C8) | Tertiary text - very subtle elements |

### Contrast Colors (1 token)

| Token Name | Primitive Reference | Use Case |
|------------|---------------------|----------|
| `color.contrast.onPrimary` | white100 (#FFFFFF) | Content (text/icons) on primary backgrounds |

### Surfaces & Backgrounds (4 tokens)

| Token Name | Primitive Reference | Use Case |
|------------|---------------------|----------|
| `color.canvas` | white100 (#FFFFFF) | Base canvas - page backgrounds |
| `color.background` | white100 (#FFFFFF) | Primary background - main content areas |
| `color.surface` | white200 (#F5F5FA) | Surface - cards, elevated containers |
| `color.border` | gray100 (#B8B6C8) | Borders - UI element borders, dividers |

### Icon & Print (2 tokens)

| Token Name | Primitive Reference | Use Case |
|------------|---------------------|----------|
| `color.icon.default` | gray200 (#68658A) | Default icon color - optical balance |
| `color.print.default` | black100 (#3A3A45) | Print media - optimal printing quality |

### Glow Effects (5 tokens)

| Token Name | Primitive Reference | Use Case |
|------------|---------------------|----------|
| `glow.neonPurple` | purple500 (#63158F) | Purple glow - brand emphasis |
| `glow.neonCyan` | cyan500 (#00888F) | Cyan glow - tech emphasis |
| `glow.neonYellow` | yellow500 (#8F8B01) | Yellow glow - attention emphasis |
| `glow.neonGreen` | green500 (#00CC6E) | Green glow - success emphasis |
| `glow.neonPink` | pink500 (#801537) | Pink glow - error emphasis |

---

## Accessibility & WCAG Compliance

### Mode-Aware Values

Color tokens include mode-aware values that automatically adapt to light/dark modes and WCAG compliance levels:

**Base Mode**: Standard color values optimized for visual appeal (cyberpunk aesthetic)
**WCAG Mode**: Adjusted color values that guarantee WCAG 2.1 AA compliance

**Example**:
```typescript
green400: {
  light: {
    base: '#00FF88',    // Electric green (cyberpunk)
    wcag: '#1B5E20'     // WCAG-compliant darker green
  },
  dark: {
    base: '#00FF88',    // Electric green
    wcag: '#26B326'     // WCAG-compliant green for dark mode
  }
}
```

### Contrast Requirements

All WCAG theme color combinations meet **WCAG 2.1 AA** contrast requirements:

**Text Contrast** (Success Criterion 1.4.3):
- Normal text (< 18pt): Minimum 4.5:1 contrast ratio
- Large text (≥ 18pt or ≥ 14pt bold): Minimum 3:1 contrast ratio

**Non-Text Contrast** (Success Criterion 1.4.11):
- UI components and graphical objects: Minimum 3:1 contrast ratio

### Usage Guidelines for Accessibility

**Do**:
- Use semantic color tokens for consistent accessible color combinations
- Use WCAG theme variants when accessibility compliance is required
- Test color combinations with WCAG contrast checkers
- Provide text alternatives for color-coded information

**Don't**:
- Rely solely on color to convey meaning (use icons or text)
- Use base theme colors for text without verifying contrast
- Use color alone to indicate interactive states
- Ignore WCAG mode values when accessibility is required

---

## Cross-Platform Usage

### Unitless Color Values

Color tokens use hex color values that convert to platform-specific formats:

**Base Value**: #B026FF (hex color)

**Platform Conversion**:
- **Web**: #B026FF (hex) or rgb(176, 38, 255)
- **iOS**: UIColor(red: 176/255, green: 38/255, blue: 255/255, alpha: 1.0)
- **Android**: Color(0xFFB026FF)

### Platform-Specific Output

#### Web (CSS Custom Properties)

```css
:root {
  /* Primitive Color Tokens */
  --purple-300: #B026FF;
  --green-400: #00FF88;
  --pink-400: #CC2257;
  --gray-300: #2D2B3E;
  
  /* Semantic Color Tokens */
  --color-primary: var(--purple-300);
  --color-success-strong: var(--green-400);
  --color-error-strong: var(--pink-400);
  --color-text-default: var(--gray-300);
}
```

#### iOS (Swift)

```swift
struct DesignTokens {
    // Primitive Color Tokens
    static let purple300 = UIColor(hex: "#B026FF")
    static let green400 = UIColor(hex: "#00FF88")
    static let pink400 = UIColor(hex: "#CC2257")
    
    // Semantic Color Tokens
    static let colorPrimary = purple300
    static let colorSuccessStrong = green400
    static let colorErrorStrong = pink400
}
```

#### Android (Kotlin)

```kotlin
object DesignTokens {
    // Primitive Color Tokens
    val purple_300 = Color(0xFFB026FF)
    val green_400 = Color(0xFF00FF88)
    val pink_400 = Color(0xFFCC2257)
    
    // Semantic Color Tokens
    val color_primary = purple_300
    val color_success_strong = green_400
    val color_error_strong = pink_400
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
  border: 'purple200'       // Medium purple border
};
```

### When to Use Semantic Tokens

Use semantic color tokens for:
- Interactive elements (buttons, links, form inputs)
- Status indicators (success, error, warning, info)
- Text colors (default, muted, subtle)
- Backgrounds and surfaces
- Standard UI patterns

**Example**:
```typescript
// Component using semantic tokens
<Button 
  background="color.primary"
  textColor="color.contrast.onPrimary"
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

**Purple = Brand**: Primary brand color, interactive elements, brand identity
- Use for: Primary buttons, links, brand elements
- Don't use for: Status indicators (use green/pink/orange/teal)

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

---

## Related Documentation

- **Primitive Color Source**: `src/tokens/ColorTokens.ts` - Primitive color token definitions
- **Semantic Color Source**: `src/tokens/semantic/ColorTokens.ts` - Semantic color token definitions
- **Token System Overview**: `docs/token-system-overview.md` - Complete token system reference
- **Color Palette Update Spec**: `.kiro/specs/015-color-palette-update/design.md` - Design decisions for color updates
- **WCAG Guidelines**: [Web Content Accessibility Guidelines 2.1](https://www.w3.org/WAI/WCAG21/quickref/) - Official WCAG reference
- **Component Development Guide**: `.kiro/steering/Component-Development-Guide.md` - Token usage in component development

---

*This guide provides complete reference for color tokens with semantic meanings and accessible usage guidance that enable consistent, accessible color usage across all platforms.*
