# Release 10.2.0

**Date**: 2026-04-03
**Previous**: 10.1.0
**Bump**: minor

---

## Highlights

### New Component: Progress-Bar-Base (Spec 090)
The ProgressIndicator family's first continuous/percentage-based component:
- Determinate, indeterminate, and indeterminate-static fill modes
- True Native implementations across Web, iOS, and Android
- Behavioral contracts covering accessibility (progressbar role, aria-valuenow/min/max), reduced motion, and RTL
- Family documentation updated with bar vs discrete selection rules
- Gap report #2 resolved (7 of 20 gaps now complete)

### Sizing Token Family (Spec 092)
New primitive token family for component dimensions, separating "how big is this thing" from "how much space around it":
- 13 tokens: `size050` (4) through `size1600` (128), base 8
- Aligns with spacing scale values — same numbers, distinct semantic purpose
- Integrated into DTCG, Figma, and all platform generation outputs (CSS, Swift, Kotlin)
- `size900` (72) added for Button-CTA large variant
- 6 component families migrated internally from spacing→sizing references (zero visual change)
- 3 new component token files: Avatar-Base, Input-Checkbox-Base, Input-Radio-Base
- Steering doc: `Token-Family-Sizing.md`

### Native Readiness Sweep (Spec 091)
Comprehensive iOS and Android review across all component families:
- 28 previously-unreviewed components now `reviewed: true` on both platforms
- Fixes across 10 families: Container, Button, Icon, Chip, Badge, FormInput, Avatar, Navigation, ProgressIndicator, Progress-Label
- Key fixes: `Void` → `Unit` (Android), `RoundedCornerShape` → `radius_full` token refs, border width → token refs, `.dp` on Dp tokens, `String?` → typed values (iOS Container-Base)
- `border_border_` naming resolved → `border_default`/`border_emphasis`
- Shared iOS utility consolidation (`View.if` single location)
- Readiness model (Spec 086) now fully exercised — Leonardo can spec screens with confidence in native implementations

### Native Implementation Modernization (Spec 093)
Systemic patterns identified during Spec 091 resolved across the codebase:
- **iOS**: Cubic bezier easing replaced with spring animations (platform-native)
- **Android**: Ripple (icon-only buttons) vs blend (shaped surfaces) documented as deliberate platform-appropriate design decision
- All 7 correctness properties verified
- 3 stale test assertions updated to match Spec 091 fixes

### Application MCP: rebuild_index Tool
New tool allows reindexing the component catalog without restarting the MCP server. Matches the Docs MCP's existing `rebuild_index` capability. Resolves stale index issues observed during Specs 086, 091, and readiness verification.

### Contract Catalog Growth
5 new behavioral contract concepts from Progress-Bar-Base added to the catalog (131 → 136 total).

---

## Stats

- 311 test suites, 8,138 tests passing
- 34 production components (33 → 34)
- 136 behavioral contract concepts (131 → 136)
- 9 experience patterns, 4 layout templates
- 85 steering documents indexed

## Gap Report Progress

| Status | Count |
|--------|-------|
| Complete | 7 (#0, #2, #3, #16, #17, #18, #19) |
| Reframed | 3 (#4, #7, #13) |
| Not started | 1 (#1) |
| Dependent | 1 (#9) |
| Deferred | 1 (#11) |
| Closed | 7 (#5, #6, #8, #10, #12, #14, #15) |
