# Semantic Grid vs Semantic Spacing Token Guide

**Date**: November 6, 2025
**Purpose**: Explain the distinction between semantic grid tokens and semantic spacing tokens for systematic token selection
**Organization**: spec-guide
**Scope**: responsive-layout-system

---

## Related Documentation

- [Design Document](./design.md#semantic-grid-tokens-vs-semantic-spacing-tokens) - Complete architectural context
- [Requirements Document](./requirements.md#requirement-2-grid-spacing-token-system) - Grid spacing requirements
- [Existing Semantic Spacing Tokens](../../src/tokens/semantic/SpacingTokens.ts) - Component-level spacing tokens

---

## Overview

The responsive layout system introduces **semantic grid tokens** for page-level layout spacing, which are distinct from the existing **semantic spacing tokens** used for component-level spacing. Understanding when to use each type is critical for maintaining consistent, systematic layouts across all platforms.

This guide provides a clear decision framework, edge case examples, and validation rules to help developers and AI agents make correct token choices.

---

## Core Distinction

### Semantic Grid Tokens (Page-Level Layout)

**Purpose**: Horizontal positioning and spacing at the page/screen layout level

**Usage Context**:
- Spacing between page-level elements laid out horizontally
- Container margins at page edges
- Grid-based page layouts with multiple content sections
- Open layouts where elements are positioned independently on the page

**Token Examples**:
- `gridGutterXs`, `gridGutterSm`, `gridGutterMd`, `gridGutterLg` - Spacing between grid columns
- `gridMarginXs`, `gridMarginSm`, `gridMarginMd`, `gridMarginLg` - Page container margins
- `gridGutterNative`, `gridMarginNative` - Native platform grid spacing (iOS, Android)

**Visual Pattern**:
```
┌─────────────────────────────────────────────────────┐
│ [gridMargin]                         [gridMargin]   │
│              ┌──────┐ [gridGutter] ┌──────┐        │
│              │ Card │               │ Card │        │
│              │      │               │      │        │
│              └──────┘               └──────┘        │
│                                                      │
│              ┌──────┐ [gridGutter] ┌──────┐        │
│              │ Card │               │ Card │        │
│              │      │               │      │        │
│              └──────┘               └──────┘        │
└─────────────────────────────────────────────────────┘
```

### Semantic Spacing Tokens (Component-Level Layout)

**Purpose**: Spacing within components or grouped component collections

**Usage Context**:
- Internal component padding
- Spacing between elements within components
- Spacing between components within a container (carousel, tabs, accordion)
- Grouped collections where components are contained together

**Token Examples**:
- `stackXs`, `stackSm`, `stackMd`, `stackLg` - Vertical spacing between stacked elements
- `insetXs`, `insetSm`, `insetMd`, `insetLg` - Internal padding within components
- `inlineXs`, `inlineSm`, `inlineMd`, `inlineLg` - Horizontal spacing between inline elements

**Visual Pattern**:
```
┌─────────────────────────────────────┐
│ [inset]                             │
│  ┌───────────────────────────────┐  │
│  │ Card Header                   │  │
│  └───────────────────────────────┘  │
│  [stack]                            │
│  ┌───────────────────────────────┐  │
│  │ Card Content                  │  │
│  │                               │  │
│  │ [inline] Button  Button       │  │
│  └───────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

---

## Decision Framework

Use this systematic framework to determine which token type to use:

### Question 1: Is this spacing between page-level elements laid out horizontally?

**YES** → Use **grid tokens** (`gridGutterXs/Sm/Md/Lg`, `gridMarginXs/Sm/Md/Lg`)

**Examples**:
- Cards laid out openly on a page (use `gridGutterMd` between cards)
- Page container margins (use `gridMarginMd` for page edges)
- Multi-column layouts with independent content sections
- Dashboard widgets positioned on a grid

**NO** → Go to Question 2

### Question 2: Is this spacing within a component or grouped component collection?

**YES** → Use **spacing tokens** (`stackXs/Sm/Md/Lg`, `insetXs/Sm/Md/Lg`, `inlineXs/Sm/Md/Lg`)

**Examples**:
- Padding inside a card (use `insetMd`)
- Cards within a carousel container (use `stackMd` between carousel items)
- Spacing between form elements (use `stackSm`)
- Buttons within a button group (use `inlineSm`)

---

## Edge Cases and Examples

### Edge Case 1: Carousel Pattern (Grouped Component Collection)

**Scenario**: Multiple cards displayed in a horizontal carousel with navigation controls

**Correct Token Choice**: **Spacing tokens** (NOT grid tokens)

**Rationale**: The carousel creates a component-level context. Even though cards are laid out horizontally, they are grouped within a container (the carousel), making this component-level spacing.

**Implementation**:
```typescript
// ✅ CORRECT - Use spacing tokens for carousel
<Carousel>
  <Card style={{ marginRight: stackMd }} />
  <Card style={{ marginRight: stackMd }} />
  <Card style={{ marginRight: stackMd }} />
</Carousel>

// ❌ WRONG - Don't use grid tokens for carousel
<Carousel>
  <Card style={{ marginRight: gridGutterMd }} />
  <Card style={{ marginRight: gridGutterMd }} />
  <Card style={{ marginRight: gridGutterMd }} />
</Carousel>
```

### Edge Case 2: Tabs Pattern (Grouped Component Collection)

**Scenario**: Multiple content panels within a tabbed interface

**Correct Token Choice**: **Spacing tokens** (NOT grid tokens)

**Rationale**: Tabs create a component-level container. The spacing between tab panels is component-level spacing, not page-level layout.

**Implementation**:
```typescript
// ✅ CORRECT - Use spacing tokens for tabs
<Tabs>
  <TabPanel style={{ padding: insetLg }}>
    <Content />
  </TabPanel>
  <TabPanel style={{ padding: insetLg }}>
    <Content />
  </TabPanel>
</Tabs>

// ❌ WRONG - Don't use grid tokens for tabs
<Tabs>
  <TabPanel style={{ padding: gridMarginLg }}>
    <Content />
  </TabPanel>
</Tabs>
```

### Edge Case 3: Accordion Pattern (Grouped Component Collection)

**Scenario**: Multiple expandable sections within an accordion container

**Correct Token Choice**: **Spacing tokens** (NOT grid tokens)

**Rationale**: The accordion creates a component-level context. Spacing between accordion items is component-level, not page-level.

**Implementation**:
```typescript
// ✅ CORRECT - Use spacing tokens for accordion
<Accordion>
  <AccordionItem style={{ marginBottom: stackMd }}>
    <AccordionHeader />
    <AccordionContent style={{ padding: insetMd }} />
  </AccordionItem>
  <AccordionItem style={{ marginBottom: stackMd }}>
    <AccordionHeader />
    <AccordionContent style={{ padding: insetMd }} />
  </AccordionItem>
</Accordion>

// ❌ WRONG - Don't use grid tokens for accordion
<Accordion>
  <AccordionItem style={{ marginBottom: gridGutterMd }}>
    <AccordionContent style={{ padding: gridMarginMd }} />
  </AccordionItem>
</Accordion>
```

### Edge Case 4: Cards on Page Grid (Page-Level Layout)

**Scenario**: Multiple cards laid out openly on a page using a grid system

**Correct Token Choice**: **Grid tokens** (NOT spacing tokens)

**Rationale**: Cards are positioned independently at the page level, not grouped within a container. This is page-level layout spacing.

**Implementation**:
```css
/* ✅ CORRECT - Use grid tokens for page-level card layout */
.page-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--grid-gutter-md);
  margin-inline: var(--grid-margin-md);
}

