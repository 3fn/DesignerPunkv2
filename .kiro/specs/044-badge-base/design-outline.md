# Badge Component Family - Design Outline

**Date**: January 22, 2026
**Purpose**: Capture design decisions and architecture for Badge component family
**Status**: Design Outline (Pre-Requirements)
**Last Updated**: January 22, 2026

---

## Executive Summary

This design outline establishes the Badge component family architecture following Stemma System principles. Badges are **read-only, non-interactive** visual indicators that convey status, category, or metadata. They are distinct from Tags (which are interactive entry points to experiences).

**Scope for Spec 044:**
- Badge-Label-Base (Type Primitive, consumer-facing)
- Badge-Count-Base (Type Primitive, consumer-facing)
- Badge-Count-Notification (Semantic variant)

---

## Component Overview

### What is a Badge?

A Badge is a small, non-interactive visual indicator used to display status, category, or metadata. Badges communicate information at a glance without requiring user interaction.

**Family Characteristics:**
- **Read-only**: Display-only, no click/tap behavior
- **Non-interactive**: Not focusable, not in tab order
- **Compact**: Small footprint, designed for inline use
- **Informational**: Conveys status or metadata at a glance

### Badge vs Tag Distinction

| Aspect | Badge | Tag |
|--------|-------|-----|
| **Interactivity** | Read-only, non-interactive | Interactive (clickable, dismissible, selectable) |
| **Purpose** | Convey status/metadata | Entry point to experiences, filtering, categorization |
| **User Action** | None | Click, dismiss, select, navigate |
| **Examples** | "Draft", "New", "3 notifications" | Filter chips, removable labels, selectable options |

---

## Architecture

### Stemma System Alignment

Following Stemma principles and the Input-Text-Base pattern:

```
Badge (Family)
│
├── Badge-Label-Base (Type Primitive) - Consumer-facing
│   └── Future semantic variants as patterns emerge
│
└── Badge-Count-Base (Type Primitive) - Consumer-facing
    └── Badge-Count-Notification (Semantic variant)
```

**Key Architectural Decisions:**
1. Type Primitives ARE consumer-facing (like Input-Text-Base)
2. Semantic variants emerge when patterns require fixed values + specialized behaviors
3. No family-level Badge-Base — each Type owns its structure
4. Visual properties (shape, sizing) defined at Type level, not Family level

### Naming Convention

Per Stemma System naming rules:

| Pattern | Example | Description |
|---------|---------|-------------|
| `Badge-[Type]-Base` | `Badge-Label-Base` | Type Primitive (consumer-facing) |
| `Badge-[Type]-[Variant]` | `Badge-Count-Notification` | Semantic variant |

---

## Badge-Label-Base

**Purpose**: General-purpose label badge for categorization, status, metadata display
**Type**: Type Primitive (consumer-facing)
**Inherits**: None

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `label` | `string` | Yes | - | Badge text content |
| `size` | `'sm' \| 'md' \| 'lg'` | No | `'md'` | Size variant |
| `icon` | `IconName` | No | - | Optional leading icon (uses Icon-Base) |
| `truncate` | `boolean` | No | `false` | When true, truncates at component-defined max-width |
| `testID` | `string` | No | - | Test identifier |

### Visual Specifications

**Sizing Philosophy**: Height is derived from content (line-height + vertical padding), not fixed pixel values. This ensures badges scale properly with user font size preferences (WCAG 1.4.4 Resize Text).

| Size | Typography Token | Vertical Padding | Horizontal Padding | Icon Size (Icon-Base) | Icon Gap |
|------|------------------|------------------|-------------------|----------------------|----------|
| `sm` | `typography.labelXs` | `space.inset.none` (0px) | `space.inset.050` (4px) | `icon.size050` (16px) | `space.grouped.minimal` (2px) |
| `md` | `typography.labelSm` | `space.inset.050` (4px) | `space.inset.100` (8px) | `icon.size075` (20px) | `space.grouped.tight` (4px) |
| `lg` | `typography.labelMd` | `space.inset.100` (8px) | `space.inset.150` (12px) | `icon.size100` (24px) | `space.grouped.tight` (4px) |

