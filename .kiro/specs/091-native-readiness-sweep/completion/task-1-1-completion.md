# Task 1.1 Completion: iOS Phase 0 Grep Sweep

**Date**: 2026-04-03
**Task**: 1.1 iOS grep sweep
**Type**: Implementation
**Agent**: Kenya
**Status**: Complete

---

## What Was Done

Ran grep-based detection for 6 known iOS bug patterns across all 28 unreviewed `.ios.swift` files. Created `findings-ios.md` with cross-cutting patterns section, severity classifications, and summary table.

## Patterns Searched

| Pattern | Grep Target | Result |
|---------|------------|--------|
| `duration / 1000` (produces ~0s animation) | `/ 1000` | **0 hits** — fixed since Specs 088/090 |
| Wrong duration token path | `DesignTokens\.duration` (without `Duration.`) | **0 hits** — all use correct `DesignTokens.Duration.duration150` path |
| `.thinMaterial` without `system` prefix | `\.thinMaterial\|\.ultraThinMaterial` | **0 hits** — Nav-Header-Base already fixed to `.systemThinMaterial` |
| Duplicated `View.if` extension | `func \`if\`` | **2 files** — Container-Base, Container-Card-Base |
| `cornerRadius: .infinity` instead of token | `cornerRadius.*\.infinity` | **0 hits** — Progress-Bar-Base already fixed |
| Hard-coded easing curves | `\.easeInOut\|\.easeIn\|\.easeOut` | **11 files, 18 occurrences** |

Additional patterns discovered during sweep:
- Hard-coded `Color(red:green:blue:)` for focus color (2 files)
- Locally-defined motion constants shadowing generated tokens (2 files)
- Wrong token path via DesignTokens extension (1 file)
- System color usage needing Phase 1 preview-vs-production verification (12 files)

## Findings Summary

| Severity | Patterns | Files | Occurrences |
|----------|----------|-------|-------------|
| Blocking | 4 (P2, P3, P4, P6) | 5 | 9 |
| Non-blocking | 2 (P1, P5) | 12+ | 89 |

## Key Observation

The issue rate is lower than the ~2.5/file predicted from Spec 088. The most severe bugs found during Specs 088 and 090 reviews (`duration / 1000`, wrong `DesignTokens.duration150` path, `.thinMaterial`) have been fixed across the codebase — likely during Spec 089/090 implementation. Remaining mechanical issues are concentrated in Container-Base, Container-Card-Base, and Button-VerticalList-Item.

## Artifacts

- `findings-ios.md` — consolidated findings doc with cross-cutting patterns, per-pattern detail, and summary table

## Requirements Coverage

| Requirement | AC | Status |
|-------------|-----|--------|
| Req 1 | AC 1 — grep detection across 28 files | ✅ |
| Req 1 | AC 3 — classified as blocking/non-blocking | ✅ |
| Req 1 | AC 4 — included in consolidated findings doc | ✅ |
| Req 1 | AC 5 — pattern list established as living artifact | ✅ (6 patterns, expandable in Phase 1) |
