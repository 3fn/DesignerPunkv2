# Pattern Inventory: Blend Token Infrastructure Audit

**Date**: December 28, 2025
**Spec**: 024 - Blend Token Infrastructure Audit
**Phase**: 2 - Current System Assessment
**Task**: 2.6 - Produce Phase 2 deliverables
**Organization**: spec-validation
**Scope**: 024-blend-token-infrastructure-audit

---

## Overview

This document catalogs all patterns discovered during Phase 2 assessment, organized by category. These patterns inform Phase 3 gap analysis and any future implementation recommendations.

---

## Generator Patterns

### GP-001: Unified Generator Orchestration

**Pattern**: Central orchestrator coordinates platform-specific generation
**Location**: `src/generators/TokenFileGenerator.ts`
**Usage**: All token families

```
TokenFileGenerator.generateAll()
├── generateWebTokens()     → CSS custom properties
├── generateiOSTokens()     → Swift constants
└── generateAndroidTokens() → Kotlin constants
```

**Characteristics**:
- Single entry point for all generation
- Platform-specific format providers
- Consistent naming transformation per platform

---

### GP-002: Primitive Token Collection

**Pattern**: Primitive tokens collected via `getAllPrimitiveTokens()` array
**Location**: `src/tokens/index.ts`
**Usage**: Spacing, Color, Opacity, Blend, Shadow, Radius, BorderWidth

**Characteristics**:
- Tokens exported from individual files
- Aggregated into single array
- Automatically included in generation

---

### GP-003: Semantic Token Collection

**Pattern**: Semantic tokens collected via `getAllSemanticTokens()` array
**Location**: `src/tokens/semantic/index.ts`
**Usage**: Typography, Shadow, Opacity, Blend

**Characteristics**:
- Reference primitive tokens
- Platform-specific reference syntax (CSS `var()`, Swift direct, Kotlin direct)
- Automatically included in generation

---

### GP-004: Special Token Handling

**Pattern**: Custom generation methods for complex token types
**Location**: `src/generators/TokenFileGenerator.ts`
**Usage**: Icons, Motion, Layering

| Token Type | Special Handling | Method |
|------------|------------------|--------|
| Icon sizes | fontSize × multiplier | `generateIconSizeToken()` |
| Motion | Duration + easing + scale | `generateMotionSection()` |
| Layering | Z-index vs Elevation | `generateLayeringSection()` |

---

### GP-005: Orphaned Generator Pattern (Anti-Pattern)

**Pattern**: Generator exists but not integrated into build pipeline
**Location**: `src/generators/BlendValueGenerator.ts`, `src/generators/BlendUtilityGenerator.ts`
**Usage**: Blend tokens (NOT WORKING)

**Characteristics**:
- Generator class exists with valid output
- Not called by TokenFileGenerator
- Output not included in build artifacts

**Status**: ⚠️ Anti-pattern to be resolved

---

## Token Output Patterns

### TP-001: CSS Custom Property Pattern (Web)

**Pattern**: Tokens output as CSS custom properties
**File**: `dist/DesignTokens.web.css`

```css
/* Primitive: Direct value */
--blend-200: 0.08;

/* Semantic: var() reference */
--blend-hover-darker: var(--blend-200);
```

**Characteristics**:
- kebab-case naming
- Primitives use direct values
- Semantics use `var()` references
- No runtime utilities

---

### TP-002: Swift Constant Pattern (iOS)

**Pattern**: Tokens output as Swift static constants
**File**: `dist/DesignTokens.ios.swift`

```swift
// Primitive: CGFloat value
public static let blend200: CGFloat = 0.08

// Semantic: Direct reference
public static let blendHoverDarker = blend200
```

**Characteristics**:
- camelCase naming
- CGFloat typed values
- Direct constant references
- No runtime utilities

---

### TP-003: Kotlin Constant Pattern (Android)

**Pattern**: Tokens output as Kotlin const vals
**File**: `dist/DesignTokens.android.kt`

```kotlin
// Primitive: Float with 'f' suffix
const val blend_200: Float = 0.08f

// Semantic: val reference
val blend_hover_darker = blend_200
```

**Characteristics**:
- snake_case naming
- Float type with `f` suffix
- `const val` for primitives, `val` for semantics
- No runtime utilities

---

### TP-004: Static Value Pattern

**Pattern**: Token outputs static value that can be applied directly
**Usage**: Color, Opacity, Spacing, Shadow, Typography, Radius

```css
/* Can be applied directly */
background-color: var(--color-primary);
opacity: var(--opacity-600);
padding: var(--space-200);
```

**Characteristics**:
- Value is immediately usable
- No calculation required
- Works across all platforms

---

### TP-005: Calculation Parameter Pattern (Blend-Specific)

**Pattern**: Token outputs parameter that requires calculation
**Usage**: Blend tokens only

