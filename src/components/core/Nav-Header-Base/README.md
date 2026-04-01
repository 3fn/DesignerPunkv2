# Nav-Header-Base

**Family**: Navigation | **Type**: Primitive | **Status**: Scaffold

Structural primitive for top-of-screen navigation bars. Handles safe area, background, layout regions, and landmark semantics across web, iOS, and Android.

**Internal only** — never used directly by product agents. Use [Nav-Header-Page](../Nav-Header-Page/README.md) or [Nav-Header-App](../Nav-Header-App/README.md) instead.

## What It Provides

- Three-region layout: leading, title, trailing
- Safe area integration (iOS status bar, Android system bar)
- Accessibility landmark (`<header role="banner">`)
- Opaque and translucent appearance modes
- Bottom separator with border tokens
- Focus order: leading → title → trailing

## Spec

- Design outline: `.kiro/specs/088-top-bar-component/design-outline.md`
- Design: `.kiro/specs/088-top-bar-component/design.md`
