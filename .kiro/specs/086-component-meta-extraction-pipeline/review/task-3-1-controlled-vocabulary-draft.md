# Task 3.1: Controlled Vocabulary — Finalized

**Date**: 2026-03-28
**Author**: Lina
**Reviewer**: Leonardo
**Spec**: 086 — Component Discoverability & Metadata Infrastructure
**Status**: ✅ Finalized — published to authoring guide

---

## Summary

Defined 14 canonical context values for `component-meta.yaml` files. Initial draft proposed 18 values. Leonardo's review recommended cutting to 14, dropping `cards` (family name as context), `toolbars` (too vague), `view-switching` (purpose not context), and `progress-indicators` (family name). Peter approved.

Design doc Decision 3 specified 15 as the initial target. Final count is 14 — below target, not above. Expansion path: ballot measure process.

---

## Final Vocabulary (14 values)

| Context Value | Consumer Search Terms |
|--------------|----------------------|
| `forms` | form fields, data collection, input groups, registration, login, checkout |
| `dashboards` | stat cards, summary statistics, overview page, home screen metrics |
| `settings-screens` | preferences, options, configuration, account settings |
| `navigation-tabs` | tab bar, bottom navigation, primary navigation, navigation bar |
| `content-feeds` | news feed, activity stream, scrollable list, content list |
| `onboarding-flows` | welcome screens, setup wizard, first-run experience, tutorial |
| `filter-bars` | filter chips, content filtering, search refinement |
| `list-items` | row items, cell content, list entries, menu items |
| `icon-overlays` | badge on icon, notification dot, status indicator, notification bell |
| `profile-sections` | user info, account details, avatar display, user profiles |
| `product-cards` | product card, catalog items, shopping grid, content preview |
| `app-bars` | top bar, header, navigation bar, app shell |
| `modals` | dialog, popup, overlay, sheet, bottom sheet |
| `empty-states` | no data, zero state, first-time experience, placeholder content |

---

## Published To

1. `docs/component-meta-authoring-guide.md` — Controlled Vocabulary section + updated contexts field guidance + fixed examples
2. This completion doc

---

## Review Trail

- Draft: `review/task-3-1-controlled-vocabulary-draft.md`
- Leonardo review: `review/task-3-1-leonardo-review.md`
