# Design Document: Badge Component Family

**Date**: January 23, 2026
**Spec**: 044 - Badge Component Family
**Status**: Design Phase
**Dependencies**: Icon-Bas (src/components/core/Icon-Base/README.md), Rosetta Pipeline, Stemma System

---

## Overview

This document details the architecture and implementation design for the Badge component family. Badges are read-only, non-interactive visual indicators that convey status, category, or metadata.

**Scope:**
- Badge-Label-Base (Type Primitive)
- Badge-Count-Base (Type Primitive)
- Badge-Count-Notification (Semantic Variant)

**Key Characteristics:**
- Read-only: Display-only, no click/tap behavior
- Non-interactive: Not focusable, not in tab order
- Compact: Small footprint, designed for inline use
- Informational: Conveys status or metadata at a glance

---

## Architecture

### Stemma System Hierarchy

```
Badge (Family)
│
├── Badge-Label-Base (Type Primitive) ─── Consumer-facing
│   └── Future semantic variants as patterns emerge
│
└── Badge-Count-Base (Type Primitive) ─── Consumer-facing
    └── Badge-Count-Notification (Semantic Variant)
```

### Component Relationships

```
┌─────────────────────────────────────────────────────────────────┐
│                    BADGE COMPONENT FAMILY                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────┐      ┌─────────────────────┐           │
│  │  Badge-Label-Base   │      │  Badge-Count-Base   │           │
│  │  (Type Primitive)   │      │  (Type Primitive)   │           │
│  ├─────────────────────┤      ├─────────────────────┤           │
│  │ • label (required)  │      │ • count (required)  │           │
│  │ • size (sm/md/lg)   │      │ • max (default: 99) │           │
│  │ • icon (optional)   │      │ • showZero          │           │
│  │ • truncate          │      │ • size (sm/md/lg)   │           │
│  │ • testID            │      │ • testID            │           │
│  └─────────────────────┘      └──────────┬──────────┘           │
│                                          │                       │
│                                          │ inherits              │
│                                          ▼                       │
│                               ┌─────────────────────┐           │
│                               │ Badge-Count-        │           │
│                               │ Notification        │           │
│                               │ (Semantic Variant)  │           │
│                               ├─────────────────────┤           │
│                               │ • Fixed colors      │           │
│                               │ • announceChanges   │           │
│                               │ • Live regions      │           │
│                               └─────────────────────┘           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Token Dependencies

```
┌─────────────────────────────────────────────────────────────────┐
│                      TOKEN DEPENDENCIES                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  EXISTING TOKENS                    NEW TOKENS                   │
│  ──────────────                    ──────────                    │
│                                                                  │
│  Typography:                       Color (Semantic):             │
│  • typography.labelXs              • color.badge.background.     │
│  • typography.labelSm                notification → pink400      │
│  • typography.labelMd              • color.badge.text.           │
│                                      notification → white100     │
│  Spacing:                                                        │
│  • space.inset.none               Component:                     │
│  • space.inset.050                • badge.label.maxWidth         │
│  • space.inset.100                  → 120px                      │
│  • space.inset.150                                               │
│  • space.grouped.minimal                                         │
│  • space.grouped.tight                                           │
│                                                                  │
│  Radius:                                                         │
│  • radiusSubtle (2px)                                            │
│  • radiusHalf (50%)                                              │
│                                                                  │
│  Icon:                                                           │
│  • icon.size050 (16px)                                           │
│  • icon.size075 (20px)                                           │
│  • icon.size100 (24px)                                           │
│                                                                  │
│  Color:                                                          │
│  • color.surface                                                 │
│  • color.text.default                                            │
│  • color.icon.default                                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Components and Interfaces

### Badge-Label-Base

**Purpose**: General-purpose label badge for categorization, status, metadata display
**Classification**: Type Primitive (consumer-facing)

#### Props Interface

```typescript
interface BadgeLabelBaseProps {
  /** Badge text content (required) */
  label: string;
  
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';  // default: 'md'
  
  /** Optional leading icon (uses Icon-Base) */
  icon?: IconName;
  
  /** Enable truncation at component-defined max-width */
  truncate?: boolean;  // default: false
  
  /** Test identifier */
  testID?: string;
}
```

#### Visual Specifications

