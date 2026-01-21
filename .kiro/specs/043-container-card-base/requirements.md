# Requirements Document: Container-Card-Base Component

**Date**: January 20, 2026
**Spec**: 043 - Container-Card-Base
**Status**: Requirements Phase
**Dependencies**: Container-Base (existing component)

---

## Introduction

Container-Card-Base is a type primitive component within the Containers family that provides card-specific styling and behaviors. It exposes a curated subset of Container-Base's props appropriate for card use cases, serving as the foundation for content-format semantic variants.

This spec also includes enhancements to Container-Base (directional padding, border color) that Container-Card-Base will expose.

---

## Requirements

### Requirement 1: Container-Base Directional Padding Enhancement

**User Story**: As a developer, I want to set vertical and horizontal padding independently (and individual edges when needed), so that I can balance content layouts, typography with different line-heights, and asymmetric designs like image-bleeding cards.

#### Acceptance Criteria

1. WHEN `paddingVertical` is specified THEN Container-Base SHALL apply the value to block-start and block-end padding
2. WHEN `paddingHorizontal` is specified THEN Container-Base SHALL apply the value to inline-start and inline-end padding
3. WHEN `paddingBlockStart` is specified THEN Container-Base SHALL apply the value to block-start padding only
4. WHEN `paddingBlockEnd` is specified THEN Container-Base SHALL apply the value to block-end padding only
5. WHEN `paddingInlineStart` is specified THEN Container-Base SHALL apply the value to inline-start padding only
6. WHEN `paddingInlineEnd` is specified THEN Container-Base SHALL apply the value to inline-end padding only
7. WHEN both `padding` and axis props are specified THEN axis props SHALL override the corresponding sides from `padding`
8. WHEN both axis props and individual edge props are specified THEN individual edge props SHALL override the corresponding axis prop
9. WHEN only `padding` is specified THEN Container-Base SHALL apply uniform padding to all sides
10. WHEN web platform renders padding THEN Container-Base SHALL use CSS logical properties (`padding-block`, `padding-inline`, `padding-block-start`, etc.)

---

### Requirement 2: Container-Base Border Color Enhancement

**User Story**: As a developer, I want to specify border color separately from border width, so that I can customize card borders without creating new variants.

#### Acceptance Criteria

1. WHEN `borderColor` is specified THEN Container-Base SHALL apply the specified color token to the border
2. WHEN `border` is `'none'` THEN `borderColor` SHALL have no visible effect
3. WHEN `border` is specified without `borderColor` THEN Container-Base SHALL use `color.border.default`

---

### Requirement 3: Container-Card-Base Curated Props Subset

**User Story**: As a developer, I want Container-Card-Base to expose only card-appropriate props and values, so that I can build consistent cards without needing to know the full Container-Base API.

#### Acceptance Criteria

1. WHEN Container-Card-Base is used THEN it SHALL expose only the following padding values: `'none' | '100' | '150' | '200'`
2. WHEN Container-Card-Base is used THEN it SHALL expose only the following paddingVertical values: `'none' | '050' | '100' | '150' | '200'`
3. WHEN Container-Card-Base is used THEN it SHALL expose only the following paddingHorizontal values: `'none' | '100' | '150' | '200'`
4. WHEN Container-Card-Base is used THEN it SHALL expose only the following paddingBlockStart values: `'none' | '050' | '100' | '150' | '200'`
5. WHEN Container-Card-Base is used THEN it SHALL expose only the following paddingBlockEnd values: `'none' | '050' | '100' | '150' | '200'`
6. WHEN Container-Card-Base is used THEN it SHALL expose only the following paddingInlineStart values: `'none' | '100' | '150' | '200'`
7. WHEN Container-Card-Base is used THEN it SHALL expose only the following paddingInlineEnd values: `'none' | '100' | '150' | '200'`
8. WHEN Container-Card-Base is used THEN it SHALL expose only surface background colors: `'surface.primary' | 'surface.secondary' | 'surface.tertiary'`
9. WHEN Container-Card-Base is used THEN it SHALL expose only container shadow values: `'none' | 'container'`
10. WHEN Container-Card-Base is used THEN it SHALL expose only subtle border values: `'none' | 'default'`
11. WHEN Container-Card-Base is used THEN it SHALL expose only card-appropriate border colors: `'border.default' | 'border.subtle'`
12. WHEN Container-Card-Base is used THEN it SHALL expose only rounded radius values: `'normal' | 'loose'`
13. WHEN Container-Card-Base is used THEN it SHALL expose only card-appropriate semantic elements: `'div' | 'section' | 'article'`
14. WHEN Container-Card-Base is used THEN it SHALL NOT expose `opacity`, `layering`, `ignoresSafeArea`, or `hoverable` props

---

### Requirement 4: Container-Card-Base Opinionated Defaults

**User Story**: As a developer, I want Container-Card-Base to render a good-looking card with zero configuration, so that I can quickly prototype and build consistent UIs.

#### Acceptance Criteria

1. WHEN Container-Card-Base is rendered without props THEN it SHALL use `padding: '150'`
2. WHEN Container-Card-Base is rendered without props THEN it SHALL use `background: 'surface.primary'`
3. WHEN Container-Card-Base is rendered without props THEN it SHALL use `shadow: 'container'`
4. WHEN Container-Card-Base is rendered without props THEN it SHALL use `border: 'none'`
5. WHEN Container-Card-Base is rendered without props THEN it SHALL use `borderRadius: 'normal'`
6. WHEN Container-Card-Base is rendered without props THEN it SHALL use `semantic: 'div'`
7. WHEN Container-Card-Base is rendered without props THEN it SHALL use `interactive: false`

