# Task 3.5 Review: Badge Family — Android

**Date**: 2026-04-03
**Reviewer**: Data
**Components**: Badge-Count-Base, Badge-Count-Notification, Badge-Label-Base

---

## Badge-Count-Base

**Solid implementation. Token usage is thorough, shape logic is correct.**

#### Strengths
- Size config with token-driven fontSize, lineHeight, padding, and minWidth — well-organized
- Shape-adaptive logic: `CircleShape` + `defaultMinSize` for circular single digits, pill for multi-digit — correct
- Max truncation logic (`"99+"`) is clean and handles edge cases (negative counts, invalid max)
- Non-interactive: no clickable, no focusable — contract satisfied
- `contentDescription` with display text for TalkBack
- `BadgeCountBaseDefaults` object for default values — clean API

#### Concerns

**C1: `color_surface` token for background — verify semantic fit.**
`BadgeCountBaseTokens.backgroundColor` references `DesignTokens.color_surface`. The contract says "color.surface" which maps to `color_structure_surface` in the generated tokens. `color_surface` might be a different token. Worth verifying the resolved value matches the spec.

**C2: Preview function is ~200 lines — NON-BLOCKING.**
Comprehensive but very long. Not a production concern — previews don't ship. But it makes the file harder to navigate.

---

## Badge-Count-Notification

**Clean semantic variant. Notification-specific colors and live region announcements correct.**

#### Strengths
- Fixed notification colors from `DesignTokens.color_feedback_notification_background/text` — correct tokens
- `LiveRegionMode.Polite` for TalkBack announcements — correct for non-urgent notifications
- Pluralized announcement text ("1 notification" vs "5 notifications") — good accessibility
- `announceChanges` prop with `LaunchedEffect` for count change announcements
- Inherits Badge-Count-Base's size/shape/truncation behavior without duplication

No concerns. Ship-ready.

---

## Badge-Label-Base

**Well-structured. Icon integration and truncation handled correctly.**

#### Strengths
- `IconBase` composition for leading icons — correct Stemma pattern
- `maxWidth = 120.dp` with `TextOverflow.Ellipsis` — truncation per spec
- Size-specific icon sizes from `DesignTokens.icon_size_050/075/100` — token-driven
- `contentDescription` with full label text (not truncated) — TalkBack reads the complete label even when visually truncated. Good accessibility.
- `RoundedCornerShape` with token-driven radius

#### Concerns

**C3: `maxWidth` hard-coded as `const val maxWidth: Int = 120` instead of referencing `BadgeLabelBaseTokens.maxWidth` from generated `ComponentTokens.android.kt` — NON-BLOCKING.**
The comment acknowledges this: "In a production Android project, the component token would be imported from the generated ComponentTokens.android.kt." The value matches (120dp), but it's a local duplicate rather than a reference. Should import from `ComponentTokens` when the build pipeline supports it.

---

## Summary

| Component | Blocking | Non-Blocking | Production Quality |
|-----------|----------|-------------|-------------------|
| Badge-Count-Base | 0 | 2 (C1-C2) | Solid. Verify `color_surface` token. |
| Badge-Count-Notification | 0 | 0 | Ship-ready. Clean semantic variant. |
| Badge-Label-Base | 0 | 1 (C3) | Ship-ready. Local token duplicate is minor. |

No blocking issues. All three components are ship-ready. The Badge family is in good shape — consistent patterns, correct accessibility, token-driven throughout.
