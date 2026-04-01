# Gap Report Resolution Tracker

**Date**: 2026-03-28
**Source**: `docs/specs/083-application-mcp-guidance-completeness/gap-report.md`
**Purpose**: Track how each gap report item is being addressed — directly, holistically, or differently than originally prescribed

---

## Component Gaps

| # | Gap | Original Downstream | Resolution Approach | Resolution Vehicle | Status |
|---|-----|--------------------|--------------------|-------------------|--------|
| 0 | Top bar (nav bar / app bar) | Lina (component spec) | Direct — new component spec | Spec 088 (complete) | Complete |
| 1 | Content list item | Lina (component spec) | Direct — new component spec | TBD (new spec) | Not started |
| 2 | Linear progress bar | Lina (component spec) | Direct — new component spec | TBD (new spec) | Not started |
| 3 | Container-Card-Base readiness | Lina (readiness) | Holistic — composition refactor (Spec 085) + two-part readiness model (Spec 086) | Spec 085 (complete), Spec 086 (complete) | Complete |

---

## Pattern Gaps

| # | Gap | Original Downstream | Resolution Approach | Resolution Vehicle | Status |
|---|-----|--------------------|--------------------|-------------------|--------|
| 4 | Multi-section form | Spec 069 | Reframed — experience pattern, not layout template. May route to Product MCP | Spec 086 synthesis (MCP split decision) | Reframed |
| 5 | View/edit mode screen | — (product-specific) | No action — principle captured in design exercises | — | Closed (product-specific) |
| 6 | Mixed-content feed | — (product-specific) | No action | — | Closed (product-specific) |
| 7 | Filter bar + scrollable content | Spec 069 | Reframed — experience pattern / chip layout guidance, not layout template | Spec 086 synthesis (MCP split decision) | Reframed |
| 8 | Multi-badge card composition | — (product-specific) | No action | — | Closed (product-specific) |
| 9 | Notification list | — (product-specific) | Dependent on #1 (content list item). If component exists, notification list is product-specific arrangement | Blocked on #1 | Dependent |
| 10 | Platform-adaptive container | — (product-specific) | No action | — | Closed (product-specific) |
| 11 | Dashboard layout | — (product-specific) | Product primitive candidate (Spec 081). Design principle preserved in exercises. | Spec 081 (future) | Deferred |
| 12 | Stat card | — (product-specific) | No action | — | Closed (product-specific) |
| 13 | Empty state | Spec 069 | Reframed — experience pattern, not layout template. May route to Product MCP | Spec 086 synthesis (MCP split decision) | Reframed |
| 14 | Content preview section | — (product-specific) | No action | — | Closed (product-specific) |
| 15 | Conditional field visibility | — (product-specific) | No action — parent orchestration logic | — | Closed (product-specific) |

---

## Search/Discovery Gaps

| # | Gap | Original Downstream | Resolution Approach | Resolution Vehicle | Status |
|---|-----|--------------------|--------------------|-------------------|--------|
| 16 | Purpose search misses | Lina (meta enrichment) | Holistic — purpose rewrite with consumer search terms + extraction from family docs | Spec 086 (complete) | Complete |
| 17 | Context/purpose cross-ref | Lina (content fix) | Holistic — controlled vocabulary (14 values) + extraction pipeline | Spec 086 (complete) | Complete |
| 18 | Dashboard context underserved | Lina (meta enrichment) | Holistic — controlled vocabulary + context enrichment. `find_components({ context: "dashboards" })` returns 7 components | Spec 086 (complete) | Complete |
| 19 | Pattern names error | Task 2.3 (resolved) | Direct — already resolved | Spec 083 Task 2.3 | Complete |

---

## Summary

| Status | Count |
|--------|-------|
| Complete | 6 (#0, #3, #16, #17, #18, #19) |
| Reframed | 3 (#4, #7, #13) |
| Not started | 2 (#1, #2) |
| Dependent | 1 (#9) |
| Deferred | 1 (#11) |
| Closed (product-specific) | 7 (#5, #6, #8, #10, #12, #14, #15) |

---

## Notes

- Items #4, #7, #13 were originally routed to Spec 069 (layout templates). The Spec 086 research synthesis reframed these as experience pattern concerns, not layout concerns. If the MCP scope split (P3) is validated, these may route to Product MCP pattern creation.
- Item #3 was partially addressed by Spec 085 (composition refactor). The remaining readiness concern is addressed by the two-part readiness model in the Spec 086 synthesis.
- Items #0, #1, #2 are new component specs that are independent of Spec 086's discoverability work.
