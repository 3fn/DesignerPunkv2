# Design Document: Progress Indicator Family

**Date**: February 15, 2026
**Spec**: 048-progress-family
**Status**: Design Phase
**Dependencies**: None

---

## Overview

The Progress Indicator Family provides visual indicators for position and progression through sequences. It consists of three primitive components (Node-Base, Connector-Base, Label-Base) and three semantic variants (Pagination-Base, Stepper-Base, Stepper-Detailed) that compose primitives differently based on use case complexity.

**Design Philosophy**:
- Primitives own visual rendering
- Semantic variants own state management, composition, and behavioral logic
- Mathematical foundation: formula-based sizing with SPACING_BASE_VALUE × multiplier
- Accessibility-first: WCAG 2.1 AA compliance with non-color differentiation
- Cross-platform: web, iOS, Android with platform parity

**Scope**:
- Mobile pagination (carousels, onboarding) through desktop steppers (admin workflows, healthcare intake)
- Horizontal orientation only (initial release)
- Non-interactive by default (navigation handled by parent flow)
- Support for 3-50 items (pagination) and 3-8 steps (steppers)

---

## Architecture

### Component Hierarchy

```
Progress Indicator Family
│
├── Primitives (Visual Rendering)
│   ├── Progress-Indicator-Node-Base
│   │   ├── States: incomplete, current, completed, error
│   │   ├── Sizes: sm (12px), md (16px), lg (24px)
│   │   ├── Current emphasis: +4px from base size
│   │   └── Content: none (dot), checkmark, icon
│   │
│   ├── Progress-Indicator-Connector-Base
│   │   ├── States: active, inactive
│   │   ├── Thickness: 1px (borderDefault)
│   │   └── Colors: green100 (active), white200 (inactive)
│   │
│   └── Progress-Indicator-Label-Base
│       ├── Position: centered below node
│       ├── Typography: labelSm (14px)
│       └── Overflow: truncate with ellipsis
│
└── Semantic Variants (State Management & Composition)
    ├── Progress-Pagination-Base
    │   ├── Composes: Node-Base only
    │   ├── States: incomplete, current
    │   ├── Sizes: sm, md, lg
    │   ├── Virtualization: >5 items → sliding window
    │   └── Use cases: carousels, onboarding, page indicators
    │
    ├── Progress-Stepper-Base
    │   ├── Composes: Node-Base + Connector-Base
    │   ├── States: incomplete, current, completed, error
    │   ├── Sizes: md, lg only
    │   ├── Icons: checkmark for completed (automatic)
    │   └── Use cases: simple checkout, wizard, compact progress
    │
    └── Progress-Stepper-Detailed
        ├── Composes: Node-Base + Connector-Base + Label-Base
        ├── States: incomplete, current, completed, error
        ├── Sizes: md, lg only
        ├── Icons: checkmark for completed, optional for current/incomplete/error
        └── Use cases: desktop admin, healthcare intake, complex flows
```

### Design Pattern: Primitive-Semantic Separation

**Primitives** are responsible for:
- Visual rendering (shapes, colors, sizes)
- Platform-specific implementation details
- Token application
- Accessibility attributes (ARIA roles, labels)

**Semantic Variants** are responsible for:
- State derivation from props
- Primitive composition
- Validation and error handling
- Business logic (virtualization, state priority)

This separation enables:
- Reusable visual building blocks
- Consistent rendering across variants
- Testable state management logic
- Platform-specific optimizations without affecting behavior

---

## Components and Interfaces

### Progress-Indicator-Node-Base (Primitive)

**Purpose**: Individual indicator element with state-based visual treatment.

**Interface**:
```typescript
interface ProgressIndicatorNodeBaseProps {
  state: 'incomplete' | 'current' | 'completed' | 'error';
  size?: 'sm' | 'md' | 'lg';
  content?: 'none' | 'checkmark' | 'icon';
  icon?: string;
  testID?: string;
}
```

**Behavior**:
- Renders as circular node with state-based colors
- Applies size from token: base size (12/16/24px) or current size (16/20/28px)
- sm size: always renders as dot (content ignored)
- md/lg size: renders content (checkmark, icon, or empty circle)
- Transitions respect `prefers-reduced-motion`

**Token Usage**:
- Size: `progress.node.size.{sm|md|lg}` or `progress.node.size.{sm|md|lg}.current`
- Colors: `color.progress.{pending|current|completed|error}.{background|text}`

