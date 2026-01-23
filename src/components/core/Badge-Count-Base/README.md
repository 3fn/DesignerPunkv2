# Badge-Count-Base

**Stemma System**: Badge Family  
**Component Type**: Type Primitive (Count)  
**Naming Convention**: `[Family]-[Type]-[Variant]` = Badge-Count-Base  
**Status**: 🟢 Production Ready

---

## Overview

Badge-Count-Base is a read-only, non-interactive visual indicator for displaying numeric values like notification counts or quantities. It serves as the type primitive for all count badge components in the Badge family.

### Key Characteristics

- **Read-only**: Display-only, no click/tap behavior
- **Non-interactive**: Not focusable, not in tab order
- **Compact**: Small footprint, designed for inline use
- **Informational**: Conveys numeric status at a glance

### Stemma Naming Convention

The component name follows the Stemma System naming convention:

| Segment | Value | Meaning |
|---------|-------|---------|
| Family | `Badge` | Component family for visual indicators |
| Type | `Count` | Numeric count badge variant |
| Variant | `Base` | Foundational primitive (consumer-facing) |

---

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `count` | `number` | ✅ Yes | - | Numeric value to display |
| `max` | `number` | No | `99` | Maximum before showing "[max]+" |
| `showZero` | `boolean` | No | `false` | Whether to show badge when count is 0 |
| `size` | `'sm' \| 'md' \| 'lg'` | No | `'md'` | Size variant |
| `testID` | `string` | No | - | Test identifier |

### Size Variants

Each size maps to specific typography and spacing tokens:

| Size | Typography | V-Padding | H-Padding | Min-Width |
|------|------------|-----------|-----------|-----------|
| `sm` | `typography.labelXs` | `space.inset.none` | `space.inset.050` | 16px |
| `md` | `typography.labelSm` | `space.inset.none` | `space.inset.050` | 20px |
| `lg` | `typography.labelMd` | `space.inset.050` | `space.inset.100` | 24px |

---

## Shape Behavior

Badge-Count-Base automatically adapts its shape based on the count value:

### Circular Shape (Single Digit)

When displaying single-digit counts (0-9), the badge renders as a **circle**:
- Width equals height (min-width = line-height)
- `radiusHalf` (50%) creates perfect circle
- Text centered horizontally and vertically

```
  ┌───┐
  │ 5 │  ← Circular: width = height
  └───┘
```

### Pill Shape (Multi-Digit)

When displaying multi-digit counts (10+) or overflow text, the badge expands horizontally:
- Width exceeds height
- `radiusHalf` (50%) creates rounded ends
- Horizontal padding prevents text touching edges

```
  ┌─────┐
  │ 42  │  ← Pill: width > height
  └─────┘
  
  ┌──────┐
  │ 99+  │  ← Pill with overflow
  └──────┘
```

### Shape Transition Summary

| Count Range | Shape | Display |
|-------------|-------|---------|
| 0 (showZero=true) | Circular | "0" |
| 1-9 | Circular | Exact value |
| 10-99 | Pill | Exact value |
| >max | Pill | "[max]+" |

---

## Usage Examples

### Web (Custom Element)

```html
<!-- Basic usage -->
<badge-count-base count="5"></badge-count-base>

<!-- With size variant -->
<badge-count-base count="42" size="sm"></badge-count-base>

<!-- With max truncation -->
<badge-count-base count="150" max="99"></badge-count-base>
<!-- Displays: "99+" -->

<!-- Show zero -->
<badge-count-base count="0" show-zero="true"></badge-count-base>

<!-- With test ID -->
<badge-count-base count="5" test-id="notification-badge"></badge-count-base>
```

```typescript
// Programmatic usage
const badge = document.createElement('badge-count-base') as BadgeCountBase;
badge.count = 5;
badge.max = 99;
badge.size = 'md';
document.body.appendChild(badge);
```

### iOS (SwiftUI)

```swift
// Basic usage
BadgeCountBase(count: 5)

// With size variant
BadgeCountBase(count: 42, size: .sm)

// With max truncation
BadgeCountBase(count: 150, max: 99)
// Displays: "99+"

// Show zero
BadgeCountBase(count: 0, showZero: true)

// With testID
BadgeCountBase(count: 5, testID: "notification-badge")
```

### Android (Jetpack Compose)

