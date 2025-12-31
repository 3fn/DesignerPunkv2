---
inclusion: manual
---

# Accessibility Tokens Guide

**Date**: December 30, 2025
**Last Reviewed**: 2025-12-30
**Purpose**: Complete reference for accessibility-focused tokens including focus indicators, tap areas, and icon sizing
**Organization**: token-documentation
**Scope**: cross-project
**Layer**: 3
**Relevant Tasks**: component-development, accessibility-compliance, token-selection

---

## Overview

The DesignerPunk accessibility token system provides WCAG 2.1 AA compliant tokens for focus indicators, touch targets, and icon sizing. These tokens ensure inclusive design across all platforms while maintaining mathematical consistency with the broader token system.

**Key Principles**:
- **WCAG Compliance**: All tokens map to specific WCAG 2.1 success criteria
- **Compositional Architecture**: Tokens reference existing primitive/semantic tokens
- **Cross-Platform Consistency**: Identical accessibility standards across web, iOS, and Android
- **AI-Friendly**: Clear semantic meaning enables AI agent reasoning about accessibility
- **Extensible**: Pattern supports future accessibility token categories

**Token Categories**:
- **Focus Indicators**: Keyboard navigation visibility (WCAG 2.4.7, 1.4.11)
- **Tap Areas**: Touch target sizing (WCAG 2.5.5, 2.5.8)
- **Icon Sizing**: Typography-paired icon dimensions for visual balance

---

## Focus Indicator Tokens

Focus indicator tokens ensure keyboard navigation is visible and accessible. They follow the compositional architecture pattern, referencing existing primitive tokens rather than hard-coded values.

### WCAG Requirements

**WCAG 2.4.7 Focus Visible (Level AA)**: Any keyboard operable user interface has a mode of operation where the keyboard focus indicator is visible.

**WCAG 1.4.11 Non-text Contrast (Level AA)**: Focus indicators must have at least 3:1 contrast ratio against adjacent colors.

### Token Reference Table

| Token Name | Primitive Reference | Resolved Value | WCAG Criteria |
|------------|---------------------|----------------|---------------|
| `accessibility.focus.offset` | space025 | 2px | 2.4.7 Focus Visible |
| `accessibility.focus.width` | borderWidth200 | 2px | 2.4.7 Focus Visible |
| `accessibility.focus.color` | purple300 | Primary color | 2.4.7, 1.4.11 Non-text Contrast |

### Token Details

#### accessibility.focus.offset

**References**: space025 (2px)

**Purpose**: Positions the focus outline outside element bounds to prevent visual overlap with element borders.

**WCAG Compliance**: 2.4.7 Focus Visible (Level AA)

**Usage**:
- Apply as `outline-offset` in CSS
- Ensures focus ring doesn't overlap with element content
- Creates visual separation between element and focus indicator

#### accessibility.focus.width

**References**: borderWidth200 (2px)

**Purpose**: Provides visible outline thickness that meets accessibility requirements.

**WCAG Compliance**: 2.4.7 Focus Visible (Level AA)

**Usage**:
- Apply as `outline-width` in CSS
- 2px width ensures visibility across different screen sizes
- Consistent with border emphasis tokens for visual harmony

#### accessibility.focus.color

**References**: purple300 (primary color)

**Purpose**: Ensures sufficient contrast for focus indicator visibility.

**WCAG Compliance**: 
- 2.4.7 Focus Visible (Level AA)
- 1.4.11 Non-text Contrast (Level AA) - 3:1 minimum contrast

**Usage**:
- Apply as `outline-color` in CSS
- Primary color ensures brand consistency
- Must maintain 3:1 contrast against adjacent colors

### Cross-Platform Implementation

#### Web (CSS)

```css
/* Focus indicator using accessibility tokens */
.focusable:focus-visible {
  outline: var(--accessibility-focus-width) solid var(--accessibility-focus-color);
  outline-offset: var(--accessibility-focus-offset);
}

/* Generated CSS Custom Properties */
:root {
  --accessibility-focus-offset: 2px;   /* space025 */
  --accessibility-focus-width: 2px;    /* borderWidth200 */
  --accessibility-focus-color: var(--color-purple-300);  /* purple300 */
}
```

#### iOS (Swift)

