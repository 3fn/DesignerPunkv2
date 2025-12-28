# Component Consumption Patterns: Blend Token Infrastructure Audit

**Date**: December 28, 2025
**Spec**: 024 - Blend Token Infrastructure Audit
**Phase**: 2 - Current System Assessment
**Task**: 2.3 - Document component consumption patterns
**Organization**: spec-validation
**Scope**: 024-blend-token-infrastructure-audit

---

## Overview

This document analyzes how components currently reference tokens and handle interactive states (hover, focus, pressed, disabled) across all platforms (web, iOS, Android). The analysis identifies workarounds being used in lieu of blend token consumption.

**Key Finding**: Components use direct color token references and platform-specific workarounds for interactive states rather than blend-modified colors. This confirms the Phase 1 finding that the gap is in runtime application, not token definition.

---

## Component Analysis Summary

### Components Analyzed

| Component | Platforms | Interactive States | Blend Token Usage |
|-----------|-----------|-------------------|-------------------|
| TextInputField | Web, iOS, Android | Focus, Error, Success | ❌ None - uses `color.primary` directly |
| ButtonCTA | Web, iOS, Android | Hover, Focus, Pressed, Disabled | ❌ None - uses opacity/filter workarounds |
| Icon | Web, iOS, Android | N/A (decorative) | ❌ None - uses `currentColor` inheritance |
| Container | Web, iOS, Android | Focus | ❌ None - uses `color.primary` directly |

---

## Token Reference Patterns by Platform

### Web Platform (CSS Custom Properties)

**Pattern**: Components reference semantic tokens via CSS custom properties.

```css
/* Example from ButtonCTA.web.css */
.button-cta--primary {
  background-color: var(--color-primary);
  color: var(--color-text-on-primary);
}

/* Example from TextInputField.web.ts */
.input-element:focus {
  border-color: var(--color-primary);
}
```

**Token Categories Used**:
- `--color-*` (semantic color tokens)
- `--typography-*` (typography tokens)
- `--space-*` (spacing tokens)
- `--radius-*` (radius tokens)
- `--border-*` (border tokens)
- `--motion-*` (motion tokens)
- `--accessibility-*` (accessibility tokens)
- `--opacity-*` (opacity tokens)
- `--shadow-*` (shadow tokens)

**Missing**: `--blend-*` tokens are NOT referenced in any web component CSS.

---

### iOS Platform (Swift Constants)

**Pattern**: Components reference tokens via `DesignTokens` struct constants.

```swift
// Example from TextInputField.ios.swift
Color(DesignTokens.color.primary)
DesignTokens.typography.labelMd.fontSize
DesignTokens.space.inset.100
DesignTokens.motion.floatLabel.duration

// Example from ButtonCTA.ios.swift
Color(DesignTokens.colorPrimary)
DesignTokens.spaceInset200
DesignTokens.radius100
```

**Token Categories Used**:
- `DesignTokens.color.*` (semantic color tokens)
- `DesignTokens.typography.*` (typography tokens)
- `DesignTokens.space.*` (spacing tokens)
- `DesignTokens.radius*` (radius tokens)
- `DesignTokens.motion.*` (motion tokens)
- `DesignTokens.accessibility.*` (accessibility tokens)
- `DesignTokens.icon.*` (icon tokens)

**Missing**: No `DesignTokens.blend.*` references in any iOS component.

---

### Android Platform (Kotlin Constants)

**Pattern**: Components reference tokens via `DesignTokens` object constants.

```kotlin
// Example from TextInputField.android.kt
Color(DesignTokens.color_primary)
DesignTokens.font_size_100.sp
DesignTokens.space_inset_100.toInt()
DesignTokens.radius_150.toInt()

// Example from ButtonCTA.android.kt
Color(DesignTokens.color_primary)
DesignTokens.space_inset_200.toInt()
DesignTokens.radius_100.toInt()
```

