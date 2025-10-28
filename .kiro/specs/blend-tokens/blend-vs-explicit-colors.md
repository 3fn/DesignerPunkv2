# Blend vs Explicit Colors: Decision Framework

**Date**: October 28, 2025
**Purpose**: Guide developers on when to use blend tokens vs explicit color tokens
**Organization**: spec-guide
**Scope**: blend-tokens

---

## Related Guides

- [Blend Usage Guide](./blend-usage-guide.md) - Provides examples of blend token usage patterns
- [Requirements Document](./requirements.md#requirement-11-relationship-to-explicit-color-tokens) - Explains coexistence strategy

---

## Introduction

The blend token system coexists with explicit color variant tokens (like purple500, purple600, purple700). This guide helps you decide when to use blend tokens as modifiers versus when to use explicit color variants.

**Key Principle**: Blend tokens are **modifiers** that create new colors dynamically. Explicit color tokens are **definitions** that specify exact colors statically.

---

## When to Use Blend Tokens

### Dynamic Theming

**Use blend when**: Brand colors change frequently or need to support user customization.

**Why**: Blend tokens automatically adapt to base color changes without requiring updates to interaction states.

**Example**:
```typescript
// Using blend - dynamic and adaptive
const theme = {
  button: {
    default: brandPrimary,  // purple500
    hover: `${brandPrimary} with blend200 darker`,
    pressed: `${brandPrimary} with blend300 darker`
  }
};

// Change brand color - hover and pressed automatically update
brandPrimary = blue500;  // Hover and pressed now use blue-based blends
```

**Benefit**: One change updates all interaction states across the entire system.

### Consistent Interaction Patterns

**Use blend when**: You want the same interaction feedback across all colors.

**Why**: Blend tokens ensure consistent visual feedback regardless of base color.

**Example**:
```typescript
// Using blend - consistent pattern
const buttons = {
  primary: {
    default: purple500,
    hover: `${purple500} with blend200 darker`  // 8% darker
  },
  secondary: {
    default: blue500,
    hover: `${blue500} with blend200 darker`  // 8% darker
  },
  success: {
    default: green500,
    hover: `${green500} with blend200 darker`  // 8% darker
  }
};
```

**Benefit**: Users experience consistent interaction feedback across all button types.

### Reducing Token Count

**Use blend when**: You want to minimize the number of color tokens in your system.

**Why**: Blend tokens eliminate the need for separate hover/pressed/focus variants for every color.

**Example**:
```typescript
// Without blend - many explicit tokens
purple500, purple600, purple700  // Default, hover, pressed
blue500, blue600, blue700
green500, green600, green700
red500, red600, red700
// = 12 color tokens

// With blend - fewer tokens
purple500, blue500, green500, red500  // Base colors
blend200, blend300  // Interaction modifiers
// = 6 tokens total
```

**Benefit**: Smaller token system, easier to maintain, less cognitive load.

### Multi-Platform Consistency

**Use blend when**: You need mathematically identical interaction feedback across web, iOS, and Android.

**Why**: Blend utilities use the same algorithms on all platforms, ensuring pixel-perfect consistency.

**Example**:
```typescript
// Web
const hoverColor = darkerBlend(purple500, BlendTokens.blend200);

// iOS
let hoverColor = Color(hex: "A855F7").darkerBlend(BlendTokens.blend200)

// Android
val hoverColor = Color(0xFFA855F7).darkerBlend(BlendTokens.blend200)

// All three produce mathematically identical colors
```

**Benefit**: True cross-platform consistency through shared mathematical foundation.

---

## When to Use Explicit Colors

### Precise Color Requirements

**Use explicit colors when**: Brand guidelines specify exact colors for specific states.

**Why**: Blend calculations might not produce the exact color required by brand standards.

**Example**:
```typescript
// Brand guidelines specify exact colors
const brandButton = {
  default: '#6B46C1',   // Brand purple (exact)
  hover: '#553C9A',     // Brand purple hover (exact)
  pressed: '#44337A'    // Brand purple pressed (exact)
};

// Using blend might produce slightly different colors
// blend200 darker on #6B46C1 = #5F3FB3 (not exact match)
```

**Benefit**: Guaranteed compliance with brand color specifications.

### Frequently-Used Combinations

**Use explicit colors when**: A color combination is used extensively throughout the system.

**Why**: Pre-calculated colors avoid runtime calculation overhead for common patterns.

**Example**:
```typescript
// Frequently used - worth explicit token
const primaryButton = {
  default: purple500,
  hover: purple600,    // Used 100+ times across app
  pressed: purple700   // Used 100+ times across app
};

// Rarely used - blend is fine
const tertiaryButton = {
  default: gray300,
  hover: `${gray300} with blend200 darker`  // Used 5 times
};
```

**Benefit**: Avoid repeated calculations for common patterns, potential performance optimization.

### Performance-Critical Scenarios

**Use explicit colors when**: Runtime performance is critical and every millisecond matters.

**Why**: Pre-calculated colors eliminate runtime blend calculation overhead.

**Example**:
```typescript
// Performance-critical animation
const animatedElement = {
  // Explicit colors - no calculation during animation
  frame1: purple500,
  frame2: purple550,
  frame3: purple600,
  frame4: purple650,
  frame5: purple700
};

// vs blend calculation on every frame
// frame2: darkerBlend(purple500, 0.04)  // Calculation overhead
```

**Benefit**: Eliminates calculation overhead in performance-sensitive contexts.

### Design Requires Non-Mathematical Relationships

**Use explicit colors when**: Design intentionally breaks mathematical relationships for visual balance.

**Why**: Blend tokens follow mathematical formulas that might not match design intent.

**Example**:
```typescript
// Design requires specific visual balance
const specialButton = {
  default: purple500,
  hover: purple580,    // Not mathematically derived
  pressed: purple720   // Adjusted for visual weight
};

// Mathematical blend might not achieve desired visual effect
// blend200 darker = purple500 + 8% black (might look too subtle)
// blend300 darker = purple500 + 12% black (might look too strong)
```

**Benefit**: Design flexibility when mathematical relationships don't serve visual goals.

---

## Coexistence Strategy

### Blend as Modifier, Not Replacement

Blend tokens **coexist** with explicit colors - they don't replace them.

**Pattern**: Use explicit colors for base values, blend for dynamic modifications.

```typescript
// Explicit base colors
const colors = {
  purple500: '#A855F7',
  purple600: '#9333EA',
  purple700: '#7E22CE'
};

// Blend for dynamic modifications
const button = {
  default: colors.purple500,
  hover: `${colors.purple500} with blend200 darker`,  // Dynamic
  // OR
  hover: colors.purple600  // Explicit
};
```

**Both approaches are valid** - choose based on your specific needs.

### Hybrid Approach

**Best practice**: Use blend for most cases, explicit colors for exceptions.

```typescript
const designSystem = {
  // Most buttons use blend (dynamic, consistent)
  primaryButton: {
    default: purple500,
    hover: `${purple500} with blend200 darker`,
    pressed: `${purple500} with blend300 darker`
  },
  
  secondaryButton: {
    default: blue500,
    hover: `${blue500} with blend200 darker`,
    pressed: `${blue500} with blend300 darker`
  },
  
  // Brand-critical button uses explicit colors (precise control)
  ctaButton: {
    default: brandOrange,      // #FF6B35 (exact)
    hover: brandOrangeHover,   // #E55A2B (exact)
    pressed: brandOrangePressed // #CC4E24 (exact)
  }
};
```

**Benefit**: Flexibility where needed, consistency where possible.

### Migration Path

**Gradual adoption**: You can migrate from explicit colors to blend incrementally.

```typescript
// Phase 1: All explicit colors
button.hover = purple600;

// Phase 2: Evaluate if blend provides same value
const blendedHover = darkerBlend(purple500, 0.08);
// If blendedHover ≈ purple600, consider migration

// Phase 3: Migrate to blend for dynamic theming
button.hover = `${purple500} with blend200 darker`;

// Phase 4: Remove unused explicit color tokens
// purple600 no longer needed if all usages migrated
```

**Benefit**: Low-risk migration with validation at each step.

---

## Decision Framework

Use this framework to decide between blend and explicit colors:

### Step 1: Assess Dynamic Theming Needs

**Question**: Will the base color change frequently or need user customization?

- **Yes** → Prefer blend tokens
- **No** → Continue to Step 2

### Step 2: Evaluate Brand Requirements

**Question**: Do brand guidelines specify exact colors for this state?

- **Yes** → Use explicit colors
- **No** → Continue to Step 3

### Step 3: Consider Usage Frequency

**Question**: Is this color combination used extensively (50+ times)?

- **Yes** → Consider explicit colors for performance
- **No** → Continue to Step 4

### Step 4: Check Mathematical Fit

**Question**: Does mathematical blend produce the desired visual effect?

- **Yes** → Use blend tokens
- **No** → Use explicit colors

### Step 5: Default to Blend

**If uncertain**: Start with blend tokens for flexibility, migrate to explicit colors if specific needs arise.

---

## Examples by Use Case

### Use Case 1: Multi-Brand Product

**Scenario**: Product supports multiple brand themes that users can switch between.

**Decision**: Use blend tokens

**Rationale**: Base colors change per brand, blend ensures consistent interaction feedback.

```typescript
// Brand A
brandPrimary = purple500;
button.hover = `${brandPrimary} with blend200 darker`;

// Brand B
brandPrimary = teal500;
button.hover = `${brandPrimary} with blend200 darker`;  // Automatically adapts
```

### Use Case 2: Strict Brand Guidelines

**Scenario**: Brand team provides exact hex values for all button states.

**Decision**: Use explicit colors

**Rationale**: Brand compliance requires exact colors, not calculated approximations.

```typescript
// Brand specification
button.default = '#6B46C1';   // Exact
button.hover = '#553C9A';     // Exact
button.pressed = '#44337A';   // Exact
```

### Use Case 3: Design System Library

**Scenario**: Building a design system for multiple products with different brand colors.

**Decision**: Use blend tokens

**Rationale**: Products customize base colors, blend provides consistent patterns.

```typescript
// Design system provides pattern
export const buttonPattern = {
  default: (baseColor) => baseColor,
  hover: (baseColor) => `${baseColor} with blend200 darker`,
  pressed: (baseColor) => `${baseColor} with blend300 darker`
};

// Product A applies pattern
const productAButton = buttonPattern(purple500);

// Product B applies pattern
const productBButton = buttonPattern(blue500);
```

### Use Case 4: Performance-Critical Animation

**Scenario**: Animating through multiple color states at 60fps.

**Decision**: Use explicit colors

**Rationale**: Pre-calculated colors eliminate runtime overhead during animation.

```typescript
// Pre-calculated color stops
const animationFrames = [
  purple500,   // Frame 1
  purple550,   // Frame 2
  purple600,   // Frame 3
  purple650,   // Frame 4
  purple700    // Frame 5
];

// Animate without calculation overhead
```

---

## Common Questions

### Q: Can I use both blend and explicit colors in the same component?

**A**: Yes! Use explicit colors for base states and blend for dynamic modifications.

```typescript
const button = {
  default: brandPrimary,           // Explicit
  hover: `${brandPrimary} with blend200 darker`,  // Blend
  disabled: gray400                // Explicit
};
```

### Q: What if blend doesn't produce the exact color I need?

**A**: Use explicit colors for that specific case. Blend is a tool, not a requirement.

```typescript
// Blend doesn't match design intent
const specialCase = {
  default: purple500,
  hover: purple580  // Explicit color for specific visual effect
};
```

### Q: Should I remove explicit color variants if I adopt blend?

**A**: Only if they're no longer used. Keep explicit colors that serve specific purposes.

```typescript
// Keep these explicit colors
purple500  // Base color (needed)
purple600  // Used for non-interactive elements (keep)
purple700  // Brand-specified color (keep)

// Can remove these if migrated to blend
purple550  // Only used for button hover (migrate to blend)
purple650  // Only used for button pressed (migrate to blend)
```

### Q: How do I know if blend produces acceptable colors?

**A**: Test the blended color against your design requirements:

```typescript
// Calculate blend result
const hoverColor = darkerBlend(purple500, 0.08);

// Compare with design intent
// If close enough (within tolerance), use blend
// If not close enough, use explicit color
```

---

## Summary

### Use Blend Tokens When:
- ✅ Brand colors change frequently
- ✅ You want consistent interaction patterns
- ✅ Reducing token count is important
- ✅ Cross-platform consistency is critical
- ✅ Dynamic theming is needed

### Use Explicit Colors When:
- ✅ Brand guidelines specify exact colors
- ✅ Color combination is used extensively
- ✅ Performance is critical
- ✅ Design requires non-mathematical relationships
- ✅ Precise control is more important than flexibility

### Best Practice:
**Default to blend tokens for flexibility, use explicit colors for specific needs.**

Blend and explicit colors coexist - use the right tool for each situation.

---

*This decision framework helps developers choose between blend tokens and explicit colors based on specific project needs, ensuring both flexibility and precision where appropriate.*
