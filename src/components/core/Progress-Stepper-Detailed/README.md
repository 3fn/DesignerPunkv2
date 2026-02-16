# Progress-Stepper-Detailed

**Family**: Progress Indicator
**Type**: Semantic (Detailed)
**Readiness**: Development
**Platforms**: Web, iOS, Android

---

## Overview

Progress-Stepper-Detailed is a semantic component that composes all three Progress Indicator primitives — Node-Base, Connector-Base, and Label-Base — to create a detailed stepper with labels and optional icons for complex multi-step flows.

It extends Stepper-Base by adding labels below each node and supporting user-provided icons. A key behavior is icon precedence: completed steps always display a checkmark regardless of any user-provided icon. User icons only render for current, incomplete, or error states.

### Key Characteristics

- Composes Node-Base + Connector-Base + Label-Base (all three primitives)
- State priority: error > completed > current > incomplete
- Icon precedence: completed = checkmark always; user icon for current/incomplete/error only
- Connectors: active between completed nodes, inactive otherwise
- Labels: centered below each node with optional helper text and optional flag
- 2 sizes: `md`, `lg` only (`sm` throws an error)
- Max 8 steps (dev: throws, production: warns and clamps)
- Non-interactive — navigation is handled by the parent flow
- Accessibility: `role="list"` with `role="listitem"` per step; error/optional suffixes in aria-label

### Use Cases

- Desktop admin workflows with labeled steps
- Healthcare intake forms
- Complex checkout flows with step descriptions
- Multi-step wizards where users need to see step names and status

---

## Usage

### Web (Custom Element)

```html
<!-- Basic: 3 labeled steps, current is 2 -->
<progress-stepper-detailed
  steps='[{"label":"Personal Info"},{"label":"Payment"},{"label":"Review"}]'
  current-step="2"
  size="md"
></progress-stepper-detailed>

<!-- Large size with helper text -->
<progress-stepper-detailed
  steps='[{"label":"Account","helperText":"Email & password"},{"label":"Profile","helperText":"Name & photo"},{"label":"Done"}]'
  current-step="1"
  size="lg"
></progress-stepper-detailed>

<!-- With icons (only shown on non-completed steps) -->
<progress-stepper-detailed
  steps='[{"label":"Account","icon":"person"},{"label":"Payment","icon":"creditcard"},{"label":"Review"}]'
  current-step="2"
  size="md"
></progress-stepper-detailed>

<!-- With error steps and optional step -->
<progress-stepper-detailed
  steps='[{"label":"Info"},{"label":"Verify","icon":"shield"},{"label":"Extras","optional":true},{"label":"Submit"}]'
  current-step="2"
  size="lg"
  error-steps="2"
></progress-stepper-detailed>

<!-- Custom accessibility label -->
<progress-stepper-detailed
  steps='[{"label":"Step A"},{"label":"Step B"},{"label":"Step C"}]'
  current-step="1"
  accessibility-label="Onboarding progress: step 1 of 3"
></progress-stepper-detailed>
```

### iOS (SwiftUI)

```swift
// Basic: 3 labeled steps, current is 2
ProgressStepperDetailed(
    steps: [
        StepDefinitioniOS(label: "Personal Info"),
        StepDefinitioniOS(label: "Payment"),
        StepDefinitioniOS(label: "Review")
    ],
    currentStep: 2,
    size: .md
)

// With icons and error
ProgressStepperDetailed(
    steps: [
        StepDefinitioniOS(label: "Account", icon: "person"),
        StepDefinitioniOS(label: "Details", helperText: "Address & phone"),
        StepDefinitioniOS(label: "Verify", icon: "checkmark.shield"),
        StepDefinitioniOS(label: "Done")
    ],
    currentStep: 2,
    size: .lg,
    errorSteps: [3]
)

// With optional step
ProgressStepperDetailed(
    steps: [
        StepDefinitioniOS(label: "Required"),
        StepDefinitioniOS(label: "Optional", optional: true),
        StepDefinitioniOS(label: "Submit")
    ],
    currentStep: 1,
    size: .md
)
```

### Android (Jetpack Compose)

