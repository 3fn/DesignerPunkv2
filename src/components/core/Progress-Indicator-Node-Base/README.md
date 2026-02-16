# Progress-Indicator-Node-Base

**Family**: Progress Indicator
**Type**: Primitive (Base)
**Readiness**: Development
**Platforms**: Web, iOS, Android

---

## Overview

Progress-Indicator-Node-Base is the foundational primitive for the Progress Indicator family. It renders a circular indicator element with state-based visual treatment — color, size emphasis, and optional content (dot, checkmark, icon).

This component is non-interactive and decorative. Accessibility (ARIA roles, labels) is handled by the semantic variants that compose it: Pagination-Base, Stepper-Base, and Stepper-Detailed.

### Key Characteristics

- 4 states: `incomplete`, `current`, `completed`, `error`
- 3 sizes: `sm` (12px), `md` (16px), `lg` (24px)
- Current state applies +4px size emphasis (e.g., md: 16px → 20px)
- `sm` size always renders as a filled dot (content prop ignored)
- `md`/`lg` sizes support content: empty circle, checkmark, or custom icon
- Size transitions respect `prefers-reduced-motion`

---

## Usage

### Web (Custom Element)

```html
<!-- Basic: current state, medium size -->
<progress-indicator-node-base state="current" size="md"></progress-indicator-node-base>

<!-- Completed with checkmark -->
<progress-indicator-node-base state="completed" size="lg" content="checkmark"></progress-indicator-node-base>

<!-- Error with custom icon -->
<progress-indicator-node-base state="error" size="md" content="icon" icon="alert-circle"></progress-indicator-node-base>

<!-- Small: always renders as dot -->
<progress-indicator-node-base state="incomplete" size="sm"></progress-indicator-node-base>
```

### iOS (SwiftUI)

```swift
// Basic: current state, medium size
ProgressIndicatorNodeBase(state: .current, size: .md)

// Completed with checkmark
ProgressIndicatorNodeBase(state: .completed, size: .lg, content: .checkmark)

// Error with custom icon
ProgressIndicatorNodeBase(state: .error, size: .md, content: .icon, icon: "alert-circle")

// Small: always renders as dot
ProgressIndicatorNodeBase(state: .incomplete, size: .sm)
```

### Android (Jetpack Compose)

```kotlin
// Basic: current state, medium size
ProgressIndicatorNodeBase(state = ProgressNodeState.CURRENT, size = ProgressNodeSize.MD)

// Completed with checkmark
ProgressIndicatorNodeBase(
    state = ProgressNodeState.COMPLETED,
    size = ProgressNodeSize.LG,
    content = ProgressNodeContent.CHECKMARK
)

// Error with custom icon
ProgressIndicatorNodeBase(
    state = ProgressNodeState.ERROR,
    size = ProgressNodeSize.MD,
    content = ProgressNodeContent.ICON,
    icon = "alert-circle"
)

// Small: always renders as dot
ProgressIndicatorNodeBase(state = ProgressNodeState.INCOMPLETE, size = ProgressNodeSize.SM)
```

---

## API Reference

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `state` | `'incomplete' \| 'current' \| 'completed' \| 'error'` | — | Yes | Visual state determining color and size treatment |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | No | Size variant. sm=12px, md=16px, lg=24px base |
| `content` | `'none' \| 'checkmark' \| 'icon'` | `'none'` | No | Content inside node. `sm` always renders as dot |
| `icon` | `string` | `undefined` | No | Icon name when `content='icon'`. Only applies to md/lg |
| `testID` | `string` | `undefined` | No | Test identifier (web: `data-testid`, iOS: `accessibilityIdentifier`, Android: `testTag`) |

### Size Values

| Size | Base | Current (+4px) |
|------|------|----------------|
| `sm` | 12px | 16px |
| `md` | 16px | 20px |
| `lg` | 24px | 28px |

### Content Rendering by Size

| Size | `content='none'` | `content='checkmark'` | `content='icon'` |
|------|-------------------|-----------------------|-------------------|
| `sm` | Filled dot | Filled dot (ignored) | Filled dot (ignored) |
| `md` | Empty circle | Checkmark icon | Custom icon |
| `lg` | Empty circle | Checkmark icon | Custom icon |