/* ❌ WRONG - Don't use spacing tokens for page-level layout */
.page-grid {
  display: grid;
  gap: var(--stack-md); /* Wrong - this is page-level, not component-level */
  margin-inline: var(--inset-md); /* Wrong - this is page margin, not component padding */
}
```

### Edge Case 5: Form Elements (Component-Level Spacing)

**Scenario**: Multiple form inputs stacked vertically within a form container

**Correct Token Choice**: **Spacing tokens** (NOT grid tokens)

**Rationale**: Form elements are grouped within a form container, making this component-level spacing.

**Implementation**:
```typescript
// ✅ CORRECT - Use spacing tokens for form elements
<Form style={{ padding: insetLg }}>
  <Input style={{ marginBottom: stackSm }} />
  <Input style={{ marginBottom: stackSm }} />
  <Input style={{ marginBottom: stackSm }} />
  <ButtonGroup style={{ marginTop: stackMd }}>
    <Button style={{ marginRight: inlineSm }} />
    <Button />
  </ButtonGroup>
</Form>

// ❌ WRONG - Don't use grid tokens for form elements
<Form style={{ padding: gridMarginLg }}>
  <Input style={{ marginBottom: gridGutterSm }} />
</Form>
```

---

## Validation Rules

These rules can be enforced by AI agents and linters to ensure correct token usage:

### Rule 1: Grid Tokens for Page-Level Contexts Only

```typescript
// Validation Rule
if (tokenName.startsWith('grid') && context !== 'page-layout') {
  warning(
    'Grid tokens are intended for page-level layout. ' +
    'Consider using spacing tokens for component-level spacing.'
  );
}
```

**Examples**:
- ✅ **Valid**: Using `gridGutterMd` for spacing between cards on a page grid
- ❌ **Invalid**: Using `gridGutterMd` for spacing between cards in a carousel
- ❌ **Invalid**: Using `gridMarginMd` for padding inside a card component

### Rule 2: Spacing Tokens for Component-Level Contexts Only

```typescript
// Validation Rule
if (tokenName.match(/^(stack|inset|inline)/) && context === 'page-grid-layout') {
  warning(
    'Spacing tokens are intended for component-level spacing. ' +
    'Consider using grid tokens for page-level layouts.'
  );
}
```

**Examples**:
- ✅ **Valid**: Using `stackMd` for spacing between form elements
- ✅ **Valid**: Using `insetMd` for padding inside a card
- ❌ **Invalid**: Using `stackMd` for spacing between cards on a page grid
- ❌ **Invalid**: Using `insetMd` for page container margins

### Rule 3: Grouped Collections Use Spacing Tokens

```typescript
// Validation Rule
if (isGroupedCollection(element) && tokenName.startsWith('grid')) {
  warning(
    'Grouped component collections (carousel, tabs, accordion) should use ' +
    'spacing tokens, not grid tokens. The container creates a component-level context.'
  );
}
```

**Examples**:
- ✅ **Valid**: Using `stackMd` for spacing between carousel items
- ✅ **Valid**: Using `insetLg` for padding in tab panels
- ❌ **Invalid**: Using `gridGutterMd` for spacing between carousel items
- ❌ **Invalid**: Using `gridMarginLg` for padding in accordion items

### Rule 4: Native Platform Grid Spacing

```typescript
// Validation Rule (Native Platforms Only)
if (platform === 'ios' || platform === 'android') {
  if (tokenName.match(/^grid(Gutter|Margin)(Xs|Sm|Md|Lg)$/)) {
    warning(
      'Native platforms should use gridGutterNative and gridMarginNative ' +
      'instead of breakpoint-specific grid tokens.'
    );
  }
}
```

**Examples**:
- ✅ **Valid**: Using `gridGutterNative` for iOS LazyVGrid spacing
- ✅ **Valid**: Using `gridMarginNative` for Android Compose padding
- ❌ **Invalid**: Using `gridGutterMd` on iOS (use `gridGutterNative` instead)
- ❌ **Invalid**: Using `gridMarginLg` on Android (use `gridMarginNative` instead)

---

## Cross-Reference to Existing Semantic Spacing Tokens

The responsive layout system's semantic grid tokens complement the existing semantic spacing tokens. Here's how they relate:

### Existing Semantic Spacing Tokens

**Stack Tokens** (Vertical spacing between stacked elements):
- `stackXs`, `stackSm`, `stackMd`, `stackLg`
- Use for: Vertical spacing within components, form elements, list items

**Inset Tokens** (Internal padding within components):
- `insetXs`, `insetSm`, `insetMd`, `insetLg`
- Use for: Component padding, card padding, container padding

**Inline Tokens** (Horizontal spacing between inline elements):
- `inlineXs`, `inlineSm`, `inlineMd`, `inlineLg`
- Use for: Button groups, tag lists, inline navigation items

### New Semantic Grid Tokens

**Grid Gutter Tokens** (Spacing between grid columns):
- `gridGutterXs`, `gridGutterSm`, `gridGutterMd`, `gridGutterLg` (Web)
- `gridGutterNative` (iOS, Android)
- Use for: Spacing between cards on page grid, column gaps in multi-column layouts

**Grid Margin Tokens** (Page container margins):
- `gridMarginXs`, `gridMarginSm`, `gridMarginMd`, `gridMarginLg` (Web)
- `gridMarginNative` (iOS, Android)
- Use for: Page edge margins, container margins at page level

### Token Selection Matrix

| Context | Vertical Spacing | Horizontal Spacing | Internal Padding | Page Margins |
|---------|------------------|-------------------|------------------|--------------|
| **Component-Level** | `stackXs/Sm/Md/Lg` | `inlineXs/Sm/Md/Lg` | `insetXs/Sm/Md/Lg` | N/A |
| **Page-Level (Web)** | N/A | `gridGutterXs/Sm/Md/Lg` | N/A | `gridMarginXs/Sm/Md/Lg` |
| **Page-Level (Native)** | N/A | `gridGutterNative` | N/A | `gridMarginNative` |

---

## Platform-Specific Considerations

### Web Platforms

Web platforms have access to all breakpoint-specific grid tokens:

```css
/* Responsive grid spacing scales with layout complexity */
@media (min-width: 320px) {
  .grid-container {
    gap: var(--grid-gutter-xs); /* 16px */
    margin-inline: var(--grid-margin-xs); /* 24px */
  }
}