| Size | Typography | V-Padding | H-Padding | Icon Size | Icon Gap |
|------|------------|-----------|-----------|-----------|----------|
| `sm` | `typography.labelXs` | `space.inset.none` | `space.inset.050` | `icon.size050` | `space.grouped.minimal` |
| `md` | `typography.labelSm` | `space.inset.050` | `space.inset.100` | `icon.size075` | `space.grouped.tight` |
| `lg` | `typography.labelMd` | `space.inset.100` | `space.inset.150` | `icon.size100` | `space.grouped.tight` |

**Shape**: `radiusSubtle` (2px)

**Colors (Default)**:
- Background: `color.surface`
- Text: `color.text.default`
- Icon: `color.icon.default`

#### Behavioral Contracts

```yaml
contracts:
  displays_label:
    description: Renders text label visibly
    wcag: "1.3.1"
    
  non_interactive:
    description: Does not respond to user interaction
    wcag: null
    
  supports_icon:
    description: Optionally displays leading icon via Icon-Base
    wcag: "1.3.1"
    
  supports_truncation:
    description: Truncates with ellipsis when truncate=true; full text accessible
    wcag: "1.3.1"
    
  color_contrast:
    description: Meets WCAG AA contrast requirements (4.5:1)
    wcag: "1.4.3"
    
  text_scaling:
    description: Scales proportionally with user font size preferences
    wcag: "1.4.4"
```

---

### Badge-Count-Base

**Purpose**: Numeric count badge for notifications, unread counts, quantities
**Classification**: Type Primitive (consumer-facing)

#### Props Interface

```typescript
interface BadgeCountBaseProps {
  /** Numeric value to display (required) */
  count: number;
  
  /** Maximum before showing "[max]+" */
  max?: number;  // default: 99
  
  /** Whether to show badge when count is 0 */
  showZero?: boolean;  // default: false
  
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';  // default: 'md'
  
  /** Test identifier */
  testID?: string;
}
```

#### Visual Specifications

| Size | Typography | V-Padding | H-Padding | Min-Width |
|------|------------|-----------|-----------|-----------|
| `sm` | `typography.labelXs` | `space.inset.none` | `space.inset.050` | = line-height |
| `md` | `typography.labelSm` | `space.inset.none` | `space.inset.050` | = line-height |
| `lg` | `typography.labelMd` | `space.inset.050` | `space.inset.100` | = line-height |

**Shape**: `radiusHalf` (circular/pill)

**Min-Width Strategy**: Min-width equals line-height to ensure circular shape for single-digit counts. Multi-digit counts expand horizontally with padding, creating a pill shape.

**Colors (Default)**:
- Background: `color.surface`
- Text: `color.text.default`

#### Shape Behavior

| Count Range | Shape | Behavior |
|-------------|-------|----------|
| 1-9 | Circular | width = height |
| 10-99 | Pill | Expands with padding |
| >max | Pill | Shows "[max]+" |
| 0 (showZero=false) | Hidden | Not rendered |
| 0 (showZero=true) | Circular | Shows "0" |

#### Behavioral Contracts

```yaml
contracts:
  displays_count:
    description: Shows numeric value
    wcag: "1.3.1"
    
  truncates_at_max:
    description: Shows "[max]+" when count exceeds max
    wcag: "1.3.1"
    
  circular_single_digit:
    description: Renders circular for single-digit counts
    wcag: null
    
  pill_multi_digit:
    description: Renders pill shape for multi-digit counts
    wcag: null
    
  non_interactive:
    description: Does not respond to user interaction
    wcag: null
    
  color_contrast:
    description: Meets WCAG AA contrast requirements (4.5:1)
    wcag: "1.4.3"
    
  text_scaling:
    description: Scales proportionally with user font size preferences
    wcag: "1.4.4"
```

---

### Badge-Count-Notification

**Purpose**: Notification count badge with predefined styling and live region announcements
**Classification**: Semantic Variant (inherits Badge-Count-Base)

#### Props Interface

```typescript
interface BadgeCountNotificationProps {
  /** Notification count (required) */
  count: number;
  
  /** Maximum before showing "[max]+" */
  max?: number;  // default: 99
  
  /** Whether to show badge when count is 0 */
  showZero?: boolean;  // default: false
  
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';  // default: 'md'
  
  /** Whether to announce count changes to screen readers */
  announceChanges?: boolean;  // default: true
  
  /** Test identifier */
  testID?: string;
}
```

#### Fixed Values (Not Configurable)

