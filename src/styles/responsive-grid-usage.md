# Responsive Grid CSS Usage Guide

**Date**: January 10, 2025  
**Purpose**: Documentation for responsive grid CSS classes and usage patterns  
**Organization**: spec-guide  
**Scope**: responsive-layout-system

---

## Overview

The DesignerPunk responsive grid system provides CSS classes for creating flexible, responsive layouts that adapt to different screen sizes. The system uses a progressive column count approach (4→8→12→16) with breakpoint-specific grid spacing.

## Grid Container

### Basic Usage

```html
<div class="grid-container">
  <!-- Grid items go here -->
</div>
```

### Container Behavior

The `.grid-container` class creates a CSS Grid layout with:

- **Progressive column counts**: Automatically adjusts based on viewport width
  - xs (320px+): 4 columns
  - sm (375px+): 8 columns
  - md (1024px+): 12 columns
  - lg (1440px+): 16 columns

- **Responsive spacing**: Grid gutters and margins scale with layout complexity
  - xs: 16px gutter, 24px margin
  - sm: 20px gutter, 28px margin
  - md: 24px gutter, 32px margin
  - lg: 32px gutter, 40px margin

- **Full-width layout**: Container spans 100% of parent width
- **Box-sizing**: Border-box for predictable sizing

## Grid Items

### Basic Grid Item

```html
<div class="grid-container">
  <div class="grid-item">Content</div>
  <div class="grid-item">Content</div>
  <div class="grid-item">Content</div>
</div>
```

The `.grid-item` class provides:
- `min-width: 0` to prevent overflow issues
- `box-sizing: border-box` for consistent sizing

### Column Span Utilities

Control how many columns an item spans using responsive column span classes:

```html
<div class="grid-container">
  <!-- Spans 4 columns on xs, 8 on sm, 12 on md, 16 on lg -->
  <div class="grid-item col-xs-4 col-sm-8 col-md-12 col-lg-16">
    Full width at all breakpoints
  </div>
  
  <!-- Spans 2 columns on xs, 4 on sm, 6 on md, 8 on lg -->
  <div class="grid-item col-xs-2 col-sm-4 col-md-6 col-lg-8">
    Half width at all breakpoints
  </div>
</div>
```

### Available Column Span Classes

**XS Breakpoint (4 columns)**:
- `.col-xs-1` through `.col-xs-4`

**SM Breakpoint (8 columns)**:
- `.col-sm-1` through `.col-sm-8`

**MD Breakpoint (12 columns)**:
- `.col-md-1` through `.col-md-12`

**LG Breakpoint (16 columns)**:
- `.col-lg-1` through `.col-lg-16`

## Common Layout Patterns

### Two-Column Layout

```html
<div class="grid-container">
  <!-- Left column: 1 col on xs, 3 cols on sm, 4 cols on md, 5 cols on lg -->
  <aside class="grid-item col-xs-1 col-sm-3 col-md-4 col-lg-5">
    Sidebar
  </aside>
  
  <!-- Right column: 3 cols on xs, 5 cols on sm, 8 cols on md, 11 cols on lg -->
  <main class="grid-item col-xs-3 col-sm-5 col-md-8 col-lg-11">
    Main content
  </main>
</div>
```

### Three-Column Layout

```html
<div class="grid-container">
  <!-- Each column spans: 4 cols on xs (stacked), 2-3 cols on sm, 4 cols on md/lg -->
  <div class="grid-item col-xs-4 col-sm-2 col-md-4 col-lg-5">Column 1</div>
  <div class="grid-item col-xs-4 col-sm-3 col-md-4 col-lg-6">Column 2</div>
  <div class="grid-item col-xs-4 col-sm-3 col-md-4 col-lg-5">Column 3</div>
</div>
```

### Card Grid

```html
<div class="grid-container">
  <!-- Cards: 2 cols on xs, 4 cols on sm, 3 cols on md, 4 cols on lg -->
  <article class="grid-item col-xs-2 col-sm-4 col-md-3 col-lg-4">Card 1</article>
  <article class="grid-item col-xs-2 col-sm-4 col-md-3 col-lg-4">Card 2</article>
  <article class="grid-item col-xs-2 col-sm-4 col-md-3 col-lg-4">Card 3</article>
  <article class="grid-item col-xs-2 col-sm-4 col-md-3 col-lg-4">Card 4</article>
</div>
```

### Hero Section

