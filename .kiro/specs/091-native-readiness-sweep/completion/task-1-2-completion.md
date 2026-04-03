# Task 1.2 Completion: Android Phase 0 Grep Sweep

**Date**: 2026-04-03
**Task**: 1.2 Android grep sweep
**Type**: Implementation
**Agent**: Data
**Status**: Complete

---

## What Was Done

Ran grep-based detection for 6 known Android bug patterns across all 28 unreviewed `.android.kt` files. Created `findings-android.md` with cross-cutting patterns section, severity classifications, and summary table.

## Patterns Searched

| Pattern | Grep Target | Result |
|---------|------------|--------|
| Hard-coded non-zero `.dp` values | `[1-9]\d*\.dp` | **0 hits** — all dimensional values use tokens |
| `.dp` on already-Dp token values | `DesignTokens\.\w+\.dp` | **2 files** — Button-VerticalList-Set, Nav-Header-Base |
| Hard-coded `Color(0x` | `Color\(0x` | **1 file** — Container-Base (accessibility focus color) |
| Material `Divider` usage | `Divider\(` | **2 files** — Button-Icon (5, previews), Nav-TabBar-Base (1, component) |
| `tween()` without explicit easing | `tween(` cross-ref with `easing =` | **4 files, 7 calls** — Input-Radio-Base, Input-Checkbox-Base, Progress-Bar-Base, Nav-Header-Page |
| Hard-coded `RoundedCornerShape` | `RoundedCornerShape\(\d+` | **3 files** — Chip-Base, Chip-Filter, Chip-Input |

Additional checks with no issues found:
- `MutableInteractionSource()` without `remember`: **0 hits** (13/13 properly wrapped)
- Hard-coded `Color.argb`: **0 hits** outside generated token files
- View-system patterns in Compose code: **0 hits**
- Hard-coded font sizes: **0 hits**

## Findings Summary

| Severity | Patterns | Files | Occurrences |
|----------|----------|-------|-------------|
| Blocking | 3 (`.dp` on Dp, hard-coded color, hard-coded shape) | 5* | 6 |
| Non-blocking | 2 (missing easing, Material Divider) | 5* | 13 |

\* Some files appear in both categories.

## Key Observation

Issue rate is lower than the ~2.5/file predicted from Spec 088. The Chip family has a consistent pattern (hard-coded `RoundedCornerShape(50)` across all 3 components) — a good candidate for Lina's batch-fix approach. The Container-Base hard-coded color is notable: the comment says "purple300" but the accessibility focus token is cyan300, suggesting both a token-first violation and a potential wrong-color bug.

Recomposition safety checks were clean — all `MutableInteractionSource` calls properly remembered. This was a concern I raised in requirements feedback; the mechanical evidence is reassuring, though per-component review in Phase 1 will check for subtler recomposition issues.

## Artifacts

- `findings-android.md` — consolidated findings doc with cross-cutting patterns, per-pattern detail, and summary table (Phase 1 per-component section pending)

## Requirements Coverage

| Requirement | AC | Status |
|-------------|-----|--------|
| Req 1 | AC 2 — grep detection across 28 files | ✅ |
| Req 1 | AC 3 — classified as blocking/non-blocking | ✅ |
| Req 1 | AC 4 — included in consolidated findings doc | ✅ |
| Req 1 | AC 5 — pattern list established as living artifact | ✅ (6 patterns, expandable in Phase 1) |