---

### Progress-Indicator-Connector-Base (Primitive)

**Purpose**: Connecting element between nodes.

**Interface**:
```typescript
interface ProgressIndicatorConnectorBaseProps {
  state: 'active' | 'inactive';
  testID?: string;
}
```

**Behavior**:
- Renders as horizontal line between nodes
- Flexible length (fills space between nodes)
- State determines color: active (green100) or inactive (white200)

**Token Usage**:
- Thickness: `progress.connector.thickness` (1px)
- Colors: `color.progress.completed.connector` (active), `color.progress.pending.connector` (inactive)

---

### Progress-Indicator-Label-Base (Primitive)

**Purpose**: Label for a node with optional helper text.

**Interface**:
```typescript
interface ProgressIndicatorLabelBaseProps {
  label: string;
  helperText?: string;
  optional?: boolean;
  testID?: string;
}
```

**Behavior**:
- Renders centered below node
- Truncates with ellipsis if text exceeds width
- Shows helper text below label (if provided)
- Indicates optional status (if applicable)

**Token Usage**:
- Typography: `typography.labelSm` (14px)

---

### Progress-Pagination-Base (Semantic)

**Purpose**: Simple pagination indicator for carousels and multi-page flows.

**Interface**:
```typescript
interface ProgressPaginationBaseProps {
  totalItems: number;  // max 50
  currentItem: number; // 1-indexed
  size?: 'sm' | 'md' | 'lg';
  accessibilityLabel?: string;
  testID?: string;
}
```

**State Derivation**:
```typescript
function deriveNodeState(index: number, currentItem: number): NodeState {
  return index === currentItem ? 'current' : 'incomplete';
}
```

**Composition**:
- Renders Node-Base for each visible item
- Does NOT render Connector-Base or Label-Base
- Passes `content='none'` to all nodes (dots only)

**Virtualization** (when totalItems > 5):
```typescript
function calculateVisibleWindow(currentItem: number, totalItems: number) {
  if (totalItems <= 5) return { start: 1, end: totalItems };
  
  // Edge case: near start
  if (currentItem <= 3) return { start: 1, end: 5 };
  
  // Edge case: near end
  if (currentItem >= totalItems - 2) {
    return { start: totalItems - 4, end: totalItems };
  }
  
  // Normal case: current centered at position 3
  return { start: currentItem - 2, end: currentItem + 2 };
}
```

**Validation**:
- Development: throws if `totalItems > 50`
- Production: warns and clamps to 50
- Both: clamps `currentItem` to [1, totalItems]

**Accessibility**:
- `role="group"`
- `aria-label="Page {currentItem} of {totalItems}"` (reflects actual position, not virtualized subset)

---

### Progress-Stepper-Base (Semantic)

**Purpose**: Stepper with connectors for linear multi-step flows.

**Interface**:
```typescript
interface ProgressStepperBaseProps {
  totalSteps: number;  // max 8
  currentStep: number; // 1-indexed
  size?: 'md' | 'lg';  // sm not supported
  errorSteps?: number[];
  accessibilityLabel?: string;
  testID?: string;
}
```

**State Derivation** (priority: error > completed > current > incomplete):
```typescript
function deriveNodeState(
  index: number,
  currentStep: number,
  errorSteps: number[]
): NodeState {
  if (errorSteps.includes(index)) return 'error';
  if (index < currentStep) return 'completed';
  if (index === currentStep) return 'current';
  return 'incomplete';
}
```

**Composition**:
- Renders Node-Base for each step
- Renders Connector-Base between all nodes (n-1 connectors)
- Does NOT render Label-Base
- Passes `content='checkmark'` to completed nodes, `content='none'` to others
- Passes `state='active'` to connectors between completed nodes, `state='inactive'` to others

**Validation**:
- Development: throws if `totalSteps > 8` or `size === 'sm'`
- Production: warns and renders first 8 steps only
- Both: clamps `currentStep` to [1, totalSteps], filters `errorSteps` to valid range

**Accessibility**:
- `role="progressbar"`
- `aria-valuenow={currentStep}`, `aria-valuemin={1}`, `aria-valuemax={totalSteps}`

---

### Progress-Stepper-Detailed (Semantic)

**Purpose**: Detailed stepper with labels and optional icons for complex flows.