```css
/* Cannot be applied directly */
--blend-hover-darker: 0.08;  /* This is a parameter, not a color */

/* Requires calculation */
background-color: darkerBlend(var(--color-primary), 0.08);  /* Function doesn't exist */
```

**Characteristics**:
- Value is a calculation parameter
- Requires runtime function to produce usable value
- Function not available in generated output

**Status**: ⚠️ Gap pattern - needs resolution

---

## Component Consumption Patterns

### CP-001: Direct Token Reference

**Pattern**: Component references token directly via platform syntax
**Usage**: All token families except blend

```css
/* Web */
background-color: var(--color-primary);
```

```swift
// iOS
Color(DesignTokens.color.primary)
```

```kotlin
// Android
Color(DesignTokens.color_primary)
```

**Characteristics**:
- Simple, direct reference
- Works for static values
- No calculation required

---

### CP-002: Opacity Workaround Pattern

**Pattern**: Use opacity reduction instead of color modification
**Usage**: ButtonCTA hover, pressed, disabled states (Web)

```css
/* Workaround for blend.hoverDarker */
.button:hover {
  opacity: calc(1 - var(--opacity-100));  /* 92% opacity */
}
```

**Characteristics**:
- Affects entire element, not just background
- Not equivalent to blend token behavior
- Acknowledged workaround in CSS comments

**Status**: ⚠️ Workaround pattern - not ideal

---

### CP-003: CSS Filter Workaround Pattern

**Pattern**: Use CSS filter for color approximation
**Usage**: ButtonCTA icon optical balance (Web)

```css
/* Workaround for color.icon.opticalBalance */
.button__icon {
  filter: brightness(1.08);  /* Approximates 8% lighter */
}
```

**Characteristics**:
- Approximation, not mathematically equivalent
- Affects all colors in element
- Browser-dependent rendering

**Status**: ⚠️ Workaround pattern - not ideal

---

### CP-004: Scale Transform Workaround Pattern

**Pattern**: Use scale transform instead of color modification
**Usage**: ButtonCTA pressed state (iOS)

```swift
// Workaround for blend.pressedDarker
.scaleEffect(isPressed ? 0.96 : 1.0)
```

**Characteristics**:
- No color modification at all
- Provides tactile feedback via size change
- Not equivalent to blend token behavior

**Status**: ⚠️ Workaround pattern - not ideal

---

### CP-005: Material Ripple Workaround Pattern

**Pattern**: Use Material ripple effect instead of color modification
**Usage**: ButtonCTA pressed state (Android)

```kotlin
// Workaround for blend.pressedDarker
val rippleIndication = rememberRipple(
    color = colorPrimary.copy(alpha = 0.16f)
)
```

**Characteristics**:
- Overlay effect, not color modification
- Platform-specific Material Design pattern
- Not equivalent to blend token behavior

**Status**: ⚠️ Workaround pattern - not ideal

---

### CP-006: Direct Color Usage Pattern

**Pattern**: Use base color directly without modification
**Usage**: TextInputField focus state (All platforms)

```css
/* Expected: blend.focusSaturate applied */
/* Actual: Direct color usage */
.input:focus {
  border-color: var(--color-primary);
}
```

**Characteristics**:
- No interactive state modification
- Misses intended saturation enhancement
- Simplest workaround (do nothing)

**Status**: ⚠️ Workaround pattern - not ideal

---

### CP-007: Custom Function Workaround Pattern

**Pattern**: Implement custom color manipulation function
**Usage**: ButtonCTA icon optical balance (Android)

```kotlin
// Custom implementation (non-standard)
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

**Characteristics**:
- Non-standard implementation
- Doesn't match blend token mathematical definition
- Platform-specific, not cross-platform consistent

**Status**: ⚠️ Workaround pattern - not ideal

---

## Documentation Patterns

### DP-001: AI Agent Decision Tree Pattern

**Pattern**: Structured decision tree for token selection
**Location**: `.kiro/specs/blend-tokens/ai-agent-blend-selection-guide.md`

```
Is this an interaction state?
├─ YES → Is the background light or dark?
│  ├─ Light → Use DARKER blend
│  └─ Dark → Use LIGHTER blend
└─ NO → Is this a focus state?
   ├─ YES → Use SATURATE blend
   └─ NO → Consider if blend is appropriate
