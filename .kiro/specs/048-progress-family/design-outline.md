# Progress Indicator Family - Design Outline

**Date**: January 19, 2026
**Updated**: February 15, 2026
**Purpose**: Capture design decisions and token requirements for the Progress indicator component family
**Status**: Design Outline (Pending Lina Review)

> ✅ **ADA REVIEW COMPLETE**: Formula-based component tokens approved (SPACING_BASE_VALUE × multiplier). Mathematically sound, consistent with Avatar precedent.
>
> ✅ **TOKEN DECISIONS FINALIZED**: New `color.progress.*` semantic family created. Components reference semantic tokens directly (no component color tokens needed).

---

## Component Overview

The Progress family provides visual indicators for position and progression through sequences. It spans simple mobile pagination dots through rich desktop steppers with labels, connectors, and content nodes.

**Three semantic variants built from shared primitives:**

| Feature | Pagination-Base | Stepper-Base | Stepper-Detailed |
|---------|-----------------|--------------|------------------|
| **Nodes** | ✅ | ✅ | ✅ |
| **Connectors** | ❌ | ✅ | ✅ |
| **Labels** | ❌ | ❌ | ✅ (always on) |
| **Icons** | ❌ | Checkmark only (completed) | Checkmark (completed) + optional icons (current/incomplete/error) |
| **Sizes** | sm, md, lg | md, lg | md, lg |
| **States** | incomplete, current | incomplete, current, completed, error | incomplete, current, completed, error |
| **Use Cases** | Carousel, onboarding, page position | Checkout, wizard, simple multi-step | Desktop admin, healthcare intake, complex flows |

**Key Characteristics**:
- Shared primitive building blocks composed differently by each semantic variant
- "Stepper" signals linear progression with state tracking
- Non-interactive by default (navigation handled by parent flow)
- Cross-platform: web, iOS, Android

---

## Architecture

### Primitive Layer

```
Progress-Indicator-Node-Base (Primitive)
├── The individual indicator element
├── Shapes: dot (solid circle, no content), circle with content slot
├── States: incomplete, current, completed, error
├── Sizes: sm (12px), md (16px), lg (24px)
├── Content slot: empty (dot), icon, checkmark
└── sm size: dot only (content doesn't fit at 12px)

Progress-Indicator-Connector-Base (Primitive)
├── Connecting element between nodes
├── Styles: line, bar, none
└── States: active (between completed steps), inactive (between upcoming steps)

Progress-Indicator-Label-Base (Primitive)
├── Label for a node
├── Position: centered below node (horizontal orientation only)
├── Helper text support (optional text, error message)
└── Overflow: truncation with ellipsis
```

### Semantic Layer

```
Progress-Pagination-Base (Semantic)
├── Composes: Node-Base (dot mode only)
├── No connectors, no labels
├── States used: incomplete, current
├── Props: totalItems, currentItem, size
└── Use cases: carousels, onboarding swipes, page indicators

Progress-Stepper-Base (Semantic)
├── Composes: Node-Base + Connector-Base
├── Connectors between all nodes
├── No labels
├── Icons: Checkmark for completed (automatic), empty circles for current/incomplete/error
├── States used: incomplete, current, completed, error
├── Sizes: md, lg only (sm not supported — stepper states need content space)
├── Props: totalSteps, currentStep, size, errorSteps
└── Use cases: simple checkout, wizard, compact step progress

Progress-Stepper-Detailed (Semantic)
├── Composes: Node-Base + Connector-Base + Label-Base
├── Connectors between all nodes
├── Labels always visible for all nodes
├── Icons: Checkmark for completed (automatic), optional icons for current/incomplete/error
├── States used: incomplete, current, completed, error
├── Sizes: md, lg only (sm not supported — labels and content nodes need space)
├── Content: checkmarks (completed), optional icons (current/incomplete/error)
├── Props: steps[] (label, helperText, icon, optional), currentStep, size, errorSteps, orientation
└── Use cases: desktop checkout, healthcare intake, admin workflows
```

### Design Pattern

Primitives own visual rendering. Semantic variants own state management, composition, and behavioral logic. Each semantic variant composes primitives differently based on its use case complexity.

---

## Visual Specifications

### Indicator Node States

| State | Description | Visual Treatment | Token References |
|-------|-------------|-----------------|------------------|
| **incomplete** | Not yet reached / upcoming step | Light gray-white background, medium gray content | `color.progress.pending.background` (white300), `color.progress.pending.text` (gray300) |
| **current** | Active position ("you are here") | Bright cyan — strongest emphasis | `color.progress.current.background` (cyan300), `color.progress.current.text` (cyan400) |
| **completed** | Finished step | Light green background, dark green checkmark | `color.progress.completed.background` (green100), `color.progress.completed.text` (green400) |
| **error** | Step has a problem (rare/edge case) | Light pink background, dark pink content | `color.progress.error.background` (pink100), `color.progress.error.text` (pink400) |

### Size Variants

Dot/node sizes use existing spacing primitive token values. Gap between indicators is half the node size.

**Current state emphasis**: The current node animates to a larger size (+4px) to provide non-color visual emphasis. This addresses accessibility concerns about color-only differentiation in pagination.

| Size | Node Dimension | Token Reference | Current Size | Current Token | Gap | Gap Token Reference | Content Support | Available In |
|------|---------------|-----------------|--------------|---------------|-----|---------------------|-----------------|--------------|
| **sm** | 12px | `space150` | 16px | `progress.node.size.sm.current` | 6px | `space075` | Dot only (no content) | Pagination only |
| **md** | 16px | `space200` | 20px | `progress.node.size.md.current` | 8px | `space100` | Checkmark, number, icon | All variants |
| **lg** | 24px | `space300` | 28px | `progress.node.size.lg.current` | 12px | `space150` | Checkmark, number, icon | All variants |

**Sizing rationale**:
- Base values align to existing spacing primitives (no new size tokens needed)
- Gap = node size ÷ 2 — consistent proportional relationship
- **Current size = base size + 4px** — algorithmic offset provides consistent emphasis across all sizes
- 4px offset sits on baseline grid (8px ÷ 2), mathematically consistent
- **Formula-based component tokens** use `SPACING_BASE_VALUE × multiplier` (e.g., 8 × 2.5 = 20px) — maintains mathematical integrity
- sm (12px) is pagination-only: stepper states require content (checkmarks) that isn't legible at 12px
- Steppers restricted to md/lg eliminates the sm completion signaling problem entirely
- All base values sit on the 8px baseline grid or its mathematical subdivisions

> ✅ **ADA REVIEW COMPLETE**: Formula-based component tokens approved. Uses `SPACING_BASE_VALUE × multiplier` pattern (consistent with Avatar precedent). Mathematically sound — no hard-coded values.