**Interface**:
```typescript
interface StepDefinition {
  label: string;
  helperText?: string;
  icon?: string;  // only applies to current/incomplete/error states
  optional?: boolean;
}

interface ProgressStepperDetailedProps {
  steps: StepDefinition[];  // max 8 steps
  currentStep: number;      // 1-indexed
  size?: 'md' | 'lg';       // sm not supported
  errorSteps?: number[];
  accessibilityLabel?: string;
  testID?: string;
}
```

**State Derivation**:
- Same as Stepper-Base (priority: error > completed > current > incomplete)

**Icon Precedence**:
- Completed steps: **always** render checkmark (user icon ignored)
- Current/incomplete/error steps: render user icon if provided, otherwise empty circle

**Composition**:
- Renders Node-Base for each step
- Renders Connector-Base between all nodes (n-1 connectors)
- Renders Label-Base for each step (always visible)
- Passes `content='checkmark'` to completed nodes
- Passes `content='icon'` with icon name to current/incomplete/error nodes (if icon provided)
- Passes `content='none'` to current/incomplete/error nodes (if no icon)
- Passes label text and helper text to Label-Base

**Validation**:
- Development: throws if `steps.length > 8` or `size === 'sm'`
- Production: warns and renders first 8 steps only
- Both: clamps `currentStep` to [1, steps.length], filters `errorSteps` to valid range

**Accessibility**:
- `role="list"` with each step as `role="listitem"`
- Error steps: `aria-label` includes "error" suffix
- Optional steps: `aria-label` includes "optional" suffix

---

## Data Models

### Node State

```typescript
type NodeState = 'incomplete' | 'current' | 'completed' | 'error';
```

**State Semantics**:
- `incomplete`: Not yet reached / upcoming step
- `current`: Active position ("you are here")
- `completed`: Finished step
- `error`: Step has a problem (rare/edge case)

**State Priority** (for steppers):
```
error > completed > current > incomplete
```

---

### Connector State

```typescript
type ConnectorState = 'active' | 'inactive';
```

**State Semantics**:
- `active`: Between completed steps (progress made)
- `inactive`: Between upcoming steps (progress not yet made)

---

### Size Variant

```typescript
type SizeVariant = 'sm' | 'md' | 'lg';
```

**Size Mapping**:
- `sm`: 12px base, 16px current (pagination only)
- `md`: 16px base, 20px current (all variants)
- `lg`: 24px base, 28px current (all variants)

**Current Size Formula**:
```
current_size = SPACING_BASE_VALUE × multiplier
- sm: 8px × 2 = 16px
- md: 8px × 2.5 = 20px
- lg: 8px × 3.5 = 28px
```

**Offset Relationship**:
```
current_size = base_size + 4px
- sm: 16px = 12px + 4px
- md: 20px = 16px + 4px
- lg: 28px = 24px + 4px
```

---

### Virtualization Window

```typescript
interface VirtualizationWindow {
  startIndex: number;  // 1-indexed
  endIndex: number;    // 1-indexed, inclusive
  visibleIndices: number[];
}
```

**Window Calculation** (pagination with totalItems > 5):
- Pages 1-3: Show nodes 1-5
- Pages 4 to (totalItems - 3): Show currentItem ±2 (centered)
- Last 3 pages: Show nodes (totalItems - 4) to totalItems

---

## Correctness Properties

### State Derivation Invariants

**Pagination**:
1. Exactly one node has state `current` at any time
2. All other nodes have state `incomplete`
3. State derivation is deterministic (same props → same states)

**Steppers**:
1. Exactly one node has state `current` at any time (unless in errorSteps)
2. All nodes before currentStep have state `completed` (unless in errorSteps)
3. All nodes after currentStep have state `incomplete`
4. Nodes in errorSteps have state `error` (overrides all other states)
5. State priority is strictly enforced: error > completed > current > incomplete

### Composition Invariants

**Pagination-Base**:
1. Node count equals visible item count (≤ 5 when virtualized)
2. Connector count is always 0
3. Label count is always 0

**Stepper-Base**:
1. Node count equals totalSteps (or 8 if clamped)
2. Connector count equals node count - 1
3. Label count is always 0

**Stepper-Detailed**:
1. Node count equals steps.length (or 8 if clamped)
2. Connector count equals node count - 1
3. Label count equals node count

### Validation Invariants

1. `totalItems` is always ≤ 50 (clamped in production, throws in dev)
2. `totalSteps` or `steps.length` is always ≤ 8 (clamped in production, throws in dev)
3. `currentItem` is always in range [1, totalItems]
4. `currentStep` is always in range [1, totalSteps]
5. `errorSteps` contains only valid indices in range [1, totalSteps]
6. Steppers never receive size `sm` (throws in both dev and production)

