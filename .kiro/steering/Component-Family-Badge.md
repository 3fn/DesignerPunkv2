---
inclusion: manual
---

# Badge Components

**Date**: January 23, 2026
**Purpose**: MCP-queryable documentation for Badge component family
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 3
**Relevant Tasks**: component-development, ui-composition, badge-implementation
**Last Reviewed**: January 23, 2026

---

## Family Overview

**Family**: Badge
**Shared Need**: Read-only, non-interactive visual indicators that convey status, category, or metadata
**Readiness**: 🟢 Production Ready

### Purpose

Badges are compact visual indicators designed for inline use. They display categorization labels, numeric counts, or notification states without requiring user interaction. Badges are read-only and never focusable.

### Key Characteristics

- **Read-only**: Display-only, no click/tap behavior
- **Non-interactive**: Not focusable, not in tab order
- **Compact**: Small footprint, designed for inline use
- **Informational**: Conveys status or metadata at a glance

### Stemma System Integration

- **Primitive Bases**: Badge-Label-Base, Badge-Count-Base (both consumer-facing)
- **Semantic Variants**: 1 implemented (Badge-Count-Notification)
- **Cross-Platform**: web, ios, android

---

## Inheritance Structure

### Component Hierarchy

```
Badge (Family)
│
├── Badge-Label-Base (Type Primitive) ─── Consumer-facing
│   └── Future semantic variants as patterns emerge
│
└── Badge-Count-Base (Type Primitive) ─── Consumer-facing
    └── Badge-Count-Notification (Semantic Variant)
```

### Primitive Components

| Component | Type | Status | Description |
|-----------|------|--------|-------------|
| Badge-Label-Base | Primitive | 🟢 Production | General-purpose label badge for categorization, status, metadata display |
| Badge-Count-Base | Primitive | 🟢 Production | Numeric count badge for notifications, unread counts, quantities |

### Semantic Components

| Component | Inherits From | Status | Specialized Purpose |
|-----------|---------------|--------|---------------------|
| Badge-Count-Notification | Badge-Count-Base | 🟢 Production | Notification count with predefined styling and live region announcements |

---

## Behavioral Contracts

### Base Contracts (Badge-Label-Base)

| Contract | Description | WCAG | Platforms |
|----------|-------------|------|-----------|
| displays_label | Renders text label visibly | 1.3.1 | web, ios, android |
| non_interactive | Does not respond to user interaction | — | web, ios, android |
| supports_icon | Optionally displays leading icon via Icon-Base | 1.3.1 | web, ios, android |
| supports_truncation | Truncates with ellipsis when truncate=true; full text accessible | 1.3.1 | web, ios, android |
| color_contrast | Meets WCAG AA contrast requirements (4.5:1) | 1.4.3 | web, ios, android |
| text_scaling | Scales proportionally with user font size preferences | 1.4.4 | web, ios, android |

### Base Contracts (Badge-Count-Base)

| Contract | Description | WCAG | Platforms |
|----------|-------------|------|-----------|
| displays_count | Shows numeric value | 1.3.1 | web, ios, android |
| truncates_at_max | Shows "[max]+" when count exceeds max | 1.3.1 | web, ios, android |
| circular_single_digit | Renders circular for single-digit counts | — | web, ios, android |
| pill_multi_digit | Renders pill shape for multi-digit counts | — | web, ios, android |
| non_interactive | Does not respond to user interaction | — | web, ios, android |
| color_contrast | Meets WCAG AA contrast requirements (4.5:1) | 1.4.3 | web, ios, android |
| text_scaling | Scales proportionally with user font size preferences | 1.4.4 | web, ios, android |

### Extended Contracts (Badge-Count-Notification)

Inherits all contracts from Badge-Count-Base, plus:

| Contract | Description | WCAG | Platforms |
|----------|-------------|------|-----------|
| notification_semantics | Conveys notification/alert meaning through color | 1.3.1 | web, ios, android |
| announces_count_changes | Announces count changes to screen readers when enabled | 4.1.3 | web, ios, android |
| pluralized_announcements | Uses correct pluralization in announcements | 4.1.3 | web, ios, android |

### Contract Details

#### displays_label

**Description**: Renders the provided text label visibly within the badge container.

**Behavior**: The label text is displayed using typography tokens appropriate to the size variant. Text is always visible and readable.

**Verification**:
- Web: Check text content is rendered in Shadow DOM
- iOS: Verify Text view contains label string
- Android: Verify Text composable displays label

**WCAG Compliance**: 1.3.1 Info and Relationships

#### non_interactive

**Description**: Badge components do not respond to user interaction.

**Behavior**: No focus states, no click/tap handlers, not in tab order. Badges are purely informational.

**Verification**:
- Web: No tabindex, no click event listeners
- iOS: No onTapGesture, not focusable
- Android: No clickable modifier, not focusable

#### announces_count_changes

**Description**: When count changes and announceChanges is enabled, screen readers are notified.

**Behavior**: Uses platform-appropriate live region mechanisms to announce count changes with pluralized text.

