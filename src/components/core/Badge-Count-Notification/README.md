# Badge-Count-Notification

**Stemma System**: Badge Family  
**Component Type**: Semantic Variant (inherits from Badge-Count-Base)  
**Naming Convention**: `[Family]-[Type]-[Variant]` = Badge-Count-Notification  
**Status**: 🟢 Production Ready

---

## Overview

Badge-Count-Notification is a semantic variant that extends Badge-Count-Base with notification-specific styling and live region announcements for screen readers. It provides predefined notification colors and automatically announces count changes to assistive technologies.

### Key Characteristics

- **Inherits Badge-Count-Base**: All count display, max truncation, showZero, and sizing behavior
- **Fixed Notification Colors**: Pink400 background, white100 text (not configurable)
- **Live Region Announcements**: Automatic screen reader announcements on count changes
- **Pluralized Text**: Grammatically correct announcements ("1 notification", "5 notifications")
- **Opt-Out Available**: `announceChanges` prop to disable announcements when needed

### Stemma Naming Convention

The component name follows the Stemma System naming convention:

| Segment | Value | Meaning |
|---------|-------|---------|
| Family | `Badge` | Component family for visual indicators |
| Type | `Count` | Numeric count badge variant |
| Variant | `Notification` | Notification-specific semantic variant |

### Inheritance

Badge-Count-Notification inherits from Badge-Count-Base:

```
Badge-Count-Base (Type Primitive)
    └── Badge-Count-Notification (Semantic Variant)
```

---

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `count` | `number` | ✅ Yes | - | Notification count to display |
| `max` | `number` | No | `99` | Maximum before showing "[max]+" |
| `showZero` | `boolean` | No | `false` | Whether to show badge when count is 0 |
| `size` | `'sm' \| 'md' \| 'lg'` | No | `'md'` | Size variant (inherited) |
| `announceChanges` | `boolean` | No | `true` | Whether to announce count changes |
| `testID` | `string` | No | - | Test identifier |

### Size Variants (Inherited from Badge-Count-Base)

Each size maps to specific typography and spacing tokens:

| Size | Typography | V-Padding | H-Padding | Min-Width |
|------|------------|-----------|-----------|-----------|
| `sm` | `typography.labelXs` | `space.inset.none` | `space.inset.050` | 16px |
| `md` | `typography.labelSm` | `space.inset.none` | `space.inset.050` | 20px |
| `lg` | `typography.labelMd` | `space.inset.050` | `space.inset.100` | 24px |

---

## Fixed Notification Colors

Badge-Count-Notification uses fixed colors that are **not configurable** by consumers:

| Property | Token | Value | Hex |
|----------|-------|-------|-----|
| Background | `color.badge.background.notification` | pink400 | #CC2257 |
| Text | `color.badge.text.notification` | white100 | #FFFFFF |

**Contrast Ratio**: 6.33:1 ✅ (exceeds WCAG AA 4.5:1 minimum)

### Why Fixed Colors?

- **Consistent Semantics**: Notification badges should look the same across the application
- **Accessibility Guaranteed**: Pre-validated contrast ratio ensures WCAG compliance
- **Design System Integrity**: Prevents inconsistent notification styling

---

## Live Region Behavior

When `announceChanges={true}` (default), Badge-Count-Notification announces count changes to screen readers using platform-specific implementations:

### Platform Implementations

| Platform | Live Region | Announcement Method |
|----------|-------------|---------------------|
| Web | `aria-live="polite"`, `aria-atomic="true"` | Visually hidden text |
| iOS | `.accessibilityAddTraits(.updatesFrequently)` | `UIAccessibility.post(notification:)` |
| Android | `LiveRegionMode.Polite` | `announceForAccessibility()` |

### Announcement Format (Pluralization)

| Count | Announcement |
|-------|--------------|
| 1 | "1 notification" |
| 5 | "5 notifications" |
| 0 (showZero=true) | "0 notifications" |
| 100 (max=99) | "99 or more notifications" |

### Announcement Conditions

Announcements only occur when:
1. `announceChanges` is `true`
2. There was a previous count (not initial render)
3. The count has actually changed

---

## announceChanges Opt-Out Use Cases

