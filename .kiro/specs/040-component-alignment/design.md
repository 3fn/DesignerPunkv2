# Design Document: Component Alignment and Consistency

**Date**: 2026-01-12
**Spec**: 040 - Component Alignment
**Status**: Design Phase
**Dependencies**: None

---

## Overview

This design document details the architectural patterns and implementation approach for aligning four web components (Button-CTA, Button-VerticalListItem, ButtonIcon, Input-Text-Base) to consistent standards. The work addresses eight issue areas identified in the design outline, establishing unified patterns for state colors, DOM updates, motion tokens, CSS architecture, and naming conventions.

The design prioritizes non-breaking changes where possible, with the ButtonIcon directory rename being the only structural change. All components will maintain their existing public APIs while improving internal consistency.

---

## Architecture

### Component Alignment Matrix

| Component | Blend Utils | Incremental DOM | Motion Token | CSS External | Property Naming |
|-----------|-------------|-----------------|--------------|--------------|-----------------|
| Button-CTA | ✅ Has | ❌ Needs | ❌ Needs | ✅ Has | ✅ Has |
| Button-VerticalListItem | ❌ Needs | ✅ Has | ✅ Has | ✅ Has | ❌ Needs |
| ButtonIcon | ❌ Needs | ❌ Needs | ❌ Needs | ❌ Needs | ❌ Needs |
| Input-Text-Base | ✅ Has | ⚠️ Partial | ✅ Has | ❌ Needs | ✅ Has |

### Implementation Order

1. **ButtonIcon** (most work) - All patterns need implementation
2. **Button-CTA** - Incremental DOM + motion token
3. **Button-VerticalListItem** - Blend utilities + property naming
4. **Input-Text-Base** - CSS extraction only
5. **Documentation** - Component Development Guide updates

---

## Components and Interfaces

### Blend Utilities Integration

**Pattern**: Import `getBlendUtilities()` from `blend/ThemeAwareBlendUtilities.web`, initialize in constructor, calculate colors in `connectedCallback()`.

**Interface**:
```typescript
import { getBlendUtilities, BlendUtilitiesResult } from '../../../../../blend/ThemeAwareBlendUtilities.web';

class Component extends HTMLElement {
  private _blendUtils: BlendUtilitiesResult;
  private _hoverColor: string = '';
  private _pressedColor: string = '';
  
  constructor() {
    super();
    this._blendUtils = getBlendUtilities();
  }
  
  connectedCallback(): void {
    this._calculateBlendColors();
    this._render();
  }
  
  private _calculateBlendColors(): void {
    const computedStyle = getComputedStyle(document.documentElement);
    const primaryColor = computedStyle.getPropertyValue('--color-primary').trim();
    
    this._hoverColor = this._blendUtils.hoverColor(primaryColor);
    this._pressedColor = this._blendUtils.pressedColor(primaryColor);
  }
}
```

**CSS Application**:
```css
.component {
  --_comp-hover-bg: var(--calculated-hover-color);
  --_comp-pressed-bg: var(--calculated-pressed-color);
}

.component:hover {
  background-color: var(--_comp-hover-bg);
}

.component:active {
  background-color: var(--_comp-pressed-bg);
}
```

### Incremental DOM Pattern

**Pattern**: Create DOM once with `innerHTML`, cache element references, update via direct DOM APIs.

**Interface**:
```typescript
class Component extends HTMLElement {
  private _domCreated: boolean = false;
  private _button: HTMLButtonElement | null = null;
  private _labelEl: HTMLSpanElement | null = null;
  
  private _render(): void {
    if (!this._domCreated) {
      this._createDOM();
      this._domCreated = true;
    } else {
      this._updateDOM();
    }
  }
  
  private _createDOM(): void {
    this._shadowRoot.innerHTML = `
      <style>${styles}</style>
      <button class="component">
        <span class="component__label"></span>
      </button>
    `;
    
    // Cache references
    this._button = this._shadowRoot.querySelector('button');
    this._labelEl = this._shadowRoot.querySelector('.component__label');
    
    // Apply initial state
    this._updateDOM();
  }
  
  private _updateDOM(): void {
    if (!this._button || !this._labelEl) return;
    
    // Direct DOM updates (preserves element identity for CSS transitions)
    this._labelEl.textContent = this.label;
    this._button.style.setProperty('--_comp-hover-bg', this._hoverColor);
    this._button.className = `component ${this._getStateClass()}`;
  }
}
```