**Token Categories Used**:
- `DesignTokens.color_*` (semantic color tokens)
- `DesignTokens.font_*` (typography tokens)
- `DesignTokens.space_*` (spacing tokens)
- `DesignTokens.radius_*` (radius tokens)
- `DesignTokens.border_*` (border tokens)
- `DesignTokens.icon_*` (icon tokens)

**Missing**: No `DesignTokens.blend_*` references in any Android component.

---

## Interactive State Patterns

### Hover State (Web Only)

**Expected Pattern** (per blend-tokens spec):
```css
.button:hover {
  /* Apply blend.hoverDarker (8% darker) to background */
  background-color: blend(var(--color-primary), var(--blend-hover-darker));
}
```

**Actual Pattern** (ButtonCTA.web.css):
```css
/* WORKAROUND: Uses opacity reduction instead of blend token */
.button-cta:hover:not(:disabled) {
  opacity: calc(1 - var(--opacity-100)); /* 100% - 8% = 92% */
}
```

**Analysis**:
- Uses opacity token (`--opacity-100` = 8%) as workaround
- Affects entire element, not just background color
- Not equivalent to blend token behavior (blend modifies color, opacity affects transparency)
- CSS comment acknowledges this is an approximation

---

### Focus State

**Expected Pattern** (per blend-tokens spec):
```css
.input:focus {
  /* Apply blend.focusSaturate (8% more saturated) to border */
  border-color: blend(var(--color-primary), var(--blend-focus-saturate));
}
```

**Actual Pattern** (TextInputField.web.ts):
```css
/* WORKAROUND: Uses color.primary directly without saturation modification */
.input-element:focus {
  border-color: var(--color-primary);
}

/* Focus ring uses accessibility tokens, not blend tokens */
.input-element:focus-visible {
  outline: var(--accessibility-focus-width) solid var(--accessibility-focus-color);
  outline-offset: var(--accessibility-focus-offset);
}
```

**iOS Pattern** (TextInputField.ios.swift):
```swift
// WORKAROUND: Uses color.primary directly
private var labelColor: Color {
    if isFocused {
        return Color(DesignTokens.color.primary)  // No saturation modification
    }
}
```

**Android Pattern** (TextInputField.android.kt):
```kotlin
// WORKAROUND: Uses colorPrimary directly
val labelColor by animateColorAsState(
    targetValue = when {
        isFocused -> colorPrimary  // No saturation modification
    }
)
```

**Analysis**:
- All platforms use `color.primary` directly for focus states
- No saturation modification applied (blend.focusSaturate not used)
- Focus ring uses accessibility tokens (correct for outline, but border color could use blend)

---

### Pressed/Active State

**Expected Pattern** (per blend-tokens spec):
```css
.button:active {
  /* Apply blend.pressedDarker (12% darker) to background */
  background-color: blend(var(--color-primary), var(--blend-pressed-darker));
}
```

**Actual Pattern** (ButtonCTA.web.css):
```css
/* WORKAROUND: Uses opacity reduction instead of blend token */
.button-cta:active:not(:disabled) {
  opacity: calc(1 - var(--opacity-200)); /* 100% - 16% = 84% */
}
```

**iOS Pattern** (ButtonCTA.ios.swift):
```swift
// WORKAROUND: Uses scale transform instead of color modification
.scaleEffect(isPressed ? DesignTokens.scale096 : DesignTokens.scale100)
```

**Android Pattern** (ButtonCTA.android.kt):
```kotlin
// WORKAROUND: Uses Material ripple effect instead of color modification
val rippleIndication = rememberRipple(
    color = colorPrimary.copy(alpha = 0.16f)
)
```

**Analysis**:
- Web: Uses opacity reduction (affects entire element)
- iOS: Uses scale transform (no color modification)
- Android: Uses Material ripple (overlay effect, not color modification)
- None use blend tokens for pressed state color modification

---

### Disabled State