### Accessibility Invariants

1. Every semantic variant has appropriate ARIA role
2. ARIA labels reflect actual position (not virtualized subset for pagination)
3. All node states meet WCAG AA contrast requirements
4. Current node has non-color differentiation (size emphasis)
5. Completed nodes have non-color differentiation (checkmark icon)

---

## Error Handling

### Validation Errors

**Development Environment**:
- Throws `Error` with descriptive message and guidance
- Fails fast to catch bugs early
- Error messages include actual values and recommended fixes

**Production Environment**:
- Logs `console.warn` with descriptive message
- Clamps values to valid range (fail soft)
- Continues rendering with corrected values

### Error Messages

**Pagination totalItems > 50**:
```
Development: throw Error(
  "Progress-Pagination-Base supports a maximum of 50 items. " +
  "Received {totalItems} items. " +
  "Consider using a different navigation pattern for larger sets."
)

Production: console.warn(
  "Progress-Pagination-Base: Received {totalItems} items but maximum is 50. " +
  "Rendering first 50 items only. " +
  "Consider using a different navigation pattern."
)
```

**Stepper totalSteps > 8**:
```
Development: throw Error(
  "Progress-Stepper-Base supports a maximum of 8 steps. " +
  "Received {totalSteps} steps. " +
  "For longer flows, break into multiple sub-flows."
)

Production: console.warn(
  "Progress-Stepper-Base: Received {totalSteps} steps but maximum is 8. " +
  "Rendering first 8 steps only. " +
  "Consider breaking into multiple sub-flows."
)
```

**Stepper size='sm'**:
```
Both environments: throw Error(
  "Steppers require size 'md' or 'lg'. " +
  "Size 'sm' is only supported for Pagination-Base."
)
```

### Bounds Clamping

```typescript
// Both development and production
function clampCurrentItem(currentItem: number, totalItems: number): number {
  return Math.max(1, Math.min(currentItem, totalItems));
}

function clampCurrentStep(currentStep: number, totalSteps: number): number {
  return Math.max(1, Math.min(currentStep, totalSteps));
}

function filterErrorSteps(errorSteps: number[], totalSteps: number): number[] {
  return errorSteps.filter(step => step >= 1 && step <= totalSteps);
}
```

---

## Testing Strategy

### Test Organization

Tests are organized by domain ownership:

**Ada's Domain (Token Tests)**:
- Token formula validation
- Token compliance (governance rules)
- Cross-platform translation
- Token governance (naming, counts)

**Lina's Domain (Component Tests)**:
- Stemma behavioral contracts
- Primitive composition
- State derivation logic
- Visual state rendering
- Accessibility compliance
- Platform parity

**Thurgood's Domain (Infrastructure Tests)**:
- Virtualization logic (calculateVisibleWindow)
- Validation behavior (dev throw, production warn+clamp)
- State derivation correctness
- Accessibility with virtualization

### Test Coverage Goals

**Token Tests** (~15-20 tests):
- Formula correctness: current sizes derive from SPACING_BASE_VALUE × multiplier
- Mathematical relationships: current = base + 4px
- Baseline grid alignment: all sizes divisible by 4px
- Semantic token structure: all reference primitives
- Component token structure: use formulas or primitive references
- Cross-platform output: web CSS, iOS Swift, Android Kotlin
- Governance: 10 semantic tokens, 13 component tokens, naming conventions

**Component Tests** (~73 tests):
- Stemma contracts: naming, type classification, prop validation, accessibility (~15 tests)
- Composition: correct primitive rendering for each variant (~12 tests)
- State derivation: pagination and stepper logic with priority (~10 tests)
- Visual states: node sizes, content, connectors, colors (~15 tests)
- Accessibility: ARIA roles, labels, screen reader announcements, motion (~12 tests)
- Platform parity: node count, state derivation, size tokens, connectors, labels (~9 tests)

**Infrastructure Tests** (~10-15 tests):
- Virtualization edge cases: pages 1, 3, 4, 26, 47, 48, 50
- Validation: dev throw, production warn+clamp for >50 items, >8 steps
- Bounds clamping: currentItem, currentStep, errorSteps
- ARIA with virtualization: actual position, not visible subset

**Total Estimated Coverage**: ~100-110 tests