```swift
struct FocusIndicator: View {
    var body: some View {
        content
            .overlay(
                RoundedRectangle(cornerRadius: cornerRadius)
                    .stroke(
                        DesignTokens.accessibilityFocusColor,
                        lineWidth: DesignTokens.accessibilityFocusWidth
                    )
                    .padding(-DesignTokens.accessibilityFocusOffset)
            )
    }
}

// Token values
struct DesignTokens {
    static let accessibilityFocusOffset: CGFloat = 2  // space025
    static let accessibilityFocusWidth: CGFloat = 2   // borderWidth200
    static let accessibilityFocusColor = Color.purple300
}
```

#### Android (Kotlin)

```kotlin
// Focus indicator modifier
fun Modifier.focusIndicator(
    focused: Boolean
) = this.then(
    if (focused) {
        Modifier.border(
            width = DesignTokens.accessibility_focus_width.dp,
            color = DesignTokens.accessibility_focus_color,
            shape = RoundedCornerShape(cornerRadius)
        ).padding(DesignTokens.accessibility_focus_offset.dp)
    } else {
        Modifier
    }
)

// Token values
object DesignTokens {
    const val accessibility_focus_offset = 2f  // space025
    const val accessibility_focus_width = 2f   // borderWidth200
    val accessibility_focus_color = Purple300
}
```

---

## Tap Area Tokens

Tap area tokens ensure touch targets meet accessibility requirements for users with motor impairments. The system uses precision-targeted multipliers from a 44-unit base (WCAG 2.1 AA minimum).

### WCAG Requirements

**WCAG 2.5.5 Target Size (Level AAA)**: Target size is at least 44×44 CSS pixels.

**WCAG 2.5.8 Target Size (Minimum) (Level AA)**: Target size is at least 24×24 CSS pixels with adequate spacing.

**Platform Guidelines**:
- **iOS Human Interface Guidelines**: 44pt minimum tap target
- **Android Material Design**: 48dp minimum touch target

### Token Reference Table

| Token Name | Value | Multiplier | Grid Alignment | Use Case |
|------------|-------|------------|----------------|----------|
| `tapAreaMinimum` | 44px/pt/dp | 1.00× | No | WCAG 2.1 AA minimum |
| `tapAreaRecommended` | 48px/pt/dp | 1.09× | Yes (8×6) | Enhanced usability |
| `tapAreaComfortable` | 56px/pt/dp | 1.27× | Yes (8×7) | Spacious interaction |
| `tapAreaGenerous` | 64px/pt/dp | 1.45× | Yes (8×8) | Extra spacious |

### Token Details

#### tapAreaMinimum (44 units)

**Mathematical Relationship**: base × 1 = 44 × 1 = 44

**WCAG Compliance**: 2.5.5 Target Size (Level AAA)

**Use Cases**:
- Minimum acceptable touch target size
- Space-constrained interfaces
- Dense UI layouts where larger targets aren't feasible

**Platform Values**:
- Web: 44px
- iOS: 44pt
- Android: 44dp

**Note**: While this meets WCAG AAA, consider using `tapAreaRecommended` for better usability.

#### tapAreaRecommended (48 units)

**Mathematical Relationship**: base × 1.09 = 44 × 1.09 ≈ 48

**Grid Alignment**: Yes (8 × 6 = 48, aligns with 8-unit baseline grid)

**Use Cases**:
- Standard interactive elements (buttons, links, icons)
- Default touch target size for most components
- Balances accessibility with visual design

**Platform Values**:
- Web: 48px
- iOS: 48pt
- Android: 48dp (matches Material Design guidelines)

**Recommendation**: Use as default for most interactive elements.

#### tapAreaComfortable (56 units)

**Mathematical Relationship**: base × 1.27 = 44 × 1.27 ≈ 56

**Grid Alignment**: Yes (8 × 7 = 56, aligns with 8-unit baseline grid)

**Use Cases**:
- Primary action buttons
- Navigation elements
- Touch targets for users with motor impairments
- Interfaces designed for accessibility-first

**Platform Values**:
- Web: 56px
- iOS: 56pt
- Android: 56dp

#### tapAreaGenerous (64 units)

**Mathematical Relationship**: base × 1.45 = 44 × 1.45 ≈ 64

**Grid Alignment**: Yes (8 × 8 = 64, aligns with 8-unit baseline grid)