**Computed Heights** (for reference, not implementation):
- `sm`: 20px line-height + 0px padding = 20px
- `md`: 20px line-height + 8px padding = 28px
- `lg`: 24px line-height + 16px padding = 40px

### Shape
- Border radius: `radiusSubtle` (2px)

### Truncation Behavior
When `truncate={true}`:
- Text truncates with ellipsis (`text-overflow: ellipsis`) at component-defined max-width
- Max-width defined by component token: `badge.label.maxWidth` (120px)
- Full label available via `title` attribute (Web) / accessibility label (native)
- No truncation by default — badge grows to fit content

### Colors (Default/Neutral)
| Property | Token |
|----------|-------|
| Background | `color.surface` |
| Text | `color.text.default` |
| Icon | `color.icon.default` |

### Behavioral Contracts

| Contract | Description | WCAG |
|----------|-------------|------|
| `displays_label` | Renders text label | 1.3.1 |
| `non_interactive` | Does not respond to user interaction | N/A |
| `supports_icon` | Optionally displays leading icon | 1.3.1 |
| `supports_truncation` | Truncates with ellipsis when maxWidth set; full text accessible | 1.3.1 |
| `color_contrast` | Meets WCAG AA contrast requirements | 1.4.3 |

### Usage Examples

```html
<!-- Web -->
<badge-label-base label="Draft"></badge-label-base>
<badge-label-base label="New" icon="sparkle" size="sm"></badge-label-base>
<badge-label-base label="Featured" icon="star" size="lg"></badge-label-base>
<badge-label-base label="Very Long Category Name" truncate></badge-label-base>
```

```swift
// iOS
BadgeLabelBase(label: "Draft")
BadgeLabelBase(label: "New", icon: "sparkle", size: .sm)
BadgeLabelBase(label: "Very Long Category Name", truncate: true)
```

```kotlin
// Android
BadgeLabelBase(label = "Draft")
BadgeLabelBase(label = "New", icon = Icons.Sparkle, size = BadgeSize.Sm)
BadgeLabelBase(label = "Very Long Category Name", truncate = true)
```

---

## Badge-Count-Base

**Purpose**: Numeric count badge for notifications, unread counts, quantities
**Type**: Type Primitive (consumer-facing)
**Inherits**: None

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `count` | `number` | Yes | - | Numeric value to display |
| `max` | `number` | No | `99` | Maximum before showing "99+" |
| `size` | `'sm' \| 'md' \| 'lg'` | No | `'md'` | Size variant |
| `showZero` | `boolean` | No | `false` | Whether to show badge when count is 0 |
| `testID` | `string` | No | - | Test identifier |

### Visual Specifications

**Sizing Philosophy**: Height is derived from content (line-height + vertical padding), not fixed pixel values. This ensures badges scale properly with user font size preferences (WCAG 1.4.4 Resize Text).

| Size | Typography Token | Vertical Padding | Horizontal Padding | Min Width |
|------|------------------|------------------|-------------------|-----------|
| `sm` | `typography.labelXs` | `space.inset.none` (0px) | `space.inset.050` (4px) | = line-height |
| `md` | `typography.labelSm` | `space.inset.none` (0px) | `space.inset.050` (4px) | = line-height |
| `lg` | `typography.labelMd` | `space.inset.050` (4px) | `space.inset.100` (8px) | = line-height |

**Computed Dimensions** (for reference, not implementation):
- `sm`: 20px line-height + 0px padding = 20px height, 20px min-width
- `md`: 20px line-height + 0px padding = 20px height, 20px min-width
- `lg`: 24px line-height + 8px padding = 32px height, 24px min-width

**Min-Width Strategy**: Min-width equals line-height to ensure circular shape for single-digit counts. Multi-digit counts expand horizontally with padding, creating a pill shape.