---

### Requirement 5: Container-Card-Base Interactive Behavior

**User Story**: As a developer, I want to make cards interactive with a single prop, so that I can create tappable cards without manually configuring hover, press, and focus states.

#### Acceptance Criteria

1. WHEN `interactive={true}` THEN Container-Card-Base SHALL enable hover feedback on pointer devices
2. WHEN `interactive={true}` AND user hovers THEN Container-Card-Base SHALL darken the background by 8% using `blend.hoverDarker`
3. WHEN `interactive={true}` AND user presses/taps THEN Container-Card-Base SHALL darken the background by 12% using `blend.pressedDarker`
4. WHEN `interactive={true}` THEN Container-Card-Base SHALL be focusable via keyboard navigation
5. WHEN `interactive={true}` AND card receives keyboard focus THEN Container-Card-Base SHALL display a visible focus ring using established DesignerPunk focus pattern
6. WHEN `interactive={true}` AND `role='button'` AND user presses Enter or Space THEN Container-Card-Base SHALL trigger `onPress`
7. WHEN `interactive={true}` AND `role='link'` AND user presses Enter THEN Container-Card-Base SHALL trigger `onPress`
8. WHEN `interactive={true}` AND `role='link'` AND user presses Space THEN Container-Card-Base SHALL NOT trigger `onPress`
9. WHEN `interactive={false}` THEN Container-Card-Base SHALL NOT respond to hover, press, or keyboard activation
10. WHEN `interactive={true}` THEN Container-Card-Base SHALL internally set `hoverable: true` on the underlying Container-Base

---

### Requirement 6: Container-Card-Base ARIA Semantics

**User Story**: As a developer, I want interactive cards to have correct ARIA roles, so that screen reader users understand the card's purpose.

#### Acceptance Criteria

1. WHEN `interactive={true}` AND `role='button'` THEN Container-Card-Base SHALL apply `role="button"` to the element (web)
2. WHEN `interactive={true}` AND `role='link'` THEN Container-Card-Base SHALL apply `role="link"` to the element (web)
3. WHEN `interactive={true}` AND `role` is not specified THEN Container-Card-Base SHALL default to `role="button"`
4. WHEN `interactive={false}` THEN Container-Card-Base SHALL NOT apply any ARIA role
5. WHEN `accessibilityLabel` is specified THEN Container-Card-Base SHALL apply it as the accessible name

---

### Requirement 7: Cross-Platform Consistency

**User Story**: As a developer, I want Container-Card-Base to behave consistently across web, iOS, and Android, so that I can build cross-platform apps with confidence.

#### Acceptance Criteria

1. WHEN Container-Card-Base is rendered on any platform THEN it SHALL honor the same prop names and values
2. WHEN Container-Card-Base is rendered on any platform THEN it SHALL apply the same default values
3. WHEN Container-Card-Base is rendered on any platform THEN it SHALL provide visual boundary separation from background
4. WHEN Container-Card-Base is rendered on any platform THEN it SHALL apply consistent padding using space.inset tokens
5. WHEN Container-Card-Base is rendered on any platform THEN it SHALL apply rounded corners using radius tokens
6. WHEN `interactive={true}` on any platform THEN Container-Card-Base SHALL provide press feedback

---

### Requirement 8: Documentation Updates

**User Story**: As an AI agent or developer, I want documentation to reflect the new Container-Card-Base architecture, so that I can discover and use the component correctly.

#### Acceptance Criteria

1. WHEN spec is complete THEN Component-Family-Container.md SHALL include Container-Card-Base section with hierarchy diagram
2. WHEN spec is complete THEN Component-Family-Container.md SHALL include props mapping table showing Container-Base to Card-Base relationship
3. WHEN spec is complete THEN Component-Quick-Reference.md SHALL include Container-Card-Base in the component routing table
4. WHEN spec is complete THEN Container-Base README SHALL document new props (paddingVertical, paddingHorizontal, paddingBlockStart, paddingBlockEnd, paddingInlineStart, paddingInlineEnd, borderColor)
5. WHEN spec is complete THEN documentation SHALL follow Component MCP Document Template format

---

## Non-Functional Requirements

### NFR-1: Token Compliance

All styling values SHALL reference design system tokens. No hard-coded pixel values, colors, or timing values in component implementation.

### NFR-2: Accessibility Compliance

Container-Card-Base SHALL meet WCAG 2.1 AA requirements for:
- Focus indication (1.4.11 Non-text Contrast)
- Keyboard operability (2.1.1 Keyboard)
- Focus visible (2.4.7 Focus Visible)

### NFR-3: Performance

Interactive state transitions SHALL use hardware-accelerated CSS properties where possible. No layout-triggering properties (width, height, margin) in hover/press states.

---

## Out of Scope

1. Semantic variants (Container-Card-Senator, Container-Card-Bill, etc.) — future specs
2. Disabled state — DesignerPunk does not support disabled states
3. Loading/skeleton state — separate concern
4. Drag and drop — separate concern
5. Selection state (multi-select cards) — separate concern

---

## Related Documents

- [Design Outline](./design-outline.md) — Detailed design decisions and architecture
- [Component-Family-Container.md](../../steering/Component-Family-Container.md) — Container family documentation
- [Stemma System Principles](../../steering/stemma-system-principles.md) — Component architecture standards
