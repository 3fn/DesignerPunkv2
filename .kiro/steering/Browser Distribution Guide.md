---
inclusion: conditional
trigger: browser-distribution, web-component-integration, browser-loading, web-component-usage
---

# Browser Distribution Guide

**Date**: 2025-12-23
**Last Reviewed**: 2025-12-23
**Purpose**: Guide for loading and using DesignerPunk web components directly in browsers
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 3
**Relevant Tasks**: web-component-integration, browser-distribution

## AI Agent Reading Priorities

**Note**: This section intentionally uses the same heading as other steering documents because each document provides reading priorities specific to its content. This structural pattern enables progressive disclosure and helps AI agents navigate to relevant sections efficiently.

**Layer Context**: This is a Layer 3 (Specific Implementations) document that provides guidance for browser-based web component distribution. It's conditionally loaded when working on browser integration, web component usage, or bundle distribution tasks.

**WHEN helping users integrate DesignerPunk in browsers THEN Read:**
- Quick Start section (essential setup)
- ESM Loading Pattern section (modern browsers)
- UMD Loading Pattern section (legacy support)

**WHEN troubleshooting component issues THEN Read:**
- Troubleshooting section (common issues and solutions)
- Token Loading section (styling issues)

**WHEN making architectural decisions about loading strategy THEN Read:**
- All sections to understand trade-offs between ESM and UMD

**SKIP when:**
- Working on Node.js/bundler-based projects
- Not dealing with browser distribution
- Following established integration patterns

---

## Overview

DesignerPunk provides browser-ready web component bundles that work directly in browsers without requiring a bundler. This guide covers:

- Loading components via ES modules (ESM) for modern browsers
- Loading components via UMD for legacy browser support
- Design token integration for proper styling
- Troubleshooting common integration issues

**Available Components:**
- `<button-cta>` - Call-to-action button with variants and icon support
- `<input-text-base>` - Text input with validation states and helper text
- `<icon-base>` - Icon component with size and color variants
- `<container-base>` - Layout container with padding, background, and shadow options

---

## Quick Start

The fastest way to get started with DesignerPunk web components:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DesignerPunk Demo</title>
  
  <!-- Step 1: Load design tokens (required for styling) -->
  <link rel="stylesheet" href="dist/browser/tokens.css">
</head>
<body>
  <!-- Step 2: Use components -->
  <button-cta label="Click Me" variant="primary"></button-cta>
  <input-text-base label="Email" placeholder="you@example.com"></input-text-base>
  
  <!-- Step 3: Load the bundle (ESM recommended) -->
  <script type="module" src="dist/browser/designerpunk.esm.js"></script>
</body>
</html>
```

**Key Points:**
- Always load `tokens.css` before using components
- Components auto-register when the bundle loads
- No manual setup code required

---

## ESM Loading Pattern

**Recommended for modern browsers (ES2020+)**

ES Modules provide the best developer experience with native browser support, tree-shaking potential, and modern JavaScript features.

### Basic ESM Loading

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DesignerPunk ESM Example</title>
  
  <!-- Design tokens must be loaded first -->
  <link rel="stylesheet" href="dist/browser/tokens.css">
</head>
<body>
  <!-- Components can be used immediately in HTML -->
  <container-base padding="200" background="color-surface" border-radius="normal">
    <h1>Welcome</h1>
    <input-text-base 
      label="Username" 
      placeholder="Enter your username"
      helper-text="Choose a unique username"
    ></input-text-base>
    <button-cta 
      label="Sign Up" 
      variant="primary" 
      icon="arrow-right"
    ></button-cta>
  </container-base>

  <!-- ESM bundle - components auto-register -->
  <script type="module" src="dist/browser/designerpunk.esm.js"></script>
</body>
</html>
```

### ESM with JavaScript Interaction