```html
<div class="grid-container">
  <!-- Full width at all breakpoints -->
  <header class="grid-item col-xs-4 col-sm-8 col-md-12 col-lg-16">
    <h1>Hero Title</h1>
    <p>Hero description</p>
  </header>
</div>
```

## Complete Grid Layout Examples

### Example 1: Blog Post Layout

A complete blog post layout with header, sidebar, main content, and footer:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Blog Post</title>
  <link rel="stylesheet" href="tokens.css">
  <link rel="stylesheet" href="responsive-grid.css">
</head>
<body>
  <!-- Header: Full width at all breakpoints -->
  <div class="grid-container">
    <header class="grid-item col-xs-4 col-sm-8 col-md-12 col-lg-16">
      <h1>Blog Title</h1>
      <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </nav>
    </header>
  </div>

  <!-- Main content area: Sidebar + Article -->
  <div class="grid-container">
    <!-- Sidebar: Stacked on xs, 3 cols on sm, 4 cols on md, 4 cols on lg -->
    <aside class="grid-item col-xs-4 col-sm-3 col-md-4 col-lg-4">
      <h2>Recent Posts</h2>
      <ul>
        <li><a href="/post-1">Post 1</a></li>
        <li><a href="/post-2">Post 2</a></li>
        <li><a href="/post-3">Post 3</a></li>
      </ul>
    </aside>

    <!-- Article: Full width on xs, 5 cols on sm, 8 cols on md, 12 cols on lg -->
    <article class="grid-item col-xs-4 col-sm-5 col-md-8 col-lg-12">
      <h1>Article Title</h1>
      <p>Article content goes here...</p>
      <p>More content...</p>
    </article>
  </div>

  <!-- Footer: Full width at all breakpoints -->
  <div class="grid-container">
    <footer class="grid-item col-xs-4 col-sm-8 col-md-12 col-lg-16">
      <p>&copy; 2025 Blog Name. All rights reserved.</p>
    </footer>
  </div>
</body>
</html>
```

**Responsive Behavior**:
- **XS (320px)**: Stacked layout, sidebar above article
- **SM (375px)**: Sidebar (3 cols) + Article (5 cols) side-by-side
- **MD (1024px)**: Sidebar (4 cols) + Article (8 cols) with more spacing
- **LG (1440px)**: Sidebar (4 cols) + Article (12 cols) with generous spacing

### Example 2: Dashboard Layout

A dashboard with header, navigation, main content, and widgets:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Dashboard</title>
  <link rel="stylesheet" href="tokens.css">
  <link rel="stylesheet" href="responsive-grid.css">
</head>
<body>
  <!-- Header: Full width -->
  <div class="grid-container">
    <header class="grid-item col-xs-4 col-sm-8 col-md-12 col-lg-16">
      <h1>Dashboard</h1>
    </header>
  </div>

  <!-- Navigation: Full width on xs, 2 cols on sm+, 3 cols on md+, 3 cols on lg -->
  <div class="grid-container">
    <nav class="grid-item col-xs-4 col-sm-2 col-md-3 col-lg-3">
      <ul>
        <li><a href="/dashboard">Overview</a></li>
        <li><a href="/analytics">Analytics</a></li>
        <li><a href="/settings">Settings</a></li>
      </ul>
    </nav>

    <!-- Main content area -->
    <main class="grid-item col-xs-4 col-sm-6 col-md-9 col-lg-13">
      <!-- Widget grid within main content -->
      <div class="grid-container">
        <!-- Widgets: 4 cols on xs (stacked), 3 cols on sm, 3 cols on md, 4 cols on lg -->
        <div class="grid-item col-xs-4 col-sm-3 col-md-3 col-lg-4">
          <div class="widget">
            <h3>Total Users</h3>
            <p>1,234</p>
          </div>
        </div>

        <div class="grid-item col-xs-4 col-sm-3 col-md-3 col-lg-4">
          <div class="widget">
            <h3>Revenue</h3>
            <p>$12,345</p>
          </div>
        </div>

        <div class="grid-item col-xs-4 col-sm-3 col-md-3 col-lg-5">
          <div class="widget">
            <h3>Active Sessions</h3>
            <p>567</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</body>
</html>
```

**Responsive Behavior**:
- **XS (320px)**: Fully stacked layout
- **SM (375px)**: Nav (2 cols) + Main (6 cols), widgets in row
- **MD (1024px)**: Nav (3 cols) + Main (9 cols), widgets side-by-side
- **LG (1440px)**: Nav (3 cols) + Main (13 cols), spacious widget layout