### Shape
- Border radius: `radiusHalf` (circular/pill)
- Rationale: Count badges are typically paired with interactive elements; pill shape aligns with interaction association

### Colors (Default/Neutral)
| Property | Token |
|----------|-------|
| Background | `color.surface` |
| Text | `color.text.default` |

### Behavior
- Single digit (1-9): Circular (width = height)
- Double digit (10-99): Pill shape with padding
- Exceeds max: Shows "99+" (or custom max + "+")
- Zero: Hidden by default, shown if `showZero={true}`

### Behavioral Contracts

| Contract | Description | WCAG |
|----------|-------------|------|
| `displays_count` | Shows numeric value | 1.3.1 |
| `truncates_at_max` | Shows "99+" when exceeded | 1.3.1 |
| `non_interactive` | Does not respond to user interaction | N/A |
| `color_contrast` | Meets WCAG AA contrast requirements | 1.4.3 |

### Usage Examples

```html
<!-- Web -->
<badge-count-base count="5"></badge-count-base>
<badge-count-base count="150"></badge-count-base> <!-- Shows "99+" -->
<badge-count-base count="150" max="999"></badge-count-base> <!-- Shows "150" -->
<badge-count-base count="0" show-zero="true"></badge-count-base>
```

```swift
// iOS
BadgeCountBase(count: 5)
BadgeCountBase(count: 150) // Shows "99+"
BadgeCountBase(count: 150, max: 999) // Shows "150"
```

```kotlin
// Android
BadgeCountBase(count = 5)
BadgeCountBase(count = 150) // Shows "99+"
BadgeCountBase(count = 150, max = 999) // Shows "150"
```

---

## Badge-Count-Notification

**Purpose**: Notification count badge with predefined notification styling and live region announcements
**Type**: Semantic variant
**Inherits**: Badge-Count-Base

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `count` | `number` | Yes | - | Notification count |
| `max` | `number` | No | `99` | Maximum before showing "99+" |
| `size` | `'sm' \| 'md' \| 'lg'` | No | `'md'` | Size variant |
| `showZero` | `boolean` | No | `false` | Whether to show when count is 0 |
| `announceChanges` | `boolean` | No | `true` | Whether to announce count changes to screen readers |
| `testID` | `string` | No | - | Test identifier |

### Fixed Values (Not Configurable)
- Colors: Uses notification-specific tokens (not neutral)
- Live region: Enabled by default (can be disabled via `announceChanges`)

### New Tokens Required

| Token | Value | Description |
|-------|-------|-------------|
| `color.badge.background.notification` | `pink400` | Background color for notification badges |
| `color.badge.text.notification` | `white100` | Text color on notification background |

**Migration Note**: These tokens use the new industry-standard naming pattern (`color.[component].[property].[variant]`) ahead of the broader token restructure planned in Spec 051. This pattern makes the property explicit (`background`, `text`) rather than implicit.

### Colors (Fixed)
| Property | Token |
|----------|-------|
| Background | `color.badge.background.notification` |
| Text | `color.badge.text.notification` |

### Live Region Behavior

When `announceChanges={true}` (default):
- Component uses `aria-live="polite"` and `aria-atomic="true"` (Web)
- Screen reader announces count changes with pluralized text
- Announcement format: "1 notification" / "5 notifications" / "99 or more notifications"

**Platform Implementation:**

| Platform | Mechanism |
|----------|-----------|
| Web | `aria-live="polite"`, `aria-atomic="true"`, visually hidden announcement text |
| iOS | `.accessibilityAddTraits(.updatesFrequently)`, `UIAccessibility.post(notification:)` |
| Android | `LiveRegionMode.Polite`, `announceForAccessibility()` |

**When to disable**: Set `announceChanges={false}` when the badge is inside a container that already manages its own announcements (e.g., a button with a dynamic label).

### Behavioral Contracts