**Expected Pattern** (per blend-tokens spec):
```css
.button:disabled {
  /* Apply blend.disabledDesaturate (12% less saturated) to background */
  background-color: blend(var(--color-primary), var(--blend-disabled-desaturate));
}
```

**Actual Pattern** (ButtonCTA.web.css):
```css
/* WORKAROUND: Uses opacity reduction instead of desaturation blend */
.button-cta:disabled,
.button-cta--disabled {
  opacity: 0.6; /* Approximates blend.disabledDesaturate (12% less saturated) */
  cursor: not-allowed;
  pointer-events: none;
}
```

**CSS Comment from ButtonCTA.web.css**:
```css
/**
 * Disabled state.
 * 
 * Should use blend.disabledDesaturate token (12% less saturated).
 * 
 * CSS Limitation: CSS doesn't support desaturation blending directly via custom properties.
 * The blend token exists in the token system but cannot be applied in CSS without:
 * 1. Build-time color calculation (generate desaturated color values)
 * 2. CSS filter: saturate() function (affects all colors, not just base color)
 * 3. Opacity approximation (current approach: opacity 0.6 ≈ muted appearance)
 * 
 * Current approach: Use opacity: 0.6 as approximation of desaturated appearance.
 */
```

**iOS Pattern** (ButtonCTA.ios.swift):
```swift
// WORKAROUND: Uses disabled modifier (SwiftUI handles appearance)
.disabled(disabled)
```

**Android Pattern** (ButtonCTA.android.kt):
```kotlin
// WORKAROUND: Uses alpha reduction instead of desaturation
color = if (disabled) {
    styleConfig.backgroundColor.copy(alpha = 0.38f)
} else {
    styleConfig.backgroundColor
}
```

**Analysis**:
- Web: Uses opacity 0.6 (acknowledged workaround in CSS comments)
- iOS: Relies on SwiftUI's built-in disabled handling
- Android: Uses alpha reduction (0.38f = Material Design disabled opacity)
- None use blend.disabledDesaturate for actual desaturation

---

## TextInputField Current Approach

### Token Usage Summary

| Token Category | Web | iOS | Android |
|----------------|-----|-----|---------|
| Color (semantic) | ✅ `--color-*` | ✅ `DesignTokens.color.*` | ✅ `DesignTokens.color_*` |
| Typography | ✅ `--typography-*` | ✅ `DesignTokens.typography.*` | ✅ `DesignTokens.font_*` |
| Spacing | ✅ `--space-*` | ✅ `DesignTokens.space.*` | ✅ `DesignTokens.space_*` |
| Motion | ✅ `--motion-*` | ✅ `DesignTokens.motion.*` | ✅ `motionFloatLabelDuration` |
| Accessibility | ✅ `--accessibility-*` | ✅ `DesignTokens.accessibility.*` | ✅ `DesignTokens.accessibility_*` |
| Blend | ❌ Not used | ❌ Not used | ❌ Not used |

### Interactive State Implementation

**Focus State**:
- Uses `color.primary` directly for border and label color
- No saturation modification (blend.focusSaturate not applied)
- Focus ring uses accessibility tokens (correct)

**Error State**:
- Uses `color.error.strong` directly
- No blend modification

**Success State**:
- Uses `color.success.strong` directly
- No blend modification

**Workaround Evidence**:
```typescript
// TextInputField.web.ts - Focus state
.input-element:focus {
  border-color: var(--color-primary);  // Direct color, no blend
}

.input-wrapper.focused .input-label.floated {
  color: var(--color-primary);  // Direct color, no blend
}
```

---

## ButtonCTA Current Approach

### Token Usage Summary

