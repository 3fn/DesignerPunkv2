# Requirements Document: Badge Component Family

**Date**: January 23, 2026
**Spec**: 044 - Badge Component Family
**Status**: Requirements Phase
**Dependencies**: Icon-Base (src/components/core/Icon-Base/README.md)

---

## Introduction

This document defines requirements for the Badge component family — read-only, non-interactive visual indicators that convey status, category, or metadata. The scope includes Badge-Label-Base, Badge-Count-Base, and Badge-Count-Notification.

---

## Requirements

### Requirement 1: Badge-Label-Base Component

**User Story**: As a developer, I want a label badge component, so that I can display categorization, status, or metadata text in a compact visual indicator.

#### Acceptance Criteria

1. WHEN a `label` prop is provided THEN the component SHALL render the text content visibly
2. WHEN a `size` prop is provided with value `sm`, `md`, or `lg` THEN the component SHALL apply the corresponding typography and spacing tokens
3. IF no `size` prop is provided THEN the component SHALL default to `md` size
4. WHEN an `icon` prop is provided THEN the component SHALL render a leading icon using Icon-Base with size appropriate to the badge size
5. WHEN `truncate` prop is `true` THEN the component SHALL truncate text with ellipsis at the component-defined max-width
6. WHEN `truncate` prop is `true` THEN the component SHALL provide full label text via title attribute (Web) or accessibility label (native)
7. IF no `truncate` prop is provided THEN the component SHALL allow text to grow without truncation
8. WHEN rendered THEN the component SHALL NOT be focusable or respond to user interaction
9. WHEN rendered THEN the component SHALL meet WCAG AA color contrast requirements (4.5:1 minimum)
10. WHEN user increases system font size THEN the component SHALL scale proportionally without content clipping

---

### Requirement 2: Badge-Count-Base Component

**User Story**: As a developer, I want a count badge component, so that I can display numeric values like notification counts or quantities in a compact visual indicator.

#### Acceptance Criteria

1. WHEN a `count` prop is provided THEN the component SHALL render the numeric value
2. WHEN `count` is a single digit (1-9) THEN the component SHALL render as circular (width equals height)
3. WHEN `count` is double digit or more THEN the component SHALL render as pill shape with horizontal padding
4. WHEN `count` exceeds the `max` value THEN the component SHALL display "[max]+" (e.g., "99+")
5. IF no `max` prop is provided THEN the component SHALL default to `99`
6. WHEN `count` is `0` AND `showZero` is `false` THEN the component SHALL NOT render
7. WHEN `count` is `0` AND `showZero` is `true` THEN the component SHALL render showing "0"
8. IF no `showZero` prop is provided THEN the component SHALL default to `false`
9. WHEN a `size` prop is provided with value `sm`, `md`, or `lg` THEN the component SHALL apply the corresponding typography and spacing tokens
10. IF no `size` prop is provided THEN the component SHALL default to `md` size
11. WHEN rendered THEN the component SHALL NOT be focusable or respond to user interaction
12. WHEN rendered THEN the component SHALL meet WCAG AA color contrast requirements (4.5:1 minimum)
13. WHEN user increases system font size THEN the component SHALL scale proportionally without content clipping

---

### Requirement 3: Badge-Count-Notification Component

**User Story**: As a developer, I want a notification badge component with predefined styling and accessibility announcements, so that I can display notification counts that are automatically announced to screen reader users.

#### Acceptance Criteria

1. WHEN rendered THEN the component SHALL use notification-specific color tokens (pink400 background, white100 text)
2. WHEN rendered THEN the component SHALL inherit all behavior from Badge-Count-Base (count display, max truncation, showZero, sizing)
3. WHEN `count` changes AND `announceChanges` is `true` THEN the component SHALL announce the new count to screen readers
4. WHEN announcing count changes THEN the component SHALL use pluralized text ("1 notification", "5 notifications")
5. WHEN `count` exceeds `max` AND announcing THEN the component SHALL announce "[max] or more notifications"
6. IF no `announceChanges` prop is provided THEN the component SHALL default to `true`
7. WHEN `announceChanges` is `false` THEN the component SHALL NOT announce count changes
8. WHEN rendered on Web THEN the component SHALL use `aria-live="polite"` and `aria-atomic="true"` for announcements
9. WHEN rendered on iOS THEN the component SHALL use `.accessibilityAddTraits(.updatesFrequently)` and post accessibility announcements
10. WHEN rendered on Android THEN the component SHALL use `LiveRegionMode.Polite` for announcements

