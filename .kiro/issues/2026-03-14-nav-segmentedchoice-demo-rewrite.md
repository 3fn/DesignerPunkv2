# Nav-SegmentedChoice Demo Rewrite Needed

**Date**: 2026-03-14
**Discovered by**: Thurgood (Peter's request)
**Domain**: Lina (component demos)
**Severity**: Medium
**Status**: Resolved (Lina completed — commit `88fbc036`)

---

## Issue

The Nav-SegmentedChoice demo (`demos/nav-segmented-choice-demo.html`) is a placeholder stub — no live component, no interactive controls, no styling consistent with other demos.

## Already Fixed (Thurgood)

- ✅ Component added to `src/browser-entry.ts` (import, safeDefine, export, alias)
- ✅ Browser bundle rebuilt — `nav-segmented-choice` custom element now available in `designerpunk.esm.js`
- ✅ `demos/index.html` — moved from "Progress" category to new "Navigation" section
- ✅ `component-registration.test.ts` — export assertion updated

## Remaining (Lina)

Rewrite `demos/nav-segmented-choice-demo.html` to match the established demo pattern. Reference `demos/chip-demo.html` as the style model.

### Required elements:
- `class="demo-page"` on `<body>`
- `← All Components` back link in header
- `class="demo-subtitle"` on description
- `demo-section` / `demo-note` / `demo-interactive` / `demo-item` structure
- Live `<nav-segmented-choice>` elements demonstrating:
  - Basic 2-segment and 3-segment usage
  - Keyboard navigation (arrow keys, Home/End)
  - Selection change event logging
  - Disabled state (if supported)
- Event log panel showing `segmentchange` events
