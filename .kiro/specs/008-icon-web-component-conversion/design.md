# Design Document: Icon Web Component Conversion

**Date**: November 19, 2025
**Spec**: 008 - Icon Web Component Conversion
**Status**: Design Phase
**Dependencies**: 004 - Icon System (existing implementation)

---

## Overview

This spec converts the existing Icon web implementation from a TypeScript class-based approach to a vanilla web component (Custom Element). The conversion maintains True Native Architecture consistency across all platforms while preserving the existing Icon API, accessibility features, and token integration.

**Key Design Principles:**
- **True Native Architecture**: Web components for web, SwiftUI for iOS, Jetpack Compose for Android
- **API Preservation**: Maintain existing Icon API for backward compatibility
- **Pattern Consistency**: Follow ButtonCTA web component pattern
- **Token Integration**: Use semantic tokens for sizing and colors
- **Accessibility First**: Maintain aria-hidden and screen reader behavior

**What Changes:**
- Web implementation: TypeScript class → Vanilla Web Component
- Custom element registration: `<dp-icon>` tag available
- Shadow DOM: Style encapsulation with CSS custom properties

**What Stays the Same:**
- iOS implementation: SwiftUI (unchanged)
- Android implementation: Jetpack Compose (unchanged)
- Icon API: name, size, color, className, style, testID props
- SVG content: 15 Feather Icons with inline SVG rendering
- Accessibility: aria-hidden="true" for decorative icons

---

## Architecture

### System Components

```
Icon Web Component
├── Custom Element (<dp-icon>)
│   ├── Shadow DOM (style encapsulation)
│   ├── SVG Rendering (inline SVG injection)
│   └── Token Integration (CSS custom properties)
│
├── Icon Registry
│   ├── SVG Content Map (15 Feather Icons)
│   └── Fallback Handling (circle icon)
│
├── Styling
│   ├── Icon.web.css (external stylesheet)
│   └── Token References (semantic tokens)
│
└── Type Definitions
    ├── IconName (TypeScript union type)
    └── IconSize (TypeScript union type)
```

### Component Hierarchy

```
ButtonCTA Component (Consumer)
    ↓
<dp-icon> Custom Element
    ↓
Shadow DOM
    ↓
<svg> Element (inline SVG)
    ↓
SVG Content (paths, lines, etc.)
```

---

## Components and Interfaces

### Custom Element Definition


