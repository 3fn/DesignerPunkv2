# Border Width Token Usage Patterns Guide

**Date**: October 23, 2025
**Purpose**: Guide for using border width tokens in component design
**Organization**: spec-guide
**Scope**: border-width-tokens

---

## Related Guides

- [Compositional Color Guide](../typography-token-expansion/compositional-color-guide.md) - Explains compositional architecture for border width + color composition
- [Spacing Token Guide](../mathematical-token-system/spacing-tokens-guide.md) - Related mathematical token system for layout spacing
- [Focus Indicator Guide](./focus-indicator-guide.md) - Platform-specific focus indicator patterns using border width tokens

---

## Introduction

Border width tokens provide a minimal, purposeful set of values for defining border thickness across components. This guide explains when to use each semantic token (borderDefault, borderEmphasis, borderHeavy) and provides examples of appropriate and inappropriate usage patterns.

Border width tokens follow the compositional architecture principle: they define thickness only, and must be composed with color tokens to create complete border styles. This separation allows the same border width to be used with different colors in different contexts.

---

## Semantic Token Overview

### borderDefault (1px/pt/dp)

**Purpose**: Standard borders for default component states

**Visual Weight**: Neutral, subtle separation

**Common Use Cases**:
- Cards at rest
- Input fields at rest
- Buttons at rest
- Dividers and separators
- Table borders
- Container outlines

### borderEmphasis (2px/pt/dp)

**Purpose**: Emphasized borders for active, focused, or selected states

**Visual Weight**: Noticeable, attention-drawing

**Common Use Cases**:
- Input fields on focus
- Selected cards
- Active buttons
- Highlighted containers
- Web focus indicators (outline-width)
- Toggle switches in active state

### borderHeavy (4px/pt/dp)

**Purpose**: Strong visual weight for rare, high-emphasis scenarios

**Visual Weight**: Dominant, commanding attention

**Common Use Cases**:
- Critical alerts or warnings (rare)
- Strong brand emphasis (rare)
- Decorative elements with intentional visual weight
- Loading indicators or progress bars (when using border-based design)

**Important**: borderHeavy should be used sparingly. Most components should use borderDefault or borderEmphasis.

---

## Usage Patterns by Component

### Cards

#### ✅ Appropriate Usage

**Default State**:
```typescript
// Card at rest
<Card style={{
  border: `${borderDefault}px solid ${colorCardBorder}`,
}}>
  Card content
</Card>
```

**Selected State**:
```typescript
// Selected card with emphasis
<Card style={{
  border: `${borderEmphasis}px solid ${colorPrimary}`,
}}>
  Selected card content
</Card>
```

**Rationale**: Cards use borderDefault for subtle separation at rest, and borderEmphasis when selected to draw attention without overwhelming the interface.

#### ❌ Inappropriate Usage

**Don't use borderHeavy for standard cards**:
```typescript
// ❌ WRONG - Too heavy for standard card
<Card style={{
  border: `${borderHeavy}px solid ${colorCardBorder}`,
}}>
  Card content
</Card>
```

**Rationale**: borderHeavy creates excessive visual weight for standard cards, making the interface feel cluttered and reducing the effectiveness of actual emphasis.

---

### Input Fields

#### ✅ Appropriate Usage

**Default State**:
```typescript
// Input at rest
<Input style={{
  border: `${borderDefault}px solid ${colorInputBorder}`,
}}>
```

**Focus State**:
```typescript
// Input on focus
<Input style={{
  border: focused 
    ? `${borderEmphasis}px solid ${colorFocus}` 
    : `${borderDefault}px solid ${colorInputBorder}`,
}}>
```

**Error State**:
```typescript
// Input with error
<Input style={{
  border: hasError
    ? `${borderEmphasis}px solid ${colorError}`
    : `${borderDefault}px solid ${colorInputBorder}`,
}}>
```

**Rationale**: Inputs use borderDefault at rest for subtle definition, and borderEmphasis for focus/error states to clearly indicate interaction or validation status.

