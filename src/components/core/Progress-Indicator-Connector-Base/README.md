# Progress-Indicator-Connector-Base

**Family**: Progress Indicator
**Type**: Primitive (Base)
**Readiness**: Development
**Platforms**: Web, iOS, Android

---

## Overview

Progress-Indicator-Connector-Base is a primitive component that renders a horizontal connecting line between progress indicator nodes. It provides state-based color treatment to visually communicate whether the path between two steps has been traversed.

This component is non-interactive and decorative. Accessibility (ARIA roles, labels) is handled by the semantic variants that compose it: Stepper-Base and Stepper-Detailed. Pagination-Base does not use connectors.

### Key Characteristics

- 2 states: `active`, `inactive`
- 1px thickness via `borderDefault` token
- Flexible length — fills available space between adjacent nodes
- Decorative primitive — hidden from assistive technology on all platforms

---

## Usage

### Web (Custom Element)

```html
<!-- Active connector (between completed nodes) -->
<progress-indicator-connector-base state="active"></progress-indicator-connector-base>

<!-- Inactive connector (between incomplete nodes) -->
<progress-indicator-connector-base state="inactive"></progress-indicator-connector-base>

<!-- With test ID -->
<progress-indicator-connector-base state="active" test-id="step-1-2-connector"></progress-indicator-connector-base>
```

### iOS (SwiftUI)

```swift
// Active connector (between completed nodes)
ProgressIndicatorConnectorBase(state: .active)

// Inactive connector (between incomplete nodes)
ProgressIndicatorConnectorBase(state: .inactive)

// With test ID
ProgressIndicatorConnectorBase(state: .active, testID: "step-1-2-connector")
```

### Android (Jetpack Compose)

```kotlin
// Active connector (between completed nodes)
ProgressIndicatorConnectorBase(state = ProgressConnectorState.ACTIVE)

// Inactive connector (between incomplete nodes)
ProgressIndicatorConnectorBase(state = ProgressConnectorState.INACTIVE)

// With test tag
ProgressIndicatorConnectorBase(
    state = ProgressConnectorState.ACTIVE,
    testTag = "step-1-2-connector"
)
```


---

## API Reference

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `state` | `'active' \| 'inactive'` | `'inactive'` | Yes | Visual state determining connector color |
| `testID` | `string` | `undefined` | No | Test identifier (web: `data-testid`, iOS: `accessibilityIdentifier`, Android: `testTag`) |

### State Semantics

| State | Color Token | Primitive | Meaning |
|-------|-------------|-----------|---------|
| `active` | `color.progress.completed.connector` | `green100` | Path between completed nodes — progress has been made |
| `inactive` | `color.progress.pending.connector` | `white200` | Path between incomplete nodes — progress not yet made |

### Connector State Rules (set by semantic variants)

Semantic variants determine connector state based on the nodes on either side:

- Connectors between two **completed** nodes → `active`
- All other connectors → `inactive`

---

## Token Dependencies

### Semantic Color Tokens (`color.progress.*.connector`)

| Token | Primitive | Usage |
|-------|-----------|-------|
| `color.progress.completed.connector` | `green100` | Active connector color — traversed path |
| `color.progress.pending.connector` | `white200` | Inactive connector color — untraversed path |

### Component Tokens (`progress.connector.*`)

| Token | Reference | Value | Usage |
|-------|-----------|-------|-------|
| `progress.connector.thickness` | `borderWidth100` (borderDefault) | 1px | Connector line height |

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

Semantic variants (Stepper-Base, Stepper-Detailed) provide ARIA roles, labels, and screen reader announcements. The connector itself carries no semantic meaning for assistive technology — progress state is communicated through the variant's ARIA attributes.

### WCAG 2.1 AA Compliance

- **1.4.11 Non-text Contrast**: Connector colors meet contrast requirements against the component background

---

## Platform-Specific Notes

### Web
- Custom Element: `<progress-indicator-connector-base>`
- Shadow DOM for style encapsulation
- CSS custom properties for token-based styling with fallback values
- Uses CSS logical properties (`inline-size`, `block-size`) for RTL/LTR support
- Flexible length via `flex: 1` on the host element
- Rendered as a `<span>` with background color

### iOS
- SwiftUI `View` struct (`ProgressIndicatorConnectorBase`)
- Uses `Rectangle()` shape with `.fill()` for color
- Flexible length via `.frame(maxWidth: .infinity)`
- Thickness set via `.frame(height: connectorThickness)` referencing `DesignTokens.borderWidth100`
- Hidden from VoiceOver via `.accessibilityHidden(true)`

### Android
- Jetpack Compose `@Composable` function (`ProgressIndicatorConnectorBase`)
- Uses `Box` with `.background(color)` modifier
- Flexible length via `.fillMaxWidth()`
- Thickness set via `.height(connectorThickness)` referencing `DesignTokens.border_width_100`
- Hidden from TalkBack via `.clearAndSetSemantics { }`

---

## Related Documentation

- [Node-Base](../Progress-Indicator-Node-Base/README.md) — Primitive circular indicator element
- [Label-Base](../Progress-Indicator-Label-Base/README.md) — Primitive label positioned below nodes
- [Pagination-Base](../Progress-Pagination-Base/README.md) — Semantic variant: dot pagination (does not use connectors)
- [Stepper-Base](../Progress-Stepper-Base/README.md) — Semantic variant: nodes + connectors
- [Stepper-Detailed](../Progress-Stepper-Detailed/README.md) — Semantic variant: nodes + connectors + labels
- [Spec Requirements](/.kiro/specs/048-progress-family/requirements.md) — Requirements 1.6–1.7, 12.10–12.12
- [Spec Design](/.kiro/specs/048-progress-family/design.md) — Design specification
- [Design Outline](/.kiro/specs/048-progress-family/design-outline.md) — Original design outline
