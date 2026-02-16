# Progress-Stepper-Base

**Family**: Progress Indicator
**Type**: Semantic (Base)
**Readiness**: Development
**Platforms**: Web, iOS, Android

---

## Overview

Progress-Stepper-Base is a semantic component that composes Progress-Indicator-Node-Base and Progress-Indicator-Connector-Base primitives to create a stepper indicator for linear multi-step flows.

It renders nodes connected by lines — no labels. State derivation follows a priority system: error > completed > current > incomplete. Completed nodes display a checkmark; all others display a dot.

### Key Characteristics

- Composes Node-Base + Connector-Base (no Label-Base)
- State priority: error > completed > current > incomplete
- Completed nodes get `content='checkmark'`, all others get `content='none'`
- Connectors: active between completed nodes, inactive otherwise
- 2 sizes: `md`, `lg` only (`sm` throws an error)
- Max 8 steps (dev: throws, production: warns and clamps)
- Non-interactive — navigation is handled by the parent flow
- Accessibility: `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`

### Use Cases

- Multi-step form wizards
- Checkout flows
- Account setup sequences
- Linear workflow progress tracking

---

## Usage

### Web (Custom Element)

```html
<!-- Basic: 5 steps, current is 3 -->
<progress-stepper-base total-steps="5" current-step="3" size="md"></progress-stepper-base>

<!-- Large size -->
<progress-stepper-base total-steps="4" current-step="2" size="lg"></progress-stepper-base>

<!-- With error steps -->
<progress-stepper-base total-steps="5" current-step="3" size="md" error-steps="2"></progress-stepper-base>

<!-- Multiple error steps -->
<progress-stepper-base total-steps="6" current-step="4" size="lg" error-steps="2,5"></progress-stepper-base>

<!-- Custom accessibility label -->
<progress-stepper-base
  total-steps="5"
  current-step="3"
  accessibility-label="Checkout progress: step 3 of 5"
></progress-stepper-base>
```

### iOS (SwiftUI)

```swift
// Basic: 5 steps, current is 3
ProgressStepperBase(totalSteps: 5, currentStep: 3, size: .md)

// Large size
ProgressStepperBase(totalSteps: 4, currentStep: 2, size: .lg)

// With error steps
ProgressStepperBase(totalSteps: 5, currentStep: 3, size: .md, errorSteps: [2])

// Multiple error steps
ProgressStepperBase(totalSteps: 6, currentStep: 4, size: .lg, errorSteps: [2, 5])

// Custom accessibility label
ProgressStepperBase(
    totalSteps: 5,
    currentStep: 3,
    accessibilityLabel: "Checkout progress: step 3 of 5"
)
```

### Android (Jetpack Compose)

```kotlin
// Basic: 5 steps, current is 3
ProgressStepperBase(totalSteps = 5, currentStep = 3, size = ProgressNodeSize.MD)

// Large size
ProgressStepperBase(totalSteps = 4, currentStep = 2, size = ProgressNodeSize.LG)

// With error steps
ProgressStepperBase(totalSteps = 5, currentStep = 3, size = ProgressNodeSize.MD, errorSteps = listOf(2))

// Multiple error steps
ProgressStepperBase(totalSteps = 6, currentStep = 4, size = ProgressNodeSize.LG, errorSteps = listOf(2, 5))

// Custom accessibility label
ProgressStepperBase(
    totalSteps = 5,
    currentStep = 3,
    accessibilityLabel = "Checkout progress: step 3 of 5"
)
```

---

## API Reference

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `totalSteps` | `number` | — | Yes | Total number of steps. Max 8 |
| `currentStep` | `number` | — | Yes | Current active step (1-indexed). Clamped to [1, totalSteps] |
| `size` | `'md' \| 'lg'` | `'md'` | No | Size variant. `sm` is not supported and throws an error |
| `errorSteps` | `number[]` | `[]` | No | Array of step indices (1-indexed) in error state. Filtered to valid range |
| `accessibilityLabel` | `string` | `'Step {currentStep} of {totalSteps}'` | No | Custom accessibility label override |
| `testID` | `string` | `undefined` | No | Test identifier (web: `data-testid`, iOS: `accessibilityIdentifier`, Android: `testTag`) |

### Constants

| Constant | Value | Description |
|----------|-------|-------------|
| `STEPPER_MAX_STEPS` | 8 | Maximum supported steps |

### Validation Behavior