### Example 3: E-commerce Product Grid

A product listing page with filters and product cards:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Products</title>
  <link rel="stylesheet" href="tokens.css">
  <link rel="stylesheet" href="responsive-grid.css">
</head>
<body>
  <!-- Header -->
  <div class="grid-container">
    <header class="grid-item col-xs-4 col-sm-8 col-md-12 col-lg-16">
      <h1>Shop</h1>
    </header>
  </div>

  <!-- Filters + Products -->
  <div class="grid-container">
    <!-- Filters: Full width on xs, 2 cols on sm+, 3 cols on md+, 4 cols on lg -->
    <aside class="grid-item col-xs-4 col-sm-2 col-md-3 col-lg-4">
      <h2>Filters</h2>
      <form>
        <label>
          <input type="checkbox" name="category" value="electronics">
          Electronics
        </label>
        <label>
          <input type="checkbox" name="category" value="clothing">
          Clothing
        </label>
      </form>
    </aside>

    <!-- Product grid -->
    <main class="grid-item col-xs-4 col-sm-6 col-md-9 col-lg-12">
      <div class="grid-container">
        <!-- Products: 2 cols on xs, 3 cols on sm, 3 cols on md, 4 cols on lg -->
        <article class="grid-item col-xs-2 col-sm-3 col-md-3 col-lg-4">
          <img src="product1.jpg" alt="Product 1">
          <h3>Product 1</h3>
          <p>$29.99</p>
        </article>

        <article class="grid-item col-xs-2 col-sm-3 col-md-3 col-lg-4">
          <img src="product2.jpg" alt="Product 2">
          <h3>Product 2</h3>
          <p>$39.99</p>
        </article>

        <article class="grid-item col-xs-2 col-sm-3 col-md-3 col-lg-4">
          <img src="product3.jpg" alt="Product 3">
          <h3>Product 3</h3>
          <p>$49.99</p>
        </article>

        <article class="grid-item col-xs-2 col-sm-3 col-md-3 col-lg-4">
          <img src="product4.jpg" alt="Product 4">
          <h3>Product 4</h3>
          <p>$59.99</p>
        </article>
      </div>
    </main>
  </div>
</body>
</html>
```

**Responsive Behavior**:
- **XS (320px)**: Filters stacked, 2 products per row
- **SM (375px)**: Filters (2 cols) + Products (6 cols), 3 products per row
- **MD (1024px)**: Filters (3 cols) + Products (9 cols), 3 products per row
- **LG (1440px)**: Filters (4 cols) + Products (12 cols), 4 products per row

### Example 4: Landing Page with Hero and Features

A marketing landing page with hero section and feature cards:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Landing Page</title>
  <link rel="stylesheet" href="tokens.css">
  <link rel="stylesheet" href="responsive-grid.css">
</head>
<body>
  <!-- Hero: Full width -->
  <div class="grid-container">
    <section class="grid-item col-xs-4 col-sm-8 col-md-12 col-lg-16">
      <h1>Welcome to Our Product</h1>
      <p>The best solution for your needs</p>
      <button>Get Started</button>
    </section>
  </div>

  <!-- Features: 3 feature cards -->
  <div class="grid-container">
    <!-- Feature 1: Full width on xs, 2-3 cols on sm, 4 cols on md/lg -->
    <article class="grid-item col-xs-4 col-sm-2 col-md-4 col-lg-5">
      <h2>Feature 1</h2>
      <p>Description of feature 1</p>
    </article>

    <!-- Feature 2: Full width on xs, 3 cols on sm, 4 cols on md, 6 cols on lg -->
    <article class="grid-item col-xs-4 col-sm-3 col-md-4 col-lg-6">
      <h2>Feature 2</h2>
      <p>Description of feature 2</p>
    </article>

    <!-- Feature 3: Full width on xs, 3 cols on sm, 4 cols on md, 5 cols on lg -->
    <article class="grid-item col-xs-4 col-sm-3 col-md-4 col-lg-5">
      <h2>Feature 3</h2>
      <p>Description of feature 3</p>
    </article>
  </div>

  <!-- Call to action: Centered, partial width -->
  <div class="grid-container">
    <section class="grid-item col-xs-4 col-sm-6 col-md-8 col-lg-10">
      <h2>Ready to get started?</h2>
      <button>Sign Up Now</button>
    </section>
  </div>
</body>
</html>
```