### Connector Specifications

| Property | Value | Token Reference | Notes |
|----------|-------|-----------------|-------|
| Thickness | 1px | `borderDefault` | Standard border weight |
| Active color | Light green | `color.progress.completed.connector` (green100) | Matches completed nodes |
| Inactive color | Near-white | `color.progress.pending.connector` (white200) | Lighter than incomplete nodes, recedes visually |
| Length | Flexible | — | Fills space between nodes |

### Label Specifications

| Property | Value | Notes |
|----------|-------|-------|
| Typography | `typography.labelSm` (14px) | Single size for both md and lg steppers — label stays secondary to node |
| Position | Centered below node | Horizontal orientation only (initial release) |
| Helper text | Optional | Error messages, "Optional" indicator |
| Overflow | Truncate with ellipsis | Long labels truncated |

---

## Token Requirements

### Semantic Tokens (New)

New `color.progress.*` semantic family for progress indicator states.

```typescript
// Current position in progress sequence
'color.progress.current.background': { value: 'cyan300' },  // Bright cyan
'color.progress.current.text': { value: 'cyan400' },        // Dark cyan

// Pending/upcoming position in progress sequence
'color.progress.pending.background': { value: 'white300' }, // Light gray-white
'color.progress.pending.text': { value: 'gray300' },        // Medium gray

// Completed position in progress sequence
'color.progress.completed.background': { value: 'green100' },  // Light green
'color.progress.completed.text': { value: 'green400' },        // Dark green
'color.progress.completed.connector': { value: 'green100' },   // Light green (matches completed nodes)

// Error state (rare/edge case)
'color.progress.error.background': { value: 'pink100' },  // Light pink
'color.progress.error.text': { value: 'pink400' },        // Dark pink

// Connector colors
'color.progress.pending.connector': { value: 'white200' },  // Near-white (lighter than pending nodes, recedes visually)
```

### Component Tokens (New)

Component tokens for sizing, spacing, and current state emphasis.

```typescript
// Node sizing — references existing spacing primitives
'progress.node.size.sm': { primitiveReferences: { value: 'space150' } },  // 12px
'progress.node.size.md': { primitiveReferences: { value: 'space200' } },  // 16px
'progress.node.size.lg': { primitiveReferences: { value: 'space300' } },  // 24px

// Current node sizing — formula-based derivation (+4px offset for visual emphasis)
// Uses SPACING_BASE_VALUE × multiplier pattern (consistent with Avatar precedent)
'progress.node.size.sm.current': { 
  value: SPACING_BASE_VALUE * 2,      // 8 × 2 = 16px (sm 12px + 4px)
  reasoning: 'Current node emphasis for sm size provides non-color visual differentiation for accessibility'
},
'progress.node.size.md.current': { 
  value: SPACING_BASE_VALUE * 2.5,    // 8 × 2.5 = 20px (md 16px + 4px)
  reasoning: 'Current node emphasis for md size provides non-color visual differentiation for accessibility'
},
'progress.node.size.lg.current': { 
  value: SPACING_BASE_VALUE * 3.5,    // 8 × 3.5 = 28px (lg 24px + 4px)
  reasoning: 'Current node emphasis for lg size provides non-color visual differentiation for accessibility'
},

// Gap sizing — half the node size
'progress.node.gap.sm': { primitiveReferences: { value: 'space075' } },   // 6px
'progress.node.gap.md': { primitiveReferences: { value: 'space100' } },   // 8px
'progress.node.gap.lg': { primitiveReferences: { value: 'space150' } },   // 12px

// Connector thickness
'progress.connector.thickness': { primitiveReferences: { value: 'borderDefault' } },  // 1px (borderWidth100)
```

**Token count**: 13 component tokens (6 base sizes, 3 current sizes, 3 gaps, 1 connector thickness)

### Existing Tokens Used

**Spacing** (for sizing and gaps):
- `space075` (6px), `space100` (8px), `space150` (12px)
- `space200` (16px), `space300` (24px)

**Border**:
- `borderDefault` (1px) — connector thickness

**Typography**:
- `typography.labelSm` (14px) — step labels in Stepper-Detailed

**Motion**:
- `motion.duration.fast` (state transitions)

**Radius**:
- Full/50% border-radius for circular nodes

**Color primitives** (referenced by new semantic tokens):
- `white200` (near-white) — pending connector
- `white300` (light gray-white) — pending background
- `gray300` (medium gray) — pending text
- `cyan300` (bright cyan) — current background
- `cyan400` (dark cyan) — current text
- `green100` (light green) — completed background, completed connector
- `green400` (dark green) — completed text
- `pink100` (light pink) — error background
- `pink400` (dark pink) — error text

---

## Component API Design

### Progress-Indicator-Node-Base (Primitive)

```typescript
interface ProgressIndicatorNodeBaseProps {
  /** Visual state of the node */
  state: 'incomplete' | 'current' | 'completed' | 'error';

  /** Size variant */
  size?: 'sm' | 'md' | 'lg';

  /** Content to display inside the node (md/lg only) */
  content?: 'none' | 'checkmark' | 'icon';

  /** Icon name (when content='icon') */
  icon?: string;

  /** Test ID */
  testID?: string;
}
```

### Progress-Pagination-Base (Semantic)

```typescript
interface ProgressPaginationBaseProps {
  /** Total number of items/pages (max 50) */
  totalItems: number;

  /** Current item (1-indexed) */
  currentItem: number;

  /** Size variant */
  size?: 'sm' | 'md' | 'lg';

  /** Accessibility label */
  accessibilityLabel?: string;

  /** Test ID */
  testID?: string;
}
```

**Validation**:
- `totalItems` must be ≤ 50
- In development: throws error if `totalItems > 50`
- In production: logs warning and clamps to 50

**Virtualization** (when `totalItems > 5`):
- Only 5 nodes are rendered (sliding window)
- Window calculation: current ±2 positions
- Edge cases:
  - Pages 1-3: Shows nodes 1-5 (current not centered)
  - Pages 4 to (totalItems - 3): Shows current ±2 (current centered at position 3)
  - Last 3 pages: Shows nodes (totalItems - 4) to totalItems (current not centered)
- Window shifts immediately (no animation) when current changes
- ARIA label reflects actual position (e.g., "Page 26 of 50"), not visible subset

### Progress-Stepper-Base (Semantic)

```typescript
interface ProgressStepperBaseProps {
  /** Total number of steps (max 8) */
  totalSteps: number;

  /** Current step (1-indexed) */
  currentStep: number;

  /** Size variant (md or lg — sm not supported for steppers) */
  size?: 'md' | 'lg';

  /** Steps with error state (optional) */
  errorSteps?: number[];

  /** Accessibility label */
  accessibilityLabel?: string;

  /** Test ID */
  testID?: string;
}
```

