# Android Findings: Phase 0 — Mechanical Pattern Detection

**Date**: 2026-04-03
**Agent**: Data
**Scope**: 28 unreviewed components + Nav-TabBar-Base sanity check
**Status**: Phase 0 complete

---

## Cross-Cutting Patterns

### Pattern 1: `.dp` on already-Dp token values — BLOCKING

Spacing semantic tokens in `DesignTokens.android.kt` are already `Dp` (e.g., `val space_grouped_normal = space_100` where `space_100 = 8.dp`). Appending `.dp` is either a compile error or a double-conversion.

| File | Line | Code |
|------|------|------|
| Button-VerticalList-Set | 539 | `Arrangement.spacedBy(DesignTokens.space_grouped_normal.dp)` |
| Nav-Header-Base | 49 | `val minHeight = DesignTokens.tapAreaRecommended.dp` |

**Note**: Nav-Header-Base is already reviewed (Spec 088) — this was introduced during the fix pass. Needs correction.

**Fix pattern**: Remove `.dp` suffix when referencing spacing/tap-area semantic tokens.

### Pattern 2: `RoundedCornerShape(50)` instead of radius token — BLOCKING

All 3 Chip family components use hard-coded `RoundedCornerShape(50)` for pill shape instead of referencing `DesignTokens.radius_full` or `DesignTokens.radius_half`.

| File | Line | Code |
|------|------|------|
| Chip-Base | 284 | `shape = RoundedCornerShape(50)` |
| Chip-Filter | 284 | `shape = RoundedCornerShape(50)` |
| Chip-Input | 227 | `shape = RoundedCornerShape(50)` |

**Fix pattern**: Replace with `RoundedCornerShape(DesignTokens.radius_half)` or equivalent token-driven shape.

### Pattern 3: `tween()` without explicit easing — NON-BLOCKING

Several components use `tween(durationMillis = ...)` without specifying `easing =`. Defaults to `FastOutSlowInEasing` which matches `DesignTokens.Easing.EasingStandard` — correct by coincidence, not by reference. If the easing token changes, these components won't track it.

| File | Calls without easing |
|------|---------------------|
| Input-Radio-Base | 3 |
| Input-Checkbox-Base | 2 |
| Progress-Bar-Base | 1 (already flagged, Spec 090) |
| Nav-Header-Page | 1 (already flagged, Spec 088) |

**Excluded**: Button-VerticalList-Item `tween(0)` — instant animation, easing irrelevant.
**Positive examples**: Nav-SegmentedChoice-Base (4 calls, all with explicit easing), Nav-TabBar-Base (1 call, explicit easing).

**Fix pattern**: Add `easing = DesignTokens.Easing.EasingStandard` (or appropriate easing token) to all `tween()` calls.

### Pattern 4: Hard-coded color — BLOCKING

One instance of hard-coded hex color instead of token reference.

| File | Line | Code |
|------|------|------|
| Container-Base | 663 | `Color(0xFFB026FF) /* purple300 */` |

Should reference `DesignTokens.accessibility_focus_color` (which is cyan300, not purple300 — this may also be the wrong color value).

**Fix pattern**: Replace with `DesignTokens.accessibility_focus_color` and verify the intended color.

### Pattern 5: Material `Divider` usage — NON-BLOCKING

Material `Divider` composable used instead of token-driven `Box` with height/background. Introduces Material theme dependency.

| File | Instances |
|------|-----------|
| Button-Icon | 5 (in preview functions) |
| Nav-TabBar-Base | 1 (in component) |

**Note**: Button-Icon's 5 instances are in `@Preview` functions — non-blocking regardless. Nav-TabBar-Base's instance is in the component itself.

**Fix pattern**: Replace with `Box(Modifier.fillMaxWidth().height(tokenWidth).background(tokenColor))`.

### Pattern 6: No new patterns discovered

All `MutableInteractionSource()` calls are wrapped in `remember` (13/13). No recomposition safety issues detected mechanically. No hard-coded font sizes, no View-system patterns in Compose code.

---

## Phase 0 Summary

