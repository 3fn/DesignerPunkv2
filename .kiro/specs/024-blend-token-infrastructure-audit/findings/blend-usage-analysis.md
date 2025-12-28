# Blend Token Usage Gap Analysis

**Date**: December 28, 2025
**Spec**: 024 - Blend Token Infrastructure Audit
**Phase**: 2 - Current System Assessment
**Task**: 2.4, 2.5, 2.6 - Analyze blend token usage gap (includes AI agent findings)
**Organization**: spec-validation
**Scope**: 024-blend-token-infrastructure-audit

---

## Overview

This document analyzes the gap between EXPECTED blend token usage (per documentation and specs) and ACTUAL usage (in component implementations). It identifies the specific usability gap preventing expected usage and assesses whether blend tokens are compositional.

**Key Finding**: Blend tokens are fully defined and compositional, but components cannot consume them because no runtime application mechanism exists. The gap is unique to blend tokens - they are the only token family requiring runtime calculation.

---

## Expected Usage (Per Documentation)

### From blend-tokens Spec Documentation

The blend-tokens spec defines comprehensive expected usage patterns:

#### Expected API Pattern (from blend-usage-guide.md)

```typescript
// Web (TypeScript) - EXPECTED
import { BlendTokens, darkerBlend } from '@designerpunk/tokens';

const Button = styled.button`
  background: ${colors.purple500};
  
  &:hover {
    background: ${darkerBlend(colors.purple500, BlendTokens.blend200)};
  }
`;
```

```swift
// iOS (Swift) - EXPECTED
Button("Click Me")
  .background(colors.purple500)
  .onHover { isHovered in
    if isHovered {
      colors.purple500.darkerBlend(BlendTokens.blend200)
    }
  }
```

```kotlin
// Android (Kotlin) - EXPECTED
Button(
  colors = ButtonDefaults.buttonColors(
    containerColor = if (isHovered) {
      colors.purple500.darkerBlend(BlendTokens.blend200)
    } else {
      colors.purple500
    }
  )
)
```

#### Expected Semantic Token Usage

| Interactive State | Expected Token | Expected Effect |
|-------------------|----------------|-----------------|
| Hover (light bg) | `blend.hoverDarker` | 8% darker via black overlay |
| Hover (dark bg) | `blend.hoverLighter` | 8% lighter via white overlay |
| Pressed | `blend.pressedDarker` | 12% darker via black overlay |
| Focus | `blend.focusSaturate` | 8% more saturated in HSL |
| Disabled | `blend.disabledDesaturate` | 12% less saturated in HSL |
| Container hover | `blend.containerHoverDarker` | 4% darker via black overlay |
| Icon optical balance | `color.icon.opticalBalance` | 8% lighter for visual weight |

#### Expected Composition Syntax

From the composition parsers:
- **Blend-only**: `"purple500 with blend200 darker"` → darker purple
- **Blend + opacity**: `"purple500 with blend200 darker at opacity600"` → darker purple at 48% opacity

### From Component READMEs and Specs

#### TextInputField Expected Usage

Per Spec 023 findings:
- Focus state should use `blend.focusSaturate` to enhance primary color (8% more saturated)
- Border color should be `color.primary` modified by blend token

#### ButtonCTA Expected Usage

Per Spec 023 findings:
- Hover state should use `blend.hoverDarker` (8% darker)
- Pressed state should use `blend.pressedDarker` (12% darker)
- Disabled state should use `blend.disabledDesaturate` (12% less saturated)
- Icon optical balance should use `color.icon.opticalBalance` (8% lighter)

---

## Actual Usage (Codebase Search Results)

### Component Blend Token References

| Component | Platform | Blend Token References | Actual Implementation |
|-----------|----------|------------------------|----------------------|
| TextInputField | Web | ❌ None | Uses `var(--color-primary)` directly |
| TextInputField | iOS | ❌ None | Uses `DesignTokens.color.primary` directly |
| TextInputField | Android | ❌ None | Uses `DesignTokens.color_primary` directly |
| ButtonCTA | Web | ❌ None | Uses opacity workarounds |
| ButtonCTA | iOS | ⚠️ Partial | Uses `colorIconOpticalBalance` incorrectly |
| ButtonCTA | Android | ⚠️ Partial | Custom `lightenColor()` function |
| Icon | All | ❌ None | Uses `currentColor` inheritance |
| Container | All | ❌ None | Uses color tokens directly |

