# DesignerPunk Component Demo System

Interactive demo pages for all DesignerPunk web component families. Each demo shows live components with all variants, states, and usage examples.

## Building Demos

Demos are built as part of the standard build process. The build script copies all HTML and CSS files from `demos/` to `dist/browser/` alongside the browser bundle and design tokens.

```bash
# Full build (includes TypeScript compilation, validation, and browser bundles + demos)
npm run build

# Browser bundles + demos only
npm run build:browser
```

After building, `dist/browser/` contains:
- `designerpunk.esm.js` — ESM browser bundle
- `tokens.css` — Design tokens (CSS custom properties)
- `demo-styles.css` — Shared demo stylesheet
- `index.html` — Demo index page
- `*-demo.html` — Individual component demo pages

## Serving Demos Locally

Demos require a local HTTP server. Opening files directly via `file://` protocol will trigger a warning banner and components may not load correctly due to CORS restrictions.

Start a local server pointing at the build output:

```bash
# Option 1: npx http-server (Node.js)
npx http-server dist/browser -p 8080

# Option 2: npx serve (Node.js)
npx serve dist/browser

# Option 3: Python 3
python3 -m http.server 8080 -d dist/browser
```

Then open the demo index:
- http://localhost:8080/ (http-server or Python)
- http://localhost:3000/ (serve, default port)

## Demo Page Guidelines

Demo pages follow flexible guidelines rather than a rigid template. Different components have different demo needs — a button needs interactive state demos, an input needs validation states, a stepper needs sequential flows. Guidelines provide structure without constraint.

### Required Elements

Every demo page must include:

1. **Page metadata and resources** in `<head>`:
   ```html
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>{Component Family} Demo - DesignerPunk</title>
   <link rel="stylesheet" href="tokens.css">
   <link rel="stylesheet" href="demo-styles.css">
   <script type="module" src="designerpunk.esm.js"></script>
   ```

2. **Page header with back navigation**:
   ```html
   <header class="demo-header">
     <a href="index.html" class="demo-back-link">← All Components</a>
     <h1>{Component Family} Demo</h1>
     <p class="demo-subtitle">{Brief description}</p>
   </header>
   ```

3. **At least one usage example section** with HTML code (and JavaScript if the component has events or requires JS interaction).

4. **Token verification section** listing CSS custom properties the component uses, to help verify tokens are loaded correctly.

5. **Page footer**:
   ```html
   <footer class="demo-footer">
     <p>DesignerPunk Design System • {Component Family} Demo</p>
   </footer>
   ```

### Recommended Sections

Include these sections when applicable to the component:

- **Size variants** — If the component has a size prop (small, medium, large), show all sizes
- **Visual variants** — If the component has variant/color/style props, show all variants
- **State variants** — Disabled, error, success, loading, etc.
- **Interactive states** — Hover, focus, active, pressed (for interactive components)
- **Accessibility features** — Keyboard navigation, ARIA attributes, screen reader behavior
- **Event handling** — If the component emits events, show interactive examples with visible event output
- **Composition examples** — If the component composes other components, show composition patterns

### Styling Guidelines

1. **Use shared CSS classes** from `demo-styles.css` for layout:
   - `.demo-section` — Container for each demo group
   - `.demo-row` — Flex row for component variants
   - `.demo-item` — Flex column for a labeled component
   - `.demo-item-label` — Small label under a component
   - `.demo-grid` — Responsive grid layout
   - `.demo-code` — Pre/code block styling
   - `.demo-interactive` — Darker background for hover/focus demos
   - `.demo-note` — Callout box with left border

2. **Use DesignerPunk design tokens** for any custom styling. No hard-coded colors, spacing, or typography values. Reference tokens via CSS custom properties (`var(--token-name)`).

3. **Use CSS logical properties** exclusively. No physical directional properties (`padding-left`, `margin-right`, etc.). Use logical equivalents (`padding-inline-start`, `margin-inline-end`, etc.).

4. **Dark background theme** using DesignerPunk design tokens. Ensure sufficient contrast for readability.

### Organization Guidelines

1. **Group related examples** in sections with clear headings:
   ```html
   <div class="demo-section">
     <h2>Size Variants</h2>
     <p>Button-CTA supports three sizes: small, medium, and large.</p>
     <div class="demo-row">
       <!-- examples -->
     </div>
   </div>
   ```

2. **Label each example** with descriptive text:
   ```html
   <div class="demo-item">
     <button-cta label="Small" size="small"></button-cta>
     <span class="demo-item-label">Small (32px height)</span>
   </div>
   ```

3. **Show code alongside rendered examples** where helpful, so developers understand how to achieve the demonstrated result.

4. **Include brief explanations** for complex interactions. Don't assume the visual alone is self-explanatory.

## Adding a New Demo Page

1. **Create the HTML file** in the `demos/` directory using the naming convention `{component-family-lowercase}-demo.html` (e.g., `chip-demo.html`, `progress-stepper-demo.html`).