**Responsive Behavior**:
- **XS (320px)**: Fully stacked, single column layout
- **SM (375px)**: Features side-by-side in row
- **MD (1024px)**: Features evenly distributed across 12 columns
- **LG (1440px)**: Features with generous spacing across 16 columns

### Key Patterns in Complete Examples

1. **Nested Grids**: Grid containers can be nested within grid items for complex layouts
2. **Semantic HTML**: Use appropriate HTML elements (header, nav, main, aside, article, footer)
3. **Progressive Enhancement**: Start with mobile layout, enhance for larger screens
4. **Consistent Breakpoints**: All examples use the same breakpoint values (375px, 1024px, 1440px)
5. **Content-Driven Components**: Components within grid items use their own spacing tokens

## Grid Spacing Scaling with Layout Complexity

One of the key design principles of the responsive grid system is that spacing scales proportionally with layout complexity. As the number of columns increases, the grid spacing (gutters and margins) also increases to maintain visual hierarchy and readability.

### Why Spacing Scales

**Visual Hierarchy**: More columns create more visual complexity. Larger spacing helps maintain clear visual separation between elements.

**Readability**: Dense layouts with many columns need more breathing room to prevent visual crowding and improve scannability.

**Proportional Relationships**: The spacing-to-column ratio remains balanced across all breakpoints, ensuring consistent visual rhythm.

### Scaling Pattern

The grid spacing follows a systematic scaling pattern:

```
XS (4 columns):
  Gutter: 16px (space200)
  Margin: 24px (space300)
  Ratio: 4px per column

SM (8 columns):
  Gutter: 20px (space250)
  Margin: 28px (space350)
  Ratio: 2.5px per column

MD (12 columns):
  Gutter: 24px (space300)
  Margin: 32px (space400)
  Ratio: 2px per column

LG (16 columns):
  Gutter: 32px (space400)
  Margin: 40px (space500)
  Ratio: 2px per column
```

### Visual Comparison

**XS Breakpoint (4 columns, 16px gutter)**:
```
[M][Col][G][Col][G][Col][G][Col][M]
 24  1  16  2  16  3  16  4  24
```
- Compact spacing for limited screen space
- Larger margins (24px) provide page-level breathing room
- Smaller gutters (16px) maximize content area

**LG Breakpoint (16 columns, 32px gutter)**:
```
[M][Col][G][Col][G]...[Col][G][Col][M]
 40  1  32  2  32 ... 15  32  16  40
```
- Generous spacing for complex layouts
- Larger margins (40px) frame the content area
- Larger gutters (32px) prevent visual crowding

### Mathematical Relationships

All grid spacing values reference existing mathematical spacing tokens:

```typescript
// Grid spacing tokens reference primitive spacing tokens
gridGutterXs: space200  // 16px = 8 × 2
gridGutterSm: space250  // 20px = 8 × 2.5
gridGutterMd: space300  // 24px = 8 × 3
gridGutterLg: space400  // 32px = 8 × 4

gridMarginXs: space300  // 24px = 8 × 3
gridMarginSm: space350  // 28px = 8 × 3.5
gridMarginMd: space400  // 32px = 8 × 4
gridMarginLg: space500  // 40px = 8 × 5
```

This ensures grid spacing maintains the same 8px baseline grid alignment as all other spacing in the system.

### Practical Impact

**Example: Card Grid Layout**

At XS (4 columns, 16px gutter):
- 2 cards per row
- 16px between cards
- Compact but readable

At LG (16 columns, 32px gutter):
- 4 cards per row
- 32px between cards
- Spacious and scannable

The increased spacing at larger breakpoints prevents the 4-card layout from feeling cramped, maintaining visual comfort as layout complexity increases.

### Design Principle

**"Spacing scales with complexity"** means:
- Simple layouts (fewer columns) use compact spacing
- Complex layouts (more columns) use generous spacing
- Visual hierarchy is maintained across all breakpoints
- Cognitive load is balanced with appropriate spacing

This principle ensures that users can easily scan and understand layouts regardless of screen size or layout complexity.

## Content-Driven Component Constraints

The grid system works seamlessly with content-driven component sizing:

```html
<div class="grid-container">
  <!-- Component defines its own width, grid provides positioning -->
  <button class="grid-item col-xs-2 col-sm-3 col-md-4 col-lg-5">
    <!-- Button uses component-level spacing tokens internally -->
    Click Me
  </button>
</div>
```

