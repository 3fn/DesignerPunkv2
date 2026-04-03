# Task 3.1 Review: Container Family — Android

**Date**: 2026-04-03
**Reviewer**: Data
**Components**: Container-Base, Container-Card-Base
**Status**: Fixes verified, production-quality assessment below

---

## Fix Verification

### Container-Base

| Issue | Status | Notes |
|-------|--------|-------|
| Hard-coded corner radius `4f/8f/16f` | ✅ Fixed | Now references `DesignTokens.radius050/100/200` |
| Hard-coded focus color `0xFFB026FF` | ✅ Fixed | Now references `DesignTokens.accessibilityFocusColor` |

### Container-Card-Base

| Issue | Status | Notes |
|-------|--------|-------|
| Hard-coded corner radius `8f/16f` | ✅ Fixed | Now references `DesignTokens.radius100/200` |
| `CardRole.Link -> Role.Button` | ❌ Not fixed | Still maps Link to Button on line 365 |

### New Issues Found During Review

**F1: Stale comment on Container-Base focus color — NON-BLOCKING.**
Lines 659-660 still say "purple300 - primary brand color." The token is cyan300. Code is correct, comment is misleading.

**F2: `CardRole.Link -> Role.Button` — BLOCKING (carried over).**
TalkBack announces "button" for what should be a link. Compose lacks `Role.Link`, but the current mapping is actively wrong. Options: document the limitation with a TODO, use `contentDescription` suffix for context, or remove `CardRole.Link` from the Android enum.

**F3: Focus offset/width reference unresolved symbols — NEEDS VERIFICATION.**
`accessibilityFocusOffset = space025` and `accessibilityFocusWidth = borderWidth200` reference symbols without `DesignTokens.` prefix. Must be defined elsewhere in scope. Not new, but dependency chain is opaque.

---

## Production-Quality Assessment

### Container-Base

**Structurally sound, showing its age. Functional but not the quality bar set by newer components.**

#### Strengths
- Padding override hierarchy (individual > axis > uniform) correctly implemented with `PaddingValues`, respects `LocalLayoutDirection` for RTL
- Hover state via `collectIsHoveredAsState()` with blend utilities — clean, cross-platform consistent
- Focus indicator via `drawBehind` with accessibility tokens — correct Compose approach for custom focus rings
- `MutableInteractionSource` properly remembered

#### Concerns

**C1: String-based token resolution is fragile.**
`background`, `shadow`, `borderColor`, and `opacity` props are all `String?`. Consumer passes `"color.surface"` and the component resolves at runtime via `resolveContainerBaseColorToken()` — which returns `Color.Gray` as a placeholder. Either there's a runtime resolution mechanism not visible in this file, or color resolution is broken. Every other component uses typed enums or direct token references. This is an outlier and a maintenance risk.

**C2: Massive file size (~670 lines).**
~180 lines of KDoc before the composable starts. Compare to Nav-Header-Base at ~110 lines total. Mapping functions (`mapContainerBasePaddingToDp`, `getContainerBaseRoundedCornerShape`, etc.) could live in a separate file. Hard to navigate.

**C3: `Log.w` for conflicting props instead of `require()`.**
Line 222 logs a warning when both `layering` and `shadow` are provided. This is a development-time concern that should be `require()` or a lint warning, not a runtime log lost in production logcat. Inconsistent with fail-loudly philosophy (Progress-Bar-Base uses `require()`).

**C4: Focus indicator references unresolved symbols.**
`space025`, `borderWidth200` referenced without `DesignTokens.` prefix. Dependency chain is opaque — not clear where these resolve from.

### Container-Card-Base

**Better structured. Curated enum pattern is genuinely good architecture.**

#### Strengths
- Curated enum subsets (CardPadding, CardBackground, etc.) constrain API surface to card-appropriate values while delegating to Container-Base. Strong Stemma architecture.
- Two-track approach (Card owns interaction, Base owns layout) is well-documented and correct
- Token constants section at bottom is well-organized with clear references
- Preview function demonstrates multiple configurations — useful for visual verification

#### Concerns

**C5: `CardRole.Link -> Role.Button` — blocking.**
Already flagged. Consumer who sets `role = CardRole.Link` gets incorrect TalkBack behavior.

**C6: Duplicated padding calculation.**
`calculateCardDirectionalPadding()` duplicates logic from `calculateContainerBaseDirectionalPadding()`. Card delegates to Base for rendering but has its own calculation for previews/tests. Two implementations of the same hierarchy rules — if rules change, both need updating.

**C7: Interaction overlay applied outside ContainerBase.**
`Box(modifier = interactionModifier.background(interactionOverlayColor))` wraps ContainerBase. The hover/press darkening is a separate layer, not blended into the background. This overlay doesn't respect the card's border radius — darkening would be rectangular while the card is rounded. Worth visual verification.

**C8: `indication = null` on clickable.**
Disables Material ripple (intentional — DesignerPunk uses blend feedback). But if blend utilities have any issue, the card feels dead on press. Zero fallback visual feedback.

---

## Summary

| Component | Fixes | Remaining Blocking | Production Quality |
|-----------|-------|-------------------|-------------------|
| Container-Base | 2/2 ✅ | 0 | Functional, not modern. String-based tokens and file size are tech debt. |
| Container-Card-Base | 1/2 | 1 (Link→Button) | Good architecture. Link role and overlay clipping need attention. |

**Can we ship product screens using these?** Yes — with the caveat that Link role mapping needs resolution and Container-Base's string-based color resolution needs verification.

**Are these the quality bar we want?** Container-Card-Base is close. Container-Base would benefit from a modernization pass after product launch, aligning with patterns from Nav-SegmentedChoice-Base and newer components.
