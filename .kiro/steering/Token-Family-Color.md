---
inclusion: manual
---

# Color Tokens Guide

**Date**: 2025-12-08
**Last Reviewed**: 2026-01-25
**Purpose**: Complete reference for color tokens organized by semantic concept with usage guidance
**Organization**: token-documentation
**Scope**: cross-project
**Layer**: 3
**Relevant Tasks**: component-development, token-selection

---

## Overview

The DesignerPunk color token system follows the **Nathan Curtis concept-first naming model**, organizing tokens by semantic meaning for intuitive discovery and AI agent reasoning. Color tokens are structured in a primitive→semantic→component hierarchy.

**Key Principles**:
- **Concept-First Organization**: Tokens grouped by semantic concept (feedback, identity, action, contrast, structure)
- **Self-Documenting Names**: Token names read as sentences explaining their purpose
- **Primitive→Semantic Architecture**: Semantic tokens reference primitive color families
- **RGBA Format**: All colors use RGBA format for native alpha channel support
- **Cross-Platform Consistency**: Unitless color values convert to platform-specific formats
- **Accessibility First**: WCAG theme variants ensure contrast compliance

---

## Semantic Concept Tokens

Semantic concept tokens express meaning independent of any component. They follow the pattern:

```
color.{concept}.{role}.{property?}.{state?}
```

### Feedback Concept

**Purpose**: Communicate system status to users

The feedback concept provides colors for success, error, warning, info, and selection states. Each role includes text, background, and border properties.

#### Success Tokens (3 tokens)

| Token Name | Primitive | RGBA Value | Use Case |
|------------|-----------|------------|----------|
| `color.feedback.success.text` | green400 | rgba(0, 255, 136, 1) | Success text - form validation, confirmation messages |
| `color.feedback.success.background` | green100 | rgba(230, 255, 245, 1) | Success backgrounds - alert backgrounds, success banners |
| `color.feedback.success.border` | green400 | rgba(0, 255, 136, 1) | Success borders - input validation borders, success card outlines |

#### Error Tokens (3 tokens)

| Token Name | Primitive | RGBA Value | Use Case |
|------------|-----------|------------|----------|
| `color.feedback.error.text` | pink400 | rgba(204, 34, 87, 1) | Error text - form validation errors, error messages |
| `color.feedback.error.background` | pink100 | rgba(255, 218, 232, 1) | Error backgrounds - alert backgrounds, error banners |
| `color.feedback.error.border` | pink400 | rgba(204, 34, 87, 1) | Error borders - input validation borders, error card outlines |

#### Warning Tokens (3 tokens)

| Token Name | Primitive | RGBA Value | Use Case |
|------------|-----------|------------|----------|
| `color.feedback.warning.text` | orange400 | rgba(204, 85, 41, 1) | Warning text - caution messages, attention-required indicators |
| `color.feedback.warning.background` | orange100 | rgba(255, 229, 220, 1) | Warning backgrounds - alert backgrounds, caution banners |
| `color.feedback.warning.border` | orange400 | rgba(204, 85, 41, 1) | Warning borders - input validation borders, warning card outlines |

#### Info Tokens (3 tokens)

| Token Name | Primitive | RGBA Value | Use Case |
|------------|-----------|------------|----------|
| `color.feedback.info.text` | teal400 | rgba(21, 66, 74, 1) | Info text - help text, informational messages |
| `color.feedback.info.background` | teal100 | rgba(217, 232, 234, 1) | Info backgrounds - info banners, help sections |
| `color.feedback.info.border` | teal400 | rgba(21, 66, 74, 1) | Info borders - info card outlines, help section borders |

#### Select Tokens (6 tokens)

Select tokens include state (`rest`, `default`) because selection has interaction states.

| Token Name | Primitive | RGBA Value | Use Case |
|------------|-----------|------------|----------|
| `color.feedback.select.text.rest` | cyan400 | rgba(0, 192, 204, 1) | Selected item text - label text when item is selected |
| `color.feedback.select.text.default` | gray200 | rgba(104, 101, 138, 1) | Not-selected item text - label text when item is available |
| `color.feedback.select.background.rest` | cyan100 | rgba(204, 251, 255, 1) | Selected item background - background when item is selected |
| `color.feedback.select.background.default` | gray100 | rgba(184, 182, 200, 1) | Not-selected item background - background when item is available |
| `color.feedback.select.border.rest` | cyan400 | rgba(0, 192, 204, 1) | Selected item border - checkmark base, item border when selected |
| `color.feedback.select.border.default` | gray200 | rgba(104, 101, 138, 1) | Not-selected item border - item border when available |