**Validation**:
- `totalSteps` must be ≤ 8
- In development: throws error if `totalSteps > 8` with message: "Progress-Stepper-Base supports a maximum of 8 steps. Received {totalSteps} steps. For longer flows, break into multiple sub-flows."
- In production: logs warning and renders first 8 steps only

### Progress-Stepper-Detailed (Semantic)

```typescript
interface StepDefinition {
  /** Step label */
  label: string;

  /** Helper text (optional, error message) */
  helperText?: string;

  /** Icon name for the node (optional, for current/incomplete/error states only) */
  icon?: string;

  /** Whether this step is optional */
  optional?: boolean;
}

interface ProgressStepperDetailedProps {
  /** Step definitions (max 8 steps) */
  steps: StepDefinition[];

  /** Current step (1-indexed) */
  currentStep: number;

  /** Steps with error state (optional) */
  errorSteps?: number[];

  /** Size variant (md or lg — sm not supported for detailed) */
  size?: 'md' | 'lg';

  /** Accessibility label */
  accessibilityLabel?: string;

  /** Test ID */
  testID?: string;
}
```

**Icon Precedence**:
- Completed steps **always** display a checkmark, regardless of whether an `icon` is provided in the step definition
- The `icon` prop only applies to current, incomplete, and error states
- This ensures consistent completion signaling across all steppers

**Validation**:
- `steps.length` must be ≤ 8
- In development: throws error if `steps.length > 8` with message: "Progress-Stepper-Detailed supports a maximum of 8 steps. Received {steps.length} steps. For longer flows, break into multiple sub-flows."
- In production: logs warning and renders first 8 steps only

### Usage Examples

```tsx
// Pagination: carousel with 5 pages, on page 3
<ProgressPaginationBase totalItems={5} currentItem={3} />

// Pagination: large carousel with 50 pages (virtualized, shows 5 dots)
<ProgressPaginationBase totalItems={50} currentItem={26} />

// Stepper Base: checkout flow, on step 2 of 4
<ProgressStepperBase totalSteps={4} currentStep={2} />

// Stepper Base: with an error on step 1
<ProgressStepperBase totalSteps={4} currentStep={2} errorSteps={[1]} />

// Stepper Detailed: healthcare intake form (no icons, empty circles for incomplete/current)
<ProgressStepperDetailed
  steps={[
    { label: 'Personal Info' },
    { label: 'Insurance', helperText: 'Required for coverage' },
    { label: 'Medical History' },
    { label: 'Review', optional: true }
  ]}
  currentStep={2}
/>

// Stepper Detailed: with icons for current/incomplete/error states
// Note: Completed steps always show checkmarks, even if icon is provided
<ProgressStepperDetailed
  steps={[
    { label: 'Configure', icon: 'settings' },
    { label: 'Validate', icon: 'check' },
    { label: 'Deploy', icon: 'arrow-right' }
  ]}
  currentStep={2}
/>
```

---

## State Management Logic

### Pagination
For each node at index `i` (1-indexed):
- If `i === currentItem` → state: `current`
- Otherwise → state: `incomplete`

### Stepper Base & Stepper Detailed
For each node at index `i` (1-indexed):
- If `i` is in `errorSteps` → state: `error`
- If `i < currentStep` → state: `completed`
- If `i === currentStep` → state: `current`
- If `i > currentStep` → state: `incomplete`

Priority: error > completed > current > incomplete

---

## Validation and Error Handling

### Pagination-Base

**Prop Validation**:
- `totalItems` must be a positive integer ≤ 50
- `currentItem` must be between 1 and `totalItems` (inclusive)

**Error Behavior**:
```typescript
// Development environment
if (process.env.NODE_ENV !== 'production') {
  if (totalItems > 50) {
    throw new Error(
      `Progress-Pagination-Base supports a maximum of 50 items. Received ${totalItems} items. ` +
      `Consider using a different navigation pattern for larger sets.`
    );
  }
}

// Production environment
if (totalItems > 50) {
  console.warn(
    `Progress-Pagination-Base: Received ${totalItems} items but maximum is 50. ` +
    `Rendering first 50 items only. Consider using a different navigation pattern.`
  );
  totalItems = 50;
}

// Both environments
if (currentItem < 1 || currentItem > totalItems) {
  currentItem = Math.max(1, Math.min(currentItem, totalItems));
}
```

### Stepper-Base & Stepper-Detailed

**Prop Validation**:
- `totalSteps` (Stepper-Base) or `steps.length` (Stepper-Detailed) must be ≤ 8
- `currentStep` must be between 1 and total steps (inclusive)
- `errorSteps` indices must be valid (between 1 and total steps)

**Error Behavior**:
```typescript
// Development environment
if (process.env.NODE_ENV !== 'production') {
  if (totalSteps > 8) {  // or steps.length > 8
    throw new Error(
      `Progress-Stepper-Base supports a maximum of 8 steps. Received ${totalSteps} steps. ` +
      `For longer flows, break into multiple sub-flows.`
    );
  }
}

// Production environment
if (totalSteps > 8) {  // or steps.length > 8
  console.warn(
    `Progress-Stepper-Base: Received ${totalSteps} steps but maximum is 8. ` +
    `Rendering first 8 steps only. Consider breaking into multiple sub-flows.`
  );
  totalSteps = 8;  // or steps = steps.slice(0, 8)
}

// Both environments
if (currentStep < 1 || currentStep > totalSteps) {
  currentStep = Math.max(1, Math.min(currentStep, totalSteps));
}

if (errorSteps) {
  errorSteps = errorSteps.filter(step => step >= 1 && step <= totalSteps);
}
```

---

## Pagination Virtualization

When `totalItems > 5`, Pagination-Base renders only 5 visible nodes using a sliding window algorithm.

### Window Calculation

**Internal utility function** (unit testable):
```typescript
function calculateVisibleWindow(
  currentItem: number,
  totalItems: number,
  maxVisible: number = 5
): { startIndex: number; endIndex: number; visibleIndices: number[] } {
  if (totalItems <= maxVisible) {
    // No virtualization needed
    return {
      startIndex: 1,
      endIndex: totalItems,
      visibleIndices: Array.from({ length: totalItems }, (_, i) => i + 1)
    };
  }

  const halfWindow = Math.floor(maxVisible / 2);  // 2 for maxVisible=5
  
  // Edge case: near start (pages 1-3)
  if (currentItem <= halfWindow + 1) {
    return {
      startIndex: 1,
      endIndex: maxVisible,
      visibleIndices: Array.from({ length: maxVisible }, (_, i) => i + 1)
    };
  }
  
  // Edge case: near end (last 3 pages)
  if (currentItem >= totalItems - halfWindow) {
    return {
      startIndex: totalItems - maxVisible + 1,
      endIndex: totalItems,
      visibleIndices: Array.from({ length: maxVisible }, (_, i) => totalItems - maxVisible + 1 + i)
    };
  }
  
  // Normal case: current centered at position 3
  return {
    startIndex: currentItem - halfWindow,
    endIndex: currentItem + halfWindow,
    visibleIndices: Array.from({ length: maxVisible }, (_, i) => currentItem - halfWindow + i)
  };
}
```

