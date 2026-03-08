# Task 3.12 Completion: Remove calculateVisibleWindow from types.ts

**Date**: 2026-03-08
**Spec**: 074 — Pagination Animation
**Task**: 3.12 — Remove `calculateVisibleWindow` from types.ts
**Agent**: Lina
**Type**: Implementation
**Validation Tier**: Tier 2 — Standard

---

## Summary

Removed `calculateVisibleWindow()` and `PAGINATION_VISIBLE_WINDOW` from the shared types, index, and tests. No platform calls these anymore — all three use render-all-dots with native scroll centering.

---

## Changes

| File | Change |
|------|--------|
| `types.ts` | Removed `PAGINATION_VISIBLE_WINDOW` constant and `calculateVisibleWindow()` function |
| `index.ts` | Removed re-exports; updated doc comment ("Viewport clipping" not "Virtualization") |
| `PaginationBase.test.ts` | Removed imports and entire `calculateVisibleWindow` describe block (9 tests) |
| `ProgressPlatformParity.test.ts` | Removed stale comment referencing "removed in 3.12" |

---

## Verification

- Full suite: 291 suites, 7448 tests, 0 failures ✅ (9 fewer tests — removed windowed logic tests)
- Build: successful, 1.52 MB raw ✅