| Token Category | Web | iOS | Android |
|----------------|-----|-----|---------|
| Color (semantic) | ✅ `--color-*` | ✅ `DesignTokens.color*` | ✅ `DesignTokens.color_*` |
| Typography | ✅ `--typography-*` | ✅ `DesignTokens.typography*` | ✅ `DesignTokens.font_*` |
| Spacing | ✅ `--space-*` | ✅ `DesignTokens.space*` | ✅ `DesignTokens.space_*` |
| Radius | ✅ `--radius-*` | ✅ `DesignTokens.radius*` | ✅ `DesignTokens.radius_*` |
| Border | ✅ `--border-*` | ✅ `DesignTokens.border*` | ✅ `DesignTokens.border_*` |
| Opacity | ✅ `--opacity-*` | ❌ Not used | ❌ Not used |
| Blend | ❌ Not used | ❌ Not used | ❌ Not used |

### Interactive State Implementation

**Hover State** (Web only):
- Uses opacity reduction: `opacity: calc(1 - var(--opacity-100))`
- Workaround: Affects entire element, not just background

**Focus State**:
- Uses accessibility tokens for focus ring
- No blend modification to colors

**Pressed State**:
- Web: Uses opacity reduction: `opacity: calc(1 - var(--opacity-200))`
- iOS: Uses scale transform: `scaleEffect(isPressed ? 0.96 : 1.0)`
- Android: Uses Material ripple effect

**Disabled State**:
- Web: Uses `opacity: 0.6` (acknowledged workaround)
- iOS: Uses SwiftUI `.disabled()` modifier
- Android: Uses `alpha: 0.38f` (Material Design pattern)

### Icon Optical Balance

**Expected Pattern** (per blend-tokens spec):
```css
/* Apply color.icon.opticalBalance (8% lighter) to icons */
.button-cta__icon {
  color: blend(var(--color-primary), var(--blend-200), lighter);
}
```

**Actual Pattern** (ButtonCTA.web.css):
```css
/* WORKAROUND: Uses CSS filter instead of blend token */
.button-cta--secondary .button-cta__icon,
.button-cta--tertiary .button-cta__icon {
  filter: brightness(1.08); /* Approximates color.icon.opticalBalance (8% lighter) */
}
```

**CSS Comment from ButtonCTA.web.css**:
```css
/**
 * Icon optical balance for secondary and tertiary buttons.
 * 
 * CSS Limitation: CSS doesn't support color blending directly via custom properties.
 * The blend token exists in the token system but cannot be applied in CSS without:
 * 1. Build-time color calculation (generate blended color values)
 * 2. CSS color-mix() function (limited browser support as of 2025)
 * 3. Filter approximation (current approach: brightness(1.08) ≈ 8% lighter)
 * 
 * Current approach: Use filter: brightness(1.08) as approximation of 8% lighter blend.
 */
```

---

## Workaround Summary

### Workarounds Identified

| Interactive State | Expected (Blend Token) | Actual Workaround | Platform |
|-------------------|------------------------|-------------------|----------|
| Hover | `blend.hoverDarker` (8% darker) | `opacity: 92%` | Web |
| Focus | `blend.focusSaturate` (8% saturate) | `color.primary` direct | All |
| Pressed | `blend.pressedDarker` (12% darker) | `opacity: 84%` | Web |
| Pressed | `blend.pressedDarker` (12% darker) | Scale transform | iOS |
| Pressed | `blend.pressedDarker` (12% darker) | Material ripple | Android |
| Disabled | `blend.disabledDesaturate` (12% desaturate) | `opacity: 0.6` | Web |
| Disabled | `blend.disabledDesaturate` (12% desaturate) | SwiftUI disabled | iOS |
| Disabled | `blend.disabledDesaturate` (12% desaturate) | `alpha: 0.38f` | Android |
| Icon Balance | `color.icon.opticalBalance` (8% lighter) | `filter: brightness(1.08)` | Web |
| Icon Balance | `color.icon.opticalBalance` (8% lighter) | Color calculation | iOS/Android |

### Why Workarounds Exist

The CSS comments in ButtonCTA.web.css explicitly document the limitation:

> "CSS doesn't support color blending directly via custom properties. The blend token exists in the token system but cannot be applied in CSS without:
> 1. Build-time color calculation (generate blended color values)
> 2. CSS color-mix() function (limited browser support as of 2025)
> 3. Filter approximation (current approach)"

