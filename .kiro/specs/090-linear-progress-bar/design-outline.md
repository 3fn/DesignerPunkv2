# Progress-Bar-Base Component — Design Outline

**Date**: 2026-04-03
**Author**: Lina
**Purpose**: Capture design decisions before creating full spec
**Status**: Design Outline — Draft
**Family**: ProgressIndicator
**Gap Report**: #2 (Spec 083)

---

## Component Overview

Progress-Bar-Base is a continuous/percentage-based progress indicator — a horizontal bar showing completion from 0% to 100%. It fills the gap between the existing discrete/sequential progress components (steppers, pagination) and the need for continuous progress visualization (profile completeness, upload progress, onboarding completion).

**Key Characteristics**:
- **Continuous**: 0–1 normalized value, not discrete steps
- **Two modes**: Determinate (known percentage) and indeterminate (unknown duration)
- **Non-interactive**: Display-only, no user interaction
- **Accessible**: `role="progressbar"` with `aria-valuenow`/`aria-valuemin`/`aria-valuemax`
- **Animated**: Smooth fill transition on value change, looping animation for indeterminate

---

## Platform Convention Analysis

Unlike the top bar (Spec 088), progress bars are structurally consistent across platforms. The visual model is universal: a track (background) with a fill (foreground) that grows from inline-start to inline-end.

| Aspect | iOS | Android | Web |
|--------|-----|---------|-----|
| Native component | UIProgressView | LinearProgressIndicator (Material 3) | `<progress>` element |
| Track shape | Rounded capsule | Rounded or flat | Browser-dependent |
| Indeterminate | Animated shimmer | Animated sliding bar | Browser-dependent |
| Height | 4pt default | 4dp default | Browser-dependent |

Platform divergence is minimal — this is primarily a visual/animation component, not a structural one. Custom implementation (like Spec 088) is still the right call for token control and cross-platform consistency.

---

## Architecture Decision: Standalone Primitive

Unlike Nav-Header (primitive + semantic variants), Progress-Bar-Base is a standalone primitive. Reasons:

- The component is simple — track + fill + optional label. No slot architecture needed.
- Semantic variants (upload bar with cancel, step counter bar) are speculative. Ship the primitive, add variants when real use cases emerge.
- The existing Progress family primitives (Node, Connector, Label) are standalone — this follows the same pattern.

If semantic variants are needed later, they compose this primitive (like Stepper-Base composes Node-Base + Connector-Base).

---

## Proposed Props Interface

```typescript
interface ProgressBarBaseProps {
  /** Progress value, 0 to 1. Ignored when mode is 'indeterminate'. */
  value?: number;

  /** Display mode */
  mode?: 'determinate' | 'indeterminate';

  /** Accessible label describing what the bar represents */
  accessibilityLabel: string;

  /** Size variant */
  size?: 'sm' | 'md' | 'lg';

  /** Test identifier */
  testID?: string;
}
```

### Design Decisions in the Props

- **`value` is 0–1, not 0–100**: Normalized values are cleaner for math and consistent with iOS (`UIProgressView.progress`) and Android (`LinearProgressIndicator(progress = 0.5f)`). Percentage display is a presentation concern, not a data concern.
- **`mode` instead of `indeterminate: boolean`**: Explicit mode is clearer than a boolean. Extensible if future modes emerge (e.g., `'buffer'` for video buffering with two fill levels).
- **`accessibilityLabel` is required**: A progress bar without context ("Loading profile" vs "Uploading file") is meaningless to screen reader users. Required, not optional.
- **No `label` or `showPercentage` prop**: The bar is a visual primitive. Text labels and percentage displays are composition concerns — the consumer wraps the bar with text. This keeps the primitive focused.
- **No `color` or `variant` prop**: The bar uses progress color tokens (`color.progress.completed.background` for fill, `color.progress.pending.background` for track). If a product needs a different color (e.g., error state), that's a semantic variant concern, not a primitive concern.

### What the Props Don't Expose

- **Track/fill colors**: Token-driven, not configurable
- **Border radius**: Token-driven (component token)
- **Animation duration/easing**: Motion tokens, not configurable
- **Text label or percentage**: Composition concern — consumer adds text alongside the bar

---

## Visual Specification

### Structure

```
┌──────────────────────────────────────────────┐
│ Track (full width, background color)         │
│ ┌─────────────────────┐                      │
│ │ Fill (0–100% width)  │                      │
│ └─────────────────────┘                      │
└──────────────────────────────────────────────┘
```

### Size Variants