@media (min-width: 375px) {
  .grid-container {
    gap: var(--grid-gutter-sm); /* 20px */
    margin-inline: var(--grid-margin-sm); /* 28px */
  }
}

@media (min-width: 1024px) {
  .grid-container {
    gap: var(--grid-gutter-md); /* 24px */
    margin-inline: var(--grid-margin-md); /* 32px */
  }
}

@media (min-width: 1440px) {
  .grid-container {
    gap: var(--grid-gutter-lg); /* 32px */
    margin-inline: var(--grid-margin-lg); /* 40px */
  }
}
```

### Native Platforms (iOS, Android)

Native platforms use dedicated native grid spacing tokens:

**iOS (SwiftUI)**:
```swift
// ✅ CORRECT - Use native grid spacing tokens
LazyVGrid(columns: [
    GridItem(.adaptive(minimum: 160), spacing: gridGutterNative) // 20px
]) {
    // Content-driven adaptive behavior
}
.padding(.horizontal, gridMarginNative) // 28px

// ❌ WRONG - Don't use breakpoint-specific tokens on native
LazyVGrid(columns: [
    GridItem(.adaptive(minimum: 160), spacing: gridGutterMd) // Wrong
]) {
    // Content
}
```

**Android (Compose)**:
```kotlin
// ✅ CORRECT - Use native grid spacing tokens
LazyVerticalGrid(
    columns = GridCells.Adaptive(minSize = 160.dp),
    verticalArrangement = Arrangement.spacedBy(gridGutterNative.dp),
    horizontalArrangement = Arrangement.spacedBy(gridGutterNative.dp),
    contentPadding = PaddingValues(gridMarginNative.dp)
) {
    // Content-driven adaptive behavior
}