### Detailed Actual Implementation Analysis

#### ButtonCTA.web.css - Workarounds Documented

```css
/* ACTUAL: Hover state uses opacity reduction */
.button-cta:hover:not(:disabled) {
  opacity: calc(1 - var(--opacity-100)); /* 100% - 8% = 92% */
}

/* ACTUAL: Pressed state uses opacity reduction */
.button-cta:active:not(:disabled) {
  opacity: calc(1 - var(--opacity-200)); /* 100% - 16% = 84% */
}

/* ACTUAL: Disabled state uses opacity */
.button-cta:disabled {
  opacity: 0.6; /* Approximates blend.disabledDesaturate (12% less saturated) */
}

/* ACTUAL: Icon optical balance uses CSS filter */
.button-cta--secondary .button-cta__icon {
  filter: brightness(1.08); /* Approximates color.icon.opticalBalance (8% lighter) */
}
```

**CSS Comments Acknowledge the Gap**:
> "CSS Limitation: CSS doesn't support color blending directly via custom properties.
> The blend token exists in the token system but cannot be applied in CSS without:
> 1. Build-time color calculation (generate blended color values)
> 2. CSS color-mix() function (limited browser support as of 2025)
> 3. Filter approximation (current approach)"

#### ButtonCTA.ios.swift - Incorrect Usage

```swift
// ACTUAL: Attempts to use blend token but incorrectly
return Color(DesignTokens.colorPrimary).opacity(1.0 + DesignTokens.colorIconOpticalBalance)
// This adds opacity, not lightness - incorrect interpretation
```

**Issue**: The iOS implementation tries to use `colorIconOpticalBalance` (which is `blend200` = 0.08) as an opacity modifier, not as a blend calculation parameter. This produces incorrect results.

#### ButtonCTA.android.kt - Custom Implementation

```kotlin
// ACTUAL: Custom lightenColor function
private fun lightenColor(color: Color, blendAmount: Float): Color {
    val factor = 1.0f + blendAmount
    return Color(
        red = (color.red * factor).coerceAtMost(1.0f),
        green = (color.green * factor).coerceAtMost(1.0f),
        blue = (color.blue * factor).coerceAtMost(1.0f),
        alpha = color.alpha
    )
}
```

**Issue**: This is a custom implementation that approximates lightening but doesn't match the blend token's mathematical definition (white overlay at specified opacity). Each platform has different approximations.

### Summary: Zero Correct Blend Token Usage

| Platform | Blend Token References | Correct Usage |
|----------|------------------------|---------------|
| Web CSS | 0 | 0 |
| iOS Swift | 1 (incorrect) | 0 |
| Android Kotlin | 1 (custom approximation) | 0 |
| **Total** | **2** | **0** |

---

## The Specific Usability Gap

### What Prevents Expected Usage

**Root Cause**: Blend tokens are **calculation parameters**, not **consumable values**.

Unlike other token families:
- **Color tokens**: `--color-primary: #A855F7` → Apply directly as `background-color`
- **Opacity tokens**: `--opacity-600: 0.48` → Apply directly as `opacity: var(--opacity-600)`
- **Spacing tokens**: `--space-200: 8px` → Apply directly as `padding: var(--space-200)`

Blend tokens require a **calculation**:
- **Blend tokens**: `--blend-200: 0.08` → Need: `calculate(color.primary, 0.08, darker)` → Result color

### The Missing Bridge

```
TOKEN DEFINITION                    COMPONENT CONSUMPTION
─────────────────                   ─────────────────────
blend.hoverDarker = blend200        ???                      background-color: ???
(value: 0.08)                       │                        
                                    │ MISSING BRIDGE
color.primary = #A855F7             │
                                    ▼
                                    
EXPECTED: darkerBlend(#A855F7, 0.08) = #9A4EE3
ACTUAL: No function available in CSS/Swift/Kotlin
```

### Why Components Can't Use Blend Tokens Today

1. **Web (CSS)**:
   - CSS custom properties can only hold values, not functions
   - No native CSS function to apply blend calculations
   - `color-mix()` exists but doesn't support blend token semantics
   - Workaround: Opacity reduction (affects entire element, not just color)