### Transition Behavior
- Window shifts **immediately** (no animation) when `currentItem` changes
- Node state transitions (incomplete → current) provide visual feedback
- Avoids motion sickness and implementation complexity

### Accessibility with Virtualization
- ARIA label reflects **actual position**, not visible subset
- Example: `aria-label="Page 26 of 50"` (not "Page 3 of 5")
- Screen reader announces actual position
- Visible dots are presentational only (screen reader ignores them)

### Test Coverage Requirements
- Unit tests for `calculateVisibleWindow` edge cases:
  - `currentItem = 1` (start edge)
  - `currentItem = 3` (transition to centered)
  - `currentItem = 4` (first centered position)
  - `currentItem = 26` (middle)
  - `currentItem = 47` (transition from centered)
  - `currentItem = 48` (end edge)
  - `currentItem = 50` (last page)
- Accessibility tests for ARIA labels with virtualization
- Visual tests for window transitions

---

## Accessibility

### Screen Readers
- **Pagination**: "Page 3 of 5" — single announcement, not per-dot
- **Stepper Base**: "Step 2 of 4" — announces current position
- **Stepper Detailed**: "Step 2 of 4: Insurance" — includes step label
- Error steps announced: "Step 1: Personal Info — error"
- Optional steps announced: "Step 4: Review — optional"

### ARIA Roles
- **Pagination**: `role="group"` with `aria-label="Page 3 of 5"` — single announcement, not per-dot
- **Stepper Base**: `role="progressbar"` with `aria-valuenow={2}`, `aria-valuemin={1}`, `aria-valuemax={4}` — announces as progress indicator
- **Stepper Detailed**: `role="list"` with `role="listitem"` for each step — announces each step with label

### Visual Accessibility
- All states must have sufficient contrast against background
- Color alone must not be the only state differentiator
- **Current node size animation** (+4px) provides non-color visual emphasis for pagination, addressing color-only differentiation concerns
- Checkmark at md/lg provides non-color completion signal for steppers
- Size + color combination ensures accessibility for users with color vision deficiencies

### Motion
- Subtle transitions on state changes
- Respects `prefers-reduced-motion`

---