| Property | Token | Value |
|----------|-------|-------|
| Background | `color.badge.background.notification` | pink400 (#CC2257) |
| Text | `color.badge.text.notification` | white100 (#FFFFFF) |

**Contrast Ratio**: 6.33:1 ✅ (exceeds WCAG AA 4.5:1)

#### Live Region Behavior

When `announceChanges={true}` (default):

| Platform | Implementation |
|----------|----------------|
| Web | `aria-live="polite"`, `aria-atomic="true"`, visually hidden announcement text |
| iOS | `.accessibilityAddTraits(.updatesFrequently)`, `UIAccessibility.post(notification:)` |
| Android | `LiveRegionMode.Polite`, `announceForAccessibility()` |

**Announcement Format**:
- Single: "1 notification"
- Plural: "5 notifications"
- Overflow: "99 or more notifications"

#### Behavioral Contracts

Inherits all contracts from Badge-Count-Base, plus:

```yaml
contracts:
  notification_semantics:
    description: Conveys notification/alert meaning through color
    wcag: "1.3.1"
    
  announces_count_changes:
    description: Announces count changes to screen readers when enabled
    wcag: "4.1.3"
    
  pluralized_announcements:
    description: Uses correct pluralization in announcements
    wcag: "4.1.3"
```

---

## Data Models

### New Token Definitions

#### Semantic Color Tokens

```typescript
// src/tokens/semantic/ColorTokens.ts

'color.badge.background.notification': {
  name: 'color.badge.background.notification',
  primitiveReferences: { value: 'pink400' },
  category: SemanticCategory.COLOR,
  context: 'Background color for notification badges',
}

'color.badge.text.notification': {
  name: 'color.badge.text.notification',
  primitiveReferences: { value: 'white100' },
  category: SemanticCategory.COLOR,
  context: 'Text color on notification badge background',
}
```

#### Component Token

```typescript
// src/components/core/Badge-Label-Base/tokens.ts

import { defineComponentTokens } from '../../../build/tokens/defineComponentTokens';

export const BadgeLabelBaseTokens = defineComponentTokens({
  component: 'Badge-Label-Base',
  family: 'spacing',
  tokens: {
    'maxWidth': {
      value: '120px',
      reasoning: 'Maximum width for truncated badges; allows ~12-15 characters before ellipsis',
    },
  },
});
```

---

## Error Handling

### Invalid Props

| Scenario | Behavior |
|----------|----------|
| `label` is empty string | Render empty badge (consumer responsibility) |
| `count` is negative | Render absolute value or 0 |
| `count` is NaN | Render 0 |
| `max` is 0 or negative | Use default (99) |
| `icon` is invalid | Render badge without icon, log warning |

### Edge Cases

| Scenario | Behavior |
|----------|----------|
| Very long label (no truncate) | Badge grows to fit; may break layout |
| Very long label (truncate=true) | Truncate at `badge.label.maxWidth` with ellipsis |
| count = max | Show exact value (e.g., "99") |
| count = max + 1 | Show "[max]+" (e.g., "99+") |

---

## Testing Strategy

### Test Categories

All badge tests are **evergreen** (permanent) — no migration-specific temporary tests.

### Unit Tests

#### Badge-Label-Base
- Label rendering with various text lengths
- Size variants apply correct tokens
- Icon rendering with Icon-Base integration
- Truncation behavior with title attribute
- Non-interactivity (no focus, no click handlers)

#### Badge-Count-Base
- Count rendering for single/double/triple digits
- Circular vs pill shape based on digit count
- Max truncation ("99+")
- showZero behavior
- Size variants apply correct tokens
- Non-interactivity

#### Badge-Count-Notification
- Notification color tokens applied
- Live region attributes present (Web)
- Announcement text pluralization
- announceChanges opt-out behavior

### Stemma Validator Tests

```typescript
describe('Stemma System Validation', () => {
  it('should pass component naming validation', () => {
    expect(validateComponentName('Badge-Label-Base')).toEqual({
      isValid: true,
      segments: ['Badge', 'Label', 'Base'],
      componentType: 'type-primitive'
    });
  });
  
  it('should pass token usage validation', () => {
    const result = validateTokenUsage(BadgeLabelBaseComponent);
    expect(result.hasHardcodedValues).toBe(false);
  });
  
  it('should pass accessibility validation', () => {
    const result = validatePropertyAndAccessibility(BadgeLabelBaseComponent);
    expect(result.isValid).toBe(true);
  });
});
```

### Accessibility Tests

- Screen reader text verification
- Contrast ratio validation
- Text scaling at 200%
- Live region announcement verification (Badge-Count-Notification)

---

## Design Decisions

### Decision 1: Type Primitives as Consumer-Facing

**Options Considered**:
1. Family-level Badge-Base with Type-specific variants
2. Type Primitives as consumer-facing (like Input-Text-Base)

**Decision**: Type Primitives are consumer-facing

**Rationale**: Aligns with established Stemma pattern (Input-Text-Base). Each Type owns its structure; prevents over-abstraction.

**Trade-offs**: Slightly more components to document, but clearer API boundaries.

---

### Decision 2: radiusSubtle for Label, radiusHalf for Count

**Options Considered**:
1. Same radius for all badges
2. Different radius based on badge type

**Decision**: Badge-Label-Base uses `radiusSubtle` (2px); Badge-Count-Base uses `radiusHalf` (circular/pill)

**Rationale**: Count badges are typically paired with interactive elements (buttons, icons); pill shape creates visual association with interaction. Label badges are standalone metadata; subtle radius maintains readability focus.

**Trade-offs**: Visual inconsistency within family, but family groups by purpose, not aesthetics.

---

### Decision 3: Boolean truncate Prop with Component Token

**Options Considered**:
1. Per-instance `maxWidth` prop
2. Boolean `truncate` with component-defined max-width
3. Always truncate at fixed width

**Decision**: Boolean `truncate` prop with `badge.label.maxWidth` component token

**Rationale**: Consumer opts into truncation; max-width defined at design system level ensures consistency. Prevents "design by developer" where each instance picks arbitrary widths.

**Trade-offs**: Less flexibility for edge cases, but badges should be compact — if you need more width, reconsider the component choice.

---

### Decision 4: Live Region Announcements for Notification Variant

**Options Considered**:
1. Leave announcements to consumers
2. Bake announcements into Badge-Count-Notification with opt-out

**Decision**: Built-in announcements with `announceChanges` opt-out prop (default: true)

**Rationale**: Notifications are time-sensitive information; screen reader users need proactive updates. Baking in good defaults prevents accessibility gaps. Opt-out available for cases where parent handles announcements.

**Trade-offs**: Potential double-announcements if parent also announces, but opt-out handles this.

---

### Decision 5: Industry-Standard Token Naming

**Options Considered**:
1. Follow current Avatar pattern (`color.avatar.human`)
2. Adopt industry-standard pattern (`color.badge.background.notification`)

**Decision**: Use `[semantic token family].[component].[property].[variant]` pattern

**Rationale**: Research showed property-explicit naming is industry standard (Atlassian, Polaris, Carbon). Badge serves as reference implementation for Spec 051 migration.

**Trade-offs**: Inconsistent with existing Avatar tokens until Spec 051 migration.

---

## Platform Considerations

### Web

```html
<!-- Custom Elements -->
<badge-label-base label="Draft"></badge-label-base>
<badge-count-base count="5"></badge-count-base>
<badge-count-notification count="5"></badge-count-notification>
```

- Shadow DOM for style encapsulation
- CSS custom properties for token consumption
- `aria-live` for notification announcements

### iOS

```swift
// SwiftUI Views
BadgeLabelBase(label: "Draft")
BadgeCountBase(count: 5)
BadgeCountNotification(count: 5)
```

- Token consumption via Swift extensions
- `UIAccessibility.post(notification:)` for announcements

### Android

```kotlin
// Jetpack Compose
BadgeLabelBase(label = "Draft")
BadgeCountBase(count = 5)
BadgeCountNotification(count = 5)
```

- Token consumption via Kotlin extensions
- `LiveRegionMode.Polite` for announcements

---

## Related Documentation

- **Design Outline**: `.kiro/specs/044-badge-base/design-outline.md`
- **Requirements**: `.kiro/specs/044-badge-base/requirements.md`
- **Spec 051**: Semantic Token Naming Restructure (token migration plan)
- **Stemma System**: `.kiro/steering/stemma-system-principles.md`
- **Test Development Standards**: `.kiro/steering/Test-Development-Standards.md`

---

**Organization**: spec-guide
**Scope**: 044-badge-base
