---
inclusion: manual
---

# Progress Indicator Components

**Date**: 2026-02-16
**Purpose**: MCP-queryable documentation for Progress Indicator component family
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 3
**Relevant Tasks**: component-development, ui-composition, progress-implementation
**Last Reviewed**: 2026-03-09

---

## Family Overview

**Family**: Progress Indicator
**Shared Need**: Visual indicators for position and progression through sequences
**Readiness**: 🟡 Development

### Purpose

The Progress Indicator family provides visual indicators spanning simple mobile pagination dots through rich desktop steppers with labels, connectors, and content nodes. Three shared primitives (Node-Base, Connector-Base, Label-Base) are composed differently by three semantic variants (Pagination-Base, Stepper-Base, Stepper-Detailed) to cover the full complexity spectrum.

### Key Characteristics

- Primitive-semantic separation: primitives own visual rendering, semantic variants own state management and composition
- Mathematical foundation: formula-based sizing with SPACING_BASE_VALUE × multiplier (+4px current emphasis)
- Non-interactive by default — navigation handled by parent flow
- Horizontal orientation only (initial release)
- Accessibility-first: WCAG 2.1 AA compliance with non-color differentiation (size emphasis, checkmarks)
- Cross-platform: web (Custom Elements), iOS (SwiftUI), Android (Jetpack Compose)

### Stemma System Integration

- **Primitives**: 3 implemented (Node-Base, Connector-Base, Label-Base)
- **Semantic Variants**: 3 implemented (Pagination-Base, Stepper-Base, Stepper-Detailed)
- **Cross-Platform**: web, ios, android

---

## Inheritance Structure

### Component Hierarchy

```
Progress Indicator Family
│
├── Primitives (Visual Rendering)
│   ├── Progress-Indicator-Node-Base
│   ├── Progress-Indicator-Connector-Base
│   └── Progress-Indicator-Label-Base
│
└── Semantic Variants (State Management & Composition)
    ├── Progress-Pagination-Base    [Node-Base only]
    ├── Progress-Stepper-Base       [Node-Base + Connector-Base]
    └── Progress-Stepper-Detailed   [Node-Base + Connector-Base + Label-Base]
```

### Primitive Components

| Component | Type | Status | Description |
|-----------|------|--------|-------------|
| Progress-Indicator-Node-Base | Primitive | 🟡 Development | Circular indicator with 4 states, 3 sizes, +4px current emphasis, optional content |
| Progress-Indicator-Connector-Base | Primitive | 🟡 Development | Horizontal line between nodes, 2 states (active/inactive), 1px thickness |
| Progress-Indicator-Label-Base | Primitive | 🟡 Development | Text label centered below node, optional helper text, ellipsis truncation |

### Semantic Components

| Component | Composes | Status | Specialized Purpose |
|-----------|----------|--------|---------------------|
| Progress-Pagination-Base | Node-Base | 🟡 Development | Dot pagination for carousels/onboarding. Render-all-dots with viewport clipping for >5 items. Max 50 items |
| Progress-Stepper-Base | Node-Base + Connector-Base | 🟡 Development | Linear stepper with connectors. State priority logic. Max 8 steps |
| Progress-Stepper-Detailed | Node-Base + Connector-Base + Label-Base | 🟡 Development | Detailed stepper with labels and icons. Icon precedence logic. Max 8 steps |

---

## Behavioral Contracts

### Primitive Contracts (All Primitives)

All primitives in this family share these foundational contracts:

| Contract | Description | WCAG | Platforms |
|----------|-------------|------|-----------|
| decorative_hidden | Hidden from assistive technology on all platforms | 1.1.1 Non-text Content | web, ios, android |
| non_interactive | No user interaction — purely visual rendering | N/A | web, ios, android |
| token_driven | All visual properties derived from design tokens | N/A | web, ios, android |

### Semantic Variant Contracts

| Contract | Description | WCAG | Applies To |
|----------|-------------|------|------------|
| state_derivation | Deterministic state derivation from props | N/A | All semantic variants |
| validation_dual_mode | Dev: throw errors; Production: warn + clamp | N/A | All semantic variants |
| aria_position | ARIA labels reflect actual position, not visual subset | 4.1.2 Name, Role, Value | All semantic variants |
| non_color_differentiation | Current state uses +4px size emphasis; completed uses checkmark | 1.4.11 Non-text Contrast | All semantic variants |
| reduced_motion | Size transitions respect prefers-reduced-motion | 2.3.3 Animation from Interactions | All semantic variants |