#### ❌ Inappropriate Usage

**Don't use borderEmphasis for default state**:
```typescript
// ❌ WRONG - Too emphasized for default state
<Input style={{
  border: `${borderEmphasis}px solid ${colorInputBorder}`,
}}>
```

**Rationale**: Using borderEmphasis for default state removes the ability to emphasize focus/error states, reducing the effectiveness of visual feedback.

---

### Buttons

#### ✅ Appropriate Usage

**Outlined Button at Rest**:
```typescript
// Outlined button default state
<Button style={{
  border: `${borderDefault}px solid ${colorPrimary}`,
  background: 'transparent',
}}>
  Button Label
</Button>
```

**Outlined Button Active/Pressed**:
```typescript
// Outlined button when pressed
<Button style={{
  border: isPressed
    ? `${borderEmphasis}px solid ${colorPrimary}`
    : `${borderDefault}px solid ${colorPrimary}`,
  background: 'transparent',
}}>
  Button Label
</Button>
```

**Rationale**: Outlined buttons use borderDefault for clear definition at rest, and borderEmphasis when pressed to provide tactile feedback.

#### ❌ Inappropriate Usage

**Don't use borderHeavy for standard buttons**:
```typescript
// ❌ WRONG - Too heavy for standard button
<Button style={{
  border: `${borderHeavy}px solid ${colorPrimary}`,
}}>
  Button Label
</Button>
```

**Rationale**: borderHeavy makes buttons feel clunky and reduces the visual hierarchy of the interface.

---

### Dividers and Separators

#### ✅ Appropriate Usage

**Horizontal Divider**:
```typescript
// Subtle content separation
<Divider style={{
  borderTop: `${borderDefault}px solid ${colorDivider}`,
}}>
```

**Section Separator**:
```typescript
// Stronger section separation
<Divider style={{
  borderTop: `${borderDefault}px solid ${colorDivider}`,
  marginTop: space200,
  marginBottom: space200,
}}>
```

**Rationale**: Dividers use borderDefault for subtle separation without competing with content. Spacing (not border width) provides visual hierarchy.

#### ❌ Inappropriate Usage

**Don't use borderEmphasis for standard dividers**:
```typescript
// ❌ WRONG - Too emphasized for content separation
<Divider style={{
  borderTop: `${borderEmphasis}px solid ${colorDivider}`,
}}>
```

**Rationale**: Emphasized dividers create visual noise and distract from content. Use spacing to create hierarchy, not border thickness.

---

### Tables

#### ✅ Appropriate Usage

**Table Cell Borders**:
```typescript
// Subtle cell separation
<TableCell style={{
  border: `${borderDefault}px solid ${colorTableBorder}`,
}}>
  Cell content
</TableCell>
```

**Table Header Borders**:
```typescript
// Header separation (can use borderDefault or borderEmphasis)
<TableHeader style={{
  borderBottom: `${borderDefault}px solid ${colorTableBorder}`,
}}>
  Header content
</TableHeader>
```

**Rationale**: Tables use borderDefault for cell borders to maintain readability without overwhelming the data. Header borders can optionally use borderEmphasis for stronger separation.

#### ❌ Inappropriate Usage

**Don't use borderHeavy for table borders**:
```typescript
// ❌ WRONG - Too heavy for table structure
<TableCell style={{
  border: `${borderHeavy}px solid ${colorTableBorder}`,
}}>
  Cell content
</TableCell>
```

**Rationale**: Heavy table borders make data harder to read and create visual clutter.

---

## Compositional Patterns

### Border Width + Color Composition

Border width tokens must be composed with color tokens to create complete border styles. This compositional architecture allows flexible combinations:

**Pattern**:
```typescript
border: `${borderWidth}px ${borderStyle} ${borderColor}`
```

**Examples**:

```typescript
// Default card border
border: `${borderDefault}px solid ${colorCardBorder}`

// Focused input border
border: `${borderEmphasis}px solid ${colorFocus}`

// Error input border
border: `${borderEmphasis}px solid ${colorError}`

// Selected card border
border: `${borderEmphasis}px solid ${colorPrimary}`

// Divider
borderTop: `${borderDefault}px solid ${colorDivider}`
```

**Rationale**: Separating border width from color allows the same width to be used with different semantic colors, maintaining consistency while supporting different contexts.

### Border Width + Spacing Composition

Border width tokens often compose with spacing tokens for complete component styling:

**Pattern**:
```typescript
// Border + padding composition
border: `${borderWidth}px solid ${borderColor}`,
padding: `${spacing}px`
```

**Examples**:

```typescript
// Card with border and padding
<Card style={{
  border: `${borderDefault}px solid ${colorCardBorder}`,
  padding: space150, // 12px padding
}}>
  Card content
</Card>

// Input with border and padding
<Input style={{
  border: `${borderDefault}px solid ${colorInputBorder}`,
  padding: `${space100}px ${space150}px`, // 8px vertical, 12px horizontal
}}>
```

**Rationale**: Border width and spacing work together to create balanced component proportions. See the Spacing Token Guide for detailed spacing patterns.

---

## Platform-Specific Considerations

### Web

**Focus Indicators**: Use `outline` (not `border`) with borderEmphasis width for accessibility:

```css
button:focus-visible {
  outline: ${borderEmphasis}px solid ${colorFocus};
  outline-offset: 2px;
}
```

**Rationale**: Outlines don't affect layout and are the standard for web focus indicators. See the Focus Indicator Guide for complete patterns.

### iOS

**System Borders**: iOS components often use system-provided borders. When custom borders are needed:

```swift
view.layer.borderWidth = CGFloat(borderDefault) // 1pt
view.layer.borderColor = colorCardBorder.cgColor
```

**Rationale**: iOS borders are applied via layer properties. Border width tokens convert to CGFloat values.

### Android

**Material Borders**: Android components often use elevation instead of borders. When borders are needed:

```kotlin
Box(
  modifier = Modifier.border(
    width = borderDefault.dp, // 1dp
    color = colorCardBorder
  )
)
```

**Rationale**: Android prefers elevation for depth, but borders are used for outlined components and dividers.

---

## Decision Framework

### When to Use borderDefault

**Use borderDefault when**:
- Component is in default/rest state
- Border provides subtle definition or separation
- Visual weight should be neutral
- Component is not interactive or not currently interacting

**Examples**: Cards at rest, inputs at rest, buttons at rest, dividers, table borders

### When to Use borderEmphasis

**Use borderEmphasis when**:
- Component is in active, focused, or selected state
- Border needs to draw attention
- Visual feedback is required for interaction
- Component state change needs clear indication

**Examples**: Inputs on focus, selected cards, active buttons, error states, web focus indicators

### When to Use borderHeavy

**Use borderHeavy when**:
- Strong visual weight is intentionally required
- Component demands dominant attention (rare)
- Decorative elements need heavy borders
- Brand guidelines specifically require heavy borders

**Examples**: Critical alerts (rare), strong brand emphasis (rare), decorative elements

**Important**: If you're considering borderHeavy, ask yourself: "Does this component really need to dominate the interface?" Most components should use borderDefault or borderEmphasis.

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Using borderEmphasis for Default States

**Problem**: Using borderEmphasis for default component states removes the ability to emphasize interactive states.

**Example**:
```typescript
// ❌ WRONG - Emphasis used for default state
<Input style={{
  border: `${borderEmphasis}px solid ${colorInputBorder}`,
}}>
```

**Solution**: Use borderDefault for default states, borderEmphasis for interactive states:
```typescript
// ✅ CORRECT - Default for rest, emphasis for focus
<Input style={{
  border: focused
    ? `${borderEmphasis}px solid ${colorFocus}`
    : `${borderDefault}px solid ${colorInputBorder}`,
}}>
```

### Anti-Pattern 2: Using borderHeavy for Standard Components