```typescript
// src/components/core/Icon/platforms/web/Icon.web.ts

import { IconProps, IconName, IconSize } from '../../types';

/**
 * Icon Web Component
 * 
 * A native web component that renders inline SVG icons with currentColor inheritance.
 * Follows True Native Architecture with Shadow DOM encapsulation.
 * 
 * @example
 * ```html
 * <!-- Basic usage -->
 * <dp-icon name="arrow-right" size="24"></dp-icon>
 * 
 * <!-- With color override -->
 * <dp-icon name="check" size="32" color="color-success"></dp-icon>
 * 
 * <!-- With custom class -->
 * <dp-icon name="settings" size="24" class="custom-icon"></dp-icon>
 * ```
 * 
 * @example
 * ```typescript
 * // Programmatic usage
 * const icon = document.createElement('dp-icon') as DPIcon;
 * icon.name = 'arrow-right';
 * icon.size = 24;
 * document.body.appendChild(icon);
 * ```
 */
export class DPIcon extends HTMLElement {
  private _shadowRoot: ShadowRoot;
  
  /**
   * Observed attributes for automatic re-rendering on change.
   */
  static get observedAttributes(): string[] {
    return ['name', 'size', 'color', 'test-id'];
  }
  
  constructor() {
    super();
    
    // Attach shadow DOM for style encapsulation
    this._shadowRoot = this.attachShadow({ mode: 'open' });
  }
  
  /**
   * Called when the element is added to the DOM.
   */
  connectedCallback(): void {
    this.render();
  }
  
  /**
   * Called when an observed attribute changes.
   */
  attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue !== newValue) {
      this.render();
    }
  }
  
  // Property getters/setters
  get name(): IconName {
    return (this.getAttribute('name') || 'circle') as IconName;
  }
  
  set name(value: IconName) {
    this.setAttribute('name', value);
  }
  
  get size(): IconSize {
    const size = parseInt(this.getAttribute('size') || '24', 10);
    return (size === 16 || size === 24 || size === 32 || size === 40) ? size : 24;
  }
  
  set size(value: IconSize) {
    this.setAttribute('size', value.toString());
  }
  
  get color(): string {
    return this.getAttribute('color') || 'inherit';
  }
  
  set color(value: string) {
    this.setAttribute('color', value);
  }
  
  get testID(): string | null {
    return this.getAttribute('test-id');
  }
  
  set testID(value: string | null) {
    if (value) {
      this.setAttribute('test-id', value);
    } else {
      this.removeAttribute('test-id');
    }
  }
  
  /**
   * Render the component.
   */
  private render(): void {
    const name = this.name;
    const size = this.size;
    const color = this.color;
    const testID = this.testID;
    
    // Load SVG content
    const svgContent = loadIconSVG(name);
    
    // Determine stroke color
    const strokeColor = color === 'inherit' 
      ? 'currentColor' 
      : `var(--${color})`;
    
    // Generate test ID attribute
    const testIDAttr = testID ? ` data-testid="${testID}"` : '';
    
    // Load CSS from external file
    const styleLink = `<link rel="stylesheet" href="./Icon.web.css">`;
    
    // Render shadow DOM content
    this._shadowRoot.innerHTML = `
      ${styleLink}
      <svg
        width="${size}"
        height="${size}"
        viewBox="0 0 24 24"
        fill="none"
        stroke="${strokeColor}"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="icon icon-${name}"
        aria-hidden="true"
        ${testIDAttr}
      >
        ${svgContent}
      </svg>
    `;
  }
}

/**
 * Load SVG content for a given icon name.
 */
function loadIconSVG(name: IconName): string {
  const iconContent: Record<IconName, string> = {
    'arrow-right': '<line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>',
    'arrow-left': '<line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>',
    'arrow-up': '<line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline>',
    'arrow-down': '<line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline>',
    'chevron-right': '<polyline points="9 18 15 12 9 6"></polyline>',
    'check': '<polyline points="20 6 9 17 4 12"></polyline>',
    'x': '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>',
    'plus': '<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>',
    'minus': '<line x1="5" y1="12" x2="19" y2="12"></line>',
    'circle': '<circle cx="12" cy="12" r="10"></circle>',
    'heart': '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>',
    'settings': '<circle cx="12" cy="12" r="3"></circle><path d="M12 1v6m0 6v6m5.66-13.66l-4.24 4.24m0 6l-4.24 4.24M23 12h-6m-6 0H1m18.66 5.66l-4.24-4.24m0-6l-4.24-4.24"></path>',
    'user': '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>',
    'mail': '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>',
    'calendar': '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>',
  };
  
  return iconContent[name] || iconContent['circle'];
}

/**
 * Register the custom element.
 */
if (!customElements.get('dp-icon')) {
  customElements.define('dp-icon', DPIcon);
}

/**
 * Backward compatibility: Export createIcon function
 */
export function createIcon(props: IconProps): string {
  const { name, size, color = 'inherit', className = '', style = {}, testID } = props;
  
  const svgContent = loadIconSVG(name);
  const strokeColor = color === 'inherit' ? 'currentColor' : `var(--${color})`;
  
  const styleStr = Object.entries(style)
    .map(([key, value]) => {
      const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `${kebabKey}: ${value}`;
    })
    .join('; ');
  
  const classAttr = `icon icon-${name} ${className}`.trim();
  const testIDAttr = testID ? ` data-testid="${testID}"` : '';
  const styleAttr = styleStr ? ` style="${styleStr}"` : '';
  
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${classAttr}" aria-hidden="true"${testIDAttr}${styleAttr}>${svgContent}</svg>`;
}

/**
 * Backward compatibility: Export Icon class
 */
export class Icon {
  private props: IconProps;
  
  constructor(props: IconProps) {
    this.props = props;
  }
  
  render(): string {
    return createIcon(this.props);
  }
  
  update(props: Partial<IconProps>): void {
    this.props = { ...this.props, ...props };
  }
  
  getProps(): IconProps {
    return { ...this.props };
  }
}

export default DPIcon;
```


### CSS Styling

```css
/**
 * Icon Component Styles for Web Platform
 * 
 * Token-based styling using CSS custom properties.
 * Minimal styling - icons inherit color from parent by default.
 * 
 * @module Icon/platforms/web/styles
 */

