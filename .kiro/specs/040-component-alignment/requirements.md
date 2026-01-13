# Requirements Document: Component Alignment and Consistency

**Date**: 2026-01-12
**Spec**: 040 - Component Alignment
**Status**: Requirements Phase
**Dependencies**: None

---

## Introduction

This specification addresses architectural inconsistencies across the current component set (Button-CTA, Button-VerticalListItem, ButtonIcon, Input-Text-Base). An audit revealed divergent approaches to state color calculation, DOM update strategies, motion tokens, CSS architecture, and naming conventions. This work unifies these patterns to establish consistent architectural foundations for the design system.

## Glossary

- **Blend_Utilities**: JavaScript functions (`getBlendUtilities()`) that calculate mathematically correct state colors (hover, pressed, disabled) using design tokens
- **Incremental_DOM**: A rendering pattern where initial DOM is created once via `innerHTML`, then subsequent updates modify existing elements directly via DOM APIs
- **Component_Scoped_Property**: A CSS custom property internal to a component (e.g., `--_cta-hover-bg`), distinguished from design system tokens
- **Semantic_Motion_Token**: A motion token that encodes design intent (e.g., `motion.buttonPress`) rather than raw values (e.g., `duration150`)

---

## Requirements

### Requirement 1: Blend Utility Adoption

**User Story:** As a design system maintainer, I want all interactive components to use blend utilities for state colors, so that hover/pressed states are visually consistent across components and platforms.

#### Acceptance Criteria

1. WHEN ButtonIcon renders hover state, THE Blend_Utilities SHALL calculate the hover color using `hoverColor()` function
2. WHEN ButtonIcon renders pressed state, THE Blend_Utilities SHALL calculate the pressed color using `pressedColor()` function
3. WHEN Button-VerticalListItem renders hover state, THE Blend_Utilities SHALL calculate the hover color using `hoverColor()` function
4. WHEN Button-VerticalListItem renders pressed state, THE Blend_Utilities SHALL calculate the pressed color using `pressedColor()` function
5. WHEN blend utilities are adopted, THE Component SHALL NOT use CSS `filter: brightness()` for state color changes
6. WHEN blend colors are calculated, THE Component SHALL apply them via component-scoped CSS custom properties

---

### Requirement 2: Incremental DOM Update Strategy

**User Story:** As a design system maintainer, I want all components to use incremental DOM updates, so that CSS transitions work correctly and rendering performance is optimized.

#### Acceptance Criteria

1. WHEN a component is first connected to DOM, THE Component SHALL create initial DOM structure via `_createDOM()` method
2. WHEN a component's observed attribute changes after initial render, THE Component SHALL update existing DOM elements via `_updateDOM()` method
3. WHEN `_updateDOM()` is called, THE Component SHALL NOT replace `innerHTML` of the shadow root
4. WHEN `_createDOM()` completes, THE Component SHALL cache references to DOM elements that will be updated
5. WHEN DOM element references are cached, THE Component SHALL use direct DOM APIs (e.g., `element.textContent`, `element.style.setProperty()`) for updates
6. IF a component currently uses full `innerHTML` replacement on attribute change, THEN THE Component SHALL be migrated to incremental DOM pattern

---

### Requirement 3: Semantic Motion Token Usage

**User Story:** As a design system maintainer, I want all components to use semantic motion tokens, so that animation timing is consistent and can be updated from a single source.

#### Acceptance Criteria

1. WHEN Button-CTA animates state transitions (hover, pressed), THE Component SHALL use `motion.buttonPress` token for duration and easing
2. WHEN ButtonIcon animates state transitions (hover, pressed), THE Component SHALL use `motion.buttonPress` token for duration and easing
3. WHEN a component uses motion tokens, THE Component SHALL NOT use primitive duration tokens (e.g., `--duration-150`) with hard-coded easing values
4. WHEN a component uses motion tokens, THE Component SHALL reference both duration and easing from the semantic token (e.g., `--motion-button-press-duration`, `--motion-button-press-easing`)

---

### Requirement 4: ButtonIcon Directory Rename

**User Story:** As a design system maintainer, I want ButtonIcon to follow Stemma System naming conventions, so that component naming is consistent across the codebase.

#### Acceptance Criteria

1. WHEN ButtonIcon is referenced, THE Directory SHALL be named `Button-Icon` (with hyphen) following Stemma `[Family]-[Type]` convention
2. WHEN the directory is renamed, THE Component SHALL update all internal import paths
3. WHEN the directory is renamed, THE Component SHALL update the custom element tag name if it differs from convention
4. WHEN the directory is renamed, THE Component SHALL maintain backwards compatibility via re-exports from the old path (optional, since no external consumers)