| Pattern | Severity | Components Affected | Count |
|---------|----------|-------------------|-------|
| `.dp` on Dp tokens | Blocking | 2 (VerticalList-Set, Nav-Header-Base*) | 2 |
| Hard-coded `RoundedCornerShape(50)` | Blocking | 3 (Chip family) | 3 |
| Hard-coded color | Blocking | 1 (Container-Base) | 1 |
| `tween()` without easing | Non-blocking | 4 (Radio, Checkbox, ProgressBar*, HeaderPage*) | 7 calls |
| Material `Divider` | Non-blocking | 2 (Button-Icon previews, TabBar) | 6 |

\* = already flagged in prior spec reviews

**Blocking issues**: 6 across 5 components (after deduplicating already-reviewed components)
**Non-blocking issues**: 13 calls across 5 components

Phase 0 issue rate is lower than the ~2.5/file estimate from Spec 088. Mechanical patterns account for ~6 blocking issues. Per-component contract review (Phase 1) will likely surface more — particularly accessibility semantics gaps that can't be detected by grep.

---

## Combined Totals (Phase 0 + Phase 1)

| Severity | Issues | Components |
|----------|--------|-----------|
| Blocking | 8 | 7 (Container-Base, Container-Card-Base, Button-VerticalList-Set, Chip-Base, Chip-Filter, Chip-Input, Nav-Header-Base*) |
| Non-blocking | 11 | 7 |

\* Nav-Header-Base `.dp` on Dp introduced during Spec 088 fix pass.

---

## Per-Component Findings

### Container Family

#### Container-Base
- **BLOCKING: Hard-coded focus color** — `Color(0xFFB026FF)` (purple300) instead of `DesignTokens.accessibility_focus_color` (cyan300). Also potentially the wrong color — the accessibility focus token is cyan, not purple. (Phase 0 Pattern 4)
- **BLOCKING: Hard-coded corner radius floats** — `getContainerBaseCornerRadiusPx()` returns `4f`, `8f`, `16f` instead of converting token values. These should derive from the same radius tokens used in `getContainerBaseRoundedCornerShape()`.
- **NON-BLOCKING: `resolveContainerBaseColorToken()` returns `Color.Gray` placeholder** — Token resolution function is stubbed. Likely works via a different mechanism at runtime, but the stub is misleading.
- **NON-BLOCKING: Verbose documentation** — 180+ lines of KDoc and examples before the composable. Functional but heavy for a primitive.

#### Container-Card-Base
- **BLOCKING: `CardRole.Link -> Role.Button`** — Line 365 maps Link role to `Role.Button`. Compose doesn't have `Role.Link` natively, but mapping Link to Button is semantically wrong — TalkBack would announce "button" for what should be a link. Should use a custom semantics approach or document the limitation.
- **BLOCKING: Hard-coded corner radius floats** — `getCardCornerRadiusPx()` returns `8f`, `16f` instead of deriving from tokens. Same pattern as Container-Base.
- **NON-BLOCKING: Duplicated directional padding logic** — `calculateCardDirectionalPadding()` duplicates `calculateContainerBaseDirectionalPadding()` logic. The Card delegates to Base for rendering but has its own padding calculation. Not a correctness issue but a maintenance concern.

### Button Family

#### Button-CTA
- **NON-BLOCKING: `borderWidth.dp` pattern** — Line 182: `styleConfig.borderWidth.dp`. Need to verify if `borderWidth` in the style config is `Float` or `Dp`. If it's already `Dp` from token reference, this is the same `.dp` on `Dp` issue.
- **NON-BLOCKING: `iconTextSpacing.dp` pattern** — Line 197: `sizeConfig.iconTextSpacing.dp`. Same verification needed.
- Contract compliance: Accessibility semantics present, icon marked decorative, size variants use tokens. Looks solid.

#### Button-Icon
- **NON-BLOCKING: Material `Divider` in previews** — 5 instances, all in `@Preview` functions. No production impact.
- Contract compliance: `contentDescription` from `ariaLabel`, icon sizes from tokens, component tokens from `ButtonIconTokens`. Clean.

#### Button-VerticalList-Item
- Contract compliance: Semantics present (`contentDescription`, `Role.Button`), token-driven styling. Clean.

