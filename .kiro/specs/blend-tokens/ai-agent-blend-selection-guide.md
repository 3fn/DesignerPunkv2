# AI Agent Guidance: Blend Token Selection

**Date**: October 28, 2025
**Purpose**: Guide AI agents in selecting appropriate blend tokens and directions
**Organization**: spec-guide
**Scope**: blend-tokens
**Audience**: AI agents generating code with blend tokens

---

## Related Documentation

- [Blend Usage Guide](./blend-usage-guide.md) - Comprehensive examples for all blend directions
- [Blend vs Explicit Colors Guide](./blend-vs-explicit-colors.md) - When to use blend vs explicit color tokens
- [Design Document](./design.md) - Blend token architecture and design decisions
- [Requirements Document](./requirements.md) - Blend token system requirements

---

## Overview

This guide helps AI agents make appropriate decisions when generating code that uses blend tokens. It provides decision criteria, selection patterns, and boundary definitions to ensure consistent and correct blend token usage.

### Key Principles for AI Agents

1. **Blend Direction Selection**: Choose direction based on background color and interaction type
2. **Semantic Token Preference**: Prefer semantic tokens over primitive tokens for common patterns
3. **Composition Awareness**: Understand when to compose blend with opacity
4. **Component Boundary**: Know when blend tokens belong in token system vs component library

---

## Blend Direction Selection Criteria

### Decision Tree for Blend Direction

```
Is this an interaction state (hover, pressed, active)?
├─ YES → Is the background light or dark?
│  ├─ Light background → Use DARKER blend
│  └─ Dark background → Use LIGHTER blend
│
└─ NO → Is this a focus state?
   ├─ YES → Use SATURATE blend
   │
   └─ NO → Is this a disabled/inactive state?
      ├─ YES → Use DESATURATE blend
      └─ NO → Consider if blend is appropriate
```

### Darker Blend Selection

**When to Use**:
- Hover states on light backgrounds
- Pressed/active states on light backgrounds
- Container hover on light surfaces
- Navigation item selection on light backgrounds

**Background Color Criteria**:
- Background lightness > 50% in HSL
- Background is white, light gray, or light color
- Visual context is "light mode" or "light theme"

**Example Decision Logic**:
```typescript
// AI Agent Decision Process:
// 1. Interaction type: hover
// 2. Background: colors.blue500 (light-medium blue)
// 3. Decision: Use darker blend
// 4. Strength: Standard hover = blend200

background: ${darkerBlend(colors.blue500, BlendTokens.blend200)}
```

**Common Patterns**:
- Button hover: `blend200` darker (8%)
- Button pressed: `blend300` darker (12%)
- Container hover: `blend100` darker (4%)
- Navigation active: `blend200` darker (8%)

### Lighter Blend Selection

**When to Use**:
- Hover states on dark backgrounds
- Pressed/active states on dark backgrounds
- Container hover on dark surfaces
- Navigation item selection on dark backgrounds

**Background Color Criteria**:
- Background lightness < 50% in HSL
- Background is black, dark gray, or dark color
- Visual context is "dark mode" or "dark theme"

**Example Decision Logic**:
```typescript
// AI Agent Decision Process:
// 1. Interaction type: hover
// 2. Background: colors.gray800 (dark gray)
// 3. Decision: Use lighter blend
// 4. Strength: Standard hover = blend200

background: ${lighterBlend(colors.gray800, BlendTokens.blend200)}
```

**Common Patterns**:
- Dark button hover: `blend200` lighter (8%)
- Dark button pressed: `blend300` lighter (12%)
- Dark container hover: `blend100` lighter (4%)
- Dark navigation active: `blend200` lighter (8%)

### Saturate Blend Selection

**When to Use**:
- Focus states (keyboard navigation)
- Emphasis states (draw attention)
- Active/selected states requiring vibrancy
- Link hover states (energized appearance)

**Interaction Type Criteria**:
- User is focusing element (keyboard or programmatic)
- Element needs to draw attention
- Element is active and should appear more vibrant
- Hover state where vibrancy is preferred over darkness

**Example Decision Logic**:
```typescript
// AI Agent Decision Process:
// 1. Interaction type: focus
// 2. Purpose: Accessibility (keyboard navigation)
// 3. Decision: Use saturate blend
// 4. Strength: Standard focus = blend200

border-color: ${saturate(colors.blue500, BlendTokens.blend200)}
```