Inherits all contracts from Badge-Count-Base, plus:

| Contract | Description | WCAG |
|----------|-------------|------|
| `notification_semantics` | Conveys notification/alert meaning | 1.3.1 |
| `announces_count_changes` | Announces count changes to screen readers when enabled | 4.1.3 |

### Usage Examples

```html
<!-- Web -->
<badge-count-notification count="5"></badge-count-notification>
<badge-count-notification count="150"></badge-count-notification> <!-- Shows "99+" -->
<badge-count-notification count="5" announce-changes="false"></badge-count-notification> <!-- No announcements -->
```

```swift
// iOS
BadgeCountNotification(count: 5)
BadgeCountNotification(count: 150) // Shows "99+"
BadgeCountNotification(count: 5, announceChanges: false) // No announcements
```

```kotlin
// Android
BadgeCountNotification(count = 5)
BadgeCountNotification(count = 150) // Shows "99+"
BadgeCountNotification(count = 5, announceChanges = false) // No announcements
```

---

## Token Requirements Summary

### Existing Tokens Used

**Typography:**
- `typography.labelXs` (13px font, 20px line-height)
- `typography.labelSm` (14px font, 20px line-height)
- `typography.labelMd` (16px font, 24px line-height)

**Spacing (Inset):**
- `space.inset.none` (0px) — sm/md vertical padding
- `space.inset.050` (4px) — sm horizontal, md vertical, lg vertical padding
- `space.inset.100` (8px) — md horizontal, lg horizontal padding
- `space.inset.150` (12px) — lg horizontal padding

**Spacing (Grouped):**
- `space.grouped.minimal` (2px) — sm icon gap
- `space.grouped.tight` (4px) — md/lg icon gap

**Icon:**
- `icon.size050` (16px) — sm icon
- `icon.size075` (20px) — md icon
- `icon.size100` (24px) — lg icon

**Radius:**
- `radiusSubtle` (2px) — Badge-Label-Base
- `radiusHalf` (50%) — Badge-Count-Base, Badge-Count-Notification

**Colors:**
- `color.surface` — default background
- `color.text.default` — default text
- `color.icon.default` — default icon

### New Tokens Required

| Token | Primitive Reference | Description |
|-------|---------------------|-------------|
| `color.badge.background.notification` | `pink400` | Notification badge background |
| `color.badge.text.notification` | `white100` | Text on notification background |
| `badge.label.maxWidth` | `120px` | Max-width for truncated Badge-Label-Base |

**Migration Note**: Color tokens use the new industry-standard naming pattern. See Spec 051 for the broader token restructure plan.

---

## Accessibility

### Text Scaling (WCAG 1.4.4)
- Badge dimensions are derived from content (line-height + padding), not fixed pixel values
- When users increase browser/system font size, badges scale proportionally
- No content clipping or overflow at 200% text zoom

### Screen Readers
- Badge text/count is read as-is
- Icon is decorative (`aria-hidden="true"` / `contentDescription = null`)

### Live Regions (WCAG 4.1.3 - Status Messages)
- Badge-Count-Notification announces count changes by default
- Uses `aria-live="polite"` to avoid interrupting current speech
- Pluralized announcements: "1 notification", "5 notifications", "99 or more notifications"
- Can be disabled via `announceChanges={false}` when parent handles announcements