### Motion Token Integration

**Pattern**: Reference semantic motion tokens via CSS custom properties.

**CSS**:
```css
.button-cta {
  transition: 
    background-color var(--motion-button-press-duration) var(--motion-button-press-easing),
    border-color var(--motion-button-press-duration) var(--motion-button-press-easing),
    color var(--motion-button-press-duration) var(--motion-button-press-easing);
}
```

**Token Mapping**:
- `motion.buttonPress` → `--motion-button-press-duration`, `--motion-button-press-easing`
- `motion.selectionTransition` → `--motion-selection-transition-duration`, `--motion-selection-transition-easing`
- `motion.floatLabel` → `--motion-float-label-duration`, `--motion-float-label-easing`

---

## Data Models

### CSS Custom Property Naming Convention

**Pattern**: `--_[abbrev]-[property]`

| Component | Abbreviation | Example Properties |
|-----------|--------------|-------------------|
| Button-CTA | `_cta` | `--_cta-hover-bg`, `--_cta-pressed-bg` |
| Button-VerticalListItem | `_vlbi` | `--_vlbi-background`, `--_vlbi-border-color` |
| ButtonIcon | `_bi` | `--_bi-hover-bg`, `--_bi-icon-color` |
| Input-Text-Base | `_itb` | `--_itb-focus-color`, `--_itb-disabled-color` |

### ButtonIcon Token References

**Current (hard-coded)**:
```css
.button-icon--small {
  padding: 8px;
  width: 32px;
  height: 32px;
}
```

**Target (token-referenced)**:
```css
.button-icon--small {
  padding: var(--_bi-inset-small);
  width: var(--_bi-size-small);
  height: var(--_bi-size-small);
}

:host {
  --_bi-inset-small: var(--button-icon-inset-small, 8px);
  --_bi-size-small: var(--button-icon-size-small, 32px);
}
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do.*

### Property 1: Blend Utility Color Consistency

*For any* component using blend utilities, the hover color SHALL be calculated using `hoverColor()` and the pressed color SHALL be calculated using `pressedColor()`, producing mathematically consistent results across all components.

**Validates: Requirements 1.1, 1.2, 1.3, 1.4**

### Property 2: DOM Element Identity Preservation

*For any* component using incremental DOM updates, when an observed attribute changes, the existing DOM elements SHALL be updated in place (not replaced), preserving element identity for CSS transitions.

**Validates: Requirements 2.2, 2.3, 2.5**

### Property 3: Motion Token Semantic Usage

*For any* component with state transitions, the transition timing SHALL be derived from semantic motion tokens (not primitive duration tokens with hard-coded easing).

**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

### Property 4: CSS Custom Property Naming

*For any* component-scoped CSS custom property, the property name SHALL follow the `--_[abbrev]-*` pattern, distinguishing it from design system tokens.

**Validates: Requirements 7.1, 7.2, 7.3, 7.4**

---

## Error Handling

### Blend Utility Initialization

**Scenario**: CSS custom properties not yet loaded when `connectedCallback()` runs.

**Handling**: Use retry pattern with `requestAnimationFrame`:
```typescript
private _calculateBlendColorsWithRetry(): void {
  try {
    this._calculateBlendColors();
  } catch (error) {
    requestAnimationFrame(() => {
      try {
        this._calculateBlendColors();
        this._render();
      } catch (retryError) {
        console.warn('Component: Could not calculate blend colors, using CSS fallbacks', retryError);
      }
    });
  }
}
```

### Missing Token Fallbacks

**Scenario**: Design token CSS custom property is missing.

**Handling**: Provide fallback values in CSS:
```css
:host {
  --_bi-size-small: var(--button-icon-size-small, 32px);
}
```

---

## Testing Strategy

### Test Classification

Following Test Development Standards, tests are classified as Evergreen (permanent) or Temporary (retire after spec completion).

**Evergreen Tests** (maintain indefinitely):
- Blend utility integration tests - verify `hoverColor()` and `pressedColor()` are called and applied
- DOM element identity tests - verify element references persist across attribute changes
- Motion token usage tests - verify semantic tokens are referenced in CSS
- Focus ring accessibility tests - verify WCAG compliance

**Temporary Tests** (retire after spec 040 completion):
- "No `filter: brightness()`" tests - verify migration from CSS filters
- "No hard-coded pixel values" tests - verify ButtonIcon token migration
- "No primitive + hard-coded easing" tests - verify motion token migration

### Web Component Testing Patterns

All web component tests follow established patterns:

```typescript
describe('Component Blend Utility Integration', () => {
  beforeAll(() => {
    if (!customElements.get('button-icon')) {
      customElements.define('button-icon', ButtonIcon);
    }
  });

  beforeEach(async () => {
    await customElements.whenDefined('button-icon');
  });

  it('should apply blend utility hover color', async () => {
    const element = document.createElement('button-icon');
    element.setAttribute('icon', 'settings');
    document.body.appendChild(element);
    
    // Wait for connectedCallback to complete
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Verify blend color is applied via CSS custom property
    const button = element.shadowRoot?.querySelector('button');
    const hoverColor = button?.style.getPropertyValue('--_bi-hover-bg');
    expect(hoverColor).toBeTruthy();
    expect(hoverColor).not.toBe('');
    
    document.body.removeChild(element);
  });
});
```

### Unit Tests

**Blend Utility Integration** (Evergreen):
- Verify `getBlendUtilities()` is called in constructor
- Verify `hoverColor()` and `pressedColor()` are called with correct base color
- Verify calculated colors are applied to CSS custom properties

**DOM Element Identity** (Evergreen):
- Cache element reference before attribute change
- Change attribute
- Verify same element reference after change (not replaced)

**Motion Token Usage** (Evergreen):
- Verify CSS references `--motion-button-press-duration` and `--motion-button-press-easing`
- Verify no primitive tokens with hard-coded easing

### Integration Tests

- Cross-component consistency: verify all button components produce visually similar hover states
- CSS transition functionality: verify transitions animate (not instant) when attributes change

### Temporary Migration Tests

```typescript
/**
 * TEMPORARY TEST - Delete after spec 040 completion
 * Validates ButtonIcon no longer uses filter: brightness()
 */