**Common Patterns**:
- Input focus: `blend200` saturate (8%)
- Button focus ring: `blend200` saturate (8%)
- Link hover: `blend200` saturate (8%)
- Icon emphasis: `blend300` saturate (12%)

### Desaturate Blend Selection

**When to Use**:
- Disabled states (cannot interact)
- Inactive states (not currently active)
- Muted states (reduced emphasis)
- Placeholder or secondary content

**State Criteria**:
- Element is disabled (`:disabled` state)
- Element is inactive (not selected/active)
- Element should appear muted or de-emphasized
- Element is placeholder or secondary

**Example Decision Logic**:
```typescript
// AI Agent Decision Process:
// 1. State: disabled
// 2. Purpose: Indicate non-interactive state
// 3. Decision: Use desaturate blend
// 4. Strength: Clear indication = blend300

background: ${desaturate(colors.blue500, BlendTokens.blend300)}
```

**Common Patterns**:
- Disabled button: `blend300` desaturate (12%)
- Inactive tab: `blend200` desaturate (8%)
- Disabled input: `blend300` desaturate (12%)
- Inactive icon: `blend300` desaturate (12%)

---

## Blend Value Selection Criteria

### Feedback Strength Guidelines

**blend100 (4%) - Subtle Feedback**:
- Container hover states
- Surface hover states
- Very gentle visual feedback
- Background elements

**When to Select**:
- Element is a container or surface (not primary interactive element)
- Feedback should be barely noticeable
- User is hovering over large area
- Visual hierarchy requires subtlety

**blend200 (8%) - Standard Feedback**:
- Button hover states
- Link hover states
- Focus states
- Standard interaction feedback

**When to Select**:
- Element is primary interactive (button, link, input)
- Feedback should be noticeable but not dramatic
- Standard hover or focus interaction
- Most common use case

**blend300 (12%) - Strong Feedback**:
- Button pressed states
- Active navigation items
- Disabled states
- Clear state indication

**When to Select**:
- Element is in pressed/active state
- Element is disabled and needs clear indication
- Feedback should be clearly noticeable
- State change is significant

**blend400 (16%) - Very Strong Feedback**:
- Emphasized pressed states
- Strong visual emphasis
- Special interaction states

**When to Select**:
- Element requires strong emphasis
- Interaction is significant or destructive
- Use sparingly for special cases

**blend500 (20%) - Maximum Feedback**:
- Dramatic emphasis
- Special cases only

**When to Select**:
- Extremely rare use cases
- Maximum possible blend effect needed
- Use very sparingly

### Decision Matrix

| Element Type | Hover | Pressed | Focus | Disabled |
|--------------|-------|---------|-------|----------|
| Button | blend200 | blend300 | blend200 (saturate) | blend300 (desaturate) |
| Container | blend100 | - | - | - |
| Link | blend200 | - | blend200 (saturate) | blend300 (desaturate) |
| Input | blend100 | - | blend200 (saturate) | blend300 (desaturate) |
| Navigation | blend100 | blend200 | blend200 (saturate) | - |
| Icon | - | - | blend200 (saturate) | blend300 (desaturate) |

---

## Semantic Token Selection Guidance

### When to Use Semantic Tokens

**Prefer Semantic Tokens When**:
- Pattern matches a common interaction state
- Consistency across components is important
- Code should be self-documenting
- Pattern is likely to be reused

**Use Primitive Tokens When**:
- Pattern is unique or one-off
- Specific blend value is required for design
- Semantic token doesn't match the use case
- Prototyping or experimenting

### Available Semantic Tokens

**Hover States**:
```typescript
// Light backgrounds
semanticBlendTokens.blendHoverDarker
// → blend200 darker (8%)
// Use for: Standard button/link hover on light backgrounds

// Dark backgrounds
semanticBlendTokens.blendHoverLighter
// → blend200 lighter (8%)
// Use for: Standard button/link hover on dark backgrounds

// Energized hover
semanticBlendTokens.blendHoverSaturate
// → blend200 saturate (8%)
// Use for: Link hover with vibrancy emphasis
```

**Pressed States**:
```typescript
// Light backgrounds
semanticBlendTokens.blendPressedDarker
// → blend300 darker (12%)
// Use for: Button pressed/active state on light backgrounds

// Dark backgrounds
semanticBlendTokens.blendPressedLighter
// → blend300 lighter (12%)
// Use for: Button pressed/active state on dark backgrounds
```

**Focus States**:
```typescript
semanticBlendTokens.blendFocusSaturate
// → blend200 saturate (8%)
// Use for: Input focus, button focus ring, keyboard navigation
```

