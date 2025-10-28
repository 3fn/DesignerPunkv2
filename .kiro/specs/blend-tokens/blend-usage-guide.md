# Blend Token Usage Guide

**Date**: October 28, 2025
**Purpose**: Comprehensive guide for using blend tokens across all blend directions
**Organization**: spec-guide
**Scope**: blend-tokens
**Implementation Status**: Conceptual - API design phase
**AI Agent Guidance**: Examples show intended API design. DO NOT copy directly. Verify actual implementation in src/ before use.

---

## ⚠️ Implementation Status: Conceptual Examples

**These code examples are conceptual and demonstrate the intended API design.**

The blend token system is currently under development. These examples show:
- **How blend tokens will work** once the system is fully implemented
- **The intended developer experience** and API design patterns
- **Cross-platform usage patterns** that will be consistent across web, iOS, and Android

### For AI Agents

**DO NOT copy these code examples directly into production code.**

Before generating code that uses blend tokens, you MUST:

1. **Verify implementation exists**: Check `src/tokens/BlendTokens.ts` and `src/composition/BlendComposition.ts` for actual exports
2. **Verify API signatures**: Confirm function signatures match these examples (they may differ during development)
3. **Check import paths**: Verify actual package structure and import paths in the codebase
4. **Test before committing**: Ensure generated code compiles and runs correctly

**When in doubt**: Ask the human developer to confirm the current implementation status before proceeding.

### For Human Developers

These examples illustrate blend token concepts and usage patterns. Before using blend tokens in your code:

1. Check the current implementation status in `src/tokens/` and `src/composition/`
2. Refer to actual API documentation once available
3. Run tests to verify behavior matches expectations

### When This Warning Will Be Removed

This warning section will be removed when:
- Blend token implementation is complete and tested
- API is stable and production-ready
- Actual usage examples have been validated in real components

**Current Status** (October 28, 2025): API design and core implementation in progress. Examples are conceptual.

---

## Related Documentation

- [Design Document](./design.md) - Blend token architecture and design decisions
- [Requirements Document](./requirements.md) - Blend token system requirements
- [Blend vs Explicit Colors Guide](./blend-vs-explicit-colors.md) - When to use blend vs explicit color tokens

---

## Introduction

Blend tokens provide a mathematical approach to color modification for interaction states, focus feedback, and visual emphasis. This guide demonstrates how to use each blend direction (darker, lighter, saturate, desaturate) with practical examples across common UI patterns.

### Key Concepts

**Blend Directions**:
- **Darker**: Overlay black at specified opacity (hover, pressed states)
- **Lighter**: Overlay white at specified opacity (dark background interactions)
- **Saturate**: Increase color intensity in HSL space (focus, emphasis)
- **Desaturate**: Decrease color intensity in HSL space (disabled, inactive)

**Blend Scale**:
- `blend100` (4%) - Subtle modification for gentle feedback
- `blend200` (8%) - Standard modification for noticeable feedback
- `blend300` (12%) - Strong modification for clear feedback
- `blend400` (16%) - Very strong modification for emphasized feedback
- `blend500` (20%) - Maximum modification for dramatic feedback

---

## Darker Blend Examples

Darker blends overlay black at the specified opacity, creating darker versions of colors. This is the most common blend direction for hover and pressed states on light backgrounds.

### Button Hover States

**Use Case**: Standard button hover feedback

```typescript
// Web (TypeScript)
import { BlendTokens, darkerBlend } from '@designerpunk/tokens';

const Button = styled.button`
  background: ${colors.purple500};
  
  &:hover {
    background: ${darkerBlend(colors.purple500, BlendTokens.blend200)};
  }
`;

// Result: purple500 (#A855F7) + 8% black = #9A4EE3 (darker purple)
```

```swift
// iOS (Swift)
import DesignerPunkTokens

Button("Click Me")
  .background(colors.purple500)
  .onHover { isHovered in
    if isHovered {
      colors.purple500.darkerBlend(BlendTokens.blend200)
    }
  }

// Result: purple500 + 8% black = darker purple
```

```kotlin
// Android (Kotlin)
import com.designerpunk.tokens.BlendTokens
import com.designerpunk.tokens.darkerBlend

Button(
  colors = ButtonDefaults.buttonColors(
    containerColor = if (isHovered) {
      colors.purple500.darkerBlend(BlendTokens.blend200)
    } else {
      colors.purple500
    }
  )
)

// Result: purple500 + 8% black = darker purple
```