```html
<script type="module">
  // Import the bundle (components auto-register on import)
  import { ButtonCTA, InputTextBase, IconBaseElement, ContainerBaseWeb } from './dist/browser/designerpunk.esm.js';
  
  // Wait for components to be defined
  await customElements.whenDefined('button-cta');
  await customElements.whenDefined('input-text-base');
  
  // Add event listeners
  const button = document.querySelector('button-cta');
  button.addEventListener('press', (event) => {
    console.log('Button pressed!', event.detail);
  });
  
  const input = document.querySelector('input-text-base');
  input.addEventListener('change', (event) => {
    console.log('Input changed:', event.detail.value);
  });
</script>
```

### ESM Production Loading (Minified)

For production, use the minified bundle for smaller file size:

```html
<!-- Development (readable, with source maps) -->
<script type="module" src="dist/browser/designerpunk.esm.js"></script>

<!-- Production (minified, ~50% smaller) -->
<script type="module" src="dist/browser/designerpunk.esm.min.js"></script>
```

### ESM Browser Support

ESM bundles target ES2020 and work in:
- Chrome 80+
- Firefox 74+
- Safari 14+
- Edge 80+

---

## UMD Loading Pattern

**For legacy browser support or global access**

UMD (Universal Module Definition) provides broader browser compatibility and exposes components via a global `window.DesignerPunk` object.

### Basic UMD Loading

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DesignerPunk UMD Example</title>
  
  <!-- Design tokens must be loaded first -->
  <link rel="stylesheet" href="dist/browser/tokens.css">
</head>
<body>
  <!-- Components can be used immediately in HTML -->
  <button-cta label="Click Me" variant="primary"></button-cta>
  <input-text-base label="Email" placeholder="you@example.com"></input-text-base>

  <!-- UMD bundle - no type="module" needed -->
  <script src="dist/browser/designerpunk.umd.js"></script>
</body>
</html>
```

### UMD with JavaScript Interaction

```html
<script src="dist/browser/designerpunk.umd.js"></script>
<script>
  // Components are available via window.DesignerPunk
  console.log('Available components:', Object.keys(window.DesignerPunk));
  // Output: ['InputTextBase', 'ButtonCTA', 'IconBaseElement', 'ContainerBaseWeb', 'Icon', 'IconBase', 'Container', 'ContainerBase']
  
  // Wait for DOM and components to be ready
  document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners
    var button = document.querySelector('button-cta');
    button.addEventListener('press', function(event) {
      console.log('Button pressed!', event.detail);
    });
    
    var input = document.querySelector('input-text-base');
    input.addEventListener('change', function(event) {
      console.log('Input changed:', event.detail.value);
    });
  });
</script>
```

### UMD Production Loading (Minified)

```html
<!-- Development (readable, with source maps) -->
<script src="dist/browser/designerpunk.umd.js"></script>

<!-- Production (minified, ~50% smaller) -->
<script src="dist/browser/designerpunk.umd.min.js"></script>
```

### UMD Browser Support

UMD bundles target ES2017 and work in:
- Chrome 58+
- Firefox 52+
- Safari 11+
- Edge 16+
- IE11 (with polyfills)

---

## Token Loading

Design tokens provide the visual styling for all components. **Tokens must be loaded before components render correctly.**

### Required Token Loading

```html
<!-- Always load tokens.css in the <head> -->
<link rel="stylesheet" href="dist/browser/tokens.css">
```

### Token Detection

The bundle automatically checks if tokens are loaded. If tokens are missing, you'll see a console warning:

```
[DesignerPunk] Design tokens not detected. Include tokens.css before using components: 
<link rel="stylesheet" href="dist/browser/tokens.css">
```

### Available Token Categories

The `tokens.css` file includes CSS custom properties for:

- **Colors**: `--color-primary`, `--color-error`, `--color-success`, etc.
- **Typography**: `--typography-body-md-font-size`, `--typography-heading-lg-font-size`, etc.
- **Spacing**: `--space-100`, `--space-200`, `--space-inset-200`, etc.
- **Borders**: `--border-border-default`, `--radius-100`, etc.
- **Shadows**: `--shadow-container`, `--shadow-dusk`, etc.

### Using Tokens in Custom Styles

You can use DesignerPunk tokens in your own CSS:

```css
.my-custom-element {
  background: var(--color-surface);
  color: var(--color-text-default);
  padding: var(--space-inset-200);
  border-radius: var(--radius-100);
  box-shadow: var(--shadow-container);
}
```

---

## Component Reference

### ButtonCTA (`<button-cta>`)

Call-to-action button with variants, sizes, and icon support.

```html
<!-- Basic usage -->
<button-cta label="Click Me" variant="primary"></button-cta>

