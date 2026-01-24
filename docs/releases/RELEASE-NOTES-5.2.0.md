# Release Notes - v5.2.0

**Release Date**: January 23, 2026
**Release Type**: Minor (New Features)

---

## Summary

DesignerPunk v5.2.0 introduces the **Badge Component Family** — a complete set of read-only, non-interactive visual indicators for displaying status, category, metadata, and notification counts across all platforms.

---

## New Features

### Badge Component Family

Three new components following Stemma System architecture:

#### Badge-Label-Base (Type Primitive)
- General-purpose label badge for categorization, status, and metadata display
- Three size variants (sm, md, lg) with token-based typography and spacing
- Optional leading icon support via Icon-Base integration
- Truncation behavior with `badge.label.maxWidth` component token (120px)
- Accessibility: Full text accessible via title attribute (Web) or accessibility label (native)
- Non-interactive: Not focusable, no click handlers

#### Badge-Count-Base (Type Primitive)
- Numeric count badge for notifications, unread counts, and quantities
- Circular shape for single digits, pill shape for multi-digit counts
- Max truncation with configurable threshold (default: 99, displays "99+")
- `showZero` prop controls visibility when count is 0
- Three size variants with consistent token usage

#### Badge-Count-Notification (Semantic Variant)
- Notification badge with predefined styling and live region announcements
- Fixed notification colors: pink400 background (#CC2257), white100 text (#FFFFFF)
- WCAG AA compliant: 6.33:1 contrast ratio (exceeds 4.5:1 requirement)
- Live region announcements on all platforms:
  - Web: `aria-live="polite"`, `aria-atomic="true"`
  - iOS: `.accessibilityAddTraits(.updatesFrequently)`, `UIAccessibility.post(notification:)`
  - Android: `LiveRegionMode.Polite`, `announceForAccessibility()`
- Pluralized announcement text ("1 notification", "5 notifications", "99 or more notifications")
- `announceChanges` prop for opt-out (default: true)

### New Tokens

#### Semantic Color Tokens (2 tokens)
| Token | Primitive Reference | Use Case |
|-------|---------------------|----------|
| `color.badge.background.notification` | pink400 (#CC2257) | Notification badge background |
| `color.badge.text.notification` | white100 (#FFFFFF) | Notification badge text |

#### Component Token (1 token)
| Token | Value | Use Case |
|-------|-------|----------|
| `badge.label.maxWidth` | 120px | Maximum width for truncated label badges |

### Documentation

- **Component-Family-Badge.md**: MCP-indexed steering document with complete family documentation
- **Token-Family-Color.md**: Updated with notification badge tokens and WCAG compliance documentation

---

## Cross-Platform Support

All badge components implemented for:
- **Web**: Custom Elements with Shadow DOM (`<badge-label-base>`, `<badge-count-base>`, `<badge-count-notification>`)
- **iOS**: SwiftUI views (`BadgeLabelBase`, `BadgeCountBase`, `BadgeCountNotification`)
- **Android**: Jetpack Compose composables (`BadgeLabelBase`, `BadgeCountBase`, `BadgeCountNotification`)

---

## Behavioral Contracts

### Badge-Label-Base (6 contracts)
- `displays_label`: Renders text label visibly
- `non_interactive`: Does not respond to user interaction
- `supports_icon`: Optionally displays leading icon via Icon-Base
- `supports_truncation`: Truncates with ellipsis when truncate=true
- `color_contrast`: Meets WCAG AA contrast requirements (4.5:1)
- `text_scaling`: Scales proportionally with user font size preferences

### Badge-Count-Base (7 contracts)
- `displays_count`: Shows numeric value
- `truncates_at_max`: Shows "[max]+" when count exceeds max
- `circular_single_digit`: Renders circular for single-digit counts
- `pill_multi_digit`: Renders pill shape for multi-digit counts
- `non_interactive`: Does not respond to user interaction
- `color_contrast`: Meets WCAG AA contrast requirements (4.5:1)
- `text_scaling`: Scales proportionally with user font size preferences

### Badge-Count-Notification (10 contracts)
- Inherits all 7 contracts from Badge-Count-Base
- `notification_semantics`: Conveys notification/alert meaning through color
- `announces_count_changes`: Announces count changes to screen readers when enabled
- `pluralized_announcements`: Uses correct pluralization in announcements

---

## Test Coverage

- **299 test suites** passing
- **7,495 tests** passing
- Badge-specific tests include:
  - Unit tests for all components
  - Stemma validator tests (naming, token usage, accessibility)
  - Cross-platform behavioral contract verification

---

## Migration Notes

No breaking changes. Badge components are additive and do not affect existing functionality.

---

## Related Specifications

- **Spec 044**: Badge Component Family (`.kiro/specs/044-badge-base/`)

---

## Contributors

- Peter Michaels Allen (Project Creator)
- AI Collaboration (Kiro)
