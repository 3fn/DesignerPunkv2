# Design Outline: Component Alignment and Consistency

**Date**: 2026-01-12
**Purpose**: Capture alignment opportunities and consistency issues across the current component set
**Organization**: spec-guide
**Scope**: 040-component-alignment
**Status**: Draft

---

## Executive Summary

An audit of the current component set (Button-CTA, Button-VerticalListItem, ButtonIcon, Input-Text-Base, Icon-Base, Container-Base) revealed several alignment opportunities and consistency issues. This design outline captures these findings to inform future spec work.

---

## 1. Naming Convention Inconsistency

### Issue

The Stemma System naming convention is `[Family]-[Type]` with hyphens, but one component doesn't follow this pattern:

| Component | Directory | Stemma Name | Consistent? |
|-----------|-----------|-------------|-------------|
| Button-CTA | `Button-CTA/` | Button-CTA | ✅ |
| Button-VerticalListItem | `Button-VerticalListItem/` | Button-VerticalListItem | ✅ |
| Icon-Base | `Icon-Base/` | Icon-Base | ✅ |
| Input-Text-Base | `Input-Text-Base/` | Input-Text-Base | ✅ |
| Container-Base | `Container-Base/` | Container-Base | ✅ |
| **ButtonIcon** | `ButtonIcon/` | Button-Icon | ❌ |

### Evidence

The code comments in `ButtonIcon.web.ts` explicitly state:
```
Stemma System Naming: [Family]-[Type] = Button-Icon
```

But the directory is `ButtonIcon/` without the hyphen.

### Impact

- **Breaking change** for consumers importing from `ButtonIcon/`
- Inconsistent discoverability in file system
- Confusion for AI agents and developers

### Recommendation

Rename `ButtonIcon/` to `Button-Icon/` with proper migration path:
1. Create new `Button-Icon/` directory
2. Update all imports
3. Update custom element registration (if tag name changes)
4. Deprecate old path with re-export

---

## 2. State Color Calculation Inconsistency

### Issue

Components use different approaches for calculating hover/pressed state colors:

| Component | Approach | Consistent with Design System? |
|-----------|----------|-------------------------------|
| Button-CTA | `getBlendUtilities()` → JS-calculated colors | ✅ Correct |
| Input-Text-Base | `getBlendUtilities()` → JS-calculated colors | ✅ Correct |
| Button-VerticalListItem | CSS `filter: brightness(0.95)` | ❌ Inconsistent |
| ButtonIcon | CSS `filter: brightness(0.92)` | ❌ Inconsistent |

### Evidence

**Button-CTA (correct approach):**
```typescript
this._hoverColor = this._blendUtils.hoverColor(primaryColor);
this._pressedColor = this._blendUtils.pressedColor(primaryColor);
```

**ButtonIcon (inconsistent approach):**
```css
.button-icon--primary:hover {
  filter: brightness(0.92);
}
```

**Button-VerticalListItem (inconsistent approach):**
```css
.vertical-list-item:hover {
  filter: brightness(var(--vlbi-hover-brightness)); /* 0.95 */
}
```

### Why Blend Utilities are Correct

1. **`filter: brightness()` affects the entire element.** It darkens background, text, icons, borders - everything. Blend utilities calculate a mathematically correct color shift for just the target property (e.g., background color only).

2. **Cross-platform consistency.** iOS and Android implementations use blend utilities. Web using `filter: brightness()` produces visually different results for the same component.

3. **Token system alignment.** The design system has `blend.hoverDarker` (8%) and `blend.pressedDarker` (12%) tokens. Blend utilities use these tokens. `filter: brightness(0.92)` is a magic number that bypasses the token system.

4. **Theming support.** To change hover darkness from 8% to 10%, with blend utilities you update one token. With `filter: brightness()`, you hunt through CSS files.

### Recommendation

Migrate Button-VerticalListItem and ButtonIcon to use `getBlendUtilities()`:
1. Import `getBlendUtilities` from `blend/ThemeAwareBlendUtilities.web`
2. Initialize blend utilities in constructor
3. Calculate state colors in `connectedCallback()` from CSS custom properties
4. Apply calculated colors via component-scoped CSS custom properties
5. Remove `filter: brightness()` usage from CSS

---

## 3. Animation/Motion Token Inconsistency

### Issue

Components use different approaches for animation timing:

| Component | Animation Approach | Uses Semantic Motion Token? |
|-----------|-------------------|----------------------------|
| Button-CTA | `var(--duration-150) ease-in-out` | ❌ Primitive + hard-coded easing |
| Button-VerticalListItem | `var(--motion-selection-transition-*)` | ✅ Semantic token |
| Input-Text-Base | `var(--motion-float-label-*)` | ✅ Semantic token |
| ButtonIcon | `var(--duration-150)` | ❌ Primitive only |

### Evidence

**Button-CTA CSS:**
```css
transition: background-color var(--duration-150) ease-in-out,
            border-color var(--duration-150) ease-in-out,
            ...
```

**Button-VerticalListItem CSS (correct):**
```css
--vlbi-transition-duration: var(--motion-selection-transition-duration);
--vlbi-transition-easing: var(--motion-selection-transition-easing);
```

### Available Semantic Motion Tokens

```typescript
'motion.floatLabel'          // duration250 + easingStandard - Label position/style animations
'motion.focusTransition'     // duration150 + easingStandard - Focus ring appearance
'motion.buttonPress'         // duration150 + easingAccelerate - Simple button feedback (hover/press)
'motion.modalSlide'          // duration350 + easingDecelerate - Modal/overlay entrance
'motion.selectionTransition' // duration250 + easingStandard - Selection state changes
```

### Motion Token Selection Guidelines

**Use `motion.buttonPress`** for simple interactive feedback:
- Hover state color changes
- Press/active state feedback
- Simple buttons without selection semantics (Button-CTA, ButtonIcon)
- Characteristics: Fast (150ms), accelerating easing for responsive feel

**Use `motion.selectionTransition`** for selection state changes:
- Components with selected/unselected states
- Multi-step selection flows
- Components that persist a selection (Button-VerticalListItem, checkboxes, radio buttons)
- Characteristics: Slightly slower (250ms), standard easing for deliberate feel

**Use `motion.floatLabel`** for form input animations:
- Label position transitions
- Input state changes
- Form validation feedback

### Recommendation

1. Update Button-CTA to use `motion.buttonPress` (replace primitive + hard-coded easing)
2. Update ButtonIcon to use `motion.buttonPress` (replace primitive only)
3. Keep Button-VerticalListItem using `motion.selectionTransition` (already correct)
4. Keep Input-Text-Base using `motion.floatLabel` (already correct)

---

## 4. CSS Architecture Inconsistency

### Issue

Components use different approaches for CSS:

| Component | CSS Approach |
|-----------|--------------|
| Button-CTA | External `.css` file imported as string via esbuild plugin |
| Button-VerticalListItem | External `.css` file imported as string via esbuild plugin |
| Input-Text-Base | Inline `getStyles()` method returning CSS string |
| ButtonIcon | Inline `_generateStyles()` method returning CSS string |

### Impact

- **Maintainability**: Inline CSS is harder to edit (no syntax highlighting, no CSS tooling)
- **Bundle size**: Inline CSS can't be deduplicated or optimized by CSS tools
- **Consistency**: Different patterns for same problem

### Recommendation

Standardize on external CSS files with esbuild plugin import:
1. Extract Input-Text-Base styles to `InputTextBase.web.css`
2. Extract ButtonIcon styles to `ButtonIcon.web.css`
3. Update imports to use CSS-as-string pattern

---

## 5. Hard-Coded Values in ButtonIcon

### Issue

ButtonIcon has hard-coded pixel values instead of CSS custom property references:

```css
.button-icon--small {
  padding: 8px; /* buttonIcon.inset.small */
  width: 32px; /* buttonIcon.size.small */
  height: 32px;
  min-width: 32px;
  min-height: 32px;
}
```

### Impact

- **Theming**: Values can't be overridden via CSS custom properties
- **Consistency**: Other components use token references
- **Maintainability**: Changes require code edits, not token updates

### Recommendation

Replace hard-coded values with CSS custom property references:
```css
.button-icon--small {
  padding: var(--button-icon-inset-small);
  width: var(--button-icon-size-small);
  height: var(--button-icon-size-small);
  ...
}
```

---

## 6. DOM Update Strategy Inconsistency

### Issue

Components use different rendering strategies:

| Component | Render Strategy | CSS Transition Support |
|-----------|----------------|------------------------|
| Button-CTA | Full `innerHTML` replacement | ⚠️ May break transitions |
| Button-VerticalListItem | Incremental DOM updates | ✅ Preserves element identity |
| Input-Text-Base | Full `innerHTML` + manual updates | Mixed |
| ButtonIcon | Full `innerHTML` replacement | ⚠️ May break transitions |

### Evidence