<!-- With icon -->
<button-cta label="Continue" icon="arrow-right" variant="primary"></button-cta>

<!-- Size variants -->
<button-cta label="Small" size="small" variant="primary"></button-cta>
<button-cta label="Medium" size="medium" variant="primary"></button-cta>
<button-cta label="Large" size="large" variant="primary"></button-cta>

<!-- Style variants -->
<button-cta label="Primary" variant="primary"></button-cta>
<button-cta label="Secondary" variant="secondary"></button-cta>
<button-cta label="Tertiary" variant="tertiary"></button-cta>

<!-- Disabled state -->
<button-cta label="Disabled" variant="primary" disabled></button-cta>
```

**Events:**
- `press` - Fired when button is clicked or activated via keyboard

### InputTextBase (`<input-text-base>`)

Text input with validation states, helper text, and accessibility features.

```html
<!-- Basic usage -->
<input-text-base label="Username" placeholder="Enter username"></input-text-base>

<!-- With helper text -->
<input-text-base 
  label="Email" 
  type="email" 
  placeholder="you@example.com"
  helper-text="We'll never share your email"
></input-text-base>

<!-- Error state -->
<input-text-base 
  label="Password" 
  type="password"
  error-message="Password must be at least 8 characters"
></input-text-base>

<!-- Success state -->
<input-text-base 
  label="Code" 
  value="123456"
  is-success="true"
></input-text-base>

<!-- Required field -->
<input-text-base label="Full Name" required></input-text-base>
```

**Events:**
- `change` - Fired when input value changes
- `focus` - Fired when input receives focus
- `blur` - Fired when input loses focus

### Icon (`<icon-base>`)

Icon component with size and color variants.

```html
<!-- Basic usage -->
<icon-base name="arrow-right" size="24"></icon-base>

<!-- Size variants -->
<icon-base name="heart" size="13"></icon-base>
<icon-base name="heart" size="18"></icon-base>
<icon-base name="heart" size="24"></icon-base>
<icon-base name="heart" size="32"></icon-base>
<icon-base name="heart" size="48"></icon-base>

<!-- Color variants (using token names) -->
<icon-base name="check" size="24" color="color-success-strong"></icon-base>
<icon-base name="x" size="24" color="color-error"></icon-base>
<icon-base name="info" size="24" color="color-primary"></icon-base>
```

**Available Icons:**
`arrow-right`, `arrow-left`, `arrow-up`, `arrow-down`, `check`, `x`, `plus`, `minus`, `info`, `settings`, `user`, `heart`, `mail`, `calendar`, `star`, `chevron-down`, `chevron-up`, `chevron-left`, `chevron-right`

### Container (`<container-base>`)

Layout container with padding, background, shadow, and border options.

```html
<!-- Basic usage -->
<container-base padding="200" background="color-surface" border-radius="normal">
  <p>Content goes here</p>
</container-base>

<!-- With shadow -->
<container-base padding="300" background="color-surface" shadow="shadow-container" border-radius="normal">
  <p>Elevated content</p>
</container-base>

<!-- With border -->
<container-base padding="200" border="default" border-radius="normal">
  <p>Bordered content</p>
</container-base>

<!-- Semantic HTML -->
<container-base padding="200" semantic="article" accessibility-label="Article section">
  <h2>Article Title</h2>
  <p>Article content</p>
