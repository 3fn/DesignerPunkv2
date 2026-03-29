# Task 3 Summary: Extraction Pipeline

**Date**: 2026-03-28
**Spec**: 086 - Component Discoverability & Metadata Infrastructure
**Task**: 3. Extraction Pipeline

---

## What Changed

Component metadata (`component-meta.yaml`) is now partially generated from Component-Family steering docs via a build-time extraction script. A controlled vocabulary governs the `contexts` field.

## Key Deliverables

1. **Controlled vocabulary** — 14 canonical context values with consumer search terms, published in authoring guide
2. **Structured metadata blocks** — `### [Component] — Metadata` blocks added to all 9 family docs (30 components)
3. **Extraction script** — `npm run extract:meta` generates component-meta.yaml from family docs
4. **Benchmark validation** — All 8 discoverability benchmark queries passing

## Extraction Model: Partial Single Source

The spec originally targeted full single-source extraction for all fields. The quality gate revealed that derived `usage` and `alternatives` were worse than hand-authored for half the components. Approved approach:

- **Purpose + contexts**: Always extracted from family docs (single source, drift eliminated by construction)
- **Usage + alternatives**: Derived when possible, hand-authored content preserved when richer

Root causes documented in Req 3 AC 3 implementation note for future reference.

## Impact

- `find_components({ purpose: ... })` queries now return accurate results for all 8 benchmark scenarios
- `find_components({ context: "dashboards" })` returns 7 components (up from baseline gap)
- Purpose and contexts can no longer drift from family docs — changes to family docs propagate via extraction
- Controlled vocabulary prevents ad-hoc context tagging
