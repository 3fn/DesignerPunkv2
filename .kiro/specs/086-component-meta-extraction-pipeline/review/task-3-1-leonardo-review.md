# Task 3.1: Controlled Vocabulary — Leonardo Review

**Date**: 2026-03-28
**Reviewer**: Leonardo
**Draft Reviewed**: `review/task-3-1-controlled-vocabulary-draft.md`
**Spec**: 086 — Component Discoverability & Metadata Infrastructure
**Verdict**: Approve with modifications

---

## Recommendation: Cut from 18 to 14 Values

The vocabulary should be small enough to predict without lookup, large enough to provide meaningful signal. 14 values hit that balance. The 4 cut values are either too narrow (better served by purpose search), too overlapping (absorbed by other values), or restate a family name as a context.

The design doc (Decision 3) specified 15 as the initial target. This review recommends 14 — below that number, not above. Noted for requirements traceability.

**Counter-argument to this recommendation**: Cutting to 14 optimizes for how I search today with a 30-component catalog. As the catalog grows, coarser values like `cards` might become necessary. Lina may be right that 18 is more future-proof. However, Peter and I discussed the expansion path — the extraction script's vocabulary validation, Lina's authoring workflow, my lessons learned protocol, and Stacy's metadata accuracy lens collectively cover both new-component and drift scenarios. The ballot measure process provides a governed path to add values when needed. Ship tight, expand later.

---

## Values to Keep (14)

| # | Value | Notes |
|---|-------|-------|
| 1 | `forms` | Core. Constant query target. |
| 2 | `dashboards` | Core. Already returns 7 components today. |
| 3 | `settings-screens` | Core. Direct match to experience pattern. |
| 4 | `navigation-tabs` | Clear, predictable. |
| 5 | `content-feeds` | Maps to notification-list and content-preview patterns. |
| 6 | `onboarding-flows` | Maps to onboarding pattern. |
| 7 | `filter-bars` | Narrow but high-signal — exactly how I'd search for Chip-Filter. |
| 8 | `list-items` | Used when building any list-based screen. |
| 9 | `icon-overlays` | Specific enough to be predictable, covers a real composition pattern. |
| 10 | `profile-sections` | Maps to view-edit-screen pattern. |
| 11 | `product-cards` | Distinct from `dashboards` — shopping/catalog context. |
| 12 | `app-bars` | Standard mobile/web pattern. |
| 13 | `modals` | Forward-looking but worth it. Button-CTA, Button-Icon, Container-Base all appear in modals today. Absorbs dialog/sheet orphans from cut values. |
| 14 | `empty-states` | Maps to empty-state experience pattern. Predictable query target. |

---

## Values to Cut (4)

| Value | Reason |
|-------|--------|
| `cards` | Overlaps with `dashboards`, `product-cards`, and `content-feeds`. The generic value doesn't add signal — I think in terms of *what kind* of card, not "cards" generically. It's the family name restated as a context. |
| `toolbars` | Too vague. In my research I searched for "action" as a purpose term, not "toolbar" as a context. Toolbar components (Button-Icon, Chip-Filter) are better discovered through parent contexts (`app-bars`, `filter-bars`) or purpose search. |
| `view-switching` | Too narrow — only Nav-SegmentedChoice-Base and maybe Chip-Filter. I'd search `purpose: "switch"` or `purpose: "toggle"`, not a context query. This is a purpose, not a context. |
| `progress-indicators` | Family name, not a UI context. I'd never query `context: "progress-indicators"` — I'd use `purpose: "progress"` or `get_prop_guidance("Progress Indicators")`. The Progress family is discoverable by purpose; it doesn't need a context value. |

---

## Mapping Adjustments for Cut Values

| Orphaned Existing Values | From Cut Value | Remap To | Rationale |
|--------------------------|---------------|----------|-----------|
| `dialog-content`, `dialog-headers`, `bottom-sheets` | `cards` | `modals` | Dialogs and bottom sheets are modal surfaces. |
| `dialog-actions` | `toolbars` | `modals` | Actions within a dialog are part of the modal context. |
| `view-switching` | `view-switching` | Drop | Only 1 existing value; components are discoverable via purpose. |
| `carousels` | `progress-indicators` | Unmapped | Product screen pattern we don't have components for. Gets a home when/if we build carousel support. |
| `toolbars`, `inline-actions`, `card-actions`, `page-actions` | `toolbars` | `app-bars` (for `toolbars`), context-specific for others | `card-actions` → components tagged with `dashboards` or `product-cards` already. `page-actions` → components tagged with `forms` (form footers) or `app-bars`. `inline-actions` → purpose search territory. |

---

## Components Expected — Corrections

| Context Value | Lina's Draft | Add |
|---------------|-------------|-----|
| `forms` | Input-Text-*, Input-Checkbox-*, Input-Radio-*, Button-CTA | Input-Text-Email, Input-Text-Password, Input-Text-PhoneNumber, Input-Checkbox-Legal, Input-Radio-Set (semantic variants, not just families) |
| `modals` | Button-CTA, Button-Icon, Container-Base | Correct as-is. Expands naturally when modal/sheet components are built. |
| `settings-screens` | Button-VerticalList-Set, Input-Checkbox-Base, Container-Base | Input-Radio-Set (settings often have mutually exclusive option groups) |

---

## Coverage Verification

Tested against all 5 research tasks:

| Research Task | Contexts Used | Gaps? |
|---------------|--------------|-------|
| Notification screen | `content-feeds`, `icon-overlays`, `list-items`, `app-bars` | None |
| Onboarding progress | `onboarding-flows` | None (progress found via purpose) |
| Dashboard with stat cards | `dashboards`, `product-cards` | None |
| Filter bar on content feed | `filter-bars`, `content-feeds` | None |
| Settings with grouped sections | `settings-screens`, `forms` | None |

---

## Live Query Validation

Ran `find_components` against current MCP to verify existing context behavior:

- `context: "dashboards"` → 7 results ✅
- `context: "forms"` → 4 results (Input-Checkbox-Base, Input-Radio-Base, Input-Radio-Set, Input-Text-Base) ✅
- `context: "cards"` → 0 results (value doesn't exist yet — confirms cutting it loses nothing today)
- `context: "modals"` → 0 results (forward-looking value — will gain components as dialog values are remapped)