describe('ButtonIcon Migration Validation', () => {
  it('should not use filter: brightness() for state colors', () => {
    // Inspect generated CSS for filter: brightness() usage
  });
});
```

---

## Design Decisions

### Decision 1: Incremental DOM vs Virtual DOM

**Context**: Components need efficient DOM updates that preserve CSS transitions.

**Options Considered**:
1. Full `innerHTML` replacement (current Button-CTA approach)
2. Incremental DOM with cached references (Button-VerticalListItem approach)
3. Virtual DOM library (lit-html, etc.)

**Decision**: Incremental DOM with cached references

**Rationale**:
- Preserves element identity for CSS transitions
- No external dependencies
- Already proven in Button-VerticalListItem
- Simpler than virtual DOM for component scope

### Decision 2: Blend Utilities vs CSS Filter

**Context**: Components need hover/pressed state color changes.

**Options Considered**:
1. CSS `filter: brightness()` (current ButtonIcon approach)
2. JavaScript blend utilities (Button-CTA approach)
3. CSS color-mix() function

**Decision**: JavaScript blend utilities

**Rationale**:
- Affects only target property (not entire element)
- Cross-platform consistency with iOS/Android
- Uses design system blend tokens
- Already proven in Button-CTA and Input-Text-Base

### Decision 3: CSS Custom Property Naming

**Context**: Need to distinguish component-internal properties from design tokens.

**Options Considered**:
1. `--_[abbrev]-*` (underscore prefix)
2. `--[abbrev]-*` (no underscore)
3. `--[component]-*` (full name)

**Decision**: `--_[abbrev]-*` (underscore prefix)

**Rationale**:
- Underscore signals "private/internal" (programming convention)
- Abbreviation keeps names readable
- Already used by 2 of 4 components
- Clear visual distinction from design tokens

---

## Related Documentation

- [Design Outline](./design-outline.md) - Detailed analysis of each issue area
- [Requirements](./requirements.md) - Formal requirements with acceptance criteria
- [Component Development Guide](/.kiro/steering/Component-Development-Guide.md) - Component architecture patterns