**Key Principle**: The grid controls layout positioning and spacing between components, while components control their own internal sizing using component-level spacing tokens.

## CSS Custom Properties

The grid system uses CSS custom properties for optimal performance and flexibility. These properties are automatically generated from the grid spacing semantic tokens.

### Token Definitions

```css
:root {
  /* Grid gutters (gap between columns) */
  --grid-gutter-xs: 16px;  /* References space200 */
  --grid-gutter-sm: 20px;  /* References space250 */
  --grid-gutter-md: 24px;  /* References space300 */
  --grid-gutter-lg: 32px;  /* References space400 */
  
  /* Grid margins (space on sides) */
  --grid-margin-xs: 24px;  /* References space300 */
  --grid-margin-sm: 28px;  /* References space350 */
  --grid-margin-md: 32px;  /* References space400 */
  --grid-margin-lg: 40px;  /* References space500 */
}
```

### How Custom Properties Work

CSS custom properties enable the grid system to:

1. **Update dynamically**: Values change at media query breakpoints
2. **Cascade efficiently**: Child elements inherit values automatically
3. **Optimize performance**: Browser can optimize custom property updates
4. **Maintain consistency**: Single source of truth for spacing values

### Custom Property Usage in Grid System

The grid container uses these custom properties internally:

```css
.grid-container {
  /* Base styles (xs breakpoint) */
  --grid-columns: 4;
  --grid-gutter: var(--grid-gutter-xs);
  --grid-margin: var(--grid-margin-xs);
  
  display: grid;
  grid-template-columns: repeat(var(--grid-columns), 1fr);
  gap: var(--grid-gutter);
  margin-inline: var(--grid-margin);
}

/* Media queries update custom properties */
@media (min-width: 375px) {
  .grid-container {
    --grid-columns: 8;
    --grid-gutter: var(--grid-gutter-sm);
    --grid-margin: var(--grid-margin-sm);
  }
}

@media (min-width: 1024px) {
  .grid-container {
    --grid-columns: 12;
    --grid-gutter: var(--grid-gutter-md);
    --grid-margin: var(--grid-margin-md);
  }
}

@media (min-width: 1440px) {
  .grid-container {
    --grid-columns: 16;
    --grid-gutter: var(--grid-gutter-lg);
    --grid-margin: var(--grid-margin-lg);
  }
}
```

### Using Custom Properties in Your Code

You can reference grid spacing custom properties in your own CSS:

```css
/* Use grid gutter for consistent spacing */
.custom-component {
  padding: var(--grid-gutter);
}

/* Use grid margin for page-level spacing */
.page-section {
  margin-inline: var(--grid-margin);
}

/* Combine with calc() for custom spacing */
.custom-spacing {
  margin-bottom: calc(var(--grid-gutter) * 2);
}
```

**Note**: For component-level spacing, prefer semantic spacing tokens (space100, space200, etc.) over grid spacing tokens. Grid spacing tokens are intended for page-level layout.

## Media Query Integration Patterns

The grid system uses media queries to adapt layout and spacing at different viewport widths. Understanding these patterns helps you create responsive layouts effectively.

### Breakpoint-Based Media Queries

The system uses four breakpoints aligned with the breakpoint tokens:

```css
/* XS: Base styles (no media query) - 320px and up */
.grid-container {
  --grid-columns: 4;
  --grid-gutter: var(--grid-gutter-xs);  /* 16px */
  --grid-margin: var(--grid-margin-xs);  /* 24px */
}

/* SM: Large mobile - 375px and up */
@media (min-width: 375px) {
  .grid-container {
    --grid-columns: 8;
    --grid-gutter: var(--grid-gutter-sm);  /* 20px */
    --grid-margin: var(--grid-margin-sm);  /* 28px */
  }
}

/* MD: Tablet and desktop - 1024px and up */
@media (min-width: 1024px) {
  .grid-container {
    --grid-columns: 12;
    --grid-gutter: var(--grid-gutter-md);  /* 24px */
    --grid-margin: var(--grid-margin-md);  /* 32px */
  }
}

/* LG: Large desktop - 1440px and up */
@media (min-width: 1440px) {
  .grid-container {
    --grid-columns: 16;
    --grid-gutter: var(--grid-gutter-lg);  /* 32px */
    --grid-margin: var(--grid-margin-lg);  /* 40px */
  }
}
```