**Use Cases**:
- Hero call-to-action buttons
- Accessibility-focused interfaces
- Touch targets for users with significant motor impairments
- Large interactive areas

**Platform Values**:
- Web: 64px
- iOS: 64pt
- Android: 64dp

### Cross-Platform Implementation

#### Web (CSS)

```css
:root {
  --tap-area-minimum: 44px;
  --tap-area-recommended: 48px;
  --tap-area-comfortable: 56px;
  --tap-area-generous: 64px;
}

/* Button with recommended tap area */
.button {
  min-width: var(--tap-area-recommended);
  min-height: var(--tap-area-recommended);
}

/* Icon button with minimum tap area */
.icon-button {
  min-width: var(--tap-area-minimum);
  min-height: var(--tap-area-minimum);
}
```

#### iOS (Swift)

```swift
struct DesignTokens {
    static let tapAreaMinimum: CGFloat = 44
    static let tapAreaRecommended: CGFloat = 48
    static let tapAreaComfortable: CGFloat = 56
    static let tapAreaGenerous: CGFloat = 64
}

// Button with recommended tap area
Button("Action") { }
    .frame(minWidth: DesignTokens.tapAreaRecommended,
           minHeight: DesignTokens.tapAreaRecommended)
```

#### Android (Kotlin)

```kotlin
object DesignTokens {
    const val tap_area_minimum = 44
    const val tap_area_recommended = 48
    const val tap_area_comfortable = 56
    const val tap_area_generous = 64
}

// Button with recommended tap area
Button(
    onClick = { },
    modifier = Modifier
        .defaultMinSize(
            minWidth = DesignTokens.tap_area_recommended.dp,
            minHeight = DesignTokens.tap_area_recommended.dp
        )
) {
    Text("Action")
}
```

### Tap Area Validation

The token system includes a validation function to check accessibility compliance:

```typescript
validateTapAreaAccessibility(tapAreaValue: number): {
  isAccessible: boolean;
  level: 'AA' | 'AAA' | 'Below AA';
  recommendation?: string;
}

// Examples:
validateTapAreaAccessibility(44)  // { isAccessible: true, level: 'AA' }
validateTapAreaAccessibility(48)  // { isAccessible: true, level: 'AAA' }
validateTapAreaAccessibility(32)  // { isAccessible: false, level: 'Below AA', recommendation: '...' }
```

---

## Icon Tokens

Icon tokens ensure icons maintain optical balance with their paired typography. The system uses a formula-based approach: `iconSize = fontSize × multiplier`.

### Design Principles

**Typography Pairing**: Each icon size token corresponds to a typography scale level, ensuring icons align visually with text.

**Mathematical Foundation**: Icon sizes are calculated from fontSize × lineHeight (or custom multiplier), maintaining mathematical relationships.

**8pt Vertical Rhythm**: Most icon sizes align with the 8pt baseline grid for consistent vertical rhythm.

### Token Reference Table

| Token Name | Font Size | Multiplier | Icon Size | Typography Context |
|------------|-----------|------------|-----------|-------------------|
| `icon.size050` | 13px | 1.231 (custom) | 16px | caption, legal, labelXs |
| `icon.size075` | 14px | lineHeight075 | 20px | bodySm, buttonSm, labelSm |
| `icon.size100` | 16px | lineHeight100 | 24px | bodyMd, buttonMd, labelMd |
| `icon.size125` | 18px | lineHeight125 | 28px | bodyLg, buttonLg, labelLg |
| `icon.size150` | 20px | lineHeight150 | 28px | h6 (smallest heading) |
| `icon.size200` | 23px | lineHeight200 | 32px | h5 |
| `icon.size300` | 26px | lineHeight300 | 32px | h4 |
| `icon.size400` | 29px | lineHeight400 | 36px | h3 |
| `icon.size500` | 33px | lineHeight500 | 40px | h2 |
| `icon.size600` | 37px | lineHeight600 | 44px | h1 |
| `icon.size700` | 42px | lineHeight700 | 48px | display (hero text) |

### Icon Stroke Width

| Token Name | Reference | Value | Use Case |
|------------|-----------|-------|----------|
| `icon.strokeWidth` | borderWidth200 | 2px | Standard icon outline stroke |

### Token Details

#### icon.size050 (16px)

**Calculation**: fontSize050 (13px) × 1.231 (custom) = 16px