```kotlin
// Basic usage
BadgeCountBase(count = 5)

// With size variant
BadgeCountBase(count = 42, size = BadgeCountBaseSize.SM)

// With max truncation
BadgeCountBase(count = 150, max = 99)
// Displays: "99+"

// Show zero
BadgeCountBase(count = 0, showZero = true)

// With testTag
BadgeCountBase(count = 5, testTag = "notification-badge")
```

---

## Behavioral Contracts

Badge-Count-Base provides the following behavioral guarantees:

### Content Contracts

| Contract | Description | WCAG |
|----------|-------------|------|
| `displays_count` | Shows numeric value with size-appropriate typography | 1.3.1 |
| `truncates_at_max` | Shows "[max]+" when count exceeds max | 1.3.1 |

### Shape Contracts

| Contract | Description | WCAG |
|----------|-------------|------|
| `circular_single_digit` | Renders circular for single-digit counts (0-9) | - |
| `pill_multi_digit` | Renders pill shape for multi-digit counts (10+) | - |

### Interaction Contracts

| Contract | Description | WCAG |
|----------|-------------|------|
| `non_interactive` | Does not respond to user interaction | - |

### Accessibility Contracts

| Contract | Description | WCAG |
|----------|-------------|------|
| `color_contrast` | Meets WCAG AA contrast requirements (4.5:1) | 1.4.3 |
| `text_scaling` | Scales proportionally with user font size | 1.4.4 |

---

## Accessibility

### Screen Reader Behavior

- **Count text**: Readable by screen readers
- **Non-interactive**: Not in focus order, no interaction expected

### WCAG Compliance

| Criterion | Level | Status |
|-----------|-------|--------|
| 1.3.1 Info and Relationships | A | ✅ Pass |
| 1.4.3 Contrast (Minimum) | AA | ✅ Pass |
| 1.4.4 Resize Text | AA | ✅ Pass |
| 1.4.11 Non-text Contrast | AA | ✅ Pass |

### Platform-Specific Implementation

| Platform | Test ID | Non-Interactive |
|----------|---------|-----------------|
| Web | `data-testid` | `pointer-events: none` |
| iOS | `accessibilityIdentifier` | No gesture handlers |
| Android | `testTag` | No click handlers |

---

## Design Tokens

### Required Tokens

| Category | Tokens |
|----------|--------|
| Typography | `typography.labelXs`, `typography.labelSm`, `typography.labelMd` |
| Color | `color.surface`, `color.text.default` |
| Spacing | `space.inset.none`, `space.inset.050`, `space.inset.100` |
| Radius | `radiusHalf` (50%) |

### Default Colors

| Property | Token | Value |
|----------|-------|-------|
| Background | `color.surface` | Light gray |
| Text | `color.text.default` | Dark gray |

---

## Error Handling

### Invalid Props

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

---

## Related Components

### Badge Family

| Component | Type | Status | Description |
|-----------|------|--------|-------------|
| Badge-Label-Base | Type Primitive | 🟢 Ready | Text label badges |
| Badge-Count-Base | Type Primitive | 🟢 Ready | Numeric count badges (this component) |
| Badge-Count-Notification | Semantic Variant | 🟡 Planned | Notification count badges with live regions |

### Inheritance

Badge-Count-Notification inherits from Badge-Count-Base and adds:
- Fixed notification colors (pink400 background, white100 text)
- Live region announcements for screen readers
- Pluralized announcement text

---

## Files

```
src/components/core/Badge-Count-Base/
├── index.ts                    # Public exports
├── types.ts                    # TypeScript type definitions
├── Badge-Count-Base.schema.yaml # Component schema
├── contracts.yaml              # Behavioral contracts
├── README.md                   # This documentation
├── platforms/
│   ├── web/
│   │   └── BadgeCountBase.web.ts      # Web component
│   ├── ios/
│   │   └── BadgeCountBase.ios.swift   # SwiftUI view
│   └── android/
│       └── BadgeCountBase.android.kt  # Compose composable
└── __tests__/
    └── BadgeCountBase.test.ts  # Unit tests
```

---

## Specification Reference

- **Spec**: `.kiro/specs/044-badge-base/`
- **Requirements**: `requirements.md` (Requirements 2.1-2.13, 4.3-4.4, 5.1-5.3, 6.1-6.6)
- **Design**: `design.md`
- **Tasks**: `tasks.md`

---

*Badge-Count-Base follows the Stemma System architecture for consistent, accessible, cross-platform component development.*