```

**Characteristics**:
- Clear decision path
- Covers all common scenarios
- AI-agent optimized format

---

### DP-002: Semantic Naming Convention Pattern

**Pattern**: Consistent `[category].[state][Direction]` naming
**Usage**: All semantic blend tokens

| Token | Pattern | Components |
|-------|---------|------------|
| `blend.hoverDarker` | category.stateDirection | blend + hover + Darker |
| `blend.focusSaturate` | category.stateDirection | blend + focus + Saturate |
| `blend.disabledDesaturate` | category.stateDirection | blend + disabled + Desaturate |

**Characteristics**:
- Predictable structure
- Self-documenting names
- AI-agent friendly

---

### DP-003: Inline Guidance Pattern

**Pattern**: AI agent guidance embedded in source files
**Location**: `src/tokens/semantic/BlendTokens.ts`

```typescript
/**
 * AI Agent Guidance for Blend Token Selection
 * 
 * 1. What interaction type?
 *    → hover, pressed, focus, disabled
 * 2. What background color?
 *    → Light: use darker, Dark: use lighter
 * ...
 */
```

**Characteristics**:
- Guidance co-located with definitions
- Available during code generation
- Reduces context switching

---

## Composition Patterns

### CMP-001: Blend-Only Composition

**Pattern**: `"color with blend direction"`
**Parser**: `BlendCompositionParser`

```typescript
// Syntax
"purple500 with blend200 darker"

// Parsed result
{
  color: "purple500",
  blend: "blend200",
  direction: "darker"
}
```

**Characteristics**:
- Simple three-part syntax
- Direction is explicit
- Parser validates all components

---

### CMP-002: Blend + Opacity Composition

**Pattern**: `"color with blend direction at opacity"`
**Parser**: `OpacityCompositionParser`

```typescript
// Syntax
"purple500 with blend200 darker at opacity600"

// Parsed result
{
  color: "purple500",
  blend: "blend200",
  direction: "darker",
  opacity: "opacity600"
}
```

**Characteristics**:
- Four-part syntax
- Order enforced: blend first, then opacity
- Enables complex effects

---

## Pattern Summary by Status

### ✅ Working Patterns (Use As-Is)

| ID | Pattern | Category |
|----|---------|----------|
| GP-001 | Unified Generator Orchestration | Generator |
| GP-002 | Primitive Token Collection | Generator |
| GP-003 | Semantic Token Collection | Generator |
| GP-004 | Special Token Handling | Generator |
| TP-001 | CSS Custom Property Pattern | Token Output |
| TP-002 | Swift Constant Pattern | Token Output |
| TP-003 | Kotlin Constant Pattern | Token Output |
| TP-004 | Static Value Pattern | Token Output |
| CP-001 | Direct Token Reference | Component |
| DP-001 | AI Agent Decision Tree | Documentation |
| DP-002 | Semantic Naming Convention | Documentation |
| DP-003 | Inline Guidance Pattern | Documentation |
| CMP-001 | Blend-Only Composition | Composition |
| CMP-002 | Blend + Opacity Composition | Composition |

### ⚠️ Gap Patterns (Need Resolution)

| ID | Pattern | Category | Issue |
|----|---------|----------|-------|
| GP-005 | Orphaned Generator | Generator | Not integrated into build |
| TP-005 | Calculation Parameter | Token Output | Requires runtime function |

### ⚠️ Workaround Patterns (Not Ideal)

| ID | Pattern | Category | Issue |
|----|---------|----------|-------|
| CP-002 | Opacity Workaround | Component | Affects entire element |
| CP-003 | CSS Filter Workaround | Component | Approximation only |
| CP-004 | Scale Transform Workaround | Component | No color modification |
| CP-005 | Material Ripple Workaround | Component | Overlay, not modification |
| CP-006 | Direct Color Usage | Component | No state modification |
| CP-007 | Custom Function Workaround | Component | Non-standard, inconsistent |

---

## Recommendations for Phase 3

### Patterns to Preserve

1. **GP-001 through GP-004**: Generator patterns work well
2. **TP-001 through TP-004**: Token output patterns are consistent
3. **DP-001 through DP-003**: Documentation patterns are excellent
4. **CMP-001, CMP-002**: Composition patterns are well-designed

### Patterns to Resolve

1. **GP-005 (Orphaned Generator)**: Integrate BlendUtilityGenerator into build pipeline
2. **TP-005 (Calculation Parameter)**: Provide runtime utilities or pre-calculated values

### Patterns to Replace

1. **CP-002 through CP-007 (Workarounds)**: Replace with proper blend token consumption once infrastructure is complete

---

## Cross-Reference to Other Documents

| Pattern Category | Detailed Analysis |
|------------------|-------------------|
| Generator Patterns | [generator-patterns.md](./generator-patterns.md) |
| Token Output Patterns | [token-output-patterns.md](./token-output-patterns.md) |
| Component Patterns | [component-consumption-patterns.md](./component-consumption-patterns.md) |
| Documentation Patterns | [ai-agent-usability-assessment.md](./ai-agent-usability-assessment.md) |

---

*This inventory catalogs 21 patterns discovered during Phase 2 assessment. 14 patterns are working correctly, 2 represent gaps to resolve, and 6 are workarounds to replace once blend token infrastructure is complete.*
