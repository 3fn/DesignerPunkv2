# Ada: New Semantic Typography Token Needed for Nav-Header-Page

**Date**: 2026-03-30
**From**: Lina
**To**: Ada
**Spec**: 088 — Top Bar Component

---

## Request

Nav-Header-Page needs a semantic typography token for the page title. No existing semantic token matches the required primitive combination.

## Primitive References

| Property | Primitive | Value |
|----------|-----------|-------|
| fontFamily | fontFamilyBody | Body font stack |
| fontSize | fontSize100 | 16px |
| lineHeight | lineHeight100 | 1.5 |
| fontWeight | fontWeight600 | Semi-bold |
| letterSpacing | letterSpacing100 | Default |

## Why No Existing Token Works

- `typography.bodyMd` — fontWeight400 (too light)
- `typography.buttonMd` — fontWeight500 (too light)
- `typography.labelMd` — fontWeight500 (too light)
- h3/h4/h5 use fontWeight600 but with fontFamilyDisplay (wrong family)

The gap: body font at base size with semi-bold weight. Heavier than a label, lighter than a heading, body font not display font. This is a UI chrome title, not a content heading.

## Context

This token will be used for the page title in Nav-Header-Page (the navigation bar title on pushed/presented screens). It needs to be prominent enough to read as the screen's identity but not compete with content headings (h1–h6) which use the display font family.

## Naming

Peter will work out the naming with you. Lina's suggestion: `typography.navTitle` or `typography.barTitle` — but defer to your naming conventions.

---

## Request 2: Blur/Backdrop Semantic Token

Nav-Header-Base's `appearance: 'translucent'` option needs a backdrop blur treatment. Nav-TabBar-Base already uses `backdrop-filter` on web (hard-coded). Two components needing the same blur treatment warrants a semantic token.

**Consumers**:
- Nav-Header-Base (translucent appearance)
- Nav-TabBar-Base (floating pill on web — currently hard-coded)

**Platform behavior**:
- Web: `backdrop-filter: blur(Xpx)`
- iOS: UIBlurEffect equivalent (vibrancy/material)
- Android: Typically not used (solid backgrounds conventional), but RenderEffect available

**Blocking**: Peter wants the blur token structure finalized before formal spec development for Spec 088. This is a pre-spec dependency, not a nice-to-have.

**Naming**: Defer to Ada's conventions. Possible patterns: `blur.surface`, `backdrop.blur.standard`, or a multi-property token like the typography tokens (blur radius + saturation + opacity).
