# Progress-Pagination-Base

**Family**: Progress Indicator
**Type**: Semantic (Base)
**Readiness**: Development
**Platforms**: Web, iOS, Android

---

## Overview

Progress-Pagination-Base is a semantic component that composes Progress-Indicator-Node-Base primitives to create a simple pagination indicator for carousels, onboarding flows, and multi-page sequences.

It renders dots only — no connectors, no labels. State derivation is binary: the current item gets state `current`, everything else is `incomplete`.

### Key Characteristics

- Composes Node-Base only (no Connector-Base, no Label-Base)
- All nodes use `content='none'` (dots only)
- Binary state: `current` or `incomplete`
- 3 sizes: `sm`, `md`, `lg`
- Virtualization: when `totalItems > 5`, a sliding window renders only 5 visible nodes
- Max 50 items (dev: throws, production: warns and clamps)
- Non-interactive — navigation is handled by the parent flow
- Accessibility: `role="group"` with `aria-label` reflecting actual position

### Use Cases

- Image carousels
- Onboarding step indicators
- Multi-page form position
- Swipeable content page indicators

---

## Usage

### Web (Custom Element)

```html
<!-- Basic: 5 items, current is 3 -->
<progress-pagination-base total-items="5" current-item="3" size="sm"></progress-pagination-base>

<!-- Virtualized: 20 items, only 5 dots visible -->
<progress-pagination-base total-items="20" current-item="10" size="md"></progress-pagination-base>

<!-- Large size -->
<progress-pagination-base total-items="8" current-item="4" size="lg"></progress-pagination-base>

<!-- Custom accessibility label -->
<progress-pagination-base
  total-items="10"
  current-item="3"
  accessibility-label="Slide 3 of 10"
></progress-pagination-base>
```

### iOS (SwiftUI)

```swift
// Basic: 5 items, current is 3, small dots
ProgressPaginationBase(totalItems: 5, currentItem: 3, size: .sm)

// Virtualized: 20 items, only 5 dots visible
ProgressPaginationBase(totalItems: 20, currentItem: 10, size: .md)

// Large size
ProgressPaginationBase(totalItems: 8, currentItem: 4, size: .lg)

// Custom accessibility label
ProgressPaginationBase(
    totalItems: 10,
    currentItem: 3,
    accessibilityLabel: "Slide 3 of 10"
)
```

### Android (Jetpack Compose)

```kotlin
// Basic: 5 items, current is 3, small dots
ProgressPaginationBase(totalItems = 5, currentItem = 3, size = ProgressNodeSize.SM)

// Virtualized: 20 items, only 5 dots visible
ProgressPaginationBase(totalItems = 20, currentItem = 10, size = ProgressNodeSize.MD)

// Large size
ProgressPaginationBase(totalItems = 8, currentItem = 4, size = ProgressNodeSize.LG)

// Custom accessibility label
ProgressPaginationBase(
    totalItems = 10,
    currentItem = 3,
    accessibilityLabel = "Slide 3 of 10"
)
```

---

## API Reference

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `totalItems` | `number` | — | Yes | Total number of items/pages. Max 50 |
| `currentItem` | `number` | — | Yes | Current active item (1-indexed). Clamped to [1, totalItems] |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | No | Size variant for all nodes |
| `accessibilityLabel` | `string` | `'Page {currentItem} of {totalItems}'` | No | Custom accessibility label override |
| `testID` | `string` | `undefined` | No | Test identifier (web: `data-testid`, iOS: `accessibilityIdentifier`, Android: `testTag`) |

### Constants

| Constant | Value | Description |
|----------|-------|-------------|
| `PAGINATION_MAX_ITEMS` | 50 | Maximum supported items |
| `PAGINATION_VISIBLE_WINDOW` | 5 | Max visible nodes when virtualized |

### Validation Behavior

| Condition | Development | Production |
|-----------|-------------|------------|
| `totalItems > 50` | Throws `Error` with guidance | `console.warn` + clamp to 50 |
| `currentItem < 1` | Clamps to 1 | Clamps to 1 |
| `currentItem > totalItems` | Clamps to `totalItems` | Clamps to `totalItems` |

### Utility Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `derivePaginationNodeState` | `(index, currentItem) → NodeState` | Returns `'current'` if index matches, `'incomplete'` otherwise |
| `calculateVisibleWindow` | `(currentItem, totalItems) → { start, end }` | Computes the 1-indexed visible window range |
| `clampCurrentItem` | `(currentItem, totalItems) → number` | Clamps to valid range [1, totalItems] |

---

## Composition

Progress-Pagination-Base composes a single primitive:

| Primitive | Usage | Props Passed |
|-----------|-------|--------------|
| [Node-Base](../Progress-Indicator-Node-Base/README.md) | One per visible item | `state` (current/incomplete), `size`, `content="none"` |

**Not composed:**
- Connector-Base — pagination uses dots without connecting lines
- Label-Base — pagination has no text labels

### Composition Diagram

```
Progress-Pagination-Base
└── Node-Base × N (where N = min(totalItems, 5))
    ├── state = derivePaginationNodeState(index, currentItem)
    ├── size = props.size
    └── content = "none" (always dots)
```

---

## Virtualization

When `totalItems > 5`, only 5 nodes are rendered using a sliding window algorithm. The window position depends on `currentItem`:

| Current Item Position | Visible Window | Example (50 items) |
|-----------------------|----------------|---------------------|
| Pages 1–3 (near start) | Nodes 1–5 | current=2 → show 1,2,3,4,5 |
| Pages 4 to (total−3) (middle) | current ±2 (centered) | current=26 → show 24,25,26,27,28 |
| Last 3 pages (near end) | Last 5 nodes | current=49 → show 46,47,48,49,50 |

### Window Behavior

- Window shifts immediately — no animation on window change
- Exactly 5 nodes are always visible when `totalItems > 5`
- When `totalItems ≤ 5`, all nodes render (no virtualization)
- ARIA label always reflects actual position (e.g., "Page 26 of 50"), not the visible subset

### Edge Cases

| Page | totalItems | Window |
|------|------------|--------|
| 1 | 50 | 1–5 |
| 3 | 50 | 1–5 |
| 4 | 50 | 2–6 |
| 26 | 50 | 24–28 |
| 47 | 50 | 45–49 |
| 48 | 50 | 46–50 |
| 50 | 50 | 46–50 |

---

## Token Dependencies

### Component Size Tokens (`progress.node.size.*`)

| Token | Value | Usage |
|-------|-------|-------|
| `progress.node.size.sm` | 12px | Small node base size |
| `progress.node.size.md` | 16px | Medium node base size |
| `progress.node.size.lg` | 24px | Large node base size |
| `progress.node.size.sm.current` | 16px | Small current emphasis (+4px) |
| `progress.node.size.md.current` | 20px | Medium current emphasis (+4px) |
| `progress.node.size.lg.current` | 28px | Large current emphasis (+4px) |

### Component Gap Tokens (`progress.node.gap.*`)

| Token | Value | Primitive | Usage |
|-------|-------|-----------|-------|
| `progress.node.gap.sm` | 6px | `space075` | Spacing between small nodes |
| `progress.node.gap.md` | 8px | `space100` | Spacing between medium nodes |
| `progress.node.gap.lg` | 12px | `space150` | Spacing between large nodes |

### Semantic Color Tokens (via Node-Base)

Color tokens are applied by the Node-Base primitive, not directly by Pagination-Base:

| Token | Primitive | State |
|-------|-----------|-------|
| `color.progress.current.background` | `cyan300` | Current node |
| `color.progress.pending.background` | `white300` | Incomplete nodes |

**Token source files:**
- Semantic: `src/tokens/semantic/color-progress.ts`
- Component: `src/tokens/component/progress.ts`

---

## Accessibility

### ARIA Implementation

| Platform | Role | Label |
|----------|------|-------|
| Web | `role="group"` | `aria-label="Page {currentItem} of {totalItems}"` |
| iOS | Grouped element | `accessibilityLabel("Page {currentItem} of {totalItems}")` |
| Android | Semantics block | `contentDescription = "Page {currentItem} of {totalItems}"` |

### Key Accessibility Behaviors

- ARIA label always reflects actual position, not the virtualized visible subset
- When virtualized, "Page 26 of 50" is announced — not "Page 3 of 5"
- Custom `accessibilityLabel` prop overrides the default label
- Current node has non-color differentiation via +4px size emphasis

### WCAG 2.1 AA Compliance

- **1.3.1 Info and Relationships**: `role="group"` with descriptive `aria-label`
- **1.4.11 Non-text Contrast**: Current node size emphasis provides non-color differentiation
- **4.1.2 Name, Role, Value**: `aria-label` reflects actual position, not virtualized subset

---

## Platform-Specific Notes

### Web
- Custom Element: `<progress-pagination-base>`
- Shadow DOM for style encapsulation
- CSS custom properties for gap tokens (with fallback values)
- Attributes use kebab-case: `total-items`, `current-item`, `accessibility-label`, `test-id`
- Composes `<progress-indicator-node-base>` elements in shadow DOM

### iOS
- SwiftUI `View` struct: `ProgressPaginationBase`
- Uses `HStack` with `spacing` from gap token values
- Composes `ProgressIndicatorNodeBase` views via `ForEach`
- Accessibility: `.accessibilityElement(children: .ignore)` with `.accessibilityLabel`
- Debug builds use `assertionFailure` for validation errors

### Android
- Jetpack Compose `@Composable` function: `ProgressPaginationBase`
- Uses `Row` with `Arrangement.spacedBy` from gap token values
- Composes `ProgressIndicatorNodeBase` composables in a loop
- Accessibility: `semantics { contentDescription = ... }`
- Debug builds throw `IllegalArgumentException` for validation errors

---

## Related Documentation

- [Node-Base](../Progress-Indicator-Node-Base/README.md) — Primitive node composed by this component
- [Connector-Base](../Progress-Indicator-Connector-Base/README.md) — Primitive connector (not used by Pagination)
- [Label-Base](../Progress-Indicator-Label-Base/README.md) — Primitive label (not used by Pagination)
- [Stepper-Base](../Progress-Stepper-Base/README.md) — Semantic variant: nodes + connectors
- [Stepper-Detailed](../Progress-Stepper-Detailed/README.md) — Semantic variant: nodes + connectors + labels
- [Spec Requirements](/.kiro/specs/048-progress-family/requirements.md) — Requirements 2.1–2.12, 7.1–7.2, 8.1–8.3, 9.1–9.7, 10.1–10.2, 11.1–11.6
- [Spec Design](/.kiro/specs/048-progress-family/design.md) — Design specification
- [Design Outline](/.kiro/specs/048-progress-family/design-outline.md) — Original design outline