/* ==========================================================================
   Base Icon Styles
   ========================================================================== */

/**
 * Base SVG element styling.
 * 
 * - Display: inline-block for proper alignment
 * - Vertical alignment: middle for text alignment
 * - Color inheritance: currentColor by default
 * - Flex-shrink: 0 to prevent shrinking in flex containers
 */
.icon {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
  color: inherit;
}

/**
 * Icon size variants using semantic tokens.
 * 
 * These classes can be applied for explicit sizing,
 * but size is typically controlled via the size attribute.
 */
.icon--size-16 {
  width: 16px;
  height: 16px;
}

.icon--size-24 {
  width: 24px;
  height: 24px;
}

.icon--size-32 {
  width: 32px;
  height: 32px;
}

.icon--size-40 {
  width: 40px;
  height: 40px;
}

/* ==========================================================================
   Accessibility
   ========================================================================== */

/**
 * Ensure icons are hidden from screen readers.
 * 
 * Icons are decorative and should not be announced.
 * Parent elements (buttons, links) provide accessible labels.
 */
.icon[aria-hidden="true"] {
  /* Already handled by aria-hidden attribute */
  /* This selector exists for documentation purposes */
}

/* ==========================================================================
   Print Styles
   ========================================================================== */

/**
 * Optimize icon appearance for print.
 * 
 * - Ensure icons are visible in print
 * - Simplify visual styling
 */
@media print {
  .icon {
    color: #000 !important;
  }
}

/* ==========================================================================
   High Contrast Mode Support
   ========================================================================== */

/**
 * Ensure icons remain visible in Windows High Contrast Mode.
 * 
 * - Force stroke color to currentColor
 * - Ensure icons inherit parent color
 */
@media (prefers-contrast: high) {
  .icon {
    stroke: currentColor !important;
  }
}
```

---

## Data Models

### Icon Registry Structure

The icon registry is a simple TypeScript record mapping icon names to SVG content strings:

```typescript
type IconRegistry = Record<IconName, string>;

