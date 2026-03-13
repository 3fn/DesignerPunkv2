# Task 1 Summary: Easing Token Infrastructure Extension

**Spec**: 049 — Nav-SegmentedChoice-Base
**Date**: 2026-03-13
**Agent**: Ada

## What

Extended the Rosetta easing token system to support piecewise linear curves alongside cubic bezier. Defined `easingGlideDecelerate` — a 15-stop deceleration curve for the SegmentedChoice indicator glide animation.

## Why

The indicator glide animation requires a piecewise linear easing curve (aggressive deceleration with long settling tail) that can't be expressed as a single cubic bezier. Tokenizing it prevents cross-platform drift across Web, iOS, and Android.

## Key Decisions

1. **iOS: `CustomAnimation` protocol** — only approach that generates a static `Animation` constant matching the existing cubic bezier pattern. `UnitCurve` doesn't support piecewise linear. `KeyframeAnimator` is a View modifier, not a reusable value.
2. **Duration coupled to struct** — piecewise linear curves are time-scale dependent. The 15-stop curve is designed for 350ms; stretching it would distort the motion character.
3. **`EASING` category** — replaced the `SPACING` workaround that existed since the original easing tokens were created.
4. **Material Design references removed** — per Peter's direction, the motion steering doc now stands on DesignerPunk's own identity.

## Platform Output

- **Web**: `--easing-glide-decelerate: linear(0, 0.012 0.9%, ...);`
- **iOS**: `Animation(PiecewiseLinearEasing(stops: [...], duration: 0.35))`
- **Android**: `PiecewiseLinearEasing(listOf(0f to 0f, ...))`

## Test Impact

295 suites, 7485 tests (+5), 0 failures.