**Design Note**: Select is placed under feedback as UI response to user action. If additional interaction-based use cases emerge (focus states, drag states), consider migrating to an 'interaction' concept.

---

### Identity Concept

**Purpose**: Distinguish entity types visually

Identity tokens represent core colors for different entity types. They ARE the color (no property suffix needed).

| Token Name | Primitive | RGBA Value | Use Case |
|------------|-----------|------------|----------|
| `color.identity.human` | orange300 | rgba(255, 107, 53, 1) | Human identity - warm, approachable visual identity for human entities |
| `color.identity.agent` | teal200 | rgba(77, 155, 165, 1) | Agent identity - distinct, technical visual identity for AI agent entities |

**Usage**: These tokens are referenced by component tokens (e.g., `color.avatar.human.background` references `color.identity.human`).

---

### Action Concept

**Purpose**: Visual emphasis levels for interactive elements

Action tokens represent visual emphasis levels, not action types. Use `primary` for single, focused instances (hero CTAs) and `secondary` for repetitive instances (action lists) to avoid UI over-saturation.

| Token Name | Primitive | RGBA Value | Use Case |
|------------|-----------|------------|----------|
| `color.action.primary` | purple300 | rgba(176, 38, 255, 1) | Emphasized action - hero CTAs, main buttons, primary interactive elements |
| `color.action.secondary` | black400 | rgba(6, 6, 10, 1) | De-emphasized action - list item buttons, secondary CTAs, repetitive actions |

**Critical Distinction**: `primary`/`secondary` represent visual emphasis, not action type. Both can be CTAs.

```typescript
// Single hero CTA on a page
<ButtonCTA emphasis="primary" />   // → color.action.primary (purple)

// List of 10 action items
<ButtonCTA emphasis="secondary" /> // → color.action.secondary (neutral)
```

---

### Contrast Concept

**Purpose**: Ensure readable content on colored backgrounds

Contrast tokens provide colors for content (text, icons) on colored backgrounds. Naming matches the background the content sits ON.

| Token Name | Primitive | RGBA Value | Use Case |
|------------|-----------|------------|----------|
| `color.contrast.onLight` | black500 | rgba(0, 0, 0, 1) | Dark content on light backgrounds - ensures WCAG AA contrast |
| `color.contrast.onDark` | white100 | rgba(255, 255, 255, 1) | Light content on dark backgrounds - ensures WCAG AA contrast |

**Usage**: Use `onLight` for text/icons on light surfaces, `onDark` for text/icons on dark or colored surfaces.

---

### Structure Concept

**Purpose**: Define visual organization and layering of UI elements

Structure tokens provide foundational colors for UI structure: canvas (base layer), surface (elevated layer), and border (boundaries).

| Token Name | Primitive | RGBA Value | Use Case |
|------------|-----------|------------|----------|
| `color.structure.canvas` | white100 | rgba(255, 255, 255, 1) | Base canvas - page backgrounds, foundational layer |
| `color.structure.surface` | white200 | rgba(245, 245, 250, 1) | Elevated surface - cards, containers, visual hierarchy above canvas |
| `color.structure.border` | gray100 | rgba(184, 182, 200, 1) | Standard borders - UI element borders, dividers |

**Future Expansion**: Surface layering with `.100`, `.200` suffixes when multiple elevation levels are needed.

---

## Component Tokens

Component tokens are tied to specific UI components and follow the pattern:

```
color.{component}.{variant}.{property}
```

### Avatar Component (5 tokens)

Avatar component tokens reference semantic tokens (identity, contrast) rather than primitives directly.