const iconContent: IconRegistry = {
  'arrow-right': '<line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>',
  'arrow-left': '<line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>',
  // ... 13 more icons
};
```

**Design Rationale:**
- **Simple**: No complex data structures or external dependencies
- **Inline**: SVG content embedded in TypeScript for zero HTTP requests
- **Type-safe**: IconName type ensures only valid icons can be referenced
- **Fallback**: Returns 'circle' icon if requested icon not found

**Future Enhancement:**
- Could be auto-generated from SVG files in assets directory
- Could support lazy loading for large icon sets
- Could support icon variants (filled, outlined, etc.)

### File Structure

```
src/components/core/Icon/
├── types.ts                    # TypeScript type definitions (unchanged)
├── platforms/
│   ├── web/
│   │   ├── Icon.web.ts        # Web component implementation (NEW)
│   │   └── Icon.web.css       # Web component styles (NEW)
│   │
│   ├── ios/
│   │   └── Icon.ios.swift     # iOS implementation (unchanged)
│   │
│   └── android/
│       └── Icon.android.kt    # Android implementation (unchanged)
│
└── README.md                   # Component documentation (update with web component usage)
```

---

## Design Decisions

### Decision 1: Custom Element Name

**Options Considered:**
1. `<icon>` - Simple but conflicts with potential future HTML standard
2. `<dp-icon>` - Namespaced with "dp" prefix (DesignerPunk)
3. `<designer-punk-icon>` - Fully qualified but verbose

**Decision:** `<dp-icon>`

**Rationale:**
- **Namespace consistency**: Follows ButtonCTA pattern (`<button-cta>`)
- **Collision avoidance**: "dp-" prefix prevents conflicts with native elements
- **Brevity**: Short enough for practical use
- **Brand alignment**: "dp" represents DesignerPunk

**Trade-offs:**
- ✅ **Gained**: Consistent naming across components
- ✅ **Gained**: Collision-proof custom element name
- ❌ **Lost**: Slightly longer than `<icon>` (minimal impact)

**Implementation:**
```typescript
customElements.define('dp-icon', DPIcon);
```


### Decision 2: Shadow DOM vs Light DOM

**Options Considered:**
1. **Shadow DOM**: Style encapsulation, isolated from global styles
2. **Light DOM**: No encapsulation, inherits global styles
3. **Hybrid**: Shadow DOM with CSS custom properties for theming

**Decision:** Shadow DOM with CSS custom properties

**Rationale:**
- **Style encapsulation**: Prevents global CSS from affecting icon rendering
- **Token integration**: CSS custom properties pierce Shadow DOM boundary
- **Pattern consistency**: Follows ButtonCTA web component pattern
- **Predictable rendering**: Icon appearance consistent regardless of page styles

**Trade-offs:**
- ✅ **Gained**: Style isolation and predictability
- ✅ **Gained**: Token-based theming still works
- ❌ **Lost**: Cannot style icon internals from outside (intentional)
- ⚠️ **Consideration**: External stylesheet must be loaded in Shadow DOM

**Implementation:**
```typescript
constructor() {
  super();
  this._shadowRoot = this.attachShadow({ mode: 'open' });
}
```

**Counter-Argument:** "Light DOM would be simpler and allow global styling"

**Response:** While Light DOM is simpler, it creates unpredictable rendering when global styles interfere with icon SVG attributes. Shadow DOM ensures icons render consistently across different page contexts, which is critical for a design system component. The token system provides sufficient theming flexibility through CSS custom properties.

---

### Decision 3: Backward Compatibility Strategy

**Options Considered:**
1. **Breaking change**: Remove old API, force migration to web component
2. **Dual export**: Export both web component and legacy functions
3. **Deprecation path**: Keep legacy API, add deprecation warnings

**Decision:** Dual export with backward compatibility

**Rationale:**
- **Zero breaking changes**: Existing code continues to work
- **Gradual migration**: Teams can migrate at their own pace
- **ButtonCTA precedent**: ButtonCTA uses `createIcon()` function, must continue working
- **Future flexibility**: Can deprecate legacy API in future release

**Trade-offs:**
- ✅ **Gained**: Zero breaking changes for existing consumers
- ✅ **Gained**: ButtonCTA continues working without changes
- ❌ **Lost**: Slightly larger bundle size (both APIs exported)
- ⚠️ **Maintenance**: Must maintain both APIs until deprecation

**Implementation:**
```typescript
// New web component API
export class DPIcon extends HTMLElement { /* ... */ }

// Legacy function API (backward compatibility)
export function createIcon(props: IconProps): string { /* ... */ }

// Legacy class API (backward compatibility)
export class Icon { /* ... */ }
```

**Migration Path:**
```typescript
// Old usage (still works)
import { createIcon } from './Icon.web';
const iconHTML = createIcon({ name: 'arrow-right', size: 24 });

// New usage (recommended)
<dp-icon name="arrow-right" size="24"></dp-icon>
```

---

### Decision 4: Attribute vs Property API

**Options Considered:**
1. **Attributes only**: HTML attributes for all configuration
2. **Properties only**: JavaScript properties for all configuration
3. **Dual API**: Both attributes and properties (web component standard)

**Decision:** Dual API (attributes + properties)

**Rationale:**
- **Web component standard**: Custom elements support both attributes and properties
- **HTML usage**: Attributes enable declarative HTML usage
- **JavaScript usage**: Properties enable programmatic manipulation
- **Framework compatibility**: Works with React, Vue, Angular, etc.

**Trade-offs:**
- ✅ **Gained**: Flexible usage patterns (HTML and JavaScript)
- ✅ **Gained**: Framework compatibility
- ❌ **Lost**: Slightly more complex implementation (getters/setters)

**Implementation:**
```typescript
// Attribute usage (HTML)
<dp-icon name="arrow-right" size="24"></dp-icon>