### Button Pressed States

**Use Case**: Stronger feedback for pressed/active states

```typescript
// Web (TypeScript)
const Button = styled.button`
  background: ${colors.blue500};
  
  &:hover {
    background: ${darkerBlend(colors.blue500, BlendTokens.blend200)};
  }
  
  &:active {
    background: ${darkerBlend(colors.blue500, BlendTokens.blend300)};
  }
`;

// Hover: blue500 + 8% black = slightly darker
// Active: blue500 + 12% black = noticeably darker
```

### Container Hover States

**Use Case**: Subtle surface feedback on hover

```typescript
// Web (TypeScript)
const Container = styled.div`
  background: ${colors.white100};
  
  &:hover {
    background: ${darkerBlend(colors.white100, BlendTokens.blend100)};
  }
`;

// Result: white100 + 4% black = very subtle darkening
```

### Navigation Item Active State

**Use Case**: Indicate active navigation item

```typescript
// Web (TypeScript)
const NavItem = styled.a`
  background: transparent;
  
  &.active {
    background: ${darkerBlend(colors.gray100, BlendTokens.blend200)};
  }
  
  &:hover:not(.active) {
    background: ${darkerBlend(colors.gray100, BlendTokens.blend100)};
  }
`;

// Active: gray100 + 8% black = clear indication
// Hover: gray100 + 4% black = subtle feedback
```

### Semantic Token Usage

**Use Case**: Using semantic blend tokens for consistency

```typescript
// Web (TypeScript)
import { semanticBlendTokens } from '@designerpunk/tokens/semantic';

const Button = styled.button`
  background: ${colors.primary};
  
  &:hover {
    background: ${darkerBlend(
      colors.primary, 
      semanticBlendTokens.blendHoverDarker.primitiveReference
    )};
  }
  
  &:active {
    background: ${darkerBlend(
      colors.primary,
      semanticBlendTokens.blendPressedDarker.primitiveReference
    )};
  }
`;

// Hover: Uses blend200 darker (8%)
// Active: Uses blend300 darker (12%)
```

---

## Lighter Blend Examples

Lighter blends overlay white at the specified opacity, creating lighter versions of colors. This is essential for hover and pressed states on dark backgrounds.

### Dark Background Button Hover

**Use Case**: Button hover on dark backgrounds

```typescript
// Web (TypeScript)
const DarkButton = styled.button`
  background: ${colors.gray800};
  color: ${colors.white100};
  
  &:hover {
    background: ${lighterBlend(colors.gray800, BlendTokens.blend200)};
  }
`;

// Result: gray800 + 8% white = lighter gray
```

```swift
// iOS (Swift)
Button("Click Me")
  .background(colors.gray800)
  .foregroundColor(colors.white100)
  .onHover { isHovered in
    if isHovered {
      colors.gray800.lighterBlend(BlendTokens.blend200)
    }
  }

// Result: gray800 + 8% white = lighter gray
```

### Dark Mode Container Hover

**Use Case**: Surface feedback in dark mode

```typescript
// Web (TypeScript)
const DarkContainer = styled.div`
  background: ${colors.gray900};
  
  &:hover {
    background: ${lighterBlend(colors.gray900, BlendTokens.blend100)};
  }
`;

// Result: gray900 + 4% white = subtle lightening
```

### Dark Navigation Active State

**Use Case**: Active navigation item on dark background

```typescript
// Web (TypeScript)
const DarkNavItem = styled.a`
  background: transparent;
  
  &.active {
    background: ${lighterBlend(colors.gray800, BlendTokens.blend200)};
  }
  
  &:hover:not(.active) {
    background: ${lighterBlend(colors.gray800, BlendTokens.blend100)};
  }
`;

// Active: gray800 + 8% white = clear indication
// Hover: gray800 + 4% white = subtle feedback
```

### Dark Mode Container Hover

**Use Case**: Subtle container feedback in dark mode

```typescript
// Web (TypeScript)
const DarkContainer = styled.div`
  background: ${colors.gray850};
  
  &:hover {
    background: ${lighterBlend(
      colors.gray850,
      semanticBlendTokens.blendContainerHoverLighter.primitiveReference
    )};
  }
`;

// Result: gray850 + 4% white (blend100) = very subtle lightening
```

### Pressed State on Dark Background

**Use Case**: Stronger feedback for pressed state

