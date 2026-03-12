# Lina Review: Panel ID Strategy

**Date**: 2026-03-12
**Spec**: 049 — Nav-SegmentedChoice-Base
**Author**: Lina
**Type**: Design feedback

---

## Issue

The design outline says the component generates deterministic `aria-controls` values from segment values (e.g., `[testID]-panel-monthly`). But `testID` is optional and intended for testing — it's doing double duty as the accessibility wiring anchor.

## Problem

If a developer doesn't set `testID`, the `aria-controls` attribute has no prefix. The generated panel IDs become unpredictable or collide across multiple SegmentedChoice instances on the same page.

Options:
1. **Make `testID` required** — breaks the "optional test convenience" pattern used across all other Stemma components
2. **Add a separate `id` prop** — explicit, standard HTML pattern. `aria-controls` uses `id` as prefix. `testID` stays optional and test-only
3. **Auto-generate a stable ID** — e.g., `useId()` (React) or a counter-based fallback. No developer input needed, but IDs aren't deterministic across renders (SSR concern)
4. **Drop `aria-controls` generation entirely** — developer wires their own panel IDs. Simpler component, more work for consumers

## Recommendation

Option 2: add an `id` prop. It's the most honest — `testID` is for tests, `id` is for DOM identity. The component uses `id` for `aria-controls` generation. If `id` is omitted, `aria-controls` is simply not rendered (developer takes responsibility for panel wiring).

This keeps `testID` clean, avoids auto-generation complexity, and gives developers a clear opt-in for the convenience feature.

## Counter-argument

Option 2 adds a prop to the API. If most consumers don't use panel association (e.g., they handle it themselves), the prop is noise. Option 4 (drop it) would be simpler. But the DX benefit of easy panel wiring seems worth one prop.

## Decision needed

Peter to decide which option.