---

### Requirement 5: CSS Architecture Standardization

**User Story:** As a design system maintainer, I want all components to use external CSS files, so that styles benefit from syntax highlighting, CSS tooling, and consistent architecture.

#### Acceptance Criteria

1. WHEN ButtonIcon defines styles, THE Component SHALL import styles from an external `.css` file
2. WHEN Input-Text-Base defines styles, THE Component SHALL import styles from an external `.css` file
3. WHEN a component imports CSS, THE Component SHALL use the esbuild CSS-as-string plugin pattern
4. WHEN a component has inline `getStyles()` or `_generateStyles()` methods, THE Component SHALL extract styles to external CSS file

---

### Requirement 6: Hard-Coded Value Elimination

**User Story:** As a design system maintainer, I want ButtonIcon to use CSS custom property references instead of hard-coded values, so that sizing can be themed and maintained via tokens.

#### Acceptance Criteria

1. WHEN ButtonIcon defines size dimensions, THE Component SHALL reference CSS custom properties (e.g., `var(--button-icon-size-small)`)
2. WHEN ButtonIcon defines padding values, THE Component SHALL reference CSS custom properties (e.g., `var(--button-icon-inset-small)`)
3. WHEN ButtonIcon CSS is updated, THE Component SHALL NOT contain hard-coded pixel values for sizing or spacing

---

### Requirement 7: CSS Custom Property Naming Convention

**User Story:** As a design system maintainer, I want all components to use consistent CSS custom property naming, so that component-internal properties are clearly distinguished from design system tokens.

#### Acceptance Criteria

1. WHEN a component defines internal CSS custom properties, THE Component SHALL use the `--_[abbrev]-*` naming pattern
2. WHEN Button-VerticalListItem defines internal properties, THE Component SHALL use `--_vlbi-*` prefix (migrated from `--vlbi-*`)
3. WHEN ButtonIcon defines internal properties, THE Component SHALL use `--_bi-*` prefix (migrated from `--button-icon-*`)
4. WHEN naming component-scoped properties, THE Component SHALL use underscore prefix to signal "internal/private" semantics

---

### Requirement 8: Focus Ring Consistency

**User Story:** As a design system maintainer, I want all interactive components to implement focus rings consistently, so that keyboard navigation has uniform visual feedback.

#### Acceptance Criteria

1. WHEN a component receives keyboard focus, THE Component SHALL display focus ring using `--accessibility-focus-*` tokens
2. WHEN implementing focus ring, THE Component SHALL use CSS `outline` property (not `box-shadow` alone)
3. WHEN focus ring is displayed, THE Component SHALL use `outline-offset` from accessibility tokens
4. WHEN focus ring styling differs between components, THE Component SHALL be updated to match the standardized pattern

---

### Requirement 9: Component Development Standards Documentation

**User Story:** As a design system maintainer, I want the Component Development Guide to document blend utility usage and incremental DOM patterns, so that future component development follows established architectural patterns.

#### Acceptance Criteria

1. WHEN the Component Development Guide is updated, THE Documentation SHALL include a section on blend utility usage for state colors
2. WHEN documenting blend utilities, THE Documentation SHALL explain why `getBlendUtilities()` is preferred over CSS `filter: brightness()`
3. WHEN documenting blend utilities, THE Documentation SHALL reference Button-CTA as the canonical implementation example
4. WHEN the Component Development Guide is updated, THE Documentation SHALL include a section on incremental DOM update pattern
5. WHEN documenting incremental DOM, THE Documentation SHALL explain the `_createDOM()` + `_updateDOM()` architecture
6. WHEN documenting incremental DOM, THE Documentation SHALL explain why this pattern preserves CSS transitions
7. WHEN documenting incremental DOM, THE Documentation SHALL reference Button-VerticalListItem as the canonical implementation example
8. WHEN the Component Development Guide is updated, THE Documentation SHALL include guidance on CSS custom property naming (`--_[abbrev]-*` pattern)

---

## Related Documentation

- [Design Outline](./design-outline.md) - Detailed analysis of each issue area
- [Component Development Guide](/.kiro/steering/Component-Development-Guide.md) - Component architecture patterns
- [Token Governance](/.kiro/steering/Token-Governance.md) - Token selection and usage guidelines
