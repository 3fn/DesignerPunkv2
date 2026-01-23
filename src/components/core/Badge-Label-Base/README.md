# Badge-Label-Base

**Stemma System**: Badge Family  
**Component Type**: Type Primitive (Label)  
**Naming Convention**: `[Family]-[Type]-[Variant]` = Badge-Label-Base  
**Status**: 🟢 Production Ready

---

## Overview

Badge-Label-Base is a read-only, non-interactive visual indicator for displaying categorization, status, or metadata text. It serves as the type primitive for all label badge components in the Badge family.

### Key Characteristics

- **Read-only**: Display-only, no click/tap behavior
- **Non-interactive**: Not focusable, not in tab order
- **Compact**: Small footprint, designed for inline use
- **Informational**: Conveys status or metadata at a glance

### Stemma Naming Convention

The component name follows the Stemma System naming convention:

| Segment | Value | Meaning |
|---------|-------|---------|
| Family | `Badge` | Component family for visual indicators |
| Type | `Label` | Text-based badge variant |
| Variant | `Base` | Foundational primitive (consumer-facing) |

---

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `label` | `string` | ✅ Yes | - | Badge text content |
| `size` | `'sm' \| 'md' \| 'lg'` | No | `'md'` | Size variant |
| `icon` | `IconBaseName` | No | - | Optional leading icon |
| `truncate` | `boolean` | No | `false` | Enable text truncation |
| `testID` | `string` | No | - | Test identifier |

### Size Variants

Each size maps to specific typography and spacing tokens:

| Size | Typography | V-Padding | H-Padding | Icon Size | Icon Gap |
|------|------------|-----------|-----------|-----------|----------|
| `sm` | `typography.labelXs` | `space.inset.none` | `space.inset.050` | `icon.size050` (13px) | `space.grouped.minimal` (2px) |
| `md` | `typography.labelSm` | `space.inset.050` | `space.inset.100` | `icon.size075` (18px) | `space.grouped.tight` (4px) |
| `lg` | `typography.labelMd` | `space.inset.100` | `space.inset.150` | `icon.size100` (24px) | `space.grouped.tight` (4px) |

---

## Usage Examples

### Web (Custom Element)

```html
<!-- Basic usage -->
<badge-label-base label="Draft"></badge-label-base>

<!-- With size variant -->
<badge-label-base label="Status" size="sm"></badge-label-base>

<!-- With icon -->
<badge-label-base label="Approved" icon="check" size="md"></badge-label-base>

<!-- With truncation -->
<badge-label-base label="Very long category name" truncate="true"></badge-label-base>

<!-- With test ID -->
<badge-label-base label="Draft" test-id="status-badge"></badge-label-base>
```

```typescript
// Programmatic usage
const badge = document.createElement('badge-label-base') as BadgeLabelBase;
badge.label = 'Draft';
badge.size = 'md';
badge.icon = 'check';
document.body.appendChild(badge);
```

### iOS (SwiftUI)

```swift
// Basic usage
BadgeLabelBase(label: "Draft")

// With size variant
BadgeLabelBase(label: "Status", size: .sm)

// With icon
BadgeLabelBase(label: "Approved", icon: "check", size: .md)

// With truncation
BadgeLabelBase(label: "Very long category name", truncate: true)

// With testID
BadgeLabelBase(label: "Draft", testID: "status-badge")
```

### Android (Jetpack Compose)

```kotlin
// Basic usage
BadgeLabelBase(label = "Draft")

// With size variant
BadgeLabelBase(label = "Status", size = BadgeLabelBaseSize.SM)

// With icon
BadgeLabelBase(label = "Approved", icon = "check", size = BadgeLabelBaseSize.MD)

// With truncation
BadgeLabelBase(label = "Very long category name", truncate = true)

// With testTag
BadgeLabelBase(label = "Draft", testTag = "status-badge")
```

---

## Behavioral Contracts