// Property usage (JavaScript)
const icon = document.createElement('dp-icon');
icon.name = 'arrow-right';
icon.size = 24;
```

---

### Decision 5: SVG Injection Strategy

**Options Considered:**
1. **Inline SVG content**: Embed SVG paths directly in TypeScript
2. **External SVG files**: Load SVG files via HTTP requests
3. **Build-time generation**: Generate icon registry at build time
4. **Hybrid**: Inline for initial set, external for future expansion

**Decision:** Inline SVG content (maintain current approach)

**Rationale:**
- **Zero HTTP requests**: Faster rendering, no network dependency
- **Bundle size**: 15 icons = ~5KB (negligible)
- **Simplicity**: No build tooling or asset loading complexity
- **Consistency**: Matches current Icon.web.ts implementation

**Trade-offs:**
- ✅ **Gained**: Zero HTTP requests, immediate rendering
- ✅ **Gained**: Simple implementation, no build complexity
- ❌ **Lost**: Bundle size grows with icon count (acceptable for 15 icons)
- ⚠️ **Future**: May need external loading for 280+ icons

**Implementation:**
```typescript
function loadIconSVG(name: IconName): string {
  const iconContent: Record<IconName, string> = {
    'arrow-right': '<line x1="5" y1="12" x2="19" y2="12"></line>...',
    // ... 14 more icons
  };
  return iconContent[name] || iconContent['circle'];
}
```

**Counter-Argument:** "External SVG files would reduce bundle size"

**Response:** For 15 icons (~5KB), the bundle size impact is negligible compared to the complexity of asset loading, HTTP requests, and build tooling. If we expand to 280 icons (~100KB), we should revisit this decision and consider lazy loading or build-time generation. For now, inline content provides the best developer experience and performance.

---

## Token Integration

### Size Tokens

Icon sizes map to semantic icon size tokens from spec 006:

```typescript
// Complete icon size mapping (from spec 006: Icon Size Tokens)
// Formula: icon.sizeXXX = fontSizeXXX × lineHeightXXX
// 11 scale levels (some with same pixel values but different semantic meaning)

icon.size050 = fontSize050 × lineHeight050 = 13 × 1.0 = 13px (caption, legal, labelXs)
icon.size075 = fontSize075 × lineHeight075 = 14 × 1.25 = 18px (bodySm, buttonSm, labelSm)
icon.size100 = fontSize100 × lineHeight100 = 16 × 1.5 = 24px (bodyMd, buttonMd, labelMd, input)
icon.size125 = fontSize125 × lineHeight125 = 18 × 1.75 = 32px (bodyLg, buttonLg, labelLg)
icon.size150 = fontSize150 × lineHeight150 = 20 × 1.4 = 28px (h6)
icon.size200 = fontSize200 × lineHeight200 = 23 × 1.391 = 32px (h5)
icon.size300 = fontSize300 × lineHeight300 = 26 × 1.231 = 32px (h4)
icon.size400 = fontSize400 × lineHeight400 = 29 × 1.241 = 36px (h3)
icon.size500 = fontSize500 × lineHeight500 = 33 × 1.212 = 40px (h2)
icon.size600 = fontSize600 × lineHeight600 = 37 × 1.19 = 44px (h1)
icon.size700 = fontSize700 × lineHeight700 = 42 × 1.143 = 48px (display)
```

**Implementation:**
```css
/* Icon.web.css - All 11 token scale levels */
/* Note: Class names match token names to preserve semantic meaning */
/* Some tokens have same pixel values but maintain separate classes for typography pairing */

.icon--size-050 {
  width: var(--icon-size-050); /* 13px - caption, legal, labelXs */
  height: var(--icon-size-050);
}

.icon--size-075 {
  width: var(--icon-size-075); /* 18px - bodySm, buttonSm, labelSm */
  height: var(--icon-size-075);
}

.icon--size-100 {
  width: var(--icon-size-100); /* 24px - bodyMd, buttonMd, labelMd, input */
  height: var(--icon-size-100);
}

.icon--size-125 {
  width: var(--icon-size-125); /* 32px - bodyLg, buttonLg, labelLg */
  height: var(--icon-size-125);
}

.icon--size-150 {
  width: var(--icon-size-150); /* 28px - h6 */
  height: var(--icon-size-150);
}

.icon--size-200 {
  width: var(--icon-size-200); /* 32px - h5 */
  height: var(--icon-size-200);
}

.icon--size-300 {
  width: var(--icon-size-300); /* 32px - h4 */
  height: var(--icon-size-300);
}

.icon--size-400 {
  width: var(--icon-size-400); /* 36px - h3 */
  height: var(--icon-size-400);
}

.icon--size-500 {
  width: var(--icon-size-500); /* 40px - h2 */
  height: var(--icon-size-500);
}

.icon--size-600 {
  width: var(--icon-size-600); /* 44px - h1 */
  height: var(--icon-size-600);
}