```kotlin
// Basic: 3 labeled steps, current is 2
ProgressStepperDetailed(
    steps = listOf(
        StepDefinitionAndroid(label = "Personal Info"),
        StepDefinitionAndroid(label = "Payment"),
        StepDefinitionAndroid(label = "Review")
    ),
    currentStep = 2,
    size = ProgressNodeSize.MD
)

// With icons and error
ProgressStepperDetailed(
    steps = listOf(
        StepDefinitionAndroid(label = "Account", icon = "person"),
        StepDefinitionAndroid(label = "Details", helperText = "Address & phone"),
        StepDefinitionAndroid(label = "Verify", icon = "shield"),
        StepDefinitionAndroid(label = "Done")
    ),
    currentStep = 2,
    size = ProgressNodeSize.LG,
    errorSteps = listOf(3)
)

// With optional step
ProgressStepperDetailed(
    steps = listOf(
        StepDefinitionAndroid(label = "Required"),
        StepDefinitionAndroid(label = "Optional", optional = true),
        StepDefinitionAndroid(label = "Submit")
    ),
    currentStep = 1,
    size = ProgressNodeSize.MD
)
```

---

## API Reference

### Props

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `steps` | `StepDefinition[]` | — | Yes | Array of step definitions. Max 8 |
| `currentStep` | `number` | — | Yes | Current active step (1-indexed). Clamped to [1, steps.length] |
| `size` | `'md' \| 'lg'` | `'md'` | No | Size variant. `sm` is not supported and throws an error |
| `errorSteps` | `number[]` | `[]` | No | Array of step indices (1-indexed) in error state. Filtered to valid range |
| `accessibilityLabel` | `string` | `'Step {currentStep} of {steps.length}'` | No | Custom accessibility label override |
| `testID` | `string` | `undefined` | No | Test identifier (web: `data-testid`, iOS: `accessibilityIdentifier`, Android: `testTag`) |

### StepDefinition

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `label` | `string` | Yes | Primary label text displayed below the node |
| `helperText` | `string` | No | Secondary text displayed below the label |
| `icon` | `string` | No | Icon name. Only renders for current/incomplete/error states (completed always shows checkmark) |
| `optional` | `boolean` | No | Marks the step as optional. Reflected in accessibility label |

### Constants

| Constant | Value | Description |
|----------|-------|-------------|
| `STEPPER_DETAILED_MAX_STEPS` | 8 | Maximum supported steps |

### Validation Behavior

| Condition | Development | Production |
|-----------|-------------|------------|
| `steps.length > 8` | Throws `Error` with guidance | `console.warn` + clamp to 8 |
| `size = 'sm'` | Throws `Error` | Throws `Error` |
| `currentStep < 1` | Clamps to 1 | Clamps to 1 |
| `currentStep > steps.length` | Clamps to `steps.length` | Clamps to `steps.length` |
| `errorSteps` out of range | Filtered to [1, steps.length] | Filtered to [1, steps.length] |

### Utility Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `deriveStepperDetailedNodeState` | `(index, currentStep, errorSteps) → NodeState` | Derives state with priority: error > completed > current > incomplete |
| `deriveStepperDetailedNodeContent` | `(state, step) → NodeContent` | Returns `'checkmark'` for completed, `'icon'` if step has icon, `'none'` otherwise |
| `deriveDetailedConnectorState` | `(leftState, rightState) → ConnectorState` | Returns `'active'` when both sides completed, `'inactive'` otherwise |
| `clampDetailedCurrentStep` | `(currentStep, totalSteps) → number` | Clamps to valid range [1, totalSteps] |
| `filterDetailedErrorSteps` | `(errorSteps, totalSteps) → number[]` | Filters to valid range [1, totalSteps] |

---

## Composition

Progress-Stepper-Detailed composes all three primitives:

| Primitive | Usage | Props Passed |
|-----------|-------|--------------|
| [Node-Base](../Progress-Indicator-Node-Base/README.md) | One per step | `state` (derived), `size`, `content` (checkmark, icon, or none), `icon` (name) |
| [Connector-Base](../Progress-Indicator-Connector-Base/README.md) | One between each adjacent pair (n-1 total) | `state` (active or inactive) |
| [Label-Base](../Progress-Indicator-Label-Base/README.md) | One per step | `label`, `helperText`, `optional` |