### Test Priorities

**Critical** (must pass before release):
- Stemma behavioral contracts
- State derivation logic
- Accessibility compliance (ARIA roles, labels, contrast)
- Validation behavior (dev throw, production clamp)
- Token formula correctness

**High** (should pass before release):
- Composition contracts
- Visual state rendering
- Cross-platform translation
- Virtualization logic

**Medium** (nice to have):
- Platform parity
- Token governance
- Edge case handling

### Integration Testing

**Cross-Domain Integration**:
- Token tests validate formulas → Component tests verify token application
- Composition tests verify primitive rendering → Visual state tests verify appearance
- State derivation tests verify logic → Accessibility tests verify ARIA reflects state

**Platform Integration**:
- Web tests validate behavior → iOS/Android tests verify parity
- Token translation tests validate output → Platform tests verify rendering

---

## Design Decisions

### Decision 1: Formula-Based Current Node Sizing

**Context**: Current nodes need visual emphasis beyond color to meet accessibility requirements.

**Decision**: Use formula-based component tokens (SPACING_BASE_VALUE × multiplier) to calculate current sizes: 16px (sm), 20px (md), 28px (lg).

**Rationale**:
- Mathematically consistent: +4px offset across all sizes
- Baseline grid aligned: all values divisible by 4px
- Avoids token proliferation: no need for space250 (20px) or space350 (28px) primitives
- Consistent with Avatar precedent (formula-based sizing)

**Alternatives Considered**:
1. Create new spacing primitives (space250, space350) — rejected due to token proliferation
2. Use hard-coded values in components — rejected due to token-first principle
3. Use ring/glow instead of size — rejected due to implementation complexity

**Trade-offs**:
- Pro: Mathematical consistency, no token proliferation
- Con: Intermediate values (20px, 28px) don't exist in spacing primitive scale
- Mitigation: Document as formula-based derivation, get Ada's governance approval

---

### Decision 2: Pagination Virtualization with Sliding Window

**Context**: Pagination needs to support up to 50 items without DOM bloat.

**Decision**: Render only 5 visible nodes using sliding window algorithm (current ±2, centered when possible).

**Rationale**:
- Prevents DOM bloat for large carousels
- Maintains visual consistency (always 5 dots visible)
- Sliding window is familiar pattern (iOS page controls)
- ARIA label reflects actual position (accessibility preserved)

**Alternatives Considered**:
1. Render all nodes — rejected due to DOM bloat
2. Chunked display (1-5, 6-10, etc.) — rejected due to poor UX (current not centered)
3. Ellipsis pattern (1 ... 26 ... 50) — rejected due to implementation complexity

**Trade-offs**:
- Pro: Efficient rendering, familiar UX pattern
- Con: Adds complexity to state management
- Mitigation: Isolate window calculation in testable utility function

---

### Decision 3: Stepper Maximum 8 Steps

**Context**: Steppers need reasonable scale limits to prevent UI clutter.

**Decision**: Enforce maximum 8 steps with dev-time error, production-time warning+clamp.

**Rationale**:
- Most steppers have 3-7 steps in practice
- 8 is generous ceiling for edge cases
- Enforcing limit prevents poor UX (too many steps)
- Dev-time error catches bugs early
- Production-time clamp prevents app crashes

**Alternatives Considered**:
1. No limit — rejected due to poor UX with many steps
2. Strict throw in production — rejected due to app crash risk
3. Higher limit (10-12 steps) — rejected due to UI clutter

**Trade-offs**:
- Pro: Enforces good UX, catches bugs early, prevents crashes
- Con: Users with >8 steps must refactor flows
- Mitigation: Clear error message with guidance to break into sub-flows

---

### Decision 4: Icon Precedence (Completed = Checkmark Always)

**Context**: Stepper-Detailed allows user icons, but completed steps need consistent signaling.

**Decision**: Completed steps always render checkmark, regardless of user-provided icon. User icons only apply to current/incomplete/error states.

**Rationale**:
- Consistent completion signaling across all steppers
- Checkmark is universal symbol for "done"
- Prevents confusion (user icon on completed step might not convey completion)
- Simplifies component logic (no icon precedence conflicts)

**Alternatives Considered**:
1. User icon overrides checkmark — rejected due to inconsistent completion signaling
2. Show both user icon and checkmark — rejected due to visual clutter
3. Validation error if icon provided for completed step — rejected as too strict