**Button-VerticalListItem (correct approach):**
```typescript
private _render(): void {
  if (!this._domCreated) {
    this._createDOM();
    this._domCreated = true;
  } else {
    this._updateDOM(); // Incremental update
  }
}
```

**Button-CTA (problematic approach):**
```typescript
private render(): void {
  this._shadowRoot.innerHTML = `...`; // Full replacement every time
}
```

### Why Button-VerticalListItem's Pattern is Correct

The pattern uses `innerHTML` **once** for initial DOM creation, then **direct DOM APIs** for updates. This is the right balance because:

1. **CSS transitions require element identity.** When `innerHTML` replaces the DOM, the browser destroys and recreates elements. CSS transitions animate between states of the *same* element - if the element is destroyed, there's nothing to animate. The incremental pattern preserves element references, so `transition: background-color 150ms` actually works.

2. **Event listeners stay attached.** Full `innerHTML` replacement requires re-attaching event listeners after every render. The incremental pattern attaches once in `_createDOM()`.

3. **Performance.** Full `innerHTML` triggers HTML parsing + full layout recalculation. Direct property updates (`element.style.setProperty()`, `element.textContent`) are significantly cheaper.

4. **Initial `innerHTML` is acceptable.** Using `innerHTML` once for the initial structure is fine - it's readable and only happens once. The problem is using it on *every* attribute change.

### The Pattern

```typescript
// 1. Create DOM once with innerHTML (acceptable)
private _createDOM(): void {
  this._shadowRoot.innerHTML = `<style>...</style><button>...</button>`;
  
  // 2. Cache element references
  this._button = this._shadowRoot.querySelector('button');
  this._labelEl = this._shadowRoot.querySelector('.label');
}

// 3. Update via direct DOM APIs (preserves element identity)
private _updateDOM(): void {
  this._labelEl.textContent = this.label;
  this._button.style.setProperty('--background', color);
  this._button.className = `button ${stateClass}`;
}
```

### Recommendation

Adopt Button-VerticalListItem's incremental update pattern for all components:
1. `_createDOM()` - uses `innerHTML` once for initial structure
2. Cache DOM element references after creation
3. `_updateDOM()` - uses direct DOM APIs for property updates
4. Route through `_render()` which checks `_domCreated` flag

---

## 7. Focus Ring Implementation Inconsistency

### Issue

Components implement focus rings differently:

| Component | Focus Ring Implementation |
|-----------|--------------------------|
| Button-CTA | Outline + `box-shadow: var(--shadow-hover)` |
| Button-VerticalListItem | Outline only |
| Input-Text-Base | Outline with transition |
| ButtonIcon | Outline only |

### Impact

- **Visual inconsistency**: Focus states look different across components
- **Accessibility**: Different visual weight for focus indicators

### Recommendation

Standardize focus ring implementation:
1. Use outline for all components
2. Consistent use of `--accessibility-focus-*` tokens
3. Optional shadow for elevation (document when to use)

---

## 8. CSS Custom Property Naming Convention

### Issue

Components use different prefixes for component-scoped CSS custom properties:

| Component | Prefix Pattern |
|-----------|---------------|
| Button-CTA | `--_cta-*` (underscore prefix) |
| Button-VerticalListItem | `--vlbi-*` (no underscore) |
| Input-Text-Base | `--_itb-*` (underscore prefix) |
| ButtonIcon | `--button-icon-*` (full name, no underscore) |

### Why This Matters

Component-scoped CSS custom properties serve a different purpose than design system tokens:
- **Design system tokens** (`--color-primary`, `--space-inset-200`): Shared across all components, part of the public API
- **Component-scoped properties** (`--_cta-hover-bg`): Internal to one component, calculated values or local overrides

Without a clear naming convention, it's difficult to distinguish at a glance whether a property is:
- Safe to override externally (design token)
- Internal implementation detail (component-scoped)

### Recommendation: `--_[abbrev]-*` Pattern

Standardize on the underscore-prefixed abbreviation pattern:

```css
/* Component-scoped (internal) */
--_cta-hover-bg: #...;      /* Button-CTA internal */
--_vlbi-background: #...;   /* Button-VerticalListItem internal */
--_itb-focus-color: #...;   /* Input-Text-Base internal */
--_bi-icon-color: #...;     /* ButtonIcon internal */

/* Design system tokens (external) */
--color-primary: #...;
--motion-button-press-duration: 150ms;
```

**Rationale:**
1. **Underscore signals "private"** - Borrowed from programming conventions, the leading underscore indicates "internal implementation detail, don't depend on this externally"
2. **Abbreviation keeps names short** - Component names can be long; abbreviations keep CSS readable
3. **Already used by majority** - Button-CTA and Input-Text-Base already use this pattern (2 of 4 components)
4. **Clear visual distinction** - Easy to scan CSS and identify which properties are component-internal vs design tokens