### Composition Diagram

```
Progress-Stepper-Detailed
├── Step 1 (column)
│   ├── Node Row
│   │   ├── Spacer (left edge)
│   │   ├── Node-Base (step 1)
│   │   └── Connector-Base (1→2)
│   └── Label-Base (step 1 label)
├── Step 2 (column)
│   ├── Node Row
│   │   ├── Connector-Base (1→2)
│   │   ├── Node-Base (step 2)
│   │   └── Connector-Base (2→3)
│   └── Label-Base (step 2 label)
├── ...
└── Step N (column)
    ├── Node Row
    │   ├── Connector-Base ((N-1)→N)
    │   ├── Node-Base (step N)
    │   └── Spacer (right edge)
    └── Label-Base (step N label)
```

### State Derivation Logic

Each node's state is derived using priority logic (same as Stepper-Base):

| Priority | State | Condition |
|----------|-------|-----------|
| 1 (highest) | `error` | Step index is in `errorSteps` |
| 2 | `completed` | Step index < `currentStep` and not in `errorSteps` |
| 3 | `current` | Step index === `currentStep` and not in `errorSteps` |
| 4 (lowest) | `incomplete` | Step index > `currentStep` |

### Icon Precedence Logic

Icon precedence ensures consistent completion signaling:

| Node State | Icon Provided? | Content Rendered | Rationale |
|------------|---------------|------------------|-----------|
| `completed` | Yes | Checkmark ✓ | User icon ignored — checkmark is universal "done" signal |
| `completed` | No | Checkmark ✓ | Always checkmark for completed |
| `current` | Yes | User icon | User icon renders for active states |
| `current` | No | Empty circle | No icon, no checkmark |
| `incomplete` | Yes | User icon | User icon renders for non-completed states |
| `incomplete` | No | Empty circle | No icon, no checkmark |
| `error` | Yes | User icon | User icon renders for error states |
| `error` | No | Empty circle | No icon, no checkmark |

**Connector state** is derived from adjacent nodes:
- Both sides `completed` → `state='active'` (green line)
- Any other combination → `state='inactive'` (gray line)

### Example: 4 steps, currentStep=2, errorSteps=[3], step 1 has icon "person"

| Step | State | Content | Icon | Label | Connector After |
|------|-------|---------|------|-------|-----------------|
| 1 | completed | checkmark | ignored | "Account" | inactive (completed→current) |
| 2 | current | none | — | "Payment" | inactive (current→error) |
| 3 | error | icon | "shield" | "Verify" | inactive (error→incomplete) |
| 4 | incomplete | none | — | "Done" | — |

---

## Token Dependencies

### Component Size Tokens (`progress.node.size.*`)

| Token | Value | Usage |
|-------|-------|-------|
| `progress.node.size.md` | 16px | Medium node base size |
| `progress.node.size.lg` | 24px | Large node base size |
| `progress.node.size.md.current` | 20px | Medium current emphasis (+4px) |
| `progress.node.size.lg.current` | 28px | Large current emphasis (+4px) |

Note: `sm` size tokens exist but are not used by Stepper-Detailed (sm throws an error).

### Component Gap Tokens (`progress.node.gap.*`)

| Token | CSS Custom Property | Value | Primitive | Usage |
|-------|---------------------|-------|-----------|-------|
| `progress.node.gap.md` | `--progress-node-gap-md` | 8px | `space100` | Vertical spacing between node and label (md) |
| `progress.node.gap.lg` | `--progress-node-gap-lg` | 12px | `space150` | Vertical spacing between node and label (lg) |

### Connector Thickness Token

| Token | Value | Primitive | Usage |
|-------|-------|-----------|-------|
| `progress.connector.thickness` | 1px | `borderDefault` | Line thickness between nodes |

### Semantic Color Tokens (via primitives)

Color tokens are applied by the Node-Base, Connector-Base, and Label-Base primitives, not directly by Stepper-Detailed:

| Token | Primitive | State |
|-------|-----------|-------|
| `color.progress.current.background` | `cyan300` | Current node |
| `color.progress.current.text` | `cyan400` | Text/icon on current node |
| `color.progress.completed.background` | `green100` | Completed node |
| `color.progress.completed.text` | `green400` | Checkmark on completed node |
| `color.progress.pending.background` | `white300` | Incomplete node |
| `color.progress.pending.text` | `gray300` | Text on incomplete node |
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
| Web | `role="list"` on container, `role="listitem"` per step | `aria-label` on container and each step |
| iOS | `.accessibilityElement(children: .contain)` | `.accessibilityLabel`, `.accessibilityHint("List of N steps")` |
| Android | `semantics { collectionInfo }` on container, `collectionItemInfo` per step | `contentDescription` |

### Key Accessibility Behaviors

- Default label: "Step {currentStep} of {steps.length}"
- Each step's aria-label: "Step X of Y: {label}"
- Error steps append ", error" to their aria-label
- Optional steps append ", optional" to their aria-label
- Custom `accessibilityLabel` prop overrides the container default
- Current node has non-color differentiation via +4px size emphasis
- Completed nodes have non-color differentiation via checkmark icon

### WCAG 2.1 AA Compliance

- **1.3.1 Info and Relationships**: `role="list"` with `role="listitem"` conveys step structure
- **1.4.11 Non-text Contrast**: Current node size emphasis (+4px) provides non-color differentiation
- **4.1.2 Name, Role, Value**: `aria-label` includes error/optional suffixes for state communication

---

## Platform-Specific Notes

### Web
- Custom Element: `<progress-stepper-detailed>`
- Shadow DOM for style encapsulation
- Steps passed as JSON string attribute: `steps='[{"label":"..."}]'`
- Attributes use kebab-case: `current-step`, `error-steps`, `accessibility-label`, `test-id`
- Composes `<progress-indicator-node-base>`, `<progress-indicator-connector-base>`, and `<progress-indicator-label-base>` in shadow DOM
- Flexbox layout: each step is a column with node row on top, label below
- CSS custom properties for gap tokens with fallback values
- CSS uses logical properties (`inline-size`, `block-start`) for RTL support

### iOS
- SwiftUI `View` struct: `ProgressStepperDetailed`
- Step definition type: `StepDefinitioniOS`
- Uses `HStack` with `VStack` per step (node row + label)
- Composes `ProgressIndicatorNodeBase`, `ProgressIndicatorConnectorBase`, and `ProgressIndicatorLabelBase` views
- Accessibility: `.accessibilityElement(children: .combine)` per step with combined label
- Debug builds use `assertionFailure` for steps > 8; `precondition` for size = sm

### Android
- Jetpack Compose `@Composable` function: `ProgressStepperDetailed`
- Step definition type: `StepDefinitionAndroid`
- Uses `Row` with `Column(modifier = Modifier.weight(1f))` per step
- Composes `ProgressIndicatorNodeBase`, `ProgressIndicatorConnectorBase`, and `ProgressIndicatorLabelBase` composables
- Accessibility: `semantics { collectionInfo }` on container, `collectionItemInfo` per step for TalkBack list semantics
- Debug builds throw `IllegalArgumentException` for steps > 8; `require` for size = sm

---

## Related Documentation

- [Node-Base](../Progress-Indicator-Node-Base/README.md) — Primitive node composed by this component
- [Connector-Base](../Progress-Indicator-Connector-Base/README.md) — Primitive connector composed by this component
- [Label-Base](../Progress-Indicator-Label-Base/README.md) — Primitive label composed by this component
- [Stepper-Base](../Progress-Stepper-Base/README.md) — Semantic variant: nodes + connectors, no labels or icons
- [Pagination-Base](../Progress-Pagination-Base/README.md) — Semantic variant: dots only, supports sm size
- [Spec Requirements](/.kiro/specs/048-progress-family/requirements.md) — Requirements 4.1–4.16, 7.4–7.6, 7.13, 8.6–8.10, 10.3–10.7, 11.14–11.22
- [Spec Design](/.kiro/specs/048-progress-family/design.md) — Design specification
- [Design Outline](/.kiro/specs/048-progress-family/design-outline.md) — Original design outline