The `announceChanges` prop defaults to `true`, but should be set to `false` in these scenarios:

### 1. Parent Handles Announcements

When a parent component already announces notification changes:

```html
<!-- Parent announces "You have 5 new notifications" -->
<notification-center>
  <badge-count-notification count="5" announce-changes="false"></badge-count-notification>
</notification-center>
```

### 2. Frequent Updates

When counts update very frequently (e.g., real-time counters):

```html
<!-- Live chat counter updates every second -->
<badge-count-notification count="42" announce-changes="false"></badge-count-notification>
```

### 3. Decorative Context

When the count is already announced through other means:

```html
<!-- Heading already says "Notifications (5)" -->
<h2>Notifications (5)</h2>
<badge-count-notification count="5" announce-changes="false"></badge-count-notification>
```

### 4. Batch Updates

When multiple badges update simultaneously:

```html
<!-- Dashboard announces "Dashboard updated" once -->
<dashboard>
  <badge-count-notification count="3" announce-changes="false"></badge-count-notification>
  <badge-count-notification count="7" announce-changes="false"></badge-count-notification>
</dashboard>
```

---

## Usage Examples

### Web (Custom Element)

```html
<!-- Basic usage -->
<badge-count-notification count="5"></badge-count-notification>

<!-- With size variant -->
<badge-count-notification count="3" size="sm"></badge-count-notification>

<!-- With max truncation -->
<badge-count-notification count="150" max="99"></badge-count-notification>
<!-- Displays: "99+" -->

<!-- Disable announcements -->
<badge-count-notification count="5" announce-changes="false"></badge-count-notification>

<!-- Show zero -->
<badge-count-notification count="0" show-zero="true"></badge-count-notification>

<!-- With test ID -->
<badge-count-notification count="5" test-id="notification-badge"></badge-count-notification>
```

```typescript
// Programmatic usage
const badge = document.createElement('badge-count-notification') as BadgeCountNotification;
badge.count = 5;
badge.max = 99;
badge.size = 'md';
badge.announceChanges = true;
document.body.appendChild(badge);
```

### iOS (SwiftUI)

```swift
// Basic usage
BadgeCountNotification(count: 5)

// With size variant
BadgeCountNotification(count: 3, size: .sm)

// With max truncation
BadgeCountNotification(count: 150, max: 99)
// Displays: "99+"

// Disable announcements
BadgeCountNotification(count: 5, announceChanges: false)

// Show zero
BadgeCountNotification(count: 0, showZero: true)

// With testID
BadgeCountNotification(count: 5, testID: "notification-badge")
```

### Android (Jetpack Compose)

```kotlin
// Basic usage
BadgeCountNotification(count = 5)

// With size variant
BadgeCountNotification(count = 3, size = BadgeCountNotificationSize.SM)

// With max truncation
BadgeCountNotification(count = 150, max = 99)
// Displays: "99+"

// Disable announcements
BadgeCountNotification(count = 5, announceChanges = false)

// Show zero
BadgeCountNotification(count = 0, showZero = true)

// With testTag
BadgeCountNotification(count = 5, testTag = "notification-badge")
```

---

## Behavioral Contracts

Badge-Count-Notification provides the following behavioral guarantees:

### Inherited Contracts (from Badge-Count-Base)

| Contract | Description | WCAG |
|----------|-------------|------|
| `displays_count` | Shows numeric value with size-appropriate typography | 1.3.1 |
| `truncates_at_max` | Shows "[max]+" when count exceeds max | 1.3.1 |
| `circular_single_digit` | Renders circular for single-digit counts (0-9) | - |
| `pill_multi_digit` | Renders pill shape for multi-digit counts (10+) | - |
| `non_interactive` | Does not respond to user interaction | - |
| `color_contrast` | Meets WCAG AA contrast requirements (6.33:1) | 1.4.3 |
| `text_scaling` | Scales proportionally with user font size | 1.4.4 |

### Extended Contracts (Notification-Specific)

| Contract | Description | WCAG |
|----------|-------------|------|
| `notification_semantics` | Conveys notification meaning through fixed colors | 1.3.1 |
| `announces_count_changes` | Announces count changes via live regions | 4.1.3 |
| `pluralized_announcements` | Uses correct pluralization in announcements | 4.1.3 |

