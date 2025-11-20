# Requirements Document: Icon Web Component Conversion

**Date**: November 19, 2025
**Spec**: 008 - Icon Web Component Conversion
**Status**: Requirements Phase
**Dependencies**: Spec 004 (Icon System)

---

## Introduction

The Icon Web Component Conversion updates the Icon component's web platform implementation to use Vanilla Web Components while maintaining backward compatibility with the existing functional API. This conversion establishes architectural consistency across all web components (following the pattern established by ButtonCTA in Spec 005) and enables proper Web Component composition patterns.

The conversion maintains the existing `createIcon()` functional API for backward compatibility while adding a new `<dp-icon>` custom element that provides the same functionality through a Web Component interface. This dual API approach ensures no breaking changes while enabling modern component composition patterns.

**Key Architectural Principles**:
- **Backward Compatibility**: Existing `createIcon()` functional API remains unchanged
- **Dual API Approach**: Both functional and Web Component APIs available
- **Architectural Consistency**: All web components use Vanilla Web Components pattern
- **Shadow DOM Encapsulation**: Styles and markup encapsulated within Shadow DOM
- **Color Inheritance**: currentColor inheritance works through Shadow DOM boundary

---

## Glossary

- **Vanilla Web Component**: Custom element extending HTMLElement without framework dependencies
- **Shadow DOM**: Encapsulated DOM tree attached to custom element for style isolation
- **Dual API**: Two interfaces (functional and Web Component) providing same functionality
- **Custom Element**: User-defined HTML element registered with customElements.define()
- **Functional API**: Function-based interface (createIcon()) returning HTML strings
- **Web Component API**: Custom element interface (<dp-icon>) with attributes and properties
- **Backward Compatibility**: Existing code continues working without modifications
- **Component Composition**: Web Components containing other Web Components

---

## Requirements

### Requirement 1: Web Component Implementation

**User Story**: As a developer, I want the Icon component available as a Vanilla Web Component, so that I can compose icons within other Web Components using standard HTML syntax.

#### Acceptance Criteria

1. WHEN the Icon Web Component is registered THEN the system SHALL define a custom element named "dp-icon"
2. WHEN the Icon Web Component is instantiated THEN the Icon Web Component SHALL extend HTMLElement
3. WHEN the Icon Web Component is instantiated THEN the Icon Web Component SHALL attach Shadow DOM with mode "open"
4. WHEN the Icon Web Component renders THEN the Icon Web Component SHALL use the existing loadIconSVG() function for SVG content
5. WHEN the Icon Web Component renders THEN the Icon Web Component SHALL generate SVG with currentColor for stroke inheritance

### Requirement 2: Attribute-Based API

**User Story**: As a developer, I want to configure icons using HTML attributes, so that I can declaratively specify icon properties in markup.

#### Acceptance Criteria

1. WHEN the Icon Web Component defines observed attributes THEN the Icon Web Component SHALL observe "name", "size", "color", and "test-id" attributes
2. WHEN the "name" attribute changes THEN the Icon Web Component SHALL re-render with the new icon
3. WHEN the "size" attribute changes THEN the Icon Web Component SHALL re-render with the new size
4. WHEN the "color" attribute changes THEN the Icon Web Component SHALL re-render with the new color
5. WHEN the "test-id" attribute changes THEN the Icon Web Component SHALL update the data-testid attribute

### Requirement 3: Property-Based API

**User Story**: As a developer, I want to configure icons using JavaScript properties, so that I can programmatically control icon properties.

#### Acceptance Criteria

1. WHEN the Icon Web Component exposes properties THEN the Icon Web Component SHALL provide name, size, color, and testID properties
2. WHEN a property is set via JavaScript THEN the Icon Web Component SHALL update the corresponding attribute
3. WHEN a property is read via JavaScript THEN the Icon Web Component SHALL return the current attribute value
4. WHEN the Icon Web Component renders THEN the Icon Web Component SHALL use property values with appropriate defaults (size: 24, color: 'inherit')

### Requirement 4: Shadow DOM Styling

**User Story**: As a developer, I want icon styles encapsulated in Shadow DOM, so that icon styling doesn't conflict with page styles.

#### Acceptance Criteria

1. WHEN the Icon Web Component renders THEN the Icon Web Component SHALL inject styles into Shadow DOM
2. WHEN the Icon Web Component renders THEN the Icon Web Component SHALL use :host selector for component-level styling
3. WHEN the Icon Web Component renders THEN the Icon Web Component SHALL set display: inline-flex on :host
4. WHEN the Icon Web Component renders THEN the Icon Web Component SHALL center content using align-items and justify-content

### Requirement 5: Color Inheritance Through Shadow DOM

**User Story**: As a developer, I want icons to inherit color from parent elements, so that icon color automatically matches surrounding text without manual specification.

#### Acceptance Criteria

1. WHEN the Icon Web Component renders with color="inherit" THEN the Icon Web Component SHALL use currentColor for SVG stroke
2. WHEN the Icon Web Component renders with color token reference THEN the Icon Web Component SHALL use var(--{token-name}) for SVG stroke
3. WHEN the Icon Web Component is placed in colored context THEN the Icon Web Component SHALL inherit color through Shadow DOM boundary
4. WHEN the Icon Web Component color attribute is omitted THEN the Icon Web Component SHALL default to "inherit" behavior