| Token Name | References | RGBA Value | Use Case |
|------------|------------|------------|----------|
| `color.avatar.human.background` | color.identity.human | rgba(255, 107, 53, 1) | Human avatar background |
| `color.avatar.agent.background` | color.identity.agent | rgba(77, 155, 165, 1) | AI agent avatar background |
| `color.avatar.human.icon` | color.contrast.onDark | rgba(255, 255, 255, 1) | Icon on human avatar background |
| `color.avatar.agent.icon` | color.contrast.onDark | rgba(255, 255, 255, 1) | Icon on AI agent avatar background |
| `color.avatar.default.border` | gray100 | rgba(184, 182, 200, 1) | Avatar border for both variants |

### Badge Component (2 tokens)

Badge tokens follow the `{component}.{variant}.{property}` pattern.

| Token Name | Primitive | RGBA Value | Use Case |
|------------|-----------|------------|----------|
| `color.badge.notification.background` | pink400 | rgba(204, 34, 87, 1) | Notification badge background - high-visibility alert |
| `color.badge.notification.text` | white100 | rgba(255, 255, 255, 1) | Notification badge text - 6.33:1 contrast ratio |

**WCAG Compliance**: The notification badge color combination achieves a **6.33:1 contrast ratio**, exceeding WCAG AA requirements (4.5:1 for normal text).

---

## Additional Semantic Tokens

### Attention & Highlight (2 tokens)

| Token Name | Primitive | RGBA Value | Use Case |
|------------|-----------|------------|----------|
| `color.attention` | yellow400 | rgba(199, 192, 2, 1) | Attention-grabbing elements, notifications |
| `color.highlight` | yellow300 | rgba(249, 240, 2, 1) | Highlighted text, emphasized content |

### Tech & Data (2 tokens)

| Token Name | Primitive | RGBA Value | Use Case |
|------------|-----------|------------|----------|
| `color.tech` | cyan400 | rgba(0, 192, 204, 1) | Technical elements, code snippets |
| `color.data` | cyan300 | rgba(0, 240, 255, 1) | Data visualization, metrics |

### Text Hierarchy (3 tokens)

| Token Name | Primitive | RGBA Value | Use Case |
|------------|-----------|------------|----------|
| `color.text.default` | gray300 | rgba(45, 43, 62, 1) | Primary text - body content |
| `color.text.muted` | gray200 | rgba(104, 101, 138, 1) | Secondary text - less prominent |
| `color.text.subtle` | gray100 | rgba(184, 182, 200, 1) | Tertiary text - very subtle elements |

### Icon & Print (2 tokens)

| Token Name | Primitive | RGBA Value | Use Case |
|------------|-----------|------------|----------|
| `color.icon.default` | gray200 | rgba(104, 101, 138, 1) | Default icon color - optical balance |
| `color.print.default` | black100 | rgba(58, 58, 69, 1) | Print media - optimal printing quality |

### Background Variant (1 token)

| Token Name | Primitive | RGBA Value | Use Case |
|------------|-----------|------------|----------|
| `color.background.primary.subtle` | purple100 | rgba(243, 224, 255, 1) | Subtle primary background - hover states, selections |

---

## Glow Effects (5 tokens)

Glow tokens are a separate family (not under `color.*`) because glow is an effect, not a color semantic.

| Token Name | Primitive | RGBA Value | Use Case |
|------------|-----------|------------|----------|
| `glow.neonPurple` | purple500 | rgba(99, 21, 143, 1) | Purple glow - brand emphasis |
| `glow.neonCyan` | cyan500 | rgba(0, 136, 143, 1) | Cyan glow - tech emphasis |
| `glow.neonYellow` | yellow500 | rgba(143, 139, 1, 1) | Yellow glow - attention emphasis |
| `glow.neonGreen` | green500 | rgba(0, 204, 110, 1) | Green glow - success emphasis |
| `glow.neonPink` | pink500 | rgba(128, 21, 55, 1) | Pink glow - error emphasis |

---

## Primitive Color Families

Primitive color tokens provide the foundation for semantic tokens. All primitives use RGBA format.

### Gray Scale - Neutral Surfaces and Text

| Token Name | RGBA Value | Use Case |
|------------|------------|----------|
| `gray100` | rgba(184, 182, 200, 1) | Subtle backgrounds, muted text |
| `gray200` | rgba(104, 101, 138, 1) | Secondary text, borders |
| `gray300` | rgba(45, 43, 62, 1) | Primary text, prominent borders |
| `gray400` | rgba(31, 29, 46, 1) | Strong text, container backgrounds |
| `gray500` | rgba(21, 19, 31, 1) | Deep backgrounds, high contrast text |