**Disabled States**:
```typescript
semanticBlendTokens.blendDisabledDesaturate
// → blend300 desaturate (12%)
// Use for: Disabled buttons, inputs, icons, inactive elements
```

**Container/Surface States**:
```typescript
// Light containers
semanticBlendTokens.blendContainerHoverDarker
// → blend100 darker (4%)
// Use for: Subtle container/surface hover on light backgrounds

// Dark containers
semanticBlendTokens.blendContainerHoverLighter
// → blend100 lighter (4%)
// Use for: Subtle container/surface hover on dark backgrounds
```

### Semantic Token Selection Decision Tree

```
What interaction state are you implementing?
│
├─ Hover state
│  ├─ Is it a button or link? → blendHoverDarker/Lighter
│  ├─ Is it a container/surface? → blendContainerHoverDarker/Lighter
│  └─ Is it a link with emphasis? → blendHoverSaturate
│
├─ Pressed/Active state
│  └─ Is it a button or interactive element? → blendPressedDarker/Lighter
│
├─ Focus state
│  └─ Is it keyboard navigation or focus ring? → blendFocusSaturate
│
└─ Disabled/Inactive state
   └─ Is element non-interactive? → blendDisabledDesaturate
```

### Example: Semantic Token Usage

```typescript
// ✅ GOOD - Using semantic token for standard button hover
const Button = styled.button`
  background: ${colors.primary};
  
  &:hover {
    background: ${darkerBlend(
      colors.primary,
      semanticBlendTokens.blendHoverDarker.primitiveReference
    )};
  }
`;

// ✅ ACCEPTABLE - Using primitive token for custom pattern
const CustomButton = styled.button`
  background: ${colors.primary};
  
  &:hover {
    // Custom pattern: stronger hover than standard
    background: ${darkerBlend(colors.primary, BlendTokens.blend300)};
  }
`;

// ❌ AVOID - Using primitive when semantic exists
const Button = styled.button`
  background: ${colors.primary};
  
  &:hover {
    // Should use semanticBlendTokens.blendHoverDarker instead
    background: ${darkerBlend(colors.primary, BlendTokens.blend200)};
  }
`;
```

---

## Composition Pattern Guidance

### Blend-Only Composition

**Pattern**: `color with blend direction`

**When to Use**:
- Standard interaction states
- No transparency needed
- Result should be fully opaque

**Example**:
```typescript
// Syntax: color with blend direction
purple500 with blend200 darker
→ purple500 + 8% black = darker purple (fully opaque)

// Usage in code
background: ${darkerBlend(colors.purple500, BlendTokens.blend200)}
```

### Blend + Opacity Composition

**Pattern**: `color with blend direction at opacity`

**When to Use**:
- Overlay effects with color modification
- Glassmorphism with tinted backgrounds
- Loading states with darkened, semi-transparent overlays
- Advanced visual effects

**Order of Operations**: Blend first, then opacity
```typescript
// Syntax: color with blend direction at opacity
purple500 with blend200 darker at opacity600
→ Step 1: purple500 + 8% black = #7C3AED (darker purple)
→ Step 2: #7C3AED at 48% opacity = rgba(124, 58, 237, 0.48)

// Usage in code
const blendedColor = darkerBlend(colors.purple500, BlendTokens.blend200);
background: rgba(${blendedColor}, ${OpacityTokens.opacity600});
```

**Use Cases**:
- Modal overlays with tinted background
- Loading spinners with darkened semi-transparent background
- Glassmorphism effects
- Layered visual effects

**Caution**: Composition adds complexity. Use only when both blend and opacity are needed.

### Composition Decision Tree

```
Do you need transparency?
│
├─ NO → Use blend-only composition
│  └─ color with blend direction
│
└─ YES → Do you also need color modification?
   │
   ├─ YES → Use blend + opacity composition
   │  └─ color with blend direction at opacity
   │
   └─ NO → Use opacity-only composition
      └─ color at opacity
```

---

## Component Token Boundary

### Token System Responsibility

**What Belongs in Token System**:
- Primitive blend tokens (blend100-blend500)
- Semantic blend tokens (blendHoverDarker, blendFocusSaturate, etc.)
- Blend direction definitions (darker, lighter, saturate, desaturate)
- Blend calculation utilities (darkerBlend, lighterBlend, etc.)

**What Does NOT Belong in Token System**:
- Component-specific compositions (button.hover, card.pressed)
- Component-specific color choices (which color to blend)
- Component-specific interaction patterns
- Component-specific state management

