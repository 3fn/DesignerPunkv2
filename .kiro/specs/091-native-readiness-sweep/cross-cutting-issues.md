# Spec 091: Cross-Cutting Issues Tracker

**Date**: 2026-04-03
**Last Updated**: 2026-04-03
**Purpose**: Track issues discovered during the native readiness sweep
**Status**: All blocking issues resolved. Non-blocking tech debt documented for future work.

---

## Contract Catalog Updates — ✅ All Resolved

| Source | Concepts | Count | Status |
|--------|----------|-------|--------|
| Spec 088 Nav-Header-Base | `focus_order`, `safe_area`, `three_regions`, `separator`, `translucent` | 5 | ✅ |
| Spec 088 Nav-Header-Page | `heading`, `back_navigation`, `close_positioning`, `title_alignment`, `action_styling`, `platform_height`, `collapsible_scroll`, `badge_threshold` | 8 | ✅ |
| Spec 088 Nav-Header-App | `no_heading` | 1 | ✅ |
| Spec 090 Progress-Bar-Base | `milestone_announcements`, `track_fill`, `value_transition`, `indeterminate_pulse`, `value_range` | 5 | ✅ |

Catalog: 136 concepts. All tests passing (237/237).

---

## Non-Blocking Tech Debt (Future Work)

These are architectural patterns or design decisions discovered during reviews. None are blocking. Tracked for future modernization.

### Systemic: P1 Easing Pattern (iOS)
Hard-coded `.easeInOut`/`.easeIn`/`.easeOut` instead of token easing across 9+ components. Requires API pattern change (`DesignTokens.Easing.easingStandard.speed(1.0 / duration)`). Visual difference is subtle.

### Button-CTA Android
- Config uses `Int` types with `.toInt()` round-trips on Dp tokens
- Hard-coded `minWidth` values (56, 72, 80)
- Hard-coded `touchTargetHeight = 48` for medium/large
- Inline typography construction instead of semantic token composites

### Button-Icon Android
- Material ripple vs blend utility inconsistency with Button-CTA (design decision)

### Button-VerticalList-Item
- `.easeInOut` instead of token easing (P1 systemic)
- Hard-coded press overlay `Color.black.opacity(0.1)` instead of blend utility
- `tween()` without explicit easing
- `LocalDesignTokens.current` pattern outlier

### Container-Base
- File size (~670-760 lines) — mapping functions could be extracted

### Container-Card-Base Android
- `CardRole.Link → Role.Button` (Compose lacks Role.Link — documented with TODO)
- Duplicated padding calculation
- `indication = null` disables ripple with no fallback

### Progress-Indicator-Node-Base Android
- Material `Icons.Filled.Check` instead of `IconBase("check")` for checkmark
- `.dp` on Dp token pattern (needs verification)
- Non-standard motion token import path

### Input-Text-Base Android
- ~~`TRANSITION_ANIMATION_SCALE` vs `ANIMATOR_DURATION_SCALE` inconsistency~~ **Resolved — fixed across 4 files (Input-Text-Base, Nav-SegmentedChoice-Base, Progress-Node-Base, Progress-Pagination-Base).**

### Input-Checkbox-Base / Input-Radio-Base Android
- Missing explicit easing on tween animations
- Missing reduced motion check (animations are subtle)

### Badge-Count-Base Android
- ~~`color_surface` token name — verify semantic fit~~ **Resolved — was referencing non-existent token. Fixed to `color_structure_surface`.**

### Badge-Label-Base Android
- ~~`maxWidth` hard-coded locally instead of referencing ComponentTokens~~ **Resolved — now references `BadgeLabelBaseTokens.maxWidth`.**

### Nav-SegmentedChoice-Base Android
- ~~`iconSize` returns Int instead of Dp token reference~~ **Resolved — now references `DesignTokens.icon_size_125/100`.**

---

## Resolved Issues (7)

| Issue | Resolution | Date |
|-------|-----------|------|
| iOS duration token paths | Fixed across 5 components: `DesignTokens.Duration.duration150` | 2026-04-03 |
| Container-Base String? → typed values | Stemma-compliant refactor — resolvers deleted | 2026-04-03 |
| VerticalList-Item placeholder IconBase | Removed, real import added | 2026-04-03 |
| VerticalList-Set `error()` crash | Fixed — stateDescription + liveRegion | 2026-04-03 |
| Avatar-Base iOS border width | Fixed — DesignTokens.borderWidth100/200 | 2026-04-03 |
| Container-Base Android `Log.w` | Fixed — `require()` (fail-loudly) | 2026-04-03 |
| Button `border_border_default` naming | Fixed — border_default/emphasis, extensions removed | 2026-04-03 |
| Badge-Count-Base `color_surface` | Fixed — `color_structure_surface` (was non-existent token) | 2026-04-03 |
| Badge-Label-Base `maxWidth` local | Fixed — references `BadgeLabelBaseTokens.maxWidth` | 2026-04-03 |
| Nav-SegmentedChoice `iconSize` Int | Fixed — `DesignTokens.icon_size_125/100` | 2026-04-03 |
| `TRANSITION_ANIMATION_SCALE` inconsistency | Fixed across 4 files → `ANIMATOR_DURATION_SCALE` | 2026-04-03 |