| Condition | Development | Production |
|-----------|-------------|------------|
| `totalSteps > 8` | Throws `Error` with guidance | `console.warn` + clamp to 8 |
| `size = 'sm'` | Throws `Error` | Throws `Error` |
| `currentStep < 1` | Clamps to 1 | Clamps to 1 |
| `currentStep > totalSteps` | Clamps to `totalSteps` | Clamps to `totalSteps` |
| `errorSteps` out of range | Filtered to [1, totalSteps] | Filtered to [1, totalSteps] |

### Utility Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `deriveStepperNodeState` | `(index, currentStep, errorSteps) → NodeState` | Derives state with priority: error > completed > current > incomplete |
| `deriveStepperNodeContent` | `(state) → NodeContent` | Returns `'checkmark'` for completed, `'none'` for all others |
| `deriveConnectorState` | `(leftState, rightState) → ConnectorState` | Returns `'active'` when both sides completed, `'inactive'` otherwise |
| `clampCurrentStep` | `(currentStep, totalSteps) → number` | Clamps to valid range [1, totalSteps] |
| `filterErrorSteps` | `(errorSteps, totalSteps) → number[]` | Filters to valid range [1, totalSteps] |

---

## Composition

Progress-Stepper-Base composes two primitives:

| Primitive | Usage | Props Passed |
|-----------|-------|--------------|
| [Node-Base](../Progress-Indicator-Node-Base/README.md) | One per step | `state` (derived), `size`, `content` (checkmark or none) |
| [Connector-Base](../Progress-Indicator-Connector-Base/README.md) | One between each adjacent pair (n-1 total) | `state` (active or inactive) |

**Not composed:**
- Label-Base — Stepper-Base has no text labels (see [Stepper-Detailed](../Progress-Stepper-Detailed/README.md) for labels)

### Composition Diagram

```
Progress-Stepper-Base
├── Node-Base (step 1)
├── Connector-Base (between 1–2)
├── Node-Base (step 2)
├── Connector-Base (between 2–3)
├── Node-Base (step 3)
├── ...
└── Node-Base (step N)
```

### State Derivation Logic

Each node's state is derived using priority logic:

| Priority | State | Condition |
|----------|-------|-----------|
| 1 (highest) | `error` | Step index is in `errorSteps` |
| 2 | `completed` | Step index < `currentStep` and not in `errorSteps` |
| 3 | `current` | Step index === `currentStep` and not in `errorSteps` |
| 4 (lowest) | `incomplete` | Step index > `currentStep` |

**Node content** is derived from state:
- `completed` → `content='checkmark'` (displays ✓)
- All others → `content='none'` (displays dot)

**Connector state** is derived from adjacent nodes:
- Both sides `completed` → `state='active'` (green line)
- Any other combination → `state='inactive'` (gray line)

### Example: 5 steps, currentStep=3, errorSteps=[5]

| Step | State | Content | Connector After |
|------|-------|---------|-----------------|
| 1 | completed | checkmark | active (1→2 both completed) |
| 2 | completed | checkmark | inactive (2→3 completed→current) |
| 3 | current | none | inactive (3→4 current→incomplete) |
| 4 | incomplete | none | inactive (4→5 incomplete→error) |
| 5 | error | none | — |

---

## Token Dependencies

### Component Size Tokens (`progress.node.size.*`)

| Token | Value | Usage |
|-------|-------|-------|
| `progress.node.size.md` | 16px | Medium node base size |
| `progress.node.size.lg` | 24px | Large node base size |
| `progress.node.size.md.current` | 20px | Medium current emphasis (+4px) |
| `progress.node.size.lg.current` | 28px | Large current emphasis (+4px) |

Note: `sm` size tokens exist but are not used by Stepper-Base (sm throws an error).

### Component Gap Tokens (`progress.node.gap.*`)

| Token | CSS Custom Property | Value | Primitive | Usage |
|-------|---------------------|-------|-----------|-------|
| `progress.node.gap.md` | `--progress-node-gap-md` | 8px | `space100` | Spacing between md elements |
| `progress.node.gap.lg` | `--progress-node-gap-lg` | 12px | `space150` | Spacing between lg elements |

### Connector Thickness Token

| Token | Value | Primitive | Usage |
|-------|-------|-----------|-------|
| `progress.connector.thickness` | 1px | `borderDefault` | Line thickness between nodes |

