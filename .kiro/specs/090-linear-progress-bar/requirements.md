# Requirements Document: Progress-Bar-Base Component

**Date**: 2026-04-03
**Spec**: 090 - Linear Progress Bar
**Status**: Requirements Phase
**Dependencies**: Spec 092 (Sizing Token Family — complete)

---

## Introduction

Gap report #2 (Spec 083) identified that the ProgressIndicator family has steppers and pagination (discrete/sequential) but no continuous/percentage-based variant. This spec adds Progress-Bar-Base — a horizontal bar showing completion from 0% to 100%, with determinate and indeterminate modes.

---

## Requirements

### Requirement 1: Determinate Mode

**User Story**: As a product architect, I want a progress bar that shows a specific completion percentage, so that users can see how far along a process is.

#### Acceptance Criteria

1. WHEN `mode` is `determinate` (default) THEN the component SHALL accept a `value` prop normalized to 0–1
2. The fill width SHALL represent the `value` as a proportion of the track width (0 = empty, 1 = full)
3. WHEN `value` changes THEN the fill SHALL transition smoothly using `duration150` and `easingStandard` motion tokens
4. WHEN the user has reduced motion enabled THEN the fill SHALL move to the target width immediately (no animation)
5. WHEN `value` is outside the range 0–1 THEN the component SHALL throw a descriptive runtime error: "Progress-Bar-Base: value must be between 0 and 1, received {value}"

### Requirement 2: Indeterminate Mode

**User Story**: As a product architect, I want a progress bar that indicates activity without a known completion percentage, so that users know something is happening during unknown-duration operations.

#### Acceptance Criteria

1. WHEN `mode` is `indeterminate` THEN the component SHALL NOT accept a `value` prop
2. The fill SHALL display a pulsing opacity animation communicating "working" without implying progress direction
3. The animation SHALL use `duration350` (or tuned equivalent) per cycle with `easingStandard`
4. WHEN the user has reduced motion enabled THEN the animation SHALL be disabled and the fill SHALL display at a static width of `INDETERMINATE_STATIC_FILL` (0.33) — defined as a named behavioral constant in types.ts
5. The indeterminate fill SHALL use `color.progress.current.background` (distinct from determinate's `color.progress.completed.background`)

### Requirement 3: Visual Specification

**User Story**: As a component system maintainer, I want the progress bar's visual properties driven by tokens, so that it's consistent with the design system and themeable.

#### Acceptance Criteria

1. The track SHALL render at full width with `color.progress.pending.background`
2. The fill SHALL render over the track with `color.progress.completed.background` (determinate) or `color.progress.current.background` (indeterminate)
3. Both track and fill SHALL use `radiusFull` for capsule shape
4. The component SHALL support three size variants:

   | Size | Height Token | Value |
   |------|-------------|-------|
   | `sm` | `size050` | 4px |
   | `md` (default) | `size100` | 8px |
   | `lg` | `size150` | 12px |

5. The fill SHALL grow from inline-start to inline-end, respecting RTL layout direction

### Requirement 4: Accessibility

**User Story**: As a product architect, I want the progress bar to be accessible to screen reader users, so that all users can understand the current progress state.

#### Acceptance Criteria

1. The component SHALL require an `accessibilityLabel` prop (string, not optional)
2. Web (determinate): SHALL render `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="1"`, `aria-label`
3. Web (indeterminate): SHALL render `role="progressbar"`, `aria-label`, no `aria-valuenow`
4. iOS: SHALL provide `ProgressView` semantics or equivalent `.accessibilityValue` with percentage
5. Android: SHALL provide `semantics { progressBarRangeInfo = ProgressBarRangeInfo(current, 0f, 1f) }`
6. Screen reader announcements SHALL occur at milestone values (0%, 25%, 50%, 75%, 100%) — NOT on every value change

### Requirement 5: Platform Implementation

**User Story**: As a platform engineer, I want True Native implementations that use custom views for token control and cross-platform consistency.

#### Acceptance Criteria

1. Progress-Bar-Base SHALL have implementations for web, iOS, and Android
2. Implementations SHALL use custom views (not wrapping UIProgressView, LinearProgressIndicator, or `<progress>`)
3. All dimensions, colors, border radius, and motion SHALL be token-driven
4. RTL layout direction SHALL be supported on all platforms (CSS logical properties on web, layout direction on iOS/Android)

### Requirement 6: Behavioral Contracts

**User Story**: As a test governance specialist, I want behavioral contracts that define the progress bar's visual states, animation, and accessibility, so that cross-platform consistency is verifiable.

#### Acceptance Criteria

1. Contracts SHALL cover: progressbar role, track/fill rendering, size variants, value transition animation, indeterminate animation, reduced motion, value range validation
2. Contracts SHALL be defined in `contracts.yaml` following the uniform contract system
3. Any new contract concepts SHALL be added to the Contract System Reference concept catalog via ballot measure

### Requirement 7: Documentation

**User Story**: As any agent, I want the ProgressIndicator family documentation updated to include the progress bar, so that the component catalog is complete and queryable.

#### Acceptance Criteria

1. `Component-Family-Progress.md` SHALL be updated with a Progress-Bar-Base section including a metadata block
2. `family-guidance/progress.yaml` SHALL be updated with selection rules distinguishing bar (continuous) from stepper/pagination (discrete)
3. Component metadata (`component-meta.yaml`) SHALL be generated via the extraction pipeline
4. Progress-Bar-Base SHALL be queryable via Application MCP after indexing
5. `find_components({ purpose: "progress" })` SHALL return Progress-Bar-Base alongside existing Progress family components

### Documentation Requirements Waiver

This spec introduces a new component. Standard component documentation requirements apply (family doc, guidance YAML, metadata, README, examples).