// ❌ WRONG - Don't use breakpoint-specific tokens on native
LazyVerticalGrid(
    columns = GridCells.Adaptive(minSize = 160.dp),
    verticalArrangement = Arrangement.spacedBy(gridGutterMd.dp), // Wrong
    contentPadding = PaddingValues(gridMarginMd.dp) // Wrong
) {
    // Content
}
```

---

## Summary

### Key Takeaways

1. **Grid tokens** are for **page-level layout** spacing (horizontal positioning, page margins)
2. **Spacing tokens** are for **component-level** spacing (internal padding, grouped collections)
3. **Grouped collections** (carousel, tabs, accordion) always use **spacing tokens**, not grid tokens
4. **Native platforms** use `gridGutterNative` and `gridMarginNative`, not breakpoint-specific tokens
5. Use the **decision framework** to systematically determine which token type to use

### Quick Reference

**Use Grid Tokens When**:
- Spacing between cards on a page grid
- Page container margins
- Multi-column layouts at page level
- Dashboard widgets positioned independently

**Use Spacing Tokens When**:
- Padding inside components
- Spacing between form elements
- Cards within a carousel
- Items within tabs or accordion
- Button groups or inline elements

---

*This guide provides systematic token selection criteria for developers and AI agents to maintain consistent, well-structured layouts across all platforms.*