</container-base>
```

**Attributes:**
- `padding`: `'100'` | `'200'` | `'300'` | `'none'`
- `border-radius`: `'none'` | `'small'` | `'normal'` | `'large'`
- `background`: Token name (e.g., `'color-surface'`)
- `shadow`: Token name (e.g., `'shadow-container'`)
- `border`: `'default'` | `'none'`
- `semantic`: `'div'` | `'section'` | `'article'` | `'aside'` | `'nav'` | `'main'`

---

## Troubleshooting

### Components Not Rendering

**Symptom:** Components appear as empty or show raw HTML tags.

**Solutions:**

1. **Check bundle is loaded:**
   ```html
   <!-- Verify script tag is present and path is correct -->
   <script type="module" src="dist/browser/designerpunk.esm.js"></script>
   ```

2. **Check for JavaScript errors:**
   Open browser DevTools (F12) → Console tab → Look for errors

3. **Verify custom elements are registered:**
   ```javascript
   // In browser console
   console.log(customElements.get('button-cta')); // Should not be undefined
   ```

### Components Unstyled

**Symptom:** Components render but appear unstyled or with wrong colors.

**Solutions:**

1. **Check tokens.css is loaded:**
   ```html
   <!-- Must be in <head> before components render -->
   <link rel="stylesheet" href="dist/browser/tokens.css">
   ```

2. **Check for console warning:**
   Look for: `[DesignerPunk] Design tokens not detected...`

3. **Verify CSS custom properties:**
   ```javascript
   // In browser console
   getComputedStyle(document.documentElement).getPropertyValue('--color-primary');
   // Should return a color value, not empty string
   ```

### "Custom element already defined" Error

**Symptom:** Console error about element already being registered.

**Cause:** Bundle loaded multiple times or conflicting library versions.

**Solution:** The bundle handles this automatically with idempotent registration. If you still see errors:
- Check for duplicate `<script>` tags
- Ensure only one version of DesignerPunk is loaded

### Events Not Firing

**Symptom:** Event listeners don't trigger when interacting with components.

**Solutions:**

1. **Wait for components to be defined:**
   ```javascript
   // ESM
   await customElements.whenDefined('button-cta');
   
   // UMD
   document.addEventListener('DOMContentLoaded', function() {
     // Add listeners here
   });
   ```

2. **Use correct event names:**
   - ButtonCTA: `press` (not `click`)
   - Input-Text-Base: `change`, `focus`, `blur`

3. **Check event detail:**
   ```javascript
   button.addEventListener('press', (event) => {
     console.log(event.detail); // Contains event data
   });
   ```

### CORS Errors When Loading Locally

**Symptom:** CORS errors when opening HTML file directly in browser.

**Solution:** Use a local server instead of `file://` protocol:

```bash
# Python 3
python -m http.server 8000

# Node.js (with npx)
npx serve .

# Then open http://localhost:8000
```

---

## Bundle Files Reference

| File | Format | Target | Use Case |
|------|--------|--------|----------|
| `designerpunk.esm.js` | ESM | ES2020 | Modern browsers, development |
| `designerpunk.esm.min.js` | ESM | ES2020 | Modern browsers, production |
| `designerpunk.umd.js` | UMD | ES2017 | Legacy browsers, development |
| `designerpunk.umd.min.js` | UMD | ES2017 | Legacy browsers, production |
| `tokens.css` | CSS | - | Design tokens (required) |
| `demo.html` | HTML | - | Interactive demo page |

**Source Maps:** All bundles include `.map` files for debugging.

---

## Related Documentation

- [Technology Stack](./Technology Stack.md) - Platform technology choices
- [Component Development Guide](./Component-Development-Guide.md) - Component implementation guidance
- [Token System Overview](../../docs/token-system-overview.md) - Complete token system documentation

---

*This guide provides comprehensive documentation for browser-based DesignerPunk web component integration. For bundler-based projects, use standard npm imports.*