**Typography Context**: Caption, legal text, labelXs

**Note**: Uses custom multiplier instead of lineHeight050 (1.538) for better optical balance with small text. The standard lineHeight would produce 20px, which is too large for 13px text.

#### icon.size100 (24px) - Standard

**Calculation**: fontSize100 (16px) × lineHeight100 (1.5) = 24px

**Typography Context**: bodyMd, buttonMd, labelMd, input fields

**Use Cases**:
- Default icon size for most UI elements
- Inline icons with body text
- Button icons
- Form field icons

**Recommendation**: Use as default icon size for standard UI.

#### icon.size200-700 (32px-48px) - Headings

**Calculation**: fontSize × lineHeight for each scale level

**Typography Context**: Heading levels h5 through display

**Use Cases**:
- Section header icons
- Feature icons
- Hero section icons
- Navigation icons

### Cross-Platform Implementation

#### Web (CSS)

```css
:root {
  /* Icon Size Tokens */
  --icon-size-050: 16px;
  --icon-size-075: 20px;
  --icon-size-100: 24px;
  --icon-size-125: 28px;
  --icon-size-150: 28px;
  --icon-size-200: 32px;
  --icon-size-300: 32px;
  --icon-size-400: 36px;
  --icon-size-500: 40px;
  --icon-size-600: 44px;
  --icon-size-700: 48px;
  
  /* Icon Stroke Width */
  --icon-stroke-width: 2px;
}

/* Icon with standard size */
.icon {
  width: var(--icon-size-100);
  height: var(--icon-size-100);
  stroke-width: var(--icon-stroke-width);
}

/* Icon paired with heading */
.heading-icon {
  width: var(--icon-size-200);
  height: var(--icon-size-200);
}
```

#### iOS (Swift)

```swift
struct DesignTokens {
    // Icon Size Tokens
    static let iconSize050: CGFloat = 16
    static let iconSize075: CGFloat = 20
    static let iconSize100: CGFloat = 24
    static let iconSize125: CGFloat = 28
    static let iconSize150: CGFloat = 28
    static let iconSize200: CGFloat = 32
    static let iconSize300: CGFloat = 32
    static let iconSize400: CGFloat = 36
    static let iconSize500: CGFloat = 40
    static let iconSize600: CGFloat = 44
    static let iconSize700: CGFloat = 48
    
    // Icon Stroke Width
    static let iconStrokeWidth: CGFloat = 2
}

// Icon with standard size
Image(systemName: "star")
    .frame(width: DesignTokens.iconSize100, 
           height: DesignTokens.iconSize100)
```

#### Android (Kotlin)

```kotlin
object DesignTokens {
    // Icon Size Tokens
    const val icon_size_050 = 16
    const val icon_size_075 = 20
    const val icon_size_100 = 24
    const val icon_size_125 = 28
    const val icon_size_150 = 28
    const val icon_size_200 = 32
    const val icon_size_300 = 32
    const val icon_size_400 = 36
    const val icon_size_500 = 40
    const val icon_size_600 = 44
    const val icon_size_700 = 48
    
    // Icon Stroke Width
    const val icon_stroke_width = 2
}

// Icon with standard size
Icon(
    imageVector = Icons.Default.Star,
    contentDescription = "Star",
    modifier = Modifier.size(DesignTokens.icon_size_100.dp)
)
```

---

## WCAG 2.1 AA Compliance Summary

### Success Criteria Coverage

| WCAG Criterion | Level | Token Category | Implementation |
|----------------|-------|----------------|----------------|
| 2.4.7 Focus Visible | AA | Focus Indicators | `accessibility.focus.*` tokens |
| 1.4.11 Non-text Contrast | AA | Focus Indicators | `accessibility.focus.color` (3:1 minimum) |
| 2.5.5 Target Size | AAA | Tap Areas | `tapAreaMinimum` (44px) |
| 2.5.8 Target Size (Minimum) | AA | Tap Areas | All tap area tokens exceed 24px minimum |

### Compliance Checklist

#### Focus Indicators
- [ ] All interactive elements have visible focus indicators
- [ ] Focus indicator uses `accessibility.focus.width` (2px minimum)
- [ ] Focus indicator uses `accessibility.focus.color` with 3:1 contrast
- [ ] Focus indicator offset prevents overlap with element borders