.icon--size-700 {
  width: var(--icon-size-700); /* 48px - display */
  height: var(--icon-size-700);
}
```

**Note:** Size is primarily controlled via the `size` attribute, which sets inline width/height. CSS classes provide fallback and explicit sizing options. Icon sizes are calculated from fontSize × lineHeight to maintain perfect optical balance with paired typography. Each icon size token corresponds to a typography scale level, with class names matching token names to preserve semantic meaning (see spec 006: Icon Size Tokens for complete formula documentation).

### Color Tokens

Icon colors use semantic color tokens:

```typescript
// Color token mapping
'inherit' → currentColor (default)
'color-primary' → var(--color-primary)
'color-success' → var(--color-success)
'color-error' → var(--color-error)
// ... other semantic color tokens
```

**Implementation:**
```typescript
const strokeColor = color === 'inherit' 
  ? 'currentColor' 
  : `var(--${color})`;
```

**Usage:**
```html
<!-- Inherit parent color (default) -->
<dp-icon name="arrow-right" size="24"></dp-icon>

<!-- Explicit semantic color -->
<dp-icon name="check" size="24" color="color-success"></dp-icon>
```

---

## Error Handling

### Invalid Icon Name

**Scenario:** User specifies an icon name that doesn't exist in the registry

**Handling:**
```typescript
function loadIconSVG(name: IconName): string {
  const iconContent: Record<IconName, string> = { /* ... */ };
  return iconContent[name] || iconContent['circle']; // Fallback to circle
}
```

**Behavior:**
- Returns 'circle' icon as fallback
- No console errors or warnings (graceful degradation)
- TypeScript prevents invalid names at compile-time

**Rationale:** Graceful degradation ensures the UI doesn't break if an icon is missing. The 'circle' icon is simple and universally recognizable as a placeholder.

### Invalid Size

**Scenario:** User specifies a size that isn't a valid IconSize

**Handling:**
```typescript
get size(): IconSize {
  const size = parseInt(this.getAttribute('size') || '24', 10);
  return (size === 16 || size === 24 || size === 32 || size === 40) ? size : 24;
}
```

**Behavior:**
- Defaults to 24px (medium size)
- No console errors or warnings
- TypeScript prevents invalid sizes at compile-time

**Rationale:** 24px is the most common icon size and provides a reasonable default for invalid inputs.

### Missing Attributes

**Scenario:** User doesn't specify required attributes

**Handling:**
```typescript
// name defaults to 'circle'
get name(): IconName {
  return (this.getAttribute('name') || 'circle') as IconName;
}

// size defaults to 24
get size(): IconSize {
  const size = parseInt(this.getAttribute('size') || '24', 10);
  return (size === 16 || size === 24 || size === 32 || size === 40) ? size : 24;
}