## Design Decisions Summary

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | Full family: primitives + 3 semantic variants | Covers mobile pagination through desktop stepper from shared building blocks |
| 2 | "Stepper" signals linear progression with state tracking | Distinguishes from pagination (position only) |
| 3 | Naming: Pagination-Base, Stepper-Base, Stepper-Detailed | Clear hierarchy; avoids Steps/Stepper confusion |
| 4 | Sizes: 12/16/24px | Maps to existing spacing tokens (space150/space200/space300) |
| 5 | Gap = half node size | Consistent proportional relationship (6/8/12px) |
| 6 | sm is dot-only, pagination-only | Stepper states require content (checkmarks) not legible at 12px |
| 7 | Steppers restricted to md and lg | Eliminates sm completion signaling problem; both stepper variants consistent |
| 8 | 4 states: incomplete, current, completed, error | Disabled state removed (DesignerPunk doesn't support disabled for usability/accessibility) |
| 9 | Primitive node supports content slot | Future-proofs for icons and checkmarks without breaking changes |
| 10 | Separate connector and label primitives | Composed by Stepper-Detailed, ignored by simpler variants |
| 11 | Non-interactive by default | Navigation handled by parent flow |
| 12 | Explicit width/height sizing (not padding) | More readable, consistent cross-platform pattern |
| 13 | New `color.progress.*` semantic family | Progress states (current, pending, completed, error) are distinct from feedback (success/error) — "complete" ≠ "success" |
| 14 | Components reference semantic tokens directly | No component color tokens needed — `color.progress.*` is purpose-built for this use case |
| 15 | Connector colors lighter/same as nodes | Inactive connectors (white200) lighter than nodes (white300) to recede; active connectors (green100) match completed nodes |
| 16 | Label typography: `labelSm` for all sizes | 14px keeps labels secondary to nodes at both md (16px) and lg (24px); single token simplifies component |
| 17 | Circles only for node shape | Universally recognized; shape variants can be added later without breaking changes |
| 18 | Current node size animation (+4px) | Provides non-color visual emphasis for accessibility; formula-based tokens (SPACING_BASE_VALUE × multiplier) maintain mathematical integrity |
| 19 | Horizontal orientation only (initial release) | Simplifies implementation and test surface; vertical orientation deferred to future release |
| 20 | Pagination virtualization (>5 nodes) | Prevents DOM bloat for large carousels (up to 50 items); sliding window with current centered |
| 21 | Stepper max 8 steps | Reasonable limit for most use cases; enforced via dev-time error, production warning+clamp |
| 22 | Icon precedence: completed = checkmark always | Ensures consistent completion signaling; user icons only apply to current/incomplete/error states |

---

## Open Decisions

| # | Decision Needed | Status | Notes |
|---|----------------|--------|-------|
| 1 | Color treatment for incomplete state | ✅ Resolved | `color.progress.pending.*` semantic tokens |
| 2 | Color treatment for current state | ✅ Resolved | `color.progress.current.*` semantic tokens |
| 3 | Color treatment for completed state | ✅ Resolved | `color.progress.completed.*` semantic tokens |
| 4 | Error state color | ✅ Resolved | `color.progress.error.*` semantic tokens (rare/edge case) |
| 5 | Disabled state treatment | ✅ Resolved | Removed — DesignerPunk doesn't support disabled states |
| 6 | Connector thickness and tokens | ✅ Resolved | `borderDefault` (1px) |
| 7 | Connector colors | ✅ Resolved | `color.progress.completed.connector` (green100), `color.progress.pending.connector` (white200) |
| 8 | Component vs semantic token strategy | ✅ Resolved | Components reference semantic tokens directly (no component color tokens) |
| 9 | Label typography token | ✅ Resolved | `typography.labelSm` (14px) for both md and lg — single size keeps label secondary to node |
| 10 | sm size completed state signaling | ✅ Resolved | Steppers don't support sm — no longer an issue |
| 11 | Spec directory rename | ✅ Resolved | Rename to `048-progress-family` to reflect full family scope |
| 12 | Node shape for Stepper-Detailed | ✅ Resolved | Circles only — universally recognized; connectors and labels already distinguish Stepper-Detailed from Stepper-Base |
| 13 | Current node visual emphasis | ✅ Resolved | Size animation (+4px) provides non-color differentiation for accessibility |
| 14 | Orientation support | ✅ Resolved | Horizontal only for initial release; vertical deferred to future |
| 15 | Pagination scale limits | ✅ Resolved | Max 50 items with virtualization (5 visible, sliding window) |
| 16 | Stepper scale limits | ✅ Resolved | Max 8 steps (dev error, production warning+clamp) |
| 17 | Icon precedence in Stepper-Detailed | ✅ Resolved | Completed steps always show checkmarks; user icons only for current/incomplete/error |
| 18 | Current size token strategy | ✅ Resolved | Formula-based component tokens (SPACING_BASE_VALUE × multiplier) — approved by Ada, consistent with Avatar precedent |

---

## Next Steps

1. ✅ **Design outline created** — initial decisions documented
2. ✅ **Architecture revised** — full family with 3 primitives + 3 semantic variants
3. ✅ **Sizing confirmed** — 12/16/24px with half-size gaps
4. ✅ **Naming confirmed** — Pagination-Base, Stepper-Base, Stepper-Detailed
5. ✅ **Industry research** — compared with Apple, Material, Carbon, Atlassian, Shopify, Airbnb
6. ✅ **Size management** — pagination: sm/md/lg; steppers: md/lg only
7. ✅ **Token architecture finalized** — new `color.progress.*` semantic family, components reference semantics directly
8. ✅ **Disabled state removed** — DesignerPunk doesn't support disabled for usability/accessibility
9. ✅ **Thurgood review** — testability, validation, virtualization, accessibility
10. ✅ **Current node emphasis** — size animation (+4px) for non-color differentiation
11. ✅ **Orientation scoped** — horizontal only for initial release
12. ✅ **Scale limits defined** — pagination max 50 (virtualized), steppers max 8
13. ✅ **Icon precedence clarified** — completed = checkmark always
14. ✅ **Ada review complete** — formula-based component tokens approved (SPACING_BASE_VALUE × multiplier)
15. ⏳ **Ada testing requirements** — token formula validation, compliance tests, cross-platform translation, governance tests
16. ⏳ **Lina review** — component naming, composition patterns, primitive/semantic layering
17. ⏳ **Lina testing requirements** — behavioral contract tests (stemma), composition tests, accessibility tests, visual state tests, platform parity tests
18. ⏳ **Create semantic tokens** — `color.progress.*` family (10 tokens)
19. ⏳ **Create component tokens** — sizing, spacing, current sizes (13 tokens)
20. ⏳ **Create requirements.md** — EARS format with all testing requirements from Ada, Lina, and Thurgood
21. ⏳ **Create design.md** — detailed architecture with virtualization logic
22. ⏳ **Create tasks.md** — implementation plan with validation tiers and test tasks

---

## Agent Review
- [x] Ada (Rosetta/Token review)
  - **Token governance approval**: ✅ Formula-based component tokens approved (SPACING_BASE_VALUE × multiplier pattern)
  - **Testing requirements provided**: See Ada Testing Requirements section
- [x] Lina (Stemma/Component review)
  - **Component architecture approval**: ✅ Naming conventions, composition patterns, primitive/semantic layering validated
  - **Testing requirements provided**: See Lina Testing Requirements section
- [x] Thurgood (Quality/Testability review)
  - **Completed**: Validation/error handling, pagination virtualization, accessibility, test coverage requirements
  - **Testing requirements provided**: Unit tests for virtualization logic, validation behavior tests, state derivation tests, accessibility tests for virtualization
- [ ] Peter (Final approval)

**Status**: ✅ All agent reviews complete. Ready for requirements.md creation.

---

## Ada Testing Requirements

### Token Formula Validation Tests

**Purpose**: Verify that formula-based component tokens derive correct values from SPACING_BASE_VALUE.

**Test Coverage**:
1. **Formula correctness**:
   - `progress.node.size.sm.current` = SPACING_BASE_VALUE × 2 = 16px
   - `progress.node.size.md.current` = SPACING_BASE_VALUE × 2.5 = 20px
   - `progress.node.size.lg.current` = SPACING_BASE_VALUE × 3.5 = 28px

2. **Mathematical relationship validation**:
   - Current size = base size + 4px for all variants
   - sm: 16px = 12px (space150) + 4px ✓
   - md: 20px = 16px (space200) + 4px ✓
   - lg: 28px = 24px (space300) + 4px ✓

3. **Baseline grid alignment**:
   - All current sizes sit on valid baseline grid subdivisions
   - 16px = 8px × 2 ✓
   - 20px = 8px × 2.5 ✓
   - 28px = 8px × 3.5 ✓

**Test Implementation**:
```typescript
describe('Progress Token Formula Validation', () => {
  const SPACING_BASE_VALUE = 8;

  test('current size formulas derive correct values', () => {
    expect(SPACING_BASE_VALUE * 2).toBe(16);    // sm.current
    expect(SPACING_BASE_VALUE * 2.5).toBe(20);  // md.current
    expect(SPACING_BASE_VALUE * 3.5).toBe(28);  // lg.current
  });

  test('current sizes maintain +4px offset from base', () => {
    const baseSmSize = 12;  // space150
    const baseMdSize = 16;  // space200
    const baseLgSize = 24;  // space300

    expect(SPACING_BASE_VALUE * 2).toBe(baseSmSize + 4);
    expect(SPACING_BASE_VALUE * 2.5).toBe(baseMdSize + 4);
    expect(SPACING_BASE_VALUE * 3.5).toBe(baseLgSize + 4);
  });

  test('current sizes align to baseline grid subdivisions', () => {
    const smCurrent = SPACING_BASE_VALUE * 2;
    const mdCurrent = SPACING_BASE_VALUE * 2.5;
    const lgCurrent = SPACING_BASE_VALUE * 3.5;

    expect(smCurrent % (SPACING_BASE_VALUE / 2)).toBe(0);  // 16px divisible by 4px
    expect(mdCurrent % (SPACING_BASE_VALUE / 2)).toBe(0);  // 20px divisible by 4px
    expect(lgCurrent % (SPACING_BASE_VALUE / 2)).toBe(0);  // 28px divisible by 4px
  });
});
```

### Token Compliance Tests

**Purpose**: Verify that all progress tokens follow Rosetta System governance rules.

**Test Coverage**:
1. **Semantic token structure**:
   - All `color.progress.*` tokens reference primitives (not hard-coded values)
   - Token naming follows concept-first pattern (`.current`, `.pending`, `.completed`, `.error`)
   - Background/text/connector variants exist for each state

2. **Component token structure**:
   - Size tokens reference primitives OR use formula-based derivation
   - No arbitrary hard-coded values
   - All tokens include `reasoning` field

3. **Token hierarchy compliance**:
   - Components reference semantic tokens for color (not primitives)
   - Components reference primitives OR formulas for sizing
   - No component tokens bypass the semantic layer for color

**Test Implementation**:
```typescript
describe('Progress Token Compliance', () => {
  test('semantic color tokens reference primitives', () => {
    expect(colorProgressTokens['color.progress.current.background'].value).toBe('cyan300');
    expect(colorProgressTokens['color.progress.pending.background'].value).toBe('white300');
    expect(colorProgressTokens['color.progress.completed.background'].value).toBe('green100');
    expect(colorProgressTokens['color.progress.error.background'].value).toBe('pink100');
  });

  test('component size tokens use primitives or formulas', () => {
    const smToken = progressComponentTokens['progress.node.size.sm'];
    const smCurrentToken = progressComponentTokens['progress.node.size.sm.current'];

    expect(smToken.primitiveReferences.value).toBe('space150');  // Primitive reference
    expect(smCurrentToken.value).toBe(SPACING_BASE_VALUE * 2);   // Formula
  });

  test('all component tokens include reasoning', () => {
    Object.values(progressComponentTokens).forEach(token => {
      expect(token.reasoning).toBeDefined();
      expect(typeof token.reasoning).toBe('string');
      expect(token.reasoning.length).toBeGreaterThan(0);
    });
  });
});
```

### Cross-Platform Translation Tests

**Purpose**: Verify that formula-based tokens translate correctly to web/iOS/Android.

**Test Coverage**:
1. **Web (CSS custom properties)**:
   - `--progress-node-size-sm-current: 16px`
   - `--progress-node-size-md-current: 20px`
   - `--progress-node-size-lg-current: 28px`

2. **iOS (Swift constants)**:
   - `ProgressTokens.nodeSizeSmCurrent = 16.0`
   - `ProgressTokens.nodeSizeMdCurrent = 20.0`
   - `ProgressTokens.nodeSizeLgCurrent = 28.0`

3. **Android (Kotlin constants)**:
   - `ProgressTokens.nodeSizeSmCurrent = 16.dp`
   - `ProgressTokens.nodeSizeMdCurrent = 20.dp`
   - `ProgressTokens.nodeSizeLgCurrent = 28.dp`

**Test Implementation**:
```typescript
describe('Progress Token Cross-Platform Translation', () => {
  test('web CSS output includes current size tokens', () => {
    const cssOutput = generateWebTokens(progressComponentTokens);
    
    expect(cssOutput).toContain('--progress-node-size-sm-current: 16px');
    expect(cssOutput).toContain('--progress-node-size-md-current: 20px');
    expect(cssOutput).toContain('--progress-node-size-lg-current: 28px');
  });

  test('iOS Swift output includes current size tokens', () => {
    const swiftOutput = generateIOSTokens(progressComponentTokens);
    
    expect(swiftOutput).toContain('nodeSizeSmCurrent: CGFloat = 16.0');
    expect(swiftOutput).toContain('nodeSizeMdCurrent: CGFloat = 20.0');
    expect(swiftOutput).toContain('nodeSizeLgCurrent: CGFloat = 28.0');
  });

  test('Android Kotlin output includes current size tokens', () => {
    const kotlinOutput = generateAndroidTokens(progressComponentTokens);
    
    expect(kotlinOutput).toContain('val nodeSizeSmCurrent = 16.dp');
    expect(kotlinOutput).toContain('val nodeSizeMdCurrent = 20.dp');
    expect(kotlinOutput).toContain('val nodeSizeLgCurrent = 28.dp');
  });
});
```

### Token Governance Tests

**Purpose**: Verify that progress tokens follow established governance patterns.

**Test Coverage**:
1. **Semantic token count**: 10 tokens in `color.progress.*` family
2. **Component token count**: 13 tokens (6 base sizes, 3 current sizes, 3 gaps, 1 connector thickness)
3. **No orphaned tokens**: All component tokens are used by at least one component
4. **Naming consistency**: All tokens follow kebab-case, concept-first naming

**Test Implementation**:
```typescript
describe('Progress Token Governance', () => {
  test('semantic color.progress family has 10 tokens', () => {
    const progressColorTokens = Object.keys(colorTokens).filter(key => 
      key.startsWith('color.progress.')
    );
    expect(progressColorTokens.length).toBe(10);
  });

  test('component token family has 13 tokens', () => {
    const progressComponentTokenKeys = Object.keys(progressComponentTokens);
    expect(progressComponentTokenKeys.length).toBe(13);
  });

  test('all tokens follow naming conventions', () => {
    const allProgressTokens = [
      ...Object.keys(colorTokens).filter(k => k.startsWith('color.progress.')),
      ...Object.keys(progressComponentTokens)
    ];

    allProgressTokens.forEach(tokenName => {
      expect(tokenName).toMatch(/^[a-z]+(\.[a-z]+)+$/);  // kebab-case with dots
      expect(tokenName).not.toContain('_');  // No underscores
      expect(tokenName).not.toContain(' ');  // No spaces
    });
  });
});
```

---

## Lina Testing Requirements

### 1. Stemma Behavioral Contract Tests

**Purpose**: Verify that all three semantic variants follow Stemma System component contracts.

**Test Coverage**:

**Pagination-Base:**
- Component naming: `Progress-Pagination-Base` follows `[Family]-[Type]-[Variant]` pattern
- Component type classification: `'semantic'` (not primitive or standalone)
- State management: Derives node states from `currentItem` prop
- Prop validation: `totalItems` ≤ 50, `currentItem` within bounds
- Accessibility: `role="group"`, `aria-label` reflects actual position (not virtualized subset)

**Stepper-Base:**
- Component naming: `Progress-Stepper-Base` follows pattern
- Component type classification: `'semantic'`
- State management: Derives node states from `currentStep` and `errorSteps`
- Prop validation: `totalSteps` ≤ 8, `currentStep` within bounds
- Accessibility: `role="progressbar"`, `aria-valuenow`/`aria-valuemin`/`aria-valuemax`
- Connector composition: Renders connectors between all nodes

**Stepper-Detailed:**
- Component naming: `Progress-Stepper-Detailed` follows pattern
- Component type classification: `'semantic'`
- State management: Derives node states from `currentStep` and `errorSteps`
- Prop validation: `steps.length` ≤ 8, `currentStep` within bounds
- Accessibility: `role="list"` with `role="listitem"` for each step
- Label composition: Renders labels for all nodes (always visible)
- Icon precedence: Completed steps always show checkmarks, user icons only for current/incomplete/error

**Test Implementation Pattern**:
```typescript
describe('Progress-Pagination-Base Stemma Contracts', () => {
  test('should follow Stemma naming convention', () => {
    const result = validateComponentName('Progress-Pagination-Base');
    expect(result.valid).toBe(true);
    expect(result.componentType).toBe('semantic');
  });

  test('should validate required accessibility properties', () => {
    const props = { totalItems: 5, currentItem: 3 };
    const result = validatePropertyAndAccessibility('Progress-Pagination-Base', props);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('should enforce totalItems maximum (dev mode)', () => {
    process.env.NODE_ENV = 'development';
    expect(() => {
      render(<ProgressPaginationBase totalItems={51} currentItem={1} />);
    }).toThrow('supports a maximum of 50 items');
  });
});
```

**Estimated test count**: ~15 tests (5 per variant)

### 2. Primitive Composition Tests

**Purpose**: Verify that semantic variants correctly compose primitives.

**Test Coverage**:

**Pagination-Base:**
- Renders `Progress-Indicator-Node-Base` for each visible item
- Does NOT render `Progress-Indicator-Connector-Base`
- Does NOT render `Progress-Indicator-Label-Base`
- Passes correct `state` prop to each node (incomplete/current)
- Passes correct `size` prop to each node
- Passes `content='none'` to all nodes (dots only)

**Stepper-Base:**
- Renders `Progress-Indicator-Node-Base` for each step
- Renders `Progress-Indicator-Connector-Base` between all nodes
- Does NOT render `Progress-Indicator-Label-Base`
- Passes correct `state` prop to each node (incomplete/current/completed/error)
- Passes `content='checkmark'` to completed nodes, `content='none'` to others
- Passes correct connector `state` (active/inactive)

**Stepper-Detailed:**
- Renders `Progress-Indicator-Node-Base` for each step
- Renders `Progress-Indicator-Connector-Base` between all nodes
- Renders `Progress-Indicator-Label-Base` for each step
- Passes correct `state` prop to each node
- Passes `content='checkmark'` to completed nodes
- Passes `content='icon'` with user icon to current/incomplete/error nodes (if icon provided)
- Passes `content='none'` to current/incomplete/error nodes (if no icon provided)
- Passes label text and helper text to label primitive

**Test Implementation Pattern**:
```typescript
describe('Progress-Stepper-Base Composition', () => {
  test('should render node primitives for each step', () => {
    const { container } = render(<ProgressStepperBase totalSteps={4} currentStep={2} />);
    const nodes = container.querySelectorAll('progress-indicator-node-base');
    expect(nodes.length).toBe(4);
  });

  test('should render connector primitives between nodes', () => {
    const { container } = render(<ProgressStepperBase totalSteps={4} currentStep={2} />);
    const connectors = container.querySelectorAll('progress-indicator-connector-base');
    expect(connectors.length).toBe(3);  // n-1 connectors for n nodes
  });

  test('should NOT render label primitives', () => {
    const { container } = render(<ProgressStepperBase totalSteps={4} currentStep={2} />);
    const labels = container.querySelectorAll('progress-indicator-label-base');
    expect(labels.length).toBe(0);
  });

  test('should pass checkmark content to completed nodes', () => {
    const { container } = render(<ProgressStepperBase totalSteps={4} currentStep={3} />);
    const completedNodes = container.querySelectorAll('[state="completed"]');
    completedNodes.forEach(node => {
      expect(node.getAttribute('content')).toBe('checkmark');
    });
  });
});
```

**Estimated test count**: ~12 tests (4 per variant)

### 3. State Derivation Tests

**Purpose**: Verify that semantic variants correctly derive node states from props.

**Test Coverage**:

**Pagination state logic:**
- Node at `currentItem` has `state="current"`
- All other nodes have `state="incomplete"`

**Stepper state logic (priority: error > completed > current > incomplete):**
- Nodes in `errorSteps` have `state="error"` (highest priority)
- Nodes before `currentStep` have `state="completed"` (if not in errorSteps)
- Node at `currentStep` has `state="current"` (if not in errorSteps)
- Nodes after `currentStep` have `state="incomplete"`

**Test Implementation Pattern**:
```typescript
describe('Progress-Stepper-Base State Derivation', () => {
  test('should derive states correctly without errors', () => {
    const { container } = render(<ProgressStepperBase totalSteps={5} currentStep={3} />);
    
    expect(container.querySelector('[data-index="1"]').getAttribute('state')).toBe('completed');
    expect(container.querySelector('[data-index="2"]').getAttribute('state')).toBe('completed');
    expect(container.querySelector('[data-index="3"]').getAttribute('state')).toBe('current');
    expect(container.querySelector('[data-index="4"]').getAttribute('state')).toBe('incomplete');
    expect(container.querySelector('[data-index="5"]').getAttribute('state')).toBe('incomplete');
  });

  test('should prioritize error state over completed', () => {
    const { container } = render(
      <ProgressStepperBase totalSteps={5} currentStep={3} errorSteps={[1]} />
    );
    
    expect(container.querySelector('[data-index="1"]').getAttribute('state')).toBe('error');
    expect(container.querySelector('[data-index="2"]').getAttribute('state')).toBe('completed');
  });

  test('should prioritize error state over current', () => {
    const { container } = render(
      <ProgressStepperBase totalSteps={5} currentStep={2} errorSteps={[2]} />
    );
    
    expect(container.querySelector('[data-index="2"]').getAttribute('state')).toBe('error');
  });
});
```

**Estimated test count**: ~10 tests

### 4. Visual State Tests

**Purpose**: Verify that node visual states render correctly across all size variants.

**Test Coverage**:

**Node size rendering:**
- Incomplete/completed/error nodes render at base size (12/16/24px)
- Current nodes render at current size (16/20/28px) — +4px emphasis
- Size transitions respect `prefers-reduced-motion`

**Node content rendering:**
- sm nodes: always empty (dot only)
- md/lg nodes: checkmark for completed, icon for current/incomplete/error (if provided), empty otherwise

**Connector rendering:**
- Active connectors (between completed nodes) use `color.progress.completed.connector`
- Inactive connectors (between incomplete nodes) use `color.progress.pending.connector`
- Connector thickness is 1px for all sizes

**Test Implementation Pattern**:
```typescript
describe('Progress Node Visual States', () => {
  test('current node renders at emphasized size', () => {
    const { container } = render(<ProgressPaginationBase totalItems={5} currentItem={3} size="md" />);
    const currentNode = container.querySelector('[state="current"]');
    
    const computedStyle = window.getComputedStyle(currentNode);
    expect(computedStyle.width).toBe('20px');  // md current size
    expect(computedStyle.height).toBe('20px');
  });

  test('incomplete nodes render at base size', () => {
    const { container } = render(<ProgressPaginationBase totalItems={5} currentItem={3} size="md" />);
    const incompleteNodes = container.querySelectorAll('[state="incomplete"]');
    
    incompleteNodes.forEach(node => {
      const computedStyle = window.getComputedStyle(node);
      expect(computedStyle.width).toBe('16px');  // md base size
      expect(computedStyle.height).toBe('16px');
    });
  });

  test('completed nodes render checkmark icon', () => {
    const { container } = render(<ProgressStepperBase totalSteps={4} currentStep={3} size="md" />);
    const completedNodes = container.querySelectorAll('[state="completed"]');
    
    completedNodes.forEach(node => {
      const icon = node.querySelector('icon-base');
      expect(icon).toBeTruthy();
      expect(icon.getAttribute('name')).toBe('check');
    });
  });
});
```

**Estimated test count**: ~15 tests

### 5. Accessibility Tests

**Purpose**: Verify WCAG 2.1 AA compliance for all variants.

**Test Coverage**:

**ARIA roles and labels:**
- Pagination: `role="group"`, `aria-label="Page X of Y"`
- Stepper-Base: `role="progressbar"`, `aria-valuenow`/`aria-valuemin`/`aria-valuemax`
- Stepper-Detailed: `role="list"`, each step has `role="listitem"`

**Screen reader announcements:**
- Pagination with virtualization: ARIA label reflects actual position (not visible subset)
- Error steps announced with "error" suffix
- Optional steps announced with "optional" suffix

**Color contrast:**
- All node states meet WCAG AA contrast requirements against background
- Current node size emphasis provides non-color differentiation

**Keyboard navigation:**
- Components are non-interactive (no keyboard handlers needed)
- Parent flow handles navigation

**Motion:**
- Size transitions respect `prefers-reduced-motion`

**Test Implementation Pattern**:
```typescript
describe('Progress Accessibility', () => {
  test('Pagination uses correct ARIA role and label', () => {
    const { container } = render(<ProgressPaginationBase totalItems={5} currentItem={3} />);
    const group = container.querySelector('[role="group"]');
    
    expect(group).toBeTruthy();
    expect(group.getAttribute('aria-label')).toBe('Page 3 of 5');
  });

  test('Pagination with virtualization reflects actual position in ARIA', () => {
    const { container } = render(<ProgressPaginationBase totalItems={50} currentItem={26} />);
    const group = container.querySelector('[role="group"]');
    
    expect(group.getAttribute('aria-label')).toBe('Page 26 of 50');
    // Not "Page 3 of 5" (visible subset)
  });

  test('Stepper-Base uses progressbar role with correct values', () => {
    const { container } = render(<ProgressStepperBase totalSteps={4} currentStep={2} />);
    const progressbar = container.querySelector('[role="progressbar"]');
    
    expect(progressbar).toBeTruthy();
    expect(progressbar.getAttribute('aria-valuenow')).toBe('2');
    expect(progressbar.getAttribute('aria-valuemin')).toBe('1');
    expect(progressbar.getAttribute('aria-valuemax')).toBe('4');
  });

  test('Stepper-Detailed announces error steps', () => {
    const { container } = render(
      <ProgressStepperDetailed
        steps={[{ label: 'Step 1' }, { label: 'Step 2' }]}
        currentStep={2}
        errorSteps={[1]}
      />
    );
    
    const errorStep = container.querySelector('[data-index="1"]');
    expect(errorStep.getAttribute('aria-label')).toContain('error');
  });

  test('respects prefers-reduced-motion for size transitions', () => {
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));

    const { container } = render(<ProgressPaginationBase totalItems={5} currentItem={3} />);
    const currentNode = container.querySelector('[state="current"]');
    
    const computedStyle = window.getComputedStyle(currentNode);
    expect(computedStyle.transition).toBe('none');
  });
});
```

**Estimated test count**: ~12 tests

### 6. Platform Parity Tests

**Purpose**: Verify that web/iOS/Android implementations render equivalent visual states.

**Test Coverage**:

**Cross-platform node rendering:**
- All platforms render same number of nodes for given props
- All platforms derive same states for each node
- All platforms apply same size tokens (translated to platform units)

**Cross-platform connector rendering:**
- All platforms render connectors between nodes (Stepper-Base, Stepper-Detailed)
- All platforms apply same connector colors and thickness

**Cross-platform label rendering:**
- All platforms render labels (Stepper-Detailed only)
- All platforms apply same typography token

**Test Implementation Pattern**:
```typescript
describe('Progress Platform Parity', () => {
  test('web and iOS render same node count', () => {
    const webOutput = renderWeb(<ProgressStepperBase totalSteps={4} currentStep={2} />);
    const iosOutput = renderIOS(<ProgressStepperBase totalSteps={4} currentStep={2} />);
    
    expect(webOutput.nodeCount).toBe(4);
    expect(iosOutput.nodeCount).toBe(4);
  });

  test('web and Android derive same node states', () => {
    const props = { totalSteps: 5, currentStep: 3, errorSteps: [1] };
    
    const webStates = deriveNodeStatesWeb(props);
    const androidStates = deriveNodeStatesAndroid(props);
    
    expect(webStates).toEqual(androidStates);
    expect(webStates).toEqual(['error', 'completed', 'current', 'incomplete', 'incomplete']);
  });

  test('all platforms apply same size tokens', () => {
    const webSize = getWebNodeSize('md', 'current');
    const iosSize = getIOSNodeSize('md', 'current');
    const androidSize = getAndroidNodeSize('md', 'current');
    
    expect(webSize).toBe('20px');
    expect(iosSize).toBe(20.0);  // CGFloat
    expect(androidSize).toBe('20.dp');
  });
});
```

**Estimated test count**: ~9 tests

### Summary

**Total estimated test count**: ~73 component-level tests
- Stemma contracts: ~15 tests
- Composition: ~12 tests
- State derivation: ~10 tests
- Visual states: ~15 tests
- Accessibility: ~12 tests
- Platform parity: ~9 tests

**Test priority**:
1. **Critical**: Stemma contracts, state derivation, accessibility
2. **High**: Composition, visual states
3. **Medium**: Platform parity

**Integration with other test suites**:
- Ada's token tests validate formula correctness and cross-platform translation
- Thurgood's tests validate virtualization logic, validation behavior, and error handling
- Lina's tests validate component behavior, composition, and accessibility

---

**Organization**: spec-guide
**Scope**: 048-progress-family