**Verification**:
- Web: aria-live="polite", aria-atomic="true" present
- iOS: UIAccessibility.post(notification:) called on change
- Android: LiveRegionMode.Polite in semantics

**WCAG Compliance**: 4.1.3 Status Messages

---

## Component Schemas

### Badge-Label-Base

**Type**: Primitive
**Status**: 🟢 Production Ready
**Inherits**: None

#### Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| label | string | Yes | — | Badge text content |
| size | 'sm' \| 'md' \| 'lg' | No | 'md' | Size variant |
| icon | IconName | No | — | Optional leading icon (uses Icon-Base) |
| truncate | boolean | No | false | Enable truncation at component-defined max-width |
| testID | string | No | — | Test identifier |

#### Visual Specifications

| Size | Typography | V-Padding | H-Padding | Icon Size | Icon Gap |
|------|------------|-----------|-----------|-----------|----------|
| sm | typography.labelXs | space.inset.none | space.inset.050 | icon.size050 | space.grouped.minimal |
| md | typography.labelSm | space.inset.050 | space.inset.100 | icon.size075 | space.grouped.tight |
| lg | typography.labelMd | space.inset.100 | space.inset.150 | icon.size100 | space.grouped.tight |

**Shape**: radiusSubtle (2px)

#### Usage Example

```html
<!-- Web -->
<badge-label-base label="Draft"></badge-label-base>
<badge-label-base label="Published" size="lg" icon="check"></badge-label-base>
<badge-label-base label="Very Long Category Name" truncate></badge-label-base>
```

```swift
// iOS
BadgeLabelBase(label: "Draft")
BadgeLabelBase(label: "Published", size: .lg, icon: "check")
```

```kotlin
// Android
BadgeLabelBase(label = "Draft")
BadgeLabelBase(label = "Published", size = Size.LG, icon = "check")
```

---

### Badge-Count-Base

**Type**: Primitive
**Status**: 🟢 Production Ready
**Inherits**: None

#### Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| count | number | Yes | — | Numeric value to display |
| max | number | No | 99 | Maximum before showing "[max]+" |
| showZero | boolean | No | false | Whether to show badge when count is 0 |
| size | 'sm' \| 'md' \| 'lg' | No | 'md' | Size variant |
| testID | string | No | — | Test identifier |

#### Visual Specifications

| Size | Typography | V-Padding | H-Padding | Min-Width |
|------|------------|-----------|-----------|-----------|
| sm | typography.labelXs | space.inset.none | space.inset.050 | = line-height |
| md | typography.labelSm | space.inset.none | space.inset.050 | = line-height |
| lg | typography.labelMd | space.inset.050 | space.inset.100 | = line-height |

**Shape**: radiusHalf (circular/pill)

#### Shape Behavior

| Count Range | Shape | Behavior |
|-------------|-------|----------|
| 1-9 | Circular | width = height |
| 10-99 | Pill | Expands with padding |
| >max | Pill | Shows "[max]+" |
| 0 (showZero=false) | Hidden | Not rendered |
| 0 (showZero=true) | Circular | Shows "0" |

#### Usage Example

```html
<!-- Web -->
<badge-count-base count="5"></badge-count-base>
<badge-count-base count="150" max="99"></badge-count-base>
<badge-count-base count="0" show-zero></badge-count-base>
```

```swift
// iOS
BadgeCountBase(count: 5)
BadgeCountBase(count: 150, max: 99)
BadgeCountBase(count: 0, showZero: true)
```

```kotlin
// Android
BadgeCountBase(count = 5)
BadgeCountBase(count = 150, max = 99)
BadgeCountBase(count = 0, showZero = true)
```

---

### Badge-Count-Notification

**Type**: Semantic
**Status**: 🟢 Production Ready
**Inherits**: Badge-Count-Base

#### Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| count | number | Yes | — | Notification count |
| max | number | No | 99 | Maximum before showing "[max]+" |
| showZero | boolean | No | false | Whether to show badge when count is 0 |
| size | 'sm' \| 'md' \| 'lg' | No | 'md' | Size variant |
| announceChanges | boolean | No | true | Whether to announce count changes to screen readers |
| testID | string | No | — | Test identifier |

#### Fixed Values (Not Configurable)