// color defaults to 'inherit'
get color(): string {
  return this.getAttribute('color') || 'inherit';
}
```

**Behavior:**
- Sensible defaults for all attributes
- Component renders successfully even with no attributes
- No console errors or warnings

**Rationale:** Defensive defaults ensure the component always renders something useful, even with minimal configuration.

---

## Testing Strategy

### Unit Tests

**Web Component Lifecycle:**
```typescript
describe('DPIcon Web Component', () => {
  it('registers custom element', () => {
    expect(customElements.get('dp-icon')).toBeDefined();
  });
  
  it('renders with default attributes', () => {
    const icon = document.createElement('dp-icon') as DPIcon;
    document.body.appendChild(icon);
    
    expect(icon.name).toBe('circle');
    expect(icon.size).toBe(24);
    expect(icon.color).toBe('inherit');
  });
  
  it('updates when attributes change', () => {
    const icon = document.createElement('dp-icon') as DPIcon;
    document.body.appendChild(icon);
    
    icon.setAttribute('name', 'arrow-right');
    icon.setAttribute('size', '32');
    
    expect(icon.name).toBe('arrow-right');
    expect(icon.size).toBe(32);
  });
  
  it('renders SVG in shadow DOM', () => {
    const icon = document.createElement('dp-icon') as DPIcon;
    icon.name = 'check';
    icon.size = 24;
    document.body.appendChild(icon);
    
    const svg = icon.shadowRoot?.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('width')).toBe('24');
    expect(svg?.getAttribute('height')).toBe('24');
  });
});
```


**Accessibility:**
```typescript
describe('Icon Accessibility', () => {
  it('sets aria-hidden="true"', () => {
    const icon = document.createElement('dp-icon') as DPIcon;
    icon.name = 'arrow-right';
    document.body.appendChild(icon);
    
    const svg = icon.shadowRoot?.querySelector('svg');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
  });
  
  it('supports test-id attribute', () => {
    const icon = document.createElement('dp-icon') as DPIcon;
    icon.testID = 'my-icon';
    document.body.appendChild(icon);
    
    const svg = icon.shadowRoot?.querySelector('svg');
    expect(svg?.getAttribute('data-testid')).toBe('my-icon');
  });
});
```

**Color Inheritance:**
```typescript
describe('Icon Color Inheritance', () => {
  it('uses currentColor by default', () => {
    const icon = document.createElement('dp-icon') as DPIcon;
    icon.name = 'check';
    document.body.appendChild(icon);
    
    const svg = icon.shadowRoot?.querySelector('svg');
    expect(svg?.getAttribute('stroke')).toBe('currentColor');
  });
  
  it('applies color token override', () => {
    const icon = document.createElement('dp-icon') as DPIcon;
    icon.name = 'check';
    icon.color = 'color-success';
    document.body.appendChild(icon);
    
    const svg = icon.shadowRoot?.querySelector('svg');
    expect(svg?.getAttribute('stroke')).toBe('var(--color-success)');
  });
});
```

**Backward Compatibility:**
```typescript
describe('Backward Compatibility', () => {
  it('exports createIcon function', () => {
    const iconHTML = createIcon({ name: 'arrow-right', size: 24 });
    expect(iconHTML).toContain('<svg');
    expect(iconHTML).toContain('width="24"');
    expect(iconHTML).toContain('arrow-right');
  });
  
  it('exports Icon class', () => {
    const icon = new Icon({ name: 'check', size: 32 });
    const html = icon.render();
    expect(html).toContain('<svg');
    expect(html).toContain('width="32"');
  });
});
```

### Integration Tests

**ButtonCTA Integration:**
```typescript
describe('ButtonCTA + Icon Integration', () => {
  it('renders icon inside button', () => {
    const button = document.createElement('button-cta') as ButtonCTA;
    button.label = 'Click me';
    button.icon = 'arrow-right';
    document.body.appendChild(button);
    
    // ButtonCTA uses createIcon() function internally
    const buttonShadow = button.shadowRoot;
    const iconHTML = buttonShadow?.querySelector('.button-cta__icon')?.innerHTML;
    expect(iconHTML).toContain('<svg');
    expect(iconHTML).toContain('arrow-right');
  });
});
```

**Framework Compatibility:**
```typescript
describe('Framework Compatibility', () => {
  it('works with React', () => {
    // React usage
    const element = React.createElement('dp-icon', {
      name: 'arrow-right',
      size: 24
    });
    // Test React rendering
  });
  
  it('works with Vue', () => {
    // Vue usage
    // <dp-icon name="arrow-right" :size="24"></dp-icon>
    // Test Vue rendering
  });
});
```

### Visual Regression Tests

**Cross-browser consistency:**
- Render icons in Chrome, Firefox, Safari
- Capture screenshots at all size variants
- Compare visual output for consistency
- Verify stroke width, proportions, alignment

**Tools:**
- Percy or Chromatic for visual regression
- Manual screenshot comparison for initial validation

---

## Migration Guide

### For Component Consumers

**Old Usage (still works):**
```typescript
import { createIcon } from '@designerpunk/components/Icon';

const iconHTML = createIcon({ 
  name: 'arrow-right', 
  size: 24 
});

element.innerHTML = iconHTML;
```

**New Usage (recommended):**
```html
<dp-icon name="arrow-right" size="24"></dp-icon>
```

**Programmatic Usage:**
```typescript
const icon = document.createElement('dp-icon') as DPIcon;
icon.name = 'arrow-right';
icon.size = 24;
icon.color = 'color-primary';
document.body.appendChild(icon);
```

### For ButtonCTA Component

**No changes required** - ButtonCTA continues using `createIcon()` function:

```typescript
// ButtonCTA.web.ts (unchanged)
import { createIcon } from '../../../Icon/platforms/web/Icon.web';