### Component Library Responsibility

**What Belongs in Component Library**:
- Component-specific token compositions
- Component state management
- Component interaction patterns
- Component-specific color selections

**Example: Button Component**:
```typescript
// ❌ WRONG - Component tokens in token system
// This should NOT be in token system
export const buttonTokens = {
  hover: darkerBlend(colors.primary, BlendTokens.blend200),
  pressed: darkerBlend(colors.primary, BlendTokens.blend300),
  disabled: desaturate(colors.primary, BlendTokens.blend300)
};

// ✅ CORRECT - Component tokens in component library
// This belongs in component library
const Button = styled.button`
  background: ${colors.primary};
  
  &:hover {
    background: ${darkerBlend(colors.primary, BlendTokens.blend200)};
  }
  
  &:active {
    background: ${darkerBlend(colors.primary, BlendTokens.blend300)};
  }
  
  &:disabled {
    background: ${desaturate(colors.primary, BlendTokens.blend300)};
  }
`;
```

### Decision Criteria

**Ask These Questions**:

1. **Is this a generic pattern or component-specific?**
   - Generic → Token system (semantic token)
   - Component-specific → Component library

2. **Does this apply to multiple components?**
   - Yes → Token system (semantic token)
   - No → Component library

3. **Is this about HOW to blend or WHAT to blend?**
   - HOW (blend direction, value) → Token system
   - WHAT (which color, which component) → Component library

4. **Would changing this affect one component or many?**
   - One component → Component library
   - Many components → Token system

### Boundary Examples

**Token System (Generic Patterns)**:
```typescript
// ✅ Generic hover pattern - belongs in token system
semanticBlendTokens.blendHoverDarker = {
  primitiveReference: 'blend200',
  direction: BlendDirection.DARKER,
  context: 'Standard hover feedback - darker color for light backgrounds'
};

// ✅ Generic focus pattern - belongs in token system
semanticBlendTokens.blendFocusSaturate = {
  primitiveReference: 'blend200',
  direction: BlendDirection.SATURATE,
  context: 'Focus state feedback - more vibrant, attention-drawing'
};
```

**Component Library (Component-Specific)**:
```typescript
// ✅ Button-specific composition - belongs in component library
const Button = styled.button`
  background: ${colors.primary};
  
  &:hover {
    background: ${darkerBlend(
      colors.primary,
      semanticBlendTokens.blendHoverDarker.primitiveReference
    )};
  }
`;

// ✅ Card-specific composition - belongs in component library
const Card = styled.div`
  background: ${colors.surface};
  
  &:hover {
    background: ${darkerBlend(
      colors.surface,
      semanticBlendTokens.blendContainerHoverDarker.primitiveReference
    )};
  }
`;
```

---

## AI Agent Decision Checklist

When generating code with blend tokens, verify:

### 1. Blend Direction Selection
- [ ] Identified interaction type (hover, pressed, focus, disabled)
- [ ] Determined background color (light or dark)
- [ ] Selected appropriate blend direction (darker, lighter, saturate, desaturate)
- [ ] Verified direction matches background and interaction type

### 2. Blend Value Selection
- [ ] Determined feedback strength needed (subtle, standard, strong)
- [ ] Selected appropriate blend value (blend100-blend500)
- [ ] Verified value matches element type and interaction
- [ ] Considered visual hierarchy and context

### 3. Semantic Token Usage
- [ ] Checked if semantic token exists for this pattern
- [ ] Preferred semantic token over primitive when available
- [ ] Used primitive token only for unique/custom patterns
- [ ] Documented reason if not using semantic token

### 4. Composition Pattern
- [ ] Determined if transparency is needed
- [ ] Used blend-only composition when no transparency needed
- [ ] Used blend + opacity composition only when both needed
- [ ] Verified correct order of operations (blend → opacity)

### 5. Component Boundary
- [ ] Verified composition is in component library, not token system
- [ ] Used token system only for generic patterns
- [ ] Kept component-specific logic in component code
- [ ] Did not create component tokens in token system

### 6. Code Quality
- [ ] Verified imports are correct
- [ ] Checked function signatures match implementation
- [ ] Ensured code compiles without errors
- [ ] Tested generated code works as expected

---

## Common AI Agent Mistakes to Avoid

### Mistake 1: Wrong Blend Direction for Background

```typescript
// ❌ WRONG - Using darker blend on dark background
const DarkButton = styled.button`
  background: ${colors.gray800}; // Dark background
  
  &:hover {
    background: ${darkerBlend(colors.gray800, BlendTokens.blend200)};
    // This makes it even darker - hard to see!
  }