```typescript
// Web (TypeScript)
const DarkButton = styled.button`
  background: ${colors.blue700};
  
  &:hover {
    background: ${lighterBlend(colors.blue700, BlendTokens.blend200)};
  }
  
  &:active {
    background: ${lighterBlend(colors.blue700, BlendTokens.blend300)};
  }
`;

// Hover: blue700 + 8% white = slightly lighter
// Active: blue700 + 12% white = noticeably lighter
```

---

## Saturate Blend Examples

Saturate blends increase color intensity in HSL color space, making colors more vibrant. This is ideal for focus states and emphasis where you want to draw attention.

### Input Focus State

**Use Case**: Emphasize focused input field

```typescript
// Web (TypeScript)
const Input = styled.input`
  border: 2px solid ${colors.blue500};
  
  &:focus {
    border-color: ${saturate(colors.blue500, BlendTokens.blend200)};
    outline: none;
  }
`;

// Result: blue500 becomes more vibrant (8% more saturated)
```

```swift
// iOS (Swift)
TextField("Enter text", text: $text)
  .border(
    isFocused ? 
      colors.blue500.saturate(BlendTokens.blend200) : 
      colors.blue500,
    width: 2
  )

// Result: blue500 becomes more vibrant when focused
```

### Button Focus Ring

**Use Case**: Accessible focus indicator

```typescript
// Web (TypeScript)
const Button = styled.button`
  background: ${colors.purple500};
  
  &:focus-visible {
    outline: 3px solid ${saturate(colors.purple500, BlendTokens.blend200)};
    outline-offset: 2px;
  }
`;

// Result: purple500 focus ring is more vibrant than button background
```

### Link Hover State

**Use Case**: Energized link hover

```typescript
// Web (TypeScript)
const Link = styled.a`
  color: ${colors.blue600};
  
  &:hover {
    color: ${saturate(colors.blue600, BlendTokens.blend200)};
  }
`;

// Result: blue600 becomes more vibrant on hover
```

### Icon Emphasis

**Use Case**: Draw attention to important icons

```typescript
// Web (TypeScript)
const ImportantIcon = styled.svg`
  fill: ${colors.yellow500};
  
  &.emphasized {
    fill: ${saturate(colors.yellow500, BlendTokens.blend300)};
  }
`;

// Result: yellow500 becomes more vibrant (12% more saturated)
```

### Semantic Focus Token

**Use Case**: Using semantic token for focus states

```typescript
// Web (TypeScript)
const FocusableElement = styled.div`
  border: 2px solid ${colors.primary};
  
  &:focus-within {
    border-color: ${saturate(
      colors.primary,
      semanticBlendTokens.blendFocusSaturate.primitiveReference
    )};
  }
`;

// Result: Uses blend200 saturate (8% more saturated)
```

---

## Desaturate Blend Examples

Desaturate blends decrease color intensity in HSL color space, making colors more muted. This is perfect for disabled states and inactive elements.

### Disabled Button

**Use Case**: Indicate disabled button state

```typescript
// Web (TypeScript)
const Button = styled.button`
  background: ${colors.blue500};
  
  &:disabled {
    background: ${desaturate(colors.blue500, BlendTokens.blend300)};
    cursor: not-allowed;
  }
`;

// Result: blue500 becomes muted (12% less saturated)
```

```swift
// iOS (Swift)
Button("Submit")
  .background(
    isEnabled ? 
      colors.blue500 : 
      colors.blue500.desaturate(BlendTokens.blend300)
  )
  .disabled(!isEnabled)

// Result: blue500 becomes muted when disabled
```

```kotlin
// Android (Kotlin)
Button(
  onClick = { /* action */ },
  enabled = isEnabled,
  colors = ButtonDefaults.buttonColors(
    containerColor = if (isEnabled) {
      colors.blue500
    } else {
      colors.blue500.desaturate(BlendTokens.blend300)
    }
  )
)

// Result: blue500 becomes muted when disabled
```

### Inactive Tab

**Use Case**: Show inactive tab state

```typescript
// Web (TypeScript)
const Tab = styled.button`
  color: ${colors.gray700};
  
  &:not(.active) {
    color: ${desaturate(colors.gray700, BlendTokens.blend200)};
  }
`;

// Result: gray700 becomes more muted when inactive
```

### Disabled Input

**Use Case**: Indicate disabled input field