| Property | Token | Value |
|----------|-------|-------|
| Background | color.badge.background.notification | pink400 (#CC2257) |
| Text | color.badge.text.notification | white100 (#FFFFFF) |

**Contrast Ratio**: 6.33:1 ✅ (exceeds WCAG AA 4.5:1)

#### Announcement Format

- Single: "1 notification"
- Plural: "5 notifications"
- Overflow: "99 or more notifications"

#### Usage Example

```html
<!-- Web -->
<badge-count-notification count="5"></badge-count-notification>
<badge-count-notification count="150" announce-changes="false"></badge-count-notification>
```

```swift
// iOS
BadgeCountNotification(count: 5)
BadgeCountNotification(count: 150, announceChanges: false)
```

```kotlin
// Android
BadgeCountNotification(count = 5)
BadgeCountNotification(count = 150, announceChanges = false)
```

---

## Token Dependencies

### Required Tokens

Components in this family consume these design tokens:

| Category | Token Pattern | Purpose |
|----------|---------------|---------|
| Typography | typography.labelXs, typography.labelSm, typography.labelMd | Text sizing per badge size variant |
| Spacing | space.inset.none, space.inset.050, space.inset.100, space.inset.150 | Padding per size variant |
| Spacing | space.grouped.minimal, space.grouped.tight | Icon-to-label gap |
| Radius | radiusSubtle | Badge-Label-Base border radius (2px) |
| Radius | radiusHalf | Badge-Count-Base border radius (circular/pill) |
| Icon | icon.size050, icon.size075, icon.size100 | Icon sizing per badge size |
| Color | color.surface | Default background |
| Color | color.text.default | Default text color |
| Color | color.icon.default | Default icon color |
| Color | color.badge.background.notification | Notification badge background (pink400) |
| Color | color.badge.text.notification | Notification badge text (white100) |

### Component Tokens

| Token | Value | Purpose |
|-------|-------|---------|
| badge.label.maxWidth | 120px | Maximum width for truncated Badge-Label-Base |

### Token Resolution

Badge components resolve tokens at render time using platform-appropriate mechanisms:
- **Web**: CSS custom properties via Shadow DOM
- **iOS**: Swift extensions on DesignTokens
- **Android**: Kotlin extensions on DesignTokens object

### Related Token Documentation

- [Token Quick Reference](./Token-Quick-Reference.md)
- [Token-Family-Color.md](./Token-Family-Color.md) - Notification badge color tokens

---

## Usage Guidelines

### When to Use This Family

**Use Badge components when**:
- Displaying categorization labels (Draft, Published, Archived)
- Showing numeric counts (unread messages, notifications)
- Indicating status without requiring user action
- Adding metadata to list items or cards

**Do NOT use Badge components when**:
- User interaction is needed (use Tag or Chip components instead)
- Content is dismissible (use Tag with dismiss action)
- Selection is required (use Chip or Toggle)
- The indicator needs to be focusable for accessibility

### Primitive vs Semantic Selection

| Scenario | Recommended Component | Rationale |
|----------|----------------------|-----------|
| Category label | Badge-Label-Base | General-purpose, customizable colors |
| Status indicator | Badge-Label-Base | Flexible for various status types |
| Unread count | Badge-Count-Base | Numeric display with shape behavior |
| Notification count | Badge-Count-Notification | Pre-styled with live region announcements |
| Custom-colored count | Badge-Count-Base | When notification styling isn't appropriate |

### Common Patterns

#### List Item with Badge

```html
<list-item>
  <span slot="label">Messages</span>
  <badge-count-notification slot="trailing" count="5"></badge-count-notification>
</list-item>
```

#### Card Header with Status

```html
<card-header>
  <span slot="title">Document Title</span>
  <badge-label-base slot="trailing" label="Draft"></badge-label-base>
</card-header>
```

### Accessibility Considerations

- Badges are non-interactive and not in tab order
- Badge-Count-Notification announces changes via live regions
- Truncated labels provide full text via title attribute (Web) or accessibility label (native)
- All badges meet WCAG AA contrast requirements (4.5:1 minimum)
- Text scales with user font size preferences

---

## Cross-Platform Notes

### Platform Implementations

| Platform | Technology | File Location |
|----------|------------|---------------|
| Web | Web Components | `platforms/web/[Component].web.ts` |
| iOS | SwiftUI | `platforms/ios/[Component].ios.swift` |
| Android | Jetpack Compose | `platforms/android/[Component].android.kt` |

### Platform-Specific Behaviors

#### Web

- Shadow DOM for style encapsulation
- CSS custom properties for token consumption
- `aria-live="polite"` and `aria-atomic="true"` for notification announcements
- `title` attribute for truncated label accessibility

#### iOS

- SwiftUI views with token consumption via Swift extensions
- `.accessibilityAddTraits(.updatesFrequently)` for notification badges
- `UIAccessibility.post(notification:)` for count change announcements
- Accessibility label for truncated text

#### Android

- Jetpack Compose composables with token consumption via Kotlin extensions
- `LiveRegionMode.Polite` in semantics for notification badges
- `announceForAccessibility()` for count change announcements
- Content description for truncated text

### Behavioral Consistency

All behavioral contracts are maintained across platforms through:
- Shared schema definitions (YAML)
- Platform-specific implementations following contracts
- Stemma validator tests verifying contract compliance
- Cross-platform visual regression testing

---

## Related Documentation

- [Component Quick Reference](./Component-Quick-Reference.md) - Family routing table
- [Stemma System Principles](./stemma-system-principles.md) - Architecture overview
- [Component Schema Format](./Component-Schema-Format.md) - YAML schema specification
- [Token Quick Reference](./Token-Quick-Reference.md) - Token documentation
- [Token-Family-Color.md](./Token-Family-Color.md) - Color token documentation including notification badge tokens
- [Test Development Standards](./Test-Development-Standards.md) - Testing patterns for badge components