2. **Follow the guidelines** above for required elements, recommended sections, and styling.

3. **Update `demos/index.html`** to add a link to the new demo under the appropriate category section.

4. **Build and test locally**:
   ```bash
   npm run build:browser
   npx http-server dist/browser -p 8080
   # Open http://localhost:8080/index.html and navigate to the new demo
   ```

5. **Verify**:
   - Components render correctly with proper styling
   - All variants and states display as expected
   - Navigation back to the index works
   - Token verification section shows expected values
   - Page is responsive (check at 320px and 1920px widths)

## Testing a Demo Locally

Before committing a new or modified demo:

1. Build the browser distribution:
   ```bash
   npm run build:browser
   ```

2. Start a local server:
   ```bash
   npx http-server dist/browser -p 8080
   ```

3. Open the demo in a browser and verify:
   - Components load and render (not empty HTML tags)
   - Styling looks correct (tokens loaded, dark theme applied)
   - Interactive examples work (events fire, state changes visible)
   - Back link navigates to the index
   - Index includes a link to the demo

4. Check the browser console for errors or warnings (e.g., missing tokens, unregistered elements).

## Minimal Demo Page Example

A complete, minimal demo page following the guidelines:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Icon-Base Demo - DesignerPunk</title>
  <link rel="stylesheet" href="tokens.css">
  <link rel="stylesheet" href="demo-styles.css">
  <script type="module" src="designerpunk.esm.js"></script>
</head>
<body class="demo-page">
  <header class="demo-header">
    <a href="index.html" class="demo-back-link">← All Components</a>
    <h1>Icon-Base Demo</h1>
    <p class="demo-subtitle">SVG icon component with size and color variants</p>
  </header>

  <main>
    <div class="demo-section">
      <h2>Size Variants</h2>
      <div class="demo-row">
        <div class="demo-item">
          <icon-base name="heart" size="13"></icon-base>
          <span class="demo-item-label">13</span>
        </div>
        <div class="demo-item">
          <icon-base name="heart" size="24"></icon-base>
          <span class="demo-item-label">24</span>
        </div>
        <div class="demo-item">
          <icon-base name="heart" size="48"></icon-base>
          <span class="demo-item-label">48</span>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h2>Token Verification</h2>
      <ul class="demo-token-list">
        <li><code>--icon-size-100</code></li>
        <li><code>--icon-size-200</code></li>
        <li><code>--icon-size-300</code></li>
      </ul>
    </div>

    <div class="demo-section">
      <h2>Usage Examples</h2>
      <h3>HTML</h3>
      <pre class="demo-code">&lt;icon-base name="heart" size="24"&gt;&lt;/icon-base&gt;</pre>
    </div>
  </main>

  <footer class="demo-footer">
    <p>DesignerPunk Design System • Icon-Base Demo</p>
  </footer>

  <script>
    if (window.location.protocol === 'file:') {
      const banner = document.createElement('div');
      banner.className = 'demo-file-protocol-warning';
      banner.textContent = 'Components may not load correctly via file:// protocol. Use a local server: npx serve dist/browser';
      document.body.prepend(banner);
    }
  </script>
</body>
</html>
```

## Demo Health Check

Demos are manually maintained. When a component's API changes (new props, renamed attributes, removed variants), the corresponding demo page should be updated to reflect those changes.

**Maintenance expectations:**

- When you modify a component's public API, update its demo page
- When you add a new variant or state, add it to the demo
- After updating a demo, load it locally to verify everything renders correctly
- Demos load components via the browser bundle — if the API changes and breaks the demo, it will be immediately visible when loading the page

**Component development checklist addition:**

- [ ] Update component README with new API
- [ ] Update component demo page (if demo exists)
- [ ] Run demo locally to verify changes

If a demo page appears broken or outdated, the fix is straightforward: update the HTML to match the current component API, rebuild, and verify locally.

## Component Family Demo Checklist

| Component Family | Demo File | Status |
|-----------------|-----------|--------|
| Avatar | `avatar-demo.html` | Planned (migrate existing) |
| Badge | `badge-demo.html` | Planned (migrate existing) |
| Button-CTA | `button-cta-demo.html` | Planned |
| Button-Icon | `button-icon-demo.html` | Planned |
| Button-VerticalList | `button-vertical-list-demo.html` | Planned |
| Chip | `chip-demo.html` | Planned |
| Container-Base | `container-base-demo.html` | Planned |
| Container-Card | `container-card-demo.html` | Planned |
| Icon-Base | `icon-base-demo.html` | Planned |
| Input-Text | `input-text-demo.html` | Planned |
| Input-Checkbox | `checkbox-demo.html` | Planned (migrate existing) |
| Input-Radio | `radio-demo.html` | Planned |
| Progress-Indicator | `progress-indicator-demo.html` | Planned |
| Progress-Pagination | `progress-pagination-demo.html` | Planned |
| Progress-Stepper | `progress-stepper-demo.html` | Planned |