2. **iOS (Swift)**:
   - `DesignTokens.blendHoverDarker` returns `0.08` (a number)
   - No Color extension method to apply blend calculation
   - Workaround: Incorrect opacity addition or scale transforms

3. **Android (Kotlin)**:
   - `DesignTokens.blend_hover_darker` returns `0.08f` (a number)
   - No Color extension function to apply blend calculation
   - Workaround: Custom `lightenColor()` function (non-standard)

### The Usability Gap Quantified

| Aspect | Expected | Actual | Gap |
|--------|----------|--------|-----|
| Blend token definitions | ✅ Complete | ✅ Complete | None |
| Blend calculation algorithms | ✅ Complete | ✅ Complete | None |
| Blend generators | ✅ Complete | ✅ Complete | None |
| Blend composition parsers | ✅ Complete | ✅ Complete | None |
| **Runtime utilities in build output** | ✅ Expected | ❌ Missing | **GAP** |
| **Component consumption pattern** | ✅ Expected | ❌ Missing | **GAP** |
| **Documentation of how to use** | ✅ Expected | ⚠️ Conceptual only | **GAP** |

---

## Blend Token Compositional Assessment

### Are Blend Tokens Compositional?

**Yes, blend tokens are designed to be compositional.**

#### Composition Syntax Defined

The `BlendCompositionParser` supports:
```
"color with blend direction"
"purple500 with blend200 darker"
"colorPrimary with blendHoverDarker darker"
```

The `OpacityCompositionParser` supports:
```
"color with blend direction at opacity"
"purple500 with blend200 darker at opacity600"
```

#### Composition Infrastructure Complete

| Component | Status | Evidence |
|-----------|--------|----------|
| BlendCompositionParser | ✅ Complete | `src/composition/BlendCompositionParser.ts` |
| BlendComposition interface | ✅ Complete | `src/composition/BlendComposition.ts` |
| Blend + Opacity composition | ✅ Complete | `src/composition/OpacityCompositionParser.ts` |
| Composition tests | ✅ Complete | 36 tests in BlendCompositionParser.test.ts |

#### How Composition Should Work

```typescript
// Composition syntax
const composition = "purple500 with blend200 darker";

// Parser output
{
  valid: true,
  composition: {
    color: "purple500",
    blend: "blend200",
    direction: "darker"
  }
}

// Expected runtime resolution
// 1. Resolve color: purple500 → #A855F7
// 2. Resolve blend: blend200 → 0.08
// 3. Apply calculation: darkerBlend(#A855F7, 0.08) → #9A4EE3
// 4. Return result: #9A4EE3
```

#### Why Composition Doesn't Work in Practice

The composition infrastructure parses the syntax correctly, but:
1. **No runtime resolver** exists to execute the composition
2. **No build-time generator** produces pre-calculated values
3. **Components can't reference** composition syntax in CSS/Swift/Kotlin

---

## Comparison: Other Token Families

### Do Other Token Families Have Similar Gaps?

**Pattern is systemic, but NEED is unique to blends.**

| Token Family | Requires Runtime Calculation | Has Runtime Utilities | Gap? |
|--------------|------------------------------|----------------------|------|
| Spacing | ❌ No | N/A | No |
| Color | ❌ No | N/A | No |
| Typography | ❌ No | N/A | No |
| Opacity | ❌ No | N/A | No |
| Shadow | ❌ No (composed at build time) | N/A | No |
| Radius | ❌ No | N/A | No |
| **Blend** | ✅ **Yes** | ❌ **No** | **Yes** |

### Why Blend is Unique

**Other token families are static values:**
```css
/* Color: Static value, apply directly */
background-color: var(--color-primary);

/* Opacity: Static value, apply directly */
opacity: var(--opacity-600);

/* Shadow: Composed at build time, apply directly */
box-shadow: var(--shadow-container);
```

**Blend tokens are calculation parameters:**
```css
/* Blend: Requires calculation, cannot apply directly */
background-color: var(--blend-hover-darker); /* ❌ This is 0.08, not a color */

/* What's needed: */
background-color: darkerBlend(var(--color-primary), var(--blend-hover-darker)); /* ❌ Not valid CSS */
```

