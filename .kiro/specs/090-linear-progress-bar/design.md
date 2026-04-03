# Design Document: Progress-Bar-Base Component

**Date**: 2026-04-03
**Spec**: 090 - Linear Progress Bar
**Status**: Design Phase
**Dependencies**: Spec 092 (Sizing Token Family — complete)

---

## Overview

Standalone primitive in the ProgressIndicator family. Horizontal bar with track (background) and fill (foreground). Two modes: determinate (0–1 value with smooth transition) and indeterminate (pulsing opacity animation). Three size variants. Non-interactive, display-only.

---

## Architecture

### Family Placement

```
ProgressIndicator Family
    ├── Progress-Indicator-Node-Base (discrete step node)
    ├── Progress-Indicator-Connector-Base (connector between nodes)
    ├── Progress-Indicator-Label-Base (step label)
    ├── Progress-Pagination-Base (dot pagination)
    ├── Progress-Stepper-Base (labeled stepper)
    ├── Progress-Stepper-Detailed (stepper with descriptions)
    └── Progress-Bar-Base (continuous bar) ← NEW
```

Standalone primitive — no inheritance, no semantic variants. Composes with nothing internally. Future semantic variants (upload bar, buffer bar) would compose this primitive.

### Component Structure

```
┌──────────────────────────────────────────────┐
│ Track (full width, radiusFull, pending color) │
│ ┌─────────────────────┐                      │
│ │ Fill (% width)       │                      │
│ └─────────────────────┘                      │
└──────────────────────────────────────────────┘
```

Two elements: track (always full width) and fill (variable width or animated). Both capsule-shaped (`radiusFull`).

---

## Components and Interfaces

### Props (Discriminated Union)

```typescript
/** Named behavioral constant — not a design token */
const INDETERMINATE_STATIC_FILL = 0.33;
// Visually distinct from empty and complete states
// while communicating ongoing activity.

type ProgressBarBaseProps =
  | {
      mode?: 'determinate';
      value: number;  // 0–1, throws if outside range
      accessibilityLabel: string;
      size?: 'sm' | 'md' | 'lg';  // default: 'md'
      testID?: string;
    }
  | {
      mode: 'indeterminate';
      accessibilityLabel: string;
      size?: 'sm' | 'md' | 'lg';  // default: 'md'
      testID?: string;
    };
```

### Files Created

| File | Purpose |
|------|---------|
| `src/components/core/Progress-Bar-Base/types.ts` | Props, `INDETERMINATE_STATIC_FILL` constant |
| `src/components/core/Progress-Bar-Base/Progress-Bar-Base.schema.yaml` | Schema |
| `src/components/core/Progress-Bar-Base/contracts.yaml` | Behavioral contracts |
| `src/components/core/Progress-Bar-Base/tokens.ts` | Component token references |
| `src/components/core/Progress-Bar-Base/platforms/web/ProgressBarBase.web.ts` | Web implementation |
| `src/components/core/Progress-Bar-Base/platforms/ios/ProgressBarBase.ios.swift` | iOS implementation |
| `src/components/core/Progress-Bar-Base/platforms/android/ProgressBarBase.android.kt` | Android implementation |
| `src/components/core/Progress-Bar-Base/component-meta.yaml` | Generated via extraction pipeline |

---

## Design Decisions

### Decision 1: Value Validation — Fail Loudly

`value` outside 0–1 throws a descriptive runtime error. Progress out-of-range is a developer bug. Error message: "Progress-Bar-Base: value must be between 0 and 1, received {value}". Consistent with Nav-SegmentedChoice-Base's segment count validation.

### Decision 2: Indeterminate Animation — Pulsing Opacity

Fill pulses in opacity rather than sliding across the track. Pulsing says "alive and working" without implying directionality or false progress. Platform-neutral — same visual model on all three platforms.

- Animation: opacity cycles between ~0.3 and 1.0
- Duration: `duration350` per cycle (tunable during implementation)
- Easing: `easingStandard`
- Reduced motion: static fill at `INDETERMINATE_STATIC_FILL` (0.33) width, no animation

### Decision 3: No Label or Percentage Props

The bar is a visual primitive. Text labels ("75% complete", "Uploading 3 of 8") are composition concerns — the consumer wraps the bar with text. Leonardo confirmed this matches his workflow: text around progress bars is always context-specific.

### Decision 4: Milestone Announcements

Screen reader announcements at 0%, 25%, 50%, 75%, 100% — not on every value change. Prevents noise during continuous progress updates. Implementation tracks the last announced milestone and announces when a new threshold is crossed.

---

## Token Dependencies

| Category | Token | Consumer |
|----------|-------|---------|
| Color | `color.progress.pending.background` | Track |
| Color | `color.progress.completed.background` | Determinate fill |
| Color | `color.progress.current.background` | Indeterminate fill |
| Sizing | `size050` | Bar height sm (4px) |
| Sizing | `size100` | Bar height md (8px) |
| Sizing | `size150` | Bar height lg (12px) |
| Border | `radiusFull` | Capsule shape (track + fill) |
| Motion | `duration150` | Determinate value transition |
| Motion | `duration350` | Indeterminate pulse cycle |
| Motion | `easingStandard` | Both animations |

All tokens exist. No new tokens needed.

---

## Error Handling

| Condition | Behavior |
|-----------|----------|
| `value` < 0 or > 1 (determinate) | Runtime error with descriptive message |
| `value` provided in indeterminate mode | TypeScript prevents at compile time (discriminated union) |
| `accessibilityLabel` empty string | Valid but unhelpful — no runtime error (TypeScript enforces non-optional) |
| Reduced motion enabled | Determinate: instant fill. Indeterminate: static at 0.33 width. |

---

## Testing Strategy

| Test Category | What It Validates |
|--------------|-------------------|
| Behavioral contracts | Progressbar role, track/fill rendering, size variants |
| Value transition | Smooth fill animation on value change, reduced motion instant |
| Indeterminate animation | Pulsing opacity, reduced motion static fill at 0.33 |
| Accessibility | ARIA attributes, milestone announcements, required label |
| Validation | Runtime error on out-of-range value |
| Cross-platform | RTL fill direction, consistent rendering |

---

## Correctness Properties

1. Determinate fill width is exactly `value × track width` (within subpixel tolerance)
2. Indeterminate mode never renders `aria-valuenow`
3. Reduced motion disables all animation — determinate is instant, indeterminate is static at 0.33
4. Screen reader announcements occur only at milestone thresholds (0/25/50/75/100%)
5. Value outside 0–1 always throws — never silently clamps
6. Track and fill both use `radiusFull` — no square corners at any fill percentage
7. Size variant heights match sizing tokens exactly: sm=4, md=8, lg=12