### Black Scale - Deep Backgrounds and Containers

| Token Name | RGBA Value (Base) | RGBA Value (WCAG) | Use Case |
|------------|-------------------|-------------------|----------|
| `black100` | rgba(58, 58, 69, 1) | rgba(82, 82, 92, 1) | Subtle container backgrounds |
| `black200` | rgba(34, 34, 42, 1) | rgba(46, 46, 56, 1) | Container backgrounds, surfaces |
| `black300` | rgba(10, 10, 15, 1) | rgba(10, 10, 15, 1) | Primary backgrounds, deep containers |
| `black400` | rgba(6, 6, 10, 1) | rgba(6, 6, 10, 1) | Very dark system backgrounds |
| `black500` | rgba(0, 0, 0, 1) | rgba(0, 0, 0, 1) | Pure black, maximum contrast |

### White Scale - Light Surfaces and Primary Text

| Token Name | RGBA Value | Use Case |
|------------|------------|----------|
| `white100` | rgba(255, 255, 255, 1) | Pure white, maximum contrast, primary surfaces |
| `white200` | rgba(245, 245, 250, 1) | Near-white, subtle surface variations |
| `white300` | rgba(232, 232, 240, 1) | Light gray-white, secondary surfaces |
| `white400` | rgba(197, 197, 213, 1) | Medium gray-white, borders and dividers |
| `white500` | rgba(153, 153, 171, 1) | Dark gray-white, muted text |

### Purple Scale - Primary Brand and Focus States

| Token Name | RGBA Value | Use Case |
|------------|------------|----------|
| `purple100` | rgba(243, 224, 255, 1) | Subtle brand backgrounds, highlights |
| `purple200` | rgba(217, 138, 255, 1) | Brand accents, secondary elements |
| `purple300` | rgba(176, 38, 255, 1) | **Primary brand color** - CTAs, links |
| `purple400` | rgba(141, 30, 204, 1) | Brand text, secondary brand elements |
| `purple500` | rgba(99, 21, 143, 1) | Darkest brand, neon glow effects |

### Green Scale - Success States

| Token Name | RGBA Value (Base) | RGBA Value (WCAG) | Use Case |
|------------|-------------------|-------------------|----------|
| `green100` | rgba(230, 255, 245, 1) | rgba(232, 245, 233, 1) | Subtle success backgrounds |
| `green200` | rgba(128, 255, 187, 1) | rgba(76, 175, 80, 1) | Success highlights |
| `green300` | rgba(51, 255, 153, 1) | rgba(56, 142, 60, 1) | Success accents |
| `green400` | rgba(0, 255, 136, 1) | rgba(27, 94, 32, 1) | **Primary success** - electric green |
| `green500` | rgba(0, 204, 110, 1) | rgba(13, 48, 16, 1) | Neon green glow effects |

### Pink Scale - Error States

| Token Name | RGBA Value (Base) | RGBA Value (WCAG) | Use Case |
|------------|-------------------|-------------------|----------|
| `pink100` | rgba(255, 218, 232, 1) | rgba(252, 228, 236, 1) | Subtle error backgrounds |
| `pink200` | rgba(255, 130, 180, 1) | rgba(233, 30, 99, 1) | Error highlights |
| `pink300` | rgba(255, 42, 109, 1) | rgba(194, 24, 91, 1) | Base pink |
| `pink400` | rgba(204, 34, 87, 1) | rgba(136, 14, 79, 1) | **Primary error** - hot pink |
| `pink500` | rgba(128, 21, 55, 1) | rgba(77, 8, 41, 1) | Neon pink glow effects |

### Orange Scale - Warning States

| Token Name | RGBA Value (Base) | RGBA Value (WCAG) | Use Case |
|------------|-------------------|-------------------|----------|
| `orange100` | rgba(255, 229, 220, 1) | rgba(255, 243, 224, 1) | Subtle warning backgrounds |
| `orange200` | rgba(255, 184, 160, 1) | rgba(245, 158, 0, 1) | Warm accents |
| `orange300` | rgba(255, 107, 53, 1) | rgba(184, 117, 0, 1) | Approachable warnings |
| `orange400` | rgba(204, 85, 41, 1) | rgba(140, 90, 0, 1) | **Primary warning** |
| `orange500` | rgba(143, 60, 29, 1) | rgba(77, 49, 0, 1) | Warning text on light backgrounds |