### Opacity Tokens: A Useful Comparison

Opacity tokens work because they're **directly applicable**:
```css
/* Opacity token usage - works */
.element {
  opacity: var(--opacity-600); /* 0.48 - applies directly */
}
```

Blend tokens don't work because they're **calculation parameters**:
```css
/* Blend token usage - doesn't work */
.element:hover {
  background-color: var(--blend-hover-darker); /* 0.08 - not a color! */
}
```

---

## Workaround Analysis

### Current Workarounds and Their Limitations

| Workaround | Used By | Limitation |
|------------|---------|------------|
| Opacity reduction | ButtonCTA (Web) | Affects entire element, not just color |
| CSS filter brightness | ButtonCTA (Web) | Approximation, not mathematically equivalent |
| Scale transform | ButtonCTA (iOS) | No color modification at all |
| Material ripple | ButtonCTA (Android) | Overlay effect, not color modification |
| Custom lightenColor() | ButtonCTA (Android) | Non-standard, doesn't match blend math |
| Direct color usage | TextInputField (All) | No interactive state modification |

### Workaround Visual Comparison

| State | Expected (Blend) | Actual (Workaround) | Visual Difference |
|-------|------------------|---------------------|-------------------|
| Hover | 8% darker background | 8% less opaque element | Entire element fades, not just background |
| Pressed | 12% darker background | 16% less opaque element | Entire element fades more |
| Disabled | 12% desaturated | 60% opaque | Faded, not desaturated |
| Focus | 8% more saturated | No modification | No visual distinction |
| Icon balance | 8% lighter | brightness(1.08) filter | Close approximation |

### Cross-Platform Inconsistency

The workarounds produce **different visual results** across platforms:

| State | Web | iOS | Android |
|-------|-----|-----|---------|
| Hover | Opacity 92% | N/A | N/A |
| Pressed | Opacity 84% | Scale 96% | Material ripple |
| Disabled | Opacity 60% | SwiftUI default | Alpha 38% |
| Focus | No change | No change | No change |

**This violates UN-010 (Cross-Platform Consistency).**

---

## Gap Summary

### The Single Root Cause

All blend token usage issues trace to **one root cause**:

> **Blend tokens are defined as calculation parameters, but no mechanism exists to execute the calculation and deliver a consumable color value to components.**

### What Exists vs What's Missing

| Layer | Status | Notes |
|-------|--------|-------|
| **Definition Layer** | ✅ Complete | Primitive and semantic tokens defined |
| **Calculation Layer** | ✅ Complete | BlendCalculator, ColorSpaceUtils |
| **Generation Layer** | ✅ Complete | BlendValueGenerator, BlendUtilityGenerator |
| **Composition Layer** | ✅ Complete | BlendCompositionParser |
| **Documentation Layer** | ✅ Complete | Usage guides, AI agent guidance |
| **Build Integration Layer** | ❌ Missing | Generators not in build pipeline |
| **Runtime Utility Layer** | ❌ Missing | No utilities in platform output |
| **Component Pattern Layer** | ❌ Missing | No documented consumption pattern |

### Impact on User Needs

| User Need | Impact |
|-----------|--------|
| UN-001: Focus state visual distinction | ❌ Not achievable - no saturation modification |
| UN-002: Hover state visual feedback | ⚠️ Workaround - opacity instead of color |
| UN-003: Pressed state feedback | ⚠️ Workaround - opacity/scale instead of color |
| UN-004: Disabled element recognition | ⚠️ Workaround - opacity instead of desaturation |
| UN-005: Icon visual weight balance | ⚠️ Workaround - filter approximation |
| UN-006: Consistent color transformations | ❌ Not achievable - workarounds vary |
| UN-007: Theme-aware color modifications | ❌ Not achievable - no runtime calculation |
| UN-008: Predictable component behavior | ❌ Not achievable - no consumption pattern |
| UN-009: AI agent guidance | ✅ Complete - documentation exists |
| UN-010: Cross-platform consistency | ❌ Not achievable - workarounds differ |

---

## Recommendations for Phase 3

Based on this analysis, Phase 3 (Gap Analysis & Confirmation) should:

1. **Confirm the single root cause** with human reviewer
2. **Evaluate solution approaches**:
   - Build-time generation of pre-calculated colors
   - Runtime utilities in platform output
   - CSS color-mix() for web (browser support assessment)
   - Platform-native color extensions for iOS/Android
3. **Prioritize interactive states** (hover, focus, pressed, disabled)
4. **Assess workaround adequacy** - are current workarounds "good enough"?
5. **Determine implementation scope** - full solution vs targeted fix

---

## Conclusion

**The blend token usage gap is clear and specific:**

- **Expected**: Components use blend tokens via runtime utilities to modify colors for interactive states
- **Actual**: Components use workarounds (opacity, filters, custom functions) that don't match blend token semantics
- **Gap**: No mechanism exists to bridge token definition to component consumption

**The gap is unique to blend tokens** - they are the only token family requiring runtime calculation. Other token families (color, opacity, spacing, shadow) are static values that can be applied directly.

**The infrastructure is 80% complete** - definition, calculation, generation, composition, and documentation layers exist. Only the build integration, runtime utility, and component pattern layers are missing.

---

---

## AI Agent Usability Findings (Task 2.5)

This section incorporates findings from the AI Agent Usability Assessment (Task 2.5).

### Documentation Quality Assessment

| Area | Assessment | Evidence |
|------|------------|----------|
| Compositional Clarity | ✅ Excellent | Multiple docs explain composition patterns |
| Guidance Sufficiency | ✅ Excellent | Decision trees, quick reference tables |
| Semantic Naming | ✅ Excellent | Consistent `blend.[state][Direction]` pattern |
| Color/Blend Relationship | ✅ Excellent | Clear distinction documented |

### Practical Usability Assessment

| Test | Expected | Actual | Result |
|------|----------|--------|--------|
| Web CSS | `darkerBlend(color, blend)` | No function exists | ❌ FAILS |
| TypeScript | Import from package | Not exported | ❌ FAILS |
| iOS Swift | `Color.darkerBlend()` | No extension exists | ❌ FAILS |
| Android Kotlin | `Color.darkerBlend()` | No extension exists | ❌ FAILS |

### AI Agent Experience Today

When an AI agent attempts to implement blend tokens:

1. **Reads documentation** → Understands the concept perfectly ✅
2. **Selects appropriate token** → Makes correct selection ✅
3. **Writes code** → Follows documented patterns ✅
4. **Code fails** → No runtime utilities exist ❌
5. **Falls back to workarounds** → Uses opacity, filters, or custom functions ⚠️

### Key AI Agent Usability Issues

| ID | Area | Severity | Finding |
|----|------|----------|---------|
| AI-001 | Practical Usability | 🔴 Critical | Runtime utilities not in build output |
| AI-002 | Practical Usability | 🔴 Critical | No package exports for blend utilities |
| AI-003 | Practical Usability | 🔴 Critical | CSS cannot execute blend calculations |
| AI-004 | Guidance Sufficiency | 🟡 Medium | Documentation shows non-existent API |
| AI-005 | Practical Usability | 🔴 Critical | No component consumption pattern |

### AI Agent Usability Summary

**The documentation is excellent, but the system doesn't work.**

- ✅ AI agents can perfectly understand WHAT blend tokens should do
- ✅ AI agents can correctly select appropriate tokens
- ❌ AI agents cannot actually USE blend tokens because infrastructure is missing
- ⚠️ AI agents must fall back to workarounds that don't match blend token semantics

For detailed AI agent usability analysis, see [ai-agent-usability-assessment.md](./ai-agent-usability-assessment.md).

---

## Related Documents

- [Current System Assessment](./current-system-assessment.md) - Consolidated Phase 2 findings
- [Pattern Inventory](./pattern-inventory.md) - All patterns discovered
- [AI Agent Usability Assessment](./ai-agent-usability-assessment.md) - Detailed AI usability analysis
- [Component Consumption Patterns](./component-consumption-patterns.md) - Component analysis
- [Generator Patterns](./generator-patterns.md) - Generator analysis
- [Token Output Patterns](./token-output-patterns.md) - Platform output analysis

---

*This analysis fulfills Task 2.4 and 2.5 requirements for documenting expected vs actual blend token usage, identifying the specific usability gap, and assessing AI agent usability.*