`;

// ✅ CORRECT - Using lighter blend on dark background
const DarkButton = styled.button`
  background: ${colors.gray800}; // Dark background
  
  &:hover {
    background: ${lighterBlend(colors.gray800, BlendTokens.blend200)};
    // This makes it lighter - visible feedback
  }
`;
```

### Mistake 2: Using Primitive When Semantic Exists

```typescript
// ❌ WRONG - Using primitive for standard pattern
const Button = styled.button`
  background: ${colors.primary};
  
  &:hover {
    background: ${darkerBlend(colors.primary, BlendTokens.blend200)};
    // Should use semantic token
  }
`;

// ✅ CORRECT - Using semantic token
const Button = styled.button`
  background: ${colors.primary};
  
  &:hover {
    background: ${darkerBlend(
      colors.primary,
      semanticBlendTokens.blendHoverDarker.primitiveReference
    )};
  }
`;
```

### Mistake 3: Creating Component Tokens in Token System

```typescript
// ❌ WRONG - Component tokens in token system
export const buttonTokens = {
  hover: darkerBlend(colors.primary, BlendTokens.blend200),
  pressed: darkerBlend(colors.primary, BlendTokens.blend300)
};

// ✅ CORRECT - Component tokens in component library
const Button = styled.button`
  background: ${colors.primary};
  
  &:hover {
    background: ${darkerBlend(colors.primary, BlendTokens.blend200)};
  }
  
  &:active {
    background: ${darkerBlend(colors.primary, BlendTokens.blend300)};
  }
`;
```

### Mistake 4: Incorrect Composition Order

```typescript
// ❌ WRONG - Applying opacity first, then blend
const overlay = applyOpacity(colors.purple500, OpacityTokens.opacity600);
const result = darkerBlend(overlay, BlendTokens.blend200);
// Wrong order!

// ✅ CORRECT - Applying blend first, then opacity
const blended = darkerBlend(colors.purple500, BlendTokens.blend200);
const result = applyOpacity(blended, OpacityTokens.opacity600);
// Correct order: blend → opacity
```

### Mistake 5: Using Wrong Blend Value for Element Type

```typescript
// ❌ WRONG - Using strong blend for container hover
const Container = styled.div`
  background: ${colors.white100};
  
  &:hover {
    background: ${darkerBlend(colors.white100, BlendTokens.blend300)};
    // Too strong for container hover!
  }
`;

// ✅ CORRECT - Using subtle blend for container hover
const Container = styled.div`
  background: ${colors.white100};
  
  &:hover {
    background: ${darkerBlend(colors.white100, BlendTokens.blend100)};
    // Subtle feedback appropriate for container
  }
`;
```

---

## Quick Reference

### Blend Direction Quick Guide

| Background | Hover/Pressed | Focus | Disabled |
|------------|---------------|-------|----------|
| Light | darker | saturate | desaturate |
| Dark | lighter | saturate | desaturate |

### Blend Value Quick Guide

| Element Type | Hover | Pressed | Focus | Disabled |
|--------------|-------|---------|-------|----------|
| Button | blend200 | blend300 | blend200 | blend300 |
| Container | blend100 | - | - | - |
| Link | blend200 | - | blend200 | blend300 |
| Input | blend100 | - | blend200 | blend300 |

### Semantic Token Quick Reference

- `blendHoverDarker` → Button/link hover on light backgrounds
- `blendHoverLighter` → Button/link hover on dark backgrounds
- `blendPressedDarker` → Button pressed on light backgrounds
- `blendPressedLighter` → Button pressed on dark backgrounds
- `blendFocusSaturate` → Focus states (all backgrounds)
- `blendDisabledDesaturate` → Disabled states (all backgrounds)
- `blendContainerHoverDarker` → Container hover on light backgrounds
- `blendContainerHoverLighter` → Container hover on dark backgrounds

---

## Summary

When generating code with blend tokens:

1. **Select blend direction** based on background color and interaction type
2. **Choose blend value** based on feedback strength and element type
3. **Prefer semantic tokens** for common patterns
4. **Use composition** only when both blend and opacity are needed
5. **Keep component tokens** in component library, not token system
6. **Verify code quality** before committing

Follow these guidelines to ensure consistent, correct, and maintainable blend token usage across all generated code.

---

*This guide provides AI agents with clear decision criteria and patterns for selecting and using blend tokens appropriately.*