**Problem**: borderHeavy creates excessive visual weight for most components, making interfaces feel cluttered.

**Example**:
```typescript
// ❌ WRONG - Heavy border on standard card
<Card style={{
  border: `${borderHeavy}px solid ${colorCardBorder}`,
}}>
```

**Solution**: Use borderDefault for standard components:
```typescript
// ✅ CORRECT - Default border for standard card
<Card style={{
  border: `${borderDefault}px solid ${colorCardBorder}`,
}}>
```

### Anti-Pattern 3: Mixing Border Width and Spacing for Hierarchy

**Problem**: Using different border widths to create visual hierarchy instead of spacing.

**Example**:
```typescript
// ❌ WRONG - Using border width for hierarchy
<Section style={{ border: `${borderEmphasis}px solid ${colorDivider}` }}>
  <Subsection style={{ border: `${borderDefault}px solid ${colorDivider}` }}>
```

**Solution**: Use consistent border width, vary spacing for hierarchy:
```typescript
// ✅ CORRECT - Consistent border, spacing creates hierarchy
<Section style={{ 
  border: `${borderDefault}px solid ${colorDivider}`,
  padding: space200,
}}>
  <Subsection style={{ 
    border: `${borderDefault}px solid ${colorDivider}`,
    padding: space150,
  }}>
```

### Anti-Pattern 4: Hardcoding Border Width Values

**Problem**: Using hardcoded pixel values instead of border width tokens breaks consistency and maintainability.

**Example**:
```typescript
// ❌ WRONG - Hardcoded border width
<Card style={{
  border: '1px solid #E5E7EB',
}}>
```

**Solution**: Use border width tokens and color tokens:
```typescript
// ✅ CORRECT - Token-based border
<Card style={{
  border: `${borderDefault}px solid ${colorCardBorder}`,
}}>
```

---

## Migration Examples

### From Hardcoded Values to Tokens

**Before**:
```typescript
// Hardcoded border widths
const Card = styled.div`
  border: 1px solid #E5E7EB;
`;

const Input = styled.input`
  border: 1px solid #D1D5DB;
  
  &:focus {
    border: 2px solid #3B82F6;
  }
`;

const Button = styled.button`
  border: 2px solid #3B82F6;
`;
```

**After**:
```typescript
// Token-based border widths
const Card = styled.div`
  border: ${borderDefault}px solid ${colorCardBorder};
`;

const Input = styled.input`
  border: ${borderDefault}px solid ${colorInputBorder};
  
  &:focus {
    border: ${borderEmphasis}px solid ${colorFocus};
  }
`;

const Button = styled.button`
  border: ${borderDefault}px solid ${colorPrimary};
`;
```

**Benefits**:
- Consistent border widths across components
- Semantic meaning (default vs emphasis) instead of arbitrary values
- Easy to update border widths system-wide
- Clear visual hierarchy through semantic tokens

---

## Summary

Border width tokens provide a minimal, purposeful set of values for component borders:

- **borderDefault (1px/pt/dp)**: Standard borders for default states
- **borderEmphasis (2px/pt/dp)**: Emphasized borders for active/focused/selected states
- **borderHeavy (4px/pt/dp)**: Strong visual weight (rare use)

**Key Principles**:
1. Use borderDefault for default component states
2. Use borderEmphasis for interactive states (focus, active, selected)
3. Use borderHeavy sparingly for intentional visual dominance
4. Compose border width with color tokens for complete border styles
5. Use spacing (not border width) to create visual hierarchy
6. Follow platform-specific patterns for focus indicators

**Related Documentation**:
- [Compositional Color Guide](../typography-token-expansion/compositional-color-guide.md) - Border width + color composition
- [Spacing Token Guide](../mathematical-token-system/spacing-tokens-guide.md) - Border width + spacing composition
- [Focus Indicator Guide](./focus-indicator-guide.md) - Platform-specific focus patterns

---

*This guide provides clear patterns for using border width tokens effectively across components and platforms while maintaining visual consistency and semantic meaning.*
