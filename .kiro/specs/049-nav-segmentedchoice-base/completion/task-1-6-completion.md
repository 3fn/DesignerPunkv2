# Task 1.6 Completion: Steering Documentation Updates

**Date**: 2026-03-13
**Spec**: 049 — Nav-SegmentedChoice-Base
**Task**: 1.6 — Steering documentation updates
**Type**: Setup
**Agent**: Ada

---

## What Was Done

Updated Token-Family-Motion.md via approved ballot measure. Removed all Material Design references per Peter's direction.

### Changes to Token-Family-Motion.md

| Section | Change |
|---------|--------|
| Easing Tokens | Added `easingGlideDecelerate` to table. Added "Piecewise Linear Easing" subsection. Added platform output for linear type. Removed Material Design references. |
| When to Use Each Easing | Added `easingGlideDecelerate` guidance with paired duration note. |
| Material Design Easing Curves | Renamed to "Easing Curve Foundations". Removed Material Design references. Added linear easing entry. |
| Duration Design Philosophy | Removed Material Design comparison language ("Faster than Material Design's 200ms"). Replaced with standalone descriptions. |

### Material Design References Removed (4 total)
1. "using Material Design cubic-bezier definitions" → "cubic-bezier curve definitions"
2. "Material Design cubic-bezier curves for natural motion feel" → "Cubic-bezier curves for natural, physics-based motion feel"
3. "Faster than Material Design's 200ms" → "Fast, responsive micro-interactions"
4. "Slower than Material Design's 300ms" → "Deliberate, weighted animations"

### Housekeeping Note (Flagged)
Figma effect style `shadow.nav.segmented` should be renamed to `shadow.navigation.indicator` — Figma-side update, not codebase.

## Ballot Measure
- Proposed: 2026-03-13
- Peter feedback: Remove Material Design references
- Approved with revision: 2026-03-13