### Progressive Column Count Pattern

The grid system uses a progressive column count approach where the number of columns increases with viewport width:

**Why Progressive Column Counts?**

- **XS (4 columns)**: Limited screen space requires fewer columns for readability
- **SM (8 columns)**: More space allows for more layout flexibility
- **MD (12 columns)**: Desktop space enables complex multi-column layouts
- **LG (16 columns)**: Wide screens support highly detailed grid layouts

**Layout Complexity Scaling**:

As the number of columns increases, the grid spacing also increases proportionally:

| Breakpoint | Columns | Gutter | Margin | Layout Complexity |
|------------|---------|--------|--------|-------------------|
| XS (320px) | 4       | 16px   | 24px   | Simple, stacked   |
| SM (375px) | 8       | 20px   | 28px   | Moderate          |
| MD (1024px)| 12      | 24px   | 32px   | Complex           |
| LG (1440px)| 16      | 32px   | 40px   | Highly complex    |

This scaling ensures that as layouts become more complex (more columns), the spacing increases to maintain visual hierarchy and readability.

### Column Span Media Query Pattern

Column span classes use the same media queries to adapt item widths:

```css
/* XS: 2 columns (50% width) */
.col-xs-2 {
  grid-column: span 2;
}

/* SM: 4 columns (50% width) */
@media (min-width: 375px) {
  .col-sm-4 {
    grid-column: span 4;
  }
}

/* MD: 6 columns (50% width) */
@media (min-width: 1024px) {
  .col-md-6 {
    grid-column: span 6;
  }
}

/* LG: 8 columns (50% width) */
@media (min-width: 1440px) {
  .col-lg-8 {
    grid-column: span 8;
  }
}
```

### Mobile-First Approach

The grid system uses a mobile-first approach:

1. **Base styles** (no media query) apply to xs breakpoint (320px+)
2. **Media queries** use `min-width` to progressively enhance for larger screens
3. **Column span classes** cascade - specify only what changes at each breakpoint

Example:
```html
<!-- This item is 4 cols on xs, then 8 cols on sm and above -->
<div class="grid-item col-xs-4 col-sm-8">
  Content
</div>
```

### Custom Media Query Integration

You can integrate your own media queries with the grid system:

```css
/* Use the same breakpoints for consistency */
@media (min-width: 375px) {
  .custom-component {
    /* Your responsive styles */
    font-size: 18px;
    padding: var(--grid-gutter-sm);
  }
}

@media (min-width: 1024px) {
  .custom-component {
    font-size: 20px;
    padding: var(--grid-gutter-md);
  }
}
```

**Best Practice**: Always use the same breakpoint values (375px, 1024px, 1440px) to maintain consistency with the grid system.

## Best Practices

### 1. Always Use Grid Container

```html
<!-- ✅ Correct -->
<div class="grid-container">
  <div class="grid-item col-xs-2">Content</div>
</div>

<!-- ❌ Wrong - grid-item without grid-container -->
<div class="grid-item col-xs-2">Content</div>
```

### 2. Specify Column Spans for All Breakpoints

```html
<!-- ✅ Correct - explicit at all breakpoints -->
<div class="grid-item col-xs-2 col-sm-4 col-md-6 col-lg-8">
  Content
</div>

<!-- ⚠️ Acceptable but less predictable - relies on cascade -->
<div class="grid-item col-xs-2">
  Content
</div>
```

### 3. Ensure Column Spans Don't Exceed Available Columns

```html
<!-- ✅ Correct - respects column limits -->
<div class="grid-item col-xs-4 col-sm-8 col-md-12 col-lg-16">
  Full width
</div>

<!-- ❌ Wrong - col-xs-5 exceeds 4 available columns -->
<div class="grid-item col-xs-5">
  Content
</div>
```

### 4. Use Grid for Page-Level Layout Only

```html
<!-- ✅ Correct - grid for page layout -->
<div class="grid-container">
  <main class="grid-item col-xs-4 col-sm-8 col-md-12 col-lg-16">
    <!-- Components use their own spacing tokens -->
    <button>Click Me</button>
  </main>
</div>

<!-- ❌ Wrong - don't use grid for component-level spacing -->
<div class="grid-container">
  <button class="grid-item col-xs-1">
    <!-- Button should define its own size -->
    Click Me
  </button>
</div>
```

### 5. Combine with Semantic Spacing Tokens