---

### Requirement 4: Token Integration

**User Story**: As a design system maintainer, I want badge components to use design tokens consistently, so that badges integrate with the broader design system and support theming.

#### Acceptance Criteria

1. WHEN rendering Badge-Label-Base THEN the component SHALL use `typography.labelXs`, `typography.labelSm`, or `typography.labelMd` based on size
2. WHEN rendering Badge-Label-Base THEN the component SHALL use `radiusSubtle` for border radius
3. WHEN rendering Badge-Count-Base THEN the component SHALL use `radiusHalf` for border radius (circular/pill)
4. WHEN rendering spacing THEN the component SHALL use `space.inset.*` tokens for padding
5. WHEN rendering icon gaps THEN the component SHALL use `space.grouped.*` tokens
6. WHEN rendering icons THEN the component SHALL use `icon.size050`, `icon.size075`, or `icon.size100` based on badge size
7. WHEN rendering Badge-Count-Notification THEN the component SHALL use `color.badge.background.notification` and `color.badge.text.notification` tokens
8. WHEN truncating Badge-Label-Base THEN the component SHALL use `badge.label.maxWidth` token for max-width value

---

### Requirement 5: Cross-Platform Consistency

**User Story**: As a developer building cross-platform applications, I want badge components to behave consistently across Web, iOS, and Android, so that users have a unified experience.

#### Acceptance Criteria

1. WHEN rendered on Web THEN the component SHALL be implemented as custom elements (`<badge-label-base>`, `<badge-count-base>`, `<badge-count-notification>`)
2. WHEN rendered on iOS THEN the component SHALL be implemented as SwiftUI views (`BadgeLabelBase`, `BadgeCountBase`, `BadgeCountNotification`)
3. WHEN rendered on Android THEN the component SHALL be implemented as Jetpack Compose composables (`BadgeLabelBase`, `BadgeCountBase`, `BadgeCountNotification`)
4. WHEN rendered on any platform THEN the component SHALL produce visually equivalent output given the same props
5. WHEN rendered on any platform THEN the component SHALL consume tokens via platform-appropriate mechanisms (CSS custom properties, Swift extensions, Kotlin extensions)

---

### Requirement 6: Accessibility Compliance

**User Story**: As a user with disabilities, I want badge components to be accessible, so that I can perceive and understand badge information regardless of my abilities.

#### Acceptance Criteria

1. WHEN rendered THEN badge text/count SHALL be readable by screen readers
2. WHEN Badge-Label-Base has an icon THEN the icon SHALL be marked as decorative (`aria-hidden="true"` / `contentDescription = null`)
3. WHEN Badge-Count-Notification count changes THEN screen readers SHALL be notified (when `announceChanges` is enabled)
4. WHEN rendered THEN all text SHALL meet WCAG AA contrast requirements (4.5:1 for normal text)
5. WHEN user increases text size to 200% THEN badges SHALL scale without content clipping or overflow
6. WHEN Badge-Label-Base is truncated THEN full text SHALL be accessible via title attribute or accessibility label

---

### Requirement 7: Stemma System Alignment

**User Story**: As a design system maintainer, I want badge components to follow Stemma System principles, so that they integrate consistently with the component architecture and enable AI-assisted development.

#### Acceptance Criteria

