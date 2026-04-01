# Requirements Document: Nav-Header-Base Component

**Date**: 2026-03-31
**Spec**: 088 - Top Bar Component
**Status**: Requirements Phase
**Dependencies**: Spec 089 (Unified Blur Token Family — complete)

---

## Introduction

Gap report #0 (Spec 083) identified that every product screen needs a top bar, but no component exists in the Stemma catalog. Product agents compose ad-hoc layouts from Container-Base + Icon-Base + Button-Icon, losing platform-native conventions and accessibility patterns. This spec adds Nav-Header-Base (primitive) with two semantic variants: Nav-Header-App (app-level) and Nav-Header-Page (page-level).

---

## Requirements

### Requirement 1: Nav-Header-Base Primitive

**User Story**: As a component system maintainer, I want a structural primitive that solves safe area, background, layout, and landmark semantics once, so that all header variants inherit these without re-implementation.

#### Acceptance Criteria

1. Nav-Header-Base SHALL provide three layout regions: leading, title, and trailing
2. Nav-Header-Base SHALL integrate with platform safe areas (iOS status bar, Android system bar, web viewport)
3. Nav-Header-Base SHALL render as an accessibility landmark (`<header role="banner">` on web, navigation bar semantics on iOS/Android)
4. Nav-Header-Base SHALL support two appearance modes: `opaque` and `translucent`
5. The `translucent` appearance SHALL consume blur primitives from the unified blur token family (Spec 089) for backdrop blur. Platform mapping: web `backdrop-filter`, iOS system materials, Android solid background.
6. Nav-Header-Base SHALL render an optional bottom separator using `color.structure.border.subtle` and `borderWidth100`
7. Nav-Header-Base SHALL enforce focus order: leading → title → trailing
8. All interactive elements within the header SHALL meet `tapAreaMinimum` touch target requirements
9. Nav-Header-Base SHALL NOT be used directly by product agents — it exists solely as the inheritance foundation for semantic variants
10. Composition rules SHALL flag direct use of Nav-Header-Base as a warning

### Requirement 2: Nav-Header-Page Semantic Variant

**User Story**: As a product architect, I want an opinionated page-level navigation bar with back/close actions and a page title, so that pushed or presented screens have consistent, accessible navigation.

#### Acceptance Criteria

1. Nav-Header-Page SHALL inherit from Nav-Header-Base
2. Nav-Header-Page SHALL accept a required `title` prop (string) rendered as an `h1` heading
3. Nav-Header-Page SHALL accept an optional `leadingAction` prop with types: `back` (chevron icon, triggers navigation back), `menu` (hamburger icon), or `custom` (custom icon + label)
4. Nav-Header-Page SHALL accept an optional `trailingActions` prop — an array of action objects (icon, accessibilityLabel, onPress, optional badge count)
5. Nav-Header-Page SHALL accept an optional `closeAction` prop (onPress, optional accessibilityLabel) — always rendered at the inline-end edge, separate from trailing actions
6. WHEN `closeAction` is present THEN it SHALL be positioned at the inline-end edge regardless of trailing action count
7. Nav-Header-Page SHALL support `titleAlignment` prop with values `center` and `leading`, defaulting to platform convention (iOS: center, Android: leading, Web: leading)
8. Nav-Header-Page SHALL support `scrollBehavior` prop with values `fixed` (default) and `collapsible`
9. WHEN `scrollBehavior` is `collapsible` THEN the header SHALL hide on scroll down and reveal on scroll up, with scroll direction detection threshold of 8px
10. WHEN `scrollBehavior` is `collapsible` AND the user has reduced motion enabled THEN the header SHALL remain fixed (visible at all times, collapsible behavior disabled)
11. WHEN `scrollBehavior` is `collapsible` AND the header is hidden THEN the safe area (status bar zone) SHALL remain protected — content SHALL NOT render in the safe area
12. All actions (back, close, trailing) SHALL use Button-Icon at `size: 'medium'`, `variant: 'tertiary'`
13. The bar's content height SHALL be content-driven with a floor of 48px (medium Button-Icon total box). Android adds `space.inset.100` (8px) vertical padding. iOS and web have no bar padding.