**Root Cause**: The blend token system defines transformations but doesn't provide a consumption mechanism. Components cannot:
1. Reference blend tokens in CSS (no `--blend-*` custom properties with usable values)
2. Apply blend calculations at runtime (no JavaScript utilities in build output)
3. Use pre-calculated blended colors (not generated at build time)

---

## Cross-Platform Consistency Analysis

### Consistent Patterns (Working)

| Pattern | Web | iOS | Android | Consistent? |
|---------|-----|-----|---------|-------------|
| Color token reference | CSS vars | Swift constants | Kotlin constants | ✅ Yes |
| Typography tokens | CSS vars | Swift constants | Kotlin constants | ✅ Yes |
| Spacing tokens | CSS vars | Swift constants | Kotlin constants | ✅ Yes |
| Focus ring | Accessibility tokens | Accessibility tokens | Accessibility tokens | ✅ Yes |

### Inconsistent Patterns (Due to Blend Gap)

| Pattern | Web | iOS | Android | Consistent? |
|---------|-----|-----|---------|-------------|
| Hover feedback | Opacity reduction | N/A | N/A | ⚠️ Web-only |
| Pressed feedback | Opacity reduction | Scale transform | Material ripple | ❌ No |
| Disabled appearance | Opacity 0.6 | SwiftUI default | Alpha 0.38 | ❌ No |
| Icon optical balance | CSS filter | Color calculation | Color calculation | ⚠️ Different approaches |

**Analysis**: The lack of blend token consumption leads to platform-specific workarounds that produce visually different results. This violates the cross-platform consistency goal (UN-010).

---

## Key Findings

### Finding 1: Zero Blend Token References in Components

No component references blend tokens in any platform implementation:
- Web: No `--blend-*` CSS custom properties used
- iOS: No `DesignTokens.blend.*` references
- Android: No `DesignTokens.blend_*` references

### Finding 2: Documented Workarounds with Acknowledged Limitations

Components explicitly document that they're using workarounds:
- ButtonCTA.web.css contains detailed comments explaining CSS limitations
- Comments reference the blend token system and acknowledge approximations
- Developers are aware of the gap but have no alternative

### Finding 3: Platform-Specific Workarounds Break Consistency

Each platform uses different workarounds for the same interactive states:
- Pressed state: Opacity (Web) vs Scale (iOS) vs Ripple (Android)
- Disabled state: Opacity 0.6 (Web) vs SwiftUI default (iOS) vs Alpha 0.38 (Android)
- These produce visually different results across platforms

### Finding 4: Opacity Workarounds Are Not Equivalent to Blend Tokens

The opacity-based workarounds have different visual effects:
- Opacity affects the entire element (including text, borders, shadows)
- Blend tokens modify only the target color
- Opacity doesn't provide saturation/desaturation effects
- The workarounds are approximations, not equivalents

### Finding 5: Focus State Uses Direct Color (No Saturation Modification)

All platforms use `color.primary` directly for focus states:
- The `blend.focusSaturate` token exists but isn't applied
- Focus states look identical to unfocused primary color
- The intended saturation boost for focus distinction is missing

---

## Recommendations for Phase 2.4 (Blend Usage Gap Analysis)

Based on this analysis, Phase 2.4 should:

1. **Quantify the Visual Difference**: Compare expected blend token results vs actual workaround results
2. **Assess Workaround Adequacy**: Determine if workarounds are "good enough" or if blend tokens are essential
3. **Identify Priority States**: Determine which interactive states most need blend token support
4. **Evaluate CSS color-mix()**: Assess browser support for native CSS color blending (2025 status)
5. **Consider Build-Time Generation**: Evaluate generating pre-calculated blended colors at build time

---

*This document analyzes component consumption patterns across 4 components and 3 platforms. The key finding is that components use workarounds (opacity, filters, platform-specific effects) instead of blend tokens because no consumption mechanism exists.*