### Migration Required

| Component | Current | Target |
|-----------|---------|--------|
| Button-CTA | `--_cta-*` | ✅ No change |
| Input-Text-Base | `--_itb-*` | ✅ No change |
| Button-VerticalListItem | `--vlbi-*` | `--_vlbi-*` |
| ButtonIcon | `--button-icon-*` | `--_bi-*` |

---

## Priority Matrix

| Priority | Issue | Impact | Effort | Component(s) |
|----------|-------|--------|--------|--------------|
| 1 | Blend utility adoption | High (visual consistency) | Medium | ButtonIcon, Button-VerticalListItem |
| 2 | DOM update strategy | Medium (transitions, perf) | Medium | ButtonIcon, Button-CTA |
| 3 | Motion token standardization | Medium (animation) | Low | Button-CTA, ButtonIcon |
| 4 | ButtonIcon → Button-Icon rename | Medium (naming) | Low | ButtonIcon |
| 5 | Hard-coded values | Low (maintainability) | Low | ButtonIcon |
| 6 | CSS architecture (external files) | Low (internal) | Medium | ButtonIcon, Input-Text-Base |
| 7 | CSS property naming | Low (internal) | Low | Button-VerticalListItem, ButtonIcon |
| 8 | Focus ring consistency | Low (visual) | Low | All |

**Note:** All issues will be addressed in a single spec (040-component-alignment). Priority indicates implementation order within the spec.

---

## Recommended Spec Breakdown

### Single Spec: Component Alignment (040-component-alignment)

Since breaking changes are acceptable (no external consumers yet), all alignment work can be consolidated into a single spec organized by component:

#### 1. ButtonIcon Alignment
- Rename directory from `ButtonIcon/` to `Button-Icon/` (Stemma naming)
- Migrate to blend utilities (replace `filter: brightness()`)
- Migrate to incremental DOM updates (`_createDOM` + `_updateDOM` pattern)
- Replace hard-coded pixel values with CSS custom property references
- Add `motion.buttonPress` token for state transitions
- Extract inline CSS to external `.css` file
- Update CSS property prefix to `--_bi-*`

#### 2. Button-VerticalListItem Alignment
- Migrate to blend utilities (replace `filter: brightness()`)
- Update CSS property prefix from `--vlbi-*` to `--_vlbi-*`
- (DOM pattern already correct - no changes needed)
- (Motion token already correct - `motion.selectionTransition`)

#### 3. Button-CTA Alignment
- Migrate to incremental DOM updates (`_createDOM` + `_updateDOM` pattern)
- Add `motion.buttonPress` token for state transitions (replace primitive `--duration-150`)
- (Blend utilities already correct - no changes needed)
- (CSS property prefix already correct - `--_cta-*`)

#### 4. Input-Text-Base Alignment
- Extract inline CSS (`getStyles()`) to external `.css` file
- Consider incremental DOM refinement (partial implementation exists)
- (Blend utilities already correct - no changes needed)
- (Motion token already correct - `motion.floatLabel`)
- (CSS property prefix already correct - `--_itb-*`)

#### 5. Cross-Component Standards
- Standardize focus ring implementation
- Update Component Development Guide with architectural patterns

### Unified Direction Summary

| Issue Area | Unified Direction | Reference Implementation |
|------------|------------------|-------------------------|
| State colors | `getBlendUtilities()` | Button-CTA, Input-Text-Base |
| DOM updates | `_createDOM` + `_updateDOM` | Button-VerticalListItem |
| Motion tokens (simple buttons) | `motion.buttonPress` | (to be implemented) |
| Motion tokens (selection) | `motion.selectionTransition` | Button-VerticalListItem |
| Motion tokens (form inputs) | `motion.floatLabel` | Input-Text-Base |
| CSS architecture | External `.css` files | Button-CTA, Button-VerticalListItem |
| CSS property naming | `--_[abbrev]-*` pattern | Button-CTA, Input-Text-Base |
| Focus rings | Outline + accessibility tokens | All components |

---

## Related Documentation

- [Component Development Guide](/.kiro/steering/Component-Development-Guide.md)
- [Token Governance](/.kiro/steering/Token-Governance.md)
- [Stemma System Architecture](/.kiro/steering/Rosetta-System-Architecture.md)

---

*This design outline captures findings from a component alignment audit conducted on 2026-01-12.*