### Yellow Scale - Attention and Highlights

| Token Name | RGBA Value (Base) | RGBA Value (WCAG) | Use Case |
|------------|-------------------|-------------------|----------|
| `yellow100` | rgba(254, 251, 204, 1) | rgba(254, 251, 204, 1) | Subtle highlight backgrounds |
| `yellow200` | rgba(252, 246, 128, 1) | rgba(252, 246, 128, 1) | Warning highlights |
| `yellow300` | rgba(249, 240, 2, 1) | rgba(249, 240, 2, 1) | **Bright yellow** - high-energy CTAs |
| `yellow400` | rgba(199, 192, 2, 1) | rgba(199, 192, 2, 1) | **Attention color** |
| `yellow500` | rgba(143, 139, 1, 1) | rgba(143, 139, 1, 1) | Neon yellow glow effects |

### Cyan Scale - Tech Elements and Data

| Token Name | RGBA Value | Use Case |
|------------|------------|----------|
| `cyan100` | rgba(204, 251, 255, 1) | Subtle tech backgrounds |
| `cyan200` | rgba(128, 246, 255, 1) | Tech accents, link highlights |
| `cyan300` | rgba(0, 240, 255, 1) | **Data visualization** - bright cyan |
| `cyan400` | rgba(0, 192, 204, 1) | **Tech elements** - dark cyan |
| `cyan500` | rgba(0, 136, 143, 1) | Neon cyan glow effects |

### Teal Scale - Informational States

| Token Name | RGBA Value (Base) | RGBA Value (WCAG) | Use Case |
|------------|-------------------|-------------------|----------|
| `teal100` | rgba(217, 232, 234, 1) | rgba(217, 232, 234, 1) | Subtle info backgrounds |
| `teal200` | rgba(77, 155, 165, 1) | rgba(77, 155, 165, 1) | Info accents |
| `teal300` | rgba(26, 83, 92, 1) | rgba(0, 240, 255, 1) | Secondary UI elements |
| `teal400` | rgba(21, 66, 74, 1) | rgba(21, 66, 74, 1) | **Info strong** - dark teal |
| `teal500` | rgba(15, 46, 51, 1) | rgba(15, 46, 51, 1) | Info text on light backgrounds |

---

## Accessibility & WCAG Compliance

### Mode-Aware Values

Color tokens include mode-aware values that automatically adapt to light/dark modes and WCAG compliance levels:

- **Base Mode**: Standard color values optimized for visual appeal (cyberpunk aesthetic)
- **WCAG Mode**: Adjusted color values that guarantee WCAG 2.1 AA compliance

### Contrast Requirements

All WCAG theme color combinations meet **WCAG 2.1 AA** contrast requirements:

- **Normal text (< 18pt)**: Minimum 4.5:1 contrast ratio
- **Large text (≥ 18pt or ≥ 14pt bold)**: Minimum 3:1 contrast ratio
- **UI components and graphical objects**: Minimum 3:1 contrast ratio

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

### RGBA Format

All color tokens use RGBA format for native alpha channel support and direct cross-platform color API mapping.

**Platform Conversion**:
- **Web**: `rgba(r, g, b, a)` CSS format
- **iOS**: `UIColor(red: r/255, green: g/255, blue: b/255, alpha: a)`
- **Android**: `Color.argb(a, r, g, b)` or `0xAARRGGBB` format

### Platform-Specific Output Examples

#### Web (CSS Custom Properties)

```css
:root {
  /* Semantic Concept Tokens */
  --color-feedback-success-text: rgba(0, 255, 136, 1);
  --color-feedback-error-text: rgba(204, 34, 87, 1);
  --color-action-primary: rgba(176, 38, 255, 1);
  --color-contrast-on-dark: rgba(255, 255, 255, 1);
  --color-structure-canvas: rgba(255, 255, 255, 1);
  
  /* Component Tokens */
  --color-avatar-human-background: rgba(255, 107, 53, 1);
  --color-badge-notification-background: rgba(204, 34, 87, 1);
}
```