#### Button-VerticalList-Set
- **BLOCKING: `.dp` on already-Dp token** — Line 539: `DesignTokens.space_grouped_normal.dp`. (Phase 0 Pattern 1)
- Contract compliance: Group semantics present, selection state handling, accessibility labels. Otherwise solid.

### Icon Family

#### Icon-Base
- Contract compliance: Decorative (`contentDescription = null`), icon sizes from tokens, optical balance via blend utilities. Clean. No issues found.

### FormInput Family

#### Input-Text-Base
- Reduced motion handling present. Float label animation uses token-driven duration.
- Contract compliance: Semantics present, helper text accessible. Clean.

#### Input-Text-Email, Input-Text-Password, Input-Text-PhoneNumber
- These are thin wrappers around Input-Text-Base with input type configuration. No Android-specific issues beyond what Input-Text-Base has.
- Input-Text-Password: Toggle button has `contentDescription` for show/hide state. Good.

#### Input-Checkbox-Base
- **NON-BLOCKING: `tween()` without explicit easing** — 2 calls. (Phase 0 Pattern 3)
- Reduced motion: Not checked — no `ANIMATOR_DURATION_SCALE` reference. Animations will run regardless of reduced motion setting. Worth verifying against contracts.
- Contract compliance: `clearAndSetSemantics` with label, role, and state. Solid.

#### Input-Checkbox-Legal
- Thin wrapper. `clearAndSetSemantics` with "Required field" for required state. Clean.

#### Input-Radio-Base
- **NON-BLOCKING: `tween()` without explicit easing** — 3 calls. (Phase 0 Pattern 3)
- Reduced motion: Not checked — same gap as Input-Checkbox-Base.
- Contract compliance: `Role.RadioButton`, `contentDescription` with label. Solid.

#### Input-Radio-Set
- `selectableGroup()` semantics for TalkBack group announcement. Clean.

### Badge Family

#### Badge-Count-Base
- Contract compliance: `contentDescription` with display text. Clean.

#### Badge-Count-Notification
- Contract compliance: `contentDescription` with announcement text. Clean.

#### Badge-Label-Base
- Contract compliance: `contentDescription` for truncated labels. Icon sizes from tokens. Clean.

### Chip Family

#### Chip-Base
- **BLOCKING: Hard-coded `RoundedCornerShape(50)`** — Should reference radius token. (Phase 0 Pattern 2)
- Contract compliance: `Role.Button`, `contentDescription` with label. Otherwise solid.

#### Chip-Filter
- **BLOCKING: Hard-coded `RoundedCornerShape(50)`** — Same as Chip-Base. (Phase 0 Pattern 2)
- Contract compliance: Same as Chip-Base. Solid.

#### Chip-Input
- **BLOCKING: Hard-coded `RoundedCornerShape(50)`** — Same pattern. (Phase 0 Pattern 2)
- Contract compliance: `Role.Button`, `contentDescription` with dismiss label. Solid.

### Avatar Family

#### Avatar-Base
- Contract compliance: `contentDescription` from `accessibilityLabel`, icon sizes from tokens, size variants from tokens. Clean. No issues found.

### Navigation Family

#### Nav-SegmentedChoice-Base
- Reduced motion handling present. All `tween()` calls have explicit easing tokens. This is the gold standard in the codebase.
- Contract compliance: `Role.Tab`, `contentDescription` with segment state, `selectableGroup`. Excellent.

#### Nav-TabBar-Base (Sanity Check)
- **NON-BLOCKING: Material `Divider` in component** — Line 207: `Divider(color = NavTabBarTokens.borderColor, thickness = NavTabBarTokens.borderWidth.dp)`. The `.dp` on `borderWidth` needs verification — if `borderWidth` is already `Dp`, this is the same pattern.
- Reduced motion handling present. `selectableGroup()` for tab list. Easing token referenced explicitly.
- Overall: In better shape than expected for a pre-Kenya/Data component. Minor convention issues only.

### ProgressIndicator Family