### Contract Details

#### State Derivation

**Description**: All semantic variants derive node states deterministically from props. Same inputs always produce same visual output.

**Pagination state logic**:
- `index === currentItem` → `current`
- All others → `incomplete`

**Stepper state logic** (priority: error > completed > current > incomplete):
1. Step in `errorSteps` → `error`
2. Step < `currentStep` and not in `errorSteps` → `completed`
3. Step === `currentStep` and not in `errorSteps` → `current`
4. Step > `currentStep` → `incomplete`

**Verification**:
- Unit tests verify state derivation for all edge cases
- Property-based tests verify invariants (exactly one current node, etc.)

#### Validation Dual Mode

**Description**: Components validate props differently based on environment.

| Environment | Behavior |
|-------------|----------|
| Development | Throws `Error` with descriptive message and guidance |
| Production | Logs `console.warn` and clamps/filters to valid range |

**Validated conditions**:
- Pagination: `totalItems > 50`
- Steppers: `totalSteps > 8`, `size === 'sm'`
- All: `currentItem`/`currentStep` out of bounds, `errorSteps` with invalid indices

#### Icon Precedence (Stepper-Detailed only)

**Description**: Completed steps always display checkmark regardless of user-provided icon. User icons only render for current, incomplete, or error states.

| Node State | Icon Provided? | Content Rendered |
|------------|---------------|------------------|
| `completed` | Yes or No | Checkmark ✓ (always) |
| `current` | Yes | User icon |
| `current` | No | Empty circle |
| `incomplete` | Yes | User icon |
| `incomplete` | No | Empty circle |
| `error` | Yes | User icon |
| `error` | No | Empty circle |

---

## Component Schemas

### Progress-Indicator-Node-Base

**Type**: Primitive
**Status**: 🟡 Development

#### Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `state` | `'incomplete' \| 'current' \| 'completed' \| 'error'` | Yes | — | Visual state determining color and size |
| `size` | `'sm' \| 'md' \| 'lg'` | No | `'md'` | Size variant (12/16/24px base) |
| `content` | `'none' \| 'checkmark' \| 'icon'` | No | `'none'` | Content inside node. `sm` always renders as dot |
| `icon` | `string` | No | — | Icon name when `content='icon'` |
| `testID` | `string` | No | — | Test identifier |

#### Size Values

| Size | Base | Current (+4px) |
|------|------|----------------|
| `sm` | 12px | 16px |
| `md` | 16px | 20px |
| `lg` | 20px | 24px |

---

### Progress-Indicator-Connector-Base

**Type**: Primitive
**Status**: 🟡 Development

#### Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `state` | `'active' \| 'inactive'` | Yes | `'inactive'` | Visual state determining color |
| `testID` | `string` | No | — | Test identifier |

---

### Progress-Indicator-Label-Base

**Type**: Primitive
**Status**: 🟡 Development

#### Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `label` | `string` | Yes | — | Primary label text |
| `helperText` | `string` | No | — | Secondary text below label |
| `optional` | `boolean` | No | `false` | Whether step is optional |
| `testID` | `string` | No | — | Test identifier |

---

### Progress-Pagination-Base

**Type**: Semantic
**Status**: 🟡 Development

#### Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `totalItems` | `number` | Yes | — | Total items/pages. Max 50 |
| `currentItem` | `number` | Yes | — | Current active item (1-indexed) |
| `size` | `'sm' \| 'md' \| 'lg'` | No | `'md'` | Size variant |
| `accessibilityLabel` | `string` | No | `'Page X of Y'` | Custom ARIA label |
| `testID` | `string` | No | — | Test identifier |

#### Rendering

All dots are rendered regardless of totalItems count. When `totalItems > 5`, a fixed-width viewport clips to ~5 visible dots via overflow clipping. The current dot is centered by platform-native mechanisms:
- Web: translateX on the dot track, clamped at edges
- iOS: ScrollViewReader with scrollTo(anchor: .center)
- Android: LazyRow with animateScrollToItem()

ARIA label always reflects actual position (e.g., "Page 26 of 50").

---

### Progress-Stepper-Base

**Type**: Semantic
**Status**: 🟡 Development

#### Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `totalSteps` | `number` | Yes | — | Total steps. Max 8 |
| `currentStep` | `number` | Yes | — | Current active step (1-indexed) |
| `size` | `'md' \| 'lg'` | No | `'md'` | Size variant. `sm` throws error |
| `errorSteps` | `number[]` | No | `[]` | Step indices in error state |
| `accessibilityLabel` | `string` | No | `'Step X of Y'` | Custom ARIA label |
| `testID` | `string` | No | — | Test identifier |

---

### Progress-Stepper-Detailed

**Type**: Semantic
**Status**: 🟡 Development

#### Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `steps` | `StepDefinition[]` | Yes | — | Array of step definitions. Max 8 |
| `currentStep` | `number` | Yes | — | Current active step (1-indexed) |
| `size` | `'md' \| 'lg'` | No | `'md'` | Size variant. `sm` throws error |
| `errorSteps` | `number[]` | No | `[]` | Step indices in error state |
| `accessibilityLabel` | `string` | No | `'Step X of Y'` | Custom ARIA label |
| `testID` | `string` | No | — | Test identifier |

#### StepDefinition

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `label` | `string` | Yes | Primary label text |
| `helperText` | `string` | No | Secondary text below label |
| `icon` | `string` | No | Icon name (only renders for non-completed states) |
| `optional` | `boolean` | No | Marks step as optional |

---

## Token Dependencies

### Required Tokens

Components in this family consume these design tokens:

| Category | Token Pattern | Purpose |
|----------|---------------|---------|
| Color (Semantic) | `color.progress.{state}.{background\|text\|connector}` | State-based node, text, and connector colors |
| Size (Component) | `progress.node.size.{sm\|md\|lg}` | Base node dimensions |
| Size (Component) | `progress.node.size.{sm\|md\|lg}.current` | Current emphasis dimensions (+4px) |
| Gap (Component) | `progress.node.gap.{sm\|md\|lg}` | Spacing between nodes |
| Connector (Component) | `progress.connector.thickness` | Connector line height (1px) |
| Typography | `typography.labelSm` | Label text styling (14px) |

### Semantic Color Token Map

| Token | Primitive | State |
|-------|-----------|-------|
| `color.progress.current.background` | `cyan300` | Current node |
| `color.progress.current.text` | `cyan400` | Current node content |
| `color.progress.pending.background` | `white300` | Incomplete node |
| `color.progress.pending.text` | `gray300` | Incomplete node content |
| `color.progress.pending.connector` | `white200` | Inactive connector |
| `color.progress.completed.background` | `green100` | Completed node |
| `color.progress.completed.text` | `green400` | Completed node content |
| `color.progress.completed.connector` | `green100` | Active connector |
| `color.progress.error.background` | `pink100` | Error node |
| `color.progress.error.text` | `pink400` | Error node content |

### Current Size Formula

Current sizes are formula-based, not direct primitive references:

```
current_size = SPACING_BASE_VALUE × multiplier
  sm: 8px × 2   = 16px  (base 12px + 4px)
  md: 8px × 2.5 = 20px  (base 16px + 4px)
  lg: 8px × 3   = 24px  (base 20px + 4px)
```

All values align to the 4px baseline grid.

### Token Source Files

- Semantic: `src/tokens/semantic/color-progress.ts`
- Component: `src/tokens/component/progress.ts`

### Related Token Documentation

- [Token Quick Reference](./Token-Quick-Reference.md)

---

## Usage Guidelines

### When to Use Progress Indicators

**Use Progress Indicator components when**:
- Showing position in a carousel or swipeable content (Pagination-Base)
- Displaying progress through a linear multi-step flow (Stepper-Base)
- Showing labeled steps with descriptions in complex workflows (Stepper-Detailed)

**Do NOT use Progress Indicator components when**:
- Navigation is the primary purpose (use navigation components instead)
- Progress is continuous/percentage-based (use a progress bar)
- Steps are non-linear or can be completed in any order

### Primitive vs Semantic Selection

| Scenario | Recommended Component | Rationale |
|----------|----------------------|-----------|
| Carousel page dots | Pagination-Base | Binary state (current/incomplete), virtualization for many items |
| Simple checkout flow | Stepper-Base | Connectors show progress, checkmarks confirm completion |
| Admin workflow with step names | Stepper-Detailed | Labels describe each step, icons add visual context |
| Custom progress visualization | Node-Base + Connector-Base (primitives) | Build custom compositions when semantic variants don't fit |

### Architectural Patterns

#### Primitive-Semantic Separation