### Color Contrast
- All combinations must meet WCAG AA (4.5:1 for text)
- Notification badge: pink400 (#CC2257) on white100 (#FFFFFF) = **6.33:1** ✅ Verified

### Non-Interactive
- No focus states needed (display-only)
- Not in tab order
- No keyboard interaction

---

## Token Naming: Industry Standard Adoption

### Context

Research into industry design systems (Atlassian, Shopify Polaris, IBM Carbon, Material Design 3, Orbit/Kiwi) revealed that property-explicit token naming is the standard approach. This spec adopts that pattern ahead of a broader restructure (Spec 051).

### Pattern Used

**Industry Standard**: `[family].[component].[property].[variant]`

| Token | Purpose |
|-------|---------|
| `color.badge.background.notification` | Background color |
| `color.badge.text.notification` | Text color |

### Why Not Follow Current Avatar Pattern?

Our current Avatar tokens use implicit background naming (`color.avatar.human` instead of `color.avatar.background.human`). Research showed this is non-standard:

- **Atlassian**: `color.background.success`, `color.text.success`
- **Polaris**: `color-bg-surface-success`, `color-text-success`
- **Orbit**: `buttonPrimaryBackground`, `buttonPrimaryForeground`

Badge will serve as the reference implementation for the new pattern. Avatar and Select tokens will be migrated in Spec 051.

### Related Documentation

- **Spec 051**: Semantic Token Naming Restructure (captures full research and migration plan)

---

## Platform Considerations

### Web
- Custom elements: `<badge-label-base>`, `<badge-count-base>`, `<badge-count-notification>`
- Shadow DOM for style encapsulation
- CSS custom properties for token consumption

### iOS
- SwiftUI views: `BadgeLabelBase`, `BadgeCountBase`, `BadgeCountNotification`
- Token consumption via Swift extensions

### Android
- Jetpack Compose: `BadgeLabelBase`, `BadgeCountBase`, `BadgeCountNotification`
- Token consumption via Kotlin extensions

---

## Design Decisions Summary

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | Type Primitives are consumer-facing | Aligns with Input-Text-Base pattern in Stemma |
| 2 | No family-level Badge-Base | Each Type owns its structure; prevents over-abstraction |
| 3 | Badge-Label-Base uses `radiusSubtle` | Reserve pill shapes for interactive elements |
| 4 | Badge-Count uses `radiusHalf` | Count badges pair with interactions; pill shape appropriate |
| 5 | Semantic typography tokens | Use `labelXs/Sm/Md` instead of raw font sizes |
| 6 | Icon via Icon-Base component | Leverage existing icon system with size props |
| 7 | New notification color tokens | `color.badge.background.notification` is semantically accurate (not error) |
| 8 | Industry-standard token naming | Uses `color.[component].[property].[variant]` pattern (see Spec 051) |
| 9 | Padding-derived sizing (no fixed heights) | Ensures WCAG 1.4.4 compliance; badges scale with user font preferences |
| 10 | Min-width = line-height for Count badges | Ensures circular shape for single digits while allowing pill expansion |
| 11 | Live region announcements for Notification | Notifications are time-sensitive; screen reader users need proactive updates (WCAG 4.1.3) |
| 12 | `announceChanges` opt-out prop | Prevents double-announcements when badge is inside a container that manages its own a11y |
| 13 | Boolean `truncate` prop with component token | Consumer opts into truncation; max-width defined at design system level, not per-instance |
| 14 | Sizing consistency is per-Type, not per-Family | Family groups by purpose/intent, not aesthetic properties; Label and Count have different visual needs |

---

## Future Enhancements (Separate Specs)

**Potential Type Primitives:**
- Badge-Status-Base — Status indicators (online/offline/busy)
- Badge-Dot-Base — Minimal presence indicator (no text)

**Potential Semantic Variants:**
- Badge-Label-[Status] variants — When patterns emerge from Badge-Label-Base usage
- Badge-Count-[Purpose] variants — When patterns emerge from Badge-Count-Base usage

---

## Next Steps

1. ✅ **Design outline created** — Architecture and decisions documented
2. ✅ **Competitive analysis** — Material, Carbon, Polaris, Encore reviewed
3. ✅ **Stemma alignment** — Type Primitive architecture confirmed
4. ✅ **Review with Peter** — Decisions validated
5. ⏳ **Create requirements.md** — EARS format
6. ⏳ **Create design.md** — Detailed architecture
7. ⏳ **Create tasks.md** — Implementation plan

---

**Organization**: spec-guide
**Scope**: 044-badge-base
