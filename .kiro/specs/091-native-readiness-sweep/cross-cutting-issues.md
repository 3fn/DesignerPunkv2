# Spec 091: Cross-Cutting Issues Tracker

**Date**: 2026-04-03
**Purpose**: Track issues discovered during the native readiness sweep that span multiple specs or require other agents' action
**Updated by**: Lina

---

## Contract Catalog Updates (Thurgood)

New contract concepts introduced during component work that need ballot measure addition to the Contract System Reference.

| Source | Concepts | Count | Status |
|--------|----------|-------|--------|
| Spec 088 Nav-Header-Base (Task 1.1b) | `focus_order`, `safe_area`, `three_regions`, `separator`, `translucent` | 5 | ✅ Added (131 concepts) |
| Spec 088 Nav-Header-Page (Task 2.1) | `heading`, `back_navigation`, `close_positioning`, `title_alignment`, `action_styling`, `platform_height`, `collapsible_scroll`, `badge_threshold` | 8 | ✅ Added (131 concepts — some may overlap) |
| Spec 088 Nav-Header-App (Task 3.1) | `no_heading` | 1 | ✅ Added (131 concepts) |
| Spec 090 Progress-Bar-Base (Task 1.2) | `milestone_announcements`, `track_fill`, `value_transition`, `indeterminate_pulse`, `value_range` | 5 | ✅ Added (136 concepts) — resolved in Task 4.2 |

**Issue file**: `.kiro/issues/2026-04-03-progress-bar-contract-catalog-update.md`

---

## Non-Blocking Tech Debt (Discovered During Reviews)

Issues found by Kenya/Data during production-quality reviews that are not blocking but should be tracked.

### Systemic: P1 Easing Pattern (iOS)
Hard-coded `.easeInOut`/`.easeIn`/`.easeOut` instead of token easing across 9+ components. Duration is token-driven, easing is SwiftUI built-in. Visual difference is subtle. Would require a different SwiftUI API pattern to fix (`DesignTokens.Easing.easingStandard.speed(1.0 / duration)`).

### Button-CTA Android
- Data C1: `.toInt()` round-trip on Dp tokens in size config
- Data C2: Hard-coded `minWidth` values (56, 72, 80)
- Data C3: Hard-coded `touchTargetHeight = 48` for medium/large
- Data C4: Inline typography construction instead of semantic token composites

### Button-Icon Android
- Data C5: Material ripple vs blend utility inconsistency with Button-CTA
- ~~Data C6: `border_border_default` double-naming in generated tokens~~ **Resolved — component-level naming, not generation bug. Fixed in Button-CTA, Button-Icon, VisualStateStyles.**

### Button-VerticalList-Item
- Kenya C2: `.easeInOut` instead of token easing (P1)
- Kenya C3: Hard-coded press overlay instead of blend utility
- Data C8: `tween()` without explicit easing
- Data C9: `LocalDesignTokens.current` pattern outlier

### Container-Base
- Kenya C4 / Data C2: File size (~670-760 lines) — mapping functions could be extracted
- Data C3: `Log.w` instead of `require()` for conflicting props

### Container-Card-Base Android
- Data F2/C5: `CardRole.Link → Role.Button` (Compose lacks Role.Link — documented with TODO)
- Data C6: Duplicated padding calculation
- Data C8: `indication = null` disables ripple with no fallback

### Avatar-Base iOS
- ~~Kenya: `borderWidthDefault: CGFloat = 1` should reference `DesignTokens.borderWidth100`~~ **Resolved in Task 3.7**

---

## Deferred (Not Fixing in This Spec)

These are architectural patterns or design decisions, not per-component bugs:

- **P1 Easing (iOS systemic)**: 9+ files use SwiftUI built-in easing. Requires API pattern change across the codebase. Visual difference is subtle. Track as future modernization.
- **Button-CTA Android C1-C4**: Config uses `Int` types with `.toInt()` round-trips and hard-coded values. Fixing touch targets alone without fixing the config type system would be inconsistent. Track as Button-CTA modernization.
- **Button-Icon Android C5**: Ripple vs blend inconsistency — design decision, not a bug.
- **Button-Icon Android C6**: `border_border_default` double-naming — generated token naming, Ada's domain.
- **Button-VerticalList-Item C2/C3/C8/C9**: Easing (P1), press overlay, `LocalDesignTokens` pattern — systemic patterns, not per-component fixes.
- **Container-Base file size**: Architectural — extract mapping functions in a future modernization pass.
- **Container-Card-Base C6/C8**: Duplicated padding calc and no ripple fallback — architectural, not blocking.

---

## Resolved Issues

| Issue | Resolution | Date |
|-------|-----------|------|
| iOS duration token paths (`DesignTokens.duration150` → `DesignTokens.Duration.duration150`) | Fixed across 5 components (Nav-Header-Page, Nav-TabBar-Base, Chip-Base, Chip-Filter, Chip-Input) | 2026-04-03 |
| Container-Base String? → typed values refactor | Completed — resolvers deleted, Card-Base passes Color/struct directly | 2026-04-03 |
| VerticalList-Item placeholder IconBase | Removed, real import added | 2026-04-03 |
| VerticalList-Set `error()` crash in semantics | Fixed — uses stateDescription + liveRegion | 2026-04-03 |
| Avatar-Base iOS border width hard-coded | Fixed — references DesignTokens.borderWidth100/200 | 2026-04-03 |
| Container-Base Android `Log.w` for conflicting props | Fixed — uses `require()` (fail-loudly) | 2026-04-03 |
| Button `border_border_default` naming | Fixed — replaced with `border_default`/`border_emphasis`, extensions removed | 2026-04-03 |