Primitives own visual rendering. Semantic variants own state management. This means:
- Changing how a node looks → modify Node-Base (affects all variants)
- Changing how states are derived → modify the specific semantic variant
- Adding a new variant → compose existing primitives differently

#### State Derivation

State is always derived from props, never stored internally. This makes components predictable and testable:
- Pagination: `currentItem` → binary state derivation
- Steppers: `currentStep` + `errorSteps` → priority-based state derivation

#### Render-All-Dots (Pagination only)

For any item count, Pagination-Base renders all dots and uses a fixed-width viewport with overflow clipping to show ~5 at a time. The current dot is centered via platform-native scroll/translation mechanisms. This avoids DOM manipulation on page change and enables smooth CSS/native animation.

### Accessibility Considerations

- All semantic variants provide appropriate ARIA roles (`group`, `progressbar`, `list`)
- ARIA labels always reflect actual position, not virtualized subsets
- Current state has non-color differentiation via +4px size emphasis
- Completed state has non-color differentiation via checkmark icon
- Size transitions respect `prefers-reduced-motion`
- Error and optional steps are announced with suffixes in Stepper-Detailed

---

## Cross-Platform Notes

### Platform Implementations

| Platform | Technology | File Pattern |
|----------|------------|--------------|
| Web | Web Components (Custom Elements, Shadow DOM) | `platforms/web/[Component].web.ts` |
| iOS | SwiftUI Views | `platforms/ios/[Component].ios.swift` |
| Android | Jetpack Compose Composables | `platforms/android/[Component].android.kt` |

### Platform-Specific Behaviors

#### Web

- Custom Elements with Shadow DOM for style encapsulation
- CSS custom properties for token-based styling with fallback values
- CSS logical properties (`inline-size`, `block-size`) for RTL/LTR support
- Attributes use kebab-case: `total-items`, `current-step`, `error-steps`
- Stepper-Detailed receives `steps` as JSON string attribute
- Checkmark uses inline SVG (Feather Icons `check` path)
- High contrast mode: 1px `currentColor` border on nodes

#### iOS

- SwiftUI `View` structs with `HStack`/`VStack` layout
- Checkmark via `Image(systemName: "checkmark")`
- Animation controlled by `UIAccessibility.isReduceMotionEnabled`
- Debug builds use `assertionFailure` for validation errors
- `precondition` for hard errors (size = sm on steppers)

#### Android

- Jetpack Compose `@Composable` functions with `Row`/`Column` layout
- Checkmark via `Icons.Filled.Check`
- Size transitions animated with `animateDpAsState` (respects system motion settings)
- Debug builds throw `IllegalArgumentException` for validation errors
- `require` for hard errors (size = sm on steppers)

### Behavioral Consistency

All platforms implement identical:
- State derivation logic (same inputs → same node states)
- Render-all-dots with viewport clipping (Pagination)
- Validation rules (same thresholds, same error/clamp behavior)
- Composition contracts (same primitive count, same prop passing)

Platform parity is verified by dedicated test suite (`src/__tests__/platform-parity/ProgressPlatformParity.test.ts`).

---

## Related Documentation

- [Component Quick Reference](./Component-Quick-Reference.md) — Family routing table
- [Stemma System Principles](./stemma-system-principles.md) — Architecture overview
- [Component MCP Document Template](./Component-MCP-Document-Template.md) — Template this document follows
- [Token Quick Reference](./Token-Quick-Reference.md) — Token documentation
- [Node-Base README](../../src/components/core/Progress-Indicator-Node-Base/README.md) — Primitive node component
- [Connector-Base README](../../src/components/core/Progress-Indicator-Connector-Base/README.md) — Primitive connector component
- [Label-Base README](../../src/components/core/Progress-Indicator-Label-Base/README.md) — Primitive label component
- [Pagination-Base README](../../src/components/core/Progress-Pagination-Base/README.md) — Semantic pagination variant
- [Stepper-Base README](../../src/components/core/Progress-Stepper-Base/README.md) — Semantic stepper variant
- [Stepper-Detailed README](../../src/components/core/Progress-Stepper-Detailed/README.md) — Semantic detailed stepper variant
- [Spec Requirements](../../.kiro/specs/048-progress-family/requirements.md) — Full requirements document
- [Spec Design](../../.kiro/specs/048-progress-family/design.md) — Design specification

---

*This document provides MCP-queryable documentation for the Progress Indicator component family. Query individual sections via `get_section` for targeted retrieval.*