#### Touch Targets
- [ ] All touch targets meet `tapAreaMinimum` (44px) for WCAG AAA
- [ ] Primary actions use `tapAreaRecommended` (48px) or larger
- [ ] Touch targets have adequate spacing (no overlapping hit areas)
- [ ] Icon buttons include invisible touch area expansion if needed

#### Icon Accessibility
- [ ] Icons paired with text use appropriate size token for typography
- [ ] Standalone icons have accessible labels (aria-label, contentDescription)
- [ ] Icon stroke width maintains visibility at all sizes
- [ ] Decorative icons are hidden from assistive technology

---

## Usage Guidelines

### AI Agent Token Selection Guidance

When implementing accessibility features:

1. **Focus indicator needed?**
   → Use all three `accessibility.focus.*` tokens together
   → Combine: offset + width + color for complete focus ring
   → Example: `outline: ${width} solid ${color}; outline-offset: ${offset};`

2. **Touch target sizing?**
   → Default to `tapAreaRecommended` (48px)
   → Use `tapAreaMinimum` (44px) only when space-constrained
   → Use `tapAreaComfortable` (56px) for primary actions
   → Use `tapAreaGenerous` (64px) for accessibility-first interfaces

3. **Icon with body text?**
   → Use `icon.size100` (24px) for standard body text
   → Match icon scale to typography scale (size050 for caption, size200 for h5, etc.)

4. **Icon in button?**
   → Use `icon.size100` for standard buttons
   → Use `icon.size075` for small buttons
   → Use `icon.size125` for large buttons

5. **Standalone icon button?**
   → Ensure touch target meets `tapAreaMinimum` (44px)
   → Icon can be smaller than touch target
   → Add invisible touch area expansion if needed

### Decision Framework

**Accessibility vs Usability**: These tokens serve specific accessibility needs (keyboard navigation, motor impairments, visual impairments) rather than general usability.

**Question to ask**: "Is this for usability (for everyone) or accessibility (usability for specific needs)?"

- **Focus indicators**: Accessibility (keyboard navigation users)
- **Tap areas**: Accessibility (motor impairment users) + Usability (all touch users)
- **Icon sizing**: Usability (visual balance for everyone)

### Common Patterns

#### Complete Focus Indicator

```css
/* Web - Complete focus indicator pattern */
.interactive:focus-visible {
  outline: var(--accessibility-focus-width) solid var(--accessibility-focus-color);
  outline-offset: var(--accessibility-focus-offset);
}
```

#### Icon Button with Tap Area

```css
/* Icon button with proper tap area */
.icon-button {
  /* Visual size */
  width: var(--icon-size-100);  /* 24px icon */
  height: var(--icon-size-100);
  
  /* Touch target expansion */
  min-width: var(--tap-area-recommended);  /* 48px touch target */
  min-height: var(--tap-area-recommended);
  
  /* Center icon in touch target */
  display: flex;
  align-items: center;
  justify-content: center;
}
```

#### Typography-Paired Icon

```css
/* Icon paired with heading */
.heading-with-icon {
  display: flex;
  align-items: center;
  gap: var(--space-100);
}

.heading-with-icon .icon {
  width: var(--icon-size-200);  /* Matches h5 typography */
  height: var(--icon-size-200);
}

.heading-with-icon h5 {
  font-size: var(--font-size-200);  /* 23px */
  line-height: var(--line-height-200);  /* 1.391 */
}
```

---

## Related Documentation

- **Accessibility Token Source**: `src/tokens/semantic/AccessibilityTokens.ts` - Focus indicator token definitions
- **Tap Area Token Source**: `src/tokens/TapAreaTokens.ts` - Touch target token definitions
- **Icon Token Source**: `src/tokens/semantic/IconTokens.ts` - Icon size token definitions
- **Token System Overview**: `docs/token-system-overview.md` - Complete token system reference
- **Component Development Guide**: `./Component Development and Practices Guide.md` - Token usage in component development
- **Spacing Tokens Guide**: `./spacing-tokens.md` - Related spacing token documentation
- **Typography Tokens Guide**: `./typography-tokens.md` - Related typography token documentation

---

*This guide provides complete reference for accessibility-focused tokens that ensure WCAG 2.1 AA compliance across focus indicators, touch targets, and icon sizing.*