```typescript
// Web (TypeScript)
const Input = styled.input`
  border: 2px solid ${colors.gray400};
  background: ${colors.white100};
  
  &:disabled {
    border-color: ${desaturate(colors.gray400, BlendTokens.blend300)};
    background: ${desaturate(colors.white100, BlendTokens.blend200)};
  }
`;

// Result: Both border and background become more muted
```

### Inactive Icon

**Use Case**: Show inactive icon state

```typescript
// Web (TypeScript)
const Icon = styled.svg`
  fill: ${colors.blue500};
  
  &.inactive {
    fill: ${desaturate(colors.blue500, BlendTokens.blend300)};
  }
`;

// Result: blue500 becomes muted (12% less saturated)
```

### Semantic Disabled Token

**Use Case**: Using semantic token for disabled states

```typescript
// Web (TypeScript)
const DisabledElement = styled.button`
  background: ${colors.primary};
  
  &:disabled {
    background: ${desaturate(
      colors.primary,
      semanticBlendTokens.blendDisabledDesaturate.primitiveReference
    )};
  }
`;

// Result: Uses blend300 desaturate (12% less saturated)
```

---

## Container and Surface Hover Examples

Container and surface elements require more subtle blend values to avoid overwhelming the interface. Use `blend100` (4%) for gentle feedback.

### Container Hover

**Use Case**: Subtle feedback on Container hover

```typescript
// Web (TypeScript)
const Container = styled.div`
  background: ${colors.white100};
  transition: background 150ms ease;
  
  &:hover {
    background: ${darkerBlend(
      colors.white100,
      semanticBlendTokens.blendContainerHoverDarker.primitiveReference
    )};
  }
`;

// Result: white100 + 4% black = very subtle darkening
```

### List Item Hover

**Use Case**: Subtle hover feedback in lists

```typescript
// Web (TypeScript)
const ListItem = styled.li`
  background: transparent;
  
  &:hover {
    background: ${darkerBlend(colors.gray50, BlendTokens.blend100)};
  }
`;

// Result: gray50 + 4% black = gentle feedback
```

### Table Row Hover

**Use Case**: Subtle row hover in tables

```typescript
// Web (TypeScript)
const TableRow = styled.tr`
  background: ${colors.white100};
  
  &:hover {
    background: ${darkerBlend(colors.white100, BlendTokens.blend100)};
  }
  
  &:nth-child(even) {
    background: ${colors.gray50};
    
    &:hover {
      background: ${darkerBlend(colors.gray50, BlendTokens.blend100)};
    }
  }
`;

// Result: Both white and gray rows get subtle darkening on hover
```

### Dark Mode Container Hover

**Use Case**: Subtle feedback on dark containers

```typescript
// Web (TypeScript)
const DarkContainer = styled.div`
  background: ${colors.gray900};
  
  &:hover {
    background: ${lighterBlend(
      colors.gray900,
      semanticBlendTokens.blendContainerHoverLighter.primitiveReference
    )};
  }
`;

// Result: gray900 + 4% white = very subtle lightening
```

### Sidebar Item Hover

**Use Case**: Subtle navigation item hover

```typescript
// Web (TypeScript)
const SidebarItem = styled.a`
  background: transparent;
  
  &:hover {
    background: ${darkerBlend(colors.gray100, BlendTokens.blend100)};
  }
  
  &.active {
    background: ${darkerBlend(colors.gray100, BlendTokens.blend200)};
  }
`;

// Hover: gray100 + 4% black = subtle feedback
// Active: gray100 + 8% black = clear indication
```

---

## Combining Blend Directions

You can use different blend directions for different interaction states on the same element.

### Complete Button States

**Use Case**: Comprehensive button interaction feedback

```typescript
// Web (TypeScript)
const Button = styled.button`
  background: ${colors.blue500};
  border: 2px solid transparent;
  
  /* Hover: darker background */
  &:hover:not(:disabled) {
    background: ${darkerBlend(colors.blue500, BlendTokens.blend200)};
  }
  
  /* Active: even darker background */
  &:active:not(:disabled) {
    background: ${darkerBlend(colors.blue500, BlendTokens.blend300)};
  }
  
  /* Focus: saturated border */
  &:focus-visible {
    border-color: ${saturate(colors.blue500, BlendTokens.blend200)};
    outline: none;
  }
  
  /* Disabled: desaturated background */
  &:disabled {
    background: ${desaturate(colors.blue500, BlendTokens.blend300)};
    cursor: not-allowed;
  }