**Trade-offs**:
- Pro: Consistent completion signaling, simple logic
- Con: User icons ignored for completed steps
- Mitigation: Document icon precedence clearly in API docs

---

### Decision 5: Horizontal Orientation Only (Initial Release)

**Context**: Vertical orientation adds complexity (label positioning, connector orientation).

**Decision**: Ship horizontal orientation only in initial release. Defer vertical to future enhancement.

**Rationale**:
- Reduces implementation complexity and test surface
- Horizontal is 80% use case (carousels, checkout flows)
- Vertical can be added later without breaking changes
- Allows faster time to market

**Alternatives Considered**:
1. Ship both horizontal and vertical — rejected due to complexity
2. Ship vertical only — rejected due to lower demand

**Trade-offs**:
- Pro: Faster implementation, lower risk, smaller test surface
- Con: Users needing vertical must wait for future release
- Mitigation: Document as planned enhancement, add `orientation` prop in future

---

### Decision 6: Non-Interactive by Default

**Context**: Progress indicators could be clickable for navigation.

**Decision**: Components are non-interactive by default. Navigation handled by parent flow.

**Rationale**:
- Separates concerns: progress display vs navigation logic
- Prevents accessibility issues (keyboard navigation, focus management)
- Allows parent to control navigation behavior (validation, confirmation)
- Simpler component implementation

**Alternatives Considered**:
1. Add `onStepClick` prop — rejected as out of scope for initial release
2. Make clickable by default — rejected due to accessibility concerns

**Trade-offs**:
- Pro: Simpler implementation, better separation of concerns
- Con: Users wanting clickable steps must implement wrapper
- Mitigation: Document pattern for adding interactivity via parent component

---

## Platform Considerations

### Web Implementation

**Technology**: Web Components (Custom Elements)
**Token Format**: CSS custom properties (`--progress-node-size-sm-current: 16px`)
**Rendering**: Shadow DOM for style encapsulation
**Accessibility**: Native ARIA attributes

**Platform-Specific Considerations**:
- Use `prefers-reduced-motion` media query for transitions
- CSS Grid or Flexbox for node/connector layout
- CSS custom properties for token application
- Shadow DOM prevents style leakage

---

### iOS Implementation

**Technology**: UIKit (UIView subclasses)
**Token Format**: Swift constants (`ProgressTokens.nodeSizeSmCurrent = 16.0`)
**Rendering**: Core Graphics for custom drawing
**Accessibility**: UIAccessibility protocol

**Platform-Specific Considerations**:
- Use CALayer for node rendering (performance)
- UIStackView for layout
- VoiceOver support via accessibilityLabel
- Respect UIAccessibility.isReduceMotionEnabled

---

### Android Implementation

**Technology**: Jetpack Compose
**Token Format**: Kotlin constants (`ProgressTokens.nodeSizeSmCurrent = 16.dp`)
**Rendering**: Canvas for custom drawing
**Accessibility**: TalkBack support

**Platform-Specific Considerations**:
- Use Compose Canvas for node rendering
- Row/Column composables for layout
- TalkBack support via contentDescription
- Respect AccessibilityManager.isReduceMotionEnabled

---

## Performance Considerations

### Pagination Virtualization

**Problem**: Rendering 50 nodes creates DOM bloat and performance issues.

**Solution**: Sliding window algorithm renders only 5 visible nodes.

**Performance Impact**:
- DOM nodes: 50 → 5 (90% reduction)
- Re-renders: Only when window shifts (not on every currentItem change within window)
- Memory: Minimal (window calculation is O(1))

**Optimization**: Window calculation is pure function (memoizable).

---

### Stepper Scale Limits

**Problem**: Rendering many steps with labels and connectors impacts performance.

**Solution**: Enforce maximum 8 steps.

**Performance Impact**:
- DOM nodes: Capped at 8 nodes + 7 connectors + 8 labels = 23 elements
- Layout: Manageable with Flexbox/Grid (no virtualization needed)
- Memory: Minimal (small fixed size)

---

### Token Application

**Problem**: Applying tokens on every render impacts performance.

**Solution**: Use platform-native token systems (CSS custom properties, Swift constants, Kotlin constants).

**Performance Impact**:
- Web: CSS custom properties are optimized by browser
- iOS: Swift constants are compile-time (zero runtime cost)
- Android: Kotlin constants are compile-time (zero runtime cost)

---

**Organization**: spec-guide
**Scope**: 048-progress-family
