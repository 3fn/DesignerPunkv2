# Task 2.1 Completion: iOS Per-Component Review

**Date**: 2026-04-03
**Task**: 2.1 iOS per-component review
**Type**: Implementation
**Agent**: Kenya
**Status**: Complete

---

## Scope

- 28 unreviewed iOS implementations reviewed against contracts
- Nav-TabBar-Base sanity check (pre-dates Kenya agent)
- Spec 092 token migration verification (6 components)
- Cross-cutting pattern list updated with 2 new patterns (P7, P8) discovered during review

## Results

| Metric | Count |
|--------|-------|
| Components reviewed | 28 + 1 sanity check |
| Blocking issues | 12 |
| Components with blocking issues | 5 |
| Clean components | 23 |
| Non-blocking issues | ~90 occurrences across 12+ files |
| Spec 092 migration verified | 6/6 — zero visual change |

## Blocking Issues by Component

| Component | Issues | Patterns |
|-----------|--------|----------|
| Container-Card-Base | 5 | P7 (14 hard-coded constants), P3 (focus color), P2 (local motion), P4 (duplicated View.if), P7 (wrong shadow values) |
| Container-Base | 3 | P3 (focus color), P7 (focus offset/width), P4 (duplicated View.if) |
| Button-VerticalList-Item | 2 | P8 (12-property DesignTokens extension), P6 (wrong token path) |
| Button-VerticalList-Set | 1 | P8 (1-property DesignTokens extension) |
| Progress-Indicator-Label-Base | 1 | P7 (hard-coded font size 14 instead of token) |

## Key Observations

1. **Issue concentration in early components.** All blocking issues are in components authored early in the project. Newer components (Chips, FormInputs, Nav-SegmentedChoice, Progress family) follow correct token patterns.
2. **Lower than predicted.** 12 blocking issues vs ~20 predicted from Spec 088 rate. The worst bugs from 088/090 reviews (duration/1000, wrong Duration path) were already fixed.
3. **Container-Card-Base shadow values are wrong.** Not just hard-coded — the values don't match the generated tokens (opacity 0.1 vs 0.3, blur 8 vs 12). This means cards currently render with incorrect shadows.
4. **Nav-TabBar-Base passed sanity check.** VoiceOver traits, keyboard navigation, token references all correct.

## New Cross-Cutting Patterns Discovered

| Pattern | Description | Files |
|---------|-------------|-------|
| P7: Module-level hard-coded token constants | `let` constants duplicating token values at module scope | Container-Card-Base, Container-Base, Progress-Indicator-Label-Base |
| P8: DesignTokens extension shadowing | `extension DesignTokens` with hard-coded properties that shadow generated tokens | Button-VerticalList-Item, Button-VerticalList-Set |

## Requirements Coverage

| Requirement | AC | Status |
|-------------|-----|--------|
| Req 1 | AC 5 — pattern list updated during review | ✅ (P7, P8 added) |
| Req 2 | AC 1 — all 28 reviewed against contracts | ✅ |
| Req 2 | AC 2 — contract compliance, token-first, VoiceOver, idioms, safe area | ✅ |
| Req 2 | AC 3 — classified blocking/non-blocking | ✅ |
| Req 2 | AC 4 — documented in findings-ios.md | ✅ |
| Req 2 | AC 5 — Nav-TabBar-Base sanity check | ✅ Passed |
| Req 4 | AC 1 — Spec 092 render verification | ✅ 6/6 zero visual change |

## Artifacts

- `findings-ios.md` — consolidated findings with cross-cutting patterns, per-component findings, Spec 092 verification, and final summary
