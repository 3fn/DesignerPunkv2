# Progress-Bar-Base

**Family**: ProgressIndicator | **Type**: Primitive (standalone)

Continuous percentage-based progress indicator. Horizontal bar with track and fill. Determinate mode (0–1 value) and indeterminate mode (pulsing opacity).

## Usage

```html
<!-- Determinate: 75% complete -->
<progress-bar value="0.75" accessibility-label="Profile completion" size="md"></progress-bar>

<!-- Indeterminate: loading -->
<progress-bar mode="indeterminate" accessibility-label="Loading data"></progress-bar>

<!-- Small size -->
<progress-bar value="0.5" accessibility-label="Upload progress" size="sm"></progress-bar>
```

## Key Features

- **Determinate**: Smooth fill transition on value change
- **Indeterminate**: Pulsing opacity animation (platform-neutral)
- **Sizes**: sm (4px), md (8px, default), lg (12px)
- **Fail loudly**: Runtime error on value outside 0–1
- **Accessible**: `role="progressbar"`, milestone announcements at 0/25/50/75/100%
- **Reduced motion**: Instant fill (determinate), static at 33% (indeterminate)

## Spec

- Design: `.kiro/specs/090-linear-progress-bar/design.md`