#### Progress-Indicator-Node-Base
- Reduced motion handling present (`snap()` fallback). `clearAndSetSemantics` for decorative primitive. Clean.

#### Progress-Indicator-Connector-Base
- `clearAndSetSemantics` for decorative primitive. `Arrangement.spacedBy(0.dp)` is fine (literal zero). Clean.

#### Progress-Indicator-Label-Base
- `clearAndSetSemantics` for decorative primitive. Clean.

#### Progress-Pagination-Base
- Reduced motion handling present. `contentDescription` with label. Clean.

#### Progress-Stepper-Base
- `progressBarRangeInfo` for TalkBack progress announcement. `contentDescription` present. Clean.

#### Progress-Stepper-Detailed
- `contentDescription` with step-level accessibility labels. Clean.

### Spec 092 Token Migration Verification

All 6 affected components verified — icon sizing tokens (`icon_size_050/075/100`) correctly referenced:
- Button-Icon: ✅
- Progress-Indicator-Node-Base: ✅ (uses icon within node)
- Avatar-Base: ✅
- Input-Checkbox-Base: ✅
- Input-Radio-Base: ✅
- Nav-TabBar-Base: ✅

No visual change expected from spacing→sizing migration. Token references are correct.

---

## Phase 1 Summary

| Component | Blocking | Non-Blocking | Notes |
|-----------|----------|-------------|-------|
| Container-Base | 2 | 2 | Focus color wrong + hard-coded; corner radius hard-coded |
| Container-Card-Base | 2 | 1 | Link→Button role mapping; corner radius hard-coded |
| Button-CTA | 0 | 2 | `.dp` verification needed on style config values |
| Button-Icon | 0 | 1 | Divider in previews only |
| Button-VerticalList-Item | 0 | 0 | Clean |
| Button-VerticalList-Set | 1 | 0 | `.dp` on Dp token (Phase 0) |
| Icon-Base | 0 | 0 | Clean |
| Input-Text-Base | 0 | 0 | Clean |
| Input-Text-Email | 0 | 0 | Clean |
| Input-Text-Password | 0 | 0 | Clean |
| Input-Text-PhoneNumber | 0 | 0 | Clean |
| Input-Checkbox-Base | 0 | 2 | Missing easing; no reduced motion check |
| Input-Checkbox-Legal | 0 | 0 | Clean |
| Input-Radio-Base | 0 | 2 | Missing easing; no reduced motion check |
| Input-Radio-Set | 0 | 0 | Clean |
| Badge-Count-Base | 0 | 0 | Clean |
| Badge-Count-Notification | 0 | 0 | Clean |
| Badge-Label-Base | 0 | 0 | Clean |
| Chip-Base | 1 | 0 | Hard-coded shape (Phase 0) |
| Chip-Filter | 1 | 0 | Hard-coded shape (Phase 0) |
| Chip-Input | 1 | 0 | Hard-coded shape (Phase 0) |
| Avatar-Base | 0 | 0 | Clean |
| Nav-SegmentedChoice-Base | 0 | 0 | Gold standard — explicit easing, reduced motion |
| Nav-TabBar-Base | 0 | 1 | `.dp` verification on borderWidth; Divider |
| Progress-Indicator-Node-Base | 0 | 0 | Clean |
| Progress-Indicator-Connector-Base | 0 | 0 | Clean |
| Progress-Indicator-Label-Base | 0 | 0 | Clean |
| Progress-Pagination-Base | 0 | 0 | Clean |
| Progress-Stepper-Base | 0 | 0 | Clean |
| Progress-Stepper-Detailed | 0 | 0 | Clean |

**Totals: 8 blocking issues across 7 components, 11 non-blocking across 7 components.**

### New Cross-Cutting Patterns Discovered in Phase 1

| Pattern | Components | Severity |
|---------|-----------|----------|
| Hard-coded corner radius in `getCornerRadiusPx()` helpers | Container-Base, Container-Card-Base | Blocking |
| Missing reduced motion check on animated components | Input-Checkbox-Base, Input-Radio-Base | Non-blocking (animations are subtle) |
| `CardRole.Link -> Role.Button` semantic mismatch | Container-Card-Base | Blocking |
