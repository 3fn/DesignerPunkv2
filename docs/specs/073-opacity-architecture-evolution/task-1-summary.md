# Task 1 Summary: Token Architecture Foundation

**Spec**: 073 — Opacity Architecture Evolution
**Date**: 2026-03-06
**Status**: Complete

## What Was Delivered

Foundational infrastructure for composed tokens in the DesignerPunk Rosetta system:

- **Modifier architecture**: `SemanticToken.modifiers` enables "color at opacity" composition (e.g., black at 80% opacity) while maintaining primitive→semantic traceability
- **Mode-invariance field**: `SemanticToken.modeInvariant` programmatically marks tokens that don't change between light/dark modes, with validator enforcement
- **Opacity primitive rename**: 14 tokens renamed from ordinal (opacity000–opacity1300) to percentage-based (opacity000–opacity100) — names now directly communicate their value
- **Scrim semantic token**: `color.scrim.standard` (black500 @ opacity080) — first modifier-based token, resolves to `rgba(0, 0, 0, 0.80)` on web, platform-native equivalents on iOS/Android
- **Validator updates**: Modifier reference validation and mode-invariance consistency checking
- **Generator updates**: All 4 generators (Web, iOS, Android, DTCG) resolve modifier-based tokens to platform-native output
- **Governance**: Modifier extensibility gate added to Token-Governance.md

## Metrics

- 10 subtasks completed
- 22 new tests added
- 291 test suites / 7457 tests — all passing
- 18 source files modified, 1 new file created
- 4 steering doc ballot measures applied

## Unblocks

- **Spec 072** (Pagination Container Styling) can now consume `color.scrim.standard` for the dark translucent pill background