| Size | Height | Use Case |
|------|--------|----------|
| `sm` | 4px | Inline indicators, compact layouts |
| `md` | 8px | Default, most use cases |
| `lg` | 12px | Prominent indicators, hero sections |

Heights follow the base-4 grid (4, 8, 12). These need component tokens — flag for Ada.

### Colors

| Element | Token | Purpose |
|---------|-------|---------|
| Track | `color.progress.pending.background` | Unfilled portion |
| Fill (determinate) | `color.progress.completed.background` | Filled portion |
| Fill (indeterminate) | `color.progress.current.background` | Animated indicator |

Existing tokens — no new color tokens needed.

### Border Radius

Track and fill use `radiusFull` (pill shape) — the bar is a capsule, not a rectangle. This matches iOS convention and Material 3's rounded variant.

### Animation

**Determinate**: When `value` changes, the fill width transitions smoothly.
- Duration: `duration150` (quick, responsive feel)
- Easing: `easingStandard`

**Indeterminate**: A fill segment animates continuously from inline-start to inline-end.
- Duration: `duration350` per cycle (or longer — needs visual tuning)
- Easing: `easingStandard` or a custom loop easing

**Reduced motion**: Both animations collapse to immediate state. Determinate shows the fill at the target width instantly. Indeterminate shows a static fill at ~30% width (visual indication that something is happening without animation).

---

## Token Requirements

| Category | Token | Notes |
|----------|-------|-------|
| Color | `color.progress.pending.background` | Track background — exists |
| Color | `color.progress.completed.background` | Determinate fill — exists |
| Color | `color.progress.current.background` | Indeterminate fill — exists |
| Border | `radiusFull` | Capsule shape — exists |
| Motion | `duration150` | Determinate transition — exists |
| Motion | `easingStandard` | Transition easing — exists |
| Component | `progressBar.height.sm` | 4px — **needs creation** |
| Component | `progressBar.height.md` | 8px — **needs creation** |
| Component | `progressBar.height.lg` | 12px — **needs creation** |

3 new component tokens needed for bar height. These reference spacing primitives (`space050` = 4px, `space100` = 8px, `space150` = 12px). Ada to create — small scope, not a separate spec.

---

## Accessibility

### ARIA Pattern

- **Web (determinate)**: `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="1"`, `aria-label`
- **Web (indeterminate)**: `role="progressbar"`, `aria-label`, no `aria-valuenow` (value unknown)
- **iOS**: `ProgressView` semantics or `.accessibilityValue` with percentage
- **Android**: `semantics { progressBarRangeInfo = ProgressBarRangeInfo(current, 0f, 1f) }`

### Screen Reader Announcements

- Determinate: "[label], [percentage]% complete"
- Indeterminate: "[label], loading"
- Value changes should NOT trigger live region announcements on every update (would be noisy during continuous progress). Announce at milestones (0%, 25%, 50%, 75%, 100%) or on completion only.

---

## Behavioral Contracts (Preliminary)

| Contract | Category | Description |
|----------|----------|-------------|
| `accessibility_progressbar_role` | accessibility | Correct ARIA role and value attributes |
| `visual_track_fill` | visual | Track and fill render with correct tokens |
| `visual_size_variants` | visual | Three size variants with correct heights |
| `animation_value_transition` | animation | Smooth fill transition on value change |
| `animation_indeterminate_loop` | animation | Continuous animation in indeterminate mode |
| `accessibility_reduced_motion` | accessibility | Animations collapse to immediate/static |
| `content_value_clamping` | content | Values outside 0–1 clamped, not errored |

---

## Open Questions

1. **Indeterminate animation style**: Sliding bar (Material), shimmer (iOS), or pulsing? Recommend sliding bar — it's the most universally recognized pattern.

2. **Value clamping vs error**: When `value` is < 0 or > 1, clamp silently or throw? Recommend clamp silently (0 for negatives, 1 for > 1) with a dev-mode console warning. Consistent with how Badge-Count-Base handles overflow.

3. **RTL behavior**: Fill grows from inline-start to inline-end. In RTL, this means right-to-left. CSS logical properties handle this on web. iOS and Android need explicit RTL support. Confirm this is the expected behavior.

4. **Component token creation**: Ada to create 3 height tokens. Small enough to be a subtask, not a separate spec. Confirm.

---

## DesignerPunk Philosophy Alignment

- **No disabled states**: If progress isn't applicable, don't render the bar
- **Build-time platform separation**: Three platform files, shared types.ts
- **Token-first**: All dimensions, colors, motion from tokens
- **Accessibility-first**: Required label, ARIA progressbar pattern, reduced motion
- **True Native**: Custom implementations for token control, but minimal platform divergence (unlike Spec 088)