Badge-Label-Base provides the following behavioral guarantees:

### Content Contracts

| Contract | Description | WCAG |
|----------|-------------|------|
| `displays_label` | Renders text label visibly with size-appropriate typography | 1.3.1 |
| `supports_icon` | Optionally displays leading icon via Icon-Base | 1.3.1 |
| `supports_truncation` | Truncates with ellipsis; full text accessible | 1.3.1 |

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

- **Label text**: Readable by screen readers
- **Icon**: Marked as decorative (`aria-hidden="true"` on web)
- **Truncated text**: Full text accessible via title attribute (web) or accessibility label (native)

### WCAG Compliance

| Criterion | Level | Status |
|-----------|-------|--------|
| 1.3.1 Info and Relationships | A | ✅ Pass |
| 1.4.3 Contrast (Minimum) | AA | ✅ Pass |
| 1.4.4 Resize Text | AA | ✅ Pass |
| 1.4.11 Non-text Contrast | AA | ✅ Pass |

### Platform-Specific Implementation

| Platform | Truncated Text Access | Icon Hiding | Test ID |
|----------|----------------------|-------------|---------|
| Web | `title` attribute | `aria-hidden="true"` | `data-testid` |
| iOS | `accessibilityLabel` | `.accessibilityHidden(true)` | `accessibilityIdentifier` |
| Android | `contentDescription` | `contentDescription = null` | `testTag` |

---

## Design Tokens

### Required Tokens

| Category | Tokens |
|----------|--------|
| Typography | `typography.labelXs`, `typography.labelSm`, `typography.labelMd` |
| Color | `color.surface`, `color.text.default`, `color.icon.default` |
| Spacing | `space.inset.none`, `space.inset.050`, `space.inset.100`, `space.inset.150`, `space.grouped.minimal`, `space.grouped.tight` |
| Radius | `radiusSubtle` (2px) |
| Icon | `icon.size050`, `icon.size075`, `icon.size100` |
| Component | `badge.label.maxWidth` (120px) |

### Default Colors

| Property | Token | Value |
|----------|-------|-------|
| Background | `color.surface` | Light gray |
| Text | `color.text.default` | Dark gray |
| Icon | `color.icon.default` | Medium gray |

---

## Related Components

### Badge Family

| Component | Type | Status | Description |
|-----------|------|--------|-------------|
| Badge-Label-Base | Type Primitive | 🟢 Ready | Text label badges (this component) |
| Badge-Count-Base | Type Primitive | 🟡 In Progress | Numeric count badges |
| Badge-Count-Notification | Semantic Variant | 🟡 Planned | Notification count badges |

### Dependencies

- **Icon-Base**: Used for rendering optional leading icons

---

## Files

```
src/components/core/Badge-Label-Base/
├── index.ts                    # Public exports
├── types.ts                    # TypeScript type definitions
├── tokens.ts                   # Component token definitions
├── Badge-Label-Base.schema.yaml # Component schema
├── contracts.yaml              # Behavioral contracts
├── README.md                   # This documentation
├── platforms/
│   ├── web/
│   │   ├── BadgeLabelBase.web.ts      # Web component
│   │   └── BadgeLabelBase.styles.css  # Web styles
│   ├── ios/
│   │   └── BadgeLabelBase.ios.swift   # SwiftUI view
│   └── android/
│       └── BadgeLabelBase.android.kt  # Compose composable
└── __tests__/
    └── BadgeLabelBase.test.ts  # Unit tests
```

---

## Specification Reference

- **Spec**: `.kiro/specs/044-badge-base/`
- **Requirements**: `requirements.md` (Requirements 1.1-1.10, 4.1-4.8, 5.1-5.3, 6.1-6.6)
- **Design**: `design.md`
- **Tasks**: `tasks.md`

---

*Badge-Label-Base follows the Stemma System architecture for consistent, accessible, cross-platform component development.*