1. WHEN naming components THEN they SHALL follow Stemma System naming convention: `[Family]-[Type]-[Variant]`
2. WHEN Badge-Label-Base is created THEN it SHALL be classified as a Type Primitive (consumer-facing)
3. WHEN Badge-Count-Base is created THEN it SHALL be classified as a Type Primitive (consumer-facing)
4. WHEN Badge-Count-Notification is created THEN it SHALL be classified as a Semantic Variant inheriting from Badge-Count-Base
5. WHEN components are validated THEN they SHALL pass StemmaComponentNamingValidator checks
6. WHEN components are validated THEN they SHALL pass StemmaTokenUsageValidator checks (no hardcoded values)
7. WHEN components are validated THEN they SHALL pass StemmaPropertyAccessibilityValidator checks
8. WHEN components define behavioral contracts THEN they SHALL be documented in YAML schema format
9. WHEN components are documented THEN they SHALL include family hierarchy, behavioral contracts, and cross-platform implementation notes

---

### Requirement 8: Test Development Standards

**User Story**: As a developer, I want badge component tests to follow established test development standards, so that tests are maintainable, behavior-focused, and support system evolution.

#### Acceptance Criteria

1. WHEN writing tests THEN they SHALL test behavior (what the system does) rather than implementation (how it does it)
2. WHEN writing tests THEN they SHALL test contracts (interface, API) rather than internal details
3. WHEN writing tests THEN they SHALL NOT test philosophical preferences about code structure
4. WHEN testing Badge-Label-Base THEN tests SHALL verify: label rendering, size variants, icon support, truncation behavior, non-interactivity
5. WHEN testing Badge-Count-Base THEN tests SHALL verify: count rendering, circular/pill shape behavior, max truncation, showZero behavior, non-interactivity
6. WHEN testing Badge-Count-Notification THEN tests SHALL verify: notification styling, live region announcements, pluralization
7. WHEN testing components THEN tests SHALL use Stemma System validators for static analysis validation
8. WHEN testing web components THEN tests SHALL follow JSDOM patterns with explicit custom element registration
9. WHEN tests are categorized THEN they SHALL be marked as either "evergreen" (permanent) or "temporary" (migration-specific)
10. WHEN testing accessibility THEN tests SHALL verify screen reader behavior and WCAG compliance without dictating specific ARIA patterns

---

### Requirement 9: Rosetta Pipeline Integration

**User Story**: As a design system maintainer, I want new badge tokens to integrate with the Rosetta pipeline, so that they are automatically generated for all platforms and follow established token governance.

#### Acceptance Criteria

1. WHEN `color.badge.background.notification` is created THEN it SHALL be defined as a semantic color token referencing `pink400` primitive
2. WHEN `color.badge.text.notification` is created THEN it SHALL be defined as a semantic color token referencing `white100` primitive
3. WHEN `badge.label.maxWidth` is created THEN it SHALL be defined using `defineComponentTokens()` helper
4. WHEN component tokens are defined THEN they SHALL include required reasoning explaining why the token exists
5. WHEN tokens are defined THEN they SHALL be validated by ValidationCoordinator (primitive reference validation, family-conformant value validation)
6. WHEN tokens are generated THEN they SHALL produce platform-specific output (CSS custom properties, Swift extensions, Kotlin extensions)
7. WHEN new tokens follow the industry-standard naming pattern THEN they SHALL use `[semantic token family].[component].[property].[variant]` format

---

## Non-Functional Requirements

### NFR-1: Performance
- Badge components SHALL render without perceptible delay
- Badge components SHALL NOT cause layout shifts after initial render

### NFR-2: Bundle Size
- Badge components SHALL be tree-shakeable (unused components not included in bundle)
- Individual badge component SHALL add no more than 5KB to bundle size (uncompressed)

---

## Out of Scope

- Interactive badge behaviors (click, dismiss, select) — these belong to Tag components
- Badge-Status-Base (online/offline indicators) — future spec
- Badge-Dot-Base (minimal presence indicator) — future spec
- Badge-Icon-Base (icon-only badges) — future spec if needed

---

**Organization**: spec-validation
**Scope**: 044-badge-base