```html
<div class="grid-container">
  <article class="grid-item col-xs-4 col-sm-8 col-md-6 col-lg-8">
    <!-- Use semantic spacing tokens for internal spacing -->
    <div style="padding: var(--space-300)">
      <h2 style="margin-bottom: var(--space-200)">Title</h2>
      <p>Content</p>
    </div>
  </article>
</div>
```

## Integration with Design Tokens

The responsive grid system integrates with the DesignerPunk token system:

- **Breakpoint tokens**: Define viewport widths (breakpointXs, breakpointSm, etc.)
- **Grid spacing tokens**: Define gutters and margins (gridGutterXs, gridMarginXs, etc.)
- **Spacing tokens**: Used for component-level spacing (space100, space200, etc.)

See the [Grid Spacing Tokens documentation](../../tokens/semantic/GridSpacingTokens.ts) for token definitions.

## Browser Support

The responsive grid system uses modern CSS features:

- **CSS Grid**: Supported in all modern browsers (Chrome 57+, Firefox 52+, Safari 10.1+, Edge 16+)
- **CSS Custom Properties**: Supported in all modern browsers (Chrome 49+, Firefox 31+, Safari 9.1+, Edge 15+)
- **Media Queries**: Universal support

For older browsers, consider using a CSS Grid polyfill or fallback layout system.

## Accessibility Considerations

### Semantic HTML

Use appropriate semantic HTML elements within the grid:

```html
<div class="grid-container">
  <header class="grid-item col-xs-4 col-sm-8 col-md-12 col-lg-16">
    <!-- Header content -->
  </header>
  
  <nav class="grid-item col-xs-4 col-sm-2 col-md-3 col-lg-4">
    <!-- Navigation -->
  </nav>
  
  <main class="grid-item col-xs-4 col-sm-6 col-md-9 col-lg-12">
    <!-- Main content -->
  </main>
</div>
```

### Reading Order

Ensure the DOM order matches the visual reading order at all breakpoints. Avoid using CSS Grid to reorder content in ways that confuse screen reader users.

### Focus Management

Grid items should maintain logical focus order:

```html
<div class="grid-container">
  <!-- Focus order: 1, 2, 3 -->
  <button class="grid-item col-xs-2 col-sm-4">Button 1</button>
  <button class="grid-item col-xs-2 col-sm-4">Button 2</button>
  <button class="grid-item col-xs-2 col-sm-4">Button 3</button>
</div>
```

## Performance Considerations

### CSS File Size

The responsive grid CSS is approximately 3KB uncompressed. Consider:

- **Minification**: Reduces file size by ~30%
- **Gzip compression**: Reduces file size by ~70%
- **Critical CSS**: Inline base grid styles for faster initial render

### Rendering Performance

CSS Grid is highly performant:

- **Hardware accelerated**: Modern browsers optimize grid layouts
- **No JavaScript required**: Pure CSS solution
- **Efficient reflows**: Grid recalculates efficiently on resize

## Troubleshooting

### Grid Items Overflowing

**Problem**: Grid items overflow their container

**Solution**: Ensure `.grid-item` class is applied and includes `min-width: 0`

```css
.grid-item {
  min-width: 0; /* Prevents overflow */
}
```

### Column Spans Not Working

**Problem**: Column span classes don't apply

**Solution**: Verify the grid container has `.grid-container` class and items have `.grid-item` class

### Spacing Not Scaling

**Problem**: Grid spacing doesn't change at breakpoints

**Solution**: Ensure CSS custom properties are defined for all breakpoints

```css
:root {
  --grid-gutter-xs: 16px;
  --grid-gutter-sm: 20px;
  --grid-gutter-md: 24px;
  --grid-gutter-lg: 32px;
  /* ... */
}
```

### Media Queries Not Triggering

**Problem**: Layout doesn't change at breakpoints

**Solution**: Check viewport meta tag is present in HTML

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

## Related Documentation

- [Breakpoint Tokens](../../tokens/BreakpointTokens.ts) - Viewport width definitions
- [Grid Spacing Tokens](../../tokens/semantic/GridSpacingTokens.ts) - Gutter and margin tokens
- [Responsive Grid Generator](../../generators/ResponsiveGridGenerator.ts) - CSS generation logic
- [Design Document](../../../.kiro/specs/responsive-layout-system/design.md) - System architecture

---

*This usage guide provides comprehensive documentation for implementing responsive layouts using the DesignerPunk grid system.*