#### iOS (Swift)

```swift
struct DesignTokens {
    // Semantic Concept Tokens
    static let colorFeedbackSuccessText = UIColor(red: 0, green: 1, blue: 0.53, alpha: 1)
    static let colorFeedbackErrorText = UIColor(red: 0.8, green: 0.13, blue: 0.34, alpha: 1)
    static let colorActionPrimary = UIColor(red: 0.69, green: 0.15, blue: 1, alpha: 1)
    
    // Component Tokens
    static let colorAvatarHumanBackground = UIColor(red: 1, green: 0.42, blue: 0.21, alpha: 1)
}
```

#### Android (Kotlin)

```kotlin
object DesignTokens {
    // Semantic Concept Tokens
    val colorFeedbackSuccessText = Color.argb(255, 0, 255, 136)
    val colorFeedbackErrorText = Color.argb(255, 204, 34, 87)
    val colorActionPrimary = Color.argb(255, 176, 38, 255)
    
    // Component Tokens
    val colorAvatarHumanBackground = Color.argb(255, 255, 107, 53)
}
```

---

## Usage Guidelines

### When to Use Semantic Concept Tokens

Use semantic concept tokens for:
- **Feedback states**: Success, error, warning, info messages and indicators
- **Identity differentiation**: Human vs agent visual distinction
- **Action emphasis**: Primary vs secondary interactive elements
- **Contrast requirements**: Content on colored backgrounds
- **Structural elements**: Canvas, surface, and border colors

```typescript
// Feedback example
<Alert 
  background="color.feedback.success.background"
  textColor="color.feedback.success.text"
  borderColor="color.feedback.success.border"
>
  Success!
</Alert>

// Action example
<Button 
  background="color.action.primary"
  textColor="color.contrast.onDark"
>
  Submit
</Button>
```

### When to Use Component Tokens

Use component tokens when:
- Building component-specific styling
- Need component-scoped token discovery
- Component has unique variants (human/agent, notification)

```typescript
// Avatar using component tokens
<Avatar 
  background="color.avatar.human.background"
  iconColor="color.avatar.human.icon"
/>
```

### When to Use Primitive Tokens

Use primitive color tokens when:
- No semantic token exists for your use case
- Building new component-level tokens that reference primitives
- Creating new semantic color patterns
- Need specific color variant (100-500) for visual hierarchy

```typescript
// Component-level token referencing primitive
export const chipTokens = {
  background: 'purple100',  // Light purple background
  border: 'purple200'       // Medium purple border
};
```

### Color Semantic Meanings

| Color | Meaning | Use For | Don't Use For |
|-------|---------|---------|---------------|
| **Purple** | Brand | Primary buttons, links, brand elements | Status indicators |
| **Green** | Success | Success messages, confirmation, positive feedback | Neutral info, warnings |
| **Pink** | Error | Error messages, delete buttons, critical warnings | Success states, neutral info |
| **Orange** | Warning | Warning messages, caution buttons, important notices | Success states, errors |
| **Yellow** | Attention | Highlights, emphasis, attention-grabbing elements | Status indicators |
| **Cyan** | Tech/Data | Code blocks, data charts, technical information | Status indicators, brand |
| **Teal** | Info | Info messages, help text, neutral notifications | Success states, brand |

---

## Related Documentation

- **Design Authority**: `.kiro/specs/051-semantic-token-naming-restructure/design-outline.md`
- **Semantic Color Source**: `src/tokens/semantic/ColorTokens.ts`
- **Primitive Color Source**: `src/tokens/ColorTokens.ts`
- **Token System Overview**: `docs/token-system-overview.md`
- **Component Development Guide**: `.kiro/steering/Component-Development-Guide.md`
- **Token Governance**: `.kiro/steering/Token-Governance.md`
- **WCAG Guidelines**: [Web Content Accessibility Guidelines 2.1](https://www.w3.org/WAI/WCAG21/quickref/)

---

*This guide provides complete reference for color tokens organized by semantic concept with usage guidance that enables consistent, accessible color usage across all platforms.*