### Semantic Color Tokens (via primitives)

Color tokens are applied by the Node-Base and Connector-Base primitives, not directly by Stepper-Base:

| Token | Primitive | State |
|-------|-----------|-------|
| `color.progress.current.background` | `cyan300` | Current node |
| `color.progress.completed.background` | `green100` | Completed node |
| `color.progress.completed.text` | `green400` | Checkmark on completed node |
| `color.progress.pending.background` | `white300` | Incomplete node |
| `color.progress.error.background` | `pink100` | Error node |
| `color.progress.error.text` | `pink400` | Icon on error node |
| `color.progress.completed.connector` | `green100` | Active connector |
| `color.progress.pending.connector` | `white200` | Inactive connector |

**Token source files:**
- Semantic: `src/tokens/semantic/color-progress.ts`
- Component: `src/tokens/component/progress.ts`

---

## Accessibility

### ARIA Implementation

| Platform | Role | Attributes |
|----------|------|------------|
| Web | `role="progressbar"` | `aria-valuenow={currentStep}`, `aria-valuemin={1}`, `aria-valuemax={totalSteps}`, `aria-label` |
| iOS | `.accessibilityAddTraits(.updatesFrequently)` | `.accessibilityValue("Step X of Y")`, `.accessibilityLabel` |
| Android | `semantics { progressBarRangeInfo }` | `contentDescription`, `ProgressBarRangeInfo(current, range)` |

### Key Accessibility Behaviors

- Default label: "Step {currentStep} of {totalSteps}"
- Custom `accessibilityLabel` prop overrides the default
- Current node has non-color differentiation via +4px size emphasis
- Screen reader announces step position within the total

### WCAG 2.1 AA Compliance

- **1.3.1 Info and Relationships**: `role="progressbar"` with `aria-value*` attributes conveys step position
- **1.4.11 Non-text Contrast**: Current node size emphasis (+4px) provides non-color differentiation
- **4.1.2 Name, Role, Value**: `aria-valuenow`, `aria-valuemin`, `aria-valuemax` reflect actual step position

---

## Platform-Specific Notes

### Web
- Custom Element: `<progress-stepper-base>`
- Shadow DOM for style encapsulation
- CSS custom properties for gap tokens (with fallback values)
- Attributes use kebab-case: `total-steps`, `current-step`, `error-steps`, `accessibility-label`, `test-id`
- Composes `<progress-indicator-node-base>` and `<progress-indicator-connector-base>` in shadow DOM
- Flexbox layout with `gap` for spacing

### iOS
- SwiftUI `View` struct: `ProgressStepperBase`
- Uses `HStack` with `spacing` from gap token values
- Composes `ProgressIndicatorNodeBase` and `ProgressIndicatorConnectorBase` views via `ForEach`
- Accessibility: `.accessibilityElement(children: .ignore)` with `.accessibilityValue` and `.accessibilityLabel`
- Debug builds use `assertionFailure` for totalSteps > 8; `precondition` for size = sm

### Android
- Jetpack Compose `@Composable` function: `ProgressStepperBase`
- Uses `Row` with `Arrangement.spacedBy` from gap token values
- Connectors wrapped in `Box(modifier = Modifier.weight(1f))` for flexible length
- Accessibility: `semantics { contentDescription; progressBarRangeInfo }` 
- Debug builds throw `IllegalArgumentException` for totalSteps > 8; `require` for size = sm

---

## Related Documentation

- [Node-Base](../Progress-Indicator-Node-Base/README.md) — Primitive node composed by this component
- [Connector-Base](../Progress-Indicator-Connector-Base/README.md) — Primitive connector composed by this component
- [Label-Base](../Progress-Indicator-Label-Base/README.md) — Primitive label (not used by Stepper-Base)
- [Pagination-Base](../Progress-Pagination-Base/README.md) — Semantic variant: dots only, supports sm size
- [Stepper-Detailed](../Progress-Stepper-Detailed/README.md) — Semantic variant: nodes + connectors + labels + icons
- [Spec Requirements](/.kiro/specs/048-progress-family/requirements.md) — Requirements 3.1–3.17, 7.3, 7.12, 8.4–8.5, 8.8–8.10, 10.3–10.7, 11.7–11.13
- [Spec Design](/.kiro/specs/048-progress-family/design.md) — Design specification
- [Design Outline](/.kiro/specs/048-progress-family/design-outline.md) — Original design outline