`;

// Hover: darker (8%)
// Active: darker (12%)
// Focus: saturated (8%)
// Disabled: desaturated (12%)
```

### Input Field States

**Use Case**: Complete input interaction feedback

```typescript
// Web (TypeScript)
const Input = styled.input`
  border: 2px solid ${colors.gray400};
  background: ${colors.white100};
  
  /* Hover: slightly darker border */
  &:hover:not(:disabled):not(:focus) {
    border-color: ${darkerBlend(colors.gray400, BlendTokens.blend100)};
  }
  
  /* Focus: saturated border */
  &:focus {
    border-color: ${saturate(colors.blue500, BlendTokens.blend200)};
    outline: none;
  }
  
  /* Disabled: desaturated border and background */
  &:disabled {
    border-color: ${desaturate(colors.gray400, BlendTokens.blend300)};
    background: ${desaturate(colors.white100, BlendTokens.blend200)};
  }
`;

// Hover: darker border (4%)
// Focus: saturated border (8%)
// Disabled: desaturated border (12%) and background (8%)
```

---

## Best Practices

### Choose Appropriate Blend Values

**Subtle Feedback** (blend100 - 4%):
- Container hover states
- Surface hover states
- Gentle visual feedback

**Standard Feedback** (blend200 - 8%):
- Button hover states
- Link hover states
- Focus states (saturate)
- Standard interaction feedback

**Strong Feedback** (blend300 - 12%):
- Button pressed states
- Active navigation items
- Disabled states (desaturate)
- Clear state indication

**Very Strong Feedback** (blend400 - 16%):
- Emphasized pressed states
- Strong visual emphasis
- Use sparingly

**Maximum Feedback** (blend500 - 20%):
- Dramatic emphasis
- Special cases only
- Use very sparingly

### Use Semantic Tokens for Consistency

Prefer semantic blend tokens over primitive tokens for common patterns:

```typescript
// ✅ GOOD - Using semantic tokens
background: ${darkerBlend(
  colors.primary,
  semanticBlendTokens.blendHoverDarker.primitiveReference
)};

// ⚠️ ACCEPTABLE - Using primitive tokens directly
background: ${darkerBlend(colors.primary, BlendTokens.blend200)};
```

### Match Blend Direction to Background

**Light Backgrounds**: Use darker blends
**Dark Backgrounds**: Use lighter blends

```typescript
// ✅ GOOD - Darker blend on light background
const LightButton = styled.button`
  background: ${colors.blue500};
  &:hover { background: ${darkerBlend(colors.blue500, BlendTokens.blend200)}; }
`;

// ✅ GOOD - Lighter blend on dark background
const DarkButton = styled.button`
  background: ${colors.blue700};
  &:hover { background: ${lighterBlend(colors.blue700, BlendTokens.blend200)}; }
`;
```

### Provide Smooth Transitions

Add CSS transitions for smooth blend changes:

```typescript
// Web (TypeScript)
const Button = styled.button`
  background: ${colors.blue500};
  transition: background 150ms ease;
  
  &:hover {
    background: ${darkerBlend(colors.blue500, BlendTokens.blend200)};
  }
`;
```

### Consider Accessibility

Ensure sufficient contrast after applying blends:

```typescript
// Check contrast after blend
const hoverColor = darkerBlend(colors.blue500, BlendTokens.blend200);
// Verify hoverColor maintains WCAG AA contrast with text color
```

---

## Platform-Specific Considerations

### Web

- Use CSS transitions for smooth blend changes
- Consider `:focus-visible` for keyboard-only focus styles
- Test across different browsers for color consistency

### iOS

- Use SwiftUI's `.onHover` modifier for hover states
- Consider haptic feedback with blend changes
- Test on different device sizes and color profiles

### Android

- Use Compose's `Modifier.hoverable()` for hover states
- Consider ripple effects with blend changes
- Test across different device densities and color modes

---

## Summary

Blend tokens provide a systematic approach to color modification across all interaction states:

- **Darker**: Standard hover/pressed on light backgrounds
- **Lighter**: Standard hover/pressed on dark backgrounds
- **Saturate**: Focus states and emphasis
- **Desaturate**: Disabled and inactive states

Use appropriate blend values based on feedback strength needed, prefer semantic tokens for consistency, and always consider accessibility and platform-specific patterns.

---

*This guide provides comprehensive examples for using blend tokens across all blend directions and common UI patterns.*