### Requirement 6: Backward Compatibility

**User Story**: As a developer with existing code using createIcon(), I want the functional API to remain unchanged, so that my existing code continues working without modifications.

#### Acceptance Criteria

1. WHEN the Icon module is imported THEN the Icon module SHALL export the createIcon() function unchanged
2. WHEN createIcon() is called THEN createIcon() SHALL return HTML string as before
3. WHEN existing code uses createIcon() THEN existing code SHALL work without modifications
4. WHEN the Icon Web Component is added THEN the Icon Web Component SHALL NOT break existing createIcon() usage

### Requirement 7: Component Lifecycle

**User Story**: As a developer, I want the Icon Web Component to follow standard Web Component lifecycle, so that icons render correctly and clean up properly.

#### Acceptance Criteria

1. WHEN the Icon Web Component is added to DOM THEN the Icon Web Component SHALL call connectedCallback() and render
2. WHEN the Icon Web Component is removed from DOM THEN the Icon Web Component SHALL call disconnectedCallback()
3. WHEN an observed attribute changes THEN the Icon Web Component SHALL call attributeChangedCallback() and re-render
4. WHEN the Icon Web Component re-renders THEN the Icon Web Component SHALL update Shadow DOM content

### Requirement 8: Integration with ButtonCTA

**User Story**: As a developer implementing ButtonCTA, I want to use the Icon Web Component within ButtonCTA's Shadow DOM, so that button icons are properly encapsulated.

#### Acceptance Criteria

1. WHEN ButtonCTA renders with icon prop THEN ButtonCTA SHALL use <dp-icon> custom element
2. WHEN ButtonCTA renders icon THEN ButtonCTA SHALL pass icon name via name attribute
3. WHEN ButtonCTA renders icon THEN ButtonCTA SHALL pass icon size via size attribute
4. WHEN ButtonCTA renders icon THEN ButtonCTA SHALL pass color="inherit" for color inheritance
5. WHEN ButtonCTA renders icon THEN ButtonCTA SHALL mark icon as decorative with aria-hidden="true"

---

## Architecture

### Dual API Approach

The Icon component provides two interfaces for maximum flexibility:

**Functional API (Existing)**:
```typescript
// Returns HTML string for direct insertion
const iconHTML = createIcon({ name: 'arrow-right', size: 24 });
element.innerHTML = iconHTML;
```

**Web Component API (New)**:
```html
<!-- Declarative HTML usage -->
<dp-icon name="arrow-right" size="24" color="inherit"></dp-icon>
```

```typescript
// Programmatic usage
const icon = document.createElement('dp-icon');
icon.name = 'arrow-right';
icon.size = 24;
document.body.appendChild(icon);
```

### Component Structure

```
src/components/core/Icon/platforms/web/
├── Icon.web.ts              # Updated with Web Component class
└── (no CSS file needed)     # Styles injected in Shadow DOM
```

### Implementation Strategy

1. **Keep Existing Code**: `createIcon()` and `loadIconSVG()` remain unchanged
2. **Add Web Component Class**: New `IconElement` class extending HTMLElement
3. **Reuse Existing Logic**: Web Component uses `createIcon()` internally
4. **Register Custom Element**: `customElements.define('dp-icon', IconElement)`

### Shadow DOM Structure

```html
<dp-icon name="arrow-right" size="24">
  #shadow-root (open)
    <style>
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
    </style>
    <svg width="24" height="24" ...>
      <!-- SVG content from loadIconSVG() -->
    </svg>
</dp-icon>
```

### Color Inheritance Mechanism

**Challenge**: Shadow DOM creates style boundary
**Solution**: Use currentColor in SVG, which inherits through Shadow DOM

```typescript
// Parent element sets color
<div style="color: blue;">
  <dp-icon name="check"></dp-icon>  <!-- Icon inherits blue -->
</div>

// SVG uses currentColor
<svg stroke="currentColor">...</svg>  // Inherits from parent
```

---

## Dependencies

### Spec 004: Icon System

**Status**: ✅ Complete  
**Provides**: 
- Icon type definitions (IconName, IconProps)
- SVG content mapping (loadIconSVG function)
- Functional API (createIcon function)

**Required For**:
- Web Component reuses existing icon infrastructure
- No changes needed to Spec 004 implementation

### Spec 005: CTA Button Component

**Status**: ⏳ In Progress (Tasks 1-2 complete, Task 3.3 pending)  
**Dependency**: Task 3.3 (Icon Integration) depends on this spec

**Integration Point**:
- ButtonCTA Task 3.3 will use `<dp-icon>` Web Component
- Establishes component composition pattern
- Validates Web Component integration

---

## Migration Strategy

### Phase 1: Add Web Component (This Spec)
- Implement `IconElement` class
- Register `<dp-icon>` custom element
- Keep `createIcon()` functional API
- Both APIs available

### Phase 2: Update ButtonCTA (Spec 005, Task 3.3)
- Use `<dp-icon>` in ButtonCTA Shadow DOM
- Validate component composition pattern
- Document integration approach

### Phase 3: Future Components
- New components use `<dp-icon>` Web Component API
- Existing code using `createIcon()` continues working
- Gradual migration as components are updated

---

*This requirements document provides EARS-format requirements for converting the Icon component to a Vanilla Web Component while maintaining backward compatibility through a dual API approach.*