---

## Token Dependencies

### Semantic Color Tokens (`color.progress.*`)

| Token | Primitive | Usage |
|-------|-----------|-------|
| `color.progress.current.background` | `cyan300` | Current node background |
| `color.progress.current.text` | `cyan400` | Current node content color |
| `color.progress.pending.background` | `white300` | Incomplete node background |
| `color.progress.pending.text` | `gray300` | Incomplete node content color |
| `color.progress.completed.background` | `green100` | Completed node background |
| `color.progress.completed.text` | `green400` | Completed node content color |
| `color.progress.error.background` | `pink100` | Error node background |
| `color.progress.error.text` | `pink400` | Error node content color |

### Component Size Tokens (`progress.node.size.*`)

| Token | Value | Usage |
|-------|-------|-------|
| `progress.node.size.sm` | 12px | Small base size |
| `progress.node.size.md` | 16px | Medium base size |
| `progress.node.size.lg` | 24px | Large base size |
| `progress.node.size.sm.current` | 16px | Small current emphasis |
| `progress.node.size.md.current` | 20px | Medium current emphasis |
| `progress.node.size.lg.current` | 28px | Large current emphasis |

**Token source files:**
- Semantic: `src/tokens/semantic/color-progress.ts`
- Component: `src/tokens/component/progress.ts`

---

## Accessibility

This primitive is **decorative** — it is hidden from assistive technology on all platforms:

| Platform | Mechanism |
|----------|-----------|
| Web | `aria-hidden="true"`, `role="presentation"` |
| iOS | `accessibilityHidden(true)` |
| Android | `clearAndSetSemantics { }` |

Semantic variants (Pagination-Base, Stepper-Base, Stepper-Detailed) provide ARIA roles, labels, and screen reader announcements.

### WCAG 2.1 AA Compliance

- **1.4.3 Contrast (Minimum)**: State colors meet 4.5:1 contrast ratio
- **1.4.11 Non-text Contrast**: Size emphasis provides non-color differentiation for current state
- **2.3.3 Animation from Interactions**: Size transitions disabled when `prefers-reduced-motion` is enabled

### High Contrast Mode

On web, a 1px `currentColor` border is applied when `prefers-contrast: high` is active.

---

## Platform-Specific Notes

### Web
- Custom Element: `<progress-indicator-node-base>`
- Shadow DOM for style encapsulation
- CSS custom properties for token-based styling (fallback values included)
- Checkmark uses inline SVG (Feather Icons `check` path)
- Custom icons rendered via `<icon-base>` element

### iOS
- SwiftUI `View` struct
- Uses `Circle()` shape with `.fill()` for backgrounds
- Checkmark via `Image(systemName: "checkmark")`
- Custom icons via `IconBase` component
- Animation controlled by `UIAccessibility.isReduceMotionEnabled`

### Android
- Jetpack Compose `@Composable` function
- Uses `Box` with `CircleShape` clip and `background` modifier
- Checkmark via `Icons.Filled.Check`
- Custom icons via `IconBase` composable
- Size transitions animated with `animateDpAsState` (respects system motion settings)

---

## Related Documentation

- [Connector-Base](../Progress-Indicator-Connector-Base/README.md) — Primitive connector line between nodes
- [Label-Base](../Progress-Indicator-Label-Base/README.md) — Primitive label positioned below nodes
- [Pagination-Base](../Progress-Pagination-Base/README.md) — Semantic variant: dot pagination
- [Stepper-Base](../Progress-Stepper-Base/README.md) — Semantic variant: nodes + connectors
- [Stepper-Detailed](../Progress-Stepper-Detailed/README.md) — Semantic variant: nodes + connectors + labels
- [Spec Requirements](/.kiro/specs/048-progress-family/requirements.md) — Requirements 1.1–1.5, 12.1–12.16
- [Spec Design](/.kiro/specs/048-progress-family/design.md) — Design specification
- [Design Outline](/.kiro/specs/048-progress-family/design-outline.md) — Original design outline