### Requirement 3: Nav-Header-App Semantic Variant

**User Story**: As a product architect, I want a permissive app-level header scaffold with safe area and landmark semantics, so that root destination screens have a consistent structural foundation for product-defined content.

#### Acceptance Criteria

1. Nav-Header-App SHALL inherit from Nav-Header-Base
2. Nav-Header-App SHALL accept permissive slot content for leading, center, and trailing regions (product-defined)
3. Nav-Header-App SHALL NOT render a heading element (app-level bars may contain logos, search, or other non-heading content)
4. Nav-Header-App SHALL have readiness status `scaffold` — architectural foundation in place, product content TBD
5. Nav-Header-App's value is in what it inherits: safe area, background, landmark semantics, token foundation — not in opinionated props

### Requirement 4: Platform Implementation

**User Story**: As a platform engineer, I want True Native implementations that respect each platform's top bar conventions, so that the header feels native on every platform.

#### Acceptance Criteria

1. Nav-Header-Base, Nav-Header-Page, and Nav-Header-App SHALL have implementations for web, iOS, and Android
2. Implementations SHALL use custom views (not wrapping UINavigationBar or Material TopAppBar) for full control over layout, animation, and token consumption (D1)
3. The back button SHALL render as a chevron icon only — no visible label showing the previous screen's title (D2)
4. Back button accessibility label SHALL default to "Back" with an optional override for screen-specific context
5. iOS scroll context discovery SHALL use native scroll observation (preference keys / UIScrollView delegate)
6. Android scroll context discovery SHALL use `NestedScrollConnection`
7. Web scroll context SHALL default to `window` scroll with an optional `scrollContainerRef` prop for nested containers
8. iOS translucent appearance SHALL use system material enums for backdrop blur: `blur050` → `.systemUltraThinMaterial`, `blur100` → `.systemThinMaterial`, `blur150` → `.systemMaterial`
9. Web translucent appearance SHALL use `backdrop-filter: blur()` with blur primitive values
10. Android translucent appearance SHALL use solid background (conventional, blur tokens available but not consumed by default)

### Requirement 5: Composition

**User Story**: As a component system maintainer, I want the header's internal composition documented and enforced, so that the component tree is predictable and validatable.

#### Acceptance Criteria

1. Nav-Header-Page SHALL compose internally with Icon-Base (action icons) and Button-Icon (action tap targets)
2. Nav-Header-Page SHALL optionally compose with Badge-Count-Base or Badge-Count-Notification on trailing actions
3. Nav-Header-App SHALL compose with product-defined content (no internal component constraints beyond what the primitive provides)
4. The composition SHALL be documented in schema.yaml and enforceable via `validate_assembly`

### Requirement 6: Behavioral Contracts

**User Story**: As a test governance specialist, I want behavioral contracts that define the header's interaction states, accessibility, and visual behavior, so that cross-platform consistency is verifiable.

#### Acceptance Criteria

1. Behavioral contracts SHALL cover: landmark semantics, focus order, back navigation, close action positioning, scroll behavior, safe area integration, appearance modes
2. Contracts SHALL be defined in `contracts.yaml` following the uniform contract system
3. Nav-Header-Page contracts SHALL inherit from Nav-Header-Base contracts
4. Heading level SHALL be determined by the semantic variant, not configurable via props (D9): Nav-Header-Page renders h1, Nav-Header-App renders no heading

### Requirement 7: Documentation

**User Story**: As any agent, I want the Navigation family documentation updated to include the header components, so that the component catalog is complete and queryable.

#### Acceptance Criteria

1. `Component-Family-Navigation.md` SHALL be updated with Nav-Header-Base, Nav-Header-Page, and Nav-Header-App sections
2. `family-guidance/navigation.yaml` SHALL be updated with selection rules for the header variants
3. Component metadata (`component-meta.yaml`) SHALL be generated via the extraction pipeline (Spec 086)
4. All three components SHALL be queryable via Application MCP after indexing
5. Nav-Header-Base metadata SHALL include `when_not_to_use: "Direct use in product screens — always use a semantic variant"`