const iconHTML = icon ? createIcon({ 
  name: icon as any,
  size: iconSize,
  color: 'inherit'
}) : '';
```

**Future Enhancement:** ButtonCTA could be updated to use `<dp-icon>` web component:

```typescript
// Future ButtonCTA implementation
const iconHTML = icon 
  ? `<dp-icon name="${icon}" size="${iconSize}" color="inherit"></dp-icon>`
  : '';
```

### Breaking Changes

**None** - This is a non-breaking change. All existing APIs continue to work.

---

## Performance Considerations

### Bundle Size

**Current Implementation:**
- Icon.web.ts: ~2KB (TypeScript class + functions)
- SVG content: ~5KB (15 icons)
- **Total: ~7KB**

**New Implementation:**
- Icon.web.ts: ~3KB (Web component + backward compatibility)
- Icon.web.css: ~1KB (minimal styling)
- SVG content: ~5KB (15 icons, unchanged)
- **Total: ~9KB**

**Impact:** +2KB (~28% increase) for web component infrastructure and backward compatibility. Acceptable trade-off for True Native Architecture consistency.

### Runtime Performance

**Shadow DOM Overhead:**
- Minimal performance impact (modern browsers optimize Shadow DOM)
- One-time cost during element creation
- No ongoing performance penalty

**Rendering Performance:**
- Inline SVG: Zero HTTP requests, immediate rendering
- No external asset loading or parsing
- Same rendering performance as current implementation

**Memory Usage:**
- Shadow DOM: Slight memory increase per icon instance
- Negligible for typical usage (dozens of icons per page)
- No memory leaks (proper cleanup in disconnectedCallback)

### Optimization Opportunities

**Future Enhancements:**
1. **Lazy loading**: Load SVG content on-demand for large icon sets
2. **SVG sprite sheet**: Single HTTP request for all icons
3. **Build-time generation**: Generate icon registry from SVG files
4. **Tree shaking**: Remove unused icons from bundle

---

## Future Enhancements

### Icon Variants

**Filled vs Outlined:**
```html
<dp-icon name="heart" size="24" variant="filled"></dp-icon>
<dp-icon name="heart" size="24" variant="outlined"></dp-icon>
```

**Implementation:**
- Add `variant` attribute to web component
- Expand icon registry to support multiple variants
- Update SVG content based on variant

### Icon Animation

**Spin animation:**
```html
<dp-icon name="settings" size="24" animate="spin"></dp-icon>
```

**Implementation:**
- Add `animate` attribute to web component
- Apply CSS animations via classes
- Support common animations (spin, pulse, bounce)

### Icon Composition

**Layered icons:**
```html
<dp-icon-stack>
  <dp-icon name="circle" size="40"></dp-icon>
  <dp-icon name="check" size="24"></dp-icon>
</dp-icon-stack>
```

**Implementation:**
- Create `<dp-icon-stack>` web component
- Position child icons using CSS
- Support badge/notification patterns

### Build-Time Generation

**Auto-generate icon registry:**
- Scan `icons-feather/` directory for SVG files
- Generate TypeScript icon registry at build time
- Auto-generate IconName type from available icons
- Support incremental icon addition

---

## Appendix: Web Component Best Practices

### Custom Element Naming

- Use kebab-case (lowercase with hyphens)
- Include at least one hyphen (required by spec)
- Use namespace prefix to avoid collisions
- Keep names concise but descriptive

### Shadow DOM Usage

- Use Shadow DOM for style encapsulation
- Load external stylesheets in Shadow DOM
- Use CSS custom properties for theming
- Avoid global style dependencies

### Attribute vs Property

- Attributes: String values, HTML usage
- Properties: Any type, JavaScript usage
- Sync attributes and properties via getters/setters
- Use `observedAttributes` for reactive updates

### Lifecycle Methods

- `connectedCallback`: Initialize when added to DOM
- `disconnectedCallback`: Cleanup when removed from DOM
- `attributeChangedCallback`: React to attribute changes
- `adoptedCallback`: Handle document adoption (rare)

### Event Handling

- Dispatch custom events for component interactions
- Use `bubbles: true` for event propagation
- Use `composed: true` to cross Shadow DOM boundary
- Clean up event listeners in `disconnectedCallback`

---

*This design document provides the architecture and implementation details for converting the Icon web implementation to a vanilla web component while maintaining backward compatibility and True Native Architecture consistency.*