---

## Accessibility

### Screen Reader Behavior

- **Live Region**: Announces count changes when `announceChanges={true}`
- **Pluralization**: Grammatically correct announcements
- **Non-Interactive**: Not in focus order, no interaction expected

### WCAG Compliance

| Criterion | Level | Status |
|-----------|-------|--------|
| 1.3.1 Info and Relationships | A | ✅ Pass |
| 1.4.3 Contrast (Minimum) | AA | ✅ Pass (6.33:1) |
| 1.4.4 Resize Text | AA | ✅ Pass |
| 1.4.11 Non-text Contrast | AA | ✅ Pass |
| 4.1.3 Status Messages | AA | ✅ Pass |

### Platform-Specific Accessibility

| Platform | Test ID | Live Region | Announcement |
|----------|---------|-------------|--------------|
| Web | `data-testid` | `aria-live="polite"` | Visually hidden text |
| iOS | `accessibilityIdentifier` | `.updatesFrequently` | `UIAccessibility.post` |
| Android | `testTag` | `LiveRegionMode.Polite` | `announceForAccessibility` |

---

## Design Tokens

### Required Tokens

| Category | Tokens |
|----------|--------|
| Typography | `typography.labelXs`, `typography.labelSm`, `typography.labelMd` |
| Color | `color.badge.background.notification`, `color.badge.text.notification` |
| Spacing | `space.inset.none`, `space.inset.050`, `space.inset.100` |
| Radius | `radiusHalf` (50%) |

### Token References

| Token | Primitive Reference | Value |
|-------|---------------------|-------|
| `color.badge.background.notification` | `pink400` | #CC2257 |
| `color.badge.text.notification` | `white100` | #FFFFFF |

---

## Error Handling

### Invalid Props (Inherited from Badge-Count-Base)

| Scenario | Behavior |
|----------|----------|
| `count` is negative | Render absolute value or 0 |
| `count` is NaN | Render 0 |
| `max` is 0 or negative | Use default (99) |

### Edge Cases

| Scenario | Behavior |
|----------|----------|
| count = 0, showZero = false | Badge not rendered |
| count = 0, showZero = true | Renders "0" (circular) |
| count = max | Shows exact value (e.g., "99") |
| count = max + 1 | Shows "[max]+" (e.g., "99+") |
| Initial render | No announcement (only on changes) |
| Same count set again | No announcement (count unchanged) |

---

## Related Components

### Badge Family

| Component | Type | Status | Description |
|-----------|------|--------|-------------|
| Badge-Label-Base | Type Primitive | 🟢 Ready | Text label badges |
| Badge-Count-Base | Type Primitive | 🟢 Ready | Numeric count badges |
| Badge-Count-Notification | Semantic Variant | 🟢 Ready | Notification count badges (this component) |

### Inheritance Hierarchy

```
Badge (Family)
├── Badge-Label-Base (Type Primitive)
└── Badge-Count-Base (Type Primitive)
    └── Badge-Count-Notification (Semantic Variant) ← This component
```

---

## Files

```
src/components/core/Badge-Count-Notification/
├── index.ts                              # Public exports
├── types.ts                              # TypeScript type definitions
├── Badge-Count-Notification.schema.yaml  # Component schema
├── contracts.yaml                        # Behavioral contracts
├── README.md                             # This documentation
├── platforms/
│   ├── web/
│   │   ├── BadgeCountNotification.web.ts     # Web component
│   │   └── BadgeCountNotification.styles.css # Web styles
│   ├── ios/
│   │   └── BadgeCountNotification.ios.swift  # SwiftUI view
│   └── android/
│       └── BadgeCountNotification.android.kt # Compose composable
└── __tests__/
    └── BadgeCountNotification.test.ts    # Unit tests
```

---

## Specification Reference

- **Spec**: `.kiro/specs/044-badge-base/`
- **Requirements**: `requirements.md` (Requirements 3.1-3.10, 4.7, 5.1-5.3, 6.3)
- **Design**: `design.md`
- **Tasks**: `tasks.md`

---

*Badge-Count-Notification follows the Stemma System architecture for consistent, accessible, cross-platform component development.*
